# Prompt Agente B (Front 2): Refactor Recruitment & Maintenance

Eres el Agente Externo B. Tu misión es erradicar la deuda técnica de botones legacy EXCLUSIVAMENTE en los módulos `recruitment.luxuryapp` y `maintenance.luxuryapp`.

## Alcance
Directorios: 
- `appsweb/angular/src/app/modules/recruitment.luxuryapp`
- `appsweb/angular/src/app/modules/maintenance.luxuryapp`

Tags legacy a migrar:
- Tier 1 (Sin confirmación): `item`, `add`, `edit`, `download`, `view-pdf`. 
  - Mígralos directamente a `lux-button-web` (o `lux-button-mobile` si están en un html `mobile`).
  - Solo actualiza los imports y el HTML. Mapea `(clicked)` o el evento existente.
- Tier 2 (Destructivos): `delete`, `confirm`, `send-email`.
  - Debes implementar el contrato de confirmación centralizada (lee `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md`).
  - Reemplaza por `lux-button-web kind="..."` que solo emita `(clicked)`.
  - INYECTA `ConfirmService` en el archivo `.ts` del componente. La confirmación ahora ocurre en el `.ts`, no en el HTML.
  - Actualiza las pruebas unitarias (`*.spec.ts`) mockeando `ConfirmService`.
- Excluido: `active-desactive`, `tracking`, file pickers.

## Reglas de Trabajo
1. Finaliza completamente un módulo antes de pasar al otro.
2. Haz commits atómicos separados (`refactor(recruitment): ...` y `refactor(maintenance): ...`).
3. Obligatorio verificar con `npm run audit:ui` y asegurar que no hay regresiones en la compilación local de tus módulos.