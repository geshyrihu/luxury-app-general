# REPORTE SESIÓN: Estándar de Notificaciones + Auditoría

**Fecha:** 2026-08-12  
**Tema:** Definir estándar centralizado de notificaciones (Email, Push, In-App, WhatsApp) + auditar estado actual  
**Status:** ✅ COMPLETADO (propuesta + auditoría documentadas, pendiente aprobación)  
**Documentos entregados:** 3  
**Hallazgos críticos:** 4 (todas 🔴 severidad)

---

## 🎯 Objetivo

Unificar el sistema fragmentado de notificaciones del backend:
- **Hoy:** Cada feature decide por su cuenta (URLs hardcodeadas, estilos sueltos, orquestación parcial)
- **Mañana:** Un solo `INotificationDispatcher`, modelo tipado, URLs resueltas correctamente, marca centralizada

---

## 📋 Documentos Entregados

### 1. `20260812-notification-standard.md` (10.7 KB, 748 líneas)

**Ubicación:** `docs/specifications/20260812-notification-standard.md`  
**Propósito:** Arquitectura canónica futura  
**Secciones:**

| Sección | Tema | Líneas |
|---------|------|--------|
| 0-1 | Propósito y estado actual | 1-63 |
| 2-4 | Análisis de hoy (5 canales, patrones incoherentes, URLs rotas) | 64-173 |
| 5 | Estándar propuesto (orquestador, modelo tipado, URLs, email, push) | 174-394 |
| 6 | Ejemplos concretos (antes/después) | 395-632 |
| 7 | Plan de migración (4 fases, 15 horas estimadas) | 633-651 |
| 8 | Checklist de cumplimiento | 652-664 |
| 9-10 | Referencias + artefactos ya implementados | 665-748 |

**Hallazgos documentados:**
- 🟢 Email Razor + `_EmailLayout.cshtml` + `EmailDesignTokens.cs` (ya hecho en cimiento)
- 🟡 OneSignal Mobile/Web duplicado → consolidar en `OneSignalPayload` único
- 🔴 URLs: hardcodeadas absolutas, relativas sin resolver, base URL de 4 fuentes

**Destacable:**
```csharp
// Patrón único propuesto
await dispatcher.DispatchAsync(new NotificationRequest(
    ApplicationUserId: userId,
    Title: "Nuevo mensaje en tarea",
    Body:  "Se ha agregado un comentario.",
    Category: NotificationCategory.NewTask,
    Channels: [InApp, PushMobile, PushWeb, Email],
    ActionRoute: "/tasks/message/{id}",  // Relativa → resuelve a absoluta en dispatcher
    EmailTemplate: EmailTemplateRef.TaskNotification,
    EmailModel: viewModel,
    Subject: "Nuevo mensaje",
    To: [email]));
```

---

### 2. `20260812-AUDITORIA-NOTIFICACIONES.md` (9.2 KB, 416 líneas)

**Ubicación:** `docs/audit/20260812-AUDITORIA-NOTIFICACIONES.md`  
**Propósito:** Inventario de problemas hoy + matriz de módulos violadores  
**Secciones:**

