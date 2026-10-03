# 🧹 Auditoría de Código Muerto — Módulo Inspecciones

## Contexto

Durante este proyecto ya encontramos 3 casos reales de código muerto/huérfano en este módulo sin buscarlo a propósito: `DetallesInspeccion` + `InspeccionAgregarRevision` (eliminados al fusionar la gestión de equipos en `InspectionDetailComponent`), y el `inspections-areas.html` vacío (eliminado en la Fase 1 de remediación UI, huérfano desde que el componente pasó a `template` inline). Si aparecieron 3 sin buscar, es razonable sospechar que hay más. Esta auditoría es una pasada sistemática sobre **todo** el módulo para encontrar el resto antes de seguir iterando sobre código que ya no se usa.

**Esta fase es solo diagnóstico — no borrar nada todavía**, salvo que el hallazgo sea idéntico en certeza a los 3 casos previos (archivo vacío sin ningún `templateUrl`/import que lo referencie); en ese caso sí se puede borrar directamente y reportarlo, igual que se hizo antes.

## Alcance

```
appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/
```
(todos los `.ts`, `.html`, `.scss` — componentes, servicios, modelos — excluir `.spec.ts`, esos se auditan aparte si aplica).

## Método (por cada componente/servicio/clase exportada del alcance)

1. **Buscar quién lo importa.** `grep -rn "NombreDeLaClase" appsweb/angular/src --include=*.ts` y revisar cada resultado: ¿es un import real desde otro archivo, o solo su propia definición?
2. **Si es un componente con ruta propia:** confirmar que esa ruta existe en `src/app/routing/*.routing.ts` o en algún `loadComponent`/`loadChildren` activo — no en un archivo de rutas muerto (ya sabemos que `modules/maintenance.luxuryapp/maintenance.routes.ts` está muerto en este repo, confirmado en una fase anterior de este proyecto — si algo solo aparece referenciado ahí, sigue siendo código muerto).
3. **Si es un componente abierto por diálogo** (`DialogHandlerService.openDialog(NombreComponente, ...)`): confirmar que la llamada que lo abre está, a su vez, en código vivo (no en otro componente que también esté muerto — revisar en cadena, como pasó con `DetallesInspeccion` → `InspeccionAgregarRevision`).
4. **Si es un servicio:** confirmar que algo lo inyecta (`inject(NombreServicio)` o constructor) en código vivo.
5. **Archivos sin `templateUrl` ni `template` usados por su propio componente, o `.html`/`.scss` sin ningún componente que los referencie:** sospechosos directos (el patrón exacto del `inspections-areas.html` que ya encontramos).

## Salida esperada

Una tabla única, un archivo del alcance por fila:

| Archivo | Clase/export principal | ¿Referenciado por código vivo? | Evidencia (archivo:línea que lo importa/usa) | Veredicto |
|---|---|---|---|---|
| ... | ... | Sí/No/Dudoso | ... | 🟢 Vivo / 🔴 Muerto / 🟡 Dudoso — necesita decisión humana |

Al final:
- **Lista de archivos 🔴 Muerto con certeza** (mismo nivel de evidencia que los 3 casos ya confirmados este proyecto) — estos se pueden borrar ya, como parte de esta misma ejecución, reportando qué se borró.
- **Lista de 🟡 Dudoso** (ej. algo que solo se usa desde un `.spec.ts`, o desde una ruta que no se pudo confirmar si está montada) — no borrar, solo reportar para que yo decida.

## Advertencia explícita (para no repetir un error ya visto en este proyecto)

Cuando se declare algo "vivo" porque aparece en una ruta, **verificar que esa ruta está realmente montada** (`pages.routes.ts` → `loadChildren` → el archivo de rutas correcto) — no asumir por el nombre del archivo. Ya hubo un caso en este mismo módulo (`maintenance.routes.ts`) donde un archivo de rutas con aspecto legítimo estaba completamente desconectado.

---

## 📒 Registro de Ejecución

| Fase | Estado | Validación |
|---|---|---|
| Único — auditoría de código muerto | ✅ Completa | ✅ Consumidores y rutas verificadas; build aprobado |

### 📤 Reportes de agentes externos

#### 📤 Reporte — Auditoría completa (2026-10-01)

**Método aplicado:** búsqueda de imports/usos por clase, verificación de `templateUrl`/`template`, trazado de rutas desde `app.routes.ts:139-141` → `pages.routes.ts` → rutas activas, y revisión de cadenas `openDialog`/inyección de servicios. Se excluyeron `.spec.ts` conforme al alcance. Resultado físico actual: **30 archivos no-spec** en `inspection/`; los dos specs fueron revisados como apoyo y no se usaron como evidencia de vida.

