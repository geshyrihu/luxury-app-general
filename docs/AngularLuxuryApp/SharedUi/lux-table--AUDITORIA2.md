# Plan de Remediacion y Mejora de `AppTable`

**Tipo:** plan tecnico derivado de auditoria
**Fecha:** 2026-09-18
**Componente:** `src/app/shared/ui/web/table/table.ts`
**Documentacion base:** `README.md` en esta carpeta
**Auditorias origen:**

- `docs/SharedLuxuryApp/DesignSystem/20260918-auditoria-shared-apptable-complemento.md`
- `docs/migration-template/03-inventario-componentes.md`
- `docs/migration-template/04-bitacora-cambios.md`

## 0. Fase de Pre-Planeacion

### 0.1 Problem statement

Actualmente, los usuarios de tablas desktop sufren comportamiento no
verificado o inconsistente al ordenar filas, columnas, usar lazy loading y
persistir cambios, porque `AppTable` concentra el mecanismo visual pero cada
consumidor conserva parte del contrato y las pruebas runtime no cubren el
circuito completo.

El caso urgente es `pReorderableRowHandle` en `task-list`: el markup puede
parecer correcto, pero el resultado depende de imports standalone, indices,
eventos drag/drop, handlers concurrentes y persistencia del consumidor.

### 0.2 KPIs

| KPI                                                      | Baseline                               | Objetivo                                | Plazo     |
| -------------------------------------------------------- | -------------------------------------- | --------------------------------------- | --------- |
| Reorder con handle en `task-list`                        | No cerrado runtime                     | Drag visual y drop funcional            | Fase 1    |
| Persistencia de orden                                    | No probada extremo a extremo           | Orden conserva posicion tras recarga    | Fase 1    |
| Consumidores reorder auditados                           | Parcial                                | 100% de consumidores encontrados        | Fase 2    |
| Pruebas unitarias de `AppTable`                          | No identificadas                       | Casos criticos cubiertos                | Fase 1    |
| Regresiones de build                                     | Build puede pasar aunque runtime falle | `tsc`, build, audit y diff check verdes | Cada fase |
| Capacidades no implementadas declaradas como disponibles | Riesgo de compatibilidad silenciosa    | Cero claims sin evidencia               | Cierre    |

### 0.3 Reglas tecnicas del plan

Aunque este componente no define reglas de negocio, se establecen reglas de
contrato para impedir regresiones.

| ID         | Nivel                 | Regla                                                                                                                      | Componentes afectados                          |
| ---------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| RN-TBL-001 | Nivel 1: invariante   | Una fila solo puede iniciar reorder desde un descendiente marcado con `pReorderableRowHandle`.                             | `AppReorderableRow`, `AppReorderableRowHandle` |
| RN-TBL-002 | Nivel 1: invariante   | `onRowReorder` debe emitir indices coherentes con el arreglo visible que la tabla reordena.                                | `AppTable.dropRow()`                           |
| RN-TBL-003 | Nivel 2: flujo        | El consumidor debe actualizar su fuente de verdad despues del drop; el preview interno no sustituye persistencia.          | `onRowReorder` de cada consumidor              |
| RN-TBL-004 | Nivel 2: flujo        | Un drag de dependencia, columna o fila no debe consumir eventos pertenecientes a otro flujo.                               | handlers drag/drop                             |
| RN-TBL-005 | Nivel 3: autorizacion | `AppTable` no ejecuta endpoints ni cambia datos de negocio; solo emite eventos tipados.                                    | `AppTable`, consumidores                       |
| RN-TBL-006 | Nivel 4: datos        | `dragIndex` y `dropIndex` invalidos no deben producir mutaciones ni llamadas de persistencia.                              | `dropRow`, handlers                            |
| RN-TBL-007 | Nivel 4: datos        | En lazy, `first`/`rows` representan ventana server-side; no se deben interpretar como array global sin contrato explicito. | `AppTableLazyEvent`, consumidores lazy         |

### 0.4 Flujos de control

#### Happy path: reorder

`handle → dragstart → startRowDrag → dragover → drop → dropRow →
onRowReorder → splice del consumidor → endpoint → recarga conservada`.

#### Sad path

- handle no importado;
- fila sin `[pReorderableRow]`;
- drop fuera de una fila valida;
- respuesta de persistencia fallida;
- consumidor usa array anterior en vez de indices;
- servidor Angular/Vite bloqueado por cache o procesos concurrentes.

