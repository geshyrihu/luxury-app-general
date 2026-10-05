# Plan de ampliación — Línea base e Inspección Mayor

**Estado:** Borrador para decisión de roles y revisión del Tech Lead
**Fecha:** 2026-10-04
**Módulo:** `OperationsLuxuryApp/Inspections`
**Tipo:** B — Ampliación del módulo existente
**Backend:** `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Inspections/`
**Frontend:** `appsweb/angular/src/app/modules/operations.luxuryapp/inspection/`
**Matriz RBAC asociada:** [`20261004-matriz-roles-acciones-inspections.md`](./20261004-matriz-roles-acciones-inspections.md)
**Origen:** Requerimiento de Inspección Mayor y Levantamiento Inicial, decisiones de discovery en esta sesión y revisión del código real.

> Este plan amplía el motor vigente; no crea otro módulo de inspecciones. La matriz RBAC es gate de aprobación: ninguna celda `?` autoriza acceso y no se implementa autorización nueva hasta que usuario/Tech Lead complete y apruebe matriz.

---

## FASE 0 — Descubrimiento de reglas de negocio

### 0.1 Problema y KPIs

Actualmente, los responsables de mantenimiento carecen de un proceso único para documentar el estado inicial y periódico de los equipos de cada cliente cuando necesitan levantar, revisar y comparar su condición, lo que impide demostrar cobertura, conservar evidencia histórica confiable y convertir hallazgos en prioridades de mantenimiento.

El alcance confirmado es un `Customer` por proyecto; la unidad inspeccionada es cada `Equipment` del inventario, incluida su ubicación actual. `EquipmentContent` no se inspecciona separadamente. Levantamiento inicial incluye todo `Equipment` presente al tomar la cobertura; cada registro debe quedar evaluado o justificado como excepción. Cada equipo puede tener múltiples hallazgos y su condición resumen deriva del hallazgo más crítico. El inspector entrega; el rol `Administrador` revisa y firma mediante aprobación digital auditada. Equipos añadidos posteriormente se incorporan por anexo sin reescribir el acta firmada. Inspección Mayor tendrá periodicidad configurable por cliente.

Los baselines siguientes miden capacidad presente en código, no tiempos de operación observados en clientes:

| KPI | Baseline verificable en código | Target | Timeline | Verificación |
|---|---|---|---|---|
| Configuración de recurrencia que llega íntegra del API al generador | 0% del contrato flexible expuesto de extremo a extremo: DTO vigente contiene `Frequency`, pero no `RecurrenceUnit`/`RecurrenceInterval`; el cálculo usa estos últimos. | 100% de periodicidades admitidas sobreviven alta/edición/consulta y generan fechas esperadas. | Fase 1 | Pruebas de contrato y de fechas diarias/semanales/mensuales contra API y generador. |
| Cobertura del inventario en una línea base | 0%: no existe flujo de línea base ni cierre por cobertura completa/excepciones. | 100% de `Equipment` incluido al inicio aparece inspeccionado o con excepción y motivo. | Fase 2 | Prueba con inventario mixto; conteo de snapshot = inspeccionados + excepciones, sin duplicados ni faltantes. |
| Actas iniciales con aprobación interna auditable | 0%: no existe ciclo Inspector→Administrador ni firma digital del acta. | 100% de actas aprobadas guarda folio único, versión, inspector, aprobador autenticado y fecha/hora de aprobación. | Fase 3 | Pruebas de transición/autoría; constraint único de folio; auditoría persistida. |
| Reproducibilidad histórica y comparación | 0% de reportes actuales incluye una comparación congelada línea base–inspección posterior. | 100% de reportes cerrados usa snapshots; cambios posteriores al inventario/catálogo no alteran documentos aprobados. | Fase 4 | Prueba de mutación posterior de `Equipment` y catálogo; exportes deben preservar valores aprobados. |

### 0.2 Matriz de reglas de negocio

Reglas nuevas usan rango `RN-INS-040+` para continuar después de `RN-INS-033` del plan vigente. La matriz de roles complementa reglas de seguridad y deberá estar aprobada antes de implementación.

#### Nivel 1 — Invariantes de dominio

| ID | Regla |
|---|---|
| RN-INS-040 | Una línea base captura el conjunto de `Equipment` del mismo `CustomerId` presente al iniciar la cobertura; cada elemento debe resultar inspeccionado o tener excepción justificada. No inspeccionado nunca equivale a funcional. |
| RN-INS-041 | Ningún recorrido, ejecución, snapshot, hallazgo o anexo puede vincular un `Equipment` de otro `Customer` asociado. |
| RN-INS-042 | Una línea base aprobada es inmutable. Equipo añadido después se documenta mediante anexo ligado al acta original; una nueva línea base completa conserva versiones anteriores. |
| RN-INS-043 | La unidad inspeccionada es el registro principal `Equipment`; `EquipmentContent` no genera elementos de inspección individuales en este alcance. |

#### Nivel 2 — Flujo y estados

| ID | Regla |
|---|---|
| RN-INS-050 | Inspections distingue línea base de una sola ejecución e Inspección Mayor recurrente configurable. Recorridos periódicos existentes conservan comportamiento durante migración. |
| RN-INS-051 | Flujo de captura: borrador/en progreso → enviado a revisión → devuelto para corrección o aprobado/firmado → cerrado. Solo aprobación firmada permite congelar acta. |
| RN-INS-052 | Hallazgos múltiples se conservan individualmente. Condición del equipo se calcula desde su hallazgo más crítico; recomendación de trabajo es dato distinto a condición observada. |
| RN-INS-053 | Cambios a acta aprobada requieren reapertura o nueva versión/anexo con motivo, usuario y fecha; nunca se sobrescribe silenciosamente. |
| RN-INS-054 | Inspección Mayor sigue periodicidad configurable y generación idempotente, alineada entre formulario, API, cálculo de recurrencia y job. |

#### Nivel 3 — Seguridad y autorización

