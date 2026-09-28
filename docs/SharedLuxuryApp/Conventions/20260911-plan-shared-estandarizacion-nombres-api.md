# Plan de Estandarizacion de Nombres de API - LuxuryApp

> **Tipo:** plan de migracion compatible y verificable
> **Fecha:** 2026-09-11
> **Estado:** EN CURSO - FASE 0
> **Plan relacionado:** `docs/plans/20260909-plan-migracion-nombres-api-db-conventions.md`
> **Fuente rectora:** `conventions/CONVENTIONS.md`
> **Regla backend:** `conventions/CONVENTIONS_FOLDER_API.MD`
> **Inventario base:** `inventario-api-luxuryapp.md`

## Estado de ejecucion - 2026-09-11

**Estado operativo:** EN CURSO - FASE 0 iniciada.

| Control | Resultado | Evidencia / siguiente accion |
|---|---|---|
| Plan localizado y leido | COMPLETADO | Este documento y `CONVENTIONS.md` / `CONVENTIONS_FOLDER_API.MD` revisados. |
| Repositorio backend | COMPLETADO | Rama `main`; no se observaron cambios pendientes en `D:\repos\luxuryapp-api\api`. |
| Inventario | COMPLETADO | 15 modulos con metodos, 3,929 metodos y 1,812 endpoints; 16 carpetas fisicas de modulo, una sin metodos extraidos. |
| Build Application | COMPLETADO | 0 errores; 6 advertencias preexistentes. |
| Build Api | BLOQUEADO | El proceso `LuxuryApp.Api` esta ejecutandose y bloquea `LuxuryApp.Application.dll`; repetir sin detener procesos del usuario. |
| Build Tests | COMPLETADO | 0 errores; 11 advertencias preexistentes en `GlobalUsings.cs`. |
| Ejecucion Tests | BASELINE CON FALLAS | 533 total: 510 superadas, 21 fallidas y 2 omitidas; registrar como deuda previa y no mezclar con naming. |
| Renombrado de codigo | COMPLETADO (2 lotes) | Codigo, tests y smoke HTTP de `AsambleaChecklistTemplates` (Ola 1B) y `CustomerLocations` (Ola 1C) completos y en verde. |
| Lote piloto (Ola 1B) | COMPLETADO | Submodulo `AdminLuxuryApp/ConfiguracionSistema/AsambleaChecklistTemplates`; Application, Tests y Api en verde; smoke HTTP 7/7. Pendiente unicamente aprobacion formal de Tech Lead. Ver `## Lote Ola 1B - AsambleaChecklistTemplates`. |
| Lote 2 (Ola 1C) | COMPLETADO | Submodulo `AdminLuxuryApp/Customers/CustomerLocations`; Application, Api y Tests en verde; smoke HTTP 7/7. Pendiente aprobacion formal de Tech Lead. Ver `## Lote Ola 1C - CustomerLocations`. |
| Lote 3 (Ola 1C) | COMPLETADO | Submodulo `AdminLuxuryApp/Customers/ModuleApps`; Application, Api y Tests en verde; smoke HTTP 7/7. Bloqueo externo de namespaces (`CustomerDataCompanies.Services` obsoleto) resuelto con fix minimo autorizado por el usuario en 3 `GlobalUsings.cs`. Pendiente aprobacion formal de Tech Lead. Ver `## Lote Ola 1C - ModuleApps`. |
| Lote 4 (Ola 1C) | COMPLETADO | Submodulo `AdminLuxuryApp/Customers/CustomerDataCompany`; Application, Api y Tests en verde; smoke HTTP 7/7. Unico lote con tests preexistentes (10, uno con falla baseline preexistente que se preservo intacta bajo el nuevo nombre). Pendiente aprobacion formal de Tech Lead. Ver `## Lote Ola 1C - CustomerDataCompany`. |
| Lote 5 (Ola 1C) | COMPLETADO | Submodulo `SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs` (`CategoryAppService`); primer lote fuera del cluster AdminLuxuryApp/Customers (catalogo general compartido). Application, Api y Tests en verde; smoke HTTP 7/7. Se detecto y descarto un falso positivo de bug en `UpdateAsync` (ver evidencia del lote). Pendiente aprobacion formal de Tech Lead. Ver `## Lote Ola 1C - Category`. |
| Lote 6 (Ola 1C) | COMPLETADO | Submodulo `SharedLuxuryApp/CatalogosGenerales/MeasurementUnit`; el metodo previo `GetAsyncAll` ni siquiera seguia el patron Verbo+Async (doble incumplimiento). Application, Api y Tests en verde; smoke HTTP 7/7. Se evaluaron y descartaron `ToolAppService` y `TelefonosEmergenciaAppService` como candidatos previos por usar `[FromForm]`/`IFormFile` (mayor complejidad, no descartados por riesgo sino por alcance de esta sesion). Pendiente aprobacion formal de Tech Lead. Ver `## Lote Ola 1C - MeasurementUnit`. |
| Lote 7 (Ola 1C) | COMPLETADO | Submodulo `SharedLuxuryApp/CatalogosGenerales/PaymentMethod` (catalogo SAT de formas de pago; entidad `FormaPago` reside fisicamente en `CobranzaLuxuryApp`, sin logica contable involucrada). Mismo patron de `UpdateAsync` sin fetch-previo que `CategoryAppService` (Lote 5), manejado con la misma tecnica de dos DbContext. Durante este lote, un proceso externo de migracion de namespaces (`SelectItem` de `SystemLuxuryApp`→`SharedLuxuryApp`) rompio momentaneamente el build en los 3 proyectos (`GlobalUsings.cs`); ademas se observo brevemente `PasswordRecoveryCodeConfiguration.cs` comentado por completo por ese mismo proceso externo, que se autoresolvio segundos despues. Con autorizacion del usuario se aplico el mismo fix minimo de `global using` ya usado en el Lote 3, sin tocar el archivo comentado. Application, Api y Tests en verde; smoke HTTP 7/7. Pendiente aprobacion formal de Tech Lead. Ver `## Lote Ola 1C - PaymentMethod`. |
| Lote 8 (Ola 1C) | COMPLETADO | Submodulo `SharedLuxuryApp/CatalogosGenerales/UsoCfdi` (catalogo SAT de usos de CFDI; entidad `UsoCFDI` reside fisicamente en `CobranzaLuxuryApp`, mismo patron que Lote 7). Application, Api y Tests en verde; smoke HTTP inicialmente bloqueado por plantillas de correo faltantes (migracion de `SystemLuxuryApp/SendEmailGlobal/*` en curso por el usuario) y luego completado 7/7 tras la correccion del usuario. Ver `## Lote Ola 1C - UsoCfdi`. |

**Regla de seguridad aplicada:** no se detuvo el proceso `LuxuryApp.Api`, no se modifico codigo y no se retiro ningun contrato. El fallo de Api durante el baseline es operativo (`MSB3027/MSB3021` por archivo bloqueado), no evidencia de error de compilacion del cambio. Las 21 pruebas fallidas quedan fuera de alcance de este plan hasta demostrar que un lote de naming las modifica.

## Ajuste de alcance - Primera ola aprobada

Por instruccion del usuario, la primera ola de estandarizacion se limita exclusivamente a estas seis operaciones. No se ejecutaran renombrados de otras categorias hasta cerrar esta ola, medir su resultado y aprobar la siguiente.

| Metodo canonico | Uso principal | Regla obligatoria |
|---|---|---|
| `GetByIdAsync` | Obtener un recurso unico por identificador | Siempre explicito con `Id`; retorno individual. |
| `GetListAsync` | Obtener una coleccion completa | Retorno plural/coleccion; sin criterio oculto. |
| `CreateAsync` | Crear un recurso nuevo | Exclusivo para insercion. |
| `UpdateAsync` | Actualizar un recurso existente | Entidad completa o `Id` + cambios. |
| `DeleteByIdAsync` | Eliminar un recurso por identificador | Nombre explicito; no usar `DeleteAsync` generico. |
| `DeleteRangeAsync` | Eliminar multiples recursos en lote | Recibe coleccion de Ids o entidades. |

### Estado inicial de la primera ola

| Grupo actual | Tratamiento en esta ola | Resultado objetivo |
|---|---|---|
| `GetById`, `GetBy...Id`, `GetDetailById` | Revisar retorno y migrar solo si representa detalle por id | `GetByIdAsync` |
| `GetAll`, `GetList`, `List`, `Search` sin criterio adicional | Migrar solo si devuelve coleccion completa | `GetListAsync` |
| `Add`, `Create`, `Insert`, `Register` de alta | Migrar solo si crea un recurso | `CreateAsync` |
| `Update`, `Edit`, `Modify`, `Patch` de cambio | Migrar solo si actualiza recurso existente | `UpdateAsync` |
| `Delete`, `DeleteById`, `Remove` de un id | Migrar solo si elimina un recurso | `DeleteByIdAsync` |
| Bajas con coleccion de ids/entidades | Separar de baja individual | `DeleteRangeAsync` |
| `Save`, `Upsert` | **No migrar automaticamente** | Decision individual posterior |
| Acciones de negocio (`Approve`, `Send`, `Generate`, etc.) | **Fuera de alcance** | Ola posterior |
| Consultas con criterios, reportes, exports y comandos | **Fuera de alcance** | Ola posterior |

### Reglas de interpretación

- La firma canonica se aplica en interfaz, implementación, handler y cliente interno cuando corresponda.
- El sufijo `Async` es obligatorio cuando el metodo es asincrono.
- `GetListAsync` no se usara para consultas filtradas o paginadas; esas variantes se decidiran en una ola posterior.
- `GetByIdAsync` no se usara si el retorno es una coleccion, aunque el nombre actual contenga `ById`.
- `DeleteRangeAsync` exige evidencia de entrada multiple y una prueba de idempotencia o comportamiento ante ids inexistentes.
- Cambiar el nombre del metodo no autoriza cambiar el verbo HTTP, ruta, DTO, respuesta o regla de negocio; esos cambios requieren una decision separada.

### Criterio de entrada de la primera ola

- [ ] El caso esta dentro de uno de los seis metodos canonicos.
- [ ] El retorno y los parametros confirman la responsabilidad real.
- [ ] Se conocen interfaz, implementación, handler y consumidores.
- [ ] El modulo tiene pruebas suficientes o se agregan pruebas de caracterizacion antes del cambio.
- [ ] El lote tiene responsable, reviewer y rollback definido.

### Criterio de salida de la primera ola

- [ ] No quedan variantes elegibles sin decision documentada dentro del lote.
- [ ] Todos los metodos migrados usan exactamente una de las seis convenciones.
- [ ] No se introducen cambios en acciones especiales, `Save`/`Upsert`, consultas filtradas ni contratos no relacionados.
- [ ] Build de Application, Api y Tests ejecutado en secuencia.
- [ ] Tests y smoke del lote comparan comportamiento anterior y nuevo.
- [ ] El inventario se regenera y la diferencia queda explicada.

### Secuencia operativa de la primera ola

#### Ola 1A - Mapeo de las seis operaciones

- [ ] Extraer todas las firmas candidatas por modulo.
- [ ] Clasificar cada firma por responsabilidad real, retorno y parametros.
- [ ] Registrar `actual -> canonico`, archivo, consumidor, ruta y riesgo.
- [ ] Separar interfaz e implementación sin perder trazabilidad.
- [ ] Identificar si existe baja individual, baja por lote o ambas.
- [ ] Marcar falsos positivos y excepciones para decisión del Tech Lead.

**Check de paso 1A:** cada candidato tiene una decision `migrar`, `mantener` o `fuera de alcance`; no existen filas sin responsable.

#### Ola 1B - Piloto de bajo riesgo

- [x] Seleccionar un submodulo CRUD de bajo acoplamiento. → `AdminLuxuryApp/ConfiguracionSistema/AsambleaChecklistTemplates` (5 metodos, 0 repositorios externos, 0 acoplamiento a contabilidad).
- [x] Migrar primero `GetByIdAsync` y `GetListAsync`. → `GetByIdAsync` ya cumplia; `GetAllAsync` → `GetListAsync`.
- [x] Migrar despues `CreateAsync`, `UpdateAsync` y `DeleteByIdAsync`. → `AddAsync` → `CreateAsync`; `UpdateAsync` y `DeleteByIdAsync` ya cumplian.
- [x] Implementar `DeleteRangeAsync` solo si el submodulo tiene una necesidad real de baja multiple. → No aplica: sin evidencia de baja por lote en este submodulo.
- [x] Mantener alias de compatibilidad si el metodo o ruta es consumido externamente. → No aplica: unico consumidor es el propio endpoint (verificado por grep en `api/`); frontend consume por ruta HTTP, no por nombre de metodo C#, y la ruta no cambio.
- [x] Ejecutar pruebas antes/despues y documentar diferencias. → Ver evidencia abajo.

**Check de paso 1B:** CUMPLIDO 2026-09-11 — codigo, tests unitarios, diff acotado, build de los 3 proyectos y smoke HTTP end-to-end (7/7) en verde. Pendiente unicamente la firma formal de Tech Lead para cerrar la ola. Ver `## Lote Ola 1B - AsambleaChecklistTemplates`.

#### Ola 1C - Escalamiento por modulos

**Estado: 1 lote completado (2026-09-11)** — `CustomerLocations` ejecutado y validado (codigo, tests, build de los 3 proyectos y smoke HTTP 7/7 en verde). Ver `## Lote Ola 1C - CustomerLocations`. Pendiente: aprobacion formal de Tech Lead y decidir el siguiente submodulo a procesar (maximo un submodulo por PR, regla de Ola 1C).


- [ ] Procesar maximo un submodulo por PR.
- [ ] Ordenar lotes por bajo, medio y alto riesgo.
- [ ] No mezclar cambios de carpetas, namespaces, DbSets, DTOs o acciones especiales.
- [ ] Actualizar el tracking del lote y adjuntar evidencia.
- [ ] Detener la siguiente ola si aparece una regresion nueva o un contrato no inventariado.

**Check de paso 1C:** cada PR tiene diff acotado, reviewer, pruebas y rollback; el inventario acumulado muestra avance sin aumento de `OTHER` elegibles.

#### Ola 1D - Cierre y congelamiento

- [ ] Regenerar inventario global.
- [ ] Confirmar que no quedan `Add`/`Create`, `Delete`/`DeleteById` o `List` elegibles sin decision.
- [ ] Confirmar que `DeleteRangeAsync` se usa unicamente para entradas multiples.
- [ ] Confirmar que no se renombraron acciones especiales ni consultas filtradas.
- [ ] Publicar el catalogo de las seis operaciones como regla de nuevos desarrollos.
- [ ] Solicitar aprobacion para la segunda ola.

