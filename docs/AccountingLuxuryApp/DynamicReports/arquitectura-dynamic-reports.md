# Re-Arquitectura: Modulo de Reportes Dinamicos Contables

**Fecha:** 2026-05-06
**Alcance:** EspejoAspelFull + DynamicReports (backend y frontend)
**Referencia de arquitectura:** GEMINI.md + skills/

---

## 1. Analisis del Estado Actual

### 1.1 Flujo de datos EspejoAspelFull

```
GET /api/espejo-aspel-full?customerId&intYear&empresa
  -> EspejoAspelFullService.GetEspejoAsync()
    -> IAspelMappingService.GetEmpresaIdAsync()      // resuelve int empresa
    -> IAspelCoiApiClient.GetDatosConsolidadosAsync() // fetch raw Aspel
    -> ConstruirGrupos()                              // jerarquia 3 niveles
      -> ConstruirNivel1() -> ConstruirNivel2() -> Nivel3 inline
  <- EspejoAspelFullResponseDTO { grupos[] }
```

El servicio construye una jerarquia completa de 3 niveles (Grupo > Nivel1 > Nivel2 > Nivel3) a partir de cuentas con formato `XXX-YYY-ZZZ`. La logica de clasificacion por nivel (EsNivel1/EsNivel2/EsNivel3) es correcta y esta encapsulada.

**Problema clave:** esta logica de construccion de jerarquia existe solo en `EspejoAspelFullService` y no es accesible para `DynamicReports`. Cada modulo consulta datos Aspel de forma independiente.

### 1.2 Flujo de datos DynamicReports

```
// Creacion de reporte
POST /api/dynamic-reports  ->  ReportDefinitionService.CreateAsync()
  -> serializa ReportBodyDTO como JSON -> tabla ReportDefinitions

// Ejecucion
POST /api/dynamic-reports/execute  ->  DynamicReportEngineService.ExecuteAsync()
  -> ReportDefinitionService.GetByIdAsync()          // deserializa JSON
  -> ContabilidadOnlineLocalService.GetRawDataViaAspelApiAsync()
  -> Por seccion/renglon:
       "account"   -> AccountFilterResolver.Resolve() -> PeriodValueExtractor.Extract()
       "subtotal"  -> suma valores resueltos previos
       "formula"   -> FormulaEvaluatorService.Evaluate() via DataTable.Compute()
  <- ReportResultDTO

// Catalogo de cuentas (para el constructor)
GET /api/dynamic-reports/accounts/{customerId}/{year}
  -> ContabilidadOnlineLocalService.GetRawDataViaAspelApiAsync()
  -> Select plano -> List<AccountCatalogItemDTO>      // SIN jerarquia
```

### 1.3 Inventario de fricciones

| # | Capa | Friccion | Severidad |
|---|------|----------|-----------|
| F1 | Frontend | El catalogo de cuentas es una lista plana. No hay arbol. El usuario no puede ver la jerarquia contable durante la construccion del reporte. | Alta |
| F2 | Frontend | `report-builder.ts` mezcla `ReactiveFormsModule` (metadata) con signals (secciones/columnas). `FormHelper.submitCrud()` no se usa (violacion GEMINI.md). | Media |
| F3 | Frontend | `report-builder.ts` importa `CommonModule` (prohibido) y `FormsModule` innecesario. Sin componente movil (`app-data-view-mobile`). | Media |
| F4 | Frontend | La seleccion de cuentas usa `p-autoComplete` con busqueda textual libre. El usuario debe conocer el codigo exacto o parte del nombre; no hay indicacion de nivel ni contexto jerarquico. | Alta |
| F5 | Backend | `FormulaEvaluatorService` usa `DataTable.Compute()`. Aunque los placeholders se sustituyen por numeros antes de evaluar, `DataTable` expone funciones de su propia mini-lenguaje (`IIF`, `LEN`, `ISNULL`, etc.) que no son necesarias. Reemplazable por un evaluador aritmetico restringido mas simple y auditado. | Media |
| F6 | Backend | `DynamicReportController` solo tiene `[Authorize]` global. Ninguna accion define roles explicitamente (contraste con `EspejoAspelFullController` que declara `Roles = "Administrador,..."`). | Alta |
| F7 | Backend | `ReportDefinitionService.UpdateAsync` registra el cambio en historial usando `dto.CreatedBy` (valor del cliente, no confiable). Debe usar `ICurrentUserService`. | Media |
| F8 | Backend | La logica de construccion de jerarquia esta duplicada conceptualmente: `EspejoAspelFullService` construye un arbol detallado; `DynamicReportEngineService.GetAccountCatalogAsync` devuelve una lista plana del mismo origen. | Media |
| F9 | Backend | `AccountFilterDTO.RangeFrom/RangeTo` son `string` sin `= string.Empty` (posible `NullReferenceException` en compilacion con `#nullable enable`). | Baja |
| F10 | Backend | `NombresGrupo` en `EspejoAspelFullService` solo mapea grupos 1, 2, 3, 4 y 6. El grupo 5 (si existe en el cliente) aparece como "GRUPO 5". | Baja |

---

## 2. Matriz de Diagnostico: Actual vs Propuesta

