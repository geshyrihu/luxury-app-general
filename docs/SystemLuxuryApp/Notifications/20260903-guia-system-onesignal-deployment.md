# 🚀 OneSignal Migration — Deployment Checklist

**Fecha**: 2026-09-03  
**Duración estimada**: 30-45 minutos  
**Responsable**: DevOps / Tech Lead  
**Ambiente**: Producción (Web + Android)  

---

## 📋 FASE 0: PRE-DEPLOYMENT (30 min antes)

### Validación de Cambios
- [ ] **Compilación Backend**
  ```bash
  cd api/LuxuryApp.Api
  dotnet clean
  dotnet build -c Release
  # Esperado: 0 errores, 0 warnings
  ```
  
- [ ] **Compilación Frontend**
  ```bash
  cd appsweb/angular
  npm ci
  ng build --configuration production
  # Esperado: Build succeeded
  ```

- [ ] **Verificar archivos clave**
  ```bash
  # Backend
  grep -q "OneSignalAndroidSettingsDTO" api/LuxuryApp.Api/appsettings.json
  grep -q "OneSignalAndroid" api/LuxuryApp.Api/appsettings.Development.json
  
  # Frontend
  grep -q "a4cdd6bf-373a-4dc6-b4d6-d34bf971c622" appsweb/angular/src/environments/environment.prod.ts
  ```

### Backup Crítico
- [ ] **Backup de Base de Datos Vault**
  ```sql
  BACKUP DATABASE [LuxuryAppVault] 
  TO DISK = 'Z:\backups\LuxuryAppVault-pre-onesignal-2026-09-03.bak'
  WITH INIT, COMPRESSION;
  ```
  Guardar ruta: `_________________________________`

- [ ] **Backup de appsettings actual**
  ```bash
  # Backend
  cp api/LuxuryApp.Api/appsettings.json api/LuxuryApp.Api/appsettings.json.backup-20260903
  cp api/LuxuryApp.Api/appsettings.Development.json api/LuxuryApp.Api/appsettings.Development.json.backup-20260903
  
  # Frontend
  cp appsweb/angular/src/environments/environment.prod.ts appsweb/angular/src/environments/environment.prod.ts.backup-20260903
  ```

### Verificación en OneSignal Dashboard
- [ ] **OneSignal — Verificar nuevos App IDs**
  - [ ] Entrar a https://dashboard.onesignal.com
  - [ ] Verificar que App ID `a4cdd6bf-373a-4dc6-b4d6-d34bf971c622` existe
  - [ ] Verificar que está activo para Web
  - [ ] Verificar que está activo para Android
  - [ ] Copiar REST API Keys verificadas (guardar en notas seguras)

- [ ] **OneSignal — Verificar Apps antiguas**
  - [ ] Confirmar que apps viejas aún están activas (para rollback rápido)
  - [ ] No eliminar hasta 24h después de deployment

### Comunicación al Equipo
- [ ] **Notificar a stakeholders**
  ```
  Subject: [DEPLOYMENT] OneSignal Migration — Sep 3 8:00 PM UTC
  
  Users may experience 5-10 minute interruption in push notifications.
  Web & Mobile notifications will be unavailable briefly.
  
  Expected completion: 8:10 PM UTC
  ```
  Tiempo de inicio: `_____________` | Destinatarios notificados: `_____________`

---

## ⚙️ FASE 1: DEPLOYMENT BACKEND (10-15 min)

### Stop Current Service
- [ ] **Detener API actual**
  ```bash
  # En servidor de producción
  systemctl stop luxuryapp-api  # Linux
  # o
  net stop LuxuryAppApiService  # Windows
  ```
  Hora de parada: `_____________`

- [ ] **Verificar que se detuvo**
  ```bash
  curl -i https://luxurybuildingapp.com/api/health
  # Esperado: Connection refused o 503 Service Unavailable
  ```

### Deploy Backend
- [ ] **Copiar archivos de release**
  ```bash
  # Desde máquina local
  scp -r ./api/publish/* user@prod-api:/var/www/luxuryapp-api/
  # o
  Copy-Item -Path ".\api\publish\*" -Destination "\\prod-server\luxuryapp-api" -Recurse -Force
  ```

