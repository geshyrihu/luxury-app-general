# 🎯 Gobernanza de Convenciones LuxuryApp por Rol y Tecnología

**Propósito:** Estructurar CONVENTIONS.md de forma que cada rol de desarrollo tenga claridad sobre qué reglas aplican, cómo auditar su cumplimiento, y qué responsabilidades tiene.

---

## 📋 MAPEO ACTUAL: CONVENTIONS.md vs. Roles

### Análisis de Brecha

El archivo CONVENTIONS.md actual está organizado por **tecnología** (§1-18), pero **carece de**:
- ❌ Asignación explícita de RESPONSABLE POR SECCIÓN
- ❌ Criterios de auditoría automatizables
- ❌ Diferenciación clara entre requisitos por rol
- ❌ Niveles de severidad por rol (crítico para Frontend ≠ crítico para Backend)
- ❌ Roles especializados definidos explícitamente

---

## 🎭 ROLES IDENTIFICADOS EN EL PROYECTO

| Rol | Focus | Tecnologías Principales | Secciones CONVENTIONS Aplicables |
|-----|-------|----------|-----------|
| **Full Stack Developer** | Ciclo completo | Angular + .NET + SQL | §1-18, §19-22 |
| **Backend Developer** (.NET) | APIs, Logic, Data | .NET 10, EF Core, SQL Server/PostgreSQL | §1, §9, §16, §18 |
| **Tech Lead / Architect** | Design, Mentoring, Code Review | All | §1-22, §19-22 |
| **Enterprise Systems Engineer** | Integration, Legacy | .NET + SQL Server, Angular | §1, §9, §18 |

---

## 🔧 PROPUESTA: Estructura Mejorada de CONVENTIONS.md

### Opción 1: Mantener Estructura Actual + Agregar Metadata

**Método:** Cada sección §N tiene un bloque de metadata:

```markdown
## §N Nombre de Sección

### 📋 Metadata de Gobernanza

| Campo | Valor |
|-------|-------|
| **Roles Responsables** | Frontend Senior, Full Stack |
| **Severidad Audit** | 🔴 Crítica |
| **Automatización** | `npm run audit:ui` |
| **Revisor** | Tech Lead + Frontend Senior |

### Contenido de Reglas...
```

**Ventaja:** Mínimo cambio a CONVENTIONS.md actual.  
**Desventaja:** Aumenta verbosidad del archivo.

---

### Opción 2: Crear GOVERNANCE.md Separado (RECOMENDADO)

**Estructura nueva:**

```
CONVENTIONS.md (mantener intacto)
├── Reglas por tecnología (§1-22)

+ GOVERNANCE.md (NUEVO)
├── Matriz Roles × Secciones
├── Criterios de Auditoría por Rol
├── Escalación de Severidad
├── Responsables de Auditoría
└── Métricas de Cumplimiento
```

**Ventaja:** Separación clara (reglas vs. gobernanza).  
**Desventaja:** Requiere archivo nuevo + mantenimiento dual.

---

## 📊 MATRIZ: ROLES × SECCIONES × AUDITORÍA

### **Full Stack Developer**

| Sección | Reglas | Auditor | Severidad | Criterio de Paso |
|---------|--------|---------|-----------|-----------------|
| §2 (Angular) | 1-18 | Frontend Senior | 🔴 Crítica | 0 `any`, 100% OnPush, standalone |
| §4 (API Access) | All | Tech Lead | 🔴 Crítica | ApiResponseService en 100%, rutas exactas |
| §7 (Nombrado) | All | Code Review | 🟠 Alta | Kebab-case, `interfaces/`, sin `models/` |
| §9 (Backend) | 1-18 | Backend Lead | 🔴 Crítica | Minimal APIs, Dto suffix, camelCase query |
| §15 (Responsive) | All | UX Lead | 🟠 Alta | Mobile componentes implementados |
| §16 (Testing) | 1-6 | QA Lead | 🟡 Media | 70%+ cobertura en servicios |

### **Frontend Senior / Especialista UI**

| Sección | Reglas | Auditor | Severidad | Criterio de Paso |
|---------|--------|---------|-----------|-----------------|
| §2 (Angular) | 1-18 | Frontend Lead | 🔴 Crítica | `strict: true`, OnPush, Signals |
| §5 (Componentes) | All | Catálogo UI | 🔴 Crítica | Usar `@ui/*`, auditar con `npm run audit:ui` |
| §6 (Wrappers) | All | Architecture | 🟠 Alta | Sufijo `-wrapper`, estructura estándar |
| §7 (Nombrado) | All | Code Review | 🟠 Alta | Consistencia triple (file/class/selector) |
| §8 (Botones) | All | UX Lead | 🟡 Media | Usar `iw-*`, `il-*`, `ili-*` según contexto |
| §15 (Responsive) | All | Mobile Lead | 🟠 Alta | 3 breakpoints (375px, 768px, 1280px) |

