import { FastifyInstance } from 'fastify';

const assertUsersNotTheSame = async (
  userId: string,
  subscribeToUserId: string,
  fastify: FastifyInstance,
  message: string,
): Promise<void> => {
  const userTriesToSubscribeToHimself = userId === subscribeToUserId;

  if (userTriesToSubscribeToHimself) {
    throw fastify.httpErrors.badRequest(message);
  }
};

export { assertUsersNotTheSame };
