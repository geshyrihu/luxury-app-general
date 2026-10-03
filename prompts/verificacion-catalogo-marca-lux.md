# Prompt de Verificación Profunda — Propuesta de Catálogo de Marca `lux-*`

## Rol y actitud esperada

Eres un auditor de código senior de Angular. Tu trabajo NO es confiar en conteos de
grep superficiales ni en suposiciones. Tu trabajo es **leer código real, archivo por
archivo donde haga falta**, y reportar evidencia verificable (ruta de archivo + número
de línea) para cada afirmación. Si algo no se puede confirmar con evidencia, dilo
explícitamente como "no verificado" — no lo redondees ni lo asumas.

No uses scripts de conteo automatizado como única fuente de verdad. Puedes usarlos
como punto de partida para encontrar candidatos, pero **cada hallazgo crítico debe
confirmarse leyendo el archivo fuente real** antes de entrar al reporte final.

## Contexto del proyecto

- Proyecto: LuxuryApp API — monorepo con backend .NET 10, frontend Angular 22
  (`appsweb/angular`), app móvil Flutter (`appsmobil/flutter`, NO es el foco de esta
  tarea).
- Ruta raíz de la librería de componentes a analizar:
  `appsweb/angular/src/app/shared/ui/`
- Alias de import configurado en `appsweb/angular/tsconfig.json`: `@ui/*` apunta a
  `src/app/shared/ui/*`.
- Arquitectura actual documentada en:
  `appsweb/angular/src/app/shared/ui/arquitectura-shared-ui.md` (LÉELO COMPLETO antes
  de empezar — es la fuente de verdad de cómo está hoy la separación web/mobile/adaptive).
- Regla de fronteras automatizada (lint): `appsweb/angular/scripts/audit-ui-boundaries.mjs`
  (LÉELO COMPLETO — define exactamente qué puede importar qué hoy).

## El problema a verificar (contexto de negocio)

Hay una propuesta de renombrar TODOS los selectores de componentes a un esquema de
marca único:

```
lux-<nombre>          → selector PÚBLICO (lo que usan forms/páginas/módulos de negocio)
lux-<nombre>-web       → selector INTERNO, implementación Bootstrap/native
lux-<nombre>-mobile    → selector INTERNO, implementación Ionic
```

La propuesta completa está en:
`docs/SharedLuxuryApp/DesignSystem/20261002-propuesta-catalogo-marca-componentes.md`
(LÉELA COMPLETA antes de empezar).

**La premisa crítica que hay que verificar con evidencia real** (cita textual de la
propuesta):

> "Nunca se escribe `lux-*-web` o `lux-*-mobile` en el HTML de un formulario, página o
> módulo de negocio. Eso sigue siendo responsabilidad exclusiva de `adaptive/`."

> "Componentes verdaderamente agnósticos (sin versión web/mobile separada, ej.
> `app-icon`, `kpi-card`) son directamente `lux-<nombre>` sin sufijo, viven en
> `primitives/`."

Si estas dos premisas son FALSAS en la práctica actual (es decir, si hoy SÍ hay
código de negocio que importa directamente de `web/` o `mobile/` sin pasar por
`adaptive/`), el rename a `-web`/`-mobile` como sufijo "interno" sería engañoso:
estaríamos marcando como "interno" algo que en realidad ya se consume públicamente,
y romperíamos esos consumidores con el rename.

## Qué tienes que verificar — 5 preguntas, cada una con evidencia obligatoria

### Pregunta 1 — ¿Hoy existen imports directos a `web/` o `mobile/` desde fuera de `shared/ui/`?

Busca en TODO `appsweb/angular/src/app/modules/**` y cualquier otro directorio de
features/páginas de negocio (todo lo que NO sea `shared/ui/` ni `shared/ui/adaptive/`)
imports de la forma:

```ts
from "@ui/web/..."
from "@ui/mobile/..."
from "...shared/ui/web/..."
from "...shared/ui/mobile/..."
```

