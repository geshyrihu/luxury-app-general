# HR Entities: ContratacinyLegal (Simplified) and EvaluacionesdeDesempeo

# HR Entities: ContratacinyLegal (Simplified) and EvaluacionesdeDesempeo

## Clases de ContratacinyLegal

### 1. EmployeeWorkContract
**Tabla:** `EmployeeWorkContracts`

Representa un contrato de trabajo simplificado vinculado a un empleado y una posición laboral específica.

**Propiedades Clave:**
- `EmployeeId` - Relación con `Employee` (requerido)
- `WorkPositionId` - Relación con `WorkPosition` (requerido, histórico)
- `ContractNumber` - Número único del contrato (máx 40, requerido)
- `PdfFilePath` - Ruta del archivo del contrato almacenado en disco (máx 500, requerido)
- `ContractType` - Tipo de contrato (enum ContractType, requerido)
- `Status` - Estatus del contrato (enum ContractStatus, inicia en Borrador)
- `StartDate` - Fecha de inicio (requerido)
- `EndDate` - Fecha de finalización (nullable)
- `SalaryAtContract` - Salario al momento de crear contrato (precisión 9,2, requerido)
- `Notes` - Observaciones (máx 1000)
- `CustomerId` - Cliente propietario (requerido)
- `Addendums` - HashSet de `ContractAddendum` asociados (requerido)

**Implementa:** `ITenantEntity`, `IAuditable`, `ISoftDeletable`

### 2. ContractAddendum
**Tabla:** `ContractAddendums`

Adenda formal para modificar contrato existente sin rescisión.

**Propiedades Clave:**
- `AddendumNumber` - Identificación única (máx 40, requerido)
- `EmployeeWorkContractId` - Relación con `EmployeeWorkContract` (requerido)
- `AddendumType` - Tipo de adenda (enum AddendumType, requerido)
- `Title` - Descripción (máx 200, requerido)
- `AddendumStatus` - Estatus (enum AddendumStatus, inicia en Borrador)

**Implementa:** `IAuditable`, `ISoftDeletable`

---

## Clases de EvaluacionesdeDesempeo

### 6. TemplateQuestion
**Tabla:** `EvaluationQuestions`

Pregunta individual en plantilla de evaluación con ordenamiento.

**Propiedades:**
- `TemplateCategoryId` - Relación con `TemplateCategory` (requerido)
- `QuestionText` - Texto mostrado (requerido)
- `Order` - Ordenamiento (requerido)
- `IsDeleted` - Eliminación lógica (predeterminado false)

### 7. TemplateEvaluation
**Tabla:** `EvaluationTemplates`

Plantilla reutilizable para evaluaciones de desempeño.

**Propiedades Clave:**
- `CustomerId` - Cliente propietario
- `Customer` - Relación con `Customer`
- `Name` - Nombre (máx 255, requerido)
- `Description` - Descripción detallada
- `IsActive` - Disponibilidad (predeterminado true)
- `Categories` - HashSet de `TemplateCategory` (plantilla)
- `PerformanceEvaluations` - HashSet de `PerformanceEvaluation` (ejecuciones)
- `CreatedAt` - Fecha (predeterminado `DateTime.UtcNow`)
- `CreatedById` - Usuario creador (requerido)
- `CreatedBy` - Relación con `ApplicationUser`
- `UpdatedAt` - Actualización opcional
- `UpdatedById` - Usuario actualizador
- `UpdatedBy` - Relación con `ApplicationUser`

**Implementa:** `ITenantEntity`

### 8. TemplateCategory
**Tabla:** `EvaluationCategories`

Categoría agrupadora para preguntas dentro de plantilla.

**Propiedades:**
- `EvaluationTemplateId` - Relación con `TemplateEvaluation`
- `EvaluationTemplate` - Entidad asociada
- `Name` - Nombre (máx 255, requerido)
- `Order` - Ordenamiento (requerido)
- `Questions` - HashSet de `TemplateQuestion` pertenecientes
- `IsDeleted` - Eliminación lógica (predeterminado false)

### 9. PerformanceEvaluation
**Tabla:** `EvaluationStaffs`

Evaluación específica realizada a empleado.

