const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('forcegage01', 'root', 'q1w2e3r4t5y6', {
  host: '127.0.0.1',
  port: '3307',
  dialect: 'mysql'
});

// ./cloud_sql_proxy -instances=forcegage-gcp:europe-west1:forcegage-mysql-01=tcp:3307 -credential_file=F:/keys/forcegage-gcp-af6a75d808a5.json

// const sequelize = new Sequelize("forcegage01", "root", "q1w2e3r4t5y6", {
//   dialect: 'mysql',
//   // e.g. host: '/cloudsql/my-awesome-project:us-central1:my-cloud-sql-instance'
//   host: '/cloudsql/forcegage-gcp:europe-west1:forcegage-mysql-01',
//   pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//   },
//   dialectOptions: {
//       // e.g. socketPath: '/cloudsql/my-awesome-project:us-central1:my-cloud-sql-instance'
//       // same as host string above
//       socketPath: '/cloudsql/forcegage-gcp:europe-west1:forcegage-mysql-01'
//   },
//   logging: false,
//   operatorsAliases: false
// });

exports.sequelize = sequelize;

