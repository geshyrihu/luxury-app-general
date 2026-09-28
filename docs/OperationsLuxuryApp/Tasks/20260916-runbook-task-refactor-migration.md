# Runbook - Migracion TaskResponsibles y Evidencia

**Estado:** migracion aplicada y backfill ejecutado el 2026-09-16.  
**Plan origen:** `20260916-plan-operations-task-refactor.md`

## 1. Prechecks

- [ ] Backup verificado de base de datos y storage de tickets.
- [ ] No hay instancia de API ejecutando la misma version durante migracion.
- [ ] Build `LuxuryApp.Application` y `LuxuryApp.Api` exitoso.
- [ ] Se confirmaron nombres de tablas: `TaskResponsibles`, `TaskAdditionalImages`, `TaskFollowUpEvidenceImages`.
- [ ] Se revisaron duplicados de datos legacy y usuarios inactivos.
- [ ] Se confirmo proveedor SQL y sintaxis de indice filtrado/constraint unica.

## 2. Generar migracion

Ejecutar por desarrollador desde `api/LuxuryApp.Api` o proyecto configurado:

```powershell
dotnet ef migrations add AddTaskResponsiblesAndEvidenceImages `
  --context ApplicationDbContext `
  --project ..\LuxuryApp.Application\LuxuryApp.Application.csproj `
  --startup-project LuxuryApp.Api.csproj
```

Revisar migracion generada antes de aplicar:

- crea tres tablas nuevas;
- crea FKs hacia `Tasks` y `TaskFollowUps`;
- crea indices `(TasksId, ApplicationUserId)`, `(TasksId, SortOrder)` y `(TaskFollowUpId, SortOrder)`;
- no elimina ni renombra `AssigneeId`, `BeforeWork`, `AfterWork` ni `TaskFiles`;
- delete behavior coincide con politica aprobada.

## 3. Aplicar expand migration

```powershell
dotnet ef database update `
  --context ApplicationDbContext `
  --project ..\LuxuryApp.Application\LuxuryApp.Application.csproj `
  --startup-project LuxuryApp.Api.csproj
```

No ejecutar fase Contract en esta migracion.

## 4. Ejecutar backfill

Backfill implementado en:

`LuxuryApp.Application/Modules/OperationsLuxuryApp/Task/TaskResponsibles/Services/TaskResponsibleBackfillService.cs`

Debe ejecutarse desde runner administrativo controlado, con:

- una sola ejecucion por lote o lock distribuido;
- reintento idempotente;
- log de `LegacyTasksFound`, `RelationsCreated`, `InvalidLegacyUsers`;
- export de tareas con `AssigneeId` cuyo usuario no existe o esta inactivo;
- transaccion por lote si el volumen requiere paginacion.

No convertir usuarios invalidos en responsables ficticios.

## 5. Verificacion post-backfill

- [x] Cada `Tasks.AssigneeId` valido tiene una fila `TaskResponsibles` con `IsPrimary=true`.
- [x] Segunda ejecucion crea cero relaciones nuevas.
- [x] No existen duplicados `(TasksId, ApplicationUserId)`.
- [x] No existen mas de un `IsPrimary=true` por tarea.
- [ ] Tareas con `BeforeWork`/`AfterWork` mantienen exactamente los paths anteriores.
- [ ] Tablas nuevas no contienen FKs huerfanas.
- [ ] Storage contiene archivos nuevos solo despues de respuesta exitosa del endpoint.

### Resultado 2026-09-16

- Tareas con `AssigneeId` no vacio: `26,486`.
- Relaciones creadas: `19,462`.
- Tareas con usuario legacy inexistente o inactivo: `7,024`; requieren reporte y decision de negocio.
- Segunda ejecucion: `0` relaciones nuevas.
- Duplicados `(TasksId, ApplicationUserId)`: `0`.
- Tareas con multiples responsables principales: `0`.
- FKs nuevas huerfanas: `0`.

## 6. Rollback

### Rollback de codigo antes de backfill

- Revertir despliegue de endpoints nuevos.
- Mantener tablas nuevas vacias; no afecta columnas legacy.

### Rollback despues de backfill

- Revertir codigo a version compatible con columnas legacy.
- No borrar `TaskResponsibles` ni imagenes nuevas automaticamente.
- Mantener backup de tablas nuevas para reintentar despliegue.
- Si se requiere eliminar tablas nuevas, ejecutar migracion down aprobada despues de exportar relaciones e inventario de storage.

### Prohibicion

No eliminar `AssigneeId`, `BeforeWork`, `AfterWork` ni `TaskFiles` como parte de rollback o expand migration.

## 7. Contract posterior

Solo despues de completar dual-read/dual-write y actualizar todos los consumidores:

1. emitir reporte de cero lecturas legacy;
2. aprobar retiro o permanencia de `AssigneeId` como cache;
3. crear migracion separada para contract;
4. aplicar en ventana independiente;
5. reauditar tareas, reportes, alertas, notificaciones, follow-ups y frontend.
