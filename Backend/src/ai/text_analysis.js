const { HfInference } = require('@huggingface/inference');
const hf = new HfInference(process.env.HF_API_KEY);

/**
 * analyzeMood(text):
 *  Returns { score: -1|0|1, valence: 'NEGATIVE'|'NEUTRAL'|'POSITIVE' }
 */
async function analyzeMood(text) {
  const input = text.trim();
  if (!input) {
    return { score: 0, valence: 'NEUTRAL' };
  }

  // use the correct method name!
  const [res] = await hf.textClassification({
    model: 'distilbert-base-uncased-finetuned-sst-2-english',
    inputs: input
  });

  // res: { label: 'POSITIVE'|'NEGATIVE', score: 0.99 }
  let score = 0;
  if (res.label === 'POSITIVE') score = 1;
  else if (res.label === 'NEGATIVE') score = -1;

  return {
    score,
    valence: res.label
  };
}

module.exports = { analyzeMood };
