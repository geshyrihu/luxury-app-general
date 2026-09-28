# TICKET T-01b — Corrección: el job legado revive en cada arranque

Trabajas en el repositorio LuxuryApp. Este es un **ticket de corrección** de T-01, que quedó
aprobado salvo por este punto. Es pequeño: sólo se corrige un documento.

## Qué salió mal

El prompt de T-01 afirmaba que el job legado *"se activa desde base de datos"*. **Esa premisa era
incorrecta**, y tú lo detectaste bien en tu reporte de riesgos. La guía que escribiste
(`../../../docs/OperationsLuxuryApp/Tasks/20260820-changelog-operations-tasks-apagar-job.md`) heredó el error: dice cómo remover el
job desde las herramientas de Hangfire, pero **no advierte que vuelve solo**.

Verificado en código: `api/LuxuryApp.Api/Hangfire/HangfireExtensions.cs:34-49`
(`RegisterRecurringJobsAsync`) recorre el arreglo `HangfireJobCatalog.Jobs` y **re-registra todos
los jobs en cada arranque de la aplicación**, usando el cron por omisión declarado en código. El
almacenamiento de Hangfire sólo guarda el resultado de ese registro; no decide qué se activa.

Es decir: quien siga la guía tal como está va a borrar el job, verificar que desapareció, y
quedarse tranquilo. En el siguiente despliegue el job vuelve a correr, y **nadie se va a enterar**.
Ese es justamente el modo de falla que este módulo existe para eliminar.

## Tarea única

Archivo: `../../../docs/OperationsLuxuryApp/Tasks/20260820-changelog-operations-tasks-apagar-job.md`

Corrige la sección **"Como apagarlo"** para que refleje la realidad:

1. Advierte de forma destacada que borrar el job recurrente desde el panel de Hangfire es
   **temporal**: `RegisterRecurringJobsAsync` lo vuelve a registrar en el siguiente arranque.
   Cita la ruta y las líneas.
2. Distingue las dos formas reales de apagarlo, con su alcance:
   - **Temporal (operativo):** eliminar el recurring job desde el panel. Sirve para detenerlo hoy;
     **no sobrevive a un reinicio ni a un despliegue**.
   - **Definitivo (requiere código):** retirar la entrada del arreglo `HangfireJobCatalog.Jobs` y
     su `case` en el `switch` de `Schedule`. **Eso NO se hace en este ticket**: pertenece a T-15.
3. Corrige también la sección **"Donde vive la configuracion"**: la frase debe dejar claro que la
   **fuente de verdad es el código**, y que el almacenamiento de Hangfire es un reflejo, no el
   origen.
4. En **"Como revertirlo"**, aclara que si el apagado fue el temporal, revertir no requiere acción:
   basta con reiniciar la aplicación.

## Lo que NO debes hacer

- No modifiques `HangfireJobCatalog.cs` ni `RecurringTaskSchedulerJob.cs`. Eso es T-15.
- No toques `RecurringTaskGeneratorService.cs`: quedó aprobado tal como está.
- No cambies el archivo `.sql`.

## Convenciones aplicables

- Documento en español, UTF-8 sin mojibake
- Toda afirmación sobre el código con su `archivo:línea`

## Verificación obligatoria

Corre y pega la salida literal de:

```bash
node scripts/scan-mojibake.mjs docs/migraciones
```

## Criterio de PASO

Alguien que lea la guía sin conocer el sistema debe entender, sin ambigüedad, que **borrar el job
desde el panel no lo apaga de forma permanente**.

## Reporte de finalización

1. Archivos tocados
2. Salida literal del comando
3. Decisiones propias, si hubo
4. Lo que no hiciste y por qué
5. Riesgos detectados

No avances al siguiente ticket. Espera la auditoría.
