# Módulo de Incidencias de Recursos Humanos (HRIncident)

**Última actualización:** 2026-03-31  
**Estado:** ✅ Completado y funcional — Listo para producción  
**Cumplimiento:** 100% code-style-guide

---

## 📋 Descripción General

Módulo para la gestión de incidencias disciplinarias de empleados, incluyendo:
- Registro de actas administrativas (comportamiento, faltas injustificadas, sanciones)
- Seguimiento y investigación de incidentes
- Gestión de testigos y evidencias (adjuntos)
- Resolución con o sin sanción
- Exportación de actas en PDF
- Dashboard de análisis

---

## 🏗️ Arquitectura del Módulo

### Backend (.NET 10)

```
Features/HRIncidencias/HRIncident/
├── Controller/
│   └── IncidentController.cs          # 18 endpoints API
├── DTOs/
│   ├── IncidentListDTO.cs             # Listado (enums como string)
│   ├── IncidentDetailDTO.cs           # Detalle/edición (enums como int)
│   ├── IncidentResolveDTO.cs          # Resolución
│   ├── IncidentAddOrEditDTO.cs        # Crear/Editar
│   ├── IncidentCancelDTO.cs           # Cancelar
│   ├── IncidentAttachment*.cs         # DTOs de adjuntos (3 archivos)
│   ├── IncidentWitness*.cs            # DTOs de testigos (3 archivos)
│   └── IncidentDashboard*.cs          # DTOs de dashboard (5 archivos)
├── Interfaces/
│   ├── IIncidentAppService.cs
│   ├── IIncidentAttachmentAppService.cs
│   └── IIncidentWitnessAppService.cs
├── Mapping/
│   └── IncidentMappingProfile.cs
└── Services/
    ├── IncidentAppService.cs
    ├── IncidentAttachmentAppService.cs
    └── IncidentWitnessAppService.cs
```

### Frontend (Angular 22)

```
client/angular/src/app/features/employees/incident/
├── models/
│   └── incident.interfaces.ts         # Todos los DTOs del módulo
├── pages/
│   ├── incident-list.ts               # Listado con tabla del catálogo @ui/web/table
│   ├── incident-list.html
│   ├── incident-form.ts               # Formulario crear/editar
│   ├── incident-form.html
│   ├── incident-resolve.ts            # Resolver incidencia
│   ├── incident-resolve.html
│   └── incident-dashboard/
│       ├── incident-dashboard.ts      # Dashboard con gráficos
│       └── incident-dashboard.html
└── components/
    ├── incident-attachments/          # Gestión de adjuntos
    ├── incident-witnesses/            # Gestión de testigos
    └── digital-signature/             # Captura de firma digital
```

---

## 📊 Estructura de Datos

### Entidad Principal: `Incident`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Id` | Guid | Identificador único |
| `EmployeeId` | Guid | Empleado involucrado |
| `IncidentTypeId` | Guid | Tipo de incidencia |
| `WorkContractId` | Guid? | Contrato relacionado |
| `Description` | string | Descripción detallada (10-2000 chars) |
| `IncidentDateTime` | DateTime | Fecha y hora del incidente |
| `SeverityLevel` | ESeverityLevel | Nivel de severidad (enum: 0-3) |
| `InvestigationStatus` | EInvestigationStatus | Estatus de investigación (enum: 0-4) |
| `Witnesses` | string | Testigos (texto plano) |
| `EvidencePaths` | string | Rutas de evidencia |
| `InvestigationNotes` | string | Notas de investigación |
| `SanctionApplied` | bool | ¿Se aplicó sanción? |
| `DecisionRationale` | string | Justificación de decisión |
| `ResolutionDate` | DateTime? | Fecha de resolución |
| `ReportedByUserId` | string | Usuario que reportó |
| `IsCancelled` | bool | ¿Está cancelada? |
| `CancelledAt` | DateTime? | Fecha de cancelación |
| `CancelledByUserId` | string | Usuario que canceló |
| `CancellationReason` | string | Motivo de cancelación |

### Entidades Relacionadas

#### `IncidentAttachment` (Adjuntos/Evidencias)
- Almacena rutas de archivos (imágenes, PDF)
- Límite: 2MB por archivo, máx 10 archivos por incidencia
- Formatos permitidos: JPG, PNG, PDF

#### `IncidentWitness` (Testigos)
- Nombre completo, puesto, relación
- Teléfono, email, declaración
- Firma digital (capturada en canvas, guardada como PNG)

---

## 🔢 Enums Utilizados

### `ESeverityLevel` (Nivel de Severidad)

| Valor | Label (Español) |
|-------|-----------------|
| `0` | Leve |
| `1` | Moderado |
| `2` | Grave |
| `3` | Muy Grave |

