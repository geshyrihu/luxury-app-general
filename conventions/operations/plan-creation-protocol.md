# Plan Creation Protocol

**Ultima revision:** 2026-07-30

## Proposito

Definir el protocolo oficial para crear planes dentro del sistema rector nuevo,
absorbiendo el criterio operativo valido del legacy sin depender de secciones
viejas de `CONVENTIONS.md`.

## Alcance

Aplica cuando un agente debe crear:

- plan de remediacion
- plan de implementacion
- plan de migracion
- plan de consolidacion
- plan tecnico de cambio mayor

## Reglas obligatorias

- no crear plan improvisado o con estructura libre
- todo plan debe derivar de una necesidad real, auditoria, iniciativa aprobada
  o instruccion explicita
- si el cambio es grande, sensible o transversal, el plan es obligatorio antes
  de ejecutar
- si existe un plan vigente del mismo tema, se actualiza antes de crear uno
  duplicado
- el plan debe indicar alcance, restricciones, fases, criterios de paso,
  riesgos y cierre esperado
- si el cambio afecta shared, contratos o migracion amplia, debe dejarlo
  explicitamente senalado

## Estructura minima obligatoria

Todo plan debe incluir como minimo:

1. metadata
2. resumen ejecutivo
3. objetivo
4. alcance
5. restricciones
6. fases
7. checklist por fase o por tarea
8. criterios de paso
9. riesgos
10. dependencias o impactos
11. cierre esperado

## Regla especial para planes nacidos de auditoria

- auditoria completa produce tambien plan por fases
- no existe modalidad valida de "solo auditar" y detenerse ahi cuando hay
  hallazgos relevantes
- el plan derivado de auditoria debe corresponder al reporte origen
- si el riesgo es alto, debe marcar si requiere plan de migracion

## FASE 0: Pre-Planeación Obligatoria

Antes de crear un plan formal (secciones 1-11), el agente DEBE completar FASE 0:

### 0.1 Problem Statement + KPIs

Formato disciplinado:
```
Actualmente, [ACTOR] sufre de [PROBLEMA] cuando intenta [ACCION],
lo que resulta en [CONSECUENCIA].
```

Incluir tabla de KPIs con baseline, target y timeline.

### 0.2 Matriz de Reglas de Negocio (4 Niveles Jerárquicos)

Toda regla debe estar numerada `RN-MOD-NNN` y clasificada en:

- **Nivel 1: Invariantes de Dominio** (restricciones inmutables)
- **Nivel 2: Flujo y Estados** (ciclo de vida, transiciones válidas)
- **Nivel 3: Seguridad/Autorización** (RBAC, protección de datos, auditoría)
- **Nivel 4: Validación de Datos** (formatos, límites, constraints)

Cada regla debe mapearse a componentes/servicios en la sección 3 del plan.

### 0.3 Riesgos + Pre-Mortem + Flujos

Ejecutar Pre-Mortem: "Asumimos que salió a producción y fue un desastre. ¿Qué lo causó?"

Documentar Happy/Sad/Edge paths que alimentarán los criterios de paso (sección 6).

### Salida de FASE 0 → Alimenta plan formal

- Problem Statement + KPIs → Sección 1 (Resumen Ejecutivo)
- Matriz de Reglas (Nivel 1-4) → Sección 3 (Arquitectura & Diseño Técnico)
- Pre-Mortem + Flujos → Sección 7 (Riesgos & Mitigaciones) + Sección 5 (Criterios de Paso)

**Tiempo estimado:** ~2 horas (Problem: 20 min, Reglas: 45 min, Pre-Mortem + Flujos: 45 min)

## Ubicacion oficial

Estructura plana obligatoria segun `CONVENTIONS.md` §6ter (vigente 2026-09-16).

- plan general: `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-plan-[modulo]-[submodulo].md`
- si es transversal (afecta varios modulos): usar modulo `SharedLuxuryApp` o `SystemLuxuryApp`
  segun dominio, con submodulo tematico, ej:
  `docs/SharedLuxuryApp/FechasHoras/YYYYMMDD-plan-shared-fechas-horas.md`
- para remediacion por modulo:
  - `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-remediacion-[modulo]-[submodulo].md`

Cero subcarpetas adicionales dentro del submodulo; el tipo va en el nombre del archivo.

## Prohibiciones

- no usar referencias a secciones numeradas viejas de `CONVENTIONS.md`
- no crear planes con placeholders vacios
- no omitir fases, checklist o criterios de paso en cambios sensibles
- no crear dos planes paralelos para el mismo tema sin justificacion aprobada

## Ejemplo correcto

```md
# Plan de Remediacion - Banks

## Resumen Ejecutivo
## Fase 0. Criterios de control
## Fase 1. Contratos
## Fase 2. DTOs
## Riesgos
## Cierre esperado
```

## Antipatrones

- plan sin riesgos
- plan sin criterios de paso
- plan sin alcance y restricciones
- plan dependiente de numeracion legacy de `CONVENTIONS.md`
- plan creado sin relacionarlo con auditoria o necesidad origen

## Referencias relacionadas

- [FASE 0: Business Rules Discovery](./business-rules-discovery-phase-0.md) ← **Lectura obligatoria antes de iniciar plan**
- [Plan Agent Instructions](./plan-agent-instructions.md)
- [Workflow por Tipo de Tarea](../core/workflow-por-tipo-de-tarea.md)
- [Agent Task Catalog](./agent-task-catalog.md)
- [Implementation Checklist](./implementation-checklist.md)
- [Application Roles Catalog](./application-roles-catalog.md)
- [Data Migration Protocol](./data-migration-protocol.md)

## Impacto si se incumple

Se generan planes incompletos, contradictorios o no ejecutables, lo que rompe
la trazabilidad entre auditoria, aprobacion y remediacion.


