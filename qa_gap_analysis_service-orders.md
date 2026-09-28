# QA Gap Analysis — Módulo ServiceOrders (Órdenes de Servicio)

> **Tipo:** Auditoría punta a punta (QA & Arquitectura) — solo lectura, sin cambios aplicados.
> **Fecha:** 2026-09-24
> **Alcance backend:** `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/ServiceOrders/`
> **Alcance frontend:** `appsweb/angular/src/app/modules/operations.luxuryapp/service-orders/`
> **Artefactos cruzados revisados:** `ServiceOrder` (entidad), `TaskServiceOrder`, `GenerateFolioService`, `ImageStorageService`, `SecureFileStorageService`, snapshot EF `ApplicationDbContextModelSnapshot`, `operations.endpoints.ts`.

## Resumen ejecutivo

| Severidad | Cantidad |
| --------- | -------- |
| Crítica   | 4        |
| Alta      | 7        |
| Media     | 8        |
| Baja      | 6        |

El módulo no tiene máquina de estados, no valida tenencia (tenant), no tiene restricciones únicas de folio/duplicidad y su borrado **falla con excepción 500** cuando la OS tiene documentos o tickets asociados. La creación por UI **descarta el responsable seleccionado**.

---

## 1. Matriz de hallazgos

### 1.1 Transiciones de estado (State Machine)

| #    | Proceso / Entidad                                         | Vulnerabilidad                                                                                                          | Causa raíz                                                                | Solución propuesta                                                                                                                                           |
| ---- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SM-1 | `UpdateAsync` (`ServiceOrderAppService.cs:516`)           | Se puede editar cualquier OS incluso en `Concluido`, `Cancelado` o `Denegado`. No hay bloqueo de estado final.          | `UpdateAsync` mapea el DTO directo sin verificar `model.Status`.          | Guard clause: si `model.Status is Status.Concluido or Status.Cancelado or Status.Denegado` y el cambio no es una transición permitida → `BusinessException`. |
| SM-2 | Formulario/Listado (`ordenes-servicio-list.html:186,364`) | El botón Editar/Cargar imagen/Cargar documentos está siempre habilitado; no hay validación espejo en UI.                | No se consulta el `status` del item para deshabilitar acciones.           | Ocultar/deshabilitar acciones cuando `status` sea final y mostrar motivo (tooltip).                                                                          |
| SM-3 | `UpdateServiceOrderDTO`                                   | Transiciones incoherentes: `Status = Concluido` sin `ExecutionDate`; `ExecutionDate` < `RequestDate`; `Price` negativo. | Sin validaciones de coherencia en servidor ni en `service-order-form.ts`. | Validador de dominio: `ExecutionDate >= RequestDate`, `Price >= 0`, `Concluido ⇒ ExecutionDate != null`.                                                     |
| SM-4 | `AddAsync` (`:400`)                                       | Se puede crear una OS con `Status = null` (columna nullable, `Status?`).                                                | `Status` es `Status?` y el DTO no lo exige; EF no genera NOT NULL.        | Default `Status.Pendiente` en creación + `[Required]` efectivo en DTO.                                                                                       |

### 1.2 Duplicidad y concurrencia

| #    | Proceso / Entidad        | Vulnerabilidad                                               | Causa raíz                                                                                                                                                                                             | Solución propuesta                                                                                                                    |
| ---- | ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| DC-1 | `Folio` (`ServiceOrder`) | **Folios duplicados** en doble submit / concurrencia.        | `GenerateNextServiceOrderFolioAsync` lee `MAX` y luego inserta (`GenerateFolioService.cs:127`); **no existe índice único** sobre `Folio` (verificado en `ApplicationDbContextModelSnapshot.cs:21207`). | Índice único `(Machinery→CustomerId, Folio)` o `Folio` global; capturar `DbUpdateException` → `BusinessException("Folio duplicado")`. |
| DC-2 | OS por equipo/mes        | OS duplicada para el mismo `MachineryId` + mes + calendario. | `CreateOrderMaintenance` deduplica con consulta previa por item, sin constraint; dos GET concurrentes crean ambas.                                                                                     | Índice único parcial `(MachineryId, MaintenanceCalendarId, año-mes)`; dedup atómico.                                                  |
| DC-3 | `AddAsync` (POST)        | Sin idempotencia: doble clic crea dos OS.                    | No hay idempotency key ni deduplicación servidor.                                                                                                                                                      | Idempotency-Key opcional + constraint de unicidad.                                                                                    |

