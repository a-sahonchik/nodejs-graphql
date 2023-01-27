import {
  GraphQLList, GraphQLObjectType, GraphQLOutputType, GraphQLString,
} from 'graphql';
import { FastifyInstance } from 'fastify';
import { GraphQLProfile } from './GraphQLProfile';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { GraphQLPost } from './GraphQLPost';
import { GraphQLMemberType } from './GraphQLMemberType';

const GraphQLUser: GraphQLOutputType = new GraphQLObjectType({
  name: 'GraphQLUser',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    profile: {
      type: GraphQLProfile,
      resolve: async (parent: UserEntity, args: [], fastify: FastifyInstance) => fastify.db.profiles.findOne({
        key: 'userId',
        equals: parent.id,
      }),
    },
    posts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async (parent: UserEntity, args: [], fastify: FastifyInstance) => fastify.db.posts.findMany({
        key: 'userId',
        equals: parent.id,
      }),
    },
    memberType: {
      type: GraphQLMemberType,
      resolve: async (parent: UserEntity, args: [], fastify: FastifyInstance) => {
        const userProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: parent.id });

        if (userProfile === null) {
          return null;
        }

        return fastify.db.memberTypes.findOne({ key: 'id', equals: userProfile.memberTypeId });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (parent: UserEntity, args: [], fastify: FastifyInstance) => Promise.all(
        parent.subscribedToUserIds.map(
          async (subscribedToUserId) => fastify.db.users.findOne({ key: 'id', equals: subscribedToUserId }),
        ),
      ),
    },
    userSubscribedTo: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (parent: UserEntity, args: [], fastify: FastifyInstance) => fastify.db.users.findMany({
        key: 'subscribedToUserIds',
        inArray: parent.id,
      }),
    },
  }),
});

export { GraphQLUser };
