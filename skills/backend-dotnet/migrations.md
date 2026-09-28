# ⚙️ Database Migration Workflow

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §9 (Migraciones). Este archivo contiene ejemplos detallados.

## 2.8. Gestión de Migraciones
El **desarrollador** es el único responsable de crear y aplicar migraciones.

### Reglas para la IA
- **Prohibido** que la IA ejecute `Add-Migration` o `Update-Database` de forma autónoma.
- El agente debe proponer los cambios en las entidades y configuraciones, pero el desarrollador los aplica.

### Flujo Estándar
1.  Modificar entidad / configuración.
2.  `Add-Migration <NombreDescriptivo>`.
3.  `Update-Database`.

### Rollback
- `Update-Database <MigracionAnterior>` y luego `Remove-Migration`.
