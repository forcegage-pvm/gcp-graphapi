const graphql = require('graphql')
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-iso-date');
const dbmodel = require('../../models/db/dbmodel')
const session = require('./session')

const Person = new graphql.GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    surname: { type: graphql.GraphQLString },
    gender: { type: graphql.GraphQLString },
    DOB: { type: GraphQLDate },
    bodyweight: { type: graphql.GraphQLFloat },
    age: { type: graphql.GraphQLInt },
    sessions: {
      type: graphql.GraphQLList(session.Session),
      args: { weight: { type: graphql.GraphQLInt } },
      resolve: async (parent, args, context, resolveInfo) => {
        if ("weight" in args) {
          return parent.sessions.filter((session) => {
            return session.weight == args.weight
          })
        } else {
          return parent.sessions;
        }
      }
    }
  })
});

const updateBodyWeight = {
  type: Person,
  args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) }, bodyweight: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
  resolve: async (parent, args, context, resolveInfo) => {
    pers = await dbmodel.Person.findOne({ where: { id: args.id }, include: dbmodel.BodyWeight });
    bodyweight = await dbmodel.BodyWeight.create({
      weight: args.bodyweight
    })
    await pers.addBodyWeights(bodyweight)
    pers = await dbmodel.Person.findOne({ where: { id: args.id }, include: dbmodel.BodyWeight });
    return pers;
  }
}

const person = {
  type: Person,
  args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
  //where: (personTable, args, context) => `${playerTable}.id = ${args.id}`,
  resolve: async (parent, args, context, resolveInfo) => {
    pers = await dbmodel.Person.findOne({ where: args, include: [dbmodel.BodyWeight, dbmodel.Session] });
    return pers;
  }
}


const people = {
  type: new graphql.GraphQLList(Person),
  args: {
    name: { type: graphql.GraphQLString },
    surname: { type: graphql.GraphQLString },
    age: { type: graphql.GraphQLInt },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    if ("age" in args) {
      age = args.age
      delete args.age
      results = await dbmodel.Person.findAll({ where: args, include: [dbmodel.BodyWeight, dbmodel.Session] });
      results = results.filter((pers) => {
        return pers.age == age
      })
    } else {
      results = await dbmodel.Person.findAll({ where: args, include: [dbmodel.BodyWeight, dbmodel.Session] });
    }
    return results
  }
}

const queries = { person, people }
const mutations = { updateBodyWeight }

exports.Person = Person
exports.mutations = mutations
exports.queries = queries
