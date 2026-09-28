# ⚙️ EF Core Performance & Standards

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §9 (EF Core, precision, transacciones). Este archivo contiene ejemplos detallados.

## 2.2. Rendimiento en Consultas

### ❌ Prohibición de AutoMapper en Select
Queda **estrictamente prohibido** usar `IMapper.Map` o `.ProjectTo<DTO>()` dentro de cláusulas `.Select()`.
- **Mapeo Manual**: El mapeo en proyecciones debe ser manual para asegurar SQL optimizado.
- **Uso permitido**: Solo para operaciones de escritura (DTO -> Entidad) en `Add` o `Update`.

### ✅ AsNoTracking
- **Regla general**: Usar `AsNoTracking()` en todos los endpoints de lectura (GET).
- **Excepción**: Omitir en endpoints `GetForEdit` si los datos se modificarán inmediatamente.

### [NotMapped] Properties
- **Prohibido**: Usar propiedades `[NotMapped]` en cláusulas `.Where()`. EF Core no puede traducirlas a SQL.
- **Permitido**: Usar en proyecciones `.Select()`.

## 4.4. Precisión Decimal
- **Obligatorio**: Usar `.HasPrecision(18, 4)` en la configuración EF Core para todos los campos monetarios.

## Carga Diferida
- Detalles pesados (colecciones anidadas, archivos) deben ir en un endpoint `GetDetails/{id}` separado del listado paginado.
