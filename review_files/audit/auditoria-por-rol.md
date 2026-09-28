# 🔍 Auditoría por Rol - Criterios Verificables y Ejecutables

**Propósito:** Definir comandos exactos, métricas, y criterios de paso/fallo para auditar el cumplimiento de CONVENTIONS.md por cada rol.

**Vigencia:** A partir de 2026-07-27  
**Actualización:** Anual + por major release (.NET, Angular)

---

## 📋 ÍNDICE DE AUDITORÍAS POR ROL

1. **Frontend Senior** — §2, §3, §5, §6, §7, §8, §15
2. **Backend Developer** — §1, §9, §16, §18
3. **Mobile Developer** — §2, §13, §15
4. **Full Stack Developer** — Auditoría cruzada (ambos)
5. **Tech Lead / Architect** — Auditoría integral de módulo

---

## 🎯 AUDITORÍA 1: FRONTEND SENIOR

### 1.1 Strict TypeScript (§2.7)

**Regla:** `strict: true`, prohibido `any`

**Comando:**
```bash
# Verificar strict en tsconfig
grep '"strict".*true' appsweb/angular/tsconfig.json

# Contar cualquier uso de 'any'
grep -r " any" appsweb/angular/src/app/modules \
  --include="*.ts" \
  --exclude-dir=node_modules \
  | grep -v "// any" \
  | wc -l
```

**Criterio de Paso:**
- ✅ `strict: true` declarado en tsconfig
- ✅ Resultado de grep = 0 (cero `any`)

**Criterio de Fallo:**
- ❌ `strict: false` o ausente → 🔴 CRÍTICA
- ❌ Encontrados `any` → 🔴 CRÍTICA

**Acción si falla:**
```bash
# Fix automático parcial
find appsweb/angular/src/app/modules -name "*.ts" \
  -exec sed -i 's/: any/: unknown/g' {} \;

# Luego revisar manualmente cada `unknown`
```

---

### 1.2 OnPush Strategy (§2.4)

**Regla:** `ChangeDetectionStrategy.OnPush` en todos los componentes

**Comando:**
```bash
# Contar componentes SIN OnPush
grep -r "@Component(" appsweb/angular/src/app/modules \
  --include="*.ts" -A 3 \
  | grep -c "^[^-]*@Component" \
  > /tmp/total_components.txt

grep -r "OnPush" appsweb/angular/src/app/modules \
  --include="*.ts" \
  | wc -l > /tmp/onpush_components.txt

# Comparar
TOTAL=$(cat /tmp/total_components.txt)
ONPUSH=$(cat /tmp/onpush_components.txt)
echo "OnPush: $ONPUSH / $TOTAL"
```

**Criterio de Paso:**
- ✅ 100% (ONPUSH == TOTAL)

**Criterio de Fallo:**
- ❌ < 100% → 🔴 CRÍTICA (excepto core shared)

---

### 1.3 Catálogo UI (§5)

**Regla:** Cero imports de `primeng` o `@ionic` directo en features

**Comando:**
```bash
# Buscar imports prohibidos
grep -r "from ['\"]primeng\|from ['\"]@ionic" \
  appsweb/angular/src/app/modules \
  --include="*.ts" \
  | grep -v node_modules
```

**Criterio de Paso:**
- ✅ 0 matches (cero imports directos)

**Criterio de Fallo:**
- ❌ > 0 matches → 🔴 CRÍTICA

**Auto-fix:**
```bash
# Reemplazar imports con @ui/*
find appsweb/angular/src/app/modules -name "*.ts" \
  -exec sed -i "s/from 'primeng/from '@ui\/primeng/g" {} \;
```

---

### 1.4 Wrappers con Sufijo "-wrapper" (§6)

**Regla:** Todos los wrappers usan sufijo `-wrapper`, no prefijo `wrapper-`

**Comando:**
```bash
# Buscar violaciones (prefijo wrapper-)
find appsweb/angular/src/app/modules \
  -name "wrapper-*.ts" -o -name "*wrapper.ts" \
  | sort

# Validar clases internas
grep -r "class.*Wrapper" appsweb/angular/src/app/modules \
  --include="*.ts" \
  | grep -v "Wrapper\$" # debe terminar en Wrapper
```

**Criterio de Paso:**
- ✅ Cero archivos con patrón `wrapper-*`
- ✅ 100% de clases terminan en `Wrapper`

**Criterio de Fallo:**
- ❌ Encontrados `wrapper-*` files → 🟠 ALTA

---

### 1.5 Mobile Component (§2.8, §15.4)

