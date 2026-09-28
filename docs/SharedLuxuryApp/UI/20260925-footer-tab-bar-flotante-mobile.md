# Footer móvil: altura del viewport y tab bar flotante

**Módulo:** SharedLuxuryApp / UI (layouts móviles)  
**Fecha:** 2026-09-25  
**Repo:** `appsweb/angular`  
**Alcance:** layouts móviles de employee, committee y dirección (Ionic 9 + Angular 22, PWA).

---

## 1. Problema

En producción, al abrir la PWA en iPhone, el footer (tab bar) se veía demasiado abajo: los iconos quedaban a la mitad y las etiquetas cortadas. En el navegador de escritorio con vista móvil (DevTools) no ocurría.

## 2. Diagnóstico

Los layouts móviles medían su altura con `100vh` y recortaban el excedente con `overflow: hidden`:

```
body            → Ionic structure.css: position:fixed; height:100%   (área visible real)
 └ <div height:100vh; width:100vw; overflow:hidden>                  ← problema
    └ ion-app (height:100%)
       └ .ion-page / #main-content (height:100%)
          ├ ion-header
          ├ ion-content (flex 1)
          └ ion-footer → ion-tab-bar
```

- En iOS (Safari y PWA standalone) `100vh` es la altura "grande" del viewport y puede ser mayor que el área visible. El `body` de Ionic sí mide el área visible real, por lo que el wrapper era más alto que su padre y el footer quedaba fuera del área visible y recortado por `overflow: hidden`.
- En escritorio `100vh` es igual a `innerHeight`, por eso no se reproducía.
- Adicionalmente, el `ion-tab-bar` de committee usaba el layout por defecto de Ionic (etiqueta pegada al borde inferior), mientras que el de employee tenía estilos propios que centraban icono y etiqueta. Con el mismo emulador se veían distintos.

> Nota: no se pudo medir el DOM en un dispositivo iOS real. La causa de `100vh` es la hipótesis principal, respaldada por el código y las capturas. Ver sección 6.

## 3. Solución aplicada

### 3.1 Altura del layout: `100dvh` con respaldo `100vh`

- Se creó la clase global `.ion-app-shell` en `src/styles/base/_global.scss`:
  `height: 100vh; height: 100dvh; width: 100%; overflow: hidden;`
- Los wrappers de `committee-mobile.html` y `view-employee-mobile.html` usan `class="ion-app-shell"` en lugar de `style="height: 100vh; width: 100vw; overflow: hidden;"`.
- `:host` de `view-employee-mobile.ts` y `view-direccion-mobile.ts` usa `height: 100vh; height: 100dvh; width: 100%`.

**Descartado:** anclar con `position: fixed; inset: 0`. Probado y revertido: dejaba la pantalla en blanco (la altura del contenedor colapsaba). No volver a intentarlo sin medir el DOM.

### 3.2 Tab bar compartido `.app-tab-bar`

Un solo estilo global (`_global.scss`) para los dos footers, con aspecto de píldora flotante tipo iOS 26 / WhatsApp:

| Elemento | Regla |
|---|---|
| Forma | `border-radius: 999px`, borde `--ds-border`, sombra suave |
| Fondo | `--ds-bg-surface` al 88 % (`color-mix`) + `backdrop-filter` |
| Alto útil | `--app-tab-bar-height: 52px` (+ padding 6 px y borde) |
| Margen lateral | `--app-tab-bar-margin-x: 16px` |
| Margen inferior | `max(8px, safe-area-bottom − 10px)` |
| Pestaña activa | óvalo con `--ds-primary` al 12 % sobre `.tab-selected` |
| Contenido | icono y etiqueta centrados en columna (flex) |

- `ion-footer.app-footer-floating`: transparente y sin la línea superior (`::before`).
- El `ion-footer` **sigue en el flujo flex** de la página (no se superpone al contenido), para no alterar el layout estabilizado.

### 3.3 Correcciones auxiliares en committee

- `.committee-mobile-header` y `.committee-mobile-footer` con `flex-shrink: 0`; `ion-content` con `.committee-mobile-content { min-height: 0 }` para que sea el contenido el que ceda y no el footer.
- `.ion-page` de committee con `position: relative` (igual que `#main-content` de employee).
- Se quitó el `padding-bottom: env(safe-area-inset-bottom)` inline de los `ion-tab-bar`: Ionic ya lo aplica por su cuenta.

## 4. Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/styles/base/_global.scss` | `.ion-app-shell`, `.app-footer-floating`, `.app-tab-bar` |
| `src/styles/custom/_committee.scss` | `flex-shrink`/`min-height` de header, footer y contenido |
| `core/layout/committee-layout/committee-mobile.html` | wrapper `.ion-app-shell`, footer `app-footer-floating`, `.ion-page` relativo |
| `core/layout/committee-layout/desktop/mobile-nav.html` | `ion-tab-bar` con `app-tab-bar` |
| `core/layout/employee-view/movil/view-employee-mobile/*` | wrapper `.ion-app-shell`, `:host` con `100dvh`, footer flotante |
| `core/layout/employee-view/movil/footer-employee-mobile/*` | usa `app-tab-bar`; se eliminaron estilos y clases `employee-mobile-tab-*` |
| `core/layout/direccion-view/movil/view-direccion-mobile/*` | `:host` con `100dvh` |

## 5. Ajuste rápido de dimensiones

Las medidas están en `ion-tab-bar.app-tab-bar` (`_global.scss`):

- `--app-tab-bar-height` (52 px): altura útil.
- `--app-tab-bar-margin-x` (16 px): separación lateral.
- `- 10px` en el `margin` inferior: cuánto del safe-area se resta; subirlo baja la píldora, bajarlo la sube.

## 6. Compatibilidad y pendientes

- `color-mix()` requiere iOS 16.2+. En navegadores anteriores la barra queda gris claro y no se ve el óvalo de la pestaña activa; sigue siendo usable.
- **Pendiente:** confirmar en iPhone real (PWA standalone) que el footer ya no se recorta. Si persiste, la causa probable es la barra de estado de iOS (`apple-mobile-web-app-status-bar-style`); alternativa: medir `window.innerHeight` y exponerlo como variable CSS.
- **Pendiente:** el footer no pasa "por debajo" del contenido como en WhatsApp; hacerlo requiere sacar el `ion-footer` del flujo (cambio delicado del layout).
- **Pendiente:** `--padding-bottom: 5rem + safe-area` en `.employee-mobile-content` y el `pb-8` del contenido ya no son necesarios con el footer en flujo; reducir si sobra espacio al final de las listas.
- Tras publicar, reinstalar la PWA en el iPhone: el service worker puede servir la versión anterior.

## 7. Verificación

- Emulador del navegador (iPhone 16 Pro Max, 440×956): employee (`/dashboard`) y committee (`/committee`) se ven correctos y con el mismo footer.
- El SCSS compila sin errores (`sass`).
- No se ejecutaron pruebas en dispositivo iOS real.
