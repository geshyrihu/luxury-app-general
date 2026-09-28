# CORRECCIONES: Auditoría de ejecución — SolicitudesCompra (Parte 1.5)

**Contexto:** siguiente paso de `SOLICITUDESCOMPRA_20260907_PLAN_SUBCONCEPTOS.md`, ya ejecutado. La
auditoría de Claude encontró 4 hallazgos sobre el resultado real (verificados contra el código, no
supuestos). Aplica los 4 en este mismo checkout, sin volver a mover archivos.

**Prioridad de ejecución:** 1 y 2 son bloqueantes (la app no arranca hoy). 3 es limpieza real. 4 es opcional.

## ESTADO FINAL (2026-09-07, tercera auditoría) — ✅ TODOS LOS PUNTOS CERRADOS

| Punto | Estado | Verificado por Claude |
|---|---|---|
| 1. DI de los 3 servicios | ✅ DONE | grep confirma las 3 líneas correctas |
| 2. Namespace de las 5 Entities (Detalle/Evidencia/Presupuesto) | ✅ DONE | `head -1` en los 5 archivos |
| 2b. `Shared/Entities/` con SolicitudCompra + CotizacionProveedor | ✅ DONE | `Shared/Entities/` con los 2 archivos, namespace correcto, `Entities/` raíz eliminada, 0 referencias residuales al namespace viejo en todo `api/` |
| 3. Quitar 2 parámetros huérfanos de `SolicitudCompraAppService` | ✅ DONE | Constructor limpio, build sin CS9113 |
| 4. Parámetro `mapper` en `PresupuestoAppService` | ✅ DONE (lo quitaron) | Confirmado |
| 5. Reportar `GetSCDTO` y `PurchaseRequestAddOrEditDTO` | ✅ DONE | Verifiqué las 2 citas de código (`cuadro-comparativo-cotizacion.ts:118`, `create-orden-compra.ts:111`), ambas exactas. Ver nota abajo. |
| 6. Borrar `Comparativo/Mapping/` vacía | ✅ DONE | Confirmado |

**Nota sobre el punto 5:** `create-orden-compra.ts` solo usa campos genéricos de `GetSCDTO`
(`equipoOInstalacion`, `justificacionGasto`), no las columnas de precio comparativo — es decir, el
endpoint funciona más como "datos generales de la solicitud" que como algo exclusivo de Comparativo. La
forma del DTO (`SCDetalleDTO` con `Precio`/`Precio2`/`Precio3`) sigue pesando más que el patrón de consumo,
así que se acepta la ubicación en `Comparativo/` sin mover — queda anotado por si en el futuro se separa
"datos generales" de "datos de comparación" en DTOs distintos.

**Build final (verificado independientemente, `--no-incremental`):** 0 errores, 2 warnings — ambos
preexistentes y ajenos a esta tarea (`RequestEmployeeRegisterAppService`, `CobranzaOnlineDashboardAppService`).

---

## ADENDA (2026-09-07, post-cierre) — 2 ajustes adicionales del usuario, no ejecutados todavía

### A. Decisión sobre `Shared/DTOs/` — REVERTIDO, ya cerrado

El usuario movió manualmente los 8 DTOs de `Shared/DTOs/` de vuelta a `DTOs/` raíz (namespace, GlobalUsings
y build ya verificados correctos por Claude — no requiere acción). Decisión final: **`Shared/` por ahora
solo contiene `Entities/`** (no se fragmenta por un solo DTO aunque `ComiteEventoDTO` técnicamente
calificara como compartido con `Comparativo/`). No tocar esto de nuevo.

### B. NUEVO — Crear `Solicitudes/` como 6to hijo, mover el núcleo completo ahí

**Motivo:** `SolicitudesCompra/` tenía contenido "suelto" en su propia raíz (`DTOs/`, `Interfaces/`,
`Services/`, `Mapping/`, `Docs/`, parte de `EndPoints/`) en vez de organizarlo como un hijo más, igual que
`Cotizaciones/Comparativo/Evidencia/Presupuesto/Detalle`. El usuario decidió: **todo el núcleo se mueve a
`Solicitudes/`**, dejando `SolicitudesCompra/` como contenedor puro de 6 hijos + `Shared/`, sin nada suelto.

