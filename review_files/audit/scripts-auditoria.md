# 🔍 Scripts de Auditoría por Rol

**Propósito:** Instrucciones ejecutables para validar cumplimiento de CONVENTIONS.md por rol de development.

**Vigencia:** 2026-07-27+

---

## 📋 ÍNDICE DE SCRIPTS

| Rol | Script | Comando | Archivo | Estado |
|-----|--------|---------|---------|--------|
| **Frontend Senior** | audit:frontend | `npm run audit:frontend` | `appsweb/angular/scripts/audit-frontend-senior.mjs` | ✅ Listo |
| **Mobile Developer** | audit:mobile | `npm run audit:mobile` | `appsweb/angular/scripts/audit-mobile-developer.mjs` | ✅ Listo |
| **Full Stack** | audit:full-stack | `npm run audit:full-stack` | Combina Frontend + Mobile | ✅ Listo |
| **Backend Developer** | audit:backend | `dotnet run audit:backend` | `api/LuxuryApp.Tests/` | ⏳ Próximo |
| **Tech Lead** | audit:module --deep | Ver §19 | `docs/reporte_maestro/` | ✅ Listo |

---

## 🎯 CÓMO EJECUTAR

### **Frontend Senior**

```bash
# Verificar cumplimiento de §2, §3, §5, §6, §7, §8, §15
npm run audit:frontend

# Output esperado:
# ════════════════════════════════════════════════════════════
# 📊 RESUMEN DE AUDITORÍA: Frontend Senior
# ════════════════════════════════════════════════════════════
# 
# ✅ AUDITORÍA EXITOSA
# 
# Todas las verificaciones pasaron (7/7)
```

**Verificaciones incluidas:**
1. ✅ Strict TypeScript (`strict: true`)
2. ✅ ChangeDetectionStrategy.OnPush
4. ✅ Wrappers con sufijo `-wrapper`
5. ✅ Componentes móviles en CRUD
6. ✅ Naming convention
7. ✅ UI Audit (npm run audit:ui)

---

### **Mobile Developer**

```bash
# Verificar cumplimiento de §2, §13, §15
npm run audit:mobile

# Output esperado:
# 📱 RESUMEN DE AUDITORÍA: Mobile Developer
# ════════════════════════════════════════════════════════════
# ✅ AUDITORÍA EXITOSA
# Todas las verificaciones pasaron (5/5)
```

**Verificaciones incluidas:**
1. ✅ Componentes móviles obligatorios
2. ✅ Componentes Ionic (ion-list, ion-item, ion-infinite-scroll)
3. ✅ Responsive breakpoints (375px, 768px)
4. ✅ Strict TypeScript
5. ✅ Patrón B (XDesktop + XMobile)

---

### **Full Stack Developer**

```bash
# Combina Frontend + Mobile
npm run audit:full-stack

# Equivalente a:
# npm run audit:frontend && npm run audit:mobile
```

---

### **Backend Developer** (Próximo)

```bash
# En api/
cd api

# Ejecutar auditoría backend (cuando se implemente)
dotnet run audit:backend

# Verificaciones:
# □ Minimal APIs (no MVC)
# □ Primary Constructors
# □ ApiResponseDTO<T>
# □ PaginationCommonDTO + BindAsync
# □ Testing 70%+
# □ Cero AutoMapper
# □ TimeProvider (no DateTime.UtcNow)
```

---

## 🔴 INTERPRET ACIÓN DE RESULTADOS

### **CRÍTICA (🔴) — Bloquea Merge**

```
❌ CRÍTICA (2):

  1. Strict TypeScript
     "strict": true no está configurado en tsconfig.json
     FIX: Actualizar tsconfig.json

  2. Catálogo UI
```

**Acción:**
1. Leer cada mensaje crítico
2. Aplicar los FIX sugeridos
3. Reejecutar el script
4. Si sigue fallando, consultar `docs/auditoria-por-rol.md`

---

### **ALTA (🟠) — Bloquea en Patrón**

```
🟠 ADVERTENCIAS (1):

  1. Wrappers
     Encontrados 2 archivo(s) con prefijo "wrapper-". Deben usar sufijo "-wrapper"
     FIX: Renombrar wrapper-name.ts → name-wrapper.ts
```

**Acción:**
1. Revisar si es patrón recurrente (>1 archivo)
2. Si es recurrente, es bloqueo
3. Si es aislado, comentario en PR

---

### **MEDIA (🟡) — Comentario en PR**

```
🟡 COMENTARIO:

  1. Naming Convention
     Encontrados 1 archivo(s) con sufijo "Component". Prohibido en §7
     FIX: Usar kebab-case sin sufijo Component en el archivo
```

**Acción:**
1. Comentar en PR
2. No bloquea merge
3. Preferido pero no obligatorio

---

## 🛠️ DESARROLLO DE NUEVOS SCRIPTS

### Estructura de un Script de Auditoría

```javascript
// ✅ Respetar estructura:
// 1. Header con referencia a §XXX
// 2. Función para cada verificación
// 3. Acumular failures/warnings
// 4. Resumen al final
// 5. Exit code 0/1

function checkSomething() {
  log('\n[N/M] Verificando Regla (§XX)', 'blue');

  const { output } = exec('comando de verificación');

  if (condicion_falla) {
    failures.push({
      severity: 'critical|high|medium',
      check: 'Nombre de Verificación',
      message: 'Descripción clara del problema',
      fix: 'Cómo solucionarlo',
    });
  } else {
    log(`${icons.check} Mensaje de éxito`, 'green');
    passCount++;
  }
}

function printSummary() {
  // Mostrar failures, warnings, y exit code
  return failures.length > 0 ? 1 : 0;
}
```

---

## 📊 INTEGRACIÓN EN CI/CD (Próximo)

Cuando se implemente CI/CD, agregar:

```yaml
# .github/workflows/audit.yml

name: Auditoría por Rol

on: [pull_request]

jobs:
  audit-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd appsweb/angular && npm run audit:frontend

  audit-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd appsweb/angular && npm run audit:mobile

  audit-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
      - run: cd api && dotnet run audit:backend
```

---

## 🔗 REFERENCIAS

- **[auditoria-por-rol.md](./auditoria-por-rol.md)** — Criterios detallados por rol
- **[gobernanza-convenciones.md](./gobernanza-convenciones.md)** — Framework de gobernanza
- **[CONVENTIONS.md](CONVENTIONS.md)** — Reglas técnicas obligatorias
- **Scripts fuente:** `appsweb/angular/scripts/audit-*.mjs`

---

## 📝 NOTAS

- Los scripts son **no destructivos** (no modifican código)
- Usa **grep/find** para búsquedas rápidas
- Referencia a **CONVENTIONS.md** en mensajes de error
- Suggest **FIX** específicos en cada fallo
- Exit code **1 si hay críticas**, **0 si pasa**

---

**Última actualización:** 2026-07-27  
**Mantenido por:** Tech Lead
