# Plan de implementación: modalidad de ejecución de mantenimiento

> **Estado:** Borrador para revisión y aprobación del Tech Lead  
> **Tipo:** Ampliación transversal de MaintenanceCalendars y ServiceOrders  
> **Dominio rector:** MaintenanceLuxuryApp  
> **Fecha:** 2026-10-03  
> **Owner técnico esperado:** `@equipo-mantenimiento` + `@equipo-operaciones`  
> **Origen:** Solicitud de distinguir mantenimiento realizado por personal interno del servicio asignado a proveedor.

## FASE 0. Pre-planeación

### 0.1 Problema y KPIs

Actualmente, el equipo de mantenimiento no puede identificar explícitamente quién ejecutará un mantenimiento al planificarlo o registrar una orden; la ausencia de proveedor no distingue trabajo interno de proveedor aún no asignado. Esto dificulta clasificar y coordinar calendarios y órdenes.

Esto afecta la planeación de mantenimiento y la operación de órdenes de servicio en los clientes que usan ambos flujos.

| Métrica | Baseline | Target | Timeline | Verificación |
|---|---|---|---|---|
| Calendarios nuevos con modalidad persistida | 0%; campo no existe | 100% de calendarios creados | QA antes de liberar | Pruebas API/UI de creación y lectura |
| Órdenes manuales con modalidad persistida | 0%; campo no existe | 100% de órdenes nuevas | QA antes de liberar | Pruebas API/UI de creación y lectura |
| Órdenes generadas desde calendario que conservan modalidad | 0%; dato no existe | 100% coincide con calendario al generarse | QA antes de liberar | Prueba de generación y comparación de ambos registros |

### 0.2 Reglas de negocio

| ID | Nivel | Regla | Componentes trazables |
|---|---|---|---|
| RN-MNT-001 | 1 — Dominio | La modalidad de ejecución es dato explícito; nunca se infiere de `ProviderId`. | `MaintenanceCalendar.cs:21-27`; `ServiceOrder.cs:37-45` |
| RN-MNT-002 | 1 — Dominio | `IsInternalExecution=true` significa ejecución por personal interno y requiere `ProviderId=null` en calendario y orden. | Entidades anteriores; validación de AppServices por definir en implementación |
| RN-MNT-003 | 2 — Flujo | La modalidad inicia en `false` para calendarios y órdenes nuevos; las filas existentes se migran a `false`. | DTOs y formularios de ambos submódulos; migración EF |
| RN-MNT-004 | 2 — Flujo | Una orden generada desde calendario copia modalidad, equipo, actividad y proveedor compatible con modalidad. | `ServiceOrderAppService.cs:857-909` |
| RN-MNT-005 | 2 — Flujo | Al cambiar calendario, se sincronizan modalidad y proveedor solo en órdenes vinculadas pendientes; órdenes finales conservan su historial. | `MaintenanceCalendarAppService.cs:155-300` |
| RN-MNT-006 | 3 — Seguridad | Las nuevas lecturas/escrituras mantienen autorización y aislamiento por cliente existentes; no se agregan roles ni se aceptan cambios de tenant por el nuevo campo. | `ServiceOrderAppService.cs:434-446,616-645`; endpoints actuales |
| RN-MNT-007 | 4 — Validación | En calendario, proveedor es obligatorio cuando la modalidad es externa y se limpia al elegir interno. En ServiceOrder, proveedor sigue opcional; interno lo limpia. La UI refleja en vivo todas las validaciones de negocio ejecutadas por API para estos formularios. | `Create/UpdateMaintenanceCalendarDTO`; `Create/UpdateServiceOrderDTO`; `ServiceOrderAppService.ValidateCoherence`; formularios Angular |
| RN-MNT-008 | 4 — Datos | `MaintenanceCalendar.ProviderId` debe aceptar NULL para representar calendario interno; relaciones y DTOs reflejan opcionalidad sin borrar proveedores históricos. | `MaintenanceCalendar.cs:21-27`; `MaintenanceCalendarMapper.cs`; migración |

### 0.3 Pre-mortem y flujos críticos

