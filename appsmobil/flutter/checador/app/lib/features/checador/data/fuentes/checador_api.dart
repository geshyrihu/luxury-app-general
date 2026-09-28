import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../../../core/network/dio_cliente.dart';
import '../modelos/registro_checador.dart';

class CheckadorApi {
  CheckadorApi._();
  static final CheckadorApi instancia = CheckadorApi._();

  final Dio _dio = DioCliente.instancia;

  /// Registra un movimiento de asistencia.
  /// Lanza [Exception] con el mensaje del servidor si falla — el llamador decide cómo mostrarlo.
  Future<RegistroChecador> registrar({
    required String tipo,
    double? latitud,
    double? longitud,
    String? ubicacion,
    required String dispositivoId,
    File? foto,
    String? notaAnomalia,
  }) async {
    final formData = FormData.fromMap({
      'tipo': tipo,
      'latitud': latitud?.toString(),
      'longitud': longitud?.toString(),
      'ubicacion': ubicacion,
      'dispositivoId': dispositivoId,
      'notaAnomalia': notaAnomalia,
      if (foto != null)
        'foto': await MultipartFile.fromFile(
          foto.path,
          filename: 'selfie_${DateTime.now().millisecondsSinceEpoch}.jpg',
        ),
    });

    try {
      final resp = await _dio.post<Map<String, dynamic>>(
        'chekador-empleados/registrar',
        data: formData,
      );
      final json  = resp.data ?? {};
      final exitoso = json['success'] as bool? ?? false;
      final datos   = json['data']   as Map<String, dynamic>?;
      final mensaje = json['message'] as String? ?? 'Error desconocido';

      if (!exitoso || datos == null) {
        throw Exception(mensaje);
      }
      return RegistroChecador.fromJson(datos);
    } on DioException catch (e) {
      final status = e.response?.statusCode;
      final body   = e.response?.data;
      final msg    = body is Map ? body['message']?.toString() : null;
      debugPrint('❌ [CheckadorApi.registrar] $status — ${e.message}');
      debugPrint('   Body: $body');
      throw Exception(msg ?? 'Error de red: ${e.type.name}');
    }
  }

  Future<List<RegistroChecador>> misRegistros({
    int pagina = 1,
    int tamano = 20,
  }) async {
    final resp = await _dio.get(
      '/chekador-empleados/mis-registros',
      queryParameters: {'pagina': pagina, 'tamano': tamano},
    );
    final lista = resp.data?['data'] as List<dynamic>? ?? [];
    return lista
        .map((e) => RegistroChecador.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<ResumenAsistencia?> resumenHoy() async {
    final resp = await _dio.get('/chekador-empleados/resumen-hoy');
    final data = resp.data?['data'];
    if (data == null) return null;
    return ResumenAsistencia.fromJson(data as Map<String, dynamic>);
  }
}
