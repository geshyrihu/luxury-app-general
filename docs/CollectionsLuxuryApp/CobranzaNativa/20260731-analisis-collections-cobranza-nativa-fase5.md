# Fase 5 - Linea Base De Pruebas Y Verificabilidad

**Fecha:** 2026-07-31
**Modulo:** `CobranzaNativa`
**Estado:** Base inicial levantada y primer bloque cubierto

## Hallazgo base inicial

- no existian archivos `*.spec.ts` ni `*.test.ts` dentro de
  `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa`

## Flujos criticos sin cobertura detectados

- `core/charges/charge-form.ts`
- `core/charges/charge-list.ts`
- `core/payments/payment-form.ts`
- `core/payments/payment-list.ts`
- `core/members/member-form.ts`
- `core/members/member-list.ts`
- `configuration/billing-config/billing-config-modal.ts`

## Avance ejecutado

- se creó una configuración aislada de Vitest para Cobranza Nativa en
  `client/angular/vitest.cobranza-nativa.config.ts`
- se agregó `client/angular/src/test-shims/oxc-decorate.ts` para resolver el
  helper requerido por el pipeline actual de Angular + Vite
- se levantó el primer bloque de pruebas de componente:
  - `core/charges/charge-form.spec.ts`
  - `core/payments/payment-form.spec.ts`
  - `core/members/member-form.spec.ts`
  - `configuration/billing-config/billing-config-modal.spec.ts`
- se levantó el segundo bloque de pruebas para listados críticos:
  - `core/charges/charge-list.spec.ts`
  - `core/payments/payment-list.spec.ts`
  - `core/members/member-list.spec.ts`
- se levantó el tercer bloque para vistas de consulta y trazabilidad:
  - `core/native-statement/native-statement.spec.ts`
  - `core/ledger/ledger-viewer.spec.ts`
  - `core/audit/financial-audit-log.spec.ts`
- se agregó cobertura de refresh por realtime en:
  - `core/charges/charge-list.spec.ts`
  - `core/payments/payment-list.spec.ts`
  - `core/native-statement/native-statement.spec.ts`
- se agregó validación dedicada del bloque mobile operativo pendiente:
  - `core/approvals/approval-inbox.spec.ts`
  - `core/period-closures/period-closure-dashboard.spec.ts`
- la corrida consolidada actual quedó en verde:
  - `12` archivos
  - `51` pruebas aprobadas

## Riesgo operativo residual

- siguen sin cobertura automatizada algunos listados auxiliares no críticos del
  módulo y escenarios combinados de realtime más profundos
- la advertencia de `@analogjs/vite-plugin-angular` por exclusión heredada de
  `*.spec.ts` quedó corregida al sobrescribir `exclude` en `tsconfig.spec.json`
- la estrategia mobile por subdominio ya quedó definida en
  `docs/plans/20260731-cobranza-nativa-fase-5-mobile-strategy.md`

## Siguiente corte recomendado

- mover el esfuerzo a Fase 6 para depurar y alinear la documentación vigente
- dejar los listados auxiliares como pasada secundaria de endurecimiento