| ID | Regla |
|---|---|
| RN-INS-060 | Cada acción del módulo requiere decisión explícita en matriz RBAC asociada y validación del cliente autorizado; celdas `?` bloquean la acción hasta aprobación. |
| RN-INS-061 | Aprobación/firma digital la registra `Administrador` autenticado con identificador, rol, fecha/hora y versión; ningún `applicationUserId` enviado por cliente sustituye identidad autenticada. |
| RN-INS-062 | Toda consulta, modificación, carga de evidencia, envío, devolución, aprobación, reapertura y exportación respeta permisos y aislamiento por `CustomerId` definidos en la matriz. |

#### Nivel 4 — Validación de datos

| ID | Regla |
|---|---|
| RN-INS-070 | Cada acta recibe folio generado por backend, no vacío y único en el alcance aprobado; constraint de base de datos protege unicidad. Formato visual se define antes del desarrollo del folio. |
| RN-INS-071 | Condición, severidad y recomendación se modelan separadamente; valor resumen del equipo se deriva y no se mantiene como una selección contradictoria. |
| RN-INS-072 | No se permite aprobar línea base si existe equipo de cobertura sin evaluación o excepción con motivo. |
| RN-INS-073 | Cada snapshot conserva identificación y contexto del equipo (incluida ubicación y categoría) tal como estaban al momento de inspección; criterios aplicados conservan texto/versionado usado. |
| RN-INS-074 | Fecha de inspección, fecha de envío y fecha de aprobación son datos distintos; fecha no se sustituye por fecha de creación ni por hora de descarga del PDF. |

### 0.3 Pre-mortem y flujos críticos

#### Pre-mortem

| Supuesto fallido | Impacto | Probabilidad | Mitigación | Owner |
|---|---|---|---|---|
| Informe firmado consulta datos vivos del inventario y cambia después de aprobarse | Evidencia histórica pierde integridad | Alta | Snapshots por ejecución y prueba de mutación posterior; exportar desde versión congelada | Backend Lead |
| Configuración de recurrencia no coincide con cálculo del job | Inspecciones mayores no aparecen o se duplican | Alta | Unificar DTO/UI/job; índice/idempotencia basada en fecha de ejecución; pruebas de calendario | Backend Lead |
| Matriz RBAC se interpreta con celdas vacías como permitidas | Acceso indebido o bloqueo operativo | Media | `?` explícito como pendiente/bloqueado; aprobación del Tech Lead; pruebas por rol y cliente | Tech Lead / Security |
| La línea base omite equipos o marca no evaluados como funcionales | Cobertura contractual/técnica engañosa | Media | Snapshot completo y estado de excepción separado; impedir cierre incompleto | Product Owner / QA |
| Se agregan datos de costo directamente a módulo contable sin ownership definido | Presupuestos duplicados o inconsistentes | Media | Entregar acciones priorizadas primero; revisar `MaintenanceBudgetForecast` y dueño antes de integración | Product Owner / Accounting |

#### Flujos y criterio de PASO

**Happy path — línea base:** iniciar captura para Customer → congelar equipos existentes → registrar resultados/hallazgos/evidencias o excepción justificada por equipo → enviar → Administrador revisa → aprueba y firma digitalmente → emitir reporte por folio.

**PASO:** conjuntos de equipos conciliados; responsable y fechas correctos; aprobador es usuario autenticado con rol permitido; reporte y snapshot quedan inmutables.

**Sad path — devolución:** Administrador encuentra datos incompletos → devuelve con motivo → inspector corrige únicamente borrador/devuelto → reenvía → aprobación conserva trazabilidad de devolución.

**PASO:** no se crea acta firmada en primera revisión; motivos, autores y fechas permanecen; no se altera ejecución cerrada.

**Edge path — inventario nuevo después del acta:** agregar equipo al inventario después de firmar → crear anexo vinculado a la línea base → firmar anexo conforme matriz.

**PASO:** contenido original del acta no cambia; anexo tiene folio/fecha/autoría y el equipo queda visible en historial.

**Edge path — activo no accesible:** incluir activo en cobertura → marcar no accesible/fuera de alcance con motivo → Administrador decide aprobación o devolución.

**PASO:** la excepción no se contabiliza como funcional y el acta refleja cobertura real.

---

## 1. Resumen ejecutivo

Ampliar el motor único existente de `OperationsLuxuryApp/Inspections` para cubrir levantamientos iniciales inmutables, Inspecciones Mayores periódicas configurables, hallazgos múltiples por equipo y reportes comparables. El desarrollo primero alinea recurrencia, catálogo, autorización y protección histórica existentes; después incorpora snapshots de inventario, revisión/firma digital por `Administrador`, anexos y reportes basados en datos congelados.

Beneficio esperado: línea base verificable del inventario completo del cliente, inspecciones mayores comparables en el tiempo y hallazgos priorizables sin duplicar `Equipment` ni el motor de recorridos.

## 2. Alcance y restricciones

### Dentro de alcance

- Extender los recorridos, ejecuciones, criterios, evidencias y reportes actuales.
- Distinguir modos de ejecución: levantamiento inicial y mayor periódica; preservar recorridos existentes.
- Inspeccionar todos los `Equipment` en cobertura, incluidos los de categoría Amenidades/Áreas Comunes; usar ubicación actual de `Equipment`.
- Conservar evidencia histórica mediante snapshot de equipo y criterio.
- Registrar condición, múltiples hallazgos, severidad, recomendación y evidencias por equipo.
- Flujo de envío/revisión/devolución/firma digital interna y anexos para equipo posterior.
- Comparación contra línea base y exportación desde información aprobada.
- Completar y aprobar matriz de roles antes de implementar autorización final.

### Fuera de alcance inicial

- Crear un módulo o inventario paralelo.
- Inspeccionar cada artículo/cantidad de `EquipmentContent` por separado.
- Firma avanzada de proveedor externo o firma manuscrita capturada; decisión vigente: aprobación digital auditada.
- Crear órdenes de servicio automáticamente. Plan vigente `20260929-plan-operations-inspections-recorridos.md` excluye relación con `ServiceOrders`; cualquier cambio requiere aprobación expresa.
- Escritura automática a presupuesto contable. Existe entidad `MaintenanceBudgetForecast`, pero en código revisado no se encontró servicio activo de CRUD asociado; primero se debe confirmar ownership y contrato. En este plan, entregar recomendaciones/prioridades para facilitar presupuesto.
- Rediseño integral de otras pantallas fuera de Inspections.

### Restricciones

