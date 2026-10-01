# Retroalimentación y Notificaciones de Expediente

## Objetivo
Establecer un flujo de comunicación bidireccional entre el personal que carga los documentos y Reclutamiento.
1. El personal que carga los documentos debe poder notificar a Reclutamiento cuando termine.
2. Reclutamiento debe poder auditar los documentos en un **modal independiente** accesible desde la cuadrícula (grid) principal de Solicitudes de Alta.
3. Reclutamiento debe poder **Rechazar** un documento con notas de retroalimentación, lo cual se mostrará a RRHH para que lo corrijan.

## Contexto Arquitectónico
- La tabla `EmployeeDocument` ya cuenta con el campo `ValidationNotes`.
- El frontend tiene el componente `HiringDocumentValidation` que ya lista y valida.

## Proposed Changes

### Backend (`api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/Employees/EmployeeDocument/Services/EmployeeDocumentAppService.cs`)

#### 1. Nuevo método `RejectDocumentAsync(Guid documentId, CandidateHiringDocumentValidateDto dto)`
- Marcar `IsValidated = false`.
- Guardar `ValidationNotes = dto.ValidationNotes`.
- Guardar `ValidatedAt = DateTime.UtcNow` y `ValidatedByUserId = currentUserService.UserId`.
- Retornar el documento mapeado.
- **Endpoint:** `[HttpPost("{documentId}/reject")]` en `EmployeeDocumentEndPoint.cs`.

#### 2. Nuevo método `NotifyDocumentsUploadedAsync(Guid employeeId)`
- Retornar un simple SuccessResult simulando el envío de una notificación (OneSignal / Email).
- **Endpoint:** `[HttpPost("notify-recruitment/{employeeId}")]` en `EmployeeDocumentEndPoint.cs`.

### Frontend - Expediente (`employee-document-list.ts`)
- Reemplazar el `alert()` nativo por `LxToastService`.
- Si `row.document` tiene `isValidated === false` **Y** tiene `validationNotes`, mostrar un bloque con las notas debajo del botón de carga (puedes usar `<p class="text-sm text-red-500">{{ row.document.validationNotes }}</p>`).
- Al final, agregar `<il-button-confirm label="Notificar a Reclutamiento" swalText="¿Confirmas que terminaste de cargar los documentos?" (confirmed)="onNotifyRecruitment()" />`. Este llama a `notify-recruitment/{employeeId}`.

### Frontend - Reclutamiento: Validación de Documentos
En lugar de incrustar el `HiringDocumentValidation` en `solicitud-alta-status-form.html` (modal de edición de la solicitud), extraeremos la vista de validación de documentos a un modal propio accesible desde el listado (`solicitud-alta-list.html`).

#### 1. Modificar `solicitud-alta-list.html`
- Agregar la cabecera `<th>DOC.</th>` en la tabla principal (puedes ponerla antes o después de "ESTATUS").
- En el `<td>`, si el item tiene un empleado atado (`item.employeeId` o si no viene en el DTO, necesitarás asegurarte de que el DTO `RequestEmployeeRegisterListItemDto` traiga el `EmployeeId`), mostrar un icono (ej. `<iw-button iconClass="material-symbols-light:folder-open" (clicked)="onOpenDocumentValidation(item)" />`).
- Modificar el backend si es necesario para que el DTO del listado de Solicitudes de Alta devuelva `EmployeeId` (si aún no lo hace).

#### 2. Crear Modal `HiringDocumentValidationModal`
- El componente debe recibir el `EmployeeId`.

#### 3. Modificar `HiringDocumentValidation` (Botón de Rechazo)
- Al lado del botón "Validar documento", agregar un botón "Rechazar" (ej. `<il-button iconClass="material-symbols-light:cancel" severity="danger" (clicked)="onReject(row.document)" />`).
- Al hacer clic en "Rechazar", usar `Swal.fire({ input: 'textarea', title: 'Motivo de rechazo' ... })` nativo de SweetAlert2 para capturar el texto.
- Hacer un POST al endpoint `{documentId}/reject` pasando las notas capturadas.
- Actualizar el signal local con el resultado.
