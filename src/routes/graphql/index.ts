import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import {
  ExecutionResult,
  graphql,
  GraphQLSchema,
  parse,
  validate
} from 'graphql';
import * as depthLimit from 'graphql-depth-limit';
import { graphqlBodySchema } from './schema';
import { getMutation, getQuery } from './graphqlSchema';
import { assertRequestBodyQueryExists } from './asserts';

const DEPTH_LIMIT = 6;

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
    async function (request, reply) {
      const { query, variables } = request.body;

      await assertRequestBodyQueryExists(query, fastify);

      const schema = new GraphQLSchema({
        query: await getQuery(fastify),
        mutation: await getMutation(fastify),
      });

      const errors = validate(schema, parse(query!), [depthLimit(DEPTH_LIMIT)]);

      if (errors.length > 0) {
        const result: ExecutionResult = {
          errors: errors,
          data: null,
        };

        return result;
      }

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
