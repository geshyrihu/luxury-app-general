# CRITERIOS DE APROBACIÓN - Reclutamiento > Candidates (funcional)

**Basado en:** `04-plan-implementacion.md`

---

## FASE 1 — R-01 Fuente de Candidato ✅ APROBADO PARA CODIFICAR

- [x] Backend `Candidate` + `RecruitmentSource` (enum `FuenteReclutamiento`).
- [x] `CandidateCreateOrUpdateDto` + `RecruitmentSource`.
- [x] Frontend `candidate-form.interface.ts`: `CandidateFormGroup` + `recruitmentSource: FormControl<number | null>`.
- [x] Frontend `candidate-form.ts`: carga opciones vía `EnumSelectService.fuenteReclutamiento()`, selector en HTML, `onSubmit` append, `onLoadData` patch.
- [x] Frontend `candidate.dto.ts`: `CandidateAddOrEdit` / `CandidateDetail` + `recruitmentSource?`.
- [x] Valor viaja como `FormData` multipart coherente con `[FromForm]`.
- [x] `ng build` + spec de form sin regresiones.

**Criterio de PASO:** candidato se crea/edita con fuente; reusa hub (NO enum local ni endpoint propio).

---

## FASE 2 — R-02 Alta de Empleado ✅ COMPLETADO (2026-08-15)

- [x] `SolicitudAltaCompletaDto` / `CandidateApplicationProcessHiringDto` con campos R-02 (1 archivo=1 DTO).
- [x] `ResolveOrCreateEmployeeIdAsync` popula `PersonData`, `Address`, `EmployeeBankData`, `EmployeeClinicalData`, `EmployeeEmergencyContact`.
- [x] `ProcessHiringAsync` set `WorkPosition.TurnoTrabajo` (hub `turno-trabajo`) y copia `Candidate.RecruitmentSource` → `Fuente`.
- [x] `OnSolicitudAltaAsync` persiste distribución real.
- [x] Distribución en transacción atómica (`BeginTransactionAsync`).
- [x] `dotnet build` OK.

---

## FASE 3 — R-03 Documentación de Contratación ✅ COMPLETADO (2026-08-15)

- [x] Enum `RecruitmentDocumentType` (~17 tipos) + ruta hub `recruitment-document-type` (NO modificar `DocumentType`).
- [x] Entidad `EmployeeDocument` (1 empleado → N documentos) + `DbSet`/mapeo único `EmployeeId`+`DocumentTypeId`.
- [x] Métodos de subir/listar/validar en `CandidateProcessAppService` (`UploadHiringDocumentAsync`, `GetHiringDocumentsAsync`, `ValidateHiringDocumentAsync`).
- [x] Endpoints multipart `POST {id}/hiring-documents`, `GET`, `POST {documentId}/validate` con `[FromForm]`+`DisableAntiforgery`.
- [x] Reuso de `candidate-cv-upload` para carga (CV sigue separado del expediente).

---

## FASE 4 — Pruebas y Despliegue ✅ COMPLETADO (2026-08-15)

- [x] Migración EF `AddEmployeeDocument` generada y reversible (incluye pendientes de R-01/R-02 + R-03; sin drift de otros módulos).
- [x] `dotnet build api/LuxuryApp.sln` 0 errores.
- [x] `ng build --configuration development` sin errores nuevos de R.
- [x] Mojibake 0 (`client/angular`).
- [x] `audit:icon-names` 0 hallazgos nuevos.
- [x] Specs de `candidates/` 8/8 verdes.

---

## FASE 5 — Verificación global y cierre ✅ COMPLETADO (2026-08-15)

- [x] `npm run build` (prod) sin errores nuevos de R (solo NG8113 preexistentes).
- [x] `npm run lint` (cadena de auditoría) sin hallazgos nuevos en archivos de R.
- [x] Mojibake 0 (`client/angular`).
- [x] `dotnet build api/LuxuryApp.sln` 0 errores.
- [x] Specs de `candidates/` 20/20 verdes (`candidate-form`, `candidate-detail`, `candidate-list-desktop`, `candidate-list-mobile`).
- [x] Migración `AddEmployeeDocument` cubre R-01 + R-02 + R-03 y es reversible.
- [x] `candidate-list-mobile.spec.ts` parcheado (fuera de alcance R): `provideRouter([])` en el `TestBed`; 6/6 verde. Regresiones globales preexistentes en otros módulos (charts, image-analysis-dialog, supplier, mantenimiento, operations, legal, admin, recursos-humanos) — deuda externa no atribuible a R.

## MÓDULO COMPLETO — COMPLETADO

- [x] R-01/R-02/R-03 funcionan extremo a extremo.
- [x] Cumple todas las convenciones de `05-checklist-pruebas.md`.
- [x] `dotnet build` + `ng build` sin errores nuevos de R (solo NG8113 preexistentes fuera de R).
- [x] Re-auditoría 0 críticos / 0 altos.
