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
  GraphQLUserWithPosts,
  GraphQLUserWithProfile,
  GraphQLUserWithRelatedEntities,
  GraphQLUserWithSubscriptions,
} from '../types';
import {
  getMemberTypeById,
  getPostById,
  getProfileById,
  getUserById,
} from '../helpers';

const getQuery = async (fastify: FastifyInstance): Promise<GraphQLObjectType> => {
  // todo: get rid of extra types and fields (?)
  const GraphQLUserWithRelatedEntitiesType = await GraphQLUserWithRelatedEntities(fastify);
  const GraphQLUserWithProfileType = await GraphQLUserWithProfile(fastify);
  const GraphQLUserWithPostsType = await GraphQLUserWithPosts(fastify);
  const GraphQLUserWithSubscriptionsType = await GraphQLUserWithSubscriptions(fastify);

  return new GraphQLObjectType({
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
      getUsersWithRelatedEntities: {
        type: new GraphQLList(GraphQLUserWithRelatedEntitiesType),
        resolve: async () => fastify.db.users.findMany(),
      },
      getUserWithRelatedEntities: {
        type: GraphQLUserWithRelatedEntitiesType,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (_, args) => getUserById(args.id, fastify),
      },
      getUsersWithProfile: {
        type: new GraphQLList(GraphQLUserWithProfileType),
        resolve: async () => fastify.db.users.findMany(),
      },
      getUserWithPosts: {
        type: GraphQLUserWithPostsType,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (_, args) => getUserById(args.id, fastify),
      },
      getUsersWithSubscriptions: {
        type: new GraphQLList(GraphQLUserWithSubscriptionsType),
        resolve: async () => fastify.db.users.findMany(),
      },
    },
  });
};

export { getQuery };
