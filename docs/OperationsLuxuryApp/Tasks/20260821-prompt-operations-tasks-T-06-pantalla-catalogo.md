# TICKET T-06 — Pantalla única del catálogo de obligaciones recurrentes

Trabajas en el repositorio LuxuryApp (Angular 22). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`. Lee este prompt completo — cita rutas y patrones exactos del
código existente, verificados; no adivines convenciones.

## Contexto

Hoy capturar una obligación recurrente exige tres pantallas encadenadas
(`templates/task-template-form`, `templates/task-template-item-form`,
`templates/customer-config`), todas apuntando al motor viejo que se retira en T-15 (ancla por
`RoleId`, pide clientes a mano). Este ticket construye la pantalla **nueva**, que consume los
endpoints de T-04 (`api/recurring-task-templates`, ancla por grupo de trabajo). **No modifica ni
elimina las pantallas viejas** — eso es parte de T-15, cuando se retire el motor que las usa.

## Qué construye este ticket

Dos componentes, seleccionados para reemplazar en la práctica al conjunto de tres — pero eso lo
decide el ticket de routing (ver sección final), no este:

1. **Lista** — plantillas del cliente en contexto, con su estado y acción de activar/pausar.
2. **Formulario en diálogo** — alta y edición en **una sola pantalla**, sin el nivel intermedio
   de "ítems" ni la pantalla aparte de "configuración por cliente".

## Endpoints a consumir (ya existen, aprobados en T-04)

| Acción | Backend |
| --- | --- |
| Listar | `GET api/recurring-task-templates/list/{customerId:guid}?workGroupId=&activeOnly=` |
| Obtener uno | `GET api/recurring-task-templates/{id:guid}` |
| Crear | `POST api/recurring-task-templates` |
| Editar | `PUT api/recurring-task-templates/{id:guid}` |
| Activar/pausar | `PATCH api/recurring-task-templates/toggle-status/{id:guid}` |

DTOs (backend, ya aprobados):
`RecurringTaskTemplateAddOrEditDTO` (`Title`, `Description`, `RecurrenceRule`, `Criticality`,
`AdvanceNoticeDays`, `StartDate`, `EndDate`, `WorkGroupId`, `BackupUserId`,
`ExpectedDeliverableName`, `RequiresAttachment`) y `RecurringTaskTemplateDTO` (agrega `Id`,
`CustomerId`, `WorkGroupName`, `Status`).

## Tareas de Frontend

### 1. Endpoints centralizados

Agrega un bloque nuevo en
`client/angular/src/app/core/constants/endpoints/operations.endpoints.ts`, **junto al bloque
`RecurringTasks` existente, sin tocarlo** (ese apunta al motor viejo, se retira en T-15):

```typescript
RecurringTaskCatalog: {
  base: "recurring-task-templates",
  getById: (id: string) => `recurring-task-templates/${id}`,
  list: (customerId: string, workGroupId?: string, activeOnly?: boolean) => {
    const params = new URLSearchParams();
    if (workGroupId) params.set("workGroupId", workGroupId);
    if (activeOnly !== undefined) params.set("activeOnly", String(activeOnly));
    const query = params.toString();
    return `recurring-task-templates/list/${customerId}${query ? `?${query}` : ""}`;
  },
  toggleStatus: (id: string) => `recurring-task-templates/toggle-status/${id}`,
},
```

Ajusta el estilo exacto de construcción de query string al que ya usen otros bloques de este
mismo archivo si difiere del que se sugiere aquí — no inventes un patrón nuevo si ya hay uno
establecido para query params opcionales.

### 2. Interfaz TypeScript

Archivo nuevo:
`client/angular/src/app/core/interfaces/recurring-tasks/recurring-task-template-catalog.interface.ts`

Refleja los dos DTOs del backend. Recuerda que la serialización JSON de ASP.NET Core usa
camelCase (`title`, `recurrenceRule`, `workGroupName`, etc., no `Title`/`RecurrenceRule`) — sigue
el mismo criterio que ya usa `TaskTemplate` en el archivo vecino
(`task-template.interface.ts`).

### 3. Lista

Carpeta nueva:
`client/angular/src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/catalog/recurring-task-catalog-list/`

Usa `task-template-list.ts` (`templates/task-template-list/`) como referencia de convención
exacta — mismos imports (`ApiResponseService`, `TableModule`, botones web/mobile adaptativos,
`DialogHandlerService`), mismo patrón de `signal<T[]>([])` + `onLoadData()`.

Diferencias respecto a la referencia:
- El cliente sale de `customer-id.service.ts` (`this.customerIdS.customerId()`), nunca se pide
  al usuario ni se recibe por parámetro.
- La acción "eliminar" no existe (T-04 no implementa borrado físico). La acción de estado es
  `toggleStatus` vía `apiResponseS.onPatch(...)`, no `onDelete`.
- La columna de responsable/rol de la lista vieja no aplica — muestra en su lugar
  `workGroupName`, `criticality` y `status`.

### 4. Formulario

Carpeta nueva, hermana de la lista:
`.../catalog/recurring-task-catalog-form/`

Sigue el patrón de diálogo de `task-template-form.ts` como referencia exacta: `DynamicDialogRef`
+ `DynamicDialogConfig` inyectados, `FormHelper.submitCrud({ form, api, endpoint:
"recurring-task-templates", id, ref, submitting, transformPayload })` para el guardado — no
escribas la lógica de POST/PUT a mano, ese helper ya decide cuál usar según si `id` está
presente.

**Campos del formulario, en este orden:**

1. **Grupo de trabajo** (`WorkGroupId`, obligatorio). Carga la lista con
   `Endpoints.TaskGroups.list(customerId, true, applicationUserId)` (mismo endpoint y firma que
   ya usa `task-form.ts` en
   `client/angular/src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/task-form.ts:202-206`
   — cópialo). La respuesta trae `nameGroup`, `id`, `visibility` (en español,
   `x.Visibility.GetDisplayName()` del lado backend — el valor de "público" llega como el string
   `"Público"`, con acento, no `"Public"`). **Filtra del lado del cliente cualquier grupo con
   `visibility === "Público"`** antes de mostrarlo en el selector — `RN-ALT-044` prohíbe anclar
   una obligación a un grupo público, y mostrarlo sólo para que el backend lo rechace al guardar
   es mala experiencia.
2. **Título** (`Title`, obligatorio) y **Descripción** (`Description`).
3. **Recurrencia** — usa el componente `app-recurrence-input` (ya ampliado en T-05) para producir
   `RecurrenceRule`. Ya tiene un consumidor real que puedes copiar tal cual:
   `templates/task-template-item-form/task-template-item-form.html:21-24` lo usa dentro de un
   `[formGroup]` con `formControlName="recurrenceRule"`. Usa exactamente ese patrón, no
   `[control]` ni `[formControl]` aislado.
4. **Criticidad** (`Criticality`) — selector con las opciones de `PriorityLevel` (usa el mismo
   patrón `Endpoints.SelectItems.*` + `apiResponseS.onGetSelectItem<SelectItemDto[]>(...)` que ya
   usa `task-template-form.ts` para roles; busca la ruta de select-item para `priority-level` que
   ya se registró en T-02 y T-03, `api/select-items/priority-level`).
5. **Qué se entrega** — `ExpectedDeliverableName` (texto) y `RequiresAttachment` (checkbox,
   `CustomInputCheckSignal`).
6. **Vigencia** — `StartDate` y `EndDate` (opcional), con `custom-input-datepicker-signal`.
7. **Sección avanzada, plegada por defecto** (usa un `<p-panel [toggleable]="true">` o el
   componente colapsable que ya use el catálogo de convenciones de este proyecto — revisa si
   existe uno antes de improvisar):
   - `AdvanceNoticeDays` (número, 0 a 30, valor por omisión 3).
   - `BackupUserId` — selector de usuarios del grupo elegido en el paso 1. Reutiliza
     `Endpoints.Tasks.participants(workGroupId)` (mismo endpoint que ya usa `task-form.ts` en la
     línea 224 para poblar responsables). **Obligatorio sólo si `Criticality` es la opción
     crítica** — valida esto en el formulario (no dejes que el usuario lo omita si marcó
     criticidad alta, aunque el backend también lo valide; el error debe verse antes de enviar).

**No repitas la selección de cliente.** No agregues ningún campo ni selector de `CustomerId` —
sale siempre de `customer-id.service.ts`.

### 5. Conectar lista y formulario

Igual que la referencia: `onLoadData()` en la lista, `showForm(template?)` que abre el diálogo
con `DialogHandlerService.openDialog(RecurringTaskCatalogForm, { template }, título, tamaño)` y
recarga la lista si el diálogo devuelve éxito.

## Lo que NO debes hacer

- No toques `templates/task-template-form`, `templates/task-template-item-form`,
  `templates/customer-config`, `templates/task-template-list`, `templates/task-template-items`,
  ni el bloque `Endpoints.RecurringTasks.Templates` existente — pertenecen al motor viejo, se
  retiran en T-15.
- No modifiques `recurring-tasks.routing.ts` ni `pages.routes.ts` — cablear la navegación de la
  pantalla nueva es una decisión aparte, no de este ticket. Los componentes deben quedar
  completos y funcionales de forma aislada (probables por Storybook o por test), pero no
  necesitan estar enrutados todavía.
- No implementes eliminación física de plantillas.
- No agregues checklist, justificación, ni comprobante — son T-13, no este ticket.
- No toques `recurrence-input.ts`/`.html` más allá de consumirlo como está.
- No toques ningún endpoint ni DTO de backend — ya están aprobados.

## Convenciones aplicables

- `CONVENTIONS.md` — Angular 22, `interfaces/` (nunca `models/`), `ApiResponseService` para
- Reglas críticas 6/7/8 del proyecto: SELECTs centralizados, `DisplayName` en español, tokens de
  diseño — no hardcodees colores, espaciados ni tipografía
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

Desde `client/angular/`. Dado lo aprendido en T-05, **evita el comando `npm test` a secas** —
mezcla un proyecto de Storybook con navegador real y puede no cerrar en tiempo razonable. Aísla
el proyecto de pruebas unitarias de la misma forma que resolviste en T-05, o usa el mecanismo que
ya haya quedado documentado a partir de ese ticket.

```bash
node ../../scripts/scan-mojibake.mjs [rutas de los archivos que tocaste, con el prefijo client/angular/ desde la raíz del repo]
```

Pega la salida literal, con el conteo real de tests corridos (no aceptes "se quedó colgado" como
resultado final — si hace falta una configuración temporal para obtener un resultado cerrado,
créala, córrela, bórrala, y repórtalo, igual que en T-05).

## Criterio de PASO del ticket

- La lista carga plantillas del cliente en contexto sin pedir el cliente al usuario.
- El formulario nunca muestra un grupo con `visibility === "Público"`.
- `BackupUserId` es obligatorio en el formulario cuando la criticidad marcada es la crítica, y no
  lo es en cualquier otro caso.
- Guardar reutiliza `FormHelper.submitCrud`, no lógica de POST/PUT escrita a mano.

## Reporte de finalización

1. Archivos creados, con una línea de qué hace cada uno
2. Salida literal de los comandos de verificación, con el conteo de tests
3. Decisiones que tomaste por tu cuenta y por qué (en particular: cómo integraste
   `recurrence-input` si no había un consumidor previo, y qué componente usaste para la sección
   avanzada plegable)
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
