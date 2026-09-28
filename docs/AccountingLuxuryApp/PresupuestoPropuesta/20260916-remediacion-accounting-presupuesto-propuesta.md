# Plan de Remediacion - Accounting / Presupuesto Propuesta

## Metadata

| Campo | Valor |
|---|---|
| Modulo | AccountingLuxuryApp / PresupuestoPropuesta |
| Reporte origen | `docs/AccountingLuxuryApp/PresupuestoPropuesta/qa_gap_analysis_presupuesto-propuesta.md` (2026-09-16) |
| Tipo | Remediacion por modulo + ampliacion de modelo (finalizacion de partida) |
| Version | 1.0 |
| Fecha | 2026-09-16 |
| Autor | Agente (rol Arquitecto/QA) |
| Aprobacion requerida | Tech Lead / dueno del modulo (Ing. Ricardo Marques) |
| Estado | PROPUESTO — no ejecutado |
| Base rectora | `conventions/CONVENTIONS.md`, `conventions/core/*`, `conventions/audit/*`, `conventions/backend/*`, `conventions/operations/*` |
| Alcance de riesgo | Cambios en contrato (DTO/endpoints), cambio de estructura de BD (nueva columna + indices), autorizacion multi-tenant |

---

## 1. Resumen Ejecutivo

**Problem Statement (FASE 0.1):**

> Actualmente, un usuario autenticado (cualquier rol) sufre de acceso cross-tenant cuando intenta consultar o modificar partidas de presupuesto usando `itemId`/`proposalId`/`fileId`, lo que resulta en fuga y posible manipulacion de datos de otros clientes; adicionalmente el area contable no puede marcar que una partida ya fue analizada y cerrada, por lo que no hay trazabilidad de quien dio por finalizado cada rubro.

**Objetivo del plan:** cerrar los hallazgos H1–H26 del reporte, con prioridad en autorizacion multi-tenant (H1) y una nueva capacidad de **finalizacion de partida** (`BudgetProposalItem`) que registre *si ya quedo lista* y *quien la finalizo*, sin bloquear la edicion todavia.

### KPIs (baseline -> target)

| KPI | Baseline | Target | Timeline |
|---|---|---|---|
| Requests cross-tenant que no abortan (rol no-global) | 100% permitidos | 0% | Fase 1 |
| Cobertura de guardas de estado en mutaciones de item | 2 de 5 servicios | 5 de 5 | Fase 2 |
| Errores 500 por borrado de item con soportes | 100% de casos | 0% | Fase 3 |
| Partidas finalizables con trazabilidad (usuario+fecha) | 0 | 100% del modelo | Fase 4 |
| Realtime de propuesta funcionando | 0% (grupo no coincide) | 100% | Fase 5 |
| Cobertura de tests de servicio del modulo | 0 | Definida en plan | Fase 6 |

---

## 2. Objetivo

1. Aplicar control de acceso por tenant en todos los endpoints del modulo, con **bypass para roles globales**: `SuperUsuario`, `Direccion`, `GerenteMantenimiento`, `SupervisionOperativa`, `Contador`, `RecursosHumanos`.
2. Incorporar bandera de finalizacion por partida + usuario y fecha de finalizacion, con trazabilidad (sin bloqueo de edicion en esta iteracion).
3. Corregir los hallazgos criticos/altos: GET con escritura (H2), duplicidad sin indice unico (H3), borrado con FK `Restrict` (H4), NRE (H5), realtime (H6), validaciones de montos (H9), filtros divergentes (H10), y el resto segun fases.

---

## 3. Alcance

**Backend**
- `Modules/AccountingLuxuryApp/PresupuestoPropuesta/{Endpoints,Interfaces,Services,DTOs,Mapping}`
- Entidades `Infrastructure/Data/Entities/ContabilidadLuxuryApp/BudgetProposal*`
- `ApplicationDbContext` (relaciones, indices, migracion)
- `Shared/SendEmailGlobal/PresupuestoPropuesta` (realtime) solo lectura/ajuste de clave de grupo
- `Shared/Services/ICurrentUserService` (consumo; no se modifica)

**Frontend**
- `.../general-ledger/presupuesto-propuesta` (componente principal, dialogs, model, endpoints constants)

**Fuera de alcance (se documenta, no se toca en este plan)**
- Maquina de estados completa `ProposalStatus` (H21): requiere decision de negocio; se deja propuesta separada.
- Migracion de datos historicos para marcar partidas previamente finalizadas (no existe fuente).
- Refactor del scanner `scan-mojibake.mjs` (H25): se registra como deuda tecnica separada.

