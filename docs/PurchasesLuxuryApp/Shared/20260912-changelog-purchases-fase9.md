# Fase 9: ComprasLuxuryApp (Vertical Slices)

## Alcance

Se aplicó el Estándar de Oro al módulo `ComprasLuxuryApp`: revisión de entidades de compras en `SystemLuxuryApp`, eliminación del wrapper físico `Domain`, sincronización de namespaces path-based y validación a nivel solución.

## Rescate de entidades desde SystemLuxuryApp

Se inspeccionó `Modules/SystemLuxuryApp/Domain/Entities/` buscando entidades de compras como requisiciones, órdenes de compra, recepciones, catálogos de materiales, proveedores y cotizaciones. No quedaron candidatos de compras claros por rescatar en System.

## Aplanamiento físico

Se deshizo el wrapper `Domain/Entities` moviendo sus entidades a cortes verticales explícitos:

- `Domain/Entities/PO/*` -> `PurchaseOrders/Entities/`
- `Domain/Entities/PR/*` -> `PurchaseRequests/Entities/`
- `Domain/Entities/Quotes/*` -> `Quotes/Entities/`

`HistorialCompras` ya estaba plano y sólo recibió sincronización de namespaces.

Resultado físico validado:

- Archivos .cs en ComprasLuxuryApp: 23
- Wrappers Domain, Application, Infrastructure restantes: 0
- Namespaces fuera de ruta: 0
- Usos inline de global::LuxuryApp.Application.Modules.ComprasLuxuryApp dentro del módulo: 0
- Candidatos de compras restantes en SystemLuxuryApp: 0

## Namespaces y referencias actualizadas

Se reescribieron los namespaces de los 23 archivos `.cs` del módulo a path-based según ruta real. Se agregaron 7 namespaces del módulo a los puentes globales de `LuxuryApp.Application`, `LuxuryApp.Api` y `LuxuryApp.Tests`.

No fue necesario agregar aliases nuevos en esta migración: la solución compiló sin colisiones de nombres del módulo.

## Verificación

Se ejecutó `dotnet build LuxuryApp.sln` a nivel solución. Durante la primera validación una instancia local de `LuxuryApp.Api` bloqueó el DLL de salida; se cerró el proceso local y se repitió la compilación.

```text
Compilación correcta.
0 Advertencia(s)
0 Errores
```
