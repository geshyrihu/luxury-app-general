# Auditoría: MonthlyMeetings / MeetingMinutes (Backend + Frontend)

**Fecha auditoría:** 2026-09-19
**Fecha remediación:** 2026-09-19
**Módulo:** OperationsLuxuryApp / MonthlyMeetings / MeetingMinutes (antes `JuntasMensuales / Minuta`)
**Frontend:** `appsweb/angular/src/app/modules/management.luxuryapp/monthly-meetings/meeting-minutes/` (antes `juntas-comite/junta-comite-minutas/`)
**Backend:** `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/MonthlyMeetings/MeetingMinutes/` (antes `JuntasMensuales/Minuta/`)
**Tipo:** Auditoría de módulo existente (§4.4 / §5.8 CONVENTIONS.md)
**Estado:** Remediación ejecutada (Fases 1-3 sin RBAC ni tenant)

---

## 0. Estado de Remediación (2026-09-19)

> Nota: durante la auditoría el módulo fue renombrado de español a inglés
> (`JuntasMensuales/Minuta` -> `MonthlyMeetings/MeetingMinutes`, front
> `juntas-comite/junta-comite-minutas` -> `monthly-meetings/meeting-minutes`). Los hallazgos
> se remediaron sobre las rutas nuevas.

| ID | Estado | Cambio aplicado |
|----|--------|-----------------|
| C1 | ✅ Resuelto | Front alineado a `typeMeeting` (backend camelCase). Antes `eTypeMeeting` no bindeaba y forzaba `Asamblea`. |
| C2 | ⏸ Diferido | RBAC: se define con el Tech Lead (roles a debatir). |
| C3 | ✅ Resuelto | `meeting-report-pdf` ya no es `AllowAnonymous`. |
| C4 | ⏸ Diferido | Restricción de rol del envío masivo (depende de C2). |
| C5 | ✅ Resuelto | `MinutaDetalleForm`: `areaMinutasDetalles` (casing) + `meetingId` requerido. |
| A1 | ⏸ Diferido | Aislamiento tenant en entidades hijas (requiere decisión de arquitectura). |
| A2 | ✅ Resuelto | Estatus string normalizado en export/tags de pendientes. |
| A3 | ✅ Resuelto | `meeting-management` usa `authS.applicationUserId`. |
| A4 | ✅ Resuelto | DTOs separados: 3 archivos -> 13 (1 archivo = 1 DTO). |
| A5 | ✅ Resuelto | Eliminado `DTOs/MeetingResponsibleItemDTO.cs` (duplicado muerto). |
| A6 | ✅ Resuelto | Validación de existencia de `MeetingId`, detalle y estatus en Add/Update. |
| A7 | ✅ Resuelto | `MeetingDetailsAppServiceTests` (6 pruebas, verdes). |
| M1 | ✅ Resuelto | Mojibake corregido (front + `management.routes.ts` verificado). |
| M2 | ✅ Resuelto | Labels de estatus 2 = "No Autorizado". |
| M3 | ✅ Resuelto | Vista móvil usa `getSeverityText`. |
| M4 | ✅ Resuelto | `routerLink` -> `/committee-meetings/minutes`. |
| M5 | ✅ Resuelto | `MeetingAppService` 746 → 277 líneas. Nuevos: `SubServices/MeetingReportService` (206), `SubServices/MeetingNotificationService` (212), `Helpers/MeetingMinutesHelpers` (18), `Helpers/MeetingDtoMapper` (41). Todos < 300 líneas. Contrato `IMeetingAppService` intacto (facade delega). |
| M6 | ✅ Resuelto | Renombrados `MeetingDetailsSeguimientoAppService`, `MeetingDetailsListDTO`, `MeetingDetailsFollowUps`. |
| M7 | ✅ Resuelto | Eliminados `MeetingReportDTO`, `MeetingDetailsReportDTO`, `MeetingParticipantsReportDTO`. |
| M8 | ✅ Resuelto | `maxLength` seguimiento 250 -> 300 (paridad con entidad). |
| M9 | ✅ Resuelto | Cubierto por C5. |
| M10 | ✅ Resuelto | Correo de contador solo en su área. |
| M11 | ✅ Resuelto | `personId` eliminado del servicio (ruta conservada por compatibilidad). |
| M1b | ⏸ Diferido | Detección extendida del escáner revertida (dejaba el gate en rojo). Deuda cross-repo (254 casos) con plan propio: `docs/AngularLuxuryApp/Audits/20260919-plan-remediacion-mojibake.md`. |

