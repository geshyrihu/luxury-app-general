# Prompt para Agente externo 6 — shared UI y auditoría residual read-only

Este encargo separa un arreglo permitido en `shared/ui` de una auditoría residual global. No invadas los scopes de Agentes 1–5.

## Scope completo: solo lectura

- `src/app/shared/ui/inputs/web/input-file/input-file.ts`: botón malformado y `(confirmed)`; requiere especial control porque shared UI y confirmación.
- `src/app/shared/ui/buttons/mobile/button.ts`: comprobar `ion-spinner` de loading; QA halló `aria-progressbar-name` en demo. No cambiar API compartida en este lote.
- `src/app/shared/ui/mobile/action-menu-mobile/action-menu-mobile.ts`: comprobar icono decorativo asociado a `role-img-alt`; no modificar.
- `src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/catalog-web-item/catalog-web-item.ts`: no tocar, hay cambios locales concurrentes.
- `src/app/modules/admin.luxuryapp/admin-hub/conventions-viewer/conventions-viewer.service.ts`: distinguir markup de código/string didáctica de template runtime.
- `src/app/modules/accounting.luxuryapp/general-ledger/budget-proposals/**`: prohibición explícita; ni editar ni incluir en stage.

## Auditoría residual

Buscar `displayMode="icon"-<suffix>` en `src/app` y clasificar cada hallazgo como template runtime, inline template, string de documentación/demo o test. Excluir/flaggear `budget-proposals/**` (prohibición vigente). Entregar rutas, clase propietaria y conteo exacto antes/después. No usar sustituciones globales.

No editar ningún archivo. Para `input-file.ts`, proponer mapeo que mantenga confirmación y esperar aprobación del dueño de shared UI. Reportar hallazgos y posibles scopes de una fase posterior.
