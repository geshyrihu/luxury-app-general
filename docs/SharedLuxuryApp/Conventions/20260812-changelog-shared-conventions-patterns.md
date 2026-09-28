# REPORTE SESIÓN: Patrones de Document Handling Consolidados

**Fecha:** 2026-08-12  
**Tema:** Documentar y validar patrones completos de carga/lectura/eliminación de documentos e imágenes  
**Status:** ✅ COMPLETADO  
**Incoherencias descubiertas:** 2 (ambas críticas, ambas en Machinery)

---

## 🎯 Objetivo Alcanzado

Expandir `CONVENTIONS.md §6` con patrón completo **DeleteAsync** (faltaba), y validar que todos los 4 patrones (AddAsync, UpdateAsync, AddFileAsync, DeleteAsync) estuvieran:

1. ✅ Documentados en CONVENTIONS.md y docs-conventions/
2. ✅ Respaldados con código real en codebase
3. ✅ Verificados contra módulos que usan servicios de archivo

---

## ✅ Patrones Documentados Completamente

### 1. **AddAsync** (Crear entidad + archivo)
- **Servicio:** `IImageStorageService` (imágenes) o `ISecureFileStorageService` (documentos)
- **Código:** MachineryAppService línea 170-175
- **Patrón:** Generar ruta → Guardar archivo → Asignar nombre a BD → SaveChangesAsync

### 2. **UpdateAsync** (Reemplazar archivo existente)
- **Servicio:** Idem
- **Código:** MachineryAppService línea 200-227
- **Patrón:** **Orden crítico:** Guardar nuevo → Borrar antiguo → UpdateAsync BD
- **Hallazgo:** Diferenciación clara entre `IImageStorageService` vs `ISecureFileStorageService`

### 3. **AddFileAsync** (Agregar archivo a entidad con múltiples archivos)
- **Servicio:** `ISecureFileStorageService`
- **Código:** PresentacionJuntaComiteAppService línea 103+ (ArchivoPortada, ArchivoContabilidad, etc.)
- **Patrón:** Verificar archivo antiguo → Borrar si existe → SaveAsync nuevo → UpdateAsync BD

### 4. **DeleteAsync** (Eliminar entidad + archivo) — **🆕 AGREGADO**
- **Servicio:** Idem
- **Código:** CustomDocumentAppService línea 135+ (CORRECTO), Machinery (INCORRECTO)
- **Patrón:** Transacción → Borrar FK → Borrar BD → **Commit** → Borrar archivo → Logging
- **Crítica:** BD se limpia ANTES de tocar disco (prevenir basura orfana)

---

## 🔴 2 HALLAZGOS CRÍTICOS — MACHINERY

### Hallazgo 1: ListEngineSystemsAsync Hardcode Ruta

**Archivo:** `api/LuxuryApp.Application/Moduls/MantenimientoLuxuryApp/Machinery/Services/MachineryAppService.cs`  
**Línea:** 18-39 (ListEngineSystemsAsync)  
**Severidad:** 🔴 CRÍTICA

```csharp
// ❌ INCORRECTO (línea 18)
var pathImage = $"customers/{customerId}/machinery/";
//...
PhotoPath = pathImage + m.PhotoPath,
```

**Violación:** CONVENTIONS.md §6 → NUNCA exponer rutas físicas. Usar `IFileReadPathService.GetMachineryFilePath()`.

**Comparación (mismo archivo, línea 71):**
```csharp
// ✅ CORRECTO
PhotoPath = fileReadPathService.GetMachineryFilePath(customerId, m.PhotoPath),
```

**Impacto:**
- ❌ Expone estructura carpetas al frontend
- ❌ Inconsistencia dentro mismo archivo
- ❌ Rompe si rutas cambian

**Fix:** 5 minutos. Reemplazar variable local por llamada directa a servicio.

---

### Hallazgo 2: DeleteAsync Empty Catch + Sin Transacción

**Archivo:** MachineryAppService.cs  
**Línea:** 229-249 (DeleteAsync)  
**Severidad:** 🔴 CRÍTICA

```csharp
// ❌ INCORRECTO
catch    // Empty catch
{
    // Sin logging, sin re-throw
}
```

**Violaciones:**
1. **Catch vacío** → Error silencioso si falla borrar archivo
2. **Sin transacción** → BD se limpia, archivo queda orfano (basura)
3. **Sin dependencias** → No valida FK antes de borrar

**Patrón correcto (DocumentCustomAppService):**
```csharp
await using var transaction = await dbContext.Database.BeginTransactionAsync();

try
{
    // BD operations
    await dbContext.SaveChangesAsync();
    await transaction.CommitAsync();  // ← Commit ANTES de tocar disco
    
    // Archivo DESPUÉS
    fileStorageService.DeleteFile(path, entity.Path);
    
    logger.LogError(ex, "...");  // ← Logging CRÍTICO
}
catch (Exception ex)
{
    await transaction.RollbackAsync();
    throw;
}
```

