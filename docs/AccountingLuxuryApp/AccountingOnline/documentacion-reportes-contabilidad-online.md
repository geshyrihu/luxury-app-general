# ContabilidadOnline - Mapa actual de reportes

> Documento indice del modulo.
> Vigente al estado del codigo del 12 de mayo de 2026.

## 1. Fuente real de datos

La fuente principal del modulo es Aspel COI API directa.

Flujo actual:

`Angular -> ContabilidadOnlineController -> Servicio de reporte -> IContabilidadOnlineLocalService -> IAspelCoiApiClient -> Aspel COI API`

Los insumos base son:

- cuentas
- saldos
- presupuestos
- polizas
- auxiliares

`Polizas + Auxiliares` se consolidan como `PolizasConDetalle`.

## 2. Endpoints vigentes

| Reporte / accion | Endpoint | Servicio | Contrato |
| --- | --- | --- | --- |
| EPF compacto | `GET /api/contabilidad-online/estado-posicion-financiera/{customerId}/{year}/{mes}` | `EpfService` | `EpfDTO` |
| EPF jerarquico 12 meses | `GET /api/contabilidad-online/estado-posicion-financiera/{customerId}/{year}` | `EpfService` | `FinancialStatementDTO` |
| Validacion de catalogo | `GET /api/contabilidad-online/validacion-catalogo/{customerId}/{year}` | `ValidacionCatalogoService` | `FinancialStatementDTO` |
| Estado de Resultados | `GET /api/contabilidad-online/estado-resultados/{customerId}/{year}/{mes}` | `EstadoResultadosService` | `FinancialStatementDTO` |
| Estado de Resultados V2 | `GET /api/contabilidad-online/estado-resultados-v2/{customerId}/{year}/{mes}` | `EstadoResultadosServiceV2` | `FinancialStatementDTO` |
| Cedula Extraordinaria | `GET /api/contabilidad-online/cedula-extraordinaria/{customerId}/{year}/{mes}` | `CedulaExtraordinariaService` | `CedulaExtraordinariaDTO` |
| Cedula Presupuestal | `GET /api/contabilidad-online/cedula-presupuestal/{customerId}/{year}/{mes}` | `CedulaPresupuestalService` | `FinancialStatementDTO` |
| Reporte Financiero | `GET /api/contabilidad-online/reporte-financiero/{customerId}/{year}/{mes}` | `ReporteFinancieroService` | `ReporteFinancieroDTO` |
| Flujo de Caja | `GET /api/contabilidad-online/flujo-caja/{customerId}/{year}` | `FlujoCajaService` | `FlujoCajaDTO` |
| Analisis de Cobranza contable | `GET /api/contabilidad-online/analisis-cobranza/{customerId}/{year}/{month}` | `AnalisisCobranzaService` | `AnalisisCobranzaDTO` |
| Analisis de Cobranza online | `GET /api/contabilidad-online/analisis-cobranza-online/{customerId}/{year}/{month}/{day}` | `AnalisisCobranzaOnlineService` | `CobranzaOnlineAnalysisResponseDTO` |
| IA auditoria generica | `POST /api/contabilidad-online/ask-ai` | `IAiAssistantService` | `AskAccountingAiDTO` |
| IA auditoria especializada | `POST /api/contabilidad-online/ask-ai-contabilidad-online` | `IAiAssistantService` | `AskContabilidadOnlineAiDTO` |
| IA explicadora | `POST /api/contabilidad-online/explain-ai-contabilidad-online` | `IAiAssistantService` | `AskContabilidadOnlineAiDTO` |

## 3. Reportes funcionales actuales

### EPF

- usa clases `1`, `2`, `3`
- separa `104` en deudores visibles para activo
- no vuelve a sumar anticipos a `203`
- reemplaza `302` por `RemanenteDelEjercicio`
- transfiere el saldo nativo de `302` a `303`
- consolida `206` dentro de `205`

### Estado de Resultados

- version clasica: excluye `401-001-002`, `605`, `606`, `607`
- version V2: restringe la vista a mayores `400..405` y `600..609`
- V2 reconstruye `401-000-000`
- V2 oculta filas en cero desde frontend

### Cedula Extraordinaria

- ya no usa `FinancialStatementDTO`
- devuelve `CedulaExtraordinariaDTO`
- separa `605` en bloque aparte
- calcula recaudado desde `PolizasConDetalle`

### Cedula Presupuestal

- solo cuentas `6xx`
- compara presupuesto vs ejercido
- trunca acumulado al mes de corte
- se integra con vista de "Historial de Compras" detallado de la partida (solo a nivel frontend).

### Reporte Financiero

- combina ingresos, gastos, subtotal, otros ingresos/gastos, resultado del periodo y fondo para mejoras
- muestra numero de cuenta y descripcion
- usa una matriz mensual estilo financiero compacto

### Flujo de Caja

- reescrito para igualar 100% la guía contable (`REPORTE DE FLUJO DE EFECTIVO.md`)
- usa mapeo exhaustivo de cargos/abonos por naturaleza (no sumas de resultado base 400/600)
- identifica campos de llenado manual (`EsManual = true`) que se colorean en frontend
- clasifica en grupos `CONTABLE`, `ADMINISTRACIÓN`, `NOTA - INVERSIONES`
- los signos matemáticos `(+)`, `(-)`, `(=)` se reportan en la propiedad aislada `Signo`.

### Bancos e Inversiones

- nuevo reporte basado en saldos directos de 102 y 103
- estructurado con tablas nativas en UI
- incluye fondo de reserva y saldo consolidado

### Cobranza

- `analisis-cobranza` clasifica saldos `104-*` por judicial, morosos, deuda corriente, sin adeudo y anticipos
- `analisis-cobranza-online` consulta corte exacto desde Aspel en vivo y rechaza fallback local

## 4. Frontend del wrapper financiero

Pantalla principal:

`client/angular/src/app/features/contabilidad/contabilidad-online/pages/financial-reports-wrapper.*`

Tabs activos:

- EPF
- E. Resultados
- E. Resultados V2
- C. Extraordinaria
- % P vs R
- R. Financiero
- Flujo Efectivo
- Cobranza

## 5. Archivos que si son referencia util

- `GUIA-TECNICA-SISTEMA.md`
- `GUIA-REGLAS-EPF.md`
- `GUIA-REGLAS-ESTADO-RESULTADOS.md`
- `GUIA-REGLAS-CEDULA-EXTRAORDINARIA.md`
- `GUIA-REGLAS-CEDULA-PRESUPUESTAL.md`
- `Catalogo General LuxuryF.xlsx`
- carpeta `Responses/` para contraste manual con respuestas Aspel

## 6. Nota sobre la cuenta 104

La sustitucion de `104` con empresa de Cobranza sigue comentada temporalmente en `ContabilidadOnlineLocalService`.

No debe documentarse como regla activa sin verificar el codigo.