**Regla:** Cada listado CRUD debe tener versión móvil (`XMobileComponent` o `app-data-view-mobile`)

**Comando:**
```bash
# Buscar componentes de listado
find appsweb/angular/src/app/modules \
  -name "*list.ts" -o -name "*crud.ts" \
  | sort > /tmp/lists.txt

# Verificar existencia de -mobile o XMobileComponent
while read -r file; do
  dirname=$(dirname "$file")
  basename=$(basename "$file" .ts)
  
  if ! grep -r "${basename}-mobile\|${basename}Mobile" "$dirname"; then
    echo "❌ FALTA versión móvil: $file"
  fi
done < /tmp/lists.txt
```

**Criterio de Paso:**
- ✅ Cada CRUD listado tiene correspondiente -mobile

**Criterio de Fallo:**
- ❌ Listados sin versión móvil → 🔴 CRÍTICA

---

### 1.6 Responsive (§15)

**Regla:** Testeado en 3 breakpoints: 375px, 768px, 1280px

**Comando:**
```bash
# Validar que existen media queries
grep -r "@media.*768\|@media.*375\|@media.*1280" \
  appsweb/angular/src/app/modules \
  --include="*.scss" \
  | wc -l

# Verificar PrimeFlex responsive classes
grep -r "p-md-\|p-sm-\|p-lg-" \
  appsweb/angular/src/app \
  --include="*.html" \
  | wc -l
```

**Criterio de Paso:**
- ✅ Media queries en SCSS
- ✅ Clases PrimeFlex responsive

**Criterio de Fallo:**
- ❌ No hay media queries → 🟡 MEDIA

**Manual test:**
```bash
# Abrir en Chrome DevTools
# F12 → Toggle device toolbar
# Verificar en: 375px, 768px, 1280px
# ✅ Sin scroll horizontal
# ✅ Touch targets ≥ 44px
```

---

## 🎯 AUDITORÍA 2: BACKEND DEVELOPER

### 2.1 Minimal APIs (§9)

**Regla:** Endpoints nuevos usan Minimal APIs (NO MVC)

**Comando:**
```bash
# Contar controllers MVC
find api/LuxuryApp.Api \
  -name "*Controller.cs" \
  | wc -l > /tmp/mvc_count.txt

# Contar Minimal API endpoints (IEndpointModule)
grep -r "IEndpointModule" api/LuxuryApp.Application \
  --include="*.cs" \
  | wc -l > /tmp/minimal_count.txt

echo "MVC Controllers: $(cat /tmp/mvc_count.txt)"
echo "Minimal Endpoints: $(cat /tmp/minimal_count.txt)"
```

**Criterio de Paso:**
- ✅ MVC controllers = 0 (todos migrados)
- ✅ Minimal endpoints > 0

**Criterio de Fallo:**
- ❌ Controllers MVC nuevos → 🔴 CRÍTICA

---

### 2.2 Primary Constructors (§9)

**Regla:** Todos los servicios/endpoints usan Primary Constructors

**Comando:**
```bash
# Buscar constructores tradicionales en servicios
grep -r "public.*Service(" api/LuxuryApp.Application \
  --include="*.cs" \
  | grep -v " =>" \
  | wc -l
```

**Criterio de Paso:**
- ✅ 0 matches (todos usan Primary Constructors)

**Criterio de Fallo:**
- ❌ > 0 tradicionales → 🟠 ALTA

**Fix:**
```csharp
// ANTES
public class UserService
{
    private readonly IUserRepository _repo;
    public UserService(IUserRepository repo) => _repo = repo;
}

// DESPUÉS
public class UserService(IUserRepository repo)
{
    public Task<User> GetUser(string id) => repo.FindAsync(id);
}
```

---

### 2.3 ApiResponseDTO<T> (§9)

**Regla:** 100% de endpoints retornan `ApiResponseDTO<T>`

**Comando:**
```bash
# Buscar returns que no sean ApiResponseDTO
grep -r "return Ok\|return NotFound\|return BadRequest" \
  api/LuxuryApp.Api \
  --include="*.cs" \
  | grep -v "ApiResponseDTO" \
  | wc -l
```

**Criterio de Paso:**
- ✅ 0 matches (todos usan ApiResponseDTO)

**Criterio de Fallo:**
- ❌ > 0 matches → 🔴 CRÍTICA

---

### 2.4 Paginación (§9)

**Regla:** Usar `PaginationCommonDTO` + `BindAsync`, NO `[AsParameters]`

