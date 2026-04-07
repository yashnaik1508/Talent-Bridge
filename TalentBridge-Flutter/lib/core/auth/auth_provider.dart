import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import '../api/dio_client.dart';

class AuthProvider with ChangeNotifier {
  final DioClient _dioClient = DioClient();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  bool _isAuthenticated = false;
  String? _token;
  Map<String, dynamic>? _userPayload;

  bool get isAuthenticated => _isAuthenticated;
  Map<String, dynamic>? get userPayload => _userPayload;

  Future<void> checkAuth() async {
    final token = await _storage.read(key: 'jwt_token');
    if (token != null && !JwtDecoder.isExpired(token)) {
      _token = token;
      _userPayload = JwtDecoder.decode(token);
      _isAuthenticated = true;
    } else {
      _isAuthenticated = false;
      _token = null;
      _userPayload = null;
    }
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    try {
      print('DEBUG: Attempting login for $email');
      final response = await _dioClient.dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      print('DEBUG: Login response status: ${response.statusCode}');
      print('DEBUG: Login response data: ${response.data}');

      if (response.statusCode == 200) {
        final token = response.data['token'];
        if (token != null) {
          await _storage.write(key: 'jwt_token', value: token);
          await checkAuth();
          return true;
        } else {
          print('DEBUG: Token is null in response');
        }
      }
    } catch (e) {
      print('DEBUG: Login failed with error: $e');
    }
    return false;
  }

  Future<void> logout() async {
    await _storage.delete(key: 'jwt_token');
    _isAuthenticated = false;
    _token = null;
    _userPayload = null;
    notifyListeners();
  }
}
