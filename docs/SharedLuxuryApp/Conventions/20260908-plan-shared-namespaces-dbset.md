# Plan: Normalización de Entidades (Singular), Carpetas (Plural) y DbSet (Singular)

**Fecha:** 2026-09-08 (actualizado — reorden de fases + hallazgo entidades plurales + drift EF preexistente)
**Tipo:** Refactor técnico puro (sin nuevas features, sin cambios de negocio, sin UI)
**Deriva de:** [CONVENTIONSFOLDER.MD](../../CONVENTIONSFOLDER.MD) §2.2
**Responsable de ejecución:** Agente chalán (siguiendo checklist de este plan)
**Responsable de auditoría:** Tech Lead / agente planificador (verificación por fase)

---

## FASE 0: PRE-PLANEACIÓN

### 0.1 Problem Statement + KPIs

Actualmente, el código backend tiene tres inconsistencias de naming que se decidió resolver en un solo objetivo: **todas las clases de entidad en singular, todas las carpetas de submódulo en plural, todos los `DbSet<T>` con nombre igual a la clase.**

Se identificaron:
- **10 clases de entidad con nombre en plural** (deben pasar a singular).
- **14 carpetas de submódulo que colisionan** con el nombre de su entidad (antipatrón CS0118, CONVENTIONSFOLDER.MD §2.2).
- **~90 propiedades `DbSet<T>`** sin criterio consistente (mezcla singular/plural).
- **Un drift preexistente de EF Core** (`Provider` table rename + `AuditEntries` AlterColumn pendientes desde antes de este plan) que bloquea que cualquier migración de verificación salga "vacía".

| Métrica | Baseline | Target | Timeline |
|:---|:---|:---|:---|
| Clases de entidad en plural | 10 | 0 (9 renombradas + 1 caso `Tasks` resuelto) | Fase 1 |
| Carpetas colisionando con su entidad | 14 | 0 | Fase 2 |
| DbSet properties sin criterio singular | ~90 | 0 | Fase 3 |
| Migraciones EF generadas con contenido NUEVO respecto al baseline | 0 tolerado | 0 en todo el proceso | Fase 1-3 (gate ajustado, ver 0.2) |

---

### 0.2 Reglas del Refactor (Invariantes)

