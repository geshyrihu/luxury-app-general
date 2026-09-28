# Prompt 8b — Fase 6: diagnosticar la pantalla en blanco de "meter-list"

**Este prompt reemplaza cualquier cierre anterior del lote de
`maintenance.luxuryapp` — falta esto antes de darlo por bueno.**

La captura `fase6-rollout-8-meter-list.png` muestra el área de
contenido completamente en blanco (solo un botón "+ Agregar Medidor"
flotando arriba a la derecha) — sin tabla, sin el ícono+mensaje de
"Sin registros" que sí muestran todas las demás pantallas vacías de
esta migración (compara contra cualquier otra captura de esta sesión).
Esto no se acepta como "comportamiento normal de esa vista" sin
evidencia real.

## Qué hacer

1. Identifica exactamente qué ruta/componente muestra "Bitácora /
   Lista de Medidores" en el breadcrumb con "Lectura de consumos"
   resaltado en el sidebar (candidatos ya revisados sin encontrar el
   problema en su HTML: `logs/bitacoras/medidores/medidor-lectura-list.html`
   y `catalogos-tickets-mantenimiento/meter-category/meter-category-list.html`
   — puede ser un tercero, confírmalo por la URL real).
2. Abre esa pantalla en el navegador con la consola de DevTools
   abierta (pestaña Console y Network). Reporta el **log crudo real**
   de cualquier error — no una descripción, el texto exacto del error
   con stack trace si lo hay.
3. Si hay un error de red (llamada al backend fallando), repórtalo con
   el endpoint y código de estado exacto.
4. Si no hay ningún error en consola ni en red, y la pantalla
   simplemente no renderiza nada, revisa si `dataSignal()`/`data()` (o
   como se llame la señal de datos de ese componente específico)
   depende de algo que nunca se resuelve — comparte el `.ts` completo
   del componente real si no es ninguno de los 2 candidatos de arriba.

## Listo cuando

- Identificado el componente/ruta real exacto.
- Log crudo de consola/red adjunto (texto real, no resumen).
- Si el error es del mismo tipo ya visto esta migración (binding roto
  preexistente, no relacionado con el codemod), aplícalo con el mismo
  criterio: reconstruir si hay evidencia de qué faltaba, borrar si no
  la hay — y repite la captura para confirmar que ahora sí se ve la
  tabla o el empty-state real.
- Si el problema resulta ser algo del propio `app-table`/`AppTable`
  (no del archivo migrado), repórtalo así explícitamente, sin
  intentar parchearlo tú mismo — eso lo diseño yo.

---

# Prompt 8 — Fase 6: rollout de `maintenance.luxuryapp` (42 archivos)

Lote más grande hasta ahora. Mismo procedimiento ya probado 4 veces.
Un solo archivo excluido de antemano:

- `reports-mantenance/report-consumos/report-consumos.html` — usa
  `pTemplate=`, ya catalogado, no lo toques.

Un solo fix manual puntual, ahora resoluble de verdad (ya no es un
hueco, `AppTable` lo soporta desde el Prompt 7b):

- `catalogos-tickets-mantenimiento/task-group-category-list/task-group-category-list.html`
  usa `[sortField]`/`[sortOrder]` para el orden inicial — el codemod no
  los toca (no están en su patrón), así que después de correr el
  script, renómbralos a mano: `[sortField]` → `[initialSortField]`,
  `[sortOrder]` → `[initialSortOrder]`.

## Lote (42 archivos)

