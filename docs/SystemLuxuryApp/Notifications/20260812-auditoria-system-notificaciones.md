# Auditoría: Sistema de Notificaciones — URLs, Estilos, Inconsistencias

**Fecha:** 2026-08-12  
**Alcance:** Backend (`api/LuxuryApp.*`) — construcción de mensajes (Email, Push, In-App, WhatsApp)  
**Severidad:** 🔴 CRÍTICA (4 hallazgos que rompen dev/prod + marca)  
**Estado:** Fases 1–4 **completadas** el 2026-08-12 — ver §G. Queda la Fase 5 (unificar OneSignal, WhatsApp tipado, columna `NotificationType`).  
**Propuesta de remediación:** [../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md](../specifications/../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md) §7 (plan) y §10 (artefactos)

---

## Resumen Ejecutivo

El sistema de notificaciones tiene **3 patrones inconsistentes de URL** + **colors hardcodeados fuera de marca**:

1. **URLs absolutas hardcodeadas** — `https://luxurybuildingapp.com/...` literal en 6+ ubicaciones (rompe dev/prod)
2. **URLs relativas sin resolver** — Push OneSignal recibe `/tasks/...` (no navega en móvil/web)
3. **Base URL de 4 fuentes distintas** — `configuration["LuxuryApp:PathFront"]`, `https://...` literal, `IBaseUrlService`, `http://` vs `https://` inconsistente
4. **Colores hardcodeados fuera de marca** — `#0056b3`, `#28a745`, `#0A2342` (violación CONVENTIONS §6.1); marca correcta es `#003152`

**Impacto:**
- Correos/push con URLs rotas en dev/prod
- Inconsistencia visual (marca rota)
- Imposible centralizar lógica de resolución

---

## A. Hallazgo 1: URLs Absolutas Hardcodeadas

### A.1 Reporte de hallazgos

| Archivo | Línea | Código | Contexto | Severidad |
|---------|-------|--------|---------|-----------|
| `SendEmailAppService.cs` | 271 | `$"https://luxurybuildingapp.com/publico/operation-report-client/{customerId}/..."` | HTML inline email reporte operacional | 🔴 CRÍTICA |
| `SendEmailAppService.cs` | 275 | `$"https://luxurybuildingapp.com/api/files/download?filePath={encoded}"` | Adjunto de archivo en correo | 🔴 CRÍTICA |
| `SendEmailAppService.cs` | 424 | `$"https://luxurybuildingapp.com/api/files/download?filePath={encoded}"` | Adjunto en reporte ejecutivo | 🔴 CRÍTICA |
| `SendEmailAppService.cs` | 544 | `$"https://luxurybuildingapp.com/api/files/download?filePath={encoded}"` | Adjunto en correo operación | 🔴 CRÍTICA |
| `SendEmailAppService.cs` | 686 | `$"https://luxurybuildingapp.com/api/files/download?filePath={encoded}"` | Adjunto en correo compra | 🔴 CRÍTICA |
| `CommitteeWelcomeEmailDTO.cs` | 35 | `LoginLink = "https://luxurybuildingapp.com/auth/login"` | Default en DTO | 🔴 CRÍTICA |
| `UserCredentialsEmailDTO.cs` | 29 | `LoginLink = "https://luxurybuildingapp.com/auth/login"` | Default en DTO | 🔴 CRÍTICA |
| `CandidateNotificationCoordinatorService.cs` | 645 | `BuildAbsoluteFrontendUrl(recruitmentRoute)` → `"https://luxurybuildingapp.com"` | Base absoluta hardcodeada | 🔴 CRÍTICA |
| `RecoveryAccountUserAppService.cs` | 22 | `"http://luxurybuildingapp.com/auth/reset-password"` | Recovery password (HTTP, no HTTPS) | 🔴 CRÍTICA |
| `FinancialReportAppService.cs` | — | `https://luxurybuildingapp.com/...` | Enlace en reporte financiero (**no listado en la v1 de esta auditoría**) | 🔴 CRÍTICA |

> **Conteo real (barrido 2026-08-12):** 16 ocurrencias del literal en 9 archivos `.cs`/`.cshtml` de `api/`
> (excluyendo `bin/` y `obj/`). `CorsServiceExtensions.cs` aparece en el barrido pero es uso legítimo
> (origen CORS), no mensajería. `IBaseUrlService.cs` también aparecía: ya centralizado en
> `BaseUrlService.FallbackProductionUrl` (único literal permitido).

