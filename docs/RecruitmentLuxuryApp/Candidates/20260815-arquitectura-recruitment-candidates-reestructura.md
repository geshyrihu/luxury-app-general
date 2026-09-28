# 03 - Preliminary Architecture

## Dictamen

La reestructuración propuesta es correcta como arquitectura objetivo. El problema principal del estado actual no es funcional sino de modelado: la entrevista está embebida en la postulación y el feedback mezcla evento con resultado.

## Modelo Actual Simplificado

- `Candidate`: ficha maestra del candidato
- `CandidateApplication`: postulación + fecha de postulación + agenda embebida
- `CandidateInterviewFeedback`: respuesta del entrevistador + parte de agenda

## Modelo Objetivo

- `Candidate` (Candidato)
- `CandidateWorkExperience` (ExperienciaLaboralCandidato)
- `CandidateApplication` (PostulacionCandidato)
- `CandidateInterview` (CitaEntrevistaCandidato)
- `CandidateInterviewResult` (ResultadoEntrevistaCandidato)
- `InterviewerMatrix` (MatrizEntrevistadores)
- `RequestEmployeeRegisterFile` (DocumentoAltaEmpleado)

## Entidades Explicadas en Español

### 1. Candidato

Representa la ficha maestra de una persona candidata. Guarda identidad, contacto, dirección, expectativa salarial, fuente, notas y banderas de base de talento.

### 2. Experiencia Laboral del Candidato

Representa cada empleo previo del candidato. Debe guardar:

- Empresa
- Puesto
- Fecha inicio
- Fecha fin
- Sueldo neto mensual
- Motivo de salida

### 3. Postulación del Candidato

Representa la relación entre candidato y vacante. Debe guardar:

- Candidato
- Vacante
- Fecha de registro
- CV asociado
- Etapa actual
- Última decisión
- Estado de cierre

No debe seguir siendo la dueña de la agenda de entrevistas.

### 4. Cita / Entrevista del Candidato

Representa un evento concreto de entrevista. Debe guardar:

- Postulación
- Tipo de entrevista
- Entrevistador asignado
- Fecha y hora programada
- Estado de la cita
- Estado del acuerdo de agenda
- Propuesta de reagenda
- Confirmación
- Cancelación / cierre
- Notas

### 5. Resultado de Entrevista

Representa el cierre evaluativo de una cita. Debe guardar:

- Entrevista
- Decisión
- Motivo
- Comentario
- Fecha de evaluación
- Usuario que evaluó

### 6. Matriz de Entrevistadores

Representa la regla por customer y rol del puesto para decidir a quién notificar o asignar como entrevistador.

### 7. Documento de Alta

Representa cada documento requerido durante la contratación y su validación.

## Decisiones Arquitectónicas

### AD-01

Las entrevistas dejan de vivir en `CandidateApplication`.

### AD-02

La experiencia laboral deja de ser un `nvarchar(max)` libre.

### AD-03

El frontend de Reclutamiento se reorganiza por responsabilidades:

- candidatos
- postulaciones
- entrevistas de reclutamiento
- agenda reclutamiento
- detalle por puesto
- alta documental

### AD-04

Las vistas del entrevistador quedan desacopladas del flujo principal de Reclutamiento.

### AD-05

Los correos, notificaciones in-app y OneSignal deben apuntar a rutas de detalle por puesto o por entrevista según actor.

## Componentes Objetivo

### Reclutamiento

- Lista de candidatos
- Modal de alta de candidato
- Modal de asignación a vacante + entrevista inicial
- Bandeja de postulaciones
- Tablero de entrevistas de reclutamiento
- Agenda operativa
- Detalle por puesto y candidatos
- KPI y automatizaciones

### Entrevistador

- Cola personal de entrevistas
- Vista de respuesta de entrevista

## Riesgos Técnicos

- Ruptura de DTOs actuales
- Ruptura de KPIs si siguen leyendo columnas legacy
- Ruptura de notificaciones si no se actualizan URLs
- Inconsistencias de migración histórica
