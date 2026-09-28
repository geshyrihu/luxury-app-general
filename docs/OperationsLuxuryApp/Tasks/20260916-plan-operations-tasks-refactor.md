# Plan de Refactor - Task: Responsables Multiples, Galeria y Evidencia de Seguimiento

**Fecha:** 2026-09-16  
**Modulo:** `OperationsLuxuryApp`  
**Submodulo:** `Task`  
**Origen:** requerimiento funcional del responsable del modulo  
**Backend:** `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Task/`  
**Entidad principal:** `api/LuxuryApp.Application/Infrastructure/Data/Entities/OperationsLuxuryApp/Tasks.cs`  
**Estado:** backend expand-only aplicado; backfill ejecutado; frontend integrado en progreso.

## Estado de ejecucion

### Implementado en esta tanda

- [x] Entidades `TaskResponsible`, `TaskAdditionalImage` y `TaskFollowUpEvidenceImage`.
- [x] Navegaciones nuevas en `TaskRecord` y `TaskFollowUp`.
- [x] `DbSet` nuevos en `ApplicationDbContext`.
- [x] DTOs e interfaces de responsables, galeria adicional y evidencia de seguimiento.
- [x] Servicios y endpoints para responsables multiples.
- [x] Servicios y endpoints para galeria de imagenes adicionales con reorder.
- [x] Servicios y endpoints para evidencia de `TaskFollowUp` con reorder.
- [x] Validacion de customer multi-customer y usuario autenticado en los nuevos servicios.
- [x] Servicio de backfill idempotente creado; ejecutado de forma controlada contra BD.
- [x] Evidencia de seguimiento integrada en `TaskFollowUpDTO` y listado textual.
- [x] Build aislado de `LuxuryApp.Application` y `LuxuryApp.Api` exitoso.

### Pendiente antes de considerar backend listo

- [x] Generar y revisar migracion EF con el desarrollador; aplicada por el desarrollador.
- [x] Ejecutar backfill idempotente de `AssigneeId` a `TaskResponsibles` desde proceso controlado.
- [ ] Agregar pruebas unitarias/integracion/concurrencia para nuevos servicios.
- [x] Pruebas iniciales de backfill idempotente y alta/listado de responsable agregadas y exitosas.
- [x] Integrar evidencia en DTO/listado visual de `TaskFollowUp`.
- [x] Integrar responsables, galeria adicional y evidencia en formularios Angular existentes.
- [ ] Validar storage real, limites de archivo y magic bytes en ambiente de prueba.
- [ ] Completar dual-read/dual-write en todos los consumidores de `AssigneeId`.
- [ ] Ejecutar reauditoria antes de eliminar cualquier columna legacy.

## 1. Resumen ejecutivo

`TaskRecord` actualmente modela un solo responsable mediante `AssigneeId`. Ese dato se consume transversalmente en creacion, edicion, programacion, filtros, reportes, notificaciones, escalamiento, justificaciones y frontend.

El requerimiento agrega dos capacidades:

1. Una tarea debe poder tener uno o varios responsables.
2. Una tarea debe conservar fotos `BeforeWork` y `AfterWork`, y permitir una galeria independiente de fotos adicionales ordenables sin sustituir esas dos fotos.

3. Cada `TaskFollowUp` debe poder incluir una o varias imagenes de evidencia asociadas al seguimiento especifico.

La estrategia propuesta es **expandir, migrar, compatibilizar y despues contraer**:

- crear tabla de responsables y tabla de imagenes adicionales;
- crear tabla de evidencia visual por seguimiento;
- conservar temporalmente `AssigneeId`, `BeforeWork` y `AfterWork` para compatibilidad;
- backfill de datos existentes;
- dual-read/dual-write durante ventana de transicion;
- migrar consumidores;
- eliminar columnas legacy solo con aprobacion y evidencia de cero consumidores.

## 2. FASE 0 - Pre-planeacion

### 2.1 Problem statement

