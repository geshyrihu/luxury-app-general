# Plan de Remediación - Módulo Inspections

**Fecha:** 2026-10-03
**Módulo:** OperationsLuxuryApp / Inspections

Este plan detalla las tareas secuenciales requeridas para mitigar las vulnerabilidades críticas y deuda técnica encontradas en la auditoría (`20261003-auditoria-inspections.md`). Todo el desarrollo debe seguir las convenciones oficiales.

## Fase 1: Corrección de Transiciones de Estado y Concurrencia (Backend)

**Objetivo:** Proteger la integridad de los reportes cerrados y evitar duplicidad.

- [ ] Tarea 1.1: Modificar `CustomerInspectionAppService.UpdateInspectionDataAsync` para validar que si `Status == InspectionExecutionStatus.Completed`, se lance un `BusinessException("No se puede modificar una inspección ya cerrada.", "INVALID_STATE", 400);`.
- [ ] Tarea 1.2: En `CustomerInspectionAppService.GetInspectionsByCustomerAsync`, agregar manejo concurrente (try/catch sobre `SaveChangesAsync` con `DbUpdateException`) al generar las inspecciones o cambiar a validación segura transaccional para evitar duplicados.
- [ ] Tarea 1.3: Agregar un Constraint a nivel Entity Framework (Unique Index) para la combinación de `InspectionId` y la fecha de creación en la entidad `InspectionExecution`.

## Fase 2: Integridad Relacional y Protección de Históricos (Backend)

**Objetivo:** Evitar borrados en cascada que destruyan historial valioso.

- [ ] Tarea 2.1: Modificar `InspectionCondominiumAssetAppService.DeleteInspectionCondominiumAssetAsync` para impedir el borrado (lanzar `BusinessException`) si ya existen `InspectionExecutionItems` completados para ese activo. Alternativa: implementar Soft Delete.
- [ ] Tarea 2.2: Modificar `InspectionCondominiumAssetAppService.DeleteReviewByIdAsync` para validar la misma restricción sobre `InspectionExecutionItems` en la base de datos antes de permitir la eliminación.

## Fase 3: Alineación de Arquitectura de Dominios (Full-Stack)

**Objetivo:** Restaurar la convención obligatoria de "Paridad de Dominios" del Catálogo Oficial (`Module Master Domain Map`).

- [ ] Tarea 3.1: Renombrar/mover la carpeta física del frontend `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection` hacia `appsweb/angular/src/app/modules/operations.luxuryapp/inspection`.
- [ ] Tarea 3.2: Actualizar el ruteador (`app.routes.ts` o equivalente de `operations.luxuryapp`) para apuntar al nuevo path.
- [ ] Tarea 3.3: Refactorizar todas las importaciones locales (`import {...} from '@maintenance.luxuryapp/...'`) al nuevo alias `@operations.luxuryapp/...` de ser aplicable, y validar compilación exitosa.

## Fase 4: Sanidad de Interfaz de Usuario y Accesibilidad (Frontend)

**Objetivo:** Eliminar hardcodings de estilos visuales y cumplir con accesibilidad (WCAG 2.1).

- [ ] Tarea 4.1: En `lista-inspecciones.scss` (y archivos hermanos), limpiar el código `padding: 8px 12px !important;` y reemplazar por los tokens CSS oficiales de espaciado (`var(--spacing-...)`).
- [ ] Tarea 4.2: En `resultado-inspeccion.html`, agregar el atributo `alt="Foto del resultado"` u homólogo a la etiqueta `<img />`.
- [ ] Tarea 4.3: En `mis-inspecciones-agregar-imagenes.html`, agregar atributos `alt="Imagen de evidencia"` u homólogo a todas las etiquetas `<img />` expuestas.

---

> **Aprobación Requerida:** Una vez que el Tech Lead (o el usuario) apruebe este plan, se puede iniciar con la Fase 1.
