# Auditoria de Cierre - Reclutamiento / Candidates

Fecha: `2026-08-09`
Modulo: `Reclutamiento / Candidates`
Frontend auditado: `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates`
Backend auditado: `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates`
Plan de origen: `docs/plans/20260809-reclutamiento-candidatos-remediacion-plan.md`
Estado formal: `Cierre de remediacion completado`

## Resumen ejecutivo

La remediacion del modulo `Candidates` quedó cerrada en cuatro fases:
navegacion, postulacion/notificaciones, agenda operativa y KPIs con
automatizacion. El modulo ya no presenta hallazgos criticos o altos dentro del
alcance trabajado y queda apto para evolucionar bajo un ciclo v2 mas acotado.

La auditoria de cierre confirma que la experiencia de Reclutamiento quedó
ordenada alrededor de dos capas:

- `Solicitudes` como fuente de demanda
- `Candidates` como fuente operativa del pipeline

Tambien confirma que el backend ya soporta notificaciones automáticas al
registrar nuevas postulaciones y que Reclutamiento cuenta con agenda e
indicadores iniciales para seguimiento diario.

## Verificaciones de cierre

### 1. Navegacion y organizacion funcional

- `Vacantes` se mantiene como bandeja de demanda
- el tab `Candidatos` fue retirado de `Solicitudes`
- existe CTA visible hacia el listado de candidatos
- las acciones inline en vacantes se limitan a contexto operativo

**Resultado:** `PASS`

### 2. Postulacion end-to-end

- desde `Vacantes` se puede crear o editar postulacion
- la vacante asociada queda controlada desde el formulario inline
- la postulacion aparece correctamente en `Candidates > Applications`
- el CV conserva o reemplaza el archivo segun el flujo ejecutado

**Resultado:** `PASS`

### 3. Notificaciones

- el evento de nueva postulacion dispara aviso a `Administrador`,
  `GerenteOperaciones` y `GerenteAtencion`
- el correo contiene candidato, vacante, puesto, cliente, fecha y contexto
- la notificacion in-app / SignalR quedó validada en el alcance reportado

**Resultado:** `PASS`

### 4. Agenda operativa

- la agenda muestra estados operativos claros
- existe acceso desde Vacantes y enlace cruzado con entrevistas
- los casos `missing_interviewer`, `pending_schedule`, `scheduled`, `overdue`
  y `feedback` quedaron modelados y visibles

**Resultado:** `PASS`

### 5. KPIs y automatizacion operativa

- existe endpoint de KPIs y vista dedicada
- la automatizacion diaria se puede disparar manualmente en local
- los quick wins y limitaciones quedaron documentados

**Resultado:** `PASS con gaps residuales`

## Gaps residuales

### Gap 1. KPI por fuente

**Severidad:** `Media`

El KPI `por fuente` sigue sin datos porque la entidad persistida de vacantes no
guarda de forma confiable la fuente como dato consultable para agregacion.

**Impacto**

- no hay comparativo real por canal de reclutamiento
- el dashboard queda funcional pero incompleto en analítica de origen

**Recomendacion**

Abrir cambio acotado de datos y backend para persistir `Fuente` en la entidad
oficial y proyectarla a KPIs.

### Gap 2. KPI vacante -> primera postulacion

**Severidad:** `Media`

No quedó implementado el cálculo de tiempo entre apertura de vacante y primera
postulación.

**Impacto**

- Reclutamiento no puede medir SLA de respuesta inicial
- se dificulta detectar vacantes envejecidas sin atracción de candidatos

**Recomendacion**

Agregar query dedicada sobre `RequestPosition.CreatedAt` y primer registro de
`CandidateApplication`.

### Gap 3. Runtime de automatizacion en Development

**Severidad:** `Baja`

Hangfire no corre automáticamente en `Development`, por lo que el seguimiento
diario no se observa de forma nativa en local.

**Impacto**

- testing local menos representativo
- dependencia del trigger manual para smoke técnico

**Recomendacion**

Definir estrategia explícita para local:

- habilitar job server en desarrollo, o
- mantener trigger manual como patrón oficial de smoke

## Hallazgos cerrados

- carga base de `candidate/*` con `standalone`
- tipado del estado de candidatos
- referencias legacy a `client/luxuryapp`
- visibilidad del puesto en `Altas`
- gestion inline de postulacion desde `Vacantes`
- notificacion automatica por nueva postulacion
- agenda operativa de Reclutamiento
- tablero inicial de KPIs

## Riesgo residual

El riesgo principal ya no es técnico sino de alcance: reabrir `Candidates` con
features grandes sin mantener la separación entre demanda y pipeline o sin
acotar el siguiente ciclo a gaps medibles.

## Decision recomendada

Cerrar formalmente la remediacion `20260809` y abrir un `Plan v2` solo para:

1. KPI `por fuente`
2. KPI `vacante -> primera postulacion`
3. estrategia de automatizacion observable en `Development`

## Criterio de cierre

Con base en la evidencia documentada el modulo `Reclutamiento / Candidates`
queda:

- `Cerrado` para remediacion fase 1-4
- `Listo` para evolucion controlada
- `Pendiente` solo de mejoras v2 no bloqueantes