| Dimension | Estado Actual | Propuesta |
|-----------|---------------|-----------|
| Seleccion de cuentas | Autocomplete textual plano | `AccountTreeSelectComponent` con `p-tree` jerarquico + busqueda |
| Catalogo endpoint | Lista plana `GET .../accounts/{id}/{year}` | Endpoint adicional `GET .../accounts/{id}/{year}/tree` con nodos padre-hijo |
| Logica de jerarquia | Duplicada en EspejoAspelFull y DynamicReports | Extraida a `IAccountCatalogService` compartido |
| Formula evaluacion | `DataTable.Compute()` con mini-lenguaje amplio | `SafeArithmeticEvaluator` recursivo, solo `+`, `-`, `*`, `/`, `()` |
| Autorizacion | `[Authorize]` generico en el controlador | Roles explicitos por verbo, alineados con `EspejoAspelFullController` |
| Auditoria de cambios | `dto.CreatedBy` del cliente | `ICurrentUserService` en el servicio |
| GEMINI.md / Angular | Violaciones: CommonModule, FormHelper faltante, sin mobile view | Componentes limpios, FormHelper donde aplica, mobile view requerida |
| Preview en tiempo real | No existe | `ReportPreviewService` con `computed()` sobre signals del builder |

---

## 3. Estructura de Carpetas Propuesta

### 3.1 Backend

```
Modules/Contabilidad/Features/
  EspejoAspelFull/
    Controller/EspejoAspelFullController.cs   (sin cambios)
    Services/EspejoAspelFullService.cs        (sin cambios)
    DTOs/ ...                                 (sin cambios)
    Interfaces/IEspejoAspelFullService.cs     (sin cambios)

  Shared/                                     <- NUEVO
    Services/AccountCatalogService.cs         // extrae jerarquia de Aspel
    Interfaces/IAccountCatalogService.cs
    DTOs/AccountTreeNodeDTO.cs
    DTOs/AccountFlatItemDTO.cs                // reemplaza AccountCatalogItemDTO

  Contabilidad/DynamicReports/
    Controller/DynamicReportController.cs     (ajuste de roles + endpoint tree)
    Services/
      ReportDefinitionService.cs              (ajuste ICurrentUserService)
      DynamicReportEngineService.cs           (usa IAccountCatalogService)
      SafeArithmeticEvaluator.cs              // reemplaza FormulaEvaluatorService
      AccountFilterResolver.cs               (sin cambios)
      PeriodValueExtractor.cs                (sin cambios)
      ReportExcelExportService.cs            (sin cambios)
      ReportPdfExportService.cs             (sin cambios)
    Interfaces/
      IDynamicReportEngineService.cs         (agrega GetAccountTreeAsync)
      IReportDefinitionService.cs            (sin cambios)
    DTOs/                                    (sin cambios + AccountFlatItemDTO)
```

### 3.2 Frontend

```
features/contabilidad/
  espejo-aspel-full/                         (sin cambios)

  contabilidad-online-reports/
    models/
      report-definition.interface.ts         (agrega IAccountTreeNode)
    services/
      account-catalog.service.ts             <- NUEVO
      report-preview.service.ts              <- NUEVO
    components/
      account-tree-select/                   <- NUEVO
        account-tree-select.ts
        account-tree-select.html
    pages/
      report-catalog/report-catalog.ts       (sin cambios)
      report-guide/report-guide.ts           (sin cambios)
      report-builder/
        report-builder.ts                    (refactor: limpiar imports, mobile view)
        report-builder.html
      report-viewer/report-viewer.ts         (sin cambios, solo imports)
```

---

## 4. Contratos Clave

### 4.1 AccountTreeNodeDTO (backend)

```csharp
namespace LuxuryApp.Application.DTOs;

public class AccountTreeNodeDTO
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public string Naturaleza { get; set; } = string.Empty;  // "D" | "A"
    public decimal SaldoInicial { get; set; }
    public decimal AcumuladoAnual { get; set; }
    public List<AccountTreeNodeDTO> Children { get; set; } = [];
}
```

### 4.2 AccountFlatItemDTO (reemplaza AccountCatalogItemDTO)

```csharp
// Reemplaza AccountCatalogItemDTO agregando campo ParentCode
namespace LuxuryApp.Application.DTOs;

public class AccountFlatItemDTO
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public string? ParentCode { get; set; }           // null en nivel 1
    public string Naturaleza { get; set; } = string.Empty;
    public decimal SaldoInicial { get; set; }
    public decimal AcumuladoAnual { get; set; }
}
```

### 4.3 IAccountCatalogService

```csharp
namespace LuxuryApp.Application.Interfaces;

public interface IAccountCatalogService
{
    Task<ApiResponseDTO<List<AccountTreeNodeDTO>>> GetTreeAsync(
        Guid customerId, int year, EAspelCustomerEmpresa empresa);

    Task<ApiResponseDTO<List<AccountFlatItemDTO>>> GetFlatAsync(
        Guid customerId, int year, EAspelCustomerEmpresa empresa);
}
```

### 4.4 IAccountTreeNode (frontend)

```typescript
// models/report-definition.interface.ts
export interface IAccountTreeNode {
  code: string;
  name: string;
  level: number;
  naturaleza: string;
  saldoInicial: number;
  acumuladoAnual: number;
  children: IAccountTreeNode[];
}
```

### 4.5 ReportBodyDTO (sin cambios estructurales, clarificacion de tipos)

El schema JSON que se persiste en `DefinitionJson` es:

