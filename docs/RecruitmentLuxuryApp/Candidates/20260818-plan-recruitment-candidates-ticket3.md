# Plan de Implementación: Ticket 3 - Refactorización a Catálogo de Documentos Dinámico

## Objetivo
Migrar la lista de documentos requeridos para la contratación desde el enum estático (`DocumentTypeId`) hacia un catálogo administrable (`DocumentCatalog`), permitiendo que recursos humanos configure qué documentos son obligatorios sin requerir un nuevo despliegue.

## 1. Cambios en Base de Datos y Entidades
- **Nueva Entidad `DocumentCatalog`**:
  - `Id` (int o Guid, PK).
  - `Name` / `Description` (string, max 100).
  - `IsMandatory` (bool) - Indica si el alta puede completarse sin este documento.
  - `IsActive` (bool) - Activo o inactivo.
  - Campos de auditoría (opcional/según convención).
  - Ubicación: Módulo de Recursos Humanos (`api/LuxuryApp.Core/Entities/Tenant/RecursosHumanos/Employees`).
- **Modificación en `EmployeeDocument`**:
  - En lugar de usar `DocumentTypeId` (int que mapaba al enum), agregar la FK `DocumentCatalogId`.
  - Crear la relación de navegación `public virtual DocumentCatalog DocumentCatalog { get; set; }`.

## 2. Backend - Lógica y Endpoints
- **Seed de Datos (Migración Inicial)**:
  - Al aplicar la migración EF Core, realizar un seed (o inserción manual/script) para poblar `DocumentCatalog` con los valores actuales del antiguo Enum, de manera que no se rompan los datos existentes.
- **Endpoints del Catálogo**:
  - Crear un CRUD básico o al menos el listado para lectura.
  - **Crítico (§6.1)**: Agregar el endpoint de listado en `SelectItemEndPoints` (ej. `/api/select-items/document-catalog`) devolviendo los documentos activos, y tal vez una propiedad extra o un endpoint aparte para saber si son obligatorios (`IsMandatory`).
- **Validación de Cierre de Alta**:
  - Al momento de que Reclutamiento marca la Solicitud de Alta como "Concluida" o cuando se intenta "Cerrar" el proceso de contratación.
  - Consultar cuántos documentos con `IsMandatory == true` existen en el catálogo.
  - Consultar cuántos de esos documentos tiene el empleado validados (`IsValidated == true`).
  - Si faltan documentos obligatorios, arrojar una `BusinessException`: "Faltan documentos obligatorios en el expediente del empleado."

## 3. Frontend - Listado y Validación
- **Listas de Documentos (`employee-document-list.ts` y `hiring-document-validation.ts`)**:
  - Cambiar el servicio que obtenía las opciones. En lugar de usar el `EnumSelectService` (que leía el enum estático), hacer un `onGetList` al nuevo endpoint de `DocumentCatalog`.
  - Ajustar el HTML para mostrar un asterisco o una etiqueta de "Obligatorio" al lado del nombre del documento si `IsMandatory` es true.
  - El DTO devuelto por el servidor debe traer el nombre del documento directamente del catálogo, por lo que el front ya no dependerá de diccionarios locales.
