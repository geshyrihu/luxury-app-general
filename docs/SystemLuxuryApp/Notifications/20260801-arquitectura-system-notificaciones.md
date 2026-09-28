# 🔔 Sistema de Notificaciones — Backend + Frontend

**Contrato único:** `NotificationRequestDTO` (.NET) → `INotificationDispatcher` → 4 canales
**Status:** ✅ Implementado (Fases 1–4, 2026-08-12) · ⏳ WhatsApp y push móvil pendientes
**Auditoría origen:** [../../../docs/SystemLuxuryApp/Notifications/20260812-auditoria-system-notificaciones.md](../../../docs/SystemLuxuryApp/Notifications/20260812-auditoria-system-notificaciones.md)
**Estándar:** [../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md](../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md)

---

## 🎯 Principio

**Un solo servicio decide a quién, por qué canal y con qué URL sale cada mensaje.**

Antes existían tres patrones de URL, un orquestador parcial y disparos sueltos por feature.
Hoy todo pasa por `INotificationDispatcher` y se cumplen tres invariantes:

1. **Las rutas se guardan RELATIVAS.** La absoluta se resuelve justo antes de enviar.
2. **La categoría es un enum**, no un string libre.
3. **Fuera de Producción, todo mensaje se redirige** al usuario y teléfono de pruebas.

---

## 🗺️ Vista general

```
Feature (TaskAppService, FundingOrchestrator, …)
        │
        │ NotificationRequestDTO { ApplicationUserId, Title, Body,
        │                          Category, Channels[], ActionRoute, Email* }
        ▼
┌───────────────────────────────────────────────────────────────┐
│  INotificationDispatcher                                       │
│  · resuelve ActionRoute → URL absoluta (INotificationUrlResolver)│
│  · enruta por canal                                             │
└───────────────────────────────────────────────────────────────┘
   │            │              │              │
   ▼            ▼              ▼              ▼
 InApp        Push          PushWeb         Email
   │            │              │              │
   │            ▼              ▼              ▼
   │   SendOneSignal    SendOneSignalWeb  Razor + _EmailLayout
   │       Service           Service       → ISendEmailService
   │            │              │
   ▼            └──────┬───────┘
NotificationUser       │
 (BD, URL relativa)    ▼
   +            IDevelopmentRecipientGuard
SendSignalRService  (fuera de Producción → usuario/teléfono de pruebas)
   │
   ▼
Angular: SignalRService → notifications-gadget (campana)
```

---

## 🔷 Backend (.NET 10)

### Contrato: `NotificationRequestDTO`

**Ubicación:** `api/LuxuryApp.Shared/DTOs/NotificationRequestDTO.cs`

```csharp
public record NotificationRequestDTO
{
    public string ApplicationUserId { get; init; }
    public string Title { get; init; }
    public string Body { get; init; }
    public NotificationCategory Category { get; init; } = NotificationCategory.General;
    public NotificationChannel[] Channels { get; init; } = [];

    /// SIEMPRE relativa: "/tasks/message/{id}". El dispatcher la vuelve absoluta.
    public string ActionRoute { get; init; }

    // Sólo canal Email
    public string EmailTemplate { get; init; }   // constante de EmailTemplates
    public object EmailModel { get; init; }      // ViewModel de la plantilla Razor
    public string Subject { get; init; }
    public List<string> To { get; init; } = [];
    public List<string> ToCC { get; init; } = [];
    public List<string> ToBcc { get; init; } = [];
}
```

### Canales — `NotificationChannel`

**Ubicación:** `api/LuxuryApp.Shared/Enums/NotificationChannel.cs`

| Valor | Miembro | Qué hace | Servicio final |
|---:|:---|:---|:---|
| 0 | `Email` | Renderiza Razor y envía por SMTP | `ISendEmailService` |
| 1 | `Push` | Push a la app móvil | `ISendOneSignalService` |
| 2 | `WhatsApp` | ⏳ **No soportado por el dispatcher** | `ITwilioWhatsAppService` (directo) |
| 3 | `InApp` | Persiste en `NotificationUser` **y** avisa por SignalR | `INotificationUserAppService` + `ISendSignalRService` |
| 4 | `PushWeb` | Push al navegador | `ISendOneSignalWebService` |

