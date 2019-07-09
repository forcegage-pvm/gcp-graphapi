const Sequelize = require('sequelize');
const { sequelize } = require('../../dbconfig')
const { Exercise } = require('./exerciseType')
const global = require('../../global')

class Session extends Sequelize.Model {
}

Session.init({
    timestamp: Sequelize.DATE,
    weight: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    duration: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    exerciseCd: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
        sequelize, modelName: 'session',
        getterMethods: {
            async exercise() {
                if (this.exerciseCd){
                    description = await global.exerciseTypes(this.exerciseCd);
                    return description
                } else {
                    return ""
                }
                return ""
                
            },
        }
    });

exports.Session = Session;
