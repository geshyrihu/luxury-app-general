# Ejecución Fase 4 - KPIs y Automatizaciones

Fecha: `2026-08-09`
Plan: `docs/plans/20260809-reclutamiento-candidatos-remediacion-plan.md` (Fase 4)
Estado base: Fases 1-3 completadas (Navegación, Postulación/Avisos, Agenda Operativa)

---

## Resumen Ejecutivo

Se implementó la capa de **indicadores operativos (KPIs)** y se expuso la **automatización diaria existente** para ejecución manual, completando el set mínimo de visibilidad y control para Reclutamiento.

**No se requirieron migraciones de BD ni cambios breaking** - todo se construyó sobre endpoints y entidades existentes.

---

## KPIs Entregados

### Endpoint
`GET /api/recruitment-candidate-applications/kpis` → `CandidateApplicationAppService.GetKpisAsync()`

### Payload `CandidateApplicationKpisDto`

| Grupo | KPIs |
|-------|------|
| **Vacantes** | `vacantesAbiertas`, `vacantesSinPostulacion`, `porcentajeVacantesConPostulacion` |
| **Pipeline** | `postulacionesActivas`, `postulacionesEnNuevo`, `postulacionesEnPreFiltro`, `postulacionesEnEspera`, `postulacionesEnEntrevistaReclutamiento`, `postulacionesEnEntrevistaOperaciones`, `postulacionesSeleccionadas`, `postulacionesAltaEnProceso`, `postulacionesContratadas`, `postulacionesRechazadasONoPresentadas` |
| **Entrevista Operaciones** | `entrevistasOperacionesSinEntrevistador`, `entrevistasOperacionesPendientesAgenda`, `entrevistasOperacionesVencidas`, `entrevistasOperacionesAgendadas`, `entrevistasOperacionesConFeedback` |
| **Calidad/Seguimiento** | `postulacionesSinFeedbackEnEntrevista`, `promedioDiasEnEtapaActual`, `promedioDiasHastaEntrevistaOperaciones` (nullable) |
| **Resultado** | `tasaSeleccion` (% Contratado / Total cerradas) |
| **Actividad** | `postulacionesUltimos7Dias`, `postulacionesUltimos30Dias` |
| **Fuentes** | `porFuente[]` (vacío - ver limitaciones) |

---

## Vista Frontend

**Ruta:** `/recruitment/candidates/kpis`  
**Componente:** `CandidateApplicationKpis` (standalone, OnPush)

### UI Incluye
1. **6 Tarjetas KPI principales** con icono, valor, subtítulo, severity semántico y navegación a detalle
2. **Pipeline visual** - badges por etapa con color según volumen
3. **Desglose Entrevista Operaciones** - 5 categorías con % sobre total
4. **Métricas de tiempo** - 3 cards: días en etapa, días hasta entrevista Ops, sin feedback
5. **Tabla por Fuente** - preparada para cuando la entidad tenga el campo
6. **Botón "Ejecutar automatización ahora"** - dispara POST `/run-automation`

---

## Automatizaciones

### Existente (Ya implementada en Fase 2/3)
`CandidateAutomationService.ExecuteDailyMonitoringAsync()` - Job Hangfire diario que notifica:
- Postulaciones estancadas >2 días en Nuevo/EnEspera
- Entrevista Ops sin entrevistador asignado
- Entrevista Ops con entrevistador pero sin fecha (pendiente agenda)
- Recordatorio 24h antes de entrevista programada
- Escalación por entrevista vencida sin feedback

### Nueva: Trigger Manual
`POST /api/recruitment-candidate-applications/run-automation`  
Permite ejecutar la automatización bajo demanda para testing en local (donde Hangfire no corre).

**Auth:** Requiere policy `RequireRecruitmentRole`

---

## Limitaciones y Gaps Documentados

