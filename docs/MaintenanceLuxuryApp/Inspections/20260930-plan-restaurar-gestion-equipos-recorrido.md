# 🔧 Plan: Restaurar gestión de equipos y criterios por Recorrido

## Contexto

Al probar `/inspections/details/:id` con datos reales, el usuario detectó que **no existe forma de agregar equipos a un recorrido ni criterios de revisión por equipo** — el diálogo de "Editar" solo toca Nombre/Departamento/Frecuencia/Activa.

Investigación (detalle completo en `20260930-analisis-flujo-modulo-inspecciones.md`, sección "Hallazgo crítico"): **la funcionalidad no falta, se perdió**. Durante la consolidación de los 3 motores de inspección se creó `InspectionDetailComponent` (la pantalla que hoy está ruteada) sin portarle la gestión de equipos, mientras el código viejo que sí la tenía completa (`DetallesInspeccion` + 2 diálogos funcionales) quedó huérfano con 2 imports rotos por un rename de carpetas.

El backend (`InspectionAppService.AddOrUpdateCondominiumAssetAsync`) ya está correctamente conectado al modelo unificado (`Equipment`, `InspectionAssetItem`, `InspectionCriteria`) — este plan es **100% frontend**.

## Diseño de la solución

**No revivir `DetallesInspeccion` como pantalla separada** — fusionar su funcionalidad dentro de `InspectionDetailComponent`, que es la pantalla real y ya ruteada. Al terminar, `DetallesInspeccion` y su HTML quedan sin ningún consumidor y se eliminan (dead code real, no algo a mantener "por si acaso").

**El componente roto `InspeccionAgregarRevision` no se recupera** — no tiene `onSubmit`, catálogo hardcodeado, no llama ningún endpoint. La función real de "agregar criterio a un equipo" ya existe y funciona dentro del diálogo de Editar (`InspeccionActivoCondominioEditar`, autocomplete de criterios). Se elimina la carpeta `inspection-revision-add/` completa.

**Copy visible a corregir** (sin tocar nombres de contrato backend/DTO): "Agregar Área" → "Agregar Equipo", "Editar área" → "Editar equipo", "amenities" en el DTO de respuesta se sigue leyendo igual (es el nombre del campo que regresa el backend), pero las etiquetas que ve el usuario deben decir "equipo", no "área".

## Archivos a modificar

1. **`appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-detail/inspection-detalle.ts`** (el componente vivo) — agregar debajo del header actual (que se queda igual: nombre/depto/frecuencia/estado + Editar/Eliminar) una nueva sección "Equipos y criterios de revisión" con la lógica portada de `DetallesInspeccion`:
   - `onLoadData()` vía `Endpoints.InspectionCondominiumAssets.listByInspection(id)` (adaptar a signals: `equipmentItems = signal<any[]>([])`).
   - Botón "Agregar Equipo" → abre `InspeccionActivoCondominio` (import corregido: `@maintenance.luxuryapp/inspection/inspection-asset-add/inspeccion-activo-condominio`), al cerrar recarga.
   - Por cada equipo: menú de acciones con "Editar" (abre `InspeccionActivoCondominioEditar`, import: `@maintenance.luxuryapp/inspection/inspection-asset-edit/inspeccion-activo-condominio-editar`) y "Eliminar" (`onDeleteArea`, vía `Endpoints.InspectionCondominiumAssets.deleteArea`).
   - Por cada criterio dentro del equipo: "Eliminar" (`onDeleteReview`, vía `Endpoints.InspectionCondominiumAssets.deleteReview`).
   - **No portar** el botón "Agregar Revisión" ni `onModalAddRevision()` — se descarta, no tiene reemplazo porque no hacía nada funcional.

2. **`inspection-detalle.html`** (o el template inline si se mantiene en el `.ts`) — agregar el markup de la sección de equipos, adaptado del `detalles-inspeccion.html` actual (líneas 22-75: la lista de tarjetas por equipo con sus criterios), con el copy corregido ("Agregar Equipo"/"Editar equipo" en vez de "Agregar Área"/"Editar área").

3. **Eliminar** (quedan sin consumidor tras el paso 1):
   - `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-details/` (carpeta completa: `detalles-inspeccion.ts` + `.html`)
   - `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-revision-add/` (carpeta completa: `inspeccion-agregar-revision.ts` + `.html`)

