# PLAN DE EJECUCIÓN: Reestructurar SolicitudesCompra por Sub-Concepto

**Estado:** APPROVED → listo para EXECUTING

## Metadata Crítica

```
Creado por:        Claude Code
Ejecutará:         Agente externo (el usuario copia este documento completo)
Auditor:           Claude Code (al terminar, sobre el diff real)
Aprobó:            geshyrihu (usuario) — 2026-09-07
Fecha creación:    2026-09-07
Módulo destino:    api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/
                   appsweb/angular/src/app/apps/compras.luxuryapp/solicitud-compra/
Documentos previos: docs/plans/20260907-mapa-solicitudescompra-reestructura.md (mapa visual)
                    docs/plans/analisis-reestructura-solicitudescompra.md (análisis de un segundo agente,
                      parcialmente incorporado — ver sección "Decisiones de naming" abajo)
                    docs/reporte_maestro/modulos/20260907-plan-ejecutado-solicitudes-compra.md (Parte 1 ya ejecutada)
Repos:             api/ y appsweb/angular/ son repos git independientes y limpios antes de empezar
```

**IMPORTANTE — reglas para el agente ejecutor:**
- Cada paso tiene un **Criterio de Validación** explícito. Si falla → detente y reporta, no improvises.
- **Cero cambio de comportamiento HTTP.** Ninguna URL/ruta cambia en este plan, aunque el texto de
  algunas rutas mencione "cuadro-comparativo" para lógica que ahora vive en `Presupuesto/` o `Evidencia/`
  (es nomenclatura legacy ya existente, NO la corrijas, NO la renombres).
- **No toques `OrdenCompra`, `product/`, ni el fork `provider/` vs `providers/provider/`** — son partes
  futuras, fuera de alcance.
- **No repares los hallazgos de calidad de la auditoría original** (DTOs compartiendo archivo,
  `ComiteEventoDTO` sin `GuidIdEntityDTO`, entidades como contrato público, README legacy, tests
  faltantes). Esos ya están trackeados en `docs/reporte_maestro/modulos/20260730-auditoria-solicitud-compra.md`
  y se atacan DESPUÉS, en la ubicación ya correcta. Mezclarlos aquí aumenta el riesgo de esta tarea.
- **No modifiques `CONVENTIONS.md` ni `CONVENTIONSFOLDER.MD`** en este plan — la excepción de 5 niveles
  de namespace queda como deuda documental pendiente, decisión ya tomada con el usuario.
- Usa `git mv` para preservar historial, nunca borrar+crear.
- Termina cada Fase con el build de verificación indicado antes de pasar a la siguiente.

---

## Decisiones de naming (ya resueltas, no las reabras)

Un segundo análisis sugirió pluralizar `Comparativo/Evidencia/Presupuesto/Detalle` citando
CONVENTIONSFOLDER.MD §2.2. Se rechazó esa sugerencia: la regla existe **"para prevenir colisiones de
namespace vs clase"** (cita textual) y ninguna de esas 4 carpetas tiene una clase con ese nombre exacto —
cero riesgo de colisión. Además el repo ya usa **singular** para este tipo de carpeta-proceso:
`ContabilidadLuxuryApp.Presupuesto.*` (`GlobalUsings.cs:177-179`) y
`SupplierLuxuryApp.Purchases.PurchaseOrderDetail.*` (`GlobalUsings.cs:562`). Se mantiene singular para
ser consistentes con el repo real. `Cotizaciones/` sí queda en plural porque mapea 1:1 a una entidad
contable (`CotizacionProveedor`), igual que `Employees/`, `Candidates/`, `Banks/`.

---

## Árbol destino completo — Backend

