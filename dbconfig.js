const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('Mysql', 'root', 'q1w2e3r4t5y6', {
    host: 'localhost',
    dialect: 'mysql'
  });

const Book = sequelize.define('book', {
  // attributes
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  author: { type: Sequelize.STRING
    // allowNull defaults to true
  }
}, {
  // options
});  

exports.db = sequelize;  
exports.dbBook = Book;
  
