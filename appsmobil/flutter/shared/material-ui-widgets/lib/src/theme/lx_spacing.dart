/// Tokens de espaciado del Design System de LuxuryApp.
///
/// Portados de `appsweb/angular/src/styles/core/_spacing.scss`.
/// Escala base: 4px. Unidad mínima: 4px.
abstract final class LxSpacing {
  // ════════════════════════════════════════════════════════════════
  // ESCALA BASE (rem → px para Flutter)
  // ════════════════════════════════════════════════════════════════

  /// 0px
  static const double space0 = 0;

  /// 1px
  static const double spacePx = 1;

  /// 2px (0.125rem)
  static const double space0_5 = 2;

  /// 4px (0.25rem) — unidad mínima
  static const double space1 = 4;

  /// 6px (0.375rem)
  static const double space1_5 = 6;

  /// 8px (0.5rem)
  static const double space2 = 8;

  /// 10px (0.625rem)
  static const double space2_5 = 10;

  /// 12px (0.75rem)
  static const double space3 = 12;

  /// 14px (0.875rem)
  static const double space3_5 = 14;

  /// 16px (1rem) — unidad base
  static const double space4 = 16;

  /// 20px (1.25rem)
  static const double space5 = 20;

  /// 24px (1.5rem)
  static const double space6 = 24;

  /// 28px (1.75rem)
  static const double space7 = 28;

  /// 32px (2rem)
  static const double space8 = 32;

  /// 36px (2.25rem)
  static const double space9 = 36;

  /// 40px (2.5rem)
  static const double space10 = 40;

  /// 44px (2.75rem)
  static const double space11 = 44;

  /// 48px (3rem)
  static const double space12 = 48;

  /// 56px (3.5rem)
  static const double space14 = 56;

  /// 64px (4rem)
  static const double space16 = 64;

  /// 80px (5rem)
  static const double space20 = 80;

  /// 96px (6rem)
  static const double space24 = 96;

  /// 128px (8rem)
  static const double space32 = 128;

  /// 160px (10rem)
  static const double space40 = 160;

  /// 192px (12rem)
  static const double space48 = 192;

  // ════════════════════════════════════════════════════════════════
  // ESPACIADO SEMÁNTICO (desde _spacing.scss)
  // ════════════════════════════════════════════════════════════════

  /// Padding de componente — extra small (botón xs)
  static const double paddingComponentXsV = space1;  // 4px
  static const double paddingComponentXsH = space2;  // 8px

  /// Padding de componente — small (botón sm)
  static const double paddingComponentSmV = space1_5; // 6px
  static const double paddingComponentSmH = space3;  // 12px

  /// Padding de componente — medium (botón md, default)
  static const double paddingComponentMdV = space2;  // 8px
  static const double paddingComponentMdH = space4;  // 16px

  /// Padding de componente — large (botón lg)
  static const double paddingComponentLgV = space2_5; // 10px
  static const double paddingComponentLgH = space5;  // 20px

  /// Padding de componente — extra large (botón xl)
  static const double paddingComponentXlV = space3;  // 12px
  static const double paddingComponentXlH = space6;  // 24px

  /// Padding de input — medium
  static const double paddingInputMdV = space2;  // 8px
  static const double paddingInputMdH = space3;  // 12px

  /// Padding de card
  static const double paddingCard = space6;     // 24px
  static const double paddingCardSm = space4;   // 16px
  static const double paddingCardLg = space8;   // 32px

  /// Gap de formulario
  static const double gapFormGroup = space1_5;  // 6px
  static const double gapInline = space2;       // 8px
  static const double gapSection = space6;      // 24px
}
