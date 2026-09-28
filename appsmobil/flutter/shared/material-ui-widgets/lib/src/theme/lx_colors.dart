import 'package:flutter/material.dart';

/// Escalas de color del Design System de LuxuryApp.
///
/// Portadas 1:1 de `appsweb/angular/src/styles/core/_colors.scss`.
/// Cada familia tiene 11 tonos (50→950). No editar manualmente:
/// los valores deben sincronizarse con `_colors.scss` como fuente de verdad.
abstract final class LxColors {
  // ════════════════════════════════════════════════════════════════
  // PRIMARY — Azul Profundo (ancla: #003152)
  // ════════════════════════════════════════════════════════════════
  static const Color primary50 = Color(0xFFF0F6F9);
  static const Color primary100 = Color(0xFFDDEAF4);
  static const Color primary200 = Color(0xFFB6D6EC);
  static const Color primary300 = Color(0xFF80BDE5);
  static const Color primary400 = Color(0xFF37A0E6);
  static const Color primary500 = Color(0xFF097FCE);
  static const Color primary600 = Color(0xFF00568F);
  static const Color primary700 = Color(0xFF003152);
  static const Color primary800 = Color(0xFF00253D);
  static const Color primary900 = Color(0xFF001829);
  static const Color primary950 = Color(0xFF000C14);

  // ════════════════════════════════════════════════════════════════
  // SECONDARY — Neutros fríos
  // ════════════════════════════════════════════════════════════════
  static const Color secondary50 = Color(0xFFF8F9FC);
  static const Color secondary100 = Color(0xFFE8EEF6);
  static const Color secondary200 = Color(0xFFE2E8F0);
  static const Color secondary300 = Color(0xFFC5D0DB);
  static const Color secondary400 = Color(0xFF9AACBB);
  static const Color secondary500 = Color(0xFF75899C);
  static const Color secondary600 = Color(0xFF5A6878);
  static const Color secondary700 = Color(0xFF3B4A59);
  static const Color secondary800 = Color(0xFF1A2634);
  static const Color secondary900 = Color(0xFF0D141C);
  static const Color secondary950 = Color(0xFF060A0F);

  // ════════════════════════════════════════════════════════════════
  // SUCCESS — Esmeralda
  // ════════════════════════════════════════════════════════════════
  static const Color success50 = Color(0xFFF0FCF7);
  static const Color success100 = Color(0xFFE6F7F0);
  static const Color success200 = Color(0xFFBCF0D9);
  static const Color success300 = Color(0xFF8CE3C1);
  static const Color success400 = Color(0xFF53D4A6);
  static const Color success500 = Color(0xFF2ABF8E);
  static const Color success600 = Color(0xFF1E9B6D);
  static const Color success700 = Color(0xFF157A55);
  static const Color success800 = Color(0xFF0D5E3F);
  static const Color success900 = Color(0xFF08402A);
  static const Color success950 = Color(0xFF042417);

  // ════════════════════════════════════════════════════════════════
  // WARNING — Oro
  // ════════════════════════════════════════════════════════════════
  static const Color warning50 = Color(0xFFFDFCF7);
  static const Color warning100 = Color(0xFFFCF3E0);
  static const Color warning200 = Color(0xFFF8E5B6);
  static const Color warning300 = Color(0xFFF3D58A);
  static const Color warning400 = Color(0xFFEFC45D);
  static const Color warning500 = Color(0xFFE8B233);
  static const Color warning600 = Color(0xFFD4A74A);
  static const Color warning700 = Color(0xFFA88132);
  static const Color warning800 = Color(0xFF7A5E15);
  static const Color warning900 = Color(0xFF523C0B);
  static const Color warning950 = Color(0xFF2B1F04);

  // ════════════════════════════════════════════════════════════════
  // DANGER — Carmesí
  // ════════════════════════════════════════════════════════════════
  static const Color danger50 = Color(0xFFFEFAFA);
  static const Color danger100 = Color(0xFFFDE8E8);
  static const Color danger200 = Color(0xFFFAC7C7);
  static const Color danger300 = Color(0xFFF5A3A3);
  static const Color danger400 = Color(0xFFF07A7A);
  static const Color danger500 = Color(0xFFEA5454);
  static const Color danger600 = Color(0xFFD34B4B);
  static const Color danger700 = Color(0xFFA63939);
  static const Color danger800 = Color(0xFF8A1F1F);
  static const Color danger900 = Color(0xFF5C1111);
  static const Color danger950 = Color(0xFF330707);

