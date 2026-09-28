# Developer Onboarding

**Ultima revision:** 2026-08-06 (consolidado de DEVELOPER_ONBOARDING.md viejo)  
**Tiempo total:** 15 minutos  
**Requisitos:** Git, Node.js (frontend) o .NET (backend)

## Proposito

Definir el flujo minimo para que un developer nuevo pueda empezar a trabajar sin
romper el sistema de convenciones desde su primer commit.

## Objetivo de salida

Al terminar el onboarding, el developer debe:

- tener hooks configurados y verificados
- conocer su rol identificable
- saber exactamente que documentos leer primero
- crear ramas con patron correcto que el hook entienda
- haber probado la auditoria de su rol
- saber como solicitar auditorias, planes o remediaciones a un agente
- conocer troubleshooting basico si algo falla

---

## ⏱️ Paso 1: Configurar Git Hooks (3 minutos)

Despues de clonar el repo:

```bash
cd D:\repos\luxuryapp-api  # Tu ruta del clone

# Configurar hooks
git config core.hooksPath .githooks

# Verificar
git config core.hooksPath
# Debe mostrar: .githooks
```

✅ **Hecho.** Los hooks ahora se ejecutarán automáticamente en cada commit.

---

## 📋 Paso 2: Identificar tu Rol (3 minutos)

Eres uno de estos perfiles:

- 👨‍💻 **Frontend Senior** — Angular, componentes UI, responsive
- 📱 **Mobile Developer** — Ionic, componentes móviles, touch
- 🔧 **Backend Developer** — .NET, APIs, bases de datos
- 🎯 **Full Stack Developer** — Frontend + Backend
- 🔒 **Security / DevOps** — Infraestructura, secretos, deployment
- 📊 **Tech Lead** — Auditoría, mentoring, decisiones arquitectónicas

**Tu rol:** _________________ (escribe aquí)

📖 **Leer también:** [governance-by-role.md](../core/governance-by-role.md)

---

## 📖 Paso 3: Leer Reglas de tu Rol (5 minutos)

Siempre empezar por: [CONVENTIONS.md](../CONVENTIONS.md)

Luego lee las secciones que aplican a tu rol:

### 👨‍💻 Si eres Frontend Senior:
```
CONVENTIONS.md:
  §2  — Angular 22 (strict TypeScript, OnPush, standalone)
  §3  — UX/UI (accesibilidad, responsive)
  §5  — Catálogo UI (@ui/*, diseño system)
  §6  — Wrappers (-wrapper suffix)
  §7  — Naming conventions
  §15 — Responsive Design
```

### 🔧 Si eres Backend Developer:
```
CONVENTIONS.md:
  §1  — Shared (DTO, enums, multi-tenant)
  §9  — Backend (.NET, Minimal APIs, Primary Constructors)
  §16 — Testing (70% cobertura mínima)
  §18 — Infraestructura (logging, error handling)
```

### 📱 Si eres Mobile Developer:
```
CONVENTIONS.md:
  §2  — Angular 22 (strict TypeScript)
  §13 — Ionic Components
  §15 — Responsive (375px mobile, 768px tablet)
```

### 🎯 Si eres Full Stack:
```
CONVENTIONS.md: Todas las secciones (§1-22)
```

---

## 🌿 Paso 4: Crear tu Primera Rama (2 minutos)

**Patrón correcto según rol:**

```bash
# Frontend
git checkout -b feature/frontend-xyz

# Mobile
git checkout -b feature/mobile-xyz

# Backend
git checkout -b feature/backend-xyz

# Full Stack
git checkout -b feature/full-stack-xyz

# Fix rápido (cualquier rol)
git checkout -b fix/frontend-bug
```

⚠️ **IMPORTANTE:** El nombre de rama DEBE contener tu rol (`frontend`, `mobile`, `backend`, `full-stack`).  
Así el hook sabe qué auditoría ejecutar.

---

## ✅ Paso 5: Probar que Funciona (2 minutos)

```bash
# Realiza un cambio pequeño
echo "test" > test.txt

# Agrégalo
git add test.txt

# Intenta commit (el hook se ejecutará automáticamente)
git commit -m "test: verificar hooks"

# Verás output como:
# 🎯 Detectando rol por rama...
# 👨‍💻 Branch: feature/frontend-xyz
# ✅ Auditoría por rol pasada
# ✅ Sin mojibake
# ...
# [feature/frontend-xyz abc123] test: verificar hooks
```

**Si todo pasó:** ✅ Los hooks funcionan correctamente.

**Si falla:** Lee el error (dice exactamente qué arreglar), arréglalo, y reintenta commit.

**Limpiar rama de prueba:**
```bash
git checkout main
git branch -D feature/frontend-xyz
rm test.txt
```

---

## 🎯 Paso 6: Ahora Ya Puedes Trabajar

```bash
# Crea rama real según tu rol
git checkout -b feature/frontend-auth-refactor

# Edita archivos
# ... tus cambios ...

# Haz commit (el hook verifica automáticamente)
git add .
git commit -m "feat: auth refactor"

# Si pasa auditoría → commit exitoso ✅
# Si falla → commit bloqueado, lee error y arregla ❌
```