### **Mobile Developer (Ionic)**

| Sección | Reglas | Auditor | Severidad | Criterio de Paso |
|---------|--------|---------|-----------|-----------------|
| §2.8 (Mobile) | All | Mobile Lead | 🔴 Crítica | Componente móvil en cada CRUD |
| §13 (Flutter) | 1-8 | Mobile Architect | 🔴 Crítica | sealed, Riverpod/signals, AOT JSON |
| §15.4-15.9 (Mobile UX) | All | UX Lead | 🟠 Alta | Thumb zone, ion-infinite-scroll, 44×44px targets |
| §3 (Ionic rules) | All | Design System | 🟠 Alta | `ion-list`, `ion-item-sliding`, sin DynamicDialog |

### **Backend Developer (.NET)**

| Sección | Reglas | Auditor | Severidad | Criterio de Paso |
|---------|--------|---------|-----------|-----------------|
| §1 (Stack) | All | Architect | 🟠 Alta | Minimal APIs, EF Core 10, AOT ready |
| §9 (Backend) | 1-18 | Backend Lead | 🔴 Crítica | Primary Constructors, Source Generators, Nullable disabled |
| §16 (Testing) | 1-6 | QA Lead | 🟡 Media | xUnit, FluentAssertions, InMemory DB |
| §18 (Infraestructura) | 1-4 | DevOps | 🟠 Alta | 3-layer file system, Vault security |
| §9 (Paginación) | All | Backend Lead | 🔴 Crítica | PaginationCommonDTO, BindAsync, 200 limit |

### **Tech Lead / Architect**

| Sección | Reglas | Auditor | Severidad | Criterio de Paso |
|---------|--------|---------|-----------|-----------------|
| §1 (Architecture) | All | CTO | 🔴 Crítica | Decisiones documentadas, Mermaid diagrams |
| §14 (Apps Organization) | All | Architecture | 🔴 Crítica | Nombres consistentes cross-app, grep-able |
| §19-22 (Operacional) | All | Tech Lead | 🟠 Alta | Audits completas, planes ejecutables |

---

## 🔍 CRITERIOS DE AUDITORÍA AUTOMATIZABLES POR ROL

### **Frontend Senior**

```bash
# Command: npm run audit:frontend

✅ Verificaciones:
□ 100% strict: true en tsconfig
  Verificar: grep "strict.*true" appsweb/angular/tsconfig.json
□ 100% ChangeDetectionStrategy.OnPush
  Comando: grep -c "OnPush" appsweb/angular/src/app/modules/**/*.ts
□ Cero `any` en typings
  Comando: grep -r " any" appsweb/angular/src --include="*.ts" | grep -v "// any"
□ Cero *ngIf, *ngFor (usar @if/@for)
  Comando: grep -r "\*ngIf\|\*ngFor" appsweb/angular/src/app/modules
□ Validar estructura de wrappers (-wrapper suffix)
  Comando: find appsweb/angular/src/app/modules -name "*wrapper.ts"
```

### **Backend Developer**

```bash
# Command: dotnet run audit:backend

✅ Verificaciones:
□ Cero `new HttpClient()` - usar IHttpClientFactory
  Comando: grep -r "new HttpClient" api/LuxuryApp.*
□ Cero AutoMapper (prohibido globalmente)
  Comando: grep -r "AutoMapper\|IMapper" api/LuxuryApp.Application
□ 100% Primary Constructors
  Comando: Check syntax in each service/controller
□ Cero DateTime.UtcNow - usar TimeProvider
  Comando: grep -r "DateTime.UtcNow" api/LuxuryApp.*
□ Cero ApiResponseDTO missing
  Comando: grep -r "return .*;" api/LuxuryApp.Api | grep -v "ApiResponseDTO"
□ Paginación: PaginationCommonDTO, BindAsync
  Comando: grep -r "AsParameters\|PaginationCommonDTO" api/LuxuryApp.Application
```

### **Mobile Developer**

```bash
# Command: flutter analyze + lint

✅ Verificaciones:
□ Cero imports `material/cupertino` directo
  Verificar en análisis estático
□ 100% null-safe (! → ?)
  Comando: dart analyze --fatal-infos
□ Cero `setState` (usar Signals/Riverpod)
  Grep en source Dart
□ Estructura de carpetas: interfaces/ (no models/)
  Verificar ls app/feature/interfaces/
□ Cero `dynamic` sin tipo
  Comandoanalysis_options.yaml strict
```

