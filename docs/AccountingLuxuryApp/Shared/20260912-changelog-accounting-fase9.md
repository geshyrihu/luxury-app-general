# Fase 9: ContabilidadLuxuryApp (Vertical Slices)

## Alcance

Se aplicó el Estándar de Oro al módulo `ContabilidadLuxuryApp`: revisión de entidades contables en `SystemLuxuryApp`, eliminación de wrappers físicos `Domain` e `Infrastructure`, sincronización de namespaces path-based y reparación de referencias consumidoras.

## Rescate de entidades desde SystemLuxuryApp

Se inspeccionó `Modules/SystemLuxuryApp/Domain/Entities/` buscando entidades contables como pólizas, cuentas contables, balanzas, impuestos, centros de costo, COI, fiscal y libro mayor. No quedaron candidatos contables claros por rescatar en System.

## Aplanamiento físico

Se deshizo el wrapper `Domain/Entities` moviendo sus entidades a cortes verticales existentes:

- `BudgetAccountRule.cs`, `BudgetExecution.cs` -> `Presupuesto/Entities/`
- `BudgetProposal.cs`, `BudgetProposalItem.cs`, `BudgetProposalItemHistory.cs`, `BudgetProposalItemSupportFile.cs` -> `PresupuestoPropuesta/Entities/`
- `Funding.cs` -> `Fondeos/Entities/`
- `EstadoFinanciero.cs`, `FinancialApprovalRequest.cs`, `FinancialAuditLog.cs`, `FinancialBatch.cs`, `FinancialLedgerEntry.cs`, `FinancialReport.cs`, `FinancialReportRow.cs`, `FinancialReportRowSource.cs` -> `FinancialAccounting/Entities/`
- `AccountingCatalog.cs` -> `AccountingCatalog/Entities/`
- `CoiCobranzaAccount.cs`, `CoiCobranzaBalance.cs`, `CoiCobranzaMovement.cs`, `CoiCobranzaPolicy.cs`, `CoiFiscalPeriod.cs`, `ContabilidadAuxiliar.cs`, `ContabilidadCuenta.cs`, `ContabilidadFiscalPeriod.cs`, `ContabilidadPoliza.cs`, `ContabilidadPresupuesto.cs`, `ContabilidadSaldo.cs` -> `ContabilidadOnline/Entities/`

Se aplanó `Infrastructure/Persistence` hacia `Persistence/` y se eliminaron los wrappers vacíos.

Resultado físico validado:

- Archivos .cs en ContabilidadLuxuryApp: 298
- Wrappers Domain, Application, Infrastructure restantes: 0
- Namespaces fuera de ruta: 0
- Usos inline de global::LuxuryApp.Application.Modules.ContabilidadLuxuryApp dentro del módulo: 0
- Candidatos contables restantes en SystemLuxuryApp: 0

## Namespaces y referencias actualizadas

Se reescribieron los namespaces de los 298 archivos `.cs` del módulo a path-based según ruta real. Se agregaron 95 namespaces del módulo a los puentes globales de `LuxuryApp.Application`, `LuxuryApp.Api` y `LuxuryApp.Tests`.

Se corrigieron referencias antiguas detectadas por build:

- Imports legacy de AspelFast desde `LuxuryApp.Application.Modules.Contabilidad.Features...` hacia `LuxuryApp.Application.Modules.ContabilidadLuxuryApp.DynamicReports...`.
- Usos relativos `Shared.Enums.*` hacia `LuxuryApp.Application.Shared.Enums.*` para evitar resolución incorrecta bajo el namespace del módulo.
- Aliases presupuestales que apuntaban a `LuxuryApp.Application.Infrastructure.Data.Entities.*` hacia sus nuevas rutas path-based.

## Colisiones resueltas con aliases

Se mantuvo el estándar de aliases limpios:

- `AccountingCatalogEntity` para resolver la colisión entre el submódulo `AccountingCatalog` y la entidad `AccountingCatalog`.
- `CatalogoGastosFijosEntity` para resolver la colisión entre el submódulo `CatalogoGastosFijos` y la entidad compartida rescatada previamente hacia Cobranza.

## Verificación

Se ejecutó `dotnet build LuxuryApp.sln` a nivel solución.

```text
Compilación correcta.
0 Advertencia(s)
0 Errores
```