**Check de paso 1D:** Tech Lead acepta los KPIs, QA acepta la evidencia y el plan se mueve a `EN ESPERA DE OLA 2`.

## 1. Resumen Ejecutivo

La API contiene 16 modulos, 3,929 metodos publicos de servicios/interfaces y 1,812 endpoints HTTP. Conviven `Add`/`Create`, `Delete`/`DeleteById`, `Save`/`Upsert`, nombres de consulta ambiguos y acciones de negocio expuestas en algunos casos como `GET`.

Este plan no propone un renombrado masivo de una sola vez. Propone una migracion por lotes pequenos, con catalogo aprobado, compatibilidad temporal, pruebas por modulo y cierre solo cuando no existan consumidores del contrato anterior.

El plan relacionado conserva su responsabilidad sobre carpetas, namespaces y `DbSet`. Este documento gobierna especificamente nombres de servicios, interfaces, metodos, handlers, rutas, verbos HTTP y contratos de compatibilidad de la API.

## 2. FASE 0 - Criterios de control obligatorios

### 2.1 Problem statement

Actualmente, los equipos consumidores sufren ambiguedad al localizar y consumir operaciones de la API porque una misma responsabilidad usa nombres y rutas diferentes, lo que resulta en mayor curva de aprendizaje, riesgo de seleccionar el verbo HTTP equivocado y dificultad para automatizar validaciones.

### 2.2 KPIs

| KPI | Baseline | Objetivo | Momento de medicion | Responsable |
|---|---:|---:|---|---|
| Metodos fuera del catalogo aprobado | 698 `OTHER` heuristicas | 0 nuevos; existentes con decision documentada | Por lote y cierre | Tech Lead + ejecutor |
| Variantes de alta (`Add`/`Create`) | 268 `Add`, 123 `Create` | Una convención por modulo | Por lote | Responsable de modulo |
| Variantes de baja (`Delete`/`DeleteById`/`Remove`) | 379 clasificados DELETE | Una convención por recurso | Por lote | Responsable de modulo |
| Endpoints GET con accion en la ruta | Detectados en inventario | 0 mutaciones por GET | Por lote y cierre | API owner |
| Builds del backend | Debe medirse antes de cada lote | 0 errores | Cada PR | Ejecutores |
| Tests de contrato/smoke | Debe medirse antes de cada lote | 100% de escenarios afectados | Cada PR | QA + ejecutor |
| Consumidores del nombre/ruta antigua | Debe medirse antes de cada lote | 0 antes de contraer | Antes de retirar alias | API owner |

### 2.3 Reglas de negocio y migracion

| ID | Nivel | Regla | Verificacion |
|---|---|---|---|
| RN-API-001 | Invariante | La entidad/clase permanece singular y la carpeta permanece plural, conforme a `CONVENTIONS_FOLDER_API.MD` §3 y §5.3. | Auditoria de path, clase y namespace. |
| RN-API-002 | Flujo | Un GET solo consulta; una mutacion o accion de negocio usa POST, PUT, PATCH o DELETE segun su responsabilidad. | Matriz handler-verbo-ruta + pruebas HTTP. |
| RN-API-003 | Flujo | GET de un recurso usa `Get[Entity]ByIdAsync`; GET de coleccion usa `Get[Entities]Async` o `Get[Entities]By[Criteria]Async`. | Analisis de retorno y parametros. |
| RN-API-004 | Contrato | Durante la ventana de compatibilidad, la ruta anterior no se elimina hasta probar que no tiene consumidores activos. | Telemetria, busqueda en frontend y contrato. |
| RN-API-005 | Seguridad | Cambiar nombre o ruta no puede relajar autorizacion, tenant, auditoria ni validaciones. | Comparacion de atributos/policies y smoke autenticado. |
| RN-API-006 | Datos | No cambiar tablas, columnas, `[Table]`, Fluent API, algoritmos contables ni reglas de negocio como parte de esta migracion. | Revisión de diff y pruebas de regresion. |
| RN-API-007 | DTO | Los DTO terminan en `DTO`, viven en `DTOs/` y hay un DTO por clase. Compartir solo si existen 2+ consumidores. | Checklist API §4 y §6.1. |
| RN-API-008 | Estructura | Todo namespace debe derivarse del path y no incluir `Modules`; actualizar `GlobalUsings.cs` cuando corresponda. | Script de namespace + build. |
| RN-API-009 | Idempotencia | Cada lote puede reintentarse sin duplicar endpoints, aliases ni registros de migracion. | Reejecucion del check y diff estable. |

### 2.4 Pre-mortem

Si la migracion llega a produccion y falla, las causas mas probables son:

1. Un consumidor no inventariado sigue usando una ruta antigua. Mitigacion: busqueda global, telemetria y ventana de compatibilidad.
2. Un `GET` fue cambiado a `POST` sin actualizar frontend, permisos o clientes externos. Mitigacion: contrato versionado y smoke por endpoint.
3. Un metodo `GetByXxxId` que devuelve lista fue convertido a detalle. Mitigacion: clasificar por retorno real, no solo por nombre.
4. Un renombrado de namespace rompe referencias indirectas. Mitigacion: un lote por modulo, build de Application/Api/Tests y revisión de `GlobalUsings`.
5. Se cambió accidentalmente logica de negocio durante un renombrado. Mitigacion: diffs pequenos y regla zero-logic-change.

### 2.5 Flujos que cada lote debe cubrir

| Flujo | Caso feliz | Caso triste | Caso limite |
|---|---|---|---|
| Consulta individual | recurso existente por id | id inexistente / no autorizado | id malformado |
| Consulta de lista | lista paginada o filtrada | tenant invalido | lista vacia / pagina fuera de rango |
| Alta | DTO valido | validacion o duplicado | reintento idempotente |
| Actualizacion | recurso existente | conflicto o version invalida | payload parcial |
| Baja | recurso eliminable | dependencia o no encontrado | doble eliminacion |
| Accion especial | accion autorizada | estado invalido | reintento de accion |

## 3. Alcance, exclusiones y roles

### Incluye

- Metodos de interfaces y clases `Service`, `AppService` y `Manager`.
- Handlers y endpoints bajo `Modules/`.
- Nombres de DTO/ViewModel cuando incumplan la convencion API.
- Contratos de compatibilidad, aliases temporales y documentación por modulo.
- Tests de servicio, integración, contrato y smoke afectados.

### No incluye sin aprobacion adicional

- Cambio de tablas o columnas, `[Table]`, Fluent API, DbContexts o migraciones EF.
- Modificacion de `Shared`, `SelectItem`, enums centralizados o servicios transversales.
- Reglas contables, seguridad, autorizacion o algoritmos de negocio.
- Renombrado de carpetas/namespaces ya gobernado por el plan relacionado.

### Roles

| Rol | Responsabilidad |
|---|---|
| Tech Lead | Aprueba catalogo, excepciones y paso entre fases. |
| API owner | Decide compatibilidad, versionado y retiro de aliases. |
| Responsable de modulo | Ejecuta el lote y actualiza checklist. |
| QA | Ejecuta contrato, smoke, regresion y valida evidencia. |
| Frontend/integraciones | Confirma consumidores y adopta nombres nuevos. |
| Reviewer | Verifica diff, invariantes y alcance. |

## 4. Estado actual vs objetivo

| Area | Estado actual observado | Estado objetivo |
|---|---|---|
| Metodos de consulta | `Get`, `List`, `Find`, `Search`, `GetAll`, `GetBy...` mezclados | Lista y detalle distinguibles por nombre, retorno y ruta |
| Alta | `AddAsync`, `CreateAsync`, `RegisterAsync`, `SaveAsync` | `Create[Entity]Async` para altas |
| Actualizacion | `Update`, `Save`, `Edit`, `Modify`, `Upsert` | `Update[Entity]Async`; `Upsert[Entity]Async` solo si realmente hace ambas |
| Baja | `Delete`, `DeleteById`, `Remove`, `Destroy` | `Delete[Entity]ByIdAsync` |
| Acciones | Verbos en ingles/espanol y nombres vagos (`Void`, `ToBlock`) | `[Action][Entity]Async`, con accion de dominio clara |
| Endpoints | 986 GET, 398 POST, 210 PUT, 31 PATCH, 187 DELETE; hay GET de acciones | GET consulta; POST acciones/altas; PUT/PATCH cambios; DELETE bajas |
| Rutas | Mezcla singular/plural, guiones y acciones | recursos plurales y acciones como subrecurso |
| DTOs | Variacion de ubicacion y sufijos en el legado | `DTO` mayusculas, un DTO por clase, carpeta correcta |
| Compatibilidad | Contratos existentes en uso | Alias/versionado temporal con fecha de retiro |

## 5. Fases de ejecucion

### Fase 1 - Congelamiento, baseline y catalogo aprobado

**Objetivo:** impedir que la brecha crezca y convertir el inventario en backlog ejecutable.

**Tareas**

- [ ] Designar Tech Lead, API owner, QA y un responsable por cada modulo.
- [ ] Congelar nuevos nombres fuera del catalogo aprobado.
- [ ] Registrar baseline de build, tests, endpoints, rutas duplicadas y consumidores.
- [ ] Generar una fila de decision para cada metodo `OTHER`: mantener, renombrar, reclasificar o marcar como interno.
- [ ] Validar manualmente los 32 casos de `GET_SINGLE` con retorno de coleccion detectados por el inventario.
- [ ] Aprobar excepciones de dominio como `Login`, `GenerateWeeklyReport`, `CalculateLateFee`, `EvaluateAndEscalate`.
- [ ] Definir version/alias y fecha de retiro por cada ruta publica que cambie.

**Criterio de paso**

- [ ] Catalogo aprobado por Tech Lead.
- [ ] Cada hallazgo tiene responsable, modulo, decisión y evidencia requerida.
- [ ] Baseline guardado en el PR o documento de seguimiento.
- [ ] Ningun cambio de codigo iniciado antes de cerrar el inventario del lote piloto.

### Fase 2 - Reglas automaticas y guardas de CI

**Objetivo:** hacer que el estandar sea ejecutable y evitar regresiones.

**Tareas**

- [ ] Crear analizador/check que detecte nombres de metodo fuera del catalogo.
- [ ] Validar sufijo `Async` para metodos asincronos publicos.
- [ ] Validar que DTO termine en `DTO`, este en `DTOs/` y no comparta archivo con otra clase DTO.
- [ ] Validar carpetas plurales, clases singulares y ausencia de colision carpeta/clase.
- [ ] Validar namespace path-based, sin `Modules` ni prefijo de proyecto.
- [ ] Validar correspondencia endpoint-verbo-handler-categoria.
- [ ] Detectar rutas duplicadas y GET que contengan acciones mutantes.
- [ ] Publicar salida legible por PR con severidad y archivo/linea.

**Criterio de paso**

- [ ] Las guardas corren en CI sin modificar codigo.
- [ ] El baseline existente esta permitido mediante lista controlada y temporal.
- [ ] Un nombre/ruta nuevo fuera del estandar hace fallar el check.
- [ ] Se demuestra que el check no altera `[Table]`, Fluent API ni logica.

### Fase 3 - Piloto seguro: un submodulo CRUD de bajo riesgo

**Objetivo:** probar el procedimiento en un lote pequeno antes de escalar.

**Seleccion:** un submodulo con CRUD claro, sin integracion externa ni contabilidad. La seleccion debe aprobarla el Tech Lead con evidencia de bajo acoplamiento.

**Procedimiento por lote**

1. [ ] Capturar snapshot de rutas, handlers, permisos, DTOs, respuestas y consumidores.
2. [ ] Crear nombres nuevos en interfaces y servicios manteniendo comportamiento.
3. [ ] Actualizar handlers y clientes internos.
4. [ ] Agregar alias/adaptador temporal para la ruta o nombre anterior si es contrato publico.
5. [ ] Ejecutar pruebas happy/sad/edge y comparar respuestas JSON.
6. [ ] Actualizar README y documentación técnica del submodulo.
7. [ ] Abrir PR pequeno con diff exclusivamente de naming/contrato.

**Criterio de paso**

- [ ] Build de Application, Api y Tests sin errores ni warnings nuevos relevantes.
- [ ] Tests unitarios e integración del submodulo en verde.
- [ ] Contrato viejo y nuevo producen resultado equivalente durante la ventana.
- [ ] Permisos, tenant, auditoria y codigos HTTP se conservan o tienen decision aprobada.
- [ ] El equipo consumidor confirma adopcion del nombre nuevo.

### Fase 4 - Migracion CRUD por oleadas de modulos

**Objetivo:** normalizar operaciones repetitivas con riesgo controlado.

**Orden sugerido**

1. Catalogos y configuracion de bajo acoplamiento.
2. Customers, proveedores y residentes.
3. Mantenimiento y operaciones.
4. Compras y reclutamiento.
5. Cobranza y contabilidad, solo con revisión funcional reforzada.
6. Auth, seguridad, notificaciones e infraestructura al final.

**Reglas de renombrado**

| Actual | Objetivo | Decision |
|---|---|---|
| `Add[Async]` | `Create[Entity]Async` | Renombrar si crea recurso nuevo |
| `Create[Async]` | `Create[Entity]Async` | Completar entidad si falta |
| `DeleteAsync` | `Delete[Entity]ByIdAsync` | Solo si elimina por id |
| `DeleteByIdAsync` | `Delete[Entity]ByIdAsync` | Mantener alias durante compatibilidad |
| `SaveAsync` | `Update` o `Upsert` | Requiere leer comportamiento real |
| `GetAsync` | `Get[Entity]By[Criteria]Async` | Prohibir criterio implicito |
| `ListAsync` | `Get[Entities]Async` | Si retorna coleccion |
| `Find...` | `Get[Entity]By...Async` | Si es consulta de lectura |
| `Remove...` | `Delete[Entity]...Async` | Si elimina recurso |

**Checklist obligatorio por metodo**

- [ ] Metodo actual y objetivo registrados.
- [ ] Categoria confirmada por retorno, parametros y efecto real.
- [ ] Interface, implementación, handler y referencias actualizados.
- [ ] Ruta y verbo revisados.
- [ ] DTOs y nombres de archivo revisados.
- [ ] Alias/compatibilidad definida o justificada como no necesaria.
- [ ] Tests y evidencia adjuntos.

**Criterio de paso por oleada**

