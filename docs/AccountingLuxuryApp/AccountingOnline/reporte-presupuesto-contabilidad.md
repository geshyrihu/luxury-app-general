Ruta: 📂 API > Accounting > ContabilidadOnline > PresupuestoContabilidad

# 💼 Reporte Presupuesto Contabilidad

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Mostrar gasto ejercido contra presupuesto por cuenta `6xx`, pero con una tabla más estructurada por niveles.

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/presupuesto-contabilidad/{customerId}/{year}/{mes}`
- Servicio: `PresupuestoContabilidadService`
- Contrato: `PresupuestoContabilidadDTO`

---

## Columnas

- `numeroCuenta`
- `descripcion`
- `nivel`
- `montosEjercidos` por mes
- `acumuladoAnual`
- `presupAnual`
- `presupRestante`
- `pstoMensual`

---

## Cuentas, niveles y lógica

### Clasificación usada

- sólo `6`

### Cuentas excluidas

No se muestran:

- `600`
- `605`
- `606`
- `607`

### Niveles que sí se generan

- nivel 1: mayor `601-000-000`
- nivel 2: subcuenta `601-001-000`
- nivel 3: detalle `601-001-001`
- nivel 4: total del mayor

---

## Suma o resta

### Ejercido mensual

- se toma de `MontoEnero...MontoDiciembre`

### Presupuesto anual

- suma de `PresupEnero...PresupDiciembre`

### Presupuesto restante

- `presupAnual - acumuladoAnual`

### Gran total

- suma de todos los mayores incluidos

---

## Detrás de cámaras

- es el reporte más “tabular” del bloque presupuestal
- no usa fórmulas de negocio especiales por cuenta
- su valor está en la estructura por niveles y el gran total consolidado

