import tensorflow as tf
from transformers import TFAutoModelForSequenceClassification

# Convert text model
text_model = TFAutoModelForSequenceClassification.from_pretrained(
    "bhadresh-savani/distilbert-base-uncased-emotion"
)
converter = tf.lite.TFLiteConverter.from_keras_model(text_model)
tflite_model = converter.convert()
open("ai/text_model.tflite", "wb").write(tflite_model)

# Note: Voice model conversion requires PyTorch -> ONNX -> TFLite