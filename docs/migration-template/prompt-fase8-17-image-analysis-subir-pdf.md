# Prompt Fase 8 — últimos 2: `image-analysis-dialog` y `custom-input-upload-pdf-signal` (`SubirPdf`)

## 1. `image-analysis-dialog.component.ts` (2 consumidores reales)

Ambos consumidores (`unified-pending-dashboard.ts`,
`my-task-form.ts`) usan `viewChild.required(ImageAnalysisDialogComponent)`
+ `.show()` de forma **imperativa** (no `[(visible)]` desde el
template) — preserva exactamente ese método público, y el output
`(resultAccepted)`.

```
src/app/shared/ui/image-analysis-dialog/image-analysis-dialog.component.ts
```

Usa el mismo patrón de modal Bootstrap nativo ya establecido
(Fase 7/8), el trigger de archivo nativo ya establecido en
`file-upload.ts` (input oculto + botón), y `il-button`/Bootstrap
`.progress` para el resto:

```diff
 import { FormsModule } from "@angular/forms";
 import { MessageService } from "@core/services/message.service";
-import { ButtonModule } from "primeng/button";
-import { DialogModule } from "primeng/dialog";
-import { FileUploadModule } from "primeng/fileupload";
-import { ProgressBarModule } from "primeng/progressbar";
-import { TextareaModule } from "primeng/textarea";
+import { WebButtonLabel } from "@ui/buttons/web-label/button";
 import { TicketAnalysisService } from "@core/services/ticket-analysis.service";
 import { ImageProcessingService } from "@core/services/image-processing.service";
 import { AppIcon } from "@ui/shared/app-icon/app-icon";

 @Component({
   selector: "app-image-analysis-dialog",
-  imports: [
-    FormsModule,
-    ButtonModule,
-    FileUploadModule,
-    DialogModule,
-    ProgressBarModule,
-    TextareaModule,
-    AppIcon,
-  ],
+  imports: [FormsModule, WebButtonLabel, AppIcon],
   template: `