```
api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/
├── Entities/            SolicitudCompra.cs                                    (sin cambio)
├── DTOs/                SolicitudCompraDTO.cs, SolicitudCompraAddOrEditDTO.cs,
│                        SolicitudCompraIndividualDTO.cs, SolicitudesCompraIndexDTO.cs,
│                        SolicitudCompraPresentationOrderDTO.cs, SolicitudCompraPresentationSelectionDTO.cs,
│                        ComiteEventoDTO.cs
│                        ⚠️ PurchaseRequestAddOrEditDTO.cs — ver Paso 0.2
├── Interfaces/          ISolicitudCompraAppService.cs           (recortada a 13 métodos, ver Paso 1.2)
├── Services/            SolicitudCompraAppService.cs            (recortado)
├── Mapping/             SolicitudCompraMapper.cs                (recortado, ver Paso 1.5)
├── EndPoints/           SolicitudCompraEndPoints.cs             (recortado)
├── Docs/                README-solicitud-compra.md              (sin cambio de contenido en este plan)
│
├── Cotizaciones/                                    ← RENOMBRADA de CotizacionesProveedor/ (Paso 2)
│   ├── DTOs/            CotizacionProveedorDTO.cs, CotizacionProveedorAddOrEditDTO.cs,
│   │                    CotizacionProveedorListDTO.cs
│   ├── Interfaces/       ICotizacionProveedorAppService.cs      (recortada a 8 métodos, sin rename de clase)
│   ├── Services/         CotizacionProveedorAppService.cs       (recortado)
│   └── EndPoints/        CotizacionProveedorEndPoints.cs        (recortado)
│   Entities/CotizacionProveedor.cs YA está en el ../Entities/ del padre desde la Parte 1 (no se mueve otra vez)
│
├── Comparativo/                                     ← NUEVA, sin Entity propia (es vista/orquestación)
│   ├── DTOs/            SolicitudCompraCuadroComparativoDTO.cs, SolicitudCompraCuadroComparativoUpdateDTO.cs,
│   │                    ComparativeChartAnalysisInputDTO.cs, GetPosicionCotizacionDTO.cs,
│   │                    SCDTO.cs, SCDetalleDTO.cs
│   ├── Interfaces/       IComparativoAppService.cs              (NUEVA — 6 métodos, ver Paso 3.1)
│   ├── Services/         ComparativoAppService.cs               (NUEVO)
│   └── EndPoints/        ComparativoEndPoints.cs                (NUEVO)
│
├── Evidencia/                                       ← NUEVA, TRANSVERSAL (Solicitud + Cotización)
│   ├── Entities/         SolicitudCompraEvidence.cs, CotizacionProveedorEvidence.cs
│   ├── DTOs/             SolicitudCompraEvidenceDTO.cs, SolicitudCompraEvidenceCreateDTO.cs,
│   │                    CotizacionProveedorEvidenceDTO.cs, CotizacionProveedorEvidenceCreateDTO.cs
│   ├── Interfaces/       IEvidenciaAppService.cs                (NUEVA — 4 métodos, ver Paso 4.1)
│   ├── Services/         EvidenciaAppService.cs                 (NUEVO)
│   └── EndPoints/        EvidenciaEndPoints.cs                  (NUEVO)
│
├── Presupuesto/                                     ← NUEVA
│   ├── Entities/         SolicitudCompraBudget.cs
│   ├── DTOs/             SolicitudCompraBudgetDTO.cs, SolicitudCompraBudgetCreateDTO.cs
│   ├── Interfaces/       IPresupuestoAppService.cs              (NUEVA — 3 métodos, ver Paso 5.1)
│   ├── Services/         PresupuestoAppService.cs               (NUEVO)
│   └── EndPoints/        PresupuestoEndPoints.cs                (NUEVO)
│
└── Detalle/                                         ← YA EXISTE (parcial), se completa
    ├── Entities/         SolicitudCompraDetalle.cs (mover desde ../Entities/), CotizacionDetalle.cs (ídem)
    ├── DTOs/             SolicitudCompraDetalleDTO.cs, SolicitudCompraDetalleAddOrEditDTO.cs,
    │                    SolicitudCompraDetalleAddProductDTO.cs, SolicitudCompraDetalleEditPriceDTO.cs,
    │                    SolicitudCompraDetalleEditProductDTO.cs, SolicitudCompraDetalleIndividualDTO.cs,
    │                    SolicitudCompraDetalleProductListAddDTO.cs, SearchProductToAddDTO.cs,
    │                    CotizacionDetalleDTO.cs
    ├── Interfaces/       ISolicitudCompraDetalleAppService.cs   (ya existe, sin cambio de métodos)
    ├── Services/         SolicitudCompraDetalleAppService.cs    (ya existe, sin cambio de métodos)
    └── EndPoints/        SolicitudCompraDetalleEndPoints.cs     (mover desde ../EndPoints/, sin cambio)
```

