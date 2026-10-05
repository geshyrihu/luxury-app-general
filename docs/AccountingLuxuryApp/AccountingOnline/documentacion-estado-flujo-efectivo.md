# Estado de Avance: Flujo de Efectivo contra Excel Guía

Este documento rastrea el mapeo e implementación de las filas del **Flujo de Efectivo** contrastadas contra las especificaciones del Excel `LIBRO FE`.

## ✅ SECCIÓN 1: CONTABLE (Completado)

### Saldos Iniciales
- [x] **SALDO INICIAL BANCOS**: Extrae de contabilidad `102-000-000`. Mes 1 toma el Saldo Inicial (`I`). Meses posteriores calculan el saldo del mes anterior real (`GetSaldoMes`).
- [x] **SALDO INICIAL INVERSIONES**: Extrae de contabilidad `103-000-000`. Creado e integrado justo debajo de bancos. Misma lógica de saldos reales mes a mes.

### Ingresos
- [ ] **CUOTAS COBRADAS MTTO**: Pendiente de cuadrar al 100%. Resta del ingreso bancario total las cuotas extraordinarias, otros ingresos y ventas de fondo (Cobranza `102-000-000`).
- [x] **CUOTAS COBRADAS EXTRA**: Totalmente cuadrado (Validado por Postman). Filtrado estricto al 4to nivel (`104-XXX-XXX-003`) extrayendo de la empresa COI Cobranza.
- [x] **OTROS INGRESOS**: Automatizado desde la cuenta contable de ingresos `401-001-000` (Abonos). Se eliminó la etiqueta de captura manual.
- [ ] **VENTA FONDOS INVERSIÓN**: Extrae correctamente los Abonos de la cuenta de inversiones `103-000-000`. (Pendiente validación cruzada).
- [ ] **INGRESOS (Total)**: Fila automatizada sumando Cuotas, Otros Ingresos y Venta de Fondos `SUMA(E6:E9)`.

### Gastos
- [ ] **PAGOS A PROVEEDORES**: Pendiente revisión a fondo. Actual: Cargo `201-000-000`.
- [ ] **PAGOS A ACREEDORES**: Pendiente revisión a fondo. Actual: Cargo `202-000-000`.
- [ ] **PAGOS TARJETA CORPORATIVA**: Pendiente revisión a fondo. Actual: Cargo `102-001-003`.
- [ ] **PAGOS DE SUELDOS**: Pendiente revisión a fondo. Actual: Cargo `204-001-000`.
- [ ] **PAGOS DE IMPUESTOS (MES ANT)**: Pendiente revisión a fondo. Actual: Cargos `205`, `206`, `207`.
- [ ] **COMPRA FONDOS INVERSIÓN**: Actual manual / fórmula cruzada pendiente a afinar.
- [ ] **PAGOS DE COMISIONES BANCARIAS**: Actual Cargo `609-001-000`.
- [ ] **GASTOS (Total)**: Fórmula base aplicada correctamente.

---

## ⏳ SECCIÓN 2: ADMINISTRACIÓN (En Revisión)
- [x] **CUENTAS POR PAGAR (CxP)**: Fórmula de resta algebraica (Efectivo disponible) corregida satisfactoriamente. Suma `Proveedores + Sueldos + Impuestos`.
- [x] **CUENTAS POR COBRAR**: Cobranza a corto plazo sumando al flujo, integrando cobranza judicial.

## ⏳ SECCIÓN 3: NOTA INVERSIONES (Pendiente)
- [ ] Validar mapeo de sumas totales contra formulas bloqueadas (Fondo de reserva, Compra, Intereses).