### A.2 Patrón detectado

```csharp
// ❌ INCORRECTO (SendEmailAppService.cs:271, 275, 424, 544, 686)
var downloadUrl = $"https://luxurybuildingapp.com/api/files/download?filePath={encoded}";
// Hardcodeada + reinventa lógica de IFileReadPathService
// + rompe entre dev (localhost) y prod

// ❌ INCORRECTO (CandidateNotificationCoordinatorService.cs:645)
var recruitmentAbsoluteUrl = BuildAbsoluteFrontendUrl(recruitmentRoute);
// → "$"https://luxurybuildingapp.com" + route literal

// ✅ CORRECTO (existe pero no se usa)
var secureUrl = fileReadPathService.GetSecureFileUrl(...);  // Resuelve ruta + base desde config
```

### A.3 Problema

- **Config rota en dev/prod:** hardcodeada a dominio de producción
- **Duplicación de lógica:** cada correo reinventa `IFileReadPathService.GetSecureFileUrl`
- **Sin aislamiento de cambios:** si base URL cambia, hay que tocar N archivos

---

## B. Hallazgo 2: URLs Relativas Sin Resolver

### B.1 Reporte de hallazgos

| Archivo | Línea | Código | Contexto | Severidad |
|---------|-------|--------|---------|-----------|
| `TaskAppService.cs` | 728 | `Url = $"/tasks/message/{entity.Id}/{entity.WorkGroupId}"` | In-App + Push notification | 🔴 CRÍTICA |
| `TaskAppService.cs` | 748 | `$"http://luxurybuildingapp.com{notification.Url}"` | Email usa relativa BUT envía con http:// | ⚠️ ROTO |
| `FundingNotificationOrchestrator.cs` | 20 | `route: "/funding/details/{id}"` | Push OneSignal recibe relativa | 🔴 CRÍTICA |
| `HrNotificationOrchestrator.cs` | 35 | `route: ...` | Push OneSignal recibe relativa | 🔴 CRÍTICA |
| `JuntaMensualNotificationOrchestrator.cs` | 32 | `route: "/calendars/google-calendar"` | Push OneSignal recibe relativa | 🔴 CRÍTICA |

### B.2 Patrón detectado

```csharp
// ❌ INCORRECTO (TaskAppService.cs:728)
var notification = new NotificationUserAddOrEditDTO
{
    Url = $"/tasks/message/{entity.Id}/{entity.WorkGroupId}"  // Relativa
};

await notificationOrchestratorService.NotifyUserAsync(notification);
// OneSignal recibe: { url: "/tasks/message/..." } → NO NAVEGA EN MÓVIL/WEB
// Cliente móvil no resuelve relativa → link roto

// ❌ INCORRECTO (TaskAppService.cs:748)
var baseUrlForEmail = $"http://luxurybuildingapp.com{notification.Url}";  // http://, no https://
```

### B.3 Problema

- **OneSignal no navega con URLs relativas** en app móvil/web (espera absoluta en campo `url`)
- **Email mezcla http/https** → consistencia rota
- **El campo `data.route` (sí relativa) se ignora** → deep-linking perdido

---

## C. Hallazgo 3: Base URL Leída de 4 Fuentes Distintas

### C.1 Inventario de fuentes

| Fuente | Archivo | Línea | Valor | Problema |
|--------|---------|-------|-------|----------|
| `configuration["LuxuryApp:PathFront"]` | `SolicitudBajaAppService.cs` | 252 | Depende de `appsettings.json` | No centralizado |
| Literal `https://luxurybuildingapp.com` | `CandidateNotificationCoordinatorService.cs` | 645 | Hardcodeada | Roto en dev |
| `IBaseUrlService.GetBaseUrlApi()` | Existe desde antes | N/A | `https://api.luxuryapp.com/` | **Existe pero email NO lo usa** |
| `http://` vs `https://` | `TaskAppService.cs` | 748,749 | Inconsistente | Violación protocolo |

### C.2 Lo que faltaba en `IBaseUrlService` — ✅ RESUELTO (Fase 1)

