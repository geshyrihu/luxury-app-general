# Bitácora: Migración de Nombres de Carpetas a Inglés y Espejo Entities ↔ Modules

**Fecha:** 2026-09-19
**Autor:** Agente (ejecución por bloques, build+commit por bloque)
**Ámbito:** `api/LuxuryApp.Application`, `api/LuxuryApp.Api`, `api/LuxuryApp.Tests`

## Reglas aplicadas

- Carpetas y namespaces **100% inglés** (`CONVENTIONS.md`, `CONVENTIONS_FOLDER_API.MD` §2).
- Carpetas en **plural**, clases en **singular**; prohibida colisión carpeta/clase (§3, §5.3, §5.4).
- Entidades: ruta espejo de `Modules/` y namespace `Entities.<Module>.<Submodule>[.<Submodule>]` (prefijo `Entities.`, sin sufijo `.Entities`).
- Solo reubicación de archivos + namespace. Sin cambios de lógica, clases, contratos HTTP ni schema EF.
- `git mv` para conservar historial. Build de Application + Api + Tests verde por bloque.

## Bloques ejecutados

| Rango | Contenido |
|---|---|
| 1–17 | Renombrado de carpetas en `Infrastructure/Data/Entities/` y `Modules/` (módulos, submódulos, archivos Razor y rutas físicas hardcodeadas) |
| 18 | Entities AccountingLuxuryApp (27) |
| 19 | Entities CollectionsLuxuryApp (28) |
| 20 | Entities LegalLuxuryApp (15) |
| 21 | Entities MaintenanceLuxuryApp (43) |
| 22 | Entities OperationsLuxuryApp (118) |
| 23 | Entities PurchasesLuxuryApp (16) |
| 24 | Entities RecruitmentLuxuryApp (34) |
| 25 | Entities SharedLuxuryApp (3) |
| 26a | Entities AdminLuxuryApp SUFFIX (18) |
| 27 | Entities AdminLuxuryApp REVIEW (6) + pluralización de carpetas Customer* |
| 28 | 73 configs EF reubicados a `Infrastructure/Data/Configurations/<Modulo>/` |
| Área 1 | `Shared/` raíz: `CobranzaOnline`, `RecursosHumanos`, `PresupuestoPropuesta` |
| Área 2 | `LuxuryApp.Api/.../Email/Templates/RecursosHumanos` |
| Área 3 / 3b | `LuxuryApp.Tests`: módulos y services en español + remanentes |
| Formato | Normalización de doble salto de línea en 2135 `.cs` |

## Estado final

- **Entities:** 338/338 entidades en espejo de `Modules/`, namespace `Entities.<...>`.
- **Configs EF:** 73 en `Infrastructure/Data/Configurations/<Modulo>/`.
- **0 carpetas en español** en `Entities`, `Modules`, `Shared`, `Api`, `Tests` (fuente).
- **Build verde:** Application + Api + Tests.

## Pendientes / fuera de alcance

- Mojibake preexistente: 1 BOM en `Infrastructure/Data/Migrations/20260919151032_FederalLaborLawParameters.cs`.
- Carpetas en español en `bin/`/`obj/`: artefactos de build; se regeneran al recompilar.
- Drift de namespace remanente en otras capas (no tocado): ninguno detectado en carpetas fuente; revisar si se desea namespace de `Shared/` raíz (`SystemLuxuryApp.SendEmailGlobal.*`) y de migraciones.
