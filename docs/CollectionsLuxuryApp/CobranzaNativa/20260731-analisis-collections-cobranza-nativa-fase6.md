# Fase 6 - Linea Base Documental

**Fecha:** 2026-07-31
**Modulo:** `CobranzaNativa`
**Estado:** Clasificacion inicial levantada

## Objetivo

Clasificar la documentacion existente del modulo segun su vigencia real
despues de la remediacion ejecutada en backend, frontend y pruebas.

## Documentos con vigencia arquitectonica actual

- `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/Architecture/00-frontera-y-matriz-cobranza-nativa.md`
  - estado: vigente
  - motivo: define la frontera activa del bounded context y la separacion
    contra `AspelCobranzaLocal`, `AspelCobranzaLive` y `CobranzaOnline`
- `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/reglas-negocio-cobranza-nativa.md`
  - estado: vigente
  - motivo: ya fue reescrito contra el estado real actual del modulo
- `docs/plans/20260731-cobranza-nativa-remediacion-plan.md`
  - estado: vigente
  - motivo: concentra el plan real de ejecucion por fases
- `docs/plans/20260731-cobranza-nativa-fase-5-baseline.md`
  - estado: vigente
  - motivo: evidencia tecnica actual de pruebas, realtime y variante mobile
- `docs/plans/20260731-cobranza-nativa-fase-5-mobile-strategy.md`
  - estado: vigente
  - motivo: fija el criterio mobile por subdominio sobre componentes reales
- `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa/docs/02-matriz-operativa-front-cobranza-nativa.md`
  - estado: vigente
  - motivo: delimita la frontera funcional del frontend nativo

## Documentos utiles pero subordinados

- `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/Architecture/01-plan-ejecucion-separacion-cobranza-nativa.md`
  - estado: subordinado
  - motivo: conserva valor historico del plan de separacion, pero fue
    reemplazado en ejecucion fina por el plan 2026-07-31
- `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/analisis-diagnostico-cobranza-nativa.md`
  - estado: subordinado
  - motivo: diagnostico puntual, no contrato vigente

## Documentos historicos o reclasificados

- `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/documentacion-logica-reportes-cobranza.md`
  - estado: historico
  - motivo: describe un flujo contable/online legacy y ya fue reclasificado
- `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/documentacion-cuestionario-cobranza-nativa.md`
  - estado: historico
  - motivo: insumo de descubrimiento funcional, no contrato tecnico actual

## Prioridad de actualizacion recomendada

1. alinear referencias cruzadas entre docs backend y frontend
2. localizar o reemplazar la referencia a
   `COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md`
3. dejar bitacora final de pendientes residuales del modulo

## Regla operativa desde esta fase

La lectura primaria vigente para `CobranzaNativa` queda en este orden:

1. `CONVENTIONS.md`
2. `conventions/modules/cobranza-nativa-module-conventions.md`
3. `Docs/Architecture/00-frontera-y-matriz-cobranza-nativa.md`
4. `Docs/reglas-negocio-cobranza-nativa.md`
5. `docs/plans/20260731-cobranza-nativa-remediacion-plan.md`
