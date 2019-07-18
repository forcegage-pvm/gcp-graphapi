const express = require('express')
const graphqlHTTP = require('express-graphql')
const graphQLmodel = require('./models/graphql/graphQlModel')
const db = require('./dbconfig')
const global = require('./global')
const bodyParser = require('body-parser');
var cors = require('cors');

// db.sequelize.sync({force: true});

db.sequelize
  .authenticate()
  .then(() => {
    global.initGlobals();
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const app = express();

const corsOptions = {
  origin(origin, callback){
  callback(null, true);
  },
  credentials: true
  };
  app.use(cors(corsOptions));
  var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
  }
  app.use(allowCrossDomain);

// app.use(cors({}));
app.use('/graphql', graphqlHTTP({
  schema: graphQLmodel.qlSchema,
  graphiql: true,
}));

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Go to http://localhost:${port}/graphiql to run queries!`);
});