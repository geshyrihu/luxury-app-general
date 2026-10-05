
## 📌 Resumen Ejecutivo


A continuación el reporte puntual para el agente de código.

---

## 🐞 Defectos / Bugs Detectados en la Implementación Actual

| #   | Problema                                                                     | Gravedad   | Detalle                                                                                                                                                                                                                                                                                      |
| --- | ---------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2   | **`mode` de `filterGlobal` es ignorado**                                     | 🟠 Alto    | El parámetro `mode` ("contains", "startsWith", etc.) se recibe pero no cambia la estrategia. Siempre usa `includes`. Debe implementarse al menos `startsWith` y `equals`.                                                                                                                    |
| 3   | **`onLazyLoad` no se emite en el init**                                      | 🟠 Alto    | Si el README dice _"no se emite por cambios de inputs, para evitar loops"_, hay que garantizar que sí se emite **una vez** en `afterNextRender`/`afterViewInit` con los valores iniciales (`initialSortField`, `rows`, etc.), si no el consumidor lazy nunca carga la primera página.        |
| 5   | **`selection` como `model<unknown[]>` pierde tipado**                        | 🟡 Medio   | Debería ser genérico `model<T[]>` para aprovechar TypeScript.                                                                                                                                                                                                                                |
| 6   | **Frozen column `right` no documentado con cálculo de `right` offset**       | 🟡 Medio   | El `afterRenderEffect` calcula `left` acumulativo, pero no se describe el cálculo simétrico para `alignFrozen="right"` (debe acumular desde el final usando `right`).                                                                                                                        |
| 7   | **`groupRowsBy` solo detecta cambios entre filas contiguas**                 | 🟢 Bajo    | Correcto como diseño, pero debe exigir que el consumidor ordene los datos por el campo de agrupación antes de pasarlos. Documentar.                                                                                                                                                          |

---


### ✅ Implementado (parcial o total)

- Sorting single (client/server)
- Paginación (client/server)
- Lazy loading
- Frozen columns (left)
- Reorder rows / columns
- Row grouping (visual)
- Selection con `dataKey`
- Templates: caption, header, body, footer, emptymessage, groupheader, groupfooter, paginatorleft
- Filtro global (solo client)
- Scrollable básico

### ❌ Faltantes Críticos (P0 — deben implementarse para paridad mínima)

| --------------------------------------------------------------------------- | ------------------ | ------------------------------------------------- |
| **Filtros por columna** (`p-columnFilter`)                                  | ❌ No existe       | Muy alto. Es el feature más usado tras el global. |
| **Match modes** (startsWith, endsWith, equals, in, between, lt/gt, dateIs…) | ❌ Solo `contains` | Alto. Rompe búsqueda precisa.                     |
| **Filtro lazy server-side** (emisión de `onLazyLoad` con filtro)            | ❌ Roto            | Crítico. Ver bug #1.                              |
| **Row expansion** (`rowExpansionTemplate`)                                  | ❌ No existe       | Alto. Detalle de fila sin navegar.                |
| **Edición inline** (`pEditableColumn`, `pCellEditor`)                       | ❌ No existe       | Alto. CRUD en tabla.                              |
| **Virtual scroll**                                                          | ❌ No existe       | Alto. Miles de filas en cliente.                  |
| **Sort múltiple** (`sortMode="multiple"`)                                   | ❌ No existe       | Medio.                                            |
| **Sort removible** (`removableSort`)                                        | ❌ No existe       | Medio.                                            |
| **Custom sort/filter functions** (`sortFunction`, `filterFunction`)         | ❌ No existe       | Alto. Casos edge.                                 |
| **Persistencia de estado** (`stateKey`, `stateStorage`)                     | ❌ No existe       | Alto. UX de tablas.                               |
| **Export CSV**                                                              | ❌ No existe       | Medio.                                            |

### ⚠️ Faltantes Importantes (P1)

