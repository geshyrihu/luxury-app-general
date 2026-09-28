# Plan de Remediacion - Solicitudes de Compra

**Fecha de actualizacion:** 2026-09-20
**Estado:** En ejecucion - Fase 1
**Modulo:** `PurchasesLuxuryApp/PurchaseRequests`
**Origen:** analisis end-to-end front/back del estado actual
**Documento historico relacionado:** `20260730-auditoria-purchases-solicitudes-compra.md`
**Backend:** `api/LuxuryApp.Application/Modules/PurchasesLuxuryApp/PurchaseRequests/`
**Frontend:** `appsweb/angular/src/app/modules/purchases.luxuryapp/purchase-requests/`

**Avance 2026-09-20:** se restringio presentacion a solicitudes pendientes en
backend y UI. Se corrigio el generador para calcular el maximo real por
cliente/periodo y bloquear concurrencia. La reparacion historica se ejecutara
desde DatabaseBackup antes de cerrar RN-SC-006.

Diagnostico: `20260920-diagnostico-folios-duplicados.md`. Se detectaron 95 grupos
duplicados, 188 filas excedentes y 8 clientes afectados. No se aplicara constraint
unico; la prevencion dependera del generador corregido y su bloqueo transaccional.

---

## 1. Resumen Ejecutivo

Solicitudes de Compra opera con cabecera, partidas, cotizaciones, comparativo,
presupuesto, evidencias, presentacion y vinculos con Ordenes de Compra. El flujo
principal funciona, pero existen riesgos altos en aislamiento multi-tenant,
contratos publicos, actualizacion masiva de datos, archivos y pruebas.

La remediacion debe ejecutarse en orden: primero seguridad y preservacion de
contrato, despues integridad operativa, luego typing/documentacion y finalmente
limpieza estructural. No se debe iniciar un refactor frontend amplio antes de
cerrar autorizacion por tenant.

## 2. FASE 0 - Problem Statement y KPIs

### 2.1 Problem Statement

Actualmente, usuarios autenticados pueden operar solicitudes, partidas,
cotizaciones, evidencias o presupuestos mediante identificadores sin que todos
los servicios validen pertenencia a `CustomerId`, lo que puede producir acceso o
modificacion cruzada entre tenants. Ademas, frontend y backend mantienen
contratos parcialmente tipados y rutas legacy, lo que aumenta regresiones y
dificulta verificar el flujo real.

Esto afecta a todo usuario que gestiona compras, autorizaciones, comparativos y
Ordenes de Compra.

### 2.2 KPIs de remediacion

| Metrica | Baseline observado | Target | Timeline | Verificacion |
|---|---:|---:|---|---|
| Operaciones por ID con validacion tenant | Parcial | 100% | Fase 1 | Tests negativos por tenant |
| Contratos publicos que retornan entidades EF | Varios | 0 | Fase 2 | Analisis de interfaces |
| DTOs de escritura con campos no editables | Presente | 0 campos sensibles | Fase 2 | Revision de payloads |
| Flujos criticos automatizados | Sin specs visibles | Cobertura de happy/sad/edge | Fase 5 | Tests CI |
| Rutas frontend legacy activas en el flujo | Presentes en constantes | 0 usadas | Fase 4 | Busqueda + compilacion |
| Operaciones archivo/BD con compensacion documentada | Parcial | 100% flujos compuestos | Fase 3 | Prueba de fallo inducido |

Los baselines son evidencia de codigo; deben complementarse con metricas de
produccion antes de cerrar el plan.

### 2.3 Matriz de reglas de negocio

#### Nivel 1 - Invariantes de dominio

- `RN-SC-001`: toda solicitud pertenece a un unico `CustomerId`.
- `RN-SC-002`: cada partida pertenece a una solicitud existente.
- `RN-SC-003`: una solicitud admite como maximo tres cotizaciones, con posiciones 1, 2 y 3.
- `RN-SC-004`: presupuestos no pueden duplicar `(SolicitudCompraId, AccountNumber, FiscalYear)`.
- `RN-SC-005`: archivos guardados en filesystem deben conservar referencia valida o eliminarse mediante compensacion.
- `RN-SC-006`: no puede existir mas de una solicitud con el mismo folio dentro del mismo `CustomerId`.

#### Nivel 2 - Flujo y estados

