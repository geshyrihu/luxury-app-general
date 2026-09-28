# Auditoría: Machinery - Document Handling Pattern Violation

**Fecha:** 2026-08-12  
**Módulo:** MantenimientoLuxuryApp > Machinery  
**Severidad:** 🔴 CRÍTICA  
**Tipo:** Incumplimiento CONVENTIONS.md Document Handling Pattern

---

## Hallazgo

**Archivo:** `api/LuxuryApp.Application/Moduls/MantenimientoLuxuryApp/Machinery/Services/MachineryAppService.cs`

**Línea 18:** Hardcodea ruta en lugar de usar `IFileReadPathService`

```csharp
// ❌ INCORRECTO (línea 18)
var pathImage = $"customers/{customerId}/machinery/";
...
PhotoPath = pathImage + m.PhotoPath,
```

**Comparación con mismo archivo (línea 71):** Código CORRECTO en `InventarioCompletoAsync`

```csharp
// ✅ CORRECTO (línea 71)
PhotoPath = fileReadPathService.GetMachineryFilePath(customerId, m.PhotoPath),
```

---

## Regla Violada

**CONVENTIONS.md §6 - Document Handling Pattern:**
> "NUNCA exponer rutas físicas al frontend. Lectura: usar `IFileReadPathService.GetDocumentTypeDirectoryPath()` → URL segura"

**document-read-write-pattern.md:**
> "TODOS los listados, detalles, exports → `fileReadPathService.Get*FilePath()`, NUNCA hardcodear rutas"

---

## Impacto

- ❌ No genera URL segura (expone estructura)
- ❌ Inconsistente dentro mismo archivo (línea 18 vs 71)
- ❌ Si estructura carpetas cambia, rompe (no usa servicio centralizado)
- ❌ Hallazgo CRÍTICO en auditoría

---

## Fix Requerido

**Método:** ListEngineSystemsAsync

**Cambio:** Línea 18

```csharp
// Antes (incorrecto)
var pathImage = $"customers/{customerId}/machinery/";
PhotoPath = pathImage + m.PhotoPath,

// Después (correcto)
// Sin variable local, usar directamente en Select:
PhotoPath = fileReadPathService.GetMachineryFilePath(customerId, m.PhotoPath),
```

**Prueba:** Verificar que imagen sigue cargándose en listado (URL debe ser `/api/files/download?filePath=...`)

---

## Checklist Remediación

- [ ] Actualizar ListEngineSystemsAsync (línea 18-39)
- [ ] Verificar que no hay otros hardcodes en archivo
- [ ] Test: Listar maquinaria → imágenes cargan
- [ ] Validar que URL es segura (contiene /api/files/download)

---

**Referencias:**
- [Document Read/Write Pattern](conventions/backend/document-read-write-pattern.md)
- [CONVENTIONS.md §6](CONVENTIONS.md)
- MachineryAppService.cs línea 16-52 (ListEngineSystemsAsync)

---

**Severidad:** 🔴 CRÍTICA (patron incumplido)  
**Esfuerzo fix:** 5 minutos  
**Fecha detección:** 2026-08-12