```
RN-REF-001: El valor dentro de [Table("...")] NUNCA se modifica. Es lo único que define
            el nombre físico de la tabla en BBDD; todo este refactor es 100% código C#
            (nombres de clase, carpeta, namespace, propiedad DbSet).

RN-REF-002 (AJUSTADA v2 — 2026-09-09): El repo tiene un drift preexistente de EF Core
            (Provider table rename Provider->Providers + AlterColumn en AuditEntries).
            Además, por decisión explícita del Tech Lead, `CategoryProvider` vuelve a
            quedar SIN clave primaria (ProviderConfiguration.cs comentado a propósito,
            fuera de alcance de este plan). Consecuencia: `dotnet ef migrations add` NO
            FUNCIONA para todo el repo — EF Core no puede construir el modelo en
            absoluto, no solo para este plan. El gate "antes==después" con `dotnet ef`
            queda INUTILIZABLE mientras esto siga así (no es un fallo nuestro, es que
            la herramienta no corre). Gate de respaldo, mismo rigor sin depender de
            `dotnet ef`:

              1. `grep -c "\[Table("` + diff línea por línea de cada [Table]/[Column]/
                 [Key]/[ForeignKey] tocado — antes y después del lote deben ser
                 idénticos en TODOS los atributos de mapeo (no solo el conteo).
              2. Revisar el diff completo del commit (`git show`) confirmando que el
                 único contenido son renombres de tipo/namespace/usings — cualquier
                 línea que toque `modelBuilder.Entity<T>()`, `IEntityTypeConfiguration`,
                 o los atributos de mapeo de EF, detiene el lote para revisión manual.
              3. `dotnet build` limpio (3 proyectos) + tests del módulo/dominio tocado
                 sin regresiones nuevas respecto al baseline conocido.

              Si en algún momento `dotnet ef migrations add` vuelve a funcionar (porque
              se resuelve el ajeno de CategoryProvider o el drift de Provider/AuditEntries),
              se puede retomar el gate "antes==después" como capa adicional, pero no es
              bloqueante mientras tanto.

RN-REF-003: La clase `Tasks` (OperationsLuxuryApp/Task/Tasks/Entities/Tasks.cs) se
            renombra a `TaskRecord` (NO a `Task`). `Task` colisionaría con
            System.Threading.Tasks.Task (ImplicitUsings=enable en los 3 proyectos).
            Este renombre específico se hace con "Rename Symbol" del IDE/Roslyn, NUNCA
            con sed/grep de texto — un reemplazo textual de "Tasks" puede tocar por
            error fragmentos de "System.Threading.Tasks".

RN-REF-004: Dos entidades viven en una carpeta que YA es singular e igual al nombre
            singular objetivo de la clase: `TaskMessageReads` (carpeta
            `Task/TaskMessageRead/`) y `WorkGroupMembers` (carpeta
            `Task/WorkGroupMember/`). Para estas dos, el renombre de CLASE (Fase 1) y
            el renombre de CARPETA (normalmente Fase 2) se ejecutan JUNTOS, en el mismo
            commit — si se hace solo la clase primero, se crea una colisión nueva en el
            estado intermedio.

RN-REF-005: AnnouncementAnalytics se renombra a `AnnouncementAnalyticsEntry` (decisión
            explícita del Tech Lead — "Analytics" es sustantivo no-contable en inglés,
            forzar singular literal ("AnnouncementAnalytic") es gramaticalmente inválido).

RN-REF-010: Orden de fases (definido por Tech Lead): Fase 1 = normalizar TODAS las
            clases de entidad a singular. Fase 2 = carpetas a plural. Fase 3 = DbSet
            a singular. No se mezclan fases en el mismo commit, salvo la excepción
            RN-REF-004.

RN-REF-011: Cada entidad/carpeta se cierra con build + test verde antes de pasar a la
            siguiente. No se acumulan varias entidades en un solo commit.

RN-REF-020: Solo el agente ejecutor designado toca código; el Tech Lead aprueba el plan
            y valida los gates de cada fase antes del siguiente lote.
```

---

### 0.3 Riesgos + Pre-Mortem

| Supuesto Fallido | Impacto | Probabilidad | Mitigación |
|:---|:---|:---|:---|
| Alguien borra o edita `[Table("...")]` al renombrar una clase/mover un archivo | Riesgo real de pérdida/corrupción de datos | Baja | Diff review obligatorio; grep de `[Table(` antes/después debe dar el mismo valor |
| Rename textual (sed/grep) de `Tasks`→`TaskRecord` toca `System.Threading.Tasks` por error | Build roto a escala masiva (miles de usos de `async Task`) | Alta si se usa texto plano | RN-REF-003: usar Rename Symbol de Roslyn/IDE, nunca texto plano |
| Se renombra `TaskMessageReads` o `WorkGroupMembers` sin coordinar la carpeta en el mismo paso | Colisión CS0118 nueva en el estado intermedio | Alta si no se seguim RN-REF-004 | Commit único que hace ambos renombres a la vez |
| El gate de migración se interpreta como "debe salir vacía" (ignorando el drift preexistente) | Bloqueo total, falsos negativos, pánico innecesario | Media (ya pasó una vez) | RN-REF-002 documenta explícitamente el gate ajustado "antes == después" |
| El drift preexistente (Provider/AuditEntries) se intenta arreglar "de paso" dentro de este plan | Mezcla refactor de bajo riesgo con cambio de schema de riesgo real | Media | Fuera de alcance explícito (Sección 2); requiere su propio plan |

---

## 1. Resumen Ejecutivo

**Problema:** 10 clases de entidad en plural, 14 carpetas colisionando con su entidad, ~90 `DbSet<T>` sin criterio consistente.

**Solución:** Tres refactors de código secuenciales — (1) normalizar clases a singular, (2) carpetas a plural, (3) DbSet a singular — ninguno modifica `[Table("...")]`, por lo que ninguno genera cambio de schema real. La verificación usa un gate "antes == después" en vez de "vacío", porque el repo ya tiene drift de EF ajeno a este plan.

