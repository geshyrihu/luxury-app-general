# Plan de Renombrado Progresivo de Carpetas Backend a Ingles

**Fecha:** 2026-09-18  
**Tipo:** Migracion estructural controlada, solo carpetas backend  
**Estado:** Pendiente de aprobacion Tech Lead  
**Responsable de ejecucion:** Agente ejecutor designado  
**Responsable de aprobacion y gates:** Tech Lead  
**Origen:** `docs/SharedLuxuryApp/Conventions/20260912-auditoria-shared-migracion-ingles.md`  
**Alcance fisico:** `api/LuxuryApp.Application/Infrastructure/Data/Entities/` y `api/LuxuryApp.Application/Modules/`

---

## FASE 0: PRE-PLANEACION

### 0.1 Problem Statement + KPIs

Actualmente, los mantenedores del backend encuentran carpetas en espanol o
spanglish al navegar `LuxuryApp.Application`, lo que resulta en namespaces y
rutas fisicas inconsistentes, busquedas ambiguas y mayor riesgo al aplicar la
politica de naming 100% ingles.

Este plan corrige exclusivamente nombres de carpetas y las referencias
estructurales estrictamente necesarias. No renombra clases, archivos,
propiedades, DTOs, tablas, columnas ni rutas HTTP.

| Metrica | Baseline | Target | Timeline |
|---|---:|---:|---|
| Carpetas objetivo no inglesas en `Entities/` | 7 top-level | 0 | Fase E |
| Carpetas objetivo no inglesas en `Modules/` | Inventario de Fase A | 0 o aprobadas como excepcion | Fases M1-M4 |
| Cambios de tabla/columna EF | 0 | 0 | Todas las fases |
| Cambios de rutas HTTP o payloads | 0 | 0 | Todas las fases |
| Lotes sin build y tests PASS | 0 | 100% | Cada lote |
| Commits por lote revertibles | 0 | 1 commit por lote | Todas las fases |

### 0.2 Reglas de control

Las siguientes reglas gobiernan ejecucion:

| ID | Nivel | Regla | Verificacion |
|---|---|---|---|
| RN-FOLDER-001 | Invariante de dominio | Ningun rename puede cambiar comportamiento, reglas de negocio o modelo de datos. | Diff sin cambios semanticos; atributos EF identicos. |
| RN-FOLDER-010 | Flujo y estados | Cada lote se ejecuta en orden: inventario, rename, referencias, build, tests, cierre. | Checklist del lote completo. |
| RN-FOLDER-020 | Seguridad/autorizacion | No se modifican permisos, endpoints, middleware ni contratos HTTP. | Scan de rutas antes/despues sin diferencias. |
| RN-FOLDER-030 | Validacion | Toda carpeta final debe usar PascalCase, ingles tecnico y plural cuando represente una coleccion. | Auditoria de nombres y diff de namespaces. |

### 0.3 Pre-mortem y flujos

**Pre-mortem:** asumimos que el cambio llego a produccion y fallo. Causas
probables: rename textual incompleto, namespace desalineado, colision con una
carpeta existente, modificacion accidental de atributos EF, o lote demasiado
grande para aislar el rollback.

**Happy path:** inventario congelado -> aprobacion de mapa -> `git mv` de un
lote -> actualizacion mecanica de namespaces/usings -> build y tests -> diff
revisado -> commit -> siguiente lote.

**Sad path:** build falla o aparece diferencia EF -> detener lote -> no avanzar
dependencias -> revertir commit del lote -> corregir mapa -> repetir validacion.

**Edge path:** destino ya existe o un termino tiene traduccion ambigua
(`Direccion`, `ResponsablesCliente`, `Cobranza`) -> no elegir automaticamente;
marcar decision pendiente y solicitar aprobacion Tech Lead.

---

## 1. Resumen Ejecutivo

Se aplicara una migracion por lotes pequenos, agrupada por dominio y separando
entidades de modulos. Cada lote tendra su propio commit y gate. El cambio
fisico se realizara con `git mv`; los namespaces/usings se tocaran solo cuando
sean referencias al segmento renombrado o cuando sea necesario cumplir la
politica path-based.

