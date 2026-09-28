# Backend: Export Services (Excel & PDF Generation)

**Última revisión:** 2026-08-06  
**Derivado de:** CONVENTIONS.md §3 (Backend Rules) + exploración codebase  
**Severidad:** 🟠 ALTA — Patrón obligatorio cuando se exportan datos

---

## Propósito

Documentar el patrón de **exportación a Excel y PDF** en backend (.NET 10). Define librerías oficiales, servicios compartidos, y cómo integrar con frontend.

---

## Regla de Oro

```
Exportación en Backend = Servicios Compartidos Oficiales

❌ NO: Usar librerías directamente en features, duplicar lógica de exportación
✅ SÍ: IExportToExcelService, IMergePdfService, servicios centralizados en Providers
```

---

## 1. Excel Export (ClosedXML)

### Librería Oficial: ClosedXML

**Ubicación real:** `api/LuxuryApp.Application/Infrastructure/Providers/Services/ExportToExcelService.cs`

**Versión:** referenciada en `api/LuxuryApp.Application/LuxuryApp.Application.csproj` (proyecto único desde la Arquitectura Monolítica Unificada, 2026-09-01 — ya no hay `LuxuryApp.Providers.csproj` separado).

```xml
<!-- api/LuxuryApp.Application/LuxuryApp.Application.csproj (verificado 2026-09-09) -->
<PackageReference Include="ClosedXML" Version="0.105.0" />
```

### IExportToExcelService Interface

```csharp
namespace Infrastructure.Providers.Services;

public interface IExportToExcelService
{
    /// <summary>
    /// Crea un archivo Excel con datos tabulares y retorna FileContentResult.
    /// </summary>
    FileContentResult ExportToExcel(
        IEnumerable<IEnumerable<string>> data,
        List<string> columnNames,
        string sheetName
    );
}
```

### Implementación Canónica

**Ubicación real:** `api/LuxuryApp.Application/Infrastructure/Providers/Services/ExportToExcelService.cs`

```csharp
using ClosedXML.Excel;
using System.Data;

namespace Infrastructure.Providers.Services;

/// <summary>
/// Implementación del servicio de exportación a Excel utilizando ClosedXML.
/// Genera archivos XLSX con formato básico, estilos y ajuste automático de columnas.
/// </summary>
public class ExportToExcelService : IExportToExcelService
{
    /// <summary>
    /// Exporta datos a Excel con formato automático.
    /// </summary>
    /// <param name="data">Datos tabulares (cada IEnumerable<string> es una fila)</param>
    /// <param name="columnNames">Nombres de columnas (encabezado)</param>
    /// <param name="sheetName">Nombre de la hoja de cálculo</param>
    /// <returns>FileContentResult con MIME type Excel</returns>
    public FileContentResult ExportToExcel(
        IEnumerable<IEnumerable<string>> data,
        List<string> columnNames,
        string sheetName)
    {
        // PASO 1: Crear DataTable desde datos
        DataTable dataTable = new(sheetName);
        dataTable.Columns.AddRange(
            columnNames.Select(colName => new DataColumn(colName)).ToArray()
        );

        foreach (var row in data)
        {
            dataTable.Rows.Add(row.ToArray());
        }

        // PASO 2: Crear workbook y hoja
        using var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add(dataTable);

        // PASO 3: Aplicar estilos a toda la tabla
        var tabla = ws.Range(
            ws.Cell(1, 1),
            ws.Cell(dataTable.Rows.Count + 1, dataTable.Columns.Count)
        );

        tabla.Style.Font.FontSize = 12;
        tabla.Style.Alignment.SetVertical(XLAlignmentVerticalValues.Center);

        // PASO 4: Ajustar ancho de columnas automáticamente
        ws.Columns().AdjustToContents();

        // PASO 5: Establecer altura de filas
        for (int r = 1; r <= dataTable.Rows.Count + 1; r++)
        {
            ws.Row(r).Height = 25;
        }

        // PASO 6: Guardar en memoria y retornar
        using MemoryStream stream = new();
        wb.SaveAs(stream);

        return new FileContentResult(
            stream.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        {
            FileDownloadName = $"{sheetName}_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx"
        };
    }
}
```

### Registro en DependencyInjection

**Ubicación real (verificado 2026-09-09):** `api/LuxuryApp.Application/Infrastructure/Providers/Extensions/ProvidersServiceCollectionExtensions.cs`, método `AddLuxuryProviders()`, invocado desde `api/LuxuryApp.Api/Program.cs`. (`DependencyInjection.Infrastructure.cs` solo conserva las líneas de registro viejas comentadas, con nota "Movido a AddLuxuryProviders".)

