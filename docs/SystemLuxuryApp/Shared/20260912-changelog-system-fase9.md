# Fase 9: SystemLuxuryApp (Vertical Slices)

## Objetivo

Se aplicó el Estándar de Oro al último módulo pendiente, `SystemLuxuryApp`: eliminación de wrappers monolíticos, reparto de entidades residuales por submódulo lógico, normalización de nombres de carpetas, namespaces basados en ruta física y verificación completa a nivel solución.

## Gestión de bitácoras

- Se creó este archivo en `docs/changelogs/14_fase9_system.md`.

## Acomodo físico aplicado

Se eliminaron los wrappers arquitectónicos residuales:

- `Domain/Entities`
- `Infrastructure`
- `SendEmailGlobal/Features`

También se normalizaron carpetas con guiones para hacerlas compatibles con namespaces C#:

- `System-AI` -> `SystemAI`
- `System-AuditLogs` -> `SystemAuditLogs`

## Reubicación de entidades residuales

Las entidades que quedaban en `Domain/Entities` se movieron a su corte vertical propietario:

- `Domain/Entities/Backup/DatabaseBackupConfig.cs` -> `ConfiguracionSistema/DatabaseBackup/Entities/DatabaseBackupConfig.cs`
- `Domain/Entities/Backup/DatabaseBackupHistory.cs` -> `ConfiguracionSistema/DatabaseBackup/Entities/DatabaseBackupHistory.cs`
- `Domain/Entities/Catalogs/Address.cs` -> `ConfiguracionSistema/Catalogs/Entities/Address.cs`
- `Domain/Entities/Catalogs/MedidorCategoria.cs` -> `ConfiguracionSistema/Catalogs/Entities/MedidorCategoria.cs`
- `Domain/Entities/Catalogs/TelefonosEmergencia.cs` -> `ConfiguracionSistema/Catalogs/Entities/TelefonosEmergencia.cs`
- `Domain/Entities/Catalogs/ApprovalRoleHierarchy.cs` -> `Approvals/Entities/ApprovalRoleHierarchy.cs`
- `Domain/Entities/System-AI/AiChatMessage.cs` -> `SystemAI/AiChat/Entities/AiChatMessage.cs`
- `Domain/Entities/System-AI/AiChatSession.cs` -> `SystemAI/AiChat/Entities/AiChatSession.cs`
- `Domain/Entities/System-AuditLogs/AuditEntry.cs` -> `SystemAuditLogs/LogApp/Entities/AuditEntry.cs`
- `Domain/Entities/System-AuditLogs/LegacyIdMap.cs` -> `SystemAuditLogs/LogApp/Entities/LegacyIdMap.cs`
- `Domain/Entities/System-AuditLogs/MigrationVerificationLog.cs` -> `SystemAuditLogs/LogApp/Entities/MigrationVerificationLog.cs`
- `Domain/Entities/System-AuditLogs/NotificationLog.cs` -> `SystemTenant/Notification/Entities/NotificationLog.cs`
- `Domain/Entities/System-AuditLogs/NotificationUser.cs` -> `SystemTenant/Notification/Entities/NotificationUser.cs`

## Reubicación de infraestructura residual

El contenido de `Infrastructure` se reubicó en cortes verticales o submódulos propios:

- `Infrastructure/Common` -> `Common`
- `Infrastructure/Diagnostics` -> `Diagnostics`
- `Infrastructure/Persistence` -> `Persistence`
- `Infrastructure/SelectItem` -> `SelectItem`
- `Infrastructure/SendEmail` -> `SendEmailGlobal/Core`

El wrapper `SendEmailGlobal/Features` se eliminó moviendo sus features directamente bajo `SendEmailGlobal`, manteniendo la profundidad máxima de 4 niveles.

## Sincronización de namespaces

Se reescribieron los namespaces de los 134 archivos C# de `SystemLuxuryApp` al formato path-based:

`LuxuryApp.Application.Modules.SystemLuxuryApp.[RutaFisica]`

Ejemplos aplicados:

