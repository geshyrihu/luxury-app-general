# 🎨 Auditoría de UI/UX — Módulo Inspecciones (Recorridos)

## Contexto

Durante las pruebas manuales del `inspection-master-dashboard` y de la gestión de equipos/criterios (fases previas de este proyecto, ver `20260930-plan-inspection-master-dashboard.md` y `20260930-plan-restaurar-gestion-equipos-recorrido.md`), el usuario observó que la interfaz del módulo Inspecciones **no tiene separación clara desktop/mobile y se ve inconsistente en general** — no es una percepción aislada de una pantalla, es un patrón a lo largo de todo el módulo.

Esta auditoría sigue **literalmente** el protocolo oficial `conventions/ui/ui-audit-protocol.md` (4 STEPs: Componentes, Responsive, Accesibilidad, Diseño), referenciado desde `CONVENTIONS.md §5.5`. No se inventa criterio nuevo — se aplica el que ya existe.

**Esta fase es SOLO auditoría — no corregir nada todavía.** El resultado alimenta un plan de remediación posterior.

## Alcance

Todos los archivos `.ts`/`.html`/`.scss` bajo:
```
appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/
```
(33 archivos: dashboard, catálogo/lista, formulario alta/edición, detalle, alta/edición de equipo, áreas, reporte, logbook — mis recorridos lista/ejecutar, entrada QR, servicio de impresión QR).

También incluir, si tienen vista propia y viven fuera de esa carpeta:
- `appsweb/angular/src/app/modules/maintenance.luxuryapp/maintenance-ticket-catalogs/inspection-revision-catalog/` (catálogo de criterios — 2 archivos).

## Qué debe producir el agente (siguiendo `ui-audit-protocol.md` exactamente)

Para cada uno de los 4 STEPs del protocolo, ejecutar los comandos que ahí se indican (adaptados a la ruta de alcance de arriba) y llenar las tablas correspondientes:

### STEP 1 — Componentes (Reutilización vs Específico)
Tabla: Componente | Ubicación | Tipo (Shared/Específico) | Reutilizado (sí/no, cuántos usos) | Estado.
Poner atención especial a: ¿el diálogo "Agregar/Editar Equipo" usa wrappers de `shared/ui` o HTML nativo suelto? ¿Hay algún componente de Inspecciones que debería vivir en `shared/ui` y no lo hace?

### STEP 2 — Responsive (Desktop/Tablet/Mobile)
Por cada uno de los 33 archivos: ¿tiene bloque `d-none d-md-block` / `d-block d-md-none` (patrón ya usado en `inspection-master-dashboard.html`) o equivalente mobile-first? ¿O es una sola vista sin variante mobile?
Tabla de hallazgos: Archivo | ¿Tiene variante desktop+mobile? | ¿Cuál falta? | Severidad.
**Este es el punto central del reclamo del usuario — no resumir, listar los 33 archivos uno por uno.**

### STEP 3 — Accesibilidad (a11y)
Grep de `aria-label` en botones icon-only, inputs sin label asociado, contraste. Prestar atención específica al botón ⋮ (menú de acciones) de `lista-inspecciones.html` y al botón ➕ ya corregido en `inspection-master-dashboard` — confirmar que esa corrección sigue el patrón y no quedó aislada.

### STEP 4 — Diseño y Consistencia Visual (tokens vs hardcoding)
Grep de `color: #`, `padding: [0-9]`, `margin: [0-9]`, estilos inline, para todo el alcance. Comparar contra `conventions/ui/ui-ux-composition-rules.md` (Regla de Oro: cero márgenes mágicos, un solo botón primario por pantalla, toggles en línea con Flexbox) — confirmar explícitamente si el formulario de alta/edición de Inspección y el diálogo de Agregar/Editar Equipo cumplen esa regla o no.

## Salida esperada

Usar el formato de reporte exacto que pide `ui-audit-protocol.md` (sección "Reporte de Auditoría de UI"): las 4 tablas + Matriz de Severidad + lista de Hallazgos CRÍTICOS + lista de Hallazgos ALTOS. Pegar ese reporte completo en la sección de abajo, no un resumen.

