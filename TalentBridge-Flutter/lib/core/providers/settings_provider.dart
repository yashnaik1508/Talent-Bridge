import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsProvider with ChangeNotifier {
  bool _isDarkMode = true;
  bool _showStatsCards = true;
  bool _showRecentActivity = true;
  bool _showQuickInsights = true;
  String _defaultPage = 'Dashboard';

  bool get isDarkMode => _isDarkMode;
  bool get showStatsCards => _showStatsCards;
  bool get showRecentActivity => _showRecentActivity;
  bool get showQuickInsights => _showQuickInsights;
  String get defaultPage => _defaultPage;

  SettingsProvider() {
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    _isDarkMode = prefs.getBool('isDarkMode') ?? true;
    _showStatsCards = prefs.getBool('showStatsCards') ?? true;
    _showRecentActivity = prefs.getBool('showRecentActivity') ?? true;
    _showQuickInsights = prefs.getBool('showQuickInsights') ?? true;
    _defaultPage = prefs.getString('defaultPage') ?? 'Dashboard';
    notifyListeners();
  }

  Future<void> toggleTheme(bool value) async {
    _isDarkMode = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDarkMode', _isDarkMode);
    notifyListeners();
  }

  Future<void> toggleStatsCards(bool value) async {
    _showStatsCards = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('showStatsCards', _showStatsCards);
    notifyListeners();
  }

  Future<void> toggleRecentActivity(bool value) async {
    _showRecentActivity = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('showRecentActivity', _showRecentActivity);
    notifyListeners();
  }

  Future<void> toggleQuickInsights(bool value) async {
    _showQuickInsights = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('showQuickInsights', _showQuickInsights);
    notifyListeners();
  }

  Future<void> setDefaultPage(String value) async {
    _defaultPage = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('defaultPage', _defaultPage);
    notifyListeners();
  }
}