> ⚠️ Los valores se persisten en `NotificationLog.Channel`. **Sólo se agregan miembros al final**;
> renumerar o renombrar corrompe datos existentes.

### Categorías — `NotificationCategory`

**Ubicación:** `api/LuxuryApp.Shared/Enums/NotificationCategory.cs`

`General`, `Info`, `Personal`, `Urgente`, `PanicAlert`, `NewTask`, `PagoRecibido`, `Success`,
`Warning`, `TicketLegal`, `Meeting`, `Recruitment`, `System` — todos con `[Display(Name)]` en español.

Los nombres coinciden a propósito con los literales ya persistidos en BD, para que la migración
`string` → `enum` sea un mapeo por nombre. `Info` es la excepción: su literal en BD es `"Información"`.

> ⏳ **Deuda:** la columna `NotificationUser.NotificationType` sigue siendo `string`; el enum se
> serializa por nombre al persistir.

### Resolución de URLs

| Servicio | Responsabilidad |
|:---|:---|
| `IBaseUrlService.GetBaseUrlApi()` | Base de la API (`AppSettings:BaseUrl` + contexto HTTP) |
| `IBaseUrlService.GetBaseUrlWeb()` | Base del front — lee **`LuxuryApp:PathFront`**, sin barra final |
| `IBaseUrlService.GetBaseUrlPublic()` | `GetBaseUrlWeb()` + `/publico` (zona sin autenticación) |
| `INotificationUrlResolver.ToAbsoluteWeb(ruta)` | Ruta relativa → absoluta del entorno actual |
| `INotificationUrlResolver.ToAbsolutePublic(ruta)` | Ídem bajo `/publico` |
| `IFileReadPathService` | **URLs de archivos.** Nunca se reconstruye `/api/files/download` a mano |

`ToAbsoluteWeb` / `ToAbsolutePublic` son **idempotentes**: si reciben una URL ya absoluta la
devuelven intacta.

**Único literal de dominio permitido:** `BaseUrlService.FallbackProductionUrl`, usado sólo si
falta configuración.

### Destinatarios fuera de Producción

**Ubicación:** `api/LuxuryApp.Shared/Services/IDevelopmentRecipientGuard.cs`

Se aplica en la **etapa final** de cada canal, no en los servicios de negocio: un módulo nuevo
queda protegido sin escribir nada.

```json
"DevelopmentSettings": {
  "TestNotificationUserId": "3e1ff763-c104-42fe-bb03-1e4c24493f89",
  "TestWhatsAppNumber": "+5215559878523"
}
```

| Canal | Dónde se aplica | Destino fuera de Producción |
|:---|:---|:---|
| In-App | `NotificationUserAppService.CreateNotificationAsync` | `TestNotificationUserId` |
| Push móvil / web | `SendOneSignalService` / `SendOneSignalWebService` | `TestNotificationUserId` |
| SignalR | `SendSignalRService` | `TestNotificationUserId` |
| WhatsApp | `TwilioWhatsAppService` | `TestWhatsAppNumber` |
| Email | `SendEmailService` | `gerente.mtto@luxurybuildingsite.com` (buzón fijo) |

**El criterio es `!IsProduction()`**, no `IsDevelopment()`: Staging o cualquier entorno futuro
también redirige. Si falta la clave de configuración, la guarda **no redirige** y deja un
`LogWarning` (preferible a enviar a un destinatario vacío).

`ResolveUserIds` colapsa la lista en **un solo destinatario** para no repetir el mismo mensaje N veces.

### Correo: Razor + Design System

- Todo correo se renderiza con `IRazorViewToStringRenderer` usando una **constante de
  `EmailTemplates`** (nunca la ruta del `.cshtml` como literal). `EmailTemplateValidator` valida
  esas rutas al arrancar: si una no resuelve, **la API no levanta**.