**Comando:**
```bash
# Buscar [AsParameters] usage
grep -r "\[AsParameters\]" \
  api/LuxuryApp.Application \
  --include="*.cs"

# Buscar BindAsync usage
grep -r "BindAsync" \
  api/LuxuryApp.Application \
  --include="*.cs" \
  | wc -l
```

**Criterio de Paso:**
- ✅ 0 `[AsParameters]`
- ✅ 100% endpoints paginados usan `BindAsync`

**Criterio de Fallo:**
- ❌ Encontrados `[AsParameters]` → 🔴 CRÍTICA

---

### 2.5 Testing (§16)

**Regla:** ≥70% cobertura en servicios críticos

**Comando:**
```bash
# Generar reporte de cobertura
dotnet test /p:CollectCoverage=true \
  /p:CoverageFormat=opencover \
  /p:Exclude="[*Tests]*" \
  LuxuryApp.Tests.csproj

# Verificar resultado
# Buscar: Line coverage >= 70%
```

**Criterio de Paso:**
- ✅ Line Coverage ≥ 70%
- ✅ Branch Coverage ≥ 60%

**Criterio de Fallo:**
- ❌ < 70% line coverage → 🟡 MEDIA

---

### 2.6 AutoMapper (§9)

**Regla:** Prohibido globalmente (usar `.Select()` + `.ToDto()`)

**Comando:**
```bash
# Buscar AutoMapper
grep -r "using AutoMapper\|IMapper\|automapper" \
  api/LuxuryApp.Application \
  --include="*.cs"
```

**Criterio de Paso:**
- ✅ 0 matches (no hay AutoMapper)

**Criterio de Fallo:**
- ❌ Encontrado AutoMapper → 🔴 CRÍTICA

---

### 2.7 DateTime.UtcNow (§9)

**Regla:** Inyectar `TimeProvider`, NO usar `DateTime.UtcNow` directo

**Comando:**
```bash
# Buscar DateTime.UtcNow
grep -r "DateTime.UtcNow" \
  api/LuxuryApp.Application \
  --include="*.cs"

# Buscar TimeProvider injection
grep -r "TimeProvider" \
  api/LuxuryApp.Application \
  --include="*.cs" \
  | wc -l
```

**Criterio de Paso:**
- ✅ 0 `DateTime.UtcNow`
- ✅ TimeProvider inyectado en servicios

**Criterio de Fallo:**
- ❌ Encontrado DateTime.UtcNow → 🟠 ALTA

---

## 🎯 AUDITORÍA 3: MOBILE DEVELOPER

### 3.1 Componente Móvil Obligatorio (§2.8, §15.4)

**Regla:** Cada CRUD web tiene versión móvil

**Comando:**
```bash
# Mismo que Frontend §1.5
find appsweb/angular/src/app/modules \
  -name "*-list.ts" \
  | while read f; do
      if ! grep -q "mobile" "$(dirname "$f")"; then
        echo "❌ FALTA: $f"
      fi
    done
```

**Criterio de Paso:**
- ✅ 100% de listas tienen -mobile

**Criterio de Fallo:**
- ❌ Listas sin -mobile → 🔴 CRÍTICA

---

### 3.2 Ionic Components (§3, §15.4-15.9)

**Regla:** Usar `ion-list`, `ion-item-sliding`, `ion-infinite-scroll`, NO `DynamicDialog`

**Comando:**
```bash
# Validar estructura mobile
grep -r "ion-list\|ion-item\|ion-infinite-scroll" \
  appsweb/angular/src/app/modules \
  --include="*.html" \
  | grep -v node_modules \
  | wc -l

# Buscar DynamicDialog en mobile
grep -r "DynamicDialog" \
  appsweb/angular/src/app/modules \
  --include="*.ts" \
  | grep -i mobile
```

**Criterio de Paso:**
- ✅ Componentes Ionic usados correctamente
- ✅ Cero DynamicDialog en mobile

**Criterio de Fallo:**
- ❌ DynamicDialog en mobile → 🟠 ALTA

---

### 3.3 Responsive Mobile (§15)

**Manual Test:**
```bash
# Abrir en Chrome DevTools
F12 → Toggle device toolbar → Pixel 5 (375px)

# Verificar:
□ Sin scroll horizontal
□ Touch targets ≥ 44×44px
□ Teclado no oculta inputs
□ Pull-to-refresh funcional (si aplica)
□ Infinite scroll funcional (si aplica)
```

**Criterio de Paso:**
- ✅ Todos los puntos verificados

**Criterio de Fallo:**
- ❌ Scroll horizontal → 🔴 CRÍTICA
- ❌ Touch targets < 44px → 🟠 ALTA
- ❌ Teclado oculta inputs → 🟠 ALTA

---

