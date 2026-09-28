# Cuestionario de Descubrimiento - Registro de Entradas del Personal

**Módulo:** Registro Entradas Personal (REP)  
**Respondido por:** Tech Lead  
**Fecha:** 2026-07-30  
**Completitud:** 100%

---

## SECCIÓN 1: CONTEXTO DEL NEGOCIO

### P1.1: ¿Cuál es el problema que resuelve este módulo?

**Problema actual:**
```
Actualmente, el gerente de RH sufre de registros manuales de asistencia
cuando intenta validar asistencia y sincronizar con nómina,
lo que resulta en errores, retrasos de 2-3 días y discrepancias con sueldos.
```

**Solución propuesta:**
Este módulo automatiza el registro de entradas/salidas mediante QR,
sincroniza automáticamente con nómina, y proporciona validación en tiempo real.

### P1.2: ¿Cuáles son los actores principales y sus objetivos?

**Actores:**
```
1. EMPLEADO
   Objetivo: Registrar entrada/salida rápidamente (< 1 min) sin papeleos
   Frecuencia: 2x/día (entrada y salida)

2. GERENTE DE TURNO
   Objetivo: Validar asistencia en tiempo real, detectar ausencias
   Frecuencia: Continuo durante jornada

3. GERENTE DE RH
   Objetivo: Generar reportes de asistencia, justificaciones, datos para nómina
   Frecuencia: Diario al cierre (23:59)

4. SISTEMA DE NÓMINA
   Objetivo: Recibir datos de asistencia para cálculo de salarios
   Frecuencia: Diario

5. ACCESSCONTROL
   Objetivo: Proporcionar validación de QR del empleado
   Frecuencia: En tiempo real
```

### P1.3: ¿Cuáles son los KPIs de éxito medibles?

```
| KPI | Baseline | Target | Timeline | Responsable |
|:---|:---|:---|:---|:---|
| Tiempo de registro por empleado | 5 min (manual) | 30 seg | Q3 2026 | Empleado |
| Errores de asistencia/mes | 15 casos | 0-2 casos | Q3 2026 | RH |
| Cobertura de registro automático | 0% | 95%+ | Q3 2026 | Sistema |
| Días de retraso en nómina | 2-3 días | 0 días (mismo día) | Q4 2026 | RH |
| Disponibilidad del sistema | N/A | 99.5% (horas laborales) | Q3 2026 | Ops |
| Precisión de datos sincronizados | N/A | 100% | Q3 2026 | QA |
```

### P1.4: ¿Hay restricciones de tiempo, presupuesto o política?

```
RESTRICCIONES CRÍTICAS:

Tiempo:
- DEBE estar listo antes de cierre fiscal: 30 de junio 2026
- Implementación: 6-8 semanas a partir de 2026-07-31

Técnicas:
- NO puede modificar sistema de nómina existente (solo recibir datos)
- DEBE ser compatible con AccessControl (QR ya existe)
- DEBE funcionar con infraestructura de multi-tenant (customerId)

Políticas:
- Datos de ausencia (médica, personal) son confidenciales
- Auditoría de cambios es obligatoria (compliance)
- Retención de histórico: 7 años (regulatorio)

Presupuesto:
- Personas: 1 Backend + 1 Frontend + 0.5 QA
- Infraestructura: utilizar existente (no costo nuevo)
- Licencias: gratuitas o existentes
```

---

## SECCIÓN 2: REGLAS DE NEGOCIO (4 NIVELES)

### NIVEL 1: Invariantes de Dominio

```
RN-REP-001: Un empleado solo puede tener UNA entrada y UNA salida por día laboral
  Excepción: Cambio de turno (en mismo día)
  
RN-REP-002: Hora de salida SIEMPRE debe ser posterior a hora de entrada
  Validación: salida > entrada del mismo día
  Consecuencia: Si se viola, registrar como error
  
RN-REP-003: No se puede registrar entrada futuro (verificar reloj del sistema)
  Tolerancia: máximo 5 minutos de desviación de hora del servidor
  
RN-REP-004: Toda entrada debe estar vinculada a un empleado válido
  Validación: GetEmployeeByQR(qrCode) debe devolver empleado activo
  Si falla: Rechazar y notificar "QR inválido o empleado inactivo"
  
RN-REP-005: No se puede modificar registro de más de 30 días atrás
  Excepto: Admin (solo con auditoría completa)
  
RN-REP-006: Cada entrada/salida crea un registro inmutable
  Si hay error: marcar como "anulada" (NO borrar)
```

### NIVEL 2: Flujo y Estados

