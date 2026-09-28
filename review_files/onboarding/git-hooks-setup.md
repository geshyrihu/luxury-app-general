# 🪝 Configuración de Git Hooks - Auditoría por Rol

**Propósito:** Automatizar verificación de cumplimiento de CONVENTIONS.md en pre-commit según rol de desarrollo.

**Vigencia:** 2026-07-27+

---

## 📋 HOOKS DISPONIBLES

| Hook | Ubicación | Propósito | Estado |
|------|-----------|-----------|--------|
| `pre-commit` | `.githooks/pre-commit` | Auditoría por rol + mojibake + design system | ✅ Actualizado |
| `pre-push` | `.githooks/pre-push` | Auditoría completa antes de push | ⏳ Próximo |

---

## ⚙️ CONFIGURACIÓN INICIAL

### Paso 1: Configurar git hooks path

```bash
# Una sola vez por clon
git config core.hooksPath .githooks
```

**Verificar:**
```bash
git config core.hooksPath
# Output: .githooks
```

### Paso 2: Hacer ejecutables (si es necesario en tu SO)

```bash
chmod +x .githooks/pre-commit
chmod +x .githooks/pre-push
```

### Paso 3: Confirmar que funcionan

```bash
# El hook debería ejecutarse automáticamente en el siguiente commit
git add .
git commit -m "test: verificar hooks"

# Output esperado:
# 🎯 Detectando rol por rama...
# 👨‍💻 Branch: feature/frontend-xyz
# ...
# ✅ Auditoría por rol pasada
# ✅ Sin mojibake
# ...
```

---

## 🎯 CÓMO FUNCIONA

### Pre-Commit Hook

**Flujo:**

```
1. 🎯 Detectar rol por rama
   ├─ feature/frontend* → npm run audit:frontend
   ├─ feature/mobile* → npm run audit:mobile
   ├─ feature/backend* → (próximo: dotnet run audit:backend)
   └─ feature/full-stack* → npm run audit:full-stack

2. 🔍 Escanear mojibake en archivos staged
   └─ Debe ser UTF-8 sin BOM

3. 🎨 Auditoría de Design System
   └─ npm run audit:design --staged

4. 🤖 Verificar reglas de agentes
   └─ No hardcodear reglas fuera de CONVENTIONS.md
```

**Si algún paso falla → El commit se bloquea**

---

## 🌿 NAMING DE RAMAS Y CORRESPONDENCIA

| Rama | Rol | Auditoría |
|------|-----|-----------|
| `feature/frontend-*` | Frontend Senior | `npm run audit:frontend` |
| `feature/mobile-*` | Mobile Developer | `npm run audit:mobile` |
| `feature/backend-*` | Backend Developer | `dotnet run audit:backend` (próximo) |
| `feature/full-stack-*` | Full Stack | `npm run audit:full-stack` |
| `fix/frontend-*` | Frontend Senior | `npm run audit:frontend` |
| `fix/mobile-*` | Mobile Developer | `npm run audit:mobile` |
| `fix/backend-*` | Backend Developer | `dotnet run audit:backend` |
| `hotfix/*` | Full Stack | `npm run audit:full-stack` |
| Otras ramas | N/A | Auditoría saltada |

**Nota:** El hook usa `case` en shell, así que `feature/frontend-auth`, `feature/frontend-form`, etc. se detectan como Frontend.

---

## ❌ SI EL HOOK FALLA

### Escenario 1: Auditoría Fallida

```bash
❌ AUDITORÍA FRONTEND FALLIDA
   Consulta docs/auditoria-por-rol.md para detalles
```

**Solución:**

```bash
# 1. Leer el error detallado
npm run audit:frontend

# 2. Aplicar los FIX sugeridos
# 3. Re-añadir cambios
git add .

# 4. Intentar commit nuevamente
git commit -m "feat: cambio"
```

### Escenario 2: Mojibake Detectado

```bash
❌ MOJIBAKE DETECTADO en archivos staged:
   [appsweb/angular/src/app/file.ts] mojibake in line 42
```

**Solución:**

```bash
# 1. Corregir mojibake
node scripts/fix-mojibake.mjs appsweb/angular/src

# 2. Re-añadir cambios
git add -u

# 3. Intentar commit nuevamente
git commit -m "feat: cambio"
```

### Escenario 3: Design System Violación

```bash
❌ FALLA EN DESIGN SYSTEM. Corrige las violaciones antes de hacer commit.
```

**Solución:**

