import { GraphQLList, GraphQLObjectType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { GraphQLUser } from './GraphQLUser';
import { GraphQLPost } from './GraphQLPost';

const GraphQLUserWithPosts = async (fastify: FastifyInstance) => {
  const GraphQLUserWithPostsType = new GraphQLObjectType({
    name: 'GraphQLUserWithPosts',
    fields: {
      user: {
        type: GraphQLUser,
        resolve: async (parent: UserEntity) => parent,
      },
      subscribedToUser: {
        type: new GraphQLList(GraphQLUser),
        resolve: async (parent: UserEntity) => {
          const { subscribedToUserIds } = parent;

          const subscribedToUser = await Promise.all(subscribedToUserIds.map(async (subscribedToUserId) => {
            const user = await fastify.db.users.findOne({ key: 'id', equals: subscribedToUserId });

            return user;
          }));

          return subscribedToUser;
        },
      },
      posts: {
        type: new GraphQLList(GraphQLPost),
        resolve: async (parent: UserEntity) => {
          const posts = await fastify.db.posts.findMany({ key: 'userId', equals: parent.id });

          return posts;
        },
      },
    },
  });

  return GraphQLUserWithPostsType;
};

export { GraphQLUserWithPosts };
