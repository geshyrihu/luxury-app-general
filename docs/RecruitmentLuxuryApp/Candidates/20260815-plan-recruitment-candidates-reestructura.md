# Plan de Implementación - Reestructuración Reclutamiento Candidates

## Metadata

- Fecha: 2026-08-11
- Tipo: Plan técnico de cambio mayor + migración de dominio
- Módulo: Reclutamiento Candidates
- Origen: Necesidad funcional validada + estado actual del módulo + propuesta `data.txt`
- Responsable de ejecución técnica: Tech Lead + agente ejecutor

## 1. Resumen Ejecutivo

Actualmente, Reclutamiento sufre de un flujo fragmentado cuando intenta registrar candidatos, asignarlos a vacantes, agendar entrevistas y continuar a contratación, lo que resulta en una mezcla de responsabilidades entre postulación, agenda y feedback.

La reestructuración transforma el módulo para que la entrevista sea una entidad propia, la experiencia laboral sea estructurada y el proceso de alta documental quede preparado como continuación natural del pipeline.

El cambio se aprueba como reestructuración integral. Dado que seguimos en desarrollo, se privilegia limpieza de dominio sobre compatibilidad backward extensa, pero aun así se ejecutará por fases para mantener verificabilidad técnica y funcional.

## 2. Objetivo

Rediseñar el módulo Candidates para que refleje correctamente el dominio de Reclutamiento:

- candidato como ficha maestra
- experiencia laboral estructurada
- postulación como relación con vacante
- entrevista como cita independiente
- resultado como cierre evaluativo
- alta documental como continuación formal del flujo

## 3. Alcance

### Incluye

- Backend: entidades, DTOs, mappings, servicios, endpoints, migraciones y notificaciones
- Frontend: formularios, bandejas, agenda, tablero de entrevistas, detalle por puesto, rutas y UX
- Corrección de emails / notificaciones / deep links
- Revisión de KPIs y automatizaciones
- Ajuste de reglas de dominio para re-postulaciones históricas

### Excluye

- Producción
- Integraciones externas nuevas no relacionadas con Candidates
- Rediseño completo del módulo de Staff Board

## 4. Restricciones

- Fuente de verdad frontend: `client/angular`
- No mezclar más componentes de Reclutamiento con componentes exclusivos de entrevistador
- Toda migración de datos debe documentarse
- No se toca shared transversal sin análisis explícito
- Deben respetarse naming, DTOs y estructura documental oficiales

## 5. FASE 0 - Base de Control

### 5.1 KPIs de salida

| KPI | Baseline | Target | Fase |
|:---|:---|:---|:---|
| Registro candidato + entrevista en un flujo | Parcial | Completo | Fase 4 |
| Visibilidad de candidatos por vacante | Inconsistente | 100% | Fase 5 |
| Soporte múltiples entrevistas | No formal | 100% | Fase 3 |
| Reagenda/cancelación con trazabilidad | Parcial | 100% | Fase 5 |
| Historial de candidatos por puesto | Parcial | 100% | Fase 5 |

### 5.2 Reglas rectoras

Aplican las RN `RN-RCAND-001` a `RN-RCAND-015` del análisis de negocio.

### 5.3 Flujos que deben pasar

- Happy path completo de Reclutamiento
- Reagendar entrevista
- Cancelar entrevista
- Rechazar con motivo
- Aprobar y mandar a alta
- Ver histórico por puesto
- Re-postulación histórica controlada

## 6. Diseño Técnico Objetivo

### 6.1 Entidades objetivo

#### `Candidate`

Agregar:

- `IsInTalentPool`
- `TalentPoolNotes`

Mantener:

- Datos personales
- Fuente
- Notas generales

Mover fuera:

- `ExperienceSummary` deja de ser la fuente principal y queda deprecated hasta retirar

#### `CandidateWorkExperience`

Tabla hija del candidato para experiencia laboral estructurada.

#### `CandidateApplication`

Mantener:

- `CandidateId`
- `RequestPositionId`
- `CvFileName`
- `ApplicationDate`
- `CurrentStage`
- `ClosedAt`
- `LastDecision*`

Eliminar al final:

- `RecruitmentInterviewAt`
- `OperationsInterviewAt`
- `OperationsInterviewAssignedToUserId`

#### `CandidateInterview`

Nueva fuente de verdad para citas.

#### `CandidateInterviewResult`

Nueva fuente de verdad para decisiones de entrevistas.

#### `InterviewerMatrix`

Matriz de asignación por customer y rol de puesto.

#### `RequestEmployeeRegisterFile`

Checklist documental de alta.

### 6.2 Rutas frontend objetivo

#### Reclutamiento

- `/recruitment/candidates/candidates`
- `/recruitment/candidates/applications`
- `/recruitment/candidates/recruitment-interviews`
- `/recruitment/candidates/recruitment-agenda`
- `/recruitment/candidates/work-position/:workPositionId/candidates`
- `/recruitment/candidates/kpis`

#### Entrevistador

