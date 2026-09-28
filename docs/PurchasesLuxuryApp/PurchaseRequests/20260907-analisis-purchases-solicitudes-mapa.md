# Mapa de reestructuración — SolicitudesCompra (para revisión, no es el plan de ejecución)

> Este documento es solo para que revises visualmente cómo quedaría la estructura antes de que yo redacte
> las instrucciones formales para el agente ejecutor. No se ha movido nada de esto todavía.

---

## Árbol backend propuesto

```
📂 api/LuxuryApp.Application/Modules/ComprasLuxuryApp/
└── 📂 SolicitudesCompra/                              ← núcleo (sin cambio de nombre, ya existe)
    │
    ├── 📂 Entities/
    │   └── SolicitudCompra.cs
    │
    ├── 📂 DTOs/
    │   ├── SolicitudCompraDTO.cs
    │   ├── SolicitudCompraAddOrEditDTO.cs
    │   ├── SolicitudCompraIndividualDTO.cs
    │   ├── SolicitudesCompraIndexDTO.cs
    │   ├── SolicitudCompraPresentationOrderDTO.cs
    │   ├── SolicitudCompraPresentationSelectionDTO.cs
    │   ├── ComiteEventoDTO.cs
    │   └── ⚠️ PurchaseRequestAddOrEditDTO.cs          ← sospecha de código muerto, verificar uso real
    │
    ├── 📂 Interfaces/  → ISolicitudCompraAppService (recortada)
    ├── 📂 Services/    → SolicitudCompraAppService (recortado)
    ├── 📂 Mapping/     → SolicitudCompraMapper (recortado)
    ├── 📂 Docs/        → README-solicitud-compra.md
    ├── 📂 EndPoints/   → SolicitudCompraEndPoints (recortado)
    │
    │   Métodos que se quedan aquí:
    │   GetSolicitudCompraIndexDTO · GetIdSolicitudCompraAsync · GetSolicitudCompraIndividual
    │   AddAsync · UpdateAsync · DeleteSolicitudComplete · UploadRequestPdfAsync
    │   GetSelectedForPresentationAsync · UpdatePresentationSelectionAsync
    │   UpdatePresentationOrderAsync · UploadSupportPdfAsync · DeleteSupportPdfAsync
    │   GetComiteEventsAsync
    │
    ├── 📂 Cotizaciones/                               ← capas completas (DTOs/Interfaces/Services/EndPoints/Mapping)
    │   ├── Entities/     → CotizacionProveedor.cs
    │   ├── DTOs/         → CotizacionProveedorDTO.cs, CotizacionProveedorAddOrEditDTO.cs,
    │   │                    CotizacionProveedorListDTO.cs
    │   └── Métodos:      ListAsync · GetByIdAsync · AddAsync · UpdateAsync · UpdateProviderAsync
    │                     · DeleteByIdAsync · RemoveFileAsync (solo el PDF propio, no es Evidencia)
    │                     · GetProviders
    │
    ├── 📂 Comparativo/                                ← capas completas, SIN Entity propia (vista/orquestación)
    │   ├── DTOs/         → SolicitudCompraCuadroComparativoDTO.cs, SolicitudCompraCuadroComparativoUpdateDTO.cs,
    │   │                    ComparativeChartAnalysisInputDTO.cs, GetPosicionCotizacionDTO.cs,
    │   │                    SCDTO.cs, SCDetalleDTO.cs
    │   │                    (SCDetalleDTO trae Precio/Precio2/Precio3 — es el modelo del cuadro de 3 proveedores)
    │   └── Métodos:      GetSolicitudCompraCuadroComparativoDTOAsync · UpdateCuadroComparativoAsync
    │                     · AnalyzeComparativeChartAsync
    │                     · DeleteProvider          (doc real: "Elimina un proveedor DEL CUADRO COMPARATIVO")
    │                     · GetPosicionCotizacion   (doc real: "posición en el CUADRO COMPARATIVO (1,2,3)")
    │                     · ⚠️ GetSCDTO             (verificar qué pantalla frontend lo consume)
    │
    ├── 📂 Evidencia/                                  ← capas completas, TRANSVERSAL (Solicitud + Cotización)
    │   ├── Entities/     → SolicitudCompraEvidence.cs, CotizacionProveedorEvidence.cs
    │   ├── DTOs/         → SolicitudCompraEvidenceDTO.cs, SolicitudCompraEvidenceCreateDTO.cs,
    │   │                    CotizacionProveedorEvidenceDTO.cs, CotizacionProveedorEvidenceCreateDTO.cs
    │   └── Métodos:      AddEvidenceAsync/DeleteEvidenceAsync (de Solicitud)
    │                     + AddEvidenceAsync/DeleteEvidenceAsync (de Cotización)
    │                     ⚠️ renombrar a AddSolicitudEvidenceAsync / AddCotizacionEvidenceAsync
    │                        (evitar colisión de firma al unificar en una interfaz)
    │
    ├── 📂 Presupuesto/                                ← capas completas
    │   ├── Entities/     → SolicitudCompraBudget.cs
    │   ├── DTOs/         → SolicitudCompraBudgetDTO.cs, SolicitudCompraBudgetCreateDTO.cs
    │   └── Métodos:      GetAvailableBudgetsAsync · AddBudgetAsync · DeleteBudgetAsync
    │                     (GetAvailableBudgetsAsync devuelve BudgetToPurchaseOrderDTO, que es de
    │                      OrdenCompra — Parte 2 — se queda como referencia cruzada, no se mueve)
    │
    └── 📂 Detalle/                                    ← capas completas, TRANSVERSAL (ya existe, se completa)
        ├── Entities/     → SolicitudCompraDetalle.cs, CotizacionDetalle.cs
        ├── DTOs/         → SolicitudCompraDetalleDTO.cs, SolicitudCompraDetalleAddOrEditDTO.cs,
        │                    SolicitudCompraDetalleAddProductDTO.cs, SolicitudCompraDetalleEditPriceDTO.cs,
        │                    SolicitudCompraDetalleEditProductDTO.cs, SolicitudCompraDetalleIndividualDTO.cs,
        │                    SolicitudCompraDetalleProductListAddDTO.cs, SearchProductToAddDTO.cs,
        │                    CotizacionDetalleDTO.cs
        └── Métodos:      (ya existentes en ISolicitudCompraDetalleAppService, sin cambio de lógica)
                          GetByIdAsync · GetSolicitudCompraDetalleEditProductDTO · UpdateCantidadUnidadAsync
                          · UpdatePriceAsync · AddAsync · GetProductListAddDTO · SearchToAddRequest
                          · DeleteByIdAsync
                          + EndPoints/ propio (hoy vive como SolicitudCompraDetalleEndPoints.cs en la
                            raíz, se mueve adentro de Detalle/EndPoints/)
```

