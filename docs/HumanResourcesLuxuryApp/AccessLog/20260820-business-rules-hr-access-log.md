# FASE 0: Análisis de Reglas de Negocio - Registro de Entradas Personal

**Módulo:** Registro Entradas Personal (REP)  
**Fecha:** 2026-07-30  
**Basado en:** 01-discovery-questionnaire.md (cuestionario respondido)  
**Estado:** ✅ Completo

---

## PROBLEM STATEMENT

```
Actualmente, el gerente de RH sufre de registros manuales de asistencia
cuando intenta validar asistencia y sincronizar con nómina,
lo que resulta en errores, retrasos de 2-3 días y discrepancias con sueldos.

Este módulo resuelve automatizando el registro mediante QR,
sincronizando automáticamente con nómina, y proporcionando validación en tiempo real.

IMPACTO ESPERADO:
- Reducir tiempo de registro de 5 min a 30 seg por empleado
- Eliminar errores de asistencia (target: 0-2 casos/mes)
- Sincronización automática con nómina (same-day)
- Auditoría completa de cambios
```

---

## KPIs - OBJETIVOS MEDIBLES

| # | KPI | Baseline | Target | Timeline | Responsable | Verificación |
|:---|:---|:---|:---|:---|:---|:---|
| 1 | Tiempo de registro/empleado | 5 min (manual) | 30 seg | Q3 2026 | Empleado | Timestamp entrada - QR scan |
| 2 | Errores asistencia/mes | 15 casos | 0-2 casos | Q3 2026 | Sistema | Auditoría de cambios |
| 3 | Cobertura automática | 0% | 95%+ | Q3 2026 | Sistema | Reportes diarios |
| 4 | Retraso datos nómina | 2-3 días | 0 días (same-day) | Q4 2026 | RH | Batch sync 23:59 |
| 5 | Disponibilidad sistema | N/A | 99.5% (horas laborales) | Q3 2026 | Ops | Uptime monitoring |
| 6 | Precisión datos sincronizados | N/A | 100% | Q3 2026 | QA | Auditoría vs nómina |

---

## MATRIZ DE REGLAS DE NEGOCIO (4 NIVELES)

### NIVEL 1: INVARIANTES DE DOMINIO

**Definición:** Restricciones que NUNCA pueden violarse. Son la integridad del dominio.