Actualmente, usuarios operativos solo pueden asignar un responsable principal por tarea y guardar como maximo una foto de antes y una de despues, cuando intentan coordinar trabajo colaborativo y documentar varias evidencias durante la ejecucion, lo que resulta en perdida de responsables operativos, evidencia insuficiente y sustitucion o mezcla de archivos.

Esto afecta a la operacion de tareas, reportes, notificaciones, seguimiento, auditoria y usuarios con acceso a multiples customers.

### 2.2 Baseline y KPIs

| Metrica | Baseline actual | Target | Timeline | Verificacion |
|---|---:|---:|---|---|
| Responsables persistidos por tarea | 1 columna (`AssigneeId`) | 1..N filas en tabla de relacion | Fase 2 | Consulta de backfill y tests de asignacion |
| Datos existentes con responsable preservado | 100% de filas con `AssigneeId` no nulo deben conservarse | 100% | Migracion | Conteo antes/despues y reporte de orfanos |
| Fotos Before/After preservadas | 2 campos legacy por tarea | 100% sin sustitucion | Fase 1-2 | Comparacion de paths y smoke test |
| Fotos adicionales ordenables | 0 capacidad dedicada | N fotos por tarea, orden 1..N | Fase 2 | Crear 10 imagenes, reordenar y leer orden |
| Evidencias por seguimiento | 0 capacidad dedicada | N imagenes por `TaskFollowUp` sin mezclar galeria de tarea | Fase 2 | Crear seguimiento con evidencia y consultar evidencia |
| Colisiones de orden | No existe regla | 0 duplicados `(TaskId, SortOrder)` | Fase 2 | Unique index + test concurrente/reorder |
| Consumers que usan solo `AssigneeId` | Detectados en servicios, reportes y front | 0 consumidores sin compatibilidad | Fase 3 | `rg` de `AssigneeId` + contract tests |
| Acceso cross-customer | Debe respetar alcance del usuario | 0 accesos fuera de alcance | Todas | Tests single/multi-customer autorizados y rechazados |

### 2.3 Matriz de reglas de negocio

| ID | Nivel | Regla | Implementacion objetivo |
|---|---|---|---|
| RN-TASK-RESP-001 | 1 Invariante | Una tarea puede tener uno o varios responsables; no puede existir una relacion duplicada tarea-usuario. | `TaskResponsibles` + unique `(TasksId, ApplicationUserId)` |
| RN-TASK-RESP-002 | 1 Invariante | Cada tarea debe conservar como maximo un responsable principal durante la transicion; despues, la politica de negocio debe definir si puede quedar sin principal. | `IsPrimary` + validacion transaccional + compatibilidad `AssigneeId` |
| RN-TASK-RESP-003 | 3 Seguridad | Solo usuarios activos y autorizados para el customer/grupo de la tarea pueden ser responsables. Roles multi-customer conservan acceso a todos sus customers autorizados. | Policy de customer + validacion de pertenencia al grupo/alcance |
| RN-TASK-RESP-004 | 3 Seguridad | Crear, quitar o reordenar responsables registra actor, fecha y tarea afectada. | Auditoria de comandos y `CreatedBy/AssignedBy` |
| RN-TASK-IMG-001 | 1 Invariante | `BeforeWork` y `AfterWork` siguen siendo campos semanticos independientes; imagen adicional nunca los reemplaza. | Columnas legacy preservadas + tabla nueva separada |
| RN-TASK-IMG-002 | 1 Invariante | Una imagen adicional pertenece a una sola tarea y no puede quedar huerfana. | FK `TaskId` + delete policy explicita |
| RN-TASK-IMG-003 | 2 Flujo | Las imagenes adicionales se muestran en `SortOrder` ascendente y pueden reordenarse sin cambiar el archivo. | Endpoint de reorder transaccional |
| RN-TASK-IMG-004 | 4 Validacion | Solo se aceptan imagenes validas, con limite de tamano, MIME permitido y firma/magic bytes verificada. | Servicio de storage/validator seguro |
| RN-TASK-IMG-005 | 4 Validacion | `SortOrder` debe ser positivo y unico dentro de una tarea. | Unique index `(TasksId, SortOrder)` o estrategia equivalente del proveedor |
| RN-TASK-FU-IMG-001 | 1 Invariante | Una evidencia pertenece a un solo `TaskFollowUp` y no puede quedar huerfana. | `TaskFollowUpEvidenceImages` + FK a `TaskFollowUps` |
| RN-TASK-FU-IMG-002 | 3 Seguridad | La evidencia de seguimiento hereda autorizacion de la tarea y no puede cargarse para un seguimiento de otro customer. | Validacion `FollowUp -> Task -> Customer` |
| RN-TASK-FU-IMG-003 | 4 Validacion | Solo se aceptan imagenes validas con limite de tamano y firma/MIME permitido. | Servicio de storage/validator seguro |
| RN-TASK-CON-001 | 4 Contrato | DTOs backend terminan en `DTO`, un DTO por archivo; frontend usa interfaces separadas. | Carpetas DTOs/interfaces oficiales |

