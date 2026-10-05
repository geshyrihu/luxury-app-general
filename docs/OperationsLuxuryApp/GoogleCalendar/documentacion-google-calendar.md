# Modulo Google Calendar de Juntas Mensuales

## Ubicacion del modulo

- Aplicacion:
  - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\JuntasMensuales\GoogleCalendar\`
- Integracion Google Calendar compartida:
  - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\Shared\GoogleCalendar\`
- Entidad principal de agenda:
  - `D:\repos\luxuryapp-api\api\LuxuryApp.Infrastructure\Data\Entities\JuntasMensuales\Agenda\GoogleCalendarEvent.cs`

## Objetivo

Este modulo administra la agenda central de juntas y asambleas de Luxury App, sincronizandola con un calendario central de Google Calendar.

No es un calendario personal por usuario. Es una agenda operativa centralizada que:

- crea eventos en Google Calendar
- actualiza eventos en Google Calendar
- elimina eventos en Google Calendar
- registra invitados internos del sistema
- genera Google Meet cuando la modalidad es virtual y la credencial lo permite
- crea o sincroniza la `JuntaMensualSession` asociada
- dispara notificaciones internas
- emite actualizaciones en tiempo real por SignalR

## Piezas principales

### Controller

- `GoogleCalendarEventsController`
  - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\JuntasMensuales\GoogleCalendar\Controller\GoogleCalendarEventsController.cs`

### App service

- `GoogleCalendarEventAppService`
  - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\JuntasMensuales\GoogleCalendar\Services\GoogleCalendarEventAppService.cs`

Este es el orquestador principal del modulo.

### Servicio Google compartido

- `GoogleCalendarService`
  - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\Shared\GoogleCalendar\Services\GoogleCalendarService.cs`

Este servicio encapsula:

- autenticacion por service account
- autenticacion OAuth para juntas virtuales con Meet
- creacion, actualizacion y eliminacion remota en Google Calendar
- formateo de fecha/hora y zona horaria

### DTOs del modulo

- `GoogleCalendarEventAddOrEditDTO`
- `GoogleCalendarEventListItemDTO`
- `GoogleCalendarEventDetailDTO`
- `GoogleCalendarGuestDTO`
- DTOs de asamblea:
  - `GoogleCalendarAssemblyPlanDTO`
  - `GoogleCalendarAssemblyInviteeDTO`
  - `GoogleCalendarAssemblySupportRequestDTO`
  - `GoogleCalendarAssemblyChecklistExecutionDTO`
- DTO de tiempo real:
  - `GoogleCalendarEventRealTimeUpdateDTO`

## Endpoints disponibles

Base:

- `api/google-calendar-events`

Endpoints:

1. `GET /api/google-calendar-events/customer/{customerId}`
   - lista eventos visibles para ese customer

2. `GET /api/google-calendar-events/{id}`
   - devuelve detalle completo del evento

3. `POST /api/google-calendar-events`
   - crea evento unico o serie recurrente

4. `PUT /api/google-calendar-events/{id}`
   - actualiza una ocurrencia individual

5. `PUT /api/google-calendar-events/{id}/series`
   - actualiza una serie completa

6. `DELETE /api/google-calendar-events/{id}`
   - elimina una ocurrencia individual

7. `DELETE /api/google-calendar-events/{id}/series`
   - elimina toda la serie

## Roles y permisos

### Acceso al controller

Roles con acceso general al controller:

- `Administrador`
- `Asistente`
- `GerenteOperaciones`
- `GerenteAtencion`
- `SuperUsuario`
- `Direccion`
- `GerenteMantenimiento`
- `SupervisionOperativa`

### Roles que pueden crear, editar y eliminar

Solo estos pueden operar escritura:

- `Administrador`
- `Asistente`
- `GerenteOperaciones`
- `GerenteAtencion`
- `SuperUsuario`

### Roles que pueden consultar todo el detalle de todos los customers

En `GoogleCalendarEventAppService.CanViewAllCalendarDetails()`:

- `SuperUsuario`
- `Direccion`
- `GerenteMantenimiento`
- `SupervisionOperativa`

Estos roles:

