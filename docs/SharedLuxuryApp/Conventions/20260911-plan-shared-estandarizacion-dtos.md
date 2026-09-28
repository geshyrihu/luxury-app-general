# Plan de Estandarización de Nombres de DTOs - LuxuryApp

> **Tipo:** Plan de Refactorización Estructural (Fase 4)
> **Fecha:** 2026-09-11
> **Estado:** EN CURSO - FASE 0 (Planeación e Inventario)
> **Fuente rectora:** `conventions/backend/dto-naming-conventions.md`

## 1. Resumen Ejecutivo

Actualmente, el proyecto cuenta con 908 archivos de DTOs repartidos en 15 módulos. Existe una gran inconsistencia en su nomenclatura, predominando anti-patrones como Spanglish (`PiscinaDTO`), nombres multipropósito (`PoolAddOrEditDTO`), o prefijos genéricos (`SavePoolDTO`).

Este plan establece la estrategia de migración masiva por oleadas (Waves) para alinear estrictamente todos los DTOs con las convenciones oficiales y las entidades de C#.

### Regla de Oro (Conforme a `dto-naming-conventions.md`)
- `[Entity]DTO`: Exclusivo para salida (GET).
- `Create[Entity]DTO`: Exclusivo para entrada de altas (POST).
- `Update[Entity]DTO`: Exclusivo para entrada de ediciones (PUT/PATCH).
- `[Action][Entity]DTO`: Acciones específicas de negocio.

## 2. Inventario Base (908 DTOs)

| Módulo | Cantidad de DTOs | Nivel de Riesgo / Acoplamiento |
|---|---:|---|
| `ManagementLuxuryApp` | 2 | Muy Bajo |
| `LegalLuxuryApp` | 12 | Bajo |
| `CommitteeLuxuryApp` | 13 | Bajo |
| `AuthLuxuryApp` | 15 | Alto (Seguridad) |
| `SharedLuxuryApp` | 32 | Alto (Transversal) |
| `SystemLuxuryApp` | 36 | Bajo (Catálogos) |
| `AdminLuxuryApp` | 39 | Bajo |
| `HumanResourcesLuxuryApp` | 48 | Medio |
| `SupplierLuxuryApp` | 51 | Medio |
| `CollectionsLuxuryApp` | 69 | Alto (Core Contable) |
| `MaintenanceLuxuryApp` | 78 | Medio |
| `AccountingLuxuryApp` | 114 | Alto (Core Contable) |
| `RecruitmentLuxuryApp` | 138 | Medio |
| `OperationsLuxuryApp` | 227 | Alto (Core Operativo) |
| **Total** | **908** | |

## 3. Fases de Ejecución (Oleadas)

Para mitigar el riesgo de romper dependencias cruzadas y evitar conflictos de Git masivos, la migración se dividirá en 5 oleadas estratégicas.

### Ola 1 - Piloto y Catálogos (Bajo Riesgo)
- **Módulos:** `SystemLuxuryApp`, `AdminLuxuryApp`, `ManagementLuxuryApp`, `CommitteeLuxuryApp`, `LegalLuxuryApp`.
- **Objetivo:** Aplicar las reglas en módulos periféricos, probar los scripts del agente CLI y validar el impacto en el compilador.

### Ola 2 - Core Transversal e Integraciones
- **Módulos:** `SharedLuxuryApp`, `AuthLuxuryApp`, `SupplierLuxuryApp`.
- **Objetivo:** Modificar los DTOs que son consumidos por otros módulos. Requiere actualización de namespaces cruzados.

### Ola 3 - Operaciones Terreno
- **Módulos:** `MaintenanceLuxuryApp`, `HumanResourcesLuxuryApp`, `RecruitmentLuxuryApp`.
- **Objetivo:** Estandarizar el grueso de los DTOs operativos.

### Ola 4 - Core Financiero y Operativo Pesado
- **Módulos:** `CollectionsLuxuryApp`, `AccountingLuxuryApp`.
- **Objetivo:** Refactorizar el corazón transaccional. Exige máxima cobertura de pruebas para no alterar lógicas contables.

### Ola 5 - El Monstruo Operativo
- **Módulos:** `OperationsLuxuryApp` (227 DTOs).
- **Objetivo:** Desacoplar y refactorizar el módulo más masivo del sistema una vez que la técnica del CLI esté perfeccionada.

---

## 4. Prompts Estructurados de Ejecución (Orquestación)

Los siguientes Prompts están diseñados para ser copiados y pegados en el agente CLI (ej. Aider, Cline) para que ejecute el código de forma segura.

### 📋 Prompt para Ejecutar la OLA 1

```text
Rol: Eres el agente CLI encargado de ejecutar refactorizaciones estructurales en C#.
Tarea: Migrar los DTOs de los módulos [SystemLuxuryApp, AdminLuxuryApp, ManagementLuxuryApp, CommitteeLuxuryApp, LegalLuxuryApp] conforme a la convención oficial.

Reglas Obligatorias:
1. Lee estrictamente: conventions/backend/dto-naming-conventions.md y conventions/backend/dto-file-organization-rule.md
2. Localiza todos los DTOs en las carpetas "api/LuxuryApp.Application/Modules/[Modulo]/...".
3. Transforma los DTOs multipropósito (ej. AddOrEdit) separándolos en 2 archivos distintos: Create[Entity]DTO.cs y Update[Entity]DTO.cs.
4. Traduce los nombres Spanglish/Español a su Entity equivalente en Inglés (ej. BitacoraDTO -> MaintenanceLogDTO).
5. Actualiza las interfaces (IAppService), implementaciones (AppService) y controladores/Endpoints asociados en el mismo PR para que el código compile.
6. NO toques lógicas de negocio, validaciones internas o Fluent API.

Criterio de Éxito:
Al finalizar, ejecuta `dotnet build api/LuxuryApp.Api` y verifica que existan 0 errores antes de dar el reporte de finalización.
```

