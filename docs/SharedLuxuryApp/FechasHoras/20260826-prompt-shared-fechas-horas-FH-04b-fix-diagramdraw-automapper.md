# TICKET FH-04b-fix — Corrección: `DiagramDrawMapping.cs` deja `UpdateAt` en `0001-01-01`

Continuación de FH-04b. Al auditar el resultado, se confirmó una regresión real que ni el ticket
original ni el ejecutor detectaron.

## Qué pasó

`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Diagram/Mapping/DiagramDrawMapping.cs:8`:

```csharp
CreateMap<DiagramDraw, DiagramDrawDTO>();
```

Sin ningún `.ForMember`, es un mapeo por convención de nombres. Antes de FH-04b, `DiagramDraw`
tenía una propiedad `UpdateAt` que coincidía en nombre con `DiagramDrawDTO.UpdateAt`
(`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Diagram/DTOs/DiagramDrawDTO.cs:15`,
`DateTime` no nulo) — AutoMapper los enlazaba automáticamente. FH-04b dividió `UpdateAt` en
`CreatedAt`/`UpdatedAt` en la entidad; **ningún nombre coincide ya con `UpdateAt` del DTO**, así
que AutoMapper deja `DiagramDrawDTO.UpdateAt` en su valor por defecto: `0001-01-01T00:00:00`.

Esto afecta a los 3 métodos de `DiagramDrawService.cs` que usan `mapper.Map<DiagramDrawDTO>(...)`:
- `GetDiagramByIdAsync` (línea 46)
- `CreateDiagramAsync`, en el `return` (línea 68)
- `UpdateDiagramAsync`, en el `return` (línea 129)

**No afecta** a `GetDiagramsAsync` (la lista) — ese método construye el DTO manualmente con
`.Select(...)` y ya usa `UpdatedAt ?? CreatedAt` correctamente desde FH-04b.

En la práctica: quien abra el detalle de un diagrama, o lo cree, o lo edite, vería
"01/01/0001" (o el equivalente que renderice el frontend) como fecha de última actualización, en
vez de la fecha real.

## Tarea

Archivo: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Diagram/Mapping/DiagramDrawMapping.cs`

Cambia:
```csharp
CreateMap<DiagramDraw, DiagramDrawDTO>();
```
por:
```csharp
CreateMap<DiagramDraw, DiagramDrawDTO>()
    .ForMember(dest => dest.UpdateAt, opt => opt.MapFrom(src => src.UpdatedAt ?? src.CreatedAt));
```

No toques `CreateMap<CreateDiagramDrawDTO, DiagramDraw>()` ni `CreateMap<UpdateDiagramDrawDTO, DiagramDraw>()` — son mapeos en la otra dirección (DTO de entrada → entidad) y no tienen relación con este problema (no existe ningún campo `UpdateAt`/`CreatedAt`/`UpdatedAt` en `CreateDiagramDrawDTO` ni `UpdateDiagramDrawDTO` — verifícalo con un grep rápido antes de dar el ticket por cerrado, no lo asumas).

## Verificación en tiempo de ejecución, no solo build

Un `CreateMap` mal configurado **no falla en `dotnet build`** — AutoMapper resuelve esto en
tiempo de ejecución. Además de compilar, corre lo siguiente para confirmarlo:

```bash
dotnet build api/LuxuryApp.sln -o .tmp-audit-build
```

Si el proyecto tiene algún test que llame a `AssertConfigurationIsValid()` sobre los perfiles de
AutoMapper (busca con `grep -rn "AssertConfigurationIsValid" api/LuxuryApp.Tests/`), corre ese test
específico y repórtalo. Si no existe ningún test así, repórtalo también — es un hallazgo en sí
mismo (esta clase de bug es exactamente lo que ese assert detectaría, y no está cubierto).

## Lo que NO debes hacer

- No toques ningún otro `CreateMap` de este archivo ni de otros perfiles.
- No agregues manejo de fecha en el DTO ni cambies su nombre (`UpdateAt` sigue siendo el contrato
  de salida hacia el frontend).
- No repitas este patrón "por si acaso" en otros DTOs que no reportaron el problema — este ticket
  es solo `DiagramDrawMapping.cs`.

## Verificación obligatoria

```bash
grep -n "CreateMap<DiagramDraw, DiagramDrawDTO>" api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Diagram/Mapping/DiagramDrawMapping.cs
# Debe mostrar el .ForMember encadenado

node scripts/audit-conventions.mjs
node scripts/scan-mojibake.mjs api
```

## Criterio de PASO

- `CreateMap<DiagramDraw, DiagramDrawDTO>()` tiene el `.ForMember` para `UpdateAt`.
- Build sin errores nuevos.
- `audit-conventions.mjs`/`scan-mojibake.mjs` sin regresión.

## Reporte de finalización

1. Diff exacto de `DiagramDrawMapping.cs`.
2. Qué encontraste sobre `AssertConfigurationIsValid()` en los tests (existe o no, y si corriste
   algo).
3. Confirmación de que `CreateDiagramDrawDTO`/`UpdateDiagramDrawDTO` no tienen campos de fecha
   relacionados (grep).
4. Salida literal de los comandos de verificación.

Con esto se cierra FH-04b por completo. No avances a ningún otro ticket. Espera la auditoría.
