# Regla de DTOs: 1 Archivo = 1 DTO

**Versión:** 1.0  
**Fecha:** 2026-07-30  
**Severidad:** CRÍTICA  
**Aplica a:** Todos los DTOs locales de módulos backend

---

## La Regla

**NUNCA múltiples DTOs en un mismo archivo. 1 archivo = 1 DTO. SIN EXCEPCIONES.**

```
❌ MAL:
DTOs/
  └── ReportResultItemDTO.cs
       ├── public record ReportResultItemDTO
       ├── public record ReportImageDTO
       └── public record ReportFilterDTO

✅ BIEN:
DTOs/
  ├── ReportResultItemDTO.cs (solo ReportResultItemDTO)
  ├── ReportImageDTO.cs (solo ReportImageDTO)
  └── ReportFilterDTO.cs (solo ReportFilterDTO)
```

---

## Por Qué

### 1. **Navegación Clara**
Cuando buscas `ReportImageDTO`, sabes exactamente dónde está sin abrir un archivo y buscar adentro.

### 2. **Reduce Conflictos en PR**
Si otro dev modifica `ReportImageDTO`, el PR no afecta a `ReportResultItemDTO` (misma carpeta, distinto archivo).

### 3. **Single Responsibility**
Un archivo = una responsabilidad = una razón para cambiar.

### 4. **Indexación de IDEs**
Visual Studio, Rider, VS Code indexan "un DTO por archivo" automáticamente.

### 5. **Git History Limpia**
Cambios a un DTO no polucionen el blame de otro DTO.

### 6. **Auditoría Trazable**
```bash
grep -r "ReportImageDTO" --include="*.cs"
# Retorna: DTOs/ReportImageDTO.cs
# (Si estuviera en ReportResultItemDTO.cs, sería confuso)
```

---

## Cómo Validar en Auditoría

### STEP 1: Buscar violaciones

```bash
# Contar public records/classes por archivo
find {backend_path}/DTOs -name "*.cs" -type f | while read file; do
  count=$(grep -c "^public record\|^public class\|^public interface" "$file")
  if [ $count -gt 1 ]; then
    echo "❌ $file tiene $count DTOs/Interfaces"
    grep "^public record\|^public class\|^public interface" "$file"
  fi
done
```

### STEP 2: Reportar en Auditoría

```markdown
## 🔴 Violaciones: Múltiples DTOs por Archivo

| Archivo | DTOs Encontrados | Severidad | Fix |
|:---|:---|:---|:---|
| Inspections/DTOs/ReportResultItemDTO.cs | ReportResultItemDTO, ReportImageDTO, ReportFilterDTO | CRÍTICA | Separar en 3 archivos |
| Payments/DTOs/PaymentDTO.cs | PaymentDTO, PaymentDetailDTO | CRÍTICA | Separar en 2 archivos |
```

### STEP 3: Plan de Remediación

```markdown
## Plan de Acción

### Fase 1: INMEDIATA (1 día)
- [ ] ACCIÓN-001: Separar ReportResultItemDTO.cs → 3 archivos
  - Create ReportImageDTO.cs
  - Create ReportFilterDTO.cs
  - Keep ReportResultItemDTO.cs
  Story Points: 2

- [ ] ACCIÓN-002: Separar PaymentDTO.cs → 2 archivos
  - Create PaymentDetailDTO.cs
  - Keep PaymentDTO.cs
  Story Points: 1

Total: 3 SP (1 día)
```

---

## Excepciones (NINGUNA)

❌ **No hay excepciones.** Punto.

```
"Pero es que estos DTOs son muy relacionados..." → Aún así, 1 archivo cada uno.
"Pero es que solo tienen 3 líneas..." → Aún así, 1 archivo cada uno.
"Pero es que son DTOs internos, no públicos..." → Aún así, 1 archivo cada uno.
```

---

## Cómo Arreglar (Guía Rápida)

### Paso 1: Identifica los DTOs en el archivo

```csharp
// ❌ Inspections/DTOs/ReportResultItemDTO.cs
namespace DTOs;

public record ReportResultItemDTO
{
    public bool State { get; set; }
    public List<ReportImageDTO> Images { get; set; }
}

public record ReportImageDTO
{
    public string Url { get; set; }
}
```

### Paso 2: Crea un archivo nuevo para cada DTO adicional

```csharp
// ✅ Inspections/DTOs/ReportImageDTO.cs (NUEVO)
namespace DTOs;

public record ReportImageDTO
{
    public string Url { get; set; }
}
```

### Paso 3: Deja solo un DTO por archivo

```csharp
// ✅ Inspections/DTOs/ReportResultItemDTO.cs (MODIFICADO)
namespace DTOs;

public record ReportResultItemDTO
{
    public bool State { get; set; }
    public List<ReportImageDTO> Images { get; set; }
}
```

### Paso 4: Actualiza imports en tests y otros archivos

```csharp
// Antes: using [namespace] DTOs;  // incluía múltiples DTOs
// Después:
using DTOs; // ahora cada DTO está claro

// O:
using ReportImageDTO = DTOs.ReportImageDTO;
```

---

## Validación en Implementación (Checklist)

Cuando crees DTOs en un módulo nuevo:

- [ ] ¿Cada DTO está en su propio archivo?
- [ ] ¿El nombre del archivo coincide con el nombre del DTO?
- [ ] ¿No hay múltiples `public record` en un archivo?
- [ ] ¿No hay múltiples `public class` en un archivo?
- [ ] ¿No hay mezcla de `record` y `class` en un archivo?

---

## Impacto en Auditoría

### Si cumple:
✅ Hallazgo: "DTOs correctamente organizados (1 archivo = 1 DTO)"

### Si NO cumple:
🔴 Hallazgo crítico: "DTOs incorrectamente organizados"
- Severidad: CRÍTICA
- Impacto: Dificulta mantenimiento, aumenta conflictos de PR
- Plan de acción: Refactorizar en 1-2 sprints

---

## FAQ

**P: ¿Interfaces también cuentan?**  
R: SÍ. 1 interfaz por archivo también (ej: `IReportService.cs`).

**P: ¿Qué si el DTO está dentro de otra clase?**  
R: Aún así, debe estar en su propio archivo.

**P: ¿Nested classes son OK?**  
R: No. Extrae a archivo separado.

**P: ¿DTOs anónimos (new { })  están prohibidos?**  
R: En contratos públicos, sí. Usa DTO explícito en archivo.

---

## Referencias

- [Backend Rules - DTOs](./backend-rules.md)
- [CONVENTIONS.md §6.1](../CONVENTIONS.md)
- [Backend Module Structure](./backend-module-structure.md)

---

*Regla: DTO_FILE_ORGANIZATION_RULE.md*  
*Versión: 1.0*  
*Vigente desde: 2026-07-30*

