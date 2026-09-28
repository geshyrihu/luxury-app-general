# Auditoría: Piscina + PiscinaBitacora (Mantenimiento / Amenidades)

**Fecha:** 2026-08-18
**Frontend:** `client/angular/src/app/apps/mantenimiento.luxuryapp/logs/piscina` y `.../piscina-bitacora`
**Backend:** `api/LuxuryApp.Application/Moduls/MantenimientoLuxuryApp/Piscina` y `.../PiscinaBitacora`
**Auditor:** Agente de auditoría (Kilo)

---

## 📊 Resumen Ejecutivo

| Indicador | Valor |
|---|---|
| Cumplimiento CONVENTIONS (estimado) | ~74% (objetivo 95%) |
| Hallazgos CRÍTICOS | 1 |
| Hallazgos ALTOS | 3 |
| Hallazgos MEDIOS | 6 |
| Hallazgos BAJOS / Observaciones | 4 |
| Mojibake | 0 ✅ (gate `scan-mojibake.mjs` OK) |

**Estado de prioridad:** INMEDIATA (1 CRÍTICA de seguridad + 3 ALTAS de integridad/contrato).

## 🛠️ Estado de Remediación (2026-08-18)

| PRIM | Severidad | Fase | Estado | Nota |
|---|---|---|---|---|
| PRIM-001 | CRÍTICA | 1 | ✅ Aplicado | `.RequireAuthorization()` en `PiscinaEndpoints.cs:7` y `PiscinaBitacoraEndpoints.cs:7` (build 0 errores) |
| PRIM-002 | ALTA | 2 | ✅ Aplicado | `DeleteAsync` Piscina valida dependientes (`HAS_DEPENDENTS`, 400) |
| PRIM-003 | ALTA | 2 | ✅ Aplicado | `Update`/`Delete` Piscina y `Update` Bitácora devuelven DTO |
| PRIM-004 | ALTA | 2 | ✅ Aplicado | DataAnnotations en `PiscinaAddOrEditDTO` y `PiscinaBitacoraAddOrEditDTO` |
| PRIM-005 | MEDIA | 2 | ✅ Aplicado | `piscina-form.ts` preselecciona `typePiscina` (string→número vía `cb_typePiscina`) |
| PRIM-007 | MEDIA | 2 | ✅ Aplicado | `PiscinaAddOrEditDTO : GuidIdEntityDTO` (sin `Id?` local) |
| PRIM-008 | MEDIA | 2 | ✅ Aplicado | `PiscinaMapper` usa `GetDisplayName()` para `TypePiscina` |
| PRIM-009 | MEDIA | 2 | ✅ Aplicado | `UpdateAsync` Bitácora usa `mapper.Map(DTO, existing)` |
| PRIM-010 | MEDIA | 2 | ✅ Aplicado | `AddAsync` Bitácora valida `PiscinaId` y duplicado (misma fecha+hora) |
| PRIM-006 | MEDIA | 3 | ✅ Aplicado | Mappings de bitácora → `PiscinaBitacora/Mapping/PiscinaBitacoraMapper.cs`; `ChartPiscinaDTO` movido a `LuxuryApp.Shared/DTOs` |
| PRIM-011 | BAJA | 3 | ✅ Aplicado | Rutas kebab corregidas en ambos README |
| PRIM-012 | BAJA | 3 | ✅ Aplicado | Frontend: import duplicado, "?? " debug, `<div>` vacío, sort `filtro`→`Filtro`, fallback "é"→"0", tipado de `dataSignal` con interfaces |

**Verificación:** backend compila (`dotnet build LuxuryApp.Application` → 0 errores). Frontend (PRIM-005) editado; pendiente `ng build`/QA en navegador.

**Fortalezas:** frontend moderno (standalone, signals, `@if`/`@for`, `ApiResponseService`, sin `HttpClient`/`BehaviorSubject`, iconos `material-symbols-light` desde catálogo), minimal APIs, rutas kebab, `ApiResponseDTO`, DTOs 1-archivo-1-DTO, `PiscinaDTO`/`PiscinaBitacoraDTO` heredan `GuidIdEntityDTO`, SELECT de tipo centralizado, enum `TypePiscina` con `[Display]` en español, 0 mojibake.

---

## 🔐 Matriz de Permisos (Roles × Endpoint)