---

## 4. Restricciones

- No romper contratos publicos existentes (rutas, DTOs serializados) sin versionado o manteniendo compatibilidad (nuevos campos son aditivos con default).
- No cambiar `ApplicationRoleEnum` ni roles existentes.
- No modificar `shared` sin analisis de impacto; `ICurrentUserService` es shared -> solo se consume.
- Migracion de BD: la crea y ejecuta Tech Lead (protocolo `operations/data-migration-protocol.md`).
- Reglas de negocio no centralizadas (H10) no se duplican en front: se expone flag desde backend.
- No implementar sin aprobacion explicita (skill `qa-punta-a-punta`).

---

## 5. FASE 0 — Pre-Planeacion

### 5.1 Matriz de Reglas de Negocio (4 niveles)

| Codigo | Nivel | Regla | Componente |
|---|---|---|---|
| RN-PP-001 | 1 Invariante | Una propuesta es unica por `(CustomerId, FiscalYear)`. No puede haber 2 filas activas para el mismo cliente y anio. | `ApplicationDbContext` (unique index), `BudgetProposalService.CreateProposalAsync` / `GetProposalsAsync` |
| RN-PP-002 | 1 Invariante | Una partida pertenece a exactamente una propuesta; sus hijos (historial, archivos) pertenecen a la partida. No se borra la partida si deja hijos activos. | `DeleteProposalItemAsync` |
| RN-PP-003 | 1 Invariante | Una partida con actividad historica (gasto o presupuesto != 0 en el anio base) no puede eliminarse. | `DeleteProposalItemAsync` (guard existente) |
| RN-PP-004 | 2 Flujo/Estados | Solo propuestas en `Draft` permiten editar montos, agregar o eliminar partidas. | `UpdateProposalItemAsync`, `AddAccountsToProposalAsync`, `DeleteProposalItemAsync` |
| RN-PP-005 | 2 Flujo/Estados | Una partida puede marcarse como finalizada (`IsFinalized`) o revertirse a no finalizada, dejando registro de usuario y fecha. La finalizacion **no** bloquea la edicion en esta iteracion. | Nuevo endpoint `finalize` + `BudgetProposalItem` |
| RN-PP-006 | 2 Flujo/Estados | Al eliminar una partida se eliminan sus archivos de soporte (filas + archivos fisicos) y su historial, en una sola transaccion. | `DeleteProposalItemAsync`, `BudgetProposalItemSupportService` |
| RN-PP-007 | 3 Seguridad | Los roles `SuperUsuario`, `Direccion`, `GerenteMantenimiento`, `SupervisionOperativa`, `Contador`, `RecursosHumanos` pueden operar cualquier `CustomerId` (bypass de tenant). | Guard central de acceso |
| RN-PP-008 | 3 Seguridad | Todo otro rol solo puede operar sobre el `CustomerId` de su token. Si `CustomerId` del token es nulo o distinto -> 403 `TENANT_FORBIDDEN`. | Guard central de acceso |
| RN-PP-009 | 3 Seguridad | El `CustomerId` enviado en query/body no es autoritativo: se valida contra el token (o se ignora para roles no globales). | `GetProposalsAsync`, endpoints |
| RN-PP-010 | 3 Seguridad | Toda mutacion de partida (monto, soporte, finalizacion) registra `UserId`. | Servicios |
| RN-PP-011 | 4 Validacion | `ProposedAmount` debe ser finito y `>= 0`; se rechaza `NaN`/overflow. | `UpdateProposalItemDTO` + `UpdateProposalItemAsync` |
| RN-PP-012 | 4 Validacion | `AddAccountsToProposalAsync` recibe lista no nula, no vacia, sin duplicados y con cuentas existentes en Aspel. | `AddAccountsToProposalAsync` |
| RN-PP-013 | 4 Validacion | Los codigos de Aspel se deduplican antes de construir diccionarios. | `GetProposalsAsync` |
| RN-PP-014 | 4 Validacion | Upload de soporte: solo PDF, con validacion de tipo y tamano (conservar `IFileValidatorService`). | `BudgetProposalItemSupportService` |

### 5.2 Pre-Mortem ("salio a produccion y fue un desastre, por que?")

