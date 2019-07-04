const Sequelize = require('sequelize');
const { sequelize } = require('../dbconfig')
var faker = require('faker');

class Person extends Sequelize.Model {

}

Person.init({
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false
    },
    DOB: Sequelize.DATE

}, {
        sequelize, modelName: 'person',
        getterMethods: {
            fullName() {
                return this.firstname + ' ' + this.lastname;
            },
            bodyweight() {
                return this.bodyWeight.weight;
            }

        },

    });

class BodyWeight extends Sequelize.Model { }

BodyWeight.init({
    weight: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, { sequelize, modelName: 'bodyWeight' });

SeedData = function SeedData() {
    Person.create({
        name: faker.name.firstName(), 
        surname: faker.name.lastName(),
        gender: "MALE", 
        DOB: faker.date.past(), 
        bodyWeight: { weight: 50.0 }
    }, {include: [BodyWeight]})
        .then((person) => {
            person.update({bodyWeight: {weight: 60.5}}, {include: [BodyWeight]});
        });
}


exports.BodyWeight = BodyWeight;
exports.Person = Person;
exports.SeedData = function () {
    SeedData();
};