- pueden consultar eventos de cualquier customer
- pueden ver titulo, asunto, modalidad, detalle y enlaces completos

### Usuarios normales por customer

Los usuarios que no entran en el grupo anterior quedan limitados por `customerId`.

Regla:

- si el `currentUserService.CustomerId` no coincide con el `customerId` consultado, se rechaza el acceso

Ademas, aunque al consultar el listado se cargan todos los eventos para respetar restricciones globales de horario, el detalle visual de otros customers se enmascara como:

- titulo: `Horario ocupado`
- asunto: `Reservado`
- modalidad: `Reservado`

### Quien puede sobrepasar conflictos de horario

En `CanOverrideScheduleConflicts()`:

- solo `SuperUsuario`

Eso significa que solo `SuperUsuario` puede guardar una junta aunque el horario ya este ocupado.

## Tipos de asunto y modalidad

### Tipos de asunto soportados

- `JCM`
  - Junta de comite mensual
- `ASAM`
  - Asamblea
- `JLUX`
  - Junta interna con areas del grupo Luxury
- `JINT`
  - Junta con proveedores u otros asuntos

### Modalidad

- `VIR`
  - Virtual
- `PRE`
  - Presencial

## Reglas funcionales principales

### Titulo calculado

El titulo no se captura manualmente.

El backend lo calcula con:

- `nombre corto del customer + tipo de asunto + modalidad`

Ejemplo:

- `AVIVIA 58 JCM PRE`

### Duracion

La junta opera con una duracion fija de 90 minutos.

Constante en servicio:

- `CommitteeMeetingBlockingMinutes = 90`

### Conflictos de horario

La validacion no es por customer. Es global en la agenda central.

Regla aplicada:

- si existe una junta a una hora de inicio determinada, se bloquea esa hora de inicio y los dos slots siguientes de 30 minutos

Ejemplo:

- existe junta a `19:30`
- se bloquean:
  - `19:30`
  - `20:00`
  - `20:30`

La ventana que usa el backend esta representada por:

- `StartTimeBlockingWindowMinutes = 60`

La UI usa esa misma regla para deshabilitar opciones.

### Misma fecha

La junta es de un solo dia.

Reglas:

- `EndAt` debe ser mayor que `StartAt`
- la junta debe iniciar y terminar el mismo dia

### Ubicacion

- si la modalidad es `PRE`, la ubicacion es requerida
- si la modalidad es `VIR`, la ubicacion no es obligatoria

### Asamblea

Cuando el asunto es `ASAM`, el modulo activa comportamiento adicional:

- plan de asamblea
- invitados especificos de asamblea
- requerimientos operativos
- checklist de asamblea
- notificaciones extras a legal y coordinacion legal
- notificacion a sistemas si se solicita audio/video o paletas

## Recurrencia

El modulo soporta eventos unicos y series recurrentes.

### Tipos de recurrencia

El DTO soporta:

- `Mensual`
- `Bimestral`
- `Trimestral`
- `Cuatrimestral`
- `Quimestral`
- `Semestral`
- `Anual`

### Modos de recurrencia

- `DayOfMonth`
  - mismo dia del mes
- `OrdinalWeekday`
  - mismo tercer martes, cuarto jueves, ultimo viernes, etc.

### Como se persiste

No se persiste como un solo evento maestro remoto. El sistema genera ocurrencias individuales:

- cada ocurrencia se guarda en `GoogleCalendarEvent`
- todas comparten `RecurrenceSeriesId`

Tambien se guarda:

- `Recurrence`
- `RecurrenceMode`
- `RecurrenceRule`
- `RecurrenceEndDate`

### Series

Soportado:

- crear serie completa
- editar serie completa
- eliminar serie completa
- editar ocurrencia individual

## Sincronizacion con Google Calendar

### Arquitectura general

El flujo principal es:

1. el usuario crea o actualiza evento en Luxury App
2. `GoogleCalendarEventAppService` valida reglas de negocio
3. `GoogleCalendarService` crea o actualiza el evento en Google Calendar
4. si Google responde con `EventId`, se guarda localmente
5. si Google no devuelve `EventId`, la operacion falla para evitar registros operativos sin sincronizacion real

### Regla de sincronizacion obligatoria

