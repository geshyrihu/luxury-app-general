# 📦 review_files — Archivos Movilizados (2026-09-10)

**Propósito:** Contener archivos de **soporte, auditoría, onboarding, gobernanza e instrucciones** que NO son convenciones vigentes.

**Criterio de clasificación:** Si un archivo NO define una regla de arquitectura/desarrollo vigente → sale de `conventions/` y entra aquí.

---

## Estructura

```
review_files/
├── audit/
│   ├── agent-audit-protocol.md
│   ├── audit-layers-checklist.md
│   ├── auditoria-por-rol.md
│   └── scripts-auditoria.md
│
├── onboarding/
│   ├── git-hooks-setup.md
│   ├── onboarding-git-hooks.md
│   └── tech-lead-onboarding-guide.md
│
├── agent-instructions/
│   ├── agent-instructions-catalog.md
│   └── module-documentation-instructions.md
│
├── governance/
│   ├── gobernanza-convenciones.md
│   ├── responsabilidades-migracion-datos-2026-07-30.md
│   └── roles-y-perfiles.md
│
├── support/
│   ├── alias.md
│   ├── conventions-viewer-guide.md
│   └── readme-plans.md
│
├── changelog/
│   ├── changelog-application-roles-integration.md
│   └── changelog-fase-0-integration.md
│
└── README.md (este archivo)
```

---

## Qué contiene cada carpeta

### 🔍 `audit/` (4 archivos)
Documentos de auditoría y metodología de verificación de cumplimiento.
- No define reglas nueva, sino cómo verificar las existentes.

### 🚀 `onboarding/` (3 archivos)
Guías de configuración inicial, git hooks, onboarding de developers.
- Operacional, no convención.

### 🤖 `agent-instructions/` (2 archivos)
Instrucciones para agentes de IA sobre cómo documentar módulos, crear instrucciones.
- Meta-documentación para agentes.

### 🎯 `governance/` (3 archivos)
Definición de roles, responsabilidades, gobernanza operacional.
- Governance ≠ convención de código.

### 📋 `support/` (3 archivos)
Guías de componentes, reportes técnicos, referencias operacionales.
- Soporte técnico, no regla.

### 📝 `changelog/` (2 archivos)
Histórico de cambios específicos de features o integración.
- Histórico punto-en-tiempo, no vigente.

---

## Política: Cuándo un archivo vuelve a `conventions/`

Un archivo regresa a `conventions/` SOLO si:

✅ Define una **regla de arquitectura/desarrollo vigente**  
✅ Es referenciado en `CONVENTIONS.md` como autoridad  
✅ Sigue el estándar de nomenclatura en `conventions/NOMENCLATURA_CONVENCIONES.md`  
✅ No es histórico, operacional ni de soporte  

---

## Referencias

- **Estándar de nomenclatura:** `conventions/NOMENCLATURA_CONVENCIONES.md`
- **Documento rector:** `conventions/CONVENTIONS.md`
- **Índice convenciones:** `conventions/README.md`

---

**Última actualización:** 2026-09-10  
**Archivos movilizados:** 17/18  
**Estado:** ✅ Limpia en conventions/, organizadas en review_files/
