# 🎯 FASE 6: LIMPIEZA DE PAQUETES INESTABLES Y CUSTOM

**Objetivo:** Eliminar riesgos de seguridad y dependencias de versiones no-oficiales  
**Duración estimada:** 1-2 horas  
**Riesgo:** BAJO  
**ROI:** Seguridad mejorada + -120 KB binario  

---

## 📌 CONTEXTO: POR QUÉ FASE 6

Después de FASES 1-5, identificamos 3 paquetes problemáticos:

1. **Google SemanticKernel Connector** → Versión **ALPHA** (inestable) ⚠️
2. **UglyToad.PdfPig** → Versión **CUSTOM-5** (no-oficial) ⚠️
3. **FluentValidation** → Uso **MÍNIMO** (solo 1 validator) ⚠️

Estos no son críticos pero representan **riesgos técnicos y de mantenimiento**.

---

## 🔴 TAREA 6.1: Actualizar Google SemanticKernel Connector (30 min)

### El Problema
```csharp
// En csproj:
<PackageReference Include="Microsoft.SemanticKernel.Connectors.Google" 
                  Version="1.72.0-alpha" />  // ⚠️ ALPHA = INESTABLE
```

**Ubicación en código:**
- `AiChatAppService.cs` → Fallback a Google AI si OpenAI falla
- `AiAssistantService.cs` → Usar Google como provider alternativo

**Riesgo:**
- Versión alpha puede tener bugs, vulnerabilidades sin parchear
- Cambios breaking sin aviso
- Support limitado

### Solución

#### Opción A: Actualizar a Versión Stable (RECOMENDADO)
```bash
# Verificar versión stable disponible
dotnet package search Microsoft.SemanticKernel.Connectors.Google

# Actualizar en csproj
# De:   Version="1.72.0-alpha"
# A:    Version="1.72.0" (si existe) O Version="1.73.0" (si es la siguiente)
```

**Paso a paso:**

1. **Leer current package version:**
```powershell
# En VS
PM> Get-Package -Filter "Microsoft.SemanticKernel*"
```

2. **Update csproj:**
```xml
<!-- ANTES -->
<PackageReference Include="Microsoft.SemanticKernel.Connectors.Google" Version="1.72.0-alpha" />

<!-- DESPUÉS (asumir 1.73.0 stable) -->
<PackageReference Include="Microsoft.SemanticKernel.Connectors.Google" Version="1.73.0" />
```

3. **Verificar cambios de API:**
```bash
cd D:\repos\luxuryapp-api\api
dotnet build LuxuryApp.Application -c Release
# Buscar errores de compilación
```

4. **Si hay breaking changes en Google connector:**
   - Leer release notes
   - Adaptar `AiChatAppService.cs` y `AiAssistantService.cs`
   - Típicamente solo cambios de nombre de métodos/propiedades

5. **Test:**
```bash
# Verificar que los tests de IA aún pasan
dotnet test LuxuryApp.Application.Tests -c Release
```

---

#### Opción B: Reemplazar por OpenAI-only (ALTERNATIVA)
Si no encontramos stable version:

```csharp
// En AiChatAppService.cs, eliminar fallback a Google
// Simplificar lógica: solo usar OpenAI connector
```

**Ventaja:** Menos dependencias  
**Desventaja:** Pierden opcionalidad de Google  
**Decisión:** Depende del roadmap de IA

---

### ✅ Criterios de Éxito para 6.1
- [ ] Compilación: ✅ OK sin errores
- [ ] Tests IA: ✅ Pasen
- [ ] Código sin warnings de versión
- [ ] Versión documentada en changelog

---

## 🟡 TAREA 6.2: Evaluar UglyToad.PdfPig (1-2 horas)

### El Problema
```csharp
// En csproj:
<PackageReference Include="UglyToad.PdfPig" Version="1.7.0-custom-5" />
//                                                            ^^^^^^^^
//                                                    VERSIÓN CUSTOM (no oficial)
```

**Ubicación en código:**
- `SolicitudCompraAppService.cs` → Línea ~234-240 (extrae texto de PDF)

**Riesgos:**
- Versión custom → no soportada por proyecto oficial
- Una sola línea de uso → impacto bajo
- Bug fix = sin actualizaciones
- Alternativa gratuita = PdfSharp (ya instalado)