Para CADA ocurrencia encontrada, reporta:
- Ruta de archivo + línea exacta
- Qué componente se importa (nombre de clase y selector)
- ¿Es un módulo de negocio real (una página/feature) o es otro componente interno de
  `shared/ui` (p. ej. el propio `adaptive/` importando `web/`, que SÍ está permitido)?

**Esto es lo más importante de todo el prompt.** Si encuentras aunque sea 1 import de
negocio real apuntando directo a `web/` o `mobile/`, es una violación activa de la
premisa, y hay que listarla con exactitud (no "aproximadamente X casos", sino la
lista completa).

### Pregunta 2 — ¿El lint de fronteras (`audit-ui-boundaries.mjs`) realmente impide esto HOY?

Lee el script completo y responde con evidencia de código (cita línea del script):
- ¿El script revisa imports DESDE módulos de negocio HACIA `web/`/`mobile/`? ¿O solo
  revisa imports ENTRE las propias capas de `shared/ui/` (mobile→web, web→mobile,
  base→Ionic)?
- Ejecuta tú mismo `npm run audit:ui` (o el comando equivalente que encuentres en
  `package.json`) en `appsweb/angular` y pega la salida real.
- Si el script NO cubre imports de negocio hacia `web/`/`mobile/`, dilo explícitamente:
  "el lint actual NO protege contra que un módulo de negocio importe directo de
  web/ o mobile/; solo protege las fronteras internas entre capas de shared/ui".

### Pregunta 3 — Barrels/index.ts: ¿exponen accidentalmente lo interno?

Encontré estos archivos `index.ts` dentro de `shared/ui/` (verifica que sigan
existiendo y lee su contenido completo):
- `buttons/index.ts`
- `buttons/base/index.ts`
- `buttons/mobile-icon/index.ts`
- `buttons/mobile-label/index.ts`
- `buttons/shared/index.ts`
- `buttons/web-icon/index.ts`
- `buttons/web-label/index.ts`
- `inputs/index.ts`
- `inputs/base/index.ts`
- `inputs/mobile/index.ts`
- `inputs/web/index.ts`

Para cada uno:
- ¿Qué exporta? (lista completa de exports)
- ¿Algún módulo de negocio (fuera de `shared/ui/`) importa desde estos barrels
  (`from "@ui/buttons"`, `from "@ui/inputs"`, etc.) en vez de importar el componente
  adaptativo específico? Si sí, lista los archivos consumidores con ruta+línea.
- Si un barrel exporta tanto el componente web interno como el adaptativo en el mismo
  archivo, es una fuga del encapsulamiento que rompería la premisa "web/mobile son
  internos". Dilo explícitamente si lo encuentras.

### Pregunta 4 — Componentes "agnósticos" (`shared/` → futura `primitives/`): ¿de verdad no tienen variante web/mobile?

Para los 18 componentes que hoy viven en `shared/ui/shared/` (atención: ruta real
desambiguada, NO confundir con el propio `shared/` de Angular):
`action-icons-group, activity-log, app-icon, approval-workflow, avatar-group,
breakdown-list, gauge, inventory-level, kpi-card, lead-scoring,
multiple-segmented-control, order-status, ranked-list, realtime-indicator,
segmented-control, stat-card, tour, tristate-switch`

Para cada uno, confirma leyendo el archivo .ts completo:
- ¿Importa `PlatformService` o tiene algún `@if`/`*ngIf` que ramifique por
  `isMobile()` dentro de su propio template? (si sí, NO es agnóstico puro, tiene
  lógica de plataforma embebida y la propuesta de "sin sufijo" sería incorrecta para
  ese caso específico — hay que marcarlo como excepción).
- ¿Existe algún componente equivalente con el mismo propósito en `web/` o `mobile/`
  con otro nombre? (ej. ¿hay un `web/kpi-card` separado del `shared/kpi-card`? Si
  existe duplicado, el componente de `shared/` no es realmente la única
  implementación, hay que decidir cuál se queda).

