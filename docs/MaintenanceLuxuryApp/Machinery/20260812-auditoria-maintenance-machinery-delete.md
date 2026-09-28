# Hallazgo: Machinery - DeleteAsync Error Handling

**Severidad:** 🔴 CRÍTICA  
**Tipo:** Error handling incorrecto + falta de logging  
**Archivo:** `MachineryAppService.cs` línea 229-249

---

## Problema

**DeleteAsync method (línea 229-249):**

```csharp
public async Task<ApiResponseDTO<Equipment>> DeleteAsync(Guid id)
{
    var entity = await dbContext.Equipment.FindAsync(id);
    if (entity == null) return ApiResponseDTO<Equipment>.ErrorResult("...", 404);

    dbContext.Equipment.Remove(entity);
    await dbContext.SaveChangesAsync();

    if (entity.PhotoPath != null)
    {
        try
        {
            string path = fileWritePathService.MachineryDirectory(entity.CustomerId);
            await imageRepository.DeleteAsync(path, entity.PhotoPath);
        }
        catch    // ❌ CATCH VACÍO
        {
            // Sin logging, sin re-throw
        }
    }
}
```

---

## Violaciones

1. **Catch vacío** (línea 244-247)
   - Error silencioso si falla borrar archivo
   - No hay logging
   - No hay re-throw

2. **Sin transacción**
   - Borra BD primero sin confirmar que archivo se puede borrar
   - Si error, BD limpia pero archivo queda (basura en disco)

3. **Sin dependencias**
   - No verifica si entidad tiene relaciones (FK)
   - Comparar con CustomDocumentAppService (correcto)

---

## Patrón Correcto

**CONVENTIONS.md §6 - NUEVO:**

```csharp
// 1. Transacción
await using var transaction = await dbContext.Database.BeginTransactionAsync();

try
{
    // 2. Borrar entidad
    dbContext.Equipment.Remove(entity);
    await dbContext.SaveChangesAsync();
    
    // 3. Commit (BD limpia)
    await transaction.CommitAsync();
    
    // 4. LUEGO borrar archivo
    if (entity.PhotoPath != null)
    {
        string path = fileWritePathService.MachineryDirectory(entity.CustomerId);
        await imageRepository.DeleteAsync(path, entity.PhotoPath);
    }
    
    return ApiResponseDTO<Equipment>.SuccessResult(entity);
}
catch (Exception ex)
{
    await transaction.RollbackAsync();
    logger.LogError(ex, "Error eliminar maquinaria {Id}", id);  // ← Logging
    throw;
}
```

---

## Fix

**Cambios requeridos:**

1. Agregar transacción
2. Reemplazar catch vacío por logging + re-throw
3. Mover borrado archivo DESPUÉS commit transacción
4. Verificar si hay FK (relaciones dependientes)

**Checklist:**

- [ ] Agregar `ILogger` al constructor
- [ ] Wrappear con transacción
- [ ] Logging en catch
- [ ] Re-throw exception
- [ ] Test: Verificar que error se registra en logs
- [ ] Test: Verificar que archivo se borra (o error en logs si falla)

---

**Referencia:**
- CONVENTIONS.md §6 - Pattern DeleteAsync (NUEVO)
- CustomDocumentAppService.cs línea 135+ (patrón correcto)

**Esfuerzo fix:** 20-30 minutos (implementar patrón + tests)