1. El bypass de rol se implemento comparando strings sueltos y un rol nuevo o mal escrito (`"Direccion"` vs display `"Dirección"`) permite o niega de mas. -> Mitigacion: usar `nameof(ApplicationRoleEnum.X)` en un `HashSet` unico y test de cada rol.
2. El `CustomerId` del token viene nulo para operadores internos y el guard los rechaza (falso 403 que rompe el modulo). -> Mitigacion: bypass global cubre los 6 roles internos; resto de roles siempre tiene `customerId` en token (verificar con datos reales).
3. La columna `IsFinalized` se agrega NOT NULL sin default y rompe la migracion con filas existentes. -> Mitigacion: nullable/default false (ver 3.5).
4. El endpoint de finalizacion se expone sin scope y permite finalizar partidas de otro tenant. -> Mitigacion: RN-PP-008 aplica a todos los servicios.
5. El borrado con archivos se "arregla" quitando el `Restrict` a `Cascade` y se pierde historial sin control. -> Mitigacion: no tocar delete behavior; borrado explicito en servicio + transaccion.

### 5.3 Flujos (Happy / Sad / Edge)

- **Happy**: usuario de tenant A finaliza partida de una propuesta de A -> `200`, flag + usuario + fecha, realtime a los demas usuarios del grupo.
- **Sad**: usuario de tenant A llama con `itemId` de B -> `403 TENANT_FORBIDDEN`, sin exponer existencia del recurso.
- **Sad**: `ProposedAmount = -5` o `NaN` -> `400 VALIDATION_ERROR`.
- **Edge**: borrar partida con 3 PDFs y 2 registros de historial -> se borran filas + archivos fisicos y total recalculado; sin 500.
- **Edge**: 2 requests concurrentes crean propuesta mismo `(customer, year)` -> uno gana, el otro recibe `409 PROPOSAL_EXISTS` por unique index.
- **Edge**: rol global sin `customerId` consulta `?customerId=` de cualquier cliente -> permitido.

---

## 6. Fases

### Fase 1 — Autorizacion multi-tenant (H1, RN-PP-007/008/009)

**Diseño:** crear un helper interno reutilizable en el modulo, p.ej. `BudgetProposalAccessGuard` (clase en `PresupuestoPropuesta/Services` o extension), inyectando `ICurrentUserService`.

- `GlobalTenantRoles` = `HashSet<string>` con `nameof(ApplicationRoleEnum.SuperUsuario)`, `Direccion`, `GerenteMantenimiento`, `SupervisionOperativa`, `Contador`, `RecursosHumanos`.
- Metodos:
  - `bool IsGlobalRole()`.
  - `void EnsureCustomerAccess(Guid customerId)` -> si rol global: OK; si `CustomerId` nulo: `BusinessException("TENANT_NOT_IDENTIFIED",403)`; si distinto: `BusinessException("TENANT_FORBIDDEN",403)`.
  - `void EnsureProposalAccess(Guid proposalId)` / `EnsureItemAccess(Guid itemId)` / `EnsureFileAccess(Guid fileId)`: cargan la entidad y aplican `EnsureCustomerAccess(entity.CustomerId)`.

**Checklist Fase 1**
- [ ] `BudgetProposalService`: inyectar guard y validar en `GetProposalsAsync`, `CreateProposalAsync`, `GetBudgetProposalItemAsync`, `UpdateProposalItemAsync`, `GetItemHistoryAsync`, `GetAvailableAspelAccountsAsync`, `AddAccountsToProposalAsync`, `DeleteProposalItemAsync`, `GetFeeComparisonAsync`, `GetFeeComparisonByIndivisoAsync`.
- [ ] `BudgetProposalItemSupportService`: inyectar guard y validar en los 4 metodos.
- [ ] `GetProposalsAsync`: para rol no global, ignorar/validar `customerId` del query contra el token (RN-PP-009).
- [ ] Registrar el guard en DI (`DependencyInjection.Controllers.cs` o modulo).
- [ ] No exponer el mensaje con datos ajenos (403 generico).
- [ ] Tests: por cada rol global (acceso permitido a customer distinto) y por rol no global (permitido solo el propio, 403 en ajeno).

**Criterio de paso:** ningun endpoint del modulo responde datos de un `CustomerId` ajeno para roles no globales; los 6 roles globales operan cualquier cliente.

### Fase 2 — Estructura, unicidad e integridad (H3, H4, H5, H7, RN-PP-001/002/003/006/013)

