import 'package:geolocator/geolocator.dart';

class PosicionGPS {
  final double latitud;
  final double longitud;
  const PosicionGPS({required this.latitud, required this.longitud});
}

class ServicioGPS {
  ServicioGPS._();
  static final ServicioGPS instancia = ServicioGPS._();

  Future<PosicionGPS?> obtenerPosicion() async {
    bool servicioActivo = await Geolocator.isLocationServiceEnabled();
    if (!servicioActivo) return null;

    LocationPermission permiso = await Geolocator.checkPermission();
    if (permiso == LocationPermission.denied) {
      permiso = await Geolocator.requestPermission();
      if (permiso == LocationPermission.denied) return null;
    }
    if (permiso == LocationPermission.deniedForever) return null;

    try {
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 10),
        ),
      );
      return PosicionGPS(latitud: pos.latitude, longitud: pos.longitude);
    } catch (_) {
      return null;
    }
  }
}
