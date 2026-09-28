# Análisis Detallado de Endpoints que se Conectan a Aspel COI

## Resumen General

Este documento describe la arquitectura actual de los módulos que se conectan a **Aspel COI API** en LuxuryApp. Existen **tres áreas principales**:

1. **ContabilidadOnline** (`/api/contabilidad-online`) - Reportes financieros y contables
2. **ContabilidadConfig** (`/api/aspel-customer-empresa`) - Configuración de mapeo cliente-empresa Aspel
3. **AspelCobranzaHausLive** (`/api/aspel-cobranza`) - Cobranza y estados de cuenta para Haus

Todos consumen la interfaz compartida `IAspelCoiApiClient` que expone **5 endpoints independientes** de Aspel COI:
- `GetCuentas` - Catálogo de cuentas contables
- `GetSaldos` - Saldos mensuales por cuenta
- `GetPresupuestos` - Presupuestos anuales por cuenta
- `GetPolizas` - Encabezados de pólizas
- `GetAuxiliares` - Movimientos (partidas) de pólizas

---

## 1. Módulo: ContabilidadOnline (`/api/contabilidad-online`)

### 1.1 Arquitectura de Datos

**Fuente principal**: `ContabilidadOnlineLocalService` → `IAspelCoiApiClient` → Aspel COI API

**Flujo dual de datos** (configurable via `ContabilidadOnlineApiSettings:PreferredDataSource`):
- **AspelLive** (default): Consulta directa a Aspel COI API con cache en memoria (30 min default)
- **Database**: Reconstruye DTOs desde tablas sincronizadas en SQL Server (`AccountingAccounts`, `AccountingBalances`, `AccountingBudgets`, `AccountingPolicies`, `AccountingLedgers`)

**DTO Principal Consolidado**: `AspelDatosCombinadosDTO`
```csharp
public record AspelDatosCombinadosDTO
{
    public List<AspelCuentaDTO> Cuentas { get; set; } = new();
    public List<AspelSaldoDTO> Saldos { get; set; } = new();
    public List<AspelPresupuestoDTO> Presupuestos { get; set; } = new();
    public List<AspelPolizaConDetalleDTO> PolizasConDetalle { get; set; } = new();
}
```

### 1.2 Objetos que se Reciben de Aspel COI

#### 1.2.1 `AspelCuentaDTO` (Catálogo de Cuentas - GetCuentas)
```csharp
public record AspelCuentaDTO
{
    public string NumCta { get; set; }        // Número de cuenta (ej: "104-001-012-000")
    public string Status { get; set; }        // "A"=Activa, "B"=Baja
    public string Tipo { get; set; }          // Tipo de cuenta
    public string Nombre { get; set; }        // Descripción
    public string CtaPapa { get; set; }       // Cuenta padre
    public string CtaRaiz { get; set; }       // Cuenta raíz
    public int Nivel { get; set; }            // Nivel jerárquico (1-4)
    public int Naturaleza { get; set; }       // 1=Acreedora, 0=Deudora
    // ... campos adicionales: Deptsino, Bandmulti, Bandajt, CtaComp, Rfc, etc.
}
```
**Propósito**: Catálogo completo del plan de cuentas. Usado para jerarquía, validaciones y mapeos.

#### 1.2.2 `AspelSaldoDTO` (Saldos Mensuales - GetSaldos)
```csharp
public record AspelSaldoDTO
{
    public string NumCta { get; set; }
    public int Ejercicio { get; set; }
    public double Inicial { get; set; }       // Saldo inicial del ejercicio
    public double InicialEx { get; set; }     // Saldo inicial expresado en moneda extranjera
    public double Cargo01..Cargo12 { get; set; }  // Cargos por mes (enero-diciembre)
    public double Abono01..Abono12 { get; set; }  // Abonos por mes (enero-diciembre)
}
```
**Propósito**: Saldos de apertura + movimiento mensual (cargos/abonos) por cuenta y ejercicio.

