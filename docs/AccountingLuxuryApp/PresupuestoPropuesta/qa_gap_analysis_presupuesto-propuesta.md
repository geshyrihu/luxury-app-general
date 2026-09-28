# QA Gap Analysis — Presupuesto Propuesta

**Modulo:** AccountingLuxuryApp / PresupuestoPropuesta
**Fecha:** 2026-09-16
**Tipo:** Auditoria punta a punta (QA + Arquitectura), protocolo `qa-punta-a-punta`
**Base rectora:** `conventions/CONVENTIONS.md`, `conventions/core/*`, `conventions/audit/*`, `conventions/backend/multipart-antiforgery.md`
**Estado:** REPORTE. No se implementa ninguna correccion sin aprobacion explicita.

## Alcance

Backend:
- `api/LuxuryApp.Application/Modules/AccountingLuxuryApp/PresupuestoPropuesta` (Endpoints, Interfaces, Services, DTOs, Mapping, Docs)
- Entidades `BudgetProposal`, `BudgetProposalItem`, `BudgetProposalItemHistory`, `BudgetProposalItemSupportFile`
- `Shared/SendEmailGlobal/PresupuestoPropuesta` (realtime) y `ApplicationDbContext` (relaciones/indices)

Frontend:
- `appsweb/angular/src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta`

Severidades segun `conventions/audit/audit-severity-model.md`.

## Modelo de datos observado (hecho verificable)

- `BudgetProposals`: indice solo en `CustomerId`. **Sin unique `(CustomerId, FiscalYear)`** (`ApplicationDbContextModelSnapshot.cs:1686`).
- `BudgetProposalItemHistory.BudgetProposalItemId` y `BudgetProposalItemSupportFile.BudgetProposalItemId`: FK con **`OnDelete(DeleteBehavior.Restrict)`** (`ApplicationDbContextModelSnapshot.cs:16962-16987`). No hay cascada.
- Solo `BudgetProposal` implementa `ITenantEntity`. `BudgetProposalItem`, `BudgetProposalItemHistory` y `BudgetProposalItemSupportFile` **no**. No existe query filter de tenant en `ApplicationDbContext` (solo soft-delete, `ApplicationDbContext.cs:3332-3356`).

---

## Matriz de hallazgos