```csharp
public interface IBaseUrlService
{
    string GetBaseUrlApi();        // ✅ ya existía
    string GetBaseUrlOneSignal();  // ✅ ya existía
    string GetBaseUrlWeb();        // ✅ AGREGADO — lee LuxuryApp:PathFront, sin barra final
    string GetBaseUrlPublic();     // ✅ AGREGADO — GetBaseUrlWeb() + "/publico"
}
```

> Nota: el borrador de esta auditoría suponía claves `LuxuryApp:BaseUrlApi` /
> `LuxuryApp:BaseUrlOneSignal`. En el repo real `GetBaseUrlApi()` resuelve por
> `AppSettings:BaseUrl` + contexto HTTP, y `GetBaseUrlOneSignal()` devuelve la URL fija
> de la API de OneSignal. `GetBaseUrlWeb()` reutiliza `LuxuryApp:PathFront`, que ya existía
> en ambos entornos — no se introdujo ninguna clave nueva.

### C.3 Problema — ✅ RESUELTO

- ~~Sin centralización~~ → `INotificationUrlResolver` es el único punto de resolución
- ~~Sin config management~~ → un solo literal de dominio (`BaseUrlService.FallbackProductionUrl`)
- ~~Sin ambiente management~~ → dev/prod se diferencian por `LuxuryApp:PathFront`

---

## D. Hallazgo 4: Colores Hardcodeados Fuera de Marca

### D.1 Reporte de hallazgos

| Archivo | Línea | Color | Uso | Debería ser | Severidad |
|---------|-------|-------|-----|-------------|-----------|
| `SendEmailAppService.cs` | 44 | `#0056b3` | Header email | `#003152` (primary-700) | 🔴 CRÍTICA |
| `SendEmailAppService.cs` | 44,46,50 | `Arial` | Tipografía | `Outfit` (DS) | 🔴 CRÍTICA |
| `_EmailLayout.cshtml` | líneas varias | `#0A2342` | Header | `#003152` | ✅ **RESUELTO** — ya consume `EmailDesignTokens` |
| Templates inline | varias | `#28a745` | Success | `#1e9b6d` (success-600 DS) | 🔴 CRÍTICA |
| Templates inline | varias | `#003d9b`, `#2196F3` | Botones | `#003152` | 🔴 CRÍTICA |

### D.2 Patrón detectado (violación CONVENTIONS §6.1)

```csharp
// ❌ INCORRECTO (SendEmailAppService.cs:43-51) — StringBuilder + colores hardcodeados
sb.Append("body { font-family: Arial, sans-serif; color: #333; }");
sb.Append("h2 { color: #0056b3; border-bottom: 2px solid #0056b3; }");  // ← Fuera de marca
sb.Append("h3 { background-color: #f2f2f2; padding: 8px; border-left: 5px solid #0056b3; }");
sb.Append("th { background-color: #eee; text-align: left; }");
// NUNCA usa marca + NO reutilizable

// ✅ CORRECTO (mensajes.md §10 — ya implementado en cimiento)
// EmailDesignTokens.cs:
public const string Primary = "#003152";  // primary-700, marca ancla
// _EmailLayout.cshtml:
var primary = EmailDesignTokens.Primary;  // Inyecta desde DS
```

### D.3 Problema

- **Violación CONVENTIONS §6.1 (Tokens CSS NUNCA hardcoding)**
- **Marca inconsistente:** emails ven `#0056b3`, app ve `#003152` (usuario confundido)
- **Imposible actualizar:** cambio de paleta = tocar N templates

---

## E. Matriz de Módulos vs Patrones Violados

| Módulo | A (Abs Hard) | B (Rel Sin) | C (4 Fuentes) | D (Colors) | Líneas |
|--------|---|---|---|---|---|
| `SendEmailAppService` | 🔴 :271,275,424,544,686 | ⚠️ :748 | 🔴 sin config | 🔴 :44-50 | 772 ln |
| `TaskAppService` | — | 🔴 :728,748,749 | 🔴 http: | — | 1340 ln |
| `CandidateNotificationCoordinator` | 🔴 :645 | — | 🔴 hardcode | — | 527 ln |
| `RecoveryAccountUserAppService` | 🔴 :22 (http:) | — | — | — | — |
| `CommitteeWelcomeEmailDTO` | 🔴 :35 | — | — | — | DTO |
| `UserCredentialsEmailDTO` | 🔴 :29 | — | — | — | DTO |
| `FundingNotificationOrchestrator` | — | 🔴 :20 | — | — | — |
| `HrNotificationOrchestrator` | — | 🔴 :35 | — | — | — |
| `JuntaMensualNotificationOrchestrator` | — | 🔴 :32 | — | — | — |
| **Total violaciones** | **8** | **5** | **5** | **1 archivo** | — |

