# AccountRecovery (Recuperacion de Cuenta)

> **Area:** Sistema / Acceso
> **Ultima actualizacion:** `2026-06-25`

Recuperacion de contrasena, reenvio de credenciales y notificaciones por email.

## Endpoints vigentes

| Metodo | Ruta | Endpoint | Descripcion |
|--------|------|----------|-------------|
| `POST` | `api/auth/recover-password` | `AuthEndpoints` | Solicitar recuperacion |
| `POST` | `api/auth/confirm-recover-password` | `AuthEndpoints` | Confirmar con token |
| `POST` | `api/auth/account-recovery/send-mail-recover-password?email=` | `RecoveryAccountEndpoints` | Reenviar email |
| `GET` | `api/auth/account-recovery/send-new-user-name-for-email/{applicationUserId}` | `RecoveryAccountEndpoints` | Enviar nuevo username |
| `GET` | `api/auth/account-recovery/send-new-password-for-email/{applicationUserId}` | `RecoveryAccountEndpoints` | Enviar nueva contrasena |

**Reglas:** Mensaje generico siempre (previene email enumeration). Token sanitizado (`.` -> `+`). Links environment-aware (localhost vs luxurybuildingapp.com). `SendNewUserNameForEmail` genera username aleatorio unico + password + AccesoCustomers.

## SendEmailGlobal (sub-modulo)

Tres metodos de notificacion:
- `SendPasswordRecoveryAsync`: template `AccountPasswordRecoveryEmail.cshtml`
- `SendNewUserCredentialsAsync`: template `AccountNewUserCredentialsEmail.cshtml`
- `SendNewPasswordAsync`: template `AccountNewPasswordEmail.cshtml`

Usa `IRazorViewToStringRenderer` + `ISendEmailService`.