**Beneficio:** Naming 100% consistente, cero colisiones de namespace, cumplimiento de CONVENTIONSFOLDER.MD §2.2.

---

## 2. Scope & Constraints

```
IN-SCOPE:
Fase 1 — Normalizar 10 clases de entidad a singular:
  1. Tasks -> TaskRecord (Rename Symbol, RN-REF-003)
  2. InspectionReviews -> InspectionReview
  3. WorkGroupMembers -> WorkGroupMember (+ carpeta, RN-REF-004)
  4. AnnouncementAnalytics -> AnnouncementAnalyticsEntry (RN-REF-005)
  5. TaskMessageReads -> TaskMessageRead (+ carpeta, RN-REF-004)
  6. AnnouncementCustomers -> AnnouncementCustomer
  7. AnnouncementRoles -> AnnouncementRole
  8. EquipmentDocuments -> EquipmentDocument
  9. AnnouncementAttachments -> AnnouncementAttachment
  10. TaskMeetings -> TaskMeeting

Fase 2 — 14 carpetas de submódulo a plural (ver Sección 4), MENOS las 2 ya resueltas
  en Fase 1 (TaskMessageRead, WorkGroupMember)

Fase 3 — ~90 DbSet<T> a singular (ver plan original, Sección 4)

OUT-OF-SCOPE:
- El drift preexistente de EF (Provider rename Provider->Providers, AlterColumn en
  AuditEntries) — requiere su propio plan, con su propio análisis de riesgo de datos
  (un rename mal generado puede salir como DROP+CREATE en vez de RenameTable)
- El caso ReclutamientoLuxuryApp/Employee vs Employees/Employees (deuda de migración
  "Fase 9" sin cerrar)
- Las carpetas placeholder NewFolder/Candidates, NewFolder/CandidateProcesses,
  NewFolder/CandidatesWorkExperience
- Cambios de UI/frontend
```

---

## 3. Arquitectura & Diseño Técnico

**Backend (.NET 10) — únicamente `LuxuryApp.Application`, `LuxuryApp.Api`, `LuxuryApp.Tests`:**

- Fase 1: rename de clase (Roslyn/IDE para `Tasks`, textual con `\b` word-boundary + revisión de diff para el resto) + todos los call-sites, DTOs, mappers, servicios que referencien el tipo.
- Fase 2: rename de directorio físico + `namespace` file-scoped + `GlobalUsings.cs` (Application + Api).
- Fase 3: rename de propiedad `DbSet<T>` en `ApplicationDbContext.cs` + call-sites `_context.X`/`dbContext.X`.
- Ninguna fase toca `Migrations/`, `[Table]`, `[Column]`.

---

### 3.5 Migración de Datos & Prevención de Pérdida (OBLIGATORIA)

**Responsable:** Tech Lead

#### 3.5.1 Cambios de Estructura

| Tabla física | Cambio | Riesgo | Mitigación |
|:---|:---|:---|:---|
| Ninguna | Nombre de clase (Fase 1) | Nulo — la clase no participa en mapeo EF Core, solo `[Table]` | Gate "antes==después" |
| Ninguna | Namespace/carpeta (Fase 2) | Nulo | Gate "antes==después" |
| Ninguna | Nombre de propiedad DbSet (Fase 3) | Nulo — confirmado `[Table]` explícito en 327/332 entidades, incluidas las 90 con DbSet plural | Gate "antes==después" |

#### 3.5.2 Análisis de Pérdida de Datos

```
Ninguna operación de este plan genera DDL. El único vector de riesgo es edición
accidental de [Table("...")] al mover/renombrar un archivo. Mitigación: diff review
línea por línea de cada [Table] tocado, antes y después de cada commit.

Hallazgo aparte (fuera de alcance): el repo YA tiene un drift real entre código y
BBDD (Provider table rename + AuditEntries AlterColumn) que antecede este plan y que
SÍ tiene riesgo de datos si se ejecuta sin cuidado — pero no se toca aquí.
```

#### 3.5.3 Comando de Verificación (gate "antes == después", RN-REF-002)

