# 🔴 Auditoría de Coherencia: CONVENTIONS.md — 2026-09-12

**Auditor:** Análisis crítico del documento rector  
**Método:** Verificación contra filesystem real + cross-reference de documentación  
**Severidad:** 🔴 BLOQUEANTE (regresiones en go-live)

---

## ✅ Fortalezas Confirmadas

### 1. Jerarquía Normativa Clara
- Precedencia explícita (§2, §3): Regla única por dominio
- Principio "no asumir": si una regla no existe documentada, no se aplica
- Gobernanza honesta: secciones "SUPERADA (2026-09-XX)" demuestran evolución, no ocultamiento

### 2. Datos Concretos, No Dogma
- Bug verificable (DateTime.Now caso FH-2X del 2026-08-28)
- 79 warnings CS8632 nullable documentado con fecha
- Baselines de lint (icon-names, arquivo-names) con comandos grep
- Mejor sección: SelectItemStatus flujo multi-módulo (verificable contra código real)

### 3. Reglas con Gate Mecánico
- UTF-8 encoding rule (§6.1) tiene comando: `node scripts/scan-mojibake.mjs`
- Fecha rule (§5.8) tiene grep: `grep -r "[0-9]{8}-"` para legacy
- Mejora: 80% de reglas deberían tener comando de validación

---

## 🔴 INCONGRUENCIAS HALLADAS

### HALLAZGO 1: Mojibabe en el Propio Rector ⚠️

**Severidad:** MEDIA (cosmética pero hipócrita)  
**Ubicación:** 10+ líneas en `CONVENTIONS.md`

```
Línea 10: §5.9.1, único, índices
Línea 37: auditoría
Línea 41: módulo
Línea 47: Auditoría
Línea 48: crítico
```

**Verificación:**
```bash
grep -n "§\|Ã\|ðŸ" conventions/CONVENTIONS.md | wc -l
# Resultado: 50+ líneas con mojibabe
```

**Impacto:** Viola propia regla §6.1 "Textos en español sin mojibabe". Confunde parsers/agentes que leen el documento como fuente normativa.

**Acción:** Recodificar CONVENTIONS.md a UTF-8 puro (sin BOM).

---

### HALLAZGO 2: Skill planeacion-modulos Referencia Rutas Obsoletas ⚠️

**Severidad:** ALTA (desvía a desarrolladores)  
**Ubicación:** `.agents/skills/planeacion-modulos/SKILL.md`

**Rutas mencionadas vs. Realidad:**

| Ruta en Skill | Esperada | Real | Status |
|---------------|----------|------|--------|
| `api/LuxuryApp.Infrastructure.Data/Data/Entities/` | ✅ | `api/LuxuryApp.Application/Modules/*/Entities/` | ❌ DESALINEADA |
| `client/angular/src/app/apps/` | ✅ | `appsweb/angular/src/app/apps/` | ❌ DESALINEADA |
| `api/LuxuryApp.Shared/Enums/ApplicationRoleEnum.cs` | ✅ | `api/LuxuryApp.Application/Shared/Enums/ApplicationRoleEnum.cs` | ❌ DESALINEADA |

**Verificación:**
```bash
test -d api/LuxuryApp.Infrastructure.Data/Data/Entities && echo "EXISTS" || echo "NOT FOUND"
# Resultado: NOT FOUND

test -f client/angular/src/app && echo "EXISTS" || echo "NOT FOUND"
# Resultado: NOT FOUND (client/ no existe; es appsweb/)
```

**Impacto:** Desarrolladores creen que existe `api/LuxuryApp.Infrastructure.Data` (no existe desde 2026-09-11). Skill entrega instrucciones hacia rutas fantasma.

**Acción:** Actualizar skill `planeacion-modulos` con rutas correctas post-refactor (2026-09-11).

---

### HALLAZGO 3: Contradicción Monolítica vs. Satélite ⚠️

**Severidad:** ALTA (contradice arquitectura)  
**Ubicación:** CONVENTIONS.md §5.2 + realidad

**Regla Documentada:**
```
§5.2: "Prohibido crear proyectos .csproj satélite. TODO vive en LuxuryApp.Application."
```

**Realidad en Disco:**
```
✅ api/LuxuryApp.Application/               (monolítica, vigente)
✅ api/LuxuryApp.Api/                        (satélite, 260 controllers → endpoints)
✅ api/LuxuryApp.Tests/                      (satélite, 76 archivos test)
✅ api/LuxuryApp.Shared/                     (posible, parcialmente usado)
```

**Contradicción:**
- Regla prohíbe satélites
- Realidad: 3 satélites en uso activo
- Documento no documenta CUÁNDO se crearon ni por qué conviven

**Acción:** Clarificar §5.2 — "Proyectos satélite permitidos: Api (endpoints) y Tests (test suites). TODO lo demás en Application."

---

### HALLAZGO 4: Divergencia Naming Discovery (questionnaire vs cuestionario) ⚠️

