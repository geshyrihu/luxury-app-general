# Plan de Implementación — ServiceOrders: Seguimiento + Suspensión por Falta de Presupuesto

## 1. Metadata

| Campo | Valor |
|-------|-------|
| Módulo | `OperationsLuxuryApp/ServiceOrders` |
| Tipo | B (Ampliar módulo existente) |
| Backend | `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/ServiceOrders/` |
| Entidades | `api/LuxuryApp.Application/Infrastructure/Data/Entities/OperationsLuxuryApp/ServiceOrders/` |
| Frontend | `appsweb/angular/src/app/modules/operations.luxuryapp/service-orders/` |
| Fecha | 2026-09-25 |
| Estado | Aprobado para implementación |
| Origen | Solicitud directa del dueño del módulo |

---

## 2. Resumen Ejecutivo (FASE 0.1)

**Problem Statement:**

> Actualmente, el **Jefe de Mantenimiento / Administrador** sufre de **no poder distinguir entre una orden pendiente normal y una detenida deliberadamente por falta de presupuesto** cuando intenta **dar seguimiento al avance de mantenimientos**, lo que resulta en **órdenes que parecen "olvidadas" sin trazabilidad de por qué no se ejecutan ni historial de gestiones**.

Esto afecta a todos los clientes con mantenimiento preventivo activo y a las juntas mensuales donde se reporta avance.

**KPIs:**

| Métrica | Baseline | Target | Timeline | Verificación |
|:---|:---|:---|:---|:---|
| Órdenes pendientes con causa explícita | 0% (no existe campo) | 100% de órdenes detenidas con `SuspensionReasonId` | Fase 3 | Query SQL: pendientes con motivo / pendientes detenidas |
| Historial de seguimiento por OS | 0 registros | ≥1 seguimiento en OS con gestión | Fase 4 | Conteo `ServiceOrderFollowUps` por OS |
| Trazabilidad de reanudación | N/A | 100% de reanudaciones registran fecha/usuario | Fase 3 | Campos `SuspendedAt`/`SuspendedByUserId` no nulos |
| Motivos de suspensión reutilizables | 0 | ≥5 motivos sembrados por cliente | Fase 2 | Conteo catálogo por customer |

---

## 3. Objetivo

1. Permitir marcar una orden de servicio como **detenida por falta de presupuesto** (o motivo catalogado) sin cambiar su estatus (`Pendiente`), registrando motivo, notas, fecha y usuario.
2. Permitir **seguimientos** cronológicos (nota + usuario + fecha) sobre una orden de servicio, sin imágenes, con arquitectura análoga a `TaskFollowUp`.

---

## 4. Alcance

**Incluye:**
- Entidad `ServiceOrderSuspensionReason` (catálogo por cliente) + `DbSet` + mapeo.
- Campos de suspensión en `ServiceOrder` (`SuspensionReasonId`, `SuspensionNotes`, `SuspendedAt`, `SuspendedByUserId`, `IsBlockedByBudget` derivado o explícito).
- Entidad `ServiceOrderFollowUp` (Descripción + CreatedAt + UserId) + `DbSet` + mapeo.
- Servicios, interfaces, DTOs, endpoints y mapper.
- Migración EF.
- Frontend: marca/desmarca de suspensión en `service-order-form`, modal de seguimiento (patrón `task-followup`), botón en listado, filtro/columna de "detenida".
- Siembra de catálogo de motivos vía `UpdateDataBase` (patrón existente).

**No incluye:**
- Flujo de aprobación de suspensión (decisión: solo marca informativa).
- Imágenes en seguimiento (decisión explícita).
- Índice único de `Folio` y demás pendientes del QA previo.
- Bloqueo automático de la ejecución por falta de presupuesto en otros módulos.

---

## 5. Restricciones

