const Sequelize = require('sequelize');
const { sequelize } = require('../../dbconfig')

class Statistic extends Sequelize.Model {
}

Statistic.init({
    // Power
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Eccentric/Concentric/Total
    class: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // avg/min/max/tm
    aggregation: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // avg/min/max/tm
    value: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    sessionId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    exerciseSetId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    exerciseRepId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
}, {
        sequelize, modelName: 'statistic'
    });

exports.Statistic = Statistic;
