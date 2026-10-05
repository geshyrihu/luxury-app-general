# Plan de implementación: importación de mobiliario a contenidos de áreas

> **Estado:** Borrador para aprobación del Tech Lead  
> **Tipo:** Ampliación transversal de Machinery y EquipmentContents  
> **Dominio rector:** MaintenanceLuxuryApp / Machinery  
> **Fecha:** 2026-10-03  
> **Owner técnico esperado:** `@equipo-mantenimiento`  
> **Origen:** Solicitud del dueño del módulo; continuación de `20261002-plan-maintenance-equipment-content.md`.

## FASE 0. Pre-planeación

### 0.1 Problema y KPIs

Actualmente, el personal de mantenimiento no puede convertir mobiliario activo del inventario general en contenidos de una amenidad o área común cuando quiere organizar los artículos que pertenecen a esos espacios. La captura manual duplica trabajo y la baja del inventario de origen no conserva de forma segura toda la información ni fotografía.

Esto afecta a los usuarios autorizados que administran inventario de Amenidades y Áreas Comunes del mismo cliente.

| Métrica | Baseline | Target | Timeline | Verificación |
|---|---|---|---|---|
| Importación disponible desde el inventario contextual | 0 flujos | 1 flujo temporal que aparece solo con mobiliario activo importable | Gate de QA antes de habilitar | Prueba UI/API por cliente y categoría |
| Muebles exitosos con contenido equivalente y trazabilidad | 0; no existe el proceso | 100% de cada artículo reportado como importado | Cada lote de QA | Comparar origen/destino, `AssetMigrationLog` y atributos mapeados |
| Artículos fallidos que conservan origen y dependencias | No existe el proceso | 100% de fallos por artículo dejan origen intacto | Cada lote de QA | Fallos inducidos de validación/BD por artículo |
| Fotografías válidas preservadas | No existe el proceso | 100% de fotos válidas apuntan a archivo preservado; faltantes quedan sin foto y con aviso | Cada lote de QA | Verificar existencia vía proveedor oficial de archivos y URL de contenido |
| Duplicados de importación | No existe el proceso | 0 | Cada lote y reintento | Índice único de `AssetMigrationLog` y pruebas de repetición |

La cantidad real de mobiliarios activos se obtiene del inventario por cliente durante preflight; no se inventa un conteo global.

### 0.2 Reglas de negocio

