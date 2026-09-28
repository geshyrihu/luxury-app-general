# Decisiones Tech Lead — Aprobadas e Implementadas 2026-08-12

**Aprobador:** Tech Lead  
**Fecha:** 2026-08-12  
**Referencia:** reporte-coherencia.md + análisis 4-hallazgos  
**Status:** ✅ IMPLEMENTADAS

---

## 1. § 5.9.1 Notificaciones — ✅ APROBADA

**Decisión:** Aprobar regla como obligatoria.

**Cambios aplicados en CONVENTIONS.md:**
- Línea 614: Cambiar 🔴 CRÍTICA → ✅ **APROBADA (2026-08-12)**
- Línea 618: Quitar "Propuesta de arquitectura centralizada (en evaluación)"
- Línea 618: Cambiar a "Arquitectura centralizada (aprobada)"
- Línea 651: Cambiar "Propuesta + auditoría completadas. Pendiente aprobación Tech Lead"
- Línea 651: Cambiar a "✅ Aprobada. Auditoría + plan de remediación completados. Ejecución de 4 fases en progreso."

**Consecuencias:**
- Regla entra en vigor YA
- Código nuevo debe seguir patrón INotificationDispatcher centralizado
- Validación en code review es obligatoria
- 19 violaciones existentes en plan de remediación 4 fases (15 horas)

**Artefactos asociados:**
- `docs/specifications/20260812-notification-standard.md` (748 líneas, especificación completa)
- `docs/audit/20260812-AUDITORIA-NOTIFICACIONES.md` (hallazgos reales)
- `docs/reporte_maestro/20260812-REPORTE-SESION-NOTIFICACIONES.md` (consolidación)

---

## 2. § 5.9.2 Background Jobs (Hangfire) — ✅ APROBADA

**Decisión:** Aprobar regla como obligatoria.

**Cambios aplicados en CONVENTIONS.md:**
- Línea 655: Cambiar 🔴 CRÍTICA → ✅ **APROBADA (2026-08-12)**
- Línea 655: Cambiar "Sistema Hangfire implementado (29 jobs), documentación faltaba"
- Línea 655: Cambiar a "Sistema Hangfire implementado (29 jobs), documentación completada"
- Línea 662: Cambiar "Reglas mínimas (mientras se remedia documentación)"
- Línea 662: Cambiar a "Reglas obligatorias"
- Línea 690: Cambiar "Plan de remediación: [...]" 
- Línea 690: Cambiar a "Status (2026-08-12): ✅ Aprobada. Fases 1-3 completadas (18/19 jobs refactorizados). Fase 4 (gobernanza permanente) en progreso."

**Consecuencias:**
- Regla entra en vigor YA
- Fases 1-3 YA EJECUTADAS (18/19 jobs con ExecuteAsync(), try-catch-throw, logging Stopwatch)
- Nuevos jobs DEBEN cumplir patrón (IJobService, naming XyzJob, etc.)
- Fase 4: validación en PRs + audit trimestral

**Artefactos asociados:**
- `conventions/backend/backend-jobs-hangfire.md` (396 líneas, patrón completo)
- `conventions/backend/backend-jobs-checklist.md` (template copy-paste)
- `docs/plans/20260812-PLAN-JOBS-REMEDIACION.md` (4 fases, cronograma)
- `docs/audit/20260812-VALIDACION-JOBS-REMEDIACION.md` (95% compliance alcanzado)

---

## 3. § 4.7 Documentos Módulo Existente — 6 OBLIGATORIOS (SIN OPCIONALES)

**Decisión:** Eliminar item opcional #7, fijar conteo en 6 documentos obligatorios.

**Cambios aplicados en CONVENTIONS.md:**
- Línea 245: Cambiar "Documentos a crear (6 documentos obligatorios)"
- Línea 246: Agregar "Todos obligatorios. Sin excepciones opcionales."
- Línea 324: ELIMINAR item 7 (`docs/architecture/[modulo]-design.md` — Opcional)
- Eliminar 9 líneas de descripción del item opcional

**Consecuencias:**
- Documentación de módulo tiene 6 puntos fijos, no flexibles
- No hay "diseño arquitectónico opcional"
- Cada módulo documentado tiene: 2 backend + 3 frontend + 1 auditoría
- Checklist de validación debe verificar todos los 6

