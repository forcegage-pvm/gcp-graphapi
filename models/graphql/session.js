const graphql = require('graphql')
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-iso-date');
const dbmodel = require('../../models/db/dbmodel')

const Session= new graphql.GraphQLObjectType({
  name: 'Session',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    personId: { type: graphql.GraphQLInt },
    timestamp: { type: GraphQLDateTime },
    weight: { type: graphql.GraphQLInt },
    duration: { type: graphql.GraphQLInt },
    exercise: { type: graphql.GraphQLString },
  })
});

const addSession = {
  type: Session,
  args: {
    personId: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    weight: {type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    exerciseCd: {type: graphql.GraphQLNonNull(graphql.GraphQLInt) }
  },
  resolve: async (parent, args, context, resolveInfo) => {
    pers = await dbmodel.Person.findOne({ where: {id: args.personId}, include: [dbmodel.Session]});
    sess = await dbmodel.Session.create({
      timestamp: Date.now(),
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
  //where: (personTable, args, context) => `${playerTable}.id = ${args.id}`,
  resolve: async (parent, args, context, resolveInfo) => {
    sess = await dbmodel.Session.findOne({ where: args, include: [dbmodel.Exercise]});
    return sess;
  }
}

const sessions = {
  type: new graphql.GraphQLList(Session),
  args: { 
    weight: { type: graphql.GraphQLInt },
    id: { type: graphql.GraphQLInt },
    personId: { type: graphql.GraphQLInt }
   },
  //where: (personTable, args, context) => `${playerTable}.id = ${args.id}`,
  resolve: async (parent, args, context, resolveInfo) => {
    sess = await dbmodel.Session.findAll({ where: args, include: [dbmodel.Exercise]});
    return sess;
  }
}

const queries = {session, sessions}
const mutations = {addSession}

exports.Session = Session
exports.mutations = mutations
exports.queries = queries