Roles esperados (política `Mantenimiento` en `DependencyInjection.Authorization.cs:87-92`): `SuperUsuario`, `GerenteMantenimiento`, `JefeMantenimiento`, `TecnicoMantenimiento`.

| Endpoint | Método | Acción | Rol esperado | Backend `[Authorize]` | Frontend |
|---|---|---|---|---|---|
| `api/piscina/list/{customerId}` | GET | Listar | Mantenimiento | ❌ **sin `.RequireAuthorization()`** | `piscina-list.ts:90` |
| `api/piscina/{id}` | GET | Ver | Mantenimiento | ❌ | `piscina-form.ts:103` |
| `api/piscina` | POST | Crear | Mantenimiento | ❌ | `piscina-form.ts:117` |
| `api/piscina/{id}` | PUT | Editar | Mantenimiento | ❌ | `piscina-form.ts:123` |
| `api/piscina/{id}` | DELETE | Eliminar | Mantenimiento | ❌ | `piscina-list.ts:108` |
| `api/piscina-bitacora/list/{piscinaId}` | GET | Historial | Mantenimiento | ❌ | `piscina-bitacora-list.ts:81` |
| `api/piscina-bitacora/{id}` | GET | Ver | Mantenimiento | ❌ | `piscina-bitacora-form.ts:114` |
| `api/piscina-bitacora` | POST | Crear | Mantenimiento | ❌ | `piscina-bitacora-form.ts:120` |
| `api/piscina-bitacora/{id}` | PUT | Editar | Mantenimiento | ❌ | `piscina-bitacora-form.ts:120` |
| `api/piscina-bitacora/{id}` | DELETE | Eliminar | Mantenimiento | ❌ | `piscina-bitacora-list.ts:91` |

**Estado:** ❌ Ningún endpoint declara autorización, a diferencia de **todos** los módulos hermanos de `MantenimientoLuxuryApp` (`ToolLoan` `ControlPrestamoHerramientasEndPoints.cs:8`, `SmokeDetectorLog`, `HydrantInventory`, `FireInspectionPeriods`, `EquipmentInspections`, `Medidores`) y del template `_template-endpoints.cs:26`, que sí llaman `.RequireAuthorization()`. No se encontró política global `FallbackPolicy`/`DefaultPolicy` en `LuxuryApp.Api`. → **Acceso anónimo potencial a todo el CRUD** (ver PRIM-001).

---

## 📋 Reglas de Negocio (4 niveles)

| ID | Descripción | Nivel | Ubicación Backend | Frontend | Estado |
|---|---|---|---|---|---|
| RN-PIS-001 | Una Piscina pertenece a un único `CustomerId` (condominio). | 1-Invariante | `Piscina.cs:12` | `piscina-form.ts:88` | ✓ |
| RN-PIS-002 | Volumen de agua ≥ 0 (físicamente imposible negativo). | 1-Invariante | `Piscina.cs:51` (sin rango) | `volumen` min(0) `piscina-form.ts:77` | ❌ Backend no valida |
| RN-PIS-003 | PiscinaBitacora es historial 1─* de una Piscina (`PiscinaId`). | 2-Flujo | `PiscinaBitacora.cs:13,18` | `piscina-bitacora-list.ts:76` | ✓ |
| RN-PIS-004 | Endpoints solo para roles de Mantenimiento. | 3-Seguridad | — (ausente) | — | ❌ No implementado |
| RN-PIS-005 | El `ApplicationUserId` registra quién crea/actualiza (auditoría). | 3-Seguridad | `PiscinaAppService.AddAsync` no setea `ApplicationUserId` (`Services/PiscinaAppService.cs:36`); `UpdateAsync` sí (cs:69) | `piscina-form.ts:85` | ⚠️ Parcial (alta no captura) |
| RN-PIS-006 | `Name`/`Ubication` requeridos y ≤100. | 4-Validación | Entidad `[MaxLength(100)]` (`Piscina.cs:34,43`); DTO `PiscinaAddOrEditDTO` sin `[Required]`/`[MaxLength]` | `maxLength(50)` `piscina-form.ts:68,72` | ❌ DTO entrada sin validación |
| RN-PIS-007 | Cl/Ph/Temperatura son mediciones numéricas con rango químico razonable. | 4-Validación | `PiscinaBitacoraAddOrEditDTO` `double` sin `[Range]` | `required` sin rango `piscina-bitacora-form.ts:83-85` | ❌ Backend no valida |
| RN-PIS-008 | No eliminar una Piscina con bitácora asociada (integridad). | 2-Flujo | `DeleteAsync` sin chequeo (`Services/PiscinaAppService.cs:76`); FK `Restrict` (`ApplicationDbContextModelSnapshot.cs:19434`) | `onDelete` `piscina-list.ts:108` | ⚠️ Previene borrado pero con 500 no controlado |
| RN-PIS-009 | `TypePiscina` debe ser valor de catálogo (`Techada`/`Exterior`). | 1-Invariante | Enum `TypePiscina.cs:6` con `[Display]` | select `piscina-form.ts:154` | ✓ |

