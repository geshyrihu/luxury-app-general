# Plan — Resumen de tareas copiable (Task Engine)

## Metadata

- Fecha: 2026-09-17
- Modulo: `OperationsLuxuryApp` / Submodulo: `Task`
- Tipo: feature nueva (adicional, **no** reemplaza flujos existentes)
- Estado: aprobado por el usuario (respuestas de discovery 2026-09-17)
- Origen: solicitud directa del usuario + reporte manual adjunto (imagen)

## 1. Resumen ejecutivo

Hoy el resumen agrupado de tareas se arma a mano (imagen de referencia:
"En proceso, con fecha de entrega" / "Pendientes, sin fecha definida").
Se agrega un **botón nuevo** en `task-list` que abre un **modal** con el
mismo listado agrupado, filtrable por rango de fechas y **copiable con un
clic** para pegar en WhatsApp.

## 2. Decisiones tomadas (discovery)

| # | Decisión | Valor |
|---|---|---|
| 1 | Reemplaza algún flujo | **No** — es adicional |
| 2 | Presentación | **Modal** (DialogHandlerService) |
| 3 | Colores | Pendiente **amarillo**, En proceso **naranja**, Concluido **verde** |
| 4 | Rango de fechas | Filtra por **fecha de creación** (`createdAtFilter`) |
| 5 | Columna "Fecha de ejecución" | Concluidos → **sin dato**; Pendientes/En proceso → `scheduledAt` |

## 3. Alcance

### Incluido

- Botón nuevo en `task-list.html` (junto a "Imprimir pendientes").
- Componente nuevo `task-message/task-summary-report/` (`.ts`, `.html`,
  `.spec.ts`).
- Columnas: **N° | Descripción | Fecha de ejecución | Último seguimiento**.
- Selector de rango (Desde / Hasta) contra fecha de creación.
- Agrupación: Pendientes (`NotStarted` + `Reopened`), En proceso
  (`InProgress`), Concluidos (`Completed`).
- Botón "Copiar" → texto plano formateado para WhatsApp.

### Excluido

- Backend: **no requiere cambios**. `TasksItemDTO` ya expone
  `lastFollowUp` y `lastFollowUpDate` (`TaskAppService.cs:319-324`).
- Impresión/PDF.
- Envío automático a WhatsApp (solo copiado al portapapeles).

## 4. Fuente de datos

Dos llamadas al endpoint existente `tasks/list/{groupId}/{status}`
(`Endpoints.Tasks.list`):

- `status = "NotStarted"` → el backend devuelve No iniciadas + En proceso
  + Reabiertas (`TaskAppService.ListTaskAsync`).
- `status = "Completed"` → Concluidas.

Se pagina con `recordsNumber = 200` (tope `PAGINATION_MAX_RECORDS`) y se
itera mientras `items.length < totalRecords`, con tope de seguridad de 10
páginas.

## 5. Restricciones

- No tocar los flujos existentes ("Enviar reporte", "Imprimir pendientes").
- Colores: el design system colapsa amarillo y naranja al mismo token
  (`--ds-warning`), por lo que los encabezados usan `rgba()` literales
  (precedente: `task-list.html` ya usa `rgba(16,185,129,.15)`), y verde
  usa `--ds-success`.

## 6. Riesgos

| Riesgo | Mitigación |
|---|---|
| Muchas tareas en el grupo → varias páginas | Tope de 10 páginas; se reporta si se truncó |
| `navigator.clipboard` no disponible (contexto no seguro) | `try/catch` + toast de error con indicación de copia manual |
| Amarillo y naranja indistinguibles por tokens globales | `rgba()` literales independientes |
| Reabiertas: ¿pendiente o en proceso? | Se agrupan en **Pendientes** (decisión documentada, ajustable) |

## 7. Criterios de paso

- Build y `tsc` verdes.
- El modal abre desde el botón nuevo, sin alterar el listado.
- El rango de fechas filtra por fecha de creación.
- Concluidos no muestran fecha de ejecución.
- "Copiar" deja texto legible en el portapapeles.
- Evidencia visual en claro y oscuro.

## 8. Cierre esperado

Feature adicional operativa, trazada en bitácora. Sin cambios de contrato
público ni de backend.
