import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Interceptor que inyecta el JWT Bearer en cada petición saliente.
/// Si el servidor devuelve 401, invoca el callback de sesión expirada.
class InterceptorToken extends Interceptor {
  final FlutterSecureStorage _almacenamiento;

  /// Callback que se invoca cuando el token expira (401).
  /// Debe navegar al login y limpiar el estado Riverpod.
  final void Function()? alExpirarSesion;

  InterceptorToken({
    FlutterSecureStorage? almacenamiento,
    this.alExpirarSesion,
  }) : _almacenamiento = almacenamiento ?? const FlutterSecureStorage();

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _almacenamiento.read(key: 'luxury_jwt_token');

    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    return handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Token expirado o inválido — notificar a la app
      alExpirarSesion?.call();
    }
    return handler.next(err);
  }
}
