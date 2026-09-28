# Plan de Remediación: Cobranza Online

**Fecha:** 2026-07-31
**Módulo:** Cobranza Online
**Basado en:** [Reporte de Auditoría](../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260731-auditoria-cobranza-online.md)

## 📌 Resumen de Hallazgos
La auditoría reveló un alto cumplimiento de la nueva arquitectura (Signals, Standalone, Minimal APIs, ApiResponseService, 1 DTO per file). 
Sin embargo, existe un hallazgo CRÍTICO relacionado con la UI y una deuda documental.

## 🚀 Fases de Ejecución

### Fase 1: Corrección Crítica UI (Inmediata)
**Objetivo:** Eliminar hardcoding de colores para cumplir con `Design Tokens Rule`.

- [ ] **Tarea 1.1:** Mapear colores de `cobranza-online-dashboard.component.scss` (`#ffffff`, `#0f172a`, `#7c8aa5`, `#166534`, etc.) a tokens oficiales de `_variables.scss` (`var(--ds-*)` o `var(--primary-*)`).
- [ ] **Tarea 1.2:** Mapear paleta de gráficos (actualmente usando un fallback array de hexes en `pieColorScheme` y `chartData`) a tokens CSS o variables permitidas de tema.
- [ ] **Tarea 1.3:** Validar contraste y correcta visualización en light/dark mode (si aplica) de los nuevos tokens.

### Fase 2: Alineación Documental FASE 0 (Corto Plazo)
**Objetivo:** Cumplir con el nuevo estándar operativo para módulos.

- [ ] **Tarea 2.1:** Extraer lógica descrita en `analisis-cobranza-online.md`.
- [ ] **Tarea 2.2:** Generar `02-business-rules-analysis.md` y clasificar reglas en los 4 niveles jerárquicos (Invariantes, Flujo, Seguridad, Validación).
- [ ] **Tarea 2.3:** Revisar y documentar la seguridad explícita (Roles) de los endpoints de `AspelSyncEndPoints.cs`.

## 🛡️ Criterios de Éxito Generales
1. Cero colores HEX harcodeados en SCSS o TS del módulo.
2. Artefacto `02-business-rules-analysis.md` disponible y alineado a `AGENT_AUDIT_PROTOCOL.md`.
