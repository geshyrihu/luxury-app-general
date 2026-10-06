# Roadmap — framework UI interno LuxuryApp (`lux-*`)

**Fecha:** 2026-10-06
**Estado:** vigente, ejecución por gates.
**Baseline:** [Inventario actual](./20261006-baseline-framework-lux.md).
**Decisión de distribución:** uso interno en monorepo; no instalar ni publicar vía npm ahora.

## 1. Misión

Convertir `shared/ui` en una plataforma visual estable para los módulos LuxuryApp, con API reconocible `lux-*`, soporte Angular web + Ionic, calidad accesible, contratos probados y catálogo que acelere desarrollo sin duplicar lógica ni forzar falsa paridad entre plataformas.

“Comparable con PrimeNG” significa consistencia de contratos, documentación, estados, accesibilidad, extensibilidad, pruebas y soporte; **no** replicar todos sus widgets ni su tamaño.

## 2. Decisiones de arquitectura

### Organización y consumo

- Conservar ubicación `src/app/shared/ui` durante esta evolución; no hacer movimiento físico a `projects/` como primer paso.
- Definir barrels públicos internos por familia y una lista explícita de API soportada.
- API adaptativa `lux-*` cuando web/Ionic realmente comparten intención y contrato.
- `web/` (Bootstrap/native) y `mobile/` (Ionic) conservan implementación, estilo y capacidades propias.
- Adaptadores pueden conocer ambas plataformas; implementaciones de plataforma no importan entre sí.
- Las features migran gradualmente a la entrada oficial. Imports directos actuales son deuda visible, no razón para proclamar ya una frontera inexistente.
- Componentes internos no dependen de `@core`, servicios de negocio, módulos funcionales o rutas concretas. Integraciones host se inyectan mediante contratos/tokens/adapters UI.

### Plataforma y UX

- `PlatformService` define decisión adaptativa cuando la experiencia y el lifecycle realmente requieren selección de plataforma.
- No inferir plataforma únicamente por CSS/media query ni insertar web y mobile en el mismo template sin un patrón probado.
- No exigir pixeles idénticos: exigir semántica, contenido, estados, accesibilidad y flujos equivalentes; aceptar presentación adecuada por plataforma.
- Iconos/control de estados deben tener contrato de accesibilidad; icon-only exige nombre accesible.

### Distribución

- Actualmente consumo interno desde Angular app privada.
- Mantener límites para que extracción futura sea posible, pero no implementar package publishing, semver ni npm registry hasta existir consumidor/proveedor de releases aprobado.

## 3. Secuencia de fases

### Fase 0.5 — Reparar catálogo Admin vivo (**código y smoke QA completos; axe follow-up pendiente**)

- `catalog-web-item.ts` pertenecía a una ruta lazy activa y conservaba 47 tags legacy.
- Agente externo migró tags a `lux-button-web`/`lux-pdf-viewer-trigger` en `b01151c30`, con un archivo autorizado; build y `audit:ui` reportados verdes.
- QA browser completada: desktop 1280×720, mobile 390×844, API 200 y consola sin errores; no hubo overflow horizontal.
- Axe reportó tres violaciones y un caso incomplete en scope demo: cuatro botones nativos `.ds-icon-btn` sin nombres, `ion-spinner` sin nombre, `ion-icon` como imagen sin alternativa; contraste mobile queda incompleto para comprobación manual. Ninguna violación reportada pertenece a los `<lux-button-web>` migrados.
- Hay unos 19 `lux-button-web displayMode="icon"` del shell cuyo fallback accesible es genérico (“Continuar”); queda para contrato/limpieza transversal, fuera de este lote.
- Reporte y decisión de follow-up: `20261006-reconciliacion-censo-agentes.md`.

**Gate:** migración runtime y QA funcional cerradas; los hallazgos a11y quedan abiertos como follow-up separado.