#### 1.2.3 `AspelPresupuestoDTO` (Presupuestos - GetPresupuestos)
```csharp
public record AspelPresupuestoDTO
{
    public int Ejercicio { get; set; }
    public string NumCta { get; set; }
    public double Presup01..Presup14 { get; set; }  // Presupuesto por mes (1-14)
}
```
**Propósito**: Presupuesto anual desglosado por mes para cuentas de resultados (clases 4, 6).

#### 1.2.4 `AspelPolizaDTO` (Encabezados de Pólizas - GetPolizas)
```csharp
public record AspelPolizaDTO
{
    public string TipoPoli { get; set; }      // "DI"=Diario, "IG"=Ingreso, "EG"=Egreso
    public string NumPoliz { get; set; }
    public int Periodo { get; set; }
    public int Ejercicio { get; set; }
    public DateTime FechaPol { get; set; }
    public string ConcepPo { get; set; }
}
```

#### 1.2.5 `AspelAuxiliarDTO` (Partidas/Movimientos - GetAuxiliares)
```csharp
public record AspelAuxiliarDTO
{
    public string TipoPoli { get; set; }
    public string NumPoliz { get; set; }
    public int NumPart { get; set; }          // Número de partida en la póliza
    public int Periodo { get; set; }
    public int Ejercicio { get; set; }
    public string NumCta { get; set; }
    public DateTime FechaPol { get; set; }
    public string ConcepPo { get; set; }
    public string DebeHaber { get; set; }     // "D"=Debe, "H"=Haber
    public double MontoMov { get; set; }
    public int NumDepto { get; set; }
    public double TipCambio { get; set; }
    public int Contrapar { get; set; }
    public int Orden { get; set; }
}
```
**Propósito**: Detalle de cada movimiento contable (línea de póliza).

#### 1.2.6 `AspelPolizaConDetalleDTO` (Póliza + Partidas - Consolidado)
```csharp
public record AspelPolizaConDetalleDTO
{
    public AspelPolizaDTO Header { get; set; }
    public List<AspelAuxiliarDTO> Partidas { get; set; } = new();
}
```
**Propósito**: Jerarquía póliza → partidas, resultado del join en `AspelCoiApiClient.GetDatosConsolidadosAsync`.

### 1.3 Endpoints Expuestos (ContabilidadOnlineEndPoints.cs)

