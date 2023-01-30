import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { errorMessage } from '../../../messages/errorMessages';

const assertUserExists = async (
  user: UserEntity | null,
  fastify: FastifyInstance,
  message: string = errorMessage.USER_NOT_FOUND,
): Promise<void> => {
  if (user === null) {
    throw fastify.httpErrors.notFound(message);
  }
};

export { assertUserExists };
