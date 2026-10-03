# 📝 Registro de Cambios Ejecutados: Órdenes de Compra

### 🔀 Bitácora viva — se escribe **solo cuando** el plan es autorizado y cada cambio se aplica

> **Tipo:** Changelog / Registro de ejecución.
> **Plan que ejecuta:** `docs/PurchasesLuxuryApp/PurchaseOrders/20260930-plan-remediacion-purchases-ordenes-compra.md`.
> **Análisis origen:** `docs/PurchasesLuxuryApp/PurchaseOrders/20260930-analisis-purchases-ordenes-compra.md`.
> **Estado:** 🟡 Fases 1-4 ejecutadas; Fase 5 pendiente; Fase 6 ejecutada en flujos principales.

---

## 📋 Metadata

| Campo | Valor |
|---|---|
| Módulo backend | `api/LuxuryApp.Application/Modules/PurchasesLuxuryApp/Purchases/` |
| Módulo frontend | `appsweb/angular/src/app/modules/purchases.luxuryapp/purchase-orders/` |
| Tipo | Registro de ejecución (`changelog`) |
| Plan que ejecuta | `20260930-plan-remediacion-purchases-ordenes-compra.md` |
| Responsable de autorización | Owner de convenciones / Tech Lead |
| Fecha de apertura | 2026-09-30 |

---

## 🚦 Regla de uso (obligatoria)

1. **No se escribe aquí nada hasta que el plan sea autorizado.**
2. Cada fila se registra **en el momento** en que el cambio se ejecuta y verifica — no antes, no en bloque al final.
3. Una fila = un cambio verificable, con archivos y evidencia (commit/hash + comando de verificación).
4. Si un cambio se revierte, **no se borra la fila**: se agrega estado `🔄 Revertido` con motivo.
5. Esta bitácora es la evidencia de trazabilidad plan → ejecución (Protocolo de planes §Reglas).

---

## ✅ Autorización

| Fase | Autorizada por | Fecha | Notas |
|---|---|---|---|
| Fases 1-7 | Owner (autorización directa en sesión) | 2026-09-30 | Ejecución controlada por fases; validar build tras cada fase |

> Alcance aprobado: plan completo (Fases 1-7). Cada fase se valida antes de pasar a la siguiente.

---

## 📒 Registro de cambios ejecutados

