# Guias Operativas LuxuryApp

**Ultima revision:** 2026-07-30
**Deriva de:** [CONVENTIONS.md](../../CONVENTIONS.md)

## Proposito

Este directorio contiene guias operativas para intervenciones sensibles y
repetibles. No reemplaza a `CONVENTIONS.md`, a las auditorias ni a los planes:
funciona como capa de apoyo para protocolos quirurgicos reutilizables.

## Regla base

Toda guia creada o actualizada aqui debe seguir:

1. [CONVENTIONS.md](../../CONVENTIONS.md)
2. [guides-creation-protocol.md](../../conventions/operations/guides-creation-protocol.md)
3. [GUIDE_AGENT_INSTRUCTIONS.md](./GUIDE_AGENT_INSTRUCTIONS.md)

## Cuando crear una guia

- cuando el problema es recurrente
- cuando la intervencion es delicada y de alto riesgo si se hace mal
- cuando el diagnostico requiere metodo y limites claros
- cuando la misma necesidad puede repetirse para varios agentes o modulos

## Guias disponibles

### Activas

- [../../../docs/SharedLuxuryApp/Conventions/20260715-guia-agente-soporte-errores-refactor.md](./../../../docs/SharedLuxuryApp/Conventions/20260715-guia-agente-soporte-errores-refactor.md)
  - soporte de errores residuales posteriores a refactores de rutas y contratos
- [../../../docs/SharedLuxuryApp/Conventions/20260804-guia-flujo-centralizado-imagenes-frontend.md](./../../../docs/SharedLuxuryApp/Conventions/20260804-guia-flujo-centralizado-imagenes-frontend.md)
  - arquitectura operativa del procesamiento centralizado de imagenes, conversion HEIC/HEIF y garantia global sobre `FormData`
- [../../../docs/SharedLuxuryApp/Conventions/20260801-guia-shared-implementacion-refactorizacion.md](./../../../docs/SharedLuxuryApp/Conventions/20260801-guia-shared-implementacion-refactorizacion.md)
  - protocolo de entrevista de modelo de negocio guiada por el agente antes de programar o refactorizar (idea o proyecto actual con comentarios del dueño del producto no experto en programacion)

### En desarrollo

- se agregaran nuevas guias segun necesidades operativas y aprobacion del
  sistema rector

## Diferencia entre tipos de documento

| Tipo | Proposito | Salida esperada |
|---|---|---|
| Guide | intervenir quirurgicamente sin romper | correccion acotada + reporte |
| Plan | ordenar ejecucion por fases | plan aprobable y ejecutable |
| Audit | inspeccionar modulo completo | reporte de hallazgos + plan |
| Module Doc | documentar modulo | README o documentacion tecnica |

## Checklist para crear o actualizar una guia

- [ ] el problema es realmente repetible o sensible
- [ ] se leyo el protocolo oficial de guias
- [ ] la guia delimita alcance permitido y prohibido
- [ ] incluye patron de diagnostico
- [ ] incluye protocolo de intervencion
- [ ] incluye validaciones obligatorias
- [ ] incluye seÃ±ales de alto riesgo para escalar
- [ ] si ya existia una guia oficial, se actualizo en lugar de duplicarla
- [ ] el archivo quedo indexado en este `README.md`

## Referencias

- [guides-creation-protocol.md](../../conventions/operations/guides-creation-protocol.md)
- [GUIDE_AGENT_INSTRUCTIONS.md](./GUIDE_AGENT_INSTRUCTIONS.md)
- [PLAN_AGENT_INSTRUCTIONS.md](../../conventions/operations/plan-agent-instructions.md)
- [module-documentation-instructions.md](../../conventions/operations/module-documentation-instructions.md)