| Supuesto fallido | Impacto | Probabilidad | Mitigación | Owner |
|---|---|---|---|---|
| Un formulario marca interno, pero omite modalidad en el payload | Persistencia incorrecta o discrepancia entre capas | Media | Default explícito `false`, contratos tipados y pruebas de round-trip | Backend + Frontend |
| La columna nullable se despliega sin validar todos los consumidores de `ProviderId` | Lecturas fallidas o error de EF al materializar NULL | Media | Buscar usos de `MaintenanceCalendar.ProviderId`, ajustar DTOs/proyecciones y probar lectura real con NULL | Backend |
| Cambio de calendario actualiza órdenes concluidas | Historial operativo alterado | Baja | Filtrar sincronización por `Status == Pendiente`; probar estados finales | Backend |
| Internal true conserva proveedor obsoleto | Datos contradictorios en órdenes y calendarios | Media | Limpiar ProviderId en API y UI; prueba de transición externo→interno | Backend + Frontend |

**Happy path:** crear calendario interno → el formulario limpia proveedor → API guarda `IsInternalExecution=true` y `ProviderId=null` → generación crea orden con misma modalidad y sin proveedor. **PASS:** valores coinciden tras releer ambos registros.

**Sad path:** cliente envía calendario externo sin proveedor → API rechaza con validación de negocio clara; cliente envía interno con proveedor → API normaliza proveedor a NULL o rechaza de manera coherente con regla aprobada. **PASS:** no persiste combinación contradictoria. Preferencia del plan: normalizar a NULL.

**Edge path:** cambiar calendario con órdenes pendientes y concluidas de externo a interno → órdenes con `Status == Pendiente` cambian y limpian proveedor; las concluidas/finales permanecen intactas. Una orden suspendida conserva su estatus según el modelo actual; si sigue `Pendiente`, entra en esta sincronización. **PASS:** comparación antes/después confirma alcance exacto.

## 1. Resumen ejecutivo

Agregar modalidad booleana `IsInternalExecution` a `MaintenanceCalendar` y `ServiceOrder`. Calendarios distinguen ejecución interna de asignación externa, órdenes manuales capturan la misma opción, y órdenes autogeneradas heredan el valor del calendario. Proveedor queda independiente de la modalidad excepto que modalidad interna lo limpia; en calendario externo sigue obligatorio como hoy y en órdenes sigue opcional. Filas actuales se clasifican como `false`, decisión confirmada por el solicitante.

## 2. Alcance y restricciones

### Incluye

- Persistencia en entidades, migración, DTOs, mapeos y validación de API.
- Formularios de calendario de mantenimiento y de órdenes de servicio.
- Propagación calendario→orden autogenerada y sincronización de órdenes pendientes al editar calendario.
- Lecturas/listados que exponen calendario u orden para que devuelvan la nueva propiedad.
- Pruebas de dominio, API/servicio y frontend pertinentes.

### Excluye

- Cambiar `Equipment.State` o asignar empleados ejecutores concretos.
- Cambiar contabilidad, precios, presupuestos o el catálogo de proveedores.
- Rediseñar reportes/PDF o alterar fotos/documentos de órdenes.
- Cambiar permisos, roles, rutas públicas o el significado de `ProviderId` en otros módulos.

### Decisiones aprobadas para este borrador

- Nombre técnico propuesto: `IsInternalExecution`; etiqueta UI: **“Lo realiza personal interno”**.
- Booleano no nullable; default `false` para filas existentes y nuevas.
- La propiedad aparece en calendario y en toda orden nueva, incluida orden manual/correctiva.
- Si modalidad interna: `ProviderId=null`; si modalidad externa en calendario: proveedor obligatorio; en orden: proveedor opcional.
- Cambios en calendario sincronizan solo órdenes vinculadas pendientes; órdenes finales preservan historia.

## 3. Arquitectura y diseño técnico

### Entidades existentes y reutilización

| Entidad | Uso de negocio | Reutilización / cambio |
|---|---|---|
| `Equipment` (`Equipment`) | Activo/instalación del cliente, con estado y categoría | Sin cambio; sigue siendo dueño de calendarios y órdenes |
| `MaintenanceCalendar` (`MaintenanceCalendars`) | Programa actividad, recurrencia, costo y proveedor por equipo/mes | Añadir `IsInternalExecution`; hacer nullable `ProviderId` en modelo y BD para permitir interno |
| `ServiceOrder` (`ServiceOrders`) | Solicitud/ejecución, estado, fechas, proveedor y evidencias | Añadir `IsInternalExecution`; orden manual selecciona modalidad; generación copia modalidad del calendario |
| `Provider` | Catálogo de proveedor asociado | Se reutiliza; no se agrega catálogo alterno ni se infiere modalidad de su presencia |

No crear entidad nueva: la modalidad pertenece al calendario planeado y a la orden ejecutada. Guardarla en ambas conserva el dato operativo de cada orden aunque luego se edite/elimine/desvincule calendario.

### Backend

