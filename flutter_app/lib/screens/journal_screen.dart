import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:intl/intl.dart';
import '../models/journal_entry.dart';

class JournalScreen extends StatefulWidget {
  @override
  _JournalScreenState createState() => _JournalScreenState();
}

class _JournalScreenState extends State<JournalScreen> {
  final _controller = TextEditingController();
  List<JournalEntry> _entries = [];

  @override
  void initState() {
    super.initState();
    _loadEntries();
  }

  Future<void> _loadEntries() async {
    final client = GraphQLService.client.value;
    final result = await client.query(QueryOptions(
      document: gql(r'''
        query GetMyEntries {
          getMyEntries(limit: 50) {
            id text createdAt score valence
          }
        }
      '''),
    ));
    if (!result.hasException) {
      setState(() {
        _entries = (result.data!['getMyEntries'] as List)
            .map((e) => JournalEntry.fromJson(e))
            .toList();
      });
    }
  }

  Future<void> _addEntry() async {
    final client = GraphQLService.client.value;
    await client.mutate(MutationOptions(
      document: gql(r'''
        mutation CreateJournalEntry($text: String!) {
          createJournalEntry(text: $text) {
            id text createdAt score valence
          }
        }
      '''),
      variables: {'text': _controller.text},
    ));
    _controller.clear();
    _loadEntries();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('My Journal')),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(8),
            child: TextField(
              controller: _controller,
              decoration: InputDecoration(
                hintText: 'How are you feeling today?',
                suffixIcon: IconButton(
                  icon: Icon(Icons.send), onPressed: _addEntry,
                ),
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _entries.length,
              itemBuilder: (_, i) {
                final e = _entries[i];
                return ListTile(
                  title: Text(e.text),
                  subtitle: Text('${e.valence} (${e.score})'),
                  trailing: Text(DateFormat('MMM dd').format(
                    DateTime.parse(e.createdAt),
                  )),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}