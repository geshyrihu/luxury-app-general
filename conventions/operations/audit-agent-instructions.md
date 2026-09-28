# 🤖 Instrucciones para Agentes de IA: Auditoría de Módulos

**Destino:** Claude (operativo, paso a paso)  
**Propósito:** Guía de ejecución específica para Claude — cómo implementar el protocolo con comandos y criterios exactos

---

## 📖 RELACIÓN CON PROTOCOLO CONCEPTUAL

**Lectura Previa Obligatoria:** [`conventions/AGENT_AUDIT_PROTOCOL.md`](../../conventions/AGENT_AUDIT_PROTOCOL.md)

| Documento | Rol | Contenido |
|---|---|---|
| **AGENT_AUDIT_PROTOCOL.md** | Conceptual + Reutilizable | QUÉ hacer: 5 pasos, REGLA DE ORO, 20 capas, FASE 0, Plan integrado |
| **AUDIT_AGENT_INSTRUCTIONS.md** (este) | Operativo + Específico de Claude | CÓMO hacerlo: comandos bash, criterios PASO verificables, fases 1-2 |

**Flujo correcto:**
1. Leer PROTOCOLO (15 min) → Entender qué es auditoría de 20 capas
2. Leer INSTRUCCIONES (30 min) → Entender PHASE 1 y PHASE 2 específicas
3. Ejecutar exactamente como dicen las instrucciones

> ⚠️ **SIN EXCEPCIONES, SIN OPCIONES, SIN PREGUNTAS SOBRE "¿HAGO A O B?"**

---

## 📋 FLUJO DE EJECUCIÓN

```
INPUT: 
  - frontend_path: string (ej: client/angular/src/app/apps/cobranza.luxuryapp/)
  - backend_path: string (ej: api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/)

PRE-REQUISITOS:
  - Revisar IMPLEMENTATION_CHECKLIST.md (disponibilidad de dependencias)
  - Revisar AVAILABLE_FEATURES.md (características realmente disponibles en .NET 10 / Angular 22)

EJECUTAR:
  1. PHASE_1_QUICK_CHECK (15 min) → OUTPUT: tabla de brechas
  2. PHASE_2_DEEP_AUDIT (2-4 horas) → OUTPUT: reporte completo .md

GUARDAR:
  - docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo].md
```

---

## ⚡ PHASE 1: QUICK CHECK (15 min)

### OBJETIVO
Identificar brechas principales rápidamente. OUTPUT: tabla de cumplimiento.

### STEP 1.1: Verificar FRONTEND - Estructura

**BUSCAR:**
```bash
# Standalone components
grep -r "standalone: true" {frontend_path}

# NgModule files (NO deben existir)
find {frontend_path} -name "*.module.ts" -type f

# Wrapper pattern
find {frontend_path} -name "*-wrapper.ts" -type f
```

**REGISTRAR:**
- [ ] Componentes totales en {frontend_path}
- [ ] % con standalone: true
- [ ] Módulos encontrados (0 esperado)
- [ ] Wrappers encontrados (≥1 esperado)

**CRITERIO DE PASO:** ✓ si (standalone ≈100% Y modules=0 Y wrappers≥1)

---

### STEP 1.2: Verificar FRONTEND - Signals & State

**BUSCAR:**
```bash
# BehaviorSubject (NO deben existir)
grep -r "BehaviorSubject" {frontend_path}

# Signal, computed, effect (DEBEN existir)
grep -r "signal(\|computed(\|effect(" {frontend_path}

# @Input, @Output, @ViewChild (NO deben existir)
grep -r "@Input\|@Output\|@ViewChild" {frontend_path}
```

**REGISTRAR:**
- [ ] BehaviorSubject encontrados (contar)
- [ ] Signal/computed/effect encontrados (contar)
- [ ] @Input/@Output/@ViewChild encontrados (contar)

**CRITERIO DE PASO:** ✓ si (BehaviorSubject=0 Y signals>0 Y decoradores=0)

---

### STEP 1.3: Verificar FRONTEND - Templates

**BUSCAR:**
```bash
# Old control flow (*ngIf, *ngFor)
grep -r "\*ngIf\|\*ngFor\|\*ngSwitch" {frontend_path}

# New control flow (@if, @for)
grep -r "@if\|@for\|@switch" {frontend_path}
```

**REGISTRAR:**
- [ ] *ngIf, *ngFor, *ngSwitch encontrados (contar)
- [ ] @if, @for, @switch encontrados (contar)

**CRITERIO DE PASO:** ✓ si (old_flow=0 Y new_flow>0)

---

### STEP 1.4: Verificar FRONTEND - API Access

**BUSCAR:**
```bash
# ApiResponseService usage
grep -r "ApiResponseService" {frontend_path}

# HttpClient directo (NO debe existir)
grep -r "HttpClient" {frontend_path}

# *-api.service.ts files (NO deben existir)
find {frontend_path} -name "*-api.service.ts"
```

**REGISTRAR:**
- [ ] ApiResponseService usages (contar)
- [ ] HttpClient directo (contar, esperado: 0)
- [ ] *-api.service.ts files (contar, esperado: 0)

**CRITERIO DE PASO:** ✓ si (ApiResponseService>0 Y HttpClient=0 Y api_services=0)

---

### STEP 1.5: Verificar BACKEND - Minimal APIs

**BUSCAR:**
```bash
# ApiController classes (NO deben existir)
grep -r "ApiController\|ControllerBase" {backend_path}

# IEndpointModule implementations
grep -r "IEndpointModule" {backend_path}

# MapEndpoints method
grep -r "MapEndpoints" {backend_path}
```

**REGISTRAR:**
- [ ] ApiController clases (contar, esperado: 0)
- [ ] IEndpointModule implementaciones (contar)
- [ ] MapEndpoints métodos (contar)

**CRITERIO DE PASO:** ✓ si (ApiController=0 Y IEndpointModule≥1)

---

### STEP 1.6: Verificar BACKEND - Endpoint Nomenclatura