### 2.4 Pre-mortem

| Supuesto fallido | Impacto | Probabilidad | Mitigacion | Owner |
|---|---|---|---|---|
| Se elimina `AssigneeId` antes de migrar consumidores | Listados, alertas y permisos dejan de funcionar | Alta | Expand/dual-read/dual-write/contract antes de contract | Backend lead |
| Backfill crea relaciones para usuarios inexistentes | Responsables huerfanos o tareas sin responsable | Media | Validar usuarios activos/existentes y emitir reporte de excepciones | DBA + Backend |
| Reordenamiento concurrente usa numeros duplicados | Galeria inestable o respuesta no determinista | Media | Transaction, normalizacion densa y unique constraint | Backend |
| Imagen adicional sustituye Before/After por reutilizar DTO legacy | Se pierde semantica de evidencia | Media | Tabla y endpoints separados, tests de no sustitucion | Backend + Frontend |
| Se acepta responsable de customer no autorizado | Fuga de datos/notificaciones cross-customer | Alta | Policy de alcance multi-customer + validacion de grupo | Security |
| Rollback elimina tabla nueva despues de writes | Perdida de imagenes o relaciones nuevas | Media | Rollback logico primero; no borrar datos nuevos automaticamente | Release owner |

### 2.5 Flujos criticos

**Happy path - multiples responsables**

1. Usuario abre tarea del customer objetivo.
2. Selecciona tres usuarios activos autorizados.
3. Sistema guarda tres relaciones, una `IsPrimary=true`.
4. Lecturas, notificaciones y reportes muestran los tres responsables.
5. `AssigneeId` legacy conserva responsable principal durante la ventana compatible.

**Happy path - galeria**

1. Tarea conserva `BeforeWork` y `AfterWork`.
2. Usuario agrega diez imagenes adicionales.
3. Sistema guarda diez filas en tabla nueva.
4. Lectura devuelve `SortOrder` 1..10.
5. Usuario reordena 10, 2, 7; sistema normaliza 1..10 sin cambiar paths ni Before/After.

**Sad path**

1. Usuario intenta asignar responsable de customer fuera de alcance.
2. Backend rechaza 403 sin crear relacion ni notificar.

**Edge path**

1. Dos requests intentan marcar principal a responsables distintos.
2. Una operacion gana de forma atomica; la otra recibe conflicto controlado o se resuelve por politica definida.

1. Dos requests intentan asignar el mismo usuario a la misma tarea.
2. Solo queda una relacion por constraint/idempotencia.

## 3. Alcance

### Incluye

