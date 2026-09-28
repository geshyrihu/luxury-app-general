# FASE 0 - ANÁLISIS DE REGLAS DE NEGOCIO

# Reclutamiento > Candidates (extensión funcional)

**Fecha:** 2026-08-14
**Versión:** 1.0
**Estado:** EN REVISIÓN (pendiente aprobación Tech Lead)
**Tipo de trabajo:** B (Ampliar módulo existente)
**Basado en:** `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/nueva-estructuraV2.md`

---

## 📁 RUTAS DEL MÓDULO

| Capa              | Ruta                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| **Backend**       | `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/` |
| **Frontend**      | `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/`     |
| **Documentación** | `docs/modulos-existente/reclutamiento-candidatos/`                    |

---

## 🎯 OBJETIVO

Agregar tres capacidades al módulo de Candidatos sin duplicar entidades:
- **R-01** — Fuente de reclutamiento (`RecruitmentSource`) en el candidato (pre-alta).
- **R-02** — Orquestar el alta de empleado: capturar los datos del "proceso de alta" y
  distribuirlos a las entidades empleado existentes vía `RequestEmployeeRegister` como orquestador.
- **R-03** — Documentación de contratación en el expediente del Empleado (`EmployeeDocument`),
  con validación, post-alta.

> NOTA: Existe en paralelo un **plan de remediación de convenciones**
> (`../../../docs/RecruitmentLuxuryApp/Candidates/20260813-remediacion-recruitment-candidates.md`) para la deuda detectada
> en la auditoría. Este documento NO lo repite: cubre solo la nueva funcionalidad. El código
> nuevo debe cumplir las mismas convenciones que ese plan remedia.

---

## 📌 PROBLEMA QUE RESUELVE

Hoy el candidato no registra de dónde viene (Interno/Externo); el alta de empleado solo crea
un esqueleto (`PersonData`/`Address` vacíos) y no distribuye bancarios, clínicos,
emergencia/beneficiario, ni turno, ni documentos de contratación. Se requiere capturar estos
datos en el proceso de alta y persistirlos en las entidades correspondientes, reusando lo que ya
existe (no crear entidades nuevas salvo los GAPs documentados).

---

## 📊 QUÉ ESPERAMOS LOGRAR (KPIs)

| Métrica                       | Baseline            | Meta                | Plazo   | Verificación                        |
| ----------------------------- | ------------------- | ------------------- | ------- | ----------------------------------- |
| Candidatos con fuente registrada | 0% (no existe)   | 100% en alta        | Fase 1  | Conteo en BD `Candidate.Source`     |
| Datos de alta completos       | Esqueleto vacío     | 100% distribuido    | Fase 2  | Auditoría de `PersonData`/etc.      |
| Documentos de contratación    | Manual / inexistente | 100% con validación | Fase 3  | Conteo `EmployeeDocument.IsValidated` |

---

## 👤 USUARIOS Y ROLES

| Rol                        | Qué puede hacer                                              | Lo que NO puede hacer          | Se basa en rol existente |
| -------------------------- | ----------------------------------------------------------- | ------------------------------ | ------------------------ |
| Reclutador / RRHH          | Crear/editar candidato, postular, pre-filtrar, procesar alta, cargar docs | Validar docs, cambiar catálogos | ✅ |
| Entrevistador (Filtro 2)  | Responder entrevista (decisión + comentario)                | Cualquier alta/edición         | ✅ |
| Validador de Documentos    | Validar documentos de contratación                          | Editar candidato/alta          | ✅ |
| Admin                      | Gestionar catálogos (fuente, turno, docs)                   | —                              | ✅ |

**Roles existentes a usar:** `FuenteReclutamiento` (hub `fuente-reclutamiento`), `TurnoTrabajo`
(hub `turno-trabajo`), `CandidateDecision` (hub `candidate-decision`).
**Roles nuevos a crear:** ninguno.

---

## 📋 REGLAS DE NEGOCIO (4 NIVELES JERÁRQUICOS)

### Nivel 1: Invariantes de Dominio (NUNCA cambian)

| ID           | Regla                                                                 | Justificación                                |
| ------------ | --------------------------------------------------------------------- | -------------------------------------------- |
| RN-CAND-100  | El candidato es entidad aislada hasta el alta; no comparte `Employee` | Multi-tenant por `CustomerId` + `EmployeeId` |
| RN-CAND-101  | `RecruitmentSource` vive solo en `Candidate`; el alta lo copia a `RequestEmployeeRegister.Fuente` | Fuente de verdad pre-alta es el candidato    |
| RN-CAND-102  | El alta NO usa `TypePerson` en `ApplicationUser`                    | Una persona puede ser empleado A y candidato B a la vez |

### Nivel 2: Flujo y Estados

| ID           | Estado            | Transición válida a        | Quién la ejecuta |
| ------------ | ----------------- | -------------------------- | ---------------- |
| RN-CAND-110  | `Seleccionado`    | → `AltaEnProceso` (alta)   | RRHH             |
| RN-CAND-111  | `AltaEnProceso`   | → `Contratado` (docs OK)   | Validador        |

### Nivel 3: Seguridad y Autorización (RBAC)

| ID           | Regla                                  | Roles autorizados      | Restricciones            |
| ------------ | --------------------------------------- | ---------------------- | ------------------------ |
| RN-CAND-120  | Editar candidato                        | RRHH, Admin            | —                        |
| RN-CAND-121  | Procesar alta (solo en `Seleccionado`)  | RRHH                   | Estado `Seleccionado`    |
| RN-CAND-122  | Validar documentos                      | Validador Documentos   | Post-alta                |

### Nivel 4: Validaciones de Datos

