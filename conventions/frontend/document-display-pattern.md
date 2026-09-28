# Document Display Pattern - Frontend

**Ultima revision:** 2026-08-05

---

## Objetivo

Estandarizar cómo se visualizan documentos (PDFs, imágenes) en listados y detalles.
Usar componentes UI compartidos, mostrar nombres legibles (no UUIDs), y aplicar
patrón de modal seguro con `PdfViewerModal`.

---

## Problema Resuelto

**Antes:**
```
UI mostraba: "019fd315-ef59-79c3-a8bc-96e5c760e433.pdf"  ❌ UUID opaco
Backend exponía: "C:\private\customer\123\docs\..."      ❌ Ruta física
```

**Ahora:**
```
UI muestra: "Acta Asamblea 2026" + icono PDF bonito     ✅ Legible
Backend devuelve: "/api/files/download?filePath=..."   ✅ URL segura
```

---

## Arquitectura: Datos en Listado

### Estructura de datos que llega del backend

```typescript
// Lo que devuelve el endpoint
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acta Asamblea 2026",           // ← Nombre legible (mostrar en UI)
  "path": "/api/files/download?...",     // ← URL segura (pasar a PdfViewerModal)
  "folio": "ASM-2026-001",                // ← Metadata (mostrar en detalle)
  "createdAt": "2026-02-15",              // ← Timestamp
  "createdById": "Juan Pérez"             // ← Autor
}
```

**Notas:**
- El campo `name` es el nombre legible guardado en BD (no el UUID del archivo físico)
- El campo `path` es la URL segura completa (NO es relativa)
- El UUID del archivo está oculto en el servidor (no llega al frontend)

---

## Componentes Obligatorios

### Para botón de visualización en listado

**Componente:** `WebButtonIconViewPdf`

**Ubicación:** `appsweb/angular/src/app/shared/ui/buttons/web-icon/button-view-pdf.ts`

**Propiedades:**

```typescript
@Input() url: string;              // URL segura del backend: "/api/files/download?..."
@Input() fileName: string;         // Nombre legible: "Acta Asamblea 2026"
@Input() [variant]?: string;       // "ghost" (default), "solid", "outline", "link"
@Input() [severity]?: string;      // "secondary" (default), "primary", "success", etc.
@Input() [disabled]?: boolean;     // false (default)
@Input() [loading]?: boolean;      // false (default)
```

**Comportamiento:**

1. Renderiza un **icono de documento bonito** (no texto)
2. Al hacer clic, abre automáticamente `PdfViewerModal`
3. Maneja lazy-loading del modal (no carga `ng2-pdf-viewer` hasta que se necesite)
4. Pasa automáticamente `{pdfSrc: url, fileName: fileName}` al modal

**Ejemplo:**

```typescript
// En tu componente
@Component({
  selector: 'app-biblioteca-detalle',
  imports: [WebButtonIconViewPdf],
  templateUrl: './biblioteca.html'
})
export class BibliotecaDetalle {
  dataSignal = signal<any[]>([]);
}
```

```html
<!-- En el template -->
<div class="document-list">
  @for (item of dataSignal(); track item.id) {
    <div class="document-item">
      <span class="document-item__name">{{ item.name }}</span>
      <span class="document-item__details">{{ item.folio }} · {{ item.createdAt }}</span>
      
      <!-- Botón PDF bonito (icono) -->
      <iw-button-view-pdf
        [url]="item.path"
        [fileName]="item.name"
        variant="ghost"
      ></iw-button-view-pdf>
    </div>
  }
</div>
```

### Para modal de visualización

**Componente:** `PdfViewerModal`

**Ubicación:** `appsweb/angular/src/app/shared/ui/web/pdf-viewer-modal/pdf-viewer-modal.ts`

**Interfaz de datos:**

```typescript
dialogConfig.data = {
  pdfSrc: string,    // URL segura: "/api/files/download?filePath=..."
  fileName: string   // Nombre legible: "Acta Asamblea 2026"
}
```

**Comportamiento:**

1. Abre en modal **maximizado** (pantalla completa)
2. Carga PDF desde URL segura
3. Convierte blob a Uint8Array para ng2-pdf-viewer
4. Incluye botón de descarga
5. El modal maneja todo el ciclo de vida

