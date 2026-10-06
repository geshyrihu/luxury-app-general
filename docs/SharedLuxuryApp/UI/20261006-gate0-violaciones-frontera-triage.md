# Gate 0 — triage manual de las 28 violaciones de frontera detectadas

**Fecha:** 2026-10-06
**Fuente:** revisión línea por línea de cada import flaggeado por `20261006-gate0-matriz-componentes.csv` (columna `coreImportViolation`). El script solo detecta *que* un archivo importa `@core/*` (fuera de `platform.service`/`dialog-handler.service`, ya sancionados) o un módulo `*.luxuryapp/*`; no juzga severidad. Este documento sí la juzga, por archivo.

No se aplicó ningún fix aquí — es triage, no ejecución. Las recomendaciones son insumo para decidir qué prompts abrir después.

## Tier A — violación real: negocio concreto o el componente hace su propio fetch (7)

Estos componentes dejan de ser "UI tonta": conocen auth/cliente/endpoints o importan un servicio de un módulo de negocio concreto. Varios **duplican** casi el mismo patrón (`CustomerIdService` + `Endpoints` + `ApiResponseService`), lo que sugiere que no son 4 problemas distintos sino 1 patrón repetido 4 veces.

| Archivo | Importa | Por qué es serio |
|---|---|---|
| `shared/ui/image-analysis-dialog/image-analysis-dialog.ts` | `TicketAnalysisService` de `@operations.luxuryapp/service-orders/...` | Módulo de negocio concreto, directo. El componente es de facto `operations`-specific, no genérico. |
| `shared/ui/ai-chat-widget/ai-chat-widget.ts` | `AuthService` (`@core/auth/`) + `AiChatService` | Widget acoplado a sesión y a un backend de IA específico; no es un componente de presentación reutilizable. |
| `shared/ui/web/header-customer/haeder-customer.ts` | `CustomerIdService` + `Endpoints` + `ApiResponseService` (fetch propio) + `TicketFilterService` de `@operations.luxuryapp/...` | Doble violación: hace su propio HTTP y además depende de un servicio de negocio concreto. |
| `shared/ui/web/report-header/report-header.ts` | Mismo patrón que `header-customer.ts`, pero `TicketFilterService` se importa por **ruta relativa cruda** (`../../../../modules/operations.luxuryapp/...`), no por alias | Mismo doble problema, y la ruta relativa sugiere que se evadió a propósito algún lint que bloquea el alias `@operations.luxuryapp`. Revisar si existe esa regla y por qué no la atrapó aquí. |
| `shared/ui/web/title-solicitud-pago-pdf/cabecera-solicitud-pago-pdf.ts` | `CustomerIdService` + `Endpoints` + `ApiResponseService` | Hace su propio fetch; sin import de módulo de negocio directo, pero igual rompe "UI no hace data fetching". |
| `shared/ui/web/title-page-report/page-title-report.ts` | `CustomerIdService` + `Endpoints` + `ApiResponseService` + `DateService` + `PeriodMonthService` | Mismo patrón de fetch propio. |
| `shared/ui/inputs/web/custom-input-upload-pdf-signal.ts` | `ApiResponseService` | El input "sube" el PDF llamando la API él mismo en vez de emitir el archivo y dejar que el consumidor haga el fetch. |

**Recomendación:** no tocar en este lote. Es un cambio de contrato (mover el fetch al consumidor, pasar datos por `input()`), no un typo. Requiere decisión de diseño + migrar consumidores, candidato a su propio prompt/fase, no a Gate 0.

## Tier B — infra genérica, candidata a blanquear junto a `PlatformService`/`DialogHandlerService` (14)

Mismo patrón que los 2 servicios ya sancionados por el roadmap: utilidades transversales (fecha, filtro de tabla, toast, procesamiento de imagen, debug), no lógica de negocio. Ningún import aquí referencia un módulo `*.luxuryapp/*`.

| Servicio | Archivos que lo usan |
|---|---|
| `DebugConsoleService` | `adaptive/debug-console/debug-console.ts` |
| `MessageService` | `web/toast/toast.ts` |
| `DateService` / `FiltroCalendarService` | `web/rango-calendario-mes-anio/calendar-range.ts`, `web/mesanio/mesanio.ts`, `web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd.ts` |
| `GlobalTableFilterService` | `web/lux-table-caption/lux-table-caption.ts` |
| `CustomToastService` / `ImageProcessingService` | `inputs/web/custom-input-img-signal.ts`, `inputs/mobile/ion-input-img.ts`, `mobile/file-upload/file-upload.ts`, `web/file-upload/file-upload.ts` |
| `DialogHandlerService` (uso adicional ya sancionado) + `ApiResponseService` (fetch del blob del PDF) | `web/pdf-viewer-modal/pdf-viewer-modal.ts` — caso mixto: la apertura de modal está sancionada, pero el fetch del PDF vía `ApiResponseService` es el mismo patrón de Tier A. Clasificar la mitad `ApiResponseService` ahí, no aquí. |

**Recomendación:** si se confirma que estos servicios son infraestructura transversal (no negocio), agregarlos a la whitelist del script (`generate-component-ownership-matrix.mjs`) junto a `platform.service`/`dialog-handler.service`, para que Gate 0 no los vuelva a marcar como violación en cada corrida. No requiere cambiar código de `shared/ui`.

## Datos estáticos mal ubicados (2)

| Archivo | Importa | Problema |
|---|---|---|
| `inputs/web/custom-input-phone-prefix.ts` | `@core/data/phone-prefixes.data` | Catálogo estático (lista de prefijos telefónicos), no un servicio ni lógica de negocio. Vive en `@core/data` por costumbre, no por necesidad. |
| `inputs/web/input-phone-prefix/input-phone-prefix.ts` | mismo archivo | Mismo caso. |

**Recomendación:** mover `phone-prefixes.data.ts` a `shared/ui` (o `shared/utils`) en un lote futuro; bajo riesgo, pero es un cambio de ubicación de archivo con consumidores, no se hace sin su propio prompt/revisión.

## Benignas: imports type-only, sin acoplamiento de comportamiento (resto, ~5)

`SelectItemDto` (`custom-input-autocomplete-multiple-signal.ts`, `custom-input-select-button-signal.ts`, `input-multiselect.ts` ×2, `input-select.ts`) y `MenuItem`/`FechasFiltro` (`breadcrumbs.ts`, `menubar.ts`, `rango-calendario-yyyymmdd.ts`) son interfaces/tipos, no servicios. Importar un tipo de `@core/interfaces/` para tipar un input público es una dependencia de contrato de datos, no de comportamiento — no es el tipo de violación que preocupa al roadmap (`UI → negocio/core concreto prohibido` habla de servicios/lógica, no de shapes de datos).

**Recomendación:** no requiere acción. Si se quiere Gate 0 estrictamente limpio de cualquier referencia a `@core/`, se podría mover `SelectItemDto`/`MenuItem` a `shared/ui` o a un paquete de contratos neutral, pero es cosmético, no urgente.

## Resumen para decisión

- **7 violaciones reales** (Tier A), todas con el mismo patrón repetido (componente hace su propio fetch, o depende de `operations.luxuryapp` directo). Candidato a un solo prompt "mover el fetch al consumidor" que cubra los 7 de una vez, en vez de 7 prompts sueltos.
- **14 + el caso mixto del pdf-viewer-modal** son candidatas a blanquear en el script, cero cambio de código.
- **2** son una reubicación de archivo de datos, bajo riesgo, futuro.
- **~5** son ruido, no accionables.