| # | Proceso / Entidad | Vulnerabilidad | Causa raiz | Solucion propuesta | Severidad |
|---|---|---|---|---|---|
| H1 | Autorizacion / multi-tenant — todos los endpoints | IDOR / fuga cross-tenant. Endpoints resuelven por `itemId`/`proposalId`/`fileId` sin validar que pertenezcan al `CustomerId` del usuario. `GET ?customerId=` acepta cualquier cliente. | `BudgetProposalEndPoints.cs:14,19,24,29,34,39,44,49` y `BudgetProposalItemSupportEndpoints.cs:13,17,21,26` solo usan `.RequireAuthorization()`. Entidades hijas sin `ITenantEntity` y sin query filter global. Servicios no reciben ni comparan el tenant actual. | Filtrar/validar tenant en servicio (`item.BudgetProposal.CustomerId == currentUser.CustomerId` o equivalente) en `GetBudgetProposalItemAsync`, `UpdateProposalItemAsync`, `GetItemHistoryAsync`, `DeleteProposalItemAsync`, `GetFeeComparison*`, `AddAccounts*`, `GetAvailable*`, y los 4 de support. Opcional: marcar hijas `ITenantEntity` y evaluar query filter de tenant. | incumplimiento critico |
| H2 | `GetProposalsAsync` es un GET con escritura | Corrupcion de `TotalAmount` por concurrencia: `UPDATE ... TotalAmount = TotalAmount - {0}` se ejecuta en cada request concurrente que recalcula el mismo `itemsToDelete`; doble resta. | `BudgetProposalService.cs:76-97`. Lectura + escritura en un verbo GET no idempotente. Sin lock ni versionado. | Mover la limpieza/sincronizacion a un comando explicito (job o endpoint POST idempotente), o envolver en transaccion con concurrencia optimista (`RowVersion`). El GET no debe mutar. | incumplimiento critico |
| H3 | Alta de propuesta | Propuestas duplicadas por concurrencia. Doble click / dos requests simultaneos crean 2 filas para mismo `(CustomerId, FiscalYear)`. | No existe unique index (`snapshot:1686`); la validacion es solo app-level (`BudgetProposalService.cs:291-297` y creacion en `60-63 / 220`). | Agregar unique index `(CustomerId, FiscalYear)` + capturar `DbUpdateException` como `BusinessException` de conflicto. | incumplimiento critico |
| H4 | `DeleteProposalItemAsync` — integridad relacional | El borrado **siempre falla** si la partida tiene archivos de soporte: FK `Restrict` y el servicio no elimina las filas hijas. Ademas nunca borra el archivo fisico (orfandad en disco). | `BudgetProposalService.cs:756-770` elimina historial pero no `BudgetProposalFiles`; `snapshot:16981-16987` es `Restrict`. | Borrar primero `BudgetProposalFiles` (filas + archivos fisicos) y luego el item, dentro de transaccion; o bloquear borrado con `BusinessException` explicita si tiene soportes. | incumplimiento alto |
| H5 | `DeleteProposalItemAsync` | `NullReferenceException` -> 500 si la propuesta no existe (item huerfano). | `BudgetProposalService.cs:714-716` usa `FindAsync` sin null-check antes de `proposal.Status`. | Validar null y lanzar `BusinessException("PROPOSAL_NOT_FOUND",404)`. | incumplimiento alto |
| H6 | Realtime (SignalR) | Actualizacion en tiempo real **nunca llega**: el grupo del emisor y del receptor no coincide. | Backend emite al grupo `proposal-{customerId}-{proposal.FiscalYear}` (año objetivo, base+1) — `BudgetProposalService.cs:517` + `SendSignalRService.cs` group `proposal-...`; frontend se une/desune con `selectedFiscalYear` (año base) — `presupuesto-propuesta.ts:474-477,412-415` y `signalr.service.ts:joinProposalGroup`. | Unificar la clave de grupo (usar el año objetivo `response.fiscalYear` en el frontend) o incluir ambos años en el grupo. | incumplimiento alto |
| H7 | Integridad de totales / calculo | `ToDictionary(c => c.CodigoCuenta)` revienta con `ArgumentException` (500) si Aspel devuelve codigos duplicados. | `BudgetProposalService.cs:115` y `234`. | Agrupar/deduplicar antes (`GroupBy(...).ToDictionary(g => g.Key, g => g.First())`) o usar `TryAdd`. | deuda tecnica |
| H8 | Concurrencia de edicion | Lost update: `TotalAmount` se recalcula con read-modify-write (`proposal.TotalAmount = allItems.Sum(...)`) sin token de concurrencia; dos edits simultaneos se pisan. | `BudgetProposalService.cs:466-471`; entidades sin `RowVersion`/`ConcurrencyToken`. | Agregar `[Timestamp]`/`IsConcurrencyToken` a `BudgetProposal` y manejar `DbUpdateConcurrencyException`. | deuda tecnica |
| H9 | Validaciones espejo (front/backend) | Backend no valida `ProposedAmount`: acepta negativos, `NaN`/overflow, sin rango. Frontend tampoco (solo `Number(...)`). | `UpdateProposalItemDTO` sin `[Range]`; `BudgetProposalService.UpdateProposalItemAsync` asigna directo (`:463`). | Validar en backend (`[Range]`/FluentValidation, rechazar negativos y no finitos) y reflejar en el input del frontend. | incumplimiento alto |
| H10 | Validaciones espejo — filtros Extraordinarios/Proyectos | Logica duplicada y divergente: backend excluye por descripcion (`"Extraordinarios"`,`"Proyectos"`,... `BudgetProposalService.cs:40-47`), frontend por prefijo hardcodeado `605-`/`606-` (`presupuesto-propuesta.ts:460-465,778-787`). | Regla de negocio no centralizada; prefijos tenant-specific en codigo. | Exponer la clasificacion desde backend (flag en el DTO) y que el frontend filtre por ese flag, no por prefijo. | incumplimiento alto / riesgo de ruptura |
| H11 | Codigo muerto / tenant hardcodeado | `IsCuentaExtraordinaria` y `IsCuentaProyecto` con `Guid.Parse("...025/064/065")` no se usan en ningun flujo. | `BudgetProposalService.cs:984-1009`. | Eliminar (o migrar la regla a `BudgetAccountRule` si aun aplica). | deuda tecnica |
| H12 | Codigo muerto | `CreateProposalAsync` expuesto en interfaz pero sin endpoint que lo invoque. Frontend no lo usa. | `IBudgetProposalService.cs:12`; no hay ruta POST en `BudgetProposalEndPoints.cs`. | Retirar el metodo o publicarlo con endpoint + UI y validaciones. | deuda tecnica |
| H13 | DTO ignorado | `AddBudgetProposalItemSupportFilesAsync` ignora `DTO.ProviderName` y `DTO.Comment`: el usuario los envia y se descartan silenciosamente. | `BudgetProposalItemSupportService.cs:68-112` nunca aplica esos campos al item. | Aplicarlos al item en la misma operacion o quitarlos del DTO/UI. | deuda tecnica |
| H14 | CSRF / upload | `.DisableAntiforgery()` sin ticket de analisis documentado (requisito de la convencion). | `BudgetProposalItemSupportEndpoints.cs:24`. | Verificar auth stateless Bearer y documentar ticket en el codigo (o reactivar antiforgery). | incumplimiento alto (gobernanza) |
| H15 | Eliminacion de archivo de soporte | Borrado por `fileId` sin scope de tenant (mismo H1) y borra archivo fisico sin confirmar propiedad. | `BudgetProposalItemSupportService.cs:114-138`. | Validar tenant y registrar en auditoria antes de borrar. | incumplimiento alto |
| H16 | `budget-rule-list` DELETE | Se usa la URL `byCustomerId(id)` (parametro customerId) para eliminar una fila por su `id`. | `budget-rule-list.ts:115-120` + `contabilidad.endpoints.ts` (`BudgetAccountRules.byCustomerId`). | Usar endpoint DELETE por regla (`budget-account-rules/{id}`) o corregir el contrato. | incumplimiento alto |
| H17 | Contrato frontend/backend | Drift de tipos: `EProposalStatus` = `Draft/Approved/Rejected` pero backend serializa display names (`"Borrador"`,`"Enviado"`,...). `justification` sigue en `UpdateProposalItemDTO`/historial del model aunque ya no existe en backend. | `budget-proposal.model.ts:14-30,90-98` vs `Shared/Enums/ProposalStatus.cs`. | Alinear el model TS con el DTO real (o exponer value + displayName). | deuda tecnica |
| H18 | `GetBudgetProposalItemAsync` | Devuelve `SuccessResult(null)` con 200 en lugar de `404`. | `BudgetProposalService.cs:396-399`. | Lanzar `BusinessException(...,404)` (consistente con el resto del servicio). | mejora recomendada |
| H19 | Manejo de errores frontend | `updateProposalItem` no tiene `.catch`: en error no hay feedback y el valor optimista queda inconsistente; `loading` es un signal compartido que se apaga con operaciones concurrentes. | `presupuesto-propuesta.ts:1095-1149`; `fee-comparison-by-fija.ts:58-68` sin `catch`. | Agregar manejo de error + revertir valor; separar flags de carga (o contador). | mejora recomendada |
| H20 | Seguridad de render | `[innerHTML]` con HTML generado por IA sin sanitizar. | `budget-audit-dialog.html:26`. | Sanitizar/whitelist o renderizar como texto/markdown controlado. | mejora recomendada |
| H21 | Estado / maquina de estados | `ProposalStatus` tiene 6 estados pero solo `Draft` se usa; no hay endpoint de submit/aprobar/rechazar. El guard de edicion (`!= Draft`) queda sin flujo que lo active. | `BudgetProposalService.cs:441,629,716`; sin rutas de transicion. | Definir y publicar la maquina de estados (con validacion de transiciones en backend) o documentar que solo existe Borrador. | incumplimiento alto (funcional incompleto) |
| H22 | Performance | 3 llamadas a Aspel por request en `GetProposalsAsync` (`:33`,`:107`,`:230`) mas enriquecimiento item-by-item. | Sin cache ni consolidacion. | Consolidar a una sola consulta y cachear por `(customerId, year)`. | mejora recomendada |
| H23 | Detach manual de EF | Manipulacion fragil: `Entry(...).State = Detached` seguido de `SaveChanges` y luego mutacion de hijos (`:90-97`, `689-696`). Rompe tracking y dificulta auditoria/concurrencia. | Patron ad-hoc en `GetProposalsAsync`/`AddAccountsToProposalAsync`. | Reemplazar por operaciones EF normales en transaccion; evitar `ExecuteSqlRaw` + detach. | deuda tecnica |
| H24 | Testing | Sin pruebas backend para `BudgetProposalService`/`BudgetProposalItemSupportService`; frontend solo `excel-export.service.spec.ts`. | No se crearon tests al implementar el modulo. | Agregar tests de servicio (guardas de estado, borrado con archivos, concurrencia) segun `conventions/CONVENTIONS_TESTING.md`. | deuda tecnica |
| H25 | Encoding | 2 secuencias mojibake de emoji en `BudgetProposalService.cs:39,89` (`Ã°Å¸š«`, `Ã¢š™`). El scanner `scan-mojibake.mjs` las detecta en debug pero las reporta como 0. | Bytes doble-codificados; gap del scanner para emoji. | Normalizar a emoji UTF-8 o quitarlas; ampliar el scanner para emoji mojibake. | deuda tecnica |
| H26 | Nomenclatura / gobernanza | Parametros DTO en PascalCase (`DTO`), archivos `...EndPoints.cs` vs `...Endpoints.cs`, comentarios XML genericos autogenerados ("Servicio o componente relacionado con fin."), mensajes en ingles en backend. | Generacion automatica/plantillas; anti-spanlish. | Alinear a `conventions/nomenclatura-convenciones.md` y `GOVERNANCE-ANTI-SPANGLISH-RULES.md`. | mejora recomendada |

