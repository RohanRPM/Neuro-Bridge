const Sentiment = require('sentiment');
const sentiment = new Sentiment();

async function analyzeMood(text) {
  try {
    const result = sentiment.analyze(text);
    let valence = 'NEUTRAL';
    let score = 0;
    
    if (result.score > 0) {
      valence = 'POSITIVE';
      score = 1;
    } else if (result.score < 0) {
      valence = 'NEGATIVE';
      score = -1;
    }
    
    return { score, valence };
  } catch (error) {
    console.error('Mood analysis failed:', error);
    return { score: 0, valence: 'NEUTRAL' };
  }
}