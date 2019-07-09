const express = require('express')
const graphqlHTTP = require('express-graphql')
const graphQLmodel = require('./models/graphql/graphQlModel')
const db = require('./dbconfig')
const dbmodel = require('./models/db/dbmodel')
const global = require('./global')

// db.sequelize.sync({force: true});

db.sequelize
  .authenticate()
  .then(() => {
    // dbmodel.seedPersonData();
    // dbmodel.Exercise.sync({force: true});
    global.initGlobals();
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: graphQLmodel.qlSchema,
  graphiql: true,
}));

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Go to http://localhost:${port}/graphiql to run queries!`);
});