---

## Verificaciones de la skill (stress test)

1. **Transiciones de estado:** existe guarda `Status != Draft` en Update/Add/Delete (`:441,:629,:716`), pero ningun flujo saca del borrador (H21). No hay riesgo de editar algo "cerrado" porque no hay cierre; el riesgo es funcional (no se puede aprobar/cerrar).
2. **Duplicidad y concurrencia:** sin unique index `(CustomerId, FiscalYear)` ni `(BudgetProposalId, AccountNumber)` (H3); sin token de concurrencia (H8); GET que escribe (H2). **Riesgo material.**
3. **Integridad relacional:** FK `Restrict` sin cascada y sin borrado de hijos en `DeleteProposalItemAsync` => borrado roto / archivos fisicos huerfanos (H4, H15). Borrar `BudgetProposal` no eliminaria items (sin endpoint hoy).
4. **Validaciones espejo:** backend no valida montos ni negativos (H9); filtros Extraordinarios/Proyectos divergentes (H10). **No confiar en la UI.**

## Hallazgos que requieren decision/verificacion antes de codigo

- H1: confirmar si existe un filtro de tenant a nivel de middleware/claim y si `ICurrentUserService` expone `CustomerId`. Si no existe, es bloqueante de produccion.
- H14: confirmar esquema de autenticacion (Bearer stateless vs cookies) y localizar el ticket de seguridad exigido por la convencion.
- H21: confirmar con negocio la maquina de estados real de la propuesta.