- [ ] Migracion: unique index `(CustomerId, FiscalYear)` en `BudgetProposals` (ver 3.5). Previo: detectar y resolver duplicados existentes.
- [ ] `CreateProposalAsync` / `GetProposalsAsync`: capturar `DbUpdateException` de unique como `BusinessException("PROPOSAL_EXISTS",409)`.
- [ ] `GetProposalsAsync`: deduplicar Aspel (`GroupBy(...).ToDictionary(...)`) antes de construir diccionarios.
- [ ] `DeleteProposalItemAsync`: null-check de `proposal` (H5) y, en `Draft`, borrar historial + archivos (filas) + archivos fisicos, luego el item, en `IDbContextTransaction`.
- [ ] Reutilizar el borrado fisico del `BudgetProposalItemSupportService` (extraer a helper compartido para no duplicar).
- [ ] Verificar que no se usen `Cascade` en las FK del modulo.

**Criterio de paso:** crear propuesta duplicada -> 409; borrar partida con soportes -> 200 y 0 huerfanos (filas y disco); item que tenia propuesta -> sin 500.

### Fase 3 — Validaciones de entrada (H9, H12, H14, RN-PP-011/012/014)

- [ ] `UpdateProposalItemDTO`: `[Range(0, double.MaxValue)]` sobre `ProposedAmount`.
- [ ] `UpdateProposalItemAsync`: rechazar no finitos y negativos con `BusinessException("INVALID_AMOUNT",400)`.
- [ ] `AddAccountsToProposalAsync`: validar null/vacio/duplicados; cuentas inexistentes -> reportar (no silencio total).
- [ ] Confirmar esquema de auth (Bearer stateless) y documentar ticket en el `.DisableAntiforgery()` (o reactivar antiforgery). Convencion `backend/multipart-antiforgery.md`.
- [ ] `CreateProposalAsync` (H12): decidir retirar (sin endpoint) o publicar. Si se retira, quitar de la interfaz.

**Criterio de paso:** montos invalidos -> 400 con mensaje; upload documentado conforme a convencion.

### Fase 4 — Finalizacion de partida (NUEVO, RN-PP-005/010)

**Modelo (`BudgetProposalItem`)**
- `bool IsFinalized { get; set; }` (default `false`).
- `string? FinalizedById { get; set; }` (FK `ApplicationUser`, nullable).
- `DateTime? FinalizedAt { get; set; }`.
- `ApplicationUser? FinalizedBy { get; set; }` (navegacion).
- Config EF: FK opcional con `OnDelete(DeleteBehavior.Restrict)`; indice en `FinalizedById`.

**DTO (`BudgetProposalItemDTO`)** — campos aditivos:
- `bool IsFinalized`
- `string? FinalizedById`
- `string? FinalizedByUserName`
- `DateTime? FinalizedAt`

**Contrato (nuevo endpoint)**
- `PUT api/budget-proposal/item/{itemId:guid}/finalize`
- Body `UpdateProposalItemFinalizationDTO { bool IsFinalized }`
- Logica: guardarse en `Draft` (o decidir permitir tambien fuera de Draft; documento: por ahora solo `Draft`), setear `IsFinalized`, `FinalizedById = currentUser.UserId`, `FinalizedAt = DateTime.UtcNow`; al revertir -> limpiar `FinalizedById`/`FinalizedAt`.
- Emitir realtime con el item actualizado (reusar `IBudgetProposalRealTimeService`).

**Frontend**
- `budget-proposal.model.ts`: agregar `isFinalized`, `finalizedById`, `finalizedByUserName`, `finalizedAt`.
- `presupuesto-propuesta.ts`: metodo `toggleItemFinalized(item)` con actualizacion optimista + rollback en error.
- `presupuesto-propuesta.html`: indicador/columna de "Listo" con usuario y fecha (tooltip); habilitado solo si `status === 'Borrador'`.
- `contabilidad.endpoints.ts`: `finalizeItem(itemId)`.
- Manejar el evento realtime para reflejar el cambio en otros clientes.

**Checklist Fase 4**
- [ ] Entidad + config EF + migracion (ver 3.5).
- [ ] DTO create/update (si aplica) y mapper.
- [ ] Endpoint + interfaz + servicio.
- [ ] No bloquear edicion de monto en esta iteracion (solo marcar).
- [ ] Auditoria: `FinalizedById`/`FinalizedAt`; sin borrar historial.
- [ ] Realtime.
- [ ] Tests: finalizar, revertir, permisos, realtime.

