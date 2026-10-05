# Módulo de Autorización y Seguridad

Este módulo es el núcleo de seguridad de LuxuryApp. Se encarga de la autenticación de usuarios, gestión de sesiones, control de acceso basado en roles (RBAC), recuperación de cuentas y auditoría de actividad.

---

## Estructura del Módulo

```
Autorizacion/
  AccesoCustomer/      (Gestión de acceso multi-tenant)
  AccountRecovery/     (Flujos de recuperación de contraseña)
  ApplicationRole/     (Gestión de roles del sistema)
  ApplicationUser/     (Gestión de identidades de usuario)
  ApprovalRules/       (Reglas dinámicas de aprobación por monto/rol)
  Auth/                (Login, JWT, Refresh Token)
  Notification/        (Orquestación de notificaciones SignalR/Email)
  PasswordManager/     (Cambio y validación de contraseñas)
  ProfileUsers/        (Gestión de perfiles de usuario)
  UserActivityHistory/ (Log de auditoría de acciones de usuario)
```

---

## Lógica de Seguridad y Auth

### Autenticación (AuthAppService)
- **Login:** Valida credenciales contra `UserManager`. Si es exitoso, genera un par de tokens (Access Token JWT y Refresh Token).
- **JWT:** El token contiene claims de identidad, roles y acceso a clientes (`customerAccess`).
- **Refresh Token:** Se almacena en una cookie segura (`HttpOnly`, `SameSite=Strict`) para permitir la renovación de la sesión sin re-login.
- **Geolocalización:** Cada inicio de sesión exitoso o fallido registra la IP y ubicación estimada del usuario.

### Auditoría (UserActivityService)
- Todas las acciones críticas marcadas con el atributo `[LogUserActivity]` en los controladores se registran automáticamente en la tabla `UserActivity`.
- Registra: Usuario, Timestamp, Tipo de Actividad, Detalles, IP, UserAgent y Endpoint.

---

## Integración con Frontend

- **Interceptores:** El frontend utiliza interceptores para adjuntar el token JWT en cada petición y manejar automáticamente el refresco del token cuando expira.
- **Guardias:** Uso obligatorio de `GUARDIANES.md` para proteger rutas basado en roles y estado de autenticación.
- **Signals:** El estado del usuario autenticado debe gestionarse mediante un `UserSignalService` centralizado.

---

## Especificaciones Técnicas

- **Identity:** Basado en `Microsoft.AspNetCore.Identity`.
- **Primary Constructors:** Uso obligatorio en todos los servicios (ej. `AuthAppService`).
- **Standard Responses:** Todos los endpoints retornan `ApiResponseDTO<T>`.
- **Endpoints:**
  - `POST /api/Auth/Login`: Inicio de sesión.
  - `POST /api/Auth/Refresh`: Renovación de token.
  - `POST /api/Auth/Logout`: Cierre de sesión y limpieza de cookies.

---

_Documentación actualizada en Junio 2026_
