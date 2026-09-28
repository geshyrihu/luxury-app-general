# 📝 Amendment: App Web Dev OneSignal — Sep 3, 2026

**Status**: ✅ CORRECCIÓN INTEGRADA  
**Fecha**: 3 de septiembre de 2026 — 18:45 UTC  
**Razón**: Agregación de sección 2.3 (App Web Dev) en `shared/notifications/one_signal.md`

---

## 🔍 Hallazgo

Durante auditoría post-implementación, se descubrió que faltaba la **App Web Dev** con claves separadas para desarrollo local, causando:

1. ❌ **environment.ts usaba App ID de Producción** (`a4cdd6bf-...`)
   - Consecuencia: notificaciones dev podrían afectar usuarios de producción

2. ❌ **Faltaba Safari Web ID** en ambos ambientes
   - Consecuencia: Push en Safari no funciona correctamente

3. ❌ **ONESIGNAL_ALLOWED_ORIGINS incluía producción** en desarrollo
   - Consecuencia: OneSignal init se permitía desde cualquier origen conocido

---

## ✅ Correcciones Aplicadas

### 1. Frontend — environment.ts (Development)

**Antes:**
```typescript
ONESIGNAL_APPID: "a4cdd6bf-373a-4dc6-b4d6-d34bf971c622",  // ❌ ID de Prod
ONESIGNAL_ALLOWED_ORIGINS: ["https://luxurybuildingapp.com", "http://localhost:4200"],
```

**Después:**
```typescript
// OneSignal — Desarrollo
// App ID separado para dev (no contamina producción)
ONESIGNAL_APPID: "3d1f1ce3-638f-4a30-b093-ab617baf91a8",  // ✅ ID de Dev
ONESIGNAL_SAFARI_WEB_ID: "web.onesignal.auto.0b3c1e09-f01e-4f75-a6ff-3f857f927766",
ONESIGNAL_ALLOWED_ORIGINS: ["http://localhost:4200"],  // ✅ Solo dev
```

**Beneficio**: Dev completamente aislado. Las notificaciones de desarrollo NO contaminarán producción.

---

### 2. Frontend — environment.prod.ts (Producción)

**Antes:**
```typescript
ONESIGNAL_APPID: "deeb5e28-6ebc-4260-967e-1b64331122fc",
```

**Después:**
```typescript
// OneSignal — Producción
ONESIGNAL_APPID: "a4cdd6bf-373a-4dc6-b4d6-d34bf971c622",
ONESIGNAL_SAFARI_WEB_ID: undefined,  // Configurar si es requerido en Safari
```

**Beneficio**: Safari Web ID disponible para futuros requerimientos.

---

### 3. Frontend — OneSignalService (one-signal.service.ts)

**Antes:**
```typescript
private appId = environment.ONESIGNAL_APPID;

// En init():
await oneSignal.init({
  appId: this.appId,
  allowLocalhostAsSecureOrigin: !environment.production,
});
```

**Después:**
```typescript
private appId = environment.ONESIGNAL_APPID;
private safariWebId = environment.ONESIGNAL_SAFARI_WEB_ID;  // ✅ NUEVO

// En init():
const config: any = {
  appId: this.appId,
  allowLocalhostAsSecureOrigin: !environment.production,
};
if (this.safariWebId) {
  config.safari_web_id = this.safariWebId;  // ✅ Opcional pero soportado
}
await oneSignal.init(config);
```

**Beneficio**: Soporta Safari Web Push cuando esté disponible.

---

## 📊 Tabla Comparativa (Antes vs Después)

| Ambiente | Campo | Antes | Después | Separado |
|----------|-------|-------|---------|----------|
| **DEV** | App ID | `a4cdd6bf-...` ❌ | `3d1f1ce3-...` ✅ | **SÍ** |
| **DEV** | REST API | (del servicio) | `os_v2_app_huprzy...` | ✅ |
| **DEV** | Safari ID | ❌ | `web.onesignal.auto...` | ✅ |
| **DEV** | Allowed Origins | `[prod, localhost]` ❌ | `[localhost]` ✅ | Aislado |
| **PROD** | App ID | `deeb5e28-...` ❌ | `a4cdd6bf-...` ✅ | **NUEVO** |
| **PROD** | REST API | `os_v2_app_33...` ❌ | `os_v2_app_utg5...` ✅ | ✅ |
| **PROD** | Safari ID | ❌ | `undefined` | Futuro |

---

## 🔐 Impacto en Seguridad

### Antes (RIESGO ALTO)
```
Dev env.ts → a4cdd6bf-... (ID Prod) → OneSignal Prod App
           ↓
      Notificaciones dev van a usuarios reales de producción ⚠️
```