**Nota sobre `Entities/` en `Detalle/`:** hoy `SolicitudCompraDetalle.cs` y `CotizacionDetalle.cs` viven
en `SolicitudesCompra/Entities/` (raíz). Este plan los mueve dentro de `Detalle/Entities/` porque son
transversales a ese sub-concepto. `SolicitudCompra.cs` y `CotizacionProveedor.cs` se quedan en
`SolicitudesCompra/Entities/` (raíz) — son las entidades "cabecera" de cada agregado, no pertenecen a
ningún sub-concepto específico. `SolicitudCompraEvidence.cs`/`CotizacionProveedorEvidence.cs` se mueven a
`Evidencia/Entities/`. `SolicitudCompraBudget.cs` se mueve a `Presupuesto/Entities/`.

---

## FASE 0: Verificaciones previas (30 min)

### Paso 0.1: Confirmar repos limpios
```bash
cd api && git status --short   # debe estar vacío o solo con cambios que ya conoces
cd ../appsweb/angular && git status --short
```
**Criterio:** ambos limpios (o el usuario ya revisó lo pendiente). Si hay cambios sin commitear que no
reconoces, DETENTE y reporta.

### Paso 0.2: Verificar si `PurchaseRequestAddOrEditDTO` es código muerto
```bash
grep -rn "PurchaseRequestAddOrEditDTO" api/LuxuryApp.Application api/LuxuryApp.Api api/LuxuryApp.Tests
```
**Criterio:** si el ÚNICO resultado es la propia declaración del archivo (`public record
PurchaseRequestAddOrEditDTO`), es código muerto. **No lo borres** — solo repórtalo al final en el resumen
de ejecución para que el usuario decida. Muévelo igual a `SolicitudesCompra/DTOs/` (raíz) junto con los
demás DTOs core, sin tocar su contenido.

### Paso 0.3: Leer las firmas completas de los 3 servicios a dividir
```bash
cat api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/Interfaces/ISolicitudCompraAppService.cs
cat api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/CotizacionesProveedor/Interfaces/ICotizacionProveedorAppService.cs
cat api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/Services/SolicitudCompraAppService.cs
cat api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/CotizacionesProveedor/Services/CotizacionProveedorAppService.cs
cat api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/EndPoints/SolicitudCompraEndPoints.cs
cat api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/CotizacionesProveedor/EndPoints/CotizacionProveedorEndPoints.cs
```
**Criterio:** confirma que los métodos que aparecen coinciden con las tablas de las Fases 1-5 de este
documento. Si encuentras un método que este plan NO menciona, DETENTE y reporta — no lo asignes por tu
cuenta a ninguna carpeta.

---

## FASE 1: Recortar el núcleo `SolicitudesCompra/` (raíz)

### Paso 1.1: Mover Entities transversales fuera de la raíz
```bash
cd api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra
mkdir -p Detalle/Entities Evidencia/Entities Presupuesto/Entities
git mv Entities/SolicitudCompraDetalle.cs Detalle/Entities/
git mv Entities/CotizacionDetalle.cs Detalle/Entities/
git mv Entities/SolicitudCompraEvidence.cs Evidencia/Entities/
git mv Entities/CotizacionProveedorEvidence.cs Evidencia/Entities/
git mv Entities/SolicitudCompraBudget.cs Presupuesto/Entities/
```
**Criterio:** `Entities/` raíz solo contiene `SolicitudCompra.cs` y `CotizacionProveedor.cs`.

