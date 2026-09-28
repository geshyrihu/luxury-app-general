# Fase 0 - Linea Base de Contratos y Frontera

**Fecha:** 2026-07-31
**Modulo:** `CobranzaNativa`
**Plan asociado:** `docs/plans/20260731-cobranza-nativa-remediacion-plan.md`

---

## Objetivo

Congelar la fotografia contractual actual del modulo para ejecutar la
remediacion sin reintroducir mezcla entre `CobranzaNativa`, compatibilidad
externa y otras apps.

## Contrato backend vigente inventariado

Las rutas publicas activas del modulo hoy viven bajo `api/cobranza/*`.

Familias detectadas:

- `cobranza/charge-types`
- `cobranza/charge-templates`
- `cobranza/charges`
- `cobranza/payments`
- `cobranza/statements`
- `cobranza/notifications`
- `cobranza/notification-settings`
- `cobranza/billing-config`
- `cobranza/metrics`
- `cobranza/reconciliations`
- `cobranza/property-members`
- `cobranza/regulation-articles`
- `cobranza/property-fines`
- `cobranza/adjustments`
- `cobranza/approvals`
- `cobranza/period-closures`
- `cobranza/ledger`
- `cobranza/collection-cases`
- `cobranza/invoices`
- `cobranza/audit-logs`

## Consumidores frontend inventariados

### Canonicos dentro del modulo

El frontend de `cobranza-nativa` consume principalmente
`Endpoints.CobranzaCore`.

### Alias legacy

No se detectaron consumidores operativos de `Endpoints.CobranzaNative` ni de
`Endpoints.NativeCollection` dentro del modulo al corte actual. Los aliases
siguen existiendo en `client/angular/src/app/core/constants/endpoints/cobranza.endpoints.ts`,
pero no deben crecer.

### Compatibilidad externa aun activa

Persisten imports desde `contracts/external-compatibility` en:

- `configuration/billing-config/billing-config-modal.ts`
- `core/charges/charge-form.ts`
- `core/charges/charge-list.ts`
- `core/charges/bulk-import-modal.ts`
- `core/charges/initial-balance-template.helper.ts`
- `core/initial-balance/initial-balance.ts`
- `core/payments/payment-form.ts`
- `core/payments/payment-list.ts`
- `core/payments/payment-detail-modal.ts`
- `core/payments/payments.ts`

## Cruces de bounded context detectados

### Ruta cruzada a otra app

Al inicio de esta fase, la ruta:

- `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa/cobranza-nativa.routing.ts`

cargaba directamente:

- `src/app/apps/resident.luxuryapp/property/propiedades-list`

Esto se clasifica como incumplimiento critico de frontera. La ejecucion de Fase
1 reemplazara ese salto por una pieza local de transicion dentro del propio
modulo.

### Catalogo wrapper con dependencia funcional externa

La card `Propiedades` dentro de:

- `entry/cobranza-nativa-wrapper/cobranza-nativa-groups.const.ts`

documenta endpoints de `Properties` y `SelectItems.properties`, lo que confirma
que la administracion de propiedades sigue siendo una dependencia operativa
externa y aun no una capacidad nativa del modulo.

## Clasificacion documental inicial

### Vigente para ejecucion

- `conventions/modules/cobranza-nativa-module-conventions.md`
- `docs/reporte_maestro/modulos/20260731-auditoria-cobranza-nativa.md`
- `docs/plans/20260731-cobranza-nativa-remediacion-plan.md`
- `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa/docs/COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md`
- `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa/docs/ORGANIZACION-FRONTAL-CNATIVA-2026-07-26.md`
- `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa/docs/02-matriz-operativa-front-cobranza-nativa.md`

### Historico controlado o contradictorio

- `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/reglas-negocio-cobranza-nativa.md`
  porque aun publica `api/accounting-coi/native-collection/*`
- `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/documentacion-logica-reportes-cobranza.md`
  porque sigue narrando extraccion directa desde Aspel como motor operativo

## Congelamiento de contrato para la remediacion

Durante la ejecucion actual:

- `Endpoints.CobranzaCore` es la entrada canonica para crecimiento frontend
- `contracts/external-compatibility` queda clasificado como frontera temporal
- no se tocara `resident.luxuryapp` para resolver la separacion de este modulo
- la capacidad `properties` queda en transicion hasta contar con feature propia
  o adaptador formal aprobado