---

## ❓ Preguntas Frecuentes

### ¿Qué hace el hook automáticamente?

```
1. Detecta tu rama (feature/frontend-*, etc.)
2. Ejecuta auditoría según rol
3. Si pasa → commit ✅
4. Si falla → commit bloqueado + muestra error ❌
```

### ¿Puedo saltarme el hook?

```bash
git commit --no-verify -m "..."
```

**NO LO HAGAS.** El hook está diseñado para protegerte. Si falla, arregla el problema en lugar de bypassear.

### ¿Qué si mi rama no se detecta?

El hook te dirá: `"Branch: refactor-auth (auditoría genérica saltada)"`

**Solución:** Renombra rama:
```bash
git branch -m refactor-auth feature/frontend-refactor
git commit -m "feat: cambio"
# Ahora se ejecutará npm run audit:frontend
```

### ¿Qué pasa si un error es confuso?

1. **Lee el error completo** — te dice exactamente qué arreglar
2. **Consulta documentación:**
   - Tu rol: [governance-by-role.md](../core/governance-by-role.md)
   - Criterios de auditoría: [audit-checklist.md](../audit/audit-checklist.md)
   - Troubleshooting: Ver sección abajo
3. **Pregunta a Tech Lead** en Slack #dev-onboarding

### ¿Cómo solicito auditoria, plan o remediacion a agentes?

Leer: [agent-task-catalog.md](../agent-task-catalog.md)

El developer debe saber que:

- una auditoria siempre pide rutas exactas
- una remediacion no arranca sin plan aprobado
- un cambio sensible no se ejecuta por intuicion
- si falta una regla, se reporta y se propone alta

---

## 📚 Referencias Rápidas

| Necesito... | Ir a... |
|---|---|
| Entender mi rol | [governance-by-role.md](../core/governance-by-role.md) |
| Ver reglas de código | [CONVENTIONS.md](../CONVENTIONS.md) |
| Entender auditoría | [audit-checklist.md](../audit/audit-checklist.md) |
| Solicitar trabajo a agentes | [agent-task-catalog.md](../agent-task-catalog.md) |
| Troubleshooting hooks | Ver sección abajo |
| Estructura proyecto | ⚠️ No existe `README.md` en la raíz del repo (verificado 2026-09-09) — ver [AGENTS.md](../../AGENTS.md) |
| Dominios por módulo | [module-master-domain-map.md](../catalogs/module-master-domain-map.md) |

---

## ✅ Checklist: Estoy Listo

- [ ] Ejecuté `git config core.hooksPath .githooks`
- [ ] Identifiqué mi rol (Frontend, Backend, Mobile, Full Stack, etc.)
- [ ] Leí las secciones de CONVENTIONS.md para mi rol
- [ ] Creé rama de prueba con patrón correcto (`feature/frontend-*`, etc.)
- [ ] Probé con rama de prueba y el hook funcionó
- [ ] Limité la rama de prueba
- [ ] Entiendo que el hook me protege (no lo saltaré sin razón válida)
- [ ] Sé dónde consultar si tengo dudas
- [ ] Entiendo que no puedo asumir reglas faltantes

**Si respondiste "sí" a todo:** ✅ **Estás listo para hacer commits reales.**

---

## 🆘 Si Algo Está Roto

### Verificar setup:
```bash
git config core.hooksPath
# Debe mostrar: .githooks
```

### El hook no ejecuta:
```bash
# Puede ser problema de permisos (Mac/Linux)
chmod +x .githooks/pre-commit
```

### Auditoría falla pero no entiendo por qué:
```bash
# Ejecutar auditoría manualmente para ver error completo
npm run audit:frontend    # si eres frontend
npm run audit:mobile      # si eres mobile
dotnet run audit:backend  # si eres backend
```

### La rama se ejecuta con auditoría genérica, no mi rol:
- Verifica que el nombre de rama contenga `frontend`, `backend`, `mobile`, o `full-stack`
- Ejemplo: `feature/frontend-xyz` (contiene "frontend" ✅)
- Contraejemplo: `feature/refactor-auth` (no contiene rol ❌)

### Último recurso:
Pregunta a Tech Lead en Slack #dev-onboarding o crea una issue en GitHub con el error completo.

---

**¡Bienvenido al equipo! 🚀**

Tu setup está completo. Ahora:
1. Crea una rama según tu rol
2. Haz cambios
3. El hook se ejecutará automáticamente
4. Si pasa → estás listo para hacer PR
5. Si falla → el hook te dice qué arreglar

**Los hooks te protegen, no te limitan.**

---

**Última actualización:** 2026-08-06  
**Consolidado de:** DEVELOPER_ONBOARDING.md (eliminado 2026-08-06, contenido absorbido)  
**Próximo paso:** [CONVENTIONS.md](../CONVENTIONS.md) secciones de tu rol


