# Mapa de reestructuración — OrdenesCompra (Fase 2, para revisión)

> Solo para que revises visualmente antes de que redacte el plan formal de ejecución. No se ha movido
> nada todavía. Decisiones ya tomadas contigo: nombres en inglés (Auth/Budget/Detail/Payment/Status se
> quedan como están), núcleo va a su propia carpeta `Ordenes/` desde el inicio.

---

## Estado actual (por qué esto es más simple que SolicitudCompra)

A diferencia de `SolicitudCompra`, aquí **alguien ya separó los 5 sub-conceptos** — existen como carpetas
hermanas de `OrdenCompra` bajo `SupplierLuxuryApp/Purchases/`:

```
SupplierLuxuryApp/Purchases/
├── OrdenCompra/            ← núcleo (21 métodos, 34 DTOs, TODOS los DTOs de los 5 hermanos viven aquí mezclados)
├── PurchaseOrderAuth/       (Interfaces, Services, EndPoints — sin DTOs propios, usa la entidad directo)
├── PurchaseOrderBudget/     (Interfaces, Services, EndPoints — sin DTOs propios)
├── PurchaseOrderDetail/     (Interfaces, Services, EndPoints — sin DTOs propios + SubService de totales)
├── PurchaseOrderPayment/    (Interfaces, Services, EndPoints — sin DTOs propios, 2 servicios: ComprobantePago + DatosPago)
└── PurchaseOrderStatus/     (Interfaces, Services, EndPoints — sin DTOs propios, también maneja Facturas/Invoices)
```

El trabajo aquí es: (1) reubicar estos 6 bajo `ComprasLuxuryApp/OrdenesCompra/` como hijos reales, (2)
clasificar los 34 DTOs sueltos de `OrdenCompra/DTOs/` y repartirlos a su dueño real (la mayoría hoy vive
mal ubicada junto al núcleo). Las Entities (`ComprasLuxuryApp/PurchaseOrders/Entities/`, 9 archivos) ya
están en `ComprasLuxuryApp` desde antes — solo se redistribuyen dentro de `OrdenesCompra`.

---

## Árbol backend propuesto

