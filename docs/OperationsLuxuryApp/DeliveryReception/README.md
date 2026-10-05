# Modulo: DeliveryReception (Entrega-Recepcion)

> **Area funcional:** Operaciones / Administracion
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona el proceso de entrega-recepcion para transiciones de condominios: inventarios, organigramas, archivos de evidencia y flujo de validacion.

| Controller | Endpoints clave |
|------------|----------------|
| `EntregaRecepcion` | `GET` InventarioEquipos, Instalaciones, Insumos, Herramientas, Llaves, Mantenimientos, Organigrama, Extintores, Pendientes |
| `EntregaRecepcionCliente` | `PUT` Actualizar descripcion, ValidarArchivo, InvalidarArchivo, `DELETE` DeleteFile |
| `CatalogoEntregaRecepcionDescripcion` | CRUD completo + Grupos (SuperUsuario) |

**Reglas:** Archivos en `img/customers/{id}/entregarecepcion/`, flujo: usuario sube -> supervisor valida.