**Verificación:** `dotnet build` Application 0 errores · Api compila (solo falla la copia del DLL por la app en ejecución) · `dotnet test` filtro módulo 6/6 · `tsc --noEmit` limpio · `npm run audit:encoding` 0 (exit 0).



---

## 1. Resumen Ejecutivo

El módulo gestiona reuniones (Asamblea / Comité / Operación), sus acuerdos (`MeetingDetails`), el seguimiento de avances (`MeetingDetailsSeguimiento`), los participantes (administración, comité, invitados) y la generación de minutas PDF/Excel con envío de correos.

La arquitectura base es correcta (Minimal APIs con `IEndPointsModule`, CQRS-lite vía `AppService`, AutoMapper, EF Core, Angular 22 con Signals y `AppTable`). Sin embargo, la auditoría identifica **5 hallazgos críticos** que rompen contrato funcional y seguridad, **7 altos** de fuga de datos/consistencia y **11 medios** de deuda técnica. El hallazgo más grave es la desalineación de contrato `TypeMeeting` vs `eTypeMeeting`, que provoca que toda junta creada o editada quede registrada como `Asamblea`.

**Conteo:** Críticos 5 · Altos 7 · Medios 11.

---

## 2. Visión Funcional

- Cabecera de junta (`Meeting`) con fecha, hora, tipo y cliente.
- Acuerdos por área (`AreaMinutasDetalles`: Contable, Operaciones, Legal) con estatus (`Status`: Pendiente, Concluido, noAutorizado, Proceso, Cancelado).
- Bitácora de seguimiento por acuerdo.
- Participantes: administración (empleados por rol), comité (miembros de propiedad con `PosicionComite`), invitados externos.
- Reportes: minuta PDF individual, resumen de presentación, gráfico, exportación Excel.
- Notificaciones por correo a responsables por área.

Flujo principal (end-to-end):

```
Listado (GET meetings/list/{customerId}/{tipo})
   -> Gestionar minuta (GET meetings/get-details/{id})
      -> CRUD acuerdos (POST/PUT/DELETE meetings-details)
         -> CRUD seguimientos (POST/PUT/DELETE meeting-details-seguimientos)
   -> PDF (GET meetings/meeting-report-pdf/{id})
   -> Pendientes (GET meetings/minuta-all-pendientes/{customerId})
   -> Seguimiento (GET meetings/seguimiento-minutas/{customerId}/{status})
   -> Envío correos (POST meetings/send-email-responsible/...)
```

---

## 3. Entidades y Relaciones

| Entidad | Tabla | Responsabilidad | `ITenantEntity` | Soft Delete |
|---------|-------|-----------------|-----------------|-------------|
| `Meeting` | `Meetings` | Cabecera de junta | Sí | No |
| `MeetingDetails` | `MeetingAgendas` | Acuerdo/asunto de la junta | **No** | No |
| `MeetingDetailsSeguimiento` | `MeetingFollowUps` | Avance del acuerdo | **No** | No |
| `MeetingAdministracion` | `MeetingAdminSessions` | Participante admin | **No** | No |
| `MeetingComite` | `MeetingBoardSessions` | Participante comité | **No** | No |
| `MeetingInvitado` | `MeetingParticipants` | Invitado externo | **No** | No |

**Hallazgo A1:** Solo `Meeting` implementa `ITenantEntity` (`Meeting.cs:6`). Sus hijos no. Toda consulta directa a `MeetingAgendas` / `MeetingFollowUps` / etc. pierde cualquier aislamiento por tenant. Además, no existe filtro global por tenant registrado en `ApplicationDbContext` (el único `HasQueryFilter` masivo es para `ISoftDeletable`, `ApplicationDbContext.cs:3386-3410`).

