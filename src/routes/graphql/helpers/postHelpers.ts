import { FastifyInstance } from 'fastify';
import { assertPostExists, assertUserExists } from '../asserts';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';

const getPostById = async (postId: string, fastify: FastifyInstance): Promise<PostEntity> => {
  const post = await fastify.db.posts.findOne({ key: 'id', equals: postId });

  await assertPostExists(post, fastify);

  return post!;
};

const createPostFromInput = async (input: any, fastify: FastifyInstance): Promise<PostEntity> => {
  const user = await fastify.db.users.findOne({ key: 'id', equals: input.userId });

  await assertUserExists(user, fastify);

  return fastify.db.posts.create(input);
};

const updatePostFromInput = async (postId: string, input: any, fastify: FastifyInstance): Promise<PostEntity> => {
  const post = await fastify.db.posts.findOne({ key: 'id', equals: postId });

  await assertPostExists(post, fastify);

  return fastify.db.posts.change(postId, input);
};

export { getPostById, createPostFromInput, updatePostFromInput };
