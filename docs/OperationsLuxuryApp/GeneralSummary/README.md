# Modulo: ResumenGeneral (Reportes Ejecutivos)

> **Area funcional:** Operaciones / Direccion
> **Owner tecnico:** `@equipo-operaciones`
> **Ultima actualizacion:** `2026-06-25`

---

Motor de reportes ejecutivos. Genera metricas de desempeno, porcentajes de ejecucion y resumenes operativos por cliente y periodo.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/ResumenGeneral/EvaluacionAreas/{fechaInicial}/{fechaFinal}` | Evaluacion por area (Contable/Operaciones/Legal) |
| `GET` | `.../ResultadoGeneral/{fechaInicial}/{fechaFinal}` | Clientes con reuniones en rango |
| `GET` | `.../ResumenMinutasGeneralGrupo/{fechaInicial}/{fechaFinal}` | Minutas agrupadas por reunion |
| `GET` | `.../ResumenMinutasGeneralLista/{fechaInicial}/{fechaFinal}` | Minutas listadas por cliente |
| `GET` | `.../EvaluacionAreasDetalle/{fecha}/{area}/{status?}` | Detalle de evaluacion por area |
| `GET` | `.../Posicion/{fechaInicial}/{fechaFinal}` | Ranking por % de ejecucion |
| `GET` | `.../ReporteResumenMinutas/{fechaInicial}/{fechaFinal}/{nivelReporte}` | Reporte resumen de minutas |
| `GET` | `.../ReporteResumenPreventivos/{fechaInicial}/{fechaFinal}` | Reporte preventivos |
| `GET` | `.../ReporteResumenTicket/{customerId}/{fechaInicial}/{fechaFinal}` | Reporte tickets por cliente |
| `GET` | `.../ReporteResumenTicket/{fechaInicial}/{fechaFinal}` | Reporte tickets global |

**Reglas:** Concluido + noAutorizado = atendido. % ejecucion = atendido/total*100. Excluye "LuxuryBuildingGroup" de la mayoria de reportes.
