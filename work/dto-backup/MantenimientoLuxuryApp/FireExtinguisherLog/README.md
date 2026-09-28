# Modulo: FireExtinguisherLog (Bitacora de Extintores)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Registra inspecciones periodicas de extintores: presion adecuada, seguro, etiquetas, dano fisico. Accedido desde checklist QR y boton de inspeccion manual.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/BitacoraExtintor/list/{extinguisherId}` | Historial de inspecciones |
| `GET` | `api/BitacoraExtintor/{id}` | Inspeccion por ID |
| `POST` | `api/BitacoraExtintor` | Crear inspeccion |
| `DELETE` | `api/BitacoraExtintor/{id}` | Eliminar |

**Regla:** 6 campos booleanos de inspeccion. Inmutable despues de creada (sin update).
