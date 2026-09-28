# TICKET T-08b — Corrección: se inyecta una ocurrencia que la RRULE no autoriza

Trabajas en el repositorio LuxuryApp. Este es un **ticket de corrección** de T-08, que quedó
aprobado salvo por este punto. Es de una línea a eliminar.

## Qué está mal

Archivo:
`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskGeneration/Services/RecurringTaskGenerationService.cs`,
método `GetOccurrences` (línea 144):

```csharp
occurrences.Add(startDate);
```

Esta línea agrega `template.StartDate` a la lista de ocurrencias **sin importar si la RRULE
realmente la produce**. Si la plantilla tiene una recurrencia semanal o mensual con día
restringido (`BYDAY`, `BYMONTHDAY`) y la fecha de inicio de la plantilla no cae en un día
permitido por esa regla, se genera una tarea extra en un día que el propio patrón configurado
prohíbe.

**Verificado de forma empírica, no por lectura de código.** Con
`RecurrenceRule = "FREQ=WEEKLY;BYDAY=MO"` (sólo lunes) y `StartDate` en miércoles:

- La librería `Ical.Net` (`calendar.GetOccurrences(...)`), **sin** la línea inyectada, devuelve
  correctamente sólo los lunes siguientes.
- **Con** la línea inyectada, el miércoles de `StartDate` se cuela como una ocurrencia adicional,
  aunque ningún miércoles es válido según `BYDAY=MO`.
- Cuando `StartDate` sí coincide con el patrón (por ejemplo, cae en lunes), el resultado es
  idéntico con o sin la línea — por eso el defecto no se nota en el caso común.

**Por qué las pruebas que ya existen no lo detectan:** los 6 tests en
`api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks/RecurringTaskGeneration/RecurringTaskGenerationServiceTests.cs`
usan todos `recurrenceRule: "FREQ=DAILY;INTERVAL=1"` (el valor por omisión del helper
`CreateTemplate`) — una recurrencia diaria no tiene restricción de día, así que `StartDate`
**siempre** coincide con el patrón en esos casos. Ningún test ejercita una RRULE semanal o mensual
con `StartDate` desalineado.

**Por qué esto puede ocurrir en la práctica, no es un caso de laboratorio:** el servicio de
catálogo (T-04) valida que la `RecurrenceRule` sea sintácticamente válida, pero **no valida que
`StartDate` coincida con el patrón**. Un usuario puede perfectamente elegir "cada lunes" y dejar
la fecha de inicio en el día en que está capturando la plantilla, que rara vez será lunes.

## Tarea

### 1. Eliminar la línea

Quita `occurrences.Add(startDate);` de `GetOccurrences`. La librería ya calcula correctamente las
ocurrencias válidas a partir de `calendarEvent.Start` — no hace falta ningún reemplazo ni lógica
adicional.

### 2. Agregar la prueba que faltaba

En `RecurringTaskGenerationServiceTests.cs`, agrega un test que reproduzca exactamente el caso
que expuso el defecto: una plantilla con `RecurrenceRule = "FREQ=WEEKLY;BYDAY=MO"` y `StartDate`
en un día que **no** sea lunes (por ejemplo, miércoles), y verifica que la única `Tasks` generada
caiga en lunes, no en la fecha de inicio.

Puedes probar el método estático `RecurringTaskGenerationService.GetOccurrences` directamente
(es `public static`), sin necesidad de pasar por todo el flujo de `GenerateAsync`, si eso hace la
prueba más simple y directa.

## Lo que NO debes hacer

- No toques `AdjustForBusinessDay`, `ResolvePrincipalResponsibleAsync`, `CreateTaskAsync`,
  `NotifyRunIssuesAsync` ni ningún otro método — ya están aprobados.
- No cambies el horizonte de generación, la lógica de festivos, ni la resolución de responsable.
- No agregues validación de alineación `StartDate`/`RecurrenceRule` al servicio de catálogo
  (T-04) en este ticket — sería deseable, pero es un cambio de alcance distinto; repórtalo como
  riesgo en tu entrega si quieres dejarlo anotado, no lo implementes aquí.
- No toques ningún otro archivo.

## Convenciones aplicables

- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

Corre y **pega la salida literal** de:

```bash
dotnet build api/LuxuryApp.sln
dotnet test api/LuxuryApp.Tests/LuxuryApp.Tests.csproj --filter RecurringTaskGenerationServiceTests --no-restore
node scripts/scan-mojibake.mjs api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskGeneration api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks
```

Criterio de éxito: compila sin errores, **todos** los tests pasan (los 6 anteriores más el
nuevo), cero mojibake.

## Criterio de PASO del ticket

El nuevo test falla si alguien reintroduce la línea eliminada, y pasa con la corrección aplicada.

## Reporte de finalización

1. Línea eliminada y test agregado
2. Salida literal de los tres comandos, incluido el conteo de tests (debe ser 7, no 6)
3. Confirmación de que ningún otro método se tocó

No avances al siguiente ticket. Espera la auditoría.
