# Catalogo `shared/ui`: estado y refactor

**Fecha de corte:** 2026-10-05  
**Fuente:** `appsweb/angular/src/app/shared/ui`  
**Proposito:** medir avance, registrar estado actual y definir estado objetivo sin confundir inventario con cambios aprobados.

## Resumen ejecutivo

| Medicion | Actual |
|---|---:|
| Archivos versionados bajo `shared/ui` | 829 |
| Implementaciones TypeScript, sin specs | 459 |
| Archivos de prueba `*.spec.ts` | 357 |
| Categorias principales | 10 |
| Candidatos legacy de botones dentro de `shared/ui` | 51 |
| Migraciones de consumidores completadas en esta fase | 13 excepciones finales |

El numero `51` es **candidato tecnico**, no orden de borrado. Incluye variantes `web-label`, `web-icon`, `mobile-label` y `mobile-icon`. Cada item debe conservar contrato o migrarse con evidencia antes de eliminarse.

## Estado actual

Arquitectura encontrada:

```text
shared/ui/
â”œâ”€â”€ adaptive/                 wrappers que deciden web/mobile
â”œâ”€â”€ buttons/                  base, web, mobile y variantes legacy
â”œâ”€â”€ charts/                   exports y chart base
â”œâ”€â”€ core/                     contratos/base sin plataforma
â”œâ”€â”€ image-analysis-dialog/   componente especializado
â”œâ”€â”€ inputs/                   adaptive, core, web y mobile
â”œâ”€â”€ mobile/                   implementaciones mobile
â”œâ”€â”€ primitives/               piezas agnosticas
â””â”€â”€ web/                      implementaciones desktop/web
```

Regla objetivo existente en convenciones:

- Consumir `lux-*` cuando exista wrapper adaptativo.
- No consumir `lux-*-web` ni `lux-*-mobile` desde features.
- Mantener `web/` y `mobile/` como implementaciones internas.
- No modificar shared transversal sin analisis de impacto.

## Inventario completo por categoria

Los numeros de `items` son entradas de primer nivel. En `core`, por su estructura plana, son archivos de contrato/base y no carpetas de componente.

| Categoria | Items | TS sin specs | Archivos totales | Estado objetivo |
|---|---:|---:|---:|---|
| `adaptive` | 54 | 56 | 105 | Mantener como API publica adaptativa |
| `ai-chat-widget` | 3 | 1 | 3 | Mantener como componente especializado |
| `buttons` | 12 | 65 | 118 | Consolidar variantes legacy gradualmente |
| `charts` | 2 | 2 | 2 | Mantener export y wrapper |
| `core` | 86 | 54 | 86 | Mantener contratos agnosticos |
| `image-analysis-dialog` | 2 | 1 | 2 | Mantener como especializado |
| `inputs` | 5 | 111 | 214 | Consolidar entradas adaptativas y signal |
| `mobile` | 57 | 58 | 99 | Mantener como implementacion interna |
| `primitives` | 20 | 22 | 39 | Mantener como piezas agnosticas |
| `web` | 80 | 89 | 161 | Mantener como implementacion interna |

### `adaptive`

`accordion`, `action-sheet`, `avatar`, `badge`, `breadcrumbs`, `card`, `carousel`, `checkbox`, `chip`, `confirm-dialog`, `debug-console`, `divider`, `editor`, `empty-state`, `fieldset`, `file-upload`, `icon`, `image`, `infinite-scroll`, `listbox`, `loader`, `menu`, `menubar`, `message`, `modal`, `multi-select`, `offline-indicator`, `paginator`, `panel`, `popover`, `processing-overlay`, `progress-bar`, `pull-to-refresh`, `radio-button`, `rating`, `sidebar`, `skeleton`, `spinner`, `split-button`, `status-badge`, `stepper`, `steps`, `swipe-actions`, `table`, `tabs`, `tag`, `tap-to-top`, `timeline`, `toast`, `toolbar`, `tooltip`, `tree`, `viewport`, `widget-card`.

### `buttons`

| Grupo | Items actuales | Estado objetivo |
|---|---:|---|
| `base` | 3 | Base comun |
| `button-group` | 1 | Mantener |
| `mobile` | 2 | API mobile moderna |
| `mobile-icon` | 12 | Candidato a consolidacion |
| `mobile-label` | 13 | Candidato a consolidacion |
| `shared` | 4 | Revisar contratos compartidos |
| `web` | 2 | API web moderna |
| `web-icon` | 13 | Candidato a consolidacion |
| `web-label` | 13 | Candidato a consolidacion |

