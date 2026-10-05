# 📊 ANÁLISIS EXHAUSTIVO: MÓDULO PRESUPUESTO PROPUESTA

**Versión:** 1.0 | **Fecha:** 2026-09-03 | **Estado:** ✅ COMPLETO Y FUNCIONAL

---

## 🎯 RESUMEN EJECUTIVO

El módulo **Presupuesto Propuesta** es un sistema integral de gestión presupuestal que permite a los clientes crear, editar y analizar propuestas de presupuesto para años fiscales futuros. Funciona bajo una arquitectura **frontend-backend desacoplada** con sincronización en **tiempo real via SignalR**.

### Características Principales

- ✅ Gestión completa CRUD de partidas presupuestarias
- ✅ Sincronización en tiempo real con múltiples usuarios
- ✅ Integración automática con datos Aspel (históricos y presupuestarios)
- ✅ Cálculos inteligentes de promedios, déficit e incrementos
- ✅ Comparación de cuotas de mantenimiento (fija e indiviso)
- ✅ Auditoría y proyección con IA
- ✅ Gestión de archivos de soporte (PDF)
- ✅ Exportación a Excel
- ⚠️ **ESTADO CRÍTICO:** Módulo 100% funcional, modificaciones requieren autorización del Ing. Ricardo Marques

---

## 📁 ESTRUCTURA DE CARPETAS

### Frontend (Angular)

```
presupuesto-propuesta/
├── presupuesto-propuesta.ts              # Componente principal (1523 líneas)
├── presupuesto-propuesta.html            # Template
├── excel-export.service.ts               # Exportación a Excel
├── interfaces/
│   ├── budget-proposal.model.ts          # DTOs principales
│   ├── IAvailableAccountDto.ts
│   └── indiviso-fee-comparison.model.ts
├── budget-rule-list/                     # Componente de reglas
│   ├── budget-rule-form.ts
│   └── budget-rule-list.ts
├── Modales y Diálogos:
│   ├── budget-audit-dialog.ts/html       # Auditoría IA
│   ├── budget-forecast-dialog.ts/html    # Proyecciones
│   ├── budget-history-dialog.ts/html     # Historial cambios
│   ├── budget-support-dialog.ts/html     # Gestión archivos
│   ├── budget-execution-details-modal.ts # Detalles ejecución
│   ├── account-modal-add.ts/html         # Agregar cuentas
│   ├── fee-comparison-by-fija.ts/html    # Cuota fija
│   └── modal-fee-comparison-by-indiviso.ts # Cuota indiviso
├── doc/
│   ├── ANALISIS_EXHAUSTIVO.md            # Este análisis
│   ├── log.md                            # Bitácora de cambios
│   └── report.md                         # Reporte anterior
└── Muestras de datos:
    ├── respuestaprespuesto.json
    └── respuestaprespuesto.txt
```

### Backend (.NET)

```
PresupuestoPropuesta/
├── DTOs/ (15 archivos)
│   ├── BudgetProposalDTO.cs              # Propuesta principal
│   ├── BudgetProposalItemDTO.cs          # Partida individual
│   ├── CreateBudgetProposalDTO.cs        # Crear nueva
│   ├── UpdateProposalItemDTO.cs          # Actualizar monto
│   ├── BudgetAuditDTO.cs                 # Auditoría IA
│   ├── BudgetForecastRequestDTO.cs       # Proyecciones
│   ├── AvailableAccountDTO.cs            # Cuentas disponibles
│   ├── UniformFeeComparisonDTO.cs        # Cuota fija
│   ├── IndivisoFeeComparisonDTO.cs       # Cuota indiviso
│   ├── ProjectedExpenseItemDTO.cs        # Ejecuciones
│   ├── PropertyIndivisoDetailDTO.cs      # Detalle indiviso
│   ├── BudgetProposalItemHistoryDTO.cs   # Historial
│   ├── BudgetProposalItemSupportDetailsDTO.cs
│   ├── BudgetProposalItemSupportFileDTO.cs
│   └── AddBudgetProposalItemSupportFilesDTO.cs
├── Services/
│   ├── BudgetProposalService.cs          # Lógica principal (1016 líneas)
│   └── BudgetProposalItemSupportService.cs # Gestión archivos (141 líneas)
├── Endpoints/
│   ├── BudgetProposalEndPoints.cs        # 10+ endpoints
│   └── BudgetProposalItemSupportEndpoints.cs
├── Interfaces/
│   ├── IBudgetProposalService.cs
│   └── IBudgetProposalItemSupportService.cs
├── Mapping/
│   └── BudgetProposalProfile.cs          # AutoMapper
└── Docs/
    ├── documentacion-presupuesto-propuesta.md
    ├── reglas-negocio-presupuesto-propuesta.md (79 líneas)
    └── response.json
```

---

## 🔄 FLUJO GENERAL DE DATOS

### 1️⃣ INICIALIZACIÓN: Carga de Propuesta