- Agregar `bool IsInternalExecution { get; set; }` a `MaintenanceCalendar` y `ServiceOrder`, mapeado por convención a columnas `IsInternalExecution`.
- Definir default C# y de migración `false`.
- Cambiar `MaintenanceCalendar.ProviderId` de `Guid` a `Guid?`; navegación `Provider` nullable. La FK conserva `DeleteBehavior.Restrict`; no se elimina proveedor.
- Cambiar `CreateMaintenanceCalendarDTO.ProviderId` y `UpdateMaintenanceCalendarDTO.ProviderId` a `Guid?`; incluir propiedad booleana en create/update/response/list DTOs y mapper.
- Incluir la propiedad en `CreateServiceOrderDTO` (heredado del update DTO), `UpdateServiceOrderDTO`, `ServiceOrderDTO` y mapper.
- Validar en servidor: calendario externo requiere proveedor; interno fuerza proveedor NULL. Orden interna fuerza proveedor NULL; externa acepta proveedor NULL o asignado.
- Implementar equivalencia de validaciones en formularios Angular en tiempo real: campos requeridos, actividad obligatoria, precio no negativo, fecha de ejecución no anterior a solicitud, fecha requerida al concluir, proveedor condicional del calendario y limpieza del proveedor en modo interno. Bloquear guardar y mostrar error junto a la regla al cambiar valores.
- Para reglas dependientes del estado (equipo existente/perteneciente al cliente, empleado válido, orden final no editable), reflejar la restricción con opciones tenant-scoped y estado del formulario; donde el estado actual solo pueda determinarlo API, ejecutar validación asíncrona al seleccionar y cada vez que cambie un dato relacionado, mostrar el resultado inmediatamente y deshabilitar Guardar mientras la validación esté pendiente o inválida. API conserva validación autoritativa y mismo criterio.
- En `CreateOrderMaintenance`, copiar `IsInternalExecution`; copiar proveedor solo si modo externo.
- En `MaintenanceCalendarAppService.UpdateAsync`, propagar modo a órdenes pendientes ligadas a ocurrencias actualizadas. Si interno, limpiar proveedor; si externo, sincronizar proveedor seleccionado del calendario. No mutar órdenes finales.
- Ajustar `GetAllAsync`, `GetOfMachineryAsync`, vistas de inventario, DTOs de cronograma/listado y consultas de ServiceOrder que proyectan valores manualmente.

### Frontend Angular

- Calendario: ampliar `mantenimiento-preventivo-form.ts/html`; switch nuevo default false. Interno limpia/deshabilita selector de proveedor y elimina validación requerida de ese control; externo mantiene proveedor obligatorio. Validar al vuelo equipo, actividad, proveedor condicional, recurrencia/tipo/mes y demás campos requeridos por contrato/API.
- Orden: ampliar `service-order-form.ts/html`; switch default false. Interno limpia/deshabilita proveedor; externo deja proveedor opcional. Validar al vuelo reglas de `ValidateCoherence` (actividad, precio, fechas y estado concluido), responsable y selección de equipo; bloquear envío inválido y mostrar errores específicos.
- Mantener matriz API↔Angular de reglas y mensajes. Cada regla de negocio que rechaza API tiene equivalente visible en frontend antes de enviar; reglas dependientes de datos se revalidan al cambiar equipo, modalidad, estado o fechas.
- Antes de implementar, inventariar todas las validaciones efectivas del API en DTOs, entidades y AppServices; agregar una fila por regla a la matriz API↔Angular. No dejar validaciones de entrada o de negocio solo del lado API. La autorización y seguridad del servidor siguen obligatorias aunque UI también guíe/deshabilite controles.
- DTO/interfaces y normalización de carga deben conservar `IsInternalExecution` al editar/cargar/copiado.
- Mostrar modalidad en resumen/listado de calendarios y órdenes donde ya se presenta proveedor/actividad; no rediseñar reporte PDF en esta entrega.

### Seguridad

No se cambia superficie de autorización. API deriva el cliente del equipo y conserva `EnsureTenantAccess`; no confiar en un `CustomerId` recibido para autorizar la modalidad.

### 3.5 Migración de datos y prevención de pérdida

**Responsable:** Tech Lead crea/revisa migración, la ejecuta y confirma validación.