| # | Fecha | Fase | Cambio | Archivos | Evidencia (hash/comando) | Estado | Owner |
|---|---|---|---|---|---|---|---|
| 1 | 2026-09-30 | Fase 1 | Converger fórmula de carátula a `OrdenCompraDetalle.Total` (deriva H-01; ahora descuenta Retención ISR) | `api/.../PurchaseOrders/Helpers/CustomOrdenesCompra.cs` | `dotnet build LuxuryApp.Application` → 0 errores | ✅ | Backend |
| 2 | 2026-09-30 | Fase 1 | `CalcularTotalDetalles` delega a `OrdenCompraDetalle.Total` (elimina fórmula duplicada) | `api/.../PurchaseOrders/Services/OrdenCompraExtensions.cs` | `dotnet build LuxuryApp.Application` → 0 errores | ✅ | Backend |
| 3 | 2026-09-30 | Fase 1 | Pruebas de paridad de totales (incluye caso ISR que demuestra la divergencia corregida) | `api/LuxuryApp.Tests/Application/Modules/PurchasesLuxuryApp/PurchaseOrders/OrdenCompraTotalesTests.cs` | `dotnet test` → Superado: 5, Con error: 0 | ✅ | Backend |
| 4 | 2026-09-30 | Fase 2 | Crear guard único de bloqueo por fondeo | `api/.../Purchases/Shared/Helpers/FundingLockGuard.cs` | `dotnet build LuxuryApp.Application` → 0 errores | ✅ | Backend |
| 5 | 2026-09-30 | Fase 2 | Reemplazar las 5 copias por el guard (11 call sites: Auth ×3, Budgets ×3, Detail ×3, DatosPago ×1, núcleo ×1) | `.../PurchaseOrderAuth|Budgets|Detail|Payment|PurchaseOrders/Services/*.cs` | `grep GetFundingConfirmedErrorAsync` → 0 copias privadas; build 0 errores | ✅ | Backend |
| 6 | 2026-09-30 | Fase 2 | Pruebas del guard (confirmado / verificado / autorizado / no-fondeada / sin datos / sin fondeo) | `api/LuxuryApp.Tests/Application/Modules/PurchasesLuxuryApp/PurchaseOrders/FundingLockGuardTests.cs` | `dotnet test` → Superado: 11, Con error: 0 | ✅ | Backend |
| 7 | 2026-09-30 | Fase 3 | DTO explícito para `GetForEdit` (elimina `ApiResponseDTO<object>`) | `.../DTOs/OrdenCompraForEditDTO.cs` + `IOrdenCompraAppService.cs` + `OrdenCompraAppService.cs` | `dotnet build` → 0 errores | ✅ | Backend |
| 8 | 2026-09-30 | Fase 3 | DTO explícito para cotizaciones relacionadas (elimina `List<object>`) | `.../DTOs/OrdenCompraSummaryDTO.cs` + service | `dotnet build` → 0 errores | ✅ | Backend |
| 9 | 2026-09-30 | Fase 3 | `GetSolicitudPagoPdf` devuelve `ErrorResult` en vez de `null` | `.../Services/OrdenCompraAppService.cs` | `dotnet build` → 0 errores | ✅ | Backend |
| 10 | 2026-09-30 | Fase 3 | DTOs tipados para totales de detalle y presupuesto (cierran otros 2 `List<object>`) | `.../DTOs/OrdenCompraDetalleTotalDTO.cs`, `PurchaseOrderBudgetTotalDTO.cs` + `PurchaseOrderDetail`/`PurchaseOrderBudgets` (interfaz + service) | `dotnet build` → 0 errores | ✅ | Backend |
| 11 | 2026-09-30 | Fase 4 | GUIDs de catálogo hardcodeados → `CustomersIdLuxury.*` (6 reemplazos, valor idéntico) en `AddProgressiveAsync` y `AddFueraFondeoAsync` | `.../Services/OrdenCompraAppService.cs` | `grep` de GUIDs literales → 0; `dotnet build` → 0 errores | ✅ | Backend |
| 12 | 2026-09-30 | Fase 4 | Retirar borrado silencioso en `OrdenesCompraGastosFijosAsync` (endpoint read-only; OC incompletas se omiten + log) | `.../Services/OrdenCompraAppService.cs` | `dotnet build` → 0 errores | ✅ | Backend |
| 13 | 2026-09-30 | Fase 4 | Test: OC incompleta no se borra al listar gastos fijos | `api/LuxuryApp.Tests/Application/Modules/PurchasesLuxuryApp/PurchaseOrders/OrdenCompraGastosFijosTests.cs` | `dotnet test` → Superado: 12, Con error: 0 | ✅ | Backend |
| 14 | 2026-09-30 | Fase 6 | Tipos explícitos para listado, detalle, líneas, presupuesto y totales de OC | `appsweb/angular/src/app/modules/purchases.luxuryapp/purchase-orders/purchase-order/purchase-order.types.ts` | `npm run build -- --configuration development` → 0 errores | ✅ | Frontend |
| 15 | 2026-09-30 | Fase 6 | Servicio de totales consume DTOs tipados; total final de detalle usa señal calculada desde backend | `appsweb/angular/src/app/modules/purchases.luxuryapp/purchase-orders/services/orden-compra.service.ts`, `purchase-order/orden-compra.ts` | Angular build → 0 errores | ✅ | Frontend |
| 16 | 2026-09-30 | Fase 6 | Estados de OC reemplazan literales principales por enums (`StatusOrdenCompra`, autorización) | `appsweb/angular/src/app/core/enums/*purchase-order*.enum.ts`, listado y parcial de autorización | Angular build → 0 errores | ✅ | Frontend |
| 17 | 2026-09-30 | Fase 6 | Parciales principales y respuesta de validación dejan de usar `any` | `purchase-order/parcials/*`, `purchase-order/orden-compra.ts` | Angular build → 0 errores | ✅ | Frontend |
| 18 | 2026-09-30 | Fase 6 | Tipar wizard de creación, cuentas presupuestales y eventos de archivos | `purchase-order/create-purchase-order-wizard/*`, `purchase-order/purchase-order-budget/*` | Angular build → 0 errores | ✅ | Frontend |
| 19 | 2026-09-30 | Fase 6 | Tipar formularios de estado, facturas, datos de pago, producto y edición | `purchase-order/forms/*`, `purchase-order/*edit*`, `purchase-order-detail-form/*` | Angular build → 0 errores | ✅ | Frontend |
| 20 | 2026-09-30 | Fase 6 | Tipar respuestas del PDF principal y validación de facturas | `generator-pdf/pdf-generation.service.ts`, `purchase-order/parcials/orden-compra-facturas-parcial.ts` | Angular build → 0 errores | ✅ | Frontend |

**Leyenda de estado:** ✅ Ejecutado y verificado · ⏳ Pendiente · 🔄 Revertido · 🟡 Parcial.

> ⚠️ **Cambio de comportamiento (Fase 1):** `CustomOrdenesCompra.InporteTotal` antes **omitía** la retención de ISR; ahora devuelve el neto real (`SubTotal + IVA − RetIVA − RetISR`), consistente con `OrdenCompraDetalle.Total`, con el PDF y con el mapeo de presupuesto. Afecta la carátula de fondeo (`FondeoAsync` → `Totales`). Riesgo registrado en el plan aceptado por el owner.

