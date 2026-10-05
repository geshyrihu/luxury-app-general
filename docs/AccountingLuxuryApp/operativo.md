# Accounting Frontend Operativo

Ultima revision: `2026-09-22`
Alcance de esta version: submodulo `general-ledger/financial-reports` (cliente y online).
El resto del modulo (`budget`, `fundings`, `accounting-catalogs`, `mock-aspel`) queda pendiente de documentar.

## Proposito del modulo

`accounting.luxuryapp` concentra contabilidad: catalogo de cuentas, presupuestos, estados
financieros, cobranza contable y reportes.

Dentro de `general-ledger/financial-reports` viven los estados financieros del cliente:

- `client/`: vista publica de solo lectura, sin sesion, parametrizada por URL.
- `online/`: consola interna autenticada, con filtros, impresion, agentes IA y pantallas extra.
- `interfaces/`, `pipes/`: contratos y utilidades compartidas por ambos.

## Rutas y URLs

| Ruta                                                   | Componente                  | Guard       | Origen                                   |
| ------------------------------------------------------ | --------------------------- | ----------- | ---------------------------------------- |
| `/publico/contabilidad-cliente/:customerId/:anio/:mes` | `client-reports-wrapper`    | publico     | `routing/public.routing.ts`              |
| `/contabilidad/financial-statements-reports`           | `financial-reports-wrapper` | `authGuard` | `general-ledger/contabilidad.routing.ts` |
| `/contabilidad/collections/presupuesto-contabilidad`   | `PresupuestoContabilidad`   | `authGuard` | `general-ledger/contabilidad.routing.ts` |
| `/contabilidad/reportes/ver/:id`                       | `ReportViewer`              | -           | `routing/pages.routes.ts`                |
| `/report-financial-statements`                         | `financial-reports-wrapper` | -           | `routing/pages.routes.ts`                |
| `/catalog-replica`                                     | `CatalogReplica`            | -           | `routing/pages.routes.ts`                |
| `/balance-mensual`                                     | `BalanceMensual`            | -           | `routing/pages.routes.ts`                |
| `/accounting/financial-statements-reports`             | `financial-reports-wrapper` | `authGuard` | `accounting.routes.ts`                   |
| `/accounting/collections/accounting-budget`            | `PresupuestoContabilidad`   | `authGuard` | `accounting.routes.ts`                   |

URLs de localhost:

- `http://localhost:4200/publico/contabilidad-cliente/{customerId}/2026/4`
- `http://localhost:4200/contabilidad/financial-statements-reports`
- `http://localhost:4200/contabilidad/reportes/ver/{id}`
- `http://localhost:4200/balance-mensual`
- `http://localhost:4200/catalog-replica`

## Estructura de carpetas

```text
general-ledger/financial-reports/
|-- client/                       # vista publica (inputs por URL)
|-- online/                       # consola interna
|   |-- state/                    # FinancialReportFilterStore
|   |-- ai-agent/                 # agente contable
|   |-- ai-agent-contabilidad/    # auditor contabilidad
|   |-- ai-agent-explicador/      # explicador IA
|   |-- catalog-validation/       # replica/validacion de catalogo
|   `-- monthly-balance/          # balance mensual
|-- interfaces/                   # aspel-budget.interface.ts (DTOs)
`-- pipes/                        # accounting-number.pipe.ts
```

## Componentes principales

| Componente                                | Selector                         | Responsabilidad                                                 |
| ----------------------------------------- | -------------------------------- | --------------------------------------------------------------- |
| `ClientReportsWrapper`                    | `app-client-reports-wrapper`     | Contenedor publico de 12 tabs; lee `customerId/anio/mes` de URL |
| `FinancialReportsWrapper`                 | `app-financial-reports-wrapper`  | Contenedor interno; filtros, impresion, IA, vista cliente       |
| `EstadoPosicionFinanciera`                | `app-estado-posicion-financiera` | EPF online                                                      |
| `EstadoResultados` / `EstadoResultadosV2` | `app-estado-resultados(-v2)`     | Estado de resultados                                            |
| `CedulaExtraordinaria`                    | `app-cedula-extraordinaria`      | Cedula extraordinaria                                           |
| `CedulaPresupuestal`                      | `app-cedula-presupuestal`        | Presupuesto vs resultado                                        |
| `ReporteFinanciero`                       | `app-reporte-financiero`         | Reporte financiero                                              |
| `FlujoEfectivo`                           | `app-flujo-efectivo`             | Flujo de efectivo (editable online)                             |
| `AnalisisCobranza`                        | `app-analisis-cobranza`          | Dashboard de cobranza (online, via store)                       |
| `PresupuestoContabilidad`                 | `app-presupuesto-contabilidad`   | Presupuesto contable                                            |
| `BancosInversionesComponent`              | `app-bancos-inversiones`         | Bancos e inversiones                                            |
| `FondoReservaComponent`                   | `app-fondo-reserva`              | Fondo de reserva                                                |
| `ProyectosAprobadosComponent`             | `app-proyectos-aprobados`        | Proyectos aprobados                                             |
| `CatalogReplica`                          | `app-catalog-replica`            | Validacion de catalogo (exclusivo online)                       |
| `BalanceMensual`                          | `app-balance-mensual`            | Balance mensual (exclusivo online)                              |
| `AiAgentComponent`                        | `app-ai-agent-contable`          | Agente contable                                                 |
| `AiAgentContabilidadComponent`            | `app-ai-agent-contabilidad`      | Auditor contabilidad online                                     |
| `AiAgentExplicadorComponent`              | `app-ai-agent-explicador`        | Explicador IA                                                   |