- Nueva relacion `TaskResponsibles` para responsables multiples.
- Nueva tabla `TaskAdditionalImages` para fotos adicionales ordenables.
- Backfill desde `TaskRecord.AssigneeId`.
- Compatibilidad temporal de `AssigneeId`, `BeforeWork`, `AfterWork`.
- Endpoints, DTOs, interfaces, servicios, auditoria y autorizacion.
- Actualizacion de consultas, reportes, alertas, notificaciones y frontend.
- Migracion EF reversible y validaciones de datos.
- Pruebas unitarias, integracion y concurrencia.

### Excluye

- Sustituir o reinterpretar `BeforeWork` y `AfterWork`.
- Mezclar fotos adicionales con `TaskFiles` de comprobantes/PDF.
- Eliminar columnas legacy en la primera entrega.
- Cambiar reglas de customer multi-customer fuera del modulo Task.
- Crear migracion o ejecutar `Update-Database` autonomamente.

## 4. Diseño propuesto

### 4.1 Entidad `TaskResponsible`

Ubicacion propuesta:

`api/LuxuryApp.Application/Infrastructure/Data/Entities/OperationsLuxuryApp/TaskResponsible.cs`

Tabla propuesta: `TaskResponsibles`.

Campos:

| Campo | Tipo | Regla |
|---|---|---|
| `Id` | `Guid` | PK |
| `TasksId` | `Guid` | FK a `Tasks`, requerido |
| `ApplicationUserId` | `string` | FK a usuario, requerido |
| `IsPrimary` | `bool` | Maximo uno por tarea durante transicion |
| `AssignedAt` | `DateTime` | UTC, requerido |
| `AssignedByUserId` | `string` | Actor real desde claims |
| `RemovedAt` | `DateTime?` | Opcional si se conserva historial en vez de hard delete |
| `RemovedByUserId` | `string` | Opcional, auditoria |

Indices/constraints:

- unique `(TasksId, ApplicationUserId)` para evitar duplicados activos;
- indice `(ApplicationUserId, TasksId)` para `Mis tareas`;
- indice `(TasksId, IsPrimary)`;
- regla de un principal por tarea implementada con unique filtered index si el proveedor lo soporta, o transaccion serializable + validacion de servicio;
- FK a `Tasks` con delete behavior definido explicitamente;
- FK a `ApplicationUser` sin borrar historico por cascada accidental.

Decisión de compatibilidad:

- `AssigneeId` sigue siendo alias del responsable principal durante migracion.
- Todo write nuevo actualiza relacion y alias dentro de la misma unidad de trabajo.
- Todo read nuevo prefiere relaciones; si no hay relaciones, usa alias legacy.
- `AssigneeId` solo se elimina en fase Contract, despues de cero consumidores y aprobacion.

### 4.2 Entidad `TaskAdditionalImage`

Ubicacion propuesta:

`api/LuxuryApp.Application/Infrastructure/Data/Entities/OperationsLuxuryApp/TaskAdditionalImage.cs`

Tabla propuesta: `TaskAdditionalImages`.

Campos:

| Campo | Tipo | Regla |
|---|---|---|
| `Id` | `Guid` | PK |
| `TasksId` | `Guid` | FK a `Tasks`, requerido |
| `FilePath` | `string` | Path relativo seguro, requerido |
| `FileName` | `string` | Nombre original sanitizado |
| `MimeType` | `string` | Solo imagenes permitidas |
| `SortOrder` | `int` | Positivo, unico dentro de tarea |
| `CreatedAt` | `DateTime` | UTC |
| `CreatedBy` | `string` | Actor autenticado |
| `UpdatedAt` | `DateTime?` | Para reorder/auditoria |
| `UpdatedBy` | `string` | Actor autenticado |

Indices/constraints:

- unique `(TasksId, SortOrder)`;
- indice `(TasksId, SortOrder)` para lectura ordenada;
- FK a `Tasks` con politica definida: eliminar imagenes al eliminar tarea solo si la politica de retencion lo permite; si existe auditoria/retencion, usar bloqueo o archivado;
- no usar esta tabla para PDFs ni comprobantes existentes.

### 4.3 Entidad `TaskFollowUpEvidenceImage`

