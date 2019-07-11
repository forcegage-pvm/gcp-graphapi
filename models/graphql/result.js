const graphql = require('graphql')

// Sets
const ResultSet = new graphql.GraphQLObjectType({
    name: 'ResultSet',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        count: { type: graphql.GraphQLInt },
        success: { type: graphql.GraphQLBoolean},
        duration: { type: graphql.GraphQLInt },
        message: { type: graphql.GraphQLString},
    })
})

exports.ResultSet = ResultSet