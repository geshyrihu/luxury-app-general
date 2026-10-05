# Accounting Frontend Setup

Ultima revision: `2026-09-22`
Para: developer nuevo que trabaja `general-ledger/financial-reports`.
Tiempo estimado: 30 minutos.

## Pre-requisitos

- Node y dependencias instaladas en `appsweb/angular`.
- Backend corriendo (los reportes consumen `contabilidad-online/*`).
- Cliente (`customerId`) con datos Aspel sincronizados.

## Lectura en orden

1. `conventions/CONVENTIONS.md`
2. Este `docs/setup.md`
3. `docs/operativo.md` (rutas, componentes, servicios)
4. `docs/decisiones.md` (reglas vigentes del submodulo)
5. `conventions/frontend/frontend-feature-structure.md`

No tomar como verdad operativa documentos viejos que describan:

- `general-ledger/client-accounting/`
- `general-ledger/accounting-online/`
- un servicio fachada `FinancialReportsService`

Esas rutas y ese servicio ya no existen.

## Ruta oficial del frontend

```text
appsweb/angular/src/app/modules/accounting.luxuryapp/general-ledger/financial-reports
```

## Estructura que debes memorizar

```text
financial-reports/
|-- client/            # vista publica (inputs por URL)
|-- online/            # consola interna (filtros, impresion, IA)
|-- interfaces/        # DTOs (aspel-budget.interface.ts)
`-- pipes/             # accounting-number.pipe.ts
```

Regla practica:

- algo que solo ve el cliente externo -> `client/`
- algo operativo interno -> `online/`
- tipo o pipe usado por ambos -> `interfaces/` o `pipes/`

## Rutas para correr y probar

- `http://localhost:4200/contabilidad/financial-statements-reports`
- `http://localhost:4200/contabilidad/reportes/ver/{id}`
- `http://localhost:4200/balance-mensual`
- `http://localhost:4200/publico/contabilidad-cliente/{customerId}/2026/4`

## Patron tecnico vigente

- componentes standalone, `ChangeDetectionStrategy.Eager` (cliente y online)
- `signal()`, `computed()`, `effect()`
- `ApiResponseService` + `Endpoints` directo en cada consumidor
- `FinancialReportFilterStore` para el filtro anio/mes de la consola online
- `@ui/*` para UI

No asumas que el submodulo usa:

- un servicio fachada por reporte
- stores de paginacion
- `BehaviorSubject`

## Mi primer cambio (walkthrough)

1. Localiza el reporte en `online/<reporte>/` o `client/<reporte>/`.
2. Confirma el endpoint en `@core/constants/endpoints/endpoints`
   (`ContabilidadOnline.FinancialStatements.*`).
3. Edita la llamada directa:
   `this.apiS.onGetItem<Tipo>(Endpoints.ContabilidadOnline.FinancialStatements.xxx(...))`.
4. Si es online y aporta contexto a la IA, setea
   `this.filterS.currentReportName` y `this.filterS.currentReportContext`.
5. Compila y prueba:
   `npm run build -- --configuration development`.

## Backend reference paths

- Endpoints: `api/LuxuryApp.Application/.../ContabilidadOnline`
- Entidades/DTOs backend: modulo contable correspondiente.

## Debugging flowchart

```text
Reporte vacio o error?
  -> revisar Network: se llamo el endpoint correcto?
     |-- no -> revisar Endpoints y el effect() del componente
     `-- si -> respuesta vacia? revisar backend / sincronizacion Aspel
  -> online: filtro anio/mes correcto? (filterS)
  -> cliente: parametros de URL :anio/:mes correctos?
  -> error de inyeccion -> falta provider del store en la ruta?
```
