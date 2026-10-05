# 📊 Reporte de Flujo de Efectivo - Cuotas MTTO

> [!IMPORTANT]
> Este reporte estandariza el análisis de flujo de efectivo mensual utilizando datos provenientes de **COI (Contpaq i)**. Asegúrate de verificar la conexión a la base de datos antes de generar el reporte.

---

## 📋 1. Información General

| Campo | Valor |
|-------|-------|
| **Título** | REPORTE DE FLUJO DE EFECTIVO - CUOTAS MTTO |
| **Período** | Mensual (Enero - Diciembre) |
| **Fuente de datos** | COI (Contpaq i) vía funciones `@coiwin|valor!` |
| **Año** | Se obtiene dinámicamente del período (`@PERIODO[A]`) |
| **Empresa** | Se obtiene dinámicamente (`@EMPRESA[E]`) |

---

## 📐 2. Estructura de Columnas

| Columna Excel | Contenido |
|---------------|-----------|
| **B** | ÁREA (etiqueta de sección) |
| **C** | SIGNO (+/-/=) |
| **D** | CONCEPTO/DESCRIPCIÓN |
| **E-P** | MESES (Enero a Diciembre) |
| **Q** | TIPO DE DATO (COI/FORMULA/vacío) |
| **R** | NOTAS (campos manuales) |

---

## 🗂️ 3. Catálogo de Cuentas COI Utilizadas

### Activos (1XX)

| Cuenta COI | Descripción | Tipo Dato | Uso en Reporte |
|------------|-------------|-----------|----------------|
| `102-000-000` | Bancos (cuenta mayor) | I (Inicial) | Saldo Inicial Bancos |
| `102-001-001` | Bancos - Cuenta específica | D (Debe/Cargo) | Cuotas Cobradas |
| `102-001-003` | Tarjeta Corporativa | D (Debe) | Pagos Tarjeta Corporativa |
| `103-000-000` | Fondos de Inversión | H (Haber), I (Inicial) | Venta/Compra Fondos, Fondo Reserva |
| `104-000-000` | Clientes/CxC | F (Final) | Cuenta por Cobrar al Cierre |

### 🟡 Pasivos (2XX)

| Cuenta COI | Descripción | Tipo Dato | Uso en Reporte |
|------------|-------------|-----------|----------------|
| `201-000-000` | Proveedores | D (Debe), F (Final) | Pagos a Proveedores, CxP Proveedores |
| `202-000-000` | Acreedores | D (Debe) | Pagos a Acreedores |
| `204-001-000` | Sueldos por Pagar | D (Debe), F (Final) | Pagos de Sueldos, CxP Sueldos |
| `205-000-000` | Impuestos por Pagar 1 | D (Debe), F (Final) | Pagos/CxP Impuestos |
| `206-000-000` | Impuestos por Pagar 2 | D (Debe), F (Final) | Pagos/CxP Impuestos |
| `207-000-000` | Impuestos por Pagar 3 | D (Debe), F (Final) | Pagos/CxP Impuestos |

### 💰 Ingresos (4XX)

| Cuenta COI | Descripción | Tipo Dato | Uso en Reporte |
|------------|-------------|-----------|----------------|
| `403-000-000` | Productos Financieros | H (Haber) | Intereses Ganados |

### 💸 Gastos (6XX)

| Cuenta COI | Descripción | Tipo Dato | Uso en Reporte |
|------------|-------------|-----------|----------------|
| `609-001-000` | Comisiones Bancarias | D (Debe) | Pagos Comisiones Bancarias |

---

## 🔍 4. Sintaxis de Fórmulas COI

```
@coiwin|valor!'@CTA[CUENTA, TIPO]{MMAA}'
```

| Parte | Descripción | Valores Posibles |
|-------|-------------|------------------|
| `CUENTA` | Número de cuenta contable | Formato: `XXX-XXX-XXX` |
| `TIPO` | Tipo de saldo/movimiento | `I` = Inicial, `F` = Final, `D` = Debe (cargos), `H` = Haber (abonos) |
| `MMAA` | Período mes-año | Ej. `0125` = Enero 2025, `1225` = Diciembre 2025 |

---

## 🏗️ 5. Estructura Jerárquica del Reporte

### Sección 1: Área Contable (Filas 7-22)

```
┌─ SALDO INICIAL BANCOS [COI: 102-000-000, I]
│
├─ (+) INGRESOS
│   ├─ Cuotas Cobradas [COI: 102-001-001, D] - E9 - E10
│   ├─ Otros Ingresos [MANUAL]
│   └─ Venta Fondos Inversión [COI: 103-000-000, H]
│   └─ SUBTOTAL INGRESOS [FORMULA: SUM(E7:E10)]
│
├─ (-) GASTOS
│   ├─ Pagos a Proveedores [COI: -201-000-000, D]
│   ├─ Pagos a Acreedores [COI: -202-000-000, D]
│   ├─ Pagos Tarjeta Corporativa [COI: -102-001-003, D]
│   ├─ Pagos de Sueldos [COI: -204-001-000, D]
│   ├─ Pagos de Impuestos [COI: -(205+206+207)-000-000, D]
│   ├─ Compra Fondos Inversión [MANUAL]
│   └─ Pagos Comisiones Bancarias [COI: -609-001-000, D]
│   └─ SUBTOTAL GASTOS [FORMULA: SUM(E13:E19)]
│
└─ (=) SALDO BANCARIO FINAL [FORMULA: INGRESOS + GASTOS]
```

