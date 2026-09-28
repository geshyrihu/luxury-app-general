import 'package:flutter/material.dart';

/// TextTheme del Design System de LuxuryApp.
///
/// Fuente: **Figtree** (variable, pesos 400-700).
/// Escala modular: 1.25 (desde `_typography.scss`).
/// Tamaños y line-heights portados de la escala Angular.
abstract final class LxTypography {
  static const String _fontFamily = 'Figtree';

  // ════════════════════════════════════════════════════════════════
  // TEXT THEME — Material 3 roles
  // ════════════════════════════════════════════════════════════════

  /// displayLarge — 48px / 700 / -0.025em (h1, $font-size-5xl)
  static const TextStyle displayLarge = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 48,
    fontWeight: FontWeight.w700,
    height: 1.25,
    letterSpacing: -0.025,
  );

  /// displayMedium — 36px / 700 / -0.025em (h1 mobile, $font-size-4xl)
  static const TextStyle displayMedium = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 36,
    fontWeight: FontWeight.w700,
    height: 1.25,
    letterSpacing: -0.025,
  );

  /// displaySmall — 30px / 700 / normal (h2, $font-size-3xl)
  static const TextStyle displaySmall = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 30,
    fontWeight: FontWeight.w700,
    height: 1.25,
    letterSpacing: 0,
  );

  /// headlineLarge — 24px / 600 / normal (h3, $font-size-2xl)
  static const TextStyle headlineLarge = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w600,
    height: 1.375,
    letterSpacing: 0,
  );

  /// headlineMedium — 20px / 600 / normal (h4, $font-size-xl)
  static const TextStyle headlineMedium = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.375,
    letterSpacing: 0,
  );

  /// headlineSmall — 18px / 500 / normal (h5, $font-size-lg)
  static const TextStyle headlineSmall = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 18,
    fontWeight: FontWeight.w500,
    height: 1.5,
    letterSpacing: 0,
  );

  /// titleLarge — 16px / 600 / normal (h6, $font-size-base headline)
  static const TextStyle titleLarge = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.5,
    letterSpacing: 0,
  );

  /// titleMedium — 14px / 500 / 0.01em ($font-size-sm medium)
  static const TextStyle titleMedium = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 1.5,
    letterSpacing: 0.01,
  );

  /// titleSmall — 12px / 500 / 0.01em ($font-size-xs medium)
  static const TextStyle titleSmall = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w500,
    height: 1.5,
    letterSpacing: 0.01,
  );

  /// bodyLarge — 16px / 400 / normal ($font-size-base)
  static const TextStyle bodyLarge = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.5,
    letterSpacing: 0,
  );

  /// bodyMedium — 14px / 400 / normal ($font-size-sm)
  static const TextStyle bodyMedium = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.5,
    letterSpacing: 0,
  );

  /// bodySmall — 12px / 400 / normal ($font-size-xs)
  static const TextStyle bodySmall = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.5,
    letterSpacing: 0,
  );

  /// labelLarge — 14px / 500 / 0.025em ($font-size-sm label)
  static const TextStyle labelLarge = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 1.5,
    letterSpacing: 0.025,
  );

  /// labelMedium — 12px / 500 / 0.05em ($font-size-xs label)
  static const TextStyle labelMedium = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w500,
    height: 1.5,
    letterSpacing: 0.05,
  );

  /// labelSmall — 10px / 500 / 0.05em ($font-size-2xs)
  static const TextStyle labelSmall = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 10,
    fontWeight: FontWeight.w500,
    height: 1.5,
    letterSpacing: 0.05,
  );

  // ════════════════════════════════════════════════════════════════
  // TEXTTHEME DE MATERIAL 3
  // ════════════════════════════════════════════════════════════════

  /// TextTheme de Material 3 completo con Figtree.
  static const TextTheme textTheme = TextTheme(
    displayLarge: displayLarge,
    displayMedium: displayMedium,
    displaySmall: displaySmall,
    headlineLarge: headlineLarge,
    headlineMedium: headlineMedium,
    headlineSmall: headlineSmall,
    titleLarge: titleLarge,
    titleMedium: titleMedium,
    titleSmall: titleSmall,
    bodyLarge: bodyLarge,
    bodyMedium: bodyMedium,
    bodySmall: bodySmall,
    labelLarge: labelLarge,
    labelMedium: labelMedium,
    labelSmall: labelSmall,
  );
}
