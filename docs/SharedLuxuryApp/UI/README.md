# LuxuryApp UI — índice de arquitectura y avance

**Propósito:** fuente de navegación para evolución de librería UI `lux-*` interna, reutilizable en Angular + Ionic.

## Estado actual

- Warnings Angular de imports no usados: cerrados por commit; `logs.txt` vacío.
- Baseline auditado: `4b66d24e3`; Angular `main` actual en commit local `b01151c30` (1 ahead de `origin/main`, sin push confirmado). Build verde corresponde al baseline de ese commit.
- Estado observado después: 11 archivos del subrepo modificados sin commit; los cambios de `work-position-form.*` se excluyeron tras commit/push del usuario `7dca9a227`. Ver owners/paths en plan Fase 2. No usar árbol actual como build-validado hasta integrar y correr gate nuevo.
- Distribución: librería interna del monorepo; sin publicación npm en alcance actual.
- Baseline técnico: ver [Inventario vigente](./20261006-baseline-framework-lux.md).
- Mapa API/consumidores: [matriz inicial](./20261006-matriz-api-consumidores-ui.md).
- Censo Fase 0: [seis prompts read-only](./20261006-fase0-censo-agentes-externos.md) y [reconciliación de reportes](./20261006-reconciliacion-censo-agentes.md).
- Catálogo Admin: migración y smoke QA reportados completos (`b01151c30`); quedan follow-ups axe y shell.
- Siguiente contrato pendiente: botón adaptativo `lux-button`, precedido por revisión del prompt de contrato y diferencias web/Ionic.
- Prompts listos para reparar sufijos malformados: scopes en [Plan Fase 2](./20261006-fase2-plan-reparacion-tags.md), seis asignaciones con exclusiones explícitas.
- Agente 1 — [Operations](./20261006-fase2-agente1-operations-button-tags.md)
- Agente 2 — [Notifications core](./20261006-fase2-agente2-core-notifications.md)
- Agente 3 — [Catálogos shared.luxuryapp](./20261006-fase2-agente3-shared-catalog-buttons.md)
- Agente 4 — [Demos de catálogo Admin](./20261006-fase2-agente4-admin-catalog-demos.md)
- Agente 5 — [Accounting con budget-proposals protegido](./20261006-fase2-agente5-accounting-bloqueado.md)
- Agente 6 — [Auditoría residual read-only; shared UI sin editar](./20261006-fase2-agente6-shared-ui-y-scan.md)
- Fase 2 integrada en `main` local (2026-10-06): commits `63caaaca2`, `ca6042f90`, merges `b3c9dd196`/`611d5d310`/`0051caf2b`, cherry-pick `73f7f0bd6`. Build + `audit:ui` verdes.
- Fase 2b (residual no cubierto por los 6 agentes anteriores; numeración 1–6 reiniciada, son agentes distintos de los de Fase 2): scopes en [Plan Fase 2b](./20261006-fase2b-plan-reparacion-tags-residual.md), seis prompts nuevos, cada uno con su reporte de ejecución al final del propio `.md`.
  - Agente 1 (Fase 2b) — [Catálogos shared.luxuryapp mobile](./20261006-fase2b-agente1-shared-catalog-mobile-edit.md)
  - Agente 2 (Fase 2b) — [Operations view-pdf residual](./20261006-fase2b-agente2-operations-view-pdf-residual.md)
  - Agente 3 (Fase 2b) — [Accounting view-pdf residual (fuera de budget-proposals bloqueado)](./20261006-fase2b-agente3-accounting-view-pdf-residual.md)
  - Agente 4 (Fase 2b) — [Public, botón add](./20261006-fase2b-agente4-public-add-button.md)
  - Agente 5 (Fase 2b) — [Admin, string de documentación](./20261006-fase2b-agente5-admin-conventions-doc-fix.md)
  - Agente 6 (Fase 2b) — [Investigación de ownership, solo lectura](./20261006-fase2b-agente6-ownership-investigation.md)
- Fase 2c (decisión tomada: crear bridge mobile de PDF, `DialogHandlerService` ya es adaptativo por plataforma): [Agente 1 — bridge mobile del visor de PDF](./20261006-fase2c-agente1-pdf-viewer-trigger-mobile.md). Ejecutado e integrado; único residual del repo tras esto: `budget-rule-list.html` (bloqueado).
- **Gate 0 — matriz técnica generada**: [CSV completo (319 filas)](./20261006-gate0-matriz-componentes.csv), [resumen agregado](./20261006-gate0-matriz-componentes-resumen.md), [triage de violaciones de frontera](./20261006-gate0-violaciones-frontera-triage.md) (28 → 10 reales tras blanquear infra transversal).
- **[¿Qué tan completo está `lux-*` frente a PrimeNG?](./20261006-gate0-brecha-vs-primeng.md)** — corrección de rumbo: se abandona "ownership por componente" (no era el objetivo real); la cobertura ya iguala o supera a PrimeNG, el problema real es fragmentación (checkbox ×6, date-input ×7-8, botón sin wrapper adaptativo) y falta de catálogo navegable.
- Prompts de Fase 0 ya ejecutados:
  - [Agente 1 — Botones](./20261006-fase0-agente1-botones.md)
  - [Agente 2 — Overlays](./20261006-fase0-agente2-overlays.md)
  - [Agente 3 — Inputs](./20261006-fase0-agente3-inputs.md)
  - [Agente 4 — Adaptive/primitives/core](./20261006-fase0-agente4-adaptive-primitives.md)
  - [Agente 5 — Web/mobile](./20261006-fase0-agente5-web-mobile.md)
  - [Agente 6 — Calidad transversal](./20261006-fase0-agente6-calidad.md)
- Siguiente orden: [Roadmap](./20261006-roadmap-framework-lux-interno.md).
- Decisiones y gates completados: [Bitácora](./bitacora-framework-lux.md).

## Documentación relacionada

### Vigente

- [Roadmap de framework interno lux](./20261006-roadmap-framework-lux-interno.md)
- [Baseline de shared/ui](./20261006-baseline-framework-lux.md)
- [Bitácora de avance](./bitacora-framework-lux.md)
- [Plan maestro de naming y secuencia](../DesignSystem/20261002-plan-maestro-secuencia-catalogo-lux.md)
- [Catálogo final reutilizable](../DesignSystem/20261003-catalogo-final-lux-reutilizable.md)
- [Arquitectura shared UI](../../../conventions/ui/ui-shared-library-architecture.md)
- [Catálogo de uso UI](../../../conventions/ui/ui-usage-catalog.md)

### Evidencia histórica

- [Auditoría de naming, consumo y madurez](../DesignSystem/20261002-verificacion-catalogo-marca-lux.md)
- [Reporte Fase 1: adaptive/primitives/core](../DesignSystem/20261003-fase1-rename-adaptive-primitives-reporte.md)
- [Reporte Fase 2: web](../DesignSystem/20261004-fase2-rename-web-reporte.md)
- [Plan de limpieza de warnings](../../SystemLuxuryApp/Shared/20261006-plan-limpieza-warnings-angular.md)

Los reportes históricos conservan evidencia de sus fechas. Para decidir estado actual, usar baseline y bitácora de este directorio.