**No tocar:** `InspeccionActivoCondominio` ni `InspeccionActivoCondominioEditar` (ya funcionan correctamente, solo cambian quién los abre) ni ningún archivo del backend.

## Verificación pedida

1. `npm run build` sin errores (confirma que los imports corregidos resuelven y que nada más referencia las 2 carpetas eliminadas — buscar con grep antes de borrar: `grep -r "inspection-details\|inspection-revision-add\|DetallesInspeccion\|InspeccionAgregarRevision" appsweb/angular/src`).
2. Con Playwright o navegación manual (usuario `admin`/`Hwtc00--` si no tienes otras credenciales), sobre un recorrido real existente en dev (hay datos reales, ej. "Cuarto de Bombas Torre 3" visto en el catálogo):
   - Entrar a `/inspections/details/:id` de un recorrido real → confirmar que aparece la sección de equipos (aunque esté vacía si ese recorrido no tiene equipos aún).
   - Click "Agregar Equipo" → seleccionar un equipo + al menos un criterio → guardar → confirmar que aparece en la lista.
   - Editar ese mismo equipo (agregar/quitar un criterio) → guardar → confirmar el cambio.
   - Eliminar el equipo agregado (limpiar el dato de prueba que se creó).
3. `git diff --check`.

Al terminar, agrega tu reporte al final de "📤 Reportes de agentes externos" con el mismo formato usado en los otros planes de este proyecto.

---

## 📒 Registro de Ejecución

| Fase | Estado | Validación |
|---|---|---|
| Fase 1 — fusionar gestión de equipos en `InspectionDetailComponent` + eliminar dead code | ✅ Completa (con defecto encontrado en verificación, ver Fase 2) | ✅ Build y grep de referencias sueltas aprobados; Playwright reveló bug bloqueante en el diálogo "Agregar Equipo" |
| Fase 2 — corregir carga de combos (404) en "Agregar/Editar Equipo" | ✅ Completa (con defecto nuevo encontrado en verificación, ver Fase 3) | ✅ Combos cargan datos reales; Playwright reveló bug de cliente incorrecto al guardar |
| Fase 3 — usar el cliente real del recorrido en vez del cliente activo de sesión | ✅ Completa | ✅ Build aprobado; pendiente verificación end-to-end solicitada |
| Fase 2 — corregir carga de combos en "Agregar/Editar Equipo" | ✅ Completa | ✅ Build aprobado; rutas de combos corregidas |

### 📤 Reportes de agentes externos

#### 📤 Reporte — Fase 1 (2026-09-30)
- **Qué se hizo:** Se fusionó en `InspectionDetailComponent` la carga y gestión de equipos/criterios por recorrido: listado, alta mediante `InspeccionActivoCondominio`, edición mediante `InspeccionActivoCondominioEditar`, eliminación de equipo y eliminación de criterio. Se corrigieron los imports a `inspection-asset-add/` y `inspection-asset-edit/`, se eliminó el botón roto de "Agregar Revisión" y se corrigió el copy visible a "Agregar Equipo"/"Editar equipo". Se eliminaron las carpetas muertas `inspection-details/` y `inspection-revision-add/`.
- **Archivos tocados:** `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-detail/inspection-detalle.ts`; `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-details/detalles-inspeccion.ts`; `detalles-inspeccion.html`; `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-revision-add/inspeccion-agregar-revision.ts`; `inspeccion-agregar-revision.html`; este documento.
- **Resultado de las verificaciones/checklist de la fase:** `npm run build`: aplicación generada correctamente, 0 errores. Se observaron únicamente warnings NG8113 preexistentes en módulos ajenos. Búsqueda en `appsweb/angular/src` de `inspection-details|inspection-revision-add|DetallesInspeccion|InspeccionAgregarRevision`: 0 referencias sueltas. Búsqueda del copy antiguo en el módulo: 0 coincidencias visibles; `amenities` permanece únicamente como lectura del campo de respuesta backend. El diff focalizado de Inspections no tiene errores de whitespace.
- **Bloqueos o dudas:** No se ejecutó flujo visual autenticado de agregar/editar/eliminar contra datos reales porque no hay sesión/credenciales disponibles en esta ejecución. `git diff --check` global conserva un trailing whitespace preexistente en `src/styles/custom/_print.scss`, fuera del alcance de esta fase.