| ID | Nivel | Regla | Evidencia de código |
|---|---|---|---|
| RN-MIM-001 | 1 — Dominio | El origen es `Equipment` con `InventoryCategory.Mobiliarios` y `State.Activo`; el destino solo puede ser `Equipment` Amenidades o Áreas Comunes del mismo cliente. | `InventoryCategory.cs:14-24,50-54`; `Equipment.cs:7-13,92-104`; `EquipmentContentAppService.cs:12-17` |
| RN-MIM-002 | 1 — Dominio | Cada `Equipment` seleccionado genera exactamente un `EquipmentContent`, con `Type=Other`, `Quantity=1`, nombre de origen y notas conservadas con etiquetas. | `Equipment.cs:41-129`; `EquipmentContent.cs:6-46`; decisión confirmada en discovery |
| RN-MIM-003 | 1 — Dominio | Si existe foto válida, el contenido reutiliza `PhotoPath` y se conserva el archivo en el directorio del mismo cliente. Foto ausente o inexistente da `PhotoPath=null` y advertencia, no bloquea importación. | `MachineryAppService.cs:174-179`; `EquipmentContentAppService.cs:68-80,252-264`; `IFileProvider.FileExists` |
| RN-MIM-010 | 2 — Flujo | Desde un padre Amenidades/Áreas Comunes se presenta acción temporal, selección de mobiliario activo, vista previa del borrado y confirmación explícita. | `equipos-list.ts:142-143,238-247`; `equipos-list.html` acciones por equipo |
| RN-MIM-011 | 2 — Flujo | El lote es parcial por artículo: cada artículo tiene transacción propia; éxito crea contenido, traza y elimina origen/dependencias; fallo revierte solo ese artículo y deja origen/dependencias intactos. | `MachineryAppService.DeleteAsync:219-248`; `AssetMigrationLog.cs:6-32` |
| RN-MIM-012 | 2 — Flujo | Se borra árbol solicitado: dependencias directas, órdenes vinculadas y tickets completos, aunque compartan órdenes. Borrar subtareas y tareas que dependen de esos tickets de forma transitiva; conservar plantillas recurrentes y otras instancias fuera de ese cierre transitivo. Órdenes de servicio externas al mobiliario permanecen, pero pierden sus vínculos a tickets eliminados. | `Equipment.cs:131-135`; `ServiceOrder.cs:188-200`; `TaskServiceOrder.cs:3-14`; `Tasks.cs:216-254,295-302`; decisiones confirmadas en discovery |
| RN-MIM-013 | 2 — Flujo | El botón desaparece cuando ya no quedan mobiliarios activos importables para el cliente; registros inactivos quedan fuera del alcance. | `equipos-list.ts:137-143,211-218`; decisión confirmada en discovery |
| RN-MIM-020 | 3 — Seguridad | Reutilizar autorización actual de gestión de contenidos y comprobar en servidor que origen y destino pertenecen al mismo cliente activo. Ningún `CustomerId` del cliente reemplaza la validación del servidor. | `EquipmentContentsEndpoints.cs:7-9`; `EquipmentContentAppService.cs:229-236`; `EquipmentContentsList.canManageContents():51-62` |
| RN-MIM-021 | 3 — Seguridad | Registrar por artículo `EquipmentId` origen, `EquipmentContentId` destino y fecha; derivar el cliente desde ambos activos y registrar al usuario mediante el filtro de actividad existente; no registrar rutas físicas. | `AssetMigrationLog.cs:6-32`; `EquipmentContentsEndpoints.cs:7-10` |
| RN-MIM-030 | 4 — Validación | Revalidar inmediatamente antes de cada artículo: origen existe, es activo y Mobiliarios; destino existe, es categoría 2 u 8; ambos son del mismo cliente; origen no está ya registrado en el log de importación. | `Equipment.cs:7-13,92-104`; `EquipmentContentAppService.cs:211-249`; índice `AssetMigrationLog` |
| RN-MIM-031 | 4 — Validación | `NameMachinery` pasa a `Name`; `Type=Other`; `Quantity=1`; `PhotoPath` se conserva solo si archivo existe; todos los demás campos de origen se agregan a `Notes` con etiquetas y formato de fecha ISO. | `Equipment.cs:41-129`; `EquipmentContent.cs:19-46`; decisiones confirmadas en discovery |
| RN-MIM-032 | 4 — Validación | La vista previa estima dependencias por borrar; la API vuelve a calcularlas dentro de cada transacción para evitar vista previa obsoleta. | Relaciones actuales descritas en arquitectura; endpoints `Machineries` autenticados |

### 0.3 Pre-mortem y flujos críticos

| Supuesto fallido | Impacto | Probabilidad | Mitigación | Owner |
|---|---|---|---|---|
| Se omite una FK directa o descendiente | El borrado falla o deja datos/archivos huérfanos | Media | Inventario de todas las FKs antes de implementar; preflight cuenta relaciones; pruebas por cada dependiente | Backend |
| Se invoca `MachineryAppService.DeleteAsync` y se borra la foto que debe conservarse | Contenido queda sin fotografía | Media | Importación no usa ese método; crea referencia del contenido y protege `PhotoPath` fuente del cleanup | Backend |
| Ticket ligado al mueble se comparte con órdenes ajenas | Se borra ticket e historial relacionado por decisión explícita | Media | Vista previa expone vínculos y subtareas que serán borrados; advertencia irreversible antes de confirmar | Owner + Backend |
| Falla la limpieza física después del commit de BD | Quedan archivos derivados sin referencia | Media | Reportar `ImportadoConLimpiezaPendiente`, registrar IDs y advertencias, reintento/manual cleanup visible | Backend/Operación |
| Dos usuarios importan el mismo mueble simultáneamente | Contenido duplicado o un usuario ve error de carrera | Baja | Transacción por artículo, revalidación y unique index del log; el segundo intento queda como ya procesado | Backend |

**Happy path:** usuario abre Contenidos desde un padre Amenidades/Áreas Comunes → elige mobiliarios activos del mismo cliente → revisa conteo de datos y cascada → confirma → API crea un contenido por mueble, registra origen/destino, borra dependencias y origen; conserva foto válida; respuesta muestra resultado por artículo. **PASS:** un contenido por fuente exitosa, log único, fuente no existe y archivos protegidos/eliminados según regla.

