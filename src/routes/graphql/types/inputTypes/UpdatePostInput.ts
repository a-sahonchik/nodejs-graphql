import { GraphQLString, GraphQLInputObjectType } from 'graphql';

const UpdatePostInput = new GraphQLInputObjectType({
  name: 'UpdatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

export { UpdatePostInput };
