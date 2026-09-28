# Plan: Unificación de Credenciales + Recuperación por Código (Email + WhatsApp)

**Fecha:** 2026-08-25
**Estado:** Aprobado para ejecución
**Alcance:** Backend (`.NET 10` API) + Frontend (Angular 22)
**Responsable:** Arquitectura de Software
**Reemplaza a:** versión anterior de este mismo documento (descartaba password fija `123456`, Redis y JWT custom tras revisión — ver Fase 0 / Riesgos)

---

## FASE 0: Pre-Planeación

### 0.1 Problem Statement + KPIs

Actualmente, un **Administrador** sufre de **lógica de envío de credenciales duplicada y sin consistencia** (Reclutamiento usa password constante `TemporaryEmployeePassword` + Email/WhatsApp; Comité y AccountRecovery usan password aleatoria pero solo Email) cuando intenta **dar de alta o resetear el acceso de un usuario**, lo que resulta en **canales de entrega inconsistentes y una política de password nueva que no se valida en el backend** (`ConfirmRecoverPasswordAsync` acepta hoy cualquier password de 1 carácter).

Adicionalmente, un **usuario final** sufre de **no tener recuperación de cuenta por código** (hoy solo existe recuperación por link de un solo uso vía email) cuando **olvida su contraseña y no tiene acceso inmediato a su correo**, lo que resulta en **bloqueo de acceso sin alternativa rápida**.

| Métrica | Baseline | Target | Timeline |
|---|---|---|---|
| Canales en envío de credenciales iniciales | Email-only (Comité, AccountRecovery); Email+WhatsApp solo Reclutamiento | Email+WhatsApp en 100% de altas/resets admin | Fase 2 |
| Servicios duplicados de envío de credenciales | 3 (`RequestEmployeeRegisterAppService`, `ComiteVigilanciaAppService`, `RecoveryAccountUserAppService`) | 1 (`ICredentialNotificationService`) | Fase 2 |
| Validación server-side de password en reset | 0% (ausente en `ConfirmRecoverPasswordAsync`) | 100% | Fase 1 |
| Recuperación de cuenta sin depender solo de email | No existe | Código de 6 dígitos por Email+WhatsApp, <2 min | Fase 3 |

### 0.2 Matriz de Reglas de Negocio (4 Niveles)

**Nivel 1 — Invariantes de Dominio**
- `RN-CRED-001`: Toda contraseña inicial (alta de usuario, reset por admin) es generada aleatoriamente por el sistema — nunca una constante compartida.
- `RN-CRED-002`: Las credenciales iniciales (usuario + password) se entregan siempre por Email **y** WhatsApp en paralelo; si un canal falla, el otro se envía igual.
- `RN-CRED-003`: El código de verificación de recuperación es de un solo uso y expira a los 2 minutos.
- `RN-CRED-004`: El código de recuperación se envía siempre por Email **y** WhatsApp en paralelo — sin importar si el usuario ingresó su correo o su teléfono como identificador.

**Nivel 2 — Flujo y Estados**
- `RN-CRED-010`: El flujo de recuperación tiene 3 pasos secuenciales: iniciar → validar código → establecer password nueva. No se puede saltar un paso.
- `RN-CRED-011`: Generar un código nuevo invalida cualquier código anterior no usado del mismo usuario.
- `RN-CRED-012`: Validar el código exitosamente emite un token de reset de ASP.NET Identity (mismo mecanismo que el flujo existente por link), consumible una sola vez.

**Nivel 3 — Seguridad/Autorización**
- `RN-CRED-020`: La comparación del código ocurre exclusivamente en el API. El frontend nunca recibe el código esperado ni lo compara localmente.
- `RN-CRED-021`: La respuesta de "iniciar recuperación" es genérica sin importar si el identificador existe (anti-enumeración) — mismo patrón que `AuthAppService.RecoverPasswordAsync` ya usa hoy.
- `RN-CRED-022`: Solo usuarios con `ApplicationUser.Active == true` pueden recibir credenciales o completar recuperación.
- `RN-CRED-023`: El código se almacena hasheado (nunca texto plano) con expiración de 2 minutos.

**Nivel 4 — Validación de Datos**
- `RN-CRED-030`: Password inicial generada por el sistema: 6 caracteres, alfanumérico (mayúscula + minúscula + números), sin símbolos.
- `RN-CRED-031`: Código de verificación: 6 dígitos numéricos.
- `RN-CRED-032`: Password nueva definida por el usuario: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número — validada en **backend**, no solo en frontend.