**BUSCAR:**
```bash
# Buscar en archivos que implementan MapEndpoints
grep -r "MapGroup\|MapGet\|MapPost\|MapPut\|MapDelete" {backend_path}

# Extraer rutas
# Formato esperado: /api/resource-name/ (kebab-case minúsculas)
# NO esperado: /api/ResourceName/ (PascalCase)
```

**REGISTRAR:**
- [ ] Endpoints en kebab-case (contar)
- [ ] Endpoints en PascalCase (contar, list them)
- [ ] Endpoints sin prefijo /api/ (contar, list them)
- [ ] Endpoints con recursos en singular vs plural (list mismatches)

**CRITERIO DE PASO:** ✓ si (kebab-case≈100% Y api-prefix=100% Y plural=100%)

---

### STEP 1.7: Verificar BACKEND - DTOs

**BUSCAR:**
```bash
# DTOs in Contracts/
find {backend_path} -path "*/Contracts/DTOs/*" -name "*.cs"

# Validators existence
find {backend_path} -name "*Validator.cs"
```

**REGISTRAR:**
- [ ] DTOs encontrados (contar)
- [ ] DTOs en carpeta Contracts/DTOs (contar)
- [ ] Validators encontrados (contar)
- [ ] DTOs sin validator (list them)

**CRITERIO DE PASO:** ✓ si (DTOs_in_Contracts≈100% Y Validators≥80%)

---

### STEP 1.8: Verificar BACKEND - SELECTs (Centralización Obligatoria)

**REGLA CRÍTICA:** Todos los SELECTs de enums/valores DEBEN venir de único endpoint:
- ✅ `SharedLuxuryApp/Endpoints/SelectItemEnumEndPoints.cs`
- ❌ NUNCA crear SelectItem endpoints en módulos individuales

**BUSCAR:**

```bash
# Verificar que NO existen endpoints SelectItem fuera de SharedLuxuryApp
find {backend_path} -name "*SelectItem*.cs" -not -path "*/SharedLuxuryApp/*"
# Esperado: 0 resultados (VIOLACIÓN si encuentra algo)

# Verificar que SelectItemEnumEndPoints es único
grep -r "SelectItemEnumEndPoints" {backend_path}
# Esperado: 1 resultado (en SharedLuxuryApp)

# Buscar queries directas a enums (PROHIBIDO)
grep -r "\.ToSelectList\|\.ToSelectItemDTO" {backend_path} | grep -v "SelectItemEnumEndPoints"
# Esperado: 0 resultados
```

**BÚSQUEDA 4: Verificar DisplayName en enums (REGLA CRÍTICA)**

```bash
# Buscar todos los enums que son usados en SelectItemEnumEndPoints
grep -r "\[Display(Name" {backend_path} --include="*.cs" | grep -i enum

# Contar enums SANS DisplayName (PROHIBIDO)
find {backend_path} -name "*Enum.cs" -o -name "*Type.cs" | while read f; do
  if ! grep -q "\[Display(Name" "$f"; then
    echo "❌ Sin DisplayName: $f"
  fi
done
```

**REGISTRAR:**
- [ ] SelectItem endpoints en módulos (esperado: 0) - **CRÍTICA si >0**
- [ ] SelectItemEnumEndPoints existe en SharedLuxuryApp - **CRÍTICA si no**
- [ ] Queries directas a enums fuera de centralizado (esperado: 0) - **ALTA si existe**
- [ ] Enums tienen [Display(Name="...")] en español (esperado: 100%) - **CRÍTICA si falta**

**CRITERIO DE PASO:** ✓ si (SelectItem endpoints=0 Y SelectItemEnumEndPoints centralizado Y no hay queries directas Y todos enums tienen DisplayName)

---

### STEP 1.10: Verificar FRONTEND - Design Tokens (REGLA CRÍTICA)

**REGLA CRÍTICA:** Todos los valores visuales (colores, spacing, tipografía, shadows, border-radius) DEBEN usar tokens CSS, NUNCA hardcodeados.

**BUSCAR (6 validaciones):**

```bash
# Búsqueda 1: Colores hardcodeados (Hex)
grep -r "#[0-9A-F]\{6\}\|#[0-9A-F]\{3\}" {frontend_path} \
  --include="*.scss" --include="*.css" | grep -v "node_modules" | grep -v "src/styles/core/"
# Esperado: 0 resultados

# Búsqueda 2: RGBA/RGB hardcodeados
grep -r "rgba(\|rgb(" {frontend_path} --include="*.scss" --include="*.css" \
  | grep -v "node_modules" | grep -v "src/styles/core/"
# Esperado: 0 resultados

# Búsqueda 3: Spacing literal (px)
grep -r "padding: [0-9]\|margin: [0-9]\|gap: [0-9]" {frontend_path} \
  --include="*.scss" --include="*.css" | grep -v "node_modules" | grep -v "src/styles/core/"
# Esperado: 0 resultados

# Búsqueda 4: Font-size literal (px)
grep -r "font-size: [0-9]" {frontend_path} --include="*.scss" --include="*.css" \
  | grep -v "node_modules" | grep -v "src/styles/core/"
# Esperado: 0 resultados

# Búsqueda 5: Shadow literal
grep -r "box-shadow: 0 [0-9]\|box-shadow: [0-9]" {frontend_path} \
  --include="*.scss" --include="*.css" | grep -v "node_modules" | grep -v "var(--ds-shadow"
# Esperado: 0 resultados

# Búsqueda 6: Border-radius literal (px)
grep -r "border-radius: [0-9]" {frontend_path} --include="*.scss" --include="*.css" \
  | grep -v "node_modules" | grep -v "var(--ds-radius"
# Esperado: 0 resultados
```

**REGISTRAR:**
- [ ] Colores hex encontrados (esperado: 0) - **CRÍTICA si >0**
- [ ] RGBA/RGB encontrados (esperado: 0) - **CRÍTICA si >0**
- [ ] Spacing px encontrados (esperado: 0) - **CRÍTICA si >0**
- [ ] Font-size px encontrados (esperado: 0) - **CRÍTICA si >0**
- [ ] Shadows custom encontrados (esperado: 0) - **CRÍTICA si >0**
- [ ] Border-radius px encontrados (esperado: 0) - **CRÍTICA si >0**

