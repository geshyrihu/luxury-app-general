# Bitácora de Agentes: Módulo de Inspecciones
**Directorio de Registro**: `docs/MaintenanceLuxuryApp/Inspections`  
**Responsable Técnico**: Agente Antigravity (AI) & Usuario Administrador  

## Fechas: 03 al 04 de Octubre de 2026

### Objetivo
Resolver problemas técnicos y de interfaz en el Módulo de Inspecciones de Mantenimiento (`MaintenanceLuxuryApp`), con especial énfasis en el Catálogo de Criterios de Inspección, la interfaz de Hub de Inspecciones, y el comportamiento de la base de datos durante el sembrado.

### Registro de Cambios (Changelog)

#### 1. Auditoría Inicial y Corrección de UI
*   **Revisión UI/UX**: Se ejecutó el protocolo de auditoría `qa-punta-a-punta` sobre los componentes de interfaz para alinear el CSS, paddings (Tailwind), accesibilidad HTML y convenciones visuales (SCSS).
*   **Corrección de Rutas y Naming**: Se ajustó el enrutamiento y las variables TypeScript que daban error (e.g. `Endpoints.UpdateDataBase.seedInspectionCriteriaCatalog`).
*   **Resolución de Errores C#**: Se eliminaron los problemas de prefijos globales de `global::Data` (`CS0234`) y problemas de enumeradores (`CS1729`).

#### 2. Sembrado de Base de Datos (Seeder)
*   **Resolución de Deadlocks y Timeout**: Durante el testing, Serilog colapsaba con tiempos de espera (`SqlException: Se agotó el tiempo de espera`). Se detectó que el problema raíz provenía del seeder intentando hacer fallback masivo debido a una falla en la coincidencia de cadenas (`string matching`).
*   **Corrección de Whitespaces (`.Trim()`)**: La base de datos tenía la columna `EquipmentClassifications.Description` con espacios en blanco (trailing spaces). Se implementó un mapeo usando `.Trim()` para que las llaves coincidieran correctamente con el diccionario.
*   **Evolución a un Modelo Idempotente**: 
    *   Se eliminó la mecánica destructiva `RemoveRange` de los criterios.
    *   Se implementó una lógica idempotente (*Upsert*) que revisa la existencia de los criterios por categoría.
    *   Si existe y es diferente, lo actualiza. Si no existe, lo inserta. Si sobra y no tiene historial (`InspectionReviews`), lo elimina.
*   **Normalización de Texto**: Se incorporó el método estático `NormalizeText` que corrige los textos guardados previamente en `PURO MAYÚSCULA` a un formato "Sentence case" (Solo la primera en mayúscula), garantizando un estándar visual.

#### 3. Ampliación del Catálogo de Inspecciones
*   **Integración de Sugerencias**: Se agregaron más de 50 puntos de inspección sugeridos desde un análisis crítico proporcionado por el usuario, englobando categorías clave:
    *   **Cuarto de Máquinas y Eléctricos**: Orden, cableado, temperatura, iluminación.
    *   **Elevadores**: Acabados, botones, comunicación, cables de tracción.
    *   **Albercas y Jacuzzis / Spa**: Drenajes, temperatura, iluminación subacuática.
    *   **Áreas Comunes / Estacionamientos**: Accesibilidad, salidas de emergencia, ventilación CO, extinguidores.
    *   **Sistemas Críticos (Gas, Incendio, Agua)**: Puesta a tierra, hermeticidad, válvulas con candado.
    *   **Vehículos y Uniformes**: Botiquines, inventario EPP, bitácoras fotográficas, seguro y verificación.
*   La base de datos cuenta ahora con un mapeo robusto a las **43 clasificaciones de equipo** presentes en `EquipmentClassifications`.

#### 4. Frontend - Agrupación y Vistas de Datos (`AppTable`)
*   Se corrigió el componente `catalogo-revisiones-inspeccion.html/.ts` para que la tabla `<app-table>` despliegue la información agrupada por *Categoría*.
*   **TS**: Se mapeó la variable local de las respuestas para extraer la propiedad `categoria`.
*   **HTML**: Se configuró `groupRowsBy="categoria"` y se construyó el `<ng-template #groupheader>` con el ícono `material-symbols-light:folder-open`, dándole al usuario final un listado más inteligible visualmente en escritorio.
*   En la vista móvil `<app-data-view-mobile>`, también se habilitó la visualización de este campo en subtítulo.

