# 01 - Discovery Questionnaire

## Contexto del Negocio

### P1.1 Problema que resuelve

Actualmente, Reclutamiento sufre de un flujo fragmentado cuando intenta registrar candidatos, ligarlos a vacantes, agendar entrevistas y dar seguimiento hasta alta, lo que resulta en confusión operativa, pantallas traslapadas y modelo de datos rígido.

La reestructuración propuesta resuelve:

- separar claramente `candidato`, `postulación`, `cita/entrevista`, `resultado` y `alta`
- permitir múltiples entrevistas por postulación
- estructurar experiencia laboral
- soportar seguimiento histórico por puesto de trabajo
- mejorar automatizaciones, métricas y notificaciones

### P1.2 Actores principales y objetivos

- Reclutamiento: Registrar candidato, cargar CV, asignar vacante, programar entrevista, reagendar, cancelar, dar seguimiento y empujar a alta.
- Entrevistador: Ver citas asignadas, confirmar o responder entrevista, registrar no asistencia, rechazo o aprobación.
- Administrador / Gerente de Operaciones / Gerente de Atención: Recibir notificaciones, revisar candidatos enviados a entrevista y decisiones relevantes.
- Recursos Humanos / Altas: Gestionar expediente documental y contratación.
- Sistema: Mantener trazabilidad, consistencia de estados y notificaciones.

### P1.3 KPIs de éxito

- Tiempo para registrar candidato y dejar primera entrevista agendada: Baseline 2-3 pantallas / Target 1 flujo unificado / Fase 4
- Vacantes visibles con sus candidatos y entrevistas activas: Baseline parcial / Target 100% / Fase 5
- Citas sin ambigüedad de estado: Baseline baja / Target 100% / Fase 5
- Reagendar/cancelar cita sin tocar manualmente la postulación: Baseline 0% / Target 100% / Fase 5
- Historial por puesto de trabajo: Baseline parcial / Target 100% / Fase 5

### P1.4 Restricciones

- La ruta oficial frontend es `client/angular`.
- No se debe seguir mezclando componentes de Reclutamiento con los exclusivos de entrevistador.
- La nueva estructura debe respetar convenciones de DTOs, endpoints, documentación y migración.
- El proceso de alta documental debe quedar listo para crecer, aunque no todo el checklist se implemente en la primera fase.

## Reglas de Negocio

### Nivel 1 - Invariantes de Dominio

- Un candidato es una ficha maestra reutilizable y no equivale a empleado.
- Una postulación representa la relación entre un candidato y una vacante.
- Una entrevista es un evento independiente de la postulación.
- Un resultado de entrevista no sustituye la cita; la cierra o la califica.
- Una vacante puede tener múltiples candidatos y un candidato puede tener historial sobre la misma vacante.

### Nivel 2 - Flujo y Estados

- Reclutamiento primero registra al candidato y luego decide si crear postulación.
- La postulación puede acumular una o más entrevistas.
- Cada entrevista tiene ciclo de vida propio: enviada, confirmada/cambio, finalizada, cancelada, no presentada.
- La aprobación final dispara alta en proceso y bloqueo operativo de la vacante.

### Nivel 3 - Seguridad / Autorización

- Reclutamiento y Administrador gestionan candidatos, postulaciones y agenda de reclutamiento.
- Entrevistadores solo ven y responden las entrevistas asignadas.
- Administrador, Gerente de Operaciones y Gerente de Atención son destinatarios de notificaciones críticas.

### Nivel 4 - Validación de Datos

- El CV es obligatorio para crear postulación operativa.
- La fecha de registro debe autogenerarse.
- Fecha y hora de entrevista deben manejarse como `DateTime`, no solo `Date`.
- Una cita cancelada debe conservar trazabilidad.
- Una re-postulación histórica no debe romper las reglas de “solo una activa abierta” por vacante.

## Flujos Principales

### Happy Path

1. Reclutamiento registra candidato.
2. Reclutamiento carga CV.
3. Reclutamiento asigna vacante.
4. Reclutamiento crea cita de entrevista.
5. Sistema notifica a actores correspondientes.
6. Entrevistador responde.
7. Reclutamiento continúa a selección o alta.

### Sad Paths

- Candidato no se presenta.
- Entrevistador propone cambio.
- Cita se cancela.
- Candidato es rechazado con motivo.
- Candidato aprobado pero pendiente de expediente documental.

### Edge Cases

- Múltiples candidatos para la misma vacante.
- Re-postulación histórica del mismo candidato a la misma vacante.
- Vacante en proceso con nuevo candidato histórico no activo.
- Cambio de entrevistador por customer y rol de puesto.