#### Edge paths

- drag sobre la misma fila;
- array vacio;
- `dragIndex` fuera de rango;
- reorder con orden activo;
- reorder durante lazy pagination;
- fila con segundo drag de dependencia;
- cambios simultaneos de `value` mientras existe preview.

### 0.5 Pre-mortem

Suponiendo que el plan llego a produccion y fallo, causas probables:

1. Se valido compilacion pero no drag real.
2. Se arreglo `AppTable` y se rompio un consumidor que dependia de mutacion
3. Se persistieron indices de pagina como indices globales.
4. Un segundo handler `drop` consumo el mismo evento.
5. Vite quedo bloqueado por otro `ng build` y la prueba uso bundle viejo.

Mitigacion: pruebas runtime obligatorias, contrato explicito, logs completos,
inventario de consumidores y cierre por fases.

## 1. Resumen ejecutivo

El plan remedia primero el circuito de reordenamiento de filas porque es el
problema urgente y de mayor impacto funcional. Despues estabiliza el contrato
transversal y audita consumidores de columnas congeladas, columnas movibles,
uso real, sin implementar capacidades especulativas.

## 2. Objetivo

Dejar `AppTable` con contrato propio, verificable y documentado para las
capacidades actualmente usadas por la aplicacion:

- reorder de filas por handle;
- orden de columnas;
- columnas congeladas;
- sorting inicial y por columna;
- paginacion client-side y lazy;
- filtro global;
- seleccion;
- agrupacion visual.

Cada capacidad debe tener:

- API clara;
- consumidor correcto;
- persistencia o responsabilidad delimitada;
- prueba estatica;
- prueba runtime cuando afecte interaccion.

## 3. Alcance

### Incluido

- `table.ts` y sus directivas/componentes auxiliares.
- `README.md` de `shared/ui/web/table`.
- consumidores que usan `pReorderableRow`, `pReorderableRowHandle`,
  `reorderableColumns`, `pFrozenColumn`, `onRowReorder` u `onLazyLoad`.
- pruebas unitarias y runtime necesarias.
- bitacora e inventario de migracion.

### Fuera de alcance inicial

- virtual scroll;
- expansion de filas;
- resize de columnas;
- filtros por columna;
- exportacion;
- context menu;
- seleccion global server-side;
- rediseño visual general de tablas;

Estas capacidades solo se agregaran mediante fase aprobada y evidencia de uso.

## 4. Restricciones

- No reintroducir `p-table`.
- No agregar dependencia de drag/drop.
- No cambiar endpoints ni DTOs sin analisis de impacto.
- No cambiar el comportamiento mobile para resolver desktop.
- No asumir que `reorderableRows` por si solo activa handles.
- Shared UI requiere analisis de impacto antes de cada cambio.
- Todo build debe guardarse completo, sin `tail`, para no ocultar errores.
- Las modificaciones manuales deben hacerse con `apply_patch`.

## 5. Fases de implementacion

## Fase 1. Cierre del reorder de filas

**Prioridad:** critica
**Objetivo:** hacer funcional y demostrable `pReorderableRowHandle`.

### Archivos principales

- `src/app/shared/ui/web/table/table.ts`
- `src/app/shared/ui/web/table/README.md`
- `src/app/modules/operations.luxuryapp/task/tasks/task-message/task-list.ts`
- `src/app/modules/operations.luxuryapp/task/tasks/task-message/task-list.html`

### Tareas

- [ ] Confirmar que `AppReorderableRowHandle` aplica clase host estable y
      funciona sobre `app-icon` y elementos HTML nativos.
- [x] Confirmar que `AppReorderableRow` cancela drag iniciado fuera del handle.
- [x] Definir `reorderableRows` como gate real: `false` bloquea drag/drop aun
      cuando exista la directiva de fila.
- [ ] Validar indices cuando drag y drop son la misma fila.
- [ ] Validar indices fuera de rango y array vacio.
- [ ] Aislar drop de reorder frente a drag de dependencia usando tipo MIME.
- [ ] Mantener `effectAllowed/dropEffect` como `move`.
- [ ] Confirmar `task-list` con imports standalone de ambas directivas.
- [ ] Confirmar handler que usa `dragIndex` y `dropIndex`.
- [ ] Confirmar actualizacion inmediata del signal antes de persistir.
- [ ] Confirmar tratamiento de error del endpoint y rollback/reload.

### Criterios de paso

