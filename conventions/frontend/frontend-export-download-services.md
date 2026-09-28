# Frontend: Export & Download Services (Excel, PDF, CSV)

**Última revisión:** 2026-08-06  
**Derivado de:** CONVENTIONS.md §4 (Frontend Rules) + exploración codebase  
**Severidad:** 🟠 ALTA — Patrón obligatorio para export/download

---

## Propósito

Documentar el patrón de **exportación y descarga de datos** en frontend (Angular 22). Define librerías oficiales, servicios compartidos, y cómo integrar con backend.

---

## Regla de Oro

```
Export/Download en Frontend = Servicios Compartidos Oficiales

❌ NO: Usar librerías directamente en features, duplicar lógica de descarga
✅ SÍ: ExportService centralizado, usar file-saver, exceljs, integración con backend
```

---

## 1. Libraries Oficiales

### package.json Dependencies

```json
{
  "dependencies": {
    "exceljs": "^4.4.0",      // Generar Excel en frontend
    "file-saver": "^2.0.5",   // Descargar archivos (blob → disk)
    "ng2-pdf-viewer": "^10.4.0", // Visualizar PDFs
    "pdfjs-dist": "^6.1.200"  // Renderizar PDFs
  }
}
```

**Ubicación en proyecto:** `appsweb/angular/package.json`

---

## 2. File Download Pattern

### Servicio Base: ExportService

```typescript
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExportService {
  /**
   * Descarga blob como archivo.
   * @param blob Contenido del archivo
   * @param filename Nombre del archivo descargado
   * @param mimeType MIME type (ej: 'application/pdf')
   */
  downloadFile(blob: Blob, filename: string, mimeType: string = 'application/octet-stream'): void {
    const file = new Blob([blob], { type: mimeType });
    saveAs(file, filename);
  }

  /**
   * Descarga desde URL (backend).
   * @param apiUrl URL del endpoint de descarga
   * @param filename Nombre del archivo
   */
  downloadFromUrl(apiUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = apiUrl;
    link.download = filename;
    link.click();
  }

  /**
   * Descarga con timestamp para evitar caché.
   */
  downloadFileWithTimestamp(
    blob: Blob,
    baseFileName: string,
    extension: string,
    mimeType: string
  ): void {
    const timestamp = this.getTimestamp();
    const filename = `${baseFileName}_${timestamp}.${extension}`;
    this.downloadFile(blob, filename, mimeType);
  }

  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace(/[-:]/g, '').substring(0, 15);
    // Resultado: 20260806T143025
  }
}
```

### Consumo en Componente

```typescript
@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ReportListComponent {
  private api = inject(ApiResponseService);
  private exportService = inject(ExportService);

  // Descargar reporte como PDF desde backend
  downloadReportPdf(reportId: string): void {
    this.api.onGet<Blob>(
      `api/reports/${reportId}/export-pdf`,
      { responseType: 'blob' as 'json' } // Angular trick: cast to blob
    ).subscribe({
      next: (blob: Blob) => {
        this.exportService.downloadFileWithTimestamp(
          blob,
          `Report_${reportId}`,
          'pdf',
          'application/pdf'
        );
      },
      error: (err) => console.error('Download failed:', err)
    });
  }

  // Descargar reporte como Excel desde backend
  downloadReportExcel(reportId: string): void {
    this.api.onGet<Blob>(
      `api/reports/${reportId}/export-excel`,
      { responseType: 'blob' as 'json' }
    ).subscribe({
      next: (blob: Blob) => {
        this.exportService.downloadFileWithTimestamp(
          blob,
          `Report_${reportId}`,
          'xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
      },
      error: (err) => console.error('Download failed:', err)
    });
  }
}
```

---

## 3. Excel Generation (exceljs)

### Generar Excel en Frontend (Cliente)

```typescript
import { Workbook, Worksheet } from 'exceljs';

@Injectable({ providedIn: 'root' })
export class ExcelExportService {
  constructor(private exportService: ExportService) {}

  /**
   * Genera y descarga Excel con datos tabulares.
   */
  exportToExcel<T>(
    data: T[],
    columns: ExcelColumn[],
    sheetName: string = 'Sheet1',
    fileName: string = 'export'
  ): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // PASO 1: Configurar encabezados
    worksheet.columns = columns.map(col => ({
      header: col.header,
      key: col.key,
      width: col.width ?? 15
    }));

    // PASO 2: Formatear encabezados
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' } // Azul
    };

    // PASO 3: Agregar datos
    worksheet.addRows(data);

    // PASO 4: Formatear celdas
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.alignment = { horizontal: 'center', vertical: 'center' };
        
        // Colorear filas alternas
        if (rowNumber > 1 && rowNumber % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF2F2F2' }
          };
        }
      });
    });

    // PASO 5: Generar y descargar
    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      this.exportService.downloadFileWithTimestamp(
        blob,
        fileName,
        'xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    });
  }
}

// Interfaz para definir columnas
export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}
```