| Endpoint | Método | Parámetros | Servicio | Respuesta | Propósito |
|----------|--------|------------|----------|-----------|-----------|
| `/estado-posicion-financiera/{customerId}/{year}/{mes}` | GET | customerId, year, mes | `EpfService` | `EpfDTO` | Estado de Posición Financiera compacto (mes específico) |
| `/estado-posicion-financiera/{customerId}/{year}` | GET | customerId, year | `EpfService` | `FinancialStatementDTO` | EPF jerárquico 12 meses |
| `/validacion-catalogo/{customerId}/{year}` | GET | customerId, year | `ValidacionCatalogoService` | `FinancialStatementDTO` | Validación de catálogo de cuentas |
| `/estado-resultados/{customerId}/{year}/{mes}` | GET | customerId, year, mes | `EstadoResultadosService` | `FinancialStatementDTO` | Estado de Resultados clásico |
| `/estado-resultados-v2/{customerId}/{year}/{mes}` | GET | customerId, year, mes | `EstadoResultadosServiceV2` | `FinancialStatementDTO` | Estado de Resultados V2 (solo mayores 400-405, 600-609) |
| `/cedula-extraordinaria/{customerId}/{year}/{mes}` | GET | customerId, year, mes | `CedulaExtraordinariaService` | `CedulaExtraordinariaDTO` | Cédula extraordinaria (separa 605, calcula recaudado) |
| `/cedula-presupuestal/{customerId}/{year}/{mes}` | GET | customerId, year, mes | `CedulaPresupuestalService` | `FinancialStatementDTO` | Cédula presupuestal (solo 6xx, presupuesto vs ejercido) |
| `/reporte-financiero/{customerId}/{year}/{mes}` | GET | customerId, year, mes | `ReporteFinancieroService` | `ReporteFinancieroDTO` | Reporte financiero combinado |
| `/flujo-caja/{customerId}/{year}` | GET | customerId, year | `FlujoCajaService` | `FlujoCajaDTO` | Flujo de caja (mapeo exhaustivo cargos/abonos) |
| `/bancos-inversiones/{customerId}/{year}/{mes}` | GET | customerId, year, mes | `BancosInversionesService` | - | Bancos e inversiones (saldos 102, 103) |
| `/fondo-reserva/{customerId}/{year}/{mes}` | GET | customerId, year, mes | `FondoReservaService` | - | Fondo de reserva |
| `/proyectos-aprobados/{customerId}/{year}` | GET | customerId, year | `ProyectosAprobadosService` | - | Proyectos aprobados |
| `/analisis-cobranza/{customerId}/{year}/{month}` | GET | customerId, year, month | `AnalisisCobranzaService` | `AnalisisCobranzaDTO` | Análisis cobranza contable (clasifica 104-*) |
| `/analisis-cobranza-online/{customerId}/{year}/{month}/{day}` | GET | customerId, year, month, day | `AnalisisCobranzaOnlineService` | `CobranzaOnlineAnalysisResponseDTO` | Análisis cobranza online (corte exacto, rechaza fallback) |
| `/ask-ai` | POST | `AskAccountingAiDTO` | `IAiAssistantService` | `string` | IA auditoría genérica |
| `/ask-ai-contabilidad-online` | POST | `AskOnlineAccountingAiDTO` | `IAiAssistantService` | `string` | IA auditoría especializada |
| `/explain-ai-contabilidad-online` | POST | `AskOnlineAccountingAiDTO` | `IAiAssistantService` | `string` | IA explicadora de reportes |

---

## 2. Módulo: ContabilidadConfig (`/api/aspel-customer-empresa`)

### 2.1 Propósito
Gestiona el **mapeo entre clientes LuxuryApp y sus identificadores de empresa en Aspel**. Es la configuración base que permite a los otros módulos saber qué `intEmpresa` usar al consultar Aspel COI.

### 2.2 Entidad Principal: `AspelCustomerEmpresa`
```csharp
// Mapeo en BD: tabla AspelCompanies
public record AspelCustomerCompanyDTO : GuidIdEntityDTO
{
    public Guid CustomerId { get; set; }           // Cliente LuxuryApp
    public string CustomerName { get; set; }       // Nombre del cliente
    public int CustomerIdAspelId { get; set; }     // intEmpresa en Aspel COI
    public AspelEmpresa Empresa { get; set; }      // Contabilidad | Cobranza | Banco
}

public enum AspelEmpresa
{
    Contabilidad = 1,
    Cobranza = 2,
    Banco = 3
}
```

### 2.3 Endpoints (AspelCustomerEmpresaEndPoints.cs)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `GET /api/aspel-customer-empresa` | GET | Lista todos los mapeos (con filtro `Customer.Active`) |
| `POST /api/aspel-customer-empresa` | POST | Crea nuevo mapeo (valida unicidad CustomerId+Empresa) |
| `PUT /api/aspel-customer-empresa/{id}` | PUT | Actualiza mapeo (si cambia clave compuesta, borra y recrea) |
| `DELETE /api/aspel-customer-empresa/{id}` | DELETE | Elimina mapeo |

**DTOs de entrada**:
- `CreateAspelCustomerCompanyDTO` / `UpdateAspelCustomerCompanyDTO`: CustomerId, CustomerIdAspelId, Empresa

**Regla de negocio clave**: Un cliente puede tener hasta 3 mapeos (uno por cada `AspelEmpresa`). El `CustomerIdAspelId` es el identificador numérico que Aspel COI usa en sus endpoints (`intEmpresa`).

---

## 3. Módulo: AspelCobranzaHausLive (`/api/aspel-cobranza`)

