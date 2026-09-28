# Plan de Migración: Unificación de Redundancia en Reclutamiento

> **Fecha:** 2026-08-19
> **Módulo:** Reclutamiento / Altas y Bajas (ReclutamientoLuxuryApp)
> **Autor:** Sprint de Estabilización (Ticket 3 — A8)
> **Estado:** Propuesta para equipo de Datos (no ejecutar en producción sin aprobación de Tech Lead + DBA)

---

## 1. Contexto y Deuda Técnica

El flujo de Reclutamiento replica información entre **4 entidades** que, conceptualmente,
deberían derivar de una sola fuente de verdad:

| Entidad | Rol | Campos redundantes |
| --- | --- | --- |
| `Candidate` | La persona | `CandidateStatus Status`, `CreatedAt` |
| `CandidateProcess` | Proceso fusionado candidato↔vacante | `CandidateId`, `RequestPositionId`, `CandidateProcessStatus ProcessStatus`, `DateOnly? SelectedAt`, `DateTime? HiringRequestedAt`, `DateOnly? HiredEntryDate`, `DateTime? ClosedAt`, `DateTime? FinalDecisionAt` |
| `RequestPosition` | Vacante solicitada | `int Folio` (`VAC{Folio:D5}`), `Status`, `DateOnly? SelectionDate`, `DateOnly? EntryDate`, `DateOnly? DateFinish` |
| `RequestEmployeeRegister` | Solicitud de alta de empleado | `int Folio`, `Status`, `Guid? CandidateId`, `DateOnly? ExecutionDate` |

**Síntomas observados en producción:**
- **Folio duplicado:** `RequestPosition.Folio` (`VACxxxxx`) se copia a `RequestEmployeeRegister.Folio`.
- **Estatus triplicado:** `RequestPosition.Status` ⟷ `RequestEmployeeRegister.Status` ⟷ `CandidateProcess.ProcessStatus` (más `CandidateProcess.CurrentStage`) deben mantenerse sincronizados manualmente en cada servicio.
- **Fechas de selección/ingreso duplicadas:** `SelectedAt` / `SelectionDate` / `ExecutionDate` y `HiredEntryDate` / `EntryDate` viven en entidades distintas sin un dueño claro.
- **`CandidateId` redundante:** presente en `CandidateProcess` y en `RequestEmployeeRegister`.

Esto genera divergencias silenciosas (un folio o estatus "se queda atrás" tras una actualización parcial) y
dificulta cualquier reporte de verdad.

**Objetivo de este plan:** establecer **1 sola fuente de verdad** para el **Folio** y para las
**Fechas de Selección / Ingreso**, eliminando la redundancia **sin pérdida de datos en producción** y
manteniendo el sistema reversible en cada fase.

---

## 2. Principios Rectores (no negociables)

1. **Cero pérdida de datos.** Ninguna fase borra información hasta que está comprobada la sincronización.
2. **Revertibilidad.** Cada cambio de esquema tiene su `down`/rollback idempotente.
3. **Fuente de verdad explícita.** Se nombra un dueño canónico por concepto; el resto lo *refleja*, no lo *copia*.
4. **Sin big-bang.** Fase 1 estabiliza sin tocar el esquema; Fase 2 consolida sólo tras evidencia de sincronía.
5. **Auditoría de divergencias.** Se mide la desviación antes/después de cada fase.

---

## 3. Fuente de Verdad Canónica (propuesta)

| Concepto | Dueño canónico | Reflejo (sólo lectura) |
| --- | --- | --- |
| **Folio de vacante** | `RequestPosition.Folio` | `RequestEmployeeRegister.Folio` (FK lógica) |
| **Estatus de la vacante** | `RequestPosition.Status` | `RequestEmployeeRegister.Status`, `CandidateProcess.ProcessStatus` |
| **Fecha de selección** | `RequestPosition.SelectionDate` | `CandidateProcess.SelectedAt` |
| **Fecha de ingreso** | `RequestEmployeeRegister.ExecutionDate` | `CandidateProcess.HiredEntryDate`, `RequestPosition.EntryDate` |
| **Persona** | `Candidate.Id` | `CandidateProcess.CandidateId`, `RequestEmployeeRegister.CandidateId` (FK) |

> Justificación: `RequestPosition` es la entidad de negocio más temprana y estable del ciclo; el alta de
> empleado (`RequestEmployeeRegister`) y el proceso fusionado (`CandidateProcess`) son derivados de ella.

---

## 4. Fase 1 — Estabilización y Sincronización (sin cambios destructivos)

> Objetivo: detener la *generación* de nueva deuda y reconciliar la existente, sin alterar el esquema.

### 4.1 — Backfill y reconciliación de datos (script único, idempotente)
- Script SQL/read-only que reporta divergencias (`RequestPosition.Folio <> RequestEmployeeRegister.Folio`,
  `ABS(DATEDIFF(d, SelectionDate, SelectedAt)) > 0`, triplicidad de estatus) en un log de auditoría.
- No muta datos en esta sub-fase; sólo produce el reporte base (línea base de deuda).
- En caso de divergencia, se aplica la regla de resolución: **el valor canónico (§3) sobreescribe al reflejo**,
  registrándolo en `CandidateStageHistory`/log para trazabilidad.

