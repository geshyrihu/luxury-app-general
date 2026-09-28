# Styles Rules

**Ultima revision:** 2026-07-29

## Regla base

`appsweb/angular/src/styles` es una capa global controlada.

## Reglas

- No agregar tokens, estructuras o archivos nuevos sin revisar impacto.
- Si algo no existe, primero se propone y se espera aprobacion.
- Deben respetarse capas, jerarquia de tokens y estilo global oficial.
- Styles tambien forma parte obligatoria de la auditoria.

## Jerarquia obligatoria

1. Fuente de color y decisiones base
   - `core/_colors.scss`
2. Exposicion de variables CSS
   - `theme/_variables.scss`
3. Uso por tema o preset
   - `mypreset.ts`, `ds-entry.scss`, `primeng-overrides.css`, `styles.scss`
4. Capas especializadas
   - `core/`, `web/`, `mobile/`, `base/`, `shared/`, `custom/`, `theme/`

## Reglas de codigo

- Preferir variables CSS y tokens existentes sobre hardcodes.
- No introducir hex, rgba o estilos directos si ya existe token equivalente.
- Mantener separacion entre web y mobile.
- Nuevo codigo DS usa `@use`; legacy se mantiene donde corresponda sin mezclar por descuido.
- Evitar `::ng-deep` en estilos globales.

## Prohibiciones

- No crear overrides arbitrarios fuera de la capa correcta.
- No usar `styles.scss` como lugar por defecto para cualquier cambio visual.
- No tocar tokens globales sin revisar su impacto transversal.

## Referencias

- [styles-structure.md](../styles-structure.md)
- [styles-tokens-theming.md](../styles-tokens-theming.md)


