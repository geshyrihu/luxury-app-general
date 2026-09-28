# PLAN DE IMPLEMENTACIÓN - Reclutamiento > Candidates (funcional)

**Fecha:** 2026-08-14
**Versión:** 1.0
**Estado:** R-01, R-02, R-03, Fase 4 y Fase 5 (Verificación global y cierre) COMPLETADOS Y VALIDADOS (2026-08-15). Módulo Reclutamiento Candidatos listo para PR. Nota: deuda de tests preexistente fuera de alcance R en otros módulos (charts, image-analysis-dialog, supplier, etc.); el alcance R y la carpeta `candidates/` quedaron verdes (incluido parche de `ActivatedRoute` en `candidate-list-mobile.spec.ts`).
**Basado en:** `nueva-estructuraV2.md` + `02-fase-0-analisis-reglas.md`

---

## 📌 RESUMEN EJECUTIVO

Agregar al módulo de Candidatos: (R-01) fuente de reclutamiento en el candidato, (R-02) alta de
empleado que distribuye datos a entidades existentes vía orquestador `RequestEmployeeRegister`, y
(R-03) documentación de contratación en el expediente del Empleado. Sin duplicar entidades salvo
los GAPs resueltos (D1-D6). R-01 es la primera unidad **aprobada para codificar**.

> Paralelo: `docs/plans/20260813-reclutamiento-candidates-remediacion-plan.md` (deuda de convenciones
> existente). El código nuevo debe cumplir esas mismas convenciones.

---

## 🎯 QUÉ ESTÁ DENTRO DEL ALCANCE (IN-SCOPE)

- [x] **R-01** Fuente de reclutamiento en Candidato (frontend + backend).
- [x] **R-02** Alta de empleado: orquestador `RequestEmployeeRegister` + transacción + distribución.
- [x] **R-03** `EmployeeDocument` + `RecruitmentDocumentType` (hub) + endpoints multipart.

## 🚫 QUÉ NO ESTÁ DENTRO DEL ALCANCE (OUT-OF-SCOPE)

- Renombres `RecruitmentCandidate*` (D6): fase de migración aparte.
- Asignación de vacante / `CandidateApplication` pipeline de etapas.
- Feedback de entrevista / `CandidateInterviewType` como discriminador (se resuelve por etapa/acción).
- Eliminación de `CandidateInterviewFeedback` / `CandidateDecisionReason` (plan de migración aparte).

---

## 🏗️ ARQUITECTURA TÉCNICA

### Backend (Endpoints / Entidades / Enums)

| Elemento | Cambio | Descripción |
| -------- | ------ | ----------- |
| `Candidate` (entidad) | Modificado | +`RecruitmentSource` (enum `FuenteReclutamiento`) |
| `CandidateCreateOrUpdateDto` | Modificado | +`RecruitmentSource` |
| `RequestEmployeeRegister` (orquestador) | Modificado | Recibe distribución real (R-02) |
| `EmployeeDocument` | NUEVO | Expediente de contratación (R-03) |
| `RecruitmentDocumentType` (enum hub) | NUEVO | ~17 tipos; ruta `recruitment-document-type` |
| Endpoints `hiring-documents` | NUEVO | POST multipart `[FromForm]`+`DisableAntiforgery`, GET, POST validate |

### Frontend (Pantallas)

| Pantalla | Cambio | Usuario | Descripción |
| -------- | ------ | ------- | ----------- |
| `candidates/candidate-form` | Modificado | RRHH | +`recruitmentSource` (R-01) |
| `candidates/candidate-form.interface` | Modificado | — | `CandidateFormGroup` + campo |
| `candidates/candidate.dto` | Modificado | — | `CandidateAddOrEdit`/`CandidateDetail` + `recruitmentSource` |
| (R-02/R-03) asistente multi-paso y carga docs | NUEVO | RRHH/Validador | Fases 2-3 |

### Base de Datos

| Tabla | Cambio | Campos nuevos |
| ----- | ------ | ------------- |
| `Candidates` | Modificado | `Source` (enum) |
| `EmployeeDocuments` | NUEVO | `EmployeeId`, `DocumentTypeId`, `FileUrl`, `IsSubmitted/Validated`, etc. |

---

## 📋 FASES DE TRABAJO

### FASE 1: R-01 — Fuente de Candidato ✅ APROBADO PARA CODIFICAR

**Duración:** ~2-3 días. **Alcance acotado:** solo ficha maestra del candidato.

