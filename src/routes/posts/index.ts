import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
      const posts = fastify.db.posts.findMany();

      return posts;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
        const post = await fastify.db.posts.findOne({ key: 'id', equals: request.params.id });

        if (post === null) {
            throw fastify.httpErrors.notFound('Post not found');
        }

        return post;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
        const postAuthor = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });

        if (postAuthor === null) {
            throw fastify.httpErrors.badRequest('Post author not found');
        }

        const post = await fastify.db.posts.create(request.body);

        return post;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
        const post = await fastify.db.posts.findOne({ key: 'id', equals: request.params.id });

        if (post === null) {
            throw fastify.httpErrors.badRequest('Post not found');
        }

        const deletedPost = await fastify.db.posts.delete(request.params.id);

        return deletedPost;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
        try {
            const patchedPost = await fastify.db.posts.change(request.params.id, request.body);

            return patchedPost;
        } catch (error: any) {
            throw fastify.httpErrors.badRequest(error);
        }
    }
  );
};

export default plugin;