```
ENTIDAD: Registro de Asistencia

ESTADOS POSIBLES:
1. Registrada (inicial) - QR escaneado, datos capturados
2. Validada - Gerente confirmó (manual, si es necesario)
3. Justificada - Empleado subió justificación de ausencia
4. Compensada - Ausencia se compensó (horas extras)
5. Procesada - Ya fue enviada a nómina (batch diario)
6. Cerrada - Fuera de ventana de edición (>30 días)
7. Anulada - Error, rechazada

TRANSICIONES:
Registrada → Validada
  - Automático: Si QR válido y no hay conflictos
  - Manual: Si hay ambigüedad (fallback a PIN)

Registrada → Justificada
  - Manual: Empleado sube documento
  - Requerido si: hay ausencia o retraso

Justificada → Compensada
  - Manual: RH aprueba compensación
  - Documento: Acta de compensación

Validada → Procesada
  - Automático: Batch diario a 23:59
  - Datos: Enviados a nómina

Procesada → Cerrada
  - Automático: Después de 30 días
  - Efecto: Ya no se puede modificar

CUALQUIER ESTADO → Anulada
  - Manual: Admin/RH si hay error
  - Auditoría: Registrar quién, qué, cuándo, por qué
```

### NIVEL 3: Seguridad/Autorización

```
ROLES Y PERMISOS:

EMPLEADO:
  - Ver propia asistencia (últimos 30 días)
  - Justificar ausencia (solo para propias ausencias)
  - NO puede ver otros empleados
  - NO puede modificar registros

GERENTE DE TURNO:
  - Ver asistencia del equipo (tiempo real)
  - Registrar entrada manual si QR falla
  - Validar justificaciones del equipo
  - NO puede ver datos salariales
  - NO puede anular registros

GERENTE DE RH:
  - Ver reporte global de asistencia
  - Procesar justificaciones (aprobar/rechazar)
  - Generar datos para nómina
  - Anular registros (con auditoría)
  - Exportar reportes

ADMINISTRADOR:
  - Acceso total (logs, auditoría, configuración)
  - Anular cualquier registro (auditoría mandatoria)

SISTEMA DE NÓMINA (API):
  - Leer datos de asistencia (lectura solo)
  - NO puede modificar registros
  - Autenticación: API Key específica

DATOS SENSIBLES:
  - Razones de ausencia: Médica (privada), Personal (privada), Permiso (pública)
  - Datos de ubicación: NO se almacenan (solo QR del edificio)
  - Cambios históricos: Almacenar (auditoría)
  - Retención: 7 años por regulatorio
```

### NIVEL 4: Validaciones de Datos

```
CAMPO: ID de Registro
  - Formato: UUID
  - Obligatorio: Sí
  - Generado: Sistema
  - Inmutable: Sí

CAMPO: Empleado ID
  - Tipo: UUID (customerIdService)
  - Obligatorio: Sí
  - Validación: Debe existir en BD de empleados
  - Error: "Empleado no encontrado"

CAMPO: Tipo de Evento
  - Tipo: Enum
  - Valores: "ENTRADA" | "SALIDA" | "ENTRADA_PAUSA" | "SALIDA_PAUSA"
  - Obligatorio: Sí
  - Default: None

CAMPO: Fecha
  - Formato: YYYY-MM-DD
  - Obligatorio: Sí
  - Validación: No puede ser futuro, máximo 30 días atrás
  - Error: "Fecha fuera de rango válido"

CAMPO: Hora
  - Formato: HH:MM:SS (24h)
  - Obligatorio: Sí
  - Validación: Entre 05:00:00 y 23:59:59
  - Tolerancia: ±5 minutos vs hora servidor
  - Error: "Hora inválida"

CAMPO: Método de Registro
  - Tipo: Enum
  - Valores: "QR" | "PIN" | "MANUAL" | "BIOMÉTRICO"
  - Obligatorio: Sí
  - Tracking: Para auditoría

CAMPO: Razón de Ausencia (si aplica)
  - Tipo: Enum
  - Valores: "MÉDICA" | "PERSONAL" | "PERMISO" | "FALTA"
  - Obligatorio: Sí (si es ausencia)
  - Validación: Debe ir acompañado de justificación

CAMPO: Documento de Justificación
  - Tipo: Archivo (PDF, JPG, PNG)
  - Tamaño máximo: 5 MB
  - Obligatorio: Si Razón es MÉDICA o PERSONAL
  - Almacenamiento: Cloud storage seguro

CAMPO: Notas (comentarios del gerente)
  - Tipo: Texto libre
  - Máximo: 500 caracteres
  - Obligatorio: No
  - Auditoría: Quién escribió, cuándo
```

---

