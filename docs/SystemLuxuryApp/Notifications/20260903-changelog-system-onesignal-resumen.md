# 🔐 OneSignal Migration Summary — Sep 3, 2026

> **Versión**: 1.0 | **Archivos**: 9 | **Status**: ✅ COMPLETADO

---

## 📊 Cambios de un Vistazo

### Claves Actualizadas (Producción)
```
┌─────────────────┬──────────────────────┬──────────────────────┐
│ Componente      │ Antes                │ Después              │
├─────────────────┼──────────────────────┼──────────────────────┤
│ Web AppID       │ deeb5e28-... (old)   │ a4cdd6bf-... (NEW)   │
│ Web REST API    │ os_v2_app_33vv4... ✓ │ os_v2_app_utg5np...✓ │
│ Android AppID   │ ❌ Missing           │ a4cdd6bf-... (NEW)   │
│ Android REST    │ ❌ Missing           │ os_v2_app_utg5np...✓ │
└─────────────────┴──────────────────────┴──────────────────────┘
```

### Claves Desarrollo (Aislado)
```
┌─────────────────┬──────────────────────┬──────────────────────┐
│ Componente      │ Antes                │ Después              │
├─────────────────┼──────────────────────┼──────────────────────┤
│ Web AppID Dev   │ 1d454470-... (old)   │ 3d1f1ce3-... (NEW)   │
│ Web REST API    │ os_v2_app_dvcui4...  │ os_v2_app_huprzy...  │
│ Safari Web ID   │ ❌ Missing           │ web.onesignal.auto...│
└─────────────────┴──────────────────────┴──────────────────────┘
```

### Sincronización Backend ↔ Frontend ↔ Vault

```
┌──────────────────────────────────────────────────────────────┐
│  appsettings.json / appsettings.Development.json             │
│  (OneSignalWeb, OneSignalAndroid, OneSignalWebDev, ...)      │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ├──► VaultSeeder.cs (cifra y almacena en BD)
                 │
                 ├──► OptionsServiceExtensions.cs (inyecta en servicios)
                 │
                 ├──► SendOneSignalWebService.cs
                 │
                 └──► SendOneSignalService.cs (Android)
                      
┌──────────────────────────────────────────────────────────────┐
│  Angular: environment.ts / environment.prod.ts               │
│  (ONESIGNAL_APPID = a4cdd6bf-...)                           │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 └──► OneSignalService (Angular)
                      (SDK init con App ID público)
```

---

## 📁 Archivos Modificados (9 Total)

### Backend (.NET)
| # | Archivo | Cambio | Líneas |
|---|---------|--------|-------|
| 1 | `Vault/Seeds/VaultSecretNames.cs` | +4 constantes Android | +4 |
| 2 | `Vault/Seeds/VaultSeeder.cs` | +20 líneas seeding Android | +20 |
| 3 | `appsettings.json` | Web (upd) + Android (new) | ~10 |
| 4 | `appsettings.Development.json` | Web (upd) + Android (new) + AndroidDev (new) | ~15 |
| 5 | `DTOs/OneSignalAndroidSettingsDTO.cs` | ✨ NUEVO | +13 |
| 6 | `ServiceExtensions/OptionsServiceExtensions.cs` | Registra Android DI | ~10 |

### Frontend (Angular)
| # | Archivo | Cambio | Líneas |
|---|---------|--------|-------|
| 7 | `environment.ts` | ONESIGNAL_APPID (Dev `3d1f1ce3...`) + SAFARI_WEB_ID + ALLOWED_ORIGINS | ~5 |
| 8 | `environment.prod.ts` | ONESIGNAL_APPID (Prod `a4cdd6bf...`) + SAFARI_WEB_ID | ~3 |
| 9 | `core/services/one-signal.service.ts` | Leer y usar SAFARI_WEB_ID en init | ~8 |

### Auditoría & Scripts
| # | Archivo | Tipo | Uso |
|---|---------|------|-----|
| 9 | `audit/20260903-AUDITORIA-ONESIGNAL-MIGRACION.md` | 📋 Auditoría completa | Referencia post-deployment |
| 10 | `scripts/verify-onesignal-migration.sql` | 🔍 Script SQL | Validación en BD |

---

## 🚀 Verificación de Cambios

### Backend
```bash
# 1. Verificar constantes en Vault
grep -n "OneSignalAndroid" api/LuxuryApp.Application/Infrastructure/Vault/Seeds/VaultSecretNames.cs
# Esperado: 4 líneas nuevas

# 2. Verificar appsettings
grep -A 2 "OneSignalAndroid" api/LuxuryApp.Api/appsettings*.json
# Esperado: OneSignalAndroid + OneSignalAndroidDev en ambos archivos

# 3. Verificar DTO
ls api/LuxuryApp.Application/Shared/DTOs/OneSignalAndroidSettingsDTO.cs
# Esperado: Archivo existe
```

### Frontend
```bash
# 4. Verificar App ID en Angular
grep "ONESIGNAL_APPID" appsweb/angular/src/environments/environment*.ts
# Esperado: AMBOS usan "a4cdd6bf-373a-4dc6-b4d6-d34bf971c622"
```

### Vault (Post-Deploy)
```bash
# 5. Ejecutar script SQL de validación
sqlcmd -S <server> -d LuxuryAppVault -i docs/scripts/verify-onesignal-migration.sql
# Esperado: ✅ PASS en todos los checks
```

---

## ⚙️ Cómo Funciona la Inyección de Dependencias

