import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

import '../config/auth_storage_keys.dart';

/// Servicio que gestiona la sesión JWT del usuario.
class ServicioAuth {
  final FlutterSecureStorage _almacenamiento;

  ServicioAuth({
    FlutterSecureStorage? almacenamiento,
  })  : _almacenamiento = almacenamiento ?? const FlutterSecureStorage();

  // ── Persistencia de token ─────────────────────────────────────────────────

  /// Guarda el JWT en almacenamiento seguro.
  Future<void> guardarToken(String token) async {
    await _almacenamiento.write(key: AuthStorageKeys.claveToken, value: token);
  }

  /// Lee el JWT del almacenamiento seguro.
  Future<String?> leerToken() async {
    return _almacenamiento.read(key: AuthStorageKeys.claveToken);
  }

  /// Elimina todos los datos de sesión del almacenamiento.
  /// Borra: token, refresh token, perfil.
  /// Si la app marcó "recordarme" (claveRecordarSesion == 'true'), PRESERVA usuario+contraseña.
  /// Si NO marcó "recordarme", borra todo lo anterior.
  Future<void> cerrarSesion() async {
    // Siempre borrar token, refresh, perfil
    await Future.wait([
      _almacenamiento.delete(key: AuthStorageKeys.claveToken),
      _almacenamiento.delete(key: AuthStorageKeys.claveRefreshToken),
    ]);

    // Borrar perfil y accesos a clientes
    await Future.wait([
      _almacenamiento.delete(key: AuthStorageKeys.clavePerfilUsuario),
      _almacenamiento.delete(key: AuthStorageKeys.claveAccesosCliente),
    ]);

    // Verificar si "recordarme" estaba activo
    final recordar =
        await _almacenamiento.read(key: AuthStorageKeys.claveRecordarSesion);
    if (recordar != 'true') {
      // No estaba marcado "recordarme", borrar credenciales también
      await Future.wait([
        _almacenamiento.delete(key: AuthStorageKeys.claveUsuarioRecordado),
        _almacenamiento.delete(key: AuthStorageKeys.claveContrasenaRecordada),
        _almacenamiento.delete(key: AuthStorageKeys.claveRecordarSesion),
      ]);
    }
  }

  // ── Persistencia de perfil ────────────────────────────────────────────────

  /// Guarda el JSON del perfil serializado.
  Future<void> guardarPerfilUsuario(String perfilJson) async {
    await _almacenamiento.write(
      key: AuthStorageKeys.clavePerfilUsuario,
      value: perfilJson,
    );
  }

  /// Lee el JSON del perfil almacenado.
  Future<String?> leerPerfilUsuario() async {
    return _almacenamiento.read(key: AuthStorageKeys.clavePerfilUsuario);
  }

  // ── Persistencia de accesos a clientes ────────────────────────────────────

  /// Guarda el JSON serializado de la lista de [AccesoCliente].
  /// Sin esto, el auto-login (`_verificarSesionActiva`) no puede reconstruir
  /// el selector de cliente ni las peticiones que dependen de él.
  Future<void> guardarAccesosCliente(String accesosJson) async {
    await _almacenamiento.write(
      key: AuthStorageKeys.claveAccesosCliente,
      value: accesosJson,
    );
  }

  /// Lee el JSON de accesos a clientes almacenado.
  Future<String?> leerAccesosCliente() async {
    return _almacenamiento.read(key: AuthStorageKeys.claveAccesosCliente);
  }

  // ── Validación del token ──────────────────────────────────────────────────

  /// Verifica si el token almacenado es válido y no ha expirado.
  Future<bool> sesionActiva() async {
    final token = await leerToken();
    if (token == null || token.isEmpty) return false;

    try {
      return !JwtDecoder.isExpired(token);
    } catch (_) {
      return false;
    }
  }

  // ── Claims del token ─────────────────────────────────────────────────────

  /// Devuelve el mapa de claims del JWT, o un mapa vacío si no hay token.
  Future<Map<String, dynamic>> obtenerClaims() async {
    final token = await leerToken();
    if (token == null || token.isEmpty) return {};

    try {
      return JwtDecoder.decode(token);
    } catch (_) {
      return {};
    }
  }

  /// Obtiene el identificador (sub/userId) del usuario autenticado.
  Future<String?> obtenerIdUsuario() async {
    final claims = await obtenerClaims();
    return claims['sub']?.toString() ??
        claims['userId']?.toString() ??
        claims['nameid']?.toString();
  }

  /// Obtiene el email del usuario desde el JWT.
  Future<String?> obtenerEmail() async {
    final claims = await obtenerClaims();
    return claims['email']?.toString() ??
        claims['unique_name']?.toString();
  }

  // ── Recordar sesión ───────────────────────────────────────────────────────

  Future<void> guardarCredencialesRecordadas(
      String usuario, String contrasena) async {
    await Future.wait([
      _almacenamiento.write(key: AuthStorageKeys.claveUsuarioRecordado, value: usuario),
      _almacenamiento.write(
          key: AuthStorageKeys.claveContrasenaRecordada, value: contrasena),
      _almacenamiento.write(key: AuthStorageKeys.claveRecordarSesion, value: 'true'),
    ]);
  }

  /// Devuelve usuario y contraseña recordados, o null si no hay ninguno guardado.
  Future<({String usuario, String contrasena})?> leerCredencialesRecordadas() async {
    final recordar =
        await _almacenamiento.read(key: AuthStorageKeys.claveRecordarSesion);
    if (recordar != 'true') return null;

    final usuario = await _almacenamiento.read(key: AuthStorageKeys.claveUsuarioRecordado);
    final contrasena =
        await _almacenamiento.read(key: AuthStorageKeys.claveContrasenaRecordada);

    if (usuario == null || contrasena == null) return null;
    return (usuario: usuario, contrasena: contrasena);
  }

  Future<void> limpiarCredencialesRecordadas() async {
    await Future.wait([
      _almacenamiento.delete(key: AuthStorageKeys.claveUsuarioRecordado),
      _almacenamiento.delete(key: AuthStorageKeys.claveContrasenaRecordada),
      _almacenamiento.delete(key: AuthStorageKeys.claveRecordarSesion),
    ]);
  }
}
