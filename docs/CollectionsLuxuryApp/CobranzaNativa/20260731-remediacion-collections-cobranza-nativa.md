# Plan de Remediacion - CobranzaNativa

**Fecha:** 2026-07-31
**Estado:** ⛔ Cerrado — sustituido el 2026-08-11
**Modulo:** `CobranzaNativa`
**Basado en auditoria:** `docs/reporte_maestro/modulos/20260731-auditoria-cobranza-nativa.md`
**Sustituye para ejecucion fina a:** `docs/plans/20260730-cobranza-nativa-remediacion-plan.md`
**Sustituido por:** `docs/plans/20260811-cobranza-nativa-reactivacion-plan.md`

---

## Cierre de este plan (2026-08-11)

La auditoria `20260811-auditoria-cobranza-nativa.md` **verifico contra codigo**
el resultado de este plan:

| Fase | Resultado verificado |
|:--:|---|
| 0 | Parcial — 2 tareas documentales residuales |
| 1 | ✅ Cerrada — frontera frontend encapsulada, `core/` limpio de contratos externos |
| 2 | ✅ Cerrada en la practica — queda **1** `any` en todo el modulo |
| 3 | ✅ Cerrada — 0 endpoints con `ApplicationDbContext`, 0 entidades EF en respuestas |
| 4 | Parcial — los archivos `*DTOs.cs` se separaron, pero quedan 16 DTOs embebidos en archivos de interfaz |
| 5 | ✅ Cerrada — 12 specs frontend |
| 6 | Parcial — la documentacion rectora sigue publicando el contrato viejo |

Las **5 tareas residuales** se absorben explicitamente en el plan sucesor:

- Fase 0 · clasificar documentos vigentes vs historicos → `6.4` del plan nuevo
- Fase 0 · registrar piezas con `api/accounting-coi/native-collection/*` → `6.3`
- Fase 2 · tipar `ledger-viewer`, `native-statement`, `financial-audit-log` → cerrado en la practica
- Fase 2 · revisar selects y wrappers `@ui/*` en edicion → `5.6`
- Fase 2 · fallbacks de catalogo en edicion → `5.7`

**No ejecutar tareas desde este documento.** Usar el plan sucesor.

---

## Objetivo

Corregir `CobranzaNativa` por fases controladas, sin romper invariantes
financieras, sin remezclar compatibilidad externa y sin tocar shared ni rutas
publicas sensibles fuera de un inventario formal.

## Bitacora de ejecucion

### 2026-07-31

- [x] auditoria profunda rehecha contra el sistema rector actualizado
- [x] plan fino de remediacion generado
- [x] linea base Fase 0 documentada en
      `docs/plans/20260731-cobranza-nativa-fase-0-linea-base.md`
- [x] corte inicial de frontera frontend aplicado:
      `/cobranza-nativa/properties` ya no carga `resident.luxuryapp`
- [x] contratos locales creados para cargos y pagos dentro de
      `cobranza-nativa/interfaces`
- [x] migracion de contratos del `core/charges`, `core/payments` y
      `core/initial-balance` fuera de `contracts/external-compatibility`
- [x] aislamiento final de `configuration/billing-config` como unica frontera
      temporal permitida
- [x] wrapper ajustado para que la configuracion temporal no compita con el
      core operativo
- [x] normalizacion backend de endpoints y DTOs:
      `CollectionCases`, `Ledger` e `Invoices` ya no dejan logica de consulta en
      endpoint

---

## Fase 0. Congelamiento de contrato y linea base

### Objetivo

Definir que es contrato vigente, que es legacy controlado y que piezas ya no
pueden usarse como referencia primaria.

### Tareas

- [x] inventariar todas las rutas publicas vivas `api/cobranza/*`
- [x] inventariar consumidores frontend de `CobranzaCore`, `CobranzaNative` y
      `NativeCollection`
- [ ] clasificar documentos vigentes vs historicos en `Docs/` y `docs/`
- [ ] registrar que piezas publican aun `api/accounting-coi/native-collection/*`
- [x] congelar una lista de contratos que no se moveran sin migracion

### Salida esperada

- contrato vigente inventariado
- documentacion legacy marcada

---

## Fase 1. Cierre de frontera frontend

### Objetivo

Sacar del flujo operativo del modulo todo escape a otras apps y toda dependencia
directa del `core/` hacia compatibilidad externa.

### Tareas

- [x] retirar o encapsular la ruta `properties` que hoy carga
      `resident.luxuryapp/property/propiedades-list`
- [x] mover `core/charges/*` a contratos nativos
- [x] mover `core/payments/*` a contratos nativos
- [x] mover `core/initial-balance/*` y `bulk-import-modal` a contratos nativos
- [x] limitar `configuration/billing-config` como unica frontera temporal que
      pueda leer `external-compatibility`
- [x] actualizar wrapper para que configuracion temporal no compita con el core

### Salida esperada

