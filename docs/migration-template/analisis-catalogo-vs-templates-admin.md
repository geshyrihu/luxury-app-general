# Análisis (solo lectura) — Catálogo UI vs. `templates_admin/lagos` y `templates_admin/minia`

**Esto NO es un prompt de ejecución.** No se toca ni una línea de código.
Es un análisis para que el usuario decida qué librería estandarizar por
categoría de componente, ahora que Fase 8 cerró el retiro de PrimeNG de
`shared/ui`. No hagas cambios, no hagas commit, no corras `ng generate`
nada. Solo lectura + reporte.

## Contexto

`src/app/shared/ui` y el catálogo (`herramientas-dev/catalog-component-ui`)
ya están en **0 archivos con PrimeNG real** (verificado por el maestro vía
grep — los 2 hallazgos residuales, `primeng-radar-chart` y
`primeng-custom-*`, son nombres heredados de archivos que ya son
100% ECharts/Bootstrap por dentro, no PrimeNG real).

Existen dos plantillas Angular 21 + Bootstrap 5 compradas, vendoreadas en:
- `D:\repos\luxuryapp-api\templates_admin\lagos`
- `D:\repos\luxuryapp-api\templates_admin\minia`

Ambas ya comparten el mismo stack base al que este proyecto migró:
`bootstrap`, `@ng-bootstrap/ng-bootstrap`, `@ng-select/ng-select`,
`angularx-flatpickr`/`flatpickr`, `sweetalert2`. Eso confirma que la
dirección tomada en la migración (Fases 6–8) es consistente con lo que
trae un admin-template Bootstrap real del mercado.

Lo que falta decidir es: para las piezas que en nuestro catálogo hoy son
implementaciones propias construidas desde cero durante la migración
(editor Quill, gráficas ECharts, rating con estrellas nativas, etc.),
¿conviene mantenerlas, o adoptar la librería que ya trae lista alguna de
las dos plantillas?

## Qué debes producir

Un reporte markdown (no código) con una tabla por cada categoría de
componente relevante. Para cada fila:

| Componente/categoría | Implementación actual en el catálogo (post-Fase 8) | Qué trae `lagos` | Qué trae `minia` | Sugerencia |
|---|---|---|---|---|

Categorías a cubrir (una fila cada una, o más si el componente lo amerita):

1. **Editor de texto enriquecido** — actual: `shared/ui/web/editor/editor.ts`
   (Quill directo, `quill@^2.0.3`). Lagos trae `ngx-editor` y
   `@kolkov/angular-editor` (revisa `lagos/src/app/component/editors/*`
   para ver cuál usan en la demo real). Minia trae `@ckeditor/ckeditor5-*`
   (revisa `minia/src/app/pages/form/editer/editer.component.ts`).
2. **Galería / lightbox de imágenes** — actual: no hay componente propio
   de galería en el catálogo (el visor de imágenes es `web/image/image.ts`,
   un preview simple con `NgbModal`, no una galería). Lagos trae
   `ng-gallery`, `@ks89/angular-modal-gallery`, `@ngx-gallery/lightbox`
   (revisa `lagos/src/app/component/gallery/*`). Minia trae `ngx-lightbox`
   (revisa `minia/src/app/pages/extended/lightbox/*`).
3. **Rating (estrellas)** — actual: `web/rating/rating.ts` (botones nativos
   + `app-icon`, sin librería). Lagos trae `ngx-bar-rating` (revisa
   `lagos/src/app/component/bonus-ui/rating/*`, tiene 6 variantes:
   current/horizontal/movie/number/square/star). Minia: revisa
   `minia/src/app/pages/extended/rating/*` (¿librería o CSS puro?).
4. **Gráficas** — actual: `web/charts/*` sobre `ngx-echarts`/`echarts`.
   Ambas plantillas traen `apexcharts`/`ng-apexcharts` y `chart.js`/
   `ng2-charts` como opción adicional/alternativa; minia además trae
   `@amcharts/amcharts5` y `chartist`/`ng-chartist`. No se está
   proponiendo cambiar el motor actual (ECharts funciona y ya está
   integrado) — documenta solo qué tan estándar es cada motor en
   plantillas Bootstrap reales, como dato de referencia.
5. **Modales/diálogos** — actual: `web/dialog/dialog.ts` +
   `DialogHandlerService`, Bootstrap `.modal` nativo. Confirma que ambas
   plantillas también usan el mismo patrón Bootstrap `.modal` nativo (no
   una librería de terceros) — es una confirmación de que no hace falta
   cambiar nada aquí, no una alternativa a evaluar.
6. **Selects / multiselects** — actual: `custom-input-select-signal` /
   `custom-input-multiselect-signal` sobre `@ng-select/ng-select`. Ambas
   plantillas también usan `@ng-select/ng-select` — mismo caso que
   modales, confirma alineación, no requiere cambio.
7. **Calendario/rango de fechas** — actual: `angularx-flatpickr`. Ambas
   plantillas también lo usan (`angularx-flatpickr` en ambos
   `package.json`) — confirma alineación.
8. **Carrusel** — si existe algún carrusel en el catálogo actual,
   documenta qué usa; si no existe ninguno, indica "sin implementación
   propia" y qué trae cada plantilla (`ngx-owl-carousel-o` en ambas).
9. **Color picker** — si el catálogo no tiene uno propio, documenta que
   `minia` trae `ngx-color-picker` y `lagos` no lo trae en
   `package.json` (verifica).
10. **OTP input** — documenta si el catálogo tiene algo similar;
    `minia` trae `ng-otp-input`.
11. **Mapas** — documenta si el catálogo tiene algo; `minia` trae
    `@angular/google-maps`, `@asymmetrik/ngx-leaflet`/`leaflet`; `lagos`
    no aparenta traer ninguno (verifica).

Para cada fila, en "Sugerencia" indica una de estas 3 categorías
explícitas:
- **Mantener actual** (ya está resuelto, no requiere librería nueva).
- **Adoptar de lagos/minia** (nombra la librería exacta + versión).
- **Sin resolver / requiere decisión del usuario** (cuando hay ambigüedad
  real, ej. dos librerías igual de válidas).

## Cómo investigar

- Lee los `package.json` completos de ambas plantillas (ya leídos
  parcialmente por el maestro, tú confírmalos completos).
- Para cada categoría, abre el/los componente(s) de ejemplo reales
  señalados arriba (no solo el nombre del paquete — confirma que
  la plantilla realmente lo usa en un `.ts`/`.html`, no que esté
  en `package.json` sin uso real, igual que hicimos con PrimeNG).
- Para el catálogo actual, usa
  `appsweb/angular/src/app/shared/ui/web/*` y
  `appsweb/angular/src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/*`
  como fuente de verdad de "qué existe hoy".
- No leas archivos de más de 100KB salvo que sea imprescindible.

## Formato del reporte

Markdown plano, una sección por categoría con su tabla/fila, más un
resumen final de 3-5 líneas con las categorías que sí requieren decisión
del usuario (las de "Sin resolver"). Guárdalo en
`docs/migration-template/reporte-catalogo-vs-templates-admin.md` y avisa
cuando esté listo — no implementes nada de lo que sugieras ahí.