Los componentes de `client/` siguen el sufijo `-cliente` y selector `app-*-cliente`.

## Servicios

| Servicio                     | Ubicacion                                               | Firma principal                                                              |
| ---------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `FinancialReportFilterStore` | `online/state/financial-report-filter.store.service.ts` | `year`, `mesIdx`, `refreshTick`, `currentReportName`, `currentReportContext` |
| `CobranzaOnlineStoreService` | `collections.luxuryapp/online-collections/state`        | `loadFor(customerId, year, month, day)`                                      |
| `ApiResponseService`         | `@core/http/services`                                   | `onGetItem<T>(url)`                                                          |
| `Endpoints`                  | `@core/constants/endpoints/endpoints`                   | URLs de `ContabilidadOnline.FinancialStatements.*`                           |

Regla vigente: los consumidores llaman `ApiResponseService` + `Endpoints` directo.
No existe (ni debe crearse) un servicio fachada de reportes.

## Data flow

```text
ONLINE
  FinancialReportsWrapper
    providers: [CobranzaOnlineStoreService, FinancialReportFilterStore]
    filterS.year / filterS.mesIdx
      -> cada reporte: effect() -> ApiResponseService.onGetItem(Endpoints...)
      -> reporte setea filterS.currentReportName / currentReportContext (contexto IA)

CLIENTE (publico)
  URL :customerId/:anio/:mes
    -> ClientReportsWrapper (inputs)
    -> cada reporte: effect() -> ApiResponseService.onGetItem(Endpoints...)
    -> analisis-cobranza: store.loadFor(customerId, year, mes, day)
```

Impresion (online): se imprime desde los propios paneles de `lux-tabs`
(clase `print-all-reports`), una sola instancia por reporte.

## Estados y enums importantes

| Estado                           | Valores                                                                                    | Donde                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Tabs de reportes                 | 12 ids `"0".."11"`                                                                         | `financial-reports-wrapper.ts`, `client-reports-wrapper.ts` |
| Clasificacion cobranza (cliente) | `TODAS`, `COBRANZA EXTRAJUDICIAL`, `MOROSOS`, `DEUDA CORRIENTE`, `SIN ADEUDO`, `ANTICIPOS` | `analisis-cobranza-cliente.ts`                              |
| Mes (`mesIdx`)                   | `0..11` (0 = Enero)                                                                        | `FinancialReportFilterStore`                                |

## Formato numerico (regla unica)

| Regla               | Valor                                                           |
| ------------------- | --------------------------------------------------------------- |
| Formateador         | `AccountingNumberPipe` (`@shared/pipes/accounting-number.pipe`) |
| Locale              | `es-MX`                                                         |
| Moneda              | sin simbolo (nunca `$`)                                         |
| Negativos           | `(1,234)` + clase `rf-neg`                                      |
| Cero                | `-`                                                             |
| Decimales           | 0 por defecto                                                   |
| Encabezado de tabla | navy (gradiente `--rf-grad-*`), `800`, uppercase                |

Uso en plantilla:

```html
<td class="rf-td-number" [class.rf-neg]="fila.acumuladoAnual < 0">
  {{ fila.acumuladoAnual | accountingNumber }}
</td>
```

En componentes compartidos (`app-stat-card`, `app-ranked-list`,
`app-breakdown-list`) pasar `format="number"`; su default es `"currency"`.

## Vista movil

- `PlatformService.isMobile` = hibrido || ancho < 768.
- Patron: bloque desktop `d-none d-md-block` + bloque movil `d-md-none` con
  `app-data-view-mobile` (o markup `rf-mobile-*`).
- `LxTabs` proyecta los paneles una sola vez; no volver a poner `<ng-content>`
  en ramas `@if` ni `min-width: min-content` sobre `lux-tabs`.
- Cobertura y deuda: ver `docs/decisiones.md` D9.

## Smoke test

1. Entrar a `/contabilidad/financial-statements-reports`.
2. Cambiar anio y mes; pulsar "Actualizar".
3. Recorrer los 12 tabs: cada uno debe mostrar datos del periodo sin error.
4. Pulsar "Imprimir": aparece overlay, y el dialogo de impresion muestra todos los reportes
   una sola vez (verificar en Network que no hay peticiones duplicadas por reporte).
5. Pulsar "Vista cliente": abre `/publico/contabilidad-cliente/{customerId}/{anio}/{mes}` en pestana nueva.
6. En la vista publica, los 12 tabs deben cargar con el periodo de la URL.

## Debugging tips

- Si un reporte online queda vacio: revisar `filterS.year()` y `filterS.mesIdx()`; el store
  se provee por ruta, si falta el provider Angular lanza error de inyeccion.
- Si la vista publica muestra periodo vacio: los parametros de ruta son `:anio` y `:mes`
  (no `:year`/`:month`); revisar `public.routing.ts`.
- Si el mes no coincide entre tabs online: confirmar que el componente inyecta
  `FinancialReportFilterStore` y no una senal local.