**De paso se corrige un bug real:** `EndPoints/SolicitudCompraDetalleEndPoints.cs` quedó huérfano en la
raíz desde la primera ejecución (Parte 1.5) — sus hermanos `Detalle/Interfaces/` y `Detalle/Services/` ya
estaban correctamente en `Detalle/`, pero este EndPoints nunca se movió. Se corrige en el mismo paso.

**Hacer:**
```bash
cd api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra
mkdir -p Solicitudes
git mv DTOs Solicitudes/DTOs
git mv Interfaces Solicitudes/Interfaces
git mv Services Solicitudes/Services
git mv Mapping Solicitudes/Mapping
git mv Docs Solicitudes/Docs
mkdir -p Solicitudes/EndPoints Detalle/EndPoints
git mv EndPoints/SolicitudCompraEndPoints.cs Solicitudes/EndPoints/
git mv EndPoints/SolicitudCompraDetalleEndPoints.cs Detalle/EndPoints/
rmdir EndPoints 2>/dev/null   # debe quedar vacía y desaparecer
```

**Actualizar namespaces:**
```bash
cd api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/Solicitudes
find . -name "*.cs" -exec sed -i \
  's/namespace LuxuryApp\.Application\.Modules\.ComprasLuxuryApp\.SolicitudesCompra\.\(DTOs\|Interfaces\|Services\|Mapping\|EndPoints\);/namespace LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Solicitudes.\1;/' {} +

cd ../Detalle
sed -i 's/namespace LuxuryApp\.Application\.Modules\.ComprasLuxuryApp\.SolicitudesCompra\.EndPoints;/namespace LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Detalle.EndPoints;/' EndPoints/SolicitudCompraDetalleEndPoints.cs
```

**⚠️ No toques las 2 entidades `Shared/Entities/`** — los alias `using SolicitudCompraEntity =
...SolicitudesCompra.Shared.Entities.SolicitudCompra;` y `using CotizacionProveedorEntity = ...` que ya
existen dentro de los archivos movidos a `Solicitudes/` **no cambian**, siguen apuntando a `Shared.Entities`
que no se mueve en este paso.

**Actualizar los 3 `GlobalUsings.cs`** — reemplaza las líneas que dicen
`...SolicitudesCompra.DTOs` / `.Interfaces` / `.Services` / `.Mapping` / `.EndPoints` (sin `.Solicitudes.`)
por su versión con `.Solicitudes.` insertado, y agrega la línea de `Detalle.EndPoints` si no existe ya:
```
global using LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Solicitudes.DTOs;
global using LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Solicitudes.Interfaces;
global using LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Solicitudes.Services;
global using LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Solicitudes.Mapping;
global using LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Solicitudes.EndPoints;
global using LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Detalle.EndPoints;
```
(Respeta la asimetría que ya existe entre los 3 archivos — `LuxuryApp.Application/GlobalUsings.cs`
históricamente tiene menos líneas que `Api`/`Tests` para esta zona; no fuerces paridad si no la había.)

**Nada más cambia:** `Comparativo/`, `Cotizaciones/`, `Evidencia/`, `Presupuesto/`, `Detalle/Interfaces|Services`,
`Shared/Entities/` no se tocan en este paso — verificado que ninguno de los 5 hijos referencia
`SolicitudCompraDTO`/`SolicitudCompraAddOrEditDTO`/`ISolicitudCompraAppService`/etc. directamente por alias
explícito (solo `ComiteEventoDTO` se usa desde `Comparativo`, vía global using, que ya queda cubierto arriba).