- Respetar `conventions/CONVENTIONS_ENTITIES.md`, `backend-module-structure.md`, `dto-file-organization-rule.md`, `frontend-feature-structure.md`.
- Código en inglés; UI en español.
- Toda lectura/escritura debe respetar tenant (`ITenantAccessor`), patrón ya aplicado en el módulo.
- El catálogo de motivos es **por cliente** (tenant-scoped).
- Sin comentarios en código salvo XML doc existente como norma del repo.
- Migración reversible declarada; siembra idempotente.
- Gate objetivo: `node scripts/audit-conventions.mjs` y `node scripts/check-agent-rules.mjs`.

---

## 6. FASE 0.2 — Matriz de Reglas de Negocio

### Nivel 1 — Invariantes de Dominio

- **RN-SOS-001**: Una OS detenida por presupuesto **conserva `Status = Pendiente`**; la suspensión es una dimensión ortogonal al estatus.
- **RN-SOS-002**: Un seguimiento pertenece siempre a una OS existente y no puede quedar huérfano.
- **RN-SOS-003**: El motivo de suspensión pertenece al mismo `Customer` que la OS.

### Nivel 2 — Flujo y Estados

- **RN-SOS-010**: Suspender ⇒ `SuspensionReasonId` + `SuspendedAt` + `SuspendedByUserId` obligatorios. Reanudar ⇒ limpiar los tres.
- **RN-SOS-011**: No se puede suspender una OS en estado final (`Concluido`/`Cancelado`/`Denegado`) — alineado a `FinalStatuses` ya implementado.
- **RN-SOS-012**: Los seguimientos son append-only desde UI (crear/eliminar); no se editan (o edición restringida a autor/admin, decidir en implementación siguiendo patrón TaskFollowUp).

### Nivel 3 — Seguridad/Autorización

- **RN-SOS-020**: Ver/crear seguimiento: roles del módulo operaciones (`SuperUsuario`, `Direccion`, `Administrador`, `GerenteOperaciones`, `GerenteMantenimiento`, `JefeMantenimiento`) — validar catálogo real en `ApplicationRoleEnum`.
- **RN-SOS-021**: Eliminar seguimiento: autor o `SuperUsuario`/`Direccion` (espejo de `TaskFollowUpAppService.DeleteAsync`).
- **RN-SOS-022**: Todo acceso valida tenant vía `EnsureTenantAccess`; sin acceso ⇒ 404/403.
- **RN-SOS-023**: Suspender/reanudar queda auditado (usuario + fecha ya en la entidad).

### Nivel 4 — Validación de Datos

- **RN-SOS-030**: `Description` seguimiento: requerido, 10–200 caracteres.
- **RN-SOS-031**: `SuspensionNotes`: máx. 300 caracteres, opcional.
- **RN-SOS-032**: `ServiceOrderFollowUp.CreatedAt`: default `DateTime.UtcNow`.
- **RN-SOS-033**: Motivo: `Name` requerido máx. 120, único por cliente (`CustomerId + Name`).

---

## 7. Arquitectura & Diseño Técnico

### 7.1 Entidades nuevas

**`ServiceOrderSuspensionReason`** (`Infrastructure/Data/Entities/OperationsLuxuryApp/ServiceOrders/ServiceOrderSuspensionReason.cs`)
- `GuidIdEntity`; `CustomerId`; `Name` (120); `Code` (30, opcional); `Description` (300); `IsSystem` bool; `IsActive` bool = true; colección `ServiceOrders`.

**`ServiceOrderFollowUp`** (`.../ServiceOrders/ServiceOrderFollowUp.cs`) — análoga a `TaskFollowUp` sin imágenes.
- `GuidIdEntity`; `ServiceOrderId` (FK); `ServiceOrder`; `UserId` (FK `ApplicationUser`); `User`; `CreatedAt` (DateTime, UTC); `Description` (200, required).

