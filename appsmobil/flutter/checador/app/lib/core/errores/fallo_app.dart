import 'package:equatable/equatable.dart';

/// Jerarquía sellada de errores de la aplicación.
sealed class FalloApp extends Equatable {
  final String mensaje;

  const FalloApp(this.mensaje);

  @override
  List<Object?> get props => [mensaje];
}

final class FalloRed extends FalloApp {
  const FalloRed() : super('Sin conexión a internet. Verifica tu red.');
}

final class FalloAutenticacion extends FalloApp {
  const FalloAutenticacion([super.mensaje = 'Sesión expirada. Inicia sesión nuevamente.']);
}

final class FalloServidor extends FalloApp {
  final int? codigoHttp;

  const FalloServidor({required String mensaje, this.codigoHttp}) : super(mensaje);

  @override
  List<Object?> get props => [mensaje, codigoHttp];
}

final class FalloParseo extends FalloApp {
  const FalloParseo([super.mensaje = 'Error al procesar los datos del servidor.']);
}

final class FalloDesconocido extends FalloApp {
  const FalloDesconocido([super.mensaje = 'Ha ocurrido un error inesperado.']);
}