### Sección 2: Área Administración (Filas 23-36)

```
┌─ (-) CUENTAS POR PAGAR [FORMULA: SUM subcuentas]
│   ├─ Cheques en Tránsito [MANUAL]
│   ├─ CxP a Proveedores [COI: -201-000-000, F]
│   ├─ CxP de Sueldos [COI: -204-001-000, F]
│   └─ CxP de Impuestos [COI: -(205+206+207)-000-000, F]
│
├─ EFECTIVO DISPONIBLE DESPUÉS DE CXP [FORMULA: Saldo + CxP]
│
├─ (+) CUENTAS POR COBRAR
│   ├─ CxC al Cierre [COI: 104-000-000, F] - Cobranza Judicial
│   └─ Cobranza Judicial [MANUAL]
│   └─ CxC A CORTO PLAZO [FORMULA: =CxC al Cierre]
│
└─ EFECTIVO DISPONIBLE DESPUÉS DE CXC [FORMULA: Disp CxP + CxC]
```

### Sección 3: Nota - Inversiones (Filas 38-42)

```
┌─ Fondo de Reserva [COI: 103-000-000, I]
├─ Venta Fondos Inversión [FORMULA: =-E10]
├─ Compra Fondos Inversión [FORMULA: =-E18]
├─ Intereses Ganados [COI: 403-000-000, H]
└─ TOTAL INVERSIÓN [FORMULA: SUM(E38:E41)]
```

---

## ✍️ 6. Campos Manuales (No COI)

| Fila | Campo | Celda Ejemplo |
|------|-------|---------------|
| 9 | Otros Ingresos | E9:P9 |
| 18 | Compra Fondos Inversión | E18:P18 |
| 25 | Cheques en Tránsito | E25:P25 |
| 33 | Cobranza Judicial | E33:P33 |

---

## 🧮 7. Fórmulas Calculadas (Excel)

| Fila | Concepto | Fórmula |
|------|----------|---------|
| 11 | INGRESOS | `=SUMA(E7:E10)` |
| 20 | GASTOS | `=SUMA(E13:E19)` |
| 22 | SALDO BANCARIO FINAL | `=E11+E20` |
| 24 | CUENTAS POR PAGAR | `=SUMA(E25:E28)` |
| 30 | EFECTIVO DISP. DESPUÉS CXP | `=E22+E24` |
| 34 | CXC A CORTO PLAZO | `=E32` |
| 36 | EFECTIVO DISP. DESPUÉS CXC | `=E30+E34` |
| 42 | TOTAL INVERSIÓN | `=SUMA(E38:E41)` |

---

## 💻 8. Modelo de Datos Sugerido para Angular

```typescript
interface FlujoCuentaCOI {
  cuenta: string;        // "102-000-000"
  tipo: 'I' | 'F' | 'D' | 'H';  // Inicial, Final, Debe, Haber
  periodo: string;       // "0125" = Enero 2025
}

interface LineaReporte {
  fila: number;
  signo: '+' | '-' | '=' | '';
  concepto: string;
  fuenteDato: 'COI' | 'FORMULA' | 'MANUAL';
  cuentasCOI?: FlujoCuentaCOI[];  // Si es COI
  formula?: string;               // Si es FORMULA
  valores: number[];              // 12 valores (ene-dic)
}

interface SeccionReporte {
  nombre: string;        // "CONTABLE" | "ADMINISTRACIÓN" | "NOTA"
  lineas: LineaReporte[];
}
```

---

## 📊 9. Resumen de Cuentas por Tipo de Movimiento

| Tipo | Descripción | Cuentas |
|------|-------------|---------|
| **I** | Saldo Inicial | `102-000-000`, `103-000-000` |
| **F** | Saldo Final | `104-000-000`, `201-000-000`, `204-001-000`, `205/206/207-000-000` |
| **D** | Movimientos al Debe | `102-001-001`, `102-001-003`, `201-000-000`, `202-000-000`, `204-001-000`, `205/206/207-000-000`, `609-001-000` |
| **H** | Movimientos al Haber | `103-000-000`, `403-000-000` |

---

> [!TIP]
> **Checklist de Validación:**
> - ¿Los datos de COI están actualizados para el período correcto?
> - ¿Se verificaron los campos manuales antes de la generación del reporte?
> - ¿Las fórmulas de Excel reflejan correctamente la estructura contable actual?

---

*🚀 ¡Listo para generar reportes financieros precisos y profesionales!*
