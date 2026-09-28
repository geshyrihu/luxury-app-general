# Fase 9: CobranzaLuxuryApp (Vertical Slices)

## Alcance

Se aplicó el Estándar de Oro al módulo `CobranzaLuxuryApp`: rescate de entidades financieras desde `SystemLuxuryApp`, eliminación del wrapper físico `Domain`, sincronización de namespaces path-based y reparación de referencias consumidoras.

## Entidades rescatadas desde SystemLuxuryApp

Se movieron catálogos financieros que permanecían en `Modules/SystemLuxuryApp/Domain/Entities/Catalogs/`:

- `Bank.cs` -> `Modules/CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Entities/`
- `FormaPago.cs` -> `Modules/CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Entities/`
- `MetodoDePago.cs` -> `Modules/CobranzaLuxuryApp/CobranzaNativa/Core/Payments/Entities/`
- `UsoCFDI.cs` -> `Modules/CobranzaLuxuryApp/CobranzaNativa/Core/Invoices/Entities/`

Se verificó que esos archivos ya no permanecen en `SystemLuxuryApp`.

## Aplanamiento físico

Se deshizo el wrapper `Domain/Entities/AR` moviendo sus entidades al corte vertical correspondiente:

- `AdjustmentRecord.cs`, `CreditNote.cs` -> `CobranzaNativa/Core/Approvals/Entities/`
- `BillingConfig.cs` -> `CobranzaNativa/Contracts/ExternalCompatibility/Entities/`
- `CatalogoGastosFijos.cs`, `CatalogoGastosFijosDetalles.cs`, `Charge.cs`, `ChargePaymentAllocation.cs` -> `CobranzaNativa/Core/Charges/Entities/`
- `ChargeTemplate.cs` -> `CobranzaNativa/Core/Templates/Entities/`
- `ChargeTypeCatalog.cs` -> `CobranzaNativa/Core/ChargeTypes/Entities/`
- `CobranzaAuxiliar.cs`, `CobranzaExcludedAccount.cs` -> `CobranzaNativa/Core/Reconciliation/Entities/`
- `CobranzaCuenta.cs`, `CobranzaPayment.cs` -> `CobranzaNativa/Core/Payments/Entities/`
- `CobranzaPeriodClosure.cs` -> `CobranzaNativa/Core/PeriodClosures/Entities/`
- `CobranzaPoliza.cs`, `CobranzaSaldo.cs` -> `CobranzaNativa/Core/Ledger/Entities/`
- `CollectionActivity.cs`, `CollectionCase.cs`, `CollectionCaseCharge.cs` -> `CobranzaNativa/Core/CollectionCases/Entities/`
- `Invoice.cs` -> `CobranzaNativa/Core/Invoices/Entities/`
- `LateFeePolicy.cs`, `MorosidadPolicy.cs` -> `CobranzaNativa/Core/LateFees/Entities/`
- `NativeCollectionNotificationSetting.cs` -> `CobranzaNativa/Core/Notifications/Entities/`
- `AspelCustomerEmpresa.cs` -> `AspelCobranzaHausLive/Entities/`

Resultado físico validado:

- Archivos .cs en CobranzaLuxuryApp: 217
- Wrappers Domain, Application, Infrastructure restantes: 0
- Namespaces fuera de ruta: 0
- Usos inline de global::LuxuryApp.Application.Modules.CobranzaLuxuryApp dentro del módulo: 0

## Namespaces y referencias actualizadas

Se reescribieron los namespaces de `CobranzaLuxuryApp` a path-based según su ruta real. Se agregaron 93 namespaces del módulo a los puentes globales de `LuxuryApp.Application`, `LuxuryApp.Api` y `LuxuryApp.Tests`.

Se corrigieron referencias externas detectadas por build:

- `AspelSyncEndPoints.cs` ahora usa un alias limpio para `CobranzaOnlineCustomerScope`.
- `CobranzaNativaNotificationServiceTests.cs` ahora apunta al servicio path-based de `CobranzaNativa/Core/Notifications/Services`.

## Verificación

Se ejecutó `dotnet build LuxuryApp.sln` a nivel solución.

```text
Compilación correcta.
0 Advertencia(s)
0 Errores
```
