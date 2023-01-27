import { FastifyInstance } from 'fastify';
import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  GraphQLMemberType,
  GraphQLPost,
  GraphQLProfile,
  GraphQLUser,
} from '../types';
import {
  assertMemberTypeExists,
  assertPostExists,
  assertProfileExists,
  assertUserExists,
  assertUserHasNoProfile,
  assertUserNotSubscribed,
  assertUsersNotTheSame,
} from '../asserts';
import { getUserById } from '../helpers';
import { errorMessage } from '../../../messages/errorMessages';

const getMutation = async (fastify: FastifyInstance): Promise<GraphQLObjectType> => new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createUser: {
      type: GraphQLUser,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => fastify.db.users.create({
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
      }),
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
      resolve: async (_, args) => {
        const user = await fastify.db.users.findOne({ key: 'id', equals: args.userId });

        await assertUserExists(user, fastify);

        const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.memberTypeId });

        await assertMemberTypeExists(memberType, fastify);

        await assertUserHasNoProfile(args.userId, fastify);

        return fastify.db.profiles.create({
          userId: args.userId,
          memberTypeId: args.memberTypeId,
          avatar: args.avatar,
          sex: args.sex,
          birthday: args.birthday,
          country: args.country,
          street: args.street,
          city: args.city,
        });
      },
    },
    createPost: {
      type: GraphQLPost,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        const user = await fastify.db.users.findOne({ key: 'id', equals: args.userId });

        await assertUserExists(user, fastify);

        return fastify.db.posts.create({
          userId: args.userId,
          title: args.title,
          content: args.content,
        });
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
      resolve: async (_, args) => {
        const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });

        await assertUserExists(user, fastify);

        return fastify.db.users.change(args.id, args);
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
      resolve: async (_, args) => {
        const profile = await fastify.db.profiles.findOne({ key: 'id', equals: args.id });

        await assertProfileExists(profile, fastify);

        const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.memberTypeId });

        await assertMemberTypeExists(memberType, fastify);

        return fastify.db.profiles.change(args.id, args);
      },
    },
    updatePost: {
      type: GraphQLPost,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const post = await fastify.db.posts.findOne({ key: 'id', equals: args.id });

        await assertPostExists(post, fastify);

        return fastify.db.posts.change(args.id, args);
      },
    },
    updateMemberType: {
      type: GraphQLMemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        discount: { type: GraphQLInt },
        monthPostsLimit: { type: GraphQLInt },
      },
      resolve: async (_, args) => {
        const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id });

        await assertMemberTypeExists(memberType, fastify);

        return fastify.db.memberTypes.change(args.id, args);
      },
    },
    subscribeToUser: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        subscribeToUserId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, args) => {
        const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });

        await assertUserExists(user, fastify);

        const subscribeToUser = await getUserById(
          args.subscribeToUserId,
          fastify,
          errorMessage.USER_TO_SUBSCRIBE_NOT_FOUND,
        );

        await assertUsersNotTheSame(
          args.id,
          args.subscribeToUserId,
          fastify,
          errorMessage.USER_SUBSCRIBES_TO_HIMSELF,
        );

        await assertUserNotSubscribed(args.id, subscribeToUser, fastify);

        return fastify.db.users.change(
          args.subscribeToUserId,
          { subscribedToUserIds: [...subscribeToUser.subscribedToUserIds, args.id] },
        );
      },
    },
    unsubscribeFromUser: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        unsubscribeFromUserId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, args) => {
        const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });

        await assertUserExists(user, fastify);

        const unsubscribeFromUser = await getUserById(
          args.unsubscribeFromUserId,
          fastify,
          errorMessage.USER_TO_UNSUBSCRIBE_NOT_FOUND,
        );

        await assertUsersNotTheSame(
          args.id,
          args.subscribeToUserId,
          fastify,
          errorMessage.USER_UNSUBSCRIBES_FROM_HIMSELF,
        );

        try {
          const subscribedUserIndex = unsubscribeFromUser.subscribedToUserIds.indexOf(args.id);

          unsubscribeFromUser.subscribedToUserIds.splice(subscribedUserIndex, 1);

          return await fastify.db.users.change(
            args.unsubscribeFromUserId,
            { subscribedToUserIds: unsubscribeFromUser.subscribedToUserIds },
          );
        } catch (error: any) {
          throw fastify.httpErrors.badRequest(error);
        }
      },
    },
  },
});

export { getMutation };
