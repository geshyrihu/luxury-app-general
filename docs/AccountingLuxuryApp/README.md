# Módulo de Contabilidad y Finanzas

Este es el módulo más extenso del ecosistema LuxuryApp. Gestiona la cobranza (nativa y online), la integración con sistemas Aspel, presupuestos, reportes financieros y el flujo de fondeo de gastos.

---

## Estructura del Módulo

Debido a su extensión, el módulo se divide en varios subdominios críticos:

### 1. Cobranza y Facturación
- `CobranzaNativa`: Sistema de gestión de cuotas, recargos y pagos internos.
- `CobranzaOnline`: Integración con pasarelas de pago y portales de residentes.
- `AspelCobranzaHaus`: Sincronización de saldos con el sistema Aspel.

### 2. Presupuestos y Planeación
- `PresupuestoPropuesta`: Elaboración de propuestas presupuestales para asambleas.
- `PresupuestoWebAspel`: Consulta y validación de presupuestos contra el ERP Aspel.
- `ExpenseCatalogBudget`: Definición de conceptos de gasto y su relación presupuestal.

### 3. Reportes Financieros
- `ContabilidadOnline`: Generación de Balances, Estados de Resultados y Flujos de Efectivo.
- `DynamicReports`: Motor de generación de reportes personalizables.
- `MaintenanceReport`: Informes específicos de gastos de mantenimiento.

### 4. Fondeos y Gastos
- `Fondeos`: Gestión del ciclo de vida de los fondeos para compras y servicios.
- `ExpenseCatalogDetail`: Catálogo detallado de gastos operativos.

---

## Reglas de Negocio Críticas

1.  **Sincronización Aspel:** La verdad única de saldos contables reside en los sistemas Aspel (SAE/COI). LuxuryApp actúa como un espejo y capturador de datos que se sincroniza periódicamente.
2.  **Validación de Presupuesto:** Ninguna Solicitud de Compra (módulo Operaciones) puede ser autorizada si no cuenta con un presupuesto vinculado y saldo suficiente en el snapshot de la cuenta.
3.  **Cierres de Periodo:** El sistema permite cierres mensuales que bloquean la modificación de datos históricos para asegurar la integridad de los reportes financieros.

### Documentación Detallada de Reglas
- [Reglas de Negocio: Fondeos](./REGLAS-NEGOCIO-FONDEOS.md)
- [Reglas de Negocio: Cobranza Nativa](./REGLAS-NEGOCIO-COBRANZA.md)
- [Reglas de Negocio: Reportes Financieros](./REGLAS-REPORTES-FINANCIEROS.md)

---

## Integración con Frontend

- **Dashboard Financiero:** Vista consolidada para administradores y comités.
- **Signals y Rendimiento:** Debido al alto volumen de transacciones, se debe priorizar la carga perezosa (lazy loading) y el uso eficiente de Signals para evitar re-renderizados costosos.
- **Exportación Contable:** Todos los estados financieros deben generarse mediante `HtmlPrintService` para garantizar el formato oficial del cliente.

---

## Especificaciones Técnicas (API)

- **Endpoints:** El módulo utiliza múltiples controladores especializados (ej. `/api/Fondeos`, `/api/CobranzaNativa`).
- **Deuda Técnica:** Se han identificado áreas de mejora en la sincronización Front-Back que están documentadas en `TECHNICAL-DEBT.md`.
- **Primary Constructors:** Uso obligatorio en toda la lógica de servicios contables.

---

_Documentación actualizada en Junio 2026_
