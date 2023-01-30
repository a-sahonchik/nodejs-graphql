import { FastifyInstance } from 'fastify';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { errorMessage } from '../../../messages/errorMessages';

const assertPostExists = async (
  post: PostEntity | null,
  fastify: FastifyInstance,
  message: string = errorMessage.POST_NOT_FOUND,
): Promise<void> => {
  if (post === null) {
    throw fastify.httpErrors.notFound(message);
  }
};

export { assertPostExists };