---

## F. Impacto por Severidad

### 🔴 CRÍTICA (bloquea dev/prod)

**A1 — URLs absolutas hardcodeadas:**
```
Escenario:
  dev (localhost:3000) → correo con https://luxurybuildingapp.com/...
  usuario hace click → intenta ir a prod
  
Alternativa:
  Si dev está en http:// → mezcla de protocolos, SSL warning
```

**B1 — URLs relativas sin resolver:**
```
Escenario:
  Push OneSignal: { url: "/tasks/message/123" }
  Usuario en app móvil hace click
  → intenta navegar a "/(relativa)" → no existe
  → link roto
```

**D1 — Colores hardcodeados:**
```
Escenario:
  Usuario recibe correo (azul #0056b3)
  Usuario abre app (azul #003152 diferente)
  → Confusión de marca
```

### ⚠️ IMPORTANTE (mejorable)

**C1 — Base URL de múltiples fuentes:**
- Técnico: dificulta centralizar cambios
- No rompe hoy, pero frágil

---

## G. Plan de Remediación

Referencia: [../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md](../specifications/../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md) §7 (Plan de migración en 4 fases).

### Fase 1 — Cimientos ✅ COMPLETADA (2026-08-12)

- [x] `EmailDesignTokens.cs` + `_EmailLayout.cshtml` DS-driven (ya estaba, ver spec §10.1–10.2)
- [x] Extender `IBaseUrlService`: `GetBaseUrlWeb()` (lee `LuxuryApp:PathFront`), `GetBaseUrlPublic()` (web + `/publico`)
- [x] Crear `NotificationCategory` (enum, `[Display]` en español) — reemplaza strings libres
- [x] Crear `INotificationUrlResolver` + `NotificationUrlResolver` — centraliza la URL absoluta
- [x] Registrar `INotificationUrlResolver` en DI (`DependencyInjection.Infrastructure.cs`)
- [x] Centralizar el literal del dominio en `BaseUrlService.FallbackProductionUrl`

**Validación ejecutada:**
```bash
grep -r "INotificationUrlResolver" api/     # interfaz + impl + registro DI
dotnet build LuxuryApp.Shared                # 0 errores
dotnet build LuxuryApp.Api                   # 0 errores
```

> Nota: `INotificationUrlResolver` resuelve **rutas**; los **archivos** siguen resolviéndose con
> `IFileReadPathService` (su `GetSecureFileUrl` es privado y ya hay un método público por tipo
> de documento). No se duplica esa lógica.

### Fase 2 — Dispatcher ✅ COMPLETADA (2026-08-12)

- [x] Implementar `INotificationDispatcher` — canales In-App (+SignalR), Push móvil, Push Web, Email
- [x] Marcar `INotificationOrchestratorService` y `NotificationOrchestratorService` como `[Obsolete]`
- [x] Validar que el dispatcher resuelve URL absoluta antes de enviar a push (7 tests unitarios)
- [x] `NotificationChannel`: agregados `InApp = 3` y `PushWeb = 4` (append-only; los valores 0–2 se persisten en `NotificationLog.Channel` y NO se tocaron)
- [x] Eliminado registro DI duplicado de `INotificationOrchestratorService` (estaba en `Controllers.cs` **y** `Infrastructure.cs`)

**Archivos:**
- `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/SystemTenant/Notification/Interfaces/INotificationDispatcher.cs`
- `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/SystemTenant/Notification/Services/NotificationDispatcher.cs`
- `api/LuxuryApp.Shared/DTOs/NotificationRequestDTO.cs`
- `api/LuxuryApp.Tests/Application/Modules/System/Notifications/NotificationDispatcherTests.cs`