### 0.3 Riesgos + Pre-Mortem + Flujos

**Pre-Mortem:**

| Supuesto fallido | Impacto | Probabilidad | Mitigación |
|---|---|---|---|
| El Content SID `HX49bbe890cfd23fb10b8e6e41bca163fc` (`TwilioTemplateCredencialesAcceso`) ya no acepta 3 variables, pero `SendMessageCredencialesAcceso` (nombre+usuario+password) sigue enviándolas | Envío de credenciales por WhatsApp falla o Twilio rechaza la llamada | Media | Smoke test manual contra Twilio antes de cerrar Fase 2; si falla, simplificar `SendMessageCredencialesAcceso` a 1 variable también |
| Doble submit genera dos códigos válidos simultáneos para el mismo usuario | Confusión sobre cuál código es el vigente | Baja | `RN-CRED-011`: borrar códigos previos del usuario antes de insertar uno nuevo |
| Usuario con `PhoneNumber` inválido o sin WhatsApp | Un canal falla silenciosamente | Media | Ya mitigado por diseño: envío paralelo tolerante a fallo por canal (`RN-CRED-002`/`004`), con logging por canal |
| `ConfirmRecoverPasswordAsync` sigue sin política de password mientras se construye el flujo nuevo | Ventana donde cualquiera resetea a password de 1 carácter (ya ocurre hoy) | Alta (vigente) | Fase 1 cierra esto primero, antes de tocar el flujo por código |

**Happy Path:** Usuario da email o teléfono → API resuelve el mismo usuario sin importar cuál dio → código sale por Email y WhatsApp → usuario ingresa el código dentro de 2 min → API valida y emite token de reset → usuario define password nueva válida (`RN-CRED-032`) → redirige a login.

**Sad Path:** Código expira (>2 min) → API rechaza con mensaje genérico → frontend ofrece reenviar (nuevo código invalida el anterior, `RN-CRED-011`).

**Edge Path:** Identificador no existe en el sistema → API responde el mismo mensaje genérico de éxito sin enviar nada (`RN-CRED-021`, anti-enumeración).

---

## 1. Resumen Ejecutivo

Unificar el envío de credenciales (alta/reset admin) bajo un único servicio con doble canal garantizado (Email+WhatsApp), y agregar recuperación de cuenta self-service por código de 6 dígitos (en vez de solo link), reutilizando al máximo la infraestructura de Identity, Twilio y Vault que **ya existe y funciona** en el proyecto — sin introducir Redis, JWT custom, ni una password fija compartida (descartados en la iteración anterior de este plan tras revisión de seguridad).

## 2. Scope & Constraints

```
IN-SCOPE:
- Servicio único de generación de credenciales (usuario + password aleatoria de 6 chars)
- Envío de credenciales iniciales por Email + WhatsApp desde Reclutamiento, Comité y AccountRecovery
- Flujo de recuperación por código (iniciar → validar → set password), reutilizando
  UserManager.GeneratePasswordResetTokenAsync + el endpoint ConfirmRecoverPassword existente
- Validación server-side de password nueva (RN-CRED-032) en ConfirmRecoverPasswordAsync
- Frontend: nueva pantalla de código dentro del flujo de recuperación existente

OUT-OF-SCOPE (explícitamente descartado tras análisis de seguridad):
- Redis / cualquier cache distribuido nuevo (el TTL de 2 min no lo justifica; usar SQL)
- Tokens JWT custom para el reset (ya existe UserManager.GeneratePasswordResetTokenAsync)
- Password fija/compartida (123456 o cualquier constante) como default
- MFA/2FA permanente, device fingerprinting, límite de sesiones concurrentes,
  breach-password detection (HaveIBeenPwned) — iniciativas separadas, no parte de esta unificación
```

## 3. Arquitectura & Diseño Técnico

**Backend (.NET 10)**