#### 5. Ampliación de la Guía de Usuario (Inspection Hub)
*   Se transformó la breve "Guía para el usuario" de la pantalla central (`inspection-hub.html`) en un documento integrado directamente en la UI.
*   **Nuevas Secciones Integradas**:
    *   **Propósito y Objetivos**: Conservación, prevención de fallas y garantía del estándar de calidad.
    *   **Cómo se organiza un recorrido**: Explicación del flujo de "Crea -> Asigna Equipos -> Define Responsables".
    *   **Criterios de Inspección**: Explicación de cómo el catálogo estandarizado nutre cada equipo de forma automática.
    *   **Ejecución y Seguimiento**: Explicación de la app móvil ("Mis Recorridos"), reportes de anomalías, hallazgos críticos e integración con tickets de corrección.

---
*Este documento se adjunta como bitácora de la participación del Agente en el módulo `Inspecciones` del desarrollo `LuxuryApp`.*

## Actualización de continuidad — 04 de octubre de 2026

### Fase 1: contrato de recurrencia y catálogo
- Se sustituyó el contrato frontend/backend ambiguo de frecuencia por `RecurrenceUnit` + `RecurrenceInterval`.
- Se consolidó el catálogo de criterios y se protegió el texto histórico usado por inspecciones ya ejecutadas.
- Se agregaron validaciones de acceso por `CustomerId` en servicios de inspecciones.
- Commit API relacionado: `85fe53846`.
- Commit Angular relacionado: `4c098b5e2`.

### Fase 2: levantamiento inicial, snapshots y hallazgos
- `InspectionType` distingue `Periodic`, `InitialBaseline` y `MajorPeriodic`.
- `InspectionExecutionSnapshot` congela identidad y ubicación del equipo al iniciar una ejecución.
- `InspectionExecutionFinding` permite múltiples hallazgos con severidad, recomendación y criterio congelado.
- La condición resumen se deriva del hallazgo más crítico.
- Excepciones de cobertura requieren motivo obligatorio mediante restricción de base de datos.
- Se creó política RBAC deny-by-default y endpoints de baseline aislados por cliente.
- Migración aplicada en dev: `20261004171632_AddInspectionBaselineSnapshots`.
- 9 pruebas nuevas; suite de Inspections validada con 12/12 pruebas correctas.
- Commit API: `04bf3e06f`.
- Documentación/matriz RBAC: commit raíz `e60abdd`.

### Correcciones recientes
- `InspectionAppService.UpdateInspectionAsync`: reemplazo de días semanales sin `DbUpdateConcurrencyException`; regresión agregada en `InspectionAppServiceTests`.
- Reportes: se corrigió fecha enviada como `[object Event]`, se ajustó layout responsive y tamaños `small/sm`.
- Listado de recorridos: filtros con aplicar/limpiar, alineación desktop, tooltips duplicados y nombre visible de `RecurrenceUnit` mediante `GetDisplayName()` backend.
- `InspectionType` se movió a `Shared/Enums/InspectionType.cs`, separado de la entidad y con `DisplayName` en español.

### QA y herramientas de agentes
- Se incorporó skill repo-local `.agents/skills/agent-browser/SKILL.md` para QA browser con API conectada, consola, red, accesibilidad y screenshots.
- Kilo, Codex, Antigravity, Aider y `AGENTS.md` apuntan al protocolo común.
- No se guardan credenciales, cookies, auth state, HAR ni screenshots con secretos.

### Estado y pendientes para siguiente sesión
- Fase 2 está cerrada técnicamente. Fase 3 pendiente: envío a revisión, revisión, firma digital, cierre inmutable y anexos.
- Revisar primero `git status` raíz, `api` y `appsweb/angular`; existen cambios concurrentes/preexistentes, especialmente migración masiva `app-table` → `lux-table`. No revertirlos.
- Existe corrupción ajena pendiente en `admin.../database-backup-list.html` (`nlux-tablee`, cierres desbalanceados) que bloqueó algunos builds globales anteriores.
- Último build de Angular completado correctamente después del ajuste visual de recorridos; ejecuciones posteriores pueden exceder timeout por tamaño del workspace.
- Antes de ampliar Fase 3, actualizar esta bitácora y los documentos de `docs/OperationsLuxuryApp/Inspections/` con cualquier decisión nueva.

