# Naming Conventions

**Ultima revision:** 2026-09-04

## Alcance

Debe normar nombres para:

- modulos
- features
- componentes
- servicios
- DTOs
- interfaces
- enums
- pipes
- helpers
- endpoints
- archivos
- carpetas
- namespaces

## Regla transversal

Backend y frontend deben corresponderse semanticamente; cada stack aplica su
convencion de nombre sin perder la identidad del modulo.

## DTOs

**REGLA EXPLICITA:** Todo DTO (clase o record) y su archivo terminan en `DTO` (mayusculas).

```csharp
// ✅ CORRECTO
public record CandidateCreateOrUpdateDTO { ... }
public record WorkPositionScheduleDetailDTO { ... }

// ❌ PROHIBIDO
public record CandidateCreateOrUpdateDto { ... }
public record WorkPositionScheduleDetailDto { ... }
```

**Archivo:** el nombre del archivo debe coincidir exactamente con el nombre del DTO.
`CandidateCreateOrUpdateDTO.cs` contiene `CandidateCreateOrUpdateDTO`.

**Razon:** consistencia con el folder `DTOs/`, los ejemplos de `backend-rules.md` y
`CONVENTIONS.md` §6.1. El sufijo `DTO` (mayusculas) es la convencion vigente del proyecto.

