# Sistema Centralizado de Plantillas de Correo

Este documento explica cómo funciona el nuevo sistema para generar y enviar correos electrónicos con un diseño estandarizado en la aplicación.

## 1. Resumen

El sistema utiliza plantillas de Razor (`.cshtml`) para definir el contenido de los correos, permitiendo un diseño consistente y una fácil gestión del HTML.

La lógica se compone de tres partes principales:

1.  **Servicio de Renderizado (`IRazorViewToStringRenderer`):** Un servicio que convierte las plantillas Razor en strings de HTML.
2.  **Plantillas Razor (`.cshtml`):** Archivos que contienen el HTML del correo, con una plantilla maestra y vistas específicas.
3.  **Modelos de Vista (ViewModels):** Clases que transportan los datos desde el código de la aplicación a las plantillas.

## 2. Estructura de Archivos

- **Servicio de Renderizado:**
  - `LuxuryApp.Common/Services/IRazorViewToStringRenderer.cs` (Interfaz)
  - `LuxuryApp.Common/Services/RazorViewToStringRenderer.cs` (Implementación)

- **Plantillas de Correo:**
  - Se encuentran en: `LuxuryApp.Api/Infrastructure/Email/Templates/`
  - **Plantilla Maestra:** `Shared/_EmailLayout.cshtml`. Define la cabecera, pie de página y estilos CSS comunes.
  - **Plantilla Maestra para Tablas:** `Shared/_EmailLayoutTable.cshtml`. Similar a `_EmailLayout.cshtml` pero con un padding reducido en el cuerpo para acomodar tablas anchas. Usar esta plantilla para correos cuyo contenido principal sea una tabla.
  - **Vistas Específicas:** Se organizan en subcarpetas por funcionalidad (ej. `Authentication/`).

- **Modelos de Vista:**
  - Se definen dentro del módulo de la aplicación correspondiente. Ejemplo: `LuxuryApp.Application/Features/Authentication/ViewModels/`

## 3. Cómo Crear un Nuevo Correo

Sigue estos pasos para añadir un nuevo tipo de correo electrónico:

### Paso 1: Crear el Modelo de la Vista (ViewModel)

Crea una clase con las propiedades que necesitas mostrar en el correo. Ubícala en la carpeta `ViewModels` del feature correspondiente.

**Ejemplo:** `NewFeatureEmailViewModel.cs`
```csharp
public class NewFeatureEmailViewModel
{
    public string UserName { get; set; }
    public string Details { get; set; }
    public string ButtonText { get; set; }
    public string ButtonLink { get; set; }
}
```

### Paso 2: Crear la Plantilla Razor

1.  Crea una nueva subcarpeta para tu feature dentro de `LuxuryApp.Api/Infrastructure/Email/Templates/` si aún no existe (ej. `NewFeature/`).
2.  Dentro, crea un nuevo archivo `.cshtml` (ej. `Notification.cshtml`).
3.  Define el modelo y la plantilla maestra al inicio del archivo, y luego escribe el contenido del correo.

**Ejemplo:** `Notification.cshtml`
```csharp
@model LuxuryApp.Application.Features.NewFeature.ViewModels.NewFeatureEmailViewModel

@{ 
    Layout = "/Infrastructure/Email/Templates/Shared/_EmailLayout.cshtml";
    ViewData["Title"] = "Notificación Importante";
}

<p>Hola @Model.UserName,</p>
<p>@Model.Details</p>


<!-- Botón a prueba de Outlook -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
    <tr>
        <td align="center" bgcolor="#D4AF37" style="border-radius: 5px;">
            <a href="@Model.ButtonLink" target="_blank" style="font-size: 16px; font-family: 'Helvetica', 'Arial', sans-serif; color: #0A2342; text-decoration: none; display: inline-block; padding: 12px 25px; border-radius: 5px; font-weight: bold;">
                @Model.ButtonText
            </a>
        </td>
    </tr>
</table>
```

### Paso 3: Inyectar y Usar el Servicio de Renderizado

En el servicio de aplicación donde necesites enviar el correo:

1.  Inyecta `IRazorViewToStringRenderer` en el constructor.
2.  Crea una instancia de tu ViewModel con los datos necesarios.
3.  Llama a `RenderViewToStringAsync` con la ruta de la plantilla y el modelo.
4.  Envía el correo usando el HTML generado.

**Ejemplo:**
```csharp
// ... en tu servicio de aplicación ...

public async Task SendNewFeatureEmailAsync(string userName, string userEmail)
{
    var viewModel = new NewFeatureEmailViewModel
    {
        UserName = userName,
        Details = "Esta es una notificación de la nueva funcionalidad.",
        ButtonText = "Ver Detalles",
        ButtonLink = "https://..."
    };

    var emailBody = await _razorRenderer.RenderViewToStringAsync(
        "/Infrastructure/Email/Templates/NewFeature/Notification.cshtml", 
        viewModel
    );

    // ... enviar correo ...
}
```

## 4. Compatibilidad con Outlook

Es muy importante tener en cuenta que el cliente de correo de **Outlook en Windows utiliza el motor de renderizado de Microsoft Word**, no un motor de navegador web. Esto impone severas limitaciones en el soporte de CSS.

Para asegurar que los correos se vean bien en todos los clientes, esta implementación sigue las siguientes reglas:

