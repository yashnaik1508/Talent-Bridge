import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DioClient {
  final Dio _dio = Dio();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:8086/api';
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      // Use 10.0.2.2 for Android Emulator
      // Use your machine's LAN IP (e.g., 192.168.1.100) for Physical Device
      // Currently set to LAN IP for physical device testing
      return 'http://192.168.1.102:8086/api';
    }
    return 'http://localhost:8086/api';
  }

  DioClient() {
    _dio
      ..options.baseUrl = baseUrl
      ..options.connectTimeout = const Duration(seconds: 10)
      ..options.receiveTimeout = const Duration(seconds: 10)
      ..interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) async {
            final token = await _storage.read(key: 'jwt_token');
            if (token != null) {
              options.headers['Authorization'] = 'Bearer $token';
            }
            return handler.next(options);
          },
          onError: (DioException e, handler) {
            // Handle global errors (e.g., 401 Unauthorized -> Logout)
            if (e.response?.statusCode == 401) {
              // TODO: Trigger logout
            }
            return handler.next(e);
          },
        ),
      );
  }

  Dio get dio => _dio;
}
