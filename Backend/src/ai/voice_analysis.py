import torch
import torchaudio
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2FeatureExtractor

def analyze_voice(audio_path):
    # Load pre-trained model
    model = Wav2Vec2ForSequenceClassification.from_pretrained("superb/wav2vec2-base-superb-er")
    feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained("superb/wav2vec2-base-superb-er")
    
    # Process audio
    waveform, sample_rate = torchaudio.load(audio_path)
    inputs = feature_extractor(
        waveform.squeeze().numpy(), 
        sampling_rate=sample_rate, 
        return_tensors="pt",
        padding=True
    )
    
    # Predict
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Get results
    emotions = ["anger", "disgust", "fear", "joy", "neutral", "sadness", "surprise"]
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    top_emotion = emotions[torch.argmax(probs)]
    
    # Map to valence
    valence_map = {"joy": 1, "neutral": 0, "surprise": 0.5, "anger": -1, "sadness": -1, "fear": -1, "disgust": -1}
    
    return {
        "emotion": top_emotion,
        "score": valence_map.get(top_emotion, 0),
        "confidence": torch.max(probs).item()
    }

# Test with sample audio
if __name__ == "__main__":
    print(analyze_voice("sample.wav"))