# TICKET FH-11l — Frontend: migrar clúster "nómina" de `recursos-humanos.luxuryapp` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11k` (ya cerrados y aprobados). Cubre el clúster **nómina** dentro de
`recursos-humanos.luxuryapp` — 6 archivos, **12 ocurrencias** de `| date` (recontadas con búsqueda
multilínea — úsala también en tu verificación final). Es el segundo de varios tickets para terminar
`recursos-humanos.luxuryapp` (66 ocurrencias / 29 archivos restantes tras FH-11k).

Todos los archivos viven bajo
`src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/`.

**Regla general del clúster:** 3 de los 6 archivos usan `| currency` en su plantilla sin importar
`CurrencyPipe` por separado — dependen de `CommonModule` para eso. En esos 3, **NO quites
`CommonModule`**, solo agrega `ApiDatePipe`. En los otros 2 (sin otro uso de `CommonModule`),
reemplaza `CommonModule` por `ApiDatePipe`. El sexto archivo (`modal-dias-no-habiles`) tiene un bug
preexistente: usa `| date` en la plantilla pero **no importa `CommonModule` ni `DatePipe` en el
`.ts`** — es un import faltante que nunca causó error de build. Como este ticket ya toca ese
archivo para migrar su única ocurrencia, agrega `ApiDatePipe` a su arreglo `imports` (esto de paso
corrige el bug).

## Tarea 1 — `periodos-nomina/periodos-nomina`

`periodos-nomina.ts`: `imports: [...]` contiene `CommonModule` (sin otro uso de `| currency`,
`| number`, etc. en la plantilla) — **reemplázalo por `ApiDatePipe`**.
Import: `import { ApiDatePipe } from "../../../../../../shared/pipes/api-date.pipe";`

`periodos-nomina.html` — 5 ocurrencias, **todas con workaround `:"UTC"` a quitar**, mismo formato
`"dd/MM/yyyy"`:
- `item.fechaInicio | date: "dd/MM/yyyy" : "UTC"` → `apiDate: "dd/MM/yyyy"` (2 veces, campos
  distintos de fila — verifica que migras ambas)
- `item.fechaFin | date: "dd/MM/yyyy" : "UTC"` → `apiDate: "dd/MM/yyyy"` (2 veces, una de ellas
  envuelta en 2 líneas: `{{ item.fechaFin |\n        date: "dd/MM/yyyy" : "UTC" }}`)
- `item.fechaPago ? (item.fechaPago | date: "dd/MM/yyyy" : "UTC") : "-"` → `apiDate: "dd/MM/yyyy"`
  dentro del mismo operador `?:`, sin tocar el resto de la expresión

## Tarea 2 — `periodos-nomina/modal-dias-no-habiles/modal-dias-no-habiles`

`modal-dias-no-habiles.ts`: actualmente **no importa `CommonModule` ni `DatePipe`** (bug
preexistente, no reportado hasta ahora). Agrega `ApiDatePipe` al arreglo `imports: [...]`.
Import: `import { ApiDatePipe } from "../../../../../../../shared/pipes/api-date.pipe";`

`modal-dias-no-habiles.html` — 1 ocurrencia, con workaround `:"UTC"` a quitar:
`{{ dia.fecha | date: "dd/MM/yyyy" : "UTC" }}` → `{{ dia.fecha | apiDate: "dd/MM/yyyy" }}`

## Tarea 3 — `tiempo-extra/tiempo-extra`

**Caso especial: NO quites `CommonModule`.** `tiempo-extra.ts`: la plantilla usa `| currency` (3
puntos) sin `CurrencyPipe` importado por separado — depende de `CommonModule`. Agrega
`ApiDatePipe` al arreglo `imports: [...]` sin quitar `CommonModule`.
Import: `import { ApiDatePipe } from "../../../../../../shared/pipes/api-date.pipe";`

`tiempo-extra.html` — 2 ocurrencias, mismo campo/formato, **con workaround `:"UTC"` a quitar**:
`{{ item.fecha | date: "dd/MM/yyyy" : "UTC" }}` → `{{ item.fecha | apiDate: "dd/MM/yyyy" }}` (en
ambas)

