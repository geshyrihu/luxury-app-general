# TICKET T-01 — Verificación, apagado del motor legado y monitoreo de corrida

Trabajas en el repositorio LuxuryApp (.NET 10 + Angular 22). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Respeta la jerarquía de convenciones ahí definida.

## Contexto

El módulo de tareas recurrentes tiene **dos motores** conviviendo. El vigente
(`TaskTemplate` → `TaskInstance`) se va a retirar en un ticket posterior. El otro
(`RecurringTaskTemplate` → `Tasks`) está registrado en Hangfire como
`generar-instancias-tareas-recurrentes-legado` y **está roto**: arma un folio de 49 caracteres
contra un límite de 20, no asigna `CustomerId` y no notifica nada.

Este ticket **no construye funcionalidad nueva**. Deja el terreno medido y seguro.

## Tareas de Backend

### 1. Consultas de verificación (NO modificar datos)

Crea `docs/migraciones/20260820-alertas-verificacion-t01.sql` con estas consultas y **nada más**.
No las ejecutes tú: son para que el equipo las corra en producción.

```sql
-- Baseline del KPI K6
SELECT COUNT(*) AS VencidasSinCerrar FROM TaskInstances
WHERE DueDate < GETDATE() AND CompletedAt IS NULL;

-- ¿El motor legado tiene algo vivo?
SELECT Status, COUNT(*) AS Total FROM TaskRecurringTemplates GROUP BY Status;
SELECT COUNT(*) AS TareasDeMotorLegado FROM Tasks WHERE RecurringTemplateId IS NOT NULL;

-- ¿Qué se pierde al retirar el motor viejo?
SELECT COUNT(*) FROM TaskInstances;
SELECT COUNT(*) FROM TaskTemplates WHERE IsActive = 1;
SELECT COUNT(*) FROM TaskAttachments;
SELECT COUNT(*) FROM TaskComments;
```

### 2. Monitoreo de corrida del generador

Archivo: `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RecurringTasks/Services/RecurringTaskGeneratorService.cs`

Problema actual: el `catch` de la línea 33 registra el error de un cliente y sigue; nadie se
entera. Y en las líneas 83-86, si un rol no tiene usuarios, escribe un `LogWarning` y salta.
**Un módulo que existe para que nada se pase por alto no puede fallar en silencio.**

Implementa:

- Un contador por corrida: clientes procesados, clientes fallidos, tareas generadas, casos sin
  responsable resoluble.
- Al terminar la corrida, si `clientesFallidos > 0` o `sinResponsable > 0`, enviar **una sola
  notificación** al rol `SistemasGeneral` vía `INotificationDispatcher`, con el resumen.
- Canales: `InApp`, `Push`, `PushWeb`. **NO uses `NotificationChannel.WhatsApp`**: el dispatcher
  lo rechaza con `NotSupportedException` (`NotificationDispatcher.cs:34-38`).
- El log se conserva; la notificación **se suma**, no lo reemplaza.

Restricción: NO cambies la lógica de generación en este ticket. Sólo instrumentación.

### 3. Documentar el apagado del job legado

El job legado se activa desde base de datos, no desde código. Crea
`docs/migraciones/20260820-alertas-apagar-job-legado.md` explicando:
qué clave apagar (`generar-instancias-tareas-recurrentes-legado`), en qué tabla vive la
configuración de jobs programados (búscalo en el código y **documenta la ruta que encontraste**),
y cómo revertirlo.

**NO borres** el código de `RecurringTaskSchedulerJob` ni su registro en `HangfireJobCatalog.cs`.
Eso es del ticket T-15.

## Tareas de Frontend

Ninguna en este ticket.

## Convenciones aplicables

- `CONVENTIONS.md` §4.1 — backend .NET: nombres, ubicación de servicios
- Acceso a datos por `ApplicationDbContext`; nada de SQL crudo en servicios
- Archivos en UTF-8 sin mojibake
- No modifiques ningún enum compartido en este ticket

## Verificación obligatoria

Corre y **pega la salida literal** de:

```bash
dotnet build api/LuxuryApp.sln
node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

Criterio de éxito:
- La compilación pasa sin errores nuevos
- `audit-conventions.mjs` **no aumenta** su conteo actual de 10 errores
- `scan-mojibake.mjs` da cero sobre los archivos que tocaste

## Criterio de PASO del ticket

Debe ser demostrable que **una corrida con un cliente fallido produce un aviso a una persona**,
no sólo una línea de log. Explica en tu reporte cómo lo verificaste.

## Reporte de finalización

Al terminar entrega:
1. Archivos tocados, con una línea de qué cambió en cada uno
2. Salida literal de los tres comandos
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos que detectaste y no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