**Fix:** 30 minutos. Implementar patrón completo + tests.

---

## 📋 Documentación Entregada

### A. CONVENTIONS.md §6

**Secciones agregadas/actualizadas:**
1. Tabla comparativa `IImageStorageService` vs `ISecureFileStorageService`
2. Patrón AddAsync (código + explicación)
3. Patrón UpdateAsync (código + orden crítico)
4. Patrón AddFileAsync (código + módulos que usan)
5. Patrón DeleteAsync (código + orden crítico) — **🆕**

**Cambio estructural:** DeleteAsync ahora tiene sección propia (línea 754-801), no inline.

### B. Memory System

**Archivo creado:** `document-handling-patterns-complete.md`
- Resumen de 4 patrones con código
- Cuándo usar cada uno
- Fuentes reales en codebase
- Diferenciación servicios

**Archivo actualizado:** `memory/MEMORY.md`
- Entrada nueva: `document-handling-patterns-complete.md`

### C. Audit Hallazgos

**Archivo creado:** `20260812-hallazgo-machinery-delete-error-handling.md`
- Problema detallado
- Patrón correcto vs incorrecto
- Checklist remediación
- Esfuerzo estimado: 20-30 min

**Actualizado:** `20260812-auditoria-machinery-document-handling.md`
- Mantiene hallazgo ListEngineSystemsAsync (5 min fix)
- Referencia a DeleteAsync hallazgo (separado)

---

## 🎯 Estado de Conventions vs Realidad

| Patrón | Documentado | Código | Módulos | Status |
|--------|---|---|---|---|
| **AddAsync** | ✅ §6 | ✅ Machinery L170-175 | Machinery, CustomDoc | ✅ OK |
| **UpdateAsync** | ✅ §6 | ✅ Machinery L200-227 | Machinery, Inspection | ✅ OK |
| **AddFileAsync** | ✅ §6 | ✅ Presentación L103+ | Presentación, Purchases | ✅ OK |
| **DeleteAsync** | ✅ §6 (NUEVO) | ⚠️ Machinery INCORRECTO | Machinery, CustomDoc | 🔴 CRÍTICA |

---

## 🚀 Próximos Pasos

### 1. Implementación (para OpenCode / equipo)

**Tarea 1: Fix Machinery.ListEngineSystemsAsync**
- Reemplazar hardcode por `fileReadPathService.GetMachineryFilePath()`
- Esfuerzo: 5 min
- Documento: `20260812-auditoria-machinery-document-handling.md`

**Tarea 2: Fix Machinery.DeleteAsync**
- Implementar patrón con transacción + logging
- Agregar ILogger al constructor
- Esfuerzo: 30 min
- Documento: `20260812-hallazgo-machinery-delete-error-handling.md`

### 2. Audit Sweep (Opcional)

```bash
# Buscar otros catches vacíos en servicios de archivo
grep -r "catch\s*{" api/LuxuryApp.Application/Moduls/ \
  | grep -E "(Delete|Remove|Clean)" \
  | head -20
```

**Propósito:** Identificar si hay otros módulos con empty catch en DeleteAsync.

### 3. Validación

- [ ] Ejecutar ambos fixes
- [ ] Verificar listados cargan imágenes correctamente
- [ ] Verificar deletion registra logs en error
- [ ] Verificar archivo se borra (o error en logs)

---

## 📊 Resumen Numérico

| Métrica | Valor |
|---------|-------|
| Patrones documentados | 4/4 |
| Líneas agregadas a CONVENTIONS.md | ~50 |
| Hallazgos críticos encontrados | 2 |
| Módulos auditados | 4 (Machinery, CustomDoc, Presentación, Inspection) |
| Servicios diferenciados | 2 (IImageStorageService, ISecureFileStorageService) |
| Archivos de reporte | 2 |
| Esfuerzo remediación estimado | 35 min (2 fixes) |

---

## ✅ Checklist de Entrega

- [x] CONVENTIONS.md §6 contiene 4 patrones completos
- [x] docs-conventions/ refleja patrones con ejemplos
- [x] Memoria actualizada con patterns + Hallazgos
- [x] 2 Hallazgos críticos identificados y documentados
- [x] Comparación manual: código vs documentación (coherente)
- [x] Próximos pasos claros en documentos de audit

---

**Sesión:** Gobernanza y Documentación (continuación)  
**Responsable:** Claude  
**Próxima auditoría:** Após remediación de 2 hallazgos

