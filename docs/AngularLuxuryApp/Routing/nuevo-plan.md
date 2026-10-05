# Plan de Refactorización de Rutas — LuxuryApp Angular

> Fecha: 2026-07-01
> Versión: 1.0

---

## Índice

1. [Diagnóstico del Estado Actual](#1-diagnóstico-del-estado-actual)
2. [Objetivos de la Refactorización](#2-objetivos-de-la-refactorización)
3. [Propuesta de Organización por Módulos](#3-propuesta-de-organización-por-módulos)
4. [Deuda Técnica: Rutas Legacy vs 8-Módulos](#4-deuda-técnica-rutas-legacy-vs-8-módulos)
5. [Plan de Acción — Roadmap](#5-plan-de-acción--roadmap)
6. [Migración Paso a Paso](#6-migración-paso-a-paso)

---

## 1. Diagnóstico del Estado Actual

### 1.1 Dimensiones del Sistema

| Ámbito                                     | Cantidad                           |
| ------------------------------------------ | ---------------------------------- |
| Rutas en Frontend (archivos `.routing.ts`) | ~315                               |
| Archivos de routing                        | ~48                                |
| Rutas en Base de Datos (menú navegable)    | 138                                |
| Controladores Backend (tags Swagger)       | 255                                |
| Endpoints API                              | 1,614                              |
| Layouts principales                        | 3 (Employee, Committee, Direccion) |
| Navegaciones programáticas (`navigate()`)  | ~168                               |
| Navegaciones declarativas (`routerLink`)   | ~77                                |

### 1.2 Problemas Identificados

#### 🚨 CRÍTICOS

| #   | Problema                                                                                               | Impacto                                |
| --- | ------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| P1  | **Dualidad de routing**: mismo módulo accesible por 2 rutas (ej: `/legal` legacy + `/legal` 8-modules) | Duplicación, confusión, peso muerto    |
| P2  | **pages.routing.ts monolítico**: 623 líneas, mezcla `loadComponent` con `loadChildren`                 | Mantenibilidad cero, alto acoplamiento |
| P3  | **Rutas huérfanas**: navegaciones que apuntan a rutas que no existen (3 detectadas)                    | Links rotos en producción              |
| P4  | **4 rutas BD sin implementar**: Códigos 18, 19, 20, 07.2.0                                             | Funcionalidad faltante                 |

#### ⚠️ ALTOS

| #   | Problema                                                                                                                         | Impacto                                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| P5  | **Alias inconsistentes**: `/human-resources` = `/recursos-humanos` = `/hr`                                                       | 3 caminos para un mismo módulo               |
| P6  | **Case-sensitive**: `/Tasks`, `/tasks`, `/tickets` cargan el mismo módulo                                                        | Frágil, propenso a errores 404               |
| P7  | **Board-directors bajo `/committee`**: las rutas 40.x deberían ser `/board-directors/...`                                        | Inconsistente con BD que espera ruta raíz    |
| P8  | **Mezcla idiomas**: `/purchases` vs `/compras`, `/warehouse` vs `/almacen`                                                       | Sin convención clara                         |
| P9  | **Sin módulo físico**: Códigos 17 (SISTEMAS), 18 (RESERVACIONES), 19 (PASES QR), 20 (PAQUETERIA) no existen como feature modules | Funcionalidad sin implementar                |
| P10 | **Rutas relativas en templates**: `../detail`, `../meeting-minutes-detail`                                                       | Frágil ante cambios de estructura de routing |

#### 🔶 MEDIOS

| #   | Problema                                                                                                                                   | Impacto                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| P11 | **Routing de contabilidad fragmentado**: `/contabilidad`, `/cobranza-nativa`, `/accounting`, `/accounting-coi`, más `features/accounting/` | 5 caminos para contabilidad |
| P12 | **Rutas dinámicas sin tipo**: `item.urlRoute`, `item.routerLink`, `customData.route` provienen de BD sin validación                        | Posibles 404 en producción  |
| P13 | **Códigos BD duplicados**: `02.1`, `02.2`, `40.03` tienen 2 entradas cada uno                                                              | Menú inconsistente          |
| P14 | **Duplicación de Componentes**: `InventarioExtintor`, `InventarioHidrante`, etc. existen en `inventory/` y `operations/inventarios/`       | Código duplicado            |
| P15 | ** `/reclutamiento/status-solicitud-vacante`** navegado pero no definido en routing                                                        | Link roto                   |

### 1.3 Mapa de la Fragmentación Actual

```
Backend (Swagger)               Frontend Layouts              Frontend Routing
─────────────────               ────────────────              ────────────────
255 tags / 1614 endpoints       3 layouts                     2 arquitecturas:
                                  ├── LayoutEmployee          ├── routing/*.ts (legacy)
                                  ├── LayoutCommittee         └── features/*/*.ts (nuevo)
                                  └── LayoutDireccion

DB Menú (138 rutas)             Navegaciones (259)
─────────────────               ────────────────
Define qué debe existir         Cómo se llega
pero no siempre coincide        pero no siempre existe destino
```

---

> ⚠️ **Excluido del plan**: `public.routing.ts` — las rutas públicas (`/publico/*`) quedan fuera del alcance de esta refactorización. Se mantienen tal como están por el momento.

## 2. Objetivos de la Refactorización

### Objetivo Principal

**Unificar frontend routing ↔ backend controllers ↔ menú BD en una sola convención por módulo.**

### Principios Rectores

1. **Una ruta por módulo** — no más duplicación legacy vs 8-modules
2. **Convención en español** — el negocio opera en español, las rutas deben reflejarlo
3. **Correlación 1:1 con backend** — cada módulo frontend debe tener un controller backend correspondiente
4. **Todas las rutas BD implementadas** — no más códigos sin ruta
5. **Alias cero** — una sola canonical path por módulo
6. **Case-sensitive consistente** — todo en minúsculas (kebab-case)
7. **pages.routing.ts delegado** — que solo sea un hub que delega a submódulos

### Convención de Nombres Propuesta

| Concepto         | Convención                           | Ejemplo                      |
| ---------------- | ------------------------------------ | ---------------------------- |
| Path en URL      | Español, kebab-case, todo minúsculas | `/recursos-humanos/nominas`  |
| Archivos .ts     | Inglés, kebab-case                   | `human-resources.routing.ts` |
| Nombre módulo BD | Español, mayúscula inicial           | "Recursos Humanos"           |
| Tag Swagger      | Inglés, PascalCase                   | `MyLeaveRequests`            |
| Componente       | Inglés, PascalCase                   | `MyLeaveRequestsList`        |

---

## 3. Propuesta de Organización por Módulos

### 3.1 Mapa Definitivo de Módulos

Cada módulo tiene:

- **Ruta canónica** (path en URL)
- **Controlador backend** (tag Swagger asociado)
- **Rutas BD** códigos que le pertenecen
- **Archivo routing único**

| Módulo                     | Ruta Canónica             | Tag Swagger Principal                                                                      | Códigos BD  | Estado                |
| -------------------------- | ------------------------- | ------------------------------------------------------------------------------------------ | ----------- | --------------------- |
| **Auth**                   | `/auth`                   | `Auth`                                                                                     | —           | ✅ Estable            |
| **Dashboard**              | `/dashboard`              | `Dashboard`                                                                                | —           | ✅ Estable            |
| **Configuración**          | `/configuracion`          | `ApplicationUser`, `ModuleApp`, `Roles`                                                    | 17, 23      | ⚠️ Migrar             |
| **Directorio**             | `/directorio`             | `EmployeeInternal`, `EmployeeExternal`, `Providers`, `Owner`, `Property`                   | 12.x        | ⚠️ Migrar             |
| **Contabilidad**           | `/contabilidad`           | `ContabilidadOnline`, `FinancialReport`, `AccountingCatalog`                               | 02.1–02.91  | 🔴 Fragmentado        |
| **Cobranza**               | `/cobranza`               | `CobranzaPayments`, `Charges`, `ChargeTemplates`, `Invoices`                               | 02.2        | ⚠️ Migrar             |
| **Fondeo**                 | `/fondeo`                 | `Funding`                                                                                  | 02.4, 06.10 | ✅ Ok                 |
| **Compras**                | `/compras`                | `SolicitudCompra`, `OrdenCompra`, `OrdenCompraPresupuesto`, `Providers`                    | 06.x        | ⚠️ Consolidar         |
| **Tickets**                | `/tickets`                | `Task`, `TaskGroup`, `ServiceOrders`                                                       | 03.x        | ✅ Ok (limpiar alias) |
| **Inspecciones**           | `/inspecciones`           | `Inspection`, `InspectionResult`, `InspectionCondominiumAsset`                             | 04.x        | ⚠️ Migrar             |
| **Juntas y Comités**       | `/comites`                | `Meetings`, `MeetingComite`, `MeetingDertailsSeguimiento`, `JuntaMensualSession`           | 02.1, 05.x  | ⚠️ Consolidar         |
| **Mesa Directiva**         | `/mesa-directiva`         | `BoardDirectors`                                                                           | 40.x        | 🔴 Bajo `/committee`  |
| **Bitácoras**              | `/bitacoras`              | `BitacoraMantenimiento`, `MedidorLectura`, `PiscinaBitacora`                               | 07.x        | ⚠️ Migrar             |
| **Almacén**                | `/almacen`                | `Almacen`, `EntradaProducto`, `SalidaProductos`, `ControlPrestamoHerramientas`             | 08.x        | ⚠️ Migrar             |
| **Inventarios**            | `/inventarios`            | `InventarioExtintor`, `InventarioHidrante`, `Tools`, `RadioComunicacion`                   | 09.x        | ⚠️ Consolidar         |
| **Biblioteca**             | `/biblioteca`             | `CustomDocument`, `PolicyContract`, `ManualPasos`                                          | 10.x        | ⚠️ Migrar             |
| **Calendarios**            | `/calendarios`            | `GoogleCalendarEvents`, `CalendarioMaestro`, `Birthday`                                    | 11.x        | ⚠️ Migrar             |
| **Supervisión**            | `/supervision`            | `SupervisionReports`, `AgendaSupervision`, `ResumenGeneral`                                | 13          | ✅ Ok                 |
| **Reportes**               | `/reportes`               | `DynamicReport`, `MaintenanceReport`                                                       | 14          | ⚠️ Migrar             |
| **Entrega-Recepción**      | `/entrega-recepcion`      | `EntregaRecepcion`, `EntregaRecepcionCliente`                                              | 15.x        | ⚠️ Migrar             |
| **Reclutamiento**          | `/reclutamiento`          | `RequestDismissal`, `RequestSalaryModification`, `RequestEmployeeRegister`, `WorkPosition` | 16.x        | ⚠️ Consolidar         |
| **Recursos Humanos**       | `/recursos-humanos`       | `Incident`, `MyLeaveRequests`, `MyVacationRequests`, `NominaEncabezado`, `WorkContract`    | 21.x        | 🔴 Aliases            |
| **Evaluación Empleado**    | `/evaluacion-empleado`    | `PerformanceEvaluations`, `TemplateEvaluation`                                             | 16.5–16.6   | ✅ Ok                 |
| **Anuncios**               | `/anuncios`               | `Announcements`                                                                            | 22          | ✅ Ok                 |
| **Mantenimiento**          | `/mantenimiento`          | `Machineries`, `MaintenanceCalendars`, `FireCycleInspection`                               | 11.2        | ⚠️ Migrar             |
| **Equipo Contra Incendio** | `/equipo-contra-incendio` | `FireInspectionPeriod`, `FireEquipmentResolve`, `EquipmentInspectionExecutions`            | —           | 🔴 Disperso           |
| **Legal**                  | `/legal`                  | `LegalMatter`, `LegalReport`, `ContratosLegal`, `TareasLegal`                              | 01.x        | ⚠️ Migrar             |
| **Reservaciones**          | `/reservaciones`          | _(sin controller)_                                                                         | 18          | 🔴 Sin implementar    |
| **Pases QR**               | `/pases-qr`               | _(sin controller)_                                                                         | 19          | 🔴 Sin implementar    |
| **Paquetería**             | `/paqueteria`             | _(sin controller)_                                                                         | 20          | 🔴 Sin implementar    |
| **Diagramas**              | `/diagramas`              | `DiagramDraw`                                                                              | 10.21       | ⚠️ Migrar             |
| **Dirección**              | `/direccion`              | `MiEdificio`, `AgendaSemanal`                                                              | —           | ✅ Ok                 |
| **Utilidades**             | `/utilidades`             | —                                                                                          | 23.1        | ✅ Ok                 |
| **Recurring Tasks**        | `/tareas-recurrentes`     | `TaskTemplates`, `TaskInstances`                                                           | —           | ✅ Ok                 |
| **AI Assistant**           | `/asistente-ai`           | `AiChat`, `AiAssistant`, `AiKnowledgeBase`, `ElevenLabs`                                   | —           | ✅ Ok                 |
| **Password Manager**       | `/gestor-contrasenas`     | `Passwords`                                                                                | —           | ✅ Ok                 |
| **SAT Funding**            | `/sat-fondeo`             | —                                                                                          | —           | ✅ Ok                 |

### 3.2 Mapa de Migración BD → Ruta Canónica

| Código BD | Nombre BD                | Ruta Actual                                | Ruta Canónica Propuesta                         |
| --------- | ------------------------ | ------------------------------------------ | ----------------------------------------------- |
| 01        | LEGAL                    | —                                          | `/legal`                                        |
| 01.01     | ACTAS CONSTITUTIVAS      | `/legal/documents/incorporation-deeds`     | `/legal/documentos/actas-constitutivas`         |
| 01.02     | ASAMBLEAS                | `/legal/documents/assemblies`              | `/legal/documentos/asambleas`                   |
| 01.03     | CONCESIÓN BARRANCA       | `/legal/documents/ravine-concession`       | `/legal/documentos/concesion-barranca`          |
| 01.04     | POZO DE AGUA             | `/legal/documents/well-concession`         | `/legal/documentos/concesion-pozo`              |
| 01.08     | REGLAMENTOS              | `/legal/documents/regulations`             | `/legal/documentos/reglamentos`                 |
| 01.10     | CONTRATOS EMPLEADOS      | `/legal/documents/contratos-empleados`     | `/legal/documentos/contratos-empleados`         |
| 01.11     | JUICIOS                  | `/legal/documents/juicios`                 | `/legal/documentos/juicios`                     |
| 01.12     | PENDIENTES DE MINUTAS    | `/legal/legal-minutes-pendings`            | `/legal/minutas-pendientes`                     |
| 01.13     | ADMINISTRAR ASUNTOS      | `/legal/legal-matter`                      | `/legal/asuntos`                                |
| 01.2      | TICKETS LEGAL            | `/legal/list-ticket-legal`                 | `/legal/tickets`                                |
| 01.3      | REPORTE GRAL PENDIENTES  | `/legal/pendings`                          | `/legal/reportes/pendientes`                    |
| 01.4      | REPORTE INTERNO          | `/legal/reports-internal`                  | `/legal/reportes/internos`                      |
| 01.5      | REPORTE EXTERNO          | `/legal/reports-external`                  | `/legal/reportes/externos`                      |
| 01.6      | DIRECTORIO DE COMITES    | `/legal/committee-directory`               | `/legal/comites`                                |
| 02.1      | CONTABILIDAD             | `/contabilidad`                            | `/contabilidad`                                 |
| 02.1      | PRESENTACIONES           | `/committee-meetings/presentations`        | `/comites/presentaciones`                       |
| 02.2      | COBRANZA                 | `/cobranza-nativa`                         | `/cobranza`                                     |
| 02.2      | PENDIENTES MINUTAS       | `/contabilidad/minutes-pendings`           | `/contabilidad/minutas-pendientes`              |
| 02.3      | ESTADOS FINANCIEROS      | `/contabilidad/financial-statements`       | `/contabilidad/estados-financieros`             |
| 02.4      | FONDEO                   | `/funding/list`                            | `/fondeo`                                       |
| 02.5      | ENVIO FINANCIEROS        | `/contabilidad/financial-report-sending`   | `/contabilidad/envio-financieros`               |
| 02.6      | ESPEJO ASPEL             | `/contabilidad/budget`                     | `/contabilidad/espejo-aspel`                    |
| 02.7      | REPORTES FINANCIEROS     | `/contabilidad/financial-summary`          | `/contabilidad/reportes-financieros`            |
| 02.8      | PRESUPUESTO NUEVO        | `/contabilidad/budget-proposal`            | `/contabilidad/presupuesto`                     |
| 02.9      | CATALOGO CUENTAS ASPEL   | `/contabilidad/accounting-catalog`         | `/contabilidad/catalogo-cuentas`                |
| 02.91     | PROYECCION GASTOS        | `/contabilidad/budget-execution`           | `/contabilidad/proyeccion-gastos`               |
| 03        | TICKETS                  | —                                          | `/tickets`                                      |
| 03.1      | GRUPOS DE TRABAJO        | `/tickets/groups-list`                     | `/tickets/grupos`                               |
| 03.2      | MIS ASIGNACIONES         | `/tickets/my-assignments`                  | `/tickets/mis-asignaciones`                     |
| 03.3      | MIS SOLICITUDES          | `/tickets/my-requests`                     | `/tickets/mis-solicitudes`                      |
| 03.4      | LEGAL                    | `/tickets/legal`                           | `/tickets/legal`                                |
| 04        | INSPECCIONES             | —                                          | `/inspecciones`                                 |
| 04.1      | CATALOGO                 | `/inspections/catalog`                     | `/inspecciones/catalogo`                        |
| 04.2      | EJECUTAR INSPECCIONES    | `/inspections/my-inspection-list`          | `/inspecciones/ejecutar`                        |
| 05        | JUNTAS COMITE            | —                                          | `/comites`                                      |
| 05.03     | AGENDAR REUNIONES        | `/calendars/google-calendar`               | `/comites/agenda`                               |
| 05.1      | PRESENTACIONES           | `/committee-meetings/presentations`        | `/comites/presentaciones`                       |
| 05.2      | MINUTAS                  | `/committee-meetings/minutes`              | `/comites/minutas`                              |
| 06        | COMPRAS                  | —                                          | `/compras`                                      |
| 06.001    | PRESUPUESTO ASPEL        | `/contabilidad/budget`                     | `/compras/presupuesto-aspel`                    |
| 06.01     | PRESUPUESTOS             | `/purchases/presupuestos`                  | `/compras/presupuestos`                         |
| 06.03     | PRODUCTOS Y SERVICIOS    | `/purchases/products-services`             | `/compras/productos-servicios`                  |
| 06.04     | SOLICITUDES DE COMPRA    | `/purchases/purchase-requests`             | `/compras/solicitudes`                          |
| 06.05     | CATALOGO OC FIJOS        | `/purchases/fixed-expenses-catalog`        | `/compras/gastos-fijos`                         |
| 06.06     | ORDEN COMPRA             | `/purchases/purchase-orders`               | `/compras/ordenes-compra`                       |
| 06.10     | FONDEO                   | `/funding/list`                            | `/fondeo`                                       |
| 06.11     | OC PAGADAS               | `/purchases/paid`                          | `/compras/ordenes-pagadas`                      |
| 06.2      | PRESUPUESTO ANUAL        | `/contabilidad/budget`                     | `/compras/presupuesto-anual`                    |
| 06.3      | PRESUPUESTO MTTO         | `/purchases/maintenance-budget`            | `/compras/presupuesto-mantenimiento`            |
| 07        | BITACORAS                | —                                          | `/bitacoras`                                    |
| 07.1      | ORDENES DE MTTO          | `/logbook/maintenance-orders`              | `/bitacoras/ordenes-mantenimiento`              |
| 07.2      | RECORRIDO DIARIO         | `/logbook/recorrido`                       | `/bitacoras/recorrido-diario`                   |
| 07.2.0    | RECORRIDO DIARIO Jav     | `/logbook/equipment`                       | ❌ No implementar (duplicado)                   |
| 07.3      | LECTURA DE CONSUMOS      | `/logbook/meter-list`                      | `/bitacoras/lectura-consumos`                   |
| 07.4      | ALBERCAS                 | `/logbook/pool`                            | `/bitacoras/albercas`                           |
| 07.5      | FALLA ELEVADORES         | `/logbook/elevators-emergency-call`        | `/bitacoras/falla-elevadores`                   |
| 07.6      | REFACCIONES ELEVADORES   | `/logbook/elevator-spare-parts-change`     | `/bitacoras/refacciones-elevadores`             |
| 07.7      | RECEPCION PIPAS AGUA     | `/logbook/water-truck-reception`           | `/bitacoras/recepcion-pipas-agua`               |
| 08        | ALMACEN                  | —                                          | `/almacen`                                      |
| 08.1      | ALMACENES                | `/warehouse/list`                          | `/almacen`                                      |
| 08.3      | ENTRADA DE INSUMOS       | `/warehouse/product-entry`                 | `/almacen/entrada-insumos`                      |
| 08.4      | SALIDA DE INSUMOS        | `/warehouse/product-output`                | `/almacen/salida-insumos`                       |
| 08.5      | PRESTAMO HERRAMIENTAS    | `/warehouse/tool-loan`                     | `/almacen/prestamo-herramientas`                |
| 09        | INVENTARIOS              | —                                          | `/inventarios`                                  |
| 09.01     | EXTINTORES               | `/inventory/extinguishers`                 | `/inventarios/extintores`                       |
| 09.02     | HIDRANTES                | `/inventory/hydrants`                      | `/inventarios/hidrantes`                        |
| 09.03     | ESTACIONES MANUALES      | `/inventory/manual-call-points`            | `/inventarios/estaciones-manuales`              |
| 09.04     | DETECTORES DE HUMO       | `/inventory/smoke-detectors`               | `/inventarios/detectores-humo`                  |
| 09.5      | LLAVES                   | `/inventory/keys`                          | `/inventarios/llaves`                           |
| 09.6      | HERRAMIENTAS             | `/inventory/tools`                         | `/inventarios/herramientas`                     |
| 09.7      | RADIOS                   | `/inventory/radios`                        | `/inventarios/radios`                           |
| 09.9      | EQUIPAMIENTO             | `/inventory/areas-equipment`               | `/inventarios/equipamiento`                     |
| 10        | BIBLIOTECA               | —                                          | `/biblioteca`                                   |
| 10.01     | ACTA CONSTITUTIVA        | `/library/incorporation-deed`              | `/biblioteca/acta-constitutiva`                 |
| 10.02     | ASAMBLEAS                | `/library/assemblies`                      | `/biblioteca/asambleas`                         |
| 10.03     | REGLAMENTOS              | `/library/regulations`                     | `/biblioteca/reglamentos`                       |
| 10.04     | CONCESION BARRANCA       | `/library/ravine-concession`               | `/biblioteca/concesion-barranca`                |
| 10.05     | CONCESION POZO           | `/library/well-concession`                 | `/biblioteca/concesion-pozo`                    |
| 10.15     | ESTADOS FINANCIEROS      | `/library/financial-report`                | `/biblioteca/estados-financieros`               |
| 10.16     | CONTRATOS POLIZAS        | `/library/maintenance-policies`            | `/biblioteca/contratos-polizas`                 |
| 10.17     | FORMATOS                 | `/library/templates`                       | `/biblioteca/formatos`                          |
| 10.18     | MANUALES Y PROCESOS      | `/library/manuals-and-processes`           | `/biblioteca/manuales-procesos`                 |
| 10.19     | CATALOGO DE PINTURA      | `/library/painting`                        | `/biblioteca/catalogo-pintura`                  |
| 10.20     | CATALOGO ILUMINACIÓN     | `/library/lighting`                        | `/biblioteca/catalogo-iluminacion`              |
| 10.21     | DIAGRAMAS                | `/diagram`                                 | `/diagramas`                                    |
| 11        | CALENDARIOS              | —                                          | `/calendarios`                                  |
| 11.1      | REUNIONES COMITE         | `/calendars/google-calendar`               | `/comites/agenda` (alias)                       |
| 11.2      | MANTENIMIENTO PREVENTIVO | `/maintenance/annual-calendar`             | `/mantenimiento/calendario-anual`               |
| 11.3      | CUMPLEAÑOS               | `/calendars/birthdays`                     | `/calendarios/cumpleanos`                       |
| 11.4      | RESERVACIONES            | `/calendars/reservaciones`                 | `/reservaciones`                                |
| 12        | DIRECTORIOS              | —                                          | `/directorio`                                   |
| 12.1      | COMITE VIGILANCIA        | `/directory/vigilance-committee`           | `/directorio/comite-vigilancia`                 |
| 12.2      | PERSONAL INTERNO         | `/directory/staff`                         | `/directorio/personal-interno`                  |
| 12.3      | PERSONAL EXTERNO         | `/directory/external-staff`                | `/directorio/personal-externo`                  |
| 12.4      | PROVEEDORES              | `/directory/provider`                      | `/directorio/proveedores`                       |
| 12.5      | TELEFONOS EMERGENCIA     | `/directory/emergency-phones`              | `/directorio/telefonos-emergencia`              |
| 12.6      | CONDOMINOS               | `/directory/condos`                        | `/directorio/condominos`                        |
| 12.7      | PROPIEDADES              | `/directory/properties`                    | `/directorio/propiedades`                       |
| 13        | SUPERVISION              | `/supervision`                             | `/supervision`                                  |
| 14        | REPORTES                 | —                                          | `/reportes`                                     |
| 14.4      | HISTORIAL ACCESO         | `/report/access-history`                   | `/reportes/historial-acceso`                    |
| 15        | ENTREGA RECEPCION        | —                                          | `/entrega-recepcion`                            |
| 15.1      | EQUIPOS                  | `/delivery-reception/equipment`            | `/entrega-recepcion/equipos`                    |
| 15.2      | INSTALACIONES            | `/delivery-reception/installations`        | `/entrega-recepcion/instalaciones`              |
| 15.3      | EXTINTORES               | `/delivery-reception/hidrantes`            | `/entrega-recepcion/extintores`                 |
| 15.4      | LLAVES                   | `/delivery-reception/llaves`               | `/entrega-recepcion/llaves`                     |
| 15.5      | HERRAMIENTAS             | `/delivery-reception/tools`                | `/entrega-recepcion/herramientas`               |
| 15.6      | MANTENIMIENTOS           | `/delivery-reception/maintenance`          | `/entrega-recepcion/mantenimientos`             |
| 15.7      | INSUMOS                  | `/delivery-reception/supplies`             | `/entrega-recepcion/insumos`                    |
| 16        | RECLUTAMIENTO            | —                                          | `/reclutamiento`                                |
| 16.1      | PLANTILLA INTERNA        | `/directory/staff`                         | `/reclutamiento/plantilla-interna`              |
| 16.2      | SOLICITUDES CLIENTE      | `/recruitment/requests`                    | `/reclutamiento/solicitudes-cliente`            |
| 16.3      | SOLICITUDES              | `/recruitment/requests/vacantes`           | `/reclutamiento/vacantes`                       |
| 16.5      | PLANTILLAS EVALUACION    | `/employee-evaluation/templates/list`      | `/evaluacion-empleado/plantillas`               |
| 16.6      | LISTADO EVALUACIÓN       | `/employee-evaluation/conduct/list`        | `/evaluacion-empleado/evaluaciones`             |
| 17        | SISTEMAS                 | —                                          | `/configuracion`                                |
| 18        | RESERVACIONES            | —                                          | `/reservaciones`                                |
| 19        | PASES QR                 | —                                          | `/pases-qr`                                     |
| 20        | PAQUETERIA               | —                                          | `/paqueteria`                                   |
| 21        | RECURSOS HUMANOS         | `/recursos-humanos`                        | `/recursos-humanos`                             |
| 21.01     | MIS PERMISOS             | `/human-resources/my-requests`             | `/recursos-humanos/mis-permisos`                |
| 21.02     | MIS VACACIONES           | `/human-resources/my-vacations`            | `/recursos-humanos/mis-vacaciones`              |
| 21.03     | CALENDARIO VACACIONES    | `/human-resources/vacation-calendar`       | `/recursos-humanos/calendario-vacaciones`       |
| 21.04     | APROBAR SOLICITUDES      | `/human-resources/approval`                | `/recursos-humanos/aprobaciones`                |
| 21.05     | REGISTRAR SOLICITUDES    | `/human-resources/register-past-vacations` | `/recursos-humanos/registro-vacaciones-pasadas` |
| 21.06     | HISTORIAL                | `/human-resources/requests-history`        | `/recursos-humanos/historial`                   |
| 21.07     | AUDITORIA SALDOS         | `/human-resources/auditoria-vacaciones`    | `/recursos-humanos/auditoria-vacaciones`        |
| 22        | ANUNCIOS                 | `/announcements/manage`                    | `/anuncios`                                     |
| 23        | UTILIDADES               | —                                          | `/utilidades`                                   |
| 23.1      | CALCULADORA IVA          | `/utilities/calculate-vat`                 | `/utilidades/calculadora-iva`                   |
| 40        | MESA DIRECTIVA           | —                                          | `/mesa-directiva`                               |
| 40.01     | JUNTA MENSUAL            | `/board-directors/monthly-meetings`        | `/mesa-directiva/juntas-mensuales`              |
| 40.02     | MINUTAS                  | `/board-directors/meeting-minutes`         | `/mesa-directiva/minutas`                       |
| 40.03     | INFORME FINANCIERO       | `/board-directors/financial-reports`       | `/mesa-directiva/informes-financieros`          |
| 40.03     | BIBLIOTECA               | `/board-directors/documents`               | `/mesa-directiva/biblioteca`                    |

---

## 4. Deuda Técnica: Rutas Legacy vs 8-Módulos

### 4.1 Dualidad Actual

| Módulo      | Ruta Legacy (`routing/*`)               | Ruta Nueva (`features/*`) | Acción                               |
| ----------- | --------------------------------------- | ------------------------- | ------------------------------------ |
| Accounting  | `/contabilidad`, `/accounting`          | `/accounting`             | ✅ Consolidar en `/contabilidad`     |
| HR          | `/recursos-humanos`, `/human-resources` | `/hr`                     | ✅ Consolidar en `/recursos-humanos` |
| Legal       | `/legal`                                | `/legal`                  | ⚠️ Elegir una y migrar               |
| Maintenance | `/maintenance`                          | `/maintenance`            | ⚠️ Elegir una y migrar               |
| Operations  | `/operations`                           | `/operations`             | ⚠️ Elegir una y migrar               |
| Purchasing  | `/purchases`                            | `/purchasing`             | ⚠️ Elegir una y migrar               |
| Recruitment | `/recruitment`                          | `/recruitment`            | ⚠️ Elegir una y migrar               |
| System      | `/settings`                             | `/system`                 | 🔴 Unificar en `/configuracion`      |

### 4.2 Estrategia de Resolución

```
Fase 1: Mover todo a routing/ (unificar)
  └── Cada módulo hereda TODO de features/ y routing/
  └── Se queda un solo archivo .routing.ts por módulo en routing/

Fase 2: Renombrar rutas a español
  └── Aplicar tabla de migración (sección 3.2)
  └── Redirects 301 de rutas viejas a nuevas

Fase 3: Eliminar features/ routing
  └── Una vez que routing/ unificado funcione, borrar features/*.routing.ts
  └── features/ se queda SOLO con componentes, sin definiciones de ruta
```

### 4.3 Estructura Post-Refactor

```
src/app/
├── routing/                      ← ÚNICO lugar de definiciones de ruta
│   ├── pages.routing.ts          ← Hub (reducido, solo loadChildren)
│   ├── app.routes.ts             ← Top-level (auth, public, layouts)
│   ├── auth.routing.ts
│   ├── contabilidad.routing.ts   ← Unifica /contabilidad + legacy
│   ├── recursos-humanos.routing.ts ← Unifica /recursos-humanos + /hr
│   ├── compras.routing.ts
│   ├── tickets.routing.ts
│   ├── ...
│   └── redirects.routing.ts      ← Solo redirects de rutas legacy
├── features/                     ← SOLO componentes y servicios
│   ├── accounting/
│   ├── hr/
│   ├── ...
│   └── (SIN archivos .routing.ts)
```

---

## 5. Plan de Acción — Roadmap

### Fase 0: Quick Wins (Semana 1)

| Tarea | DESCRIPCIÓN                                                                                    | Dependencias |
| ----- | ---------------------------------------------------------------------------------------------- | ------------ |
| QW-01 | Eliminar alias `/Tasks` y `/tasks`, dejar solo `/tickets`                                      | Baja         |
| QW-02 | Eliminar alias `/human-resources`, dejar solo `/recursos-humanos`                              | Baja         |
| QW-03 | Eliminar alias `/accounting` y `/accounting-coi`, consolidar en `/contabilidad`                | Media        |
| QW-04 | Agregar redirects de rutas antiguas a nuevas en `redirects.routing.ts`                         | Baja         |
| QW-05 | Implementar módulos 18 (Reservaciones), 19 (Pases QR), 20 (Paquetería) con páginas placeholder | Alta         |
| QW-06 | Implementar ruta faltante `/logbook/equipment` o eliminarla de BD si es duplicado              | Media        |

### Fase 1: Unificación Legacy vs 8-Módulos (Semana 2-3)

| Tarea | DESCRIPCIÓN                                                                                       | Dependencias  |
| ----- | ------------------------------------------------------------------------------------------------- | ------------- |
| U1-01 | Mover rutas de `features/accounting/accounting.routing.ts` a `routing/contabilidad.routing.ts`    | QW-03         |
| U1-02 | Mover rutas de `features/hr/hr.routing.ts` a `routing/recursos-humanos.routing.ts`                | QW-02         |
| U1-03 | Mover rutas de `features/legal/legal.routing.ts` a `routing/legal.routing.ts`                     | —             |
| U1-04 | Mover rutas de `features/maintenance/maintenance.routing.ts` a `routing/mantenimiento.routing.ts` | —             |
| U1-05 | Mover rutas de `features/operations/operations.routing.ts` a `routing/operaciones.routing.ts`     | —             |
| U1-06 | Mover rutas de `features/purchasing/purchasing.routing.ts` a `routing/compras.routing.ts`         | —             |
| U1-07 | Mover rutas de `features/recruitment/recruitment.routing.ts` a `routing/reclutamiento.routing.ts` | —             |
| U1-08 | Mover rutas de `features/system/system.routing.ts` a `routing/configuracion.routing.ts`           | —             |
| U1-09 | Eliminar todos los `*.routing.ts` de `features/`                                                  | U1-01 a U1-08 |

### Fase 2: Renombrado a Rutas Canónicas en Español (Semana 4-5)

| Tarea | DESCRIPCIÓN                                                                             | Dependencias  |
| ----- | --------------------------------------------------------------------------------------- | ------------- |
| R2-01 | Renombrar `/purchases/*` → `/compras/*`                                                 | U1-06         |
| R2-02 | Renombrar `/warehouse/*` → `/almacen/*`                                                 | —             |
| R2-03 | Renombrar `/logbook/*` → `/bitacoras/*`                                                 | —             |
| R2-04 | Renombrar `/library/*` → `/biblioteca/*`                                                | —             |
| R2-05 | Renombrar `/inspections/*` → `/inspecciones/*`                                          | —             |
| R2-06 | Renombrar `/committee-meetings/*` → `/comites/*`                                        | —             |
| R2-07 | Renombrar `/directory/*` → `/directorio/*`                                              | —             |
| R2-08 | Renombrar `/funding/*` → `/fondeo/*`                                                    | —             |
| R2-09 | Renombrar `/delivery-reception/*` → `/entrega-recepcion/*`                              | —             |
| R2-10 | Renombrar `/report/*` → `/reportes/*`                                                   | —             |
| R2-11 | Renombrar `/diagram/*` → `/diagramas/*`                                                 | —             |
| R2-12 | Renombrar `/settings/*` → `/configuracion/*`                                            | U1-08         |
| R2-13 | Renombrar `/recurring-tasks/*` → `/tareas-recurrentes/*`                                | —             |
| R2-14 | Renombrar `/password-manager/*` → `/gestor-contrasenas/*`                               | —             |
| R2-15 | Renombrar `/announcements/*` → `/anuncios/*`                                            | —             |
| R2-16 | Renombrar `/calendars/*` → `/calendarios/*`                                             | —             |
| R2-17 | Renombrar `/recruitment/*` → `/reclutamiento/*`                                         | U1-07         |
| R2-18 | Renombrar `/employee-evaluation/*` → `/evaluacion-empleado/*`                           | —             |
| R2-19 | Mover `/committee/board-directors/*` → `/mesa-directiva/*`                              | —             |
| R2-20 | Renombrar `/maintenance/*` → `/mantenimiento/*`                                         | U1-04         |
| R2-21 | Renombrar `/operations/*` → `/operaciones/*`                                            | U1-05         |
| R2-22 | Renombrar `/inventory/*` → `/inventarios/*`                                             | —             |
| R2-23 | Renombrar `/utilities/*` → `/utilidades/*`                                              | —             |
| R2-24 | Renombrar sub-rutas de HR a español                                                     | U1-02         |
| R2-25 | Renombrar sub-rutas de contabilidad a español                                           | U1-01         |
| R2-26 | Renombrar sub-rutas de compras a español                                                | U1-06         |
| R2-27 | Renombrar sub-rutas de legal a español                                                  | U1-03         |
| R2-28 | Agregar archivo `redirects.routing.ts` con TODOS los redirects de rutas viejas a nuevas | R2-01 a R2-27 |

### Fase 3: Refinar pages.routing.ts (Semana 6)

| Tarea | DESCRIPCIÓN                                                                    | Dependencias |
| ----- | ------------------------------------------------------------------------------ | ------------ |
| R3-01 | Extraer rutas standalone (`loadComponent`) a submódulos                        | —            |
| R3-02 | pages.routing.ts debe contener solo `loadChildren`                             | R3-01        |
| R3-03 | Refactorizar rutas del módulo 8 (contabilidad) que están likeadas directamente | U1-01        |
| R3-04 | Refactorizar `reclutamiento/status-solicitud-vacante` — agregar ruta faltante  | —            |

### Fase 4: Actualizar Base de Datos (Semana 7)

| Tarea | DESCRIPCIÓN                                                 | Dependencias |
| ----- | ----------------------------------------------------------- | ------------ |
| BD-01 | Resolver duplicados de código (02.1, 02.2, 40.03)           | —            |
| BD-02 | Actualizar columna `Route` en BD con nuevas rutas canónicas | Fase 2       |
| BD-03 | Marcar `Active = false` para rutas eliminadas               | Fase 2       |
| BD-04 | Agregar rutas para módulos 18, 19, 20                       | QW-05        |
| BD-05 | Eliminar o desactivar ruta duplicada 07.2.0                 | QW-06        |

### Fase 5: Limpieza y Validación (Semana 8)

| Tarea | DESCRIPCIÓN                                                                                  | Dependencias |
| ----- | -------------------------------------------------------------------------------------------- | ------------ |
| V5-01 | Verificar que todas las rutas navegadas tengan destino                                       | Fase 2       |
| V5-02 | Verificar que todas las rutas BD tengan implementación                                       | BD-02        |
| V5-03 | Verificar que no haya más imports a `features/*.routing.ts`                                  | U1-09        |
| V5-04 | Pruebas de humo: navegar todas las rutas canónicas                                           | Fase 2       |
| V5-05 | Pruebas de humo: verificar redirects de rutas viejas                                         | R2-28        |
| V5-06 | Actualizar inventarios (`refactor-inventaio-rutas.md`, `refactor-inventaio-rutas-router.md`) | Todo         |
| V5-07 | Actualizar AGENTS.md con nueva estructura                                                    | Todo         |

---

## 6. Migración Paso a Paso

### 6.1 Cómo Migrar un Módulo (Ejemplo: Compras)

```
Paso 1: Unificar routing
  - Mover rutas de features/purchasing/purchasing.routing.ts a routing/compras.routing.ts
  - Consolidar con routing/compras.routing.ts existente
  - pages.routing.ts: apuntar /compras → routing/compras.routing.ts

Paso 2: Renombrar paths
  - /purchases/purchase-requests → /compras/solicitudes
  - /purchases/purchase-orders → /compras/ordenes-compra
  - /purchases/products-services → /compras/productos-servicios
  - etc.

Paso 3: Actualizar navegaciones
  - Buscar todas las referencias a /purchases/ en:
    - router.navigate() → cambiar a /compras/
    - routerLink en HTML → cambiar a /compras/
    - sidebar.ts, settings-menu.ts → cambiar routerLink
  - Estimar: ~50 ocurrencias

Paso 4: Agregar redirect
  - En redirects.routing.ts:
    { path: 'purchases/**', redirectTo: 'compras/**', pathMatch: 'prefix' }

Paso 5: Actualizar BD
  - Columna Route: /purchases/* → /compras/*

Paso 6: Validar
  - ng build
  - Probar rutas viejas (deben redirect)
  - Probar rutas nuevas (deben funcionar)
```

### 6.2 Cómo Implementar un Módulo Nuevo (Ejemplo: Reservaciones)

```
Paso 1: Crear estructura
  - features/reservaciones/
  - ReservacionesComponent (placeholder)
  - ReservacionesListComponent
  - reservaciones.routing.ts en routing/

Paso 2: Registrar en pages.routing.ts
  - { path: 'reservaciones', loadChildren: () => import('./reservaciones.routing') }

Paso 3: Actualizar BD
  - Código 18: Route = '/reservaciones'

Paso 4: Agregar al sidebar si aplica
  - sidebar.ts: agregar entry con routerLink: '/reservaciones'
```

### 6.3 Estrategia de Redirects

Todas las rutas viejas deben tener un redirect a la nueva ruta canónica para evitar 404s:

```typescript
// routing/redirects.routing.ts
export const redirectRoutes: Routes = [
  // Compras
  { path: "purchases/purchase-requests", redirectTo: "/compras/solicitudes" },
  { path: "purchases/purchase-orders", redirectTo: "/compras/ordenes-compra" },
  // ... ~138 redirects
];
```

Estos redirects deben ser **temporales** (302) durante la migración y eliminarse después de 2 ciclos de release.

### 6.4 Validación de Consistencia

Después de cada fase, ejecutar:

```
1. ng build → 0 errores
2. Comparar rutas en routing/ vs rutas en BD → 100% match
3. Comparar rutas navegadas en código vs rutas definidas → 0 huérfanas
4. Verificar que ningún features/*.routing.ts tenga rutas
5. Verificar que pages.routing.ts solo tenga loadChildren
```

---

## Apéndice A: Correspondencia Swagger → Módulo Frontend

| Tag Swagger                  | Endpoints | Módulo Frontend        | Prioridad Migración |
| ---------------------------- | --------- | ---------------------- | ------------------- |
| `ApplicationUser`            | 25        | Configuración          | Alta                |
| `Task`                       | 30        | Tickets                | Alta                |
| `Incident`                   | 24        | Recursos Humanos       | Alta                |
| `Funding`                    | 23        | Fondeo                 | Alta                |
| `SolicitudCompra`            | 22        | Compras                | Alta                |
| `OrdenCompra`                | 22        | Compras                | Alta                |
| `ManualPasos`                | 21        | Biblioteca             | Alta                |
| `Machineries`                | 17        | Mantenimiento          | Alta                |
| `ServiceOrders`              | 18        | Tickets/Bitácoras      | Alta                |
| `ContabilidadOnline`         | 18        | Contabilidad           | Alta                |
| `EmployeeInternal`           | 14        | Directorio             | Media               |
| `Providers`                  | 13        | Compras/Directorio     | Media               |
| `MaintenanceReport`          | 13        | Reportes               | Media               |
| `Meetings`                   | 13        | Juntas y Comités       | Media               |
| `FinancialReport`            | 12        | Contabilidad           | Media               |
| `DynamicReport`              | 12        | Reportes               | Media               |
| `EmployeeFile`               | 12        | Recursos Humanos       | Media               |
| `TaskTemplates`              | 12        | Tareas Recurrentes     | Media               |
| `FireInspectionPeriodItems`  | 12        | Equipo Contra Incendio | Media               |
| `CotizacionProveedor`        | 11        | Compras                | Media               |
| `MaintenanceCalendars`       | 11        | Mantenimiento          | Media               |
| `MedidorLectura`             | 11        | Bitácoras              | Media               |
| `MeetingDertailsSeguimiento` | 11        | Juntas y Comités       | Media               |
| `WorkPosition`               | 11        | Reclutamiento          | Media               |
| `Announcements`              | 10        | Anuncios               | Baja                |
| `Notifications`              | 10        | Core                   | Baja                |
| `IncidentReport`             | 3         | Recursos Humanos       | Baja                |
| `BoardDirectors`             | 6         | Mesa Directiva         | Baja                |
| `DiagramDraw`                | 5         | Diagramas              | Baja                |
| `Passwords`                  | 5         | Gestor Contraseñas     | Baja                |
| `AiChat` / `AiAssistant`     | 6         | Asistente AI           | Baja                |

---

## Apéndice B: Resumen de Esfuerzo

| Fase                           | Tareas | Esfuerzo Estimado | Riesgo         |
| ------------------------------ | ------ | ----------------- | -------------- |
| Fase 0 — Quick Wins            | 6      | 2-3 días          | Bajo           |
| Fase 1 — Unificación           | 9      | 5-7 días          | Medio          |
| Fase 2 — Renombrado            | 28     | 8-10 días         | Alto           |
| Fase 3 — Refinar pages.routing | 4      | 2-3 días          | Medio          |
| Fase 4 — Actualizar BD         | 5      | 2-3 días          | Medio          |
| Fase 5 — Limpieza y Validación | 7      | 3-4 días          | Bajo           |
| **Total**                      | **59** | **22-30 días**    | **Medio-Alto** |

### Componentes/Rutas a Renombrar por Fase 2 (estimado)

| Tipo de Cambio                                   | Cantidad Estimada                 |
| ------------------------------------------------ | --------------------------------- |
| Archivos .routing.ts a modificar                 | ~33                               |
| Rutas a renombrar en .ts                         | ~168 (navegaciones programáticas) |
| Templates HTML con routerLink a modificar        | ~77                               |
| Archivos de menú (sidebar, settings) a modificar | ~105 items de menu                |
| Redirects a crear                                | ~138                              |
| Cambios en BD (columna Route)                    | ~115                              |
| **Total puntos de cambio**                       | **~636**                          |
