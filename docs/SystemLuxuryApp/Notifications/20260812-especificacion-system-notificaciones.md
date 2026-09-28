# Estándar de Mensajería LuxuryApp — Email · Push · In-App · WhatsApp

> **Documento de análisis y propuesta de estándar.**
> Propósito: unificar la forma en que el backend de LuxuryApp construye, estructura y
> enruta mensajes a través de los 4 canales (Email, Push Móvil, Push Web, In-App) y
> WhatsApp, eliminando la fragmentación actual y centralizando la resolución de URLs,
> la marca y los catálogos de tipos de notificación.
>
> **Estado:** Propuesta (pendiente de aprobación Tech Lead).
> **Alcance:** `api/LuxuryApp.*` (Backend). No cubre el render del cliente Angular/Ionic.

---

## 0. Propósito y alcance

Hoy el envío de mensajes está **fragmentado**: cada feature decide por su cuenta cómo
construir el HTML del email, cómo armar la URL que adjunta, si usa plantillas Razor o
`StringBuilder`, y si el push lleva URL relativa o absoluta. Eso produce:

- URLs hardcodeadas (`https://luxurybuildingapp.com/...`) que se rompen entre dev/prod.
- El push de OneSignal recibe rutas **relativas** que no navegan en móvil/web.
- `NotificationType` es un `string` libre (literales `"Personal"`, `"Urgente"`...).
- Dos servicios OneSignal casi idénticos (`SendOneSignalService` / `SendOneSignalWebService`).
- Un orquestador (`NotificationOrchestratorService`) que **solo** cubre In-App + Push,
  dejando Email y WhatsApp sueltos por feature.
- Emails con estilos hardcodeados (`Arial`, `#0056b3`) sin marca ni tokens.

Este documento define el estándar canónico. Las secciones 1-4 documentan el estado
actual (evidencia con `archivo:línea`); la sección 5 define el estándar; la sección 6
muestra **cómo quedarían los mensajes** con ejemplos concretos.

---

## 1. Estado actual — inventario de casos de uso

### 1.1 Canales y servicios

| Canal | Interfaz / Implementación | Proveedor | ¿Orquestado? |
|---|---|---|---|
| **Email** | `ISendEmailAppService` → `SendEmailAppService.cs` (772 ln) → `ISendEmailService` | Brevo | ❌ Por feature (`XxxEmailService`) |
| **Push Móvil** | `ISendOneSignalService` → `SendOneSignalService.cs` | OneSignal | ✅ Parcial (orquestador) |
| **Push Web** | `ISendOneSignalWebService` → `SendOneSignalWebService.cs` | OneSignal (web) | ✅ Parcial (orquestador) |
| **In-App** | `INotificationUserAppService` + entidad `NotificationUser.cs` | DB + SignalR | ✅ Parcial (orquestador) |
| **WhatsApp** | `ITwilioWhatsAppService` → `TwilioWhatsAppService.cs` (legacy `IWhatsAppService` **Obsolete**) | Twilio | ❌ Por feature (`TaskLegalWhatsAppService`) |

Punto de entrada transversal hoy:
`NotificationOrchestratorService.NotifyUserAsync` (`SystemTenant/Notification/Services/NotificationOrchestratorService.cs:40`)
solo hace: (1) persistir In-App, (2) SignalR, (3) Push Móvil, (4) Push Web. **No** incluye Email ni WhatsApp.

### 1.2 Dónde se usan (muestras representativas)

- **Email (Razor, ~30 plantillas)** vía `EmailTemplates` (`SendEmailGlobal/EmailTemplates.cs`):
  Recruitment, HR, Financial, Committee, Auth, Tasks, OperationReport, MeetingMinutes, etc.
- **Email (inline StringBuilder)** — `SendEmailAppService.SendExecutivePendingReportAsync`
  (`SendEmailAppService.cs:42-122`): el único que construye HTML a mano.
- **Push/In-App** — `TaskAppService` (líneas 723, 839, 855, 924, 984, 1164, 1211, 1265, 1316),
  `CobranzaNativaNotificationService.cs:218`, `RecurringTaskGeneratorService.cs:168`,
  `EquipmentInspectionExecutionAppService.cs:593`, `PanicAlertNotificationService.cs:66`,
  `CandidateNotificationCoordinatorService.cs:527`, `HrNotificationCoordinatorHelper.cs:87`.
- **WhatsApp** — `TaskLegalWhatsAppService` → `TwilioWhatsAppService.SendMessageTicketLegalAsync`
  / `SendMessageUpdateTicketLegalAsync` (solo módulo Legal).

---

## 2. Estructura actual de los mensajes

### 2.1 Email — DOS sub-patrones incoherentes

**(A) Razor `.cshtml` centralizado (el bueno).**
`EmailTemplates` (`SendEmailGlobal/EmailTemplates.cs`) expone constantes validadas por
`EmailTemplateValidator` (no se permite ruta literal). Render con
`IRazorViewToStringRenderer.RenderViewToStringAsync(EmailTemplates.X, viewModel)`.
Ejemplo de uso: `RecruitmentEmailService.cs:26`, `HrNotificationServices.cs:16`,
`FinancialNotificationServices.cs:31`, `MeetingNotificationServices.cs:17`.

**(B) HTML inline con `StringBuilder` (el roto).**
`SendExecutivePendingReportAsync` (`SendEmailAppService.cs:43-51`) inyecta estilos a mano:

```csharp
sb.Append("body { font-family: Arial, sans-serif; color: #333; }");
sb.Append("h2 { color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 5px; margin-top: 20px; }");
sb.Append("h3 { background-color: #f2f2f2; padding: 8px; border-left: 5px solid #0056b3; margin-top: 15px; }");
sb.Append("table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 13px; }");
sb.Append("th { background-color: #eee; text-align: left; padding: 8px; border: 1px solid #ddd; }");
sb.Append("td { padding: 8px; border: 1px solid #ddd; }");
```

