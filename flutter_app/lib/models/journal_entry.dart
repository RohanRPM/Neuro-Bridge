class JournalEntry {
  final String id;
  final String text;
  final String createdAt;
  final int score;
  final String valence;

  JournalEntry({
    required this.id,
    required this.text,
    required this.createdAt,
    required this.score,
    required this.valence,
  });

  factory JournalEntry.fromJson(Map<String, dynamic> json) {
    return JournalEntry(
      id: json['id'] as String,
      text: json['text'] as String,
      createdAt: json['createdAt'] as String,
      score: json['score'] as int,
      valence: json['valence'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'createdAt': createdAt,
      'score': score,
      'valence': valence,
    };
  }
}