/// Catálogo de widgets Material 3 con marca LuxuryApp.
///
/// Proporciona wrappers (`Lx*`) de los widgets Material 3 estándar,
/// preconfigurados con los colores, tipografía y espaciado del
/// Design System de LuxuryApp (fuente de verdad: Angular).
///
/// ## Uso
///
/// ```dart
/// import 'package:material_ui_widgets/material_ui_widgets.dart';
///
/// MaterialApp(
///   theme: LxTheme.light,
///   darkTheme: LxTheme.dark,
///   home: MyScreen(),
/// );
/// ```
library;

export 'src/theme/lx_colors.dart';
export 'src/theme/lx_color_scheme.dart';
export 'src/theme/lx_typography.dart';
export 'src/theme/lx_spacing.dart';
export 'src/theme/lx_radius.dart';
export 'src/theme/lx_theme.dart';
