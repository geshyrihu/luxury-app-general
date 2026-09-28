# Fase 9: LegalLuxuryApp (Vertical Slices)

## Objetivo

Se aplicó el Estándar de Oro al módulo `LegalLuxuryApp`: cortes verticales puros, eliminación de wrappers arquitectónicos, namespaces basados en ruta física y verificación completa a nivel solución.

## Gestión de bitácoras

- Se creó este archivo en `docs/changelogs/11_fase9_legal.md`.

## Rescate de entidades

Se inspeccionó `Modules/SystemLuxuryApp/Domain/Entities/` buscando entidades relacionadas con legal: contratos, multas, demandas, asuntos legales, categorías y expedientes.

Se rescató una entidad clara de Legal desde System:

- `SystemLuxuryApp/Domain/Entities/Catalogs/LegalMatterCategory.cs` -> `LegalLuxuryApp/Legal/LegalMatter/Entities/LegalMatterCategory.cs`

## Acomodo físico aplicado

Se eliminó la capa envolvente `Modules/LegalLuxuryApp/Domain/` y se reubicaron sus entidades en sus cortes verticales correspondientes:

- `Domain/Entities/AsuntosLegalesySeguros/ContratoPoliza.cs` -> `Legal/ContractPolicy/Entities/ContratoPoliza.cs`
- `Domain/Entities/AsuntosLegalesySeguros/LegalMatter.cs` -> `Legal/LegalMatter/Entities/LegalMatter.cs`
- `Domain/Entities/AsuntosLegalesySeguros/PolicySnapshot.cs` -> `Legal/LegalMatter/Entities/PolicySnapshot.cs`
- `Domain/Entities/AsuntosLegalesySeguros/RegulationArticle.cs` -> `Legal/LegalMatter/Entities/RegulationArticle.cs`
- `Domain/Entities/AsuntosLegalesySeguros/ResponsiblePartySnapshot.cs` -> `Legal/LegalMatter/Entities/ResponsiblePartySnapshot.cs`
- `Domain/Entities/Fines/FineEvidence.cs` -> `Legal/Fines/Entities/FineEvidence.cs`
- `Domain/Entities/Fines/PropertyFine.cs` -> `Legal/Fines/Entities/PropertyFine.cs`

Resultado estructural:

- 0 carpetas `Domain`, `Application` o `Infrastructure` dentro de `LegalLuxuryApp`.
- 0 carpetas con nombres inválidos para namespaces C#.
- 36 archivos `.cs` conservados dentro del módulo.

## Sincronización de namespaces

Se reescribieron los namespaces de los 36 archivos C# de `LegalLuxuryApp` al formato path-based:

`LuxuryApp.Application.Modules.LegalLuxuryApp.[RutaFisica]`

Ejemplos aplicados:

- `Employees/EndPoints` -> `LuxuryApp.Application.Modules.LegalLuxuryApp.Employees.EndPoints`
- `Legal/ContractPolicy/Entities` -> `LuxuryApp.Application.Modules.LegalLuxuryApp.Legal.ContractPolicy.Entities`
- `Legal/LegalMatter/Entities` -> `LuxuryApp.Application.Modules.LegalLuxuryApp.Legal.LegalMatter.Entities`
- `Legal/Fines/Entities` -> `LuxuryApp.Application.Modules.LegalLuxuryApp.Legal.Fines.Entities`

Se agregaron los puentes globales necesarios en:

- `LuxuryApp.Application/GlobalUsings.cs`
- `LuxuryApp.Api/GlobalUsings.cs`
- `LuxuryApp.Tests/GlobalUsings.cs`

## Resolución de dependencias y colisiones

La colisión principal fue entre el submódulo `LegalMatter` y la entidad `LegalMatter`. Se resolvió con alias limpio:

- `LegalMatterEntity = LuxuryApp.Application.Modules.LegalLuxuryApp.Legal.LegalMatter.Entities.LegalMatter`

No se introdujeron usos inline de `global::` para Legal.

## Verificación

Comando ejecutado:

```powershell
dotnet build LuxuryApp.sln
```

Resultado final:

```text
Compilación correcta.
0 Advertencia(s)
0 Errores
```

Certificación de cierre:

- 0 errores.
- 0 advertencias.
- 0 wrappers arquitectónicos dentro de `LegalLuxuryApp`.
- 0 namespaces fuera del estándar path-based.
- 0 carpetas inválidas para C#.
- 0 usos inline de `global::` para Legal.