Sin marca, sin tokens, sin reutilización. Cada correo "express" repite este bloque.

### 2.2 Push OneSignal (móvil y web)

`SendOneSignalService.SendNotificationOneSignalAsync` (`SendOneSignalService.cs:38-50`)
construye un objeto anónimo:

```csharp
var oneSignalNotification = new
{
    app_id = _settings.AppId,
    target_channel = "push",
    headings = new { en = title },
    contents = new { en = message },
    url = route,
    data = new { route },
    include_aliases = new { external_id = new[] { externalUserId } }
};
```

`SendOneSignalWebService` es **casi idéntico** (difiere solo en `WebAppId` / `WebRestApiKey` y
la constante `DevUserId`). No hay modelo tipado; el `url` y `data.route` se reciben del caller.

### 2.3 In-App (`NotificationUser`)

Entidad `NotificationUser.cs` (tabla `NotificationUsers`):

```csharp
public class NotificationUser : GuidIdEntity
{
    public string Title { get; set; }              // título
    public string Message { get; set; }            // cuerpo
    public string NotificationType { get; set; }   // ⚠️ string LIBRE
    public bool IsRead { get; set; } = false;
    public string ApplicationUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string Url { get; set; }                // redirección al click
}
```

`NotificationType` **no es enum**: se usan literales `"Personal"`, `"Urgente"`,
`"NewTask"`, `"PagoRecibido"` en distintos módulos.

### 2.4 WhatsApp

`TwilioWhatsAppService.SendMessageTicketLegalAsync` (`TwilioWhatsAppService.cs:27-41`):

```csharp
var body = $"📋 {title}\nFolio: {folio}\nCliente: {cliente}\nSolicita: {solicita}\nID: {ticketId}";
await MessageResource.CreateAsync(
    from: new PhoneNumber(_whatsappNumber),
    to: new PhoneNumber(toPhoneNumber),   // "whatsapp:+52..."
    body: body);
```

Texto plano, emojis + `\n`, IDs sueltos, **sin plantilla ni URL**.

---

## 3. Construcción de URLs adjuntas (análisis)

| Dónde | Código | Problema |
|---|---|---|
| Email reporte `SendEmailAppService.cs:271` | `$"https://luxurybuildingapp.com/publico/operation-report-client/{customerId}/..."` | Hardcodeada |
| Email adjunto `:275,424,544,686` | `$"https://luxurybuildingapp.com/api/files/download?filePath={encoded}"` | Reinventa `IFileReadPathService.GetSecureFileUrl` y hardcodea base |
| Push/In-App `TaskAppService.cs:728` | `Url = $"/tasks/message/{entity.Id}/{entity.WorkGroupId}"` | **Relativa** → OneSignal `url` no navega en móvil/web |
| Auth/Committee `UserCredentialsEmailDTO.cs:29` | `"https://luxurybuildingapp.com/auth/login"` | Absoluta hardcodeada |
| `CandidateNotificationCoordinatorService.cs:645` | `"https://luxurybuildingapp.com"` | Absoluta hardcodeada |
| `IBaseUrlService` | Solo `GetBaseUrlApi()` + `GetBaseUrlOneSignal()` | **Falta** `GetBaseUrlWeb()` / `GetBaseUrlPublic()` |

Conclusión: mezcla absoluta-hardcodeada vs relativa, duplicación de la lógica de
`filePath`, y ausencia de un resolvedor de base URL "pública/web".

---

## 4. Comparativo de estructuras

| Dimensión | Email (Razor) | Email (inline) | Push OneSignal | In-App | WhatsApp |
|---|---|---|---|---|---|
| Modelo tipado | ✅ ViewModel | ❌ StringBuilder | ❌ anónimo | ✅ DTO/entidad | ❌ string |
| Plantilla reutilizable | ✅ | ❌ | ❌ | n/a | ❌ |
| Marca/estilo central | ⚠️ por plantilla | ❌ hardcode | n/a | n/a | n/a |
| URL base centralizada | ❌ hardcode | ❌ hardcode | ⚠️ la da el caller | ⚠️ relativa/abs mix | n/a |
| Tipo de notificación | n/a | n/a | n/a | ❌ string libre | n/a |
| Orquestación única | ❌ por feature | ❌ por feature | ✅ parcial | ✅ parcial | ❌ por feature |
| Manejo dev/prod | ⚠️ hardcode roto | ⚠️ hardcode roto | ✅ (usa `IBaseUrlService` para API) | ⚠️ relativa | n/a |

---

## 5. Estándar propuesto

### 5.1 Orquestador único — `INotificationDispatcher`

Un solo servicio recibe un `NotificationRequest` y enruta a los canales habilitados.
Reemplaza el `NotificationOrchestratorService` parcial y los disparos sueltos de Email/WhatsApp.