### Pregunta 5 — Radio de impacto real de los componentes de mayor uso

Para los 5 selectores de mayor uso detectados previamente (`app-icon`, `il-button`,
`iw-button`, `custom-input-text-signal`, `ili-button`), toma una MUESTRA REAL de 15
archivos consumidores de cada uno (no todos, una muestra representativa de distintos
módulos de negocio) y confirma leyendo cada archivo:
- ¿Importan el selector vía el import correcto (clase TS), o hay algún caso de
  import roto / alias duplicado / re-export intermedio que compliquen un rename
  automatizado?
- ¿Usan inputs/outputs que no están documentados en la propuesta (props dinámicas,
  `[attr.data-...]`, `ng-content` con selector CSS basado en el nombre de tag, etc.)
  que se romperían si cambia el selector del tag?

## Pregunta 6 — Riesgo de romper UI/UX en silencio (responsive, breakpoints, CSS por nombre de tag)

Este riesgo es el más peligroso de todos porque **no lo detecta `ng build` ni el lint**:
el código compila bien, pero el componente se ve roto en cierto tamaño de pantalla o
dispositivo, y nadie se entera hasta que un usuario lo reporta.

### 6.1 Cómo decide hoy la app si algo es "mobile" o "web"

Lee completo `appsweb/angular/src/app/core/services/platform.service.ts`. Confirma
con cita textual:
- El criterio real es: `Capacitor/Cordova nativo` **O** `window.innerWidth < 768`.
- Es un **signal reactivo a `resize`**, no una decisión fija al cargar la página. Un
  usuario en un navegador de escritorio que achica la ventana por debajo de 768px
  dispara el cambio de `isMobile` EN VIVO, sin recargar.
- También actualiza clases en `document.body` (`is-mobile` / `is-web`).

### 6.2 Buscar CSS que selecciona por nombre de tag/selector literal (no por clase)

Esto es crítico: si existe CSS (SCSS o inline) que apunta al selector del componente
directamente como nombre de elemento (ej. `iw-button app-icon { ... }` o
`ili-list-item { ... }`), un rename del selector del componente **rompe ese estilo en
silencio** — no hay error de compilación, el componente simplemente se ve sin el
estilo esperado.

Busca en TODO `appsweb/angular/src/styles/**/*.scss` y en cualquier bloque
`styles:`/`styleUrls:` embebido en componentes, patrones como:
```
<nombre-de-selector-actual> { ... }
<nombre-de-selector-actual> .algo { ... }
algo <nombre-de-selector-actual> { ... }
```
para los selectores actuales de los componentes de MAYOR uso (`app-icon`, `il-button`,
`iw-button`, `ili-button`, `custom-input-text-signal`, `lx-tag`, `lx-card`, y cualquier
otro que encuentres en el camino).

Para cada ocurrencia encontrada, reporta archivo + línea + la regla CSS completa, y
clasifícala:
- **Alto riesgo**: selector de tag usado directo como selector CSS raíz (ej.
  `iw-button { border: ... }`) — el rename rompe el estilo SIEMPRE, sin importar
  tamaño de pantalla.
- **Alto riesgo específico de breakpoint**: la regla está dentro de un `@media` con
  threshold cercano o igual a 768px (el breakpoint real de `PlatformService`), o
  dentro de un bloque condicionado por `.is-mobile`/`.is-web`. Esto es el caso más
  peligroso para UX: funciona bien en desktop grande, se rompe solo en viewport
  mediano/mobile o viceversa, fácil de no detectar en pruebas rápidas de escritorio.
- **Riesgo medio**: el selector de tag aparece como ancestro/descendiente de otra
  regla (ej. `.sidebar iw-button app-icon { ... }`) — rompe un sub-estilo, no todo el
  componente.

### 6.3 Buscar breakpoints adicionales inconsistentes

