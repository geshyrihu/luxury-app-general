# Backend Architecture (.NET 10)

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §9. Este archivo contiene ejemplos detallados.

## 2.1. Primary Constructors
- **Obligatorio**: Uso de Primary Constructors.
- **No declarar** campos privados `_service`. El parámetro es accesible en toda la clase.
- **Formato**: Si supera los 3 parámetros, usar formato multilínea.

## 2.4. Controladores Thin
- Los controladores solo deben invocar el AppService.
- Sin lógica de negocio. Preferir declaración tipo flecha `=>`.

## 2.5. Respuestas ApiResponseDTO<T>
- **Obligatorio**: Todos los métodos de AppServices y controladores deben retornar `ApiResponseDTO<T>`.
- Estructura: `{ Success, Data, Message, Errors }`.
- El `Message` de error debe ser **específico y siempre en español**.

## 2.6. Convención de Naming de Endpoints
- Nombres en **minúsculas** y formato **kebab-case**.
- Ejemplo: `[HttpGet("operation-report")]`.

## 2.7. Estructura de Namespaces
- `Controller/` -> `LuxuryApp.Application.Controller`
- `DTOs/` -> `LuxuryApp.Application.DTOs`
- `Interfaces/` -> `LuxuryApp.Application.Interfaces`
- `Services/` -> `LuxuryApp.Application.Services`

## 2.9. Procesos de Fondo (Background Jobs)
- Crear siempre un `IServiceScope` manual para resolver servicios Scoped.
- Simular un "Usuario de Sistema" para servicios que dependen de `ICurrentUserService`.