La entidad existente `TaskFollowUp`:

`api/LuxuryApp.Application/Infrastructure/Data/Entities/OperationsLuxuryApp/TaskFollowUp.cs`

debe soportar evidencia visual mediante una relacion 1:N, no mediante una lista serializada ni columnas repetidas en `TaskFollowUp`.

Ubicacion propuesta:

`api/LuxuryApp.Application/Infrastructure/Data/Entities/OperationsLuxuryApp/TaskFollowUpEvidenceImage.cs`

Tabla propuesta: `TaskFollowUpEvidenceImages`.

Campos:

| Campo | Tipo | Regla |
|---|---|---|
| `Id` | `Guid` | PK |
| `TaskFollowUpId` | `Guid` | FK a `TaskFollowUps`, requerido |
| `FilePath` | `string` | Path relativo seguro |
| `FileName` | `string` | Nombre original sanitizado |
| `MimeType` | `string` | Solo imagenes permitidas |
| `SortOrder` | `int` | Orden dentro del seguimiento, positivo |
| `CreatedAt` | `DateTime` | UTC |
| `CreatedBy` | `string` | Actor autenticado |

Indices/constraints:

- indice `(TaskFollowUpId, SortOrder)`;
- unique `(TaskFollowUpId, SortOrder)`;
- FK a `TaskFollowUps` con delete behavior explicito;
- la evidencia no se agrega a `TaskAdditionalImages`: son dos contextos distintos, tarea y seguimiento.

Contrato funcional:

- un seguimiento puede tener cero o varias imagenes;
- las imagenes se muestran ordenadas por `SortOrder`;
- upload y delete validan la cadena `evidencia -> follow-up -> task -> customer`;
- el upload puede ser parte del POST de seguimiento mediante multipart o endpoint separado; se recomienda endpoint separado para reintentos por archivo y compatibilidad con seguimiento textual;
- el actor se obtiene de claims, no de `ApplicationUserId` recibido por cliente.

Semantica de orden:

- API devuelve siempre `SortOrder` ascendente.
- Al agregar sin orden, asigna `MAX(SortOrder) + 1` dentro de transaccion.
- Reorder recibe lista completa de IDs en orden deseado y reescribe secuencia densa `1..N`.
- Reorder valida que todos los IDs pertenezcan a la misma tarea; no acepta IDs externos.
- Si una imagen se elimina, se compacta orden o se deja hueco segun decision final; se recomienda compactar para simplificar UI.

### 4.4 Contratos backend

Cada DTO en archivo separado y con sufijo `DTO`:

- `TaskResponsibleDTO`
- `TaskResponsibleAddDTO`
- `TaskResponsibleReorderDTO`
- `TaskAdditionalImageDTO`
- `TaskAdditionalImageUploadDTO`
- `TaskAdditionalImageReorderDTO`
- `TaskFollowUpEvidenceImageDTO`
- `TaskFollowUpEvidenceImageUploadDTO`
- `TaskFollowUpEvidenceImageReorderDTO`

Endpoints propuestos, sujetos a validacion de naming final:

| Metodo | Ruta | Operacion |
|---|---|---|
| `GET` | `api/tasks/{taskId}/responsibles` | Lista responsables ordenados principal/fecha |
| `POST` | `api/tasks/{taskId}/responsibles` | Agrega responsable |
| `PATCH` | `api/tasks/{taskId}/responsibles/primary/{responsibleId}` | Cambia principal |
| `DELETE` | `api/tasks/{taskId}/responsibles/{responsibleId}` | Quita responsable |
| `GET` | `api/tasks/{taskId}/additional-images` | Lista galeria ordenada |
| `POST` | `api/tasks/{taskId}/additional-images` | Carga imagen adicional |
| `PATCH` | `api/tasks/{taskId}/additional-images/reorder` | Reordena galeria |
| `DELETE` | `api/tasks/{taskId}/additional-images/{imageId}` | Elimina imagen adicional |
| `GET` | `api/task-follow-up/{followUpId}/evidence-images` | Lista evidencia del seguimiento |
| `POST` | `api/task-follow-up/{followUpId}/evidence-images` | Carga evidencia del seguimiento |
| `PATCH` | `api/task-follow-up/{followUpId}/evidence-images/reorder` | Reordena evidencia |
| `DELETE` | `api/task-follow-up/{followUpId}/evidence-images/{imageId}` | Elimina evidencia |

