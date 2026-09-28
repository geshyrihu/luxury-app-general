import '../dominio/usuario_autenticado.dart';

/// Estados posibles de la sesión del usuario.
enum EstadoAuth {
  /// Verificando si hay sesión previa en almacenamiento.
  inicial,

  /// Esperando resultado de login/logout/verificación.
  verificando,

  /// Usuario autenticado, sesión activa.
  autenticado,

  /// Usuario no autenticado (explicit logout o sin sesión guardada).
  noAutenticado,

  /// Error al intentar login/logout (mostrar mensaje).
  error,
}

/// Estado inmutable de la sesión.
class EstadoSesion {
  final EstadoAuth estado;
  final UsuarioAutenticado? usuario;
  final String? mensajeError;

  const EstadoSesion({
    required this.estado,
    this.usuario,
    this.mensajeError,
  });

  bool get estaAutenticado => estado == EstadoAuth.autenticado;
  bool get estaVerificando =>
      estado == EstadoAuth.inicial || estado == EstadoAuth.verificando;

  EstadoSesion copyWith({
    EstadoAuth? estado,
    UsuarioAutenticado? usuario,
    String? mensajeError,
  }) =>
      EstadoSesion(
        estado: estado ?? this.estado,
        usuario: usuario ?? this.usuario,
        mensajeError: mensajeError ?? this.mensajeError,
      );
}