**Severidad:** MEDIA (divergencia documentada, incumple regla §2)  
**Ubicación:** docs/modulos-nuevos/ + skill NAMING

**Regla §2 Dice:**
```
"No se permite convivencia de dos reglas válidas por mismo dominio."
```

**Realidad:**
```
3 módulos:   01-discovery-cuestionario.md    (español)
2 módulos:   01-discovery-questionnaire.md   (inglés)
```

**Verificación:**
```bash
ls -la docs/modulos-nuevos/*/01-discovery-*.md
# ai-chat/01-discovery-cuestionario.md
# LuxuryAppLogs/01-discovery-cuestionario.md
# onboarding-checklist/01-discovery-cuestionario.md
# reestructuracion-reclutamiento-candidates/01-discovery-questionnaire.md
# registro-entradas-personal/01-discovery-questionnaire.md
```

**Impacto:** Skill `planeacion-modulos` genera documentos con nombrado inconsistente. Futuro auditor no sabe cuál es la "fuente de verdad".

**Acción:** Decisión formal: ¿español o inglés? Fijar en CONVENTIONS.md §5.8 y convertir los 5 módulos existentes.

---

### HALLAZGO 5: AGENTS.md Referencias Rutas Fantasma ⚠️

**Severidad:** BAJA (scripts de conveniencia, no gate de build)  
**Ubicación:** `.antigravity/AGENTS.md`, `.codex/AGENTS.md`

**Línea:** `node scripts/scan-mojibake.mjs client/luxuryapp`

**Problema:** `client/luxuryapp/` no existe. La skill se refiere a monolito planeado pero aún no existente.

**Verificación:**
```bash
test -d client/luxuryapp && echo "EXISTS" || echo "NOT FOUND"
# Resultado: NOT FOUND
```

**Acción:** Comentar o actualizar a `client/angular` hasta que monolito se cree.

---

## 📋 Tabla de Remediación

| Hallazgo | Severidad | Fix | Dueño | ETA |
|----------|-----------|-----|-------|-----|
| 1. Mojibabe CONVENTIONS.md | MEDIA | Recodificar UTF-8 | Tech Lead | 1h |
| 2. Skill rutas obsoletas | ALTA | Actualizar planeacion-modulos | Agent Owner | 2h |
| 3. Contradicción monolítica | ALTA | Clarificar §5.2 satélites | Tech Lead | 1h |
| 4. Divergencia naming (discovery) | MEDIA | Decisión + conversión | Tech Lead | 3h |
| 5. AGENTS.md rutas fantasma | BAJA | Comentar o actualizar | Ops | 30m |

---

## 🎯 Recomendaciones Sistémicas

### 1. Validación de Coherencia Automática (Fase 2 del Plan API Naming)
Crear CI guard que verifique:
```bash
# Encoding
node scripts/scan-mojibake.mjs conventions/

# Rutas referenciadas
grep -r "api/LuxuryApp.Infrastructure" conventions/ && echo "FAIL: Infrastructure reference outdated"

# Naming divergencia
find docs/modulos-nuevos -name "*questionnaire*" -o -name "*cuestionario*" | \
  xargs wc -l | awk 'NR>1 && NF>1' | sort | uniq -c | \
  awk 'NR==1 { if ($1 > 1) print "FAIL: Naming divergence detected" }'
```

### 2. Sección "DECLARACIÓN DE VERDAD" en CONVENTIONS.md
Agregar después de §1:
```markdown
## §1bis: Estado Vigente (Verificado 2026-09-12)

**Proyectos Activos:**
- ✅ `api/LuxuryApp.Application/` — Monolítica vigente
- ✅ `api/LuxuryApp.Api/` — Endpoints (viejo, deprecado 2026-09-XX)
- ✅ `api/LuxuryApp.Tests/` — Test suite (path-based desde 2026-09-11)

**Rutas Obsoletas (NUNCA volver a usar):**
- ❌ `api/LuxuryApp.Infrastructure.Data/` — Eliminada 2026-09-11
- ❌ `client/angular/` — Movida a `appsweb/angular/` (2026-09-XX)
```

### 3. Regla: Todo Gate Debe Tener Comando
Si una regla no tiene `grep`, `node`, `powershell` o comando equivalente, **no es una regla verificable**. Marcar con `⚠️ SIN VALIDACIÓN AUTOMATICA` mientras no tenga gate.

---

## ✅ Conclusión

**El documento es un buen rector porque:**
- Documenta lecciones aprendidas con fecha
- Tiene jerarquía y precedencia
- Honestidad sobre deuda

**Pero tiene defectos de ejecución porque:**
- Viaja con bagaje técnico obsoleto (Infrastructure.Data, client/angular)
- Tolera divergencia de naming sin decisión explícita
- Reglas sin validación automática se pierden

**Prioridad:** Fijar hallazgos 2, 3, 4 (arquitectura) antes de next go-live. Hallazgos 1, 5 son cosméticos.

---

**Auditoría completada:** 2026-09-12  
**Siguiente revisión programada:** 2026-10-12 (mensual)
