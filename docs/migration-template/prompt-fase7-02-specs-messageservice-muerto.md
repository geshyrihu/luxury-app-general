# Prompt Fase 7 — Paso 2: retirar `MessageService`/`ConfirmationService` de `primeng/api` muertos en 82 specs

Auditoría (2026-09-16) confirmó: **82 archivos `.spec.ts`** importan
`MessageService` (y en 1 caso también `ConfirmationService`) desde
`primeng/api` solo para proveerlo como token de DI en `TestBed` — pero
**el componente bajo prueba nunca lo inyecta** (verificado: ninguno de
los 82 `.ts` reales bajo prueba tiene un import de `primeng/api`). Es
un residuo de cuando la app usaba el `MessageService` real de PrimeNG;
hoy existe `@core/services/message.service.ts` como reemplazo propio y
la app real ya no depende del token de PrimeNG para esto.

Este import **bloquea poder retirar el paquete `primeng` más
adelante** si no se limpia (aunque hoy no rompe nada, porque el
paquete sigue instalado).

## Regla de edición (idéntica en los 82 archivos)

1. Quita la línea de import de `primeng/api`. En 81 archivos es:
   ```ts
   import { MessageService } from "primeng/api";
   ```
   (o con comillas simples `'primeng/api'` — revisa el estilo de cada
   archivo). En **1 archivo** (`google-calendar.spec.ts`) es:
   ```ts
   import { ConfirmationService, MessageService } from "primeng/api";
   ```

2. Dentro del arreglo `providers:` de `TestBed.configureTestingModule`,
   quita la entrada de `MessageService` (y en el caso de
   `google-calendar.spec.ts`, también la de `ConfirmationService` —
   ambas están muertas ahí, confirmado). Formas que vas a encontrar:

   - Forma objeto (la mayoría, 79 archivos):
     ```diff
     -        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
     ```
     3 archivos (`container-dashboard.spec.ts`,
     `dashboard-pending-items.spec.ts`,
     `unified-pending-dashboard.spec.ts`) tienen una variante sin
     `clear`:
     ```diff
     -        { provide: MessageService, useValue: { add: vi.fn() } },
     ```

   - `google-calendar.spec.ts` tiene **2 bloques separados** a quitar
     (formato multilínea):
     ```diff
     -        {
     -          provide: ConfirmationService,
     -          useValue: {
     -            confirm: vi.fn(),
     -          },
     -        },
     -        {
     -          provide: MessageService,
     -          useValue: {
     -            add: vi.fn(),
     -          },
     -        },
     ```

   - `create-orden-compra-wizard.spec.ts` y
     `orden-compra-detalle-form.spec.ts` tienen el token **suelto**
     (sin `useValue`), dentro del arreglo:
     ```diff
     -        MessageService,
     ```

3. No toques nada más del archivo (otros providers, mocks, tests).

## Lista completa de los 82 archivos

