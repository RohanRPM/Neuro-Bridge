import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'firebase_options.dart';
import 'graphql_client.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/journal_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  await initHiveForFlutter(); // For GraphQL cache
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GraphQLProvider(
      client: GraphQLService.client,
      child: CacheProvider(
        child: MaterialApp(
          title: 'NeuroBridge',
          initialRoute: '/login',
          routes: {
            '/login': (_) => LoginScreen(),
            '/signup': (_) => SignUpScreen(),
            '/journal': (_) => JournalScreen(),
          },
        ),
      ),
    );
  }
}
