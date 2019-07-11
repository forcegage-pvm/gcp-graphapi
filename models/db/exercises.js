const Sequelize = require('sequelize');
const { sequelize } = require('../../dbconfig')

class ExerciseSet extends Sequelize.Model {
}

ExerciseSet.init({
    setNo: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    sessionId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
}, {
        sequelize, modelName: 'exerciseSet'
    });

class ExerciseRep extends Sequelize.Model {
    }

ExerciseRep.init({
    repNo: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    sessionId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    exerciseSetId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
}, {
        sequelize, modelName: 'exerciseRep'
    });

exports.ExerciseSet = ExerciseSet;
exports.ExerciseRep = ExerciseRep;