**Criterio de validación:**
```bash
ls api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/EndPoints 2>&1
# debe decir "No existe el archivo o el directorio"
grep -rn "namespace LuxuryApp\.Application\.Modules\.ComprasLuxuryApp\.SolicitudesCompra\.\(DTOs\|Interfaces\|Services\|Mapping\|EndPoints\);" api/ --include=*.cs
# 0 resultados (namespace viejo sin ".Solicitudes." ya no debe existir en ningún archivo)
dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj --nologo -v q --no-incremental
# 0 errores
dotnet build api/LuxuryApp.Api/LuxuryApp.Api.csproj --nologo -v q
# 0 errores (confirma que DI y EndPoints auto-discovery siguen resolviendo bien tras el namespace nuevo)
```

**Reporta al terminar:** árbol final de `SolicitudesCompra/` (`find ... -maxdepth 2 -type d`) y resultado de
los 2 builds.

---

## ✅ CIERRE DEFINITIVO (2026-09-07, cuarta y última auditoría)

Árbol final verificado por Claude, coincide exacto con lo reportado:
```
SolicitudesCompra/
├── Comparativo/    (DTOs, EndPoints, Interfaces, Services)
├── Cotizaciones/   (DTOs, EndPoints, Interfaces, Mapping, Services)
├── Detalle/        (DTOs, EndPoints, Entities, Interfaces, Mapping, Services)
├── Evidencia/      (DTOs, EndPoints, Entities, Interfaces, Mapping, Services)
├── Presupuesto/    (DTOs, EndPoints, Entities, Interfaces, Mapping, Services)
├── Shared/         (Entities)
└── Solicitudes/    (Docs, DTOs, EndPoints, Interfaces, Mapping, Services)
```
- Namespaces: 100% correctos, 0 residuos del namespace viejo en todo `api/`.
- `GlobalUsings.cs` (3 archivos): actualizados, sin huérfanos.
- Build `Application`: 0 errores (verificado con `--no-incremental`).
- Build `Api`: 0 errores de compilación (el único fallo fue de copia de DLL por proceso corriendo, no de código).
- 3 archivos de `ReclutamientoLuxuryApp` modificados sin commitear detectados y confirmados por el usuario
  como trabajo no relacionado de otra sesión — no se tocaron.

**`SolicitudesCompra/` queda con estructura final: contenedor puro de 6 hijos + `Shared/`, sin nada suelto
en su propia raíz. Parte 1.5 CERRADA.**

**Parte 1.5 (reestructura por sub-concepto de SolicitudesCompra) queda CERRADA.**

---

## 1. CRÍTICO / P0 — Los 3 servicios nuevos no están registrados en DI (la app no arranca)

**Síntoma real observado:** `System.InvalidOperationException: Body was inferred but the method does not
allow inferred body parameters` al iniciar `LuxuryApp.Api` — Minimal API no encuentra
`IComparativoAppService`/`IEvidenciaAppService`/`IPresupuestoAppService` registrados, así que trata el
parámetro `appService` de los endpoints como si viniera del body en vez de inyectarlo, y eso falla en
`MapGet`/`MapDelete`.

**Verificado:** `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs` solo tiene:
```
services.AddScoped<ICotizacionProveedorAppService, CotizacionProveedorAppService>();
services.AddScoped<ISolicitudCompraAppService, SolicitudCompraAppService>();
services.AddScoped<ISolicitudCompraDetalleAppService, SolicitudCompraDetalleAppService>();
```
Faltan las 3 clases nuevas de esta reestructura.

**Hacer:** agregar, respetando el orden alfabético que ya usa el archivo (busca dónde caería cada
interfaz alfabéticamente entre las líneas existentes, no las pongas todas juntas si el archivo está
ordenado A-Z):
```csharp
services.AddScoped<IComparativoAppService, ComparativoAppService>();
services.AddScoped<IEvidenciaAppService, EvidenciaAppService>();
services.AddScoped<IPresupuestoAppService, PresupuestoAppService>();
```

**Criterio de validación:**
```bash
cd api && dotnet run --project LuxuryApp.Api --no-build 2>&1 | head -30
```
(o el método que uses para levantar el API) — debe arrancar sin `InvalidOperationException`. Si ya tienes
un build previo, corre `dotnet build` primero.
```bash
grep -c "AddScoped<IComparativoAppService\|AddScoped<IEvidenciaAppService\|AddScoped<IPresupuestoAppService" api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs
```
Debe devolver `3`.

