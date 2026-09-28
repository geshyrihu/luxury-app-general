import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../auth/presentation/pantallas/login_pantalla.dart';
import '../../auth/presentation/pantallas/pantalla_recuperar_password.dart';
import '../../auth/presentation/pantallas/pantalla_reset_password.dart';
import '../../features/checador/presentation/pantallas/dashboard_pantalla.dart';
import '../../presentacion/proveedores/proveedor_sesion.dart';

// ── Rutas ─────────────────────────────────────────────────────────────────────

abstract final class RutasApp {
  static const login      = '/auth/login';
  static const recuperar  = '/auth/recuperar';
  static const reset      = '/auth/reset';
  static const dashboard  = '/dashboard';
}

// ── Bridge Riverpod → ChangeNotifier ─────────────────────────────────────────

class _ListenableAuth extends ChangeNotifier {
  _ListenableAuth(Ref ref) {
    ref.listen<EstadoSesion>(
      proveedorSesionProvider,
      (_, __) => notifyListeners(),
    );
  }
}

// ── Provider del enrutador ────────────────────────────────────────────────────

final proveedorEnrutador = Provider<GoRouter>((ref) {
  final listenable = _ListenableAuth(ref);
  ref.onDispose(listenable.dispose);

  return GoRouter(
    initialLocation: RutasApp.dashboard,
    refreshListenable: listenable,
    redirect: (context, state) {
      final sesion = ref.read(proveedorSesionProvider);
      final ruta = state.matchedLocation;
      final enAuth = ruta.startsWith('/auth');

      if (sesion.estaVerificando) return null;
      if (!sesion.estaAutenticado && !enAuth) return RutasApp.login;
      if (sesion.estaAutenticado && enAuth) return RutasApp.dashboard;

      return null;
    },
    routes: [
      // ── Autenticación ──────────────────────────────────────────────────
      GoRoute(
        path: RutasApp.login,
        builder: (_, __) => const LoginPantalla(),
      ),
      GoRoute(
        path: RutasApp.recuperar,
        builder: (_, __) => const PantallaRecuperarPassword(),
      ),
      GoRoute(
        path: RutasApp.reset,
        builder: (_, state) => PantallaResetPassword(
          token: state.uri.queryParameters['token'] ?? '',
          email: state.uri.queryParameters['email'] ?? '',
        ),
      ),

      // ── Dashboard (protegido) ──────────────────────────────────────────
      GoRoute(
        path: RutasApp.dashboard,
        builder: (_, __) => const DashboardPantalla(),
      ),
    ],
  );
});