```bash
# 1. Revisar qué falla
npm run audit:design

# 2. Aplicar fixes (refactor imports)
# 3. Re-añadir cambios
git add .

# 4. Intentar commit nuevamente
git commit -m "refactor: usar @ui/* correctamente"
```

---

## ⏭️ BYPASS (Usar con cuidado)

**Si necesitas saltarte los hooks (NO RECOMENDADO):**

```bash
# Bypass todos los hooks
git commit --no-verify -m "WIP: commit sin verificación"

# ⚠️ RIESGOS:
# - Código incumplidor llegará a la rama
# - CI/CD lo rechazará
# - Los compañeros lo encontrarán en code review
```

**Mejor opción:**

```bash
# Arreglar el problema en lugar de bypassear
# Los hooks están ahí para protegerte
```

---

## 📊 INTEGRACIÓN EN CI/CD

Cuando se implemente CI/CD (GitHub Actions), agregar:

```yaml
# .github/workflows/pre-commit.yml

name: Pre-Commit Checks

on: [pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: "Audit Frontend"
        if: contains(github.head_ref, 'frontend')
        run: cd appsweb/angular && npm run audit:frontend
      
      - name: "Audit Mobile"
        if: contains(github.head_ref, 'mobile')
        run: cd appsweb/angular && npm run audit:mobile
      
      - name: "Audit Backend"
        if: contains(github.head_ref, 'backend')
        run: cd api && dotnet run audit:backend
      
      - name: "Mojibake Scan"
        run: node scripts/scan-mojibake.mjs appsweb/angular/src
```

---

## 🔧 CREAR NUEVO HOOK

### Template: pre-push (Próximo)

```sh
#!/bin/sh
# Pre-push hook: auditoría completa antes de push
# Ejecución: antes de git push

echo "🔍 Ejecutando auditoría pre-push completa..."

BRANCH=$(git rev-parse --abbrev-ref HEAD)

case "$BRANCH" in
  feature/frontend*)
    cd appsweb/angular || exit 1
    npm run audit:frontend || exit 1
    cd - > /dev/null || exit 1
    ;;
  feature/mobile*)
    cd appsweb/angular || exit 1
    npm run audit:mobile || exit 1
    cd - > /dev/null || exit 1
    ;;
  # ... más casos
esac

echo "✅ Auditoría pre-push exitosa"
exit 0
```

---

## 📝 LOGS Y DEBUGGING

### Ver qué ejecuta el hook

```bash
# Enable git hook debug
GIT_TRACE=1 git commit -m "test"

# Output:
# trace: 'git-hooks/pre-commit'
# ...ejecución del hook...
```

### Desabilitar hooks temporalmente

```bash
# Para esta sesión solo
export GIT_SKIP_HOOKS=1
git commit -m "..."

# Luego:
unset GIT_SKIP_HOOKS
```

---

## ✅ CHECKLIST: Hooks Configurados

- [ ] `git config core.hooksPath .githooks`
- [ ] `.githooks/pre-commit` es ejecutable
- [ ] `.githooks/pre-push` es ejecutable
- [ ] Probó: `git commit` en rama feature/frontend*
- [ ] Probó: commit bloqueado cuando falla auditoría
- [ ] Probó: commit exitoso cuando pasa auditoría
- [ ] Comprendió naming de ramas (feature/frontend*, etc.)
- [ ] Leyó docs/auditoria-por-rol.md

---

## 🔗 REFERENCIAS

- **[docs/auditoria-por-rol.md](./auditoria-por-rol.md)** — Criterios de auditoría
- **[docs/scripts-auditoria.md](./scripts-auditoria.md)** — Scripts ejecutables
- **[docs/roles-y-perfiles.md](./roles-y-perfiles.md)** — Definición de roles
- **[.githooks/pre-commit](../.githooks/pre-commit)** — Hook implementation

---

## 📋 TROUBLESHOOTING

| Problema | Causa | Solución |
|----------|-------|----------|
| Hook no ejecuta | `core.hooksPath` no configurado | `git config core.hooksPath .githooks` |
| "Permission denied" | Hook no es ejecutable | `chmod +x .githooks/pre-commit` |
| Auditoría no falla cuando debería | Rama no coincide con patrón | Renombrar rama: `git branch -m feature/frontend-auth` |
| Want bypass (WIP) | Necesita commmit sin verificación | `git commit --no-verify` (NO RECOMENDADO) |

---

**Última actualización:** 2026-07-27  
**Mantenido por:** Tech Lead
