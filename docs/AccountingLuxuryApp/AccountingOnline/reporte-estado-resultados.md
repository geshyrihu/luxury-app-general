Ruta: 📂 API > Accounting > ContabilidadOnline > EstadoResultados

# 📈 Reporte Estado de Resultados

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Comparar ingresos y gastos del periodo para construir el resultado operativo.

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/estado-resultados/{customerId}/{year}/{mes}`
- Servicio: `EstadoResultadosService`
- Contrato: `FinancialStatementDTO`

---

## Columnas visibles esperadas en frontend

- `numeroCuenta`
- `descripcion`
- tres meses de ventana móvil/escritorio
- `acumulado`

---

## Cómo se compone

### Clasificaciones usadas

- `4`: ingresos
- `6`: gastos

### Regla de acumulado

El servicio recalcula `AcumuladoAnual` truncándolo hasta el mes solicitado:

- enero a `mes`
- no usa el acumulado anual completo si el usuario está viendo un corte parcial

---

## Cuentas, niveles y lógica

### Ingresos

- se trabaja con `4xx`
- en especial `401` se aplana

#### Regla 401

Si el mayor es `401`:

- se recorren subcuentas y detalles
- si una subcuenta tiene movimiento propio, se “promueve” a fila visible
- si un detalle tiene movimiento, también se promueve a fila visible

Esto permite ver ingresos aunque no todo venga perfectamente consolidado en la cuenta madre.

#### Exclusión explícita

- `401-001-002` se excluye

### Gastos

La vista clásica elimina:

- `605-*`
- `606-*`
- `607-*`

Porque esas cuentas se reportan aparte en otros reportes.

---

## Suma o resta

- Ingresos y gastos no se restan dentro del backend en este servicio
- el frontend arma:
  - total ingresos
  - total gastos
  - resultado del periodo = ingresos - gastos

---

## Detrás de cámaras

- usa `BuildFilteredDataAsync(customerId, fiscalYear, "4", "6")`
- depende de la jerarquía base ya corregida
- usa `PromoteToMayor(...)` para convertir cuentas base en filas homogéneas de salida

