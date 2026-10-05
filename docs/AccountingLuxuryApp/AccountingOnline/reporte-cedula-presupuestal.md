Ruta: 📂 API > Accounting > ContabilidadOnline > CedulaPresupuestal

# 📋 Reporte Cédula Presupuestal

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Comparar presupuesto contra ejercido en cuentas de gasto `6xx`.

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/cedula-presupuestal/{customerId}/{year}/{mes}`
- Servicio: `CedulaPresupuestalService`
- Contrato: `FinancialStatementDTO`

---

## Columnas visibles típicas

- `numeroCuenta`
- `descripcion`
- `presupuesto mensual`
- meses visibles
- `acumulado`
- `presupuesto anual`
- `presupuesto restante`

---

## Cuentas, niveles y lógica

### Clasificación usada

- sólo `6`

### Reglas de backend

- no cambia la estructura de cuentas
- recalcula `AcumuladoAnual` hasta el mes de corte

### Reglas de frontend relacionadas

El frontend divide en bloques:

- `GASTOS GENERALES`
- `EXTRAORDINARIOS` (`605`)
- `MEJORAS Y PROYECTOS` (`606`)
- `GASTOS EN EVENTOS` (`607`)

---

## Suma o resta

- el presupuesto restante se interpreta como:
  - `presupuesto anual - acumulado ejercido`

- los subtotales por sección son **sumas**

---

## Detrás de cámaras

- backend entrega árbol `FinancialStatementDTO`
- frontend es quien transforma el árbol en filas de tabla presupuestal
- depende de que los `PresupMes` vengan poblados desde Aspel/COI

