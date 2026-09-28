# Styles Tokens and Theming

**Ultima revision:** 2026-07-29

## Fuente oficial actual a consolidar

- [DESIGN.md](../../appsweb/angular/src/styles/DESIGN.md)

## Nomenclatura canónica (CTI) — vigente desde FASE 1 del plan de remediación

- Espaciado: `--ds-space-{xs,sm,md,lg,xl,2xl,3xl}` (`--ds-spacing-N` = alias 1 release).
- Tipografía: `--ds-type-{display-lg,display-md,headline-lg,headline-md,title-lg,title-md,body-lg,body-md,body-sm,label-lg,label-md,label-sm}` (`--ds-font-size-*` = alias 1 release).
- Elevación semántica: `--ds-shadow-{1,2,3,4}` (escala `--ds-shadow-xs..2xl` para valores crudos).
- Verificación de contraste en CI: `node scripts/audit-contrast.mjs` (RN-DS-033).

## Reglas

- Los tokens oficiales gobiernan color, tipografia, spacing, radius, elevacion y superficies.
- No introducir hardcodes donde ya exista token equivalente.
- Toda extension de tokens requiere propuesta y aprobacion.

## Dominios de token a preservar

- color
- tipografia
- spacing
- radius
- elevacion
- superficies
- estados
- contraste

## Fuente actual de verdad a consolidar

- [DESIGN.md](../../appsweb/angular/src/styles/DESIGN.md)
- [estandar-hoja-estilos.md](../../appsweb/angular/src/styles/estandar-hoja-estilos.md)

## Impacto si se incumple

- inconsistencia visual
- proliferacion de hardcodes
- dificultad para theming y auditoria

