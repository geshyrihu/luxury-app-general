# Plan de Refactorización: Separación de Entidad Beneficiario

## Contexto y Problema
Actualmente, los datos del **Beneficiario** (Nombre, Teléfono, Parentesco) se encuentran acoplados dentro de la entidad `EmployeeBankData` en la base de datos (columnas `NameContact`, `PhoneNumber`, `Relation`), y el frontend agrupa ambas entidades bajo "Datos bancarios y beneficiario". 
Esto viola el principio de responsabilidad única, ya que los datos bancarios y los beneficiarios son dominios de negocio distintos. Se solicita separar esto en tres entidades aisladas:
1. `EmployeeBankData` (Datos Bancarios)
2. `EmployeeEmergencyContact` (Contacto de Emergencia - *Ya existe y es independiente*)
3. `EmployeeBeneficiary` (Beneficiario - *Nueva Entidad*)

## Reglas y Convenciones a Aplicar
- Se debe observar `CONVENTIONS.md` y `conventions/core/` en relación al nombrado de endpoints y carpetas.
- El código Backend irá a `api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/EmployeeBeneficiary/`.
- El código Frontend irá a `client/angular/src/app/apps/reclutamiento.luxuryapp/expediente-del-empleado/employee-beneficiary/`.

## Pasos de Ejecución para Agente CLI (Aider / Claude Code)

### Tarea de Backend (C# / Entity Framework)
1. **Crear nueva entidad** `EmployeeBeneficiary` en `api/LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp/Domain/Entities/ExpedientedelEmpleado/`.
   - Propiedades obligatorias: `EmployeeId` (Guid), `FullName` (string 50), `PhoneNumber` (string 16), `Relation` (enum `RelationEmployee`).
2. **Modificar** `EmployeeBankData`: remover propiedades `NameContact`, `PhoneNumber` y `Relacion`.
3. **Módulo de Aplicación**:
   - Crear subcarpeta `EmployeeBeneficiary` en el módulo de Recursos Humanos.
   - Construir DTOs: `EmployeeBeneficiaryListDto`, `EmployeeBeneficiaryCreateDto`, etc.
   - Desarrollar `IEmployeeBeneficiaryAppService` y `EmployeeBeneficiaryAppService` con el CRUD estándar.
   - Desarrollar `EmployeeBeneficiaryEndPoints` siguiendo el estándar del sistema.
4. **Contexto y Migración**:
   - Registrar `DbSet<EmployeeBeneficiary>` en `ApplicationDbContext`.
   - Generar la migración EF.
   - **IMPORTANTE:** Editar manualmente el archivo `Up()` de la migración generada para insertar los datos existentes de `EmployeeBankData` hacia `EmployeeBeneficiary` ANTES de que haga el `DropColumn` de dichas propiedades.

### Tarea de Frontend (Angular 22)
1. **Módulo de Beneficiario**:
   - Construir `employee-beneficiary-list` y `employee-beneficiary-form` (y sus respectivos archivos `.ts`, `.html`).
   - Crear el servicio HTTP `EmployeeBeneficiaryApiService`.
2. **Limpiar Datos Bancarios**:
   - En `employee-bank-data-list.html` y `.ts`, eliminar las columnas y referencias a Beneficiario, Teléfono y Parentesco.
   - Igualmente en `employee-bank-data-form`.
3. **Refactorización de Vista Orquestadora**:
   - En el layout donde está la "Ficha de empleado" (probablemente `employee-dashboard` o `administrar-empleado`), renombrar la pestaña "Datos bancarios y beneficiario" a "Datos bancarios".
   - Agregar una nueva pestaña/botón dedicado a "Beneficiario" que renderice el nuevo componente `<app-employee-beneficiary-list>`.

## Instrucción de Comandos y Comprobación
El agente CLI deberá correr:
1. `dotnet build` en la carpeta `api` y asegurarse que compile sin errores.
2. `dotnet ef migrations add ExtractEmployeeBeneficiary -p api/LuxuryApp.Infrastructure.Data -s api/LuxuryApp.Api`
3. Modificar la migración para salvaguardar los datos.
4. `npm run build` en `client/angular`.
5. Reportar al Orquestador (yo) cuando haya terminado para proceder a la validación.

