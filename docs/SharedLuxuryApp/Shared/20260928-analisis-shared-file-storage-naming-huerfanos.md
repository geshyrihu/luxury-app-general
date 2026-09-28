# Análisis: Nomenclatura de Rutas de Archivos + Inventario de Uso + Plan de Huérfanos en Disco

**Fecha:** 2026-09-28
**Tipo:** Análisis + Inventario + Plan (sin implementación)
**Alcance:** `IFileWritePathService`, `IFileReadPathService`, `IFileStructureResolver`, `FileDirectories`, `ISecureFileStorageService`, `IImageStorageService`

---

## 0. Resumen ejecutivo

1. El sistema de rutas SÍ tiene un diseño centralizado intencional (`FileDirectories` → `IFileStructureResolver` → `IFileWritePathService`/`IFileReadPathService`), documentado en [`conventions/backend/document-read-write-pattern.md`](../../../conventions/backend/document-read-write-pattern.md). El patrón en sí es sano.
2. Pero la nomenclatura **no es coherente**: mezcla kebab-case (mayoría, correcto), camelCase, PascalCase "legacy", minúsculas sin separador y un typo conservado a propósito. Ver §1.
3. Hay **fugas del patrón**: nombres de carpeta como literales sueltos directamente en `FileWritePathService`/`FileReadPathService` en vez de constantes en `FileDirectories`, y dos casos reales de código que **bypasea** el patrón (uno reconstruye rutas a mano y hasta guarda la ruta completa en BD en vez de solo el nombre). Ver §2.
4. Con 108 archivos del backend consumiendo estos servicios directamente, cualquier huérfano en disco es prácticamente imposible de rastrear a mano — se necesita un catálogo formal "método de ruta ↔ entidad/campo de BD dueño" antes de poder purgar nada con seguridad. Ver §3.
5. **No se tocó ningún archivo ni se escribió código de producción.** Este documento es solo análisis y plan, tal como se pidió.

---

## 1. Coherencia de nomenclatura

### 1.1 Fuente real de la verdad

- [`FileDirectories.cs`](../../../api/LuxuryApp.Application/Shared/Utils/FileDirectories.cs) — constantes de nombres de carpeta.
- [`IFileStructureResolver.cs`](../../../api/LuxuryApp.Application/Shared/Services/IFileStructureResolver.cs) — compone rutas relativas (`public/customers/{id}/{modulo}/...`).
- [`IFileWritePathService.cs`](../../../api/LuxuryApp.Application/Shared/Services/IFileWritePathService.cs) — expone ~63 métodos `XxxDirectory()` que devuelven ruta **física completa** (para escritura/borrado).
- [`IFileReadPathService.cs`](../../../api/LuxuryApp.Application/Shared/Services/IFileReadPathService.cs) — expone ~59 métodos `GetXxxPath()`/`GetXxxFilePath()` que devuelven **URL segura** (`/api/files/download?filePath=...`).

### 1.2 Inconsistencias de casing en los nombres de carpeta

| Estilo | Ejemplos | Origen |
|---|---|---|
| ✅ kebab-case (el estándar declarado en el propio checklist del patrón, línea "¿Seguís nomenclatura de carpetas existentes (kebab-case)?") | `tel-emergencia`, `manuals-and-processes`, `purchase-requests`, `fine-evidences`, `recepcion-pipas-agua`, `sat-config`, `building-documents`, `employee-contracts` | `FileDirectories` |
| ❌ camelCase | `ordenServicio` (`Modules.OrdenServicio`), `documentBuilding` (`SubModules.DocumentBuilding`) | `FileDirectories.cs:47,70` |
| ❌ minúsculas pegadas (sin separador) | `cedulassoporte`, `estadofinanciero` | `FileDirectories.cs:37,39` |
| ❌ PascalCase "legacy" (admitido en comentario) | `Administration` — comentario dice literalmente *"Note: Legacy casing preserved"* | `FileDirectories.cs:14` |
| ❌ PascalCase dentro de un switch por lo demás kebab-case | `ManualsLuxuryApp`, `ConcesionBarranca`, `ConcesionPozo` en `DocumentTypeExtensions.ToFolderName()` | `IFileReadPathService.cs:230-232` |
| ❌ Typo conservado a propósito | `invoce` (debería ser `invoice`) — comentario: *"Typo preserved for compatibility"* | `FileDirectories.cs:53` |

### 1.3 Literales sueltos que no pasan por `FileDirectories` (fuga de la centralización)

