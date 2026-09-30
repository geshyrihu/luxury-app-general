
📅 Creado: 2026-09-15
**antes** de arrancar Fase 4 (Modales) + Fase 6 (Tabla) — el último bloque
del plan — para confirmar que no queda ningún hallazgo suelto que los
bloquee. Se generaron dos reportes automáticos en la raíz de
`appsweb/angular/`:


**Este documento es solo análisis — no se tocó ningún archivo de código.**
El plan de ejecución real de Tabla/Modales sigue siendo
[05-tablas-y-modales.md](./05-tablas-y-modales.md); este documento solo
confirma que nada de PrimeFlex/PrimeIcons lo bloquea, y corrige el
alcance de la Fase 6.5 (Track Flex) del plan general con números
reverificados uno por uno contra el código real.

---

## 0. Veredicto

**No hay ningún hallazgo que bloquee el inicio de Fase 4 o Fase 6.** Los
ecosistemas de Tabla y Modal ya analizados en `05-tablas-y-modales.md`
se confirman vigentes y sin cambios de alcance.

Sí se encontró un problema serio de metodología en los dos reportes
nuevos **y** en la auditoría previa de PrimeFlex
(`../../docs/SharedLuxuryApp/DesignSystem/20260812-auditoria-shared-primeflex-migracion.md` + `-addendum.md`, 2026-09-13/14):
todos cuentan coincidencias de subcadena sin límite de palabra, así que
etiquetan como "PrimeFlex pendiente" clases que **ya son Bootstrap
válido** (`flex-column` contiene la subcadena `flex`; `table-col-20`
contiene `col-20`; etc.). Esto infló el tamaño estimado de la Fase 6.5
en un orden de magnitud (~650 archivos / ~15,000 ocurrencias reportadas
vs. ~320-390 archivos / unos pocos miles de ocurrencias reales,
verificado abajo).

---

## 1. Metodología de esta verificación

Cada categoría de los tres documentos previos (los dos reportes de
09-14/09-15 y `primeflex-migration-audit.md`) se re-contó con:

1. `grep` con límite de palabra exacto sobre el atributo `class="..."`
   (no subcadena — `\bflex\b` dentro de un token de clase, no dentro de
   `flex-column`).
2. Cruce contra el CSS **compilado real** de
   `node_modules/bootstrap/dist/css/bootstrap.css` para confirmar si
   Bootstrap 5.3.8 define o no esa clase exacta (en vez de asumir por
   nombre).
3. Para los hits sospechosos de ser casos aislados, lectura directa del
   archivo para descartar falsos positivos (p. ej. archivos `.bak.html`
   que Angular no compila).

Comandos usados (reproducibles):

```bash
# patrón genérico usado para cada categoría, reemplazando <clase>
grep -rlP 'class="([^"]*\s)?<clase>(\s[^"]*)?"' src/app --include="*.html" | wc -l

# confirmar si Bootstrap define la clase exacta
grep -n "^\.<clase> {" node_modules/bootstrap/dist/css/bootstrap.css
```

---

## 2. Tabla comparativa: reportado vs. verificado

