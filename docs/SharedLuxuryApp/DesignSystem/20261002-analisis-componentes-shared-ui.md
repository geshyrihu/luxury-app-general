Ruta: 📂 docs > 🤝 SharedLuxuryApp > 🎨 DesignSystem

> 📅 Fecha: 2026-10-02
> 🛡️ Estado: Análisis ejecutado (resultado del prompt `20261002-prompt-components.md`)
> 👤 Ejecutado por: agente IA (análisis de código real, sin opiniones no verificadas)

# Análisis de Componentes UI — `shared/ui` (Luxury App)

## ⚠️ Hallazgo crítico antes de cualquier recomendación

El prompt original (`prompts/component-library-agent.md`) pedía evaluar nomenclatura y
proponer un estándar único `lux-`/`lx-` para **todos** los componentes. **Esa premisa es
incorrecta para este código base.**

Ya existe un documento maestro —
`appsweb/angular/src/app/shared/ui/arquitectura-shared-ui.md` (última revisión 18-sep-26)—
que define una convención de selectores **intencional y vigente**, con una razón técnica
sólida detrás (patrón adaptativo web ↔ Ionic, boundary rules con lint automatizado):

| Capa | Tecnología | Selector | Por qué |
|---|---|---|---|
| `web/` | Bootstrap/native | `app-*` | Implementación de escritorio |
| `mobile/` | Ionic | `ili-*` | Implementación móvil |
| `adaptive/` | Delegador runtime | `lx-*` | Elige web o móvil según `PlatformService.isMobile()` |
| `shared/` | Angular puro agnóstico | `app-*` | No depende de plataforma |
| `inputs/` (adaptativo) | Delegador CVA | `custom-input-*-signal` (legacy conservado a propósito) | Evitar reescribir ~360 formularios |
| `buttons/` web | Bootstrap | `il-*` (label) / `iw-*` (icon) | Dos variantes visuales |
| `buttons/` móvil | Ionic | `ili-*` (label) / `ii-*` (icon) | Dos variantes visuales |

Esto está reforzado por una regla de lint (`npm run audit:ui`,
`scripts/audit-ui-boundaries.mjs`) que impide que `web/` importe Ionic o que `mobile/`
importe código web.

**Conclusión:** renombrar todo a `lx-*` (como pedía el prompt original) rompería esta
arquitectura y el boundary lint. La propuesta correcta no es "un prefijo único", sino
"consolidar los selectores legacy que quedaron fuera del patrón".

---

## 1. Resumen Ejecutivo (datos reales, 357 componentes escaneados)

| Métrica | Valor |
|---|---|
| Total de componentes `@Component` en `shared/ui` | **357** (de 454 archivos `.ts`) |
| Con spec (`.spec.ts`) | 299 (83.7%) |
| Sin spec | 58 (16.3%) |
| Selector sin uso detectado en toda la app (`<selector`) | 48 (13.4%) |
| Carpetas de 1er nivel | `inputs/` (93), `web/` (87), `mobile/` (56), `adaptive/` (51), `buttons/` (48), `shared/` (18), + 4 sueltas |

---

## 2. Inventario por prefijo de selector (datos reales)

| Prefijo | Cantidad | Capa según arquitectura documentada |
|---|---|---|
| `app-` | 107 | web/ (81) + shared/ (18) + sueltos (8) — **correcto** según convención |
| `ili-` | 66 | mobile/ (botones label + componentes Ionic) — **correcto** |
| `lx-` | 52 | adaptive/ — **correcto**, es la capa delegadora |
| `web-` | 33 | inputs/web/ (implementación interna Bootstrap) — **correcto** |
| `custom-` | 29 | inputs/adaptive/ (legacy conservado a propósito, ver §4 del doc maestro) |
| `ion-` | 26 | inputs/mobile/ (wrapper directo de Ionic) — **correcto** |
| `il-` | 13 | buttons/web-label/ — **correcto** |
| `iw-` | 12 | buttons/web-icon/ — **correcto** |
| `ii-` | 11 | buttons/mobile-icon/ — **correcto** |
| `base-` | 3 | base/ (lógica compartida, no se usa en template directamente) |
| `page-` | 2 | web/title-page-report* — nombres puntuales, bajo impacto |
| `ng-` | 1 | `ng-template[accordionPanel]` — directiva estructural, no selector de componente |
| `sb-` | 1 | `.stories.ts` (Storybook), no es componente de producción |
| sin prefijo con guion | 1 | `[appSortableColumn]` — directiva con atributo, no aplica convención |

