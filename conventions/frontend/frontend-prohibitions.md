# Frontend Prohibitions

**Ultima revision:** 2026-07-29

## Prohibiciones

- No usar vias rapidas fuera del estandar oficial.
- No modificar shared frontend sin aprobacion.
- No duplicar componentes shared.
- No bypass al design system.
- No reubicar features existentes por iniciativa propia.
  Para tablas usar `<app-table>` (`appsweb/angular/src/app/shared/ui/web/table/table.ts`): soporta orden, agrupación, reordenar filas/columnas, selección múltiple y columnas congeladas. Detalle de la migración y decisiones de diseño: `docs/migration-template/04-bitacora-cambios.md`.
- No usar `any` productivo en flujos principales del modulo cuando corresponde
  tipado explicito.
- No usar `new Date(...)`, `formatDate` de `@angular/common`, ni `| date` (DatePipe
  nativo) directamente sobre campos que vienen del API en componentes de feature. Los
  DTOs no distinguen en tiempo de compilación si un campo `string`/`Date` es un
  `DateOnly` o un `DateTime` del backend — parsear a mano arriesga el bug de "un día
   menos" en campos `DateOnly` (ver informe
   `docs/SharedLuxuryApp/FechasHoras/20260826-auditoria-shared-fechas-horas.md`
   §3.3). Usa el pipe `apiDate` (`shared/pipes/api-date.pipe.ts`), que ya resuelve la
  ambigüedad vía `DateService.parseDate()`.
- Espejo en escritura: no enviar el `Date` crudo de un `FormControl`/datepicker directo
  en un `transformPayload`/`onSubmit` (ni completo vía `this.form.getRawValue()` sin
  tratar sus campos de fecha). Formatéalo primero con `DateService.getDateFormat(value)`
  — mismo riesgo de desfase de día que la regla de lectura, en dirección contraria (caso
   real: FH-2Xb, `docs/SharedLuxuryApp/FechasHoras/20260826-plan-shared-fechas-horas.md`).

## Validación en auditoría (fechas)

```bash
grep -rn "| date\b" appsweb/angular/src/app/modules --include="*.html" --include="*.ts"
# Esperado: 0 resultados reales (ignorar falsos positivos como "dates || dates")

grep -rn "getRawValue()" appsweb/angular/src/app/modules --include="*.ts" -A2 | grep -B2 "transformPayload"
# Revisar manualmente: todo transformPayload que envíe un campo de fecha debe pasar por getDateFormat
```

**Impacto auditoría:** hallazgo CRÍTICO si hay `| date` directo sobre un campo del API, o un `transformPayload`/`onSubmit` que envíe un `Date` sin formatear. La regla de backend (tipo de columna y reloj del servidor) vive en [Backend Rules](../backend/backend-rules.md).
