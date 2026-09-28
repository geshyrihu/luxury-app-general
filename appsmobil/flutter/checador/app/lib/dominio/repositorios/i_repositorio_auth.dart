import 'package:dartz/dartz.dart';
import '../entidades/usuario_autenticado.dart';
import '../../core/errores/fallo_app.dart';

/// Contrato de autenticación — la presentación depende solo de esta interfaz.
abstract interface class IRepositorioAuth {
  Future<Either<FalloApp, UsuarioAutenticado>> iniciarSesion({
    required String nombreUsuario,
    required String contrasena,
    required bool recordarSesion,
  });

  Future<Either<FalloApp, Unit>> recuperarContrasena(String email);

  Future<Either<FalloApp, Unit>> confirmarRecuperacion({
    required String email,
    required String token,
    required String nuevaContrasena,
  });

  Future<Either<FalloApp, Unit>> cerrarSesion();
}
