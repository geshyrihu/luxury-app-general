# Baseline actual — framework interno `lux-*`

**Fecha de corte:** 2026-10-06
**Repo observado:** `appsweb/angular`, rama `main`, commit `4b66d24e3`; working tree limpio y alineado con `origin/main`.
**Warnings:** cierre confirmado por usuario; `D:\repos\luxuryapp-api\logs.txt` vacío al corte. No se lanzó build durante este censo.
**Alcance:** lectura estática de `src/app/shared/ui`, imports consumidores, `package.json` y documentación rectora.

**Progreso posterior al baseline:** Agente externo actualizó el showcase Admin en `b01151c30`; build fresco posterior produjo bundle exitoso sin errores ni warnings. Commit está en el checkout local (ahead 1), sin push confirmado en este corte.

## 1. Inventario por capa

Conteos de archivos versionados en el árbol actual. `componentDecorators` cuenta decoradores `@Component`, no valida por sí solo que cada componente sea API pública.

| Capa | TS producción | Componentes | Specs |
|---|---:|---:|---:|
| `adaptive` | 56 | 52 | 48 |
| `ai-chat-widget` | 1 | 1 | 1 |
| `buttons` | 14 | 3 | 6 |
| `charts` | 2 | 1 | 0 |
| `core` | 54 | 1 | 32 |
| `image-analysis-dialog` | 1 | 1 | 1 |
| `inputs` | 111 | 94 | 103 |
| `mobile` | 58 | 56 | 39 |
| `primitives` | 22 | 18 | 17 |
| `web` | 89 | 90 | 63 |
| **Total** | **408** | **316** | **310** |

El conteo `buttons` incluye tres decoradores en implementaciones modernizadas; variantes legacy fueron retiradas previamente. `core` mezcla contratos y bases con specs-host de prueba; no es catálogo de widgets públicos.

Además: 64 decoradores `@Directive` en 60 archivos, 0 pipes, 11 `index.ts`, 0 `public-api.ts`, 1 `*.stories.ts`. Hay 313 archivos productivos con `@Component`; varios contienen más de un decorador (316 decoradores en total). La auditoría histórica del 2 de octubre contó 357 componentes con un árbol/método anterior; no comparar ambos valores sin normalizar alcance.

Build fresco tras `4b66d24e3`: `Application bundle generation complete` (118.493 s), sin warnings ni errores. Confirmación guardada en bitácora; `logs.txt` permanece vacío.

Auditoría transversal posterior vuelve a medir 313 archivos con `@Component`, 60 con `@Directive`, 54 con señales `aria-*`/`role=` y 13 con señales keyboard/focus. Son métricas de presencia por archivo, no cobertura ni cumplimiento.

## 2. Consumo desde módulos y core

Conteo actual de líneas/import statements en TypeScript de producción bajo `modules`, `core` y `shared` no-UI, excluyendo `shared/ui`, specs y stories. Se analizaron 1,903 archivos fuente:

| Alias | Líneas de import observadas |
|---|---:|
| `@ui/adaptive/` | 1,007 |
| `@ui/buttons/` | 945 |
| `@ui/inputs/` | 958 |
| `@ui/mobile/` | 554 |
| `@ui/web/` | 250 |
| `@ui/primitives/` | 62 |
| `@ui/core/` | 23 |

Son conteos de líneas con alias, no de componentes únicos ni necesariamente de consumidores runtime; una línea puede importar más de un símbolo. Confirman consumidores directos de `web/`, `mobile/` y `buttons/`: no declarar esas carpetas “internas” ni imponer esa frontera hasta migrar/medir cada consumidor.

## 3. Contrato y distribución

- App usa Angular `^22.1.6` e Ionic `9.0.3`.
- `appsweb/angular/package.json` es la aplicación `luxury-app` y declara `private: true`.
- El sistema UI reside dentro de `src/app/shared/ui`; no tiene `public-api.ts` ni package manifest propio.
- Hay 11 barrels de subcarpeta; aún no forman una sola entrada contractual controlada.
- Botones exponen hoy `ButtonWeb` y `ButtonMobile` con selectores `lux-button-web` y `lux-button-mobile`; no hay wrapper adaptativo `lux-button`. Las features todavía importan implementaciones de plataforma directamente en bastantes casos.
- Storybook está instalado/configurado en la app; solo una story de UI detectada: `web/charts/chart-wrapper.stories.ts`.
- No está en alcance publicar npm. Diseño debe favorecer aislamiento y portabilidad futura sin crear ahora release/package pipeline.

