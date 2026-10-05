# Reglas de Negocio: Reportes Financieros Online

Este documento consolida las reglas de cálculo y lógica de negocio para los principales estados financieros generados por el sistema.

---

## 1. Estado de Resultados
- **Propósito:** Mostrar la utilidad o pérdida neta del periodo.
- **Lógica:** Ingresos (Cobranza Efectiva) - Gastos (Fondeos Pagados).
- **Agrupación:** Los conceptos se agrupan por `Departament` y subcategorías de gasto.

## 2. Estado de Posición Financiera (EPF / Balance)
- **Cuentas de Activo:** Bancos, Cuentas por Cobrar (Morosidad), Inventarios.
- **Cuentas de Pasivo:** Cuentas por Pagar (Fondeos pendientes), Provisiones.
- **Capital/Patrimonio:** Resultados de ejercicios anteriores y del periodo actual.

## 3. Cédula Presupuestal
- Compara el presupuesto autorizado contra el gasto real (Fondeado/Pagado).
- **Variación:** Se calcula como `(Presupuesto - Real)`.
- **Alertas:** Se marcan en rojo desviaciones superiores al 10% del presupuesto mensual.

## 4. Cédula Extraordinaria
- Específica para proyectos con fondeo especial fuera de la cuota de mantenimiento ordinaria.
- Requiere seguimiento por proyecto y fecha de finalización estimada.

---

## Especificaciones de Visualización

- **Saldos Negativos:** Deben mostrarse entre paréntesis `(1,234.00)`.
- **Moneda:** Todos los reportes se expresan en Pesos Mexicanos (MXN) a menos que se especifique lo contrario.
- **Encabezados:** Uso obligatorio de `buildStandardHeader` con el logo del cliente y el periodo del reporte.

---

_Consolidado de guías técnicas en Junio 2026_