- [ ] **Verificar permisos en servidor**
  ```bash
  ls -la /var/www/luxuryapp-api/ | grep appsettings.json
  # Esperado: Archivo accesible, permisos correctos
  ```

### Ejecutar Migraciones
- [ ] **Ejecutar EF Core migrations**
  ```bash
  cd /var/www/luxuryapp-api
  dotnet LuxuryApp.Api.dll --environment Production --migrate
  # Esperado: "Database migrated successfully"
  ```

- [ ] **Verificar Vault DB**
  ```sql
  -- En servidor SQL
  USE LuxuryAppVault;
  SELECT COUNT(*) as SecretCount FROM VaultSecrets 
  WHERE SecretName LIKE 'onesignal.%' AND TenantId IS NULL;
  -- Esperado: 6+ (3 Web + 4 Android) o 7 si incluyendo Email
  ```

### Start Service
- [ ] **Iniciar API con variables de entorno**
  ```bash
  # Asegurar que ASPNETCORE_ENVIRONMENT=Production
  export ASPNETCORE_ENVIRONMENT=Production
  systemctl start luxuryapp-api
  ```

- [ ] **Verificar que inició**
  ```bash
  sleep 5
  curl -i https://luxurybuildingapp.com/api/health
  # Esperado: 200 OK, {"status":"healthy"}
  ```
  Hora de inicio: `_____________`

### Validar Vault Seeding
- [ ] **Revisar logs de Vault Seeder**
  ```bash
  tail -100 /var/log/luxuryapp-api.log | grep -i "vault\|seeded"
  # Esperado: "Vault seeder: X secretos sembrados correctamente"
  ```
  Línea exacta: `_________________________________`

- [ ] **Ejecutar SQL de validación**
  ```bash
  sqlcmd -S prod-sql-server -d LuxuryAppVault -i docs/scripts/verify-onesignal-migration.sql
  # Todos los checks deben ser ✅ PASS
  ```
  Resultado: `✅ PASS` / `⚠️ WARNING` / `❌ FAIL`

### Test Push (Backend)
- [ ] **Llamar endpoint de prueba — Web**
  ```bash
  curl -X POST https://luxurybuildingapp.com/api/system/test-one-signal-web \
    -H "Authorization: Bearer <ADMIN_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"userId":"<test-user-id>","title":"Test Push Web","message":"OneSignal migration successful"}'
  # Esperado: 200 OK, {"success":true}
  ```

- [ ] **Llamar endpoint de prueba — Android**
  ```bash
  curl -X POST https://luxurybuildingapp.com/api/system/test-one-signal \
    -H "Authorization: Bearer <ADMIN_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"userId":"<test-user-id>","title":"Test Push Android","message":"OneSignal migration successful"}'
  # Esperado: 200 OK, {"success":true}
  ```

---

## 🌐 FASE 2: DEPLOYMENT FRONTEND (10 min)

### Build Frontend
- [ ] **Generar build de producción**
  ```bash
  cd appsweb/angular
  ng build --configuration production --aot --optimization
  # Esperado: "✔ Compiled successfully"
  Tamaño del build: _____________ MB
  ```

- [ ] **Verificar que los environments se compilaron correctamente**
  ```bash
  grep -r "a4cdd6bf-373a-4dc6-b4d6-d34bf971c622" dist/
  # Esperado: Aparece en main.*.js
  ```

### Deploy Frontend
- [ ] **Copiar archivos dist/ a servidor web**
  ```bash
  # Desde máquina local
  scp -r ./appsweb/angular/dist/* user@prod-web:/var/www/luxurybuildingapp/
  # o
  Copy-Item -Path ".\appsweb\angular\dist\*" -Destination "\\prod-web\luxurybuildingapp" -Recurse -Force
  ```

- [ ] **Limpiar cache de servidor web**
  ```bash
  # Nginx
  systemctl reload nginx
  
  # IIS
  iisreset /restart
  
  # Apache
  systemctl reload apache2
  ```

### Validar Frontend
- [ ] **Verificar acceso a sitio**
  ```bash
  curl -I https://luxurybuildingapp.com
  # Esperado: 200 OK
  ```