```
┌─────────────────────────────────────────┐
│ Usuario abre componente                 │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ effect() dispara onLoadData()           │
│ Parámetros:                             │
│  - customerId (del servicio)            │
│  - selectedFiscalYear (default = 2026)  │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ GET /api/budget-proposal?              │
│  customerId=X&fiscalYear=2026           │
└─────────────────────────────────────────┘
         ↓ (BACKEND)
┌─────────────────────────────────────────┐
│ BudgetProposalService.GetProposalsAsync │
│                                         │
│ baseBudgetYear = 2026                   │
│ targetProposalYear = 2027               │
└─────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│ ¿Propuesta ya existe para 2027?         │
├──────────────────────────────────────────┤
│ SÍ: Actualizar existente                │
│  → Elimina cuentas extraordinarias      │
│  → Sincroniza CurrentAmount desde Aspel │
│  → Mantiene ProposedAmount              │
│                                          │
│ NO: Crear nueva                         │
│  → Obtiene presupuesto Aspel 2026       │
│  → Filtra extraordinarios/proyectos     │
│  → Crea items con CurrentAmount base    │
│  → ProposedAmount = CurrentAmount       │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│ Enriquecimiento Final (Gastos Mensuales) │
│                                          │
│ Para cada partida:                       │
│  - Obtiene gastoEnero...gastoDiciembre   │
│  - Obtiene presupuestoEnero...Dec        │
│  - Mapea BudgetExecution → proyecciones │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│ Response: BudgetProposalDTO             │
│ {                                        │
│   id, customerId, name, fiscalYear,     │
│   status, totalAmount, createdDate,     │
│   items: BudgetProposalItemDTO[],       │
│   projectedExpenseItems                 │
│ }                                        │
└──────────────────────────────────────────┘
         ↓ (FRONTEND)
┌──────────────────────────────────────────┐
│ currentProposal.set(response)            │
│ allProposalItems.set(response.items)     │
│ originalProposalItems = copy             │
│ projectedExpenseItems = Map{key→id}      │
│                                          │
│ Inicializa flags:                        │
│  - hasExtraordinarios                    │
│  - hasProyectos                          │
│  - selectedMonthsForAvg                  │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│ applyFilters()                           │
│ → proposalItems = filtrada               │
│                                          │
│ autoSelectMonthsWithExpenses()           │
│ → Detecta hasta qué mes hay gastos       │
│                                          │
│ SignalR.joinProposalGroup()              │
│ → Se suscribe a cambios en tiempo real   │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│ TABLA RENDERIZADA CON DATOS              │
└──────────────────────────────────────────┘
```

### 2️⃣ EDICIÓN: Cambio de Monto Propuesto

```
Usuario edita input "PSTO PROPUESTO"
         ↓
onProposedAmountChange(item)
  • item.proposedAmount = nuevo valor
  • item.difference = proposedAmount - currentAmount
  • item.percentageIncrease = cálculo (con edge cases)
  • recalculateTotals()
         ↓
updateProposalItem(item)
  ↓ (Verifica cambio respecto a original)
  Si cambió:
         ↓
PUT /api/budget-proposal/{itemId:guid}
{
  "proposedAmount": 5000.00,
  "excludedConnectionId": "signal-r-conn-id"
}
         ↓ (BACKEND)
BudgetProposalService.UpdateProposalItemAsync()
  • Verifica: Propuesta en Draft
  • Crea BudgetProposalItemHistory
  • Actualiza item.ProposedAmount
  • Recalcula proposal.TotalAmount (sum no agrupadoras)
  • await dbContext.SaveChangesAsync()
  • Enriquece DTO con datos Aspel
  • Emite SignalR a grupo
         ↓
Response: BudgetProposalItemDTO (actualizado)
         ↓ (FRONTEND)
proposalItems.update() → actualiza fila
originalProposalItems[index] = nuevo
recalculateTotals()
         ↓
TABLA REFLEJA CAMBIO (sin reload)

          ↙ (Otros usuarios via SignalR)
┌─────────────────────────────┐
│ budgetProposalItemUpdate$   │
│   Toast: "Cuenta actualizada!│
│   601-001-001 | $5000"      │
│ allProposalItems.update()   │
│ Tabla se refresca            │
└─────────────────────────────┘
```

### 3️⃣ ELIMINACIÓN: Borrar Partida

```
Usuario hace click en 🗑️
         ↓
canDeleteItem(item)
  Valida: todos los meses (gasto + presupuesto) = 0
  Si FALSE → No muestra botón
         ↓
deleteItem(item)
  • Swal.fire() confirmación
  • Usuario confirma "Sí, eliminar"
         ↓
DELETE /api/budget-proposal/item/{itemId:guid}
         ↓ (BACKEND)
BudgetProposalService.DeleteProposalItemAsync()
  • Verifica: item existe
  • Verifica: propuesta en Draft
  • Consulta Aspel: ¿tiene actividad?
    - if (cualquier mes > 0) → throw "ACCOUNT_HAS_ACTIVITY"
    - if (item.CurrentAmount ≠ 0) → throw
  • Si validación OK:
    - Elimina historial de cambios
    - Elimina item
    - proposal.TotalAmount -= item.ProposedAmount
    - await SaveChangesAsync()
         ↓
Response: bool (true)
         ↓ (FRONTEND)
allProposalItems.update() → filtra item eliminado
applyFilters()
recalculateTotals()
currentProposal.totalAmount -= item.proposedAmount
         ↓
Swal toast: "Eliminado correctamente"
```