```
Por cada commit/lote:

1. ANTES del cambio:
   dotnet ef migrations add ZZZ_Antes --project LuxuryApp.Application --startup-project LuxuryApp.Api
   Guardar el contenido de Up()/Down() generado (texto, no aplicar). Borrar el archivo.

2. Aplicar el cambio del lote (rename de clase/carpeta/DbSet).

3. DESPUÉS del cambio:
   dotnet ef migrations add ZZZ_Despues --project LuxuryApp.Application --startup-project LuxuryApp.Api
   Guardar el contenido de Up()/Down() generado. Borrar el archivo.

4. Comparar ANTES vs DESPUÉS (diff de texto de las dos migraciones guardadas):
   - Idénticas -> PASS, continuar
   - Diferencia -> FAIL, revertir el commit del lote, auditar antes de reintentar
```

#### 3.5.4 Validación Post-Lote (CHECKLIST)

- [ ] Gate "antes == después" da diferencia cero
- [ ] `grep -c "\[Table("` antes y después del lote → mismo total, mismos valores
- [ ] `dotnet build` (3 proyectos) sin errores ni warnings CS0104 (ambigüedad) o CS0118 nuevos
- [ ] Tests del módulo tocado en verde
- [ ] Migraciones de verificación (`ZZZ_Antes`, `ZZZ_Despues`) borradas, no quedan en `Migrations/`
- [ ] Commit hecho desde `api/` (donde vive `.git`), NO desde la raíz del repo

#### 3.5.5 Rollback Plan

`git revert` del commit del lote que falló el gate. No hay BBDD que restaurar (no hay DDL en ningún lote de este plan).

### 3.6 Tokens de Diseño

No aplica — refactor 100% backend.

---

## 4. Backlog de Tasks

**Fase 1 — Entidades → singular (10 clases) — COMPLETA (2026-09-09):**
- [x] `TaskMeetings` → `TaskMeeting` (commit b4cd60b9)
- [x] `AnnouncementAttachments` → `AnnouncementAttachment` (commit ac80dde8)
- [x] `EquipmentDocuments` → `EquipmentDocument` (commit 0dbf9b7a)
- [x] `AnnouncementCustomers` → `AnnouncementCustomer` (commit cb0ed889)
- [x] `AnnouncementRoles` → `AnnouncementRole` (commit a67fc245)
- [x] `AnnouncementAnalytics` → `AnnouncementAnalyticsEntry` (commit 5b486615, RN-REF-005)
- [x] `TaskMessageReads` → `TaskMessageRead` + carpeta → `Task/TaskMessageReads/` (commit c3f09069, RN-REF-004)
- [x] `WorkGroupMembers` → `WorkGroupMember` + carpeta → `Task/WorkGroupMembers/` (commit e4922579, RN-REF-004)
- [x] `InspectionReviews` → `InspectionReview` (commit 05a60226)
- [x] `Tasks` → `TaskRecord` (commit 08b8ab29, Rename Symbol/Roslyn, RN-REF-003 — auditado a fondo, 0 roce con System.Threading.Tasks)

Prerequisitos/hallazgos resueltos en el camino: fix CategoryProvider (a7aa4fa7),
commit separado de reestructuración CandidateCore/SanctionTypes del usuario (26bedfe4).

Nota operativa: desde AnnouncementAnalytics en adelante, `dotnet ef migrations add`
dejó de estar disponible (CategoryProvider vuelve a estar intencionalmente sin PK) y
el build general estuvo intermitentemente roto por trabajo ajeno en curso (Contabilidad,
IBusinessTimeService) — todos los commits de esta fase se auditaron con el gate de
respaldo (RN-REF-002 v2: diff de atributos EF + revisión manual del diff + build/tests
aislados cuando el build completo no estaba disponible).

