# 📊 Reporte Maestro - Auditorías del Proyecto

**Propósito:** Centralizar todas las auditorías, análisis y reportes del proyecto.

**Fuente operacional para agentes de IA:** [`AUDIT_AGENT_INSTRUCTIONS.md`](./AUDIT_AGENT_INSTRUCTIONS.md)

---

## 🎯 Para Auditar un Módulo

**Agentes de IA (Claude, Codex, Cursor, etc.):**

1. Lee: [`AUDIT_AGENT_INSTRUCTIONS.md`](./AUDIT_AGENT_INSTRUCTIONS.md)
2. Ejecuta Fase 1 (15 min) + Fase 2 (2-4 horas)
3. Guarda en: `modulos/YYYYMMDD-auditoria-[modulo].md`

---

## 📋 Índice de Auditorías Realizadas

### 🏢 Módulos Auditados

- **[Cobranza](./modulos/20260703-auditoria-cobranza.md)** (2026-07-03)
- **[Vacaciones](./modulos/20260720-auditoria-vacaciones.md)** (2026-07-20)

### 🔍 Análisis Estructurales

- **[Mapeo Front vs Backend](../../../docs/SharedLuxuryApp/Conventions/20260712-analisis-shared-modules-front-api.md)** — 13 módulos espejo, 4 solo-frontend, 1 solo-backend

### 🔌 Endpoints & Rutas

- **[Radiografía Endpoints](../../../docs/SystemLuxuryApp/Endpoints/20260712-analisis-system-endpoints-radiography.md)**
- **[Radiografía Rutas Frontend](../../../docs/SystemLuxuryApp/Endpoints/20260712-analisis-system-routes-radiography.md)**
- **[Reporte Auditoría Endpoints](../../../docs/SystemLuxuryApp/Endpoints/20260712-auditoria-system-endpoints.md)**
- **[Inventario Estructura Raíz](../../../docs/SystemLuxuryApp/Endpoints/20260712-auditoria-system-root-structure.md)**

### 🧾 Temas Transversales

- **[Retirada Controllers (MVC→Minimal APIs)](../../../docs/SharedLuxuryApp/Shared/20260713-auditoria-shared-file-controller.md)**
- **[Auditoría Paginación](../../../docs/SharedLuxuryApp/Shared/20260724-auditoria-shared-paginacion.md)**

---

## 🔗 Referencias

- **[AUDIT_AGENT_INSTRUCTIONS.md](./AUDIT_AGENT_INSTRUCTIONS.md)** ⭐ — Instrucciones operacionales (USE THIS)
- **[CONVENTIONS.md](../../CONVENTIONS.md)** — Reglas de arquitectura (autoridad)
- **[../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md](../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md)** — Documentación general del proyecto

---

## 📊 Estadísticas (2026-07-26)

| Métrica | Valor |
|---------|-------|
| Módulos auditados | 2 |
| Auditorías totales | 7 |
| Endpoints auditados | 200+ |
| Rutas auditadas | 150+ |

---

**Última actualización:** 2026-07-26  
**Mantenido por:** Tech Team