### `EInvestigationStatus` (Estatus de Investigación)

| Valor | Label (Español) |
|-------|-----------------|
| `0` | Reportado |
| `1` | En Investigación |
| `2` | Resuelto sin Sanción |
| `3` | Resuelto con Sanción |
| `4` | Archivado |

### `EIncidentCategory` (Categoría)

| Valor | Label (Español) |
|-------|-----------------|
| `0` | Conducta |
| `1` | Desempeño |
| `2` | Seguridad |
| `3` | Asistencia |
| `4` | Ética |

### `EAttachmentType` (Tipo de Adjunto)

| Valor | Label (Español) |
|-------|-----------------|
| `0` | Imagen |
| `1` | Documento |

---

## 🔌 Endpoints de API (18 total)

### CRUD Principal
| Método | Endpoint | Policy | Descripción |
|--------|----------|--------|-------------|
| `GET` | `/api/hr/incidents` | Auth | Listar todas |
| `GET` | `/api/hr/incidents/by-employee/{employeeId}` | Auth | Por empleado |
| `GET` | `/api/hr/incidents/{id}` | Auth | Detalle (edición) |
| `POST` | `/api/hr/incidents` | CanCreateIncidents | Crear |
| `PUT` | `/api/hr/incidents/{id}` | CanCreateIncidents | Actualizar |
| `PATCH` | `/api/hr/incidents/{id}/resolve` | CanCreateIncidents | Resolver |
| `PATCH` | `/api/hr/incidents/{id}/cancel` | CanCreateIncidents | Cancelar |
| `DELETE` | `/api/hr/incidents/{id}` | SoloSuperUsuario | Eliminar físico |

### Adjuntos
| Método | Endpoint | Policy | Descripción |
|--------|----------|--------|-------------|
| `GET` | `/api/hr/incidents/{incidentId}/attachments` | Auth | Listar adjuntos |
| `POST` | `/api/hr/incidents/{incidentId}/attachments` | CanCreateIncidents | Subir adjunto |
| `DELETE` | `/api/hr/incidents/attachments/{attachmentId}` | CanCreateIncidents | Eliminar adjunto |

### Testigos
| Método | Endpoint | Policy | Descripción |
|--------|----------|--------|-------------|
| `GET` | `/api/hr/incidents/{incidentId}/witnesses` | Auth | Listar testigos |
| `GET` | `/api/hr/incidents/witnesses/{witnessId}` | Auth | Detalle testigo |
| `POST` | `/api/hr/incidents/{incidentId}/witnesses` | CanCreateIncidents | Agregar testigo |
| `PUT` | `/api/hr/incidents/witnesses/{witnessId}` | CanCreateIncidents | Actualizar testigo |
| `DELETE` | `/api/hr/incidents/witnesses/{witnessId}` | CanCreateIncidents | Eliminar testigo |

### Reportes
| Método | Endpoint | Policy | Descripción |
|--------|----------|--------|-------------|
| `GET` | `/api/hr/incidents/{id}/export-pdf` | CanCreateIncidents | Exportar acta PDF |
| `GET` | `/api/hr/incidents/dashboard` | Auth | Dashboard métricas |

---

## 🎨 Frontend — Componentes Principales

### `IncidentFormComponent`
- Formulario reactivo con validación
- Selects cargados desde backend (`EnumSelectService`)
- Soporte para modo creación y edición
- Secciones de adjuntos y testigos (después de crear)

### `IncidentListComponent`
- Tabla del catálogo `@ui/web/table` con paginación
- Filtros y búsqueda global
- Acciones: Resolver, Editar, Cancelar, Exportar PDF, Eliminar
- Soporte para vista por empleado (`[employeeId]` input)

### `IncidentResolveComponent`
- Diálogo para resolver incidencia
- Carga estatus desde API (`EnumSelectService`)
- Valida que haya pasado 1 día hábil desde creación

### `IncidentDashboardComponent`
- KPIs: Total, resueltas, pendientes, sancionadas
- Gráficos: Barras (por mes), Pastel (por tipo)
- Filtros por rango de fechas

### `IncidentAttachmentsComponent`
- Subida de archivos con compresión de imágenes (≤2MB)
- Validación de tipo y tamaño
- Lista de archivos con descarga y eliminación

### `IncidentWitnessesComponent`
- CRUD de testigos en diálogo
- Integración con `DigitalSignatureComponent`
- Firma digital capturada en canvas

---

## 🔐 Policies de Autorización

### `CanCreateIncidents`
Roles autorizados:
- `SuperUsuario`
- `Direccion`
- `SupervisionOperativa`
- `Administrador`
- `GerenteOperaciones`
- `GerenteAtencion`

