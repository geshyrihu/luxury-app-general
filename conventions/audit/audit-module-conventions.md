# Audit Module Conventions

**Ultima revision:** 2026-09-30 (item "seguridad y permisos" enlaza security-audit-checklist.md; tabla de clasificacion des-duplicada, fuente unica audit-severity-model.md). Anterior 2026-07-30.

## Regla base

Solo existe una modalidad: **auditoria completa**.

## Flujo obligatorio

1. auditar
2. reportar y clasificar
3. crear plan por fases con checklist por tarea
4. revisar y aprobar
5. posible ejecucion posterior

## Regla operativa para agentes

- si se solicita auditar un modulo, el agente no debe detenerse en un analisis
  informal o parcial
- la salida minima obligatoria es:
  - reporte de auditoria
  - clasificacion de hallazgos
  - plan por fases
  - checklist ejecutable
- no existe modalidad valida de "auditoria rapida" o "quick check" como cierre
  oficial del trabajo
- si el modulo es pequeno, igual aplica auditoria completa; solo cambia el
  tiempo real de ejecucion, no el estandar
- el agente no debe ofrecer bifurcaciones que contradigan el sistema rector,
  por ejemplo separar una auditoria que debe salir unificada o detenerse antes
  del plan cuando ya detecto hallazgos materiales

## Obligatorio en la auditoria

- arquitectura
- estructura de carpetas y archivos
- naming
- contratos y DTOs
- servicios genericos
- logica de negocio
- acceso a datos o API
- seguridad y permisos — usar [security-audit-checklist.md](./security-audit-checklist.md) (aislamiento
  por `Customer`, control de acceso, inyeccion, veredicto confirmado/necesita
  validacion/rechazado)
- UI y styles
- mobile si aplica
- performance
- testing
- logging
- documentacion
- deuda tecnica y riesgos

## Cobertura estructural obligatoria

- la auditoria no puede limitarse a la carpeta raiz del modulo cuando existan
  subservicios, submodulos o dominios internos como `Detalle/`,
  `CotizacionProveedor/` u otros equivalentes
- si el modulo distribuye logica, DTOs, interfaces o endpoints en carpetas
  internas, el auditor debe cubrirlas y reflejarlo en el alcance
- si el auditor no revisa esos sub-bloques, el modulo no debe darse por
  auditado completamente

## Validacion funcional minima obligatoria

La auditoria completa no puede quedarse solo en estructura, naming o lectura de
codigo. Debe validar tambien los flujos funcionales minimos del modulo cuando
apliquen.

### En CRUD frontend/backend se debe comprobar como minimo

- abrir alta
- abrir edicion
- cargar datos de edicion
- hidratar correctamente el formulario
- enviar create
- enviar update
- eliminar
- refresco o actualizacion de listado
- si el modulo tiene wizard o multi-step, validar avance, retroceso, preservacion
  de estado, bloqueo por paso y construccion final del payload

### En formularios con selects, autocomplete o adapters UI se debe comprobar

- que el `onLoadData` soporte `null`, respuestas vacias y shape real del API
- que los IDs necesarios para editar se extraigan correctamente aunque el valor
  venga directo o envuelto
- que el typing y la nulabilidad declarada en interfaces coincidan con el uso
  real del codigo y no existan accesos que asuman valores no nulos sin respaldo
- que `patchValue` use el shape correcto para controles simples y para controles
  de seleccion
- que autocomplete, select y wrappers `@ui/*` muestren el valor cargado en modo
  edicion y no solo lo conserven en memoria
- que si el catalogo cargado no contiene el valor actual del registro, el
  modulo no falle y el hallazgo quede reportado
- que el auditor valide si el wrapper usa valor primitivo u objeto completo y
  que el `FormControl` coincida con esa expectativa real
- que el auditor marque hallazgo si un autocomplete editable mezcla `ngModel`
  manual con `FormControl` y eso impide que `patchValue` renderice el
  seleccionado
- que el auditor confirme de donde sale el `label` visible del valor editado:
  catalogo, DTO de edicion o fallback controlado
- que el auditor detecte si existen controles requeridos o estado critico fuera
  del `FormGroup` principal y como se valida su obligatoriedad real
- que el auditor revise modulos con doble entrada por ruta/modal cuando comparten
  estado en servicios locales o globales

### En estados de carga, render y errores se debe comprobar

- que `loading`, `submitting` y estados equivalentes cierren correctamente tanto
  en success como en error
- que la vista renderice exactamente los campos definidos en el contrato tipado
  y no dependa de nombres legacy o aliases no documentados
- que la auditoria reporte cualquier dependencia a shapes legacy no declarados
  por el contrato vigente
- que en modulos con archivos, PDFs o XML se valide el flujo completo de carga,
  actualizacion, eliminacion y consumo derivado