| Día | Tarea | Criterio de aprobación | Dependencia |
| --- | ----- | --------------------- | ----------- |
| 1 | Backend: `Candidate` +`RecruitmentSource`; `CandidateCreateOrUpdateDto` +`RecruitmentSource` | `dotnet build` OK | enum `FuenteReclutamiento` ya en hub |
| 1 | Frontend: `candidate-form.interface.ts` + `recruitmentSource: FormControl<number\|null>` | Tipo compila | — |
| 2 | Frontend: `candidate-form.ts` carga opciones con `EnumSelectService.fuenteReclutamiento()`, selector en HTML, `onSubmit` append, `onLoadData` patch | Form guarda fuente | — |
| 2 | Frontend: `candidate.dto.ts` (`CandidateAddOrEdit`/`CandidateDetail` +`recruitmentSource?`) | Tipo compila | — |
| 3 | `ng build` + spec de form | Build OK, sin regresiones | — |

**Criterio de PASO Fase 1:** candidato se crea/edita con fuente; valor viaja como `FormData` (multipart)
coherente con `[FromForm]`; se reusa hub (NO enum local ni endpoint propio).

---

### FASE 2: R-02 — Alta de Empleado (orquestador) ✅ COMPLETADO (2026-08-15)

**Duración:** ~1-2 semanas.

| Paso | Tarea | Criterio de aprobación |
| ---- | ----- | --------------------- |
| 1 | Ampliar `CandidateApplicationProcessHiringDto` / `SolicitudAltaCompletaDto` con campos R-02 | DTOs 1 archivo=1 DTO |
| 2 | `ResolveOrCreateEmployeeIdAsync`: poblar `PersonData`, `Address`, `EmployeeBankData`, `EmployeeClinicalData`, `EmployeeEmergencyContact` (beneficiario) | Sin esqueletos vacíos |
| 3 | `ProcessHiringAsync`: set `WorkPosition.TurnoTrabajo`; copiar `Candidate.RecruitmentSource`→`Fuente` | Transición correcta |
| 4 | `OnSolicitudAltaAsync`: persistir distribución real | — |
| 5 | Envolver distribución en transacción atómica | Rollback ante fallo |

**Criterio de PASO:** alta distribuye todos los datos; `TurnoTrabajo` reusa hub `turno-trabajo`; sin `TypePerson`.

---

### FASE 3: R-03 — Documentación de Contratación ✅ COMPLETADO (2026-08-15)

**Duración:** ~1 semana.

| Paso | Tarea | Criterio de aprobación |
| ---- | ----- | --------------------- |
| 1 | Crear enum `RecruitmentDocumentType` + ruta hub `recruitment-document-type` | NO modificar `DocumentType` existente |
| 2 | Entidad `EmployeeDocument` + migración | 1 empleado → N documentos |
| 3 | Servicio `CandidateHiringDocumentAppService` (subir/listar/validar) | — |
| 4 | Endpoints multipart `[FromForm]`+`DisableAntiforgery` | 415 evitado |
| 5 | Reusar `candidate-cv-upload` para carga | Sin componente duplicado |

**Criterio de PASO:** documentos se suben/validan en expediente del Empleado; CV sigue en Candidato.

---

### FASE 4: Pruebas y Despliegue

| Día | Tarea | Criterio |
| --- | ----- | -------- |
| 1 | Pruebas integrales R-01/R-02/R-03 | Flujos feliz funcionan |
| 2 | Pruebas de convenciones | Ver checklist 05 |
| 3 | Despliegue staging | Sin regresiones |

---

## ✅ CRITERIOS DE APROBACIÓN POR FASE

### FASE 1 (R-01) — APROBADA
- [x] Backend `Candidate` + DTO con `RecruitmentSource`
- [x] Frontend selector vía hub `fuente-reclutamiento`
- [x] `FormData` multipart coherente con `[FromForm]`

### FASE 2 (R-02) — COMPLETADO
- [x] Distribución completa a entidades existentes (`PersonData`, `Address`, `EmployeeBankData`, `EmployeeClinicalData`, `EmployeeEmergencyContact`)
- [x] Transacción atómica (`BeginTransactionAsync` en ambos `ProcessHiringAsync`)
- [x] `TurnoTrabajo` vía hub `turno-trabajo`; sin `TypePerson`

### FASE 3 (R-03) — COMPLETADO
- [x] `EmployeeDocument` + hub `recruitment-document-type`
- [x] Endpoints multipart correctos (sin 415)
- [x] Reuso de componente de carga

