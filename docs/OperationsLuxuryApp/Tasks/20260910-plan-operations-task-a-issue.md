# 📋 Plan de Refactorización Integral: Entidad Núcleo `Task` a `Issue`

> **Fecha:** 2026-09-10  
> **Autor:** Antigravity Senior Orchestrator  
> **Estado:** 🟡 EN PROGRESO / PENDIENTE DE EJECUCIÓN POR FASES  
> **Ámbito:** Backend (`api/LuxuryApp.Application/`, `api/LuxuryApp.Api/`, `api/LuxuryApp.Tests/`) y Frontend (`appsweb/angular/src/app/`)

---

## 🎯 Objetivo General

Refactorizar la entidad central de dominio `Task` y todo su ecosistema técnico y visual hacia **`Issue`**.

Este refactor resuelve tres problemas críticos:
1. **Eliminación de Conflicto de Nombres en C#**: Elimina la ambigüedad constante entre la entidad de negocio `Task` y la clase reservada del sistema `System.Threading.Tasks.Task`.
2. **Claridad Semántica y Alineación de Dominio**: Modifica el término hacia `Issue` para representar de forma más precisa el flujo operativo de atención, seguimiento e incidencias.
3. **Estandarización bajo Convenciones**: Alinea los submódulos, namespaces y carpetas físicas bajo las reglas vigentes en `CONVENTIONS_FOLDER_API.MD` y convenciones frontend.

---

## 📊 Inventario Cuantitativo de Impacto

| Capa / Repositorio | Archivos Involucrados | Detalle de Componentes |
| :--- | :---: | :--- |
| **Backend (`api/`)** | **1,030 archivos `.cs`** | Entidades, DTOs, Mappers, Servicios, Interfaces, Endpoints, `ApplicationDbContext.cs`, `GlobalUsings.cs`, DI y Pruebas Unitarias. |
| **Frontend (`appsweb/angular/`)** | **194 archivos** | Módulo `task-engine`, Componentes, Servicios HTTP, Modelos TypeScript, Templates HTML, SCSS y Routing. |
| **Total Global** | **1,224 archivos** | Mapeo 100% verificado. |

---

## 🛡️ Matriz de Gestión de Riesgos y Protocolos de Seguridad

| Riesgo | Nivel | Estrategia de Mitigación / Prevención |
| :--- | :---: | :--- |
| **Pérdida de Datos en BD** | 🔴 Crítico | **NUNCA realizar DROP/CREATE.** Las tablas físicas SQL Server mantendrán sus nombres originales (`[Table("Tasks")]`, `[Table("TaskRecords")]`) o se utilizarán migraciones con `sp_rename` probadas. |
| **Breaking Change en APIs** | 🟠 Alto | Actualizar endpoints a `/api/issues` manteniendo compatibilidad en la respuesta DTO. Si existen clientes externos legacy, implementar alias de ruta temporal `/api/tasks`. |
| **Rutas 404 en Angular** | 🟡 Medio | Configurar un `redirectTo` 301 en `operations-luxuryapp-routing.module.ts` de Angular para redirigir automáticamente `/task-engine` ➔ `/issue-engine`. |
| **Merge Hell en Git** | 🟡 Medio | Trabajar en la rama aislada `refactor/task-to-issue`. |

---

## 🗺️ Mapa Completo de Submódulos Backend a Reestructurar

Carpetas en `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/`:

- `Task/` ➔ **`Issues/`**
  - `TaskRecords/` ➔ `IssueRecords/` (`Tasks.cs` ➔ `Issue.cs`, `TaskInstance.cs` ➔ `IssueInstance.cs`, `TaskChangeLog.cs` ➔ `IssueChangeLog.cs`, `TaskComment.cs` ➔ `IssueComment.cs`, `TaskServiceOrder.cs` ➔ `IssueServiceOrder.cs`, `TaskAppService.cs` ➔ `IssueAppService.cs`, `ITaskAppService.cs` ➔ `IIssueAppService.cs`, `TasksEndpoints.cs` ➔ `IssuesEndpoints.cs`)
  - `TaskAttachments/` ➔ `IssueAttachments/` (`TaskAttachment.cs` ➔ `IssueAttachment.cs`, `TaskAttachmentAppService.cs` ➔ `IssueAttachmentAppService.cs`, `TaskAttachmentsEndPoints.cs` ➔ `IssueAttachmentsEndpoints.cs`)
  - `TaskFollowUp/` ➔ `IssueFollowUp/` (`TaskFollowUp.cs` ➔ `IssueFollowUp.cs`, `TaskFollowUpAppService.cs` ➔ `IssueFollowUpAppService.cs`)
  - `TaskJustifications/` ➔ `IssueJustifications/` (`TaskJustification.cs` ➔ `IssueJustification.cs`, `TaskJustificationAppService.cs` ➔ `IssueJustificationAppService.cs`)
  - `TaskWorkPlans/` ➔ `IssueWorkPlans/` (`TaskWorkPlan.cs` ➔ `IssueWorkPlan.cs`, `TaskWeeklyWork.cs` ➔ `IssueWeeklyWork.cs`)
  - `RecurringTaskCatalog/` ➔ `RecurringIssueCatalog/` (`RecurringTaskTemplate.cs` ➔ `RecurringIssueTemplate.cs`, `CustomerTaskItemConfig.cs` ➔ `CustomerIssueItemConfig.cs`, `TaskTemplateCustomer.cs` ➔ `IssueTemplateCustomer.cs`)
  - `RecurringTaskGeneration/` ➔ `RecurringIssueGeneration/`
  - `RecurringTaskCompliance/` ➔ `RecurringIssueCompliance/`
  - `TaskChecklistItems/` ➔ `IssueChecklistItems/`
  - `TaskLegal/` ➔ `IssueLegal/`
  - `TaskMessageRead/` ➔ `IssueMessageRead/`
  - `TaskReports/` ➔ `IssueReports/`

