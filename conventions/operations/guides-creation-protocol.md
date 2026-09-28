# Guides Creation Protocol

**Ultima revision:** 2026-07-30

## Proposito

Definir el protocolo oficial para crear guias operativas reutilizables para
agentes, absorbiendo el criterio valido de `docs/guides/*` dentro del sistema
rector nuevo.

## Alcance

Aplica cuando se necesita una guia para:

- soporte de errores sensibles
- refactores delicados
- migraciones quirurgicas
- troubleshooting repetible
- intervenciones con limites estrictos

## Reglas obligatorias

- una guia solo se crea si el problema es repetible, sensible o reusable
- la guia debe delimitar claramente lo que el agente si puede y no puede hacer
- toda guia debe incluir patron de diagnostico, protocolo de intervencion,
  validaciones y senales de escala
- la guia no puede contradecir `CONVENTIONS.md` ni reglas especializadas del
  stack
- si ya existe una guia oficial del mismo problema, se actualiza antes de crear
  una duplicada

## Estructura minima obligatoria

Toda guia debe incluir como minimo:

1. encabezado y metadata
2. objetivo
3. contexto arquitectonico obligatorio
4. regla de oro
5. alcance permitido
6. alcance prohibido
7. zonas de alta sensibilidad
8. patron de diagnostico
9. protocolo de intervencion
10. patron tecnico recomendado
11. reglas por capa o por stack
12. validaciones obligatorias
13. senales de alto riesgo para escalar
14. checklist operativo
15. formato de entrega

## Ubicacion oficial

- `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-guia-[modulo]-[submodulo].md` (estructura plana, `CONVENTIONS.md` §6ter)
- el README del submodulo en `docs/[ModuleLuxuryApp]/[Submodulo]/` debe indexar la guia cuando quede vigente

## Prohibiciones

- no crear guias vagas tipo "buenas practicas generales"
- no crear guias que intenten sustituir a `CONVENTIONS.md`
- no omitir limites de actuacion
- no dejar ejemplos con rutas falsas o referencias obsoletas

## Ejemplo correcto

```md
# Guia de Soporte de Errores Residuales Post-Refactor

## Regla de Oro
Diagnosticar primero, corregir despues.

## Patron de Diagnostico
| Categoria | Sintoma | Solucion tipica |

## Senales de Alto Riesgo
- toca contabilidad
- cambia formulas
- rompe contratos compartidos
```

## Antipatrones

- guias sin checklist
- guias sin senales de escala
- guias que empujan al agente a tocar negocio sensible por intuicion
- guias que referencian numeracion vieja de `CONVENTIONS.md`

## Referencias relacionadas

- [Workflow por Tipo de Tarea](../core/workflow-por-tipo-de-tarea.md)
- [Agent Task Catalog](./agent-task-catalog.md)
- [../../docs/SharedLuxuryApp/Conventions/20260801-guia-shared-readme-indice.md](../../docs/SharedLuxuryApp/Conventions/20260801-guia-shared-readme-indice.md)
- [guide-agent-instructions.md](../guides/guide-agent-instructions.md)

## Impacto si se incumple

Los agentes intervienen sin limites claros, escalan tarde y pueden romper flujos
sensibles por no seguir un protocolo reutilizable y verificable.


