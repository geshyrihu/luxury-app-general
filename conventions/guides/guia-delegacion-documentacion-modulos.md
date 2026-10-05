# Guía de Delegación: Replicar Estructura de Documentación a Otros Módulos

**Propósito:** Instrucciones CLARAS para otro agente (no Claude Code) para replicar el piloto exitoso de Candidates a otros módulos.

**Fuente piloto:** Reclutamiento > Candidates (auditoría 2026-08-10)
**Módulos destino:** Nomina, Mantenimiento, Cobranza, Operaciones, etc.
**Última revisión:** 2026-10-05 (corrección de ubicación — ningún documento vive dentro de `api/` ni `appsweb/angular/`; actualizado de 6 a 8 documentos)

---

## 📋 Qué Debe Hacer el Agente

El agente debe crear **EXACTAMENTE 8 documentos** por módulo (puede hacerse en PARALELO), **TODOS dentro de `docs/[ModuleLuxuryApp]/[Submodulo]/`**:

> 🔴 **REGLA CRÍTICA (2026-10-05):** ningún documento vive dentro de `api/` ni de `appsweb/angular/`, en ningún caso. Esos dos árboles son solo código. Toda la documentación, sin excepción, vive en `docs/`.

```
docs/[ModuleLuxuryApp]/[Submodulo]/
  1. README.md                      (Nivel 1 — antes backend)
  2. documentacion-[modulo].md      (Nivel 2 — antes backend)
  3. operativo.md                   (antes frontend)
  4. setup.md                       (antes frontend)
  5. decisiones.md                  (antes frontend)
  6. guia-usuario.md                (Nivel 3 — negocio, skill guia-usuario-modulo)
  7. YYYYMMDD-auditoria-[modulo]-[submodulo].md
  8. bitacora.md                    (🆕 desde el primer cambio de código real)
```

---

## 🎯 PROMPT PARA DELEGAR AL AGENTE

### Versión Ejecutiva (Para Sprint)