- [ ] **Test en navegador — Open DevTools**
  1. Abrir https://luxurybuildingapp.com
  2. F12 → Console tab
  3. Buscar líneas de OneSignal
  4. Esperado dentro de 10 segundos:
     ```
     [OneSignal] SDK listo
     [OneSignal] Inicializado con App ID: a4cdd6bf-373a-4dc6-b4d6-d34bf971c622
     [OneSignal] Usuario logueado con ExternalUserId: <user-id>
     ```
  5. Capturar screenshot: `_____________`

---

## ✅ FASE 3: VALIDACIÓN POST-DEPLOYMENT (5-10 min)

### Recibir Notificaciones
- [ ] **Test de push web en navegador**
  1. Ir a https://luxurybuildingapp.com en navegador principal
  2. Hacer login con cuenta de prueba
  3. En admin panel, enviar notificación de prueba
  4. Verificar que aparece en navegador (esquina inferior derecha)
  5. Clickear en notificación → debe navegar a ruta
  6. Capturar screenshot: `_____________`

- [ ] **Test de push en móvil (si hay app nativa)**
  1. Instalar app Android desde Play Store
  2. Login con misma cuenta de prueba
  3. En admin panel, enviar notificación a usuario
  4. Verificar que aparece notificación en teléfono
  5. Capturar screenshot: `_____________`

### Monitoreo de Errores
- [ ] **Revisar Application Insights / Logs**
  ```bash
  # Linux
  tail -50 /var/log/luxuryapp-api.log | grep -i "error\|exception\|onesignal"
  
  # Windows
  Get-EventLog -LogName Application -Newest 50 | Select-Object Message | findstr /i "error onesignal"
  ```
  Errores encontrados: `_____________`

- [ ] **Revisar Vault Access Logs**
  ```sql
  USE LuxuryAppVault;
  SELECT TOP 20 * FROM VaultAccessLogs 
  WHERE AccessedAt >= GETUTCDATE() - INTERVAL '5 minute'
  ORDER BY AccessedAt DESC;
  -- Esperado: operaciones READ exitosas (Success = 1)
  ```
  Status: `✅ All successful` / `⚠️ Some failures`

### Performance Check
- [ ] **Verificar tiempos de respuesta**
  ```bash
  # Web push
  curl -w "Response time: %{time_total}s\n" \
    https://luxurybuildingapp.com/api/system/test-one-signal-web
  # Esperado: < 2 segundos
  
  # Android push
  curl -w "Response time: %{time_total}s\n" \
    https://luxurybuildingapp.com/api/system/test-one-signal
  # Esperado: < 2 segundos
  ```

- [ ] **CPU/Memory después del deployment**
  ```bash
  # Linux
  top -b -n 1 | head -20
  
  # Windows
  Get-Process LuxuryApp.Api | Select-Object ProcessName, CPU, Memory
  ```
  CPU: `_______%` | Memoria: `_______ MB`

### Dashboard OneSignal
- [ ] **Verificar métricas en OneSignal Dashboard**
  - [ ] Entrar a https://dashboard.onesignal.com
  - [ ] Verificar "Messages" → últimas 5 minutos
  - [ ] Verificar que muestra "Delivered: X, Failed: 0"
  - [ ] Verificar que AppID es el nuevo (a4cdd6bf...)

---

## 🔄 FASE 4: MONITOREO POST-DEPLOYMENT (24-48 h)

### Primeras 2 Horas
- [ ] **Cada 30 minutos: revisar logs**
  ```bash
  # Hora 0:00 ✓
  # Hora 0:30 ✓
  # Hora 1:00 ✓
  # Hora 1:30 ✓
  # Hora 2:00 ✓
  ```

- [ ] **Monitorear tickets/reportes de usuarios**
  - [ ] Slack #support
  - [ ] Jira / Bug tracker
  - [ ] Email alerts
  
  Reportes: `_____________`

### Primeras 24 Horas
- [ ] **Revisar volumen de notificaciones**
  ```sql
  USE LuxuryAppVault;
  SELECT 
    SecretName,
    COUNT(*) as AccessCount,
    MAX(LastAccessedAt) as LastAccess
  FROM VaultSecrets
  WHERE SecretName LIKE 'onesignal.%'
  GROUP BY SecretName;
  -- Esperado: Web y Android muestran accesos recientes
  ```

