import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';
import {
  assertUserExists,
  assertUserNotSubscribed,
  assertUsersNotTheSame,
  assertUserSubscribed,
} from '../asserts';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { errorMessage } from '../../../messages/errorMessages';

const getUserById = async (userId: string, fastify: FastifyInstance, message?: string): Promise<UserEntity> => {
  const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

  await assertUserExists(user, fastify, message);

  return user!;
};

const createUserFromInput = async (
  input: any,
  fastify: FastifyInstance,
): Promise<UserEntity> => fastify.db.users.create(input);

const updateUserFromInput = async (userId: string, input: any, fastify: FastifyInstance): Promise<UserEntity> => {
  const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

  await assertUserExists(user, fastify);

  return fastify.db.users.change(userId, input);
};

const subscribeToUser = async (
  userId: string,
  subscribeToUserId: string,
  fastify: FastifyInstance,
): Promise<UserEntity> => {
  const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

  await assertUserExists(user, fastify);

  const userToSubscribe = await getUserById(
    subscribeToUserId,
    fastify,
    errorMessage.USER_TO_SUBSCRIBE_NOT_FOUND,
  );

  await assertUsersNotTheSame(
    userId,
    subscribeToUserId,
    fastify,
    errorMessage.USER_SUBSCRIBES_TO_HIMSELF,
  );

  await assertUserNotSubscribed(userId, userToSubscribe, fastify);

  return fastify.db.users.change(
    subscribeToUserId,
    { subscribedToUserIds: [...userToSubscribe.subscribedToUserIds, userId] },
  );
};

const unsubscribeFromUser = async (
  userId: string,
  unsubscribeFromUserId: string,
  fastify: FastifyInstance,
): Promise<UserEntity> => {
  const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

  await assertUserExists(user, fastify);

  const userToUnsubscribe = await getUserById(
    unsubscribeFromUserId,
    fastify,
    errorMessage.USER_TO_UNSUBSCRIBE_NOT_FOUND,
  );

  await assertUserSubscribed(userId, userToUnsubscribe, fastify);

  try {
    const subscribedUserIndex = userToUnsubscribe.subscribedToUserIds.indexOf(userId);

    userToUnsubscribe.subscribedToUserIds.splice(subscribedUserIndex, 1);

    return await fastify.db.users.change(
      unsubscribeFromUserId,
      { subscribedToUserIds: userToUnsubscribe.subscribedToUserIds },
    );
  } catch (error: any) {
    throw fastify.httpErrors.badRequest(error);
  }
};

const getUserSubscribedToDataLoader = async (fastify: FastifyInstance) => new DataLoader<string, UserEntity[]>(
  async (userIds) => {
    const users = await fastify.db.users.findMany();

    return userIds.map((userId) => users.filter((user) => user.subscribedToUserIds.includes(userId)));
  },
);

const getSubscribedToUserDataLoader = async (fastify: FastifyInstance) => new DataLoader(async (userIds) => {
  const users = await fastify.db.users.findMany();

  const usersMap = users.reduce(
    (map, user) => map.set(user.id, user),
    new Map<string, UserEntity>(),
  );

  return userIds.map((userId) => usersMap.get(String(userId)) ?? null);
});

export {
  getUserById,
  createUserFromInput,
  updateUserFromInput,
  subscribeToUser,
  unsubscribeFromUser,
  getUserSubscribedToDataLoader,
  getSubscribedToUserDataLoader,
};