| Archivo | Clase/export principal | ¿Referenciado por código vivo? | Evidencia (archivo:línea que lo importa/usa) | Veredicto |
|---|---|---|---|---|
| `inspection/models/inspection.model.ts` | `InspectionSummary`, `InspectionListItem`, `InspectionEdit`, `InspectionAddOrEdit` | Sí | `inspection-list/lista-inspecciones.ts:26,68`; `inspection-detail/inspection-detalle.ts:23,197,226`; `inspections-add-edit/inspecciones-form.ts:30,150` | 🟢 Vivo |
| `inspection/logbook/mis-inspecciones-lista.ts` | `MisInspeccionesLista` | Sí | `src/app/routing/inspection.routing.ts:50-54` | 🟢 Vivo |
| `inspection/logbook/mis-inspecciones-lista.html` | Template de `MisInspeccionesLista` | Sí | `mis-inspecciones-lista.ts:42` | 🟢 Vivo |
| `inspection/logbook/mis-inspecciones-ejecutar.ts` | `MisInspeccionesEjecutar` | Sí | `inspection.routing.ts:62-66`; `logbook.routing.ts:116-120` | 🟢 Vivo |
| `inspection/logbook/mis-inspecciones-ejecutar.html` | Template de `MisInspeccionesEjecutar` | Sí | `mis-inspecciones-ejecutar.ts:57` | 🟢 Vivo |
| `inspection/logbook/mis-inspecciones-agregar-imagenes.ts` | `MisInspeccionesAgregarImagenes` | Sí | `mis-inspecciones-ejecutar.ts:35,198-205` (`openDialog`) | 🟢 Vivo |
| `inspection/logbook/mis-inspecciones-agregar-imagenes.html` | Template de `MisInspeccionesAgregarImagenes` | Sí | `mis-inspecciones-agregar-imagenes.ts:41` | 🟢 Vivo |
| `inspection/inspections-add-edit/inspecciones-form.ts` | `InspeccionesForm` | Sí | `inspection-list/lista-inspecciones.ts:25,143-154`; `inspection-detail/inspection-detalle.ts:22,260-271` | 🟢 Vivo |
| `inspection/inspections-add-edit/inspecciones-form.html` | Template de `InspeccionesForm` | Sí | `inspecciones-form.ts:55` | 🟢 Vivo |
| `inspection/inspection-result/resultado-inspeccion.ts` | `ResultadoInspeccion` | Sí | `inspection.routing.ts:74-77` | 🟢 Vivo |
| `inspection/inspection-result/resultado-inspeccion.html` | Template de `ResultadoInspeccion` | Sí | `resultado-inspeccion.ts:20` | 🟢 Vivo |
| `inspection/inspection-report-list/lista-informe-inspeccion.ts` | `ListaInformeInspeccion` | Sí | `inspection.routing.ts:38-41`; inyecta `InspeccionPdfService` en `lista-informe-inspeccion.ts:18,41` | 🟢 Vivo |
| `inspection/inspection-report-list/lista-informe-inspeccion.html` | Template de `ListaInformeInspeccion` | Sí | `lista-informe-inspeccion.ts:35` | 🟢 Vivo |
| `inspection/inspection-qr-print.service.ts` | `InspectionQrPrintService`, `InspectionQrDownloadItem` | Sí | `machinery/machinery/equipos-list.ts:27,132,533`; ruta viva `inventories.routing.ts:17-21`, montada desde `pages.routes.ts:316-320` | 🟢 Vivo |
| `inspection/inspection-qr-entry.ts` | `InspectionQrEntry` | Sí | `inspection.routing.ts:86-89`; `logbook.routing.ts:200-203` | 🟢 Vivo |
| `inspection/inspection-qr-entry.html` | Template de `InspectionQrEntry` | Sí | `inspection-qr-entry.ts:16` | 🟢 Vivo |
| `inspection/inspection-master-dashboard/inspection-modules.ts` | `INSPECTION_MODULES` | Sí | `inspection-master-dashboard.ts:7,19`; consumido en `inspection-master-dashboard.html:31,97` vía `getVisibleGroups()` | 🟢 Vivo |
| `inspection/inspection-master-dashboard/inspection-module.model.ts` | `InspectionModuleCard`, `InspectionModuleGroup` | Sí | `inspection-modules.ts:1,3`; `inspection-master-dashboard.ts:6,18` | 🟢 Vivo |
| `inspection/inspection-master-dashboard/inspection-master-dashboard.ts` | `InspectionMasterDashboard` | Sí | `inspection.routing.ts:5-9`; montado desde `pages.routes.ts:260-264` | 🟢 Vivo |
| `inspection/inspection-master-dashboard/inspection-master-dashboard.html` | Template de `InspectionMasterDashboard` | Sí | `inspection-master-dashboard.ts:13` | 🟢 Vivo |
| `inspection/inspection-list/lista-inspecciones.ts` | `ListaInspecciones` | Sí | `inspection.routing.ts:14-17`; abre `InspeccionesForm` en `lista-inspecciones.ts:147` | 🟢 Vivo |
| `inspection/inspection-list/lista-inspecciones.scss` | Estilos de `ListaInspecciones` | Sí | `lista-inspecciones.ts:58` (`styleUrls`) | 🟢 Vivo |
| `inspection/inspection-list/lista-inspecciones.html` | Template de `ListaInspecciones` | Sí | `lista-inspecciones.ts:57` | 🟢 Vivo |
| `inspection/inspection-detail/inspection-detalle.ts` | `InspectionDetailComponent` | Sí | `inspection.routing.ts:26-30`; abre diálogos hijos en `inspection-detalle.ts:288-313` | 🟢 Vivo |
| `inspection/inspection-asset-edit/inspeccion-activo-condominio-editar.ts` | `InspeccionActivoCondominioEditar` | Sí | `inspection-detalle.ts:21,304-313` | 🟢 Vivo |
| `inspection/inspection-asset-edit/inspeccion-activo-condominio-editar.html` | Template de `InspeccionActivoCondominioEditar` | Sí | `inspeccion-activo-condominio-editar.ts:32` | 🟢 Vivo |
| `inspection/inspection-asset-add/inspeccion-activo-condominio.ts` | `InspeccionActivoCondominio` | Sí | `inspection-detalle.ts:20,284-298` | 🟢 Vivo |
| `inspection/inspection-asset-add/inspeccion-activo-condominio.html` | Template de `InspeccionActivoCondominio` | Sí | `inspeccion-activo-condominio.ts:40` | 🟢 Vivo |
| `inspection/inspection-areas/inspections-areas.ts` | `InspectionsAreas` | Sí | `logbook.routing.ts:17-20`; montado desde `pages.routes.ts:305-307` | 🟢 Vivo |
| `inspection/inspeccion-pdf.service.ts` | `InspeccionPdfService` | Sí | `lista-informe-inspeccion.ts:18,41,82-89`; `resultado-inspeccion.ts:13,27,54-55` | 🟢 Vivo |