**Validación ejecutada:**
```bash
dotnet build LuxuryApp.sln                                              # 0 errores
dotnet test --filter FullyQualifiedName~NotificationDispatcherTests     # 7/7 OK
```

> **Alcance del dispatcher:** WhatsApp queda fuera hasta Fase 3 — `ITwilioWhatsAppService` sólo
> expone métodos específicos de ticket legal, sin plantilla tipada. Pedir ese canal lanza
> `NotSupportedException` (falla visible, no silenciosa).
>
> **Deuda visible:** el `[Obsolete]` genera warnings CS0618 en los 8 consumidores del orquestador
> viejo. Es intencional: son exactamente los llamadores a migrar en Fase 3.

### Fase 3 — Migrar Features ✅ COMPLETADA (2026-08-12)

| # | Objetivo | Resultado |
|---|---|---|
| 1 | **TaskAppService** — 11 construcciones sueltas de notificación | ✅ Un solo helper `NotifyTaskAsync` → `DispatchAsync`; ruta relativa centralizada en `TaskRoute()`; `http://luxurybuildingapp.com` eliminado de :749 y :448 |
| 2 | **SendExecutivePendingReportAsync** — StringBuilder | ✅ `ExecutivePendingReportEmail.cshtml` + `ExecutivePendingReportEmailDTO`; el semáforo se calcula en C# y los colores salen de `EmailDesignTokens` |
| 3 | **CandidateNotificationCoordinatorService** | ✅ `BuildAbsoluteFrontendUrl` ahora delega en `INotificationUrlResolver`; `NotifyUsersAsync` usa el dispatcher |
| 4 | **RecoveryAccountUserAppService** | ✅ URL resuelta por entorno (adiós al `http://` sin TLS **y** al `if (IsDevelopment())`) |
| 5 | **DTOs de correo** | ✅ `LoginLink` ya no trae dominio por defecto; lo inyectan `RecoveryAccountUserAppService` y `ComiteVigilanciaAppService` |
| 6 | **SendEmailAppService** — 6 hardcodes | ✅ 4 logos vía `IFileReadPathService.GetCustomerPhotoPath`, 2 rutas públicas vía `ToAbsolutePublic` |
| 7 | **Orquestadores** Funding / JuntaMensual | ✅ Migrados al dispatcher: el push ahora recibe URL absoluta (**cierra hallazgo B**) |
| 8 | **HrNotificationOrchestrator** | ✅ Resuelve la absoluta antes de push/email; conserva sus servicios de feature |
| 9 | **Consumidores del orquestador obsoleto** | ✅ Announcement, CobranzaNativa, EquipmentInspection, RecurringTaskGenerator migrados |

**Cero hardcodes de `luxurybuildingapp.com` en código vivo.** Quedan sólo:
`CorsServiceExtensions.cs` (origen CORS, legítimo), `BaseUrlService.FallbackProductionUrl`
(único fallback documentado), comentarios en `FinancialReportAppService.cs` y la documentación
XML del propio resolver.

**Validación ejecutada:**
```bash
grep -rn "luxurybuildingapp\.com" api --include=*.cs --include=*.cshtml   # sólo los 4 casos anteriores
dotnet build LuxuryApp.sln                                                # 0 errores
dotnet test LuxuryApp.Tests                                               # 436 OK / 4 fallos preexistentes
```

> **Deuda que queda para Fase 4:** `HrNotificationCoordinatorHelper` (ya marcado `[Obsolete]` y
> **sin llamadores**), `FundingPushService` / `FundingRealTimeService` (quedaron sin uso al migrar
> su orquestador) y el propio `NotificationOrchestratorService`, que ya no tiene consumidores.

### Fase 4 — Limpieza ✅ COMPLETADA (2026-08-12)

**Código muerto eliminado** (4 archivos borrados, cero consumidores en cada caso):

| Elemento | Por qué era muerto |
|---|---|
| `NotificationOrchestratorService` + `INotificationOrchestratorService` | Su último consumidor era el helper de RH, también huérfano |
| `HrNotificationCoordinatorHelper` | Ya venía `[Obsolete]`; grep confirmó **cero** llamadores |
| `FundingPushService` / `IFundingPushService` | Envoltorio de un método sobre `ISendOneSignalWebService`; sin uso tras migrar el orquestador |
| `FundingRealTimeService` / `IFundingRealTimeService` | Envoltorio de un método sobre `ISendSignalRService`; ídem |
| `FundingEmailService` / `IFundingEmailService` | Interfaz **vacía** con implementación vacía («reservado para el futuro») |

