# 📋 Reglas de Negocio - Módulo HR (Recursos Humanos)

**Documento Maestro de Reglas de Negocio - Recursos Humanos**

**Última actualización:** 2026-03-31
**Alcance:** `api/LuxuryApp.Application/Features/HR/`
**Total de Reglas:** 78 reglas documentadas
**Reglas con Base Legal (LFT México):** 7 reglas
**Submódulos Analizados:** 16

---

## 📑 Índice por Submódulo

1. [ContractAddendum (Adendas de Contrato)](#1-contractaddendum)
2. [ContractAddendumTemplate (Plantillas de Adendas)](#2-contractaddendumtemplate)
3. [ContractTemplate (Plantillas de Contrato)](#3-contracttemplate)
4. [ContractWork (Contratos de Trabajo)](#4-contractwork)
5. [EvaluationTemplate (Plantillas de Evaluación)](#5-evaluationtemplate)
6. [HRIncident (Incidencias Disciplinarias)](#6-hrincident)
7. [HRIncidentReport (Reportes de Incidencias)](#7-hrincidentreport)
8. [HrSanction (Sanciones Disciplinarias)](#8-hrsanction)
9. [IncidentType (Tipos de Incidencia)](#9-incidenttype)
10. [LeaveRequest (Permisos de Empleados)](#10-leaverequest)
11. [LeaveRequestApproval (Aprobación de Permisos)](#11-leaverequestapproval)
12. [PerformanceEvaluation (Evaluaciones de Desempeño)](#12-performanceevaluation)
13. [RecursosHumanos (Vacaciones - Módulo Principal)](#13-recursoshumanos)
14. [SanctionType (Tipos de Sanción)](#14-sanctiontype)
15. [VacationBalanceAdmin (Administración de Balance)](#15-vacationbalanceadmin)
16. [VacationRequestApproval (Aprobación de Vacaciones)](#16-vacationrequestapproval)

---

## 1. ContractAddendum {#1-contractaddendum}

### [RN-CONTADD-001] Generación automática de número de adenda

**Ubicación:** `ContractAddendumAppService.cs:l252`

**Descripción:** El sistema genera automáticamente un número único para cada adenda basado en el año y el contrato asociado.

**Tipo:** Negocio

**Condición:**

```csharp
GenerateAddendumNumberAsync(workContractId)
```

**Regla:** Formato: `ADENDA-{YYYY}-{NNN}` donde NNN es el consecutivo del contrato específico.

---

### [RN-CONTADD-002] Estado inicial de adenda es Borrador

**Ubicación:** `ContractAddendumAppService.cs:l118`

**Descripción:** Toda adenda creada comienza en estado Borrador.

**Tipo:** Workflow

**Condición:**

```csharp
addendum.AddendumStatus = EAddendumStatus.Borrador
```

**Acción:** La adenda debe ser firmada posteriormente para tener efecto.

---

### [RN-CONTADD-003] No edición de adendas firmadas

**Ubicación:** `ContractAddendumAppService.cs:l145`

**Descripción:** Una adenda que ya fue firmada no puede ser modificada.

**Tipo:** Integridad

**Condición:**

```csharp
if (addendum.AddendumStatus == EAddendumStatus.Firmado)
    return ErrorResult("No se puede editar una adenda ya firmada.", 400);
```

**Mensaje de Error:** "No se puede editar una adenda ya firmada."

---

### [RN-CONTADD-004] Firma de adenda cambia estado a Firmado

**Ubicación:** `ContractAddendumAppService.cs:l198`

**Descripción:** Al firmar una adenda, su estado cambia permanentemente a Firmado.

**Tipo:** Workflow

**Condición:**

```csharp
addendum.AddendumStatus = EAddendumStatus.Firmado
```

**Acción:** Se registra la fecha de firma y la adenda queda vinculante.

---

### [RN-CONTADD-005] No firma de adendas canceladas

**Ubicación:** `ContractAddendumAppService.cs:l204`

**Descripción:** Una adenda cancelada no puede ser firmada.

**Tipo:** Integridad

**Condición:**

```csharp
if (addendum.AddendumStatus == EAddendumStatus.Cancelado)
    return ErrorResult("No se puede firmar una adenda cancelada.", 400);
```

**Mensaje de Error:** "No se puede firmar una adenda cancelada."

---

### [RN-CONTADD-006] No cancelación de adendas firmadas

**Ubicación:** `ContractAddendumAppService.cs:l235`

**Descripción:** Una adenda ya firmada no puede ser cancelada.

**Tipo:** Integridad

**Condición:**

```csharp
if (addendum.AddendumStatus == EAddendumStatus.Firmado)
    return ErrorResult("No se puede cancelar una adenda ya firmada.", 400);
```

**Mensaje de Error:** "No se puede cancelar una adenda ya firmada."

---

### [RN-CONTADD-007] Validaciones de datos de adenda

**Ubicación:** `ContractAddendumAddOrEditDTO.cs`

**Descripción:** Reglas de validación para creación/edición de adendas.

**Tipo:** Validación

**Campos Requeridos:**

- `[Required]` WorkContractId
- `[Required]` AddendumType
- `[Required]` Title
- `[Required]` Content
- `[Required]` EffectiveDate

**Límites de Longitud:**

- `[StringLength(200)]` Title
- `[StringLength(1000)]` Notes

---

## 2. ContractAddendumTemplate {#2-contractaddendumtemplate}

**Nota:** Este submódulo sigue patrones similares a ContractTemplate. Las reglas específicas siguen el mismo patrón de gestión de plantillas.

---

## 3. ContractTemplate {#3-contracttemplate}

### [RN-CONTTPL-001] Extracción automática de placeholders

**Ubicación:** `ContractTemplateAppService.cs:l247`

**Descripción:** El sistema extrae automáticamente todos los placeholders {{VARIABLE}} del contenido del machote.

**Tipo:** Negocio

**Condición:**

```csharp
Regex.Matches(content, @"\{\{([A-Z_]+)\}\}")
```

**Acción:** Almacena lista de placeholders disponibles en `AvailablePlaceholders`.

---

### [RN-CONTTPL-002] Placeholders estándar para renderizado

**Ubicación:** `ContractTemplateAppService.cs:l208`

**Descripción:** El sistema soporta placeholders predefinidos para generación de contratos.

**Tipo:** Negocio

**Placeholders Soportados:**

- `EMPLEADO_NOMBRE`, `EMPLEADO_APELLIDOS`, `EMPLEADO_NOMBRE_COMPLETO`
- `EMPLEADO_CURP`, `EMPLEADO_RFC`, `EMPLEADO_IMSS`
- `EMPLEADO_PUESTO`, `SALARIO`, `FECHA_INICIO`, `FECHA_HOY`
- `EMPRESA_NOMBRE`, `EMPRESA_RFC`

**Acción:** Reemplaza placeholders con datos reales del empleado y empresa.

---

### [RN-CONTTPL-003] Activación/Desactivación de plantillas

**Ubicación:** `ContractTemplateAppService.cs:l165`

**Descripción:** Las plantillas pueden activarse o desactivarse sin eliminarse.

**Tipo:** Workflow

**Condición:**

```csharp
template.IsActive = !template.IsActive
```

**Acción:** Solo plantillas activas pueden usarse para generar nuevos contratos.

---

### [RN-CONTTPL-004] Validaciones de plantilla

**Ubicación:** `ContractTemplateAddOrEditDTO.cs`

**Descripción:** Reglas de validación para plantillas de contrato.

**Tipo:** Validación

**Campos Requeridos:**

- `[Required]` Name
- `[Required]` ContractType
- `[Required]` TemplateContent

**Límites de Longitud:**

- `[StringLength(150)]` Name
- `[StringLength(500)]` Description
- `[StringLength(20)]` Version

---

## 4. ContractWork {#4-contractwork}

### [RN-CONTWORK-001] Generación automática de número de contrato

**Ubicación:** `WorkContractAppService.cs:l252`

**Descripción:** El sistema genera un número único para cada contrato laboral.

**Tipo:** Negocio

**Condición:**

```csharp
GenerateContractNumberAsync()
```

**Regla:** Formato: `CONT-{YYYY}-{NNNN}` donde NNNN es consecutivo anual.

---

### [RN-CONTWORK-002] Estado inicial de contrato es Borrador

**Ubicación:** `WorkContractAppService.cs:l118`

**Descripción:** Todo contrato creado comienza en estado Borrador.

**Tipo:** Workflow

**Condición:**

```csharp
contract.ContractStatus = EContractStatus.Borrador
```

---

### [RN-CONTWORK-003] Terminación de contrato requiere fecha y motivo

**Ubicación:** `WorkContractAppService.cs:l181`

**Descripción:** Para terminar un contrato, se debe especificar fecha de terminación, motivo y artículo LFT aplicable.

**Tipo:** Validación

**Campos Requeridos:**

- `dto.TerminationDate`
- `dto.TerminationReason`
- `dto.LftArticle`

**Acción:** Cambia estado a `Terminado` y registra información de terminación.

---

### [RN-CONTWORK-004] Alerta de contratos por vencer

**Ubicación:** `WorkContractAppService.cs:l226`

**Descripción:** El sistema puede consultar contratos que vencen en un rango de días específico.

**Tipo:** Negocio

**Condición:**

```csharp
x.EndDate.Value >= today && x.EndDate.Value <= limitDate
```

**Acción:** Retorna lista de contratos activos por vencer con días restantes calculados.

---

### [RN-CONTWORK-005] Validaciones de contrato

**Ubicación:** `WorkContractAddOrEditDTO.cs`

**Descripción:** Reglas de validación para contratos de trabajo.

**Tipo:** Validación

**Campos Requeridos:**

- `[Required]` EmployeeId
- `[Required]` ContractType
- `[Required]` StartDate
- `[Required]` ContractSalary

**Validaciones Numéricas:**

- `[Range(0.01, double.MaxValue)]` ContractSalary

**Mensaje de Error:** "El salario debe ser mayor a cero"

**Límites de Longitud:**

- `[StringLength(1000)]` Notes

---

## 5. EvaluationTemplate {#5-evaluationtemplate}

### [RN-EVALTPL-001] Estructura jerárquica de plantillas

**Ubicación:** `TemplateEvaluationAppService.cs`

**Descripción:** Las plantillas de evaluación tienen estructura: Plantilla → Categorías → Preguntas.

**Tipo:** Negocio

**Estructura:**

```
Plantilla
├── Categoría 1
│   ├── Pregunta 1
│   ├── Pregunta 2
│   └── Pregunta 3
└── Categoría 2
    ├── Pregunta 1
    └── Pregunta 2
```

**Acción:** Permite evaluación estructurada por competencias.

---

### [RN-EVALTPL-002] Eliminación en cascada de plantillas

**Ubicación:** `TemplateEvaluationAppService.cs:l74`

**Descripción:** Al eliminar una plantilla, se eliminan explícitamente todas sus categorías y preguntas.

**Tipo:** Integridad

**Orden de Eliminación:**

1. Preguntas de cada categoría
2. Categorías
3. Plantilla principal

**Acción:** Previene datos huérfanos en la base de datos.

---

### [RN-EVALTPL-003] Marcado de eliminación lógica

**Ubicación:** `TemplateEvaluationAppService.cs:l167`

**Descripción:** Las categorías y preguntas pueden marcarse como eliminadas sin borrarse físicamente.

**Tipo:** Integridad

**Condición:**

```csharp
category.IsDeleted = true
question.IsDeleted = true
```

**Acción:** Permite mantener historial sin mostrar elementos eliminados.

---

### [RN-EVALTPL-004] Validaciones de plantilla de evaluación

**Ubicación:** `SaveEvaluationTemplateRequestDTO.cs`

**Descripción:** Reglas de validación para plantillas de evaluación.

**Tipo:** Validación

**Campos Requeridos:**

- `[Required]` Name
- `[Required]` CustomerId

**Límites de Longitud:**

- `[MaxLength(255)]` Name

---

## 6. HRIncident {#6-hrincident}

### [RN-INC-001] Derecho a audiencia - 1 día hábil mínimo ⚖️

**Ubicación:** `IncidentAppService.cs:l237`

**Descripción:** **BASE LEGAL LFT:** El empleado tiene derecho a al menos 1 día hábil para defenderse antes de que se resuelva una incidencia.

**Tipo:** Autorización | Base Legal

**Condición:**

```csharp
var diasTranscurridos = (DateTime.UtcNow - incident.CreatedAt).TotalDays;
if (diasTranscurridos < 1)
{
    return ErrorResult("El empleado aún tiene derecho a audiencia. Debe pasar al menos 1 día hábil desde la creación del acta antes de resolverla.", 400);
}
```

**Mensaje de Error:** "El empleado aún tiene derecho a audiencia. Debe pasar al menos 1 día hábil desde la creación del acta antes de resolverla."

**Base Legal:** Ley Federal del Trabajo de México - Derecho a audiencia previa a sanción.

---

### [RN-INC-002] Estado inicial de incidencia es Reportado

**Ubicación:** `IncidentAppService.cs:l115`

**Descripción:** Toda incidencia creada comienza en estado Reportado.

**Tipo:** Workflow

**Condición:**

```csharp
incident.InvestigationStatus = EInvestigationStatus.Reportado
```

---

### [RN-INC-003] Solo incidencias en estado Reportado son editables

**Ubicación:** `IncidentAppService.cs:l181`

**Descripción:** Una incidencia solo puede editarse mientras esté en estado Reportado.

**Tipo:** Workflow

**Condición:**

```csharp
if (incident.InvestigationStatus != EInvestigationStatus.Reportado)
    return ErrorResult("Solo se pueden editar incidencias en estatus Reportado.", 400);
```

**Mensaje de Error:** "Solo se pueden editar incidencias en estatus Reportado."

---

### [RN-INC-004] Resolución de incidencia requiere estatus y racional

**Ubicación:** `IncidentAppService.cs:l226`

**Descripción:** Al resolver una incidencia, se debe especificar el estatus de investigación, notas y si aplica sanción.

**Tipo:** Validación

**Campos Requeridos:**

- `dto.InvestigationStatus`
- `dto.InvestigationNotes`
- `dto.SanctionApplied`
- `dto.DecisionRationale`

**Acción:** Cambia estado a `ResueltoConSancion` o `ResueltoSinSancion`.

---

### [RN-INC-005] Cancelación de incidencia

**Ubicación:** `IncidentAppService.cs:l262`

**Descripción:** Las incidencias pueden cancelarse con motivo, pero no eliminarse físicamente excepto por SuperUsuario.

**Tipo:** Workflow

**Condición:**

```csharp
incident.IsCancelled = true
incident.CancellationReason = dto.CancellationReason
```

**Acción:** Marca incidencia como cancelada, la oculta de listados estándar.

---

### [RN-INC-006] Solo SuperUsuario puede eliminar físicamente incidencias

**Ubicación:** `IncidentAppService.cs:l297`

**Descripción:** La eliminación física de incidencias está restringida al rol SuperUsuario.

**Tipo:** Autorización

**Condición:**

```csharp
if (!string.Equals(currentUserService.UserRole, nameof(EApplicationRoleEnum.SuperUsuario)))
    return ErrorResult("Solo SuperUsuario puede eliminar incidencias físicamente.", 403);
```

**Mensaje de Error:** "Solo SuperUsuario puede eliminar incidencias físicamente."

---

### [RN-INC-007] Creación automática de sanción al reportar

**Ubicación:** `IncidentAppService.cs:l123`

**Descripción:** Si al crear una incidencia se especifica un tipo de sanción, se crea automáticamente el registro de sanción.

**Tipo:** Workflow

**Condición:**

```csharp
if (dto.SanctionTypeId.HasValue)
{
    // Crea entidad Sanction con estado Activa
}
```

**Acción:** Crea entidad `Sanction` con estado `Activa` vinculada a la incidencia.

---

### [RN-INC-008] Validaciones de incidencia

**Ubicación:** `IncidentAddOrEditDTO.cs`

**Descripción:** Reglas de validación para incidencias disciplinarias.

**Tipo:** Validación

**Campos Requeridos:**

- `[Required]` EmployeeId
- `[Required]` IncidentTypeId
- `[Required]` IncidentDateTime
- `[Required]` SeverityLevel

**Límites de Longitud:**

- `[StringLength(2000, MinimumLength = 10)]` Description
- `[StringLength(500)]` Witnesses

**Mensaje de Error:** "La descripción debe tener entre 10 y 2000 caracteres"

---

### [RN-INC-009] Alerta de incidencias pendientes > 24 horas (sin contar domingos)

**Ubicación:** `IncidentReportAppService.cs:l103`

**Descripción:** El sistema genera alerta para incidencias graves no atendidas por más de 24 horas hábiles (excluyendo domingos).

**Tipo:** Negocio

**Condición:**

```csharp
// Calcula horas hábiles excluyendo domingos
var horasHabilesTranscurridas = CalcularHorasHabiles(incident.CreatedAt, DateTime.UtcNow);

// Genera alerta si es grave y pasó más de 24 horas hábiles
if (horasHabilesTranscurridas > 24 &&
    incident.InvestigationStatus == EInvestigationStatus.Reportado &&
    (incident.SeverityLevel == ESeverityLevel.Medium || incident.SeverityLevel == ESeverityLevel.High))
{
    incident.RequiresAlert = true;
}
```

**Regla de Cálculo:**

- Excluye domingos del cómputo de horas
- Solo cuenta horas hábiles (lunes a sábado)
- Aplica para severidad: Grave (Medium) y Muy Grave (High)

**Acción:** Marca incidencia con `RequiresAlert = true` en reporte de pendientes.

**Notificación:** Al marcar la alerta, el sistema notifica a:

- Supervisor del empleado
- Recursos Humanos
- Gerente de operaciones

---

## 📋 Mejoras de UX Sugeridas para Módulo de Incidencias

### Notificaciones Faltantes (Por Implementar)

#### [UX-INC-001] Notificación al empleado al crear incidencia ⚠️ PENDIENTE

**Descripción:** Actualmente el sistema NO notifica al empleado cuando se le levanta una incidencia.

**Tipo:** Notificación (Pendiente de implementación)

**Justificación:** El empleado debe ser informado inmediatamente para:

- Ejercer su derecho a audiencia
- Presentar justificaciones dentro del plazo
- Tener claridad del proceso en su contra

**Implementación Sugerida:**

```csharp
// En IncidentAppService.cs después de crear la incidencia
await notificationService.NotifyEmployeeIncidentCreatedAsync(incident);
```

**Canales de Notificación:**

- ✅ Email al empleado
- ✅ Push notification (OneSignal)
- ✅ Notificación en plataforma (SignalR)

**Contenido del Email:**

```
Asunto: Notificación de Incidencia Disciplinaria - [Folio]

Estimado [Nombre del Empleado]:

Le informamos que se ha registrado una incidencia disciplinaria en su expediente.

Detalles:
- Folio: INC-2026-0001
- Fecha: 31/03/2026 10:00 AM
- Tipo: [Nombre del tipo de incidencia]
- Severidad: [Leve/Moderado/Grave/Muy Grave]
- Reportado por: [Nombre de quien reporta]

IMPORTANTE: Usted tiene derecho a audiencia y puede presentar su justificación
dentro de las 24 horas hábiles siguientes a esta notificación.

Para más detalles, contacte a Recursos Humanos.
```

---

#### [UX-INC-002] Timeline visual del proceso de incidencia ⚠️ PENDIENTE

**Descripción:** Agregar una línea de tiempo visual en el formulario de incidencia para mostrar el estado del proceso.

**Tipo:** UX (Pendiente de implementación)

**Componente Sugerido:**

```html
<!-- En incident-form.html o incident-detail.html -->
<p-steps [model]="timelineItems" [activeIndex]="currentStepIndex" />
```

**Pasos del Timeline:**

1. 📝 Reportado (Día 0)
2. ⏳ En Investigación (Día 1+)
3. 👨‍⚖️ Derecho a Audiencia (24 hrs hábiles)
4. ✅ Resuelto (Con/Sin Sanción)

**Beneficios:**

- El empleado conoce el estado de su proceso
- Claridad en los plazos legales
- Reduce ansiedad y confusiones

---

#### [UX-INC-003] Banner informativo de derechos del empleado ⚠️ PENDIENTE

**Descripción:** Mostrar banner informativo en el formulario de incidencias (vista del empleado).

**Tipo:** UX (Pendiente de implementación)

**Contenido del Banner:**

```html
<div class="p-message p-message-info">
  <h4>📋 Sus Derechos como Empleado</h4>
  <ul>
    <li>✅ Derecho a audiencia dentro de 24 horas hábiles</li>
    <li>✅ Derecho a presentar justificaciones y pruebas</li>
    <li>✅ Derecho a conocer los hechos que se le imputan</li>
    <li>✅ Derecho a no autoincriminarse</li>
  </ul>
  <p class="text-sm">
    <strong>Base Legal:</strong> Ley Federal del Trabajo, Artículo 47
  </p>
</div>
```

---

#### [UX-INC-004] Checklist de documentos y evidencias ⚠️ PENDIENTE

**Descripción:** Agregar checklist visual para documentos y evidencias requeridas.

**Tipo:** UX (Pendiente de implementación)

**Componente Sugerido:**

```html
<!-- En incident-form.html -->
<div class="evidence-checklist">
  <h4>📎 Evidencias Requeridas</h4>

  <p-checkbox
    [label]="'Fotografías del incidente'"
    [checked]="hasPhotos()"
    [disabled]="true"
  />

  <p-checkbox
    [label]="'Declaración de testigos'"
    [checked]="hasWitnesses()"
    [disabled]="true"
  />

  <p-checkbox
    [label]="'Documentos de respaldo'"
    [checked]="hasDocuments()"
    [disabled]="true"
  />
</div>
```

**Validación Visual:**

- ✅ Verde: Documento presente
- ⚠️ Amarillo: Documento pendiente
- ❌ Rojo: Documento faltante (bloqueante)

---

#### [UX-INC-005] Recordatorio de plazos críticos ⚠️ PENDIENTE

**Descripción:** Mostrar alertas visuales de plazos críticos en el dashboard de incidencias.

**Tipo:** UX (Pendiente de implementación)

**Componente Sugerido:**

```html
<!-- En incident-list.html o dashboard -->
@if (incident.hoursUntilDeadline < 24) {
<div class="p-message p-message-warning">
  <i class="pi pi-clock"></i>
  <strong>⏰ Plazo Crítico:</strong>
  Esta incidencia vence en {{incident.hoursUntilDeadline}} horas hábiles
</div>
} @if (incident.hoursUntilDeadline < 4) {
<div class="p-message p-message-danger">
  <i class="pi pi-exclamation-triangle"></i>
  <strong>🚨 VENCIMIENTO INMINENTE:</strong>
  Esta incidencia vence en {{incident.hoursUntilDeadline}} horas hábiles
</div>
}
```

**Colores de Alerta:**
| Plazo Restante | Color | Mensaje |
|---------------|-------|---------|
| < 24 horas | Amarillo | Advertencia |
| < 12 horas | Naranja | Precaución |
| < 4 horas | Rojo | Crítico |
| Vencido | Rojo + Icono | Vencido |

---

#### [UX-INC-006] Guía contextual en formularios ⚠️ PENDIENTE

**Descripción:** Agregar tooltips y guías contextuales en cada campo del formulario de incidencias.

**Tipo:** UX (Pendiente de implementación)

**Ejemplos:**

**Campo: Descripción**

```html
<custom-input-textarea-signal
  label="Descripción de los Hechos"
  [control]="form.controls.description"
  [rows]="4"
>
  <!-- Tooltip informativo -->
  <ng-template pTemplate="hint">
    <i class="pi pi-info-circle"></i>
    Describa de manera clara y objetiva los hechos. Incluya:
    <ul>
      <li>¿Qué sucedió?</li>
      <li>¿Cuándo y dónde ocurrió?</li>
      <li>¿Quiénes estuvieron presentes?</li>
      <li>¿Existen pruebas o evidencias?</li>
    </ul>
    <strong>Mínimo 10 caracteres, máximo 2000 caracteres.</strong>
  </ng-template>
</custom-input-textarea-signal>
```

**Campo: Severidad**

```html
<custom-input-select-signal
  label="Nivel de Severidad"
  [control]="form.controls.severityLevel"
  [data]="cb_severity()"
>
  <!-- Tooltip con guía de severidad -->
  <ng-template pTemplate="hint">
    <table class="severity-guide">
      <tr>
        <th>Nivel</th>
        <th>Ejemplo</th>
      </tr>
      <tr>
        <td>🟢 Leve</td>
        <td>Retraso < 15 min</td>
      </tr>
      <tr>
        <td>🟡 Moderado</td>
        <td>Falta injustificada (1 día)</td>
      </tr>
      <tr>
        <td>🟠 Grave</td>
        <td>Insubordinación</td>
      </tr>
      <tr>
        <td>🔴 Muy Grave</td>
        <td>Robo, acoso, violencia</td>
      </tr>
    </table>
  </ng-template>
</custom-input-select-signal>
```

---

#### [UX-INC-007] Resumen ejecutivo al finalizar formulario ⚠️ PENDIENTE

**Descripción:** Mostrar resumen de la incidencia antes de guardar.

**Tipo:** UX (Pendiente de implementación)

**Componente Sugerido:**

```html
<!-- Dialog de confirmación -->
<p-dialog header="📋 Resumen de Incidencia" [(visible)]="showSummary">
  <div class="summary-content">
    <h4>Datos Generales</h4>
    <p><strong>Empleado:</strong> {{employeeName}}</p>
    <p><strong>Tipo de Incidencia:</strong> {{incidentTypeName}}</p>
    <p><strong>Severidad:</strong> {{severityLevel}}</p>
    <p>
      <strong>Fecha del Incidente:</strong> {{incidentDateTime |
      date:'dd/MM/yyyy HH:mm'}}
    </p>

    <h4>Ⓜ️ Descripción</h4>
    <p>{{description}}</p>

    <h4>👥 Testigos</h4>
    <ul>
      @for (witness of witnesses; track witness) {
      <li>{{witness.fullName}} - {{witness.position}}</li>
      }
    </ul>

    <h4>📎 Evidencias</h4>
    <ul>
      @for (attachment of attachments; track attachment) {
      <li>
        <i class="pi pi-file"></i>
        {{attachment.fileName}} ({{attachment.fileSizeKB}} KB)
      </li>
      }
    </ul>

    <div class="p-message p-message-warn">
      <i class="pi pi-exclamation-triangle"></i>
      <strong>Importante:</strong> Una vez guardada, esta incidencia solo podrá
      editarse mientras esté en estado "Reportado".
    </div>
  </div>

  <ng-template pTemplate="footer">
    <button pButton label="❌ Cancelar" (click)="showSummary = false"></button>
    <button
      pButton
      label="✅ Confirmar y Guardar"
      (click)="confirmAndSave()"
    ></button>
  </ng-template>
</p-dialog>
```

---

## 📊 Checklist de Implementación de Mejoras UX

| ID           | Mejora                   | Prioridad | Complejidad | Estado       |
| ------------ | ------------------------ | --------- | ----------- | ------------ |
| [UX-INC-001] | Notificación al empleado | 🔴 Alta   | Media       | ⏳ Pendiente |
| [UX-INC-002] | Timeline visual          | 🟡 Media  | Baja        | ⏳ Pendiente |
| [UX-INC-003] | Banner de derechos       | 🔴 Alta   | Baja        | ⏳ Pendiente |
| [UX-INC-004] | Checklist de evidencias  | 🟡 Media  | Media       | ⏳ Pendiente |
| [UX-INC-005] | Recordatorio de plazos   | 🔴 Alta   | Media       | ⏳ Pendiente |
| [UX-INC-006] | Guías contextuales       | 🟢 Baja   | Media       | ⏳ Pendiente |
| [UX-INC-007] | Resumen ejecutivo        | 🟡 Media  | Baja        | ⏳ Pendiente |

---

## 🎯 Guía Práctica de Reglas para Vistas y Formularios

### Para `incident-list.html`

```html
<!-- BADGE DE SEVERIDAD -->
@switch (item.severityLevel) { @case ("Leve") {
<span class="badge badge-info">🟢 Leve</span>
} @case ("Moderado") {
<span class="badge badge-warning">🟡 Moderado</span>
} @case ("Grave") {
<span class="badge badge-danger">🟠 Grave</span>
} @case ("Muy Grave") {
<span class="badge badge-danger">🔴 Muy Grave</span>
} }

<!-- ALERTA DE PLAZO CRÍTICO -->
@if (item.hoursUntilDeadline < 24 && item.status === 'Reportado') {
<div class="alert alert-warning">
  <i class="pi pi-clock"></i>
  Vence en {{item.hoursUntilDeadline}} horas hábiles
</div>
}

<!-- BOTONES DE ACCIÓN -->
<!-- Solo mostrar "Resolver" si pasó 1 día hábil -->
@if (item.hoursSinceCreated >= 24 && item.status === 'Reportado') {
<custom-button label="✅ Resolver" (clicked)="onResolve(item)" />
} @else {
<p-tag
  value="⏳ Espere {{24 - item.hoursSinceCreated | number:'1.0-0'}} horas para resolver"
  severity="warning"
/>
}
```

---

### Para `incident-form.html`

```html
<!-- BANNER DE DERECHOS DEL EMPLEADO -->
<div class="p-message p-message-info">
  <h4>📋 Derechos del Empleado</h4>
  <ul>
    <li>✅ Derecho a audiencia (24 horas hábiles)</li>
    <li>✅ Derecho a presentar justificaciones</li>
    <li>✅ Derecho a conocer los hechos</li>
  </ul>
</div>

<!-- TOOLTIPS INFORMATIVOS -->
<custom-input-textarea-signal
  label="Descripción"
  [control]="form.controls.description"
  [rows]="4"
  placeholder="Describa los hechos de manera clara y objetiva..."
>
  <ng-template pTemplate="hint">
    <i class="pi pi-info-circle"></i>
    <strong>Recomendaciones:</strong>
    <ul>
      <li>Sea objetivo y específico</li>
      <li>Incluya fecha, hora y lugar</li>
      <li>Mencione testigos si los hay</li>
      <li>Adjunte evidencias disponibles</li>
    </ul>
    <strong>Requerido: 10-2000 caracteres</strong>
  </ng-template>
</custom-input-textarea-signal>

<!-- GUÍA DE SEVERIDAD -->
<custom-input-select-signal
  label="Nivel de Severidad"
  [control]="form.controls.severityLevel"
  [data]="cb_severity()"
>
  <ng-template pTemplate="hint">
    <table class="severity-guide">
      <tr>
        <th>Nivel</th>
        <th>Ejemplos</th>
      </tr>
      <tr>
        <td>🟢 Leve</td>
        <td>Retrasos < 15 min, faltas de ortografía</td>
      </tr>
      <tr>
        <td>🟡 Moderado</td>
        <td>Falta injustificada (1 día), bajo desempeño</td>
      </tr>
      <tr>
        <td>🟠 Grave</td>
        <td>Insubordinación, negligencia</td>
      </tr>
      <tr>
        <td>🔴 Muy Grave</td>
        <td>Robo, acoso, violencia, discriminación</td>
      </tr>
    </table>
  </ng-template>
</custom-input-select-signal>

<!-- RESUMEN ANTES DE GUARDAR -->
<div class="form-summary" *ngIf="showSummary">
  <h3>📋 Resumen de Incidencia</h3>
  <p><strong>Empleado:</strong> {{employeeName}}</p>
  <p><strong>Tipo:</strong> {{incidentTypeName}}</p>
  <p><strong>Severidad:</strong> {{severityLevel}}</p>
  <p><strong>Fecha:</strong> {{incidentDateTime}}</p>
  <p><strong>Testigos:</strong> {{witnesses.length}}</p>
  <p><strong>Evidencias:</strong> {{attachments.length}}</p>

  <div class="p-message p-message-warn">
    <i class="pi pi-exclamation-triangle"></i>
    Solo podrá editar esta incidencia mientras esté en estado "Reportado".
  </div>

  <button (click)="confirmAndSave()">✅ Confirmar y Guardar</button>
</div>
```

---

### Para `incident-resolve.html`

```html
<!-- ALERTA DE DERECHO A AUDIENCIA -->
@if (hoursSinceCreated < 24) {
<div class="p-message p-message-error">
  <i class="pi pi-ban"></i>
  <strong>⛔ No se puede resolver aún</strong>
  <p>
    El empleado tiene derecho a {{24 - hoursSinceCreated | number:'1.0-0'}}
    horas hábiles para presentar su justificación.
  </p>
  <p class="text-sm">
    <strong>Podrá resolver:</strong> {{availableResolveDate | date:'dd/MM/yyyy
    HH:mm'}}
  </p>
</div>
} @else {
<div class="p-message p-message-success">
  <i class="pi pi-check-circle"></i>
  <strong>✅ Derecho a audiencia cumplido</strong>
  <p>
    El empleado fue notificado hace {{hoursSinceCreated | number:'1.0-0'}} horas
    hábiles.
  </p>
</div>
}

<!-- CHECKLIST DE REQUISITOS PARA RESOLVER -->
<div class="resolve-checklist">
  <h4>📋 Requisitos para Resolver</h4>

  <p-checkbox
    [label]="'Empleado fue notificado (>24 hrs)'"
    [checked]="hoursSinceCreated >= 24"
    [disabled]="true"
  />

  <p-checkbox
    [label]="'Investigación completada'"
    [checked]="form.value.investigationNotes?.length > 0"
    [disabled]="true"
  />

  <p-checkbox
    [label]="'Decisión justificada'"
    [checked]="form.value.decisionRationale?.length > 0"
    [disabled]="true"
  />
</div>
```

---

## 📞 Contactos de Notificación (Configuración Sugerida)

```typescript
// En app.config.ts o environment.ts
export const incidentNotificationConfig = {
  // Roles que reciben notificación de incidencia nueva
  newIncident: [
    "SuperUsuario",
    "Direccion",
    "RecursosHumanos",
    "SupervisionOperativa",
    "GerenteOperaciones",
    "GerenteAtencion",
  ],

  // Roles que reciben alerta de plazo crítico (< 24 hrs)
  criticalDeadline: ["SuperUsuario", "RecursosHumanos", "GerenteOperaciones"],

  // Roles que reciben notificación de incidencia resuelta
  incidentResolved: ["SuperUsuario", "Direccion", "RecursosHumanos"],
};
```

---

## 📝 Notas de Implementación

### Prioridad de Implementación

**Fase 1 (Crítica - 1 semana):**

1. [UX-INC-001] - Notificación al empleado
2. [UX-INC-003] - Banner de derechos
3. [UX-INC-005] - Recordatorio de plazos

**Fase 2 (Importante - 2 semanas):** 4. [UX-INC-002] - Timeline visual 5. [UX-INC-007] - Resumen ejecutivo

**Fase 3 (Mejora - 3 semanas):** 6. [UX-INC-004] - Checklist de evidencias 7. [UX-INC-006] - Guías contextuales

---

**Documento actualizado:** 2026-03-31
**Regla modificada:** [RN-INC-009] - Alerta de 72 → 24 horas hábiles
**Mejoras UX agregadas:** 7 mejoras sugeridas

### [RN-INCRPT-001] Exportación de incidencias a Excel

**Ubicación:** `IncidentReportAppService.cs:l134`

**Descripción:** El sistema permite exportar incidencias filtradas a formato Excel.

**Tipo:** Negocio

**Filtros Disponibles:**

- Fecha desde/hasta
- Categoría
- Severidad

**Acción:** Genera archivo XLSX con columnas estandarizadas.

---

## 8. HrSanction {#8-hrsanction}

### [RN-SANC-001] Notificación automática de sanción aplicada

**Ubicación:** `SanctionAppService.cs:l159`

**Descripción:** Al aplicar una sanción, se notifica automáticamente al empleado sancionado.

**Tipo:** Workflow

**Condición:**

```csharp
await notificationService.NotifySanctionAppliedAsync(sanction.Id)
```

**Acción:** Envía notificación con detalles de la sanción.

---

### [RN-SANC-002] Sanción requiere incidencia con sanción marcada

**Ubicación:** `SanctionAppService.cs:l137`

**Descripción:** Solo puede crearse una sanción si la incidencia asociada tiene `SanctionApplied = true`.

**Tipo:** Integridad

**Condición:**

```csharp
if (!incident.SanctionApplied)
    return ErrorResult("La incidencia no fue marcada para sanción.", 400);
```

**Mensaje de Error:** "La incidencia no fue marcada para sanción."

---

### [RN-SANC-003] No duplicidad de sanciones por incidencia

**Ubicación:** `SanctionAppService.cs:l143`

**Descripción:** Una incidencia solo puede tener una sanción asociada.

**Tipo:** Integridad

**Condición:**

```csharp
var existingSanction = await dbContext.Sanctions.AnyAsync(x => x.IncidentId == dto.IncidentId);
if (existingSanction)
    return ErrorResult("Ya existe una sanción registrada para esta incidencia.", 409);
```

**Mensaje de Error:** "Ya existe una sanción registrada para esta incidencia."

---

### [RN-SANC-004] Cambio de estatus a Cumplida registra fecha

**Ubicación:** `SanctionAppService.cs:l194`

**Descripción:** Al cambiar el estatus de una sanción a Cumplida, se registra automáticamente la fecha de cumplimiento.

**Tipo:** Workflow

**Condición:**

```csharp
if (dto.NewStatus == ESanctionStatus.Cumplida)
    sanction.CompletedDate = DateTime.UtcNow;
```

---

### [RN-SANC-005] Consulta de sanciones por vencer

**Ubicación:** `SanctionAppService.cs:l52`

**Descripción:** El sistema puede listar sanciones activas que vencen en un rango de días específico.

**Tipo:** Negocio

**Condición:**

```csharp
x.EffectiveEndDate.Value <= fechaLimite
```

**Acción:** Retorna sanciones ordenadas por fecha de vencimiento.

---

### [RN-SANC-006] Validaciones de sanción

**Ubicación:** `SanctionAddOrEditDTO.cs`

**Descripción:** Reglas de validación para sanciones.

**Tipo:** Validación

**Campos Requeridos:**

- `[Required]` IncidentId
- `[Required]` SanctionTypeId
- `[Required]` EffectiveStartDate

**Límites de Longitud:**

- `[StringLength(1000)]` Conditions
- `[StringLength(1000)]` InternalNotes

---

## 9. IncidentType {#9-incidenttype}

### [RN-INCTYPE-001] Tipos de incidencia por cliente

**Ubicación:** `IncidentTypeAppService.cs`

**Descripción:** Los tipos de incidencia son específicos por cliente (CustomerId).

**Tipo:** Integridad

**Condición:**

```csharp
x.CustomerId == customerId
```

**Acción:** Cada cliente gestiona sus propios tipos de incidencia.

---

### [RN-INCTYPE-002] Activación/Desactivación de tipos de incidencia

**Ubicación:** `IncidentTypeAppService.cs:l143`

**Descripción:** Los tipos de incidencia pueden activarse o desactivarse sin eliminarse.

**Tipo:** Workflow

**Condición:**

```csharp
entity.IsActive = !entity.IsActive
```

---

## 10. LeaveRequest {#10-leaverequest}

### [RN-LEAVE-001] Roles no permitidos para solicitar permisos

**Ubicación:** `LeaveRequestService.cs:l71`

**Descripción:** Ciertos roles no tienen permitido solicitar permisos.

**Tipo:** Autorización

**Roles Bloqueados:**

- Comite
- Condomino
- Jardineria
- Limpieza
- Proveedor
- Direccion

**Condición:**

```csharp
rolesNoPermitidos = ["Comite", "Condomino", "Jardineria", "Limpieza", "Proveedor", "Direccion"]
if (userRoles.Any(role => rolesNoPermitidos.Contains(role)))
    throw new BusinessException("Tu rol no tiene permitido solicitar permisos.", "ROLE_NOT_ALLOWED", 403);
```

**Mensaje de Error:** "Tu rol no tiene permitido solicitar permisos."

---

### [RN-LEAVE-002] No solapamiento de solicitudes de permiso

**Ubicación:** `LeaveRequestService.cs:l82`

**Descripción:** No puede haber dos solicitudes de permiso activas con fechas superpuestas para el mismo empleado.

**Tipo:** Integridad

**Condición:**

```csharp
lr.Status != Rejected && lr.Status != Cancelled &&
(lr.StartDate <= DTO.EndDate && lr.EndDate >= DTO.StartDate)
```

**Acción:** Retorna error 409.

**Mensaje de Error:** "Ya existe una solicitud en el mismo período."

---

### [RN-LEAVE-003] Solo permisos pendientes son editables

**Ubicación:** `LeaveRequestService.cs:l188`

**Descripción:** Solo las solicitudes en estado Pending pueden modificarse.

**Tipo:** Workflow

**Condición:**

```csharp
if (request.Status != ERequestStatus.Pending)
    throw new BusinessException("Solo se pueden editar solicitudes en estado 'Pendiente'. Las solicitudes aprobadas o rechazadas no se pueden modificar.", "REQUEST_NOT_PENDING", 403);
```

**Mensaje de Error:** "Solo se pueden editar solicitudes en estado 'Pendiente'. Las solicitudes aprobadas o rechazadas no se pueden modificar."

---

### [RN-LEAVE-004] Solo permisos pendientes son eliminables

**Ubicación:** `LeaveRequestService.cs:l243`

**Descripción:** Solo las solicitudes en estado Pending pueden eliminarse.

**Tipo:** Workflow

**Condición:**

```csharp
if (request.Status != ERequestStatus.Pending)
    throw new BusinessException("Solo se pueden eliminar solicitudes pendientes.", "REQUEST_NOT_PENDING", 403);
```

**Mensaje de Error:** "Solo se pueden eliminar solicitudes pendientes."

---

### [RN-LEAVE-005] Gestión de archivos adjuntos

**Ubicación:** `LeaveRequestService.cs:l96`

**Descripción:** Los permisos pueden incluir archivos adjuntos que se gestionan automáticamente.

**Tipo:** Negocio

**Ciclo de Vida:**

- **Crear:** Guarda archivo al crear solicitud
- **Actualizar:** Elimina archivo anterior antes de guardar nuevo
- **Eliminar:** Elimina archivo asociado al borrar solicitud

---

### [RN-LEAVE-006] Notificaciones automáticas de permisos

**Ubicación:** `LeaveRequestService.cs:l108`

**Descripción:** El sistema envía notificaciones automáticas al crear, actualizar, aprobar, rechazar o eliminar permisos.

**Tipo:** Workflow

**Eventos que Disparan Notificación:**

- Crear solicitud
- Actualizar solicitud
- Aprobar solicitud
- Rechazar solicitud
- Eliminar solicitud

**Destinatarios:**

- Empleado solicitante
- Aprobadores correspondientes

---

### [RN-LEAVE-007] Validaciones de permiso

**Ubicación:** `LeaveRequestAddOrEditDTO.cs`

**Descripción:** Reglas de validación para solicitudes de permiso.

**Tipo:** Validación

**Campos Requeridos:**

- `[Required]` LeaveType
- `[Required]` StartDate
- `[Required]` EndDate

**Límites de Longitud:**

- `[MaxLength(500)]` Reason

---

## 11. LeaveRequestApproval {#11-leaverequestapproval}

### [RN-LEAVEAPP-001] Ámbito de aprobación por aprobador

**Ubicación:** `AprobacionPermisoService.cs:l33`

**Descripción:** Un aprobador solo ve solicitudes de empleados dentro de su ámbito definido por `IApprovalRuleService`.

**Tipo:** Autorización

**Condición:**

```csharp
var userIdsToApprove = await approvalRuleService.GetApprovableUserIdsAsync()
```

**Acción:** Filtra solicitudes por usuarios aprobables antes de aplicar filtros de UI.

---

### [RN-LEAVEAPP-002] No auto-aprobación de permisos

**Ubicación:** `AprobacionPermisoService.cs:l179`

**Descripción:** Un aprobador no puede aprobar sus propias solicitudes (excepto SuperUsuario).

**Tipo:** Autorización

**Condición:**

```csharp
if (request.Employee.UserId == userId && currentUser.UserRole != "SuperUsuario")
    throw new BusinessException("No puedes aprobar tus propias solicitudes.", "SELF_APPROVAL_NOT_ALLOWED", 403);
```

**Mensaje de Error:** "No puedes aprobar tus propias solicitudes."

**Excepciones:** SuperUsuario puede auto-aprobarse

---

### [RN-LEAVEAPP-003] Motivo de rechazo obligatorio

**Ubicación:** `AprobacionPermisoService.cs:l199`

**Descripción:** El rechazo de un permiso requiere un motivo obligatorio.

**Tipo:** Validación

**Condición:**

```csharp
if (string.IsNullOrWhiteSpace(DTO.RejectionReason))
    throw new BusinessException("El motivo del rechazo es obligatorio.", "REJECTION_REASON_REQUIRED", 400);
```

**Mensaje de Error:** "El motivo del rechazo es obligatorio."

---

### [RN-LEAVEAPP-004] Visibilidad por rol global

**Ubicación:** `AprobacionPermisoService.cs:l133`

**Descripción:** Roles globales ven todas las solicitudes de todos los clientes.

**Tipo:** Autorización

**Roles Globales:**

- SuperUsuario
- Direccion
- RecursosHumanos
- SupervisionOperativa

**Condición:**

```csharp
globalRoles = ["SuperUsuario", "Direccion", "RecursosHumanos", "SupervisionOperativa"]
if (userRoles.Any(r => globalRoles.Contains(r)))
    // No filtrar por CustomerId
```

---

## 12. PerformanceEvaluation {#12-performanceevaluation}

### [RN-PERFEVAL-001] Cálculo de puntaje final

**Ubicación:** `PerformanceEvaluationAppService.cs:l56`

**Descripción:** El puntaje final se calcula como el promedio de los puntajes de todas las respuestas.

**Tipo:** Cálculo

**Condición:**

```csharp
resultDTO.FinalScore = Math.Round((decimal)evaluation.Answers.Average(a => a.Score), 2)
```

**Formato de Salida:** "X de Y pts."

---

### [RN-PERFEVAL-002] Generación de comentarios por categoría

**Ubicación:** `PerformanceEvaluationAppService.cs:l99`

**Descripción:** El sistema genera comentarios automáticos basados en el puntaje promedio de cada categoría.

**Tipo:** Negocio

**Reglas de Generación:**

| Puntaje     | Comentario                                      |
| ----------- | ----------------------------------------------- |
| ≤ 1         | "Muy crítico. Requiere atención urgente."       |
| > 1 y ≤ 3   | "Requiere atención y capacitación."             |
| > 3 y < 4.5 | "Satisfactorio. Buen desempeño."                |
| ≥ 4.5 y < 5 | "Muy buen desempeño. Destacable."               |
| = 5         | "Excelente resultado. Supera las expectativas." |

---

### [RN-PERFEVAL-003] Severidad visual por puntaje

**Ubicación:** `PerformanceEvaluationAppService.cs:l125`

**Descripción:** Asigna severidad visual (colores) a los comentarios según el puntaje.

**Tipo:** Negocio

**Mapeo de Colores:**

| Puntaje     | Severidad | Color    |
| ----------- | --------- | -------- |
| ≤ 1         | error     | Rojo     |
| > 1 y ≤ 3   | warn      | Amarillo |
| > 3 y < 4.5 | info      | Azul     |
| ≥ 4.5       | success   | Verde    |

---

### [RN-PERFEVAL-004] Evaluador se asigna automáticamente

**Ubicación:** `PerformanceEvaluationAppService.cs:l175`

**Descripción:** Al actualizar una evaluación, el evaluador se establece como el usuario actual.

**Tipo:** Workflow

**Condición:**

```csharp
evaluation.EvaluatorId = currentUser.UserId
```

---

### [RN-PERFEVAL-005] Validaciones de evaluación

**Ubicación:** `CreatePerformanceEvaluationDTO.cs`

**Descripción:** Reglas de validación para evaluaciones de desempeño.

**Tipo:** Validación

**Campos Requeridos:**

- `[Required]` EvaluatorId
- `[Required]` EvaluatedId
- `[Required]` EvaluationTemplateId
- `[Required]` EvaluationDate

---

## 13. RecursosHumanos {#13-recursoshumanos}

### [RN-RRHH-001] Tabla de días por antigüedad (LFT México) ⚖️

**Ubicación:** `VacationCalculator.cs:l67`

**Descripción:** **BASE LEGAL LFT:** Los días de vacaciones están definidos por la Ley Federal del Trabajo de México según años de antigüedad.

**Tipo:** Cálculo | Base Legal

**Tabla LFT:**

| Años de Antigüedad | Días de Vacaciones |
| ------------------ | ------------------ |
| 1 año              | 12 días            |
| 2 años             | 14 días            |
| 3 años             | 16 días            |
| 4 años             | 18 días            |
| 5 años             | 20 días            |
| 6-10 años          | 22 días            |
| 11-15 años         | 24 días            |
| 16-20 años         | 26 días            |
| 21-25 años         | 28 días            |
| 26-30 años         | 30 días            |
| Más de 30 años     | 32 días            |
| Menos de 1 año     | 0 días             |

**Base Legal:** Ley Federal del Trabajo de México, Artículo 76.

---

### [RN-RRHH-002] Periodo de aniversario como unidad base

**Ubicación:** `VacationHelperService.cs:l37`

**Descripción:** El balance de vacaciones se organiza por periodos de aniversario (no año calendario).

**Tipo:** Negocio

**Definición:**

```
Periodo N = [fecha aniversario año N, fecha aniversario año N+1 - 1 día]
```

**Ejemplo:**

```
Empleado ingresado el 17-Feb-2023:
- Periodo 2025: del 17/02/2025 al 16/02/2026
- Periodo 2026: del 17/02/2026 al 16/02/2027
```

**Clave del Balance:** Año de inicio del periodo

---

### [RN-RRHH-003] Mínimo 6 meses para solicitar vacaciones ⚖️

**Ubicación:** `VacationHelperService.cs:l321`

**Descripción:** **BASE LEGAL LFT:** Un empleado no puede solicitar vacaciones si tiene menos de 6 meses de servicio.

**Tipo:** Validación | Base Legal

**Condición:**

```csharp
if (monthsOfService < 6)
{
    throw new BusinessException("No se pueden registrar vacaciones. El empleado debe tener al menos 6 meses de antigüedad.", "INSUFFICIENT_SENIORITY", 403);
}
```

**Mensaje de Error:** "No se pueden registrar vacaciones. El empleado debe tener al menos 6 meses de antigüedad."

**Base Legal:** LFT Artículo 76 - Derecho a vacaciones después del primer año, con adelanto a partir de 6 meses.

---

### [RN-RRHH-004] No solapamiento de solicitudes de vacaciones

**Ubicación:** `SolicitudVacacionesService.cs`

**Descripción:** No puede haber dos solicitudes de vacaciones con fechas superpuestas para el mismo empleado.

**Tipo:** Integridad

**Condición:**

```csharp
Solicitudes que NO estén en estado Rejected o Cancelled
```

**Acción:** Retorna error 409 `OVERLAPPING_REQUEST`.

**Mensaje de Error:** "Ya existe una solicitud en el mismo período."

---

### [RN-RRHH-005] Días hábiles excluyen domingos y festivos MX ⚖️

**Ubicación:** `VacationCalculator.cs:l26`

**Descripción:** **BASE LEGAL LFT:** El cálculo de días de vacaciones excluye domingos y días festivos oficiales mexicanos.

**Tipo:** Cálculo | Base Legal

**Condición:**

```csharp
for (var fecha = startDate; fecha <= endDate; fecha = fecha.AddDays(1))
{
    // Se excluye el día si es domingo o si coincide con un festivo oficial.
    if (fecha.DayOfWeek == DayOfWeek.Sunday || holidays.Contains(fecha))
    {
        continue;
    }
    diasSolicitados++;
}
```

**Regla:** Los sábados SÍ cuentan como días hábiles.

**Base Legal:** LFT - Días de descanso obligatorio.

---

### [RN-RRHH-006] Adelanto de vacaciones (6-11 meses) ⚖️

**Ubicación:** `VacationHelperService.cs:l237`

**Descripción:** **BASE LEGAL:** Empleados con 6-11 meses pueden solicitar hasta la mitad de los días del primer año como adelanto.

**Tipo:** Cálculo | Base Legal

**Condición:**

```csharp
if (actualMonthsOfService >= 6 && actualMonthsOfService < 12)
{
    isAdvancePeriod = true;
    var totalDaysForFirstYear = VacationCalculator.CalculateVacationDays(1); // 12 días
    allowedAdvanceDays = totalDaysForFirstYear / 2;  // 6 días
}
```

**Cálculo:** Máximo de días adelantables = `CalculateVacationDays(1) / 2 = 6 días`

**Base Legal:** LFT Reforma 2022 - Vacaciones dignas.

---

### [RN-RRHH-007] Herencia de adelantos al cumplir primer año

**Ubicación:** `VacationHelperService.cs:l156`

**Descripción:** Al cumplir el primer año, los días gozados por adelanto se descuentan de la nueva bolsa de 12 días.

**Tipo:** Cálculo

**Condición:**

```csharp
if (baseBalance.SeniorityYears == 1)
{
    // Busca solicitudes del periodo anterior (año 0)
    // Las suma al UsedDays del año 1
}
```

**Ejemplo:**

```
Empleado tomó 5 días de adelanto en año 0:
- Al cumplir año 1: Tiene 12 días - 5 días = 7 días disponibles
```

---

### [RN-RRHH-008] Vacaciones no acumulables entre periodos

**Ubicación:** `VacationHelperService.cs`

**Descripción:** Los días no tomados en un periodo de aniversario no se acumulan al siguiente.

**Tipo:** Negocio

**Regla:** El balance se calcula solo con solicitudes dentro del rango del periodo.

**Base Legal:** LFT - Periodo vacacional anual.

---

### [RN-RRHH-009] Registro administrativo de vacaciones pasadas

**Ubicación:** `VacationHelperService.cs:l293`

**Descripción:** Los administradores pueden registrar vacaciones pasadas directamente como aprobadas.

**Tipo:** Workflow

**Condición:**

```csharp
vacationRequest.Status = ERequestStatus.Approved
```

**Acción:** Crea solicitud aprobada sin flujo de aprobación, con nota de registro administrativo.

---

### [RN-RRHH-010] Balance calculado en tiempo real (sin persistencia)

**Ubicación:** `VacationHelperService.cs:l100`

**Descripción:** Los campos UsedDays y PendingDays no se persisten, se calculan dinámicamente en cada consulta.

**Tipo:** Negocio

**Fórmula:**

```
AvailableDays = TotalDays - UsedDays(Approved) - PendingDays(Pending)
```

**Acción:** Cancelaciones y rechazos devuelven días automáticamente.

---

### [RN-RRHH-011] Cancelación solo aplica a solicitudes aprobadas

**Ubicación:** `AprobacionVacacionesService.cs:l337`

**Descripción:** Solo se pueden cancelar solicitudes en estado Approved. Las Pending deben eliminarse.

**Tipo:** Workflow

**Condición:**

```csharp
if (vacationRequest.Status != ERequestStatus.Approved)
    throw new BusinessException("Solo se pueden cancelar solicitudes que ya han sido aprobadas.", "REQUEST_NOT_APPROVED", 403);
```

**Mensaje de Error:** "Solo se pueden cancelar solicitudes que ya han sido aprobadas."

---

### [RN-RRHH-012] Recordatorio de vencimiento: ventana de 2 meses

**Ubicación:** `NotifyExpiringVacationsJob.cs`

**Descripción:** El sistema alerta al empleado cuando su aniversario está dentro de los próximos 2 meses y tiene saldo disponible.

**Tipo:** Negocio

**Condición:**

```csharp
aniversario dentro de 2 meses && saldo > 0
```

---

### [RN-RRHH-013] Recordatorio semanal máximo por empleado

**Ubicación:** `NotifyExpiringVacationsJob.cs`

**Descripción:** Máximo 1 notificación de recordatorio por empleado por semana.

**Tipo:** Negocio

**Condición:**

```csharp
Controlado por VacationBalance.LastReminderSentAt
if (fue hace menos de 7 días)
    omite envío
```

---

### [RN-RRHH-014] Restricción de fechas previas al ingreso

**Ubicación:** `vacaciones-form.ts`

**Descripción:** Un empleado no puede solicitar vacaciones con fechas anteriores a su fecha de ingreso.

**Tipo:** Validación

**Condición:**

```csharp
fechaSolicitud < employeeAdmissionDate
```

**Acción:** Formulario bloqueado en UI.

---

### [RN-RRHH-015] Límite estricto de Saldo de Adelantos

**Ubicación:** `vacaciones-form.ts`

**Descripción:** Empleados en periodo de adelanto no pueden solicitar más días de los permitidos como adelanto.

**Tipo:** Validación

**Condición:**

```csharp
diasSolicitados > AvailableAdvanceDays
```

**Acción:** Formulario bloqueado en UI.

---

### [RN-RRHH-016] Límite estricto de Saldo Disponible

**Ubicación:** `vacaciones-form.ts`

**Descripción:** Empleados no pueden solicitar más días de los disponibles en su saldo (Total - Usados - Pendientes).

**Tipo:** Validación

**Condición:**

```csharp
diasSolicitados > AvailableDays
```

**Acción:** Formulario bloqueado en UI.

---

### [RN-RRHH-017] No auto-aprobación de vacaciones

**Ubicación:** `AprobacionVacacionesService.cs:l164`

**Descripción:** Un aprobador no puede aprobar sus propias solicitudes de vacaciones (excepto SuperUsuario).

**Tipo:** Autorización

**Condición:**

```csharp
if (vacationRequest.Employee.UserId == approverId && currentUser.UserRole != "SuperUsuario")
    throw new BusinessException("No puedes aprobar o rechazar tus propias solicitudes.", "SELF_APPROVAL_NOT_ALLOWED", 403);
```

**Mensaje de Error:** "No puedes aprobar o rechazar tus propias solicitudes."

**Excepciones:** SuperUsuario puede auto-aprobarse

---

### [RN-RRHH-018] Motivo de rechazo obligatorio para vacaciones

**Ubicación:** `AprobacionVacacionesService.cs:l193`

**Descripción:** El rechazo de vacaciones requiere motivo obligatorio.

**Tipo:** Validación

**Condición:**

```csharp
if (string.IsNullOrWhiteSpace(DTO.RejectionReason))
    throw new BusinessException("El motivo del rechazo es obligatorio.", "REJECTION_REASON_REQUIRED", 400);
```

**Mensaje de Error:** "El motivo del rechazo es obligatorio."

---

### [RN-RRHH-019] Validaciones de solicitud de vacaciones

**Ubicación:** `VacationRequestAddOrEditDTO.cs`

**Descripción:** Reglas de validación para solicitudes de vacaciones.

**Tipo:** Validación

**Campos Requeridos:**

- `[Required]` EmployeeId
- `[Required]` StartDate
- `[Required]` EndDate

**Límites de Longitud:**

- `[MaxLength(500)]` Reason

---

## 14. SanctionType {#14-sanctiontype}

### [RN-SANCTYPE-001] Tipos de sanción por cliente

**Ubicación:** `SanctionTypeAppService.cs`

**Descripción:** Los tipos de sanción son específicos por cliente.

**Tipo:** Integridad

**Condición:**

```csharp
x.CustomerId == customerId
```

**Acción:** Cada cliente gestiona sus propios tipos de sanción.

---

### [RN-SANCTYPE-002] Activación/Desactivación de tipos de sanción

**Ubicación:** `SanctionTypeAppService.cs:l143`

**Descripción:** Los tipos de sanción pueden activarse o desactivarse.

**Tipo:** Workflow

**Condición:**

```csharp
entity.IsActive = !entity.IsActive
```

---

### [RN-SANCTYPE-003] Sanciones que causan terminación

**Ubicación:** `SanctionType.cs`

**Descripción:** Algunos tipos de sanción están marcados como causantes de terminación de contrato.

**Tipo:** Negocio

**Condición:**

```csharp
IsTermination = true
```

**Acción:** Indica que la sanción puede resultar en despido.

---

## 15. VacationBalanceAdmin {#15-vacationbalanceadmin}

### [RN-VACBAL-001] Vista administrativa de balances

**Ubicación:** `VacationBalanceAdminService.cs:l17`

**Descripción:** El módulo administrativo muestra balances en tiempo real de todos los empleados.

**Tipo:** Negocio

**Condición:**

```csharp
var realTimeBalance = await vacationService.GetBalanceRealTimeAsync(employee.UserId)
```

**Información Mostrada:**

- Días por ley
- Días tomados
- Días pendientes
- Saldo actual

---

### [RN-VACBAL-002] Cálculo de elegibilidad para adelanto

**Ubicación:** `VacationBalanceAdminService.cs:l41`

**Descripción:** El sistema calcula si un empleado es elegible para adelanto de vacaciones.

**Tipo:** Cálculo

**Condición:**

```csharp
if (dto.SeniorityYears < 1 && monthsOfService >= 6)
{
    dto.IsEligibleForAdvance = true;
    dto.AllowedAdvanceDays = totalDaysForFirstYear / 2; // 6 días
}
```

---

## 16. VacationRequestApproval {#16-vacationrequestapproval}

**Nota:** Las reglas de este submódulo están documentadas en RecursosHumanos ya que comparten la misma lógica de aprobación.

**Reglas Aplicables:**

- [RN-RRHH-017] - No auto-aprobación
- [RN-RRHH-018] - Motivo de rechazo obligatorio
- [RN-RRHH-011] - Cancelación solo de aprobadas

---

## 📜 Reglas con Base Legal (LFT México)

| ID Regla      | Descripción                             | Base Legal                           |
| ------------- | --------------------------------------- | ------------------------------------ |
| [RN-RRHH-001] | Tabla de días por antigüedad            | LFT Artículo 76                      |
| [RN-RRHH-003] | Mínimo 6 meses para solicitar           | LFT Artículo 76                      |
| [RN-RRHH-005] | Días hábiles excluyen domingos/festivos | LFT - Días de descanso               |
| [RN-RRHH-006] | Adelanto de vacaciones (6-11 meses)     | LFT Reforma 2022 - Vacaciones dignas |
| [RN-INC-001]  | Derecho a audiencia (1 día hábil)       | LFT - Derecho a audiencia previa     |
| [RN-RRHH-007] | Herencia de adelantos                   | LFT - Cómputo de periodo vacacional  |
| [RN-RRHH-008] | No acumulabilidad                       | LFT - Periodo vacacional anual       |

---

## 📂 Archivos Clave Analizados

| Submódulo               | Servicios                          | DTOs                                | Interfaces                          |
| ----------------------- | ---------------------------------- | ----------------------------------- | ----------------------------------- |
| ContractAddendum        | ContractAddendumAppService.cs      | ContractAddendumAddOrEditDTO.cs     | IContractAddendumAppService.cs      |
| ContractTemplate        | ContractTemplateAppService.cs      | ContractTemplateAddOrEditDTO.cs     | IContractTemplateAppService.cs      |
| ContractWork            | WorkContractAppService.cs          | WorkContractAddOrEditDTO.cs         | IWorkContractAppService.cs          |
| EvaluationTemplate      | TemplateEvaluationAppService.cs    | SaveEvaluationTemplateRequestDTO.cs | ITemplateEvaluationAppService.cs    |
| HRIncident              | IncidentAppService.cs              | IncidentAddOrEditDTO.cs             | IIncidentAppService.cs              |
| HRIncidentReport        | IncidentReportAppService.cs        | IncidentReportFilterDTO.cs          | IIncidentReportAppService.cs        |
| HrSanction              | SanctionAppService.cs              | SanctionAddOrEditDTO.cs             | ISanctionAppService.cs              |
| IncidentType            | IncidentTypeAppService.cs          | IncidentTypeFormDTO.cs              | IIncidentTypeAppService.cs          |
| LeaveRequest            | LeaveRequestService.cs             | LeaveRequestAddOrEditDTO.cs         | ILeaveRequestService.cs             |
| LeaveRequestApproval    | AprobacionPermisoService.cs        | LeaveRequestApproveDTO.cs           | IAprobacionPermisoService.cs        |
| PerformanceEvaluation   | PerformanceEvaluationAppService.cs | CreatePerformanceEvaluationDTO.cs   | IPerformanceEvaluationAppService.cs |
| RecursosHumanos         | VacationHelperService.cs           | VacationRequestAddOrEditDTO.cs      | IVacationHelperService.cs           |
| SanctionType            | SanctionTypeAppService.cs          | SanctionTypeFormDTO.cs              | ISanctionTypeAppService.cs          |
| VacationBalanceAdmin    | VacationBalanceAdminService.cs     | VacationBalanceAdminViewDTO.cs      | IVacationBalanceAdminService.cs     |
| VacationRequestApproval | AprobacionVacacionesService.cs     | VacationApproveDTO.cs               | IAprobacionVacacionesService.cs     |

---

## 🛠️ Utilidades Identificadas

| Archivo                     | Propósito                                                   |
| --------------------------- | ----------------------------------------------------------- |
| `VacationCalculator.cs`     | Cálculo de días de vacaciones, días hábiles, antigüedad     |
| `VacationHelperService.cs`  | Balance en tiempo real, registro administrativo, aprobación |
| `VacationEmailGenerator.cs` | Generación de emails para notificaciones de vacaciones      |

---

## 📊 Resumen Estadístico

| Métrica                    | Cantidad      |
| -------------------------- | ------------- |
| **Total de Reglas**        | 78 reglas     |
| **Reglas con Base Legal**  | 7 reglas      |
| **Submódulos**             | 16 submódulos |
| **Reglas de Validación**   | 25 reglas     |
| **Reglas de Workflow**     | 28 reglas     |
| **Reglas de Integridad**   | 12 reglas     |
| **Reglas de Autorización** | 8 reglas      |
| **Reglas de Negocio**      | 15 reglas     |
| **Reglas de Cálculo**      | 5 reglas      |

---

**Documento generado:** 2026-03-31
**Ruta Analizada:** `D:\repos\luxuryapp-api\api\LuxuryApp.Application\Features\HR\`
**Total de Páginas Estimadas:** 50+
