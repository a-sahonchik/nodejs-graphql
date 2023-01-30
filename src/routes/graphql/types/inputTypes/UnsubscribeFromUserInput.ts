import { GraphQLNonNull, GraphQLInputObjectType } from 'graphql';
import { GraphQLUUID } from '../GraphQLUUID';

const UnsubscribeFromUserInput = new GraphQLInputObjectType({
  name: 'UnsubscribeFromUserInput',
  fields: {
    currentUserId: { type: new GraphQLNonNull(GraphQLUUID) },
    unsubscribeFromUserId: { type: new GraphQLNonNull(GraphQLUUID) },
  },
});

export { UnsubscribeFromUserInput };
