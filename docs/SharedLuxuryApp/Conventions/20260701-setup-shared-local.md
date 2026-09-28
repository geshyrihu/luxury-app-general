# 🚀 Setup Local - LuxuryApp API & Angular Client

## 📋 Checklist de Configuración

### Backend (.NET)

#### 1. Actualizar `appsettings.Development.json`

El archivo ya existe con placeholders. Reemplaza con tus valores locales:

```bash
cd D:\repos\luxuryapp-api\api\LuxuryApp.Api
```

**Pasos:**

1. **Clave Maestra** (ya generada):
   - ✅ Valor actual: `zxUyYmN4YzNT34kCRzx9VST1Qk3gBEOj2qGdBzPDKrA=`
   - ✅ Ya está en el archivo

2. **Conexiones de BD** (actualiza con tus valores):
   ```json
   "ConnectionStrings": {
     "SQLServerConnection": "Data Source=YOUR_SERVER;Initial Catalog=LuxuryBuildingGroup;User ID=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True",
     "VaultDb": "Data Source=YOUR_SERVER;Initial Catalog=LuxuryAppVault;User ID=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True"
   }
   ```

3. **Otros Valores** (mantén placeholders si no tienes):
   - `JWT:key` - Usa un valor aleatorio de 32+ caracteres
   - `Mail:Password` - Tu contraseña SMTP local
   - `GoogleCalendar` - Deja en false si no tienes keys
   - `AiSettings` - Deja con endpoints locales

#### 2. Ejecutar la Aplicación

```bash
# Terminal en D:\repos\luxuryapp-api\api
dotnet run --configuration Development

# Debería iniciar en https://localhost:7069
# VaultSeeder corre automáticamente y cifra los secretos
```

**Log esperado:**
```
[INF] Vault seeder: 15 secretos sembrados correctamente.
```

#### 3. Verificar Vault

```bash
# Listar secretos (requiere token SuperUsuario)
curl -X GET "https://localhost:7069/api/vault-secrets/list" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Frontend (Angular)

#### 1. Actualizar `.env.local`

El archivo ya existe. Personaliza si es necesario:

```bash
cd D:\repos\luxuryapp-api\client\angular
```

**Los valores por defecto ya están configurados para desarrollo local:**
- API: `http://localhost:7070`
- Firebase: Valores de test
- OneSignal: App ID de test

#### 2. Instalar Dependencias

```bash
npm install
```

#### 3. Ejecutar en Desarrollo

```bash
# Terminal en D:\repos\luxuryapp-api\client\angular
npm start
# o
ng serve

# Abre http://localhost:4200
```

---

## 🔑 Archivos Generados (❌ NO COMMIT)

- ✅ `LuxuryApp.Api/appsettings.Development.json` - **GITIGNORED**
  - Contiene clave maestra local
  - Contiene conexiones locales
  
- ✅ `client/angular/.env.local` - **GITIGNORED**
  - Contiene variables de entorno locales

---

## 🔐 Variables que Necesitas (Llenar con Tus Valores)

### Si tienes credenciales reales:

```json
// En appsettings.Development.json
{
  "ConnectionStrings": {
    "SQLServerConnection": "Data Source=localhost;User ID=sa;Password=PASSWORD_LOCAL"
  },
  "Mail": {
    "Password": "TU_CONTRASEÑA_BREVO"
  },
  "BrevoSettings": {
    "ApiKey": "TU_API_KEY_BREVO"
  },
  "WhatsAppApi": {
    "Token": "TU_WHATSAPP_TOKEN"
  }
}
```

### Valores que Puedes Dejar en Placeholders (No afectan dev local):

- Google Calendar (si no lo usas)
- AI APIs (si solo usas endpoint local de Ollama)
- SMS/Push notifications

---

## ✅ Validación de Setup

### Backend

```bash
# Debería iniciar sin errores
dotnet run

# En logs busca:
# [INF] Vault seeder: X secretos sembrados correctamente.
# [INF] Application started. Press Ctrl+C to shut down.
```

### Frontend

```bash
# Debería compilar sin errores
npm start

# Abre http://localhost:4200 en navegador
# Debería cargar sin errores de CORS/secrets
```

### Verificar Integración

```bash
# En Angular (F12 Console)
console.log(environment.API_BASE_URL)  // http://localhost:7070/api/
console.log(environment.ONESIGNAL_APPID)  // deeb5e28-6ebc-4260-967e-1b64331122fc
```

---

## 🚨 Troubleshooting

### "VaultDb connection string not found"
- Verifica que `appsettings.Development.json` tenga `ConnectionStrings.VaultDb`
- Verifica que la BD `LuxuryAppVault` exista

### "Master key not found"
- Verifica que `appsettings.Development.json` tenga `Vault.MasterKeys.V1`
- Debe estar en Base64

### CORS errors en Angular
- Verifica que API esté en `http://localhost:7070`
- Backend debe tener CORS habilitado para `http://localhost:4200`

### "Vault seeder: omitiendo X porque el valor está vacío"
- Normal si no completaste todos los placeholders
- No afecta el funcionamiento local
- Los valores vacíos simplemente no se almacenan en Vault

---

## 📚 Documentación Relacionada

- [../../../docs/SystemLuxuryApp/Security/20260701-setup-system-secrets.md](./../../../docs/SystemLuxuryApp/Security/20260701-setup-system-secrets.md) - Guía completa de secrets
- [CONVENTIONS.md](./CONVENTIONS.md) - Convenciones del proyecto

---

## 🎯 Próximos Pasos

1. ✅ Llenar `appsettings.Development.json` con tus valores locales
2. ✅ Ejecutar `dotnet run`
3. ✅ Ejecutar `npm start` en Angular
4. ✅ Verificar logs y navegador
5. 📋 Ir a [../../../docs/SystemLuxuryApp/Security/20260701-setup-system-secrets.md](./../../../docs/SystemLuxuryApp/Security/20260701-setup-system-secrets.md) para producción

---

**Última actualización:** 2026-07-26