```
ComprasLuxuryApp/OrdenesCompra/
│
├── Shared/Entities/                      ← usadas por 2+ hijos
│   ├── OrdenCompra.cs                    (núcleo, referenciado por los 5 hijos vía FK/nav)
│   └── OrdenCompraFactura.cs             (usada por Status Y por el núcleo — AddInvoiceAsync vive en Status,
│                                            pero CreateFromInvoicesAsync del núcleo también las crea)
│
├── Ordenes/                              ← núcleo (IOrdenCompraAppService, 21 métodos, sin split — ya está bien acotado)
│   ├── DTOs/     OrdenCompraDTO, OrdenCompraAddOrEditDTO, OrdenCompraIndividualDTO (agregador, anida
│   │             1 DTO de cada hijo — mismo patrón que SCDTO), OrdenesCompraDTO (lista),
│   │             OrdenCompraPdfDTO, OrdenCompraLinkManagerDTO, UnlinkedOrderDTO,
│   │             ProgressiveOrdenCompraCreateDTO, FueraFondeoOrdenCompraCreateDTO,
│   │             BudgetToPurchaseOrderDTO (⚠️ referenciada por SolicitudesCompra/Presupuesto —
│   │               ver nota de impacto abajo), PurchaseDetailDTO.cs (⚠️ contiene 3 DTOs en 1 archivo,
│   │               deuda ya señalada en auditoría 2026-07-30, no se corrige aquí, solo se mueve)
│   ├── Interfaces/ IOrdenCompraAppService
│   ├── Services/   OrdenCompraAppService, OrdenCompraExtensions, Helpers/CustomOrdenesCompra.cs
│   ├── Mapping/    (revisar si hay CreateMap propios del núcleo, hoy no localizado ninguno dedicado)
│   ├── EndPoints/  OrdenCompraEndPoints
│   └── Docs/       README.md (existe, se mueve tal cual)
│
├── Auth/
│   ├── Interfaces/Services/EndPoints  (AutorizarAsync, DesautorizarAsync, NoAutorizadaAsync — usan
│   │                                    la entidad OrdenCompraAuth directo, sin DTO propio)
│   └── DTOs/  OrdenCompraIndividualAuthDTO (el nested de OrdenCompraIndividualDTO)
│
├── Budget/
│   ├── Interfaces/Services/EndPoints  (GetByIdAsync, GetAllForOrdenCompraAsync, AddAsync, UpdateAsync,
│   │                                    DeleteAsync, GetByIdForEditAsync, GetAllForPurchaseOrderBudgetTotalAsync,
│   │                                    GetByIdSimpleAsync)
│   ├── DTOs/  PurchaseOrderBudgetDTO, PurchaseOrderBudgetAddOrEditDTO, PurchaseOrderBudgetCreateDTO,
│   │          PurchaseOrderBudgetForOrdenCompraDTO, OrdenCompraIndividualPresupuestoDTO,
│   │          DetalleCompDTO (aparece en PurchaseOrderBudgetMapping.cs, columnas Total/Total2/Total3
│   │          tipo comparativo — clasificado aquí por asociación de uso, confirmar antes de mover)
│   ├── Entities/  PurchaseOrderBudget.cs, CatalogPurchaseOrderBudget.cs
│   └── Mapping/  PurchaseOrderBudgetMapping.cs
│
├── Detail/
│   ├── Interfaces/Services/EndPoints  (GetAllTotalAsync, GetByIdAsync, UpdateAsync, AddAsync,
│   │                                    GetListProductoToOrder, DeleteAsync)
│   ├── SubServices/  ITotalesOrdenCompraDetallleService + impl (⚠️ sin registro DI encontrado —
│   │                   verificar si se resuelve por instanciación directa o es un gap real, no relacionado
│   │                   a esta reubicación pero vale la pena reportarlo)
│   ├── DTOs/  OrdenCompraDetalleDTO, OrdenCompraDetalleCreateDTO, OrdenCompraDetallePdfDTO,
│   │          OrdenCompraIndividualDetalleDTO, ListProductoToOrderPagedListDTO (⚠️ no localizado su
│   │          archivo exacto en esta pasada, confirmar ubicación antes de mover)
│   └── Entities/  OrdenCompraDetalle.cs
│
├── Payment/                              ← 2 servicios distintos conviven aquí (ya así hoy, no se fusionan)
│   ├── Interfaces/Services/EndPoints  (ComprobantePago: AddAsync/DeleteAsync con archivo;
│   │                                    DatosPago: GetByIdAsync/UpdateAsync)
│   ├── DTOs/  OrdenCompraDatosPagoDTO, OrdenCompraDatosPagoAddOrEditDTO, OrdenCompraDatosPagoPdfDTO,
│   │          OrdenCompraIndividualDatosPagoDTO
│   └── Entities/  OrdenCompraDatosPago.cs, OrdenCompraComprobantePago.cs
│
└── Status/                               ← también maneja Facturas/Invoices (confirmado en la interfaz real)
    ├── Interfaces/Services/EndPoints  (GetByOrdenCompraIdAsync, UpdateAsync, AddInvoiceAsync,
    │                                    UpdateInvoiceFileAsync, UpdateInvoiceTypeAsync, DeleteInvoiceAsync)
    ├── DTOs/  OrdenCompraStatusUpdateDTO, OrdenCompraFacturaDTO, AddInvoiceDTO, UpdateInvoiceFileDTO,
    │          UpdateInvoiceTypeDTO, UpdatePaidStatusRequestDTO, OrdenCompraIndividualStatusDTO
    └── Entities/  OrdenCompraStatus.cs
```

**Namespace resultante:** `LuxuryApp.Application.Modules.ComprasLuxuryApp.OrdenesCompra.[Carpeta].[Capa]`

---

## ⚠️ Impacto cruzado — esto SÍ toca la Parte 1 ya cerrada

`BudgetToPurchaseOrderDTO` (va a `Ordenes/DTOs/`) es consumida hoy por
`ComprasLuxuryApp/SolicitudesCompra/Presupuesto/Interfaces/IPresupuestoAppService.cs` y su `Services/`
correspondiente (`GetAvailableBudgetsAsync`). Al mover este DTO, su namespace cambia de
`SupplierLuxuryApp.Purchases.OrdenCompra.DTOs` a `ComprasLuxuryApp.OrdenesCompra.Ordenes.DTOs` — hay que
actualizar el `using`/global using en esos 2 archivos de `SolicitudesCompra/Presupuesto/` también, o se
rompe el build de la Parte 1. Esto va explícito en el plan de ejecución, no es opcional.

---

## Cosas a verificar antes de mover (marcadas ⚠️ arriba)

1. `ListProductoToOrderPagedListDTO` — no encontré su archivo exacto, solo su uso en la interfaz de Detail.
2. `PurchaseHistoryDTO.cs` (+ `InvoiceFileDTO` anidado) — no aparece en ninguna de las 6 interfaces que leí.
   Candidatos: reporte/historial fuera de las 6 (posible entrypoint no localizado) o código muerto.
