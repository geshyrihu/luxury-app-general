# Reporte: Catálogo UI vs. Templates Admin

Fecha: 2026-09-18

## Alcance

Comparación de implementaciones reales, no solo dependencias declaradas, entre
`appsweb/angular/src/app/shared/ui` y `templates_admin/lagos` / `templates_admin/minia`.
Este reporte no propone cambios inmediatos ni modifica código.

## 1. Editor De Texto Enriquecido

| Componente/categoría | Implementación actual                                                                                                      | Lagos                                                                                                                           | Minia                                                                                                                                  | Sugerencia                                                                                                                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Editor enriquecido   | `shared/ui/web/editor/editor.ts`: Quill `^2.0.3` directo, wrapper `ControlValueAccessor`, tema Snow y toolbar por defecto. | `ngx-editor ^18.0.0` usado en `component/editors/ngx-editor`; también `@kolkov/angular-editor ^3.0.0-beta.2` usado en demo MDE. | `@ckeditor/ckeditor5-angular ^11.0.0` + `@ckeditor/ckeditor5-build-classic ^44.3.0`; usado en `pages/form/editer/editer.component.ts`. | **Sin resolver / requiere decisión del usuario**: mantener Quill evita migración y ya cumple consumidores; adoptar CKEditor o `ngx-editor` requeriría redefinir toolbar, HTML y compatibilidad de contenido. |

**Decisión:**

- [ ] Mantener actual
- [ ] Adoptar de Lagos/Minia: Lagos **\*\***\_\_**\*\***
- [ ] Sin resolver

**Observaciones:**

---

## 2. Galería / Lightbox

| Componente/categoría | Implementación actual                                                                            | Lagos                                                                                                                                                                   | Minia                                                                                                     | Sugerencia                                                                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Galería / lightbox   | No existe galería propia. `shared/ui/web/image/image.ts` usa `NgbModal` para preview individual. | `ng-gallery ^12.0.0` + `@ngx-gallery/lightbox ^5.0.0-beta.0` usados en `component/gallery/*`; `@ks89/angular-modal-gallery ^13.0.0` también usado en demos de producto. | `ngx-lightbox ^3.0.0` usado en `pages/extended/lightbox/lightbox.component.ts`, combinado con `NgbModal`. | **Sin resolver / requiere decisión del usuario**: no adoptar hasta existir requisito real de navegación multiimagen; si se requiere, `ng-gallery` es opción rica pero Lagos mantiene más de una alternativa activa y Minia ofrece `ngx-lightbox` más simple. |

**Decisión:**

- [ ] Mantener actual
- [ ] Adoptar de Lagos/Minia: **\*\*\*\***\_\_\_\_**\*\*\*\***usa lagos
- [ ] Sin resolver

**Observaciones:**

---

## 3. Rating

| Componente/categoría | Implementación actual                                                                                 | Lagos                                                                                                        | Minia                                                                                                     | Sugerencia                                                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Estrellas            | `shared/ui/web/rating/rating.ts`: botones nativos + `AppIcon`, con lógica compartida en `RatingBase`. | `ngx-bar-rating ^8.0.1`, usado en seis demos (`current`, `horizontal`, `movie`, `number`, `square`, `star`). | `NgbRatingModule` usado en `pages/extended/rating`; soporta readonly, hover, decimal y plantillas custom. | **Mantener actual**: el catálogo ya tiene API adaptativa y accesibilidad/control de estado; cambiar a `ngx-bar-rating` o `NgbRating` añade dependencia y migración sin necesidad funcional. |

**Decisión:**

- [ ] Mantener actual
- [ ] Adoptar de Lagos/Minia: **\*\*\*\***\_\_\_\_**\*\*\*\***lagos
- [ ] Sin resolver

**Observaciones:**

---

## 4. Gráficas