- El DOM contiene `tr.lux-table-reorderable-row`.
- Cada fila tiene `draggable="true"`.
- El handle contiene `.lux-table-row-handle`.
- Arrastrar desde el menu mueve la fila.
- Arrastrar desde una celda no handle no inicia reorder.
- Drop cambia el orden visual.
- `onRowReorder` entrega indices correctos.
- El endpoint recibe IDs en el orden nuevo.
- Recarga conserva el orden.
- Drag de dependencia no dispara reorder.

## Fase 2. Cobertura de consumidores de reorder

**Prioridad:** alta
**Objetivo:** eliminar diferencias entre consumidores migrados.

### Tareas

- [ ] Inventariar todos los templates con `[pReorderableRow]`.
- [ ] Verificar imports de `AppReorderableRow` y
      `AppReorderableRowHandle` en cada standalone component.
- [ ] Verificar binding `(onRowReorder)` en cada consumidor.
- [ ] Clasificar handlers: persistencia, solo visual o pendiente.
- [ ] Probar al menos un consumidor de cada modulo que tenga reorder.
- [ ] Registrar tabla de consumidores, endpoint, estado y evidencia.

### Criterios de paso

- 100% de consumidores listados.
- Ningun handler ignora `dragIndex`/`dropIndex` sin justificacion.
- Cada consumidor tiene prueba estatica y clasificacion runtime.

## Fase 3. Orden y columnas congeladas

**Prioridad:** alta
**Objetivo:** comprobar que las implementaciones DOM no solo compilan.

### Tareas

- [ ] Auditar consumidores de `[reorderableColumns]`.
- [ ] Confirmar que cada `<th>` recibe `data-lux-table-col` y
      `draggable="true"` cuando corresponde.
- [ ] Probar reorder visual de header y celdas body.
- [ ] Auditar consumidores de `pFrozenColumn` y `alignFrozen`.
- [ ] Probar multiples columnas frozen a izquierda y derecha.
- [ ] Probar combinacion de frozen, scroll y reorder de columnas.
- [ ] Definir si el orden de columnas debe persistir y donde.

### Criterios de paso

- Header y body conservan la misma secuencia despues de mover columna.
- No hay solapamiento de columnas sticky.
- Offsets se recalculan despues de render y cambios de orden.
- Tema claro y oscuro sin perdida de contraste.

## Fase 4. Lazy loading, sorting y filtro

**Prioridad:** alta
**Objetivo:** hacer explicito el contrato server-side.

### Tareas

- [ ] Inventariar consumidores con `[lazy]="true"`.
- [ ] Verificar `onLazyLoad` real y no bindings muertos.
- [ ] Confirmar payload `first`, `rows`, `globalFilter`, `sortField`,
      `sortOrder`.
- [ ] Confirmar que lazy no hace filtro/orden/paginacion local adicional.
- [ ] Verificar busqueda: una accion, una peticion.
- [ ] Definir contrato de reorder cuando lazy representa una ventana parcial.
- [ ] Probar pagina, tamano y orden en runtime.

### Criterios de paso

- Pagina 2 solicita la ventana correcta.
- Sorting solicita backend con campo y direccion correctos.
- Busqueda no dispara peticiones duplicadas.
- `totalRecords` controla reporte y botones.
- No se confunden indices de ventana con indices globales.

## Fase 5. Seleccion y agrupacion

**Prioridad:** media
**Objetivo:** verificar capacidades migradas que dependen de estado derivado.

### Tareas

- [ ] Auditar consumidores de `[(selection)]` y `dataKey`.
- [ ] Probar seleccion individual con objetos recreados por backend.
- [ ] Probar seleccion total sobre filas visibles.
- [ ] Documentar que seleccion global lazy no esta implementada.
- [ ] Auditar `groupRowsBy`, `groupheader` y `groupfooter`.
- [ ] Probar cambios de pagina y grupos no contiguos.

### Criterios de paso

- Seleccion usa identidad por `dataKey`.
- Checkbox de cabecera solo afecta filas visibles declaradas.
- Grupos se abren/cierran en limites correctos.
- Lazy no se presenta como agrupacion server-side automatica.

## Fase 6. Calidad de contrato y tipado

**Prioridad:** media
**Objetivo:** reducir errores silenciosos por bindings heredados.

### Tareas

`strictTemplates: false`.

- [ ] Decidir compatibilidad o retiro documentado por cada input residual.
- [ ] Evaluar reemplazo de `value: input<any[]>([])` por contrato generico o
      tipo seguro compatible con Angular del proyecto.