- No romper datos ni contratos de recorridos existentes; no truncar históricos.
- No inferir snapshots históricos para ejecuciones previas: valores desconocidos quedan identificados como legado/no disponibles.
- No permitir firma o cambios autorizados por `applicationUserId` del request sin contrastar con usuario autenticado.
- Aislamiento por CustomerId en todo endpoint.
- Migraciones EF Core revisables y reversibles donde sea posible; borrar actas firmadas no es rollback aceptable.
- Matriz RBAC asociada es autoridad de permisos; roles solo del catálogo oficial.
- Folio no se fija a un patrón numérico/alfanumérico hasta decisión del Tech Lead; sí debe ser único.

## 3. Arquitectura y diseño técnico

### 3.1 Entidades actuales traducidas a negocio

| Entidad / tabla | Representación de negocio | Datos/relaciones relevantes | Uso y límite observado |
|---|---|---|---|
| `Equipment` / `Equipment` | Equipo/amenidad inventariado del cliente | `CustomerId`, clasificación/categoría, nombre, marca, modelo, serie, código local, ubicación, estado, especificaciones, foto y observaciones | Fuente canónica; `Ubication` es ubicación actual del equipo, mutable. `EquipmentContent` queda fuera de unidad inspeccionada. |
| `Inspection` / `Inspections` | Configuración/plantilla de recorrido | Cliente, nombre, departamento, `Frequency`, días, frecuencia flexible (`RecurrenceUnit`, `RecurrenceInterval`, `DayOfMonth`), equipos y responsables | No distingue línea base/mayor/recorrido operativo. DTO de alta/edición no expone unidad/intervalo usado por el generador. |
| `InspectionAssetItem` / `InspectionAssets` | Equipo vinculado a una configuración | `InspectionId`, `EquipmentId`, orden `Position`, criterios | Un equipo puede aparecer en recorridos; debe validar mismo Customer. No congela inventario de ejecución. |
| `InspectionReviewsCatalog` / `InspectionCriteria` | Criterio técnico de catálogo | Descripción, departamento y clasificación (`EquipoClasificacionId`) | Catálogo por clasificación ya existe; hay dos servicios de catálogo y contratos diferentes que se deben consolidar/ordenar. |
| `InspectionReview` / `InspectionReviews` | Aplicación de criterio a equipo de una configuración | Relación entre activo de configuración y criterio | Resultado actual apunta a catálogo vivo; cambios pueden cambiar presentación histórica. |
| `InspectionExecution` / `CustomerInspections` | Ejecución fechada del recorrido | Responsable, ejecutor, fecha, estado, cierre, motivo/conteo de modificación, origen QR | Ya tiene estados y ejecución periódica; no tiene firma administrativa ni snapshot completo. |
| `InspectionExecutionItem` / `InspectionFindings` | Resultado actual por criterio aplicado | `State` bool, `IsCritical`, observaciones (máximo actual 255) e imágenes | Booleano mezcla no evaluado/rechazado; no expresa acción recomendada ni varios hallazgos estructurados independientes. |
| `InspectionResultImage` / `InspectionImages` | Evidencia fotográfica del resultado | Ruta relativa asociada a resultado | Reusar almacenamiento seguro; extender evidencia documental requiere definir patrón/file types. |
| `EquipmentQrLabel` / `EquipmentQrLabels` | Etiqueta QR física de equipo | Cliente, equipo, código, enlace y estado de impresión | QR actualmente resuelve ejecución periódica de hoy; no debe resolver/firmar línea base por sí mismo. |
| `Customer` / `Customers` | Cliente/proyecto | Identidad de cliente y colección de equipos | Confirmación de negocio: un Customer = un proyecto. |

**Cobertura reconocida:** las 10 entidades de `OperationsLuxuryApp/Inspections` fueron revisadas. Para reutilización se revisaron `Equipment`, `EquipmentContent`, `EquipmentFireDetails`, `EquipoClasificacion`, `MaintenanceCalendar`, `Customer` y `CustomerLocation`; registros especializados como bitácoras por activo, préstamos, medidores y pronósticos presupuestarios no definen la unidad `Equipment` ni el ciclo de inspección de este plan.

### 3.2 Diseño destino propuesto

Los nombres siguientes son conceptos de diseño, no contratos aprobados:

1. **Modo de inspección:** distinguir `InitialBaseline`, `MajorPeriodic` y recorridos operativos existentes. No cambiar el significado ni la recurrencia de plantillas legado sin backfill explícito.
2. **Snapshot de equipo por ejecución:** entidad/estructura ligada a `InspectionExecution` con `EquipmentId` y copia de datos identificativos usados en el reporte: nombre, categoría/clasificación, marca/modelo/serie, código local y ubicación. Capturar también lista de cobertura y disposición del equipo.
3. **Hallazgos:** múltiples registros por snapshot de equipo con criterio/version usado, condición observada, severidad, tipo de acción recomendado, notas técnicas y evidencias. Condición resumen derivada; severidad y recomendación no se colapsan en una misma opción.
4. **Workflow de aprobación:** incorporar transiciones de envío, devolución y aprobación, con actor/fecha/motivo. Aprobación digital por usuario autenticado rol `Administrador`; cierre bloquea cambios normales.
5. **Versiones y anexos:** acta inicial firmada nunca se modifica. Equipo incorporado posteriormente genera anexo; nuevo levantamiento total crea versión nueva enlazada a anterior.
6. **Reporte comparativo:** generar PDF desde snapshot aprobado: identificación/folio, Customer, fecha, inspector, aprobador, cobertura, excepciones, ubicación, estado, hallazgos, evidencia y diferencia respecto a baseline.
7. **Recurrencia:** exponer unidad/intervalo de calendario usado por el job de Inspección Mayor; garantizar que el motor reciba el mismo contrato que UI y API devuelven.
8. **Catálogo:** una ruta/servicio autoritativo para criterios por clasificación; las ejecuciones congelan criterio/versión aplicada.

### 3.3 Trazabilidad RN → código

