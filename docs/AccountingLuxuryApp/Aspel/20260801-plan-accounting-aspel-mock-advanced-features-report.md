# Reporte de Ejecución - Funciones Avanzadas Mock Aspel

## Reporte Backend Fase Avanzada

**Estado:** ✅ COMPLETADO

- `MockAuxiliar` incorpora `Uuid_Fiscal` con longitud máxima de 36 caracteres, además de los campos existentes `IdUuid` y `NumDepto`.
- El contrato de partidas acepta y devuelve `UuidFiscal` en los movimientos.
- Antes de guardar, `POST /api/AspelCOI/Polizas` valida la configuración de cada cuenta de detalle: UUID obligatorio cuando `CapturaUuid == 1` y departamento obligatorio cuando `Deptsino == "S"`.
- Los incumplimientos retornan `400 Bad Request` con los mensajes acordados.

### Decisiones y verificación

- El simulador usa EF Core InMemory, por lo que la ampliación de esquema queda disponible al crear el contexto y no requiere una migración SQL.
- ✅ `LuxuryApp.Infrastructure.MockAspel` compila sin advertencias ni errores.
- Se añadieron pruebas para UUID faltante, departamento faltante y una partida con ambos requisitos satisfechos.
- ⚠️ La ejecución de la suite de pruebas sigue bloqueada por un error preexistente en `CandidateProcessSmokeTests.cs`: falta el argumento `hrPolicyService` de `RequestPositionAppService`.

## Reporte Frontend Fase Avanzada

**Estado:** ✅ COMPLETADO

- El formulario carga una vez las cuentas de detalle desde `GET /api/AspelCOI/Cuentas`.
- Al elegir una cuenta con `CapturaUuid == 1`, se muestra el campo UUID en rojo y se aplica `Validators.required`.
- Al elegir una cuenta con `Deptsino == "S"`, se muestra el campo Departamento en rojo y se aplica `Validators.required`.
- Cuando la cuenta no exige uno de esos datos, el campo correspondiente se limpia, se deshabilita y desaparece para evitar confusión.

### Verificación

- ✅ `LuxuryApp.Infrastructure.MockAspel` compila sin advertencias ni errores, incluyendo el endpoint de catálogo de solo lectura.
- ✅ `npx tsc --noEmit --project tsconfig.app.json` terminó sin errores tras actualizar el formulario Angular.