---

## 🏗️ Entidades y Relaciones

| Entidad | Responsabilidad | Campos clave | Relaciones | Soft Delete |
|---|---|---|---|---|
| `Piscina` (`Piscina.cs`) | Alberca del condominio | `CustomerId`, `Name`, `Ubication`, `Volumen`, `PathImage`, `TypePiscina`, `ApplicationUserId` | 1─* `PiscinaBitacora` (FK `Restrict`) | ❌ Hard delete |
| `PiscinaBitacora` (`PiscinaBitacora.cs`) | Registro diario de calidad de agua | `PiscinaId`, `Date`, `Hour`, `Cl`, `Ph`, `Alkalinidad?`, `Dureza?`, `Temperatura`, `AplicationCl/PhMas/PhMenos`, `Cepillado`, `Aspirado`, `Cenefas`, `ApplicationUserId` | N:1 `Piscina`, N:1 `ApplicationUser` (FK `Restrict`) | ❌ Hard delete |

**Nota integridad:** ambas entidades usan `GuidIdEntity` (hard delete, sin `ArchivedDate`). El borrado de `Piscina` está protegido por `Restrict` (no cascada), por lo que **no hay pérdida de bitácora**, pero el `DeleteAsync` no lo anticipa y lanza `DbUpdateException` no capturada (ver PRIM-002).

---

## 📦 DTOs vs Interfaces (Front/Back)

| DTO Backend | Tipo | Frontend interface | ¿Coincide? |
|---|---|---|---|
| `PiscinaDTO` (`PiscinaDTO.cs`) | `GuidIdEntityDTO`+`Name,Ubication,Volumen,PathImage(string),TypePiscina(string)` | `any` (`piscina-list.ts:72`, `piscina-form.ts:61`) | ⚠️ Sin tipar en front; `TypePiscina` va como `string` (backend) vs `number` (form select) |
| `PiscinaAddOrEditDTO` | `Id?,CustomerId,Name,Ubication,Volumen(double),PathImage(IFormFile),TypePiscina(enum),ApplicationUserId` | `FormGroup<IPiscinaForm>` (`piscina-form.ts:27`) | ⚠️ `Id` del DTO no hereda `GuidIdEntityDTO` (PRIM-007) |
| `PiscinaBitacoraDTO` | hereda `GuidIdEntityDTO`; incluye `DateString`, `Filtro` computados | `any` | ⚠️ Sin tipar |
| `PiscinaBitacoraAddOrEditDTO` | `PiscinaId,Date,Hour,Cl,Ph,Alkalinidad?,Dureza?,Temperatura,AplicationCl/PhMas/PhMenos,bools,CpplicationUserId` | `FormGroup<IPiscinaBitacoraForm>` (`piscina-bitacora-form.ts:28`) | ✓ forma; `alkalinidad/dureza` `double?` en DTO vs `double` en response DTO |
| `ChartPiscinaDTO` | `NamePiscina`, `List<ChartLinePrimeDTO>` | no usado en este módulo | ⚠️ Consumido por `MaintenanceReport` (cross-módulo) — ver PRIM-006 |

---

## ✅ Validaciones Front vs Back

| Campo | Frontend | Backend | ¿Coinciden? |
|---|---|---|---|
| `name` | `required`, `maxLength(50)` | DTO entrada: **sin validación**; entidad `[MaxLength(100)]` | ❌ Inconsistente (FE 50 / BE 100 / BE-DTO ninguna) |
| `ubication` | `required`, `maxLength(50)` | DTO entrada: sin validación; entidad `[MaxLength(100)]` | ❌ Inconsistente |
| `volumen` | `required`, `min(0)`, `max(1000000)` | `double` sin rango | ❌ Backend no valida rango |
| `typePiscina` | `required` (numérico) | enum (type-safe) | ⚠️ Round-trip número↔string rompe preselección en edición (PRIM-005) |
| `cl/ph/temperatura` | `required` | `double` sin rango | ❌ Backend acepta negativos/absurdos |
| `alkalinidad/dureza` | nulos permitidos | `double?` entrada / `double` respuesta | ⚠️ Nullable mismatch |
| `pathImage` | opcional (solo `File`) | `IFormFile` sin validación tipo/tamaño | ❌ Backend no valida MIME/tamaño |

