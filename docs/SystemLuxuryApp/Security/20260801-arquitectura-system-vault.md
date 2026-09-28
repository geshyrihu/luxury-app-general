# 🔐 Vault System - Arquitectura de Cifrado Propio

## Visión General

LuxuryApp implementa su **propio sistema de Vault** para almacenar secretos cifrados en BD (SQL Server). No usa Azure Key Vault ni AWS Secrets Manager.

**Ubicación:** `LuxuryApp.Infrastructure.Vault/`

**Stack:**
- **Cifrado:** AES-256-GCM (Galois/Counter Mode)
- **Storage:** SQL Server (tabla `VaultSecrets`)
- **Key Management:** Versioning + rotación automática
- **Auditoría:** Logs de acceso (`VaultAccessLogs`)
- **Multi-tenant:** Soporte nativo

---

## 🏗️ Arquitectura

### Componentes Principales

```
ISecretProvider (Interface pública)
    ↓
SecretProviderService (Orquestación)
    ├→ IVaultSecretRepository (BD)
    ├→ IMasterKeyProvider (Clave maestra)
    ├→ IVaultEncryptionService (AES-256-GCM)
    └→ IUserKeyProvider (Derivación de claves)
    
VaultDbContext (Entity Framework)
    ├→ VaultSecrets (Tabla)
    ├→ VaultAccessLogs (Auditoría)
    ├→ VaultKeyVersions (Versioning)
    └→ Credentials (Opcional)
```

### Diagrama de Flujo

```
1. Developer solicita secreto
   └→ _secretProvider.GetSecretAsync("JwtSigningKey")

2. SecretProviderService busca en BD
   └→ VaultDbContext.Secrets.FirstOrDefaultAsync()

3. Descifra con AES-256-GCM
   └→ IMasterKeyProvider.GetMasterKey(keyVersion)
   └→ AesGcmVaultEncryptionService.Decrypt()

4. Retorna en texto plano (solo memoria)
   └→ return plainValue;

5. Auditoría (log de acceso)
   └→ VaultAccessLogs.Add(new { Operation: "READ", ... })
```

---

## 🔑 Master Keys (Claves Maestras)

### Configuración

```json
// appsettings.json
{
  "Vault": {
    "MasterKeys": {
      "V1": "base64-encoded-32-bytes"
    }
  }
}
```

### Generación

```powershell
# PowerShell - Generar clave maestra (256 bits / 32 bytes)
[Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::GetBytes(32))
```

**Ejemplo Output:** `zxUyYmN4YzNT34kCRzx9VST1Qk3gBEOj2qGdBzPDKrA=`

### Versionado

- **V1, V2, ..., Vn:** Múltiples versiones permitidas
- **Activa:** Una sola versión activa para cifrados nuevos
- **Históricas:** Versiones antiguas para descifrar datos previos
- **Rotación:** `POST /api/vault-secrets/{name}/rotate` re-cifra con versión activa

```sql
-- Tabla VaultKeyVersions
CREATE TABLE VaultKeyVersions (
    KeyVersion INT PRIMARY KEY,
    MasterKeyHash NVARCHAR(64),  -- SHA-256 hash (no almacena clave)
    CreatedAt DATETIME2,
    IsActive BIT
);
```

---

## 🗄️ Almacenamiento en BD

### Tabla: VaultSecrets

```sql
CREATE TABLE VaultSecrets (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    TenantId UNIQUEIDENTIFIER NULL,        -- NULL = secreto global
    SecretType NVARCHAR(100),              -- 'JWT_KEY', 'API_KEY', 'DB_PASSWORD'
    SecretName NVARCHAR(200),              -- Identificador único
    EncryptedValue VARBINARY(MAX),         -- Valor cifrado
    InitializationVector VARBINARY(12),    -- Nonce (12 bytes para AES-GCM)
    AuthenticationTag VARBINARY(16),       -- Tag de autenticación (16 bytes)
    KeyVersion INT,                        -- Versión de clave maestra usada
    ExpiresAt DATETIME2 NULL,              -- Expiración opcional
    IsRevoked BIT DEFAULT 0,               -- Revocación lógica
    TenantScope BIT DEFAULT 0,             -- Scope multi-tenant
    LastAccessedAt DATETIME2 NULL,         -- Auditoría
    AccessCount INT DEFAULT 0,             -- Contador de accesos
    CreatedAt DATETIME2,
    CreatedBy NVARCHAR(450),
    UpdatedAt DATETIME2 NULL,
    UpdatedBy NVARCHAR(450)
);
```

### Tabla: VaultAccessLogs

```sql
CREATE TABLE VaultAccessLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    SecretId UNIQUEIDENTIFIER,
    AccessedBy NVARCHAR(450),              -- Usuario que accedió
    AccessedAt DATETIME2,
    Operation NVARCHAR(50),                -- 'READ', 'CREATE', 'UPDATE', 'ROTATE', 'REVOKE'
    Success BIT,
    ClientIP NVARCHAR(45),                 -- IP del cliente
    FailureReason NVARCHAR(500) NULL       -- Si falló, por qué
);
```

---

## 🔐 Proceso de Cifrado/Descifrado

### Cifrado (Almacenar Secreto)

```csharp
var plainValue = "my-secret-key-value";
var keyVersion = masterKeyProvider.CurrentKeyVersion;
var masterKey = masterKeyProvider.GetMasterKey(keyVersion);

var encrypted = new AesGcm(masterKey).Encrypt(
    nonce: GenerateNonce(12),              // 12 bytes aleatorios
    plaintext: Encoding.UTF8.GetBytes(plainValue),
    associatedData: null,
    tag: new byte[16]                      // 16 bytes para el tag de autenticación
);

// Guardar en BD
db.Secrets.Add(new VaultSecret
{
    SecretName = "MyApiKey",
    SecretType = "API_KEY",
    EncryptedValue = encrypted.Ciphertext,
    InitializationVector = encrypted.Nonce,
    AuthenticationTag = encrypted.Tag,
    KeyVersion = keyVersion,
    TenantId = null  // Global
});
```