```
┌─────────────────────────────────────────────────────────────────┐
│ RN-REP-001: UN REGISTRO POR TIPO DE EVENTO POR DÍA POR EMPLEADO │
├─────────────────────────────────────────────────────────────────┤
│ Descripción:                                                     │
│ Un empleado solo puede tener UNA entrada y UNA salida por día   │
│ laboral (normalmente). Excepción: Cambio de turno en mismo día. │
│                                                                 │
│ Implicaciones:                                                   │
│ - Sistema rechaza 2ª entrada del mismo día                      │
│ - Error: "Ya hay registro para hoy"                             │
│ - Fallback: Contactar a RH si hay error real                    │
│                                                                 │
│ Violación = Breach de integridad                                │
│ Solución: Anular registro anterior (con auditoría)              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RN-REP-002: SALIDA POSTERIOR A ENTRADA                          │
├─────────────────────────────────────────────────────────────────┤
│ Descripción:                                                     │
│ Hora de salida SIEMPRE debe ser posterior a hora de entrada     │
│ en el mismo día.                                                │
│                                                                 │
│ Validación:                                                      │
│ IF (evento = "SALIDA" AND fecha = entrada_fecha)               │
│   THEN hora_salida > hora_entrada                               │
│                                                                 │
│ Si se viola: Rechazar con error                                 │
│ Error: "Hora de salida debe ser posterior a entrada"            │
│                                                                 │
│ Tolerancia: 0 segundos (validación estricta)                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RN-REP-003: NO REGISTRAR EVENTO FUTURO                          │
├─────────────────────────────────────────────────────────────────┤
│ Descripción:                                                     │
│ No se puede registrar entrada con hora futura                   │
│ (verificar reloj del servidor, no del dispositivo)              │
│                                                                 │
│ Tolerancia: ±5 minutos de desviación (para sincronización)      │
│                                                                 │
│ Validación:                                                      │
│ IF (evento_hora > servidor_hora + 5_min) THEN RECHAZAR          │
│                                                                 │
│ Error: "Hora inválida - no puede ser futura"                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RN-REP-004: TODO EVENTO VINCULADO A EMPLEADO VÁLIDO             │
├─────────────────────────────────────────────────────────────────┤
│ Descripción:                                                     │
│ Toda entrada/salida debe estar vinculada a un empleado que:     │
│ - Existe en la BD de empleados                                  │
│ - Está en estado ACTIVO (no suspendido ni inactivo)             │
│                                                                 │
│ Validación (vs AccessControl):                                  │
│ IF (GetEmployeeByQR(qrCode).estado != "ACTIVO") THEN RECHAZAR   │
│                                                                 │
│ Error: "QR inválido o empleado inactivo"                        │
│ Fallback: Permitir PIN manual, gerente valida después           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RN-REP-005: NO MODIFICAR REGISTRO ANTIGUO (>30 DÍAS)            │
├─────────────────────────────────────────────────────────────────┤
│ Descripción:                                                     │
│ No se puede modificar registro de más de 30 días atrás          │
│ (está cerrado/inmutable)                                        │
│                                                                 │
│ Excepción: Admin/RH con auditoría completa                      │
│                                                                 │
│ Validación:                                                      │
│ IF (hoy - fecha_registro > 30_días) THEN RECHAZAR (no admin)    │
│                                                                 │
│ Error: "Registro cerrado - no se puede modificar"               │
│ Motivo: Compliance, evitar alteración de datos históricos       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RN-REP-006: INMUTABILIDAD DE REGISTROS - NUNCA BORRAR           │
├─────────────────────────────────────────────────────────────────┤
│ Descripción:                                                     │
│ Cada entrada/salida crea un registro INMUTABLE                  │
│ Si hay error: marcar como "ANULADA", NO BORRAR                  │
│                                                                 │
│ Auditoría obligatoria de anulaciones                            │
│ { quién: admin_id, hora: timestamp, motivo: string }            │
│                                                                 │
│ Beneficio: Compliance, trazabilidad total                       │
│ Riesgo mitigado: Alteración/pérdida de datos                    │
└─────────────────────────────────────────────────────────────────┘
```

---

### NIVEL 2: FLUJO Y ESTADOS

**Definición:** Ciclo de vida de un registro. Estados válidos y transiciones permitidas.

```
MÁQUINA DE ESTADOS: Registro de Asistencia

┌───────────────────────────────────────────────────────────────────┐
│                      DIAGRAMA DE ESTADOS                          │
├───────────────────────────────────────────────────────────────────┤

                    ┌─────────────────┐
                    │   REGISTRADA    │ ← Initial State
                    │   (QR scaneado) │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   VALIDADA      │ ← Auto o manual
                    │  (Verificada)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐          ┌──────────┐       ┌────────────┐
   │PROCESADA│          │JUSTIFICAD│       │  CERRADA   │
   │(→ nómina)           A          │       │ (>30 días) │
   └─────────┘          └──────────┘       └────────────┘
        │                    │
        └────────────────────┘
             Ambos pueden
           pasar a CERRADA
           automáticamente
           después 30 días

CUALQUIER ESTADO → ANULADA (si error de admin)
                   (auditoría obligatoria)

┌───────────────────────────────────────────────────────────────────┐
│ DEFINICIÓN DE ESTADOS                                             │
├───────────────────────────────────────────────────────────────────┤

1. REGISTRADA (Inicial)
   - Qué significa: QR escaneado, datos capturados
   - Duración: <1 minuto
   - Siguiente: Validada (automático)

2. VALIDADA
   - Qué significa: Sistema confirmó que es válida
   - Validaciones aplicadas:
     ✓ Empleado existe y está activo
     ✓ No hay conflictos (2 entradas en mismo día)
     ✓ Hora es válida
   - Siguiente: Procesada O Justificada

3. JUSTIFICADA
   - Qué significa: Hay ausencia/retraso, empleado subió justificación
   - Requerida si: Hay ausencia o retraso >30 min
   - Documentos: Médico, permiso, etc.
   - Siguiente: Procesada (después aprobación RH)

4. PROCESADA
   - Qué significa: Ya fue enviada a nómina (batch 23:59)
   - Duración: Al cierre del día
   - Irreversible: Sí (nómina ya procesó)
   - Error: Si falla, renotificar a RH

5. CERRADA
   - Qué significa: >30 días, inmutable
   - Trigger: Automático
   - Archivo: Mover a histórico
   - Acceso: Solo lectura, auditoría

6. ANULADA
   - Qué significa: Fue erróneo, rechazado
   - Trigger: Admin/RH + auditoría
   - Razón: Debe ser documentada
   - Riesgo: Reabrir hueco en reportes (RH debe

 revisar)

┌───────────────────────────────────────────────────────────────────┐
│ TRANSICIONES PERMITIDAS                                           │
├───────────────────────────────────────────────────────────────────┤

REGISTRADA → VALIDADA
  Trigger: Automático (si todas validaciones pasan)
  Tiempo: < 1 segundo
  Error: Si falla, permanecer en REGISTRADA, alertar a RH

VALIDADA → PROCESADA
  Trigger: Batch nómina (23:59)
  Tiempo: N/A
  Requisito: No hay ausencia/justificación pendiente

VALIDADA → JUSTIFICADA
  Trigger: Empleado sube documento
  Tiempo: Dentro de 7 días del evento
  Requisito: Estado = "Ausencia" o "Retraso"

JUSTIFICADA → PROCESADA
  Trigger: RH aprueba justificación
  Tiempo: Antes del cierre diario (23:59)
  Requisito: Documento validado

PROCESADA → CERRADA
  Trigger: Automático (30 días después)
  Tiempo: Batch nocturnos
  Irreversible: Sí

CUALQUIER ESTADO → ANULADA
  Trigger: Admin/RH + motivo
  Auditoría: Quién, cuándo, por qué
  Impacto: Reabrir en nómina (RH debe reprocessar)
```