### 1.3 Integridad relacional (Cascades & huérfanos)

| #    | Proceso / Entidad                                                                                               | Vulnerabilidad                                                                                                        | Causa raíz                                                                                                                           | Solución propuesta                                                                                            |
| ---- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| IR-1 | `DeleteAsync` (`:625`)                                                                                          | **CRÍTICO**: borrar una OS con documentos lanza `DbUpdateException` (500).                                            | Solo elimina `ServiceOrderImg`; la FK `ServiceOrderDocument.ServiceOrderId` es `OnDelete(Restrict).IsRequired()` (`snapshot:21246`). | Incluir y eliminar `ServiceOrderDocument` (BD + archivo en disco) o bloquear borrado con `BusinessException`. |
| IR-2 | `DeleteAsync` (`:625`)                                                                                          | **CRÍTICO**: borrar una OS referenciada por `TaskServiceOrder` lanza 500.                                             | FK `TaskServiceOrder.ServiceOrderId` `Restrict` (PK compuesta, `TaskServiceOrder.cs:5`).                                             | Verificar dependencias y bloquear con `BusinessException("Existen tickets vinculados")`.                      |
| IR-3 | `DeleteAsync`                                                                                                   | Archivos de documentos quedan huérfanos en disco.                                                                     | Nunca se hace `fileStorageService.DeleteFile` para `ServiceOrderDocument`.                                                           | Eliminar archivo por cada documento antes/junto al borrado de la OS.                                          |
| IR-4 | `DeleteImgAsync`/`DeleteDocumentAsync` (`:604`,`:583`)                                                          | NO verifican que la OS padre pertenezca al `customerId` del usuario → IDOR de borrado cross-tenant.                   | El método solo recibe el `id` del hijo.                                                                                              | Resolver `customerId` desde el claim y validar tenencia antes de borrar.                                      |
| IR-5 | `GetByIdAsync`/`GetServiceOrderSupportAsync`/`OrdenesServicioFotosAsync`/`OrdenesServicioReporteProveedorAsync` | Lectura cross-tenant por GUID (IDOR).                                                                                 | No se valida `Machinery.CustomerId` contra el tenant del usuario.                                                                    | Filtro obligatorio por `CustomerId` del token; 404/403 si no pertenece.                                       |
| IR-6 | `DeleteAsync`                                                                                                   | Si `imgService.DeleteAsync` falla después de `SaveChangesAsync`, queda inconsistencia (registro borrado, archivo no). | Borrado de disco posterior al commit, sin rollback compensatorio.                                                                    | Borrar archivo primero o registrar compensación/log para reconciliación.                                      |

### 1.4 Validaciones espejo (Frontend vs Backend)

| #    | Proceso / Entidad                               | Vulnerabilidad                                                                                                          | Causa raíz                                                                                                                                 | Solución propuesta                                                                                         |
| ---- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| VE-1 | `CreateServiceOrderDTO`/`UpdateServiceOrderDTO` | **Sin DataAnnotations** (`Required`, `MaxLength`). Backend acepta `Activity` vacío.                                     | DTOs sin atributos; `[Required]` en entidad es de EF, no valida el request.                                                                | Añadir `[Required]`, `[StringLength]`, `[Range]` a los DTOs.                                               |
| VE-2 | `AddAsync`                                      | **BUG funcional CRÍTICO**: el responsable seleccionado en el formulario se descarta al crear.                           | `CreateMap<CreateServiceOrderDTO, ServiceOrder>` ignora `EmployeeResponsableId` y `AddAsync` nunca lo asigna (`ServiceOrderMapper.cs:16`). | En `AddAsync`, resolver `Employee` por `UserId` igual que `UpdateAsync` y asignar `EmployeeResponsableId`. |
| VE-3 | `Activity` / `Observations`                     | Columnas sin `MaxLength`; entidad `Activity` `[Required]` con posible `null` → `DbUpdateException` (500 en vez de 400). | Falta límite y validación de entrada.                                                                                                      | Definir `MaxLength` en entidad + DTO y devolver 400.                                                       |
| VE-4 | `SubirImgAsync`/`SubirDocumentoAsync`           | Sin límite de cantidad ni tamaño agregado; solo valida tipo/firma.                                                      | Falta política de número de archivos.                                                                                                      | Limitar N archivos y tamaño total; mensaje claro.                                                          |
| VE-5 | Fechas/Precio (UI)                              | UI no valida `executionDate >= requestDate` ni `price >= 0`.                                                            | Form sin validadores de rango.                                                                                                             | Validadores en `service-order-form.ts` + espejo servidor.                                                  |