El propio `FileDirectories.cs` se declara como *"Definición centralizada de nombres de directorios"*, pero varios métodos de `FileWritePathService`/`FileReadPathService` usan strings hardcodeados en línea en vez de una constante:

- `"presentacion"` — `IFileWritePathService.cs:169`, `IFileReadPathService.cs:167`
- `"constancia-fiscal"` — `IFileWritePathService.cs:170`, `IFileReadPathService.cs:190`
- `"checador"` — `IFileWritePathService.cs:189`, `IFileReadPathService.cs:203`
- `"recruitment"`, `"candidates"`, `"cv"`, `"photo"` — `IFileWritePathService.cs:190-193`, `IFileReadPathService.cs:204-206`
- `"public"`, `"employees"`, `"incidents"`, `"nomina"`, `"dismissals"` — `IFileWritePathService.cs:182-183,188`, `IFileReadPathService.cs:197-198,202`
- `"rrhh"`, `"leave-request"`, `"documents"`, `"contracts"` — `IFileWritePathService.cs:160,194-195`, `IFileReadPathService.cs:177,207-208`
- `"quotations"` / `"evidences"` — inconsistente incluso *dentro* del mismo archivo: línea 176 usa la constante `FileDirectories.SubModules.Quotations`, pero línea 192 (mismo archivo, mismo concepto) usa el literal `"quotations"` suelto.

Efecto práctico: si mañana se decide renombrar cualquiera de estas carpetas, hay que buscar y reemplazar strings sueltos en dos archivos distintos en lugar de cambiar una constante — exactamente el problema que `FileDirectories` fue creado para evitar.

### 1.4 Doble fuente de verdad para "raíz pública/privada"

- `FileDirectories.PublicRoot = "public"` / `PrivateRoot = "private"` — constantes **hardcodeadas** en código.
- `FileStorageSettingsDTO.PublicPath` / `PrivatePath` — **configurables** vía `appsettings`.

`GetCustomerPath`, `GetAdminPath`, `GetProviderPath` y `GetAnnouncementPath` (en `IFileStructureResolver`) usan siempre el literal `FileDirectories.PublicRoot`, **ignorando** `_settings.PublicPath`. Mientras tanto, `LeaveRequestDirectory`, `RecruitmentEmployeeDocumentDirectory`, `WorkContractDirectory`, `IncidentAttachmentDirectory`, etc. sí usan `_settings.PrivatePath`/literal `"public"` directamente en el propio servicio, sin pasar por el resolver. Dos mecanismos conviviendo para el mismo concepto ("¿dónde está la raíz pública/privada?") es una fuente de bugs si algún día cambia la config de `appsettings`.

### 1.5 Inconsistencia de naming entre métodos Read/Write para el mismo recurso

- Write usa sufijo `...Directory()` de forma consistente (`MachineryDirectory`, `ApplicationUserDirectory`, ...).
- Read usa mayormente `Get...PhotoPath()`/`Get...FilePath()`, pero `GetTools(customerId)` y `GetPiscina(customerId)` rompen el propio patrón de nombres del archivo: devuelven un **directorio** (URL base), no un archivo, y no llevan el sufijo `Path` que todos sus vecinos sí llevan.
- Typo real en nombre de método **público** (no solo en carpeta): `GetMachineyPhotoPath` en vez de `GetMachineryPhotoPath` (`IFileReadPathService.cs:14,155`), mientras que su contraparte de escritura sí se llama correctamente `MachineryDirectory`.

### 1.6 Dos clases distintas implementan la misma interfaz de bajo nivel

`FileStorageService` y `SecureFileStorageService` implementan ambas `ISecureFileStorageService`. Solo `SecureFileStorageService` está registrada en DI (`DependencyInjection.Infrastructure.cs:76`). `FileStorageService.GetFileAsync()`/`SaveStreamAsync()` literalmente lanzan `NotImplementedException("Implementación disponible en SecureFileStorageService.")` — es decir, la propia clase admite en su código que es una implementación incompleta/paralela. Nombres tan parecidos (`FileStorageService` vs `SecureFileStorageService`) para dos clases con distinto grado de completitud es un riesgo real de que alguien inyecte/instancie la equivocada.

---

## 2. Inventario de uso en el API

### 2.1 Magnitud