**Candidatos de boton legacy:** `12 + 13 + 13 + 13 = 51` implementaciones en los cuatro grupos de variantes. El objetivo funcional es que features consuman `lux-button-web` o `lux-button-mobile`, y que las variantes internas no se amplien.

### `charts`

`chart.ts`, `index.ts`.

### `core`

Contratos/base actualmente presentes: `accordion`, `avatar`, `badge`, `bottom-nav`, `breadcrumbs`, `card`, `carousel`, `checkbox`, `chip`, `confirm-dialog`, `divider`, `editor`, `empty-state`, `fieldset`, `file-upload`, `image`, `infinite-scroll`, `listbox`, `loader`, `menu`, `menubar`, `message`, `modal`, `multi-select`, `offline-indicator`, `paginator`, `panel`, `popover`, `processing-overlay`, `progress-bar`, `pull-to-refresh`, `radio-button`, `rating`, `select-button`, `sidebar`, `skeleton`, `spinner`, `split-button`, `status-badge`, `stepper`, `steps`, `swipe-actions`, `table`, `tabs`, `tag`, `tap-to-top`, `timeline`, `toast`, `toggle-switch`, `toolbar`, `tooltip`, `tree`, mas specs y directivas de stepper.

### `image-analysis-dialog`

`image-analysis-dialog.ts`, `image-analysis-dialog.spec.ts`.

### `inputs`

| Grupo | Items |
|---|---:|
| `adaptive` | entradas adaptativas |
| `core` | `base-input-signal` y validacion |
| `mobile` | implementaciones mobile |
| `web` | inputs web y `custom-input-*-signal` |
| raiz | `index.ts` |

El objetivo es consumir inputs signal oficiales y evitar inputs raw o rutas internas desde features.

### `mobile`

`accordion`, `action-menu-mobile`, `app-icon`, `avatar`, `badge`, `bottom-nav`, `breadcrumbs`, `card`, `carousel`, `checkbox`, `chip`, `confirm-dialog`, `data-view-mobile`, `divider`, `editor`, `empty-state`, `fieldset`, `file-upload`, `image`, `infinite-scroll`, `ionic-segment`, `listbox`, `list-item`, `loader`, `menu`, `menubar`, `message`, `modal`, `multi-select`, `offline-indicator`, `page`, `paginator`, `panel`, `popover`, `processing-overlay`, `progress-bar`, `pull-to-refresh`, `radio-button`, `rating`, `sidebar`, `skeleton`, `spinner`, `split-button`, `status-badge`, `stepper`, `steps`, `swipe-actions`, `tab-bar`, `table`, `tabs`, `tag`, `tap-to-top`, `timeline`, `toast`, `toolbar`, `tooltip`, `tree`.

### `primitives`

`action-icons-group`, `activity-log`, `app-icon`, `approval-workflow`, `avatar-group`, `breakdown-list`, `focus-trap`, `gauge`, `inventory-level`, `kpi-card`, `lead-scoring`, `live-region-announcer`, `multiple-segmented-control`, `order-status`, `ranked-list`, `realtime-indicator`, `segmented-control`, `stat-card`, `tour`, `tristate-switch`.

### `web`

`accordion`, `action-menu`, `avatar`, `badge`, `bitacora-filtro-fecha`, `breadcrumbs`, `card`, `carousel`, `charts`, `checkbox`, `chip`, `comparison-table`, `confirm-dialog`, `customer-360`, `dashboard-layout`, `data-grid`, `dialog`, `divider`, `document-previewer`, `editor`, `empty-state`, `fieldset`, `file-upload`, `funnel-chart`, `gantt`, `header-customer`, `heatmap`, `image`, `image-fallback`, `infinite-scroll`, `listbox`, `loader`, `lux-table`, `lux-table-caption`, `lux-table-checkbox`, `lux-table-empty-message`, `lux-table-footer`, `lux-table-global-filter`, `menu`, `menubar`, `mesanio`, `message`, `module-guide`, `multi-select`, `offline-indicator`, `paginator`, `panel`, `pdf-viewer-modal`, `pivot-table`, `popover`, `processing-overlay`, `progress-bar`, `pull-to-refresh`, `radio-button`, `rango-calendario-mes-anio`, `rango-calendario-yyyymmdd`, `rating`, `report-header`, `section-nav`, `select-button`, `sidebar`, `skeleton`, `spinner`, `split-button`, `status-badge`, `steps`, `swipe-actions`, `tabs`, `tag`, `tap-to-top`, `territory-map`, `timeline`, `title-page-report`, `title-page-report-maintenance`, `title-solicitud-pago-pdf`, `toast`, `toggle-switch`, `toolbar`, `touchspin`, `tree`.

