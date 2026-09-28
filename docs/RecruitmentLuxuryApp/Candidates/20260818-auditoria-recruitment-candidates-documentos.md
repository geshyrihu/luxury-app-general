# Validación de Documentación de Reclutamiento

## Objetivo
Implementar la validación de documentos (PDFs) cargados en el expediente de un nuevo empleado desde la vista de Reclutamiento > Solicitudes de Alta (`RequestEmployeeRegister`). Esto permite conectar el flujo desde que el candidato es aprobado hasta que Recursos Humanos completa su expediente.

## Contexto Arquitectónico
- **Enlace:** `CandidateProcess` -> `RequestPosition` <- `RequestEmployeeRegister` -> `Employee` -> `EmployeeDocument`.
- Los documentos físicos pertenecen al `Employee`.
- La responsabilidad de validarlos es de Reclutamiento al revisar la `RequestEmployeeRegister` (Solicitud de Alta).

## Proposed Changes

### Backend
No requiere cambios mayores en el backend porque `EmployeeDocumentAppService` ya tiene la función para obtener documentos de un `EmployeeId` y validarlos. Solo hay que asegurar que la vista de Solicitudes de Alta en el frontend pueda leerlos.

### Frontend
Vamos a inyectar el componente de validación de documentos dentro del detalle de la Solicitud de Alta.

#### [MODIFY] `client/angular/src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/solicitud-alta-empleado/request-employee-register-form.ts` (o donde viva la vista de detalle de la solicitud de alta)
- Agregar una nueva sección o pestaña (fieldset) llamada "Documentación del Expediente".
- Dentro de esa sección, invocar la carga de los documentos utilizando el `employeeId` atado a la solicitud (`this.item.employeeId`).
- Renderizar una cuadrícula (grid) similar a la que se usa en `employee-document-list.html`.
- Cada tarjeta mostrará el botón `il-button-view-pdf` para ver el archivo.
- En lugar de botones para subir/actualizar archivos, se colocarán botones de acción para Reclutamiento: **"Validar"** y **"Rechazar/Nota"**.
- Al presionar "Validar", llamar al endpoint de backend correspondiente en `EmployeeDocumentAppService` para marcar `IsValidated = true`.

#### [NEW] `client/angular/src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/solicitud-alta-empleado/components/hiring-document-validation.ts` (Opcional, si se prefiere extraer el componente)
- Un componente standalone que reciba el `@Input() employeeId: string` y maneje la lógica de vista y validación exclusiva para reclutamiento.

## Verification Plan
1. Levantar el frontend local.
2. Ir a Reclutamiento > Solicitudes de Alta.
3. Abrir una solicitud de alta que ya tenga un `EmployeeId` asociado y PDFs cargados.
4. Verificar que se liste la documentación.
5. Clic en "Validar" en un documento, verificar que cambie su estado a Validado.
6. Refrescar el perfil del empleado y confirmar que ahí también aparece como "Validado".
