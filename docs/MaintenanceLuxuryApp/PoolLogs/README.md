# Modulo: PiscinaBitacora (Bitacora de Alberca)

> **Area funcional:** Mantenimiento / Amenidades
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Registro diario de calidad del agua de albercas: lecturas quimicas (cloro, pH, temperatura) y actividades de mantenimiento.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/piscina-bitacora/{id}` | Entrada por ID |
| `GET` | `api/piscina-bitacora/list/{piscinaId}` | Historial por alberca |
| `POST` | `api/piscina-bitacora` | Crear |
| `PUT` | `api/piscina-bitacora/{id}` | Actualizar |
| `DELETE` | `api/piscina-bitacora/{id}` | Eliminar |
| `GET` | `api/piscina-bitacora/export-excel/{piscinaId}` | Exportar lecturas a Excel (filas) |
| `POST` | `api/piscina-bitacora/import-excel/{piscinaId}` | Importar lecturas desde Excel (valida duplicados Fecha+Hora) |
