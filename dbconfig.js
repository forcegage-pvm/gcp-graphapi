const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('Mysql', 'root', 'q1w2e3r4t5y6', {
  host: 'localhost',
  dialect: 'mysql'
});

exports.sequelize = sequelize;