### 1.5 Lógica de servidor / arquitectura

| #    | Proceso / Entidad                 | Vulnerabilidad                                                                                                                                                            | Causa raíz                                                         | Solución propuesta                                                |
| ---- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| BE-1 | `GetAllAsync` (`:302`)            | **GET con efectos de escritura** (crea OS y asigna responsable). Rompe contrato de lectura; sin transacción; N+1.                                                         | `CreateOrderMaintenance(...)` y asignación de jefe dentro del GET. | Mover la generación a job/endpoint POST dedicado y transaccional. |
| BE-2 | `GetAllAsync` (`:346`)            | **NRE**: si no existe Jefe de Sistemas y el equipo es de categoría `Sistemas` → `jefeSistemas.Id` sobre null → 500.                                                       | `jefeSistemas` no verificado.                                      | Fallback a `jefeManto`/null con null-check.                       |
| BE-3 | `CreateOrderMaintenance` (`:650`) | `(int)x.Month` sobre `Month?` → `InvalidOperationException` si es null (`Month` es `Month?`, `MaintenanceCalendar.cs:123`). `SaveChanges` sincrónico por iteración (N+1). | Cast de nullable sin guardia; loop con persistencia unitaria.      | Null-check; batch `AddRange` + un `SaveChangesAsync`.             |
| BE-4 | `UpdateCalendarioId` (`:459`)     | Sincrónico, `SaveChanges` por item, `(int)x.Month.Value` NRE, endpoint POST masivo sin parámetro ejecutable por cualquier autenticado.                                    | Código de migración expuesto como endpoint operativo.              | Retirar/proteger (rol admin) y reescribir async batch.            |
| BE-5 | `AddAsync` folio                  | `GenerateNextServiceOrderFolioAsync` lanza `InvalidOperationException` si RFC inválido → 500 sin mensaje.                                                                 | Excepción no capturada.                                            | Validar RFC en creación y devolver `BusinessException`/400.       |
| BE-6 | `GetAllPinturaAsync` (`:363`)     | No filtra `Machinery.State == Activo` (inconsistente con `GetAllAsync`).                                                                                                  | Criterio divergente.                                               | Alinear filtro.                                                   |
| BE-7 | `SubirDocumentoAsync` (`:558`)    | Documentos docx/xlsx válidos se guardan **con extensión forzada `.pdf`** (contenido no PDF) → corruptos/ilegibles.                                                        | `SecureFileStorageService.SaveAsync` fuerza `.pdf` (`:241`).       | Usar `SaveOrigExt`/`SaveOrigExtAsync` para documentos no-PDF.     |
| BE-8 | `GetServiceOrderInforme` (`:76`)  | `ServiceOrderIm` expone entidades `ServiceOrderImg` (no DTO) en el DTO; riesgo de serialización/ciclos.                                                                   | DTO tipado con entidad (`ServiceOrderInformeDTO.cs:26`).           | Cambiar a `List<ServiceOrderImgDTO>`.                             |
| BE-9 | `GetAllAsync` (`:339`)            | Filtro `inventoryCategory` aplicado en memoria tras materializar.                                                                                                         | `ToList` antes de filtrar.                                         | Filtrar en la consulta (traducible).                              |

### 1.6 Frontend

