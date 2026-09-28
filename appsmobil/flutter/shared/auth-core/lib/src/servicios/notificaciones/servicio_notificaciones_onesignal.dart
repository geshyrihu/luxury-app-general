import 'package:onesignal_flutter/onesignal_flutter.dart';

import 'i_servicio_notificaciones.dart';

/// Implementación de notificaciones push usando OneSignal.
class ServicioNotificacionesOneSignal implements IServicioNotificaciones {
  final String oneSignalAppId;
  bool _inicializado = false;

  ServicioNotificacionesOneSignal({required this.oneSignalAppId});

  @override
  Future<void> inicializar() async {
    if (_inicializado) return;

    OneSignal.Debug.setLogLevel(OSLogLevel.none);
    OneSignal.initialize(oneSignalAppId);

    // Solicitar permiso al usuario
    await OneSignal.Notifications.requestPermission(true);

    _inicializado = true;
  }

  @override
  Future<void> vincularUsuario(String idUsuario) async {
    OneSignal.login(idUsuario);
  }

  @override
  Future<void> desvincularUsuario() async {
    OneSignal.logout();
  }
}
