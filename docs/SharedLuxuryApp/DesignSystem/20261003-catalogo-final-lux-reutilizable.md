# Catálogo Final de Componentes Reutilizables LuxuryApp

> Fecha: 2026-10-03  
> Estado: objetivo arquitectónico y catálogo de trabajo  
> Fuente: inventario real de `appsweb/angular/src/app/shared/ui/`, plan maestro de migración y auditoría de naming.  
> Alcance: componentes custom reutilizables de la librería `shared/ui`.

## 1. Objetivo final

Construir una librería de componentes custom de LuxuryApp que pueda ser usada por
cualquier módulo sin repetir UI, lógica de formularios, estilos, accesibilidad ni
decisiones de plataforma.

La librería terminada debe ofrecer:

- Una API pública reconocible con prefijo `lux-`.
- Componentes adaptativos que el consumidor usa sin conocer si corre en web o móvil.
- Implementaciones web Bootstrap/native y móvil Ionic separadas internamente.
- Lógica común aislada en `core`/`base`, sin dependencias de plataforma.
- Primitivas agnósticas que no dependen de Bootstrap ni Ionic.
- Inputs adaptativos compatibles con Reactive Forms, `ngModel` y `ControlValueAccessor`.
- Botones unificados por plataforma, con `displayMode` independiente del dispositivo.
- Tokens de diseño, estados, variantes, accesibilidad e internacionalización consistentes.
- Tests de comportamiento, auditoría de fronteras y catálogo visual verificable.
- API pública preparada para convertirse en paquete interno `@lux/ui`.

La librería no será una colección de componentes con nombres nuevos solamente. Será
una plataforma visual estable, documentada y consumible por todos los módulos.

## 2. Resultado visual y técnico esperado

### Uso público esperado

Un módulo no debe importar componentes internos de web o móvil. Debe consumir la API
pública:

```html
<lux-button kind="save" displayMode="both" />
<lux-input-text [control]="form.controls.name" label="Nombre" />
<lux-table [value]="rows" />
<lux-modal />
<lux-icon name="edit" />
```

El mismo HTML debe producir:

- UI Bootstrap/native en escritorio.
- UI Ionic en móvil.
- Misma semántica, datos, validaciones y contrato público.
- Diferencias visuales únicamente cuando la plataforma lo requiera.

### Regla de plataforma

`web/` y `mobile/` siguen siendo implementaciones distintas. No se fuerza una falsa
abstracción que mezcle Bootstrap con Ionic.

`adaptive/` es el único delegador que conoce ambas plataformas y selecciona usando
`PlatformService.isMobile()`.

### Regla de presentación

La decisión entre etiqueta, icono o ambos no depende de web/móvil ni del ancho de
pantalla. Depende del contexto de uso.

```ts
displayMode: 'label' | 'icon' | 'both'
```

## 3. Naming final

### Componentes públicos

```text
lux-<nombre>
```

Ejemplos:

```text
lux-button
lux-input-text
lux-table
lux-card
lux-icon
lux-modal
```

### Implementaciones internas

```text
lux-<nombre>-web
lux-<nombre>-mobile
```

Ejemplos:

```text
lux-button-web
lux-button-mobile
lux-input-text-web
lux-input-text-mobile
lux-table-web
lux-table-mobile
```

Estos nombres no se usan directamente en módulos de negocio.

### Primitivas agnósticas

También usan `lux-<nombre>` porque no tienen implementación web/mobile separada:

```text
lux-icon
lux-kpi-card
lux-stat-card
lux-focus-trap
```

### Clases TypeScript

| Capa | Patrón |
|---|---|
| Pública adaptativa | `LuxNombre` |
| Web interna | `LuxNombreWeb` |
| Mobile interna | `LuxNombreMobile` |
| Lógica común | `BaseNombre` o `LuxNombreCore` |
| Directiva agnóstica | `LuxNombreDirective` |

### Carpetas objetivo

```text
shared/ui/
├── core/                    # lógica común, contratos, bases y utilidades UI
├── adaptive/                # API pública lux-*, delegadores web/mobile
├── web/                     # implementaciones Bootstrap/native internas
├── mobile/                  # implementaciones Ionic internas
├── primitives/              # componentes agnósticos sin variante de plataforma
├── buttons/
│   ├── core/
│   ├── web/                 # lux-button-web
│   └── mobile/              # lux-button-mobile
└── inputs/
    ├── core/
    ├── adaptive/            # lux-input-*
    ├── web/                 # lux-input-*-web
    └── mobile/              # lux-input-*-mobile
```