**Sad path:** un origen tiene dependencia no borrable o falla su transacción → solo ese artículo falla; API revierte sus cambios y conserva fuente/dependencias, procesa el resto y devuelve estado/motivo. **PASS:** conteos de origen y destino prueban que no hay estado parcial para el artículo fallido.

**Edge path:** ticket enlazado a varias órdenes con subtareas, tareas dependientes, plantilla recurrente e instancias; usuario ve árbol y vínculos externos antes de confirmar; importación borra tickets/subtareas/dependientes dentro del cierre transitivo y sus archivos, elimina los vínculos de órdenes ajenas, conserva órdenes ajenas, plantilla y las instancias fuera del cierre. Ciclo detectado en relaciones de tareas => artículo falla sin borrar. **PASS:** el árbol aprobado desaparece y entidades protegidas permanecen.

**Edge de fotografía:** `PhotoPath` null o archivo inexistente → importación crea contenido sin foto y presenta advertencia por artículo. Si el archivo existe, contenido usa misma ruta de cliente y cleanup no la elimina. **PASS:** URL de imagen responde cuando existía archivo y contenido queda sin foto cuando faltaba.

## 1. Resumen ejecutivo

Añadir un mecanismo temporal dentro de la administración de contenidos de Amenidades y Áreas Comunes. Permite seleccionar mobiliario activo de `Equipment` del mismo cliente y convertir cada registro seleccionado a `EquipmentContent`; al confirmarse, el registro fuente y su árbol de dependencias se eliminan según reglas aprobadas. La operación conserva todos los atributos fuente en `Name`, `PhotoPath` y `Notes`, registra mapping fuente-destino con el `AssetMigrationLog` existente y reporta éxitos/fallos individualmente.

La operación es destructiva después de commit. La vista previa muestra la cascada por artículo; respaldo restaurable de base de datos y almacenamiento es requisito de habilitación. Mobiliario inactivo queda fuera; el botón se oculta al agotarse el mobiliario activo importable.

## 2. Alcance y restricciones

### Incluye

- Acción temporal **Importar mobiliario** desde contexto de un padre `Equipment` categoría Amenidades=2 o Áreas Comunes=8.
- Lista/selección de mobiliario fuente categoría Mobiliarios=3, activo, mismo cliente.
- Vista previa de artículos y dependencias que se van a borrar; confirmación por usuario.
- Importación parcial por artículo con transacción propia y resultado explícito.
- Mapeo de campos, `PhotoPath`, trazabilidad e idempotencia.
- Borrado relacional completo aprobado, cleanup físico posterior y advertencias de cleanup.
- Ocultar la opción temporal cuando no queden fuentes activas importables.
- Documentación del cambio que amplía alcance del plan de contenidos del 2026-10-02.

### Fuera de alcance

- Importar mobiliario inactivo, de otros clientes o a bodegas/cuarto de máquinas.
- Cambiar `Equipment`, `EquipmentContent`, `InventoryCategory` o agregar campos de esquema.
- Elegir tipos/cantidades durante importación: se aplican defaults aprobados `Other` y `1`.
- Borrar plantillas recurrentes, otras instancias o órdenes de servicio que no pertenecen al mobiliario seleccionado.
- Implementar restauración automática desde UI; recuperación posterior requiere backup verificado.
- Mover físicamente fotografía primaria cuando ambos modelos usan el mismo directorio de maquinaria.

### Reglas de transición de datos aprobadas

| Campo origen `Equipment` | Campo destino `EquipmentContent` | Regla |
|---|---|---|
| `NameMachinery` | `Name` | Copiar nombre conservando texto; validar requerido |
| — | `Type` | `EquipmentContentType.Other` |
| — | `Quantity` | `1` |
| `PhotoPath` | `PhotoPath` | Reutilizar ruta/nombre en carpeta de maquinaria del mismo cliente si el archivo existe; si falta, `null` y advertencia |
| `Observations`, `Brand`, `Model`, `Serie`, `LocalCode`, `Ubication`, `DateOfPurchase`, `TechnicalSpecifications`, clasificación | `Notes` | Concatenar campos no vacíos con etiquetas legibles; fecha en `yyyy-MM-dd` |
| `CustomerId` | — | No duplicar; heredar del padre destino después de validar igualdad de cliente |