Busca TODOS los `@media` con `max-width`/`min-width` en `appsweb/angular/src/styles/**`
y en estilos embebidos de los componentes de `shared/ui/`. Lista cada threshold
distinto encontrado (ej. 576px, 768px, 992px, 1024px, 1200px...).

Responde: ¿todos los componentes de `shared/ui/` usan el mismo breakpoint (768px, el
de `PlatformService`) para decidir su propio layout interno, o hay componentes con
`@media` a otros thresholds (ej. 992px) que podrían quedar en un estado visual
intermedio — ni "mobile" según Angular (`isMobile()=false` porque el ancho es
800px) ni "desktop" según su propio CSS interno (que a los 800px ya cambia de
layout por su `@media (max-width: 992px)`)? Si encuentras este tipo de
inconsistencia, es un riesgo real de UX HOY, independiente del rename — documéntalo
aunque no sea causado por la propuesta, porque el rename es buen momento para
corregirlo si se decide tocar esos componentes.

### 6.4 Componentes adaptativos que renderizan AMBAS implementaciones a la vez (hidden, no destruida)

Verifica en 10 componentes de `adaptive/` (muestra: los de mayor uso +
`lx-table`, `lx-carousel` que son más complejos visualmente) cómo está escrito el
`@if`/`*ngIf` que elige entre web y mobile:
- ¿Usa `@if (platform.isMobile()) { <mobile/> } @else { <web/> }` (destruye el que no
  se usa, se recrea al cruzar el breakpoint — posible parpadeo/pérdida de estado al
  resize)?
- ¿O usa algo tipo `[hidden]`/`display:none` que mantiene AMBOS en el DOM? Si es así,
  cualquier CSS por nombre de tag que afecte a `-web` o `-mobile` podría estar
  aplicándose a un elemento oculto pero presente, lo cual no es visible pero sí
  consume recursos y puede causar bugs de foco/accesibilidad (tab index) en el
  elemento oculto.

Reporta el patrón real encontrado con cita de código, componente por componente.

### 6.5 Veredicto de este bloque

Responde explícitamente:
- ¿Hay evidencia real (no hipotética) de CSS que se rompería visualmente con el
  rename? Lista completa de archivos+líneas afectados.
- ¿El riesgo de "se ve mal solo en cierto tamaño de pantalla" es real hoy en el
  codebase, o es un riesgo teórico que no se materializa porque no hay CSS por
  nombre de tag?
- Si hay CSS por nombre de tag, **la recomendación obligatoria** es: antes de
  cualquier rename, migrar esas reglas a selectores por clase (`:host`, `.lux-button`,
  atributo `[data-component="button"]`, etc.) en un PR previo e independiente, y
  solo después hacer el rename de selector de componente. Confirma o refuta esta
  recomendación con lo que encontraste.

## Pregunta 7 — Brechas de madurez de librería (nivel PrimeNG / competidores del mismo nivel)

**Contexto de negocio de esta pregunta:** el objetivo final NO es solo renombrar
selectores. Es llegar a tener una librería de componentes propia, con marca, al
nivel de PrimeNG/Angular Material/Ionic Framework. Un rename sin resolver estas
brechas deja el proyecto "a medias" — bien nombrado pero igual de inmaduro en lo
demás. Evalúa cada punto con evidencia real, no солo con la muestra que yo ya hice
(abajo cito mis spot-checks iniciales como punto de partida, pero debes confirmar
con cobertura completa, no solo mi muestra).

### 7.1 Documentación y catálogo visual (¿se puede explorar la librería sin leer código?)

PrimeNG tiene un sitio con cada componente documentado, con ejemplos vivos editables.
Verifica el estado real aquí:
- Cuenta TODOS los `*.stories.ts` dentro de `shared/ui/` (yo encontré 4:
  `chart-wrapper.stories.ts`, `button.stories.ts`, `header.stories.ts`,
  `page.stories.ts` — confirma si siguen siendo esos y si hay más que no detecté).
  Con 357 componentes, ¿qué % tiene story? Lee `.storybook/main.ts` y confirma si
  Storybook está realmente integrado al build/CI o es un experimento abandonado
  (revisa último commit/fecha de modificación de esos archivos).
