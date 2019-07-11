const graphql = require('graphql')
const dbmodel = require('../../models/db/dbmodel')
const { GraphQLJSON } = require('graphql-type-json')
const result = require('./result')
const moment = require('moment-timezone')
const global = require('../../global')

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

const addStatistics = {
    type: result.ResultSet,
    args: {
        sessionId: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
        statistics: { type: GraphQLJSON }
    },
    resolve: async (parent, args, context, resolveInfo) => {
        session = await dbmodel.Session.findOne({ where: { id: args.sessionId } });
        startTimestamp = new Date(Date.parse(session.timestamp))
        // get the JSON object from the args
        var encoded = new Buffer(args.statistics, 'base64');
        var decoded = encoded.toString('ascii');
        var json = JSON.parse(decoded);
        eresult = {
            count: 0,
            success: false,
            message: ""
        }
        var setList = []
        promises = []
        for (var setIndex in json) {
            sets = json[setIndex]
            for (var setCount in sets) {
                set = sets[setCount]
                timestamp = new Date(startTimestamp.getTime() + (1000 * set[0]['start-time']))
                isoTimestamp = new Date(Date.parse(moment(timestamp).tz(global.TimeZone).format()))
                ldbSet = {}
                ldbSet['db'] = dbmodel.ExerciseSet.findOrCreate({
                    where: { sessionId: args.sessionId, timestamp: isoTimestamp },
                    defaults: { side: "N/A", childCount: 0, duration: 0, setNo: parseInt(setCount) + 1 }
                })
                promises.push(ldbSet['db'])
                ldbSet['reps'] = []
                setList.push(ldbSet)
                for (var index in set) {
                    // stats is the index of the list of stats
                    // stat is the list of stats
                    rep = set[index]
                    timestamp = new Date(startTimestamp.getTime() + (1000 * rep['start-time']))
                    isoTimestamp = new Date(Date.parse(moment(timestamp).tz(global.TimeZone).format()))
                    ldbRep = {}
                    ldbRep['db'] = dbmodel.ExerciseRep.create({
                        timestamp: isoTimestamp,
                        side: "N/A",
                        childCount: 0,
                        duration: 0,
                        repNo: parseInt(index) + 1
                    });
                    promises.push(ldbRep['db'])
                    ldbRep['stats'] = []
                    ldbSet['reps'].push(ldbRep)
                    for (var type in rep) {
                        // type is: force/power/etc
                        // typeList is the list of force/power/etc
                        types = rep[type]
                        for (var statClass in types) {
                            // statClass is the class: Total/Concentric/Eccentric
                            // values is the list of avg/max/min/tm etc
                            values = types[statClass]
                            console.log(values)
                            for (var aggregate in values) {
                                // data is tm/avg/max/min
                                // value is the value
                                value = values[aggregate]
                                ldbStat = {}
                                ldbStat['db'] = dbmodel.Statistic.create({
                                    cd: 1,
                                    description: type,
                                    class: statClass,
                                    aggregation: aggregate,
                                    value: value
                                })
                                promises.push(ldbStat['db'])
                                ldbRep['stats'].push(ldbStat)
                                eresult.count += 1
                            }
                        }
                    }
                }
            }
        }
        Promise.all(promises).then((values) => {
            console.log(setList)
            for (var sets in setList) {
                // set db
                var setDb = setList[sets]['db'].value()[0]
                repDbs = []
                for (var reps in setList[sets]['reps']) {
                    var repDb = setList[sets]['reps'][reps]['db'].value()
                    repDbs.push(repDb)
                    statDbs = []
                    for (var stats in setList[sets]['reps'][reps]['stats']) {
                        var statDB = setList[sets]['reps'][reps]['stats'][stats]['db'].value()
                        statDbs.push(statDB)
                    }
                    repDb.setStatistics(statDbs)
                }
                setDb.setExerciseReps(repDbs)
            }
        });
        return eresult
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
        if ("sessionId" in args) {
            parent = await dbmodel.Session.findOne({ where: { id: args.sessionId }, include: [dbmodel.Statistic] });
        }
        if ("setId" in args) {
            parent = await dbmodel.ExerciseSet.findOne({ where: { id: args.setId }, include: [dbmodel.Statistic] });
        }
        if ("repId" in args) {
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
const mutations = { addStatistic, addStatistics }

exports.Statistic = Statistic
exports.mutations = mutations
exports.queries = queries
