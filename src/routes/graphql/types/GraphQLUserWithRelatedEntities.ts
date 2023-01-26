import { GraphQLList, GraphQLObjectType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { GraphQLProfile } from './GraphQLProfile';
import { GraphQLPost } from './GraphQLPost';
import { GraphQLMemberType } from './GraphQLMemberType';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { GraphQLUser } from './GraphQLUser';

const GraphQLUserWithRelatedEntities = async (fastify: FastifyInstance) => {
  const GraphQLUserWithRelatedEntitiesType = new GraphQLObjectType({
    name: 'GraphQLUserWithRelatedEntities',
    fields: () => ({
      user: {
        type: GraphQLUser,
        resolve: async (parent: UserEntity) => parent,
      },
      profile: {
        type: GraphQLProfile,
        resolve: async (parent: UserEntity) => {
          const userProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: parent.id });

          return userProfile;
        },
      },
      posts: {
        type: new GraphQLList(GraphQLPost),
        resolve: async (parent: UserEntity) => {
          const userPosts = await fastify.db.posts.findMany({ key: 'userId', equals: parent.id });

          return userPosts;
        },
      },
      memberType: {
        type: GraphQLMemberType,
        resolve: async (parent: UserEntity) => {
          const userProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: parent.id });

          if (userProfile === null) {
            return null;
          }

          const userMemberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: userProfile.memberTypeId });

          return userMemberType;
        },
      },
    }),
  });

  return GraphQLUserWithRelatedEntitiesType;
};

export { GraphQLUserWithRelatedEntities };
