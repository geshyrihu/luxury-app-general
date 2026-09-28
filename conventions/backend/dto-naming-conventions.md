# Regla de Nomenclatura de DTOs (Data Transfer Objects)

**Versión:** 1.0  
**Fecha:** 2026-09-11  
**Severidad:** ALTA  
**Fuente rectora:** `conventions/CONVENTIONS.md` (Alineado con `api-method-naming-conventions.md`)

## 1. Regla General

Todo DTO debe terminar con el sufijo `DTO` (en mayúsculas) y su prefijo debe indicar claramente **qué entidad representa** y **qué operación** realiza, haciendo match exacto con el nombre de la Entidad en C# (inglés singular).

## 2. DTOs por Operación CRUD (El Estándar)

Para una entidad hipotética llamada `Pool` (antes `Piscina`), los DTOs deben llamarse estrictamente de la siguiente manera para coincidir con el catálogo de métodos de la API:

| Operación API (Verbo) | Nombre del Método C# | Nombre del DTO Requerido | Propósito |
|---|---|---|---|
| Consulta (GET) | `GetByIdAsync`, `GetListAsync` | **`[Entity]DTO`**<br>(ej. `PoolDTO`) | DTO de salida (Response). Contiene todos los datos de lectura, incluyendo `Id` y campos vinculados. |
| Alta (POST) | `CreateAsync` | **`Create[Entity]DTO`**<br>(ej. `CreatePoolDTO`) | DTO de entrada (Request). No incluye `Id` ni campos de sistema (ej. `CreatedAt`). Solo datos para insertar. |
| Modificación (PUT) | `UpdateAsync` | **`Update[Entity]DTO`**<br>(ej. `UpdatePoolDTO`) | DTO de entrada (Request). Incluye los campos que pueden ser alterados. (El `Id` viaja por la URL, no se duplica en el body). |

## 3. Prácticas Prohibidas (Anti-patrones)

- ❌ **Spanglish o Español:** `PiscinaDTO`, `CreateBitacoraDTO`. *(Deben migrarse al nombre en inglés).*
- ❌ **Multi-propósito (`AddOrEdit`):** `PoolAddOrEditDTO`. *(PROHIBIDO: crear y editar tienen reglas de validación distintas. Separarlos en `Create` y `Update`).*
- ❌ **Prefijos Genéricos:** `SavePoolDTO`, `UpsertPoolDTO`. 
- ❌ **Sufijos Incorrectos:** `PoolDto` (minúsculas), `PoolViewModel`, `PoolRequest`, `PoolResponse`. *(El sufijo oficial es estrictamente `DTO`).*

## 4. DTOs Especializados (Reglas Avanzadas)

Cuando un DTO no mapea el 100% de la entidad principal, o se trata de una acción de negocio específica, se utiliza un sustantivo o verbo que describa el caso de uso exacto:

- **Listas ultra ligeras:** `[Entity]SummaryDTO` (ej. `PoolSummaryDTO` si solo devuelve el `Id` y `Name` para selects rápidos).
- **Acciones de Negocio (POST mutantes):** `[Action][Entity]DTO` (ej. `ChangeStatusPoolDTO`, `AssignManagerPoolDTO`).
- **Filtros de Búsqueda (GET querystrings):** `[Entity]FilterDTO` (ej. `PoolFilterDTO`).

## 5. Regla de Herencia Obligatoria

Conforme a `CONVENTIONS.md §6.1`:
- Todo DTO de salida que declare un identificador principal debe heredar obligatoriamente de `GuidIdEntityDTO` (o la clase base de identidad correspondiente al proyecto).

## 6. Sincronización con Frontend (Angular)

Los nombres de las clases en C# impactan directamente el contrato de red y, si se usa autogeneración (Swagger/OpenAPI), impactan la tipificación del frontend.
- C# Clase: `PoolDTO`
- TS Clase/Interfaz: `PoolDTO`
- TS Archivo: `pool.dto.ts` (kebab-case conforme a `CONVENTIONS_FOLDER-FRONT.MD`).

Toda migración de un DTO a este estándar requerirá la actualización simultánea del cliente de Angular que lo consume.

---

*Regla: dto-naming-conventions.md*  
*Vigente desde: 2026-09-11*