- `/recruitment/candidates/interviews`
- `/recruitment/candidates/interviews/respond`

### 6.3 Regla UX objetivo

- Desde lista de candidatos: crear candidato, cargar CV y asignar vacante/entrevista inicial.
- Desde lista de vacantes: abrir flujo directo “Agregar candidato y entrevista”.
- En columna candidatos de vacantes: usar icono/CTA hacia detalle por puesto, no nombre plano.
- Desde detalle por puesto: ver activos e histórico.

## 7. Fases de Ejecución

### Fase 1 - Saneamiento Base y Congelamiento de Legacy

Objetivo:

- Congelar el modelo actual
- Marcar campos legacy
- Identificar puntos exactos de lectura/escritura

Checklist:

- [ ] Identificar todos los usos de `RecruitmentInterviewAt`
- [ ] Identificar todos los usos de `OperationsInterviewAt`
- [ ] Identificar todos los usos de `OperationsInterviewAssignedToUserId`
- [ ] Identificar todos los usos de `CandidateInterviewFeedback`
- [ ] Inventariar endpoints, DTOs y componentes impactados
- [ ] Congelar cambios funcionales fuera de este plan

Criterio de paso:

- Mapa completo de impacto backend/frontend documentado

### Fase 2 - Nuevo Modelo de Datos

Objetivo:

- Crear entidades nuevas
- Ajustar entidades existentes

Checklist:

- [ ] Crear `CandidateWorkExperience`
- [ ] Crear `CandidateInterview`
- [ ] Crear `CandidateInterviewResult`
- [ ] Crear `InterviewerMatrix`
- [ ] Crear `RequestEmployeeRegisterFile`
- [ ] Agregar flags de talent pool en `Candidate`
- [ ] Agregar `HiringDocumentsDueDate`
- [ ] Relajar índice `(CandidateId, RequestPositionId)` a no único
- [ ] Mantener legacy fields durante transición interna

Criterio de paso:

- `dotnet build`
- migración generada
- modelo EF consistente

### Fase 3 - Backend de Entrevistas Nuevo

Objetivo:

- Mover la lógica operativa de agenda al nuevo modelo

Checklist:

- [ ] Crear AppService/DTOs/endpoints para entrevistas
- [ ] Crear AppService/DTOs/endpoints para resultados
- [ ] Implementar crear, confirmar, reagendar, cancelar y cerrar cita
- [ ] Resolver matriz de entrevistador por customer y rol
- [ ] Migrar notificaciones a nuevo flujo
- [ ] Migrar deep links de correo y sistema
- [ ] Mantener reglas de seguridad por rol

Criterio de paso:

- CRUD completo de entrevistas funcional
- respuestas del entrevistador funcionales

### Fase 4 - Configuración de Matriz desde Admin

Objetivo:

- sacar la administración de la matriz de entrevistadores fuera de Reclutamiento
- configurar reglas por customer desde `admin.luxuryapp`

Checklist:

- [ ] definir ubicación oficial en `D:/repos/luxuryapp-api/client/angular/src/app/apps/admin.luxuryapp`
- [ ] crear componente/listado CRUD para `InterviewerMatrix`
- [ ] permitir filtrar por customer
- [ ] permitir alta/edición/baja lógica o eliminación según decisión aprobada
- [ ] permitir seleccionar rol del puesto y rol entrevistador
- [ ] exponer servicio frontend y endpoints de consumo desde Admin
- [ ] documentar que Reclutamiento solo consume la matriz, no la administra

Criterio de paso:

- existe UI en Admin para configurar la matriz por customer
- Reclutamiento consume la matriz ya configurada

### Fase 5 - Frontend de Reclutamiento Reordenado

Objetivo:

- Unificar el flujo operativo de Reclutamiento

Checklist:

- [ ] Ajustar alta de candidato para soportar experiencia laboral estructurada
- [ ] Convertir formulario de postulación en flujo “Agregar candidato y entrevista”
- [ ] Fecha de registro autogenerada
- [ ] Fecha y hora de entrevista con input `DateTime`
- [ ] Mantener carga de CV en el mismo flujo
- [ ] En vacantes, reemplazar CTA ambiguo por CTA explícito de entrevista
- [ ] Ajustar columna candidatos en vacantes para abrir detalle por puesto
- [ ] Corregir agenda y bandejas para leer nuevas entrevistas

Criterio de paso:

- Smoke test visual completo de Reclutamiento

### Fase 6 - Vistas Operativas y Detalle por Puesto

Objetivo:

- Consolidar visibilidad por vacante/puesto/candidatos

Checklist:

- [ ] Consolidar `/work-position/:workPositionId/candidates` como vista de detalle oficial
- [ ] Mostrar candidatos activos
- [ ] Mostrar histórico de candidatos
- [ ] Mostrar entrevistas activas y cerradas
- [ ] Mostrar fecha/hora, entrevistador, estatus, CV y acciones
- [ ] Permitir acceso directo desde vacantes y notificaciones

Criterio de paso:

