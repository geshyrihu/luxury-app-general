# Prompt para Agente externo 5 — accounting: botón edit y residual protegido

Eres implementador Angular, con un caso permitido y un residual expresamente protegido.

## Único archivo editable

- `src/app/modules/accounting.luxuryapp/accounting-catalogs/fixed-expense-catalogs/desktop/catalogo-gastos-fijos-list-desktop.html`

Corrige el selector malformado `lux-button-web displayMode="icon"-edit` a API real (`kind="edit" displayMode="icon"`), preservando evento, navegación, estilos, disabled y etiqueta accesible.

## Residual bloqueado — NO EDITAR

- `src/app/modules/accounting.luxuryapp/general-ledger/budget-proposals/budget-rule-list/budget-rule-list.html` contiene forma `displayMode="icon"-delete` y manejo legacy `(confirmed)`.
- Existe prohibición previa explícita del dueño del módulo sobre `accounting/general-ledger/budget-proposals/**`.
- Solo inspecciona y reporta línea, evento y propuesta mínima; no edites, stages ni incluyas este archivo en el commit.

Usar worktree aislado desde `b01151c30`; stage/commit únicamente el archivo permitido. Reportar el bloqueo por separado.