No proponer fixes todavía — solo diagnóstico. El plan de remediación se arma en una fase siguiente, después de que yo audite este reporte.

---

## 📒 Registro de Ejecución

| Fase | Estado | Validación |
|---|---|---|
| Único — auditoría completa 4 STEPs | ✅ Completa y verificada | ✅ 4 STEPs + STEP 5 Taste documentados; 3 hallazgos cruzados contra código real (ver nota de Claude abajo) |

### 📤 Reportes de agentes externos

#### 📤 Reporte — Auditoría UI completa, STEPs 1-4 (2026-09-30)

## 🎨 UI/COMPONENTES

### Alcance verificado

- `inspection/`: 33 archivos físicos: 31 archivos UI/soporte y 2 specs.
- `maintenance-ticket-catalogs/inspection-revision-catalog/`: 4 archivos físicos correspondientes a 2 vistas lógicas (lista y formulario), incluidos por tener UI propia fuera del módulo.
- Auditoría realizada en modo solo lectura. No se modificó código.

### Componentes Encontrados

| Componente | Ubicación | Tipo | Reutilizado | Estado |
|:---|:---|:---|:---|:---|
| `InspectionMasterDashboard` | `inspection/inspection-master-dashboard/inspection-master-dashboard.ts:1-19` | Específico | 1 uso | ✓ OK; usa `AppIcon`, `LxCard`, `MobileListItem` shared |
| `ListaInspecciones` | `inspection/inspection-list/lista-inspecciones.ts:1-164` | Específico | 1 uso | ✓ Parcial; usa wrappers web/mobile shared |
| `InspeccionesForm` | `inspection/inspections-add-edit/inspecciones-form.ts:1-170` | Específico | 1 uso | ✓ OK; formulario específico con inputs shared |
| `InspectionDetailComponent` | `inspection/inspection-detail/inspection-detalle.ts:1-381` | Específico | 1 uso | ⚠️ botones HTML nativos en `:68-79` pese a wrappers disponibles |
| `InspeccionActivoCondominio` | `inspection/inspection-asset-add/inspeccion-activo-condominio.ts:1-201` | Específico | 1 uso | ✓ Parcial; wrappers shared, icono clickable suelto en template |
| `InspeccionActivoCondominioEditar` | `inspection/inspection-asset-edit/inspeccion-activo-condominio-editar.ts:1-239` | Específico | 1 uso | ✓ Parcial; wrappers shared, composición con márgenes utilitarios |
| `MisInspeccionesLista` | `inspection/logbook/mis-inspecciones-lista.ts:1-151` | Específico | 1 uso | ✓ Parcial; desktop/mobile shared |
| `MisInspeccionesEjecutar` | `inspection/logbook/mis-inspecciones-ejecutar.ts:1-250` | Específico | 1 uso | ✓ Parcial; desktop/mobile shared |
| `MisInspeccionesAgregarImagenes` | `inspection/logbook/mis-inspecciones-agregar-imagenes.ts:1-146` | Específico | 1 uso | ⚠️ vista única y file inputs sin asociación label demostrable |
| `ResultadoInspeccion` | `inspection/inspection-result/resultado-inspeccion.ts:1-105` | Específico | 1 uso | ⚠️ vista única; estados parciales |
| `ListaInformeInspeccion` | `inspection/inspection-report-list/lista-informe-inspeccion.ts:1-105` | Específico | 1 uso | ⚠️ vista única; empty state sin CTA |
| `InspectionQrEntry` | `inspection/inspection-qr-entry.ts:1-83` | Específico | 1 uso | ⚠️ vista única responsive no demostrada |
| `InspectionsAreas` | `inspection/inspection-areas/inspections-areas.ts:1-24` | Específico | 1 uso | ⚠️ placeholder; template HTML externo vacío |
| `CatalogoRevisionesInspeccion` | `maintenance-ticket-catalogs/inspection-revision-catalog/catalogo-revisiones-inspeccion.ts:1-113` | Específico | 1 uso | ✓ OK; wrappers web/mobile shared |
| `CatalogoRevisionesInspeccionForm` | `maintenance-ticket-catalogs/inspection-revision-catalog/catalogo-revisiones-inspeccion-form.ts:1-70` | Específico | 1 uso | ✓ Parcial; formulario shared, vista única |
| `AppTable`, `DataViewMobile`, `AppCard`, `ActionMenu`, botones, inputs y `AppIcon` | `shared/ui` importados por el módulo | Shared | Múltiples usos | ✓ OK; no se detectó duplicación local de estos wrappers |
| `inspecciones-form.spec.ts`, `inspeccion-pdf.service.spec.ts` | `inspection/` | Test/soporte | N/A | N/A para UI visual |

