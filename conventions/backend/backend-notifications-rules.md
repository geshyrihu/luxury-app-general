# Backend Notifications Rules — Email, Push, In-App, WhatsApp

**Ultima revision:** 2026-09-21
**Estado:** ✅ APROBADA (2026-08-12). Auditoría y plan de remediación completados; ejecución de 4 fases en progreso.

## Proposito

El sistema de notificaciones debe ser **centralizado, tipado y con URLs resueltas correctamente**. Este documento fija las reglas mínimas obligatorias mientras se remedia el estado actual. El detalle de la arquitectura y los hallazgos vive en los documentos de `docs/`.

## Documentos de detalle

1. [Estándar de Notificaciones](../../docs/SystemLuxuryApp/Notifications/20260812-especificacion-system-notificaciones.md) — arquitectura centralizada (aprobada):
   - orquestador único (`INotificationDispatcher`)
   - modelo tipado (`NotificationRequest`, enum `NotificationCategory`)
   - resolución de URLs centralizada (`INotificationUrlResolver`)
   - email con Razor + tokens del Design System (no hardcodes, NUNCA colores inline)
   - push OneSignal (URL absoluta resuelta; ruta relativa en `data.route`)
   - WhatsApp con plantillas tipadas
2. [Auditoría de Notificaciones](../../docs/SystemLuxuryApp/Notifications/20260812-auditoria-system-notificaciones.md) — estado actual y hallazgos:
   - A: URLs absolutas hardcodeadas (8 ubicaciones)
   - B: URLs relativas sin resolver en Push (5 ubicaciones)
   - C: base URL tomada de 4 fuentes distintas
   - D: colores hardcodeados fuera de marca (viola la regla de tokens CSS de CONVENTIONS.md §6.1)
   - matriz de módulos vs patrones violados y plan de remediación en 4 fases

## Reglas mínimas mientras se remedia

**Prohibido:**

- ❌ Hardcodear `https://luxurybuildingapp.com` en cualquier servicio de mensajería.
- ❌ Enviar URLs relativas a OneSignal (el campo `url` DEBE ser absoluta).
- ❌ Inline styles con colores literales en HTML de email (usar `EmailDesignTokens`).
- ❌ Crear DTOs nuevos con `LoginLink = "https://..."`; usar `IBaseUrlService.GetBaseUrlWeb()`.

**Obligatorio:**

- ✅ Toda URL en BD es relativa; la absoluta se resuelve en el dispatcher justo antes de enviar.
- ✅ Email siempre con Razor (no `StringBuilder`); las plantillas reutilizan `_EmailLayout.cshtml`, que inyecta `EmailDesignTokens`.
- ✅ Los adjuntos usan `IFileReadPathService.GetSecureFileUrl()`; no reconstruir `https://luxurybuildingapp.com/api/files/download?...` a mano.

## Servicios que DEBEN usarse (no reinventar)

| Servicio | Uso |
|----------|-----|
| `IBaseUrlService.GetBaseUrlWeb()` | Resolver la base URL web (uso en el dispatcher) |
| `IFileReadPathService.GetSecureFileUrl(...)` | Adjuntos de archivo (no construir URLs a mano) |
| `IRazorViewToStringRenderer` | Renderizar plantillas Razor (no `StringBuilder`) |
| `INotificationOrchestratorService` | Parcialmente; en transición a `INotificationDispatcher` |

## Impacto en auditoría

Hallazgo CRÍTICO ante URLs hardcodeadas, URLs relativas enviadas a Push, colores literales en HTML de email o adjuntos con URL armada a mano.

## Referencias

- [Backend Rules](./backend-rules.md)
- [Document Read/Write Pattern](./document-read-write-pattern.md) — `IFileReadPathService`
- [Design Tokens Rule](../ui/design-tokens-rule.md)
