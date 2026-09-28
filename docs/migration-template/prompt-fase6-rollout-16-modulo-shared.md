# Prompt 16 — Fase 6: módulo `shared.luxuryapp` (8 archivos)

Último módulo grande del rollout estándar. 7 automáticos, 1
exclusión.

## 1. Lote automático — 7 archivos vía script

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/shared.luxuryapp/catalogos-generales/cfdi-use/cfdi-use-list.html \
  src/app/modules/shared.luxuryapp/catalogos-generales/onboarding-checklist-options/onboarding-checklist-option-list.html \
  src/app/modules/shared.luxuryapp/catalogos-generales/payment-method/payment-method-list.html \
  src/app/modules/shared.luxuryapp/catalogos-generales/payment-type/payment-type-list.html \
  src/app/modules/shared.luxuryapp/catalogos-generales/recruitment-sources/recruitment-source-catalog-list.html \
  src/app/modules/shared.luxuryapp/catalogos-generales/units-of-measurement/unit-of-measurement-list.html \
  src/app/modules/shared.luxuryapp/catalogos-generales/work-position-schedule/work-position-schedule-list.html
```

Espera **7 archivos transformados, 0 exclusiones, 0 advertencias** (ya
validado con dry-run de esta misma lista).

## 2. No tocar — 1 archivo con `[reorderableColumns]`

```
src/app/modules/shared.luxuryapp/catalogos-generales/document-catalog/document-catalog-list.html
```

Mismo criterio ya establecido: reordenar columnas sin soporte en
`AppTable`, queda en `p-table`.

## Verificación

- `npx tsc --noEmit` limpio.
- `ng build` sin errores nuevos (warnings `NG8113` aceptables).
- `git diff --stat`: 7 `.html` + 7 `.ts` = 14 archivos.
- Capturas reales de las 7 pantallas migradas, **completamente
  cargadas** (espera a que desaparezca cualquier spinner antes de
  capturar — en el lote anterior una captura salió a medio cargar y
  hubo que repetirla). Confirma ordenar y paginar en al menos 2 de
  ellas.

## Listo cuando

- 7 archivos migrados y verificados.
- 1 archivo sin tocar, confirmado que sigue en `p-table`.
- `tsc`/build limpios, capturas reales adjuntas (completamente
  cargadas, sin duplicados entre sí).
- Con esto, el rollout estándar por módulos queda completo. Solo
  faltarían los ~27 casos especiales diferidos (agrupación, selección,
  reordenar, columnas congeladas, `pTemplate`) para una fase de diseño
  aparte.