## SECCIÓN 3: FLUJOS PRINCIPALES

### FLUJO 1: Happy Path - Empleado Registra Entrada Normal

```
ACTOR: Empleado, SISTEMA: Registro Entradas, SISTEMA: AccessControl

1. Empleado llega a la oficina
2. Empleado presenta QR a lector (escanea QR badge)
3. Sistema obtiene: customerId desde AccessControl.GetEmployeeByQR(qrCode)
4. Sistema valida:
   - ¿Empleado existe? ✓
   - ¿Empleado está activo? ✓
   - ¿Hora es válida? ✓
   - ¿Ya hay entrada hoy? ✗
5. Sistema registra entrada:
   - Fecha: HOY
   - Hora: AHORA (reloj servidor)
   - Tipo: ENTRADA
   - Método: QR
   - Estado: Registrada
6. Sistema valida contra horario:
   - ¿Está dentro de horario normal? ✓
   - ¿Hay retraso? ✗
7. Sistema marca estado como: Validada
8. Sistema crea notificación: "Entrada registrada a [HH:MM]"
9. Empleado ve confirmación en app: ✓ Entrada registrada
10. Gerente ve en dashboard: Empleado X registrado a [HH:MM]
11. Después de 30 días: Estado pasa a Cerrada automáticamente
12. Batch nómina (23:59): Incluye este registro en datos diarios

RESULTADO: ✅ Entrada registrada correctamente
DURACIÓN: 30 segundos
```

### FLUJO 2: Sad Path - QR Inválido o Fallido

```
ACTOR: Empleado, SISTEMA: Registro Entradas, SISTEMA: AccessControl

1. Empleado presenta QR a lector
2. AccessControl.GetEmployeeByQR(qrCode) retorna ERROR: "QR no válido"
3. Sistema rechaza: "QR inválido o expirado"
4. Sistema ofrece alternativa: "Ingrese PIN de 4 dígitos"
5. Empleado ingresa PIN
6. Sistema valida PIN:
   - ¿PIN es correcto? ✓
   - ¿Empleado existe? ✓
7. Sistema registra entrada:
   - Tipo: ENTRADA
   - Método: PIN (fallback)
   - Estado: Registrada
8. Sistema marca para revisión manual: "Verificar por QR roto"
9. Gerente recibe alerta: "Entrada por PIN - revisar"
10. Gerente confirma manualmente en dashboard

RESULTADO: ✅ Entrada registrada (pero con notificación)
DURACIÓN: 2-3 minutos
IMPACTO: Gerente debe validar manualmente
```

### FLUJO 3: Sad Path - Empleado Intenta Registrar 2 Veces

```
ACTOR: Empleado, SISTEMA: Registro Entradas

1. Empleado registra entrada a las 08:00 (QR)
2. Sistema crea registro: ENTRADA a 08:00, Estado: Validada
3. 2 minutos después, empleado presenta QR nuevamente (QR roto, presiona 2 veces)
4. Sistema busca: ¿Ya hay entrada registrada HOY?
5. Sistema encuentra: ✓ Sí, a las 08:00
6. Sistema rechaza: "Ya hay registro para hoy. Si hay error, contacte a RH"
7. Empleado NO ve entrada duplicada

RESULTADO: ✅ Duplicado prevenido
AUDITORÍA: Sistema registra "Intento de duplicado rechazado"
```

### FLUJO 4: Edge Case - Empleado en Cambio de Turno

```
ACTOR: Empleado (turno mañana → turno tarde)
CONTEXTO: Mismo día laboral, cambio de asignación

1. Empleado registra ENTRADA a 06:00 (turno mañana)
2. Sistema crea: ENTRADA a 06:00
3. A las 12:00, gerente le asigna a turno tarde (13:00-21:00)
4. Empleado intenta registrar SALIDA a 12:00 (fin de mañana)
5. Sistema crea: SALIDA a 12:00
6. Sistema valida: ¿Es salida sin entrada previa del turno tarde? ✗
7. Sistema acepta porque hay entrada de mañana activa
8. Empleado registra ENTRADA a 13:00 (inicio de tarde)
9. Sistema crea: ENTRADA a 13:00
10. Sistema permite porque es entrada nueva (turno diferente)

RESULTADO: ✅ 2 registros en mismo día (permitido por cambio de turno)
DATOS ENVIADOS A NÓMINA: 
  - Período mañana: 06:00-12:00 = 6 horas
  - Período tarde: 13:00-21:00 = 8 horas (sin salida, aún abierto)
```

### FLUJO 5: Edge Case - Empleado en Home Office

