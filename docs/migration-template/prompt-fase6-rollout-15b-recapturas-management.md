# Prompt 15b — Fase 6: 2 capturas del Prompt 15 no verifican nada

Al auditar las 4 capturas de `management.luxuryapp` encontré 2
problemas:

## 1. `minutas-list.png` muestra la pantalla a medio cargar, no el resultado

La imagen muestra el contenido borroso de fondo y un spinner con
"CARGANDO..." encima — es una captura tomada mientras la página
todavía estaba cargando, no después. No verifica que el fix
`result ?? []` funcione: no se ve ni la tabla ni el estado vacío
final.

Vuelve a `minutas-list`, **espera a que termine de cargar por
completo** (que desaparezca el spinner) y toma la captura ahí.

## 2. `seguimiento-legal.png` es la misma imagen que `seguimiento-minutas.png`

Confirmado: mismo contenido exacto (mismo breadcrumb "Juntas con
comite / Seguimiento de Minutas", mismo estado vacío, mismos
botones). Esto significa que **nunca se capturó
`junta-mensual-session-checklist-dialog.html`**, que es uno de los 4
archivos migrados en este lote — quedó sin verificar de verdad.

Este archivo es un **diálogo** (`DynamicDialogRef`), no una pantalla
con ruta propia — se abre desde
`juntas-mensuales-session.ts` (que es uno de los 3 archivos
excluidos de este lote, sigue en `p-table`, eso está bien, no lo
migres). Para verlo:

1. Navega a "Juntas con comité" → la pantalla de sesiones mensuales
   (`juntas-mensuales-session`).
2. Busca la acción que abre el diálogo de checklist (revisa el
   componente `juntas-mensuales-session.ts` línea ~316, busca dónde
   se invoca `JuntaMensualSessionChecklistDialog` para saber qué botón
   o acción lo dispara).
3. Con el diálogo abierto, toma la captura ahí — confirma que la
   tabla dentro del diálogo se ve bien (headers, estado vacío o datos,
   sin errores de consola).

## Listo cuando

- Nueva captura de `minutas-list` mostrando el estado final (no el
  loading).
- Captura real y distinta de `junta-mensual-session-checklist-dialog`
  con el diálogo abierto.
- Las otras 2 capturas (`meeting-area`, `seguimiento-minutas`) están
  bien, no hace falta repetirlas.