**Conteos STEP 1:** wrappers shared reutilizados en 9 vistas; 1 detalle usa botones nativos pese a wrappers existentes; 1 icono clickable carece de control semántico; no se detectó componente específico duplicado dentro de `shared/ui`.

### Responsive Design

Se evaluó desktop (1024px+), tablet (768px-1023px) y mobile (320px-767px). `Sí` significa variante explícita; `Parcial` significa cobertura indirecta por `col-md-*` o breakpoint programático; `No` significa una sola composición o archivo no visual.

| Archivo | ¿Tiene variante desktop+mobile? | ¿Cuál falta? | Severidad |
|:---|:---|:---|:---|
| `inspection/models/inspection.model.ts` | N/A, modelo | Desktop/mobile no aplica | — |
| `inspection/logbook/mis-inspecciones-lista.ts` | Sí, parcial tablet | No hay variante tablet dedicada | BAJA |
| `inspection/logbook/mis-inspecciones-lista.html` | Sí | Tablet dedicada; depende de `md` | BAJA |
| `inspection/logbook/mis-inspecciones-ejecutar.ts` | Sí, parcial tablet | Tablet dedicada; breakpoint programático | BAJA |
| `inspection/logbook/mis-inspecciones-ejecutar.html` | Sí | Tablet dedicada | BAJA |
| `inspection/logbook/mis-inspecciones-agregar-imagenes.ts` | No | Desktop/mobile/tablet | CRÍTICA |
| `inspection/logbook/mis-inspecciones-agregar-imagenes.html` | No | Desktop/mobile/tablet; formulario único `:3-107` | CRÍTICA |
| `inspection/inspections-add-edit/inspecciones-form.ts` | Parcial | Variante mobile/desktop dedicada | ALTA |
| `inspection/inspections-add-edit/inspecciones-form.spec.ts` | N/A, test | Desktop/mobile no aplica | — |
| `inspection/inspections-add-edit/inspecciones-form.html` | Parcial | Variante mobile/desktop dedicada; solo `col-md-*` `:48-75` | ALTA |
| `inspection/inspection-result/resultado-inspeccion.ts` | Parcial | Variante mobile/desktop dedicada | ALTA |
| `inspection/inspection-result/resultado-inspeccion.html` | Parcial | Variante mobile dedicada; solo `col-md-*` `:25-72` | ALTA |
| `inspection/inspection-report-list/lista-informe-inspeccion.ts` | Parcial | Variante mobile/desktop dedicada | ALTA |
| `inspection/inspection-report-list/lista-informe-inspeccion.html` | Parcial | Variante mobile dedicada; solo `col-md-*` `:6-101` | ALTA |
| `inspection/inspection-qr-print.service.ts` | N/A, impresión | Responsive web no aplica; solo `@media print` | — |
| `inspection/inspection-qr-entry.ts` | No | Desktop/mobile/tablet | CRÍTICA |
| `inspection/inspection-qr-entry.html` | No | Desktop/mobile/tablet; layout único `:3-25` | CRÍTICA |
| `inspection/inspection-master-dashboard/inspection-modules.ts` | N/A, datos | Desktop/mobile no aplica | — |
| `inspection/inspection-master-dashboard/inspection-module.model.ts` | N/A, modelo | Desktop/mobile no aplica | — |
| `inspection/inspection-master-dashboard/inspection-master-dashboard.ts` | Sí | Tablet dedicada | BAJA |
| `inspection/inspection-master-dashboard/inspection-master-dashboard.html` | Sí | Tablet dedicada; cubierta por Bootstrap `md` | BAJA |
| `inspection/inspection-list/lista-inspecciones.ts` | Sí | Tablet dedicada | BAJA |
| `inspection/inspection-list/lista-inspecciones.scss` | No dedicada | No hay breakpoint de viewport; solo dark/reduced motion `:69,158` | ALTA |
| `inspection/inspection-list/lista-inspecciones.html` | Sí | Tablet dedicada | BAJA |
| `inspection/inspection-detail/inspection-detalle.ts` | No | Desktop/mobile/tablet; template inline `:38-196` | CRÍTICA |
| `inspection/inspection-asset-edit/inspeccion-activo-condominio-editar.ts` | No | Desktop/mobile/tablet | CRÍTICA |
| `inspection/inspection-asset-edit/inspeccion-activo-condominio-editar.html` | No | Desktop/mobile/tablet; formulario único `:3-59` | CRÍTICA |
| `inspection/inspection-asset-add/inspeccion-activo-condominio.ts` | No | Desktop/mobile/tablet | CRÍTICA |
| `inspection/inspection-asset-add/inspeccion-activo-condominio.html` | No | Desktop/mobile/tablet; formulario único `:3-58` | CRÍTICA |
| `inspection/inspection-areas/inspections-areas.ts` | No | Desktop/mobile/tablet; placeholder inline `:4-22` | CRÍTICA |
| `inspection/inspection-areas/inspections-areas.html` | No | Todo contenido; archivo vacío | CRÍTICA |
| `inspection/inspeccion-pdf.service.ts` | N/A, documento | Responsive web no aplica | — |
| `inspection/inspeccion-pdf.service.spec.ts` | N/A, test | Desktop/mobile no aplica | — |

