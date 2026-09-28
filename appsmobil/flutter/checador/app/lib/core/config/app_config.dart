class AppConfig {
  AppConfig._();

  // ── Entorno activo ────────────────────────────────────────────────────────
  static const String _entorno =
      String.fromEnvironment('ENTORNO', defaultValue: 'dev');

  static bool get esProduccion => _entorno == 'prod';
  static bool get esDesarrollo => _entorno == 'dev';

  // ── URLs base ─────────────────────────────────────────────────────────────
  // Misma URL que Angular environment.ts: http://localhost:7070/
  // Puerto 7070 = HTTP — evita fallos de TLS con certificado auto-firmado de .NET.
  // REQUISITO: ejecutar UNA VEZ por sesión antes de `flutter run`:
  //   adb reverse tcp:7070 tcp:7070
  // Esto mapea localhost:7070 del dispositivo → localhost:7070 del PC.
  static const String _urlApiDev  = 'http://localhost:7070/api/';
  static const String _urlApiProd = 'https://luxurybuildingapp.com/api/';

  // Para desarrollo local con Dev Tunnel de Visual Studio:
  // static const String _urlApiDev = 'https://673nm10h-7069.usw3.devtunnels.ms/api/';

  static String get baseUrl => esProduccion ? _urlApiProd : _urlApiDev;

  // ── Timeouts ──────────────────────────────────────────────────────────────
  static const Duration tiempoConexion  = Duration(seconds: 30);
  static const Duration tiempoRespuesta = Duration(seconds: 60);

  // ── Claves de almacenamiento seguro ───────────────────────────────────────
  static const String claveToken             = 'luxury_jwt_token';
  static const String claveUsuario           = 'savedUsername';
  static const String claveContrasena        = 'savedPassword';
  static const String claveRecordarSesion    = 'luxury_recordar_sesion';
  static const String clavePerfilUsuario     = 'luxury_perfil_usuario';
}
