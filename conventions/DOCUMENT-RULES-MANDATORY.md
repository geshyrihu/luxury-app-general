# 🔴 Reglas Obligatorias para Documentos MD (Planes, Reportes, Auditorías)

**Vigente desde:** 2026-09-29  
**Nivel:** 🔴 CRÍTICA — Obligatorio para todos los documentos en `docs/`, `docs/audit/`, `docs/plans/`, `docs/reporte_maestro/`  
**Gobernanza:** Revisor de PR rechaza documentos que violen estas 6 reglas  
**Referencia:** `conventions/DOCUMENT-DESIGN-STANDARD.md` (matriz completa)

---

## 🔴 REGLA 1: Inventario Visual en Alcance (§5)

**Descripción:** Toda sección "Alcance" debe incluir tabla que cuantifique cambios por esfuerzo.

**Formato obligatorio:**

```markdown
## 5. 🗺️ Alcance

| Componente | Cambio | Esfuerzo | Status |
|---|---|---|---|
| Backend: Inspection (entidad) | Agregar `RecurrenceUnit`, renombrar campos | M | 🟡 |
| Frontend: inspection/ | Rediseño UI ejecutor + retiro legacy | L | 🟡 |
| Jobs: Hangfire | Retiro `FireJob`, alta job unificado | S | 🟡 |

**Leyenda:** S=Small (1-2h), M=Medium (2-8h), L=Large (>8h)
```

**Aplicación:**
- ✅ Nuevos planes (obligatorio)
- ✅ Auditorías con cambios (obligatorio si hay recomendaciones)
- ⏳ Reportes de hallazgos (recomendado, no obligatorio)

**Por qué:** Sprint planning ve volumen de esfuerzo de un vistazo sin leer prosa.

**Verificación en PR:** Buscar patrón `| ... | S/M/L |` en sección Alcance. Si no existe → rechazar con comentario: "Falta inventario visual en §5 Alcance (ver DOCUMENT-RULES-MANDATORY.md §1)".

---

## 🔴 REGLA 2: Matriz de Impacto en Dependencias (§10)

**Descripción:** Toda sección "Dependencias e Impactos" debe ser una tabla, no una lista.

**Formato obligatorio:**

```markdown
## 10. 🔗 Dependencias e Impactos

| Sistema | Relación | Versión mínima | Impacto en este plan |
|---|---|---|---|
| `Equipment` / `InventoryCategory` | **Depende de** | Estable (T-203) | Alto — diseño asume Equipment fijo |
| `ServiceOrder` | **Impacta** (FK rename) | Actual | Bajo — FK nullable, transparente |
| `HangfireJobCatalog` | **Impacta** (job swap) | Actual | Medio — 1 job nuevo, 1 retiro |
| Otros módulos | **No impacta** | N/A | Cero — alcance contenido |
```

**Aplicación:**
- ✅ Nuevos planes (obligatorio)
- ✅ Ampliaciones de módulo (obligatorio)
- ⏳ Reportes (recomendado)

**Por qué:** Ejecutor identifica módulos que necesitan coordinación; evita sorpresas de integración.

**Verificación en PR:** Buscar tabla con columnas `Sistema | Relación | Versión mínima | Impacto`. Si es lista de bullets → pedir refactor a tabla.

---

## 🔴 REGLA 3: ADR Mini en Arquitectura (§6)

**Descripción:** Toda sección "Arquitectura" debe incluir mini-ADR explicando **por qué** las decisiones, no solo **qué** se implementa.

**Formato obligatorio:**

```markdown
### 🏛️ Decisiones de Diseño (Por qué)

| Decisión | Alternativa rechazada | Razón |
|---|---|---|
| 1 recorrido = N equipos con `Position` | 1 recorrido = 1 equipo | Negocio requiere agrupar multiequipo (precedente T-203) |
| `Status` enum (4 estados) | Booleanos `IsStarted`, `IsCompleted` | Estados complejos; enum es más limpio, auditable |
| QR resuelve "ejecución activa de hoy" | QR fijo a 1 ejecución singular | Recorridos recurrentes; flexible es más útil |
```

**Aplicación:**
- ✅ Nuevos planes (obligatorio)
- ✅ Diseños técnicos (obligatorio)
- ⏳ Reportes (recomendado si hay decisiones)

**Por qué:** Futuro arquitecto/auditor entiende trade-offs sin inferir. Evita "por qué se hizo así" discussions 6 meses después.

**Verificación en PR:** Buscar sección "Decisiones de Diseño" con tabla 3 cols. Si no existe y el doc tiene decisiones → pedir que la agregue.

---

## 🔴 REGLA 4: Metadata en Fases (§7)

**Descripción:** Cada fase debe incluir metadata clara: Owner, Esfuerzo estimado, Dependencias previas, Criterio de éxito.

**Formato obligatorio:**

