# Plan de Implementación: Ticket 1 - Mejoras en Registro de Candidato y Validaciones de Integridad

## Objetivo
Implementar las mejoras del registro inicial de candidatos (req 5a y 6): carga de fotografía, fuente de reclutamiento dinámica y validación cruzada de duplicidad contra usuarios/empleados/candidatos existentes.

## 1. Cambios en Base de Datos y Entidades
- **Nueva Entidad `RecruitmentSourceCatalog`**:
  - `Id` (Guid, PK), `Name` (string, max 100), `IsActive` (bool), `TenantId` (Guid, opcional dependiendo de si es multi-tenant).
  - Ubicación: `api/LuxuryApp.Core/Entities/Tenant/Recruitment/ReclutamientoyAltasBajas/`.
- **Modificación en `Candidate`**:
  - Agregar relación: `Guid? RecruitmentSourceId`.
  - Propiedad de navegación `public virtual RecruitmentSourceCatalog RecruitmentSource { get; set; }`.
  - Asegurar existencia de propiedad para foto (`PhotoUrl` o `AvatarUrl`).

## 2. Backend - `CandidateAppService`
- **Registro Inicial (Create)**:
  - Soporte para recibir el `File` (foto) dentro de `CandidateCreateDto`. Usar `ISecureFileStorageService` para guardar y enlazar la URL al candidato.
- **Validación de Duplicidad (`CheckDuplicateCandidateAsync`)**:
  - Endpoint `[HttpPost("check-duplicate")]` o `[HttpGet("check-duplicate/{emailOrCurp}")]`.
  - Lógica: Buscar coincidencia por `Email` y/o `CURP`/`RFC`.
  - Si encuentra coincidencia en `Employee`: Devolver `Conflict` ("La persona ya es un empleado activo").
  - Si encuentra coincidencia en `Candidate`: Devolver `Conflict` ("El candidato ya se encuentra en proceso").
  - Si encuentra coincidencia en `ApplicationUser`: Devolver un estado especial (Ej. `200 OK` con un flag `existsAsUser = true, userData = {...}`) para ofrecer importar.

## 3. Frontend - Angular (`candidate-form.ts` o equivalente)
- **Carga de Foto**:
  - Integrar el componente de subida de imagen (`<custom-avatar-upload>` o similar) en el formulario de candidato.
- **Fuente de Reclutamiento**:
  - Añadir `<custom-input-select-signal>` leyendo de un nuevo endpoint `/api/RecruitmentSourceCatalog/select-options`.
- **Interacción de Duplicidad (Experiencia de Usuario)**:
  - Al perder el foco (blur) del input de Correo o CURP, llamar a `check-duplicate`.
  - Si la API responde que existe como `ApplicationUser`, lanzar un `Swal.fire` tipo confirmación: *"Hemos encontrado un usuario registrado con este correo. ¿Deseas autocompletar el formulario con sus datos?"*.
  - Si el usuario acepta, hacer un parche a los form controls con los datos devueltos.
