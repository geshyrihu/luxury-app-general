# Modulo: Notification (Sistema de Notificaciones Multi-Canal)

> **Area funcional:** Sistema / Notificaciones
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-arquitectura`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Sistema de notificaciones multi-canal. Soporta notificaciones persistentes en BD (in-app con estado leido/no leido), push en tiempo real via SignalR, push mobile via OneSignal, y push web via OneSignal Web.

---

## Arquitectura

```
[Emisor (Jobs, Modulos, Sistema)]
  -> NotificationOrchestratorService
       -> NotificationUserAppService (BD - In-App)
       -> SendSignalRService (Tiempo real)
       -> ISendOneSignalService (Push Mobile)
       -> ISendOneSignalWebService (Push Web)
```

---

## Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/Notifications` | Notificaciones del usuario actual (ultimas 20) |
| `GET` | `api/Notifications/unread-count` | Contador de no leidas |
| `GET` | `api/Notifications/mark-as-read/{id}` | Marcar como leida |
| `GET` | `api/Notifications/users` | Listar usuarios activos |

### Testing / Infraestructura

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `api/Notifications/test-one-signal` | Test push mobile |
| `POST` | `api/Notifications/test-one-signal-web` | Test push web |
| `POST` | `api/Notifications/test-signal-r/{userId}` | Test SignalR a un usuario |
| `POST` | `api/Notifications/test-signal-users` | Test SignalR a multiples usuarios |
| `GET` | `api/Notifications/connected-users` | Usuarios conectados via SignalR |

---

## Canales de Notificacion

| Canal | Tecnologia | Persistencia | Alcance |
|-------|-----------|-------------|---------|
| In-App | SQL Server (NotificationUser) | Si | Usuario especifico |
| Tiempo Real | SignalR (NotificationHub) | No | Usuario o Grupo |
| Push Mobile | OneSignal | No | Usuario especifico |
| Push Web | OneSignal Web | No | Usuario especifico |

---

## Eventos SignalR del Hub

| Evento | Emisor | Descripcion |
|--------|--------|-------------|
| `ReceiveNotification` | `SendDTOUserAsync` | Notificacion generica in-app (refresco de gadget) |
| `ReceivePanicAlert` | `SendPanicAlertAsync` | Alerta de panico entrante para roles receptores (modulo `Tenant/Operations/PanicAlert`) |
| `ReceivePanicAlertAttended` | `SendPanicAlertAsync` (`isAttended: true`) | Aviso al emisor de que su alerta esta siendo atendida |
| `ReceiveBudgetProposalItemUpdate` | `SendBudgetProposalItemUpdateAsync` | Update de item de presupuesto propuesta (grupo) |
| `ReceiveProjectedExpenseUpdate` | `SendProjectedExpenseUpdateAsync` | Update de gasto proyectado |
| `ReceiveGoogleCalendarEventUpdate` | `SendGoogleCalendarEventUpdateAsync` | Update de eventos de calendario |
| `ReceiveNativeCollectionUpdate` | `SendNativeCollectionUpdateAsync` | Update de cobranza nativa (grupo por condominio) |

---

## Reglas de Negocio

1. **Orquestacion:** El `NotificationOrchestratorService` envia cada notificacion a traves de los 4 canales de forma secuencial.
2. **Ultimas 20:** Solo se recuperan las ultimas 20 notificaciones del usuario (sin paginacion aun).
3. **Modo Dev:** En desarrollo, todas las notificaciones SignalR se redirigen a un ID de usuario de prueba hardcodeado.
4. **Grupos SignalR:** Las actualizaciones de presupuesto (propuesta) y gastos proyectados usan grupos SignalR por `customerId + fiscalYear` para entrega selectiva.
5. **Multi-canal exception:** El patron Orchestrator es una excepcion arquitectonica intencional para escenarios cross-cutting (jobs, notificaciones del sistema).
