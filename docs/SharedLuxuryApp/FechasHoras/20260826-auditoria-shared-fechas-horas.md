# Auditoría transversal: Manejo de Fechas y Horas (Backend .NET 10 + Frontend Angular 22)

**Fecha:** 2026-08-26
**Alcance:** `api/LuxuryApp.Infrastructure.Data/Data/Entities/`, `api/LuxuryApp.Application/`, `client/angular/src/app/`
**Insumo base:** `inventario_fechas.md` (barrido mecánico de propiedades `DateTime`/`DateOnly`/`TimeOnly` y patrones de fecha), verificado y ampliado con lectura directa de código para los hallazgos críticos.

---

## Resumen ejecutivo

1. **`ApplicationDbContext.SaveChangesAsync` está correctamente implementado**: los campos `IAuditable.CreatedAt`/`UpdatedAt` y `ISoftDeletable.DeletedAt` se completan automáticamente con `DateTime.UtcNow` (`AplicarCamposAuditoria()`, línea 825). No requieren intervención manual y no deben tocarse desde los servicios.
2. **`DateTime.Now` (hora local del servidor) se usa en al menos 13 archivos de servicios/DTOs** en vez de `DateTime.UtcNow`. Esto es **crítico**: en producción, si el servidor no corre en UTC, genera desfases de horas en filtros, timestamps de mensajes y comparaciones de fecha límite (ej. `CandidateProcessAppService` compara `scheduledDateTime < DateTime.Now.AddMinutes(-30)`, mezclando una hora local con fechas que en otras partes del mismo servicio se tratan en UTC).
3. **La base de datos está correctamente tipada**: las migraciones recientes usan `datetime2` para `DateTime`, `date` para `DateOnly` y `time` para `TimeOnly` (no hay uso del `datetime` legado de SQL Server).
4. **.NET 10 serializa `DateOnly`/`TimeOnly` de forma nativa** (ISO `yyyy-MM-dd` / `HH:mm:ss`) vía `System.Text.Json`; no hay (ni se necesita) un `JsonConverter` custom para estos tipos. Sí existen convertidores custom para otros fines (`LenientStringConverter`, `NullableEmptyStringConverterFactory`) que afectan cómo llegan los `DateTime?` vacíos ("" → null).
5. **El frontend ya tiene un `DateService` centralizado** (`core/services/date.service.ts`, usado en 139 archivos) que implementa un workaround deliberado para el clásico bug de "fecha con un día de desfase" (`parseDatePreservingLocalDay`). Es una buena base, pero **coexiste sin gobierno con ~150+ usos directos de `new Date(...)`, `formatDate` de `@angular/common` y el pipe `| date` de Angular aplicados directamente sobre strings crudos del API** — es decir, la estandarización que el propio equipo empezó a construir no se aplica de forma consistente.
6. **Riesgo concreto de desfase de día confirmado**: cuando un campo `DateOnly` del backend (ej. `"2026-08-26"`, sin hora ni `Z`) se consume directamente con `{{ valor | date }}` (sin pasar por `DateService`), Angular's `DatePipe` internamente hace `new Date("2026-08-26")`, que el motor JS interpreta como **medianoche UTC**; al convertir a la zona horaria local (México = UTC-6) el resultado cae al día anterior. Este patrón de riesgo aparece en decenas de plantillas `.html` que usan `| date` directamente sobre campos que, por nombre, son `DateOnly` en el backend (fechas de vencimiento, fechas de solicitud, etc.).
7. **Inconsistencia de tipos entre entidades análogas**: hay pares de entidades con el mismo campo semántico (`RequestDate`, `UploadDate`, `FechaRegistro`, `DueDate`) tipado como `DateOnly` en una entidad y `DateTime` en otra. El caso más severo es la entidad legacy `Tasks` (coexiste con `TaskInstance`): **10 propiedades de fecha, todas `DateTime?`, ninguna `DateOnly`**, pese a que la mayoría (`PlannedStartDate`, `PlannedEndDate`, `ActualStartDate`, `ActualEndDate`, `RecurrenceEndDate`) son fechas calendario sin componente horario relevante.
8. **No hay interceptor HTTP ni "reviver" que convierta strings ISO a `Date` de forma centralizada** en el frontend (`ApiResponseService` no toca fechas). Los DTOs suelen tipar los campos de fecha como **unión `Date | string`**, lo que traslada la responsabilidad de convertir a cada componente consumidor — de ahí la proliferación de `new Date(...)` ad-hoc.

---

## 1. Inventario de Entidades (Backend)

Leyenda de la columna **Riesgo**:

- `✅ OK` — el tipo es coherente con la semántica del nombre.
- `🔒 AUTO` — campo `IAuditable`/`ISoftDeletable`, gestionado por `ApplicationDbContext.AplicarCamposAuditoria()` en UTC. No modificar manualmente.
- `⚠️ DT→DO` — se usa `DateTime` donde el nombre sugiere una fecha de calendario pura (sin hora relevante); candidato a `DateOnly`. Riesgo de desfase de día si se serializa/compara con criterios de zona horaria.
- `⚠️ NAME` — nombre de campo no estándar para un campo de auditoría (`CreateAt`, `UpdateAt`, `CreationDate`, `DateCreation`, `ActualizadoEn`, `CreateDate`) que no implementa `IAuditable`; candidato a renombrar/migrar al patrón estándar.
- `ℹ️ LEGACY` — campo espejo de sincronización con sistemas externos (Aspel). Tipo correcto, pero fuera del alcance de estandarización interna.

### 1.1 Sistema / Autenticación / Auditoría / IA

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| ApplicationUser | LastSeen | DateTime | No | ✅ OK |
| PasswordRecoveryCode | ExpiresAt | DateTime | No | ✅ OK |
| PasswordRecoveryCode | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| UserRefreshToken | ExpiryTime | DateTime | No | ✅ OK |
| UserRefreshToken | CreationDate | DateTime | No | ⚠️ NAME (no implementa `IAuditable`; verificar que se asigna con `UtcNow`) |
| DatabaseBackupConfig | LastRunAt | DateTime? | No | ✅ OK |
| DatabaseBackupConfig | CreatedAt / UpdatedAt | DateTime / DateTime? | **Sí** | 🔒 AUTO |
| DatabaseBackupHistory | StartedAt | DateTime | No | ✅ OK |
| DatabaseBackupHistory | CompletedAt | DateTime? | No | ✅ OK |
| AiChatMessage | Timestamp | DateTime | No | ✅ OK |
| AiChatSession | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| AuditEntry | ChangedAt | DateTime | No | ✅ OK (poblado en `AplicarCamposAuditoria` con `ahora=UtcNow`) |
| LegacyIdMap | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| MigrationVerificationLog | VerificationDate | DateTime | No | ⚠️ DT→DO |
| NotificationLog | SentAt | DateTime | No | ✅ OK |
| NotificationUser | CreatedAt | DateTime | **Sí** | 🔒 AUTO |

### 1.2 Cobranza / Cargos / Cuentas

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| AdjustmentRecord | AppliedAt | DateTime | No | ✅ OK |
| Charge | DueDate | DateOnly | No | ✅ OK |
| Charge | PeriodStart / PeriodEnd / DiscountDeadline | DateOnly? | No | ✅ OK |
| ChargePaymentAllocation | AppliedAt | DateTime | No | ✅ OK |
| ChargeTemplate | StartDate / EndDate / RetroactiveStartDate | DateOnly(?) | No | ✅ OK |
| CobranzaAuxiliar / CobranzaPoliza / ContabilidadAuxiliar / ContabilidadPoliza | FECHA_POL | DateOnly | No | ℹ️ LEGACY ✅ tipo correcto |
| Cobranza*/Contabilidad* (Auxiliar, Cuenta, FiscalPeriod, Poliza, Presupuesto, Saldo) | SyncedAt | DateTime? | No | ℹ️ LEGACY ✅ OK |
| CobranzaPayment | PaymentDate | DateOnly | No | ✅ OK |
| CobranzaPeriodClosure | ClosedAt | DateTime? | No | ✅ OK |
| CollectionActivity | ActivityDate | DateTime | No | ⚠️ DT→DO (misma entidad tiene `PromisedDate: DateOnly?` — inconsistencia interna) |
| CollectionActivity | PromisedDate | DateOnly? | No | ✅ OK |
| CollectionCase | LastContactAt | DateTime? | No | ✅ OK |
| CollectionCaseCharge | AddedAt | DateTime | No | ✅ OK |
| CreditNote | IssuedAt / CancelledAt | DateTime(?) | No | ✅ OK |
| Invoice | TimbreAt | DateTime? | No | ✅ OK |
| LateFeePolicy / MorosidadPolicy | StartDate / EndDate | DateOnly(?) | No | ✅ OK |
| CoiCobranzaPolicy | Date | DateOnly | No | ✅ OK |
| ContratoPoliza | StartDate / EndDate | DateOnly(?) | No | ✅ OK |
| PolicySnapshot / ResponsiblePartySnapshot | CapturedAt | DateTime | No | ✅ OK |
| FineEvidence | UploadedAt | DateTime | No | ✅ OK |
| PropertyFine | InfractionDate | DateOnly | No | ✅ OK |
| PropertyFine | IssuedAt | DateTime | No | ✅ OK |

