# Ejecutado — Parte 1: Reubicación de SolicitudesCompra

**Fecha:** 2026-09-07
**Plan origen:** ver conversación; corrige/ejecuta `20260907-auditoria-ubicacion-modulo-compras.md` (Hallazgo 1 y parte del Hallazgo 2)
**Estado:** backend y frontend verificados, estructura final por sub-concepto en ambos lados; **sin commitear** (pendiente de que el usuario revise el diff y decida)

> **Nota:** este documento registra la ejecución inicial (Parte 1). La estructura por sub-concepto del
> backend (`Cotizaciones/Comparativo/Evidencia/Presupuesto/Detalle/Solicitudes/Shared`) se hizo en la
> Parte 1.5, documentada completa con las 4 rondas de auditoría en
> `docs/implementation-control/SOLICITUDESCOMPRA_20260907_CORRECCIONES.md` — ese es el documento con el
> detalle técnico exacto del backend. La sección de Frontend de este documento sí está actualizada al
> estado final (reorganización posterior a Parte 1.5).

## Qué se movió

### Backend — estado FINAL (post Parte 1.5, ver detalle en SOLICITUDESCOMPRA_20260907_CORRECCIONES.md)

`api/LuxuryApp.Application/Modules/SupplierLuxuryApp/Purchases/SolicitudCompra/**` + `ComprasLuxuryApp/PurchaseRequests/Entities/*` + `ComprasLuxuryApp/Quotes/Entities/*` → consolidados y luego re-organizados por sub-concepto en:

```
api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/
├── Solicitudes/    (núcleo: DTOs, Docs, EndPoints, Interfaces, Mapping, Services)
├── Cotizaciones/   (DTOs, EndPoints, Interfaces, Mapping, Services)
├── Comparativo/    (DTOs, EndPoints, Interfaces, Services)
├── Evidencia/      (DTOs, EndPoints, Entities, Interfaces, Mapping, Services)
├── Presupuesto/    (DTOs, EndPoints, Entities, Interfaces, Mapping, Services)
├── Detalle/        (DTOs, EndPoints, Entities, Interfaces, Mapping, Services)
└── Shared/Entities/ (SolicitudCompra.cs, CotizacionProveedor.cs — usadas por 2+ hijos)
```

Namespace: `LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.[Carpeta].[Capa]`.
`SolicitudesCompra/` es contenedor puro de 6 hijos + `Shared/`, sin nada suelto en su propia raíz.

**Historia completa de esta reestructura (4 rondas de auditoría, cada hallazgo con evidencia verificada):**
`docs/implementation-control/SOLICITUDESCOMPRA_20260907_CORRECCIONES.md` — incluye: registro DI de 3
servicios nuevos (bug que impedía arrancar la API), corrección de namespaces, extracción de
`Comparativo/Evidencia/Presupuesto` desde el God Service original, y el mapeo método-por-método completo.

**Global usings** (único punto real de acoplamiento, el proyecto centraliza `global using` por namespace):
`api/LuxuryApp.Application/GlobalUsings.cs`, `api/LuxuryApp.Api/GlobalUsings.cs`, `api/LuxuryApp.Tests/GlobalUsings.cs` — los 3 actualizados y verificados sin huérfanos.

**Build final:** `dotnet build` (Application y Api) → 0 errores.

### Frontend — estado FINAL (dos pasadas)

**Pasada 1 (misma fecha, dentro de Parte 1):**
```
appsweb/angular/src/app/apps/supplier.luxuryapp/pr/solicitud-compra/         → compras.luxuryapp/solicitud-compra/         (15 archivos)
appsweb/angular/src/app/apps/supplier.luxuryapp/quotes/provider-quotation/   → compras.luxuryapp/cotizacion-proveedor/     (8 archivos)
```
Limpieza de huérfanos confirmados sin referencias (auditoría Hallazgo 3):
`supplier.luxuryapp/pr/purchase-request/` (12 archivos) y `supplier.luxuryapp/provider-quotation/` top-level (6 archivos) eliminados.