### Fase 0 — Baseline y ownership (**censo recibido; matriz de propiedad incompleta**)

- Censo read-only de seis agentes recibido y reconciliado; Angular estaba limpio en `4b66d24e3`, build fresco completó sin errores/warnings.
- Baseline, matriz inicial y hallazgos están documentados en este directorio.
- Falta clasificar los 316 componentes por owner/madurez y reconciliar conteos con un scope canónico.
- Repo raíz conserva cambios ajenos; stage/commit solo con pathspec UI explícito.

**Gate:** matriz exhaustiva por componente, owner, consumers, contrato y madurez aprobada.

### Fase 1 — Contrato y fronteras internas

- Matriz componente: selector, clase/export, capa, plataforma, inputs/outputs, estados, dependencias, consumers, owner, madurez.
- Barrels estables por familia; imports internos consolidados sin crear aún package npm.
- Auditorías: features → API soportada; web↔Ionic prohibido; UI → negocio/core concreto prohibido.
- Migrar direct imports en lotes medidos; mantener bridges hasta cero consumidores y pruebas.

**Gate:** mapa completo de imports, límites automatizados, cero cambios de contratos sin pruebas y consumers migrados por lote.

### Fase 2 — Fundaciones de producto visual

- Tokens: color semántico, tipografía, espaciado, radios, elevation, focus, motion, breakpoints con justificación.
- Tema y configuración por host sin valores hardcodeados de negocio.
- Política de iconos, mensajes, validación, loading/empty/error/disabled/readonly.
- Textos localizables mediante integración del host; sin acoplar `shared/ui` a idioma de una feature.

**Gate:** tokens documentados y auditables; tema probado en web e Ionic; textos demostrablemente traducibles.

### Fase 3 — Accesibilidad y componentes estructurales de riesgo alto

Prioridad: buttons/forms, dialogs/modals/popovers/menus/toasts/tooltips, tabs/navigation, tables/data views.

- WCAG 2.1 AA mínimo vigente en proyecto; evaluar WCAG 2.2 AA como decisión posterior documentada.
- Teclado completo, foco inicial/atrapado/restaurado donde aplique, Escape, focus-visible, nombre/role/state, live regions.
- Tests de teclado/screen-reader semantics + axe por componente/flujo; axe no reemplaza revisión manual.

**Gate:** checklist por componente, pruebas útiles y cero defectos a11y críticos/serios abiertos en el scope aceptado.

### Fase 4 — APIs/forms y paridad de capacidades

- Unificar contratos Angular Forms (`ControlValueAccessor`, Reactive Forms y `ngModel` solo donde esté soportado).
- Matriz por input web/Ionic: valor, disabled, readonly, touched/dirty, errores, formatos, eventos y cancelación.
- Bridges migrados por casos reales; no convertir diferencias incompatibles a `any` ni propagar API raw de terceros.

**Gate:** tests contractuales por input prioritario en ambos targets y consumers representativos migrados.

### Fase 5 — Cobertura funcional y extensibilidad

- Reemplazar specs superficiales por tests de input/output, keyboard, loading/error/empty, forms, overlays y responsive.
- Definir slots/templates/projection donde casos de uso lo justifiquen (`ng-content`, `TemplateRef`), sin añadir extensibilidad especulativa.
- Mantener objetivo de cobertura basado en riesgo/contrato, no en porcentaje ciego.

**Gate:** cada componente `stable` tiene suite de comportamiento que falla ante regresión contractual.

### Fase 6 — Catálogo visual y adopción

- Stories para cada API estable y variantes principales; docs: cuándo usar, API, estados, a11y, web/Ionic.
- Ejemplos ejecutables y shell/demo aislado dentro del repo que importe solo API soportada.
- Visual QA por familia/tamaño para componentes con riesgo visual; publicar baseline visual revisable.

**Gate:** componentes estables tienen story/documentación y demo representa el contrato real.

