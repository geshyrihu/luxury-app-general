# Plan: 3 Correcciones Críticas de Seguridad — 2026-08-14

**Status:** 🟠 EN PROGRESO  
**Scope:** GetMexicoTime(), JWT Storage, Antiforgery/Multipart  
**Estimado:** 4-6 horas (documentación + validación)

---

## 1. GetMexicoTime() → Servicio de Zona Horaria Explícito

### Problema
- Hardcodeada una única zona horaria "México"
- No maneja múltiples zonas IANA (City, Tijuana, Cancun, etc.)
- No define si retorna local, unspecified, o DateTimeOffset

### Solución
```csharp
// Crear IBusinessTimeService
public interface IBusinessTimeService
{
    DateTime GetUtcNow();
    DateOnly GetBusinessDate(Guid tenantId);
    DateTime GetBusinessNow(string ianaTimeZone); // "America/Mexico_City"
}

// Reemplazar GetMexicoTime() con explícito:
// _timeService.GetBusinessNow("America/Mexico_City")
```

### Archivos a actualizar
- CONVENTIONS.md §2 Backend Reglas Fechas
- Crear conventions/backend/business-time-service.md
- Crear IBusinessTimeService.cs en LuxuryApp.Shared

---

## 2. JWT Storage → Directiva Segura

### Problema
- No define dónde almacenar access/refresh tokens
- localStorage expuesto a XSS
- No hay política de expiración

### Solución
```
✅ PERMITIDO:
- Access token en memoria (no persistido)
- Refresh token en cookie HttpOnly, Secure, SameSite=Strict
- Android Keystore (mobile)
- iOS Keychain (mobile)

❌ PROHIBIDO:
- Access token en localStorage
- Refresh token en localStorage sin análisis explícito
- Tokens sin expiración
```

### Archivos a actualizar
- CONVENTIONS.md §4.2.3bis Frontend Security
- Crear conventions/frontend/jwt-storage-security.md
- Validar AuthService.ts en codebase

---

## 3. Antiforgery + Multipart → Conceptos Separados

### Problema
- Regla mezcla `[FromForm]` (binding correcto) con `.DisableAntiforgery()` (decisión de seguridad)
- No analiza esquema de autenticación antes de deshabilitar

### Solución
```csharp
// ✅ CORRECTO: [FromForm] obligatorio para archivos
app.MapPost("/upload", async ([FromForm] UploadDto dto) => ...)

// ⚠️ CONDICIONAL: .DisableAntiforgery() solo si:
// - Autenticación Bearer/token stateless
// - Análisis de seguridad ejecutado
// - Documentado explícitamente
.DisableAntiforgery() // Solo después de análisis

// ❌ NUNCA: if auth es cookie/session
// Mantener antiforgery o usar token anti-CSRF
```

### Archivos a actualizar
- CONVENTIONS.md §6.1 Backend Multipart Rules
- Crear conventions/backend/multipart-antiforgery.md
- Audit endpoints en codebase

---

## Bonus: app-icon Usage Validation

### Patrón correcto
```html
<!-- ✅ CORRECTO: usar catálogo tipado -->
<app-icon icon="material-symbols-light:person" size="md" />

<!-- ✅ CORRECTO: con binding -->
<app-icon [icon]="iconName" />

<!-- ❌ PROHIBIDO: strings literales fuera de catálogo -->
<app-icon icon="pi pi-user" />  <!-- PrimeIcons deprecated -->
<i class="material-symbols-light:person"></i>  <!-- Bypass UI -->
```

### Archivos a crear
- Crear conventions/ui/app-icon-usage.md
- Validar app-icon.ts contra patrón

---

## Tareas por Ejecutar

- [ ] 1.1 Leer app-icon.ts (validar patrón)
- [ ] 1.2 Crear IBusinessTimeService en LuxuryApp.Shared
- [ ] 1.3 Actualizar CONVENTIONS.md §2 (GetMexicoTime → IBusinessTimeService)
- [ ] 2.1 Crear JWT Storage Security doc
- [ ] 2.2 Actualizar CONVENTIONS.md §4.2.3bis (JWT Storage)
- [ ] 2.3 Auditar AuthService.ts
- [ ] 3.1 Crear Multipart/Antiforgery doc
- [ ] 3.2 Actualizar CONVENTIONS.md §6.1 (Multipart)
- [ ] 3.3 Auditar endpoints con [FromForm]
- [ ] BONUS: app-icon usage doc

---

## Timeline

**Hoy (2026-08-14):**
- 1.1-1.3: GetMexicoTime (1h)
- 2.1-2.3: JWT Storage (1.5h)
- 3.1-3.3: Antiforgery/Multipart (1.5h)
- BONUS: app-icon (30 min)

**Total:** 4.5 horas
