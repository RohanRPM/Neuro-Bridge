require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { admin } = require('./firebaseAdmin');

async function startServer() {
  const app = express();
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Extract authorization token
      const token = req.headers.authorization || '';
      
      if (token) {
        try {
          // Remove "Bearer " prefix
          const idToken = token.replace('Bearer ', '');
          const decodedToken = await admin.auth().verifyIdToken(idToken);
          return { userId: decodedToken.uid };
        } catch (error) {
          console.error('Token verification failed:', error);
          return {};
        }
      }
      return {};
    }
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();