### 1.3 Financiero / Presupuestos / Fondeos

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| BudgetProposal | CreatedDate | DateTime | No | ⚠️ DT→DO + ⚠️ NAME (no usa `IAuditable`, único caso del dominio financiero) |
| BudgetProposalItemHistory | ChangedAt | DateTime | No | ✅ OK |
| BudgetProposalItemSupportFile | UploadedAt | DateTime | No | ✅ OK |
| EstadoFinanciero | Period | DateOnly | No | ✅ OK |
| EstadoFinanciero | UploadDate / AuthorizationDate / SendDate | DateTime? | No | ⚠️ DT→DO (nombre "Date" pero tipo `DateTime`; confirmar si de verdad requieren hora) |
| FinancialApprovalRequest | RequestedAt / ReviewedAt / ExecutedAt | DateTime(?) | No | ✅ OK |
| FinancialAuditLog | OccurredAt | DateTime | No | ✅ OK |
| FinancialBatch | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| FinancialLedgerEntry | EffectiveDate | DateOnly | No | ✅ OK |
| FinancialLedgerEntry | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| Funding | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| Funding | VerifiedAt / AuthorizedAt / ConfirmedAt / CompletedAt | DateTime? | No | ✅ OK |

### 1.4 RRHH — Permisos y Vacaciones

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| LeaveRequest | StartDate / EndDate | DateOnly | No | ✅ OK |
| LeaveRequest | RequestDate / ApprovalDate | DateTime(?) | No | ⚠️ DT→DO (misma entidad mezcla `DateOnly` y `DateTime` para conceptos de fecha) |
| LeaveRequestHistory | ChangeDate | DateTime | No | ⚠️ DT→DO |
| VacationBalance | LastUpdated | DateTime | No | ✅ OK |
| VacationBalance | LastReminderSentAt | DateTime? | No | ✅ OK |
| VacationRequest | StartDate / EndDate | DateOnly | No | ✅ OK |
| VacationRequest | RequestDate / ApprovalDate | DateTime(?) | No | ⚠️ DT→DO (mismo patrón que `LeaveRequest`) |
| VacationRequest | VacationBonusPaymentDate | DateOnly? | No | ✅ OK |
| VacationRequestHistory | ChangeDate | DateTime | No | ⚠️ DT→DO |
| ManualBalanceChangeLog | Timestamp | DateTime | No | ✅ OK |

### 1.5 RRHH — Checador / Contratos

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| RegistroChecador | FechaHora | DateTime | No | ✅ OK (nombre indica fecha+hora) |
| RegistroChecador | CreadoEn | DateTime | No | ⚠️ NAME (debería ser `CreatedAt`/`IAuditable`) |
| AddendumTemplate / ContractTemplate | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| AddendumTemplate / ContractAddendum / ContractTemplate | DeletedAt | DateTime? | No (ISoftDeletable) | ✅ OK, gestionado también por `AplicarCamposAuditoria` |
| ContractAddendum | EffectiveDate / SignedDate | DateOnly(?) | No | ✅ OK |
| ContractAddendum | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| WorkContract | StartDate / EndDate / ProbationEndDate / TerminationDate | DateOnly(?) | No | ✅ OK — **buen ejemplo a replicar** |
| WorkContract | SignedAt | DateTime? | No | ✅ OK |
| WorkContract | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |

### 1.6 RRHH — Evaluaciones / Expediente

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| PerformanceEvaluation | EvaluationDate | DateOnly | No | ✅ OK |
| TemplateEvaluation / ChecklistOptionCatalog / DocumentCatalog | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| Employee | DateAdmission | DateOnly | No | ✅ OK |
| EmployeeDocument | SubmittedAt / ValidatedAt | DateTime? | No | ✅ OK |
| EmployeeOnboardingChecklist | CompletedAt | DateTime? | No | ✅ OK |
| EmployeeOnboardingChecklist | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| PersonData | Birth | DateOnly? | No | ✅ OK |

### 1.7 RRHH — Incidencias y Sanciones

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| Incident | IncidentDateTime | DateTime | No | ✅ OK |
| Incident | ResolutionDate | DateOnly? | No | ✅ OK |
| Incident | CancelledAt | DateTime? | No | ✅ OK |
| Incident / IncidentAttachment / IncidentType / IncidentWitness | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| Incident / IncidentAttachment / IncidentType / IncidentWitness | DeletedAt | DateTime? | No | ✅ OK |
| Sanction | AppliedDate / EffectiveStartDate / EffectiveEndDate / AppealDeadline / CompletedDate | DateOnly(?) | No | ✅ OK |
| Sanction / SanctionType | CreatedAt / UpdatedAt / DeletedAt | DateTime(?) | **Sí** (CreatedAt/UpdatedAt) | 🔒 AUTO |
| SuspensionDay | SuspensionDate | DateOnly | No | ✅ OK |
| SuspensionDay | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |

### 1.8 Nómina

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| ConfiguracionNomina | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| DiasNoHabiles | Fecha | DateOnly | No | ✅ OK |
| EvidenciaNomina | CreatedAt / UpdatedAt / DeletedAt | DateTime(?) | **Sí** (Created/Updated) | 🔒 AUTO |
| IncidenciaNomina | Fecha | DateOnly | No | ✅ OK |
| IncidenciaNomina | CreatedAt / UpdatedAt / DeletedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| NominaDetalle | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| NominaEncabezado | FechaAprobacion / FechaCierre | DateTime? | No | ⚠️ DT→DO |
| NominaEncabezado | CreatedAt / UpdatedAt / DeletedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| PagoPrestamoNomina | FechaPago | DateOnly | No | ✅ OK |
| PeriodoNomina | FechaInicio / FechaFin / FechaPago | DateOnly(?) | No | ✅ OK |
| PeriodoNomina | CreatedAt / UpdatedAt / DeletedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| PrestamoEmpleado | FechaSolicitud / FechaAutorizacion | DateOnly(?) | No | ✅ OK |
| PrestamoEmpleado | CreatedAt / UpdatedAt / DeletedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| TiempoExtra | Fecha / FechaAprobacion | DateOnly(?) | No | ✅ OK |
| TiempoExtra | CreatedAt / UpdatedAt / DeletedAt | DateTime(?) | **Sí** | 🔒 AUTO |