**Propiedades Clave:**
- `EmployeeId` - Empleado evaluado (requerido)
- `Employee` - Relación con `Employee`
- `EvaluatorId` - Usuario evaluador (requerido)
- `Evaluator` - Relación con `ApplicationUser`
- `EvaluationTemplateId` - Plantilla usada (requerido)
- `EvaluationTemplate` - Entidad asociada
- `EvaluationDate` - Fecha (requerido)
- `Status` - Enum `EvaluationStatus` (requerido)
- `FinalScore` - Puntaje decimal (precisión 5,2)
- `FinalComments` - Conclusiones
- `Answers` - HashSet de `EvaluationAnswer` respuestas

### 10. EvaluationAnswer
**Tabla:** `EvaluationAnswers`

Respuesta individual a pregunta con puntaje.

**Propiedades:**
- `PerformanceEvaluationId` - Evaluación padre (requerido)
- `PerformanceEvaluation` - Entidad asociada
- `TemplateQuestionId` - Pregunta plantilla (requerido)
- `TemplateQuestion` - Entidad asociada
- `Score` - Puntaje (1-5, requerido)
- `Comments` - Observaciones

---

## Diagrama de Relaciones

```
    +-------------------+           +-------------------+
    |     Customer      |           |     Employee      |
    +-------------------+           +-------------------+
           |                                 |
   +--------------+               +--------------+
   | EmployeeWorkContract    |             | PerformanceEvaluation |
   +--------------+ +--------------+ +--------------+
           |     |              |     |
   +-----------+ +-----------+ +-----------+
   | ContractAddendum |  | EvaluationAnswer |  |
   +-----------+ +-----------+ +-----------+
           |     |              |     |
   +-------------------+           +-------------------+
   | TemplateEvaluation |           | PerformanceEvaluation |
   +-------------------+           +-------------------+
           |                         |              |
   +--------------+ +--------------+ +-----------+
   | TemplateCategory |  |   PerformanceEvaluation   |
   +--------------+ +--------------+ +-----------+
           |                         |              |
   +--------------+ +--------------+ +-----------+
   | TemplateQuestion |  | EvaluationAnswer |  |
   +--------------+ +--------------+ +-----------+
```

## Relaciones Principales

### ContratacinyLegal
- **EmployeeWorkContract → Employee** (Muchos a Uno)
- **EmployeeWorkContract → WorkPosition** (Muchos a Uno)
- **EmployeeWorkContract → Customer** (Muchos a Uno)
- **EmployeeWorkContract → ContractAddendum** (Uno a Muchos)
- **ContractAddendum → EmployeeWorkContract** (Muchos a Uno)

### EvaluacionesdeDesempeo
- **TemplateEvaluation → Customer** (Muchos a Uno) **ITenantEntity**
- **TemplateEvaluation → TemplateCategory** (Uno a Muchos) **Categories**
- **TemplateEvaluation → PerformanceEvaluation** (Uno a Muchos) **PerformanceEvaluations**
- **TemplateEvaluation → ApplicationUser** (Creador/Actualizador)
- **TemplateCategory → TemplateEvaluation** (Muchos a Uno)
- **TemplateCategory → TemplateQuestion** (Uno a Muchos) **Questions**
- **TemplateQuestion → TemplateCategory** (Muchos a Uno)
- **PerformanceEvaluation → Employee** (Muchos a Uno)
- **PerformanceEvaluation → ApplicationUser** (Evaluador)
- **PerformanceEvaluation → TemplateEvaluation** (Muchos a Uno)
- **PerformanceEvaluation → EvaluationAnswer** (Uno a Muchos) **Answers**
- **EvaluationAnswer → PerformanceEvaluation** (Muchos a Uno)
- **EvaluationAnswer → TemplateQuestion** (Muchos a Uno)

### Entidades Comunes
- Todas las entidades **IAuditable**: `EmployeeWorkContract`, `ContractAddendum`
- Todas las entidades **ISoftDeletable**: `EmployeeWorkContract`, `ContractAddendum`
- Todas las entidades **ITenantEntity**: `EmployeeWorkContract`, `TemplateEvaluation`
- **WorkSchedule** eliminada completamente
- **WorkContract** reemplazada por **EmployeeWorkContract**
- **ContractTemplate** eliminada completamente
- **AddendumTemplate** eliminada completamente

---

## Clases de EvaluacionesdeDesempeo

### 6. TemplateQuestion
**Tabla:** `EvaluationQuestions`

Pregunta individual en plantilla de evaluación con ordenamiento.

**Propiedades:**
- `TemplateCategoryId` - Relación con `TemplateCategory` (requerido)
- `QuestionText` - Texto mostrado (requerido)
- `Order` - Ordenamiento (requerido)
- `IsDeleted` - Eliminación lógica (predeterminado false)

