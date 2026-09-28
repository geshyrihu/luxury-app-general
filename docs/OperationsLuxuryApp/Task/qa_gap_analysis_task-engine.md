# QA Gap Analysis - Task Engine

**Fecha:** 2026-09-16  
**Alcance:** `appsweb/angular/src/app/modules/operations.luxuryapp/task-engine`  
**Tipo:** auditoria de visibilidad frontend y flujo punta a punta  
**Estado:** hallazgos documentados; no se aplican parches en esta auditoria.

## Resumen ejecutivo

La funcionalidad nueva no es visible en todos los flujos porque fue integrada
solo en `TaskForm` y solo cuando existe `id`. Los usuarios que editan desde
`MyTaskForm` no ven responsables multiples ni galeria adicional. `TaskView`,
que es vista de detalle, tampoco muestra responsables multiples ni imagenes
adicionales. Las evidencias solo son visibles dentro del dialogo
`TaskFollowup`, no en el detalle de tarea.

## Matriz de cobertura por componente

| Componente | Entrada | Responsables multiples | Galeria adicional | Evidencia seguimiento | Observacion |
|---|---|---:|---:|---:|---|
| `tasks/task-message/task-form` | Crear/editar desde listado y dashboard | Editar: si | Editar: si | Abre dialogo | Paneles nuevos estan condicionados a `id !== ""`. |
| `tasks/my-tasks/my-task-form` | Crear/editar desde Mis tareas | No | No | No | Conserva solo `AssigneeId`, BeforeWork y AfterWork. |
| `tasks/task-message/task-view` | Detalle desktop/mobile | No | No | Solo texto | Renderiza `t.assignee`, BeforeWork y AfterWork legacy. |
| `tasks/task-follow-up/task-followup` | Dialogo de seguimientos | No aplica | No aplica | Si | Lista, upload, delete y reorder por follow-up. |
| `tasks/task-program` | Programacion | No | No | No | Usa asignacion simple para programacion; no es panel de responsables. |
| `tasks/task-close` | Cierre | No | No | No | Solo lectura/carga de BeforeWork y AfterWork. |
| `tasks/task-message/task-list` | Listado desktop | Filtro simple | No | Abre dialogo | Tabla muestra un responsable legacy. |
| `tasks/my-tasks/my-assigned-tasks-list` | Mis tareas asignadas | Abre `TaskForm` en una ruta y `MyTaskForm` en otra | Depende del dialogo | Abre dialogo | `onModalAdd` abre `MyTaskForm`, sin funcionalidad nueva. |
| `tasks/my-tasks/my-requests-task` | Mis solicitudes | Igual que anterior | Igual que anterior | Abre dialogo | Puede ocultar funcionalidad según acción seleccionada. |
| `tasks/task-message/task-report` | Reporte | No | No | No | Consumidor de datos; no editor de evidencia. |
| `tasks/task-message/task-pending-board` | Tablero | No | No | No | No tiene navegación visual a galeria/responsables. |
| `tasks/reports/*` | Reportes | No | No | Abre dialogo según reporte | No renderizan colección de imágenes. |
| `recurring-tasks/*` | Tareas recurrentes | No | No | No | Flujo separado; no consume contratos nuevos. |

## Hallazgos

| Proceso / Entidad | Vulnerabilidad Encontrada | Causa Raiz | Solucion Propuesta (Codigo/Patron) |
|---|---|---|---|
| Edicion desde `MyAssignedTasksList` | Usuario puede abrir `MyTaskForm` y no encuentra responsables multiples ni galeria. | `onModalAdd` usa `MyTaskForm`; nuevos paneles solo existen en `TaskForm`. | Unificar edicion en `TaskForm` o integrar mismos paneles en `MyTaskForm`. Preferido: un solo formulario canonico. |
| Edicion desde `MyRequestsTask` | Mismo comportamiento inconsistente según boton/accion. | `onModalForm` y `onModalAdd` abren formularios distintos. | Definir matriz de permisos y abrir formulario canonico con modo lectura/edicion explícito. |
| Detalle `TaskView` desktop | No se ven responsables multiples ni galeria adicional. | Template solo imprime `t.assignee` y dos previews legacy (`task-view.html:117-119`, `:73-107`). | Cargar colecciones por `id` o extender DTO de vista; agregar secciones separadas para responsables y galeria. |
| Detalle `TaskView` mobile | Tampoco se ven colecciones nuevas. | Vista mobile solo imprime responsable simple y Before/After (`task-view.html:307-315`, `:274-303`). | Reutilizar panel visual responsive de colecciones; no duplicar reglas de negocio. |
| Timeline de `TaskView` | Evidencias de cada seguimiento no se muestran. | Timeline usa `ticketMessageFollowUpViewDTO` textual (`task-view.html:194-220`, `:361-383`). | Extender contrato de detalle con evidencias o cargar evidencia por follow-up y mostrar thumbnails ordenados. |
| Alta de tarea | No se pueden agregar imágenes adicionales ni responsables múltiples durante creación. | Paneles están protegidos por `@if (id !== "")`; backend requiere `taskId`. | Mantener creación en dos fases: crear tarea, luego abrir/activar panel post-creacion; o endpoint compuesto aprobado. |
| Responsables en `TaskForm` | Selector permite agregar uno por uno, no seleccionar varios en una sola interacción. | Se usa `custom-input-select-signal` simple (`task-form.html:178-184`). | Usar wrapper multi-select aprobado o repetir flujo con chips; confirmar control shared antes de modificarlo. |
| Listados | Solo aparece responsable legacy/filtro simple. | Listas consumen DTOs con `assigneeId` y templates no renderizan coleccion. | Extender DTO/listado con responsables resumidos o mantener filtro backend compatible con multiples. |
| Recurrentes | Responsables nuevos no se heredan/visualizan en templates recurrentes. | `recurring-tasks` usa flujos separados y no consume `TaskResponsibles`. | Definir si responsables pertenecen al template, instancia o solo tarea concreta; luego adaptar contrato. |
| Estado cerrado | La UI permite abrir `TaskForm` desde detalle aunque tarea este cerrada, sujeto a permisos del backend. | `TaskView` muestra editar bajo `seeEditingOptions` sin bloqueo por estado. | Confirmar política: bloquear edición de responsables/imagenes en cerrado o separar permisos por operación. |
| Doble click upload | Frontend secuencia archivos, pero no hay estado visual por operación de evidencia. | `TaskFollowup` no tiene signal de upload por follow-up. | Agregar estado de carga por `followUpId`, deshabilitar controles durante request y refrescar solo al terminar. |
| Reorder concurrente | UI actualiza orden local tras respuesta, pero no maneja conflicto/relectura. | API usa transacción, sin versión/409 visible en frontend. | Capturar error, recargar colección y avisar conflicto; evitar dejar orden local desfasado. |
| Eliminar imagen | No se observa confirmación específica para imágenes. | Se usa botón delete directo en galeria/evidencia. | Usar confirmación estándar antes de borrar archivo físico. |

