# Precedencia Documental

**Ultima revision:** 2026-07-31

## Orden oficial

1. `CONVENTIONS.md`
2. `conventions/core/*`
3. Documentos especializados por dominio en `conventions/`
   - Incluye `audit/`, `backend/`, `frontend/`, `operations/`, etc.
   - `conventions/operations/audit-agent-instructions.md` es **apoyo operativo nivel 3**
     para ejecutar auditorias. No crea reglas nuevas. Si contradice `conventions/audit/*`,
     gana el dominio `audit/`.
4. Documentacion de reportes y apoyo en `docs/` siguiendo estructura plana
   `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-[tipo]-[modulo]-[submodulo].md`
   definida en `CONVENTIONS.md` §6ter; mas `appsweb/angular/src/app/shared/ui/*.md`
   y `appsweb/angular/src/styles/*.md`
5. Componentes visuales como `conventions-viewer`

## Reglas

- Ningun documento secundario puede contradecir al rector.
- Si dos documentos especializados chocan, se corrige el sistema; no conviven dos reglas validas.
- Si falta una regla, se propone y se espera aprobacion del Tech Lead.
- Si una regla nueva choca con codigo existente, no entra hasta tener plan de migracion.
- Si un documento legacy usa estructura o numeracion anterior al `2026-07-29`,
  no puede usarse como autoridad primaria.
- El legacy solo sirve como apoyo historico y siempre debe validarse contra
  `CONVENTIONS.md` y `conventions/*`.
- Ningun agente puede fundamentar una auditoria, plan o remediacion en una
  referencia legacy no revalidada contra el sistema rector vigente.
