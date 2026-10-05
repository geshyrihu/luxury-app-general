# Modulo: FireInspectionPeriods (Periodos de Inspeccion Contra Incendios)

> **Area funcional:** Mantenimiento / Seguridad Contra Incendios
> **Owner tecnico:** `@equipo-mantenimiento`
> **Ultima actualizacion:** `2026-06-25`

---

Sistema integral de gestion de inspecciones contra incendios. Define periodos de inspeccion, asigna equipos (extintores, hidrantes, estaciones manuales, detectores de humo), genera ciclos de inspeccion automaticos y registra resultados.

## Submodulos

### Periodos (`api/FireInspectionPeriod`)
CRUD de periodos de inspeccion con frecuencia (Mensual, Bimestral, Trimestral, etc.)

### Asignacion de Equipos (`api/FireInspectionPeriodItems`)
Asigna/desasigna equipos a periodos de inspeccion. Soporta extintores, hidrantes, estaciones manuales y detectores de humo.

### Ciclos (`api/FireInspectionCycle`)
Gestiona ciclos de inspeccion generados automaticamente segun la frecuencia del periodo.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `list/{customerId}` | Ciclos por cliente |
| `GET` | `active/{periodId}` | Ciclo activo actual |
| `POST` | `generate/{periodId}` | Generar nuevos ciclos |

### Resultados (`api/FireCycleInspection`)
Upsert de resultados de inspeccion por equipo dentro de un ciclo.

**Regla:** Frecuencia en dias: Mensual=30, Bimestral=60, Trimestral=90, Cuatrimestral=120, Quimestral=150, Semestral=180, Anual=365.
