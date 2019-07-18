const graphql = require('graphql')
const dbmodel = require('../../models/db/dbmodel')
const { Statistic } = require('../graphql/statistic')
const { GrapQLDateTime } = require('./dateTimeScalar')
const Sequelize = require('sequelize')
const moment = require('moment-timezone')
const global = require('../../global')
const { sequelize } = require('../../dbconfig')

// Sets
const ExerciseSet = new graphql.GraphQLObjectType({
    name: 'ExerciseSet',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        setNo: { type: graphql.GraphQLInt },
        sessionId: { type: graphql.GraphQLInt },
        duration: { type: graphql.GraphQLInt },
        timestamp: {
            type: graphql.GraphQLString,
            resolve: async (parent, args, context, resolveInfo) => {
                return moment(parent.timestamp).tz(global.TimeZone).format()
            }
        },
        side: { type: graphql.GraphQLString },
        exerciseReps: {
            type: graphql.GraphQLList(ExerciseRep),
            args: { repNo: { type: graphql.GraphQLList(graphql.GraphQLInt) } },
            resolve: async (parent, args, context, resolveInfo) => {
                sets = await dbmodel.ExerciseRep.findAll({
                    where:
                        { [Sequelize.Op.and]: [{ exerciseSetId: parent.id }, args] },
                    order: [
                        ['timestamp', 'ASC'],
                    ]
                })
                return sets;
            }
        },
        statistics: {
            type: graphql.GraphQLList(Statistic),
            args: {
                type: { type: graphql.GraphQLList(graphql.GraphQLString) },
                class: { type: graphql.GraphQLList(graphql.GraphQLString) },
                aggregation: { type: graphql.GraphQLList(graphql.GraphQLString) }
            },
            resolve: async (parent, args, context, resolveInfo) => {
                var params = ""
                for (var arg in args) {
                    vals = ""
                    args[arg].forEach((e) => { vals += "'" + e + "'," })
                    params += `AND d.${arg} in (${vals.slice(0, -1)})`
                }
                qresult = await sequelize.query("SELECT type, class, aggregation, AVG(VALUE) AS value FROM statistics d WHERE d.exerciseRepId IN (SELECT DISTINCT c.id FROM exerciseSets a INNER JOIN exerciseReps c ON c.exerciseSetId = a.id WHERE a.id = " + parent.id + " "+params+") GROUP BY type, class, aggregation;")
                return qresult[0];
            }
        },
    })
});

const exerciseSet = {
    type: ExerciseSet,
    args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    },
    resolve: async (parent, args, context, resolveInfo) => {
        set = await dbmodel.ExerciseSet.findOne({ where: args });
        return set;
    }
}

const exerciseSets = {
    type: new graphql.GraphQLList(ExerciseSet),
    args: {
        sessionId: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    },
    resolve: async (parent, args, context, resolveInfo) => {
        sets = await dbmodel.ExerciseSet.findAll({ where: args });
        return sets;
    }
}

const addExerciseSet = {
    type: ExerciseSet,
    args: {
        sessionId: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
        side: { type: graphql.GraphQLString },
        timestamp: { type: graphql.GraphQLNonNull(GrapQLDateTime) },
    },
    resolve: async (parent, args, context, resolveInfo) => {
        set = await dbmodel.ExerciseSet.findOne({ where: { sessionId: args.sessionId, timestamp: args.timestamp } });
        if (set) return set;
        session = await dbmodel.Session.findOne({ where: { id: args.sessionId } });
        if (session) {
            side = "N/A"
            if (args.side) side = args.side
            set = await dbmodel.ExerciseSet.create({
                timestamp: args.timestamp,
                side: side,
                childCount: 0,
                duration: 0
            });
            session.addExerciseSet(set)
            return set;
        }
    }
}

// Reps
const ExerciseRep = new graphql.GraphQLObjectType({
    name: 'ExerciseRep',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        repNo: { type: graphql.GraphQLInt },
        duration: { type: graphql.GraphQLInt },
        timestamp: {
            type: graphql.GraphQLString,
            resolve: async (parent, args, context, resolveInfo) => {
                return moment(parent.timestamp).tz(global.TimeZone).format()
            }
        },
        side: { type: graphql.GraphQLString },
        statistics: {
            type: graphql.GraphQLList(Statistic),
            args: {
                type: { type: graphql.GraphQLList(graphql.GraphQLString) },
                class: { type: graphql.GraphQLList(graphql.GraphQLString) },
                aggregation: { type: graphql.GraphQLList(graphql.GraphQLString) }
            },
            resolve: async (parent, args, context, resolveInfo) => {
                stats = await dbmodel.Statistic.findAll({
                    where:
                        { [Sequelize.Op.and]: [{ exerciseRepId: parent.id }, args] }
                })
                return stats;
            }
        },
    })
});

const exerciseRep = {
    type: ExerciseRep,
    args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    },
    resolve: async (parent, args, context, resolveInfo) => {
        set = await dbmodel.ExerciseRep.findOne({ where: args });
        return set;
    }
}

const exerciseReps = {
    type: new graphql.GraphQLList(ExerciseRep),
    args: {
        exerciseSetId: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    },
    resolve: async (parent, args, context, resolveInfo) => {
        sets = await dbmodel.ExerciseRep.findAll({ where: args });
        return sets;
    }
}

const addExerciseRep = {
    type: ExerciseRep,
    args: {
        setId: { type: graphql.GraphQLInt },
        sessionId: { type: graphql.GraphQLInt },
        side: { type: graphql.GraphQLString },
        timestamp: { type: graphql.GraphQLNonNull(GrapQLDateTime) },
    },
    resolve: async (parent, args, context, resolveInfo) => {
        if ("setId" in args) {
            rep = await dbmodel.ExerciseRep.findOne({ where: { exerciseSetId: args.setId, timestamp: args.timestamp } });
            if (rep) return rep;
            set = await dbmodel.ExerciseSet.findOne({ where: { id: args.setId } });
            if (set) {
                side = set.side;
                if (args.side) side = args.side
                rep = await dbmodel.ExerciseRep.create({
                    timestamp: args.timestamp,
                    side: side,
                    childCount: 0,
                    duration: 0
                });
                set.addExerciseRep(rep)
                return rep;
            }
        } else if ("sessionId" in args) {
            rep = await dbmodel.ExerciseRep.findOne({ where: { sessionId: args.sessionId, timestamp: args.timestamp } });
            if (rep) return rep;
            session = await dbmodel.Session.findOne({ where: { id: args.sessionId } });
            if (session) {
                side = "N/A";
                if (args.side) side = args.side
                rep = await dbmodel.ExerciseRep.create({
                    timestamp: args.timestamp,
                    side: side,
                    childCount: 0,
                    duration: 0
                });
                session.addExerciseRep(rep)
                return rep;
            }
        }
    }
}

const queries = { exerciseSet, exerciseSets, exerciseRep, exerciseReps }
const mutations = { addExerciseSet, addExerciseRep }

exports.ExerciseSet = ExerciseSet
exports.ExerciseRep = ExerciseRep
exports.mutations = mutations
exports.queries = queries