- `RN-SC-010`: una solicitud nueva inicia pendiente y recibe folio generado por backend.
- `RN-SC-011`: autorizacion requiere `AutorizadaPor`.
- `RN-SC-012`: denegacion requiere motivo.
- `RN-SC-013`: solicitud autorizada deja de participar en presentacion.
- `RN-SC-014`: solo solicitudes pendientes aparecen en presentacion.
- `RN-SC-015`: partidas se agregan despues de crear cabecera y se eliminan junto con sus precios.

#### Nivel 3 - Seguridad y autorizacion

- `RN-SC-020`: toda lectura o escritura por ID debe validar tenant antes de cargar o modificar datos.
- `RN-SC-021`: validacion de tenant debe propagarse a solicitud, partida, cotizacion, evidencia, presupuesto y orden relacionada.
- `RN-SC-022`: el backend no debe confiar en `CustomerId` enviado por frontend para autorizar acceso.
- `RN-SC-023`: roles permitidos para crear, editar, eliminar y autorizar deben quedar documentados y probados.
- `RN-SC-024`: toda accion sensible conserva auditoria de usuario, tenant, entidad y resultado.

#### Nivel 4 - Validacion de datos

- `RN-SC-030`: archivos PDF solo aceptan extension y contenido validado como PDF.
- `RN-SC-031`: evidencias aceptan solo tipos de imagen permitidos y limite de cuatro para solicitud.
- `RN-SC-032`: cantidad, precios, descuentos, IVA y montos presupuestales deben ser no negativos; monto presupuestal debe ser mayor que cero.
- `RN-SC-033`: folio, fecha, solicitante, area y justificacion deben validarse en backend, no solo en Angular.
- `RN-SC-034`: fecha de solicitud se serializa como `DateOnly` de forma consistente.

### 2.4 Pre-mortem y flujos criticos

| Supuesto fallido | Impacto | Mitigacion |
|---|---|---|
| Se corrige solo endpoint principal | Fuga por cotizacion/evidencia/presupuesto | Matriz endpoint-entidad y tests por subservicio |
| Se cambia DTO sin inventario de consumidores | Front o integraciones dejan de guardar | Contrato versionado, busqueda de usos y smoke test |
| Falla entre archivo y BD | Archivos huerfanos o referencias rotas | Compensacion, idempotencia y prueba de fallo |
| Se autoriza solicitud de otro tenant | Incidente de seguridad | Query tenant-aware obligatoria y tests negativos |
| Se tipa frontend sin contrato estable | Refactor largo con regresiones | Tipar por boundary despues de estabilizar DTOs |

Happy path: crear cabecera -> generar folio -> agregar partidas -> agregar
cotizaciones -> editar precios -> agregar presupuesto/evidencias -> autorizar o
denegar -> presentar si aplica -> vincular Orden de Compra.

Sad path: ID de otro tenant, solicitud inexistente, archivo invalido, duplicado
presupuestal, cuarta evidencia, autorizacion sin autoridad, denegacion sin
motivo, fallo de IA o fallo de filesystem.

Edge path: seleccion autorizada para presentacion, lista de orden vacia,
reordenamiento con IDs de tenants distintos, reintento de upload, doble guardado
de precio y eliminacion parcial.

## 3. Objetivo

Dejar Solicitudes de Compra con aislamiento tenant verificable, contratos DTO
explicitos, flujos de archivos consistentes, estados coherentes entre front y
back, rutas vigentes unicas y pruebas automatizadas suficientes para evitar
regresiones.

## 4. Alcance

Incluye:

- servicios y endpoints de solicitudes, partidas, cotizaciones, comparativo, evidencias y presupuesto;
- entidades y relaciones `PurchaseRequests`, `PurchaseRequestItems`, `Quotes`, `QuoteItems`, `PurchaseRequestFiles`, `QuoteFiles` y `PurchaseRequestBudgets`;
- integracion con presentacion y Ordenes de Compra;
- constantes de endpoints, rutas y componentes Angular del feature;
- pruebas backend/frontend y documentacion local.

No incluye:

- reestructuracion de Ordenes de Compra;
- rediseño visual completo;
- cambio de reglas de negocio sin aprobacion del owner;
- migracion de tablas o datos sin plan separado y rollback probado.

