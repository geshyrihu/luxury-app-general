# Estándar de Diseño de Plantillas de Correo (Luxury Design System)

Este documento define las reglas de marca, patrones técnicos y el inventario de todas las plantillas de correo (`.cshtml`) utilizadas en LuxuryApp. El objetivo es garantizar una identidad de lujo unificada y una compatibilidad total (responsive y cross-browser) en todos los clientes de correo (Outlook, Gmail, Apple Mail, móviles).

## 1. Identidad Visual (Luxury Design System)

Para reflejar la marca de lujo, se prohíbe el uso de colores genéricos (ej. rojo puro, grises básicos). Todo debe guiarse por la siguiente paleta:

- **Azul Corporativo (Navy):** `#0A2342` (Usado en cabeceras, fondos de íconos o títulos principales).
- **Acento Dorado (Gold):** `#C9A84C` (Usado para bordes, llamadas a la acción, separadores).
- **Fondo General:** `#F8F9FA` (Gris súper claro, elegante y limpio).
- **Texto Principal:** `#333333` (No usar negro puro `#000000` para reducir el cansancio visual).

## 2. Reglas Técnicas de Maquetación (Email Responsivo)

Maquetar correos no es lo mismo que maquetar páginas web modernas. Para garantizar que los correos no se rompan en clientes legacy como Microsoft Outlook (Windows), se deben acatar las siguientes reglas:

1. **Estructura en Tablas (Table Layouts):** Prohibido usar `div` con `flexbox` o `grid` para alinear contenido estructural. Se deben usar tablas anidadas (`<table role="presentation">`).
2. **Estilos en Línea (Inline CSS):** Todo el CSS crítico debe ir directamente en el atributo `style="..."` de cada etiqueta HTML.
3. **Condicionales MSO (Microsoft Office):** Para que las tablas respeten los márgenes en Outlook de escritorio, se debe seguir la convención usando comentarios fantasma `<!--[if mso]>`.
4. **Ancho Máximo:** Los correos deben tener un `max-width: 600px` (hasta 900px para reportes). Para móviles, las tablas deben colapsar usando `width="100%"`.
5. **Botones Seguros:** Evitar bordes redondeados complejos. Si hay llamadas a la acción, los botones deben ser celdas de tabla `<td>` con un enlace `<a>` relleno en bloque.

---

## 3. Inventario Completo de Plantillas a Estandarizar

A continuación se listan las 39 plantillas que conforman el sistema completo de notificaciones de LuxuryApp.

### 🏢 Plantillas Maestras (Layout Base)
1. `api\LuxuryApp.Api\Infrastructure\Email\Templates\Shared\_EmailLayoutTable.cshtml`
2. `api\LuxuryApp.Api\Infrastructure\Email\Templates\Shared\_EmailLayout.cshtml`

### 🗂️ Módulo: Tenant (SendEmailGlobal)
3. `Features\Accounting\SendEmail\Templates\CollectionReminderEmail.cshtml`
4. `Features\AppImplementationTracking\SendEmail\Templates\MissingEmployeeDataEmail.cshtml`
5. `Features\Committee\SendEmail\Templates\CommitteeWelcomeEmail.cshtml`
6. `Features\CommitteeMeeting\SendEmail\Templates\MeetingPendingItemsEmail.cshtml`
7. `Features\Financial\SendEmail\Templates\FinancialReportEmail.cshtml`
8. `Features\Recruitment\SendEmail\Templates\RecruitmentAltaSistemasEmail.cshtml`
9. `Features\Recruitment\SendEmail\Templates\RecruitmentModificacionSalarioEmail.cshtml`
10. `Features\Recruitment\SendEmail\Templates\RecruitmentSolicitudAltaEmail.cshtml`
11. `Features\Recruitment\SendEmail\Templates\RecruitmentSolicitudBajaEmail.cshtml`
12. `Features\Recruitment\SendEmail\Templates\RecruitmentSolicitudVacanteEmail.cshtml`
13. `Features\RecursosHumanos\SendEmail\Templates\HrGenericEmail.cshtml`
14. `Features\RecursosHumanos\SendEmail\Templates\VacationExpiringReminder.cshtml`
15. `Features\Tasks\SendEmail\Templates\TaskWorkPlanEmail.cshtml`

### 🔑 Módulo: System Access
16. `System\Access\AccountRecovery\SendEmailGlobal\SendEmail\Templates\AccountNewPasswordEmail.cshtml`
17. `System\Access\AccountRecovery\SendEmailGlobal\SendEmail\Templates\AccountNewUserCredentialsEmail.cshtml`
18. `System\Access\AccountRecovery\SendEmailGlobal\SendEmail\Templates\AccountPasswordRecoveryEmail.cshtml`

### 🛠️ Módulo: Api Core (Infrastructure)
19. `Authentication\NewPassword.cshtml`
20. `Authentication\NewUser.cshtml`
21. `Authentication\PasswordRecovery.cshtml`
22. `ComiteVigilancia\WelcomeEmail.cshtml`
23. `CommitteeMeeting\CommitteePresentationEmail.cshtml`
24. `CommitteeMeeting\FinancialStatementsEmail.cshtml`
25. `CommitteeMeeting\MeetingMinutesEmail.cshtml`
26. `CommitteeMeeting\PendingItemsEmail.cshtml`
27. `Email\GenericTestEmail.cshtml`
28. `Email\OperationReportEmail.cshtml`
29. `Email\ReportPendingTicketGroupEmail.cshtml`
30. `Email\TestMailEmail.cshtml`
31. `Email\TicketMessageEmail.cshtml`
32. `RecursosHumanos\GenericEmail.cshtml`
33. `ScheduledTasks\ContractsPoliciesExpirationEmail.cshtml`
34. `ScheduledTasks\LegalReportEmail.cshtml`
35. `ScheduledTasks\LegalTicketReportToCustomerEmail.cshtml`
36. `ScheduledTasks\RecruitmentTestEmail.cshtml`
37. `ScheduledTasks\TaskNotificationEmail.cshtml`
38. `ScheduledTasks\VacanciesReportEmail.cshtml`
39. `ScheduledTasks\WeeklyWorkPlanEmail.cshtml`
40. `Tickets\WeeklyWorkPlanEmail.cshtml`
