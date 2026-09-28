Perfecto, Ricardo. Aquí tienes una **tabla comparativa lista para nómina en Excel** con las fórmulas básicas para calcular automáticamente cada concepto según el _Salario Base de Cotización (SBC)_.

---

## 📊 Tabla de cálculo de aportaciones (ejemplo SBC = $15,000)

| Concepto                          | Fórmula en Excel (ejemplo)                | Aportación Patrón | Aportación Trabajador |
| --------------------------------- | ----------------------------------------- | ----------------- | --------------------- |
| **Retiro (SAR)**                  | `=SBC*0.02`                               | 2%                | 0%                    |
| **Cesantía y Vejez (Patrón)**     | `=SBC*0.045` _(ejemplo 4.5%)_             | 3.15–7.51%        | —                     |
| **Cesantía y Vejez (Trabajador)** | `=SBC*0.01125`                            | —                 | 1.125%                |
| **INFONAVIT**                     | `=SBC*0.05`                               | 5%                | 0%                    |
| **IMSS Cuotas (aprox.)**          | `=SBC*0.20` _(depende de prima RT y UMA)_ | 20–30%            | 2–3%                  |
| **ISN Edo. Méx.**                 | `=SBC*0.03`                               | 3%                | 0%                    |

---

## 📌 Ejemplo con SBC = $15,000

- **Retiro (patrón):** $300
- **Cesantía y Vejez:**
  - Patrón (4.5%): $675
  - Trabajador (1.125%): $169
- **INFONAVIT (patrón):** $750
- **IMSS cuotas patronales aprox.:** $3,000
- **ISN (patrón):** $450

👉 **Total carga patronal:** ≈ $5,175
👉 **Total descuento trabajador:** ≈ $169 + ISR

---

### 🚀 Tip práctico

En Excel puedes armarlo así:

```excel
A1 = "SBC"
B1 = 15000

A2 = "Retiro"
B2 = =B1*0.02

A3 = "Cesantía y Vejez Patrón"
B3 = =B1*0.045

A4 = "Cesantía y Vejez Trabajador"
B4 = =B1*0.01125

A5 = "INFONAVIT"
B5 = =B1*0.05

A6 = "ISN Edo. Méx."
B6 = =B1*0.03
```

Así tendrás un cálculo automático que puedes ajustar según el SBC de cada empleado.

---

¿Quieres que te prepare un **archivo Excel con todas las fórmulas ya configuradas** para que solo ingreses el SBC y se calcule todo automáticamente?
Excelente, Ricardo. Te preparo un **formato de nómina en Excel** con las fórmulas ya configuradas para que solo ingreses el _Salario Base de Cotización (SBC)_ y se calculen automáticamente Retiro, Cesantía y Vejez, INFONAVIT, Cuotas IMSS e ISN.

---

## 📊 Estructura sugerida en Excel

| Concepto                    | Fórmula (Excel) | % Patrón   | % Trabajador |
| --------------------------- | --------------- | ---------- | ------------ |
| Retiro (SAR)                | `=B1*0.02`      | 2%         | 0%           |
| Cesantía y Vejez Patrón     | `=B1*0.045`     | 3.15–7.51% | —            |
| Cesantía y Vejez Trabajador | `=B1*0.01125`   | —          | 1.125%       |
| INFONAVIT                   | `=B1*0.05`      | 5%         | 0%           |
| Cuotas IMSS (aprox.)        | `=B1*0.20`      | 20–30%     | 2–3%         |
| ISN Edo. Méx.               | `=B1*0.03`      | 3%         | 0%           |

👉 Donde **B1 = SBC mensual** (ejemplo: $15,000).

---

## 📌 Ejemplo con SBC = $15,000

- Retiro: $300
- Cesantía y Vejez Patrón: $675
- Cesantía y Vejez Trabajador: $169
- INFONAVIT: $750
- IMSS cuotas patronales aprox.: $3,000
- ISN: $450

**Total carga patronal:** ≈ $5,175
**Total descuento trabajador:** ≈ $169 + ISR

---

### 🚀 Cómo armarlo en Excel

1. En **A1** escribe: `SBC`
2. En **B1** coloca el salario base (ejemplo: `15000`).
3. En las filas siguientes pon los conceptos y fórmulas:

