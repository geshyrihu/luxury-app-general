# Catálogo maestro de KPIs — Dashboard de Métricas (OperationsLuxuryApp)

Tipo: especificación · Fecha: 2026-09-21 · Plan padre: `20260921-plan-operations-dashboard.md`
Propósito: ser la **lista única y ordenada** de todos los KPIs posibles, con la **tabla/entidad real** de donde salen, cómo se calculan y cómo se filtran por cliente. Es el documento sobre el que el Tech Lead decide qué entra, qué cambia y qué se descarta. Ningún KPI se construye si no está aprobado aquí.

Convención de columnas:
- **Fuente**: entidad (clase C#) y campos reales verificados en `api/LuxuryApp.Application/Infrastructure/Data/Entities/`.
- **Filtro por cliente**: campo que permite acotar por `customerId` (para roles Staff).
- **Dato**: `Listo` (fuente verificada, se puede calcular hoy) · `Por verificar` (entidad existe, falta confirmar campos/enums) · `Sin fuente` (no existe hoy).
- **Decisión** (la llena el Tech Lead): Sí / No / Cambiar, y roles.

---

## 0. Orden de trabajo propuesto (guía)

1. **Paso 1 — Tarjetas de solicitudes (lo siguiente a construir).** Solo tarjetas, sin gráficos: Total de solicitudes, Pendientes, Concluidas, % cumplimiento y Tiempo promedio de resolución (KPI-OP-01 a 04 y 06). Usar los componentes que ya existen (`app-stat-card` / `app-kpi-card`, ver sección 5). Los datos ya los entrega el backend aprobado (pendientes, completadas, tiempo promedio); el total es la suma.
2. **Paso 2 — Aprobar este catálogo.** Recorrer la sección 3, marcar cada KPI (Sí/No/Cambiar) y asignar roles. Resolver los puntos abiertos de la sección 4.
3. **Paso 3 — Gráficos.** Solo después del Paso 2: definir cuáles KPIs merecen gráfico y qué necesitan del backend (series por día/semana/mes, agrupaciones). Los gráficos actuales se retiran o se rehacen con altura controlada.
4. **Paso 4 — Ampliar por grupos** en este orden sugerido: Operación → Tickets/SLA → Mantenimiento → Seguridad → Legal/RRHH → Financiero → Ejecutivo. Un grupo por vez, cada uno con su plan y su revisión.

Regla de orden: **cada KPI tiene un ID (`KPI-<grupo>-NN`)**. El catálogo visible en `/dashboard/metrics/catalog` debe generarse a partir de esta lista y usar los mismos IDs.

---

## 1. Cómo se calcula "solicitud" hoy (base del Paso 1)

El backend aprobado (`DashboardMetricsAppService`) une DOS tablas y las llama "operaciones":

| Tipo (etiqueta) | Tabla/entidad | Pendiente | Concluida | Fecha inicio | Fecha fin |
|---|---|---|---|---|---|
| Mantenimiento | `ServiceOrders` (`ServiceOrder`) | `Status` = Pendiente o Proceso | `Status` distinto y `ExecutionDate` con valor | `RequestDate` | `ExecutionDate` |
| Tickets | `Tasks` (`TaskRecord`) | `Status` ≠ `GanttStatus.Completed` | `Status` = Completed | `CreatedAt` | `ClosedDate` |

Rango de fechas: por `RequestDate` (OS) y `CreatedAt` (Tasks). Cliente: OS por `Machinery.CustomerId`; Tasks por `WorkGroup.CustomerId`.
**Total de solicitudes = Pendientes + Concluidas** (las órdenes que no están pendientes ni tienen `ExecutionDate` no se cuentan; ver punto abierto P-2).

---

## 2. Grupos y prioridad

| Grupo | ID | Prioridad sugerida |
|---|---|---|
| Operación (solicitudes) | OP | 1 — Paso 1 |
| Tickets / SLA | TK | 2 |
| Mantenimiento y equipos | MT | 3 |
| Seguridad y accesos | SG | 4 |
| Minutas, inspecciones y supervisión | MI | 5 |
| Legal y contratos | LG | 6 |
| Recursos humanos y reclutamiento | RH | 7 |
| Financiero | FN | 8 |
| Ejecutivo / sistema | EX | 9 (Fase 4) |

---

## 3. Catálogo de KPIs

### OP — Operación (solicitudes)

| ID | KPI | Fórmula | Fuente | Filtro por cliente | Dato | Decisión |
|---|---|---|---|---|---|---|
| KPI-OP-01 | Solicitudes totales | Pendientes + Concluidas | `ServiceOrders` + `Tasks` | `Machinery.CustomerId` / `WorkGroup.CustomerId` | Listo | |
| KPI-OP-02 | Solicitudes pendientes | Conteo pendientes (sección 1) | igual | igual | Listo | |
| KPI-OP-03 | Solicitudes concluidas | Conteo concluidas (sección 1) | igual | igual | Listo | |
| KPI-OP-04 | Tiempo promedio de resolución (días naturales) | Promedio de (fin − inicio) de las concluidas con fecha fin | igual | igual | Listo | |
| KPI-OP-05 | Distribución por tipo (Mantenimiento vs Tickets) | Conteo por tipo | igual | igual | Listo | |
| KPI-OP-06 | % de cumplimiento | Concluidas / Total × 100 | igual | igual | Listo (cálculo sobre 01-03) | |
| KPI-OP-07 | Antigüedad de pendientes (0-7 / 8-15 / >15 días) | Días desde `RequestDate`/`CreatedAt` a hoy, por rango | igual | igual | Listo (requiere ampliar endpoint) | |
| KPI-OP-08 | Tendencia de solicitudes (por semana/mes) | Conteo creadas y concluidas por periodo | igual | igual | Por verificar (requiere endpoint de serie) | |
| KPI-OP-09 | Órdenes de servicio por tipo de mantenimiento | Conteo por `ServiceOrder.TypeMaintance` | `ServiceOrders` | `Machinery.CustomerId` | Listo | |

### TK — Tickets / SLA (se apoya en `Tasks`; NO existe entidad Ticket ni catálogo de SLA)

| ID | KPI | Fórmula | Fuente | Filtro por cliente | Dato | Decisión |
|---|---|---|---|---|---|---|
| KPI-TK-01 | Tickets abiertos vs cerrados | Conteo por `Status` (completado o no) | `Tasks` | `Tasks.CustomerId` o `WorkGroup.CustomerId` (ver P-1) | Listo | |
| KPI-TK-02 | Tickets por prioridad | Conteo por `Priority` | `Tasks` | igual | Listo | |
| KPI-TK-03 | Tickets por grupo de trabajo | Conteo por `WorkGroupId` | `Tasks` + `WorkGroup` | igual | Listo | |
| KPI-TK-04 | Tickets incumplidos (SLA) | Conteo con `BreachedAt` con valor | `Tasks` (`BreachedAt`, `BreachedDay`) | igual | Listo, pero la tolerancia es de 5 días fija en código (no configurable) | |
| KPI-TK-05 | % de SLA cumplido | 1 − incumplidos / total | igual | igual | Listo (con la misma limitación) | |
| KPI-TK-06 | Tickets sin seguimiento reciente | Última alerta/seguimiento vs hoy | `Tasks.LastAlertAt`, `TaskFollowUp` | igual | Por verificar | |

### MT — Mantenimiento y equipos

| ID | KPI | Fórmula | Fuente | Filtro por cliente | Dato | Decisión |
|---|---|---|---|---|---|---|
| KPI-MT-01 | Costo de órdenes de servicio | Suma de `Price` en el rango | `ServiceOrders.Price` | `Machinery.CustomerId` | Listo | |
| KPI-MT-02 | Equipos activos vs inactivos | Conteo por `State` | `Equipment` (`Machinery`) | `Equipment.CustomerId` | Listo | |
| KPI-MT-03 | Mantenimientos programados del periodo | Conteo por `FechaServicio` en el rango | `MaintenanceCalendar` | por verificar (relación con equipo/cliente) | Por verificar | |
| KPI-MT-04 | Costo programado de mantenimiento | Suma de `Price` programado | `MaintenanceCalendar.Price` | por verificar | Por verificar | |
| KPI-MT-05 | Inspecciones de equipo: ejecutadas / pendientes / cerradas | Conteo por `Status`, `IsClosed` | `EquipmentInspectionExecution` | `CustomerId` | Listo | |
| KPI-MT-06 | Inspecciones de equipo por severidad | Conteo por `Severity` | `EquipmentInspectionExecution.Severity` | `CustomerId` | Listo | |
| KPI-MT-07 | Registros de bitácora de mantenimiento | Conteo por `FechaRegistro` | `MaintenanceLog` | por verificar | Por verificar | |

### SG — Seguridad y accesos

| ID | KPI | Fórmula | Fuente | Filtro por cliente | Dato | Decisión |
|---|---|---|---|---|---|---|
| KPI-SG-01 | Alertas de pánico activas / atendidas / resueltas | Conteo por `Status` | `PanicAlert` | `CustomerId` | Listo | |
| KPI-SG-02 | Tiempo promedio de atención de alertas | Promedio de (`AttendedAt` − `CreatedAt`) | `PanicAlert` | `CustomerId` | Listo | |
| KPI-SG-03 | Visitas programadas vs con check-in | Conteo por `Status`, `ActualCheckIn` | `Visit` | `CustomerId` | Listo | |
| KPI-SG-04 | Eventos de acceso por tipo | Conteo por `EventType` | `AccessEvent` | `CustomerId` | Listo | |
| KPI-SG-05 | Roles activos y accesos recientes | Usuarios activos por rol / sesiones recientes | `ApplicationUser` + roles | por confirmar | Por verificar (no explorado) | |

### MI — Minutas, inspecciones y supervisión

| ID | KPI | Fórmula | Fuente | Filtro por cliente | Dato | Decisión |
|---|---|---|---|---|---|---|
| KPI-MI-01 | Compromisos de minuta pendientes | Conteo `Status` Pendiente/Proceso | `MeetingDetails` (vía `Meeting`) | `Meeting.CustomerId` | Listo | |
| KPI-MI-02 | Compromisos de minuta vencidos | `DeliveryDate` < hoy y no concluidos | `MeetingDetails.DeliveryDate` | `Meeting.CustomerId` | Listo | |
| KPI-MI-03 | Cumplimiento de inspecciones | Resultados con `State` verdadero / total | `InspectionResult` (vía `CustomerInspection`) | `CustomerInspection` → cliente | Por verificar | |
| KPI-MI-04 | Supervisiones programadas | Conteo por agenda | `AgendaSupervision` | por verificar | Por verificar | |

### LG — Legal y contratos

| ID | KPI | Fórmula | Fuente | Filtro por cliente | Dato | Decisión |
|---|---|---|---|---|---|---|
| KPI-LG-01 | Pólizas/contratos por vencer (≤45 días) | `EndDate` ≤ hoy+45 y vigente | `InsurancePolicies` (`ContratoPoliza`) | por verificar | Listo (ya lo usa el dashboard actual) | |
| KPI-LG-02 | Tickets legales abiertos | `Tasks` con `WorkGroup.IsLegalGroup` sin completar | `Tasks` + `WorkGroup` | igual TK | Listo | |
| KPI-LG-03 | Contratos de empleados por vencer | por definir | `EmployeeContracts` | por verificar | Por verificar | |

### RH — Recursos humanos y reclutamiento

| ID | KPI | Fórmula | Fuente | Filtro por cliente | Dato | Decisión |
|---|---|---|---|---|---|---|
| KPI-RH-01 | Solicitudes de alta pendientes | Conteo pendientes | `StaffHiringRequests` | por verificar | Listo (ya usado en dashboard actual) | |
| KPI-RH-02 | Solicitudes de baja pendientes | Conteo pendientes | `TerminationRequests` | por verificar | Listo | |
| KPI-RH-03 | Vacantes abiertas | Conteo pendientes | `JobVacancyRequests` | por verificar | Listo | |
| KPI-RH-04 | Modificaciones salariales pendientes | Conteo pendientes | `SalaryChangeRequests` | por verificar | Listo | |
| KPI-RH-05 | Personal ausente | por definir | módulo `ManagementDashboard/AbsentStaff` (existente) | por verificar | Por verificar | |

### FN — Financiero (sin desglose por operación)

| ID | KPI | Fórmula | Fuente | Filtro por cliente | Dato | Decisión |
|---|---|---|---|---|---|---|
| KPI-FN-01 | Ingresos diarios/mensuales | por definir | agregados `FinancialAccounting` / `AccountingOnline` (Aspel COI) | por verificar | Por verificar | |
| KPI-FN-02 | Costos operativos | Suma de costos | `ServiceOrders.Price` (único costo por operación) + agregados contables | por verificar | Por verificar | |
| KPI-FN-03 | Presupuesto vs ejecutado | Ejecutado / presupuesto | `BudgetExecution`, `Budget` | por verificar | Por verificar | |
| KPI-FN-04 | Cobranza (cartera) | por definir | `CollectionsLuxuryApp` (no explorado) | por verificar | Por verificar | |
| KPI-FN-05 | Margen por operación | Ingreso − costo por operación | **no existe ingreso por operación** | — | **Sin fuente** | |

### EX — Ejecutivo / sistema (Fase 4; SuperUsuario y Direccion)

| ID | KPI | Fórmula | Fuente | Dato | Decisión |
|---|---|---|---|---|---|
| KPI-EX-01 | Resumen ejecutivo multi-cliente | Vista con los KPIs clave de todos los clientes | combinación de los grupos anteriores | Depende de aprobar los grupos | |
| KPI-EX-02 | Comparativo entre clientes | Un KPI por cliente | igual | Depende de aprobar los grupos | |

---

## 4. Puntos abiertos (resolver antes de construir más)

- **P-1 Cliente de `Tasks`:** `Tasks` tiene `CustomerId` propio y también se llega al cliente por `WorkGroup.CustomerId`. El backend aprobado filtra por `WorkGroup.CustomerId`. Verificar cuál es el campo fiable (y cuál usa el dashboard actual) para no mostrar números distintos entre ambos dashboards.
- **P-2 Definición de "concluida" de una orden de servicio:** hoy es "no está Pendiente/Proceso y tiene `ExecutionDate`". Una orden cancelada/rechazada sin fecha queda fuera del total. Confirmar con negocio qué estados existen y cuáles cuentan.
- **P-3 ¿Tickets incluye los legales?** `Tasks` mezcla tickets generales y legales (`WorkGroup.IsLegalGroup`). Decidir si el KPI "Tickets" los incluye.
- **P-4 SLA:** confirmar si sirve la tolerancia fija de 5 días o se necesita un catálogo de SLA por tipo/prioridad (entidad nueva, fase posterior).
- **P-5 Días naturales vs hábiles:** se mantiene días naturales (RN-DASH-003).
- **P-6 Roles por KPI:** para cada KPI aprobado, listar roles Corporate/Staff que lo ven. Hoy solo los KPI-OP-01 a 05 tienen roles asignados (los 15 + SuperUsuario/Direccion provisional).

---

## 5. Diseño visual (lo que ya existe y debe reutilizarse)

Revisión de `appsweb/angular/src/styles` y `src/app/shared/ui`:
- **Ya existen los componentes de tarjeta KPI**: `app-stat-card` (`shared/ui/shared/stat-card`; icono, valor, etiqueta, tendencia %, sparkline opcional, orientación vertical/horizontal, formato número/moneda/porcentaje) y `app-kpi-card` (`shared/ui/shared/kpi-card`; icono, etiqueta, valor, tendencia, subtítulo, clicable). La vista actual NO los usa: debe reemplazar sus tarjetas hechas a mano por estos.
- **Tokens disponibles** (del propio `stat-card` y `styles/core|theme|web`): `--ds-bg-surface`, `--ds-border`, `--ds-radius-lg`, `--ds-font-size-metric`, `--ds-font-size-help`, `--ds-text-primary|secondary|muted`, `--ds-success-light`, `--ds-danger-light`, `--ds-accent-text-success|danger`, `--ds-primary`, `--primary-100`, `--ds-shadow-sm|md|lg`.
- **Tarjeta base** `.card` (`styles/web/_cards.scss`) con acentos de color en el borde superior: `card--primary`, `card--success`, `card--warning`, `card--danger`, `card--info`.
- **CSS del proyecto = Bootstrap 5.3 + tokens `--ds-*`. No hay Tailwind** (las clases Tailwind de la implementación actual no se aplican; ese es el origen del mal aspecto).
- **Gráficos:** `<app-chart-wrapper>` debe ir dentro de un contenedor con altura fija (p. ej. 260-300 px, `position: relative`); sin contenedor con altura, la barra ocupó toda la pantalla (bug visto en el navegador).
- Referencia visual deseada por el Tech Lead: tarjetas con icono, valor grande, etiqueta y variación, en una fila; los gráficos vienen después de aprobar los KPIs.

## 6. Cómo se mantiene este documento

Este archivo es la fuente única. Al aprobar/cambiar un KPI se edita aquí (columna Decisión) y luego se actualiza `kpi-catalog.config.ts` con los mismos IDs. El código no debe tener KPIs que no estén aquí.
