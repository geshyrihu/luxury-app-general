# Checklist de Progreso — Alertas de Tareas Recurrentes

Basado en `skills/planeacion-modulos/SKILL.md`.

---

## PASO 0 — Tipo de trabajo y rutas

- [x] Identificar tipo (A/B/C) → **B, ampliación**
- [x] Registrar ruta backend
- [x] Registrar ruta frontend
- [x] Registrar objetivo en una frase

## PASO 0.5 — Reconocimiento de estructura de entidades

- [x] Leer entidades del motor `TaskEngine` (7 entidades)
- [x] Leer entidades transversales (`ApplicationUser`, `WorkPosition`, `OrgHierarchy`, `Customer`, `ApplicationRole`)
- [x] Traducir cada propiedad a su función de negocio, en español
- [x] Mapear relaciones e índices reales
- [x] Documentar catálogos (enums) y sus restricciones
- [x] Identificar GAPs (14 detectados)
- [x] Tabla de reutilización
- [x] **Aprobación del usuario** (2026-08-17)
- [x] Revisión 2026-08-20: se detectó un **segundo motor de recurrencia legado** (`RecurringTaskTemplate`) omitido en el levantamiento inicial → documentado

## PASO 1 — Cuestionario de Discovery

- [x] 1.1 El problema (3 preguntas)
- [x] 1.2 Los usuarios (3 preguntas)
- [x] 1.3 Las reglas (cadencia, estados, canales)
- [x] 1.4 Los riesgos (Pre-Mortem, 8 supuestos)
- [x] 1.5 Las integraciones (mapeadas desde código)
- [x] 1.6.1 Casos especiales (vacaciones, rotación, baja de cliente)
- [x] 1.6.2 Datos históricos a migrar → **no hay data previa**
- [x] Confirmar anclaje de asignación (G-04) → **al ROL, no al `WorkPosition`**
- [x] Definir qué pasa con rol vacante → **genera y avisa al jefe**
- [x] 1.3.3 Validaciones de campo por campo → resueltas en FASE 0 Nivel 4

## PASO 2 — FASE 0 (Análisis de reglas de negocio)

- [x] Problem Statement en formato disciplinado
- [x] ≥3 KPIs con baseline, target, timeline y método de verificación → **7 KPIs**
- [x] ≥6 reglas de negocio `RN-ALT-NNN` distribuidas en 4 niveles → **37 reglas (7/10/10/10)**
- [x] Cada RN mapeada a ubicación de código (`archivo:línea`)
- [x] ≥3 supuestos de Pre-Mortem con mitigación y owner → **8 supuestos**
- [x] ≥3 flujos (feliz / triste / borde) con criterio de PASO → **5 flujos**
- [x] Cero placeholders
- [x] Aprobación del usuario (2026-08-17), con 3 correcciones aplicadas: RN-ALT-005 sin campo nulable, SMS fuera de alcance, RN-ALT-022 aprobada

## PASO 2b — Enmienda: anclaje a grupos de trabajo (2026-08-20)

- [x] Leer el sistema de tareas real (`OperationsLuxuryApp/Tasks/`, 10 submódulos)
- [x] Confirmar modelo de responsables (`WorkGroupMembers.IsAdmin`)
- [x] Detectar que el motor "legado" es el que coincide con el negocio
- [x] Mapear campos `TaskInstance` → `Tasks` y lo que NO existe en el destino
- [x] 2 reglas retiradas, 13 reescritas, 8 nuevas (`RN-ALT-040..047`)
- [x] 4 GAPs nuevos (G-15 comprobante, G-16 checklist, G-17 estados, G-18 tenencia)
- [x] Aprobación del usuario
- [ ] Reflejar la enmienda dentro de `02-business-rules-analysis.md` ← pendiente

## PASO 3 — Riesgos y dependencias

- [x] Matriz de riesgos técnicos → **16 riesgos (RT-01..RT-16)**, 4 críticos
- [x] Matriz de riesgos de seguridad → **8 riesgos (RS-01..RS-08)**
- [x] Matriz de dependencias con plan de contingencia → **10 dependencias (D-01..D-10)**
- [x] Plan de contingencia por riesgo crítico → RT-01, RT-02, RT-03+RT-08, RS-01, D-02, D-05
- [x] Riesgos aceptados sin mitigar, declarados
- [x] Trazabilidad riesgo → RN
- [x] Aprobación del usuario
- [ ] Incorporar RT-17..RT-19 y RS-09 de la enmienda ← pendiente

## PASO 4 — Plan de implementación

- [x] 11 secciones mínimas obligatorias
- [x] Mapa FASE 0 → secciones del plan (§3.3 mapeo Regla → Componente)
- [x] Tabla de reutilización de entidades → §4, 17 renglones
- [x] Migraciones clasificadas: reversibles vs irreversibles → §3.5.1
- [x] Referencia a `data-migration-protocol.md` → §3.5.2
- [x] Secuenciación por dependencias + tamaño S/M/L, sin fechas → §5, 9 fases
- [x] Criterios de paso verificables por fase → §6
- [x] Plan de rollback → §10, con la advertencia de que F7 sólo se revierte con respaldo

- [x] §3.6 Tokens de diseño (obligatorio por tener UI)
- [ ] Aprobación del usuario ← gate abierto

## PASO 5 — Revisión y aprobación final

- [ ] Revisión completa del plan con el usuario
- [ ] `node scripts/audit-conventions.mjs` en verde ← hoy en rojo (10 errores pre-existentes, ver B5)
- [x] `node scripts/check-agent-rules.mjs` en verde (0 violaciones, verificado 2026-08-20)
- [ ] Plan aprobado

---

## Bloqueadores abiertos

- [ ] B1 — Habilitar WhatsApp en `NotificationDispatcher`
- [ ] B2 — Iniciar trámite de plantillas WhatsApp con Meta
- [x] B3 — ~~SmsService~~ **cerrado por exclusión**: SMS salió del alcance; queda como deuda técnica de otro ticket
- [ ] B5 — `node scripts/audit-conventions.mjs` reporta 10 errores **pre-existentes** (skills `luxuryapp-core` fuera de sincronía + 2 referencias fantasma). Bloquea el gate del PASO 5
- [ ] B6 — Verificar en BD si el job `generar-instancias-tareas-recurrentes-legado` está activo y si hay plantillas `TaskRecurringTemplates` en uso
- [ ] B4 — Medir baseline de tareas vencidas sin cerrar en BD