```csharp
public interface INotificationDispatcher
{
    Task DispatchAsync(NotificationRequest request, CancellationToken ct = default);
}

public class NotificationDispatcher(
    INotificationUserAppService inApp,
    ISendSignalRService signalR,
    ISendOneSignalService pushMobile,
    ISendOneSignalWebService pushWeb,
    ISendEmailAppService email,
    ITwilioWhatsAppService whatsApp,
    INotificationUrlResolver urlResolver) : INotificationDispatcher
{
    public async Task DispatchAsync(NotificationRequest r, CancellationToken ct = default)
    {
        var absoluteRoute = r.ActionRoute is null ? null : urlResolver.ToAbsoluteWeb(r.ActionRoute);

        if (r.Channels.Contains(NotificationChannel.InApp))
        {
            await inApp.CreateNotificationAsync(new NotificationUserAddOrEditDTO
            {
                ApplicationUserId = r.ApplicationUserId,
                Title = r.Title,
                Message = r.Body,
                NotificationType = r.Category.ToString(),   // enum → string
                Url = r.ActionRoute                            // SIEMPRE relativa en BD
            });
            await signalR.SendDTOUserAsync(r.ApplicationUserId);
        }

        if (r.Channels.Contains(NotificationChannel.PushMobile))
            await pushMobile.SendPushToUserAsync(r.ApplicationUserId, r.Title, r.Body, absoluteRoute);

        if (r.Channels.Contains(NotificationChannel.PushWeb))
            await pushWeb.SendPushWebToUserAsync(r.ApplicationUserId, r.Title, r.Body, absoluteRoute);

        if (r.Channels.Contains(NotificationChannel.Email))
            await email.SendFromTemplateAsync(r.EmailTemplate!, r.EmailModel!, r.To, r.Subject);

        if (r.Channels.Contains(NotificationChannel.WhatsApp))
            await whatsApp.SendTemplateAsync(r.WhatsAppTemplate!, r.WhatsAppModel!);
    }
}
```

### 5.2 Modelo de mensaje único y tipado

```csharp
public record NotificationRequest(
    string ApplicationUserId,
    string Title,
    string Body,                         // texto plano / markdown
    NotificationCategory Category,       // ENUM centralizado
    NotificationChannel[] Channels,
    string? ActionRoute = null,         // SIEMPRE relativa: "/tasks/message/{id}"
    EmailTemplateRef? EmailTemplate = null,
    object? EmailModel = null,
    string? Subject = null,
    List<string>? To = null,            // solo email
    WhatsAppTemplateRef? WhatsAppTemplate = null,
    object? WhatsAppModel = null);
```

```csharp
// Catálogo único — elimina los literales dispersos
public enum NotificationCategory
{
    Info, Success, Warning, Urgente,
    NewTask, PagoRecibido, TicketLegal,
    Meeting, Recruitment, System
}
```

### 5.3 Resolución de URLs — un solo origen de verdad

Extender `IBaseUrlService` (`Shared/Services/IBaseUrlService.cs`):

```csharp
public interface IBaseUrlService
{
    string GetBaseUrlApi();        // ya existe
    string GetBaseUrlOneSignal();  // ya existe
    string GetBaseUrlWeb();        // NUEVO: https://luxurybuildingapp.com  (config)
    string GetBaseUrlPublic();     // NUEVO: igual que web pero sin /api
}
```

Helper central (`INotificationUrlResolver`):

```csharp
public class NotificationUrlResolver(IBaseUrlService baseUrl) : INotificationUrlResolver
{
    public string ToAbsoluteWeb(string relativeRoute)
        => $"{baseUrl.GetBaseUrlWeb().TrimEnd('/')}/{relativeRoute.TrimStart('/')}";

    // Adjunto de archivo: NUNCA reconstruir a mano, usar el servicio existente
    public string FileDownload(Guid customerId, string documentType, string fileName)
        => fileReadPathService.GetSecureFileUrl(...); // reutiliza IFileReadPathService
}
```

**Regla:** en mensajes solo existen rutas **relativas**. La absoluta se resuelve en el
dispatcher justo antes de enviar. Se prohíbe `https://luxurybuildingapp.com` hardcodeado
(en correos, adjuntos y push).

### 5.4 Email — una sola técnica (layout compartido) + adopción del Design System

- Todo correo usa **Razor `.cshtml`** vía `EmailTemplates` + `IRazorViewToStringRenderer`.
- **Eliminar** el patrón `StringBuilder` de `SendExecutivePendingReportAsync`.
- **Layout/estilo compartido** `_EmailLayout.cshtml` con marca y tokens definidos una vez.
- **Los cuerpos de correo DEBEN basarse en el Design System del cliente** (`client/angular/src/styles`),
  cumpliendo la regla **🔴 CRÍTICA de Tokens CSS (CONVENTIONS.md §6.1)**: ningún valor visual
  hardcodeado; se usa la misma fuente de verdad que el front (`_colors.scss`, `_typography.scss`,
  `_fonts.scss`, `_spacing.scss`, `_borders.scss`, `_shadows.scss`).
- **Hallazgo de desalineación actual:** el email usa `Arial` y `#0056b3` / `#1B365D`
  (`SendEmailAppService.cs:44-50`), que **no coinciden** con el DS vigente
  (fuente `Outfit`; primario ancla `#003152` = `primary-700`). Los correos se ven
  "fuera de marca" respecto a la app.

#### 5.4.1 Fuente de verdad de tokens para email

El `.cshtml` se renderiza en el backend y **no puede consumir `var(--ds-*)`** de forma
fiable (muchos clientes de correo no soportan CSS custom properties). Por eso se mantiene
un **espejo en C#** de los tokens del DS usados en email, con los mismos valores que
`client/angular/src/styles/core/*.scss`. Análogo a `design-tokens.d.ts` (espejo TS).