**CRITERIO DE PASO:** ✓ si todos = 0 (todos los valores via var(--ds-*))

**CRITERIO DE FALLO:** 🔴 CRÍTICO si cualquiera > 0

---

### STEP 1.11: Verificar BACKEND - API Responses

**BUSCAR:**
```bash
# ApiResponseDTO usage
grep -r "ApiResponseDTO" {backend_path}

# Direct return without ApiResponseDTO
grep -r "return Ok(\|return BadRequest(" {backend_path}
```

**REGISTRAR:**
- [ ] ApiResponseDTO usages (contar)
- [ ] Ok/BadRequest directo (contar, list locations)

**CRITERIO DE PASO:** ✓ si (ApiResponseDTO_usage≈100%)

---

## 📊 PHASE 1 OUTPUT

**Genera tabla:**

```markdown
## ✅ Verificación Rápida - Cumplimiento

| Aspecto | Frontend | Backend | Status |
|---------|----------|---------|--------|
| Estructura | ✓/⚠️/❌ | ✓/⚠️/❌ | - |
| State Management | ✓/⚠️/❌ | - | - |
| Templates | ✓/⚠️/❌ | - | - |
| API Access | ✓/⚠️/❌ | ✓/⚠️/❌ | - |
| Endpoints | - | ✓/⚠️/❌ | - |
| DTOs | - | ✓/⚠️/❌ | - |
| Responses | - | ✓/⚠️/❌ | - |

**Brechas Identificadas:**
1. [Brecha 1 - severidad]
2. [Brecha 2 - severidad]
```

**SALIDA ESPERADA:** Tabla + lista de 3-5 brechas principales

---

## 🔍 PHASE 2: DEEP AUDIT (2-4 horas)

### OBJETIVO
Documentación completa: RN, problemas, plan de acción con story points.

---

### STEP 2.1: Extraer Reglas de Negocio (RN)

**UBICACIÓN:**
```
{backend_path}/
  ├── reglas-negocio-*.md
  ├── Docs/
  │   └── *reglas*.md
```

**EXTRAER:**
Para cada RN encontrada, registrar:
```
RN-[MOD]-NNN
├── Descripción: [texto]
├── Nivel: 1-Invariante de Dominio | 2-Flujo y Estados | 3-Seguridad/Autorización | 4-Validación de Datos
├── Ubicación backend: [archivo.cs:línea]
├── Ubicación frontend: [archivo.ts:línea] o N/A
├── Código ejemplo: [snippet 2-3 líneas]
├── Estado cumplimiento: ✓|⚠️|❌
└── Notas: [si aplica]
```

**Referencia de Niveles (alineados con PLAN_AGENT_INSTRUCTIONS.md Fase 0.2):**
- **Nivel 1:** Invariantes de Dominio (irrompibles — leyes física del negocio; ej: "aforo máximo 50")
- **Nivel 2:** Flujo y Estados (máquina de estados válida; ej: "Reserva: Pendiente→Aprobada→En Uso")
- **Nivel 3:** Seguridad/Autorización (RBAC/ABAC — quién puede hacer qué; ej: "Solo Admin anula factura")
- **Nivel 4:** Validación de Datos (inputs — formato, rango; ej: "Monto >0, máx 2 decimales")

**BÚSQUEDA ASISTIDA:**
```bash
# Encontrar archivos de RN
find {backend_path} -name "*reglas*" -o -name "*business*"

# Extraer patrones RN-XXX-YYY
grep -r "RN-" {backend_path} --include="*.md" --include="*.cs"
```

**REGISTRAR:**
- [ ] Total RN documentadas
- [ ] RN con ubicación en código (%)
- [ ] RN sin ubicación (list them)
- [ ] Estado cumplimiento por RN

---

### STEP 2.2: Identificar Problemas Funcionales

**BÚSQUEDA EN CÓDIGO:**

Para cada RN y funcionalidad, verificar:

1. **Desalineaciones Frontend/Backend**
   ```bash
   # Buscar endpoints en frontend constants
   grep -r "Endpoints\." {frontend_path}/core/constants/
   
   # Comparar con backend actual
   grep -r "MapGroup\|MapGet\|MapPost" {backend_path}
   
   # Buscar mismatches (DELETE vs CANCEL, etc)
   ```

2. **DTOs inconsistentes**
   ```bash
   grep -r "class.*DTO" {backend_path}/Contracts/DTOs/
   grep -r "interface.*DTO\|type.*DTO" {frontend_path}
   ```

3. **Enums hardcodeados**
   ```bash
   grep -r "enum E" {backend_path}
   grep -r "as const.*=" {frontend_path}/models/
   ```

4. **Estado legacy**
   ```bash
   grep -r "BehaviorSubject\|PropertyOccupant\|Old\|Legacy" {backend_path}
   grep -r "BehaviorSubject\|rxjs" {frontend_path}
   ```

**REGISTRAR por cada problema:**
```
PRIM-NNN: [Título]
├── Severidad: 🔴|🟠|🟡|🔵
├── Descripción: [qué falla]
├── Impacto: [usuarios afectados, flujos bloqueados]
├── Caso reproducción:
│   1. [paso 1]
│   2. [paso 2]
│   └── Resultado: [actual vs esperado]
├── Ubicación código:
│   ├── Frontend: [archivo:línea]
│   ├── Backend: [archivo:línea]
│   └── Base datos: [tabla/columna si aplica]
├── Causa raíz: [por qué sucede]
├── Solución: [acción]
└── Complejidad: Pequeña|Media|Grande
```

**CRITERIO DE SEVERIDAD:**
- 🔴 CRÍTICA: Bloquea producción, usuarios no pueden trabajar
- 🟠 ALTA: Funcionalidad rota, workaround posible
- 🟡 MEDIA: Inconsistencia, deuda técnica
- 🔵 BAJA: Estético, mejora menor

---

### STEP 2.3: Crear Matriz Front/Back

**VERIFICAR ALINEACIÓN:**

