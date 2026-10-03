# Prompt de Ejecución — Fase 0: Migrar CSS por nombre de tag a selectores por clase + unificar breakpoints

## Rol y actitud esperada

Eres un desarrollador senior de Angular/SCSS ejecutando un refactor de **bajo
riesgo pero alta precisión**. Esta fase NO renombra ningún componente ni selector
de Angular — solo cambia CÓMO el CSS apunta a esos componentes (de "por nombre de
tag" a "por clase explícita"), para que una fase futura de rename no rompa
estilos en silencio.

**Regla de oro: cada cambio debe ser visualmente idéntico al estado actual.**
Esta fase es invisible para el usuario final si se hace bien. Si cambias cómo se
ve algo, hiciste algo mal — repórtalo, no lo dejes pasar.

No soy yo (el agente que te da este prompt) quien va a revisar tu trabajo línea
por línea en tiempo real — vas a ejecutar de forma autónoma y entregar un reporte
verificable al final. Por eso cada cambio debe quedar documentado con
antes/después y evidencia de que no rompiste nada.

## Contexto del proyecto

- `appsweb/angular` — Angular 22, zoneless (`provideZonelessChangeDetection()`).
- Librería de componentes: `appsweb/angular/src/app/shared/ui/`.
- Arquitectura: `appsweb/angular/src/app/shared/ui/arquitectura-shared-ui.md`
  (LÉELO COMPLETO antes de tocar nada).
- Decisión de plataforma en runtime: `core/services/platform.service.ts` —
  `isMobile()` = `Capacitor/Cordova nativo` O `window.innerWidth < 768`. Es un
  signal reactivo a `resize`.
- Documento origen de esta tarea (auditoría completa, LÉELO para contexto):
  `docs/SharedLuxuryApp/DesignSystem/20261002-verificacion-catalogo-marca-lux.md`
  — sección 7.2 y 7.3 son el alcance exacto de esta fase.
- Plan maestro que ordena esta fase dentro de un proceso mayor:
  `docs/SharedLuxuryApp/DesignSystem/20261002-plan-maestro-secuencia-catalogo-lux.md`

## Por qué existe esta fase (para que entiendas el riesgo, no solo la tarea)

Hay una propuesta futura de renombrar selectores de componentes (ej. `app-icon` →
`lux-icon`, `iw-button` → `lux-button-web`). Hoy existe CSS que selecciona esos
componentes **por nombre de tag literal** en vez de por clase:

```scss
/* ejemplo real encontrado */
app-icon { font-size: 1.15rem; }
```

Si el componente se renombra sin tocar este CSS, la regla deja de aplicar **sin
ningún error de compilación ni de lint** — el build pasa, pero el ícono pierde su
tamaño en producción. Tu trabajo es eliminar ese riesgo ANTES de que el rename
ocurra, migrando cada regla a una clase explícita que sobreviva cualquier rename
futuro del selector de Angular.

## Alcance exacto — 19 reglas CSS reales confirmadas (no busques más por tu cuenta en esta fase; están todas aquí)

> Si durante el trabajo encuentras una 20ª regla que claramente aplica al mismo
> patrón, migrarla también y documentarla aparte como "hallazgo adicional no
> listado en el alcance original" — pero no expandas el alcance a limpieza
> general de CSS no relacionada.

### Grupo A — Estilos globales (`src/styles/`)

1. `src/styles/custom/_committee.scss:954`
   ```scss
   lx-card { display: block; }
   ```
2. `src/styles/custom/_committee.scss:1006`
   ```scss
   ili-button { flex: 1 1 0; min-width: 0; }
   ```
3. `src/styles/custom/_committee.scss:1355`
   ```scss
   app-icon { font-size: 1.15rem; }
   ```
4. `src/styles/custom/_custom-table.scss:116`
   ```scss
   app-sorticon, .app-table-sorticon, svg { /* ... */ }
   ```
5. `src/styles/custom/_print.scss:167`
   ```scss
   app-data-view-mobile { /* ... */ }
   ```
6. `src/styles/shared/_sidebar.scss:322-325`
   ```scss
   app-header-employee-monitor .toolbar-icon-btn app-icon,
   app-header-employee-monitor iw-button app-icon { font-size: 1.4rem; }
   ```
7. `src/styles/shared/_sidebar.scss:383-386`
   ```scss
   app-icon { flex: 0 0 auto; margin-left: auto; }
   ```
8. `src/styles/mobile/_ili-buttons.scss:59-63`
   ```scss
   ion-button app-icon,
   ion-button ion-icon { margin-inline-end: 14px; }
   ```
   > Nota: `ion-icon` es componente nativo de Ionic, NO se toca. Solo migrar la
   > parte que selecciona `app-icon`.
9. `src/styles/web/_buttons.scss:506-526`
   ```scss
   :is(iw-button-edit, iw-button-delete, iw-button-item, iw-button-save,
       iw-button-download, iw-button-confirm, iw-button-add,
       iw-button-active-desactive, iw-button-send-email, iw-button-tracking,
       iw-button-view-pdf, iw-button) > .btn { /* ... */ }
   ```
10. `src/styles/web/_buttons.scss:530-559`
    ```scss
    :is(iw-button-*) + :is(iw-button-*) { margin-inline-start: .25rem; }
    ```
    (mismos 12 selectores `iw-button-*` del punto 9, en combinación adyacente)

### Grupo B — Estilos embebidos en componentes de `shared/ui/`

11. `src/app/shared/ui/mobile/badge/badge.ts:19,23`
    ```scss
    ili-badge .ili-badge-small { /* ... */ }
    ili-badge .ili-badge-large { /* ... */ }
    ```
12. `src/app/shared/ui/mobile/chip/chip.ts:43`
    ```scss
    ili-chip ion-chip.ili-chip-clickable { cursor: pointer; }
    ```
13. `src/app/shared/ui/mobile/image/image.ts:65`
    ```scss
    ili-image ion-img::part(image) { object-fit: contain; }
    ```
14. `src/app/shared/ui/buttons/web-icon/button-tracking.ts:46`
    ```scss
    .tracking-badge-anchor app-badge { /* ... */ }
    ```
15. `src/app/shared/ui/web/toast/toast.ts:96-103` (4 reglas)
    ```scss
    .app-toast-success app-icon { /* ... */ }
    /* + 3 reglas análogas para otros estados de toast */
    ```
16. `src/app/shared/ui/buttons/mobile-label/button.ts:38,41`
    ```scss
    app-icon[slot="start"] { /* ... */ }
    app-icon[slot="end"] { /* ... */ }
    ```

### Grupo C — Estilos embebidos en componentes de NEGOCIO (`src/app/modules/`)

> Importante: estos son los más delicados porque viven fuera de `shared/ui/` —
> confirmar con el dueño del módulo si hace falta, pero la migración en sí es
> mecánica (mismo patrón que el resto).

17. `src/app/modules/operations.luxuryapp/.../task-list.ts:115,118,121`
    ```scss
    :host ::ng-deep app-table-caption { /* ... */ }
    :host ::ng-deep app-task-status { /* ... */ }
    :host ::ng-deep base-input-signal { /* ... */ }
    ```
18. `src/app/modules/recruitment.luxuryapp/.../filter-requests.ts:57-90`
    ```scss
    :host ::ng-deep base-input-signal { /* ... */ }
    :host ::ng-deep custom-search-input-signal { /* ... */ }
    :host ::ng-deep custom-input-date-signal { /* ... */ }
    :host ::ng-deep custom-input-select-button-signal { /* ... */ }
    ```
19. `src/app/modules/recruitment.luxuryapp/.../employee-form.ts:43`
    ```scss
    .employee-shell-header lx-section-nav { flex: 1 1 720px; }
    ```
20. `src/app/modules/recruitment.luxuryapp/.../vacante-detail-modal.ts:34-55` (4 reglas)
    ```scss
    :host ::ng-deep app-tabs > .nav.nav-tabs { /* ... */ }
    /* + 3 reglas análogas */
    ```

> El conteo real auditado es 19 reglas "altas" + algunas de riesgo medio
> (ancestro/descendiente) ya incluidas arriba. Usa el archivo anexo completo
> para no perder ninguna:
> `docs/SharedLuxuryApp/DesignSystem/20261002-verificacion-anexo-css-breakpoints.txt`
> — ahí está el listado crudo de las 144 coincidencias originales (la mayoría son
> falsos positivos ya descartados: comentarios, specs, strings de documentación;
> confirma tú mismo cuáles de las 144 son reglas CSS reales antes de migrar, no
> asumas que ya están bien filtradas).

## Metodología de migración (por cada regla)

Para CADA una de las reglas anteriores:

1. **Identifica el componente de Angular real** al que apunta el selector de tag
   (ej. `app-icon` → `src/app/shared/ui/shared/app-icon/app-icon.ts`).
2. **Decide el mecanismo de reemplazo**, en este orden de preferencia:
   - a) Si la regla aplica al **host** del propio componente de la librería
     (casos 1, 2, 11, 12, 13): usa `:host` dentro del propio componente, O agrega
     una clase fija al host (`host: { class: 'lux-badge' }` en el decorator) y
     referencia esa clase desde fuera si hace falta.
   - b) Si la regla aplica **desde fuera** al componente (casos 3, 6, 7, 8, 9, 10,
     14, 15, 16, 17, 18, 19, 20): agrega un atributo `[attr.data-component]` o una
     clase CSS fija y predecible al `host` del componente de la librería (ej.
     `host: { class: 'lux-icon' }` en `app-icon.ts`, o
     `host: { 'data-component': 'icon' }`), y cambia el selector CSS externo para
     apuntar a esa clase/atributo en vez del nombre de tag.
   - c) Si la regla es compuesta (`:is(iw-button-edit, iw-button-delete, ...)`,
     casos 9-10): agrega la MISMA clase fija a todos los componentes de botón
     involucrados (ej. `class: 'lux-button-web'` en el host de cada uno) y
     reemplaza el selector compuesto por esa única clase.
