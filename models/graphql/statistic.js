const graphql = require('graphql')
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-iso-date');
const dbmodel = require('../../models/db/dbmodel')

const Statistic = new graphql.GraphQLObjectType({
    name: 'Statistic',
    fields: () => ({
        cd: { type: graphql.GraphQLInt },
        description: { type: graphql.GraphQLString },
        class: { type: graphql.GraphQLString },
        aggregation: { type: graphql.GraphQLString },
        value: { type: graphql.GraphQLFloat },
    })
});

const statistic = {
    type: Statistic,
    resolve: async (parent, args, context, resolveInfo) => {
        stat = await dbmodel.Statistic.findOne({ where: args });
        return stat;
    }
}

const statistics = {
    type: new graphql.GraphQLList(Statistic),
    args: {
        description: { type: graphql.GraphQLString },
        class: { type: graphql.GraphQLString },
        aggregation: { type: graphql.GraphQLString }
    },
    resolve: async (parent, args, context, resolveInfo) => {
        stats = await dbmodel.Statistic.findAll({ where: args });
        return stats;
    }
}

const addStatistic = {
    type: Statistic,
    args: {
        setId: { type: graphql.GraphQLInt },
        repId: { type: graphql.GraphQLInt },
        sessionId: { type: graphql.GraphQLInt },
        description: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        class: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        aggregation: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        value: { type: graphql.GraphQLNonNull(graphql.GraphQLFloat) },
    },
    resolve: async (parent, args, context, resolveInfo) => {
        argCount = 0;
        if ("sessionId" in args) argCount += 1
        if ("setId" in args) argCount += 1
        if ("repId" in args) argCount += 1
        if ((argCount != 1)) {
            throw new Error('Statistics can only be added to either session, exerciseSet or exerciseRep. Please supply 1 of either setId, repId or sessionId');
        }
        if ("sessionId" in args){
            parent = await dbmodel.Session.findOne({ where: { id: args.sessionId }, include: [dbmodel.Statistic] });
        }
        if ("setId" in args){
            parent = await dbmodel.ExerciseSet.findOne({ where: { id: args.setId }, include: [dbmodel.Statistic] });
        }
        if ("repId" in args){
            parent = await dbmodel.ExerciseRep.findOne({ where: { id: args.repId }, include: [dbmodel.Statistic] });
        }        
        stat = await dbmodel.Statistic.create({
            cd: 1,
            description: args.description,
            class: args.class,
            aggregation: args.aggregation,
            value: args.value
        })
        parent.addStatistic(stat)
        return stat;
    }
}

const queries = { statistic, statistics }
const mutations = { addStatistic }

exports.Statistic = Statistic
exports.mutations = mutations
exports.queries = queries
