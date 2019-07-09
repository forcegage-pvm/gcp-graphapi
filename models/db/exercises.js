const Sequelize = require('sequelize');
const { sequelize } = require('../../dbconfig')

class ExerciseSet extends Sequelize.Model {
}

ExerciseSet.init({
    childCount: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    duration: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    timestamp: Sequelize.DATE,
    side: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
        sequelize, modelName: 'exerciseSet'
    });

class ExerciseRep extends Sequelize.Model {
    }

ExerciseRep.init({
    childCount: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    duration: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    timestamp: Sequelize.DATE,
    side: {
        type: Sequelize.STRING,
        allowNull: true
    },    
}, {
        sequelize, modelName: 'exerciseRep'
    });

exports.ExerciseSet = ExerciseSet;
exports.ExerciseRep = ExerciseRep;