| Categoría | Reportado previamente | Verificado (2026-09-15) | Veredicto |
|---|---|---|---|
| `flex` (aislada) | ~4,000+ oc. / 627 archivos | **0 archivos** | ❌ Falso positivo — todo ya es `d-flex`/`flex-column`/`flex-wrap`/`flex-fill`/`flex-shrink-0` (Bootstrap válido) |
| `col-N` "grid PrimeFlex" (col-13..col-90) | ~2,500+ oc. / 397 archivos | **0 archivos reales** | ❌ Falso positivo — los 92 matches eran la subcadena `col-20`/`col-35`/etc. dentro de `table-col-20`/`table-col-35`, una clase propia del proyecto para anchos de columna de tabla, sin relación con PrimeFlex |
| `hidden` / `block` / `grid` (aisladas) | ~15-50 oc. | **0 archivos cada una** | ❌ Falso positivo — ya son `d-none` / `d-block` / `row` |
| `uppercase` / `lowercase` | ~150+ oc. | **0 archivos** | ❌ Falso positivo — ya son `text-uppercase` / `text-lowercase` |
| `border-round` / `border-circle` / `border-none` | ~200+ oc. | **0 archivos cada una** | ❌ Falso positivo — ya son `rounded` / `rounded-circle` / `border-0` |
| `mr-N` / `ml-N` | ~2,000+ oc. | **0 archivos** | ❌ Falso positivo — ya son `me-N` / `ms-N` |
| `col-offset-N`, `flex-order-N`, `pr-N`/`pl-N`, `white-space-nowrap`, `text-overflow-ellipsis`, `flex-column-reverse` | Documentadas como pendientes | **0 archivos cada una** | ❌ Falso positivo / ya migradas |
| `text-color` / `text-color-secondary` | ~167 oc., marcado "crítico, riesgo de texto invisible" | **1 archivo**: `cobranza-online-resumen.bak.html` | ❌ Falso positivo real — ese archivo es un `.bak.html`, ningún componente lo referencia por `templateUrl`, Angular no lo compila. Impacto real: 0 |
| `surface-ground` / `-card` / `-section` / `-border` / `-overlay` | ~250 oc., marcado "crítico" | **0, 0, 0, 1(el mismo .bak), 0** | ❌ Falso positivo real — mismo archivo muerto |
| `border-1` / `border-2` / `border-3` | Reportado como "requiere clase `border` base" | Confirmado en `bootstrap.css`: **`.border-1`/`.border-2`/`.border-3` SÍ existen nativamente** en Bootstrap 5.3.8 | ❌ No es un problema — ya es sintaxis Bootstrap válida tal cual, no tocar |
| **`md:col-6`, `lg:col-4`, `xl:col-12`, `sm:...` (sintaxis responsiva con `:` de PrimeFlex v4)** | No aislada en ningún reporte previo | **63 archivos confirmados** | 🆕 **Real** — Bootstrap no reconoce esta sintaxis (usa `col-md-6`); PrimeFlex tampoco está cargado; el comportamiento responsivo de esos 63 archivos no se aplica, sin error visible |
| `border-{top,bottom,start,end}-N` (ancho de borde por lado) | No distinguida de `border-N` | **133 archivos** | 🆕 **Real** — Bootstrap solo define `.border-{lado}-0` (quitar borde), no `.border-{lado}-{1,2,3}`; sin efecto, o efecto colateral si coexiste con `.border` (aplica borde en los 4 lados en vez de solo uno) |
| `w-full` / `h-full` | Mencionadas sin cuantificar | **176 / 104 archivos** | 🆕 **Real** — Bootstrap usa `.w-100`/`.h-100`, no `.w-full`/`.h-full`; sin efecto actual |
| `absolute` / `relative` / `fixed` / `sticky` (aisladas) | No mencionadas | **13 / 30 / 2 / 5 archivos** | 🆕 **Real** — Bootstrap usa `.position-absolute` etc., no la palabra sola; sin efecto actual |
| `line-height-N` | No mencionada | **87 archivos** | 🆕 **Real** — Bootstrap usa `.lh-1`/`.lh-sm`/`.lh-base`/`.lh-lg`, no `line-height-N`; sin efecto actual |
| `font-bold` / `font-semibold` / `font-medium` (aisladas) | ~1,200+ oc. | **1 archivo cada una** | ⚠️ Exagerado ~1000x, pero sí quedan 1-3 casos reales sueltos — ya migrado casi al 100% a `fw-*` |
| `min-h-screen` / `w-screen` / `cursor-move` / `fadein` / `shadow-N` (aislada) | Mencionadas sueltas, sin conteo | **13 / 2 / 6 / 14 / 11 archivos** | 🆕 Reales, volumen bajo |
| `max-w-*` | Mencionada | **31 archivos** | 🆕 Real — Bootstrap usa `.mw-100` (escala distinta, no `max-w-*`) |
| `min-w-0` | Marcada "compatible" en el audit original | **69 archivos** — **re-verificado ahora: Bootstrap NO define `.min-w-0`** | ⚠️ **Corrección al audit original**: no es compatible, es otro caso muerto. Necesita una utilidad propia (`.mw-0` no es estándar tampoco) o revisión visual caso por caso antes de decidir el reemplazo |

---

## 3. Alcance real corregido de la Fase 6.5 (Track Flex)

**Total de archivos únicos con al menos una categoría real confirmada
(excluyendo `min-w-0`, que se trata aparte): 320 archivos.** Sumando
`min-w-0` el techo sube a un rango de **~320-390 archivos** (con
solapamiento entre categorías dentro del mismo archivo).

Esto reemplaza la estimación de `primeflex-migration-audit.md`
("~650 archivos, ~15,000+ ocurrencias") — el número real verificado es
**la mitad o menos**, y cada categoría es un renombre mecánico 1:1
(`sed` dirigido por categoría), sin lógica condicional compleja excepto
los pocos `[ngClass]` dinámicos ya listados en el audit original
(sección "Patrones ngClass Dinámicos") que sí requieren revisión manual.

**Mapa de reemplazo para las categorías reales (todas mecánicas):**