### 3.1 Propósito
**Integración contable de Cobranza Haus con Aspel COI**. Expone endpoints públicos (`AllowAnonymous`) para:
- Listar edificios con mapeo Cobranza
- Consultar catálogo de cuentas 104-xxx-xxx-000
- Calcular deudas actuales por propiedad
- Generar detalle de cobranza (aviso de cobro)
- Generar estado de cuenta cronológico multi-ejercicio

### 3.2 Servicios Principales

#### 3.2.1 `AspelCobranzaHausAppService` (Endpoints de catálogo y deudas)
- **GetCustomersAsync**: Lista `AspelCompanies` donde `Empresa == Cobranza`
- **GetAccountsByCustomerAsync**: Filtra cuentas `104-XXX-XXX-000` que tienen hijas nivel 4
- **GetDeudasActualesAsync**: Calcula deuda vigente al corte (soporta 3 y 4 niveles)
- **GetEstadoCuentaRangoAsync**: Estado de cuenta cronológico multi-año con agrupación de cargos

#### 3.2.2 `AspelCobranzaHausDetalleAppService` (Detalle de cobranza)
- **GetDetalleCobranzaRangoAsync**: Composición de deuda por concepto, vencidos, adelantos
- **GetDetalleCobranzaRangoAuditAsync**: Versión auditoría

### 3.3 Objetos de Respuesta (DTOs)

#### 3.3.1 `AspelCustomerResponseDTO`
```csharp
public record AspelCustomerResponseDTO(Guid CustomerId, string Name);
```
Lista de edificios para selector en frontend.

#### 3.3.2 `AspelAccountItemDTO`
```csharp
public record AspelAccountItemDTO(string NumCta, string Nombre, string Estatus);
```
Cuentas 104 consolidada (`...-000`) que tienen subcuentas nivel 4.

#### 3.3.3 `AspelAccountsByCustomerResponseDTO`
```csharp
public record AspelAccountsByCustomerResponseDTO(
    Guid CustomerId, 
    int TotalCondominos, 
    List<AspelAccountItemDTO> Cuentas
);
```

#### 3.3.4 `AspelCurrentDebtsResponseDTO` (Deudas Actuales)
```csharp
public record AspelCurrentDebtsResponseDTO
{
    public Guid CustomerId { get; set; }
    public string FechaCorte { get; set; }           // dd/MM/yyyy
    public int TotalPropiedadesConDeuda { get; set; }
    public decimal TotalDeudaActual { get; set; }
    public List<AspelCurrentDebtItemDTO> Propiedades { get; set; }
}

public record AspelCurrentDebtItemDTO
{
    public string NumCtaBase { get; set; }           // Cuenta base (ej: 103-008-002-000)
    public string Departamento { get; set; }
    public decimal SaldoActual { get; set; }
    public bool TieneDesgloseConceptos { get; set; } // true si tiene hijas nivel 4
    public int TotalConceptos { get; set; }
}
```

#### 3.3.5 `AspelAccountStatementResponseDTO` (Estado de Cuenta)
```csharp
public record AspelAccountStatementResponseDTO
{
    public string NumCta { get; set; }
    public string Departamento { get; set; }
    public string FechaInicio { get; set; }
    public string FechaFin { get; set; }
    public decimal SaldoInicial { get; set; }
    public decimal SaldoFinal { get; set; }
    public List<AspelMovementDTO> Movimientos { get; set; }
}

public record AspelMovementDTO
{
    public string Id { get; set; }           // Sintético: "ASP-2026-01-00001"
    public string NumCta { get; set; }
    public string Fecha { get; set; }        // dd/MM/yyyy
    public string Tipo { get; set; }         // "cargo" | "abono"
    public string Concepto { get; set; }
    public decimal Monto { get; set; }
    public decimal SaldoAnterior { get; set; }
    public decimal SaldoPosterior { get; set; }
    public int Periodo { get; set; }
}
```

