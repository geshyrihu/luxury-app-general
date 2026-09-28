# Guía de Delegación: Replicar Estructura de Documentación a Otros Módulos

**Propósito:** Instrucciones CLARAS para otro agente (no Claude Code) para replicar el piloto exitoso de Candidates a otros módulos.

**Fuente piloto:** Reclutamiento > Candidates (auditoría 2026-08-10)  
**Módulos destino:** Nomina, Mantenimiento, Cobranza, Operaciones, etc.

---

## 📋 Qué Debe Hacer el Agente

El agente debe crear **EXACTAMENTE 6 documentos** por módulo (puede hacerse en PARALELO):

```
BACKEND:
  1. api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/README.md
  2. api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/Docs/documentacion-[modulo].md

FRONTEND:
  3. client/angular/src/app/apps/[modulo].luxuryapp/docs/README.md
  4. client/angular/src/app/apps/[modulo].luxuryapp/docs/setup.md
  5. client/angular/src/app/apps/[modulo].luxuryapp/docs/decisiones.md

AUDITORÍA:
  6. docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo].md
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
  - conventions/operations/module-documentation-instructions.md (CONVENTIONS.md §4.5)

**FASE 1: Auditoría Real (4h)**

Ejecutar auditoría exhaustiva de [MODULO_NAME]:

1. Leer conventions/audit/audit-prompt-comprehensive.md (contexto)

2. Analizar backend:
   - Entidades: api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/*/
   - Endpoints: buscar [Authorize], validaciones, transiciones
   - DTOs: validaciones presentes/faltantes
   - Servicios: lógica de negocio, pre-requisitos

3. Generar TABLAS REALES:
   - Matriz de permisos (endpoint × rol × autorización)
   - Validaciones front vs back
   - Errores de lógica (6 tipos de ejemplo-auditoria-candidates.md)
   - Flujos end-to-end (con diagramas ASCII)

4. Crear: docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo].md
   - Usar estructura de 20260810-auditoria-reclutamiento-candidatos.md
   - Incluir: Hallazgos reales (no teóricos), plan remediation

**FASE 2: Documentos Backend (2h)**

Crear 2 archivos backend según CONVENTIONS.md §4.5:

1. api/.../[ModuleLuxuryApp]/README.md (Nivel 1)
   - Propósito funcional (2-3 párrafos)
   - Endpoints principales (tabla)
   - Actores y responsabilidades
   - Dependencias con otros módulos
   - Reglas de negocio principales (RN-MOD-*)
   - Estructura de carpetas
   - Validaciones principales
   - Permisos & seguridad
   - Referencias a CONVENTIONS.md
   - (Ver ejemplo: api/.../Candidates/README.md)

2. api/.../[ModuleLuxuryApp]/Docs/documentacion-[modulo].md (Nivel 2)
   - Resumen ejecutivo
   - Visión funcional
   - Arquitectura técnica (modelo de datos, enums, pipeline si aplica)
   - Endpoints documentados (3-5 principales con body/respuesta)
   - Flujos del sistema (diagramas ASCII)
   - Entidades & propiedades
   - Servicios & métodos clave (tabla)
   - Reglas de negocio en código
   - Base de datos (índices, relaciones)
   - Performance & caching
   - Checklist de validación
   - Historial de cambios
   - (Ver ejemplo: api/.../Candidates/Docs/documentacion-candidates.md)

**FASE 3: Documentos Frontend (2h)**

Crear 3 archivos frontend según estructura piloto:

1. client/angular/src/app/apps/[modulo].luxuryapp/docs/README.md (Operativo)
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
   - (Ver ejemplo: .../candidates/docs/README.md)

2. client/angular/src/app/apps/[modulo].luxuryapp/docs/setup.md (Onboarding)
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
   - (Ver ejemplo: .../candidates/docs/setup.md)

3. client/angular/src/app/apps/[modulo].luxuryapp/docs/decisiones.md (Matriz)
   - Para: Dev diario
   - Matriz: ¿Es visual? ¿Es lógica? ¿Dónde va?
   - 4-5 ejemplos concretos
   - Reglas irrompibles (tabla)
   - Checklist antes de crear archivo
   - Commands rápidos
   - Example flow completo
   - ¿Cuándo preguntar? (al tech lead)
   - (Ver ejemplo: .../candidates/docs/decisiones.md)

**FASE 4: Actualizar Memoria (15 min)**

1. Crear archivo memoria: memory/audit-[modulo]-20260810.md
   - name: audit-[modulo]
   - description: [resumen del módulo auditoría]
   - Incluir: Hallazgos principales, RNs verificadas, plan remediation
   
2. Agregar línea a C:\Users\geshyrihu\.claude\projects\d--repos-luxuryapp-api\memory\MEMORY.md:
   ```
   - [Auditoría [Modulo] completada](audit-[modulo]-20260810.md) — X hallazgos, Y RNs auditadas, plan remediación (2026-08-10)
   ```

**ENTREGABLES:**

✅ 1 archivo auditoría (docs/[ModuleLuxuryApp]/[Submodulo]/)
✅ 2 archivos backend (api/.../[Modulo]/README.md + Docs/documentacion-[modulo].md)
✅ 3 archivos frontend (client/angular/.../docs/{README, setup, decisiones}.md)
✅ 1 memoria (si hay hallazgos críticos)

**Referencia de Tamaños:**

- Auditoría: 400-600 líneas
- Backend README: 300-400 líneas
- Backend Documentación: 500-700 líneas
- Frontend README: 300-400 líneas
- Frontend Setup: 300-400 líneas
- Frontend Decisiones: 250-350 líneas

**Total: ~2,000-2,500 líneas de documentación por módulo**

**Tiempo Total:** 8-10 horas por módulo (ejecutable en paralelo si múltiples agentes)

**Criterios de Éxito:**

- [ ] Auditoría identifica 3+ hallazgos reales (con línea de código)
- [ ] Matriz de permisos tiene ≥5 endpoints × ≥3 roles
- [ ] Documentación backend referencia CONVENTIONS.md §4.5
- [ ] Documentación frontend tiene diagramas ASCII
- [ ] Setup.md tiene flowchart de debugging
- [ ] Decisiones.md tiene ≥4 ejemplos concretos
- [ ] Todos archivos tienen "Última revisión: YYYYMMDD"
- [ ] Referencias cruzadas entre archivos (README → setup → decisiones → architecture)
```