## Mapa de lugares correctos

### Responsables multiples

- Entrada de edición principal: `tasks/task-message/task-form.html`, sección `Responsables`.
- Entrada faltante: `tasks/my-tasks/my-task-form.html`.
- Vista de lectura faltante: `tasks/task-message/task-view.html`, desktop y mobile.
- Acciones que deben abrir formulario canonico:
  - `tasks/task-message/task-list.ts:onModalForm`.
  - `tasks/my-tasks/my-assigned-tasks-list.ts:onModalForm` y `onModalAdd`.
  - `tasks/my-tasks/my-requests-task.ts:onModalForm` y `onModalAdd`.
  - `tasks/task-message/task-view.ts:onModalForm`.

### Galeria adicional

- Entrada actual: `tasks/task-message/task-form.html`, sección `Imágenes adicionales`.
- Entrada faltante: `tasks/my-tasks/my-task-form.html`.
- Lectura faltante: `tasks/task-message/task-view.html`, junto a Before/After pero en bloque separado.
- No debe mezclarse con `task-checklist-panel`, que usa `TaskAttachments` para `TaskFiles`.

### Evidencia de seguimiento

- Entrada y lectura operativa actual: `tasks/task-follow-up/task-followup.html`.
- Lectura faltante en detalle: `tasks/task-message/task-view.html`, dentro de cada item de timeline.
- Entrada solo puede existir después de crear seguimiento porque API recibe `followUpId`.

## Stress Test QA

### Transiciones de estado

- `TaskView` ofrece editar según `seeEditingOptions`, sin distinguir operación nueva de tarea cerrada.
- `TaskFollowup` permite upload/delete mientras el dialogo esté disponible; debe confirmarse política para tareas cerradas.
- `TaskForm` muestra paneles nuevos solo en edición; creación requiere flujo post-save.

### Duplicidad y concurrencia

- Responsables: backend tiene unique `(TasksId, ApplicationUserId)`; frontend debe tratar respuesta `409` sin perder selección.
- Orden: backend transacciona reorder; frontend debe recargar si falla.
- Upload múltiple: requests son secuenciales; un fallo parcial deja archivos previos cargados y no hay resumen de éxito/fallo.

### Integridad relacional

- Evidencia se carga con `followUpId`, correctamente separada de galeria de tarea.
- Galeria adicional se carga con `taskId`, correctamente separada de `TaskFiles`.
- `TaskView` no carga colecciones, por tanto no puede verificar visualmente orfandad o paths inválidos.

### Validaciones espejo

- Frontend limita selector de responsables a opciones de participantes del grupo en `TaskForm`; backend también valida.
- Frontend acepta `image/*`, pero validación definitiva MIME/magic bytes debe seguir siendo backend.
- Frontend no muestra límite total por tarea ni feedback de excepciones de usuario legacy.

## Orden de remediacion propuesto

1. Hacer `TaskForm` formulario canonico para todas las rutas de edicion.
2. Agregar colecciones al DTO de detalle o endpoints de lectura para `TaskView`.
3. Renderizar responsables y galeria en desktop/mobile, manteniendo Before/After separado.
4. Renderizar evidencias dentro del timeline de detalle.
5. Definir flujo post-creacion para agregar responsables/galeria.
6. Cubrir cerrado, errores 403/409, upload parcial y reorder concurrente.
7. Auditar recurrentes y reportes para decidir si consumen responsables multiples.

## Aprobacion requerida

No se aplican soluciones de esta auditoria hasta aprobación explícita del usuario.