### 7. TemplateEvaluation
**Tabla:** `EvaluationTemplates`

Plantilla reutilizable para evaluaciones de desempeño.

**Propiedades Clave:**
- `CustomerId` - Cliente propietario
- `Customer` - Relación con `Customer`
- `Name` - Nombre (máx 255, requerido)
- `Description` - Descripción detallada
- `IsActive` - Disponibilidad (predeterminado true)
- `Categories` - HashSet de `TemplateCategory` (plantilla)
- `PerformanceEvaluations` - HashSet de `PerformanceEvaluation` (ejecuciones)
- `CreatedAt` - Fecha (predeterminado `DateTime.UtcNow`)
- `CreatedById` - Usuario creador (requerido)
- `CreatedBy` - Relación con `ApplicationUser`
- `UpdatedAt` - Actualización opcional
- `UpdatedById` - Usuario actualizador
- `UpdatedBy` - Relación con `ApplicationUser`

**Implementa:** `ITenantEntity`

### 8. TemplateCategory
**Tabla:** `EvaluationCategories`

Categoría agrupadora para preguntas dentro de plantilla.

**Propiedades:**
- `EvaluationTemplateId` - Relación con `TemplateEvaluation`
- `EvaluationTemplate` - Entidad asociada
- `Name` - Nombre (máx 255, requerido)
- `Order` - Ordenamiento (requerido)
- `Questions` - HashSet de `TemplateQuestion` pertenecientes
- `IsDeleted` - Eliminación lógica (predeterminado false)

### 9. PerformanceEvaluation
**Tabla:** `EvaluationStaffs`

Evaluación específica realizada a empleado.

**Propiedades Clave:**
- `EmployeeId` - Empleado evaluado (requerido)
- `Employee` - Relación con `Employee`
- `EvaluatorId` - Usuario evaluador (requerido)
- `Evaluator` - Relación con `ApplicationUser`
- `EvaluationTemplateId` - Plantilla usada (requerido)
- `EvaluationTemplate` - Entidad asociada
- `EvaluationDate` - Fecha (requerido)
- `Status` - Enum `EvaluationStatus` (requerido)
- `FinalScore` - Puntaje decimal (precisión 5,2)
- `FinalComments` - Conclusiones
- `Answers` - HashSet de `EvaluationAnswer` respuestas

### 10. EvaluationAnswer
**Tabla:** `EvaluationAnswers`

Respuesta individual a pregunta con puntaje.

**Propiedades:**
- `PerformanceEvaluationId` - Evaluación padre (requerido)
- `PerformanceEvaluation` - Entidad asociada
- `TemplateQuestionId` - Pregunta plantilla (requerido)
- `TemplateQuestion` - Entidad asociada
- `Score` - Puntaje (1-5, requerido)
- `Comments` - Observaciones

---

## Clases de EvaluacionesdeDesempeo

### 6. TemplateQuestion
**Tabla:** `EvaluationQuestions`

Pregunta individual en plantilla de evaluación con ordenamiento.

**Propiedades:**
- `TemplateCategoryId` - Relación con `TemplateCategory` (requerido)
- `QuestionText` - Texto mostrado (requerido)
- `Order` - Ordenamiento (requerido)
- `IsDeleted` - Eliminación lógica (predeterminado false)

### 7. TemplateEvaluation
**Tabla:** `EvaluationTemplates`

Plantilla reutilizable para evaluaciones de desempeño.

**Propiedades Clave:**
- `CustomerId` - Cliente propietario
- `Customer` - Relación con `Customer`
- `Name` - Nombre (máx 255, requerido)
- `Description` - Descripción detallada
- `IsActive` - Disponibilidad (predeterminado true)
- `Categories` - HashSet de `TemplateCategory` (plantilla)
- `PerformanceEvaluations` - HashSet de `PerformanceEvaluation` (ejecuciones)
- `CreatedAt` - Fecha (predeterminado `DateTime.UtcNow`)
- `CreatedById` - Usuario creador (requerido)
- `CreatedBy` - Relación con `ApplicationUser`
- `UpdatedAt` - Actualización opcional
- `UpdatedById` - Usuario actualizador
- `UpdatedBy` - Relación con `ApplicationUser`

**Implementa:** `ITenantEntity`

### 8. TemplateCategory
**Tabla:** `EvaluationCategories`

Categoría agrupadora para preguntas dentro de plantilla.