```
src/app/modules/accounting.luxuryapp/ar/aspel-customer-empresa/aspel-customer-empresa-form.spec.ts
src/app/modules/accounting.luxuryapp/ar/aspel-customer-empresa/aspel-customer-empresa-list.spec.ts
src/app/modules/accounting.luxuryapp/ar/aspel-sync/aspel-sync.service.spec.ts
src/app/modules/accounting.luxuryapp/ar/aspel-sync/aspel-sync.spec.ts
src/app/modules/accounting.luxuryapp/general-ledger/accounting-accounts/level-three-account-form.spec.ts
src/app/modules/accounting.luxuryapp/general-ledger/accounting-accounts/level-three-account-list.spec.ts
src/app/modules/accounting.luxuryapp/general-ledger/aspel-customer-empresa/aspel-customer-empresa-form.spec.ts
src/app/modules/accounting.luxuryapp/general-ledger/aspel-customer-empresa/aspel-customer-empresa-list.spec.ts
src/app/modules/accounting.luxuryapp/general-ledger/aspel-sync/aspel-sync.service.spec.ts
src/app/modules/accounting.luxuryapp/general-ledger/aspel-sync/aspel-sync.spec.ts
src/app/modules/admin.luxuryapp/admin-wrapper/admin-wrapper.spec.ts
src/app/modules/admin.luxuryapp/analisis-registros/brevo/brevo-email-logs.spec.ts
src/app/modules/admin.luxuryapp/analisis-registros/log-api-report/log-api-report.spec.ts
src/app/modules/admin.luxuryapp/analisis-registros/user-activity-history/user-activity-history.spec.ts
src/app/modules/admin.luxuryapp/configuracion-correo/customer-data-company/customer-data-company-form.spec.ts
src/app/modules/admin.luxuryapp/configuracion-correo/customer-data-company/customer-data-company-list.spec.ts
src/app/modules/admin.luxuryapp/configuracion-correo/email-data/email-data-form.spec.ts
src/app/modules/admin.luxuryapp/configuracion-correo/email-data/email-data-list.spec.ts
src/app/modules/admin.luxuryapp/configuracion-sistema/asamblea-checklist-template/asamblea-checklist-template-form.spec.ts
src/app/modules/admin.luxuryapp/configuracion-sistema/asamblea-checklist-template/asamblea-checklist-template-list.spec.ts
src/app/modules/admin.luxuryapp/herramientas-dev/app-implementation-tracking/app-implementation-tracking-manual.spec.ts
src/app/modules/admin.luxuryapp/herramientas-dev/ia-test/ia-test.component.spec.ts
src/app/modules/admin.luxuryapp/herramientas-dev/ia-test/ia-test.service.spec.ts
src/app/modules/admin.luxuryapp/herramientas-dev/mini-postman/mini-postman.spec.ts
src/app/modules/admin.luxuryapp/herramientas-dev/testsignalr/testsignalr.spec.ts
src/app/modules/admin.luxuryapp/herramientas-dev/update-data-base/update-data-base.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/acceso-customer/access-customer.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/application-role/role-description.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/application-role/role-form.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/application-role/roles-list.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/approval-rules/approval-rules.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/customer-modul/customer-modul-edit.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/customer-modul/customer-modul-list.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/customer/customer-address.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/customer/customer-form.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/customer/customer-images.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/customer/customer-list.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/module-app-rol/module-app-rol-list.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/module-app-rol/module-app-rol-update.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/module-app/module-app-form.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/module-app/module-app-list.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/user-accounts/md-edit-account.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/user-accounts/user-account-form.spec.ts
src/app/modules/admin.luxuryapp/seguridad-permisos/user-accounts/user-account-list.spec.ts
src/app/modules/auth.luxuryapp/password-manager/password-form.spec.ts
src/app/modules/auth.luxuryapp/password-manager/password-list.spec.ts
src/app/modules/human-resources.luxuryapp/recursos-humanos-admin/incident-type-list/incident-type-form.spec.ts
src/app/modules/human-resources.luxuryapp/recursos-humanos-admin/incident-type-list/incident-type-list.spec.ts
src/app/modules/human-resources.luxuryapp/recursos-humanos-admin/sanction-type-list/sanction-type-form.spec.ts
src/app/modules/human-resources.luxuryapp/recursos-humanos-admin/sanction-type-list/sanction-type-list.spec.ts
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/machinery-classification/machinery-classification-form.spec.ts
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/machinery-classification/machinery-classification-list.spec.ts
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/meter-category/meter-category-form.spec.ts
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/meter-category/meter-category-list.spec.ts
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/product-category/product-category-form.spec.ts
src/app/modules/maintenance.luxuryapp/catalogos-tickets-mantenimiento/product-category/product-category-list.spec.ts
src/app/modules/maintenance.luxuryapp/planificacin-de-mantenimiento/calendario-maestro-equipo/calendario-maestro-equipo-form.spec.ts
src/app/modules/maintenance.luxuryapp/planificacin-de-mantenimiento/calendario-maestro-equipo/calendario-maestro-equipo.spec.ts
src/app/modules/operations.luxuryapp/dashboard/container-dashboard.spec.ts
src/app/modules/operations.luxuryapp/dashboard/dashboard-pending-items.spec.ts
src/app/modules/operations.luxuryapp/dashboard/unified-pending-dashboard.spec.ts
src/app/modules/operations.luxuryapp/google-calendar/google-calendar/google-calendar.spec.ts
src/app/modules/operations.luxuryapp/properties/entrega-recepcion/catalogo-descripcion-form.spec.ts
src/app/modules/operations.luxuryapp/properties/entrega-recepcion/entrega-recepcion-cliente-form.spec.ts
src/app/modules/shared.luxuryapp/catalogos-generales/banks/bank-form.spec.ts
src/app/modules/shared.luxuryapp/catalogos-generales/banks/bank-list.spec.ts
src/app/modules/shared.luxuryapp/catalogos-generales/cfdi-use/cfdi-use-form.spec.ts
src/app/modules/shared.luxuryapp/catalogos-generales/cfdi-use/cfdi-use-list.spec.ts
src/app/modules/shared.luxuryapp/catalogos-generales/payment-method/payment-method-form.spec.ts
src/app/modules/shared.luxuryapp/catalogos-generales/payment-method/payment-method-list.spec.ts
src/app/modules/shared.luxuryapp/catalogos-generales/payment-type/payment-type-form.spec.ts
src/app/modules/shared.luxuryapp/catalogos-generales/payment-type/payment-type-list.spec.ts
src/app/modules/shared.luxuryapp/catalogos-generales/units-of-measurement/unit-of-measurement-form.spec.ts
src/app/modules/shared.luxuryapp/catalogos-generales/units-of-measurement/unit-of-measurement-list.spec.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/create-orden-compra-wizard/create-orden-compra-wizard.spec.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra-detalle-form/orden-compra-detalle-form.spec.ts
src/app/modules/system.luxuryapp/configuracion-sistema/eleven-labs/eleven-labs-settings.spec.ts
src/app/modules/system.luxuryapp/configuracion-sistema/juntas-mensuales-backfill/juntas-mensuales-backfill.spec.ts
src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-form.spec.ts
src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list.spec.ts
src/app/modules/system.luxuryapp/configuracion-sistema/vault-secrets/vault-secret-form.spec.ts
src/app/modules/system.luxuryapp/configuracion-sistema/vault-secrets/vault-secrets-list.spec.ts
```