```csharp
// api/LuxuryApp.Application/Infrastructure/Providers/Extensions/ProvidersServiceCollectionExtensions.cs
public static IServiceCollection AddLuxuryProviders(this IServiceCollection services)
{
    services.AddTransient<IExportToExcelService, ExportToExcelService>();
    services.AddTransient<IMergePdfService, MergePdfService>();
    // ... resto de providers (email, WhatsApp, OneSignal, geolocalización, etc.)

    return services;
}
```

### Consumo en Endpoints

```csharp
namespace ContabilidadLuxuryApp.DynamicReports.EndPoints;

public static class ReportExcelExportEndpoints
{
    public static void MapReportExcelExportEndpoints(this WebApplication app)
    {
        app.MapPost(
            "/api/reports/export-excel",
            ExportReportToExcel
        )
        .WithName("ExportReportToExcel")
        .WithOpenApi()
        .Produces<FileContentResult>(StatusCodes.Status200OK)
        .RequireAuthorization();
    }

    private static async Task<IResult> ExportReportToExcel(
        [FromBody] ReportFilterDto filter,
        IReportAppService reportService,
        IExportToExcelService exportService,
        CancellationToken cancellationToken)
    {
        // PASO 1: Obtener datos del reporte
        var reportData = await reportService.GetReportData(filter, cancellationToken);

        // PASO 2: Transformar a formato tabular
        var headers = new List<string>
        {
            "ID",
            "Concepto",
            "Monto",
            "Fecha",
            "Estado"
        };

        var rows = reportData.Select(item => new[]
        {
            item.Id.ToString(),
            item.Concepto,
            item.Monto.ToString("C2"),
            item.Fecha.ToString("yyyy-MM-dd"),
            item.Estado
        });

        // PASO 3: Exportar usando servicio compartido
        var result = exportService.ExportToExcel(
            rows,
            headers,
            "Reporte Contable"
        );

        return result;
    }
}
```

---

## 2. PDF Merge & Manipulation (PdfSharpCore)

### Librería Oficial: PdfSharpCore (⚠️ no `PdfSharp` — es el fork cross-platform)

**Versión:** referenciada en `api/LuxuryApp.Application/LuxuryApp.Application.csproj` (proyecto único desde la Arquitectura Monolítica Unificada, 2026-09-01 — ya no hay `LuxuryApp.Providers.csproj` separado).

```xml
<!-- api/LuxuryApp.Application/LuxuryApp.Application.csproj (verificado 2026-09-09) -->
<PackageReference Include="PdfSharpCore" Version="1.3.67" />
```

### IMergePdfService Interface

```csharp
namespace Infrastructure.Providers.Services;

public interface IMergePdfService
{
    /// <summary>
    /// Realiza la lectura secuencial de PDFs y los ensambla en un solo documento.
    /// </summary>
    void MergeFilesPdf(string directorio);
    
    /// <summary>
    /// Retorna el contenido del PDF mergeado como byte array.
    /// </summary>
    byte[] MergeFilesPdfToBytes(string[] pdfFiles);
}
```

### Implementación Canónica

**Ubicación real:** `api/LuxuryApp.Application/Infrastructure/Providers/Services/MergePdfService.cs`