```
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/catalogo-activo-lista/catalogo-activo-lista.html
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/catalogo-revisiones-inspeccion/catalogo-revisiones-inspeccion.html
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/delivery-reception-catalog/catalogo-descripcion-list.html
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/machinery-classification/machinery-classification-list.html
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/meter-category/meter-category-list.html
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/product-category/product-category-list.html
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/task-group-category-list/task-group-category-list.html
src/app/modules/maintenance.luxuryapp/equipos-y-maquinaria/equipment-inspections/equipment-inspection-definitions-list.html
src/app/modules/maintenance.luxuryapp/equipos-y-maquinaria/equipment-inspections/equipment-inspection-execution-detail.html
src/app/modules/maintenance.luxuryapp/equipos-y-maquinaria/equipment-inspections/equipment-inspection-execution-history-list.html
src/app/modules/maintenance.luxuryapp/equipos-y-maquinaria/equipment-inspections/equipment-inspection-qr-list.html
src/app/modules/maintenance.luxuryapp/equipos-y-maquinaria/machinery/equipos-list.html
src/app/modules/maintenance.luxuryapp/equipos-y-maquinaria/machinery/mantenimientos-dialog.ts
src/app/modules/maintenance.luxuryapp/equipos-y-maquinaria/machinery/service-history-machinery.html
src/app/modules/maintenance.luxuryapp/fire-equipment/extinguisher-log/extintor-bitacora-list.html
src/app/modules/maintenance.luxuryapp/fire-equipment/hydrant-log/hidrante-bitacora-list.html
src/app/modules/maintenance.luxuryapp/fire-equipment/inspection-periods/cycle-list/fire-inspection-cycle-list.html
src/app/modules/maintenance.luxuryapp/fire-equipment/inspection-periods/period-list/fire-inspection-period-list.html
src/app/modules/maintenance.luxuryapp/fire-equipment/manual-call-point-log/estacion-manual-bitacora-list.html
src/app/modules/maintenance.luxuryapp/fire-equipment/smoke-detector-log/detector-humo-bitacora-list.html
src/app/modules/maintenance.luxuryapp/inspection/bitacora/mis-inspecciones-ejecutar.html
src/app/modules/maintenance.luxuryapp/inspection/bitacora/mis-inspecciones-lista.html
src/app/modules/maintenance.luxuryapp/logs/bitacoras/medidores/medidor-lectura-list.html
src/app/modules/maintenance.luxuryapp/logs/bitacoras/prestamo-herramienta/prestamo-herramientas-control.html
src/app/modules/maintenance.luxuryapp/logs/elevator-emergency-call/elevators-emergency-call-list.html
src/app/modules/maintenance.luxuryapp/logs/elevator-spare-parts/elevator-spare-parts-change-list.html
src/app/modules/maintenance.luxuryapp/logs/maintenance-log/bitacora-individual.html
src/app/modules/maintenance.luxuryapp/logs/maintenance-log/bitacora-mantenimiento.html
src/app/modules/maintenance.luxuryapp/logs/piscina-bitacora/piscina-bitacora-list.html
src/app/modules/maintenance.luxuryapp/logs/piscina/piscina-list.html
src/app/modules/maintenance.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-list.html
src/app/modules/maintenance.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-reporte.html
src/app/modules/maintenance.luxuryapp/logs/tool-loan/tool-list.html
src/app/modules/maintenance.luxuryapp/planificacin-de-mantenimiento/calendario-maestro-equipo/calendario-maestro-equipo.html
src/app/modules/maintenance.luxuryapp/reports-mantenance/maintenance-reports-list.html
src/app/modules/maintenance.luxuryapp/reports-mantenance/report-entrada-almacen/report-entrada-almacen.html
src/app/modules/maintenance.luxuryapp/reports-mantenance/report-prestamo-herramienta/report-prestamo-herramienta.html
src/app/modules/maintenance.luxuryapp/reports-mantenance/report-recorrido-diario/report-recorrido-diario.html
src/app/modules/maintenance.luxuryapp/reports-mantenance/report-salida-almacen/report-salida-almacen.html
src/app/modules/maintenance.luxuryapp/reports-mantenance/report-solicitud-compra/report-solicitud-compra.html
src/app/modules/maintenance.luxuryapp/reports-mantenance/report-ticket/report-ticket.html
src/app/modules/maintenance.luxuryapp/reports-mantenance/resumen-mantenimientos/resumen-mantenimientos.html
```

Nota: `logs/recepcion-pipas-agua/recepcion-pipas-agua-list.ts` es uno
de los 4 archivos que ya se corrigieron por corrupción de texto en una
ronda anterior (fuera de esta migración) — su `.html` sí es parte
normal de este lote, no hay nada especial que hacer con él aquí, solo
menciono el archivo por si te suena familiar.

## Procedimiento (idéntico a los 4 lotes anteriores)

1. `node scripts/migrate-p-table-standard.mjs --dry-run <los 42 archivos>`.
2. Debería dar 42 transformados, 0 excluidos, 0 advertencias. Si sale
   distinto o el conteo de archivos no coincide con lo que tú mismo
   verifiques con `grep -rl "<p-table" src/app/modules/maintenance.luxuryapp`,
   detente y repórtalo sin escribir.
3. Si calza, `--write`.
4. Aplica a mano el rename de `task-group-category-list.html`
   (`sortField`/`sortOrder` → `initialSortField`/`initialSortOrder`).
5. `npx tsc --noEmit` → limpio.
6. `ng build` sin errores de plantilla (recuerda: `tsc` solo no
   alcanza, ya lo confirmamos 2 veces esta migración).
7. `grep -rn "TableModule\|primeng-table\|<p-table\b"` sobre el lote →
   0 resultados reales (ignora imports muertos de `TableModule` sin
   ningún `<p-table>` real en el mismo archivo, eso no cuenta).

## Verificación visual

Elige **7-8 pantallas** representativas cubriendo los sub-módulos más
grandes (`catalogos-tickets-mantenimiento`, `equipos-y-maquinaria`,
`fire-equipment`, `logs`, `reports-mantenance`) — por ejemplo
`equipos-list.html`, `extintor-bitacora-list.html`,
`tool-list.html`, `medidor-lectura-list.html`,
`maintenance-reports-list.html`,
`task-group-category-list.html` (para confirmar el orden inicial),
`mis-inspecciones-lista.html`. Capturas reales, completas (sidebar y
contenido totalmente cargados), guardadas como archivo
(`docs/migration-template/fase6-rollout-8-<nombre>.png`).

## Listo cuando

- Los 42 archivos migrados, diff coherente con el dry-run.
- Fix manual de `task-group-category-list.html` aplicado.
- `tsc` y `ng build` limpios de errores de plantilla.
- 0 residuales reales de PrimeNG.
- 7-8 capturas reales completas.
- `git diff --stat` completo del lote.
- Hallazgos ajenos documentados con precisión, no arreglados salvo que
  sean del mismo tipo ya resuelto (binding roto tipo `[class.]`/`[]`,
  mismo criterio: reconstruir si hay evidencia, borrar si no la hay).