```json
{
  "columns": [
    {
      "id": "col-1",
      "label": "Mayo 2026",
      "periodType": "month",
      "dataSource": "contabilidad",
      "year": 2026,
      "month": 5
    }
  ],
  "sections": [
    {
      "id": "s1",
      "title": "INGRESOS",
      "position": 1,
      "rows": [
        {
          "id": "r1",
          "type": "account",
          "label": "Ventas de Servicios",
          "accountFilter": {
            "accountNumbers": ["401-000-000"],
            "rangeFrom": "",
            "rangeTo": "",
            "level": null,
            "excludeAccounts": []
          },
          "sign": 1,
          "sourceRowIds": [],
          "formula": null,
          "position": 1,
          "bold": false,
          "indent": 1,
          "showZero": false
        }
      ]
    }
  ]
}
```

---

## 5. Endpoints Optimizados

### 5.1 DynamicReportController (ajustes)

```csharp
namespace LuxuryApp.Application.Controller;

[ApiController]
[Route("api/dynamic-reports")]
[Authorize]
public class DynamicReportController(
    IReportDefinitionService definitionService,
    IDynamicReportEngineService engineService) : ControllerBase
{
    private const string RolesLectura  = "Administrador,SuperUsuario,Contador,AsistenteFiscal,Asistente";
    private const string RolesEscritura = "Administrador,SuperUsuario,Contador";

    [HttpGet("customer/{customerId:guid}")]
    [Authorize(Roles = RolesLectura)]
    public async Task<ActionResult<ApiResponseDTO<List<ReportDefinitionListDTO>>>> GetByCustomer(Guid customerId)
        => Ok(await definitionService.GetAllAsync(customerId));

    [HttpGet("templates")]
    [Authorize(Roles = RolesLectura)]
    public async Task<ActionResult<ApiResponseDTO<List<ReportDefinitionListDTO>>>> GetTemplates()
        => Ok(await definitionService.GetTemplatesAsync());

    [HttpGet("{id:guid}")]
    [Authorize(Roles = RolesLectura)]
    public async Task<ActionResult<ApiResponseDTO<ReportDefinitionDTO>>> GetById(Guid id)
        => Ok(await definitionService.GetByIdAsync(id));

    [HttpPost]
    [Authorize(Roles = RolesEscritura)]
    public async Task<ActionResult<ApiResponseDTO<ReportDefinitionDTO>>> Create([FromBody] ReportDefinitionDTO dto)
        => Ok(await definitionService.CreateAsync(dto));

    [HttpPut("{id:guid}")]
    [Authorize(Roles = RolesEscritura)]
    public async Task<ActionResult<ApiResponseDTO<ReportDefinitionDTO>>> Update(Guid id, [FromBody] ReportDefinitionDTO dto)
        => Ok(await definitionService.UpdateAsync(id, dto));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = RolesEscritura)]
    public async Task<ActionResult<ApiResponseDTO<bool>>> Delete(Guid id)
        => Ok(await definitionService.DeleteAsync(id));

    [HttpPost("execute")]
    [Authorize(Roles = RolesLectura)]
    public async Task<ActionResult<ApiResponseDTO<ReportResultDTO>>> Execute([FromBody] ExecuteReportRequestDTO request)
        => Ok(await engineService.ExecuteAsync(request));

    // Catalogo plano (compatibilidad con builder actual)
    [HttpGet("accounts/{customerId:guid}/{year:int}")]
    [Authorize(Roles = RolesLectura)]
    public async Task<ActionResult<ApiResponseDTO<List<AccountFlatItemDTO>>>> GetAccounts(
        Guid customerId, int year, [FromQuery] string empresa = "Contabilidad")
        => Ok(await engineService.GetAccountCatalogAsync(customerId, year, empresa));

    // NUEVO: catalogo en arbol para AccountTreeSelectComponent
    [HttpGet("accounts/{customerId:guid}/{year:int}/tree")]
    [Authorize(Roles = RolesLectura)]
    public async Task<ActionResult<ApiResponseDTO<List<AccountTreeNodeDTO>>>> GetAccountTree(
        Guid customerId, int year, [FromQuery] string empresa = "Contabilidad")
        => Ok(await engineService.GetAccountTreeAsync(customerId, year, empresa));

    [HttpPost("execute/pdf")]
    [Authorize(Roles = RolesLectura)]
    public async Task<IActionResult> ExecutePdf([FromBody] ExecuteReportRequestDTO request)
    {
        var response = await engineService.ExecuteAsync(request);
        if (!response.Success || response.Data is null)
            return BadRequest(response.Message);
        var bytes = ReportPdfExportService.Export(response.Data);
        return File(bytes, "application/pdf", $"{response.Data.ReportName.Replace(" ", "_")}.pdf");
    }

    [HttpPost("execute/excel")]
    [Authorize(Roles = RolesLectura)]
    public async Task<IActionResult> ExecuteExcel([FromBody] ExecuteReportRequestDTO request)
    {
        var response = await engineService.ExecuteAsync(request);
        if (!response.Success || response.Data is null)
            return BadRequest(response.Message);
        var bytes = ReportExcelExportService.Export(response.Data);
        return File(bytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"{response.Data.ReportName.Replace(" ", "_")}.xlsx");
    }
}
```

**Cambios respecto al actual:**
- Roles explicitos en cada accion (F6).
- `GetAccounts` recibe `empresa` como query param (antes siempre usaba "Contabilidad").
- Nuevo endpoint `GET .../tree` para el selector jerarquico.
- Firma de `GetAccountCatalogAsync` / `GetAccountTreeAsync` actualizada en `IDynamicReportEngineService`.

---

## 6. Ejemplos Criticos de Implementacion

