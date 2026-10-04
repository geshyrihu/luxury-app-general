# Fase 2 - Rename web y residuos app

- Repo Angular: `appsweb/angular`
- Base vigente: `3fd731334`
- Worktree: `fase2-wt`
- Rama: `feat/fase2-rename-web-lux-web`

## Cambios

- `web/**`: 86 selectores `app-*` -> `lux-*-web`.
- `primitives/**`: 18 selectores `app-*` -> `lux-*`.
- `inputs/**`: 3 selectores `app-*` -> `lux-*`.
- `charts/**`, `ai-chat-widget/**`, `image-analysis-dialog/**`: 3 selectores -> `lux-*`.
- Wrapper muerto `adaptive/icon/icon.ts` eliminado. Tenia selector `lux-icon`, cero usos reales y colisionaba con `primitives/app-icon` -> `lux-icon`.
- `mobile/**`: no se renombraron selectores ni implementaciones. Tres archivos solo actualizaron referencias `<app-icon>` -> `<lux-icon>`, necesario porque el componente primitivo cambió de selector.
- No se tocaron botones ni SCSS.

## Codemod

Archivo: `scripts/fase2-rename.mjs`.

- Dry-run inicial: 86 selectores web, 24 no-web.
- Aplicado: 802 archivos tocados.
- Segunda ejecución: 0 cambios.
- Bug corregido durante ejecución: el primer detector usaba `match()` y omitía componentes múltiples en `web/table/table.ts`; cambiado a `matchAll()`. Verificado con `app-table-checkbox`, `app-table-header-checkbox` y `app-table-selection-checkbox`.

## Verificaciones

| Comando | Resultado |
|---|---|
| `npm run build` | Verde; bundle generado |
| `npm run audit:ui` | Verde |
| Tests web + primitives + adaptive + core | 161 archivos, 296 tests passed |
| Codemod segunda ejecución | 0 cambios |
| Generador `ui-dictionary` | 361 componentes, 0 paths legacy |
| `npm run audit:encoding` | 11 incidencias preexistentes; mismo resultado en baseline `folders-wt` |

Los tests terminan con exit 1 por 4 errores no controlados preexistentes, aunque los 296 tests pasan. Error principal: Chart.js `"category" is not a registered scale`; reproducido también en baseline sin Fase 2.

## Referencias legacy

- `selector: "app-"` en `web/**`: 0.
- `selector: "app-"` en residuos no-mobile: 0.
- `lx-section-nav`: 0.
- `lux-section-nav`: presente; ya venia migrado por main.
- Selectores `app-*` restantes en `mobile/**`: 2, intencionales.

## QA visual

QA interactivo quedó bloqueado por infraestructura de autenticación:

- Login intenta `POST http://localhost:7070/api/auth/login`.
- Respuesta: `ERR_CONNECTION_RESET`.
- La página permanece en `/auth/login`.
- Capturas de evidencia: `20261004-fase2-qa-login-1400.png`, `20261004-fase2-qa-login-850.png`, `20261004-fase2-qa-login-600.png`.

No se pudo validar dashboard autenticado, tabla, sidebar, modal y toast en navegador. Build, compilación de templates, audit y tests sí verifican integridad estática. Errores 403 de assets del dev server también aparecieron y no son del rename.

## Estado

Commit/push deben ejecutarse después de revisar este bloqueo de QA. El checkout principal y sus cambios concurrentes no fueron tocados.
