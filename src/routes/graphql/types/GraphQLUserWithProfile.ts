import { GraphQLList, GraphQLObjectType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { GraphQLProfile } from './GraphQLProfile';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { GraphQLUser } from './GraphQLUser';

const GraphQLUserWithProfile = async (fastify: FastifyInstance) => {
  const GraphQLUserWithProfileType = new GraphQLObjectType({
    name: 'GraphQLUserWithProfile',
    fields: {
      user: {
        type: GraphQLUser,
        resolve: async (parent: UserEntity) => parent,
      },
      userSubscribedTo: {
        type: new GraphQLList(GraphQLUser),
        resolve: async (parent: UserEntity) => {
          const userSubscribedTo = await fastify.db.users.findMany({
            key: 'subscribedToUserIds',
            inArray: parent.id,
          });

          return userSubscribedTo;
        },
      },
      profile: {
        type: GraphQLProfile,
        resolve: async (parent: UserEntity) => {
          const userProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: parent.id });

          return userProfile;
        },
      },
    },
  });

  return GraphQLUserWithProfileType;
};

export { GraphQLUserWithProfile };
