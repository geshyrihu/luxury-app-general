# Accounting Frontend Decision Guide

Ultima revision: `2026-09-22`
Uso: decisiones de ubicacion y mantenimiento de `general-ledger/financial-reports`.

## Regla base

Antes de cambiar el frontend, confirmar si el cambio pertenece a:

- `client` (vista publica)
- `online` (consola interna)
- `interfaces` / `pipes` (compartido)

Cierre:

- si afecta la vista externa sin sesion -> `client/`
- si afecta operacion interna, IA o impresion -> `online/`
- si lo usan ambos -> `interfaces/` o `pipes/`

## Decisiones vigentes

### D1. Modulo unificado `financial-reports`

`client-accounting` y `accounting-online` se unificaron en
`general-ledger/financial-reports/` con subcarpetas `client/` y `online/`.

Implicaciones:

- no reintroducir carpetas `client-accounting/` ni `accounting-online/`
- las URLs publicas e internas no cambian

### D2. Sin servicio fachada de reportes

Los consumidores usan `ApiResponseService` + `Endpoints` directo
(patron de `shared.luxuryapp/catalogs/banks/bank-list.ts`).

Implicaciones:

- no crear `FinancialReportsService` ni equivalente
- la fuente unica de URLs es `Endpoints.ContabilidadOnline.FinancialStatements.*`
- `interfaces/` y `pipes/` siguen compartidos

### D3. Tipos y pipe compartidos

`aspel-budget.interface.ts` y `accounting-number.pipe.ts` viven fuera de
`client/` y `online/`.

Implicaciones:

- `client/` no debe importar tipos desde `online/`
- los DTOs crudos Aspel estan definidos una sola vez

### D4. Filtro anio/mes como store inyectable

`reportFilterState` (singleton global) se reemplazo por
`FinancialReportFilterStore` (`@Injectable()`), provisto por ruta.

Implicaciones:

- `financial-reports-wrapper` y `report-viewer` proveen su propia instancia
- las rutas standalone de `presupuesto-contabilidad` proveen la suya
- el anio/mes no se filtra entre rutas

### D5. Impresion desde una sola instancia

La impresion usa los propios paneles de `lux-tabs` (clase `print-all-reports`),
no un bloque duplicado.

Implicaciones:

- no reintroducir un bloque de impresion con copias de los reportes
- se pierden los encabezados por seccion (aceptado)
- los paneles ocultos se fuerzan visibles en `@media print`

### D6. Cobranza cliente reutiliza el store

La vista publica de cobranza usa `CobranzaOnlineStoreService.loadFor(...)` en
lugar de duplicar la orquestacion de llamadas.

Implicaciones:

- el store expone `loadFor(customerId, year, month, day)` y el token
  `COBRANZA_ONLINE_STORE_AUTOLOAD`
- las vistas publicas proveen el token en `false` (no auto-carga por sesion)
- `loadFor` omite la peticion de sync-status

### D9. Cobertura movil de financial-reports

Patron: `app-data-view-mobile` (o markup `rf-mobile-*`) con bloque desktop
`d-none d-md-block` y bloque movil `d-md-none`. `PlatformService.isMobile` =
hibrido || ancho < 768.

Con vista movil:

- EPF (online y cliente)
- Estado de Resultados y V2 (online y cliente, ya existian)
- Cedula Presupuestal (online y cliente)
- Presupuesto Contabilidad (online y cliente)
- Bancos e Inversiones (online y cliente)
- Flujo Efectivo (online y cliente; en online conserva inputs editables)
- Reporte Financiero (online y cliente)
- Proyectos Aprobados (online y cliente; usa las cards existentes)
- Balance Mensual (online)
- Replica de catalogo (online)
- Dashboard Cobranza (cliente)

**Fix base obligatorio**: `LxTabs` proyecta los paneles una sola vez
(`.lux-tabs-panels`) y `app-tabs`/`ili-tabs` trabajan en `navOnly`. Ademas
`.lux-tabs-panels > [tab]` y sus hijos llevan `display:block; min-width:0;
max-width:100%` para evitar el overflow horizontal que entregaban los custom
elements en movil.

**Deuda pendiente (requiere cambio en shared, con analisis de impacto):**

1. **Dashboard Cobranza (online)**: su cuerpo son componentes compartidos de
   `collections.luxuryapp/online-collections/*` (`cobranza-online-analysis`,
   `-morosidad`, `-towers`, `-advances`). Hacerlos moviles cambia tambien las
   paginas propias del modulo Cobranza.
2. **Cedula Extraordinaria**: renderiza `espejo-aspel-extraordinarios`,
   compartido con el modulo Presupuestos.

### D7. Contratos sensibles

- No cambiar parametros de ruta publica `:customerId/:anio/:mes`.
- No cambiar las URLs de `Endpoints.ContabilidadOnline.FinancialStatements.*`.
- No cambiar selectores `app-*` sin actualizar todas las plantillas que los usan.

### D8. Reglas unicas de formato y encabezado

Todos los reportes de estados financieros comparten estas reglas:

- Encabezado de tabla: **navy** (gradiente `--rf-grad-from`/`--rf-grad-to`), `800`,
  uppercase, `letter-spacing .04em`. Aplica tambien a `financial-data-table`.
- Locale: **`es-MX` siempre**. Prohibido `en-US`/`USD`.
- Moneda: **nunca `$`**. Solo el numero.
- Negativos: valor absoluto entre parentesis `(1,234)` + clase `rf-neg` (color).
- Cero: **`-`**.
- Decimales: 0 por defecto.
- Un solo formateador: `AccountingNumberPipe`, ubicado en
  `shared/pipes/accounting-number.pipe.ts` (import `@shared/pipes/accounting-number.pipe`).
  Prohibido `fmt()`, `isNeg()`, `formatNum()` y `Intl.NumberFormat`/`formatCurrency`
  con `style: "currency"`.
- Cuenta: 1 sola forma, `0.72rem` (11.52px), monospace, weight 400, `--rf-muted`.
- Encabezado: 1 solo tamano, `0.8rem`, weight 800, uppercase, gradiente navy.
- Espaciado superior: 1 solo valor. El panel aporta 24px y la tarjeta del
  reporte 24px (`pt-4`), es decir el primer encabezado arranca a ~48-50px.
  No dejar tarjetas de tabla sin `pt-4`.
- Componentes compartidos que reciben `format`: pasar `format="number"`
  (su default `"currency"` imprime `$`).
- La misma regla aplica a los componentes de
  `collections.luxuryapp/online-collections/*` que monta el tab Cobranza
  (analysis, advances, morosidad, towers, summary, condo-owners-detail,
  other-charges, transactions).

Implicaciones:

- no reintroducir metodos locales de formateo
- no usar `| currency` ni `format="currency"` en estos reportes
- el color de negativo es `--rf-neg`; no usar `--rf-red` para montos
