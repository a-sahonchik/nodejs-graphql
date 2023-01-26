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
import {
  GraphQLMemberType,
  GraphQLPost,
  GraphQLProfile,
  GraphQLUser,
  GraphQLUserWithRelatedEntities,
  GraphQLUserWithProfile,
  GraphQLUserWithPosts,
  GraphQLUserWithSubscriptions,
} from './types';

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
      const GraphQLUserWithRelatedEntitiesType = await GraphQLUserWithRelatedEntities(fastify);
      const GraphQLUserWithProfileType = await GraphQLUserWithProfile(fastify);
      const GraphQLUserWithPostsType = await GraphQLUserWithPosts(fastify);
      const GraphQLUserWithSubscriptionsType = await GraphQLUserWithSubscriptions(fastify);

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
            getUsersWithProfile: {
              type: new GraphQLList(GraphQLUserWithProfileType),
              async resolve() {
                const users = await fastify.db.users.findMany();

                return users;
              },
            },
            getUserWithPosts: {
              type: GraphQLUserWithPostsType,
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
            getUsersWithSubscriptions: {
              type: new GraphQLList(GraphQLUserWithSubscriptionsType),
              async resolve() {
                const users = await fastify.db.users.findMany();

                return users;
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
            updateUser: {
              type: GraphQLUser,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
              },
              async resolve(_, args) {
                const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });

                if (user === null) {
                  throw fastify.httpErrors.notFound('User not found');
                }

                const patchedUser = await fastify.db.users.change(args.id, args);

                return patchedUser;
              },
            },
            updateProfile: {
              type: GraphQLProfile,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                avatar: { type: GraphQLString },
                sex: { type: GraphQLString },
                birthday: { type: GraphQLInt },
                country: { type: GraphQLString },
                street: { type: GraphQLString },
                city: { type: GraphQLString },
                memberTypeId: { type: GraphQLString },
              },
              async resolve(_, args) {
                const profile = await fastify.db.profiles.findOne({ key: 'id', equals: args.id });

                if (profile === null) {
                  throw fastify.httpErrors.notFound('Profile not found');
                }

                const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.memberTypeId });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound('Member type not found');
                }

                const patchedProfile = await fastify.db.profiles.change(args.id, args);

                return patchedProfile;
              },
            },
            updatePost: {
              type: GraphQLPost,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: GraphQLString },
                content: { type: GraphQLString },
              },
              async resolve(_, args) {
                const post = await fastify.db.posts.findOne({ key: 'id', equals: args.id });

                if (post === null) {
                  throw fastify.httpErrors.notFound('Post not found');
                }

                const patchedPost = await fastify.db.posts.change(args.id, args);

                return patchedPost;
              },
            },
            updateMemberType: {
              type: GraphQLMemberType,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                discount: { type: GraphQLInt },
                monthPostsLimit: { type: GraphQLInt },
              },
              async resolve(_, args) {
                const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound('Member type not found');
                }

                const patchedMemberType = await fastify.db.memberTypes.change(args.id, args);

                return patchedMemberType;
              },
            },
            subscribeToUser: {
              type: GraphQLUser,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                subscribeToUserId: { type: new GraphQLNonNull(GraphQLID) },
              },
              async resolve(_, args) {
                const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });

                if (user === null) {
                  throw fastify.httpErrors.notFound('User not found');
                }

                const subscribeToUser = await fastify.db.users.findOne({ key: 'id', equals: args.subscribeToUserId });

                if (subscribeToUser === null) {
                  throw fastify.httpErrors.notFound('User to subscribe to not found');
                }

                const userTriesToSubscribeToHimself = args.id === args.subscribeToUserId;

                if (userTriesToSubscribeToHimself) {
                  throw fastify.httpErrors.badRequest('User can\'t subscribe to himself');
                }

                const userAlreadySubscribed = subscribeToUser.subscribedToUserIds.includes(args.id);

                if (userAlreadySubscribed) {
                  throw fastify.httpErrors.badRequest('User already subscribed');
                }

                const patchedUser = await fastify.db.users.change(
                  args.subscribeToUserId,
                  { subscribedToUserIds: [...subscribeToUser.subscribedToUserIds, args.id] },
                );

                return patchedUser;
              },
            },
            unsubscribeFromUser: {
              type: GraphQLUser,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                unsubscribeFromUserId: { type: new GraphQLNonNull(GraphQLID) },
              },
              async resolve(_, args) {
                const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });

                if (user === null) {
                  throw fastify.httpErrors.notFound('User not found');
                }

                const unsubscribeFromUser = await fastify.db.users.findOne({
                  key: 'id',
                  equals: args.unsubscribeFromUserId,
                });

                if (unsubscribeFromUser === null) {
                  throw fastify.httpErrors.notFound('User to unsubscribe from not found');
                }

                const userTriesToUnsubscribeFromHimself = args.id === args.unsubscribeFromUserId;

                if (userTriesToUnsubscribeFromHimself) {
                  throw fastify.httpErrors.badRequest('User can\'t unsubscribe from himself');
                }

                try {
                  const subscribedUserIndex = unsubscribeFromUser.subscribedToUserIds.indexOf(args.id);

                  unsubscribeFromUser.subscribedToUserIds.splice(subscribedUserIndex, 1);

                  const patchedUser = await fastify.db.users.change(
                    args.unsubscribeFromUserId,
                    { subscribedToUserIds: unsubscribeFromUser.subscribedToUserIds },
                  );

                  return patchedUser;
                } catch (error: any) {
                  throw fastify.httpErrors.badRequest(error);
                }
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