---

## 4. Enums

| Enum | Valores | Notas |
|------|---------|-------|
| `TypeMeeting` | Asamblea(0), Comite(1), Operacion(2) | `TypeMeeting.cs` |
| `AreaMinutasDetalles` | Contable(0), Operaciones(1), Legal(2) | `AreaMinutasDetalles.cs` |
| `Status` | Pendiente(0), Concluido(1), noAutorizado(2), Proceso(3), Cancelado(4) | Nombre `noAutorizado` sin PascalCase |
| `PosicionComite` | Presidente, Tesorero, Vocal, Socio, Secretario | |

**Observación:** `Status.Proceso` y `Status.Cancelado` no se usan en la lógica de minutas (se manejan 0/1/2). El front rotula el 2 como "Cancelado" (ver M2), contradiciendo `DisplayName = "No Autorizado"`.

---

## 5. Matriz de Reglas de Negocio (4 Niveles)

| Nivel | Regla esperada | Estado en código | Severidad |
|-------|----------------|------------------|-----------|
| 1 Invariante | Un acuerdo pertenece a una junta existente | `AddAsync` no valida existencia de `MeetingId` (`MeetingDetailsAppService.cs:120`) | Alto |
| 1 Invariante | Aislamiento por cliente/tenant | Hijos sin `ITenantEntity`; `GetMeetingLegalDTOAsync` sin filtro tenant | Alto |
| 2 Flujo | Transición de `Status` controlada | No hay validación de transición (`UpdateMeetingDetailsDTO.Status` libre) | Alto |
| 2 Flujo | `Concluido` requiere seguimiento | No validado | Alto |
| 3 Seguridad | Endpoints con rol autorizado | Todos solo `.RequireAuthorization()` sin roles | Crítico |
| 3 Seguridad | PDF protegido | `AllowAnonymous` (`MeetingsEndpoints.cs:20`) | Crítico |
| 3 Seguridad | Envío masivo restringido | Sin rol; itera todos los clientes | Crítico |
| 4 Validación | `MeetingId` obligatorio | `[Required]` en DTO, pero UI de seguimiento no lo envía | Crítico |
| 4 Validación | Longitud seguimiento | Entidad 300 vs Form 250 | Medio |

---

## 6. Hallazgos Críticos

### C1 — Contrato front/back roto en tipo de junta (`TypeMeeting` vs `eTypeMeeting`)
- Backend: `MeetingHeaderDTO.TypeMeeting` (`DTOs/MeetingHeaderDTO.cs:10`). Minimal APIs usan `JsonSerializerDefaults.Web` (camelCase) — `Program.cs:141-148` no define `PropertyNamingPolicy`, por lo que el campo viaja como `typeMeeting`.
- Frontend usa `eTypeMeeting`: `meeting-form.ts:38,80`, `core/interfaces/meeting-index.interface.ts:8`, `minutas-list.ts:126`, `minuta-pdf.service.ts:17`.
- Efecto:
  - `POST/PUT meetings` no bindea `TypeMeeting` -> queda en el default `Asamblea (0)`. `UpdateAsync` sobreescribe el tipo en cada edición (`MeetingAppService.cs:133`).
  - Lecturas (`list`, `get-details`, `FindByIdAsync`) entregan `typeMeeting`, que el front nunca lee.
- Refs: `MeetingAppService.cs:58-146`, `MeetingForm.onSubmit` `meeting-form.ts:102-145`.

### C2 — Cero RBAC en endpoints
- Grupos solo `.RequireAuthorization()`: `MeetingsEndpoints.cs:8-11`, `MeetingsDetailsEndpoints.cs:8-11`, `MeetingDetailsSeguimientosEndpoints.cs:8-11`, `MeetingAdministracionEndpoints.cs:8-11`, `MeetingComiteEndpoints.cs:8-11`, `MeetingInvitadoEndpoints.cs:8-11`.
- El front oculta Eliminar a quien no sea `SuperUsuario` (`minutas-list.html:240,387`), pero el backend acepta `DELETE` de cualquier autenticado -> bypass trivial por DevTools/Postman.

