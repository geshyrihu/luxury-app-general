# Prompt operativo — Migración según decisiones del catálogo

## Objetivo

Aplicar decisiones registradas en
`reporte-catalogo-vs-templates-admin.md`, preservando contratos públicos,
consumidores actuales y arquitectura adaptativa del catálogo.

## Decisiones aprobadas

- Editor: adoptar `ngx-editor` de Lagos (`^18.0.0`).
- Galería/lightbox: adoptar `ng-gallery ^12.0.0` +
  `@ngx-gallery/lightbox ^5.0.0-beta.0` de Lagos.
- Rating: adoptar `ngx-bar-rating ^8.0.1` de Lagos.
- Gráficas: adoptar `ng2-charts ^8.0.0` con `chart.js` compatible.
- Modales: adoptar `@ng-bootstrap/ng-bootstrap`/`NgbModal`, sin romper
  `DialogHandlerService` ni contratos mobile.
- Selects/multiselects: mantener implementación actual sobre `@ng-select`.
- Calendario: mantener `angularx-flatpickr`/`flatpickr` actual.
- Carrusel: adoptar `ngx-owl-carousel-o ^21.0.0` de Lagos.
- Color picker: adoptar `ngx-color-picker ^20.1.1` de Minia.
- OTP: adoptar `ng-otp-input ^2.0.9` de Minia solo si existe consumidor real;
  si no existe, agregar dependencia y wrapper no es parte de este lote.
- Mapas: mantener actual; `territory-map` no es mapa geográfico.

## Reglas de ejecución

1. No cambiar APIs públicas de wrappers sin adaptar consumidores y preservar
   `ControlValueAccessor`.
2. No migrar una categoría sin consumidor real, salvo instalación de dependencia
   explícitamente aprobada.
3. No reemplazar `DialogHandlerService` por `NgbModal` directamente en features;
   adaptar internamente el wrapper oficial si procede.
4. Verificar versiones reales antes de instalar; no asumir compatibilidad Angular.
5. Mantener separado web/mobile y respetar `shared/ui`.
6. No tocar backend ni lógica de negocio.

## Plan

1. Inventariar consumidores y APIs de cada wrapper afectado.
2. Verificar compatibilidad e instalar únicamente dependencias aprobadas.
3. Migrar por lotes pequeños: editor/rating, charts/carousel, image/gallery,
   modal/color/OTP.
4. Ejecutar `npx tsc --noEmit`, build producción, `npm run audit:ui` y
   `npm run audit:scss-build` después de cada lote relevante.
5. Actualizar reporte con decisiones aplicadas, riesgos y pendientes runtime.

## Stop conditions

- No adivinar API de librerías; detener lote y reportar si versión instalada no
  expone contrato compatible.
- No eliminar wrapper existente si todavía tiene consumidores sin migración.
- No afirmar migración runtime sin prueba o evidencia explícita.
