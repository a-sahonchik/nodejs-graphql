import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GraphQLUUID } from '../GraphQLUUID';

const GraphQLProfile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLUUID },
    userId: { type: GraphQLUUID },
    memberTypeId: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
  }),
});

export { GraphQLProfile };
