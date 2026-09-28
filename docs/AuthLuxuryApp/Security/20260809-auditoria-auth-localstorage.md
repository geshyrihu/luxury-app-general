# Hallazgo de seguridad — contraseña persistida en `localStorage` (texto plano)

**Fecha:** 2026-08-09 · **Reporte:** Fase A-bis / Recuperación (R1-S2) · **Criticidad:** Alta

## Resumen

La aplicación web guarda la **contraseña del usuario en texto plano** en
`localStorage` cuando se marca la opción "Recordarme" en el inicio de sesión.
La contraseña queda accesible para cualquier código o actor con acceso al
perfil del navegador, sin protección alguna.

## Dónde ocurre

- **Escritura:** `src/app/apps/auth.luxuryapp/login/login.ts`
  - `LoginComponent.onRemember()` (líneas 236-256), específicamente:
    ```ts
    if (password) localStorage.setItem("savedPassword", password);   // línea 241
    ```
  - Se invoca desde `onSubmit()` cuando `loginForm.controls['rememberMe'].value` es
    `true` (el checkbox "Recordarme" del formulario de login).
- **Lectura (prefill):** la misma clase lo rehidrata en
  `onLoadForm()` (`localStorage.getItem("savedPassword")`, línea 143) y
  `src/app/apps/auth.luxuryapp/login/login-mobile.ts:327` hace lo propio en la
  vista móvil.
- Junto con `savedPassword` se persiste `savedUsername` (línea 240); ambos en
  claro.

## Alcance

- Afecta a **todos los usuarios** que marcan "Recordarme": desde una cuenta
  `admin` hasta cualquier empleado/residente.
- La credencial persistida es la contraseña **maestra** de la cuenta, no un token
  efímero. Mientras la clave siga en `localStorage`, la cuenta es recuperable por
  quien acceda al almacenamiento.
- `savedPassword` persiste hasta que el usuario vuelve a iniciar sesión **sin**
  "Recordarme" (`removeItem` en el `else` de `onRemember`, líneas 248-249). En la
  práctica rara vez ocurre, así que la contraseña suele quedar guardada
  indefinidamente.

## Riesgo

| Vector | Explicación |
|---|---|
| **XSS** | Cualquier script inyectado en el SPA (binding inseguro, dependencia comprometida, HTML insertado con `innerHTML` en algún punto) puede leer `localStorage.savedPassword` y exfiltrarlo. Es robo de cuenta completo sin necesidad de phish. |
| **Extensiones de navegador** | Una extensión maliciosa o comprometida con permisos de host sobre `localhost` (o el dominio productivo) lee el valor directamente. |
| **Equipos compartidos / quioscos** | En PCs de uso común (recepción, sala de juntas, familiares), cualquiera con acceso local al perfil del navegador abre DevTools y copia la contraseña. |
| **Sincronización y respaldos de perfil** | El directorio de perfil de Chrome (y su sincronización en la nube) así como los respaldos empresariales de imagen/perfil copian el `localStorage` a disco/nube, incluyendo la contraseña, sin cifrar. |
| **Análisis forense / malware** | Cualquier proceso con acceso al usuario puede leer el archivo de `Local Storage` del perfil. |

## Remediación recomendada (NO implementada — cambio de autenticación, decide el Tech Lead)

1. **No persistir contraseñas en `localStorage` en absoluto.** Es la regla cero.
2. Si "Recordarme" es un requisito de negocio, persistir **solo el usuario** y
   delegar la sesión en un **refresh token httpOnly + Secure + SameSite** que el
   backend renueva. La app **ya emite** `luxuryapp.refreshtoken` como cookie
   `httpOnly`/`secure` (ver `.a11y-auth.json` de la corrida), así que la
   infraestructura de sesión persistente ya existe; solo falta dejar de duplicar
   la contraseña en el cliente.
3. Si se justifica un caché local de credenciales (p. ej. uso offline), usar
   **WebAuthn** o al menos **Web Crypto** con una clave no extraíble, nunca texto
   plano.
4. **Limpiar `savedPassword`** en logout y en expiración de sesión, y migrar los
   valores existentes (borrar la clave en los clientes que ya la tienen).

> Nota de coordinación: este informe documenta el hallazgo. El arreglo es cambio
> de autenticación y queda fuera del alcance de la remediación de a11y; lo decide
> el Tech Lead. Mientras tanto, el script `scripts/a11y-login.mjs` ya filtra
> `savedPassword` (y cualquier clave que coincida con `/pass|pwd|secret|token|
> credential/i`) antes de escribir el estado de sesión, de modo que la
> herramienta de baseline no replica la contraseña a disco.
