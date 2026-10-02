# Análisis de Diseño y Arquitectura (FASE 1) - Luxury Design System

**Fecha de ejecución:** 2026-09-30
**Rol:** Senior UI/UX Designer & Design System Specialist
**Objetivo:** Evaluación del estado actual del sistema de diseño basado en Angular 22, Bootstrap 5 e Ionic 9.

---

## 1. Resumen Ejecutivo

El *Luxury Design System* presenta una arquitectura técnica robusta (patrón adaptativo bifurcado Smart/Dumb) y una integración sólida con los ecosistemas de Angular 22 (Signals) e Ionic 9. Se han abstraído exitosamente las capas web y móvil, logrando que el mismo código fuente comparta contratos de UI mientras renderiza experiencias nativas.

Sin embargo, a nivel de madurez de tokens y consistencia de experiencia (UX/UI), el sistema se encuentra en una etapa de transición. Persiste deuda técnica visual originada por plantillas heredadas (ej. Lagos, Minia) que se manifiesta en colores hardcodeados fuera de los componentes compartidos.

### Puntuación Global (1-10)

| Categoría | Puntuación | Observación |
|---|:---:|---|
| **Color y Theming** | 7.5 | Estructura impecable en `_colors.scss` y `_variables.scss`. Faltan mappings Oklch/P3. Deuda de 279 valores hardcodeados en módulos. |
| **Tipografía** | 7.0 | Uso de Figtree constante, pero carece de `clamp()` para fluid typography web/móvil y pesos de fuente variable. |
| **Arquitectura de Componentes** | 9.0 | Patrón adaptativo sobresaliente (`shared/ui`). Uso exhaustivo de Signals (`input()`, `model()`). |
| **Responsive y Mobile** | 8.5 | Separación estricta Ionic/Bootstrap evaluada y respetada (`audit:ui` ✅). |
| **Accesibilidad (a11y)** | 6.5 | `--ds-focus-ring` implementado, pero faltan chequeos profundos de touch-targets (44x44) y motion en reduced-motion. |
| **Performance y DX** | 8.0 | Uso correcto de CSS `@layer`, budgets funcionales. Advertencias de Sass por uso deprecado de funciones de color globales (`red()`, `green()`). |

---

## 2. Matriz de Hallazgos

| # | Categoría | Hallazgo | Severidad | Esfuerzo | Recomendación | Referencia |
|---|---|---|---|---|---|---|
| 1 | Color | **279 colores hardcodeados** detectados en `src/app/modules/**`. | Crítico | L | Extraer a tokens `--ds-*` o asignar utilidades (Fase 9 limpieza). | `audit:tokens` |
| 2 | Theming | Colores calculados mediante JS en `chart-adapters.ts` sin suscribirse adecuadamente a variables CSS. | Alto | S | El reciente `dsThemeTick` mejora esto, pero la reactividad del canvas requiere invalidación manual estricta. | `chart-adapters.ts` |
| 3 | Performance | **Sass Color Functions Deprecation**. `red()`, `green()`, `blue()` globales arrojan warnings en compilación. | Medio | S | Migrar a `color.channel($color, "red", $space: rgb)` en `_variables.scss`. | `audit:contrast` |
| 4 | Tipografía | Ausencia de **Fluid Typography**. Los tamaños de fuente son estáticos en `rem/px`. | Medio | M | Implementar `clamp(min, val, max)` para `display` y `heading`. | `DESIGN.md` |
| 5 | Accesibilidad | Touch targets en implementaciones nativas (web) en dispositivos táctiles pueden no cumplir 44x44px. | Alto | M | Imponer un `min-height: 44px` en botones `il-*` o `--ds-density` token. | WCAG 2.5.8 |
| 6 | A11y | `audit:a11y` está bloqueado por redirecciones del authGuard (`/login`). | Medio | M | Proveer estado sembrado (`--seed`) con token válido para pruebas automatizadas axe-core. | `scripts/audit-a11y.mjs` |

---

## 3. Auditoría de Contraste y Accesibilidad (Muestra Representativa)

El análisis del motor de tema (`theme/_variables.scss`) demuestra pares funcionales:

| Token / Superficie | Token Texto / Elemento | Modo Claro Ratio | Modo Oscuro Ratio | Estado WCAG (AA) |
|---|---|:---:|:---:|:---:|
| `--ds-bg-surface` (`#ffffff`) | `--ds-text-primary` (`#001829`) | 17.5:1 | N/A | ✅ AAA |
| `--ds-bg-surface` (`#1e1e2e`) | `--ds-text-primary` (`#f0f6f9`) | N/A | 14.2:1 | ✅ AAA |
| `--ds-primary` (`#003152`) | `--ds-on-primary` (`#ffffff`) | 12.8:1 | N/A | ✅ AAA |
| `--ds-primary` (`#b6d6ec`) | `--ds-on-primary` (`#001829`) | N/A | 13.5:1 | ✅ AAA |
| `--ds-danger` (`#e44141`)* | `--ds-on-danger` (`#ffffff`) | 3.6:1 | 3.6:1 | ❌ Falla AA |

*Nota Crítica de Diseño:* El rojo estándar de Lagos/Minia `#e44141` frente a blanco no pasa el contraste AA (mínimo 4.5:1). Se requiere utilizar un tono más oscuro en modo claro (ej. `danger-700`) o utilizar `danger-100` de fondo con texto `danger-900`.

---

## 4. Inventario de Tokens y Arquitectura CSS

### Arquitectura de Capas CSS (Implementación Excelente)
El archivo `ds-entry.scss` implementa correctamente la especificación nativa `@layer ionic, reset, tokens, bootstrap, base, components, utilities, overrides;`. 

### Mapeo de Identidad (Luxury Deep Navy)
- Ancla de marca: `$primary-700: #003152`.
- El sistema utiliza correctamente variables primitivas mapeadas a roles semánticos.

### Deficiencias en Escalas
- **Espaciados y Radios:** Los tokens actuales (ej. `--ds-radius-card: var(--ds-radius-md)`) existen, pero hay componentes legados en el código de negocio que insertan `border-radius: 17px` o `.p-10`. La equivalencia de utilidades (creada hoy) debe auditarse estrictamente con un linting como `stylelint`.

---

## 5. Assessment Arquitectónico (Angular 22 + Ionic 9)

**Integración Web/Móvil (Adaptative)**
Es el punto más fuerte del proyecto. El directorio `src/app/shared/ui/adaptive` utiliza los métodos correctos de inyección y el `PlatformService` para alternar entre componentes `web-*` (Bootstrap / Native HTML wrappers) e `ion-*` (Ionic 9 Standalone). 

*Nota de Arquitectura:* La capa web depende únicamente de Bootstrap 5 nativo y tokens del Design System, lo que mejora los presupuestos de CSS (Bundle Size), elimina conflictos de directivas globales y simplifica la accesibilidad manual.

**Uso de Signals:** La migración a Inputs pasados como señales (`input()`, `model()`) y el ciclo de vida gestionado sin Zone.js es un patrón ideal para aplicaciones empresariales de gran escala que previenen recálculos de UI innecesarios.

---

## 6. Plan de Remediación (Roadmap de UI)

### P0 (Bloqueantes Críticos - Siguiente Sprint)
- [ ] **Resolución de Warnings SASS:** Migrar funciones de colores `red()`, `green()` obsoletas a `color.channel()` en la base de `_variables.scss`.
- [ ] **Remediación de Contraste (Danger/Warning):** Ajustar la escala semántica en `_colors.scss` para que los tonos de advertencia y error superen 4.5:1 contra fondos base.

### P1 (Alta Prioridad - Q4)
- [ ] **Erradicar Hardcoded Colors:** Limpiar las 279 violaciones marcadas por `audit:tokens` en los módulos de negocio. Sustituirlas por equivalentes semánticos `--ds-*`.
- [ ] **Desbloqueo de Accesibilidad CI:** Parametrizar las herramientas (Axe/Playwright) para inyectar token de sesión y validar los formularios dinámicos post-login.

### P2 (Mejoras Tácticas - Q4/Q1)
- [ ] **Fluid Typography:** Añadir la función `clamp()` en `_typography.scss` (que debe crearse para abstraer fuentes del reset general) mejorando el escalado en tablets y móviles pequeños.
- [ ] **Componentes Touch-Friendly Web:** Revisar que todos los listados `.app-table` que se exponen a pantallas táctiles tipo iPad cuenten con un target size mínimo exigido por WCAG 2.2.

### P3 (Gobernanza y Madurez)
- [ ] **Migración a OKLCH:** Para un look verdaderamente "Premium/Luxury", migrar o expandir el core semántico a espacios de color de gama amplia, permitiendo transiciones más vibrantes en displays OLED/Retina.