```excel
A2 = "Retiro"
B2 = =B1*0.02

A3 = "Cesantía y Vejez Patrón"
B3 = =B1*0.045

A4 = "Cesantía y Vejez Trabajador"
B4 = =B1*0.01125

A5 = "INFONAVIT"
B5 = =B1*0.05

A6 = "IMSS Cuotas (aprox.)"
B6 = =B1*0.20

A7 = "ISN Edo. Méx."
B7 = =B1*0.03
```

Con esto tendrás un **modelo dinámico**: cambias el SBC en B1 y todo se recalcula automáticamente.

---

¿Quieres que te arme también una **plantilla con desglose mensual y bimestral** (para INFONAVIT y RCV) de modo que puedas usarla directamente en tus reportes de nómina?
| Concepto | Fórmula en Excel (ejemplo) | Patrón | Trabajador |
| --- | --- | --- | --- |
| Retiro (SAR) | `=B1*0.02` | ✔ | — |
| Cesantía y Vejez Patrón | `=B1*0.045` | ✔ | — |
| Cesantía y Vejez Trabajador | `=B1*0.01125` | — | ✔ |
| INFONAVIT | `=B1*0.05` | ✔ | — |
| Cuotas IMSS (aprox.) | `=B1*0.20` | ✔ | ✔ (≈2–3%) |
| ISN Edo. Méx. | `=B1*0.03` | ✔ | — |
| Concepto | Fórmula en Excel | Periodicidad |
| --- | --- | --- |
| Retiro (SAR) | `=B1*0.02*2` | Bimestral |
| Cesantía y Vejez Patrón | `=B1*0.045*2` | Bimestral |
| Cesantía y Vejez Trabajador | `=B1*0.01125*2` | Bimestral |
| INFONAVIT | `=B1*0.05*2` | Bimestral |
Perfecto, Ricardo. Aquí tienes la **plantilla de nómina con desglose mensual y bimestral** que puedes replicar en Excel. Está pensada para que solo ingreses el _Salario Base de Cotización (SBC)_ y se calculen automáticamente las aportaciones patronales y las retenciones al trabajador.

---

## 📊 Plantilla Excel – Nómina IMSS / INFONAVIT / ISN

### Hoja 1: **Mensual**

| Concepto                    | Fórmula en Excel (ejemplo) | Patrón | Trabajador |
| --------------------------- | -------------------------- | ------ | ---------- |
| Retiro (SAR)                | `=B1*0.02`                 | ✔      | —          |
| Cesantía y Vejez Patrón     | `=B1*0.045`                | ✔      | —          |
| Cesantía y Vejez Trabajador | `=B1*0.01125`              | —      | ✔          |
| INFONAVIT                   | `=B1*0.05`                 | ✔      | —          |
| Cuotas IMSS (aprox.)        | `=B1*0.20`                 | ✔      | ✔ (≈2–3%)  |
| ISN Edo. Méx.               | `=B1*0.03`                 | ✔      | —          |

👉 Donde **B1 = SBC mensual** (ejemplo: $15,000).

---

### Hoja 2: **Bimestral (RCV + INFONAVIT)**

| Concepto                    | Fórmula en Excel | Periodicidad |
| --------------------------- | ---------------- | ------------ |
| Retiro (SAR)                | `=B1*0.02*2`     | Bimestral    |
| Cesantía y Vejez Patrón     | `=B1*0.045*2`    | Bimestral    |
| Cesantía y Vejez Trabajador | `=B1*0.01125*2`  | Bimestral    |
| INFONAVIT                   | `=B1*0.05*2`     | Bimestral    |

---

## 📌 Ejemplo con SBC = $15,000

- **Mensual:**
  - Retiro: $300
  - Cesantía y Vejez Patrón: $675
  - Cesantía y Vejez Trabajador: $169
  - INFONAVIT: $750
  - IMSS cuotas patronales aprox.: $3,000
  - ISN: $450

- **Bimestral (RCV + INFONAVIT):**
  - Retiro: $600
  - Cesantía y Vejez Patrón: $1,350
  - Cesantía y Vejez Trabajador: $338
  - INFONAVIT: $1,500

---

### 🚀 Tip de uso

- En la **Hoja Mensual** ingresas el SBC en **B1** y se calculan todas las aportaciones.
- En la **Hoja Bimestral** se multiplican por 2 los conceptos que se pagan cada dos meses.
- Puedes agregar una columna de **ISR** con la tabla vigente del SAT para completar el cálculo de retenciones.

---
