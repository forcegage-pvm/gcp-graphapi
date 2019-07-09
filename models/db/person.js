const Sequelize = require('sequelize');
const { sequelize } = require('../../dbconfig')
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
                return this.name + ' ' + this.surname;
            },
            bodyweight() {
                sorted = this.bodyWeights.sort((a, b) => {
                    if (a.updatedAt > b.updatedAt) { return -1; }
                    if (a.updatedAt < b.updatedAt) { return 1; }
                    return 0;
                })
                return sorted[0].weight;

            },
            age() {
                var bdate = this.DOB;
                var now = new Date();
                var diffYears = parseInt(((now - bdate) / (1000 * 60 * 60 * 24)) / 365.25);
                return diffYears;
            }
        },
    });

class BodyWeight extends Sequelize.Model { }

BodyWeight.init({
    weight: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
}, { sequelize, modelName: 'bodyWeight' });

exports.BodyWeight = BodyWeight;
exports.Person = Person;