**Conteos STEP 2:** 6 vistas con desktop/mobile explícitos; 4 archivos de soporte/modelo/test/impresión N/A; 3 vistas con responsive indirecto; 8 componentes visuales sin variante mobile identificable; 0 SCSS con breakpoint de viewport propio; 0 variante tablet dedicada. El alcance solicitado queda listado archivo por archivo, incluidos los 2 specs.

**Archivos adicionales fuera del conteo de 33:** `maintenance-ticket-catalogs/inspection-revision-catalog/catalogo-revisiones-inspeccion.ts`, `.html`, `catalogo-revisiones-inspeccion-form.ts` y `.html`. La lista y catálogo tienen desktop/mobile explícitos (`catalogo-revisiones-inspeccion.html:2-54,57-89`); el formulario (`catalogo-revisiones-inspeccion-form.html:3-22`) no tiene variante mobile.

### Accesibilidad (a11y)

| Aspecto | Encontrado | Esperado | Estado | Ejemplar |
|:---|:---|:---|:---|:---|
| **ARIA Labels** | 0 `aria-label` explícitos encontrados en alcance visual | Botones icon-only nombrados | ⚠️ Revisar | `inspection-asset-add.html:29-34` |
| Botones con texto visible | La mayoría de `iw-button`, `il-button-*`, `ili-button-*` | ✓ | ✓ Parcial | Wrappers en `lista-inspecciones.html:5-11,44-50` |
| Botón icon-only en acciones | Acciones shared en `lista-inspecciones.html:74-90,147-158` | Nombre accesible verificable | ⚠️ Revisar | Menú `⋮` depende del wrapper; no hay label explícito en host |
| Botón icon-only sin label | `iw-button` cámara `mis-inspecciones-ejecutar.html:73-77` | 0 | ⚠️ | Solo icono visible |
| Icono clickable sin botón | `inspection-asset-add.html:29-34` | Elemento semántico y teclado | ✗ Violación | `app-icon` usado como acción |
| Inputs sin label asociado | File inputs ocultos `mis-inspecciones-agregar-imagenes.html:11-34` | `label` asociado o `aria-label` | ⚠️ Revisar | Activados por botones visibles, asociación no demostrable |
| Labels no asociados | `inspection-asset-add.html:21`, `inspection-asset-edit.html:32` | `for/id` o wrapper | ⚠️ Revisar | Label de posición separado del control |
| Imagen con `alt` | 5 usos principales con alt | Todas las imágenes informativas | ✓ Parcial | `resultado-inspeccion.html:67-81` |
| Imagen sin `alt` | Imagen en HTML PDF `inspeccion-pdf.service.ts:38-40` | 0 | ✗ Violación | `<img src="...">` generado sin `alt` |
| H1 presente | Dashboard y detalle | ≥1 por vista | ✓ Parcial | Otras vistas inician en H4/H5/H6 |
| Jerarquía H1→H2→H3 | Inconsistente | Sin saltos | ⚠️ Revisar | `inspection-report-list.html`, `resultado-inspeccion.html` |
| Contraste real | No calculado para pares renderizados | ≥4.5:1 normal, ≥3:1 grande | ⚠️ No demostrado | Literales en `inspection-modules.ts:13-52` y SCSS |
| Focus visible | Solo evidencia local en `.list-item` `lista-inspecciones.scss:44-47` | Cobertura de controles | ⚠️ No demostrado | Sin auditoría global de focus |
| Confirm nativo | `confirm()` en `inspection-detalle.ts:284` | Diálogo shared accesible | ✗ Violación | Estado destructivo nativo |
| Skip link | No verificado dentro del módulo | Skip link disponible globalmente | ⚠️ No demostrado | Requiere validación de shell |

