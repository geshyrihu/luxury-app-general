# Modulo: ToolLoan (Prestamo de Herramientas)

> **Area funcional:** Mantenimiento / Inventario
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Controla el prestamo de herramientas a personal. Registra que herramienta se presto, a quien, fechas de salida/regreso y observaciones.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/ControlPrestamoHerramientas/list/{customerId}` | Lista paginada con busqueda/filtro |
| `GET` | `api/ControlPrestamoHerramientas/{id}` | Prestamo por ID |
| `POST` | `api/ControlPrestamoHerramientas` | Crear |
| `PUT` | `api/ControlPrestamoHerramientas/{id}` | Actualizar |
| `DELETE` | `api/ControlPrestamoHerramientas/{id}` | Eliminar |

**Nota:** El servicio live en `Machinery/Services/ControlPrestamoHerramientaAppService.cs`.