**Namespace resultante por carpeta:** `LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.[Carpeta].[Capa]`
(ej. `...SolicitudesCompra.Cotizaciones.DTOs`, `...SolicitudesCompra.Comparativo.Services`)

---

## Decisiones ya tomadas (2026-09-07)

- **Nombre raíz:** `SolicitudesCompra` (ya existe, cumple regla de pluralización). Confirmado.
- **`SupplierLuxuryApp.Purchases` NO se agrega como excepción de 5 niveles** — blindarlo contradice el
  Hallazgo 2 de la auditoría original: esa ubicación está mal y debe migrar a `ComprasLuxuryApp` en la
  Parte 2 (OrdenCompra), no legitimarse donde está.
- **CONVENTIONS.md no se modifica en este plan.** La excepción de 5 niveles para
  `ComprasLuxuryApp.SolicitudesCompra.[Cotizaciones|Comparativo|...]` queda como deuda documental
  pendiente, sin editar nada ahora.

---

## Frontend — la división de 5 NO se replica literalmente (hallazgo real)

Revisé los 15 archivos de `solicitud-compra/` + 8 de `cotizacion-proveedor/` (Parte 1). El backend separa
5 conceptos con datos/dueños distintos, pero el **frontend fue construido como 2 pantallas cohesivas**, no 5:

- Los 4 archivos `cuadro-comparativo-*.ts` (`list`, `cotizacion`, `add-proveedor`, `add-budget`) son
  **una sola pantalla** que internamente hace Cotizaciones + Comparativo + Presupuesto a la vez
  (`app-cuadro-comparativo-*` como selector común). No hay una pantalla separada de "solo cotizaciones"
  ni de "solo presupuesto".
- **No existe componente dedicado de Evidencia.** La subida de evidencia está embebida dentro de
  `solicitud-compra-presentacion.ts` y `cuadro-comparativo-list.ts` (confirmado por grep — son los únicos
  2 archivos que mencionan "evidence" en todo el feature).

Forzar 5 carpetas en frontend crearía carpetas vacías o divisiones artificiales dentro de una sola pantalla.
Propuesta pragmática (solo 2 subcarpetas reales, el resto queda en la raíz del feature):

```
compras.luxuryapp/
└── solicitud-compra/
    ├── solicitud-compra.ts / .html              ← raíz (orquestador, igual que backend núcleo)
    ├── solicitud-compra-list.ts / .html         ← raíz
    ├── solicitud-compra-presentacion.ts / .html ← raíz (incluye subida de evidencia embebida)
    ├── pdf-solicitud-compra.ts                  ← raíz
    │
    ├── 📂 detalle/                              ← mirror real de backend Detalle/
    │   ├── solicitud-compra-detalle.ts / .html
    │   ├── product-add.ts / .html
    │   ├── product-modal-add.ts / .html
    │   ├── producto-edit.ts / .html
    │   └── product-data.interface.ts
    │
    └── 📂 comparativo/                          ← fusión de cotizacion-proveedor/ (Parte 1) aquí adentro
        ├── cuadro-comparativo-list.ts / .html
        ├── cuadro-comparativo-cotizacion.ts / .html
        ├── cuadro-comparativo-add-proveedor.ts / .html
        └── cuadro-comparativo-add-budget.ts / .html
```

**No se crean** `cotizaciones/`, `evidencia/` ni `presupuesto/` en frontend — no hay UI propia que las
justifique como carpeta separada; viven dentro de `comparativo/` o en la raíz según el caso de arriba.

¿Confirmas esta versión pragmática del frontend, o prefieres forzar las 5 carpetas igual (aceptando que
`cotizaciones/`, `evidencia/` y `presupuesto/` queden vacías o con un solo archivo re-exportado)?
