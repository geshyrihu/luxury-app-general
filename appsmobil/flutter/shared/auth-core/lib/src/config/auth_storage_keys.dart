/// Claves centralizadas de almacenamiento seguro para autenticación.
/// Usado por [ServicioAuth] — las apps pueden usar estos valores por defecto
/// o pasar claves personalizadas al constructor de [ServicioAuth].
class AuthStorageKeys {
  AuthStorageKeys._();

  /// JWT Bearer token del usuario autenticado.
  static const String claveToken = 'luxury_jwt_token';

  /// Refresh token (si el backend lo devuelve).
  static const String claveRefreshToken = 'luxury_refresh_token';

  /// JSON serializado del perfil ([PerfilUsuario]) para persistencia.
  static const String clavePerfilUsuario = 'luxury_perfil_usuario';

  /// JSON serializado de la lista de accesos a clientes ([AccesoCliente])
  /// para persistencia — sin esto, el auto-login pierde el selector de cliente.
  static const String claveAccesosCliente = 'luxury_accesos_cliente';

  /// Flag booleano (string 'true'/'false') que indica si el usuario marcó "recordarme".
  static const String claveRecordarSesion = 'luxury_recordar_sesion';

  /// Usuario/email recordado (solo si [claveRecordarSesion] == 'true').
  static const String claveUsuarioRecordado = 'luxury_usuario_recordado';

  /// Contraseña recordada en texto plano (solo si [claveRecordarSesion] == 'true').
  static const String claveContrasenaRecordada = 'luxury_contrasena_recordada';
}