La base de datos no se migra. Los nombres de clases, archivos y contratos
publicos quedan fuera del plan para evitar mezclar riesgos.

---

## 2. Scope & Constraints

### In scope

- Renombrar carpetas dentro de `Infrastructure/Data/Entities/`.
- Renombrar carpetas dentro de `Modules/`.
- Actualizar namespaces y `using` afectados por el rename fisico.
- Actualizar rutas fisicas hardcodeadas si referencian las carpetas renombradas.
- Actualizar referencias documentales o de configuracion que apunten a esas rutas.
- Ejecutar build, tests, scan de rutas y scan de mojibake por lote.

### Out of scope

- Renombrar clases, interfaces, records, enums, DTOs o archivos.
- Renombrar propiedades, metodos, campos o parametros.
- Renombrar tablas, columnas, `DbSet`, migraciones o atributos EF.
- Cambiar rutas HTTP, verbs, JSON, serializacion o contratos externos.
- Reubicar archivos entre modulos.
- Resolver deuda de clases/propiedades en espanol detectada por el escaner.
- Corregir carpetas ya inglesas aunque tengan otros problemas estructurales.

### Restricciones obligatorias

- No ejecutar antes de aprobacion Tech Lead.
- No usar reemplazo global de texto.
- No agrupar todos los modulos en un solo commit.
- No continuar despues de un gate FAIL.
- Todo rename debe conservar historial con `git mv`.
- Si destino existe, detenerse y resolver colision antes del rename.

---

## 3. Arquitectura y Diseno Tecnico

### 3.1 Fuentes normativas

- `conventions/CONVENTIONS.md`
- `conventions/CONVENTIONS_FOLDER_API.MD`
- `conventions/GOVERNANCE-ANTI-SPANGLISH-RULES.md`
- `conventions/operations/plan-creation-protocol.md`
- `docs/SharedLuxuryApp/Conventions/20260912-auditoria-shared-migracion-ingles.md`

### 3.2 Metodo de rename

1. Congelar inventario y mapa aprobado.
2. Crear snapshot de referencias con `rg`.
3. Ejecutar `git mv` para cada carpeta del lote.
4. Cambiar solo segmentos de namespace, `using` y rutas fisicas confirmadas.
5. Revisar diff completo.
6. Ejecutar gates.
7. Crear commit individual del lote.

No se permite `sed`, reemplazo global ni sustitucion por substring. Cada
segmento debe tratarse como token de ruta/namespace para evitar modificar
identificadores que solo contienen el mismo texto.

### 3.3 Mapa de nombres propuesto

Los nombres siguientes son propuesta inicial; los marcados `*` requieren
confirmacion semantica antes de ejecutar.

