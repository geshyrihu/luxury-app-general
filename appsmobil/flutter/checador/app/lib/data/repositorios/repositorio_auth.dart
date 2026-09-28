import 'dart:convert';

import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

import '../../core/errores/fallo_app.dart';
import '../../core/network/api_respuesta.dart';
import '../../core/servicios/servicio_auth.dart';
import '../../dominio/entidades/acceso_cliente.dart';
import '../../dominio/entidades/perfil_usuario.dart';
import '../../dominio/entidades/usuario_autenticado.dart';
import '../../dominio/repositorios/i_repositorio_auth.dart';
import '../fuentes_datos/fuente_datos_auth.dart';

/// El pre-check de connectivity_plus se omite intencionalmente en checador:
/// el entorno de dev usa ADB reverse tunnel (sin WiFi real) y el check devuelve
/// false aunque la red funcione. Dio ya lanza connectionError si no hay red.
class RepositorioAuth implements IRepositorioAuth {
  final FuenteDatosAuth _fuenteDatos;
  final ServicioAuth _servicioAuth;

  const RepositorioAuth({
    required FuenteDatosAuth fuenteDatos,
    required ServicioAuth servicioAuth,
  })  : _fuenteDatos = fuenteDatos,
        _servicioAuth = servicioAuth;

  @override
  Future<Either<FalloApp, UsuarioAutenticado>> iniciarSesion({
    required String nombreUsuario,
    required String contrasena,
    required bool recordarSesion,
  }) async {
    try {
      final datos = await _fuenteDatos.iniciarSesion(
        nombreUsuario: nombreUsuario,
        contrasena: contrasena,
        recordarSesion: recordarSesion,
      );

      final respuesta = RespuestaApi.fromJson(
        datos,
        (json) => json as Map<String, dynamic>,
      );

      if (!respuesta.exitoso || respuesta.datos == null) {
        return Left(FalloServidor(
          mensaje: respuesta.mensaje.isNotEmpty
              ? respuesta.mensaje
              : 'Credenciales incorrectas.',
          codigoHttp: respuesta.codigoHttp,
        ));
      }

      final usuario = _mapearUsuario(respuesta.datos!);

      await _servicioAuth.guardarToken(usuario.token);
      await _servicioAuth.guardarPerfilUsuario(
        jsonEncode(usuario.perfil.aJson()),
      );

      return Right(usuario);
    } on DioException catch (e) {
      return Left(_mapearErrorDio(e));
    } catch (e) {
      return Left(FalloDesconocido('Error al iniciar sesión: $e'));
    }
  }

  @override
  Future<Either<FalloApp, Unit>> recuperarContrasena(String email) async {
    try {
      final datos = await _fuenteDatos.recuperarContrasena(email);
      final respuesta = RespuestaApi.fromJson(datos, (json) => json);

      if (!respuesta.exitoso) {
        return Left(FalloServidor(
          mensaje: respuesta.mensaje.isNotEmpty
              ? respuesta.mensaje
              : 'No se pudo enviar el correo.',
        ));
      }

      return const Right(unit);
    } on DioException catch (e) {
      return Left(_mapearErrorDio(e));
    } catch (e) {
      return Left(FalloDesconocido('Error al recuperar contraseña: $e'));
    }
  }

  @override
  Future<Either<FalloApp, Unit>> confirmarRecuperacion({
    required String email,
    required String token,
    required String nuevaContrasena,
  }) async {
    try {
      final datos = await _fuenteDatos.confirmarRecuperacion(
        email: email,
        token: token,
        nuevaContrasena: nuevaContrasena,
      );
      final respuesta = RespuestaApi.fromJson(datos, (json) => json);

      if (!respuesta.exitoso) {
        return Left(FalloServidor(
          mensaje: respuesta.mensaje.isNotEmpty
              ? respuesta.mensaje
              : 'No se pudo restablecer la contraseña.',
        ));
      }

      return const Right(unit);
    } on DioException catch (e) {
      return Left(_mapearErrorDio(e));
    } catch (e) {
      return Left(FalloDesconocido('Error al confirmar recuperación: $e'));
    }
  }

  @override
  Future<Either<FalloApp, Unit>> cerrarSesion() async {
    await _fuenteDatos.cerrarSesionRemota();
    await _servicioAuth.cerrarSesion();
    return const Right(unit);
  }

  // ── Mapeo de datos ──────────────────────────────────────────────────────────

  UsuarioAutenticado _mapearUsuario(Map<String, dynamic> datos) {
    final perfilDatos =
        datos['infoUserAuthDTO'] as Map<String, dynamic>? ?? {};

    final perfil = PerfilUsuario(
      idCliente: perfilDatos['customerId']?.toString() ?? '',
      idUsuario: perfilDatos['applicationUserId']?.toString() ?? '',
      nombreCliente: perfilDatos['customer']?.toString() ?? '',
      email: perfilDatos['email']?.toString() ?? '',
      nombre: perfilDatos['firstName']?.toString() ?? '',
      apellido: perfilDatos['lastName']?.toString() ?? '',
      telefono: perfilDatos['phone']?.toString(),
      rutaFoto: perfilDatos['photoPath']?.toString(),
      rutaFotoCliente: perfilDatos['customerPhotoPath']?.toString(),
      puesto: perfilDatos['position']?.toString(),
    );

    final accesos = (datos['customerAccess'] as List<dynamic>? ?? [])
        .map((a) => AccesoCliente(
              id: (a as Map<String, dynamic>)['value']?.toString() ?? '',
              nombre: a['label']?.toString() ?? '',
              rutaImagen: a['image']?.toString(),
            ))
        .toList();

    final roles = (datos['roles'] as List<dynamic>? ?? [])
        .map((r) => r.toString())
        .toList();

    final expiracion = datos['expiration'] != null
        ? DateTime.tryParse(datos['expiration'].toString()) ??
            DateTime.now().add(const Duration(hours: 8))
        : DateTime.now().add(const Duration(hours: 8));

    return UsuarioAutenticado(
      token: datos['token']?.toString() ?? '',
      expiracion: expiracion,
      roles: roles,
      perfil: perfil,
      accesosCliente: accesos,
    );
  }

  FalloApp _mapearErrorDio(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.connectionError:
        return const FalloRed();
      case DioExceptionType.badResponse:
        final codigo = e.response?.statusCode;
        if (codigo == 401) {
          return const FalloAutenticacion('Credenciales incorrectas.');
        }
        final cuerpo = e.response?.data;
        final mensaje =
            cuerpo is Map ? cuerpo['message']?.toString() : null;
        return FalloServidor(
          mensaje: mensaje ?? 'Error del servidor ($codigo).',
          codigoHttp: codigo,
        );
      default:
        return FalloDesconocido(e.message ?? 'Error de red desconocido.');
    }
  }
}
