# 🔍 Scripts de Auditoría - client/angular/scripts/

Colección de scripts de verificación y auditoría para validar cumplimiento de CONVENTIONS.md por rol de desarrollo.

---

## 📋 Scripts Disponibles

### Auditoría por Rol (Nuevos - 2026-07-27)

| Script | Comando | Rol | Verificaciones |
|--------|---------|-----|-----------------|
| `audit-frontend-senior.mjs` | `npm run audit:frontend` | Frontend Senior | Strict, OnPush, @ui/*, Wrappers, Mobile, Naming |
| `audit-mobile-developer.mjs` | `npm run audit:mobile` | Mobile Developer | Mobile components, Ionic, Responsive, Patrón B |

### Auditorías Existentes

| Script | Comando | Propósito |
|--------|---------|-----------|
| `audit-emoji-usage.mjs` | `npm run audit:emoji` | Validar uso de emojis |
| `audit-encoding.mjs` | `npm run audit:encoding` | Validar UTF-8 sin BOM |
| `audit-ui-boundaries.mjs` | `npm run audit:ui` | Validar catálogo UI |
| `audit-apps-boundaries.mjs` | `npm run audit:apps` | Validar organización de apps |
| `audit-design-system.mjs` | `npm run audit:design` | Validar design system |
| `audit-ds-tokens.mjs` | `npm run audit:tokens` | Validar tokens |
| `audit-css-classes.ts` | `npm run audit:css` | Validar clases CSS |

---

## 🚀 CÓMO USAR

### Ejecutar Auditoría Frontend

```bash
npm run audit:frontend
```

**Output:**
```
════════════════════════════════════════════════════════════
📊 RESUMEN DE AUDITORÍA: Frontend Senior
════════════════════════════════════════════════════════════

✅ AUDITORÍA EXITOSA

Todas las verificaciones pasaron (7/7)
```

### Ejecutar Auditoría Mobile

```bash
npm run audit:mobile
```

### Ejecutar Todas (Frontend + Mobile)

```bash
npm run audit:full-stack
```

### Ejecutar Auditoría General

```bash
npm run lint
```

Ejecuta TODOS los scripts (emoji, encoding, css, ui, apps, design, tokens).

---

## 📖 VERIFICACIONES DETALLADAS

### Frontend Senior (audit-frontend-senior.mjs)

1. **Strict TypeScript** — `strict: true` en tsconfig.json, cero `any`
2. **OnPush Strategy** — `ChangeDetectionStrategy.OnPush` en componentes
4. **Wrappers** — Sufijo `-wrapper`, no prefijo `wrapper-`
5. **Mobile Components** — Cada listado CRUD tiene versión móvil
6. **Naming Convention** — Archivos sin sufijo "Component"
7. **UI Audit** — Ejecuta `npm run audit:ui`

### Mobile Developer (audit-mobile-developer.mjs)

1. **Mobile Components** — Cada listado tiene versión móvil
2. **Ionic Components** — Usa ion-list, ion-item, ion-infinite-scroll
3. **Responsive** — Media queries para 375px/768px
4. **Strict TypeScript** — `strict: true`
5. **Patrón B** — Estructura XDesktop + XMobile

---

## 🔧 CREAR NUEVO SCRIPT

Estructura recomendada:

```javascript
#!/usr/bin/env node

/**
 * 🔍 AUDITORÍA: [Rol] (§XX)
 *
 * Verificaciones de CONVENTIONS.md
 * Ver: docs/AUDITORIA_POR_ROL.md — AUDITORÍA N: [Rol]
 */

import { execSync } from 'child_process';
import fs from 'fs';

let failures = [];
let passCount = 0;

function check1() {
  // Verificación específica
  if (fail) {
    failures.push({
      severity: 'critical|high|medium',
      check: 'Nombre',
      message: 'Qué falló',
      fix: 'Cómo arreglarlo',
    });
  } else {
    passCount++;
  }
}

function printSummary() {
  // Resumen y exit code
  return failures.length > 0 ? 1 : 0;
}

try {
  check1();
  check2();
  process.exit(printSummary());
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
```

---

## 🔗 REFERENCIAS

- **[docs/AUDITORIA_POR_ROL.md](../../docs/AUDITORIA_POR_ROL.md)** — Criterios detallados
- **[docs/SCRIPTS_AUDITORIA.md](../../docs/SCRIPTS_AUDITORIA.md)** — Guía de uso
- **[../../CONVENTIONS.md](../../CONVENTIONS.md)** — Reglas técnicas

---

**Última actualización:** 2026-07-27  
**Mantenido por:** Frontend Lead
