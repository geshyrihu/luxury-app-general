# PASO 0.5 — Reconocimiento de Estructura de Entidades: "Recorridos (Inspecciones)"

**Fecha:** 2026-09-29
**Tipo de trabajo (hipótesis a confirmar en PASO 0):** **B — Ampliar módulo existente** (no crear nuevo)
**Backend existente:** `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Inspections/`
**Frontend existente:** `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/` ⚠️ (carpeta cruzada: negocio "Mantenimiento", backend "Operations" — ver Hallazgo 1)

## Resumen ejecutivo

**El módulo "Recorridos" que describe el requerimiento YA EXISTE, casi completo, back y front.** No hay que crearlo. Hay que **terminar de conectarlo** (hay una pieza central rota) y **decidir/rediseñar la vista del ejecutor**.

No es un módulo nuevo. Es cerrar un trabajo que otro desarrollador dejó a medias.

---

## 1. Dónde vive cada cosa (verificado contra el repo, no asumido)

| Capa | Ruta | Estado |
|---|---|---|
| Entidades | `api/LuxuryApp.Application/Infrastructure/Data/Entities/OperationsLuxuryApp/Inspections/` | 10 archivos, 8 relevantes (ver §2) |
| Configuraciones EF | `api/LuxuryApp.Application/Infrastructure/Data/Configurations/OperationsLuxuryApp/` | 8 archivos, **todos stub vacío** (`// TODO: Migrar configuración`) — normal en este repo, el mapeo real vive en anotaciones de la entidad |
| `DbSet<>` | `ApplicationDbContext.cs:1204-1240` | **Los 10 registrados, ninguno comentado** → todos activos/mapeados |
| Servicios/DTOs/Endpoints | `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Inspections/` | 6 servicios, 20 DTOs, 2 archivos de endpoints |
| Frontend (UI real) | `appsweb/angular/.../modules/maintenance.luxuryapp/inspection/` | 13 componentes, CRUD + ejecución + PDF |
| Frontend "operations.luxuryapp/inspections" | — | **Vacía.** No es donde vive la UI real; ignorar esa ruta. |

---

## 2. Traducción de negocio de cada entidad

| Entidad (clase) | Tabla | Qué es en negocio | Campos clave |
|---|---|---|---|
| `Inspection` | `Inspections` | **El "recorrido"**: plantilla con nombre, frecuencia y departamento. | `Name`, `Frequency` (Daily/Weekly/Monthly), `WeeklyDays`, `DayOfMonth`, `Departament`, `CustomerId`, `IsActive` |
| `InspectionWeeklyDay` | `InspectionSchedules` | Días de la semana en que corre un recorrido semanal. | `InspectionId`, `WeeklyDay` |
| `InspectionCondominiumAsset` | `InspectionAssets` | **El "equipo dentro del recorrido"** — el punto de revisión con su orden. | `InspectionId`, `Position` ⭐ (= sort order que pide el usuario, YA EXISTE), `CondominiumAssetId`/`CondominiumAsset` ❌ **comentado, sin destino real** |
| `InspectionReviewsCatalog` | `InspectionCriteria` | Catálogo maestro de "qué se revisa" (ej. "Presión adecuada", "Sin daño físico"). | `Description`, `Departament` |
| `InspectionReview` | `InspectionReviews` | Puente: qué criterio del catálogo aplica a qué punto de revisión (`InspectionCondominiumAsset`). | `InspectionCondominiumAssetId`, `InspectionReviewsCatalogId` |
| `CustomerInspection` | `CustomerInspections` | **La ejecución concreta** de un recorrido en una fecha, por un usuario. | `InspectionId`, `ApplicationUserId`, `CreatedAt`, `IsRealized` |
| `InspectionResult` | `InspectionFindings` | El hallazgo/resultado de un criterio en una ejecución concreta. | `CustomerInspectionId`, `InspectionReviewsId`, `State` (columna `IsApproved`), `Observations` |
| `InspectionResultImage` | `InspectionImages` | Evidencia fotográfica de un hallazgo. | `InspectionResultId`, `PhotoPath` |

