# Modulo: DireccionDashboard (Dashboard de Direccion)

> **Area funcional:** Operaciones / Direccion
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Dashboard ejecutivo para rol "Direccion". Provee vistas consolidadas de agenda, contratos, ausencias, reclutamiento y tareas legales.

## Submodulos

- `GET api/direccion-dashboard/agenda-semanal` — Agenda 2 semanas desde Google Calendar
- `GET api/direccion-dashboard/agenda-meses` — Proyeccion multi-mes (1-12 meses)
- `GET api/direccion-dashboard/contratos-por-vencer` — Contratos por vencer (2 meses)
- `GET api/direccion-dashboard/contratos-vigentes` — Contratos vigentes con dias restantes
- `GET api/direccion-dashboard/personal-ausente` — Personal ausente prox. 10 dias (roles clave)
- `GET api/direccion-dashboard/reclutamiento-resumen` — Solicitudes de vacante pendientes
- `GET api/direccion-dashboard/tareas-legal` — Tareas legales activas agrupadas
