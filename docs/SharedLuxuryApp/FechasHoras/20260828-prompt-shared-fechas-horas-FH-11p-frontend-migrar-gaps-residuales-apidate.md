# TICKET FH-11p — Frontend: cerrar 3 gaps residuales de `| date` en apps ya migradas

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11o` (ya cerrados y aprobados). Este ticket **no es un clúster nuevo** — es una
limpieza final de 3 ocurrencias de `| date` que quedaron sin migrar en apps que ya se dieron por
cerradas en tickets anteriores. Con este ticket, el grep
`grep -rn "| date" client/angular/src/app/apps --include="*.html"` debe devolver **0 líneas** en
todo el proyecto (excluyendo comentarios o falsos positivos que no sean el pipe real).

## Tarea 1 — `reclutamiento.luxuryapp/candidate-recruitment-interviews`

`candidate-recruitment-interviews.ts` **ya importa `ApiDatePipe` correctamente** (de un ticket
anterior) — no toques el `.ts`, no hay nada que cambiar ahí.

`candidate-recruitment-interviews.html` — 1 ocurrencia que quedó sin migrar porque está envuelta
en 2 líneas por Prettier (línea ~253):
```
@if (interviewDate(candidate)) { {{ interviewDate(candidate) |
                  date: "dd/MM/yyyy HH:mm" }}
```
→
```
@if (interviewDate(candidate)) { {{ interviewDate(candidate) |
                  apiDate: "dd/MM/yyyy HH:mm" }}
```
Solo cambia `date:` por `apiDate:` en esa ocurrencia — no reformatees el resto del bloque.

## Tarea 2 — `operations.luxuryapp/diagrams/diagram/diagram-gallery/diagram-gallery`

`diagram-gallery.ts` usa `template:` **inline** (no `.html` separado). `imports: [CommonModule,
WebButtonLabel, AppIcon, CustomInputTextSignal]` — `CommonModule` sin otro uso en el template
(revisa igual, pero no se detectó ningún `*ngIf`/`*ngFor`/`ngClass`/otro pipe que dependa de
`CommonModule`) — reemplázalo por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";`

Dentro del `template:` inline, línea ~56, 1 ocurrencia:
`{{ diagram.updateAt | date: "dd/MM/yyyy" }}` → `{{ diagram.updateAt | apiDate: "dd/MM/yyyy" }}`

## Tarea 3 — `supplier.luxuryapp/provider-quotation/cuadro-comparativo-list` (archivo huérfano)

**Contexto:** este archivo es un duplicado huérfano — existe también
`supplier.luxuryapp/quotes/provider-quotation/cuadro-comparativo-list` (con `quotes/` en la ruta),
que es la versión **viva y ya migrada** (referenciada por el ruteo real; fue la que se migró en
FH-11f). La copia sin `quotes/` no está referenciada por ningún ruteo ni import — se confirmó de
nuevo en la auditoría de FH-11o. Aun así, se migra por completitud (para que el grep global quede
en 0), no porque tenga impacto en producción.

`cuadro-comparativo-list.ts`: `CommonModule` sin otro uso — reemplázalo por `ApiDatePipe`.
Import: `import { ApiDatePipe } from "../../../shared/pipes/api-date.pipe";`

`cuadro-comparativo-list.html` — 1 ocurrencia (línea ~184):
`{{ solicitudCompra.comiteEvento.startAt | date:'dd MMM yyyy' }}` →
`{{ solicitudCompra.comiteEvento.startAt | apiDate:'dd MMM yyyy' }}`

## Lo que NO debes hacer

- No toques el `.ts` de la Tarea 1 (`candidate-recruitment-interviews.ts`) — ya está correcto.
- No toques `supplier.luxuryapp/quotes/provider-quotation/cuadro-comparativo-list` (la versión
  viva, ya migrada en FH-11f) — solo la copia huérfana sin `quotes/`.
- No toques ningún otro archivo — no hay más gaps conocidos fuera de estos 3.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica cada ruta relativa de import antes de darla por buena.

## Verificación obligatoria

```bash
cd client/angular
grep -rn "| date\b" src/app/apps --include="*.html" --include="*.ts"
# Resultado esperado: 0 líneas reales de pipe `| date` (ignora falsos positivos tipo
# "dates || dates" o comentarios; si aparece alguno, repórtalo, no lo edites por tu cuenta sin
# confirmar que es un pipe real)

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 3 ocurrencias migradas a `apiDate`.
- `candidate-recruitment-interviews.ts` sin tocar.
- `supplier.luxuryapp/quotes/provider-quotation/cuadro-comparativo-list` (versión viva) sin tocar.
- `ng build` sin errores nuevos.
- Ningún otro archivo tocado.

## Reporte de finalización

1. Diff exacto de los 3 archivos tocados (1 `.html` de Tarea 1, `.ts`+inline template de Tarea 2,
   `.ts`+`.html` de Tarea 3).
2. Salida literal del grep global y de `ng build`.
3. Confirmación explícita: ¿el grep global `| date` en `src/app/apps` da 0 líneas reales? Si
   encuentras algún residual adicional no listado aquí, repórtalo en detalle (archivo, línea,
   contexto) sin editarlo — se evalúa aparte.

No avances a ningún otro ticket. Espera la auditoría.
