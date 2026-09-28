# TICKET FH-10 — Frontend: pipe `apiDate` + regla en CONVENTIONS.md

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Antes de escribir código, lee
`CONVENTIONS.md` y los siguientes archivos de `conventions/frontend/`:
`frontend-prohibitions.md`, `angular-services-catalog.md`, `angular-testing-patterns.md`.

## Contexto

El informe (`../../../docs/SharedLuxuryApp/FechasHoras/20260826-auditoria-shared-fechas-horas.md`,
secciones 3.2-3.3) confirmó un bug real: cuando un campo `DateOnly` del backend (ej. `"2026-08-26"`,
sin hora ni sufijo `Z`) se muestra con `{{ valor | date }}` (el `DatePipe` nativo de Angular
directamente, sin pasar por nada más), JavaScript interpreta ese string como **medianoche UTC**. Al
convertir a la hora local del navegador (México, UTC-6), el resultado cae al **día anterior**. Esto
ocurre en ~95 archivos `.html` que aplican `| date` directo sobre campos que, por nombre, son
`DateOnly` en el backend (`Charge.DueDate`, `CobranzaPayment.PaymentDate`, `WorkContract.StartDate`,
etc. — lista completa en el informe §3.3).

Ya existe la pieza que resuelve esto: `client/angular/src/app/core/services/date.service.ts`,
método público `parseDate(value: any): Date | null`. Internamente detecta un prefijo `yyyy-MM-dd` en
el string y construye el `Date` con `new Date(year, month-1, day)` (hora **local**, preserva el día
calendario correcto) — es exactamente el fix correcto. Para strings con hora real (`DateTime` UTC
con sufijo `Z` o similar), cae al `new Date(value)` normal, que JS interpreta correctamente como
instante UTC. **No hay que tocar `DateService` en este ticket** — ya funciona bien, el problema es
que casi nadie lo usa antes de aplicar `| date`.

Este ticket **solo crea el pipe y la regla de convenciones**. Migrar las ~95 plantillas es trabajo de
tickets futuros (FH-11+, uno por app), después de que este pipe exista y esté probado.

## Tarea 1 — Crear el pipe `apiDate`

Archivo nuevo: `client/angular/src/app/shared/pipes/api-date.pipe.ts`

```typescript
import { Pipe, PipeTransform, inject } from "@angular/core";
import { DatePipe } from "@angular/common";
import { DateService } from "../../core/services/date.service";

@Pipe({
  name: "apiDate",
})
export class ApiDatePipe implements PipeTransform {
  private readonly dateService = inject(DateService);
  private readonly datePipe = inject(DatePipe);

  transform(
    value: string | Date | null | undefined,
    format: string = "dd/MM/yyyy",
  ): string | null {
    const date = this.dateService.parseDate(value);
    if (!date) {
      return null;
    }
    return this.datePipe.transform(date, format);
  }
}
```

Verifica la ruta relativa de importación de `DateService` desde
`shared/pipes/api-date.pipe.ts` hacia `core/services/date.service.ts` — ajústala si la estructura de
carpetas hace que `../../core/services/date.service` no sea correcta (confírmalo compilando, no
asumas).

`DatePipe` de `@angular/common` ya está provisto globalmente en `app.config.ts` (línea ~148,
`providers: [..., DatePipe, ...]`) — no hace falta volver a proveerlo aquí, `inject(DatePipe)`
funciona directo porque el pipe se declara `providedIn` implícito de Angular (los pipes standalone
son inyectables solo cuando se usan dentro de un componente que los importa; si `inject(DatePipe)`
da error en tiempo de ejecución por falta de provider, es porque el componente que use `apiDate` no
tiene acceso al provider raíz — en ese caso, repórtalo, no le agregues un `providedIn` al pipe sin
consultar).

## Tarea 2 — Test del pipe

Archivo nuevo: `client/angular/src/app/shared/pipes/api-date.pipe.spec.ts`

Sigue el patrón de los demás `*.pipe.spec.ts` de esa misma carpeta (instanciación directa, sin
`TestBed`). Casos obligatorios a cubrir:

1. `DateOnly` sin hora (`"2026-08-26"`) → debe formatear como `"26/08/2026"`, **no** `"25/08/2026"`
   (el bug que este pipe existe para prevenir — instancia `DatePipe` con locale `"es-MX"` para el
   test, y `DateService` directo, sin mocks: `new DateService()`).
2. `DateTime` UTC con sufijo `Z` cercano a medianoche local México (ej. `"2026-08-27T02:00:00Z"`,
   que son las 20:00 del 26 en México) → debe mostrar el día correcto en hora local, no el día UTC.