Una fila fuente crea una fila destino. No combinar nombres iguales ni modificar contenido ya existente.

## 3. Arquitectura y diseño técnico

### Entidades existentes y reutilización

| Entidad/servicio existente | Significado de negocio | Uso en el plan |
|---|---|---|
| `Equipment` (`Equipment`) | Activo del inventario; Mobiliarios es categoría 3 | Origen a importar y padre destino de Amenidades/Áreas Comunes; no cambia esquema |
| `EquipmentContent` (`EquipmentContents`) | Grupo de objetos dentro de un padre | Destino; su migración de tabla ya existe y debe estar aplicada en el ambiente |
| `AssetMigrationLog` (`AssetMigrationLog`) | Trazabilidad origen→destino con índice único `(SourceTable, SourceId)` | Reutilizar con constante `SourceTable="Equipment-Mobiliarios"`, `SourceId=Equipment.Id`, `TargetId=EquipmentContent.Id`; no crear tabla nueva |
| `IFileStructureResolver` + `IFileProvider` | Construyen ruta relativa y comprueban/eliminan/mueven archivos sin exponer rutas físicas | Resolver la foto y dependencias por cliente, verificar disponibilidad y borrar archivos de dependientes tras commit |
| `IFileWritePathService.MachineryDirectory` + `IFileReadPathService.GetMachineryFilePath` | Directorio/URL segura para fotos de maquinaria por cliente | Ambas entidades ya comparten directorio; transferir referencia de foto, no mover bytes |
| `EquipmentContentAppService` | CRUD y validación tenant/categoría de contenidos | Reutilizar validación y permisos; separar operación batch compleja en caso de uso específico |

Reconocimiento de entidades completo: carpeta `Infrastructure/Data/Entities/MaintenanceLuxuryApp/Machinery` contiene 5 clases revisadas (`Equipment`, `EquipmentContent`, `EquipmentFireDetails`, `EquipoClasificacion`, `AssetMigrationLog`). `EquipmentFireDetails` se excluye como origen válido: corresponde a categoría Contra incendio=10; si apareciera relacionado a un `Equipment` Mobiliarios se contabiliza como dependencia anómala en vista previa y se elimina bajo la regla de cascada confirmada. `EquipoClasificacion` se lee para conservar su descripción en Notes, no se altera. Los dependientes adicionales viven en sus submódulos: EquipmentDocuments, MaintenanceCalendars, ServiceOrders, MaintenanceLogs, inspecciones y TaskRecords.

### API propuesta

Agregar un caso de uso `EquipmentContentImportAppService` en `Modules/MaintenanceLuxuryApp/Machinery/EquipmentContents/Services/`, conectado a interfaz/endpoints existentes del submódulo.

| Operación propuesta | Contrato | Función |
|---|---|---|
| Listar candidatos | `GET /api/equipment-contents/import-candidates/{targetEquipmentId}` | Validar padre; traer `Equipment` Mobiliarios activos del mismo cliente con metadatos y resumen de dependencias/fotos faltantes |
| Importar selección | `POST /api/equipment-contents/import-furniture` | Recibir padre + lista de `EquipmentId`; validar/ejecutar cada artículo en transacción independiente y devolver resultado de cada uno |

El nombre/ruta se confirma contra catálogo de endpoints durante implementación; no agregar CRUD de `Equipment` paralelo.

### Pasos por artículo dentro de importación

1. Abrir transacción EF Core para un solo `EquipmentId`.
2. Revalidar destino y origen en BD: destino categoria 2/8; origen categoría 3, `State.Activo`, mismo `CustomerId`, no importado previamente.
3. Recalcular dependencias y cierre transitivo de tareas en BD; no confiar en el preview del cliente. Mantener conjunto visitado y detectar ciclos antes de borrar.
4. Construir contenido según tabla de mapeo. Resolver la ruta relativa con `IFileStructureResolver` y comprobar el archivo vía `IFileProvider.FileExists`; si no existe, guardar `PhotoPath=null` y preparar advertencia.
5. Insertar `EquipmentContent` y fila `AssetMigrationLog` source→target dentro de la misma transacción.
6. Eliminar dependencias en orden FK seguro y eliminar fila `Equipment` fuente; guardar y hacer commit.
7. Solo tras commit, borrar físicamente archivos de documentos/evidencias pertenecientes al árbol eliminado. Nunca borrar la foto primaria que ahora referencia `EquipmentContent`. Si una ruta tiene referencias sobrevivientes, conservarla.
8. Devolver `Imported`, `Failed` o `ImportedWithCleanupWarning`, con IDs, conteos por tipo y advertencias comprensibles; nunca devolver rutas físicas. Un fallo previo al commit revierte solo ese artículo y el proceso continúa con el siguiente.