3. **Aplica el cambio** en ambos lados: el host del componente Angular (si hace
   falta agregar la clase) Y el selector CSS (cambiar de tag a clase/atributo).
4. **No cambies ningún `selector:` de `@Component` en esta fase.** Esa es la
   fase del rename, que viene después. Aquí solo tocas CSS + la clase/atributo
   fija del host, que sobrevive cualquier rename futuro del selector.
5. **Verifica visualmente** el componente afectado en los 3 breakpoints
   relevantes (ver sección siguiente) antes de pasar a la siguiente regla.

## Unificación de breakpoints (segunda parte de esta fase)

Thresholds `@media` encontrados hoy (de la auditoría, confirmar que siguen
vigentes al momento de ejecutar): `366, 414, 480, 560, 575, 575.98, 640, 767,
768, 900, 992, 1199, 1200, 1216, 1999`.

- El breakpoint real de decisión de plataforma (`PlatformService`) es **768px**
  (`window.innerWidth < 768`).
- Candidatos a unificar hacia 768 (confirmar archivo por archivo si el `@media`
  en cuestión está decidiendo algo relacionado con mobile/desktop, o si es un
  ajuste de layout fino no relacionado con esa decisión — NO unifiques breakpoints
  que no tengan relación con la decisión de plataforma, solo los que sí):
  - `src/styles/custom/_list.scss:114,120,145` (992/1199) — confirmar si decide
    layout mobile/desktop o es un ajuste de grid interno.
  - `src/styles/custom/_list.scss:170` (1216) — idem.
  - `src/styles/shared/_auth.scss:26,46` (992) — idem.
  - `src/styles/custom/_committee.scss:762` (900) — idem.
  - `src/app/shared/ui/web/action-menu/action-menu.ts:61` (767, YA coincide
    numéricamente con `<768`, probablemente solo normalizar a 768 por
    consistencia de escritura).
  - `src/app/shared/ui/inputs/base/base-input-signal.ts:113` (768, ya coincide).
