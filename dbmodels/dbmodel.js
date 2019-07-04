const person = require('./Person')

person.Person.hasOne(person.BodyWeight);
// person.BodyWeight.belongsTo(person.Person);

exports.BodyWeight = person.BodyWeight;
exports.Person = person.Person;
exports.seedPersonData  = function() {
    person.SeedData();
    };