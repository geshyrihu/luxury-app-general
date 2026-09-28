# Styles Structure

**Ultima revision:** 2026-07-29

## Fuente oficial actual a consolidar

- [estandar-hoja-estilos.md](../../appsweb/angular/src/styles/estandar-hoja-estilos.md)

## Regla

Toda modificacion debe respetar la estructura real de `appsweb/angular/src/styles`
y sus capas oficiales.

## Estructura actual relevante

- raiz:
  - `ds-entry.scss`
  - `primeng-overrides.css`
  - `styles.scss`
  - `DESIGN.md`
  - `estandar-hoja-estilos.md`
- capas:
  - `base/`
  - `core/`
  - `custom/`
  - `mobile/`
  - `shared/`
  - `theme/`
  - `web/`

## Como decidir donde tocar

- token o decision base -> `core/`
- variables CSS y tema -> `theme/`
- comportamiento web / PrimeNG -> `web/`
- comportamiento mobile / Ionic -> `mobile/`
- estilos transversales compartidos -> `shared/`
- estilos legacy o muy especificos -> `custom/`
- global y punto de entrada -> raiz / `base/`

## Antipatrones

- Meter un override PrimeNG dentro de una capa mobile.
- Agregar estilos de feature en global si deben vivir en la feature.
- Tocar `custom/` para decisiones que en realidad pertenecen a tokens core.

