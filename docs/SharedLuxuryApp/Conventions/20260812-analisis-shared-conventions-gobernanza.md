# Contexto Detallado: 4 Hallazgos Gobernanza — CONVENTIONS.md

**Fecha:** 2026-08-12  
**Fuente:** reporte-coherencia.md + análisis §3, §4.7, §5.6.2, §5.9.1, §5.9.2, §7

---

## 1️⃣ § 5.9.1 / § 5.9.2 — CRÍTICA sobre "Propuesta en Evaluación"

### Problema

Dos secciones nuevas etiquetadas 🔴 **CRÍTICA** pero contienen lenguaje de propuesta:

**§5.9.1 Notificaciones (líneas 614–651):**
```
🔴 **CRÍTICA:** Sistema de notificaciones debe ser centralizado, tipado y con URLs resueltas correctamente.

1. **[Estándar de Notificaciones](../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md)** 
   — Propuesta de arquitectura centralizada (en evaluación)

Fase actual (2026-08-12): Propuesta + auditoría completadas. 
Pendiente aprobación Tech Lead + implementación de 4 fases de remediación.
```

**§5.9.2 Background Jobs (líneas 653–690):**
```
🔴 **CRÍTICA:** Jobs recurrentes deben seguir patrón centralizado. 
Sistema Hangfire implementado (29 jobs), documentación faltaba.

Plan de remediación: [../../../docs/AdminLuxuryApp/Jobs/20260812-remediacion-admin-jobs.md](docs/plans/../../../docs/AdminLuxuryApp/Jobs/20260812-remediacion-admin-jobs.md) 
— 4 fases, auditar 15+ jobs existentes.
```

### Contradicción Identificada

**CONVENTIONS.md §7 (Gobernanza) línea 941:**
```
— Solo el Tech Lead aprueba nuevas reglas o cambios a reglas existentes.
— Toda regla aprobada obliga a actualizar: CONVENTIONS.md, doc especializado, índices, viewer, capas operativas
```

**CONVENTIONS.md §3 (Intro) líneas 55–62:**
```
- Si una regla nueva contradice el estado actual del código, no entra en vigor 
  hasta tener plan de migración aprobado.
- Si falta una regla, el agente **no asume**: propone la regla y espera aprobación del Tech Lead.
```

**Contradicción:** §5.9.1 y §5.9.2 están etiquetadas con sello **CRÍTICA** (implica: "regla obligatoria, entra en vigor ya"), pero el contenido declara "propuesta en evaluación" y "pendiente aprobación Tech Lead".

Un lector que ve 🔴 CRÍTICA espera: "Esta regla es obligatoria ahora".  
Pero el documento dice: "Esta es una propuesta que aún no fue aprobada".

**Resultado:** El sello 🔴 pierde significado. ¿Es regla vigente o propuesta? No queda claro.

### Estado Real (2026-08-12)

**Notificaciones:**
- ✅ Estándar propuesto en `../../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md` (748 líneas)
- ✅ Auditoría completada: `docs/audit/20260812-AUDITORIA-NOTIFICACIONES.md` (4 hallazgos críticos)
- ✅ 19 violaciones identificadas (URLs hardcodeadas, colores fuera de marca)
- ⏳ Plan de remediación diseñado (4 fases, 15 horas)
- ❌ NO APROBADA por Tech Lead aún

**Jobs/Hangfire:**
- ✅ Sistema implementado (29 jobs activos)
- ✅ Documentación en `conventions/backend/backend-jobs-hangfire.md` (396 líneas, 12 secciones)
- ✅ Checklist en `conventions/backend/backend-jobs-checklist.md`
- ✅ **Fases 1-3 de remediación YA EJECUTADAS** (18/19 jobs actualizados)
- ⏳ Fase 4 (gobernanza permanente) pendiente
- ❌ NO APROBADA por Tech Lead aún

### Opciones de Resolución

**Opción A (Recomendada: APROBAR)** — Tech Lead firma aprobación
```
Cambio en CONVENTIONS.md:
- Línea 614 (§5.9.1): Quitar "Propuesta de arquitectura centralizada (en evaluación)"
- Línea 651: Cambiar "Pendiente aprobación Tech Lead" → "Aprobada 2026-08-12"
- Línea 655 (§5.9.2): Similar
- Agregar nota: "✅ APROBADA - Remediación en progreso (Fases 1-3 ejecutadas)"

Impacto:
- Regla entra en vigor AHORA
- Nuevos jobs/notificaciones deben seguir patrón
- Validación en code review
```

**Opción B (RECHAZAR)** — Tech Lead dice "no"
```
Revertir documentación:
- Eliminar §5.9.1 y §5.9.2 de CONVENTIONS.md
- Mover docs a "propuestas descartadas" o backup
- Cancelar plan de remediación
```

**Opción C (DIFERIR)** — Aprobar sólo cuando remediación esté 100% hecha
```
Bajar sello de 🔴 CRÍTICA a 🟡 PROPUESTA PENDIENTE
- Guardar documentación como referencia
- Cambiar lenguaje a "en evaluación"
- Aprobar cuando todas las fases de remediación estén completas
```

