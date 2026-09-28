# Prompt Fase 7 — ConfirmDialog Parte 2: retirar el `<p-confirmdialog>` global

**Solo ejecuta este prompt después de que `prompt-fase7-confirmdialog-01-migrar-consumidores.md`
esté 100% verificado** (`grep -rn "ConfirmationService" src/app/modules --include="*.ts"`
debe dar 0 resultados). Si todavía hay consumidores reales, detente —
retirar el `ConfirmDialog` global antes de eso rompería esos flujos.

## 1. `src/app/app.html`

```diff
-<!-- app.ts -->
-<p-confirmdialog [style]="{ width: '500px' }" [baseZIndex]="10000" />
-
 <main id="app-root-outlet" role="main">
```

## 2. `src/app/app.ts`

```diff
-import { ConfirmDialogModule } from "primeng/confirmdialog";
```
Quita también `ConfirmDialogModule` del arreglo `imports:` del
`@Component`.

## 3. `src/app/app.config.ts`

```diff
-import {
-  ConfirmationService,
-  MessageService as PrimeMessageService,
-} from "primeng/api";
+import { MessageService as PrimeMessageService } from "primeng/api";
```
(deja el import de `PrimeMessageService` intacto — sigue en uso para
el alias `{ provide: PrimeMessageService, useExisting: MessageService }`,
no es parte de este retiro)

```diff
     MessageService,
     { provide: PrimeMessageService, useExisting: MessageService },
-    ConfirmationService,
     DatePipe,
```

## Verificación

- `grep -rn "ConfirmDialog\|ConfirmationService" src/app/app.html src/app/app.ts src/app/app.config.ts`
  → 0 resultados.
- `npx tsc --noEmit`: 0 errores.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
- Prueba real en la app: dispara al menos 1 de los 4 flujos de
  confirmación migrados en la Parte 1 (ej. eliminar un contrato en
  `work-contract-list`) — debe abrir SweetAlert2 y funcionar
  normalmente, sin ningún rastro visual o de consola del
  `ConfirmDialog` de PrimeNG.

## Listo cuando

- `<p-confirmdialog>` fuera de `app.html`.
- `ConfirmDialogModule` fuera de `app.ts`.
- `ConfirmationService` fuera de `app.config.ts`.
- `tsc`/build limpios, prueba real confirmada.
- **Con esto se cierra el último bloqueo estructural de Fase 7** —
  queda pendiente solo el retiro final del paquete `primeng` en sí
  (ver `04-bitacora-cambios.md` para el checklist completo: `package.json`,
  `angular.json` presupuesto de bundle, `conventions/CONVENTIONS.md`
  resto de reglas, `conventions/ui/*`/`conventions/styles/*`,
  `_prime-*.scss`, y los ~35 wrappers `primeng-*` que seguían
  envolviendo componentes reales — verificar de nuevo su conteo de
  consumidores en ese momento, puede haber bajado con esta limpieza).