---

## 2. CRÍTICO — 5 Entities movidas conservan el namespace raíz en vez del namespace de su nueva carpeta

**Verificado con `head -1` en los 5 archivos** — todos declaran `namespace
LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Entities;` aunque físicamente ya viven en
subcarpetas. No rompe el build (todo internamente consistente entre sí), pero viola la regla central del
proyecto "namespace = ubicación física" (CONVENTIONSFOLDER.MD).

| Archivo | Namespace actual (incorrecto) | Namespace correcto |
|---|---|---|
| `Detalle/Entities/SolicitudCompraDetalle.cs` | `...SolicitudesCompra.Entities` | `...SolicitudesCompra.Detalle.Entities` |
| `Detalle/Entities/CotizacionDetalle.cs` | `...SolicitudesCompra.Entities` | `...SolicitudesCompra.Detalle.Entities` |
| `Evidencia/Entities/SolicitudCompraEvidence.cs` | `...SolicitudesCompra.Entities` | `...SolicitudesCompra.Evidencia.Entities` |
| `Evidencia/Entities/CotizacionProveedorEvidence.cs` | `...SolicitudesCompra.Entities` | `...SolicitudesCompra.Evidencia.Entities` |
| `Presupuesto/Entities/SolicitudCompraBudget.cs` | `...SolicitudesCompra.Entities` | `...SolicitudesCompra.Presupuesto.Entities` |

**Hacer:**
```bash
cd api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra
sed -i 's/namespace LuxuryApp\.Application\.Modules\.ComprasLuxuryApp\.SolicitudesCompra\.Entities;/namespace LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Detalle.Entities;/' Detalle/Entities/SolicitudCompraDetalle.cs Detalle/Entities/CotizacionDetalle.cs
sed -i 's/namespace LuxuryApp\.Application\.Modules\.ComprasLuxuryApp\.SolicitudesCompra\.Entities;/namespace LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Evidencia.Entities;/' Evidencia/Entities/SolicitudCompraEvidence.cs Evidencia/Entities/CotizacionProveedorEvidence.cs
sed -i 's/namespace LuxuryApp\.Application\.Modules\.ComprasLuxuryApp\.SolicitudesCompra\.Entities;/namespace LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Presupuesto.Entities;/' Presupuesto/Entities/SolicitudCompraBudget.cs
```

**Después, actualiza los 3 `GlobalUsings.cs`** (`LuxuryApp.Application`, `LuxuryApp.Api`, `LuxuryApp.Tests`):
agrega estas 3 líneas donde corresponda (revisa cuáles de las 3 ya tenían el global using de `Entities`
raíz para mantener la misma asimetría que ya existía, no las agregues a ciegas en los 3 si el patrón
actual no las tenía):
```
global using LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Detalle.Entities;
global using LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Evidencia.Entities;
global using LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Presupuesto.Entities;
```

**Cualquier archivo que use un alias explícito apuntando al namespace viejo también debe corregirse** (ej.
si algún `using X = ...SolicitudesCompra.Entities.SolicitudCompraDetalle;` existe, debe pasar a
`...SolicitudesCompra.Detalle.Entities.SolicitudCompraDetalle`):
```bash
grep -rln "SolicitudesCompra\.Entities\.\(SolicitudCompraDetalle\|CotizacionDetalle\|SolicitudCompraEvidence\|CotizacionProveedorEvidence\|SolicitudCompraBudget\)" api/
```
Corrige cada resultado que aparezca.

**Criterio de validación:**
```bash
grep -rL "^namespace LuxuryApp\.Application\.Modules\.ComprasLuxuryApp\.SolicitudesCompra\.Detalle\.Entities" --include=*.cs api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/Detalle/Entities/
# debe devolver 0 archivos (mismo patrón para Evidencia/Entities y Presupuesto/Entities)
dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj --nologo -v q
# 0 errores
```

