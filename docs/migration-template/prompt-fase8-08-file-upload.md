# Prompt Fase 8 — `file-upload.ts`: últimos 4 fragmentos PrimeNG (10 consumidores reales)

Investigado a fondo: toda la lógica real (drag&drop nativo,
`prepareFiles`, `addFiles`, procesamiento de imágenes, estado de cada
archivo) **ya es 100% nativa**, sin PrimeNG. Solo quedan 4 piezas de
UI usando PrimeNG:

```
src/app/shared/ui/web/file-upload/file-upload.ts
```

## 1. Botón "seleccionar archivos" (`<p-fileupload mode="basic">`)

En la práctica solo actúa como un botón + input de archivo oculto —
exactamente el mismo patrón que ya usan `cameraInput`/`galleryInput`
en este mismo archivo. Reemplázalo con el mismo patrón:

```diff
-        <p-fileupload
-          #fileUpload
-          mode="basic"
-          [chooseLabel]="chooseLabel()"
-          [accept]="accept()"
-          [maxFileSize]="sourceMaxFileSize()"
-          [multiple]="multiple()"
-          [auto]="true"
-          styleClass="w-full"
-          chooseStyleClass="w-full justify-content-center"
-          (onSelect)="onFilesSelected($event)"
-        />
+        <input
+          #chooseInput
+          type="file"
+          [accept]="accept()"
+          [multiple]="multiple()"
+          (change)="onNativeInput($event)"
+          hidden
+        />
+        <il-button
+          [label]="chooseLabel()"
+          class="w-100"
+          (clicked)="chooseInput().nativeElement.click()"
+        />
```
Agrega el `viewChild` correspondiente junto a `cameraInput`/
`galleryInput`:
```diff
+  chooseInput = viewChild.required<ElementRef<HTMLInputElement>>("chooseInput");
```
`onNativeInput` ya existe y hace exactamente lo mismo que hacía
`onFilesSelected` (procesa archivos, los agrega, emite `onSelect`, y
dispara `upload` si `autoUpload()` es `true`) — puedes **borrar el
método `onFilesSelected` por completo**, nada más lo llama.

## 2. Botones móviles "Tomar foto" / "Galería"

```diff
-            <p-button
-              [label]="'Tomar foto'"
-              severity="secondary"
-              styleClass="w-full justify-content-center"
-              (onClick)="cameraInput().nativeElement.click()"
-            >
-              <ng-template #icon>
-                <app-icon icon="material-symbols-light:photo-camera" />
-              </ng-template>
-            </p-button>
+            <il-button
+              label="Tomar foto"
+              severity="secondary"
+              icon="material-symbols-light:photo-camera"
+              class="w-100"
+              (clicked)="cameraInput().nativeElement.click()"
+            />
```
```diff
-            <p-button
-              [label]="'Galería'"
-              severity="secondary"
-              styleClass="w-full justify-content-center"
-              (onClick)="galleryInput().nativeElement.click()"
-            >
-              <ng-template #icon>
-                <app-icon icon="material-symbols-light:photo" />
-              </ng-template>
-            </p-button>
+            <il-button
+              label="Galería"
+              severity="secondary"
+              icon="material-symbols-light:photo"
+              class="w-100"
+              (clicked)="galleryInput().nativeElement.click()"
+            />
```

## 3. Botón de eliminar archivo (icono redondo)

```diff
-                <p-button
-                  [rounded]="true"
-                  [text]="true"
-                  severity="danger"
-                  size="small"
-                  (onClick)="removeFile(file)"
-                >
-                  <app-icon icon="material-symbols-light:close" class="text-lg" />
-                </p-button>
+                <iw-button
+                  iconClass="material-symbols-light:close"
+                  [rounded]="true"
+                  [text]="true"
+                  severity="danger"
+                  size="small"
+                  (clicked)="removeFile(file)"
+                />
```

## 4. Barra de progreso

```diff
-                @if (file.status === "uploading") {
-                  <p-progressbar [value]="file.progress" styleClass="h-1" />
-                }
+                @if (file.status === "uploading") {
+                  <div class="progress" style="height: 4px;">
+                    <div
+                      class="progress-bar"
+                      role="progressbar"
+                      [style.width.%]="file.progress"
+                      [attr.aria-valuenow]="file.progress"
+                      aria-valuemin="0"
+                      aria-valuemax="100"
+                    ></div>
+                  </div>
+                }
```

## Imports

```diff
-import { ButtonModule } from "primeng/button";
-import { FileUploadHandlerEvent, FileUploadModule } from "primeng/fileupload";
-import { ProgressBarModule } from "primeng/progressbar";
+import { WebButtonLabel } from "@ui/buttons/web-label/button";
+import { WebButtonIcon } from "@ui/buttons/web-icon/button";
```
```diff
-  imports: [ButtonModule, ProgressBarModule, FileUploadModule, AppIcon],
+  imports: [WebButtonLabel, WebButtonIcon, AppIcon],
```
(`WebButtonLabel` = `il-button`, `WebButtonIcon` = `iw-button` —
confirma el import path exacto abriendo cualquier otro archivo ya
migrado que los use, ej. `empty-state.ts` del prompt anterior)

`FileUploadHandlerEvent` (tipo de `primeng/fileupload`) se usaba en
`upload = output<FileUploadHandlerEvent>()`. **0 consumidores reales
escuchan `(upload)`** (verificado), así que define un tipo local
mínimo en el mismo archivo en vez de importar el de PrimeNG:
```diff
+export interface FileUploadEvent {
+  originalEvent: Event;
+  files: File[];
+}
```
```diff
-  upload = output<FileUploadHandlerEvent>();
+  upload = output<FileUploadEvent>();
```
Ajusta también `onSelect = output<any>();` si quieres tiparlo mejor
con el mismo tipo (opcional, no bloqueante).

## No tocar

`create-orden-compra-wizard.html` (consumidor real) usa props que
**ya no existen** en `FileUpload` desde antes de este prompt (`name`,
`showUploadButton`, `showCancelButton`, `auto`,
`invalidFileSizeMessageSummary/Detail`, `(onRemove)`, `(onClear)`,
`<ng-template #content>`) — Angular los ignora en silencio
(`strictTemplates: false`), es drift preexistente sin relación con
PrimeNG, no lo arregles en este prompt.

## Verificación

- `grep -n "primeng" file-upload.ts` → 0 resultados.
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en navegador**, en al menos 2 consumidores distintos
  (`candidate-cv-upload.html` — solo PDF, sin múltiple; y
  `candidate-photo-upload.html` o algún form de tarea con adjuntos) —
  confirma: arrastrar y soltar un archivo funciona, el botón
  "Seleccionar archivos" abre el picker nativo, la lista de archivos
  se ve con su preview/ícono, y el botón de eliminar (x) quita el
  archivo de la lista.

## Listo cuando

- `file-upload.ts` sin ningún import de PrimeNG.
- Capturas de al menos 2 consumidores reales probados.
- `tsc`/build limpios.
- Con esto, el conteo de `primeng/*` directo en `shared/ui` baja de 19
  a 18.