- `SystemAI/AiChat/Entities` -> `LuxuryApp.Application.Modules.SystemLuxuryApp.SystemAI.AiChat.Entities`
- `SystemAuditLogs/LogApp/Entities` -> `LuxuryApp.Application.Modules.SystemLuxuryApp.SystemAuditLogs.LogApp.Entities`
- `SystemTenant/Notification/Entities` -> `LuxuryApp.Application.Modules.SystemLuxuryApp.SystemTenant.Notification.Entities`
- `ConfiguracionSistema/DatabaseBackup/Entities` -> `LuxuryApp.Application.Modules.SystemLuxuryApp.ConfiguracionSistema.DatabaseBackup.Entities`
- `SendEmailGlobal/Core/ViewModels` -> `LuxuryApp.Application.Modules.SystemLuxuryApp.SendEmailGlobal.Core.ViewModels`

Se regeneraron los puentes globales necesarios en:

- `LuxuryApp.Application/GlobalUsings.cs`
- `LuxuryApp.Api/GlobalUsings.cs`
- `LuxuryApp.Tests/GlobalUsings.cs`

También se preservaron puentes planos mínimos para `SharedLuxuryApp`, porque ese módulo aún contiene namespaces legacy reales como `LuxuryApp.Application.Interfaces`, `LuxuryApp.Application.Services` y `LuxuryApp.Application.EndPoints`.

## Reparación de consumidores y Razor

Se actualizaron referencias fuente que apuntaban a namespaces antiguos:

- `LuxuryApp.Application.SendEmailGlobal.*` -> `LuxuryApp.Application.Modules.SystemLuxuryApp.SendEmailGlobal.*`
- `LuxuryApp.Application.SendEmailGlobal.Interfaces` -> `LuxuryApp.Application.Modules.SystemLuxuryApp.SendEmailGlobal.Core.Interfaces`
- `LuxuryApp.Application.SendEmailGlobal.Services` -> `LuxuryApp.Application.Modules.SystemLuxuryApp.SendEmailGlobal.Core.Services`
- `LuxuryApp.Application.ViewModels.*` -> `LuxuryApp.Application.Modules.SystemLuxuryApp.SendEmailGlobal.Core.ViewModels.*`
- `LuxuryApp.Application.Infrastructure.NotificationDispatcher` -> `LuxuryApp.Application.Modules.SystemLuxuryApp.SystemTenant.Notification.Services.NotificationDispatcher`

Se limpiaron usings globales obsoletos en `.csproj` y `GlobalUsings.cs` que ya apuntaban a namespaces inexistentes, incluyendo `LuxuryApp.Application.SendEmailGlobal`, `LuxuryApp.Application.ViewModels`, `LuxuryApp.CommonServices` y `LuxuryApp.Application.Infrastructure.Data.Entities`.

Las plantillas Razor de email también quedaron actualizadas al nuevo namespace path-based.

## Resolución de colisiones

La colisión principal apareció entre el submódulo `AiKnowledgeBase` y la entidad de Vault `AiKnowledgeBase`. Se resolvió con alias limpio:

- `AiKnowledgeBaseEntity = LuxuryApp.Application.Infrastructure.Vault.Entities.AiKnowledgeBase`

No se introdujeron usos inline de `global::` para System.

## Verificación

Comando ejecutado:

```powershell
dotnet build LuxuryApp.sln
```

Resultado final:

```text
Compilación correcta.
0 Advertencia(s)
0 Errores
```

Auditoría final de `SystemLuxuryApp`:

- 134 archivos `.cs`.
- 88 namespaces path-based.
- Profundidad máxima de carpetas: 4.
- 0 carpetas `Domain`, `Application`, `Infrastructure` o `Features` dentro del módulo.
- 0 carpetas con nombres inválidos para C#.
- 0 namespaces fuera del estándar path-based.
- 0 usos inline de `global::` para System.

Certificación de cierre:

- 0 errores.
- 0 advertencias.
- Módulo final aplanado y sincronizado.