| Token DS (`_colors.scss` / `_typography.scss`) | Valor | Uso en email |
|---|---|---|
| `$primary-700` (ancla de marca) | `#003152` | Header, botones primarios |
| `$primary-600` | `#00568f` | Hover / link |
| `$primary-800` | `#00253d` | Texto sobre primario oscuro |
| `$primary-100` | `#ddeaf4` | Fondos suaves / footer |
| `$neutral-800` (`$color-text-primary`) | `#1a2634` | Texto cuerpo |
| `$neutral-600` (`$color-text-secondary`) | `#5a6878` | Texto secundario |
| `$neutral-50` (`$color-bg-page`) | `#f8f9fc` | Fondo de página |
| `$neutral-0` (`$color-bg-surface`) | `#ffffff` | Tarjeta |
| `$neutral-200` (`$color-border-default`) | `#e2e8f0` | Bordes |
| `$success-600` | `#1e9b6d` | Estado éxito |
| `$warning-500` | `#e8b233` | Estado advertencia |
| `$danger-600` | `#d34b4b` | Estado error |
| `$info-600` | `#3678c2` | Estado info |
| `$font-family-base` | `'Outfit', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` | Tipografía |
| `$font-size-base` / `sm` / `lg` / `2xl` | 16 / 14 / 18 / 24 px | Escala tipográfica |
| `$padding-card` | `1.5rem` (24px) | Padding de tarjeta |
| `$radius-md` (`--ds-radius-card`) | `8px` | Radio de tarjeta |
| `$radius-xs` (`--ds-radius-btn`) | `4px` | Radio de botón |
| `$shadow-2` (semántica navy) | `0 2px 8px rgba(27,54,93,0.08)` | Sombra de tarjeta |

> **Nota fuente:** `Outfit` es self-hosted en el cliente (`/assets/fonts/outfit-*.woff2`).
> En email no carga ese woff2 (unicode-range/cliente de correo), así que se declara la familia
> `Outfit` con **fallback web-safe**; si se quiere fidelidad total, hospedar Outfit en CDN y
> referenciarlo con `@import`/`@font-face` en el `<head>` del correo.

#### 5.4.2 Espejo de tokens en backend (`EmailDesignTokens`)

```csharp
// Espejo C# de client/angular/src/styles/core/_colors.scss + _typography.scss
// ÚNICA fuente de verdad para estilos de email. Si cambia el DS, se actualiza aquí.
public static class EmailDesignTokens
{
    // Color (ancla de marca = primary-700)
    public const string Primary      = "#003152";
    public const string PrimaryHover = "#00568f";
    public const string PrimarySoft  = "#ddeaf4";
    public const string TextPrimary  = "#1a2634";
    public const string TextSecondary= "#5a6878";
    public const string BgPage       = "#f8f9fc";
    public const string BgSurface    = "#ffffff";
    public const string Border       = "#e2e8f0";
    public const string Success      = "#1e9b6d";
    public const string Warning      = "#e8b233";
    public const string Danger       = "#d34b4b";
    public const string Info         = "#3678c2";

    // Tipografía (Outfit con fallback)
    public const string FontFamily = "'Outfit', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    public const int    FontSizeBase = 16;

    // Espaciado / forma (base 4px)
    public const int CardPadding = 24;     // $padding-card
    public const int RadiusCard  = 8;      // $radius-md
    public const int RadiusBtn   = 4;      // $radius-xs

    // Sombra (semántica navy)
    public const string ShadowCard = "0 2px 8px rgba(27,54,93,0.08)"; // $shadow-2
}
```

El `_EmailLayout.cshtml` lee `EmailDesignTokens` (no literales sueltos), cumpliendo §6.1.

### 5.5 Push — modelo tipado y DRY

Un único `OneSignalPayload` (record) y un único método de envío; `Mobile`/`Web` se
diferencian solo por `app_id`/`key` inyectados. Borra el duplicado
`SendOneSignalService` / `SendOneSignalWebService`.

`url` y `data.route` se setean con la **absoluta** resuelta por el dispatcher.

### 5.6 WhatsApp — plantillas tipadas

Mensajes desde plantillas tipadas (no concatenación con `\n`). Extensible a más módulos.

### 5.7 Gobernanza / catálogos

- `NotificationCategory` (enum), `NotificationChannel` (ya existe).
- Documentar en `conventions/backend/notification-standard.md` y
  reflejar en `CONVENTIONS.md` §5.2 / operations.
- `EmailTemplateValidator` ya valida constantes de `EmailTemplates` → aprovecharlo.

---

## 6. Ejemplos concretos — cómo quedarían los mensajes

### 6.1 Email — layout compartido + plantilla de ejemplo

`_EmailLayout.cshtml` (define marca una vez, leyendo **`EmailDesignTokens`**, espejo de `client/angular/src/styles/core/*`):

```html
@model dynamic
@{
    // Fuente de verdad = EmailDesignTokens (espejo de _colors.scss / _typography.scss)
    var primary   = EmailDesignTokens.Primary;       // #003152  (primary-700, ancla)
    var primaryLt = EmailDesignTokens.PrimarySoft;   // #ddeaf4  (primary-100)
    var text      = EmailDesignTokens.TextPrimary;   // #1a2634  (neutral-800)
    var textSec   = EmailDesignTokens.TextSecondary; // #5a6878  (neutral-600)
    var font      = EmailDesignTokens.FontFamily;    // 'Outfit', 'Segoe UI', ...
    var radiusBtn = EmailDesignTokens.RadiusBtn;     // 4px
    var radiusCard= EmailDesignTokens.RadiusCard;    // 8px
    var shadow    = EmailDesignTokens.ShadowCard;    // 0 2px 8px rgba(27,54,93,.08)
    var bgPage    = EmailDesignTokens.BgPage;        // #f8f9fc
}
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: @font; color: @text; margin:0; background:@bgPage; }
    .card { max-width:640px; margin:24px auto; background:#fff; border-radius:@radiusCard;
            overflow:hidden; box-shadow:@shadow; }
    .header { background:@primary; color:#fff; padding:20px 24px; }
    .header h1 { margin:0; font-size:18px; font-weight:700; }
    .body { padding:24px; font-size:14px; line-height:1.5; color:@text; }
    .btn { display:inline-block; background:@primary; color:#fff; padding:10px 18px;
           border-radius:@radiusBtn; text-decoration:none; font-weight:600; }
    .footer { padding:16px 24px; background:@primaryLt; font-size:12px; color:@textSec; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header"><h1>@ViewBag.BrandTitle</h1></div>
    <div class="body">@RenderBody()</div>
    <div class="footer">LuxuryApp · Este es un correo automático, no responda.</div>
  </div>
</body>
</html>
```

