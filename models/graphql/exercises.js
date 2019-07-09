const graphql = require('graphql')
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-iso-date');
const dbmodel = require('../../models/db/dbmodel')
const Sequelize = require('sequelize');

const Exercise = new graphql.GraphQLObjectType({
  name: 'Exercise',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    cd: { type: graphql.GraphQLInt },
    description: { type: graphql.GraphQLString },
  })
});

const addExercise = {
  type: Exercise,
  args: {
    description: {type: graphql.GraphQLNonNull(graphql.GraphQLString) },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    allExercises = await dbmodel.Exercise.findAll({ order: Sequelize.literal("cd DESC")});
    ex = await dbmodel.Exercise.create({
      cd: allExercises.length + 1,
      description: args.description,
    })
    return ex;
  }
}

const exercise = {
  type: Exercise,
  args: { 
    id: { type: graphql.GraphQLInt },
    cd: { type: graphql.GraphQLInt },
   },
  resolve: async (parent, args, context, resolveInfo) => {
    exerc = await dbmodel.Exercise.findOne({ where: args});
    return exerc;
  }
}

const exercises = {
  type: new graphql.GraphQLList(Exercise),
  resolve: async (parent, args, context, resolveInfo) => {
    return await dbmodel.Exercise.findAll();
  }
}

const queries = {exercise, exercises}
const mutations = {addExercise}

exports.Exercise = Exercise
exports.mutations = mutations
exports.queries = queries
