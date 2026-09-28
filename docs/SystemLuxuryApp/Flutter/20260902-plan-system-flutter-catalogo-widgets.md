# Plan: Catálogo de Widgets Material 3 con marca LuxuryApp (Flutter)

**Audiencia:** Agente ejecutor externo (OpenCode) — sin contexto previo de esta conversación.
**Paquete a crear:** `D:\repos\luxuryapp-api\appsmobil\flutter\shared\material-ui-widgets`
**Consumidores previstos:** `appsmobil/flutter/commitee/app` y `appsmobil/flutter/checador/app`
**Precedente que se imita (filosofía, no estructura literal):** `appsweb/angular/src/app/shared/ui` — librería centralizada de componentes de marca que las features consumen en vez de usar el framework de UI de base directamente.
**Regla madre:** Lee `D:\repos\luxuryapp-api\CONVENTIONS.md` completo antes de tocar nada. Este plan **es una propuesta nueva**, no una regla ya aprobada: los documentos oficiales de Flutter (`conventions/flutter/*.md`) hoy son stubs de 10-20 líneas sin arquitectura de UI compartida definida. Por Regla Universal #8 de `CONVENTIONS.md` ("si la ubicación/estructura correcta no está clara: proponer y esperar aprobación"), **detente y confirma con el Tech Lead antes de la Fase 1** si algo aquí te genera duda — no la resuelvas por iniciativa propia.

---

## 0. Contexto verificado (no asumido)

Antes de escribir este plan se inspeccionó el estado real del repo. Resumen de lo que ya existe y por qué importa:

1. **`appsmobil/flutter/shared/material-ui-widgets/` ya existe pero está vacía** (0 archivos). Es el destino correcto; no hay nada que preservar ahí.
2. **`commitee/app`** (`pubspec.yaml`, SDK `^3.5.0`) y **`checador/app`** (`pubspec.yaml`, SDK `^3.11.5`) son dos apps Flutter independientes, cada una con su propio `pubspec.yaml` bajo `<proyecto>/app/`. Ninguna de las dos tiene hoy una dependencia local (`path:`) a ningún paquete compartido — es la primera vez que se introduce codigo compartido entre ellas.
3. **Ambas comparten stack de infraestructura:** `flutter_riverpod`, `dio` + `retrofit`, `freezed`, `go_router`, `flutter_secure_storage`, `cherry_toast`, `cupertino_icons`. Ninguna de esas dependencias debe entrar al paquete de widgets (ver §3.2 — pureza de dependencias).
4. **`checador/app` ya tiene un tema Material 3 completo pero desalineado con la marca:** `checador/app/DESIGN.md` + `checador/app/lib/core/config/app_colores.dart` implementan la paleta "Executive Precision" — **morado** (`primary: #4F378A`) con fuente **Inter**. Ninguno de los dos coincide con la marca real de LuxuryApp. Esto no es una base a extender: es exactamente el tipo de tema placeholder que este catálogo debe reemplazar.
5. **`commitee/app` no tiene archivo de tema/colores propio** — adopción en verde, salvo por `flutter_launcher_icons`/`flutter_native_splash` que ya usan `#0B3164` (azul marino), consistente con la marca real.
6. **La fuente de verdad real de la marca es el frontend Angular**, no `DESIGN.md` de checador:
   - Color ancla: `appsweb/angular/src/styles/core/_colors.scss` → `$primary-700: #003152` (Azul Profundo), con escalas completas 50→950 para `primary, secondary, success, warning, danger, info, help, neutral, contrast`.
   - Tipografía: `appsweb/angular/src/styles/core/_fonts.scss` → familia **Figtree**, variable (peso 300–900), autohospedada en `.woff2`, subset latin. **No es "Inter".**
7. Los documentos `conventions/flutter/*.md` (`flutter-rules.md`, `flutter-feature-structure.md`, `flutter-generic-services-catalog.md`, `flutter-prohibitions.md`) son stubs genéricos: no definen hoy ninguna arquitectura de UI compartida para Flutter. Este plan la propone; queda pendiente reflejarla ahí una vez aprobada (§8).
8. **Catálogo de referencia** (`https://docs.flutter.dev/ui/widgets/material`, Material 3, vigente desde Flutter 3.16) agrupa los widgets en 6 categorías. Se usa como universo de alcance en §4.

---