**Abierto automáticamente por `WebButtonIconViewPdf`** (no lo llames directamente en la mayoría de casos).

**Si necesitas abrirlo manualmente:**

```typescript
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { PdfViewerModal } from '@ui/web/pdf-viewer-modal/pdf-viewer-modal';

export class MyComponent {
  private dialogHandlerS = inject(DialogHandlerService);

  openCustomPdf(url: string, fileName: string) {
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: fileName },
      fileName,                           // Título del modal
      this.dialogHandlerS.sizeFull,       // Tamaño completo
      true                                // Maximizar
    );
  }
}
```

---

## Patrón Completo: Listado con Documentos

### Paso 1: Backend devuelve datos correctos

```csharp
// CustomDocumentAppService.cs
public async Task<ApiResponseDTO<List<object>>> GetAllByCustomerAsync(
    Guid customerId,
    DocumentType documentType)
{
    var documents = await dbContext.CustomDocument
        .Where(d => d.CustomerId == customerId && d.DocumentType == documentType)
        .ToListAsync();

    // Transformar datos
    var result = documents.Select(d => new
    {
        d.Id,
        d.Name,                    // ← Nombre legible (ej: "Acta Asamblea 2026")
        d.Folio,
        d.CreateAt,
        d.CreatedById,
        // ⭐ IMPORTANTE: generar URL segura en backend
        Path = fileReadPathService.GetDocumentTypeDirectoryPath(
            d.CustomerId,
            d.DocumentType,
            d.Path  // Path en BD es solo nombre relativo
        )
        // Resultado: "/api/files/download?filePath=%2F..."
    })
    .OrderBy(x => x.CreateAt)
    .ToList<object>();

    return ApiResponseDTO<List<object>>.SuccessResult(result);
}
```

### Paso 2: Frontend carga datos

```typescript
// biblioteca-consejo-directivo-detalle.ts
import { WebButtonIconViewPdf } from '@ui/buttons/web-icon/button-view-pdf';

@Component({
  selector: 'app-biblioteca-detalle',
  imports: [CommonModule, AppIcon, WebButtonIconViewPdf],  // ← Importar botón
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './biblioteca-consejo-directivo-detalle.html'
})
export class BibliotecaConsejoDirectivoDetalle {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  dataSignal = signal<any[]>([]);
  loading = signal(true);

  onLoadData() {
    const customerId = this.customerIdS.customerId();
    const urlApi = Endpoints.Committee.Library.customDocumentsByType(
      customerId,
      this.documentType!
    );

    this.apiResponseS.onGetList(urlApi).then((result: any[] | null) => {
      if (result) {
        // Los datos ya vienen con path transformado (URL segura)
        this.dataSignal.set(result);
      }
      this.loading.set(false);
    });
  }
}
```

### Paso 3: Frontend renderiza listado

```html
<!-- biblioteca-consejo-directivo-detalle.html -->
<section class="document-library">
  <h2>{{ pageTitle }}</h2>

  @if (loading()) {
    <div class="spinner">Cargando...</div>
  } @else if (dataSignal().length === 0) {
    <div class="empty-state">
      <app-icon icon="mdi:folder-open" />
      <p>No se encontraron documentos</p>
    </div>
  } @else {
    <div class="document-grid">
      @for (item of dataSignal(); track item.id) {
        <!-- OPCIÓN A: Tarjeta completa con botón PDF -->
        <div class="document-card">
          <div class="document-card__header">
            <h3 class="document-card__title" [title]="item.name">
              {{ item.name }}
            </h3>
            <iw-button-view-pdf
              [url]="item.path"
              [fileName]="item.name"
              variant="ghost"
              severity="primary"
            ></iw-button-view-pdf>
          </div>
          <div class="document-card__meta">
            <span class="meta-item">
              <strong>Folio:</strong> {{ item.folio }}
            </span>
            <span class="meta-item">
              <strong>Fecha:</strong> {{ item.createAt }}
            </span>
            <span class="meta-item">
              <strong>Autor:</strong> {{ item.createdById }}
            </span>
          </div>
        </div>

        <!-- OPCIÓN B: Row compacta con botón PDF (si es tabla) -->
        <tr class="document-row">
          <td class="document-row__name">
            <app-icon icon="mdi:file-pdf-box" class="icon-pdf" />
            {{ item.name }}
          </td>
          <td class="document-row__folio">{{ item.folio }}</td>
          <td class="document-row__date">{{ item.createAt }}</td>
          <td class="document-row__action">
            <iw-button-view-pdf
              [url]="item.path"
              [fileName]="item.name"
              variant="ghost"
            ></iw-button-view-pdf>
          </td>
        </tr>
      }
    </div>
  }
</section>
```