**Confirmación específica solicitada:** el botón `➕` del dashboard tiene label/tooltip provisto por el wrapper de la card/acción previa, pero el HTML del dashboard usa cards clickeables (`inspection-master-dashboard.html:43-46`) y no una acción semántica `<button>`/`<a>`. La corrección visible del catálogo (`lista-inspecciones.html:5-11`) usa label y tooltip, pero no demuestra `aria-label` en el DOM del wrapper. El botón `⋮` usa `app-action-menu`, pero tampoco tiene nombre ARIA explícito verificable en el archivo.

### Diseño y Consistencia

| Aspecto | Encontrado | Esperado | Estado | Ejemplar |
|:---|:---|:---|:---|:---|
| **Design Tokens** | Wrappers shared y clases de diseño en varias vistas | Uso consistente | ✓ Parcial | `inspecciones-form.html:16-95` |
| Variables de color | No cuantificadas dentro del módulo; se mezclan clases y literales | Tokens sin duplicación | ⚠️ Revisar | `inspection-modules.ts:13-52` |
| Colores hardcodeados | 10 colores en datos del dashboard; 14+ literales/fallback en SCSS; múltiples en PDF/QR | 0 si hay tokens | ✗ VIOLACIÓN ALTA | `lista-inspecciones.scss:5-8,22,34,41,46,65,71-84,118,125` |
| Spacing hardcodeado | `padding: 8px 12px`, `padding: 4mm`, `margin: 16px`, utilidades `mt/mb/p` en formularios | Variables/gap tokenizado | ✗ VIOLACIÓN ALTA | `lista-inspecciones.scss:105,151`; `inspeccion-pdf.service.ts:58-65`; `inspection-asset-add.html:20-34` |
| Estilos inline | Bindings de color en dashboard y HTML generado PDF | Tokens/clases | ✗ VIOLACIÓN ALTA | `inspection-master-dashboard.html:51-53,111-113`; `inspeccion-pdf.service.ts:24-48` |
| Tipografía | Mezcla de clases, `font-size` literals en SCSS/PDF | Escala consistente | ⚠️ Revisar | `lista-inspecciones.scss:52,58,106,152`; PDF `:45,58-65` |
| Font weight | 400/600/700 y literales `font-weight:800` en QR | 3-5 pesos consistentes | ⚠️ Revisar | `inspection-qr-print.service.ts:46-47` |
| Formulario inspección | Wrappers shared + grid `col-md-*`, pero `mb-*`, `gap-*`, `g-4` | Grid/Flex con spacing tokenizado | ⚠️ Parcial | `inspecciones-form.html:48-75` |
| Diálogo agregar equipo | Wrappers shared y save shared, pero `mb-3`, `mb-2`, `p-2` e icono clickable | Cero márgenes mágicos y control semántico | ✗ Violación | `inspection-asset-add.html:20-34,54-58` |
| Diálogo editar equipo | Wrappers shared y confirm/save, pero márgenes/padding utilitarios | Cero márgenes mágicos | ⚠️ Parcial | `inspection-asset-edit.html:31-59` |
| Botones primarios | No se confirmó más de uno por vista | Uno por pantalla/modal | ✓ No hay violación confirmada | Save shared en formularios |
| Toggles/checkboxes | Flexbox inline en `mis-inspecciones-ejecutar.html:44-51,100-107`; checkbox en form `:52-59` | Alineación horizontal centrada | ✓ Parcial | Ejecutar cumple; form usa `flex-wrap` |
| CSS responsive propio | 0 media queries de viewport; solo dark/reduced motion | Breakpoints mobile-first | ⚠️ Revisar | `lista-inspecciones.scss:69,158` |