### 6.1 AccountCatalogService (backend - servicio compartido)

```csharp
namespace LuxuryApp.Application.Services;

public class AccountCatalogService(
    IAspelMappingService aspelMappingService,
    IAspelCoiApiClient aspelCoiApiClient) : IAccountCatalogService
{
    private static readonly Dictionary<string, string> NombresGrupo = new()
    {
        { "1", "ACTIVO" }, { "2", "PASIVO" }, { "3", "CAPITAL" },
        { "4", "INGRESOS" }, { "5", "COSTOS" }, { "6", "GASTOS" },
    };

    public async Task<ApiResponseDTO<List<AccountTreeNodeDTO>>> GetTreeAsync(
        Guid customerId, int year, EAspelCustomerEmpresa empresa)
    {
        var (datos, error) = await ObtenerDatos(customerId, year, empresa);
        if (datos is null)
            return ApiResponseDTO<List<AccountTreeNodeDTO>>.ErrorResult(error!);

        var saldos = datos.Saldos.ToDictionary(s => s.NumCta, StringComparer.OrdinalIgnoreCase);
        var cuentasActivas = datos.Cuentas.Where(c => c.Status == "A" && c.Nivel <= 3).ToList();

        var tree = ConstruirArbol(cuentasActivas, saldos);
        return ApiResponseDTO<List<AccountTreeNodeDTO>>.SuccessResult(tree);
    }

    public async Task<ApiResponseDTO<List<AccountFlatItemDTO>>> GetFlatAsync(
        Guid customerId, int year, EAspelCustomerEmpresa empresa)
    {
        var (datos, error) = await ObtenerDatos(customerId, year, empresa);
        if (datos is null)
            return ApiResponseDTO<List<AccountFlatItemDTO>>.ErrorResult(error!);

        var saldos = datos.Saldos.ToDictionary(s => s.NumCta, StringComparer.OrdinalIgnoreCase);
        var items = datos.Cuentas
            .Where(c => c.Status == "A" && c.Nivel <= 3)
            .OrderBy(c => c.NumCta)
            .Select(c =>
            {
                saldos.TryGetValue(c.NumCta, out var s);
                return new AccountFlatItemDTO
                {
                    Code = c.NumCta,
                    Name = c.Nombre,
                    Level = c.Nivel,
                    ParentCode = ObtenerCodigoPadre(c.NumCta, c.Nivel),
                    Naturaleza = c.Naturaleza == 0 ? "D" : "A",
                    SaldoInicial = (decimal)(s?.Inicial ?? 0),
                    AcumuladoAnual = (decimal)(s?.Cargo01 + s?.Cargo02 ?? 0)  // simplificado
                };
            })
            .ToList();

        return ApiResponseDTO<List<AccountFlatItemDTO>>.SuccessResult(items);
    }

    // ── Privados ──────────────────────────────────────────────────────────────

    private async Task<(AspelDatosConsolidadosDTO? datos, string? error)> ObtenerDatos(
        Guid customerId, int year, EAspelCustomerEmpresa empresa)
    {
        var intEmpresa = await aspelMappingService.GetEmpresaIdAsync(customerId, empresa);
        if (intEmpresa is null)
            return (null, $"No se encontro mapeo de empresa Aspel ({empresa}) para el cliente.");

        var datos = await aspelCoiApiClient.GetDatosConsolidadosAsync(intEmpresa.Value, year);
        return (datos, null);
    }

    private static List<AccountTreeNodeDTO> ConstruirArbol(
        List<AspelCuentaDTO> cuentas,
        Dictionary<string, AspelSaldoDTO> saldos)
    {
        var grupos = cuentas
            .Where(c => !string.IsNullOrEmpty(c.NumCta))
            .GroupBy(c => c.NumCta[0].ToString())
            .OrderBy(g => g.Key);

        var resultado = new List<AccountTreeNodeDTO>();

        foreach (var grupoRaw in grupos)
        {
            var groupNode = new AccountTreeNodeDTO
            {
                Code = grupoRaw.Key,
                Name = NombresGrupo.GetValueOrDefault(grupoRaw.Key, $"GRUPO {grupoRaw.Key}"),
                Level = 0,
                Children = ConstruirNivel1(grupoRaw.ToList(), saldos)
            };
            resultado.Add(groupNode);
        }

        return resultado;
    }

    private static List<AccountTreeNodeDTO> ConstruirNivel1(
        List<AspelCuentaDTO> cuentasGrupo,
        Dictionary<string, AspelSaldoDTO> saldos)
    {
        return cuentasGrupo
            .Where(c => EsNivel(c.NumCta, 1))
            .OrderBy(c => c.NumCta)
            .Select(c1 =>
            {
                saldos.TryGetValue(c1.NumCta, out var s);
                var node = MapToNode(c1, s);
                node.Children = ConstruirNivel2(c1.NumCta, cuentasGrupo, saldos);
                return node;
            })
            .ToList();
    }

    private static List<AccountTreeNodeDTO> ConstruirNivel2(
        string codigoN1,
        List<AspelCuentaDTO> cuentasGrupo,
        Dictionary<string, AspelSaldoDTO> saldos)
    {
        var prefijo = ObtenerPrefijo(codigoN1);
        return cuentasGrupo
            .Where(c => EsNivel(c.NumCta, 2) && ObtenerPrefijo(c.NumCta) == prefijo)
            .OrderBy(c => c.NumCta)
            .Select(c2 =>
            {
                saldos.TryGetValue(c2.NumCta, out var s);
                var node = MapToNode(c2, s);
                node.Children = ConstruirNivel3(codigoN1, c2.NumCta, cuentasGrupo, saldos);
                return node;
            })
            .ToList();
    }

    private static List<AccountTreeNodeDTO> ConstruirNivel3(
        string codigoN1,
        string codigoN2,
        List<AspelCuentaDTO> cuentasGrupo,
        Dictionary<string, AspelSaldoDTO> saldos)
    {
        var prefijo = ObtenerPrefijo(codigoN1);
        var seg2 = ObtenerSegundoSegmento(codigoN2);
        return cuentasGrupo
            .Where(c => EsNivel(c.NumCta, 3)
                && ObtenerPrefijo(c.NumCta) == prefijo
                && ObtenerSegundoSegmento(c.NumCta) == seg2)
            .OrderBy(c => c.NumCta)
            .Select(c3 =>
            {
                saldos.TryGetValue(c3.NumCta, out var s);
                return MapToNode(c3, s);
            })
            .ToList();
    }

    private static AccountTreeNodeDTO MapToNode(AspelCuentaDTO c, AspelSaldoDTO? s) => new()
    {
        Code = c.NumCta,
        Name = c.Nombre,
        Level = c.Nivel,
        Naturaleza = c.Naturaleza == 0 ? "D" : "A",
        SaldoInicial = (decimal)(s?.Inicial ?? 0),
        AcumuladoAnual = (decimal)(s?.Cargo01 + s?.Cargo02 ?? 0),
    };

    private static bool EsNivel(string numCta, int nivel)
    {
        var p = numCta.Split('-');
        if (p.Length != 3) return false;
        return nivel switch
        {
            1 => p[1] == "000" && p[2] == "000",
            2 => p[1] != "000" && p[2] == "000",
            3 => p[1] != "000" && p[2] != "000",
            _ => false
        };
    }

    private static string ObtenerPrefijo(string numCta)
    {
        var idx = numCta.IndexOf('-');
        return idx > 0 ? numCta[..idx] : numCta;
    }

    private static string ObtenerSegundoSegmento(string numCta)
    {
        var p = numCta.Split('-');
        return p.Length >= 2 ? p[1] : "000";
    }

    private static string? ObtenerCodigoPadre(string numCta, int nivel) => nivel switch
    {
        2 => $"{ObtenerPrefijo(numCta)}-000-000",
        3 => $"{ObtenerPrefijo(numCta)}-{numCta.Split('-')[1]}-000",
        _ => null
    };
}
```

