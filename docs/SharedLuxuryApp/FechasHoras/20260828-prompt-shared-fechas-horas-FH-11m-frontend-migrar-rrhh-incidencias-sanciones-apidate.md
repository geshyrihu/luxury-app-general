# TICKET FH-11m — Frontend: migrar clúster "incidencias/sanciones" de `recursos-humanos.luxuryapp` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11l` (ya cerrados y aprobados). Cubre el clúster **incidencias/sanciones** dentro de
`recursos-humanos.luxuryapp` — 4 archivos, **9 ocurrencias** de `| date` (recontadas con búsqueda
multilínea — úsala también en tu verificación final). Es el tercero de varios tickets para terminar
`recursos-humanos.luxuryapp` (quedan 54 ocurrencias / 23 archivos tras FH-11k; con este ticket
bajan a 45 / 19).

Todos los archivos viven bajo
`src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/incidencias-sanciones/`.

**Hallazgos aparte, sin relación con este ticket — NO los toques:**

1. `incident/incident-list.ts` y `sanction/sanction-list.ts` tienen **corrupción preexistente de
   bytes NUL** (patrón ya visto en FH-11i, `recepcion-pipas-agua-list.ts`) dentro de 3 y 2 strings
   literales respectivamente (mensajes de UI: `"cancelaci\0\0n"`, `"f\0\0sica"`, `"guard\0\0
   correctamente"` en `incident-list.ts`; `"Sanci\0\0n"` en `sanction-list.ts`, 2 veces). Son bytes
   NUL literales dentro de palabras que deberían decir "cancelación", "física", "guardó",
   "Sanción". No los repares, no los toques — solo confirma en tu reporte que siguen exactamente
   igual (mismo conteo de bytes NUL) después de tu edición, para probar que no los empeoraste.
2. `incident-attachments/incident-attachments.ts`: la plantilla usa `[ngClass]="getFileIconClass(...)"`
   (línea ~89) pero el componente **no importa `CommonModule` ni `NgClass`** — es el mismo tipo de
   bug preexistente ya reportado en tickets anteriores (pipe/directiva usada sin importar, sin
   causar error de build). No lo arregles, solo repórtalo.

## Tarea 1 — `incident/incident-list`

`incident-list.ts`: `import { DatePipe } from "@angular/common";` (suelto) → reemplaza por
`ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../../shared/pipes/api-date.pipe";`

`incident-list.html` — 3 ocurrencias, mismo campo, formatos distintos, **sin workaround**:
- `item.incidentDateTime | date:'dd/MM/yyyy'` → `apiDate:'dd/MM/yyyy'`
- `item.incidentDateTime | date:'HH:mm'` → `apiDate:'HH:mm'`
- `item.incidentDateTime | date:'dd/MM/yyyy HH:mm'` → `apiDate:'dd/MM/yyyy HH:mm'`

## Tarea 2 — `incident/incident-attachments/incident-attachments`

`incident-attachments.ts`: `import { DatePipe } from "@angular/common";` (suelto) → reemplaza por
`ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../../../shared/pipes/api-date.pipe";`

`incident-attachments.html` — 1 ocurrencia, sin workaround:
`{{ attachment.createdAt | date : "dd/MM/yyyy" }}` → `{{ attachment.createdAt | apiDate : "dd/MM/yyyy" }}`

## Tarea 3 — `incident/suspension-days-manager/suspension-days-manager`

`suspension-days-manager.ts`: `import { DatePipe } from "@angular/common";` (suelto) → reemplaza
por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../../../shared/pipes/api-date.pipe";`

`suspension-days-manager.html` — 1 ocurrencia, **con workaround `:"UTC"` a quitar**:
`{{ day.suspensionDate | date: "dd/MM/yyyy":"UTC" }}` → `{{ day.suspensionDate | apiDate: "dd/MM/yyyy" }}`

## Tarea 4 — `sanction/sanction-list`