### Alcance de cascada solicitado

Preflight y borrado deben enumerar todos los registros cuyo FK apunta al equipo origen y sus descendientes. Inventario conocido a verificar exhaustivamente contra el modelo EF en fase backend:

| Rama | Registros a eliminar |
|---|---|
| Equipo | `Equipment` fuente después de crear destino/log |
| Documentación/evidencia del equipo | `EquipmentDocuments` y archivos físicos asociados |
| Mantenimiento | `MaintenanceLogs`, `MaintenanceCalendars`, `BudgetExecution` con `MaintenanceCalendarId` asociado y notificaciones SignalR `remove`; no borrar transacciones contables reales ni catálogos |
| Operación | `ServiceOrders` ligadas al `Equipment`, `ServiceOrderImages`, `ServiceOrderFiles`, `ServiceOrderFollowUps` y archivos físicos |
| Tickets ligados a órdenes | Borrar `TaskServiceOrders` vinculados; borrar `TaskRecord` completo aunque también esté ligado a otras órdenes; borrar vínculos a esas otras órdenes, pero conservar las órdenes de equipo no seleccionado |
| Árbol y dependencias del ticket | Borrar recursivamente subtareas (`ParentTaskId`) y tareas que dependan de tickets borrados (`DependsOnTaskId`), con attachments, follow-ups, evidence images, imágenes adicionales, responsables y read records; conservar `RecurringTaskTemplate` y otras instancias fuera del cierre transitivo |
| Otros dependientes directos | Bitácoras de elevador/emergencia, `LightingStock`, `PaintStock`, QR labels, InspectionAssetItems y otros FKs reales detectados por inventario de modelo; borrar filas enlazadas y archivos propiedad de esas filas |
| Referencias compartidas | Conservar Customer, usuarios/empleados, proveedores, razones de suspensión, grupos de trabajo, plantillas recurrentes, órdenes no seleccionadas y catálogos; limpiar únicamente sus vínculos a los registros eliminados |

La operación no cambia `DeleteBehavior` global de FKs ni reutiliza `MachineryAppService.DeleteAsync`, porque ese método borra físicamente la foto fuente que se debe preservar. El servicio nuevo orquesta las eliminaciones explícitamente. Si el FK real difiere de esta tabla, el inventario y orden de borrado se corrigen antes de habilitar la acción.

### UI Angular

- Añadir botón temporal **Importar mobiliario** dentro del contexto del `EquipmentContent` del padre seleccionado o junto a su acción Contenidos, solo cuando categoría del destino sea Amenidades/Áreas Comunes y existan candidatos activos.
- Modal responsive: tabla/lista de candidatos activos de categoría Mobiliarios, selección múltiple, foto/nombre/ubicación y búsqueda/filtro.
- Al continuar, pantalla de revisión: destino, elementos elegidos, transformación (tipo Otros/cantidad 1), conteos de dependencias por clase, tickets/tareas dependientes que desaparecerán aunque tengan vínculos externos, órdenes que se conservan, plantillas/instancias que se preservan, foto faltante y advertencia de borrado irreversible.
- Confirmación explícita con CTA que nombre la acción; después mostrar resultado por artículo y permitir cerrar/reintentar fallidos. No ocultar error de cleanup físico.
- Recargar contenidos, lista destino y candidatos al concluir. Consultar candidatos de nuevo; ocultar el botón al retornar cero candidatos activos.
- Usar servicios UI/APIs compartidas y Reactive Forms/tipado vigente. No tocar `SelectItem` ni catálogo shared.

### 3.5 Migración de datos y prevención de pérdida

**Tipo:** migración de datos ejecutada por API/.NET por solicitud del usuario; sin migración de esquema prevista, pues `EquipmentContents` y `AssetMigrationLog` ya existen. No requiere SQL manual ni cambio EF nuevo.

