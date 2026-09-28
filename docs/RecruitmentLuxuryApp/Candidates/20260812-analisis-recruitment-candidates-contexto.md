# Contexto de Retome - Candidates

**Fecha de corte:** 2026-08-12
**Referencia operativa reportada por usuario:** 2026-08-11 18:52 hrs
**Módulo:** `ReclutamientoLuxuryApp/Candidates`

## Objetivo inmediato

Continuar la remediación del módulo de candidatos/postulaciones/entrevistas, con foco en la mezcla incorrecta entre:

- `candidateApplicationId` (postulación legacy)
- `candidateProcessId` (núcleo `CandidateProcess`)

El bug principal ocurre en flujos de agenda, respuesta de entrevista, cola de entrevistador y navegación desde links/notificaciones.

## Problema activo más reciente

El usuario reportó este error al usar el modal **"Asignar entrevistador"** desde la pantalla de detalle del puesto:

```text
[18:50:01 ERR] Excepción no controlada: La postulacion con ID 019ff30a-7e5a-7185-9806-9e0fe25b6804 no fue encontrada.
LuxuryApp.Shared.Extensions.BusinessException: La postulacion con ID 019ff30a-7e5a-7185-9806-9e0fe25b6804 no fue encontrada.
at LuxuryApp.Application.Services.CandidateApplicationAppService.ScheduleRecruitmentInterviewAsync(Guid id, ScheduleRecruitmentInterviewRequest request)
```

Ese error salía porque el modal estaba llamando el endpoint legacy de postulación con un `processId`.

## Estado actual de la remediación

### Frontend ya ajustado

Se hicieron cambios para propagar y preferir `candidateProcessId` cuando exista:

- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/interfaces/candidate-interview.ts`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-feedback-form.ts`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-response.ts`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interviewer-queue/interfaces/candidate-interviewer-queue.interface.ts`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interviewer-queue/candidate-interviewer-queue.service.ts`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interviewer-queue/candidate-interviewer-queue.ts`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interviewer-queue/candidate-interviewer-queue.html`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-recruitment-interviews/candidate-recruitment-interviews.interface.ts`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-recruitment-interviews/candidate-recruitment-schedule-modal.ts`

### Backend ya ajustado

Se endurecieron servicios para resolver correctamente `legacy application id` desde `CandidateProcess`, y para tolerar `processId` incluso entrando por endpoints legacy:

- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateApplication/Services/CandidateApplicationAppService.cs`
- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateProcess/Services/CandidateProcessAppService.cs`
- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/Services/CandidateInterviewAppService.cs`
- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Notifications/Services/CandidateNotificationCoordinatorService.cs`

## Qué cambios conceptuales ya quedaron

1. `GetInterviewResponseAsync` ya no debe publicar `process.Id` como `CandidateApplicationId` cuando se puede resolver la postulación real.
2. Cola de entrevistador y vistas derivadas ya aceptan `candidateProcessId`.
3. Links de notificación ya quedaron orientados a `candidateProcessId` como fuente principal.
4. `ScheduleRecruitmentInterviewAsync` y `CancelRecruitmentInterviewAsync` ahora toleran que entre un `processId` por el endpoint legacy.
5. El modal `candidate-recruitment-schedule-modal` ahora usa `candidateProcessId || candidateApplicationId` como target de agenda.

## Validaciones ya ejecutadas

### Frontend

```text
node .\client\angular\node_modules\typescript\bin\tsc -p .\client\angular\tsconfig.app.json --noEmit
Resultado: OK
```

### Backend

```text
dotnet build D:\repos\luxuryapp-api\api\LuxuryApp.Application\LuxuryApp.Application.csproj
Resultado: OK (0 errores, warnings preexistentes)
```

### Encoding

```text
node .\scripts\scan-mojibake.mjs ...
Resultado: CERO mojibake
```

## Lo que falta validar manualmente

1. Reprobar el modal **"Asignar entrevistador"** desde:
   - detalle del puesto
   - board de entrevistas
   - cualquier acceso desde notificación/link profundo
2. Verificar que el request ya no mande `processId` a un flujo que espere estrictamente postulación.
3. Si el error persiste, capturar:
   - URL exacta
   - payload exacto
   - endpoint exacto invocado
   - valor de `candidateApplicationId`
   - valor de `candidateProcessId`
4. Revisar si existe otro flujo no tocado que siga usando `candidateApplicationId = process.Id`.

## Hipótesis si vuelve a fallar

Si el mismo error reaparece después de estos cambios, las posibilidades más probables son:

1. El frontend que se está probando no está corriendo con los cambios más recientes.
2. Hay otro modal/componente diferente al que ya se corrigió.
3. Existe un request cacheado o un link profundo viejo con query params obsoletos.
4. Hay otro endpoint legacy que todavía resuelve primero por `CandidateApplication` sin fallback a `CandidateProcess`.

## Archivos clave a revisar primero en una nueva sesión

### Frontend

- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-recruitment-interviews/candidate-recruitment-schedule-modal.ts`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-work-position-candidates/candidate-work-position-candidates.ts`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-recruitment-interviews/candidate-recruitment-interviews.service.ts`
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-response.ts`

### Backend

- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateApplication/Services/CandidateApplicationAppService.cs`
- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateProcess/Services/CandidateProcessAppService.cs`
- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateInterview/Services/CandidateInterviewAppService.cs`
- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Notifications/Services/CandidateNotificationCoordinatorService.cs`

## Mensaje sugerido para abrir una sesión nueva

Pegar este mensaje:

```text
Retomemos el módulo Candidates desde el archivo:
D:\repos\luxuryapp-api\docs\implementation-control\20260812-contexto-candidates-retomar.md

Lee ese archivo primero, luego audita el estado actual de los archivos mencionados allí y continúa con la validación/remediación del bug de mezcla entre candidateApplicationId y candidateProcessId, empezando por el flujo del modal "Asignar entrevistador".
No repitas trabajo ya aplicado; verifica primero si el frontend y backend en ejecución corresponden a esos cambios.
```

## Nota importante

Cuando se retome:

- usar fechas absolutas, no relativas
- asumir como referencia reportada por usuario: `2026-08-11 18:52 hrs`
- asumir como fecha de sistema del agente: `2026-08-12`
- antes de editar, releer `CONVENTIONS.md` y las guías aplicables de backend/frontend
