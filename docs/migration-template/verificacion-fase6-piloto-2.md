# Verificación Fase 6 — Piloto 2: migración de 4 pantallas

Fecha: 2026-09-15

## Resultado

Se migraron únicamente las cuatro pantallas del piloto a `app-table`, junto con sus directivas `appSortableColumn` y `app-sorticon`. No se modificaron las 337 plantillas fuera de alcance.

| Pantalla | Ruta verificada | Resultado visual/funcional |
|---|---|---|
| Bancos | `/admin/banks` | Tabla visible con datos reales; cabecera, filas alternadas, paginador y acciones visibles. El ordenamiento por `Codigo` cambia el estado visual de la columna. |
| Log API | `/admin/log-api-report` | Tabla visible con 30 filas reales, filtros y filas expandibles. El botón `Next Page` dispara la carga lazy y el reporte cambia a `Mostrando 31 a 60 de 75020 registros`. |
| Aprobaciones genéricas | `/human-resources/approval` | `GenericApprovalPanel` renderiza datos reales, columnas dinámicas y acciones; la tabla conserva paginador y caption. |
| Auditoría | `/admin/audit-entries` | Tabla principal visible con 30 filas reales, filtros y paginador. En esta sesión no hubo filas `Update` en la primera página, por lo que no fue posible abrir la tabla anidada sin inventar datos. |

## Diff real aplicado

- En los cuatro `.ts`: se sustituyó `TableModule` por `AppTable`, `AppSortableColumn` y `AppSorticon` desde `@ui/web/table/table`, y se actualizaron los arrays `imports`.
- En `bank-list-desktop.html`, `log-api-report.html` y `audit-entries.html`: `<p-table>`/`</p-table>` pasó a `<app-table>`/`</app-table>`; `pSortableColumn` pasó a `appSortableColumn`; `p-sorticon` pasó a `app-sorticon`.
- En `audit-entries.html`: se migró también la segunda tabla anidada dentro de la fila expandida.
- En `generic-approval-panel.ts`: se migró la plantilla inline y se corrigió `<ng-template emptymessage>` a `<ng-template #emptymessage>`.

Diffstat de los 7 archivos del piloto: **53 líneas añadidas, 44 eliminadas**.

## Verificaciones

- Navegador: las cuatro rutas cargaron autenticadas como `admin` y mostraron datos reales.
- Paginación lazy: confirmada en Log API.
- Tabla anidada: pendiente de validación visual porque la respuesta actual no expone ninguna fila `Update` en la página inicial.

## Bloqueo externo al piloto

La prueba pendiente de tabla anidada quedó completada en [verificacion-fase6-piloto-2b.md](verificacion-fase6-piloto-2b.md): filtro `Update`, expansión, colapso, segunda fila y dos instancias simultáneas verificadas.

`npx tsc --noEmit` y `ng build` siguen bloqueados por errores sintácticos preexistentes en archivos ajenos al piloto:

- `src/app/modules/maintenance.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-list.ts`
- `src/app/modules/operations.luxuryapp/incidencias-sanciones/sanction/sanction-list.ts`
- `src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/employees/employee-list.ts`
- `src/app/modules/recruitment.luxuryapp/reclutamiento-y-altas-bajas/recruitment-staff-board/recruitment-staff-board.ts`

Los errores reportados incluyen literales sin cerrar y texto corrupto como `Pón`, `ón` y `Direccioón`; no se tocaron porque están fuera del alcance de este prompt.
