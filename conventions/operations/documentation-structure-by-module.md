# Documentation Structure: Descentralized by Module

> ⚠️ **SUPERADO (2026-09-16):** La estructura propuesta aquí (centralizada por tipo de reporte: `reporte_maestro/`, `plans/`, `guides/`) fue **reemplazada** por la regla `CONVENTIONS.md` §6ter: estructura plana por módulo/submódulo `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-[tipo]-[modulo]-[submodulo].md`, cero subcarpetas adicionales. Este documento queda solo como antecedente histórico; no usar como autoridad.

**Última revisión:** 2026-08-06  
**Derivado de:** User request para reorganizar docs  
**Severidad:** 🟠 ALTA — Cambio de arquitectura de documentación

---

## Problema Actual

```
docs/
├── reporte_maestro/
│   ├── modulos/
│   │   ├── YYYYMMDD-auditoria-cobranza.md
│   │   ├── YYYYMMDD-auditoria-nomina.md
│   │   ├── YYYYMMDD-auditoria-mantenimiento.md
│   │   └── ... (200+ archivos)
├── analisis/
│   ├── YYYYMMDD-analisis-cobranza.md
│   └── ... (200+ archivos)
└── plans/
    ├── YYYYMMDD-cobranza-plan.md
    └── ... (200+ archivos)

Problemas:
❌ Documentación a 10 carpetas de distancia del código
❌ Imposible encontrar qué documentos pertenecen a qué módulo
❌ Centralización causa contención (todos escriben en mismo folder)
❌ Escalabilidad: 200+ módulos = caos
❌ Historial de auditorías mezclado
❌ Responsabilidad difusa
```

---

## Solución Propuesta: Descentralizado por Módulo

### Estructura Nueva

```
appsweb/angular/src/app/modules/
├── cobranza.luxuryapp/
│   ├── src/
│   │   └── ... (código)
│   └── docs/
│       ├── README.md (overview del módulo)
│       ├── plan/
│       │   ├── 20260801-implementacion-cobranza-plan.md
│       │   └── 20260815-refactoring-dashboard-plan.md
│       ├── analisis/
│       │   ├── 20260725-analisis-requisitos.md
│       │   ├── 20260730-analisis-impacto-db.md
│       │   └── 20260801-data-model.md
│       ├── auditoria/
│       │   ├── 20260801-auditoria-modulo-YYYYMMDD.md
│       │   ├── 20260815-auditoria-security.md
│       │   └── historial/
│       │       ├── 20260710-auditoria-v1.md
│       │       └── 20260725-auditoria-v2.md
│       └── arquitectura/
│           ├── diagrama-flujos.md
│           ├── db-schema.md
│           └── integraciones.md

├── nomina.luxuryapp/
│   ├── src/
│   └── docs/
│       ├── README.md
│       ├── plan/
│       ├── analisis/
│       ├── auditoria/
│       └── arquitectura/

└── ... (otros módulos)

api/
├── LuxuryApp.Application/Modules/
│   ├── CobranzaLuxuryApp/
│   │   ├── (código)
│   │   └── docs/
│   │       ├── README.md
│   │       ├── plan/
│   │       ├── analisis/
│   │       ├── auditoria/
│   │       └── arquitectura/
│   └── ... (otros módulos)
```

---

## Estructura Detallada por Módulo

### 1. `[module]/docs/README.md` (Descripción General)

```markdown
# Módulo: Cobranza Online

**Versión:** 2.1.0  
**Última actualización:** 2026-08-06  
**Responsables:** [Team Lead], [Tech Lead]

## Descripción
Módulo responsable de cobros, seguimiento y reportes de cobranza.

## Ubicación del Código
- Backend: `api/LuxuryApp.Application/Modules/CobranzaLuxuryApp/`
- Frontend: `appsweb/angular/src/app/modules/cobranza.luxuryapp/`

## Documentación
- [Plan de Implementación](plan/)
- [Análisis y Diseño](analisis/)
- [Auditorías](auditoria/)
- [Arquitectura](arquitectura/)

## Contacto
- Tech Lead: @nombre
- PR Reviews: @nombre, @nombre

## Status
- Backend: ✅ Estable (v2.1)
- Frontend: ✅ Estable (v2.1)
- Tests: ✅ Coverage 78%
```

### 2. `[module]/docs/plan/` — Planes de Trabajo

```
plan/
├── 20260801-implementacion-cobranza-plan.md
│   └── Fases 1-4 de implementación
├── 20260815-refactoring-dashboard-plan.md
│   └── Refactor del dashboard (2 semanas)
└── README.md (índice de planes vigentes)
```

