# Plan de Remediacion e Implementacion: HumanResourcesLuxuryApp / Evaluation

## 1. Metadata

- Tipo: ampliacion y remediacion de modulo existente.
- Backend: `api/LuxuryApp.Application/Modules/HumanResourcesLuxuryApp/Evaluation/`.
- Frontend: `appsweb/angular/src/app/modules/human-resources.luxuryapp/evaluation/`.
- Entidades existentes: `api/LuxuryApp.Application/Infrastructure/Data/Entities/HumanResourcesLuxuryApp/Evaluation/`.
- Dependencias externas: Recruitment, EmployeeFile, Legal EmployeeContracts, Shared SelectItem, Customer deletion.
- Documento origen: `20260922-auditoria-human-resources-evaluation.md`.
- Reglas funcionales: `20260923-business-rules-human-resources-evaluation.md`.
- Estado: aprobado para ejecucion por fases; Fase 1.1 en ejecucion.
- Regla: no implementar codigo ni migraciones antes de aprobar este plan.

## 2. Resumen Ejecutivo

Evaluation requiere pasar de listas de permisos hardcodeadas a una matriz administrable que determine quien puede crear plantillas, que alcance puede seleccionar y que roles pueden ser evaluados.

La matriz no reutilizara directamente `InterviewerMatrix`: esa entidad resuelve entrevistadores por customer y rol de puesto. Se reutilizara su patron de administracion, catalogo de roles y validacion, pero Evaluation tendra modelo, reglas, alcance, versionado y auditoria propios.

`SuperUsuario` y `Direccion` conservan acceso total como invariante del sistema.

## 3. Objetivo

Implementar un submodulo de evaluaciones seguro, multi-tenant, versionado y administrable por rol, con evaluaciones cerradas inmutables, historial preservado y consumidores externos compatibles.

## 4. Alcance

### Incluido

- Matriz administrable de autorizacion de plantillas.
- Plantillas globales y por customer.
- Roles aplicables por plantilla.
- Aplicacion de evaluaciones y frecuencia minima de 7 dias.
- Estados `Draft`, `Completed`, `Cancelled`.
- Cierre irreversible con confirmacion.
- Folio y version de plantilla.
- Snapshot historico de evaluaciones cerradas.
- Historial de empleado y exportacion PDF.
- RBAC, tenant isolation y auditoria.
- Migracion de consumidores externos.

### Fuera de alcance

- Crear nuevos roles en `ApplicationRoleEnum`.
- Modificar significado de `RoleType`.
- Reemplazar globalmente `InterviewerMatrix`.
- Crear un motor generico de permisos para todos los modulos.
- Cambiar reglas de otros modulos sin impacto documentado.

## 5. Restricciones y Reglas Aprobadas