---

## 📈 MATRIZ DE SEVERIDAD POR ROL

La misma regla puede ser **crítica para un rol** pero **media para otro**:

| Regla | Full Stack | Frontend | Backend | Mobile | Architect |
|-------|-----------|----------|---------|--------|-----------|
| Strict: true | 🔴 CRÍTICA | 🔴 CRÍTICA | 🟡 MEDIA | 🔴 CRÍTICA | 🟠 ALTA |
| Minimal APIs | 🟠 ALTA | 🔵 N/A | 🔴 CRÍTICA | 🔵 N/A | 🔴 CRÍTICA |
| Ionic mobile component | 🟠 ALTA | 🔴 CRÍTICA | 🔵 N/A | 🔴 CRÍTICA | 🟠 ALTA |
| SQL indexing | 🟡 MEDIA | 🔵 N/A | 🔴 CRÍTICA | 🔵 N/A | 🟠 ALTA |

---

## 🎯 PROPUESTA DE MEJORA: GOVERNANCE.md

Crear archivo nuevo: `docs/GOVERNANCE.md` con:

### 1. Matriz Rol × Sección

```markdown
## Matriz de Responsabilidades

| Sección | Full Stack | Frontend | Backend | Mobile | Architect |
|---------|-----------|----------|---------|--------|-----------|
| §2 Angular | ✅ Crítica | ✅ Crítica | ⚠️ Media | ✅ Crítica | ⚠️ Media |
| §9 Backend | ✅ Crítica | ⚠️ Media | ✅ Crítica | ❌ N/A | ✅ Crítica |
```

### 2. Criterios de Auditoría Ejecutables

```markdown
## Auditoría de Cumplimiento

### Frontend Senior - Auditoría §2, §3, §5, §7

**Comando:** `npm run audit:frontend`

**Criterios de Paso:**
- [ ] Cero `any` en TypeScript → 100% pass
- [ ] Cero `*ngIf`/`*ngFor` → 100% pass
- [ ] 100% OnPush → 100% pass
```

### 3. Escalación y Severidad

```markdown
## Matriz de Severidad por Rol

Cuando una regla se incumple:

**🔴 CRÍTICA** (bloquea merge)
- Reportar a: Tech Lead
- Escalación: Immediata
- Reversión: Si/No

**🟠 ALTA** (bloquea merge si patrón)
- Reportar a: Reviewer del área
- Escalación: En próxima sprint

**🟡 MEDIA** (comentario en PR)
- Reportar a: Author
- Escalación: Backlog técnico
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### Fase 1: Crear GOVERNANCE.md (1 hora)

- [ ] Crear `docs/GOVERNANCE.md`
- [ ] Mapear Roles × Secciones
- [ ] Listar criterios de auditoría por rol

### Fase 2: Actualizar CONVENTIONS.md (2 horas)

- [ ] Agregar metadata a cada sección:
  ```markdown
  ## §N Nombre
  **Roles:** Frontend, Full Stack  
  **Auditor:** Frontend Lead  
  **Severidad:** 🔴 Crítica  
  ```

### Fase 3: Crear Scripts de Auditoría (3 horas)

- [ ] `npm run audit:frontend` (grep + linter)
- [ ] `dotnet audit:backend` (Roslyn analyzers)
- [ ] `flutter analyze` (actualizar rules)

### Fase 4: Integrar en Git Hooks (2 horas)

- [ ] Pre-commit: auditoría rápida por rama
- [ ] Pre-push: auditoría completa
- [ ] CI/CD: Bloquear si incumplimiento crítico

---

## 💡 BENEFICIOS DE ESTA GOBERNANZA

| Beneficio | Cómo lo logra |
|-----------|---------------|
| **Claridad de roles** | Cada rol sabe exactamente qué debe cumplir |
| **Auditoría profesional** | Criterios claros, verificables, automatizables |
| **Escalación correcta** | Severidad ajustada por rol, no genérica |
| **Mentoring facilitado** | Tech Lead tiene marco para onboarding |
| **Code reviews más rápidas** | Revisor sabe qué checklist aplicar por rama/autor |
| **Deuda técnica rastreable** | Incumplimientos registrados por rol/sección |

---

**Próximo paso:** ¿Creamos GOVERNANCE.md y actualizamos CONVENTIONS.md con metadata?

