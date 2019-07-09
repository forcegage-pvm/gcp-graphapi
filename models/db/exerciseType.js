const Sequelize = require('sequelize');
const { sequelize } = require('../../dbconfig')

class ExerciseType extends Sequelize.Model { }

ExerciseType.init({
    cd: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
}, {
        sequelize, modelName: 'exerciseType',});

exports.Exercise = ExerciseType;