## No tocar

Cualquier otro `.spec.ts` que importe `primeng/api` y **no** esté en
esta lista — no existe ninguno (la lista es exhaustiva, 82/82), pero
si el grep de verificación encuentra alguno fuera de esta lista,
detente y repórtalo en vez de tocarlo.

No toques `src/app/app.config.ts`, `app.ts`, `app.html` — el
`ConfirmationService`/`ConfirmDialog` global de la app real siguen
vigentes y no son parte de este prompt.

## Verificación

- `grep -rn "primeng/api" src/app/modules --include="*.spec.ts"` debe
  devolver **0 resultados** al terminar.
- `npx tsc --noEmit`: compara el conteo de errores antes/después — no
  debe crecer (puede haber errores preexistentes no relacionados, ya
  conocidos, ignóralos si no mencionan estos 82 archivos).
- `vitest run` (o el comando de test del proyecto) sobre al menos 5
  de los 82 archivos (elige variedad: 2 de la forma estándar, el de
  `google-calendar`, los 2 de `purchase-order`, uno de los 3 de
  `dashboard`) — todos deben seguir pasando igual que antes.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`** — aunque los specs
  no entran al build de producción, confírmalo igual por costumbre de
  este flujo.

## Listo cuando

- 82/82 archivos sin `import ... from "primeng/api"`.
- 0 providers de `MessageService`/`ConfirmationService` de PrimeNG
  restantes en esos archivos.
- Tests de la muestra verificada siguen pasando.
- `tsc`/build no empeoraron respecto al estado previo.