**Responsable:** Tech Lead habilita tras verificar backup/restauración de SQL Server y almacenamiento de archivos; Owner de Mantenimiento aprueba tabla de cascada y copia de seguridad.

| Datos | Acción | Riesgo | Mitigación |
|---|---|---|---|
| `Equipment` fuente Mobiliarios activos | Convertir en una fila de `EquipmentContent`, `AssetMigrationLog` y eliminar origen | Pérdida de atributos no mapeados | `Notes` etiquetadas con todos los campos restantes; export backup preflight |
| Dependientes y registros de historial | Hard-delete según cascada aprobada | Pérdida irreversible, incluso tickets usados por otros flujos | Preview con cantidades/vínculos externos, confirmación, backup y resultados por artículo |
| Foto principal | Reutilizar nombre relativo existente; conservar bytes | `DeleteAsync` convencional podría borrar archivo | No invocar rutina normal de baja de Machinery; excluir photoPath origen de cleanup |
| Archivos de dependientes | Eliminar tras commit si no quedan referencias | Archivo huérfano o archivo compartido borrado | Resolver rutas oficiales, verificar referencias sobrevivientes, log de cleanup pendiente |
| Trazabilidad | Insertar `AssetMigrationLog` único source→target | Duplicado por retry/race | Índice único existente, check antes de importar y transacción por artículo |

**Secuencia preflight/ejecución:** backup completo de BD y archivos, restore test en entorno no productivo, consulta del total candidatos por cliente, export/lista de dependencias a borrar, despliegue API/UI, piloto controlado, comparar resultados por item, habilitar resto, mantener backup hasta aprobar post-review.

**Validación post-import:** por cada éxito, una fila destino con campos aprobados, fila fuente ausente, log source→target presente, dependencias inventariadas ausentes, plantillas/órdenes preservadas conforme regla, foto activa o `null` con aviso. Por cada fallo, fuente/dependencias originales presentes y cero contenido/log parcial. Comparar conteos antes/después por entidad. Cleanup pendiente debe ser visible y reconciliable.

## 4. Backlog de tareas

- [ ] Tech Lead aprueba FASE 0, cascada exacta, backup y esta revisión del plan.
- [ ] Inventariar exhaustivamente todas las FKs directas e indirectas desde Equipment en EF y tablas; diseñar orden topológico de borrado.
- [ ] Confirmar `AssetMigrationLog` como registro fuente→EquipmentContent con constante estable `Equipment-Mobiliarios`; no crear esquema nuevo.
- [ ] Definir DTOs preview, request y resultado por artículo; contratos y errores parciales.
- [ ] Implementar candidatos, tenant/category/state validation, mapping, idempotency y transacción por artículo.
- [ ] Implementar árbol de borrado y cleanup de archivos post-commit con exclusión/protección de foto y referencia compartida.
- [ ] Actualizar SignalR para presupuestos proyectados ligados a calendarios eliminados.
- [ ] Implementar acción temporal, selección múltiple, vista previa de cascada, confirmación y respuesta por artículo.
- [ ] Añadir pruebas backend, API, storage y Angular (happy/sad/edge); correr builds.
- [ ] Ejecutar backup/restore test y piloto por cliente bajo autorización Tech Lead.
- [ ] Actualizar README/decisiones/documentación de Machinery/EquipmentContents y anotar que este plan supersede el fuera-de-alcance del plan 20261002 solo para artículos seleccionados.

## 5. Fases de ejecución

### Fase 1 — Preflight de modelo, dependencias y restauración (M)

- Enumerar FKs y archivos desde `Equipment`, `MaintenanceCalendars`, `ServiceOrders`, TaskRecords e inspecciones/stock; reconocer relaciones compartidas, recurrence y ServiceOrders ajenas.
- Probar backup restaurable DB+archivos, definir manifest/retención antes de activar función.
- Gate: el checklist de dependencias concuerda con el modelo snapshot y no hay referencias sin política de eliminación/conservación.

### Fase 2 — Caso de uso backend por artículo (L)

- Candidatos/preview; mapping y AssetMigrationLog; autorización tenant; cascada de BD en transacción independiente; cleanup físico después de commit; aviso si foto no existe o cleanup falla.
- Gate: pruebas demuestran rollback del item fallido, éxito parcial, idempotencia, cero foreign tenant, mapa completo y preservación de datos compartidos aprobados.