#### 3.3.6 `AspelCobranzaDetalleResponse` (Detalle Cobranza - para Aviso de Cobro)
```json
{
  "numCtaBase": "103-008-002-000",
  "departamento": "HOTELES GRAN CLASE",
  "fechaInicio": "01/01/2026",
  "fechaFin": "19/05/2026",
  "saldoInicialTotal": 0.0,
  "totalCargos": 4508320.0,
  "totalAbonos": 800436.52,
  "saldoFinalTotal": 3707883.48,
  "totalAdelantos": 0.0,
  "totalConceptos": 4,
  "conceptos": [
    {
      "numCta": "103-008-002-001",
      "concepto": "CUOTA DE MTTO",
      "nombreCuenta": "CUOTA DE MTTO HOTELES GRAN CLASE",
      "saldoInicial": 0.0,
      "cargos": 2835290.0,
      "abonos": 567058.0,
      "saldoFinal": 2268232.0,
      "totalVencido": 2268232.0,
      "adelanto": 0.0,
      "vencidos": [
        {
          "fechaCargo": "01/02/2026",
          "conceptoDetalle": "CUOTA DE MTTO FEBRERO 2026",
          "saldoPendiente": 567058.0
        }
      ]
    }
  ]
}
```

### 3.4 Endpoints Expuestos (AspelCobranzaEndPoints.cs)

| Endpoint | Método | Parámetros | Servicio | Propósito |
|----------|--------|------------|----------|-----------|
| `/customers` | GET | - | `AspelCobranzaHausAppService` | Lista edificios con mapeo Cobranza |
| `/accounts` | GET | customerId, year | `AspelCobranzaHausAppService` | Cuentas 104-XXX-XXX-000 con hijas nivel 4 |
| `/deudas-actuales` | GET | customerId, fechaCorte(opcional) | `AspelCobranzaHausAppService` | Deudas vigentes > 0 por propiedad |
| `/detalle-cobranza-rango` | GET | customerId, numCta | `AspelCobranzaHausDetalleAppService` | Composición deuda, vencidos, adelantos (para PDF aviso) |
| `/audit/detalle-cobranza-rango` | GET | customerId, numCta | `AspelCobranzaHausDetalleAppService` | Versión auditoría del detalle |
| `/estado-cuenta-rango` | GET | customerId, numCta, fechaInicio, fechaFin | `AspelCobranzaHausAppService` | Historial cronológico multi-año (para PDF estado cuenta) |
| `/debug-cuotas-extra` | GET | customerId, year | `ContabilidadOnlineLocalService` | Debug: cuentas 104-XXX-XXX-003 con sumatorias mensuales |

### 3.5 Reglas de Negocio Críticas (del README)

1. **Normalización de pólizas en rojo**: Montos negativos en auxiliares se convierten a positivo invirtiendo naturaleza (Abono↔Cargo). **NO MODIFICAR**.

2. **Reconciliación visual de descuentos**: Cuando saldo de descuento (ej. "DESCUENTO POR PRONTO PAGO") mata recibos vencidos de otra cuenta (ej. "CUOTA DE MTTO"), **también se transfiere `TotalCredits`**. Garantiza que en Aviso de Cobro la cuenta de Mantenimiento consolide todos los abonos.

3. **Cálculo de saldo inicial multi-año** (`estado-cuenta-rango`):
   - `GetSaldosAsync` del ejercicio de `fechaInicio`
   - Campo `Inicial` + cargos/abonos meses previos
   - Movimientos del mismo mes anteriores a `fechaInicio`

4. **Agrupación de cargos contiguos**: En estado de cuenta, cargos con misma `fecha` y `concepto` se agrupan. Abonos NO se agrupan.

5. **Prioridad de aplicación de pagos globales** (detalle-cobranza-rango):
   1. Mantenimiento
   2. Multas
   3. Intereses
   4. Extraordinarios
   5. Otros

---

## 4. Cliente Compartido: `IAspelCoiApiClient` / `AspelCoiApiClient`