- **No toques** los breakpoints que claramente son de diseño responsive fino
  dentro de un mismo modo (ej. ajustar columnas de un grid en pantallas grandes)
  — esos no tienen relación con la decisión mobile/web de `PlatformService` y
  tocarlos está fuera de este alcance.
- Para cada `@media` que SÍ decidas unificar: documenta el valor anterior, el
  nuevo (768), y evidencia visual de que el layout se sigue viendo bien en el
  breakpoint anterior y el nuevo.

## Verificación obligatoria (no es opcional, es parte de la tarea)

Para cada componente tocado, antes de darlo por terminado:

1. `npm run build` (o el comando de build de producción del proyecto) debe
   terminar sin errores.
2. Captura de pantalla (o descripción detallada si no puedes capturar pantalla,
   pero preferible captura real) ANTES y DESPUÉS del cambio, en 3 anchos de
   viewport:
   - `< 768px` (mobile)
   - `768-992px` (zona de transición, la más propensa a mostrar inconsistencias)
   - `> 992px` (desktop)
3. Verifica específicamente estos flujos reales de negocio citados en la
   auditoría, porque son los puntos de uso confirmados de las reglas migradas:
   - Sidebar con header de empleado (afecta reglas 3, 6, 7)
   - Cualquier tabla con botones de acción por fila (afecta reglas 9, 10)
   - Toast de confirmación/éxito (afecta regla 15)
   - `modules/recruitment.luxuryapp` → pantalla de filtros de solicitudes (afecta
     regla 18)
   - `modules/recruitment.luxuryapp` → modal de detalle de vacante (afecta regla 20)
   - `modules/recruitment.luxuryapp` → header de formulario de empleado (afecta
     regla 19, sección nav)
   - `modules/operations.luxuryapp` → lista de tareas (afecta regla 17)
