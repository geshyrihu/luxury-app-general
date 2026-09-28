const fs = require('fs');
const path = require('path');

const BACKEND_ROOT = 'D:\\repos\\luxuryapp-api\\api\\LuxuryApp.Application\\Modules';
const OUTPUT_CSV = 'D:\\repos\\luxuryapp-api\\auditorias\\matriz-validacion-submodulos-v3.csv';

const modules = [
  'AdminLuxuryApp',
  'AuthLuxuryApp',
  'CobranzaLuxuryApp',
  'CommitteeLuxuryApp',
  'ComprasLuxuryApp',
  'ContabilidadLuxuryApp',
  'DireccionLuxuryApp',
  'LegalLuxuryApp',
  'MantenimientoLuxuryApp',
  'OperationsLuxuryApp',
  'ReclutamientoLuxuryApp',
  'RecursosHumanosLuxuryApp',
  'SupplierLuxuryApp',
  'SystemLuxuryApp'
];

const moduleLabels = {
  AdminLuxuryApp: 'Admin',
  AuthLuxuryApp: 'Auth',
  CobranzaLuxuryApp: 'Cobranza',
  CommitteeLuxuryApp: 'Committee',
  ComprasLuxuryApp: 'Compras',
  ContabilidadLuxuryApp: 'Contabilidad',
  DireccionLuxuryApp: 'Direccion',
  LegalLuxuryApp: 'Legal',
  MantenimientoLuxuryApp: 'Mantenimiento',
  OperationsLuxuryApp: 'Operations',
  ReclutamientoLuxuryApp: 'Reclutamiento',
  RecursosHumanosLuxuryApp: 'RRHH',
  SupplierLuxuryApp: 'Supplier',
  SystemLuxuryApp: 'System'
};

function getSubmoduleType(name) {
  const technical = /^(Persistence|Shared|SharedLuxuryApp|DTOs|Dto|Services|EndPoints|Endpoints|Interfaces|Helpers|SubServices|Mappings|Mapping|Entities|Common|Docs|Responses|Integrations|Events|Handlers|ViewModels|AgendaSemanal|ContratosLegal|PersonalAusente|ReclutamientoResumen|TareasLegal|HRIncident|HRIncidentReport|HrSanction|IncidentType|SanctionType|Asamblea|Backfill|Minuta|Notifications|Presentacion|Session|Supervision|SupervisionReport|TaskAttachment|TaskChecklist|TaskFollowUp|TaskJustification|TaskLegal|TaskMessageRead|TaskReport|Tasks|TaskWorkPlan|WorkGroup|WorkGroupCategories|WorkGroupMember|RecurringTaskAlerting|RecurringTaskCatalog|RecurringTaskCompliance|RecurringTaskEscalation|RecurringTaskGeneration|AuditEntries|Catalogs|DatabaseBackup|AiChat|AiKnowledgeBase|ElevenLabs|LogApp|UserActivityHistory|AiAssistant|Notification|ComiteVigilancia|Manuals|EmployeeBirthday|EmployeeOnboardingChecklist|EmployeeOrganigrama|Employees|AppImplementationTracking|Jobs|SignalRTest|UpdateDataBase|UserValidation|Access|CustomerAddress|CustomerDataCompany|CustomerImage|CustomerLocations|CustomerModul|Customers|ModuleApps|MeasurementUnit|GeneralCatalogs|EmailData|TelefonosEmergencia|UsoCfdi|WorkPositionSchedule|InventoryEngine|KeyInventory|LightingInventory|PaintInventory|RadioComunicacion|Tools|Operaciones|Diagramas|Flujos|Plantillas|Configuraciones|Permisos|Roles|Usuarios|Bitacoras|Reportes|Alertas|Notificaciones|Configuracion|Diagnostico|Auditoria|Sistema|Tenant|Email|Approval|Common|SelectItem|SystemAI|AuditLogs|SendEmail|Recruitment)$/;
  if (technical.test(name)) return 'Tecnico';
  const domain = /^(Candidates?|Employees?|WorkPositions?|Properties?|Owners?|Suppliers?|Tenants?|Contracts?|Invoices?|Comite|Directorio|Profile|Dashboard|Notifications?|Recruitment|Solicitudes|PurchaseOrders?|Historial|Presupuesto|Fondeos|Reports?|Catalogs?|Configuracion|Seguridad|Auth|Identity|Password|Recovery|Maintenance|Equipment|Fire|Elevator|Hydrant|Smoke|Tool|Piscina|Recepcion|Pipas|Calendario|Maestro|Equipo|Inspection|Log|Inventory|Medidores|Machinery|Asset|Document|Manual|CallPoint|Emergency|ServiceOrder|Tasks|Supervision|Announcement|Panic|AccessControl|Custom|Delivery|Reception|Property|Occupant|Resumen|Scheduled|GoogleCalendar|Recurring|Diagnostics|AuditLogs|SystemAI|Tenant|SendEmail|Approvals?|Common|SelectItem|Bank|PaymentMethod|Cfdi|Checklist|Template|Address|DataCompany|Locations|ModuleApp|Calendars?|Schedule|Budget|Expense|Funding|Accounting|Contabilidad|Aspel|Espejo|Financial|Projected|GeneralLedger|Ar|Budgeting|FondeosYReporteo|Mock|Provider|Qualification|Purchase|Pr|Po|Customer|Product|ProviderSupport|Legal|Insurance|Committee|Board|Director|Meeting|Minutes|Monthly|FinancialReport|Library|Home|ProfileUsers|AccountRecovery|RecoveryCode|RecoveryPassword|ResetPassword|UserProfile|Chekador|Evaluacion|ManualsAndProcesses|Nomina|TimeOff|Public|EmergencyPhone|OwnerProperty|PropertyOwner|Resident|Web|AccountingWeb|HrWeb|Landing|LegalWeb|MaintenanceWeb|OperationsWeb)$/;
  if (domain.test(name)) return 'Principal';
  return 'Interno';
}

