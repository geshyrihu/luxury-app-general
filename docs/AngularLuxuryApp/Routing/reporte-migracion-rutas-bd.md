# Reporte de Migración de Rutas BD → Angular

> **Propósito**: Documentar el cambio de rutas antiguas en BD a las rutas reales
> definidas en `src/app/routing/route-paths.ts`
> **Total de rutas en BD**: 142 | **Actualizadas**: 19

---

## Rutas que Cambiaron

| #   | UUID                                   | Código | Nombre                | Ruta Antigua (BD)                          | Ruta Nueva (Angular)                           |
| --- | -------------------------------------- | ------ | --------------------- | ------------------------------------------ | ---------------------------------------------- |
| 1   | `019c6c02-7718-7d53-a310-edb08c40c065` | 40.01  | JUNTA MENSUAL         | `/board-directors/monthly-meetings`        | `/committee/board-directors/monthly-meetings`  |
| 2   | `019c6c02-7718-726b-b8da-28ea4e4b65d7` | 40.02  | MINUTAS               | `/board-directors/meeting-minutes`         | `/committee/board-directors/meeting-minutes`   |
| 3   | `019c6c02-7719-76db-ab9c-27e62125ae7b` | 40.03  | INFORME FINANCIERO    | `/board-directors/financial-reports`       | `/committee/board-directors/financial-reports` |
| 4   | `019c6c02-7719-7673-800a-00b76aaf3ab3` | 40.03  | BIBLIOTECA            | `/board-directors/documents`               | `/committee/board-directors/documents`         |
| 5   | `019c6c02-7718-78aa-85fd-433b0ea0c50c` | 21     | RECURSOS HUMANOS      | `/human-resources/dashboard`               | `/recursos-humanos`                            |
| 6   | `019c6c02-7718-7dcc-87a6-9d45ed92d5f9` | 21.01  | MIS PERMISOS          | `/human-resources/my-requests`             | `/recursos-humanos/my-requests`                |
| 7   | `019c6c02-7718-74fc-9ea8-e693ccf4d2dc` | 21.02  | MIS VACACIONES        | `/human-resources/my-vacations`            | `/recursos-humanos/my-vacations`               |
| 8   | `019c6c02-7718-73ab-b439-6029212a06af` | 21.03  | CALENDARIO VACACIONES | `/human-resources/vacation-calendar`       | `/recursos-humanos/vacation-calendar`          |
| 9   | `019c6c02-7718-71d6-a11e-d33332101191` | 21.04  | APROBAR SOLICITUDES   | `/human-resources/approval`                | `/recursos-humanos/approval`                   |
| 10  | `019c6c02-7718-7833-ab68-f9b8d625e5dd` | 21.05  | REGISTRAR SOLICITUDES | `/human-resources/register-past-vacations` | `/recursos-humanos/register-past-vacations`    |
| 11  | `019c6c02-7718-7342-b2c3-194075c44da0` | 21.06  | HISTORIAL             | `/human-resources/requests-history`        | `/recursos-humanos/requests-history`           |
| 12  | `019c7bb6-2c87-7f5c-82e0-6468ea413e96` | 21.07  | AUDITORIA             | `/human-resources/auditoria-vacaciones`    | `/recursos-humanos/auditoria-vacaciones`       |
| 13  | `019c6c02-7718-7edf-8a46-1c8f4685d1cd` | 01.10  | CONTRATOS EMPLEADOS   | `/legal/documents/contratos-empleados`     | `/legal/documents/employee-contracts`          |
| 14  | `019c6c02-7718-7df1-889f-1e9a4efb9c22` | 01.11  | JUICIOS / DEMANDAS    | `/legal/documents/juicios`                 | `/legal/documents/lawsuits`                    |
| 15  | `019c6c02-7718-76a2-b115-565513472ce2` | 16.3   | SOLICITUDES           | `/recruitment/requests/vacantes`           | `/recruitment/requests/vacancies`              |
| 16  | `019c6c02-7719-700c-9468-389fad9b1024` | 15.3   | EXTINTORES            | `/delivery-reception/hidrantes`            | `/delivery-reception/hydrants`                 |
| 17  | `019c6c02-7719-7be8-a9aa-8a0059617629` | 15.4   | LLAVES                | `/delivery-reception/llaves`               | `/delivery-reception/keys`                     |
| 18  | `019c6c02-7718-7f2e-a4a1-e6b987d22fc2` | 06.01  | PRESUPUESTOS          | `/purchases/presupuestos`                  | `/purchases/presupuesto`                       |
| 19  | `019db129-b0c6-7892-87ae-e8cca6bc90ea` | 10.21  | DIAGRAM               | `diagram`                                  | `/diagram`                                     |

---

## Resumen por Tipo de Cambio

| Tipo                          | Cantidad | DESCRIPCIÓN                                                                                                                      |
| ----------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Prefijo `/committee/` añadido | 4        | board-directors → committee/board-directors                                                                                      |
| Prefijo `/recursos-humanos/`  | 8        | human-resources → recursos-humanos                                                                                               |
| Path segment normalizado      | 4        | español → inglés (contratos-empleados→employee-contracts, juicios→lawsuits, vacantes→vacancies, hidrantes→hydrants, llaves→keys) |
| Singular corregido            | 1        | presupuestos → presupuesto                                                                                                       |
| Slash inicial añadido         | 1        | diagram → /diagram                                                                                                               |
| **Total**                     | **19**   |                                                                                                                                  |

---

## Rutas sin Cambio (123 registros)

Las rutas que ya coincidían con los paths de Angular **no requieren modificación**.
Incluyen: dashboard, contabilidad, cobranza, tickets, inspecciones, calendarios, directorios, almacén, inventarios, biblioteca, supervisión, reportes, reclutamiento, anuncios, utilidades, etc.

---

## Cómo Ejecutar

```sql
-- Reemplazar [TablaRutas] por el nombre real de la tabla
sqlcmd -S servidor -d bd -i update-rutas-bbdd.sql
```