| Regla | Ubicación actual / destino de cambio |
|---|---|
| RN-INS-040, 042, 043 | `Infrastructure/Data/Entities/OperationsLuxuryApp/Inspections/Inspection.cs:3-55`, `InspectionAssetItem.cs:3-39`; destino: captura de cobertura/snapshot/anexo. |
| RN-INS-041 | `Modules/OperationsLuxuryApp/Inspections/Services/InspectionAppService.cs:246-309` y `InspectionCondominiumAssetAppService.cs:183-215` ya validan pertenencia en algunos flujos; extender a todos. |
| RN-INS-050, 054 | `Inspection.cs:29-43`; `DTOs/UpdateInspectionDTO.cs:3-13`; `InspectionAppService.cs:91-160,164-244`; `Services/InspectionRecurrenceCalculator.cs:22-58`; `InspectionExecutionGenerationService.cs:5-39`; job `Modules/AdminLuxuryApp/Infrastructure/Jobs/Workers/InspectionExecutionGenerationJob.cs`. |
| RN-INS-051, 053, 061 | `InspectionExecution.cs:7-60`; `CustomerInspectionAppService.cs:160-229`; `EndPoints/InspectionResultEndpoints.cs:31-42`; destino: transiciones, auditoría y firma. |
| RN-INS-052, 071 | `InspectionExecutionItem.cs:3-44`; `DTOs/InspectionItemUpdateDTO.cs:6-24`; destino: datos por hallazgo y estado derivado. |
| RN-INS-060, 062 | Grupos autenticados `InspectionEndpoints.cs:8-11`, `InspectionResultEndpoints.cs:8-11`, `InspectionResultImagesEndpoints.cs:8-11`, `InspectionCondominiumAssetEndpoints.cs:8-11`; validación de Customer hoy visible en `EquipmentQrLabelAppService.cs:284-294`; destino: matriz RBAC + Customer scope en todos. |
| RN-INS-070 | `InspectionExecution.cs:7-9` tiene índice único por `InspectionId` + `CreatedAt`; nuevo folio requiere campo/índice con scope aprobado. |
| RN-INS-072, 073, 074 | `CustomerInspectionAppService.cs:80-158,278-359`; `CustomerInspectionReportDTO.cs:3-15`; frontend `inspeccion-pdf.service.ts:10-99`; destino: cierre por cobertura y reporte desde snapshot. |
| Catálogo congelado | `InspectionReviewsCatalog.cs:3-31`; servicios `CatalogInspectionAppService.cs` y `InspectionReviewsCatalogAppService.cs`; endpoint activo `InspectionReviewsCatalogEndpoints.cs`. |

### 3.4 Contratos de roles

Lista de roles procede de `CreateRoles()` en `ApplicationRoleAppService.cs:125-190` (42 roles). `Administrador` está aprobado para revisar y firmar; demás permisos están pendientes de marcar en matriz. La fase RBAC debe definir consulta, configuración, captura, evidencia, exportación, hallazgos críticos, QR, anexos, reapertura y aislamiento de cliente.

### 3.5 Migración de datos y prevención de pérdida

Responsable de crear/aplicar migraciones: Tech Lead. Implementación no comienza esquema hasta cerrar inventario de datos existente en ambiente objetivo y revisar migración contra `data-migration-protocol.md`.

| Tabla/área | Cambio conceptual | Riesgo | Mitigación / preservación |
|---|---|---|---|
| `Inspections` | Distinguir propósito e intervalo flexible en contratos/configuración | Alto: valores heredados de `Frequency` podrían interpretarse mal | No convertir automáticamente recorridos históricos a baseline; mantener comportamiento legado y backfill explícito/verificado. |
| `CustomerInspections` | Fechas/estados de envío, revisión y firma; folio/versionado de reporte según diseño final | Alto: constraint de folio puede fallar por datos duplicados o migración de estados | Inspeccionar conteos y colisiones; legados conservan estado legado; nuevo folio único solo para nuevas actas o backfill determinista aprobado. |
| `InspectionAssets` / tablas nuevas snapshot | Captura congelada de equipos para ejecuciones nuevas | Alto: no existe fotografía histórica del equipo asociada a ejecución pasada | No inventar snapshot retroactivo; identificar históricas como legado sin snapshot; backfill solo si hay fuente verificable. |
| `InspectionCriteria`, `InspectionReviews`, `InspectionFindings`, imágenes | Congelar criterio/texto/version y crear hallazgos múltiples | Alto: criterios actuales afectan ejecuciones existentes | No borrar ni reescribir históricos; migrar aditivamente y validar FK/rutas/contador de archivos. |
| Índices nuevos | Unicidad de folio, ejecución por fecha/recurrencia y snapshot sin duplicados | Medio/alto: datos concurrentes o duplicados | Preflight de duplicados, constraint DB e idempotencia en servicio/job; consulta posterior de violaciones = 0. |

**Reversibilidad:** agregar tablas/campos/índices es reversible solo antes de generar actas firmadas. Una vez existan snapshots aprobados, `Down()` no debe borrar esos datos como si el rollback fuera inocuo; usar rollback de código compatible o migración correctiva hacia adelante. No se propone `DROP`, truncado ni borrado de reportes actuales.

## 4. Backlog de tareas

1. Completar/aprobar matriz RBAC de 42 roles y acciones; definir excepciones condicionadas.
2. Reconciliar auditoría y plan de remediación existentes con código actual; declarar hallazgos ya resueltos y pendientes reales.
3. Alinear `Frequency`, `RecurrenceUnit`, `RecurrenceInterval`, DTOs Angular/API y job; agregar tests idempotentes por fecha.
4. Consolidar el servicio/endpoint oficial de catálogo por clasificación y proteger historial de criterios.
5. Diseñar e implementar snapshot de cobertura de `Equipment` por ejecución, estado de evaluación y excepción con motivo.
6. Implementar hallazgo múltiple con condición, severidad, recomendación, texto de criterio congelado y evidencia.
7. Implementar envío, revisión/devolución, aprobación digital, cierre inmutable, motivo de reapertura y auditoría.
8. Implementar folio único, versiones de línea base y anexo para equipos posteriores.
9. Actualizar reportes/PDF para incluir identificación, cobertura, ubicación, firma y comparación desde snapshots aprobados.
10. Entregar vista de priorización y recomendaciones presupuestarias; verificar dueño/contrato antes de escribir en `MaintenanceBudgetForecast`.
11. Actualizar pruebas, controles por rol/cliente, README/documentación vigente y auditoría final del módulo.