### 4.1 Interfaz (`IAspelCoiApiClient.cs`)
```csharp
public interface IAspelCoiApiClient
{
    Task<AspelCuentasResponseDTO> GetCuentasAsync(int intEmpresa, int intYear);
    Task<AspelSaldosResponseDTO> GetSaldosAsync(int intEmpresa, int intYear);
    Task<AspelPresupuestosResponseDTO> GetPresupuestosAsync(int intEmpresa, int intYear);
    Task<AspelPolizasResponseDTO> GetPolizasAsync(int intEmpresa, int intYear);
    Task<AspelAuxiliaresResponseDTO> GetAuxiliaresAsync(int intEmpresa, int intYear);
    Task<AspelDatosCombinadosDTO> GetDatosConsolidadosAsync(int intEmpresa, int intYear);
    Task<AspelDatosCombinadosDTO> GetDatosBasicosAsync(int intEmpresa, int intYear);
    void InvalidarCache(int intEmpresa, int intYear);
}
```

### 4.2 Implementación (`AspelCoiApiClient.cs`)

**Endpoints Aspel COI llamados**:
```
GET api/AspelCOI/GetCuentas?intEmpresa={id}&intYear={year}
GET api/AspelCOI/GetSaldos?intEmpresa={id}&intYear={year}
GET api/AspelCOI/GetPresupuestos?intEmpresa={id}&intYear={year}
GET api/AspelCOI/GetPolizas?intEmpresa={id}&intYear={year}
GET api/AspelCOI/GetAuxiliares?intEmpresa={id}&intYear={year}
```

**Autenticación**: Headers `username` + `password` (password desde `ISecretProvider` / Vault)

**Cache**: `IMemoryCache` con key `aspel-coi:{empresa}:{año}` (TTL configurable `AspelCoiApi:CacheTtlMinutes`, default 30 min)

**Reintentos**: 1 reintento con backoff exponencial (2^attempt segundos) para timeouts y HTTP 5xx/429

**Consolidación paralela** (`GetDatosConsolidadosAsync`):
```csharp
var cuentasTask = GetCuentasAsync(...);
var saldosTask = GetSaldosAsync(...);
var presupuestosTask = GetPresupuestosAsync(...);
var polizasTask = GetPolizasAsync(...);
var auxiliaresTask = GetAuxiliaresAsync(...);
await Task.WhenAll(...);

// Join Poliza + Auxiliar por clave compuesta (TipoPoli, NumPoliz, Periodo, Ejercicio)
var polizasConDetalle = polizaList.GroupJoin(auxList, ...)
```

---

## 5. Estructura de Cuentas Aspel (Convenciones)

### 5.1 Formato de Cuenta
- **3 segmentos**: `104-001-012` (nivel 3)
- **4 segmentos**: `104-001-012-000` (nivel 4 consolidado) o `104-001-012-001` (nivel 4 detalle)

### 5.2 Clases Principales
| Clase | Prefijo | Descripción |
|-------|---------|-------------|
| Activo | `1xx` | Bancos (102), Inversiones (103), Deudores (104) |
| Pasivo | `2xx` | Proveedores (201), Anticipos (203), Impuestos (205), Fondos (206) |
| Capital | `3xx` | Capital social (301), Resultados (302), Remanente (303) |
| Ingresos | `4xx` | Cuotas mantenimiento (401), Otros ingresos (402-405) |
| Gastos | `6xx` | Administración (601), Mantenimiento (602), Servicios (603), etc. |

### 5.3 Cuentas Especiales Cobranza
- **104-xxx-xxx**: Deudores diversos (condóminos)
- **104-XXX-XXX-000**: Cuenta consolidada por propiedad
- **104-XXX-XXX-001, -002...**: Subcuentas por concepto (MTTO, Multas, Intereses, Extraordinarios)

---

## 6. Flujo de Datos Típico

### 6.1 ContabilidadOnline (Reportes)
```
Angular → ContabilidadOnlineEndPoints → Servicio Reporte (ej. EpfService)
    → IContabilidadOnlineLocalService.GetDatosConsolidadosViaAspelApiAsync()
    → ContabilidadOnlineLocalService.GetPreferredDataAsync()
    → [Database] BuildContabilidadDataAsync() FROM SQL tables
       OR
    → [AspelLive] IAspelCoiApiClient.GetDatosConsolidadosAsync(intEmpresa, year)
    → AspelDatosCombinadosDTO → Servicio transforma → DTO de reporte específico
```