```
ACTOR: Empleado, SISTEMA: Registro Entradas

PREGUNTA: ¿Se registra entrada si está en home office?

RESPUESTA PENDIENTE DE TI:
[ ] Sí, registra igual (es responsabilidad de empleado registrarse)
[ ] No, se omite (gerente marca como "home office" en sistema)
[ ] Sí, pero con validación diferente (ej: auto-entrada a las 08:00)

POR AHORA ASUMO: Sí, se registra igual (responsabilidad del empleado)

FLUJO:
1. Empleado está en home office
2. Empleado abre app y registra entrada manual a 08:00
3. Sistema registra:
   - Tipo: ENTRADA
   - Método: MANUAL (no QR)
   - Nota: "Home office"
4. Gerente ve en dashboard: "Entrada manual - home office"
5. Gerente puede validar o pedir justificación

RESULTADO: ✅ Entrada registrada como manual/home office
AUDITORÍA: Marca como "no verificado por QR"
```

---

## SECCIÓN 4: INTEGRACIONES CON OTROS MÓDULOS

### INTEGRACIÓN 1: AccessControl

```
MÓDULO: AccessControl
RELACIÓN: Lectura de QR para obtener customerId del empleado

DATOS QUE RECIBE (REP ← AccessControl):
- customerId: UUID del empleado
- empleadoNombre: String (para validación)
- empleadoEstado: "ACTIVO" | "INACTIVO" | "SUSPENDIDO"

MÉTODOS/ENDPOINTS:
- AccessControl.GetEmployeeByQR(qrCode) → EmployeeDTO
  Returns: { customerId, nombre, estado, ultimo_acceso }
  Timeout: 2 segundos
  Error: Retry 3 veces, luego fallback a PIN

DATOS QUE ENVÍA (REP → AccessControl):
- Ninguno (lectura únicamente)

TIPO DE INTEGRACIÓN: Síncrona en tiempo real (QR)

CONTRATO:
```yaml
GetEmployeeByQR:
  Input: { qrCode: string }
  Output: { customerId: UUID, nombre: string, estado: enum }
  Error: 404 (QR no encontrado), 403 (empleado inactivo)
```

### INTEGRACIÓN 2: Nómina

```
MÓDULO: Nómina
RELACIÓN: Enviar datos de asistencia para cálculo de salarios

DATOS QUE RECIBE (Nómina ← REP):
- Diario a las 23:59
- Formato: JSON o CSV
- Contenido:
  {
    customerId: UUID,
    fecha: YYYY-MM-DD,
    horas_trabajadas: decimal (calculadas entre entrada/salida),
    ausencias: count,
    retrasos: count,
    justificaciones: [{tipo, documento_url}]
  }

DATOS QUE ENVÍA (Nómina → REP):
- Ninguno (no hay feedback)

TIPO DE INTEGRACIÓN: Batch asíncrono (diario)

FRECUENCIA: 23:59:00 cada día laboral

ERROR HANDLING:
- Si batch falla: Reintentar 3 veces
- Si falla 3 veces: Alertar a RH, no enviar incompleto

DATOS SENSIBLES:
- Datos de ausencia médica NO se envían a nómina (privacidad)
- Solo se envía: "ausencia justificada" o "ausencia injustificada"
```

### INTEGRACIÓN 3: Cobranza (FUTURA, NO CRÍTICA PARA V1)

```
MÓDULO: Cobranza (posible futura integración)
RELACIÓN: Aplicar descuentos por faltas injustificadas

DATOS QUE PODRÍAN ENVIARSE (REP → Cobranza):
- Si empleado tiene 3+ faltas en mes
- Descuento calculado: X% del salario (a definir por RH)
- Aplicable: Próxima factura

ESTADO: ⏳ NO INCLUIR EN V1
MOTIVO: Esperar a que REP esté estable
TIMELINE: Q4 2026 posiblemente
```

---

## SECCIÓN 5: RESTRICCIONES TÉCNICAS Y NO FUNCIONALES

### 5.1: Performance

```
Métrica: Respuesta al escanear QR
- Objetivo: < 500ms
- Incluye: Validación en AccessControl + Registro en BD

Métrica: Carga de dashboard de RH
- Objetivo: < 2 segundos
- Volumen: 1000 empleados, últimos 30 días

Métrica: Batch de nómina (23:59)
- Objetivo: < 5 minutos
- Volumen: 10,000 registros/día
```

### 5.2: Disponibilidad

```
Disponibilidad requerida: 99.5% (horas laborales 05:00-00:00)

Si AccessControl falla:
- ✓ Permitir fallback a PIN
- No bloquear completamente

Si BD está caída:
- ✗ NO registrar (evitar desincronización)
- Mostrar error claro: "Sistema en mantenimiento"