---

## 2b. CRÍTICO — Crear `SolicitudesCompra/Shared/Entities/` para las 2 entidades raíz (regla CONVENTIONSFOLDER.MD)

**Regla aplicada:** CONVENTIONSFOLDER.MD dice que los archivos compartidos a nivel de módulo van en una
carpeta `Shared/`. `SolicitudCompra.cs` y `CotizacionProveedor.cs` son referenciadas por las 5 subcarpetas
(`Cotizaciones`, `Comparativo`, `Evidencia`, `Presupuesto`, `Detalle`) — no pertenecen a ninguna en
particular, son la base compartida de todo el submódulo. Verifiqué que **no hay ningún otro código
duplicado** (helpers, validaciones) entre las 5 subcarpetas — cada una tiene su propia lógica sin
repetirse — así que esto se limita a las 2 Entities, no hay más candidatos a `Shared/` hoy.

**Hacer:**
```bash
cd api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra
mkdir -p Shared/Entities
git mv Entities/SolicitudCompra.cs Shared/Entities/
git mv Entities/CotizacionProveedor.cs Shared/Entities/
sed -i 's/namespace LuxuryApp\.Application\.Modules\.ComprasLuxuryApp\.SolicitudesCompra\.Entities;/namespace LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Shared.Entities;/' Shared/Entities/SolicitudCompra.cs Shared/Entities/CotizacionProveedor.cs
rmdir Entities 2>/dev/null   # debe quedar vacía y desaparecer; si no queda vacía, algo se te olvidó mover
```

**Actualizar los 13 archivos que referencian el namespace viejo por alias** (`using X =
LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Entities.SolicitudCompra;` o
`...CotizacionProveedor;`) → cambiar el segmento `SolicitudesCompra.Entities.` por
`SolicitudesCompra.Shared.Entities.` en cada uno:
```
Services/SolicitudCompraAppService.cs
Interfaces/ISolicitudCompraAppService.cs
Mapping/SolicitudCompraMapper.cs
DTOs/SolicitudCompraDTO.cs
DTOs/SolicitudCompraAddOrEditDTO.cs
Cotizaciones/Mapping/CotizacionMapper.cs
Cotizaciones/Services/CotizacionProveedorAppService.cs
Cotizaciones/Interfaces/ICotizacionProveedorAppService.cs
Cotizaciones/DTOs/CotizacionProveedorDTO.cs
Comparativo/Services/ComparativoAppService.cs
Comparativo/Interfaces/IComparativoAppService.cs
Detalle/DTOs/SolicitudCompraDetalleAddOrEditDTO.cs
Detalle/DTOs/SolicitudCompraDetalleDTO.cs
```
Comando sugerido (revisa el resultado, no lo apliques a ciegas si alguno tiene el patrón distinto):
```bash
grep -rl "SolicitudesCompra\.Entities\.\(SolicitudCompra\|CotizacionProveedor\)\b" --include=*.cs . | \
  xargs sed -i 's/SolicitudesCompra\.Entities\.\(SolicitudCompra\|CotizacionProveedor\)/SolicitudesCompra.Shared.Entities.\1/g'
```

**Actualizar los 3 `GlobalUsings.cs`:** donde exista la línea
`global using LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Entities;`, reemplázala por:
```
global using LuxuryApp.Application.Modules.ComprasLuxuryApp.SolicitudesCompra.Shared.Entities;
```

⚠️ **No confundir con el punto 2** (Detalle/Evidencia/Presupuesto Entities) — son namespaces distintos e
independientes. Aplica ambos puntos, no se pisan entre sí.

**Criterio de validación:**
```bash
ls api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/Entities 2>&1
# debe decir "No existe el archivo o el directorio" — la carpeta raíz Entities/ ya no existe
grep -rn "SolicitudesCompra\.Entities\b" api/ --include=*.cs
# 0 resultados (ya no debe quedar NADA apuntando al namespace raíz de Entities, ni el de este punto ni el del punto 2)
dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj --nologo -v q
# 0 errores
```