**STEP 4 — formulario de alta/edición:** `inspecciones-form.html` cumple parcialmente: usa wrappers shared, grid Bootstrap y un botón save, pero viola literalmente la regla de cero márgenes mágicos mediante `mb-3`, `mb-2`, `g-4` y `gap-*`. Los diálogos de equipo usan wrappers shared, pero alta incumple por icono clickable sin semántica; ambos usan spacing utilitario en vez de tokens.

### Criterio Visual (Taste)

| Criterio | Evidencia | Resultado |
|:---|:---|:---|
| Loading | QR entry tiene estado explícito `inspection-qr-entry.html:3-4`; otras listas tienen signal `loading` sin render consistente | ⚠️ Parcial |
| Empty | Listas usan texto descriptivo o `app-table-empty-message`; reportes `lista-informe-inspeccion.html:46-49` no ofrecen CTA | ⚠️ Parcial; no invita a acción |
| Error | QR y detalle muestran error inline; varios loaders/listas no tienen error explícito | ⚠️ Parcial |
| Skeleton | No encontrado en el alcance | ✗ Incumplido |
| `alert()`/`confirm()` nativo | `inspection-detalle.ts:284` usa `confirm()` | ✗ Incumplido |
| Anti-clichés IA | No se encontraron fondos crema/terracota, eyebrows decorativos, numeración ficticia o badges sin lógica | ✓ Sin hallazgo verificable |
| Tarjetas idénticas | Dashboard usa cards homogéneas para módulos distintos | ⚠️ Indicio; no crítico |
| Flechas decorativas | `north-east` en cards del dashboard indica navegación real | ✓ Justificado |
| Color-Lock | Dashboard usa 10 colores literales por card; estados usan success/danger | ⚠️ No tokenizado; violación de consistencia potencial |
| Contraste real | No calculado sobre pares fondo/texto/icono | ⚠️ No demostrado |
| Voz de UI | Verbos generalmente coherentes; typo visible `Agregar imígenes` en `mis-inspecciones-ejecutar.ts:203` | ⚠️ Revisar |

### Matriz de Severidad

