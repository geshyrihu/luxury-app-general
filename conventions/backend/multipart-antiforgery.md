# Backend: Multipart Form-Data & CSRF Protection

**Status:** ✅ APROBADA (2026-08-14)  
**Severidad:** 🔴 CRÍTICA  
**Scope:** Backend .NET — Endpoints Minimal API con archivos

---

## Regla

### [FromForm] — OBLIGATORIO

```csharp
// ✅ OBLIGATORIO cuando el DTO contiene IFormFile
app.MapPost("/upload", async ([FromForm] UploadDto dto) => ...)
```

### .DisableAntiforgery() — CONDICIONAL

❌ **PROHIBIDO:** `.DisableAntiforgery()` automático  
✅ **PERMITIDO:** Solo si TODAS estas condiciones se cumplen:

1. Autenticación **Bearer/Token stateless** (no cookies)
2. **Análisis de seguridad** ejecutado (documento de ticket)
3. **Documentado explícitamente** en código

```csharp
// ✅ CORRECTO (estateless con Bearer)
app.MapPost("/upload", async ([FromForm] UploadDto dto, HttpContext http) => {
    // Verificar Bearer token (sin cookies)
    var token = http.Request.Headers.Authorization;
    // ...
})
.DisableAntiforgery() // Documento: TICKET-XXXX (análisis de seguridad)
```

```csharp
// ❌ INCORRECTO (mantener antiforgery si hay cookies)
app.MapPost("/upload", async ([FromForm] UploadDto dto) => {
    // Si el usuario está autenticado por cookie, antiforgery es OBLIGATORIO
    // .DisableAntiforgery() rompe protección CSRF
})
.WithName("Upload")
```

---

## Problema Resuelto

La regla anterior mezclaba dos conceptos **distintos**:

| Concepto | Razón | Decisión |
|----------|-------|----------|
| `[FromForm]` | Multipart binding correcto | ✅ SIEMPRE obligatorio |
| `.DisableAntiforgery()` | Desabilitar protección CSRF | ⚠️ SOLO si stateless Bearer |

### Riesgo CSRF sin Antiforgery

Si el usuario está autenticado por **cookie** y un atacante hace:

```html
<!-- Página atacante -->
<form action="https://tuapp.com/api/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="file" />
  <button>Descargar gratis</button>
</form>
```

El navegador envía automáticamente la cookie del usuario → **archivo se sube sin consentimiento**.

Si antiforgery está habilitado, se requiere token CSRF explícito (imposible desde HTML plano).

---

## Implementación

### Caso 1: Stateless con Bearer (Antiforgery = OK desabilitar)

```csharp
app.MapPost("/api/documents/upload", async (
    [FromForm] DocumentUploadDto dto,
    IDocumentService documentService) =>
{
    // Autenticación: Bearer token en Authorization header
    // No hay cookie → CSRF no es riesgo
    var result = await documentService.ProcessUploadAsync(dto);
    return Results.Ok(result);
})
.RequireAuthorization()
.DisableAntiforgery(); // ✅ Documento: Análisis TICKET-1234
```

### Caso 2: Cookie-based Auth (Antiforgery = MANTENER)

```csharp
app.MapPost("/api/documents/upload", async (
    [FromForm] DocumentUploadDto dto,
    IDocumentService documentService) =>
{
    // Autenticación: Cookie de sesión
    // Antiforgery PROTEGE contra CSRF
    var result = await documentService.ProcessUploadAsync(dto);
    return Results.Ok(result);
})
.RequireAuthorization()
// ✅ NO .DisableAntiforgery() — dejar antiforgery activo
```

Frontend envía token CSRF en header:

```typescript
const formData = new FormData();
formData.append('file', file);

this.http.post('/api/documents/upload', formData, {
  headers: { 'X-CSRF-TOKEN': this.csrfToken }
});
```

---

## DTO Validation

```csharp
public record DocumentUploadDto
{
    [Required]
    public IFormFile File { get; init; }

    public string? Description { get; init; }
}

// Validar tamaño, extensión, MIME
public class DocumentUploadValidator : AbstractValidator<DocumentUploadDto>
{
    public DocumentUploadValidator()
    {
        RuleFor(x => x.File)
            .NotNull()
            .Must(f => f.Length <= 10_485_760) // 10 MB
            .WithMessage("Archivo debe ser ≤ 10 MB");

        RuleFor(x => x.File)
            .Must(f => IsAllowedExtension(f.FileName))
            .WithMessage("Extensión no permitida");
    }

    private static bool IsAllowedExtension(string fileName)
    {
        var allowed = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx" };
        var ext = Path.GetExtension(fileName).ToLower();
        return allowed.Contains(ext);
    }
}
```

---

## Checklist

- [ ] DTO tiene `[FromForm]` 
- [ ] Validación de tamaño máximo
- [ ] Validación de extensión whitelist
- [ ] MIME validation (magic bytes si crítico)
- [ ] Nombre de archivo saneado
- [ ] Almacenamiento con UUID (no nombre original)
- [ ] `.DisableAntiforgery()` SOLO si Bearer stateless
- [ ] Si se deshabilita, documentar ticket de seguridad

---

## Referencia

- **RFC:** Separar [FromForm] de .DisableAntiforgery() (2026-08-14)
- **OWASP:** [Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
- **Aprobado:** Tech Lead (2026-08-14)