### 7.2 Campos nuevos en `ServiceOrder`
- `Guid? SuspensionReasonId` + nav `ServiceOrderSuspensionReason`.
- `string? SuspensionNotes` (300).
- `DateTime? SuspendedAt`.
- `string? SuspendedByUserId` (+ nav opcional `ApplicationUser`).
- Colección `HashSet<ServiceOrderFollowUp> FollowUps`.

### 7.3 Reutilización (obligatorio)
- Patrón entidad/DTO/servicio/endpoint: `TaskFollowUp` + `MeetingDetailsSeguimiento`.
- Access guard: `EnsureTenantAccess` de `ServiceOrderAppService` (ya existe).
- Estados finales: `FinalStatuses` (ya existe).
- Siembra: `UpdateDataBaseService`/endpoints (patrón `SeedRecruitmentSourcesAsync`).
- Frontend: `task-followup.ts/html` como plantilla del modal y timeline; `FormHelper.submitCrud`.

### 7.4 Componentes backend
- `DTOs/ServiceOrderFollowUpDTO.cs`, `CreateServiceOrderFollowUpDTO.cs`, `UpdateServiceOrderFollowUpDTO.cs`.
- `DTOs/ServiceOrderSuspensionReasonDTO.cs`, `CreateServiceOrderSuspensionReasonDTO.cs`, `Update...`.
- `DTOs/SuspendServiceOrderDTO.cs` (motivo + notas) y `ResumeServiceOrderDTO` (o sin body).
- `Interfaces/IServiceOrderFollowUpAppService.cs`, `IServiceOrderSuspensionReasonAppService.cs`.
- `Services/ServiceOrderFollowUpAppService.cs`, `ServiceOrderSuspensionReasonAppService.cs`.
- `EndPoints/ServiceOrderFollowUpsEndpoints.cs`, `ServiceOrderSuspensionReasonsEndpoints.cs` (+ rutas suspend/resume en `ServiceOrdersEndpoints.cs`).
- `Mapping/ServiceOrderMapper.cs`: mapas nuevos.
- `ApplicationDbContext`: `DbSet<ServiceOrderFollowUp> ServiceOrderFollowUps`, `DbSet<ServiceOrderSuspensionReason> ServiceOrderSuspensionReasons`.
- `GlobalUsings.cs`: namespaces nuevos.

### 7.5 Frontend
- `service-order/seguimiento-orden-servicio.ts/html` (modal timeline, patrón `task-followup`).
- `service-order/suspension-orden-servicio.ts/html` (modal motivo+notas).
- `service-order-form.ts/html`: switch "Detenida por presupuesto" + selector motivo + notas; DTO payload.
- `ordenes-servicio-list.ts/html`: botón "Seguimiento", tag/badge "Detenida", acción suspender/reanudar.
- `operations.endpoints.ts`: `ServiceOrderFollowUps`, `ServiceOrderSuspensionReasons`, `ServiceOrders.suspend/resume`.
- Enum selects si se exponen estados de suspensión.

---

## 8. Fases y Checklist

### Fase 1 — Contratos y entidades backend
- [ ] Crear `ServiceOrderSuspensionReason.cs`
- [ ] Crear `ServiceOrderFollowUp.cs`
- [ ] Modificar `ServiceOrder.cs` (campos + navs + colección)
- [ ] Registrar `DbSet` en `ApplicationDbContext.cs`
- [ ] Fluent/índices: `(CustomerId, Name)` único; `(ServiceOrderId, CreatedAt)` índice
- [ ] `GlobalUsings.cs`

### Fase 2 — Persistencia + siembra
- [ ] Migración EF `AddServiceOrderFollowUpAndSuspension`
- [ ] `UpdateDataBaseService.SeedServiceOrderSuspensionReasonsAsync` + endpoint + botón/entrada admin
- [ ] Verificar migración en BD limpia y existente

### Fase 3 — Suspensión (API + UI)
- [ ] DTOs + mapper
- [ ] `Suspend`/`Resume` en `IServiceOrderAppService` + implementación (RN-SOS-010/011/022)
- [ ] Endpoints + metadata
- [ ] UI: switch/selector en form, badge y acciones en listado