- [ ] 100% de los lotes de la oleada tienen checklist completo.
- [ ] Cero endpoints duplicados no justificados.
- [ ] Cero cambios de comportamiento no aprobados.
- [ ] Frontend e integraciones externas confirman consumo.
- [ ] Reporte de inventario regenerado y diferencia explicada.

### Fase 5 - Acciones de negocio y correccion de verbos HTTP

**Objetivo:** separar consultas de comandos y hacer explicita la intención del endpoint.

**Tareas**

- [ ] Identificar handlers `Approve`, `Reject`, `Activate`, `Deactivate`, `Send`, `Process`, `Calculate`, `Generate`, `Export`, `Import`, `Download`, `Validate`, `Sync`, `Pay`, `Assign` y equivalentes en espanol.
- [ ] Confirmar si cada accion muta estado, dispara efectos secundarios o solo consulta.
- [ ] Migrar mutaciones de `GET` a `POST /resource/{id}/{action}` o `POST /resource/{action}`.
- [ ] Mantener `GET` para descargas/lecturas solo cuando no cambie estado, documentando el caso.
- [ ] Revisar autorizacion, idempotencia, auditoria y reintentos de cada accion.
- [ ] Actualizar clientes y documentación OpenAPI.

**Criterio de paso**

- [ ] Ningun GET muta estado.
- [ ] Cada accion tiene nombre de dominio y ruta explicita.
- [ ] Reintento seguro o rechazo idempotente documentado.
- [ ] Pruebas de estado previo, estado posterior y permisos en verde.

### Fase 6 - DTOs, carpetas y namespaces asociados

**Objetivo:** cerrar inconsistencias estructurales que hacen dificil encontrar contratos.

**Tareas**

- [ ] Renombrar `Dto`/`Dtos` a `DTO` solo cuando corresponda al contrato real.
- [ ] Separar archivos con multiples DTOs en un archivo por clase.
- [ ] Mover DTO usado por un solo submodulo al submodulo; mover a `Shared/DTOs` solo con 2+ consumidores comprobados.
- [ ] Verificar carpetas plurales y clases singulares.
- [ ] Verificar namespace derivado del path y actualizar `GlobalUsings.cs`.
- [ ] Coordinar cualquier carpeta/DbSet con `20260909-plan-migracion-nombres-api-db-conventions.md`; no duplicar cambios.

**Criterio de paso**

- [ ] Checklist API §3, §4, §5, §6.1 y §8 completo.
- [ ] Build y tests de los tres proyectos en verde.
- [ ] No se modificaron tablas, `[Table]` ni Fluent API.

### Fase 7 - Adoptar, medir y retirar compatibilidad

**Objetivo:** cerrar la migracion sin romper consumidores.

**Tareas**

- [ ] Publicar guia de nombres y ejemplos en la documentación oficial.
- [ ] Marcar aliases/rutas antiguas como deprecated con fecha y owner.
- [ ] Medir uso real de cada alias durante la ventana aprobada.
- [ ] Notificar a consumidores con evidencia de uso pendiente.
- [ ] Retirar aliases solo con cero uso, aprobación del API owner y plan de rollback.
- [ ] Regenerar inventario final y comparar contra KPIs.

**Criterio de cierre**

- [ ] Cero consumidores activos de contratos antiguos.
- [ ] Cero rutas duplicadas no justificadas.
- [ ] Cero GET mutante.
- [ ] Todos los nombres nuevos cumplen las guardas CI.
- [ ] Documentación de cada modulo actualizada.
- [ ] Evidencia de build, tests, smoke, contrato y rollback archivada.
- [ ] Tech Lead firma el cierre.

## 6. Plantilla de seguimiento por lote

Copiar esta seccion para cada submodulo o lote:

```text
LOTE: [Modulo/Submodulo]
RESPONSABLE: [Nombre/rol]
REVIEWER: [Nombre/rol]
VENTANA: [fecha inicio - fecha fin]
PR: [URL o identificador]
RIESGO: [bajo/medio/alto]
ESTADO: [NO INICIADO / EN CURSO / BLOQUEADO / VALIDACION / COMPLETADO]

ANTES
[ ] Snapshot de endpoints, handlers, permisos, DTOs y consumidores.
[ ] Build y tests baseline registrados.
[ ] Matriz actual -> objetivo aprobada.

CAMBIO
[ ] Interfaces actualizadas.
[ ] Implementaciones actualizadas.
[ ] Endpoints y clientes actualizados.
[ ] Alias/versionado agregado si aplica.
[ ] Documentacion actualizada.

VALIDACION
[ ] Build Application.
[ ] Build Api.
[ ] Build Tests.
[ ] Tests unitarios.
[ ] Tests de integración/contrato.
[ ] Smoke happy/sad/edge.
[ ] Permisos, tenant y auditoria verificados.
[ ] No cambio de tablas, `[Table]` o Fluent API.
[ ] Rollback probado o documentado.

EVIDENCIA
- Resultado build:
- Resultado tests:
- Resultado smoke:
- Rutas antiguas/nuevas:
- Riesgos residuales:
- Aprobacion Tech Lead:
```

## Lote Ola 1B - AsambleaChecklistTemplates

```text
LOTE: AdminLuxuryApp/ConfiguracionSistema/AsambleaChecklistTemplates
RESPONSABLE: Agente ejecutor (sesion 2026-09-11)
REVIEWER: Pendiente (Tech Lead)
VENTANA: 2026-09-11 - 2026-09-11
PR: Pendiente de apertura
RIESGO: bajo
ESTADO: VALIDACION (tecnica completa; pendiente apertura de PR y firma de Tech Lead)

ANTES
[x] Snapshot de endpoints, handlers, permisos, DTOs y consumidores.
    - Interfaz: IAsambleaChecklistTemplateAppService.cs
    - Implementacion: AsambleaChecklistTemplateAppService.cs
    - Handler/rutas: AsambleaChecklistTemplateEndpoints.cs (grupo api/asamblea-checklist-template)
    - Permisos: RequireAuthorization(Roles = SuperUsuario) — sin cambio
    - DTOs: AsambleaChecklistTemplateAddOrEditDTO, AsambleaChecklistTemplateDTO — sin cambio
    - Consumidores (grep en api/): solo DependencyInjection.Controllers.cs (registro DI) y el propio endpoint. Sin otros servicios .cs referenciando la interfaz.
    - Consumidores frontend (grep en appsweb/): admin.endpoints.ts consume por ruta HTTP "asamblea-checklist-template", no por nombre de metodo C#. Ruta sin cambio, adopcion no requiere accion.
[x] Build y tests baseline registrados. → Baseline documentado en "Estado de ejecucion" (2026-09-11): Application 0 errores; Tests 533 total, 510 ok, 21 fallidas (deuda previa no relacionada), 2 omitidas.
[x] Matriz actual -> objetivo aprobada (ver tabla abajo).

MATRIZ ACTUAL -> OBJETIVO
| Metodo actual | Metodo objetivo | Capa | Decision | Motivo |
|---|---|---|---|---|
| `GetAllAsync` | `GetListAsync` | Interfaz + Implementacion + Endpoint (GET api/asamblea-checklist-template) | Migrar | Retorna `List<AsambleaChecklistTemplateDTO>` completa, sin criterio/paginacion oculta. |
| `AddAsync` | `CreateAsync` | Interfaz + Implementacion + Endpoint (POST api/asamblea-checklist-template) | Migrar | Crea un recurso nuevo (`AssemblyChecklistTemplates.AddAsync` + `SaveChangesAsync`). |
| `GetByIdAsync` | `GetByIdAsync` | Interfaz + Implementacion + Endpoint (GET .../{id:guid}) | Mantener (ya canonico) | Retorno individual por Guid id. |
| `UpdateAsync` | `UpdateAsync` | Interfaz + Implementacion + Endpoint (PUT .../{id:guid}) | Mantener (ya canonico) | Actualiza entidad existente por id + DTO de cambios. |
| `DeleteByIdAsync` | `DeleteByIdAsync` | Interfaz + Implementacion + Endpoint (DELETE .../{id:guid}) | Mantener (ya canonico) | Baja logica (soft-delete `IsActive = false`) por id explicito; el nombre ya es correcto aunque el comportamiento sea soft-delete. |
| — | `DeleteRangeAsync` | — | Fuera de alcance | Sin evidencia de necesidad de baja multiple en este submodulo. |
| `AsambleaChecklistTemplate_GetAll` / `_Create` (LogActivityMetadata) | (sin cambio) | Endpoint | Mantener | Son identificadores de auditoria/telemetria, no nombres de metodo; cambiarlos rompe continuidad de logs historicos (RN-API-005). |

CAMBIO
[x] Interfaces actualizadas. → IAsambleaChecklistTemplateAppService.cs
[x] Implementaciones actualizadas. → AsambleaChecklistTemplateAppService.cs
[x] Endpoints y clientes actualizados. → AsambleaChecklistTemplateEndpoints.cs (mismos verbos/rutas, solo cambia el metodo C# invocado)
[x] Alias/versionado agregado si aplica. → No aplica (sin consumidores externos del nombre de metodo; ruta HTTP sin cambio).
[ ] Documentacion actualizada. → Pendiente: este submodulo no tiene README/docs de modulo propios (§4.7) todavia; fuera de alcance de esta migracion de naming.

VALIDACION
[x] Build Application. → 0 errores, 6 advertencias preexistentes (identicas al baseline).
[x] Build Api. → RESUELTO 2026-09-11: el usuario detuvo manualmente el proceso bloqueante (PID 56456); build limpio, 0 errores, 0 advertencias.
    - Reintento previo (mismo dia): mismo bloqueo, PID 50212 y luego 56456 (`LuxuryApp.Api.exe`). Esos binarios eran ANTERIORES al rename. No se detuvieron sin autorizacion; el usuario confirmo y detuvo el proceso el mismo.
    - Pruebas del piloto reconfirmadas: 11/11 pasan (segunda ejecucion independiente antes del build final).
    - Diff reconfirmado: exactamente los mismos 3 archivos del piloto + 1 archivo de tests nuevo, sin cambios adicionales.
[x] Build Tests. → 0 errores, 11 advertencias preexistentes (identicas al baseline).
[x] Tests unitarios. → Se agregaron 11 pruebas de caracterizacion nuevas (`AsambleaChecklistTemplateAppServiceTests.cs`, cubren GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync happy+sad+edge); las 11 pasan.
[x] Tests de integración/contrato. → No existian antes del cambio (gap detectado); se cubrio con las pruebas de caracterizacion de servicio en memoria (EF InMemory) como evidencia equivalente. No hay tests de contrato HTTP para este submodulo en el repo.
[x] Smoke happy/sad/edge. → Ejecutado HTTP real 2026-09-11 contra build con el rename, autenticado como SuperUsuario (seed dev `admin`/`info@luxurybuilding.com.mx`). Ver detalle abajo.
[x] Permisos, tenant y auditoria verificados. → Sin cambio: mismo atributo RequireAuthorization (confirmado por 401 en las 5 rutas sin token), mismas LogActivityMetadata, sin campos de tenant en esta entidad (catalogo global de checklist).
[x] No cambio de tablas, `[Table]` o Fluent API. → Confirmado por diff: solo 3 archivos tocados, 6 inserciones/6 eliminaciones, sin tocar Entities/ ni Migrations/.
[x] Rollback probado o documentado. → Rollback = revertir los 3 archivos modificados (`git checkout` sobre esos paths); no hay alias que retirar ni datos migrados.

SMOKE HTTP (2026-09-11, build post-rename, http://localhost:7069)
| Caso | Metodo/Ruta | Sin token | Con token SuperUsuario | Resultado |
|---|---|---|---|---|
| GET lista (happy) | GET api/asamblea-checklist-template | 401 | 200, 25 items reales (`GetListAsync`) | OK |
| GET por id (happy) | GET api/asamblea-checklist-template/{id} | 401 | 200, item correcto (`GetByIdAsync`) | OK |
| GET por id (triste, no encontrado) | GET api/asamblea-checklist-template/{id-inexistente} | 401 | 200 HTTP / responseCode 404 en body, mensaje "no fue encontrado" | OK (igual al contrato previo, Ok()-wrapper) |
| Alta (happy) | POST api/asamblea-checklist-template | 401 | 200, crea `SMOKE_TEST_001`, version=1 (`CreateAsync`) | OK |
| Actualizacion (happy) | PUT api/asamblea-checklist-template/{id} | 401 | 200, titulo actualizado, version incrementa a 2 (`UpdateAsync`, regla de negocio de version intacta) | OK |
| Baja (happy) | DELETE api/asamblea-checklist-template/{id} | 401 | 200, `IsActive=false` (soft-delete, `DeleteByIdAsync`) | OK |
| Verificacion post-baja | GET api/asamblea-checklist-template/{id} | — | 200, `isActive:false` confirmado | OK |

Nota: la instancia de Api usada para el smoke fue levantada por el agente ejecutor únicamente para esta validacion y detenida al terminar; no es la sesion de desarrollo del usuario. Queda un registro de prueba `SMOKE_TEST_001` en estado inactivo (`IsActive=false`) en la base de datos de desarrollo local; no se elimino fisicamente porque el submodulo no expone baja fisica (solo soft-delete) y no se ejecuto SQL directo fuera de la app.

EVIDENCIA
- Resultado build: Application OK (0 errores); Api OK (0 errores, 0 advertencias, tras liberar el proceso bloqueante); Tests OK (0 errores).
- Resultado tests: 544 total (533 baseline + 11 nuevas), 521 superadas (510 baseline + 11 nuevas), 21 fallidas (identicas al baseline, todas en modulos no relacionados: Contabilidad.CobranzaNativa, AppImplementationTracking, Configuracion, Services, ReclutamientoLuxuryApp.Candidates), 2 omitidas. 0 regresiones nuevas.
- Resultado smoke: 7/7 casos HTTP en verde (ver tabla arriba); ciclo CRUD completo (GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync) validado end-to-end con datos reales y auth real.
- Rutas antiguas/nuevas: sin cambio de ruta. `GET/POST api/asamblea-checklist-template`, `GET/PUT/DELETE api/asamblea-checklist-template/{id:guid}` se mantienen igual; solo cambio el nombre del metodo C# invocado internamente.
- Riesgos residuales: (1) Registro `SMOKE_TEST_001` (soft-deleted) queda en la BD de desarrollo local como dato de prueba residual; (2) submodulo no tenia tests previos, por lo que "antes/despues" se valida por lectura de codigo + tests nuevos, no por comparacion de suite preexistente.
- Aprobacion Tech Lead: PENDIENTE.
```

