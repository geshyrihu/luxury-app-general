# Catalogo de Instrucciones Iniciales para Agentes

> **Estado de autoridad:** documento historico de apoyo controlado.
> La autoridad vigente para solicitar trabajo a agentes vive en:
> - `CONVENTIONS.md`
> - `./core/workflow-por-tipo-de-tarea.md`
> - `./operations/agent-task-catalog.md`
> - `./operations/plan-creation-protocol.md`
> - `./operations/module-documentation-instructions.md`
> - `./operations/guides-creation-protocol.md`
> Este archivo conserva ejemplos historicos de solicitudes, pero no debe operar
> como fuente primaria aislada.

**Version:** 1.0  
**Fecha historica:** 2026-07-28  
**Estado:** Apoyo controlado

---

## Proposito

Preservar ejemplos historicos de como se pedian tareas a agentes de IA durante
la transicion del sistema documental.

El catalogo rector vigente ya vive en
`./operations/agent-task-catalog.md`.

---

## Tipos historicos de solicitud

### 1. Auditar un modulo

Usado para pedir:

- rutas exactas backend y frontend
- auditoria completa
- reporte clasificado por severidad
- plan de correccion por fases

### 2. Crear plan de implementacion

Usado para pedir:

- objetivo
- alcance
- restricciones
- salida estructurada en `docs/plans/`

### 3. Ejecutar remediacion

Usado para pedir:

- plan aprobado
- fases autorizadas
- restricciones
- ejecucion controlada

### 4. Documentar modulo

Usado para pedir:

- tipo de documento
- audiencia
- rutas de origen y destino
- resultado esperado bajo estructura oficial

### 5. Investigar problema

Usado para pedir:

- error exacto
- contexto
- ambiente
- salida con causa raiz y opcion de solucion o plan

### 6. Crear modulo nuevo

Usado para pedir:

- dominio master propuesto
- funcionalidad
- stacks involucrados
- propuesta de ubicacion y estructura oficial

---

## Reglas historicas que siguen siendo validas

- toda solicitud debe incluir accion, alcance, contexto, restricciones y salida
  esperada
- si la tarea implica auditoria, remediacion, migracion o documentacion, debe
  incluir rutas exactas
- si falta una regla del sistema, el agente no la inventa; la reporta y
  propone alta de regla
- remediacion grande no arranca sin plan aprobado
- migracion grande requiere plan de migracion antes de ejecutar

Estas reglas ya fueron absorbidas en
`./operations/agent-task-catalog.md`.

---

## Relacion con documentos vigentes

- `CONVENTIONS.md`
- `./core/workflow-por-tipo-de-tarea.md`
- `./operations/agent-task-catalog.md`
- `./operations/plan-creation-protocol.md`
- `./operations/module-documentation-instructions.md`
- `./operations/guides-creation-protocol.md`

---

## Nota Final

Este archivo se conserva como apoyo historico de ejemplos de solicitud. El
criterio vigente para pedir trabajo a agentes ya no vive aqui, sino en el
catalogo operativo rector.