También se quitaron sus registros de DI y el `#pragma warning disable CS0618` que sostenía
la coexistencia con el orquestador viejo.

> ⚠️ **Corrección a una auditoría posterior:** circuló un pendiente que decía
> *«Eliminar `SendOneSignalWebService` (duplicado)»*. **Borrarlo rompería el push web.**
> No es código muerto: lo consumen `NotificationDispatcher` (canal `PushWeb`),
> `PanicAlertNotificationService`, `HrPushService`, `FundingNotificationOrchestrator`
> y el endpoint `test-one-signal-web`. Lo que el estándar §5.5 pide no es borrarlo, sino
> **unificar** móvil y web en un `OneSignalPayload` tipado con un solo servicio parametrizado
> por `app_id`/`key`. Eso sigue pendiente y **no es un borrado de 30 minutos**.

**Auditoría final de hardcodes** (`grep -rn "luxurybuildingapp\.com" api --include=*.cs --include=*.cshtml`):

| Ocurrencia | Veredicto |
|---|---|
| `BaseUrlService.FallbackProductionUrl` | ✅ Legítima — último recurso si falta configuración |
| `CorsServiceExtensions.cs:55` | ✅ Legítima — origen CORS, no es mensajería |
| `FinancialReportAppService.cs:434,436` | ✅ Dentro de código comentado, no compila |
| Documentación XML de `IBaseUrlService` / `INotificationUrlResolver` | ✅ Son ejemplos en comentarios |

**Cero hardcodes en código vivo de mensajería.**

**Validación:** `dotnet build LuxuryApp.sln` → 0 errores · `dotnet test` → 440 OK, 4 fallos preexistentes.

### G-ter. Push OneSignal: por qué sólo funcionaba en producción (2026-08-12)

**Causa raíz (frontend):** `OneSignalService.initializeAndLoginUser` aborta si el origen actual
no está en `environment.ONESIGNAL_ALLOWED_ORIGINS`, y el `environment.ts` de **desarrollo**
sólo listaba `https://luxurybuildingapp.com`. En dev el origen es `http://localhost:4200`,
así que **nunca se ejecutaba `init()` ni `login()`**: el navegador jamás registraba el
`external_id`, y el backend enviaba a un alias inexistente (OneSignal acepta la petición y
no entrega a nadie, sin error visible).

| Corrección | Archivo |
|---|---|
| Agregado `http://localhost:4200` a la lista de orígenes | `src/environments/environment.ts` y `environment.example.ts` |
| Cola de arranque migrada de `window.OneSignal` (patrón v15) a `window.OneSignalDeferred` (v16) | `src/app/core/services/one-signal.service.ts` |
| La referencia al SDK se toma **después** de esperarlo (antes quedaba obsoleta: v16 reemplaza `window.OneSignal` al cargar) | ídem |

> El auto-hospedaje del SDK en `public/` (hecho previamente para evitar
> `ERR_BLOCKED_BY_CLIENT` del adblocker sobre `cdn.onesignal.com`) está correctamente
> cableado y se conserva, pero **atacaba otro síntoma**: aunque el SDK cargara, el
> `return` temprano por origen no permitido dejaba todo sin inicializar.

**Para probar en dev:** hay que iniciar sesión con el usuario de pruebas
(`DevelopmentSettings:TestNotificationUserId`). La guarda de destinatarios redirige el push a
ese usuario, mientras que el navegador registra el `external_id` de quien inició sesión; si no
coinciden, el push no llega y no hay error.

**Push móvil: PENDIENTE — flujo no implementado.** El binding
`services.Configure<OneSignalSettingsDTO>(configuration.GetSection("OneSignal"))` apunta a una
sección que **no existe** en ninguno de los `appsettings` (sólo hay `OneSignalEmail` y
`OneSignalWeb`), por lo que `SendOneSignalService` opera con `AppId`/`RestApiKey` nulos.
Se dejó anotado en `OptionsServiceExtensions.cs`; se resolverá al implementar el canal móvil.

---

### Fase 5 — pendiente (no es limpieza: es rediseño de canal)

