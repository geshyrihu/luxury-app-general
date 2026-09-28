# Fase 9: RecursosHumanosLuxuryApp (Vertical Slices)

- Modulo objetivo real: `LuxuryApp.Application/Modules/RecursosHumanosLuxuryApp`.
- Regla aplicada: estandar de 4 niveles; excepcion de 5 niveles para agrupaciones logicas ya existentes como `TimeOff/Vacations/*`, `Employees/*`, `Nomina/*`, `Evaluacion/*` e `IncidenciasAdministrativas/*`.
- Rescate desde `SystemLuxuryApp/Domain/Entities`: no se movieron entidades; solo se encontro `Catalogs/Bank.cs`, que no corresponde a RRHH.
- Aplanamiento: eliminadas las capas envolventes `Domain` e `Infrastructure` dentro de RecursosHumanosLuxuryApp.
- Documentos sueltos del viejo `Domain/Entities` movidos a `RecursosHumanosLuxuryApp/Docs/DomainEntities/`.
- Entidades reubicadas: 50 archivos .cs en carpetas Entities de sus submodulos.
- Configuraciones de persistencia reubicadas: 2 archivos .cs en RecursosHumanosLuxuryApp/Persistence/RecursosHumanos/.
- Namespaces sincronizados: 347 archivos .cs actualizados a 190 namespaces path-based.
- Colisiones resueltas: 131 referencias calificadas con global:: donde los nombres de carpetas coincidieron con tipos (Employee, LeaveRequest, PeriodoNomina, etc.).
- Consumidores ajustados: `LuxuryApp.Application.csproj`, `GlobalUsings.cs`, tests con usings antiguos de entidades, `DocumentCatalogAppService`, `EmployeeInternalAppService`, `EmployeesEndpoints`, `ApplicationDbContextModelSnapshot` y `GenericEmail.cshtml`.
- Verificacion estructural: 0 carpetas `Domain`, `Application` o `Infrastructure` restantes dentro de RecursosHumanosLuxuryApp; 0 namespaces fuera de ruta.
- Verificacion de build: `dotnet build LuxuryApp.sln -v:q -p:OutputPath=.../work/rh-vertical-bin/` termino con 0 errores; la ultima corrida mostro 3 advertencias existentes fuera del alcance de la limpieza visual.

## Reubicacion de entidades

| Origen logico anterior | Destino vertical | Archivos |
|---|---|---:|
| $(@{Grupo=AsistenciayVacaciones; Destino=TimeOff/Entities; Archivos=6}.Grupo) | $(@{Grupo=AsistenciayVacaciones; Destino=TimeOff/Entities; Archivos=6}.Destino) | 6 |
| $(@{Grupo=ChekadorEmpleados; Destino=ChekadorEmpleados/Entities; Archivos=2}.Grupo) | $(@{Grupo=ChekadorEmpleados; Destino=ChekadorEmpleados/Entities; Archivos=2}.Destino) | 2 |
| $(@{Grupo=ContratacinyLegal; Destino=Employees/Entities; Archivos=7}.Grupo) | $(@{Grupo=ContratacinyLegal; Destino=Employees/Entities; Archivos=7}.Destino) | 7 |
| $(@{Grupo=EstructuraOrganizacional; Destino=Employees/EmployeeOrganigrama/Entities; Archivos=1}.Grupo) | $(@{Grupo=EstructuraOrganizacional; Destino=Employees/EmployeeOrganigrama/Entities; Archivos=1}.Destino) | 1 |
| $(@{Grupo=EvaluacionesdeDesempeo; Destino=Evaluacion/Entities; Archivos=5}.Grupo) | $(@{Grupo=EvaluacionesdeDesempeo; Destino=Evaluacion/Entities; Archivos=5}.Destino) | 5 |
| $(@{Grupo=ExpedientedelEmpleado; Destino=EmployeeFile/Entities; Archivos=11}.Grupo) | $(@{Grupo=ExpedientedelEmpleado; Destino=EmployeeFile/Entities; Archivos=11}.Destino) | 11 |
| $(@{Grupo=ExternalStaff; Destino=Employees/Employees/Entities; Archivos=1}.Grupo) | $(@{Grupo=ExternalStaff; Destino=Employees/Employees/Entities; Archivos=1}.Destino) | 1 |
| $(@{Grupo=GestindeIncidentesySanciones; Destino=IncidenciasAdministrativas/Entities; Archivos=7}.Grupo) | $(@{Grupo=GestindeIncidentesySanciones; Destino=IncidenciasAdministrativas/Entities; Archivos=7}.Destino) | 7 |
| $(@{Grupo=Payroll; Destino=Nomina/Entities; Archivos=10}.Grupo) | $(@{Grupo=Payroll; Destino=Nomina/Entities; Archivos=10}.Destino) | 10 |

## Namespaces finales

| Archivos | Namespace final | Namespace anterior |
|---:|---|---|
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 7 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 13 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 11 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 5 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 5 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 3 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 4 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 9 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 7 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 3 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 3 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 5 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 5 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 11 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 7 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 17 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 5 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 5 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 10 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 3 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 5 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 6 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 6 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 6 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 2 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |
| 1 | $(Microsoft.PowerShell.Commands.GroupInfo.Name) | $old |

