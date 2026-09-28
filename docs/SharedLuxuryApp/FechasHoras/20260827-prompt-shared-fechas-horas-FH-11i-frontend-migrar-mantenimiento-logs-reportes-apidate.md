# TICKET FH-11i — Frontend: migrar `mantenimiento.luxuryapp/logs+inspection+reports` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11h` (ya cerrados y aprobados; `FH-11h` cubrió la primera mitad de
`mantenimiento.luxuryapp`, el clúster `fire-equipment/` — este ticket es la segunda mitad). Cubre
8 archivos, 20 ocurrencias de `| date`, **más 3 llamadas programáticas a `formatDate()`** (la
función de `@angular/common`, no el pipe de plantilla — mismo riesgo, tratamiento distinto) en 2 de
los 8 archivos.

**Advertencia especial — Tarea 6 (`recepcion-pipas-agua-list.ts`):** este archivo tiene **bytes NULL
literales incrustados** en un string (`"Pipa vac\x00\x00a"`, probablemente debía decir "Pipa
vacía" — corrupción de codificación preexistente, confirmada con `file` y un dump hexadecimal, sin
relación con este ticket). Es una corrupción real, no algo tuyo que arreglar. Antes de editar este
archivo específico:
1. Haz tu edición de forma quirúrgica (solo las líneas de `| date` indicadas), sin reescribir el
   archivo completo si tu herramienta de edición lo permite.
2. Si tu herramienta falla, se cuelga, o el archivo queda con más bytes corruptos de los que ya
   tenía después de tu cambio, **detente y repórtalo** — no fuerces el guardado. No es tu
   responsabilidad arreglar los bytes NULL preexistentes, pero sí es tu responsabilidad no empeorar
   la corrupción ni perder contenido del archivo.

## Tarea 1 — `inspection/bitacora/mis-inspecciones-lista`

`mis-inspecciones-lista.ts`: `import { CommonModule } from "@angular/common";`, sin otro uso de
`CommonModule` en la plantilla — reemplaza por `ApiDatePipe`.

`mis-inspecciones-lista.html`:
`{{ dateSelectControl.value | date : "EEEE dd-MMM-yyyy" }}` → `{{ dateSelectControl.value | apiDate : "EEEE dd-MMM-yyyy" }}`

## Tarea 2 — `logs/bitacoras/medidores/medidor-lectura-list`

**Caso con función `formatDate` programática, además del pipe de plantilla.**

`medidor-lectura-list.ts`: `import { CommonModule, formatDate } from "@angular/common";` — sin otro
uso de `CommonModule` en la plantilla. Reemplaza `CommonModule` por `ApiDatePipe` en el import y en
`imports`. Además, en la línea ~105:
```typescript
? formatDate(item.fechaRegistro, "dd-MMM-yyyy", "en-US", "UTC")
```
`item.fechaRegistro` es un campo `DateOnly` real del API (`MedidorLectura.FechaRegistro`), y el
`"UTC"` es el mismo workaround manual que ya vimos como `:'UTC'` en plantillas — con `apiDate` ya no
hace falta. Cambia esa línea a usar el pipe inyectado en vez de la función suelta:

1. Quita `formatDate` del import de `@angular/common` (ya no se usa).
2. Inyecta el pipe como servicio (mismo patrón que `datePipe = inject(DatePipe)` que viste en
   `legal.luxuryapp` en FH-11c, pero con `ApiDatePipe`):
   ```typescript
   private apiDatePipe = inject(ApiDatePipe);
   ```
3. Reemplaza la llamada:
   ```typescript
   ? this.apiDatePipe.transform(item.fechaRegistro, "dd-MMM-yyyy")
   ```
   (sin el cuarto parámetro de timezone — `apiDate` no lo necesita ni lo acepta).

`medidor-lectura-list.html` — 2 ocurrencias, **con workaround `:"UTC"` a quitar**:
`{{ item.fechaRegistro | date: "dd-MMM-yyyy" : "UTC" }}` → `{{ item.fechaRegistro | apiDate: "dd-MMM-yyyy" }}` (en ambas)

## Tarea 3 — `logs/bitacoras/prestamo-herramienta/prestamo-herramientas-control`

`prestamo-herramientas-control.ts`: `CommonModule` solo, sin otro uso — reemplaza por `ApiDatePipe`.

