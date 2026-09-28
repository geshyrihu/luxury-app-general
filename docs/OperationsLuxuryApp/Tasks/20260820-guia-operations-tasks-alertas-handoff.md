# HANDOFF — Retomar en otra sesión

**Última sesión:** 2026-08-17
**Módulo:** Alertas de Tareas Recurrentes
**Skill:** `skills/planeacion-modulos/SKILL.md`

---

## Instrucción para pegar en la sesión nueva

> Usa la skill de planeación de módulos. Estamos AMPLIANDO (tipo B) el módulo
> "Alertas de Tareas Recurrentes". Ya completamos PASO 0, PASO 0.5, PASO 1 y PASO 2 (FASE 0),
> todo documentado en `docs/modulos-existente/alertas-tareas-recurrentes/`.
>
> Lee primero, en este orden:
> 1. `docs/modulos-existente/alertas-tareas-recurrentes/HANDOFF.md`
> 2. `README.md` (decisiones y bloqueadores)
> 3. `02-business-rules-analysis.md` (FASE 0 — fuente de verdad)
> 4. `01b-entidad-estructura.md` (entidades y GAPs)
> 5. `01-discovery-cuestionario.md` sólo si necesitas el detalle de alguna respuesta
>
> La FASE 0 está aprobada. Continúa en el **PASO 3: `03-riesgos-dependencias.md`**.
> No vuelvas a hacer el cuestionario ni el reconocimiento de entidades.

---

## Estado

| Paso | Documento | Estado |
| --- | --- | --- |
| 0 — Tipo y rutas | README.md | ✅ |
| 0.5 — Entidades | 01b-entidad-estructura.md | ✅ |
| 1 — Discovery | 01-discovery-cuestionario.md | ✅ |
| 2 — FASE 0 | 02-business-rules-analysis.md | ✅ aprobada |
| 3 — Riesgos y dependencias | 03-riesgos-dependencias.md | ⏳ SIGUIENTE |
| 4 — Plan | 04-implementation-plan.md | ⏳ |
| 5 — Gate objetivo | — | ⏳ |

---

## Contexto en 10 líneas

- **Problema:** contadores olvidaron pagos de ISR. 6 multas x ~$5,000 MXN = $30,000 MXN.
  Se detectó hasta que llegó la multa.
- **Causa raíz:** NO es falta de aviso. Es falta de control claro y de vigilancia externa.
- **Ya existe** el motor `TaskEngine`: plantillas, RRULE iCal, generación nocturna, festivos
  mexicanos, frontend completo. Funciona.
- **Falta:** avisa UNA sola vez al crear la tarea
  (`RecurringTaskGeneratorService.cs:164-178`) y nunca vuelve a insistir, no detecta
  vencimiento, no escala, no hay tablero.
- **El trabajo es extender ese motor**, no crear uno nuevo. 9 de 12 piezas se reutilizan.

---

## Decisiones cerradas (NO reabrir)

1. Escalación **híbrida por criticidad**: críticas escalan el mismo día, normales en digest semanal.
2. Destinatario: **organigrama (`OrgHierarchy`) + respaldo obligatorio** en toda tarea crítica.
3. Asignación anclada al **ROL** (`ApplicationRole` + `CustomerId`), NO al `WorkPosition`.
   Para escalar sí se usa `WorkPosition` porque el organigrama cuelga del puesto.
4. **Toda tarea tiene siempre responsable.** Cadena: usuario con el rol → jefe → respaldo.
   `TaskInstance.AssigneeId` sigue `[Required]`. **Sin cambio de esquema.**
5. `Vencida` es estado **derivado** (`DueDate < ahora AND CompletedAt IS NULL`), no persistido.
   No se modifica el enum global `Status`.
6. **Criticidad = enum NUEVO** del módulo. Prohibido reutilizar o modificar `PriorityLevel`.
7. Justificación la aprueba **el jefe del organigrama**. El responsable no puede auto-justificarse.
   Solicitar justificación **no detiene** las alertas.
8. Reasignar **conserva el `DueDate` original**.
9. Comprobante obligatorio **sólo en tareas críticas**.
10. Corte de tolerancia a **5 días** (cambiado el 2026-08-20; antes 30) → incumplimiento formal, notifica a `Direccion`, `SuperUsuario`, `SupervisionOperativa`, y la tarea **se arrastra, no se apaga**.
    El registro permanece visible como incumplimiento definitivo.
11. **Canales:** InApp, Push App, Push Web, Email, WhatsApp. **SMS fuera del alcance.**
12. Sólo `SuperUsuario` y `Direccion` pueden marcar una tarea como CRÍTICA.
13. **No hay datos históricos que migrar.** Se captura todo desde cero.

---

## Bloqueadores vivos

| ID | Qué | Quién |
| --- | --- | --- |
| B1 | `NotificationDispatcher.cs:34-39` lanza excepción con el canal WhatsApp. Hay que habilitarlo | Backend |
| B2 | WhatsApp exige plantillas aprobadas por Meta (Twilio Content Templates). Trámite externo de días/semanas. `IWhatsAppService` sólo tiene métodos fijos por caso de uso, sin envío genérico | Tech Lead |
| B4 | Falta baseline del KPI K6. Correr: `SELECT COUNT(*) FROM TaskInstances WHERE DueDate < GETUTCDATE() AND CompletedAt IS NULL;` | Tech Lead |

Deuda técnica fuera de alcance: `Providers/Services/SmsService.cs:9-32` es un placeholder que
retorna `SuccessResult(true)` sin enviar nada. Trampa para cualquier otro módulo. Ticket aparte.

---

## Riesgo #1 (PM-01)

Si nadie captura las obligaciones como tareas recurrentes, el módulo es irrelevante.
No hay datos previos que migrar, así que la **carga inicial manual es condición de existencia**.
Debe ir en el plan como fase con responsable nombrado y criterio de paso propio.

---

## Reglas de la skill que aplican al PASO 4

- **Sin cronograma inventado.** Secuenciación por dependencias + tamaño relativo (S/M/L).
  Las fechas las pone quien tiene capacidad, no el agente.
- **Tabla de reutilización obligatoria** antes de proponer cualquier entidad o campo nuevo.
  Base: sección "Tabla de reutilización" de `01b-entidad-estructura.md`.
- Migraciones clasificadas **reversibles vs irreversibles**, referenciando
  `conventions/operations/data-migration-protocol.md`.
- 11 secciones mínimas según
  `conventions/operations/plan-creation-protocol.md`.
- **Gate objetivo del PASO 5:** `node scripts/audit-conventions.mjs` y
  `node scripts/check-agent-rules.mjs` deben pasar. No vale autodeclarar cumplimiento.

---

## Rutas del código

| Capa | Ruta |
| --- | --- |
| Entidades | `api/LuxuryApp.Infrastructure.Data/Data/Entities/Tenant/Operations/TaskEngine/` |
| Aplicación (mal ubicada, bajo Reclutamiento) | `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Reclutamiento/Recruitment/RecurringTasks/` |
| Job | `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Workers/RecurringTaskGenerationJob.cs` |
| Catálogo de jobs | `api/LuxuryApp.Application/Moduls/AdminLuxuryApp/Infraestructura/Jobs/Catalog/HangfireJobCatalog.cs` |
| Frontend | `client/angular/src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/` |

**No confundir** con `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/`, que es otro
sistema de tareas (operativas, grupos de trabajo, tickets legales). No se toca.
