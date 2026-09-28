# Roadmap MVP 2 - Reclutamiento y Recursos Humanos

Basado en los nuevos requerimientos post-MVP (`../../../docs/RecruitmentLuxuryApp/Candidates/20260808-analisis-recruitment-candidates-requerimientos.md`), se ha dividido el trabajo en 5 tickets manejables para garantizar entregas estables y evitar regresiones.

## Ticket 1: Mejoras en Registro de Candidato y Validaciones de Integridad
- **Nuevas Entidades:** `RecruitmentSourceCatalog` (Catálogo editable: recomendación, facebook, etc.).
- **Backend:** 
  - Lógica de validación de duplicidad (`Candidate`, `Employee`, `ApplicationUser`). Si existe en `ApplicationUser`, devolver un flag/respuesta para que el frontend ofrezca importar datos.
  - Ajustar DTOs para soportar foto de perfil y fuente de reclutamiento.
- **Frontend:** 
  - Carga de foto desde el registro inicial.
  - UI para advertencia de duplicidad e importación de datos.
  - Dropdown para fuente de reclutamiento.

## Ticket 2: Refinamiento de Formularios y Edición desde Reclutamiento
- **Frontend (Formulario Empleado/Solicitud):**
  - Ajustar botón "Limpiar borrador" para no borrar datos autollenados (`TurnoTrabajo`, `Customer.Address` provenientes de `WorkPosition`).
  - Marcar propiedades `TurnoTrabajo` y `Customer.Address` como *readonly* / no editables.
  - Mejorar el Tab de Confirmación con mayor información relevante.
  - `CodigoPostal`: Validar que sea numérico, longitud estricta de 5, aplicar máscara (ej. `99999`).
- **Backend / Permisos:**
  - Garantizar que Reclutamiento pueda editar documentos y datos de los empleados (Ajustar roles/políticas de autorización).

## Ticket 3: Refactorización a Catálogo de Documentos Dinámico
- **Nuevas Entidades:** `DocumentCatalog` (`IsMandatory`, `Description`).
- **Backend:** 
  - Migrar la relación de `EmployeeDocument` para que apunte a `DocumentCatalog` en lugar del enum duro `DocumentTypeId`.
  - Crear regla de validación al "cerrar proceso de alta" que verifique que todos los documentos marcados como `IsMandatory == true` existan y estén validados.
  - Seed inicial de datos migrando los valores del enum actual a la tabla `DocumentCatalog`.
- **Frontend:**
  - Ajustar listados de documentos (tanto de carga como de validación) para leer del nuevo endpoint `DocumentCatalog` en vez del `EnumSelectService`.

## Ticket 4: Checklist Post-Contratación (Onboarding)
- **Nuevas Entidades:** `ChecklistOptions` (Catálogo administrable), `EmployeeOnboardingChecklist` (Relación M:N o 1:N por empleado).
- **Backend / Frontend:**
  - CRUD para el catálogo `ChecklistOptions`.
  - Nueva pestaña/sección en el Expediente del Empleado para ver y marcar las acciones post-contratación.
  - Al dar de alta un empleado, inicializar su checklist.

## Ticket 5: Fase 2 - Contratos Automáticos y Notificaciones
- Verificar/Migrar ubicación de `TypeContractRegister`.
- Generador de contratos automáticos (PDF / Word) basándose en la plantilla del tipo de contrato.
- Sistema de envío a firma para Administradores.
- Job en Hangfire (o similar) para enviar alarma de vencimiento antes de finalizar contrato.
