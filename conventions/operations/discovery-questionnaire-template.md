# Plantilla: Cuestionario de Descubrimiento de Reglas de Negocio

**Propósito:** Capturar contexto completo de un módulo ANTES de crear plan o auditoría  
**Responsable:** Agente (hace preguntas) + Tech Lead (responde)  
**Tiempo estimado:** 30-60 minutos  
**Vigencia:** 2026-07-30 en adelante

---

## INSTRUCCIONES PARA AGENTES

1. **Leer este documento completamente**
2. **Crear copia en `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-discovery-[modulo]-[submodulo].md`** (estructura plana, `CONVENTIONS.md` §6ter)
3. **Hacer preguntas al Tech Lead en cada sección**
4. **NO asumir respuestas** — preguntar hasta que queden claras
5. **Documentar respuestas tal como se reciban**
6. **Usar respuestas para crear 02-business-rules-analysis.md (FASE 0)**

---

## SECCIÓN 1: CONTEXTO DEL NEGOCIO

### P1.1: ¿Cuál es el problema que resuelve este módulo?

**Formato esperado:**
```
Actualmente, [ACTOR] sufre de [PROBLEMA] cuando intenta [ACCIÓN],
lo que resulta en [CONSECUENCIA NEGATIVA].

Este módulo resuelve: [SOLUCIÓN PROPUESTA]
```

**Ejemplo:**
```
Actualmente, el gerente de RH sufre de registros manuales de entradas,
cuando intenta validar asistencia, lo que resulta en errores y retrasos.
Este módulo automatiza el registro mediante QR.
```

### P1.2: ¿Cuáles son los actores principales y sus objetivos?

**Formato esperado:**
```
Actor 1: [nombre] - Objetivo: [qué quiere lograr]
Actor 2: [nombre] - Objetivo: [qué quiere lograr]
...
```

**Ejemplo:**
```
- Empleado: Registrar entrada/salida rápidamente sin colas
- Gerente de RH: Validar asistencia en tiempo real
- Sistema: Sincronizar con nómina automáticamente
```

### P1.3: ¿Cuáles son los KPIs de éxito medibles?

**Formato esperado:**
```
KPI 1: [métrica] | Baseline: [valor actual] | Target: [valor deseado] | Timeline: [cuándo]
KPI 2: [métrica] | Baseline: [valor actual] | Target: [valor deseado] | Timeline: [cuándo]
...
```

**Ejemplo:**
```
- Tiempo de registro: Baseline 5 min → Target 30 seg | Q3 2026
- Errores de asistencia: Baseline 15/mes → Target 0 | Q3 2026
- Cobertura de registro: Baseline 80% → Target 100% | Q2 2026
```

### P1.4: ¿Hay restricciones de tiempo, presupuesto o política?

**Ejemplo de respuestas:**
```
- Debe estar listo antes de cierre fiscal (30 de junio)
- No puede cambiar el sistema de nómina existente
- Debe ser compatible con acceso por QR (AccessControl)
```

---

## SECCIÓN 2: REGLAS DE NEGOCIO (4 NIVELES)

### NIVEL 1: Invariantes de Dominio
**Pregunta:** ¿Qué NO puede cambiar nunca? ¿Qué es inmutable?

**Ejemplo:**
```
- Un empleado solo puede tener UNA entrada por día laboral
- La hora de entrada no puede ser posterior a la hora de salida
- No se puede modificar registro de más de 30 días atrás
- Cada entrada debe estar vinculada a un empleado válido
```

### NIVEL 2: Flujo y Estados
**Pregunta:** ¿Qué ciclo de vida tiene una entrada? ¿Cuáles son los estados y transiciones?

**Formato esperado:**
```
ESTADOS:
- Registrada (inicial)
- Validada (RH revisó)
- Justificada (si hay ausencia)
- Compensada (si hay falta)
- Cerrada (final)

TRANSICIONES:
- Registrada → Validada (automático o manual?)
- Registrada → Justificada (si empleado sube documento)
- Validada → Cerrada (después de X días)
- Cualquier estado → Anulada (si hay error)
```

### NIVEL 3: Seguridad/Autorización
**Pregunta:** ¿Quién puede hacer qué? ¿Hay datos sensibles?

**Formato esperado:**
```
ROLES Y PERMISOS:
- Empleado: Ver propia asistencia, justificar ausencias
- Gerente: Ver equipo, validar justificaciones
- RH: Reporte global, generar datos para nómina
- Admin: Configurar, auditar cambios

DATOS SENSIBLES:
- ¿Ubicación del empleado? (privacidad)
- ¿Razones de ausencia? (médicas, personales)
- ¿Cambios históricos? (auditoría)
```

### NIVEL 4: Validaciones de Datos
**Pregunta:** ¿Qué validaciones debe cumplir cada campo?

**Formato esperado:**
```
Campo: Hora de Entrada
- Formato: HH:MM (24h)
- Obligatorio: Sí
- Rango: Entre 05:00 y 23:59
- Validación: No puede ser futuro

Campo: Razón de Justificación
- Tipo: Texto o dropdown
- Opciones: Enfermedad, Permiso, Otro
- Obligatorio: Sí (si estado = Justificada)
```

---

## SECCIÓN 3: FLUJOS PRINCIPALES

### P3.1: Happy Path (caso normal)

**Pregunta:** ¿Cuál es el flujo ideal sin problemas?