## 5. Restricciones y controles

- No cambiar rutas publicas ni nombres serializados sin inventario de consumidores.
- No modificar DTOs shared, servicios base, enums o catalogos centrales sin analisis de impacto.
- No eliminar rutas legacy hasta confirmar que no existen consumidores externos.
- No confiar en guards Angular como control de seguridad.
- Toda operacion compuesta debe definir transaccion de BD y compensacion de filesystem.
- Cada fase termina con build, tests relevantes y evidencia registrada.
- El plan requiere aprobacion antes de ejecutar cambios de codigo o migraciones.

## 6. Fases de ejecucion

### Fase 1 - Aislamiento multi-tenant y autorizacion

Tareas:

- [ ] Crear helper/patron tenant-aware para cargar solicitud por `id + customerId`.
- [ ] Aplicar validacion a get individual, update, delete, upload, comparativo, presentacion, presupuesto y evidencias.
- [ ] Garantizar folio unico por `CustomerId` en generacion, validacion de servicio y bloqueo transaccional.
- [ ] Ejecutar reparacion administrativa de folios duplicados con respaldo y transaccion reversible.
- [ ] Validar que partida, cotizacion, evidencia y presupuesto pertenezcan a la solicitud indicada.
- [ ] Validar que reordenamiento solo acepte IDs del tenant y solicitudes presentables.
- [ ] Inventariar roles reales desde `ApplicationRole` y aplicar autorizacion backend por accion.
- [ ] Agregar logs de rechazo por tenant, usuario, endpoint y entidad.

Criterio de paso:

- Ningun endpoint por ID permite leer o modificar recurso de otro tenant.
- Tests negativos cubren cada subservicio.
- No se usa `CustomerId` del payload como fuente de autorizacion.
- La creacion concurrente no puede producir folios repetidos para un mismo cliente.

### Fase 2 - Contratos y validacion backend

Tareas:

- [ ] Crear DTOs de respuesta para solicitud, partida, cotizacion y comparativo.
- [ ] Separar DTOs de create/update; eliminar de escritura `CustomerId`, `Folio`, colecciones y campos calculados no editables.
- [ ] Revisar AutoMapper para impedir sobreescritura de tenant, folio, relaciones y estado protegido.
- [ ] Agregar validaciones backend para campos obligatorios, cantidades, precios, descuentos, IVA, fechas y archivos.
- [ ] Definir contrato de `ApiResponseDTO` usado por Angular.
- [ ] Documentar compatibilidad si algun consumidor externo requiere entidad actual.

Criterio de paso:

- Ninguna interfaz publica del modulo retorna entidades EF.
- Payloads de escritura contienen solo campos permitidos.
- Contratos JSON quedan documentados y consumidos por frontend sin `any` estructural.

### Fase 3 - Integridad archivo/BD y consistencia de estados

Tareas:

- [ ] Revisar `DeleteSolicitudComplete`, `DeleteProvider`, uploads y eliminacion de evidencias.
- [ ] Definir orden de operaciones, idempotencia y compensacion cuando falle filesystem o `SaveChangesAsync`.
- [ ] Eliminar o registrar correctamente archivo creado si falla persistencia.
- [ ] Validar extension, content type, tamano y nombre seguro de archivos.
- [ ] Hacer consistente la regla de presentacion: solo solicitudes pendientes pueden seleccionarse o cargarse; al autorizar o denegar, limpiar seleccion.
- [ ] Revisar reintentos de analisis IA y lectura de PDF local sin bloquear persistencia principal.

Criterio de paso:

- Cada flujo compuesto tiene estrategia escrita y prueba de fallo inducido.
- No quedan referencias BD a archivos inexistentes en escenarios probados.
- No quedan archivos huerfanos tras rollback o reintento controlado.

### Fase 4 - Alineacion frontend y documentacion

Tareas:

- [ ] Crear interfaces Angular para listado, detalle, partida, cotizacion, comparativo, presupuesto y presentacion.
- [ ] Eliminar `any` de estado, respuestas, payloads y mapeos del feature.
- [ ] Sustituir constantes `purchaserequest/*` no usadas por endpoints vigentes o retirarlas con evidencia de consumidores.
- [ ] Alinear rutas Angular, constantes y documentacion con rutas activas.
- [ ] Revisar fecha `DateOnly`, `DateService` y serializacion del formulario.
- [ ] Actualizar README para `EndPoints/`, DTOs, tablas, flujo y contratos actuales.

