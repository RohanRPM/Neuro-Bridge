const { db } = require('./firebaseAdmin');
const { analyzeMood } = require('./ai/text_analysis');

module.exports = {
  Query: {
    // Always return an array, never null
    getJournalEntries: async (parent, args, context) => {
      try {
        // (Optional) if you want per‑user entries:
        // const { userId } = context;
        // let ref = db.collection('journalEntries');
        // if (userId) ref = ref.where('userId','==',userId);

        const snapshot = await db.collection('journalEntries').get();
        const entries = snapshot.docs.map(doc => ({
          id: doc.id,
          userId: doc.data().userId,
          text: doc.data().text,
          createdAt: doc.data().createdAt,
        }));
        return entries;
      } catch (err) {
        console.error('Error in getJournalEntries:', err);
        return []; 
      }
    }
  },

  Mutation: {
    createJournalEntry: async (parent, { text }, context) => {
      try {
        // require authentication
        const userId = context.userId || 'testUser';
        // if (!userId) {
        //   throw new Error('Not authenticated');
        // }

        // 1) analyze mood
        const { score, valence } = await analyzeMood(text);

        // 2) write entry
        const createdAt = new Date().toISOString();
        const ref = await db.collection('journalEntries').add({
          userId,
          text,
          createdAt
        });
        const entryId = ref.id;

        // 3) return MoodScore
        return { entryId, score, valence };
      } catch (err) {
        console.error('Error in createJournalEntry:', err);
        throw err;
      }
    }
  }
};