- **108 archivos** bajo `LuxuryApp.Application/Modules/**` referencian directamente `IFileWritePathService` y/o `IFileReadPathService` (búsqueda por interfaz, no por implementación concreta).
- Cubren prácticamente todos los dominios de negocio: `OperationsLuxuryApp` (~24 archivos), `RecruitmentLuxuryApp` (~19), `PurchasesLuxuryApp` (~11), `MaintenanceLuxuryApp` (~10), `AccountingLuxuryApp` (~7), `HumanResourcesLuxuryApp` (~6), `AdminLuxuryApp` (~5), `LegalLuxuryApp` (~4), `AuthLuxuryApp` (~3), `SharedLuxuryApp` (~3), `CommitteeLuxuryApp` (1), `CollectionsLuxuryApp` (1).
- 1 sola clase (`SecureFileStorageService`) hace la escritura/lectura física real de bytes en disco, detrás de `IFileProvider` (`LocalFileProvider` hoy; el diseño deja la puerta abierta a un `S3FileProvider` futuro sin tocar el resto del árbol).
- 4 archivos usan `FileStorageSettingsDTO` directamente dentro de `Modules/` (fuera de `Shared/Services`), en vez de pasar exclusivamente por los servicios oficiales:
  - `FileEndpointSupport.cs` / `FilesEndpoints.cs` (legítimo: son el propio endpoint de descarga genérico y el de imágenes de sidebar/home, no tienen otro servicio del cual colgarse).
  - `CommitteeAppService.cs` (uso puntual, sin reconstrucción de ruta — a confirmar en detalle si se decide auditar módulo por módulo).
  - `BudgetProposalItemSupportService.cs` — **este sí es una violación real**, ver §2.2.

> Nota de método: dado el tamaño del repo (búsquedas sin acotar a `LuxuryApp.Application` hicieron timeout de ripgrep por el volumen de `bin/`/`obj`/`.vs`), este inventario se basa en: (a) búsqueda exhaustiva de todas las referencias a las dos interfaces principales, (b) búsqueda dirigida de patrones de riesgo conocidos (`WebRootPath`, `ContentRootPath`, uso directo de `FileStorageSettingsDTO`), y (c) lectura completa de los 6 archivos núcleo del subsistema. No se leyeron los 108 archivos uno por uno. Antes de ejecutar cualquier remediación de código se recomienda confirmar con una pasada automatizada (ver Fase 0 del plan, §3).

### 2.2 Violaciones concretas encontradas al patrón documentado

El propio [`document-read-write-pattern.md`](../../../conventions/backend/document-read-write-pattern.md) prohíbe explícitamente "hardcodear rutas físicas" y exige que en BD se guarde "solo el nombre relativo, no ruta completa". Se encontraron dos incumplimientos reales:

**a) `SendEmailAppService.cs:556`**
```csharp
var rutaArchivo = $"{env.WebRootPath}/img/customers/{junta.CustomerId}/presentacion/{junta.Id}/Financieros.pdf";
```
Construye una ruta física a mano con `env.WebRootPath` + literales, en vez de `fileWritePathService.PresentacionDirectory(customerId, id)`. Si la estructura de carpetas de Presentación cambia alguna vez (por ejemplo al migrar a S3, o al renombrar `"presentacion"`), este envío de correo se rompe en silencio y ningún grep sobre `FileDirectories` lo detecta porque no la usa.

**b) `BudgetProposalItemSupportService.cs:118-134`**
```csharp
var physicalDirectoryPath = fileWritePathService.BudgetSupportDirectory(item.BudgetProposal.CustomerId, item.BudgetProposal.FiscalYear);
var relativeDirectoryPath = Path.Combine(
    fileStorageSettings.Value.PublicPath, "customers",
    item.BudgetProposal.CustomerId.ToString(), "presupuesto",
    item.BudgetProposal.FiscalYear.ToString()
);
...
FilePath = Path.Combine(relativeDirectoryPath, savedFileName), // ⚠️ ruta completa en BD
```
Dos problemas simultáneos:
1. Reconstruye a mano (con literales `"customers"`/`"presupuesto"`) la misma ruta que `BudgetSupportDirectory` ya calcula con constantes — duplicación que puede desincronizarse.
2. Guarda en `BudgetProposalItemSupportFile.FilePath` la **ruta relativa completa**, no solo el nombre del archivo — viola directamente el patrón documentado ("Lo que se almacena en BD: ... Solo el nombre relativo") y acopla la BD a la estructura física de carpetas: si algún día se reorganiza esa carpeta, todos los registros existentes de `BudgetProposalItemSupportFile` quedan apuntando a una ruta que ya no existe, **sin que el código de lectura pase por `IFileReadPathService` para recalcularla**.