| Problema | Severidad | Impacto | Evidencia |
|:---|:---|:---|:---|
| Vista solo desktop/sin variante mobile en formularios, detalle, QR, imágenes y placeholder | CRÍTICA | Módulo no ofrece composición adaptada en mobile | `inspection-detalle.ts:38-196`; `inspecciones-form.html:1-97`; asset add/edit; QR; imágenes |
| Tablet dedicada inexistente | CRÍTICA | La cobertura depende de saltos Bootstrap `md`, sin tratamiento específico 768-1023px | 0 media queries de viewport; `lista-inspecciones.scss:69,158` |
| Colores hardcodeados con tokens disponibles | ALTA | Inconsistencia y mantenimiento difícil | `inspection-modules.ts:13-52`; `lista-inspecciones.scss`; PDF/QR |
| Spacing/tipografía hardcodeados o márgenes mágicos | ALTA | Rompe composición uniforme y reglas del sistema | `lista-inspecciones.scss:105,151`; `inspecciones-form.html:48-75`; asset dialogs |
| HTML/estilos inline en PDF y QR no tokenizados | ALTA | Salida visual divergente del design system | `inspeccion-pdf.service.ts:24-87`; `inspection-qr-print.service.ts:41-53` |
| Botones nativos en detalle existiendo wrappers shared | ALTA | Inconsistencia de interacción, estados y accesibilidad | `inspection-detalle.ts:68-79` |
| Icono clickable sin botón/label en alta de equipo | ALTA | Acción no garantizada por teclado ni lector de pantalla | `inspection-asset-add.html:29-34` |
| Botones icon-only sin nombre ARIA demostrable | MEDIA | Usuarios de lector de pantalla no conocen acción | `mis-inspecciones-ejecutar.html:73-77`; menus list |
| Inputs file/labels no asociados | MEDIA | Asociación de formulario no demostrada | `mis-inspecciones-agregar-imagenes.html:11-34`; asset add/edit labels |
| Contraste no calculado sobre pares reales | MEDIA | No se puede confirmar WCAG AA | Dashboard palette, SCSS fallbacks, PDF/QR |
| Headings con jerarquía inconsistente | MEDIA | Navegación semántica irregular | report/result/detail |
| Empty states sin CTA | MEDIA | Usuario no sabe siguiente acción | `lista-informe-inspeccion.html:46-49` y listados |
| Spacing inconsistente entre utilidades | BAJA | Variación visual local | `mb-*`, `gap-*`, `p-*`, literales SCSS/PDF |

### Hallazgos CRÍTICOS

1. **Responsive incompleto en vistas centrales:** `InspectionDetailComponent`, formularios de inspección, diálogos de equipos, QR entry, carga de imágenes y placeholder de áreas no tienen variante desktop/mobile identificable. Evidencia: `inspection-detalle.ts:38-196`; `inspecciones-form.html:1-97`; `inspection-asset-add/inspeccion-activo-condominio.html:1-60`; `inspection-asset-edit/inspeccion-activo-condominio-editar.html:1-61`; `inspection-qr-entry.html:1-26`; `mis-inspecciones-agregar-imagenes.html:1-108`.
2. **No existe breakpoint/tablet dedicado en el módulo:** todas las adaptaciones tablet dependen de clases Bootstrap `md`; el único SCSS propio solo tiene `prefers-color-scheme` y `prefers-reduced-motion`. Evidencia: `inspection-list/lista-inspecciones.scss:69,158`.

### Hallazgos ALTOS

1. **Colores hardcodeados en datos y estilos:** `inspection-modules.ts:13-52` contiene 10 colores literales y el SCSS contiene colores/fallbacks literales, contrario al criterio de tokens.
2. **Spacing y tipografía hardcodeados:** `lista-inspecciones.scss:105,151`; `inspeccion-pdf.service.ts:45,58-65`; `inspection-qr-print.service.ts:41-53`; además formularios usan márgenes utilitarios contrarios a la regla de cero márgenes mágicos.
3. **PDF y QR generan HTML con estilos inline/literales:** `inspeccion-pdf.service.ts:24-87` y `inspection-qr-print.service.ts:41-53` divergen del design system y no usan tokens.
4. **Detalle usa botones HTML nativos pese a wrappers shared disponibles:** `inspection-detalle.ts:68-79`; pierde consistencia de estados y contrato UI.
5. **Alta de equipo tiene icono clickable sin control semántico:** `inspection-asset-add.html:29-34`; no hay botón, `aria-label`, focus ni alternativa de teclado demostrable.

No se proponen implementaciones ni fixes. Este reporte es diagnóstico únicamente, conforme a la solicitud de auditoría.

> **Nota de verificación (Claude, 2026-09-30):** crucé 3 hallazgos contra el código real, no solo el formato del reporte: (1) `inspection-asset-add.html:29-34` — confirmado, ícono `app-icon` con `(click)` sin botón/aria-label; (2) `inspection-areas/inspections-areas.html` — confirmado archivo literalmente vacío, huérfano desde que el componente pasó a `template` inline en la Fase 2 del plan del dashboard, nadie borró el `.html` viejo; (3) `lista-inspecciones.scss:5-8` — confirmado, literales hex como fallback de `var(--primary-100, #E8EEF6)` (matizable: el token es el valor principal, el hex es solo fallback, pero la observación es válida). **Auditoría aceptada.**
