const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    email: String!
  }

  type JournalEntry {
    id: ID!
    userId: ID!
    text: String!
    createdAt: String!
    score: Float!       # include for convenience
    valence: String!
  }

  type Query {
    # fetch all my entries, optional date range
    getMyEntries(
      after: String    # ISO date to paginate
      limit: Int = 50
    ): [JournalEntry!]!
  }

  type Mutation {
    createJournalEntry(text: String!): JournalEntry!
    deleteJournalEntry(id: ID!): Boolean!

  }

  type MoodScore {
    entryId: ID!
    score: Int!
    valence: String!
  }



`;