Este segundo hallazgo es, además, el ejemplo más claro de *por qué* el problema de huérfanos (§3) es difícil: si una sola entidad ya rompe la convención "BD guarda solo el nombre", un script de auditoría que asuma esa convención de forma universal generará falsos positivos/negativos justo en esta tabla.

---

## 3. Plan: detectar y purgar de forma segura archivos huérfanos en disco

### 3.1 Problema

Con 108 puntos de escritura y varios flujos de "reemplazar archivo" (`UpdateAsync`) y "borrar entidad" (`DeleteAsync`), es esperable que existan archivos en disco sin ningún registro vivo en BD que los referencie: por bugs históricos (el propio `document-read-write-pattern.md` documenta un caso real y ya conocido: `MachineryAppService.DeleteAsync` con catch vacío y sin transacción, línea 514), por reemplazos donde no se borró el archivo anterior, o por uploads que fallaron a mitad de camino antes de crear el registro en BD.

### 3.2 Principio rector

**Nunca borrar en el primer intento.** El flujo siempre es: `Escanear → Clasificar → Cuarentena (mover, no borrar) → Periodo de gracia → Borrado definitivo solo con aprobación humana`. Es una operación destructiva sobre datos de producción (fotos, documentos legales, comprobantes fiscales); un falso positivo borrado es, en varios de estos módulos (SAT, contratos, actas), potencialmente irreversible y con implicación legal.

### 3.3 Fase 0 — Catálogo formal "método de ruta ↔ entidad/campo de BD" (prerrequisito obligatorio)

Antes de escanear nada, se necesita un artefacto versionado (JSON o tabla en `.md`) que documente, por cada método de `IFileWritePathService`, qué `DbSet`/entidad/campo de BD es "dueño" de los archivos que viven en esa carpeta. Ejemplo de fila:

| Método de ruta | Entidad | Campo(s) con el nombre de archivo | Notas |
|---|---|---|---|
| `MachineryDirectory(customerId)` | `Equipment` (o la entidad de maquinaria vigente) | `PhotoPath`/documento técnico | — |
| `BudgetSupportDirectory(customerId, fiscalYear)` | `BudgetProposalItemSupportFile` | `FilePath` | ⚠️ guarda ruta completa, no filename — ver §2.2b, tratar distinto en el comparador |
| `PresentacionDirectory(customerId, id)` | `PresentacionJuntaComite` | `ArchivoPortada`, `ArchivoContabilidad`, `ArchivoConclusiones`, ... | multi-archivo por entidad, ver `AddFileAsync` en el patrón documentado |
| *(resto de los ~63 métodos)* | *(a completar)* | *(a completar)* | — |

Este catálogo **no se puede producir de memoria de forma confiable** dado el tamaño del inventario (§2.1); debe generarse con un barrido dirigido (buscar, para cada método de `IFileWritePathService`, sus llamadores y qué entidad/campo alimentan). Es trabajo de una siguiente sesión de implementación, no de este documento.

Casos especiales a resolver explícitamente en el catálogo antes de escanear:
- `BudgetProposalItemSupportFile.FilePath` (ruta completa en vez de nombre, §2.2b).
- La ruta ad-hoc de `SendEmailAppService.cs:556` — decidir si se excluye del escaneo por ser "generado bajo demanda, no persistente por diseño" o si se corrige primero para que pase por el servicio oficial.
- Entidades con múltiples archivos por registro (Presentación, Purchase Requests con evidencias + cotizaciones + evidencias de cotización anidadas).

### 3.4 Fase 1 — Snapshot reproducible de disco y de BD

- **Disco:** recorrido completo de `RootPath` (ambos árboles `public/` y `private/`) generando lista de: ruta relativa, tamaño, fecha de última modificación.
- **BD-esperado:** por cada fila del catálogo de Fase 0, reconstruir la ruta relativa esperada llamando a **los mismos métodos reales** de `IFileWritePathService`/`IFileReadPathService` que usa el código de producción (para no reimplementar la lógica de rutas en un script externo y arriesgarse a que ambas se desincronicen). Idealmente esto es un job de consola/Hangfire dentro del propio backend, inyectando los servicios reales vía DI, no un script Python/PowerShell externo que reinvente `FileDirectories`.
- Ambos snapshots se guardan con timestamp para permitir diffs reproducibles y auditables.

### 3.5 Fase 2 — Diferencia y clasificación de riesgo

"Huérfano candidato" = archivo en disco cuya ruta relativa no aparece en el conjunto BD-esperado.