---

## 📋 MODELOS DE DATOS COMPLETOS

### BudgetProposalDTO

```csharp
public record BudgetProposalDTO : GuidIdEntityDTO
{
    public Guid CustomerId { get; set; }
    public string Name { get; set; }           // "Propuesta Presupuesto 2027"
    public int FiscalYear { get; set; }        // 2027
    public string Status { get; set; }         // "Draft" | "Approved" | "Rejected"
    public decimal TotalAmount { get; set; }   // Suma items no agrupadores
    public DateTime CreatedDate { get; set; }
    public List<BudgetProposalItemDTO> Items { get; set; } = [];
    public List<ProjectedExpenseItemDTO> ProjectedExpenseItems { get; set; } = [];
}
```

### BudgetProposalItemDTO (Partida)

```csharp
public class BudgetProposalItemDTO
{
    public Guid Id { get; set; }
    public Guid BudgetProposalId { get; set; }
    public string AccountNumber { get; set; }       // "601-001-001"
    public string AccountName { get; set; }         // "Servicios de Limpieza"
    public int NivelCuenta { get; set; }           // 1, 2, 3 (jerarquía)
    public string CuentaPadre { get; set; }        // "601-001"
    public string ProviderName { get; set; }       // Proveedor
    public string Comment { get; set; }            // Notas
    public bool EsFilaAgrupadora { get; set; }     // ¿Es subtotal?

    // MONTOS CLAVE
    public decimal CurrentAmount { get; set; }     // Base año anterior
    public decimal ProposedAmount { get; set; }    // Propuesta nuevo año
    public decimal Difference { get; set; }        // ProposedAmount - CurrentAmount
    public decimal PercentageIncrease { get; set; } // % cambio

    // GASTOS 12 MESES (año base, desde Aspel)
    public decimal GastoEnero { get; set; }
    public decimal GastoFebrero { get; set; }
    // ... (10 más)
    public decimal GastoDiciembre { get; set; }

    // PRESUPUESTO 12 MESES (año base)
    public decimal PresupuestoEnero { get; set; }
    // ... (11 más)
    public decimal PresupuestoDiciembre { get; set; }

    // ARCHIVOS
    public List<BudgetProposalItemSupportFileDTO> Files { get; set; } = [];
}
```

### UniformFeeComparisonDTO

```csharp
public class UniformFeeComparisonDTO
{
    public decimal CurrentTotalBudget { get; set; }  // Presupuesto actual anual
    public decimal NewTotalBudget { get; set; }      // Presupuesto propuesto anual
    public int PropertyCount { get; set; }           // Cantidad propiedades
    public decimal CurrentMonthlyFee { get; set; }   // CurrentTotal / 12 / count
    public decimal NewMonthlyFee { get; set; }       // NewTotal / 12 / count
}
```

### IndivisoFeeComparisonDTO

```csharp
public class IndivisoFeeComparisonDTO
{
    public decimal CurrentTotalBudget { get; set; }
    public decimal NewTotalBudget { get; set; }
    public decimal TotalIndivisoPercentage { get; set; }  // Sum de Property.IndivisoPercentage
    public decimal CurrentMonthlyFeeByIndiviso { get; set; }
    public decimal NewMonthlyFeeByIndiviso { get; set; }
    public decimal MonthlyFeeDifference { get; set; }
    public decimal MonthlyFeePercentageChange { get; set; }
    public List<PropertyIndivisoDetailDTO> PropertyIndivisoDetails { get; set; }
}
```

---

## 🌐 ENDPOINTS API DETALLADOS

### 1. GET Propuesta (Principal)

```http
GET /api/budget-proposal?customerId=<guid>&fiscalYear=<int>
Authorization: Bearer <token>
```

**Parámetros:**

- `customerId`: UUID del cliente (de CustomerIdService)
- `fiscalYear`: Año base (crea propuesta para fiscalYear + 1)

**Lógica Backend:**

1. baseBudgetYear = fiscalYear
2. targetProposalYear = fiscalYear + 1
3. Obtiene presupuesto Aspel de baseBudgetYear
4. Filtra cuentas extraordinarias/proyectos
5. Verifica si existe propuesta para targetProposalYear
6. Si SÍ existe: actualiza y sincroniza
7. Si NO existe: crea nueva
8. Enriquece con gastos/presupuestos mensuales
9. Obtiene ejecuciones presupuestarias de BD

**Response:**

```json
{
  "success": true,
  "message": "Propuesta obtenida y enriquecida exitosamente.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customerId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Propuesta Presupuesto 2027",
    "fiscalYear": 2027,
    "status": "Draft",
    "totalAmount": 450000.00,
    "createdDate": "2026-01-15T10:30:00Z",
    "items": [...],
    "projectedExpenseItems": [
      {
        "key": "601-001-001-1",
        "budgetExecutionId": "550e8400-..."
      }
    ]
  }
}
```

---

### 2. PUT Actualizar Monto de Partida

```http
PUT /api/budget-proposal/{itemId:guid}
Authorization: Bearer <token>
Content-Type: application/json

{
  "proposedAmount": 5500.00,
  "excludedConnectionId": "signalr-connection-123"
}
```

