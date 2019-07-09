const person = require('./person')
const session = require('./session')
const exercise = require('./exercises')
const graphql = require('graphql')

const QueryRoot = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      person: person.queries.person,
      people: person.queries.people,
      session: session.queries.session,
      sessions: session.queries.sessions,
      exercise: exercise.queries.exercise,
      exercises: exercise.queries.exercises,
    })
  })

  const MutationRoot = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      updateBodyWeight: person.mutations.updateBodyWeight,
      addSession: session.mutations.addSession,
      addExercise: exercise.mutations.addExercise
    })
  })

const schema = new graphql.GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });
// const schema = new graphql.GraphQLSchema({ query: QueryRoot});


exports.Person = person.Person;
exports.qlSchema = schema;