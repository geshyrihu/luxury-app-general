/// Contrato para servicios de notificaciones push.
abstract interface class IServicioNotificaciones {
  /// Inicializa el servicio de notificaciones.
  Future<void> inicializar();

  /// Asocia el dispositivo con un usuario específico (tras el login).
  Future<void> vincularUsuario(String idUsuario);

  /// Desvincula el dispositivo del usuario (tras el logout).
  Future<void> desvincularUsuario();
}