**Fuera de alcance,亦 viven en esta misma carpeta pero son de otro dominio (no tocar, no confundir):**
- `ReportDefinition.cs` (tabla `ReportDefinitions`) — definición de reportes contables dinámicos. No tiene relación con inspecciones; parece mal ubicado en esta carpeta.
- `ReportSubmissionRecord.cs` (tabla `ReportSubmissions`) — historial de envío de reportes. Mismo caso.

**Conteo:** 10 archivos en la carpeta de entidades → 8 documentados como parte del motor de Recorridos, 2 excluidos y justificados arriba (dominio distinto, no relacionado con el requerimiento).

---

## 3. Mapeo con lo que pide el requerimiento del usuario

| Pide el usuario | Ya existe como | Estado |
|---|---|---|
| "Componente de administración de recorridos" | `Inspection` CRUD (`InspectionAppService` + `InspectionEndpoints`) + UI `lista-inspecciones` / `inspecciones-form` | ✅ Funcional |
| "Cada recorrido puede tener una frecuencia definida" | `Frequency` (Daily/Weekly/Monthly) + `WeeklyDays`/`DayOfMonth` + `Validate()` en la entidad | ✅ Funcional |
| "Un recorrido debe incluir un listado de equipos relacionados" | `InspectionCondominiumAsset` (colección en `Inspection`) | ⚠️ **Roto** — ver Hallazgo 1 |
| "Sort order cronológico" | Campo `Position` en `InspectionCondominiumAsset`, con comentario explícito en el código: "define el orden en que se muestra el activo durante la inspección" | ✅ Ya existe exactamente como se pide |
| "Cada equipo debe tener configuradas sus inspecciones (lo que se revisa), según la tabla correspondiente" | `InspectionReviewsCatalog` (catálogo) + `InspectionReview` (bridge activo↔criterio) | ✅ Funcional, reutiliza justo las clases que el requerimiento señala en `Configurations/OperationsLuxuryApp/` |
| "Vista para el ejecutor, similar a `my-assigned-tasks-list.html`" | `logbook/mis-inspecciones-lista.ts` + `mis-inspecciones-ejecutar.html` | ⚠️ Existe pero es una tabla simple con selector de fecha; **no** tiene el patrón de `my-assigned-tasks-list` (filtro por estado, vista de tarjetas en móvil, menú de acciones, reporte de impresión). Ver Hallazgo 2. |

---

## 4. Hallazgos críticos (bloqueantes para proponer código)

### Hallazgo 1 — El enlace "equipo real" está roto en TODO el módulo (back y front)

`InspectionCondominiumAsset.CondominiumAssetId` / `.CondominiumAsset` (la propiedad que debería apuntar al equipo/activo real) está **comentada en la entidad** y, en cascada, comentada en **los 6 servicios** que la tocan:
- `InspectionCondominiumAssetAppService.cs` (líneas 73-74, 86-87, 102-103, 114-115, 148-149, 156, 184)
- `InspectionAppService.cs` (`AddOrUpdateCondominiumAssetAsync`, línea 248: sólo valida que `CondominiumAssetId` no sea null, pero nunca lo persiste — la entidad `InspectionCondominiumAsset` que crea no tiene esa propiedad)
- `CustomerInspectionAppService.cs` (línea 240-242, comentario textual del autor original: **`//cambiar a Machinery`** — confirma que el plan original era enlazar a `Machinery`, nunca se hizo)

**Consecuencia real:** hoy, un "equipo" dentro de un recorrido **no está ligado a ningún equipo real**. Solo tiene una posición (`Position`) y sus criterios de revisión, pero no hay forma de saber a *cuál* extintor/hidrante/máquina/área corresponde. Los reportes agrupan por `CondominiumAssetName` que siempre sale vacío (línea 284, `CustomerInspectionAppService.cs`).