---

## 🗺️ Mapa Completo de Estructura Frontend a Reestructurar

Carpetas en `appsweb/angular/src/app/modules/operations-luxuryapp/`:

- `task-engine/` ➔ **`issue-engine/`**
  - `task-engine.module.ts` ➔ `issue-engine.module.ts`
  - `task-engine-routing.module.ts` ➔ `issue-engine-routing.module.ts`
  - `pages/tasks/` ➔ `pages/issues/`
  - `pages/recurring-tasks/` ➔ `pages/recurring-issues/`
  - `pages/my-tasks/` ➔ `pages/my-issues/`
  - `components/`:
    - `task-date-range-selector/` ➔ `issue-date-range-selector/`
    - `task-follow-up/` ➔ `issue-follow-up/`
    - `task-message/` ➔ `issue-message/`
    - `task-report-actions/` ➔ `issue-report-actions/`
    - `task-status/` ➔ `issue-status/`
    - `task-checklist-panel/` ➔ `issue-checklist-panel/`
    - `task-justification-panel/` ➔ `issue-justification-panel/`
  - `services/`: `task.service.ts` ➔ `issue.service.ts`, `recurring-task.service.ts` ➔ `recurring-issue.service.ts`
  - `models/`: `task.model.ts` ➔ `issue.model.ts`

---

## 🚀 Checklist por Fases de Ejecución

### 🔴 FASE 0: Preparación y Congelación de Entorno
- [ ] 0.1 Verificar copia de seguridad / estado limpio del repositorio.
- [ ] 0.2 Confirmar compilación verde inicial:
  - `dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj`
  - `dotnet build api/LuxuryApp.Api/LuxuryApp.Api.csproj`
  - `cd appsweb/angular; npm run build`

---

### 🟠 FASE 1: Refactorización de Backend (C# / .NET 10)

#### 1.1 Reestructuración de Carpetas Físicas y Namespaces
- [ ] Renombrar directorio `Modules/OperationsLuxuryApp/Task/` a `Modules/OperationsLuxuryApp/Issues/`.
- [ ] Renombrar las 12 carpetas de submódulos (`TaskRecords` ➔ `IssueRecords`, `TaskAttachments` ➔ `IssueAttachments`, etc.).
- [ ] Actualizar los `namespace` file-scoped de todos los archivos `.cs` trasladados para reflejar `LuxuryApp.Application.Modules.OperationsLuxuryApp.Issues.[Submodulo].[Categoria]`.

#### 1.2 Renombrado de Entidades y Mapeo EF Core
- [ ] Renombrar `Tasks.cs` ➔ `Issue.cs` y su clase interna `public class Issue`.
- [ ] Mapear explicitamente `[Table("Tasks")]` en `Issue.cs` para mantener integridad de BD.
- [ ] Renombrar `TaskInstance.cs` ➔ `IssueInstance.cs`, `TaskChangeLog.cs` ➔ `IssueChangeLog.cs`, `TaskComment.cs` ➔ `IssueComment.cs`, `TaskServiceOrder.cs` ➔ `IssueServiceOrder.cs`.
- [ ] Actualizar `ApplicationDbContext.cs`:
  - `DbSet<Tasks> Tasks` ➔ `DbSet<Issue> Issues`
  - `DbSet<TaskInstance>` ➔ `DbSet<IssueInstance>`
  - Mapeos Fluent API e integraciones de auditoría.

