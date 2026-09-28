# Fase 9: SupplierLuxuryApp (Vertical Slices)

## Objetivo

Se aplicó el Estándar de Oro al módulo `SupplierLuxuryApp`: cortes verticales puros, eliminación de capas envolventes `Domain/Application/Infrastructure`, namespaces basados en ruta física y verificación completa a nivel solución.

## Gestión de bitácoras

- Se creó este archivo histórico en `docs/changelogs/10_fase9_supplier.md`.

## Rescate de entidades

Se inspeccionó `Modules/SystemLuxuryApp/Domain/Entities/` buscando entidades propias de proveedores, expedientes, evaluaciones y contactos. No se encontró una entidad claramente exclusiva de Supplier que debiera moverse desde System en esta fase.

Se dejaron en System las entidades compartidas o transversales detectadas durante la búsqueda, como `Address` y `TelefonosEmergencia`, porque no son propiedad exclusiva del módulo Supplier.

## Acomodo físico aplicado

Se removió la capa envolvente `Modules/SupplierLuxuryApp/Domain/` y se reubicaron sus entidades en el corte vertical correspondiente:

- `Domain/Entities/Providers/CategoryProvider.cs` -> `Provider/Entities/CategoryProvider.cs`
- `Domain/Entities/Providers/PersonProviderSupport.cs` -> `Provider/Entities/PersonProviderSupport.cs`
- `Domain/Entities/Providers/Provider.cs` -> `Provider/Entities/Provider.cs`
- `Domain/Entities/Providers/QualificationProvider.cs` -> `ProviderQualification/Entities/QualificationProvider.cs`

También se corrigió una carpeta heredada con nombre no compatible para namespaces C#:

- `Purchases/DTOs/DTO-PENDIENTEMOVERs/` -> `Purchases/DTOs/PendingMoveDTOs/`

Resultado estructural:

- 0 carpetas `Domain`, `Application` o `Infrastructure` dentro de `SupplierLuxuryApp`.
- 0 carpetas con nombres inválidos para namespaces C#.
- 132 archivos `.cs` conservados dentro del módulo.

## Sincronización de namespaces

Se reescribieron los namespaces de los 132 archivos C# de `SupplierLuxuryApp` al formato path-based:

`LuxuryApp.Application.Modules.SupplierLuxuryApp.[RutaFisica]`

Ejemplos aplicados:

- `Provider/DTOs` -> `LuxuryApp.Application.Modules.SupplierLuxuryApp.Provider.DTOs`
- `Provider/Entities` -> `LuxuryApp.Application.Modules.SupplierLuxuryApp.Provider.Entities`
- `ProviderQualification/Entities` -> `LuxuryApp.Application.Modules.SupplierLuxuryApp.ProviderQualification.Entities`
- `Purchases/SolicitudCompra/CotizacionProveedor/DTOs` -> `LuxuryApp.Application.Modules.SupplierLuxuryApp.Purchases.SolicitudCompra.CotizacionProveedor.DTOs`

Se agregaron los puentes globales necesarios en:

- `LuxuryApp.Application/GlobalUsings.cs`
- `LuxuryApp.Api/GlobalUsings.cs`
- `LuxuryApp.Tests/GlobalUsings.cs`

## Resolución de dependencias y colisiones

Se actualizaron referencias legacy que apuntaban a namespaces antiguos de compras/proveedores:

- `LuxuryApp.Application.Features.PurchaseRequests.DTOs` -> `LuxuryApp.Application.Modules.SupplierLuxuryApp.Purchases.SolicitudCompra.CotizacionProveedor.DTOs`
- `LuxuryApp.Application.Helpers` -> `LuxuryApp.Application.Modules.SupplierLuxuryApp.Purchases.OrdenCompra.Helpers`

Se limpiaron entradas obsoletas de `LuxuryApp.Application.Helpers` en archivos `.csproj` donde ya no existía el namespace.

Las colisiones de nombres se resolvieron con aliases limpios de `using`, evitando `global::` en línea:

- `ProviderEntity`
- `PurchaseOrderBudgetEntity`
- `SolicitudCompraEntity`
- `CotizacionProveedorEntity`
- `OrdenCompraEntity`

También se corrigió el DTO de cuadro comparativo para conservar su propiedad pública esperada `CotizacionProveedor` después de la resolución de aliases.

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
- 0 wrappers arquitectónicos dentro de `SupplierLuxuryApp`.
- 0 namespaces fuera del estándar path-based.
- 0 usos inline de `global::` para Supplier.