| Tabla | Cambio | Riesgo | Mitigación |
|---|---|---|---|
| `MaintenanceCalendars` | Añadir `IsInternalExecution bit NOT NULL DEFAULT 0`; permitir `ProviderId NULL` | Bajo/medio: consumidores que asumen proveedor requerido pueden romperse | Buscar todas las lecturas; actualizar entidad/DTO/UI antes de habilitar internos; probar calendario con NULL |
| `ServiceOrders` | Añadir `IsInternalExecution bit NOT NULL DEFAULT 0` | Bajo: columna aditiva | Default DB/C# false; verificar recuento y lectura de órdenes existentes |

La migración no debe actualizar ni borrar valores actuales de proveedores ni modificar órdenes/calendarios existentes aparte de asignar `false` a la columna nueva. No inferir modalidad histórica a partir de `ProviderId`.

**Secuencia EF Core/.NET:** (1) backup verificado; (2) crear migración EF Core que agrega ambas columnas con default false y hace nullable `MaintenanceCalendars.ProviderId`; (3) revisar `Up`/`Down` generado; (4) aplicar mediante el mecanismo .NET/API del proyecto en desarrollo; (5) validar estado de migraciones y lectura/escritura desde API; (6) desplegar API compatible; (7) desplegar Angular; (8) habilitar capturas internas. No se crea ni ejecuta SQL manualmente.

**Verificación post-migración desde .NET/API:** confirmar migración aplicada, lectura de calendarios con proveedor NULL, preservación de proveedores previos y modalidad false histórica, y creación/consulta de calendario y orden internos. Tech Lead revisa migración EF y evidencia/logs de aplicación.

**Validación post-migración:** recuento de filas antes/después sin cambios; todos los registros previos tienen `IsInternalExecution=false`; IDs de proveedor existentes idénticos; FK e índices presentes; se puede guardar/releer calendario interno sin proveedor y orden interna sin proveedor.

**Rollback:** antes de habilitar internos, rollback de código es seguro manteniendo columnas aditivas y columna nullable. Después de guardar calendarios internos, regresar al modelo previo (`ProviderId NOT NULL`) no es automáticamente reversible: congelar escrituras, respaldar datos y preferir forward-fix; rollback de esquema solo con resolución explícita de calendarios internos sin proveedor y protección del valor de modalidad, sin borrar información silenciosamente.

## 4. Backlog de tareas

- [ ] Confirmar plan, reglas y owner con Tech Lead.
- [ ] Inspeccionar todos los consumidores de `MaintenanceCalendar.ProviderId` y contratos Angular actuales.
- [ ] Diseñar migración EF y rollback detallado; no generar ni ejecutar SQL manual.
- [ ] Modificar entidades, DTOs, mapper, validadores y proyecciones API.
- [ ] Propagar modalidad en generación automática y sincronización de pendientes.
- [ ] Actualizar formularios y vistas de calendario/orden.
- [ ] Agregar pruebas unitarias, integración de persistencia y componente/UI.
- [ ] Ejecutar migración en desarrollo y validación post-migración.
- [ ] Ejecutar gates backend/frontend y revisar diff de contratos.
- [ ] Actualizar README/documentación de ambos submódulos si reglas/endpoints documentados cambian.

## 5. Fases de ejecución

### Fase 1 — Contratos y expansión de esquema (S)

- Entidades, migración EF Core revisada/aplicada desde .NET/API y DTOs nullable donde aplique.
- Criterio de paso: migración EF aplica mediante .NET/API en DB de desarrollo; registros previos permanecen con mismos IDs/proveedores y `false`.

### Fase 2 — Reglas y flujos API (M)

- Validación interna/externa, creación manual, autogeneración y sync solo de pendientes.
- Criterio de paso: pruebas prueban ambos modos, proveedor null según regla y preservación de órdenes finales.

### Fase 3 — UI Angular (M)

- Switches, default No, limpieza de proveedor al elegir interno y validación en vivo equivalente a todas las validaciones API de calendario/orden.
- Criterio de paso: matriz completa sin reglas de entrada/negocio exclusivas del API; formularios aplican esas reglas mientras se edita, muestran errores específicos inmediatamente, revalidan dependencias y bloquean Guardar si inválido; build/test Angular pasa.

### Fase 4 — Integración y rollout (S)

- Migrar DB dev, probar flujos completos, actualizar documentación y desplegar en orden compatible.
- Criterio de paso: checklist post-migración y smoke tests PASS; Tech Lead aprueba habilitación.

## 6. Criterios de completitud