### Fase 4 — Seguimiento (API + UI)
- [ ] DTOs + mapper
- [ ] `IServiceOrderFollowUpAppService` + servicio (tenant + autor/eliminar)
- [ ] Endpoints (list/create/delete)
- [ ] UI modal timeline + botón en listado

### Fase 5 — Verificación
- [ ] `dotnet build` backend 0 errores
- [ ] `tsc --noEmit` + `ng build` frontend
- [ ] `audit-conventions.mjs` / `check-agent-rules.mjs`
- [ ] Pruebas manuales de flujos (sección 9)

---

## 9. Criterios de Paso (FASE 0.3 — Flujos)

**Happy — Suspender por presupuesto:**
Usuario abre OS Pendiente → activa switch → elige "Falta de presupuesto" → guarda → OS sigue `Pendiente` pero lista muestra tag "Detenida" con motivo. **PASS:** registro persiste con `SuspendedAt`/`SuspendedByUserId`, estatus intacto.

**Happy — Seguimiento:**
Usuario abre modal Seguimiento → escribe nota 10–200 → guarda → aparece en timeline con usuario y fecha. **PASS:** 1 registro nuevo, orden descendente correcto.

**Sad — Suspender OS concluida:**
Usuario intenta suspender OS `Concluido`. **PASS:** 409 `BusinessException` con mensaje claro; UI muestra error.

**Sad — Eliminar seguimiento ajeno:**
Usuario no-autor sin rol admin intenta borrar. **PASS:** 403.

**Edge — Tenant cruzado:**
Usuario de cliente A consulta seguimientos/suspensión de OS de cliente B. **PASS:** 404.

**Edge — Reanudar sin motivo:**
Reanudar limpia motivo/fecha/usuario/notas. **PASS:** campos nulos, estatus sigue `Pendiente`.

---

## 10. Riesgos (Pre-Mortem)

| Supuesto Fallido | Impacto | Prob. | Mitigación | Owner |
|:---|:---|:---|:---|:---|
| Confusión suspensión vs estatus en reportes | Reportes inexactos | Media | `IsBlockedByBudget` explícito y documentado; no tocar `Status` | Backend |
| Catálogo sin tenant filter | Fuga entre clientes | Media | Índice único por `CustomerId` + filtro en query | Backend |
| Migración `DROP` en rollback | Pérdida datos | Baja | `Down` solo elimina columnas/tablas nuevas; documentar en protocolo migración | DBA |
| Duplicidad con TaskFollowUp | Deuda | Baja | Entidad OS separada por dominio; no acoplar a Tasks | Arquitectura |
| Seguimiento sin autor visible | Auditoría débil | Baja | `UserId` obligatorio + join `FullName` | Backend |
| Form actual complejo rompe validadores | Regresión | Media | Reusar `coherenceValidator` sin alterarlo; pruebas de formulario | Frontend |

---

## 11. Dependencias / Impactos

- **`ApplicationDbContext`** (shared): alta sensibilidad — agregar DbSets, no reordenar.
- **Migración EF**: requiere regeneración/orden respecto a últimas migraciones (`AddServiceOrderFolio`, `AddEvaluation...`).
- **`UpdateDataBase`** (Admin): nuevo método + endpoint + UI.
- **Frontend listado/form**: cambios visibles; verificar mobile (`DataViewMobile`).
- **Reportes PDF** (opcional): podría añadir marca de suspensión — fuera de alcance salvo solicitud.

---

## 12. Cierre Esperado

- Órdenes detenidas por presupuesto identificables y trazables sin alterar el estatus.
- Historial de seguimiento por orden de servicio con autor y fecha.
- Documentación del módulo actualizada (`README.md` del submódulo).
- Builds verdes y gates de convenciones en verde.