```bash
# Listar todas las features CRUD
# Buscar en frontend:
grep -r "pages/" {frontend_path} --include="*.ts" | grep -v ".spec"

# Buscar endpoints en backend:
grep -r "MapGet\|MapPost\|MapPut\|MapDelete" {backend_path}

# Comparar:
# Feature en frontend → ¿Tiene endpoint en backend?
# Endpoint en backend → ¿Tiene consumer en frontend?
```

**REGISTRAR:**

```markdown
| Feature | Frontend | Backend | Sincronizado | Notas |
|---------|----------|---------|--------------|-------|
| [Feature] | ✓ | ✓ | ✓ | - |
| [Feature] | ✓ | ✓ | ⚠️ | Validaciones diferentes |
| [Feature] | ❌ | ✓ | ❌ | Falta implementar en UI |
```

---

### STEP 2.4: Tabular Cumplimiento CONVENTIONS.md

**FRONTEND (8 secciones):**

```markdown
| Regla | Sección | Cumple | % | Hallazgos |
|-------|---------|--------|---|-----------|
| Standalone Components | §2.1 | ✓ | 100% | - |
| Signals (no BehaviorSubject) | §2.3 | ⚠️ | 97% | 3 BehaviorSubject en [ubicación] |
| [resto...] | | | |
```

**BACKEND (10 secciones):**

```markdown
| Regla | Sección | Cumple | % | Hallazgos |
|-------|---------|--------|---|-----------|
| Minimal APIs | §1.1 | ✓ | 100% | - |
| Endpoint naming | §9 | ⚠️ | 90% | 2 endpoints en PascalCase: [list] |
| [resto...] | | | |
```

**CALCULAR:** % cumplimiento combinado = (front_score + back_score) / 2

---

### STEP 2.5: Planificar Acciones

**PARA CADA PROBLEMA Y BRECHA:**

Crear acción con:
```
[ACCIÓN-NNN]
├── Título: [breve]
├── Descripción: [qué hacer]
├── Fase: INMEDIATA (1-2 sem) | CORTO PLAZO (3-6 sem) | MEDIO PLAZO (2 meses)
├── Complejidad: Pequeña|Media|Grande
├── Story Points: [estimado: 2-4 (pequeña), 6-8 (media), 10-16 (grande)]
├── Sprint: [número o rango]
└── Criterio de éxito: [cómo verificar que está done]
```

**SUMATORIA:**
- Total story points por fase
- Orden recomendado
- Dependencias entre acciones

---

## 📄 PHASE 2 OUTPUT

**Generar markdown con estructura:**

```markdown
# Auditoría: [Nombre Módulo]

**Fecha:** YYYY-MM-DD
**Frontend:** {frontend_path}
**Backend:** {backend_path}

---

## 📊 Resumen Ejecutivo

**Estado:** X%
**Hallazgos Críticos:** X
**Fortalezas:** Y
**Prioridad:** [Inmediata|Corto plazo|Medio plazo]

### STEP 1.9: Verificar FRONTEND - Componentes UI y Diseño

**BUSCAR:**
```bash
# Componentes en shared/ui (deben reutilizar, NO crear nuevos)
find {frontend_path}/shared/ui -name "*.component.ts"

# Componentes específicos del módulo (deben existir)
find {frontend_path} -name "*.component.ts" | grep -v shared/ui

# HTML templates (verificar estructura, no inline styles)
find {frontend_path} -name "*.component.html" | wc -l

# Estilos globales vs locales
find {frontend_path} -name "*.component.scss" | wc -l
find {frontend_path} -path "*/shared/styles/*" -name "*.scss"

