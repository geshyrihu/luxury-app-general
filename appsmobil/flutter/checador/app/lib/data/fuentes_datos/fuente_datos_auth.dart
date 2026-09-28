import 'package:dio/dio.dart';
import '../../core/network/dio_cliente.dart';

/// Fuente de datos remota para autenticación — llamadas HTTP directas al backend .NET.
class FuenteDatosAuth {
  final Dio _dio;

  FuenteDatosAuth({Dio? dio}) : _dio = dio ?? DioCliente.instancia;

  /// POST /api/Auth/Login — body: { userName, password, rememberMe }
  Future<Map<String, dynamic>> iniciarSesion({
    required String nombreUsuario,
    required String contrasena,
    required bool recordarSesion,
  }) async {
    final respuesta = await _dio.post<Map<String, dynamic>>(
      'Auth/Login',
      data: {
        'userName': nombreUsuario,
        'password': contrasena,
        'rememberMe': recordarSesion,
      },
    );
    return respuesta.data ?? {};
  }

  /// POST /api/Auth/RecoverPassword — body: { email }
  Future<Map<String, dynamic>> recuperarContrasena(String email) async {
    final respuesta = await _dio.post<Map<String, dynamic>>(
      'Auth/RecoverPassword',
      data: {'email': email},
    );
    return respuesta.data ?? {};
  }

  /// POST /api/Auth/ConfirmRecoverPassword — body: { email, token, newPassword }
  Future<Map<String, dynamic>> confirmarRecuperacion({
    required String email,
    required String token,
    required String nuevaContrasena,
  }) async {
    final respuesta = await _dio.post<Map<String, dynamic>>(
      'Auth/ConfirmRecoverPassword',
      data: {
        'email': email,
        'token': token,
        'newPassword': nuevaContrasena,
      },
    );
    return respuesta.data ?? {};
  }

  /// POST /api/Auth/Logout — fire-and-forget
  Future<void> cerrarSesionRemota() async {
    try {
      await _dio.post<void>('Auth/Logout');
    } catch (_) {}
  }
}