---

## 🔄 Diagrama de Flujo (Crear Piscina)

```
Usuario → piscina-list (GET /api/piscina/list/{customerId})        [SIN Authorize]
        → piscina-form (dialog) → valida front (required, max50, 0..1e6)
        → POST /api/piscina (multipart)  [SIN Authorize]
            ├─ Backend: mapper PiscinaAddOrEditDTO→Piscina
            ├─ Guarda imagen (imgService.Save 600x600)
            ├─ NO setea ApplicationUserId en Alta (RN-PIS-005 ⚠️)
            ├─ NO valida Name/Ubication/Volumen (RN-PIS-006/002 ❌)
            └─ Retorna ApiResponseDTO<PiscinaDTO>  ✓
        → Front cierra dialog, refresca lista
```

## 🔄 Diagrama de Flujo (Eliminar Piscina)

```
Usuario → piscina-list.onDelete → DELETE /api/piscina/{id}   [SIN Authorize]
        → PiscinaAppService.DeleteAsync (cs:76)
            ├─ Busca Piscina
            ├─ Borra imagen
            ├─ dbContext.Piscina.Remove(model)
            └─ SaveChangesAsync
                  ├─ Si TIENE PiscinaBitacora → FK Restrict → DbUpdateException NO capturada → 500
                  └─ Si NO tiene → borra OK (hard delete, sin auditoría de borrado)
```

---

## 🔴 Hallazgos (PRIM-NNN)

### PRIM-001 — CRÍTICA — Endpoints sin autorización
- **Descripción:** Los grupos `PiscinaEndpoints` (`EndPoints/PiscinaEndpoints.cs:7`) y `PiscinaBitacoraEndpoints` (`EndPoints/PiscinaBitacoraEndpoints.cs:7`) no invocan `.RequireAuthorization()`. Todos los módulos hermanos de `MantenimientoLuxuryApp` y el template sí lo hacen. No hay política global de fallback en `LuxuryApp.Api`.
- **Impacto:** Acceso anónimo potencial a todo el CRUD de albercas y bitácoras (lectura, creación, edición y borrado de datos de condominio).
- **Reproducción:** `curl -X GET https://.../api/piscina/list/{guid}` sin token → si no hay política global, devuelve 200 con datos.
- **Ubicación:** `PiscinaEndpoints.cs:7`, `PiscinaBitacoraEndpoints.cs:7`.
- **Solución:** Agregar `.RequireAuthorization()` (idealmente `.RequireAuthorization("Mantenimiento")`) a ambos `MapGroup`. Verificar que el frontend ya envía JWT (`ApiResponseService`).
- **Complejidad:** Pequeña (2–4 SP). **Fase: INMEDIATA.**

### PRIM-002 — ALTA — DELETE Piscina sin validar dependientes → 500 no controlado
- **Descripción:** `PiscinaAppService.DeleteAsync` (`Services/PiscinaAppService.cs:76-90`) no verifica `PiscinaBitacora` asociadas. El FK está `OnDelete(DeleteBehavior.Restrict)` (`ApplicationDbContextModelSnapshot.cs:19434-19438`), por lo que si hay bitácora se lanza `DbUpdateException` no capturada → 500 en lugar de mensaje de negocio claro.
- **Impacto:** El usuario ve un error genérico; la operación falla de forma no amigable. (No hay pérdida de datos gracias a `Restrict`.)
- **Ubicación:** `Services/PiscinaAppService.cs:76`; FK `ApplicationDbContextModelSnapshot.cs:19434`.
- **Solución:** Antes de eliminar, contar bitácoras; si >0 lanzar `BusinessException("No se puede eliminar: tiene registros de bitácora asociados", ..., 400)`. Considerar soft delete (`ArchivedDate`).
- **Complejidad:** Mediana (6–8 SP). **Fase: CORTO PLAZO.**