### 6.2 SafeArithmeticEvaluator (reemplaza FormulaEvaluatorService)

Evaluador de descenso recursivo restringido. Solo permite: numeros, `+`, `-`, `*`, `/`, `(`, `)`.
No usa `DataTable.Compute()`. No tiene acceso a funciones, strings ni identificadores.

```csharp
namespace LuxuryApp.Application.Services;

/// <summary>
/// Evalua expresiones aritmeticas simples del tipo "[row-1] + [row-2] * 2".
/// Solo permite operadores + - * / y parentesis. Sin funciones ni cadenas.
/// </summary>
public static class SafeArithmeticEvaluator
{
    private static readonly Regex PlaceholderRegex = new(@"\[([^\]]+)\]", RegexOptions.Compiled);

    public static decimal? Evaluate(
        string? formula,
        string columnId,
        Dictionary<string, Dictionary<string, decimal?>> resolvedValues)
    {
        if (string.IsNullOrWhiteSpace(formula)) return null;

        var expression = PlaceholderRegex.Replace(formula, match =>
        {
            var rowId = match.Groups[1].Value;
            if (!resolvedValues.TryGetValue(rowId, out var colValues)) return "0";
            var val = colValues.TryGetValue(columnId, out var v) ? v : null;
            return (val ?? 0m).ToString("G", System.Globalization.CultureInfo.InvariantCulture);
        });

        if (expression.Contains('[')) return null;

        return ParseExpression(expression.AsSpan().Trim());
    }

    // ── Parser ────────────────────────────────────────────────────────────────

    private static decimal? ParseExpression(ReadOnlySpan<char> input)
    {
        int pos = 0;
        return ParseAddSub(input, ref pos);
    }

    private static decimal? ParseAddSub(ReadOnlySpan<char> input, ref int pos)
    {
        var left = ParseMulDiv(input, ref pos);
        if (left is null) return null;

        while (pos < input.Length)
        {
            SkipWhitespace(input, ref pos);
            if (pos >= input.Length) break;
            char op = input[pos];
            if (op != '+' && op != '-') break;
            pos++;
            var right = ParseMulDiv(input, ref pos);
            if (right is null) return null;
            left = op == '+' ? left + right : left - right;
        }
        return left;
    }

    private static decimal? ParseMulDiv(ReadOnlySpan<char> input, ref int pos)
    {
        var left = ParseUnary(input, ref pos);
        if (left is null) return null;

        while (pos < input.Length)
        {
            SkipWhitespace(input, ref pos);
            if (pos >= input.Length) break;
            char op = input[pos];
            if (op != '*' && op != '/') break;
            pos++;
            var right = ParseUnary(input, ref pos);
            if (right is null) return null;
            if (op == '/' && right == 0) return null;
            left = op == '*' ? left * right : left / right;
        }
        return left;
    }

    private static decimal? ParseUnary(ReadOnlySpan<char> input, ref int pos)
    {
        SkipWhitespace(input, ref pos);
        if (pos < input.Length && input[pos] == '-')
        {
            pos++;
            var val = ParsePrimary(input, ref pos);
            return val is null ? null : -val;
        }
        return ParsePrimary(input, ref pos);
    }

    private static decimal? ParsePrimary(ReadOnlySpan<char> input, ref int pos)
    {
        SkipWhitespace(input, ref pos);
        if (pos >= input.Length) return null;

        if (input[pos] == '(')
        {
            pos++;
            var inner = ParseAddSub(input, ref pos);
            SkipWhitespace(input, ref pos);
            if (pos >= input.Length || input[pos] != ')') return null;
            pos++;
            return inner;
        }

        return ParseNumber(input, ref pos);
    }

    private static decimal? ParseNumber(ReadOnlySpan<char> input, ref int pos)
    {
        SkipWhitespace(input, ref pos);
        int start = pos;
        if (pos < input.Length && input[pos] == '.') return null;

        while (pos < input.Length && (char.IsDigit(input[pos]) || input[pos] == '.'))
            pos++;

        if (pos == start) return null;

        var token = input[start..pos];
        return decimal.TryParse(token, System.Globalization.NumberStyles.Number,
            System.Globalization.CultureInfo.InvariantCulture, out var result)
            ? result
            : null;
    }

    private static void SkipWhitespace(ReadOnlySpan<char> input, ref int pos)
    {
        while (pos < input.Length && char.IsWhiteSpace(input[pos])) pos++;
    }
}
```