- `SuperUsuario` y `Direccion` siempre tienen acceso total.
- Roles globales administradores: `RecursosHumanos`, `Legal`, `Reclutamiento`, `GerenteMantenimiento`, `SistemasGeneral`, `SupervisionOperativa`.
- Roles customer administradores: `Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `JefeMantenimiento`.
- Plantilla global puede aplicar a roles `RoleType.Corporate` y a estos Staff: `Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`, `Contador`, `Cobranza`, `JefeMantenimiento`.
- Plantilla customer solo aplica a Staff del mismo customer.
- Propiedad funcional depende del rol vigente, no del usuario creador.
- Evaluador se obtiene del usuario autenticado.
- Staff no se autoevalua.
- `Draft` no puede aplicarse a empleados.
- `Completed` no puede modificarse ni reabrirse.
- Minimo 7 dias entre evaluaciones aplicadas equivalentes.
- Plantilla usada se versiona o desactiva; no altera historial.
- Score entero 1-5; comentarios obligatorios; preguntas con igual peso.
- BD puede conservar precision decimal; UI muestra sin decimales.
- Historial respeta tenant y visibilidad por rol.
- Toda accion sensible se audita.

## 6. Arquitectura y Diseno Tecnico

### 6.1 Matriz de autorizacion

Crear un modelo especifico de Evaluation, sujeto a validacion de entidad antes de codificar:

```text
EvaluationTemplateAuthorizationMatrix
- Id
- AdministratorRole
- AllowedScopeType
- CanCreate
- CanEdit
- CanDeactivate
- CanDelete
- IsActive
```

```text
EvaluationTemplateAuthorizationTargetRole
- Id
- MatrixId
- TargetRoleType
- TargetRole
- IsActive
```

La matriz define permisos y opciones disponibles. No guarda una plantilla concreta.

Restricciones de matriz:

- solo `SuperUsuario` y `Direccion` administran la matriz;
- no puede otorgar acceso superior a `SuperUsuario`/`Direccion`;
- no puede permitir plantilla customer para Corporate;
- no puede permitir targets fuera del catalogo oficial;
- cambios quedan auditados.

### 6.2 Plantilla

La plantilla debe almacenar como minimo:

- folio estable;
- version;
- alcance global/customer;
- `CustomerId` nullable para global;
- rol propietario funcional;
- usuario creador para auditoria;
- estado activa/inactiva;
- roles aplicables seleccionados.

La autorizacion se resuelve por rol vigente. El usuario creador no es owner de seguridad.

### 6.3 Historial

Evaluacion cerrada debe conservar snapshot de folio, version, categorias y preguntas. Cambios posteriores de plantilla no pueden alterar resultados historicos.

### 6.4 Reutilizacion obligatoria

| Existente | Decision |
|---|---|
| `ApplicationRoleEnum` | Reutilizar; no modificar enum compartido. |
| `RoleType` | Reutilizar; filtrar `Corporate` y `Staff`. |
| Catalogo de roles DB | Reutilizar como fuente de opciones. |
| `InterviewerMatrix` | Reutilizar patron conceptual, no entidad ni semantica. |
| `EvaluationTemplate`, categorias, preguntas, respuestas | Extender solo tras verificar propiedades/relaciones y consumidores. |
| `ICurrentUserService`, autorizacion, auditoria y SelectItem | Reutilizar servicios oficiales. |

## 7. Fases y Checklist

### Fase 0. Reglas y reconocimiento

- [x] Auditoria punta a punta.
- [x] Consumidores externos identificados.
- [x] Roles superiores confirmados.
- [x] Reglas de plantilla, aplicabilidad, estados, frecuencia y visibilidad documentadas.
- [ ] Validar estructura completa de entidades y configuraciones EF.
- [ ] Aprobar este plan.

### Fase 1. Modelo de autorizacion

- [x] Diseñar entidad matriz y detalle.
- [x] Crear entidades de matriz y roles aplicables.
- [x] Registrar `DbSet` en `ApplicationDbContext`.
- [x] Generar migracion `20260923234445_AddEvaluationAuthorizationMatrix` sin ejecutarla.
- [x] Reutilizar `ApprovalScopeType` para alcance global/customer sin duplicar enum.
- [ ] Definir administradores de matriz.
- [ ] Definir indices unicos y constraints.
- [ ] Definir auditoria de cambios.
- [ ] Crear DTOs separados, un archivo por DTO.
- [x] Crear DTOs, servicio y endpoints bajo modulo correcto.
- [x] Proteger administracion de matriz con `EvaluationTemplateMatrixAdmin`.
- [x] Persistir alcance, rol propietario y roles aplicables al crear/editar plantillas.
- [x] Aplicar matriz dinamica a crear, editar y eliminar plantillas.
- [x] Bloquear edicion de evaluaciones `Completed` y `Cancelled`.
- [x] Aplicar frecuencia minima de 7 dias por empleado y plantilla.
- [x] Guardar version y snapshot JSON de plantilla al crear evaluacion.
- [x] Generar migracion `AddEvaluationSnapshot` sin ejecutarla.
- [x] Usar nombre y version del snapshot en resultados e historiales.
- [x] Agregar pruebas de snapshot y frecuencia minima.
- [x] Auditar script idempotente de migracion sin ejecutarlo.
- [x] Validar que empleado pertenezca a customer y rol aplicable de plantilla.

## Decision de permisos iniciales

- [x] Sembrar configuración inicial documentada solo cuando matriz está vacía.
- [x] Aplicar fail-closed para roles sin matriz.
- [x] Mantener bypass exclusivo para `SuperUsuario` y `Direccion`.
- [x] Habilitar crear/editar/desactivar; mantener eliminación física deshabilitada por defecto.
- [x] No sobrescribir configuración manual existente.

### Migracion de datos y prevencion de perdida

- Tabla modificada: `EvaluationTemplates`.
- Cambios: `CustomerId` pasa a nullable; agrega `Scope`, `Folio`, `Version`, `OwnerRoleId`.
- Tablas nuevas: `EvaluationTemplateAuthorizationMatrices`, `EvaluationTemplateAuthorizationTargetRoles`, `EvaluationTemplateApplicableRoles`.
- Backfill: folio `EV-XXXXXXXX` derivado de `Id`; plantillas existentes reciben alcance `SameCustomer` y version `1`.
- Riesgo: `OwnerRoleId` queda nullable para registros legacy hasta clasificar propietario funcional.
- Rollback: `Down` elimina tablas/columnas y restaura `CustomerId` no nullable; requiere backup y validacion previa.
- Ejecucion: aplicada por operador autorizado; conservar evidencia de backup y rollback.

### Fase 2. Modelo de plantillas y evaluaciones

- [ ] Extender plantilla con folio, version, alcance, owner role y estado.
- [ ] Modelar roles aplicables.
- [ ] Modelar snapshot historico.
- [ ] Implementar validacion de aplicabilidad.
- [ ] Implementar frecuencia minima de 7 dias.
- [ ] Implementar transiciones Draft/Completed/Cancelled.
- [ ] Proteger evaluaciones cerradas.

### Fase 3. Seguridad backend

- [ ] Aplicar politicas por operacion.
- [ ] Validar tenant desde contexto y relaciones, no desde confianza en DTO.
- [ ] Derivar evaluador desde usuario autenticado.
- [ ] Bloquear autoevaluacion.
- [ ] Validar rol actual del evaluador y empleado.
- [ ] Auditar acceso, cierre, cancelacion, PDF y rechazos.
- [ ] Probar `SuperUsuario` y `Direccion` con bypass total.

### Fase 4. Migracion y datos

- [ ] Inventariar registros actuales.
- [ ] Definir valores iniciales para folio, version, alcance y roles aplicables.
- [ ] Clasificar migracion reversible/irreversible.
- [ ] Crear backup y estrategia rollback.
- [ ] No eliminar historiales existentes.
- [ ] Verificar FK, cascades y Customer deletion.
- [ ] Ejecutar migracion en entorno controlado.

### Fase 5. API y consumidores

- [ ] Consolidar endpoint canonico.
- [ ] Migrar endpoint alterno de Recruitment.
- [ ] Actualizar EmployeeFile.
- [ ] Actualizar ContractRenewal.
- [ ] Actualizar Customer deletion.
- [ ] Actualizar SelectItems.
- [ ] Regenerar y validar Swagger.

### Fase 6. Frontend

- [ ] Crear administracion de matriz.
- [ ] Crear selector de alcance.
- [ ] Mostrar solo roles permitidos por matriz.
- [ ] Implementar versionado visible.
- [ ] Implementar modal de cierre irreversible.
- [ ] Implementar historial del empleado.
- [ ] Consolidar rutas duplicadas.
- [ ] Reemplazar `any` por interfaces.
- [ ] Aplicar `OnPush`, aliases y estados loading/error.
- [ ] Agregar specs y validacion desktop/mobile.

### Fase 7. Verificacion y documentacion

- [ ] Tests unitarios de matriz y reglas.
- [ ] Tests de integracion de tenant/RBAC.
- [ ] Tests de concurrencia y frecuencia.
- [ ] Tests de snapshot/versionado.
- [ ] Tests punta a punta.
- [ ] Completar README, documentacion tecnica y docs frontend.
- [ ] Ejecutar `node scripts/audit-conventions.mjs`.
- [ ] Ejecutar `node scripts/check-agent-rules.mjs`.
- [ ] Ejecutar scanner de encoding.
- [ ] Reauditar EVAL-001 a EVAL-013.

## 8. Criterios de Paso

- Ningun endpoint sensible queda con solo autenticacion general.
- Matriz rechaza combinaciones no autorizadas en backend aunque frontend sea manipulado.
- Plantilla global no acepta customer obligatorio ni targets invalidos.
- Plantilla customer no cruza customer ni acepta Corporate.
- `Draft` nunca aparece como evaluacion aplicable.
- `Completed` no puede actualizarse, reabrirse ni eliminarse.
- Historial permanece igual despues de modificar plantilla.
- Frecuencia menor a 7 dias es rechazada.
- SuperUsuario y Direccion mantienen acceso total.
- EmployeeFile y ContractRenewal conservan funcionamiento.
- Migracion tiene rollback documentado y no pierde historial.

## 9. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Matriz permite privilegios excesivos | Critico | Solo SuperUsuario/Direccion administran matriz; validacion server-side. |
| Cambio de plantilla altera historial | Critico | Snapshot por evaluacion cerrada y pruebas de versionado. |
| Cruce de tenant | Critico | Validacion por contexto, employee, template y customer. |
| Migracion rompe consumidores | Alto | Contratos compatibles, migracion por fases y pruebas externas. |
| Duplicidad de matrices | Alto | Indices unicos por rol, alcance, target y customer cuando aplique. |
| Borrado rompe contratos | Alto | Restrict, dependencia explicita y desactivacion. |
| Rol eliminado o inactivo | Medio | Resolver catalogo activo y conservar snapshot historico. |
| Reglas hardcodeadas sobreviven | Medio | Retirar listas duplicadas y usar matriz unica como fuente. |

## 10. Dependencias e Impactos

- Shared: `ApplicationRoleEnum`, `RoleType`, catalogo de roles, `ICurrentUserService`, auditoria y SelectItems.
- Recruitment: matriz actual de entrevistadores no se modifica sin analisis separado.
- EmployeeFile: consume resumen de evaluaciones.
- Legal EmployeeContracts: referencia evaluaciones de desempeño.
- Admin Customers: elimina datos del customer.
- Frontend routing: existen dos arboles de rutas.
- Base de datos: requiere migracion y verificacion de constraints/cascade.

## 11. Cierre Esperado

Plan cerrado cuando:

- reglas aprobadas estan implementadas en backend, frontend y persistencia;
- matriz administrable es unica fuente de autorizacion de plantillas;
- no existen permisos duplicados hardcodeados;
- historiales cerrados son inmutables y versionados;
- consumidores externos pasan pruebas;
- documentacion obligatoria esta actualizada;
- gates de convenciones pasan;
- reauditoria no reporta hallazgos criticos ni altos.