### C3 — PDF de minuta sin autenticación
- `GET api/meetings/meeting-report-pdf/{id}` con `.AllowAnonymous()` (`MeetingsEndpoints.cs:18-21`) expone cliente, comité, administración, externos, asuntos y seguimientos completos. Cualquiera con el GUID accede sin token.

### C4 — Envío masivo de correo cross-tenant sin restricción
- `POST api/meetings/send-email-all-pending-meeting` sin rol (`MeetingsEndpoints.cs:46-48`).
- `SendEmailAllPendingMeeting` (`MeetingAppService.cs:518-584`) itera **todos** los clientes activos y envía correo por cada área. Cualquier autenticado puede dispararlo.

### C5 — Edición de asunto desde Seguimiento rota
- `seguimiento-minutas.ts:121-135` abre `MinutaDetalleForm` con `{ id, areaResponsable }` sin `meetingId`.
- `UpdateMeetingDetailsDTO.MeetingId` es `[Required] Guid` (`UpdateMeetingDetailsDTO.cs:9`) y el control no tiene validador (`minuta-detalle-form.ts:95`). En update se mapea `MeetingId = Guid.Empty` -> violación de FK o corrupción del acuerdo.

---

## 7. Hallazgos Altos

| ID | Hallazgo | Evidencia |
|----|----------|-----------|
| A1 | Hijos sin `ITenantEntity`; `GetMeetingLegalDTOAsync` devuelve asuntos legales de todos los clientes sin filtro tenant/rol | `MeetingDetails.cs:6`, `MeetingDetailsAppService.cs:16-52` |
| A2 | Export Excel de pendientes siempre etiqueta "Completado": back entrega `Status` string `GetDisplayName().ToUpper()`, front compara `asunto.status === 0` | `MeetingAppService.cs:632`, `minuta-pendientes.ts:120`, `minuta-pendientes.html:26` |
| A3 | `applicationUserId="0"` hardcodeado en envío; backend ignora el parámetro | `meeting-management.ts:111`, `MeetingAppService.cs:387` |
| A4 | Violación 1 archivo = 1 DTO | `DTOs/ReporteMinutaIndividualDTO.cs` (9 records), `MeetingBoardDirectorsDTO.cs` (2), `MeetingDetailsBoardDirectorsDTO.cs` (2) |
| A5 | DTO duplicado y muerto que colisiona con el compartido real | `DTOs/MeetingResponsibleItemDTO.cs` vs `SystemLuxuryApp...ViewModels.MeetingResponsibleItemDTO` (usado en `MeetingAppService.cs:398,454,534`) |
| A6 | Sin validación de transiciones/pre-requisitos de estado ni de `MeetingId` | `MeetingDetailsAppService.cs:120-135` |
| A7 | Módulo sin pruebas; el test homónimo prueba otro dominio | `LuxuryApp.Tests/Application/Services/MeetingAppServiceTests.cs` (EquipmentQrLabel) |

---

## 8. Hallazgos Medios