### Descifrado (Obtener Secreto)

```csharp
var secret = await db.Secrets.FirstOrDefaultAsync(s => s.SecretName == "MyApiKey");
var masterKey = masterKeyProvider.GetMasterKey(secret.KeyVersion);

var plaintext = new byte[secret.EncryptedValue.Length];
new AesGcm(masterKey).Decrypt(
    nonce: secret.InitializationVector,
    ciphertext: secret.EncryptedValue,
    tag: secret.AuthenticationTag,
    plaintext: plaintext
);

return Encoding.UTF8.GetString(plaintext);
```

---

## 🚀 Uso desde Código

### Interface Pública: `ISecretProvider`

```csharp
public interface ISecretProvider
{
    // Obtener secreto descifrado (solo en memoria)
    Task<string> GetSecretAsync(string secretName, Guid? tenantId = null);

    // Almacenar secreto cifrado en Vault
    Task StoreSecretAsync(string secretName, string plainValue, string secretType, Guid? tenantId = null);

    // Actualizar valor de secreto existente
    Task UpdateSecretValueAsync(string secretName, string newPlainValue, Guid? tenantId = null);

    // Re-cifrar con nueva clave maestra (rotación)
    Task RotateSecretAsync(string secretName, Guid? tenantId = null);

    // Revocar secreto (marca como inactivo)
    Task RevokeSecretAsync(string secretName, Guid? tenantId = null);

    // Listar metadatos de todos los secretos
    Task<IReadOnlyList<VaultSecretSummaryDto>> ListSecretsAsync(Guid? tenantId = null);
}
```

### Uso en Servicios

```csharp
[ApiController]
[Route("api/auth")]
public class AuthController
{
    private readonly ISecretProvider _secretProvider;

    public AuthController(ISecretProvider secretProvider)
    {
        _secretProvider = secretProvider;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        // Obtener clave JWT del Vault
        var jwtKey = await _secretProvider.GetSecretAsync("JwtSigningKey");

        // Usar para generar token
        var token = GenerateJwt(request.UserId, jwtKey);
        
        return Ok(new { token });
    }
}
```

---

## 🌍 Multi-Tenant Support

### Secretos Globales (TenantId = null)

```csharp
// Aplican a toda la aplicación
await _secretProvider.GetSecretAsync("JwtSigningKey");  // Sin tenantId
```

### Secretos por Tenant (TenantId = GUID)

```csharp
// Específicos de un tenant
Guid tenantId = Guid.Parse("...");
await _secretProvider.GetSecretAsync(
    "ApiKeyTenant", 
    tenantId: tenantId
);
```

---

## 🔄 Rotación de Claves Maestras

### Endpoint de Rotación

```http
POST /api/vault-secrets/JwtSigningKey/rotate
Authorization: Bearer <SuperUsuario>
```

**Proceso:**
1. Descifra secreto con clave antigua (V1)
2. Re-cifra con clave activa (V2)
3. Actualiza registro en BD
4. Audita en `VaultAccessLogs`

### En Producción

```bash
# 1. Generar nueva clave maestra
$newKey = [Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::GetBytes(32))

# 2. Agregar en CI/CD secrets: VAULT_MASTER_KEY_V2 = $newKey

# 3. Actualizar appsettings.Production.json
{
  "Vault": {
    "MasterKeys": {
      "V1": "key-vieja",
      "V2": "key-nueva"  # Nueva
    }
  }
}

# 4. Deploy (ambas claves activas)

# 5. Hacer POST a /api/vault-secrets/{name}/rotate para cada secreto

# 6. Remover V1 de appsettings.Production.json

# 7. Deploy final
```

---

## 🆘 Recuperación de Errores

### Mismatch de Clave Maestra

```
System.Security.Cryptography.AuthenticationTagMismatchException:
The computed authentication tag did not match the input authentication tag.
```

**Causa:** Descifrar con clave maestra distinta a la usada en cifrado.

**Solución:**
1. Verificar `secret.KeyVersion`
2. Confirmar que `masterKeyProvider.GetMasterKey(keyVersion)` retorna la clave correcta
3. Para desarrollo: usar clave maestra original que está en BD

---

## 📊 Auditoría y Monitoreo

### Logs de Acceso

```sql
-- Consultar accesos a secretos
SELECT 
    al.AccessedAt,
    al.AccessedBy,
    al.Operation,
    al.Success,
    vs.SecretName
FROM VaultAccessLogs al
INNER JOIN VaultSecrets vs ON al.SecretId = vs.Id
ORDER BY al.AccessedAt DESC
```

### Alertas (Producción)

- [ ] Acceso a secreto específico más de N veces por minuto (ataque)
- [ ] Rotación fallida de clave maestra
- [ ] Intento de acceso por usuario sin autorización
- [ ] Secreto accedido desde IP inusual

---

## 🔗 Relacionado

- [../../../docs/SystemLuxuryApp/Security/20260701-setup-system-secrets.md](../security/../../../docs/SystemLuxuryApp/Security/20260701-setup-system-secrets.md) — Guía completa de secrets
- [CONVENTIONS.md](../../CONVENTIONS.md) — Reglas de arquitectura
- [../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-api.md](./../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-api.md) — Arquitectura de APIs

---

**Última actualización:** 2026-07-26  
**Propiedad:** Tech Team