### Startup (Program.cs)
```
1. AddCustomOptions() lee appsettings
   └─ Detecta si environment.IsDevelopment()
   └─ Selecciona: OneSignalAndroidDev o OneSignalAndroid
   └─ Services.Configure<OneSignalAndroidSettingsDTO>(section)

2. VaultSeeder.SeedAsync() se ejecuta
   └─ Lee valores de IConfiguration
   └─ Cifra con AES-256-GCM
   └─ Almacena en VaultDbContext

3. DependencyInjection registra servicios
   └─ AddScoped<ISendOneSignalService, SendOneSignalService>()
   └─ Inyecta IOptions<OneSignalAndroidSettingsDTO>
```

### Runtime (Cuando se envía push)
```
1. NotificationDispatcher.SendAsync() se llama
2. Inyecta SendOneSignalService (para Android)
3. Lee _settings.AppId y _settings.RestApiKey
4. Construye payload JSON
5. Llama OneSignal REST API con Authorization header
```

---

## 🔐 Seguridad

### ✅ Implementado
- [x] REST API Keys almacenadas **cifradas en Vault** (AES-256-GCM)
- [x] App IDs públicos (necesarios para SDK, no son secretos)
- [x] Separación dev/prod (diferentes secciones de config)
- [x] Auditoría de acceso (VaultAccessLog)
- [x] Inyección de dependencias (no hardcoding)

### ⚠️ A Considerar Post-Deployment
- [ ] Rotación de REST API Keys en OneSignal dashboard
- [ ] Revocación de claves antiguas
- [ ] Revisión de VaultAccessLogs
- [ ] Backup de LuxuryAppVault antes del deploy

---

## 📋 Checklist Pre-Deployment

- [ ] Los 8 archivos de código fueron modificados correctamente
- [ ] `OneSignalAndroidSettingsDTO.cs` existe y compila
- [ ] `appsettings.json` y `.Development.json` tienen nuevas secciones
- [ ] `OptionsServiceExtensions.cs` registra el nuevo DTO
- [ ] `VaultSecretNames.cs` tiene 4 nuevas constantes
- [ ] `VaultSeeder.cs` lee del appsettings correcto
- [ ] `environment.ts` y `environment.prod.ts` usan nuevo App ID
- [ ] Backend compila sin errores: `dotnet build`
- [ ] Frontend compila sin errores: `npm run build`

---

## 📡 Checklist Post-Deployment

### API (.NET)
- [ ] API start sin errores
- [ ] VaultSeeder ejecutó: buscar en logs "X secretos sembrados"
- [ ] Ejecutar SQL script de validación en LuxuryAppVault
- [ ] Test endpoint: `POST /api/system/test-one-signal-web`
- [ ] Test endpoint: `POST /api/system/test-one-signal` (Android)
- [ ] Recibir notificación de prueba en navegador

### Frontend (Angular)
- [ ] Build de producción: `ng build --configuration production`
- [ ] Deploy a luxurybuildingapp.com completado
- [ ] Abrir DevTools → Console
- [ ] Verificar: `[OneSignal] Inicializado con App ID: a4cdd6bf-373a-4dc6-b4d6-d34bf971c622`
- [ ] Recibir notificación en navegador de producción

### Monitoreo
- [ ] Revisar logs de errores por "OneSignal"
- [ ] Revisar VaultAccessLogs en BD
- [ ] Verificar dashboard de OneSignal (métricas de delivery)
- [ ] Confirmar que no hay excepciones en ErrorLog

---

## 🔄 Rollback (si es necesario)

```bash
# 1. Revertir código
git revert <commit-hash>

# 2. Restaurar appsettings de backup
cp appsettings.json.bak appsettings.json

# 3. Restaurar BD (si VaultSeeder creó registros)
sql-restore LuxuryAppVault-pre-migration

# 4. Redeploy
```

---

## 📚 Referencias

| Documento | Ubicación | Propósito |
|---|---|---|
| **Auditoría Completa** | `docs/audit/20260903-AUDITORIA-ONESIGNAL-MIGRACION.md` | Detalles técnicos, flow, riesgos |
| **Script SQL** | `docs/scripts/verify-onesignal-migration.sql` | Validación en Vault DB |
| **OneSignal Config** | `shared/notifications/one_signal.md` | Claves y credenciales |
| **Vault Documentation** | `api/LuxuryApp.Application/Infrastructure/Vault/documentacion-vault.md` | Arquitectura de Vault |

---

## ❓ FAQ

**P: ¿Por qué hay 4 nuevas constantes en VaultSecretNames?**  
R: OneSignal se configuró con `AppId` + `RestApiKey` para Android (Prod y Dev), más 4 combinaciones que requieren cifrado en Vault.

**P: ¿Qué pasa si el VaultSeeder no puede leer del appsettings?**  
R: Logging dice "omitiendo porque el valor está vacío" y continúa. Revisar que `OneSignalAndroid` existe en appsettings.

**P: ¿Puedo reutilizar el mismo App ID para Web y Android?**  
R: Sí, OneSignal permite un App ID unificado. Las REST API Keys son diferentes por seguridad.

**P: ¿Se pueden ver las REST API Keys en Vault?**  
R: No, están cifradas con AES-256-GCM. Solo servicios autorizados pueden desencriptarlas en runtime.

**P: ¿Qué pasa si la migración falla?**  
R: Revisar logs de VaultSeeder, ejecutar rollback, restaurar BD, y reintentar deployment.

---

**Última actualización**: 2026-09-03  
**Próxima revisión**: 2026-09-10 (post-deployment)
