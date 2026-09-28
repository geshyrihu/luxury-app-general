import 'package:dio/dio.dart';

/// Interceptor de logging para depuración en entorno de desarrollo.
/// Solo registra en consola — nunca en producción.
class InterceptorLog extends Interceptor {
  final bool habilitado;

  const InterceptorLog({this.habilitado = true});

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (habilitado) {
      // ignore: avoid_print
      print('[RED] → ${options.method} ${options.uri}');
    }
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    if (habilitado) {
      // ignore: avoid_print
      print('[RED] ← ${response.statusCode} ${response.requestOptions.uri}');
    }
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (habilitado) {
      // ignore: avoid_print
      print(
        '[RED] ✗ ${err.response?.statusCode ?? "SIN_RESPUESTA"} '
        '${err.requestOptions.uri} — ${err.message}',
      );
    }
    handler.next(err);
  }
}
