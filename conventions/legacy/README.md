# Legacy de Convenciones

**Ultima revision:** 2026-07-29
**Estado:** Transicion controlada

## Proposito

Esta carpeta existe para administrar la transicion entre el sistema historico de
convenciones y la nueva taxonomia documental sin borrar conocimiento antes de
validar que ya fue absorbido correctamente.

## Regla de transicion

- No borrar documentos historicos todavia.
- No asumir que un documento historico ya es prescindible solo porque existe un
  documento nuevo.
- Primero se valida que su contenido ya fue absorbido, referenciado o sustituido
  de forma segura.
- Solo despues de esa validacion el Tech Lead decide si se mueve a `legacy/` o
  si puede retirarse definitivamente.
- Mientras un documento siga en estado legacy o pre-legacy, no puede usarse como
  autoridad primaria si contradice o antecede al sistema rector vigente del
  `2026-07-29`.

## Estado actual

Por ahora los documentos candidatos a legacy **siguen en su ubicacion actual**
para no romper referencias vivas. Esta carpeta funciona como control de
transicion e inventario, no como basurero documental.

## Inventario inicial de candidatos

- `conventions/agent-audit-protocol.md`
- ~~`conventions/PROTOCOLO_COMPLIANCE_CONVENCIONES.md`~~ — no existe; ya absorbido en `conventions/core/compliance-protocol.md`
- `conventions/gobernanza-convenciones.md`
- `conventions/auditoria-por-rol.md`
- `conventions/roles-y-perfiles.md`
- ~~`conventions/TECH_LEAD_TRAINING.md`~~ — no existe; ya absorbido en `conventions/core/tech-lead-training.md`
- `conventions/tech-lead-onboarding-guide.md`
- `conventions/conventions-viewer-guide.md`
- `conventions/readme-plans.md`

## Criterios antes de mover un documento aqui

- Su contenido ya esta absorbido o reemplazado por documentos nuevos oficiales.
- Ya no es punto de entrada obligatorio del sistema rector.
- No rompe indices, links o flujos del `conventions-viewer`.
- El Tech Lead confirma que puede dejar de operar como documento primario.

## Siguiente paso recomendado

Validar documento por documento:

1. que reglas utiles contiene
2. en que documento nuevo quedaron absorbidas
3. si aun tiene referencias activas
4. si puede marcarse formalmente como `legacy`

## Revision inicial disponible

- [legacy-transition-matrix.md](./legacy-transition-matrix.md)
- [20260730-master-coverage-status.md](./20260730-master-coverage-status.md)
- [20260730-document-traceability-audit.md](./20260730-document-traceability-audit.md)



