const Sequelize = require('sequelize');
const { sequelize } = require('../dbconfig')

class ExerciseType extends Sequelize.Model { }

ExerciseType.init({
    cd: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    descrip: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
        sequelize, modelName: 'exerciseType',});

exports.ExerciseType = ExerciseType;