| Actual | Objetivo propuesto |
|---|---|
| `CobranzaLuxuryApp` | `CollectionsLuxuryApp` |
| `ComprasLuxuryApp` | `PurchasesLuxuryApp` |
| `ContabilidadLuxuryApp` | `AccountingLuxuryApp` |
| `DireccionLuxuryApp` | `ManagementLuxuryApp`* |
| `MantenimientoLuxuryApp` | `MaintenanceLuxuryApp` |
| `ReclutamientoLuxuryApp` | `RecruitmentLuxuryApp` |
| `ResidentesLuxuryApp` | `ResidentsLuxuryApp` |
| `AutitoriaCuentasAspel` | `AspelAccountAudit` |
| `CatalogoGastosFijos` | `FixedExpenseCatalog` |
| `ContabilidadConfig` | `AccountingConfig` |
| `ContabilidadMigration` | `AccountingMigration` |
| `ContabilidadOnline` | `AccountingOnline` |
| `RespuestaCobranza` | `CollectionsResponse`* |
| `RespuestaContabilidad` | `AccountingResponse`* |
| `Fondeos` | `Fundings` |
| `Contabilidad` | `Accounting` |
| `Presupuesto` | `Budget` |
| `PresupuestoPropuesta` | `BudgetProposal` |
| `PresupuestoShared` | `BudgetShared` |
| `PresupuestoWebAspel` | `AspelWebBudget` |
| `ConfiguracionSistema` | `SystemConfiguration` |
| `AsambleaChecklistTemplates` | `AssemblyChecklistTemplates` |
| `SeguridadPermisos` | `SecurityPermissions` |
| `AccesoCustomers` | `CustomerAccess` |
| `AspelCobranzaHausLive` | `AspelCollectionsHausLive` |
| `AspelCobranzaHausLocal` | `AspelCollectionsHausLocal` |
| `CobranzaNativa` | `NativeCollections` |
| `CobranzaOnline` | `OnlineCollections` |
| `Evaluacion` | `Evaluation` |
| `Nomina` | `Payroll` |
| `Configuracion` | `Configuration` |
| `Evidencias` | `Evidence` |
| `IncidenciasNomina` | `PayrollIncidents` |
| `NominaDetalles` | `PayrollDetails` |
| `NominaEncabezados` | `PayrollHeaders` |
| `PeriodosNomina` | `PayrollPeriods` |
| `Prestamos` | `Loans` |
| `TiemposExtra` | `Overtime` |
| `RecursosHumanos` | `HumanResources` |
| `LegalMinuta` | `LegalMeetingMinutes`* |
| `CalendariosMaestro` | `MasterCalendars` |
| `CalendariosMaestroEquipo` | `MasterCalendarEquipment` |
| `Medidores` | `Meters` |
| `Piscinas` | `Pools` |
| `PiscinasBitacora` | `PoolLogs` |
| `RecepcionPipasAgua` | `WaterTruckReceipts` |
| `Mantenimiento` | `Maintenance` |
| `JuntasMensuales` | `MonthlyMeetings` |
| `Asamblea` | `Assembly` |
| `Comite` | `Committee` |
| `ComitesVigilancia` | `OversightCommittees` |
| `DireccionDashboard` | `ManagementDashboard` |
| `ContratosLegal` | `LegalContracts` |
| `ReclutamientoResumen` | `RecruitmentSummary` |
| `TareasLegal` | `LegalTasks` |
| `IncidenciasAdministrativas` | `AdministrativeIncidents` |
| `Minuta` | `MeetingMinutes` |
| `Presentacion` | `Presentation` |
| `Operaciones` | `Operations` |
| `ResumenGeneral` | `GeneralSummary` |
| `HistorialCompras` | `PurchaseHistory` |
| `OrdenesCompra` | `PurchaseOrders` |
| `SolicitudesCompra` | `PurchaseRequests` |
| `Comparativo` | `Comparison` |
| `Cotizaciones` | `Quotes` |
| `Detalle` | `Details` |
| `Evidencia` | `Evidence` |
| `Solicitudes` | `Requests` |
| `EmployeeOrganigrama` | `EmployeeOrgChart` |
| `SolicitudAltas` | `EmployeeRegistrationRequests` |
| `SolicitudBajas` | `EmployeeDismissalRequests` |
| `SolicitudModificacionesSueldo` | `SalaryModificationRequests` |
| `SolicitudVacantes` | `VacancyRequests` |
| `CatalogosGenerales` | `GeneralCatalogs` |
| `MetodoPago` | `PaymentMethod` |
| `TelefonosEmergencia` | `EmergencyPhones` |
| `UsoCfdi` | `CfdiUsage` |
| `ResponsablesCliente` | `CustomerResponsibleParties`* |

La lista final de carpetas se obtiene nuevamente en Fase A. No se ejecutara un
rename basado solo en esta tabla si el inventario actual difiere.

### 3.5 Migracion de datos y prevencion de perdida

**No aplica como migracion de datos.** El plan no modifica tablas, columnas,
datos ni configuracion EF. El riesgo residual es editar accidentalmente
atributos o rutas de persistencia al actualizar referencias.

Validaciones obligatorias:

- Conteo y valores de `[Table(...)]`, `[Column(...)]`, `[ForeignKey(...)]` y
  configuracion Fluent sin diferencias.
- Ningun archivo nuevo en `Migrations/`.
- Ningun cambio en rutas HTTP o payloads.
- Diff manual del lote antes del commit.