### 6.2 AspelCobranzaHausLive (Cobranza)
```
Angular → AspelCobranzaEndPoints → AspelCobranzaHausAppService
    → GetIntEmpresaAsync(customerId) → Busca en AspelCompanies donde Empresa=Cobranza
    → IAspelCoiApiClient.GetCuentasAsync/SaldosAsync/AuxiliaresAsync(intEmpresa, year)
    → Procesa con reglas de negocio (normalización, agrupación, multi-año)
    → DTOs de respuesta específicos (CurrentDebts, AccountStatement, DetalleCobranza)
```

---

## 7. Configuración Requerida

### 7.1 `appsettings.json` / Vault
```json
{
  "AspelCoiApi": {
    "BaseUrl": "https://api.aspel.com/coi/",
    "Username": "usuario_asel",
    "CacheTtlMinutes": 30
  }
}
```
- `Password`: En Vault (`AspelCoiPassword`) via `ISecretProvider`

### 7.2 `ContabilidadOnlineApiSettings`
```json
{
  "ContabilidadOnlineApi": {
    "PreferredDataSource": "AspelLive"  // o "Database"
  }
}
```

### 7.3 Mapeo en BD (`AspelCompanies`)
Tabla que vincula `CustomerId` (Guid LuxuryApp) + `Empresa` (enum) → `CustomerIdAspelId` (int)

---

## 8. Archivos de Referencia Clave

| Archivo | Descripción |
|---------|-------------|
| `ContabilidadOnlineEndPoints.cs` | Definición de 17 endpoints de reportes |
| `AspelCobranzaEndPoints.cs` | Definición de 7 endpoints de cobranza |
| `ContabilidadOnlineLocalService.cs` | Adaptador dual (DB/AspelLive) + reconstrucción DTOs |
| `AspelCoiApiClient.cs` | Cliente HTTP con cache, reintentos, consolidación paralela |
| `IAspelCoiApiClient.cs` | Contrato de los 5 endpoints Aspel + consolidados |
| `AspelDatosCombinadosDTO.cs` | DTO unificado de todos los datos Aspel |
| `AspelCuentaDTO/SaldoDTO/PresupuestoDTO/PolizaDTO/AuxiliarDTO.cs` | DTOs mapeados 1:1 a respuestas Aspel |
| `AspelCustomerEmpresaEndPoints.cs` | CRUD de configuración cliente-empresa |
| `documentacion-endpoints-aspel-cobranza.md` | Doc técnica completa módulo Cobranza |
| `documentacion-reportes-contabilidad-online.md` | Índice de reportes ContabilidadOnline |

---

## 9. Consideraciones Importantes

1. **Dual Data Source**: ContabilidadOnline puede leer de SQL (snapshot sincronizado) o Aspel vivo. El fallback es automático si DB no tiene datos sincronizados.

2. **Cache Aspel**: 30 min default. Invalidar con `InvalidarCache(empresa, año)` tras sincronización manual.

3. **Cuentas 104**: En ContabilidadOnline la sustitución de 104 con empresa Cobranza está **comentada temporalmente** (ver `documentacion-reportes-contabilidad-online.md` nota final).

4. **Módulo Cobranza = Solo Lectura**: README advierte **bloqueo estricto de modificación**. Algoritmos de cuadre de saldos y reconciliación de descuentos son frágiles.

5. **PDFs en Frontend**: No hay endpoints de descarga PDF en backend. Angular usa `pdfMake` con `AspelCobranzaHausPdfService`.

6. **Multi-año**: `estado-cuenta-rango` y `GetDeudasActuales` consultan Aspel por cada año involucrado y consolidan cronológicamente.

7. **Normalización de códigos**: `NormalizeSegmentedAccountCode()` convierte `"104001012000"` → `"104-001-012-000"` para comparaciones seguras.