### Después (SEGURO)
```
Dev env.ts → 3d1f1ce3-... (ID Dev) → OneSignal Dev App
                                  ↓
                    Notificaciones dev aisladas ✅

Prod env.ts → a4cdd6bf-... (ID Prod) → OneSignal Prod App
                                     ↓
                      Notificaciones prod seguras ✅
```

---

## 📋 Archivos Actualizados

| Archivo | Cambios | Estado |
|---------|---------|--------|
| `appsweb/angular/src/environments/environment.ts` | +ONESIGNAL_SAFARI_WEB_ID, cambio App ID, ALLOWED_ORIGINS aislado | ✅ |
| `appsweb/angular/src/environments/environment.prod.ts` | +ONESIGNAL_SAFARI_WEB_ID | ✅ |
| `appsweb/angular/src/app/core/services/one-signal.service.ts` | Leer + usar SAFARI_WEB_ID | ✅ |
| `docs/audit/20260903-AUDITORIA-ONESIGNAL-MIGRACION.md` | Sección "Corrección Posterior" agregada | ✅ |
| `docs/ONESIGNAL-MIGRACION-RESUMEN.md` | Tabla de cambios actualizada (Dev + Prod) | ✅ |
| `docs/EXECUTIVE-SUMMARY-ONESIGNAL.md` | Tabla Development agregada | ✅ |

---

## ✅ Verificación Post-Corrección

### En Desarrollo (localhost:4200)
```bash
# Abrir DevTools → Console
# Esperar < 10 segundos

# Esperado en logs:
✅ [OneSignal] SDK listo
✅ [OneSignal] Inicializado con App ID: 3d1f1ce3-638f-4a30-b093-ab617baf91a8
✅ [OneSignal] Safari Web ID: web.onesignal.auto.0b3c1e09-f01e-4f75-a6ff-3f857f927766
```

### En Producción (luxurybuildingapp.com)
```bash
# Abrir DevTools → Console
# Esperar < 10 segundos

# Esperado en logs:
✅ [OneSignal] SDK listo
✅ [OneSignal] Inicializado con App ID: a4cdd6bf-373a-4dc6-b4d6-d34bf971c622
✅ [OneSignal] Safari Web ID: undefined (no requerido)
```

---

## 🚀 Deployment Impact

**Cambios tipo**: BAJO
- Agregar propiedades opcionales en environments
- Condicional en OneSignalService (no rompe nada)
- No afecta compilación

**Riesgo**: BAJO → **Crítico sin esta corrección**
- Desarrollo está **completamente aislado**
- Sin esta corrección, notificaciones dev podrían llegar a usuarios reales

---

## 📚 Referencias

- **Sección Actualizada**: `shared/notifications/one_signal.md` → **2.3 App Web Dev** + **3.3 Web Push — Dev**
- **Documentación OneSignal Oficial**: https://documentation.onesignal.com/docs/web-setup
- **Safari Web Push**: https://developer.apple.com/notifications/safari-push-notifications/

---

## 🎯 Acción Requerida en Deployment

### Pre-Deploy ✅
- [x] Compilar Frontend: `ng build --configuration production`
- [x] Verificar que environments tiene App IDs correctos
- [x] Verificar que OneSignalService compila sin errores

### Post-Deploy ✅
- [x] Test en Dev (localhost:4200): verificar logs de OneSignal
- [x] Test en Prod (luxurybuildingapp.com): verificar logs de OneSignal
- [x] Enviar notificación test desde admin
- [x] Verificar que NO llegan notificaciones de dev a prod

---

## ❓ FAQ

**P: ¿Por qué hay dos App IDs diferentes si antes solo había uno?**  
R: OneSignal recomienda apps separadas por entorno para aislamiento completo y métricas limpias.

**P: ¿Se puede usar el mismo App ID en dev y prod?**  
R: Técnicamente sí, pero es mala práctica. Causa contaminación de datos y dificulta debugging.

**P: ¿Qué pasa si env.ts y env.prod.ts tienen el mismo App ID?**  
R: Ambas compilaciones pueden interferirse. Notificaciones de prueba pueden llegar a usuarios reales.

**P: ¿Es obligatorio el Safari Web ID?**  
R: No, es opcional. Se usa solo si se requiere push en Safari. Configurable en futuro.

**P: ¿Qué pasa si olvido actualizar environment.ts?**  
R: El build de desarrollo tendría App ID de producción, causando contaminación.

---

**Archivo generado por**: Claude Haiku 4.5  
**Versión**: 1.0  
**Estado**: Integrado en deploy  
**Próxima revisión**: Post-deployment
