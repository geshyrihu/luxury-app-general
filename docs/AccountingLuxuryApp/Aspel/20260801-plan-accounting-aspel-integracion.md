# 🚀 Propuesta de Integración Operativa y Contable: LuxuryApp ↔ Aspel COI

> **Visión General:** 
> LuxuryApp se convertirá en el motor operativo del día a día (Cobranza, Cuentas por Pagar, Presupuestos). Las administradoras y cajeros utilizarán la app para sus labores, y LuxuryApp se comunicará de manera automática con **Aspel COI**, traduciendo clics en operaciones contables reales. El equipo contable mantendrá su fuente de verdad en Aspel (y su catálogo de cuentas intacto), sin dobles capturas.

---

## 🏗️ 1. Arquitectura del Catálogo (El Cerebro Financiero)

La clave del éxito de esta integración es que LuxuryApp entiende y respeta la naturaleza del catálogo oficial de la empresa. Dependiendo del prefijo de la cuenta (100, 200, 400, 600), LuxuryApp sabe a qué módulo pertenece la operación.

| Rango | Naturaleza | Módulo en LuxuryApp | Descripción Práctica |
| :--- | :--- | :--- | :--- |
| **100** | Activo (Deudora) | **Cobranza y Tesorería** | Cuentas como `102 (Bancos)` y `104 (Condóminos / Cuentas por Cobrar)`. **Aquí vive la deuda de los residentes.** |
| **200** | Pasivo (Acreedora) | **Cuentas por Pagar** | Cuentas como `201 (Proveedores)` y `202 (Acreedores)`. Aquí se registran las facturas pendientes de pago de servicios del edificio. |
| **300** | Patrimonio (Acreedora) | **Contabilidad** | `301 (Patrimonio)` y `302 (Remanentes)`. Control de fondos de reserva y sobrantes de años anteriores. |
| **400** | Ingresos (Acreedora) | **Cobranza** | `401 (Ingresos por Cuotas)`. Se abona aquí cada vez que se le cobra una cuota a un residente. |
| **600** | Egresos (Deudora) | **Presupuestos y Gastos** | Cuentas de Gasto. **Aquí es donde LuxuryApp inyecta el Presupuesto Mensual** autorizado y donde se registran los pagos de luz, agua, limpieza, etc. |

---

## 📊 2. El Flujo de Presupuestos (Serie 600 y 400)

El control presupuestal es una de las joyas de esta integración. Los presupuestos no se cobran; se **asignan** y luego se **ejecutan** (se gastan).

### A. Asignación del Presupuesto (PUT)
Cuando la asamblea aprueba el presupuesto del año para Mantenimiento de Elevadores (Ej. cuenta `601-...`), LuxuryApp envía a Aspel la asignación de los 12 meses.
*   **Método:** `PUT /api/AspelCOI/Presupuestos`
*   **Acción:** Inyecta en la tabla de presupuestos los montos esperados (`Presup01` a `Presup12`) directo a las cuentas 600 y 400.

### B. Ejecución del Gasto (POST)
Cuando el administrador registra el pago al proveedor de elevadores, se genera una póliza de Egreso.
*   **Método:** `POST /api/AspelCOI/Polizas`
*   **Acción:** Genera un Cargo (`Debe`) a la cuenta de Gasto (`601...`) y un Abono (`Haber`) a Bancos (`102...`).

### C. Consulta y Cédula Presupuestal (Reporteo)
Para ver si nos pasamos del presupuesto, LuxuryApp usará la API dinámica de consultas:
*   **Consulta:** Cruzará lo que se inyectó en `Presupuestos` contra los `Movimientos` reales acumulados en la cuenta `600`.

---

## 🛠️ 3. Catálogo de Operaciones por Módulo

### 📗 Módulo de COBRANZA (Saldos, Avisos y Estados de Cuenta)
Todo ocurre interactuando entre las series **104 (Condóminos)**, **401 (Ingresos)** y **102 (Bancos)**.