Criterio de paso:

- `tsc --noEmit` sin errores.
- Flujo activo no depende de endpoints legacy.
- Documentacion describe codigo real y reglas RN-SC.

### Fase 5 - Pruebas y verificacion end-to-end

Backend:

- [ ] Crear pruebas de tenant isolation para cada grupo de endpoints.
- [ ] Probar create/update/delete de cabecera y partidas.
- [ ] Probar maximo de tres cotizaciones y posiciones.
- [ ] Probar autorizacion, denegacion y retorno a pendiente.
- [ ] Probar presupuesto duplicado, monto invalido y eliminacion tenant-aware.
- [ ] Probar evidencias, limite de cuatro, tipos invalidos y eliminacion.
- [ ] Probar uploads y compensacion de filesystem.

Frontend:

- [ ] Probar listado por estado y datos de ordenes relacionadas.
- [ ] Probar crear solicitud con partidas locales y persistencia posterior.
- [ ] Probar presentacion, seleccion, reordenamiento y exclusion de autorizadas.
- [ ] Probar comparativo, precios, autorizacion, presupuesto y evidencias.
- [ ] Probar PDF y navegacion a Orden de Compra.

Verificacion final:

- [ ] `dotnet build` de Application y Api.
- [ ] Suite backend del modulo.
- [ ] `npx tsc --noEmit -p tsconfig.json`.
- [ ] Suite frontend del modulo.
- [ ] Smoke manual de rutas: listado, detalle, PDF, comparativo y presentacion.
- [ ] Arranque limpio de API con DI completo.

Criterio de paso:

- Happy, sad y edge paths pasan.
- Cero hallazgos criticos o altos abiertos.
- Evidencia de pruebas queda vinculada al cierre de cada fase.

## 7. Dependencias e impactos

- Ordenes de Compra consume solicitudes por ID y folio; debe probarse vinculo y desvinculo.
- Comparativo depende de cotizaciones, partidas, archivos, presupuesto e IA.
- `ApplicationDbContext` y entidades son shared dentro de persistencia; cambios requieren analisis de migracion.
- Cambios DTO pueden afectar `ApiResponseService`, `FormHelper`, PDF, presentacion y componentes de Ordenes de Compra.
- Cambios de autorizacion pueden requerir actualizar visibilidad de botones, aunque la seguridad final vive en backend.

## 8. Plan de rollback

- Mantener contratos antiguos solo durante ventana de compatibilidad aprobada.
- Desplegar primero cambios de lectura y tests, despues escritura.
- Activar validaciones tenant-aware detras de feature flag si el mecanismo existe; si no, desplegar con rollback de version completo.
- No ejecutar migracion de datos sin backup, script reversible y prueba en staging.
- Ante fallo de archivo/BD, detener escrituras compuestas y ejecutar compensacion documentada.

## 9. Riesgos residuales

- Consumidores externos no identificados pueden depender de entidades o rutas legacy.
- Datos historicos pueden contener relaciones inconsistentes que los nuevos checks rechacen.
- Cambiar autorizacion puede revelar permisos mal definidos en otros modulos.
- Pruebas de filesystem y IA requieren dobles controlados para ser deterministas.

## 10. Cierre esperado

- Aislamiento por tenant probado en todos los subservicios.
- Contratos DTO explicitos y payloads minimizados.
- Flujo de estados y presentacion coherente entre frontend y backend.
- Operaciones archivo/BD con compensacion e idempotencia documentadas.
- Endpoints legacy eliminados o formalmente justificados.
- Cobertura automatizada de flujos criticos.
- README y matriz de reglas actualizados.
- Auditoria de cierre sin hallazgos criticos ni altos.

## 11. Aprobaciones requeridas

- [ ] Owner funcional valida reglas de estados, presentacion y autorizacion.
- [ ] Tech Lead aprueba cambios de contrato y aislamiento tenant.
- [ ] Responsable de seguridad valida matriz endpoint/rol/tenant.
- [ ] Responsable de datos aprueba cualquier cambio de indice, constraint o migracion.
- [ ] QA aprueba matriz de pruebas y smoke end-to-end.