### 1.9 Mantenimiento — Equipos, Fuego, Bitácoras

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| EquipmentInspectionCriterion / Definition / DefinitionAssignee | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| EquipmentInspectionDefinition | LastGeneratedAt | DateTime? | No | ✅ OK |
| EquipmentInspectionExecution | ExecutionDate | DateOnly | No | ✅ OK |
| EquipmentInspectionExecution | StartedAt / CompletedAt / LastModifiedAt | DateTime? | No | ✅ OK |
| EquipmentInspectionExecutionImage | UploadedAt | DateTime | No | ✅ OK |
| EquipmentQrLabel | PrintedAt | DateTime? | No | ✅ OK |
| EquipmentQrLabel | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| Equipment / Tool | DateOfPurchase | DateOnly | No | ✅ OK |
| FireCycleInspectionBase | InspectedAt | DateTime? | No | ✅ OK |
| FireInspectionCycle | PeriodStart / PeriodEnd | DateOnly | No | ✅ OK |
| FireInspectionCycle | GeneratedAt | DateTime | No | ✅ OK |
| FireInspectionPeriod | StartDate | DateOnly | No | ✅ OK |
| FireInspectionPeriod | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| BitacoraEquipoBase / PiscinaBitacora | Date | DateOnly | No | ✅ OK |
| BitacoraMantenimiento | FechaRegistro | DateTime | No | ⚠️ DT→DO — **mismo nombre de campo (`FechaRegistro`) que `Medidor`/`MedidorLectura`, pero ahí es `DateOnly`**: inconsistencia clara entre entidades hermanas del mismo módulo de bitácoras |
| ControlPrestamoHerramienta | FechaSalida / FechaRegreso | DateTime(?) | No | ✅ OK (hora relevante) |
| ElevatorsEmergencyCall | RequestDate | DateOnly | No | ✅ OK |
| ElevatorSparePartsChange | ChangeDate | DateOnly | No | ✅ OK |
| Medidor | FechaRegistro | DateOnly? | No | ✅ OK |
| MedidorLectura | FechaRegistro | DateOnly | No | ✅ OK |
| RecepcionPipaAgua | HoraLlegada / HoraTermino | DateTime(?) | No | ✅ OK |
| RecepcionPipaAgua | CreatedAt / UpdatedAt / DeletedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| MaintenanceCalendar | FechaServicio | DateOnly | No | ✅ OK |

### 1.10 Control de Acceso

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| AccessCredential | ValidFrom / ValidUntil | DateTime(?) | No | ✅ OK |
| AccessCredential | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| AccessCredential | RevokedAt | DateTime? | No | ✅ OK |
| AccessEvent | OccurredAt | DateTime | No | ✅ OK |
| AccessPoint | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| GuardShift | ShiftStart / ShiftEnd | DateTime | No | ✅ OK |
| Invitation | SentAt | DateTime | No | ✅ OK |
| Visit | ScheduledStart / ScheduledEnd / ActualCheckIn / ActualCheckOut | DateTime(?) | No | ✅ OK |
| Visit / Visitor | CreatedAt | DateTime | **Sí** | 🔒 AUTO |

### 1.11 Comunicación / Comité / Asamblea / Diagramas

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| Announcement | CreateAt | DateTime | No | ⚠️ NAME (no implementa `IAuditable`) |
| Announcement | PublishedAt | DateTime? | No | ✅ OK |
| Announcement | ExpirationDate | DateOnly? | No | ✅ OK |
| AnnouncementAnalytics | ViewDate | DateTime | No | ⚠️ DT→DO |
| AsambleaChecklistExecution | DueDate | DateTime | No | ⚠️ DT→DO |
| AsambleaChecklistExecution | CompletedAt | DateTime? | No | ✅ OK |
| Asamblea* (ChecklistExecution/Template, Invitado, Plan, SupportRequest) | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| AsambleaInvitado | NotificationSentAt | DateTime? | No | ✅ OK |
| AsambleaSupportRequest | RequestedAt / ResolvedAt | DateTime? | No | ✅ OK |
| CustomDocument | CreateAt | DateTime | No | ⚠️ NAME |
| DiagramDraw | UpdateAt | DateTime | No | ⚠️ NAME |
| ServiceOrder | RequestDate / ExecutionDate | DateOnly(?) | No | ✅ OK |
| GoogleCalendarEvent | StartAt / EndAt | DateTime | No | ✅ OK |
| GoogleCalendarEvent | RecurrenceEndDate | DateTime? | No | ⚠️ DT→DO |
| GoogleCalendarEvent | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| JuntaMensualSession | ScheduledAt / ScheduledEndAt | DateTime | No | ✅ OK |
| JuntaMensualSession | ClosedAt / CancelledAt | DateTime? | No | ✅ OK |
| JuntaMensualSession | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| CustomerInspection / Inspection / ReportDefinition | CreatedAt (/UpdatedAt) | DateTime(?) | **Sí** | 🔒 AUTO |
| ReportSubmissionRecord | RegisterDate | DateTime | No | ⚠️ DT→DO |
| ManualDiagram | EditTokenExpiry | DateTime? | No | ✅ OK |
| ManualDiagram | ActualizadoEn | DateTime | No | ⚠️ NAME |
| ManualTemplate | UploadDate | DateTime | No | ⚠️ DT→DO |
| ManualTemplate | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| ManualTemplateAttachment | UploadedAt | DateTime | No | ✅ OK |
| ManualTemplateVersion | ChangeDate | DateOnly | No | ✅ OK |
| Meeting | Date | DateOnly | No | ✅ OK |
| MeetingDetails | DeliveryDate | DateOnly? | No | ✅ OK |
| MeetingDetailsSeguimiento | Fecha | DateOnly | No | ✅ OK |
| PresentacionJuntaComite | FechaCorrespondiente / FechaJunta | DateOnly(?) | No | ✅ OK |
| PresentacionJuntaComite | FechaCargaPortada / FechaCargaContable / FechaCarga / FechaCargaSupervisor | DateTime? | No | ✅ OK (instantes de carga) |
| PanicAlert | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| PanicAlert | AttendedAt / ResolvedAt | DateTime? | No | ✅ OK |
| EntregaRecepcionCliente | Fecha | DateTime | No | ⚠️ DT→DO |
| EntregaRecepcionDescripcion | FechaCarga / FechaSupervision | DateTime? | No | ✅ OK |

### 1.12 Propiedades / Inventarios / Compras

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| Property | DelinquentSince | DateOnly? | No | ✅ OK |
| PropertyMember / PropertyOccupant | StartDate / EndDate | DateOnly(?) | No | ✅ OK |
| EntradaProducto | FechaEntrada | DateOnly? | No | ✅ OK |
| InventarioExtintor | ExpirationDate | DateOnly | No | ✅ OK |
| RadioComunicacion | FechaCompra | DateOnly | No | ✅ OK |
| SalidaProducto | FechaSalida | DateOnly? | No | ✅ OK |
| OrdenCompra | FechaSolicitud | DateOnly | No | ✅ OK |
| OrdenCompraAuth | FechaAutorizacion | DateOnly? | No | ✅ OK |
| OrdenCompraComprobantePago | UploadDate | DateTime | No | ⚠️ DT→DO |
| SolicitudCompra | FechaSolicitud / FechaAutorizacion | DateOnly? | No | ✅ OK |
| SolicitudCompra | HoraAutorizacion | TimeOnly? | No | ✅ OK — **buen ejemplo**: separación explícita Date+Time |
| SolicitudCompraEvidence / CotizacionProveedorEvidence | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| CotizacionProveedor | FechaCotizacion | DateOnly | No | ✅ OK |

### 1.13 Reclutamiento

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| Candidate | BirthDate | DateOnly | No | ✅ OK |
| Candidate / CandidateApplicationRole | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| CandidateInterview | ScheduledDate | DateOnly | No | ✅ OK |
| CandidateInterview | ScheduledTime | TimeOnly | No | ✅ OK — **excelente ejemplo, patrón a replicar** en otras entidades con `DateTime` combinado |
| CandidateInterview | ClosedAt | DateTime? | No | ✅ OK |
| CandidateInterview / CandidateInterviewResult | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| CandidateInterviewResult | SentAt / EvaluatedAt | DateTime | No | ✅ OK |
| CandidateProcess | RegisterDate | DateOnly | No | ✅ OK |
| CandidateProcess | SelectedAt | DateOnly? | No | ⚠️ NAME (sufijo `At` sugiere instante, pero el tipo es `DateOnly`; inconsistencia de nomenclatura, no de tipo) |
| CandidateProcess | HiringRequestedAt | DateTime? | No | ✅ OK |
| CandidateProcess | HiredEntryDate | DateOnly? | No | ✅ OK |
| CandidateProcess | HiredEntryTime | TimeOnly? | No | ✅ OK |
| CandidateProcess | ClosedAt / FinalDecisionAt | DateTime? | No | ✅ OK |
| CandidateProcess / CandidateStageHistory / CandidateWorkExperience | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |
| CandidateStageHistory | ChangedAt | DateTime | No | ✅ OK |
| CandidateWorkExperience | StartDate / EndDate | DateOnly(?) | No | ✅ OK |
| RequestDismissal / RequestEmployeeRegister / RequestPosition / RequestSalaryModification | RequestDate / ExecutionDate / LegalAuthorizationDate / PayrollAuthorizationDate / LastDayOfWork / DateFinish / SelectionDate / EntryDate | DateOnly(?) | No | ✅ OK |
| RequestDismissalFile | UploadDate | DateOnly | No | ✅ OK |
| RequestEmployeeRegisterFile | UploadDate | DateTime? | No | ⚠️ DT→DO — **contraste directo con `RequestDismissalFile.UploadDate` (mismo nombre, `DateOnly`)** |
| RequestEmployeeRegisterFile | ValidatedAt | DateTime? | No | ✅ OK |
| RequestEmployeeRegisterFile | CreatedAt / UpdatedAt | DateTime(?) | **Sí** | 🔒 AUTO |