## 1. Objetivo

Crear un paquete Flutter local (`material_ui_widgets`) que envuelva los widgets Material 3 de Flutter con los colores y la tipografía de marca de LuxuryApp, para que `commitee` y `checador` (y futuras apps Flutter) dejen de definir temas y paletas por su cuenta y consuman una sola fuente de verdad — igual que las features Angular consumen `shared/ui` en vez de PrimeNG/Ionic directo.

**Fuera de alcance de este plan:**
- No migra la lógica de negocio de `commitee` ni `checador`.
- No decide gestión de estado, navegación ni networking — el paquete es solo UI/tema.
- No crea una app de ejemplo tipo Storybook (puede proponerse como fase futura, no aquí).
- No modifica `CONVENTIONS.md` ni los docs de gobernanza — eso ocurre en §8, **después** de que el Tech Lead apruebe la arquitectura resultante.

---

## 2. Fuente de verdad de marca (colores y tipografía)

**No inventar valores nuevos.** Todo color y tipografía del paquete debe derivarse de los archivos Angular ya verificados en §0.6.

### 2.1 Colores

Portar a Dart las escalas completas de `appsweb/angular/src/styles/core/_colors.scss` (9 familias × 11 tonos 50–950 cada una: `primary, secondary, success, warning, danger, info, help, neutral, contrast`). Cada valor hex de ese archivo SCSS se convierte 1:1 a un `Color(0xFF......)` de Dart — no se redondea ni se "ajusta a ojo".

A partir de esas escalas, construir un `ColorScheme` de Material 3 (`ColorScheme.light()` / `ColorScheme.dark()`) mapeando:
- `primary` / `onPrimary` / `primaryContainer` → familia `primary` (ancla en `primary-700 = #003152`, igual que en Angular).
- `secondary` / `onSecondary` / `secondaryContainer` → familia `secondary`.
- `error` / `onError` / `errorContainer` → familia `danger`.
- `tertiary` → si no hay familia terciaria equivalente en Angular, usar `help` o `info` (documentar la decisión en el README del paquete, no dejarla implícita).
- `surface` / `surfaceContainer*` / `background` → familia `neutral`.

Este es el mismo ejercicio que ya resolvió `checador/app/lib/core/config/app_colores.dart` para la paleta "Executive Precision" (ver esa función `themeColorScheme()` como referencia de forma, **no de valores** — los valores de ahí son el tema equivocado a reemplazar).

### 2.2 Tipografía

- Familia: **Figtree**, variable, pesos 300–900.
- **Verificar antes de usar:** Flutter no puede cargar directamente el `.woff2` que usa Angular (`assets/fonts/figtree-latin-var.woff2`) — el motor de fuentes de Flutter (Skia) espera `.ttf`/`.otf`. Antes de la Fase 2, consigue el archivo de Figtree en formato `.ttf` (variable o los pesos estáticos que realmente se usen: 400, 500, 600, 700 como mínimo) y decide explícitamente entre:
  - (a) Empaquetar el/los `.ttf` como asset de fuente local del paquete (`fonts:` en `pubspec.yaml`), **sin** el paquete `google_fonts` — más cercano al criterio "autohospedado / CSP-safe" que ya se documentó para Angular.
  - (b) Usar el paquete `google_fonts` (ya es dependencia de `commitee`, no de `checador`) apuntando a Figtree.
  - Documenta la decisión y su motivo en el `README.md` del paquete. No la tomes en silencio.
- Construir un `TextTheme` de Material 3 (`displayLarge`, `headlineLarge`, `titleMedium`, `bodyLarge`, `bodyMedium`, `labelSmall`, etc.) usando Figtree. Si `appsweb/angular/src/styles/core/_typography.scss` define escalas de tamaño/line-height/letter-spacing ya nombradas (revísalo — no se incluyó en este plan por espacio), reutilízalas en vez de inventar una escala nueva.

### 2.3 Espaciado y radios

Revisa `appsweb/angular/src/styles/core/_spacing.scss` y `_borders.scss` antes de definir valores de padding/margin/radio en Dart. Si existen tokens con nombres (`--ds-space-md`, `--ds-radius-md`, etc.), pórtalos con el mismo nombre semántico (en `lowerCamelCase` Dart: `dsSpaceMd`, `dsRadiusMd`). No definas una escala de espaciado independiente sin haber leído esos archivos primero.