Plantilla de contenido `OperationReportEmail.cshtml` (hereda el layout):

```html
@model OperationReportViewModel
<h2>Reporte de operación</h2>
<p>Estimado administrador, adjuntamos el reporte semanal.</p>
<p><a class="btn" href="@Model.ReportUrl">Abrir reporte</a></p>
@if (!string.IsNullOrEmpty(Model.CustomerLogoUrl))
    { <img src="@Model.CustomerLogoUrl" alt="logo" height="40" /> }
```

ViewModel y envío bajo el estándar:

```csharp
var viewModel = new OperationReportViewModel
{
    ReportUrl = urlResolver.ToAbsoluteWeb(
        $"/publico/operation-report-client/{customerId}/{start:yyyy-MM-dd}/{end:yyyy-MM-dd}"),
    CustomerLogoUrl = fileReadPathService.GetSecureFileUrl(/* logo */) // NO hardcode
};

await dispatcher.DispatchAsync(new NotificationRequest(
    ApplicationUserId: adminId,
    Title: "Reporte de operación disponible",
    Body: "Se ha generado el reporte semanal.",
    Category: NotificationCategory.Info,
    Channels: new[] { NotificationChannel.Email, NotificationChannel.InApp },
    EmailTemplate: EmailTemplateRef.OperationReport,
    EmailModel: viewModel,
    Subject: $"{customer.NombreCorto} | Reporte de operación",
    To: destinatarios,
    ActionRoute: $"/publico/operation-report-client/{customerId}/{start:yyyy-MM-dd}/{end:yyyy-MM-dd}"));
```

**Resultado HTML del correo (lo que recibe el usuario):**

```html
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" />
<style>
  body { font-family: 'Outfit', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1a2634; margin:0; background:#f8f9fc; }
  .card { max-width:640px; margin:24px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(27,54,93,0.08); }
  .header { background:#003152; color:#fff; padding:20px 24px; }
  .header h1 { margin:0; font-size:18px; font-weight:700; }
  .body { padding:24px; font-size:14px; line-height:1.5; color:#1a2634; }
  .btn { display:inline-block; background:#003152; color:#fff; padding:10px 18px; border-radius:4px; text-decoration:none; font-weight:600; }
  .footer { padding:16px 24px; background:#ddeaf4; font-size:12px; color:#5a6878; }
</style></head>
<body>
  <div class="card">
    <div class="header"><h1>LuxuryApp</h1></div>
    <div class="body">
      <h2>Reporte de operación</h2>
      <p>Estimado administrador, adjuntamos el reporte semanal.</p>
      <p><a class="btn" href="https://luxurybuildingapp.com/publico/operation-report-client/3f1.../2026-08-10/2026-08-16">Abrir reporte</a></p>
      <img src="https://luxurybuildingapp.com/api/files/download?filePath=..." alt="logo" height="40" />
    </div>
    <div class="footer">LuxuryApp · Este es un correo automático, no responda.</div>
  </div>
</body>
</html>
```

### 6.2 Push OneSignal — payload tipado y resultado

`OneSignalPayload.cs` (único, usado por mobile y web):

```csharp
public record OneSignalPayload(
    string AppId,
    string TargetChannel,        // "push"
    string HeadingEn,
    string ContentEn,
    string Url,                  // ABSOLUTA (resuelta por dispatcher)
    string Route,                // relativa (para deep-link en app)
    string[] ExternalIds);
```

Resultado JSON que se envía a OneSignal (móvil, con URL ya absoluta):

```json
{
  "app_id": "1111-2222-...",
  "target_channel": "push",
  "headings": { "en": "Nuevo mensaje en tarea" },
  "contents": { "en": "Se ha agregado un comentario a tu tarea." },
  "url": "https://luxurybuildingapp.com/tasks/message/9c1a.../b27f...",
  "data": { "route": "/tasks/message/9c1a.../b27f..." },
  "include_aliases": { "external_id": ["3e1ff763-c104-42fe-bb03-1e4c24493f89"] }
}
```

> Hoy `url` llega como `/tasks/message/...` (relativa) → **no navega**. Con el estándar
> `url` es absoluta y `data.route` conserva la relativa para deep-linking interno.

### 6.3 In-App — `NotificationUser` poblado (BD)

Lo que se persiste (siempre **relativa** la `Url`):

```json
{
  "Id": "a17c...",
  "Title": "Nuevo mensaje en tarea",
  "Message": "Se ha agregado un comentario a tu tarea.",
  "NotificationType": "NewTask",
  "IsRead": false,
  "ApplicationUserId": "3e1ff763-...",
  "CreatedAt": "2026-08-12T16:27:07",
  "Url": "/tasks/message/9c1a.../b27f..."
}
```

El cliente resuelve la ruta relativa contra su propia base; el backend nunca guarda
URL absoluta hardcodeada.

### 6.4 WhatsApp — plantilla tipada

`WhatsAppTemplateRef` + modelo:

```csharp
public enum WhatsAppTemplateRef { TicketLegalNew, TicketLegalUpdate }

public record TicketLegalNewModel(string Title, string Folio, string Cliente, string Solicita, Guid TicketId);
```

Implementación en `ITwilioWhatsAppService`:

```csharp
public Task SendTemplateAsync(WhatsAppTemplateRef template, object model)
{
    var m = (TicketLegalNewModel)model;
    var body = $"📋 {m.Title}\nFolio: {m.Folio}\nCliente: {m.Cliente}\nSolicita: {m.Solicita}\nID: {m.TicketId}";
    return MessageResource.CreateAsync(
        from: new PhoneNumber(_whatsappNumber),
        to: new PhoneNumber($"whatsapp:{m.TicketId}"),  // destinatario real
        body: body);
}
```