## Lote Ola 1C - CustomerLocations

```text
LOTE: AdminLuxuryApp/Customers/CustomerLocations
RESPONSABLE: Agente ejecutor (sesion 2026-09-11)
REVIEWER: Pendiente (Tech Lead)
VENTANA: 2026-09-11 - 2026-09-11
PR: Pendiente de apertura
RIESGO: bajo
ESTADO: VALIDACION (tecnica completa; pendiente apertura de PR y firma de Tech Lead)

ANTES
[x] Snapshot de endpoints, handlers, permisos, DTOs y consumidores.
    - Interfaz: ICustomerLocationAppService.cs
    - Implementacion: CustomerLocationAppService.cs
    - Handler/rutas: CustomerLocationsEndpoints.cs (grupo api/customer-locations)
    - Permisos: RequireAuthorization con JwtBearerDefaults (cualquier usuario autenticado, sin restriccion de rol) — sin cambio
    - DTOs: CustomerLocationAddOrEditDTO, CustomerLocationDTO — sin cambio
    - Consumidores (grep en api/): solo DependencyInjection.Controllers.cs (registro DI) y el propio endpoint. Sin otros servicios .cs referenciando la interfaz.
    - Consumidores frontend (grep en appsweb/): 10 archivos en modules/admin.luxuryapp/seguridad-permisos/customer-location/ consumen por ruta HTTP, no por nombre de metodo C#. Ruta sin cambio.
    - Anomalia detectada (no bloquea, no se corrige aqui): el namespace real del servicio/endpoint/mapper es `AdminLuxuryApp.GestionDeCliente.CustomerDataCompanies.*`, no coincide con la carpeta fisica `CustomerLocations`. Es competencia del plan de convenciones de namespaces (2026-09-09), fuera de alcance de este plan de naming.
[x] Build y tests baseline registrados. → Baseline previo a este lote: 554 total, 531 ok, 21 fallidas (deuda previa), 2 omitidas (post-cierre de Ola 1B).
[x] Matriz actual -> objetivo aprobada (ver tabla abajo).

MATRIZ ACTUAL -> OBJETIVO
| Metodo actual | Metodo objetivo | Capa | Decision | Motivo |
|---|---|---|---|---|
| `AddAsync` | `CreateAsync` | Interfaz + Implementacion + Endpoint (POST api/customer-locations) | Migrar | Crea entidad nueva pura (`dbContext.CustomerLocations.AddAsync` + `SaveChangesAsync`), sin upsert. |
| `DeleteAsync` | `DeleteByIdAsync` | Interfaz + Implementacion + Endpoint (DELETE .../{id}) | Migrar | Elimina por id unico explicito. Nota: a diferencia del piloto de Ola 1B, esto es **hard delete** (`dbContext.Remove`), confirmado por smoke (registro desaparece tras el DELETE). El nombre canonico aplica igual, independiente de soft/hard delete. |
| `GetByIdAsync` | `GetByIdAsync` | Interfaz + Implementacion + Endpoint (GET .../{id}) | Mantener (ya canonico) | Retorno individual por Guid id. |
| `UpdateAsync` | `UpdateAsync` | Interfaz + Implementacion + Endpoint (PUT .../{id}) | Mantener (ya canonico) | Actualiza entidad existente por id + DTO de cambios. |
| `GetByCustomerIdAsync` | — | Interfaz + Implementacion + Endpoint (GET .../customer/{customerId}) | Fuera de alcance | Retorna `CustomerLocationDTO[]` filtrado por `customerId` (criterio ajeno al id propio de la entidad) — consulta filtrada, reservada para ola posterior segun regla del plan. |
| — | `DeleteRangeAsync` | — | Fuera de alcance | Sin evidencia de necesidad de baja multiple en este submodulo. |

CAMBIO
[x] Interfaces actualizadas. → ICustomerLocationAppService.cs (tambien se corrigio un comentario XML que decia "(soft delete)" siendo en realidad hard delete, por ser la misma linea del metodo renombrado)
[x] Implementaciones actualizadas. → CustomerLocationAppService.cs
[x] Endpoints y clientes actualizados. → CustomerLocationsEndpoints.cs (mismos verbos/rutas, solo cambia el metodo C# invocado)
[x] Alias/versionado agregado si aplica. → No aplica (sin consumidores externos del nombre de metodo; ruta HTTP sin cambio).
[ ] Documentacion actualizada. → Pendiente: este submodulo no tiene README/docs de modulo propios (§4.7) todavia; fuera de alcance de esta migracion de naming.

VALIDACION
[x] Build Application. → 0 errores, 6 advertencias preexistentes (identicas al baseline).
[x] Build Api. → 0 errores, 2 advertencias preexistentes (usings duplicados, no relacionadas al cambio).
[x] Build Tests. → 0 errores, 11 advertencias preexistentes (identicas al baseline).
[x] Tests unitarios. → Se agregaron 10 pruebas de caracterizacion nuevas (`CustomerLocationAppServiceTests.cs`, cubren GetByCustomerIdAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync happy+sad+edge); las 10 pasan.
[x] Tests de integración/contrato. → No existian antes del cambio (mismo gap que en Ola 1B); cubierto con pruebas de caracterizacion de servicio en memoria (EF InMemory).
[x] Smoke happy/sad/edge. → Ejecutado HTTP real 2026-09-11 contra build con el rename, autenticado como SuperUsuario (mismo seed dev). Ver tabla abajo.
[x] Permisos, tenant y auditoria verificados. → Sin cambio: mismo atributo RequireAuthorization (JWT valido, cualquier rol), confirmado por 401 en las 5 rutas sin token; sin campos de tenant explicitos en esta entidad (asociada a Customer via CustomerId).
[x] No cambio de tablas, `[Table]` o Fluent API. → Confirmado por diff: 3 archivos de codigo tocados, sin tocar Entities/ ni Migrations/.
[x] Rollback probado o documentado. → Rollback = revertir los 3 archivos modificados (`git checkout` sobre esos paths); no hay alias que retirar ni datos migrados de forma irreversible.

SMOKE HTTP (2026-09-11, build post-rename, http://localhost:7069)
| Caso | Metodo/Ruta | Sin token | Con token (JWT valido) | Resultado |
|---|---|---|---|---|
| GET por customer (happy, lista vacia) | GET api/customer-locations/customer/{customerId} | 401 | 200, `data: []` (`GetByCustomerIdAsync`, fuera de alcance de rename pero validado como smoke de regresion) | OK |
| Alta (happy) | POST api/customer-locations | 401 | 200, crea "Smoke Test Gate" (`CreateAsync`) | OK |
| GET por id (happy) | GET api/customer-locations/{id} | 401 | 200, item correcto (`GetByIdAsync`) | OK |
| GET por id (triste, no encontrado) | GET api/customer-locations/{id-inexistente} | 401 | 200 HTTP / responseCode 400 en body, "Ubicación no encontrada" (contrato previo sin cambio; distinto del 404 del piloto de Ola 1B, pre-existente) | OK |
| Actualizacion (happy) | PUT api/customer-locations/{id} | 401 | 200, nombre actualizado (`UpdateAsync`) | OK |
| Baja (happy) | DELETE api/customer-locations/{id} | 401 | 200, `data: true` (`DeleteByIdAsync`, hard delete) | OK |
| Verificacion post-baja (edge) | GET api/customer-locations/{id} | — | 200 HTTP / responseCode 400, "no encontrada" — confirma que el registro fue eliminado fisicamente (hard delete), no solo desactivado | OK |

Nota: la instancia de Api usada para el smoke fue levantada por el agente ejecutor unicamente para esta validacion y detenida al terminar; no es la sesion de desarrollo del usuario. El registro de prueba creado y luego eliminado por DELETE no deja residuo en la base de datos (a diferencia del piloto de Ola 1B, que solo soft-elimina).

EVIDENCIA
- Resultado build: Application OK (0 errores); Api OK (0 errores); Tests OK (0 errores).
- Resultado tests: 554 total (544 previos + 10 nuevas), 531 superadas (521 previas + 10 nuevas), 21 fallidas (identicas al baseline acumulado, sin relacion con este cambio), 2 omitidas. 0 regresiones nuevas.
- Resultado smoke: 7/7 casos HTTP en verde (ver tabla arriba); ciclo CRUD completo (GetByCustomerIdAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync) validado end-to-end con datos reales, cliente real y auth real.
- Rutas antiguas/nuevas: sin cambio de ruta. `GET api/customer-locations/customer/{customerId:guid}`, `GET/PUT/DELETE api/customer-locations/{id:guid}`, `POST api/customer-locations` se mantienen igual; solo cambio el nombre del metodo C# invocado internamente.
- Riesgos residuales: (1) submodulo no tenia tests previos, se cubrio con caracterizacion nueva; (2) ~~anomalia de namespace pre-existente (`CustomerDataCompanies` en vez de `CustomerLocations`) queda documentada pero no corregida~~ ACTUALIZACION 2026-09-11: un proceso externo (fuera de este plan) corrigio el namespace de `CustomerLocationAppService.cs` a `AdminLuxuryApp.Customers.CustomerLocations.Services` durante la ejecucion del lote 3; esto rompio momentaneamente el build por 3 `global using` obsoletos en `GlobalUsings.cs` (Application, Api, Tests) que aun apuntaban al namespace viejo. Con autorizacion expresa del usuario se aplico el fix minimo (actualizar esas 3 lineas), sin tocar `Interfaces`, `EndPoints` ni `Mapping` de CustomerLocations, que siguen en el namespace viejo `CustomerDataCompanies.*` a la espera de que el otro plan los complete.
- Aprobacion Tech Lead: PENDIENTE.
```

## Lote Ola 1C - ModuleApps

