# Prompt Agente C (Front 3): Refactor Management, Accounting & Admin

Eres el Agente Externo C. Tu misión es migrar los botones legacy EXCLUSIVAMENTE en `management.luxuryapp`, `accounting.luxuryapp` y `admin.luxuryapp`.

## Alcance
Directorios: 
- `appsweb/angular/src/app/modules/management.luxuryapp`
- `appsweb/angular/src/app/modules/accounting.luxuryapp`
- `appsweb/angular/src/app/modules/admin.luxuryapp`

Tags legacy a migrar:
- Tier 1 (Mecánicos): `item`, `add`, `edit`, `download`, `view-pdf`. 
  - Mapea de `<il-button-*>` o `<iw-button-*>` a `<lux-button-web>`. Usa `<lux-button-mobile>` para HTMLs mobile. Limpia los imports antiguos.
- Tier 2 (Destructivos): `delete`, `confirm`, `send-email`.
  - Aplica la arquitectura de Fase 3 documentada en `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md`.
  - El botón moderno YA NO CONFIRMA. Cambia `(confirmed)="X()"` a `(clicked)="X()"`.
  - Inyecta el `ConfirmService` en la clase base (`.ts`) de la vista y llama al popup desde el código TypeScript. 
  - Repara los specs afectados añadiendo `ConfirmService` a los providers.

## Excepciones Críticas
- En `admin.luxuryapp/infrastructure/catalog-component-ui`: **NO TOQUES NADA**. Son ejemplos de catálogo.
- En `management.luxuryapp/.../presentation/mobile`: Preserva los botones como están si ya fueron documentados como deuda técnica (revisa `response copy.md` o la bitácora principal).
- Ignora componentes con `active-desactive` o `tracking`.

## Flujo de Trabajo
- Un commit atómico por módulo. Valida compilación y `npm run audit:ui` rigurosamente.