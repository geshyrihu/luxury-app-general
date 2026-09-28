# Auditoría de Ubicación — Dominio Compras (SolicitudCompra / OrdenCompra / Cotización)

**Fecha:** 2026-09-07
**Alcance:** ubicación/propiedad de módulo, no calidad interna (ver auditorías previas)
**Backend revisado:** `api/LuxuryApp.Application/Modules/ComprasLuxuryApp/*`, `api/LuxuryApp.Application/Modules/SupplierLuxuryApp/Purchases/*`
**Frontend revisado:** `appsweb/angular/src/app/apps/supplier.luxuryapp/pr`, `.../po`, `.../quotes`, `.../provider*`, `appsweb/angular/src/app/apps/compras.luxuryapp`, `appsweb/angular/src/app/routing/compras.routing.ts`
**Documento rector:** `CONVENTIONS.md` + `CONVENTIONSFOLDER.MD` (catálogo de módulos §2.1, correspondencia back↔front §13, estructura estándar §"Estructura de módulo backend")
**Relacionadas (no duplicar, complementan):** [../../../docs/PurchasesLuxuryApp/PurchaseRequests/20260730-auditoria-purchases-solicitudes-compra.md](../../../docs/PurchasesLuxuryApp/PurchaseRequests/20260730-auditoria-purchases-solicitudes-compra.md), [../../../docs/PurchasesLuxuryApp/PurchaseOrders/20260730-auditoria-purchases-ordenes-compra.md](../../../docs/PurchasesLuxuryApp/PurchaseOrders/20260730-auditoria-purchases-ordenes-compra.md), [../../../docs/SupplierLuxuryApp/Suppliers/../../../docs/SupplierLuxuryApp/Suppliers/20260820-auditoria-supplier-provider.md](../../../docs/SupplierLuxuryApp/Suppliers/../../../docs/SupplierLuxuryApp/Suppliers/20260820-auditoria-supplier-provider.md)

---

## Resumen ejecutivo

Las tres auditorías previas de este dominio (jul-ago 2026) evaluaron **calidad interna** (contratos, typing, DTOs, docs, tests) de código que ya asumían ubicado en `SupplierLuxuryApp/Purchases/*`. Ninguna cuestionó **si esa ubicación es correcta**. Esta auditoría responde esa pregunta con evidencia de archivo/import real, y confirma la sospecha del usuario: **sí, está mal ubicado, y no es un solo problema sino tres capas distintas**:

1. **Split-brain de módulo (backend):** las Entities de `SolicitudCompra`, `OrdenCompra` y `CotizacionProveedor` viven en `ComprasLuxuryApp`, pero el 100% de sus DTOs/Services/Interfaces/EndPoints/Mapping viven en `SupplierLuxuryApp/Purchases`. Son dos módulos oficiales distintos del catálogo cerrado (§2.1) compartiendo una sola entidad de dominio — violación directa de "un submódulo no depende de entidades de otro módulo".
2. **Dueño de módulo equivocado (backend + frontend):** por el mapeo oficial `ComprasLuxuryApp ↔ compras.luxuryapp`, todo el flujo de compras debería vivir ahí. En la práctica `ComprasLuxuryApp` casi no tiene código propio (solo `HistorialCompras` está completo) y `compras.luxuryapp` en frontend solo contiene `historial-compras/`. El resto del dominio (solicitud, orden, cotización, productos) vive dentro de `SupplierLuxuryApp` / `supplier.luxuryapp`, que por catálogo es el módulo de **proveedores**, no de compras.
3. **Fragmentación en curso, no terminada (frontend):** dentro de `supplier.luxuryapp` hay carpetas duplicadas — una activa y ruteada, otra huérfana — para `solicitud-compra`, `provider`, `provider-quotation`, `provider-qualification` y `provider-support`. El propio `compras.routing.ts` tiene comentarios (`// Ruta anterior:`, `// Suggested path:`) que muestran un rename planeado y nunca ejecutado a nivel de carpetas. Y ya existe un `README-purchases-legacy.md` dentro de `SupplierLuxuryApp/Docs` advirtiendo de "código duplicado heredado" — apuntando a una ruta de una migración *anterior a esta* (`client/angular/.../features/purchasing/po`) que ya tampoco existe. Es decir: este dominio ya lleva al menos dos reestructuraciones a medias.

**Resultado formal:** requiere plan de relocalización (no solo remediación de calidad). Antes de ejecutar cualquier fix de los hallazgos de las 3 auditorías previas, hay que decidir dónde vive el código, o se seguirá corrigiendo calidad dentro de la ubicación equivocada.

---

