# Dry-run del codemod `<p-table>` estándar

Modo ejecutado: `--write`. El modo predeterminado es `--dry-run`; esta corrida no escribe archivos de `src/app/modules/`.

Archivos transformados: **0**

## Excluidos (7)

- `src/app/modules/human-resources.luxuryapp/time-off/past-vacations/vacaciones-pasadas-registro.html`: no contiene <p-table>.
- `src/app/modules/management.luxuryapp/juntas-comite/juntas-mensuales-session/juntas-mensuales-session.html`: no contiene <p-table>.
- `src/app/modules/accounting.luxuryapp/budgeting/expense-catalog-detail/gasto-fijo-servicios.html`: no contiene <p-table>.
- `src/app/modules/accounting.luxuryapp/general-ledger/expense-catalog-detail/gasto-fijo-servicios.html`: no contiene <p-table>.
- `src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/sat-funding/sat-funding-list/sat-funding-list.html`: no contiene <p-table>.
- `src/app/modules/accounting.luxuryapp/fondeos-y-reporteo/sat-funding/sat-funding-detail/sat-funding-detail.html`: no contiene <p-table>.
- `src/app/modules/accounting.luxuryapp/general-ledger/presupuesto-propuesta/budget-forecast-dialog.html`: no contiene <p-table>.

## Patrones no calzados / advertencias (0)

- Ninguno.

## Seguridad

- No se procesan archivos fuera de la lista recibida.
- Los archivos con `pTemplate=` se excluyen antes de cualquier reemplazo.
- Los `p-sorticon` sin `field` se excluyen; los cierres separados con `field` literal se normalizan a autocerrado.
