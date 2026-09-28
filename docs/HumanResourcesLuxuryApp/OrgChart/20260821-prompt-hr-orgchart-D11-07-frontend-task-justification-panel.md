# TICKET D11-07 — Frontend: panel de justificación en el detalle de tarea

Trabajas en el repositorio LuxuryApp (`client/angular`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`.

D11-04 a D11-06 (esquema, servicio, integración con el motor) están aprobados y ya en el backend.
Este ticket es la única pieza que falta para que alguien pueda usar la función: solicitar una
justificación y que el jefe la apruebe o rechace, desde la pantalla de detalle de tarea.

## Precedente a seguir — no inventes un patrón nuevo

`TaskChecklistPanel` (T-13e, ya en producción) resuelve exactamente el mismo problema de forma
para el checklist y los comprobantes: un panel embebido en `task-view.html`, no un diálogo
separado. Sigue ese mismo molde para el panel de justificación — mismo estilo de componente,
mismos nombres de métodos, misma forma de cargar datos en `ngOnInit`. Archivos de referencia,
léelos antes de escribir nada:
- `client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-checklist-panel/task-checklist-panel.ts`
- `client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-checklist-panel/task-checklist-panel.html`
- `client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-checklist-panel/task-checklist-panel.spec.ts`

## Un detalle real del backend que tienes que manejar

`TaskJustificationDTO.State` es el enum `TaskJustificationState` sin convertidor a string — el
backend no tiene `JsonStringEnumConverter` configurado (verifica tú mismo en
`api/LuxuryApp.Api/Program.cs:139-146` si quieres confirmarlo). **Llega como número** (`0` =
Solicitada, `1` = Aprobada, `2` = Rechazada), no como texto — a diferencia de otros campos de
estado de este mismo módulo que sí llegan como string porque su DTO los mapea a mano.

Para mostrar el texto correcto sin hardcodear "Solicitada"/"Aprobada"/"Rechazada" en el frontend
(regla crítica 6 de `CONVENTIONS.md`, SELECT centralizado), consume el catálogo que D11-04 ya
registró: `GET select-item-enum/task-justification-state` (mismo mecanismo que usa
`recurring-task-catalog-form.ts` para `priority-level` — `apiResponseS.onGetEnumSelectItem<...>(Endpoints.SelectItems.taskJustificationState)`, que devuelve `SelectItemDto<number>[]`
con `value`/`label`). Constrúyete un `Map<number, string>` en el panel para traducir `state` a
texto.

Para la **lógica** del componente (no el texto mostrado), define constantes locales en vez de
comparar contra números sueltos:
```ts
const TASK_JUSTIFICATION_STATE = {
  Solicitada: 0,
  Aprobada: 1,
  Rechazada: 2,
} as const;
```
(Es seguro depender del valor ordinal: el enum del backend sólo permite agregar miembros al
final, nunca reordenar — mismo criterio ya documentado para `PriorityLevel`/`Critical`.)

## Archivos a crear

### 1. Interfaz

`client/angular/src/app/core/interfaces/tasks/task-justification.interface.ts`:
```ts
export interface TaskJustificationInterface {
  id: string;
  tasksId: string;
  reason: string;
  requestedByUserId: string;
  requestedByUserName: string | null;
  approvedByUserId: string | null;
  approvedByUserName: string | null;
  state: number;
  requestedAt: string;
  resolvedAt: string | null;
}
```

### 2. Endpoints

`client/angular/src/app/core/constants/endpoints/operations.endpoints.ts`, junto a
`TaskChecklistItems`/`TaskAttachments`:
```ts
TaskJustifications: {
  byTask: (tasksId: string) => `task-justifications/by-task/${tasksId}`,
  request: "task-justifications",
  approve: (id: string) => `task-justifications/${id}/approve`,
  reject: (id: string) => `task-justifications/${id}/reject`,
},
```

`client/angular/src/app/core/constants/endpoints/select-item.endpoints.ts`, junto a
`priorityLevel: "priority-level"` (línea 48):
```ts
taskJustificationState: "task-justification-state",
```

### 3. Componente

Carpeta nueva junto a `task-checklist-panel/`:
`client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-justification-panel/`

`task-justification-panel.ts` — standalone, `ChangeDetectionStrategy.Eager` (igual que
`TaskChecklistPanel`), selector `app-task-justification-panel`:

- **Inputs**: `tasksId = input.required<string>()`, `assigneeId = input.required<string>()` (para
  no volver a pedirle la tarea al backend sólo para saber quién es el responsable — `task-view.ts`
  ya la tiene en `t.assigneeId`, campo real de `TasksViewDTO.cs:53`).
- **Signals**: `justifications = signal<TaskJustificationInterface[]>([])`,
  `stateLabels = signal<Map<number, string>>(new Map())`, `isLoading = signal(true)`,
  `isRequesting = signal(false)`, `newReason = signal("")`.
- **`ngOnInit`**: carga en paralelo (`Promise.all`, mismo patrón que `TaskChecklistPanel`):
  `onGetList<TaskJustificationInterface[]>(Endpoints.TaskJustifications.byTask(this.tasksId()))`
  y `onGetEnumSelectItem<SelectItemDto<number>[]>(Endpoints.SelectItems.taskJustificationState)`;
  con el segundo arma el `Map` de `value` → `label`.
- **`authS = inject(AuthService)`** (`src/app/core/auth/services/auth.service.ts`) para
  `authS.applicationUserId` — es el mismo patrón ya usado en decenas de componentes del repo
  (`task-view.ts:64`, entre otros). **No repliques ninguna lógica de "quién es el jefe" en el
  frontend** — eso vive sólo en el backend (`OrgHierarchy`, D11-05). El cliente sólo necesita
  saber si el usuario actual es el responsable (para ofrecer "Solicitar") o si es el propio
  solicitante (para **no** ofrecerle aprobar/rechazar su propia solicitud, mismo criterio de
  `RN-ALT-004` — el servidor ya lo bloquea con 403, esto es sólo para no mostrarle un botón
  condenado a fallar). A cualquier otro usuario que vea la tarea, muéstrale los botones de
  aprobar/rechazar sobre una justificación `Solicitada` — si no le corresponde, el servidor
  responde 403 y el toast de error ya estándar de `ApiResponseService` se lo dice.
- **`pendingJustification`**: `computed` sobre `justifications()` buscando
  `state === TASK_JUSTIFICATION_STATE.Solicitada`. Sólo puede haber una a la vez (el propio
  backend lo garantiza, D11-05).
- **`onRequestJustification()`**: guarda si `newReason().trim().length < 20` (mismo mínimo que el
  backend, evita el viaje de red al primer error obvio — el backend igual lo revalida, no es la
  única defensa). `onPost<TaskJustificationInterface>(Endpoints.TaskJustifications.request, { tasksId: this.tasksId(), reason: this.newReason().trim() })`;
  si hay resultado, agrégalo a `justifications()` y limpia `newReason`.
- **`onApprove(id: string)` / `onReject(id: string)`**: `onPatch<TaskJustificationInterface>(Endpoints.TaskJustifications.approve(id) | .reject(id), {})`;
  si hay resultado, reemplaza ese elemento en `justifications()` (mismo patrón que
  `onToggleDone` de `TaskChecklistPanel`).
- **`stateLabel(state: number)`**: `this.stateLabels().get(state) ?? "Desconocido"`.

`task-justification-panel.html` — mismo estilo visual que `task-checklist-panel.html`
(`surface-card`, `surface-ground`, `il-button`, sin colores/tamaños hardcodeados, todo vía las
clases utilitarias y tokens que ya usa el resto del módulo):
- Encabezado ("Justificación de vencimiento" o similar) + descripción corta.
- Si `isLoading()`, mensaje de carga (igual que el checklist).
- Historial de justificaciones (`@for (j of justifications(); track j.id)`): motivo, estado
  (`stateLabel(j.state)`), solicitada por `j.requestedByUserName`, y si está resuelta,
  `j.approvedByUserName`/`j.resolvedAt`. Si `j.state === Solicitada` y
  `j.requestedByUserId !== authS.applicationUserId`, muestra botones "Aprobar"/"Rechazar"
  (`il-button`, `severity="danger"` en rechazar, igual convención visual que el resto del
  detalle de tarea).
- Si `assigneeId() === authS.applicationUserId && !pendingJustification()`, un `textarea` +
  botón "Solicitar justificación" (deshabilitado si `newReason().trim().length < 20` o
  `isRequesting()`).
- Si no aplica ninguno de los dos casos anteriores y no hay historial, un mensaje neutro tipo
  "Sin justificaciones para esta tarea." (mismo tono que "Sin items de checklist.").

`task-justification-panel.spec.ts` — mismo patrón de mocks que `task-checklist-panel.spec.ts`
(`apiResponseS` con `vi.fn()` para `onGetList`/`onGetEnumSelectItem`/`onPost`/`onPatch`, más un
mock simple de `AuthService` con `applicationUserId` fijo). Cubre como mínimo:
1. Carga inicial: pinta el historial y traduce `state` al label correcto usando el catálogo
   mockeado.
2. El responsable sin justificación pendiente ve el formulario de solicitud; al enviarlo con un
   motivo válido, llama `onPost` con `tasksId`/`reason` correctos y el nuevo ítem aparece en la
   lista.
3. Motivo de menos de 20 caracteres no dispara la llamada a `onPost`.
4. El responsable **no** ve el formulario si ya hay una justificación `Solicitada` pendiente.
5. Un tercero (no el solicitante) ve los botones de aprobar/rechazar sobre una justificación
   `Solicitada`; al hacer clic en "Aprobar", llama `onPatch` con la ruta de `approve` correcta y
   actualiza el item local con la respuesta.
6. El propio solicitante **no** ve los botones de aprobar/rechazar sobre su propia justificación
   pendiente (verificación de la precaución de `RN-ALT-004` en la interfaz).

### 4. Integración en `task-view`

`client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-view.ts`:
importa `TaskJustificationPanel` y agrégalo a `imports`.

`task-view.html:184`, inmediatamente después de `<app-task-checklist-panel [tasksId]="t.id" />`:
```html
<app-task-justification-panel [tasksId]="t.id" [assigneeId]="t.assigneeId" />
```

## Lo que NO debes hacer

- No implementes ninguna pantalla de "mis justificaciones pendientes de aprobar" ni ningún listado
  global — sigue siendo por tarea, igual que el backend.
- No repliques la resolución de "quién es el jefe" en el frontend (ver arriba) — es exclusivamente
  del backend.
- No agregues notificaciones ni badges en el menú — el hueco de "el jefe no se entera" sigue
  abierto y documentado en el tablero de la orquestación, fuera de este ticket.
- No toques `task-checklist-panel/` ni ningún otro archivo del detalle de tarea salvo
  `task-view.ts`/`task-view.html` para la integración puntual.
- No toques ningún archivo de backend.

## Convenciones aplicables

- `CONVENTIONS.md` §4.2 (Angular 22, signals, componentes standalone), regla crítica 6 (SELECT
  centralizado — aplica aquí para el estado)
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

Antes de correr `vitest`, confirma si necesitas una config aislada — ya ocurrió en T-05/T-06 que
`vitest.config.ts` sin acotar arrastra el proyecto de Storybook y cuelga. Usa rutas de archivo
explícitas o una config aislada existente si hace falta, igual que esos tickets.

```bash
cd client/angular
npx vitest run <ruta exacta de task-justification-panel.spec.ts> [--config <si aplica>]
cd ../..
node scripts/scan-mojibake.mjs client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-justification-panel client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-view.ts client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-view.html client/angular/src/app/core/interfaces/tasks/task-justification.interface.ts client/angular/src/app/core/constants/endpoints/operations.endpoints.ts client/angular/src/app/core/constants/endpoints/select-item.endpoints.ts
```

Pega la salida literal de ambos. Criterio: todos los tests del archivo nuevo pasan, mojibake en
cero sobre lo tocado.

## Reporte de finalización

1. Archivos creados/tocados, con una línea de qué hace cada uno
2. Salida literal de los comandos de verificación
3. Decisiones que tomaste por tu cuenta y por qué
4. Lo que NO hiciste y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances a ningún ticket adicional. Espera la auditoría.