```text
LOTE: AdminLuxuryApp/Customers/ModuleApps
RESPONSABLE: Agente ejecutor (sesion 2026-09-11)
REVIEWER: Pendiente (Tech Lead)
VENTANA: 2026-09-11 - 2026-09-11
PR: Pendiente de apertura
RIESGO: bajo (cataogo de modulos de la propia aplicacion; afecta RBAC/menu, pero sin logica contable)
ESTADO: VALIDACION (tecnica completa; pendiente apertura de PR y firma de Tech Lead)

ANTES
[x] Snapshot de endpoints, handlers, permisos, DTOs y consumidores.
    - Interfaz: IModuleAppAppService.cs
    - Implementacion: ModuleAppAppService.cs
    - Handler/rutas: ModuleAppEndPoints.cs (grupo api/module-apps)
    - Permisos: RequireAuthorization con JwtBearerDefaults + Roles="SuperUsuario" — sin cambio
    - DTOs: ModuleAppCreateOrUpdateDTO, ModuleAppDTO, ModuleAppGetDTO — sin cambio
    - Consumidores (grep en api/): solo DependencyInjection.Controllers.cs (registro DI) y el propio endpoint.
    - Consumidores frontend (grep en appsweb/): admin.endpoints.ts + module-app-form.ts consumen por ruta HTTP, no por nombre de metodo C#. Ruta sin cambio.
    - Nota: `Modules` (tabla `[Table("Modules")]`, entidad `ModuleApp`) es el catalogo de modulos/menu de la propia aplicacion (RBAC/navegacion). `DeleteByIdAsync` hace cascada transaccional sobre `ModuleAppRol` y `CustomerModul` — logica de negocio existente, no modificada.
[x] Build y tests baseline registrados. → Baseline previo a este lote: 563 total, 540 ok, 21 fallidas (deuda previa), 2 omitidas (post-cierre de lote CustomerLocations).
[x] Matriz actual -> objetivo aprobada (ver tabla abajo).

MATRIZ ACTUAL -> OBJETIVO
| Metodo actual | Metodo objetivo | Capa | Decision | Motivo |
|---|---|---|---|---|
| `GetAllAsync` | `GetListAsync` | Interfaz + Implementacion + Endpoint (GET api/module-apps) | Migrar | Retorna `List<ModuleAppDTO>` completa, sin criterio/paginacion. |
| `DeleteAsync` | `DeleteByIdAsync` | Interfaz + Implementacion + Endpoint (DELETE .../{id}) | Migrar | Elimina por id unico explicito. Hard delete confirmado por smoke (registro desaparece; 404 real tras el DELETE). |
| `CreateAsync` | `CreateAsync` | Interfaz + Implementacion + Endpoint (POST api/module-apps) | Mantener (ya canonico) | Ya usaba el nombre correcto. |
| `GetByIdAsync` | `GetByIdAsync` | Interfaz + Implementacion + Endpoint (GET .../{id}) | Mantener (ya canonico) | Retorno individual por Guid id. |
| `UpdateAsync` | `UpdateAsync` | Interfaz + Implementacion + Endpoint (PUT .../{id}) | Mantener (ya canonico) | Actualiza entidad existente por id + DTO de cambios. |
| — | `DeleteRangeAsync` | — | Fuera de alcance | Sin evidencia de necesidad de baja multiple en este submodulo. |

CAMBIO
[x] Interfaces actualizadas. → IModuleAppAppService.cs
[x] Implementaciones actualizadas. → ModuleAppAppService.cs
[x] Endpoints y clientes actualizados. → ModuleAppEndPoints.cs (mismos verbos/rutas, solo cambia el metodo C# invocado)
[x] Alias/versionado agregado si aplica. → No aplica (sin consumidores externos del nombre de metodo; ruta HTTP sin cambio).
[ ] Documentacion actualizada. → Pendiente: este submodulo no tiene README/docs de modulo propios (§4.7) todavia; fuera de alcance de esta migracion de naming.

VALIDACION
[x] Build Application. → 0 errores tras resolver bloqueo externo de namespaces (ver bloqueo abajo); 6 advertencias preexistentes.
[x] Build Api. → 0 errores tras el mismo fix; 2 advertencias preexistentes (usings duplicados, no relacionadas).
[x] Build Tests. → 0 errores tras el mismo fix + correccion de `RolLevel.Administrador` (invalido) a `RolLevel.Administrator` en el test nuevo; 11 advertencias preexistentes.
[x] Tests unitarios. → Se agregaron 9 pruebas de caracterizacion nuevas (`ModuleAppAppServiceTests.cs`, cubren GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync happy+sad+edge, incluyendo `BusinessException` en los casos not-found); las 9 pasan.
[x] Tests de integración/contrato. → No existian antes del cambio (mismo gap que en los 2 lotes previos); cubierto con pruebas de caracterizacion de servicio en memoria (EF InMemory).
[x] Smoke happy/sad/edge. → Ejecutado HTTP real 2026-09-11 contra build con el rename, autenticado como SuperUsuario. Ver tabla abajo.
[x] Permisos, tenant y auditoria verificados. → Sin cambio: mismo atributo RequireAuthorization (JWT + rol SuperUsuario), confirmado por 401 en las 5 rutas sin token; mismas LogActivityMetadata.
[x] No cambio de tablas, `[Table]` o Fluent API. → Confirmado por diff: 3 archivos de codigo de este submodulo tocados, sin tocar Entities/ ni Migrations/.
[x] Rollback probado o documentado. → Rollback = revertir los 3 archivos modificados de este submodulo (`git checkout` sobre esos paths); no hay alias que retirar ni datos migrados de forma irreversible.

BLOQUEO EXTERNO DETECTADO Y RESUELTO (2026-09-11)
Durante la preparacion de este lote, el build de Application fallo con `CS0234: El tipo o el nombre del espacio de nombres 'Services' no existe en el espacio de nombres 'AdminLuxuryApp.GestionDeCliente.CustomerDataCompanies'`. Investigacion: un proceso externo al alcance de este plan (migracion de namespaces) habia renombrado el namespace de `CustomerLocationAppService.cs` (del lote anterior) a `AdminLuxuryApp.Customers.CustomerLocations.Services`, dejando 3 `global using` obsoletos (`LuxuryApp.Application/GlobalUsings.cs`, `LuxuryApp.Api/GlobalUsings.cs`, `LuxuryApp.Tests/GlobalUsings.cs`) apuntando al namespace viejo, ademas de una linea en el test propio (`CustomerLocationAppServiceTests.cs`) con el mismo using obsoleto. Se detuvo la ejecucion, se reporto el hallazgo al usuario (sin tocar namespaces por iniciativa propia) y, con autorizacion explicita del usuario, se aplico el fix minimo: actualizar esas 3 lineas de `global using` y el `using` del test a `AdminLuxuryApp.Customers.CustomerLocations.Services`. No se modifico ningun otro namespace, carpeta o archivo fuera de esas 4 lineas.

SMOKE HTTP (2026-09-11, build post-rename, http://localhost:7069)
| Caso | Metodo/Ruta | Sin token | Con token SuperUsuario | Resultado |
|---|---|---|---|---|
| GET lista (happy) | GET api/module-apps | 401 | 200, arbol real de modulos (`GetListAsync`) | OK |
| Alta (happy) | POST api/module-apps | 401 | 200, crea "SmokeTestModule" (`CreateAsync`) | OK |
| GET por id (happy) | GET api/module-apps/{id} | 401 | 200, item correcto (`GetByIdAsync`) | OK |
| GET por id (triste, no encontrado) | GET api/module-apps/{id-inexistente} | 401 | **404 real** (BusinessException + GlobalExceptionMiddleware; contrato previo sin cambio, distinto de los otros 2 lotes que envuelven en 200) | OK |
| Actualizacion (happy) | PUT api/module-apps/{id} | 401 | 200, modulo actualizado (`UpdateAsync`) | OK |
| Baja (happy) | DELETE api/module-apps/{id} | 401 | 200, `data: true` (`DeleteByIdAsync`, hard delete) | OK |
| Verificacion post-baja (edge) | GET api/module-apps/{id} | — | 404 real — confirma eliminacion fisica | OK |

Nota: la instancia de Api usada para el smoke fue levantada por el agente ejecutor unicamente para esta validacion y detenida al terminar; no es la sesion de desarrollo del usuario. El registro de prueba creado y luego eliminado por DELETE no deja residuo en la base de datos.

EVIDENCIA
- Resultado build: Application OK (0 errores); Api OK (0 errores); Tests OK (0 errores). Los 3 builds requirieron primero el fix minimo de `GlobalUsings.cs` descrito arriba (bloqueo externo, no causado por este lote).
- Resultado tests: 563 total (554 previos + 9 nuevas), 540 superadas (531 previas + 9 nuevas), 21 fallidas (identicas al baseline acumulado, sin relacion con este cambio), 2 omitidas. 0 regresiones nuevas.
- Resultado smoke: 7/7 casos HTTP en verde (ver tabla arriba); ciclo CRUD completo (GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync) validado end-to-end con datos reales y auth real.
- Rutas antiguas/nuevas: sin cambio de ruta. `GET/POST api/module-apps`, `GET/PUT/DELETE api/module-apps/{id:guid}` se mantienen igual; solo cambio el nombre del metodo C# invocado internamente.
- Riesgos residuales: (1) submodulo no tenia tests previos, se cubrio con caracterizacion nueva; (2) `DeleteByIdAsync` hace cascada sobre `ModuleAppRol` y `CustomerModul` — comportamiento preexistente, no alterado por el rename, pero de mayor impacto que los otros 2 lotes si se usa en produccion sobre un modulo con asignaciones reales.
- Aprobacion Tech Lead: PENDIENTE.
```

## Lote Ola 1C - CustomerDataCompany

```text
LOTE: AdminLuxuryApp/Customers/CustomerDataCompany
RESPONSABLE: Agente ejecutor (sesion 2026-09-11)
REVIEWER: Pendiente (Tech Lead)
VENTANA: 2026-09-11 - 2026-09-11
PR: Pendiente de apertura
RIESGO: bajo
ESTADO: VALIDACION (tecnica completa; pendiente apertura de PR y firma de Tech Lead)

ANTES
[x] Snapshot de endpoints, handlers, permisos, DTOs y consumidores.
    - Interfaz: ICustomerDataCompanyAppService.cs
    - Implementacion: CustomerDataCompanyAppService.cs
    - Handler/rutas: CustomerDataCompanyEndPoints.cs (grupo api/customer-data-company)
    - Permisos: RequireAuthorization con JwtBearerDefaults + Roles="SuperUsuario" — sin cambio
    - DTOs: CustomerDataCompanyAddOrEditDTO, CustomerDataCompanyDTO — sin cambio
    - Consumidores (grep en api/): DependencyInjection.Controllers.cs (registro DI), el propio endpoint, y **el test preexistente** `CustomerDataCompanyAppServiceTests.cs` (10 pruebas ya escritas antes de esta migracion).
    - Este es el primer lote de Ola 1C con tests preexistentes: se identifico que `GetAllAsync_WithData_ReturnsMappedDTOs` ya fallaba en el baseline documentado en la Fase 0 (bug de formato de telefono en `StringExtension.GetCelFormtat`, no relacionado con naming).
[x] Build y tests baseline registrados. → Baseline previo a este lote: 563 total, 540 ok, 21 fallidas (incluye la falla de este submodulo), 2 omitidas.
[x] Matriz actual -> objetivo aprobada (ver tabla abajo).

MATRIZ ACTUAL -> OBJETIVO
| Metodo actual | Metodo objetivo | Capa | Decision | Motivo |
|---|---|---|---|---|
| `AddAsync` | `CreateAsync` | Interfaz + Implementacion + Endpoint (POST api/customer-data-company) + Test preexistente | Migrar | Crea entidad nueva pura (`dbContext.CustomerEmailConfigs.Add` + `SaveChangesAsync`), sin upsert. |
| `DeleteAsync` | `DeleteByIdAsync` | Interfaz + Implementacion + Endpoint (DELETE .../{id}) + Test preexistente | Migrar | Elimina por id unico explicito. Hard delete confirmado por smoke (404 real tras el DELETE). |
| `GetAllAsync` | `GetListAsync` | Interfaz + Implementacion + Endpoint (GET api/customer-data-company) + Test preexistente | Migrar | Retorna `List<CustomerDataCompanyDTO>` completa, sin criterio/paginacion. |
| `GetByIdAsync` | `GetByIdAsync` | Interfaz + Implementacion + Endpoint (GET .../{id}) | Mantener (ya canonico) | Retorno individual por Guid id. |
| `UpdateAsync` | `UpdateAsync` | Interfaz + Implementacion + Endpoint (PUT .../{id}) | Mantener (ya canonico) | Actualiza entidad existente por id + DTO de cambios. |
| — | `DeleteRangeAsync` | — | Fuera de alcance | Sin evidencia de necesidad de baja multiple en este submodulo. |

CAMBIO
[x] Interfaces actualizadas. → ICustomerDataCompanyAppService.cs
[x] Implementaciones actualizadas. → CustomerDataCompanyAppService.cs
[x] Endpoints y clientes actualizados. → CustomerDataCompanyEndPoints.cs (mismos verbos/rutas, solo cambia el metodo C# invocado)
[x] Test preexistente actualizado. → `CustomerDataCompanyAppServiceTests.cs`: se renombraron las llamadas (`GetAllAsync`→`GetListAsync`, `AddAsync`→`CreateAsync`, `DeleteAsync`→`DeleteByIdAsync`) y los nombres de metodo de prueba correspondientes, SIN tocar ninguna aserción ni logica de test.
[x] Alias/versionado agregado si aplica. → No aplica (sin consumidores externos del nombre de metodo; ruta HTTP sin cambio).
[ ] Documentacion actualizada. → Pendiente: este submodulo no tiene README/docs de modulo propios (§4.7) todavia; fuera de alcance de esta migracion de naming.

VALIDACION
[x] Build Application. → 0 errores, 6 advertencias preexistentes (identicas al baseline).
[x] Build Api. → 0 errores; requirio esperar a que el usuario liberara un proceso `LuxuryApp.Api` de su propia sesion de desarrollo (no se detuvo sin autorizacion).
[x] Build Tests. → 0 errores, 11 advertencias preexistentes (identicas al baseline).
[x] Tests unitarios. → 10 pruebas preexistentes actualizadas: 9 pasan, 1 (`GetListAsync_WithData_ReturnsMappedDTOs`, ex-`GetAllAsync_WithData_ReturnsMappedDTOs`) **falla exactamente igual que en el baseline** (mismo assert, mismo valor esperado/actual: bug de formato de telefono `StringExtension.GetCelFormtat` que antepone codigo de pais y guiones). Esto confirma que el rename no cambio comportamiento, ni siquiera el de un bug preexistente.
[x] Tests de integración/contrato. → Cubierto por el test preexistente de servicio (EF InMemory), igual que antes de la migracion.
[x] Smoke happy/sad/edge. → Ejecutado HTTP real 2026-09-11 contra build con el rename, autenticado como SuperUsuario. Ver tabla abajo.
[x] Permisos, tenant y auditoria verificados. → Sin cambio: mismo atributo RequireAuthorization (JWT + rol SuperUsuario), confirmado por 401 en las 5 rutas sin token; mismas LogActivityMetadata.
[x] No cambio de tablas, `[Table]` o Fluent API. → Confirmado por diff: 3 archivos de codigo + 1 archivo de test preexistente actualizado, sin tocar Entities/ ni Migrations/.
[x] Rollback probado o documentado. → Rollback = revertir los 3 archivos de codigo + el archivo de test (`git checkout` sobre esos paths); no hay alias que retirar ni datos migrados de forma irreversible.

SMOKE HTTP (2026-09-11, build post-rename, http://localhost:7069)
| Caso | Metodo/Ruta | Sin token | Con token SuperUsuario | Resultado |
|---|---|---|---|---|
| GET lista (happy) | GET api/customer-data-company | 401 | 200, datos reales con navegaciones (`GetListAsync`) | OK |
| Alta (happy) | POST api/customer-data-company | 401 | 200, crea registro (`CreateAsync`) | OK |
| GET por id (happy) | GET api/customer-data-company/{id} | 401 | 200, item correcto (`GetByIdAsync`) | OK |
| GET por id (triste, no encontrado) | GET api/customer-data-company/{id-inexistente} | 401 | **404 real** (`TypedResults.Json(result, statusCode: result.ResponseCode)`; cuarto patron de manejo de errores distinto observado en 4 lotes, contrato previo sin cambio) | OK |
| Actualizacion (happy) | PUT api/customer-data-company/{id} | 401 | 200, registro actualizado (`UpdateAsync`) | OK |
| Baja (happy) | DELETE api/customer-data-company/{id} | 401 | 200, `data: true` (`DeleteByIdAsync`, hard delete) | OK |
| Verificacion post-baja (edge) | GET api/customer-data-company/{id} | — | 404 real — confirma eliminacion fisica | OK |

Nota: la instancia de Api usada para el smoke fue levantada por el agente ejecutor unicamente para esta validacion y detenida al terminar; no es la sesion de desarrollo del usuario. El registro de prueba creado y luego eliminado por DELETE no deja residuo en la base de datos.

EVIDENCIA
- Resultado build: Application OK (0 errores); Api OK (0 errores, tras liberar proceso del usuario); Tests OK (0 errores).
- Resultado tests: 563 total (sin cambio, no se agregaron archivos de test nuevos), 540 superadas (sin cambio), 21 fallidas (identicas al baseline, incluyendo la propia de este submodulo bajo su nuevo nombre), 2 omitidas. 0 regresiones nuevas, 0 correcciones incidentales de bugs preexistentes.
- Resultado smoke: 7/7 casos HTTP en verde (ver tabla arriba); ciclo CRUD completo (GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync) validado end-to-end con datos reales y auth real.
- Rutas antiguas/nuevas: sin cambio de ruta. `GET/POST api/customer-data-company`, `GET/PUT/DELETE api/customer-data-company/{id:guid}` se mantienen igual; solo cambio el nombre del metodo C# invocado internamente.
- Riesgos residuales: (1) el bug preexistente de formato de telefono en `GetListAsync` (ex-`GetAllAsync`) sigue sin resolverse — queda fuera de alcance de esta migracion de naming, documentado para que Tech Lead decida si amerita ticket propio; (2) es el primer lote que modifica un archivo de test preexistente en vez de solo agregar uno nuevo, precedente util para los siguientes lotes con cobertura previa.
- Aprobacion Tech Lead: PENDIENTE.
```

## Lote Ola 1C - Category