| Campo            | Obligatorio | Formato / Regla                | Ejemplo válido     |
| ---------------- | ----------- | ------------------------------ | ------------------ |
| RecruitmentSource| Sí (alta)   | Enum `FuenteReclutamiento`     | `Internal` / `External` |
| NSS / RFC / CURP | Sí          | Formatos oficiales MX          | heredados a `PersonData` |
| Clabe            | Sí (bancarios) | 18 dígitos                   | `012345678901234567` |

---

## 🔄 FLUJOS PRINCIPALES

### Camino Feliz
1. RRHH crea/edita candidato incluyendo `RecruitmentSource` (R-01).
2. Postula a vacante → etapa `Nuevo`.
3. Pre-filtro → entrevista → decisión → `Seleccionado`.
4. RRHH procesa alta (R-02): esqueleto + distribución real a entidades.
5. Carga documentos de contratación (R-03) → validados → `Contratado`.

### Caminos Tristes / Borde
- Alta con datos incompletos → validación por campo; el orquestador persiste lo que tiene.
- `NoSePresento` → reagenda (requiere definir aprobación, ver L.6.1).
- Misma persona candidato en B siendo empleado en A → usuarios separados por `CustomerId`.

---

## ⚠️ PRE-MORTEM

| Supuesto fallido                         | Impacto                          | Prob.   | Mitigación                                  |
| ---------------------------------------- | -------------------------------- | ------- | ------------------------------------------- |
| Se mezcla `TypePerson` en `ApplicationUser` | Inconsistencia multi-edificio | Alta    | No agregar `TypePerson` (RN-CAND-102)        |
| El orquestador de alta no es transaccional | Datos parciales持久            | Media   | Envolver distribución en transacción atómica |
| Se rompe `DocumentType` del hub          | Otros módulos pierden listados   | Alta    | Crear `RecruitmentDocumentType` nuevo (no reusar) |

---

## 🔗 INTEGRACIONES

| Módulo / Sistema | Qué intercambia                          | Qué pasa si falla              |
| ---------------- | ---------------------------------------- | ------------------------------ |
| `RequestEmployeeRegister` | Folio, Fuente, datos de alta     | Alta no procede (transacción)  |
| Hub `SelectItemEnum` | Enums fuente/turno/decision/docs    | Selectores caen; no hardcode   |
| `EmployeeDocument` / `IFileWritePathService` | Archivos de contrato      | Reintento / mensaje de error    |

---

## 🔄 ANÁLISIS DE ESTADO ACTUAL (Tipo B)

### Entidades existentes que se modifican
| Entidad | Cambio | Impacto |
| ------- | ------ | ------- |
| `Candidate` | +`RecruitmentSource` | Pre-alta |
| `CandidateCreateOrUpdateDto` | +`RecruitmentSource` | API alta candidato |
| `RequestEmployeeRegister` (orquestador) | recibe distribución real | Alta empleado |

### Nuevas entidades a crear
| Entidad | Propósito | Relación |
| ------- | --------- | -------- |
| `EmployeeDocument` | Expediente de contratación del empleado | 1 `Employee` ──< N `EmployeeDocument` |
| `RecruitmentDocumentType` (enum hub) | Tipos de documento de contratación | ~17 tipos |

---

## 🔍 GAPS Y DECISIONES ABIERTAS (RESUELTAS)

| ID  | Gap / Decisión | Resolución |
| --- | ------------- | ---------- |
| D1  | ¿Dónde vive `RecruitmentSource`? | Solo en `Candidate`; el alta copia a `Fuente`. ✅ |
| D2  | Origen de nombres | Se copian de `Candidate`→`ApplicationUser`→`PersonData`; candidato aislado. ✅ |
| D3  | Beneficiario | Reusar `EmployeeEmergencyContact` (flag). Sin entidad nueva. ✅ |
| D4  | Orquestador de alta | `RequestEmployeeRegister` distribuye a entidades. ✅ |
| D5  | Documentación | Versión con validación (`EmployeeDocument`). ✅ |
| D6  | Renombres `RecruitmentCandidate*` | Aprobar en principio; fase de migración aparte (no mezclar con R-01..R-03). ✅ |

---

## ✅ VALIDACIÓN DE CONVENCIONES

| Convención                          | Estado | Nota |
| ----------------------------------- | ------ | ---- |
| CONVENTIONS.md leído                | ✅     |      |
| Backend Rules aplicadas             | ⏳     | Parte de Fase 2/3 |
| Frontend Rules aplicadas            | ⏳     | Ver remediation plan |
| UI Rules aplicadas                  | ⏳     |      |
| Styles Rules aplicadas              | ⏳     |      |
| Naming Conventions aplicadas        | ✅     | 1 DTO/archivo, sin `I`, `Dto` no `DTO` |
| Structure Conventions aplicadas     | ✅     | tipos en `interfaces/` |
| Roles existen en catálogo           | ✅     | `FuenteReclutamiento`, `TurnoTrabajo` ya en hub |
| Enums van al hub `SelectItemEnum`   | ✅     | reusar rutas existentes; crear `recruitment-document-type` |
| DTOs 1 archivo = 1 DTO              | ✅     | cada nuevo DTO en su archivo |
| Documentos usan patrones seguros    | ⏳     | `IFileReadPathService`/`IFileWritePathService` |
| Cambios importantes tienen plan     | ✅     | este documento + remediation plan |

---

## ESTADO DE ESTA FASE 0

- [x] Problem Statement aprobado
- [x] KPIs aprobados
- [x] Roles y permisos aprobados
- [x] Reglas de Negocio (4 niveles) aprobadas
- [x] Flujos (Feliz/Triste/Borde) aprobados
- [x] Pre-Mortem aprobado
- [x] Integraciones aprobadas
- [x] Gaps y Decisiones resueltos
- [x] Validación de convenciones completada
