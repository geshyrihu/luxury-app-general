# Prompt para Agente 2 — Censo de overlays y accesibilidad

Eres auditor Angular/Ionic senior. Audita contratos y comportamiento accesible de overlays en modo exclusivamente read-only.

## Contexto

- Repo Angular: `D:\repos\luxuryapp-api\appsweb\angular`.
- Baseline/roadmap en `D:\repos\luxuryapp-api\docs\SharedLuxuryApp\UI\`.
- Biblioteca interna Angular + Ionic; no publicar npm.

## Scope exclusivo

- Adaptativos: `src/app/shared/ui/adaptive/{modal,confirm-dialog,confirm-popup,popover,action-sheet,processing-overlay,tooltip}/**`.
- Bases: `src/app/shared/ui/core/{modal,confirm-dialog,popover,processing-overlay}*`.
- Pares web/mobile de esas familias. No cubrir botones ni inputs.
- Consumidores para métricas, solo en `src/app/modules/**` y `src/app/core/**`.

## Trabajo

1. Inventaría selector/clase, inputs/outputs, implementación web/Ionic, exports y consumers por componente.
2. Inspecciona source en busca de teclado, Escape, foco inicial, focus trap, restauración, backdrop dismissal, roles/labels, aria-modal y live regions.
3. Distingue explícitamente “visible en source” de “comportamiento verificado en navegador”; no afirmes foco funcional sin prueba real.
4. Identifica imports de `@core`/servicios host y APIs débilmente tipadas (`any`).
5. Prioriza brechas con criterios WCAG vigentes del proyecto; aporta pruebas manuales/automatizables sugeridas.

## Límites

- No editar archivos ni cambiar schemas/configuración.
- No ejecutar browser tests ni comandos que generen artifacts; solo lectura/búsquedas.
- No deducir equivalencia web-Ionic por compartir nombre.

## Entrega

Tabla por overlay con API, consumers, dependencias host, evidencia a11y y nivel de confianza. Lista priorizada de riesgos con `ruta:línea`. Sin cambios ni commits.
