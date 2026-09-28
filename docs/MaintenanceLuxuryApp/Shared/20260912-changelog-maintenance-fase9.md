# Fase 9: MantenimientoLuxuryApp (Vertical Slices)

## Alcance

- Se aplicó el estándar de Cortes Verticales Puros y namespaces path-based al módulo `MantenimientoLuxuryApp`.
- Se mantuvo el estándar de resolución de colisiones con aliases de `using` limpios.
- Se preservó el comportamiento de negocio; los cambios fueron de ubicación física, namespaces y puentes de compilación.

## Gestión de bitácoras

- Se creó `docs/changelogs/05_fase9_mantenimiento.md` para registrar esta fase.

## Rescate de entidades

Se revisó `LuxuryApp.Application/Modules/SystemLuxuryApp/Domain/Entities` y se rescataron entidades relacionadas con mantenimiento/equipos:

- `SystemLuxuryApp/Domain/Entities/Catalogs/CatalogAsset.cs` -> `MantenimientoLuxuryApp/MachineryAsset/Entities/CatalogAsset.cs`
- `SystemLuxuryApp/Domain/Entities/Catalogs/EquipoClasificacion.cs` -> `MantenimientoLuxuryApp/Machinery/Entities/EquipoClasificacion.cs`

## Aplanamiento físico

Se eliminaron las carpetas envolventes `Domain` e `Infrastructure`, sacando su contenido al corte vertical correspondiente:

- `Domain/Entities/EquipmentInspections/*` -> `EquipmentInspections/Entities/*`
- `Domain/Entities/Equipments/Equipment.cs` -> `Machinery/Entities/Equipment.cs`
- `Domain/Entities/Equipments/EquipmentDocuments.cs` -> `MachineryDocument/Entities/EquipmentDocuments.cs`
- `Domain/Entities/FireInspectionPeriods/*` -> `FireInspectionPeriods/Entities/*`
- `Domain/Entities/Logs/BitacoraExtintor.cs` -> `FireExtinguisherLog/Entities/BitacoraExtintor.cs`
- `Domain/Entities/Logs/BitacoraHidrante.cs` -> `HydrantLog/Entities/BitacoraHidrante.cs`
- `Domain/Entities/Logs/BitacoraDetectorHumo.cs` -> `SmokeDetectorLog/Entities/BitacoraDetectorHumo.cs`
- `Domain/Entities/Logs/BitacoraEstacionManual.cs` -> `ManualCallPointLog/Entities/BitacoraEstacionManual.cs`
- `Domain/Entities/Logs/BitacoraMantenimiento.cs` y `BitacoraEquipoBase.cs` -> `MaintenanceLog/Entities/*`
- `Domain/Entities/Logs/ControlPrestamoHerramienta.cs` -> `ToolLoan/Entities/ControlPrestamoHerramienta.cs`
- `Domain/Entities/Logs/ElevatorsEmergencyCall.cs` -> `ElevatorEmergencyCall/Entities/ElevatorsEmergencyCall.cs`
- `Domain/Entities/Logs/ElevatorSparePartsChange.cs` -> `ElevatorSpareParts/Entities/ElevatorSparePartsChange.cs`
- `Domain/Entities/Logs/Medidor.cs` y `MedidorLectura.cs` -> `Medidores/Entities/*`
- `Domain/Entities/Logs/Piscina.cs` -> `Piscina/Entities/Piscina.cs`
- `Domain/Entities/Logs/PiscinaBitacora.cs` -> `PiscinaBitacora/Entities/PiscinaBitacora.cs`
- `Domain/Entities/Logs/RecepcionPipaAgua.cs` -> `RecepcionPipasAgua/Entities/RecepcionPipaAgua.cs`
- `Domain/Entities/PlanificacindeMantenimiento/CalendarioMaestro.cs` -> `CalendarioMaestro/Entities/CalendarioMaestro.cs`
- `Domain/Entities/PlanificacindeMantenimiento/CalendarioMaestroEquipo.cs` -> `CalendarioMaestroEquipo/Entities/CalendarioMaestroEquipo.cs`
- `Domain/Entities/PlanificacindeMantenimiento/CalendarioMaestroProvider.cs` -> `CalendarioMaestro/Entities/CalendarioMaestroProvider.cs`
- `Domain/Entities/PlanificacindeMantenimiento/MaintenanceBudgetForecast.cs` -> `BudgetMaintenance/Entities/MaintenanceBudgetForecast.cs`
- `Domain/Entities/PlanificacindeMantenimiento/MaintenanceCalendar.cs` -> `MaintenanceCalendars/Entities/MaintenanceCalendar.cs`
- `Domain/Entities/Planning` -> `MaintenanceCalendars/Entities/Planning`
- `Infrastructure/Persistence` -> `Persistence`

