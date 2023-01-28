import {
  GraphQLNonNull, GraphQLString, GraphQLInputObjectType, GraphQLID,
} from 'graphql';

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export { CreatePostInput };
