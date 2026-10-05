# Modulo: ResponsablesCliente (Contactos del Cliente)

> **Area funcional:** Operaciones / Directorio
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Directorio central de contactos / motor de enrutamiento. Encuentra quien tiene cada rol para cada cliente. Usado para enrutamiento de correos, invitaciones a reuniones y notificaciones.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/responsables-cliente/por-rol?customerId=&role=` | Contactos por cliente + rol |
| `GET` | `api/responsables-cliente/sugeridos-agenda?customerId=&subjectType=&includeSystems=` | Invitados sugeridos para agenda (deduplicados, ordenados por rol) |

**Reglas:** 30+ metodos para obtener contactos por rol especifico. `GetSuggestedCalendarInviteesAsync` consolida, deduplica por email y ordena por rol.
