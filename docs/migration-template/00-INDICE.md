
📅 Creado: 2026-09-12 — última actualización 2026-09-18
🛡️ Estado histórico: ✅ Fases 0-8 ejecutadas. Actual: Fase 9 — retiro total
PrimeIcons/PrimeUIX, más remediación Design System derivada de auditoría FASE 1.
El plan vigente es el addendum Fase 9 de `02-plan-migracion.md` (§9.0–§9.7).
Decisiones #4/#5 del checklist de Fase 0 resueltas 2026-09-15
(`app-table`/`appSortableColumn`/`app-sorticon`, tabla propia sobre Bootstrap).
Antes de escribir el prompt del lote
piloto se encontró que `_custom-table.scss`/`_prime-table.scss` (piel
visual base de todas las tablas) dependen casi por completo de clases
`05-tablas-y-modales.md` §A.2bis y `04-bitacora-cambios.md` (entrada
"Arranque real de Fase 6"). El 2026-09-14 se había auditado Fase 2/3
completa contra código real y se encontraron y cerraron 33 archivos con
estarlo (`toolbar`, `breadcrumb`, `divider`, `checkbox`, `skeleton`,
`badge`, más 9 tipos de fuga nunca documentados: `p-button`, `pTooltip`,
`pInputTextarea`, `p-scrollpanel`, `p-drawer`, `p-panel`, `p-timeline`,
`pRipple`). Ver `04-bitacora-cambios.md` para el detalle completo,
incluyendo un incidente grave de un script de reemplazo automático que
rompió ~350 archivos (corregido el mismo día) y el renombrado
`monitor`→`desktop` de las carpetas de layout (hecho por el usuario).
👤 Responsable: Equipo Frontend LuxuryApp

## Propósito de esta carpeta

Bitácora ordenada del proceso de migración del stack visual de escritorio de
referencia las plantillas `templates_admin/lagos` y `templates_admin/minia`.

Esta carpeta es la fuente única de verdad del proceso de migración. Se
actualiza en cada sesión de trabajo, no se reescribe desde cero.

## Documentos

1. [01-analisis-estado-actual.md](./01-analisis-estado-actual.md) — Diagnóstico
   completo del sistema actual: arquitectura de `shared/ui`, sistema de
   de deuda técnica y comparación `lagos` vs `minia`.
2. [02-plan-migracion.md](./02-plan-migracion.md) — Estrategia, fases,
   secuencia de migración por componente, mapeo de tokens y criterios de
   aceptación.
3. [03-inventario-componentes.md](./03-inventario-componentes.md) — Registro
   Bootstrap → estado). Se actualiza en cada componente migrado.
4. [04-bitacora-cambios.md](./04-bitacora-cambios.md) — Changelog cronológico
   de decisiones y cambios reales aplicados. Se añade una entrada por sesión
   de trabajo, nunca se borra el historial.
5. [05-tablas-y-modales.md](./05-tablas-y-modales.md) — Análisis profundo con
   código real de los dos ítems más grandes: el ecosistema de tabla
   (`p-table`, Fase 6) y los modales (`DynamicDialog`, Fase 4).
6. [06-preflight-fase4-6-primeflex-iconos.md](./06-preflight-fase4-6-primeflex-iconos.md) —
    Fase 4+6. Corrige el alcance de la Fase 6.5 (Track Flex) con números
    reverificados palabra por palabra: la estimación previa de ~650
    archivos/~15,000 ocurrencias era ~2x inflada por falsos positivos de
    coincidencia de subcadena.

7. **Fase 9 vigente:** limpieza semántica y técnica final de CSS legacy,
    wrappers propios con nombres retirados, helpers, documentación, scripts,
    metadata, remediación de tokens/contraste/tipografía y validación visual
    contra `templates_admin/lagos` y `minia`.

### Actualización 2026-09-18

Se cerró la implementación y verificación visual de reorder de filas en
`AppTable`, incluyendo el handle real `pReorderableRowHandle`, el gate
`[reorderableRows]`, persistencia mediante `onRowReorder` y corrección del
evento nativo `dragstart`. Detalle en `03-inventario-componentes.md`,
`05-tablas-y-modales.md` y la entrada final de `04-bitacora-cambios.md`.

## Regla de uso

- No se migra nada sin haber registrado la decisión en `02-plan-migracion.md`
  y sin haber actualizado la fila correspondiente en
  `03-inventario-componentes.md`.
- Todo cambio de código real (no solo de análisis) debe dejar una entrada en
  `04-bitacora-cambios.md` con fecha, archivos tocados y estado de build.
- Esta carpeta documenta el **cómo y el porqué** de la migración. Las reglas
  OBLIGATORIAS de arquitectura viven en `conventions/CONVENTIONS.md` y sus
  documentos especializados (`conventions/ui/`, `conventions/styles/`); si la
  migración cambia una regla vigente, esa regla se edita ahí, no aquí.

## ⚠️ Cambio de flujo de trabajo (2026-09-13, a partir de aquí)

Hasta la Fase 2 (parcial), Claude ejecutó el código directamente en cada
sesión. **A partir de la próxima sesión, cambia el flujo a maestro/chalán**:

- **Claude (maestro):** analiza el estado real del repo contra esta
  bitácora, decide qué sigue, y redacta **prompts cortos, autocontenidos y
  sin ambigüedad** — cada uno con archivos exactos, el cambio esperado, y
  un criterio de "listo cuando" verificable.
- **Agente externo (chalán):** recibe cada prompt de manos del usuario y
  ejecuta el cambio de código.
- **Claude (auditor):** cuando el usuario trae de vuelta el resultado/diff,
  Claude lo audita contra el criterio de aceptación del prompt y contra
  esta bitácora, y solo entonces marca la fila/fase correspondiente como
  🟢 en `03-inventario-componentes.md` y registra la entrada en
  `04-bitacora-cambios.md`.
- Claude ya **no** debe asumir que puede correr `ng build`/`ng serve`/
  Playwright directamente como parte de este flujo — eso también se
  delega o se pide como paso explícito dentro del prompt al chalán, o se
  hace bajo pedido puntual del usuario.
- Motivo del cambio: sesiones muy largas de ejecución directa saturan el
  contexto de la conversación ("Prompt is too long"). Prompts cortos +
  auditoría por sesión mantienen cada conversación manejable.

## Leyenda de estado (usada en todos los documentos)

| Símbolo | Significado |
|---|---|
| 🔴 | No iniciado |
| 🟡 | En progreso |
| 🟢 | Completado y verificado (build + revisión visual) |
| ⚪ | Fuera de alcance / no aplica |
| ⏸️ | Pausado / bloqueado |