**Validaciones Backend:**

- ✅ Partida existe
- ✅ Propuesta existe
- ✅ Propuesta en estado "Draft"
- ✅ proposedAmount es número válido

**Acciones:**

1. Crea registro en BudgetProposalItemHistory
2. Actualiza ProposedAmount
3. Recalcula TotalAmount de propuesta
4. Enriquece respuesta con datos Aspel del mes
5. Emite SignalR (excepto excludedConnectionId)

**Response:**

```json
{
  "data": {
    "id": "550e8400-...",
    "accountNumber": "601-001-001",
    "accountName": "Servicios de Limpieza",
    "currentAmount": 5000.00,
    "proposedAmount": 5500.00,
    "difference": 500.00,
    "percentageIncrease": 10,
    "gastoEnero": 4500.00,
    ...
  }
}
```

---

### 3. GET Historial de Cambios

```http
GET /api/budget-proposal/history/{itemId:guid}
Authorization: Bearer <token>
```

**Response:**

```json
{
  "data": [
    {
      "id": "...",
      "budgetProposalItemId": "...",
      "oldAmount": 5000.0,
      "newAmount": 5500.0,
      "changedByUserName": "Juan Pérez",
      "changedAt": "2026-09-03T14:30:00Z"
    },
    {
      "oldAmount": 5500.0,
      "newAmount": 6000.0,
      "changedByUserName": "María García",
      "changedAt": "2026-09-03T15:45:00Z"
    }
  ]
}
```

---

### 4. GET Cuentas Disponibles

```http
GET /api/budget-proposal/available-accounts/{customerId:guid}/{fiscalYear:int}/{proposalId:guid}
Authorization: Bearer <token>
```

**Filtros Aplicados:**

1. Solo cuentas hojas (EsFilaAgrupadora = false)
2. No repetidas (ya en propuesta)
3. Rango válido: 600-699 o 6000-6999
4. No agrupadora principal (última parte ≠ 0)

**Response:**

```json
{
  "data": [
    {
      "codigoCuenta": "601-002-001",
      "descripcionCuenta": "Reparaciones Menores"
    },
    {
      "codigoCuenta": "602-001-003",
      "descripcionCuenta": "Servicios Técnicos"
    }
  ]
}
```

---

### 5. POST Agregar Cuentas

```http
POST /api/budget-proposal/{proposalId:guid}/add-accounts
Authorization: Bearer <token>
Content-Type: application/json

["601-002-001", "602-001-003", "603-005-002"]
```

**Validaciones:**

- Propuesta en Draft
- Cuentas no duplicadas
- Cuentas existen en Aspel

**Optimización:**

- Usa SQL directo para TotalAmount: `UPDATE ... TotalAmount = TotalAmount + {0}`
- Detach() propuesta para evitar conflictos EF

**Response:**

```json
{
  "data": [
    {
      "id": "...",
      "accountNumber": "601-002-001",
      "accountName": "Reparaciones Menores",
      "currentAmount": 1500.00,
      "proposedAmount": 1500.00,
      ...
    },
    ...
  ]
}
```

---

### 6. DELETE Eliminar Partida

```http
DELETE /api/budget-proposal/item/{itemId:guid}
Authorization: Bearer <token>
```

**Validación CRÍTICA:**

```csharp
bool hasActivity = false;
if (accountDetails != null) {
    hasActivity = accountDetails.EneroMonto != 0 ||
                  accountDetails.EneroPresupuesto != 0 ||
                  // ... todos 12 meses
                  accountDetails.DiciembreMonto != 0 ||
                  accountDetails.DiciembrePresupuesto != 0;
}

if (hasActivity || item.CurrentAmount != 0) {
    throw new BusinessException(
        "No se puede eliminar una cuenta que tiene presupuesto o gastos registrados.",
        "ACCOUNT_HAS_ACTIVITY",
        400
    );
}
```

**Acciones si OK:**

1. Elimina registros en BudgetProposalItemHistory
2. Elimina item
3. proposal.TotalAmount -= item.ProposedAmount

**Response:**

```json
{
  "success": true,
  "message": "Partida eliminada exitosamente.",
  "data": true
}
```

---

### 7. GET Comparación Cuotas (Fija)

```http
GET /api/budget-proposal/{proposalId:guid}/fee-comparison
Authorization: Bearer <token>
```

**Cálculo:**

```csharp
var currentTotalMonthlyBudget =
    proposal.Items
        .Where(i => !i.EsFilaAgrupadora)
        .Sum(i => i.CurrentAmount);

var newTotalMonthlyBudget =
    proposal.Items
        .Where(i => !i.EsFilaAgrupadora)
        .Sum(i => i.ProposedAmount);

var currentMonthlyFee = currentTotalMonthlyBudget / propertyCount;
var newMonthlyFee = newTotalMonthlyBudget / propertyCount;
```

**Response:**

```json
{
  "data": {
    "currentTotalBudget": 5400000.0, // Anual
    "newTotalBudget": 5800000.0, // Anual
    "propertyCount": 120,
    "currentMonthlyFee": 3750.0, // por propiedad
    "newMonthlyFee": 4027.78 // por propiedad
  }
}
```

