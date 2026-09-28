# Flutter — Design System (paridad Angular §3 / §5)

## Regla obligatoria
- **PROHIBIDO** importar `material`/`cupertino` directo en componentes de features.
- Consumir todo del paquete **`design_system`** (`package:luxury/design_system`), análogo al catálogo `@ui/*` Angular (§5).
- La frontera se audita igual que `npm run audit:ui`.

## Widgets adaptativos (paridad arquitectura híbrida, CONVENTIONS §1)
- Lógica 100% compartida (services, providers, modelos). Separar solo la UI:
  - Desktop: `AdaptiveDataTable` (virtual scroll, filtros, export).
  - Mobile: `AdaptiveList` (`ListView.builder` + pull-to-refresh + infinite scroll).
- Usar `AdaptiveDialog`, `AdaptiveScaffold` (navigation rail ↔ bottom nav).
- Acciones principales en thumb zone (FAB / bottom bar).

## Theming (equivalente CSS variables, Angular §3)
- Colores/tipografía vía `ThemeData` y extensiones de tema, NUNCA hardcodeados.
- Tooltip nativo en lugar de ayuda permanente.
- Accesibilidad con `Semantics`, foco y navegación por teclado en desktop (equivalente ARIA).

## Wrapper (layout shell de módulo, paridad Angular §6)
- Sufijo `_wrapper`: archivo `admin_wrapper.dart`, clase `AdminWrapper`. Prohibido `wrapper_admin`.
