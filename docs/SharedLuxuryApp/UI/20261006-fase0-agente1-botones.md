# Prompt para Agente 1 — Censo de botones

Eres auditor Angular senior. Realiza únicamente análisis read-only del sistema de botones para el roadmap del framework UI interno `lux-*` de LuxuryApp.

## Contexto

- Repo Angular: `D:\repos\luxuryapp-api\appsweb\angular`.
- Biblioteca: `src/app/shared/ui/buttons/`.
- Soporte objetivo: Angular web + Ionic, uso interno en monorepo. No diseñes publicación npm.
- Baseline y roadmap: `docs/SharedLuxuryApp/UI/20261006-baseline-framework-lux.md` y `20261006-roadmap-framework-lux-interno.md` en repo padre.
- Estado actual incluye `ButtonWeb` (`lux-button-web`) y `ButtonMobile` (`lux-button-mobile`); verifica en source si existe API adaptativa `lux-button`.

## Scope exclusivo

- `src/app/shared/ui/buttons/**`
- Consumidores de botones bajo `src/app/modules/**`, `src/app/core/**` y `src/app/shared/**`, excluyendo `src/app/shared/ui/**`.
- No audites otras familias UI.

## Trabajo

1. Verifica clases/selectores/exports y API real leyendo implementaciones y bases.
2. Cuenta imports directos de `ButtonWeb` y `ButtonMobile` por módulo y lista usos directos de selectores en templates.
3. Compara contratos web/mobile: `kind`, display mode, presentación, tamaño, disabled/loading, submit/reset, accesibilidad, tooltip y capacidades exclusivas como badge/tracking.
4. Identifica inconsistencias de defaults, tipos y eventos; cita `ruta:línea`.
5. Propón contrato semántico común para posible `<lux-button>` y enumera capacidades que deben seguir siendo específicas de plataforma. No determines implementación sin evidencia.
6. Comprueba tests de comportamiento existentes y señala vacíos concretos.

## Límites

- No editar archivos, no generar scripts, no stagear, no commitear.
- No ejecutar build, codemods ni auditorías que escriban archivos.
- No asumir selector o input por su nombre; seguir import/clase hasta declaración real.

## Entrega

Reporte Markdown breve: conteos/comandos reproducibles; tabla web/mobile; API común vs específica; tests/cobertura; recomendación de contrato; dudas que requieren decisión. Cada hallazgo con evidencia `ruta:línea`.