`prestamo-herramientas-control.html` — 4 ocurrencias (2 campos × 2 vistas, formatos distintos):
- `item.fechaSalida | date: "medium"` → `apiDate: "medium"`
- `item.fechaRegreso | date: "medium"` → `apiDate: "medium"`
- `item.fechaSalida | date: 'dd/MM/yy HH:mm'` → `apiDate: 'dd/MM/yy HH:mm'`
- `item.fechaRegreso | date: 'dd/MM/yy HH:mm'` → `apiDate: 'dd/MM/yy HH:mm'`

## Tarea 4 — `logs/maintenance-log/bitacora-individual`

`bitacora-individual.ts`: `CommonModule` solo, sin otro uso — reemplaza por `ApiDatePipe`.

`bitacora-individual.html` — 3 ocurrencias, mismo campo, formatos distintos (una envuelta):
- `item.fechaRegistro | date : "fullDate"` → `apiDate : "fullDate"`
- `item.fechaRegistro | date : "shortTime"` (envuelta) → `apiDate : "shortTime"`
- `item.fechaRegistro | date:'short'` → `apiDate:'short'`

## Tarea 5 — `logs/maintenance-log/bitacora-mantenimiento`

`bitacora-mantenimiento.ts`: `CommonModule` solo, sin otro uso — reemplaza por `ApiDatePipe`.

`bitacora-mantenimiento.html` — 2 ocurrencias, mismo campo, formatos distintos:
- `item.fechaRegistro | date: 'EEEE d MMM y h:mm '` → `apiDate: 'EEEE d MMM y h:mm '`
- `item.fechaRegistro | date:'short'` → `apiDate:'short'`

## Tarea 6 — `logs/recepcion-pipas-agua/recepcion-pipas-agua-list`

**Ver advertencia especial arriba sobre corrupción de bytes NULL en este archivo — procede con
cuidado quirúrgico.**

`recepcion-pipas-agua-list.ts`: usa `CommonModule` (la plantilla tiene `| number` en 12 puntos) —
**conserva `CommonModule`**, agrega `ApiDatePipe`.

`recepcion-pipas-agua-list.html` — 4 ocurrencias, **todas con workaround `:'UTC'` a quitar**:
- `item.horaLlegada | date: 'dd/MM/yy HH:mm' : 'UTC'` → `item.horaLlegada | apiDate: 'dd/MM/yy HH:mm'`
- `item.horaTermino | date: 'dd/MM/yy HH:mm' : 'UTC'` → `item.horaTermino | apiDate: 'dd/MM/yy HH:mm'`
- `item.horaLlegada | date: 'dd/MM/yyyy HH:mm' : 'UTC'` (formato distinto, otra vista) →
  `item.horaLlegada | apiDate: 'dd/MM/yyyy HH:mm'`
- `item.horaTermino | date: 'HH:mm' : 'UTC'` (solo hora, otra vista) → `item.horaTermino | apiDate: 'HH:mm'`

## Tarea 7 — `logs/recepcion-pipas-agua/recepcion-pipas-agua-reporte`

**Caso con función `formatDate` programática, 2 llamadas reales + 1 llamada segura que NO se
toca.**

`recepcion-pipas-agua-reporte.ts`: usa `CommonModule` (la plantilla tiene `| number` en 15 puntos)
y `formatDate`. **Conserva `CommonModule`**, agrega `ApiDatePipe`.

Hay 3 llamadas a `formatDate()` en este archivo (~líneas 158, 298, 301):
- **Línea ~158, función `fmtDt`**: `d ? formatDate(d, "dd/MM/yyyy HH:mm", "es-MX") : "N/A"` donde
  `d: Date | null` — este parámetro ya es un objeto `Date` nativo construido localmente (viene de
  `this.startDate`/`this.endDate`, filtros de rango de fechas del componente, **no** un string del
  API). **NO la toques** — es el mismo caso legítimo que ya viste en `legal.luxuryapp` (FH-11c).
- **Líneas ~298 y ~301**: `formatDate(item.horaLlegada, "dd/MM/yyyy HH:mm", "es-MX")` y
  `formatDate(item.horaTermino, "dd/MM/yyyy HH:mm", "es-MX")` — estos SÍ operan directamente sobre
  campos del API (`item.horaLlegada`/`item.horaTermino`, los mismos campos que en la Tarea 6).
  Conviértelas al mismo patrón que la Tarea 2:
  1. Inyecta `private apiDatePipe = inject(ApiDatePipe);`.
  2. Reemplaza ambas líneas por `this.apiDatePipe.transform(item.horaLlegada, "dd/MM/yyyy HH:mm")` /
     `this.apiDatePipe.transform(item.horaTermino, "dd/MM/yyyy HH:mm")`.
  3. **No quites el import de `formatDate`** si `fmtDt` (línea ~158) lo sigue usando — solo quítalo
     si compruebas que ya no queda ninguna llamada a la función suelta en todo el archivo.