Clasificar por antigüedad (`mtime`) antes de tocar nada:
- 🟢 **>90 días** sin match → candidato fuerte a huérfano real.
- 🟡 **7–90 días** → podría venir de un upload en dos pasos que falló a mitad de camino → cuarentena más larga, revisión manual antes de mover.
- 🔴 **<7 días** → **excluir siempre** del ciclo actual; puede estar en vuelo (transacción de BD aún no comprometida cuando corrió el escaneo).

Excluir explícitamente del barrido las rutas ya identificadas como "no persistentes por diseño" (temporales, exports, la ruta ad-hoc de `SendEmailAppService` si se decide no corregirla primero) para no contaminar el reporte con falsos positivos conocidos.

### 3.6 Fase 3 — Cuarentena, nunca borrado directo

- El script/job de auditoría **jamás** llama `File.Delete` directamente.
- Los candidatos 🟢 se **mueven** (no copian) a un árbol paralelo `/_quarantine/{fecha-de-corrida}/...` conservando su ruta relativa original — así restaurar un falso positivo es un simple move-back, sin necesidad de backups.
- Se genera un reporte (CSV/JSON) por corrida: ruta original, tamaño, `mtime`, motivo de clasificación, entidad candidata más cercana (si el catálogo permite sugerir "se parece a X pero no matcheó por Y").
- El reporte se entrega al Tech Lead/dueño del módulo correspondiente antes de continuar — no es un proceso 100% automático.

### 3.7 Fase 4 — Periodo de gracia y purga definitiva

- La cuarentena vive un período fijo (propuesta: 30 días) sin que nadie reclame que un archivo movido sí se necesitaba.
- Solo entonces, un **segundo job separado, con su propia aprobación explícita**, borra físicamente lo que sigue en cuarentena tras el período de gracia.
- Cada corrida queda logueada (quién aprobó, cuándo, cuántos archivos, tamaño total liberado) para trazabilidad y auditoría posterior.

### 3.8 Fase 5 — Prevención (para que la lista deje de crecer)

- Corregir los `DeleteAsync` sin borrado de archivo ya señalados en `conventions/backend/document-read-write-pattern.md` (caso conocido: Machinery) y auditar el resto de los 108 puntos de uso contra el checklist del patrón.
- Corregir los dos hallazgos de §2.2 (`SendEmailAppService`, `BudgetProposalItemSupportService`) para que dejen de generar divergencia disco/BD hacia adelante.
- Evaluar agregar un gate de CI (el repo ya tiene infraestructura de "ratchet gates", ver sesiones previas de gobernanza) que detecte en PRs nuevos: (a) rutas físicas hardcodeadas fuera de `Shared/Services`, (b) campos de BD que guardan `Path.Combine(...)` completo en vez de solo `fileName`.
- A futuro (fuera del alcance de este plan): mover el borrado de archivo a la misma transacción lógica que el borrado de entidad (patrón Outbox/Saga) para que disco y BD no puedan divergir estructuralmente.

### 3.9 Salvaguardas explícitas antes de ejecutar cualquier fase

- Nunca correr el escaneo/cuarentena contra producción sin antes probarlo en modo solo-lectura (o contra una réplica/backup reciente de disco+BD). Un porcentaje de "huérfanos" anormalmente alto en la primera corrida indica un catálogo de Fase 0 incompleto, no necesariamente huérfanos reales.
- Requiere backup/snapshot de disco antes de la primera cuarentena real sobre datos vivos.
- Cada fase que mueve o borra archivos requiere aprobación explícita — no se automatiza sin supervisión.

---

## 4. Próximos pasos sugeridos (pendientes de decisión, no ejecutados)

1. **Decisión Tech Lead:** ¿se aprueba una migración de nomenclatura (kebab-case en todo `FileDirectories`, mover literales sueltos a constantes) o se congela como "deuda conocida" igual que otras reglas de este repo (ver `[[rule-no-nullable-properties]]`, `[[decision-automapper-solo-proyecciones-20260924]]`)? Si se aprueba, es un cambio sensible: cualquier renombre de carpeta física rompe rutas ya guardadas en disco para clientes existentes — requeriría script de migración física + de BD, no solo renombrar la constante.
2. Encargar la construcción del catálogo formal de Fase 0 (§3.3) como tarea propia, con su propio plan de agente según el estándar `PLAN_AGENT_INSTRUCTIONS.md` del repo.
3. Corregir los dos bypass concretos de §2.2 como fix aislado y de bajo riesgo, independiente de si se aprueba o no la migración de nomenclatura completa.
