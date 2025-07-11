// src/index.js

require('dotenv').config();           // loads .env in dev
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const { admin } = require('./firebaseAdmin');
const typeDefs  = require('./schema');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();

  // Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Grab the auth token from headers
      const authHeader = req.headers.authorization || '';
      const idToken = authHeader.replace('Bearer ', '');

      if (idToken) {
        try {
          const decoded = await admin.auth().verifyIdToken(idToken);
          return { userId: decoded.uid };
        } catch (err) {
          console.warn('⚠️  Invalid or expired token:', err.message);
          // return empty context so resolvers know user is unauthenticated
        }
      }
      return {};
    }
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Optional: health-check endpoint
  app.get('/healthz', (_req, res) => res.send('OK'));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