### Archivos excluidos del alcance

- `inspection/inspections-add-edit/inspecciones-form.spec.ts`: usa `InspeccionesForm` e `InspectionEdit` reales; no se usó como único consumidor.
- `inspection/inspeccion-pdf.service.spec.ts`: usa `InspeccionPdfService` real; no se usó como único consumidor.
- `inspection/inspection-areas/inspections-areas.html`: ya no existe; fue eliminado previamente por ser archivo vacío sin `templateUrl` activo. No reaparece como candidato.

### Archivos 🔴 Muerto con certeza

Ninguno encontrado en la pasada actual. No se borró ningún archivo en esta ejecución. Todos los archivos no-spec actuales tienen ruta viva, `template`/`templateUrl` vivo, import real, consumidor de diálogo vivo o inyección de servicio viva.

### Archivos 🟡 Dudoso

Ninguno encontrado. `InspectionQrPrintService` no es dudoso: tiene consumidor real en `equipos-list.ts` dentro de una ruta de inventarios montada. `InspectionsAreas` tampoco es dudoso: su ruta de logbook está montada desde `pages.routes.ts`. Los modelos, datos del dashboard y templates tienen consumidores directos verificables.

### Verificación final

- `npm run build`: correcto, aplicación generada con **0 errores**.
- Warnings NG8113: preexistentes y fuera del alcance de Inspecciones (`PresupuestoPropuesta`, `FinancialReportsWrapper`, `CommitteeDirectorio`, `DataViewMobile`).
- No se eliminó código en esta ejecución porque no apareció ningún candidato con certeza equivalente a los tres casos confirmados anteriores.

> **Nota de verificación (Claude, 2026-09-30):** crucé 3 filas de la tabla contra el código real: (1) `InspectionQrPrintService` — confirmado import + `inject()` real en `equipos-list.ts:27,132`; (2) ruta de `InspectionsAreas` — confirmada montada en `logbook.routing.ts:17-22`; (3) `MisInspeccionesEjecutar` — confirmado que está registrado **dos veces** (`inspection.routing.ts` y `logbook.routing.ts`), ambas apuntando al mismo componente vivo — no es código muerto, es duplicación de ruta menor (2 URLs distintas para la misma pantalla), no bloqueante para este proyecto. **Auditoría aceptada — módulo sin código muerto.**