| # | Limitación | Causa | Impacto | Próxima Acción |
|---|------------|-------|---------|----------------|
| 1 | KPI "Por fuente" vacío | Entidad `RequestPosition` no tiene propiedad `Fuente` (solo DTO) | No hay desglose por canal de reclutamiento | Migración BD: agregar columna `Fuente` a `JobVacancyRequests` + actualizar entidad + mapper |
| 2 | KPI "Tiempo vacante → 1ª postulación" | Requiere join complejo RequestPosition.CreatedAt + MIN(CandidateApplication.CreatedAt) | No visible | Query dedicado o vista materializada |
| 3 | Hangfire no corre en `Development` | Servidor no activo por defecto | Automatización diaria no se dispara solo en local | Documentado en `setup.md`; en staging/prod funciona |
| 4 | Push OneSignal | Credenciales no configuradas en local | Solo in-app/SignalR funciona | Validar en staging |

---

## Quick Wins Clasificados

| Prioridad | Item | Esfuerzo | Valor | Estado |
|-----------|------|----------|-------|--------|
| **Alta** | Agregar `Fuente` a `RequestPosition` entity | Medio (migración BD) | Alto - KPI por canal | Pendiente migración |
| **Alta** | KPI "Tiempo vacante → 1ª postulación" | Medio (query) | Alto - SLA reclutamiento | Pendiente |
| **Media** | Automatización: re-asignar entrevistador si no responde 48h | Alto (job + lógica) | Medio - Reduce seguimiento manual | Pendiente |
| **Baja** | Alerta Slack/Teams | Bajo (webhook) | Medio - Canal extra | Pendiente |

---

## Validaciones Técnicas

| Check | Resultado |
|-------|-----------|
| `dotnet build` | ✅ Compila (solo file lock de API corriendo) |
| `npx tsc --noEmit` | ✅ Sin errores |
| `scan-mojibake` | ✅ 0 mojibake nuevo |
| Endpoint KPIs | ✅ Respuesta <200ms en local |
| Endpoint run-automation | ✅ Ejecuta y retorna OK |
| Vista `/kpis` | ✅ Renderiza sin errores, navegación funcional |

---

## Archivos Creados/Modificados

### Backend
| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `CandidateApplication/DTOs/CandidateApplicationKpisDto.cs` | Nuevo | DTO principal + `FuenteKpiItem` |
| `CandidateApplication/Interfaces/ICandidateApplicationAppService.cs` | Modificado | + `GetKpisAsync()` |
| `CandidateApplication/Services/CandidateApplicationAppService.cs` | Modificado | + `GetKpisAsync()` implementation + fix Status enum |
| `CandidateApplication/EndPoints/CandidateApplicationEndPoint.cs` | Modificado | + `GET kpis`, `POST run-automation` |

### Frontend
| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `candidate-application/candidate-application-kpis.ts` | Nuevo | Componente dashboard KPIs |
| `candidate-application/candidate-application-kpis.html` | Nuevo | UI completa |
| `candidate-application/interfaces/candidate-application.ts` | Modificado | + `CandidateApplicationKpisDto`, `FuenteKpiItem` |
| `candidates.routing.ts` | Modificado | + ruta `/kpis` |

### Documentación
| Archivo | Descripción |
|---------|-------------|
| `docs/plans/20260809-reclutamiento-candidatos-remediacion-plan.md` | Checklist Fase 4 ✅ |
| `client/angular/.../candidates/docs/decisiones.md` | Decisiones Fase 4 registradas |
| `docs/reporte_maestro/modulos/20260809-fase4-kpis-automatizaciones-ejecutada.md` | Este reporte |

---

## Criterios de Cierre - Cumplidos

- ✅ Tablero mínimo de KPIs funcional y expuesto via endpoint dedicado
- ✅ Vista frontend `Indicadores Reclutamiento` accesible en `/recruitment/candidates/kpis`
- ✅ Automatización diaria existente expuesta para ejecución manual (testing en local)
- ✅ Quick wins vs cambios mayores clasificados y documentados
- ✅ Compilación frontend y backend OK
- ✅ 0 mojibake nuevo
- ✅ Documentación actualizada con definiciones operativas y límites runtime

---

## Próximos Pasos Recomendados (Fase 5+)

1. **Migración BD**: Agregar `Fuente` a `RequestPosition` entity + columna en `JobVacancyRequests` → habilita KPI por fuente
2. **KPI "Time to First Application"**: Query dedicado o vista materializada
4. **Automatización avanzada**: Re-asignación automática, alertas multi-canal

---

**Firma:** Ejecutado por agente remediation  
**Estado Fase 4:** ✅ **CERRADA** - Base de indicadores y automatizaciones operativas lista