## 4. Catálogo público adaptativo

Estos son los componentes de `adaptive/` que deben formar el catálogo público. El
selector objetivo es `lux-<nombre>`.

### Navegación y estructura

`lux-accordion`, `lux-breadcrumbs`, `lux-bottom-nav`, `lux-dock`,
`lux-menu`, `lux-mega-menu`, `lux-menubar`, `lux-panel-menu`, `lux-sidebar`,
`lux-tabs`, `lux-toolbar`, `lux-steps`, `lux-stepper`, `lux-wizard`,
`lux-viewport`, `lux-fluid`, `lux-divider`, `lux-fieldset`, `lux-panel`.

### Acciones y overlays

`lux-action-sheet`, `lux-confirm-dialog`, `lux-confirm-popup`, `lux-context-menu`,
`lux-modal`, `lux-notification-center`, `lux-popover`,
`lux-processing-overlay`, `lux-tooltip`, `lux-toast`, `lux-global-error-alert`,
`lux-offline-indicator`, `lux-block-ui`.

### Formularios y controles

`lux-checkbox`, `lux-cascade-select`, `lux-chip`, `lux-color-picker`,
`lux-date-range`, `lux-editor`, `lux-file-upload`, `lux-iconfield`,
`lux-input-group`, `lux-inputicon`, `lux-listbox`, `lux-multi-select`,
`lux-otp-input`, `lux-pick-list`, `lux-radio-button`, `lux-rating`,
`lux-select-button`, `lux-slider`, `lux-split-button`, `lux-tag-input`,
`lux-toggle-switch`, `lux-tree-select`.

### Datos, tablas y visualización

`lux-data-view`, `lux-gallery`, `lux-knob`, `lux-meter-group`, `lux-order-list`,
`lux-paginator`, `lux-progress-bar`, `lux-skeleton`, `lux-skeleton-presets`,
`lux-table`, `lux-tag`, `lux-timeline`, `lux-tree`, `lux-tree-table`,
`lux-virtual-scroller`, `lux-carousel`, `lux-infinite-scroll`, `lux-pull-to-refresh`,
`lux-swipe-actions`, `lux-tap-to-top`, `lux-style-class`.

### Identidad, contenido y utilidades

`lux-animate-on-scroll`, `lux-avatar`, `lux-badge`, `lux-card`, `lux-contact-card`,
`lux-comment-thread`, `lux-debug-console`, `lux-empty-state`, `lux-icon`,
`lux-image`, `lux-inplace`, `lux-lang-selector`, `lux-loader`, `lux-message`,
`lux-profile-card`, `lux-status-badge`, `lux-terminal`, `lux-theme-switcher`,
`lux-viewport`, `lux-skeleton`, `lux-spinner`.

### Componentes adaptativos presentes pero pendientes de decisión

Estos existen en el inventario, pero deben confirmarse como parte del producto final,
deprecados o experimentales antes de publicarlos:

`lux-cascade-select`, `lux-carousel`, `lux-color-picker`, `lux-debug-console`,
`lux-iconfield`, `lux-infinite-scroll`, `lux-menubar`, `lux-multi-select`,
`lux-offline-indicator`, `lux-paginator`, `lux-pull-to-refresh`, `lux-terminal`,
`lux-viewport`, `lux-org-chart`.

## 5. Catálogo de primitivas agnósticas

Las primitivas viven en `primitives/`. No delegan entre Bootstrap e Ionic.