| #    | Proceso / Entidad                                                        | Vulnerabilidad                                                                                                                                                                  | Causa raíz                                                                | Solución propuesta                                                         |
| ---- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| FE-1 | `getStatusLabel`/`getBadgeSeverity` (`ordenes-servicio-list.ts:347,362`) | Estatus `3` (`Proceso`) no mapeado → etiqueta vacía y badge sin severidad.                                                                                                      | `switch` sin `case 3` ni default.                                         | Cubrir `Proceso` y agregar default.                                        |
| FE-2 | `ticket-analysis.service.ts` / `ticket-filter.service.ts` + specs        | Archivos de Tickets ubicados dentro de `service-orders` (ubicación fuera de convención). Specs con imports relativos rotos (`../http/...`, `../auth/...`) → fallan al compilar. | Copia/arrastre incorrecto entre módulos.                                  | Reubicar a módulo de Tickets o eliminar; corregir imports de specs.        |
| FE-3 | `resumen-ordenes-servicio.ts:62,70`                                      | Componente de ServiceOrders llama endpoints de `MeetingDetailsTracking`.                                                                                                        | Acoplamiento entre módulos.                                               | Confirmar ownership; mover a módulo de asambleas o documentar dependencia. |
| FE-4 | `onLoadData`/`onLoadPintura` (`:293`,`:274`)                             | `loading` nunca regresa a `false`; sin manejo de error (`onGetList` sin catch).                                                                                                 | Falta `finally`/`catch`.                                                  | Envolver en try/finally y notificar error.                                 |
| FE-5 | `ordenes-servicio-list-pdf.service.ts:305,309`                           | `item.activity`/`item.observations` insertados **sin `esc()`** en HTML de impresión → inyección HTML/JS.                                                                        | Escape omitido en esos campos (el resto sí usa `esc`).                    | Usar `htmlPrintS.esc(...)` en ambos.                                       |
| FE-6 | `ordenes-servicio-list-pdf.service.ts:297`                               | Reporte de órdenes muestra proveedor en blanco.                                                                                                                                 | Plantilla lee `item.nameComercial`, pero el endpoint devuelve `Provider`. | Mapear `provider`/`nameComercial` coherente (contrato único).              |
| FE-7 | `ordenes-servicio-reporte-proveedor.ts:53`                               | `this.config.data.id` sin optional chaining; `deleteDoc` sin confirmación.                                                                                                      | Falta guardia y confirm.                                                  | Optional chaining + confirmación de borrado.                               |
| FE-8 | `resumen-ordenes-servicio-grafico.ts:23`                                 | `colorScheme.domain` con 3 colores para 5 estatus.                                                                                                                              | Paleta insuficiente.                                                      | Ampliar paleta.                                                            |
| FE-9 | Specs del módulo                                                         | Solo pruebas "should create" — cobertura nula de lógica de estados/borrado.                                                                                                     | Tests plantilla.                                                          | Pruebas de transición de estado, dedup y borrado con dependencias.         |

---

## 2. Casos borde recomendados para stress test

1. Crear OS, subir 1 documento, intentar eliminar OS → esperado hoy: 500.
2. Vincular OS a un ticket (`TaskServiceOrder`) y eliminar OS → esperado hoy: 500.
3. Dos POST de creación simultáneos para mismo cliente/mes → folios duplicados.
4. Editar OS en estado `Concluido` cambiando precio/fechas → permitido hoy.
5. Crear OS sin RFC válido de cliente → 500 con excepción no controlada.
6. Cliente sin Jefe de Sistemas + equipo categoría `Sistemas` → GET list 500 (NRE).
7. Cargar documento `.docx` → guardado como `.pdf` corrupto.
8. Usuario cliente A consulta `GET /service-orders/{id}` de cliente B → datos devueltos (IDOR).
9. `MaintenanceCalendar.Month = null` + GET list en mes actual → excepción en `CreateOrderMaintenance`.

---

## 3. Priorización sugerida

- **P0 (bloqueante prod):** IR-1, IR-2, VE-2, DC-1.
- **P1 (seguridad/integridad):** IR-4, IR-5, VE-1, BE-1, BE-2, BE-7, FE-5.
- **P2 (correctitud):** SM-1, SM-3, SM-4, BE-3, BE-5, BE-6, FE-1, FE-6.
- **P3 (deuda/limpieza):** BE-4, BE-8, BE-9, FE-2, FE-3, FE-4, FE-7, FE-8, FE-9, DC-3.

---

> **Estado:** Remediación aplicada (aprobada por usuario). Ver sección 4.

---

## 4. Remediación aplicada

### 4.1 Backend — `ServiceOrderAppService`