### 1.14 Tareas (Operations — Task Engine)

| Entidad | Propiedad | Tipo | IAuditable | Riesgo |
|---|---|---|---|---|
| AgendaSupervision | FechaSolicitud / FechaConclusion | DateOnly(?) | No | ✅ OK |
| RecurringTaskTemplate | StartDate / EndDate | DateOnly(?) | No | ✅ OK |
| TaskAlertLog | SentAt | DateTime | No | ✅ OK |
| TaskAttachment / TaskComment / TaskFollowUp / TaskTemplate | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| TaskChangeLog | ChangedAt | DateTime | No | ✅ OK |
| TaskChecklistItem | DoneAt | DateTime? | No | ✅ OK |
| TaskInstance | ScheduledDate | DateTime | No | ⚠️ DT→DO — mismo dominio que `RecurringTaskTemplate.StartDate/EndDate` (`DateOnly`): tipos mezclados dentro del mismo subsistema |
| TaskInstance | DueDate / CreatedFromRecurrenceDate | DateTime? | No | ⚠️ DT→DO |
| TaskInstance | CompletedAt | DateTime? | No | ✅ OK |
| TaskInstance | CreatedAt | DateTime | **Sí** | 🔒 AUTO |
| TaskJustification | RequestedAt / ResolvedAt | DateTime(?) | No | ✅ OK |
| TaskMessageReads | ReadingDate | DateTime | No | ⚠️ DT→DO |
| **Tasks** (legacy, coexiste con `TaskInstance`) | CreateDate | DateTime | No | ⚠️⚠️ **NAME + DT→DO crítico** — no implementa `IAuditable` pese a ser la fecha de creación |
| **Tasks** | ClosedDate, ScheduledDate, RecurrenceSourceDate, PlannedStartDate, PlannedEndDate, ActualStartDate, ActualEndDate, RecurrenceEndDate | DateTime? (8 campos) | No | ⚠️⚠️ **Peor caso del inventario**: 10 propiedades de fecha en la misma entidad, todas `DateTime?`, **cero uso de `DateOnly`** pese a que la mayoría son fechas calendario sin hora |
| **Tasks** | BreachedAt / LastAlertAt | DateTime? | No | ✅ OK (estos sí son instantes) |
| TaskWorkPlan | SendDate | DateTime | No | ⚠️ DT→DO |
| WorkGroup | DateCreation | DateTime | No | ⚠️ NAME (no usa `IAuditable`) |

---

## 2. Inventario de Manejo en Servicios (Application Layer)

El barrido cubrió **~230 archivos** de `LuxuryApp.Application` con al menos un patrón de fecha. La tabla completa (archivo → patrones detectados) está en `inventario_fechas.md` (sección 2, líneas 606-1299) y no se duplica aquí íntegra por espacio; a continuación se presentan **(a)** la clasificación de riesgo por tipo de patrón, **(b)** los hallazgos críticos **verificados con lectura de código real** (no solo grep), que es donde está el riesgo accionable.

### 2.1 Clasificación de riesgo por patrón

> **Errata (2026-08-26, posterior a la publicación de este informe):** la fila
> `DateOnly.FromDateTime(DateTime.UtcNow)` de la tabla siguiente está marcada "✅ OK" y es
> **incorrecto para los casos donde el campo representa un día de negocio en México** (fecha de
> solicitud, fecha de registro, etc.). `UtcNow` da el día calendario UTC, no el de México — son
> distintos durante las 18:00–23:59 hora de México todos los días. El proyecto ya tiene la utilidad
> correcta para esto (`LuxuryApp.Shared.Extensions.DateTimeExtension.GetMexicoDateOnly()`/
> `GetMexicoTime()`, con conversión real de zona horaria), usada en 41 archivos, pero ~90 archivos
> usan en su lugar el patrón `UtcNow` de esta fila, que hoy está mal clasificado como "OK". Detalle
> completo, incluida una regresión real que esto causó en la ejecución de FH-01, en
> `docs/plans/20260826-fechas-horas-orquestacion.md` (Fase 1.5, tickets FH-01b y FH-12). No se
> reescribe la tabla original para conservar la evidencia de lo que se auditó primero; esta nota es
> la corrección vigente.

| Patrón | Ocurrencias (aprox.) | Riesgo |
|---|---|---|
| `DateTime.Now` / `DateTime.Now.Xxx` | 13 archivos | 🔴 **CRÍTICO** — hora local del servidor en vez de UTC |
| `DateTime.Parse(` / `DateOnly.Parse(` / `TimeOnly.Parse(` sin `CultureInfo` explícito | 8 ocurrencias | 🟠 **ALTO** — depende de la cultura del hilo/servidor; en un servidor con cultura regional distinta a `en-US`/invariant, el separador de fecha puede interpretarse mal |
| `.ParseExact(..., CultureInfo.InvariantCulture)` | 6 ocurrencias (todas en `Funding*`) | ✅ OK — patrón correcto, con formato y cultura explícitos |
| `DateOnly.FromDateTime(DateTime.Now)` | 2 ocurrencias | 🔴 **CRÍTICO** — combina el problema de `DateTime.Now` con la conversión a `DateOnly` |
| `DateOnly.FromDateTime(DateTime.UtcNow)` (resto de ~90 ocurrencias) | ~90 archivos | ✅ OK — patrón correcto y mayoritario |
| `DateTime.UtcNow` (uso directo) | ~140 archivos | ✅ OK — patrón dominante y correcto |
| `.ToString(` con formato hardcodeado (`dd/MM/yyyy`, `yyyyMMdd_HHmmss`, etc.) | ~110 archivos | 🟡 **MEDIO** — no es incorrecto per se, pero dispersa el formato de presentación en la capa de aplicación en vez de dejarlo al frontend; riesgo de inconsistencia de formato entre reportes/PDFs generados en el backend |

### 2.2 Hallazgos críticos verificados (código real, no solo grep)

**`DateTime.Now` en vez de `DateTime.UtcNow`** — 13 archivos confirmados:

| Archivo | Línea | Código | Impacto |
|---|---|---|---|
| `AspelCobranzaHausLive/Services/AspelCobranzaHausDetalleAppService.cs` | 243 | `FechaCargo = DateTime.Now.ToString("dd/MM/yyyy")` | Fecha de cargo en reporte de cobranza con hora del servidor |
| `AspelCobranzaHausLive/Services/AspelCobranzaHausAppService.cs` | 277 | `var fechaCorte = request.FechaCorte ?? DateOnly.FromDateTime(DateTime.Now);` | Fecha de corte por defecto puede diferir del día real en UTC cerca de medianoche |
| `SystemTenant/Notification/Services/NotificationUserAppService.cs` | 117-118 | `var readCutoff = DateTime.Now.AddDays(-readDays);` / `unreadCutoff` | Borrado de notificaciones antiguas con corte de hora local, inconsistente con `CreatedAt` que se graba en UTC (`IAuditable`) → puede borrar de más/menos según TZ del servidor |
| `CobranzaOnline/Services/CobranzaOnlineDashboardAppService.cs` | 265, 790, 994, 1268 (`LastErrorAt` sí usa `UtcNow`), 1638, 1912 | `var now = DateTime.Now;` / `$"...al {DateTime.Now:dd-MMM-yy HH:mm}."` | El mismo servicio mezcla `DateTime.Now` (para el mensaje mostrado al usuario) y `DateTime.UtcNow` (para `LastErrorAt`) — **inconsistencia interna verificada dentro del mismo archivo** |
| `CommitteeLuxuryApp/Services/CommitteeCobranzaAppService.cs` | 20-21, 65 | `int year = request.Year ?? DateTime.Now.Year;` / `... ?? DateTime.Now.ToString("dd/MM/yyyy HH:mm")` | Año/mes por defecto y fecha de corte de reporte de comité con hora local |
| `ContabilidadOnline/Services/ProyectosAprobadosService.cs` | 42-43 | `int currentMonth = DateTime.Now.Month;` | Mes/año actual para proyectar cobros, con hora local |
| `DynamicReports/Services/ReportPdfExportService.cs` | 35 | `$"Generado: {DateTime.Now.ToString("dd/MM/yyyy HH:mm", EsMx)}"` | Timestamp de generación de PDF con hora local (aceptable si es solo "hora de impresión" visible al usuario, pero inconsistente con el resto del sistema) |
| `AdminLuxuryApp/Infraestructura/Jobs/Workers/DatabaseBackupJob.cs` | 70 | `var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");` | Nombre de archivo de respaldo con hora local del servidor Hangfire |
| `AdminLuxuryApp/Infraestructura/Jobs/Workers/AspelMigrationSchedulerJob.cs` | 31 | `var yearTo = DateTime.Now.Year;` | Rango de años a migrar calculado con hora local |
| `ManualsAndProcesses/DTOs/ManualPasoDTO.cs` | 191 | `public DateOnly FechaCambio { get; set; } = DateOnly.FromDateTime(DateTime.Now);` | Valor por defecto de un DTO (no de una entidad) calculado con hora local del servidor que atiende la petición |
| `ReclutamientoLuxuryApp/CandidateApplication/Services/CandidateAutomationService.cs` | 15 | `var now = DateTime.Now;` | Job diario de monitoreo de candidatos con corte de hora local |
| `ReclutamientoLuxuryApp/CandidateProcess/Services/CandidateProcessAppService.cs` | 22, 650, 679, 708, 757, 815, 1258, 1770, 2524 | `var now = DateTime.Now;` (×7) y `if (scheduledDateTime < DateTime.Now.AddMinutes(-30))` (×2) | **El archivo con más ocurrencias del inventario.** La validación `scheduledDateTime < DateTime.Now.AddMinutes(-30)` es una regla de negocio (no agendar entrevistas con más de 30 min de antelación) que compara un valor construido a partir de `DateOnly`+`TimeOnly` (hora local implícita del navegador/usuario) contra la hora local del servidor — **doble ambigüedad de zona horaria** |
| `OperationsLuxuryApp/AccessControl/Services/AccessScanService.cs` | 74 | `!IsRecurrenceSatisfied(credential.RecurrenceRule, DateTime.Now)` | Validación de horario recurrente de acceso (control de acceso físico) evaluada con hora local — si el servidor no está en la TZ del sitio, un guardia puede ser autorizado/denegado fuera del horario real |

**`.Parse(` / `.ParseExact(` — riesgo de cultura:**

| Archivo | Línea | Código | Riesgo |
|---|---|---|---|
| `VacationRequestApprovalEndPoints.cs` | 53 | `DateOnly.Parse(startDate)` / `DateOnly.Parse(endDate)` | Sin `CultureInfo` explícito — depende de la cultura del hilo ASP.NET Core (normalmente invariant, pero no garantizado si se configura `RequestLocalization`) |
| `LeaveRequestApprovalEndPoints.cs` | 45 | ídem | ídem |
| `RequestSalaryModificationAppService.cs` | 58 | `DateOnly.Parse(DTO.ExecutionDate)` | ídem |
| `RecurringTaskGeneratorService.cs` | 82, 88 | `DateTime.Parse(h.Start).Date` | ídem, además descarta la hora con `.Date` |
| `FundingAppService.cs` | 730 | `DateTime.Parse(comprobante?.Attribute("Fecha")?.Value ?? DateTime.UtcNow.ToString())` | El fallback `DateTime.UtcNow.ToString()` usa el formato de cultura por defecto, que luego se vuelve a parsear — frágil (si la cultura no es invariant, el `ToString()` y el `Parse()` podrían no ser simétricos) |

**Patrón correcto de referencia** (`FundingAppService.cs`, `FundingMapper.cs`): todas las conversiones desde el string `"yyyy-MM-dd"` usan `DateTime.ParseExact(period, "yyyy-MM-dd", CultureInfo.InvariantCulture)` — este es el patrón que debería generalizarse donde se detectó `.Parse(` sin cultura.

**Confirmación positiva — auditoría (`IAuditable`) correctamente en UTC:**

```csharp
// ApplicationDbContext.cs:820-847
private void AplicarCamposAuditoria()
{
    var usuario = _httpContextAccessor?.HttpContext?.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? "Sistema";
    var ahora = DateTime.UtcNow;
    ...
    if (entry.Entity is IAuditable auditable)
    {
        switch (estadoOriginal)
        {
            case EntityState.Added:
                auditable.CreatedAt = ahora; auditable.CreatedBy = usuario; break;
            case EntityState.Modified:
                auditable.UpdatedAt = ahora; auditable.UpdatedBy = usuario; break;
        }
    }
    if (entry.State == EntityState.Deleted && entry.Entity is ISoftDeletable softDeletable)
    {
        entry.State = EntityState.Modified;
        softDeletable.DeletedAt = ahora; softDeletable.DeletedBy = usuario;
    }
    ...
}
```

---

## 3. Inventario de Manejo en Frontend (Angular)

El barrido cubrió **~250 archivos** (`.ts`/`.html`) con patrones de fecha en `client/angular/src/app/`. El listado completo por archivo está en `inventario_fechas.md` (sección 3, líneas 1300-2153). Aquí se resume por patrón y se documentan los hallazgos verificados.

### 3.1 Clasificación de riesgo por patrón

| Patrón | Ocurrencias (aprox.) | Riesgo |
|---|---|---|
| `new Date(...)` ad-hoc en componentes/servicios | ~150 archivos | 🟠 **ALTO** (agregado) — cada punto es una decisión de parseo independiente, sin garantía de que preserve el día calendario si el string es `DateOnly` |
| `\| date` (Angular `DatePipe`) directo sobre campo del API | ~95 archivos | 🟠 **ALTO** si el campo subyacente es `DateOnly` (ver 3.3) |
| `formatDate` de `@angular/common` | ~20 archivos | 🟡 MEDIO — mismo riesgo que `DatePipe`, pero con locale explícito (mitiga parcialmente) |
| `dateFormat` (inputs custom de `shared/ui`) | ~20 archivos | 🟡 MEDIO — depende de la implementación interna del input |
| `DateService` (`core/services/date.service.ts`) | 139 archivos | ✅ Mitigación ya construida — pero adopción parcial |
| `date-fns` | 2 archivos únicamente (`contracts-policies.ts`, `report-meeting.ts`) | ℹ️ Librería declarada en `package.json` (`date-fns@4.4.0`) pero prácticamente sin adoptar |
| Tipado `Date \| string` en interfaces/DTOs | Confirmado en múltiples `*.dto.ts` (cobranza, purchase, funding, tasks) | 🟠 **ALTO** — traslada la ambigüedad de tipo al consumidor |

### 3.2 Hallazgo central: `DateService` existe pero no está gobernado

`client/angular/src/app/core/services/date.service.ts` ya implementa la pieza que el plan de acción (sección 5) pediría crear desde cero:

```ts
private parseDatePreservingLocalDay(value: any): Date | null {
  if (typeof value === "string") {
    const isoDateMatch = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      return new Date(Number(year), Number(month) - 1, Number(day)); // construcción en hora LOCAL
    }
    return new Date(value.trim()); // fallback: deja que el motor JS interprete (con Z → UTC)
  }
  ...
}
```

