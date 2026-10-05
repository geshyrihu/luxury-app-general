# Seguimiento Flujo de Efectivo

## Objetivo actual

Ajustar el reporte `Flujo de Efectivo` de Contabilidad Online para que los importes del API coincidan con las reglas de negocio que se estan validando contra:

- [ROYAL FE.xlsx](D:\repos\luxuryapp-api\api\LuxuryApp.Application.Tenant\Tenant\Accounting\ContabilidadOnline\ROYAL FE.xlsx)

La prioridad actual es cuadrar primero el consumo en vivo de Aspel. La opcion de consumir desde base de datos local queda pendiente y no debe interferir.

## Archivos clave

### Backend

- [FlujoCajaService.cs](D:\repos\luxuryapp-api\api\LuxuryApp.Application.Tenant\Tenant\Accounting\ContabilidadOnline\Services\FlujoCajaService.cs)
- [FlujoCajaDTO.cs](D:\repos\luxuryapp-api\api\LuxuryApp.Application.Tenant\Tenant\Accounting\ContabilidadOnline\DTOs\FlujoCajaDTO.cs)
- [BaseAccountDTO.cs](D:\repos\luxuryapp-api\api\LuxuryApp.Application.Tenant\Tenant\Accounting\ContabilidadOnline\DTOs\BaseAccountDTO.cs)
- [RawAspelAccountDTO.cs](D:\repos\luxuryapp-api\api\LuxuryApp.Application.Tenant\Tenant\Accounting\ContabilidadOnline\DTOs\RawAspelAccountDTO.cs)

### Frontend

- [flujo-efectivo.ts](D:\repos\luxuryapp-api\client\angular\src\app\features\accounting\general-ledger\contabilidad\contabilidad-online\pages\flujo-efectivo\flujo-efectivo.ts)
- [flujo-efectivo.html](D:\repos\luxuryapp-api\client\angular\src\app\features\accounting\general-ledger\contabilidad\contabilidad-online\pages\flujo-efectivo\flujo-efectivo.html)
- [aspel-budget.interface.ts](D:\repos\luxuryapp-api\client\angular\src\app\features\accounting\general-ledger\contabilidad\contabilidad-online\models\aspel-budget.interface.ts)

### Soporte

- [ROYAL FE.xlsx](D:\repos\luxuryapp-api\api\LuxuryApp.Application.Tenant\Tenant\Accounting\ContabilidadOnline\ROYAL FE.xlsx)
- [FLUJO DE EFECTIVO LB.xlsx](D:\repos\luxuryapp-api\api\LuxuryApp.Application.Tenant\Tenant\Accounting\ContabilidadOnline\FLUJO DE EFECTIVO LB.xlsx)
- [flujo-efectivo.json](D:\repos\luxuryapp-api\flujo-efectivo.json)

## Reglas confirmadas por usuario

### Saldos iniciales

- `SALDO INICIAL BANCOS`
  - sale de `102-000-000`
- `SALDO INICIAL INVERSIONES`
  - formula correcta: `103-000-000 - 304-000-000`
- `SALDO INICIAL FONDO DE RESERVA`
  - sale de `304-000-000`

### Cobranza / ingresos

- `CUOTAS COBRADAS MANTTO`
  - sale de la empresa `Cobranza`
  - sumar todas las cuentas que cumplan patron `104-xxx-xxx-001`
  - se debe usar cuarto nivel `001`
  - el ultimo nivel debe terminar en `101`
  - no importa el segundo ni el tercer nivel
  - en el servicio actualmente se estan sumando los `abonos mensuales`
- `CUOTAS COBRADAS EXTRA`
  - sale de la empresa `Cobranza`
  - sumar todas las cuentas que cumplan patron `104-xxx-xxx-003`
  - se debe usar cuarto nivel `003`
  - el ultimo nivel debe terminar en `003`
  - en el servicio actualmente se estan sumando los `abonos mensuales`
- `OTROS INGRESOS`
  - sale de contabilidad
  - formula correcta: saldo acreedor de `202-002-000` + abonos de `404-001-000`