- Se cumplen RN-MNT-001…008.
- Calendario interno persiste `ProviderId=null`; calendario externo sin proveedor es rechazado.
- Orden manual interna/external guarda modalidad; proveedor se limpia para interna y permanece opcional para externa.
- Orden autogenerada hereda modalidad desde el calendario.
- Editar calendario sincroniza modalidad/proveedor solo en órdenes asociadas con `Status == Pendiente`; órdenes concluidas/finales no se alteran. Órdenes suspendidas con estatus Pendiente siguen incluidas porque suspensión no cambia estatus.
- `ProviderId=null` se materializa y serializa correctamente en todos los endpoints afectados.
- Migración preserva filas y proveedores previos; rollback documentado en función de si ya hay calendarios internos.
- API Release build, pruebas focalizadas backend y Angular build/pruebas afectadas pasan; matriz de paridad confirma validaciones API reflejadas en vivo en UI; revisión de diff sin cambios fuera de alcance.

## 7. Riesgos y mitigaciones

| Riesgo | Probabilidad / impacto | Mitigación | Owner |
|---|---|---|---|
| Proyección/API omite el campo en alguna pantalla | Media / Media | Inventario de DTOs y prueba de recorrido completo en formularios/listados | Backend + Frontend |
| La nulabilidad de proveedor rompe materialización o validación existente | Media / Alta | Búsqueda completa, migración primero en dev, pruebas para ProviderId NULL en lecturas críticas | Backend |
| Cambio de calendario toca órdenes históricas | Baja / Alta | Actualizar solo estado Pendiente; pruebas por estados | Backend |
| Rollback de esquema después de usar interno pierde dato o queda imposible por FK NOT NULL | Media / Alta | Conservar columnas, congelar reversión destructiva, preferir forward-fix y backup | Tech Lead |
| API cliente antiguo manda payload sin propiedad | Media / Baja | Default false en DTO/entidad; ventana compatible; validación de proveedor consistente | Backend |

## 8. Dependencias e impactos

- `MaintenanceCalendars` API y formulario Angular preventivo: hoy proveedor obligatorio; requiere opción condicional y nulabilidad.
- `ServiceOrders` API, DTO y formulario Angular: requiere propiedad independiente también para creación manual.
- Generador automático de órdenes desde calendario: hereda modalidad y proveedor permitido.
- Vistas Equipment/inventario que exponen calendario y vistas de ServiceOrder: añadir propiedad a proyecciones relevantes.
- Base de datos SQL Server y migración EF Core; requiere backup/ambiente de desarrollo y aprobación del Tech Lead.
- No hay dependencia de nuevos roles, servicios externos ni catálogos compartidos.

## 9. Métricas de éxito

Se aceptan KPIs FASE 0: 100% de nuevos calendarios y órdenes conservan modalidad explícita y 100% de órdenes automáticas heredan modalidad del calendario. La verificación ocurre en pruebas automatizadas e integración de dev antes de liberar; no se fija fecha calendario sin estimación del equipo.

## 10. Plan de rollback

1. Si falla antes de habilitar capturas internas: revertir API/UI, conservar migración aditiva y valores false; no ejecutar `DROP COLUMN` automáticamente.
2. Si falla después de crear calendarios internos: deshabilitar temporalmente nuevas capturas y reparar hacia adelante. No volver a `ProviderId NOT NULL` mientras existan calendarios internos sin proveedor.
3. Para rollback destructivo autorizado: Tech Lead hace backup/verifica, exporta modalidad y relaciones, resuelve explícitamente cada calendario con proveedor NULL, valida órdenes; solo entonces restaura restricción anterior y revierte código. Si no es posible reconstruir proveedor/modo, restaurar backup completo aprobado o mantener esquema expandido.
4. No borrar datos ni recrear proveedor ficticio sin aprobación del dueño del dominio.

## 11. Revisión post-implementación

- Comparar KPIs contra resultados de pruebas y smoke test.
- Confirmar que ninguna modalidad se deriva de proveedor y ningún registro previo cambió de proveedor.
- Revisar logs de validación/rechazo de calendario externo sin proveedor.
- Confirmar que sincronización solo tocó órdenes pendientes asociadas.
- Registrar problemas de rollout y decisión final de retención del esquema nullable.

## Checklist y gate de aprobación

- [ ] Tech Lead confirma nombre/semántica `IsInternalExecution`.
- [ ] Tech Lead aprueba clasificación histórica `false`.
- [ ] Tech Lead aprueba proveedor requerido para calendario externo y limpio para interno.
- [ ] Tech Lead aprueba sincronizar solo órdenes pendientes.
- [ ] Tech Lead aprueba plan de migración y rollback antes de ejecución.
- [ ] Gates `node scripts/audit-conventions.mjs` y `node scripts/check-agent-rules.mjs` pasan antes de declarar plan aprobado.