Todos deben validar customer objetivo, grupo, permiso de tarea y actor autenticado. Roles multi-customer pueden operar cualquier customer de su alcance autorizado; no se debe usar igualdad contra un unico `currentUser.CustomerId` como unica regla.

### 4.5 Contratos frontend

Crear interfaces propias bajo el modulo Task:

- `interfaces/task-responsible.interface.ts`
- `interfaces/task-additional-image.interface.ts`
- `interfaces/task-follow-up-evidence-image.interface.ts`

Componentes propuestos:

- panel de responsables multiples: seleccionar, agregar, quitar y marcar principal;
- galeria adicional: upload multiple, preview, eliminar, drag/drop o controles arriba/abajo;
- evidencia de seguimiento: upload multiple dentro del panel de seguimiento, preview, eliminar y ordenamiento;
- conservar bloque visual separado para BeforeWork y AfterWork.

No usar `TaskAttachmentInterface` para la galeria nueva: ese contrato representa comprobantes/archivos de `TaskFiles` y puede incluir PDF.

## 5. Fases de ejecucion

### Fase 1 - Inventario y contrato congelado

Checklist:

- [ ] Inventariar todos los lectores/escritores de `AssigneeId`, `BeforeWork`, `AfterWork` y `TaskFiles`.
- [ ] Confirmar roles y fuente de customers autorizados.
- [ ] Confirmar politica de responsable principal: obligatorio, opcional o siempre uno mientras la tarea este activa.
- [ ] Confirmar politica de borrado/retencion de imagenes al borrar tarea.
- [ ] Confirmar limite por imagen, formatos y limite total por tarea.
- [ ] Confirmar si se permite asignar responsables fuera de miembros de `TaskWorkGroup`.
- [ ] Congelar nombres de tablas, DTOs, rutas y columnas antes de migrar.

Criterio de paso: contrato aprobado y matriz de consumidores completa.

### Fase 2 - Expand: esquema y entidades

Checklist:

- [ ] Crear `TaskResponsible` y `TaskAdditionalImage` con namespace path-based.
- [ ] Crear `TaskFollowUpEvidenceImage` y navegacion de evidencia en `TaskFollowUp`.
- [ ] Agregar `DbSet` y configuraciones EF explicitas.
- [ ] Agregar navegaciones en `TaskRecord`.
- [ ] Crear indices, FKs y constraints.
- [ ] Crear DTOs/interfaces separados.
- [ ] No eliminar `AssigneeId`, `BeforeWork`, `AfterWork` ni `TaskFiles`.

Criterio de paso: build, snapshot EF coherente y migracion generada por desarrollador sin perdida de datos.

### Fase 3 - Backfill idempotente

Checklist:

- [ ] Insertar una relacion `TaskResponsible` por cada `AssigneeId` existente no nulo.
- [ ] Marcarla `IsPrimary=true`.
- [ ] Omitir y reportar usuarios inexistentes, sin inventar responsables.
- [ ] Ejecutar backfill idempotente por `TasksId + ApplicationUserId`.
- [ ] Verificar conteos antes/despues y tareas con alias sin relacion.
- [ ] No migrar `BeforeWork`/`AfterWork` a galeria: son evidencia semantica separada.

Criterio de paso: 100% de responsables legacy validos preservados y cero duplicados.

### Fase 4 - Dual-read/dual-write backend

Checklist:

