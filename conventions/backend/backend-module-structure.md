# Backend Module Structure

**Ultima revision:** 2026-07-30

## Proposito

Definir la estructura obligatoria por modulo backend.

## Estructura base

- Carpeta maestra por dominio: `AdminLuxuryApp`, `ContabilidadLuxuryApp`, etc.
- Dentro del modulo aplicar segun corresponda:
  - `EndPoints`
  - `DTOs`
  - `Interfaces`
  - `Services`
  - `Documentation`
  - `Jobs`
  - `Shared`

## Ejemplo real de dominio maestro

- [Banks backend](../../api/LuxuryApp.Application/AdminLuxuryApp/CatalogosGenerales/Banks)

## Reglas de uso por carpeta

- `EndPoints`
  - definicion de rutas y orquestacion minima
- `DTOs`
  - contratos locales del modulo
  - un archivo por DTO
  - si el DTO declara `Id`, debe heredar de `GuidIdEntityDTO`
- `Interfaces`
  - interfaces de servicios del modulo
- `Services`
  - logica de aplicacion del modulo
- `Documentation`
  - documentacion especifica del modulo
- `Jobs`
  - procesos programados o diferidos propios del modulo
- `Shared`
  - uso excepcional y controlado; no tocar sin analisis de impacto

## Regla especial

Si no esta claro en que carpeta maestra vive una pieza nueva, el agente propone
ubicacion y espera aprobacion antes de crear.

## Antipatrones

- Crear un modulo nuevo fuera del dominio maestro correcto.
- Meter logica de servicio en `EndPoints`.
- Usar `Shared` como cajon general para evitar ubicar bien una pieza.
- Agrupar varios DTOs del modulo en un solo archivo sin justificacion aprobada.
- Declarar un DTO con `Id` propio sin heredar de `GuidIdEntityDTO`.