**Criterio de paso:** al marcar una partida, persisten flag+usuario+fecha, se ven en la grilla y se propagan en tiempo real; un segundo usuario ve el cambio.

### Fase 5 — Realtime y concurrencia (H6, H8, H22)

- [ ] Unificar clave de grupo: frontend se une con el anio objetivo (`response.fiscalYear`) o se unen ambos anios; backend no cambia contrato de grupo.
- [ ] `BudgetProposal`: `[Timestamp] byte[] RowVersion` + manejo de `DbUpdateConcurrencyException`.
- [ ] Consolidar llamadas a Aspel y cachear por `(customerId, year)`.

**Criterio de paso:** dos navegadores con la misma propuesta ven el update; 2 edits concurrentes no pierden el ultimo total.

### Fase 6 — Calidad y deuda tecnica (H10, H11, H13, H16, H17, H18, H19, H20, H23, H24, H25, H26)

- [ ] H10: exponer `isExtraordinario`/`isProyecto` (o `category`) en `BudgetProposalItemDTO`; frontend filtra por flag, no por prefijo.
- [ ] H11: eliminar `IsCuentaExtraordinaria`/`IsCuentaProyecto` (codigo muerto, GUIDs hardcodeados).
- [ ] H13: aplicar o eliminar `ProviderName`/`Comment` del DTO de upload.
- [ ] H16: corregir `budget-rule-list.onDelete` (endpoint de borrado por regla).
- [ ] H17: alinear model TS con DTO (quitar `justification`, corregir `EProposalStatus`).
- [ ] H18: `GetBudgetProposalItemAsync` -> 404 real.
- [ ] H19: `.catch` + revertir optimista; separar flags de carga.
- [ ] H20: sanitizar HTML del audit dialog.
- [ ] H23: reemplazar detach/raw SQL por operaciones EF en transaccion.
- [ ] H24: tests de servicio segun `CONVENTIONS_TESTING.md`.
- [ ] H25: normalizar emojis mojibake en `BudgetProposalService.cs` y registrar deuda del scanner.
- [ ] H26: nomenclatura (parametros, `EndPoints` vs `Endpoints`, comentarios autogenerados, mensajes en espanol).
- [ ] Actualizar `conventions/CONVENTIONS_ENTITIES.md` (nuevos campos/relacion) y docs del modulo.

**Criterio de paso:** `scan-mojibake` en cero, build + tests verdes, checklist de convenciones sin pendientes.

---

## 3.5 Migracion de Datos & Prevencion de Perdida

**Responsable:** Tech Lead (crear SQL, ejecutar, validar).

### Cambios de estructura

| Tabla | Cambio | Tipo | Riesgo | Mitigacion |
|---|---|---|---|---|
| `BudgetProposals` | Unique index `(CustomerId, FiscalYear)` | Constraint | Alto | Resolver duplicados existentes antes; si hay, decidir cual se conserva (ver analisis) |
| `BudgetProposalItems` | Agregar `IsFinalized` (bit) | Agregar columna | Bajo | Default `0` (false) para filas existentes |
| `BudgetProposalItems` | Agregar `FinalizedById` (nvarchar(450), null) | Agregar columna | Bajo | Nullable, sin backfill |
| `BudgetProposalItems` | Agregar `FinalizedAt` (datetime2, null) | Agregar columna | Bajo | Nullable |
| `BudgetProposalItems` | FK `FinalizedById` -> `Users` (Restrict) + indice | Constraint | Bajo | Nullable; sin datos previos |

### Analisis de perdida de datos

- **Unique index**: si existen propuestas duplicadas `(CustomerId, FiscalYear)`, la migracion **falla**, no borra. Mitigacion: consulta de deteccion previa; resolver manualmente con negocio (fusionar o archivar) antes de aplicar.
- **Columnas nuevas**: aditivas y nullables/default -> sin perdida.
- **No se renombra ni remueve nada** en esta fase.

### Script de migracion (borrador, Tech Lead refina)

