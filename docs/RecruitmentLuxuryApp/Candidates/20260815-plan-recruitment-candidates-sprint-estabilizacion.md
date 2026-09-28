# Roadmap: Sprint de Estabilización (Reclutamiento Integrado)

Este roadmap se basa en los hallazgos críticos (C) y altos (A) del reporte de auditoría `docs/reporte_maestro/modulos/20260819-auditoria-reclutamiento-integrado.md`. El objetivo es estabilizar el módulo resolviendo fugas funcionales, violaciones arquitectónicas de seguridad y de persistencia, antes de lanzar nuevas características de producto.

---

## Ticket 1: Refactorización Estructural y Fronteras (Críticos)
**Objetivo:** Restaurar el aislamiento entre aplicaciones y centralizar los selectores dinámicos, garantizando que el CLI de validaciones pase limpio (`audit:apps`, `audit:icon-names`).

- **C1 - Iconos fuera de catálogo:** 
  - Buscar `sync-alt`, `event-available-outline`, `unarchive-outline`, `how-to-reg` en `candidate-form.html`, `candidate-recruitment-interviews.html` y `candidate-work-position-candidates.html`.
  - Reemplazarlos por iconos equivalentes existentes en `app-icon.catalog.ts` o registrarlos oficialmente si existen en Iconify.
- **C2 - Centralización del Selector de Vacantes:** 
  - Mover el método `GetSelectVacantesAsync` fuera de `RequestEmployeeRegisterAppService` e implementarlo en `SystemLuxuryApp/Infrastructure/SelectItemEndPoints` como dicta la regla §6.1.
  - Asegurar que `CandidateProcessAppService` invoque al nuevo endpoint y no importe DTOs prohibidos entre dominios de negocio.
- **C3 - Rompimiento de Frontera de Apps:** 
  - Corregir los 8 archivos en `recursos-humanos.luxuryapp` que importan dependencias directas de `reclutamiento.luxuryapp` (ej. `employee-interviewer-queue.ts`, `staff-board.ts`).
  - Mover los modelos compartidos, constantes o DTOs necesarios a un directorio en `shared` o rediseñar el paso de parámetros para aislar ambos dominios (UI Boundaries).

---

## Ticket 2: Bugs Críticos de Funcionalidad y Seguridad (Altos)
**Objetivo:** Reparar el bloqueo 403 a los entrevistadores, la corrupción de extensiones de fotos y el envío nulo de notificaciones.

- **A1 - 403 Forbidden para Entrevistadores:**
  - En `CandidateProcessEndPoint.cs`, retirar el `[Authorize("RequireInterviewerRole")]` apilado directamente sobre los métodos `interview-response` y `interviewer-action`.
  - Crear un grupo (sub-group) de enrutamiento aislado (`InterviewerEndpoints`) que solo exija `RequireInterviewerRole` o validar programáticamente dentro del Endpoint para no forzar la política AND (que exige ser Reclutador Y Entrevistador a la vez).
- **A2 - Fotos Guardadas como PDF:**
  - En `CandidateAppService.cs` (`SaveCandidatePhotoAsync`), cambiar el uso de la subida. Si `ISecureFileStorageService.SaveAsync` fuerza la extensión `.pdf`, se debe usar `SaveOrigExtAsync` (o el método equivalente en el proyecto) para que la foto del candidato respete su extensión `.png` o `.jpg`.
- **A3 - Notificaciones de Entrevista Muertas:**
  - En `CandidateNotificationCoordinatorService.cs` (`NotifyProcessInterviewScheduledAsync`), implementar el despacho real de la notificación al entrevistador.
  - Generar la alerta de sistema / correo cuando el proceso llegue a "EntrevistaAgendada".

---

## Ticket 3: Robustez Transaccional y Normalización
**Objetivo:** Prevenir "archivos huérfanos" en la nube por falta de Unit of Work y comenzar el rediseño para mitigar la duplicidad en base de datos.

- **A5 - Orden de Archivos sin Transacción:**
  - En `CandidateAppService.cs` (`CreateAsync` y `DeleteAsync`), envolver la eliminación física o subida de archivos dentro de transacciones, o en su defecto, guardar en Base de Datos PRIMERO y si el `SaveChangesAsync` es exitoso, realizar la persistencia física en disco (patrón recomendado en `CONVENTIONS.md`).
- **A8 - Unificación de Folios (Redundancia BD) [Fase 1]:**
  - Mapear claramente si `RequestPosition.Folio` y `RequestEmployeeRegister.Folio` pueden consolidarse en un solo "Tracking Number" a nivel del Proceso del Candidato o Vacante. (Este ticket puede ser de planeación/arquitectura profunda para generar un plan de migración de datos que no rompa la producción actual).
