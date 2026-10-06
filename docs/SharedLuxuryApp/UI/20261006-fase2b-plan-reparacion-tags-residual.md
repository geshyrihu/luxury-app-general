# Fase 2b — segunda tanda de reparación de sufijos legacy malformados

**Fecha:** 2026-10-06
**Estado:** prompts preparados; Fase 2 (agentes 1–6) ya integrada en `main` local (commits `63caaaca2`, `ca6042f90`, `b3c9dd196`, `611d5d310`, `0051caf2b`, `73f7f0bd6`). Esta tanda cubre lo que esos seis reportes dejaron fuera de scope.
**Baseline de tanda:** Angular `main` local, post-integración Fase 2. Build + `audit:ui` verdes sobre ese estado (94.661 s, sin warnings).

## Diagnóstico

Búsqueda literal tras integrar Fase 2 (`displayMode=.{1}icon.{1}-[a-z]`, `lux-button-(web|mobile)-[a-z]`) encuentra 6 focos vivos no asignados a ningún agente anterior, más 1 bloqueado y 1 ya documentado como string didáctica:

| Foco | Archivo(s) | Clase de defecto |
|---|---|---|
| Catálogos shared — mobile | 8 templates `*-list-mobile.html` (mismos catálogos del Agente 3 de Fase 2, versión mobile) | Selector inventado `lux-button-mobile-edit` |
| Operations — view-pdf web | `informe-financiero-list.html:14,58` | Sufijo `-view-pdf` como selector inventado `lux-button-web-view-pdf` |
| Accounting — view-pdf web | `budget-support-dialog.html:93` | Mismo defecto, selector inventado |
| Public — add | `telefonos-emergencia.html:29` | Selector inventado `lux-button-web-add` |
| Admin — doc | `conventions-viewer.service.ts:411-412` | Ejemplo marcado `<!-- OK -->` que en realidad muestra la forma rota (`</il-button-primary>`, `displayMode="icon"-edit`) |
| Operations — view-pdf **mobile** | `policy-contract-list-mobile.html:39`, `contracts-policies-mobile.html:15` | Selector inventado `lux-button-mobile-view-pdf`; **no existe bridge mobile equivalente a `lux-pdf-viewer-trigger`** (solo hay versión web) |

No ejecutar regex global: cada mapping requiere leer el componente consumidor para preservar evento, navegación y accesibilidad, igual que en Fase 2.

## Owners / prompts

Numeración 1–6 reiniciada para esta tanda (Fase 2b); son agentes distintos de los Agentes 1–6 de Fase 2, aunque compartan número.

| Agente (Fase 2b) | Paths autorizados | Acción |
|---|---|---|
| 1 | 8 templates mobile de `shared.luxuryapp` (hermanos mobile de los que arregló el Agente 3 de Fase 2) | `kind="edit"` + `displayMode` correcto en `lux-button-mobile`. |
| 2 | `informe-financiero-list.html` (Operations) | Migrar a `<lux-pdf-viewer-trigger>`, igual patrón que usó el Agente 1 de Fase 2 en los otros 5 archivos de Operations. |
| 3 | `budget-support-dialog.html` (Accounting, fuera de `budget-proposals/**`) | Migrar a `<lux-pdf-viewer-trigger>`. **No** tocar `budget-rule-list.html` ni nada bajo `budget-proposals/**`: sigue bloqueado por el dueño. |
| 4 | `telefonos-emergencia.html` (Public) | `kind="add"` en `lux-button-web`. |
| 5 | `conventions-viewer.service.ts:405-416` (Admin, string de documentación) | Corregir el ejemplo "OK" para que muestre sintaxis realmente válida; no es template runtime, no requiere build. |
| 6 | Solo lectura: `catalog-web-item.ts`, `base-button.ts` | Investigar autoría/fecha de los cambios sin dueño (`git log`, `git blame`, `git reflog`). **No editar nada.** Reportar hallazgo para que el orquestador decida. |

Prompts listos: `20261006-fase2b-agente{1..6}-*.md` en este directorio. Cada agente escribe su reporte de ejecución al final de su propio `.md` al terminar.

## Decisión pendiente antes de abrir más prompts

`policy-contract-list-mobile.html:39` y `contracts-policies-mobile.html:15` (view-pdf en mobile) **no tienen un bridge equivalente** a `lux-pdf-viewer-trigger` (ese componente es `web/` únicamente, usa `ButtonWeb` + `DialogHandlerService`). Repararlos requiere decidir primero si se crea `lux-pdf-viewer-trigger` para Ionic/mobile (archivo transversal de `shared/ui`, un solo owner, con review) o si el visor PDF en mobile usa otro mecanismo ya existente. No se abre prompt de edición hasta esa decisión — evita que un agente externo invente API nueva sin review, violando la regla de gobernanza de "archivos transversales con un único owner".

## Dependencias y paralelismo

- Agentes 1, 2, 3, 4, 5 (Fase 2b) tienen allowlists no solapadas; pueden correr en worktrees separados desde el mismo baseline (Angular `main` local post-Fase 2).
- Agente 6 (Fase 2b) es solo lectura (git metadata), puede correr en paralelo sin worktree dedicado.
- Ningún agente de esta tanda toca `budget-proposals/**`, `catalog-web-item.ts` ni `base-button.ts`.
- Cada commit debe contener únicamente paths de su allowlist. No compartir índice Git.

## Gates de integración

1. Revisión individual de diff contra paths permitidos y semántica del handler (igual que Fase 2).
2. Integrar commits secuencialmente; `git show --name-only` valida cada allowlist.
3. Build fresco + `npm run audit:ui` + búsqueda literal de las formas malformadas de esta tanda.
4. QA de flows afectados donde el cambio altere comportamiento (view-pdf, add); no concluir solo por build.
5. Resultado prohibido: inventar inputs/selectores nuevos, tocar `budget-proposals/**`, editar `catalog-web-item.ts`/`base-button.ts` sin resolver ownership primero, o crear el bridge mobile de PDF sin la decisión de diseño previa.

## Siguiente tras Fase 2b

- Resolver la decisión de bridge mobile de PDF y abrir un prompt dedicado si se aprueba.
- Con el Agente 6 (Fase 2b) resuelto, decidir si `catalog-web-item.ts`/`base-button.ts` se asignan a algún agente o se dejan como están.
- Retomar roadmap general: Gate 0 completo (ownership/madurez por componente) y contrato adaptativo de botón (784 imports), según §7 del roadmap.
