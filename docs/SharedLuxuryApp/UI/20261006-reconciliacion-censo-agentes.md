# Reconciliación de los seis censos externos

**Fecha:** 2026-10-06
**Modo de los agentes:** read-only; sin ediciones ni commits.
**Checkout base de auditoría:** Angular `main`, `4b66d24e3`, limpio y alineado con `origin/main`.

## Resultado de integración

Se recibieron los censos de botones, overlays, inputs, adaptive/primitives/core, web/mobile y calidad transversal. Agente 6 redactó su informe antes de tener disponibles los resultados de Agentes 1–5: su frase “reportes inexistentes” describe el snapshot que auditó, no el estado final de esta respuesta; queda supersedida por esta reconciliación.

Build fresco en baseline de auditoría: bundle completo en 118.493 s, 0 errores/warnings. Fase 1 catálogo quedó en commit `b01151c30`; build posterior también completó, 0 errores y 0 warnings impresos. `logs.txt` permanece vacío.

## Hallazgos por frente

### 1. Botones

- API real confirmada: `ButtonWeb` / `lux-button-web`, `ButtonMobile` / `lux-button-mobile`; no existe `adaptive/button` ni selector `<lux-button>`.
- En consumers: Agente 1 encontró 627 archivos importando `ButtonWeb`, 157 `ButtonMobile`; ambos contratos comparten props principales, pero no equivalen aún. `severity` y variantes visuales son web; mobile usa `color`/`fill` y `variant` semántica; `badgeCount` solo web; `emoji` no se consume; icon resolver difiere; defaults de icon-only pueden anunciar “Continuar”. Evidencia directa en `shared/ui/buttons/{web/button.ts,mobile/button.ts,base/base-button.ts,mobile-button-base.ts}`.
- Path counts producción del baseline: `@ui/buttons/web` 627, `/mobile` 157, `/shared` 161. Agente 1 reportó 206 menciones a `ConfirmService` con scope de búsqueda más amplio, que incluye tests; no mezclar conteos.
- El proyecto no usa `@ui/buttons` barrel: consumidores importan subpaths. `ConfirmService` tiene imports profundos y dependencia a `@core`/`SwalService`.
- `IlButtonGroup` existe, pero `git grep` solo encuentra clase/selector y metadata de `ui-dictionary.ts`; la implementación no importa `ButtonWeb` que su template usa. Clasificación propuesta: huérfano/deuda; no eliminar sin que owner apruebe.
- `admin.luxuryapp/infrastructure/catalog-component-ui/catalog-web-item/catalog-web-item.ts` contenía **47 tags activos** `il-button*`/`iw-button*`; lazy route viva confirmada en `admin.routes.ts:585-588`. Build verde no acreditaba que esos tags renderizaran botones reconocidos.

### Resultado Fase 1 — catálogo Admin

- Implementado en commit `b01151c30`, exactamente un archivo: `catalog-web-item.ts`, +103/−66.
- Cambió los 47 elementos runtime: 36 `il-button*` + 11 `iw-button*`; regex contra parent confirma 47 antes y 0 después. Usa `kind`/`displayMode` para botones, `lux-pdf-viewer-trigger` para PDF, elimina `ticketId`/`state` no soportados y actualiza tooltip/variant.
- Verificación reportada por implementador: build exit 0, `audit:ui` exit 0, `git show --check` limpio.
- QA visual posterior: 1280×720 y 390×844, API 200, consola sin errores, cero overflow horizontal y demo funcional. No se guardaron credentials/cookies/HAR/capturas en repo.
- Axe scope reportó 3 violaciones reales y 1 incomplete: 4 `.ds-icon-btn` nativos sin nombre, `ion-spinner` sin nombre, `ion-icon` como imagen sin alternativa; contraste mobile requiere comprobación manual. No afectan a los `lux-button-web` migrados.
- Shell conserva ~19 botones icon-only cuyo nombre accesible termina en fallback genérico “Continuar”; debe auditarse por separado.
- Prompt de QA: `20261006-fase1-admin-catalog-qa-prompt.md`.
- La tabla del agente agrupó categorías que se solapan (suma 57), pero el conteo global del diff/regex confirma 47. Usar el total global.

### 2. Overlays / accesibilidad

- Consumers reportados: modal 7, confirm dialog 3, popover 7 tags adaptativos + 4 web directos, processing overlay 1. Tooltip: baseline encontró 85 imports de producción; Agente 2, 86 imports y 23 usos `[lxTooltip]`. El delta depende del scope/conteo y queda marcado para normalización.
- Source-visible, no todavía QA de navegador: dialogs web sin `aria-modal`, relación título/nombre accesible, Escape y gestión de foco/restauración; confirm Ionic también carece de varias de esas señales. Processing overlay no anuncia estado/progreso (`aria-live`/`aria-busy`/`progressbar`). Popover web declara `focusOnShow` pero el informe no halló que lo aplique.
- `LxPopover` usa `any`; `LxActionSheet` no tiene contrato explícito ni consumer runtime identificado; posible duplicado `[lxTooltip]` (`LxTooltip` stub frente a `LxTooltipDirective`). Verificar casos reales antes de deprecar.
- Evidencia de configuración: workflow CI usa `continue-on-error: true` para a11y (`.github/workflows/design-system.yml:77-80`); Storybook deja `a11y.test: "todo"` (`.storybook/preview.ts:18-23`). `a11y-targets.json` declara 7 rutas, 5 requieren sesión. `audit:a11y` no sustituye QA autenticado.

