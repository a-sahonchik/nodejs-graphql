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
      const { query, variables } = request.body;

      await assertRequestBodyQueryExists(query, fastify);

      const schema = new GraphQLSchema({
        query: await getQuery(fastify),
        mutation: await getMutation(fastify),
      });

      return graphql({
        schema,
        source: query!,
        variableValues: variables,
        contextValue: fastify,
      });
    },
  );
};

export default plugin;
