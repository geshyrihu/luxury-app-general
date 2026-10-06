# Fase 0 — Censo de API, consumidores y calidad (`shared/ui`)

**Fecha:** 2026-10-06
**Estado:** listo para distribuir a seis agentes externos en paralelo.
**Modo:** investigación read-only. Sin código, sin commits, sin staging.

## Propósito

Completar el Gate 0 del [roadmap](./20261006-roadmap-framework-lux-interno.md): disponer de una matriz sustentada por rutas/líneas antes de definir API interna y abrir trabajo de implementación. Baseline de partida: [inventario](./20261006-baseline-framework-lux.md) y [matriz inicial](./20261006-matriz-api-consumidores-ui.md).

## Reglas comunes para cada agente

1. Inspeccionar el estado vigente de `appsweb/angular` en `main`; no editar archivos ni ejecutar autofix/codemods.
2. No basarse en reportes históricos sin validar el código actual.
3. Cada afirmación debe tener evidencia `ruta:línea` o conteo reproducible con comando y scope.
4. Distinguir API pública deseada de API de facto; `lux-*-web/mobile` ya puede tener consumidores.
5. No llamar “no usado” a un componente únicamente por grep de selector. Revisar imports TypeScript, templates, `ngComponentOutlet`, rutas lazy y generación dinámica donde aplique.
6. Entregar Markdown breve con tablas, riesgos y preguntas que requieran decisión arquitectónica. Ningún agente decide por sí solo cambios de contrato.

## Asignaciones paralelas

### Agente 1 — Botones: contrato y adopción

**Scope:** `shared/ui/buttons/**` y consumidores `modules/**`, `core/**`, `shared/**` que importan botones.

Entregar:

- Matriz `ButtonWeb`/`ButtonMobile`: selector/clase, `kind`, presentación, variantes/size, loading/disabled, outputs, accesibilidad y capacidades exclusivas.
- Conteo por export/import path y por módulo; separar imports de HTML/templates y demos.
- Propuesta de API común `lux-button` con tabla de mapeo web/Ionic; listar incompatibilidades (p. ej. badge/tracking, tooltip, appearance).
- Consumidores piloto sugeridos por volumen/representatividad y pruebas que verificarían compatibilidad.

No proponer selector por cada variante (`lux-button-web-add`, etc.). No editar código.

### Agente 2 — Overlays y gestión de foco

**Scope:** `adaptive/{modal,confirm-dialog,popover,action-sheet,processing-overlay,tooltip}`, sus bases `core/**`, pares `web/**`/`mobile/**` y consumidores.

Entregar:

- API real de cada overlay, selección de plataforma, dependencia al host y consumidores por import.
- Evidencia de teclado: Escape, Tab/foco inicial, trampa, restauración, cierre al backdrop, roles/labels/live regions.
- Separar evidencia de source de comportamiento realmente verificado en navegador; indicar gaps sin asumir.
- Orden de remediación de a11y con pruebas recomendadas y files owner.

No tocar servicios o schemas globales; no añadir `CUSTOM_ELEMENTS_SCHEMA`.

### Agente 3 — Inputs y contrato Angular Forms

**Scope:** `shared/ui/inputs/{adaptive,core,web,mobile}` y consumers de formularios.

Entregar:

- Tabla por tipo: variantes existentes, selector/clase/export, web/Ionic, `ControlValueAccessor`, Reactive Forms, `ngModel`, estados, validación, valor y defaults.
- Mapear bridges históricos `custom-input-*-signal` a su adaptador real.
- Señalar diferencias entre plataformas que impidan API compartida honesta.
- Conteo de consumidores por clase de input y tests de contrato faltantes.

No cambiar DTOs ni contratos compartidos.

### Agente 4 — Adaptive, primitives y core restantes

**Scope:** `shared/ui/adaptive/**`, `primitives/**`, `core/**`, excluyendo overlays, botones e inputs asignados arriba.

Entregar:

- Selector, export, clase, pareja de plataforma, caso de uso, consumers y estado de pruebas por componente.
- Marcar `app-specific`, experimental, duplicado o candidato reutilizable solo con evidencia; no decidir borrados.
- Detectar dependencias `@core`, `@shared`, `src/app` y servicios de host que comprometen reuso.
- Proponer cuáles necesitan wrappers adaptativos y cuáles deben permanecer primitivas.

### Agente 5 — Implementaciones web/mobile y fronteras

**Scope:** `shared/ui/web/**` y `shared/ui/mobile/**`, excluyendo subfamilias asignadas a Agentes 1–3.

Entregar:

- Inventario emparejado web/Ionic y componentes huérfanos por plataforma.
- Selectores actuales, exports, consumers directos, imports de terceros, assets y dependencia de tokens.
- Clasificación de componentes genéricos versus propios de un módulo, con ejemplos `ruta:línea`.
- Verificación read-only de las reglas actuales de `audit:ui` frente a imports desde features.

No renombrar selectores ni mover carpetas.

### Agente 6 — Calidad transversal y reconciliación

**Scope:** auditoría transversal de `shared/ui` completa; no modifica código.

Entregar:

- Métricas frescas de specs y tests conductuales, clasificando una muestra con criterio explícito.
- a11y: overlays, controles, axe/Playwright y cobertura actual; separar reglas auditadas de inferencias.
- i18n: servicios/keys/textos hardcodeados; theming/tokens; Storybook coverage/CI.
- API/distribución: `index.ts`, `public-api`, imports desde app y host dependencies.
- Reconciliar conteos de Agentes 1–5, identificar duplicados y discrepancias; no ampliar scopes ni editar.

## Integración del censo

El orquestador:

1. Revisa y deduplica los seis reportes; conserva evidencia y marca discrepancias para reinspección.
2. Actualiza la matriz maestra y el baseline en este directorio; versiona solo documentación UI por pathspec.
3. Convierte decisiones pendientes en ADR/plan breve y las presenta antes de cambios de contrato.
4. Emite prompts de implementación por fase, con archivos permitidos, pruebas y ownership exclusivo.
5. Agentes externos implementan código; el orquestador controla gates/revisión/integración. Edición concurrente solo con worktrees y paths no solapados.

## Gate 0 terminado cuando

- Matriz cubre cada componente/directiva de producción y declara explícitamente excepciones.
- Consumidores y dependencias host están medidos contra baseline vigente.
- Tests, a11y, i18n, tokens, Storybook y distribución tienen métricas reproducibles.
- Contratos y ownership pendientes están listados, sin decisiones técnicas asumidas.
- Roadmap de implementación ordena dependencias y gates; no quedan codemods masivos sin allowlist.
