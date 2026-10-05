# Modulo: ScheduledTasks (Tareas Programadas)

> **Area funcional:** Operaciones / Background Jobs
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Motor de trabajos background. Tareas recurrentes automatizadas via Hangfire para envio de reportes por correo, mantenimiento de estado de usuarios y validacion de roles del comite.

| Tarea | Schedule | Descripcion |
|-------|----------|-------------|
| `SendPendingTicketGroupReportAsync` | Lun-Sab 7 AM | Reporte tickets pendientes a admins |
| `SendRecruitmentReportAsync` | Lun 9 AM | Reporte estado reclutamiento |
| `SendContractsAndPoliciesExpirationNotificationsAsync` | Lun 9 AM | Alertas contratos por vencer (60 dias) |
| `MarkInactiveUsersOfflineAsync` | Cada 5 min | Marca usuarios Offline si LastSeen > 10 min |
| `SendVacanciesReportAsync` | Lun 9 AM | Reporte vacantes pendientes |
| `SendLegalReportAsync` | Lun 9 AM | Reporte tareas legales pendientes |
| `OnValidateForCustomer` | Lun 9 AM | Valida miembros del comite: acceso + rol "Comite" |