### Paso 1.2: Recortar `ISolicitudCompraAppService.cs`
Deja SOLO estas 13 firmas (bórralas del archivo, las moverás en Fases 3-5):
```
GetSolicitudCompraIndexDTO, GetIdSolicitudCompraAsync, GetSolicitudCompraIndividual,
AddAsync, UpdateAsync, DeleteSolicitudComplete, UploadRequestPdfAsync,
GetSelectedForPresentationAsync, UpdatePresentationSelectionAsync, UpdatePresentationOrderAsync,
UploadSupportPdfAsync, DeleteSupportPdfAsync, GetComiteEventsAsync
```
Quita del archivo (van a `Comparativo`, `Evidencia`, `Presupuesto`):
```
GetSCDTO, GetSolicitudCompraCuadroComparativoDTOAsync, UpdateCuadroComparativoAsync,
AnalyzeComparativeChartAsync, DeleteProvider,
AddEvidenceAsync, DeleteEvidenceAsync,
GetAvailableBudgetsAsync, AddBudgetAsync, DeleteBudgetAsync
```
**Criterio:** la interfaz recortada compila sola en tu cabeza (no verifiques build todavía, faltan piezas).

### Paso 1.3: Recortar `SolicitudCompraAppService.cs`
Quita las implementaciones de los 10 métodos listados arriba (los que salen de la interfaz). No borres
métodos privados/helpers compartidos todavía — anota cuáles usa cada método que se va, los llevarás con él
si son exclusivos, o los dejas si los siguen usando los 13 que se quedan.

**Criterio:** el servicio recortado solo implementa los 13 métodos core. Los helpers privados usados
EXCLUSIVAMENTE por los métodos que se fueron viajan con ellos a su nuevo Service; los usados por ambos
lados se duplican solo si son triviales (<10 líneas) o si no, repórtalo para decidir si van a
`SolicitudesCompra/Helpers/` (nivel 2, compartido).