- Para un valor `"2026-08-26"` (típico `DateOnly` serializado) o `"2026-08-26T00:00:00"`, el regex captura el prefijo `yyyy-MM-dd` y construye la fecha con `new Date(year, month-1, day)` — esto es **exactamente el fix correcto** para el bug clásico de "un día menos" en campos de solo fecha, y es la razón por la que existe.
- **Riesgo residual verificado**: la misma función se usa también (vía `getDateFormat`, 89 usos) para construir el string `yyyy-MM-dd` que se envía al backend como filtro/payload — uso correcto para `DateOnly`. Pero el regex **no distingue si el string original tenía un componente de hora significativo** (ej. una marca de tiempo real como `CreatedAt`/`ScheduledStart`, que no son `DateOnly` sino `DateTime` en UTC): si algún componente pasara un campo `DateTime` (no `DateOnly`) por `getDateFormat`/`parseDate`, la hora quedaría descartada silenciosamente y el resultado dependería de qué día calendario cae la parte `yyyy-MM-dd` del string UTC — no necesariamente el día en la zona horaria local del usuario. **No se encontró evidencia de que esto esté ocurriendo hoy** (los ~89 usos de `getDateFormat` inspeccionados puntualmente son sobre selectores de fecha de formularios, consistente con `DateOnly`), pero **no hay ninguna restricción de tipos en `DateService` que lo impida** — es un riesgo estructural, no un bug confirmado en producción.

### 3.3 Riesgo confirmado: `| date` directo sobre `DateOnly` sin pasar por `DateService`

Se confirmó (lectura de código) que ni `ApiResponseService` (`core/http/services/api-response.service.ts`) ni los interceptores HTTP (`core/http/interceptors/`) hacen ninguna conversión de fechas — los DTOs llegan como JSON crudo, con las fechas como `string`. Ejemplo confirmado (`cobranza-payment.dto.ts`):

```ts
export interface CobranzaPaymentResponseDTO {
  paymentDate: Date | string;   // backend: CobranzaPayment.PaymentDate es DateOnly → llega como "2026-08-26"
  ...
}
export interface CobranzaPaymentAllocationDetailDTO {
  appliedAt: string | Date;     // backend: ChargePaymentAllocation.AppliedAt es DateTime UTC → llega como "2026-08-26T14:00:00Z" (o similar)
}
```

Cuando una plantilla `.html` hace `{{ item.paymentDate | date: 'dd/MM/yyyy' }}` **directamente sobre ese string**, Angular's `DatePipe` ejecuta internamente `new Date("2026-08-26")`. Por especificación ECMAScript, un string de fecha-únicamente (`YYYY-MM-DD`, sin hora) se interpreta como **medianoche UTC**. Al formatear en la zona horaria del navegador (México, UTC-6), el resultado es `2026-08-25 18:00` local → **el `DatePipe` mostraría "25/08/2026", un día menos que el valor real**. Este es precisamente el bug descrito por el usuario en el prompt original ("desfases de días").

Esto **no** ocurre con campos `DateTime` en UTC que incluyen el sufijo `Z` (como `appliedAt` arriba): ahí `new Date(...)` sí interpreta correctamente el instante UTC y el `DatePipe` lo convierte a la hora local del navegador de forma correcta — ese caso está bien.

**Archivos con `| date` aplicado directamente sobre campos que, por nombre, corresponden a `DateOnly` en el backend** (muestra representativa, lista completa en `inventario_fechas.md`):

- `charge-list.html`, `charge-template-list.html` → `Charge.DueDate`, `ChargeTemplate.StartDate/EndDate` (DateOnly)
- `payment-list.html`, `payments.html` → `CobranzaPayment.PaymentDate` (DateOnly)
- `property-fine-list.html` → `PropertyFine.InfractionDate` (DateOnly)
- `work-contract-list.html`, `work-contract-detail.html` → `WorkContract.StartDate/EndDate` (DateOnly)
- `contract-addendum-list.html`, `contract-template-list.html` → `ContractAddendum/ContractTemplate` fechas (DateOnly)
- `sanction-list.html`, `incident-list.html` → `Sanction.AppliedDate`, etc. (DateOnly)
- `periodos-nomina.html`, `evidencias-nomina.html`, `tiempo-extra.html` → `PeriodoNomina`/`TiempoExtra` (DateOnly)
- `orden-compra-list.html`, `solicitud-compra-list.html`, `cuadro-comparativo-list.html` → `OrdenCompra.FechaSolicitud`, etc. (DateOnly)

### 3.4 Inconsistencia de adopción de `DateService`

Componentes que **sí** centralizan en `DateService` (139 archivos) conviven con componentes que reimplementan lógica equivalente de forma local, por ejemplo:
- `core/services/filtro-calendar.service.ts` y `core/services/periodo-month.service.ts` — servicios paralelos con lógica de fecha propia.
- Múltiples `*-pdf.service.ts` (`orden-compra-pdf.ts`, `solicitud-pago-pdf.ts`, `minuta-pdf.service.ts`, etc.) usan `formatDate` de `@angular/common` directamente en vez de `DateService`.
- `shared/ui/inputs/web/custom-input-date-*-signal.ts` (los inputs de fecha reutilizables del catálogo UI) usan su propio `dateFormat`, no `DateService`.

---

## 4. Análisis de la excepción `IAuditable`

**Confirmado por código** (`api/LuxuryApp.Infrastructure.Data/Data/Interfaces/IAuditable.cs`):

```csharp
public interface IAuditable
{
    DateTime CreatedAt { get; set; }   // Fecha UTC de creación
    string CreatedBy { get; set; }
    DateTime? UpdatedAt { get; set; }  // Fecha UTC de última modificación
    string UpdatedBy { get; set; }
}
```

`ApplicationDbContext.SaveChangesAsync` → `AplicarCamposAuditoria()` (línea 820-855) **completa correctamente `CreatedAt`/`UpdatedAt` con `DateTime.UtcNow`** en cada `Added`/`Modified`, y hace lo mismo para `ISoftDeletable.DeletedAt`. No se encontró ningún servicio que asigne manualmente estos campos (serían sobrescritos igualmente por el interceptor).

**Entidades que implementan `IAuditable`** (confirmadas en el inventario, 45): `PasswordRecoveryCode`, `DatabaseBackupConfig`, `AiChatSession`, `LegacyIdMap`, `NotificationUser`, `FinancialBatch`, `FinancialLedgerEntry`, `Funding`, `AddendumTemplate`, `ContractAddendum`, `ContractTemplate`, `WorkContract`, `TemplateEvaluation`, `ChecklistOptionCatalog`, `DocumentCatalog`, `EmployeeOnboardingChecklist`, `Incident`, `IncidentAttachment`, `IncidentType`, `IncidentWitness`, `Sanction`, `SanctionType`, `SuspensionDay`, `ConfiguracionNomina`, `EvidenciaNomina`, `IncidenciaNomina`, `NominaDetalle`, `NominaEncabezado`, `PeriodoNomina`, `PrestamoEmpleado`, `TiempoExtra`, `SolicitudCompraEvidence`, `CotizacionProveedorEvidence`, `Candidate`, `CandidateApplicationRole`, `CandidateInterview`, `CandidateInterviewResult`, `CandidateProcess`, `CandidateStageHistory`, `CandidateWorkExperience`, `RecruitmentSourceCatalog`, `RequestEmployeeRegisterFile`, `EquipmentInspectionCriterion`, `EquipmentInspectionDefinition`, `EquipmentInspectionDefinitionAssignee`, `EquipmentQrLabel`, `FireInspectionPeriod`, `RecepcionPipaAgua`, `AccessCredential`, `AccessPoint`, `Visit`, `Visitor`, `AsambleaChecklistExecution`, `AsambleaChecklistTemplate`, `AsambleaInvitado`, `AsambleaPlan`, `AsambleaSupportRequest`, `GoogleCalendarEvent`, `JuntaMensualSession`, `CustomerInspection`, `Inspection`, `ReportDefinition`, `PanicAlert`, `TaskAttachment`, `TaskComment`, `TaskFollowUp`, `TaskInstance`, `TaskTemplate`, `ManualTemplate`.

**Entidades que tienen semántica de auditoría (creación/actualización) pero NO implementan `IAuditable`** — inconsistencia de nomenclatura y de gobierno (no se benefician del completado automático ni del `AuditEntry` que se genera para las entidades `IAuditable`):