Para flujo operativo normal:

- no se aceptan eventos nuevos sin `GoogleEventId`
- no se aceptan updates que regresen sin `EventId`

Esto se fuerza con:

- `EnsureOperationalSyncResult(...)`

### Excepcion permitida

La unica excepcion intencional son registros historicos creados por backfill.

Esos registros usan:

- `GoogleStatus = "HistoricoLocal"`

y pueden existir sin vinculo remoto.

### Direccion de sincronizacion

Actualmente el modulo garantiza:

- `Luxury App -> Google Calendar`

No existe todavia sincronizacion bidireccional automatica:

- cambios hechos directamente en Google Calendar no regresan automaticamente a Luxury App

Para eso haria falta implementar:

- webhooks `watch`
- o reconciliacion programada

## Fecha, hora y zona horaria

Este punto es critico.

### Regla actual

El modulo trata las fechas de agenda como horas locales de negocio del calendario.

Para evitar corrimientos:

- en `GoogleCalendarEventAppService`, antes de validar o sincronizar, se normaliza `StartAt` y `EndAt` a `DateTimeKind.Unspecified`
- en `GoogleCalendarService`, el payload hacia Google se formatea con offset explicito

Formato enviado:

- `yyyy-MM-ddTHH:mm:sszzz`

Ejemplo esperado:

- `2026-06-05T09:00:00-06:00`

Zona declarada:

- `America/Mexico_City`

Adicionalmente, el resolvedor de zona intenta compatibilidad entre:

- `America/Mexico_City`
- `Central Standard Time (Mexico)`
- `Central Standard Time`

### Utilidad de correccion

Existe utilidad en `UpdateDataBase` para resincronizar horarios ya creados:

- `POST /api/UpdateDataBase/resync-google-calendar-event-times`

Esta utilidad vuelve a enviar a Google los eventos ya vinculados usando la hora almacenada en Luxury App.

## Google Meet

### Modalidad virtual

Si la modalidad es `VIR`, el modulo solicita Google Meet.

### Estrategia de autenticacion

Hay dos mecanismos:

1. Service Account
   - para agenda normal y eventos sin Meet

2. OAuth del usuario autorizado del calendario central
   - para generar Google Meet en juntas virtuales cuando la service account no soporta `hangoutsMeet`

### Resultado

El evento puede guardar:

- `GoogleMeetUrl`

Los usuarios finales no necesitan acceso a la cuenta organizadora del calendario para abrir la liga de Meet. Necesitan la liga.

## Invitados

### Invitados del sistema

Los invitados capturados en Luxury App se guardan localmente en:

- `GoogleCalendarGuest`

### Invitados hacia Google

La integracion soporta attendees remotos, pero depende de configuracion:

- `GoogleCalendar:SyncAttendeesToGoogle`

Si esta en `false`:

- no se mandan attendees reales a Google
- se conservan localmente
- en algunos casos se agregan solo en descripcion

## Integracion con JuntaMensualSession

Cuando el asunto es:

- `JCM`
- `ASAM`

el modulo crea o sincroniza automaticamente una `JuntaMensualSession`.

Campos ligados desde agenda:

- `GoogleCalendarEventEntityId`
- `GoogleCalendarEventId`
- `ScheduledAt`
- `ScheduledEndAt`
- `Modality`
- `Location`
- `GoogleMeetUrl`

Esto convierte la agenda en el punto de origen de la sesion mensual.

## Integracion con Asamblea

Si el asunto es `ASAM`, el modulo tambien sincroniza:

- `AsambleaPlan`
- `AsambleaInvitado`
- `AsambleaSupportRequest`
- `AsambleaChecklistExecution`

Comportamientos:

- crear plan de asamblea
- guardar invitados especificos
- generar soporte de paletas
- generar soporte de audio/video
- asegurar checklist de asamblea

## Notificaciones internas

Despues de crear agenda `JCM` o `ASAM`, el modulo notifica via:

- `JuntaMensualNotificationOrchestrator`

Destinatarios base:

- Direccion general
- Gerente de mantenimiento
- Administrador del customer
- Gerente de operaciones del customer
- Gerente de atencion del customer
- Asistente del customer
- Contador del customer