- [ ] Crear/editar tarea sincroniza alias legacy y relaciones nuevas.
- [ ] Agregar/quitar/marcar principal actualiza `AssigneeId` mientras dure compatibilidad.
- [ ] Listados/reportes/notificaciones resuelven multiples responsables.
- [ ] Si no hay relacion, fallback controlado a `AssigneeId`.
- [ ] Imagenes adicionales usan storage seguro y nunca modifican Before/After.
- [ ] Evidencia de `TaskFollowUp` usa storage seguro y nunca se mezcla con galeria de tarea ni `TaskFiles`.
- [ ] Reorder es transaccional y auditable.
- [ ] Añadir imagen sin `SortOrder` obtiene siguiente orden atomico.

Criterio de paso: old client y new client pueden operar simultaneamente sin divergir datos.

### Fase 5 - Frontend Task

Checklist:

- [ ] Agregar UI de responsables multiples en detalle/formulario.
- [ ] Mantener visualizacion de responsable principal y mostrar lista completa.
- [ ] Agregar galeria independiente de Before/After.
- [ ] Agregar evidencia visual dentro del panel de `TaskFollowUp`.
- [ ] Implementar upload multiple con progreso, limite y errores por archivo.
- [ ] Implementar reorder accesible por teclado y controles mobile.
- [ ] Actualizar interfaces, servicios y tests.
- [ ] Probar cambio de customer con respuestas stale y permisos.

Criterio de paso: usuario puede crear tarea con tres responsables y diez fotos, reordenarlas y conservar Before/After.

### Fase 6 - Contract controlado

Checklist:

- [ ] Confirmar cero consumidores de `AssigneeId` como fuente unica.
- [ ] Confirmar cero writes directos de identidad a `AssigneeId` fuera de compatibilidad.
- [ ] Confirmar reportes/alertas/notificaciones sobre responsables multiples.
- [ ] Decidir si `AssigneeId` queda como cache principal o se elimina.
- [ ] Si se elimina, crear migracion separada y rollback aprobado.
- [ ] Mantener Before/After indefinidamente salvo decision funcional distinta.

Criterio de paso: aprobacion explicita para retirar columnas legacy; no retirar implicitamente al finalizar Fase 5.

## 6. Compatibilidad, migracion y rollback

### Forward path

```text
Schema expand
  -> backfill responsables
  -> deploy dual-read/dual-write
  -> deploy nuevos endpoints/UI
  -> verificar consumidores y datos
  -> decidir contract
```

### Rollback path

- Antes de activar writes nuevos: rollback de codigo a version anterior; tablas nuevas quedan intactas.
- Durante dual-write: desactivar nuevos endpoints/UI y conservar relaciones para reintento; alias legacy sigue operativo.
- Si falla backfill: rollback de la migracion expand sin borrar tablas existentes; corregir datos y repetir idempotentemente.
- No borrar imagenes nuevas durante rollback de codigo.
- La eliminacion de `AssigneeId` requiere migracion separada, backup/verificacion y plan de restauracion.

La IA no ejecuta `Add-Migration` ni `Update-Database`; el desarrollador crea/aplica migraciones despues de aprobar el modelo y revisar datos reales.

## 7. Pruebas obligatorias

### Responsables

- Agregar primer responsable.
- Agregar segundo y tercer responsable.
- Repetir mismo responsable: rechaza o idempotente, nunca duplica.
- Marcar principal: exactamente uno.
- Quitar principal: comportamiento segun politica aprobada.
- Usuario autorizado a multiples customers: permite customers A y B.
- Usuario fuera de alcance: 403 y sin notificacion.
- Backfill conserva `AssigneeId` y crea relacion principal.
- Jobs/notificaciones envian a todos los responsables activos sin duplicar.

### Imagenes adicionales

