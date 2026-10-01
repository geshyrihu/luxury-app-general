# CHECKLIST DE PRUEBAS - Reclutamiento > Candidates (funcional)

**Basado en:** `04-plan-implementacion.md` + `02-fase-0-analisis-reglas.md`
**Alcance:** R-01 (aprobado), R-02, R-03

---

## Pruebas Funcionales

### R-01 — Fuente de Candidato
- [ ] Crear candidato con `RecruitmentSource = Internal` → se persiste.
- [ ] Crear candidato con `RecruitmentSource = External` → se persiste.
- [ ] Editar candidato refleja la fuente en el formulario (`onLoadData` patch).
- [ ] `onSubmit` envía `RecruitmentSource` como `FormData` (multipart).
- [ ] El selector de fuente usa `EnumSelectService.fuenteReclutamiento()` (hub), NO enum local.

### R-02 — Alta de Empleado
- [ ] Alta distribuye nombres → `PersonData`/`ApplicationUser`.
- [ ] Alta distribuye dirección → `Address`.
- [ ] Alta distribuye bancarios → `EmployeeBankData`.
- [ ] Alta distribuye salud → `EmployeeClinicalData`.
- [ ] Alta distribuye emergencia/beneficiario → `EmployeeEmergencyContact` (flag beneficiario).
- [ ] `WorkPosition.TurnoTrabajo` se setea desde `ShiftType` (hub `turno-trabajo`).
- [ ] `Candidate.RecruitmentSource` se copia a `RequestEmployeeRegister.Fuente`.
- [ ] Distribución ocurre en transacción atómica (rollback ante fallo).

### R-03 — Documentación de Contratación
- [ ] Subir documento de contratación (multipart) → 200 (sin 415).
- [ ] Listar documentos por empleado.
- [ ] Validar documento (`IsValidated`, `ValidatedByUserId`, `ValidationNotes`).
- [ ] CV del candidato sigue en `Candidate` (NO en `EmployeeDocument`).

---

## Pruebas de Seguridad

- [ ] RRHH solo puede editar candidato / procesar alta.
- [ ] Entrevistador NO puede editar candidato ni procesar alta.
- [ ] Validador de documentos solo valida (post-alta).
- [ ] Permisos por roles/claims (NO por flag de tipo en usuario).
- [ ] Rutas de candidates con guard por rol coherente con backend.

---

## Pruebas de Rendimiento

- [ ] `ng build` de `reclutamiento.luxuryapp` sin errores.
- [ ] `dotnet build` del módulo Candidates sin errores.
- [ ] Subida de documento responde sin timeout (multipart).

---

## Pruebas de Convenciones (OBLIGATORIAS)

### Backend
- [ ] DTOs: 1 archivo = 1 DTO (cada nuevo DTO en su archivo).
- [ ] Enums: `[Display(Name=...)]` en español.
- [ ] Enums van al hub `SelectItemEnum` (NO endpoint local, NO modificar `DocumentType` existente).
- [ ] Endpoints multipart usan `[FromForm]` + `DisableAntiforgery()`.

### Frontend
- [ ] Componentes standalone + `ChangeDetectionStrategy.OnPush`.
- [ ] Usa signals/computed (NO `BehaviorSubject`).
- [ ] Tokens CSS (NO hex/px literales).
- [ ] Tipos en `interfaces/` con sufijos `.interface.ts`/`.dto.ts`; sin prefijo `I`; `Dto` no `DTO`.
- [ ] Navegación por constantes (NO rutas hardcodeadas).
- [ ] Sin `confirm()`/`alert()` nativos (usar `DialogHandlerService`).
- [ ] `npm run audit:icon-names` sin nuevos hallazgos.
- [ ] `node scripts/scan-mojibake.mjs client/luxuryapp` → 0 mojibake.

### Cierre
- [ ] Re-auditoría: 0 críticos y 0 altos en el feature.
- [ ] `npm run lint` sin violaciones nuevas.