**Mensaje recibido en WhatsApp:**

```
📋 Plaga en área común
Folio: TCK-00123
Cliente: Residencial Las Lomas
Solicita: María López
ID: 9c1a4f...
```

### 6.5 Flujo completo — un solo `DispatchAsync` desde un feature

Ejemplo: nuevo mensaje en una tarea (hoy repite el bloque `NotificationUserAddOrEditDTO`
~9 veces en `TaskAppService.cs`). Bajo el estándar:

```csharp
await dispatcher.DispatchAsync(new NotificationRequest(
    ApplicationUserId: responsableId,
    Title: "Nuevo mensaje en tarea",
    Body:  "Se ha agregado un comentario a tu tarea.",
    Category: NotificationCategory.NewTask,
    Channels: new[]
    {
        NotificationChannel.InApp,
        NotificationChannel.PushMobile,
        NotificationChannel.PushWeb,
        NotificationChannel.Email
    },
    ActionRoute: $"/tasks/message/{entity.Id}/{entity.WorkGroupId}",
    EmailTemplate: EmailTemplateRef.TaskNotification,
    EmailModel: new TaskNotificationViewModel(entity.Folio, entity.Title),
    Subject: $"Nuevo mensaje · {entity.Folio}",
    To: new List<string> { responsableEmail }));
```

Una sola llamada → 4 canales, URLs relativas en BD, absolutas al enviar, marca única.

### 6.6 Antes vs Después

| Aspecto | ANTES | DESPUÉS (estándar) |
|---|---|---|
| Email HTML | `StringBuilder` + `#0056b3`/`Arial` sueltos | Razor + `_EmailLayout` con tokens |
| URL email | `https://luxurybuildingapp.com/...` hardcode | `urlResolver.ToAbsoluteWeb(relativa)` |
| Adjunto | `$".../api/files/download?filePath=..."` a mano | `IFileReadPathService.GetSecureFileUrl` |
| Push url | relativa `/tasks/...` (no navega) | absoluta resuelta + `data.route` relativa |
| Tipo notif | string libre `"Personal"` | `NotificationCategory.NewTask` (enum) |
| Orquestación | In-App+Push solo; Email/WA sueltos | `INotificationDispatcher` único |
| OneSignal | 2 servicios casi iguales | 1 payload tipado + AppId/Key inyectados |
| WhatsApp | string concatenado | plantilla tipada |

---

## 7. Plan de migración propuesto (fases)

1. **Fase 1 — Cimientos (sin romper nada):**
   - Añadir `GetBaseUrlWeb()` / `GetBaseUrlPublic()` a `IBaseUrlService`.
   - Crear `NotificationCategory` (enum) y `INotificationUrlResolver`.
   - Crear `_EmailLayout.cshtml` compartido.
2. **Fase 2 — Dispatcher:**
   - Implementar `INotificationDispatcher` (envuelve servicios existentes).
   - Marcar `NotificationOrchestratorService` como deprecated (redirigir a dispatcher).
3. **Fase 3 — Migrar features:**
   - `TaskAppService` (9 llamadas) → una `DispatchAsync`.
   - `SendExecutivePendingReportAsync` → Razor + layout.
   - Push móvil/web → unificar en `OneSignalPayload`.
   - WhatsApp Legal → plantilla tipada.
4. **Fase 4 — Limpieza:**
   - Eliminar `SendOneSignalWebService` duplicado, `StringBuilder` de email, literales de URL.

---

## 8. Checklist de cumplimiento (auditoría)

- [ ] Toda URL en mensaje se guarda **relativa**; la absoluta se resuelve en el dispatcher.
- [ ] Cero `https://luxurybuildingapp.com` hardcodeado en backend de mensajería.
- [ ] Adjuntos vía `IFileReadPathService.GetSecureFileUrl` (no reconstrucción manual).
- [ ] `NotificationType` usa `NotificationCategory` (enum), no string libre.
- [ ] Email siempre Razor + `_EmailLayout`; sin `StringBuilder` ni colores hardcodeados.
- [ ] Push usa `OneSignalPayload` tipado; `url` absoluta, `data.route` relativa.
- [ ] Un solo `INotificationDispatcher` orquesta los canales necesarios.
- [ ] WhatsApp usa plantilla tipada, no concatenación.
- [ ] `EmailTemplateValidator` valida toda constante de `EmailTemplates`.

---

## 9. Referencias de código (evidencia)

- `api/LuxuryApp.Infrastructure.Data/Data/Entities/System/System-AuditLogs/NotificationUser.cs`
- `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/Infrastructure/SendEmail/Services/SendEmailAppService.cs` (`:42-122`, `:271`, `:419`, `:544`, `:686`)
- `api/LuxuryApp.Providers/Services/SendOneSignalService.cs` (`:38-50`)
- `api/LuxuryApp.Providers/Services/SendOneSignalWebService.cs` (`:45-57`)
- `api/LuxuryApp.Providers/Services/TwilioWhatsAppService.cs` (`:27-57`)
- `api/LuxuryApp.Shared/Services/IBaseUrlService.cs` (`:7-13`, `:31-55`)
- `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/SystemTenant/Notification/Services/NotificationOrchestratorService.cs` (`:40-54`)
- `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/SendEmailGlobal/EmailTemplates.cs`
- `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/Tasks/Services/TaskAppService.cs` (URLs relativas `:728` etc.)
- `api/LuxuryApp.Shared/DTOs/NotificationUserAddOrEditDTO.cs` (`:18` `NotificationType` string)

### 9.1 Design System del cliente (fuente de verdad para estilos de email)