- Crear tarea con Before/After.
- Agregar cero, uno y diez imagenes adicionales.
- Verificar que upload adicional no cambia Before/After.
- Orden inicial y reordenamiento completo.
- IDs de otra tarea en reorder: rechaza.
- Orden duplicado/concurrente: no persiste duplicados.
- MIME falso, extension falsa, tamano excedido y magic bytes invalidos: rechaza.
- Eliminar imagen adicional no elimina comprobante `TaskFiles`.
- Crear seguimiento sin evidencia.
- Crear seguimiento con una y varias evidencias.
- Evidencia de seguimiento no aparece en galeria de tarea ni en comprobantes `TaskFiles`.
- Usuario sin acceso a la tarea no puede listar, cargar, reordenar ni eliminar evidencia.
- Eliminar seguimiento respeta la politica aprobada para sus evidencias.
- Borrar tarea: verificar FK, storage y politica de retencion.

## 8. Riesgos e impactos

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Cambiar lectores de `AssigneeId` incompletamente | Alertas, filtros o reportes omiten responsables | Inventario `rg`, dual-read y contract tests |
| Backfill parcial | Tareas sin responsable en nueva UI | Reporte de excepciones y reintento idempotente |
| Un principal ambiguo | Permisos/notificaciones inconsistentes | Constraint + transaccion + regla funcional aprobada |
| Mezclar TaskFiles con galeria | PDFs tratados como imagenes o UI rota | Tabla/DTO/endpoints separados |
| Orden concurrente | Fotos duplicadas o saltos | Reorder atomico y unique index |
| Cambio de storage | Archivos inaccesibles | Paths relativos, servicio seguro y verificacion de existencia |
| Customer multi-scope mal validado | Acceso cross-customer o bloqueo legitimo | Tests positivos/negativos por customer autorizado |

## 9. Dependencias e impactos

- `TaskRecord.AssigneeId` y `TaskRecord.BeforeWork/AfterWork` tienen consumidores en servicios, jobs, DTOs y frontend.
- `TaskFollowUp` requiere nueva navegacion/tabla de evidencia sin romper el flujo textual actual.
- `TaskFiles` ya gestiona archivos mixtos; no debe reemplazarse sin decision de dominio.
- `IFileWritePathService`, `IFileReadPathService`, `ISecureFileStorageService` son servicios shared; su uso requiere respetar contratos existentes.
- Migracion afecta EF snapshot, base desplegada, storage y contratos HTTP.
- Cambios de DTO/endpoints requieren coordinacion backend/frontend y ventana de compatibilidad.
- Responsables multiples pueden afectar reglas de justificacion, ownership, notificaciones y reportes; cada una debe mapearse explicitamente.

## 10. Cierre esperado

El refactor se cierra cuando:

1. Todas las tareas con `AssigneeId` valido tienen responsable migrado.
2. Tareas nuevas soportan uno o varios responsables con un principal definido.
3. Todos los lectores operativos reconocen multiples responsables.
4. BeforeWork y AfterWork permanecen intactos y separados.
5. Galeria adicional permite N imagenes ordenadas, reordenables y eliminables.
6. Cada `TaskFollowUp` permite N evidencias ordenadas, con autorizacion heredada de la tarea.
7. No existen duplicados, huerfanos, accesos cross-customer ni colisiones de orden.
8. Build, tests, migracion, backfill y rollback fueron verificados.
9. La eliminacion de legacy queda en decision separada y aprobada; no se asume automaticamente.

## 11. Aprobaciones requeridas antes de ejecutar

- Regla de responsable principal al quitar el ultimo principal.
- Responsables permitidos: cualquier usuario autorizado del customer o solo miembros del grupo.
- Limite de imagen por archivo y limite total por tarea.
- Formatos permitidos: JPEG/PNG/WebP y politica de HEIC.
- Politica de borrado/retencion de imagenes al borrar tarea.
- Politica de borrado/retencion de evidencias al borrar un `TaskFollowUp`.
- Si `AssigneeId` queda como cache compatible o se retira en fase posterior.
- Si la galeria se integra en `TaskView`, `TaskForm`, `TaskClose` y `TaskChecklistPanel` en una sola entrega o por etapas.