---

## 3. Arquitectura del paquete

### 3.1 Por qué no se copia literal la estructura de `shared/ui` de Angular

`shared/ui` en Angular está partida en `web/` (PrimeNG) y `mobile/` (Ionic) porque Angular sirve **dos runtimes de UI distintos** (escritorio vs. app híbrida). Flutter no tiene ese problema: un mismo widget Dart compila a Android/iOS/web/desktop. Así que **no crear carpetas `web/`/`mobile/`/`adaptive/`** — no hay nada que adaptar en runtime. Lo que sí se imita es la filosofía: una capa de componentes de marca, organizada por categoría, que las apps consumen en vez de tocar el framework base (`MaterialApp`/widgets Material) directamente.

### 3.2 Pureza de dependencias (equivalente a la regla `base/` de Angular)

El paquete **no debe depender de**: `flutter_riverpod`, `dio`, `retrofit`, `go_router`, `flutter_secure_storage`, `cherry_toast`, ni de ningún paquete de red/estado/navegación/storage. Es UI y tema, punto. Dependencias permitibles: `flutter` (SDK), y opcionalmente `google_fonts` **solo si** la decisión de §2.2 fue (b), o `cupertino_icons` si el catálogo de iconos de marca lo requiere. Si en el futuro se necesita lógica de estado dentro de un widget compuesto (p. ej. un date range picker con estado interno), usa `StatefulWidget`/`ValueNotifier` nativo de Flutter, no un paquete de gestión de estado de terceros.

### 3.3 Estructura de carpetas propuesta

```
appsmobil/flutter/shared/material-ui-widgets/
├── pubspec.yaml                        # name: material_ui_widgets (snake_case obligatorio, ver §5.1)
├── analysis_options.yaml               # copiar/alinear con analysis_options.yaml de commitee o checador
├── README.md                           # qué es, cómo se consume, decisión de fuente (§2.2), catálogo de widgets
├── lib/
│   ├── material_ui_widgets.dart        # barrel file: un único export público del paquete
│   └── src/
│       ├── theme/
│       │   ├── lx_colors.dart          # escalas 50-950 portadas de _colors.scss
│       │   ├── lx_color_scheme.dart    # ColorScheme.light()/dark() de marca
│       │   ├── lx_typography.dart      # TextTheme con Figtree
│       │   ├── lx_spacing.dart         # tokens de espaciado (si existen en Angular)
│       │   ├── lx_radius.dart          # tokens de radio
│       │   └── lx_theme.dart           # ThemeData.light()/dark() ensamblado, listo para MaterialApp(theme: ...)
│       ├── actions/                    # Common buttons, FAB, Extended FAB, IconButton, SegmentedButton
│       ├── communication/              # Badge, LinearProgressIndicator, SnackBar
│       ├── containment/                # AlertDialog, Bottom sheet, Card, Divider, ListTile
│       ├── navigation/                 # AppBar, Bottom app bar, NavigationBar, NavigationDrawer, Navigation rail, TabBar
│       ├── selection/                  # Checkbox, Chip, DatePicker, Menu, Radio, Slider, Switch, TimePicker
│       └── text_inputs/                # TextField
├── assets/
│   └── fonts/                          # .ttf de Figtree (ver §2.2) — declarados en pubspec.yaml
└── test/
    └── (opcional en esta fase — ver §6, Fase 4)
```

Las 6 carpetas bajo `src/` corresponden **exactamente** a las categorías del catálogo oficial de Flutter Material 3 (verificado en `docs.flutter.dev/ui/widgets/material`, §4). No se inventan categorías nuevas.

### 3.4 Convención de nombres — PROPUESTA, requiere aprobación explícita

Se propone prefijo **`Lx`** para cada clase pública del catálogo (`LxButton`, `LxCard`, `LxAppBar`, `LxTextField`, `LxChip`, etc.), por consistencia con el prefijo `lx-*` que ya usa la capa adaptativa de Angular (`lx-status-badge`, ver `arquitectura-shared-ui.md` §3). Esto es una decisión de marca cross-stack (Angular usa `lx-*` en selectores HTML, Flutter usaría `Lx*` en nombres de clase Dart) que afecta a decenas de nombres futuros — **no la des por aprobada solo porque está en este plan**; confírmala explícitamente con el Tech Lead antes de nombrar el primer widget. Si se rechaza, la alternativa más simple es no prefijar y usar el nombre Material tal cual (`Button`, `Card`) — menos idiomático en Dart (choca por nombre con clases de Flutter) y por eso no es la opción recomendada aquí.