- que la auditoria de UI y styles no revise solo `appsweb/angular/src/styles`,
  sino tambien estilos locales de componentes, `styleUrl`, `styles: []` y uso
  de `::ng-deep` dentro del feature

### En contratos backend/frontend se debe comprobar

- que el DTO o response real expuesto por backend coincida con lo que el front
  espera para `onLoadData`, listados y submit
- que no exista drift entre nombres como `posicionComite` vs
  `ePosicionComite`, o cualquier otra propiedad equivalente
- que la auditoria marque hallazgo si el formulario depende de suposiciones
  fragiles sobre el shape de la respuesta
- que la auditoria marque incumplimiento si un endpoint sensible retorna
  `object`, listas anonimas o entidad de persistencia directa sin DTO explicito
- que esta validacion cubra tambien subservicios o endpoints internos del mismo
  modulo, no solo el servicio principal
- que la auditoria marque incumplimiento si una interfaz o servicio de
  aplicacion devuelve tipos HTTP/MVC como `ActionResult`, `IResult` o
  equivalentes dentro de la capa de negocio
- que la auditoria revise integridad transaccional o estrategia de compensacion
  cuando una sola accion de negocio persiste multiples entidades o archivos

### En reglas de negocio e invariantes funcionales se debe comprobar

- que el auditor identifique primero las reglas criticas del modulo antes de
  dictaminarlo
- que el reporte enumere explicitamente unicidades, no duplicidades,
  solapamientos prohibidos, transiciones invalidas, acciones no repetibles e
  invariantes financieras u operativas del flujo
- que el auditor revise si cada regla critica vive solo en UI, solo en backend
  o tambien en persistencia, y marque hallazgo cuando la defensa sea parcial
- que se auditen escenarios negativos y no solo el caso feliz:
  duplicado exacto, duplicado parcial, solapamiento de fechas, doble submit,
  reintento, carrera de concurrencia y edicion que rompe una regla valida en
  create
- que el auditor marque hallazgo si una regla critica solo se valida de forma
  visual pero no transaccional
- que el auditor marque hallazgo si falta `unique constraint`, `check
  constraint`, control de concurrencia o validacion de backend cuando la regla
  del dominio lo requiere
- que el auditor marque hallazgo si la regla existe en create pero no en edit,
  approve, cancel, reopen, close o cualquier otro flujo equivalente
- que el auditor pregunte explicitamente que puede repetirse, duplicarse,
  cruzarse o solaparse indebidamente en el modulo y deje evidencia de la
  respuesta

### Salida minima adicional para auditorias con reglas de negocio relevantes

- reglas criticas detectadas
- casos negativos auditados
- huecos de validacion por capa
- riesgos de duplicidad, solapamiento o repeticion indebida

### En documentacion del modulo se debe comprobar

- que el README o documento local describa la arquitectura vigente y no una capa
  legacy distinta como `Controller/` cuando el modulo opera con `EndPoints/`
- que las rutas publicadas en la documentacion coincidan con las rutas reales
  expuestas por backend
- que si la documentacion local sigue en modelo legacy, el auditor lo clasifique
  como hallazgo y no la use como fuente normativa primaria

## Clasificacion obligatoria de hallazgos

Ver [audit-severity-model.md](./audit-severity-model.md) (fuente unica; no duplicar la tabla aqui):

- incumplimiento critico
- incumplimiento alto
- deuda tecnica
- mejora recomendada
- riesgo de ruptura por shared o contrato

Un hallazgo de seguridad pasa primero por el veredicto confirmado / necesita
validacion / rechazado de `audit-severity-model.md` antes de mapear a esta
tabla; ver [security-audit-checklist.md](./security-audit-checklist.md).

## Salida minima obligatoria

- resumen ejecutivo
- alcance
- hallazgos
- evidencia
- impacto
- riesgo
- recomendacion
- plan por fases
- checklist por tarea
- estatus por hallazgo

## Ubicacion oficial de salida

- reporte:
  - `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo].md`
- plan:
  - `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-remediacion-[modulo]-[submodulo].md`

Estructura plana obligatoria por submodulo, segun `CONVENTIONS.md` §6ter (vigente 2026-09-16):
cero subcarpetas adicionales dentro de `docs/[Modulo]/[Submodulo]/`;
el tipo de documento va en el nombre del archivo.

## Resultado formal cuando hay alto riesgo

- `requiere plan de migracion`

## Regla critica

No se remedia durante la auditoria.

## Regla de cierre de auditoria

Un modulo no debe darse por auditado correctamente si no se verifico el flujo
real de edicion cuando exista formulario editable. Revisar solo codigo,
contratos o templates sin validar la hidratacion del formulario se considera
auditoria incompleta.

## Fuentes detalladas a preservar

- [audit-layers-checklist.md](../audit-layers-checklist.md)
- [agent-audit-protocol.md](../agent-audit-protocol.md)


