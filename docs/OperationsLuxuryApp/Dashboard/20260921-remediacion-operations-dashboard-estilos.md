# Remediación 2 — Estilos (Bootstrap) y acceso de revisión — Dashboard de Métricas

Origen: revisión visual en navegador (playwright) del Tech Lead/orquestador sobre `/dashboard/metrics/catalog`.
Plan padre: `20260921-plan-operations-dashboard.md`. Remediación previa: `20260921-remediacion-operations-dashboard.md` (ya aplicada, no repetir).
Backend Fase 1.1 y lógica Frontend 1.2 ya aprobados: **no cambies la lógica de datos, filtros, servicio ni endpoints existentes** salvo lo que se pide explícitamente abajo.

## Hallazgo (verificado en el navegador)

El proyecto usa **Bootstrap 5.3** (`bootstrap` y `@ng-bootstrap/ng-bootstrap` en `package.json`) y **NO tiene Tailwind** (`postcss.config.js` solo tiene autoprefixer; no hay `@tailwind` en `src/styles`). Los 3 archivos de `metrics\` fueron escritos con clases de Tailwind (`grid grid-cols-*`, `px-4`, `py-2`, `text-4xl`, `rounded-lg`, `shadow-sm`, `bg-[var(--...)]`, `text-[var(--...)]`, `sr-only`, `w-full md:w-auto`, `flex-col`, etc.) que **no se aplican**. Medido en el navegador: `.grid` → `display: block`, `.sr-only` → `position: static`. Resultado: layout roto, tarjetas en una columna, etiquetas sin estilo, textos "Visible" que deberían estar ocultos aparecen visibles, matriz de roles desbordada.

Rutas base: `appsweb\angular\src\app\modules\operations.luxuryapp\dashboard\metrics\`

## Cambios requeridos

### A. Reescribir estilos con Bootstrap 5.3 + tokens del sistema de diseño

Aplica a: `dashboard-metrics.html`, `components\dashboard-metrics-filters.ts` (template inline), `catalog\kpi-catalog.html`.

1. **Antes de escribir**: lee `conventions\ui\ui-desktop-rules.md`, `conventions\ui\design-tokens-rule.md`, `conventions\ui\ui-usage-catalog.md` y 2-3 vistas reales ya existentes (por ejemplo bajo `modules\admin.luxuryapp\infrastructure\catalog-component-ui\` y el dashboard actual `dashboard\unified-pending-dashboard.html`) para copiar el patrón real de tarjetas, KPI y tablas del proyecto. No inventes utilidades.
2. **Prohibido usar clases Tailwind.** Usa solo Bootstrap 5.3: `row`/`col-*`/`col-md-*`/`col-lg-*`, `d-flex`, `flex-column`, `flex-wrap`, `align-items-*`, `justify-content-*`, `gap-*`, `p-*`/`px-*`/`py-*`/`m*-*`, `card`/`card-body`/`card-header`, `badge`, `table`/`table-responsive`, `text-*`, `fw-*`, `fs-*`, `visually-hidden` (en lugar de `sr-only`), `w-100`.
3. **Colores/espaciado/tipografía propios**: solo mediante tokens `var(--ds-*)` (o clases utilitarias del sistema de diseño si ya existen). Verifica que cada `var(--...)` exista en `appsweb\angular\src\styles` (por ejemplo `--ds-bg-surface`, `--ds-border`, `--ds-text-primary`, `--ds-text-secondary`, `--ds-info`, `--ds-warning`, `--ds-danger`, `--ds-text-inverse`, `--ds-bg-overlay`, `--primary-color`). Si necesitas estilos locales, usa el `.scss` del componente con `:host` y tokens (no estilos inline con valores fijos).
4. **`/dashboard/metrics` (contenedor):** encabezado con título y la insignia "Vista Corporativa" como `badge`; barra de filtros en una `card` con `row g-3` (cada filtro en `col-12 col-md-*`); fila de 3 KPI cards (`row g-3`, `col-12 col-md-4`), cada una `card` con etiqueta pequeña, valor grande (usa `fs-1 fw-bold` o el token tipográfico del sistema) y color semántico por token; debajo, 2 gráficos en `row g-3` con `col-12 col-lg-6` dentro de `card`. Estados cargando / vacío / error visibles y ordenados (sin desbordes). Debe verse bien en ancho móvil (360 px) y escritorio (1440 px).
5. **Catálogo `/dashboard/metrics/catalog`:**
   - Matriz KPI x 17 roles: `table-responsive` con `table table-sm`, primera columna (KPI) fija/sticky a la izquierda si es viable con CSS local; encabezados de rol rotados legibles (o abreviados con `title` completo). El texto "Visible"/"No visible" debe estar en `visually-hidden`; a la vista solo el icono (check / X) con color por token. Las celdas "Por definir" deben ser una sola línea corta ("Por definir") con `text-muted`/token, sin partirse en 4 líneas. Añade una leyenda encima de la tabla (Visible / No visible / Por definir).
   - Tarjetas por grupo: `row g-3` con `col-12 col-md-6 col-xl-4`, cada una `card` con badges (estado, alcance) como `badge` con color por token, fuente y roles en texto secundario, y la visualización de muestra (card numérica o `<app-chart-wrapper>`) con la etiqueta "Datos de muestra" como `badge` posicionado con utilidades Bootstrap/CSS local (sin `bg-black`/`text-white`).
6. Reutiliza `<app-chart-wrapper>` tal cual; no lo modifiques. Verifica que los gráficos rendericen con altura visible (el contenedor debe darle altura).

### B. Acceso de revisión para SuperUsuario y Direccion (cambio de regla, aprobado por el Tech Lead)

`RN-DASH-022` fue enmendada en el plan: `SuperUsuario` y `Direccion` tienen acceso **provisional de revisión** a `/dashboard/metrics`, comportándose como Corporate (todos los customers por defecto, drill-down opcional por customer). Alcance definitivo: Fase 4.

7. **Frontend:** en `app\routing\pages.routes.ts` agrega `"SuperUsuario"` y `"Direccion"` a `allowedRoles` de la ruta `dashboard/metrics` (el catálogo ya los tiene). En `dashboard-metrics.ts` agrega `ApplicationRole.SuperUsuario` y `ApplicationRole.Direccion` al `computed` `isCorporate` para que vean el selector de customer y la insignia.
8. **Backend** (`api\LuxuryApp.Application\Modules\OperationsLuxuryApp\Dashboard\Services\DashboardMetricsAppService.cs`): añade `ApplicationRoleEnum.SuperUsuario` y `ApplicationRoleEnum.Direccion` al arreglo `CorporateRoles` (con un comentario de una línea: acceso provisional de revisión, alcance definitivo en Fase 4). No cambies nada más de ese archivo. No modifiques archivos existentes del módulo Dashboard fuera de los que este documento nombra.
9. **Catálogo:** en la matriz, `SuperUsuario` y `Direccion` deben mostrarse como visibles (check) en los 3 KPIs operativos de Fase 1 (`roles` de esos KPIs incluye ambos) y como "Por definir" en los planeados. Ajusta `ALL_DASHBOARD_ROLES`/la lógica de `isPorDefinir` en `kpi-catalog.config.ts` y `kpi-catalog.ts` en consecuencia, sin romper el resto. La etiqueta "Por definir (Fase 4)" para estos dos roles ya no aplica en los KPIs operativos.
10. Con la regla enmendada, actualiza el texto de los KPIs operativos del catálogo: "Roles que lo ven:" debe listar también SuperUsuario y Direccion (marcados "provisional").

## Verificación obligatoria (pega la salida real, no un resumen)

- `dotnet build` de `api\LuxuryApp.Application\LuxuryApp.Application.csproj`. Si falla por archivos bloqueados por la API en ejecución (VBCSCompiler / LuxuryApp.Api), indícalo con el mensaje exacto; no lo presentes como éxito.
- `npx ng build --configuration development` en `appsweb\angular`.
- Grep sobre TODO `metrics\` (*.ts y *.html) que debe dar **0 coincidencias** para clases Tailwind: `grid-cols-|\bgrid\b|text-\[|bg-\[|border-\[|rounded-|shadow-|sr-only|w-full|md:|lg:|px-|py-|text-4xl|text-xl|text-sm|text-xs|font-bold|font-semibold|flex-col|justify-between|items-center` (clases como `px-*`/`py-*` de Bootstrap deben escribirse como `px-2`... verifica caso a caso: `px-*`/`py-*` SÍ existen en Bootstrap; si las usas, justifícalo en el reporte), y 0 para `new Date|text-white|bg-black|#[0-9a-fA-F]{3,6}\b`.
- Si dispones de `playwright-cli` (o cualquier navegador automatizado), abre `http://localhost:4200`, inicia sesión (el Tech Lead te dará credenciales si las necesitas; no las escribas en ningún archivo) y describe/adjunta capturas de `/dashboard/metrics` y `/dashboard/metrics/catalog` en 1440 px y 360 px. Si no puedes, dilo explícitamente; el orquestador lo verificará él mismo.

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte NUEVO y breve: archivos creados/modificados con ruta completa, cada punto (1-10) con qué cambiaste y cómo lo verificaste, salida real de builds y greps, y desviaciones reales. No copies el reporte anterior ni agregues explicaciones sobre errores que no hayas reproducido.