### Fase 3 — Experiencia temporal Angular (M)

- Botón contextual, selector de activos, resumen de dependencias/cascada, confirmación irreversible, resultados individuales y ocultamiento cuando no quedan candidatos.
- Gate: usuario no puede confirmar sin destino/selección; preview coincide con API; resultado distingue éxito, fallo y cleanup pendiente.

### Fase 4 — Validación integrada y habilitación controlada (M)

- Backup/restore, piloto con conjunto representativo (foto presente/faltante, sin dependencias, con todos tipos de dependencia, TaskRecord compartido, template recurrente); auditoría de conteos y resultado.
- Gate: Tech Lead aprueba piloto; rollback/recovery vigente; Owner confirma datos finales antes de liberar disponibilidad.

## 6. Criterios de completitud

- Solo origen activo `Mobiliarios` del mismo cliente; destino únicamente `Amenidades` o `AreasComunes` del mismo cliente.
- Cada fuente exitosa produce un contenido único con `NameMachinery`, `Type=Other`, `Quantity=1`, Notes con todos los campos fuente aprobados y `PhotoPath` según disponibilidad.
- La foto fuente existente continúa accesible desde destino; jamás se elimina como parte del cleanup de origen.
- La cascada coincide exactamente con tabla de dependencias; tickets completos y subtareas se eliminan según aprobación; plantillas recurrentes y otras instancias sobreviven; órdenes no seleccionadas se conservan con links a tickets eliminados retirados.
- Importación parcial procesa todos los artículos y devuelve resultados independientes; fallo transaccional conserva fuente y evita target/log parcial.
- Reimportar o carrera concurrente no crea duplicados por `AssetMigrationLog` único.
- No se borran datos/archivos pertenecientes a otro cliente ni filas fuera del árbol identificado/confirmado.
- Botón temporal solo se presenta en destino elegible y se oculta cuando no hay mobiliarios activos importables.
- Backup y restauración preflight verificados; reportes pre/post comparan conteos e IDs por dependiente.
- API tests, Angular tests y builds pasan; `git diff` no incluye otros cambios fuera de alcance.

## 7. Riesgos y mitigaciones

| Riesgo | Probabilidad/impacto | Mitigación | Owner |
|---|---|---|---|
| Cascada borra ticket/tarea dependiente usado por orden o flujo ajeno | Media / Crítico | Vista previa enumera cierre transitivo y vínculos externos; pantalla advierte que ticket, subtareas y dependientes se borran; backup verificado y confirmación explícita | Owner + Tech Lead |
| Grafo de subtareas/dependencias contiene ciclos o gran volumen | Baja / Alto | Detección con `HashSet`, no borrar artículo con ciclos, medir cantidad antes de confirmar y limitar concurrencia | Backend |
| FKs omitidas causan fallo posterior a algunas eliminaciones | Media / Alto | Transacción por artículo y auditoría del modelo completo antes de código | Backend |
| Archivo de foto se borra tras reusar `PhotoPath` | Baja / Crítico | Mantener allowlist de fotos fuente importadas; no llamar `MachineryAppService.DeleteAsync`; prueba con archivo real |
| Cleanup físico falla post-commit | Media / Medio | Resultado `ImportedWithCleanupWarning`, registro/log por IDs y reconciliación operativa |
| Referencia de archivo compartida se elimina aunque otro registro la use | Baja / Alto | Comprobar refs sobrevivientes antes de `DeleteFile`; si compartida, preservar |
| Lote grande excede tiempo/lock si todo se ejecuta junto | Media / Medio | Una transacción corta por artículo, procesar selección secuencial o con concurrencia limitada y configurable aprobada |
| API recibe un destino/cliente manipulado | Baja / Crítico | Resolver el cliente de ambos Equipment en el servidor; comparación exacta; autorizaciones actuales |
| Varios usuarios importan mismo mobiliario simultáneamente | Baja / Alto | Unique log source-table/source-id, captura y manejo de violación unique; refetch candidate tras error |

## 8. Dependencias e impactos

