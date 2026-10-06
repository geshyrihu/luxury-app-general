# Gate 0 — matriz de componentes shared/ui (generada)

**Fecha:** 2026-10-06
**Fuente:** `scripts/generate-component-ownership-matrix.mjs`, ejecutado sobre `appsweb/angular` en `main` local post Fase 2c.
**Archivo completo (todas las filas):** [20261006-gate0-matriz-componentes.csv](./20261006-gate0-matriz-componentes.csv)

Este resumen agrega el CSV; no reemplaza revisión humana de `owner`/`madurezAprobada` (columnas vacías a propósito, no se inventan).

## Totales

**Componentes/directivas detectados:** 319

## Por capa

| Capa | Cantidad |
|---|---:|
| inputs | 93 |
| web | 87 |
| mobile | 57 |
| adaptive | 55 |
| primitives | 19 |
| buttons | 3 |
| core | 2 |
| ai-chat-widget | 1 |
| charts | 1 |
| image-analysis-dialog | 1 |

## Madurez tentativa (heurística objetiva, no aprobada)

Reglas: `revisar-dependencia-core` si importa `@core/` o un módulo de negocio directamente (viola frontera); `sin-consumidores` si cero archivos de `modules/`+`core/` lo importan; `candidato-stable` si tiene spec Y al menos 1 consumidor; `experimental` el resto.

| Madurez tentativa | Cantidad |
|---|---:|
| sin-consumidores | 172 |
| candidato-stable | 110 |
| experimental | 27 |
| revisar-dependencia-core | 10 |

## Violaciones de frontera (importan @core/ o negocio directo)

| Path | Clase |
|---|---|
| `shared/ui/ai-chat-widget/ai-chat-widget.ts` | `AiChatWidget` |
| `shared/ui/image-analysis-dialog/image-analysis-dialog.ts` | `ImageAnalysisDialogComponent` |
| `shared/ui/inputs/web/custom-input-phone-prefix.ts` | `CustomInputPhonePrefix` |
| `shared/ui/inputs/web/custom-input-upload-pdf-signal.ts` | `SubirPdf` |
| `shared/ui/inputs/web/input-phone-prefix/input-phone-prefix.ts` | `WebInputPhonePrefix` |
| `shared/ui/web/title-solicitud-pago-pdf/cabecera-solicitud-pago-pdf.ts` | `CabeceraSolicitudPagoPdf` |
| `shared/ui/web/header-customer/haeder-customer.ts` | `HeaderCustomer` |
| `shared/ui/web/title-page-report/page-title-report.ts` | `PageTitleReport` |
| `shared/ui/web/pdf-viewer-modal/pdf-viewer-modal.ts` | `PdfViewerModal` |
| `shared/ui/web/report-header/report-header.ts` | `ReportHeader` |

## Sin consumidores en modules/core (candidatos a revisar: ¿app-specific, deprecated, o falso negativo del grep?)

