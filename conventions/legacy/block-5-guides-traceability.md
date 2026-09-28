# Trazabilidad Block 5 - Guides y Plantillas Operativas

**Fecha:** 2026-07-30
**Estado:** absorbido con trazabilidad activa

## Objetivo

Registrar la alineacion de `docs/guides/*` con el sistema rector nuevo para que
las guias no vuelvan a citar secciones viejas ni a competir con las
convenciones oficiales.

## Matriz de absorcion

| Documento | Estado | Destino oficial principal | Nota |
|---|---|---|---|
| `docs/guides/README.md` | alineado a taxonomia nueva | `conventions/operations/guides-creation-protocol.md` + `CONVENTIONS.md` | ya opera como indice subordinado y no como autoridad paralela |
| `docs/guides/guide-agent-instructions.md` | absorbido parcialmente como plantilla de apoyo | `conventions/operations/guides-creation-protocol.md` | conserva valor como plantilla extensa y ejemplo operativo |
| `docs/guides/20260715-guia-agente-soporte-errores-refactor.md` | vigente como guia concreta | `conventions/operations/guides-creation-protocol.md` | permanece como guia activa de caso especifico, no como regla rectora |

## Resultado

- las guias ya apuntan al protocolo oficial vigente
- se evita volver a depender de numeracion vieja de `CONVENTIONS.md`
- el directorio `docs/guides` queda subordinado a la estructura nueva y no
  compite con ella
