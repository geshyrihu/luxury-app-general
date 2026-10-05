# Modulo: AspelCobranzaHausLocal

> **Area funcional:** Contabilidad / Cobranza Haus / Consulta local
> **Tag de version:** `v0.1`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-30`

---

## Objetivo

Crear un modulo paralelo a `AspelCobranzaHausLive` para consultar datos desde la base local sincronizada (`CobranzaCuentas`, `CobranzaSaldos`, `CobranzaPolizas`, `CobranzaAuxiliares`) sin alterar el comportamiento del modulo live actual.

---

## Regla de convivencia

- `AspelCobranzaHausLive` se mantiene intacto.
- `AspelCobranzaHausLocal` se implementa como modulo nuevo con su propio controller, servicios, interfaces y DTOs.
- El frontend podra migrar endpoint por endpoint cuando el modulo local este validado.
- Mientras no se complete la logica de negocio, los endpoints locales deben responder de forma controlada y nunca romper el modulo live.

---

## Ruta base propuesta

- `api/aspel-cobranza-local`

---

## Estado inicial del modulo

- Estructura base creada.
- Consulta local de `customers` implementada.
- Consulta local de `accounts` implementada sobre `CobranzaCuentas`.
- Endpoint `status` implementado para diagnostico rapido del snapshot local.
- `estado-cuenta-rango`, `detalle-cobranza-rango` y `deudas-actuales` quedan preparados para la siguiente fase.

---

## Dependencias locales previstas

- `ApplicationDbContext`
- `AspelCustomerEmpresa`
- `CobranzaCuenta`
- `CobranzaSaldo`
- `CobranzaPoliza`
- `CobranzaAuxiliar`

---

## Documento rector

El plan completo del modulo vive en:

- [PLAN-DE-ACCION.md](D:/repos/luxuryapp-api/api/LuxuryApp.Application.Tenant/Tenant/Accounting/AspelCobranzaHausLocal/PLAN-DE-ACCION.md)
