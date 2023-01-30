import { FastifyInstance } from 'fastify';
import { errorMessage } from '../../../messages/errorMessages';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';

const assertUserSubscribed = async (
  userId: string,
  userToUnsubscribe: UserEntity,
  fastify: FastifyInstance,
): Promise<void> => {
  const userSubscribed = userToUnsubscribe.subscribedToUserIds.includes(userId);

  if (!userSubscribed) {
    throw fastify.httpErrors.badRequest(errorMessage.USER_NOT_SUBSCRIBED);
  }
};

export { assertUserSubscribed };