---

## 4. Catálogo a envolver (alcance completo, verificado en docs.flutter.dev — Material 3, vigente desde Flutter 3.16)

| Categoría | Widgets Material 3 a envolver |
|---|---|
| **Actions** | Common buttons (Elevated/Filled/Outlined/Text), FloatingActionButton, Extended FloatingActionButton, IconButton, SegmentedButton |
| **Communication** | Badge, LinearProgressIndicator, SnackBar |
| **Containment** | AlertDialog, Bottom sheet, Card, Divider, ListTile |
| **Navigation** | AppBar, Bottom app bar, NavigationBar, NavigationDrawer, Navigation rail, TabBar |
| **Selection** | Checkbox, Chip, DatePicker, Menu, Radio, Slider, Switch, TimePicker |
| **Text inputs** | TextField |

Cada wrapper `Lx*` debe:
1. Envolver el widget Material real (composición, no reimplementación desde cero).
2. Tomar sus colores/tipografía de `Theme.of(context)` (que a su vez viene de `lx_theme.dart`) — **nunca** un color o `TextStyle` hardcodeado dentro del widget de catálogo. Esto es la versión Flutter de la Regla Crítica de Tokens CSS que ya rige en Angular (`CONVENTIONS.md` §6.1): un catálogo de marca que hardcodea sus propios colores contradice su propósito.
3. Exponer solo las variantes/props que las apps consumidoras realmente necesiten hoy — no anticipar props especulativas (revisa el uso real en `commitee/app/lib` y `checador/app/lib` antes de diseñar la API de cada widget).

---

## 5. Configuración del paquete

### 5.1 Nombre del paquete (cuidado con guiones)

La carpeta puede llamarse `material-ui-widgets` (kebab-case, como pidió el dueño del repo), pero **Dart no permite guiones en el nombre de paquete**. Dentro de `pubspec.yaml`:

```yaml
name: material_ui_widgets   # snake_case obligatorio — NO "material-ui-widgets"
description: "Catálogo de widgets Material 3 con marca LuxuryApp, para apps Flutter internas."
publish_to: 'none'
version: 0.1.0

environment:
  sdk: '>=3.5.0 <4.0.0'   # límite inferior del más permisivo (commitee); checador (^3.11.5) sigue mandando en su propio build
```

**Verifica ambos `pubspec.lock`** (`commitee/app/pubspec.lock`, `checador/app/pubspec.lock`) antes de fijar el límite inferior real — si en la práctica ambas apps ya compilan con un SDK de Flutter/Dart muy superior a 3.5.0/3.11.5, ese detalle es secundario, pero no lo asumas sin mirar.

```yaml
flutter:
  uses-material-design: true
  fonts:
    - family: Figtree
      fonts:
        - asset: assets/fonts/Figtree-Regular.ttf
          weight: 400
        - asset: assets/fonts/Figtree-Medium.ttf
          weight: 500
        - asset: assets/fonts/Figtree-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/Figtree-Bold.ttf
          weight: 700
  # Ajustar según los pesos que realmente se consigan/usen (ver §2.2)
```

### 5.2 Cómo lo consumen `commitee` y `checador`

En `commitee/app/pubspec.yaml` y `checador/app/pubspec.yaml`, bajo `dependencies:`:

```yaml
  material_ui_widgets:
    path: ../../shared/material-ui-widgets
```