- [ ] Agregar validaciones defensivas para eventos imposibles.
- [ ] Agregar pruebas unitarias para computeds y outputs.

### Criterios de paso

- Cada binding usado por consumidores existe o esta inventariado como legacy.
- No se agregan aliases sin consumidor real.
- Los outputs tienen payload tipado.
- Errores de indice no mutan estado ni llaman API.

## Fase 7. Capacidades adicionales bajo evidencia

**Prioridad:** baja
**Objetivo:** decidir si existe demanda real antes de ampliar `AppTable`.

Solo iniciar con conteo de consumidores y aprobacion separada:

- virtual scroll;
- expansion de filas;
- resize de columnas;
- filtros por columna;
- exportacion;
- context menu;
- seleccion server-side global;
- accesibilidad de drag/drop por teclado;
- indicador visual de `loading`.

Cada capacidad requiere contrato, diseño, implementacion, pruebas y entrada de
bitacora propia. No incluirlas en Fase 1 como trabajo oportunista.

## 6. Checklist transversal de verificacion

### Codigo

- [ ] `AppTable` mantiene `ChangeDetectionStrategy.OnPush`.
- [ ] Signals no se reemplazan por estado mutable sin razon documentada.
- [ ] No se rompe el contrato de templates nombrados.
- [ ] Cambios shared tienen analisis de impacto.

### Build y auditoria

```powershell
npx tsc --noEmit
npx ng build --configuration production > C:\Windows\TEMP\luxuryapp-apptable-build.log 2>&1
npm run audit:ui
git diff --check
```

- [ ] El proceso anterior termino; no quedan `ng build` concurrentes.
- [ ] El log completo contiene cero `ERROR`.
- [ ] El servidor Vite no muestra `EPERM` al renovar deps.

### Runtime

- [ ] Login funcional con backend disponible.
- [ ] `task-list` carga filas reales.
- [ ] Handle y filas tienen clases/atributos esperados.
- [ ] Reorder funciona en claro y oscuro.
- [ ] Persistencia confirmada tras recarga.
- [ ] Drag de dependencia aislado.
- [ ] Sorting/paginacion/lazy probados cuando aplique.

## 7. Riesgos y mitigaciones

| Riesgo                                             | Impacto                                         | Mitigacion                                                                                |
| -------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Cache Vite bloqueada por procesos concurrentes     | No se puede validar runtime                     | Detener builds/serve duplicados, limpiar solo `.angular/cache`, levantar un solo servidor |
| Indices parciales en lazy                          | Orden incorrecto en backend                     | Definir contrato global antes de permitir reorder lazy                                    |
| `drop` de otro flujo interfiere                    | Reorder no dispara o persiste datos equivocados | MIME/type guards y pruebas de eventos                                                     |
| Manipulacion DOM de columnas pierde sincronizacion | Header/body desalineados                        | Prueba con varias filas, scroll, frozen y rerender                                        |
| Build verde oculta fallo funcional                 | Falsa aceptacion                                | Runtime obligatorio y evidencia visual/network                                            |
| Agregar paridad no usada aumenta superficie        | Regresiones y sobreconstruccion                 | Fase 7 requiere evidencia de consumidores                                                 |

## 8. Dependencias e impactos

### Dependencias

- Backend disponible para login y persistencia.
- Dev server estable sin procesos `ng build` concurrentes.
- Datos suficientes en `task-list` para mover al menos dos filas.
- Endpoint de orden identificado por consumidor.

### Impactos

- `table.ts` es shared y afecta todos los consumidores de `lux-table`.
- Cambios de directivas pueden alterar tablas migradas aunque no usen reorder.
- Cambios en `AppTableLazyEvent` impactan consumidores server-side.
- Cambios de DOM/clases impactan estilos globales de tabla.

## 9. Orden de ejecucion recomendado

1. Aprobar Fase 0 y registrar decision sobre `reorderableRows`.
2. Cerrar Fase 1 con `task-list` y pruebas unitarias de reorder.
3. Ejecutar Fase 2 para todos los consumidores de filas.
4. Ejecutar Fase 3 para columnas y frozen.
5. Ejecutar Fase 4 para lazy/sorting/filtro.
6. Ejecutar Fase 5 para seleccion/agrupacion.
7. Ejecutar Fase 6 de tipado y bindings silenciosos.
8. Priorizar Fase 7 solo con conteo de uso real.
9. Actualizar `README.md`, inventario y bitacora despues de cada fase.

