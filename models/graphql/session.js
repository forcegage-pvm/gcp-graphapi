const graphql = require('graphql')
const dbmodel = require('../../models/db/dbmodel')
const { Statistic } = require('../../models/graphql/statistic')
const { ExerciseSet, ExerciseRep } = require('../../models/graphql/exercises')
const { GrapQLDateTime } = require('./dateTimeScalar')
const moment = require('moment-timezone')
const global = require('../../global')
const { sequelize } = require('../../dbconfig')

Date.prototype.getWeekDay = function () {
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekday[this.getDay()];
}

const Session = new graphql.GraphQLObjectType({
  name: 'Session',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    personId: { type: graphql.GraphQLInt },
    timestamp: {
      type: graphql.GraphQLString,
      resolve: async (parent, args, context, resolveInfo) => {
        return moment(parent.timestamp).tz(global.TimeZone).format()
      }
    },
    year: {
      type: graphql.GraphQLString,
      resolve: async (parent, args, context, resolveInfo) => {
        date = new Date(Date.parse(moment(parent.timestamp).tz(global.TimeZone).format()))
        return date.getFullYear();
      }
    },
    month: {
      type: graphql.GraphQLString,
      resolve: async (parent, args, context, resolveInfo) => {
        date = new Date(Date.parse(moment(parent.timestamp).tz(global.TimeZone).format()))
        return date.getMonth();
      }
    },
    day: {
      type: graphql.GraphQLString,
      resolve: async (parent, args, context, resolveInfo) => {
        date = new Date(Date.parse(moment(parent.timestamp).tz(global.TimeZone).format()))
        return date.getDay();
      }
    },
    weekday: {
      type: graphql.GraphQLString,
      resolve: async (parent, args, context, resolveInfo) => {
        date = new Date(Date.parse(moment(parent.timestamp).tz(global.TimeZone).format()))
        return date.getWeekDay();
      }
    },
    time: {
      type: graphql.GraphQLString,
      resolve: async (parent, args, context, resolveInfo) => {
        date = new Date(Date.parse(moment(parent.timestamp).tz(global.TimeZone).format()))
        return date.toLocaleTimeString();
      }
    },
    timeOfDay: {
      type: graphql.GraphQLString,
      resolve: async (parent, args, context, resolveInfo) => {
        date = new Date(Date.parse(moment(parent.timestamp).tz(global.TimeZone).format()))
        hours = date.getHours();
        if (hours < 12) return "Morning"
        return "Afternoon"
      }
    },
    weight: { type: graphql.GraphQLInt },
    duration: { type: graphql.GraphQLInt },
    exercise: { type: graphql.GraphQLString },
    exerciseSets: {
      type: graphql.GraphQLList(ExerciseSet),
      resolve: async (parent, args, context, resolveInfo) => {
        sets = await dbmodel.ExerciseSet.findAll({ where: { sessionId: parent.id },
          order: [
            ['timestamp', 'ASC'],
        ], })
        return sets;
      }
    },
    exerciseReps: { type: graphql.GraphQLList(ExerciseRep) },
    statistics: {
      type: graphql.GraphQLList(Statistic),
      args: {
        type: { type: graphql.GraphQLList(graphql.GraphQLString) },
        class: { type: graphql.GraphQLList(graphql.GraphQLString) },
        aggregation: { type: graphql.GraphQLList(graphql.GraphQLString) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        var params = ""
        for (var arg in args){
          vals = ""
          args[arg].forEach((e) => {vals += "'"+e+"',"})
          params += `AND d.${arg} in (${vals.slice(0,-1)})`
        }
        qresult = await sequelize.query("SELECT type, class, aggregation, AVG(value) as value FROM statistics d WHERE d.exerciseRepId IN (SELECT DISTINCT c.id FROM sessions a INNER JOIN exerciseSets b ON b.sessionId = a.id INNER JOIN exerciseReps c ON c.exerciseSetId = b.id WHERE a.id = " + parent.id + " "+params+") GROUP BY type, class, aggregation")
        return qresult[0];
      }
    },
  })
});

const addSession = {
  type: Session,
  args: {
    personId: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    weight: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    exerciseCd: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    timestamp: { type: GrapQLDateTime },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    pers = await dbmodel.Person.findOne({ where: { id: args.personId }, include: [dbmodel.Session] });
    sess = await dbmodel.Session.findOne({ where: { personId: args.personId, timestamp: args.timestamp } });
    if (sess) return sess;
    sess = await dbmodel.Session.create({
      timestamp: args.timestamp,
      weight: args.weight,
      exerciseCd: args.exerciseCd
    })
    await pers.addSession(sess)
    return sess;
  }
}

const session = {
  type: Session,
  args: {
    id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) }
  },
  resolve: async (parent, args, context, resolveInfo) => {
    sess = await dbmodel.Session.findOne({ where: args, include: [dbmodel.Exercise] });
    return sess;
  }
}

const sessions = {
  type: new graphql.GraphQLList(Session),
  args: {
    weight: { type: graphql.GraphQLInt },
    id: { type:  graphql.GraphQLList(graphql.GraphQLInt) },
    personId: { type: graphql.GraphQLInt }
  },
  //where: (personTable, args, context) => `${playerTable}.id = ${args.id}`,
  resolve: async (parent, args, context, resolveInfo) => {
    sess = await dbmodel.Session.findAll({ where: args, include: [dbmodel.Exercise] });
    return sess;
  }
}

const queries = { session, sessions }
const mutations = { addSession }

exports.Session = Session
exports.mutations = mutations
exports.queries = queries
