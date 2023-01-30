import { GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLUUID } from '../GraphQLUUID';

const GraphQLPost = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLUUID },
    userId: { type: GraphQLUUID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export { GraphQLPost };
