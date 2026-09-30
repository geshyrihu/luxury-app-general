# Addendum: Auditoría de Migración PrimeFlex → Bootstrap 5

**Fecha:** 2026-09-14
**Objetivo:** Complementar el análisis original (`../../../docs/SharedLuxuryApp/DesignSystem/20260812-auditoria-shared-primeflex-migracion.md`) con hallazgos críticos adicionales descubiertos tras un análisis profundo del repositorio. Estas clases PrimeFlex tienen un alto impacto visual y estructural, y fueron omitidas o parcialmente descritas en el reporte base.

---

## 1. Clases Críticas Omitidas en la Auditoría Original

### 1.1 Colores Semánticos (Texto y Fondo)

| PrimeFlex | Usos medidos | Alternativa BS5 / DS | Notas |
|-----------|--------------|----------------------|-------|
| `text-color` | ~167 | `text-body` o `var(--ds-text-primary)` | Mapeo obligatorio para evitar texto invisible. |
| `text-color-secondary` | N/A | `text-body-secondary` | |
| `surface-ground` | ~250 (total surface semánticos) | `bg-body-tertiary` o `var(--ds-background)` | Fondos base de la aplicación. |
| `surface-card` | - | `bg-body` o `var(--ds-surface)` | |
| `surface-section` | - | `var(--ds-surface)` | |
| `surface-border` | - | `border-color` o `var(--ds-border)` | |
| `surface-overlay` | - | `var(--ds-surface)` con elevación | |

### 1.2 Control de Texto y Desbordamiento
Clases muy comunes en tablas y tarjetas para evitar que el texto rompa el layout.

| PrimeFlex | Usos medidos | Bootstrap 5 | Notas |
|-----------|--------------|-------------|-------|
| `white-space-nowrap` | ~35 | `text-nowrap` | Evita saltos de línea. |
| `text-overflow-ellipsis` | ~31 | `text-truncate` | BS5 aplica `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` todo junto con esta clase. |

### 1.3 Ancho de Pantalla (Riesgo de Scroll Horizontal)
La auditoría menciona `min-h-screen` → `min-vh-100`, pero no documenta el ancho.

| PrimeFlex | Usos medidos | Bootstrap 5 | Notas |
|-----------|--------------|-------------|-------|
| `w-screen` | N/A | `w-100` | **⚠️ Riesgo:** No usar `vw-100`. Como se demostró en el parche de `fixed-expenses-catalog`, usar unidades `vw` en Windows causa un scroll horizontal no deseado debido al ancho de la barra de scroll del SO. Si el contenedor no tiene padding, usar `w-100`. |

### 1.4 Espaciado, Bordes y Flex Adicionales
El reporte original cubrió bordes y márgenes direccionales, pero omitió las bases globales.

| PrimeFlex | Bootstrap 5 | Notas |
|-----------|-------------|-------|
| `m-0`, `p-0` | `m-0`, `p-0` | Compatibles, omitidos en el reporte original. |
| `border-1`, `border-2`, `border-3` | `border`, `border-2`, `border-3` | BS5 requiere la clase `border` base además del grosor. |
| `border-bottom-1` | `border-bottom` | Igual para `top`, `start`, `end`. |
| `flex-order-*` | `order-*` | BS5 usa `order-*`. |
| `flex-column-reverse`, `flex-row-reverse` | `flex-column-reverse`, `flex-row-reverse` | Compatibles. |

---

## 2. Inconsistencia Arquitectónica: El Plan de Ejecución

El reporte `../../../docs/SharedLuxuryApp/DesignSystem/20260812-auditoria-shared-primeflex-migracion.md` propone fases internas (Fase 1 - Archivos críticos, Fase 2 - Módulo por módulo). Sin embargo, estas **chocan nominalmente** con las fases de `02-plan-migracion.md` (que van de Fase 0 a 7, enfocadas en componentes UI, no en utilidades CSS). 


### Solución Estratégica Propuesta:
PrimeFlex no debe bloquear la migración de componentes (Fases 0 a 6). Las clases CSS coexisten pacíficamente.
Se debe crear un **Track Paralelo (Track Flex)** o inyectar la migración masiva de PrimeFlex justo antes de la Fase 7 (e.g. **Fase 6.5 - Barrido PrimeFlex**), utilizando herramientas de búsqueda y reemplazo (codemods o scripts regex) debido al volumen (~2,500 ocurrencias de grid, ~4,000 de flex). No es viable hacer este reemplazo a mano componente por componente.

---
*Análisis generado por Antigravity (Orquestador).*