## Avance de refactor

### Hecho

- Migrados consumidores legacy de botones en modulos previamente autorizados.
- Eliminadas las referencias `WebButtonLabelSave` y `<il-button-save>` bajo `src/app/modules`.
- Catalogo Admin actualizado para mostrar `ButtonWeb` en el caso Save.
- Ocho consumidores legacy de Edit migrados en `admin/reports/customer-provider`, `maintenance/logbooks/meters`, `accounting/general-ledger/dynamic-reports`, `accounting/general-ledger/accounting-accounts`, `accounting/general-ledger/pending-minutes` y `accounting/fundings/sat-funding-detail`.
- Primer lote Fase 2 completado: 4 descargas PDF de `collections/aspel-collections-haus` migradas.
- Segundo lote Fase 2 validado: 2 descargas de `accounting/general-ledger/aspel-account-audit` migradas.
- Lote delegado Operations validado: 74 usos Edit migrados en 131 archivos.
- Lote delegado Maintenance validado: 42 usos Edit migrados en 83 archivos nuevos; no incluye meters mobile excluido.
- Lote delegado Admin validado: 23 usos Edit migrados en 46 archivos nuevos; desktop customer-provider ya estaba migrado.
- Lote delegado Human Resources validado: 18 usos Edit migrados en 36 archivos.
- Lote delegado Legal validado: 15 usos Edit migrados en 26 archivos.
- Lote delegado Purchases validado: 12 usos Edit migrados en 22 archivos.
- Lote delegado Recruitment validado: 28 usos Edit migrados en 50 archivos.
- Lote delegado Collections validado: 21 usos Edit migrados en 20 archivos nuevos; `aspel-collections-haus` ya estaba migrado y excluido.
- Lote delegado Auth validado: 2 usos Edit migrados en 4 archivos.
- Lote delegado Public validado: 1 uso Edit migrado en 2 archivos.
- Lote delegado Management validado: 13 usos Edit migrados en 12 archivos; 8 usos dentro de templates mobile conservan `ButtonWeb` por compatibilidad y quedan como deuda tÃ©cnica.
- ReconciliaciÃ³n Maintenance validada: 2 usos Edit mobile de meters migrados.
- ReconciliaciÃ³n Accounting validada: 11 usos Edit residuales migrados y 2 descargas de Aspel audit ya integradas.
- `npm run audit:ui` pasa.
- Commits publicados en Angular `main`: `69fe56995`, `7fcd648e0`, `76f291de2` y `7954a03be`.

### Estado medible

| Frente | Total | Hecho | Pendiente | Observacion |
|---|---:|---:|---:|---|
| Desktop/mobile de modulos | 210 | 153 | 8 | 49 omitidos/no candidatos; ver bitacora |
| Excepciones finales de consumidores | 13 | 13 | 0 | Cerradas en commit `1bc077f35` |
| Lote Edit web/icon | 8 consumidores | 8 | 0 | `admin/reports/customer-provider`, `maintenance/logbooks/meters`, `accounting/general-ledger/dynamic-reports`, `accounting/general-ledger/accounting-accounts`, `accounting/general-ledger/pending-minutes`, `accounting/fundings/sat-funding-detail` |
| Variantes de botones dentro de shared/ui | 51 | 0 | 51 candidatos | Requiere analisis de contrato antes de borrar |
| Inventario de shared/ui | 829 archivos | catalogado | 0 | Este documento |

El total desktop/mobile usa su propio criterio de candidatura. No debe sumarse al total de archivos de `shared/ui`.

## Como va a quedar

```text
Feature
  -> API publica `lux-*` / wrappers adaptativos
       -> `adaptive/` decide plataforma
            -> `web/` o `mobile/`
                 -> `core/` contratos comunes
                 -> `primitives/` piezas agnosticas
```

Para botones:

```text
Feature
  -> <lux-button-web> o <lux-button-mobile>
       -> ButtonWeb / ButtonMobile
            -> BaseButton
```

Variantes `web-label`, `web-icon`, `mobile-label` y `mobile-icon` quedan solo como compatibilidad interna durante migracion controlada. No se deben usar para codigo nuevo.

