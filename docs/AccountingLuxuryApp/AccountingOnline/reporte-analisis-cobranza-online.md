Ruta: 📂 API > Accounting > ContabilidadOnline > AnalisisCobranzaOnline

# 🌐 Reporte Análisis de Cobranza Online

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Obtener análisis de cobranza con fecha de corte exacta directamente desde el flujo online, sin depender del resumen contable tradicional.

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/analisis-cobranza-online/{customerId}/{year}/{month}/{day}`
- Servicio: `AnalisisCobranzaOnlineService`
- Contrato: `CobranzaOnlineAnalysisResponseDTO`

---

## Qué lo hace diferente

- no arma la lógica desde `BuildHierarchicalData(...)`
- no toma el árbol contable clásico como fuente principal
- delega al servicio de dashboard online de cobranza

---

## Columnas o bloques típicos

Dependen del contrato del dashboard online, pero suelen incluir:

- propiedad / cuenta base
- saldo anterior
- cargos del periodo
- abonos del periodo
- saldo final
- clasificación
- desglose por conceptos

---

## Cuentas y niveles

- se orienta a cobranza operativa online
- trabaja por **cuentas base de cobranza** y su detalle de movimientos
- el nivel visible depende del dashboard de cobranza, no del árbol `FinancialStatementDTO`

---

## Suma o resta

El comportamiento principal es:

- `saldo final = saldo anterior + cargos - abonos`

Además puede resumir:

- total cobrado
- total vencido
- total anticipos

---

## Detrás de cámaras

- este reporte es un wrapper dentro de `ContabilidadOnline`
- la lógica pesada vive realmente en `CobranzaOnlineDashboardAppService`
- se usa cuando negocio necesita una foto más exacta del corte, no sólo la interpretación contable mensual

