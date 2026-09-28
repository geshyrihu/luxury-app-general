# Modulo: HydrantLog (Bitacora de Hidrantes)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Registra inspecciones de hidrantes: etiqueta presente, vidrio intacto, llave presente, manguera OK, boquilla presente, valvula operativa, candado OK, estado del gabinete.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/BitacoraHidrante/list/{hydrantId}` | Historial de inspecciones |
| `GET` | `api/BitacoraHidrante/{id}` | Inspeccion por ID |
| `POST` | `api/BitacoraHidrante` | Crear |
| `DELETE` | `api/BitacoraHidrante/{id}` | Eliminar |
