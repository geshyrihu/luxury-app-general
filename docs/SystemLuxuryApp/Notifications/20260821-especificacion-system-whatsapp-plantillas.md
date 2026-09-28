# Especificación de plantillas WhatsApp — Alertas de Tareas Recurrentes (T-16 / F8)

**Para:** quien gestione la consola de Twilio (Content Template Builder) y someta las plantillas
a aprobación de WhatsApp Business.
**No es un ticket de código.** T-16 queda pausado hasta que estas 6 plantillas estén aprobadas
con su Content SID; en cuanto lo estén, se retoma con un ticket normal de esta orquestación
(habilitar el canal en `NotificationDispatcher`, mapear cada `TaskAlertType` a su Content SID,
webhook de confirmación de entrega).

## Por qué hacen falta plantillas nuevas

El proveedor de WhatsApp (`IWhatsAppService`, sobre Twilio) ya está operativo, pero sus 4
plantillas aprobadas (`SendMessageTicketLegal`, `SendMessageSolicitudRecibida`,
`SendMessageSolicitudTerminada`, `SendMessageAlertaTareaUrgente`) son específicas del módulo
Legal — ninguna sirve para los 6 tipos de alerta de este módulo (`TaskAlertType`:
`AvisoPrevio`, `Recordatorio`, `Vencida`, `Escalacion`, `Incumplimiento`, `Arrastre`).

**Categoría e idioma:** igual que las 4 existentes — `Utility`, español (México). Son mensajes
transaccionales ligados a una tarea concreta del destinatario, no promocionales — deben calificar
sin problema para `Utility`.

**Enlace de acción:** cada plantilla debe llevar un botón de tipo *Call-to-Action → URL dinámica*
apuntando a la tarea (`/tasks/message/{id}/{workGroupId}`, la ruta real de detalle de tarea —
**no** la ruta del módulo Legal, que es el error que B8 del plan pide evitar explícitamente).

**Contenido y variables** — tomados literalmente de los mensajes que el motor ya envía por los
otros canales (in-app/push/email), para que WhatsApp diga lo mismo que ya ven por las otras vías
(`TaskAlertEngineService.cs` para los primeros 3, `TaskEscalationService.cs` para los últimos 3):

---

### 1. Aviso previo (`AvisoPrevio`)

> Aviso previo: la tarea recurrente "{{1}}" vence en {{2}} día(s), el {{3}}.

- `{{1}}` — título de la tarea
- `{{2}}` — días restantes hasta la fecha límite
- `{{3}}` — fecha límite (dd/mm/aaaa)
- Botón: "Ver tarea" → URL de la tarea

### 2. Recordatorio (`Recordatorio`)

> Recordatorio: la tarea recurrente "{{1}}" sigue pendiente. Fecha límite: {{2}}.

- `{{1}}` — título de la tarea
- `{{2}}` — fecha límite (dd/mm/aaaa)
- Botón: "Ver tarea" → URL de la tarea

### 3. Vencida (`Vencida`)

> La tarea recurrente "{{1}}" venció el {{2}}. Complétala lo antes posible.

- `{{1}}` — título de la tarea
- `{{2}}` — fecha en que venció (dd/mm/aaaa)
- Botón: "Ver tarea" → URL de la tarea

### 4. Escalación — día 3 (`Escalacion`)

> La tarea recurrente "{{1}}" lleva 3 días vencida. Fecha límite: {{2}}. Se escaló a tu respaldo
> y a Supervisión Operativa.

- `{{1}}` — título de la tarea
- `{{2}}` — fecha límite (dd/mm/aaaa)
- Botón: "Ver tarea" → URL de la tarea
- Destinatarios: usuario de respaldo de la plantilla + rol Supervisión Operativa

### 5. Incumplimiento formal — día 5 (`Incumplimiento`)

> La tarea recurrente "{{1}}" cumplió 5 días vencida y fue marcada como incumplimiento formal.

- `{{1}}` — título de la tarea
- Botón: "Ver tarea" → URL de la tarea
- Destinatarios: Dirección, SuperUsuario, Supervisión Operativa

### 6. Arrastre semanal (`Arrastre`)

> La tarea recurrente "{{1}}" sigue en arrastre. Fecha límite original: {{2}}.

- `{{1}}` — título de la tarea
- `{{2}}` — fecha límite original (dd/mm/aaaa)
- Botón: "Ver tarea" → URL de la tarea
- Se reenvía como máximo una vez cada 7 días mientras la tarea siga en incumplimiento y abierta
  (ya implementado así en `TaskEscalationService.cs:106-121`, sin cambios pendientes ahí).

---

## Qué hacer con esto

1. Dar de alta las 6 plantillas en el Content Template Builder de Twilio, categoría `Utility`,
   idioma `es_MX`, con el botón de URL dinámica descrito.
2. Someterlas a aprobación de WhatsApp (puede tardar horas a días, fuera de nuestro control).
3. Una vez aprobadas, anotar aquí mismo (o avisarme) los 6 Content SID resultantes.
4. Con los SID en mano, retomo T-16 como ticket de código: mapear cada `TaskAlertType` a su SID,
   habilitar el canal en `NotificationDispatcher.cs:34-39` (hoy lanza `NotSupportedException`
   para WhatsApp), y agregar el webhook de estado de Twilio para marcar `TaskAlertLog.Delivered`
   sólo tras confirmación real (no al encolar).

## Estado

⏸️ **Bloqueado** — pendiente de que se aprueben estas 6 plantillas en Twilio/WhatsApp Business.
No hay nada más que el agente ejecutor pueda avanzar en T-16 hasta entonces.