  // ════════════════════════════════════════════════════════════════
  // INFO — Cian
  // ════════════════════════════════════════════════════════════════
  static const Color info50 = Color(0xFFF4F9FE);
  static const Color info100 = Color(0xFFE8EEF6);
  static const Color info200 = Color(0xFFC2DBF6);
  static const Color info300 = Color(0xFF9BC8F3);
  static const Color info400 = Color(0xFF72B3EF);
  static const Color info500 = Color(0xFF4A90E2);
  static const Color info600 = Color(0xFF3678C2);
  static const Color info700 = Color(0xFF245FA1);
  static const Color info800 = Color(0xFF1B365D);
  static const Color info900 = Color(0xFF0D223F);
  static const Color info950 = Color(0xFF061121);

  // ════════════════════════════════════════════════════════════════
  // HELP — Mismo que Info
  // ════════════════════════════════════════════════════════════════
  static const Color help50 = info50;
  static const Color help100 = info100;
  static const Color help200 = info200;
  static const Color help300 = info300;
  static const Color help400 = info400;
  static const Color help500 = info500;
  static const Color help600 = info600;
  static const Color help700 = info700;
  static const Color help800 = info800;
  static const Color help900 = info900;
  static const Color help950 = info950;

  // ════════════════════════════════════════════════════════════════
  // NEUTRAL — Grises
  // ════════════════════════════════════════════════════════════════
  static const Color neutral0 = Color(0xFFFFFFFF);
  static const Color neutral50 = Color(0xFFF8F9FC);
  static const Color neutral100 = Color(0xFFE8EEF6);
  static const Color neutral200 = Color(0xFFE2E8F0);
  static const Color neutral300 = Color(0xFFC5D0DB);
  static const Color neutral400 = Color(0xFF9AACBB);
  static const Color neutral500 = Color(0xFF75899C);
  static const Color neutral600 = Color(0xFF5A6878);
  static const Color neutral700 = Color(0xFF3B4A59);
  static const Color neutral800 = Color(0xFF1A2634);
  static const Color neutral900 = Color(0xFF0D141C);
  static const Color neutral950 = Color(0xFF060A0F);
  static const Color neutral1000 = Color(0xFF000000);

  // ════════════════════════════════════════════════════════════════
  // CONTRAST — Blanco/Negro
  // ════════════════════════════════════════════════════════════════
  static const Color contrast0 = Color(0xFFFFFFFF);
  static const Color contrast500 = Color(0xFF1A2634);
  static const Color contrast900 = Color(0xFF0D141C);

  // ════════════════════════════════════════════════════════════════
  // ALIAS SEMÁNTICOS (desde _colors.scss)
  // ════════════════════════════════════════════════════════════════

  // Texto
  static const Color textPrimary = neutral800;
  static const Color textSecondary = neutral600;
  static const Color textMuted = neutral400;
  static const Color textInverse = neutral0;
  static const Color textDisabled = neutral300;

  // Fondos
  static const Color bgPage = neutral50;
  static const Color bgSurface = neutral0;
  static const Color bgElevated = neutral0;
  static const Color bgSunken = neutral100;

  // Bordes
  static const Color borderDefault = neutral200;
  static const Color borderStrong = neutral300;
  static const Color borderFocus = primary500;
  static const Color borderError = danger600;
  static const Color borderSuccess = success600;

  // Estados interactivos — Primary
  static const Color primary = primary700;
  static const Color primaryHover = primary800;
  static const Color primaryActive = primary900;
  static const Color primaryLight = primary100;
  static const Color primaryText = neutral0;

  // Estados interactivos — Danger
  static const Color danger = danger600;
  static const Color dangerHover = danger700;
  static const Color dangerActive = danger800;
  static const Color dangerLight = danger50;

  // Estados interactivos — Success
  static const Color success = success600;
  static const Color successHover = success700;
  static const Color successLight = success50;

  // Estados interactivos — Warning
  static const Color warning = warning500;
  static const Color warningHover = warning600;
  static const Color warningLight = warning50;

  // Estados interactivos — Info
  static const Color info = info600;
  static const Color infoHover = info700;
  static const Color infoLight = info50;
}
