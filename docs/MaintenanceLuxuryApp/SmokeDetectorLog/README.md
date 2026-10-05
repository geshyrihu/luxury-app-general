# Modulo: SmokeDetectorLog (Bitacora de Detectores de Humo)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Registra inspecciones de detectores de humo: sin obstrucciones, sin contaminacion, sin dano fisico, LED OK, montaje seguro.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/BitacoraDetectorHumo/list/{detectorId}` | Historial |
| `GET` | `api/BitacoraDetectorHumo/{id}` | Inspeccion por ID |
| `POST` | `api/BitacoraDetectorHumo` | Crear |
| `DELETE` | `api/BitacoraDetectorHumo/{id}` | Eliminar |