### 3. Inputs / Forms

- Inventario reportado: 24 adaptativos, 18 bridges/custom web + 24 implementaciones web, 27 mobile; 103 specs. Requiere mantener tabla de conteos separada por selector, clase y archivo para evitar sumar bridges y controles como categorías equivalentes.
- Riesgos principales: contratos CVA de `disabled`/`touched` inconsistentes; select web/Ionic emite payload distinto; tipos de fecha mixtos (`Date|string|any`); uploader PDF acoplado a API/dialog y CVA incompleto; tests no cubren integración de `FormGroup`, readonly ni paridad.
- Uso reportado alto: texto 698, select 560, textarea 258, fecha 234, número 195, checkbox 135; búsquedas léxicas, no consumidores únicos garantizados.
- Prioridad sugerida: arreglar bases CVA y acordar contrato select antes de ampliar wrappers/migraciones.

### 4. Adaptive, primitives y core

- Scope reportado: 132 TS de producción (adaptive 56, primitives 22, core 54), 92 carpetas adaptive presentes físicamente, 38 vacías en el checkout auditado.
- Contradicciones materiales reportadas: adaptive table/paginator con fallback web incompleto; stepper renderiza Ionic en ambas ramas; icon usa sistemas distintos por plataforma; `widget-card` tiene semántica de negocio; stub de tooltip duplicado; `[lxWeb]`/`[lxMobile]` sin barrel/spec.
- Primitives con nombres genéricos pueden llevar lógica de negocio; no promover a API estable solo por prefijo. Clasificar consumer, propietario, contrato y alcance antes de mover o borrar.
- Vacíos: agentes discrepan en denominador y en si incluyen directorios físicos no rastreados por Git. No se consideran componentes ni se borran como parte de esta fase.

### 5. Web / mobile

- Agente 5 reporta 45 familias con pareja, 36 solo web y 12 solo mobile; también 55 nombres sin implementación y 93 directorios placeholder físicos. Tratar estos conteos como inventario de carpetas del método del agente, no como 231 componentes versionados.
- Consumers mobile destacados: `app-data-view-mobile` 217, `ili-list-item` 189, `ili-action-menu` 142. Web: `lux-pdf-viewer-trigger` 38, `lux-pdf-viewer-modal` 26, charts 16. Subcomponentes de tabla tienen consumo en template que no se ve como import de clase; no clasificarlos muertos por import count cero.
- 42 adaptativos sin `core.base` y dos bases sin wrapper adaptive son señales para revisar arquitectura; no constituyen automáticamente defectos: confirmar la función y los consumers.

### 6. Calidad transversal y reconciliación numérica

- Agente 6 reporta 313 archivos productivos con `@Component`, 316 decoradores, 60 archivos con `@Directive`, 64 decoradores. Esto reconcilia baseline: **decoradores** y **archivos fuente** son métricas distintas.
- Dependencias host: 113 archivos únicos con `@core`/`@shared`/`src/app`, incluyendo 78 archivos con `PlatformService`; baseline cuenta líneas de imports, no archivos. No sumar estas métricas.
- A11y estática: agente reporta 54 archivos con señales `aria`/`role`, baseline medía 51 en TS productivo con patrón más estrecho. Requiere un comando/scope canónico; ninguna cifra es cumplimiento WCAG.
- Tests: heurísticas de tokens (`createComponent`, `expect`, etc.) no prueban profundidad de cobertura. Usarlas solo para encontrar muestras y revisión manual.
- CI/Storybook: a11y es informativo; requiere política de bloquear gradualmente y resolver targets autenticados. El único story detectado sigue siendo chart wrapper.

## Decisiones del orquestador

1. No iniciar reemplazo masivo ni declarar web/mobile internos: consumidores directos existen.
2. No implementar todavía `lux-button`: contrato común tiene brechas documentadas. Primero contrato y tests de compatibilidad, luego PoC adaptativo acotado.
3. Migración catálogo Admin completada en `b01151c30` y smoke QA autenticada completada; a11y del demo/shell queda como follow-up separado.
4. Se prepararon seis prompts para reparar suffixes malformados restantes. No iniciar scopes nuevos hasta que se atribuyan y reporten cambios abiertos del working tree.
5. Después: overlays web/Ionic con teclado/foco y CVA inputs, por lotes con owner; contrato/adaptador de botones tras aprobar diferencias de API.
5. Agente 6 deberá emitir addendum si hace falta sobre reconciliation snapshot; su informe de “reportes inexistentes” no bloquea la matriz ya consolidada.

## Estado de código

Los seis censos fueron read-only. La implementación P0 fue hecha por agente externo y limitada a `catalog-web-item.ts`. HEAD Angular es `b01151c30`, local `main` ahead 1 de `origin/main` al snapshot; no consta push. Se observaron 13 paths modificados sin commit en el subrepo al cierre del análisis: ocho listados desktop de `shared.luxuryapp` coinciden con allowlist del prompt Agente 3; `work-position-form.{html,ts}`, `catalog-web-item.ts`, `shared/ui/buttons/base/base-button.ts` e `inputs/web/input-file/input-file.ts` requieren confirmar dueño/alcance. No stagear/commitear esos archivos por asociación; verificar autorización individual.

Esta reconciliación modifica solo documentación. Toda implementación futura se ejecutará por agentes externos con prompt faseado, scope de rutas, ownership único y gates; el orquestador revisa e integra.