**Diferencia clave vs `DataTable.Compute`:**
- No expone funciones (`IIF`, `LEN`, `ISNULL`, etc.).
- El codigo es auditable directamente en el repositorio.
- Retorna `null` ante cualquier caracter no reconocido (falla de forma segura).

### 6.3 AccountTreeSelectComponent (Angular + Signals + catálogo `@ui/*`)

> [!NOTE]
> Implementación real y vigente en
> `appsweb/angular/src/app/modules/accounting.luxuryapp/general-ledger/dynamic-reports/account-tree-select/account-tree-select.ts`.
> Usa el componente de árbol del catálogo `LxTree` (`@ui/adaptive/tree/tree`),
> con `TreeNode` tipado en `@core/interfaces/tree-node.interface`. El filtrado, badges de nivel
> y selección por checkbox se implementan sobre signals (`signal`, `computed`, `effect`) y clases
> Bootstrap 5 (`d-flex`, `align-items-center`, etc.). Consultar ese archivo como fuente de verdad
> en lugar de este snippet histórico.

### 6.4 AccountCatalogService (Angular)

```typescript
// services/account-catalog.service.ts
import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response.service';
import { IAccountTreeNode, IAccountFlatItem } from '../models/report-definition.interface';

@Injectable({ providedIn: 'root' })
export class AccountCatalogService {
  private api = inject(ApiResponseService);

  // Cache simple por clave "customerId-year-empresa"
  private cacheTree = new Map<string, IAccountTreeNode[]>();
  private cacheFlat = new Map<string, IAccountFlatItem[]>();

  async getTree(customerId: string, year: number, empresa = 'Contabilidad'): Promise<IAccountTreeNode[]> {
    const key = `${customerId}-${year}-${empresa}`;
    if (this.cacheTree.has(key)) return this.cacheTree.get(key)!;

    const data = await this.api.onGetItem<IAccountTreeNode[]>(
      `dynamic-reports/accounts/${customerId}/${year}/tree?empresa=${empresa}`
    );
    const result = data ?? [];
    this.cacheTree.set(key, result);
    return result;
  }

  async getFlat(customerId: string, year: number, empresa = 'Contabilidad'): Promise<IAccountFlatItem[]> {
    const key = `${customerId}-${year}-${empresa}`;
    if (this.cacheFlat.has(key)) return this.cacheFlat.get(key)!;

    const data = await this.api.onGetItem<IAccountFlatItem[]>(
      `dynamic-reports/accounts/${customerId}/${year}?empresa=${empresa}`
    );
    const result = data ?? [];
    this.cacheFlat.set(key, result);
    return result;
  }
}
```

### 6.5 ReportPreviewService (Angular - preview reactivo)

```typescript
// services/report-preview.service.ts
import { computed, Injectable, signal } from '@angular/core';
import { IReportSection, IReportColumn, IAccountFlatItem } from '../models/report-definition.interface';

@Injectable({ providedIn: 'root' })
export class ReportPreviewService {
  sections = signal<IReportSection[]>([]);
  columns = signal<IReportColumn[]>([]);
  catalog = signal<IAccountFlatItem[]>([]);

  // Resumen de validacion: lista de advertencias reactivas
  advertencias = computed(() => {
    const warns: string[] = [];
    const cuentasDisponibles = new Set(this.catalog().map(c => c.code));

    for (const seccion of this.sections()) {
      for (const renglon of seccion.rows) {
        if (renglon.type === 'account') {
          const numeros = renglon.accountFilter?.accountNumbers ?? [];
          if (numeros.length === 0 && !renglon.accountFilter?.rangeFrom) {
            warns.push(`"${renglon.label}": sin cuentas asignadas.`);
          }
          for (const code of numeros) {
            if (!cuentasDisponibles.has(code)) {
              warns.push(`"${renglon.label}": cuenta ${code} no existe en el catalogo.`);
            }
          }
        }
        if (renglon.type === 'formula' && !renglon.formula?.trim()) {
          warns.push(`"${renglon.label}": formula vacia.`);
        }
        if (renglon.type === 'subtotal' && renglon.sourceRowIds.length === 0) {
          warns.push(`"${renglon.label}": subtotal sin renglones de origen.`);
        }
      }
    }
    return warns;
  });

  esValido = computed(() => this.advertencias().length === 0);

  totalRenglones = computed(() =>
    this.sections().reduce((sum, s) => sum + s.rows.length, 0)
  );
}
```