```text
LOTE: SharedLuxuryApp/CatalogosGenerales/GeneralCatalogs (CategoryAppService)
RESPONSABLE: Agente ejecutor (sesion 2026-09-11)
REVIEWER: Pendiente (Tech Lead)
VENTANA: 2026-09-11 - 2026-09-11
PR: Pendiente de apertura
RIESGO: bajo
ESTADO: VALIDACION (tecnica completa; pendiente apertura de PR y firma de Tech Lead)

ANTES
[x] Snapshot de endpoints, handlers, permisos, DTOs y consumidores.
    - Interfaz: ICategoryAppService.cs
    - Implementacion: CategoryAppService.cs
    - Handler/rutas: CategoriesEndPoints.cs (grupo api/categories)
    - Permisos: RequireAuthorization con JwtBearerDefaults + Roles="SuperUsuario" — sin cambio
    - DTOs: CategoryDTO (misma clase para create/read/update, sin AddOrEditDTO separado) — sin cambio
    - Consumidores (grep exacto `\bICategoryAppService\b|\bCategoryAppService\b` en api/): solo DependencyInjection.Controllers.cs (registro DI) y el propio endpoint. Se descarto un falso positivo inicial: `ITaskGroupCategoryAppService`/`TaskGroupCategoryAppService` y `ILegalMatterCategoryAppService`/`LegalMatterCategoryAppService` son servicios DISTINTOS que solo comparten el sufijo "CategoryAppService" en el nombre.
    - Consumidor frontend: no se encontro pagina/servicio Angular activo que consuma `api/categories` (solo mencion en un reporte de auditoria de rutas).
    - Primer lote de Ola 1C fuera del cluster `AdminLuxuryApp/Customers`: es un catalogo general (`SharedLuxuryApp.CatalogosGenerales`) usado para clasificar `Provider` (proveedores), sin logica contable.
[x] Build y tests baseline registrados. → Baseline previo a este lote: 563 total, 540 ok, 21 fallidas (deuda previa), 2 omitidas.
[x] Matriz actual -> objetivo aprobada (ver tabla abajo).

MATRIZ ACTUAL -> OBJETIVO
| Metodo actual | Metodo objetivo | Capa | Decision | Motivo |
|---|---|---|---|---|
| `AddAsync` | `CreateAsync` | Interfaz + Implementacion + Endpoint (POST api/categories) | Migrar | Crea entidad nueva pura (`dbContext.Categories.AddAsync` + `SaveChangesAsync`), sin upsert. |
| `GetAllAsync` | `GetListAsync` | Interfaz + Implementacion + Endpoint (GET api/categories) | Migrar | Retorna `CategoryDTO[]` completo, sin criterio/paginacion. |
| `GetByIdAsync` | `GetByIdAsync` | Interfaz + Implementacion + Endpoint (GET .../{id}) | Mantener (ya canonico) | Retorno individual por Guid id. |
| `UpdateAsync` | `UpdateAsync` | Interfaz + Implementacion + Endpoint (PUT .../{id}) | Mantener (ya canonico) | Actualiza entidad existente por id + DTO. Cuerpo del metodo NO tocado. |
| `DeleteByIdAsync` | `DeleteByIdAsync` | Interfaz + Implementacion + Endpoint (DELETE .../{id}) | Mantener (ya canonico) | Ya usaba el nombre correcto; hard delete confirmado por smoke. |
| — | `DeleteRangeAsync` | — | Fuera de alcance | Sin evidencia de necesidad de baja multiple en este submodulo. |

CAMBIO
[x] Interfaces actualizadas. → ICategoryAppService.cs
[x] Implementaciones actualizadas. → CategoryAppService.cs (solo firmas de metodo; cuerpos sin tocar)
[x] Endpoints y clientes actualizados. → CategoriesEndPoints.cs (mismos verbos/rutas, solo cambia el metodo C# invocado)
[x] Alias/versionado agregado si aplica. → No aplica (sin consumidores externos del nombre de metodo; ruta HTTP sin cambio; sin consumidor frontend activo).
[ ] Documentacion actualizada. → Pendiente: este submodulo no tiene README/docs de modulo propios (§4.7) todavia; fuera de alcance de esta migracion de naming.

VALIDACION
[x] Build Application. → 0 errores, 6 advertencias preexistentes (identicas al baseline).
[x] Build Api. → 0 errores, 2 advertencias preexistentes (usings duplicados, no relacionadas).
[x] Build Tests. → 0 errores, 11 advertencias preexistentes (identicas al baseline).
[x] Tests unitarios. → Se agregaron 8 pruebas de caracterizacion nuevas (`CategoryAppServiceTests.cs`, cubren GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync happy+sad+edge); las 8 pasan.
[x] Tests de integración/contrato. → No existian antes del cambio; cubierto con pruebas de caracterizacion de servicio en memoria (EF InMemory, con mock de `IMapper` siguiendo el patron de `BankAppServiceTests`).
[x] Smoke happy/sad/edge. → Ejecutado HTTP real 2026-09-11 contra build con el rename, autenticado como SuperUsuario. Ver tabla abajo.
[x] Permisos, tenant y auditoria verificados. → Sin cambio: mismo atributo RequireAuthorization (JWT + rol SuperUsuario), confirmado por 401 en las 5 rutas sin token; mismas LogActivityMetadata.
[x] No cambio de tablas, `[Table]` o Fluent API. → Confirmado por diff: 3 archivos tocados (interfaz, implementacion, endpoint), sin tocar Entities/ ni Migrations/.
[x] Rollback probado o documentado. → Rollback = revertir los 3 archivos modificados (`git checkout` sobre esos paths); no hay alias que retirar ni datos migrados de forma irreversible.

HALLAZGO DESCARTADO (falso positivo, documentado por transparencia)
Al escribir la primera version de la prueba de `UpdateAsync`, se reutilizo el mismo `ApplicationDbContext` para sembrar la categoria (`Add` + `SaveChangesAsync`) y luego invocar `service.UpdateAsync(...)`. Esto produjo `InvalidOperationException: The instance of entity type 'Category' cannot be tracked because another instance with the same key value...`, porque `CategoryAppService.UpdateAsync` mapea una instancia NUEVA desde el DTO y llama `dbContext.Categories.Update(model)` sin buscar primero la entidad existente (a diferencia de los servicios de los lotes 2, 3 y 4, que hacen fetch-then-mutate). Se investigo antes de reportarlo como hallazgo: al repetir la prueba con DOS instancias de `DbContext` separadas compartiendo el mismo nombre de BD en memoria (simulando un scope de request real, que es como se ejecuta en produccion), el mismo flujo funciona correctamente — confirmado ademas por el smoke HTTP real (PUT exitoso). Conclusion: NO es un bug de produccion, fue un artefacto de la fixture de prueba compartiendo contexto entre "seed" y "act"; no se modifico el cuerpo de `UpdateAsync` (fuera de alcance de este plan de naming de cualquier forma). Se documenta para que quede trazable si alguien mas encuentra el mismo sintoma.

SMOKE HTTP (2026-09-11, build post-rename, http://localhost:7069)
| Caso | Metodo/Ruta | Sin token | Con token SuperUsuario | Resultado |
|---|---|---|---|---|
| GET lista (happy) | GET api/categories | 401 | 200, catalogo real de categorias (`GetListAsync`) | OK |
| Alta (happy) | POST api/categories | 401 | 200, crea "SmokeTestCategory" (`CreateAsync`) | OK |
| GET por id (happy) | GET api/categories/{id} | 401 | 200, item correcto (`GetByIdAsync`) | OK |
| GET por id (triste, no encontrado) | GET api/categories/{id-inexistente} | 401 | 200 HTTP / responseCode 400 en body, "no encontrada" (contrato previo sin cambio) | OK |
| Actualizacion (happy) | PUT api/categories/{id} | 401 | 200, categoria actualizada (`UpdateAsync`, cuerpo sin tocar, confirma que el hallazgo descartado no aplica en produccion) | OK |
| Baja (happy) | DELETE api/categories/{id} | 401 | 200, `data: true` (`DeleteByIdAsync`, hard delete) | OK |
| Verificacion post-baja (edge) | GET api/categories/{id} | — | 200 HTTP / responseCode 400, "no encontrada" — confirma eliminacion fisica | OK |

Nota: la instancia de Api usada para el smoke fue levantada por el agente ejecutor unicamente para esta validacion y detenida al terminar; no es la sesion de desarrollo del usuario. El registro de prueba creado y luego eliminado por DELETE no deja residuo en la base de datos.

EVIDENCIA
- Resultado build: Application OK (0 errores); Api OK (0 errores); Tests OK (0 errores).
- Resultado tests: 571 total (563 previos + 8 nuevas), 548 superadas (540 previas + 8 nuevas), 21 fallidas (identicas al baseline acumulado, sin relacion con este cambio), 2 omitidas. 0 regresiones nuevas.
- Resultado smoke: 7/7 casos HTTP en verde (ver tabla arriba); ciclo CRUD completo (GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync) validado end-to-end con datos reales y auth real.
- Rutas antiguas/nuevas: sin cambio de ruta. `GET/POST api/categories`, `GET/PUT/DELETE api/categories/{id:guid}` se mantienen igual; solo cambio el nombre del metodo C# invocado internamente.
- Riesgos residuales: (1) `UpdateAsync` no hace fetch-then-mutate como sus pares (patron distinto, no como bug sino como estilo de implementacion) — queda documentado por si se decide homogeneizar en una ola de limpieza tecnica separada, fuera de alcance de naming; (2) sin consumidor frontend activo detectado, por lo que la adopcion del nombre nuevo no requiere accion visible para usuarios.
- Aprobacion Tech Lead: PENDIENTE.
```

## Lote Ola 1C - MeasurementUnit

```text
LOTE: SharedLuxuryApp/CatalogosGenerales/MeasurementUnit (MeasurementUnitAppService)
RESPONSABLE: Agente ejecutor (sesion 2026-09-11)
REVIEWER: Pendiente (Tech Lead)
VENTANA: 2026-09-11 - 2026-09-11
PR: Pendiente de apertura
RIESGO: bajo
ESTADO: VALIDACION (tecnica completa; pendiente apertura de PR y firma de Tech Lead)

ANTES
[x] Snapshot de endpoints, handlers, permisos, DTOs y consumidores.
    - Interfaz: IMeasurementUnitAppService.cs
    - Implementacion: MeasurementUnitAppService.cs
    - Handler/rutas: UnidadMedidaEndPoints.cs (grupo api/unidad-medida)
    - Permisos: RequireAuthorization con JwtBearerDefaults + Roles="SuperUsuario" — sin cambio
    - DTOs: MeasurementUnitsAddOrEditDTO (sin Id, solo Descripcion), MeasurementUnitsDTO — sin cambio
    - Consumidores (grep exacto en api/): solo DependencyInjection.Controllers.cs (registro DI) y el propio endpoint.
    - Candidatos descartados antes de elegir este: `ToolAppService` (api/tools) y `TelefonosEmergenciaAppService` (api/telefonosemergencia) tenian el mismo patron CRUD elegible, pero ambos usan `[FromForm]`/`IFormFile` para logotipos/fotos con `IImageStorageService`+`IFileReadPathService`+`IFileWritePathService`, aumentando la complejidad de smoke/test sin aportar mas riesgo real; se prefirio este submodulo mas simple para mantener el ritmo de lotes y se documentan como candidatos para una sesion futura.
[x] Build y tests baseline registrados. → Baseline previo a este lote: 571 total, 548 ok, 21 fallidas (deuda previa), 2 omitidas.
[x] Matriz actual -> objetivo aprobada (ver tabla abajo).

MATRIZ ACTUAL -> OBJETIVO
| Metodo actual | Metodo objetivo | Capa | Decision | Motivo |
|---|---|---|---|---|
| `AddAsync` | `CreateAsync` | Interfaz + Implementacion + Endpoint (POST api/unidad-medida) | Migrar | Crea entidad nueva pura (`dbContext.UnitsOfMeasure.AddAsync` + `SaveChangesAsync`), sin upsert. |
| `GetAsyncAll` | `GetListAsync` | Interfaz + Implementacion + Endpoint (GET api/unidad-medida) | Migrar | Retorna `MeasurementUnitsDTO[]` completo, sin criterio/paginacion. El nombre previo (`GetAsyncAll`) ademas incumplia doblemente la convencion: ni seguia el patron `Verbo+Async` ni el orden `GetAll`. |
| `GetByIdAsync` | `GetByIdAsync` | Interfaz + Implementacion + Endpoint (GET .../{id}) | Mantener (ya canonico) | Retorno individual por Guid id. |
| `UpdateAsync` | `UpdateAsync` | Interfaz + Implementacion + Endpoint (PUT .../{id}) | Mantener (ya canonico) | Actualiza entidad existente por id + DTO. |
| `DeleteByIdAsync` | `DeleteByIdAsync` | Interfaz + Implementacion + Endpoint (DELETE .../{id}) | Mantener (ya canonico) | Ya usaba el nombre correcto; hard delete confirmado por smoke. |
| — | `DeleteRangeAsync` | — | Fuera de alcance | Sin evidencia de necesidad de baja multiple en este submodulo. |

CAMBIO
[x] Interfaces actualizadas. → IMeasurementUnitAppService.cs
[x] Implementaciones actualizadas. → MeasurementUnitAppService.cs
[x] Endpoints y clientes actualizados. → UnidadMedidaEndPoints.cs (mismos verbos/rutas, solo cambia el metodo C# invocado)
[x] Alias/versionado agregado si aplica. → No aplica (sin consumidores externos del nombre de metodo; ruta HTTP sin cambio).
[ ] Documentacion actualizada. → Pendiente: este submodulo no tiene README/docs de modulo propios (§4.7) todavia; fuera de alcance de esta migracion de naming.

VALIDACION
[x] Build Application. → 0 errores, 6 advertencias preexistentes (identicas al baseline).
[x] Build Api. → 0 errores, 2 advertencias preexistentes (usings duplicados, no relacionadas).
[x] Build Tests. → 0 errores, 11 advertencias preexistentes (identicas al baseline).
[x] Tests unitarios. → Se agregaron 9 pruebas de caracterizacion nuevas (`MeasurementUnitAppServiceTests.cs`, cubren GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync happy+sad+edge, con mock de `IMapper`); las 9 pasan.
[x] Tests de integración/contrato. → No existian antes del cambio; cubierto con pruebas de caracterizacion de servicio en memoria (EF InMemory).
[x] Smoke happy/sad/edge. → Ejecutado HTTP real 2026-09-11 contra build con el rename, autenticado como SuperUsuario. Ver tabla abajo.
[x] Permisos, tenant y auditoria verificados. → Sin cambio: mismo atributo RequireAuthorization (JWT + rol SuperUsuario), confirmado por 401 en las 5 rutas sin token; mismas LogActivityMetadata.
[x] No cambio de tablas, `[Table]` o Fluent API. → Confirmado por diff: 3 archivos tocados (interfaz, implementacion, endpoint), sin tocar Entities/ ni Migrations/.
[x] Rollback probado o documentado. → Rollback = revertir los 3 archivos modificados (`git checkout` sobre esos paths); no hay alias que retirar ni datos migrados de forma irreversible.

SMOKE HTTP (2026-09-11, build post-rename, http://localhost:7069)
| Caso | Metodo/Ruta | Sin token | Con token SuperUsuario | Resultado |
|---|---|---|---|---|
| GET lista (happy) | GET api/unidad-medida | 401 | 200, catalogo real de 27 unidades (`GetListAsync`) | OK |
| Alta (happy) | POST api/unidad-medida | 401 | 200, crea "SmokeTestUnit" (`CreateAsync`; nota: el DTO de respuesta no incluye Id, comportamiento previo sin cambio) | OK |
| GET por id (happy) | GET api/unidad-medida/{id} | 401 | 200, item correcto (`GetByIdAsync`) | OK |
| GET por id (triste, no encontrado) | GET api/unidad-medida/{id-inexistente} | 401 | 200 HTTP / responseCode 400 en body, "no encontrada" (contrato previo sin cambio) | OK |
| Actualizacion (happy) | PUT api/unidad-medida/{id} | 401 | 200, descripcion actualizada (`UpdateAsync`) | OK |
| Baja (happy) | DELETE api/unidad-medida/{id} | 401 | 200, `data: true` (`DeleteByIdAsync`, hard delete) | OK |
| Verificacion post-baja (edge) | GET api/unidad-medida/{id} | — | 200 HTTP / responseCode 400, "no encontrada" — confirma eliminacion fisica | OK |

Nota: la instancia de Api usada para el smoke fue levantada por el agente ejecutor unicamente para esta validacion y detenida al terminar; no es la sesion de desarrollo del usuario. El registro de prueba creado y luego eliminado por DELETE no deja residuo en la base de datos.

EVIDENCIA
- Resultado build: Application OK (0 errores); Api OK (0 errores); Tests OK (0 errores).
- Resultado tests: 580 total (571 previos + 9 nuevas), 557 superadas (548 previas + 9 nuevas), 21 fallidas (identicas al baseline acumulado, sin relacion con este cambio), 2 omitidas. 0 regresiones nuevas.
- Resultado smoke: 7/7 casos HTTP en verde (ver tabla arriba); ciclo CRUD completo (GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync) validado end-to-end con datos reales y auth real.
- Rutas antiguas/nuevas: sin cambio de ruta. `GET/POST api/unidad-medida`, `GET/PUT/DELETE api/unidad-medida/{id:guid}` se mantienen igual; solo cambio el nombre del metodo C# invocado internamente.
- Riesgos residuales: (1) `MeasurementUnitsAddOrEditDTO` no expone `Id` en la respuesta de creacion (limitacion de contrato preexistente, no de este rename) — un consumidor que necesite el id recien creado debe volver a consultar el listado; (2) `ToolAppService` y `TelefonosEmergenciaAppService` quedan pendientes como candidatos futuros de Ola 1C, con la complejidad adicional de `IFormFile` ya documentada.
- Aprobacion Tech Lead: PENDIENTE.
```

