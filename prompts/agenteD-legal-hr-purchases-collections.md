# Prompt Agente D (Front 4): Refactor Legal, HR, Purchases & Collections

Eres el Agente Externo D. Tu misión es erradicar la deuda técnica de botones legacy en cuatro submódulos: `legal`, `human-resources`, `purchases` y `collections`.

## Alcance
Directorios en `appsweb/angular/src/app/modules/`:
- `legal.luxuryapp`
- `human-resources.luxuryapp`
- `purchases.luxuryapp`
- `collections.luxuryapp`

Tags legacy a migrar:
- Tier 1 (Swap Directo): `item`, `add`, `edit`, `download`, `view-pdf`. 
  - Elimina los imports viejos (`WebButtonIconItem`, etc.) y usa `ButtonWeb` (o `ButtonMobile`). Cambia los selectores en el HTML a `lux-button-web/mobile`.
- Tier 2 (Requiere Rediseño .ts): `delete`, `confirm`, `send-email`.
  - Revisa `docs/SystemLuxuryApp/Shared/20261005-contrato-fase3-delete-confirm.md`.
  - El `<lux-button-web>` pierde la capacidad de confirmar por sí mismo. Cambia el output a `(clicked)`.
  - En el archivo `.ts`, inyecta `ConfirmService` y envuelve tu llamada REST/backend en `if (await this.confirmS.confirm('...')) { ... }`.
  - Arregla los `*.spec.ts` agregando un mock para `ConfirmService`.

## Reglas
1. Procesa los módulos uno por uno. Haz commit cuando el módulo esté 100% migrado y libre de `<il-button-*>` o `<iw-button-*>`.
2. Corre `npm run audit:ui` y el test suit de tu módulo antes de cada commit.
3. Si el módulo requiere arreglar interfaces compartidas, hazlo con extremo cuidado.
4. No migres `active-desactive` ni `tracking` (eso se maneja en Fase 4 especial).