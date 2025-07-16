const { db } = require('./firebaseAdmin');
const { analyzeMood } = require('./ai/text_analysis');

module.exports = {
  Query: {
    getMyEntries: async (_parent, { after, limit }, context) => {
      // const userId = context.userId;
      // if (!userId) {
      //   throw new Error('Not authenticated');
      // }
      const userId = context.userId || 'testUser'; 
      
      let query = db
      .collection('journalEntries')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');
      
      if (after) {
        query = query.startAfter(after);
      }
      
      query = query.limit(limit);
      
      const snap = await query.get();
      return snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          text: data.text,
          createdAt: data.createdAt,
          score: data.score,
          valence: data.valence
        };
      });
    }
  },

  Mutation: {
    createJournalEntry: async (_parent, { text }, context) => {
      // const userId = context.userId;
      // if (!userId) {
        //   throw new Error('Not authenticated');
        // }
        const userId = context.userId || 'testUser'; 
        if (text.trim().length === 0) {
        throw new Error('Text cannot be empty');
      }

      // 1) analyze
      const { score, valence } = await analyzeMood(text);
      const createdAt = new Date().toISOString();

      // 2) persist
      const entry = { userId, text, createdAt, score, valence };
      const ref = await db.collection('journalEntries').add(entry);

      // 3) return
      return { id: ref.id, ...entry };
    }
  }
};
