const graphql = require('graphql')
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-iso-date');
const dbmodel = require('../../models/db/dbmodel')
const session = require('./session')
const exercises = require('./exercises')
const Sequelize = require('sequelize');

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
      args: { 
        weight: { type: graphql.GraphQLInt },
        exerciseCd: { type: graphql.GraphQLInt },
      },
      resolve: async (parent, args, context, resolveInfo) => {
        sessions = await dbmodel.Session.findAll({ where: 
          {[Sequelize.Op.and]: [{personId: parent.id}, args]}
        })
        return sessions;
      }
    },
  })
});

function isFieldRequested(fieldName, selectionSet) {
  result = false;
  for (var selection in selectionSet.selections) {
    if (fieldName == selectionSet.selections[selection].name.value) {
      return true
    } else if (selectionSet.selections[selection].selectionSet != undefined){
      result = isFieldRequested(fieldName, selectionSet.selections[selection].selectionSet)
    }
  }
  return result;
}

const person = {
  type: Person,
  args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
  resolve: async (parent, args, context, resolveInfo) => {
    pers = await dbmodel.Person.findOne({ where: args, include: [dbmodel.BodyWeight] });
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
      results = await dbmodel.Person.findAll({ where: args, include: [dbmodel.BodyWeight] });
      results = results.filter((pers) => {
        return pers.age == age
      })
    } else {
      results = await dbmodel.Person.findAll({ where: args, include: [dbmodel.BodyWeight] });
    }
    return results
  }
}

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

const addPerson = {
  type: Person,
  args: {
    name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    surname: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    gender: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    DOB: { type: GraphQLDate },
    bodyweight: { type: graphql.GraphQLFloat },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    existingPerson = await dbmodel.Person.findOne({ where: { name: args.name, surname: args.surname } });
    if (existingPerson) return existingPerson;
    newPerson = await dbmodel.Person.create({
      name: args.name,
      surname: args.surname,
      gender: args.gender,
      DOB: args.DOB,
      bodyWeight: { weight: args.bodyWeight }
    }, { include: [dbmodel.BodyWeight] })
    if ("bodyweight" in args) {
      bodyweight = await dbmodel.BodyWeight.create({
        weight: args.bodyweight
      })
      await newPerson.addBodyWeights(bodyweight)
    }
    return newPerson;
  }
}


const queries = { person, people }
const mutations = { updateBodyWeight, addPerson }

exports.Person = Person
exports.mutations = mutations
exports.queries = queries
