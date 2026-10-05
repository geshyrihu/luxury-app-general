Ruta: 📂 API > Accounting > ContabilidadOnline > FlujoCaja

# 💸 Reporte Flujo de Caja

📅 Última Revisión: 22-jun-26  
🛡️ Estado: En revisión funcional  
👤 Responsable: Equipo Accounting

---

## Objetivo

Modelar entradas y salidas de efectivo por mes, con bloques contables y administrativos.

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/flujo-caja/{customerId}/{year}`
- Servicio: `FlujoCajaService`
- Contrato: `FlujoCajaDTO`

---

## Columnas

- enero a diciembre

Cada fila tiene además:

- `signo`
- `origen`
- banderas:
  - `esSuma`
  - `esResta`
  - `esFilaTotal`
  - `esManual`

---

## Bloques del reporte

- `CONTABLE`
- `ADMINISTRACION`

---

## Cuentas y reglas principales

### Saldos iniciales

- `SALDO INICIAL BANCOS` → `102`
- `SALDO INICIAL INVERSIONES` → `103` menos reserva
- `SALDO INICIAL FONDO DE RESERVA` → reserva inicial

### Ingresos

- `CUOTAS COBRADAS MANTTO` → Cobranza `104-xxx-xxx-001`, último nivel `101`, suma de abonos
- `CUOTAS COBRADAS EXTRA` → Cobranza `104-xxx-xxx-003`, último nivel `003`, suma de abonos
- `OTROS INGRESOS` → saldo acreedor `202-002-000` + abonos `404-001-000`
- `VENTA FONDOS INVERSION` → saldo deudor `103-000-003`
- `INTERESES MANTTO`
- `INTERESES EXTRA` → `403-001-002`

### Gastos

- `PAGOS A PROVEEDORES` → cargos `201`
- `PAGOS A ACREEDORES` → cargos `202`
- `PAGOS TARJETA CORPORATIVA` → cargos `102-001-001`
- `PAGOS DE SUELDOS` → cargos `204-001`
- `PAGOS DE IMPUESTOS (MES ANT)` → saldo deudor `205 + 206 + 207`
- `COMPRA FONDOS INVERSION` → saldo final `204-001-000`
- `PAGOS DE COMISIONES BANCARIAS` → cargos `609-001`
- `ISR POR INVERSIONES`

### Administración

- `CUENTAS POR PAGAR`
- `CXP A PROVEEDORES`
- `CXP DE SUELDOS`
- `CXP DE IMPUESTOS`
- `CUENTA POR COBRAR AL CIERRE`
- `COBRANZA JUDICIAL` → captura manual

---

## Suma o resta

- `INGRESOS` es suma de entradas
- `GASTOS` es suma de salidas
- `SALDO BANCARIO FINAL = ingresos - gastos`
- `EFECTIVO DISPONIBLE DESPUES DE CXP = saldo final - cuentas por pagar`
- `EFECTIVO DISPONIBLE DESPUES DE CXC = disponible después de CXP + cuenta por cobrar a corto plazo`

---

## Detrás de cámaras

- combina empresa `Contabilidad` y `Cobranza`
- usa cargos, abonos, saldo inicial, saldo final y saldo deudor según cada fila
- es el reporte con más reglas manuales específicas por cuenta

> [!IMPORTANT]
> El detalle puntual fila por fila sigue documentado en `SEGUIMIENTO-FLUJO-EFECTIVO.md`.

