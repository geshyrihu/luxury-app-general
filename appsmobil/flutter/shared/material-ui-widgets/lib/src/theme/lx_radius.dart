/// Tokens de border radius del Design System de LuxuryApp.
///
/// Portados de `appsweb/angular/src/styles/core/_borders.scss`.
/// Estándar: 3px para la mayoría de componentes.
abstract final class LxRadius {
  /// 0px — sin radio
  static const double none = 0;

  /// 3px — estándar (botones, inputs, cards, modales)
  static const double xs = 3;

  /// 3px — alias de xs
  static const double sm = 3;

  /// 3px — alias estándar
  static const double md = 3;

  /// 3px — alias
  static const double lg = 3;

  /// 3px — alias
  static const double xl = 3;

  /// 3px — alias
  static const double xxl = 3;

  /// 3px — alias
  static const double xxxl = 3;

  /// 9999px — completamente redondeado (pill, avatar)
  static const double full = 9999;

  // ════════════════════════════════════════════════════════════════
  // RADII POR COMPONENTE (desde _borders.scss CSS vars)
  // ════════════════════════════════════════════════════════════════

  /// Radio por defecto de botones/inputs (3px)
  static const double btn = xs;

  /// Radio por defecto de inputs (3px)
  static const double input = xs;

  /// Radio de tarjetas (3px, en Angular era --ds-radius-card)
  static const double card = md;

  /// Radio de badges (pill)
  static const double badge = full;

  /// Radio de modales (3px, en Angular era --ds-radius-modal)
  static const double modal = md;
}
