# src/ai/text_analysis.py
from transformers import pipeline

mood_analyzer = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")

def analyze_mood(text):
    result = mood_analyzer(text)[0]
    label = result['label']
    
    if label == 'POSITIVE':
        return {'score': 1, 'valence': 'POSITIVE'}
    elif label == 'NEGATIVE':
        return {'score': -1, 'valence': 'NEGATIVE'}
    else:
        return {'score': 0, 'valence': 'NEUTRAL'}