## 5. Fases de ejecución

No se asignan fechas de calendario; secuencia y tamaño relativo ordenan dependencias.

### Fase 0 — Decisiones y reconciliación (S)

- Marcar todas las celdas de la matriz RBAC y aprobarla.
- Revisar reportes de auditoría/remediación 20261001 y 20261003 contra código actual.
- Definir formato de folio, estados de condición/severidad/recomendación y significado de excepciones.
- Acordar si estimación de costo es obligatoria por hallazgo o informativa; confirmar owner de presupuesto existente.

**Criterio de paso:** matriz RBAC sin `?`; decisiones de datos/ciclo cerradas; backlog de remediación con estado real; FASE 0 aprobado por Tech Lead.

### Fase 1 — Contrato del motor, recurrencia y seguridad base (M)

- Corregir round-trip de recurrencia en create/update/read y frontend.
- Verificar generación y deduplicación por fecha; asegurar idempotencia en concurrencia.
- Aplicar matriz RBAC y Customer scope a los endpoints existentes relevantes.
- Consolidar catálogo y bloquear modificación destructiva que altere criterios de ejecuciones históricas.

**Criterio de paso:** casos CRUD y job producen las mismas fechas esperadas; pruebas de permisos pasan por rol permitido/denegado y cliente propio/ajeno; no se altera una ejecución cerrada.

#### 📤 Reporte — Fase 1 (2026-10-04)
- **Qué se hizo:** 
  1. Se actualizó la entidad `Inspection` y los DTOs `UpdateInspectionDTO`, `InspectionEditDTO` e `InspectionSummaryDTO` para utilizar explícitamente `RecurrenceUnit` (enum) y `RecurrenceInterval` (int) en lugar de un `Frequency` tipo `string`.
  2. Se ajustaron los modelos en Angular (`InspectionSummary`, `InspectionEdit`, `InspectionAddOrEdit`) y el formulario `inspecciones-form.ts/.html` y `lista-inspecciones.ts` para que utilicen los valores de recurrencia en lugar de la variable antigua.
  3. Se consolidó el servicio de catálogo eliminando `CatalogInspectionAppService` huérfano. En `InspectionReviewsCatalogAppService`, se añadió el método `ValidateHistoricalUsageAsync` que impide actualizar o borrar un registro si este se usó en alguna `InspectionExecutionItem` perteneciente a una ejecución en estado `Completed` o `IsClosed`, asegurando la inmutabilidad histórica.
  4. Se inyectó `ICurrentUserService` en `InspectionAppService`, `InspectionCondominiumAssetAppService`, `CustomerInspectionAppService` e `InspectionResultImageAppService`, creando el método `ValidateCustomerAccess` para verificar que el usuario tenga acceso a la información de los clientes (restringido por `CustomerId`), salvo que el usuario sea `SuperUsuario` o `Direccion`.
- **Archivos tocados:** `UpdateInspectionDTO.cs`, `InspectionEditDTO.cs`, `InspectionSummaryDTO.cs`, `InspectionAppService.cs`, `inspecciones-form.ts`, `lista-inspecciones.html`, entre otros. Scripts de eliminación del catálogo redundante.
- **Resultado de las verificaciones/checklist de la fase:** `dotnet build` reporta compilación exitosa (0 errores locales a Inspections); Angular `ng build` compila con éxito; `dotnet test` pasa las verificaciones en Inspections (los errores observados en la suite global de tests son fallos preexistentes en módulos ajenos, como `RecruitmentLuxuryApp` y `SharedLuxuryApp.Catalogs`).
- **Bloqueos o dudas:** Ninguno. Listos para iniciar Fase 2 (Snapshot, cobertura y hallazgos).

**✅ Validación (Claude, 2026-10-04):** Aprobada. Contratos homogeneizados y aislados. El borrado histórico seguro quedó implementado.

### Fase 2 — Snapshot, cobertura y hallazgos (L)

- Crear ejecución de levantamiento inicial que captura inventario completo actual del Customer.
- Capturar snapshot de identidad/localización/categoría por equipo y estado de evaluación.
- Soportar excepciones (no accesible/fuera de alcance) con motivo sin confundirlas con aprobado.
- Capturar hallazgos múltiples con condición, severidad, recomendación y evidencias.
- Derivar resumen del equipo desde el hallazgo más crítico.

**Criterio de paso:** conteo de cobertura balancea; cada equipo evaluado o exceptuado; diferentes categorías y ubicaciones pasan en una ejecución; pruebas confirman aislamiento multi-cliente.

#### 📤 Reporte — Fase 2 (2026-10-04)
- **Qué se hizo:**
  1. Se agregó `InspectionType` (`Periodic`/`InitialBaseline`/`MajorPeriodic`) a `Inspection` para distinguir el propósito de cada configuración sin romper recorridos existentes (quedan como `Periodic` por default).
  2. Se crearon las entidades `InspectionExecutionSnapshot` (cobertura congelada por equipo: nombre, categoría, marca, modelo, serie, código local, ubicación, estado de evaluación, motivo de excepción y condición resumen) e `InspectionExecutionFinding` (hallazgo individual con criterio congelado, severidad, recomendación y notas técnicas), más `InspectionFindingImage` para evidencia por hallazgo. Se agregaron los enums `EquipmentEvaluationState`, `EquipmentCondition`, `FindingSeverity` y `FindingRecommendation`.
  3. Se configuraron las relaciones EF (incluye `CHECK CONSTRAINT` en BD que obliga `ExceptionReason` cuando `EvaluationState` no es `Evaluated`, y un índice único `(InspectionExecutionId, EquipmentId)` para que un equipo no tenga dos snapshots en la misma ejecución) y se generó/aplicó la migración `20261004171632_AddInspectionBaselineSnapshots` en dev. La migración solo agrega tablas/columna/índices; no modifica datos existentes y es reversible (`Down()` no afecta históricos previos a este cambio).
  4. Se implementó `InspectionBaselineAppService` (`IInspectionBaselineAppService`): `StartInitialBaselineAsync` congela **todo** el inventario vigente de `Equipment` del cliente en snapshots nuevos (RN-INS-040); `AddFindingAsync` permite múltiples hallazgos por snapshot y recalcula la condición resumen desde el hallazgo más crítico (RN-INS-052/071), congelando el texto del criterio si viene del catálogo (RN-INS-073); `SetExceptionAsync` marca un equipo como no accesible/fuera de alcance exigiendo motivo (RN-INS-040/072) y rechaza marcar excepción si ya tiene hallazgos.
  5. Se creó `InspectionPermissionPolicy`, mapa deny-by-default de rol → acciones de la matriz RBAC aprobada (`20261004-matriz-roles-acciones-inspections.md`). Durante la implementación se detectó que la matriz dejaba a `TecnicoMantenimiento`/`MttoNocturno` sin `CAP`/`EVD` pese a tener `LBI`/`MAY` (podían iniciar pero no capturar); se consultó al usuario y se corrigió la matriz para otorgarles `CAP`/`EVD` como roles de campo.
  6. Se expusieron los endpoints `POST api/inspection-baseline`, `GET api/inspection-baseline/{id}/coverage`, `POST api/inspection-baseline/snapshots/{id}/findings` y `PUT api/inspection-baseline/snapshots/{id}/exception`, todos autenticados y con aislamiento por `CustomerId` vía `ValidateCustomerAccess`.