- Cuenta TODOS los `README.md` dentro de carpetas de componentes individuales (yo
  encontré 3). ¿Qué documentan los que existen? ¿Hay un estándar o cada uno es
  distinto?
- Busca si existe algún `CHANGELOG.md` por componente o para la librería completa
  de `shared/ui/` (yo no encontré ninguno). PrimeNG versiona y documenta breaking
  changes por release; aquí, ¿cómo se comunica hoy un breaking change en un
  componente compartido a los equipos que lo consumen?

### 7.2 Accesibilidad (a11y) — ¿la librería es usable con teclado/lector de pantalla?

Yo hice un spot-check rápido: de 9 archivos `.html` en `adaptive/`, solo 1 tenía
algún atributo `aria-*`. Verifica con cobertura completa (los 357 componentes, no
una muestra de 9):
- ¿Qué % de componentes interactivos (botones, inputs, modales, menús, tabs,
  accordion, tooltip, dialog) tiene algún `aria-*`, `role=`, manejo de `tabindex`,
  o `cdk-trap-focus`/foco programático?
- Prueba específicamente los componentes de overlay (`lx-modal`, `lx-popover`,
  `lx-menu`, `lx-action-sheet`, `lx-tooltip`): ¿devuelven el foco al elemento que
  los abrió al cerrarse? ¿Atrapan el foco mientras están abiertos (focus trap)?
  Esto es un requisito básico de cualquier librería seria y suele fallar en
  implementaciones custom.
- ¿Hay algún test automatizado de a11y (axe-core, `jest-axe`, Playwright
  accessibility snapshot) corriendo sobre estos componentes? Busca en specs y en
  CI (`.github/workflows/*.yml` o equivalente).

### 7.3 Internacionalización (i18n) — ¿la librería sirve para más de un idioma?

Yo hice un spot-check: 0 de 55 componentes en `adaptive/` referencian algún
`TranslateService`/`.instant(`/`transloco`. Verifica con cobertura completa en
TODA `shared/ui/` (no solo `adaptive/`):
- ¿Hay textos hardcodeados en español dentro de los componentes de la librería
  (labels de botones por defecto, mensajes de validación, placeholders)? Si sí,
  eso es una limitación real para cualquier intento de reutilizar la librería en
  otro idioma o cliente.
- ¿Existe algún mecanismo de injection de textos (inputs de texto, servicio de
  i18n, `ng-content` para labels) que sí permita personalizar el idioma por
  consumidor, aunque el default esté en español?

### 7.4 Theming / Design tokens — ¿se puede re-temizar sin tocar el código del componente?

Yo encontré evidencia parcial: `base/tag.base.ts` usa `var(--ds-success)`,
`var(--ds-bg-sunken)`, etc. (buena señal, son CSS custom properties, no colores
hardcodeados). Verifica con cobertura completa:
- ¿Qué % de componentes usa exclusivamente `var(--ds-*)`/tokens de
  `src/styles/core/_colors.scss` (y archivos hermanos: `_spacing.scss`,
  `_typography.scss`, `_borders.scss`, `_shadows.scss`) en vez de valores
  hardcodeados (`#003152`, `16px`, etc.) directo en el componente?
- ¿Existe soporte de dark mode / tema alternativo HOY? Si existe, ¿todos los
  componentes lo respetan o hay excepciones con colores fijos que se verían mal en
  dark mode?
- Lista cualquier componente que encuentres con color/spacing hardcodeado directo
  (no token) como evidencia de inconsistencia.

### 7.5 API pública y superficie de la librería (¿se puede consumir como paquete real?)

