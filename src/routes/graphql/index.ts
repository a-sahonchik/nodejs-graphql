import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import {
  graphql,
  GraphQLID, GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { graphqlBodySchema } from './schema';
import { GraphQLMemberType, GraphQLPost, GraphQLProfile, GraphQLUser } from './types';
import { GraphQLUserWithRelatedEntities } from './types/GraphQLUserWithRelatedEntities';

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

      const GraphQLUserWithRelatedEntitiesType = await GraphQLUserWithRelatedEntities(fastify);

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
                id: { type: GraphQLID },
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
                id: { type: GraphQLID },
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
                id: { type: GraphQLID },
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
                id: { type: GraphQLID },
              },
              async resolve(_, args) {
                const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound('Member type not found');
                }

                return memberType;
              },
            },
            getUsersWithRelatedEntities: {
              type: new GraphQLList(GraphQLUserWithRelatedEntitiesType),
              async resolve() {
                const users = await fastify.db.users.findMany();

                return users;
              },
            },
            getUserWithRelatedEntities: {
              type: GraphQLUserWithRelatedEntitiesType,
              args: {
                id: { type: GraphQLID },
              },
              async resolve(_, args) {
                const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });

                if (user === null) {
                  throw fastify.httpErrors.notFound('User not found');
                }

                return user;
              },
            },
          },
        }),
        mutation: new GraphQLObjectType({
          name: 'RootMutationType',
          fields: {
            createUser: {
              type: GraphQLUser,
              args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
              },
              async resolve(_, args) {
                const user = await fastify.db.users.create({
                  firstName: args.firstName,
                  lastName: args.lastName,
                  email: args.email,
                });

                return user;
              },
            },
            createProfile: {
              type: GraphQLProfile,
              args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
                avatar: { type: new GraphQLNonNull(GraphQLString) },
                sex: { type: new GraphQLNonNull(GraphQLString) },
                birthday: { type: new GraphQLNonNull(GraphQLInt) },
                country: { type: new GraphQLNonNull(GraphQLString) },
                street: { type: new GraphQLNonNull(GraphQLString) },
                city: { type: new GraphQLNonNull(GraphQLString) },
              },
              async resolve(_, args) {
                const user = await fastify.db.users.findOne({ key: 'id', equals: args.userId });

                if (user === null) {
                  throw fastify.httpErrors.notFound('User not found');
                }

                const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.memberTypeId });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound('Member type not found');
                }

                const userAlreadyHasAProfile = await fastify.db.profiles.findOne(
                  { key: 'userId', equals: args.userId },
                );

                if (userAlreadyHasAProfile !== null) {
                  throw fastify.httpErrors.badRequest('User already has a profile');
                }

                const profile = await fastify.db.profiles.create({
                  userId: args.userId,
                  memberTypeId: args.memberTypeId,
                  avatar: args.avatar,
                  sex: args.sex,
                  birthday: args.birthday,
                  country: args.country,
                  street: args.street,
                  city: args.city,
                });

                return profile;
              },
            },
            createPost: {
              type: GraphQLPost,
              args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                content: { type: new GraphQLNonNull(GraphQLString) },
              },
              async resolve(_, args) {
                const user = await fastify.db.users.findOne({ key: 'id', equals: args.userId });

                if (user === null) {
                  throw fastify.httpErrors.notFound('User not found');
                }

                const post = await fastify.db.posts.create({
                  userId: args.userId,
                  title: args.title,
                  content: args.content,
                });

                return post;
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
