# 🎓 Tech Lead: Cómo Onboardear Nuevo Developer

**Duración:** 15 minutos (dirigido)  
**Rol:** Tech Lead / Mentor  
**Resultado:** Developer productivo en Día 1

---

## Antes: Preparar Ambiente

```bash
# Verificar que repo está actualizado
git pull origin main

# Verificar hooks están actualizados
git config core.hooksPath
# Debe mostrar: .githooks

# Verificar scripts de auditoría existen
ls appsweb/angular/scripts/audit-*.mjs
# Debe mostrar: audit-frontend-senior.mjs, audit-mobile-developer.mjs

# En .NET (si necesario)
cd api
dotnet build  # Verificar que compila
```

---

## Con el Developer (15 min)

### Minuto 0-2: Setup Git Hooks

**Tú das instrucción:**

```bash
# Developer corre esto en su máquina
git config core.hooksPath .githooks

# Verificar que funciona
git config core.hooksPath
# Debe mostrar: .githooks
```

**Verificar:** Pregunta al dev: *"¿Qué muestra el comando anterior?"* Debe decir `.githooks`.

---

### Minuto 2-5: Encontrar Rol

**Abre juntos:**
[docs/roles-y-perfiles.md](./roles-y-perfiles.md)

**Preguntas:**
- ¿Cuál es tu background? (Angular, .NET, mobile, etc.)
- ¿Qué fue lo último que trabajaste?
- ¿Cuál de estos roles te representa mejor?

**Tú señalas 2-3 roles candidatos:**
```
Si es Angular dev:
  → ROL 2: Frontend Senior (si senior)
  → ROL 4: Mobile Developer (si mobile)
  → ROL 1: Full Stack (si toca backend)

Si es .NET dev:
  → ROL 3: Backend Developer
  → ROL 1: Full Stack (si toca frontend)

Si es nuevo:
  → ROL 1: Full Stack (aprende ambos)
```

**Dev elige su rol.**

---

### Minuto 5-10: Leer Reglas

**Abre juntos:**
[CONVENTIONS.md](CONVENTIONS.md)

**Según rol:**

```
Frontend → Lee §2, §3, §5, §6, §7, §8, §15
Backend → Lee §1, §9, §16, §18
Mobile → Lee §2, §13, §15
Full Stack → Lee §1-22 (o §1-9 + §2-3 + §15 hoy, resto luego)
```

**Tú señalas lo más importante:**

*Frontend:*
- "§2: `strict: true` obligatorio, cero `any`"
- "§5: Nunca importes primeng directo, usa `@ui/`"
- "§6: Wrappers con sufijo `-wrapper`"

*Backend:*
- "§9: Minimal APIs, NO MVC"
- "§9: Primary Constructors obligatorio"
- "§16: 70% cobertura mínima en tests"

*Mobile:*
- "§2: `strict: true`"
- "§13: Componentes móviles para cada CRUD"
- "§15: Responsive 375px + 768px"

**Dev lee en silencio 3-5 min mientras tú estás ahí por si preguntas.**

---

### Minuto 10-12: Crear Primera Rama

**Instrucción:**

```bash
# Dev corre esto
git checkout -b feature/ROLE-description

# Ejemplos según rol:
git checkout -b feature/frontend-auth-refactor     # Frontend
git checkout -b feature/mobile-qr-integration       # Mobile
git checkout -b feature/backend-user-migration      # Backend
git checkout -b feature/full-stack-payment-flow     # Full Stack
```

**Verificar:** Pregunta: *"¿Qué rama creaste?"* Debe contener `frontend`, `mobile`, `backend`, o `full-stack`.

---

### Minuto 12-15: Probar Hooks

**Instrucción:**

```bash
# Dev hace cambio trivial
echo "test" > test.txt
git add test.txt

# Intenta commit (el hook ejecutará)
git commit -m "test: verificar hooks"

# El hook automáticamente:
# 1. Detecta rama (feature/ROLE-*)
# 2. Ejecuta auditoría según rol
# 3. Muestra resultado
```

**Si pasa ✅:**
```
✅ Auditoría por rol pasada
✅ Sin mojibake
[feature/ROLE-xxx] test: verificar hooks
```

Excelente, clean up:
```bash
git checkout main
git branch -D feature/ROLE-description
rm test.txt
```

**Si falla ❌:**
```
❌ AUDITORÍA FRONTEND FALLIDA
🔴 CRÍTICA (1):
  1. Strict TypeScript
```

Esto es normal. Di al dev:

> "Ves? El hook acababa de bloquearte un commit incumplidor. Ahora vamos a arreglarlo juntos."