| Método API | Acción en LuxuryApp | Lo que ocurre en Aspel COI (Cuentas afectadas) |
| :---: | :--- | :--- |
| 🟢 **POST** | **Aviso de Cobro (Día 1):** El sistema emite las cuotas del mes. | **Póliza de Diario:** *Cargo* a la deuda del residente (`104`), *Abono* a ingresos (`401`). |
| 🟢 **POST** | **Recepción de Pago:** El residente paga en la App. | **Póliza de Ingreso:** *Cargo* al banco (`102`), *Abono* liquidando la deuda del residente (`104`). |
| 🔵 **GET** | **Estado de Cuenta / Tableros:** Ver morosidad. | **Consulta Optimizada:** Solo trae los movimientos de la cuenta `104` del residente específico para calcular su deuda al instante. |

### 📘 Módulo de CONTABILIDAD Y CXP (Cuentas y Pólizas)

| Método API | Acción en LuxuryApp | Lo que ocurre en Aspel COI |
| :---: | :--- | :--- |
| 🟢 **POST** | **Alta de Cuenta:** Nuevo residente o proveedor. | Crea un `Num_Cta` Nivel Detalle en la `104` o `201`. |
| 🟡 **PUT** | **Actualización/Baja:** Cierre de cuenta bancaria o cambio de dueño. | Cambia el `Status` a "B" (Baja) en el catálogo de cuentas de Aspel. |
| 🟡 **PUT** | **Corrección de Asiento:** El contador corrige un concepto erróneo. | Edita el concepto de la póliza en el mes abierto. |
| 🔴 **DELETE**| **Cancelación:** Reversión de un pago duplicado no cerrado. | Se elimina la póliza completa del sistema Aspel. |

---

## 💡 4. Ejemplos Prácticos de Integración (Payloads)

### Ejemplo 1: El Residente Paga su Mantenimiento
Observen cómo interactúan los prefijos de cuenta (Serie 100) respetando la partida doble (Suma Debe = Suma Haber).

```json
{
  "Tipo_Poli": "Ig", 
  "Concep_Po": "PAGO MTTO AGOSTO 2026 - DEPTO 101",
  "Partidas": [
    {
      "Num_Cta": "104-001-101-001", // Serie 100 (Condómino) 
      "Concep_Po": "Abono a Cuenta de Residente",
      "Debe_Haber": "H", 
      "MontoMov": 4500.00
    },
    {
      "Num_Cta": "102-001-001-000", // Serie 100 (Banco)
      "Concep_Po": "Ingreso a Banco BBVA",
      "Debe_Haber": "D", 
      "MontoMov": 4500.00
    }
  ]
}
```

### Ejemplo 2: Asignación de Presupuesto Anual (Serie 600)
LuxuryApp envía a Aspel el límite de gasto autorizado para "Mantenimiento de Elevadores".

```json
{
  "Num_Cta": "601-005-000-000", // Serie 600 (Gastos Operativos)
  "Ejercicio": 2026,
  "Presup01": 15000.00, // Enero
  "Presup02": 15000.00  // Febrero
}
```

---

## ✅ 5. Beneficios y Reglas de Blindaje (Fase 0)

1. **No hay Pólizas Descuadradas:** Si LuxuryApp envía un registro por error donde los Cargos no suman lo mismo que los Abonos, el API de Aspel lo rechazará inmediatamente (Error `422 Unprocessable Entity`).
2. **Respeto al Cierre de Mes:** Si el contador ya cerró el mes en Aspel, e intentan registrar o eliminar un cobro desde LuxuryApp, el sistema lo bloqueará (Error `403 Forbidden`).
3. **Control Presupuestal en Vivo:** Como LuxuryApp inyecta el presupuesto y lee los gastos en tiempo real, los administradores tendrán alertas de sobregiro antes de emitir un pago a un proveedor.
