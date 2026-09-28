# TICKET T-13e — Panel de checklist y comprobante en el detalle de la tarea

Trabajas en el repositorio LuxuryApp (Angular 22). Antes de escribir código, lee `CONVENTIONS.md`
y `AGENTS.md`. Este ticket consume los endpoints de T-13b (checklist) y T-13d (comprobante),
ambos aprobados, embebiéndolos como un panel dentro de la pantalla de detalle de tarea que ya
existe. No toca backend.

## Contexto — dónde va esto

La pantalla de detalle real (no la de alta/edición) es:
`client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-view.ts` +
`.html` (**no** `task-form.ts`, que es sólo el diálogo de alta/edición). `task-view.ts` ya tiene el
id de la tarea en `this.id` (propiedad plana `string`, no señal), poblado en `ngOnInit()` tanto en
modo diálogo como en modo ruta.

`task-view.html:134-182` contiene el bloque "Actions" (botones Editar/Seguimiento/Programar/Cerrar
Ticket, dentro de `@if (t.seeEditingOptions)`), y en la línea 184 empieza "Timeline" ("Bitacora de
Seguimiento"). Ese bloque de acciones **no está duplicado para mobile** — es contenido compartido;
sólo la barra de acciones inferior de mobile es una versión simplificada aparte. Inserta el panel
nuevo **entre esos dos bloques** (después de la línea 182, antes de la línea 184), como un
componente propio:

```html
<app-task-checklist-panel [tasksId]="t.id" />
```

## Componente nuevo

Carpeta: `client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-checklist-panel/`
(hermana de `task-view.ts`), con `.ts`, `.html`, `.spec.ts`.

Selector `app-task-checklist-panel`, standalone, `changeDetection: ChangeDetectionStrategy.Eager`
(mismo criterio que el resto del módulo). Input con signal: `tasksId = input.required<string>();`.
Al inicializar (`effect` o `ngOnInit` leyendo `this.tasksId()`), carga en paralelo:
- Checklist: `apiResponseS.onGetList(Endpoints.TaskChecklistItems.byTask(this.tasksId()))`
- Comprobantes: `apiResponseS.onGetList(Endpoints.TaskAttachments.byTask(this.tasksId()))`

## Endpoints centralizados nuevos

Archivo: `client/angular/src/app/core/constants/endpoints/operations.endpoints.ts`. Sigue el
estilo exacto de los bloques vecinos `TaskReads`/`TaskFollowUps` (líneas 99-135) — objetos planos,
`byTask`/`base` como convención de nombre, sin inventar un patrón nuevo de query string.

Agrega, junto al bloque `Tasks` existente (después de la línea 98), sin tocar `Tasks`:

```typescript
TaskChecklistItems: {
  byTask: (tasksId: string) => `task-checklist-items/by-task/${tasksId}`,
  base: "task-checklist-items",
  toggleDone: (id: string) => `task-checklist-items/toggle-done/${id}`,
  delete: (id: string) => `task-checklist-items/${id}`,
},
TaskAttachments: {
  byTask: (tasksId: string) => `task-attachments/by-task/${tasksId}`,
  upload: "task-attachments",
  delete: (id: string) => `task-attachments/${id}`,
},
```

## Interfaces TypeScript

Archivo nuevo: `client/angular/src/app/core/interfaces/tasks/task-checklist-item.interface.ts` —
camelCase, reflejando `TaskChecklistItemDTO` del backend: `id`, `tasksId`, `description`, `isDone`,
`doneByUserId`, `doneByUserName`, `doneAt`.

Archivo nuevo: `client/angular/src/app/core/interfaces/tasks/task-attachment.interface.ts` —
reflejando `TaskAttachmentFileDTO`: `id`, `tasksId`, `recurringTemplateId`, `fileName`, `path`,
`mimeType`, `createdAt`, `createdByName`.

## Sección de checklist

- Lista de items: descripción + checkbox de `isDone`. Si `isDone`, muestra en texto secundario
  "Confirmado por {doneByUserName} el {doneAt}" (formatea la fecha con el mismo criterio que ya
  use el resto de la pantalla, revisa `task-view.html` para el pipe/formato de fecha usado ahí).
- Cambiar el checkbox llama `apiResponseS.onPatch(Endpoints.TaskChecklistItems.toggleDone(item.id),
  {})` y actualiza el item en la señal local con la respuesta (no vuelvas a pedir toda la lista si
  no hace falta).
- Fila de alta: un `custom-input-text-signal` o input simple + botón "Agregar" que llama
  `apiResponseS.onPost(Endpoints.TaskChecklistItems.base, { tasksId: this.tasksId(), description })`
  y agrega el resultado a la lista local. Limpia el input al terminar.
- Botón de borrado por item (`iw-button-delete` o el ícono de borrado que ya use el catálogo de
  botones del proyecto) que llama `apiResponseS.onDelete(Endpoints.TaskChecklistItems.delete(item.id))`
  y quita el item de la lista local si tuvo éxito.

## Sección de comprobante

- Lista de adjuntos existentes. Para cada uno:
  - Si `item.mimeType === 'application/pdf'`, usa
    `<iw-button-view-pdf [url]="item.path" [fileName]="item.fileName" />` — cópialo tal cual de
    `client/angular/src/app/apps/operations.luxuryapp/templates/templates-list.html:42` (el patrón
    correcto). **No** copies el binding `[pdf]="..."` que aparece en
    `employee-document-list.html:48` — ese `@Input` no existe en el componente real, es un error
    preexistente en ese archivo que no debes replicar; el input correcto es `fileName`.
  - Si no es PDF (imagen), muestra una miniatura simple: `<a [href]="item.path" target="_blank">
    <img [src]="item.path" [alt]="item.fileName" /></a>` — sin componente de galería, fuera de
    alcance.
  - Botón de borrado por adjunto, mismo criterio que el checklist:
    `apiResponseS.onDelete(Endpoints.TaskAttachments.delete(item.id))`.
- Subida: sigue el patrón exacto de
  `client/angular/src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employee-document-list/employee-document-list.ts`
  método `onFileSelected` (líneas 116-150) y su `.html` (líneas 30-42: `<input type="file"
  #fileInput class="file-input-hidden" ...>` disparado por `(clicked)="fileInput.click()"` de un
  `il-button`). Adapta así:
  - `accept="application/pdf,image/*"` en el `<input type="file">` (no sólo `.pdf`, T-13d acepta
    PDF o imagen).
  - Construye el `FormData` con las claves exactas que espera `TaskAttachmentUploadDTO`:
    `formData.append('TasksId', this.tasksId())` y `formData.append('File', file)` — respeta esa
    capitalización, son los nombres de propiedad del DTO de backend.
  - Usa `apiResponseS.onPostFile<TaskAttachmentInterface>(Endpoints.TaskAttachments.upload,
    formData)` — **no** `FormHelper.submitCrud` (ese es para formularios completos con
    POST/PUT, esto es una subida ad-hoc de un solo archivo, sigue el mismo criterio que
    `employee-document-list.ts`, no el de `task-close.ts`).
  - Si el resultado es válido, agrégalo a la lista local de adjuntos; limpia el `<input>` después
    (`event.target.value = ''`), igual que la referencia.

## Lo que NO debes hacer

- No toques `task-form.ts`, `task-close.ts`, ni ningún otro componente de `task-message/` más
  allá de insertar la línea del nuevo componente en `task-view.html`.
- No agregues validación de "checklist completo"/"comprobante obligatorio" en el frontend — esa
  regla ya la aplica el backend en `CloseTaskAsync` (T-13c); no dupliques la lógica de negocio en
  el cliente, sólo muestra los datos y deja que el botón "Cerrar Ticket" existente siga llamando
  al flujo que ya tiene (`onClosed`/`TaskClose`). Si el cierre falla por checklist/comprobante
  faltante, el mensaje de error que ya devuelve el backend debe mostrarse con el mecanismo de
  errores que ya use `FormHelper.submitCrud`/`ApiResponseService` en esa pantalla — no construyas
  un mecanismo de error nuevo.
- No crees un visor de imágenes propio ni un carrusel — el link/miniatura simple basta.
- No toques ningún endpoint ni DTO de backend.

## Verificación obligatoria

Desde `client/angular/`, usa la config de vitest aislada ya establecida
(`vitest.cobranza-nativa.config.ts`, reutilizada en T-05/T-06) apuntando a los archivos de spec
exactos del componente nuevo — no corras la suite completa sin filtro (cuelga por el proyecto de
Storybook, ya documentado en tickets anteriores).

```bash
node ../../scripts/scan-mojibake.mjs [rutas de los archivos que tocaste, con el prefijo client/angular/ desde la raíz del repo]
```

Pega la salida literal de ambos comandos, con el conteo real de tests.

## Criterio de PASO

- El panel aparece en `task-view.html` entre "Actions" y "Timeline", recibe `tasksId` del `id` de
  la tarea en pantalla.
- Checklist: listar, agregar, alternar hecho/no-hecho, borrar — los 4 funcionan contra los
  endpoints reales de T-13b.
- Comprobante: listar, subir (PDF o imagen), ver (PDF vía `iw-button-view-pdf`, imagen vía
  miniatura), borrar — funcionan contra los endpoints reales de T-13d.
- No se duplica lógica de validación de cierre en el frontend.

## Reporte de finalización

1. Archivos creados/modificados, con una línea de qué hace cada uno
2. Salida literal de los comandos de verificación, con el conteo de tests
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
