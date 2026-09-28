# Inventario de Arquitectura Actual

> Generado: 2026-09-06

---

## BACKEND

### 1. ReclutamientoLuxuryApp

#### WorkPositions/
- [ ] **Services/** WorkPositionAppService.cs
- [ ] **Mapping/** WorkPositionMapper.cs
- [ ] **Interfaces/** IWorkPositionAppService.cs
- [ ] **Entities/** WorkPosition.cs, WorkPositionSchedule.cs, DiaDeTrabajo.cs
- [ ] **EndPoints/** WorkPositionEndPoints.cs
- [ ] **DTOs/** WorkPositionDTO.cs, WorkPositionListDto.cs, WorkPositionHoursDTO.cs, WorkPositionAddOrEditDTO.cs

#### SolicitudVacantes/
- [ ] **Handlers/** RequestPositionHandler.cs
- [ ] **Events/** RequestPositionEvents.cs

#### SolicitudModificacionesSueldo/
- [ ] **Handlers/** RequestSalaryModificationHandler.cs
- [ ] **Events/** RequestSalaryModificationEvents.cs

#### SolicitudAltas/
- [ ] **Handlers/** RequestEmployeeRegisterHandler.cs
- [ ] **Events/** RequestEmployeeRegisterEvents.cs

#### Shared/Policies/
- [ ] **Services/** HrActionPolicyService.cs
- [ ] **Interfaces/** IHrActionPolicyService.cs

#### SalaryModifications/
- [ ] **Services/** RequestSalaryModificationAppService.cs
- [ ] **Mapping/** SalaryModificationMapper.cs
- [ ] **Interfaces/** IRequestSalaryModificationAppService.cs
- [ ] **Entities/** RequestSalaryModification.cs
- [ ] **EndPoints/** RequestSalaryModificationEndPoints.cs
- [ ] **DTOs/** RequestSalaryModificationDTO.cs, StatusRequestSalaryModificationDTO.cs, RequestSalaryModificationListDTO.cs, RequestSalaryModificationAddOrEditDTO.cs, GetDataForModificacionSalarioDTO.cs

#### RequestPositions/
- [ ] **Services/** RequestPositionAppService.cs
- [ ] **Mapping/** RequestPositionMapper.cs
- [ ] **Interfaces/** IRequestPositionAppService.cs
- [ ] **Entities/** RequestPosition.cs
- [ ] **EndPoints/** RequestPositionEndPoints.cs
- [ ] **DTOs/** RequestPositionDTO.cs, RequestPositionAddOrEditDTO.cs, RequestPositionDeleteImpactDto.cs, RequestPositionSendEmailDTO.cs

#### RequestEmployeeRegisters/
- [ ] **Services/** RequestEmployeeRegisterAppService.cs
- [ ] **Mapping/** RequestEmployeeRegisterMappingProfile.cs
- [ ] **Interfaces/** IRequestEmployeeRegisterAppService.cs
- [ ] **Entities/** RequestEmployeeRegister.cs, RequestEmployeeRegisterFile.cs
- [ ] **EndPoints/** RequestEmployeeRegisterEndPoints.cs
- [ ] **DTOs/** RequestEmployeeRegisterDTO.cs, RequestEmployeeRegisterListDTO.cs, RequestEmployeeRegisterGetByIdDTO.cs, RequestEmployeeRegisterBasicInfoDTO.cs, RequestEmployeeRegisterAddOrEditDTO.cs, RequestEmployeeRegisterUpdateStatusDTO.cs, RequestEmployeeRegisterDuplicateSearchDTO.cs, DuplicateEmployeeMatchDTO.cs, DataToExcelRequestEmployeeRegisterDTO.cs, GetRequestEmployeeRegisterDTO.cs, IndividualRequestEmployee.cs, ReactivateAndMigrateEmployeeDTO.cs

#### RecurringTasks/
- [ ] **Services/** TaskTemplateAppService.cs, TaskInstanceAppService.cs, RecurringTaskGeneratorService.cs
- [ ] **Mapping/** RecurringTasksProfile.cs
- [ ] **Interfaces/** ITaskTemplateAppService.cs, ITaskInstanceAppService.cs, IRecurringTaskGeneratorService.cs
- [ ] **Endpoints/** TaskTemplatesEndPoints.cs, TaskInstancesEndPoints.cs
- [ ] **DTOs/** TaskTemplateDTO.cs, TaskTemplateItemDTO.cs, TaskInstanceDTO.cs, TaskCommentDTO.cs, TaskAttachmentDTO.cs, CreateTaskTemplateDTO.cs, CreateTaskTemplateItemDTO.cs, CreateTaskCommentDTO.cs, UpdateTaskTemplateDTO.cs, UpdateTaskTemplateItemDTO.cs, TaskTemplateItemsReorderDTO.cs, CompleteTaskInstanceDTO.cs, CustomerTaskItemConfigDTO.cs

#### EmployeeDocument/
- [ ] **Services/** EmployeeDocumentAppService.cs
- [ ] **Interfaces/** IEmployeeDocumentAppService.cs
- [ ] **EndPoints/** EmployeeDocumentEndpoints.cs

#### EmployeeBankData/
- [ ] **Services/** EmployeeBankDataAppService.cs
- [ ] **Mapping/** EmployeeBankDataMappingProfile.cs
- [ ] **Interfaces/** IEmployeeBankDataAppService.cs
- [ ] **EndPoints/** EmployeeBankDataEndPoints.cs
- [ ] **DTOs/** EmployeeBankDataDTO.cs, EmployeeBankDataAddOrEditDTO.cs

#### EmployeeFile/
- [ ] **Services/** EmployeeFileAppService.cs
- [ ] **Mapping/** EmployeeFileMappingProfile.cs

#### JobDescriptions/
- [ ] **Services/** JobDescriptionAppService.cs
- [ ] **Mapping/** JobDescriptionMapper.cs
- [ ] **Interfaces/** IJobDescriptionAppService.cs
- [ ] **Entities/** JobDescription.cs
- [ ] **EndPoints/** JobDescriptionEndPoints.cs
- [ ] **DTOs/** JobDescriptionDTO.cs, JobDescriptionProposalRequestDTO.cs

#### CustomerProviders/
- [ ] **Services/** CustomerProviderAppService.cs
- [ ] **Mapping/** CustomerProviderMapper.cs

#### RecruitmentSourceCatalogs/
- [ ] **Services/** RecruitmentSourceCatalogAppService.cs
- [ ] **Interfaces/** IRecruitmentSourceCatalogAppService.cs

---

### 2. RecursosHumanosLuxuryApp

#### TimeOff/Vacations/VacationShared/
- [ ] **ViewModels/** GenericEmailViewModel.cs
- [ ] **Services/** VacationHelperService.cs, VacationEmailGenerator.cs
- [ ] **Mappings/** VacationBalanceMapping.cs, VacacionesProfile.cs
- [ ] **Interfaces/** IVacationEmailGenerator.cs
- [ ] **DTOs/** VacationRequestFilterDTO.cs, VacationRequestDTO.cs, VacationRequestDetailDTO.cs, VacationRequestAddOrEditDTO.cs, VacationHistoryItemDTO.cs, VacationBalanceDTO.cs

#### TimeOff/Vacations/VacationRequestApproval/
- [ ] **Services/** AprobacionVacacionesService.cs
- [ ] **Mappings/** VacationRequestApprovalMappingProfile.cs
- [ ] **Interfaces/** IAprobacionVacacionesService.cs
- [ ] **EndPoints/** VacationRequestApprovalEndPoints.cs
- [ ] **DTOs/** VacationApproveDTO.cs

#### TimeOff/Vacations/VacationBalanceAdmin/
- [ ] **Services/** VacationBalanceAdminService.cs
- [ ] **Mappings/** VacationBalanceAdminMappingProfile.cs
- [ ] **Interfaces/** IVacationBalanceAdminService.cs
- [ ] **Endpoints/** VacationBalanceAdminEndpoints.cs
- [ ] **DTOs/** VacationBalanceAdminViewDTO.cs

#### TimeOff/Vacations/PastVacations/
- [ ] **Service/** PastVacationsAppService.cs
- [ ] **Mappings/** PastVacationsMappingProfile.cs
- [ ] **Interfaces/** IPastVacationsAppService.cs
- [ ] **EndPoints/** PastVacationsEndPoints.cs
- [ ] **DTOs/** RegisterPastVacationDTO.cs

#### TimeOff/Vacations/MyVacationRequests/
- [ ] **Services/** SolicitudVacacionesService.cs
- [ ] **Mappings/** MyVacationRequestsMappingProfile.cs
- [ ] **Interfaces/** ISolicitudVacacionesService.cs
- [ ] **Endpoints/** MyVacationRequestsEndpoints.cs
- [ ] **DTOs/** VacationRequestMyDTO.cs

#### TimeOff/LeaveRequestApproval/
- [ ] **Services/** AprobacionPermisoService.cs
- [ ] **Mapping/** LeaveRequestApprovalMappingProfile.cs
- [ ] **Interfaces/** IAprobacionPermisoService.cs
- [ ] **EndPoints/** LeaveRequestApprovalEndPoints.cs

#### TimeOff/LeaveRequest/
- [ ] **Services/** LeaveRequestService.cs, LeaveRequestEmailGenerator.cs
- [ ] **Mapping/** LeaveRequestMapping.cs
- [ ] **Interfaces/** ILeaveRequestService.cs, ILeaveRequestEmailGenerator.cs
- [ ] **EndPoints/** MyLeaveRequestsEndpoints.cs
- [ ] **DTOs/** LeaveRequestMyDTO.cs, LeaveRequestFilterDTO.cs, LeaveRequestDTO.cs, LeaveRequestDetailDTO.cs, LeaveRequestApproveDTO.cs, LeaveRequestAddOrEditDTO.cs

#### TimeOff/Entities/
- [ ] VacationRequestHistory.cs, VacationRequest.cs, VacationBalance.cs, ManualBalanceChangeLog.cs, LeaveRequestHistory.cs, LeaveRequest.cs

#### TimeOff/ApprovalRules/
- [ ] **Services/** ApprovalRuleService.cs
- [ ] **Interfaces/** IApprovalRuleService.cs

#### Persistence/RecursosHumanos/
- [ ] NominaEntityConfigurations.cs, CheckadorConfiguration.cs

#### Notifications/
- [ ] **Services/** HrNotificationCoordinatorService.cs
- [ ] **Interfaces/** IHrNotificationCoordinatorService.cs
- [ ] **DTOs/** NotificationRequestDataDTO.cs

#### Nomina/TiempoExtra/
- [ ] **Services/** TiempoExtraAppService.cs
- [ ] **Mapping/** TiempoExtraMappingProfile.cs
- [ ] **Interfaces/** ITiempoExtraAppService.cs
- [ ] **EndPoints/** TiempoExtraEndpoints.cs
- [ ] **DTOs/** TiempoExtraDTO.cs

#### Nomina/Shared/
- [ ] PeriodoNominaHelperService.cs, NominaDraftRecalculationService.cs, NominaCalculatorService.cs, IsrCalculatorService.cs, ImssCalculatorService.cs

#### Nomina/Prestamos/
- [ ] **Services/** PrestamoEmpleadoAppService.cs
- [ ] **Mapping/** PrestamosMappingProfile.cs
- [ ] **Interfaces/** IPrestamoEmpleadoAppService.cs
- [ ] **EndPoints/** PrestamosEndPoints.cs
- [ ] **DTOs/** PrestamoEmpleadoDTO.cs

#### Nomina/PeriodoNomina/
- [ ] **Services/** PeriodoNominaAppService.cs
- [ ] **Mapping/** PeriodoNominaMappingProfile.cs
- [ ] **Interfaces/** IPeriodoNominaAppService.cs
- [ ] **EndPoints/** PeriodoNominaEndPoints.cs
- [ ] **DTOs/** PeriodoNominaDTO.cs, PeriodoNominaCreateDTO.cs

#### Nomina/NominaEncabezado/
- [ ] **Services/** NominaEncabezadoAppService.cs
- [ ] **Mapping/** NominaEncabezadoMappingProfile.cs
- [ ] **Interfaces/** INominaEncabezadoAppService.cs
- [ ] **EndPoints/** NominaEncabezadoEndPoints.cs
- [ ] **DTOs/** NominaEncabezadoDTO.cs

#### Nomina/NominaDetalle/
- [ ] **Services/** NominaDetalleAppService.cs
- [ ] **Mapping/** NominaDetalleMappingProfile.cs
- [ ] **Interfaces/** INominaDetalleAppService.cs
- [ ] **EndPoints/** NominaDetalleEndPoints.cs
- [ ] **DTOs/** NominaDetalleDTO.cs

#### Nomina/IncidenciaNomina/
- [ ] **Services/** IncidenciaNominaAppService.cs
- [ ] **Mapping/** IncidenciaNominaMappingProfile.cs
- [ ] **Interfaces/** IIncidenciaNominaAppService.cs
- [ ] **EndPoints/** IncidenciaNominaEndPoints.cs
- [ ] **DTOs/** IncidenciaNominaDTO.cs, HojaIncidenciasDTO.cs, GuardarHojaIncidenciasDTO.cs

#### Nomina/Evidencias/
- [ ] **Services/** EvidenciaNominaAppService.cs

---

### 3. OperationsLuxuryApp

#### Tasks/WorkGroupMember/
- [ ] **Services/** TaskGroupMemberAppService.cs
- [ ] **Interfaces/** ITaskGroupMemberAppService.cs
- [ ] **Entities/** WorkGroupMembers.cs
- [ ] **EndPoints/** TaskGroupParticipantEndpoints.cs
- [ ] **DTOs/** WorkGroupMembersDTO.cs, WorkGroupMembersAddOrEditDTO.cs

#### Tasks/WorkGroupCategories/
- [ ] **Services/** TaskGroupCategoryAppService.cs
- [ ] **Mapping/** WorkGroupCategoriesMapper.cs
- [ ] **Interfaces/** ITaskGroupCategoryAppService.cs
- [ ] **Entities/** WorkGroupCategories.cs
- [ ] **EndPoints/** TaskGroupCategoriesEndpoints.cs
- [ ] **DTOs/** TaskGroupCategoryDTO.cs, WorkGroupCategoriesAddOrEditDTO.cs

#### Tasks/WorkGroup/
- [ ] **Services/** TaskGroupAppService.cs
- [ ] **Mapping/** WorkGroupMapper.cs
- [ ] **Interfaces/** ITaskGroupAppService.cs
- [ ] **Entities/** WorkGroup.cs
- [ ] **EndPoints/** TaskGroupsEndpoints.cs
- [ ] **DTOs/** TaskGroupDTO.cs, TaskGroupAddOrEditDTO.cs

#### Persistence/Operaciones/
- [ ] UserAndLogisticsConfigurations.cs, TasksConfiguration.cs, TaskOperationalConfigurations.cs, SolicitudCompraConfiguration.cs, RecepcionPipaAguaConfiguration.cs, PanicAlertConfiguration.cs, GoogleCalendarConfigurations.cs, CotizacionProveedorConfiguration.cs

#### Persistence/JuntasMensuales/
- [ ] JuntaMensualSessionConfigurations.cs, AsambleaConfigurations.cs

#### Persistence/Comite/
- [ ] ManualPasoResponsableConfiguration.cs, ManualPasoImagenConfiguration.cs, ManualPasoConfiguration.cs, ManualDiagramConfiguration.cs

#### Persistence/AccessControl/
- [ ] VisitorConfiguration.cs, VisitConfiguration.cs, InvitationConfiguration.cs, GuardShiftConfiguration.cs, AccessPointConfiguration.cs, AccessEventConfiguration.cs, AccessCredentialConfiguration.cs

#### Diagram/
- [ ] **Services/** DiagramDrawService.cs
- [ ] **Mapping/** DiagramDrawMapping.cs
- [ ] **Interfaces/** IDiagramDrawService.cs
- [ ] **Entities/** DiagramDraw.cs, DiagramDrawTargetRole.cs, DiagramDrawTargetCustomer.cs
- [ ] **Endpoints/** DiagramDrawEndpoints.cs
- [ ] **DTOs/** DiagramDrawDTO.cs, CreateDiagramDrawDTO.cs, UpdateDiagramDrawDTO.cs

#### PanicAlert/
- [ ] **Services/** PanicAlertNotificationService.cs, PanicAlertAppService.cs
- [ ] **Interfaces/** IPanicAlertNotificationService.cs, IPanicAlertAppService.cs
- [ ] **Entities/** PanicAlert.cs
- [ ] **EndPoints/** PanicAlertsEndpoints.cs
- [ ] **DTOs/** PanicAlertDTO.cs, PanicAlertCreateDTO.cs, PanicAlertResolveDTO.cs, PanicAlertRealTimeDTO.cs
- [ ] PanicAlertRoles.cs

#### Comite/Manuals/
- [ ] **Entities/** ManualTemplate.cs, ManualTemplateVersion.cs, ManualTemplateRole.cs, ManualTemplateCustomer.cs, ManualTemplateAttachment.cs, ManualPaso.cs, ManualPasoResponsable.cs, ManualPasoImagen.cs, ManualPasoEnlace.cs, ManualDiagram.cs

#### Comite/ComiteVigilancia/
- [ ] **Services/** ComiteVigilanciaAppService.cs
- [ ] **Mapping/** ComiteVigilanciaMapper.cs
- [ ] **Interfaces/** IComiteVigilanciaAppService.cs
- [ ] **Entities/** ComiteVigilancia.cs
- [ ] **EndPoints/** ComitesVigilanciaEndpoints.cs
- [ ] **DTOs/** ComiteVigilanciaSavedDTO.cs, CommitteeDirectoryDTO.cs, CommitteeDirectoryMemberDTO.cs, CommitteeDirectoryCustomerDTO.cs

#### DeliveryReception/
- [ ] **Services/** EntregaRecepcionDescripcionAppService.cs, EntregaRecepcionClienteAppService.cs, EntregaRecepcionAppService.cs, CatalogoEntregaRecepcionDescripcionAppService.cs
- [ ] **Mapping/** CatalogoEntregaRecepcionDescripcionMapper.cs
- [ ] **Interfaces/** IEntregaRecepcionDescripcionAppService.cs, IEntregaRecepcionClienteAppService.cs, IEntregaRecepcionAppService.cs, ICatalogoEntregaRecepcionDescripcionAppService.cs
- [ ] **Entities/** EntregaRecepcionDescripcion.cs, EntregaRecepcionCliente.cs, CatalogoEntregaRecepcionDescripcion.cs
- [ ] **EndPoints/** EntregaRecepcionEndpoints.cs, EntregaRecepcionDescripcionEndpoints.cs, EntregaRecepcionClienteEndpoints.cs

#### Owner/
- [ ] **Services/** OwnerAppService.cs
- [ ] **Mapping/** OwnerMapper.cs
- [ ] **Interfaces/** IOwnerAppService.cs
- [ ] **EndPoints/** OwnersEndpoints.cs

---

### 4. LegalLuxuryApp

#### SolicitudBajas/
- [ ] **Handlers/** RequestDismissalRequestedHandler.cs
- [ ] **Events/** RequestDismissalRequestedEvent.cs

#### RequestDismissals/
- [ ] **Services/** SolicitudBajaAppService.cs
- [ ] **Mapping/** RequestDismissalMapper.cs
- [ ] **Interfaces/** ISolicitudBajaAppService.cs
- [ ] **Entities/** RequestDismissal.cs, RequestDismissalIncident.cs, RequestDismissalFile.cs, RequestDismissalEvaluation.cs
- [ ] **EndPoints/** RequestDismissalEndPoints.cs
- [ ] **DTOs/** RequestDismissalDTO.cs, RequestDismissalListDTO.cs, RequestDismissalAddOrEditDTO.cs, RequestDismissalStatusUpdateDTO.cs, RequestDismissalSendRequestDTO.cs, RequestDismissalIncidentDTO.cs, RequestDismissalFileDTO.cs, RequestDismissalEvaluationDTO.cs, SolicitudBajaEmailDTO.cs

#### RequestDismissalDiscounts/
- [ ] **Services/** RequestDismissalDiscountAppService.cs
- [ ] **Mapping/** RequestDismissalDiscountMappingProfile.cs
- [ ] **Interfaces/** IRequestDismissalDiscountAppService.cs
- [ ] **Entities/** RequestDismissalDiscount.cs
- [ ] **EndPoints/** RequestDismissalDiscountEndPoints.cs
- [ ] **DTOs/** RequestDismissalDiscountDTO.cs, RequestDismissalDiscountAddOrEditDTO.cs, DiscountDescriptionDTO.cs

#### Legal/LegalReport/
- [ ] **Services/** LegalReportAppService.cs
- [ ] **Interfaces/** ILegalReportAppService.cs
- [ ] **EndPoints/** LegalReportEndPoints.cs

#### Legal/Fines/
- [ ] **Entities/** PropertyFine.cs, FineEvidence.cs

#### Legal/BoardDirectors/
- [ ] **Services/** IBoardDirectorsAppService.cs, BoardDirectorsAppService.cs
- [ ] **Repositories/** BoardDirectorsAppService.cs
- [ ] **EndPoints/** BoardDirectorsEndPoints.cs
- [ ] **DTOs/** BoardDirectorsDocumentDTO.cs

#### Legal/ContractPolicy/
- [ ] **Services/** ContratoPolizaAppService.cs
- [ ] **Mapping/** PolicyContractMapper.cs
- [ ] **Interfaces/** IContratoPolizaAppService.cs
- [ ] **Entities/** ContratoPoliza.cs
- [ ] **EndPoints/** PolicyContractEndPoints.cs
- [ ] **DTOs/** ContratoPolizaDTO.cs, ContratoPolizaAddOrEditDTO.cs

#### Legal/LegalDirectories/
- [ ] **EndPoints/** LegalDirectoriesEndPoints.cs

#### Legal/LegalMinuta/
- [ ] **EndPoints/** LegalMinutaEndPoints.cs

#### Legal/LegalMatter/
- [ ] **Services/** LegalMatterCategoryAppService.cs, LegalMatterAppService.cs
- [ ] **Interfaces/** ILegalMatterCategoryAppService.cs, ILegalMatterAppService.cs
- [ ] **Entities/** LegalMatter.cs, LegalMatterCategory.cs, RegulationArticle.cs, PolicySnapshot.cs, ResponsiblePartySnapshot.cs
- [ ] **EndPoints/** LegalMatterEndPoints.cs
- [ ] **DTOs/** LegalMatterDTO.cs, LegalMatterCategoryAddOrEditDTO.cs, LegalMatterCategoryWithMattersDTO.cs, LegalMatterAddDTO.cs

#### Employees/
- [ ] **Services/** LegalEmployeeAppService.cs
- [ ] **Interfaces/** ILegalEmployeeAppService.cs
- [ ] **EndPoints/** LegalEmployeesEndPoints.cs
- [ ] **DTOs/** LegalEmployeeDTO.cs

---

## FRONTEND

### 1. reclutamiento.luxuryapp

#### work-position/
- [ ] **Componentes/** work-position-list.ts, work-position-form.ts, work-position-details.ts, work-position-hours.ts, job-description-form.ts
- [ ] **Interfaces/** work-position.model.ts

#### solicitud-vacante/
- [ ] **Componentes/** vacantes-list.ts, vacante-form.ts, vacante-detail-modal.ts, solicitud-vacante-form.ts, register-employe-to-vacancy.html
- [ ] **DTOs/** WorkPositionDetailDTO.ts, DiaDeTrabajoDTO.ts

#### solicitud-modificacion-sueldo/
- [ ] **Componentes/** solicitud-modificacion-list.ts, solicitud-modificacion-salario-form.ts, modificacion-salario-form.ts, status-request-salary-modification.ts, status-request-salary-modification-form.ts

#### solicitud-baja/
- [ ] **Componentes/** solicitud-baja-list.ts, solicitud-baja-form.ts, solicitud-baja-update-status.ts, status-request-dismissal.ts

#### solicitud-alta/
- [ ] **Componentes/** solicitud-alta-list.ts, solicitud-alta-form.ts, solicitud-alta-status-form.ts
- [ ] **DTos/** request-employee-register-add-or-edit.dto.ts, request-employee-register-basic-info.dto.ts, request-employee-register-get-by-id.dto.ts, request-employee-register-update-status.dto.ts
- [ ] **Components/hiring-document-validation/** hiring-document-validation.ts, hiring-document-validation-modal.ts
- [ ] **Components/duplicate-employee-warning/** duplicate-employee-warning-modal.ts

#### recruitment-shell/
- [ ] **Componentes/** recruitment-shell.ts

#### recruitment-shared/
- [ ] **Componentes/** request-status-style.ts, mapped-p-tag.ts, candidate-stage-timeline.ts, candidate-stage-labels.ts, candidate-stage-badge.ts, candidate-photo-upload.ts, candidate-decision-labels.ts, candidate-cv-upload.ts, agenda-status-tag-options.ts

#### recruitment-agenda-list/
- [ ] recruitment-agenda-list.ts

#### reclutamiento-y-altas-bajas/
- [ ] **Componentes/** employee-reclutamiento.ts
- [ ] **Sub-modulos/** recruitment-staff-board/, recruitment-client-requests/, reclutamiento-solicitudes/, request-dismissal-discount/
- [ ] **recruitment-staff-board/** recruitment-staff-board.ts, employee-form.ts, employee-unified-profile-form.ts
- [ ] **recruitment-client-requests/** solicitudes-cliente-list.ts
- [ ] **reclutamiento-solicitudes/** recruitment-requests.shell.ts, recruitment-requests.routing.ts, filter-requests.ts
- [ ] **request-dismissal-discount/** status-request-dismissal-discount-form.ts

#### candidate-work-position-candidates/
- [ ] candidate-work-position-candidates.ts

#### candidate-recruitment-interviews/
- [ ] candidate-recruitment-schedule-modal.ts

#### Routing
- [ ] recruitment.routing.ts, candidates.routing.ts

#### Docs/
- [ ] setup.md, README.md, decisiones.md, 20260811-fase1-inventario-frontend-candidates.md

---

### 2. recursos-humanos.luxuryapp

#### recursos-humanos-admin/
- [ ] **sanction-type-list/** sanction-type-list.ts, sanction-type-form.ts, interfaces/sanction-type-form.interface.ts
- [ ] **incident-type-list/** incident-type-list.ts, incident-type-form.ts, interfaces/incident-type-form.interface.ts

#### expediente-del-empleado/recursos-humanos/

##### work-contract/
- [ ] work-contract-list.ts, work-contract-form.ts, work-contract-detail.ts
- [ ] **Interfaces/** work-contract.dto.ts

##### vacation-request-approval/
- [ ] vacacion-solicitud-detalle.ts

##### vacation-balance-admin/
- [ ] vacaciones-saldo.ts, vacaciones-admin-auditoria.ts

##### shared/
- [ ] modal-approval-detail.ts, modal-approval-confirmation.ts, generic-approval-panel.ts, approval-info.service.ts

##### past-vacations/
- [ ] vacaciones-pasadas-registro.ts

##### panel-aprobaciones/
- [ ] panel-aprobaciones.ts
- [ ] **State/** approval-state.service.ts

##### nomina/tiempo-extra/
- [ ] tiempo-extra.ts
- [ ] **Modal/** modal-tiempo-extra-add.ts

##### nomina/prestamos-empleado/
- [ ] prestamos-empleado.ts
- [ ] **Modal-prestamo-detalle/** modal-prestamo-detalle.ts
- [ ] **Modal-prestamo-add/** modal-prestamo-add.ts

##### nomina/periodos-nomina/
- [ ] periodos-nomina.ts
- [ ] **Modal-periodo-add/** modal-periodo-add.ts
- [ ] **Modal-dias-no-habiles/** modal-dias-no-habiles.ts

##### nomina/nominas/
- [ ] nominas.ts
- [ ] **Modal-generar-nomina/** modal-generar-nomina.ts

##### nomina/nomina-detalle/
- [ ] nomina-detalle.ts
- [ ] **Modal-editar-empleado-nomina/** modal-editar-empleado-nomina.ts

##### nomina/nomina-dashboard/
- [ ] nomina-dashboard.ts

##### nomina/interfaces/
- [ ] tiempo-extra.interface.ts, prestamo-empleado.interface.ts, periodo-nomina.interface.ts, nomina-encabezado.interface.ts, nomina-detalle.interface.ts, incidencia-nomina.interface.ts, hoja-incidencias.interface.ts, evidencia-nomina.interface.ts, configuracion-nomina.interface.ts

##### nomina/incidencias-nomina/
- [ ] incidencias-nomina.ts
- [ ] **Modal-incidencia-add/** modal-incidencia-add.ts

##### nomina/hoja-incidencias/
- [ ] hoja-incidencias.ts

##### nomina/evidencias-nomina/
- [ ] evidencias-nomina.ts

##### nomina/configuracion-nomina/
- [ ] configuracion-nomina.ts

##### my-vacation-requests/
- [ ] vacaciones-form.ts, mis-vacaciones-listado.ts

##### motivo-rechazo-formulario/
- [ ] motivo-rechazo-formulario.ts

##### leave-request-approval/
- [ ] permiso-detalle-aprobar.ts

##### leave-request/
- [ ] permiso-form.ts, mis-permisos-listado.ts, mi-permiso-detalle.ts

##### interfaces/
- [ ] vacation-request.interface.ts

#### Routing
- [ ] hr.routing.ts

---

### 3. operations.luxuryapp

#### templates/
- [ ] templates-list.ts, templates-form.ts

#### initial-implementation/
- [ ] **staff-evaluation/** staff-evaluation.ts
- [ ] **pending-vendor-projects/** pending-vendor-projects.ts
- [ ] **machinery-survey/** machinery-survey.ts
- [ ] **active-policies/** active-policies.ts
- [ ] initial-implementation.routing.ts

#### task-engine/tasks/
- [ ] **work-group/** task-group-list.ts, task-group-form.ts
- [ ] **task.service.ts** task.service.ts
- [ ] **task-status/** task-status.ts
- [ ] **task-report-actions/** task-report-actions.ts
- [ ] **task-reopen.ts** task-reopen.ts
- [ ] **task-read-list.ts** task-read-list.ts
- [ ] **task-program.ts** task-program.ts
- [ ] **task-message-status.enum.ts** task-message-status.enum.ts
- [ ] **task-message/** task-view.ts, task-report.ts, task-pending-board.ts, task-list.ts, task-form.ts
- [ ] **task-message/task-justification-panel/** task-justification-panel.ts
- [ ] **task-message/task-checklist-panel/** task-checklist-panel.ts

#### custom-documents/custom-document/
- [ ] special-document-list.ts, reglamentos-list.ts, asambleas-list.ts, acta-constitutiva-list.ts
- [ ] **policy-contract/** policy-contract-list.ts, policy-contract-form.ts, policy-contract.interface.ts

#### google-calendar/google-calendar/
- [ ] google-calendar.ts, google-calendar-form.ts, google-calendar-detail.ts

#### google-calendar/calendar/reuniones-comite/
- [ ] reuniones-comite.ts

#### announcements/announcement/
- [ ] announcement-list.ts, announcement-detail.ts, announcement-analytics.ts, announcement-admin-list.ts, announcement-admin-form.ts, announcement.model.ts
- [ ] **image-generation-dialog/** image-generation-dialog.ts

#### Routing
- [ ] operations.routing.ts (implícito)

---

### 4. legal.luxuryapp

#### employees-contracts/
- [ ] legal-staff-board.ts
- [ ] **Services/** legal-employee.service.ts

#### comite-vigilancia/
- [ ] comites-list.ts, comite-vigilancia-list.ts, comite-vigilancia-form.ts

#### asuntos-legales-y-seguros/

##### ticket-legal/
- [ ] ticket-legal-lista.ts, ticket-legal-lista-cliente.ts, ticket-legal-individual.ts, ticket-legal-form.ts, ticket-legal-form-cliente.ts, ticket-legal-editar.ts, ticket-legal-actualizar-estado.ts
- [ ] ticket-legal-seguimiento.ts, ticket-legal-seguimiento-solicitud-detalle.ts, ticket-legal-seguimiento-cliente.ts
- [ ] ticket-legal-reportes-pendientes.ts, ticket-legal-reportes-internos.ts, ticket-legal-reportes-externos.ts

##### minutas/
- [ ] legal-pendientes-minuta.ts

##### interfaces/
- [ ] documentTypeRoutesConfig.ts, document-type.enum.ts

##### asunto-legal/
- [ ] asunto-legal-lista.ts, asunto-legal-form.ts, categoria-asunto-legal-form.ts

##### documento-personalizado/
- [ ] documento-personalizado-lista.ts, documento-personalizado-form.ts

##### committee/
- [ ] committee.routing.ts
- [ ] **poliza-seguro-edificio/** poliza-seguro-edificio.ts
- [ ] **home-committee/** home-comite.ts
- [ ] **board-directors-monthly-meetings/** reuniones-mensuales-consejo-directivo.ts
- [ ] **board-directors-meeting-minutes/** minutas-reuniones-consejo-directivo.ts, minutas-reuniones-consejo-directivo-detalle.ts
- [ ] **board-directors-library/** biblioteca-consejo-directivo.ts, biblioteca-consejo-directivo-detalle.ts
- [ ] **board-directors-financial-reports/** informes-financieros-consejo-directivo.ts

#### Routing
- [ ] legal.routing.ts