- `core/` sin imports a `contracts/external-compatibility`
- sin rutas cruzadas a otras apps

---

## Fase 2. Tipado y flujos editables frontend

### Objetivo

Eliminar `any` productivo y endurecer `onLoadData -> patchValue -> render` en
formularios y listados criticos.

### Tareas

- [x] tipar `billing-config-modal`
- [x] tipar `charge-form`
- [x] tipar `payment-form`
- [x] tipar `member-form`
- [x] tipar `charge-template-form`
- [ ] tipar `ledger-viewer`, `native-statement`, `financial-audit-log` y
      `invoice-list`
- [ ] revisar selects, autocomplete y wrappers `@ui/*` en modo edicion
- [ ] definir fallbacks cuando el catalogo no contenga el valor editado

### Salida esperada

- cero `any` productivo en flujos criticos del modulo
- formularios editables alineados con contrato real

---

## Fase 3. Endpoints y contratos backend

### Objetivo

Volver consistentes los endpoints del modulo con el modelo thin-endpoint,
servicios de aplicacion y DTOs explicitos.

### Tareas

- [x] extraer logica de `CollectionCasesEndpoints` a servicio de aplicacion
- [x] dejar de exponer `FinancialLedgerEntry` en `LedgerEndPoints`
- [x] crear DTOs explicitos para ledger
- [x] revisar endpoints que aun mezclan `Results.*` y `TypedResults.*`:
      normalizados los `PUT` del core; quedan solo casos especiales
      intencionales en `Webhooks` y `NativeStatements`
- [x] revisar accesos directos a `ApplicationDbContext` desde endpoints del
      modulo
- [x] validar que cada servicio de aplicacion mantenga la logica de negocio
      fuera del endpoint:
      el barrido de endpoints dejo solo guardas triviales, respuestas
      especiales y exportacion PDF

### Salida esperada

- endpoints delgados
- contratos explicitos

---

## Fase 4. Normalizacion estructural backend

### Objetivo

Alinear DTOs y piezas backend con las reglas actuales de organizacion.

### Tareas

- [x] separar DTOs multiples de `AdjustmentDTOs.cs`
- [x] separar DTOs multiples de `InitialBalanceDTOs.cs`
- [x] separar DTOs multiples de `ChargeTypeCatalogDTOs.cs`
- [x] separar DTOs multiples de `CollectionCaseDTOs.cs`
- [x] separar DTOs multiples de `PropertyFineDTOs.cs`
- [x] separar DTOs multiples de `InvoiceDTOs.cs`
- [x] separar DTOs multiples de `NativeStatementResponseDTO.cs`
- [x] separar DTOs multiples de `RegulationArticleDTOs.cs`
- [x] separar DTOs multiples de `NotificationSettingsDTOs.cs`
- [x] separar DTOs multiples de `NotificationOperationsDTOs.cs`
- [x] repetir el patron para el resto de archivos detectados en auditoria

### Salida esperada

- 1 archivo = 1 DTO en todo `CobranzaNativa`

---

## Fase 5. Mobile, pruebas y verificabilidad

### Objetivo

Cerrar la deuda de verificacion del modulo y volver auditable el flujo real.

### Tareas

- [x] definir estrategia mobile real por subdominio critico
- [x] crear pruebas frontend para:
      `charge-form`, `payment-form`, `member-form`, `billing-config-modal`
- [x] crear pruebas frontend para listados criticos:
      `charges`, `payments`, `members`, `native-statement`
- [x] validar create, edit y consultas base de los flujos criticos
- [x] validar delete y refresh extendido de los flujos criticos
- [x] validar desktop y mobile para `charges`, `payments`, `members`,
      `native-statement`, `approvals`, `ledger`, `period-closures`

### Salida esperada

- cobertura minima frontend
- estrategia mobile trazable

---

## Fase 6. Documentacion y cierre

### Objetivo

Dejar una sola narrativa vigente del modulo y bajar a historico lo que ya no
sea contrato activo.

### Tareas

- [x] actualizar `reglas-negocio-cobranza-nativa.md` contra rutas reales
- [x] reclasificar o reescribir `documentacion-logica-reportes-cobranza.md`
- [x] alinear `COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md` con la
      frontera vigente del modulo
- [x] actualizar plan y estatus de hallazgos
- [x] dejar bitacora de pendientes residuales

### Salida esperada

- documentacion tecnica vigente y no contradictoria

---

## Checklist maestro

- [ ] Fase 0 aprobada
- [ ] Fase 1 aprobada
- [ ] Fase 2 aprobada
- [x] Fase 3 aprobada
- [x] Fase 4 aprobada
- [x] Fase 5 aprobada
- [x] Fase 6 aprobada

---

## Regla de ejecucion

- no tocar shared sin aprobacion explicita
- no cambiar contratos publicos sensibles sin inventario de consumidores
- no remediar por archivo aislado si el hallazgo es de frontera o contrato
- cada fase debe cerrar con evidencia tecnica y actualizacion de checklist