| Hallazgo | Problema | Ubicaciones | Severidad |
|----------|----------|-------------|-----------|
| **A** | URLs absolutas hardcodeadas | 8 archivos, ~10 líneas | 🔴 CRÍTICA |
| **B** | URLs relativas sin resolver (Push OneSignal no navega) | 5 archivos, 5 líneas | 🔴 CRÍTICA |
| **C** | Base URL de 4 fuentes distintas | `IBaseUrlService` incompleto + 3 patrones distintos | 🔴 CRÍTICA |
| **D** | Colores hardcodeados (#0056b3, #28a745 vs #003152 de marca) | SendEmailAppService.cs + templates | 🔴 CRÍTICA |

**Matriz de módulos:**

| Módulo | A | B | C | D | Total |
|--------|---|---|---|---|-------|
| SendEmailAppService | ❌ 5 líneas | ⚠️ 1 línea | ❌ | ❌ | 6 violaciones |
| TaskAppService | — | ❌ 3 líneas | ⚠️ http: | — | 3 violaciones |
| CandidateNotificationCoordinator | ❌ | — | ❌ | — | 1 violación |
| RecoveryAccountUserAppService | ❌ http: | — | — | — | 1 violación |
| CommitteeWelcomeEmailDTO | ❌ | — | — | — | 1 violación |
| UserCredentialsEmailDTO | ❌ | — | — | — | 1 violación |
| FundingNotificationOrchestrator | — | ❌ | — | — | 1 violación |
| HrNotificationOrchestrator | — | ❌ | — | — | 1 violación |
| JuntaMensualNotificationOrchestrator | — | ❌ | — | — | 1 violación |
| **TOTAL** | **8** | **5** | **5** | **1** | **19 violaciones** |

**Plan de remediación:**
- Fase 1: Cimientos (2-4 h) — `GetBaseUrlWeb()`, `NotificationCategory` enum, `INotificationUrlResolver`
- Fase 2: Dispatcher (3-5 h) — `INotificationDispatcher`, deprecate old service
- Fase 3: Migrar features (8-12 h) — TaskAppService (9 llamadas), SendExecutivePendingReportAsync, Candidates, etc.
- Fase 4: Limpieza (2-3 h) — Borrar `SendOneSignalWebService` duplicado, literales de URL

---

### 3. Actualización a `CONVENTIONS.md`

**Sección agregada:** 5.9.1 Notificaciones  
**Contenido:** 
- Enlace a ambos documentos (propuesta + auditoría)
- 🔴 Reglas mínimas mientras se remedia
- ❌ Prohibiciones explícitas (hardcodes, relativas a OneSignal, estilos inline)
- ✅ Obligatorios (URLs relativas en BD, Razor siempre, usar servicios centrales)
- Servicios que DEBEN usarse (no reinventar)

**Líneas agregadas:** ~80

---

## 🔍 Hallazgos Críticos (Resumen)

### A. URLs Absolutas Hardcodeadas

**Ubicaciones:** 8 archivos, ~10 líneas

```csharp
// ❌ SendEmailAppService.cs:271
$"https://luxurybuildingapp.com/publico/operation-report-client/{customerId}/..."

// ❌ SendEmailAppService.cs:275,424,544,686
$"https://luxurybuildingapp.com/api/files/download?filePath={encoded}"  // Reinventa IFileReadPathService

// ❌ CandidateNotificationCoordinatorService.cs:645
"https://luxurybuildingapp.com"  // Hardcodeada, rompe en dev

// ❌ CommitteeWelcomeEmailDTO.cs:35, UserCredentialsEmailDTO.cs:29
LoginLink = "https://luxurybuildingapp.com/auth/login"

// ❌ RecoveryAccountUserAppService.cs:22
"http://luxurybuildingapp.com/auth/reset-password"  // http: (inseguro)
```

**Impacto:** Correos/emails con URLs que apuntan a prod incluso en dev.

---

### B. URLs Relativas Sin Resolver

**Ubicaciones:** 5 archivos, 5 líneas

```csharp
// ❌ TaskAppService.cs:728
Url = $"/tasks/message/{entity.Id}/{entity.WorkGroupId}"  // Relativa

await notificationOrchestratorService.NotifyUserAsync(notification);
// OneSignal recibe: { url: "/tasks/message/..." } → NO NAVEGA EN MÓVIL/WEB

// ❌ FundingNotificationOrchestrator.cs:20
route: "/funding/details/{id}"  // Relativa a OneSignal
```

**Impacto:** Push OneSignal no navega (espera URL absoluta en campo `url`).

---

### C. Base URL de 4 Fuentes Distintas

| Fuente | Uso | Problema |
|--------|-----|----------|
| `configuration["LuxuryApp:PathFront"]` | SolicitudBajaAppService:252 | No centralizado |
| `https://luxurybuildingapp.com` literal | CandidateNotificationCoordinator:645 | Hardcodeada |
| `IBaseUrlService.GetBaseUrlApi()` | Existe | Falta `GetBaseUrlWeb()` |
| `http://` vs `https://` | TaskAppService:748,749 | Inconsistente |

**Impacto:** Imposible cambiar base URL en un solo lugar.

---

### D. Colores Hardcodeados Fuera de Marca

| Archivo | Color Actual | Debería ser | Violación |
|---------|--------------|-------------|-----------|
| SendEmailAppService.cs:44 | `#0056b3` | `#003152` (primary-700) | CONVENTIONS §6.1 🔴 |
| SendEmailAppService.cs:44 | `Arial` | `Outfit` (DS) | CONVENTIONS §6.1 🔴 |
| _EmailLayout.cshtml (legacy) | `#0A2342` | `#003152` | CONVENTIONS §6.1 🔴 |
| Templates | `#28a745` | `#1e9b6d` (success-600) | CONVENTIONS §6.1 🔴 |

**Impacto:** Emails ven marca diferente a la app (usuario confundido).

---

## ✅ Cimientos Ya Implementados (§10)

El documento de propuesta referencia 3 artefactos ya creados:

### `EmailDesignTokens.cs` (espejo C# del Design System)

- Ruta: `api/LuxuryApp.Shared/Design/EmailDesignTokens.cs`
- Valores: `Primary = "#003152"`, `PrimaryHover = "#00568f"`, etc. (sincronizados con `client/angular/src/styles/core/*`)
- Estado: ✅ Compilado, 0 errores

### `_EmailLayout.cshtml` y `_EmailLayoutTable.cshtml`

- Rutas: `api/LuxuryApp.Api/Infrastructure/Email/Templates/Shared/`
- Inyecta `@inject IBaseUrlService`
- Lee colores/tipografía de `EmailDesignTokens` (no literales)
- Estado: ✅ Funciona en runtime, todas las plantillas lo heredan

### Validador de plantillas

- Existe desde antes: `EmailTemplateValidator.cs`
- Ensures templates en `EmailTemplates.cs` son válidas (previene que ruta literal rompa)

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Líneas de propuesta (`notification-standard.md`) | 748 |
| Líneas de auditoría (`AUDITORIA-NOTIFICACIONES.md`) | 416 |
| Secciones de CONVENTIONS.md actualizadas | 1 (5.9.1 Notificaciones) |
| Módulos auditados | 9 |
| Violaciones encontradas | 19 total (4 tipos) |
| Severidad de todas | 🔴 CRÍTICA |
| Fases de remediación | 4 |
| Horas estimadas de trabajo | ~15 horas |
| Artefactos de cimiento ya listos | 3 (EmailDesignTokens, layouts, validator) |

---

## 🚀 Próximos Pasos

### Inmediatos (esta semana)

1. **Tech Lead approval** — Revisar propuesta + auditoría
2. **Crear épica de remediación** — 4 fases, 15 horas
3. **Asignar Sprint 1** — Fase 1 (cimientos) a equipo

### Plan de Ejecución

**Fase 1 — Cimientos (2-4 h)** — SIN romper nada
- [ ] Extender `IBaseUrlService`: agregar `GetBaseUrlWeb()`, `GetBaseUrlPublic()`
- [ ] Crear `NotificationCategory` enum
- [ ] Crear `INotificationUrlResolver`
- [ ] Test: Verificar inyección de dependencias

**Fase 2 — Dispatcher (3-5 h)** — Interfaz nueva + deprecated
- [ ] Implementar `INotificationDispatcher`
- [ ] Marcar `NotificationOrchestratorService` `[Obsolete]`
- [ ] Test: `DispatchAsync` enruta a todos los canales

**Fase 3 — Migrar Features (8-12 h)** — Prioridad de módulos
1. TaskAppService (9 llamadas a reemplazar)
2. SendExecutivePendingReportAsync (StringBuilder → Razor)
3. CandidateNotificationCoordinator (hardcode → IBaseUrlService)
4. Recovery password (http: → https:)
5. DTOs (hardcode → config)

**Fase 4 — Limpieza (2-3 h)** — Remover lo viejo
- [ ] Eliminar `SendOneSignalWebService` duplicado
- [ ] Eliminar literales de URL
- [ ] Audit final: cero hardcodes

---

## 🎯 Criterios de Éxito

Post-remediación:

- [ ] Toda URL en BD es **relativa**
- [ ] Cero `https://luxurybuildingapp.com` literal en código backend
- [ ] Adjuntos usan `IFileReadPathService.GetSecureFileUrl()`
- [ ] Email siempre Razor + `EmailDesignTokens` (sin StringBuilder)
- [ ] Push usa `OneSignalPayload` único tipado
- [ ] `INotificationDispatcher` orquesta todos los canales
- [ ] Dev/prod resuelven base URL automáticamente desde config
- [ ] Test: Correo en dev tiene links a `localhost:3000`, prod a `luxurybuildingapp.com`

---

## 📁 Archivos Creados/Modificados

**Nuevos:**
- `docs/specifications/20260812-notification-standard.md` (propuesta en evaluación)
- `docs/audit/20260812-AUDITORIA-NOTIFICACIONES.md` (hallazgos + plan remediación)
- `docs/reporte_maestro/20260812-REPORTE-SESION-NOTIFICACIONES.md` (consolidación)

**Modificados:**
- `CONVENTIONS.md` — Agregada §5.9.1 Notificaciones (referencias a docs/audit + docs/specifications)

---

**Sesión completada:** 2026-08-12  
**Responsable:** Claude (análisis + documentación)  
**Siguiente:** Tech Lead aprobación + delegación a equipo

