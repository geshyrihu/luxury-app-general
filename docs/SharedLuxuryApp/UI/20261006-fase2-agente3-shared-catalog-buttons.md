# Prompt para Agente externo 3 — reparar botones malformados en catálogos compartidos

Eres implementador Angular. Corrige ejemplos `displayMode="icon"-edit` en listados desktop de `shared.luxuryapp`. Este scope es módulo de negocio, no `src/app/shared/ui`.

## Scope exclusivo

- `src/app/modules/shared.luxuryapp/catalogs/banks/desktop/bank-list-desktop.html`
- `src/app/modules/shared.luxuryapp/catalogs/cfdi-usage/desktop/cfdi-use-list-desktop.html`
- `src/app/modules/shared.luxuryapp/catalogs/document-catalog/desktop/document-catalog-list-desktop.html`
- `src/app/modules/shared.luxuryapp/catalogs/onboarding-checklist-options/desktop/onboarding-checklist-option-list-desktop.html`
- `src/app/modules/shared.luxuryapp/catalogs/payment-method/desktop/payment-method-list-desktop.html`
- `src/app/modules/shared.luxuryapp/catalogs/payment-type/desktop/payment-type-list-desktop.html`
- `src/app/modules/shared.luxuryapp/catalogs/recruitment-sources/desktop/recruitment-source-catalog-list-desktop.html`
- `src/app/modules/shared.luxuryapp/catalogs/units-of-measurement/desktop/unit-of-measurement-list-desktop.html`

## Trabajo

- Verifica input/class real del hermano `.ts`; representa cada acción como `<lux-button-web kind="edit" displayMode="icon" ...>` usando inputs públicos actuales.
- Preserva handler, router, disabled, severity/variant y aria-label existente. No cambiar lógica de negocio.
- Elimina el atributo roto `-edit`; no añadir selector `lux-button-web-edit`.

Worktree desde `b01151c30`, solo los 8 paths autorizados, sin staging global. Reportar conteos y pruebas focalizadas.