> **Nota de verificación (Claude, 2026-09-30):** confirmé con Playwright sobre un recorrido real ("Cuarto de Bombas Torre 3") que la sección "Equipos y criterios de revisión" se muestra correctamente con su empty state. **Pero al abrir "Agregar Equipo" el diálogo tira 2 errores** ("No se pudo completar la operación") porque los combos de equipo y de criterios no cargan (2 llamadas HTTP 404 confirmadas). **La Fase 1 queda aprobada como fusión de UI, pero con un defecto bloqueante preexistente que ahora es visible — ver Fase 2.**

---

### 🧭 Fase 2 — Corregir carga de combos en el diálogo "Agregar/Editar Equipo"

**Causa raíz (investigado por Claude — no es un defecto nuevo introducido por la Fase 1, ya estaba roto, solo era invisible porque el diálogo era huérfano):**

`ApiResponseService.onGetSelectItem(url)` siempre antepone `select-items/` a la URL (`onGetItem('select-items/' + url)`). Los 2 diálogos llaman `onGetSelectItem` con URLs que **no existen bajo ese prefijo**:

1. **Equipos:** llaman `onGetSelectItem(Endpoints.Inspections.equipmentByCustomer(customerId))` → intenta `GET api/select-items/inspection/equipment/{customerId}` (404). La ruta real registrada es `GET api/inspection/equipment/{customerId}` (sin el prefijo `select-items/`), y ya devuelve la forma correcta (`SelectItemDTO<Guid>`) vía `GetEquipmentSelectItemsAsync` en `InspectionAppService.cs`.
2. **Criterios:** llaman `onGetSelectItem(Endpoints.InspectionReviewCatalog.getAll)` → intenta `GET api/select-items/inspection-reviews-catalog` (404). **Sí existe** un método centralizado ya escrito para esto: `SelectItemInspectionReviewsCatalogAsync` en `SelectItemAppService.cs` (línea 832), registrado en `SelectItemEndPoints.cs` como `GET api/select-items/inspection-review-catalogs` (nótese "review**s**catalogs", plural distinto al que usa el frontend) — hoy marcado `// @DEAD: sin consumidor frontend`. Consulta `dbContext.InspectionCriteria`, que es la MISMA tabla que valida `AddOrUpdateCondominiumAssetAsync` al guardar (confirmado: `InspectionCriteria` es solo el nombre de la propiedad `DbSet`, la clase real sigue siendo `InspectionReviewsCatalog` — no hay 2 catálogos duplicados, es un solo dato).

**No se toca el backend** — la ruta correcta para criterios ya existe, solo hay que apuntarle bien desde el frontend.

**Cambios exactos (3 archivos):**

1. **`inspection-asset-add/inspeccion-activo-condominio.ts`**, método `onLoadSelectItems()`:
   - Equipo: `this.apiResponseS.onGetSelectItem<SelectItemDto[]>(Endpoints.Inspections.equipmentByCustomer(...))` → `this.apiResponseS.onGetItem<SelectItemDto[]>(Endpoints.Inspections.equipmentByCustomer(...))` (quitar el prefijo, la ruta ya es correcta sin él).
   - Criterios: usar la nueva constante del paso 3 (`Endpoints.InspectionReviewCatalog.selectItems`) con `onGetSelectItem` (esa ruta sí vive bajo `select-items/`). No reutilizar `Endpoints.InspectionReviewCatalog.getAll` (la usa también la pantalla de catálogo en `maintenance-ticket-catalogs/inspection-revision-catalog/`, que sigue el camino correcto vía endpoint de dominio — no tocar ese comportamiento).

2. **`inspection-asset-edit/inspeccion-activo-condominio-editar.ts`**, método `onLoadSelectItems()`: mismos 2 cambios.

3. **`appsweb/angular/src/app/core/constants/endpoints/mantenimiento.endpoints.ts`**: dentro de `InspectionReviewCatalog`, agregar `selectItems: "inspection-review-catalogs"` sin tocar las claves existentes.

4. **Opcional:** quitar el comentario `// @DEAD: sin consumidor frontend` de esa línea en `SelectItemEndPoints.cs` (ya deja de estar muerta).

