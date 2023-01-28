import { GraphQLString, GraphQLInputObjectType, GraphQLInt } from 'graphql';

const UpdateProfileInput = new GraphQLInputObjectType({
  name: 'UpdateProfileInput',
  fields: {
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  },
});

export { UpdateProfileInput };