### `SoloSuperUsuario`
- Solo `SuperUsuario` puede eliminar físicamente incidencias

---

## 🔄 Flujo de Trabajo

### 1. Reporte de Incidencia
```
Usuario autorizado → IncidentForm (crear) → POST /api/hr/incidents
  ↓
  - employeeId
  - incidentTypeId
  - description
  - incidentDateTime
  - severityLevel (int: 0-3)
  - sanctionTypeId (opcional)
```

### 2. Agregar Adjuntos y Testigos
```
Usuario autorizado → IncidentForm (después de crear)
  ↓
  - Subir archivos (máx 2MB, JPG/PNG/PDF)
  - Agregar testigos con firma digital
```

### 3. Investigación
```
HR → IncidentForm (editar) → PUT /api/hr/incidents/{id}
  ↓
  - Actualiza datos de investigación
  - Agrega investigationNotes
  - Define si aplica sanción
```

### 4. Resolución
```
HR → PATCH /api/hr/incidents/{id}/resolve
  ↓
  - investigationStatus: "ResueltoConSancion" o "ResueltoSinSancion"
  - investigationNotes
  - sanctionApplied: true/false
  - decisionRationale
  - ✅ Valida 1 día hábil desde creación (derecho a audiencia)
```

### 5. Exportar Acta (PDF)
```
Usuario autorizado → GET /api/hr/incidents/{id}/export-pdf
  ↓
  - Genera PDF con QuestPDF
  - Incluye: empleado, hechos, testigos, adjuntos, firmas
```

---

## ⚠️ Consideraciones Importantes

### 1. Soft-Cancel (Cancelación de Negocio)
- Las incidencias **NO** se eliminan físicamente (excepto SuperUsuario)
- Se marcan como `IsCancelled = true`
- Requiere motivo de cancelación
- No se pueden editar o resolver incidencias canceladas

### 2. Validaciones
- `description`: Requerido, 10-2000 caracteres
- `incidentDateTime`: Requerido
- `severityLevel`: Requerido (int: 0-3)
- `witnesses`: Opcional, máximo 500 caracteres
- Adjuntos: Máximo 2MB, formatos JPG/PNG/PDF, máx 10 por incidencia

### 3. Derecho a Audiencia
- El empleado tiene **1 día hábil** para presentar justificación
- El sistema valida que haya pasado 1 día antes de permitir resolver
- Puede resultar en anulación del acta si los argumentos son procedentes

### 4. Notificaciones de Sanciones
- Email al empleado sancionado
- Push notification (OneSignal)
- SignalR (tiempo real)
- Notificación automática al aplicar sanción

---

## 🧪 Pruebas Recomendadas

### Backend
```bash
# 1. Crear incidencia
POST /api/hr/incidents
{
  "employeeId": "guid",
  "incidentTypeId": "guid",
  "description": "Descripción de prueba",
  "incidentDateTime": "2026-03-31T10:00:00Z",
  "severityLevel": 1,  # Moderado
  "witnesses": "Testigo 1, Testigo 2"
}

# 2. Resolver incidencia (después de 1 día)
PATCH /api/hr/incidents/{id}/resolve
{
  "investigationStatus": 3,  # ResueltoConSancion
  "investigationNotes": "Notas de investigación",
  "sanctionApplied": true,
  "decisionRationale": "Justificación"
}

# 3. Exportar PDF
GET /api/hr/incidents/{id}/export-pdf
```

### Frontend
```typescript
// 1. Verificar carga de selects desde API
expect(component.cb_severity().length).toBeGreaterThan(0);

// 2. Verificar valor numérico en form
expect(component.form.controls.severityLevel.value).toBe(0);

// 3. Verificar submit con FormHelper
component.onSubmit();
expect(FormHelper.submitCrud).toHaveBeenCalledWith(...);
```

---

## 📚 Referencias

- **code-style-guide.md**: Estándares técnicos obligatorios
- **DOC-04-CUSTOM-INPUTS-CATALOG.md**: Custom inputs disponibles
- **DOC-05-SECURITY-POLICIES.md**: Policies de seguridad
- **IncidentType**: `Features/Settings/IncidentType/`
- **SanctionType**: `Features/Settings/SanctionType/`
- **EnumSelectService**: `client/angular/src/app/core/services/enum-select.service.ts`

---

## 📝 Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| 2026-03-31 | Corrección errores de compilación (imports, signals, DTOs) |
| 2026-03-31 | Auditoría completa y corrección de estándares |
| 2026-03-30 | Implementación inicial completada |

---

**Documento creado:** 2026-03-30  
**Última actualización:** 2026-03-31  
**Autor:** Refactorización del módulo HRIncident  
**Estado:** ✅ Listo para producción
