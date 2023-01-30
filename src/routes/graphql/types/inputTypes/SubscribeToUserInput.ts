import { GraphQLNonNull, GraphQLInputObjectType } from 'graphql';
import { GraphQLUUID } from '../GraphQLUUID';

const SubscribeToUserInput = new GraphQLInputObjectType({
  name: 'SubscribeToUserInput',
  fields: {
    currentUserId: { type: new GraphQLNonNull(GraphQLUUID) },
    subscribeToUserId: { type: new GraphQLNonNull(GraphQLUUID) },
  },
});

export { SubscribeToUserInput };