Total: 177. Antes de reclasificar cualquiera como `deprecated`, verificar manualmente (el grep solo indexa imports `import { X } from "@ui/...""; un re-export, un alias distinto o un uso solo dentro de shared/ui no cuenta como cero consumidores reales).

| Path | Clase | Selector |
|---|---|---|
| `shared/ui/adaptive/action-sheet/action-sheet.ts` | `LxActionSheet` | `lux-action-sheet` |
| `shared/ui/adaptive/breadcrumbs/breadcrumbs.ts` | `LxBreadcrumbs` | `lux-breadcrumbs` |
| `shared/ui/adaptive/carousel/carousel.ts` | `LxCarousel` | `lux-carousel` |
| `shared/ui/adaptive/debug-console/debug-console.ts` | `LxDebugConsole` | `lux-debug-console` |
| `shared/ui/adaptive/infinite-scroll/infinite-scroll.ts` | `LxInfiniteScroll` | `lux-infinite-scroll` |
| `shared/ui/adaptive/multi-select/multi-select.ts` | `LxMultiSelect` | `lux-multi-select` |
| `shared/ui/adaptive/offline-indicator/offline-indicator.ts` | `LxOfflineIndicator` | `lux-offline-indicator` |
| `shared/ui/adaptive/paginator/paginator.ts` | `LxPaginator` | `lux-paginator` |
| `shared/ui/adaptive/pull-to-refresh/pull-to-refresh.ts` | `LxPullToRefresh` | `lux-pull-to-refresh` |
| `shared/ui/adaptive/tap-to-top/tap-to-top.ts` | `LxScrollTop` | `lux-scroll-top` |
| `shared/ui/adaptive/stepper/stepper.ts` | `LxStepper` | `lux-stepper` |
| `shared/ui/adaptive/swipe-actions/swipe-actions.ts` | `LxSwipeActions` | `lux-swipe-actions` |
| `shared/ui/adaptive/table/table.ts` | `LxTable` | `lux-table` |
| `shared/ui/adaptive/tooltip/tooltip.ts` | `LxTooltip` | `[lxTooltip]` |
| `shared/ui/adaptive/viewport/viewport.directives.ts` | `LxWebDirective` | `[lxWeb]` |
| `shared/ui/ai-chat-widget/ai-chat-widget.ts` | `AiChatWidget` | `lux-ai-chat-widget` |
| `shared/ui/buttons/button-group/button-group.ts` | `IlButtonGroup` | `il-button-group` |
| `shared/ui/charts/chart.ts` | `DsChart` | `lux-ds-chart` |
| `shared/ui/core/processing-overlay.base.ts` | `ProcessingOverlayBase` | `base-processing-overlay` |
| `shared/ui/core/stepper-step-section.directive.ts` | `StepperStepSection` | `[step]` |
| `shared/ui/image-analysis-dialog/image-analysis-dialog.ts` | `ImageAnalysisDialogComponent` | `lux-image-analysis-dialog` |
| `shared/ui/inputs/core/base-input-signal.ts` | `BaseInputSignal` | `base-input-signal` |
| `shared/ui/inputs/core/base-ionic-input.ts` | `BaseIonicInput` | `base-ionic-input` |
| `shared/ui/inputs/web/custom-input-autocomplete-signal.ts` | `CustomInputAutoComplete` | `web-custom-input-autocomplete-signal` |
| `shared/ui/inputs/web/custom-input-email-signal.ts` | `CustomInputEmail` | `web-custom-input-email` |
| `shared/ui/inputs/web/custom-input-hour-signal.ts` | `CustomInputHour` | `custom-input-hour-signal` |
| `shared/ui/inputs/web/custom-input-img-signal.ts` | `CustomInputImg` | `web-custom-input-img-signal` |
| `shared/ui/inputs/web/custom-input-mask-signal.ts` | `CustomInputMaskSignal` | `web-custom-input-mask-signal` |
| `shared/ui/inputs/web/custom-input-month-signal.ts` | `CustomInputMonth` | `web-custom-input-month` |
| `shared/ui/inputs/web/custom-input-url-signal.ts` | `CustomInputUrl` | `web-custom-input-url` |
| `shared/ui/inputs/adaptive/input-check/input-check.ts` | `InputCheck` | `custom-input-check-signal` |
| `shared/ui/inputs/adaptive/input-currency/input-currency.ts` | `InputCurrency` | `custom-input-currency-signal` |
| `shared/ui/inputs/adaptive/input-date/input-date.ts` | `InputDate` | `custom-input-date-signal` |
| `shared/ui/inputs/adaptive/input-month/input-month.ts` | `InputMonth` | `custom-input-month` |
| `shared/ui/inputs/adaptive/input-multiselect/input-multiselect.ts` | `InputMultiselect` | `custom-input-multiselect-signal` |
| `shared/ui/inputs/adaptive/input-password/input-password.ts` | `InputPassword` | `custom-input-password-signal` |
| `shared/ui/inputs/adaptive/input-search/input-search.ts` | `InputSearch` | `custom-search-input-signal` |
| `shared/ui/inputs/adaptive/input-time/input-time.ts` | `InputTime` | `custom-input-time-signal` |
| `shared/ui/inputs/adaptive/input-upload-pdf/input-upload-pdf.ts` | `InputUploadPdf` | `lux-custom-input-upload-pdf-signal` |
| `shared/ui/inputs/adaptive/input-url/input-url.ts` | `InputUrl` | `custom-input-url` |
| `shared/ui/inputs/mobile/ion-input-autocomplete.ts` | `IonInputAutocomplete` | `ion-input-autocomplete` |
| `shared/ui/inputs/mobile/ion-input-datepicker.ts` | `IonInputDatepicker` | `ion-input-datepicker` |
| `shared/ui/inputs/mobile/ion-input-date-time.ts` | `IonInputDateTime` | `ion-input-date-time` |
| `shared/ui/inputs/mobile/ion-input-email.ts` | `IonInputEmail` | `ion-input-email` |
| `shared/ui/inputs/mobile/ion-input-img.ts` | `IonInputImg` | `ion-input-img` |
| `shared/ui/inputs/mobile/ion-input-mask.ts` | `IonInputMask` | `ion-input-mask` |
| `shared/ui/inputs/mobile/ion-input-month.ts` | `IonInputMonth` | `ion-input-month` |
| `shared/ui/inputs/mobile/ion-input-ng-select.ts` | `IonInputNgSelect` | `ion-input-ng-select` |
| `shared/ui/inputs/mobile/ion-input-phone-prefix.ts` | `IonInputPhonePrefix` | `ion-input-phone-prefix` |
| `shared/ui/inputs/mobile/ion-input-select-prefix.ts` | `IonInputSelectPrefix` | `ion-input-select-prefix` |
| `shared/ui/inputs/mobile/ion-input-upload-pdf.ts` | `IonInputUploadPdf` | `ion-input-upload-pdf` |
| `shared/ui/inputs/mobile/ion-input-url.ts` | `IonInputUrl` | `ion-input-url` |
| `shared/ui/inputs/core/validation-errors-custom-input.ts` | `ValidationErrorsCustomInput` | `lux-validation-errors-custom-input` |
| `shared/ui/inputs/web/input-autocomplete/input-autocomplete.ts` | `WebInputAutocomplete` | `web-input-autocomplete` |
| `shared/ui/inputs/web/input-check/input-check.ts` | `WebInputCheck` | `web-input-check` |
| `shared/ui/inputs/web/input-currency/input-currency.ts` | `WebInputCurrency` | `web-input-currency` |
| `shared/ui/inputs/web/input-date/input-date.ts` | `WebInputDate` | `web-input-date` |
| `shared/ui/inputs/web/input-datepicker/input-datepicker.ts` | `WebInputDatepicker` | `web-input-datepicker` |
| `shared/ui/inputs/web/input-date-time/input-date-time.ts` | `WebInputDateTime` | `web-input-date-time` |
| `shared/ui/inputs/web/input-email/input-email.ts` | `WebInputEmail` | `web-input-email` |

_(117 filas más en el CSV completo)_

## Con consumidores pero sin spec (27)

Candidatos a priorizar para Fase 5 (cobertura funcional).

| Path | Clase | Consumidores |
|---|---|---:|
| `shared/ui/adaptive/checkbox/checkbox.ts` | `LxCheckbox` | 5 |
| `shared/ui/adaptive/divider/divider.ts` | `LxDivider` | 13 |
| `shared/ui/adaptive/fieldset/fieldset.ts` | `LxFieldset` | 9 |
| `shared/ui/adaptive/icon/icon.ts` | `LxIcon` | 448 |
| `shared/ui/adaptive/panel/panel.ts` | `LxPanel` | 2 |
| `shared/ui/adaptive/widget-card/widget-card.ts` | `LxWidgetCard` | 4 |
| `shared/ui/inputs/adaptive/input-email/input-email.ts` | `InputEmail` | 2 |
| `shared/ui/mobile/list-item/list-item.ts` | `MobileListItem` | 189 |
| `shared/ui/mobile/pdf-viewer-trigger-mobile/pdf-viewer-trigger-mobile.ts` | `PdfViewerTriggerMobile` | 2 |
| `shared/ui/primitives/breakdown-list/breakdown-list.ts` | `AppBreakdownList` | 2 |
| `shared/ui/primitives/ranked-list/ranked-list.ts` | `AppRankedList` | 3 |
| `shared/ui/primitives/multiple-segmented-control/multiple-segmented-control.ts` | `MultipleSegmentedControl` | 1 |
| `shared/ui/web/avatar/avatar.ts` | `AppAvatar` | 12 |
| `shared/ui/web/checkbox/checkbox.ts` | `AppCheckbox` | 7 |
| `shared/ui/web/divider/divider.ts` | `AppDivider` | 7 |
| `shared/ui/web/editor/editor.ts` | `AppEditor` | 1 |
| `shared/ui/web/image-fallback/image-fallback.ts` | `AppImageFallback` | 2 |
| `shared/ui/web/menu/menu.ts` | `AppMenu` | 2 |
| `shared/ui/web/panel/panel.ts` | `AppPanel` | 1 |
| `shared/ui/web/radio-button/radio-button.ts` | `AppRadioButton` | 4 |
| `shared/ui/web/select-button/select-button.ts` | `AppSelectButton` | 3 |
| `shared/ui/web/skeleton/skeleton.ts` | `AppSkeleton` | 4 |
| `shared/ui/web/toggle-switch/toggle-switch.ts` | `AppToggleSwitch` | 2 |
| `shared/ui/web/toolbar/toolbar.ts` | `AppToolbar` | 5 |
| `shared/ui/web/charts/google-pie-chart4.ts` | `GooglePieChart4` | 2 |
| `shared/ui/web/section-nav/section-nav.ts` | `LxSectionNav` | 1 |
| `shared/ui/web/pdf-viewer-trigger/pdf-viewer-trigger.ts` | `PdfViewerTrigger` | 46 |
