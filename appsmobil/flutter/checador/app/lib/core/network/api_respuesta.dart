class ApiRespuesta<T> {
  final bool success;
  final T? data;
  final String? message;

  const ApiRespuesta({
    required this.success,
    this.data,
    this.message,
  });

  factory ApiRespuesta.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromData,
  ) {
    return ApiRespuesta(
      success: json['success'] as bool? ?? false,
      data: json['data'] != null ? fromData(json['data']) : null,
      message: json['message'] as String?,
    );
  }
}

/// Modelo genérico que refleja el estándar ApiResponseDTO<T> del backend .NET.
/// Misma interfaz que mobile_commite — usado por RepositorioAuth.
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
}
