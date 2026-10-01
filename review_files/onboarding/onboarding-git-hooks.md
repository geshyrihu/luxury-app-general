# 🚀 Onboarding: Git Hooks & Auditoría por Rol

**Para:** Nuevo developer después de clonar el repo  
**Tiempo:** 5 minutos  
**Requisitos:** Git, Node.js, .NET (si es backend)

---

## ⚡ SETUP RÁPIDO (Hazlo primero)

### 1. Configurar Git Hooks

```bash
cd D:\repos\luxuryapp-api  # o tu ruta del clone

git config core.hooksPath .githooks
```

**Verificar:**
```bash
git config core.hooksPath
# Debe mostrar: .githooks
```

### 2. Hacer Ejecutables (si es necesario)

```bash
chmod +x .githooks/pre-commit
chmod +x .githooks/pre-push
```

### 3. Probar que funciona

```bash
# Crea una rama de prueba
git checkout -b feature/test-hooks

# Realiza un cambio mínimo
echo "test" > test.txt
git add test.txt

# Intenta commit (debería ejecutar auditoría)
git commit -m "test: verificar hooks"

# Output esperado:
# 🎯 Detectando rol por rama...
# 👨‍💻 Branch: feature/test-hooks
# ✅ Auditoría por rol pasada
# ✅ Sin mojibake
# ...
# [feature/test-hooks xxx] test: verificar hooks
```

**Limpiar rama de prueba:**
```bash
git checkout main
git branch -D feature/test-hooks
rm test.txt
```

---

## 🎯 ANTES DE TU PRIMER COMMIT

### 1. Identifica tu Rol

Abre [docs/roles-y-perfiles.md](./roles-y-perfiles.md) y encuentra tu rol:

- 👨‍💻 **Frontend Senior** → feature/frontend-*
- 📱 **Mobile Developer** → feature/mobile-*
- 🔧 **Backend Developer** → feature/backend-*
- 🎯 **Full Stack** → feature/full-stack-*

### 2. Nombra tu Rama Correctamente

```bash
# ✅ BIEN: Nombre de rama según rol
git checkout -b feature/frontend-auth-refactor    # Frontend
git checkout -b feature/mobile-qr-scanner          # Mobile
git checkout -b feature/backend-migration          # Backend
git checkout -b feature/full-stack-payment         # Full Stack

# ❌ MAL: Nombres que no se detectan
git checkout -b refactor-auth                      # No se auditará
git checkout -b fix/something                      # No se auditará
```

### 3. Realiza tus Cambios

```bash
# Edita archivos según tu rol
git add .
git commit -m "feat: descripción de cambio"

# El hook automáticamente:
# 1. Detecta tu rama (feature/frontend-*)
# 2. Ejecuta npm run audit:frontend
# 3. Si pasa → commit exitoso ✅
# 4. Si falla → commit bloqueado, lee los errores ❌
```

---

## ❓ PREGUNTAS FRECUENTES

### ¿Qué hace el hook?

Automáticamente ejecuta verificaciones ANTES de cada commit:

```
1. 🎯 Detecta tu rol por el nombre de rama
2. ▶️  Ejecuta auditoría específica (npm run audit:frontend, etc.)
3. 🔍 Si falla → te bloquea el commit + te dice qué arreglar
4. ✅ Si pasa → tu commit se realiza
```

### ¿Cómo arreglo un error de auditoría?


```bash
# 1. Leer el error completo (te lo dice el hook)
# 2. Aplicar el FIX sugerido (cambia imports a @ui/*)
# 3. Re-añadir cambios
git add .

# 4. Intentar commit nuevamente
git commit -m "feat: cambio"
```

### ¿Puedo saltarme el hook?

```bash
# SÍ, pero NO LO HAGAS (sirven para protegerte)
git commit --no-verify -m "..."

# ⚠️ El código incumplidor:
# - Llegará a la rama
# - CI/CD lo rechazará
# - Los compañeros lo encontrarán en code review
# Es mejor arreglarlo ahora
```

### ¿Qué pasa si mi rama no se detecta?

```bash
# El hook te dirá:
# "Branch: refactor-auth (auditoría genérica saltada)"

# Solución: Renombra rama con patrón correcto
git branch -m refactor-auth feature/frontend-refactor

# Luego:
git commit -m "feat: cambio"
# Ahora se ejecutará npm run audit:frontend
```

### ¿Qué si node/npm no está disponible?

```bash
# El hook falla porque no puede ejecutar npm run audit:*

# Solución:
# 1. Verifica que npm esté en PATH
npm --version

# 2. Reinstala dependencias
cd appsweb/angular
npm install

# 3. Intenta commit nuevamente
cd ../.. && git commit -m "feat: cambio"
```

---

## 📚 REFERENCIAS

| Tema | Archivo | Leer si... |
|------|---------|-----------|
| Configuración detallada | [docs/git-hooks-setup.md](./git-hooks-setup.md) | Necesitas troubleshooting o entender más |
| Tu rol específico | [docs/roles-y-perfiles.md](./roles-y-perfiles.md) | Quieres ver qué reglas aplican a ti |
| Qué verifica el hook | [docs/auditoria-por-rol.md](./auditoria-por-rol.md) | Quieres ver exactamente qué se verifica |
| Scripts de auditoría | [docs/scripts-auditoria.md](./scripts-auditoria.md) | Quieres ejecutar auditoría manualmente |

---

## ✅ CHECKLIST: Estoy listo para hacer commits

- [ ] Ejecuté `git config core.hooksPath .githooks`
- [ ] Verifiqué con `git config core.hooksPath` que dice ".githooks"
- [ ] Hice ejecutables los hooks (si necesario)
- [ ] Probé con rama de prueba `feature/test-hooks`
- [ ] Leí [docs/roles-y-perfiles.md](./roles-y-perfiles.md) y encontré mi rol
- [ ] Entiendo el naming de ramas (feature/frontend-*, etc.)
- [ ] Estoy listo para hacer mi primer commit real

---

## 🆘 SI ALGO ESTÁ ROTO

1. **Verifica configuración:**
   ```bash
   git config core.hooksPath
   # Debe mostrar: .githooks
   ```

2. **Lee el error completo:**
   Cuando el hook falla, el commit muestra el error. **Léelo completo**, incluye el "FIX:" sugerido.

3. **Consulta docs:**
   - [docs/git-hooks-setup.md](./git-hooks-setup.md) — Troubleshooting
   - [docs/auditoria-por-rol.md](./auditoria-por-rol.md) — Criterios de auditoría

4. **Último recurso:**
   Pregunta a Tech Lead en Slack #dev-onboarding

---

**Bienvenido al equipo! 🚀**

Tu setup está completo. Ahora:
1. Crea una rama según tu rol
2. Haz cambios
3. El hook se ejecutará automáticamente

**Los hooks te protegen.**

---

**Última actualización:** 2026-07-27