- [ ] **Unificar OneSignal:** un `OneSignalPayload` tipado y un solo servicio parametrizado por
      `app_id`/`key`, que reemplace al par `SendOneSignalService` / `SendOneSignalWebService`.
      Hay que migrar 5 consumidores; **no es un borrado**.
- [ ] **WhatsApp tipado:** plantillas en vez de concatenación, y habilitar el canal en
      `INotificationDispatcher` (hoy lanza `NotSupportedException`).
- [ ] **`NotificationType` en BD:** la columna sigue siendo `string`; migrarla a `int` con el
      valor de `NotificationCategory` requiere migración de datos.
- [x] ~~Eliminar literales de URL~~ — cerrado en Fase 3
- [x] ~~Audit: verificar que cero hardcodes quedan~~ — cerrado arriba

---

## G-bis. Destinatarios fuera de Producción (2026-08-12)

Auditoría de la **etapa final** de cada canal: ¿a quién le llega el mensaje cuando la API
no corre en Producción?

### Estado ANTES

| Canal | ¿Redirigía? | Destino |
|---|---|---|
| Push móvil / Push web / SignalR | ✅ | GUID hardcodeado en 5 archivos |
| **In-App (`NotificationUser`)** | ❌ | **el usuario real** |
| Email | ✅ | `gerente.mtto@luxurybuildingsite.com` |
| WhatsApp ticket legal | ✅ (no enviaba nada) | nadie |
| **WhatsApp `test-whatsapp`** | ❌ | **el teléfono del body** |

Problemas: el usuario de pruebas recibía el push pero **no veía nada en la campana**;
los usuarios reales acumulaban notificaciones falsas en la BD de desarrollo; el GUID vivía
hardcodeado en 5 archivos mientras `DevelopmentSettings:TestNotificationUserId` **no lo leía nadie**.

### Estado DESPUÉS

`IDevelopmentRecipientGuard` (`api/LuxuryApp.Shared/Services/IDevelopmentRecipientGuard.cs`)
centraliza la decisión y se aplica en la etapa final de cada canal:

| Canal | Servicio | Destino fuera de Producción |
|---|---|---|
| In-App | `NotificationUserAppService.CreateNotificationAsync` | `TestNotificationUserId` |
| Push móvil | `SendOneSignalService` (3 métodos) | `TestNotificationUserId` |
| Push web | `SendOneSignalWebService` (3 métodos) | `TestNotificationUserId` |
| SignalR | `SendSignalRService` | `TestNotificationUserId` |
| WhatsApp | `TwilioWhatsAppService` (etapa final, cubre diagnóstico) | `TestWhatsAppNumber` |
| Email | `SendEmailService` | *(sin cambios: `gerente.mtto@…`)* |

**Configuración** (`appsettings.json` y `appsettings.Development.json`):
```json
"DevelopmentSettings": {
  "TestNotificationUserId": "3e1ff763-c104-42fe-bb03-1e4c24493f89",
  "TestWhatsAppNumber": "+5215559878523"
}
```

**Decisiones:**

- El criterio es **`!IsProduction()`**, no `IsDevelopment()`: Staging o cualquier entorno futuro
  también redirige. Producción es el único que entrega a destinatarios reales.
- `TaskLegalWhatsAppService` ya **no** hace `if (!IsProduction()) return;`. Fuera de Producción
  ahora **sí envía**, al número de pruebas — que era el objetivo: comprobar que el canal funciona.
  Manda **una sola vez** (sus 2 destinos de producción se colapsarían en el mismo teléfono).
- Si falta la clave de configuración, la guarda **no redirige** y deja un `LogWarning`: es preferible
  a mandar el mensaje a un destinatario vacío.
- GUID eliminado de los 5 archivos donde estaba hardcodeado; ahora sale de configuración.

**Validación:** `DevelopmentRecipientGuardTests` — 5 tests (Development, Staging, Production,
colapso de lista, sin configuración).

---

## H. Checklist de Validación Post-Remediación