### PRIM-003 — ALTA — Tipos de respuesta inconsistentes (entidad cruda vs DTO)
- **Descripción:** En Piscina, `GetById`/`Add` devuelven `ApiResponseDTO<PiscinaDTO>` pero `Update` (`Services/PiscinaAppService.cs:50`) y `Delete` (cs:76) devuelven `ApiResponseDTO<Piscina>` (entidad). En Bitácora, `GetById/GetAll/Add` devuelven `ApiResponseDTO<PiscinaBitacoraDTO>` pero `Update` (`Services/PiscinaBitacoraAppService.cs:63`) devuelve `ApiResponseDTO<PiscinaBitacora>` y `Delete` (cs:91) `ApiResponseDTO<bool>`.
- **Impacto:** Contrato inestable (shapes distintos para la misma entidad) y exposición de columnas crudas de la entidad.
- **Solución:** Homogeneizar a DTO en `Update`/`Delete` (`ApiResponseDTO<PiscinaDTO>` / `ApiResponseDTO<PiscinaBitacoraDTO>`).
- **Complejidad:** Mediana (6–8 SP). **Fase: CORTO PLAZO.**

### PRIM-004 — ALTA — DTOs de entrada sin validación en backend
- **Descripción:** `PiscinaAddOrEditDTO` (`DTOs/PiscinaAddOrEditDTO.cs`) no tiene `[Required]` en `Name`/`Ubication`, ni `[MaxLength]`, ni rango en `Volumen`; `PathImage` (`IFormFile`) sin validación de tipo/tamaño. `PiscinaBitacoraAddOrEditDTO` (`DTOs/PiscinaBitacoraAddOrEditDTO.cs`) tiene `Cl/Ph/Temperatura` como `double` sin `[Range]` (acepta negativos/absurdos); `Alkalinidad?`/`Dureza?`.
- **Impacto:** El front valida, pero un llamado directo (o devtools) persiste datos inválidos (integridad).
- **Solución:** Agregar DataAnnotations o FluentValidation a los DTOs de entrada y centralizar rangos químicos (Cl 0–10 ppm, pH 0–14, etc.) como RN documentadas.
- **Complejidad:** Mediana (6–8 SP). **Fase: CORTO PLAZO.**

### PRIM-005 — MEDIA — Bug edición: select de tipo no preselecciona (número vs string)
- **Descripción:** El backend devuelve `PiscinaDTO.TypePiscina` como `string` (AutoMapper mapea el enum vía `ToString()`, p.ej. `"Techada"`), pero el formulario `typePiscina` es `number` y el `<select>` usa valores numéricos (`Endpoints.EnumSelectItems.typePiscina`). En edición, `patchValue(result)` (`piscina-form.ts:106`) asigna el string → el select no preselecciona.
- **Ubicación:** `piscina-form.ts:106`, `piscina-list.html:54`, `Mapping/PiscinaMapper.cs:10`.
- **Solución:** Devolver el valor entero del enum en el DTO (o mapear string→número en front). Unificar criterio de serialización del enum.
- **Complejidad:** Pequeña (2–4 SP). **Fase: CORTO PLAZO.**

### PRIM-006 — MEDIA — Acoplamiento cross-módulo en Mapping y DTO de chart
- **Descripción:** `PiscinaMapper.cs:15-16` mapea `PiscinaBitacora`/`PiscinaBitacoraAddOrEditDTO`, pero el módulo **PiscinaBitacora no tiene carpeta `Mapping`** (sus perfiles viven en el módulo Piscina). Además `ChartPiscinaDTO` (`PiscinaBitacora/DTOs/ChartPiscinaDTO.cs`) es producido por `MaintenanceReport` (`ContabilidadLuxuryApp/MaintenanceReport/Services/MaintenanceReportAppService.cs:434`), un DTO compartido mal ubicado.
- **Impacto:** Mantenimiento de bitácora depende de un perfil de AutoMapper ajeno; el DTO de chart cruza dominios.
- **Solución:** Mover los mappings de bitácora a un `Mapping/` propio de `PiscinaBitacora`; ubicar `ChartPiscinaDTO` en `Shared` o en el módulo consumidor.
- **Complejidad:** Mediana (6–8 SP). **Fase: MEDIO PLAZO.**