---

### NIVEL 3: SEGURIDAD/AUTORIZACIÓN

**Definición:** Quién puede hacer qué. Control de acceso basado en roles.

```
┌─────────────────────────────────────────────────────────────────┐
│ MATRIZ DE PERMISOS POR ROL                                      │
├─────────────────────────────────────────────────────────────────┤

ROL: EMPLEADO
  Permisos:
    ✓ Ver propia asistencia (últimos 30 días)
    ✓ Justificar ausencia (solo para propias ausencias)
    ✓ Descargar comprobante personal
  Restricciones:
    ✗ NO ver otros empleados
    ✗ NO modificar registros
    ✗ NO ver datos salariales
  Datos accesibles:
    - Mi asistencia (entrada/salida)
    - Mis ausencias justificadas
    - Mis justificaciones (documentos)

ROL: GERENTE DE TURNO
  Permisos:
    ✓ Ver asistencia de su equipo (tiempo real)
    ✓ Registrar entrada manual si QR falla
    ✓ Validar justificaciones de su equipo
    ✓ Generar reporte diario del turno
  Restricciones:
    ✗ NO ver datos salariales
    ✗ NO anular registros
    ✗ NO ver justificaciones de otros gerentes
  Datos accesibles:
    - Equipo asignado (solo)
    - Últimos 7 días
    - Documentos de justificación (no contenido médico)

ROL: GERENTE DE RH
  Permisos:
    ✓ Ver reporte global de asistencia
    ✓ Procesar justificaciones (aprobar/rechazar)
    ✓ Generar datos para nómina (batch)
    ✓ Anular registros (con auditoría)
    ✓ Exportar reportes CSV
    ✓ Ver justificaciones médicas (CONFIDENCIAL)
  Restricciones:
    ✗ NO modificar salarios
    ✗ NO acceder a logs técnicos
  Datos accesibles:
    - Todos los empleados
    - Histórico completo (7 años)
    - Documentos confidenciales (médicos)

ROL: ADMINISTRADOR
  Permisos:
    ✓ Acceso total (logs, auditoría, config)
    ✓ Anular cualquier registro (auditoría mandatoria)
    ✓ Ver logs técnicos
    ✓ Configurar integraciones
  Restricciones:
    Ninguna (acceso total)

ROL: SISTEMA DE NÓMINA (API)
  Permisos:
    ✓ Leer datos de asistencia (lectura solo)
    ✗ NO puede modificar registros
    ✗ NO puede ver documentos médicos
  Autenticación:
    - API Key específica
    - TLS 1.3 obligatorio
  Acceso:
    - Endpoint de lectura diaria
    - Datos: { customerId, fecha, horas, ausencias }

┌─────────────────────────────────────────────────────────────────┐
│ DATOS SENSIBLES - PROTECCIÓN REQUERIDA                           │
├─────────────────────────────────────────────────────────────────┤

DATOS MÉDICOS (Confidencialidad MÁXIMA):
  - Razón de ausencia: "Médica"
  - Documentos: Certificados médicos
  - Acceso: Solo RH + empleado propietario
  - Encriptación: AES-256 en reposo
  - Auditoría: Toda lectura registrada
  - Retención: 7 años (regulatorio)

DATOS PERSONALES (Confidencialidad ALTA):
  - Razón ausencia: "Personal", "Permiso"
  - Documentos: Autorizaciones
  - Acceso: RH + empleado propietario
  - Encriptación: AES-256 en reposo

DATOS DE CAMBIOS HISTÓRICOS (Auditoría):
  - Quién modificó
  - Cuándo
  - Qué cambió
  - Acces: Admin + RH (para auditoría)

DATOS DE UBICACIÓN:
  - NOT stored (solo QR del edificio)
  - No hay seguimiento de ubicación
```