### Consumo en Componente

```typescript
@Component({
  selector: 'app-cobranza-list',
  standalone: true,
  imports: [CommonModule]
})
export class CobranzaListComponent {
  cobranzas = signal<CobranzaDto[]>([]);
  private excelService = inject(ExcelExportService);

  exportToExcel(): void {
    const columns: ExcelColumn[] = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Concepto', key: 'concepto', width: 30 },
      { header: 'Monto', key: 'monto', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Estado', key: 'estado', width: 15 }
    ];

    this.excelService.exportToExcel(
      this.cobranzas(),
      columns,
      'Cobranza',
      'Cobranza Report'
    );
  }
}
```

---

## 4. PDF Viewing Pattern

### Visualizar PDF desde URL (Backend)

```typescript
@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [PdfViewerComponent],
  template: `
    <div class="pdf-container">
      <!-- ✅ CORRECTO: Usar ng2-pdf-viewer con URL del backend -->
      <ng2-pdf-viewer
        [src]="pdfUrl()"
        [page]="currentPage()"
        [render-text]="true"
        [autoresize]="true"
        [show-handtool]="true"
        (onDocumentLoad)="onPdfLoaded($event)"
        (onPageChange)="onPageChange($event)">
      </ng2-pdf-viewer>

      <!-- Controles de navegación -->
      <div class="pdf-controls">
        <button 
          (click)="previousPage()"
          [disabled]="currentPage() <= 1">
          ← Anterior
        </button>
        <span>Página {{ currentPage() }} de {{ totalPages() }}</span>
        <button 
          (click)="nextPage()"
          [disabled]="currentPage() >= totalPages()">
          Siguiente →
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pdf-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .pdf-controls {
      padding: 12px;
      display: flex;
      gap: 12px;
      justify-content: center;
      background: var(--ds-bg-secondary);
      border-top: 1px solid var(--ds-border-neutral);
    }
  `]
})
export class PdfViewerComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiResponseService);

  // Señales para estado del PDF
  pdfUrl = signal<string>('');
  currentPage = signal<number>(1);
  totalPages = signal<number>(0);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const documentId = params['id'];
      this.loadPdfUrl(documentId);
    });
  }

  private loadPdfUrl(documentId: string): void {
    // ✅ CORRECTO: URL segura desde backend
    this.pdfUrl.set(`/api/documents/${documentId}/pdf`);
  }

  onPdfLoaded(pdf: any): void {
    this.totalPages.set(pdf.numPages);
  }

  onPageChange(event: any): void {
    this.currentPage.set(event);
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  downloadPdf(): void {
    const documentId = this.route.snapshot.params['id'];
    window.location.href = `/api/documents/${documentId}/download-pdf`;
  }
}
```

---

## 5. MIME Types Reference

### Tabla de Tipos

| Formato | MIME Type | Extensión | Generador |
|---------|-----------|-----------|-----------|
| Excel | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | `.xlsx` | exceljs / Backend (ClosedXML) |
| Excel Legacy | `application/vnd.ms-excel` | `.xls` | (deprecado) |
| PDF | `application/pdf` | `.pdf` | Backend (PdfSharp) |
| CSV | `text/csv` | `.csv` | Backend / Frontend |
| ZIP | `application/zip` | `.zip` | Backend |
| JSON | `application/json` | `.json` | Backend |
| Text | `text/plain` | `.txt` | Backend |

---

## 6. Patrón: Descarga con Progreso

### Mostrar Progreso de Descarga

```typescript
@Injectable({ providedIn: 'root' })
export class ProgressiveDownloadService {
  private httpClient = inject(HttpClient);
  private exportService = inject(ExportService);

  /**
   * Descarga con indicador de progreso.
   */
  downloadWithProgress(
    url: string,
    filename: string
  ): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(url, {
      reportProgress: true,
      responseType: 'blob'
    }).pipe(
      tap(event => {
        if (event.type === HttpEventType.DownloadProgress && event.total) {
          const progress = Math.round((event.loaded / event.total) * 100);
          console.log(`Download progress: ${progress}%`);
        }
      }),
      tap(event => {
        if (event.type === HttpEventType.Response && event.body) {
          this.exportService.downloadFile(event.body, filename);
        }
      })
    );
  }
}
```

### Consumo con Spinner