4. Ejecuta `npm run audit:ui` (debe seguir en verde, esta fase no toca fronteras
   de capas) y cualquier suite de tests unitarios existente sobre los componentes
   tocados — reporta si algún test rompe y por qué.

## Qué NO hacer en esta fase

- No renombres ningún `selector:` de `@Component`.
- No toques imports (`@ui/web/...`, `@ui/mobile/...`) — eso es de fases
  posteriores.
- No "aproveches" para limpiar CSS no relacionado con las 19-20 reglas listadas.
- No unifiques breakpoints que no tengan relación clara con la decisión
  mobile/desktop de `PlatformService` — si tienes duda sobre un threshold
  específico, documéntalo como "pendiente de decisión" en vez de tocarlo a
  ciegas.

## Formato de entrega esperado

Un documento Markdown con:

1. **Tabla de las 19-20 reglas**, cada una con: archivo original, línea, mecanismo
   de reemplazo usado (clase/atributo elegido), archivo(s) modificados, y
   confirmación de verificación visual (✅/❌ + nota si algo no cuadró).
2. **Tabla de breakpoints**: cuáles se unificaron a 768, cuáles se dejaron igual
   y por qué (con tu justificación de "decide mobile/desktop" vs "layout fino no
   relacionado").
3. **Resultado de build + audit:ui + tests** (pega la salida real de consola).
4. **Lista de cualquier regla CSS adicional** encontrada durante el trabajo que no
   estaba en el alcance original de 19-20, con tu recomendación de si migrarla
   ahora o dejarla para después (pero indica claramente si la migraste o no).
5. **Riesgos o dudas abiertas** que encontraste y no resolviste por tu cuenta
   (ej. "no estoy seguro si el breakpoint de `_list.scss:114` decide mobile/web o
   es solo un ajuste de columnas, lo dejé sin tocar, decidir antes de Fase 1").

## Restricciones finales

- Haz commits pequeños y atómicos, uno por regla o grupo lógico de reglas
  relacionadas (no un solo commit gigante con las 20).
- Si algo de lo listado aquí ya no existe o cambió de línea al momento de
  ejecutar (el código pudo moverse desde la auditoría), documéntalo y localiza el
  equivalente actual antes de migrar — no omitas la regla solo porque la línea
  exacta ya no coincide.
- Si encuentras que migrar alguna regla requiere tocar un componente compartido
  usado en muchos lugares (ej. `app-icon` mismo), sé extra cuidadoso con la
  verificación visual en más de un punto de uso, no solo el citado en la
  auditoría.
</content>
