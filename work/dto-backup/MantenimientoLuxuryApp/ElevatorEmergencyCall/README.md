# Modulo: ElevatorEmergencyCall (Llamadas de Emergencia de Ascensores)

> **Area funcional:** Mantenimiento / Ascensores
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Registra llamadas de emergencia en ascensores: quien reporto, tecnico que atendio, fecha y observaciones.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/ElevatorsEmergencyCall/{id}` | Registro por ID |
| `GET` | `api/ElevatorsEmergencyCall/list/{customerId}` | Lista por cliente |
| `GET` | `api/ElevatorsEmergencyCall/elevators/{customerId}` | Ascensores disponibles (dropdown) |
| `POST` | `api/ElevatorsEmergencyCall` | Crear |
| `PUT` | `api/ElevatorsEmergencyCall/{id}` | Actualizar |
| `DELETE` | `api/ElevatorsEmergencyCall/{id}` | Eliminar |