**Contenido:** Planes que SÍ se ejecutarán (vigentes)

### 3. `[module]/docs/analisis/` — Análisis y Diseño

```
analisis/
├── 20260725-analisis-requisitos.md
│   └── Requerimientos de cobranza online
├── 20260730-analisis-impacto-db.md
│   └── Impacto en esquema de BD
├── 20260801-data-model.md
│   └── Modelo de datos
├── 20260801-api-design.md
│   └── Diseño de endpoints REST
└── README.md (índice de análisis vigentes)
```

**Contenido:** Análisis técnicos, diseño de datos, impacto

### 4. `[module]/docs/auditoria/` — Auditorías y Verificaciones

```
auditoria/
├── 20260801-auditoria-modulo-YYYYMMDD.md
│   └── Auditoría integral completa (20 capas)
├── 20260815-auditoria-security.md
│   └── Auditoría de seguridad
├── 20260820-auditoria-performance.md
│   └── Auditoría de performance
├── historial/
│   ├── 20260710-auditoria-v1.md (anterior)
│   ├── 20260725-auditoria-v2.md (anterior)
│   └── README.md (versiones históricas)
└── README.md (auditorías vigentes)
```

**Contenido:** Auditorías completas (20 capas), checklists, hallazgos

### 5. `[module]/docs/arquitectura/` — Documentación Técnica

```
arquitectura/
├── README.md (índice)
├── diagrama-flujos.md (mermaid diagrams)
├── db-schema.md (modelo de datos visual)
├── api-endpoints.md (catálogo de endpoints)
├── services.md (servicios disponibles)
├── validaciones.md (reglas de validación)
└── integraciones.md (integraciones con otros módulos)
```

**Contenido:** Documentación técnica detallada (permanente)

---

## Comparativa: Antes vs Después

| Aspecto | Antes (Centralizado) | Después (Descentralizado) |
|--------|---------------------|--------------------------|
| **Ubicación docs** | 10 carpetas de distancia | Junto al código |
| **Escalabilidad** | ❌ Caos con 200+ módulos | ✅ Cada módulo es autónomo |
| **Descubrimiento** | ❌ Difícil encontrar docs | ✅ Look en `[module]/docs/` |
| **Responsabilidad** | ❌ Difusa | ✅ Equipo del módulo |
| **Historial** | ❌ Mezclado | ✅ `historial/` subfolder |
| **Versionamiento** | ❌ Sin versiones claras | ✅ Por timestamp, módulo versiona |
| **Limpieza** | ❌ Folder cresce infinito | ✅ Archivos viejos → historial |
| **CI/CD** | ❌ Busca en múltiples lugares | ✅ `[module]/docs/auditoria/` fijo |

---

## Plan de Migración

### FASE 1: Crear Estructura Nueva (Sin Mover Nada)

```bash
# Para cada módulo, crear estructura
for module in cobranza mantenimiento nomina recursos-humanos legal operations admin
do
  mkdir -p appsweb/angular/src/app/modules/$module.luxuryapp/docs/plan
  mkdir -p appsweb/angular/src/app/modules/$module.luxuryapp/docs/analisis
  mkdir -p appsweb/angular/src/app/modules/$module.luxuryapp/docs/auditoria/historial
  mkdir -p appsweb/angular/src/app/modules/$module.luxuryapp/docs/arquitectura
  
  # Crear README.md vacío
  touch appsweb/angular/src/app/modules/$module.luxuryapp/docs/README.md
done
```

### FASE 2: Mover Documentos de Módulo

```bash
# Ejemplo: Cobranza
mv docs/reporte_maestro/modulos/*cobranza* \
  appsweb/angular/src/app/modules/cobranza.luxuryapp/docs/auditoria/

mv docs/plans/*cobranza* \
  appsweb/angular/src/app/modules/cobranza.luxuryapp/docs/plan/

mv docs/analisis/*cobranza* \
  appsweb/angular/src/app/modules/cobranza.luxuryapp/docs/analisis/
```

### FASE 3: Crear Índices en docs/reporte_maestro/

```
docs/reporte_maestro/
├── README.md (índice de dónde encontrar qué)
├── por-modulo/ → symlinks a [module]/docs/auditoria/
└── por-fecha/ → índice cronológico (búsqueda rápida)
```

### FASE 4: Actualizar CONVENTIONS.md

Nueva sección en workflow por módulo:
```
Documentación de Módulo:
- [module]/docs/README.md — Overview
- [module]/docs/plan/ — Planes vigentes
- [module]/docs/analisis/ — Análisis técnico
- [module]/docs/auditoria/ — Auditorías y checklists
- [module]/docs/arquitectura/ — Documentación técnica
```

