# LuxuryApp.Infrastructure.Vault

Proyecto independiente dentro de la solución `LuxuryApp` que gestiona el almacenamiento seguro
de secretos (credenciales, API keys, tokens OAuth, cadenas de conexión sensibles) mediante
cifrado AES-256-GCM en base de datos dedicada (`LuxuryVault`).

---

## Arquitectura del proyecto

```
LuxuryApp.Infrastructure.Vault/
  Abstractions/
    IMasterKeyProvider.cs       interfaz para obtener la clave maestra de cifrado
    ISecretProvider.cs          interfaz pública del Vault (lo que consume el resto de la app)
    IVaultSecretRepository.cs   interfaz de acceso directo a VaultDbContext
  Data/
    VaultDbContext.cs           DbContext exclusivo de LuxuryVault
    VaultDbContextFactory.cs    factory para migraciones en tiempo de diseño
  Entities/
    VaultSecret.cs              entidades: VaultSecret, VaultAccessLog, VaultKeyVersion
    DecryptedSecret.cs          DTO en memoria — nunca se persiste
  Repositories/
    VaultSecretRepository.cs    implementación de IVaultSecretRepository
  Security/
    VaultEncryptionService.cs   IVaultEncryptionService + AesGcmVaultEncryptionService
    ConfigurationMasterKeyProvider.cs  proveedor de clave maestra (Fase 1: appsettings)
  Services/
    SecretProviderService.cs    implementación de ISecretProvider — ÚNICA clase que usa VaultDbContext
  Registration/
    VaultServiceExtensions.cs   AddVaultServices() para Program.cs
```

### Grafo de dependencias

```
LuxuryApp.Api
  └─ LuxuryApp.Application ──► LuxuryApp.Infrastructure.Vault ──► LuxuryApp.Shared
  └─ LuxuryApp.Infrastructure
  └─ LuxuryApp.Infrastructure.Vault  (para AddVaultServices en Program.cs)
```

`LuxuryApp.Infrastructure` NO referencia `LuxuryApp.Infrastructure.Vault`.
Ningún proyecto excepto `LuxuryApp.Infrastructure.Vault` puede inyectar `VaultDbContext`.

---

## Cómo funciona

### Flujo de lectura (GET)

```
Servicio (ej. EmailService)
  → ISecretProvider.GetSecretAsync("smtp.password", tenantId)
    → caché hit → retorna string en memoria
    → caché miss → VaultSecretRepository.FindAsync()
      → AesGcmVaultEncryptionService.Decrypt(datos, keyVersion)
        → ConfigurationMasterKeyProvider.GetMasterKey(keyVersion)
      → registra VaultAccessLog
      → guarda en caché (TTL 5 min)
      → retorna string en memoria
```

La lectura no requiere rol específico. Cualquier servicio interno que reciba
`ISecretProvider` por DI puede leer secretos.

### Flujo de escritura (STORE / ROTATE / REVOKE)

```
Request HTTP con JWT que contiene rol SuperUsuario
  → ISecretProvider.StoreSecretAsync / RotateSecretAsync / RevokeSecretAsync
    → EnsureSuperUsuario() — lanza UnauthorizedAccessException si falla
    → AesGcmVaultEncryptionService.Encrypt(plaintext, currentKeyVersion)
      → ConfigurationMasterKeyProvider.GetMasterKey(currentKeyVersion)
    → VaultSecretRepository.AddAsync / UpdateAsync
    → registra VaultAccessLog con userId, IP y operación
```

Solo el rol `SuperUsuario` puede crear, rotar o revocar secretos.
Si el HttpContext no tiene ese rol, se lanza `UnauthorizedAccessException`
y se registra el intento fallido en el log.

### Cifrado

- Algoritmo: **AES-256-GCM**
- Nonce: 12 bytes generados con `RandomNumberGenerator.Fill` (único por operación)
- Tag: 16 bytes (autenticación del ciphertext)
- Clave: 32 bytes (256 bits) provista por `IMasterKeyProvider`

Cada `VaultSecret` almacena: `EncryptedValue`, `InitializationVector`, `AuthenticationTag` y
`KeyVersion`. Esto permite descifrar secretos cifrados con claves anteriores después de una rotación.

### Auditoría

Cada acceso (READ, CREATE, ROTATE, REVOKE) genera un registro en `VaultAccessLogs` con:
- `SecretId` — qué secreto se accedió
- `AccessedBy` — claim `sub` del JWT (ID del usuario)
- `Operation` — tipo de operación
- `ClientIP` — IP del solicitante
- `Success` — si la operación tuvo éxito
- `FailureReason` — razón en caso de fallo

---

## Configuración requerida

### appsettings.json (o variables de entorno)

```json
"ConnectionStrings": {
  "VaultDb": "Server=localhost;Database=LuxuryVault;User Id=...;Password=..."
},
"Vault": {
  "MasterKeys": {
    "V1": "BASE64_DE_32_BYTES_AQUI"
  }
}
```

Variables de entorno equivalentes:
```
ConnectionStrings__VaultDb=Server=...
Vault__MasterKeys__V1=BASE64_DE_32_BYTES_AQUI
```

### Generar una clave maestra nueva (PowerShell)

```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Importante:** esta clave debe guardarse en un lugar seguro fuera del repositorio.
Si se pierde, los secretos cifrados con ella no pueden recuperarse.

### Registrar en Program.cs

```csharp
using LuxuryApp.Infrastructure.Vault.Registration;

builder.Services.AddVaultServices(builder.Configuration);
```

---

## Migraciones

Ejecutar desde la raiz de la solución (`api/`):

```bash
dotnet ef migrations add InitialVault \
  --project LuxuryApp.Infrastructure.Vault \
  --startup-project LuxuryApp.Api