- `VENTA FONDOS INVERSION`
  - sale de contabilidad
  - usar saldo deudor de `103-000-003`
  - cuenta confirmada exacta, sin fallback alterno
- `INTERESES MANTTO`
  - sigue pendiente validar con mas precision
- `INTERESES EXTRA`
  - sale de contabilidad
  - usar saldo acreedor de `403-001-002`

### Gastos / administracion

- `PAGOS A PROVEEDORES`
  - sigue pendiente validar con mas precision
- `PAGOS A ACREEDORES`
  - usa `202-000-000`
- `PAGOS TARJETA CORPORATIVA`
  - usa `102-001-001`
- `PAGOS DE SUELDOS`
  - usa `204-001-000`
- `PAGOS DE IMPUESTOS (MES ANT)`
  - usa `205-000-000`, `206-000-000`, `207-000-000`
  - formula correcta: suma del saldo deudor de esas tres cuentas
- `COMPRA FONDOS INVERSION`
  - sale de contabilidad
  - usa `204-001-000`
  - formula correcta: saldo final de esa cuenta
- `PAGOS DE COMISIONES BANCARIAS`
  - usa `609-001-000`
- `ISR POR INVERSIONES`
  - sigue pendiente validar con mas precision
- `CUENTA POR COBRAR AL CIERRE`
  - usa `104-000-000`
- `COBRANZA JUDICIAL`
  - manual
- `CXP DE IMPUESTOS`
  - sale de contabilidad
  - usa `205-000-000` + `206-000-000` + `207-000-000`
  - formula correcta: suma de saldos finales

## Cambios ya aplicados en backend

Se han hecho ajustes en [FlujoCajaService.cs](D:\repos\luxuryapp-api\api\LuxuryApp.Application.Tenant\Tenant\Accounting\ContabilidadOnline\Services\FlujoCajaService.cs):

- `SALDO INICIAL INVERSIONES` ya descuenta `304-000-000`.
- `SALDO INICIAL FONDO DE RESERVA` ya sale de `304-000-000`.
- `CUOTAS COBRADAS MANTTO` ya no usa la logica anterior mezclada; ahora apunta a `Cobranza` con patron `104-xxx-xxx-003` en cuarto nivel `003`.
- `CUOTAS COBRADAS MANTTO` ahora usa patron:
  - `104-xxx-xxx-001`
  - ultimo nivel `101`
- `CUOTAS COBRADAS EXTRA` ahora usa patron:
  - `104-xxx-xxx-003`
  - ultimo nivel `003`
- `OTROS INGRESOS` ahora se calcula con:
  - saldo acreedor de `202-002-000`
  - mas abonos de `404-001-000`
- `INTERESES MANTTO` y `INTERESES EXTRA` intentan usar:
  - `403-000-000`
  - `403-001-000`
- `ISR POR INVERSIONES` intenta usar:
  - `107-001-000`
- sigue existiendo helper para evitar duplicidad al sumar cuentas padre e hijas cuando aplica.

## Estado actual

- `LuxuryApp.Application.Tenant` compila con `0 errores`.
- Hay warnings existentes del proyecto que no son de este ajuste.
- Falta seguir validando fila por fila contra el reporte real.

## Pendientes prioritarios

Las siguientes filas aun necesitan afinacion o confirmacion adicional:

- `CUOTAS COBRADAS EXTRA`
- `OTROS INGRESOS`
- `INTERESES MANTTO`
- `INTERESES EXTRA`
- `PAGOS A PROVEEDORES`
- `ISR POR INVERSIONES`

## Siguiente paso recomendado

Continuar validando una fila a la vez con el usuario:

1. confirmar fuente exacta
2. confirmar si usa cargos, abonos, saldo inicial o saldo final
3. ajustar servicio
4. compilar
5. pasar a la siguiente fila

## Nota de negocio importante

Por ahora el comportamiento deseado del sistema es:

- default: consumir Aspel en vivo
- pendiente: dejar lista la opcion de consumir base de datos local
- esa logica local no debe bloquear ni alterar las pruebas actuales del flujo
