# Matriz de decisión: roles y acciones de Inspections

**Estado:** Pendiente de decisión del Tech Lead
**Módulo:** `OperationsLuxuryApp/Inspections`
**Propósito:** Definir permisos de todo el módulo para recorridos actuales, levantamiento inicial, inspección mayor y capacidades relacionadas.

## Cómo marcar

Reemplazar cada `—` por:

- `✓` — permitido
- `—` — denegado explícitamente
- `C` — permitido solo bajo condición; documentar condición en columna **Condición/Notas**

`—` significa pendiente, no permiso implícito. No implementar autorizaciones hasta aprobar matriz. `Administrador` ya tiene acordados revisión y firma digital auditada; esas dos celdas aparecen aprobadas.

## Acciones

| Código | Acción incluida |
|---|---|
| VIS | Consultar recorridos, ejecuciones, historial y hallazgos del cliente autorizado. |
| CFG | Crear/editar/desactivar configuración de inspección y periodicidad. |
| EQP | Vincular/desvincular equipos del inventario y criterios a una configuración. |
| LBI | Iniciar levantamiento inicial y congelar cobertura del inventario. |
| MAY | Crear/programar inspección mayor periódica. |
| ASG | Asignar o reasignar responsables. |
| CAP | Capturar/editar borrador: condición, hallazgos, notas y recomendaciones. |
| EVD | Agregar/eliminar evidencia fotográfica o documental antes del cierre. |
| ENV | Enviar captura terminada a revisión administrativa. |
| REV | Revisar y devolver captura con observaciones. |
| FIR | Aprobar, firmar digitalmente y cerrar acta/reporte. |
| REA | Reabrir un registro aprobado/cerrado o autorizar corrección extraordinaria. |
| ANX | Crear anexo de equipos incorporados después de la línea base. |
| CAT | Administrar catálogo de criterios técnicos por clasificación de equipo. |
| QR | Administrar etiquetas QR: crear, imprimir, consultar y desactivar. |
| EXP | Exportar/descargar reportes oficiales. |
| HAL | Consultar tablero/listado de hallazgos críticos. |

## Matriz cruzada

Las 42 filas corresponden a los roles sincronizados por `CreateRoles()`; nombres técnicos y tipos se conservan exactamente.

| Rol | Tipo | VIS | CFG | EQP | LBI | MAY | ASG | CAP | EVD | ENV | REV | FIR | REA | ANX | CAT | QR | EXP | HAL | Condición/Notas |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| SuperUsuario | System | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| Direccion | Executive | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| Legal | Corporate | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| CoordinacionLegal | Corporate | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| RecursosHumanos | Corporate | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| Reclutamiento | Corporate | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| GerenteMantenimiento | Corporate | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| SistemasGeneral | Corporate | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| Mensajeria | Corporate | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| SupervisionOperativa | Corporate | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| Administrador | Staff | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | Revisión y firma digital auditada acordadas. |
| GerenteOperaciones | Staff | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| GerenteAtencion | Staff | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | |
| Asistente | Staff | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| Contador | Staff | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| Cobranza | Staff | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| JefeMantenimiento | Staff | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| TecnicoMantenimiento | Staff | — | — | — | ✓ | ✓ | — | ✓ | ✓ | — | — | — | — | — | — | — | — | — | Ejecuta trabajo de campo: captura hallazgos y evidencia. |
| MttoNocturno | Staff | — | — | — | ✓ | — | — | ✓ | ✓ | — | — | — | — | — | — | — | — | — | Ejecuta trabajo de campo: captura hallazgos y evidencia. |
| Almacenista | Staff | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| SupervisorObra | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | |
| Recepcionista | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | |
| MasterConcierge | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | |
| Concierge | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | |
| JefeSeguridadInterna | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| SeguridadInterna | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| Monitorista | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| Sistemas | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| EntrenadorGimnasio | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| Ludotecaria | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| Paqueteria | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| Chofer | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| BellBoy | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| SnackBar | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| Salvavidas | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| JardineriaInterna | Staff | — | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — | |
| Comite | Client | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| Condomino | Client | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| Jardineria | Contractor | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| Limpieza | Contractor | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| Seguridad | Contractor | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |
| Proveedor | Contractor | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | |

## Decisiones confirmadas

| Acción | Decisión |
|---|---|
| FIR | `Administrador` aprueba y firma digitalmente; se registra usuario autenticado, rol, fecha/hora y versión aprobada. |
| REV | `Administrador` revisa y puede devolver al inspector antes de firmar. |
| Matriz 2026-10-04 | 27 de 42 roles marcados por el Tech Lead según captura de pantalla (`✓`/`—`): `SuperUsuario`, `Direccion`, `GerenteMantenimiento`, `SupervisionOperativa`, `Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `JefeMantenimiento`, `TecnicoMantenimiento`, `MttoNocturno`, `Almacenista`, `SupervisorObra`, `Recepcionista`, `MasterConcierge`, `Concierge`, `JefeSeguridadInterna`, `SeguridadInterna`, `Monitorista`, `Sistemas`, `EntrenadorGimnasio`, `Ludotecaria`, `Paqueteria`, `Chofer`, `BellBoy`, `SnackBar`, `Salvavidas`, `JardineriaInterna`. |
| Demás celdas | `Legal`, `CoordinacionLegal`, `RecursosHumanos`, `Reclutamiento`, `SistemasGeneral`, `Mensajeria`, `Asistente`, `Contador`, `Cobranza`, `Comite`, `Condomino`, `Jardineria`, `Limpieza`, `Seguridad`, `Proveedor` siguen pendientes de marcado por Tech Lead/usuario responsable. |

## Fuente de roles

- `api/LuxuryApp.Application/Modules/AdminLuxuryApp/SecurityPermissions/Access/ApplicationRole/Services/ApplicationRoleAppService.cs`, método `CreateRoles()` (42 roles).
- `api/LuxuryApp.Application/Shared/Enums/ApplicationRoleEnum.cs`.
- Roles se conservan sin inventar ni renombrar. Esta matriz define autorizaciones del módulo; no crea roles nuevos.