dotnet ef database update \
  --project LuxuryApp.Infrastructure.Vault \
  --startup-project LuxuryApp.Api
```

Esto crea tres tablas en `LuxuryVault`:
- `VaultSecrets`
- `VaultAccessLogs`
- `VaultKeyVersions`

---

## Cómo consumir desde otro servicio

```csharp
public class SmtpEmailService
{
    private readonly ISecretProvider _vault;

    public SmtpEmailService(ISecretProvider vault) => _vault = vault;

    public async Task SendAsync(...)
    {
        var password = await _vault.GetSecretAsync("smtp.gmail.password", tenantId: customerId);
        // usar password solo en memoria, no loggear ni persistir
    }
}
```

---

## Control de acceso por operación

| Operación | Método | Rol requerido |
|---|---|---|
| Leer secreto | `GetSecretAsync` | ninguno (servicio interno) |
| Crear secreto | `StoreSecretAsync` | `SuperUsuario` |
| Rotar clave | `RotateSecretAsync` | `SuperUsuario` |
| Revocar secreto | `RevokeSecretAsync` | `SuperUsuario` |

---

## Estado de implementación por fases

### Fase 1 — Vault con clave desde configuracion (ACTUAL)

- [x] Proyecto `LuxuryApp.Infrastructure.Vault` creado e integrado en la solución
- [x] Entidades `VaultSecret`, `VaultAccessLog`, `VaultKeyVersion`
- [x] `VaultDbContext` con `SaveChangesAsync` de auditoría
- [x] `AesGcmVaultEncryptionService` — cifrado AES-256-GCM
- [x] `ConfigurationMasterKeyProvider` — clave maestra desde `appsettings` / env vars
- [x] `SecretProviderService` — control de rol SuperUsuario en escrituras
- [x] `VaultServiceExtensions.AddVaultServices()` para DI
- [ ] **Pendiente:** migración y creación de base de datos `LuxuryVault`
- [ ] **Pendiente:** `"VaultDb"` en connection strings del entorno
- [ ] **Pendiente:** `"Vault:MasterKeys:V1"` generada y configurada
- [ ] **Pendiente:** `builder.Services.AddVaultServices(...)` en `Program.cs`

### Fase 2 — Migracion de secretos existentes

- [ ] Migrar tabla `Credential` (PasswordManager) de `ApplicationDbContext` a `VaultDbContext`
- [ ] Mover campos SMTP sensibles de `CustomerEmailConfiguration` a `VaultSecrets`
- [ ] Mover API keys de OneSignal, Brevo, FiscalAPI, Aspel a `VaultSecrets`
- [ ] Refactorizar servicios de email para consumir SMTP desde `ISecretProvider`
- [ ] Refactorizar servicios de facturación electrónica para consumir API key desde `ISecretProvider`

### Fase 3 — Rotacion de claves con versiones en BD

- [ ] Guardar metadata de versiones de clave en tabla `VaultKeyVersions`
- [ ] Job nocturno de `Hangfire` que re-cifra secretos con `KeyVersion` viejo al activo
- [ ] Endpoint `POST /vault/secrets/{name}/rotate` (SuperUsuario) para rotación manual
- [ ] Dashboard de estado del Vault (qué secretos existen, cuándo se accedieron)

### Fase 4 — Separacion completa de LuxuryConfig y LuxuryTenant

- [ ] Crear `ConfigDbContext` para entidades de configuración global (Identity, Customer, catálogos)
- [ ] Migrar `ApplicationDbContext` monolítico hacia `ConfigDbContext` + `TenantDbContext`
- [ ] Implementar `ITenantResolver` que lee la cadena de conexión de cada tenant desde `ISecretProvider`
- [ ] `TenantDbContextFactory` con resolución dinámica por `CustomerId`

---

## Restricciones de seguridad

1. **Nunca** loggear el valor descifrado de un secreto.
2. **Nunca** inyectar `VaultDbContext` fuera de `VaultSecretRepository`.
3. **Nunca** almacenar el `PlaintextValue` de `DecryptedSecret` más allá del scope del request.
4. La clave maestra `Vault:MasterKeys:V1` **nunca** debe entrar al repositorio git.
5. El usuario SQL de la aplicación tiene permisos de lectura/escritura en `VaultSecrets`
   pero **no DDL** en `LuxuryVault`.



   Lo que tienes que hacer tu
1. Generar la clave maestra
En PowerShell:


[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
2. Agregar en appsettings.json (o appsettings.Development.json)

"ConnectionStrings": {
  "VaultDb": "Server=...;Database=LuxuryVault;..."
},
"Vault": {
  "MasterKeys": {
    "V1": "AQUI_EL_BASE64_QUE_GENERASTE"
  }
}
3. Registrar en Program.cs

using LuxuryApp.Infrastructure.Vault.Registration;

builder.Services.AddVaultServices(builder.Configuration);
4. Crear y aplicar la migración

dotnet ef migrations add InitialVault --project LuxuryApp.Infrastructure.Vault --startup-project LuxuryApp.Api
dotnet ef database update --project LuxuryApp.Infrastructure.Vault --startup-project LuxuryApp.Api
Estructura final creada

LuxuryApp.Infrastructure.Vault/
  Abstractions/     IMasterKeyProvider, ISecretProvider, IVaultSecretRepository
  Data/             VaultDbContext, VaultDbContextFactory
  Entities/         VaultSecret, VaultAccessLog, VaultKeyVersion, DecryptedSecret
  Repositories/     VaultSecretRepository
  Security/         AesGcmVaultEncryptionService, ConfigurationMasterKeyProvider
  Services/         SecretProviderService  ← unico con acceso a VaultDbContext
  Registration/     VaultServiceExtensions.AddVaultServices()