**Formato esperado:**
```
FLUJO: Empleado registra entrada normal

1. Empleado presenta QR a lector
2. Sistema escanea QR, obtiene customerId
3. Sistema registra: fecha, hora, ID empleado
4. Sistema valida que NO hay entrada previa hoy
5. Sistema guarda registro como "Registrada"
6. Empleado ve confirmación en app
7. RH ve entrada en dashboard en tiempo real
8. Después de 30 días, sistema marca como "Cerrada"
```

### P3.2: Sad Paths (errores previsibles)

**Pregunta:** ¿Qué puede salir mal? ¿Cómo se maneja?

**Formato esperado:**
```
ERROR 1: QR inválido o expirado
- Acción: Rechazar, permitir entrada manual con PIN
- Notificación: "QR inválido, ingrese PIN"

ERROR 2: Empleado sin asignación de turno
- Acción: Registrar pero marcar como "pendiente validación"
- Notificación: "Revisar turno antes de cerrar"

ERROR 3: Empleado intenta registrar 2 veces (QR roto)
- Acción: Rechazar segunda entrada
- Notificación: "Ya hay registro para hoy"
```

### P3.3: Edge Cases (casos borde)

**Pregunta:** ¿Qué casos raros podrían ocurrir?

**Ejemplo:**
```
CASO 1: Cambio de turno (empleado pasa de mañana a tarde)
- ¿Se registra entrada Y salida en mismo día?
- ¿Quién autoriza cambio?

CASO 2: Home office / Trabajo remoto
- ¿Se registra igual?
- ¿Hay validación de ubicación?

CASO 3: Empleado enfermo
- ¿Notifica al sistema o solo a supervisor?
- ¿Cómo se refleja en nómina?
```

---

## SECCIÓN 4: INTEGRACIONES CON OTROS MÓDULOS

### P4.1: ¿Se conecta con módulos existentes?

**Pregunta:** ¿Qué datos comparte? ¿Con quién?

**Formato esperado:**
```
MÓDULO: AccessControl
- Datos que RECIBE: customerId, QR válido/inválido
- Datos que ENVÍA: ninguno
- Tipo: Lectura en tiempo real
- Contrato: GetEmployeeByQR(qrCode) → EmployeeDTO

MÓDULO: Nómina
- Datos que RECIBE: ninguno (solo lee)
- Datos que ENVÍA: Cantidad de horas trabajadas, faltas
- Tipo: Batch diario
- Formato: CSV o API

MÓDULO: Cobranza
- Datos que RECIBE: Faltas (si aplica descuento)
- Datos que ENVÍA: ninguno
- Tipo: A demanda
```

### P4.2: ¿Afecta a módulos existentes?

**Pregunta:** ¿Qué cambia en otros módulos?

**Ejemplo:**
```
- Nómina: Debe recibir datos de asistencia (cambio)
- Cobranza: Puede aplicar descuentos por falta (cambio)
- AccessControl: Ahora proporciona datos de QR (cambio)
```

---

## SECCIÓN 5: RESTRICCIONES TÉCNICAS Y NO FUNCIONALES

### P5.1: Performance

**Preguntas:**
- ¿Cuántas entradas/día se esperan? (100? 1000? 10000?)
- ¿Tiempo máximo aceptable de respuesta al escanear QR?
- ¿Reportes deben ser en tiempo real o pueden ser batch?

### P5.2: Disponibilidad

**Preguntas:**
- ¿El sistema debe estar disponible 24/7 o solo horas laborales?
- ¿Qué sucede si AccessControl falla? (¿entrada manual?)
- ¿RTO (Recovery Time Objective)? ¿RPO (Recovery Point Objective)?

### P5.3: Escalabilidad

**Preguntas:**
- ¿Cuántas sucursales/empresas tendrán este módulo?
- ¿Crecimiento esperado en 12 meses?
- ¿Multi-tenant o un solo tenant?

### P5.4: Auditoría

**Preguntas:**
- ¿Qué cambios se deben registrar? (quién, qué, cuándo, por qué)
- ¿Retención de histórico? (¿indefinido?)
- ¿Acceso a logs? (¿solo admin?)

### P5.5: Cumplimiento Normativo

**Preguntas:**
- ¿Hay regulaciones laborales sobre registro de asistencia?
- ¿Privacidad de datos (GDPR equivalente)?
- ¿Retención de datos sensibles (razones de ausencia)?

---

## SECCIÓN 6: PREGUNTAS FINALES ABIERTAS

### P6.1: ¿Hay algo más que no hayamos cubierto?

**Espacio para:** Contexto adicional, preocupaciones, detalles que no encajan en secciones anteriores

### P6.2: ¿Cuál es la prioridad relativa?

**Escala 1-5:**
- Registrar entrada: [ ]
- Validar ausencia: [ ]
- Integrar con nómina: [ ]
- Reportes: [ ]
- Auditoría: [ ]

### P6.3: ¿Hay dependencias de otros equipos?

**Ejemplo:**
```
- AccessControl debe exponer API de validación QR (dependencia)
- Nómina debe estar lista antes de conectar (dependencia)
```

---

## ENTREGABLE

**Documento completado:** `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-discovery-[modulo]-[submodulo].md`

**Próximo paso:** Agente crea `02-business-rules-analysis.md` (FASE 0) basado en estas respuestas.

---

*Template: Discovery Questionnaire - 2026-07-30*
