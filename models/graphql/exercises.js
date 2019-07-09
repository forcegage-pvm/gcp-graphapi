const graphql = require('graphql')
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-iso-date');
const dbmodel = require('../../models/db/dbmodel')
const {Statistic} = require('../graphql/statistic')

// Sets
const ExerciseSet = new graphql.GraphQLObjectType({
    name: 'ExerciseSet',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        childCount: { type: graphql.GraphQLInt },
        duration: { type: graphql.GraphQLInt },
        timestamp: { type: GraphQLDateTime },
        side: { type: graphql.GraphQLString },
        exerciseReps: { type: graphql.GraphQLList(ExerciseRep) },
        statistics: { type: graphql.GraphQLList(Statistic)},
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
        side: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    },
    resolve: async (parent, args, context, resolveInfo) => {
        session = await dbmodel.Session.findOne({ where: { id: args.sessionId } });
        if (session) {
            set = await dbmodel.ExerciseSet.create({
                timestamp: Date.now(),
                side: args.side,
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
        childCount: { type: graphql.GraphQLInt },
        duration: { type: graphql.GraphQLInt },
        timestamp: { type: GraphQLDateTime },
        side: { type: graphql.GraphQLString },
        statistics: { type: graphql.GraphQLList(Statistic)},
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
        side: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    },
    resolve: async (parent, args, context, resolveInfo) => {
        if ("setId" in args) {
            set = await dbmodel.ExerciseSet.findOne({ where: { id: args.setId } });
            if (set) {
                rep = await dbmodel.ExerciseRep.create({
                    timestamp: Date.now(),
                    side: args.side,
                    childCount: 0,
                    duration: 0
                });
                set.addExerciseRep(rep)
                return rep;
            }
        } else if ("sessionId" in args) {
            session = await dbmodel.Session.findOne({ where: { id: args.sessionId } });
            if (session) {
                rep = await dbmodel.ExerciseRep.create({
                    timestamp: Date.now(),
                    side: args.side,
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
