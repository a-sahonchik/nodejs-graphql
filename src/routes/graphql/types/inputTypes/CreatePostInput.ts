import { GraphQLNonNull, GraphQLString, GraphQLInputObjectType } from 'graphql';
import { GraphQLUUID } from '../GraphQLUUID';

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLUUID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export { CreatePostInput };