### Paso 1.4: Recortar `SolicitudCompraEndPoints.cs`
Quita los `group.MapXxx(...)` de estas rutas (van a `Comparativo`/`Evidencia`/`Presupuesto`):
```
GET  cuadro-comparativo/{id:guid}
PUT  cuadro-comparativo/{id:guid}
POST cuadro-comparativo/{id:guid}/evidences
DELETE cuadro-comparativo/evidences/{evidenceId:guid}
GET  cuadro-comparativo/{id:guid}/budgets
POST cuadro-comparativo/{id:guid}/budgets
DELETE cuadro-comparativo/budgets/{budgetId:guid}
DELETE delete-provider/{solicitudCompraId:guid}/{cotizacionProveedorId:guid}
POST analyze-comparative-chart/{id:guid}
```
Deja el resto (list, get-id-solicitud-compra, get-solicitud-compra-individual, `{id:guid}` GET/PUT/POST/DELETE,
presentation/*, `{id:guid}/support-file`, comite-events/*).

⚠️ **No cambies ningún string de ruta.** Aunque "cuadro-comparativo/{id}/evidences" contenga lógica que
ahora vive en `EvidenciaEndPoints.cs`, la URL se queda exactamente igual — cada `IEndPointsModule` puede
mapear su propio subconjunto de rutas bajo el mismo grupo base sin problema.

**Criterio:** cada `group.MapXxx` que quitaste de aquí aparece en la Fase correspondiente abajo — ninguno
se pierde, ninguno se duplica.

### Paso 1.5: Revisar y recortar `SolicitudCompraMapper.cs`
Lee el archivo completo. Por cada `CreateMap<X, Y>()`:
- Si `X`/`Y` es `SolicitudCompra`, `SolicitudCompraDTO`, `SCDTO`, `SolicitudesCompraIndexDTO`,
  `SolicitudCompraIndividualDTO`, `ComiteEventoDTO`, `SolicitudCompraAddOrEditDTO`,
  `SolicitudCompraPresentationOrderDTO`/`SelectionDTO` → se queda aquí.
- Si es `CotizacionProveedor`/`CotizacionProveedorDTO`/etc → mover a `Cotizaciones/Mapping/` (crear si no existe).
- Si es `SolicitudCompraCuadroComparativoDTO`/`SCDetalleDTO`/`GetPosicionCotizacionDTO` → mover a `Comparativo/Mapping/`.
- Si es `SolicitudCompraEvidence*`/`CotizacionProveedorEvidence*` → mover a `Evidencia/Mapping/`.
- Si es `SolicitudCompraBudget*` → mover a `Presupuesto/Mapping/`.
- Si es `SolicitudCompraDetalle*`/`CotizacionDetalle*` → mover a `Detalle/Mapping/` (crear).

Cada `Profile` nuevo se auto-descubre solo (AutoMapper escanea el ensamblado), no requiere registro manual.

**Criterio:** ningún `CreateMap` se pierde ni se duplica; cada uno vive en el `Mapping/` de la carpeta
dueña del DTO/Entity que mapea.

---

## FASE 2: Renombrar `CotizacionesProveedor/` → `Cotizaciones/`

### Paso 2.1: Verificar referencias cruzadas antes de renombrar
```bash
grep -rln "ComprasLuxuryApp.SolicitudesCompra.CotizacionesProveedor" api/
```
**Criterio:** todos los resultados están DENTRO de `SolicitudesCompra/CotizacionesProveedor/` o en los 3
`GlobalUsings.cs`. Si aparece en cualquier otro módulo, DETENTE y reporta antes de renombrar.

### Paso 2.2: Renombrar
```bash
cd api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra
git mv CotizacionesProveedor Cotizaciones
find Cotizaciones -name "*.cs" -exec sed -i \
  's/SolicitudesCompra\.CotizacionesProveedor/SolicitudesCompra.Cotizaciones/g' {} +
```
No renombres las CLASES (`CotizacionProveedorDTO`, `ICotizacionProveedorAppService`, etc. se quedan igual
— solo cambia el nombre de la carpeta/namespace contenedor, igual patrón que `Employees/` contiene
`class Employee`).

**Criterio:** `grep -rn "namespace" Cotizaciones/**/*.cs` muestra `...SolicitudesCompra.Cotizaciones.*` en
todos, ninguno dice `CotizacionesProveedor`.

### Paso 2.3: Recortar `ICotizacionProveedorAppService.cs` / `CotizacionProveedorAppService.cs` / `CotizacionProveedorEndPoints.cs`
Quita (van a `Comparativo`/`Evidencia`):
```
GetPosicionCotizacion                          → Comparativo
AddEvidenceAsync, DeleteEvidenceAsync          → Evidencia
```
Deja: `ListAsync, GetByIdAsync, AddAsync, UpdateAsync, UpdateProviderAsync, DeleteByIdAsync,
RemoveFileAsync, GetProviders` (8 métodos).

En `CotizacionProveedorEndPoints.cs` quita las rutas:
```
GET posicion-cotizacion/{solicitudCompraId:guid}/{posicion:int}
POST {id:guid}/evidences
DELETE evidences/{evidenceId:guid}
```

---

## FASE 3: Crear `Comparativo/`

### Paso 3.1: Crear `IComparativoAppService.cs` + `ComparativoAppService.cs`
6 métodos, todos extraídos (3 de `SolicitudCompraAppService`, 1 de `CotizacionProveedorAppService`, más
`GetSCDTO` y `DeleteProvider`):

| Método (firma sin cambio) | Viene de |
|---|---|
| `Task<ApiResponseDTO<SolicitudCompraCuadroComparativoDTO>> GetSolicitudCompraCuadroComparativoDTOAsync(Guid id)` | `SolicitudCompraAppService` |
| `Task<ApiResponseDTO<SolicitudCompraEntity>> UpdateCuadroComparativoAsync(Guid id, SolicitudCompraCuadroComparativoUpdateDTO dto)` | `SolicitudCompraAppService` |
| `Task<ApiResponseDTO<string>> AnalyzeComparativeChartAsync(Guid solicitudCompraId)` | `SolicitudCompraAppService` |
| `Task<ApiResponseDTO<bool>> DeleteProvider(Guid solicitudCompraId, Guid cotizacionProveedorId)` | `SolicitudCompraAppService` |
| `ApiResponseDTO<GetPosicionCotizacionDTO> GetPosicionCotizacion(Guid solicitudCompraId, int posicion)` | `CotizacionProveedorAppService` |
| `Task<ApiResponseDTO<SCDTO>> GetSCDTO(Guid id)` | `SolicitudCompraAppService` ⚠️ ver Paso 3.2 |

**Criterio:** las 6 firmas son idénticas a las originales (mismo tipo de retorno, mismos parámetros) —
solo cambia en qué clase/archivo viven.

### Paso 3.2: Verificar consumidor de `GetSCDTO` antes de mover
```bash
grep -rn "getSCDTO\|GetSCDTO\|/api/solicitud-compra/[^/]*id.*guid" appsweb/angular/src/app/apps/compras.luxuryapp/
```
Revisa qué pantalla del frontend llama al endpoint que expone `GetSCDTO` (ruta `GET {id:guid}` — ojo,
esta ruta también podría servir otro propósito, confírmalo leyendo `solicitud-compra.ts`). Si confirmas
que alimenta el flujo de cuadro comparativo, muévelo como está indicado arriba. Si alimenta otra pantalla
no relacionada con Comparativo, DETENTE y reporta — no lo muevas a ciegas.

### Paso 3.3: Crear `ComparativoEndPoints.cs`
Con las 9 rutas listadas en el Paso 1.4 (7 rutas) + Paso 2.3 (1 ruta: `posicion-cotizacion/*`) — nota que
`GetSCDTO` usa la ruta `GET {id:guid}` que YA está en `SolicitudCompraEndPoints` (raíz) sirviendo otro
propósito posiblemente compartido; **si `GetSCDTO` tiene su propia ruta distinta, muévela aquí; si
comparte ruta con otro método que se queda en la raíz, dejar la ruta en la raíz y que el EndPoints raíz
inyecte `IComparativoAppService` además de `ISolicitudCompraAppService` para ese único caso** — repórtalo
en el resumen final de cualquier forma.

**Criterio:** 8 rutas mínimo mapeadas (7 de cuadro-comparativo/analyze/delete-provider + posicion-cotizacion),
mismos strings que tenían antes de moverse.

---

## FASE 4: Crear `Evidencia/`

### Paso 4.1: Crear `IEvidenciaAppService.cs` + `EvidenciaAppService.cs`
4 métodos — **renombrar para evitar colisión de firma** (los 2 `DeleteEvidenceAsync(Guid)` originales son
idénticos en tipo, no pueden coexistir con el mismo nombre en una interfaz):

| Nombre nuevo | Firma | Viene de (nombre original) |
|---|---|---|
| `AddSolicitudEvidenceAsync` | `Task<ApiResponseDTO<SolicitudCompraEvidenceDTO>> AddSolicitudEvidenceAsync(Guid solicitudCompraId, SolicitudCompraEvidenceCreateDTO dto)` | `SolicitudCompraAppService.AddEvidenceAsync` |
| `DeleteSolicitudEvidenceAsync` | `Task<ApiResponseDTO<bool>> DeleteSolicitudEvidenceAsync(Guid evidenceId)` | `SolicitudCompraAppService.DeleteEvidenceAsync` |
| `AddCotizacionEvidenceAsync` | `Task<ApiResponseDTO<CotizacionProveedorEvidenceDTO>> AddCotizacionEvidenceAsync(Guid cotizacionProveedorId, CotizacionProveedorEvidenceCreateDTO dto)` | `CotizacionProveedorAppService.AddEvidenceAsync` |
| `DeleteCotizacionEvidenceAsync` | `Task<ApiResponseDTO<bool>> DeleteCotizacionEvidenceAsync(Guid evidenceId)` | `CotizacionProveedorAppService.DeleteEvidenceAsync` |

Actualiza las 2 llamadas internas que existan a estos métodos (si `SolicitudCompraAppService.DeleteSolicitudComplete`
llama internamente a su propio `DeleteEvidenceAsync`, ahora debe inyectar `IEvidenciaAppService` y llamar
`DeleteSolicitudEvidenceAsync`).

### Paso 4.2: Crear `EvidenciaEndPoints.cs`
4 rutas (2 del Paso 1.4, 2 del Paso 2.3) — mismos strings, apuntando a los 4 métodos renombrados arriba.

**Criterio:** `grep -rn "DeleteEvidenceAsync\b" api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/`
devuelve 0 resultados (todo quedó renombrado); `grep -c "Async(" IEvidenciaAppService.cs` = 4 métodos.

---

## FASE 5: Crear `Presupuesto/`

### Paso 5.1: Crear `IPresupuestoAppService.cs` + `PresupuestoAppService.cs`
3 métodos, firmas sin cambio:
```
Task<ApiResponseDTO<BudgetToPurchaseOrderDTO>> GetAvailableBudgetsAsync(Guid solicitudCompraId)
Task<ApiResponseDTO<SolicitudCompraBudgetDTO>> AddBudgetAsync(Guid solicitudCompraId, SolicitudCompraBudgetCreateDTO dto)
Task<ApiResponseDTO<bool>> DeleteBudgetAsync(Guid budgetId)
```
⚠️ `BudgetToPurchaseOrderDTO` es de `SupplierLuxuryApp.Purchases.OrdenCompra.DTOs` (módulo `OrdenCompra`,
Parte 2, todavía no movido). Deja el `using` cruzado tal cual, **no lo dupliques ni lo muevas**.

### Paso 5.2: Crear `PresupuestoEndPoints.cs`
3 rutas del Paso 1.4 (`cuadro-comparativo/{id}/budgets` GET/POST, `cuadro-comparativo/budgets/{budgetId}` DELETE).

---

## FASE 6: Actualizar namespaces y GlobalUsings

### Paso 6.1: Namespace en cada archivo nuevo/movido
Todos los `.cs` bajo `SolicitudesCompra/` deben declarar
`namespace LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra[.SubCarpeta[.Capa]];`
según su ubicación física (namespace = ruta física, regla ya vigente en el proyecto).

```bash
cd api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra
grep -rLn "^namespace LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra" --include=*.cs .
# debe devolver 0 archivos
```

### Paso 6.2: Actualizar los 3 `GlobalUsings.cs`
En `api/LuxuryApp.Application/GlobalUsings.cs`, `api/LuxuryApp.Api/GlobalUsings.cs`,
`api/LuxuryApp.Tests/GlobalUsings.cs` — busca el bloque `ComprasLuxuryApp.SolicitudesCompra.*` (ya existe
de la Parte 1) y reemplázalo por una línea `global using` por cada namespace nuevo:
```
...SolicitudesCompra.Entities
...SolicitudesCompra.DTOs
...SolicitudesCompra.Interfaces
...SolicitudesCompra.Services
...SolicitudesCompra.Mapping
...SolicitudesCompra.EndPoints
...SolicitudesCompra.Cotizaciones.DTOs / .Interfaces / .Services / .EndPoints / .Mapping
...SolicitudesCompra.Comparativo.DTOs / .Interfaces / .Services / .EndPoints / .Mapping
...SolicitudesCompra.Evidencia.Entities / .DTOs / .Interfaces / .Services / .EndPoints / .Mapping
...SolicitudesCompra.Presupuesto.Entities / .DTOs / .Interfaces / .Services / .EndPoints / .Mapping
...SolicitudesCompra.Detalle.Entities / .DTOs / .Interfaces / .Services / .EndPoints / .Mapping
```
No copies ciegamente las 6 capas para todas si el archivo original de esa capa no existe (ej. si no creaste
`Comparativo/Mapping/`, no agregues esa línea). Verifica archivo por archivo qué carpetas de capa
realmente tienen contenido antes de agregar su `global using`.

**Criterio:** los 3 archivos quedan con el MISMO conjunto de líneas entre sí (Application puede tener un
subconjunto menor, igual que antes de este plan — no fuerces paridad si no la había).

### Paso 6.3: Build backend
```bash
cd api
dotnet build LuxuryApp.Application/LuxuryApp.Application.csproj --nologo -v q
dotnet build LuxuryApp.Api/LuxuryApp.Api.csproj --nologo -v q
```
**Criterio:** 0 errores en ambos. Si `LuxuryApp.Api` falla por archivo bloqueado (proceso corriendo),
repórtalo, no lo fuerces.

---

## FASE 7 (opcional, confirmar con el usuario antes): Frontend

> Esta fase es independiente — si el usuario solo pidió backend en esta ronda, NO la ejecutes todavía.

### Árbol destino
```
compras.luxuryapp/solicitud-compra/
├── solicitud-compra.ts/.html, solicitud-compra-list.ts/.html,
│   solicitud-compra-presentacion.ts/.html, pdf-solicitud-compra.ts     ← raíz, sin cambio
├── detalle/
│   ├── solicitud-compra-detalle.ts/.html
│   ├── product-add.ts/.html, product-modal-add.ts/.html, producto-edit.ts/.html
│   └── product-data.interface.ts
└── comparativo/                                    ← fusión de compras.luxuryapp/cotizacion-proveedor/ (Parte 1)
    ├── cuadro-comparativo-list.ts/.html
    ├── cuadro-comparativo-cotizacion.ts/.html
    ├── cuadro-comparativo-add-proveedor.ts/.html
    └── cuadro-comparativo-add-budget.ts/.html
```
No se crean `cotizaciones/`, `evidencia/` ni `presupuesto/` en frontend — no hay pantalla propia que las
justifique (evidencia está embebida en `solicitud-compra-presentacion.ts` y `cuadro-comparativo-list.ts`;
no existe una pantalla de "solo cotización" separada del cuadro comparativo).

### Pasos
```bash
cd appsweb/angular/src/app/apps/compras.luxuryapp/solicitud-compra
mkdir -p detalle comparativo
git mv solicitud-compra-detalle.* product-add.* product-modal-add.* producto-edit.* product-data.interface.ts detalle/
cd ..
git mv cotizacion-proveedor/* solicitud-compra/comparativo/
rmdir cotizacion-proveedor
```
Actualiza TODOS los imports afectados:
1. `src/app/routing/compras.routing.ts` — imports que apunten a `.../solicitud-compra/solicitud-compra-detalle`,
   `.../solicitud-compra/product-*`, `.../solicitud-compra/producto-edit`, o a
   `.../cotizacion-proveedor/*` → corregir a `.../solicitud-compra/detalle/*` o `.../solicitud-compra/comparativo/*`.
2. Dentro de los propios archivos movidos: cualquier import relativo (`./algo` o `../algo`) que cruce la
   nueva frontera de carpeta.
3. `grep -rn "compras.luxuryapp/cotizacion-proveedor\|compras.luxuryapp/solicitud-compra/solicitud-compra-detalle\|compras.luxuryapp/solicitud-compra/product" appsweb/angular/src` — debe devolver 0 tras el fix.

### Build frontend
```bash
cd appsweb/angular
npx tsc --noEmit -p tsconfig.json
```
**Criterio:** exit 0, 0 errores.

---

## Resumen que el agente debe entregar al usuario al terminar

1. Confirmación de las 7 Fases ejecutadas (o cuáles se saltaron y por qué)
2. Resultado del Paso 0.2 (`PurchaseRequestAddOrEditDTO` — ¿muerto o en uso?)
3. Resultado del Paso 3.2 (`GetSCDTO` — ¿a qué pantalla alimenta?)
4. Cualquier método/ruta que el plan no haya previsto y que se haya encontrado en el Paso 0.3
5. Resultado de los 2 builds (backend + frontend si se ejecutó Fase 7)
6. Lista de archivos con `git status --short` en ambos repos — **sin commitear nada**, el usuario decide

---

## Criterios que Claude auditará después de la ejecución

- [ ] Ningún método "se perdió" — los 23 métodos de `ISolicitudCompraAppService` + 11 de
      `ICotizacionProveedorAppService` originales existen en algún lado de las 6 interfaces resultantes
- [ ] Cero URLs cambiadas — diff de todos los `group.MapXxx("...")` antes/después, mismos strings
- [ ] Cero cambio de comportamiento en los métodos movidos (solo namespace/ubicación, no lógica)
- [ ] `DeleteEvidenceAsync` no existe más como nombre duplicado; los 4 métodos de Evidencia están
      correctamente renombrados y sus 2 llamadores internos actualizados
- [ ] Namespaces = ubicación física en el 100% de los archivos
- [ ] Los 3 `GlobalUsings.cs` no tienen namespaces huérfanos (apuntando a carpetas que ya no existen) ni
      faltantes (carpeta con contenido sin su línea global using)
- [ ] `BudgetToPurchaseOrderDTO` sigue siendo de `OrdenCompra`, no se duplicó ni se movió
- [ ] Build backend y frontend limpios
- [ ] Nada de `OrdenCompra`, `product/`, `provider/` fue tocado
- [ ] CONVENTIONS.md / CONVENTIONSFOLDER.MD sin modificar
- [ ] Ningún commit fue creado sin autorización explícita