```markdown
# Tarea: Crear Documentación Completa de Módulo [MODULO_NAME]

**Objetivo:** Replicar estructura piloto de Candidates a [MODULO_NAME]

**Contexto:**
- Piloto: conventions/audit/ejemplo-auditoria-candidates.md
- Templates:
  - conventions/audit/audit-prompt-comprehensive.md (cómo auditar)
  - conventions/operations/module-documentation-instructions.md (CONVENTIONS.md §4.7)

**REGLA CRÍTICA:** TODOS los documentos van en `docs/[ModuleLuxuryApp]/[Submodulo]/`.
Ninguno dentro de `api/` ni `appsweb/angular/`. Estructura plana, sin subcarpetas.

**FASE 1: Auditoría Real (4h)**

Ejecutar auditoría exhaustiva de [MODULO_NAME]:

1. Leer conventions/audit/audit-prompt-comprehensive.md (contexto)

2. Analizar backend:
   - Entidades: api/LuxuryApp.Application/Modules/[ModuleLuxuryApp]/*/
   - Endpoints: buscar [Authorize], validaciones, transiciones
   - DTOs: validaciones presentes/faltantes
   - Servicios: lógica de negocio, pre-requisitos

3. Generar TABLAS REALES:
   - Matriz de permisos (endpoint × rol × autorización)
   - Validaciones front vs back
   - Errores de lógica (6 tipos de ejemplo-auditoria-candidates.md)
   - Flujos end-to-end (con diagramas ASCII o Archify)

4. Crear: docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo].md
   - Usar estructura de 20260810-auditoria-reclutamiento-candidatos.md
   - Incluir: Hallazgos reales (no teóricos), plan remediation

**FASE 2: Documentos Nivel 1 y 2 — contenido backend (2h)**

Crear 2 archivos (contenido backend, ubicación centralizada en docs/) según CONVENTIONS.md §4.7:

1. docs/[ModuleLuxuryApp]/[Submodulo]/README.md (Nivel 1)
   - Propósito funcional (2-3 párrafos)
   - Endpoints principales (tabla)
   - Actores y responsabilidades
   - Dependencias con otros módulos
   - Reglas de negocio principales (RN-MOD-*)
   - Estructura de carpetas
   - Validaciones principales
   - Permisos & seguridad
   - Referencias a CONVENTIONS.md
   - (Ver ejemplo: docs/RecruitmentLuxuryApp/Candidates/README.md)

2. docs/[ModuleLuxuryApp]/[Submodulo]/documentacion-[modulo].md (Nivel 2)
   - Resumen ejecutivo
   - Visión funcional
   - Arquitectura técnica (modelo de datos, enums, pipeline si aplica)
   - Endpoints documentados (3-5 principales con body/respuesta)
   - Flujos del sistema (diagramas ASCII o Archify)
   - Entidades & propiedades
   - Servicios & métodos clave (tabla)
   - Reglas de negocio en código
   - Base de datos (índices, relaciones)
   - Performance & caching
   - Checklist de validación
   - Historial de cambios (referenciar bitacora.md, no duplicar)
   - (Ver ejemplo: docs/RecruitmentLuxuryApp/Candidates/documentacion-candidates.md)

**FASE 3: Documentos Nivel 3 — contenido frontend (2h)**

Crear 3 archivos (contenido frontend, ubicación centralizada en docs/):

1. docs/[ModuleLuxuryApp]/[Submodulo]/operativo.md
   - Propósito del módulo
   - Rutas y URLs (tabla con localhost URLs)
   - Estructura de carpetas
   - Componentes principales (tabla)
   - Servicios (tabla con firmas)
   - Data flow diagram (ASCII)
   - Formularios (si aplica)
   - Estados/enums importantes
   - Smoke test (happy path completo)
   - Debugging tips
   - (Ver ejemplo: docs/RecruitmentLuxuryApp/Candidates/operativo.md)

2. docs/[ModuleLuxuryApp]/[Submodulo]/setup.md (Onboarding)
   - Para: Dev nuevo
   - Tiempo: 30 minutos
   - Pre-requisitos
   - Leer en orden (setup → README → decisiones → architecture)
   - Estructura memorizar
   - Primer cambio (walkthrough 5 pasos)
   - Backend reference paths
   - Debugging flowchart
   - 4 common mistakes
   - Git workflow
   - (Ver ejemplo: docs/RecruitmentLuxuryApp/Candidates/setup.md)

3. docs/[ModuleLuxuryApp]/[Submodulo]/decisiones.md (Matriz)
   - Para: Dev diario
   - Matriz: ¿Es visual? ¿Es lógica? ¿Dónde va?
   - 4-5 ejemplos concretos
   - Reglas irrompibles (tabla)
   - Checklist antes de crear archivo
   - Commands rápidos
   - Example flow completo
   - ¿Cuándo preguntar? (al tech lead)
   - (Ver ejemplo: docs/RecruitmentLuxuryApp/Candidates/decisiones.md)

**FASE 4: Guía de Usuario — Nivel 3 negocio (usar skill dedicada)**

Invocar la skill `guia-usuario-modulo` (.agents/skills/guia-usuario-modulo/SKILL.md).
No escribir a mano: combina lectura real de código, diagrama Archify con evidencia,
y exploración real de UI con playwright-cli (obligatoria).

Resultado: docs/[ModuleLuxuryApp]/[Submodulo]/guia-usuario.md

**FASE 5: Iniciar Bitácora (si el módulo ya tiene cambios de código en curso)**

Si el módulo ya tiene código ejecutándose/modificándose (no solo documentación):

Crear docs/[ModuleLuxuryApp]/[Submodulo]/bitacora.md con la primera entrada,
siguiendo la plantilla de CONVENTIONS.md §4.9. Si el módulo es puramente de
documentación (sin cambios de código todavía), este archivo se crea después,
en el momento en que se toque el primer archivo de código.

**FASE 6: Actualizar Memoria (15 min)**

1. Crear archivo memoria: memory/audit-[modulo]-YYYYMMDD.md
   - name: audit-[modulo]
   - description: [resumen del módulo auditoría]
   - Incluir: Hallazgos principales, RNs verificadas, plan remediation

2. Agregar línea al índice de memoria del usuario:
   ```
   - [Auditoría [Modulo] completada](audit-[modulo]-YYYYMMDD.md) — X hallazgos, Y RNs auditadas, plan remediación (YYYY-MM-DD)
   ```

**ENTREGABLES:**

✅ 1 archivo auditoría
✅ 2 archivos Nivel 1/2 (contenido backend)
✅ 3 archivos Nivel operativo/setup/decisiones (contenido frontend)
✅ 1 guía de usuario (Nivel 3, vía skill guia-usuario-modulo)
✅ 1 bitácora (si el módulo tiene código en ejecución)
✅ 1 memoria (si hay hallazgos críticos)

**TODOS en:** `docs/[ModuleLuxuryApp]/[Submodulo]/` — ninguno en `api/` ni `appsweb/angular/`.

**Referencia de Tamaños:**

- Auditoría: 400-600 líneas
- README (Nivel 1): 300-400 líneas
- Documentación técnica (Nivel 2): 500-700 líneas
- Operativo: 300-400 líneas
- Setup: 300-400 líneas
- Decisiones: 250-350 líneas
- Guía de Usuario: 200-400 líneas (generada por skill, no estimar a mano)

**Total: ~2,000-2,500 líneas de documentación por módulo**

**Tiempo Total:** 8-10 horas por módulo (ejecutable en paralelo si múltiples agentes)

**Criterios de Éxito:**

- [ ] Todos los documentos están dentro de `docs/[ModuleLuxuryApp]/[Submodulo]/` — ninguno en `api/` ni `appsweb/angular/`
- [ ] Auditoría identifica 3+ hallazgos reales (con línea de código)
- [ ] Matriz de permisos tiene ≥5 endpoints × ≥3 roles
- [ ] Documentación referencia CONVENTIONS.md §4.7
- [ ] Documentación de componentes tiene diagramas ASCII o Archify
- [ ] Setup.md tiene flowchart de debugging
- [ ] Decisiones.md tiene ≥4 ejemplos concretos
- [ ] Guía de usuario generada con skill `guia-usuario-modulo` (no escrita a mano)
- [ ] Si el módulo tiene código en ejecución, bitacora.md existe con ≥1 entrada
- [ ] Todos archivos tienen "Última revisión: YYYYMMDD"
- [ ] Referencias cruzadas entre archivos (README → setup → decisiones → guia-usuario)
```

