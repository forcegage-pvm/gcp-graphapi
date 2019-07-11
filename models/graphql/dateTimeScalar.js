const { GraphQLScalarType } = require('graphql');
const { isISO8601 } = require('validator');

const parseISO8601 = (value) => {
  if (isISO8601(value)) {
    return value;
  }
  throw new Error('DateTime cannot represent an invalid ISO-8601 Date string');
};

const serializeISO8601 = (value) => {
  if (isISO8601(value)) {
    return value;
  }
  throw new Error('DateTime cannot represent an invalid ISO-8601 Date string');
};

const parseLiteralISO8601 = (ast) => {
  if (isISO8601(ast.value)) {
    return ast.value;
  }
  throw new Error('DateTime cannot represent an invalid ISO-8601 Date string');
};

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTimeISO',
  description: 'An ISO-8601 encoded UTC date string.',
  serialize: serializeISO8601,
  parseValue: parseISO8601,
  parseLiteral: parseLiteralISO8601,
});

exports.GrapQLDateTime = DateTimeScalar;