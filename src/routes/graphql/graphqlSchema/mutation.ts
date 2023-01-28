import { FastifyInstance } from 'fastify';
import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import {
  GraphQLMemberType,
  GraphQLPost,
  GraphQLProfile,
  GraphQLUser,
  CreateUserInput,
  CreateProfileInput,
  CreatePostInput,
  UpdateUserInput,
  UpdateProfileInput,
  UpdatePostInput,
  UpdateMemberTypeInput,
} from '../types';
import {
  createPostFromInput,
  createProfileFromInput,
  createUserFromInput,
  updateUserFromInput,
  updateProfileFromInput,
  updatePostFromInput,
  updateMemberTypeFromInput,
  subscribeToUser,
  unsubscribeFromUser,
} from '../helpers';

const getMutation = async (fastify: FastifyInstance): Promise<GraphQLObjectType> => new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createUser: {
      type: GraphQLUser,
      args: {
        variables: {
          type: new GraphQLNonNull(CreateUserInput),
        },
      },
      resolve: async (_, args) => createUserFromInput(args.variables, fastify),
    },
    createProfile: {
      type: GraphQLProfile,
      args: {
        variables: {
          type: new GraphQLNonNull(CreateProfileInput),
        },
      },
      resolve: async (_, args) => createProfileFromInput(args.variables, fastify),
    },
    createPost: {
      type: GraphQLPost,
      args: {
        variables: {
          type: new GraphQLNonNull(CreatePostInput),
        },
      },
      resolve: async (_, args) => createPostFromInput(args.variables, fastify),
    },
    updateUser: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        variables: {
          type: new GraphQLNonNull(UpdateUserInput),
        },
      },
      resolve: async (_, args) => updateUserFromInput(args.id, args.variables, fastify),
    },
    updateProfile: {
      type: GraphQLProfile,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        variables: {
          type: new GraphQLNonNull(UpdateProfileInput),
        },
      },
      resolve: async (_, args) => updateProfileFromInput(args.id, args.variables, fastify),
    },
    updatePost: {
      type: GraphQLPost,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        variables: {
          type: new GraphQLNonNull(UpdatePostInput),
        },
      },
      resolve: async (_, args) => updatePostFromInput(args.id, args.variables, fastify),
    },
    updateMemberType: {
      type: GraphQLMemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        variables: {
          type: new GraphQLNonNull(UpdateMemberTypeInput),
        },
      },
      resolve: async (_, args) => updateMemberTypeFromInput(args.id, args.variables, fastify),
    },
    subscribeToUser: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        subscribeToUserId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, args) => subscribeToUser(args.id, args.subscribeToUserId, fastify),
    },
    unsubscribeFromUser: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        unsubscribeFromUserId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, args) => unsubscribeFromUser(args.id, args.unsubscribeFromUserId, fastify),
    },
  },
});

export { getMutation };
