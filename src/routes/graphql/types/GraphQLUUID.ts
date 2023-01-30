import { GraphQLScalarType, Kind } from 'graphql';
import { assertValidUUID } from '../asserts';

const GraphQLUUID = new GraphQLScalarType({
  name: 'GraphQLUUID',
  serialize: (uuid) => {
    assertValidUUID(uuid);

    return uuid as string;
  },
  parseValue: (uuid) => {
    assertValidUUID(uuid);

    return uuid as string;
  },
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      assertValidUUID(ast.value);

      return ast.value;
    }

    return undefined;
  },
});

export { GraphQLUUID };