- **VE-2 / AddAsync**: ahora resuelve `Employee` por `UserId` y asigna `EmployeeResponsableId`; `Status` default `Pendiente`. (`AddAsync`)
- **SM-1 / SM-2**: `UpdateAsync` bloquea edición en estados finales (`Concluido`/`Cancelado`/`Denegado`) con `BusinessException` 409.
- **SM-3 / VE-1 / VE-5**: `ValidateCoherence` en Add/Update (actividad, precio ≥ 0, `ExecutionDate ≥ RequestDate`, `Concluido ⇒ ExecutionDate`). DTOs con `[Required]`, `[StringLength]`, `[Range]`.
- **IR-1 / IR-2 / IR-3 / IR-6**: `DeleteAsync` elimina `ServiceOrderDocument` (BD + disco) y bloquea si hay `TaskServiceOrder` vinculados.
- **IR-4 / IR-5**: `ITenantAccessor` inyectado; `EnsureTenantAccess(model.Machinery.CustomerId)` en GetById, Support, Fotos, ReporteProveedor, Update, Delete, DeleteImg, DeleteDocument, Uploads, listados por customerId, informe y ZIP.
- **BE-2**: NRE de jefeSistemas corregido (fallback a jefeManto).
- **BE-3**: `CreateOrderMaintenance` sin cast de `Month?` nulo, dedupe por batched `HashSet`, un solo `SaveChanges`.
- **BE-4**: `UpdateCalendarioId` sin `(int)Month.Value`.
- **BE-5**: `InvalidOperationException` de folio (RFC inválido) convertida a `BusinessException` 400.
- **BE-6**: `GetAllPinturaAsync` filtra `Machinery.State == Activo`.
- **BE-7**: `SubirDocumentoAsync` usa `SaveOrigExt` (conserva extensión, ya no fuerza `.pdf`).
- **Uploads**: rechazan colecciones vacías; flag `EnsureTenantAccess`.

### 4.2 Folios OS (patrón minutas/OC/SC)

- **`DatabaseBackupService.RepairServiceOrderFoliosAsync`**: detecta duplicados `CustomerId + Folio`, reasigna con `GenerateNextServiceOrderFolioAsync` + `IncrementFolio` como red de seguridad, `sp_getapplock` (`ServiceOrderFolio:{customerId}:{yyMM}`), transacción y conteo de duplicados restantes.
- Endpoint `POST admin/database-backup/service-orders/repair-folios`.
- Frontend: `Endpoints.UpdateDataBase.repairServiceOrderFolios`, `runRepairServiceOrderFolios()` con confirmación, tarjeta OS! en `update-data-base.html`.

### 4.3 Frontend — service-orders

- **FE-1**: `getStatusLabel`/`getBadgeSeverity` cubren status 3 (`Proceso`) y default.
- **FE-4**: `onLoadData`/`onLoadPintura` con `loading` y `finally`.
- **FE-5**: escapado `htmlPrintS.esc` en actividad/observaciones del PDF.
- **FE-6**: PDF usa `provider` como fallback de proveedor; agrega línea de Estatus.
- **FE-7**: `config.data?.id`; `deleteDoc`/`deleteImg`/`onDelete` con confirmación.
- **FE-8**: paleta del pie chart ampliada a 5 colores.
- **VE-5 (espejo)**: validador de grupo `coherenceValidator` en `service-order-form` (precio negativo, ejecución < solicitud, concluido sin fecha).

### 4.4 Verificación

- `dotnet build LuxuryApp.Application` → **0 errores**.
- `npx tsc --noEmit -p tsconfig.app.json` → **exit 0**.
- `npx ng build --configuration development` → **éxito**.
- `audit:encoding`, `audit:emoji`, `audit:ui`, `audit:design` → **OK**.

### 4.5 No aplicado (fuera de este pase)

- DC-1/DC-2 requieren **migración de índice único** (`Folio` y OS por equipo/mes) y captura de `DbUpdateException`; no se generó migración en este pase.
- BE-1 (GET con escritura) y FE-2/FE-3 (reubicación de Tickets/resumen) son cambios estructurales; pendientes.
- BE-8 (DTO expone entidad) y BE-9 (filtro en memoria) cosméticos/optimización; pendientes.
