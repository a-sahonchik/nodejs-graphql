import { FastifyInstance } from 'fastify';
import { assertPostExists } from '../asserts';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';

const getPostById = async (postId: string, fastify: FastifyInstance): Promise<PostEntity> => {
  const post = await fastify.db.posts.findOne({ key: 'id', equals: postId });

  await assertPostExists(post, fastify);

  return post!;
};

export { getPostById };
