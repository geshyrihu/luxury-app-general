# Prompt Fase 8 — Lightbox con `ng-gallery@12` (look Lagos)

## Cambio de decisión (2026-09-17)

La versión anterior de este prompt proponía replicar el look Lagos **sin
librería** (Bootstrap + `NgbModal`). El usuario decidió lo contrario:
**adoptar `ng-gallery@12`** y se encarga personalmente de instalar la
dependencia. Este documento reemplaza esa decisión.

## Dependencia (la instala el usuario)

- Paquete: `ng-gallery@12` (el template Lagos usa `"^12.0.0"`).
- `@angular/cdk` ya está instalado (`22.1.6`) y es requerido por el
  lightbox de `ng-gallery`.
- **Verificado en npm (2026-09-17):** `ng-gallery@12.0.0` declara
  `dependencies: { tslib }` y peers `@angular/core >=16`,
  `@angular/cdk >=16`, `rxjs >=7` → **compatible con Angular 22.1.6**.
- **No requiere `photoswipe`**: el lightbox viene dentro del paquete
  (confirmado en `dependencies`).
- Sugerencia de comando (el flag es por el conflicto preexistente de
  `vitest`/`@analogjs` del repo, no por `ng-gallery`):
  `npm i ng-gallery@12 --legacy-peer-deps`.

## Cómo lo usa Lagos (referencia verificada, no asumida)

- `lagos/.../gallery-grid/gallery-grid.ts`:
  `imports: [LightboxModule, GalleryModule, SlicePipe]` — **sin
  `forRoot`**.
- `lagos/.../gallery-grid/gallery-grid.html`: contenedor con
  `gallerize`, y dentro
  `<figure itemprop="associatedMedia"><a itemprop="contentUrl"
  data-size="1600x950"><img itemprop="thumbnail"></a></figure>`.
- **No hay ningún import global de CSS de lightbox** en Lagos
  (verificado: 0 coincidencias en `src/**/*.scss|css`). El paquete
  resuelve sus estilos internamente.
- El template ya tiene animaciones (`provideAnimationsAsync()`);
  `ng-gallery` requiere animaciones disponibles.

## Alcance por fases (para no romper 29 consumidores)

**Fase A — este prompt.** Integrar `ng-gallery` en **una sola pantalla
real**: el visor de fotos de tickets
(`operations.luxuryapp/task-engine/tasks/task-message/task-photos-viewer`),
que ya es una galería real (antes/después + imágenes adicionales) y hoy
usa `lx-image` con preview `NgbModal`.

**Fase B — prompt aparte, requiere aprobación explícita.** Evaluar si
`app-image` (`shared/ui/web/image`) migra su `preview` del `NgbModal`
actual al servicio de lightbox de `ng-gallery`. **No se toca en este
prompt**; afecta ~25 archivos consumidores.

## Tareas

1. **Antes de escribir código**, leer el API real instalado:
   - `node_modules/ng-gallery/lightbox/index.d.ts` (servicio y
     directivas),
   - `node_modules/ng-gallery/index.d.ts` (configuración).
   No asumir nombres de servicio/inputs: usar los que existan en los
   `.d.ts` instalados.
2. Registrar la configuración global si el paquete la exige (en
   `app.config.ts`). Si Lagos funciona sin `forRoot`, no agregarlo por
   inercia.
3. **Fase A**:
   - `task-photos-viewer.ts`: importar `GalleryModule` y
     `LightboxModule` (patrón Lagos).
   - `task-photos-viewer.html`: reemplazar `<lx-image>` por el markup
     `figure/a/img` con `gallerize` en el contenedor, conservando los dos
     modos actuales (`before-after` y `additional`) y el estado vacío.
   - Si algún dato de dimensiones reales no existe, omitir `data-size`
     en vez de inventarlo.
4. Actualizar documentación:
   - `02-plan-migracion.md`: registrar la dependencia nueva y la
     convivencia deliberada (la Fase 8 venía **retirando**
     dependencias; esto es una excepción explícita del usuario).
   - `03-inventario-componentes.md`: fila de `image`/lightbox.
   - `04-bitacora-cambios.md`: entrada con fecha, archivos, build y
     evidencia visual.

## Restricciones

- **No** tocar los ~25 consumidores de `<app-image` ni los 4 de
  `<lx-image` en Fase A.
- **No** modificar `ImageBase` ni `app-image`.
- **No** reintroducir PrimeNG.
- **No** instalar `photoswipe` ni `@ngx-gallery/*` / `@ks89/*` (Lagos
  los tiene por versiones viejas, no hacen falta aquí).
- La dependencia entra por decisión explícita del usuario; queda
  registrada, no oculta.

## Verificación

- `npx tsc --noEmit` → 0 errores.
- `npx ng build --configuration production` con log completo
  (`> log 2>&1`, sin `tail`) → exit 0, 0 `ERROR`.
- `npm run audit:ui`: si señala la dependencia nueva, **reportarlo**, no
  silenciarlo.
- `git diff --check` sin errores.
- **Runtime (obligatorio):** iniciar sesión, abrir el visor de fotos de
  un ticket, hacer click en una imagen → lightbox a pantalla completa;
  validar prev/next si hay varias, cierre con `X`/`ESC`, y capturas en
  tema claro y oscuro. Repetir en móvil.
- Si no hay acceso a navegador, reportarlo honestamente en vez de
  fabricar el resultado.

## Listo cuando

- Lightbox `ng-gallery` funcionando en el visor de fotos, con capturas
  claro/oscuro.
- `tsc`, `ng build`, `git diff --check` verdes; `audit:ui` reportado.
- 0 consumidores de `app-image`/`lx-image` modificados.
- Documentación actualizada (`02`, `03`, `04`).
- Confirmado explícitamente si Fase B (migrar `app-image`) queda
  pendiente de aprobación o se descarta.