### 4.2 — Sincronización a nivel de aplicación (capa de servicios)
- Centralizar la escritura de folio/estatus/fechas en **un único método del servicio de negocio**
  (p. ej. `RequestPositionAppService.SyncDownstreamStateAsync`) que, tras actualizar la canónica,
  propaga a `RequestEmployeeRegister` y `CandidateProcess` en la **misma transacción de `SaveChangesAsync`**.
- Los endpoints (p. ej. `CandidateProcessEndPoint`, `RequestEmployeeRegisterEndPoints`) dejan de escribir
  redundancias directamente; delegan en el método central.
- Reutilizar el patrón ya aplicado en este sprint: **commit de BD primero, efectos secundarios (storage/notificaciones) después**.

### 4.3 — Validación en runtime (guarda de coherencia)
- `IEntityValidator`/filtro de dominio que, al leer, compara canónica vs reflejo y emite *warning* (no exception)
  cuando divergen, para detectar regresiones tempranas.

### 4.4 — Gate de auditoría
- Métrica periódica (job de mantenimiento) que cuenta divergencias; se considera "estable" cuando el conteo es 0
  durante N días consecutivos. **Prerrequisito para entrar a Fase 2.**

### 4.5 — Rollback de Fase 1
- Código puramente aditivo (nuevos métodos de sincronización + validadores). Revertir = quitar los nuevos métodos;
  el esquema no cambió, por lo que **no hay riesgo de datos**.

---

## 5. Fase 2 — Consolidación de Esquema

> Ejecutar **solo** tras N días de "estable" (§4.4). Aquí sí se modifica el esquema, siempre de forma reversible.

### 5.1 — Migración de columnas (EF Migration + SQL idempotente)
- **Folio:** `RequestEmployeeRegister.Folio` se marca obsoleto; se sustituye su lectura por
  `JOIN RequestPosition.Folio`. Tras el periodo de gracia, se elimina la columna.
- **Estatus:** `RequestEmployeeRegister.Status` y `CandidateProcess.ProcessStatus` quedan como *computed/derivados*
  (vista o columna mantenida por el método central de §4.2). Se elimina la escritura independiente.
- **Fechas:** `CandidateProcess.SelectedAt` y `HiredEntryDate` pasan a ser *reflejo* de
  `RequestPosition.SelectionDate` / `RequestEmployeeRegister.ExecutionDate` (vía JOIN o trigger de sincronización).
  `RequestPosition.EntryDate` se unifica con `ExecutionDate` como fecha de ingreso canónica.

### 5.2 — Script de migración (sketch)
```sql
-- 1) Backfill de reflejos desde la canónica (idempotente)
UPDATE rer SET rer.Folio = rp.Folio
FROM RequestEmployeeRegister rer
JOIN RequestPosition rp ON rp.Id = rer.RequestPositionId
WHERE rer.Folio <> rp.Folio;

-- 2) Validación: ninguna divergencia restante
SELECT COUNT(*) FROM RequestEmployeeRegister rer
JOIN RequestPosition rp ON rp.Id = rer.RequestPositionId
WHERE rer.Folio <> rp.Folio;  --> debe ser 0

-- 3) (post-gracia) drop de columna redundante
-- ALTER TABLE RequestEmployeeRegister DROP COLUMN Folio;  -- con migration down correspondiente
```

### 5.3 — Actualización de servicios y contratos
- `SelectItemAppService` / endpoints que hoy leen folios/estatus redundantes pasan a leer la canónica.
- DTOs de salida mantienen los mismos nombres de campo (mapeados desde la fuente) → **sin breaking change de API**.

### 5.4 — Pruebas
- Pruebas de integración que simulan actualización de la canónica y verifican el reflejo en las otras entidades
  dentro de la misma transacción.
- Prueba de rollback: aplicar migration `up`, validar, aplicar `down`, validar reversibilidad.

### 5.5 — Rollback de Fase 2
- Cada `ALTER` tiene su `down` (recrear columna desde la canónica). Las lecturas reflejo vuelven a la columna local.
- Como Fase 1 ya mantenía los valores sincronizados, el `down` no pierde información.

---

## 6. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Divergencia histórica no reconciliada | Datos distintos post-migración | Backfill + reporte de auditoría (§4.1) antes de cualquier `DROP` |
| Regresión por servicio que escribe redundancia | Reaparece la deuda | Validador en runtime (§4.3) + centralización de escritura (§4.2) |
| `DROP` prematuro de columna | Pérdida si la sincronía falla | Periodo de gracia + migration `down` (§5.5) |
| Breaking change de API | Clientes fallen | DTOs mantienen nombres; mapeo desde canónica (§5.3) |

---

## 7. Métricas de Éxito

- **0** divergencias de folio/estatus/fechas reportadas por el gate de auditoría (§4.4).
- Tiempo medio de sincronización entre canónica y reflejo < 1 transacción (mismo `SaveChangesAsync`).
- Cobertura de pruebas de integración para la sincronización ≥ existente en el módulo.
- Rollback de Fase 2 verificado en entorno de staging sin pérdida de datos.

---

## 8. Aprobaciones Requeridas

- [ ] Tech Lead (arquitectura de fuente de verdad)
- [ ] DBA / Equipo de Datos (scripts SQL y ventana de mantenimiento)
- [ ] QA (plan de pruebas de Fase 2)

> ⚠️ Este documento es **planificación únicamente**. No se modifica el esquema de base de datos como parte
> del Ticket 3; la ejecución de Fase 1/2 queda sujeta a las aprobaciones de la sección 8.