- [x] Toda URL en BD es **relativa** (ej: `/tasks/message/{id}`) — el dispatcher persiste `ActionRoute` sin tocar
- [x] Cero `https://luxurybuildingapp.com` literal en código backend — salvo CORS y el fallback documentado
- [x] Adjuntos usan `IFileReadPathService` (no reconstrucción manual de `/api/files/download`)
- [x] `NotificationCategory` (enum) existe y lo usa el dispatcher — *(la columna en BD sigue siendo `string`: el enum se serializa por nombre; cambiar el tipo de la columna es trabajo de Fase 4)*
- [x] Email **siempre Razor** + layout con `EmailDesignTokens` — último `StringBuilder` eliminado en Fase 3
- [ ] Push usa `OneSignalPayload` único (Mobile y Web unificados) — **Fase 4**
- [x] `INotificationDispatcher` orquesta los canales — *(excepto WhatsApp, que lanza `NotSupportedException`; Fase 4)*
- [x] Dev/prod auto-resuelven base URL desde `IBaseUrlService`
- [x] Destinatarios fuera de Producción centralizados en `IDevelopmentRecipientGuard` — ver §G-bis
- [ ] **Prueba manual pendiente:** levantar la API en dev y confirmar que un correo real trae
      enlaces a `http://localhost:4200` y que el push abre la ruta absoluta correcta *(no se validó
      en ejecución: la cobertura es de tests unitarios y compilación)*

---

## I. Referencias de Código (Evidencia)

**Hardcodes (A):** — rutas verificadas contra el repo el 2026-08-12
- `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/Infrastructure/SendEmail/Services/SendEmailAppService.cs:271,275,424,544,686`
- `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/SendEmailGlobal/Features/Committee/SendEmail/ViewModels/CommitteeWelcomeEmailDTO.cs`
- `api/LuxuryApp.Application/Moduls/AuthLuxuryApp/AccountRecovery/SendEmailGlobal/SendEmail/ViewModels/UserCredentialsEmailDTO.cs`
- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Notifications/Services/CandidateNotificationCoordinatorService.cs:645`
- `api/LuxuryApp.Application/Moduls/AuthLuxuryApp/AccountRecovery/Services/RecoveryAccountUserAppService.cs`
- `api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/FinancialAccounting/Services/FinancialReportAppService.cs`

**Relativas sin resolver (B):**
- `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/Tasks/Services/TaskAppService.cs:728,748,749`
- `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/SendEmailGlobal/Features/Funding/Orchestrator/FundingNotificationOrchestrator.cs:20`
- `api/LuxuryApp.Application/Moduls/ComunicacionesLuxuryApp/Hr/Orchestrators/HrNotificationOrchestrator.cs:35`
- `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/JuntasMensuales/Notifications/Services/JuntaMensualNotificationOrchestrator.cs`

**Base URL (C):**
- `api/LuxuryApp.Shared/Services/IBaseUrlService.cs` (falta `GetBaseUrlWeb()`, `GetBaseUrlPublic()`)
- `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/SolicitudBaja/Services/SolicitudBajaAppService.cs:252` (usa `configuration["LuxuryApp:PathFront"]`)

**Colores (D):**
- `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/Infrastructure/SendEmail/Services/SendEmailAppService.cs:44-50` (StringBuilder)
- `api/LuxuryApp.Api/Infrastructure/Email/Templates/Shared/_EmailLayout.cshtml` (legacy hardcodes)

**Fuente de verdad Design System (referencia):**
- `client/angular/src/styles/core/_colors.scss` (primary-700 = `#003152`)
- `CONVENTIONS.md §6.1` (🔴 Tokens CSS — NUNCA hardcoding)

---

## J. Documentación Relacionada

- [Estándar de Notificaciones Propuesto](../specifications/../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md) — §7 plan de fases · §10 artefactos implementados (Fase 1 ✅)
- [CONVENTIONS.md §5.9.1 Notificaciones](../../CONVENTIONS.md) — reglas mínimas mientras se remedia
- [Reporte de Sesión](../../../docs/SystemLuxuryApp/Notifications/20260812-changelog-system-notifications-sesion.md) — consolidación + checklist

---

**Auditoría completada:** 2026-08-12  
**Fases 1–4 de remediación completadas:** 2026-08-12 (rama `feat/notificaciones-fase1-cimientos`)  
**Siguiente paso:** Fase 5 — unificar OneSignal en un payload tipado (NO borrar `SendOneSignalWebService`: está en uso), WhatsApp tipado y migrar la columna `NotificationType` a enum

