import os
import numpy as np
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments
)
from sklearn.metrics import accuracy_score, f1_score


def compute_metrics(pred):
    labels = pred.label_ids
    preds = np.argmax(pred.predictions, axis=-1)
    return {
        'accuracy': accuracy_score(labels, preds),
        'f1': f1_score(labels, preds)
    }


def main():
    # Paths
    train_path = os.path.join('data', 'suicide_watch', 'train.csv')
    valid_path = os.path.join('data', 'suicide_watch', 'valid.csv')

    # Load raw dataset
    raw = load_dataset(
        'csv',
        data_files={
            'train': train_path,
            'validation': valid_path
        }
    )

    # Initialize tokenizer
    tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')

    # Tokenization function
    def tokenize_fn(example):
        return tokenizer(
            example['text'],
            truncation=True,
            padding='max_length',
            max_length=128
        )

    # Apply tokenization
    tokenized = raw.map(tokenize_fn, batched=True)

    # Cleanup columns and set format
    tokenized = tokenized.remove_columns(['text'])
    tokenized = tokenized.rename_column('label', 'labels')
    tokenized.set_format('torch')

    # Load pre-trained classification model
    model = AutoModelForSequenceClassification.from_pretrained(
        'distilbert-base-uncased', num_labels=2
    )

    # Training arguments
    training_args = TrainingArguments(
        output_dir='results/reddit',
        num_train_epochs=3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=32,
        evaluation_strategy='epoch',
        save_strategy='epoch',
        logging_dir='logs/reddit',
        load_best_model_at_end=True,
        metric_for_best_model='eval_loss'
    )

    # Initialize Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized['train'],
        eval_dataset=tokenized['validation'],
        compute_metrics=compute_metrics
    )

    # Train the model
    trainer.train()

    # Evaluate on validation set
    metrics = trainer.evaluate()
    print("Validation metrics:", metrics)

    # Save the best model
    best_model_dir = os.path.join('results', 'reddit', 'best_model')
    trainer.save_model(best_model_dir)
    print(f"Best model saved to {best_model_dir}")


if __name__ == '__main__':
    main()
