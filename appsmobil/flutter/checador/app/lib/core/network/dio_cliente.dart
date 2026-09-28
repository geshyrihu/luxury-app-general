import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/app_config.dart';

/// Singleton de Dio configurado — mismo patrón que mobile_commite/ClienteDio.
class DioCliente {
  DioCliente._();

  static Dio? _instancia;

  static Dio get instancia {
    _instancia ??= _construir();
    return _instancia!;
  }

  static void reiniciar() => _instancia = _construir();

  static Dio _construir() {
    final dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        connectTimeout: AppConfig.tiempoConexion,
        receiveTimeout: AppConfig.tiempoRespuesta,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    if (kDebugMode) {
      dio.interceptors.add(_InterceptorLog());
    }
    dio.interceptors.add(_InterceptorToken());

    return dio;
  }
}

class _InterceptorLog extends Interceptor {
  @override
  void onRequest(RequestOptions o, RequestInterceptorHandler h) {
    debugPrint('▶ [Dio] ${o.method} ${o.uri}');
    debugPrint('   Body: ${o.data}');
    h.next(o);
  }

  @override
  void onResponse(Response r, ResponseInterceptorHandler h) {
    debugPrint('✅ [Dio] ${r.statusCode} ${r.requestOptions.uri}');
    h.next(r);
  }

  @override
  void onError(DioException e, ErrorInterceptorHandler h) {
    debugPrint('❌ [Dio] ${e.type.name} — ${e.message}');
    debugPrint('   URL: ${e.requestOptions.uri}');
    if (e.response != null) {
      debugPrint('   Status: ${e.response?.statusCode}');
      debugPrint('   Body: ${e.response?.data}');
    }
    h.next(e);
  }
}

class _InterceptorToken extends Interceptor {
  final _storage = const FlutterSecureStorage();

  @override
  Future<void> onRequest(
      RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _storage.read(key: AppConfig.claveToken);
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      _storage.delete(key: AppConfig.claveToken);
    }
    handler.next(err);
  }
}