## Sincronización de namespaces

- Se actualizaron 236 archivos `.cs` dentro de `MantenimientoLuxuryApp`.
- El módulo quedó distribuido en 129 namespaces path-based bajo `LuxuryApp.Application.Modules.MantenimientoLuxuryApp`.
- Se agregaron los nuevos namespaces a `LuxuryApp.Application/GlobalUsings.cs`, `LuxuryApp.Api/GlobalUsings.cs` y `LuxuryApp.Tests/GlobalUsings.cs`.
- Se eliminó del `.csproj` el `Using` generado que apuntaba al namespace obsoleto `LuxuryApp.Application.Modules.MantenimientoLuxuryApp.Domain.Entities.Logs`.

## Resolución limpia de colisiones

Se resolvieron colisiones de nombres con aliases de `using`, evitando `global::` en línea dentro de `MantenimientoLuxuryApp`. Los alias principales fueron:

- `CalendarioMaestroEntity`
- `CalendarioMaestroEquipoEntity`
- `PiscinaEntity`
- `PiscinaBitacoraEntity`

Archivos con aliases relevantes:

- `LuxuryApp.Application\Modules\MantenimientoLuxuryApp\CalendarioMaestro\Entities\CalendarioMaestro.cs`
- `LuxuryApp.Application\Modules\MantenimientoLuxuryApp\CalendarioMaestro\Interfaces\ICalendarioMaestroAppService.cs`
- `LuxuryApp.Application\Modules\MantenimientoLuxuryApp\CalendarioMaestro\Services\CalendarioMaestroAppService.cs`
- `LuxuryApp.Application\Modules\MantenimientoLuxuryApp\CalendarioMaestroEquipo\Interfaces\ICalendarioMaestroEquipoAppService.cs`
- `LuxuryApp.Application\Modules\MantenimientoLuxuryApp\CalendarioMaestroEquipo\Mapping\CalendarioMaestroEquipoMapper.cs`
- `LuxuryApp.Application\Modules\MantenimientoLuxuryApp\CalendarioMaestroEquipo\Services\CalendarioMaestroEquipoAppService.cs`
- `LuxuryApp.Application\Modules\MantenimientoLuxuryApp\Piscina\Mapping\PiscinaMapper.cs`
- `LuxuryApp.Application\Modules\MantenimientoLuxuryApp\Piscina\Services\PiscinaAppService.cs`
- `LuxuryApp.Application\Modules\MantenimientoLuxuryApp\PiscinaBitacora\Entities\PiscinaBitacora.cs`
- `LuxuryApp.Application\Modules\MantenimientoLuxuryApp\PiscinaBitacora\Mapping\PiscinaBitacoraMapper.cs`
- `LuxuryApp.Application\Modules\MantenimientoLuxuryApp\PiscinaBitacora\Services\PiscinaBitacoraAppService.cs`

## Limpieza de advertencias

Para conservar la meta de build impecable se limpiaron advertencias ajenas al módulo que aparecieron durante la verificación:

- Se marcó como intencional el uso de `null` en pruebas con `null!`.
- Se tiparon diccionarios de configuración de pruebas como `Dictionary<string, string?>`.
- Se dejó explícita la intención fire-and-forget en `ExclusionesBuilder` con descarte `_ =`.

## Verificación

- `dotnet build LuxuryApp.sln` finalizó correctamente.
- Resultado final: 0 advertencias, 0 errores.
- Validación física: no quedan carpetas `Domain`, `Application` ni `Infrastructure` dentro de `MantenimientoLuxuryApp`.
- Validación de namespaces: no quedan archivos `.cs` del módulo con namespace distinto de su ruta física.
- Validación de estilo: no quedan usos `global::LuxuryApp.Application.Modules.MantenimientoLuxuryApp...` dentro del módulo.