```csharp
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;

namespace Infrastructure.Providers.Services;

/// <summary>
/// Implementación del servicio de unión de PDFs utilizando PdfSharpCore.
/// Realiza la lectura secuencial de componentes del reporte mensual y los ensambla.
/// </summary>
public class MergePdfService : IMergePdfService
{
    /// <summary>
    /// Realiza la lectura secuencial de los componentes del reporte mensual
    /// y los ensambla en un solo documento en disco.
    /// </summary>
    public void MergeFilesPdf(string directorio)
    {
        // PASO 1: Definir archivos fuente en orden
        string[] pdfFiles =
        {
            Path.Combine(directorio, "Portada.pdf"),
            Path.Combine(directorio, "Contabilidad.pdf"),
            Path.Combine(directorio, "Operaciones.pdf")
        };

        string outputFile = Path.Combine(directorio, "Final.pdf");

        // PASO 2: Validar que todos los PDFs existen
        foreach (var file in pdfFiles)
        {
            if (!File.Exists(file))
            {
                throw new FileNotFoundException($"Archivo PDF no encontrado: {file}");
            }
        }

        // PASO 3: Crear documento de salida
        PdfDocument outputPdf = new();

        // PASO 4: Iterar archivos y copiar páginas
        foreach (string pdfFile in pdfFiles)
        {
            try
            {
                // Abrir PDF en modo lectura
                PdfDocument inputPdf = PdfReader.Open(
                    pdfFile,
                    PdfDocumentOpenMode.Import,
                    PdfReadAccuracy.Strict
                );

                // Copiar todas las páginas al documento de salida
                for (int pageIndex = 0; pageIndex < inputPdf.PageCount; pageIndex++)
                {
                    PdfPage page = inputPdf.Pages[pageIndex];
                    outputPdf.AddPage(page);
                }

                inputPdf.Close();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(
                    $"Error procesando PDF: {pdfFile}", ex
                );
            }
        }

        // PASO 5: Guardar documento consolidado
        try
        {
            outputPdf.Save(outputFile);
        }
        finally
        {
            outputPdf.Close();
        }
    }

    /// <summary>
    /// Realiza merge de PDFs y retorna como byte array (para descarga en memoria).
    /// </summary>
    public byte[] MergeFilesPdfToBytes(string[] pdfFiles)
    {
        PdfDocument outputPdf = new();

        foreach (string pdfFile in pdfFiles)
        {
            if (!File.Exists(pdfFile))
            {
                throw new FileNotFoundException($"Archivo PDF no encontrado: {pdfFile}");
            }

            try
            {
                PdfDocument inputPdf = PdfReader.Open(
                    pdfFile,
                    PdfDocumentOpenMode.Import,
                    PdfReadAccuracy.Strict
                );

                for (int pageIndex = 0; pageIndex < inputPdf.PageCount; pageIndex++)
                {
                    outputPdf.AddPage(inputPdf.Pages[pageIndex]);
                }

                inputPdf.Close();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(
                    $"Error procesando PDF: {pdfFile}", ex
                );
            }
        }

        using MemoryStream stream = new();
        outputPdf.Save(stream, false);
        outputPdf.Close();

        return stream.ToArray();
    }
}
```

### Consumo en Endpoints

```csharp
public static class MeetingReportEndpoints
{
    public static void MapMeetingReportEndpoints(this WebApplication app)
    {
        app.MapPost(
            "/api/meetings/{meetingId}/export-report",
            ExportMeetingReportPdf
        )
        .WithName("ExportMeetingReportPdf")
        .WithOpenApi()
        .Produces<FileContentResult>(StatusCodes.Status200OK)
        .RequireAuthorization();
    }

    private static async Task<IResult> ExportMeetingReportPdf(
        Guid meetingId,
        IMeetingReportService reportService,
        IMergePdfService mergePdfService,
        IFileWritePathService fileWriteService,
        CancellationToken cancellationToken)
    {
        // PASO 1: Obtener información del meeting
        var meeting = await reportService.GetMeetingAsync(meetingId, cancellationToken);

        // PASO 2: Generar PDFs individuales (Portada, Contabilidad, Operaciones)
        var tempDir = Path.Combine(Path.GetTempPath(), $"meeting_{meetingId}");
        Directory.CreateDirectory(tempDir);

        try
        {
            await reportService.GenerateCoverPageAsync(meeting, Path.Combine(tempDir, "Portada.pdf"), cancellationToken);
            await reportService.GenerateAccountingReportAsync(meeting, Path.Combine(tempDir, "Contabilidad.pdf"), cancellationToken);
            await reportService.GenerateOperationsReportAsync(meeting, Path.Combine(tempDir, "Operaciones.pdf"), cancellationToken);

            // PASO 3: Mergear PDFs
            string[] pdfFiles =
            {
                Path.Combine(tempDir, "Portada.pdf"),
                Path.Combine(tempDir, "Contabilidad.pdf"),
                Path.Combine(tempDir, "Operaciones.pdf")
            };

            byte[] mergedPdf = mergePdfService.MergeFilesPdfToBytes(pdfFiles);

            // PASO 4: Retornar al cliente
            return Results.File(
                mergedPdf,
                "application/pdf",
                $"Meeting_{meeting.Number}_{DateTime.Now:yyyyMMdd}.pdf"
            );
        }
        finally
        {
            // PASO 5: Limpiar archivos temporales
            Directory.Delete(tempDir, true);
        }
    }
}
```

---

## 3. Patrón: CSV Export Adicional

### CSV es más ligero que Excel