---

## 3. ALTO — 2 parámetros de constructor huérfanos en `SolicitudCompraAppService` (no es deuda aceptable)

**Verificado:** `aiAssistantService` ya se usa correctamente en `Comparativo/Services/ComparativoAppService.cs:431`
y `aspelQuotationService` en `Presupuesto/Services/PresupuestoAppService.cs:20,46,47` — las extracciones
correctas ya existen. `SolicitudCompraAppService.cs` ya no los usa (0 referencias internas). El warning
CS9113 no es deuda técnica preexistente, es residuo directo de esta extracción.

**Hacer:** en `api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/Services/SolicitudCompraAppService.cs`,
quitar del primary constructor los 2 parámetros:
```csharp
IAiAssistantService aiAssistantService,
IAspelQuotationService aspelQuotationService
```
No se toca `DependencyInjection.Controllers.cs` — la línea `AddScoped<ISolicitudCompraAppService,
SolicitudCompraAppService>()` no lista parámetros, DI los resuelve por reflexión sobre el constructor
real; al quitarlos del constructor, DI simplemente deja de pasarlos.

**Criterio de validación:**
```bash
dotnet build api/LuxuryApp.Application/LuxuryApp.Application.csproj --nologo -v q --no-incremental 2>&1 | grep CS9113
# no debe aparecer ninguna línea de SolicitudCompraAppService.cs
```

---

## 4. OPCIONAL — parámetro `mapper` sin usar en `PresupuestoAppService`

Menor prioridad, mismo patrón: si tras revisar `Presupuesto/Services/PresupuestoAppService.cs` confirmas
que `mapper` no se usa en ningún método, quítalo del constructor. Si prefieres dejarlo por si se usa
pronto, está bien, repórtalo como decisión consciente.

---

## 5. Pendientes de reportar explícitamente (ya investigados parcialmente por Claude, faltó tu confirmación)

- **`PurchaseRequestAddOrEditDTO`** (en `SolicitudesCompra/DTOs/`): confirmado código muerto (0
  consumidores fuera de su propia declaración). Ya está movido correctamente a la raíz — no lo borres sin
  que el usuario lo autorice, solo confírmalo en tu resumen final.
- **`GetSCDTO`** (ahora en `Comparativo/`): la ruta que lo sirve (`GET api/solicitud-compra/{id}`)
  coincide con un endpoint llamado `getById` en `appsweb/angular/src/app/core/constants/endpoints/supplier.endpoints.ts:13`,
  que también aparece duplicado como `solicitudcompraById` en la línea 186 del mismo archivo (mismo URL,
  dos nombres). Antes de dar esto por cerrado, busca en
  `appsweb/angular/src/app/apps/compras.luxuryapp/solicitud-compra/**/*.ts` qué componente llama a ese
  endpoint y confirma si de verdad alimenta la pantalla de cuadro comparativo (entonces `Comparativo/` es
  correcto) o si alimenta la página principal de la solicitud (entonces debería quedarse en la raíz de
  `SolicitudesCompra`, no en `Comparativo/`). Repórtalo explícitamente, no lo dejes implícito.

---

## 6. Trivial — carpeta vacía

```bash
rmdir api/LuxuryApp.Application/Modules/ComprasLuxuryApp/SolicitudesCompra/Comparativo/Mapping 2>/dev/null
```
(no había `CreateMap` que mover ahí — la carpeta vacía es correcta que no tenga contenido, solo bórrala si
no la vas a usar).

---

## Resumen que debes entregar al terminar

1. Confirmación de los puntos 1, 2, 2b y 3 aplicados y build limpio (0 errores, sin los 2 CS9113 de
   `SolicitudCompraAppService`)
2. Decisión tomada en el punto 4 (quitaste `mapper` o lo dejaste, y por qué)
3. Respuesta explícita del punto 5 para `GetSCDTO` (a qué pantalla alimenta, con el archivo:línea del
   componente que lo llama)
4. `git status --short` de `api/` — sin commitear nada
