# Prompt Fase 7 — ConfirmDialog Parte 1: migrar los 10 consumidores de `ConfirmationService`

Último bloqueo estructural de Fase 7: el `<p-confirmdialog>` global en
`app.html` + `ConfirmationService` de PrimeNG. El reemplazo **ya
existe en el repo y ya está en uso en otros 6+ archivos**:
`ConfirmService` (`@ui/buttons/shared/confirm.service`), que usa
SweetAlert2 en web (`Swal.fire(...)`) e Ionic `AlertController` en
móvil — API simple, basada en Promesa:

```ts
async confirm(message: string, header: string = "Confirmar"): Promise<boolean>
```

Investigado (2026-09-16): de los 10 archivos que importan
`ConfirmationService`, **solo 4 la usan de verdad** (llaman
`.confirm()`); los otros 6 la importan/inyectan/registran en
`providers:` pero nunca la invocan — import muerto, igual que los
casos de Paso 3.

## Grupo A — 4 archivos con uso real (migrar la lógica)

### 1. `src/app/modules/human-resources.luxuryapp/time-off/admin-vacaciones-balance/admin-vacaciones-balance.ts`

```diff
-import { ConfirmationService } from "@ui/web/primeng-api/primeng-api";
+import { ConfirmService } from "@ui/buttons/shared/confirm.service";
```
```diff
-  confirmationService = inject(ConfirmationService);
+  confirmS = inject(ConfirmService);
```
```diff
-  onRecalculateAll() {
+  async onRecalculateAll() {
     const customerId: string = this.customerIdS.customerId();
     if (!customerId) return;
 
-    this.confirmationService.confirm({
-      message:
-        "¿Estás seguro de recalcular todos los balances de vacaciones para este cliente? Esta acción corregirá los días totales de cada empleado según su antigüedad actual. Esta acción no se puede deshacer.",
-      header: "Confirmación",
-      icon: "material-symbols-light:warning",
-      accept: () => {
-        this.loading.set(true);
-        this.apiResponseS
-          .onPost<boolean>(
-            Endpoints.HR.VacationBalanceAdmin.recalculateAll(customerId),
-            {},
-          )
-          .then((result) => {
-            this.messageService.add({ ... });
-            // ... resto del cuerpo del accept, sin cambios
-          });
-      },
-    });
+    const ok = await this.confirmS.confirm(
+      "¿Estás seguro de recalcular todos los balances de vacaciones para este cliente? Esta acción corregirá los días totales de cada empleado según su antigüedad actual. Esta acción no se puede deshacer.",
+      "Confirmación",
+    );
+    if (!ok) return;
+
+    this.loading.set(true);
+    this.apiResponseS
+      .onPost<boolean>(
+        Endpoints.HR.VacationBalanceAdmin.recalculateAll(customerId),
+        {},
+      )
+      .then((result) => {
+        // ... el mismo cuerpo que tenía dentro de accept, sin cambios
+      });
   }
```
Quita también `providers: [ConfirmationService]` si estaba en el
`@Component` (verifica), y quita el import de `"@ui/web/primeng-api/primeng-api"`
completo si `ConfirmationService` era lo único que traía de ahí.

### 2. `src/app/modules/legal.luxuryapp/employees-contracts/work-contract/work-contract-list.ts`

```diff
-import { ConfirmationService } from "@ui/web/primeng-api/primeng-api";
+import { ConfirmService } from "@ui/buttons/shared/confirm.service";
```
```diff
-  confirmationService = inject(ConfirmationService);
+  confirmS = inject(ConfirmService);
```
```diff
-  onDelete(id: string): void {
-    this.confirmationService.confirm({
-      message: "¿Está seguro de eliminar este contrato?",
-      accept: () => {
-        this.apiS
-          .onDelete(Endpoints.HR.EmployeeWorkContract.delete(id))
-          .then(() => this.onLoadData());
-      },
-    });
-  }
+  async onDelete(id: string): Promise<void> {
+    const ok = await this.confirmS.confirm("¿Está seguro de eliminar este contrato?");
+    if (!ok) return;
+    this.apiS
+      .onDelete(Endpoints.HR.EmployeeWorkContract.delete(id))
+      .then(() => this.onLoadData());
+  }
```

### 3. `src/app/modules/operations.luxuryapp/inventarios-y-almacn/inventory-engine-system/service-order.ts`

