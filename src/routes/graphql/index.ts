import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { graphqlBodySchema } from './schema';
import { GraphQLMemberType, GraphQLPost, GraphQLProfile, GraphQLUser } from './types';

let i = 1;

// @ts-ignore
const prepareTestData = async (fastify) => {
  const testUser = await fastify.db.users.create({
    firstName: `User ${i}`,
    lastName: `LastName ${i}`,
    email: `user${i}@gmail.com`,
  });

  await fastify.db.profiles.create({
    userId: testUser.id,
    memberTypeId: 'basic',
    avatar: 'avatar',
    sex: 'sometimes',
    birthday: 5345345345,
    country: 'BY',
    street: 'Street',
    city: 'Minsk',
  });

  await fastify.db.posts.create({
    userId: testUser.id,
    title: `Title ${i}`,
    content: 'Content',
  });
};

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
      if (i <= 5) {
        await prepareTestData(fastify);
      }

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
            getUser: {
              type: GraphQLUser,
              args: {
                id: { type: GraphQLString },
              },
              async resolve(_, args) {
                const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });

                if (user === null) {
                  throw fastify.httpErrors.notFound('User not found');
                }

                return user;
              },
            },
            getProfile: {
              type: GraphQLProfile,
              args: {
                id: { type: GraphQLString },
              },
              async resolve(_, args) {
                const profile = await fastify.db.profiles.findOne({ key: 'id', equals: args.id });

                if (profile === null) {
                  throw fastify.httpErrors.notFound('Profile not found');
                }

                return profile;
              },
            },
            getPost: {
              type: GraphQLPost,
              args: {
                id: { type: GraphQLString },
              },
              async resolve(_, args) {
                const post = await fastify.db.posts.findOne({ key: 'id', equals: args.id });

                if (post === null) {
                  throw fastify.httpErrors.notFound('Post not found');
                }

                return post;
              },
            },
            getMemberType: {
              type: GraphQLMemberType,
              args: {
                id: { type: GraphQLString },
              },
              async resolve(_, args) {
                const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound('Member type not found');
                }

                return memberType;
              },
            },
          },
        }),
      });

      // @ts-ignore
      const result = await graphql({ schema, source: request.body.query });

      i += 1;

      return result;
    },
  );
};

export default plugin;