> **Actualización 2026-09-07:** la porción de este hallazgo correspondiente a `SolicitudCompra`/`CotizacionProveedor` fue **resuelta** — ver `docs/reporte_maestro/modulos/20260907-plan-ejecutado-solicitudes-compra.md` (Parte 1) y `docs/implementation-control/SOLICITUDESCOMPRA_20260907_CORRECCIONES.md` (Parte 1.5, reestructura por sub-concepto: `Cotizaciones/Comparativo/Evidencia/Presupuesto/Detalle/Shared`, cerrada tras 3 rondas de auditoría). Pendiente: `OrdenCompra` y sus sub-submódulos, que siguen exactamente en el mismo split-brain.

## Hallazgo 1 — CRÍTICO: Entities en un módulo, Services/DTOs/EndPoints en otro

**Evidencia**

- `Modules/ComprasLuxuryApp/PurchaseRequests/Entities/{SolicitudCompra,SolicitudCompraDetalle,SolicitudCompraBudget,SolicitudCompraEvidence}.cs` → namespace `...ComprasLuxuryApp.PurchaseRequests.Entities`
- `Modules/ComprasLuxuryApp/PurchaseOrders/Entities/{OrdenCompra,OrdenCompraAuth,OrdenCompraDetalle,OrdenCompraDatosPago,OrdenCompraFactura,OrdenCompraComprobantePago,OrdenCompraStatus,PurchaseOrderBudget,CatalogPurchaseOrderBudget}.cs` → namespace `...ComprasLuxuryApp.PurchaseOrders.Entities`
- `Modules/ComprasLuxuryApp/Quotes/Entities/{CotizacionProveedor,CotizacionDetalle,CotizacionProveedorEvidence}.cs` → namespace `...ComprasLuxuryApp.Quotes.Entities`
- Único consumidor real de esos tres namespaces: `Modules/SupplierLuxuryApp/Purchases/SolicitudCompra/**`, `Modules/SupplierLuxuryApp/Purchases/OrdenCompra/**`, `Modules/SupplierLuxuryApp/Purchases/PurchaseOrder{Auth,Budget,Detail,Payment,Status}/**` (confirmado por grep de `Modules.ComprasLuxuryApp.PurchaseOrders`, `.PurchaseRequests`, `.Quotes` — 0 resultados fuera de `ComprasLuxuryApp` y `SupplierLuxuryApp`).
- Ninguno de esos tres submódulos de `ComprasLuxuryApp` tiene `DTOs/`, `Services/`, `Interfaces/` ni `EndPoints/` — solo `Entities/`.

**Impacto**

- Viola la estructura estándar de CONVENTIONSFOLDER.MD (`Entities/DTOs/Services/EndPoints` deben vivir juntos bajo el mismo submódulo) y la regla explícita "PROHIBIDO que un submódulo dependa directamente de entidades/servicios de otro módulo" (§2.2).
- El namespace ya no refleja dónde vive físicamente la lógica de negocio — rompe la premisa base de CONVENTIONSFOLDER.MD ("los namespaces respetan la ubicación física").
- Cualquier auditoría o onboarding que abra solo `ComprasLuxuryApp` concluye erróneamente que el módulo casi no tiene lógica.

**Recomendación**

- Mover `DTOs/`, `Services/`, `Interfaces/`, `EndPoints/`, `Mapping/` de `SupplierLuxuryApp/Purchases/{SolicitudCompra,OrdenCompra,...}` a `ComprasLuxuryApp/{PurchaseRequests,PurchaseOrders,Quotes}` — o, si se decide lo contrario, mover las `Entities/` hacia `SupplierLuxuryApp` — pero nunca dejar la entidad y su servicio en módulos distintos. Requiere plan de migración con impacto en `DbContext`, mappers y namespaces (fuera de alcance de esta auditoría; ver Plan de Fases).

---

> **Actualización 2026-09-07:** `SolicitudCompra` + `CotizacionProveedor` ya se movieron a `ComprasLuxuryApp`/`compras.luxuryapp` (Parte 1, ver `20260907-plan-ejecutado-solicitudes-compra.md`). Sigue pendiente `OrdenCompra` (backend `SupplierLuxuryApp/Purchases/OrdenCompra*` y frontend `supplier.luxuryapp/po/*`), que es la mayor parte de este hallazgo.

## Hallazgo 2 — CRÍTICO: el dominio "Compras" vive mayormente en el módulo "Supplier", no en `ComprasLuxuryApp`

**Evidencia**

