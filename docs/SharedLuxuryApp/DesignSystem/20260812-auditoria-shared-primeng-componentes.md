# Auditoría de uso de PrimeNG — Componentes y clases base

Línea base para las Fases 3, 4, 5 y 6 del Plan de Migración
(`docs/migration-template/02-plan-migracion.md`).

- **Fecha de generación:** 2026-09-14
- **Comando:** `node scripts/audit-primeng.mjs`
- **Raíces escaneadas:** `appsweb/angular/src/app`
- **Stack medido:** Angular `^22.1.6` · PrimeNG `22.1.1`
- **Archivos `.html` escaneados:** 884 (607 con al menos un uso)

> Este documento es **generado automáticamente**: se sobrescribe en cada
> ejecución del script. No editar a mano; editar `scripts/audit-primeng.mjs`.

## 1. Método

| Elemento | Patrón / criterio |
|:---|:---|
| Componentes (`<p-*`) | `/&lt;\bp-[a-zA-Z0-9-]+\b/` sobre el contenido completo de cada `.html` (case-sensitive) |
| Clases (`p-*`) | `/\bp-[a-zA-Z0-9-]+\b/ aplicado **solo** al valor de atributos de clase |
| Atributos considerados | `class`, `[class.*]`, `[ngClass]`, `customClass`, `styleClass`, `panelStyleClass` |
| Conteo | Una unidad por cada apertura de etiqueta y por cada token de clase dentro del atributo |
| Exclusiones | `node_modules`, directorios ocultos, archivos que no sean `.html`, respaldos (`.bak`, `.old`, `.orig`) |

**Atributos efectivamente portadores de clases `p-*`** (el resto de los atributos
considerados no aportó ninguna coincidencia):

| Atributo | Clases `p-*` encontradas |
|:---|---:|
| `class` | 2,100 |
| `customclass` | 23 |
| `styleclass` | 22 |
| `ngclass` | 1 |

**Código comentado y límites de alcance:**

- Coincidencias dentro de comentarios HTML (incluidas en las tablas): 15 aperturas `<p-*` y 11 clases.
- Archivos de respaldo excluidos del escaneo: `appsweb/angular/src/app/modules/collections.luxuryapp/cobranza-online/resumen/cobranza-online-resumen.bak.html`.
- Plantillas **inline** en archivos `.ts` (3,205 archivos revisados): 274 aperturas `<p-*`,
  **fuera** de las tablas porque el alcance del ticket es `.html`. Ver anexo 6.1.
- El regex de etiquetas **no** cubre las directivas de atributo de PrimeNG: `pSortableColumn`: 671 · `pTemplate`: 14 en `.html`. Ver anexo 6.3.
- 1,615 de esos usos de clase (75.26% del total) son **padding de PrimeFlex** (`p-3`, `p-2`, `p-4`, `p-0`, `p-5`, `p-1`, `p-md-4`, `p-md-5`, `p-md-3`, `p-xl-4`, `p-md-0`, `p-lg-5`, `p-md-2`),
  no clases de componente PrimeNG. Se conservan en el §3 —son el resultado literal del regex del ticket— y se aíslan en el §3.1.

## 2. Top de Componentes (`<p-*`)

Total: **1,087** aperturas de etiqueta en **14** componentes distintos.

| # | Componente | Usos | % del total |
|---:|:---|---:|---:|
| 1 | `<p-sorticon>` | 673 | 61.91% |
| 2 | `<p-table>` | 392 | 36.06% |
| 3 | `<p-columnfilter>` | 5 | 0.46% |
| 4 | `<p-tablecheckbox>` | 3 | 0.28% |
| 5 | `<p-dialog>` | 2 | 0.18% |
| 6 | `<p-inputgroup>` | 2 | 0.18% |
| 7 | `<p-inputgroup-addon>` | 2 | 0.18% |
| 8 | `<p-tableheadercheckbox>` | 2 | 0.18% |
| 9 | `<p-button>` | 1 | 0.09% |
| 10 | `<p-confirmdialog>` | 1 | 0.09% |
| 11 | `<p-iconfield>` | 1 | 0.09% |
| 12 | `<p-inputicon>` | 1 | 0.09% |
| 13 | `<p-inputnumber>` | 1 | 0.09% |
| 14 | `<p-select>` | 1 | 0.09% |

### 2.1 Huella del ecosistema de tabla (Fase 6 del plan)

`<p-sorticon>`, `<p-table>`, `<p-columnfilter>`, `<p-tablecheckbox>`, `<p-tableheadercheckbox>` concentran **1,075** de las 1,087 aperturas (98.90%).

Fuera del ecosistema de tabla quedan **12** aperturas (1.10%):
`<p-dialog>` (2) · `<p-inputgroup>` (2) · `<p-inputgroup-addon>` (2) · `<p-button>` (1) · `<p-confirmdialog>` (1) · `<p-iconfield>` (1) · `<p-inputicon>` (1) · `<p-inputnumber>` (1) · `<p-select>` (1)

## 3. Top de Clases PrimeNG (`p-*`)

Total: **2,146** usos de clase en **64** clases distintas.

| # | Clase | Usos | % del total | Tipo |
|---:|:---|---:|---:|:---|
| 1 | `p-3` | 631 | 29.40% | PrimeFlex |
| 2 | `p-2` | 378 | 17.61% | PrimeFlex |
| 3 | `p-4` | 296 | 13.79% | PrimeFlex |
| 4 | `p-0` | 97 | 4.52% | PrimeFlex |
| 5 | `p-datatable-sm` | 81 | 3.77% | PrimeNG* |
| 6 | `p-5` | 72 | 3.36% | PrimeFlex |
| 7 | `p-button-sm` | 66 | 3.08% | PrimeNG* |
| 8 | `p-1` | 55 | 2.56% | PrimeFlex |
| 9 | `p-button` | 52 | 2.42% | PrimeNG* |
| 10 | `p-button-text` | 45 | 2.10% | PrimeNG* |
| 11 | `p-md-4` | 43 | 2.00% | PrimeFlex |
| 12 | `p-button-rounded` | 38 | 1.77% | PrimeNG* |
| 13 | `p-button-primary` | 37 | 1.72% | PrimeNG* |
| 14 | `p-button-outlined` | 27 | 1.26% | PrimeNG* |
| 15 | `p-inputtext` | 23 | 1.07% | PrimeNG* |
| 16 | `p-md-5` | 18 | 0.84% | PrimeFlex |
| 17 | `p-error` | 16 | 0.75% | PrimeNG* |
| 18 | `p-md-3` | 16 | 0.75% | PrimeFlex |
| 19 | `p-datatable-gridlines` | 14 | 0.65% | PrimeNG* |
| 20 | `p-button-secondary` | 13 | 0.61% | PrimeNG* |
| 21 | `p-component` | 11 | 0.51% | PrimeNG* |
| 22 | `p-datatable-striped` | 10 | 0.47% | PrimeNG* |
| 23 | `p-button-danger` | 9 | 0.42% | PrimeNG* |
| 24 | `p-inputtext-sm` | 8 | 0.37% | PrimeNG* |
| 25 | `p-rowgroup-footer` | 8 | 0.37% | PrimeNG* |
| 26 | `p-inputgroup` | 7 | 0.33% | PrimeNG* |
| 27 | `p-fluid` | 6 | 0.28% | PrimeNG* |
| 28 | `p-tag` | 6 | 0.28% | PrimeNG* |
| 29 | `p-text-secondary` | 6 | 0.28% | PrimeNG* |
| 30 | `p-badge` | 4 | 0.19% | PrimeNG* |
| 31 | `p-multiselect-representative-option` | 4 | 0.19% | PrimeNG* |
| 32 | `p-xl-4` | 4 | 0.19% | PrimeFlex |
| 33 | `p-badge-rounded` | 3 | 0.14% | PrimeNG* |
| 34 | `p-badge-success` | 3 | 0.14% | PrimeNG* |
| 35 | `p-md-0` | 3 | 0.14% | PrimeFlex |
| 36 | `p-rowgroup-header` | 3 | 0.14% | PrimeNG* |
| 37 | `p-tag-success` | 3 | 0.14% | PrimeNG* |
| 38 | `p-input-icon-left` | 2 | 0.09% | PrimeNG* |
| 39 | `p-inputtextarea` | 2 | 0.09% | PrimeNG* |
| 40 | `p-message` | 2 | 0.09% | PrimeNG* |
| 41 | `p-12` | 1 | 0.05% | PrimeNG* |
| 42 | `p-badge-info` | 1 | 0.05% | PrimeNG* |
| 43 | `p-button-icon` | 1 | 0.05% | PrimeNG* |
| 44 | `p-button-icon-left` | 1 | 0.05% | PrimeNG* |
| 45 | `p-button-info` | 1 | 0.05% | PrimeNG* |
| 46 | `p-button-label` | 1 | 0.05% | PrimeNG* |
| 47 | `p-button-plain` | 1 | 0.05% | PrimeNG* |
| 48 | `p-button-success` | 1 | 0.05% | PrimeNG* |
| 49 | `p-button-warning` | 1 | 0.05% | PrimeNG* |
| 50 | `p-dialog-footer` | 1 | 0.05% | PrimeNG* |
| 51 | `p-field-checkbox` | 1 | 0.05% | PrimeNG* |
| 52 | `p-inputgroup-addon` | 1 | 0.05% | PrimeNG* |
| 53 | `p-inputgroup-sm` | 1 | 0.05% | PrimeNG* |
| 54 | `p-lg-5` | 1 | 0.05% | PrimeFlex |
| 55 | `p-link` | 1 | 0.05% | PrimeNG* |
| 56 | `p-md-2` | 1 | 0.05% | PrimeFlex |
| 57 | `p-message-icon` | 1 | 0.05% | PrimeNG* |
| 58 | `p-message-info` | 1 | 0.05% | PrimeNG* |
| 59 | `p-message-text` | 1 | 0.05% | PrimeNG* |
| 60 | `p-message-warn` | 1 | 0.05% | PrimeNG* |
| 61 | `p-message-wrapper` | 1 | 0.05% | PrimeNG* |
| 62 | `p-progressbar` | 1 | 0.05% | PrimeNG* |
| 63 | `p-tag-info` | 1 | 0.05% | PrimeNG* |
| 64 | `p-text-justify` | 1 | 0.05% | PrimeNG* |

> `PrimeNG*`: clase `p-*` que **no** es padding de PrimeFlex. Puede ser una clase de
> componente PrimeNG o una clase propia del design system con el mismo prefijo; el script
> no resuelve su origen en CSS/SCSS, solo la presencia en plantillas.

### 3.1 Clases `p-*` sin padding de PrimeFlex (candidatas a PrimeNG)

Subtotal: **531** usos en **51** clases (24.74% del total de clases).

| # | Clase | Usos | % del subtotal |
|---:|:---|---:|---:|
| 1 | `p-datatable-sm` | 81 | 15.25% |
| 2 | `p-button-sm` | 66 | 12.43% |
| 3 | `p-button` | 52 | 9.79% |
| 4 | `p-button-text` | 45 | 8.47% |
| 5 | `p-button-rounded` | 38 | 7.16% |
| 6 | `p-button-primary` | 37 | 6.97% |
| 7 | `p-button-outlined` | 27 | 5.08% |
| 8 | `p-inputtext` | 23 | 4.33% |
| 9 | `p-error` | 16 | 3.01% |
| 10 | `p-datatable-gridlines` | 14 | 2.64% |
| 11 | `p-button-secondary` | 13 | 2.45% |
| 12 | `p-component` | 11 | 2.07% |
| 13 | `p-datatable-striped` | 10 | 1.88% |
| 14 | `p-button-danger` | 9 | 1.69% |
| 15 | `p-inputtext-sm` | 8 | 1.51% |
| 16 | `p-rowgroup-footer` | 8 | 1.51% |
| 17 | `p-inputgroup` | 7 | 1.32% |
| 18 | `p-fluid` | 6 | 1.13% |
| 19 | `p-tag` | 6 | 1.13% |
| 20 | `p-text-secondary` | 6 | 1.13% |
| 21 | `p-badge` | 4 | 0.75% |
| 22 | `p-multiselect-representative-option` | 4 | 0.75% |
| 23 | `p-badge-rounded` | 3 | 0.56% |
| 24 | `p-badge-success` | 3 | 0.56% |
| 25 | `p-rowgroup-header` | 3 | 0.56% |
| 26 | `p-tag-success` | 3 | 0.56% |
| 27 | `p-input-icon-left` | 2 | 0.38% |
| 28 | `p-inputtextarea` | 2 | 0.38% |
| 29 | `p-message` | 2 | 0.38% |
| 30 | `p-12` | 1 | 0.19% |
| 31 | `p-badge-info` | 1 | 0.19% |
| 32 | `p-button-icon` | 1 | 0.19% |
| 33 | `p-button-icon-left` | 1 | 0.19% |
| 34 | `p-button-info` | 1 | 0.19% |
| 35 | `p-button-label` | 1 | 0.19% |
| 36 | `p-button-plain` | 1 | 0.19% |
| 37 | `p-button-success` | 1 | 0.19% |
| 38 | `p-button-warning` | 1 | 0.19% |
| 39 | `p-dialog-footer` | 1 | 0.19% |
| 40 | `p-field-checkbox` | 1 | 0.19% |
| 41 | `p-inputgroup-addon` | 1 | 0.19% |
| 42 | `p-inputgroup-sm` | 1 | 0.19% |
| 43 | `p-link` | 1 | 0.19% |
| 44 | `p-message-icon` | 1 | 0.19% |
| 45 | `p-message-info` | 1 | 0.19% |
| 46 | `p-message-text` | 1 | 0.19% |
| 47 | `p-message-warn` | 1 | 0.19% |
| 48 | `p-message-wrapper` | 1 | 0.19% |
| 49 | `p-progressbar` | 1 | 0.19% |
| 50 | `p-tag-info` | 1 | 0.19% |
| 51 | `p-text-justify` | 1 | 0.19% |

## 4. Gran total

| Métrica | Valor |
|:---|---:|
| Archivos `.html` escaneados | 884 |
| Archivos con al menos un uso PrimeNG | 607 |
| Archivos sin uso PrimeNG | 277 |
| Aperturas de componentes `<p-*` | 1,087 |
| Componentes distintos | 14 |
| Usos de clases `p-*` | 2,146 |
| Clases distintas | 64 |
| **GRAN TOTAL (componentes + clases)** | **3,233** |

**Desglose del gran total:**

| Concepto | Valor | % del gran total |
|:---|---:|---:|
| Componentes `<p-*` en `.html` | 1,087 | 33.62% |
| Clases `p-*` sin padding de PrimeFlex (candidatas a PrimeNG) | 531 | 16.42% |
| Clases de padding PrimeFlex (ruido para PrimeNG, deuda de la capa de utilidades) | 1,615 | 49.95% |

**Fuera del alcance del ticket (no suman al gran total):**

| Concepto | Valor |
|:---|---:|
| Aperturas `<p-*` en plantillas inline `.ts` | 274 |
| Directivas de atributo PrimeNG en `.html` (`pSortableColumn`, `pTemplate`) | 685 |

## 5. Distribución por carpeta

Agrupación: `modules/<modulo>.luxuryapp` se conserva completo; el resto por primer nivel bajo la raíz escaneada.

| Carpeta | Archivos | Componentes | Clases | Total |
|:---|---:|---:|---:|---:|
| `modules/operations.luxuryapp` | 185 | 269 | 543 | 812 |
| `modules/accounting.luxuryapp` | 98 | 144 | 362 | 506 |
| `modules/maintenance.luxuryapp` | 103 | 115 | 288 | 403 |
| `modules/recruitment.luxuryapp` | 83 | 87 | 219 | 306 |
| `modules/collections.luxuryapp` | 56 | 81 | 190 | 271 |
| `modules/human-resources.luxuryapp` | 49 | 76 | 94 | 170 |
| `modules/admin.luxuryapp` | 52 | 79 | 89 | 168 |
| `modules/supplier.luxuryapp` | 50 | 56 | 96 | 152 |
| `modules/management.luxuryapp` | 23 | 23 | 89 | 112 |
| `modules/legal.luxuryapp` | 40 | 40 | 37 | 77 |
| `modules/purchases.luxuryapp` | 12 | 23 | 30 | 53 |
| `modules/shared.luxuryapp` | 20 | 31 | 13 | 44 |
| `core` | 43 | 5 | 35 | 40 |
| `modules/system.luxuryapp` | 8 | 22 | 12 | 34 |
| `shared` | 11 | 4 | 19 | 23 |
| `modules/auth.luxuryapp` | 7 | 4 | 17 | 21 |
| `modules/resident.luxuryapp` | 5 | 20 | 0 | 20 |
| `modules/committee.luxuryapp` | 14 | 7 | 8 | 15 |
| `modules/public.luxuryapp` | 2 | 0 | 5 | 5 |
| `(raíz)` | 1 | 1 | 0 | 1 |
| `modules/web.luxuryapp` | 22 | 0 | 0 | 0 |

## 6. Anexos

### 6.1 Plantillas inline en `.ts` (fuera de alcance, diagnóstico)

Total: **274** aperturas en **84** componentes distintos, dentro de **112** archivos `.ts`.

| Componente | Usos |
|:---|---:|
| `<p-button>` | 69 |
| `<p-table>` | 23 |
| `<p-skeleton>` | 18 |
| `<p-sorticon>` | 14 |
| `<p-tag>` | 8 |
| `<p-dialog>` | 7 |
| `<p-select>` | 6 |
| `<p-inputgroup-addon>` | 5 |
| `<p-tab>` | 5 |
| `<p-tabpanel>` | 5 |
| `<p-card>` | 4 |
| `<p-checkbox>` | 4 |
| `<p-inputnumber>` | 4 |
| `<p-toggleswitch>` | 4 |
| `<p-accordion-content>` | 3 |
| `<p-accordion-header>` | 3 |
| `<p-accordion-panel>` | 3 |
| `<p-datepicker>` | 3 |
| `<p-fileupload>` | 3 |
| `<p-inputgroup>` | 3 |
| `<p-popover>` | 3 |
| `<p-progressbar>` | 3 |
| `<p-selectbutton>` | 3 |
| `<p-avatar>` | 2 |
| `<p-badge>` | 2 |
| `<p-editor>` | 2 |
| `<p-iconfield>` | 2 |
| `<p-inputicon>` | 2 |
| `<p-multiselect>` | 2 |
| `<p-tablist>` | 2 |
| `<p-tabpanels>` | 2 |
| `<p-tabs>` | 2 |
| `<p-toast>` | 2 |
| `<p-accordion>` | 1 |
| `<p-autocomplete>` | 1 |
| `<p-blockui>` | 1 |
| `<p-cascadeselect>` | 1 |
| `<p-chip>` | 1 |
| `<p-colorpicker>` | 1 |
| `<p-confirmpopup>` | 1 |
| `<p-contextmenu>` | 1 |
| `<p-dataview>` | 1 |
| `<p-dataviewlayoutoptions>` | 1 |
| `<p-dock>` | 1 |
| `<p-drawer>` | 1 |
| `<p-fieldset>` | 1 |
| `<p-fluid>` | 1 |
| `<p-galleria>` | 1 |
| `<p-image>` | 1 |
| `<p-inplace>` | 1 |
| `<p-inplace-content>` | 1 |
| `<p-inplace-display>` | 1 |
| `<p-inputotp>` | 1 |
| `<p-knob>` | 1 |
| `<p-listbox>` | 1 |
| `<p-megamenu>` | 1 |
| `<p-menubar>` | 1 |
| `<p-message>` | 1 |
| `<p-metergroup>` | 1 |
| `<p-orderlist>` | 1 |
| `<p-orgchart>` | 1 |
| `<p-paginator>` | 1 |
| `<p-panel>` | 1 |
| `<p-panelmenu>` | 1 |
| `<p-picklist>` | 1 |
| `<p-progressspinner>` | 1 |
| `<p-radiobutton>` | 1 |
| `<p-rating>` | 1 |
| `<p-scroller>` | 1 |
| `<p-scrolltop>` | 1 |
| `<p-slider>` | 1 |
| `<p-splitter>` | 1 |
| `<p-step>` | 1 |
| `<p-step-list>` | 1 |
| `<p-stepper>` | 1 |
| `<p-steps>` | 1 |
| `<p-tablecheckbox>` | 1 |
| `<p-tableheadercheckbox>` | 1 |
| `<p-tabmenu>` | 1 |
| `<p-terminal>` | 1 |
| `<p-timeline>` | 1 |
| `<p-tree>` | 1 |
| `<p-treeselect>` | 1 |
| `<p-treetable>` | 1 |

**Archivos `.ts` con plantilla inline que usa PrimeNG (top 15 de 112):**

| Archivo | Aperturas `<p-*` |
|:---|---:|
| `appsweb/angular/src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-web-item/catalog-web-item.ts` | 53 |
| `appsweb/angular/src/app/shared/ui/web/skeleton-presets/skeleton-presets.ts` | 17 |
| `appsweb/angular/src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-patterns-item/catalog-patterns-item.ts` | 9 |
| `appsweb/angular/src/app/shared/ui/web/data-grid/data-grid.ts` | 9 |
| `appsweb/angular/src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/button-catalog/button-catalog.ts` | 8 |
| `appsweb/angular/src/app/modules/collections.luxuryapp/cobranza-online/resumen/cobranza-online-clasificacion-detail.ts` | 8 |
| `appsweb/angular/src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/contract-renewal-list.ts` | 8 |
| `appsweb/angular/src/app/shared/ui/web/form-builder/form-builder.ts` | 8 |
| `appsweb/angular/src/app/shared/ui/web/wizard/wizard.ts` | 6 |
| `appsweb/angular/src/app/shared/ui/web/file-upload/file-upload.ts` | 5 |
| `appsweb/angular/src/app/shared/ui/web/touchspin/touchspin.ts` | 5 |
| `appsweb/angular/src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-layouts/catalog-layouts.ts` | 4 |
| `appsweb/angular/src/app/shared/ui/web/notification-center/notification-center.ts` | 4 |
| `appsweb/angular/src/app/modules/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.service.ts` | 3 |
| `appsweb/angular/src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts` | 3 |

### 6.2 Archivos con mayor uso (top 15)

| Archivo | Componentes | Clases | Total |
|:---|---:|---:|---:|
| `appsweb/angular/src/app/modules/maintenance.luxuryapp/equipos-y-maquinaria/machinery/equipos-list.html` | 5 | 65 | 70 |
| `appsweb/angular/src/app/modules/operations.luxuryapp/task-engine/tasks/task-message/task-view.html` | 0 | 52 | 52 |
| `appsweb/angular/src/app/modules/accounting.luxuryapp/general-ledger/dynamic-reports/report-builder/report-builder.html` | 0 | 47 | 47 |
| `appsweb/angular/src/app/modules/maintenance.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-list.html` | 4 | 32 | 36 |
| `appsweb/angular/src/app/modules/collections.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus.html` | 31 | 4 | 35 |
| `appsweb/angular/src/app/modules/recruitment.luxuryapp/expediente-del-empleado/recursos-humanos/employee-file/employee-file-detail.html` | 9 | 25 | 34 |
| `appsweb/angular/src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/funding/funding-detail.html` | 2 | 27 | 29 |
| `appsweb/angular/src/app/modules/operations.luxuryapp/task-engine/tasks/task-message/task-list.html` | 6 | 20 | 26 |
| `appsweb/angular/src/app/modules/accounting.luxuryapp/general-ledger/dynamic-reports/report-viewer/report-viewer.html` | 0 | 25 | 25 |
| `appsweb/angular/src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/presupuesto-propuesta.html` | 2 | 21 | 23 |
| `appsweb/angular/src/app/modules/operations.luxuryapp/inventarios-y-almacn/manual-call-point-inventory/inventario-estacion-manual.html` | 4 | 19 | 23 |
| `appsweb/angular/src/app/modules/operations.luxuryapp/inventarios-y-almacn/smoke-detector-inventory/inventario-detector-humo.html` | 4 | 19 | 23 |
| `appsweb/angular/src/app/modules/operations.luxuryapp/manuals/biblioteca/manuals-and-processes/manuals-and-processes-editor/manuals-and-processes-editor.html` | 0 | 22 | 22 |
| `appsweb/angular/src/app/modules/operations.luxuryapp/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor.html` | 5 | 16 | 21 |
| `appsweb/angular/src/app/modules/accounting.luxuryapp/general-ledger/contabilidad-cliente/analisis-cobranza-cliente/analisis-cobranza-cliente.html` | 8 | 12 | 20 |

### 6.3 Directivas de atributo PrimeNG (fuera del regex de etiquetas)

Nombre de atributo que empieza con `p` + mayúscula (`pSortableColumn`, `pTemplate`) seguido de `=` y un valor entre comillas, medido case-sensitive.
En `.html` la posición de atributo es inequívoca; en `.ts` la medida es **heurística** (plantillas inline y literales de cadena) y puede incluir identificadores que no son directivas.

| Atributo | Usos en `.html` | Usos en `.ts` |
|:---|---:|---:|
| `pSortableColumn` | 671 | 12 |
| `pTemplate` | 14 | 16 |
| `pSize` | 0 | 2 |
| `pTooltip` | 0 | 1 |

---

## 7. Lectura de la línea base

- El **98.90%** de las aperturas `<p-*` en `.html` pertenece al
  ecosistema de tabla (Fase 6). Fuera de él solo quedan 12 aperturas:
  la Fase 3 (interactivos) y la Fase 4 (modales) ya están prácticamente cerradas **en `.html`**.
- El uso directo restante vive sobre todo en **plantillas inline `.ts`**: 274 aperturas
  en 112 archivos, con `<p-button>`, `<p-skeleton>` y `<p-table>` a la cabeza.
  El alcance del ticket es `.html`; conviene decidir si las fases 3–6 miden también esas plantillas.
- De las clases `p-*`, 75.26% del volumen es **padding de PrimeFlex**
  (deuda de la capa de utilidades, no de PrimeNG) y el resto se concentra en botones, inputs y tabla.

## 8. Criterio de aceptación del ticket

- [x] `node scripts/audit-primeng.mjs` termina con exit 0.
- [x] `docs/plans/primeng-components-audit.md` se sobrescribe con el escaneo completo.
- [x] Resumen en consola con el top 5 de componentes, el top 5 de clases y los totales globales.