**Pasada 2 (reordenamiento para espejar el backend por sub-concepto):** los dos folders de la Pasada 1 se
consolidaron en un solo contenedor, mismo criterio "punta a punta con el backend en la medida de lo
posible":
```
compras.luxuryapp/solicitudes-compras/
├── solicitudes/   (solicitud-compra, solicitud-compra-list, solicitud-compra-presentacion, pdf-solicitud-compra)
├── detalle/       (solicitud-compra-detalle, product-add, product-modal-add, producto-edit, product-data.interface)
└── comparativo/   (los 4 cuadro-comparativo-*, movidos completos SIN refactor de componente —
                    decisión explícita: estos archivos llaman simultáneamente a Cotizaciones+Comparativo+
                    Evidencia+Presupuesto+Solicitudes en el backend, no son separables sin partir el
                    componente Angular mismo; eso queda fuera de alcance, ver nota abajo)
```
No existen `cotizaciones/`, `evidencia/` ni `presupuesto/` en frontend — no hay pantalla propia que las
justifique como carpeta separada (mismo criterio que ya se había aplicado en la Pasada 1).

**Investigado y descartado como candidato a mover:** `supplier.luxuryapp/pr/cedula-presupuestal/` (es de
`OrdenCompra`, no de `SolicitudCompra`) y `supplier.luxuryapp/product/` (catálogo compartido por
`operations.luxuryapp`, `supplier.luxuryapp/po/*` Y `solicitud-compra` a la vez — no es exclusivo de este
módulo, se queda donde está).

**Imports corregidos (Pasada 2):** 5 en `compras.routing.ts`, 1 cruzado (`solicitud-compra.ts` →
`solicitud-compra-detalle`, ahora en otra subcarpeta), 2 relativos (`./product-add`, `./product-modal-add`,
detectados por `tsc` en la segunda pasada de verificación).

**Verificación:** `npx tsc --noEmit -p tsconfig.json` → exit 0, 0 errores (ambas pasadas).

**Nota sobre el clúster `comparativo/` sin refactor:** si en el futuro se decide separar de verdad
Cotizaciones/Evidencia/Presupuesto en el frontend, requiere extraer sub-componentes Angular del
`cuadro-comparativo-list.ts` (748+ líneas) y `cuadro-comparativo-cotizacion.ts` — es un refactor de UI con
riesgo real de romper la pantalla en producción, no una simple reubicación de archivos. Decisión
consciente del usuario: no se hace en esta ronda.

## Explícitamente no tocado (Fase 2, todavía pendiente — investigado pero no ejecutado)

- `OrdenCompra` (backend `SupplierLuxuryApp/Purchases/OrdenCompra*` + `PurchaseOrderAuth/Budget/Detail/Payment/Status`,
  frontend `supplier.luxuryapp/po/*`) — mapa de investigación ya existe en
  `docs/plans/20260907-mapa-ordenescompra-reestructura.md`, **no ejecutado**: el usuario aclaró que el
  alcance actual es solo `SolicitudCompra`, `OrdenCompra` se aborda como fase separada más adelante.
- `product/` (catálogo compartido — confirmado que lo usan `operations.luxuryapp`, `supplier.luxuryapp/po/*`
  y `solicitud-compra` a la vez, no es exclusivo de ningún módulo)
- `supplier.luxuryapp/pr/cedula-presupuestal/` (es de `OrdenCompra`, no de `SolicitudCompra`)
- Fork `provider/` vs `providers/provider/` (dominio Provider, no Compras)
- Contenido de calidad ya señalado en auditorías previas (README legacy, `any`, tests faltantes,
  `PurchaseRequestAddOrEditDTO` código muerto confirmado — no se borra sin autorización explícita)

## Pendiente antes de dar por cerrada esta parte

1. Revisión manual del usuario del diff en ambos repos (`api/`, `appsweb/angular/`) antes de commitear — no se ha hecho ningún commit en ninguna de las rondas.
2. Smoke test manual de rutas: `purchase-requests`, `solicitud-compra/:id`, `pdf-solicitud-compra/:id`, `cuadro-comparativo/:id`, `solicitud-compra-presentacion`.
3. Confirmar arranque real de `LuxuryApp.Api` en el entorno del usuario (build de compilación ya verificado 0 errores repetidamente; el arranque en caliente con DI completo se infirió indirectamente por un proceso corriendo, no se probó lanzando una instancia fresca controlada).
