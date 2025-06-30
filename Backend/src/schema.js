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
  }

  type MoodScore {
    entryId: ID!
    score: Int!
    valence: String!
  }

  type Query {
    getJournalEntries: [JournalEntry!]!  # Removed userId argument
  }

  type Mutation {
    createJournalEntry(text: String!): MoodScore!  # Removed userId argument
  }
`;