# Mapa de Clases y Utilidades (Lagos → LuxuryApp)

**Fecha:** 2026-09-30
**Uso:** Traducción de las utilidades que provienen de la plantilla Lagos a la infraestructura oficial de LuxuryApp. 

⚠️ **Regla crítica:** No copies clases textuales como `.p-10` o `.txt-primary` al proyecto. Usa siempre sus equivalentes del Design System.

## 1. Espaciados (Márgenes y Paddings)
Lagos usa un sistema estático (ej. `p-10` = 10px). LuxuryApp usa **Bootstrap 5 utility classes** ancladas a nuestra escala de tokens `--ds-space-*`.

| Clase Lagos | Equivalente LuxuryApp | Significado (Escala 4px) |
|---|---|---|
| `.p-10` | `.p-2` / `var(--ds-space-sm)` | Padding de 8px (approx 10px) |
| `.m-10` | `.m-2` / `var(--ds-space-sm)` | Margin de 8px |
| `.p-15` | `.p-3` / `var(--ds-space-md)` | Padding de 16px (espacio habitual) |
| `.m-b-30` | `.mb-4` / `var(--ds-space-xl)` | Margin bottom de 24px |
| `.m-t-50` | `.mt-5` / `var(--ds-space-2xl)` | Margin top de 32px |

## 2. Tipografía y Tamaño de Fuente
Lagos usa clases hardcodeadas como `.f-14` o variables `font-weight`. LuxuryApp usa tokens tipográficos y Bootstrap.

| Clase Lagos | Equivalente LuxuryApp | Descripción |
|---|---|---|
| `.f-14` | `.text-sm` / `var(--ds-type-body-sm)` | Texto de 14px (base es 16px) |
| `.f-w-600` | `.fw-bold` o `font-weight: 600` | Texto en negrita (semi-bold) |
| `.text-center` | `.text-center` | Mantenido de Bootstrap |

## 3. Colores de Texto y Fondo (Tema y Roles)
Lagos define `.txt-primary`, `.bg-light-primary` explícitamente. En LuxuryApp, esto se resuelve con variables CSS que responden al **Modo Oscuro** (ThemeService).

| Clase Lagos | Equivalente LuxuryApp (SCSS) | Equivalente (Utility Class) | Comportamiento |
|---|---|---|---|
| `.txt-primary` | `color: var(--ds-primary);` | `.text-primary` | Cambia a `primary-200` en Dark Mode |
| `.txt-secondary` | `color: var(--ds-secondary);` | `.text-secondary` | Color neutral estructurado |
| `.txt-success` | `color: var(--ds-success);` | `.text-success` | Verde éxito, calibrado para AA |
| `.bg-light-primary` | `background: var(--ds-primary-container);` | No recomendado inline | Fondo tenue con texto oscuro |

## 4. Bordes y Radios
Lagos utiliza configuraciones globales con radios de `17px` en tarjetas. LuxuryApp usa un radio global de `3px`.

| Clase Lagos | Equivalente LuxuryApp | Token CSS |
|---|---|---|
| `.b-r-5` | `.rounded-md` | `var(--ds-radius-md)` (3px estándar) |
| `.b-r-10` | `.rounded-lg` | `var(--ds-radius-lg)` (3px estándar) |
| `.b-r-50` | `.rounded-full` | `var(--ds-radius-full)` (9999px) |

## 5. Layout (Flexbox y Grid)
Ambos sistemas utilizan la base de Bootstrap.

| Patrón Lagos | Recomendación LuxuryApp |
|---|---|
| `.row` > `.col-*` | Mantener uso de `.row` y `.col-*` de Bootstrap 5 |
| `.d-flex.align-items-center` | Mantener uso de `.d-flex` y `.align-items-center` |
| `.pull-right` / `.float-right` | `.float-end` (Bootstrap 5) o `margin-left: auto` |