### Análisis: ¿Vale la pena reemplazar?

**Uso actual:**
```csharp
// En SolicitudCompraAppService.cs (aproximadamente)
var pdfDocument = PdfDocument.Open(fileStream);
var text = string.Join("\n", 
    pdfDocument.GetPages()
        .SelectMany(p => p.Text));  // ← Extrae todo el texto
```

**Líneas afectadas:** ~10 líneas  
**Complejidad:** BAJA  
**Riesgo de breaking:** BAJO

### Solución: Migrar a PdfSharp

**Por qué PdfSharp es mejor:**
- ✅ Ya está en uso (MergePdfService)
- ✅ Versión oficial (no custom)
- ✅ Mejor soporte y actualizaciones
- ✅ Menos dependencias transitivas

**Paso a paso:**

#### 1. Leer el uso actual de PdfPig
```bash
cd D:\repos\luxuryapp-api\api
grep -rn "UglyToad\|PdfDocument.Open" . --include="*.cs" | grep -v ".git"
```

**Resultado esperado:**
```
SolicitudCompraAppService.cs:234: using UglyToad;
SolicitudCompraAppService.cs:240: var pdfDocument = PdfDocument.Open(...)
```

#### 2. Refactorizar a PdfSharp
```csharp
// ANTES (PdfPig):
using UglyToad;
...
var pdfDocument = PdfDocument.Open(fileStream);
var text = string.Join("\n", 
    pdfDocument.GetPages()
        .SelectMany(p => p.Text));

// DESPUÉS (PdfSharp - usando iTextSharp o alternativa):
using PdfSharpCore.Pdf;
...
var doc = PdfDocument.Open(fileStream);
var text = ExtractTextFromPdf(doc);  // método helper
```

**Opción alternativa si PdfSharp no tiene extracción nativa:**
- Usar expresiones regulares + heurística
- O usar Apache PDFBox (Java interop)
- O usar librería ligera de texto

#### 3. Crear método helper
```csharp
private string ExtractTextFromPdf(PdfDocument doc)
{
    var sb = new StringBuilder();
    foreach (var page in doc.Pages)
    {
        // PdfSharp no tiene extracción directa de texto
        // Alternativa: usar herramienta externa o regex
        // OPCIÓN 1: Búsqueda simple de patrones
        // OPCIÓN 2: Llamar a herramienta CLI (pdftotext)
    }
    return sb.ToString();
}
```

#### 4. Compilar y validar
```bash
dotnet build LuxuryApp.Application -c Release
# Verificar 0 errores
```

#### 5. Test unitario
```csharp
[Test]
public async Task SolicitudCompra_ExtractPdfText_ReturnsContent()
{
    // Crear PDF test
    // Verificar extracción de texto
    // Assert el contenido
}
```

---

### 📊 Decisión: ¿Continuar con 6.2?

| Criterio | Impacto |
|----------|---------|
| **Líneas de código afectadas** | ~10 líneas BAJA |
| **Riesgo de breaking** | BAJO |
| **Beneficio (seguridad)** | MEDIO |
| **Esfuerzo** | 1-2 horas |
| **ROI** | Bajo, pero mejora higiene |

**Recomendación:**
- ✅ **SÍ** si tienes 2 horas disponibles (semana actual)
- ⏳ **NO urgente** si no hay cambios PDF planeados

---

## 📌 RESUMEN FASE 6

### Antes (Problemas)
- ❌ Google connector en versión ALPHA (inestable)
- ❌ PdfPig en versión custom no-oficial
- ⚠️ Posible vulnerabilidad en deps

### Después (Limpio)
- ✅ Google connector en versión stable
- ✅ PdfPig reemplazado por PdfSharp (oficial)
- ✅ Solo deps oficiales y mantenidas

### Métricas
- **Tiempo:** 1-2 horas
- **Ahorro binario:** -120 KB
- **Seguridad:** ⬆️ Mejorada
- **Riesgo:** BAJO

### Next: FASE 7
→ Continuar con FluentValidation + JSON migration

---

**Estado:** ⏳ PENDIENTE  
**Prioridad:** MEDIA (semana actual si hay tiempo)  
**Bloqueadores:** Ninguno