- Confirma: NO existe hoy ningún `index.ts`/`public-api.ts` a nivel raíz de
  `shared/ui/` que centralice qué es público (yo no encontré ninguno al nivel raíz,
  solo barrels parciales en `buttons/` e `inputs/`, ver Pregunta 3). Si se quiere
  tratar esto como una librería real extraíble a NPM interno algún día (`ng-packagr`,
  `@luxuryapp/ui`), hace falta un entry point público único que declare la API
  pública real vs. la interna — hoy cualquier archivo es técnicamente importable
  desde fuera (`@ui/web/...` funciona aunque "no debería" usarse directo, según la
  Pregunta 1).
- ¿Existe algún `package.json` o archivo de versión dentro de `shared/ui/`? (yo no
  encontré ninguno). Sin esto, no hay forma de versionar cambios breaking de un
  componente compartido independientemente del resto de la app.

### 7.6 Rendimiento — ¿los componentes están optimizados como se espera de una librería?

Dato real confirmado: la app usa `provideZonelessChangeDetection()` (en
`app.config.ts`), que es la estrategia moderna de Angular. Sin embargo, de 357
componentes en `shared/ui/`, solo 55 declaran explícitamente
`ChangeDetectionStrategy.OnPush`.
- Investiga: en una app zoneless, ¿sigue siendo necesario declarar `OnPush`
  explícitamente, o el modo zoneless ya fuerza ese comportamiento en todos los
  componentes por igual (haciendo irrelevante esta métrica)? Responde con evidencia
  de la documentación oficial de Angular sobre zoneless + OnPush, no por intuición.
- Si siguen existiendo componentes con detección de cambios default (no-OnPush) y
  eso TODAVÍA tiene impacto en zoneless, identifica cuáles son los componentes de
  mayor uso (de la lista de Pregunta 5) que no lo declaran.
- ¿Hay evidencia de lazy-loading o carga diferida de componentes pesados
  (`lx-table`, `lx-editor`, `lx-carousel`, charts)? ¿O se cargan siempre eager como
  parte del bundle principal?

### 7.7 Profundidad real de los tests (no solo "existe .spec.ts")

299/357 componentes tienen `.spec.ts` (dato confirmado por conteo de archivos). Pero
"existe el archivo" no significa "prueba algo útil". Toma una muestra de 15 specs
(mezcla de componentes simples y complejos: `tag`, `button`, `table`, `modal`,
`input-text`) y para cada uno reporta:
- ¿Cuántos `it(...)`/`test(...)` reales tiene?
- ¿Prueba comportamiento (eventos, estados, inputs/outputs) o solo que el componente
  "se crea" (`expect(component).toBeTruthy()` y nada más)?
- Si la mayoría de la muestra es del segundo tipo, el 83.7% de cobertura de specs es
  una métrica vacía — dilo explícitamente en el reporte.

### 7.8 Extensibilidad (slots, personalización, override de comportamiento)

PrimeNG permite personalizar vía `pTemplate`/content projection, `styleClass`, y
paso de templates custom a sub-partes del componente (ej. header de una tabla,
item de un dropdown).
- En los componentes más complejos de `adaptive/` (`lx-table`, `lx-tree`, `lx-menu`,
  `lx-stepper`), ¿existe algún mecanismo de `ng-content`/`@ContentChild`/
  `TemplateRef` para que el consumidor inyecte contenido custom en sub-partes? ¿O
  son "caja negra" (solo inputs primitivos, sin forma de personalizar el render
  interno)?
- Si son caja negra en todos los casos, documenta esto como brecha real: significa
  que cualquier necesidad de UI no prevista hoy requiere modificar el componente de
  la librería (no extenderlo desde fuera), lo cual no escala como librería
  reutilizable real.

## Formato de salida esperado

Un único documento Markdown con:

