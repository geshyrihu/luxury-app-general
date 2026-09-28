# Fase 9: OperationsLuxuryApp (Vertical Slices)

## Alcance

Se aplicó el Estándar de Oro al módulo `OperationsLuxuryApp`: rescate de entidades operativas desde `SystemLuxuryApp`, eliminación de capas envolventes `Domain`, `Application` e `Infrastructure`, sincronización de namespaces path-based y reparación de referencias consumidoras.

## Entidades rescatadas desde SystemLuxuryApp

Se movieron los catálogos operativos que permanecían en `Modules/SystemLuxuryApp/Domain/Entities/Catalogs/`:

- `Category.cs` -> `Modules/OperationsLuxuryApp/Inventory/Entities/`
- `Producto.cs` -> `Modules/OperationsLuxuryApp/Inventory/Entities/`
- `UnidadMedida.cs` -> `Modules/OperationsLuxuryApp/Inventory/Entities/`
- `WorkGroupCategories.cs` -> `Modules/OperationsLuxuryApp/Tasks/WorkGroupCategories/Entities/`

Se verificó que esos archivos ya no permanecen en `SystemLuxuryApp`.

## Aplanamiento físico

Se consolidaron las entidades y persistencia antiguas que estaban bajo wrappers internos:

- `AccessControl` -> `AccessControl/Entities`
- `Announcements` -> `Announcement/Entities`
- `AsambleasyPlanificacin` -> `JuntasMensuales/Asamblea/Entities`
- `CustomDocuments` -> `CustomDocument/Entities`
- `Diagrams` -> `Diagram/Entities`
- `FieldService` -> `ServiceOrder/Entities`
- `GoogleCalendar` -> `GoogleCalendar/Entities` y `JuntasMensuales/Session/Entities`
- `InspeccionesyAuditora` -> `Inspections/Entities`
- `InventariosyAlmacn` -> `Inventory/Entities`
- `Manuals` -> `Comite/Manuals/Entities`
- `Meetings` -> `Comite/ComiteVigilancia/Entities`, `JuntasMensuales/Minuta/Entities` y `JuntasMensuales/Presentacion/Entities`
- `PanicAlert` -> `PanicAlert/Entities`
- `Properties` -> `DeliveryReception/Entities`, `Property/Entities` y `PropertyOccupant/Entities`
- `Supervision` -> `Supervision/Supervision/Entities`
- `TaskEngine` -> cortes verticales bajo `Tasks/*/Entities`
- `Infrastructure/Persistence` -> `Persistence/AccessControl`, `Persistence/Comite`, `Persistence/JuntasMensuales` y `Persistence/Operaciones`

Resultado físico validado:

- Archivos .cs en OperationsLuxuryApp: 608
- Namespaces declarados alineados: 608
- Wrappers Domain, Application, Infrastructure restantes: 0
- Namespaces fuera de ruta: 0
- Usos inline de `global::LuxuryApp.Application.Modules.OperationsLuxuryApp` dentro del módulo: 0

## Namespaces y referencias actualizadas

Todos los archivos `.cs` de `Modules/OperationsLuxuryApp/` quedaron con namespaces basados en su ruta física.

Se regeneraron los puentes de `GlobalUsings.cs` en `LuxuryApp.Application`, `LuxuryApp.Api` y `LuxuryApp.Tests` para exponer los nuevos namespaces del módulo.

Se limpiaron referencias antiguas en `.csproj` que apuntaban a rutas previas de Operations y se repararon consumidores externos: pruebas de Tasks, plantillas Razor de correos, servicios de anuncios oficiales y referencias antiguas a `Application.Constants`, `Application.Events`, `Application.Tickets.*` y `Domain.Entities.*`.

## Colisiones resueltas con aliases

Se mantuvo el estándar de aliases limpios para evitar ambigüedades con nombres comunes:

- `AnnouncementEntity`
- `ComiteVigilanciaEntity`
- `CustomDocumentEntity`
- `PropertyEntity`
- `PropertyOccupantEntity`
- `PanicAlertEntity`
- `TasksEntity`
- `ServiceOrderEntity`
- `WorkGroupEntity`
- `RadioComunicacionEntity`
- `TaskAttachmentEntity`
- `TaskWorkPlanEntity`
- `TaskJustificationEntity`
- `TaskFollowUpEntity`
- `WorkGroupCategoriesEntity`

## Verificación

Se ejecutó `dotnet build LuxuryApp.sln` a nivel solución.

```text
Compilación correcta.
0 Advertencia(s)
0 Errores
```