```csharp
public static class CsvExportHelper
{
    public static FileContentResult ExportToCsv(
        IEnumerable<IEnumerable<string>> data,
        List<string> columnNames,
        string fileName)
    {
        using StringWriter sw = new();
        using CsvWriter csv = new(sw, CultureInfo.InvariantCulture);

        // Escribir encabezados
        foreach (var column in columnNames)
        {
            csv.WriteField(column);
        }
        csv.NextRecord();

        // Escribir datos
        foreach (var row in data)
        {
            foreach (var field in row)
            {
                csv.WriteField(field);
            }
            csv.NextRecord();
        }

        byte[] fileContents = Encoding.UTF8.GetBytes(sw.ToString());

        return new FileContentResult(
            fileContents,
            "text/csv"
        )
        {
            FileDownloadName = $"{fileName}_{DateTime.Now:yyyyMMdd_HHmmss}.csv"
        };
    }
}
```

---

## 4. Verificaciones de Auditoría

### Checklist de Export Services

- [ ] ¿Usa `IExportToExcelService` si exporta a Excel?
- [ ] ¿Usa `IMergePdfService` si mergea PDFs?
- [ ] ¿Servicios de export están en `api/LuxuryApp.Application/Infrastructure/Providers/`?
- [ ] ¿Registrados en DependencyInjection?
- [ ] ¿Inyectados en endpoints, no instanciados directamente?
- [ ] ¿Manejo de excepciones (archivo no encontrado, permisos)?
- [ ] ¿Limpieza de archivos temporales en finally?
- [ ] ¿FileDownloadName con timestamp para evitar caché?
- [ ] ¿MIME types correctos (xlsx, pdf, csv)?
- [ ] ¿Validación de datos antes de exportar?

### Comandos de Validación

```bash
# Buscar si se usa ClosedXML directamente en features (debería estar 0)
grep -r "XLWorkbook\|ClosedXML" api/LuxuryApp.Application --include="*.cs" | \
  grep -v "Providers"

# Buscar si se usa PdfSharpCore directamente en features (debería estar 0)
grep -r "PdfDocument\|PdfSharpCore" api/LuxuryApp.Application --include="*.cs" | \
  grep -v "Providers"

# Validar que ExportToExcelService está registrado
grep -r "IExportToExcelService" api/LuxuryApp.Api --include="*.cs"

# Validar que MergePdfService está registrado
grep -r "IMergePdfService" api/LuxuryApp.Api --include="*.cs"

# Buscar endpoints que exportan datos
grep -r "ExportToExcel\|MergePdf" api/LuxuryApp.Application --include="*.cs" | \
  grep -v "Services\|Interfaces"
```

---

## 5. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| Usar ClosedXML directamente en feature | Inyectar IExportToExcelService | Centralización, reutilización |
| Usar PdfSharpCore directamente en feature | Inyectar IMergePdfService | Centralización, reutilización |
| Crear servicio export local en feature | Usar servicio compartido en Infrastructure/Providers | Evitar duplicación |
| No limpiar archivos temporales | Usar try/finally para Directory.Delete | Evitar llenar disco |
| FileDownloadName sin timestamp | Agregar timestamp: `file_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx` | Evitar caché del navegador |
| Sin validación de datos | Validar antes de exportar | Evitar archivos corruptos |
| Sin manejo de excepciones | Try/catch con FileNotFoundException | Respuestas útiles a cliente |
| Retornar MIME type incorrecto | xlsx: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | Navegador interpreta correctamente |

---

## 6. Referencias y Documentos Relacionados

- [CONVENTIONS.md §3 — Backend Rules](../CONVENTIONS.md#3-backend-rules)
- [Backend Rules](./backend-rules.md) — Reglas generales backend
- [Backend Generic Services Catalog](./backend-generic-services-catalog.md)
- [Frontend Export & Download Services](../frontend/frontend-export-download-services.md) — Complementario frontend
- ClosedXML Docs: [GitHub](https://github.com/ClosedXML/ClosedXML)
- PdfSharpCore (⚠️ no confundir con el `PdfSharp` original — es un fork distinto para .NET cross-platform; no se agrega URL aquí sin verificarla primero)

---

**Última actualización:** 2026-09-09  
**Vigencia:** .NET 10 (ClosedXML 0.105.0, PdfSharpCore 1.3.67 — verificado contra `LuxuryApp.Application.csproj`)  
**Aplicable a:** Todos los endpoints que exportan datos