| Componente/categoría | Implementación actual                                                                                                            | Lagos                                                                                                                                                            | Minia                                                                                                                                                                             | Sugerencia                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Charts               | `shared/ui/web/charts/*` usa `ngx-echarts`/`echarts`, con adaptadores que preservan datos estilo Chart.js y reactividad de tema. | `apexcharts ^5.3.4` + `ng-apexcharts ^2.0.4`, `ng2-charts ^8.0.0`, `ng2-google-charts ^7.0.0`, `ng-chartist ^10.0.0`; también usa demos reales de Apex/Chartist. | `apexcharts ^5.3.6` + `ng-apexcharts ^2.0.4`, `chart.js ^4.5.1` + `ng2-charts ^8.0.0`, `echarts ^6.0.0` + `ngx-echarts ^21.0.0`, además `@amcharts/amcharts5 ^5.14.4` y Chartist. | **Mantener actual**: ECharts está integrado y cubre tipos actuales; ambas plantillas confirman que no existe un motor único estándar. |

**Decisión:**

- [ ] Mantener actual
- [ ] Adoptar de Lagos/Minia: **\*\*\*\***\_\_\_\_**\*\*\*\***Lagos
- [ ] Sin resolver

**Observaciones:**

---

## 5. Modales / Diálogos

| Componente/categoría | Implementación actual                                                                                                          | Lagos                                                                                                                                          | Minia                                                                       | Sugerencia                                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modal / diálogo      | `shared/ui/web/dialog/dialog.ts` + `DialogHandlerService`: markup Bootstrap `.modal` nativo y backdrop controlado por señales. | Usa `@ng-bootstrap/ng-bootstrap ^20.0.0` y `NgbModal` en múltiples componentes; markup final Bootstrap, pero apertura gestionada por librería. | Usa `@ng-bootstrap/ng-bootstrap ^19.0.1` y `NgbModal` en múltiples páginas. | **Mantener actual**: el contrato unificado web/mobile y el handler del proyecto son más importantes que converger a `NgbModal`; ambos templates confirman Bootstrap como lenguaje visual, no equivalencia de API. |

**Decisión:**

- [ ] Mantener actual
- [ ] Adoptar de Lagos/Minia: **\*\*\*\***\_\_\_\_**\*\*\*\*** lagos
- [ ] Sin resolver

**Observaciones:**

---

## 6. Selects / Multiselects

| Componente/categoría | Implementación actual                                                                                                                             | Lagos                                                     | Minia                                          | Sugerencia                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------- |
| Select / multiselect | `custom-input-select-signal` y `custom-input-multiselect-signal` sobre `@ng-select/ng-select`, con variantes adaptativas y formularios reactivos. | `@ng-select/ng-select ^21.1.2`, usado en demos de select. | `@ng-select/ng-select ^21.1.2`, misma versión. | **Mantener actual**: alineación directa de librería y contrato; no adoptar nada. |

**Decisión:**

- [ ] Mantener actual
- [ ] Adoptar de Lagos/Minia: **\*\*\*\***\_\_\_\_**\*\*\*\***mantener actual
- [ ] Sin resolver

**Observaciones:**

---

## 7. Calendario / Rango De Fechas

| Componente/categoría | Implementación actual                                                                            | Lagos                                                                                         | Minia                                              | Sugerencia                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| Calendario y rango   | Wrappers del catálogo usan `angularx-flatpickr`/`flatpickr`, incluyendo rangos y locale español. | `angularx-flatpickr ^8.1.0` + `flatpickr ^4.6.13`; usado en `component/calendar/calendar.ts`. | `angularx-flatpickr ^8.1.0` + `flatpickr ^4.6.13`. | **Mantener actual**: stack y versión alineados con ambos templates. |

**Decisión:**

- [ ] Mantener actual
- [ ] Adoptar de Lagos/Minia: **\*\*\*\***\_\_\_\_**\*\*\*\***angularx-flatpickr/flatpickr,
- [ ] Sin resolver

**Observaciones:**

---

## 8. Carrusel