| RN | Componente |
|---|---|
| RN-CRED-001, 030 | `IGeneratePasswordService.GenerateRandomPassword(int length = 8)` — parametrizar, default sin cambios; nuevo servicio unificado llama con `6` |
| RN-CRED-002 | `ICredentialNotificationService` (nuevo, `LuxuryApp.Application/Moduls/AuthLuxuryApp/AccountRecovery/Services/`) — orquesta Email + `IWhatsAppService`; reemplaza las 3 llamadas dispersas en Reclutamiento/Comité/AccountRecovery |
| RN-CRED-003, 011, 023 | Tabla `PasswordRecoveryCode` (nueva) — `UserId`, `CodeHash`, `ExpiresAt`, `CreatedAt` |
| RN-CRED-004 | `TwilioWhatsAppService.SendVerificationCodeAsync(codigo, to)` (nuevo método) usando el SID ya sembrado en Vault (`VaultSecretNames.TwilioTemplateCredencialesAcceso`) — no requiere secreto nuevo |
| RN-CRED-010, 012 | `RecoveryAccountUserAppService` — 2 métodos nuevos: `InitiateRecoveryByCodeAsync(identifier)`, `ValidateRecoveryCodeAsync(identifier, code)` |
| RN-CRED-020, 021 | Endpoints nuevos en `api/auth/account-recovery` (`ApplicationUserAccountRecoveryEndPoints.cs`), mismo patrón de respuesta genérica que `AuthAppService.RecoverPasswordAsync` |
| RN-CRED-022 | Filtro `ApplicationUser.Active == true` en ambos métodos nuevos (igual que `RecoverPasswordAsync` línea 203) |
| RN-CRED-032 | `AuthAppService.ConfirmRecoverPasswordAsync` — agregar validación de política antes de `ResetPasswordAsync` (gap ya existente hoy, independiente de este feature) |

**Frontend (Angular 22)**
- Extiende el flujo existente `apps/auth.luxuryapp/recovery-password/` con un paso intermedio de código (input de 6 dígitos + countdown de 2 min), antes de llegar a la pantalla `reset-password` ya existente.
- `interfaces/` nuevas para los DTOs de iniciar/validar código (nunca `models/`, regla de CONVENTIONS.md).
- Política de password (`RN-CRED-032`) validada también en el formulario, replicando la regla del backend.

### 3.5 Migración de Datos

**Aplica.** Tabla nueva, sin afectar datos existentes.

| Tabla | Cambio | Riesgo | Mitigación |
|---|---|---|---|
| `PasswordRecoveryCode` (nueva) | Creación | Bajo | Migración EF Core estándar (`dotnet ef migrations add`), igual que el resto del schema en `LuxuryApp.Infrastructure.Data/Data/Migrations/` |

Entidad en `api/LuxuryApp.Infrastructure.Data/Data/Entities/System/Access/PasswordRecoveryCode.cs` (mismo folder que `ApplicationUser.cs`):

```csharp
public class PasswordRecoveryCode
{
    public Guid Id { get; set; }
    public string ApplicationUserId { get; set; }
    public string CodeHash { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

Índice recomendado: `(ApplicationUserId, ExpiresAt)` para la búsqueda del código vigente.

**Validación post-migración:**
- [ ] Migración aplica sin error en entorno local/staging
- [ ] `dotnet ef migrations list` muestra la nueva migración al tope
- [ ] Tabla vacía tras crear (0 filas esperadas)
- [ ] FK `ApplicationUserId → AspNetUsers.Id` íntegra

**Rollback:** `dotnet ef database update <migración-anterior>` — sin impacto en datos existentes porque la tabla es nueva y no se relaciona con datos productivos previos.

### 3.6 Tokens de Diseño

Aplica solo a la nueva pantalla de "ingresar código" (Angular). Reutiliza el catálogo ya usado en `apps/auth.luxuryapp/`:
- Inputs: `var(--ds-border-default)`, `var(--ds-radius-md)`
- Botón principal: `var(--ds-primary)` / `var(--ds-primary-hover)`
- Countdown/error: `var(--danger-600)` / `var(--ds-primary-text)`
- Sin hex hardcodeado — validar con `grep -r "#[0-9A-F]\{6\}" client/angular/src/app/apps/auth.luxuryapp` → 0 resultados antes de cerrar Fase 3.

## 4. Backlog de Tasks

**Backend**
- [ ] Parametrizar `IGeneratePasswordService.GenerateRandomPassword(int length = 8)`
- [ ] Crear entidad `PasswordRecoveryCode` + migración EF Core
- [ ] Crear `ICredentialNotificationService` + implementación (Email + `IWhatsAppService.SendMessageCredencialesAcceso`)
- [ ] Migrar Reclutamiento (`NotifyEmployeeCredentialsAsync`), Comité (`SendCredentialsAsync`) y AccountRecovery (`SendNewUserNameForEmailAsync`, `SendNewPasswordForEmailAsync`) para usar `ICredentialNotificationService`
- [ ] Agregar `TwilioWhatsAppService.SendVerificationCodeAsync(codigo, to)` (1 variable, SID existente)
- [ ] Agregar `InitiateRecoveryByCodeAsync` / `ValidateRecoveryCodeAsync` en `RecoveryAccountUserAppService`
- [ ] Nuevos endpoints en `ApplicationUserAccountRecoveryEndPoints.cs`
- [ ] Agregar validación de política de password (RN-CRED-032) en `AuthAppService.ConfirmRecoverPasswordAsync`
- [ ] Smoke test manual del envío WhatsApp contra el SID real (ver riesgo Fase 0)
- [ ] Tests unitarios: generación de código, expiración, invalidación de códigos previos, anti-enumeración

**Frontend**
- [ ] `interfaces/` para DTOs de iniciar/validar código
- [ ] Pantalla intermedia de código (web + mobile, countdown 2 min)
- [ ] Conectar con la pantalla `reset-password` existente (recibe `email`+`token` desde el paso de código, no solo desde query params)
- [ ] Validador de política de password (RN-CRED-032) en el formulario

## 5. Fases de Ejecución

```
Fase 1 (1 día) — Cerrar el gap de seguridad vigente
  - Validación de política de password en ConfirmRecoverPasswordAsync
  - Criterio de PASO: POST confirm-recover-password con password de 1 carácter → 400