---

## 4. Backlog de Tasks

### Fase A - Inventario y decisiones

- [ ] Confirmar que este plan es el unico plan activo para este alcance.
- [ ] Ejecutar inventario recursivo de ambas rutas.
- [ ] Separar carpetas inglesas, espanolas, spanglish y ambiguas.
- [ ] Confirmar destinos sin colisiones.
- [ ] Aprobar traducciones marcadas `*`.
- [ ] Generar mapa versionado de actual -> objetivo.

### Fase E - `Infrastructure/Data/Entities`

- [ ] Renombrar `CobranzaLuxuryApp`.
- [ ] Renombrar `ComprasLuxuryApp`.
- [ ] Renombrar `ContabilidadLuxuryApp`.
- [ ] Renombrar `DireccionLuxuryApp` tras decision semantica.
- [ ] Renombrar `MantenimientoLuxuryApp`.
- [ ] Renombrar `ReclutamientoLuxuryApp`.
- [ ] Renombrar `ResidentesLuxuryApp`.

### Fase M1 - Accounting, Admin, Auth y Collections

- [ ] Aplicar mapa aprobado bajo `AccountingLuxuryApp`.
- [ ] Aplicar mapa aprobado bajo `AdminLuxuryApp` y `AuthLuxuryApp`.
- [ ] Aplicar mapa aprobado bajo `CollectionsLuxuryApp`.

### Fase M2 - Human Resources, Legal y Maintenance

- [ ] Aplicar mapa aprobado bajo `HumanResourcesLuxuryApp`.
- [ ] Aplicar mapa aprobado bajo `LegalLuxuryApp`.
- [ ] Aplicar mapa aprobado bajo `MaintenanceLuxuryApp`.

### Fase M3 - Management y Operations

- [ ] Aplicar mapa aprobado bajo `ManagementLuxuryApp`.
- [ ] Aplicar mapa aprobado bajo `OperationsLuxuryApp`.
- [ ] Revisar especialmente duplicados `Comite`, `JuntasMensuales` y `Asamblea`.

### Fase M4 - Purchases, Recruitment y Shared

- [ ] Aplicar mapa aprobado bajo `PurchasesLuxuryApp`.
- [ ] Aplicar mapa aprobado bajo `RecruitmentLuxuryApp`.
- [ ] Aplicar mapa aprobado bajo `SharedLuxuryApp`.

### Cierre

- [ ] Ejecutar auditoria global de carpetas.
- [ ] Ejecutar build y tests completos.
- [ ] Ejecutar scan de mojibake.
- [ ] Registrar resultado en bitacora.
- [ ] Completar revision post-implementacion.

---

## 5. Fases de Ejecucion

### Gate comun por lote

1. Confirmar working tree y cambios ajenos; no revertir cambios del usuario.
2. Capturar snapshot de referencias y atributos EF.
3. Ejecutar `git mv` de una carpeta o grupo pequeno coherente.
4. Actualizar namespaces/usings/rutas fisicas estrictamente afectados.
5. Revisar `git diff --stat` y `git diff --check`.
6. Ejecutar `dotnet build api/LuxuryApp.sln`.
7. Ejecutar `dotnet test api/LuxuryApp.sln --no-build`.
8. Comparar atributos EF y rutas HTTP antes/despues.
9. Ejecutar `node scripts/scan-mojibake.mjs api/LuxuryApp.Application`.
10. Crear commit individual solo despues de PASS.

### Orden y tamano

- Fase A no modifica codigo.
- Fase E: una carpeta top-level por commit.
- Fases M1-M4: maximo un subdominio o 3 carpetas pequenas por commit.
- Primero lotes de baja ambiguedad; dejar `Direccion`, `Cobranza`,
  `ResponsablesCliente` y respuestas genericas para aprobacion explicita.
- No ejecutar fases en paralelo sobre archivos compartidos.

### Criterio de detencion

Detener inmediatamente si ocurre cualquiera:

- destino ya existe;
- build o tests fallan;
- cambia cualquier atributo EF o ruta HTTP;
- aparecen namespaces sin correspondencia fisica;
- el diff contiene cambios de clases, archivos, DTOs o contratos;
- el scan de mojibake no devuelve cero;
- el lote supera el tamano aprobado.

