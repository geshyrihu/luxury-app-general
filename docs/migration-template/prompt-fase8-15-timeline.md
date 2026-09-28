# Prompt Fase 8 — `timeline.ts`: reescritura (1 consumidor, configuración simple)

Investigado: único consumidor real
(`candidate-stage-timeline.ts`) usa `align="left" layout="vertical"`
— la configuración más simple. Las plantillas de marcador/contenido
**ya son internas del propio componente** (no se proyectan desde
afuera, `TimelineEvent` ya trae todo lo necesario: `icon`/`color`/
`title`/`date`/`description`/`badge`/`badgeColor`) — solo hace falta
reconstruir la línea vertical conectora que `<p-timeline>` proveía.

```
src/app/shared/ui/web/timeline/timeline.ts
```
```diff
-import { TimelineModule } from "primeng/timeline";
 import { AppIcon } from "@ui/shared/app-icon/app-icon";
```
```diff
 @Component({
   selector: "app-timeline",
-
-  imports: [TimelineModule, AppIcon],
+  imports: [AppIcon],
   template: `
-    <p-timeline [value]="events()" [align]="align()" [layout]="layout()">
-      <ng-template #marker let-event>
-        <div class="timeline-marker" [style.background]="event.color || 'var(--ds-primary)'">
-          @if (event.icon) {
-            <app-icon [icon]="event.icon" class="text-sm text-white" />
-          }
-        </div>
-      </ng-template>
-      <ng-template #content let-event>
-        <div class="timeline-card">
-          <div class="timeline-card-header">
-            <strong>{{ event.title }}</strong>
-            @if (event.date) {
-              <span class="timeline-date">{{ event.date }}</span>
-            }
-          </div>
-          @if (event.description) {
-            <p class="timeline-desc">{{ event.description }}</p>
-          }
-          @if (event.badge) {
-            <span class="timeline-badge" [style.background]="event.badgeColor || 'var(--ds-primary-light)'">
-              {{ event.badge }}
-            </span>
-          }
-        </div>
-      </ng-template>
-    </p-timeline>
+    <div class="app-timeline">
+      @for (event of events(); track $index; let last = $last) {
+        <div class="app-timeline-row">
+          <div class="app-timeline-marker-col">
+            <div class="timeline-marker" [style.background]="event.color || 'var(--ds-primary)'">
+              @if (event.icon) {
+                <app-icon [icon]="event.icon" class="text-sm text-white" />
+              }
+            </div>
+            @if (!last) {
+              <div class="app-timeline-connector"></div>
+            }
+          </div>
+          <div class="app-timeline-content-col">
+            <div class="timeline-card">
+              <div class="timeline-card-header">
+                <strong>{{ event.title }}</strong>
+                @if (event.date) {
+                  <span class="timeline-date">{{ event.date }}</span>
+                }
+              </div>
+              @if (event.description) {
+                <p class="timeline-desc">{{ event.description }}</p>
+              }
+              @if (event.badge) {
+                <span class="timeline-badge" [style.background]="event.badgeColor || 'var(--ds-primary-light)'">
+                  {{ event.badge }}
+                </span>
+              }
+            </div>
+          </div>
+        </div>
+      }
+    </div>
   `,
   styles: [
     `
+      .app-timeline { display: flex; flex-direction: column; }
+      .app-timeline-row { display: flex; gap: 1rem; }
+      .app-timeline-marker-col { display: flex; flex-direction: column; align-items: center; }
+      .app-timeline-connector { flex: 1 1 auto; width: 2px; min-height: 0.75rem; background: var(--ds-border, #dee2e6); margin: 0.25rem 0; }
+      .app-timeline-content-col { flex: 1 1 auto; padding-bottom: 1.5rem; }
       .timeline-marker {
         width: 32px;
         height: 32px;
         border-radius: 50%;
         display: flex;
         align-items: center;
         justify-content: center;
         color: var(--ds-on-primary);
         border: 2px solid var(--ds-bg-surface);
         box-shadow: 0 0 0 2px var(--ds-border);
       }
       /* ... resto de .timeline-card/.timeline-card-header/.timeline-date/.timeline-desc/.timeline-badge sin cambios ... */
-      .p-timeline-event-opposite {
-        display: none;
-      }
-      app-timeline .p-timeline-event {
-        padding-bottom: 1.5rem;
-      }
     `,
   ],
   changeDetection: ChangeDetectionStrategy.OnPush,
   encapsulation: ViewEncapsulation.None,
 })
 export class Timeline extends TimelineBase {}
```

**Limitación aceptada**: solo se construyó para `align="left"` +
`layout="vertical"` (lo único que usa el consumidor real). Si en el
futuro se necesita `align="right"/"alternate"/"top"/"bottom"` o
`layout="horizontal"`, hay que ampliar el template — no lo
sobre-construyas ahora para casos que nadie usa.

## Verificación

- `grep -n "primeng" timeline.ts` → 0 resultados.
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en navegador**: busca dónde se usa
  `candidate-stage-timeline` (historial de etapas de un candidato en
  reclutamiento) y confirma que la línea vertical conecta los
  marcadores correctamente, sin salto raro en el último evento.

## Listo cuando

- `timeline.ts` sin PrimeNG.
- Captura del timeline real funcionando.
- `tsc`/build limpios.
- Con esto, el conteo de `primeng/*` directo en `shared/ui` baja de 5
  a 4 (quedan: `tree`, `image-analysis-dialog`,
  `custom-input-upload-pdf-signal`, `editor`).