**Propiedades:**
- `EvaluationTemplateId` - Relación con `TemplateEvaluation`
- `EvaluationTemplate` - Entidad asociada
- `Name` - Nombre (máx 255, requerido)
- `Order` - Ordenamiento (requerido)
- `Questions` - HashSet de `TemplateQuestion` pertenecientes
- `IsDeleted` - Eliminación lógica (predeterminado false)

### 9. PerformanceEvaluation
**Tabla:** `EvaluationStaffs`

Evaluación específica realizada a empleado.

**Propiedades Clave:**
- `EmployeeId` - Empleado evaluado (requerido)
- `Employee` - Relación con `Employee`
- `EvaluatorId` - Usuario evaluador (requerido)
- `Evaluator` - Relación con `ApplicationUser`
- `EvaluationTemplateId` - Plantilla usada (requerido)
- `EvaluationTemplate` - Entidad asociada
- `EvaluationDate` - Fecha (requerido)
- `Status` - Enum `EvaluationStatus` (requerido)
- `FinalScore` - Puntaje decimal (precisión 5,2)
- `FinalComments` - Conclusiones
- `Answers` - HashSet de `EvaluationAnswer` respuestas

### 10. EvaluationAnswer
**Tabla:** `EvaluationAnswers`

Respuesta individual a pregunta con puntaje.

**Propiedades:**
- `PerformanceEvaluationId` - Evaluación padre (requerido)
- `PerformanceEvaluation` - Entidad asociada
- `TemplateQuestionId` - Pregunta plantilla (requerido)
- `TemplateQuestion` - Entidad asociada
- `Score` - Puntaje (1-5, requerido)
- `Comments` - Observaciones

---

## Diagrama de Relaciones

```
    +-------------------+           +-------------------+
    |     Customer      |           |     Employee      |
    +-------------------+           +-------------------+
           |                                 |
   +--------------+               +--------------+
   |   EmployeeWorkContract    |             | PerformanceEvaluation |
   +--------------+ +--------------+ +--------------+
           |     |              |     |
   +-----------+ +-----------+ +-----------+
   | ContractAddendum |  | EvaluationAnswer |  |
   +-----------+ +-----------+ +-----------+
           |     |              |     |
   +-------------------+           +-------------------+
   | TemplateEvaluation |           | PerformanceEvaluation |
   +-------------------+           +-------------------+
           |                         |              |
   +--------------+ +--------------+ +-----------+
   | TemplateCategory |  |   PerformanceEvaluation   |
   +--------------+ +--------------+ +-----------+
           |                         |              |
   +--------------+ +--------------+ +-----------+
   | TemplateQuestion |  | EvaluationAnswer |  |
   +--------------+ +--------------+ +-----------+
           |                         |              |
   +-------------------+           +-------------------+
```

## Relaciones Principales

### ContratacinyLegal
- **EmployeeWorkContract → Employee** (Muchos a Uno)
- **EmployeeWorkContract → ContractAddendum** (Uno a Muchos)
- **ContractAddendum → EmployeeWorkContract** (Muchos a Uno)

### EvaluacionesdeDesempeo
- **TemplateEvaluation → Customer** (Muchos a Uno) **ITenantEntity**
- **TemplateEvaluation → TemplateCategory** (Uno a Muchos) **Categories**
- **TemplateEvaluation → PerformanceEvaluation** (Uno a Muchos) **PerformanceEvaluations**
- **TemplateEvaluation → ApplicationUser** (Creador/Actualizador)
- **TemplateCategory → TemplateEvaluation** (Muchos a Uno)
- **TemplateCategory → TemplateQuestion** (Uno a Muchos) **Questions**
- **TemplateQuestion → TemplateCategory** (Muchos a Uno)
- **PerformanceEvaluation → Employee** (Muchos a Uno)
- **PerformanceEvaluation → ApplicationUser** (Evaluador)
- **PerformanceEvaluation → TemplateEvaluation** (Muchos a Uno)
- **PerformanceEvaluation → EvaluationAnswer** (Uno a Muchos) **Answers**
- **EvaluationAnswer → PerformanceEvaluation** (Muchos a Uno)
- **EvaluationAnswer → TemplateQuestion** (Muchos a Uno)

### Entidades Comunes
- Todas las entidades **ITenantEntity**: `TemplateEvaluation`
- **WorkSchedule** eliminada completamente
- **ContractTemplate** eliminada completamente
- **WorkContract** reemplazada por **EmployeeWorkContract**