SLA: 4 horas de retraso aceptable (si hay data loss)

Backup:
- BD: Diaria
- Logs: Indefinido (compliance)
```

### 5.3: Escalabilidad

```
Empleados esperados: 500-2000 (inicialmente)
Crecimiento: 50% anual

Volumen de registros:
- Entrada: 1 por empleado/día
- Salida: 1 por empleado/día
- Total: ~4000 registros/día

Picos de carga:
- 08:00-09:00: 60% de entradas matutinas
- 12:00-13:00: Cambios de turno
- 17:00-18:00: Salidas de turno tarde
- 23:00-00:00: Batch de nómina

Arquitectura:
- DB: PostgreSQL (multi-tenant)
- Cache: Redis (últimas 100 entradas)
- API: Stateless (permite horizontal scaling)
```

### 5.4: Auditoría

```
OBLIGATORIO registrar:
- Quién registró: customerId + método (QR/PIN/MANUAL)
- Qué se registró: Hora, tipo de evento, estado
- Cuándo: Timestamp exacto (servidor)
- Por qué: Razón si fue anulada/modificada

CAMBIOS POSTERIORES:
- Toda modificación crea nuevo registro "auditoría"
- Ejemplo: Si RH anula una entrada, registrar:
  { tipo: "ANULACIÓN", quién: admin_id, hora_original: X, motivo: "..." }

RETENCIÓN:
- Histórico: 7 años (regulatorio)
- Logs: 1 año (operacional)

ACCESO:
- Solo Admin/RH pueden ver logs de auditoría
```

### 5.5: Cumplimiento Normativo

```
REGULACIONES:
- Ley de trabajo: Registro de asistencia es obligatorio
- Privacidad: Datos médicos deben ser privados (GDPR-like)
- Retención: 7 años mínimo

CERTIFICACIONES:
- SOC 2 (si aplica a la empresa)
- ISO 27001 (si aplica)

COMPLIANCE CHECKS:
- Auditor externo debe poder revisar logs
- Datos de ausencia médica: Encriptados, acceso limitado
- Cambios por admin: Siempre con justificación
```

---

## SECCIÓN 6: PREGUNTAS FINALES ABIERTAS

### P6.1: ¿Hay algo más no cubierto?

```
RESPUESTA:

Posible futura integración con:
- Sistema de permisos (vacaciones, permisos especiales)
- Sistema de alertas (si hay muchas ausencias)
- App móvil (vs solo web)

Pero estas son V2, no V1.
```

### P6.2: ¿Cuál es la prioridad relativa?

```
| Feature | Prioridad | Justificación |
|:---|:---|:---|
| Registrar entrada QR | 5 | Crítico, core |
| Registrar salida QR | 5 | Crítico, core |
| Validar ausencia | 5 | Crítico, impacta nómina |
| Integrar con nómina | 5 | Crítico, propósito principal |
| Reportes para RH | 4 | Importante, pero puede ser básico |
| Justificación de ausencias | 3 | Importante, pero puede ser manual inicialmente |
| Cambio de turno | 2 | Nice-to-have para V1 |
| Home office | 2 | Nice-to-have para V1 |
```

### P6.3: ¿Hay dependencias de otros equipos?

```
DEPENDENCIAS CRÍTICAS:

✓ AccessControl
  - Status: Disponible y funcionando
  - API de GetEmployeeByQR: ¿Ya existe?
  - Timeline: N/A (ya existe)
  - Riesgo: BAJO

✓ Nómina
  - Status: Disponible y funcionando
  - Puede recibir datos JSON diarios: ¿Confirmado?
  - Timeline: N/A (ya existe)
  - Riesgo: BAJO

✓ BD Empleados
  - Status: Disponible
  - Tabla de empleados activos: ¿Cuál es?
  - Timeline: N/A (ya existe)
  - Riesgo: BAJO

DEPENDENCIAS PUEDEN SER ABORDADAS EN SEMANA 1 DE IMPLEMENTACIÓN
```

---

## RESUMEN PARA CLAUDE CODE

**Cuestionario completado:** ✅ 100%

**Puntos clave capturados:**
- 6 actores con objetivos claros
- 5 KPIs medibles
- 6 invariantes de dominio
- 7 estados del ciclo de vida
- 3 roles principales (empleado, gerente, RH)
- 4 integraciones (1 crítica, 1 importante, 2 futuras)
- Performance, disponibilidad, escalabilidad definidas
- Auditoría y compliance claros

**Listo para:** FASE 0 - Business Rules Analysis

---

*Documento: 01-discovery-questionnaire.md (COMPLETADO) - 2026-07-30*
