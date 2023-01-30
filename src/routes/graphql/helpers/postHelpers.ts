import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';
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

const getUserPostsDataLoader = async (fastify: FastifyInstance) => new DataLoader(async (userIds) => {
  const posts = await fastify.db.posts.findMany();

  return userIds.map((userId) => posts.filter((post) => post.userId === userId));
});

export {
  getPostById,
  createPostFromInput,
  updatePostFromInput,
  getUserPostsDataLoader,
};
