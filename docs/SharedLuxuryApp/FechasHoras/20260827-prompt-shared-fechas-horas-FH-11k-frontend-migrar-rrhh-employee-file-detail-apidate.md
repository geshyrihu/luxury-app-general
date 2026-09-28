# TICKET FH-11k — Frontend: migrar `employee-file-detail.html` al pipe `apiDate`

Trabajas en el repositorio LuxuryApp (Angular 22, `client/angular/`). Sigue el mismo patrón que
`FH-11a`-`FH-11j` (ya cerrados y aprobados). Este ticket cubre **un solo archivo**,
`expediente-del-empleado/recursos-humanos/employee-file/employee-file-detail.html`, del app
`recursos-humanos.luxuryapp` — pero tiene **25 ocurrencias** de `| date` (es el expediente completo
del empleado, con secciones de datos personales, contratos, incidentes, sanciones, evaluaciones,
solicitudes, etc., cada una renderizando un tipo de registro distinto). Es el primero de varios
tickets para terminar `recursos-humanos.luxuryapp` (30 archivos, 91 ocurrencias en total — el resto
se cubre en tickets posteriores, agrupados por módulo).

**Hallazgo aparte, sin relación con este ticket — NO lo toques:** la plantilla usa `{{ eval.finalScore
| number:'1.1-1' }}` y `{{ eval.finalScore | number:'1.0-2' }}` (líneas ~1257 y ~1563), pero
`DecimalPipe` nunca se importa en `employee-file-detail.ts` (solo `DatePipe`, `CurrencyPipe`). Es el
mismo tipo de bug preexistente que ya se reportó en FH-11g (`| json`/`| slice` sin importar). No lo
arregles, solo repórtalo en el reporte de finalización.

## Tarea única

`employee-file-detail.ts`: `import { CurrencyPipe, DatePipe } from "@angular/common";` — quita solo
`DatePipe`, agrega `ApiDatePipe`, **conserva `CurrencyPipe`** (usado en `| currency`, 6 puntos de la
plantilla).

`employee-file-detail.html` — reemplaza **todas** las 25 ocurrencias de `| date` por `| apiDate`,
conservando el mismo string de formato en cada una, y **quitando el tercer parámetro `:'UTC'`**
donde aparezca (2 casos: `pd.birth` y `pd.dateAdmission`). La tabla siguiente lista las 25
ocurrencias con su campo y formato — búscalas por contenido (varias están envueltas en 2-3 líneas
por el formateo automático de Prettier, no dependas del número de línea):

| # | Campo | Formato | Nota |
|---|---|---|---|
| 1 | `header()!.dateAdmission` | `'dd/MM/yyyy'` | |
| 2 | `pd.birth` | `'dd/MM/yyyy'` | quitar `:'UTC'` |
| 3 | `pd.dateAdmission` | `'dd/MM/yyyy'` | quitar `:'UTC'` |
| 4 | `c.startDate` | `'dd/MM/yyyy'` | |
| 5 | `c.endDate` | `'dd/MM/yyyy'` | dentro de `? ... : 'Indeterminado'` |
| 6 | `c.signedAt` | `'dd/MM/yyyy HH:mm'` | |
| 7 | `item.startDate` | `'dd/MM/yyyy'` | (sección de contratos) |
| 8 | `item.endDate` | `'dd/MM/yyyy'` | dentro de `? ... : 'Indeterminado'` (misma sección que #7) |
| 9 | `item.executionDate` | `'dd/MM/yyyy'` | |
| 10 | `item.startDate` | `'dd/MM/yyyy'` | (otra sección, distinta de #7) |
| 11 | `item.endDate` | `'dd/MM/yyyy'` | (misma sección que #10) |
| 12 | `item.requestDate` | `'dd/MM/yyyy'` | (misma sección que #10-11) |
| 13 | `item.startDate` | `'dd/MM/yyyy'` | (otra sección más, distinta de #7 y #10) |
| 14 | `item.endDate` | `'dd/MM/yyyy'` | (misma sección que #13) |
| 15 | `item.requestDate` | `'dd/MM/yyyy'` | (misma sección que #13-14) |
| 16 | `item.incidentDateTime` | `'dd/MM/yyyy HH:mm'` | |
| 17 | `item.sanction.effectiveStartDate` | `'dd/MM/yyyy'` | |
| 18 | `eval.evaluationDate` | `'dd/MM/yyyy'` | quitar `:'UTC'` (esta ocurrencia sí lo tenía) |
| 19 | `r.requestDate` | `'dd/MM/yyyy'` | |
| 20 | `r.executionDate` | `'dd/MM/yyyy'` | dentro de `? ... : 'Pendiente'` |
| 21 | `d.legalAuthorizationDate` | `'dd/MM/yyyy'` | |
| 22 | `d.payrollAuthorizationDate` | `'dd/MM/yyyy'` | |
| 23 | `d.lastDayOfWork` | `'dd/MM/yyyy'` | |
| 24 | `acta.incidentDateTime` | `'dd/MM/yyyy'` | |
| 25 | `eval.evaluationDate` | `'dd/MM/yyyy'` | **sin** `:'UTC'` (distinta ocurrencia de #18, mismo campo pero en otra sección — verifica que no las confundas al buscar) |

Nota sobre `'é'`/`'—'`: varios `?:` en este archivo usan `'é'` como valor de respaldo (probablemente
debía ser `'—'`, un guion largo corrompido — mismo tipo de mojibake ya visto en otros módulos). No
lo toques, no es parte de este ticket.

## Lo que NO debes hacer

- No toques `CurrencyPipe` ni ningún `| currency`.
- No arregles el `| number` sin `DecimalPipe` importado — repórtalo, no lo toques.
- No toques los textos `'é'`/`'Indeterminado'`/`'Pendiente'` de respaldo en los operadores `?:`.
- No toques ningún otro archivo — el resto de `recursos-humanos.luxuryapp` son tickets aparte.
- No toques `DateService`, `ApiDatePipe`, ni ningún archivo de `shared/pipes/`.
- Verifica la ruta relativa de import antes de darla por buena.

## Verificación obligatoria

```bash
cd client/angular
perl -0777 -ne 'while (/\{\{[^}]*?\|\s*date\b[^}]*?\}\}/gs) { print "$&\n---\n" }' src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/employee-file/employee-file-detail.html
# Resultado esperado: sin salida (0 residuales)

grep -c "| apiDate" src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/employee-file/employee-file-detail.html
# (referencia — puede no coincidir exacto con 25 si alguna quedó envuelta entre líneas; usa el
# comando de arriba como fuente de verdad, no este conteo simple)

grep -n "'UTC'" src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/employee-file/employee-file-detail.html
# Resultado esperado: 0 líneas

npx ng build --configuration production 2>&1 | tail -n 40
```

## Criterio de PASO

- Las 25 ocurrencias migradas a `apiDate`, mismo formato, los 2 workarounds `:'UTC'` eliminados.
- `CurrencyPipe` intacto.
- El hallazgo de `| number` sin `DecimalPipe` reportado, no tocado.
- `ng build` sin errores nuevos.
- Ningún otro archivo tocado.

## Reporte de finalización

1. Diff exacto de `employee-file-detail.ts` y `.html`.
2. Confirmación del hallazgo de `DecimalPipe` faltante (aunque no lo toques).
3. Salida literal de los comandos de verificación y de `ng build`.
4. Decisiones que tomaste por tu cuenta y por qué.

No avances a ningún otro ticket. Espera la auditoría.