| Componente objetivo | Propósito |
|---|---|
| `lux-icon` | Iconografía controlada de la aplicación |
| `lux-kpi-card` | Indicador numérico con label, valor y estado |
| `lux-stat-card` | Tarjeta de estadística |
| `lux-activity-log` | Línea de actividad o auditoría |
| `lux-approval-workflow` | Visualización de flujo de aprobación |
| `lux-avatar-group` | Grupo de avatares |
| `lux-breakdown-list` | Desglose de valores |
| `lux-focus-trap` | Directiva/servicio de foco accesible |
| `lux-gauge` | Medidor radial o gauge |
| `lux-inventory-level` | Nivel de inventario |
| `lux-lead-scoring` | Puntuación de lead |
| `lux-live-region-announcer` | Anuncios accesibles para lectores de pantalla |
| `lux-multiple-segmented-control` | Control segmentado múltiple |
| `lux-order-status` | Estado semántico de orden |
| `lux-ranked-list` | Lista ordenada por prioridad |
| `lux-realtime-indicator` | Estado de conexión o actualización |
| `lux-segmented-control` | Selector segmentado |
| `lux-tour` | Recorrido guiado de interfaz |
| `lux-tristate-switch` | Switch con tres estados |

## 6. Catálogo de botones

### API final

```html
<lux-button kind="add" displayMode="label" />
<lux-button kind="edit" displayMode="icon" ariaLabel="Editar" />
<lux-button kind="save" displayMode="both" />
```

### `kind` inicial

`add`, `active-desactive`, `confirm`, `delete`, `download`, `edit`, `item`,
`save`, `send-email`, `tracking`, `view-pdf`.

### Variantes visuales

`primary`, `secondary`, `outline`, `text`, `danger`, `ghost`, `link`.

### Estructura final

```text
buttons/core/
buttons/web/button.ts       -> lux-button-web
buttons/mobile/button.ts    -> lux-button-mobile
adaptive/button/button.ts   -> lux-button
```

Las cuatro familias actuales (`web-label`, `web-icon`, `mobile-label`,
`mobile-icon`) se consolidan en dos implementaciones de plataforma. `label` e `icon`
dejan de ser carpetas y pasan a ser `displayMode`.

### Helpers compartidos

`ButtonGroup`, `ConfirmService`, tracking y helpers de PDF se conservan como
infraestructura interna del sistema de botones, sin exponerse como variantes de
plataforma.

## 7. Catálogo de inputs

Todos los inputs públicos deben seguir el patrón:

```text
lux-input-<tipo>          # adaptativo, público
lux-input-<tipo>-web      # Bootstrap/native, interno
lux-input-<tipo>-mobile   # Ionic, interno
```

### Tipos de input

`autocomplete`, `check`, `currency`, `date`, `date-time`, `datepicker`, `email`,
`file`, `img`, `mask`, `month`, `multiselect`, `ng-select`, `number`, `password`,
`phone-prefix`, `search`, `select`, `select-bool`, `select-prefix`, `text`,
`textarea`, `time`, `toggle-switch`, `upload-pdf`, `url`.

### Estado de adaptación

| Tipo | Estado actual |
|---|---|
| `text` | Adaptativo completado |
| `select` | Adaptativo completado |
| `number` | Adaptativo completado |
| `textarea` | Adaptativo completado |
| `check` | Adaptativo completado |
| `date` | Pendiente por diferencia string/Date |
| `autocomplete` | Pendiente |
| `file` | Pendiente |
| `currency` | Pendiente |
| `password` | Pendiente |
| `multiselect` | Pendiente |
| `select-bool` | Pendiente |
| `time` | Pendiente |
| `search` | Pendiente |
| `toggle-switch` | Pendiente |
| `date-time` | Pendiente de normalización |
| `datepicker` | Pendiente de normalización |
| `img` | Pendiente de normalización |
| `mask` | Pendiente de normalización |
| `month` | Pendiente de normalización |
| `ng-select` | Pendiente de normalización |
| `phone-prefix` | Pendiente de normalización |
| `select-prefix` | Pendiente de normalización |
| `upload-pdf` | Pendiente de normalización |
| `url` | Pendiente de normalización |

`BaseInputSignal` seguirá siendo el núcleo común y conservará `ControlValueAccessor`.
Los bridges históricos se mantendrán durante la migración para evitar un cambio
big-bang en formularios existentes.

## 8. Implementaciones internas web

El inventario actual de carpetas web se conserva como mapa de implementación. Cada
componente que tenga pareja adaptativa debe terminar con selector interno
`lux-<nombre>-web`.

