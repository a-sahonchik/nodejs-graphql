import { GraphQLList, GraphQLObjectType, GraphQLOutputType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { GraphQLUser } from './GraphQLUser';

const config = GraphQLUser.toConfig();

const GraphQLUserWithSubscriptions = async (fastify: FastifyInstance) => {
  const GraphQLUserWithSubscriptionsType: GraphQLOutputType = new GraphQLObjectType({
    ...config,
    name: 'GraphQLUserWithSubscriptions',
    fields: () => ({
      ...config.fields,
      subscribedToUser: {
        type: new GraphQLList(GraphQLUserWithSubscriptionsType),
        resolve: async (parent: UserEntity) => {
          const { subscribedToUserIds } = parent;

          const subscribedToUser = await Promise.all(subscribedToUserIds.map(async (subscribedToUserId) => {
            const user = await fastify.db.users.findOne({ key: 'id', equals: subscribedToUserId });

            return user;
          }));

          return subscribedToUser;
        },
      },
      userSubscribedTo: {
        type: new GraphQLList(GraphQLUserWithSubscriptionsType),
        resolve: async (parent: UserEntity) => {
          const userSubscribedTo = await fastify.db.users.findMany({
            key: 'subscribedToUserIds',
            inArray: parent.id,
          });

          return userSubscribedTo;
        },
      },
    }),
  });

  return GraphQLUserWithSubscriptionsType;
};

export { GraphQLUserWithSubscriptions };
