# Reglas de Negocio: HumanResourcesLuxuryApp / Evaluation

Fecha: 2026-09-23
Estado: Fase 0 definida; pendiente validacion funcional final.

## 1. Roles Superiores

`SuperUsuario` y `Direccion` tienen acceso total al submodulo, sin restriccion de customer, incluyendo plantillas, evaluaciones, historiales, PDF y auditoria.

## 2. Plantillas

### 2.1 Plantilla global

- Puede ser administrada por `RecursosHumanos`, `Legal`, `Reclutamiento`, `GerenteMantenimiento`, `SistemasGeneral` y `SupervisionOperativa`.
- `SuperUsuario` y `Direccion` siempre pueden administrarla.
- Es visible para todos los customers.
- Tiene listado explicito de roles aplicables.
- Puede aplicar a roles `RoleType.Corporate`.
- Puede aplicar unicamente a estos roles `RoleType.Staff`:
  - `Administrador`
  - `GerenteOperaciones`
  - `GerenteAtencion`
  - `Asistente`
  - `Contador`
  - `Cobranza`
  - `JefeMantenimiento`
- El administrador selecciona roles aplicables dentro de ese universo permitido.

### 2.2 Plantilla por customer

- Puede ser administrada por `Administrador`, `GerenteOperaciones`, `GerenteAtencion` y `JefeMantenimiento`.
- Pertenece a un unico customer.
- Solo es visible dentro de su customer.
- Solo aplica a empleados del mismo customer.
- Solo puede aplicar a roles `RoleType.Staff`.
- Su listado de roles aplicables usa el mismo conjunto Staff autorizado de la plantilla global.

### 2.3 Propiedad

- Propiedad funcional depende del rol, no del usuario que creo la plantilla.
- Un usuario que pierde el rol pierde capacidad de administracion.
- Otro usuario que obtiene el mismo rol adquiere esa capacidad.
- `CreatedByUserId` se conserva solo como dato de auditoria.

## 3. Evaluadores y evaluados

### 3.1 Roles que pueden aplicar

- `Legal`
- `RecursosHumanos`
- `Reclutamiento`
- `GerenteMantenimiento`
- `SistemasGeneral`
- `SupervisionOperativa`
- `Administrador`
- `GerenteOperaciones`
- `GerenteAtencion`

### 3.2 Alcance por tipo de rol del evaluador

- Evaluadores `RoleType.Corporate` pueden evaluar:
  - cualquier rol `RoleType.Corporate`;
  - los roles Staff autorizados de la seccion 2.
- Evaluadores Staff (`Administrador`, `GerenteOperaciones`, `GerenteAtencion`) solo pueden evaluar los roles Staff autorizados.
- No se permite autoevaluacion.
- El evaluador se determina desde usuario autenticado y rol vigente.
- La autorizacion no depende de la identidad historica del usuario que creo la plantilla.

## 4. Estados

Estados iniciales:

- `Draft`: evaluacion en edicion.
- `Completed`: evaluacion finalizada y cerrada.
- `Cancelled`: evaluacion cancelada, si aplica al flujo operativo.

Transiciones validas:

```text
Draft -> Completed
Draft -> Cancelled
Completed -> ninguna
Cancelled -> ninguna
```

- `Draft` no es visible como evaluacion aplicada.
- `Draft` no puede ser usada como historial final.
- Una plantilla/evaluacion en `Draft` no puede aplicarse a ningun empleado.
- `Completed` nunca se modifica ni reabre.

## 5. Finalizacion

- Usuario presiona `Finalizar evaluacion`.
- Sistema valida respuestas completas y comentarios obligatorios.
- Se muestra modal: "Una vez cerrada, la evaluacion no podra modificarse".
- Solo despues de confirmar se calcula y persiste resultado.
- Cancelar modal conserva estado `Draft`.

## 6. Evaluaciones repetidas

- Se permite aplicar misma plantilla al mismo empleado nuevamente.
- Deben transcurrir al menos 7 dias entre evaluaciones aplicadas.
- La restriccion considera empleado, plantilla, customer y `EvaluationDate`.
- Evaluaciones `Cancelled` no cuentan para la frecuencia.
- Una evaluacion `Draft` debe bloquear un nuevo intento equivalente hasta finalizarse o cancelarse.

## 7. Plantillas y versionado

- Las plantillas pueden modificarse.
- Cada cambio estructural incrementa version.
- Folio estable y version incremental, ejemplo `EV-0001-V1`, `EV-0001-V2`.
- Evaluacion `Completed` conserva snapshot de folio, version, categorias y preguntas.
- Cambiar plantilla no cambia historial cerrado.

## 8. Eliminacion

- `Draft` puede eliminarse si no tiene aplicaciones relacionadas.
- Si tiene relaciones, se desactiva/cancela; no se elimina fisicamente.
- `Completed` no puede eliminarse.
- Plantilla usada por evaluaciones se desactiva, no se elimina.
- Plantilla sin aplicaciones puede eliminarse segun permiso.
- Evaluacion vinculada a contrato no puede eliminarse.

## 9. Calificacion

- Escala entera de 1 a 5.
- No se permiten decimales.
- Todas las preguntas tienen el mismo peso.
- Comentario obligatorio por pregunta.
- Se calcula promedio por categoria.
- Se calcula promedio general.
- La base de datos puede conservar precision decimal.
- La interfaz muestra el resultado redondeado sin decimales.
- No se permite cerrar con respuestas faltantes.

## 10. Visibilidad

- `RoleType.Corporate` puede consultar evaluaciones de todos los customers.
- `RoleType.Staff` solo puede consultar evaluaciones de su customer.
- El empleado puede consultar sus propias evaluaciones permitidas.
- El evaluador puede consultar evaluaciones anteriores dentro de su alcance autorizado.
- `Legal` puede consultar todas las evaluaciones.
- Las mismas reglas aplican al historial del expediente del empleado.
- Se permite exportar resultados a PDF.

## 11. Auditoria

Auditar siempre:

- creacion;
- edicion de plantilla;
- cambio de version;
- aplicacion;
- finalizacion;
- cancelacion;
- intento de modificar evaluacion cerrada;
- intento de eliminacion;
- consulta de resultado;
- exportacion PDF;
- cambio de rol;
- cambio de customer;
- rechazo por frecuencia;
- rechazo por permisos.

Cada evento conserva usuario, rol, customer, fecha y motivo cuando corresponda.

## 12. Estado Fase 0

Reglas funcionales proporcionadas quedan definidas. No hay pendientes de negocio abiertos en esta fase.