```markdown
### Fase 1 — 🏗️ Modelo unificado

| Atributo | Valor |
|---|---|
| Owner | Backend Lead |
| Esfuerzo estimado | 2-3 días |
| Dependencias previas | Fase 0 completada |
| Criterio de éxito | Build sin errores, 0 referencias huérfanas |

**Descripción:** Migración EF...

**Checklist:**
- [ ] Migración aplica y revierte limpio
- [ ] 0 referencias a entidades retiradas
```

**Aplicación:**
- ✅ Nuevos planes (obligatorio)
- ✅ Roadmaps (obligatorio)
- ⏳ Reportes (recomendado)

**Por qué:** Sprint planning tiene información completa (quién, cuánto tiempo, qué bloquea, cuándo considerarse hecho).

**Verificación en PR:** Cada fase debe tener tabla 2 cols antes de descripción. Si falta → rechazar.

---

## 🔴 REGLA 5: Automatización en Criterios de Paso (§8)

**Descripción:** Cada criterio de paso debe especificar **cómo se valida** (manual vs E2E vs Unit test).

**Formato obligatorio:**

```markdown
**Happy path:** Recorrido semanal con equipos de 2 categorías → job genera → se ejecuta → se notifica.
**PASS si:** los 4 pasos ocurren sin error.
**Automatización:** E2E test en Cypress (`spec/operations/inspections.cy.ts`) — ejecutor user, asigna roles, valida generación, verifica notificación.

**Sad path:** Responsable base no disponible → supervisor reasigna.
**PASS si:** reasignación visible de inmediato.
**Automatización:** Unit test en xUnit (`[Fact] ReassignAsync_Changes_AssignedUserId`)

**Edge path:** Se completa sin hallazgos críticos.
**PASS si:** no se dispara notificación.
**Automatización:** Unit test en xUnit (`[Fact] Completion_WithoutCriticalFindings_DoesNotNotify`)
```

**Aplicación:**
- ✅ Nuevos planes (obligatorio)
- ⏳ Auditorías (recomendado)

**Por qué:** QA sabe exactamente qué escribir; no necesita adivinar. Dev sabe cuándo el plan está "hecho".

**Verificación en PR:** Buscar palabra "Automatización" en cada criterio de paso. Si no aparece → pedir que la agregue (o valide que no aplica, en cuyo caso anotar "Manual: ...").

---

## 🔴 REGLA 6: Colorear Riesgos Críticos (§9)

**Descripción:** La tabla de riesgos debe marcar visualmente (🔴 emoji) cualquier supuesto con probabilidad "Alta" O impacto "Crítico / Pérdida de datos".

**Formato obligatorio:**

```markdown
## 9. ⚠️ Riesgos y Mitigaciones

| Supuesto fallido | Impacto | Probabilidad | Mitigación | Owner |
|---|---|---|---|---|
| 🔴 Migración `DROP TABLE` en prod sin conteo previo = 0 | Pérdida de datos | Baja | Fase 0 exige conteo = 0 verificado antes de despliegue | Backend + usuario |
| Casos de recurrencia no portados de Fire job | Recorridos nunca se generan | Media | Portar explícitamente caso `Eventual` | Backend |
| Frontend legado deja rutas colgantes | Usuario ve 404 | Media | Checklist explicit de `grep` de rutas antes de Fase 6 | Frontend |
```

**Aplicación:**
- ✅ Nuevos planes (obligatorio)
- ⏳ Auditorías de riesgo (recomendado)

**Por qué:** Tech Lead/Ejecutivo ve riesgos bloqueantes SIN leer toda la tabla. 🔴 es visual + urgente.

**Verificación en PR:** Revisor busca columna "Impacto" y "Probabilidad". Si ve "Crítico" O "Alta" sin 🔴 → comenta: "Falta marcador visual en riesgo crítico (§6, DOCUMENT-RULES-MANDATORY.md)".

---

## 📋 Checklist de Cumplimiento (Para Revisores de PR)

```markdown
## ☑️ Documento cubre las 6 reglas obligatorias?

- [ ] **REGLA 1:** §5 Alcance incluye tabla Componente | Cambio | Esfuerzo (S/M/L) | Status
- [ ] **REGLA 2:** §10 Dependencias es tabla Sistema | Relación | Versión | Impacto (no bullets)
- [ ] **REGLA 3:** §6 Arquitectura incluye mini-ADR Decisión | Alternativa rechazada | Razón
- [ ] **REGLA 4:** §7 Cada fase tiene tabla Owner | Esfuerzo | Dependencias | Criterio éxito
- [ ] **REGLA 5:** §8 Cada criterio paso especifica Automatización (E2E/Unit/Manual)
- [ ] **REGLA 6:** §9 Riesgos con Impacto "Crítico" u Probabilidad "Alta" tienen 🔴 emoji

Si alguna fila es [ ], pedir al autor que la complete antes de mergear.
```

---

## 🛡️ Excepciones Permitidas

