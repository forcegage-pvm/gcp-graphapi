var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');
const db = require('../dbconfig')
const dbmodel = require('../dbmodels/dbmodel')

// Define the User type
var userType = new graphql.GraphQLObjectType({
  name: 'person',
  fields: {
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
  }
});

// Define the Query type
var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      // `args` describes the arguments that the `user` query accepts
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve: async function (_, {id}) {
        results = await dbmodel.Person.findAll({where: args});
        return results;
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({query: queryType, userType: userType});

// var app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   graphiql: true,
// }));
// app.listen(4000);
// console.log('Running a GraphQL API server at localhost:4000/graphql');

exports.schema = schema;