- Catálogo oficial (`CONVENTIONSFOLDER.MD §2.1`): `ComprasLuxuryApp ↔ compras.luxuryapp` es el módulo designado para compras; `SupplierLuxuryApp ↔ supplier.luxuryapp` es el módulo designado para proveedores.
- Backend: `ComprasLuxuryApp` solo tiene un submódulo completo, `HistorialCompras/` (DTOs+EndPoints+Interfaces+Services). Todo lo demás del ciclo de compras (`SolicitudCompra` + `Detalle` + `CotizacionProveedor`, `OrdenCompra` + `PurchaseOrderAuth/Budget/Detail/Payment/Status`) está dentro de `SupplierLuxuryApp/Purchases/`.
- Frontend: `appsweb/angular/src/app/apps/compras.luxuryapp/` solo contiene `historial-compras/`. El resto (`pr/solicitud-compra`, `po/purchase-order`, `quotes/provider-quotation`, `product/`) está dentro de `supplier.luxuryapp/`.
- La propia documentación técnica del dominio, `SupplierLuxuryApp/Docs/documentacion-modulo-compras.md`, describe el frontend como si ya estuviera en `compras.luxuryapp` (`FE1["compras.luxuryapp<br/>solicitudes / oc / fondeo"]`) — la documentación asume una ubicación que el código real no tiene.
- El enrutador `appsweb/angular/src/app/apps/supplier.luxuryapp/purchasing.routing.ts` delega TODO a `src/app/routing/compras.routing.ts`, un archivo de rutas plano (fuera del patrón `[modulo].routing.ts` de §2.3/§4) que a su vez importa componentes de **cuatro** apps distintas: `contabilidad.luxuryapp` (presupuesto, catálogo de gastos fijos), `supplier.luxuryapp` (productos, solicitudes, órdenes, cuadro comparativo), `compras.luxuryapp` (historial) y `operations.luxuryapp` (presupuesto de mantenimiento).

**Impacto**

- El módulo "Compras" no tiene una ubicación física única navegable; está repartido en 4 apps de frontend y 2 módulos de backend.
- Rompe §13 "Correspondencia Backend ↔ Frontend" (el dominio maestro backend debe mapear al dominio frontend equivalente con el mismo nombre semántico).
- Cualquier feature nueva de compras no tiene un lugar obvio: ¿en `compras.luxuryapp` (el nombre correcto pero casi vacío) o en `supplier.luxuryapp` (donde "de facto" vive todo)? Esto perpetúa el problema con cada entrega nueva.

**Recomendación**

- Tratar esto como plan de migración de módulo (igual patrón que la migración Postgres o auth_core en memoria del proyecto): mover `pr/`, `po/`, `quotes/`, `product/` de `supplier.luxuryapp` a `compras.luxuryapp`, y sus equivalentes backend de `SupplierLuxuryApp/Purchases` a `ComprasLuxuryApp`. Requiere aprobación explícita antes de tocar código (§3.8 "No reubicar por iniciativa propia").
- Mientras no se migre, al menos corregir la documentación (`documentacion-modulo-compras.md`) para que describa la ubicación real, no la deseada — documentación engañosa ya fue señalada como hallazgo en la auditoría de Provider (2026-08-20).

---

## Hallazgo 3 — ALTO: carpetas duplicadas huérfanas dentro de `supplier.luxuryapp` (fragmentación de un rename a medias)

Confirmado por ausencia total de referencias en rutas/imports (`grep` sobre `appsweb/angular/src` y `src/app/routing/*.routing.ts`):

| Carpeta activa (ruteada) | Carpeta huérfana (0 referencias) | Nota |
|---|---|---|
| `pr/solicitud-compra/` (usada en `compras.routing.ts:44,57,70,95`) | `pr/purchase-request/` (12 archivos, timestamps más recientes: 2026-08-31 18:22 vs 07:29 del original) | Reescritura en inglés iniciada y abandonada sin reemplazar la original ni borrarla |
| `quotes/provider-quotation/` (usada en `compras.routing.ts:83`, tiene 1 archivo extra: `cuadro-comparativo-add-budget`) | `provider-quotation/` (top-level, 6 archivos, subconjunto de la anterior) | Copia vieja no eliminada tras mover a `quotes/` |
| `providers/provider-qualification/` (importada desde `provider-list.ts:28` y `providers/provider/provider-list.ts:24`) | `provider-qualification/` (top-level) | Copia vieja no eliminada tras mover a `providers/` |

**Evidencia de que el rename fue intencional pero incompleto:** `compras.routing.ts` tiene comentarios propios como `// Ruta anterior: 'solicitudes-compra'` (línea 42) y `// Suggested path: 'purchase-request/:id'` (línea 54) — alguien ya documentó el destino correcto de la migración de rutas/carpetas y nunca ejecutó el movimiento de archivos.