---

## 📞 Si el Agente No Sabe Algo

**Si pregunta:** "¿Cómo se ve una buena auditoría?"
**Responde:** "Ve conventions/audit/ejemplo-auditoria-candidates.md - línea por línea es modelo"

**Si pregunta:** "¿Qué busco en el código?"
**Responde:** "Ve conventions/audit/audit-prompt-comprehensive.md Sección E - lista los 6 tipos de errores"

**Si pregunta:** "¿Qué documentación ya existe?"
**Responde:** "Verifica Glob: `docs/[ModuleLuxuryApp]/[Submodulo]/` — ahí viven los 8 documentos, no en api/ ni appsweb/angular/"

**Si pregunta:** "¿Parecido a Candidates?"
**Responde:** "SÍ - usa 20260810-auditoria-reclutamiento-candidatos.md como template de estructura/formato"

**Si pregunta:** "¿Por qué ya no van en api/ o appsweb/angular?"
**Responde:** "Regla CONVENTIONS.md §4.2/§4.7/§6ter (2026-10-05): esos dos árboles son solo código ejecutable; TODA documentación centralizada en docs/"

---

## 🎯 Orden de Prioridad Recomendado

**FASE 1 (Críticos):**
1. Nomina (RNs complejas de salarios)
2. Cobranza (flujos de pagos)
3. Mantenimiento (trabajos + órdenes)

**FASE 2 (Importantes):**
4. Operaciones (coordinación)
5. Recursos Humanos (empleados + permisos)
6. Admin (configuraciones)

**FASE 3 (Opcionales):**
7. Legal (documentos + contratos)
8. Reportes (análisis)

---

## 🔗 Plantillas & Referencia

**Archivos PLANTILLA (copiar estructura):**
- Auditoría: `docs/RecruitmentLuxuryApp/Candidates/20260813-auditoria-reclutamiento-candidatos.md`
- README (Nivel 1): `docs/RecruitmentLuxuryApp/Candidates/README.md`
- Documentación técnica (Nivel 2): `docs/RecruitmentLuxuryApp/Candidates/documentacion-candidates.md`
- Operativo: `docs/RecruitmentLuxuryApp/Candidates/operativo.md`
- Setup: `docs/RecruitmentLuxuryApp/Candidates/setup.md`
- Decisiones: `docs/RecruitmentLuxuryApp/Candidates/decisiones.md`

