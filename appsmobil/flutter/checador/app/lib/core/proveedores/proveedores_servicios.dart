import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/fuentes_datos/fuente_datos_auth.dart';
import '../../data/repositorios/repositorio_auth.dart';
import '../../dominio/repositorios/i_repositorio_auth.dart';
import '../../presentacion/proveedores/proveedor_sesion.dart';
import '../servicios/servicio_auth.dart';
import '../servicios/servicio_notificaciones.dart';
import '../servicios/servicio_red.dart';

// ── Servicios core ────────────────────────────────────────────────────────────

final proveedorServicioAuth = Provider<ServicioAuth>(
  (ref) => ServicioAuth(),
);

final proveedorServicioRed = Provider<ServicioRed>(
  (ref) => ServicioRed(),
);

final proveedorServicioNotificaciones = Provider<ServicioNotificaciones>(
  (ref) => ServicioNotificaciones(),
);

// ── Acceso rápido al usuario autenticado ─────────────────────────────────────

final proveedorIdUsuario = Provider<String>((ref) {
  return ref.watch(proveedorSesionProvider).usuario?.perfil.idUsuario ?? '';
});

final proveedorPerfilUsuario = Provider((ref) {
  return ref.watch(proveedorSesionProvider).usuario?.perfil;
});

// ── Fuentes de datos ──────────────────────────────────────────────────────────

final proveedorFuenteDatosAuth = Provider<FuenteDatosAuth>(
  (ref) => FuenteDatosAuth(),
);

// ── Repositorios ──────────────────────────────────────────────────────────────

final proveedorRepositorioAuth = Provider<IRepositorioAuth>(
  (ref) => RepositorioAuth(
    fuenteDatos: ref.read(proveedorFuenteDatosAuth),
    servicioAuth: ref.read(proveedorServicioAuth),
  ),
);
