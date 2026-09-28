import 'package:flutter/material.dart';

// ═════════════════════════════════════════════════════════════════════════════
// Palette "Executive Precision" — ver DESIGN.md
// ═════════════════════════════════════════════════════════════════════════════

// ── Surface / Background ────────────────────────────────────────────────────
const Color surface               = Color(0xFFFDF7FF);
const Color surfaceDim            = Color(0xFFDED8E0);
const Color surfaceBright         = Color(0xFFFDF7FF);
const Color surfaceContainerLowest = Color(0xFFFFFFFF);
const Color surfaceContainerLow   = Color(0xFFF8F2FA);
const Color surfaceContainer      = Color(0xFFF2ECF4);
const Color surfaceContainerHigh  = Color(0xFFECE6EE);
const Color surfaceContainerHighest = Color(0xFFE6E0E9);
const Color onSurface             = Color(0xFF1D1B20);
const Color onSurfaceVariant      = Color(0xFF494551);
const Color inverseSurface        = Color(0xFF322F35);
const Color inverseOnSurface      = Color(0xFFF5EFF7);
const Color background            = Color(0xFFFDF7FF);
const Color onBackground          = Color(0xFF1D1B20);
const Color surfaceVariant        = Color(0xFFE6E0E9);

// ── Outline ─────────────────────────────────────────────────────────────────
const Color outline               = Color(0xFF7A7582);
const Color outlineVariant        = Color(0xFFCBC4D2);

// ── Primary ─────────────────────────────────────────────────────────────────
const Color primary               = Color(0xFF4F378A);
const Color onPrimary             = Color(0xFFFFFFFF);
const Color primaryContainer      = Color(0xFF6750A4);
const Color onPrimaryContainer    = Color(0xFFE0D2FF);
const Color inversePrimary        = Color(0xFFCFBCFF);
const Color primaryFixed          = Color(0xFFE9DDFF);
const Color primaryFixedDim       = Color(0xFFCFBCFF);
const Color onPrimaryFixed        = Color(0xFF22005D);
const Color onPrimaryFixedVariant = Color(0xFF4F378A);

// ── Secondary ───────────────────────────────────────────────────────────────
const Color secondary             = Color(0xFF63597C);
const Color onSecondary           = Color(0xFFFFFFFF);
const Color secondaryContainer    = Color(0xFFE1D4FD);
const Color onSecondaryContainer  = Color(0xFF645A7D);
const Color secondaryFixed        = Color(0xFFE9DDFF);
const Color secondaryFixedDim     = Color(0xFFCDC0E9);
const Color onSecondaryFixed      = Color(0xFF1F1635);
const Color onSecondaryFixedVariant = Color(0xFF4B4263);

// ── Tertiary ────────────────────────────────────────────────────────────────
const Color tertiary              = Color(0xFF765B00);
const Color onTertiary            = Color(0xFFFFFFFF);
const Color tertiaryContainer     = Color(0xFFC9A74D);
const Color onTertiaryContainer   = Color(0xFF503D00);
const Color tertiaryFixed         = Color(0xFFFFDF93);
const Color tertiaryFixedDim      = Color(0xFFE7C365);
const Color onTertiaryFixed       = Color(0xFF241A00);
const Color onTertiaryFixedVariant = Color(0xFF594400);

// ── Error ───────────────────────────────────────────────────────────────────
const Color error                 = Color(0xFFBA1A1A);
const Color onError               = Color(0xFFFFFFFF);
const Color errorContainer        = Color(0xFFFFDAD6);
const Color onErrorContainer      = Color(0xFF93000A);

// ── Surface Tint ────────────────────────────────────────────────────────────
const Color surfaceTint           = Color(0xFF6750A4);

// ═════════════════════════════════════════════════════════════════════════════
// Aliases retrocompatibles — migrar gradualmente a tokens nuevos
// ═════════════════════════════════════════════════════════════════════════════
const Color azulPrimario   = primary;
const Color azulSecundario = secondary;
const Color verdeExito     = Color(0xFF22C55E);  // legacy — no está en DESIGN.md
const Color rojoError      = error;
const Color amarilloAviso  = Color(0xFFF59E0B);  // legacy — no está en DESIGN.md
const Color grisTexto      = onSurfaceVariant;
const Color grisFondo      = surface;
const Color bordeClaro     = outlineVariant;

// ═════════════════════════════════════════════════════════════════════════════
// Helpers
// ═════════════════════════════════════════════════════════════════════════════

ColorScheme themeColorScheme() => const ColorScheme(
  brightness: Brightness.light,
  primary: primary,
  onPrimary: onPrimary,
  primaryContainer: primaryContainer,
  onPrimaryContainer: onPrimaryContainer,
  secondary: secondary,
  onSecondary: onSecondary,
  secondaryContainer: secondaryContainer,
  onSecondaryContainer: onSecondaryContainer,
  tertiary: tertiary,
  onTertiary: onTertiary,
  tertiaryContainer: tertiaryContainer,
  onTertiaryContainer: onTertiaryContainer,
  error: error,
  onError: onError,
  errorContainer: errorContainer,
  onErrorContainer: onErrorContainer,
  surface: surface,
  onSurface: onSurface,
  surfaceContainerHighest: surfaceContainerHighest,
  surfaceContainerHigh: surfaceContainerHigh,
  surfaceContainer: surfaceContainer,
  surfaceContainerLow: surfaceContainerLow,
  surfaceContainerLowest: surfaceContainerLowest,
  surfaceDim: surfaceDim,
  surfaceBright: surfaceBright,
  inverseSurface: inverseSurface,

  outline: outline,
  outlineVariant: outlineVariant,
  inversePrimary: inversePrimary,
  primaryFixed: primaryFixed,
  primaryFixedDim: primaryFixedDim,
  onPrimaryFixed: onPrimaryFixed,
  onPrimaryFixedVariant: onPrimaryFixedVariant,
  secondaryFixed: secondaryFixed,
  secondaryFixedDim: secondaryFixedDim,
  onSecondaryFixed: onSecondaryFixed,
  onSecondaryFixedVariant: onSecondaryFixedVariant,
  tertiaryFixed: tertiaryFixed,
  tertiaryFixedDim: tertiaryFixedDim,
  onTertiaryFixed: onTertiaryFixed,
  onTertiaryFixedVariant: onTertiaryFixedVariant,
  surfaceTint: surfaceTint,
);
