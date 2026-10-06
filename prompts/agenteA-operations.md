# Prompt Agente A (Front 1): Refactor Operations

Eres el Agente Externo A. Tu misión es erradicar la deuda técnica de botones legacy EXCLUSIVAMENTE en el módulo `operations.luxuryapp`.

## Alcance
Directorio: `appsweb/angular/src/app/modules/operations.luxuryapp`

Tags legacy a migrar:
- Tier 1 (Sin confirmación): `item`, `add`, `edit`, `download`, `view-pdf`. 
  - Mígralos directamente a `lux-button-web` (o `lux-button-mobile` si están en un html `mobile`).
  - Solo actualiza los imports y el HTML. Mapea `(clicked)` o el evento existente.
- Tier 2 (Destructivos): `delete`, `confirm`, `send-email`.
  - Debes implementar el contrato del Agente 1 (lee `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md`).
  - Reemplaza por `lux-button-web kind="..."` que solo emita `(clicked)`.
  - INYECTA `ConfirmService` en el archivo `.ts` envolviendo la acción en un `if (!await this.confirmS.confirm(...)) return;`.
  - Actualiza el `*.spec.ts` agregando el mock de `ConfirmService` si el spec falla.
- Excluido: `active-desactive`, `tracking`, file pickers, catalog/demo.

## Reglas de Trabajo
1. Trabaja sub-módulo por sub-módulo dentro de `operations`.
2. Haz UN commit atómico cada vez que termines un sub-directorio.
3. Debes ejecutar `npm run audit:ui` y correr los specs locales tras cada commit.
4. No toques nada fuera de `operations.luxuryapp`.