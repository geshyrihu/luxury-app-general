/// Stub de notificaciones — checador no usa push notifications.
/// Mantiene la misma interfaz que mobile_commite para que la arquitectura sea idéntica.
class ServicioNotificaciones {
  Future<void> inicializar() async {}
  Future<void> vincularUsuario(String idUsuario) async {}
  Future<void> desvincularUsuario() async {}
}
