# PASO 0.5: Reconocimiento de Estructura de Entidades (Onboarding Checklist)

## Resumen de la Exploración
Se ha analizado la estructura de base de datos relacionada con el proceso de "Onboarding" del empleado en el dominio de Recursos Humanos (`Tenant/Hr/ExpedientedelEmpleado`).

Se identificaron **2 entidades principales** que ya existen en el código y están debidamente mapeadas en `ApplicationDbContext.cs`.

---

## 1. Catálogo Dinámico de Tareas
**Clase:** `ChecklistOptionCatalog`
**Tabla:** `ChecklistOptionCatalogs`
**Ruta:** `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Hr/ExpedientedelEmpleado/ChecklistOptionCatalog.cs`

Esta entidad representa las "plantillas" o el catálogo global de tareas que un empleado debe cumplir al ingresar (ej. "Entrega de Uniforme", "Alta en biométrico", "Firma de contrato").
*Nota Arquitectónica:* No implementa `ITenantEntity`, por lo que es un catálogo transversal a toda la plataforma (global), aplicable a cualquier cliente/empresa.

**Propiedades de Negocio:**
- `Id` (Guid): Identificador único de la opción.
- `Name` (String): El nombre de la tarea a realizar (ej. "Entrega de Uniforme").
- `Description` (String): Detalles operativos de la tarea.
- `IsActive` (Bool): Indica si esta tarea se sigue exigiendo a los nuevos ingresos o si ya fue descontinuada.
- *Auditoría:* `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy` (Rastreo de quién dio de alta la tarea en el catálogo).

---

## 2. Registro Transaccional por Empleado (El Progreso real)
**Clase:** `EmployeeOnboardingChecklist`
**Tabla:** `EmployeeOnboardingChecklists`
**Ruta:** `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Hr/ExpedientedelEmpleado/EmployeeOnboardingChecklist.cs`

Esta es la tabla pivote transaccional. Conecta a un `Employee` específico con una tarea del `ChecklistOptionCatalog`. Es aquí donde se lleva el control real de si Juan Pérez ya recibió su uniforme y quién se lo entregó.

**Configuración especial (`ApplicationDbContext.cs`):**
Existe un índice único compuesto: `[EmployeeId, ChecklistOptionCatalogId]`. Esto garantiza matemáticamente que a un empleado no se le pueda asignar (o cobrar) la misma tarea de onboarding dos veces.

**Propiedades de Negocio:**
- `Id` (Guid): Llave primaria transaccional.
- `EmployeeId` (Guid / Navegación): Relación N:1 con el empleado que está cursando el onboarding.
- `ChecklistOptionCatalogId` (Guid / Navegación): La tarea que debe cumplir.
- `IsCompleted` (Bool): El estado de la tarea (Pendiente vs Completada).
- `CompletedAt` (DateTime?): Sello de tiempo exacto de cuándo se finalizó la tarea.
- `CompletedByUserId` / `CompletedByUser`: El usuario del sistema (RRHH, Almacén, Operaciones) que dio fe de que la tarea se cumplió.
- `Notes` (String): Observaciones al completar (ej. "Se entregó talla M porque no había G").
- *Auditoría:* `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`.

---

## Conclusión del Análisis
- **El Modelo de Datos ya está maduro.** No necesitamos inventar tablas nuevas. El diseño soporta N tareas por empleado, con protección contra duplicados (Índice Único) y trazabilidad completa de quién autoriza cada paso.
- **GAPs Detectados:** 
  1. ¿En qué momento se insertan estos registros transaccionales? (¿Al contratar? ¿Un trigger? ¿Manual?).
  2. ¿Hay tareas que dependen del puesto (ej. radio para guardias, laptop para contadores) o son estáticas para todos?
  3. No se observa una bandera de "Obligatorio vs Opcional" en el catálogo, lo que asume que todas son obligatorias.