Fase 2 (3 días) — Unificación del envío de credenciales
  - IGeneratePasswordService parametrizado
  - ICredentialNotificationService + migración de los 3 call sites
  - Smoke test WhatsApp
  - Criterio de PASO: alta desde Reclutamiento, Comité y AccountRecovery
    entregan por Email Y WhatsApp usando el mismo servicio

Fase 3 (3 días) — Recuperación por código
  - Entidad + migración PasswordRecoveryCode
  - InitiateRecoveryByCodeAsync / ValidateRecoveryCodeAsync + endpoints
  - Criterio de PASO: código llega por Email y WhatsApp, expira a los 2 min,
    un código usado no valida dos veces

Fase 4 (2 días) — Frontend
  - Pantalla de código + integración con reset-password existente
  - Criterio de PASO: flujo completo email/teléfono → código → password nueva → login
```

## 6. Criterios de Completitud
- [ ] `ConfirmRecoverPasswordAsync` rechaza password que no cumple RN-CRED-032
- [ ] Los 3 servicios legacy de envío de credenciales ya no tienen lógica propia de envío (delegan a `ICredentialNotificationService`)
- [ ] Código de recuperación: expira a los 2 min, un solo uso, invalidado por uno nuevo
- [ ] `initiate-by-code` responde igual exista o no el identificador (verificado con test)
- [ ] 0 resultados en grep de hex hardcodeado en la nueva pantalla frontend

## 7. Riesgos & Mitigaciones
Ver tabla de Pre-Mortem (Fase 0, §0.3) — cada fila tiene mitigación y se revisa al cierre de Fase 2 (SID de Twilio) y Fase 1 (gap de password ya vigente).

## 8. Dependencias Externas
- Twilio Content API — SID `HX49bbe890cfd23fb10b8e6e41bca163fc` ya sembrado en Vault (`VaultSecretNames.TwilioTemplateCredencialesAcceso`), sin acción de infraestructura nueva
- Ninguna dependencia nueva de infraestructura (se descartó Redis explícitamente)

## 9. Métricas & KPIs de Éxito
Ver tabla de KPIs (Fase 0, §0.1).

## 10. Rollback Plan
- Fase 1: revertir el commit de validación si bloquea un flujo legítimo no contemplado (bajo riesgo, cambio aislado a un método)
- Fase 2: los servicios legacy quedan intactos hasta que cada call site se migra individualmente — rollback es no cambiar la llamada de ese módulo específico
- Fase 3: `dotnet ef database update` a la migración anterior; la tabla nueva no tiene datos productivos que perder
- Fase 4: feature flag simple en el componente de recovery-password para volver al flujo solo-link si el de código falla en producción

## 11. Post-Implementation Review
Pendiente hasta cierre de Fase 4 — completar con: KPIs reales vs. target, si el SID de Twilio requirió ajuste, tiempo real de recuperación medido.

---

**Nota de proceso:** esta versión reemplaza el enfoque original (password fija `123456`, Redis, JWT custom, 15 puntos de hardening tipo MFA/fingerprinting) tras análisis de seguridad — ver conversación de origen. Esas 15 iniciativas de hardening general (rate limiting, lockout, password history, breach detection, MFA, session limits) **no están en este plan**; si se aprueban, deben ir en un plan propio e independiente, no acoplado a esta unificación.