- Layouts compartidos: `_EmailLayout.cshtml` (600px) y `_EmailLayoutTable.cshtml` (900px).
- Los valores visuales salen de `EmailDesignTokens` (`api/LuxuryApp.Shared/Design/`), espejo en C#
  de `client/angular/src/styles/core/*`. **Ningún color, fuente ni radio hardcodeado**
  (CONVENTIONS §6.1). Ancla de marca: `#003152`.
- El logo se resuelve con `IBaseUrlService`; se puede sobrescribir con `ViewData["LogoUrl"]`.

### Uso desde un feature

```csharp
public class TaskAppService(INotificationDispatcher notificationDispatcher, …)
{
    private static readonly NotificationChannel[] TaskChannels =
        [NotificationChannel.InApp, NotificationChannel.Push, NotificationChannel.PushWeb];

    private static string TaskRoute(Guid taskId, Guid workGroupId)
        => $"/tasks/message/{taskId}/{workGroupId}";

    private Task NotifyTaskAsync(string userId, string title, string message, Guid taskId, Guid groupId)
        => notificationDispatcher.DispatchAsync(new NotificationRequestDTO
        {
            ApplicationUserId = userId,
            Title = title,
            Body = message,
            Category = NotificationCategory.Personal,
            Channels = TaskChannels,
            ActionRoute = TaskRoute(taskId, groupId)   // relativa
        });
}
```

**Manejo de errores:** el dispatcher **no traga excepciones** — se propagan al llamador. Un push
no entregado se registra como `LogWarning` con el motivo que devolvió OneSignal.

---

## 🅰️ Frontend (Angular 22)

### In-App — campana de notificaciones

**Componente:** `src/app/core/layout/employee-view/monitor/notifications-gadget/`

Consume `Endpoints.Notifications`:

| Endpoint | Uso |
|:---|:---|
| `GET api/notifications` | Listado (acepta `isRead` como filtro opcional) |
| `GET api/notifications/unread-count` | Contador de la campana |
| `GET api/notifications/mark-as-read/{id}` | Marcar leída |
| `DELETE api/notifications/{id}` · `DELETE api/notifications` | Borrado individual / por lote |

### Tiempo real — SignalR

**Servicio:** `src/app/core/services/signalr.service.ts` → `environment.API_BASE_SIGNALR`

El backend emite `ReceiveNotification` tras persistir la notificación in-app; el gadget recarga
listado y contador. Otros eventos del mismo hub: `ReceivePanicAlert`,
`ReceiveProjectedExpenseUpdate`, `ReceiveBudgetProposalItemUpdate`, `ConnectedUser`.

### Push web — OneSignal

**Servicio:** `src/app/core/services/one-signal.service.ts`

```
layout-employee / layout-direccion
   └─ initializeAndLoginUser(userId)
        ├─ 1. ¿origen permitido? (environment.ONESIGNAL_ALLOWED_ORIGINS)  ← si no, ABORTA
        ├─ 2. espera el SDK (cola window.OneSignalDeferred, v16)
        ├─ 3. OneSignal.init({ appId, allowLocalhostAsSecureOrigin })
        ├─ 4. OneSignal.login(externalUserId)   ← registra el alias external_id
        └─ 5. ensureOneSignalSubscription()     ← opt-in si hay permiso
```

**El `external_id` es la llave del sistema:** el backend envía con
`include_aliases.external_id = [userId]`. Si el navegador nunca ejecutó `login()`, OneSignal
acepta la petición y **no la entrega a nadie, sin error**.

`ONESIGNAL_ALLOWED_ORIGINS` debe incluir **`http://localhost:4200`** además del dominio de
producción; si falta, el push web no funciona en desarrollo.

**SDK auto-hospedado** en `client/angular/public/` (`OneSignalSDK.page.js`,
`OneSignalSDK.page.es6.js`, `OneSignalSDK.sw.js`, `OneSignalSDKWorker.js`,
`OneSignalSDKUpdaterWorker.js`). Se sirve desde el propio origen porque los bloqueadores de
publicidad tienen `cdn.onesignal.com` en lista negra. `angular.json` copia `public/**` a la raíz
del `dist`.

**Click en la notificación:** el listener lee `event.notification.data.route` y navega con
`router.navigateByUrl` dentro de `zone.run`.

---