#### 1.3 Renombrado de Servicios, DTOs y Endpoints
- [ ] Renombrar `ITaskAppService.cs` ➔ `IIssueAppService.cs` y `TaskAppService.cs` ➔ `IssueAppService.cs`.
- [ ] Renombrar DTOs (`TasksAddOrEditDTO` ➔ `IssueAddOrEditDTO`, `TasksListDTO` ➔ `IssueListDTO`, `MyAssignedTasksDTO` ➔ `MyAssignedIssuesDTO`, etc.).
- [ ] Renombrar Endpoints (`TasksEndpoints.cs` ➔ `IssuesEndpoints.cs`) y actualizar rutas a `/api/operation/issues`.
- [ ] Actualizar registro DI en `DependencyInjection.Controllers.cs`:
  - `services.AddScoped<IIssueAppService, IssueAppService>();`

#### 1.4 Verificación de Compilación de Backend
- [ ] Ejecutar `dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj` (Debe resultar 0 Errores).
- [ ] Ejecutar `dotnet build api/LuxuryApp.Api/LuxuryApp.Api.csproj` (Debe resultar 0 Errores).
- [ ] Ejecutar `dotnet test api/LuxuryApp.Tests/LuxuryApp.Tests.csproj` (Debe resultar 0 Errores).

---

### 🟡 FASE 2: Refactorización de Frontend (Angular 22)

#### 2.1 Reestructuración de Carpetas Físicas de Angular
- [ ] Renombrar directorio `appsweb/angular/src/app/modules/operations-luxuryapp/task-engine/` a `issue-engine/`.
- [ ] Renombrar subdirectorios (`pages/tasks/` ➔ `pages/issues/`, `pages/recurring-tasks/` ➔ `pages/recurring-issues/`, `pages/my-tasks/` ➔ `pages/my-issues/`).
- [ ] Renombrar carpetas de componentes compartidos (`task-date-range-selector` ➔ `issue-date-range-selector`, `task-follow-up` ➔ `issue-follow-up`, etc.).

#### 2.2 Renombrado de Archivos, Clases y Servicios TS
- [ ] Renombrar `task.service.ts` ➔ `issue.service.ts` (`TaskService` ➔ `IssueService`).
- [ ] Renombrar `task.model.ts` ➔ `issue.model.ts` (`Task` ➔ `Issue`).
- [ ] Actualizar endpoints de llamadas HTTP en los servicios (`/api/operation/issues`).
- [ ] Renombrar declaraciones de componentes en TS (`TaskListComponent` ➔ `IssueListComponent`, etc.).

#### 2.3 Enrutamiento y Compatibilidad (Routing Module)
- [ ] Renombrar `task-engine.module.ts` ➔ `issue-engine.module.ts` y `task-engine-routing.module.ts` ➔ `issue-engine-routing.module.ts`.
- [ ] Actualizar `operations-luxuryapp-routing.module.ts`:
  ```typescript
  // Redirección para marcadores legacy
  { path: 'task-engine', redirectTo: 'issue-engine', pathMatch: 'full' },
  { path: 'issue-engine', loadChildren: () => import('./issue-engine/issue-engine.module').then(m => m.IssueEngineModule) }
  ```

#### 2.4 Actualización de HTML Templates y Bindings
- [ ] Reemplazar referencias en templates HTML (`task.` ➔ `issue.`, `tasks$` ➔ `issues$`).
- [ ] Actualizar etiquetas de menú de navegación/sidebar de "Tareas" / "Task Engine" a "Issues" / "Issue Engine".

#### 2.5 Verificación de Compilación de Frontend
- [ ] Ejecutar `cd appsweb/angular; npm run build` (Debe resultar 0 Errores).

---

### 🟢 FASE 3: Auditoría QA y Prueba Punta a Punta

- [ ] 3.1 Probar navegación en navegador cargando `/operations.luxuryapp/issue-engine/issues`.
- [ ] 3.2 Verificar redirección automática ingresando a `/operations.luxuryapp/task-engine`.
- [ ] 3.3 Crear, editar y consultar un Issue desde la UI y validar persistencia en SQL Server.
- [ ] 3.4 Invocar la skill `qa-punta-a-punta` para certificar la ausencia de brechas de estado o concurrencia antes del cierre.

---

## 📌 Registro de Avances y Bitácora de Ejecución

| Fecha | Fase | Descripción del Movimiento | Estado | Firma Agente |
| :--- | :---: | :--- | :---: | :--- |
| **2026-09-10** | **Fase 0** | Planificación inicial y auditoría cuantitativa completada. | ✅ HECHO | Antigravity Orchestrator |
| **2026-09-10** | **Fase 1** | *Pendiente de ejecución* | ⏳ PENDIENTE | - |
| **2026-09-10** | **Fase 2** | *Pendiente de ejecución* | ⏳ PENDIENTE | - |
| **2026-09-10** | **Fase 3** | *Pendiente de ejecución* | ⏳ PENDIENTE | - |
| **2026-09-10** | **Fase 4** | *Pendiente de ejecuci�n* | ? PENDIENTE | - |