-    <p-dialog
-      header="📸 Diagnóstico Inteligente (Vision)"
-      [(visible)]="visible"
-      [modal]="true"
-      [style]="{ width: '500px' }"
-      [draggable]="false"
-      [resizable]="false"
-    >
-      @if (!analysisResult) {
+    <div class="modal fade" [class.show]="visible" [style.display]="visible ? 'block' : 'none'" tabindex="-1" role="dialog" [attr.aria-hidden]="!visible">
+      <div class="modal-dialog modal-dialog-centered" style="width: 500px; max-width: 96vw;">
+        <div class="modal-content">
+          <div class="modal-header">
+            <h5 class="modal-title">📸 Diagnóstico Inteligente (Vision)</h5>
+            <button type="button" class="btn-close" aria-label="Cerrar" (click)="visible = false"></button>
+          </div>
+          <div class="modal-body">
+      @if (!analysisResult) {
         <div>
           <p class="mb-3">
             Sube una foto del problema (ej. fuga, cable roto) y la IA lo
             analizará automáticamente.
           </p>

-          <p-fileupload
-            mode="basic"
-            chooseLabel="Seleccionar Foto"
-            accept="image/*,.heic,.heif"
-            maxFileSize="20000000"
-            (onSelect)="onFileSelect($event)"
-            [auto]="false"
-          >
-          </p-fileupload>
+          <input #chooseInput type="file" accept="image/*,.heic,.heif" (change)="onFileSelect($event)" hidden />
+          <il-button label="Seleccionar Foto" (clicked)="chooseInput.click()" />

           @if (selectedFile) {
             <div class="mt-3 text-center">
               <img [src]="previewUrl" class="preview-img mb-3" style="max-height: 200px; max-width: 100%; border-radius: 8px;" />

               @if (loading) {
                 <div class="mt-2">
-                  <p-progressbar mode="indeterminate" [style]="{ height: '6px' }"></p-progressbar>
+                  <div class="progress" style="height: 6px;">
+                    <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
+                  </div>
                   <small class="text-muted">Analizando imagen con Gemini Vision...</small>
                 </div>
               }

               @if (!loading) {
-                <button pButton type="button" label="Analizar Ahora" icon="material-symbols-light:bolt" (click)="analyze()" class="p-button-primary w-full mt-2"></button>
+                <il-button label="Analizar Ahora" icon="material-symbols-light:bolt" (clicked)="analyze()" class="w-100 mt-2" />
               }
             </div>
           }
         </div>
       }

       @if (analysisResult) {
         <div class="result-container">
           <div class="text-center mb-3">
             <app-icon [icon]="'material-symbols-light:check-circle'" class="pi text-green-500 text-3xl" />
             <h3 class="m-0">Análisis Completado</h3>
           </div>

-          <textarea pTextarea [rows]="8" class="w-full" [(ngModel)]="analysisResult" readonly></textarea>
+          <textarea class="form-control" [rows]="8" [(ngModel)]="analysisResult" readonly></textarea>

           <div class="d-flex justify-end gap-2 mt-3">
-            <button pButton label="Cerrar" class="p-button-outlined" (click)="visible = false"></button>
-            <button pButton label="Copiar y Usar" icon="material-symbols-light:content-copy" (click)="useResult()"></button>
+            <il-button label="Cerrar" severity="secondary" variant="outline" (clicked)="visible = false" />
+            <il-button label="Copiar y Usar" icon="material-symbols-light:content-copy" (clicked)="useResult()" />
           </div>
         </div>
       }
-    </p-dialog>
+          </div>
+        </div>
+      </div>
+    </div>
+    @if (visible) {
+      <div class="modal-backdrop fade show"></div>
+    }
   `,
   changeDetection: ChangeDetectionStrategy.Eager,
   styles: [`.preview-img { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }`],
 })
 export class ImageAnalysisDialogComponent implements OnDestroy {
   // sin cambios en la clase: show()/reset()/onFileSelect()/analyze()/useResult() siguen igual
 }
```

`onFileSelect(event: any)` sigue recibiendo el evento nativo del
`<input type="file">` (`event.target.files`) — **verifica el cuerpo
actual del método**: como ahora es un `<input>` nativo en vez de
`p-fileupload`, el shape del evento cambia de `event.files` (PrimeNG)
a `event.target.files` (nativo). Ajusta `onFileSelect` para leer
`(event.target as HTMLInputElement).files` en vez de `event.files`.

## 2. `inputs/web/custom-input-upload-pdf-signal.ts` (`SubirPdf`, 1 consumidor real vía `DialogHandlerService`)

Este componente **ya se abre como contenido de un diálogo real**
(`DynamicDialogRef`/`DynamicDialogConfig` de
`@core/services/dialog-handler.service`, el mismo mecanismo Bootstrap
ya establecido) — no necesita su propio `<p-dialog>`. Solo el
`<p-fileupload>` interno (modo completo, con `customUpload`+
`uploadHandler`) necesita reemplazo. En vez de reconstruir drag&drop
desde cero, **reutiliza `AppFileUpload`** (`@ui/web/file-upload/file-upload`,
ya migrado en un prompt anterior) — tiene toda la lógica de
drag&drop/preview/lista ya lista, y expone `onSelect` con los `File[]`
reales.

```
src/app/shared/ui/inputs/web/custom-input-upload-pdf-signal.ts
```
```diff
 import { ApiResponseService } from "@core/http/services/api-response.service";
 import { Component, inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
-import { SharedModule } from "primeng/api";
 import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
-import { FileUploadHandlerEvent, FileUploadModule } from "primeng/fileupload";
+import { FileUpload } from "@ui/web/file-upload/file-upload";
+import { WebButtonLabel } from "@ui/buttons/web-label/button";

 @Component({
   selector: "app-subir-pdf",
-  imports: [FileUploadModule, SharedModule],
+  imports: [FileUpload, WebButtonLabel],
   changeDetection: ChangeDetectionStrategy.Eager,
   template: `
-    <p-fileupload
-      name="files"
-      [customUpload]="true"
-      (uploadHandler)="customUploadHandler($event)"
-      [multiple]="true"
-      accept="application/pdf"
-      cancelLabel="Cancelar"
-      chooseLabel="Seleccionar PDFs"
-      uploadLabel="Cargar PDFs"
-      [maxFileSize]="maxFileSize"
-    >
-      <ng-template #toolbar>
-        <div class="py-3">Cargar o arrastrar PDF</div>
-      </ng-template>
-      <ng-template #content let-files>
-        <div>
-          @for (file of files; track file) {
-            <div>{{ file.name }} - {{ formatFileSize(file.size) }}</div>
-          }
-        </div>
-      </ng-template>
-    </p-fileupload>
+    <div class="p-3">
+      <p class="mb-3">Cargar o arrastrar PDF</p>
+      <app-file-upload
+        accept="application/pdf"
+        [multiple]="true"
+        [maxFileSize]="maxFileSize"
+        [autoUpload]="false"
+        chooseLabel="Seleccionar PDFs"
+        (onSelect)="onFilesSelected($event)"
+      />
+      @if (pendingFiles.length) {
+        <div class="d-flex justify-content-end mt-3">
+          <il-button label="Cargar PDFs" [loading]="uploading" (clicked)="uploadAll()" />
+        </div>
+      }
+    </div>
   `,
 })
 export class SubirPdf implements OnInit {
   ref = inject(DynamicDialogRef);
   config = inject(DynamicDialogConfig);
   apiResponse = inject(ApiResponseService);
   maxFileSize: number = 20000000;
   url: string = "";
   pathUrl: string = "";
+  pendingFiles: File[] = [];
+  uploading = false;

   ngOnInit(): void {
     this.pathUrl = this.config.data.pathUrl;
     this.url = `${this.pathUrl}${this.config.data.serviceOrderId}`;
   }

-  customUploadHandler(event: FileUploadHandlerEvent) {
+  onFilesSelected(event: { files: File[] }): void {
+    this.pendingFiles = event.files;
+  }
+
+  async uploadAll(): Promise<void> {
+    if (!this.pendingFiles.length) return;
+    this.uploading = true;
     const formData = new FormData();
-
-    // Agregar todos los archivos con el nombre "files"
-    for (let file of event.files) {
+    for (const file of this.pendingFiles) {
       formData.append("files", file);
     }
-
-    this.apiResponse.onPostFile(this.url, formData).then((response) => {
-      if (response !== false) {
-        // Notificar éxito y cerrar
-        this.ref.close(true);
-      }
-    });
+    const response = await this.apiResponse.onPostFile(this.url, formData);
+    this.uploading = false;
+    if (response !== false) {
+      this.ref.close(true);
+    }
   }

-  formatFileSize(bytes: number): string {
-    if (bytes === 0) return "0 Bytes";
-    const k = 1024;
-    const sizes = ["Bytes", "KB", "MB", "GB"];
-    const i = Math.floor(Math.log(bytes) / Math.log(k));
-    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
-  }
 }
```
(`formatFileSize` ya no se usa aquí — `AppFileUpload` formatea el
tamaño de cada archivo en su propia lista, bórralo si nada más lo usa
en este archivo)

## Verificación

- `grep -n "primeng" image-analysis-dialog.component.ts custom-input-upload-pdf-signal.ts`
  → 0 resultados en ambos.
- `npx tsc --noEmit`: 0 errores nuevos.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- **Prueba real en navegador**:
  - `image-analysis-dialog`: dispara `.show()` desde
    `unified-pending-dashboard` o `my-task-form` (busca el botón que
    lo abre), sube una foto, confirma que analiza y muestra el
    resultado, que "Copiar y Usar" funciona.
  - `SubirPdf`: dispara el diálogo de subir PDFs (busca dónde se abre
    vía `dialogHandlerS.openDialog(SubirPdf, ...)`), arrastra/selecciona
    PDFs, confirma que aparecen en la lista de `app-file-upload`, y
    que "Cargar PDFs" sube los archivos y cierra el diálogo.

## Listo cuando

- Ambos archivos sin PrimeNG.
- Capturas de los 2 flujos reales probados.
- `tsc`/build limpios.
- Con esto, **`shared/ui` queda en 1 archivo pendiente: `editor`** —
  el último de toda Fase 8.