## Proximos pasos (no ejecutados)

1. Aprobar este reporte y priorizar H1–H6 (criticos/altos de seguridad y datos).
2. Para cada fix aprobado: plan por fases + checklist (`conventions/core/workflow-por-tipo-de-tarea.md`) y prueba de regresion.
3. Re-verificar con `node scripts/scan-mojibake.mjs` y pruebas de servicio del modulo.

> Sin aprobacion explicita no se modifica ningun archivo de codigo.

---

## Estado de remediacion (2026-09-16)

Plan aprobado y ejecutado parcialmente: `20260916-remediacion-accounting-presupuesto-propuesta.md`.

- **H1** ✅ guard tenant con bypass de 6 roles (`SuperUsuario`, `Direccion`, `GerenteMantenimiento`, `SupervisionOperativa`, `Contador`, `RecursosHumanos`).
- **H2** ✅ recalculo idempotente del total (ya no resta acumulativa en GET).
- **H3** 🟡 unique index configurado en EF + manejo de conflicto; migracion pendiente (Tech Lead).
- **H4/H5** ✅ borrado de item con hijos/archivos en transaccion + null-check.
- **H6** ✅ grupo realtime corregido en frontend.
- **H7** ✅ dedupe de catalogo Aspel. **H9** ✅ validacion de monto. **H11/H13/H25** ✅ (parcial H25).
- **Nuevo** ✅ finalizacion de `BudgetProposalItem` (flag + usuario + fecha) con endpoint y UI; no bloquea edicion.
- Diferidos: H8, H16, H18, H19, H20, H22, H23, H24, H26 y migracion/tests.

Detalle y verificaciones en el plan (seccion 11).
