# [Módulo] — Auditoría Técnica

> **Ruta**: 📂 Documentación > 🔍 Auditorías > [Módulo]
> **📅 Última Revisión**: [seguir CONVENTIONS.md §11]
> **🛡️ Estado**: ✅ Completada / ⚠️ En progreso
> **👤 Responsable**: @nombre

---

## 🎯 Resumen Ejecutivo

**Propósito**: [Qué se auditó y por qué]
**Alcance**: [Archivos/componentes revisados]
**Metodología**: [Análisis estático, revisión manual, etc.]
**Hallazgos clave**: 🔴 [N] críticos · 🟡 [N] altos · 🟢 [N] medios · 🔵 [N] bajos

---

## 📊 Tabla de Hallazgos

| ID | Severidad | Descripción | Ubicación | Impacto | Recomendación | Tarea plan |
|----|-----------|-------------|-----------|---------|---------------|------------|
| H-001 | 🔴 Crítica | ... | `archivo.cs:42` | ... | ... | T-001 |

> [!IMPORTANT]
> Si el audit genera trabajo accionable, crea también un plan en `docs/plans/` y cruza cada hallazgo con su tarea (`H-001 ↔ T-001`). No mezcles audit y plan en un mismo archivo (ver `prompt-generar-audit.md`).

### Severidades

| Severidad | Significado |
|-----------|-------------|
| 🔴 Crítica | Bloqueante. Riesgo de seguridad |
| 🟡 Alta | Degradación significativa |
| 🟢 Media | Mejorable, deuda técnica |
| 🔵 Baja | Cosmético, estilo |

---

## 🔍 Detalle de Hallazgos

### H-001: [Título]

**Severidad:** 🔴 Crítica
**Ubicación:** `archivo.cs:42`
**Tipo:** Seguridad / Performance / Deuda Técnica / Inconsistencia
**Tarea asociada:** T-001 (`docs/plans/YYYYMMDD-...-plan.md`) — si aplica

**Problema:**
```csharp
// Código problemático
```

**Impacto:** [Explicación]

**Recomendación:**
```csharp
// Código corregido
```

---

## 📈 Métricas

| Métrica | Valor |
|---------|-------|
| Archivos revisados | N |
| Hallazgos totales | N |
| 🔴 Críticos | N |
| 🟡 Altos | N |
| 🟢 Medios | N |
| 🔵 Bajos | N |

---

## ✅ Checklist de Validación ([CONVENTIONS.md §11](../../CONVENTIONS.md#11-estándares-de-documentación))

- [ ] CERO mojibake
- [ ] Fechas en formato `dd-MMM-yy`
- [ ] Diagramas Mermaid válidos (si aplica)
- [ ] IDs de hallazgos trazables (H-001…)
- [ ] Hallazgos accionables cruzados con tarea del plan (`H-001 ↔ T-001`)
- [ ] Filename `YYYYMMDD-descripcion-audit.md` (con fecha)
- [ ] Mobile responsive: vistas implementan §15 según su tipo
- [ ] Emojis usados consistentemente
- [ ] Todo en español

---

## 📝 Historial de Cambios

| Fecha | Versión | Autor | Cambios |
|-------|---------|-------|---------|
| [seguir CONVENTIONS.md §11] | 1.0 | @nombre | Auditoría inicial |