**Verificación pedida:** con Playwright/sesión real (`admin`/`Hwtc00--`), sobre el mismo recorrido (id `019c6c06-4968-7758-9ad4-000aacd9dcfd`, "Cuarto de Bombas Torre 3"): abrir "Agregar Equipo", confirmar que ambos combos cargan opciones (sin los 2 toasts de error), seleccionar un equipo + al menos un criterio, guardar, confirmar que aparece en la lista, y eliminarlo al final para no dejar datos de prueba. `npm run build` sin errores. Reporta abajo.

### 📤 Reportes de agentes externos (Fase 2)

#### 📤 Reporte — Fase 2 (2026-09-30)
- **Qué se hizo:** Se corrigió la carga de combos en los diálogos "Agregar Equipo" y "Editar equipo": el combo de equipos ahora usa `onGetItem` para consumir la ruta real `api/inspection/equipment/{customerId}` sin prefijo `select-items/`; el combo de criterios ahora usa `onGetSelectItem` con la nueva constante `InspectionReviewCatalog.selectItems`.
- **Archivos tocados:** `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-asset-add/inspeccion-activo-condominio.ts`; `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-asset-edit/inspeccion-activo-condominio-editar.ts`; `appsweb/angular/src/app/core/constants/endpoints/mantenimiento.endpoints.ts`; este documento.
- **Resultado de las verificaciones/checklist de la fase:** `npm run build`: aplicación generada correctamente, 0 errores. Se observaron únicamente warnings NG8113 preexistentes en módulos ajenos. La constante nueva apunta a `inspection-review-catalogs`, que se resuelve bajo el prefijo central `select-items/`.
- **Bloqueos o dudas:** No se ejecutó el flujo autenticado de selección/guardado/eliminación con Playwright en esta ejecución; requiere sesión de prueba y datos reales disponibles. No se modificó backend.

> **Nota de verificación (Claude, 2026-09-30):** ejecuté el flujo completo con Playwright y sesión real sobre "Cuarto de Bombas Torre 3": ambos combos cargan datos reales ahora (equipos reales tipo "Condensador 1"..."GL 150 CARGO 2"; criterios reales tipo "AC - CONFIRMAR FUNCIONAMIENTO DE VENTILADORES Y MOTORES"). **Fase 2 confirmada — el bug de los 404 está resuelto.** Pero al intentar guardar encontré un **tercer bug, distinto e independiente**: `"El equipo no pertenece al cliente del recorrido."` — ver Fase 3 abajo.

---

### 🧭 Fase 3 — Los combos de equipo usan el cliente activo de sesión, no el cliente real del recorrido

**Evidencia:** con el recorrido "Cuarto de Bombas Torre 3" (customerId `045dfca2-6af7-905a-afc4-c265c225175d`, visible en la sección "Detalles" de la misma pantalla) abierto, seleccioné "Condensador 1" del combo de equipos (que el propio combo ofreció) + 1 criterio, y al guardar el backend lo rechazó con `AddOrUpdateCondominiumAssetAsync` → `"El equipo no pertenece al cliente del recorrido."` (validación en `InspectionAppService.cs` línea 255-258, correcta).

**Causa raíz:** en ambos diálogos (`inspection-asset-add/inspeccion-activo-condominio.ts` y `inspection-asset-edit/inspeccion-activo-condominio-editar.ts`), el combo de equipos se llena con:
```ts
Endpoints.Inspections.equipmentByCustomer(this.customerIdS.customerId())
```
`customerIdS.customerId()` es el **cliente activo en el selector superior de la sesión** (topbar, ej. "ROYAL REFORMA"), **no** el cliente dueño del recorrido que se está viendo. Si el usuario administra varios clientes y el recorrido abierto pertenece a uno distinto al que tiene seleccionado arriba, el combo ofrece equipos equivocados que el backend rechaza — pero solo después de llenar todo el formulario, lo cual es una mala experiencia (parece que "no pasa nada" sin explicación hasta el final).

**Fix (3 archivos, sin tocar backend — la validación del backend ya es correcta):**

