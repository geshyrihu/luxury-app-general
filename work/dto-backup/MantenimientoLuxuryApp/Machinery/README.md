# Modulo: Machinery (Maquinaria y Equipos)

> **Area funcional:** Mantenimiento / Activos Fijos
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Gestiona el inventario completo de maquinaria y equipos del inmueble: bombas, ascensores, HVAC, etc. Incluye fotos, fichas tecnicas, documentos, historial de servicio y clasificaciones.

## Endpoints principales

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/Machineries/{id}` | Equipo por ID |
| `GET` | `api/Machineries/Fichatecnica/{id}` | Ficha tecnica detallada |
| `GET` | `api/Machineries/GetAllCard/{customerId}/{category}/{status}` | Tarjetas agrupadas por clasificacion |
| `GET` | `api/Machineries/list/{customerId}/{category}/{status}` | Lista con info de calendario |
| `POST` | `api/Machineries` | Crear (multipart con foto) |
| `PUT` | `api/Machineries/{id}` | Actualizar |
| `DELETE` | `api/Machineries/{id}` | Eliminar |
| `POST` | `api/Machineries/SubirDocumento/{machineryId}` | Subir documento PDF |
| `DELETE` | `api/Machineries/DeleteDocument/{id}` | Eliminar documento |
| `GET` | `api/Machineries/ServiceHistory/{machineryId}` | Historial de ordenes de servicio |
| `GET` | `api/Machineries/InventarioCompleto/{customerId}` | Inventario completo agrupado por categoria |
| `GET` | `api/Machineries/InformePdf/{customerId}` | Datos para reporte PDF |

## Clasificaciones (`api/EquipoClasificacion`)
CRUD de catalogos de clasificacion de equipos. Solo SuperUsuario.

## Reglas
- Fotos redimensionadas a 600x600
- Las imagenes se almacenan en directorio por cliente
- ServiceHistory muestra ordenes de servicio con estado `Concluido`
