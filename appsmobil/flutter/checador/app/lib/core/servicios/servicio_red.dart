import 'package:connectivity_plus/connectivity_plus.dart';

class ServicioRed {
  final Connectivity _conectividad;

  ServicioRed({Connectivity? conectividad})
      : _conectividad = conectividad ?? Connectivity();

  Future<bool> tieneConexion() async {
    final resultados = await _conectividad.checkConnectivity();
    return resultados.any((r) => r != ConnectivityResult.none);
  }

  Stream<bool> get cambiosConexion => _conectividad.onConnectivityChanged.map(
        (resultados) => resultados.any((r) => r != ConnectivityResult.none),
      );
}
