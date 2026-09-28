# Notification Orchestration and Channels

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §18.2 (Notificaciones). Este archivo contiene ejemplos detallados.

## 4.6. Cuándo usar cada canal
- **Email**: Comunicaciones formales, reportes, recuperación de contraseña.
- **Push Móvil**: Alertas críticas (aunque el usuario no esté en la app).
- **Push Web**: Notificaciones al navegador.
- **SignalR**: Actualización de la UI en tiempo real (solo si el usuario tiene sesión abierta).
- **WhatsApp**: Exclusivo para tickets legales.

## Arquitectura Desacoplada (SendEmailGlobal)
**Prohibido** inyectar servicios de infraestructura (SMTP, SignalR, Push) en AppServices de negocio.
- Toda la lógica reside en: `LuxuryApp.Application/SendEmailGlobal/Features/{NombreFeature}/`.
- El `AppService` de negocio solo conoce la interfaz de notificación del módulo.
- **Templates Razor**: Archivos `.cshtml` viven junto a su lógica.

## Desarrollo (Development)
En este entorno, todas las notificaciones se **redirigen**:
- **Email**: Se envía a `gerente.mtto@luxurybuildingsite.com`.
- **Push & SignalR**: Se envían al ID de usuario de prueba `3e1ff763-c104-42fe-bb03-1e4c24493f89`.
