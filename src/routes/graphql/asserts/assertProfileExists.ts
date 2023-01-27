import { FastifyInstance } from 'fastify';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { errorMessage } from '../../../messages/errorMessages';

const assertProfileExists = async (
  profile: ProfileEntity | null,
  fastify: FastifyInstance,
  message: string = errorMessage.PROFILE_NOT_FOUND,
): Promise<void> => {
  if (profile === null) {
    throw fastify.httpErrors.notFound(message);
  }
};

export { assertProfileExists };
