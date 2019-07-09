const Sequelize = require('sequelize');
const { sequelize } = require('../../dbconfig')

class Statistic extends Sequelize.Model {
}

Statistic.init({
    // 1
    cd: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
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
}, {
        sequelize, modelName: 'statistic'
    });

exports.Statistic = Statistic;