CI tiene `audit:a11y` como informativo (`continue-on-error: true`); Storybook configura `a11y.test="todo"`. De siete rutas de axe configuradas, cinco requieren sesión y no se auditan sin `A11Y_AUTH_STATE`. El workflow a11y no debe considerarse gate bloqueante todavía.

## 4. Calidad observada

### Fortalezas existentes

- Capas `adaptive`, `web`, `mobile`, `core`, `primitives`, `buttons`, `inputs`.
- Auditoría `npm run audit:ui` protege parte de las fronteras internas.
- `PlatformService` existe y la decisión de plataforma está representada por adaptadores.
- Tokens/dark mode, Storybook, Playwright, Vitest y auditorías `audit:a11y`, `audit:contrast`, `audit:tokens`, `audit:design` existen en el repo.

### Brechas que deben medirse antes de fijar cuotas

- Storybook tiene cobertura mínima frente al inventario.
- Revisar calidad de las 310 specs: interacción, estados, accesibilidad y contratos; no asumir que cada spec da cobertura efectiva.
- Búsqueda heurística directa en TS de producción: 51 archivos contienen `aria-*` o `role=`. Agente 6 reportó 54 con scope/patrón distinto; reconciliar. Ninguna cifra expresa conformidad WCAG.
- No aparecen referencias a `TranslateService`, `TranslatePipe` o `Transloco` en producción; la única búsqueda de `translate(` cae en `transform: translate(...)` CSS de `primitives/tour/tour.ts`, no en i18n. Revisar textos visibles, labels y errores localizables antes de declarar cobertura.
- Búsqueda heurística: 71 archivos contienen `ng-content`, `TemplateRef`, `ContentChild` o `contentChild`; revisar si son puntos útiles de extensión, no solo presencia.
- Heurística de Agente 6 sobre specs: 308/310 contienen señales de interacción/render y 295 señales de assertions. No demuestra cobertura de contratos, teclado, estados o flujos; usar solo para priorizar revisión.
- Auditoría transversal agregó señales keyboard/focus en 13 archivos y third-party imports en 73 archivos; conteo propio más estricto de imports TS productivos da 68 (`@ionic` 59, `@ng-bootstrap` 4, `@ng-select` 5). La divergencia es scope/matcher; normalizar antes de usar como KPI.
- Identificar dependencias directas a `@core`, negocio, router, services y PrimeNG/Ionic por componente.
- Revalidar datos de la auditoría 2026-10-02 antes de utilizarlos como baseline: rename y migraciones posteriores alteraron el árbol y los consumidores.

## 5. Decisiones fijadas para este roadmap

1. Librería interna del monorepo; no npm/publicación en esta etapa.
2. Soporte integrado Angular + Ionic.
3. Implementaciones web y mobile permanecen separadas; adaptador público solo cuando contrato común preserve comportamiento y capacidades.
4. Valorar componentes por casos y consumidores LuxuryApp, no por imitar el tamaño de PrimeNG.
5. Ningún componente se elimina o se declara interno solo por naming; requiere mapa de consumidores y cero usos verificado.

## 6. Fuentes y método

- Conteos ejecutados sobre `src/app/shared/ui/**/*.ts`, excluyendo `*.spec.ts` y `*.stories.ts` para producción.
- Consumers: imports en TypeScript productivo de `src/app/modules/**`, `src/app/core/**` y `src/app/shared/**`, excluyendo `shared/ui/**`, specs y stories.
- Fuentes normativas: `CONVENTIONS.md`, `conventions/ui/ui-shared-library-architecture.md`, `conventions/ui/ui-usage-catalog.md`.
- Fuentes históricas de contraste: `DesignSystem/20261002-verificacion-catalogo-marca-lux.md`, reportes de Fases 1 y 2.
