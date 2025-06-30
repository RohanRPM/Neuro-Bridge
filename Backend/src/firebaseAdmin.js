// src/firebaseAdmin.js
const admin = require('firebase-admin');

if (process.env.NODE_ENV === 'production') {
  // Heroku environment
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString()
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
} else {
  // Local development
  require('dotenv').config();
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: `https://${process.env.FB_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();
module.exports = { admin, db };