| Clase muerta | Reemplazo Bootstrap | Archivos |
|---|---|---|
| `md:col-N`, `lg:col-N`, `xl:col-N`, `sm:col-N` | `col-md-N`, `col-lg-N`, `col-xl-N`, `col-sm-N` | 63 |
| `md:flex-*`, `lg:align-items-*`, etc. (mismo patrón `:`) | mover el breakpoint al medio: `flex-md-*`, `align-items-lg-*` | (incluidos en los 63) |
| `border-top-N` / `border-bottom-N` / `border-start-N` / `border-end-N` | revisar intención real: probablemente `border-top` (sin número, ya que Bootstrap no gradúa el ancho por lado) + quitar el `border` genérico si estaba puesto solo para compensar | 133 |
| `w-full` | `w-100` | 176 |
| `h-full` | `h-100` | 104 |
| `absolute` / `relative` / `fixed` / `sticky` | `position-absolute` / `position-relative` / `position-fixed` / `position-sticky` | 13/30/2/5 |
| `line-height-1/2/3` | mapear a `lh-1`/`lh-sm`/`lh-base`/`lh-lg` según el valor visual real (no es un mapeo 1:1 de número, requiere revisar qué línea-altura se buscaba) | 87 |
| `max-w-*` | `mw-100` si es 100%, o custom CSS var si es un valor intermedio | 31 |
| `font-bold`/`font-semibold`/`font-medium` (aisladas) | `fw-bold`/`fw-semibold`/`fw-medium` | 1 cada una |
| `min-h-screen` | `min-vh-100` | 13 |
| `w-screen` | `w-100` (⚠️ nunca `vw-100`, ya causó scroll horizontal en Windows — ver `04-bitacora-cambios.md`) | 2 |
| `cursor-move` | custom CSS (`cursor: move`) o Bootstrap no tiene equivalente — verificar si el drag real sigue existiendo | 6 |
| `fadein` | `.fade` + lógica JS de Bootstrap, o quitar si no se usa realmente | 14 |
| `shadow-N` (aislada, sin guion) | `shadow-sm`/`shadow`/`shadow-lg` (escala reducida de Bootstrap) | 11 |
| `min-w-0` | sin equivalente Bootstrap directo — definir `.mw-0-custom { min-width: 0 }` o revisar si es necesaria (frecuente para evitar overflow de flex-items, puede que ya no haga falta con el layout actual) | 69 |

**No se listan aquí** `flex`, `hidden`, `block`, `grid`, `uppercase`,
`lowercase`, `border-round`, `border-circle`, `border-none`, `mr-N`,
`ml-N`, `col-N` no estándar, `text-color`, `surface-*`, `border-N` (sin
lado) — todas ya migradas o nunca fueron un problema real. **No
ejecutar ningún reemplazo para estas categorías**, ya están en
Bootstrap correcto.

---

## 4. Confirmación de que Tabla y Modal no tienen hallazgos nuevos

Se reverificaron también los números centrales de
`05-tablas-y-modales.md` contra el código real del 2026-09-15 (HEAD
`05cb380d`), sin encontrar discrepancias:

| Métrica | `05-tablas-y-modales.md` | Reverificado 2026-09-15 |
|---|---:|---:|
| Archivos con `<p-table` | ~341 plantillas | 334 archivos / 399 aperturas de tag |
| Archivos con `pSortableColumn` | 178 | 178 |
| Archivos con `<p-dialog` directo | 2 | 2 (`header-employee-desktop.html`, `catalog-guia.html`) |
| Archivos con `<p-confirmdialog` | — | 1 (`app.html`) |
| Consumidores reales (no-spec) de `DialogService` | ~72 (con specs) | 6 reales de producción |
| Consumidores reales (no-spec) de `ConfirmationService` | 9 | 11 |

**No hay ítems nuevos que agregar a `05-tablas-y-modales.md` §A o §B.**
El diseño de `app-table` (§A.4) y la técnica de stub-vía-`Injector` para
`DialogHandlerService` (§B.3) siguen siendo el plan vigente.

PrimeIcons (`primeicons.css`, sigue cargado en `angular.json:87`) tiene
uso residual de 6-8 archivos con clase `pi`/`pi-spin` — no bloquea Fase
4/6, su retiro sigue programado para la Fase 7 según el plan general.

---

## 5. Recomendación de secuencia

1. **No es necesario resolver la Fase 6.5 corregida antes de Fase 4/6.**
   Ninguna de las clases muertas de la sección 3 aparece dentro de
   `<p-table>`/`<p-dialog>`/código de `DynamicDialog` — son utilidades de
   layout en el HTML circundante, independientes del componente que se
   está reemplazando.
2. Se puede ejecutar la Fase 6.5 corregida **en paralelo** con Fase 4/6
   (son archivos y categorías distintas, sin solapamiento de riesgo), o
   **inmediatamente antes** si se prefiere no tener dos frentes abiertos
   — a decisión del usuario, ya no es una dependencia técnica.
3. Actualizar `../../docs/SharedLuxuryApp/DesignSystem/20260812-auditoria-shared-primeflex-migracion.md` y su addendum
   para que no se usen sus números originales (~650 archivos/~15,000
   ocurrencias) como referencia de esfuerzo — usar la tabla de la
   sección 2 de este documento en su lugar.
4. Proceder con Fase 4 (Modales) y Fase 6 (Tabla) según
   `05-tablas-y-modales.md`, sin cambios de alcance.

---

## 6. Nota metodológica para futuras auditorías automáticas

`-15.md`, `primeflex-migration-audit.md`) fueron generados por
herramientas/agentes que hacen conteo de subcadena sin límite de
palabra sobre el atributo `class`. Esto es válido como **primera señal
direccional** (qué módulos tienen más densidad de clases legacy), pero
**no es confiable como número de esfuerzo** sin una segunda pasada con
límite de palabra + verificación contra el CSS real compilado, como se
hizo aquí. Cualquier reporte automático futuro debe pasar por este
mismo filtro antes de convertirse en una fila de plan con archivos
concretos a tocar.
