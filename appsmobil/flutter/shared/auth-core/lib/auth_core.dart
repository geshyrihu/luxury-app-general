library auth_core;

// ── Config
export 'src/config/auth_storage_keys.dart';

// ── Errores
export 'src/errores/fallo_app.dart';

// ── Red
export 'src/red/respuesta_api.dart';
export 'src/red/auth_dio_factory.dart';
export 'src/red/interceptores/interceptor_token.dart';
export 'src/red/interceptores/interceptor_log.dart';

// ── Servicios
export 'src/servicios/servicio_auth.dart';
export 'src/servicios/servicio_red.dart';
export 'src/servicios/notificaciones/i_servicio_notificaciones.dart';
export 'src/servicios/notificaciones/servicio_notificaciones_onesignal.dart';
export 'src/servicios/notificaciones/servicio_notificaciones_noop.dart';

// ── Dominio
export 'src/dominio/perfil_usuario.dart';
export 'src/dominio/usuario_autenticado.dart';
export 'src/dominio/acceso_cliente.dart';

// ── Data
export 'src/data/i_repositorio_auth_base.dart';
export 'src/data/i_fuente_datos_auth_base.dart';
export 'src/data/repositorio_auth_base.dart';

// ── Sesión
export 'src/sesion/estado_sesion.dart';
export 'src/sesion/notificador_sesion.dart';
