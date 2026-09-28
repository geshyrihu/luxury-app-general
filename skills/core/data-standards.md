# Global Data Standards and Identifiers

> **Deep-dive:** las reglas generales de nombrado están en CONVENTIONS.md §7 (Nombrado) y §9 (Backend). Este archivo contiene ejemplos detallados.

## 1.1. Identificadores (IDs)
- **Tipo de Dato**: Todos los IDs de base de datos **DEBEN** ser de tipo `Guid`.
- **Backend (C#)**: `public Guid Id { get; set; }`
- **Frontend (TS)**: `id: string; // Representación del GUID`
- **Generación**: Se prefiere `Guid.CreateVersion7()` para ordenación cronológica por ID.

## 1.2. Nomenclatura DTO / Interfaces
- **Sufijo Backend**: `DTO` en mayúsculas (ej. `BankDTO`). Prohibido `Dto` en backend. **Contraparte Angular**: `Dto` (ej. `BankDto`). Prohibido prefijo `I`.
- **Backend (.NET)**: Cada DTO debe tener su propio archivo físico `.cs`. Prohibido agrupar múltiples clases DTO en un archivo.
- **Frontend (Angular)**: Un tipo por archivo en `interfaces/` (no `models/`). Archivo `banks.dto.ts` para DTOs, `banks.interface.ts` para interfaces de dominio/vista/estado.

## 1.4. Atributos de Visualización (Display Name)
Es **estrictamente obligatorio** que todas las propiedades incluyan el atributo `[Display(Name = "Nombre en Español")]`.
- Garantiza que los componentes automáticos de la UI y los mensajes de error utilicen términos legibles.

## 1.5. Paginación y Grandes Volúmenes
- **Objeto**: Usar `PaginationCommonDTO<T>`.
- **Regla**: El filtrado y ordenación debe ocurrir en el API mediante `IQueryable` antes de ejecutar `.Skip().Take().ToList()`.
- **pageSize máximo**: El valor no puede superar **200**. Si se envía mayor, se trunca a 200.

## 1.6. Mapeo de Enums
- **Convención**: Los enums se almacenan como **`string`** en la base de datos (no enteros) para legibilidad SQL.
- **Sincronización**: Los valores string deben ser idénticos en C# y TypeScript.
- **DTOs de Lista**: Deben usar `string` para recibir el `DisplayName` (ej. `"Leve"`).
- **DTOs de Formulario/Edición**: Deben usar el valor técnico o `int` para que los Selects hagan match correctamente.