1. **Veredicto ejecutivo** (7-10 líneas): cubre 3 bloques distintos, no los mezcles:
   - ¿Las 2 premisas críticas de arquitectura (Preguntas 1-4) son ciertas hoy,
     sí/no/parcialmente, con número exacto de excepciones?
   - ¿El riesgo de romper UI/UX visual en silencio (Pregunta 6) es real o teórico,
     con número exacto de reglas CSS afectadas?
   - ¿Qué tan lejos está HOY la librería de un nivel "PrimeNG-like" (Pregunta 7),
     resumido en una tabla de 8 filas (una por sub-punto 7.1-7.8) con estado
     Completo/Parcial/Inexistente y el dato numérico que lo sostiene.
2. **Evidencia detallada** por cada una de las 7 preguntas, con tablas de
   archivo+línea+cita textual. Cero generalizaciones sin archivo+línea de respaldo.
3. **Lista de riesgos concretos** si se ejecuta el rename tal cual está propuesto hoy,
   separada en dos categorías:
   - Riesgos de **compilación/referencias rotas** (de Preguntas 1-5)
   - Riesgos de **UI/UX rota en silencio** — se compila bien pero se ve mal en algún
     breakpoint/dispositivo (de Pregunta 6) — marca esta categoría como la de mayor
     prioridad porque no la detecta ningún pipeline automatizado.
4. **Brechas de madurez de librería** (de Pregunta 7), en una lista priorizada de
   "qué falta para estar al nivel de PrimeNG", ordenada de mayor a menor impacto
   para los usuarios finales de la app (no para el equipo de desarrollo) — es decir,
   a11y y theming consistente pesan más que tener Storybook completo, por ejemplo,
   pero decide tú el orden según lo que encuentres, no sigas este ejemplo a ciegas.
5. **Recomendación de secuencia**: dado todo lo anterior, ¿en qué orden tiene más
   sentido abordar esto? Responde explícitamente si el rename de nomenclatura
   (la propuesta original) debería ir ANTES, DESPUÉS, o EN PARALELO con cerrar las
   brechas de madurez de la Pregunta 7 — y por qué, basado en lo que encontraste (por
   ejemplo: si hay mucho CSS por nombre de tag, quizás conviene resolver eso Y migrar
   a theming con tokens en el mismo PR, en vez de dos pasadas separadas sobre el
   mismo componente). Si hay CSS por nombre de tag (Pregunta 6.2), la recomendación
   DEBE incluir si hace falta un PR previo de migración de esos estilos a selectores
   por clase antes de tocar cualquier nombre de componente.

## Restricciones

- No modifiques ningún archivo de código. Esto es solo lectura/análisis.
- No "resumas" sin leer — si vas a afirmar algo sobre un archivo, tienes que haberlo
  abierto y citado.
- Si un hallazgo contradice la propuesta original, dilo sin filtros ni suavizarlo —
  el objetivo es decidir con datos reales, no quedar bien con la propuesta.
- Si falta tiempo/contexto para cubrir el 100% de los 357 componentes en la Pregunta 5,
  prioriza cobertura completa de las Preguntas 1-4 y 6 (son las que verifican si la
  premisa central y el riesgo de UX son ciertos) y en la 5 sé explícito sobre qué %
  de la muestra cubriste.
- La Pregunta 6 (riesgo UI/UX) NO es opcional ni secundaria — es, junto con la
  Pregunta 1, el hallazgo más importante de todo este análisis. No la resumas en una
  línea; dedícale la misma profundidad de evidencia que a las demás.
- La Pregunta 7 (brechas de madurez de librería) tampoco es un "extra" — es el marco
  de referencia que decide si vale la pena hacer el rename en primer lugar. El
  objetivo final declarado del proyecto es tener una librería al nivel de PrimeNG,
  no solo renombrar selectores bonito. Si encuentras que las brechas de 7.1-7.8 son
  enormes, dilo con la misma contundencia que cualquier otro hallazgo — no es
  "trabajo de otro equipo", es parte de lo que se está evaluando aquí.
- No conviertas la Pregunta 7 en una lista de deseos infinita. Cada sub-punto debe
  responderse con datos de ESTE codebase (cuántos, cuáles, dónde), no con una
  explicación genérica de qué es a11y/i18n/theming en abstracto.
</content>