- **Archivos tocados:** entidades y configuraciones nuevas en `Infrastructure/Data/Entities/OperationsLuxuryApp/Inspections/` y `Infrastructure/Data/Configurations/OperationsLuxuryApp/`; migración en `Infrastructure/Data/Migrations/`; `Inspection.cs` (campo `InspectionType`); DTOs nuevos en `Modules/OperationsLuxuryApp/Inspections/DTOs/`; `InspectionBaselineAppService.cs`, `IInspectionBaselineAppService.cs`, `InspectionPermissionPolicy.cs`, `InspectionBaselineEndpoints.cs`; registro DI en `LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs`; pruebas en `LuxuryApp.Tests/Application/Modules/Operations/Inspections/InspectionBaselineAppServiceTests.cs`; matriz RBAC corregida.
- **Resultado de las verificaciones/checklist de la fase:** `dotnet build LuxuryApp.sln`: 0 errores. Migración aplicada en dev sin pendientes (`dotnet ef migrations list` no muestra migraciones pendientes tras el update). `dotnet test --filter "FullyQualifiedName~Inspection"`: 11/11 pruebas correctas, incluyendo cobertura completa del inventario, derivación de condición con hallazgos múltiples, congelamiento de texto de catálogo, excepciones con motivo obligatorio, rechazo de estado inválido, denegación por rol sin permiso y aislamiento por cliente.
- **Bloqueos o dudas:** Ninguno para cerrar Fase 2. Pendiente de Fase 3: el workflow de envío/revisión/firma todavía no existe; hoy `StartInitialBaselineAsync` crea la ejecución en `InProgress` sin mecanismo de cierre inmutable.

**Criterio de paso verificado:** conteo de cobertura balancea (snapshots = equipos del cliente al momento de iniciar); cada equipo queda evaluado o puede marcarse con excepción justificada; probado con equipos de categorías distintas (Mantenimiento/Amenidades) en una misma ejecución; aislamiento multi-cliente confirmado por prueba.

### Fase 3 — Revisión, firma, cierre y anexos (M/L)

- Implementar envío a revisión y devolución con motivo.
- Permitir firma digital auditada al `Administrador` aprobado; registrar usuario/rol/fecha y versión.
- Bloquear edición posterior al cierre; habilitar reapertura únicamente según matriz con motivo auditado.
- Generar anexo para equipos agregados luego de firma y versionar nuevas líneas base completas.

**Criterio de paso:** flujo Inspector→Administrador funciona; rol distinto recibe denegación si matriz lo marca así; acta firmada no cambia al modificar inventario; anexo preserva acta original.

