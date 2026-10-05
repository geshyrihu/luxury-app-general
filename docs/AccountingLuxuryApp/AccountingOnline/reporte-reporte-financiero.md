Ruta: 📂 API > Accounting > ContabilidadOnline > ReporteFinanciero

# 📊 Reporte Financiero

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Construir una matriz ejecutiva con:

- ingresos
- gastos generales
- subtotal
- otros ingresos / otros gastos
- resultado del periodo
- fondo para mejoras

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/reporte-financiero/{customerId}/{year}/{mes}`
- Servicio: `ReporteFinancieroService`
- Contrato: `ReporteFinancieroDTO`

---

## Columnas

- meses de enero al mes solicitado
- columna final `SUMA`

---

## Cuentas y reglas

### Ingresos ordinarios

Usa detalles `401` específicos:

- `401-001-001`
- `401-001-003`

### Fondo para mejoras

Ingresos del fondo:

- `401-001-004`
- `401-001-005`
- `401-001-006`
- `401-001-007`

### Cuentas excluidas del bloque de fondo

- `401-001-001`
- `401-001-002`
- `401-001-003`

### Otros ingresos

- `402`
- intereses desde `403-001-000`

### Gastos generales

Incluye:

- `601`
- `602`
- `603`
- `604`
- `608`
- `609`

### Otros gastos

- `605-000-000`
- `606-000-000`

### Fondo de mejoras

También usa:

- gastos amenidades `607-005-000`
- gastos mejoras `606-000-000`
- saldo inicial desde `303-001-000`

---

## Suma o resta

- `TotalIngresos = suma de filas de ingresos`
- `TotalGastos = suma de filas de gastos generales`
- `Subtotal = TotalIngresos - TotalGastos`
- `SumaOtros = OtrosIngresos - OtrosGastos`
- `ResultadoPeriodo = Subtotal + SumaOtros`

### Remanente de mejoras

Se calcula acumulando:

- saldo inicial
- más ingresos amenidades
- más intereses mejoras
- menos gastos amenidades
- menos gastos mejoras

---

## Detrás de cámaras

- combina jerarquía contable + pólizas consolidadas
- clasifica intereses entre mantenimiento y mejoras según cuentas relacionadas en póliza
- es un reporte con más reglas de negocio que estructura jerárquica pura

