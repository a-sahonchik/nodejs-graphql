import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { graphqlBodySchema } from './schema';
import { GraphQLMemberType, GraphQLPost, GraphQLProfile, GraphQLUser } from './types';

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
      const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'RootQueryType',
          fields: {
            getUsers: {
              type: new GraphQLList(GraphQLUser),
              resolve() {
                return fastify.db.users.findMany();
              },
            },
            getProfiles: {
              type: new GraphQLList(GraphQLProfile),
              resolve() {
                return fastify.db.profiles.findMany();
              },
            },
            getPosts: {
              type: new GraphQLList(GraphQLPost),
              resolve() {
                return fastify.db.posts.findMany();
              },
            },
            getMemberTypes: {
              type: new GraphQLList(GraphQLMemberType),
              resolve() {
                return fastify.db.memberTypes.findMany();
              },
            },
          },
        }),
      });

      // @ts-ignore
      const result = await graphql({ schema, source: request.body.query });

      return result;
    },
  );
};

export default plugin;