---

### 8. GET Comparación Cuotas (Indiviso)

```http
GET /api/budget-proposal/{proposalId:guid}/fee-comparison-by-indiviso
Authorization: Bearer <token>
```

**Cálculo:**

```csharp
var totalIndivisoPercentage =
    properties.Sum(p => p.IndivisoPercentage ?? 0m);

var currentMonthlyFeeByIndiviso =
    currentTotalMonthlyBudget / totalIndivisoPercentage;

var newMonthlyFeeByIndiviso =
    newTotalMonthlyBudget / totalIndivisoPercentage;

// Por propiedad:
foreach (var property in properties) {
    var monthlyFeeShare =
        (property.IndivisoPercentage / totalIndivisoPercentage)
        * newTotalMonthlyBudget;
}
```

---

### 9. POST Auditoría con IA

```http
POST /api/budget-proposal/audit
Authorization: Bearer <token>
Content-Type: application/json

{
  "context": "[{...BudgetProposalItemDTO}, ...]",
  "tone": "profesional"
}
```

**Backend:**

- Enruta a IAiAssistantService.GenerateBudgetAuditAsync()
- IA analiza deficits, incrementos anómalos, etc.

**Response:**

```json
{
  "data": "# AUDITORÍA PRESUPUESTAL\n\n## Hallazgos Críticos\n..."
}
```

---

### 10. POST Proyección Financiera

```http
POST /api/budget-proposal/forecast
Authorization: Bearer <token>
Content-Type: application/json

{
  "context": "[{...BudgetProposalItemDTO}, ...]",
  "inflationRate": 3.5
}
```

**Response:**

```json
{
  "data": "[{\"accountNumber\":\"601-001-001\",\"suggestedAmount\":5175.00}, ...]"
}
```

---

## ⚙️ CONDICIONANTES Y REGLAS DE NEGOCIO COMPLEJAS

### A. LÓGICA DE AÑOS (CRÍTICA)

**Lo que entra en API:**

```
fiscalYear = 2026
```

**Lo que sucede internamente:**

```
baseBudgetYear = 2026 (obtener datos de 2026)
targetProposalYear = 2027 (crear propuesta para 2027)
```

**Ejemplo Real:**

- Usuario abre módulo en septiembre 2026
- Sistema sugiere fiscalYear = 2026 (por defecto, año actual)
- Backend crea propuesta para 2027
- Usa datos históricos de 2026 (presupuesto + gastos)
- Propuesta es: "¿Cuánto presupuestar para 2027?"

### B. SINCRONIZACIÓN CON ASPEL (ALGORITMO)

**Si propuesta EXISTE:**

```csharp
// Paso 1: Eliminar cuentas extraordinarias/proyectos
var forbiddenParentAccountNumbers = GetForbiddenParentAccountNumbers(baseBudget);
var itemsToDelete = existingProposal.Items
    .Where(i => forbiddenParentAccountNumbers.Contains(i.AccountNumber) ||
                forbiddenParentAccountNumbers.Contains(i.CuentaPadre))
    .ToList();

if (itemsToDelete.Any()) {
    // Restar del total
    var amountToSubtract = itemsToDelete.Sum(i => i.ProposedAmount);
    dbContext.BudgetProposalItem.RemoveRange(itemsToDelete);

    // SQL directo (atómico)
    await dbContext.Database.ExecuteSqlRawAsync(
        "UPDATE BudgetProposals SET TotalAmount = TotalAmount - {0} WHERE Id = {1}",
        amountToSubtract,
        existingProposal.Id
    );
}

// Paso 2: Sincronizar CurrentAmount desde catálogo COMPLETO
var baseBudgetFull = await aspelService.GetAspelFullQuotation(...);

foreach (var item in existingProposal.Items) {
    if (baseBudgetFullAccountsDict.TryGetValue(item.AccountNumber, out var baseAccountData)) {
        // Si existe en Aspel, actualiza CurrentAmount
        var latestAmount = GetLatestMonthlyAmount(
            baseAccountData.EneroPresupuesto,
            ..., // 11 meses más
            baseAccountData.DiciembrePresupuesto
        );
        if (item.CurrentAmount != latestAmount) {
            item.CurrentAmount = latestAmount;
            hasChanges = true;
        }
    } else {
        // Si NO existe en Aspel, CurrentAmount = 0
        if (item.CurrentAmount != 0) {
            item.CurrentAmount = 0;
            hasChanges = true;
        }
    }
}

if (hasChanges) await dbContext.SaveChangesAsync();
```

**Si propuesta NO EXISTE:**

```csharp
// Solo crear con cuentas no extraordinarias/proyectos
var filteredAccounts = baseBudget.CuentasDetalladas
    .Where(c => !forbiddenParentAccountNumbers.Contains(c.CodigoCuenta) &&
                !forbiddenParentAccountNumbers.Contains(c.CuentaPadre))
    .ToList();

var newProposal = new BudgetProposal {
    CustomerId = customerId,
    Name = $"Propuesta Presupuesto {targetProposalYear}",
    FiscalYear = targetProposalYear,
    Status = ProposalStatus.Draft,
    Items = filteredAccounts.Select(c => new BudgetProposalItem {
        AccountNumber = c.CodigoCuenta,
        AccountName = c.DescripcionCuenta,
        CurrentAmount = GetLatestMonthlyAmount(...),
        ProposedAmount = GetLatestMonthlyAmount(...),
        // ...más campos
    }).ToList()
};

newProposal.TotalAmount = newProposal.Items
    .Where(i => !i.EsFilaAgrupadora)
    .Sum(i => i.ProposedAmount);

await dbContext.BudgetProposal.AddAsync(newProposal);
```

