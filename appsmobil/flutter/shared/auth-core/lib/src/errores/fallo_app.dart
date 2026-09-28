import 'package:equatable/equatable.dart';

/// Jerarquía sellada de errores de la aplicación.
/// Permite manejar errores de forma tipada con `dartz` (Either[FalloApp, T]).
sealed class FalloApp extends Equatable {
  final String mensaje;

  const FalloApp(this.mensaje);

  @override
  List<Object?> get props => [mensaje];
}

/// Error de conectividad de red (sin internet).
final class FalloRed extends FalloApp {
  const FalloRed() : super('Sin conexión a internet. Verifica tu red.');
}

/// Error de autenticación — token inválido o expirado.
final class FalloAutenticacion extends FalloApp {
  const FalloAutenticacion(
      [super.mensaje = 'Sesión expirada. Inicia sesión nuevamente.']);
}

/// Error del servidor (4xx / 5xx).
final class FalloServidor extends FalloApp {
  final int? codigoHttp;

  const FalloServidor({required String mensaje, this.codigoHttp})
      : super(mensaje);

  @override
  List<Object?> get props => [mensaje, codigoHttp];
}

/// Error de parseo / deserialización de datos.
final class FalloParseo extends FalloApp {
  const FalloParseo(
      [super.mensaje = 'Error al procesar los datos del servidor.']);
}

/// Error desconocido no controlado.
final class FalloDesconocido extends FalloApp {
  const FalloDesconocido([super.mensaje = 'Ha ocurrido un error inesperado.']);
}
