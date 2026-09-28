import 'package:flutter/material.dart';

import 'lx_colors.dart';

/// ColorScheme de Material 3 con marca LuxuryApp.
///
/// Mapea las escalas de `LxColors` a los roles de Material 3.
/// Fuente de verdad: `appsweb/angular/src/styles/theme/_variables.scss`.
abstract final class LxColorScheme {
  // ════════════════════════════════════════════════════════════════
  // LIGHT MODE
  // ════════════════════════════════════════════════════════════════

  static const ColorScheme light = ColorScheme(
    brightness: Brightness.light,

    // Primary — Azul Profundo (ancla: primary-700 #003152)
    primary: LxColors.primary700,
    onPrimary: LxColors.neutral0,
    primaryContainer: LxColors.primary100,
    onPrimaryContainer: LxColors.primary700,
    primaryFixed: LxColors.primary100,
    primaryFixedDim: LxColors.primary200,
    onPrimaryFixed: LxColors.primary900,
    onPrimaryFixedVariant: LxColors.primary700,
    inversePrimary: LxColors.primary400,

    // Secondary — Neutros fríos
    secondary: LxColors.secondary600,
    onSecondary: LxColors.neutral0,
    secondaryContainer: LxColors.secondary100,
    onSecondaryContainer: LxColors.secondary800,
    secondaryFixed: LxColors.secondary100,
    secondaryFixedDim: LxColors.secondary200,
    onSecondaryFixed: LxColors.secondary900,
    onSecondaryFixedVariant: LxColors.secondary700,

    // Tertiary — Info/Cian (help = info en Angular)
    tertiary: LxColors.info600,
    onTertiary: LxColors.neutral0,
    tertiaryContainer: LxColors.info100,
    onTertiaryContainer: LxColors.primary700,
    tertiaryFixed: LxColors.info100,
    tertiaryFixedDim: LxColors.info200,
    onTertiaryFixed: LxColors.info950,
    onTertiaryFixedVariant: LxColors.info700,

    // Error — Danger (Carmesí)
    error: LxColors.danger600,
    onError: LxColors.neutral0,
    errorContainer: LxColors.danger100,
    onErrorContainer: LxColors.danger800,

    // Surface — Neutral
    surface: LxColors.neutral0,
    onSurface: LxColors.neutral800,
    onSurfaceVariant: LxColors.neutral600,
    surfaceContainerLowest: LxColors.neutral0,
    surfaceContainerLow: LxColors.neutral0,
    surfaceContainer: LxColors.primary100,
    surfaceContainerHigh: LxColors.secondary200,
    surfaceContainerHighest: LxColors.secondary300,
    surfaceDim: LxColors.primary100,
    surfaceBright: LxColors.neutral0,
    surfaceTint: LxColors.primary500,
    inverseSurface: LxColors.primary800,

    // Outline
    outline: LxColors.secondary200,
    outlineVariant: LxColors.secondary300,

    // Scrim & Shadow
    scrim: LxColors.neutral1000,
    shadow: LxColors.neutral1000,
  );

  // ════════════════════════════════════════════════════════════════
  // DARK MODE
  // ════════════════════════════════════════════════════════════════

  static const ColorScheme dark = ColorScheme(
    brightness: Brightness.dark,

    // Primary — invertido (primary-200 sobre navy)
    primary: LxColors.primary200,
    onPrimary: LxColors.primary900,
    primaryContainer: LxColors.primary800,
    onPrimaryContainer: LxColors.primary200,
    primaryFixed: LxColors.primary100,
    primaryFixedDim: LxColors.primary200,
    onPrimaryFixed: LxColors.primary900,
    onPrimaryFixedVariant: LxColors.primary700,
    inversePrimary: LxColors.primary600,

    // Secondary — invertido
    secondary: LxColors.secondary200,
    onSecondary: LxColors.secondary900,
    secondaryContainer: LxColors.secondary800,
    onSecondaryContainer: LxColors.secondary200,
    secondaryFixed: LxColors.secondary100,
    secondaryFixedDim: LxColors.secondary200,
    onSecondaryFixed: LxColors.secondary900,
    onSecondaryFixedVariant: LxColors.secondary700,

    // Tertiary — invertido
    tertiary: LxColors.info300,
    onTertiary: LxColors.info900,
    tertiaryContainer: LxColors.info800,
    onTertiaryContainer: LxColors.info200,
    tertiaryFixed: LxColors.info100,
    tertiaryFixedDim: LxColors.info200,
    onTertiaryFixed: LxColors.info950,
    onTertiaryFixedVariant: LxColors.info700,

    // Error — invertido
    error: LxColors.danger300,
    onError: LxColors.danger900,
    errorContainer: LxColors.danger800,
    onErrorContainer: LxColors.danger200,

    // Surface — navy oscuro
    surface: LxColors.primary950,
    onSurface: LxColors.primary100,
    onSurfaceVariant: LxColors.primary300,
    surfaceContainerLowest: LxColors.primary950,
    surfaceContainerLow: LxColors.primary900,
    surfaceContainer: LxColors.primary800,
    surfaceContainerHigh: LxColors.primary700,
    surfaceContainerHighest: LxColors.primary600,
    surfaceDim: LxColors.primary950,
    surfaceBright: LxColors.primary900,
    surfaceTint: LxColors.primary200,
    inverseSurface: LxColors.neutral0,

    // Outline — invertido
    outline: LxColors.primary700,
    outlineVariant: LxColors.primary400,

    // Scrim & Shadow
    scrim: LxColors.neutral1000,
    shadow: LxColors.neutral1000,
  );
}