**Impacto**

- Cualquier desarrollador (o agente) que edite la carpeta huérfana por error no rompe nada en apariencia (compila, tiene tests propios en algunos casos) pero el cambio nunca llega a producción — falsa sensación de progreso.
- Duplica superficie de mantenimiento y de auditoría (las 3 auditorías previas de calidad ya evaluaron solo las rutas activas; si alguien repite auditoría sobre la carpeta huérfana, reporta hallazgos irrelevantes).

**Recomendación**

- Confirmar con el dueño del código que las carpetas huérfanas no tienen trabajo en progreso valioso, y eliminarlas. Si `purchase-request/` es de hecho un rediseño deseado, decidir explícitamente reemplazar `solicitud-compra/` por él (no dejar ambos).

---

## Hallazgo 4 — ALTO: fork real (no huérfano) del área `provider/`, con dos consumidores activos distintos

**Evidencia**

- `supplier.luxuryapp/provider/` (top-level) y `supplier.luxuryapp/providers/provider/` (anidado) contienen el mismo set de 5 componentes (`provider-list`, `proveedor-form`, `provider-card`, `provider-use`, `employee-provider-form`), prácticamente duplicados archivo por archivo.
- **Ambas copias tienen consumidores reales, no es código muerto:**
  - `providers/provider/provider-list` ← ruteado desde `appsweb/angular/src/app/routing/directory.routing.ts:7`
  - `providers/provider/provider-card` ← importado por `mantenimiento.luxuryapp/planificacin-de-mantenimiento/maintenance-calendar-master/datos-servicio-form.ts:8`
  - `provider/employee-provider-form` (top-level) ← re-exportado por `shared/integration/supplier/index.ts:6`
- Además, ambas copias de `provider-list.ts` importan `CalificacionProveedor` desde `providers/provider-qualification/calificacion-proveedor` — es decir, incluso la copia "vieja" (`provider/`) ya depende de la carpeta "nueva" (`providers/`), mezclando ambas generaciones.
- `provider-support/` está duplicado igual (`provider-support/` y `providers/provider-support/`), pero en este caso **ninguna de las dos copias tiene referencia alguna** fuera de sí mismas y de `core/constants/endpoints/supplier.endpoints.ts` — es decir, la única funcionalidad duplicada por partida doble es además una que no está enrutada en ningún lado.

**Impacto**

- No es un simple "borra el huérfano": un fix o bug reportado en `provider-list` puede corregirse en una copia y dejar la otra (real, ruteada desde `directory.routing.ts`) rota — riesgo activo de regresión invisible.
- `provider-support` es doble deuda: dos copias de una feature que no se usa desde ningún flujo conocido.

**Recomendación**

- Antes de tocar nada: confirmar con el dueño de negocio si `directory.routing.ts` (agenda de proveedores) y `compras.routing.ts` (flujo de compras) deberían compartir el mismo componente `provider-list`/`provider-card`, o si son variantes intencionalmente distintas. Si es el mismo concepto, consolidar en una sola carpeta y actualizar ambos imports.
- Para `provider-support`: confirmar si es una feature abandonada (se puede eliminar ambas copias) o pendiente de enrutar (se termina y se elimina la copia sobrante).

---

## Hallazgo 5 — MEDIO: naming inconsistente entre submódulos del mismo dominio

**Evidencia**

- Backend, mismo dominio "compras", nombres de submódulo mezclando idioma y número:
  - Inglés plural: `PurchaseRequests`, `PurchaseOrders`, `Quotes` (en `ComprasLuxuryApp`)
  - Español singular: `SolicitudCompra`, `OrdenCompra`, `CotizacionProveedor` (en `SupplierLuxuryApp/Purchases`) — además viola la regla de pluralización de carpetas de §2.2 (`SolicitudCompra/` → debería ser `SolicitudesCompra/` si se mantiene el nombre)
  - Inglés singular por sub-concepto: `PurchaseOrderAuth`, `PurchaseOrderBudget`, `PurchaseOrderDetail`, `PurchaseOrderPayment`, `PurchaseOrderStatus`
  - Español: `HistorialCompras` (único submódulo Spanish correctamente ubicado en `ComprasLuxuryApp`)

**Impacto**

- Un mismo dominio funcional usa 3 convenciones de nombre distintas simultáneamente; dificulta predecir dónde buscar código nuevo o existente.

**Recomendación**