- Cada puesto muestra correctamente sus candidatos e histórico

### Fase 7 - KPI, Automatizaciones y Checklist de Alta

Objetivo:

- Recalcular analítica y preparar cierre de contratación

Checklist:

- [ ] Adaptar KPIs al nuevo modelo
- [ ] Adaptar automatizaciones
- [ ] Integrar `StaffHiringFiles`
- [ ] Crear documentos de alta iniciales al aprobar
- [ ] Validar continuidad hasta alta

Criterio de paso:

- KPIs funcionales y contratación trazable

### Fase 8 - Retiro de Legacy

Objetivo:

- Eliminar deuda técnica vieja

Checklist:

- [ ] Remover lecturas de campos legacy
- [ ] Remover `CandidateInterviewFeedback`
- [ ] Remover columnas legacy de `CandidateApplication`
- [ ] Eliminar `ExperienceSummary` como fuente activa
- [ ] Depurar DTOs y endpoints legacy
- [ ] Actualizar documentación del módulo

Criterio de paso:

- No queda código productivo leyendo modelo legacy

## 8. Criterios de Paso Globales

- [ ] `dotnet build` pasa
- [ ] `npx tsc --noEmit` pasa
- [ ] Flujos happy/sad/edge pasan manualmente
- [ ] Emails y notificaciones apuntan a rutas correctas
- [ ] Agenda y tablero muestran datos reales
- [ ] Rutas de Reclutamiento y entrevistador quedan separadas

## 9. Riesgos

| Riesgo | Impacto | Mitigación |
|:---|:---|:---|
| Migración incompleta rompe agenda | Alto | Fases + pruebas con datos reales |
| Re-postulación genera duplicidad activa | Alto | Regla de dominio + validación DB |
| Frontend sigue leyendo legacy | Alto | Inventario y retiro por fases |
| Notificaciones siguen con links viejos | Medio | Corregir backend + plantillas + OneSignal |
| Cambio grande deja basura documental | Medio | Actualizar docs de módulo al cierre |

## 10. Dependencias e Impactos

### Backend impactado

- Candidates
- Reclutamiento y Altas/Bajas
- Notificaciones / Email / Push / SignalR
- Employee Register / Alta

### Frontend impactado

- Candidates
- Requests/Vacancies
- Staff Board solo como consumidor posterior, no como fuente principal

## 11. 3.5 Migración de Datos & Prevención de Pérdida

### 11.1 Cambios de Estructura

| Tabla | Cambio | Tipo | Riesgo | Mitigación |
|:---|:---|:---|:---|:---|
| `RecruitmentCandidates` | Agregar talent pool flags | Agregar columna | Bajo | Default seguro |
| `RecruitmentCandidates` | Deprecar `ExperienceSummary` | Cambio funcional | Medio | Mantener hasta retiro final |
| `RecruitmentCandidateApplications` | Quitar columnas de agenda | Remover columna | Crítico | Hacer al final |
| `RecruitmentCandidateApplications` | Índice `(CandidateId, RequestPositionId)` no único | Constraint | Alto | Validación de dominio |
| `RecruitmentCandidateInterviewFeedback` | Eliminar tabla | Remoción | Crítico | Migrar a entrevistas + resultados |
| Nuevas tablas | Crear entrevistas, resultados, experiencias, matriz, documentos | Nuevas tablas | Bajo | Script + validación |

### 11.2 Análisis de Pérdida de Datos

- Riesgo crítico: perder histórico de feedback si se elimina `RecruitmentCandidateInterviewFeedback` sin migrar.
- Riesgo alto: perder citas actuales si se borran columnas legacy antes de poblar `CandidateInterview`.
- Riesgo alto: generar duplicados activos si se relaja índice sin validación de negocio.

### 11.3 Plan de Migración Ejecutado por Tech Lead

1. Backup
2. Crear nuevas tablas
3. Backfill de entrevistas desde columnas legacy
4. Backfill de resultados desde feedback legacy
5. Backfill de experiencias si existe data recuperable
6. Validar conteos
7. Cambiar lecturas backend/frontend al nuevo modelo
8. Solo al final hacer `DROP` de legacy

### 11.4 Validación Post-Migración

- [ ] Conteo de postulaciones se mantiene
- [ ] Conteo de citas migradas coincide con agenda legacy
- [ ] Conteo de feedback migrado coincide con resultados
- [ ] No hay vacantes huérfanas
- [ ] No hay postulaciones activas duplicadas indebidas

### 11.5 Rollback

- Restaurar backup
- Rehabilitar lecturas legacy
- Revertir migración fallida

## 12. Cierre Esperado

Al finalizar, Reclutamiento tendrá un módulo coherente y escalable donde:

- el candidato se registra una vez
- la experiencia laboral es estructurada
- la postulación deja de cargar responsabilidades de agenda
- la entrevista es una cita formal con historial
- el resultado es trazable
- la vacante muestra sus candidatos correctamente
- las notificaciones llevan al detalle correcto
- el proceso de alta queda listo para continuar sin parches