### PRIM-007 — MEDIA — `PiscinaAddOrEditDTO` declara `Id` sin heredar `GuidIdEntityDTO`
- **Descripción:** `PiscinaAddOrEditDTO.cs:12` declara `public Guid? Id` pero no hereda `GuidIdEntityDTO`, violando CONVENTIONS §6.1 ("todo DTO local que declare `Id` debe heredar de `GuidIdEntityDTO`"). `PiscinaBitacoraAddOrEditDTO` no declara `Id` (usa `PiscinaId`), por lo que no aplica.
- **Ubicación:** `DTOs/PiscinaAddOrEditDTO.cs:7-12`.
- **Solución:** Heredar `GuidIdEntityDTO` o renombrar el campo para no colisionar con la regla.
- **Complejidad:** Pequeña (2–4 SP). **Fase: CORTO PLAZO.**

### PRIM-008 — MEDIA — DisplayName de enum no usado en backend ni en UI
- **Descripción:** El backend mapea `TypePiscina` enum→`string` con `ToString()` (AutoMapper `PiscinaMapper.cs:10`), no con `GetDisplayName()`. El front muestra `{{ item.typePiscina }}` crudo (`piscina-list.html:54`) y tiene el pipe `ETypePiscina` comentado. Aunque hoy coincide (miembros en español), viola el mecanismo de DisplayName en español (CONVENTIONS §6.1) y es frágil si cambia el nombre del miembro.
- **Solución:** Usar `GetDisplayName()` al proyectar el DTO y/o el pipe en UI.
- **Complejidad:** Pequeña (2–4 SP). **Fase: CORTO PLAZO.**

### PRIM-009 — MEDIA — Patrón `Update` incorrecto en Bitácora
- **Descripción:** `PiscinaBitacoraAppService.UpdateAsync` (`Services/PiscinaBitacoraAppService.cs:63-87`) crea una entidad nueva desde el DTO, carga `existing` `AsNoTracking` que **no usa**, y hace `Update(model)`. Patrón inconsistente vs `Piscina` (que usa `mapper.Map(DTO, model)`) y desperdicia una query.
- **Solución:** Usar `model = mapper.Map(DTO, existing)` y `Update(model)`, o cargar tracked y mapear.
- **Complejidad:** Pequeña (2–4 SP). **Fase: CORTO PLAZO.**

### PRIM-010 — MEDIA — Add Bitácora no valida `PiscinaId` ni duplicados
- **Descripción:** `PiscinaBitacoraAppService.AddAsync` (`Services/PiscinaBitacoraAppService.cs:47`) no valida que `PiscinaId` exista (FK `Restrict` lanzaría 500 si no) ni duplicados (misma piscina + `Date` + `Hour`).
- **Solución:** Validar existencia de la piscina y unicidad de (PiscinaId, Date, Hour) con `BusinessException` clara.
- **Complejidad:** Pequeña (2–4 SP). **Fase: CORTO PLAZO.**

### PRIM-011 — BAJA — README desactualizado (rutas en PascalCase)
- **Descripción:** `Piscina/README.md:13-17` y `PiscinaBitacora/README.md:13-17` documentan `api/Piscina/{id}` y `api/PiscinaBitacora/{id}` (PascalCase), pero los endpoints reales son `api/piscina/{id}` y `api/piscina-bitacora/{id}`.
- **Solución:** Corregir rutas en ambos README.
- **Complejidad:** Pequeña. **Fase: MEDIO PLAZO.**

### PRIM-012 — BAJA — Calidad frontend (menores)
- Duplicado import `PrimeNgCustomCaption` (`piscina-list.ts:60-61`).
- Texto debug `"?? "` en mobile (`piscina-list.html:101`); `<div class="hidden md:block"></div>` vacío (`piscina-bitacora-list.html:2`).
- Tipado débil: todos los `signal`/resultados son `any` (sin interfaces de contrato).
- `piscina-bitacora-list.html:23` `pSortableColumn="filtro"` pero muestra `item.dateString` (propiedad `Filtro`/`dateString` con mayúscula) → orden por fecha no funciona.
- Fallback `"é"` en `{{ item.cl || "é" }}` (`piscina-bitacora-list.html:123,126,129,133,136`).
- **Solución:** Limpiar, tipar contratos, corregir campo de orden.
- **Complejidad:** Pequeña. **Fase: MEDIO PLAZO.**

---

## ✅ Cumplimiento CONVENTIONS.md

