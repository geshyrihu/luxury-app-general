> ⛔ **SUPERSEDED (2026-09-30).** Documento legacy: apunta a rutas inexistentes
> (`SupplierLuxuryApp/Purchases/OrdenCompra`, `client/angular/.../supplier.luxuryapp/po/purchase-order`).
> Reemplazado por `20260930-plan-remediacion-purchases-ordenes-compra.md`.
> Se conserva solo como insumo histórico (CONVENTIONS.md §2).

# Plan de Remediacion - OrdenCompra

**Fecha:** 2026-07-30
**Estado:** Superseded (ver aviso arriba)
**Modulo:** `OrdenCompra`
**Responsable de aprobacion:** Usuario owner de convenciones
**Auditoria origen:** [../../../docs/PurchasesLuxuryApp/PurchaseOrders/20260730-auditoria-purchases-ordenes-compra.md](../../reporte_maestro/modulos/../../../docs/PurchasesLuxuryApp/PurchaseOrders/20260730-auditoria-purchases-ordenes-compra.md)
**Backend:** [api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra](../../../api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Purchases/OrdenCompra)
**Frontend:** [client/angular/src/app/apps/supplier.luxuryapp/po/purchase-order](../../../client/angular/src/app/apps/supplier.luxuryapp/po/purchase-order)

---

## Resumen Ejecutivo

La remediacion de `OrdenCompra` debe ejecutarse por fases y con especial
cuidado en contratos publicos, integridad transaccional y flujos frontend
multi-step. Es un modulo de alto riesgo funcional y alto acoplamiento entre
backend, UI, archivos y procesos derivados.

---

## Fase 0. Criterios de control

- [ ] no tocar shared sin analisis de impacto y aprobacion
- [ ] no romper contratos serializados sin revisar consumidores
- [ ] no reubicar archivos existentes por iniciativa propia
- [ ] si una correccion amplia requiere migracion, proponerla antes de ejecutar

---

## Fase 1. Endurecimiento contractual backend

- [ ] crear DTO explicito para `GetForEdit`
- [ ] crear DTO explicito para `CotizacionesRelacionadasAsync`
- [ ] sustituir respuestas de create/update que hoy retornan entidad `OrdenCompra`
- [ ] revisar naming y ownership de DTOs del modulo

**Criterio de paso**

- no quedan `ApiResponseDTO<object>` ni `List<object>` en contratos publicos del modulo

---

## Fase 2. Alineacion estructural DTO

- [ ] separar `BudgetToPurchaseOrderDTO.cs`
- [ ] separar `OrdenesCompraDTO.cs`
- [ ] separar `PurchaseDetailDTO.cs`
- [ ] revisar si algun DTO con `Id` requiere herencia `GuidIdEntityDTO`

**Criterio de paso**

- el modulo respeta `un archivo por DTO`

---

## Fase 3. Frontend typing y estado

- [ ] tipar `orden-compra-list.ts`
- [ ] tipar `orden-compra.ts`
- [ ] tipar `create-orden-compra.ts`
- [ ] tipar `create-orden-compra-wizard.ts`
- [ ] tipar forms y parcials mas usados
- [ ] documentar o consolidar estado critico fuera de forms

**Criterio de paso**

- se elimina el `any` productivo de los flujos principales del modulo

---

## Fase 4. Integridad operativa

- [ ] revisar transacciones en `AddAsync`
- [ ] revisar transacciones en `AddProgressiveAsync`
- [ ] revisar transacciones en `AddFueraFondeoAsync`
- [ ] revisar transacciones o compensacion en `CreateFromInvoicesAsync`
- [ ] revisar defaults y GUIDs hardcodeados de catalogos

**Criterio de paso**

- las operaciones compuestas tienen frontera transaccional o estrategia de compensacion documentada

---

## Fase 5. Documentacion y pruebas

- [ ] alinear `README.md`
- [ ] agregar pruebas backend del modulo
- [ ] ampliar pruebas frontend sobre listado, detalle, datos pago, facturas y linking

**Criterio de paso**

- existe evidencia automatizada minima de los flujos criticos del modulo

---

## Riesgos

- ruptura de consumidores si se cambian contratos publicos sin inventario previo
- estados parciales si se toca logica multi-entidad sin plan
- regresiones frontend por acoplamiento entre wizard, detalle y servicio compartido

---

## Cierre esperado

- modulo alineado a convenciones nuevas
- reglas nuevas absorbidas por el sistema rector de auditoria
- base lista para remediacion controlada por fases