- **Row style class/map** (`rowStyleClass`, `rowStyleMap`) — estilizado condicional por fila.
- **TrackBy** — rendimiento en listas grandes.
- **Paginator right template** (`#paginatorright`).
- **Summary template** (`#summary`).
- **Frozen rows** (filas congeladas arriba/abajo).
- **Column resize** (`resizableColumns`).
- **Context menu** (clic derecho en filas).
- **Selection server-side** (selección que persiste entre páginas).
- **Keyboard navigation** (flechas, Enter, Space en celdas).
- **ARIA completo** (roles, `aria-sort`, `aria-selected`, `aria-colindex`).
- **Responsive** (`reflow` mode).
- **Loading template** personalizado (actualmente solo estado visual genérico).
- **Subheader group expandible** (colapsar grupos).

### 🟢 Faltantes Menores (P2)

- Radio selection (single).
- Selection all (páginas completas en server-side).
- Filter constraints (AND/OR entre filtros).
- Filter display (menu vs row).
- Frozen columns expansion.
- Reorder indicator (iconos visuales durante drag).
- Tooltip en cabeceras.

---

## 🎯 Priorización de Trabajo para el Agente

### 🔴 Sprint 1 — Estabilizar lo existente (bugs)

1. Corregir `filterGlobal` en modo lazy → debe emitir `onLazyLoad`.
2. Implementar match modes reales en `filterGlobal` (`contains`, `startsWith`, `equals`).
3. Garantizar emisión inicial de `onLazyLoad`.
4. Tipar `selection` como `model<T[]>`.
5. Validar frozen column `right` con offset correcto.

### 🟠 Sprint 2 — Features de paridad mínima

6. **Filtros por columna** con directiva `[appColumnFilter]` + match modes.
7. **Row expansion** con template `#rowexpansion`.
8. **Sort múltiple** (`sortMode="single" | "multiple"`).
9. **Custom sort/filter functions** (inputs `sortFunction`, `filterFunction`).
10. **Row style class** (`rowStyleClass` input function).

### 🟡 Sprint 3 — Features avanzados

11. **Edición inline** (directivas `appEditableColumn`, `appCellEditor`).
12. **Virtual scroll** (reescritura del render de filas con CDK virtual o nativo).
13. **Persistencia de estado** (`stateKey`, `stateStorage="session"|"local"`).
14. **Export CSV**.
15. **Keyboard navigation** + ARIA completo.

---

## 📋 Información Adicional que Necesito Pedir al Agente

Para refinar este análisis, necesito que el agente me confirme/envíe:

1. **Código fuente de `table.ts`** completo (el README describe la API, pero no veo implementación real de `sortedValue`, `filteredValue`, `pagedValue` ni los `afterRenderEffect`).
2. **Lista de componentes/directivas que ya existen** en el workspace (¿hay `app-column-filter`, `app-editable-column`, etc. en otros archivos?).
4. **¿Hay un `AppPaginator` separado** o está embebido en `AppTable`?
5. **Estrategia de testing**: ¿hay tests unitarios de `AppTable`? ¿qué cobertura?
6. **¿Se usa `@angular/cdk`** en el proyecto? (relevante para virtual scroll y drag&drop robusto).
7. **Versión exacta de Angular** (el README menciona signals modernos, asumo 18+, pero confirmar).

---

## 🧭 Recomendación Final al Agente

>
> 1. **Primero corrige los 5 bugs críticos** (especialmente el filtro lazy roto).
> 2. **Luego implementa solo los features que tus templates legacy realmente usan** (revisando el codebase).
> 3. **Documenta en el README cada feature con su estado** (`✅`, `🚧`, `❌`) para que el equipo sepa qué esperar.
> 4. **Añade tests de integración** para `filterGlobal` en modo lazy y `onLazyLoad` inicial — son los bugs más silenciosos.

Quedo atento a la información adicional para profundizar el análisis.