```typescript
@Component({
  template: `
    <button (click)="download()" [disabled]="isDownloading()">
      {{ isDownloading() ? 'Descargando...' : 'Descargar' }}
    </button>
  `
})
export class DownloadButtonComponent {
  isDownloading = signal(false);
  private progressService = inject(ProgressiveDownloadService);

  download(): void {
    this.isDownloading.set(true);
    
    this.progressService.downloadWithProgress(
      '/api/reports/export-large.xlsx',
      'Large Report.xlsx'
    ).subscribe({
      complete: () => this.isDownloading.set(false),
      error: (err) => {
        console.error('Download failed:', err);
        this.isDownloading.set(false);
      }
    });
  }
}
```

---

## 7. Verificaciones de Auditoría

### Checklist de Export/Download

- [ ] ¿Usa `ExportService` centralizado para descargas?
- [ ] ¿Inyecta `ExcelExportService` si genera Excel en cliente?
- [ ] ¿Descarga desde backend usa `ApiResponseService`?
- [ ] ¿MIME types correctos en API responses?
- [ ] ¿FileDownloadName o timestamp para evitar caché?
- [ ] ¿PDF viewer usa `ng2-pdf-viewer` oficial?
- [ ] ¿URLs de PDF son seguras (no rutas físicas)?
- [ ] ¿Sin lógica export duplicada en features?
- [ ] ¿Manejo de errores en download (network, permission)?
- [ ] ¿TypeScript tipado: `responseType: 'blob' as 'json'`?

### Comandos de Validación

```bash
# Buscar descargas sin ExportService (debería estar 0)
grep -r "saveAs\|download\|blob" appsweb/angular/src/app --include="*.ts" | \
  grep -v "ExportService\|excelService" | grep -v "node_modules"

# Validar que ng2-pdf-viewer se usa en PdfViewerComponent
grep -r "ng2-pdf-viewer\|PdfViewerComponent" appsweb/angular/src/app --include="*.ts" \
  | head -5

# Buscar MIME types hardcodeados
grep -r "application/pdf\|application/vnd" appsweb/angular/src/app --include="*.ts" | \
  grep -v "ExportService\|services" | head -10

# Validar exceljs solo en servicios
grep -r "from 'exceljs'" appsweb/angular/src/app --include="*.ts" | \
  grep -v "export.*service\|ExcelExportService"
```

---

## 8. Anti-patrones

| ❌ Incorrecto | ✅ Correcto | Razón |
|---|---|---|
| Usar `saveAs` directamente en componente | Inyectar `ExportService` | Centralización, reutilización |
| Hardcodear MIME types | Usar constante o argumento | Mantenibilidad |
| Descargar sin timestamp | Agregar timestamp en filename | Evitar caché del navegador |
| Usar archivo físico en frontend | Usar blob desde API | Seguridad, no exponer rutas |
| Generar Excel grande en cliente | Generar en backend | Performance, no bloquea UI |
| Sin error handling en download | Try/catch + usuario-facing error | UX mejorada |
| Usar PdfSharp en frontend | Usar ng2-pdf-viewer | Frontend no tiene .NET |
| responseType: 'json' para blob | `responseType: 'blob' as 'json'` | Angular type system |

---

## 9. Integración Backend-Frontend

### Flujo Completo: Descargar Excel Generado en Backend

**Backend:**
```csharp
// POST /api/reports/export-excel
public async Task<IActionResult> ExportReportExcel(
    [FromBody] ReportFilterDto filter)
{
    var data = await _service.GetReportData(filter);
    return _exportService.ExportToExcel(data, columns, "Report");
    // Retorna: FileContentResult con blob
}
```

**Frontend:**
```typescript
// Componente
downloadReportExcel(filtro: ReportFilterDto): void {
  this.api.onPost<Blob>(
    'api/reports/export-excel',
    filtro,
    { responseType: 'blob' as 'json' }
  ).subscribe(blob => {
    this.exportService.downloadFileWithTimestamp(
      blob, 'Report', 'xlsx', 'application/vnd.openxmlformats-...'
    );
  });
}
```

---

## 10. Referencias y Documentos Relacionados

- [CONVENTIONS.md §4 — Frontend Rules](../CONVENTIONS.md#4-frontend-rules)
- [Frontend Rules](./frontend-rules.md) — Reglas generales frontend
- [Frontend Generic Services Catalog](./frontend-generic-services-catalog.md)
- [Backend Export Services](../backend/backend-export-services.md) — Complementario backend
- [Document Display Pattern](./document-display-pattern.md) — Visualizar documentos
- exceljs Docs: [GitHub](https://github.com/exceljs/exceljs)
- file-saver Docs: [npm](https://www.npmjs.com/package/file-saver)
- ng2-pdf-viewer: [npm](https://www.npmjs.com/package/ng2-pdf-viewer)

---

**Última actualización:** 2026-08-06  
**Vigencia:** Angular 22+ (exceljs 4.4+, file-saver 2.0+, ng2-pdf-viewer 10.4+)  
**Aplicable a:** Todos los componentes que exportan/descargan datos