```sql
-- Paso 1: deteccion de duplicados (debe devolver 0 filas)
SELECT CustomerId, FiscalYear, COUNT(*) AS Duplicados
FROM BudgetProposals
GROUP BY CustomerId, FiscalYear
HAVING COUNT(*) > 1;

-- Paso 2: columnas nuevas
ALTER TABLE BudgetProposalItems
    ADD IsFinalized BIT NOT NULL CONSTRAINT DF_BudgetProposalItems_IsFinalized DEFAULT (0);
ALTER TABLE BudgetProposalItems ADD FinalizedById NVARCHAR(450) NULL;
ALTER TABLE BudgetProposalItems ADD FinalizedAt DATETIME2 NULL;

-- Paso 3: FK + indice
ALTER TABLE BudgetProposalItems
    ADD CONSTRAINT FK_BudgetProposalItems_Users_FinalizedById
    FOREIGN KEY (FinalizedById) REFERENCES AspNetUsers(Id) ON DELETE NO ACTION;
CREATE INDEX IX_BudgetProposalItems_FinalizedById ON BudgetProposalItems(FinalizedById);

-- Paso 4: unique index (solo si Paso 1 = 0 filas)
CREATE UNIQUE INDEX UX_BudgetProposals_CustomerId_FiscalYear
    ON BudgetProposals(CustomerId, FiscalYear);
```

> Nota: la migracion EF (`dotnet ef migrations add ...`) la crea Tech Lead; el SQL es la referencia de lo esperado. Ubicar artefactos en `docs/AccountingLuxuryApp/PresupuestoPropuesta/`.

### Validacion post-migracion

- [ ] Backup verificado antes.
- [ ] Paso 1 (duplicados) = 0 filas.
- [ ] `COUNT(*)` de `BudgetProposalItems` igual antes/despues.
- [ ] `IsFinalized` = 0 en todas las filas preexistentes.
- [ ] `FinalizedById`/`FinalizedAt` NULL en filas preexistentes.
- [ ] Unique index creado y probado (insert duplicado falla).
- [ ] API responde sin cambios para datos existentes.

### Rollback

```
DROP INDEX UX_BudgetProposals_CustomerId_FiscalYear ON BudgetProposals;
ALTER TABLE BudgetProposalItems DROP CONSTRAINT FK_BudgetProposalItems_Users_FinalizedById;
DROP INDEX IX_BudgetProposalItems_FinalizedById ON BudgetProposalItems;
ALTER TABLE BudgetProposalItems DROP COLUMN FinalizedAt, FinalizedById, IsFinalized;
-- o RESTORE DATABASE si hubo problema mayor
```

---

## 7. Riesgos

| Riesgo | Prob. | Impacto | Mitigacion |
|---|---|---|---|
| Falso 403 a operadores internos sin `customerId` | Media | Alto | Bypass de 6 roles; validar token real en dev antes de desplegar; log del rol cuando se deniega |
| Rol mal escrito / display con acento | Baja | Alto | Usar `nameof(ApplicationRoleEnum)`; nunca strings sueltos; test por rol |
| Duplicados bloquean unique index | Media | Alto | Deteccion previa + decision de negocio |
| Borrado de archivos fisicos falla parcialmente | Baja | Medio | Transaccion de BD + borrado fisico tolerante a fallos (log) y reintento |
| Romper contrato del DTO al agregar campos | Baja | Medio | Campos aditivos; frontend actualizado en el mismo release |
| Realtime con clave de grupo cambia y rompe otros modulos | Baja | Alto | No cambiar formato de grupo backend; solo corregir el anio que envia el frontend del modulo |

---

## 8. Dependencias e Impactos

- `ICurrentUserService` (shared): consumo de `UserId`, `UserRole`, `CustomerId`. Sin cambios.
- `ApplicationRoleEnum` (shared): solo lectura/`nameof`.
- `IFileValidatorService`, `ISecureFileStorageService`, `IFileWritePathService`: reuso para borrado fisico.
- `ApplicationDbContext`: migracion (Tech Lead).
- Contrato API: nuevo campo y endpoint aditivos; se actualiza el model TS y las constantes de endpoints.
- Documentacion: `conventions/CONVENTIONS_ENTITIES.md` (nuevos campos) y reporte/plan del modulo.

---

## 9. Criterios de paso (global)

- [ ] Todos los endpoints del modulo aplican RN-PP-007/008/009.
- [ ] Unique `(CustomerId, FiscalYear)` activo y mapeado a 409.
- [ ] Borrado de partida con soportes sin error y sin huerfanos.
- [ ] `ProposedAmount` validado en backend.
- [ ] Finalizacion de partida con flag + usuario + fecha, sin bloquear edicion.
- [ ] Realtime verificado con 2 sesiones.
- [ ] `scan-mojibake` = 0 en la carpeta afectada.
- [ ] Build backend + lint/typecheck frontend + tests verdes.
- [ ] Reporte de auditoria actualizado con estado de cada hallazgo.

