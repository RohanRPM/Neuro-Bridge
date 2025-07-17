import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../models/journal_entry.dart';

class TimelineScreen extends StatelessWidget {
  final List<JournalEntry> entries;
  TimelineScreen({required this.entries});

  @override
  Widget build(BuildContext context) {
    final data = _groupByWeek(entries);
    return LineChart(LineChartData(
      lineBarsData: [LineChartBarData(
        spots: data.entries.map((e) => FlSpot(e.key.toDouble(), e.value)).toList(),
      )],
    ));
  }

  Map<int, double> _groupByWeek(List<JournalEntry> entries) {
    final map = <int, List<int>>{};
    for (var e in entries) {
      final week = DateTime.parse(e.createdAt).weekday;
      map.putIfAbsent(week, () => []).add(e.score);
    }
    return map.map((k,v) => MapEntry(k, v.reduce((a,b)=>a+b)/v.length));
  }
}