### Recomendación

**→ Opción A (APROBAR AHORA)**

**Justificación:**
1. Documentación está completa y sólida (396 líneas backend-jobs, 748 líneas notification-standard)
2. Jobs: Fases 1-3 YA completadas (18/19 jobs refactorizados, 95% compliance)
3. Notificaciones: Auditoría ejecutada, 4 hallazgos documentados, plan listo
4. Ambas tienen patrones testificados en codebase (29 jobs reales, notificaciones en múltiples módulos)
5. Code review puede validar conformidad a partir de hoy

**Riesgo de NO aprobar:**
- Documentación queda en limbo
- Nuevos jobs ignoran patrón (falta autoridad)
- Notificaciones siguen con URLs hardcodeadas

---

## 2️⃣ Tokens CSS — Tensión entre § 6.1 y § 5.6.2

### Problema

Dos secciones de CONVENTIONS.md dan a entender reglas en conflicto sobre dónde deben vivir los tokens CSS.

**§6.1 (línea 742):**
```
Tokens autorizados en:
  …/styles/core/_colors.scss
  …/styles/core/_spacing.scss
  …/styles/core/_typography.scss
  …/styles/core/_shadows.scss
  …/styles/core/_borders.scss
```

Lectura literal: "Los tokens autorizados están en core/. Punto final."

**§5.6.2 (líneas 486–506):**
```
### 5.6.2 Capas de tokens con alcance de módulo (RN-DS-041)

Un color que **solo usa un módulo** no pertenece a `core/_colors.scss`. 
Va en una capa con alcance propio, con prefijo del módulo, declarada una sola vez.

Referencia: `src/styles/custom/_financial-tables.scss` (Sprint 4, 2026-08-10).
103 hex dispersos pasaron a 49 tokens `--rf-*` declarados en un solo bloque.
```

Lectura: "Los tokens de módulo van en custom/_, no en core/."

### Contradicción Aparente

¿Dónde DEBEN vivir los tokens?
- Lectura §6.1 literalmente: SOLO core/
- Lectura §5.6.2: También custom/ (pero para módulos específicos)

Conflicto de autoridad: ¿Cuál es la verdad?

### Interpretación Real (No Hay Contradicción)

**Ambas son correctas, ámbito distinto:**

**§6.1 (Ámbito GLOBAL):**
- Tokens usados en 2+ módulos → core/_colors.scss
- Tokens reutilizables en cualquier pantalla → core/_spacing.scss
- Ejemplo: `--ds-primary`, `--ds-spacing-md` (aplicables a toda la app)

**§5.6.2 (Ámbito MÓDULO):**
- Tokens usados SOLO en un módulo → custom/_[modulo].scss
- Ejemplo: `--rf-financial-table-header` (solo Cobranza Online)
- Regla: "Ningún color se escribe dos veces"

**Diferencia:**
```
core/_colors.scss     → Tokens compartidos (2+ módulos)
custom/_financial-tables.scss → Tokens específicos de ese módulo/feature
```

**Pero §6.1 no lo aclara explícitamente.** Lee como: "TODO va en core/".

### Dónde Está el Problema

Línea 742 de §6.1 NO explica cuándo se PERMITE custom/_.  
Implícitamente, §5.6.2 da la respuesta, pero no está linked desde §6.1.

Dev nuevo que lee §6.1 piensa: "Todos los tokens van en core/".  
Dev que lee §5.6.2 piensa: "Si es solo para mi módulo, custom/".  
Conflicto de interpretación.

### Solución

**Aclaración en §6.1 (línea 742+):**

```markdown
**Dónde viven:**

- **core/_colors.scss** — Colores reutilizables en 2+ módulos (globales)
- **core/_spacing.scss** — Espaciado global
- **core/_typography.scss** — Tipografía global
- **custom/_[nombre].scss** — Tokens específicos de UN módulo
  (con prefijo del módulo, e.g., `--rf-*` para Financial Reports)
  
Regla: "Si un color se usa en 2+ módulos, va en core/. 
Si se usa en solo 1 módulo y no aparece en otro, va en custom/ con prefijo."

Referencia: §5.6.2 (Capas con alcance de módulo) y ejemplo real en custom/_financial-tables.scss
```

---

## 3️⃣ Conteo "6" vs Lista 1–7 (§4.7)

### Problema

**Línea 245 (Encabezado de §4.7):**
```
**Documentos a crear (6 documentos obligatorios):**
```

**Líneas 249–329 (Lista real):**
```
1. Backend README (Nivel 1)
2. Backend Docs (Nivel 2)
3. Frontend README (Operativo)
4. Frontend Setup (Onboarding)
5. Frontend Decisiones (Matriz)
6. Auditoría + Arquitectura
7. Documentación de Diseño (Opcional - solo si módulo es crítico)
```

**Discrepancia:** Encabezado dice "6 obligatorios", pero lista muestra 7 items, con uno marcado "Opcional".

### Interpretación Correcta

Leyendo el contenido:
- Items 1-6: OBLIGATORIOS (siempre)
- Item 7: OPCIONAL (solo si módulo crítico)

