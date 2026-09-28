# Plan de Consolidacion Documental Total

**Fecha:** 2026-07-30
**Estado:** En ejecucion
**Objetivo:** Absorber completamente las reglas, protocolos, formatos y
criterios vigentes de los documentos historicos hacia el sistema rector nuevo
de convenciones, sin perder contenido valido ni dejar ambiguedades activas.

---

## Regla de Garantia

No se declarara consolidado el sistema de convenciones hasta cumplir **todas**
estas condiciones:

1. **Cobertura total de archivos**
   - deben revisarse los `28` archivos base inventariados:
     - `24` en `conventions/`
     - `3` en `docs/guides/`
     - `1` en `conventions/operations/plan-agent-instructions.md`

2. **Trazabilidad archivo por archivo**
   - cada archivo debe registrar:
     - reglas utiles detectadas
     - documento nuevo donde quedo absorbido
     - reglas faltantes por migrar
     - contradicciones o ambiguedades detectadas
     - estatus final

3. **Cero ambiguedad normativa abierta**
   - ninguna regla puede quedar vigente en dos formas incompatibles
   - si existe conflicto, se centraliza una sola version oficial

4. **Sincronizacion completa del sistema**
   - `CONVENTIONS.md`
   - documentos especializados impactados
   - indices
   - `CHANGELOG.md`
   - `conventions-viewer`

5. **Cierre con auditoria de cobertura**
   - reporte final de que archivo fue absorbido, cual queda como apoyo activo y
     cual ya puede degradarse a legacy pasivo

---

## Alcance de Revision Obligatoria

### A. Documentos raiz en `docs-conventions/conventions`

1. `AGENT_AUDIT_PROTOCOL.md`
2. `AGENT_INSTRUCTIONS_CATALOG.md`
3. `AUDITORIA_POR_ROL.md`
4. `AUDIT_LAYERS_CHECKLIST.md`
5. `AVAILABLE_FEATURES.md`
6. `CHANGELOG.md`
7. `CONVENTIONS_VIEWER_GUIDE.md`
8. `DECISION_TREE_COMPONENTS.md`
9. `DESIGN_CONVENTIONS.md`
10. `DEVELOPER_ONBOARDING.md`
11. `ENCODING_STRICTO.md`
12. `GIT_HOOKS_SETUP.md`
13. `GOBERNANZA_CONVENCIONES.md`
14. `IMPLEMENTATION_CHECKLIST.md`
15. `MODULE_DOCUMENTATION_INSTRUCTIONS.md`
16. `ONBOARDING_GIT_HOOKS.md`
17. `PLAN_REVISION_SERVICIOS_COMPARTIDOS.md`
18. `PROTOCOLO_COMPLIANCE_CONVENCIONES.md`
19. `README.md`
20. `README_PLANS.md`
21. `ROLES_Y_PERFILES.md`
22. `SCRIPTS_AUDITORIA.md`
23. `TECH_LEAD_ONBOARDING_GUIDE.md`
24. `TECH_LEAD_TRAINING.md`

### B. Documentos en `docs/guides`

25. `docs/guides/20260715-guia-agente-soporte-errores-refactor.md`
26. `docs/guides/GUIDE_AGENT_INSTRUCTIONS.md`
27. `docs/guides/README.md`

### C. Documento especial de planes

28. `conventions/operations/plan-agent-instructions.md`

---

## Matriz de Control Obligatoria

Cada archivo debe terminar clasificado en una de estas categorias:

- `absorbido al 100%`
- `absorbido parcialmente`
- `vigente como apoyo activo controlado`
- `legacy pasivo`
- `requiere migracion adicional`

Y ademas debe registrar:

- documento nuevo destino
- reglas migradas
- reglas pendientes
- ambiguedades resueltas
- ambiguedades pendientes

---

## Metodo de Trabajo

### Fase 1. Inventario y lectura completa

- leer cada archivo completo
- no inferir por nombre ni por resumen
- detectar reglas, protocolos, formatos, anti-patrones, checklists y
  referencias normativas

### Fase 2. Trazabilidad de absorcion

- mapear cada regla al documento nuevo correspondiente
- si la regla no existe en el sistema nuevo, se migra
- si la regla existe pero quedo debil o ambigua, se endurece

### Fase 3. Resolucion de contradicciones

- toda contradiccion se registra
- se define una sola regla oficial
- se actualizan todos los puntos afectados

### Fase 4. Sincronizacion del ecosistema

- actualizar indices
- actualizar `CHANGELOG.md`
- actualizar `conventions-viewer`
- registrar control de legacy

### Fase 5. Auditoria final de cobertura

- verificar que no quede archivo sin clasificar
- verificar que no quede regla viva solo en legacy
- verificar que no existan referencias rectoras a secciones viejas o rutas obsoletas

---

## Criterios de Cierre

La consolidacion **no** puede cerrarse hasta que:

- los `28` archivos queden trazados
- toda regla vigente tenga destino oficial nuevo
- las reglas nuevas recientes tambien queden integradas
- el `conventions-viewer` refleje el sistema final
- exista reporte final de cobertura total

---

## Entregables Obligatorias

1. Matriz de trazabilidad archivo por archivo
2. Actualizacion de documentos nuevos oficiales
3. Bitacora de ambiguedades resueltas
4. Actualizacion de viewer e indices
5. Reporte final de cobertura y estatus legacy

---

## Nota de Integridad

La garantia razonable aqui **no** sale de prometer perfeccion a ciegas. Sale de
un control exhaustivo, verificable y auditable archivo por archivo. Si un
archivo no pasa por esta matriz, no puede darse por consolidado.

