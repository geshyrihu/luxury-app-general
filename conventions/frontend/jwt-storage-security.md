# Frontend: JWT Storage & Security

**Status:** ✅ APROBADA (2026-08-14)  
**Severidad:** 🔴 CRÍTICA  
**Scope:** Frontend Angular — Almacenamiento seguro de tokens

---

## Regla

### ❌ PROHIBIDO

- Access token en `localStorage`
- Refresh token en `localStorage` (sin análisis explícito de seguridad)
- Tokens sin expiración
- Tokens en `sessionStorage` (móvil)

### ✅ PERMITIDO

- **Access token:** Memoria (variable local en servicio, no persistido)
- **Refresh token:** Cookie `HttpOnly`, `Secure`, `SameSite=Strict`
- **Mobile (Android):** Android Keystore (máxima seguridad)
- **Mobile (iOS):** iOS Keychain (máxima seguridad)

---

## Problema Resuelto

`localStorage` es vulnerable a XSS. Si un atacante inyecta JavaScript:

```js
// Robo de token en localStorage:
const token = localStorage.getItem('access_token');
// Enviar a servidor atacante...
```

Con tokens en memoria + refresh en HttpOnly cookie:

```js
// No hay acceso desde JavaScript:
localStorage.getItem('access_token'); // No existe
// Refresh token está en cookie HttpOnly (inaccesible desde JS)
```

---

## Implementación

### Access Token (Memoria)

```typescript
@Injectable()
export class AuthService {
  private accessToken: string | null = null;

  setAccessToken(token: string): void {
    this.accessToken = token;
    // Expiración: 15 min
    setTimeout(() => this.refreshToken(), 15 * 60 * 1000);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }
}
```

### Refresh Token (Cookie HttpOnly)

Backend retorna refresh token en cookie:

```csharp
// Backend (Program.cs)
var cookieOptions = new CookieOptions
{
    HttpOnly = true,           // ✅ Inaccesible desde JS
    Secure = true,             // ✅ HTTPS only
    SameSite = SameSiteMode.Strict, // ✅ CSRF protection
    MaxAge = TimeSpan.FromDays(7),  // 7 días
    Path = "/",
};

response.Cookies.Append("refresh_token", refreshToken, cookieOptions);
```

Frontend NO accede a este cookie; HTTP requests lo envían automático.

### Refresh Flow

```typescript
// HTTP Interceptor
@Injectable()
export class JwtInterceptor implements HttpInterceptorFn {
  constructor(private auth: AuthService, private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const token = this.auth.getAccessToken();

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // 401: Refresh token (in cookie) será enviado automático
          return this.http.post('/api/auth/refresh', {})
            .pipe(
              tap((response: any) => {
                this.auth.setAccessToken(response.accessToken);
                // Cookie con refresh token se actualiza en response
              }),
              switchMap(() => next(req))
            );
        }
        return throwError(err);
      })
    );
  }
}
```

### Logout

```typescript
logout(): void {
  this.auth.clearAccessToken();
  // Backend clears refresh cookie via Set-Cookie header
  this.http.post('/api/auth/logout', {}).subscribe();
}
```

---

## Mobile (Android/iOS)

Para Flutter o React Native:

### Android (Kotlin)

```kotlin
val sharedPref = context.getSharedPreferences("secure", Context.MODE_PRIVATE)
val encryptedToken = EncryptedSharedPreferences.create(
    context,
    "secure_tokens",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)
encryptedToken.edit().putString("access_token", token).apply()
```

### iOS (Swift)

```swift
let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrAccount as String: "access_token"
]
SecItemAdd(query as CFDictionary, nil)
```

---

## Excepciones (Muy Raro)

Si análisis de seguridad aprueba `localStorage` para tokens:

```typescript
// ⚠️ Excepción explícita (RARA)
// Requerimientos:
// - Análisis de seguridad ejecutado
// - CSP estricto + sanitización
// - Expiración corta (5 min max)
// - Auditoría de acceso
// - Documentado en ticket de seguridad

// SOLO si se cumple lo anterior:
localStorage.setItem('access_token_temp', token);
```

---

## Checklist

- [ ] Access token en memoria, NO en storage
- [ ] Refresh token en cookie HttpOnly + Secure + SameSite
- [ ] Logout limpia memoria + borra cookie en servidor
- [ ] No acceso desde JavaScript a refresh token
- [ ] Interceptor reintenta 401 con refresh
- [ ] Expiración de access token (15-30 min)
- [ ] Mobile usa Keystore/Keychain (no SharedPreferences sin encripción)

---

## Referencia

- **RFC:** JWT Storage Security (2026-08-14)
- **OWASP:** [Storage of Sensitive Data](https://owasp.org/www-community/vulnerabilities/Sensitive_Data_Exposure)
- **Aprobado:** Tech Lead (2026-08-14)
