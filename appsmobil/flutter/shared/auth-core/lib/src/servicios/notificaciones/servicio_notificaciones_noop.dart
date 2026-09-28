import 'i_servicio_notificaciones.dart';

/// Stub/No-op de notificaciones — para apps que no usan push.
/// Implementa la interfaz pero no hace nada.
class ServicioNotificacionesNoop implements IServicioNotificaciones {
  @override
  Future<void> inicializar() async {}

  @override
  Future<void> vincularUsuario(String idUsuario) async {}

  @override
  Future<void> desvincularUsuario() async {}
}
