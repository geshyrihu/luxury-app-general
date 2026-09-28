# TICKET FH-11b — Frontend: migrar `committee`/`compras`/`auth` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a` (ya cerrado y aprobado, `resident.luxuryapp`) — úsalo de referencia de estilo. Este ticket
cierra las 3 apps "pequeñas" restantes (1 archivo con `| date` cada una): `committee.luxuryapp`,
`compras.luxuryapp`, `auth.luxuryapp`.

**Los 3 casos son distintos entre sí — lee cada tarea completa, no apliques el mismo patrón de FH-11a
a ciegas.**

## Tarea 1 — `committee.luxuryapp/poliza-seguro-edificio`

Campo real: `ContratoPoliza.StartDate` (`DateOnly`, no nulo) y `ContratoPoliza.EndDate`
(`DateOnly?`) — confirmado en
`api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Legal/AsuntosLegalesySeguros/ContratoPoliza.cs`.

Archivo: `client/angular/src/app/apps/committee.luxuryapp/poliza-seguro-edificio/poliza-seguro-edificio.ts`
- `imports: [CommonModule, WebButtonLabelViewPdf, AppIcon]` — la plantilla **solo usa `CommonModule`
  para el `| date`** (verificado: usa sintaxis nueva `@if`, no `*ngIf`/`*ngFor`/`ngClass`/`ngStyle`,
  ni ningún otro pipe de `CommonModule`). Reemplaza `CommonModule` por `ApiDatePipe`
  (`import { ApiDatePipe } from "../../../shared/pipes/api-date.pipe";`, quita el import de
  `CommonModule`).

Archivo: `client/angular/src/app/apps/committee.luxuryapp/poliza-seguro-edificio/poliza-seguro-edificio.html`
- Línea 35: `{{ policy.startDate | date: 'dd/MM/yyyy' }}` → `{{ policy.startDate | apiDate }}`
- Línea 43: `{{ policy.endDate | date: 'dd/MM/yyyy' }}` → `{{ policy.endDate | apiDate }}`

## Tarea 2 — `compras.luxuryapp/historial-compras`

Campo real: `fechaSolicitud` (`OrdenCompra.FechaSolicitud`/`SolicitudCompra.FechaSolicitud`, ambos
`DateOnly` en el backend).

**Ojo — este archivo es distinto al de la Tarea 1: usa `| number:'1.2-2'` (DecimalPipe) además de
`| date`, ambos vienen de `CommonModule`. NO quites `CommonModule` de los imports — `ApiDatePipe` se
agrega, no reemplaza.**

Archivo: `client/angular/src/app/apps/compras.luxuryapp/historial-compras/historial-compras-list.ts`
- Agrega `ApiDatePipe` al arreglo `imports` (no quites `CommonModule`).
- Agrega el import: `import { ApiDatePipe } from "../../../shared/pipes/api-date.pipe";` (verifica
  la ruta relativa real según la profundidad de carpeta).

Archivo: `client/angular/src/app/apps/compras.luxuryapp/historial-compras/historial-compras-list.html`

Hay **2 ocurrencias**, ambas con el workaround `:'UTC'` que ya existía (un parche parcial para el
mismo bug que `apiDate` resuelve de raíz — quítalo, `apiDate` no necesita ni acepta ese tercer
parámetro):
- Línea 174: `{{ item.fechaSolicitud | date:'dd/MM/yyyy':'UTC' }}` → `{{ item.fechaSolicitud | apiDate }}`
- Líneas 216-217: `{{ item.fechaSolicitud | date:'dd/MM/yyyy':'UTC' }}` (dentro de un `<p>` junto con
  `{{ item.total | number:'1.2-2' }}`) → cambia solo la parte de `fechaSolicitud`, deja
  `item.total | number:'1.2-2'` intacto.

## Tarea 3 — `auth.luxuryapp/password-manager/password-list`

Campo real: `Credential.SubscriptionExpirationDate` (`DateOnly?`) — confirmado en
`api/LuxuryApp.Infrastructure.Vault/Entities/Credential.cs`.

Archivo: `client/angular/src/app/apps/auth.luxuryapp/password-manager/password-list.ts`
- Línea 1: `import { DatePipe } from "@angular/common";` → `import { ApiDatePipe } from "../../../shared/pipes/api-date.pipe";`
- Línea 54 (dentro de `imports: [...]`): `DatePipe,` → `ApiDatePipe,` (confirmado por grep: es el
  único uso de `DatePipe`/`| date` en toda la app `auth.luxuryapp`, seguro quitarlo por completo).

Archivo: `client/angular/src/app/apps/auth.luxuryapp/password-manager/password-list.html`
- Línea 75: `{{ item.subscriptionExpirationDate | date: 'dd/MM/yyyy' : 'UTC' }}` →
  `{{ item.subscriptionExpirationDate | apiDate }}` (igual que en la Tarea 2, quita el workaround
  `:'UTC'`, ya no hace falta).

## Lo que NO debes hacer

- No quites `CommonModule` de `historial-compras-list.ts` (Tarea 2) — rompería el `| number`.
- No toques ningún otro archivo de estas 3 apps más allá de los mencionados.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Antes de dar por buena cualquier ruta relativa de import, verifica que compile — no asumas que es
  idéntica en los 3 casos solo porque `resident.luxuryapp` usó `../../../shared/pipes/api-date.pipe`
  — la profundidad de carpetas puede diferir.

## Verificación obligatoria

```bash
cd client/angular
grep -rn "| date\|DatePipe" src/app/apps/committee.luxuryapp/poliza-seguro-edificio/ src/app/apps/compras.luxuryapp/historial-compras/ src/app/apps/auth.luxuryapp/password-manager/
# Resultado esperado: 0 líneas (nada de DatePipe nativo ni | date residual en estos 3 directorios)

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Los 3 componentes usan `apiDate` en vez de `date` nativo para los campos mencionados.
- `historial-compras-list.ts` conserva `CommonModule` (por el `| number`).
- `poliza-seguro-edificio.ts` y `password-list.ts` ya no importan `CommonModule`/`DatePipe`.
- Los 3 workarounds `:'UTC'` (2 en compras, 1 en auth) fueron eliminados.
- `ng build` sin errores nuevos.
- Ningún archivo fuera de las 6 mencionadas (3 `.ts` + 3 `.html`) fue tocado.

## Reporte de finalización

1. Diff exacto de los 6 archivos.
2. Confirmación de que `CommonModule` se conservó en Tarea 2 y se quitó en Tareas 1 y 3.
3. Salida literal del grep de verificación y de `ng build`.
4. Decisiones que tomaste por tu cuenta y por qué (en particular las rutas de import si difirieron
   entre las 3 apps).

No avances a ningún otro ticket. Espera la auditoría.
