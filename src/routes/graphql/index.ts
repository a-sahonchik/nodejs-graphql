import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema } from 'graphql';
import { graphqlBodySchema } from './schema';
import { getMutation, getQuery } from './graphqlSchema';
import { assertRequestBodyQueryExists } from './asserts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request) {
      await assertRequestBodyQueryExists(request.body.query, fastify);

      const schema = new GraphQLSchema({
        query: await getQuery(fastify),
        mutation: await getMutation(fastify),
      });

      const result = await graphql({ schema, source: request.body.query! });

      return result;
    },
  );
};

export default plugin;
