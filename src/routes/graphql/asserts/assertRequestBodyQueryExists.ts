import { FastifyInstance } from 'fastify';
import { errorMessage } from '../../../messages/errorMessages';

const assertRequestBodyQueryExists = async (query: string | undefined, fastify: FastifyInstance): Promise<void> => {
  if (query === undefined) {
    throw fastify.httpErrors.badRequest(errorMessage.NO_QUERY_IN_REQUEST);
  }
};

export { assertRequestBodyQueryExists };