3. `null`/`undefined`/`""` → debe devolver `null`, no lanzar excepción.
4. Formato custom (segundo parámetro, ej. `"dd-MMM-yy"`) → debe respetarlo.
5. Valor ya `Date` (no string) → debe funcionar igual.

## Tarea 3 — Regla en `frontend-prohibitions.md`

Archivo: `conventions/frontend/frontend-prohibitions.md`

Agrega una entrada nueva a la lista de "Prohibiciones" (no reescribas las existentes):

```
- No usar `new Date(...)`, `formatDate` de `@angular/common`, ni `| date` (DatePipe nativo)
  directamente sobre campos que vienen del API en componentes de feature. Los DTOs no distinguen
  en tiempo de compilación si un campo `string`/`Date` es un `DateOnly` o un `DateTime` del backend
  — parsear a mano arriesga el bug de "un día menos" en campos `DateOnly` (ver informe
  `../../../docs/SharedLuxuryApp/FechasHoras/20260826-auditoria-shared-fechas-horas.md` §3.3). Usa
  el pipe `apiDate` (`shared/pipes/api-date.pipe.ts`), que ya resuelve la ambigüedad vía
  `DateService.parseDate()`.
```

## Tarea 4 — Documentar en `angular-services-catalog.md`

Archivo: `conventions/frontend/angular-services-catalog.md`

Expande la entrada existente de `DateService` (busca `**DateService**`) para que sea precisa —
reemplaza el texto genérico actual ("Utilidades de fecha" / "Manipulación de fechas comunes") por:

```
**DateService**
- Propósito: Fuente única de parseo de fechas del API — preserva el día calendario correcto para
  campos `DateOnly` (`"yyyy-MM-dd"`) y respeta el instante UTC correcto para campos `DateTime`.
- Método clave: `parseDate(value: any): Date | null`.
- No lo uses directamente en plantillas para mostrar fechas — usa el pipe `apiDate`
  (`shared/pipes/api-date.pipe.ts`), que ya lo envuelve junto con el `DatePipe` nativo.
```

Agrega, inmediatamente después, una entrada nueva para el pipe:

```
**ApiDatePipe (`apiDate`)**
- Propósito: Formatear fechas del API en plantillas sin el riesgo de desfase de día de `| date`
  directo. Envuelve `DateService.parseDate()` + `DatePipe` nativo.
- Uso: `{{ item.dueDate | apiDate }}` o `{{ item.dueDate | apiDate:'dd-MMM-yy' }}`.
- Obligatorio para cualquier campo de fecha proveniente del API — ver
  `frontend-prohibitions.md`.
```

## Lo que NO debes hacer

- No toques `DateService` (`core/services/date.service.ts`) — ya funciona correctamente, no
  necesita cambios para este ticket.
- No migres ninguna plantilla `.html` existente a `apiDate` todavía — eso es FH-11+, tickets
  separados por app.
- No agregues el pipe a ningún `imports: [...]` de componente existente.
- No crees un `SharedPipesModule` ni ningún mecanismo de registro global — los pipes standalone se
  importan uno por uno en el `imports` de cada componente que los use (ver cómo `DatePipe` nativo ya
  se importa en `charge-list.ts` como referencia de patrón, aunque ese archivo no se toca en este
  ticket).

## Verificación obligatoria

```bash
cd client/angular
npx ng build --configuration production 2>&1 | tail -n 40
npx ng test --watch=false --include='**/api-date.pipe.spec.ts' 2>&1 | tail -n 40
```

(Ajusta el comando de test al runner real configurado en el proyecto — Karma/Jasmine o Jest, según
lo que uses `package.json` para confirmar antes de correrlo.)

## Criterio de PASO

- `api-date.pipe.ts` existe, compila, envuelve `DateService.parseDate()` + `DatePipe` nativo.
- `api-date.pipe.spec.ts` existe y pasa, con los 5 casos de la Tarea 2 cubiertos — en particular el
  caso 1 (`DateOnly` sin hora) debe demostrar que el pipe da el día correcto, no el día menos uno.
- `frontend-prohibitions.md` y `angular-services-catalog.md` actualizados como se especifica.
- `ng build` sin errores nuevos.
- Ninguna plantilla `.html` ni componente existente fue tocado.

## Reporte de finalización

1. Contenido completo de `api-date.pipe.ts` y `api-date.pipe.spec.ts`.
2. Resultado literal de correr los tests (en particular el caso del bug de "un día menos").
3. Diff de `frontend-prohibitions.md` y `angular-services-catalog.md`.
4. Salida literal de `ng build`.
5. Decisiones que tomaste por tu cuenta y por qué (en particular si tuviste que ajustar la ruta de
   import o el mecanismo de provisión de `DatePipe`).

No avances a ningún otro ticket. Espera la auditoría.
