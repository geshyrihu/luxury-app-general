/// Modelo genérico que refleja el estándar `ApiResponseDTO<T>` del backend .NET.
/// Documentación: PatternGuide/DOC-01-API-RESPONSE-STANDARD.md
class RespuestaApi<T> {
  final bool exitoso;
  final String mensaje;
  final T? datos;
  final int? codigoHttp;
  final List<String> errores;

  const RespuestaApi({
    required this.exitoso,
    required this.mensaje,
    this.datos,
    this.codigoHttp,
    this.errores = const [],
  });

  /// Construye desde el JSON crudo de la respuesta del servidor.
  /// Campos del backend .NET: success, message, data, errors, responseCode
  factory RespuestaApi.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) {
    return RespuestaApi<T>(
      exitoso: json['success'] as bool? ?? false,
      mensaje: json['message'] as String? ?? '',
      datos: json['data'] != null ? fromJsonT(json['data']) : null,
      codigoHttp: json['responseCode'] as int?,
      errores: (json['errors'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
    );
  }

  /// Respuesta de éxito sin datos (ej. operaciones void).
  factory RespuestaApi.exito({String mensaje = 'Operación exitosa.'}) {
    return RespuestaApi<T>(exitoso: true, mensaje: mensaje);
  }

  /// Respuesta de error generada localmente (sin llamada al servidor).
  factory RespuestaApi.error({
    required String mensaje,
    int? codigoHttp,
    List<String> errores = const [],
  }) {
    return RespuestaApi<T>(
      exitoso: false,
      mensaje: mensaje,
      codigoHttp: codigoHttp,
      errores: errores,
    );
  }

  @override
  String toString() =>
      'RespuestaApi(exitoso: $exitoso, mensaje: $mensaje, codigoHttp: $codigoHttp)';
}