| Tipo de documento | Reglas aplicables | Excepciones |
|---|---|---|
| **Plan (tipo A/B/C)** | 1, 2, 3, 4, 5, 6 | Ninguna — todas obligatorias |
| **Reporte de Auditoría** | 1 (si hay cambios), 6 | 2, 3, 4, 5 recomendadas |
| **Discovery (01-discovery)** | 3 (RN) | 1, 2, 4, 5, 6 no aplican |
| **Análisis de Coherencia** | 1 (inventario), 6 (riesgos) | 2, 3, 4, 5 recomendadas |

**Regla meta:** Si un documento NO tiene tabla de cambios (§5), justificarlo explícitamente al inicio: "No aplica Regla 1 porque: [razón]."

---

## 🔄 Validación Automática (CI Gate futura)

Comando sugerido para script de CI (agregar a `package.json` o `.github/workflows/`):

```bash
#!/bin/bash
# Validar documentos MD en docs/ contra 6 reglas obligatorias

for file in docs/**/*.md docs/audit/**/*.md docs/plans/**/*.md; do
  if grep -q "^## .*Alcance\|^### .*Alcance" "$file"; then
    # Regla 1: debe tener tabla con "S/M/L"
    if ! grep -A10 "Alcance" "$file" | grep -q "S/M/L\|Small/Medium/Large"; then
      echo "⚠️  FAIL: $file — Falta inventario (Regla 1)"
    fi
  fi
  
  if grep -q "^## .*Dependencias\|^## .*Impactos" "$file"; then
    # Regla 2: debe tener tabla, no bullets
    if grep -A5 "Dependencias" "$file" | grep -q "^-"; then
      echo "⚠️  FAIL: $file — Dependencias usa bullets, debe ser tabla (Regla 2)"
    fi
  fi
  
  if grep -q "^## .*Arquitectura\|^## .*Diseño" "$file"; then
    # Regla 3: debe tener sección "Decisiones de Diseño"
    if ! grep -q "Decisión.*Alternativa.*Razón"; then
      echo "⚠️  FAIL: $file — Falta ADR mini (Regla 3)"
    fi
  fi
done
```

---

## 📍 Cómo Aplicar

### Para nuevos documentos (a partir de hoy):
1. Copia template de `DOCUMENT-DESIGN-STANDARD.md`
2. Completa las 11 secciones (no todas aplican, pero estructura)
3. Verifica las 6 reglas con el checklist arriba antes de mergear

### Para documentos existentes:
1. **Primera prioridad (hoy):** Auditorías con hallazgos críticos → agrega REGLA 6 (🔴 riesgos)
2. **Segunda prioridad (esta semana):** Planes activos → agrega REGLAS 1, 4, 5
3. **Tercera prioridad (próximo sprint):** Todos los demás → agrega REGLAS 2, 3

### Para Revisores de PR:
- Busca palabra "Alcance" → verifica REGLA 1
- Busca palabra "Dependencias" → verifica REGLA 2
- Busca palabra "Arquitectura" → verifica REGLA 3
- Busca palabra "Fase" + número → verifica REGLA 4
- Busca palabra "Criterios de Paso" → verifica REGLA 5
- Busca palabra "Riesgos" → verifica REGLA 6

Si falta alguna → comenta: "Falta [REGLA N]. Ver conventions/DOCUMENT-RULES-MANDATORY.md."

---

## 📚 Referencia Cruzada

| Regla | Documento Estándar | Sección |
|---|---|---|
| 1 | DOCUMENT-DESIGN-STANDARD.md | §3.5 Alcance |
| 2 | DOCUMENT-DESIGN-STANDARD.md | §3.11 Dependencias |
| 3 | DOCUMENT-DESIGN-STANDARD.md | §3.6 Arquitectura |
| 4 | DOCUMENT-DESIGN-STANDARD.md | §3.8 Fases |
| 5 | DOCUMENT-DESIGN-STANDARD.md | §3.9 Criterios de Paso |
| 6 | DOCUMENT-DESIGN-STANDARD.md | §3.10 Riesgos |

---

## ✅ Checklist de Cumplimiento para CONVENTIONS.md

- [ ] REGLA 1: Tabla inventario Alcance (S/M/L)
- [ ] REGLA 2: Tabla matriz Dependencias (Sistema | Relación)
- [ ] REGLA 3: ADR mini Decisiones (Decisión | Alternativa | Razón)
- [ ] REGLA 4: Tabla metadata Fases (Owner | Esfuerzo | Dependencias | Criterio éxito)
- [ ] REGLA 5: Especificar Automatización en Criterios de Paso (E2E/Unit/Manual)
- [ ] REGLA 6: Marcar 🔴 riesgos críticos (Impacto "Crítico" u Probabilidad "Alta")

---

**Vigente desde:** 2026-09-29  
**Siguiente revisión:** 2026-10-31 (después de aplicar a 3 planes nuevos)  
**Responsable:** Tech Lead (governance), Revisores de PR (validación)
