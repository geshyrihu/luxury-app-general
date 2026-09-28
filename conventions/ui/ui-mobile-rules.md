# UI Mobile Rules

**Última revisión:** 2026-08-06 (consolidado de DESIGN_CONVENTIONS.md viejo)

## Regla de Oro del Contexto

**Mobile / Tablet (Ionic):**
- Optimizado para **consumo, acciones rápidas y touch**
- Favorece: scroll vertical, bottom sheets, layouts espaciosos
- **Criterio:** No forzar paridad visual exacta con desktop; respetar la naturaleza de cada stack

---

## Reglas Base

- Mobile tiene reglas propias y **NO debe forzar paridad visual exacta con desktop**.
- Debe respetar patrones táctiles, listas, acciones y layouts móviles oficiales.
- Si falta un patrón móvil, primero se propone y se espera aprobación.
- La auditoría de módulo debe revisar también cumplimiento móvil cuando aplique.

## Selectores y capas relevantes

- mobile
  - `ili-*`
- acciones solo icono
  - `ii-*`
- adaptativos preferidos
  - `lx-*` cuando exista equivalente

## Reglas de uso mobile

- Mobile prioriza **claridad, touch, gestos y lectura vertical**.
- Acciones y controles deben respetar patrones táctiles oficiales y no intentar replicar exacto desktop.
- Dentro de contenedores móviles oficiales deben usarse variantes `ili-*` y patrones de acción móviles.

### Matriz de Componentes por Necesidad

| Necesidad | Mobile (Ionic) | Desktop | Criticidad |
|---|---|---|---|
| Listados simples | `ion-list` | `p-table` | **ALTA** |
| Tablas complejas | cards/lista simplificada | `p-table + filtros` | **ALTA** |
| Botón primario | `ion-fab` / botón principal | `p-button filled` | **ALTA** |
| Menú de acciones | `ion-action-sheet` / `ion-item-sliding` | `p-menu` | **ALTA** |
| Modal/Dialog | `ion-modal bottom-sheet` | `p-dialog` | **ALTA** |
| Inputs de texto | wrappers/custom inputs | wrappers/custom inputs | **ALTA** |
| Selects | select adaptado | dropdown/select adaptado | **ALTA** |
| Loading | skeleton/loading | skeleton/block UI | **MEDIA** |
| Cards | `ion-card` o adaptativo | wrapper visual | **MEDIA** |
| Paginación | variante mobile/adaptativa | `p-paginator` | **ALTA** |

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
- ✅ Respetar **tamaño mínimo touch** (48x48 px para mobile)

---

## Riesgos Históricos Preservados

### 1. Frankenstein visual
- ❌ Intentar que PrimeNG e Ionic se vean iguales rompe la naturalidad del stack

### 2. Detección pobre de dispositivo
- ❌ No decidir solo por breakpoints; considerar patrón y plataforma

### 3. Mezcla de interacciones
- ❌ No modelar desktop y mobile como si dispararan exactamente los mismos gestos

### 4. Ilusión de "código una sola vez"
- ❌ No mezclar PrimeNG e Ionic en el mismo template como regla general

### 5. Sobre-densificación
- ❌ No intentar replicar layouts compactos de desktop en mobile (peor experiencia táctil)

### 6. Ignorar patrones móviles
- ❌ No usar componentes móviles fuera del patrón oficial solo porque "se ven parecidos"

---

## Verificaciones de Auditoría Obligatorias

Cuando se audita un módulo móvil, verificar:

- [ ] No se mezclen componentes web y mobile en el mismo bloque sin patrón aprobado
- [ ] Botones icon-only tengan `aria-label`
- [ ] El caso de uso empiece por `lx-*` si existe variante adaptativa
- [ ] No se esté forzando paridad visual exacta entre stacks
- [ ] Se respeten patrones táctiles oficiales (bottom sheets, action sheets, item-sliding)
- [ ] Layouts sean verticales y espaciosos (no tablas densas)
- [ ] Se respeten contrastes de accesibilidad (AA mínimo)
- [ ] Se respete tamaño mínimo de targets interactivos (48x48 px)
- [ ] No haya densidad excesiva de información (scroll, no compresión)

---

## Antipatrones

- ❌ Forzar tablas densas o interacciones desktop en mobile cuando ya existe patrón mobile aprobado.
- ❌ Usar componentes móviles fuera del patrón oficial solo porque "se ven parecidos".
- ❌ Intentar forzar densidad de datos igual a desktop.
- ❌ Mezclar criterios desktop dentro de una vista mobile sin seguir el patrón adaptativo aprobado.
- ❌ No respetar gestos móviles (swipe, long-press, bottom-sheet behaviors).

---

## Documentos relacionados

- [ui-desktop-rules.md](./ui-desktop-rules.md)
- [guia-patron-b.md](../../appsweb/angular/src/app/shared/ui/guia-patron-b.md)
- [ui-usage-catalog.md](../ui-usage-catalog.md)
- [DESIGN_CONVENTIONS.md](../../DESIGN_CONVENTIONS.md) — histórico (consolidado aquí, eliminado 2026-08-06)