### FASE 4 (Pruebas/Despliegue) — COMPLETADO
- [x] Migración EF `AddEmployeeDocument` generada y reversible (incluye `EmployeeDocuments` [R-03] + `RecruitmentCandidates.RecruitmentSource` [R-01] + `StaffHiringRequests.CandidateId` [R-02]; sin drift de otros módulos).
- [x] `dotnet build api/LuxuryApp.sln` 0 errores.
- [x] `ng build --configuration development` sin errores nuevos (solo NG8113 preexistentes).
- [x] Mojibake 0 (`client/angular`, 4200 archivos).
- [x] `audit:icon-names` sin hallazgos nuevos.
- [x] Specs de `candidates/` 8/8 verdes.

### FASE 5 (Verificación global y cierre) — COMPLETADO
- [x] `npm run build` (prod): 0 errores nuevos de R; solo NG8113 preexistentes (`cobranza-online-wrapper`, `candidate-recruitment-schedule-modal`, `recruitment-agenda-list`).
- [x] `npm run lint` (cadena de auditoría): 0 hallazgos nuevos en archivos de R; mojibake 0 (`audit:encoding`).
- [x] `node scripts/scan-mojibake.mjs client/angular`: 4200 archivos, 0 mojibake.
- [x] `dotnet build api/LuxuryApp.sln`: 0 errores.
- [x] Specs de `candidates/` verdes: `candidate-form.spec.ts` 4/4, `candidate-detail.spec.ts` 4/4, `candidate-list-desktop.spec.ts` 6/6, `candidate-list-mobile.spec.ts` 6/6 (20/20).
- [x] Migración `AddEmployeeDocument` reversible cubre R-01 (`RecruitmentSource`) + R-02 (`StaffHiringRequests.CandidateId`) + R-03 (`EmployeeDocuments`); aplicada por `Program.cs:211` (`MigrateAsync`).
- [x] **`candidate-list-mobile.spec.ts` parcheado** (fuera de alcance R): se añadió `provideRouter([])` en el `TestBed`; 6/6 verde. La suite global `npm test` aún tiene regresiones preexistentes en otros módulos ajenos a R (charts, image-analysis-dialog, supplier, mantenimiento, operations, legal, admin, recursos-humanos) — deuda externa no atribuible a R.

### MÓDULO COMPLETO — COMPLETADO
- [x] R-01/R-02/R-03 funcionan extremo a extremo
- [x] Cumple convenciones (ver 05-checklist-pruebas.md)
- [x] `dotnet build` + `ng build` sin errores nuevos de R

---

## 📝 CHECKLIST DE PRUEBAS

Ver `05-checklist-pruebas.md`.

---

## ⚠️ RIESGOS Y MITIGACIONES

| Riesgo | Prob. | Impacto | Mitigación |
| ------ | ----- | ------- | ---------- |
| Mezclar `TypePerson` en `ApplicationUser` | Alta | Alto | RN-CAND-102: no agregar |
| Orquestador no transaccional | Media | Alto | Transacción atómica (Fase 2) |
| Romper `DocumentType` del hub | Alta | Alto | Crear `RecruitmentDocumentType` nuevo |
| 415 en subida de docs | Media | Alto | `[FromForm]`+`DisableAntiforgery` |

---

## 🔄 PLAN DE ROLLBACK

1. Identificar: build rojo o 415 en subida de docs.
2. Decisión: Tech Lead.
3. Ejecución: revertir PR (migración de `EmployeeDocuments` reversible).
4. Verificación: `dotnet build` + `ng build` OK.
5. Investigación: issue + corrección.

---

## 📅 CRONOGRAMA RESUMIDO

| Fase | Entregable | Estado |
| ---- | ---------- | ------ |
| 1 (R-01) | Fuente en candidato | ✅ Completado y validado |
| 2 (R-02) | Alta orquestada | ✅ Completado y validado |
| 3 (R-03) | Documentos contratación | ✅ Completado y validado |
| 5 | Verificación global y cierre | ✅ Completado |

**Tiempo total estimado:** ~4 semanas (Fases 2-4, tras R-01).

---

## 🐞 HALLAZGOS E INCIDENCIAS

Registro de lo identificado durante implementación y pruebas (fuera y dentro de alcance R): ver [`../../../docs/RecruitmentLuxuryApp/Candidates/20260808-auditoria-recruitment-candidates-incidencias.md`](./../../../docs/RecruitmentLuxuryApp/Candidates/20260808-auditoria-recruitment-candidates-incidencias.md). Incluye: migración agrupada R-01/R-02/R-03 (H-01), deuda de tests global preexistente (H-02), `candidate-list-mobile.spec.ts` resuelto (H-03), `INVALID_STAGE_TRANSITION` resuelto en `CandidateStageValidator` (H-04) y NG8113 preexistentes.
