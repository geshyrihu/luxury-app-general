# Agent Task Catalog

**Ultima revision:** 2026-07-29
**Deriva de:** [CONVENTIONS.md](../CONVENTIONS.md)

## Proposito

Estandarizar como se solicita trabajo a cualquier agente del proyecto para que
la entrada, el alcance y la salida esperada sigan el mismo criterio.

## Regla obligatoria

- toda solicitud a un agente debe indicar accion, modulo o alcance, contexto,
  restricciones y resultado esperado
- si la solicitud implica auditoria, remediacion, migracion o documentacion,
  debe incluir rutas exactas
- si falta una regla del sistema, el agente no la inventa: la reporta y propone
  alta de regla

## Plantilla universal

```md
[ACCION] [MODULO O ALCANCE]
Descripcion: [que se necesita en 1 o 2 frases]
Contexto: [por que, quien lo usa, impacto]
Scope: [que incluye / que no incluye]
Rutas: [backend, frontend, flutter, docs]
Restricciones: [no tocar shared, no romper contratos, etc.]
Resultado esperado: [plan, auditoria, documentacion, implementacion]
```

## Casos de uso estandar

### 1. Auditar modulo

Usar cuando se necesita diagnostico completo, no remediacion inmediata.

```md
AUDITAR [MODULO]
Descripcion: auditoria completa del modulo
Rutas:
- Backend: [ruta exacta]
- Frontend: [ruta exacta]
Resultado esperado:
- reporte clasificado por severidad
- plan de correccion por fases
- checklist por tarea
```

Salida obligatoria:

- reporte de hallazgos
- clasificacion por severidad
- plan por fases
- checklist ejecutable
- decision de si requiere plan de migracion

Reglas especiales:

- auditoria siempre es completa
- no se cierra una auditoria oficial sin plan cuando hay hallazgos relevantes
- no se ofrecen modalidades `rapida`, `quick`, `light` o equivalentes como
  cierre oficial

### 2. Crear plan

Usar antes de remediaciones grandes, migraciones o implementaciones nuevas.

```md
CREAR PLAN [MODULO O TEMA]
Objetivo: [descripcion breve]
Scope:
- Incluye: [...]
- Excluye: [...]
Restricciones: [contratos sensibles, shared, servicios, UI]
Resultado esperado: plan por fases con checklist y criterios de aprobacion
```

Reglas especiales:

- si el plan deriva de auditoria, debe corresponder al reporte origen
- no crear planes duplicados del mismo tema si ya existe uno vigente
- el plan debe respetar el protocolo oficial de planes del sistema nuevo

### 3. Ejecutar remediacion

Solo procede cuando ya existe plan aprobado.

```md
EJECUTAR REMEDIACION [MODULO]
Plan aprobado: [ruta exacta]
Fases autorizadas: [lista]
Restricciones: [no tocar shared, no reubicar existente, etc.]
Resultado esperado: ejecucion controlada + estatus actualizado
```

### 4. Documentar modulo

```md
DOCUMENTAR [MODULO]
Tipo: [tecnica | operativa | README | auditoria]
Audiencia: [dev | tech lead | ops | negocio]
Rutas: [modulo y destino documental]
Resultado esperado: documento bajo la estructura oficial
```

### 5. Investigar problema

```md
INVESTIGAR [PROBLEMA] EN [MODULO]
Error exacto: [mensaje]
Contexto: [cuando ocurre]
Ambiente: [dev | staging | prod]
Resultado esperado: causa raiz + opciones + fix propuesto o plan
```

### 6. Crear modulo nuevo

```md
CREAR MODULO [NOMBRE]
Dominio master propuesto: [AdminLuxuryApp | otro]
Funcionalidad: [descripcion]
Stacks: [backend | frontend | flutter]
Resultado esperado: propuesta de ubicacion + plan + estructura oficial
```

## Reglas especiales por tipo de solicitud

- auditoria siempre es completa
- remediacion nunca arranca sin plan aprobado
- migracion grande requiere plan de migracion antes de ejecutar
- cambios a shared, contratos, DTOs, interfaces o servicios comunes requieren
  analisis previo y aprobacion
- si la solicitud implica nuevo patron, nuevo componente o nueva regla, se
  propone primero y se registra solo tras aprobacion

## Referencias

- [Workflow por Tipo de Tarea](../core//workflow-por-tipo-de-tarea.md)
- [Implementation Checklist](../operations//implementation-checklist.md)
- [Module Documentation Instructions](../operations//module-documentation-instructions.md)
- [Plan Creation Protocol](../operations//plan-creation-protocol.md)
- [Guides Creation Protocol](../operations//guides-creation-protocol.md)
- [Legacy Transition Matrix](../legacy/legacy-transition-matrix.md)



