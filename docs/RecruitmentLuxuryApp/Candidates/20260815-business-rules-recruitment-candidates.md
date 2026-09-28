# 02 - Business Rules Analysis

## Problem Statement

Actualmente, Reclutamiento sufre de un modelo de datos y una experiencia operativa fragmentados cuando intenta registrar candidatos, postularlos, agendar entrevistas y continuar a contratación, lo que resulta en lógica rígida, UI confusa y dificultad para escalar el proceso real.

Esto afecta a Reclutamiento, entrevistadores y áreas operativas porque hoy el proceso mezcla agenda, resultado e historial dentro de estructuras que no representan correctamente el dominio.

## KPIs

| Métrica | Baseline | Target | Timeline | Verificación |
|:---|:---|:---|:---|:---|
| Registro candidato + entrevista inicial | 2-3 pasos separados | 1 flujo unificado | Fase 4 | Smoke test funcional |
| Cobertura de vacantes con candidatos visibles | Parcial | 100% | Fase 5 | Validación en `recruitment-interviews` |
| Soporte múltiples entrevistas | No soportado formalmente | 100% | Fase 3 | BD + endpoints |
| Trazabilidad de cancelación y reagenda | Parcial | 100% | Fase 5 | Historial y UI |
| Experiencia laboral estructurada | 0% | 100% candidato nuevo | Fase 4 | CRUD + listados |

## Matriz de Reglas de Negocio

### RN-RCAND-001 [Nivel 1: Invariante de Dominio]

El candidato es una ficha maestra reutilizable y no debe duplicarse como empleado.

### RN-RCAND-002 [Nivel 1: Invariante de Dominio]

La postulación es la relación operativa entre candidato y vacante; no debe absorber el ciclo completo de entrevistas.

### RN-RCAND-003 [Nivel 1: Invariante de Dominio]

La entrevista es una entidad independiente que debe soportar historial, reagenda, cancelación y resultado.

### RN-RCAND-004 [Nivel 1: Invariante de Dominio]

La experiencia laboral del candidato debe ser estructurada por empresa, puesto, período y sueldo.

### RN-RCAND-005 [Nivel 2: Flujo y Estados]

Flujo base de Reclutamiento:

`Candidato registrado -> Postulación creada -> Entrevista creada -> Entrevista respondida -> Seleccionado/Rechazado/No asistió -> Alta en proceso`

### RN-RCAND-006 [Nivel 2: Flujo y Estados]

Una postulación puede tener múltiples entrevistas, pero solo una entrevista activa por etapa/tipo al mismo tiempo.

### RN-RCAND-007 [Nivel 2: Flujo y Estados]

Una cita puede pasar por:

`Enviada -> PendienteConfirmacion -> Confirmada -> Finalizada`

o por variantes:

`Enviada -> SolicitudCambio -> Confirmada`

`Enviada -> Cancelada`

`Confirmada -> NoSePresento`

### RN-RCAND-008 [Nivel 2: Flujo y Estados]

La aprobación de entrevista final debe detonar transición de postulación, bloqueo operativo de vacante y proceso de alta.

### RN-RCAND-009 [Nivel 3: Seguridad/Autorización]

Roles autorizados a gestionar el flujo de Reclutamiento:

- `Reclutamiento`
- `Administrador`
- `RecursosHumanos`
- `SuperUsuario`

### RN-RCAND-010 [Nivel 3: Seguridad/Autorización]

Roles autorizados a responder entrevistas según asignación:

- `Administrador`
- `GerenteOperaciones`
- `GerenteAtencion`
- `GerenteMantenimiento`
- roles definidos por matriz de entrevistadores

### RN-RCAND-011 [Nivel 3: Seguridad/Autorización]

Las notificaciones de nueva postulación / nueva entrevista / escalación deben llegar al grupo operativo configurado.

### RN-RCAND-012 [Nivel 4: Validación de Datos]

La fecha de registro de la postulación se autogenera; no debe depender de captura manual.

### RN-RCAND-013 [Nivel 4: Validación de Datos]

La fecha y hora de entrevista debe almacenarse con precisión completa `DateTime`.

### RN-RCAND-014 [Nivel 4: Validación de Datos]

La eliminación física de entrevistas históricas no es válida; solo cancelación lógica con trazabilidad.

### RN-RCAND-015 [Nivel 4: Validación de Datos]

El índice único `(CandidateId, RequestPositionId)` puede relajarse solo si dominio impide más de una postulación activa abierta por vacante.

## Pre-Mortem

| Supuesto fallido | Impacto | Probabilidad | Mitigación |
|:---|:---|:---|:---|
| Se elimina agenda legacy sin migrar frontend | Alto | Alta | Fases de reemplazo coordinado |
| Se rompe visibilidad de candidatos por vacante | Alto | Alta | Validación con datos reales por customer activo |
| Se mezcla nuevamente UI de Reclutamiento y entrevistador | Medio | Alta | Rutas y componentes separados |
| Se permiten múltiples postulaciones activas simultáneas | Alto | Media | Regla de dominio + validaciones DB |
| Se pierde histórico de feedback | Alto | Media | Migración desde feedback legacy a resultado de entrevista |

## Flujos Críticos

### Happy Path

1. Registrar candidato
2. Cargar CV
3. Seleccionar vacante
4. Crear entrevista
5. Notificar
6. Responder
7. Aprobar o rechazar

### Sad Path

1. Cita enviada
2. Entrevistador no confirma
3. Reclutamiento reagenda o cancela
4. Sistema conserva historial

### Edge Path

1. Candidato histórico vuelve a una vacante previa
2. Sistema crea nueva postulación histórica
3. No rompe analytics ni vacante activa
