# Modulo: Reports (Registro de Entregas de Reportes)

> **Area funcional:** Contabilidad / Reportes
> **Tag de version:** `v0.1` (Temprano)
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Estado Actual

**Modulo esqueleto/temprano.** Actualmente sin implementacion funcional completa.

Contiene:
- `ReportSubmissionRecordAppService` — Servicio sin metodos implementados (TODO pendiente)
- `EmergencyMapper` — Mapping para telefonos de emergencia (no relacionado directamente)
- `DestinatariosEmailReporteDTO` — DTO para destinatarios de correo con nivel de privacidad

---

## Pendiente

- [ ] Implementar `IReportSubmissionRecordAppService` con metodos CRUD
- [ ] Definir endpoint en controller
- [ ] Integrar con FinancialReport para registrar entregas de estados financieros