### C. FUNCIÓN CRÍTICA: GetLatestMonthlyAmount()

```csharp
private static decimal GetLatestMonthlyAmount(
    decimal enero, decimal febrero, ..., decimal diciembre)
{
    decimal[] meses = { enero, febrero, ..., diciembre };

    // Busca desde diciembre hacia atrás
    for (int i = meses.Length - 1; i > 0; i--) {
        if (meses[i] != meses[i - 1]) {
            return meses[i];  // Retorna el valor donde cambió
        }
    }
    return enero;  // Si todos iguales, retorna enero
}
```

**Lógica:** Obtiene el **último monto diferente** en el año, asumiendo que si todos los meses tienen el mismo valor, ese es el presupuesto/gasto fijo del período.

### D. CÁLCULOS DE INCREMENTO EN FRONTEND

```typescript
onProposedAmountChange(item: BudgetProposalItemDTO) {
    const proposedAmount = Number(
        String(item.proposedAmount).replace(/,/g, "")
    );

    item.difference = proposedAmount - item.currentAmount;

    if (item.currentAmount === 0) {
        item.percentageIncrease = proposedAmount > 0 ? 100 : 0;
    } else {
        item.percentageIncrease =
            ((proposedAmount - item.currentAmount) / item.currentAmount) * 100;
    }

    this.recalculateTotals();
}
```

**Edge cases:**

- Si currentAmount = 0 y proposedAmount > 0 → 100%
- Si currentAmount = 0 y proposedAmount = 0 → 0%
- Si currentAmount > 0 → fórmula normal

### E. ALERTAS VISUALES EN TABLA

| Alerta                | Condición                                   | Ícono | Dónde                  |
| --------------------- | ------------------------------------------- | ----- | ---------------------- |
| **Déficit**           | proposedAmount < promedio_gasto - $1        | 🚨    | Junto número cuenta    |
| **Incremento Alto**   | percentageIncrease > 5% Y currentAmount > 0 | ⚠️    | Junto número cuenta    |
| **Sobregiro Mensual** | gasto_del_mes > presupuesto_del_mes         | 💸    | Celda mes (fondo rojo) |

### F. FILTROS DE MÓDULO

**Extraordinarios (605-\*):**

```typescript
if (!this.showExtraordinarios) {
  filteredData = filteredData.filter(
    (p) => !p.accountNumber.startsWith("605-"),
  );
}
```

**Proyectos (606-\*):**

```typescript
if (!this.showProyectos) {
  filteredData = filteredData.filter(
    (p) => !p.accountNumber.startsWith("606-"),
  );
}
```

**IMPORTANTE:** Los toggles **no afectan** el totalAmount. Se calculan sobre `allProposalItems()` (todos), no `proposalItems()` (filtrados).

---

## 📊 EXPORTACIÓN A EXCEL

### Estructura y Formato

**Estilos:**

```
Header: #2F5496 (azul marino) con texto blanco, altura 34px
Cuerpo: Alterno blanco/gris (FF: FFFFFF / FFCCCCCC)
Footer: #1F3864 (azul muy oscuro) con texto blanco
Bordes: Gris claro, thin
Formato Número: #,##0 (ej. 5,000.00)
Porcentaje: 0% (ej. 10%)
```

**Columnas (A-S):**

```
A: CUENTA                    (ancho 14)
B: DESCRIPCIÓN              (ancho 36)
C-N: 12 MESES (Ene-Dic)     (ancho 11 c/u)
O: PSTO ACTUAL              (ancho 16)
P: PROM GASTO               (ancho 16)
Q: PSTO {FiscalYear}        (ancho 16)
R: DIF                      (ancho 14)
S: % CAMBIO                 (ancho 12)
```

**Vistas:**

- Freezepanes: 2 primeras columnas + 1ª fila
- AutoFilter: A1:S1 activado
- Zoom: 100%

**Datos de Totales:**

- Fila final con "TOTALES" en columna B
- Suma de gastos por mes
- Promedio gasto anual
- Presupuesto mensual promedio
- Porcentaje total gastado

---

## 🔄 SIGNALR - SINCRONIZACIÓN EN TIEMPO REAL

### Ciclo de Vida

**Conexión:**

```typescript
ngOnInit() {
    this.signalRService.start();

    // Suscribirse a eventos
    this.signalRService.budgetProposalItemUpdate$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((updatedItem) => {
            this.handleBudgetProposalItemUpdate(updatedItem);
        });

    // Unirse al grupo de la propuesta
    this.signalRService.joinProposalGroup(
        this.customerId,
        this.selectedFiscalYear
    );
}
```

**Desconexión:**