> ⚠️ **Cambio de comportamiento (Fase 2):** el guard unificado usa la lógica de 3 niveles (confirmado / validado / autorizado). El núcleo `OrdenCompraAppService.UpdateAsync` antes solo bloqueaba con fondeo **confirmado**; ahora también bloquea si el fondeo fue **verificado o autorizado administrativamente** — mismo criterio que los otros 4 submodulos. Mayor protección, alineado con RN-OC-030.

> ℹ️ **Fase 3 — contratos (shape JSON preservado):** `GetForEdit` y cotizaciones relacionadas siguen emitiendo las mismas claves (`id`, `folio`, `fechaSolicitud`, etc.) — solo cambió el tipo C# de `object` a DTO tipado. Los totales de detalle/presupuesto conservan `total`/`amount`. `GetSolicitudPagoPdf` ahora responde `ErrorResult` (antes 200 con `null`); el frontend ya muestra su mensaje de error. Sin cambios de contrato de red.

> ℹ️ **Fase 4 — integridad (sin cambio de datos):** los GUIDs sustituidos tenían **valor idéntico** a `CustomersIdLuxury.*`, por lo que no cambia ningún dato. El listado de gastos fijos **dejó de borrar** OC con relaciones incompletas: ahora las **omite** del listado y registra un warning — sin pérdida de datos (antes: borrado en cascada). Pendiente de confirmación de negocio: el escalado `Amount * 1.16M` en `GenerarOrdenCompraFijosAsync` se **revisó pero no se modificó** (requiere validación de negocio).

> ℹ️ **Fase 5 — pendiente:** naming de columnas `Indice`/`FundingId` queda aplazado. No se ejecuta migración ni cambio de base de datos.

> ℹ️ **Fase 6 — frontend:** listado, detalle, wizard, presupuesto, estado, facturas, edición y PDF principal usan tipos explícitos; el total final visible toma el valor consolidado por backend. Quedan `any` en gestor de vínculos, agregar producto legacy, comprobantes de pago y un segundo generador PDF duplicado; no bloquean los flujos principales y requieren tratamiento separado.

---

## 🧪 Verificación por cambio

| # | Criterio de paso | Automatización | Resultado |
|---|---|---|---|
| 1 | `OrdenCompraDetalle.Total` es la única fórmula; los helpers coinciden | Unit xUnit (`OrdenCompraTotalesTests`, 5 casos) | ✅ 5/5 |
| 2 | `InporteTotal` descuenta Retención ISR | Unit xUnit (`InporteTotal_Debe_Descontar_Retencion_ISR`) | ✅ |
| 3 | Build backend sin regresiones | `dotnet build LuxuryApp.Application` | ✅ 0 errores |
| 4 | Candado único; 0 copias privadas en `Purchases/` | `grep GetFundingConfirmedErrorAsync` + Unit xUnit (`FundingLockGuardTests`, 6 casos) | ✅ 11/11 |
| 5 | Bloqueo con fondeo confirmado/verificado/autorizado | Unit xUnit (`FondeoConfirmado/Verificado/Autorizado_Debe_Bloquear`) | ✅ |
| 6 | 0 `object`/`List<object>` en contratos de `Purchases/` | `grep` en `Modules/PurchasesLuxuryApp/Purchases` | ✅ 0 |
| 7 | Host `LuxuryApp.Api` compila con los nuevos DTOs | `dotnet build LuxuryApp.Api` | ✅ 0 errores |
| 8 | 0 GUIDs de catálogo hardcodeados en `Purchases/` | `grep` de los 3 GUIDs literales | ✅ 0 |
| 9 | El listado de gastos fijos no elimina OC incompletas | Unit xUnit (`OC_Incompleta_No_Debe_Borarse_Al_Listar_Gastos_Fijos`) | ✅ |
| 10 | Frontend principal compila con DTOs y enums tipados | `npm run build -- --configuration development` | ✅ 0 errores; warnings preexistentes fuera de Purchases |
| 11 | Wizard, formularios y PDF principal compilan con contratos tipados | `npm run build -- --configuration development` | ✅ 0 errores |

---

## ↩️ Rollback

| # | Cambio revertido | Motivo | Fecha | Verificación de reversión |
|---|---|---|---|---|
| — | *(vacío)* | — | — | — |

---

## 🏁 Cierre

Se cerrará este documento cuando todas las fases autorizadas del plan estén **ejecutadas, verificadas y registradas**, con sus criterios de paso en verde. El estado final se reflejará como `✅ Cerrado` en la sección de autorización y en cada fila del registro.
