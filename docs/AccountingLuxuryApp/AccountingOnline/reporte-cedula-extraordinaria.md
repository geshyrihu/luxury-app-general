Ruta: 📂 API > Accounting > ContabilidadOnline > CedulaExtraordinaria

# 🏗️ Reporte Cédula Extraordinaria

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Separar y analizar:

- recaudado de mejoras
- gastos de mejoras y eventos
- gastos extraordinarios

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/cedula-extraordinaria/{customerId}/{year}/{mes}`
- Servicio: `CedulaExtraordinariaService`
- Contrato: `CedulaExtraordinariaDTO`

---

## Bloques del reporte

- `RecaudadoMejoras`
- `TotalRecaudadoMejoras`
- `GastosMejoras`
- `TotalGastosMejoras`
- `GastosExtraordinarios`
- `TotalGastosExtraordinarios`

---

## Cuentas, niveles y lógica

### Fuente de gastos

Trabaja sobre clasificación `6`.

### Separación por mayor

- `605-*` → extraordinarios
- `606-*` y `607-*` → mejoras/eventos

### Recaudado de mejoras

No sale sólo de saldos jerárquicos.

Se reconstruye desde:

- `PolizasConDetalle`

Regla:

- busca pólizas con contra partidas `401`
- identifica partidas base de mejoras con cuarto nivel `002`

---

## Suma o resta

- los totales son **sumas directas**
- no hay restas internas en el DTO

Se generan filas agregadas mediante:

- `SumRows(...)`

---

## Detrás de cámaras

- mezcla dos fuentes:
  - jerarquía contable
  - pólizas consolidadas
- recalcula acumulado al mes de corte
- sólo conserva filas con movimiento visible