---

## Estrategia de Nombres de Archivos

### En Backend (al guardar)

```csharp
public async Task<string> SaveAsync(IFormFile file, string directory)
{
    // 1. Generar nombre único basado en UUID + timestamp
    var uniqueFileName = $"{Guid.NewGuid()}-{Path.GetExtension(file.FileName)}";
    // Resultado: "019fd315-ef59-79c3-a8bc-96e5c760e433.pdf"

    // 2. Guardar en disco con nombre único
    var filePath = Path.Combine(directory, uniqueFileName);
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }

    // 3. Retornar SOLO el nombre del archivo (no ruta completa)
    return uniqueFileName;
}
```

### En Base de Datos (guardar DTO)

```csharp
var document = new CustomDocument
{
    CustomerId = dto.CustomerId,
    Name = dto.Name,  // ← Lo que el usuario escribió: "Acta Asamblea 2026"
    Path = fileName,  // ← UUID generado: "019fd315-ef59-79c3-a8bc-96e5c760e433.pdf"
    DocumentType = dto.DocumentType,
    Folio = await generateFolioService.OnGenerateDocumentLegalRecord(dto.CustomerId)
};
```

**Tabla CustomDocument:**

| id | name | path | documentType | customerId |
|---|---|---|---|---|
| 550e8400... | Acta Asamblea 2026 | 019fd315-ef59-79c3-a8bc-96e5c760e433.pdf | Asambleas | 123e4567... |
| a1b2c3d4... | Contrato 2026 | a7e9f2c1-4b5d-8e2f-9c3a-1b4e5f6g7h8i.pdf | ContratosEmpleados | 123e4567... |

### Ventajas de esta estrategia

- ✅ **Nombres únicos en disco:** Evita conflictos si usuario sube mismo archivo varias veces
- ✅ **Nombres legibles en UI:** Mostrar "Acta Asamblea 2026" no "019fd315..."
- ✅ **Seguridad:** UUID no se expone, frontend solo ve URL segura codificada
- ✅ **Flexibilidad:** Usuario puede renombrar documento en BD sin afectar archivo físico

---

## Estilos Obligatorios (Tokens CSS + SCSS)

**PROHIBIDO:** Tailwind, utility classes, hardcoding de valores.

**OBLIGATORIO:** Usar tokens CSS (`var(--ds-*)`, `var(--primary-*)`, `var(--surface-*)`, etc.)

### Card de documento (SCSS con tokens)

```scss
// En: appsweb/angular/src/app/modules/committee.luxuryapp/styles/documento-card.scss
.document-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ds-border-default);
  border-radius: var(--ds-radius-md);
  padding: var(--ds-space-lg);
  background-color: var(--surface-primary);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--ds-shadow-md);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-md);
    margin-bottom: var(--ds-space-md);
  }

  &__title {
    font-size: var(--ds-font-size-base);
    font-weight: var(--ds-font-weight-semibold);
    color: var(--text-primary);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    font-size: var(--ds-font-size-xs);
    color: var(--text-secondary);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-xs);
  }
}
```

### Row de tabla (SCSS con tokens)

```scss
// En: appsweb/angular/src/app/modules/committee.luxuryapp/styles/documento-row.scss
.document-row {
  border-bottom: 1px solid var(--ds-border-default);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--surface-hover);
  }

  &__name {
    display: flex;
    align-items: center;
    gap: var(--ds-space-sm);
    padding: var(--ds-space-md);
  }

  &__action {
    text-align: center;
    padding: var(--ds-space-md);
  }

  .icon-pdf {
    color: var(--semantic-error-600);
    font-size: var(--ds-font-size-lg);
  }
}
```

### Tokens CSS Disponibles

**Colores:**
- `var(--primary-*)`: 50-900 (botones, links activos)
- `var(--surface-*)`: primary, secondary, tertiary, hover, active
- `var(--text-*)`: primary, secondary, tertiary, disabled
- `var(--ds-border-default)`: borde estándar
- `var(--semantic-error-*)`: estados de error/peligro

