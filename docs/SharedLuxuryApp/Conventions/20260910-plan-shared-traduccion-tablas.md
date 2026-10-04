# Diccionario de Traducción de Tablas (Fase 1)

Aquí tienes la propuesta oficial de traducción para las 47 tablas. He aplicado reglas estrictas de gramática inglesa, respetando los sustantivos incontables (*mass nouns* como Equipment, Stock, Data, History) para evitar aberraciones como Equipments o Datas.

| Entidad C# actual | Tabla SQL actual | Tabla SQL propuesta (Inglés Plural / Incontable) |
|---|---|---|
| CatalogPurchaseOrderBudget | PurchaseOrderBudgetTypes | **PurchaseOrderBudgetTypes** (Ya plural) |
| PurchaseOrderBudget | PurchaseOrderBudgets | **PurchaseOrderBudgets** (Ya plural) |
| ElevatorSparePartsChange | ElevatorSparePartsChange | **ElevatorSparePartsChanges** |
| EquipmentInspectionCriterion | EquipmentInspectionCriteria | **EquipmentInspectionCriteria** (Criteria ya es plural) |
| Equipment | Equipment | **Equipment** (Incontable, no lleva 's') |
| MaintenanceCalendar | MaintenanceCalendar | **MaintenanceCalendars** |
| BitacoraMantenimiento | BitacoraMantenimiento | **MaintenanceLogs** |
| Medidor | Medidor | **Meters** |
| MedidorLectura | MedidorLectura | **MeterReadings** |
| Piscina | Piscina | **Pools** |
| PiscinaBitacora | PiscinaBitacora | **PoolLogs** |
| RecepcionPipaAgua | RecepcionPipaAgua | **WaterTruckDeliveries** |
| ControlPrestamoHerramienta | ControlPrestamoHerramienta | **ToolLoans** |
| ComiteVigilancia | ComiteVigilancia | **VigilanceCommittees** |
| CatalogoEntregaRecepcionDescripcion| DeliveryCriteria | **DeliveryCriteria** |
| InspectionReviewsCatalog | InspectionCriteria | **InspectionCriteria** |
| InventarioIluminacion | LightingStock | **LightingStock** (Incontable) |
| InventarioLlave | KeyInventory | **KeyInventory** (Incontable) |
| InventarioPintura | PaintStock | **PaintStock** (Incontable) |
| StockPorAlmacen | WarehouseStock | **WarehouseStock** (Incontable) |
| UnidadMedida | UnitsOfMeasure | **UnitsOfMeasure** (Ya plural) |
| AsambleaSupportRequest | AssemblySupport | **AssemblySupportRequests** |
| CandidateStageHistory | RecruitmentCandidateStageHistory | **RecruitmentCandidateStageHistory** (Incontable) |
| EmployeeBankData | EmployeeBankData | **EmployeeBankData** (Incontable) |
| EmployeeBeneficiary | EmployeeBeneficiary | **EmployeeBeneficiaries** |
| EmployeeClinicalData | EmployeeClinicalData | **EmployeeClinicalData** (Incontable) |
| PersonData | EmployeePersonData | **EmployeePersonData** (Incontable) |
| OrgHierarchy | OrganizationHierarchy | **OrganizationHierarchies** |
| EmployeeExternal | ExternalStaff | **ExternalStaff** (Incontable) |
| InterviewerMatrix | RecruitmentInterviewerMatrix | **RecruitmentInterviewerMatrices** |
| JobDescription | JobDescriptions | **JobDescriptions** (Ya plural) |
| RecruitmentSourceCatalog | RecruitmentSourceCatalogs | **RecruitmentSourceCatalogs** (Ya plural) |
| RegistroChecador | RegistrosChecador | **TimeClockRecords** |
| SedeChecador | SedesChecador | **TimeClockLocations** |
| EvidenciaNomina | PayrollEvidence | **PayrollEvidence** (Incontable) |
| LeaveRequestHistory | LeaveRequestHistory | **LeaveRequestHistory** (Incontable) |
| VacationRequestHistory | VacationRequestHistory | **VacationRequestHistory** (Incontable) |
| QualificationProvider | ProviderRatings | **ProviderRatings** (Ya plural) |
| CategoryProvider | ProviderCategories | **ProviderCategories** (Ya plural) |
| PersonProviderSupport | PersonProviderSupport | **PersonProviderSupports** |
| Provider | Provider | **Providers** |
| Credential | *(Sin tabla)* | **Credentials** |