```typescript
ngOnDestroy() {
    this.signalRService.leaveProposalGroup(
        this.customerId,
        this.selectedFiscalYear
    );
    this.signalRService.stop();
}
```

### Eventos Recibidos

**budgetProposalItemUpdate$:**

```typescript
// Cuando otro usuario actualiza una partida
(updatedItem: BudgetProposalItemDTO) => {
    // 1. Actualiza allProposalItems[]
    this.allProposalItems.update((items) => {
        const index = items.findIndex(i => i.id === updatedItem.id);
        if (index !== -1) {
            const newItems = [...items];
            newItems[index] = updatedItem;
            return newItems;
        }
        return items;
    });

    // 2. Actualiza originalProposalItems[]
    const originalIndex = this.originalProposalItems.findIndex(...);
    if (originalIndex !== -1) {
        this.originalProposalItems[originalIndex] = updatedItem;
    }

    // 3. Reaplica filtros y recalcula
    this.applyFilters();
    this.recalculateTotals();

    // 4. Toast al usuario
    this.customToastService.showInfo(
        "Cuenta actualizada!",
        `${updatedItem.accountName} | ${updatedItem.proposedAmount}`
    );
}
```

**projectedExpenseUpdate$:**

```typescript
// Cuando se crea/elimina ejecución presupuestaria
(payload) => {
  this.projectedExpenseItems.update((currentMap) => {
    const newMap = new Map(currentMap);
    if (payload.action === "add") {
      newMap.set(payload.key, payload.projectedExpenseId);
    } else if (payload.action === "remove") {
      newMap.delete(payload.key);
    }
    return newMap;
  });
};
```

### Envío desde Backend

```csharp
// En UpdateProposalItemAsync después de SaveChanges:
await budgetProposalRealTime.SendUpdateAsync(
    resultDTO,                      // El item actualizado
    item.BudgetProposal.CustomerId, // Grupo de cliente
    item.BudgetProposal.FiscalYear, // Grupo de año
    DTO.ExcludedConnectionId        // No enviar a quien lo hace
);
```

---

## 📁 GESTIÓN DE ARCHIVOS DE SOPORTE

### Endpoints

```http
# Obtener partida con soportes
GET /api/budget-proposal-item-support/{itemId:guid}

# Actualizar proveedor/comentario
PUT /api/budget-proposal-item-support/{itemId:guid}
{
  "providerName": "Proveedores Generales S.A.",
  "comment": "Cotización recibida"
}

# Subir archivos PDF
POST /api/budget-proposal-item-support/{itemId:guid}/files
Content-Type: multipart/form-data
files: [file1.pdf, file2.pdf]

# Eliminar archivo
DELETE /api/budget-proposal-item-support/file/{fileId:guid}
```

### Validaciones de Archivo

```csharp
// IFileValidatorService.ValidatePdfFiles()
- Extensión: .pdf obligatoria
- MIME Type: application/pdf
- Tamaño: validado por configuración (típicamente < 50MB)
```

### Almacenamiento

**Ruta Física:**

```
D:\LuxuryApp\public\customers\{customerId}\presupuesto\{fiscalYear}\
```

**Ruta Relativa (en BD):**

```
/customers/{customerId}/presupuesto/{fiscalYear}/{fileName_hash}
```

**URL Acceso (Frontend):**

```
fileReadPathService.GetBudgetSupportFilePath(
    customerId,
    fiscalYear,
    fileName
)
```

### Estructura en BD

```sql
BudgetProposalItemSupportFile:
  - Id: GUID
  - BudgetProposalItemId: GUID (FK)
  - FileName: string (original)
  - FilePath: string (relativo)
  - ContentType: string (application/pdf)
  - FileSize: long (bytes)
  - UploadedAt: DateTime (UTC)
```

---

## 🎯 CASOS DE USO COMPLEJOS

### Caso 1: Crear Propuesta Año 2027 (Primera Vez)

1. **Usuario selecciona:** fiscalYear = 2026 (por defecto)
2. **Frontend:** GET /api/budget-proposal?customerId=X&fiscalYear=2026
3. **Backend:**
   - baseBudgetYear = 2026
   - targetProposalYear = 2027
   - Consulta Aspel presupuesto 2026
   - ¿Existe propuesta para 2027? NO
   - Crea nueva con Items basados en Aspel 2026
   - CurrentAmount = último monto diferente (GetLatestMonthlyAmount)
   - ProposedAmount = CurrentAmount
   - Filtra 605-* y 606-*
   - Enriquece con gastos/presupuestos mensuales
4. **Frontend:**
   - Carga tabla con ~80-150 cuentas
   - Recalcula totales
   - Se une a grupo SignalR
   - Mostrar toggles Extraordinarios/Proyectos

### Caso 2: Usuario A y Usuario B Editan Simultáneamente

```
Usuario A                           Usuario B
abre propuesta 2027                abre propuesta 2027
   ↓                                   ↓
[edita 601-001-001 a $6000]         [edita 602-001-001 a $3000]
   ↓                                   ↓
PUT /api/budget-proposal/...        PUT /api/budget-proposal/...
   ↓                                   ↓
Backend: item actualizado           Backend: item actualizado
         + SignalR broadcast                 + SignalR broadcast
         ↓                                   ↓
Frontend: "Cuenta actualizada!"     Frontend: Tabla refleja
          601-001-001 | $6000                ambos cambios
          ↓                                   ↓
         [Usuario B recibe toast]   [Usuario A recibe toast]
```

