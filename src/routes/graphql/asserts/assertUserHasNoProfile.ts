import { FastifyInstance } from 'fastify';
import { errorMessage } from '../../../messages/errorMessages';

const assertUserHasNoProfile = async (userId: string, fastify: FastifyInstance): Promise<void> => {
  const userAlreadyHasAProfile = await fastify.db.profiles.findOne(
    { key: 'userId', equals: userId },
  );

  if (userAlreadyHasAProfile !== null) {
    throw fastify.httpErrors.badRequest(errorMessage.USER_ALREADY_HAS_PROFILE);
  }
};

export { assertUserHasNoProfile };
