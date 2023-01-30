import { GraphQLInputObjectType, GraphQLInt } from 'graphql';

const UpdateMemberTypeInput = new GraphQLInputObjectType({
  name: 'UpdateMemberTypeInput',
  fields: {
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});

export { UpdateMemberTypeInput };
