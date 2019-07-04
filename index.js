const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const db = require('./dbconfig')
const dbmodel = require('./dbmodels/dbmodel')

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
    person(name: String, gender: String): [People] 
  }
  type People { 
    id: Int,
    name: String, 
    surname: String,
    gender: String,
    DOB: String,
    bodyweight: String
  }
`;

// The resolvers
const resolvers = {
  Query: {
    person: async (parent, args) => {
      results = await dbmodel.Person.findAll({include: [{model: dbmodel.BodyWeight, nested: false}]}, {where: args});     
      return results;
    }
  },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// db.sequelize.sync({force: true}).then(() => {
//   dbmodel.seedPersonData();  
// })

db.sequelize
  .authenticate()
  .then(() => {
    dbmodel.seedPersonData();  
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Go to http://localhost:${port}/graphiql to run queries!`);
});