`accordion`, `action-menu`, `animate-on-scroll`, `avatar`, `badge`, `barcode-input`,
`barcode-scanner`, `bitacora-filtro-fecha`, `block-ui`, `bottom-nav`, `breadcrumbs`,
`card`, `carousel`, `cascade-select`, `charts`, `checkbox`, `chip`, `color-picker`,
`command-palette`, `comment-thread`, `comparison-table`, `confirm-dialog`,
`confirm-popup`, `contact-card`, `context-menu`, `customer-360`, `dashboard-layout`,
`data-grid`, `data-view`, `date-range`, `dialog`, `divider`, `dock`,
`document-previewer`, `editor`, `email-preview`, `empty-state`, `error-boundary`,
`fieldset`, `file-upload`, `fluid`, `funnel-chart`, `gallery`, `gantt`,
`global-error-alert`, `header-customer`, `heatmap`, `iconfield`, `image-fallback`,
`image`, `infinite-scroll`, `inplace`, `input-group`, `inputicon`, `kanban-board`,
`knob`, `lang-selector`, `listbox`, `loader`, `mega-menu`, `menu`, `menubar`,
`mesanio`, `message`, `meter-group`, `module-guide`, `multi-select`,
`notification-center`, `offline-indicator`, `order-list`, `org-chart`, `otp-input`,
`panel-menu`, `panel`, `pdf-viewer-modal`, `pick-list`, `pipeline-crm`, `pivot-table`,
`popover`, `print-view`, `processing-overlay`, `profile-card`, `progress-bar`,
`pull-to-refresh`, `qr-code`, `radio-button`, `rango-calendario-mes-anio`,
`rango-calendario-yyyymmdd`, `rating`, `receipt-scanner`, `report-header`,
`rich-text-editor`, `section-nav`, `select-button`, `session-timeout`, `sidebar`,
`signature-pad`, `skeleton-presets`, `skeleton`, `slider`, `spinner`, `split-button`,
`split-pane`, `status-badge`, `steps`, `style-class`, `swipe-actions`, `table-caption`,
`table-checkbox`, `table-empty-message`, `table-footer`, `table-global-filter`,
`table`, `tabs`, `tag-input`, `tag`, `tap-to-top`, `terminal`, `territory-map`,
`title-page-report-maintenance`, `title-page-report`, `title-solicitud-pago-pdf`,
`toast`, `toggle-switch`, `toolbar`, `touchspin`, `tree-select`, `tree-table`,
`tree`, `virtual-scroller`, `whats-new`, `wizard`.

Componentes web específicos de negocio, como `customer-360`, `pipeline-crm`,
`gantt`, `kanban-board`, `mesanio` o `territory-map`, deben permanecer internos
hasta confirmar que son suficientemente genéricos para ser API pública.

## 9. Implementaciones internas mobile

El inventario actual de carpetas mobile se conserva como mapa Ionic. Cada componente
que tenga pareja adaptativa debe terminar con selector interno
`lux-<nombre>-mobile`.

`accordion`, `action-menu-mobile`, `animate-on-scroll`, `app-icon`, `avatar`, `badge`,
`block-ui`, `bottom-nav`, `breadcrumbs`, `card`, `carousel`, `cascade-select`,
`checkbox`, `chip`, `color-picker`, `comment-thread`, `confirm-dialog`,
`confirm-popup`, `contact-card`, `context-menu`, `data-view-mobile`, `date-range`,
`divider`, `dock`, `editor`, `empty-state`, `fieldset`, `file-upload`, `fluid`,
`gallery`, `global-error-alert`, `iconfield`, `image`, `infinite-scroll`, `inplace`,
`input-group`, `inputicon`, `ionic-segment`, `knob`, `lang-selector`, `list-item`,
`listbox`, `loader`, `mega-menu`, `menu`, `menubar`, `message`, `meter-group`,
`modal`, `multi-select`, `notification-center`, `offline-indicator`, `order-list`,
`org-chart`, `otp-input`, `page`, `paginator`, `panel-menu`, `panel`, `pick-list`,
`popover`, `processing-overlay`, `profile-card`, `progress-bar`, `pull-to-refresh`,
`radio-button`, `rating`, `sidebar`, `skeleton-presets`, `skeleton`, `slider`,
`spinner`, `split-button`, `status-badge`, `stepper`, `steps`, `style-class`,
`swipe-actions`, `tab-bar`, `table`, `tabs`, `tag-input`, `tag`, `tap-to-top`,
`terminal`, `theme-switcher`, `timeline`, `toast`, `toolbar`, `tooltip`,
`tree-select`, `tree-table`, `tree`, `virtual-scroller`.