| Entidad | Campo actual | Debería ser |
|---|---|---|
| `Announcement` | `CreateAt` | `IAuditable.CreatedAt` |
| `CustomDocument` | `CreateAt` | `IAuditable.CreatedAt` |
| `DiagramDraw` | `UpdateAt` | `IAuditable.UpdatedAt` |
| `ManualDiagram` | `ActualizadoEn` | `IAuditable.UpdatedAt` |
| `RegistroChecador` | `CreadoEn` | `IAuditable.CreatedAt` |
| `UserRefreshToken` | `CreationDate` | `IAuditable.CreatedAt` |
| `WorkGroup` | `DateCreation` | `IAuditable.CreatedAt` |
| `BudgetProposal` | `CreatedDate` | `IAuditable.CreatedAt` |
| `Tasks` (legacy) | `CreateDate` | `IAuditable.CreatedAt` |

**Recomendación:** `CreatedAt`/`UpdatedAt` deben permanecer como `DateTime` en UTC (no migrar a `DateOnly` ni a `DateTimeOffset`): es el estándar correcto para timestamps de auditoría, ya está bien implementado, y no requiere un `JsonConverter` adicional — .NET 10/`System.Text.Json` serializa un `DateTime` con `Kind=Utc` con el sufijo `Z`, y el frontend (vía `new Date(...)` o `DatePipe`) lo interpreta y convierte a hora local correctamente. Lo único pendiente es **unificar el nombre/mecanismo** de los 9 campos listados arriba al patrón `IAuditable` estándar del proyecto.

---

## 5. Plan de acción para un sistema unificado de fechas y horas

### 5.1 Backend (.NET)

1. **Regla de tipos** (ya mayoritariamente seguida, formalizar en `CONVENTIONS.md`):
   - Fecha calendario sin hora relevante (nacimiento, vencimiento, período, fecha de solicitud) → **`DateOnly`/`DateOnly?`**.
   - Hora sin fecha (p.ej. hora de autorización ya separada de su fecha) → **`TimeOnly`/`TimeOnly?`**, siguiendo el patrón ya usado en `CandidateInterview` (`ScheduledDate`+`ScheduledTime`) y `SolicitudCompra` (`FechaAutorizacion`+`HoraAutorizacion`).
   - Instante de un evento (creación, envío, ejecución, timestamp de auditoría) → **`DateTime` en UTC**, siempre poblado con `DateTime.UtcNow` (nunca `DateTime.Now`).
2. **Eliminar los 13+2 usos de `DateTime.Now`** listados en 2.2, reemplazando por `DateTime.UtcNow`. Priorizar `AccessScanService.cs:74` (control de acceso físico) y `CandidateProcessAppService.cs` (9 ocurrencias) por volumen/criticidad.
3. **Agregar un analizador/regla de lint** (Roslyn analyzer o `.editorconfig` + revisión de PR) que **prohíba `DateTime.Now`** en `LuxuryApp.Application`/`LuxuryApp.Api` fuera de un allowlist explícito (p.ej. timestamps puramente decorativos en PDFs generados para lectura humana local, si se decide mantenerlos así deliberadamente).
4. **Unificar `.Parse(`/`DateOnly.Parse(` sin cultura** al patrón ya usado en `Funding*`: `DateOnly.ParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture)`.
5. **Serialización JSON**: no se requiere acción — .NET 10 serializa `DateOnly` (`yyyy-MM-dd`) y `TimeOnly` (`HH:mm:ss`) de forma nativa e ISO-8601 sin converter custom. Mantener `NullableEmptyStringConverterFactory` (ya cubre `DateTime?` con `""` → `null`); verificar que también cubre `DateOnly?`/`TimeOnly?` si algún formulario los envía como cadena vacía.
6. **Migrar los 9 campos "huérfanos" de auditoría** (tabla de la sección 4) a `IAuditable` en una migración EF dedicada, o al menos documentar por qué quedan fuera del patrón estándar.
7. **Resolver las inconsistencias `DateOnly` vs `DateTime`** marcadas `⚠️ DT→DO` en la sección 1 mediante migraciones EF puntuales, priorizando la entidad legacy `Tasks` (10 campos) por ser el caso más severo — evaluar si `Tasks` sigue vigente o puede retirarse en favor de `TaskInstance` (que ya tiene el mismo problema en menor escala, también marcado arriba).

### 5.2 Frontend (Angular)

1. **No crear un servicio nuevo**: `core/services/date.service.ts` ya es la base correcta y ya tiene 139 consumidores. La tarea es de **gobierno, no de construcción**:
   - Prohibir (regla de lint/`CONVENTIONS.md`) `new Date(...)` y `formatDate(...)` directos en componentes de features; solo permitirlos dentro de `DateService` y de un puñado de servicios de bajo nivel ya identificados (`filtro-calendar.service.ts`, `periodo-month.service.ts`) que deberían fusionarse o delegar en `DateService`.
   - Prohibir el pipe `| date` de Angular sobre un valor que provenga directamente de un DTO del API sin pasar antes por `DateService.parseDate(...)`. En su lugar, exponer un **pipe propio** (p.ej. `apiDate`) que envuelva `DateService.parseDate` + `DatePipe`, para que las plantillas sigan usando sintaxis de pipe pero con la conversión segura centralizada.
2. **Tipar los DTOs de forma estricta**: eliminar la unión `Date | string` en las interfaces (`*.dto.ts`) y declarar explícitamente `string` para lo que llega del API (siempre es string en JSON) y reservar `Date` solo para value objects ya parseados en el cliente. Esto obliga a pasar por la conversión explícita en el borde de la aplicación en vez de dejarlo ambiguo para cada consumidor.
3. **Adoptar una única librería para lo que `Intl`/`Date` nativo no cubre bien** (rangos, diffs, timezones): el proyecto ya declaró `date-fns@4.4.0` pero solo la usan 2 archivos. Decisión recomendada: **consolidar en `date-fns`** (ya está en `package.json`, es tree-shakeable, y evita añadir `moment`/`luxon`) y migrar progresivamente la lógica manual de `DateService` (los métodos `formatDateTimeToMMAAAA`, `getNameMontYear`, etc. usan `Intl.DateTimeFormat` manualmente; son funcionalmente correctos pero podrían simplificarse con `date-fns/format`).
4. **Regla de envío al backend**: seguir enviando `DateOnly` como `yyyy-MM-dd` (ya es lo que hace `DateService.getDateFormat`/`formatToYyyyMmDd`) y `DateTime` como ISO 8601 completo con `Z` — nunca enviar un `Date` de JS serializado con `.toISOString()` cuando el campo destino es `DateOnly`, porque `toISOString()` siempre normaliza a UTC y puede desplazar el día si la hora local no es medianoche.
5. **Auditoría dirigida**: revisar los ~95 archivos `.html` que usan `| date` directamente (listados por patrón en `inventario_fechas.md`) y migrar los que consumen campos `DateOnly` (lista representativa en 3.3) al pipe seguro propuesto en el punto 1.

### 5.3 Base de datos

Confirmado por inspección de migraciones EF Core recientes (`20260811203819_RefactorCandidates.cs`, `20260819182758_Ticket6InterviewDateTimeSplit.cs`, entre otras): **no se requiere acción**.

- `DateTime`/`DateTime?` → `datetime2` (correcto; EF Core 8+ ya no usa `datetime` por defecto).
- `DateOnly`/`DateOnly?` → `date`.
- `TimeOnly`/`TimeOnly?` → `time`.

No se encontró ninguna columna mapeada explícitamente al `datetime` legado de 3.33ms de precisión. Este punto del plan de acción del prompt original ya está resuelto en el estado actual del esquema.

### 5.4 Estrategia de migración segura (sin pérdida ni desfase de datos)

**Respuesta directa: los puntos 5.1.1-5.1.5 y toda la sección 5.2 (frontend) no tocan datos existentes** — son cambios de código (`DateTime.Now`→`UtcNow`, lint, `DateService`, tipado de DTOs) que solo afectan escrituras/lecturas futuras. Ahí no hay riesgo de pérdida.