**Espaciado:**
- `var(--ds-space-xs)`: 4px
- `var(--ds-space-sm)`: 8px
- `var(--ds-space-md)`: 16px
- `var(--ds-space-lg)`: 24px
- `var(--ds-space-xl)`: 32px

**Tipografía:**
- `var(--ds-font-size-xs)`: 12px
- `var(--ds-font-size-base)`: 14px
- `var(--ds-font-size-lg)`: 16px
- `var(--ds-font-weight-regular)`: 400
- `var(--ds-font-weight-semibold)`: 600
- `var(--ds-font-weight-bold)`: 700

**Otros:**
- `var(--ds-radius-md)`: border-radius estándar
- `var(--ds-shadow-md)`: sombra mediana
- `var(--ds-shadow-lg)`: sombra grande

**Referencia completa:** `appsweb/angular/src/styles/theme/_variables.scss`

---

## Checklist de Implementación

Cuando crees un listado de documentos:

- [ ] Backend devuelve campo `name` (nombre legible)
- [ ] Backend devuelve campo `path` (URL segura completa, no relativa)
- [ ] Backend genera UUID para nombre de archivo en disco
- [ ] Frontend importa `WebButtonIconViewPdf` desde `@ui/buttons/web-icon/button-view-pdf`
- [ ] Frontend renderiza `name` en el listado (no path ni UUID)
- [ ] Frontend usa `<iw-button-view-pdf [url]="item.path" [fileName]="item.name">`
- [ ] Modal abre automáticamente al hacer clic en botón
- [ ] **Estilos usan SOLO tokens CSS** (`var(--ds-*)`, `var(--primary-*)`, `var(--surface-*)`)
- [ ] ❌ NO se usa Tailwind, utility classes o hardcoding (ej: `color: #1B365D` o `padding: 16px`)
- [ ] SCSS está en `appsweb/angular/src/app/modules/{appName}/styles/` o `appsweb/angular/src/styles/`
- [ ] Icono de PDF es visible y bonito (usar `<app-icon icon="mdi:file-pdf-box">`)
- [ ] No se muestra UUID en la UI, solo nombre legible
- [ ] Componentes importados son los oficiales de shared/ui, no custom

---

## Auditoría

Marcadores de incumplimiento:

| Hallazgo | Severidad | Acción |
|---|---|---|
| UI muestra UUID (`019fd315...`) | CRÍTICA | Usar campo `name` en lugar de `path` |
| Backend devuelve path completo al frontend | CRÍTICA | Aplicar `IFileReadPathService.GetDocumentTypeDirectoryPath()` |
| Estilos usan Tailwind (`@apply`, utility classes) | CRÍTICA | Remover Tailwind, usar SCSS + tokens CSS |
| Hardcoding de valores (`color: #1B365D`, `padding: 16px`) | CRÍTICA | Usar `var(--ds-*)`, `var(--primary-*)` |
| Componente custom para botón PDF en lugar de `iw-button-view-pdf` | ALTA | Reutilizar componente oficial |
| Path relativo en respuesta API (no URL completa) | ALTA | Asegurar URL absoluta con parámetro encoded |
| No se usa `PdfViewerModal` para visualizar | MEDIA | Integrar modal oficial |
| Nombres de archivos guardados sin UUID | MEDIA | Generar UUID único por archivo |
| SCSS sin estructura (tokens no centralizados) | MEDIA | Organizar estilos en `styles/` + usar tema global |

---

## Referencias

- [Document Read/Write Pattern](../backend/document-read-write-pattern.md) — Patrón backend
- Backend Shared Services Catalog — ver [`CONVENTIONS_FOLDER_API.MD`](../CONVENTIONS_FOLDER_API.MD) §12.2 (IFileReadPathService)
- [UI Shared Library Architecture](../ui/ui-shared-library-architecture.md) — Componentes compartidos
- [Frontend Rules](./frontend-rules.md) — Reglas frontend
- [CONVENTIONS.md](../CONVENTIONS.md) — Sistema rector

---

## Cambios Recientes

| Fecha | Cambio |
|---|---|
| 2026-08-05 | Creación inicial: patrón completo de visualización de documentos en UI |