---

## 6. Criterios de Completitud

- [ ] Todas las carpetas objetivo estan en ingles tecnico.
- [ ] No quedan nombres espanoles o spanglish dentro de las dos rutas objetivo,
  salvo excepciones aprobadas y documentadas.
- [ ] Todos los namespaces path-based afectados coinciden con carpetas fisicas.
- [ ] No se renombro ninguna clase, archivo, propiedad, DTO, tabla o columna.
- [ ] No cambiaron rutas HTTP ni payloads.
- [ ] `dotnet build api/LuxuryApp.sln` PASS.
- [ ] `dotnet test api/LuxuryApp.sln --no-build` PASS.
- [ ] `node scripts/scan-mojibake.mjs api/LuxuryApp.Application` devuelve 0.
- [ ] No hay migraciones EF nuevas.
- [ ] Cada lote tiene commit independiente y evidencia de gate.
- [ ] Rollback probado al menos en un lote piloto.

---

## 7. Riesgos y Mitigaciones

| Riesgo | Severidad | Mitigacion | Responsable |
|---|---|---|---|
| Namespace o `using` olvidado | Alta | Scan de referencias + build por lote | Ejecutor |
| Colision con carpeta destino existente | Alta | Inventario y gate previo | Ejecutor |
| Cambio accidental de EF | Critica | Diff de atributos y prohibicion de Migrations | Ejecutor + Tech Lead |
| Traduccion semantica incorrecta | Media | Aprobacion de mapa y decision registrada | Tech Lead |
| Rename textual toca identificadores no relacionados | Alta | `git mv` y reemplazo tokenizado, nunca global | Ejecutor |
| Lote demasiado grande para revertir | Alta | Maximo 1 carpeta top-level o 3 pequenas | Ejecutor |
| Documentacion queda con rutas antiguas | Media | Scan final de rutas en `docs/`, scripts y configuracion | Ejecutor |
| Cambios ajenos contaminan el commit | Alta | Revisar `git status`, stage solo rutas del lote | Ejecutor |

---

## 8. Dependencias Externas

- Aprobacion del Tech Lead para este plan.
- Decision semantica para nombres marcados `*`.
- Working tree disponible para commits aislados.
- Solucion `api/LuxuryApp.sln` compilable en baseline.
- Acceso a tests de `LuxuryApp.Tests`.
- No requiere cambios frontend ni coordinacion de contrato HTTP.

---

## 9. Metricas y KPIs de Exito

- 100% de lotes con build PASS.
- 100% de lotes con tests PASS o con baseline documentado antes de ejecutar.
- 0 cambios de esquema EF.
- 0 cambios de rutas HTTP.
- 0 carpetas objetivo pendientes al cierre.
- 0 hallazgos de mojibake en `LuxuryApp.Application`.
- 100% de commits revertibles individualmente.

---

## 10. Rollback Plan

Cada lote se revierte con el commit individual correspondiente:

```powershell
git revert <commit-del-lote>
dotnet build api/LuxuryApp.sln
dotnet test api/LuxuryApp.sln --no-build
```

No se requiere restauracion de base de datos porque el plan prohibe cambios de
schema y datos. Si un lote produjo diferencias en EF, no se intenta reparar en
caliente: se revierte, se conserva la evidencia y se abre un plan separado.

---

## 11. Post-Implementation Review

Al cierre, Tech Lead debe confirmar:

- [ ] Mapa final actual -> objetivo archivado.
- [ ] Lotes ejecutados y commits listados.
- [ ] Excepciones semanticas resueltas o documentadas.
- [ ] Ningun cambio fuera del alcance fue incluido.
- [ ] Build, tests y scans finales PASS.
- [ ] No existe deuda de rutas antiguas en configuracion o documentacion.
- [ ] La siguiente fase de nombres de clases/archivos queda separada de este plan.

**Estado esperado:** plan aprobado -> Fase A completada -> ejecucion por lotes ->
auditoria final PASS.