`app-icon` y `data-view-mobile` requieren decisión especial porque sus nombres actuales
no reflejan correctamente la capa. No deben renombrarse sin cerrar la decisión
`app-icon` versus `lx-icon`.

## 10. Qué queda fuera de la API pública

- Componentes específicos de un módulo de negocio.
- Clases `Base*`, servicios, stores y helpers internos.
- Implementaciones `-web` y `-mobile`.
- Bridges temporales de inputs.
- Wrappers directos de Ionic sin contrato adaptativo.
- Componentes experimentales sin consumidores confirmados.
- Componentes con nombres históricos mientras exista migración pendiente.

## 11. Estado real frente al objetivo

### Ya existe

- Separación física `web/`, `mobile/`, `adaptive/`, `shared/`, `inputs/`.
- Boundary audit con `npm run audit:ui`.
- Delegación por `PlatformService.isMobile()`.
- Inputs adaptativos para `text`, `select`, `number`, `textarea` y `checkbox`.
- 357 componentes detectados en la librería actual.
- Fase 0 de CSS por tag migrada a clases de host.

### En ejecución o pendiente

- Resolver vista de transición alrededor de 850 px. La captura actual muestra tabla
  ilegible; Fase 0 no debe cerrarse visualmente hasta determinar si es regresión o
  deuda preexistente.
- Resolver colisión `app-icon` y `lx-icon`.
- Renombrar capas a `lux-*` con codemod y bridges.
- Fusionar botones de cuatro carpetas a dos implementaciones con `displayMode`.
- Completar inputs adaptativos pendientes.
- Adoptar API pública, versionado y `public-api.ts`.
- Mejorar foco, overlays, teclado, lectores de pantalla e i18n.
- Sustituir tests superficiales por tests de interacción.
- Crear catálogo visual/Storybook o equivalente.

## 12. Orden de implementación

1. Cerrar QA visual de Fase 0, incluido 850 px.
2. Resolver `app-icon` versus `lx-icon`.
3. Migrar `adaptive`, `shared` a `primitives` y `base` a `core`.
4. Migrar implementaciones internas web/mobile.
5. Completar inputs adaptativos y bridges.
6. Fusionar botones y publicar API `lux-button`.
7. Resolver a11y de overlays y estados de teclado/foco.
8. Añadir i18n y eliminar textos por defecto hardcodeados.
9. Añadir tests reales de comportamiento.
10. Crear `public-api.ts`, documentación de uso, catálogo visual y versionado.
11. Ejecutar migración completa de consumidores y retirar aliases temporales.

## 13. Criterio de terminado

La librería se considera terminada cuando:

- Todo componente público tiene nombre `lux-*` y documentación de API.
- Ningún módulo de negocio importa implementación `web/` o `mobile/` directamente,
  salvo bridges temporales documentados.
- `npm run audit:ui`, build y tests pasan.
- Desktop, transición y mobile tienen comportamiento usable, no solo compilación.
- Cada overlay gestiona foco, escape, restauración y navegación por teclado.
- Inputs mantienen contratos de formularios en ambas plataformas.
- Botones comparten API semántica y soportan `displayMode`.
- Estados loading, empty, error, disabled, invalid y readonly están definidos.
- Textos visibles son traducibles.
- Catálogo visual cubre estados y variantes principales.
- Existe inventario de componentes sin uso y ninguno se elimina sin evidencia.
- Hay una API pública versionable y una guía de contribución.

## 14. Referencias

- `appsweb/angular/src/app/shared/ui/arquitectura-shared-ui.md`
- `docs/SharedLuxuryApp/DesignSystem/20261002-plan-maestro-secuencia-catalogo-lux.md`
- `docs/SharedLuxuryApp/DesignSystem/20261002-verificacion-catalogo-marca-lux.md`
- `docs/SharedLuxuryApp/DesignSystem/20261002-analisis-componentes-shared-ui.md`
- `docs/SharedLuxuryApp/DesignSystem/20261003-fase0-css-tag-a-clase-reporte.md`
- `appsweb/angular/scripts/audit-ui-boundaries.mjs`