### Fase 7 — Componentes por demanda y deuda legacy

- Ordenar por consumo y valor: fundamentos, buttons, inputs, overlays, data presentation, navigation, charts/specialized.
- Clasificar componente como `stable`, `experimental`, `deprecated` o `app-specific` con criterios y owner.
- No construir componente ya cubierto por PrimeNG/Ionic salvo que haya brecha de UX, marca, accesibilidad o contrato que justifique propiedad custom.
- Eliminar legacy solo tras cero consumers, contract tests equivalentes y migración documentada.

**Gate:** cada decisión build-vs-adopt tiene consumer/caso y evidencia; cero eliminación masiva por grep solamente.

## 4. Madurez por componente

| Nivel | Requisito mínimo |
|---|---|
| `experimental` | Owner, caso real, contrato inicial y nota de limitaciones. |
| `stable` | API documentada, estados, a11y, tests conductuales, story y consumer probado. |
| `deprecated` | Alternativa, motivo, consumer count, ventana y plan de migración. |
| `app-specific` | Queda fuera de catálogo reusable hasta demostrar segundo consumer/caso genérico. |

## 5. Gobernanza y ejecución paralela

- **Regla operativa del usuario (2026-10-06):** cuando el lote modifica código, el orquestador crea el plan por fases y los prompts/rutas de trabajo; agentes externos ejecutan las ediciones; el orquestador controla ownership, gates, revisión e integración. El orquestador no sustituye la implementación delegada con codemods globales.
- Primero auditoría read-only + decisiones; después implementación.
- Escritura en paralelo solo con baseline congelado, worktree independiente por agente y paths exclusivos.
- Archivos transversales (`index.ts`, tokens, audit scripts, base/adaptive APIs) tienen un único owner por lote.
- Prohibido `git add .`, staging global, cambiar APIs compartidas sin review o ocultar errores con Angular schemas.
- Cada lote entrega rutas, diff, pruebas y build; integrar un lote antes de abrir el siguiente que dependa de él.

## 6. Gate de framework interno “listo para adopción general”

- Build + `audit:ui` + audits de design/tokens/accessibility que cubran el baseline aprobado.
- API pública interna y capas sin contradicción documental.
- Consumers reales migrados por lotes; cero import accidental de implementaciones en features para componentes ya adaptados.
- Tests de comportamiento y estados para componentes estables.
- A11y keyboard/axe/manual; i18n y theming verificables.
- Storybook/demo cubre catálogo `stable`.
- Flujos web e Ionic QA verificados.
- Inventario de deuda aceptada, experimental y app-specific mantenido.

## 7. Siguiente entrega

1. No repetir QA catálogo: ya completada. Abrir follow-up a11y separado para los cuatro `.ds-icon-btn`, spinner/icon mobile y nombres genéricos del shell.
2. Reconciliar los cambios sin commit observados contra allowlists y reportes externos. Ocho `shared.luxuryapp` listados corresponden al scope Agente 3; los dos `work-position-form` ya fueron commit/push del usuario (`7dca9a227`); `input-file` sigue en shared UI y requiere consentimiento del owner.
3. Integrar solamente los cambios autorizados; respetar `budget-proposals/**` bloqueado y `catalog-web-item.ts`/`base-button.ts` ocupados por otros procesos. Luego correr build, `audit:ui` y búsqueda de sufijos malformados sobre el estado integrado.
4. Cerrar Gate 0 completo con owners/madurez por componente y discrepancias de inventario reconciliadas.
5. Aprobar contrato adaptativo de botón: 784 imports web/mobile combinados y brechas reales hacen inviable un reemplazo mecánico.
6. Abrir planes de overlays a11y y CVA inputs, con prompts externos, worktrees y paths exclusivos.

Este roadmap no autoriza una migración masiva ni modifica por sí solo `CONVENTIONS.md`; toda regla nueva requiere aprobación y reflejo coordinado en el sistema documental.