### Backend
| Regla | Estado | Hallazgos |
|---|---|---|
| Minimal APIs (sin `ApiController`) | ✓ | `IEndPointsModule` + `MapGroup` |
| Endpoint naming kebab/minúsculas | ✓ | `api/piscina`, `api/piscina-bitacora` |
| DTOs 1-archivo-1-DTO | ✓ | |
| DTOs con `Id` heredan `GuidIdEntityDTO` | ⚠️ | `PiscinaAddOrEditDTO` no (PRIM-007) |
| `ApiResponseDTO` en respuestas | ⚠️ | `Update`/`Delete` devuelven entidad cruda (PRIM-003) |
| **Autorización en endpoints** | ❌ | PRIM-001 (CRÍTICA) |
| Validación de DTOs de entrada | ❌ | PRIM-004 |
| DisplayName en español (mecanismo) | ⚠️ | `ToString()` no `GetDisplayName()` (PRIM-008) |
| SELECTs centralizados | ✓ | `Endpoints.EnumSelectItems.typePiscina` |
| Enum con `[Display]` | ✓ | `TypePiscina.cs` |
| Soft delete | ❌ | Hard delete en ambas entidades |

**Cumplimiento Backend:** ~70%

### Frontend
| Regla | Estado | Hallazgos |
|---|---|---|
| Standalone components | ✓ | |
| Signals (sin `BehaviorSubject`) | ✓ | |
| `@if`/`@for` (sin `*ngIf`/`*ngFor`) | ✓ | p-table templates (excepción permitida) |
| `ApiResponseService` (sin `HttpClient`) | ✓ | |
| Iconos `material-symbols-light` desde catálogo | ✓ | |
| Mojibake = 0 | ✓ | gate OK |
| Tipado de contrato (interfaces = DTOs) | ❌ | todo `any` |
| Validaciones coinciden con back | ⚠️ | PRIM-004/005 (inconsistentes) |
| Design tokens (sin hex hardcode) | ✓ | usa utilidades (`text-primary`, `bg-primary-50`); sin `.scss` propios |

**Cumplimiento Frontend:** ~82%

---

## 🎯 Plan de Acción

### Fase 1 — INMEDIATA (1–2 sem)
- [PRIM-001] Agregar `.RequireAuthorization("Mantenimiento")` a `PiscinaEndpoints.cs:7` y `PiscinaBitacoraEndpoints.cs:7`. — 2–4 SP

### Fase 2 — CORTO PLAZO (3–6 sem)
- [PRIM-002] Guardar borrado de Piscina contra dependientes + mensaje claro / soft delete. — 6–8 SP
- [PRIM-003] Homogeneizar respuestas a DTO (`Update`/`Delete`). — 6–8 SP
- [PRIM-004] Validación de DTOs de entrada (rangos/maxlength/requeridos). — 6–8 SP
- [PRIM-005] Unificar serialización de `TypePiscina` (entero vs string). — 2–4 SP
- [PRIM-007] `PiscinaAddOrEditDTO` hereda `GuidIdEntityDTO`. — 2–4 SP
- [PRIM-008] Usar `GetDisplayName()` / pipe en UI. — 2–4 SP
- [PRIM-009] Corregir patrón `Update` de Bitácora. — 2–4 SP
- [PRIM-010] Validar `PiscinaId` y duplicados en Add Bitácora. — 2–4 SP

### Fase 3 — MEDIO PLAZO (2+ meses)
- [PRIM-006] Reubicar mappings de bitácora y `ChartPiscinaDTO`. — 6–8 SP
- [PRIM-011] Corregir README (rutas). — 1–2 SP
- [PRIM-012] Limpieza y tipado de contrato en frontend. — 4–6 SP

**Total esfuerzo estimado:** ~58–72 SP.

---

## 📈 Métricas

| Métrica | Valor | Target | Estado |
|---|---|---|---|
| Mojibake | 0 | 0 | 🟢 |
| Cumplimiento CONVENTIONS | ~74% | 95% | 🔴 |
| Hallazgos CRÍTICOS | 1 | 0 | 🔴 |
| Deuda técnica (SP) | ~58–72 | <30 | 🔴 |

---

## 🔗 Referencias
- CONVENTIONS.md §4.4 (Auditoría), §6.1 (DTOs, DisplayName, Mojibake, Tokens)
- `docs-conventions/audit/AUDIT_PROMPT_COMPREHENSIVE.md`
- `docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md`
- FK: `api/LuxuryApp.Infrastructure.Data/Data/Migrations/ApplicationDbContextModelSnapshot.cs:19434`
- Política Mantenimiento: `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Authorization.cs:87`