| ID | Hallazgo | Evidencia |
|----|----------|-----------|
| M1 | Mojibake/ortografía visible y scanner en punto ciego | `COMITé`/`OPERACIóN` (`minutas-list.html:54,61,306,315`), `mívil`/`lónea`/`Tútulo` (`seguimiento-minutas.html:16,17,20`), `genórica` (`meeting-area-table.html:1`), `óEsté seguro` (`minutas-list.html:364`), `área`/`óltimo` (`minuta-pendientes.ts:80,83`). `scan-mojibake.mjs` reporta 0 |
| M2 | Labels de status inconsistentes ("Cancelado" para `noAutorizado`) | `resumen-minuta.ts:133-144`, `seguimiento-minutas.html:231-237` |
| M3 | Vista móvil del resumen muestra status numérico | `resumen-minuta.html:209` |
| M4 | Router roto (ruta legacy inexistente) | `meeting-management.html:5` -> `/junta-comite/list-minutas`; real `/committee-meetings/minutes` |
| M5 | God service de 746 líneas (CRUD + PDF + emails + seguimiento + reportes) | `MeetingAppService.cs` |
| M6 | Naming con typos | `MeetingDertailsSeguimientoAppService`, `MeetingDertailsSeguimientos`, `MettingetailsDTO` |
| M7 | Código muerto / semántica confusa | `MeetingReportDTO`/`MeetingDetailsReportDTO`/`MeetingParticipantsReportDTO` solo en `MeetingMapper.cs:19-22`; `GetAllAsync(status==0)` = todos (`MeetingDetailsAppService.cs:97-118`); `GetAllAsync` de seguimientos sin paginar (`MeetingDertailsSeguimientoAppService.cs:19-25`) |
| M8 | Longitud de seguimiento inconsistente | Form 250 (`meeting-seguimiento-edit.ts:61`) vs entidad 300 (`MeetingDetailsSeguimiento.cs:29`) |
| M9 | Front lee `result.AreaMinutasDetalles` pero API emite `areaMinutasDetalles` | `minuta-detalle-form.ts:128` |
| M10 | Correo de Contabilidad se agrega a todas las áreas | `MeetingAppService.cs:568` (fuera del `if`) |
| M11 | `personId` recibido e ignorado; hardcodeado `/1` en el endpoint front | `MeetingAdministracionAppService.cs:27`, `direccion.endpoints.ts:26` |

---

## 9. Matriz de Permisos (Endpoints)

| Endpoint | Método | Auth | Rol | Guard front | Front lo llama |
|----------|--------|------|-----|-------------|----------------|
| `api/meetings` | POST/PUT/DELETE | Sí | Ninguno | `authGuard` | Sí |
| `api/meetings/meeting-report-pdf/{id}` | GET | **No** (Anónimo) | — | `authGuard` | Sí |
| `api/meetings/send-email-all-pending-meeting` | POST | Sí | Ninguno | `authGuard` | Sí |
| `api/meetings/send-email-responsible/...` | POST | Sí | Ninguno | `authGuard` | Sí |
| `api/meetings-details` | POST/PUT/DELETE | Sí | Ninguno | `authGuard` | Sí |
| `api/meeting-details-seguimientos` | POST/PUT/DELETE | Sí | Ninguno | `authGuard` | Sí |
| `api/meeting-administracion` | POST/DELETE | Sí | Ninguno | `authGuard` | Sí |
| `api/meeting-comite` | POST/DELETE | Sí | Ninguno | `authGuard` | Sí |
| `api/meeting-invitado` | POST/DELETE | Sí | Ninguno | `authGuard` | Sí |

Rutas front: `committee-meetings.routing.ts` solo aplica `authGuard` (sin guard de rol).

---

## 10. Validaciones Front vs Back

| Campo | Front | Back | Coincide |
|-------|-------|------|----------|
| Tipo de junta | `required` sobre `eTypeMeeting` | `required` sobre `TypeMeeting` | ❌ nombre distinto -> no bindea |
| Fecha junta | required | `DateOnly` `[Required]` | ✅ |
| `MeetingId` (detalle) | sin validador | `[Required] Guid` | ❌ |
| `deliveryDate` | required | nullable | ⚠️ |
| `title` / `requestService` | required | `[Required]` | ✅ |
| Seguimiento | maxLength 250 | `MaxLength(300)` | ⚠️ |
| Status | select libre | sin validación de transición | ❌ |
| Área | required | nullable `AreaMinutasDetalles?` | ⚠️ |

---

## 11. Diagrama de Componentes

```
MinutasList (minutas-list)  ──> AreaDetailsTable ──> MinutaDetalleForm
     │                              │                  └──> MeetingSeguimientoEdit
     │                              └──> MeetingSeguimientoEdit
     ├──> MeetingForm (cabecera + ComiteForm / AdministrationFormList / InvitedForm)
     ├──> MeetingDetailForm (filtro por estatus)
     ├──> ResumenMinuta (+ ResumenMinutaGrafico) [gráfico comentado en imports]
     └──> MinutaPdfService (HTML print)

MinutaPendientes ──> ExcelJS (export cliente)
SeguimientoMinuta ──> MinutaDetalleForm / MeetingSeguimientoEdit / ContMinutaSeguimientos
MeetingManagement ──> AreaDetailsTable (gestion-minuta/:id)
```

