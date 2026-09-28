# TICKET T-08c — Corrección: el horizonte de generación debe cubrir el aviso previo de cada plantilla

Trabajas en el repositorio LuxuryApp. Este es un **ticket de corrección** de T-08, aprobado salvo
por este punto. No lo detectó una revisión de T-08 en su momento — salió al diseñar T-09b (el
motor de alertas), que depende de que exista una tarea para poder registrar un aviso sobre ella.

## Qué está mal

Archivo:
`api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskGeneration/Services/RecurringTaskGenerationService.cs`

`GenerateAsync` usa un horizonte **fijo de 7 días** (`GenerationHorizonDays`) para todas las
plantillas por igual. Pero `RecurringTaskTemplate.AdvanceNoticeDays` es configurable de 0 a 30 —
una plantilla puede pedir que se avise con 20 días de anticipación.

`TaskAlertLog.TasksId` (T-09, ya aprobado) es una foreign key **obligatoria**: no se puede
registrar un aviso sin una tarea real a la cual asociarlo. Con el horizonte fijo de 7 días, una
plantilla con `AdvanceNoticeDays = 20` no tendría ninguna tarea generada hasta 13 días después de
que debería haber empezado a recibir avisos. Es exactamente el defecto que dio origen a este
módulo: algo que parece configurado y en la práctica no funciona.

El propio plan (`../../../docs/HumanResourcesLuxuryApp/HrPolicyEngine/20260902-plan-hr-policy-engine.md`, fila `RT-01`) ya lo anticipaba:
*"Horizonte ≥ 35 días **y** aviso calculado desde la plantilla (A5)"* — las dos cosas juntas, no
una en lugar de la otra. T-08 sólo implementó la segunda parte.

## Tarea

Cambia el horizonte de **fijo** a **por plantilla**, usando el mayor entre 7 días y el
`AdvanceNoticeDays` de cada una. No es un cambio de arquitectura: es sustituir un valor uniforme
por uno calculado dentro del bucle existente.

### 1. `GenerateAsync`

El horizonte más amplio posible (necesario para acotar la búsqueda de festivos, que se calcula
una sola vez al inicio) es `hoy + 30` (el máximo de `AdvanceNoticeDays` según su `[Range(0, 30)]`
en la entidad) — no `hoy + 7`. Ajusta el cálculo de `holidays` para cubrir ese rango máximo, una
sola vez, igual que hoy.

### 2. `ProcessTemplateAsync`

El horizonte que se usa para calcular las ocurrencias de **esta** plantilla debe ser
`hoy + Math.Max(7, template.AdvanceNoticeDays)`, no el horizonte global. Ajusta la firma o el
cuerpo del método según haga falta para calcular esto por plantilla en vez de recibir un
`horizonEnd` uniforme desde `GenerateAsync`.

**No cambies** la lógica de: idempotencia, festivos, responsable determinista, creación de la
tarea, ni el reporte de corrida — sólo el cálculo del horizonte.

## Lo que NO debes hacer

- No toques `TaskAlertLog`, su migración, ni ningún archivo de T-09.
- No implementes el motor de alertas — eso sigue siendo T-09b, el ticket siguiente.
- No cambies `GenerationHorizonDays` a un valor fijo distinto de 7 — sigue siendo el mínimo; lo
  que cambia es que ahora puede ampliarse por plantilla.
- No toques los tests que no dependan directamente de este cambio; si alguno de los 7 existentes
  falla por el cambio de firma, corrígelo para que siga probando lo mismo que probaba, sin
  eliminar cobertura.

## Convenciones aplicables

- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
dotnet test api/LuxuryApp.Tests/LuxuryApp.Tests.csproj --filter RecurringTaskGenerationServiceTests --no-restore
node scripts/scan-mojibake.mjs api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/RecurringTaskGeneration api/LuxuryApp.Tests/Application/Modules/OperationsLuxuryApp/Tasks
```

Pega la salida literal de los tres. Los 7 tests existentes deben seguir pasando.

## Criterio de PASO del ticket

Agrega un test que confirme que una plantilla con `AdvanceNoticeDays = 20` genera una tarea para
una ocurrencia a 15 días de hoy, cosa que con el horizonte fijo anterior no habría pasado (el
límite era 7 días). Y que una plantilla con `AdvanceNoticeDays = 3` (o el valor por omisión) sigue
sin generar más allá de 7 días — el mínimo no debe encogerse.

## Reporte de finalización

1. Qué cambió exactamente, con el fragmento de código antes/después de `GenerateAsync` y
   `ProcessTemplateAsync`
2. Salida literal de los tres comandos, con el conteo de tests (¿sigue en 7, o subió por el nuevo?)
3. Decisiones que tomaste por tu cuenta y por qué
4. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
