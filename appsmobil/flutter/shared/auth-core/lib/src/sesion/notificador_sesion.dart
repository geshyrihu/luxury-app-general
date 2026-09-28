import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/i_repositorio_auth_base.dart';
import '../dominio/acceso_cliente.dart';
import '../dominio/perfil_usuario.dart';
import '../dominio/usuario_autenticado.dart';
import '../servicios/notificaciones/i_servicio_notificaciones.dart';
import '../servicios/servicio_auth.dart';
import 'estado_sesion.dart';

/// StateNotifier que gestiona la máquina de estados de la sesión.
/// Responsable de: auto-login, login, logout, actualización de perfil.
class NotificadorSesion extends StateNotifier<EstadoSesion> {
  final IRepositorioAuthBase _repositorio;
  final ServicioAuth _servicioAuth;
  final IServicioNotificaciones _servicioNotificaciones;

  /// Constructor principal — llama verificación de sesión al arrancar.
  NotificadorSesion({
    required IRepositorioAuthBase repositorio,
    required ServicioAuth servicioAuth,
    required IServicioNotificaciones servicioNotificaciones,
  })  : _repositorio = repositorio,
        _servicioAuth = servicioAuth,
        _servicioNotificaciones = servicioNotificaciones,
        super(const EstadoSesion(estado: EstadoAuth.inicial)) {
    _verificarSesionActiva();
  }

  /// Constructor para tests — parte de un estado dado sin tocar almacenamiento.
  @visibleForTesting
  NotificadorSesion.paraTest({
    required IRepositorioAuthBase repositorio,
    required ServicioAuth servicioAuth,
    required IServicioNotificaciones servicioNotificaciones,
    required EstadoSesion estadoInicial,
  })  : _repositorio = repositorio,
        _servicioAuth = servicioAuth,
        _servicioNotificaciones = servicioNotificaciones,
        super(estadoInicial);

  // ── Auto-login ──────────────────────────────────────────────────────

  Future<void> _verificarSesionActiva() async {
    state = state.copyWith(estado: EstadoAuth.verificando);

    final activa = await _servicioAuth.sesionActiva();

    if (!activa) {
      // El access token expiró (900s por defecto) o no existe. Antes de forzar
      // login con credenciales, intentar renovar con el refresh token (cookie
      // HttpOnly, válida 30 días) — así la huella/Face ID sigue sirviendo de
      // acceso aunque hayan pasado más de 15 minutos desde el último uso.
      final renovado = await _repositorio.refrescarSesion();
      UsuarioAutenticado? usuarioRenovado;
      renovado.fold((_) {}, (usuario) => usuarioRenovado = usuario);

      if (usuarioRenovado != null) {
        state = EstadoSesion(estado: EstadoAuth.autenticado, usuario: usuarioRenovado!);
        await _servicioNotificaciones.vincularUsuario(usuarioRenovado!.perfil.idUsuario);
        return;
      }

      await _servicioAuth.cerrarSesion();
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

    final accesosJson = await _servicioAuth.leerAccesosCliente();
    List<AccesoCliente> accesosCliente = const [];
    if (accesosJson != null && accesosJson.isNotEmpty) {
      try {
        accesosCliente = (jsonDecode(accesosJson) as List<dynamic>)
            .map((e) => AccesoCliente.desdeJson(e as Map<String, dynamic>))
            .toList();
      } catch (_) {
        // Lista corrupta o formato antiguo: seguir con lista vacía en vez de
        // bloquear el auto-login completo.
      }
    }

    final usuario = UsuarioAutenticado(
      token: token,
      expiracion: DateTime.now().add(const Duration(hours: 8)),
      roles: roles,
      perfil: perfil,
      accesosCliente: accesosCliente,
    );

    state = EstadoSesion(estado: EstadoAuth.autenticado, usuario: usuario);
    await _servicioNotificaciones.vincularUsuario(perfil.idUsuario);
  }

  // ── Login ────────────────────────────────────────────────────────────

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

        await _servicioAuth.guardarAccesosCliente(
          jsonEncode(usuario.accesosCliente.map((a) => a.aJson()).toList()),
        );

        await _servicioNotificaciones.vincularUsuario(usuario.perfil.idUsuario);
      },
    );
  }

  // ── Actualizar perfil ────────────────────────────────────────────────

  /// Actualiza la ruta de foto en el estado y la persiste en SecureStorage.
  /// Genérico: funciona con cualquier campo del perfil que sea una String.
  Future<void> actualizarPerfil({
    required String campo,
    required String nuevoValor,
  }) async {
    final usuario = state.usuario;
    if (usuario == null) return;

    late final PerfilUsuario nuevoPerfil;
    if (campo == 'rutaFoto') {
      nuevoPerfil = PerfilUsuario(
        idCliente: usuario.perfil.idCliente,
        idUsuario: usuario.perfil.idUsuario,
        nombreCliente: usuario.perfil.nombreCliente,
        email: usuario.perfil.email,
        nombre: usuario.perfil.nombre,
        apellido: usuario.perfil.apellido,
        telefono: usuario.perfil.telefono,
        rutaFoto: nuevoValor,
        rutaFotoCliente: usuario.perfil.rutaFotoCliente,
        puesto: usuario.perfil.puesto,
      );
    } else if (campo == 'rutaFotoCliente') {
      nuevoPerfil = PerfilUsuario(
        idCliente: usuario.perfil.idCliente,
        idUsuario: usuario.perfil.idUsuario,
        nombreCliente: usuario.perfil.nombreCliente,
        email: usuario.perfil.email,
        nombre: usuario.perfil.nombre,
        apellido: usuario.perfil.apellido,
        telefono: usuario.perfil.telefono,
        rutaFoto: usuario.perfil.rutaFoto,
        rutaFotoCliente: nuevoValor,
        puesto: usuario.perfil.puesto,
      );
    } else {
      // Campo desconocido, no actualizar
      return;
    }

    final nuevoUsuario = UsuarioAutenticado(
      token: usuario.token,
      expiracion: usuario.expiracion,
      roles: usuario.roles,
      perfil: nuevoPerfil,
      accesosCliente: usuario.accesosCliente,
    );

    state = EstadoSesion(estado: EstadoAuth.autenticado, usuario: nuevoUsuario);
    await _servicioAuth.guardarPerfilUsuario(
      jsonEncode(nuevoPerfil.aJson()),
    );
  }

  // ── Logout ───────────────────────────────────────────────────────────

  Future<void> cerrarSesion() async {
    try {
      await _repositorio.cerrarSesion();
    } catch (_) {
      // El cierre local siempre ocurre aunque el remoto falle
    }

    try {
      await _servicioNotificaciones.desvincularUsuario();
    } catch (_) {
      // OneSignal puede no estar inicializado en entornos de test
    }

    state = const EstadoSesion(estado: EstadoAuth.noAutenticado);
  }
}
