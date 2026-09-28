# TICKET T-09c — Corrección: la bitácora registra un canal que no es el que se envió

Trabajas en el repositorio LuxuryApp. Este es un **ticket de corrección** de T-09b, aprobado
salvo por este punto, que el propio ejecutor de T-09b señaló como riesgo en su reporte.

## Qué está mal

Archivo:
`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskAlerting/Services/TaskAlertEngineService.cs`,
método `SendAlertAsync`.

El despacho real va a tres canales (`TaskChannels` = `InApp`, `Push`, `PushWeb`), pero la bitácora
sólo escribe **una** fila con `Channel = NotificationChannel.InApp` fijo, sin importar qué canales
se enviaron de verdad:

```csharp
dbContext.TaskAlertLog.Add(new TaskAlertLog
{
    ...
    Channel = NotificationChannel.InApp,   // <- fijo, no refleja el envío real
    ...
});
```

Esto contradice el propósito de la tabla (`RN-ALT-028`): la bitácora debe decir **por qué canal**
se alertó. Hoy, si alguien revisa `TaskAlertLog` para saber si una alerta llegó por Push, no lo
puede saber — todo aparece como `InApp`, incluidas las que en realidad fueron por Push o PushWeb.

## Tarea

### 1. Una fila de bitácora por canal, no una fila fija

En `SendAlertAsync`, después del despacho (que **sigue siendo una sola llamada** a
`DispatchAsync` con los tres canales — no dividas la llamada en tres), registra **una fila de
`TaskAlertLog` por cada canal en `TaskChannels`**, todas con el mismo `AlertType`, `Delivered`,
`SentAt`, `RecipientUserId` y `TasksId` — sólo el `Channel` cambia entre ellas.

`Delivered` sigue significando lo mismo que en T-09b: si `DispatchAsync` no lanzó excepción, las
tres filas quedan con `Delivered = true`; si lanzó, las tres quedan con `Delivered = false`. El
dispatcher no da información por canal individual, así que no inventes una granularidad que no
existe — las tres filas comparten el mismo resultado porque es lo único que se sabe.

### 2. El conteo de la corrida no cambia

`TaskAlertEngineRunResult` (`AvisosPreviosSent`, `RecordatoriosSent`, `VencidasDetected`,
`Failed`) sigue contando **por tarea**, no por canal. Una tarea que recibe un aviso previo sigue
sumando 1 a `AvisosPreviosSent`, aunque ahora eso produzca 3 filas en la bitácora en vez de 1. No
toques `MutableRunResult.Count`.

### 3. Actualiza las pruebas existentes

Varias de las 6 pruebas de
`api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskAlerting/TaskAlertEngineServiceTests.cs`
asumen **una** fila de bitácora por evento de alerta, y van a fallar con el cambio:

- `RunAsync_WhenTaskIsInsideAdvanceNoticeWindow_SendsAvisoPrevio` usa
  `dbContext.TaskAlertLog.Single()` — ahora hay 3 filas. Cambia la aserción para verificar que
  hay exactamente 3, todas `AlertType == AvisoPrevio`, `Delivered == true`, y que los 3 canales de
  `TaskChannels` están representados (uno cada uno, sin repetidos).
- `RunAsync_WhenTaskAlreadyAlertedLessThanTwentyFourHoursAgo_DoesNotSendAgain` verifica
  `dbContext.TaskAlertLog.Count().Should().Be(1)` tras el primer envío — ahora debe ser `3`.
- `RunAsync_WhenTaskIsOverdueWithoutVencidaLog_SendsVencidaOnce` usa `.Single()` — mismo ajuste
  que el primer caso, con `AlertType == Vencida`.
- `RunAsync_WhenTaskIsOverdueWithExistingVencidaLog_SendsRecordatorio` cuenta
  `AlertType == Recordatorio` esperando `1` — ahora debe esperar `3` (nota: el `Vencida` previo
  que el test inserta a mano en el `Arrange` sigue siendo 1 sola fila, porque la insertas
  directamente en el test, no a través del servicio — no la toques).
- `RunAsync_WhenOneDispatchFails_ContinuesAndLogsFailedAttempt` usa `.Single(x => x.TasksId == ...)`
  para cada tarea — ahora son 3 filas por tarea. Ajusta a verificar que las 3 de la tarea fallida
  tienen `Delivered == false` y las 3 de la exitosa tienen `Delivered == true`.

No elimines cobertura al ajustar estas aserciones — cada una debe seguir probando exactamente lo
mismo que probaba antes, sólo adaptada al número de filas correcto.

## Lo que NO debes hacer

- No dividas la llamada a `DispatchAsync` en una por canal — sigue siendo una sola llamada con los
  tres canales, como en T-08 y T-09b.
- No agregues una columna nueva a `TaskAlertLog` para "canales enviados" como lista — el diseño ya
  aprobado es una fila por canal, no una fila con una lista serializada.
- No toques `ResolveAlertTypeAsync`, el throttle de 24 horas, ni ninguna otra lógica de decisión
  de tipo de alerta.
- No toques T-08, T-08c, T-09 (esquema), ni el catálogo.

## Convenciones aplicables

- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
dotnet test api/LuxuryApp.Tests/LuxuryApp.Tests.csproj --filter TaskAlertEngineServiceTests --no-restore
node scripts/scan-mojibake.mjs api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskAlerting api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskAlerting
```

Los 6 tests deben seguir pasando, con sus aserciones de conteo de bitácora ajustadas.

## Criterio de PASO del ticket

Una alerta enviada exitosamente produce 3 filas en `TaskAlertLog`, una por cada canal de
`TaskChannels`, ninguna con `Channel` repetido ni distinto de los tres esperados.

## Reporte de finalización

1. Qué cambió en `SendAlertAsync`, con el fragmento antes/después
2. Qué pruebas se ajustaron y cómo
3. Salida literal de los tres comandos
4. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
