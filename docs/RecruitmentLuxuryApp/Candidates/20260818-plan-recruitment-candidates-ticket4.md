# Plan de Implementación: Ticket 4 - Checklist Post-Contratación (Onboarding)

## Objetivo
Cumplir el Req 1 introduciendo una herramienta de control (checklist) para el proceso de onboarding del empleado (entregar uniforme, capacitación, registro biométrico, etc.), administrada dinámicamente desde un catálogo y rastreada individualmente por empleado.

## 1. Cambios en Base de Datos y Entidades
**Módulo:** Recursos Humanos (`api/LuxuryApp.Core/Entities/Tenant/RecursosHumanos/Employees`)

- **Nueva Entidad `ChecklistOptionCatalog`** (Catálogo Administrable):
  - `Id` (Guid, PK).
  - `Name` / `Description` (string, max 100).
  - `IsActive` (bool).
  - Campos de auditoría heredados.

- **Nueva Entidad `EmployeeOnboardingChecklist`** (Registro transaccional por Empleado):
  - `Id` (Guid, PK).
  - `EmployeeId` (Guid, FK a Employee).
  - `ChecklistOptionCatalogId` (Guid, FK al catálogo).
  - `IsCompleted` (bool) - Por defecto en false.
  - `CompletedAt` (DateTime? null) - Fecha en la que se marcó como completado.
  - `CompletedByUserId` (string? null) - Usuario que lo marcó.
  - `Notes` (string? max 500) - Observaciones opcionales.

## 2. Backend - AppServices y Endpoints
- **Para el Catálogo (`ChecklistOptionCatalogAppService`)**:
  - Implementar CRUD básico (listar, crear, actualizar, eliminar/desactivar).
  - Exponer endpoint `api/select-items/onboarding-checklist-options` para fácil consumo en el frontend.

- **Para el Expediente (`EmployeeOnboardingChecklistAppService`)**:
  - `InitializeChecklistAsync(Guid employeeId)`: Al crearse un empleado (o disparado manualmente), leer todos los `ChecklistOptionCatalog` activos y crear registros en `EmployeeOnboardingChecklist` inicializados en `IsCompleted = false`.
  - `GetByEmployeeAsync(Guid employeeId)`: Devolver la lista actual del empleado (incluyendo el nombre de la opción desde el catálogo).
  - `ToggleTaskStatusAsync(Guid taskId, bool isCompleted, string? notes)`: Cambiar el estado de la tarea. Si es `true`, guardar `CompletedAt = DateTime.UtcNow` y `CompletedByUserId`.

## 3. Frontend - Angular
- **Nuevo Componente `EmployeeOnboardingChecklist`**:
  - Integrarlo en el expediente del empleado (`employee-file` / `employee-file-tabs`).
  - **Acciones:** Un Checkbox o Toggle Switch por cada tarea para cambiar su estado. Al pulsarlo, debe invocar `ToggleTaskStatusAsync`.
  - **UI Detalle:** Mostrar quién y cuándo lo completó si `isCompleted === true`, y un botón/icono para agregar `Notes` a la tarea (ej. "Talla de uniforme M entregada").
- **Catálogo Administrable**:
  - (Opcional en este ticket) Crear una pantalla de configuración (Settings -> Onboarding Checklist) que sea un CRUD estándar (Table -> Form) para dar de alta nuevas opciones al catálogo. Si no se incluye la vista de admin ahora, el backend debe tener el seed o permitir crearlos vía API.