# PrimeNG o componentes externos (PROHIBIDOS si no están aprobados)
grep -r "p-button\|p-input\|p-table\|p-dialog" {frontend_path}
```

**REGISTRAR:**
- [ ] Componentes en shared/ui (contar, reutilizados)
- [ ] Componentes del módulo (contar, específicos)
- [ ] Templates HTML (contar, estructura)
- [ ] Estilos locales vs globales (balance)
- [ ] Componentes externos no aprobados (listar)

**CRITERIO DE PASO:** ✓ si (shared/ui reutilizados Y componentes específicos>0 Y no inline styles Y sin componentes prohibidos)

---

### STEP 1.10: Verificar FRONTEND - Responsive Design (Mobile/Desktop)

**BUSCAR:**
```bash
# Media queries (deben existir para breakpoints)
grep -r "@media" {frontend_path}/*.scss

# Mobile-first patterns (verificar orden)
grep -r "@media (max-width\|@media (min-width" {frontend_path}/*.scss

# TailwindCSS o bootstrap (verificar si está aprobado)
grep -r "grid-cols\|flex\|w-full\|p-" {frontend_path} | head -20

# Breakpoint variables (si existen)
grep -r "\$breakpoint\|--breakpoint\|@include" {frontend_path}
```

**REGISTRAR:**
- [ ] Media queries encontradas (contar)
- [ ] Mobile-first vs desktop-first (indicar)
- [ ] Breakpoints definidos (enumerar)
- [ ] Componentes con problemas responsive (listar)

**CRITERIO DE PASO:** ✓ si (media queries>0 Y mobile-first Y componentes adaptativos)

---

### STEP 1.11: Verificar UI - Accesibilidad (a11y)

**BUSCAR:**
```bash
# aria-labels (deben existir para elementos interactivos)
grep -r "aria-label\|aria-describedby\|role=" {frontend_path}

# img sin alt (PROHIBIDO)
grep -r "<img" {frontend_path}/*.html | grep -v "alt="

# Colores sin suficiente contraste (manual check)
grep -r "color:\|background:\|#[A-F0-9]" {frontend_path}/*.scss | head -20

# Heading hierarchy (h1, h2, h3 en orden)
grep -r "<h[1-6]" {frontend_path}/*.html
```

**REGISTRAR:**
- [ ] aria-labels encontrados (contar)
- [ ] img sin alt (contar, esperado: 0)
- [ ] Jerarquía de headings (OK/FALLA)
- [ ] Color contrast (manual review needed)

**CRITERIO DE PASO:** ✓ si (aria-labels en interactivos Y img con alt Y h1-h6 en orden)

---

### STEP 1.12: Verificar UI - Diseño y Consistencia Visual

**BUSCAR:**
```bash
# Uso de design system tokens (si existen)
grep -r "var(--\|\\$color-\|\\$spacing-" {frontend_path}

# Colores hardcodeados (PROHIBIDO si hay design tokens)
grep -r "color: #\|background: #" {frontend_path}/*.scss | wc -l

# Padding/margin consistentes (verificar uso de variables)
grep -r "padding: [0-9]\|margin: [0-9]" {frontend_path}/*.scss

# Tipografía consistente
grep -r "font-size:\|font-weight:" {frontend_path}/*.scss | sort | uniq -c
```

**REGISTRAR:**
- [ ] Design tokens usados (sí/no)
- [ ] Colores hardcodeados (contar - esperado: 0 si hay tokens)
- [ ] Spacing inconsistente (identificar)
- [ ] Tipografía (variables vs hardcodeado)

**CRITERIO DE PASO:** ✓ si (design tokens usados Y spacing consistente Y tipografía centralizada)

---

## PHASE 2: DEEP AUDIT (2-4 horas)

### STEP 2.1: Extraer Reglas de Negocio Implementadas

**OBJETIVO:** Descubrir TODAS las reglas de negocio que el módulo implementa (con o sin FASE 0).

**SI EXISTE FASE 0:**
```
1. Leer 02-business-rules-analysis.md
2. Extraer la matriz de RN (4 niveles)
3. Saltarse a STEP 2.2 (verificación de código)
```

**SI NO EXISTE FASE 0:**
```
1. Buscar archivos reglas-negocio-*.md en backend
2. Analizar código para encontrar restricciones implícitas
3. Documentar CADA regla encontrada
4. Clasificar en 4 niveles (Invariante, Flujo, Seguridad, Validación)
```

**BUSCAR EN CÓDIGO:**

```bash
# Invariantes (restricciones que nunca cambian)
grep -r "throw new\|return null\|if.*throw" {backend_path} | grep -E "invalid|not found|duplicate"

# Flujos (estados, transiciones)
grep -r "status.*=\|State.*=\|switch.*case" {backend_path} | grep -E "Pending|Approved|Completed|Closed"

# Seguridad (roles, autenticación)
grep -r "Authorize\|Role.*=\|RequireRole\|CheckPermission" {backend_path}

# Validación (formatos, límites)
grep -r "Length\|Pattern\|Range\|Regex\|MaxLength" {backend_path}
```

**OUTPUT: Tabla de Reglas Encontradas**

| ID | Descripción | Nivel | Ubicación Backend | Ubicación Frontend | Documentada |
|:---|:-----------|:-----:|:-----:|:-----:|:-----:|
| RN-MOD-001 | Aforo máximo: 50 personas | 1-Invariante | services/AforoService.cs:42 | N/A | ✓ FASE 0 |
| RN-MOD-002 | Reserva: PENDING→APPROVED→IN_USE | 2-Flujo | entities/Reserva.cs:15-30 | components/reserva-form | ✓ FASE 0 |
| RN-MOD-003 | Solo SuperUsuario/Contador anulan | 3-Seguridad | endpoints/ReservaEndpoint.cs:Delete:78 | pages/reserva-list | ✗ Implícita |
| RN-MOD-004 | Email válido (RFC 5322) | 4-Validación | validators/EmailValidator.cs | shared/validators | ✓ FASE 0 |

*Niveles: 1=Invariante Dominio | 2=Flujo/Estados | 3=Seguridad/RBAC | 4=Validación Datos*
*Documentada: ✓ FASE 0 (en 02-business-rules-analysis.md) | ✗ Implícita (solo en código)*

---

### STEP 2.2: Matriz de Roles por Tarea

**OBJETIVO:** Documentar qué roles están involucrados en cada funcionalidad del módulo.

**BUSCAR EN CÓDIGO:**

```bash
# Encontrar atributos [Authorize]
grep -r "Authorize" {backend_path} | grep -E "Roles\s*="

# Encontrar controles de rol programáticos
grep -r "IsInRole\|HasRole\|CheckRole" {backend_path}

# Encontrar permisos en frontend
grep -r "hasRole\|currentUser.role\|allowedRoles" {frontend_path}
```

**OUTPUT: Matriz de Roles**

| Funcionalidad | Endpoint/Componente | Roles Permitidos | Roles Restringidos | Estado |
|:---|:---|:---|:---|:---|
| **VER** Reservas | GET `/api/reservas` | SuperUsuario, Direccion, Administrador, Condomino | - | ✓ |
| **CREAR** Reserva | POST `/api/reservas` | Condomino (propia zona) | - | ✓ |
| **EDITAR** Reserva | PUT `/api/reservas/{id}` | SuperUsuario, Administrador | Condomino (solo propia) | ⚠️ |
| **ANULAR** Reserva | DELETE `/api/reservas/{id}` | SuperUsuario, Contador | Condomino | ✓ |
| **VER** Reportes | GET `/api/reportes` | SuperUsuario, Direccion, GerenteOperaciones | Condomino | ⚠️ |

*Estado: ✓ = Implementado correctamente | ⚠️ = Requiere aclaración | ✗ = No implementado*

---

### STEP 2.3: Reporte de Errores de Coherencia en Flujos

**OBJETIVO:** Identificar inconsistencias lógicas, flujos incompletos, transiciones de estado inválidas.

**BUSCAR:**

```bash
# Estado de retorno inconsistente
grep -r "return Ok\|return BadRequest\|return NotFound" {backend_path} | wc -l

# Flujos de negocio (cambios de estado)
grep -r "\.Status = \|\.State = \|SetStatus" {backend_path}

# Transiciones sin validar
grep -A5 "switch.*Status\|if.*Status" {backend_path}

# Métodos que no retornan consistentemente
grep -B2 "return\;" {backend_path} | grep -v "return Ok\|return BadRequest"
```

**CHECKLIST DE COHERENCIA:**

- [ ] ¿Todos los estados del Nivel 2 están implementados?
- [ ] ¿Las transiciones de estado respetan el diagrama de flujo?
- [ ] ¿Hay transiciones "mágicas" (saltos que no deberían existir)?
- [ ] ¿Se valida el estado anterior antes de permitir transición?
- [ ] ¿Hay estados "huérfanos" (a los que nunca se llega)?
- [ ] ¿Se maneja el error cuando la transición no es válida?
- [ ] ¿Hay race conditions posibles (concurrencia)?
- [ ] ¿Se registra auditoría de cada cambio de estado?

**OUTPUT: Tabla de Errores Encontrados**

| Tipo | Descripción | Línea | Severidad | Ejemplar |
|:---|:---|:---|:---|:---|
| Transición inválida | PENDING → CLOSED sin pasar por APPROVED | ReservaService.cs:123 | CRÍTICA | El código permite saltar estados |
| Validación faltante | No verifica fecha pasada en CREAR | ReservaEndpoint.cs:45 | ALTA | Permite reservas en el pasado |
| Race condition | Dos POSTS simultáneos crean dos registros | ReservaRepository.cs:78 | ALTA | Sin validación de unicidad |
| Inconsistencia lógica | VER reportes sin CREAR permiso | ReportService.cs:200 | MEDIA | Lógica contradictoria |

---

### STEP 2.4: Dudas Técnicas / Reglas Faltantes

**OBJETIVO:** Identificar áreas donde las reglas NO están claras, donde el código hace suposiciones, o donde debería haber una regla pero no existe.

**BUSCAR INDICADORES:**

```bash
# Comentarios que indican incertidumbre
grep -r "TODO\|FIXME\|XXX\|HACK\|BUG\|QUESTION" {backend_path}

# Valores hardcodeados (posible regla implícita)
grep -r "['\"].*[0-9]\+['\"]" {backend_path} | grep -E "limit|max|min|timeout"

# Lógica compleja sin comentarios
grep -B2 -A5 "if.*&&.*||" {backend_path}

# Métodos muy largos (posible múltiples reglas)
grep -c "^" {backend_path}/*.cs | awk -F: '$2>30 {print}'
```

**EJEMPLOS DE DUDAS TÉCNICAS:**

```
DUDA-001: ¿Cuál es el límite máximo de reservas por condómino/mes?
  Ubicación: ReservaService.cs:56 (hardcoded a 3)
  Pregunta: ¿Es regla de negocio o solo valor temporal?
  Recomendación: Documentar como RN-MOD-XYZ o mover a config

DUDA-002: ¿Se permite sobrescribir una reserva existente?
  Ubicación: ReservaEndpoint.cs:89 (UPDATE reemplaza sin validar conflictos)
  Pregunta: ¿Débería verificar solapamiento con otras reservas?
  Recomendación: Aclarar en FASE 0 Nivel 2 (Flujos)

DUDA-003: ¿Qué ocurre si se anula una reserva <24h antes?
  Ubicación: ReservaService.cs:156 (solo throw exception)
  Pregunta: ¿Hay penalización? ¿Se notifica al admin? ¿Queda registro?
  Recomendación: Definir en FASE 0 Nivel 3 (Seguridad) y Nivel 4 (Validación)
```

**OUTPUT: Tabla de Dudas Técnicas**

| ID | Descripción | Ubicación | Tipo | Impacto | Recomendación |
|:---|:---|:---|:---|:---|:---|
| DUDA-001 | Límite máximo de reservas | ReservaService.cs:56 | Valor hardcodeado | MEDIA | Convertir a RN documentada o config |
| DUDA-002 | Sobrescritura sin validación | ReservaEndpoint.cs:89 | Lógica ambigua | ALTA | Aclarar en FASE 0 Nivel 2 |
| DUDA-003 | Anulación <24h antes | ReservaService.cs:156 | Regla implícita | ALTA | Definir consecuencias en FASE 0 |
| DUDA-004 | Comportamiento en timeout de BD | ReservaRepository.cs:45 | Manejo de errores | MEDIA | Documentar política de reintentos |

---

## 🏢 REPORTE CONSOLIDADO: Reglas de Negocio

### Resumen de RN Implementadas

**Total RN implementadas:** 12  
**Documentadas en FASE 0:** 8 (67%)  
**Implícitas (solo en código):** 4 (33%)  
**Dudas técnicas:** 4

### Tabla Consolidada

---

## 🔴 Problemas Funcionales Hallados

**Severidades:**
- 🔴 **CRÍTICA** → Bloquea funcionalidad, riesgo de datos, seguridad
- 🟠 **ALTA** → Causa errores o inconsistencias frecuentes
- 🟡 **MEDIA** → Degradación de rendimiento, UX pobre
- 🟢 **BAJA** → Mejora sugerida, sin impacto inmediato

**Tabla de Problemas (PRIM-NNN):**

| ID | Descripción | Severidad | Ubicación | Impacto | Reproducible |
|:---|:---|:---|:---|:---|:---|
| PRIM-001 | Transición de estado inválida PENDING→CLOSED | 🔴 CRÍTICA | ReservaService.cs:123 | Datos inconsistentes | Sí, paso X→Y→Z |
| PRIM-002 | No se valida fecha pasada en CREAR reserva | 🟠 ALTA | ReservaEndpoint.cs:45 | Reservas retroactivas anómalas | Sí, POST con fecha < hoy |
| PRIM-003 | Race condition en crear registro único | 🟠 ALTA | ReservaRepository.cs:78 | Duplicados en BD | Sí, 2 POSTs simultáneos |
| PRIM-004 | Email no se valida al crear usuario | 🟡 MEDIA | UserService.cs:156 | Datos inválidos | Sí, POST con email="abc" |
| PRIM-005 | Logs de auditoría incompletos | 🟡 MEDIA | AuditService.cs:34 | Imposible auditar | Parcial, falta quién |

---

---

## 🎨 UI/COMPONENTES: Diseño HTML, Mobile/Desktop, Accesibilidad

**Objetivo:** Auditar la capa de UI: componentes, responsive design, accesibilidad (a11y).

### Tabla de Componentes UI

| Componente | Ubicación | Tipo | Responsive | Accesibilidad | Estado |
|:---|:---|:---|:---|:---|:---|
| ReportForm | components/report-form | Custom | ✓ Mobile+Desktop | ⚠️ Falta aria-label | Uso UI Shared |
| ReportTable | components/report-table | Custom | ⚠️ Solo desktop | ✓ aria-table OK | Necesita mobile |
| FilterPanel | shared/ui/filter-panel | Shared | ✓ Responsive | ✓ ARIA OK | Reutilizado |
| ModalDialog | shared/ui/modal-dialog | Shared | ✓ Responsive | ✓ Trap focus OK | Reutilizado |

**Leyenda:** ✓ OK | ⚠️ Requiere mejora | ✗ Falta

### Checklist de Responsive Design

| Aspecto | Desktop | Tablet | Mobile | OK |
|:---|:---|:---|:---|:---|
| Componentes adaptan layout | ✓ | ✓ | ⚠️ | Parcial |
| Breakpoints definidos | ✓ (1024px) | ✓ (768px) | ⚠️ Falta 320px | Revisar |
| Media queries ordenadas | ✓ Mobile-first | ✓ Mobile-first | ✓ Mobile-first | ✓ |
| Imágenes responsive | ✓ srcset | ✓ srcset | ⚠️ Falta en modal | Parcial |

### Hallazgos de Accesibilidad (a11y)

| Problema | Ubicación | Severidad | Ejemplar |
|:---|:---|:---|:---|
| Img sin alt | components/report-header.html:45 | MEDIA | `<img src="logo.png">` |
| aria-label faltante | components/buttons.html:12 | MEDIA | `<button>X</button>` (close) |
| Contraste bajo | styles/colors.scss | BAJA | `#999 on #f0f0f0` (3.5:1, necesita 4.5:1) |
| Heading h1 faltante | pages/report-list.html | MEDIA | Comienza con h2 |

### Tabla de Diseño y Consistencia

| Aspecto | Encontrado | Esperado | Estado |
|:---|:---|:---|:---|
| Design tokens (variables) | ✓ 15 definidos | ✓ 20+ | ⚠️ |
| Colores hardcodeados | 8 encontrados | 0 | ✗ Violación |
| Spacing consistente | Usa 8px grid | 8px grid | ✓ |
| Tipografía | 4 font-sizes | 3-5 esperados | ✓ |

---

## 🔗 Matriz de Alineación Frontend/Backend

**Objetivo:** Verificar que frontend y backend están sincronizados en contrato, validaciones y flujos.

| Funcionalidad | Endpoint Backend | Componente Frontend | Contrato Actualizado | Validaciones Sync | Estados Sync |
|:---|:---|:---|:---|:---|:---|
| Crear Reserva | POST `/api/reservas` | `reservation-form` | ✓ | ⚠️ Email | ✓ |
| Editar Reserva | PUT `/api/reservas/{id}` | `reservation-edit` | ✓ | ✓ | ✓ |
| Anular Reserva | DELETE `/api/reservas/{id}` | `reservation-actions` | ✓ | ✓ | ⚠️ (falta CANCELLED) |
| Ver Reportes | GET `/api/reportes` | `report-dashboard` | ✗ Backend retorna + campos | ✓ | ✓ |

**Leyenda:** ✓ Sincronizado | ⚠️ Parcial | ✗ Desincronizado

---

## ✅ Cumplimiento CONVENTIONS.md

### Backend Compliance

| Regla | Estado | Hallazgos |
|:---|:---|:---|
| Minimal APIs (no ControllerBase) | ✓ | 12/12 endpoints usan MapGroup |
| DTOs en Contracts/DTOs | ⚠️ | 8/10 DTOs bien ubicados, 2 en Services/ |
| Namespaces oficiales | ✓ | Todos usan LuxuryApp.Application.* |
| Validators para DTOs | ⚠️ | 8/10 DTOs tienen validator, falta para X, Y |
| ApiResponseDTO en respuestas | ✗ | 3 endpoints retornan Ok() directo (sin DTO) |
| Shared services | ✓ | Usa ICurrentUserService, ITenantAccessor |
| Sin `ProjectTo<>` (AutoMapper solo en memoria) | ✓ | 0 `ProjectTo`; consultas con .Select() manual |

**Cumplimiento Backend:** 78% (ℹ️ Objetivo: 95%)

### Frontend Compliance

| Regla | Estado | Hallazgos |
|:---|:---|:---|
| Standalone components | ✓ | 12/12 componentes con standalone:true |
| Signals (no BehaviorSubject) | ✓ | 8/8 servicios usan signal() |
| @if/@for (no *ngIf/*ngFor) | ⚠️ | 10/12 componentes migrados, 2 aún con *ngIf |
| ApiResponseService (no HttpClient) | ✓ | Todos usan ApiResponseService |
| Wrappers pattern | ✓ | 3 wrappers encontrados |
| Shared UI components | ✓ | Importa de client/angular/src/app/shared/ui |

**Cumplimiento Frontend:** 90% (ℹ️ Objetivo: 95%)

---

## 🎯 Plan de Acción

### Fase 1: INMEDIATA (1-2 semanas)
- [ACCIÓN-001] [Titulo] - [story points]
- [ACCIÓN-002] [Titulo] - [story points]
**Total: XX story points**

### Fase 2: CORTO PLAZO (3-6 semanas)
[...]

### Fase 3: MEDIO PLAZO (2 meses)
[...]

**Total Effort:** XX story points

---

## 📈 Métricas

| Métrica | Valor | Target | Status |
|---------|-------|--------|--------|
| Cobertura tests | X% | 80% | 🔴/🟡/🟢 |
| Cumplimiento CONVENTIONS | X% | 95% | 🔴/🟡/🟢 |
| Deuda técnica (SP) | XX | <30 | 🔴/🟡/🟢 |

---

## 🔗 Referencias

- Reglas de Negocio: {backend_path}/reglas-negocio-*.md
- CONVENTIONS.md: ../../CONVENTIONS.md
```

---

## 🔄 CONTROL DE CALIDAD

**Antes de guardar el reporte, verificar TODAS estas secciones:**

### ✅ STEP 2.1: Reglas de Negocio

- [ ] Tabla de RN completa (todas las encontradas, documentadas e implícitas)
- [ ] Cada RN tiene ID (RN-MOD-NNN)
- [ ] Cada RN clasificada en 4 niveles (Invariante, Flujo, Seguridad, Validación)
- [ ] Cada RN tiene ubicación de código (archivo:línea)
- [ ] Se indica si está documentada en FASE 0 o es implícita
- [ ] Si hay FASE 0, coincide con tabla (ninguna RN faltante)
- [ ] Si NO hay FASE 0, se advierte que reglas son implícitas

### ✅ STEP 2.2: Matriz de Roles

- [ ] Todos los endpoints/componentes están listados
- [ ] Cada funcionalidad tiene roles permitidos documentados
- [ ] Roles usados están en application-roles-catalog.md
- [ ] Se indica si la restricción por role está implementada correctamente
- [ ] Matriz incluye tanto backend como frontend
- [ ] Se valida coherencia: mismo rol en frontend debe estar en backend
- [ ] Restricciones especiales documentadas (ej: "solo datos propios")

### ✅ STEP 2.3: Errores de Coherencia

- [ ] Checklist de coherencia completado para CADA diagrama de flujo
- [ ] Cada transición de estado tiene validación en código
- [ ] No hay estados huérfanos (inalcanzables)
- [ ] No hay "saltos" de estado inválidos
- [ ] Race conditions identificadas
- [ ] Auditoría de cambios de estado registrada
- [ ] Cada error listado con línea exacta de código
- [ ] Se describe paso a paso cómo reproducir

### ✅ STEP 2.4: Dudas Técnicas

- [ ] Tabla de DUDA-NNN completa
- [ ] Cada duda tiene:
  - [ ] Descripción clara
  - [ ] Ubicación exacta (archivo:línea)
  - [ ] Tipo (valor hardcodeado, lógica ambigua, regla implícita, etc.)
  - [ ] Impacto (CRÍTICA, ALTA, MEDIA, BAJA)
  - [ ] Recomendación específica (convertir a RN, aclarar en FASE 0, etc.)
- [ ] Si duda afecta FASE 0, proponer nueva RN

### ✅ Problemas Funcionales

- [ ] Cada problema tiene ID (PRIM-NNN)
- [ ] Severidad justificada (por qué CRÍTICA/ALTA/etc)
- [ ] Caso reproducible documentado paso a paso
- [ ] Impacto cuantificado si es posible ("Afecta X usuarios", "Pérdida de datos")
- [ ] Ubicación exacta (archivo:línea)
- [ ] No hay problemas "vaguos" ("código confuso" → ¿QUÉ exactamente?)

### ✅ Matriz de Alineación

- [ ] Frontend y Backend tienen contrato documentado
- [ ] DTOs coinciden entre frontend y backend
- [ ] Validaciones frontend coinciden con backend
- [ ] Estados disponibles sincronizados (no hay estado en backend sin selector en frontend)
- [ ] Se nota desincronización si la hay

### ✅ Cumplimiento CONVENTIONS.md

- [ ] % calculado correctamente (hallazgos/total * 100)
- [ ] Detalles específicos (no "algunos", sino "3 de 12")
- [ ] Referencias a CONVENTIONS.md sección específica
- [ ] Se identifica qué regla se viola y dónde
- [ ] Objetivo (95%) y estado actual visible

### ✅ Plan de Acción

- [ ] Problemas secuenciados: Fase 1 CRÍTICA → Fase 2 ALTA → Fase 3 MEDIA/BAJA
- [ ] Story points razonables (2-4 pequeña, 6-8 media, 10-16 grande)
- [ ] Cada acción tiene propietario implícito (backend/frontend/ambos)
- [ ] Total effort calculado
- [ ] Timeline estimado (1-2 sem, 3-6 sem, 2+ meses)

### ✅ Formato y Presentación

- [ ] Sin typos ni referencias incorrectas
- [ ] Tono profesional, impersonal
- [ ] Tablas bien formateadas (sin saltos de línea extra)
- [ ] Nombres de archivo/línea exactos (sin "aproximadamente")
- [ ] Ejemplares de código o pasos reproducibles incluidos

---

## 📌 GUARDAR REPORTE

**Ubicación:**
```
docs/[ModuleLuxuryApp]/[Submodulo]/
  └─ YYYYMMDD-auditoria-[modulo]-[submodulo].md
```

**Nombre:** Estructura plana §6ter: fecha + tipo `auditoria` + modulo + submodulo (kebab-case), sin subcarpetas adicionales.

**Ejemplo:**
```
20260726-auditoria-cobranza-nativa.md
20260726-auditoria-recursos-humanos.md
```

---

## ⏱️ TIEMPO ESTIMADO

| Fase | Duración | Acciones |
|------|----------|----------|
| Phase 1 (Quick Check) | 15 minutos | Búsquedas grep, conteos |
| Phase 2 (Deep Audit) | 2-4 horas | Análisis, documentación |
| **TOTAL** | **2-4.25 horas** | |

---

## 🤖 NOTAS PARA AGENTES

1. **Automatizar búsquedas:** Usar grep, find, ubicaciones exactas de código
2. **Ser específico:** No "hay problemas", sino "línea 123 en archivo.cs"
3. **Cuantificar:** "3 BehaviorSubject", no "algunos BehaviorSubject"
4. **Story points:** Seguir convención: 2-4 (pequeña), 6-8 (media), 10-16 (grande)
5. **Severidad:** Justificar por qué es crítica (ej: "Bloquea 50+ usuarios diarios")
6. **Casos de reproducción:** Paso a paso, verificable por otro agente
7. **No inventar:** Si no encuentras RN documentada, reportar como "No documentada"
8. **Asumir:** Los módulos tienen archivos `reglas-negocio-*.md` en backend

---

**Versión:** 1.0  
**Última actualización:** 2026-07-26  
**Para:** Agentes de IA (Claude, Codex, Cursor, OpenAI, etc.)
