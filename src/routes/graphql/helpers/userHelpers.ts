import { FastifyInstance } from 'fastify';
import { assertUserExists } from '../asserts';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';

const getUserById = async (userId: string, fastify: FastifyInstance, message?: string): Promise<UserEntity> => {
  const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

  await assertUserExists(user, fastify, message);

  return user!;
};

export { getUserById };