`recepcion-pipas-agua-reporte.html` — 2 ocurrencias, **con workaround `:'UTC'` a quitar**:
- `item.horaLlegada | date: 'dd/MM/yy HH:mm' : 'UTC'` → `item.horaLlegada | apiDate: 'dd/MM/yy HH:mm'`
- `item.horaTermino | date: 'dd/MM/yy HH:mm' : 'UTC'` → `item.horaTermino | apiDate: 'dd/MM/yy HH:mm'`

## Tarea 8 — `reports-mantenance/report-consumos/report-consumos`

`report-consumos.ts`: usa `CommonModule` (la plantilla tiene `| number` en 7 puntos) — **conserva
`CommonModule`**, agrega `ApiDatePipe`.

`report-consumos.html` — 2 ocurrencias (una envuelta en 2 líneas):
- `data.fechaInicio | date: "dd/MM/yyyy"` → `apiDate: "dd/MM/yyyy"`
- `data.fechaFin | date: "dd/MM/yyyy"` (envuelta) → `apiDate: "dd/MM/yyyy"`

## Lo que NO debes hacer

- No toques la función `fmtDt` (línea ~158 de `recepcion-pipas-agua-reporte.ts`) — opera sobre
  `Date` nativos locales, no sobre el API.
- No quites `CommonModule` en las Tareas 6, 7, 8 (por `| number`).
- No intentes arreglar los bytes NULL de `recepcion-pipas-agua-list.ts` — repórtalos, no los toques.
- No toques ningún otro archivo de `mantenimiento.luxuryapp` (el clúster `fire-equipment/` es
  FH-11h, ya cerrado).
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena.

## Verificación obligatoria

```bash
cd client/angular
perl -0777 -ne 'while (/\{\{[^}]*?\|\s*date\b[^}]*?\}\}/gs) { print "$&\n---\n" }' src/app/apps/mantenimiento.luxuryapp/inspection/bitacora/mis-inspecciones-lista.html src/app/apps/mantenimiento.luxuryapp/logs/bitacoras/medidores/medidor-lectura-list.html src/app/apps/mantenimiento.luxuryapp/logs/bitacoras/prestamo-herramienta/prestamo-herramientas-control.html src/app/apps/mantenimiento.luxuryapp/logs/maintenance-log/bitacora-individual.html src/app/apps/mantenimiento.luxuryapp/logs/maintenance-log/bitacora-mantenimiento.html src/app/apps/mantenimiento.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-list.html src/app/apps/mantenimiento.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-reporte.html src/app/apps/mantenimiento.luxuryapp/reports-mantenance/report-consumos/report-consumos.html
# Resultado esperado: sin salida (0 residuales en plantillas)

grep -n "formatDate(item\." src/app/apps/mantenimiento.luxuryapp/logs/bitacoras/medidores/medidor-lectura-list.ts src/app/apps/mantenimiento.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-reporte.ts
# Resultado esperado: 0 líneas (las 3 llamadas sobre campos del API ya migradas)

grep -n "formatDate(d" src/app/apps/mantenimiento.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-reporte.ts
# Resultado esperado: 1 línea (fmtDt intacta)

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 20 ocurrencias de plantilla migradas a `apiDate`, mismo formato que antes.
- Las 3 llamadas a `formatDate()` sobre campos del API convertidas a `this.apiDatePipe.transform()`;
  la llamada sobre `Date` nativo (`fmtDt`) intacta.
- `CommonModule` conservado en Tareas 6, 7, 8; reemplazado en el resto.
- `recepcion-pipas-agua-list.ts` sin corrupción adicional a la preexistente.
- `ng build` sin errores nuevos.
- Ningún archivo fuera de los 8 mencionados fue tocado.

## Reporte de finalización

1. Diff exacto de los 8 archivos `.ts` + 8 `.html`.
2. Confirmación explícita de las 3 conversiones de `formatDate()` y de que `fmtDt` quedó intacta.
3. Confirmación de que `recepcion-pipas-agua-list.ts` no quedó más corrupto de lo que ya estaba.
4. Salida literal de los 3 comandos de verificación y de `ng build`.
5. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