## 🎯 AUDITORÍA 4: FULL STACK DEVELOPER

### Combina Auditoría Frontend + Backend

**Comando integral:**
```bash
# Pre-push: Auditoría rápida
npm run audit:full-stack

# Que ejecuta:
npm run audit:frontend && \
dotnet run audit:backend && \
npm run audit:mobile
```

**Checklist:**
- ✅ Frontend: Strict, OnPush, @ui/*, wrappers
- ✅ Backend: Minimal API, Primary Constructors, ApiResponseDTO
- ✅ Contrato: DTOs alineados, rutas exactas
- ✅ Testing: 70%+ cobertura

---

## 🎯 AUDITORÍA 5: TECH LEAD / ARCHITECT

### Auditoría Integral de Módulo (§19)

**Ver:** `docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md`

**Comando:**
```bash
# Auditoría completa de módulo
npm run audit:module -- \
  --frontend <path-angular> \
  --backend <path-dotnet> \
  --deep
```

**Genera:**
- ✅ Reporte markdown en `docs/reporte_maestro/modulos/`
- ✅ Matriz front/back alignment
- ✅ Reglas de negocio documentadas
- ✅ Plan de acción por fase

---

## 📊 MATRIZ DE COMANDOS POR ROL

| Rol | Comando | Tiempo | Auditor |
|-----|---------|--------|---------|
| Frontend Senior | `npm run audit:frontend` | 2 min | Frontend Lead |
| Backend Developer | `dotnet run audit:backend` | 3 min | Backend Lead |
| Mobile Developer | `npm run audit:mobile` + manual | 10 min | Mobile Lead |
| Full Stack | `npm run audit:full-stack` | 5 min | Tech Lead |
| Tech Lead | `npm run audit:module --deep` | 2-4 h | CTO |

---

## 🚀 INTEGRACIÓN EN GIT HOOKS

### `.githooks/pre-commit`

```bash
#!/bin/bash

# Detectar rama y rol
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ $BRANCH == feature/frontend* ]]; then
  npm run audit:frontend
elif [[ $BRANCH == feature/backend* ]]; then
  dotnet run audit:backend
elif [[ $BRANCH == feature/mobile* ]]; then
  npm run audit:mobile
fi
```

---

## 📝 FORMATO DE REPORTE DE AUDITORÍA

Cuando falla una auditoría:

```markdown
# 🔴 Auditoría Fallida: Frontend Senior - PR #123

## Resumen
- 🔴 CRÍTICA: 2 violations
- 🟠 ALTA: 1 violation
- 🟡 MEDIA: 0 violations

## Hallazgos

### 1. Strict: false (§2.7) - 🔴 CRÍTICA
- **Archivo:** appsweb/angular/tsconfig.json
- **Problema:** `"strict": false` debe ser `true`
- **Fix:** `sed -i 's/"strict": false/"strict": true/' tsconfig.json`

### 2. PrimeNG import directo (§5) - 🔴 CRÍTICA
- **Archivo:** appsweb/angular/src/app/modules/admin/dashboard.ts
- **Línea:** 3
- **Problema:** `import { ButtonModule } from 'primeng/button'`
- **Fix:** `import { ButtonModule } from '@ui/primeng/button'`

### 3. OnPush missing (§2.4) - 🟠 ALTA
- **Archivo:** appsweb/angular/src/app/modules/admin/users-list.ts
- **Línea:** 12
- **Problema:** `@Component({` sin `changeDetection: OnPush`
- **Fix:** Agregar `changeDetection: OnPush,`

## Acción Requerida
1. Ejecutar fixes sugeridos
2. Reejecutar: `npm run audit:frontend`
3. Confirmar: "✅ All checks passed"
4. Re-push a PR
```

---

## 🔄 WORKFLOW DE CORRECCIÓN

```
1. Falla Auditoría en Pre-Push
        ↓
2. Dev lee Reporte
        ↓
3. Dev ejecuta Fixes (manuales + automáticos)
        ↓
4. Dev reejecutar Script
        ↓
5. ✅ Pasa → Push permitido
        ↓
6. PR code review (adicional)
```

---

## 📚 REFERENCIAS

- **[CONVENTIONS.md](CONVENTIONS.md)** — Reglas técnicas
- **[roles-y-perfiles.md](./roles-y-perfiles.md)** — Definición de roles
- **[gobernanza-convenciones.md](./gobernanza-convenciones.md)** — Framework general

---

**Vigencia:** 2026-07-27 - 2027-07-27  
**Próxima actualización:** Con cada major release de Angular/NET  
**Mantenido por:** Tech Lead + QA