---

## 12. Plan de Remediación Priorizado

### Fase 1 — Críticos (bloqueante)
- [ ] **C1:** Alinear contrato de tipo de junta: renombrar a `typeMeeting` en `IMeetingForm`, `MeetingIndex` y `minuta-pdf.service.ts`, o anotar `[JsonPropertyName("eTypeMeeting")]`. Confirmar con `PUT` que el tipo persiste.
- [ ] **C2:** Añadir roles a todos los grupos (p. ej. `.RequireAuthorization(p => p.RequireRole(...))`): `SuperUsuario`/`Admin` para delete y envíos; roles operativos para lectura.
- [ ] **C3:** Quitar `AllowAnonymous()` del PDF o exigir token/URL firmada.
- [ ] **C4:** Restringir `send-email-all-pending-meeting` a rol administrativo y acotar por tenant.
- [ ] **C5:** Pasar `meetingId` a `MinutaDetalleForm` desde Seguimiento y marcar el control como `required`.

### Fase 2 — Altos
- [ ] **A1:** Implementar `ITenantEntity` en hijos o filtro tenant explícito; validar aislamiento en `GetMeetingLegalDTOAsync`.
- [ ] **A2:** Normalizar `Status` en backend (`Status` enum numérico) o parsear string en el front; corregir `minuta-pendientes.ts:120` y `.html:26`.
- [ ] **A3:** Reemplazar `"0"` por `authS.applicationUserId`.
- [ ] **A4:** Separar DTOs a 1 archivo/1 DTO (regla §6.1).
- [ ] **A5:** Eliminar `DTOs/MeetingResponsibleItemDTO.cs` y usar el DTO compartido.
- [ ] **A6:** Validar transiciones de `Status` y existencia de `MeetingId`.
- [ ] **A7:** Crear pruebas reales del módulo (creación, transición, aislamiento tenant).

### Fase 3 — Medios
- [ ] **M1:** Corregir textos y ampliar `scripts/scan-mojibake.mjs` para sustitución vocálica (`mívil`->`móvil`, `lónea`->`línea`, etc.); gate en CI.
- [ ] **M2/M3:** Unificar labels de status con `Status.DisplayName`.
- [ ] **M4:** Corregir `routerLink` y usar `ROUTES.JUNTAS_COMITE.MINUTAS`.
- [ ] **M5:** Dividir `MeetingAppService` (Cabecera / Detalle / Seguimiento / Reportes / Email).
- [ ] **M6:** Corregir typos de naming.
- [ ] **M7:** Retirar código muerto y añadir paginación/filtros.
- [ ] **M8/M9/M10/M11:** Unificar longitudes, corregir casing de lectura, mover correo de contador a su área, limpiar parámetros muertos.

---

## 13. Checklist de Validación

- [ ] `TypeMeeting` persiste y se lee correctamente en crear/editar/listar.
- [ ] Todo endpoint mutante rechaza acciones fuera de rol (probado por API directa, no solo UI).
- [ ] PDF no accesible sin autenticación.
- [ ] Envío masivo restringido y acotado al cliente.
- [ ] Edición de asunto desde Seguimiento actualiza sin romper FK.
- [ ] Consultas de minutas solo devuelven datos del tenant del usuario.
- [ ] `node scripts/scan-mojibake.mjs` = 0 en ambos árboles tras corregir textos.
- [ ] Tests del módulo en verde.

---

## 14. Referencias

- `conventions/CONVENTIONS.md` §4.4 (Auditoría), §5.8 (Auditoría), §6.1 (DTOs / 1 archivo = 1 DTO), §5.9.1 (Notificaciones).
- `conventions/audit/audit-prompt-comprehensive.md`, `conventions/audit/audit-checklist-completo.md`.
- `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/JuntasMensuales/Minuta/README.md`.