Extras para `ASAM`:

- Legal
- Coordinacion legal

Extras cuando hay soporte tecnico:

- Sistemas general

## Tiempo real con SignalR

El modulo emite cambios en tiempo real al terminar operaciones relevantes.

Servicio usado:

- `ISendSignalRService`

Evento emitido:

- `GoogleCalendarEventRealTimeUpdateDTO`

Acciones posibles:

- `created`
- `updated`
- `deleted`
- `series-created`
- `series-updated`
- `series-deleted`

El request HTTP puede enviar:

- `X-Connection-Id`

para excluir al cliente que originó la accion y evitar refresco duplicado.

## Estados visibles en UI

La UI distingue al menos estos estados:

- `Sincronizado con Google`
- `Solo local (historico)`
- `Solo local`
- `Pendiente de sincronizar`

En flujo operativo normal, la expectativa es:

- `Sincronizado con Google`

## Validaciones de negocio importantes

`ValidateDTO(...)` valida, entre otras:

- `CustomerId` requerido
- `EndAt > StartAt`
- mismo dia
- ubicacion requerida para `PRE`
- recurrencia completa si `IsRecurring = true`
- validaciones de asamblea

Adicionalmente:

- el titulo siempre se recalcula
- no se permite cambiar `CustomerId` al editar
- no se permite dejar una operacion operativa sin `GoogleEventId`

## Eliminacion

### Evento individual

Al eliminar:

- si el evento tiene `GoogleEventId`, se elimina en Google Calendar y luego localmente
- si no tiene `GoogleEventId` y no es historico, el sistema rechaza la operacion para evitar inconsistencias

### Serie

La misma regla aplica a series:

- si alguna ocurrencia operativa pierde el vinculo remoto, la eliminacion completa se bloquea
- historicos pueden eliminarse solo localmente

## Casos especiales y limitaciones actuales

1. El modulo no escucha cambios hechos directamente en Google Calendar.
2. Los historicos creados por backfill no necesariamente existen en Google.
3. La sincronizacion de attendees reales a Google depende de configuracion.
4. Google Meet depende de que la credencial usada soporte `conferenceData`.
5. Los conflictos de horario se bloquean globalmente, no por customer.
6. Solo `SuperUsuario` puede sobrepasar conflictos.

## Utilidades de soporte relacionadas

En `UpdateDataBase` existen utilidades relacionadas con este modulo:

- importar checklist de asamblea
- backfill agenda desde minutas
- backfill historico de horas
- resincronizar horarios con Google Calendar

Estas utilidades no forman parte del flujo normal de agenda, pero son clave para migracion, correccion historica y soporte.

## Flujo resumido

### Evento normal

1. UI captura asunto, modalidad, fecha y hora.
2. Backend normaliza fechas a hora de negocio.
3. Se validan permisos y conflictos.
4. Se calcula titulo.
5. Se crea o actualiza en Google Calendar.
6. Se guarda `GoogleEventId`, `GoogleHtmlLink`, `GoogleMeetUrl`, `GoogleStatus`.
7. Se sincroniza `JuntaMensualSession`.
8. Si aplica, se sincroniza `AsambleaPlan`.
9. Se envian notificaciones internas.
10. Se emite actualizacion SignalR.

### Evento recurrente

1. Se genera la serie de ocurrencias.
2. Cada ocurrencia se sincroniza individualmente con Google.
3. Todas comparten `RecurrenceSeriesId`.
4. La edicion completa de la serie reconstruye o actualiza ocurrencias futuras.

## Archivos mas relevantes

- Controller
  - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\JuntasMensuales\GoogleCalendar\Controller\GoogleCalendarEventsController.cs`
- App service
  - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\JuntasMensuales\GoogleCalendar\Services\GoogleCalendarEventAppService.cs`
- Servicio Google
  - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\Shared\GoogleCalendar\Services\GoogleCalendarService.cs`
- Orquestador de notificaciones
  - `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Modules\JuntasMensuales\Notifications\Services\JuntaMensualNotificationOrchestrator.cs`
- Front principal
  - `D:\repos\luxuryapp-api\client\angular\src\app\features\google-calendar\`
