# Reglas de Negocio: Componente Propuesta de Presupuesto

**Ubicación:** `ClientAngular/src/app/features/contabilidad/presupuesto-propuesta`
**Archivos Relevantes:**

- `presupuesto-propuesta.ts`
- `presupuesto-propuesta.html`

Este documento describe cómo el componente principal evalúa el estado de las partidas presupuestales y sus condiciones, para mantener un registro de la lógica aplicada en el diseño y evitar conflictos de interfaz gráfica (UI).

---

## 1. Reglas de Validación Visual

### A. Evaluación de Déficit Presupuestal (`isDeficit`)

- **Regla:** Una partida (que no es agrupada/totalizadora) entra en estado de déficit si el Monto Propuesto (`proposedAmount`) es _estrictamente menor_ que el Promedio Mensual de Gasto (`getAverageMonthlyExpense`), menos $1 peso de tolerancia.
  - La fórmula ignora pequeñas variaciones de redondeos y diferencias por centavos.
- **Interfaz (UI):** Se muestra el indicador grande `🚨` junto al número de cuenta (texto tamaño xl/2xl). Ya no colorea la fila de fondo.

### B. Incremento Elevado o Anormal (`isHighIncrease`)

- **Regla:** Si el porcentaje de aumento (`percentageIncrease`) de la propuesta para el próximo año contra el Presupuesto Actual (`currentAmount`) supera el **5%**.
- **Excepción de Falsos Positivos:** Se ignora esta alerta si el `currentAmount` de la partida en el año base era menor o igual a $0. Esto previene que una partida **nueva** que arranca sin presupuesto inicial se alarme como un "Incremento del 100%".
- **Interfaz (UI):** Se muestra el indicador grande `⚠️` junto a la cuenta. Ya no colorea la fila de fondo.

> **Importante:** A nivel de HTML, las alertas coexisten sin sobreescribirse gráficamente ahora que solo son emojis.

### C. Gasto Mensual Excedido (Sobregiros)

- **Regla:** A nivel de mes individual, si el gasto consumido reportado (`getGastoDelMes`) superó la cuota mensual presupuestada (`getPresupuestoDelMes`) previamente, esta celda en particular indica un sobregiro.
- **Otra Condición:** Esta alerta visual también se dispara de forma anómala si el gasto del mes es _menor a cero_ (cifras negativas que pudieran resultar de ajustes crediticios invaluables sin preaprobaciones).
- **Interfaz (UI):** 
  - La celda (`<td>`) entera tomará la clase de advertencia `exceeded-budget-cell` (un fondo rojo muy sutil).
  - El monto del gasto dentro de ese mes se imprime en **negrita** (`font-semibold`) y en texto **Rojo** (`text-red-700`).

---

## 2. Reglas de Componentes Financieros

### D. Cálculos de Incrementos (Porcentajes y Diferencias)

- **Cálculo de Diferencia:** `DIF = proposedAmount - currentAmount`
- **Fórmula de Porcentaje (`percentageIncrease`):**
  - Condición regular: `((proposedAmount - currentAmount) / currentAmount) * 100`
  - Si el presupuesto base(`currentAmount`) es $0 y la propuesta es mayor a cero, se le asigna un tope estático del `100%`.
  - Si el presupuesto base(`currentAmount`) es $0 y la propuesta se mantiene en $0, reporta `0%`.

### D. Flexibilidad de Promediado Mensual

- **Regla:** Los campos de "Promedio Mensual Gastado" (`getAverageMonthlyExpense`) y "Promedio Mensual Presupuestado" (`getAverageMonthlyBudget`) no están estáticos en un periodo base fijo del año.
- **Comportamiento:** Si el usuario utiliza el control de interfaz multiselección (`monthOptions`) para establecer qué meses quiere evaluar, todo el cálculo se ciñe solamente a los valores que se emitieron en los meses seleccionados, actualizando en tiempo real la regla de déficit.

---

## 3. Reglas de Modificación en Matriz

### E. Integridad por Estados Documentales

- **Regla Domiciliada:** Los inputs para teclear un nuevo valor de presupuesto propuesto, y las eliminaciones de filas o creación de las mismas únicamente se activan si la `Propuesta` tiene un estatus rígido de `"Borrador"` (`currentProposal()?.status === 'Borrador'`).

### F. Borrado Cauteloso de Partidas (`canDeleteItem`)

- **Regla:** Solo se expone el contenedor de borrado de rubros (icono `🗑️`) a las partidas que demuestren estar **totalmente carentes de actividad económica e histórica**.
  - La matriz evalúa que sus 12 variables de gastos y las 12 variables de presupuestos sean equivalentes siempre a exactamente `$0`.

---

## 4. Dinámicas Visuales de Paginación y Filtrado

### G. Eliminación Silenciosa con SignalR/Optimistic Updates

- Al borrar un rubro desde el modal confirmatorio, no se gatilla de nuevo el recargo del arreglo de cuentas completo mediante la API (`onLoadData`).
- **Comportamiento:**
  1. La partida extraída en Backend devuelve OK.
  2. SignalR purga la partida del arreglo `allProposalItems` local.
  3. Se recalcula localmente el `totalAmount`.
  4. Los filtros pre-existentes sobre Gastos Extraordinarios y Proyectos vuelven a ejecutarse en la vista (`applyFilters`).
