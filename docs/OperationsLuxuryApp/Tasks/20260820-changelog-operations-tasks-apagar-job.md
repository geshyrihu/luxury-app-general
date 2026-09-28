# Apagado del job legado de tareas recurrentes

## Clave a apagar

`generar-instancias-tareas-recurrentes-legado`

## Rutas verificadas en codigo

- Registro del catalogo: `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Catalog/HangfireJobCatalog.cs`
- Worker legacy: `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/RecurringTaskSchedulerJob.cs`
- Registro recurrente: `api/LuxuryApp.Api/Hangfire/HangfireExtensions.cs`
- Storage Hangfire: `api/LuxuryApp.Api/ServiceExtensions/DatabaseProviderServiceExtensions.cs`

## Donde vive la configuracion

La fuente de verdad de activacion es el codigo, no la base de datos. En `api/LuxuryApp.Api/Hangfire/HangfireExtensions.cs:34-49`, `RegisterRecurringJobsAsync()` recorre `HangfireJobCatalog.Jobs` y registra cada job con el cron declarado en codigo.

El almacenamiento de Hangfire es un reflejo operativo de ese registro, no el origen de la decision. Despues de registrado, Hangfire persiste el job recurrente en su storage configurado. En SQL Server, la tabla operativa esperada es `[HangFire].[Set]` con la llave `recurring-job:generar-instancias-tareas-recurrentes-legado`; el detalle del job queda asociado en `[HangFire].[Hash]`. Si el proveedor configurado es PostgreSQL, validar el esquema equivalente de Hangfire antes de ejecutar el cambio.

## Como apagarlo

Importante: borrar el recurring job desde el panel de Hangfire es temporal. En el siguiente arranque de la aplicacion, `RegisterRecurringJobsAsync()` lo vuelve a registrar porque recorre `HangfireJobCatalog.Jobs` (`api/LuxuryApp.Api/Hangfire/HangfireExtensions.cs:34-49`).

Apagado temporal (operativo):

1. Confirmar en el dashboard `/api/hangfire` que existe el job `generar-instancias-tareas-recurrentes-legado`.
2. Remover o desactivar el recurring job desde las herramientas operativas de Hangfire para esa clave.
3. Confirmar que la clave ya no aparece como job recurrente activo.
4. Usar este apagado solo para detenerlo hoy. No sobrevive a un reinicio ni a un despliegue.

Apagado definitivo (requiere codigo):

1. Retirar la entrada `generar-instancias-tareas-recurrentes-legado` del arreglo `HangfireJobCatalog.Jobs` (`api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Catalog/HangfireJobCatalog.cs:30`).
2. Retirar su `case` del `switch` de `Schedule` (`api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Catalog/HangfireJobCatalog.cs:100-102`).
3. No ejecutar este apagado en T-01b. Ese cambio corresponde a T-15.

## Como revertirlo

1. Si el apagado fue temporal, no se requiere accion manual: basta con reiniciar la aplicacion para que `RegisterRecurringJobsAsync()` lo registre de nuevo desde codigo (`api/LuxuryApp.Api/Hangfire/HangfireExtensions.cs:34-49`).
2. Si el apagado fue definitivo en T-15, revertir implica restaurar la entrada del arreglo `HangfireJobCatalog.Jobs` y su `case` en `Schedule`.
3. Confirmar en `/api/hangfire` que el job queda registrado nuevamente con la clave `generar-instancias-tareas-recurrentes-legado` y el cron vigente en catalogo: `10 0 * * *`.
4. Ejecutar una corrida controlada solo si Operaciones y Sistemas validan que el motor legacy puede correr sin generar folios invalidos.