const allSubmodules = {};

for (const module of modules) {
  const modulePath = path.join(BACKEND_ROOT, module);
  if (!fs.existsSync(modulePath)) continue;

  const entries = fs.readdirSync(modulePath, { withFileTypes: true });
  const level1Dirs = entries.filter(e => e.isDirectory() && e.name !== 'Docs');

  for (const sub1 of level1Dirs) {
    const sub1Name = sub1.name;
    const sub1Type = getSubmoduleType(sub1Name);

    if (!allSubmodules[sub1Name]) {
      allSubmodules[sub1Name] = { locations: {}, type: sub1Type, level: 1 };
    }
    allSubmodules[sub1Name].locations[module] = true;

    const sub1Path = path.join(modulePath, sub1Name);
    const entries2 = fs.readdirSync(sub1Path, { withFileTypes: true });
    const level2Dirs = entries2.filter(e => e.isDirectory() && e.name !== 'Docs');

    for (const sub2 of level2Dirs) {
      const sub2Name = sub2.name;
      const sub2Type = getSubmoduleType(sub2Name);

      if (!allSubmodules[sub2Name]) {
        allSubmodules[sub2Name] = { locations: {}, type: sub2Type, level: 2 };
      }
      allSubmodules[sub2Name].locations[module] = true;
    }
  }
}

const domainSubmodules = Object.keys(allSubmodules)
  .filter(name => allSubmodules[name].type !== 'Tecnico')
  .sort((a, b) => a.localeCompare(b));

const headers = ['Submodulo', 'Nombre en español', 'Tipo', 'Nivel', ...modules.map(m => moduleLabels[m] || m)];

function escapeCsv(value) {
  const str = String(value ?? '');
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

const lines = [headers.map(escapeCsv).join(',')];

for (const sub of domainSubmodules) {
  const data = allSubmodules[sub];
  const row = [
    escapeCsv(sub),
    escapeCsv(''),
    escapeCsv(data.type),
    escapeCsv(data.level),
    ...modules.map(m => data.locations[m] ? 'SI' : '')
  ];
  lines.push(row.join(','));
}

const folder = path.dirname(OUTPUT_CSV);
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}

fs.writeFileSync(OUTPUT_CSV, lines.join('\n') + '\n', 'utf8');

console.log('✅ CSV generado en: ' + OUTPUT_CSV);
console.log('   Total filas: ' + domainSubmodules.length + ' submodulos de dominio');
console.log('   Columnas: 14 modulos + Tipo + Nivel + Nombre en español');
console.log('   Abrir con Excel, completar "Nombre en español" y marcar SI donde corresponda.');