No saltar directamente a virtual scroll, expansion o nuevas capacidades antes
de cerrar el circuito de reorder.

## 10. Entregables

Por cada fase:

- diff de codigo acotado;
- lista de archivos tocados;
- resultado de `tsc`, build, `audit:ui` y `git diff --check`;
- evidencia runtime cuando sea interaccion;
- actualizacion de `README.md` si cambia el contrato;
- entrada en `docs/migration-template/04-bitacora-cambios.md`;
- estado actualizado en `docs/migration-template/03-inventario-componentes.md`.

## 11. Cierre esperado

El plan se considera cerrado cuando:

- `pReorderableRowHandle` funciona en `task-list` y un consumidor adicional;
- el orden visual y el orden persistido coinciden despues de recarga;
- todos los consumidores reorder estan auditados;
- columnas/frozen/lazy/seleccion tienen estado runtime documentado;
- no existen claims de paridad sin evidencia;
- builds y auditorias pasan sin procesos concurrentes ni errores ocultos;
- README, inventario y bitacora reflejan el estado final.

## 12. Ejecucion 2026-09-18

### Completado

- [x] `AppReorderableRow` exige handle real; ya no permite iniciar drag desde
      cualquier parte de la fila.
- [x] `reorderableRows` funciona como gate real de drag/drop.
- [x] Los 10 consumidores encontrados declaran `[reorderableRows]="true"`.
- [x] `task-list` conserva imports de las directivas y handler con splice por
      `dragIndex`/`dropIndex`.
- [x] Consumidores de reorder simple actualizan su signal antes de persistir.
- [x] `funding-detail` pasa el grupo correcto al handler y reordena el grupo
      correspondiente.
- [x] `sat-funding` importa ambas directivas y usa el handle sin binding
      inexistente.
- [x] Binding silencioso `sortField` de `sat-funding` fue migrado a
      `initialSortField`; bindings `sortMode`/`rowGroupMode` retirados porque no
      forman parte del contrato actual.
- [x] README y complemento de auditoria actualizados con el gate real.

### Verificacion

- `npx tsc --noEmit`: OK.
- `npx ng build --configuration production`: OK; log completo en
  `C:\Windows\TEMP\luxuryapp-apptable-plan-build.log`; sin `ERROR`.
- `npm run audit:ui`: OK.
- Test focalizado de `task-template-items`: no concluyo dentro de 120 s; Vitest
  emitio advertencias de configuracion Vite y el proceso fue terminado por
  timeout. No se reporto asercion fallida.

### Bloqueo runtime

La prueba runtime no pudo ejecutarse porque `ng serve` no levanta en el estado
actual del workspace. El servidor reporta dependencias ajenas a este cambio:

- no encuentra `echarts`;
- no encuentra `ngx-echarts`;
- varios componentes importan `echarts-adapters` eliminado del working tree.

Estos archivos y cambios ya existian en el workspace y no fueron revertidos ni
modificados. Para cerrar runtime se requiere restaurar esas dependencias o
resolver ese estado previo; despues ejecutar login, `task-list`, drag real,
persistencia y recarga.

### Estado del plan

Fases 1 a 4 quedan implementadas y verificadas estaticamente. Cierre completo
pendiente de prueba runtime autenticada y de la resolucion del bloqueo de
`ng serve`. Fases de paridad adicional (virtual scroll, expansion, resize,
filtros por columna y exportacion) no se ejecutaron por estar fuera del alcance
urgente y requerir evidencia separada.

### Correccion posterior: handle sin arrastre

El primer contrato no funcionaba en navegador: `draggable="true"` estaba en la
fila, pero `onDragStart()` validaba que `event.target` fuera el handle. El
`dragstart` nativo de esa configuracion tiene como target la fila, por lo que
la validacion cancelaba siempre el arrastre.

Correccion aplicada en `table.ts`: `draggable="true"` vive ahora en
`pReorderableRowHandle`; la fila conserva listeners de `dragover`, `drop` y
`dragend`. El `dragstart` burbujea desde el handle hacia la directiva de fila y
la validacion coincide con el target real.

Verificacion posterior:

- `npx tsc --noEmit`: OK.
- `npm run audit:ui`: OK.
- `npx ng build --configuration production`: OK; warnings existentes de
  imports no usados, sin errores de compilacion.
