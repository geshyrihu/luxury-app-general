# UI Desktop Rules

**Última revisión:** 2026-08-06 (consolidado de DESIGN_CONVENTIONS.md viejo)

## Regla de Oro del Contexto

- Optimizado para **productividad y densidad de datos**
- Pensado para **mouse y teclado**
- Favorece: tablas, hover, edición inline, layouts compactos
- **Criterio:** No forzar paridad visual exacta con mobile; respetar la naturaleza de cada stack

---

## Regla base

La UI desktop debe consumirse desde:

- [shared/ui](../../appsweb/angular/src/app/shared/ui)

## Reglas

- Toda feature consume primero desde `shared/ui`.
- No crear componentes paralelos si ya existe equivalente oficial.
- Si falta algo, primero se propone y se espera aprobación.
- Las decisiones de componentes desktop deben alinearse con el catálogo de uso UI.

## Selectores y capas relevantes

- web/desktop
  - `app-*`
- acciones con label e icono
  - `il-button-*`
- acciones solo icono
  - `iw-button-*`
- adaptativos preferidos
  - `lx-*` cuando exista equivalente

## Reglas de uso desktop

- En desktop se privilegia productividad, densidad de datos, mouse y teclado.
- `p-table` y su ecosistema directo necesario para construir la tabla son la
- La excepción de `p-table` aplica solo a la tabla y sus piezas directas de
  comodidad.
- Cuando se use `p-table` directo, se deben seguir los helpers y patrones
  oficiales de tabla del proyecto para caption, empty message, footer,
  acciones, estilos y comportamiento general.
- Si el caso ya está cubierto por wrapper o componente adaptativo, no se debe bajar directamente a la librería subyacente por comodidad.

### Caption de tablas — tamaño `sm` obligatorio (2026-09-16)

Todo `<ng-template #caption>` de tabla debe contener el wrapper oficial
controles dentro del caption son tamaño `sm`**:

- **Botón de agregar:** `<il-button-add customClass="btn-sm" ... />` (o `size="sm"`
  en cualquier `*-button-*`; `BaseButton` mapea `sm`/`small` → `btn-sm`).
- **Input de búsqueda:** `<custom-search-input-signal>` → su variante web
  (`web-input-search`) usa `class="input input-sm"` (34px, token del DS).
- ❌ PROHIBIDO: inputs/botones con tamaño default (`md`) o `lg` dentro del
  caption — rompen la densidad de la tabla y desalinean la barra.


### Wrappers gigantes — Advertencia Crítica

- ❌ No convertir wrappers en cajones de sastre
- ❌ Si un wrapper exige demasiados `@Input`, debe revisarse su diseño
- **Recomendación:** Mantener wrappers enfocados en una responsabilidad clara

---

## Matriz de Componentes por Necesidad

| Necesidad | Web (Desktop) | Mobile | Criticidad |
|---|---|---|---|
| Listados simples | `p-table` | `ion-list` | **ALTA** |
| Tablas complejas | `p-table + filtros` | cards/lista simplificada | **ALTA** |
| Botón primario | `p-button filled` | `ion-fab` / botón principal | **ALTA** |
| Menú de acciones | `p-menu` | `ion-action-sheet` / `ion-item-sliding` | **ALTA** |
| Modal/Dialog | `p-dialog` | `ion-modal bottom-sheet` | **ALTA** |
| Inputs de texto | wrappers/custom inputs | wrappers/custom inputs | **ALTA** |
| Selects | dropdown/select adaptado | select adaptado | **ALTA** |
| Loading | skeleton/block UI | skeleton/loading | **MEDIA** |
| Cards | wrapper visual | `ion-card` o adaptativo | **MEDIA** |
| Paginación | `p-paginator` | variante mobile/adaptativa | **ALTA** |

**Criterio:** Validar decisión actual en [ui-usage-catalog.md](../ui-usage-catalog.md)

---

## Accesibilidad Obligatoria

- ✅ Botones icon-only SIEMPRE con `aria-label`
  ```html
  <!-- ✅ CORRECTO -->
  <button aria-label="Cerrar diálogo">
    <app-icon icon="mdi:close" />
  </button>
  
  <!-- ❌ INCORRECTO -->
  <button>
    <app-icon icon="mdi:close" />
  </button>
  ```

- ✅ Mantener **focus visible** en todos los elementos interactivos
- ✅ Respetar **contraste mínimo** (AA: 4.5:1 para texto, 3:1 para gráficos)
- ✅ Respetar **tamaño mínimo touch** (44x44 px para desktop, 48x48 px para mobile)

---

## Riesgos Históricos Preservados

### 1. Frankenstein visual

### 2. Sobre-abstracción del wrapper
- ❌ Demasiados `@Input` o demasiadas variantes reducen claridad y mantenibilidad

### 3. Detección pobre de dispositivo
- ❌ No decidir solo por breakpoints; considerar patrón y plataforma

### 4. Rendimiento
- ❌ Vigilar lazy loading, peso de bundle y uso responsable de librerías

### 5. Mezcla de interacciones
- ❌ No modelar desktop y mobile como si dispararan exactamente los mismos gestos

### 6. Ilusión de "código una sola vez"

---

## Verificaciones de Auditoría Obligatorias

Cuando se audita un módulo desktop, verificar:

- [ ] No se usen inputs raw si existe wrapper oficial
- [ ] No se mezclen componentes web y mobile en el mismo bloque sin patrón aprobado
- [ ] Botones icon-only tengan `aria-label`
- [ ] El caso de uso empiece por `lx-*` si existe variante adaptativa
- [ ] No se esté forzando paridad visual exacta entre stacks
- [ ] Wrappers NO sean "cajones de sastre" (máximo 3-4 @Input por concepto)
- [ ] Se respeten contrastes de accesibilidad (AA mínimo)
- [ ] Se respete tamaño mínimo de targets interactivos

---

## Antipatrones

- Importar o renderizar componentes visuales directos de librería en features cuando el catálogo ya cubre el caso.
- Usar la excepción de `p-table` como pretexto para meter otros componentes
- Mezclar criterios móviles dentro de una vista desktop sin seguir el patrón adaptativo aprobado.
- Forzar paridad visual exacta entre web y mobile.

---

## Documentos relacionados

- [arquitectura-shared-ui.md](../../appsweb/angular/src/app/shared/ui/arquitectura-shared-ui.md)
- [ui-usage-catalog.md](../ui-usage-catalog.md)
- [ui-mobile-rules.md](./ui-mobile-rules.md)
- [DESIGN_CONVENTIONS.md](../../DESIGN_CONVENTIONS.md) — histórico (consolidado aquí, eliminado 2026-08-06)


