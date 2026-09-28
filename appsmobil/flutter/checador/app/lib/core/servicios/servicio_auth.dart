import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import '../config/app_config.dart';

/// Gestiona la sesión JWT del empleado — idéntico a mobile_commite/ServicioAuth.
/// Inyectable vía Riverpod (no singleton) para testabilidad.
class ServicioAuth {
  final FlutterSecureStorage _almacenamiento;

  ServicioAuth({FlutterSecureStorage? almacenamiento})
      : _almacenamiento = almacenamiento ?? const FlutterSecureStorage();

  // ── Token ─────────────────────────────────────────────────────────────────

  Future<void> guardarToken(String token) async {
    await _almacenamiento.write(key: AppConfig.claveToken, value: token);
  }

  Future<String?> leerToken() async {
    return _almacenamiento.read(key: AppConfig.claveToken);
  }

  Future<bool> sesionActiva() async {
    final token = await leerToken();
    if (token == null || token.isEmpty) return false;
    try {
      return !JwtDecoder.isExpired(token);
    } catch (_) {
      return false;
    }
  }

  // ── Perfil ────────────────────────────────────────────────────────────────

  Future<void> guardarPerfilUsuario(String perfilJson) async {
    await _almacenamiento.write(
        key: AppConfig.clavePerfilUsuario, value: perfilJson);
  }

  Future<String?> leerPerfilUsuario() async {
    return _almacenamiento.read(key: AppConfig.clavePerfilUsuario);
  }

  // ── Claims JWT ────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> obtenerClaims() async {
    final token = await leerToken();
    if (token == null || token.isEmpty) return {};
    try {
      return JwtDecoder.decode(token);
    } catch (_) {
      return {};
    }
  }

  Future<String?> obtenerIdUsuario() async {
    final claims = await obtenerClaims();
    return claims['sub']?.toString() ??
        claims['userId']?.toString() ??
        claims['nameid']?.toString();
  }

  Future<String?> obtenerEmail() async {
    final claims = await obtenerClaims();
    return claims['email']?.toString() ?? claims['unique_name']?.toString();
  }

  // ── Cierre de sesión ──────────────────────────────────────────────────────

  Future<void> cerrarSesion() async {
    await Future.wait([
      _almacenamiento.delete(key: AppConfig.claveToken),
      _almacenamiento.delete(key: AppConfig.clavePerfilUsuario),
      _almacenamiento.delete(key: AppConfig.claveUsuario),
      _almacenamiento.delete(key: AppConfig.claveContrasena),
      _almacenamiento.delete(key: AppConfig.claveRecordarSesion),
    ]);
  }

  // ── Recordar credenciales ─────────────────────────────────────────────────

  Future<void> guardarCredencialesRecordadas(
      String userName, String contrasena) async {
    await Future.wait([
      _almacenamiento.write(key: AppConfig.claveUsuario, value: userName),
      _almacenamiento.write(key: AppConfig.claveContrasena, value: contrasena),
      _almacenamiento.write(
          key: AppConfig.claveRecordarSesion, value: 'true'),
    ]);
  }

  Future<({String email, String contrasena})?> leerCredencialesRecordadas() async {
    final recordar =
        await _almacenamiento.read(key: AppConfig.claveRecordarSesion);
    if (recordar != 'true') return null;

    final usuario =
        await _almacenamiento.read(key: AppConfig.claveUsuario);
    final contrasena =
        await _almacenamiento.read(key: AppConfig.claveContrasena);
    if (usuario == null || contrasena == null) return null;
    return (email: usuario, contrasena: contrasena);
  }

  Future<void> limpiarCredencialesRecordadas() async {
    await Future.wait([
      _almacenamiento.delete(key: AppConfig.claveUsuario),
      _almacenamiento.delete(key: AppConfig.claveContrasena),
      _almacenamiento.delete(key: AppConfig.claveRecordarSesion),
    ]);
  }
}