---

## Nuevas Rutas de Búsqueda

### Para encontrar documentación de un módulo:

```bash
# TODO: ¿Cuál es el plan para Cobranza?
ls -la appsweb/angular/src/app/modules/cobranza.luxuryapp/docs/plan/

# TODO: ¿Cuál es la última auditoría?
ls -la appsweb/angular/src/app/modules/cobranza.luxuryapp/docs/auditoria/

# TODO: ¿Cuál fue la v1 de auditoría?
ls -la appsweb/angular/src/app/modules/cobranza.luxuryapp/docs/auditoria/historial/

# TODO: ¿Qué módulos necesitan auditoría?
find . -path "*/apps/*/docs/auditoria/" -type d | \
  while read dir; do
    if [ ! -f "$dir/20260801-*.md" ]; then
      echo "NEEDS AUDIT: $(dirname $dir)"
    fi
  done
```

---

## CI/CD Integration

### Pre-commit Hook

```bash
# Validar que módulo modificado tiene docs actualizadas
git diff --name-only --diff-filter=M | grep -E "apps/[^/]+/src/" | \
  while read file; do
    module=$(echo "$file" | cut -d/ -f5)
    audit_date=$(find appsweb/angular/src/app/modules/$module/docs/auditoria -name "*.md" -type f | \
      sort | tail -1 | xargs -I {} stat -f %Sm -t "%Y%m%d" {})
    
    if [ $(date +%Y%m%d) -gt $((audit_date + 30)) ]; then
      echo "WARNING: $module needs audit (older than 30 days)"
    fi
  done
```

### CI Pipeline

```yaml
# .github/workflows/module-docs.yml
name: Module Documentation Check

on: [pull_request]

jobs:
  docs-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check module docs structure
        run: |
          for module in $(find appsweb/angular/src/app/modules -maxdepth 1 -type d -name "*.luxuryapp")
          do
            [ -d "$module/docs/plan" ] || echo "MISSING: $module/docs/plan"
            [ -d "$module/docs/analisis" ] || echo "MISSING: $module/docs/analisis"
            [ -d "$module/docs/auditoria" ] || echo "MISSING: $module/docs/auditoria"
            [ -f "$module/docs/README.md" ] || echo "MISSING: $module/docs/README.md"
          done
```

---

## Estructura Recomendada para Backend

```
api/LuxuryApp.Application/Modules/
├── CobranzaLuxuryApp/
│   ├── (código C#)
│   └── docs/
│       ├── README.md
│       ├── plan/
│       │   └── 20260801-migracion-minimal-api-plan.md
│       ├── analisis/
│       │   ├── 20260725-dto-design.md
│       │   └── 20260801-validation-rules.md
│       ├── auditoria/
│       │   ├── 20260801-auditoria-modulo.md
│       │   └── historial/
│       └── arquitectura/
│           ├── README.md
│           ├── endpoints.md
│           ├── db-schema.md
│           └── validaciones.md
```

---

## Beneficios Inmediatos

| Beneficio | Impacto |
|-----------|--------|
| **Escalabilidad** | Maneja 200+ módulos sin caos |
| **Propiedad clara** | Equipo sabe dónde poner docs |
| **Descubrimiento** | Nuevo dev: "Lee [module]/docs/" |
| **Versionamiento** | Cada módulo tiene historial propio |
| **CI/CD** | Rutas predecibles para auditar |
| **Mantenibilidad** | Docs viejas se archivan en historial/ |
| **Búsqueda** | `grep -r "regla" */docs/` funciona |

---

## Línea de Tiempo

- **Semana 1:** Crear estructura nueva (0 movimientos)
- **Semana 2-4:** Mover documentos por módulo (fase, no big bang)
- **Semana 5:** Crear índices en docs/reporte_maestro/
- **Semana 6:** Actualizar CONVENTIONS.md
- **Semana 7:** Entrenar equipos

---

## Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Orden de Lectura](../CONVENTIONS.md#4-orden-de-lectura-obligatorio-por-tipo-de-tarea)
- [Module Documentation Catalog](../catalogs/module-documentation-catalog.md) — Índice central (TODO)
- [CI/CD Documentation Checks](../operations/ci-cd-documentation-checks.md) — Validaciones automáticas (TODO)

---

**Última actualización:** 2026-08-06  
**Status:** 🟡 PROPUESTA (aguardando aprobación)  
**Impacto:** Reorganización completa de docs → escalabilidad para 200+ módulos
