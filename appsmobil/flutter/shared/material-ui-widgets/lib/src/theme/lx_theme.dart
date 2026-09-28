import 'package:flutter/material.dart';

import 'lx_color_scheme.dart';
import 'lx_colors.dart';
import 'lx_radius.dart';
import 'lx_spacing.dart';
import 'lx_typography.dart';

/// ThemeData de Material 3 con marca LuxuryApp.
///
/// Uso:
/// ```dart
/// MaterialApp(
///   theme: LxTheme.light,
///   darkTheme: LxTheme.dark,
/// );
/// ```
abstract final class LxTheme {
  // ════════════════════════════════════════════════════════════════
  // LIGHT THEME
  // ════════════════════════════════════════════════════════════════

  static final ThemeData light = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: LxColorScheme.light,
    textTheme: LxTypography.textTheme,

    // ═══ Component Themes ═══

    appBarTheme: const AppBarTheme(
      elevation: 0,
      scrolledUnderElevation: 1,
      centerTitle: false,
      titleTextStyle: TextStyle(
        fontFamily: 'Figtree',
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: LxColors.neutral800,
      ),
      iconTheme: IconThemeData(color: LxColors.neutral800),
    ),

    cardTheme: CardThemeData(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LxRadius.card),
        side: const BorderSide(color: LxColors.neutral200),
      ),
      margin: const EdgeInsets.all(LxSpacing.paddingCard),
    ),

    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 0,
        padding: const EdgeInsets.symmetric(
          horizontal: LxSpacing.paddingComponentMdH,
          vertical: LxSpacing.paddingComponentMdV,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LxRadius.btn),
        ),
        textStyle: const TextStyle(
          fontFamily: 'Figtree',
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),

    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        elevation: 0,
        padding: const EdgeInsets.symmetric(
          horizontal: LxSpacing.paddingComponentMdH,
          vertical: LxSpacing.paddingComponentMdV,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LxRadius.btn),
        ),
        textStyle: const TextStyle(
          fontFamily: 'Figtree',
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),

    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        elevation: 0,
        padding: const EdgeInsets.symmetric(
          horizontal: LxSpacing.paddingComponentMdH,
          vertical: LxSpacing.paddingComponentMdV,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LxRadius.btn),
        ),
        side: const BorderSide(color: LxColors.neutral200),
        textStyle: const TextStyle(
          fontFamily: 'Figtree',
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),

    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(
          horizontal: LxSpacing.paddingComponentMdH,
          vertical: LxSpacing.paddingComponentMdV,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LxRadius.btn),
        ),
        textStyle: const TextStyle(
          fontFamily: 'Figtree',
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),

    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: LxColors.neutral0,
      contentPadding: const EdgeInsets.symmetric(
        horizontal: LxSpacing.paddingInputMdH,
        vertical: LxSpacing.paddingInputMdV,
      ),
      border: const OutlineInputBorder(
        borderSide: BorderSide(color: LxColors.neutral200),
      ),
      enabledBorder: const OutlineInputBorder(
        borderSide: BorderSide(color: LxColors.neutral200),
      ),
      focusedBorder: const OutlineInputBorder(
        borderSide: BorderSide(color: LxColors.primary500, width: 2),
      ),
      errorBorder: const OutlineInputBorder(
        borderSide: BorderSide(color: LxColors.danger600),
      ),
      focusedErrorBorder: const OutlineInputBorder(
        borderSide: BorderSide(color: LxColors.danger600, width: 2),
      ),
      labelStyle: const TextStyle(
        fontFamily: 'Figtree',
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: LxColors.neutral600,
      ),
      hintStyle: const TextStyle(
        fontFamily: 'Figtree',
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: LxColors.neutral400,
      ),
    ),

    chipTheme: ChipThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LxRadius.sm),
      ),
      labelStyle: const TextStyle(
        fontFamily: 'Figtree',
        fontSize: 12,
        fontWeight: FontWeight.w500,
      ),
    ),

    dividerTheme: const DividerThemeData(
      color: LxColors.neutral200,
      thickness: 1,
      space: 0,
    ),

    snackBarTheme: SnackBarThemeData(
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LxRadius.sm),
      ),
    ),

    dialogTheme: DialogThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LxRadius.modal),
      ),
    ),

    bottomSheetTheme: const BottomSheetThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(LxRadius.modal),
        ),
      ),
    ),

    tabBarTheme: const TabBarThemeData(
      labelStyle: TextStyle(
        fontFamily: 'Figtree',
        fontSize: 14,
        fontWeight: FontWeight.w500,
      ),
      unselectedLabelStyle: TextStyle(
        fontFamily: 'Figtree',
        fontSize: 14,
        fontWeight: FontWeight.w400,
      ),
    ),

    navigationBarTheme: NavigationBarThemeData(
      elevation: 0,
      indicatorColor: LxColors.primary100,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return const TextStyle(
            fontFamily: 'Figtree',
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: LxColors.primary700,
          );
        }
        return const TextStyle(
          fontFamily: 'Figtree',
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: LxColors.neutral600,
        );
      }),
    ),
  );

  // ════════════════════════════════════════════════════════════════
  // DARK THEME
  // ════════════════════════════════════════════════════════════════

  static final ThemeData dark = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: LxColorScheme.dark,
    textTheme: LxTypography.textTheme,

    appBarTheme: const AppBarTheme(
      elevation: 0,
      scrolledUnderElevation: 1,
      centerTitle: false,
      titleTextStyle: TextStyle(
        fontFamily: 'Figtree',
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: LxColors.primary200,
      ),
      iconTheme: IconThemeData(color: LxColors.primary200),
    ),

    cardTheme: CardThemeData(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LxRadius.card),
        side: const BorderSide(color: LxColors.primary600),
      ),
      margin: const EdgeInsets.all(LxSpacing.paddingCard),
    ),

    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 0,
        padding: const EdgeInsets.symmetric(
          horizontal: LxSpacing.paddingComponentMdH,
          vertical: LxSpacing.paddingComponentMdV,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LxRadius.btn),
        ),
        textStyle: const TextStyle(
          fontFamily: 'Figtree',
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),

    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        elevation: 0,
        padding: const EdgeInsets.symmetric(
          horizontal: LxSpacing.paddingComponentMdH,
          vertical: LxSpacing.paddingComponentMdV,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LxRadius.btn),
        ),
        textStyle: const TextStyle(
          fontFamily: 'Figtree',
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),

    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        elevation: 0,
        padding: const EdgeInsets.symmetric(
          horizontal: LxSpacing.paddingComponentMdH,
          vertical: LxSpacing.paddingComponentMdV,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LxRadius.btn),
        ),
        side: const BorderSide(color: LxColors.primary600),
        textStyle: const TextStyle(
          fontFamily: 'Figtree',
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),

    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(
          horizontal: LxSpacing.paddingComponentMdH,
          vertical: LxSpacing.paddingComponentMdV,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LxRadius.btn),
        ),
        textStyle: const TextStyle(
          fontFamily: 'Figtree',
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    ),

    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: LxColors.primary950,
      contentPadding: const EdgeInsets.symmetric(
        horizontal: LxSpacing.paddingInputMdH,
        vertical: LxSpacing.paddingInputMdV,
      ),
      border: const OutlineInputBorder(
        borderSide: BorderSide(color: LxColors.primary600),
      ),
      enabledBorder: const OutlineInputBorder(
        borderSide: BorderSide(color: LxColors.primary600),
      ),
      focusedBorder: const OutlineInputBorder(
        borderSide: BorderSide(color: LxColors.primary200, width: 2),
      ),
      errorBorder: const OutlineInputBorder(
        borderSide: BorderSide(color: LxColors.danger300),
      ),
      focusedErrorBorder: const OutlineInputBorder(
        borderSide: BorderSide(color: LxColors.danger300, width: 2),
      ),
      labelStyle: const TextStyle(
        fontFamily: 'Figtree',
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: LxColors.primary300,
      ),
      hintStyle: const TextStyle(
        fontFamily: 'Figtree',
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: LxColors.neutral600,
      ),
    ),

    chipTheme: ChipThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LxRadius.sm),
      ),
      labelStyle: const TextStyle(
        fontFamily: 'Figtree',
        fontSize: 12,
        fontWeight: FontWeight.w500,
      ),
    ),

    dividerTheme: const DividerThemeData(
      color: LxColors.primary600,
      thickness: 1,
      space: 0,
    ),

    snackBarTheme: SnackBarThemeData(
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LxRadius.sm),
      ),
    ),

    dialogTheme: DialogThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LxRadius.modal),
      ),
    ),

    bottomSheetTheme: const BottomSheetThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(LxRadius.modal),
        ),
      ),
    ),

    tabBarTheme: const TabBarThemeData(
      labelStyle: TextStyle(
        fontFamily: 'Figtree',
        fontSize: 14,
        fontWeight: FontWeight.w500,
      ),
      unselectedLabelStyle: TextStyle(
        fontFamily: 'Figtree',
        fontSize: 14,
        fontWeight: FontWeight.w400,
      ),
    ),

    navigationBarTheme: NavigationBarThemeData(
      elevation: 0,
      indicatorColor: LxColors.primary800,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return const TextStyle(
            fontFamily: 'Figtree',
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: LxColors.primary200,
          );
        }
        return const TextStyle(
          fontFamily: 'Figtree',
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: LxColors.neutral600,
        );
      }),
    ),
  );
}
