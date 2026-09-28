# Handoff: Alta de empleado (formulario grandote) — para retomar en otra sesión/agente

> Este documento es el punto de entrada para continuar el trabajo sin releer la conversación
> completa. Complementa (no reemplaza) el detalle cronológico ya registrado en
> `docs/plans/20260815-candidates-refactor-v3-plan.md`, puntos 12 y 13 (esta sesión agregó ahí
> las entradas "Hotfixes post-cierre" de todo lo hecho).

## Qué se hizo (resumen ejecutivo)

Se reemplazó `EmployeeProviderForm` (formulario del dominio Proveedor/ExternalStaff, mal
reutilizado para altas internas) por `CandidateProcessHiringModal` ("el formulario grandote") como
**único** flujo de alta de empleado, cubriendo dos casos:

1. **Con candidato aprobado** (`candidateId` conocido) — precarga automática de 5 campos básicos.
2. **Alta directa sin candidato** — nuevo backend `ProcessDirectHiringAsync` +
   endpoint `POST recruitment-candidate-processes/direct-hire/{requestPositionId}`, con detección
   automática de si hay un candidato `Seleccionado` ligado a la vacante (botón "Importar datos de
   candidato aprobado" solo aparece si existe).

Además, el formulario se rediseñó para calcar el "FORMATO DE ALTA DEL TRABAJADOR" físico que la
empresa usa hoy en papel (foto proporcionada por el usuario), agregando campos que faltaban
(Estado Civil, Nivel de Educación, CP del RFC, crédito INFONAVIT) y corrigiendo dos bugs reales
encontrados en vivo:

- **`BusinessException: "No se encontro el banco 'X'"`** — el campo Banco era texto libre con
  *fuzzy match* contra la tabla `Bank`. Ahora es un select real contra el catálogo
  (`Endpoints.SelectItems.bank`).
- **Bug de framework en el stepper (`lx-stepper`/`Wizard`)**: los pasos 1-5 se veían vacíos.
  Causa: `<ng-content [select]="...">` con selector dinámico dentro de un `@for` — Angular no
  soporta `select` dinámico en `ng-content`. Corregido con una directiva nueva
  (`StepperStepSection`, `@ui/base/stepper-step-section.directive.ts`) que `StepperBase` consulta
  vía `@ContentChildren` para mostrar/ocultar cada `<section step="N">` según el paso activo. Este
  bug era preexistente (no introducido en esta sesión) — nunca se había detectado porque
  `CandidateProcessHiringModal` era el único consumidor real de `<lx-stepper>` en todo el repo, y
  nunca se había probado en navegador hasta ahora.

## Estado actual (verificar al retomar)

- El backend estaba corriendo (PID visto por última vez: 122516, arrancado ~13:55) y ya existe
  `api/LuxuryApp.Infrastructure.Data/Data/Migrations/20260817191655_RefactorCandidatoV3.cs`
  (generada por el usuario, incluye `HasInfonavitCredit`, `InfonavitCreditNumber`,
  `InfonavitDiscountFactor`, `RfcPostalCode` en `PersonData`). **No se confirmó si ya se aplicó a
  la base de datos real** — el usuario dijo que él se encargaría de crear y aplicar la migración;
  confirmar con él antes de asumir que el esquema ya está actualizado.
- **Todo el código (backend + frontend) está implementado y compila/testea limpio**, pero
  **nada de esto se verificó en navegador todavía**. Es el siguiente paso obligatorio.

## Siguiente paso inmediato: verificación en navegador

Usar el skill `playwright-cli` (login `admin`/`Hwtc00--`, tenant "AVIVIA 58" via el selector
arriba a la izquierda, descartar el popup de OneSignal con "Later" antes de interactuar).

1. **Staff Board** (`/directory/staff`) → botón "Registrar nuevo empleado" (icono person-add)
   sobre un puesto vacante:
   - Si esa vacante tiene un candidato en etapa `Seleccionado` → debe aparecer el banner
     "Candidato aprobado detectado" con botón "Importar datos de candidato aprobado" → al usarlo,
     confirmar con SweetAlert y precargar solo nombre/apellido/correo/teléfono/fecha nacimiento.
   - Si no hay candidato aprobado → el banner NO debe aparecer; llenar todo a mano debe funcionar
     y cerrar la vacante (`RequestPosition.Status = Concluido`) al finalizar.
   - Verificar que los 6 pasos del stepper muestran sus campos (el bug de `ng-content` ya
     verificado una vez con Empresa/Puesto pero no con el flujo completo hasta el final).
   - Verificar el select de Banco (ya no debe poder escribirse libre, debe ser catálogo real).
   - Verificar las máscaras de teléfono `(00) 0000-0000` en los 3 campos de teléfono.
   - Verificar Estado Civil, Nivel de Educación, CP del RFC (máscara `00000`), y el toggle de
     INFONAVIT + sus 2 campos condicionales (máscara `0000000000` en No. de Crédito).
2. **`/directory/employee-interviewer-queue`** o donde viva `candidate-recruitment-interviews.ts`
   → botón "Proceder a Alta" sobre un candidato `Seleccionado`/`AltaEnProceso` → debe abrir el
   formulario grandote con `candidateId` ya conocido, precargando los 5 campos básicos sin pedir
   confirmación (a diferencia del caso 1, aquí ya se sabe qué candidato es).
3. Confirmar que el envío completo (los 6 pasos) efectivamente crea el `Employee`,
   `ApplicationUser`, `PersonData` (con los campos nuevos), `EmployeeBankData` (con el `BankId`
   real), `EmployeeEmergencyContact` (beneficiario + contacto de emergencia), y dispara
   `OnSolicitudAltaAsync` sin error.
4. Si algo falla por el motivo de siempre (backend con build viejo bloqueado por el proceso
   corriendo) — ver sección "Gotchas" abajo antes de asumir que es un bug de código.

## Archivos tocados esta sesión (para ubicarse rápido)

### Backend
- `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/CandidateProcess/Services/CandidateProcessAppService.cs`
  — el más grande: `ProcessHiringAsync`, `ProcessDirectHiringAsync` (nuevo),
  `ResolveOrCreateEmployeeIdAsync`, `BuildRequestEmployeeRegisterDto` (ahora async),
  `GetByRequestPositionAsync`, `CloseSiblingCandidateProcessesAsync`. `ResolveBankIdAsync` fue
  **eliminado** (causaba el bug del banco).
- `.../CandidateProcess/Interfaces/ICandidateProcessAppService.cs` — agregado
  `ProcessDirectHiringAsync`.
- `.../CandidateProcess/EndPoints/CandidateProcessEndPoint.cs` — nuevo endpoint `direct-hire`.
- `.../CandidateProcess/DTOs/CandidateApplicationProcessHiringDto.cs` — campos nuevos
  (`Email`, `RfcPostalCode`, `MaritalStatus`, `EducationLevel`, `HasInfonavitCredit`,
  `InfonavitCreditNumber`, `InfonavitDiscountFactor`, `BankId` en vez de `BankName`); quitado
  `RecruitmentSource` (ya no se pide en este formulario, se hereda de `Candidate`).
- `.../CandidateProcess/DTOs/CandidateProcessVacancyDetailDto.cs` — agregado `SueldoBase`,
  `TurnoTrabajo` (para el panel "Contexto de la vacante").
- `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Hr/ExpedientedelEmpleado/PersonData.cs`
  — columnas nuevas (`RfcPostalCode`, `MaritalStatus` ya existía, `HasInfonavitCredit`,
  `InfonavitCreditNumber`, `InfonavitDiscountFactor`).
- `api/LuxuryApp.Tests/Application/Modules/ReclutamientoLuxuryApp/Candidates/CandidateProcessSmokeTests.cs`
  — 3 tests nuevos agregados esta sesión (`CreateFromFormAsync_ConFechaYEntrevistador_...`,
  `ScheduleAsync_SinEntrevistador_...`, `ProcessHiringAsync_AlConfirmarContratacion_...`,
  `ProcessDirectHiringAsync_SinCandidateProcess_...`); total 5 tests en el archivo, todos verdes.

### Frontend
- `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate-application/
  candidate-process-hiring-modal.ts` / `.html` — el formulario grandote, el archivo más
  reescrito. Campos reordenados para calcar el papel; nuevos: email, estado civil, nivel de
  educación, CP del RFC, INFONAVIT (toggle + 2 campos condicionales), select de banco. Quitado:
  fuente de reclutamiento. Nuevo: panel "Contexto de la vacante" (Empresa/Puesto/Sueldo,
  solo lectura) y banner de candidato aprobado con import.
- `.../candidate-application/interfaces/candidate-process-hiring.dto.ts` y
  `candidate-process-hiring-form.interface.ts` — reflejan los mismos cambios de campos.
- `.../expediente-del-empleado/employees/staff-board/staff-board.ts` — `showModalAddEmployeeFromPosition`
  ahora abre `CandidateProcessHiringModal` (antes `EmployeeProviderForm`).
- `.../candidates/candidate-recruitment-interviews/candidate-recruitment-interviews.ts` —
  `openAltaForm` ídem, ahora pasa `candidateId` para precarga automática.
- `.../candidates/candidate/candidate-detail.ts` — `onProcessHiring` ahora también pasa
  `candidateId`/`requestPositionId` (antes solo pasaba nombre/apellido sueltos).
- `client/angular/src/app/shared/ui/base/stepper.base.ts` — el fix del bug de `ng-content`.
- `client/angular/src/app/shared/ui/base/stepper-step-section.directive.ts` — **nuevo archivo**,
  la directiva `[step]` que hace posible el fix.
- `client/angular/src/app/shared/ui/web/wizard/wizard.ts` — simplificado (ya no usa
  `p-step-panels`/`p-step-panel`, ahora `<ng-content>` único + botones prev/next manuales).
- `client/angular/src/app/shared/ui/mobile/stepper/stepper.ts` — CSS de respaldo
  (`::ng-deep [step] { display: none }`) para el mismo fix, lado móvil.
- `client/angular/src/app/core/constants/endpoints/reclutamiento.endpoints.ts` — agregado
  `CandidateProcesses.byRequestPosition` y `.directHire`.

## Hallazgos NO resueltos (decisión pendiente del usuario)

- **`EmployeeProviderForm`** (`apps/supplier.luxuryapp/provider/employee-provider-form.ts`) quedó
  **huérfano** — verificado con grep que ya nadie lo importa fuera de su propio archivo/spec. No
  se borró (fuera del alcance pedido). Si el usuario confirma que no tiene otro uso futuro
  planeado (dominio Proveedor/ExternalStaff), se puede eliminar en una pasada futura.
- El campo `Employee.Salary` sigue sin sincronizarse desde `WorkPosition.SueldoBase` (se mostró
  como contexto de solo lectura, pero nunca se escribe en `Employee.Salary` al dar de alta) — no
  se tocó porque no fue parte de lo pedido, pero es la misma familia de hallazgo que
  `EducationLevel` (que sí se corrigió).

## Gotchas aprendidos esta sesión (para no repetir el mismo tiempo perdido)

1. **El proceso `LuxuryApp.Api.exe` corriendo bloquea sus propios DLL.** Cualquier `dotnet build
   LuxuryApp.Api/...` o `dotnet ef migrations add` (que necesita compilar el proyecto de
   arranque) falla con `MSB3027`/`MSB3021` si el backend sigue corriendo. Verificar con:
   ```powershell
   Get-NetTCPConnection -LocalPort 7070 -State Listen | Select-Object -ExpandProperty OwningProcess -Unique
   Get-CimInstance Win32_Process -Filter "Name='LuxuryApp.Api.exe'" | Select-Object ProcessId, CreationDate
   ```
   **Siempre pedir autorización antes de detenerlo** (es el entorno de desarrollo del usuario).
   `dotnet build LuxuryApp.Application/LuxuryApp.Application.csproj` (sin tocar `LuxuryApp.Api`)
   SÍ funciona con el backend corriendo — úsalo para verificar compilación rápida sin bloquear al
   usuario.
2. **Nunca generar ni aplicar migraciones EF sin autorización explícita del usuario en el
   momento.** En esta sesión el usuario pidió expresamente encargarse él mismo de crear/aplicar
   la migración de los campos de `PersonData`.
3. **`playwright-cli`**: login `admin`/`Hwtc00--`; el popup de OneSignal ("Later") intercepta
   clics si no se descarta primero; el selector de tenant está en el botón con el nombre del
   tenant actual, arriba a la izquierda del toolbar (no en el menú lateral).
4. Los formularios "grandes" tipo wizard en este repo casi no tienen precedente de uso real —
   antes de asumir que un componente compartido (`@ui/...`) funciona, verificar si tiene más de
   un consumidor real (`grep` del selector) antes de confiar en que ya fue probado.