(Ruta relativa verificada: `commitee/app` → `../..` → `commitee`'s parent (`flutter`) → `shared/material-ui-widgets`. Misma profundidad para `checador/app`.)

---

## 6. Fases de ejecución

**Fase 0 — Setup del paquete (sin widgets todavía)**
- Crear estructura de `pubspec.yaml`, `analysis_options.yaml`, `lib/material_ui_widgets.dart` (barrel vacío), README con el esqueleto de decisiones pendientes (§2.2, §3.4).
- Criterio de paso: `flutter pub get` corre sin error dentro de `material-ui-widgets/`.

**Fase 1 — Tema y tokens (§2, §3.3 carpeta `theme/`)**
- Portar colores, tipografía, espaciado, radios.
- Ensamblar `lx_theme.dart` con `ThemeData.light()` (y `.dark()` si Angular ya define dark mode — revisar `styles/base/_dark-mode.scss` antes de decidir si aplica).
- Criterio de paso: un `main.dart` de prueba mínimo (fuera del paquete, puede ser un script ad-hoc, no hace falta un ejemplo formal en esta fase) puede hacer `MaterialApp(theme: lxTheme)` y ver la app pintada en azul marino de marca, no en el azul Material por defecto.

**Fase 2 — Primer lote de widgets (los de mayor uso real)**
- Basado en lo que `commitee/app/lib` y `checador/app/lib` ya usan hoy (revísalo con `grep -rn "ElevatedButton\|TextField\|AppBar\|Card\|Chip" appsmobil/flutter/{commitee,checador}/app/lib`), envolver primero esos widgets, no el catálogo completo de una vez.
- Candidatos probables por uso típico de apps de formularios/asistencia: `LxButton`, `LxTextField`, `LxAppBar`, `LxCard`, `LxSnackBar`.
- Criterio de paso: cada widget de este lote tiene su archivo en la carpeta de categoría correcta (§3.3) y usa `Theme.of(context)`, no colores propios.

**Fase 3 — Resto del catálogo (§4 completo)**
- Completar las categorías restantes.
- Criterio de paso: las 6 categorías de §4 tienen al menos un wrapper por cada widget listado, o una nota explícita en el README de por qué ese widget no aplica a estas apps (no dejar huecos silenciosos).

**Fase 4 — Adopción en `commitee` y `checador`**
- Agregar la dependencia `path:` (§5.2) a ambos `pubspec.yaml`.
- En `checador`: reemplazar `themeColorScheme()`/`app_colores.dart` por el tema del paquete nuevo — esto es un cambio visible (de morado a azul marino), coordinar con el dueño de esa app antes de mergear, no como parte silenciosa de esta tarea.
- En `commitee`: adoptar el tema del paquete desde cero en su `MaterialApp`.
- Criterio de paso: ambas apps compilan (`flutter build` o al menos `flutter analyze` limpio) usando `material_ui_widgets` para su tema y para los widgets migrados en Fase 2/3.

Las fases son secuenciales (cada una depende de la anterior). No saltar a Fase 2 sin haber cerrado la decisión de fuente en Fase 1.

---

## 7. Qué NO hacer

- No declarar dependencias de estado/red/navegación dentro del paquete (§3.2).
- No hardcodear ningún `Color(0x......)` ni `TextStyle` fuera de la carpeta `theme/` — todo wrapper de widget consume el tema vía `Theme.of(context)`.
- No decidir en silencio la fuente de Figtree (§2.2) ni el prefijo de nombres (§3.4) — son las dos decisiones explícitamente marcadas como "requiere aprobación" en este plan.
- No migrar la lógica de negocio de `checador`/`commitee` al tocar sus pantallas en Fase 4 — solo el tema y los widgets de presentación.
- No crear carpetas `web/`/`mobile/`/`adaptive/` — no aplican a Flutter (§3.1).

## 8. Gobernanza (después de aprobación, no parte de la ejecución de código)

Una vez el Tech Lead apruebe la arquitectura resultante (especialmente §2.2 y §3.4), actualizar:
- `conventions/flutter/flutter-feature-structure.md` — agregar la ubicación oficial de `shared/material-ui-widgets` como "widgets shared".
- `conventions/flutter/flutter-rules.md` — referenciar este paquete como el catálogo oficial.
- `CONVENTIONS.md` §5.4 (Flutter) — enlazar el nuevo doc, igual que §5.5/§5.6 ya enlazan `ui-shared-library-architecture.md` y `styles-structure.md` para Angular.

Esto no lo ejecutas tú (OpenCode) de forma automática: repórtalo como pendiente al terminar, para que el Tech Lead lo revise y lo apruebe explícitamente antes de que quede como regla vigente.

## Qué reportar al terminar cada fase

Fase completada, comandos ejecutados, resultado de los criterios de paso de esa fase, y explícitamente: qué decidiste en §2.2 (formato de fuente) y si §3.4 (prefijo `Lx`) fue confirmado o quedó pendiente de aprobación. No avances a la fase siguiente si una decisión marcada "requiere aprobación" sigue abierta.
