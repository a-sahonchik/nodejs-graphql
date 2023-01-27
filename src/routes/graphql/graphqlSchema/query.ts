import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';
import { FastifyInstance } from 'fastify';
import {
  GraphQLMemberType,
  GraphQLPost,
  GraphQLProfile,
  GraphQLUser,
} from '../types';
import {
  getMemberTypeById,
  getPostById,
  getProfileById,
  getUserById,
} from '../helpers';

const getQuery = async (fastify: FastifyInstance): Promise<GraphQLObjectType> => new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getUsers: {
      type: new GraphQLList(GraphQLUser),
      resolve: async () => fastify.db.users.findMany(),
    },
    getProfiles: {
      type: new GraphQLList(GraphQLProfile),
      resolve: async () => fastify.db.profiles.findMany(),
    },
    getPosts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async () => fastify.db.posts.findMany(),
    },
    getMemberTypes: {
      type: new GraphQLList(GraphQLMemberType),
      resolve: async () => fastify.db.memberTypes.findMany(),
    },
    getUser: {
      type: GraphQLUser,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args) => getUserById(args.id, fastify),
    },
    getProfile: {
      type: GraphQLProfile,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args) => getProfileById(args.id, fastify),
    },
    getPost: {
      type: GraphQLPost,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args) => getPostById(args.id, fastify),
    },
    getMemberType: {
      type: GraphQLMemberType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args) => getMemberTypeById(args.id, fastify),
    },
  },
});

export { getQuery };
