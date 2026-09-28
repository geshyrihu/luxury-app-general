# Bitácora de Políticas de Nómina y Proyecciones

Este documento registra las fórmulas, fuentes y variables de entrada de los cálculos implementados en el motor de proyecciones salariales de **LuxuryApp**, asegurando la alineación con la Ley Federal del Trabajo (LFT) y políticas internas.

## 1. Prima Vacacional
- **Fuente legal:** LFT Artículo 80 (Los trabajadores tendrán derecho a una prima no menor de veinticinco por ciento sobre los salarios que les correspondan durante el período de vacaciones).
- **Variable de entrada:** Antigüedad (Fecha de ingreso a la fecha de corte), Tabla de Vacaciones Federal (Días de vacaciones correspondientes).
- **Fórmula exacta:** `Prima Vacacional Anual = Días de Vacaciones × Salario Diario × 25%`
- **Forma de prorrateo mensual:** `Costo Mensual = Prima Vacacional Anual / 12`

## 2. Prima Dominical
- **Fuente legal:** LFT Artículo 71 (Los trabajadores que presten servicio en día domingo tendrán derecho a una prima adicional de un veinticinco por ciento, por lo menos, sobre el salario de los días ordinarios de trabajo).
- **Variable de entrada:** Horario del puesto de trabajo (`WorkPositionSchedule`). Se extrae de los días de trabajo el número de domingos no marcados como descanso.
- **Fórmula exacta:** `Prima Dominical Anual = (Domingos Laborados al Año) × Salario Diario × 25%`
- **Forma de prorrateo mensual:** Se calculan los domingos laborados por mes (`Domingos en el ciclo / Semanas del ciclo × (52 semanas / 12 meses)`). `Costo Mensual = Domingos al Mes × Salario Diario × 25%`.

## 3. Días Festivos
- **Fuente legal:** LFT Artículo 75 (Pago doble extra por laborar en día de descanso obligatorio).
- **Variable de entrada:** Provisión histórica pactada para el cálculo (por defecto se estiman 3 días festivos laborados al año).
- **Fórmula exacta:** `Días Festivos Anual = Salario Diario × 2 (pago doble) × 3 (días festivos laborados)`
- **Forma de prorrateo mensual:** `Costo Mensual = (Salario Diario × 2 × 3) / 12`

## 4. Aguinaldo
- **Fuente legal:** LFT Artículo 87 (Los trabajadores tendrán derecho a un aguinaldo anual que deberá pagarse antes del día veinte de diciembre, equivalente a quince días de salario, por lo menos).
- **Variable de entrada:** Salario Diario.
- **Fórmula exacta:** `Aguinaldo Anual = Salario Mensual / 2` (Equivale a 15 días de Salario Diario)
- **Forma de prorrateo mensual:** `Costo Mensual = Aguinaldo Anual / 12`

## 5. Total de Percepciones (Base Gravable)
- **Fuente legal:** Reglas fiscales estatales para el cálculo de impuestos.
- **Variable de entrada:** Suma de todas las percepciones.
- **Fórmula exacta:** `Sueldo Mensual + Prima Vacacional Mensual + Prima Dominical Mensual + Días Festivos Mensual + Aguinaldo Mensual`.

## 6. Cuotas Patronales (RCV, INFONAVIT, IMSS)
- **Fuente legal:** Ley del Seguro Social (LSS) y Ley del INFONAVIT.
- **Variable de entrada:** Datos capturados manualmente por RRHH desde la interfaz (debido a variaciones por riesgo de trabajo, SBC topados, amortizaciones, etc.).
- **Fórmula exacta:** *Sin cálculo nativo.* El motor respeta el valor íntegro que captura Recursos Humanos como tarifa plana.

## 7. Impuesto Sobre Nómina (ISN)
- **Fuente legal:** Leyes de Hacienda Locales / Estatales.
- **Variable de entrada:** Total de Percepciones (Base Gravable) y el porcentaje dictado por el Estado del Cliente.
- **Fórmula exacta:** `ISN = Total de Percepciones × % de Impuesto Estatal` (Ej. CDMX = 3%, Edomex = 3%, Nuevo León = 3%).

## 8. Carga Laboral Total
- **Fuente legal:** Consolidación financiera corporativa.
- **Variable de entrada:** Todos los impuestos y cuotas consolidados.
- **Fórmula exacta:** `Costo Total = Cuota RCV + Cuota INFONAVIT + Cuota IMSS + ISN`

## 9. Cálculo de Horas Semanales (Informativo)
- **Fuente legal:** Jornadas laborales configuradas.
- **Variable de entrada:** Horario del Puesto (`WorkPositionSchedule`).
- **Fórmula exacta:** Se suman las horas de cada turno (`HoraSalida - HoraEntrada`) a lo largo de todo el ciclo de configuración, y se dividen entre las semanas reales capturadas.
