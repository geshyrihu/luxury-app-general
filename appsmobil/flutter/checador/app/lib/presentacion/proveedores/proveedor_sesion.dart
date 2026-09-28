import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/proveedores/proveedores_servicios.dart';
import '../../core/servicios/servicio_auth.dart';
import '../../core/servicios/servicio_notificaciones.dart';
import '../../dominio/entidades/perfil_usuario.dart';
import '../../dominio/entidades/usuario_autenticado.dart';
import '../../dominio/repositorios/i_repositorio_auth.dart';

// ── Estado ────────────────────────────────────────────────────────────────────

enum EstadoAuth { inicial, verificando, autenticado, noAutenticado, error }

class EstadoSesion {
  final EstadoAuth estado;
  final UsuarioAutenticado? usuario;
  final String? mensajeError;

  const EstadoSesion({
    required this.estado,
    this.usuario,
    this.mensajeError,
  });

  bool get estaAutenticado => estado == EstadoAuth.autenticado;
  bool get estaVerificando =>
      estado == EstadoAuth.inicial || estado == EstadoAuth.verificando;

  EstadoSesion copyWith({
    EstadoAuth? estado,
    UsuarioAutenticado? usuario,
    String? mensajeError,
  }) =>
      EstadoSesion(
        estado: estado ?? this.estado,
        usuario: usuario ?? this.usuario,
        mensajeError: mensajeError ?? this.mensajeError,
      );
}

// ── Notificador ───────────────────────────────────────────────────────────────

class NotificadorSesion extends StateNotifier<EstadoSesion> {
  final IRepositorioAuth _repositorio;
  final ServicioAuth _servicioAuth;
  final ServicioNotificaciones _servicioNotificaciones;

  NotificadorSesion({
    required IRepositorioAuth repositorio,
    required ServicioAuth servicioAuth,
    required ServicioNotificaciones servicioNotificaciones,
  })  : _repositorio = repositorio,
        _servicioAuth = servicioAuth,
        _servicioNotificaciones = servicioNotificaciones,
        super(const EstadoSesion(estado: EstadoAuth.inicial)) {
    _verificarSesionActiva();
  }

  @visibleForTesting
  NotificadorSesion.paraTest({
    required IRepositorioAuth repositorio,
    required ServicioAuth servicioAuth,
    required ServicioNotificaciones servicioNotificaciones,
    required EstadoSesion estadoInicial,
  })  : _repositorio = repositorio,
        _servicioAuth = servicioAuth,
        _servicioNotificaciones = servicioNotificaciones,
        super(estadoInicial);

  // ── Auto-login ──────────────────────────────────────────────────────────

  Future<void> _verificarSesionActiva() async {
    state = state.copyWith(estado: EstadoAuth.verificando);

    final activa = await _servicioAuth.sesionActiva();

    if (!activa) {
      state = const EstadoSesion(estado: EstadoAuth.noAutenticado);
      return;
    }

    final perfilJson = await _servicioAuth.leerPerfilUsuario();
    PerfilUsuario? perfil;

    if (perfilJson != null && perfilJson.isNotEmpty) {
      try {
        perfil = PerfilUsuario.desdeJson(
          jsonDecode(perfilJson) as Map<String, dynamic>,
        );
      } catch (_) {
        await _servicioAuth.cerrarSesion();
        state = const EstadoSesion(estado: EstadoAuth.noAutenticado);
        return;
      }
    }

    if (perfil == null) {
      await _servicioAuth.cerrarSesion();
      state = const EstadoSesion(estado: EstadoAuth.noAutenticado);
      return;
    }

    final token = (await _servicioAuth.leerToken()) ?? '';
    final claims = await _servicioAuth.obtenerClaims();
    final rolesClaim = claims['role'];
    final roles = rolesClaim is List
        ? rolesClaim.map((r) => r.toString()).toList()
        : rolesClaim != null
            ? [rolesClaim.toString()]
            : <String>[];

    final usuario = UsuarioAutenticado(
      token: token,
      expiracion: DateTime.now().add(const Duration(hours: 8)),
      roles: roles,
      perfil: perfil,
      accesosCliente: const [],
    );

    state = EstadoSesion(estado: EstadoAuth.autenticado, usuario: usuario);
    await _servicioNotificaciones.vincularUsuario(perfil.idUsuario);
  }

  // ── Login ────────────────────────────────────────────────────────────────

  Future<void> iniciarSesion({
    required String nombreUsuario,
    required String contrasena,
    required bool recordarSesion,
  }) async {
    state = const EstadoSesion(estado: EstadoAuth.verificando);

    final resultado = await _repositorio.iniciarSesion(
      nombreUsuario: nombreUsuario,
      contrasena: contrasena,
      recordarSesion: recordarSesion,
    );

    resultado.fold(
      (fallo) => state = EstadoSesion(
        estado: EstadoAuth.error,
        mensajeError: fallo.mensaje,
      ),
      (usuario) async {
        state = EstadoSesion(
          estado: EstadoAuth.autenticado,
          usuario: usuario,
        );

        if (recordarSesion) {
          await _servicioAuth.guardarCredencialesRecordadas(
              nombreUsuario, contrasena);
        } else {
          await _servicioAuth.limpiarCredencialesRecordadas();
        }

        await _servicioNotificaciones.vincularUsuario(usuario.perfil.idUsuario);
      },
    );
  }

  // ── Logout ───────────────────────────────────────────────────────────────

  Future<void> cerrarSesion() async {
    try {
      await _repositorio.cerrarSesion();
    } catch (_) {}

    try {
      await _servicioNotificaciones.desvincularUsuario();
    } catch (_) {}

    state = const EstadoSesion(estado: EstadoAuth.noAutenticado);
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

final proveedorSesionProvider =
    StateNotifierProvider<NotificadorSesion, EstadoSesion>(
  (ref) => NotificadorSesion(
    repositorio: ref.read(proveedorRepositorioAuth),
    servicioAuth: ref.read(proveedorServicioAuth),
    servicioNotificaciones: ref.read(proveedorServicioNotificaciones),
  ),
);