## Plan por fases y hoja de control

### Regla de conteo

Los `51` son implementaciones legacy dentro de `shared/ui`. Los `435` son usos legacy encontrados en consumidores limpios fuera de archivos concurrentes. No se suman: representan niveles distintos.

### Tablero general

| Fase | Alcance | Total inicial | Hecho | Pendiente | Responsable | Estado |
|---|---|---:|---:|---:|---|---|
| 0 | Inventario, contratos y riesgos | 435 usos | 435 auditados | 0 | Agente auditor | âœ… Cerrada |
| 1 | `add`, `save`, `edit`, `item` simples | 65 usos de bajo riesgo iniciales | 271 Edit | Por recalcular | Orquestador + agentes | ðŸ”„ En curso |
| 2 | `download`, `tracking` y acciones simples | 53 usos | 18 descargas | 35 | Agente delegado + orquestador | ðŸ”„ En curso |
| 3 | `delete`, `confirm`, `send-email`, `active-desactive` | 221 alto riesgo | 0 | 221 | Orquestador + revisiÃ³n | â›” Bloqueada por contrato |
| 4 | PDF y componentes con API especial | Por medir | 0 | Por medir | Orquestador | â³ Pendiente |
| 5 | CatÃ¡logos/demo y limpieza de exports | 9 usos Edit auditados | 0 migrados | 9 excepciones intencionales | Agente delegado | âœ… Auditada |
| 6 | Build, pruebas y QA de producciÃ³n | Global | AuditorÃ­a UI | Build pendiente | Orquestador | â³ Pendiente |

### Fase 0: inventario y contratos

**Estado: âœ… cerrada.** AuditorÃ­a delegada en modo solo lectura.

Resultados:

- `iw-*`: 191 usos.
- `ili-*`: 142 usos.
- `il-*`: 91 usos.
- `ii-*`: 11 usos.
- Total: 435 usos legacy en archivos limpios.
- Riesgo alto: 221 usos.
- Riesgo medio: 149 usos.
- Riesgo bajo: 65 usos.
- `ButtonWeb` no soporta confirmaciÃ³n genÃ©rica actualmente.

### Fase 1: migraciÃ³n mecÃ¡nica de bajo riesgo

**Estado: ðŸ”„ en curso. Responsable: orquestador.**

Permitido:

- `edit` simple con `(clicked)`.
- `add`, `save` e `item` sin contratos especiales.
- `ButtonWeb` o `ButtonMobile` con `kind` equivalente.
- Preservar `displayMode`, `severity`, `variant`, `size`, `tooltip`, `ariaLabel` y eventos.

No permitido:

- Migrar `delete` a click directo.
- Cambiar eventos `confirmed` por `clicked` sin confirmaciÃ³n equivalente.
- Tocar archivos modificados concurrentemente.
- Borrar definiciones legacy antes de vaciar consumidores.

Avance actual: 271 consumidores Edit migrados y validados. Deuda pendiente: 9 usos de catalog/demo Admin conservados como showcase, 1 snippet sin evento en conventions viewer y 8 botones Management mobile que conservan API Web. Accounting mantiene solo residuos en cÃ³digo muerto/comentado o acciones sin `(clicked)`.

### Fase 2: acciones simples adicionales

**Auditoria completada por agente delegado.** Resultado: 50 usos de download y 3 de tracking. Los 3 de tracking quedan fuera del lote mecanico porque `ButtonWeb kind="tracking"` no soporta `ticketId`, `badgeCount` ni `clickTracking`.

Primeros lotes seguros identificados:

- Cuatro exportaciones de `collections/aspel-collections-haus`.
- Exportaciones de `accounting/aspel-account-audit`.
- Exportacion de `maintenance/report-consumption`.
- Exportacion de `operations/google-calendar/calendar/fundings`.

Exclusiones registradas:

- Tracking con payload propio.
- Controles que abren file picker aunque usen nombre download.
- Botones desktop dentro de templates mobile.

Migrar `download` y `tracking` solo cuando el uso sea click directo y no dependa de propiedades especiales. Antes de cada lote:

1. Medir usos por mÃ³dulo.
2. Separar desktop/mobile.
3. Revisar inputs y eventos.
4. Migrar lote de maximo 5-10 consumidores.
5. Ejecutar `npm run audit:ui` y pruebas focalizadas.

### Fase 3: confirmaciÃ³n y acciones sensibles

