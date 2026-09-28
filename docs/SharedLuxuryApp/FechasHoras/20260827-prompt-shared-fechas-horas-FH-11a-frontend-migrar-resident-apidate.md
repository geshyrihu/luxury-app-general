# TICKET FH-11a — Frontend: migrar `resident.luxuryapp` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Este es el **primer ticket**
de la serie FH-11+ (migración de plantillas, app por app, al pipe `apiDate` creado en FH-10, ya
cerrado y aprobado) — se eligió `resident.luxuryapp` para empezar por ser el caso más simple y
autocontenido (1 solo archivo, 1 sola ocurrencia) y así validar el patrón de migración antes de
escalar a apps más grandes.

## Contexto

`client/angular/src/app/apps/resident.luxuryapp/property/propiedades-form.html:77` usa el `DatePipe`
nativo de Angular directamente sobre `delinquentSince`, un campo que viene del API
(`PropertyDTO.DelinquentSince`, backend: `DateOnly?`). Verificado en
`propiedades-form.ts:68,129`: `delinquentSince: string | null`, poblado desde la respuesta del API
(`result.delinquentSince`).

Este es exactamente el bug que `apiDate` existe para prevenir: durante las 18:00-23:59 hora de
México, un `DateOnly` como `"2026-08-26"` mostrado con `| date` nativo aparecería como "25/08/2026"
(un día menos) porque JavaScript interpreta el string sin hora como medianoche UTC.

## Tarea 1 — `propiedades-form.ts`

Archivo: `client/angular/src/app/apps/resident.luxuryapp/property/propiedades-form.ts`

1. Línea 1: cambia
   ```typescript
   import { DatePipe } from "@angular/common";
   ```
   por
   ```typescript
   import { ApiDatePipe } from "../../../shared/pipes/api-date.pipe";
   ```
   **Antes de asumir esa ruta relativa, verifica que compile** — cuenta los niveles reales desde
   `apps/resident.luxuryapp/property/` hasta `app/shared/pipes/`; si el proyecto usa un alias de
   path (`@shared/...` en `tsconfig.json`), usa ese alias en vez de la ruta relativa si es el patrón
   que ya siguen otros archivos del proyecto — confírmalo, no asumas.

2. **Antes de tocar el `imports: [...]` del componente** (línea ~47-48), busca si `DatePipe` se usa
   en algún otro lugar de este mismo componente o de su plantilla (`grep -n "DatePipe\|| date"` en
   ambos archivos) — si `delinquentSince` es el único uso, reemplaza `DatePipe` por `ApiDatePipe` en
   el arreglo `imports`. Si hay otro uso legítimo de `DatePipe` sobre un campo `DateTime` real (no
   `DateOnly`), dilo en el reporte y **deja `DatePipe` importado también**, agregando `ApiDatePipe`
   sin quitarlo.

## Tarea 2 — `propiedades-form.html`

Archivo: `client/angular/src/app/apps/resident.luxuryapp/property/propiedades-form.html`

Línea 77:
```html
>desde {{ delinquentSince | date:'dd/MM/yyyy' }}</span
```
cámbiala a:
```html
>desde {{ delinquentSince | apiDate }}</span
```
(el formato por defecto del pipe ya es `'dd/MM/yyyy'`, no hace falta pasarlo explícito — pero si
prefieres dejarlo explícito por claridad, `{{ delinquentSince | apiDate:'dd/MM/yyyy' }}` es
equivalente y también válido).

## Lo que NO debes hacer

- No toques ningún otro archivo de `resident.luxuryapp` — el grep confirmó que esta es la única
  ocurrencia de `| date` en toda la app.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- No cambies la lógica de negocio de `propiedades-form.ts` más allá del import y (si aplica) el
  arreglo `imports` del componente.

## Verificación obligatoria

```bash
cd client/angular
npx ng build --configuration production 2>&1 | tail -n 40
```

Prueba manual (no automatizable sin un entorno corriendo, pero documenta el resultado si tienes
forma de verificarlo): abre el formulario de una propiedad marcada como morosa y confirma que la
fecha mostrada en "desde {fecha}" coincide con el valor real en base de datos, no un día antes.

## Criterio de PASO

- `propiedades-form.ts` importa `ApiDatePipe` (y conserva `DatePipe` solo si hay otro uso legítimo
  confirmado).
- `propiedades-form.html` usa `apiDate` en vez de `date` para `delinquentSince`.
- `ng build` sin errores nuevos.
- Ningún otro archivo tocado.

## Reporte de finalización

1. Diff exacto de los 2 archivos.
2. Confirmación explícita de si `DatePipe` se conservó o se quitó, y por qué.
3. Salida literal de `ng build`.
4. Decisiones que tomaste por tu cuenta y por qué (en particular la ruta de import — relativa vs.
   alias).

No avances a ningún otro ticket. Espera la auditoría.
