import { FastifyInstance } from 'fastify';
import { errorMessage } from '../../../messages/errorMessages';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';

const assertUserNotSubscribed = async (
  userId: string,
  subscribeToUser: UserEntity,
  fastify: FastifyInstance,
): Promise<void> => {
  const userAlreadySubscribed = subscribeToUser.subscribedToUserIds.includes(userId);

  if (userAlreadySubscribed) {
    throw fastify.httpErrors.badRequest(errorMessage.USER_ALREADY_SUBSCRIBED);
  }
};

export { assertUserNotSubscribed };
