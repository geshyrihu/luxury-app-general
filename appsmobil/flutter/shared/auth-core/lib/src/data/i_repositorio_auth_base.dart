import 'package:dartz/dartz.dart';

import '../errores/fallo_app.dart';
import '../dominio/usuario_autenticado.dart';

/// Contrato base de autenticación — la capa de presentación depende SOLO de esta interfaz.
abstract interface class IRepositorioAuthBase {
  /// Autentica al usuario con credenciales y retorna la sesión.
  Future<Either<FalloApp, UsuarioAutenticado>> iniciarSesion({
    required String nombreUsuario,
    required String contrasena,
    required bool recordarSesion,
  });

  /// Confirma el reset de contraseña con el token recibido por email.
  Future<Either<FalloApp, Unit>> confirmarRecuperacion({
    required String email,
    required String token,
    required String nuevaContrasena,
  });

  /// Cierra la sesión local (borra JWT y perfil del almacenamiento seguro).
  Future<Either<FalloApp, Unit>> cerrarSesion();

  /// Renueva la sesión usando el refresh token (cookie HttpOnly) sin pedir
  /// credenciales — usado por el auto-login cuando el access token expiró.
  Future<Either<FalloApp, UsuarioAutenticado>> refrescarSesion();
}