- Al ejecutar el plan de relocalización (Hallazgo 2), aprovechar para unificar el idioma de nombres de submódulo (recomendado: inglés plural, consistente con `PurchaseRequests`/`PurchaseOrders`/`Quotes` ya existentes en `ComprasLuxuryApp`) y renombrar `SolicitudCompra`→`PurchaseRequests` (fusionar), `OrdenCompra`→`PurchaseOrders` (fusionar), `CotizacionProveedor`→`Quotes` (fusionar) — esto además resuelve el Hallazgo 1 de forma natural.

---

## Riesgos

- **Riesgo arquitectónico:** alto — dos módulos oficiales comparten entidades de dominio; el catálogo cerrado de módulos (§2.1) deja de ser una guía confiable de dónde vive el código.
- **Riesgo de mantenimiento:** alto — forks activos (`provider/` vs `providers/provider/`) pueden divergir en producción sin que ningún test lo detecte.
- **Riesgo de auditoría:** medio-alto — las auditorías de calidad previas (jul-ago 2026) son válidas pero incompletas: corrigieron síntomas dentro de la ubicación equivocada; si se ejecuta su plan de fases sin resolver primero la ubicación, el esfuerzo de typing/DTOs/tests se invierte en código que después hay que mover de todos modos.
- **Riesgo documental:** medio — al menos 2 documentos (`documentacion-modulo-compras.md`, `README-purchases-legacy.md`) describen ubicaciones que no coinciden con el filesystem actual, y uno de ellos remite a una ruta de una migración anterior ya inexistente.

---

## Plan de acción recomendado (orden de ejecución)

### Fase 0. Decisión (requiere aprobación humana — §3.8)
- [ ] Confirmar con el dueño de negocio/tech lead: ¿se migra "Compras" completo a `ComprasLuxuryApp`/`compras.luxuryapp`, o se formaliza `SupplierLuxuryApp` como dueño y se actualiza el catálogo oficial? (Hallazgo 2)
- [ ] Confirmar destino de `pr/purchase-request/` (¿reemplaza a `solicitud-compra/` o se descarta?) (Hallazgo 3)
- [ ] Confirmar si `provider-list`/`provider-card` deben ser un componente único compartido entre `directory.routing.ts` y `compras.routing.ts` (Hallazgo 4)
- [ ] Confirmar si `provider-support` (ambas copias) sigue vigente o se elimina (Hallazgo 4)

### Fase 1. Eliminar duplicados sin ambigüedad (bajo riesgo, no requiere fase 0)
- [ ] Borrar `provider-quotation/` (top-level) — subconjunto confirmado de `quotes/provider-quotation/`
- [ ] Borrar `provider-qualification/` (top-level) — duplicado confirmado de `providers/provider-qualification/`

### Fase 2. Reubicación de módulo (bloqueada por Fase 0)
- [ ] Mover DTOs/Services/Interfaces/EndPoints/Mapping de `SupplierLuxuryApp/Purchases/*` a `ComprasLuxuryApp/*` (o inverso, según decisión)
- [ ] Unificar naming de submódulos (Hallazgo 5)
- [ ] Mover frontend `pr/`, `po/`, `quotes/`, `product/` de `supplier.luxuryapp` a `compras.luxuryapp`
- [ ] Reescribir `compras.routing.ts` para que solo importe desde `compras.luxuryapp` (eliminar imports cross-app)

### Fase 3. Consolidar forks activos
- [ ] Resolver `provider/` vs `providers/provider/` según decisión de Fase 0
- [ ] Resolver `provider-support/` según decisión de Fase 0

### Fase 4. Documentación
- [ ] Actualizar/eliminar `documentacion-modulo-compras.md` y `README-purchases-legacy.md` para reflejar ubicación real post-migración
- [ ] Una vez reubicado, retomar los planes de fases de las 3 auditorías previas (contratos, typing, tests) ya en la ubicación correcta

---

## Checklist de validación

- [x] Ubicación de Entities y Services coincide (mismo submódulo) — **solo para `SolicitudCompra`/`CotizacionProveedor`** (2026-09-07); pendiente para `OrdenCompra`
- [ ] `compras.luxuryapp` contiene el flujo completo de compras (falta `OrdenCompra`, `product/`)
- [x] `compras.routing.ts` no importa desde `supplier.luxuryapp` para Solicitud/Cotización — sigue importando `po/*` (OrdenCompra) y `product/*`, pendientes
- [x] Sin carpetas duplicadas sin referencias: `pr/purchase-request/` y `provider-quotation/` (top-level) eliminadas (2026-09-07). Pendiente: `provider-qualification/` (top-level)
- [ ] Forks activos (`provider/`) consolidados en una sola fuente
- [ ] Documentación del módulo refleja el filesystem real