**Integracion en `report-builder.ts`:**

```typescript
// Dentro de ReportBuilder
private previewS = inject(ReportPreviewService);

// En ngOnInit / constructor, sincronizar signals con el servicio
constructor() {
  effect(() => {
    this.previewS.sections.set(this.sections());
    this.previewS.columns.set(this.columns());
  });
}

// Exponer advertencias en la plantilla
advertencias = this.previewS.advertencias;
esValido = this.previewS.esValido;
```

---

## 7. Diagrama de Flujo UI/UX

```
CONSTRUCTOR DE REPORTES - FLUJO PASO A PASO
============================================

[1. Metadata del Reporte]
  Usuario escribe: nombre, descripcion
  Selecciona: tipo de visualizacion (table-simple | table-comparative | ...)
  Marca si es Plantilla
  
  Estado de validacion: nombre requerido (inline)
         |
         v

[2. Columnas de Datos]
  Agregar columna ->  selecciona: tipo periodo (mes / acumulado / anual)
                                  fuente (contabilidad / presupuesto)
                                  año, mes (si aplica)
  Puede tener N columnas
  
  Estado: al menos 1 columna requerida
         |
         v

[3. Secciones y Renglones]
  Agregar seccion (titulo de grupo, ej: "INGRESOS")
    |
    +-- Agregar renglon
          Tipo: [cuenta] -> AccountTreeSelectComponent
                             Usuario expande arbol, selecciona hojas (nivel 3)
                             o nodos intermedios (nivel 1/2 para rango automatico)
                             Badge de nivel, saldo actual visible
                             Signo: SUMAR (+1) | RESTAR (-1)
                
               [subtotal] -> selecciona renglones de origen (multiselect)
               
               [formula]  -> expresion: "[renglon-id] + [otro-id]"
                             Validacion inline: placeholders deben existir
               
               [encabezado] -> solo label
               [separador]  -> espacio visual
  
  Drag & drop para reordenar renglones
  Panel lateral: advertencias de ReportPreviewService (reactivas)
         |
         v

[4. Preview y Guardar]
  Badge "N advertencias" visible durante construccion
  Boton "Preview" deshabilitado si hay errores criticos
  Boton "Guardar" -> FormHelper.submitCrud() (si metadata simple) o guardar manual
  
  Al guardar -> redirect a catalogo de reportes

EJECUCION DE REPORTE (ReportViewer)
=====================================

  Selecciona año / mes -> POST /execute
  Resultado muestra por tipo de visualizacion:
    table-simple     -> tabla estandar
    table-twoColumn  -> dos columnas izquierda/derecha
    table-comparative -> cargo | abono | resultado
    table-budgetVsActual -> real | presupuesto | variacion | %
    summary-cards    -> KPIs de renglones grandTotal/subtotal bold
  Advertencias del motor mostradas en toast
  Botones: Exportar Excel | PDF | Compartir URL

ESTADOS DE VALIDACION
======================

  Cuenta seleccionada pero no encontrada en catalogo -> badge "No encontrada" en rojo
  Formula con placeholder inexistente -> subrayado rojo en formula
  Subtotal sin origenes -> icono de advertencia en renglon
  Reporte sin columnas -> boton Guardar deshabilitado
  Reporte sin secciones -> boton Guardar deshabilitado
```

---

## 8. Correcciones de Cumplimiento GEMINI.md

### 8.1 report-builder.ts

| Violacion Actual | Correccion |
|-----------------|------------|
| `import { CommonModule }` | Eliminar. Usar `@if`, `@for`, `@switch`, `NgClass` standalone |
| `import { FormsModule }` | Eliminar. No se usa `ngModel` |
| `FormHelper.submitCrud()` no usado | Aplica para la metadata (name, description, visualizationType, isTemplate). El body completo requiere ensamblado manual previo al submit, por lo que el patron correcto es: ensamblar `dto` con signals, luego invocar `FormHelper.submitCrud()` pasando el dto pre-construido como override, o mantener la llamada manual justificada |
| Sin `app-data-view-mobile` | El catalogo de reportes (`report-catalog.ts`) debe incluir su version movil. El builder en si es una pagina de edicion compleja (similar a un formulario de detalle), no un listado; no aplica el patron DataViewMobile directamente |
| `ReactiveFormsModule` mezclado con signals | El grupo `form` para metadata es correcto con FormGroup. Las secciones/columnas como signals es correcto. La mezcla esta justificada por la naturaleza hibrida del formulario |

### 8.2 ReportDefinitionService.UpdateAsync

```csharp
// ANTES (inseguro: usa dato del cliente)
User = dto.CreatedBy,

// DESPUES (seguro: usa identidad del servidor)
// Inyectar ICurrentUserService en el constructor
User = currentUserService.GetEmail() ?? "sistema",
```

### 8.3 AccountFilterDTO

```csharp
// ANTES (posible null en nullable context)
public string RangeFrom { get; set; }
public string RangeTo { get; set; }

// DESPUES
public string RangeFrom { get; set; } = string.Empty;
public string RangeTo { get; set; } = string.Empty;
```