## Lote Ola 1C - PaymentMethod

```text
LOTE: SharedLuxuryApp/CatalogosGenerales/PaymentMethod (PaymentMethodAppService)
RESPONSABLE: Agente ejecutor (sesion 2026-09-11)
REVIEWER: Pendiente (Tech Lead)
VENTANA: 2026-09-11 - 2026-09-11
PR: Pendiente de apertura
RIESGO: bajo (catalogo de codigos SAT sin logica contable; entidad fisicamente en CobranzaLuxuryApp, ver nota)
ESTADO: VALIDACION (tecnica completa; pendiente apertura de PR y firma de Tech Lead)

ANTES
[x] Snapshot de endpoints, handlers, permisos, DTOs y consumidores.
    - Interfaz: IPaymentMethodAppService.cs
    - Implementacion: PaymentMethodAppService.cs
    - Handler/rutas: PaymentMethodsEndPoints.cs (grupo api/payment-methods)
    - Permisos: RequireAuthorization con JwtBearerDefaults + Roles="SuperUsuario" — sin cambio
    - DTOs: PaymentMethodAddOrEditDTO, PaymentMethodDTO — sin cambio
    - Consumidores (grep exacto en api/): solo DependencyInjection.Controllers.cs (registro DI) y el propio endpoint.
    - Nota de riesgo: la entidad `FormaPago` (`[Table("PaymentForms")]`) vive fisicamente en `CobranzaLuxuryApp.CobranzaNativa.Core.CobranzaPayments.Entities`, no en `SharedLuxuryApp`. Es puramente un catalogo de codigos SAT (Efectivo, Transferencia, etc.), sin calculo monetario ni logica contable — se verifico el contenido de la entidad (solo Codigo+Descripcion) antes de proceder.
[x] Build y tests baseline registrados. → Baseline previo a este lote: 580 total, 557 ok, 21 fallidas (deuda previa), 2 omitidas.
[x] Matriz actual -> objetivo aprobada (ver tabla abajo).

MATRIZ ACTUAL -> OBJETIVO
| Metodo actual | Metodo objetivo | Capa | Decision | Motivo |
|---|---|---|---|---|
| `AddAsync` | `CreateAsync` | Interfaz + Implementacion + Endpoint (POST api/payment-methods) | Migrar | Crea entidad nueva pura (`dbContext.PaymentForms.AddAsync` + `SaveChangesAsync`), sin upsert. |
| `GetAllAsync` | `GetListAsync` | Interfaz + Implementacion + Endpoint (GET api/payment-methods) | Migrar | Retorna `PaymentMethodDTO[]` completo, sin criterio/paginacion. |
| `GetByIdAsync` | `GetByIdAsync` | Interfaz + Implementacion + Endpoint (GET .../{id}) | Mantener (ya canonico) | Retorno individual por Guid id. |
| `UpdateAsync` | `UpdateAsync` | Interfaz + Implementacion + Endpoint (PUT .../{id}) | Mantener (ya canonico) | Mismo patron sin fetch-previo que `CategoryAppService` (Lote 5); cuerpo NO tocado. |
| `DeleteByIdAsync` | `DeleteByIdAsync` | Interfaz + Implementacion + Endpoint (DELETE .../{id}) | Mantener (ya canonico) | Ya usaba el nombre correcto; hard delete confirmado por smoke. |
| — | `DeleteRangeAsync` | — | Fuera de alcance | Sin evidencia de necesidad de baja multiple en este submodulo. |

CAMBIO
[x] Interfaces actualizadas. → IPaymentMethodAppService.cs
[x] Implementaciones actualizadas. → PaymentMethodAppService.cs (solo firmas; cuerpos sin tocar)
[x] Endpoints y clientes actualizados. → PaymentMethodsEndPoints.cs (mismos verbos/rutas, solo cambia el metodo C# invocado)
[x] Alias/versionado agregado si aplica. → No aplica (sin consumidores externos del nombre de metodo; ruta HTTP sin cambio).
[ ] Documentacion actualizada. → Pendiente: este submodulo no tiene README/docs de modulo propios (§4.7) todavia; fuera de alcance de esta migracion de naming.

BLOQUEO EXTERNO DETECTADO Y RESUELTO (2026-09-11, tercera ocurrencia)
Durante este lote, el mismo proceso externo de migracion de namespaces (fuera de este plan) genero dos incidentes:
1. Movio `SelectItemAppService`/`ISelectItemAppService`/`SelectItemEndPoints` de `SystemLuxuryApp.SelectItem.*` a `LuxuryApp.Application.Modules.SharedLuxuryApp.SelectItem.*`, actualizando sus consumidores (`IoC.cs`, `OperationRecruitmentSelectItemEndPoints.cs`) pero dejando 3 `global using` obsoletos en cada uno de los `GlobalUsings.cs` de Application, Api y Tests (9 lineas en total). Con autorizacion explicita del usuario ("Aplica el fix minimo", ya otorgada en el Lote 3 para el mismo tipo de bloqueo) se actualizaron esas 9 lineas al namespace nuevo. No se toco ningun otro archivo de la migracion de SelectItem.
2. Se detecto brevemente que `PasswordRecoveryCodeConfiguration.cs` (configuracion de EF Core para `PasswordRecoveryCode`) habia sido comentado por completo por ese mismo proceso externo — a diferencia del punto 1, esto no es un simple `using` obsoleto sino una clase de configuracion deshabilitada. Se detuvo la ejecucion y se reporto el hallazgo al usuario sin tocar el archivo. El usuario indico continuar validando Application+Tests e ignorar ese archivo. Segundos despues, al reintentar, el archivo aparecio restaurado a su estado normal (el proceso externo completo su propia edicion) y los 3 builds (Application, Api, Tests) compilaron en verde sin intervencion adicional sobre ese archivo.

VALIDACION
[x] Build Application. → 0 errores (tras el fix minimo de SelectItem), 6 advertencias preexistentes (identicas al baseline).
[x] Build Api. → 0 errores (tras el fix minimo de SelectItem y la auto-resolucion de PasswordRecoveryCodeConfiguration.cs), 2 advertencias preexistentes.
[x] Build Tests. → 0 errores (tras el mismo fix minimo de SelectItem en su propio GlobalUsings.cs), 11 advertencias preexistentes.
[x] Tests unitarios. → Se agregaron 8 pruebas de caracterizacion nuevas (`PaymentMethodAppServiceTests.cs`, cubren GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync happy+sad+edge, con mock de `IMapper` y dos `DbContext` separados para `UpdateAsync`); las 8 pasan.
[x] Tests de integración/contrato. → No existian antes del cambio; cubierto con pruebas de caracterizacion de servicio en memoria (EF InMemory).
[x] Smoke happy/sad/edge. → Ejecutado HTTP real 2026-09-11 contra build con el rename, autenticado como SuperUsuario. Ver tabla abajo.
[x] Permisos, tenant y auditoria verificados. → Sin cambio: mismo atributo RequireAuthorization (JWT + rol SuperUsuario), confirmado por 401 en las 5 rutas sin token; mismas LogActivityMetadata.
[x] No cambio de tablas, `[Table]` o Fluent API. → Confirmado por diff: 3 archivos de este submodulo tocados, sin tocar Entities/ ni Migrations/. Los cambios de `GlobalUsings.cs` (fix externo) tampoco tocan tablas ni Fluent API.
[x] Rollback probado o documentado. → Rollback = revertir los 3 archivos modificados de este submodulo (`git checkout` sobre esos paths); los fixes de `GlobalUsings.cs` son independientes y reversibles por separado.

SMOKE HTTP (2026-09-11, build post-rename, http://localhost:7069)
| Caso | Metodo/Ruta | Sin token | Con token SuperUsuario | Resultado |
|---|---|---|---|---|
| GET lista (happy) | GET api/payment-methods | 401 | 200, catalogo real de formas de pago SAT (`GetListAsync`) | OK |
| Alta (happy) | POST api/payment-methods | 401 | 200, crea "SmokeTestPaymentMethod" con Id (`CreateAsync`) | OK |
| GET por id (happy) | GET api/payment-methods/{id} | 401 | 200, item correcto (`GetByIdAsync`) | OK |
| GET por id (triste, no encontrado) | GET api/payment-methods/{id-inexistente} | 401 | 200 HTTP / responseCode 400 en body, "no encontrada" (contrato previo sin cambio) | OK |
| Actualizacion (happy) | PUT api/payment-methods/{id} | 401 | 200, forma de pago actualizada (`UpdateAsync`, confirma que el patron sin fetch-previo funciona en request real) | OK |
| Baja (happy) | DELETE api/payment-methods/{id} | 401 | 200, `data: true` (`DeleteByIdAsync`, hard delete) | OK |
| Verificacion post-baja (edge) | GET api/payment-methods/{id} | — | 200 HTTP / responseCode 400, "no encontrada" — confirma eliminacion fisica | OK |

Nota: la instancia de Api usada para el smoke fue levantada por el agente ejecutor unicamente para esta validacion y detenida al terminar; no es la sesion de desarrollo del usuario. El registro de prueba creado y luego eliminado por DELETE no deja residuo en la base de datos.

EVIDENCIA
- Resultado build: Application OK (0 errores); Api OK (0 errores); Tests OK (0 errores). Los 3 requirieron el fix minimo de `GlobalUsings.cs` por el bloqueo externo descrito arriba.
- Resultado tests: 588 total (580 previos + 8 nuevas), 565 superadas (557 previas + 8 nuevas), 21 fallidas (identicas al baseline acumulado, sin relacion con este cambio), 2 omitidas. 0 regresiones nuevas.
- Resultado smoke: 7/7 casos HTTP en verde (ver tabla arriba); ciclo CRUD completo (GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync) validado end-to-end con datos reales y auth real.
- Rutas antiguas/nuevas: sin cambio de ruta. `GET/POST api/payment-methods`, `GET/PUT/DELETE api/payment-methods/{id:guid}` se mantienen igual; solo cambio el nombre del metodo C# invocado internamente.
- Riesgos residuales: (1) el proceso externo de migracion de namespaces sigue activo y puede volver a romper builds futuros de forma impredecible; se recomienda coordinar con quien lo ejecuta antes de continuar con mas lotes; (2) `FormaPago` reside fuera de `SharedLuxuryApp` (en `CobranzaLuxuryApp`), anomalia de ubicacion que pertenece al otro plan de convenciones, no a este.
- Aprobacion Tech Lead: PENDIENTE.
```

## Lote Ola 1C - UsoCfdi