---

## 📞 Si el Agente No Sabe Algo

**Si pregunta:** "¿Cómo se ve una buena auditoría?"  
**Responde:** "Ve conventions/audit/ejemplo-auditoria-candidates.md - línea por línea es modelo"

**Si pregunta:** "¿Qué busco en el código?"  
**Responde:** "Ve conventions/audit/audit-prompt-comprehensive.md Sección E - lista los 6 tipos de errores"

**Si pregunta:** "¿Qué documentación ya existe?"  
**Responde:** "Verifica Glob: `docs/[ModuleLuxuryApp]/[Submodulo]/` y `api/.../[Modulo]/README.md`"

**Si pregunta:** "¿Parecido a Candidates?"  
**Responde:** "SÍ - usa 20260810-auditoria-reclutamiento-candidatos.md como template de estructura/formato"

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
- Auditoría: `docs/[ModuleLuxuryApp]/[Submodulo]/20260810-auditoria-reclutamiento-candidatos.md`
- Backend README: `api/.../Candidates/README.md`
- Backend Técnica: `api/.../Candidates/Docs/documentacion-candidates.md`
- Frontend README: `client/angular/.../candidates/docs/README.md`
- Frontend Setup: `client/angular/.../candidates/docs/setup.md`
- Frontend Decisiones: `client/angular/.../candidates/docs/decisiones.md`

**Guías de auditoría:**
- `conventions/audit/audit-prompt-comprehensive.md` — Template completo
- `conventions/audit/audit-checklist-completo.md` — Checklist interactivo
- `conventions/audit/ejemplo-auditoria-candidates.md` — Ejemplo real paso a paso

**CONVENTIONS.md:**
- §4.5 (Documentación, Remediación y Migración)
- §5.2 (Backend dominio)
- §5.8 (Auditoría)

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
  [ ] ¿Existen 6 archivos?
  [ ] ¿README backend está en api/.../[Modulo]/README.md?
  [ ] ¿Documentación técnica está en api/.../Modulo/Docs/?
  [ ] ¿Frontend docs están en client/angular/.../[modulo]/docs/?
  [ ] ¿Auditoría está en docs/[ModuleLuxuryApp]/[Submodulo]/?

CONTENIDO AUDITORÍA:
  [ ] ¿Hay matriz de RNs (Nivel 1-4)?
  [ ] ¿Hay matriz de permisos (endpoint × rol)?
  [ ] ¿Hay ≥3 hallazgos reales (no teóricos)?
  [ ] ¿Hay línea de código para cada hallazgo?
  [ ] ¿Hay plan de remediación prioritarizado?
  [ ] ¿Hay diagramas ASCII de flujos?

CONTENIDO DOCUMENTACIÓN:
  [ ] ¿Referencia a CONVENTIONS.md §4.5?
  [ ] ¿Tabla de endpoints con autorización?
  [ ] ¿Tabla de validaciones?
  [ ] ¿Modelo de datos documentado?
  [ ] ¿Setup.md tiene checklist de debugging?
  [ ] ¿Decisiones.md tiene ≥4 ejemplos?

CALIDAD:
  [ ] ¿No hay COPY-PASTE ciego de Candidates?
  [ ] ¿Datos son específicos del módulo (no genéricos)?
  [ ] ¿Todas las líneas de código tienen contexto?
  [ ] ¿Última revisión es fecha de hoy?
```

---

**Usa esta guía para delegar a otro agente la documentación de cualquier módulo.**

**Tiempo esperado:** 8-10 horas por módulo (puede ser ≤4 horas si agente es eficiente)

