/// Contrato base para fuentes de datos de autenticación.
/// Cada app implementa este contrato + sus endpoints extra (si aplica).
abstract interface class IFuenteDatosAuthBase {
  /// POST /api/Auth/Login
  /// Body: { userName, password, rememberMe }
  Future<Map<String, dynamic>> iniciarSesion({
    required String nombreUsuario,
    required String contrasena,
    required bool recordarSesion,
  });

  /// POST /api/Auth/ConfirmRecoverPassword
  /// Body: { email, token, newPassword }
  Future<Map<String, dynamic>> confirmarRecuperacion({
    required String email,
    required String token,
    required String nuevaContrasena,
  });

  /// POST /api/Auth/Logout (fire-and-forget, ignora errores)
  Future<void> cerrarSesionRemota();

  /// POST /api/auth/refresh — sin body: el refresh token viaja en una cookie
  /// HttpOnly que el backend setea en el login (nunca en el JSON de respuesta).
  /// Requiere que el [Dio] inyectado persista cookies (ver [AuthDioFactory]).
  Future<Map<String, dynamic>> refrescarToken();
}