**El riesgo real está en 5.1.6 y 5.1.7** (renombrar los 9 campos de auditoría huérfanos, y convertir a `DateOnly` los campos marcados `⚠️ DT→DO`, en particular los 10 de la entidad `Tasks`). Esos dos puntos, tal como estaban redactados, no especificaban un procedimiento — este apartado lo cierra.

**Principio general: ninguna migración de este plan debe ejecutar un `ALTER COLUMN` destructivo en un solo paso.** Todo cambio de esquema sobre datos existentes sigue este ciclo de 5 pasos, cada uno como migración EF separada y desplegable de forma independiente:

1. **Aditivo** — agregar la(s) columna(s) nueva(s) como `NULL`, sin tocar ni borrar la columna original.
2. **Backfill verificado** — script de una sola vez que llena la columna nueva a partir de la vieja, con la regla de conversión decidida explícitamente por campo (ver casos abajo). Nunca un `CAST` genérico aplicado a ciegas a todas las columnas `⚠️ DT→DO` por igual.
3. **Validación** — antes de que la aplicación dependa de la columna nueva: comparar conteos de filas, correr una consulta de reconciliación (muestra de filas vieja vs. nueva) y, para los casos de conversión con riesgo de desfase de día, revisar explícitamente los registros cercanos a medianoche UTC (los candidatos a haberse corrido de día).
4. **Cutover** — la aplicación empieza a leer/escribir la columna nueva; la columna vieja se congela (deja de escribirse) pero se conserva como respaldo.
5. **Limpieza** — solo después de un período de "quemado" en producción (mínimo un ciclo de negocio completo, p.ej. un mes de nómina si aplica) y sin incidentes, una migración final elimina la columna vieja.

Backup completo de la base antes del paso 2 en cada caso, y cada migración debe tener su `Down()` funcional para poder revertir el paso si algo sale mal.

**Caso A — renombrar los 9 campos de auditoría huérfanos (`CreateAt`→`CreatedAt`, etc., sección 4):** riesgo bajo. Un `RenameColumn` de EF Core genera `sp_rename` en SQL Server, que renombra la columna en el catálogo sin mover ni reescribir los datos — es atómico y preserva el valor exacto de cada fila. Lo único genuinamente aditivo aquí es que, al implementar `IAuditable` completo, hacen falta también las columnas `CreatedBy`/`UpdatedBy`/`UpdatedAt` que hoy no existen en esas 9 entidades — esas sí se agregan como `NULL` (paso 1) y se quedan sin backfill real para el histórico (no hay forma de saber retroactivamente quién creó un registro si nunca se guardó), lo cual hay que comunicar como limitación conocida, no ocultarlo.

**Caso B — convertir `DateTime`→`DateOnly` en los campos `⚠️ DT→DO`:** riesgo alto y **no es solo técnico, es de negocio**. Antes de escribir el backfill de cada campo, correr contra los datos actuales una consulta de diagnóstico, por ejemplo:

```sql
SELECT DATEPART(HOUR, RequestDate) AS Hora, COUNT(*) AS Filas
FROM LeaveRequest
GROUP BY DATEPART(HOUR, RequestDate)
ORDER BY Filas DESC;
```

- Si el 100% de las filas tiene hora `00:00:00` (o se concentran en una hora fija, p.ej. siempre la misma por cómo se construyó el `DateTime` en el código) → el campo nunca tuvo información horaria real; truncar a `DateOnly` con `CAST(campo AS date)` es seguro, no se pierde nada.
- Si hay variación real de horas → el campo sí es un instante (probablemente poblado con `DateTime.UtcNow` o `DateTime.Now`, ver sección 2.2). Ahí truncar a `DateOnly` **es una decisión de negocio, no una conversión técnica**: hay que decidir con el dueño del módulo si el "día" correcto es el día UTC almacenado o el día en la zona horaria del sitio/tenant (México, salvo que haya operación multi-zona) — y si es este último, el backfill debe convertir explícitamente `UTC → hora local del sitio → tomar la fecha` antes de truncar, no un `CAST` directo sobre el valor UTC.
- La entidad `Tasks` (10 campos, la de mayor riesgo) debe auditarse primero para decidir si sigue viva o se retira en favor de `TaskInstance` — convertir tipos en una entidad que va a desaparecer sería trabajo desperdiciado.

Con este procedimiento (aditivo → backfill con regla verificada por campo → validación → cutover → limpieza diferida), el plan sí puede ejecutarse sin pérdida de datos. Sin él — es decir, tal como estaba descrito originalmente en 5.1.7 — no había esa garantía.

---

## 6. Resultado esperado al final del refactor

**Backend (.NET)**
- Cero usos de `DateTime.Now` en `LuxuryApp.Application`/`Api` — todo instante se captura con `DateTime.UtcNow`, con un analizador de lint (FH-03) que impide reintroducirlo.
- Regla de tipos aplicada de forma pareja: `DateOnly` para fecha calendario, `TimeOnly` cuando la hora es un dato independiente, `DateTime` (UTC) solo para instantes reales. Los `⚠️ DT→DO` de la sección 1 quedan resueltos o documentados como excepción deliberada (si el diagnóstico de 5.4 muestra hora real y el negocio decide conservarla).
- Las 54 entidades con semántica de auditoría (las 45 actuales + las 9 huérfanas de la sección 4) implementan `IAuditable` de forma uniforme.
- Parseos de string a fecha con cultura explícita (`InvariantCulture`), sin depender de la configuración regional del servidor.
- La base de datos, ya bien tipada, queda además con los campos `⚠️ DT→DO` migrados a `date` donde el diagnóstico lo confirme seguro.

**Frontend (Angular)**
- Un único punto de conversión de fecha (`DateService` + el pipe `apiDate` propuesto); `new Date()`/`formatDate`/`| date` sueltos sobre datos del API dejan de aparecer en componentes de features.
- DTOs tipados como `string` (no la unión ambigua `Date | string`).
- El bug de "un día menos" al mostrar campos `DateOnly` (~95 plantillas afectadas) deja de ser posible porque ya no hay ruta directa `API string → | date`.
- `date-fns` como única librería de utilidades de fecha.

**De cara al usuario**
- Lo que se ve en pantalla coincide con lo que hay en base, sin importar la zona horaria del servidor ni del navegador.
- Reportes/PDFs generados en backend dejan de mezclar hora local y UTC dentro del mismo servicio (caso confirmado en `CobranzaOnlineDashboardAppService`).

**Lo que el refactor NO resuelve por sí solo**
- `CreatedBy`/`UpdatedBy` histórico de las 9 entidades huérfanas no se puede reconstruir retroactivamente — quedan `null` para todo registro anterior al cutover.
- Para los campos con variación horaria real, el refactor no decide solo "cuál es el día correcto" (UTC vs. hora local del sitio) — lo resuelve el dueño del módulo, caso por caso, en el ticket de diagnóstico correspondiente.
- No cambia el reloj/zona horaria del servidor; el fix es dejar de depender de `DateTime.Now`, no forzar el sistema operativo a UTC.
- La disciplina de no reintroducir el patrón depende del lint/code review — ayuda mucho pero no es una garantía absoluta.

**Ejecución:** este refactor se ejecuta por tickets vía el protocolo de orquestación de `AGENTS.md` — ver `docs/plans/20260826-fechas-horas-orquestacion.md` para el tablero de tickets, los prompts entregados y la bitácora de auditoría de cada uno.

---

## Apéndice: fuente de datos

Este informe se basa en:
1. `inventario_fechas.md` (barrido mecánico previo, generado el 26/08/2026 20:29:16) — usado como índice exhaustivo de archivos y patrones.
2. Verificación directa de código para todos los hallazgos marcados como "confirmado"/"verificado": `ApplicationDbContext.cs`, `IAuditable.cs`, los 13 archivos con `DateTime.Now`, los 6 archivos con `.Parse`/`.ParseExact`, `Program.cs` (configuración JSON), 3 migraciones EF Core recientes, `date.service.ts` completo, `api-response.service.ts`, y 2 DTOs de frontend representativos.
3. No se leyeron individualmente los ~230 archivos de servicios ni los ~250 archivos de frontend completos — la sección 2.1/3.1 se apoya en el barrido de patrones, no en lectura línea por línea de cada archivo. Los hallazgos con línea de código citada sí fueron verificados directamente.
