# Modulo: Inspections (Inspecciones)

> **Area funcional:** Operaciones / Calidad
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Gestion integral de inspecciones: configuracion de rutinas, ejecucion de inspecciones programadas, captura de resultados con evidencia fotografica y generacion de reportes.

## Servicios

| Servicio | Responsabilidad |
|----------|----------------|
| `Inspection` | CRUD configuraciones + vinculacion activos |
| `CustomerInspection` | Ejecucion, resultados, reportes |
| `CatalogInspection` | Catalogo maestro de criterios |
| `InspectionCondominiumAsset` | Gestion de areas/activos |
| `InspectionResultImage` | Evidencia fotografica |
| `InspectionReviewsCatalog` | CRUD criterios de revision |

**Reglas:** Frecuencia: Diaria, Semanal (dias seleccionados), Mensual (dia del mes). Resultados auto-generados del catalogo en primer acceso.
