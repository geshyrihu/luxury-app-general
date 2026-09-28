# Modulo: ElevatorSpareParts (Cambio de Refacciones de Ascensores)

> **Area funcional:** Mantenimiento / Ascensores
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Registra cambios de refacciones en ascensores: pieza, clave, precio, descripcion de falla. Genera folio autoincrementable por cliente.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/ElevatorSparePartsChange/{id}` | Registro por ID |
| `GET` | `api/ElevatorSparePartsChange/list/{customerId}` | Lista por cliente |
| `GET` | `api/ElevatorSparePartsChange/elevators/{customerId}` | Ascensores (dropdown) |
| `POST` | `api/ElevatorSparePartsChange` | Crear |
| `PUT` | `api/ElevatorSparePartsChange/{id}` | Actualizar |
| `DELETE` | `api/ElevatorSparePartsChange/{id}` | Eliminar |

**Regla:** Folio auto-generado: `RFC[0:3]-{secuencial:D4}` (ej. ABC-0001).