1.  **Maquetación Basada en Tablas:** Toda la estructura del correo (`_EmailLayout.cshtml`) está construida con tablas (`<table>`) en lugar de `<div>`s. Esta es la única forma de garantizar un diseño consistente.
2.  **Estilos en Línea:** Todos los estilos CSS se aplican directamente en los atributos `style="..."` de cada elemento. La plantilla maestra no usa una etiqueta `<style>`.
3.  **Botones a Prueba de Balas:** Los botones se construyen con una tabla de una sola celda con un color de fondo (`bgcolor`), como se muestra en el ejemplo anterior. Esto asegura que se vean como un botón y no como un simple enlace en Outlook.

## 5. Estado Actual de la Refactorización de Servicios de Correo

La refactorización de los servicios de correo para centralizar sus plantillas ha sido completada. El progreso es el siguiente:

-   **Consistencia en el Estilo de Tablas:** Se han revisado y actualizado las plantillas de correo que contienen tablas para asegurar una consistencia en el estilo. Específicamente, se han añadido estilos de fuente explícitos (`font-family: 'Helvetica', 'Arial', sans-serif; font-size: 14px; color: #333;`) a los elementos `<th>` y `<td>` en las siguientes plantillas:
    -   `Email/ReportPendingTicketGroupEmail.cshtml`
    -   `ScheduledTasks/ContractsPoliciesExpirationEmail.cshtml`
    -   `ScheduledTasks/LegalReportEmail.cshtml`
    -   `ScheduledTasks/LegalTicketReportToCustomerEmail.cshtml`
    -   `ScheduledTasks/TaskNotificationEmail.cshtml`
    -   `ScheduledTasks/VacanciesReportEmail.cshtml`
    -   `Tickets/WeeklyWorkPlanEmail.cshtml`
    -   `ScheduledTasks/WeeklyWorkPlanEmail.cshtml`
    Esto garantiza una visualización uniforme y robusta de las tablas en diferentes clientes de correo, incluyendo Outlook.

-   **Servicio `MeetingAppService.cs`:**
    -   Todos los métodos de envío de correo (`OnSendEmailResponsible`, `EnviarEmailPendientesResponsable`, `SendEmailAllPendingMeeting`, `SendMeetingAsync`, `EstadosFinancierosCondominosAsync`, `PresentacionFinalComiteAsync`) han sido refactorizados y verificados. Ahora utilizan ViewModels y plantillas Razor (`.cshtml`) dedicadas.

-   **Servicio `EmailMessageAppService.cs`:**
    -   Los métodos `SendReportPendingTicketGroupAsync` y `SendEmailMesageRequestAsync` han sido refactorizados y verificados. Ahora utilizan ViewModels y plantillas Razor (`.cshtml`) dedicadas.

-   **Servicio `FinancialReportAppService.cs`:**
    -   El método `SendAsync` ha sido refactorizado y verificado. Ahora utiliza ViewModels y plantillas Razor (`.cshtml`) dedicadas.

-   **Servicio `ScheduledTaskService.cs`:**
    -   Todos los métodos de envío de correo (`SendPendingTicketGroupReportAsync`, `SendVacanciesReportAsync`, `SendTestEmailAsync`, `SendRecruitmentReportAsync`, `SendContractsAndPoliciesExpirationNotificationsAsync`, `SendLegalReportAsync`, `SendLegalTicketReportToCustomerAsync`) han sido refactorizados y verificados. Ahora utilizan ViewModels y plantillas Razor (`.cshtml`) dedicadas.

-   **Servicio `RecruitmentRequestService.cs`:**
    -   Todos los métodos de envío de correo (`OnSendEmailAltaSistems`, `SolicitudVacanteAsync`, `SolicitudModificacionSalarioAsync`, `SolicitudBajaAsync`, `SolicitudAltaAsync`) han sido refactorizados y verificados. Ahora utilizan ViewModels y plantillas Razor (`.cshtml`) dedicadas.

-   **Servicio `TaskWorkPlanAppService.cs`:**
    -   El método `SendWeeklyWorkPlan` ha sido refactorizado y verificado. Ahora utiliza ViewModels y plantillas Razor (`.cshtml`) dedicadas.

-   **Funcionalidad de Envío de Credenciales para Comité de Vigilancia:**
    -   Se ha implementado una nueva funcionalidad para el módulo de Comité de Vigilancia que permite enviar credenciales a sus miembros. Esto incluye:
        -   Un nuevo endpoint en `ComiteVigilanciaController.cs` (`POST api/ComiteVigilancia/{id}/send-credentials`).
        -   Un nuevo método `SendCredentialsAsync` en `IComiteVigilanciaAppService.cs` y su implementación en `ComiteVigilanciaAppService.cs`.
        -   Lógica para generar nombres de usuario y contraseñas, y para crear o actualizar usuarios existentes.
        -   Un nuevo ViewModel (`WelcomeEmailViewModel.cs`) y una plantilla de correo (`ComiteVigilancia/WelcomeEmail.cshtml`) para dar la bienvenida a los usuarios con sus nuevas credenciales y listar las funcionalidades accesibles.
        -   Integración con el servicio de envío de correos (`ISendEmailService`) para el envío de estas notificaciones.

Todos estos métodos ahora utilizan ViewModels y plantillas Razor (`.cshtml`) dedicadas para la generación de sus cuerpos de correo electrónico, siguiendo el nuevo sistema centralizado.

**Nota:** Se han resuelto todos los errores de compilación en la solución principal y en el proyecto de pruebas. El proyecto compila correctamente.
