# Trazabilidad - Bloque 3 Gobernanza, Features, Checklist y UI

**Fecha:** 2026-07-30
**Bloque:** governance, roles, training, features, checklist, design, decision tree y viewer

---

## Archivos revisados

1. `conventions/gobernanza-convenciones.md`
2. `conventions/roles-y-perfiles.md`
3. `conventions/TECH_LEAD_TRAINING.md`
4. `conventions/AVAILABLE_FEATURES.md`
5. `conventions/IMPLEMENTATION_CHECKLIST.md`
6. `conventions/DESIGN_CONVENTIONS.md`
7. `conventions/decision-tree-components.md`
8. `conventions/conventions-viewer-guide.md`

---

## Resultado

### 1. `gobernanza-convenciones.md`

- **Estatus:** absorbido funcionalmente
- **Destino nuevo principal:**
- [core/governance.md](../core/governance.md)
- [core/governance-by-role.md](../core/governance-by-role.md)
- **Valor reforzado:**
  - responsabilidades por rol
  - escalacion
  - cierre de consistencia documental

### 2. `roles-y-perfiles.md`

- **Estatus:** absorbido funcionalmente
- **Destino nuevo principal:**
- [core/governance-by-role.md](../core/governance-by-role.md)
- **Valor reforzado:**
  - responsabilidades por rol
  - comandos o validaciones tipicas

### 3. `TECH_LEAD_TRAINING.md`

- **Estatus:** absorbido parcialmente
- **Destino nuevo principal:**
- [core/tech-lead-training.md](../core/tech-lead-training.md)
- **Valor reforzado:**
  - checklist minimo de dominio del Tech Lead

### 4. `AVAILABLE_FEATURES.md`

- **Estatus:** absorbido parcialmente
- **Destino nuevo principal:**
- [operations/available-features.md](../operations/available-features.md)
- **Valor reforzado:**
  - `IHttpClientFactory`
  - `TimeProvider`
  - Serilog por inyeccion
  - prohibiciones frontend adicionales ligadas a `shared/ui`

### 5. `IMPLEMENTATION_CHECKLIST.md`

- **Estatus:** absorbido parcialmente
- **Destino nuevo principal:**
- [operations/implementation-checklist.md](../operations/implementation-checklist.md)
- **Valor reforzado:**
  - revisar protocolos adicionales por tarea
  - validar legacy relacionado antes de seguirlo

### 6. `DESIGN_CONVENTIONS.md`

- **Estatus:** apoyo activo controlado
- **Destino nuevo principal:**
- [ui/ui-usage-catalog.md](../ui/ui-usage-catalog.md)
- [ui/ui-desktop-rules.md](../ui/ui-desktop-rules.md)
- [ui/ui-mobile-rules.md](../ui/ui-mobile-rules.md)
- **Valor reforzado:**
  - decision base de componentes y contenedores

### 7. `decision-tree-components.md`

- **Estatus:** absorbido parcialmente
- **Destino nuevo principal:**
- [ui/ui-usage-catalog.md](../ui/ui-usage-catalog.md)
- **Valor reforzado:**
  - regla de empezar por `lx-*`
  - antipatron de mezclar web y mobile en el mismo scope

### 8. `conventions-viewer-guide.md`

- **Estatus:** absorbido parcialmente
- **Destino nuevo principal:**
- [ui/conventions-viewer-governance.md](../ui/conventions-viewer-governance.md)
- **Valor reforzado:**
  - el viewer debe reflejar tambien reglas transversales y protocolos

---

## Ambiguedades resueltas en este bloque

- roles y gobernanza ya no dependen del documento historico como autoridad primaria
- available features y checklist ya tienen absorcion adicional de reglas finas
- el decision tree UI ya no queda aislado del catalogo de uso nuevo
- el viewer ya no debe tratarse solo como catalogo de reglas de codigo

---

## Pendientes reales de este bloque

- medir si `DESIGN_CONVENTIONS.md` requiere una absorcion aun mas profunda por componente
- revisar si el `conventions-viewer-guide.md` historico puede degradarse pronto o si aun contiene operativa no migrada