**Veredicto de nomenclatura:** el 96% de los componentes (343/357) ya sigue la convención
documentada. No hay caos real — hay un patrón deliberado de 4 capas que un análisis
superficial (sin leer `arquitectura-shared-ui.md`) interpretaría erróneamente como
inconsistencia.

---

## 3. Componentes con 0 usos detectados en la app (candidatos reales a revisión)

Búsqueda de `<selector` en todo `appsweb/angular/src/app` (357 componentes, 355 con selector
válido buscable). **48 sin ningún uso encontrado:**

| Selector | Ruta | Observación |
|---|---|---|
| `lx-offline-indicator` | adaptive/offline-indicator | Posible feature en desarrollo o ya deprecada |
| `lx-pull-to-refresh` | adaptive/pull-to-refresh | Idem |
| `lx-paginator` | adaptive/paginator | Puede estar reemplazado por paginación de PrimeNG/tabla |
| `lx-carousel` | adaptive/carousel | Sin consumidores |
| `lx-infinite-scroll` | adaptive/infinite-scroll | Sin consumidores |
| `lx-multi-select` | adaptive/multi-select | Posible duplicado de `custom-input-multiselect-signal` |
| `lx-action-sheet` | adaptive/action-sheet | Sin consumidores |
| `lx-menubar` | adaptive/menubar | Sin consumidores |
| `app-avatar-group` | shared/avatar-group | Sin consumidores |
| `app-approval-workflow` | shared/approval-workflow | Sin consumidores |
| `app-gauge` | shared/gauge | Sin consumidores |
| `app-inventory-level` | shared/inventory-level | Sin consumidores |
| `app-order-status` | shared/order-status | Sin consumidores |
| `app-activity-log` | shared/activity-log | Sin consumidores |
| `app-tab-bar` | mobile/tab-bar | Sin consumidores (¿reemplazado por otro tab bar?) |
| `app-territory-map` | web/territory-map | Sin consumidores |
| `app-table-global-filter` | web/table-global-filter | Sin consumidores |
| `ili-tooltip` | mobile/tooltip | Sin consumidores |
| ... (30 más) | — | Lista completa disponible en CSV generado |

> Nota: "0 usos" solo cuenta uso vía `<selector` en HTML/TS de `src/app`. No descarta uso
> dinámico (`ViewContainerRef`, Storybook, o que el componente sea muy reciente/en progreso).
> Antes de borrar cualquiera, confirmar con búsqueda manual + git blame.

---

## 4. Componentes más usados (prioridad para cualquier cambio — alto radio de impacto)

| Selector | Ruta | Usos detectados |
|---|---|---|
| `app-icon` | shared/app-icon | 1515 |
| `il-button` | buttons/web-label/button | 1180 |
| `iw-button` | buttons/web-icon/button | 729 |
| `custom-input-text-signal` | inputs/adaptive/input-text | 506 |
| `ili-button` | buttons/mobile-label/button | 435 |
| `lx-tag` | adaptive/tag | 414 |
| `custom-input-select-signal` | inputs/adaptive/input-select | 351 |
| `app-data-view-mobile` | mobile/data-view-mobile | 265 |
| `app-table-caption` | web/table-caption | 231 |
| `ili-list-item` | mobile/list-item | 224 |

**Implicación:** cualquier cambio de API en `app-icon`, `il-button` o `custom-input-text-signal`
tiene el radio de explosión más alto del codebase (500-1500 puntos de uso). Cualquier
refactor debe tratarlos como código crítico de alto riesgo, no como "quick win".

