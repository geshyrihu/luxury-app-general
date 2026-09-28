# TICKET FH-11h — Frontend: migrar `mantenimiento.luxuryapp/fire-equipment` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11g` (ya cerrados y aprobados). Cubre el clúster `fire-equipment/` de
`mantenimiento.luxuryapp` — 11 archivos, 30 ocurrencias de `| date`. Es la primera mitad de
`mantenimiento.luxuryapp` (19 archivos en total, 50 ocurrencias) — la segunda mitad (`logs/`,
`inspection/`, `reports-mantenance/`) es un ticket aparte (FH-11i) por tener casos más complejos
(llamadas programáticas a `formatDate`, un archivo con corrupción de bytes).

**Regla general para este ticket:** verificado que ninguno de los 11 archivos usa otro miembro de
`CommonModule` en su plantilla (sin `| number`, `| currency`, `ngClass`, `ngStyle`, etc.) — en todos
los casos se reemplaza `CommonModule` (y `DatePipe`, donde esté importado por separado además de
`CommonModule`, de forma redundante) por `ApiDatePipe`. 4 archivos también importan `Location` de
`@angular/common` (servicio de navegación, no un pipe) — **no lo toques**, se conserva igual.

**Nota de formato:** varias ocurrencias están envueltas en múltiples líneas por Prettier — busca
por contenido, no por línea exacta. Usa búsqueda multilínea para tu verificación final (ver abajo).

## Tarea 1 — `fire-equipment/extinguisher-log/extintor-bitacora-list`

`extintor-bitacora-list.ts`: `import { CommonModule, DatePipe } from "@angular/common";` →
reemplaza ambos por `ApiDatePipe`.

`extintor-bitacora-list.html` — 2 ocurrencias, mismo campo y formato (vista tabla + tarjeta):
`{{ item.date | date:'dd-MMM-yy' }}` → `{{ item.date | apiDate:'dd-MMM-yy' }}` (en ambas)

## Tarea 2 — `fire-equipment/hydrant-log/hidrante-bitacora-list`

Mismo patrón que la Tarea 1: `CommonModule, DatePipe` → `ApiDatePipe`.

`hidrante-bitacora-list.html` — 2 ocurrencias, mismo campo y formato:
`{{ item.date | date:'dd-MMM-yy' }}` → `apiDate:'dd-MMM-yy'` (en ambas)

## Tarea 3 — `fire-equipment/manual-call-point-log/estacion-manual-bitacora-list`

Mismo patrón: `CommonModule, DatePipe` → `ApiDatePipe`.

`estacion-manual-bitacora-list.html` — 2 ocurrencias, mismo campo y formato:
`{{ item.date | date:'dd-MMM-yy' }}` → `apiDate:'dd-MMM-yy'` (en ambas)

## Tarea 4 — `fire-equipment/smoke-detector-log/detector-humo-bitacora-list`

Mismo patrón: `CommonModule, DatePipe` → `ApiDatePipe`.

`detector-humo-bitacora-list.html` — 2 ocurrencias, mismo campo y formato:
`{{ item.date | date:'dd-MMM-yy' }}` → `apiDate:'dd-MMM-yy'` (en ambas)

## Tarea 5 — `fire-equipment/inspection-periods/cycle-detail/fire-inspection-cycle-detail`

`fire-inspection-cycle-detail.ts`: `import { CommonModule } from "@angular/common";` → reemplaza
por `ApiDatePipe`.

`fire-inspection-cycle-detail.html` — 4 ocurrencias:
- `cycle().periodStart | date:'dd-MMM-yy'` → `apiDate:'dd-MMM-yy'`
- `cycle().periodEnd | date:'dd-MMM-yy'` → `apiDate:'dd-MMM-yy'`
- `item.inspectedAt | date:'dd-MMM-yy HH:mm'` → `apiDate:'dd-MMM-yy HH:mm'` (2 veces, misma
  plantilla)

## Tarea 6 — `fire-equipment/inspection-periods/cycle-list/fire-inspection-cycle-list`

`fire-inspection-cycle-list.ts`: `CommonModule` → `ApiDatePipe`.

`fire-inspection-cycle-list.html` — 4 ocurrencias (2 vistas × 2 campos, una envuelta en 2 líneas):
- `item.periodStart | date:'dd-MMM-yy'` → `apiDate:'dd-MMM-yy'` (2 veces)
- `item.periodEnd | date:'dd-MMM-yy'` → `apiDate:'dd-MMM-yy'` (2 veces, una envuelta)

## Tarea 7 — `fire-equipment/inspection-periods/period-list/fire-inspection-period-list`

`fire-inspection-period-list.ts`: `CommonModule` → `ApiDatePipe`.

`fire-inspection-period-list.html` — 2 ocurrencias, mismo campo y formato (una envuelta):
`{{ item.startDate | date:'dd-MMM-yy' }}` → `apiDate:'dd-MMM-yy'` (en ambas)

## Tareas 8-11 — Los 4 detalles de periodo por tipo de equipo

Los 4 archivos siguientes son estructuralmente idénticos (componentes paralelos para distintos
tipos de equipo contra incendios) — mismo patrón exacto en los 4:

`*.ts`: `import { CommonModule, Location } from "@angular/common";` → quita solo `CommonModule`,
agrega `ApiDatePipe`, **conserva `Location`** (servicio de navegación, no relacionado).

`*.html` — 3 ocurrencias en cada uno, mismos 3 campos y formato `'dd/MM/yyyy'`:
- `period().startDate | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'`
- `activeCycle().periodStart | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'`
- `activeCycle().periodEnd | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'` (envuelta en 2-3 líneas en
  algunos de los 4)

**Tarea 8**: `fire-equipment/inspection-periods/period-detail-detector/fire-inspection-period-detector-detail`
**Tarea 9**: `fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail`
**Tarea 10**: `fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail`
**Tarea 11**: `fire-equipment/inspection-periods/period-detail-hidrante/fire-inspection-period-hidrante-detail`

## Lo que NO debes hacer

- No toques `Location` en las Tareas 8-11 — es el servicio `Location` de `@angular/common` para
  navegación, no un pipe, no está relacionado con esta migración.
- No toques ningún otro archivo de `mantenimiento.luxuryapp` — la segunda mitad (`logs/`,
  `inspection/`, `reports-mantenance/`) es FH-11i, un ticket aparte.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena.

## Verificación obligatoria

```bash
cd client/angular
perl -0777 -ne 'while (/\{\{[^}]*?\|\s*date\b[^}]*?\}\}/gs) { print "$&\n---\n" }' $(find src/app/apps/mantenimiento.luxuryapp/fire-equipment -name "*.html")
# Resultado esperado: sin salida (0 residuales)

grep -rln "Location" src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-*/
# Resultado esperado: los 4 archivos .ts (confirma que Location sigue intacto)

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 30 ocurrencias migradas a `apiDate`, mismo formato que tenían antes.
- `CommonModule`/`DatePipe` reemplazados por `ApiDatePipe` en los 11 archivos.
- `Location` conservado en las Tareas 8-11.
- `ng build` sin errores nuevos.
- Ningún archivo fuera de los 11 mencionados fue tocado.

## Reporte de finalización

1. Diff exacto de los 11 archivos `.ts` + 11 `.html`.
2. Confirmación de que `Location` sigue intacto en las Tareas 8-11.
3. Salida literal de los comandos de verificación y de `ng build`.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