Total obligatorio: 6 ✅  
Total con opcional: 7

### Acción Requerida

Cambiar línea 245 para aclarar:

**Opción A (Encabezado más claro):**
```markdown
**Documentos a crear: 6 obligatorios + 1 opcional:**
```

**Opción B (Explicación inline):**
```markdown
**Documentos a crear (6 documentos obligatorios + 1 opcional según criticidad):**
```

**Opción C (Renumerar lista):**
```markdown
**Documentos a crear (6 documentos obligatorios):**

**Backend:**
1. README Nivel 1
2. Documentación Nivel 2

**Frontend:**
3. README Operativo
4. Setup Onboarding
5. Decisiones Matriz

**Auditoría & Arquitectura:**
6. Auditoría Ejecutada

**Opcional:**
7. Documentación de Diseño (solo si módulo es crítico)
```

---

## 4️⃣ Corte Temporal 2026-08-06 vs 2026-08-12

### Problema

**CONVENTIONS.md Cabecera (línea 10):**
```
Última revisión: 2026-08-12 (Reestructuración de la carpeta legacy → conventions/…)
```

**CONVENTIONS.md §2 (línea 59):**
```
Si un documento legacy usa estructura, numeración, secciones o autoridad
previa al **2026-08-06** (última consolidación del sistema rector), 
no puede usarse como fuente normativa primaria.
```

**CONVENTIONS.md §8.1 (línea 985):**
```
no pueden operar como autoridad primaria si contradicen o anteceden al sistema
rector vigente del **2026-08-06** (última consolidación)
```

### Tensión Identificada

**Cabecera dice:** "Sistema vigente desde 2026-08-12"  
**§2 y §8.1 dicen:** "Sistema rector desde 2026-08-06"

¿Cuál es el corte temporal real?

### Interpretación

Son eventos DISTINTOS:
- **2026-08-06:** Última CONSOLIDACIÓN (momento donde CONVENTIONS.md quedó coherente)
- **2026-08-12:** Última REVISIÓN (momento donde se hizo la reestructuración de carpetas + documentación de Jobs/Notificaciones)

No son mutuamente excluyentes. Pero crea confusión:

**Dev lee §2:**
> "2026-08-06 es el tope para autoridad primaria"

**Dev ve cabecera:**
> "2026-08-12 es la última revisión"

**Pregunta:** ¿Debo considerar algo post-2026-08-06 como autoridad? La cabecera me dice "sí, 2026-08-12 es vigente", pero §2 dice "hasta 2026-08-06".

### Decisión Pendiente

Tech Lead debe decidir:

**Opción A: Actualizar corte a 2026-08-12**
```markdown
§2 línea 59:
"Si un documento legacy usa estructura anterior al **2026-08-12** 
(última consolidación + reestructuración del sistema rector)…"

§8.1 línea 985:
"…anterior al sistema rector vigente del **2026-08-12**…"

Rationale: La reestructuración de carpetas (legacy → docs-conventions) 
y la documentación de Jobs/Notificaciones hacen que 2026-08-12 sea el verdadero corte.
```

**Opción B: Mantener 2026-08-06, aclarar cabecera**
```markdown
Cabecera línea 10:
"Última revisión: 2026-08-12 (revisión de documentación).
Última consolidación del sistema rector: 2026-08-06."

Rationale: La consolidación ocurrió en 2026-08-06; la revisión de 
2026-08-12 es actualizaciones dentro de ese marco.
```

**Opción C: Dual timeline**
```markdown
Mantener ambos:
- Consolidación: 2026-08-06 (sistema rector coherente)
- Revisión: 2026-08-12 (reestructuración + nuevos documentos)

Regla: Legacy anterior a 2026-08-06 es no-autoridad.
       Nuevo contenido (2026-08-12) entra en vigor si Tech Lead aprueba.
```

### Recomendación

→ **Opción C (Dual Timeline)**

Aclarar en §2 y §8.1 que existe diferencia entre consolidación (2026-08-06) y revisión (2026-08-12), y que el nuevo contenido (Jobs, Notificaciones) entra en vigor cuando se apruebe.

---

## 📊 Resumen Ejecutivo

| # | Hallazgo | Severidad | Estado | Recomendación |
|---|----------|-----------|--------|---------------|
| 1 | §5.9.1/5.9.2 CRÍTICA pero "propuesta" | 🔴 CRÍTICA | ⏳ Tech Lead | Aprobar ambas (Opción A) |
| 2 | Tokens CSS core/ vs custom/ tensión | 🟡 MEDIA | ⏳ Tech Lead | Aclarar en §6.1 que custom/ es para módulos específicos |
| 3 | Conteo "6" vs lista 7 | 🟢 MENOR | ⏳ Tech Lead | Cambiar encabezado a "6 obligatorios + 1 opcional" |
| 4 | Corte temporal 2026-08-06 vs 12 | 🟢 MENOR | ⏳ Tech Lead | Opción C: Mantener ambas fechas con aclaración de diferencia |

---

**Análisis completado:** 2026-08-12  
**Status:** Pendiente decisiones Tech Lead  
**Impacto:** Alineación de gobernanza y claridad de reglas
