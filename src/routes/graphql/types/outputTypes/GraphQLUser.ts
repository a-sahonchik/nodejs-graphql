import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLString,
} from 'graphql';
import { GraphQLProfile } from './GraphQLProfile';
import { GraphQLUUID } from '../GraphQLUUID';
import { UserEntity } from '../../../../utils/DB/entities/DBUsers';
import { GraphQLPost } from './GraphQLPost';
import { GraphQLMemberType } from './GraphQLMemberType';

const GraphQLUser: GraphQLOutputType = new GraphQLObjectType({
  name: 'GraphQLUser',
  fields: () => ({
    id: { type: GraphQLUUID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    profile: {
      type: GraphQLProfile,
      resolve: async (parent: UserEntity, args: [], context) => context.userProfileDataLoader.load(parent.id),
    },
    posts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async (parent: UserEntity, args: [], context) => context.userPostsDataLoader.load(parent.id),
    },
    memberType: {
      type: GraphQLMemberType,
      resolve: async (parent: UserEntity, args: [], context) => {
        const userProfile = await context.userProfileDataLoader.load(parent.id);

        if (userProfile === null) {
          return null;
        }

        return context.memberTypeLoader.load(userProfile.memberTypeId);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (parent: UserEntity, args: [], context) => context.subscribedToUserDataLoader.loadMany(
        parent.subscribedToUserIds,
      ),
    },
    userSubscribedTo: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (parent: UserEntity, args: [], context) => context.userSubscribedToDataLoader.load(parent.id),
    },
  }),
});

export { GraphQLUser };