### Caso 3: Intentar Eliminar Partida con Actividad

1. Usuario hace click en 🗑️ de 601-002-001
2. canDeleteItem() verifica:
   - gastoEnero = $500 ✗
   - Retorna false
   - Botón NO se muestra
3. Usuario no puede eliminar (UI sin opción)

**vs.** Si intenta por otro método (API directo):

1. DELETE /api/budget-proposal/item/601-002-001
2. Backend:
   - Verifica en Aspel: gastoEnero = $500
   - Lanza: `BusinessException("ACCOUNT_HAS_ACTIVITY", 400)`
3. Frontend error: "No se puede eliminar una cuenta con actividad"

### Caso 4: Sincronización Aspel (Propuesta Existente)

1. **Situación:** Propuesta 2027 ya existe (creada hace un mes)
2. **Ahora:** Cambios en Aspel (presupuesto 2026 se actualizó)
3. **Usuario** abre propuesta de nuevo
4. **Backend:**
   - Consulta Aspel 2026 (catálogo COMPLETO)
   - Para cada partida en BD:
     - Si existe en Aspel → CurrentAmount = nuevo valor
     - Si NO existe en Aspel → CurrentAmount = 0
     - Si DESCRIPCIÓN cambió → actualiza
   - ProposedAmount se mantiene (el que usuario editó)
5. **Frontend:**
   - Tabla refleja los nuevos CurrentAmount
   - Diferencias y porcentajes se recalculan
   - Usuario puede ver si base cambió drásticamente

### Caso 5: Comparación de Cuotas Completa

1. **Propuesta:** 2027, TotalAmount = $600,000/año
2. **Cliente:** 150 propiedades

**Cuota Fija:**

- currentTotalBudget = $550,000 (lo que está presupuestado 2026)
- newTotalBudget = $600,000 (propuesta 2027)
- currentMonthlyFee = ($550,000 / 12) / 150 = $305.56 por propiedad
- newMonthlyFee = ($600,000 / 12) / 150 = $333.33 por propiedad
- **Aumento:** $27.77 por propiedad / mes

**Cuota Indiviso:**

- Suponer: propiedades con indivisos del 0.5% a 2.0%
- totalIndivisoPercentage = 150%
- currentMonthlyFeeByIndiviso = $550,000 / 150% = $3,667
- newMonthlyFeeByIndiviso = $600,000 / 150% = $4,000
- **Aumento:** $333 por % de indiviso

---

## 🔐 SEGURIDAD Y VALIDACIONES

### Backend

| Punto              | Validación            | Excepto          |
| ------------------ | --------------------- | ---------------- |
| UpdateProposalItem | Draft state           | Admin override   |
| DeleteItem         | Sin actividad + Draft | Admin override   |
| AddAccounts        | Draft state           | Admin override   |
| Aspel integration  | Success response      | Fallback a null  |
| File upload        | PDF only              | Ninguno (strict) |

### Frontend

| Punto           | Validación      | Fallback        |
| --------------- | --------------- | --------------- |
| Botón eliminar  | canDeleteItem() | No se muestra   |
| Inputs editable | Draft state     | Deshabilitados  |
| Modal cuentas   | No duplicadas   | Filtra en lista |

---

## ⚠️ RESTRICCIONES CRÍTICAS

### NO MODIFICAR SIN AUTORIZACIÓN

```
❌ BudgetProposalService.GetProposalsAsync()
   (lógica Aspel, años, sincronización)

❌ GetLatestMonthlyAmount()
   (cálculo de base de propuesta)

❌ Eliminación de partidas (regla actividad)
   (validación histórica)

❌ Fórmulas de cuota (fija/indiviso)
   (cálculos financieros)

❌ SignalR broadcast logic
   (sincronización usuarios)

❌ Exclusión automática extraordinarios/proyectos
   (filtrado Aspel)
```

### MODIFICABLE (Menor Impacto)

```
✅ Etiquetas UI (colores, íconos)
✅ Mensajes de toast
✅ Formato de export Excel (estilos)
✅ Nuevos campos en modales (si se agregan a DTOs)
✅ Nuevos diálogos complementarios
✅ Validaciones adicionales de negocio
```

---

## 📈 MÉTRICA DE COMPLEJIDAD

| Aspecto                  | Líneas | Complejidad |
| ------------------------ | ------ | ----------- |
| BudgetProposalService.cs | 1016   | ALTA        |
| presupuesto-propuesta.ts | 1523   | ALTA        |
| DTOs y Models            | ~400   | MEDIA       |
| Endpoints                | ~60    | MEDIA       |
| SignalR integration      | ~100   | MEDIA       |
| Excel export             | ~200   | MEDIA       |

**Total aproximado:** ~3,300 líneas de código core

---

**FIN DEL ANÁLISIS EXHAUSTIVO**

| Versión | Fecha      | Autor       | Estado      |
| ------- | ---------- | ----------- | ----------- |
| 1.0     | 2026-09-03 | Claude Code | ✅ COMPLETO |