3. `PurchaseDetailDTO.cs` (3 DTOs en 1 archivo: `PurchaseDetailAsyncDTO`, `PurchaseLineItemDTO`,
   `PurchaseBudgetDTO`) — sospecho que alimenta `GetForEdit(Guid id)` del núcleo, que hoy devuelve
   `ApiResponseDTO<object>` (ya señalado como incumplimiento en la auditoría 2026-07-30). Se mueve tal
   cual, no se corrige el contrato en este pase.
4. `DetalleCompDTO.cs` — clasificado en Budget por aparecer en `PurchaseOrderBudgetMapping.cs`, confirmar.

---

## Árbol frontend propuesto — mismos nombres exactos que el backend

A diferencia de SolicitudCompra (donde el frontend no mapeaba limpio a los 5 conceptos), aquí **sí mapea
bien por nombre de archivo** a los mismos 6 hijos del backend. Estructura con nombres idénticos
(`ordenes/auth/budget/detail/payment/status`, kebab-case, espejo exacto de `Ordenes/Auth/Budget/Detail/Payment/Status`):

```
compras.luxuryapp/ordenes-compra/
│
├── ordenes/                              ← núcleo, espejo de OrdenesCompra/Ordenes/
│   ├── orden-compra.ts/.html (principal)
│   ├── orden-compra-list.ts/.html
│   ├── orden-compra-modal.ts/.html
│   ├── create-orden-compra.ts/.html
│   ├── create-orden-compra-wizard/
│   ├── orden-compra-pdf/
│   ├── generator-pdf/ (pdf-generation.service.ts)
│   ├── purchase-link-manager/
│   └── orden-compra-datos-cotizacion.ts/.html (parcial — origen/cotización de la OC, no pertenece a
│         ninguno de los 5, es dato del núcleo)
│
├── auth/                                 ← espejo de OrdenesCompra/Auth/
│   ├── orden-compra-denegada.ts/.html
│   └── orden-compra-datos-auth-parcial.ts/.html
│
├── budget/                               ← espejo de OrdenesCompra/Budget/
│   ├── orden-compra-presupuesto/
│   └── orden-compra-edit-presupusto-utilizado.ts/.html
│
├── detail/                                ← espejo de OrdenesCompra/Detail/
│   ├── orden-compra-detalle-form/
│   ├── orden-compra-edit-detalle.ts/.html
│   └── orden-compra-detalle-add-producto.ts/.html
│
├── payment/                               ← espejo de OrdenesCompra/Payment/
│   ├── orden-compra-datos-pago.ts/.html
│   ├── orden-compra-datos-pago-parcial.ts/.html
│   ├── payment-voucher-modal/
│   └── solicitud-pago-pdf/
│
└── status/                                ← espejo de OrdenesCompra/Status/ (incluye Facturas, igual que el backend)
    ├── orden-compra-status.ts/.html
    ├── orden-compra-status-parcial.ts/.html
    ├── orden-compra-factura-form.ts/.html
    └── orden-compra-facturas-parcial.ts/.html
```

**Nota de naming:** `forms/` y `parcials/` (carpetas técnicas genéricas que existen hoy) desaparecen — cada
archivo se reparte a su carpeta de sub-concepto real, igual criterio que "PROHIBIDO carpetas `components/`,
`utils/` arbitrarias" de CONVENTIONSFOLDER.MD §2.3.

⚠️ `orden-compra-edit-detalle.ts` y `orden-compra-edit-presupusto-utilizado.ts` clasificados por nombre de
selector (`app-orden-compra-edit-detalle`, `app-orden-compra-edit-presupusto-utilizado`) — no verifiqué
sus llamadas HTTP exactas, confirmar antes de mover si hay duda.

---

## Explícitamente fuera de alcance de esta fase

- No se corrige `GetForEdit` devolviendo `object`, ni `CotizacionesRelacionadasAsync` devolviendo
  `List<object>` (auditoría 2026-07-30, hallazgo #1) — se mueve tal cual.
- No se separa `PurchaseDetailDTO.cs` en 3 archivos (mismo hallazgo, #2).
- No se registra en DI `ITotalesOrdenCompraDetallleService` si resulta ser un gap real — solo se reporta.
- Frontend (`supplier.luxuryapp/po/*`, ~50 archivos) — se aborda en una fase separada después de cerrar
  el backend, igual que se hizo con SolicitudCompra.
- CONVENTIONS.md — misma decisión que la Parte 1, no se toca la excepción de 5 niveles.

¿Confirmas este mapa (incluyendo la clasificación de `OrdenCompraFactura` como `Shared/Entities/`) para
que redacte el plan formal de ejecución, o ajustamos algo antes?