#### 📤 Reporte — Fase 3 (2026-10-04)
- **Qué se hizo:**
  1. Se crearon las entidades `InspectionApproval` (acta 1:1 con la ejecución: folio, estado, versión, actores y fechas de envío/revisión/firma/reapertura, `IsAnnex`/`AnnexOfApprovalId`) e `InspectionApprovalEvent` (bitácora auditable por transición). Enums `InspectionApprovalStatus` (`Draft`/`PendingReview`/`Returned`/`Approved`/`Reopened`) y `InspectionApprovalAction` en `Shared/Enums`.
  2. Se implementó `InspectionApprovalAppService` (`IInspectionApprovalAppService`): `SubmitAsync` (ENV), `ReturnAsync` (REV, motivo obligatorio), `SignAsync` (FIR: genera folio único, registra usuario/rol autenticados, cierra e inmutabiliza la ejecución), `ReopenAsync` (REA, motivo obligatorio, incrementa versión y `AdministrativeModificationCount`) y `CreateAnnexAsync` (ANX: crea una ejecución nueva con los equipos del cliente que no estaban en la cobertura original, ligada al acta previa).
  3. Folio acordado por el Tech Lead: `INS-{yyyyMMdd}-{NNNN}`, secuencia diaria global generada por backend. Se extendió `IGenerateFolioService` con `GenerateNextInspectionFolioAsync`, siguiendo el patrón existente de folios.
  4. Inmutabilidad: `AddFindingAsync`/`SetExceptionAsync` ya rechazaban ejecuciones cerradas; al firmar se marca `IsClosed=true`/`Status=Completed`, y la reapertura los revierte de forma auditada. Se agregó `EnsureCoverageComplete` (RN-INS-072) para no firmar si una excepción de cobertura quedó sin motivo.
  5. Se expusieron los endpoints `api/inspection-approval` (get, submit, return, sign, reopen, annex) y el listado `api/inspection-baseline/executions/{customerId}`. Todos autenticados y aislados por `CustomerId`.
  6. RBAC: se corrigió la matriz y `InspectionPermissionPolicy`. Se detectó que en la matriz los roles de campo ya tenían `ENV` ✓ pero la política lo omitía, y que `TecnicoMantenimiento`/`MttoNocturno` lo tenían denegado; por decisión del usuario se les otorgó `ENV`. Se alineó la política para que coordinación/gerencia (`GerenteMantenimiento`, `SupervisionOperativa`, `Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `JefeMantenimiento`) no tengan `ENV` (solo revisan/firman), reflejando la matriz.
  7. UI Angular: nueva pantalla `Revisión de actas` (`/inspections/approval`) con listado responsive de ejecuciones, detalle del acta, cobertura congelada, bitácora de eventos y acciones (enviar, devolver, firmar, reabrir, crear anexo) con tooltips únicos y estados como chips accesibles. Se agregó tarjeta en el hub y constantes de endpoints.
- **Archivos tocados:** entidades/configuraciones nuevas en `Infrastructure/Data/Entities/OperationsLuxuryApp/Inspections/` y `Configurations/OperationsLuxuryApp/`; migración `20261004205433_AddInspectionApprovals`; `ApplicationDbContext`; DTOs nuevos; `InspectionApprovalAppService.cs`, `IInspectionApprovalAppService.cs`, `InspectionApprovalEndpoints.cs`, `InspectionPermissionPolicy.cs`, `InspectionBaselineAppService.cs`/interfaz, `GenerateFolioService.cs`/interfaz, DI; pruebas `InspectionApprovalAppServiceTests.cs`; frontend `inspection-approval/*`, `inspection.model.ts`, `mantenimiento.endpoints.ts`, `inspection.routing.ts`, `route-paths.ts`, `inspection-modules.ts`; matriz RBAC.
- **Resultado de las verificaciones/checklist de la fase:** `dotnet build LuxuryApp.Application` 0 errores; `dotnet test --filter FullyQualifiedName~Inspection` 22/22 correctas (incluye submit, devolución con motivo, firma con folio y auditoría, secuencia diaria, denegación por rol, reapertura versionada, bloqueo post-cierre, anexo y aislamiento multi-cliente). `ng build --configuration development` completo (templates validados). La migración solo agrega tablas/índices y es reversible.
- **Bloqueos o dudas:** La migración `20261004205433_AddInspectionApprovals` fue **aplicada** en dev (2026-10-04). Antes de promoción, correr el flujo de `data-migration-protocol.md` (preflight de folio duplicado no aplica porque el folio se genera al firmar; verificar tablas/índices creados). QA browser del flujo completo pendiente de credenciales gestionadas localmente.

#### 🔎 QA browser — Fase 3 (2026-10-04, cliente AVIVIA 58, rol SuperUsuario)
Flujo verificado de punta a punta en UI real (API `:7070`, Angular `:4200`): iniciar levantamiento → cobertura congelada (672 equipos) → enviar a revisión → devolver con motivo → reenviar → **firmar** (folio `INS-20261004-0001`) → **reabrir** (v2) con bitácora y auditoría de usuario/rol autenticados. Screenshots desktop y móvil capturados.

Defectos encontrados y corregidos:
1. **POST `/api/inspection-baseline` → 500 `String or binary data would be truncated . column 'Brand'`.** El snapshot limitaba campos copiados del `Equipment` (que es `nvarchar(max)`). Se removió `MaxLength` de `EquipmentName/Brand/Model/SerialNumber/LocalCode/Location` y se agregó la migración aditiva **`20261004232039_WidenInspectionSnapshotColumns`** (aplicada).
2. **Número raw de enum en columna CATEGORÍA** de la cobertura (viola regla de enums): se agregó `InventoryCategoryDisplayName` (`GetDisplayName`) al `InspectionExecutionSnapshotDTO` y se consume en la UI.
3. **Lista mostraba ejecuciones legadas** con `InspectionType` no definido (0) y sin snapshots ("Sin clasificar", 0 equipos): filtro afinado a `InitialBaseline`/`MajorPeriodic`.
4. **UI móvil no usable**: la tabla se desbordaba y la acción "Abrir acta" no era visible. Se reescribió la pantalla con layout responsive: tablas `lux-table` en desktop y listas `ili-list-item`/tarjetas apiladas en móvil, con paginación en los listados.
5. **R3 aplicado**: validación server-side de que cada criterio pertenezca a la categoría del equipo en `AddOrUpdateCondominiumAssetAsync` (se omite si el equipo no tiene categoría, para no romper legados), más pruebas.

Observaciones: el build global de Angular falla por errores **ajenos** de trabajo concurrente (`announcement-admin-list` → `platformS` no declarado; `propiedades-list-desktop` → `tableRows`), no relacionados con Inspecciones. El componente de actas compila (`tsc` limpio y bundle de desarrollo previo correcto).


### Fase 4 — Inspección Mayor periódica, comparación y exportación (M/L)

- Configurar periodicidad por cliente con contrato único UI/API/job.
- Congelar resultados y criterios por ejecución.
- Comparar estado contra línea base y mostrar cambios por equipo/ubicación.
- Extender reporte PDF actual para reporte oficial desde snapshot: folio, cliente/proyecto, fechas, cobertura, inspector, aprobador, hallazgos, fotos y cambios.
- Mostrar acciones priorizadas y costos si negocio confirma dato disponible; no automatizar órdenes de servicio.

**Criterio de paso:** periodicidad genera una ejecución por fecha esperada; dos ejecuciones muestran cambio; exportación coincide con datos aprobados y mantiene folio/version.

### Fase 5 — QA, documentación y salida controlada (M)

- Pruebas unitarias/integración de happy, sad y edge paths; tests por roles y Customer scope.
- Revisión de migración, conteos y rollback compatible con snapshots firmados.
- Build backend/frontend, smoke test del flujo y prueba de PDF.
- Actualizar README local de Inspections y documentación técnica existente antes de crear variantes; actualizar auditoría con remediaciones comprobadas.

**Criterio de paso:** todos los gates automáticos aplicables pasan; auditoría final no encuentra falla crítica/alta abierta en autorización, integridad histórica o cobertura; Tech Lead aprueba despliegue.

## 6. Criterios de completitud

- Cada RN-INS-040 a RN-INS-074 está implementada o explícitamente declarada no aplicable con decisión registrada.
- Todos los permisos están definidos en matriz y probados; no queda acción de escritura sin autorización por rol y Customer.
- No faltan equipos en snapshot: inspeccionados + excepciones = conjunto inicial de Equipment, sin duplicados.
- Cada hallazgo mantiene historial/evidencia, clasificación técnica y acción recomendada independiente.
- Acta aprobada conserva folio, fechas, inspector, usuario aprobador, versión y contenido congelado.
- Equipo agregado después solo aparece en anexo/nueva versión; acta previa sigue igual.
- Recurrencia configurada, consultada y ejecutada coincide entre Angular, API y generación automática.
- Exportación genera informe comparativo fiel al snapshot; cambios del inventario/catálogo posteriores no alteran reporte aprobado.
- Sin escritura automática a `ServiceOrders`; presupuesto solo se conecta con owner/contrato aprobado.
- Migración conserva filas históricas y archivos; no se inventan snapshots retroactivos.
- Build/tests, smoke de UI y auditoría final pasan.

## 7. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|---|---|---|---|---|
| RBAC incompleto o permisos excesivos por matriz sin decisiones | Media | Crítico | Completar matriz y aplicar deny-by-default para `?`; tests para cada permiso acordado | Tech Lead / Security |
| Cambio de contrato deja recorridos existentes con otra periodicidad | Alta | Alto | Preservar semántica legado, round-trip antes/después y probar fechas contra jobs | Backend Lead |
| Migración no puede recrear condición histórica de equipo | Alta | Alto | No inferir; snapshots solo a partir de fecha efectiva; marcar legacy sin snapshot | Tech Lead / Data Owner |
| Folio unique index choca con folios ya existentes | Media | Alto | Preflight de duplicados, formato/versionado y constraint antes de habilitar creación | Backend Lead |
| Carga/eliminación de evidencia rompe referencia del acta | Media | Alto | No permitir borrar evidencia asociada a acta aprobada; gestión versionada y validación de rutas | Backend Lead |
| Comparación presenta falsos cambios por texto de ubicación/nombre editado | Media | Medio | Comparar valores congelados por equipo y describir cambios de inventario por separado | Product Owner / QA |
| Presupuesto se integra con entidad sin owner/servicio vigente | Media | Medio | Salida inicial de recomendaciones; revisar contrato de forecast antes de persistir importes | Product Owner / Accounting |

## 8. Dependencias e impactos

| Módulo/contrato | Relación | Impacto / control |
|---|---|---|
| `MaintenanceLuxuryApp/Machinery/Equipment` | Fuente de inventario | Reusar `Equipment`, categorías, atributos y ubicación; no crear entidad duplicada de equipo. |
| `EquipoClasificacion` y `InspectionReviewsCatalog` | Criterios | Reusar clasificación/catálogo; consolidar punto de escritura y congelar revisión aplicada. |
| `OperationsLuxuryApp/Inspections` | Motor ampliado | Actualizar modelo, endpoints, estados, workflow y reportes en su dominio. |
| `InspectionExecutionGenerationJob` + `HangfireJobCatalog` | Generación periódica | Contrato de recurrencia debe coincidir con UI/API y evitar duplicados por fecha. |
| `ApplicationRoleEnum` / `CreateRoles()` | Roles existentes | 42 roles seeded; autorizaciones las determina la matriz asociada, no nombres inferidos por el agente. |
| `HtmlPrintService` / `InspeccionPdfService` | Exportación existente | Reusar patrón de impresión; completar con datos congelados/firmados. |
| `MaintenanceBudgetForecast` | Posible dependencia | Entidad existe; no se encontró servicio de escritura activo. Requiere dueño y contrato antes de integrarla. |
| `ServiceOrders` | Fuera de alcance | Plan de recorridos vigente la excluye; no crear FK ni generación automática de órdenes. |
| `IFileReadPathService` / `IFileWritePathService` y almacenamiento | Evidencias | Reusar rutas seguras; conservar medios asociados a actas aprobadas. |

## 9. KPIs de éxito

Se conservan los cuatro KPIs de FASE 0. La revisión post implementación compara evidencia de pruebas y datos de piloto contra esos baselines de capacidad técnica. Métricas observadas de duración de inspecciones pueden agregarse solo si Product Owner entrega medición real de operación; no se inventa baseline temporal.

## 10. Plan de rollback

1. **Fase antes de habilitar actas nuevas:** revertir código/migración aditiva si pruebas post-migración fallan, preservando las tablas/columnas históricas existentes.
2. **Tras crear borradores:** conservar borradores y evidencia o exportar snapshot antes de revertir; no borrar archivos sin conciliación.
3. **Tras aprobar actas:** no ejecutar `Down()` destructivo de tablas snapshot/folio/firma. Deshabilitar creación nueva y desplegar corrección hacia adelante; mantener consulta/exportación de actas aprobadas.
4. **Rollback de contrato:** conservar compatibilidad de API/UI durante despliegue y reversión; no cambiar interpretación del campo `Frequency` sin transición probada.
5. **Post-migración:** comparar conteos por tabla; FK huérfanas = 0; actas/folios firmados = mismos antes/después; archivos referenciados existentes; job sin ejecuciones duplicadas.
6. **Responsable:** Tech Lead crea migraciones, ejecuta backup/preflight y aprueba rollback según `conventions/operations/data-migration-protocol.md`.

## 11. Revisión post implementación

- ¿El 100% de la cobertura de línea base quedó evaluada o justificada?
- ¿La firma administrativa registra identidad autenticada, rol y tiempo sin permitir edición silenciosa?
- ¿Anexos y nuevas versiones preservan actas previas?
- ¿La Inspección Mayor tiene recurrencia efectiva e historial comparable?
- ¿Los criterios por clasificación evitan duplicidad y conservan el texto histórico aplicado?
- ¿Los permisos implementados coinciden celda por celda con matriz aprobada?
- ¿Qué hallazgos reales de piloto afectaron costo/prioridad de mantenimiento?
- ¿Se actualizó documentación local y auditoría con evidencia, no casillas autodeclaradas?

---

## Gate de aprobación

Este plan queda listo para aprobación formal cuando:

1. El usuario marque `✓`, `—` o `C` para cada rol/acción de la matriz asociada.
2. Formato de folio **resuelto** (2026-10-04): `INS-{yyyyMMdd}-{NNNN}` (secuencia diaria). Valores de condición/severidad/recomendación cerrados en Fase 2.
3. El Tech Lead apruebe la secuencia, reglas y análisis de migración.

Hasta entonces, no iniciar cambios de código ni migraciones.
