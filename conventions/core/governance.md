# Governance del Sistema de Convenciones

**Ultima revision:** 2026-07-30

## Aprobacion

- Solo el Tech Lead aprueba reglas nuevas o cambios de reglas.

## Responsabilidades

### Tech Lead

- Aprueba nuevas reglas.
- Aprueba cambios a reglas existentes.
- Aprueba planes de migracion cuando una regla nueva impacta codigo viejo.
- Valida cierre de consistencia documental y visual.

### Agentes

- Detectan vacios, contradicciones y desorden.
- Proponen reglas nuevas o ajustes.
- No crean reglas paralelas por su cuenta.
- No asumen reglas inexistentes.
- Actualizan documentos relacionados solo despues de aprobacion.
- No pueden usar documentos legacy como fuente normativa primaria cuando exista
  sistema rector vigente posterior al `2026-07-29`.
- Si detectan una referencia vieja, primero deben revalidarla contra
  `CONVENTIONS.md` y `conventions/*` antes de producir hallazgos o planes.
- Si la tarea exige control formal, deben seguir el ciclo de
  `core/compliance-protocol.md`.

## Auditoria del sistema

Modalidad mixta:

- cuando cambian reglas
- y tambien en revisiones generales periodicas

Se revisa:

- links rotos
- documentos duplicados
- contradicciones
- reglas huerfanas
- viewer desactualizado
- cobertura real de migracion desde legacy hacia documentos oficiales