**Caso especial: NO quites `CommonModule`.** `sanction-list.ts`:
`import { CommonModule, DatePipe } from "@angular/common";` — la plantilla usa `[ngClass]` (2
puntos, líneas ~42 y ~94) sin `NgClass` importado por separado, depende de `CommonModule`. Quita
solo `DatePipe`, agrega `ApiDatePipe`, conserva `CommonModule`.
Import: `import { ApiDatePipe } from "../../../../../../shared/pipes/api-date.pipe";`

`sanction-list.html` — 4 ocurrencias, **todas con workaround `:'UTC'` a quitar**:
- `item.appliedDate | date:'dd/MM/yyyy':'UTC'` → `apiDate:'dd/MM/yyyy'`
- `item.effectiveEndDate ? (item.effectiveEndDate | date:'dd/MM/yyyy':'UTC') : '-'` (envuelta en 2
  líneas) → `apiDate:'dd/MM/yyyy'` dentro del mismo operador `?:`
- `item.appealDeadline | date:'dd/MM/yyyy':'UTC'` → `apiDate:'dd/MM/yyyy'`
- `item.appliedDate | date:'dd/MM/yyyy':'UTC'` (otra ocurrencia, envuelta en 2 líneas, distinta
  sección de la primera) → `apiDate:'dd/MM/yyyy'`

## Lo que NO debes hacer

- No quites `CommonModule` en la Tarea 4 (`sanction-list`, por `[ngClass]`).
- No toques los bytes NUL en `incident-list.ts` ni en `sanction-list.ts` — no los repares, no los
  empeores.
- No arregles el `[ngClass]` sin `NgClass`/`CommonModule` importado en `incident-attachments.ts` —
  repórtalo, no lo toques.
- No toques ningún otro archivo — el resto de `recursos-humanos.luxuryapp` son tickets aparte.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena (6 niveles en Tareas 1 y 4, 7
  niveles en Tareas 2 y 3 — cuenta las carpetas, no asumas).

## Verificación obligatoria

```bash
cd client/angular
perl -0777 -ne 'while (/\{\{[^}]*?\|\s*date\b[^}]*?\}\}/gs) { print "$&\n---\n" }' $(find src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/incidencias-sanciones -name "*.html")
# Resultado esperado: sin salida (0 residuales)

grep -rn "'UTC'\|\"UTC\"" src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/incidencias-sanciones --include="*.html"
# Resultado esperado: 0 líneas

grep -n "ngClass" src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/incident-attachments/incident-attachments.html src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/incidencias-sanciones/sanction/sanction-list.html
# Resultado esperado: siguen presentes, sin cambios (1 + 2 líneas)

python3 -c "
for fn in ['src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/incident-list.ts','src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/incidencias-sanciones/sanction/sanction-list.ts']:
    data = open(fn, 'rb').read()
    print(fn, 'NUL count:', data.count(b'\x00'))
"
# Resultado esperado: incident-list.ts = 6, sanction-list.ts = 4 (sin cambio)

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 9 ocurrencias migradas a `apiDate`, mismo formato, workarounds `:'UTC'`/`:"UTC"` eliminados.
- `CommonModule` conservado solo en la Tarea 4; reemplazado (o agregado por primera vez, viniendo
  de `DatePipe` suelto) en el resto.
- Los bytes NUL preexistentes intactos (mismo conteo antes/después).
- El hallazgo de `[ngClass]` sin importar reportado, no tocado.
- `ng build` sin errores nuevos.
- Ningún otro archivo tocado.

## Reporte de finalización

1. Diff exacto de los 4 archivos `.ts` + 4 `.html`.
2. Confirmación del conteo de bytes NUL antes/después (deben coincidir).
3. Confirmación del hallazgo de `[ngClass]` sin importar (aunque no lo toques).
4. Salida literal de los 4 comandos de verificación y de `ng build`.
5. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