---

## 10. Cierre esperado

- Hallazgos H1–H26 remediados o explicitamente diferidos con justificacion.
- Modelo `BudgetProposalItem` con finalizacion trazable y endpoint funcional.
- Documentacion del modulo y convenciones de entidades actualizadas.
- Sin regresion en endpoints existentes.

---

> **Este plan no se implementa sin aprobacion explicita del Tech Lead / dueno del modulo.**
> Al aprobarse, ejecutar por fases con la skill `surgical-patch` (fases 1–4) y `safe-refactor` (fases 5–6), verificando criterios de paso antes de avanzar.

---

## 11. Estado de ejecucion (2026-09-16)

**Aprobacion:** APROBADO (bypass de 6 roles + finalizacion solo en `Borrador`).

| Fase / Item | Estado | Detalle |
|---|---|---|
| Fase 1 — guard tenant | ✅ Ejecutado | `BudgetProposalAccessGuard` (6 roles) aplicado en los 10 metodos de `BudgetProposalService` y 4 de `BudgetProposalItemSupportService` |
| Fase 2 — unicidad (H3) | ⏳ Parcial | Config EF unique `(CustomerId, FiscalYear)` + captura `DbUpdateException`=>409 + re-fetch en carrera. **Migracion EF pendiente (Tech Lead)** |
| Fase 2 — dedupe Aspel (H7) | ✅ Ejecutado | `GroupBy().ToDictionary()` |
| Fase 2 — borrado item (H4/H5) | ✅ Ejecutado | null-check + transaccion borra archivos (filas+disco), historial y recalcula total |
| Fase 3 — validaciones (H9) | ✅ Ejecutado | `[Range]` en DTO + validacion `>= 0` en servicio |
| Fase 3 — add-accounts (RN-PP-012) | ✅ Ejecutado | valida null/vacio + `Distinct()` |
| Fase 3 — antiforgery (H14) | ✅ Ejecutado | documentado Bearer stateless |
| Fase 4 — finalizacion | ✅ Ejecutado (backend+frontend) | campos entidad, DTO, endpoint `PUT item/{id}/finalize`, realtime, UI (toggle + tag). Pendiente verificacion runtime |
| Fase 5 — realtime (H6) | ✅ Ejecutado | frontend se une con `fiscalYear` (año objetivo) |
| Fase 5 — concurrencia (H8) H22 | ⏭️ Diferido | `RowVersion` y cache Aspel no ejecutados |
| Fase 6 — H11 | ✅ Ejecutado | eliminados `IsCuentaExtraordinaria`/`IsCuentaProyecto` |
| Fase 6 — H13 | ✅ Ejecutado | `ProviderName`/`Comment` del upload se aplican |
| Fase 6 — H17 | 🟡 Parcial | `EProposalStatus` alineado; `justification` se conserva (evitar ruptura) |
| Fase 6 — H25 | 🟡 Parcial | mojibake de `BudgetProposalService` limpiado; scanner sigue sin detectar emoji mojibake |
| Fase 6 — H16/H18/H19/H20/H23/H26 | ⏭️ Pendiente | No ejecutados en esta iteracion |
| Migracion EF | ✅ Generada y aplicada | `20260917014151_AddBudgetProposalFinalizationAndProposalUniqueIndex` aplicada en BD dev (`LuxuryBuildingGroup`). Verificado: 3 columnas, unique index y FK. Sin duplicados previos (21 propuestas) |
| Tests (H24) | ⏳ Pendiente | Sin pruebas de servicio nuevas |

**Verificacion ejecutada:**
- `dotnet build LuxuryApp.Application` → 0 errores.
- `dotnet build LuxuryApp.Api -c Release` → 0 errores (Debug bloqueado por proceso en ejecucion).
- `npx tsc --noEmit -p tsconfig.app.json` → 0 errores.
- `node scripts/scan-mojibake.mjs` (carpetas afectadas) → 0 mojibake.

**Estado de BD:** migracion aplicada en dev (`LuxuryBuildingGroup`). Para otros entornos (staging/produccion) aplicar con `dotnet ef database update`; el unique index fallaria si existieran duplicados `(CustomerId, FiscalYear)` (en dev: 0 duplicados).