- `client/angular/src/styles/core/_colors.scss` — paleta primaria (ancla `#003152` = `primary-700`), semánticos success/warning/danger/info, neutros.
- `client/angular/src/styles/core/_fonts.scss` — fuente `Outfit` (variable, self-hosted).
- `client/angular/src/styles/core/_typography.scss` — `$font-family-base`, escala 16px/modular 1.25, pesos.
- `client/angular/src/styles/core/_spacing.scss` — escala base 4px (`$padding-card: 1.5rem`).
- `client/angular/src/styles/core/_borders.scss` — radios (`$radius-md` 8px tarjeta, `$radius-xs` 4px botón).
- `client/angular/src/styles/core/_shadows.scss` — `$shadow-2` (navy `rgba(27,54,93,.08)`).
- `client/angular/src/styles/design-tokens.d.ts` — espejo TS de tokens (análogo al `EmailDesignTokens` propuesto).
- `CONVENTIONS.md` §6.1 — 🔴 REGLA CRÍTICA Tokens CSS Obligatorios (NUNCA hardcoding; tokens en `client/angular/src/styles/core/*`).

---

## 10. Artefactos implementados (cimiento del estándar)

Para empezar a materializar el estándar sin romper lo existente, se crearon los
siguientes artefactos. **No cambian la lógica de envío**, solo la fuente de estilos
de los cuerpos de correo.

### 10.1 `EmailDesignTokens.cs` (espejo C# del DS)

- Ruta: `api/LuxuryApp.Shared/Design/EmailDesignTokens.cs`
- Namespace: `LuxuryApp.Shared.Design`
- Clase `static` con `const` que duplican los valores de
  `client/angular/src/styles/core/*` (colores primarios semánticos, `Outfit`,
  radios 4/8px, sombra navy). `LogoRelativePath` es **relativa** (se resuelve en el layout).
- Es la única fuente de verdad para estilos de email; cumple CONVENTIONS §6.1
  (🔴 Tokens CSS — NUNCA hardcoding).

### 10.2 `_EmailLayout.cshtml` y `_EmailLayoutTable.cshtml` (DS-driven)

- Rutas: `api/LuxuryApp.Api/Infrastructure/Email/Templates/Shared/_EmailLayout.cshtml`
  y `.../_EmailLayoutTable.cshtml` (variante 900px).
- Antes (hardcodeado, fuera de marca):

  | Elemento | Antes | Después (DS) |
  |---|---|---|
  | Header / botón | `#0A2342` | `#003152` (`primary-700`) |
  | Borde superior | `#C9A84C` (oro) | `#003152` (primario) |
  | Texto cuerpo | `#333333` | `#1a2634` (`neutral-800`) |
  | Texto footer | `#888888` | `#5a6878` (`neutral-600`) |
  | Fondo página | `#f8f9fa` | `#f8f9fc` (`neutral-50`) |
  | Fuente | `Helvetica, Arial` | `'Outfit', 'Segoe UI', ...` |
  | Logo | `https://luxurybuildingapp.com/api/files/download?...` (hardcode) | resuelto con `IBaseUrlService.GetBaseUrlApi()` + `HttpUtility.UrlEncode(LogoRelativePath)` |

- El layout ahora usa `@inject IBaseUrlService` y `@using LuxuryApp.Shared.Design`
  para pintar todos los valores desde `EmailDesignTokens` (no literales sueltos).
- Las plantillas existentes ya referencian estos layouts (`Layout = "/Infrastructure/Email/Templates/Shared/_EmailLayoutTable.cshtml"`),
  por lo que **todos los correos pasan a renderizar con la marca DS automáticamente**,
  sin tocar cada plantilla.
- El logo acepta override por plantilla vía `ViewData["LogoUrl"]`; si no se provee,
  se resuelve contra la base URL configurada (dev/prod correcto).

### 10.3 Estado / validación

- `dotnet build LuxuryApp.Shared` → **0 errores**.
- `.cshtml` se renderiza en runtime (no se compila en build); se validó la coherencia
  con el renderer `RazorViewToStringRenderer` (usa `serviceProvider` de la app, por lo
  que `@inject IBaseUrlService` resuelve).
- Pendiente (no bloqueante): las tablas *internas* de algunas plantillas aún usan
  `border: 1px solid #ddd` inline; migrarlo a tokens es parte de la Fase 3.

### 10.4 Fase 1 — COMPLETADA (2026-08-12)

| Artefacto | Ruta | Estado |
|---|---|---|
| `EmailDesignTokens.cs` | `api/LuxuryApp.Shared/Design/EmailDesignTokens.cs` | ✅ (§10.1) |
| `_EmailLayout.cshtml` / `_EmailLayoutTable.cshtml` | `api/LuxuryApp.Api/Infrastructure/Email/Templates/Shared/` | ✅ (§10.2) |
| `GetBaseUrlWeb()` / `GetBaseUrlPublic()` | `api/LuxuryApp.Shared/Services/IBaseUrlService.cs` | ✅ |
| `NotificationCategory` (enum) | `api/LuxuryApp.Shared/Enums/NotificationCategory.cs` | ✅ |
| `INotificationUrlResolver` + `NotificationUrlResolver` | `api/LuxuryApp.Shared/Services/INotificationUrlResolver.cs` | ✅ |
| Registro DI | `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Infrastructure.cs:87` | ✅ |

**Decisiones de implementación (difieren del borrador de §5.2 / §5.3):**

- `GetBaseUrlWeb()` lee **`LuxuryApp:PathFront`**, clave que ya existía en ambos entornos
  (dev `http://localhost:4200`, prod `https://luxurybuildingapp.com`). No se introdujo clave
  nueva de configuración. `GetBaseUrlPublic()` = web + `/publico`.
- El literal del dominio queda en **un solo lugar**: `BaseUrlService.FallbackProductionUrl`,
  usado únicamente si falta configuración. Antes estaba suelto en `GetBaseUrlApi()`.
