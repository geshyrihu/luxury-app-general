# 🔐 Secrets Management Guide - LuxuryApp API & Client

**IMPORTANTE:** Este documento describe cómo manejar credenciales y claves sensibles de forma segura.

---

## 📋 Tabla de Contenidos

1. [Principios de Seguridad](#principios)
2. [Backend (.NET)](#backend-dotnet)
3. [Frontend (Angular)](#frontend-angular)
4. [CI/CD](#cicd)
5. [Auditoría](#auditoría)

---

## 🛡️ Principios de Seguridad {#principios}

### ❌ NUNCA HAGAS ESTO:
- ❌ Guardar secretos en archivos `.json`, `.ts`, `.cs` tracked en git
- ❌ Commit `appsettings.json` con contraseñas reales
- ❌ Commit `environment.ts` con API keys
- ❌ Usar hardcoded passwords en el código
- ❌ Compartir credenciales en Slack, email, o chats
- ❌ Usar la misma contraseña en dev/staging/prod

### ✅ SIEMPRE HAZ ESTO:
- ✅ Usar archivos `.gitignored` para desarrollo local (`.env.local`, `appsettings.Local.json`)
- ✅ Usar User Secrets en .NET desarrollo
- ✅ Usar environment variables en Angular
- ✅ Usar Azure Key Vault / AWS Secrets Manager en producción
- ✅ Usar CI/CD secrets (GitHub Actions, etc.) para despliegues
- ✅ Rotar credenciales regularmente
- ✅ Auditar acceso a secrets

---

## 🔧 Backend (.NET) {#backend-dotnet}

### Arquitectura: LuxuryApp Vault

Tu sistema usa un **Vault propio** (`LuxuryApp.Infrastructure.Vault`) con:
- ✅ Cifrado AES-256-GCM para todos los secretos
- ✅ Almacenamiento en BD (LuxuryAppVault en SQL Server)
- ✅ Soporte multi-tenant
- ✅ Versionado de claves maestras (rotación)
- ✅ Auditoría de acceso (VaultAccessLogs)
- ✅ Endpoints API para admin (solo SuperUsuario)

### Archivos de Configuración

```
LuxuryApp.Api/
├── appsettings.json              ← ✅ TRACKED (estructura, sin secretos)
├── appsettings.json.example      ← ✅ TRACKED (guía de qué configurar)
├── appsettings.Development.json  ← ❌ GITIGNORED (solo local - con clave maestra)
└── appsettings.Local.json        ← ❌ GITIGNORED (solo local - overrides)
```

### Configuración Local (Desarrollo)

#### 1. **Generar Clave Maestra** (Una sola vez)

Ejecuta en PowerShell para generar una clave maestra de 32 bytes (256 bits):

```powershell
# Generar clave maestra aleatoria
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Ejemplo output: WZ9kL2mN7pQ3rS5tU8vW1xY2zA4bC6dE8fG0hI2jK4l=
```

#### 2. **Configurar appsettings.Development.json**

Crear archivo `LuxuryApp.Api/appsettings.Development.json` (❌ NO COMMIT):

```json
{
  "AllowedHosts": "*",

  "ConnectionStrings": {
    "SQLServerConnection": "Data Source=.;Initial Catalog=LuxuryBuildingGroup;User ID=sa;Password=YOUR_LOCAL_DB_PASSWORD;TrustServerCertificate=True",
    "PostgreSQLConnection": "Host=localhost;Database=luxuryapp;Username=postgres;Password=YOUR_LOCAL_DB_PASSWORD",
    "VaultDb": "Data Source=.;Initial Catalog=LuxuryAppVault;User ID=sa;Password=YOUR_LOCAL_DB_PASSWORD;TrustServerCertificate=True"
  },

  "Vault": {
    "MasterKeys": {
      "V1": "WZ9kL2mN7pQ3rS5tU8vW1xY2zA4bC6dE8fG0hI2jK4l="  // ← Tu clave maestra local
    }
  },

  "JWT": {
    "key": "YOUR_LOCAL_JWT_SECRET_AT_LEAST_32_CHARS"
  },

  "Mail": {
    "Password": "YOUR_LOCAL_BREVO_PASSWORD"
  },

  "BrevoSettings": {
    "ApiKey": "YOUR_LOCAL_BREVO_API_KEY"
  },

  "WhatsAppApi": {
    "Token": "YOUR_LOCAL_WHATSAPP_TOKEN"
  },

  "GoogleCalendar": {
    "OAuthRefreshToken": "YOUR_LOCAL_OAUTH_REFRESH_TOKEN"
  },

  "AiSettings": {
    "Profiles": {
      "Abacus": {
        "ApiKey": "YOUR_LOCAL_ABACUS_API_KEY"
      }
    }
  }
}
```

#### 3. **Cómo Funciona el Vault en Startup**

En `Program.cs`, el `VaultSeeder` automáticamente:

1. Lee los valores de `appsettings.Development.json`
2. **Cifra cada valor** con la clave maestra usando AES-256-GCM
3. **Almacena en LuxuryAppVault** (BD SQL Server)
4. Marca como idempotente (no sobreescribe si ya existe)

**Resultado:** Los valores en `appsettings.Development.json` se cifrán y guardan en BD. La próxima vez que accedas, `ISecretProvider` descifra del Vault.

#### 4. **Usar Secrets en tu Código**

Inyectar `ISecretProvider` y usar:

```csharp
// En un servicio
public class MiServicio
{
    private readonly ISecretProvider _secretProvider;

    public MiServicio(ISecretProvider secretProvider)
    {
        _secretProvider = secretProvider;
    }

    public async Task HacerAlgo()
    {
        // Obtener secreto descifrado (solo en memoria)
        string jwtKey = await _secretProvider.GetSecretAsync("JwtSigningKey");
        string mailPassword = await _secretProvider.GetSecretAsync("MailSmtpPassword");
        
        // Usar en tu lógica...
    }
}
```

### Configuración Producción

#### 1. **Usar la Misma Arquitectura de Vault**

En producción, sigue el **mismo patrón**:
- Almacena secretos en Vault (la misma BD)
- Clave maestra = Rotada periódicamente (endpoint `/api/vault-secrets/{name}/rotate`)
- Acceso = Solo admin via endpoints SuperUsuario

#### 2. **appsettings.Production.json**

```json
{
  "ConnectionStrings": {
    "VaultDb": "Data Source=PROD_SERVER;Initial Catalog=LuxuryAppVault;User ID=prod_user;Password=PROD_DB_PASSWORD;TrustServerCertificate=True"
  },

  "Vault": {
    "MasterKeys": {
      "V1": "PROD_MASTER_KEY_BASE64"  // ← Diferente a development
    }
  }
}
```

#### 3. **Inyectar Clave Maestra en Deploy** (CI/CD)

```yaml
# .github/workflows/deploy.yml
env:
  VAULT_MASTER_KEY: ${{ secrets.PROD_VAULT_MASTER_KEY }}

jobs:
  deploy:
    steps:
      - name: Create appsettings.Production.json
        run: |
          cat > appsettings.Production.json << EOF
          {
            "Vault": {
              "MasterKeys": {
                "V1": "${{ env.VAULT_MASTER_KEY }}"
              }
            },
            "ConnectionStrings": {
              "VaultDb": "${{ secrets.PROD_VAULT_DB_CONNECTION }}"
            }
          }
          EOF
      
      - name: Deploy
        run: dotnet publish -c Release
```

#### 4. **Administrar Secretos en Producción**

Usar los endpoints del Vault (require rol `SuperUsuario`):

```bash
# Almacenar un nuevo secreto
POST /api/vault-secrets
{
  "secretName": "BrevoApiKey",
  "plainValue": "YOUR_PROD_BREVO_KEY",
  "secretType": "API_KEY"
}

# Actualizar valor
PUT /api/vault-secrets/BrevoApiKey
{
  "plainValue": "NEW_BREVO_KEY_VALUE"
}

# Rotar con nueva clave maestra
POST /api/vault-secrets/BrevoApiKey/rotate

# Revocar (dejar inactivo)
POST /api/vault-secrets/BrevoApiKey/revoke

# Listar (solo metadatos, sin valores)
GET /api/vault-secrets/list
```

---

## 🎨 Frontend (Angular) {#frontend-angular}

### Estrategia: Cargar Secrets desde Backend Vault

**Ideal:** Los secretos públicos (Firebase API Key, OneSignal App ID, etc.) se cargan desde tu backend Vault, no desde el código.

```
Arquitectura:
┌─────────────────┐
│   Angular App   │
│  (sin secrets)  │
└────────┬────────┘
         │ GET /api/config/public
         │
┌────────▼────────────────────┐
│  LuxuryApp.Api             │
│  ┌──────────────────────┐   │
│  │   ConfigEndpoint    │   │
│  │  (SuperUsuario)     │   │
│  └──────────┬───────────┘   │
│             │               │
│  ┌──────────▼───────────┐   │
│  │  ISecretProvider     │   │
│  │  (Lee del Vault)     │   │
│  └──────────┬───────────┘   │
│             │               │
│  ┌──────────▼───────────┐   │
│  │  LuxuryAppVault BD   │   │
│  │ (AES-256 encrypted)  │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

### Archivos de Configuración

```
src/environments/
├── environment.ts                ← ❌ GITIGNORED (solo local)
├── environment.example.ts        ← ✅ TRACKED (guía)
├── environment.prod.ts           ← ❌ GITIGNORED (solo local)
└── environment.prod.example.ts   ← ✅ TRACKED (guía)

.env.local                         ← ❌ GITIGNORED (variables locales)
.env.production.local              ← ❌ GITIGNORED (variables de prod)
```

### Configuración Local (Desarrollo)

#### 1. **Variables de Entorno (.env.local)**

Crear `.env.local` (no committed):

```bash
# .env.local
VITE_ONESIGNAL_APP_ID=deeb5e28-6ebc-4260-967e-1b64331122fc
VITE_FIREBASE_API_KEY=AIzaSyADtEWz84WzJ5jISUNI2y5_pKDxOeIlyLo
VITE_API_URL=http://localhost:7070
```

#### 2. **Cargar en environment.ts**

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,

  API_BASE_URL: 'http://localhost:7070/api/',
  ONESIGNAL_APPID: import.meta.env.VITE_ONESIGNAL_APP_ID || '',
  
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: 'onesignalwebproduction.firebaseapp.com',
    projectId: 'onesignalwebproduction',
    // ... otros campos
  },
};
```

### Configuración Producción (Recomendado)

#### Opción A: Endpoint de Configuración Pública (MEJOR)

Crear endpoint en `LuxuryApp.Api` que solo retorne valores públicos:

```csharp
// En LuxuryApp.Api/Features/Config/ConfigPublicEndpoints.cs
public sealed class ConfigPublicEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        app.MapGet("api/config/public", GetPublicConfig);
    }

    private static async Task<IResult> GetPublicConfig(ISecretProvider secretProvider)
    {
        // Retorna solo valores públicos desde el Vault
        return TypedResults.Ok(new
        {
            onesignalAppId = await secretProvider.GetSecretAsync("OneSignalAppId"),
            firebaseApiKey = await secretProvider.GetSecretAsync("FirebaseApiKey"),
            firebaseProjectId = "onesignalwebproduction",
            firebaseAuthDomain = "onesignalwebproduction.firebaseapp.com",
            measurementId = "G-3X95EL36J5",
        });
    }
}
```

Luego en Angular:

```typescript
// src/app/core/services/config.service.ts
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config$ = this.http.get<PublicConfig>('/api/config/public').pipe(
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}

  getConfig(): Observable<PublicConfig> {
    return this.config$;
  }
}

// En app.config.ts
import { ConfigService } from './core/services/config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    HttpClientModule,
    // Cargar configuración antes de bootstrapping
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.getConfig().toPromise(),
      deps: [ConfigService],
      multi: true,
    },
  ],
};
```

#### Opción B: CI/CD Secrets (Alternativa)

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Create environment.prod.ts
        run: |
          cat > src/environments/environment.prod.ts << EOF
          export const environment = {
            production: true,
            API_BASE_URL: 'https://luxurybuildingapp.com/api/',
            ONESIGNAL_APPID: '${{ secrets.ONESIGNAL_APP_ID }}',
            firebase: {
              apiKey: '${{ secrets.FIREBASE_API_KEY }}',
              authDomain: 'onesignalwebproduction.firebaseapp.com',
              projectId: '${{ secrets.FIREBASE_PROJECT_ID }}',
              messagingSenderId: '${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}',
              measurementId: '${{ secrets.FIREBASE_MEASUREMENT_ID }}',
            },
          };
          EOF
      
      - name: Build Angular
        run: npm run build:prod
      
      - name: Deploy
        run: # deploy commands
```

---

## 🚀 CI/CD {#cicd}

### GitHub Actions Secrets

Agregar SOLO la clave maestra en: `Settings > Secrets and variables > Actions`

```
PROD_VAULT_MASTER_KEY         # Base64-encoded 32 bytes
PROD_VAULT_DB_CONNECTION      # Conexión a LuxuryAppVault en prod
PROD_FIREBASE_API_KEY         # Para environment.prod.ts (solo valores públicos)
PROD_ONESIGNAL_APP_ID
```

**Nota:** El resto de secretos (JWT, DB password, API keys) se almacenan **en el Vault**, no en CI/CD.

### Ejemplo: Deploy con Vault

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      # ===== BACKEND (.NET) =====
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '10.0.x'
      
      # Crear appsettings.Production.json con clave maestra inyectada
      - name: Create appsettings.Production.json
        run: |
          cat > LuxuryApp.Api/appsettings.Production.json << 'EOF'
          {
            "ConnectionStrings": {
              "VaultDb": "${{ secrets.PROD_VAULT_DB_CONNECTION }}"
            },
            "Database": {
              "Provider": "SqlServer"
            },
            "Vault": {
              "MasterKeys": {
                "V1": "${{ secrets.PROD_VAULT_MASTER_KEY }}"
              }
            },
            "LuxuryApp": {
              "PathImg": "https://luxurybuildingapp.com/img",
              "PathApi": "https://luxurybuildingapp.com/api",
              "PathFront": "https://luxurybuildingapp.com"
            },
            "Logging": {
              "LogLevel": {
                "Default": "Information"
              }
            }
          }
          EOF
      
      - name: Build Backend
        run: |
          cd api
          dotnet build --configuration Release -p:EnvironmentName=Production
          dotnet publish -c Release -o publish-backend
      
      # ===== FRONTEND (Angular) =====
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # Opción A: Cargar secrets desde API (/api/config/public)
      # - name: Build Frontend (secrets desde backend)
      #   run: |
      #     cd client/angular
      #     npm install
      #     npm run build -- --configuration production
      
      # Opción B: Inyectar en environment.prod.ts (valores públicos solo)
      - name: Create environment.prod.ts
        run: |
          cat > src/environments/environment.prod.ts << 'EOF'
          export const environment = {
            production: true,
            API_BASE_URL: 'https://luxurybuildingapp.com/api/',
            API_DOMONIO: 'https://luxurybuildingapp.com',
            API_BASE_SIGNALR: 'https://luxurybuildingapp.com/ws/notificationHub',
            ONESIGNAL_APPID: '${{ secrets.PROD_ONESIGNAL_APP_ID }}',
            firebase: {
              projectId: 'onesignalwebproduction',
              appId: '1:333252186012:web:d950fb0be847a39b580259',
              storageBucket: 'onesignalwebproduction.firebasestorage.app',
              apiKey: '${{ secrets.PROD_FIREBASE_API_KEY }}',
              authDomain: 'onesignalwebproduction.firebaseapp.com',
              messagingSenderId: '333252186012',
              measurementId: 'G-3X95EL36J5',
            },
          };
          EOF
      
      - name: Build Frontend
        run: |
          cd client/angular
          npm install
          npm run build -- --configuration production
      
      # ===== DEPLOY =====
      - name: Deploy to Server
        run: |
          # Tus comandos de deploy (scp, rsync, docker push, etc.)
          echo "Deploying to production..."
```

### Mejor Práctica: Secretos solo en Vault

**NO hagas esto en CI/CD:**
```yaml
# ❌ MALO - No inyectes todos los secrets en build time
- name: Create appsettings.Production.json
  run: |
    cat > appsettings.json << EOF
    {
      "Mail": { "Password": "${{ secrets.PROD_MAIL_PASSWORD }}" },
      "BrevoSettings": { "ApiKey": "${{ secrets.PROD_BREVO_KEY }}" },
      "WhatsAppApi": { "Token": "${{ secrets.PROD_WHATSAPP_TOKEN }}" }
    }
    EOF
```

**Haz esto:**
```yaml
# ✅ BUENO - Solo inyecta lo que es público/necesario en build
- name: Create appsettings.Production.json
  run: |
    cat > appsettings.json << EOF
    {
      "ConnectionStrings": {
        "VaultDb": "${{ secrets.PROD_VAULT_DB_CONNECTION }}"
      },
      "Vault": {
        "MasterKeys": {
          "V1": "${{ secrets.PROD_VAULT_MASTER_KEY }}"
        }
      }
    }
    EOF
    # El resto de secrets vienen del Vault en runtime
```

---

## 🔍 Auditoría {#auditoría}

### Buscar Secrets en Git

```bash
# Buscar patrones de secretos en el historial
git log -S "password" --all
git log -S "api_key" --all --oneline
git log -S "secret" --all --oneline

# Buscar en archivos actuales
git grep -i "password\|secret\|token\|apikey" -- '*.json' '*.ts' '*.cs'
```

### Herramientas Recomendadas

- **git-secrets**: Prevenir commits de secrets
- **Vault**: Hashicorp Vault para secrets management
- **TruffleHog**: Scanear repositorio por credenciales
- **GitGuardian**: Monitorear públicamente por leaks

```bash
# Instalar git-secrets
brew install git-secrets  # macOS
choco install git-secrets # Windows

# Configurar pre-commit hook
git secrets --install
git secrets --register-aws
git secrets --add-provider -- cat ~/.ssh/private-keys-regex.txt
```

---

## ✅ Checklist Final

### INMEDIATO (Hoy)

- [ ] Generar clave maestra local: `[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`
- [ ] Crear `appsettings.Development.json` con clave maestra y BD local
- [ ] Crear `.env.local` en Angular con valores locales
- [ ] Crear archivos `.example` ✅
- [ ] Actualizar `.gitignore` en ambos repos ✅
- [ ] Instalar git-secrets: `brew install git-secrets`
- [ ] Configurar pre-commit hook: `git secrets --install`

### ESTA SEMANA

- [ ] Cambiar TODOS los secrets en servicios reales (BD, APIs externas)
- [ ] Generar clave maestra diferente para **producción**
- [ ] Agregar `PROD_VAULT_MASTER_KEY` a GitHub Actions secrets
- [ ] Agregar `PROD_VAULT_DB_CONNECTION` a GitHub Actions secrets
- [ ] Crear appsettings.Production.json en CI/CD (solo Vault connection + master key)
- [ ] Crear endpoint `/api/config/public` para cargar config en Angular
- [ ] Actualizar environment.prod.ts para usar endpoint público
- [ ] Auditar git history: `git log -S "password" --all`

### PRÓXIMAS DOS SEMANAS

- [ ] Limpiar git history con BFG Repo-Cleaner (después de cambiar secrets)
- [ ] Implementar rotación de claves maestras (endpoint `/api/vault-secrets/{name}/rotate`)
- [ ] Auditar acceso al Vault (tabla VaultAccessLogs)
- [ ] Documentar procedimiento de rotación en CLAUDE.md
- [ ] Auditar quién tiene acceso al repo (leak check)
- [ ] Usar TruffleHog: `trufflehog filesystem . --json`

### DOCUMENTACIÓN

- [ ] Actualizar CLAUDE.md con procedimiento de secrets
- [ ] Documentar cómo agregar nuevo secret al Vault
- [ ] Documentar cómo rotar claves maestras
- [ ] Crear guía para developers locales

---

## 📚 Referencias Útiles

- **VaultSeeder:** `LuxuryApp.Infrastructure.Vault/Seeds/VaultSeeder.cs`
- **ISecretProvider:** `LuxuryApp.Infrastructure.Vault/Abstractions/ISecretProvider.cs`
- **Vault Endpoints:** `LuxuryApp.Api/Features/Vault/VaultSecretsEndpoints.cs`
- **Configuration:** Revisar `Vault.MasterKeys` y `ConnectionStrings.VaultDb` en appsettings

---

**Última actualización:** 2026-07-26  
**Mantenido por:** Security Team  
**Sistema de Vault:** LuxuryApp.Infrastructure.Vault (AES-256-GCM, Multi-tenant, Versionado)