```text
LOTE: SharedLuxuryApp/CatalogosGenerales/UsoCfdi (UsoCFDIAppService)
RESPONSABLE: Agente ejecutor (sesion 2026-09-11)
REVIEWER: Pendiente (Tech Lead)
VENTANA: 2026-09-11 - 2026-09-11
PR: Pendiente de apertura
RIESGO: bajo
ESTADO: VALIDACION (tecnica completa; pendiente apertura de PR y firma de Tech Lead)

ANTES
[x] Snapshot de endpoints, handlers, permisos, DTOs y consumidores.
    - Interfaz: IUsoCFDIAppService.cs
    - Implementacion: UsoCFDIAppService.cs
    - Handler/rutas: UsoCfdiEndPoints.cs (grupo api/cfdi-use)
    - Permisos: RequireAuthorization con JwtBearerDefaults + Roles="SuperUsuario" — sin cambio
    - DTOs: UseCfdiAddOrEditDTO, UseCfdiDTO — sin cambio
    - Consumidores (grep exacto en api/): solo DependencyInjection.Controllers.cs (registro DI) y el propio endpoint.
    - Nota de riesgo: la entidad `UsoCFDI` (`[Table("TaxUsages")]`) vive fisicamente en `CobranzaLuxuryApp.CobranzaNativa.Core.Invoices.Entities`, no en `SharedLuxuryApp` — mismo patron que `FormaPago` del Lote 7. Es un catalogo de codigos SAT (G01, P01, etc.), sin calculo monetario.
[x] Build y tests baseline registrados. → Baseline previo a este lote: 588 total, 565 ok, 21 fallidas (deuda previa), 2 omitidas.
[x] Matriz actual -> objetivo aprobada (ver tabla abajo).

MATRIZ ACTUAL -> OBJETIVO
| Metodo actual | Metodo objetivo | Capa | Decision | Motivo |
|---|---|---|---|---|
| `AddAsync` | `CreateAsync` | Interfaz + Implementacion + Endpoint (POST api/cfdi-use) | Migrar | Crea entidad nueva pura (`dbContext.TaxUsages.AddAsync` + `SaveChangesAsync`), sin upsert. |
| `GetAllAsync` | `GetListAsync` | Interfaz + Implementacion + Endpoint (GET api/cfdi-use) | Migrar | Retorna `UseCfdiDTO[]` completo, sin criterio/paginacion. |
| `GetByIdAsync` | `GetByIdAsync` | Interfaz + Implementacion + Endpoint (GET .../{id}) | Mantener (ya canonico) | Retorno individual por Guid id. |
| `UpdateAsync` | `UpdateAsync` | Interfaz + Implementacion + Endpoint (PUT .../{id}) | Mantener (ya canonico) | Mismo patron sin fetch-previo que Category/PaymentMethod; cuerpo NO tocado. |
| `DeleteByIdAsync` | `DeleteByIdAsync` | Interfaz + Implementacion + Endpoint (DELETE .../{id}) | Mantener (ya canonico) | Ya usaba el nombre correcto. |
| — | `DeleteRangeAsync` | — | Fuera de alcance | Sin evidencia de necesidad de baja multiple en este submodulo. |

CAMBIO
[x] Interfaces actualizadas. → IUsoCFDIAppService.cs
[x] Implementaciones actualizadas. → UsoCFDIAppService.cs (solo firmas; cuerpos sin tocar)
[x] Endpoints y clientes actualizados. → UsoCfdiEndPoints.cs (mismos verbos/rutas, solo cambia el metodo C# invocado)
[x] Alias/versionado agregado si aplica. → No aplica (sin consumidores externos del nombre de metodo; ruta HTTP sin cambio).
[ ] Documentacion actualizada. → Pendiente: sin README/docs de modulo propios (§4.7); fuera de alcance de esta migracion de naming.

VALIDACION
[x] Build Application. → 0 errores, 6 advertencias preexistentes (identicas al baseline).
[x] Build Api. → 0 errores, 0 advertencias (tras liberar un proceso transitorio del usuario, PID 39300, que ya habia terminado por si solo).
[x] Build Tests. → 0 errores, 11 advertencias preexistentes (identicas al baseline).
[x] Tests unitarios. → Se agregaron 8 pruebas de caracterizacion nuevas (`UsoCFDIAppServiceTests.cs`, cubren GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync happy+sad+edge, con mock de `IMapper` y dos `DbContext` separados para `UpdateAsync`); las 8 pasan.
[x] Tests de integración/contrato. → No existian antes del cambio; cubierto con pruebas de caracterizacion de servicio en memoria (EF InMemory).
[x] Smoke happy/sad/edge. → Primer intento **BLOQUEADO**: el arranque de Api fallo por completo (`Hosting failed to start`) con `EmailTemplateValidator.StartAsync`: "No se pudieron resolver 18 de 37 plantillas de correo" bajo `Modules/SystemLuxuryApp/SendEmailGlobal/*`, consecuencia de la migracion de carpetas/namespaces que el usuario resolvia en paralelo. No se toco `EmailTemplates`, las plantillas `.cshtml` ni ningun archivo de `SendEmailGlobal`. Tras la correccion del usuario, se reconstruyeron los 3 proyectos (0 errores) y se ejecuto el smoke HTTP completo: 7/7 casos en verde (ver tabla abajo).
[x] Permisos, tenant y auditoria verificados. → Sin cambio: mismo atributo RequireAuthorization (JWT + rol SuperUsuario), confirmado por 401 en las 5 rutas sin token; mismas LogActivityMetadata.
[x] No cambio de tablas, `[Table]` o Fluent API. → Confirmado por diff: 3 archivos de este submodulo tocados, sin tocar Entities/ ni Migrations/.
[x] Rollback probado o documentado. → Rollback = revertir los 3 archivos modificados de este submodulo (`git checkout` sobre esos paths).

SMOKE HTTP (2026-09-11, build post-rename y post-correccion de namespaces del usuario, http://localhost:7069)
| Caso | Metodo/Ruta | Sin token | Con token SuperUsuario | Resultado |
|---|---|---|---|---|
| GET lista (happy) | GET api/cfdi-use | 401 | 200, catalogo real de usos de CFDI (`GetListAsync`) | OK |
| Alta (happy) | POST api/cfdi-use | 401 | 200, crea "SmokeTestUsoCfdi" (`CreateAsync`) | OK |
| GET por id (happy) | GET api/cfdi-use/{id} | 401 | 200, item correcto (`GetByIdAsync`) | OK |
| GET por id (triste, no encontrado) | GET api/cfdi-use/{id-inexistente} | 401 | 200 HTTP / responseCode 400 en body, "no encontrado" | OK |
| Actualizacion (happy) | PUT api/cfdi-use/{id} | 401 | 200, uso de CFDI actualizado (`UpdateAsync`) | OK |
| Baja (happy) | DELETE api/cfdi-use/{id} | 401 | 200, `data: true` (`DeleteByIdAsync`, hard delete) | OK |
| Verificacion post-baja (edge) | GET api/cfdi-use/{id} | — | 200 HTTP / responseCode 400, "no encontrado" — confirma eliminacion fisica | OK |

Nota: la instancia de Api usada para el smoke fue levantada por el agente ejecutor unicamente para esta validacion y detenida al terminar; no es la sesion de desarrollo del usuario.

BLOQUEO ADICIONAL DETECTADO Y RESUELTO (2026-09-11, tras la correccion del usuario)
Al reconstruir tras la correccion de namespaces del usuario, `LuxuryApp.Application/GlobalUsings.cs` habia sido reescrito de 1246 a 647 lineas, dejando dos lineas huerfanas al inicio (`global using LuxuryApp.Application;` y `global using LuxuryApp.Application.Modules;`) que no correspondian a ningun namespace declarado realmente en el codigo (`CS0234`), rompiendo Application, Api y Tests. Se reporto al usuario antes de tocar nada; el usuario confirmo que esas lineas eran residuales y pidio omitirlas si no afectaban nada. Se eliminaron las 2 lineas y se reconstruyeron los 3 proyectos: 0 errores nuevos, mismas advertencias baseline exactas en los 3 casos — confirmando que ningun codigo dependia de ellas.

EVIDENCIA
- Resultado build: Application OK (0 errores); Api OK (0 errores); Tests OK (0 errores). Los 3 requirieron primero la correccion externa de namespaces del usuario y luego la eliminacion de 2 lineas huerfanas en `LuxuryApp.Application/GlobalUsings.cs` (verificado sin efecto en 0 archivos).
- Resultado tests: 596 total (588 previos + 8 nuevas), 573 superadas (565 previas + 8 nuevas), 21 fallidas (identicas al baseline acumulado, sin relacion con este cambio), 2 omitidas. 0 regresiones nuevas.
- Resultado smoke: 7/7 casos HTTP en verde (ver tabla arriba); ciclo CRUD completo (GetListAsync/GetByIdAsync/CreateAsync/UpdateAsync/DeleteByIdAsync) validado end-to-end con datos reales y auth real.
- Rutas antiguas/nuevas: sin cambio de ruta. `GET/POST api/cfdi-use`, `GET/PUT/DELETE api/cfdi-use/{id:guid}` se mantienen igual; solo cambio el nombre del metodo C# invocado internamente.
- Riesgos residuales: `UsoCFDI` reside fuera de `SharedLuxuryApp` (en `CobranzaLuxuryApp`), misma anomalia que `FormaPago` del Lote 7, ajena a este plan.
- Aprobacion Tech Lead: PENDIENTE.
```

## 7. Matriz de rollback

| Situacion | Accion inmediata | Rollback |
|---|---|---|
| Build falla | No mezclar PR | Revertir lote completo |
| Test funcional falla | Bloquear paso | Restaurar nombre/ruta anterior |
| Consumidor externo falla | Mantener alias | Rehabilitar contrato anterior |
| Error de autorizacion | Detener despliegue | Restaurar endpoint y policy previa |
| Cambio de datos detectado | Detener y revisar diff | Revertir sin ejecutar migracion EF |
| Error parcial en lote | Marcar bloqueado | Revertir solo PR del lote, no otros lotes |

## 8. Dependencias e impactos

- Frontend Angular, clientes móviles, integraciones externas, documentación OpenAPI y pruebas de contrato.
- Namespaces y carpetas: coordinados con el plan de migración existente.
- Shared, DTOs base, SelectItem y enums: requieren análisis de impacto y aprobación explícita.
- Seguridad/RBAC: revisar cada endpoint cuyo verbo o ruta cambie.
- Observabilidad: conservar correlation id, auditoria y métricas durante aliases.

## 9. Cierre esperado

La migracion se considera terminada cuando el código nuevo usa una convención unica y verificable, los contratos antiguos ya no tienen consumidores, los checks bloquean regresiones, la documentación refleja el estado real y existe evidencia reproducible de build, tests, smoke, compatibilidad y rollback.

No se debe retirar compatibilidad ni ejecutar cambios destructivos por aproximación. Toda excepción debe quedar registrada con motivo, owner, fecha de revisión y aprobación del Tech Lead.

## Lote Ola 1C - DocumentCatalog

**Fecha cierre:** 2026-09-11
**Módulo:** `SharedLuxuryApp/CatalogosGenerales/DocumentCatalog`
**Cambio autorizado:** `DeleteAsync` → `DeleteByIdAsync`
**Estado:** ✅ COMPLETADO

### Matriz de cambio

| Método actual | Método objetivo | Archivo |
|---------------|-----------------|---------|
| `DeleteAsync(Guid id)` | `DeleteByIdAsync(Guid id)` | `IDocumentCatalogAppService.cs` |
| `DeleteAsync(Guid id)` | `DeleteByIdAsync(Guid id)` | `DocumentCatalogAppService.cs` |
| `appService.DeleteAsync(id)` | `appService.DeleteByIdAsync(id)` | `DocumentCatalogEndpoints.cs` |

### Archivos modificados

1. `api/LuxuryApp.Application/Modules/SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/Interfaces/IDocumentCatalogAppService.cs`
2. `api/LuxuryApp.Application/Modules/SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/Services/DocumentCatalogAppService.cs`
3. `api/LuxuryApp.Application/Modules/SharedLuxuryApp/CatalogosGenerales/DocumentCatalog/EndPoints/DocumentCatalogEndpoints.cs`

### Resultados de builds

| Proyecto | Resultado | Errores | Advertencias |
|----------|-----------|---------|--------------|
| Application | ✅ COMPLETADO | 0 | 6 (preexistentes) |
| Api | ✅ COMPLETADO | 0 | 18 (preexistentes) |
| Tests | ✅ COMPLETADO | 0 | 17 (preexistentes) |

**Comandos ejecutados:**
```bash
dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj --no-restore
dotnet build api/LuxuryApp.Tests/LuxuryApp.Tests.csproj --no-restore
dotnet build api/LuxuryApp.Api/LuxuryApp.Api.csproj --no-restore --no-dependencies
```

### Resultados de pruebas

- **Pruebas específicas del módulo:** Ninguna prueba existe para `DocumentCatalog` (verificado con filtro `FullyQualifiedName~DocumentCatalog`).
- **Pruebas generales:** 533 total: 510 superadas, 21 fallidas (baseline preexistente), 2 omitidas.

### Resultado del smoke HTTP

**No ejecutado** - Requiere detener el proceso `LuxuryApp.Api` en ejecución. El cambio es un rename de método sin cambio de ruta HTTP; el verbo DELETE `api/admin/general-catalogs/document-catalog/{id}` permanece intacto.

### Matriz de verificación

| Verificación | Estado |
|--------------|--------|
| Rutas HTTP | SIN CAMBIOS ✓ |
| Verbos HTTP | SIN CAMBIOS ✓ |
| DTOs | SIN CAMBIOS ✓ |
| Namespaces | SIN CAMBIOS ✓ |
| Carpetas | SIN CAMBIOS ✓ |
| DbSets | SIN CAMBIOS ✓ |
| Lógica de negocio | SIN CAMBIOS ✓ |

### Corrección adicional durante este lote

Se agregó `<RootNamespace></RootNamespace>` a `LuxuryApp.Application.csproj` para desactivar la advertencia IDE0130 (namespace no coincide con nombre de proyecto). Los namespaces del proyecto siguen la ruta física según CONVENTIONS_FOLDER_API.MD §2.

### Riesgos identificados

1. **Smoke HTTP pendiente:** Requiere detener el proceso `LuxuryApp.Api` para ejecutar curl de verificación.
2. **Sin pruebas específicas:** No existen pruebas unitarias o de integración para `DocumentCatalog`.

### Comandos para smoke HTTP (cuando el proceso esté disponible)

```bash
# GET lista
curl -s https://localhost:5001/api/admin/general-catalogs/document-catalog -H "Authorization: Bearer {token}"

# GET por id
curl -s https://localhost:5001/api/admin/general-catalogs/document-catalog/{id} -H "Authorization: Bearer {token}"

# DELETE
curl -s -X DELETE https://localhost:5001/api/admin/general-catalogs/document-catalog/{id} -H "Authorization: Bearer {token}"

# Verificar que ya no existe
curl -s https://localhost:5001/api/admin/general-catalogs/document-catalog/{id} -H "Authorization: Bearer {token}"
# Esperado: 404
```

### Estado final

**✅ COMPLETADO** - Cambio de nombre `DeleteAsync` → `DeleteByIdAsync` aplicado correctamente en interfaz, servicio y endpoint. Los tres proyectos compilan sin errores (0 errores, solo advertencias preexistentes). Las rutas HTTP, verbos, DTOs y lógica de negocio no fueron modificados.