---

### NIVEL 4: VALIDACIONES DE DATOS

**Definición:** Reglas de validación para cada campo. Formatos, rangos, obligatoriedad.

```
ENTIDAD: Registro de Asistencia

┌─ CAMPO: id_registro ──────────────────────────────┐
│ Tipo: UUID                                         │
│ Obligatorio: Sí                                    │
│ Generado por: Sistema (auto-generated)             │
│ Inmutable: Sí                                      │
│ Validación: UUID v4 válido                         │
│ Ejemplo: "550e8400-e29b-41d4-a716-446655440000"   │
└────────────────────────────────────────────────────┘

┌─ CAMPO: customerId (empleado) ────────────────────┐
│ Tipo: UUID                                         │
│ Obligatorio: Sí                                    │
│ Validación: Debe existir en tabla empleados        │
│ Estado empleado: ACTIVO (validar vs AccessControl) │
│ Error si falla: "Empleado no encontrado"          │
│ Ejemplo: "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6"  │
└────────────────────────────────────────────────────┘

┌─ CAMPO: tipo_evento ──────────────────────────────┐
│ Tipo: Enum (string)                               │
│ Valores válidos:                                  │
│   - "ENTRADA" (normal)                            │
│   - "SALIDA" (normal)                             │
│   - "ENTRADA_PAUSA" (almuerzo)                    │
│   - "SALIDA_PAUSA" (retorno de almuerzo)          │
│ Obligatorio: Sí                                    │
│ Default: None (debe especificarse)                 │
│ Validación: Estar en lista válida                 │
│ Error si falla: "Tipo de evento no válido"        │
└────────────────────────────────────────────────────┘

┌─ CAMPO: fecha ────────────────────────────────────┐
│ Tipo: Date (YYYY-MM-DD)                           │
│ Obligatorio: Sí                                    │
│ Validación:                                       │
│   - Formato: YYYY-MM-DD                           │
│   - No puede ser futuro (vs fecha servidor)       │
│   - No puede ser >30 días atrás (excep. admin)    │
│ Error si falla: "Fecha fuera de rango válido"     │
│ Ejemplo: "2026-07-30"                             │
└────────────────────────────────────────────────────┘

┌─ CAMPO: hora ─────────────────────────────────────┐
│ Tipo: Time (HH:MM:SS)                             │
│ Obligatorio: Sí                                   │
│ Formato: HH:MM:SS (24 horas)                      │
│ Validación:                                       │
│   - Entre 05:00:00 y 23:59:59                     │
│   - No puede ser futuro vs servidor (±5 min tol.) │
│ Error si falla: "Hora inválida"                   │
│ Ejemplo: "08:30:15"                               │
│ Precisión: Segundos (para auditoría)              │
└────────────────────────────────────────────────────┘

┌─ CAMPO: metodo_registro ──────────────────────────┐
│ Tipo: Enum (string)                               │
│ Valores:                                          │
│   - "QR" (escaneo de QR)                          │
│   - "PIN" (fallback manual)                       │
│   - "MANUAL" (entrada de gerente)                 │
│   - "BIOMÉTRICO" (futuro)                         │
│ Obligatorio: Sí                                    │
│ Tracking: Importante para auditoría               │
│ Uso: Indicar si fue automatizado o manual         │
└────────────────────────────────────────────────────┘

┌─ CAMPO: razon_ausencia (si aplica) ───────────────┐
│ Tipo: Enum (string)                               │
│ Valores:                                          │
│   - "MÉDICA" (confidencial)                       │
│   - "PERSONAL" (privada)                          │
│   - "PERMISO" (pública)                           │
│   - "FALTA" (injustificada)                       │
│ Obligatorio: Sí (si estado = Ausencia)            │
│ Validación: Ir acompañado de justificación        │
│ Si falta: "Debe especificar razón de ausencia"    │
└────────────────────────────────────────────────────┘

┌─ CAMPO: documento_justificacion ──────────────────┐
│ Tipo: Archivo (PDF, JPG, PNG)                     │
│ Tamaño máximo: 5 MB                               │
│ Obligatorio: Sí (si razon_ausencia = MÉDICA)      │
│ Obligatorio: Sí (si razon_ausencia = PERSONAL)    │
│ Obligatorio: No (si razon_ausencia = PERMISO)     │
│ Almacenamiento: Cloud storage encriptado          │
│ Acceso: Solo RH + empleado propietario            │
│ Retención: 7 años                                 │
│ Validación: Archivo debe ser válido               │
└────────────────────────────────────────────────────┘

┌─ CAMPO: notas (comentarios) ──────────────────────┐
│ Tipo: Text (string)                               │
│ Máximo: 500 caracteres                            │
│ Obligatorio: No                                    │
│ Auditoría:                                        │
│   - Quién escribió                                │
│   - Cuándo escribió                               │
│ Uso: Gerente deja notas para RH                   │
│ Ejemplo: "Cambio de turno urgente"                │
└────────────────────────────────────────────────────┘

┌─ CAMPO: estado ────────────────────────────────────┐
│ Tipo: Enum (string)                               │
│ Valores posibles:                                 │
│   - "REGISTRADA" (inicial)                        │
│   - "VALIDADA" (verificada)                       │
│   - "JUSTIFICADA" (tiene justificación)           │
│   - "PROCESADA" (enviada a nómina)                │
│   - "CERRADA" (inmutable, >30 días)               │
│   - "ANULADA" (rechazada, error)                  │
│ Obligatorio: Sí                                    │
│ Generado por: Sistema (máquina de estados)        │
│ Modificable: Sí (según transiciones permitidas)   │
└────────────────────────────────────────────────────┘
```

