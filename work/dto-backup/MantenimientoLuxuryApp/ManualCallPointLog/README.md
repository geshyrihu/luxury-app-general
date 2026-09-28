# Modulo: ManualCallPointLog (Bitacora de Estaciones Manuales)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Registra inspecciones de estaciones manuales de alarma: accesible y visible, housing OK, palanca OK, vidrio intacto, montaje seguro, senalizacion OK.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/BitacoraEstacionManual/list/{stationId}` | Historial |
| `GET` | `api/BitacoraEstacionManual/{id}` | Inspeccion por ID |
| `POST` | `api/BitacoraEstacionManual` | Crear |
| `DELETE` | `api/BitacoraEstacionManual/{id}` | Eliminar |