---

## 5. Calidad: spec coverage

58 componentes (16.3%) sin `.spec.ts`. Concentrados en:
- `adaptive/` (checkbox, divider, fieldset, icon, panel — componentes "simples" sin test)
- `inputs/web/` y `inputs/mobile/` (varios `input-email` sin test en ninguna capa)
- `base/processing-overlay.base.ts`

Esto **no es aleatorio**: son justo los componentes más simples/estables, consistente con
deuda técnica de baja prioridad, no con riesgo alto.

---

## 6. Rollout del patrón adaptativo de inputs (estado real, según doc maestro + código)

El propio documento maestro declara el rollout del patrón adaptativo **incompleto**:

| Tipo de input | Estado adaptativo |
|---|---|
| text, select, number, textarea, checkbox | ✅ completado |
| date | ⏳ pendiente (impedancia string↔Date entre flatpickr web y `type=date` móvil) |
| autocomplete, file | ⏳ pendiente (valor/UX complejos) |
| currency, password, multiselect, select-bool, time, search, switch/toggle | ⏳ pendiente |

Esto es **trabajo real identificado por el propio equipo**, no una deducción de este
análisis. 8 de 14 tipos de input aún no tienen el delegador adaptativo completo.

---

## 7. Propuesta (reemplaza la petición original de "estandarizar todo a `lx-`")

### 7.1 No hacer
- ❌ No renombrar `app-*`, `ili-*`, `web-*`, `ion-*`, `il-*`, `iw-*`, `ii-*` a `lx-*`. Rompe
  el boundary lint y la separación web/Ionic que es la razón de ser de esta arquitectura.
- ❌ No tocar `app-icon`, `il-button`, `iw-button`, `custom-input-text-signal` sin plan de
  migración por el volumen de uso (500-1500 referencias cada uno).

### 7.2 Sí hacer — Fase 1 (bajo riesgo, 1 semana)
1. Confirmar con el equipo cuáles de los 48 componentes con 0 uso son:
   - (a) código muerto → eliminar, o
   - (b) features en desarrollo → documentar como "WIP" para que no se cuenten como deuda.
2. Agregar `.spec.ts` a los 58 componentes sin test, empezando por los de `adaptive/`
   (lógica de runtime platform-switch, mayor riesgo real que los simples de botones).

### 7.3 Fase 2 (esfuerzo medio, alineado con lo que el equipo ya empezó)
3. Completar el rollout adaptativo de los 8 tipos de input pendientes (date, autocomplete,
   file, currency, password, multiselect, select-bool, time, search, switch/toggle),
   siguiendo la receta ya documentada en §4.5 de `arquitectura-shared-ui.md`. Esto es
   continuar trabajo ya iniciado, no una propuesta nueva.

### 7.4 Fase 3 (si se quiere extraer librería real)
4. Antes de extraer a librería publicable, resolver el acoplamiento de `shared/` con
   servicios de dominio (ninguno de los 18 componentes de `shared/` tiene imports de
   servicios de negocio detectados en este escaneo — son agnósticos, lo cual es
   buena señal para extracción).
5. El boundary lint (`audit-ui-boundaries.mjs`) debería correr también sobre el build de
   librería si se separa a paquete NPM interno.

---

## 8. Honestidad sobre limitaciones de este análisis

- Conteo de uso es por grep de texto (`<selector`), no AST. Puede dar falsos negativos si
  el selector se usa solo vía `ViewContainerRef.createComponent()` dinámico.
- No se leyó el cuerpo completo de los 357 componentes línea por línea — el inventario de
  inputs/outputs se hizo por regex (`@Input(`, `=input(`, etc.), válido para Angular
  reciente pero puede subcontar decoradores no estándar.
- CSVs completos (`components-inventory.csv`, `usage-counts.csv`) quedaron en el temp dir
  de la sesión; si se quiere el detalle fila-por-fila de los 357 componentes, pedir
  exportarlo a este repo.
</content>