## Tarea 4 — `incidencias-nomina/incidencias-nomina`

**Caso especial: NO quites `CommonModule`.** `incidencias-nomina.ts`: la plantilla usa `| currency`
(2 puntos) sin `CurrencyPipe` importado por separado. Agrega `ApiDatePipe` sin quitar
`CommonModule`.
Import: `import { ApiDatePipe } from "../../../../../../shared/pipes/api-date.pipe";`

`incidencias-nomina.html` — 2 ocurrencias, mismo campo/formato, **con workaround `:"UTC"` a
quitar**: `{{ item.fecha | date: "dd/MM/yyyy" : "UTC" }}` → `{{ item.fecha | apiDate: "dd/MM/yyyy" }}`
(en ambas)

## Tarea 5 — `evidencias-nomina/evidencias-nomina`

`evidencias-nomina.ts`: `CommonModule` sin otro uso en la plantilla — **reemplázalo por
`ApiDatePipe`**.
Import: `import { ApiDatePipe } from "../../../../../../shared/pipes/api-date.pipe";`

`evidencias-nomina.html` — 1 ocurrencia, **sin workaround**:
`{{ ev.createdAt | date: "dd/MM/yyyy" }}` → `{{ ev.createdAt | apiDate: "dd/MM/yyyy" }}`

## Tarea 6 — `prestamos-empleado/modal-prestamo-detalle/modal-prestamo-detalle`

**Caso especial: NO quites `CommonModule`.** `modal-prestamo-detalle.ts`: la plantilla usa
`| currency` (4 puntos) sin `CurrencyPipe` importado por separado. Agrega `ApiDatePipe` sin quitar
`CommonModule`.
Import: `import { ApiDatePipe } from "../../../../../../../shared/pipes/api-date.pipe";`

`modal-prestamo-detalle.html` — 1 ocurrencia, con workaround `:"UTC"` a quitar:
`{{ pago.fechaPago | date: "dd/MM/yyyy" : "UTC" }}` → `{{ pago.fechaPago | apiDate: "dd/MM/yyyy" }}`

## Lo que NO debes hacer

- No quites `CommonModule` en las Tareas 3, 4 y 6 (por `| currency`).
- No agregues `CurrencyPipe` por separado en esos 3 archivos — `CommonModule` ya lo cubre, no hay
  necesidad de tocar esa parte.
- No toques ningún otro archivo de `recursos-humanos.luxuryapp` fuera de los 6 mencionados — el
  resto son tickets aparte.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena (algunas son de 6 niveles, otras
  de 7 — cuenta las carpetas, no asumas).

## Verificación obligatoria

```bash
cd client/angular
perl -0777 -ne 'while (/\{\{[^}]*?\|\s*date\b[^}]*?\}\}/gs) { print "$&\n---\n" }' $(find src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina -name "*.html")
# Resultado esperado: sin salida (0 residuales)

grep -rn "'UTC'\|\"UTC\"" src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina --include="*.html"
# Resultado esperado: 0 líneas

grep -n "currency" src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/tiempo-extra/tiempo-extra.html src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/incidencias-nomina/incidencias-nomina.html src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/prestamos-empleado/modal-prestamo-detalle/modal-prestamo-detalle.html
# Resultado esperado: siguen presentes, sin cambios

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 12 ocurrencias migradas a `apiDate`, mismo formato, workarounds `:"UTC"` eliminados.
- `CommonModule` conservado en Tareas 3, 4 y 6; reemplazado en Tareas 1 y 5; agregado por primera
  vez (junto con `ApiDatePipe`) en Tarea 2.
- `| currency` intacto en los 3 archivos que lo usan.
- `ng build` sin errores nuevos.
- Ningún archivo fuera de los 6 mencionados fue tocado.

## Reporte de finalización

1. Diff exacto de los 6 archivos `.ts` + 6 `.html`.
2. Confirmación de que el bug de import faltante en `modal-dias-no-habiles.ts` quedó corregido de
   paso.
3. Salida literal de los 3 comandos de verificación y de `ng build`.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