**Fase 2 — Carpetas → plural (12 restantes tras resolver los 2 casos en Fase 1):**
- [ ] `ContabilidadLuxuryApp/AccountingCatalog` → `AccountingCatalogs`
- [ ] `LegalLuxuryApp/Legal/LegalMatter` → `LegalMatters`
- [ ] `MantenimientoLuxuryApp/CalendarioMaestro` → `CalendariosMaestro`
- [ ] `MantenimientoLuxuryApp/CalendarioMaestroEquipo` → `CalendariosMaestroEquipo`
- [ ] `MantenimientoLuxuryApp/Piscina` → `Piscinas`
- [ ] `MantenimientoLuxuryApp/PiscinaBitacora` → `PiscinasBitacora`
- [ ] `OperationsLuxuryApp/Announcement` → `Announcements`
- [ ] `OperationsLuxuryApp/Comite/ComiteVigilancia` → `ComitesVigilancia`
- [ ] `OperationsLuxuryApp/CustomDocument` → `CustomDocuments`
- [ ] `OperationsLuxuryApp/PanicAlert` → `PanicAlerts`
- [ ] `OperationsLuxuryApp/Property` → `Properties`
- [ ] `OperationsLuxuryApp/Task/Tasks` → `Task/TaskRecords` (tras Fase 1 ítem `Tasks`→`TaskRecord`)
- [ ] `SupplierLuxuryApp/Provider` → `Providers`
- [ ] Confirmar `WorkGroupCategories` no colisiona (ya plural)

**Fase 3 — DbSet → singular (~90 propiedades, ≥729 usos, ver detalle en historial de conversación del plan):**
- [ ] Renombrar propiedades en `ApplicationDbContext.cs` por bloque de módulo
- [ ] Actualizar call-sites `_context.X`/`context.X`/`dbContext.X`
- [ ] `DbSet<Tasks>` ya queda como `DbSet<TaskRecord> TaskRecord` de forma natural tras Fase 1

---

## 5. Fases de Ejecución

```
Fase 1 (por entidad, orden de menor a mayor riesgo — ver Backlog):
  Criterio de PASO por entidad: gate "antes==después" PASS, build+test verde,
  [Table] intacto, commit individual.
  TaskMessageReads y WorkGroupMembers: commit único que incluye clase + carpeta.
  Tasks -> TaskRecord: última de la fase, con Rename Symbol de IDE, revisión manual
  extra del diff completo antes de commitear (por el volumen y el riesgo de colisión).

Fase 2 (por carpeta, orden de menor a mayor tamaño):
  Igual metodología que el plan original — Piscina/CalendarioMaestroEquipo primero
  para revalidar el proceso, Announcement al final.

Fase 3 (por volumen de uso, menor a mayor):
  Igual metodología que el plan original.
```

---

## 6. Criterios de Completitud

- [ ] 0 clases de entidad en plural (excepto las ya resueltas a singular real)
- [ ] 0 carpetas de submódulo colisionan con el nombre de su entidad
- [ ] 0 propiedades `DbSet<T>` con nombre distinto al de su clase
- [ ] 0 alias `using X = ...` remanentes que existían solo por una colisión ya resuelta
- [ ] `dotnet build` sin warnings CS0104/CS0118 en los 3 proyectos
- [ ] Todas las migraciones `ZZZ_Antes`/`ZZZ_Despues` borradas del historial
- [ ] El drift preexistente de Provider/AuditEntries queda documentado como pendiente, con su propio plan por crear (fuera de este alcance)

---

## 7. Riesgos & Mitigaciones

Ver Sección 0.3.

---

## 8. Dependencias Externas

Ninguna.

---

## 9. Métricas & KPIs de Éxito

Ver Sección 0.1.

---

## 10. Rollback Plan

`git revert` por commit/lote. No hay BBDD que restaurar en ningún punto de este plan.

---

## 11. Post-Implementation Review

*(Completar al cerrar el plan)*
- ¿El gate "antes==después" se sostuvo en las 3 fases sin excepciones?
- ¿Cuántos alias `using X = ...` se eliminaron en total?
- ¿Se abrió el plan separado para el drift de Provider/AuditEntries?
- ¿El caso Employee/Employees de Reclutamiento sigue en backlog o se atendió aparte?

---

**Estado (2026-09-09):** Fase 1 completa. Siguiente: Fase 2 (carpetas → plural), 12 carpetas restantes — empezar por `Piscina`/`CalendarioMaestroEquipo` (menor tamaño).