**Nota (2026-10-05):** los pilotos de Candidates arriba (README, documentacion,
operativo, setup, decisiones) aún no existen en esta ubicación corregida —
se crean al documentar ese módulo con esta guía. No copiar de versiones
antiguas que pudieran existir en `api/` o `appsweb/angular/`.

**Guías de auditoría:**
- `conventions/audit/audit-prompt-comprehensive.md` — Template completo
- `conventions/audit/audit-checklist-completo.md` — Checklist interactivo
- `conventions/audit/ejemplo-auditoria-candidates.md` — Ejemplo real paso a paso

**CONVENTIONS.md:**
- §4.7 (Documentación de Módulo Existente — 8 documentos obligatorios)
- §4.9 (Bitácora de Cambios)
- §6ter (Estructura y Ubicación de Documentos en docs/)

---

## ⚙️ Cómo Ejecutar (Por Agente)

### Opción A: Agente en Foreground

```bash
Agent {
  description: "Crear documentación completa módulo [MODULO]"
  subagent_type: "general-purpose" (o "Explore" para investigación)
  prompt: [usar PROMPT PARA DELEGAR AL AGENTE arriba]
  run_in_background: false
}
```

### Opción B: Agente en Background

```bash
Agent {
  description: "Crear documentación completa módulo [MODULO]"
  subagent_type: "general-purpose"
  prompt: [usar PROMPT PARA DELEGAR AL AGENTE arriba]
  run_in_background: true  # Notificación cuando termina
}
```

### Opción C: Múltiples Agentes en Paralelo

```bash
# Lanzar 3 agentes simultáneamente
Agent { modulo: Nomina, ... run_in_background: true }
Agent { modulo: Cobranza, ... run_in_background: true }
Agent { modulo: Mantenimiento, ... run_in_background: true }

# Esperar notificaciones de finalización
```

---

## ✅ Validación Post-Auditoría

Después que agente cree documentación, **VERIFICAR:**

```
ESTRUCTURA:
  [ ] ¿Existen 8 archivos, todos en docs/[ModuleLuxuryApp]/[Submodulo]/?
  [ ] ¿CERO documentos dentro de api/?
  [ ] ¿CERO documentos dentro de appsweb/angular/?
  [ ] ¿Sin subcarpetas adicionales dentro de [Submodulo]/?

CONTENIDO AUDITORÍA:
  [ ] ¿Hay matriz de RNs (Nivel 1-4)?
  [ ] ¿Hay matriz de permisos (endpoint × rol)?
  [ ] ¿Hay ≥3 hallazgos reales (no teóricos)?
  [ ] ¿Hay línea de código para cada hallazgo?
  [ ] ¿Hay plan de remediación prioritarizado?
  [ ] ¿Hay diagramas ASCII o Archify de flujos?

CONTENIDO DOCUMENTACIÓN:
  [ ] ¿Referencia a CONVENTIONS.md §4.7?
  [ ] ¿Tabla de endpoints con autorización?
  [ ] ¿Tabla de validaciones?
  [ ] ¿Modelo de datos documentado?
  [ ] ¿Setup.md tiene checklist de debugging?
  [ ] ¿Decisiones.md tiene ≥4 ejemplos?
  [ ] ¿Guía de usuario viene de la skill `guia-usuario-modulo` (no escrita a mano)?
  [ ] ¿Bitácora existe si el módulo tiene código en ejecución?

CALIDAD:
  [ ] ¿No hay COPY-PASTE ciego de Candidates?
  [ ] ¿Datos son específicos del módulo (no genéricos)?
  [ ] ¿Todas las líneas de código tienen contexto?
  [ ] ¿Última revisión es fecha de hoy?
```

---

**Usa esta guía para delegar a otro agente la documentación de cualquier módulo.**

**Tiempo esperado:** 8-10 horas por módulo (puede ser ≤4 horas si agente es eficiente)
