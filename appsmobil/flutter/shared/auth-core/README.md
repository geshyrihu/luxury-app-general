# auth_core

Paquete compartido de autenticación, sesión y red para apps Flutter de LuxuryApp.

Centraliza la lógica de login, persistencia de JWT, interceptores de red, máquina de estados Riverpod y notificaciones push — permitiendo que `commitee/app` y `checador/app` (y futuras apps Flutter) compartan una fuente única de verdad para la sesión del usuario.

## Qué incluye

| Módulo | Contenido |
|---|---|
| **Errores** | `FalloApp` — jerarquía sellada de errores tipados (FalloRed, FalloAutenticacion, FalloServidor, etc.) |
| **Red** | `RespuestaApi<T>` (mirror del backend), `AuthDioFactory` (Dio pre-configurado con interceptores), interceptores (token + log) |
| **Servicios** | `ServicioAuth` (JWT + perfil + claims), `ServicioRed` (conectividad), `IServicioNotificaciones` (OneSignal + Noop impl) |
| **Dominio** | `PerfilUsuario`, `UsuarioAutenticado`, `AccesoCliente` (entidades) |
| **Data** | `IRepositorioAuthBase`, `RepositorioAuthBase` (login + logout común; cada app extiende con sus endpoints específicos) |
| **Sesión** | `EstadoSesion`, `EstadoAuth`, `NotificadorSesion` (máquina de estados Riverpod) |
| **Config** | `AuthStorageKeys` (claves de SecureStorage centralizadas) |

## Consumo

En `pubspec.yaml`:

```yaml
dependencies:
  auth_core:
    path: ../../shared/auth-core
```

En el código (ejemplo: setup en `main.dart`):

```dart
import 'package:auth_core/auth_core.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  runApp(const ProviderScope(child: MiApp()));
}
```

En `proveedores_servicios.dart`:

```dart
final proveedorServicioAuth = Provider<ServicioAuth>(
  (ref) => ServicioAuth(),
);

final proveedorClienteDio = Provider<Dio>(
  (ref) => AuthDioFactory.crear(
    baseUrl: MiConfig.urlBase,
    connectTimeout: MiConfig.tiempoConexion,
    receiveTimeout: MiConfig.tiempoRespuesta,
    claveToken: AuthStorageKeys.claveToken,
    habilitarLog: MiConfig.esDesarrollo,
    alExpirarSesion: () {
      ref.read(proveedorSesionProvider.notifier).cerrarSesion();
    },
  ),
);

final proveedorSesionProvider = StateNotifierProvider<NotificadorSesion, EstadoSesion>(
  (ref) => NotificadorSesion(
    repositorio: ref.read(proveedorRepositorioAuth),
    servicioAuth: ref.read(proveedorServicioAuth),
    servicioNotificaciones: ref.read(proveedorServicioNotificaciones),
  ),
);
```

## Extensión en cada app

Aunque el paquete cubre el flujo base de login/logout, cada app puede extender:

- **Endpoints adicionales:** heredar `IRepositorioAuthBase` e implementar métodos extra (`validarCodigoRecuperacion`, etc.)
- **Fuentes de datos:** heredar `IFuenteDatosAuthBase`
- **Configuración:** parametrizar `AuthStorageKeys` si necesitas claves diferentes

## Decisiones arquitectónicas

- **Logout behavior:** borra token/perfil SIEMPRE; preserva usuario+contraseña recordados solo si el flag "recordar sesión" está activo.
- **Interceptor 401:** callback `alExpirarSesion` permite que la app limpie su estado Riverpod al expirar la sesión (evento que antes no era manejado en checador).
- **Claves de storage unificadas:** `AuthStorageKeys` mantiene valores canónicos. Efecto: usuarios con sesión guardada bajo claves antiguas deberán volver a marcar "recordarme" una sola vez.

## Versionamiento

- **v1.0.0+1:** Extracción inicial de auth compartida desde commitee + checador. Incluye fix de interceptor 401 de checador, unificación de claves de storage, comportamiento de logout consistente.