---

## 9. Plan de Migracion

### Fase 1: Backend sin ruptura (sin migracion de base de datos)

1. Crear `AccountCatalogService` + `IAccountCatalogService` en `Modules/Contabilidad/Features/Shared/`.
2. Registrar en DI: `services.AddScoped<IAccountCatalogService, AccountCatalogService>()`.
3. Agregar `AccountTreeNodeDTO` y `AccountFlatItemDTO` en la carpeta Shared.
4. Actualizar `IDynamicReportEngineService` para agregar `GetAccountTreeAsync`.
5. Actualizar `DynamicReportEngineService` para inyectar `IAccountCatalogService` y delegar los metodos de catalogo.
6. Agregar endpoint `GET .../accounts/{id}/{year}/tree` en `DynamicReportController`.
7. Agregar roles en todos los verbos del controlador.
8. Reemplazar `FormulaEvaluatorService` con `SafeArithmeticEvaluator` (mismo nombre de metodo `Evaluate`, compatibilidad total).
9. Corregir `UpdateAsync` para usar `ICurrentUserService`.
10. Corregir `AccountFilterDTO` nullables.

**Compatibilidad:** Los reportes existentes en base de datos no requieren cambios. El `DefinitionJson` almacenado sigue siendo valido. Los endpoints existentes (`/accounts/{id}/{year}`) siguen funcionando (ahora usan `IAccountCatalogService` internamente).

### Fase 2: Frontend incremental

1. Agregar `IAccountTreeNode`, `IAccountFlatItem` en `report-definition.interface.ts`.
2. Crear `AccountCatalogService` Angular con cache.
3. Crear `ReportPreviewService`.
4. Crear `AccountTreeSelectComponent`.
5. Actualizar `report-builder.ts`:
   a. Reemplazar autocomplete de cuentas con `AccountTreeSelectComponent`.
   b. Integrar `ReportPreviewService` para advertencias reactivas.
   c. Limpiar imports (`CommonModule`, `FormsModule`).
6. El HTML del builder actualiza el bloque de seleccion de cuentas por renglon.

**Compatibilidad:** Los reportes existentes se cargan y editan sin cambios. La seleccion de cuentas existente (lista `accountNumbers`) sigue siendo el contrato backend. Solo cambia el selector visual en el builder.

### Fase 3: Calidad

1. Agregar FluentValidation a `ReportDefinitionDTO` y `ExecuteReportRequestDTO`.
2. Pruebas unitarias para `SafeArithmeticEvaluator` (cubrir: suma, resta, negativos, division por cero, parentesis anidados, caracter invalido).
3. Pruebas unitarias para `AccountCatalogService.ConstruirArbol` con datos de muestra.

---

## 10. Checklist de Cumplimiento GEMINI.md

| Regla | Estado | Accion |
|-------|--------|--------|
| Primary Constructors en todos los servicios nuevos | Cumple | AccountCatalogService usa primary constructor |
| Prohibido AutoMapper en consultas (.Select() manual) | Cumple | MapToNode() es proyeccion manual |
| Siempre retornar ApiResponseDTO | Cumple | Todos los metodos de servicio retornan ApiResponseDTO<T> |
| Uso exclusivo de Signals, prohibido @Input/@Output | Cumple | AccountTreeSelectComponent usa input(), model(), signal() |
| Implementar app-data-view-mobile en listados | Pendiente | Aplica al catalogo de reportes (report-catalog), no al builder |
| FormHelper.submitCrud() en formularios | Parcial | Metadata simple lo puede usar; body complejo requiere ensamblado previo |
| Documentacion en espanol | Cumple | Todos los mensajes de error y logs en espanol |
| IDs como Guid | Cumple | Sin cambios a entidades existentes |
| UTF-8 sin BOM | Cumple | Verificar en archivos nuevos al crear |
| Sin emojis ni caracteres especiales | Cumple | Este documento usa solo ASCII estandar en ejemplos de codigo |
| Standalone components Angular | Cumple | AccountTreeSelectComponent no declara standalone: true (es default) |
| Lazy loading con loadComponent | Cumple | Sin cambios a routing existente |
| AsNoTracking() en consultas de solo lectura | Cumple | ReportDefinitionService ya lo usa; AccountCatalogService no usa EF |
| Nomenclatura de endpoints kebab-case | Cumple | Nuevo endpoint /accounts/{id}/{year}/tree sigue la convencion |
| Roles explicitos en controladores | Requiere cambio | DynamicReportController actualizado en seccion 5.1 |

---

## 11. Metricas de Usabilidad Objetivo

| Metrica | Estado Actual | Objetivo |
|---------|---------------|----------|
| Pasos para crear un reporte de 3 renglones | 6+ (nombre, columna, seccion, 3 renglones con tipado manual) | 4 (nombre, columna, seccion, seleccion en arbol) |
| Tiempo hasta primera cuenta seleccionada | ~15s (busqueda textual, sin contexto jerarquico) | ~5s (arbol expandido por grupo, seleccion visual) |
| Tasa de renglones con "ninguna cuenta coincide" | Desconocida (sin telemetria) | 0 (validacion inmediata en ReportPreviewService) |
| Cuentas invalidas detectadas antes de ejecutar | 0 (solo se detectan al ejecutar) | Inmediato (computed() en ReportPreviewService) |
| Soporte movil en catalogo de reportes | No | Si (requiere app-data-view-mobile en report-catalog) |
