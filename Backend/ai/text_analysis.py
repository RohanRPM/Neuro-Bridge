from transformers import pipeline

def analyze_mood(text):
    # Use a lightweight model for production
    analyzer = pipeline(
        "text-classification", 
        model="bhadresh-savani/distilbert-base-uncased-emotion",
        top_k=1
    )
    result = analyzer(text)[0][0]
    
    # Map to valence score
    valence_map = {
        "joy": 1, "love": 1, 
        "neutral": 0, "surprise": 0,
        "anger": -1, "sadness": -1, "fear": -1
    }
    
    return {
        "label": result["label"].upper(),
        "score": valence_map.get(result["label"], 0),
        "confidence": result["score"]
    }

# Test locally
if __name__ == "__main__":
    print(analyze_mood("I'm feeling great today!"))
    # Output: {'label': 'JOY', 'score': 1, 'confidence': 0.956}