No iniciar reemplazo masivo hasta definir contrato. Opciones a evaluar:

- Extender `ButtonWeb` con confirmaciÃ³n explÃ­cita y evento `confirmed`.
- Crear wrapper semÃ¡ntico de confirmaciÃ³n reutilizable.
- Mantener componentes legacy de confirmaciÃ³n como compatibilidad temporal.

Puerta obligatoria: prueba de comportamiento que confirme que cancelar no ejecuta acciÃ³n destructiva.

### Fase 4: componentes especiales

Tratar separadamente `view-pdf`, `send-email`, `active-desactive`, `customClick`, acciones con `state` y componentes que reciben nombre de archivo, URL o configuraciÃ³n propia. No aplicar reemplazo mecÃ¡nico.

### Fase 5: catÃ¡logo y limpieza

- Migrar ejemplos de `catalog-component-ui` despuÃ©s de producciÃ³n.
- AuditorÃ­a Fase 5 completada: los 9 Edit restantes son showcases intencionales de APIs legacy; no migrar parcialmente.
- Actualizar `ui-dictionary.ts` y documentaciÃ³n.
- Eliminar exports/archivos legacy solo con cero consumidores verificado.
- Mantener specs o reemplazarlas por cobertura equivalente.

### Fase 6: puerta de producciÃ³n

Requisitos para marcar fase cerrada:

- `npm run audit:ui` pasa.
- `npm run build` termina exitosamente.
- Pruebas focalizadas pasan.
- QA de flujos afectados en desktop y mobile.
- `git diff --check` pasa.
- Cambios concurrentes quedan fuera del commit.

### Protocolo de delegaciÃ³n

- Un agente por fase; no dos agentes editan mismo archivo.
- Agentes exploradores devuelven rutas, conteos y riesgos; no editan.
- Agentes constructores reciben lote cerrado y no hacen commits globales.
- Cada fase termina con evidencia en esta tabla antes de abrir siguiente fase.
- Si build o auditorÃ­a falla, se pausa migraciÃ³n y se registra causa aquÃ­.

## Siguiente trabajo inmediato

1. Continuar Fase 2 con descargas seguras; mantener `tracking` fuera hasta definir payload.
2. DiseÃ±ar contrato de confirmaciÃ³n antes de Fase 3.
3. Ejecutar Fase 6 Ãºnicamente cuando el build deje de estar bloqueado.

## Verificaciones utilizadas

- Conteo de archivos: `git ls-files 'src/app/shared/ui/**/*'`.
- Conteo de implementaciones: archivos `*.ts` excluyendo `*.spec.ts`.
- Conteo de specs: archivos `*.spec.ts`.
- Auditoria de fronteras: `npm run audit:ui`.

## Fuentes

- `conventions/CONVENTIONS.md`
- `conventions/ui/ui-shared-library-architecture.md`
- `conventions/ui/ui-usage-catalog.md`
- `appsweb/angular/BITACORA-REFACTOR-DESKTOP-MOBILE.md`
- `appsweb/angular/src/app/shared/ui`
-   P r o m p t s   d e   o r q u e s t a c i ó n   c r e a d o s   e n   \ p r o m p t s / a g e n t e 1 - b u i l d - y - c o n t r a t o s . m d \ ,   \ p r o m p t s / a g e n t e 2 - p a y l o a d s - t r a c k i n g . m d \   y   \ p r o m p t s / a g e n t e 3 - p d f - e s p e c i a l e s . m d \ . 
 
 

### Actualización: Cierre Fase 3 y Preparación Fase 4
- **Fase 3 Completada**: Los 4 agentes externos (A, B, C, D) finalizaron exitosamente la migración masiva de botones Tier 1 y Tier 2 (incluyendo delete, confirm, send-email) en todos los módulos (operations, ecruitment, maintenance, management, ccounting, dmin, legal, human-resources, purchases, collections).
- Se validaron todos los módulos con 
pm run audit:ui y 
pm run build sin regresiones en las fronteras de arquitectura y trasladando las confirmaciones a ConfirmService y SwalService.
- **Fase 4 (En curso)**: Se han generado 4 nuevos prompts (prompts/agente{A,B,C,D}-fase4-residuals.md) para que los agentes externos liquiden en paralelo la deuda técnica restante: ctive-desactive, código muerto (// CODIGO MUERTO), huecos de coverage en ConfirmService (specs) y actualización de Bitácoras.
