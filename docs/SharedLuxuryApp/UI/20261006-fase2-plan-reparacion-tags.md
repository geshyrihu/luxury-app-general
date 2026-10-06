# Fase 2 — reparación acotada de sufijos legacy malformados

**Fecha:** 2026-10-06
**Estado:** prompts preparados; snapshot actual tiene 11 paths modificados en Angular. Los dos `work-position-form` ya están limpios tras commit/push del usuario (`7dca9a227`); quedan 11 paths por atribuir/integrar.
**Baseline de tanda:** Angular `b01151c30`; ese commit pasó build y smoke QA del catálogo. Ese build no valida los cambios locales actuales.

## Diagnóstico

Una búsqueda de source actual encuentra formas como `<lux-button-web displayMode="icon"-edit>`: el elemento puede compilar como `lux-button-web` con un atributo extra inválido, pero pierde `kind`, así que el botón no ejecuta acción/icono previsto. Conteo de búsqueda en `src/app`: 46 coincidencias, mezcla de markup runtime y strings de documentación.

No ejecutar regex global: mapping requiere leer el componente consumidor para preservar evento, navegación y confirmación.

## Owners / prompts

| Agente | Paths autorizados | Acción |
|---|---|---|
| 1 | 5 templates de Operations | Sufijo view-pdf/delete y otros `kind`; inspeccionar handler hermano. |
| 2 | 3 templates de notificaciones core | `kind=delete`, display icon, conservar confirmación y nombre accesible. |
| 3 | 8 listados desktop de `shared.luxuryapp` | `kind=edit`, display icon; preservar click/ruta. |
| 4 | `catalog-patterns-item.ts`, `button-catalog.ts` de Admin | Corregir demos vivas; no placeholders ni inputs inexistentes. |
| 5 | Fixed expenses de Accounting: 1 template | Corregir edit icon. `budget-proposals/**` queda **bloqueado**, solo informe; prohibición previa. |
| 6 | Auditoría repo-wide read-only | Clasificar strings/documentación versus runtime y caso en `shared/ui/inputs/web/input-file/input-file.ts`; shared UI requiere aprobación especial. |

Prompts listos: `20261006-fase2-agente{1..6}-*.md` en este directorio.

## Dependencias y paralelismo

- Agentes 1–5 tienen allowlists no solapadas y pueden trabajar en worktrees separados basados en `b01151c30`.
- Agente 6 solo lectura puede correr simultáneamente y devuelve residual exacto; no edita shared ni accounting protegido.
- Agente 4 no toca `catalog-web-item.ts` ni `ButtonWeb` base: el primer archivo tiene trabajo concurrente local; segundo es contrato compartido.
- Cada commit debe contener únicamente paths de su allowlist. No compartir índice Git.

## Snapshot de coordinación observado

- 8 listados desktop de `shared.luxuryapp` están modificados y coinciden con la allowlist de Agente 3.
- `operations/work-positions/work-position-form.html/.ts` correspondía a trabajo del usuario fuera de allowlist; usuario confirmó commit/push propio (`7dca9a227`), ambos paths ahora limpios.
- `admin/.../catalog-web-item.ts` y `shared/ui/buttons/base/base-button.ts` muestran limpieza/formato concurrente; no reasignar esos paths.
- `shared/ui/inputs/web/input-file/input-file.ts` está modificado aunque Agente 6 tiene instrucción read-only. Poner en hold y solicitar propietario/consentimiento de shared UI; revisar `(confirmed)` antes de integrar.
- Angular ahora reporta 11 paths modificados. No abrir writers adicionales en checkout común; esperar reportes, revisar diffs y confirmar staging/pathspec antes de integrar.

## Reglas de mapping

- `lux-button-<kind> displayMode="icon"` o `lux-button-web displayMode="icon"-<kind>` → selector `lux-button-web`, atributo `kind="<kind>"`, `displayMode="icon"`; verificar input real en `ButtonWeb`.
- PDF interactivo → evaluar `lux-pdf-viewer-trigger`; conservar URL/fileName seguros. No mapearlo a botón mudo.
- `state` de active/desactive no existe en ButtonWeb/Mobile: crear demo custom de estado sin atributo falso, respetar estado/handler real en features, o escalar.
- `ticketId` no es input de tracking button: no inventar; badge visual y lógica de navegación son responsabilidades distintas.
- `displayMode="icon"` requiere nombre accesible concreto, no el fallback genérico.
- `(confirmed)` debe seguir protegido por confirmación del consumidor; no convertir delete a click directo.
- `conventions-viewer.service.ts` y bloques `<code>` se consideran documentación/string hasta probar que son templates runtime.

## Gates de integración

1. Revisión individual de diff contra paths permitidos y semántica del handler.
2. Agent 6 reporta residuals por tipo y scope; el dueño del área acepta qué se deja en docs.
3. Integrar commits secuencialmente; `git show --name-only` valida cada allowlist.
4. Build fresco + `npm run audit:ui` + búsqueda literal de la forma malformada.
5. QA de flows afectados: escritorio y móvil donde aplique; no concluir por build solo.
6. Resultado prohibido: falsos elementos, pérdida de confirmación, botones icon-only sin label/aria, eliminación de API docs o cambio en budget proposals.

## Siguiente tras Fase 2

Revisar P0 de QA catálogo: 4 botones `ds-icon-btn` nativos sin nombre accesible; mobile demo spinner/icon con axe; ~19 botones icon-only del shell con fallback genérico. Estos están fuera de los allowlists actuales; abrir prompt separado tras integrar esta tanda, especialmente porque cambios en `shared/ui` requieren aprobación especial.