**Decisión pendiente (no la voy a asumir):** dado que este repo acaba de terminar la migración de activos de incendio a `Equipment` único (T-203, esta misma sesión), lo natural sería enlazar `InspectionCondominiumAsset` → `Equipment` en vez de `Machinery` (que ya es legado) o de una entidad `CondominiumAsset` que **no existe en ningún lugar del código** (confirmado por búsqueda exhaustiva). Pero esto lo debe confirmar el usuario en PASO 1, no se asume aquí.

### Hallazgo 2 — El endpoint de "crear equipo dentro del recorrido" no existe

El frontend (`inspeccion-activo-condominio.ts:198`) hace `POST inspection-condominium-asset` para crear un nuevo activo-en-inspección. Pero `InspectionCondominiumAssetEndpoints.cs` **no tiene ningún `MapPost("")`** — sólo `list`, `condominium-asset/{id}`, `{id}` (GET), `{id}` (PUT), `delete-review`, `delete-area`. Ese botón de "Agregar" en la UI existente hoy devuelve 404.

Existe un segundo camino que sí funciona: `POST api/inspection/add-or-update-condominium-asset` (`InspectionAppService.AddOrUpdateCondominiumAssetAsync`), pero el frontend no lo usa desde ese formulario — hay dos rutas de "crear" divergentes, una rota (la que usa la UI) y otra viva (la que no usa la UI).

### Hallazgo 3 — Vista del ejecutor no sigue el patrón solicitado

`mis-inspecciones-lista.ts`/`.html` es un selector de fecha + tabla simple. `my-assigned-tasks-list.html` (la referencia que dio el usuario) tiene: filtro por estado (`app-task-status`), menú de acciones contextual, vista de tarjetas en móvil con avatar/badge de días, y un reporte de impresión completo. Son patrones de UI distintos; replicar el segundo sobre el módulo de recorridos es trabajo de diseño/frontend nuevo, no solo "conectar datos".

### Hallazgo 4 — Sin job automático

No hay entrada en `HangfireJobCatalog.cs` para generar `CustomerInspection` de forma proactiva. Hoy la generación es "lazy": solo ocurre cuando alguien llama `GetInspectionsByCustomerAsync` para una fecha (crea las que falten en ese momento). Si el requerimiento espera que las inspecciones/recorridos "aparezcan solas" cada día para el ejecutor sin que nadie abra esa pantalla primero, falta un job — no confirmado si es necesario, a preguntar en PASO 1.

---

## 5. Lo que NO hace falta construir

- Motor de frecuencias (Daily/Weekly/Monthly) — completo.
- Catálogo de criterios de revisión — completo, y es exactamente lo que el requerimiento pide reutilizar de `Configurations/OperationsLuxuryApp/`.
- Sort order — completo (`Position`).
- CRUD de recorridos — completo.
- Estructura de resultados + evidencia fotográfica + reporte PDF de ejecución — completo.

## 6. Lo que sí falta / hay que decidir

1. Resolver Hallazgo 1: a qué entidad enlazar `InspectionCondominiumAsset` (`Equipment` es la hipótesis razonable, pero se confirma con el usuario).
2. Resolver Hallazgo 2: unificar el flujo de creación (arreglar el POST roto o migrar el frontend a `add-or-update-condominium-asset`).
3. Diseñar/rehacer la vista del ejecutor siguiendo el patrón de `my-assigned-tasks-list.html`.
4. Decidir si se necesita generación proactiva (job) de `CustomerInspection` (Hallazgo 4).
5. Confirmar si "ServiceOrders" (mencionado en el requerimiento como concepto distinto, ya existente en Maintenance) necesita algún cruce con Recorridos o solo se menciona para delimitar alcance (parece ser solo delimitación, a confirmar).
