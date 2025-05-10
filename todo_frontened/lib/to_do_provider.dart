import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class TodoProvider extends ChangeNotifier {
  List<String> todos = [];

  Future<void> fetchTodos() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:3000/todos'));
      print('Fetch todos response: ${response.statusCode} ${response.body}');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as List;
        todos = data.map((e) => e['title'].toString()).toList();
        notifyListeners();
      } else {
        print('Failed to fetch todos: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching todos: $e');
    }
  }

  Future<void> addTodo(String todo) async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/todos'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'title': todo}),
      );
      if (response.statusCode == 201) {
        todos.add(todo);
        notifyListeners();
      } else {
        print('Failed to add todo: ${response.statusCode}');
      }
    } catch (e) {
      print('Error adding todo: $e');
    }
  }

  Future<void> deleteTodo(String todo) async {
    try {
      final response = await http.delete(
        Uri.parse('http://localhost:3000/todos'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'title': todo}),
      );
      if (response.statusCode == 200) {
        todos.remove(todo);
        notifyListeners();
      } else {
        print('Failed to delete todo: ${response.statusCode}');
      }
    } catch (e) {
      print('Error deleting todo: $e');
    }
  }

  Future<void> updateTodo(String oldTitle, String newTitle) async {
    try {
      final response = await http.patch(
        Uri.parse('http://localhost:3000/todos'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'oldTitle': oldTitle, 'newTitle': newTitle}),
      );
      if (response.statusCode == 200) {
        final index = todos.indexOf(oldTitle);
        if (index != -1) {
          todos[index] = newTitle;
          notifyListeners();
        }
      } else {
        print('Failed to update todo: ${response.statusCode}');
      }
    } catch (e) {
      print('Error updating todo: $e');
    }
  }
}