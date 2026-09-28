# material_ui_widgets

Catálogo de widgets Material 3 con marca **LuxuryApp** para apps Flutter internas.

Envuelve los widgets Material 3 estándar de Flutter con los colores, tipografía y espaciado del Design System de LuxuryApp, para que las apps Flutter consuman una sola fuente de verdad en vez de definir temas y paletas por su cuenta.

## Fuente de verdad

Este paquete deriva sus valores del frontend Angular (`appsweb/angular/src/styles/core/`):

| Token | Archivo Angular | Archivo Dart |
|---|---|---|
| Colores (9 familias × 11 tonos) | `_colors.scss` | `lib/src/theme/lx_colors.dart` |
| ColorScheme Material 3 | `_variables.scss` | `lib/src/theme/lx_color_scheme.dart` |
| Tipografía (Figtree) | `_typography.scss`, `_fonts.scss` | `lib/src/theme/lx_typography.dart` |
| Espaciado (base 4px) | `_spacing.scss` | `lib/src/theme/lx_spacing.dart` |
| Border radius (3px estándar) | `_borders.scss` | `lib/src/theme/lx_radius.dart` |
| ThemeData ensamblado | — | `lib/src/theme/lx_theme.dart` |

## Decisión de fuente (§2.2 del plan)

**Figtree** se empaqueta como `.ttf` local (asset del paquete), no vía `google_fonts`.

Razón: consistencia con Angular (que autohospeda `.woff2`), CSP-safe, sin dependencia externa en runtime. Se proveen 4 pesos estáticos (400, 500, 600, 700) que cubren los usos reales de las apps.

## Convención de nombres (§3.4 del plan)

Todas las clases públicas del catálogo usan prefijo **`Lx`** (`LxButton`, `LxCard`, `LxAppBar`, etc.), consistente con el prefijo `lx-*` que usa la capa adaptativa de Angular.

## Consumo

En `pubspec.yaml` de la app consumidora:

```yaml
dependencies:
  material_ui_widgets:
    path: ../../shared/material-ui-widgets
```

En el código:

```dart
import 'package:material_ui_widgets/material_ui_widgets.dart';

MaterialApp(
  theme: LxTheme.light,
  darkTheme: LxTheme.dark,
  // ...
);
```

## Catálogo de widgets (Fase 2+)

| Categoría | Widgets |
|---|---|
| Actions | `LxButton`, `LxFloatingActionButton`, `LxIconButton`, `LxSegmentedButton` |
| Communication | `LxBadge`, `LxLinearProgressIndicator`, `LxSnackBar` |
| Containment | `LxAlertDialog`, `LxBottomSheet`, `LxCard`, `LxDivider`, `LxListTile` |
| Navigation | `LxAppBar`, `LxNavigationBar`, `LxNavigationDrawer`, `LxTabBar` |
| Selection | `LxCheckbox`, `LxChip`, `LxDatePicker`, `LxRadio`, `LxSlider`, `LxSwitch`, `LxTimePicker` |
| Text inputs | `LxTextField` |

## Dark mode

Soporte completo. `LxTheme.dark` invierte la paleta siguiendo los mismos tokens que `_dark-mode.scss` en Angular.

## Estructura

```
lib/
├── material_ui_widgets.dart          # barrel file
└── src/
    └── theme/
        ├── lx_colors.dart            # escalas 50-950
        ├── lx_color_scheme.dart      # ColorScheme light/dark
        ├── lx_typography.dart        # TextTheme con Figtree
        ├── lx_spacing.dart           # tokens de espaciado
        ├── lx_radius.dart            # tokens de radio
        └── lx_theme.dart             # ThemeData light/dark
```