- Requiere que la tabla `EquipmentContents` y el índice único existente de `AssetMigrationLog` estén aplicados en el ambiente vía el proceso .NET/API habitual.
- Backend Machinery + EquipmentContents; dependencia operativa de `ApplicationDbContext` y servicios estándar de archivo (`IFileStructureResolver`, `IFileProvider`, `ISecureFileStorageService`/servicios existentes).
- Accounting/ProjectedExpenses: eliminar solamente `BudgetExecution` asociado a `MaintenanceCalendarId` fuente y notificar eliminación después de commit.
- Operations/ServiceOrders y Tasks: eliminar árbol de ticket asociado según scope confirmado; mantener otras órdenes y sus catálogos compartidos.
- Angular EquipmentContents y Machinery list; reusar content roles, dialog, select, preview patterns y tokens existentes.
- Tech Lead/DBA y storage owner: backup, restore test, retención y acceso a logs.
- No depende de nueva tabla, enum, catálogo, servicio externo ni cambio de RBAC.

## 9. Métricas de éxito

Aplicar KPIs de FASE 0 por cliente y lote. El reporte final debe comparar cantidad seleccionada, importada, fallida, `Equipment` fuente eliminada, `EquipmentContent` creado, dependencias eliminadas por tipo, fotos conservadas/faltantes, warnings de storage e IDs source→target. Meta: 100% de operaciones en un estado terminal consistente, 0 duplicados y 0 datos/archivos de otro cliente eliminados.

## 10. Rollback y recuperación

### Antes de commit por artículo

- Toda fila nueva, AssetMigrationLog y borrado relacional ocurren dentro de transacción. Error => rollback de ese artículo; la operación por lote sigue con otros.
- Ningún archivo de dependencia se borra antes del commit. Foto principal no se programa para borrar.

### Después de artículo exitoso

- El borrado aprobado es irreversible desde UI. `AssetMigrationLog` conserva mapping, no snapshot de todos los datos.
- Antes de habilitar, Tech Lead debe validar backup SQL Server y backup del almacenamiento del cliente; verificar restore en ambiente aislado y acordar retención hasta el post-review.
- Recuperación de un artículo después de commit: restaurar datos y archivos desde backup verificado o reconstruir manualmente usando el mapping y manifest; no prometer rollback automático ni ejecutar `DROP`/SQL manual.
- Si archivos dependientes no pudieron limpiarse, el item queda importado con warning; conciliar filesystem con el resultado y borrar solo archivos huérfanos confirmados.
- Si el piloto detecta alcance incorrecto, ocultar acción temporal, no ejecutar más imports y restaurar desde backup en proceso aprobado por Tech Lead.

**Clasificación:** reversible dentro de transacción antes del commit por artículo; irreversible como operación individual después del commit, con recuperación por backup. No existe reversión automática para datos históricos borrados.

## 11. Revisión post-implementación

- Revisar conteos de éxito/fallo/cleanup pending y comparar contra vista previa.
- Verificar tabla de fuente/destino en AssetMigrationLog, filas Equipment importadas ausentes y EquipmentContents creados.
- Confirmar fotos fuente existentes accesibles y todas las dependencias/listas de archivos borradas conforme al resultado.
- Confirmar que no se borraron otras ServiceOrders, clientes, catálogos o plantillas recurrentes.
- Verificar que la acción dejó de mostrarse al agotarse Mobiliarios activos; documentar remanentes inactivos fuera de alcance.
- Cerrar backup de operación según política del Tech Lead; retener evidencia del preflight/piloto y advertencias reconciliadas.

## Checklist de aprobación

- [x] Tipo y cantidad por artículo: `Other`, `1`.
- [x] Notas preservan observaciones y campos adicionales con etiquetas.
- [x] Foto faltante importa sin imagen y genera aviso.
- [x] Origen permitido: solo Mobiliarios activos del mismo cliente.
- [x] Destino permitido: Amenidades o Áreas Comunes.
- [x] Cascada: dependencias, tickets, subtareas y tareas dependientes se borran; plantilla recurrente y otras instancias fuera del cierre transitivo se conservan.
- [x] Errores parciales: se reportan por artículo, no revierten otros éxitos.
- [x] Acción temporal se oculta cuando no quedan candidatos.
- [ ] Tech Lead aprueba inventario completo de FKs, backup/restore y habilitación controlada antes de implementación.
- [ ] Tech Lead aprueba eliminación explícita de tickets compartidos y sus vínculos externos al confirmar cada lote.
