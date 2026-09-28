import 'package:connectivity_plus/connectivity_plus.dart';

/// Servicio para verificar el estado de la conectividad de red.
class ServicioRed {
  final Connectivity _conectividad;

  ServicioRed({Connectivity? conectividad})
      : _conectividad = conectividad ?? Connectivity();

  /// Devuelve `true` si el dispositivo tiene acceso a internet.
  Future<bool> tieneConexion() async {
    final resultados = await _conectividad.checkConnectivity();
    return resultados.any(
      (r) => r != ConnectivityResult.none,
    );
  }

  /// Stream que emite `true`/`false` cada vez que cambia la conectividad.
  Stream<bool> get cambiosConexion => _conectividad.onConnectivityChanged.map(
        (resultados) => resultados.any((r) => r != ConnectivityResult.none),
      );
}