## Actualización de continuidad — 04 de octubre de 2026 (Fase 3)

### Fase 3: revisión, firma digital, cierre y anexos
- Se acordó con el Tech Lead el formato de folio: `INS-{yyyyMMdd}-{NNNN}` (secuencia diaria global, generada por backend).
- Decisión de alcance: backend **y** UI de revisión/firma, incluyendo anexos de equipos incorporados después de la firma.
- Nuevas entidades `InspectionApproval` (acta 1:1 con la ejecución) e `InspectionApprovalEvent` (bitácora auditable). Enums `InspectionApprovalStatus` y `InspectionApprovalAction`.
- `InspectionApprovalAppService`: submit (ENV), devolución con motivo (REV), firma/cierre inmutable con folio único y auditoría de identidad autenticada (FIR), reapertura versionada con motivo (REA) y anexo de equipos nuevos ligado al acta original (ANX).
- Folio generado por `IGenerateFolioService.GenerateNextInspectionFolioAsync` (extensión aditiva del servicio compartido de folios).
- Migración `20261004205433_AddInspectionApprovals` (solo tablas/índices; reversible). **Aplicada en dev**.
- Endpoints `api/inspection-approval/*` y `api/inspection-baseline/executions/{customerId}`; aislamiento por `CustomerId`.
- RBAC: corrección de `ENV` (ver matriz). Los roles de campo ya tenían `ENV` ✓ en la matriz pero la política lo omitía; se otorgó `ENV` a `TecnicoMantenimiento`/`MttoNocturno` y se alineó la política para que coordinación/gerencia no envíen (solo revisan/firman).
- UI Angular: pantalla `/inspections/approval` (listado responsive, detalle de acta, cobertura congelada, bitácora y acciones con tooltips únicos), tarjeta en el hub, modelos y endpoints.
- Verificación: `dotnet test --filter FullyQualifiedName~Inspection` → 22/22; `ng build --configuration development` completo.
- Pendiente: QA browser del flujo completo (requiere API y servidor en ejecución con credenciales gestionadas localmente).

### QA browser Fase 3 (04 de octubre de 2026)
- QA real en AVIVIA 58 con rol SuperUsuario: flujo completo OK en UI (iniciar levantamiento → cobertura 672 equipos → enviar → devolver con motivo → reenviar → firmar `INS-20261004-0001` → reabrir v2). Desktop y móvil validados con screenshots (en temp, sin secretos).
- Bug crítico corregido: 500 al iniciar levantamiento por truncamiento de `Brand` (columna 100 vs `Equipment nvarchar(max)`). Migración aditiva `20261004232039_WidenInspectionSnapshotColumns` aplicada. Pruebas de Inspections: 24/24.
- Corregido: categoría raw de enum en cobertura → `InventoryCategoryDisplayName`; lista con ejecuciones legadas → filtro a `InitialBaseline`/`MajorPeriodic`; UI móvil reescrita con tablas desktop + listas `ili-list-item`; paginación en listados.
- R3 aplicado: validación server-side de categoría en `AddOrUpdateCondominiumAssetAsync` + pruebas.
- Nota: build global de Angular falla por errores ajenos concurrentes (`announcement-admin-list`, `propiedades-list-desktop`); no relacionados con Inspecciones.

### Auditoría de src/styles (04 de octubre de 2026)
- Segunda pasada sobre `appsweb/angular/src/styles` con los gates del Design System.
- `audit:tokens`: se corrigieron 26 colores hardcodeados fuera de lugar en 3 partials (`web/_lagos-ui-kits.scss`, `web/_fullcalendar-overrides.scss`, `web/_ng-select-overrides.scss`) reemplazándolos por tokens `--ds-*` / `color-mix`. Ahora **0 violaciones** en alcance.
- `audit:icon-names`: la ruta del catálogo estaba desactualizada (`shared/app-icon` → `primitives/app-icon`); corregida. Reporta 2 usos retirados (`pi pi-` / `mdi:`) en `conventions-viewer.service.ts` (deuda ajena, módulo admin — ticket aparte).
- Gates que pasan: `audit:tokens`, `audit:token-refs`, `audit:contrast` (42/42 AA), `audit:css`, `audit:design`, `audit:encoding`.
- `audit:a11y`: login con 5 violaciones (contraste/landmarks) ajenas a Inspecciones; pendiente a11y de la pantalla de actas (requiere API estable).



