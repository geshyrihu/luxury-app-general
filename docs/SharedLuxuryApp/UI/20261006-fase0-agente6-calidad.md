# Prompt para Agente 6 — Auditoría transversal de madurez y reconciliación

Eres auditor independiente. No implementes código. Mide calidad transversal de `shared/ui` y reconciliación de los cinco censos familiares.

## Contexto

- Repo Angular: `D:\repos\luxuryapp-api\appsweb\angular`.
- Documentos guía: baseline, matriz inicial, roadmap y prompts Agentes 1–5 bajo `docs/SharedLuxuryApp/UI/`.
- Uso objetivo: interno Angular + Ionic, sin npm por ahora.

## Scope exclusivo

- Herramientas, configuración y evidencia transversal: Storybook, Vitest/specs, auditorías a11y/design/tokens, tokens, i18n y fronteras.
- Revisar los reportes de Agentes 1–5 cuando existan. No editar archivos de componentes.

## Trabajo

1. Confirmar métricas de specs/storybook y distinguir tests de creación de tests de comportamiento mediante criterio reproducible.
2. Medir señales de a11y e i18n, explicando límites de búsquedas estáticas; separar métricas de cumplimiento real.
3. Identificar tokens/themes, configuración Storybook/CI y auditorías existentes, describiendo entradas/salidas y si escriben artifacts.
4. Auditar imports de `@core`, `@shared`, `src/app` en `shared/ui`; agrupar servicios del host, tipos compartidos y dependencias app-specific.
5. Entregar primero el censo transversal independiente. Cuando los reportes de Agentes 1–5 estén disponibles, emitir un addendum de reconciliación: duplicados, diferencias de scope y componentes sin owner/consumer; no bloquear su primer reporte esperando dichos resultados.
6. Priorizar gaps por riesgo y valor: bloqueante, alto, medio, bajo; sin crear cuotas arbitrarias.

## Límites

- Solo lectura; no ejecutar auditorías que escriban JSON, capturas, baselines o reports.
- No hacer browser tests ni cambiar configuración.
- Reportar discrepancies sin modificar el baseline.

## Entrega

Resumen de métricas con método reproducible, revisión de reportes 1–5, gaps priorizados y lista de decisiones que necesita el arquitecto. Evidencia `ruta:línea`; ningún cambio ni commit.