```diff
-import { ConfirmationService } from "@ui/web/primeng-api/primeng-api";
+import { ConfirmService } from "@ui/buttons/shared/confirm.service";
```
```diff
-  confirmationService = inject(ConfirmationService);
+  confirmS = inject(ConfirmService);
```
```diff
-  confirm(event: Event, Id: any) {
-    this.confirmationService.confirm({
-      target: event.target as EventTarget,
-      message: "¿Desea Eliminar este registro?",
-      icon: "material-symbols-light:warning",
-      accept: () => {
-        //confirm action
-        const urlApi = Endpoints.MaintenanceCalendars.delete(Id);
-        this.apiResponseS.onDelete(urlApi).then((result: boolean) => {
-          this.onLoadData();
-        });
-      },
-      reject: () => {
-        //reject action
-      },
-    });
-  }
+  async confirm(Id: any) {
+    const ok = await this.confirmS.confirm("¿Desea Eliminar este registro?");
+    if (!ok) return;
+    const urlApi = Endpoints.MaintenanceCalendars.delete(Id);
+    this.apiResponseS.onDelete(urlApi).then((result: boolean) => {
+      this.onLoadData();
+    });
+  }
```
El parámetro `event: Event` solo se usaba para `target` (posicionamiento
de PrimeNG, no aplica a SweetAlert2) — quítalo de la firma. **Busca el
sitio en la plantilla (`.html`) que llama a `confirm($event, ...)`** y
actualízalo a `confirm(...)` sin el `$event`.

### 4. `src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list.ts`

```diff
-import { ConfirmationService } from "@ui/web/primeng-api/primeng-api";
+import { ConfirmService } from "@ui/buttons/shared/confirm.service";
```
```diff
-  confirmationService = inject(ConfirmationService);
+  confirmS = inject(ConfirmService);
```
```diff
-  async onDelete(id: string) {
-    this.confirmationService.confirm({
-      message: "¿Estás seguro de que quieres eliminar este registro?",
-      header: "Confirmar",
-      icon: "material-symbols-light:warning",
-      accept: async () => {
-        const success = await this.apiResponseS.onDelete(
-          Endpoints.AiKnowledgeBase.delete(id),
-        );
-        if (success) {
-          this.dataSignal.update((currentData) =>
-            currentData.filter((item) => item.id !== id),
-          );
-        }
-      },
-    });
-  }
+  async onDelete(id: string) {
+    const ok = await this.confirmS.confirm(
+      "¿Estás seguro de que quieres eliminar este registro?",
+      "Confirmar",
+    );
+    if (!ok) return;
+    const success = await this.apiResponseS.onDelete(
+      Endpoints.AiKnowledgeBase.delete(id),
+    );
+    if (success) {
+      this.dataSignal.update((currentData) =>
+        currentData.filter((item) => item.id !== id),
+      );
+    }
+  }
```
Quita también `providers: [ConfirmationService, DialogService]` →
deja solo `DialogService` (`ConfirmationService` no debe seguir ahí).

## Grupo B — 6 archivos con import muerto (solo retirar)

Ninguno de estos llama `.confirm()` en ningún lado — verificado con
`grep -c "\.confirm("` → 0 en los 6. Quita el import de
`ConfirmationService` (de `"@ui/web/primeng-api/primeng-api"`), la
línea `confirmationService = inject(ConfirmationService);` si existe,
y `ConfirmationService` del arreglo `providers:` del `@Component` si
existe:

```
src/app/modules/accounting.luxuryapp/general-ledger/accounting-catalog/accounting-catalog.ts
src/app/modules/management.luxuryapp/juntas-comite/presentacion-junta-comite/presentacion-junta-comite-contador.ts
src/app/modules/management.luxuryapp/juntas-comite/presentacion-junta-comite/presentacion-junta-comite.ts
src/app/modules/operations.luxuryapp/field-service/service-order/ordenes-servicio-fotos.ts
src/app/modules/operations.luxuryapp/task-engine/tasks/send-operation-report/send-operation-report-web.ts
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra.ts
```

**Antes de borrar en cada uno, confirma con un grep propio que
`.confirm(` realmente no aparece** — si encuentras un caso real que
esta lista no capturó, detente y migra ese archivo como el Grupo A en
vez de borrarlo sin más.

## Verificación

- `grep -rn "ConfirmationService" src/app/modules --include="*.ts"` →
  **0 resultados** en los 10 archivos (puede seguir habiendo otros
  usos de `MenuItem`/`TreeNode`/`SortEvent` de `primeng/api` en otros
  archivos — esos NO son parte de este prompt, no los toques).
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), revisa el
  log entero con `grep -c ERROR`, no uses `tail`**.
- Capturas reales de los 4 flujos de eliminación del Grupo A (abrir el
  diálogo de confirmación, cancelar, y confirmar de verdad en al menos
  1 de los 4) — debe verse el SweetAlert2 (ícono de pregunta, botones
  "Sí, eliminar"/"Cancelar"), no el dialog de PrimeNG.

## Listo cuando

- 4 archivos del Grupo A migrados a `ConfirmService`, funcionando
  igual (confirmado con captura).
- 6 archivos del Grupo B sin `ConfirmationService`.
- `tsc`/build limpios.
- **No toques todavía** `app.html`/`app.ts`/`app.config.ts` — eso es
  el siguiente prompt (Parte 2), solo después de que este quede 100%
  verificado (0 consumidores reales de `ConfirmationService` en todo
  `src/app/modules`).