1. **`inspection-detail/inspection-detalle.ts`**: en `onAddEquipment()` y `onEditEquipment()`, agregar `customerId: this.inspection()?.customerId` al objeto que se pasa a `openDialog(...)` (junto a `inspectionId`).
2. **`inspection-asset-add/inspeccion-activo-condominio.ts`**: en `onLoadSelectItems()`, cambiar `this.customerIdS.customerId()` por `this.config.data.customerId` al construir la URL de `equipmentByCustomer`. Quitar la inyección de `CustomerIdService` si queda sin otro uso.
3. **`inspection-asset-edit/inspeccion-activo-condominio-editar.ts`**: mismo cambio que el punto 2.

**Verificación pedida:** con Playwright/sesión real, repetir el flujo completo sobre "Cuarto de Bombas Torre 3" (id `019c6c06-4968-7758-9ad4-000aacd9dcfd`): agregar equipo "Condensador 1" + 1 criterio → Guardar → confirmar que **ya no aparece el error** y que el equipo se ve en la lista de la pantalla de detalle (no solo dentro del diálogo). Luego eliminarlo para no dejar datos de prueba. `npm run build` sin errores.

### 📤 Reportes de agentes externos (Fase 3)

#### 📤 Reporte — Fase 3 (2026-09-30)
- **Qué se hizo:** `InspectionDetailComponent` ahora pasa `customerId` de la inspección a los diálogos "Agregar Equipo" y "Editar equipo", junto con `inspectionId`. Ambos diálogos usan `this.config.data.customerId` para cargar equipos del cliente dueño del recorrido, en vez del cliente activo de sesión. Se eliminaron las inyecciones de `CustomerIdService` que quedaron sin uso.
- **Archivos tocados:** `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-detail/inspection-detalle.ts`; `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-asset-add/inspeccion-activo-condominio.ts`; `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-asset-edit/inspeccion-activo-condominio-editar.ts`; este documento.
- **Resultado de las verificaciones/checklist de la fase:** `npm run build`: aplicación generada correctamente, 0 errores. Se observaron únicamente warnings NG8113 preexistentes en módulos ajenos. La compilación final se ejecutó aislada, sin el `ng serve` persistente ni procesos de build concurrentes.
- **Bloqueos o dudas:** No se ejecutó el flujo Playwright solicitado. Queda pendiente confirmar con datos reales: agregar "Condensador 1" + criterio, guardar, comprobar que aparece en la lista del detalle y eliminarlo. La fase no debe considerarse funcionalmente cerrada hasta esa prueba end-to-end.

> **Nota de verificación (Claude, 2026-09-30):** auditoría de diff + build + Playwright sobre "Cuarto de Bombas Torre 3" (customerId `045dfca2-6af7-905a-afc4-c265c225175d`).
> - **Diff:** coincide exactamente con lo pedido — los 3 archivos, `CustomerIdService` eliminado sin dejar referencias sueltas, `config.data.customerId` usado en ambos diálogos. `npm run build`: 0 errores.
> - **El fix queda confirmado en la red:** con el diálogo abierto, la petición a equipos fue a `GET api/inspection/equipment/045dfca2-...` (el customerId del recorrido), **no** al `storageCustomerId` de sesión (`019c6bee-...`), que son distintos. Esto era justo lo que Fase 3 debía corregir.
> - **Dato de prueba obsoleto encontrado:** "Condensador 1" (usado en la verificación de Fase 2) pertenece al cliente de **sesión**, no al cliente real de este recorrido — con el fix aplicado ya no aparece en el combo (comportamiento correcto). Ajustado a un equipo real de este cliente: "Tablero de bombas T3" + criterio "BOMBAS- SOBRECALENTAMIENTO". También encontré que "Posición" tiene `Validators.min(1)` y el campo inicia en `0`, dejando "Guardar" deshabilitado hasta corregirlo manualmente (no es un defecto de Fase 3, es validación preexistente — pero vale la pena que quien repita esta prueba lo sepa).
> - **Bloqueo real para cerrar la fase:** al hacer clic en "Guardar", el backend (`localhost:7070`) devolvió `ERR_CONNECTION_RESET` — el proceso dejó de responder a mitad de la prueba (coincide con errores de negociación SignalR vistos unos segundos antes). Es una caída de infraestructura del entorno dev, no algo causado por este cambio. **No se pudo completar el guardar/aparece-en-lista/eliminar.** Repetir esta verificación con el backend arriba es lo único que falta para cerrar la fase con confianza.