**Referencia anterior (eliminada):**
```markdown
7. docs/architecture/[modulo]-design.md (Opcional - solo si módulo es crítico)
   - Decisiones de diseño permanentes
   - [... 6 líneas más de descripción]
```

---

## 4. Corte Temporal — Fecha Única 2026-08-12

**Decisión:** Mantener archivo único actualizado al estado actual (una sola fecha vigente, no dual timeline).

**Cambios aplicados en CONVENTIONS.md:**

**Línea 59 (§3):**
```
Antes: previa al **2026-08-06** (última consolidación del sistema rector)
Ahora: previa al **2026-08-12** (última actualización vigente del sistema rector)
```

**Línea 980 (§8.1):**
```
Antes: rector vigente del **2026-08-06** (última consolidación)
Ahora: rector vigente del **2026-08-12** (última actualización vigente)
```

**Línea 10 (Cabecera):**
```
Antes: Reestructuración de la carpeta legacy + Reglas de Iconos + Patrones UpdateAsync + Multipart
Ahora: Aprobadas §5.9.1 Notificaciones + §5.9.2 Background Jobs; Corte temporal único 2026-08-12; Documentos §4.7 = 6 obligatorios
```

**Consecuencias:**
- Un único corte temporal vigente: 2026-08-12
- Todo documento anterior a 2026-08-12 se valida contra sistema rector actual
- No hay "dos versiones" del sistema; solo la vigente
- Legacy pre-2026-08-12 requiere validación antes de usar como autoridad

**Rationale:**
- Simplicidad: una fecha, un estado
- Claridad: no hay confusión sobre "consolidación vs revisión"
- Actualización: 2026-08-12 refleja: reestructuración carpetas + Jobs aprobados + Notificaciones aprobadas + documentos = 6 obligatorios

---

## 📊 Resumen de Cambios

| Item | Decisión | Severidad | Cambios | Aplicado |
|------|----------|-----------|---------|----------|
| §5.9.1 Notificaciones | Aprobada | 🔴 CRÍTICA | Sello + lenguaje + status | ✅ SI |
| §5.9.2 Jobs | Aprobada | 🔴 CRÍTICA | Sello + lenguaje + status | ✅ SI |
| §4.7 Documentos | 6 obligatorios | 🟡 MEDIA | Eliminar item 7 opcional | ✅ SI |
| Corte temporal | 2026-08-12 único | 🟢 MENOR | Replace 2026-08-06 → 2026-08-12 (3 ubicaciones) | ✅ SI |

---

## ✅ Validación Post-Aplicación

**CONVENTIONS.md cambios verificados:**
```bash
✅ Línea 10: Cabecera con nuevas decisiones
✅ Línea 59: Corte temporal 2026-08-12
✅ Línea 245: "6 documentos obligatorios"
✅ Línea 246: "Todos obligatorios. Sin excepciones opcionales."
✅ Línea 614: ✅ APROBADA (§5.9.1)
✅ Línea 618: Quitar "en evaluación"
✅ Línea 651: Status aprobada + en progreso
✅ Línea 655: ✅ APROBADA (§5.9.2)
✅ Línea 662: "Reglas obligatorias"
✅ Línea 690: Status aprobada + Fases 1-3 completas
✅ Línea 980: Corte temporal 2026-08-12
```

---

## 🎯 Próximos Pasos

### Inmediato (esta semana)
- ✅ Publicar decisiones (este documento)
- ✅ Actualizar conventions/README.md (índice)
- ✅ Actualizar conventions-viewer si aplica

### Corto plazo (próximas 2 semanas)
- Notificaciones: Iniciar Fase 1 de remediación (5 jobs críticos, 15 horas)
- Jobs: Fase 4 activada (gobernanza permanente, validación PRs)
- Módulos: Auditar que nuevos módulos documentados cumplan 6 obligatorios

### Monitoreo
- Code review valida Notificaciones: INotificationDispatcher obligatorio
- Code review valida Jobs: IJobService + ExecuteAsync() obligatorio
- Auditoría trimestral Jobs (/hangfire dashboard)

---

## 📋 Autorización

**Tech Lead:** ✅ Aprobado 2026-08-12  
**Implementado por:** Claude (3-Layer Control System)  
**Documento:** docs/reporte_maestro/20260812-DECISIONES-TECH-LEAD-APLICADAS.md  
**Verificado contra:** CONVENTIONS.md (lectura post-cambios: SIN ERRORES)