- `NotificationCategory` conserva los nombres de los literales ya persistidos en BD
  (`Personal`, `Urgente`, `PanicAlert`, `PagoRecibido`, `NewTask`, `General`) para que la
  migración string → enum sea un mapeo por nombre; `Info` es la excepción (el literal en BD
  es `"Información"`, con acento). Todos llevan `[Display(Name)]` en español.
- `INotificationUrlResolver` **no** expone `FileDownload(...)` como proponía §5.3:
  `FileReadPathService.GetSecureFileUrl` es privado y ya existe un método público por tipo de
  documento. La regla queda: rutas → `INotificationUrlResolver`; archivos → `IFileReadPathService`.
- `ToAbsoluteWeb` / `ToAbsolutePublic` son **idempotentes** (si reciben una URL ya absoluta la
  devuelven intacta), para permitir migrar los llamadores de forma gradual en Fase 3.

**Validación:** `dotnet build LuxuryApp.Shared` y `dotnet build LuxuryApp.Api` → 0 errores.

### 10.5 Fase 2 — COMPLETADA (2026-08-12)

| Artefacto | Ruta | Estado |
|---|---|---|
| `INotificationDispatcher` | `.../SystemTenant/Notification/Interfaces/INotificationDispatcher.cs` | ✅ |
| `NotificationDispatcher` | `.../SystemTenant/Notification/Services/NotificationDispatcher.cs` | ✅ |
| `NotificationRequestDTO` | `api/LuxuryApp.Shared/DTOs/NotificationRequestDTO.cs` | ✅ |
| `NotificationChannel` + `InApp`/`PushWeb` | `api/LuxuryApp.Shared/Enums/NotificationChannel.cs` | ✅ |
| `[Obsolete]` en el orquestador viejo | `.../Notification/{Interfaces,Services}/*OrchestratorService.cs` | ✅ |
| Tests | `api/LuxuryApp.Tests/Application/Modules/System/Notifications/NotificationDispatcherTests.cs` | ✅ 7/7 |

**Decisiones de implementación (difieren del borrador de §5.1):**

- El modelo se llama `NotificationRequestDTO` (sufijo `DTO`, convención del repo), no `NotificationRequest`.
- **Email:** `ISendEmailAppService` no tiene `SendFromTemplateAsync` — no existe tal método. El
  dispatcher usa la vía real ya disponible: `IRazorViewToStringRenderer.RenderViewToStringAsync`
  (con una constante de `EmailTemplates`) + `ISendEmailService.OnSendEmailAsync(SendEmailDTO)`.
- **WhatsApp:** fuera de alcance. `ITwilioWhatsAppService` sólo tiene
  `SendMessageTicketLegalAsync` / `SendMessageUpdateTicketLegalAsync`; no hay `SendTemplateAsync`.
  Pedir el canal lanza `NotSupportedException` en vez de ignorarlo en silencio.
- **`NotificationChannel`:** se reutilizó el enum existente agregando miembros al final
  (`InApp = 3`, `PushWeb = 4`) y fijando explícitamente 0–2. Se persiste en
  `NotificationLog.Channel`, por lo que renumerar o renombrar habría roto datos existentes.
  `Push` = móvil (nombre conservado por compatibilidad).
- **Errores:** el dispatcher no traga excepciones (se propagan igual que en el orquestador viejo);
  un push no entregado se registra como `LogWarning` con el motivo devuelto por OneSignal.

### 10.6 Fase 3 — COMPLETADA (2026-08-12)

Todos los consumidores de `INotificationOrchestratorService` migrados y **cero hardcodes de
dominio en código vivo**. Detalle por archivo en la auditoría §G.

**Decisiones de implementación:**

- **`TaskAppService`:** las 11 construcciones de `NotificationUserAddOrEditDTO` colapsan en un
  helper privado `NotifyTaskAsync(userId, title, message, taskId, workGroupId)`; la ruta vive en
  un único `TaskRoute()`. Canales: in-app + push móvil + push web (lo que hacía el orquestador viejo).
- **Reporte ejecutivo:** el HTML pasó a `ExecutivePendingReportEmail.cshtml` (layout `_EmailLayoutTable`).
  El cálculo de semáforo y días abiertos se hace en C# (`BuildPendingRow`) para que la vista no
  tenga lógica. Se agregaron `WarningSoft` (`warning-100`) y `DangerSoft` (`danger-100`) a
  `EmailDesignTokens` para las filas de atraso — antes eran `#fff9e6` / `#ffe6e6` inventados.
- **`HrNotificationOrchestrator`:** NO se migró al dispatcher. Hoy no persiste in-app y su correo
  usa `HrGenericNotificationDTO` con su propio servicio; cambiarlo alteraría el comportamiento.
  Se corrigió sólo el defecto real: resolver la URL absoluta antes de push y correo.
- **`FundingNotificationOrchestrator`:** migrado con canales `InApp + PushWeb` — nunca envió push
  móvil y se respetó ese alcance.
- **`RecurringTaskGeneratorService`:** el encolado Hangfire usa `Enqueue<INotificationDispatcher>`.
  Ojo: los árboles de expresión **no admiten collection expressions**, ahí va `new[] { ... }`.
- **Nombres en plantillas Razor:** una variable de bucle no puede llamarse `section` — `@section`
  es una directiva reservada y el compilador Razor falla con `RZ1011`/`RZ2005`.

### 10.7 Pendientes (Fase 4 — limpieza)

- Eliminar código muerto: `NotificationOrchestratorService` (sin consumidores),
  `FundingPushService` / `FundingRealTimeService` (sin uso tras migrar su orquestador),
  `HrNotificationCoordinatorHelper` (ya `[Obsolete]`, sin llamadores).
- Unificar `OneSignalPayload` (móvil/web) en un único servicio tipado.
- WhatsApp tipado + soporte del canal en el dispatcher.