## 🧪 Panel de pruebas

**Ruta:** `/admin/testsignalr` — `src/app/apps/admin.luxuryapp/herramientas-dev/testsignalr/`

Cuatro bloques: contenido del mensaje · envío a un usuario (in-app, SignalR, push móvil, push web)
· destinatario externo (correo, WhatsApp) · envío masivo por SignalR.

**Endpoints de diagnóstico** (`api/admin/notification-diagnostics/`): `test-notification-user`,
`test-email`, `test-one-signal`, `test-one-signal-web`, `test-whatsapp`, `test-signal-r/{userId}`,
`test-signal-users`, `connected-users`, `users`.

> ⚠️ **Al probar en desarrollo:** hay que iniciar sesión con el usuario de pruebas. La guarda
> redirige el envío a ese `external_id`, pero el navegador registró el de quien inició sesión;
> si no coinciden, no llega nada y no hay error.

---

## ⚠️ Reglas obligatorias

1. **Rutas relativas en el código y en BD.** La absoluta la resuelve el dispatcher.
2. **Prohibido concatenar `https://luxurybuildingapp.com`.** Se usa `INotificationUrlResolver`.
3. **Archivos con `IFileReadPathService`.** Nunca reconstruir `/api/files/download?filePath=`.
4. **Correo siempre Razor** con constante de `EmailTemplates` + layout compartido. Sin `StringBuilder`.
5. **Estilos de correo desde `EmailDesignTokens`.** Ningún hex suelto.
6. **`NotificationCategory`**, no strings libres.
7. **La guarda de destinatarios vive en la etapa final** de cada canal, no en los servicios de negocio.
8. **`NotificationChannel` sólo crece al final** — se persiste en `NotificationLog`.

## 🚫 Anti-patrones

| ❌ Nunca | ✅ En su lugar |
|:---|:---|
| `$"https://luxurybuildingapp.com{ruta}"` | `urlResolver.ToAbsoluteWeb(ruta)` |
| `$"…/api/files/download?filePath={encoded}"` | `fileReadPathService.GetCustomerPhotoPath(...)` |
| `new StringBuilder()` para el HTML del correo | Plantilla `.cshtml` + `EmailTemplates` |
| `NotificationType = "Personal"` | `Category = NotificationCategory.Personal` |
| Push con `url` relativa | El dispatcher entrega la absoluta |
| `if (env.IsDevelopment())` en un servicio de negocio | `IDevelopmentRecipientGuard` |

---

## ⏳ Pendientes conocidos

| Tema | Estado |
|:---|:---|
| **Push móvil** | Flujo **no implementado**. El binding `Configure<OneSignalSettingsDTO>(GetSection("OneSignal"))` apunta a una sección que no existe en los `appsettings` (sólo hay `OneSignalEmail` y `OneSignalWeb`), por lo que sale con `AppId`/`RestApiKey` nulos. Anotado en `OptionsServiceExtensions.cs` |
| **WhatsApp en el dispatcher** | Pedir el canal lanza `NotSupportedException`. `ITwilioWhatsAppService` sólo expone métodos de ticket legal, sin plantilla tipada |
| **Unificar OneSignal** | `SendOneSignalService` y `SendOneSignalWebService` duplican lógica. Falta un `OneSignalPayload` tipado parametrizado por `app_id`/`key`. **No es un borrado:** ambos están en uso |
| **Columna `NotificationType`** | Sigue siendo `string` en BD; migrarla a `int` requiere migración de datos |

---

## 📚 Referencias

- **Auditoría original y remediación:** [../../../docs/SystemLuxuryApp/Notifications/20260812-auditoria-system-notificaciones.md](../../../docs/SystemLuxuryApp/Notifications/20260812-auditoria-system-notificaciones.md)
- **Estándar de mensajería:** [../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md](../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md)
- **Tokens de diseño:** `CONVENTIONS.md` §6.1 · `client/angular/src/styles/core/_colors.scss`
- **Paginación (contrato hermano):** [../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-paginacion.md](../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-paginacion.md)

---

**Última actualización:** 2026-08-12
**Responsable:** Tech Lead / Architecture Team
