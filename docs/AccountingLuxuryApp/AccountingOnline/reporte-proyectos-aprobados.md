Ruta: 📂 API > Accounting > ContabilidadOnline > ProyectosAprobados

# 🏗️ Reporte Proyectos Aprobados

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Monitorear presupuesto y ejecución de proyectos aprobados asociados a cuentas `606`.

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/proyectos-aprobados/{customerId}/{year}`
- Servicio: `ProyectosAprobadosService`
- Contrato: `ProyectosAprobadosDTO`

---

## Columnas visibles típicas

- `numeroCuenta`
- `descripcion`
- `saldoInicial`
- `presupuestoMensual`
- `presupuestoAnual`
- `ejecutadoAnual`
- `porcentajeAvance`
- `totalACobrar`
- `totalCobrado`
- `saldoRestante`
- `meses`

---

## Cuentas, niveles y lógica

### Fuente

- año actual de contabilidad
- año anterior de contabilidad

### Filtro principal

- cuentas que empiezan con `606`

### Regla de visibilidad

Una cuenta se muestra si tiene:

- presupuesto actual
- o presupuesto anterior
- o ejecución anual
- o saldo inicial vivo

### Regla de exclusión de padres

No se excluye por terminar en `-000` de forma ciega.

Se excluye sólo si:

- `Nivel == 1`
- o realmente tiene hijos (`CtaPapa`)

---

## Suma o resta

- `presupuestoAnual = suma de presupuestos 12 meses`
- `ejecutadoAnual = suma de cargos 12 meses`
- `% avance = ejecutadoAnual / presupuestoAnual`
- `saldoRestante = totalACobrar - totalCobrado`

---

## Detrás de cámaras

- cruza presupuesto y saldo de dos ejercicios
- arma también una fila `totalGeneral`
- en frontend puede mostrarse como cards + tabla mensual