- [ ] **Revisar uptime del API**
  ```bash
  # Verificar que /health respondió en todas las horas
  curl -s https://luxurybuildingapp.com/api/health | jq .
  # Esperado: 200 OK, status: "healthy"
  ```

- [ ] **Revisar métricas de OneSignal**
  - [ ] Delivery rate > 95%
  - [ ] Open rate (esperado: 20-40%)
  - [ ] Sin spike de failures

### Primeras 48 Horas
- [ ] **Archivar backups seguros**
  ```bash
  # Guardar en long-term storage
  cp LuxuryAppVault-pre-onesignal-2026-09-03.bak /archive/2026-09/
  ```

- [ ] **Limpiar archivos temporales**
  ```bash
  rm -f api/LuxuryApp.Api/appsettings*.backup-20260903
  rm -f appsweb/angular/src/environments/environment*.backup-20260903
  ```

- [ ] **Documentar cualquier incidente**
  Si hubo problemas, crear ticket en Jira:
  ```
  Title: OneSignal Migration — Post-Deployment Issues
  Description: [Listar cualquier incidente, tiempo de resolución, causa raíz]
  ```

---

## ❌ ROLLBACK (Si es necesario)

### Immediate Actions (Primeros 5 min)
- [ ] **Detener API**
  ```bash
  systemctl stop luxuryapp-api
  ```

- [ ] **Restaurar código anterior**
  ```bash
  git revert HEAD --no-edit
  git push origin main
  ```

- [ ] **Restaurar BD Vault**
  ```sql
  RESTORE DATABASE [LuxuryAppVault] 
  FROM DISK = 'Z:\backups\LuxuryAppVault-pre-onesignal-2026-09-03.bak'
  WITH REPLACE, RECOVERY;
  ```

### Restart Service
- [ ] **Iniciar API con versión anterior**
  ```bash
  cd /var/www/luxuryapp-api-backup
  dotnet LuxuryApp.Api.dll
  ```

- [ ] **Verificar que funciona**
  ```bash
  curl -I https://luxurybuildingapp.com/api/health
  # Esperado: 200 OK
  ```

- [ ] **Restaurar frontend anterior**
  ```bash
  cp -r /var/www/luxurybuildingapp-backup/* /var/www/luxurybuildingapp/
  systemctl reload nginx
  ```

- [ ] **Verificar en navegador**
  - [ ] Abrir https://luxurybuildingapp.com
  - [ ] Verificar que carga correctamente
  - [ ] Revisar console para versión anterior de OneSignal App ID

### Post-Rollback
- [ ] **Notificar al equipo**
  ```
  Subject: ROLLBACK COMPLETED — OneSignal Migration Sep 3
  
  The deployment was rolled back to previous version.
  Root cause: [Describir qué salió mal]
  
  Investigation required: [Próximos pasos]
  ```

- [ ] **Documentar lecciones aprendidas**
  - Crear retrospectiva
  - Identificar qué no funcionó
  - Plan de remediación

---

## 📊 SIGNOFF & DOCUMENTATION

### Deployment Summary
```
Inicio:                  _____________
Fin:                     _____________
Duración total:          _____________ minutos
Status:                  ✅ SUCCESS / ❌ ROLLBACK
Incidentes:              _____________ 
Tickets abiertos:        _____________ 

Responsable:             _____________
Supervisor:              _____________
Firma:                   _____________ Fecha: _______
```

### Artefactos Generados
- [ ] Logs guardados: `_________________________________`
- [ ] Screenshots de validación: `_________________________________`
- [ ] Backup de DB: `_________________________________`
- [ ] Backup de config: `_________________________________`

### Cierre
- [ ] Notificar a stakeholders de éxito
- [ ] Actualizar status en Jira/Confluence
- [ ] Programar retrospectiva (si hubo incidentes)
- [ ] Programar monitoreo adicional (48-72h)

---

## 📞 CONTACTS DE EMERGENCIA

| Rol | Nombre | Teléfono | Email |
|---|---|---|---|
| DevOps Lead | _____________ | _____________ | _____________ |
| Tech Lead | _____________ | _____________ | _____________ |
| Product Owner | _____________ | _____________ | _____________ |
| OneSignal Support | support@onesignal.com | - | - |

---

**Última actualización**: 2026-09-03  
**Versión**: 1.0  
**Próxima revisión**: 2026-09-05 (post-deployment)