| Componente/categoría | Implementación actual                                                                                                                | Lagos                                                             | Minia                                                                  | Sugerencia                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Carrusel             | Sí existe `shared/ui/web/carousel/carousel.ts`, basado en `NgbCarousel`; conserva API histórica, con limitación de un slide visible. | `ngx-owl-carousel-o ^21.0.0`, usado en varias demos Owl Carousel. | `ngx-owl-carousel-o ^20.0.1`, declarado como alternativa del template. | **Mantener actual**: ya usa `@ng-bootstrap/ng-bootstrap` y cubre consumidor vigente; adoptar Owl exigiría resolver diferencias de API y layout. |

**Decisión:**

- [ ] Mantener actual
- [ ] Adoptar de Lagos/Minia: **\*\*\*\***\_\_\_\_**\*\*\*\***lagos
- [ ] Sin resolver

**Observaciones:**

---

## 9. Color Picker

| Componente/categoría | Implementación actual                                 | Lagos                                                                                                                                                 | Minia                                                           | Sugerencia                                                                                                                                         |
| -------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selector de color    | No se encontró componente propio del catálogo shared. | No aparece una librería color-picker dedicada en `package.json`; existe demo visual `customizer/color-picker`, sin dependencia dedicada identificada. | `ngx-color-picker ^20.1.1`, dependencia explícita del template. | **Sin resolver / requiere decisión del usuario**: adoptar `ngx-color-picker` solo si aparece requisito funcional; no crear wrapper por anticipado. |

**Decisión:**

- [ ] Mantener actual
- [ ] Adoptar de Lagos/Minia: **\*\*\*\***\_\_\_\_**\*\*\*\***minia
- [ ] Sin resolver

**Observaciones:**

---

## 10. OTP Input

| Componente/categoría         | Implementación actual                           | Lagos                                    | Minia                                                                                               | Sugerencia                                                                                                        |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| OTP / código de verificación | No se encontró input OTP propio en `shared/ui`. | No se encontró dependencia OTP dedicada. | `ng-otp-input ^2.0.9` declarado en `package.json`; requiere confirmar demo de uso antes de adoptar. | **Sin resolver / requiere decisión del usuario**: no existe consumidor actual que justifique agregar dependencia. |

**Decisión:**

- [ ] Mantener actual
- [ ] Adoptar de Lagos/Minia: **\*\*\*\***\_\_\_\_**\*\*\*\***minia
- [ ] Sin resolver

**Observaciones:**

---

## 11. Mapas

| Componente/categoría | Implementación actual                                                                                                              | Lagos                                                                                                         | Minia                                                                                                       | Sugerencia                                                                                                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mapas                | `shared/ui/web/territory-map/territory-map.ts` es una vista grid de territorios, no un mapa geográfico; no usa motor cartográfico. | Sí trae `@angular/google-maps ^21.0.5` y `@bluehalo/ngx-leaflet ^21.0.0`; demos reales Google Maps y Leaflet. | Sí trae `@angular/google-maps ^21.0.3`, `@asymmetrik/ngx-leaflet ^18.0.1` y `leaflet ^1.9.4`; demos reales. | **Sin resolver / requiere decisión del usuario**: elegir Google Maps o Leaflet depende de proveedor, tiles, licenciamiento y requisitos geográficos; no reemplazar `territory-map` sin caso funcional. |

**Decisión:**

- [ ] Mantener actuallagos
- [ ] Adoptar de Lagos/Minia: **\*\*\*\***\_\_\_\_**\*\*\*\***
- [ ] Sin resolver

**Observaciones:**

---

## Resumen De Decisiones

- Mantener actual: rating, gráficas, modales, selects/multiselects, calendarios y carrusel.
- Sin resolver: editor, galería/lightbox, color picker, OTP y mapas; requieren requisito funcional y decisión de librería antes de introducir dependencias.
- No hay evidencia para adoptar automáticamente una alternativa de templates: los templates contienen varias opciones por categoría y sus demos no forman un estándar único.
- Las plantillas validan la dirección Bootstrap/`ng-select`/Flatpickr, pero no justifican reemplazar implementaciones propias ya integradas con contratos del catálogo.
