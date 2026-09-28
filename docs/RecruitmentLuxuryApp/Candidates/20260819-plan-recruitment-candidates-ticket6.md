# Plan de Implementación: Ticket 6 - Refinamientos de Entrevista, Listado y PDF de Alta

Este ticket abarca tres nuevos requerimientos (hallazgos de UX y negocio) solicitados sobre la versión operativa del módulo de candidatos. Dado que ya existen datos reales en producción, las modificaciones estructurales en base de datos deben ser cuidadosas (idempotentes).

---

## Tarea 1: Independización de Fecha y Hora de Entrevista (con validación de -30 min)
**Problema:** `ScheduledAt` (DateTime) acopla la fecha y la hora, complicando el frontend. Además, no se podía agendar para "hace unos minutos" si la reunión acaba de empezar.
**Solución Arquitectónica:**
1. **Entidad `CandidateInterview`:** 
   - Reemplazar `public DateTime ScheduledAt` por:
     `public DateOnly ScheduledDate { get; set; }`
     `public TimeOnly ScheduledTime { get; set; }`
2. **Migración Segura (Entity Framework):**
   - El agente generará la migración. **Antes** de eliminar la columna `ScheduledAt`, debe agregar una sentencia `.Sql("UPDATE RecruitmentCandidateInterviews SET ScheduledDate = CONVERT(date, ScheduledAt), ScheduledTime = CONVERT(time, ScheduledAt);");` en el método `Up()` para retro-compatibilidad (Backfill de datos reales). Luego de copiar, se puede eliminar `ScheduledAt`.
3. **Servicios y Validadores:**
   - Ajustar `ScheduleRecruitmentInterviewRequest` (DTO) para aceptar `ScheduledDate` y `ScheduledTime`.
   - Modificar la validación: Combinar Date y Time en un `DateTime` local, y validar que `ScheduledDateTime >= DateTime.Now.AddMinutes(-30)` (Permite agendar hasta 30 minutos en el pasado exacto).
4. **Frontend (`candidate-recruitment-schedule-modal`):**
   - Reemplazar el calendario único por dos controles separados: un `<p-calendar>` para Date (solo fecha) y un `<p-calendar [timeOnly]="true">` para Hora.
   - Enviar ambos valores limpios en el payload al backend.

---

## Tarea 2: Fotografía en el Listado de Candidatos
**Objetivo:** Agilizar la identificación visual de los candidatos desde la tabla de inicio (`candidate-list.html`).
**Implementación:**
1. **Backend (`CandidateAppService`):**
   - En el DTO `CandidateListItemDto`, asegurar que se incluya la propiedad `PhotoUrl`. Si no existe, mapearla usando el servicio de almacenamiento (igual que en `CandidateDetailDto`).
2. **Frontend (`candidate-list.html`):**
   - En la columna de "Nombre/Candidato", agregar la imagen a la izquierda del texto, usando `<img [src]="item.photoUrl">` con clase circular (ej. `w-2rem h-2rem border-circle`).
   - Si `photoUrl` es nulo, mostrar las iniciales o el avatar por defecto del sistema (`<app-avatar>`).

---

## Tarea 3: Fotografía en el Formato PDF de Alta
**Objetivo:** El PDF generado por QuestPDF para las altas de empleados debe integrar la fotografía del candidato si esta fue subida durante su proceso.
**Implementación:**
1. **Backend (`ExportHiringFormatPdfAsync` en `RequestEmployeeRegisterAppService`):**
   - El servicio PDF ya extrae información del candidato (o la debe recuperar si solo extrae de PersonData). Modificar la query para incluir/leer la ruta de la foto física desde el `ISecureFileStorageService` correspondiente al Empleado o Candidato (o su DTO en caso de estar mapeado).
2. **QuestPDF Layout:**
   - En la primera sección (Datos Personales), reorganizar el layout para reservar un recuadro superior derecho o izquierdo.
   - Si el archivo físico existe, incrustar `.Image(File.ReadAllBytes(photoPath))`.
   - Si no existe (o falla), incrustar una imagen/ícono placeholder incrustada en los *assets* del servidor o simplemente un cuadro vacío con la leyenda "Fotografía".