```bash
# Dev arregla el problema (según el hook)
# Luego reintenta
git add .
git commit -m "test: verificar hooks"
# Ahora pasa ✅
```

---

## Después: Entrega

**Dile al dev:**

> "Los hooks que acabas de ver se ejecutan automáticamente en cada commit. Te protegen.
> 
> Si algo falla:
> 1. **Lee el error** — te dice exactamente qué arreglar
> 2. **Arregla** el código
> 3. **Reintenta commit**
> 
> Si no entiendes el error:
> - Abre [docs/auditoria-por-rol.md](./auditoria-por-rol.md)
> - Ejecuta: `npm run audit:frontend` (o tu rol)
> - Pregúntame en Slack"

**Entrega enlaces rápidos:**

| Necesito... | Ir a... |
|---|---|
| Mi rol | [roles-y-perfiles.md](./roles-y-perfiles.md) |
| Reglas | [CONVENTIONS.md](CONVENTIONS.md) |
| Auditoría falla | [auditoria-por-rol.md](./auditoria-por-rol.md) |
| Troubleshooting | [git-hooks-setup.md](./git-hooks-setup.md) |
| Contacto | Slack #dev-onboarding |

---

## ✅ Checklist: Dev está Listo

- [ ] Dev ejecutó `git config core.hooksPath .githooks`
- [ ] Dev encontró su rol en roles-y-perfiles.md
- [ ] Dev leyó secciones de CONVENTIONS.md para su rol
- [ ] Dev creó rama con patrón correcto
- [ ] Dev probó hooks en rama de prueba
- [ ] Dev entiende que hooks lo protegen
- [ ] Dev sabe dónde consultar dudas

**Si todo ✅:** Dev está productivo **HOY MISMO.**

---

## Troubleshooting Común

### "El hook no ejecuta"

```bash
git config core.hooksPath
# Debe mostrar: .githooks
# Si no → ejecutar: git config core.hooksPath .githooks
```

### "Permission denied"

```bash
chmod +x .githooks/pre-commit
# Solo en Mac/Linux, Windows no tiene este problema
```

### "Mi rama no se detectó"

```bash
# Rama: refactor-auth ❌ (no tiene rol)
# Solución:
git branch -m refactor-auth feature/frontend-refactor ✅
```

### "El hook falla pero no entiendo por qué"

```bash
# Ejecutar auditoría manualmente
npm run audit:frontend    # si eres frontend
npm run audit:mobile      # si eres mobile

# Ver error completo, luego arreglar
```

---

## Después del Primer Día

**Tú verificas:**
- ¿Dev hizo su primer commit?
- ¿Pasó el hook sin problemas?
- ¿Dev entiende por qué falla (si falló)?

**Si problemas:**
- Sesión de 15 min de troubleshooting
- Revisar documentación juntos
- Ajustar si es necesario

**Si todo OK:**
- Dev está completamente onboarded
- Productivo desde día 1
- Protegido por hooks automáticos

---

## Notas para Ti

### Qué es "éxito de onboarding"

✅ Developer:
- Configuró hooks correctamente
- Entiende su rol
- Sabe qué reglas se aplican
- Pasó prueba con hooks
- Sabe dónde buscar si duda
- Está listo para PR real

### Qué evitar

❌ NO:
- Dar toda la documentación de golpe
- Esperar que dev lea todo antes de empezar
- Dejar que dev haga --no-verify
- Ignorar si dev no entiende el error
- Permitir que dev ignore el hook

### Qué sí hacer

✅ SÍ:
- Guiarle paso a paso (15 min)
- Dejar que experimente (crear rama, ver hook)
- Estar disponible si duda
- Explicar por qué existe cada regla
- Ser mentira si necesita ajustes

---

## Preguntas para Verificar Entendimiento

Al final, hazle estas preguntas al dev:

1. **"¿Qué hace el hook automáticamente?"**
   - Debe decir: "Detecta mi rama, ejecuta auditoría según rol, bloquea si falla"

2. **"¿Qué hago si el hook falla?"**
   - Debe decir: "Leo el error, arreglo el problema, reintento commit"

3. **"¿Puedo hacer --no-verify?"**
   - Debe decir: "Sí pero NO, el hook me protege"

4. **"¿Dónde busco si no entiendo un error?"**
   - Debe decir: "auditoria-por-rol.md, CONVENTIONS.md, o pregunto a Tech Lead"

5. **"¿Cuál es mi rol?"**
   - Debe decir: "Frontend Senior" (o su rol específico)

---

**Si respondió bien a todas:** ✅ **Onboarding exitoso.**

---

**Última actualización:** 2026-07-27  
**Usado por:** Tech Lead  
**Duración:** 15 minutos  
**Resultado:** Developer productivo Día 1