---

## PRE-MORTEM: ANÁLISIS DE RIESGOS

**Técnica:** "Asumimos que este módulo fue al prod y fue un desastre. ¿Qué lo causó?"

```
┌─────────────────────────────────────────────────────────────────┐
│ RIESGO 1: DESINCRONIZACIÓN CON ACCESSCONTROL                    │
├─────────────────────────────────────────────────────────────────┤
│ Escenario: AccessControl cambia estructura de API GetEmployeeBy QR
│ Impacto: 🔴 CRÍTICO - Sistema rechaza todos los QR
│ Probabilidad: MEDIA (AccessControl es legado)
│ Mitigación:
│   - Documentar API en contract.md
│   - Unit tests con mock de AccessControl
│   - Timeout de 2 segundos en llamadas
│   - Fallback a PIN si AccessControl no responde
│ Dueño: Agente de Backend
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RIESGO 2: BATCH DE NÓMINA FALLA SILENCIOSAMENTE                 │
├─────────────────────────────────────────────────────────────────┤
│ Escenario: Batch a 23:59 falla, pero no hay alerta
│ Impacto: 🔴 CRÍTICO - Datos de asistencia no llegan a nómina
│ Probabilidad: MEDIA (si no hay alertas)
│ Mitigación:
│   - Alert si batch falla (email a RH)
│   - Retry 3 veces antes de alertar
│   - Log detallado de cada batch
│   - Dashboard de estado de último batch
│ Dueño: Agente de Backend + Ops
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RIESGO 3: EMPLEADO REGISTRA ENTRADA 2 VECES (DUPLICATE)        │
├─────────────────────────────────────────────────────────────────┤
│ Escenario: QR roto, empleado presiona botón 2 veces
│ Impacto: 🟠 ALTO - Datos inconsistentes en reporte
│ Probabilidad: ALTA (usuario error)
│ Mitigación:
│   - Validación: NO permitir 2 entradas en mismo día
│   - Si detecta: Rechazar la 2ª, avisar al empleado
│   - Auditoría de intentos de duplicate
│ Dueño: Agente de Backend
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RIESGO 4: DATOS MÉDICOS SE EXPONEN ACCIDENTALMENTE             │
├─────────────────────────────────────────────────────────────────┤
│ Escenario: Query expone documentos médicos a empleado que no lo subió
│ Impacto: 🔴 CRÍTICO - GDPR violation, lawsuit
│ Probabilidad: BAJA (si hay buenos controls)
│ Mitigación:
│   - Encriptación AES-256 en reposo
│   - Validar que empleado = propietario del documento
│   - Auditoría de toda lectura de datos médicos
│   - Segrgecar BD (tabla separada de justificaciones)
│ Dueño: Agente de Backend + Security
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RIESGO 5: ADMIN ANULA REGISTROS SIN MOTIVO (AUDITORÍA FALSA)   │
├─────────────────────────────────────────────────────────────────┤
│ Escenario: Admin anula entrada "por error" sin dejar auditoría
│ Impacto: 🟠 ALTO - Nómina discrepante, sospecha de manipulación
│ Probabilidad: MEDIA (falta de control)
│ Mitigación:
│   - Obligar motivo para anular (campo requerido)
│   - Auditoría de toda anulación
│   - Reporte de "anulaciones por admin"
│   - Revisar anomalías con auditor externo
│ Dueño: Agente de Backend + RH
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RIESGO 6: HOME OFFICE NO SE REGISTRA (DATOS INCOMPLETOS)       │
├─────────────────────────────────────────────────────────────────┤
│ Escenario: Empleado en home office olvida registrar, no hay entrada
│ Impacto: 🟡 MEDIO - Ausencia registrada incorrectamente
│ Probabilidad: ALTA (comportamiento humano)
│ Mitigación:
│   - Opción: Auto-registrar a las 08:00 si no hay entrada
│   - O: Requerir que empleado registre manualmente
│   - Alertas a gerente si no hay entrada antes de 09:00
│ Dueño: Agente de Frontend + RH
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RIESGO 7: PICO DE CARGA A LAS 08:00 CUELGA EL SISTEMA          │
├─────────────────────────────────────────────────────────────────┤
│ Escenario: 500 empleados registran entrada en 5 minutos
│ Impacto: 🟠 ALTO - No poder registrarse, empleados enojados
│ Probabilidad: MEDIA (puntual, pero predecible)
│ Mitigación:
│   - Load testing: Simular 500 registros/5 min
│   - Cache de últimos registros (Redis)
│   - DB read replicas para reportes
│   - Queue si BD está saturada (max 1 seg espera)
│ Dueño: Agente de Backend + Infra
└─────────────────────────────────────────────────────────────────┘

RIESGOS CRÍTICOS (🔴): 2 (AccessControl, Batch, Datos médicos)
RIESGOS ALTOS (🟠): 3 (Duplicates, Admin, Picos)
RIESGOS MEDIOS (🟡): 1 (Home office)

ACCIÓN REQUERIDA: Todos deben tener plan de mitigación ANTES de codear
```

---

## CONCLUSIÓN DE FASE 0

✅ **Descubrimiento completo**
- Problema entendido
- 6 actores mapeados
- 6 KPIs definidos

✅ **Invariantes de dominio**
- 6 reglas de integridad definidas
- Validaciones claras

✅ **Flujos y estados**
- Máquina de estados completa
- Transiciones claras

✅ **Seguridad**
- 5 roles con permisos definidos
- Datos sensibles protegidos

✅ **Validaciones**
- 10 campos con validaciones

✅ **Riesgos mitigados**
- 7 riesgos identificados
- Planes de mitigación planteados

---

**Siguiente paso:** 03-preliminary-architecture.md (decisiones técnicas)

---

*Documento: 02-business-rules-analysis.md (FASE 0 COMPLETA) - 2026-07-30*
