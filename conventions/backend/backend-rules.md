# Backend Rules

**Ultima revision:** 2026-09-24 (regla crítica AutoMapper: permitido en memoria, prohibido `ProjectTo`). Anterior 2026-07-30.

## Alcance

Aplica a backend .NET, endpoints, DTOs, servicios, SignalR, emails, datos,
seguridad, carpetas, archivos y namespaces.

## Reglas obligatorias

- Validar primero el modulo maestro correcto: `AdminLuxuryApp`, `ContabilidadLuxuryApp`, etc., incluso para documentacion, auditoria y remediacion.
- Shared no se toca sin analisis de impacto y aprobacion explicita.
- Rutas publicas en `kebab-case`, con contrato consistente frente al frontend.
- No cambiar rutas publicas ni contratos serializados sin instruccion explicita.
- Debe existir catalogo oficial de servicios genericos por caso de uso.
- Si algo incumple convencion pero tocarlo rompe otros modulos, se reporta y se propone plan de migracion.
- Los namespaces backend siguen exactamente la ruta física de carpetas sin prefijo de proyecto (política única, verificada contra código real en `AdminLuxuryApp` y `SharedLuxuryApp`). Ver `CONVENTIONS_FOLDER_API.MD` §2. Ya no existe una carpeta física `Modules/` intermedia (eliminada 2026-09-11); el bug histórico de `ReclutamientoLuxuryApp/Candidates/` con segmento residual `NewFolder` en el namespace también se corrigió en ese movimiento.

## Bloques que backend debe cubrir siempre

- arquitectura y estilo de endpoints
- DTOs y contratos
- servicios de aplicacion
- servicios genericos
- acceso a datos y consultas
- paginacion, filtros y sorting
- seguridad y autorizacion
- logging y manejo de errores
- notificaciones con SignalR
- envio de emails
- ubicacion de carpetas y archivos
- namespaces
- testing y validaciones minimas

## Reglas sobre contratos y rutas

- Las rutas publicas deben ser semanticas, en minusculas y `kebab-case`.
- El frontend y backend deben coincidir caracter por caracter en el contrato de ruta que exponen/consumen.
- No se permite usar nombres tecnicos, historicos o accidentales en la URL publica si no forman parte de un contrato aprobado.
- Si una ruta existente debe corregirse pero tiene consumidores activos, el cambio pasa a plan de migracion; no se rompe directo.

## 🔴 REGLA CRÍTICA: Multipart/form-data presupone [FromForm] (HTTP 415)

**REGLA EXPLÍCITA:** Todo endpoint Minimal API cuyo DTO reciba archivos
(`IFormFile`) debe declarar `[FromForm]` en el parámetro DTO. Sin `[FromForm]`,
ASP.NET Core asume cuerpo JSON y **responde HTTP 415 Unsupported Media Type**
antes de ejecutar cualquier lógica de negocio.

```csharp
// ✅ CORRECTO (patrón vigente en TasksEndpoints)
group.MapPost("", async ([FromForm] RecepcionPipaAguaAddDTO DTO, IRecepcionPipasAguaAppService appService) =>
    TypedResults.Ok(await appService.AddAsync(DTO)))
    .DisableAntiforgery();

// ❌ PROHIBIDO (causa 415 cuando el frontend envía FormData)
group.MapPost("", async (RecepcionPipaAguaAddDTO DTO, IRecepcionPipasAguaAppService appService) => ...);
```

**Reglas derivadas:**
- `[FromBody]` es solo para JSON. `[FromForm]` es para `multipart/form-data`.
  Si falta el atributo y llega multipart → 415.
- En endpoints multipart usar `.DisableAntiforgery()` (patrón vigente en
  `OperationsLuxuryApp/Tasks/Tasks/EndPoints/TasksEndpoints.cs`).
- El frontend **nunca** fija `Content-Type` manual al enviar `FormData`: el
  navegador agrega `multipart/form-data; boundary=...` automáticamente. Fijarlo
  a mano rompe el boundary.
- Las imágenes se preparan en cliente con `ImageProcessingService`
  (HEIC→JPEG, resize, compresión); el interceptor `imageFormDataInterceptor`
  cubre transversalmente toda carga multipart. El backend solo acepta
  jpg/jpeg/png/webp ≤5MB (`ImageStorageService`).

**Diagnóstico (caso real 2026-08-12, módulo RecepcionPipasAgua):**
- Carga de fotos fallando en form. DevTools mostraba la petición **bien
  formada**: `content-type: multipart/form-data; boundary=...` con
  `content-length` > 0 y los archivos adjuntos presentes.
- Respuesta: `415 Unsupported Media Type` con `content-length: 0`.
- Causa raíz: el endpoint `POST /api/recepcion-pipas-agua` no tenía
  `[FromForm]`. NO era falla del frontend.

**Validación en Auditoría:**

```bash
# Endpoints MapPost/MapPut con DTO que contiene IFormFile
# deben tener [FromForm]. Grep manual por endpoint:
grep -rn "MapPost(\|MapPut(" {backend_path}/**/EndPoints/*.cs | grep -iE "IFormFile|DTO"
# En cada coincidencia verificar que el parámetro DTO lleva [FromForm].

# Elemento de diagnóstico en vivo:
# 415 con content-length 0 en post/patch/multipart → endpoint sin [FromForm].
```

## Regla sobre DTOs, interfaces y shared

- Ningun DTO shared, interface shared, helper compartido, servicio base o contrato transversal se modifica sin analisis de impacto y aprobacion explicita.
- Si un cambio backend requiere tocar `api/LuxuryApp.Application/Shared/` o algun contrato transversal, debe documentarse el impacto y proponerse el plan antes de ejecutar.
- Todo DTO local del modulo que declare propiedad `Id` debe heredar de `GuidIdEntityDTO`.

### 🔴 REGLA CRÍTICA: Un Archivo = Un DTO (1:1 Obligatorio)

**REGLA EXPLÍCITA:** Los DTOs locales del módulo deben estar en archivos individuales. **1 archivo = 1 DTO. Nunca múltiples DTOs en un mismo archivo.**

**MAL (PROHIBIDO):**
```csharp
// ❌ ReportResultItemDTO.cs (contiene múltiples DTOs)
public record ReportResultItemDTO { ... }
public record ReportImageDTO { ... }        // ← PROHIBIDO: 2 DTOs
public record ReportFilterDTO { ... }       // ← PROHIBIDO: 3 DTOs

// Estructura de carpeta:
DTOs/
  └── ReportResultItemDTO.cs (contiene ReportResultItemDTO + ReportImageDTO + ReportFilterDTO)
```

**BIEN (OBLIGATORIO):**
```csharp
// ✅ DTOs/ReportResultItemDTO.cs
public record ReportResultItemDTO { ... }

// ✅ DTOs/ReportImageDTO.cs
public record ReportImageDTO { ... }

// ✅ DTOs/ReportFilterDTO.cs
public record ReportFilterDTO { ... }

// Estructura de carpeta:
DTOs/
  ├── ReportResultItemDTO.cs
  ├── ReportImageDTO.cs
  └── ReportFilterDTO.cs
```

**Por qué:**
- Facilita navegación (1 archivo = 1 DTO, no buscar adentro)
- Reduce conflictos en PR (cambios a DTO X no tocan archivo de DTO Y)
- Sigue patrón de Single Responsibility
- Indexación automática en IDEs
- Auditoría clara: grep `ReportImageDTO` → sabe dónde está

**Validación en Auditoría:**
```bash
# Buscar archivos DTOs con múltiples records/classes
find {backend_path}/DTOs -name "*.cs" -exec grep -l "^public record\|^public class" {} \; | while read f; do
  count=$(grep -c "^public record\|^public class" "$f")
  if [ $count -gt 1 ]; then
    echo "❌ $f tiene $count DTOs (INCUMPLIMIENTO)"
  fi
done
```

---

- Si un DTO no declara `Id`, no se le fuerza herencia por reflejo; primero se valida su naturaleza contractual.
- No se permiten `ApiResponseDTO<object>`, `List<object>`, respuestas anonimas ni
  retorno directo de entidades de persistencia en contratos publicos del modulo
  si el caso requiere DTO explicito.
- Esta regla aplica tanto al servicio principal como a subservicios internos del
  modulo, por ejemplo `Detalle`, `CotizacionProveedor` u otros equivalentes.
- La capa de servicios de aplicacion no debe devolver tipos HTTP o MVC como
  `ActionResult`, `IResult`, `Results` u otros equivalentes; esos tipos solo
  pertenecen a endpoints o controladores.
- Si una accion de negocio crea o actualiza multiples entidades, documentos o
  archivos, debe existir transaccion explicita o estrategia de compensacion
  documentada.
- No se deben hardcodear GUIDs o defaults de catalogos sensibles dentro de
  servicios de aplicacion si el valor puede resolverse desde catalogo o
  configuracion oficial.

## Reglas sobre SignalR y email

- SignalR y email se consideran casos de infraestructura transversal y deben pasar por catalogos y patrones oficiales antes de crear nuevos servicios.
- No crear hubs, notificaciones o servicios de correo paralelos por intuicion cuando el caso puede entrar en el catalogo comun.

## Regla sobre features disponibles

- Antes de usar una libreria o feature backend, validar el catalogo oficial de disponibilidades.
- Si la dependencia no esta aprobada, no se usa hasta que el Tech Lead lo valide y quede registrada en el sistema oficial.

## 🔴 REGLA CRÍTICA: SELECTs de Enums y Valores (Centralización)

**REGLA EXPLÍCITA:** Todos los SELECTs de enums y catálogos deben venir de **un único endpoint centralizado**, NUNCA crear endpoints selectitem por módulo.

**Autoridad única:**
```
✅ ÚNICO ENDPOINT CORRECTO:
SharedLuxuryApp/Endpoints/SelectItemEnumEndPoints.cs
  └─ GET /api/select-item-enum/{enum-name}?defaultOption

❌ PROHIBIDO (VIOLACIÓN CRÍTICA):
- Crear SelectItem endpoints en módulos individuales
- Crear SelectItemDTO en módulos individuales
- Hacer queries directas a enums/catálogos desde frontend
```

**Flujo obligatorio:**

```
Frontend necesita SELECT (ejemplo: SeverityLevel)
  ↓
Llama ÚNICO endpoint: GET /api/select-item-enum/severity-level
  ↓
SharedLuxuryApp/SelectItemEnumEndPoints mapea la ruta
  ↓
Retorna SelectItemDTO<int> estándar con caché 24h
  ↓
Frontend usa para llenar select/dropdown
```

**Caché centralizado:**

```csharp
// TTL: 24 horas (enums no cambian en runtime)
private static readonly TimeSpan TtlEnum = TimeSpan.FromHours(24);

// Cacheado automáticamente por SelectItemEnumEndPoints
// Frontend obtiene respuesta caché en <10ms
```

### 🔴 REGLA CRÍTICA: DisplayName en Español (Listados de Enums)

**OBLIGATORIO:** Cuando se arma un listado de enum values para devolver al frontend, SIEMPRE usar el `DisplayName` (en español), NUNCA el raw enum name.

```csharp
// ❌ PROHIBIDO: Devolver raw enum names
public record SelectItemDTO<T>
{
    public T Id { get; init; }
    public string Value { get; init; }   // "CRITICAL"
    public string Text { get; init; }    // ← INCORRECTO: "CRITICAL" (raw)
}

// ✅ OBLIGATORIO: Devolver DisplayName
public record SelectItemDTO<T>
{
    public T Id { get; init; }
    public string Value { get; init; }   // "CRITICAL"
    public string Text { get; init; }    // ← CORRECTO: "Crítica" (DisplayName en español)
}
```

**Cómo implementar:**

```csharp
// 1. Enum DEBE tener [Display(Name="...")]
public enum SeverityLevel
{
    [Display(Name = "Crítica")]
    CRITICAL = 1,
    
    [Display(Name = "Alta")]
    HIGH = 2,
    
    [Display(Name = "Media")]
    MEDIUM = 3,
    
    [Display(Name = "Baja")]
    LOW = 4
}

// 2. Obtener DisplayName en SelectItemEnumEndPoints
var items = Enum.GetValues(typeof(SeverityLevel))
    .Cast<SeverityLevel>()
    .Select(e => new SelectItemDTO<int>
    {
        Id = (int)e,
        Value = e.ToString(),                  // "CRITICAL"
        Text = GetDisplayName(e)                // "Crítica" ← DisplayName
    });

// ✅ USAR EXTENSIÓN (obligatorio, no duplicar lógica):
// Ubicación: api/LuxuryApp.Application/Shared/Extensions/EnumExtensions.cs
// Namespace: Shared.Extensions
inspection.Frequency.GetDisplayName()  // ← Método de extensión
```

**Validación en Auditoría:**

```bash
# ✅ Verificar que TODOS los enums tienen [Display(Name="...")]
find {backend_path} -name "*Enum.cs" -o -name "*Type.cs" | while read f; do
  if ! grep -q "\[Display(Name" "$f"; then
    echo "❌ CRÍTICA: $f sin DisplayName"
  fi
done

# Esperado: 0 resultados (sin errores)
```

---

**Validación en Auditoría:**

```bash
# ✅ Buscar que SOLO existe en SharedLuxuryApp
grep -r "SelectItemEnumEndPoints" {backend_path}
# Esperado: 1 resultado (en SharedLuxuryApp)

# ❌ Buscar violaciones (endpoints en módulos)
find {backend_path} -name "*SelectItem*.cs" -not -path "*/SharedLuxuryApp/*"
# Esperado: 0 resultados
```

---

## 🔴 REGLA CRÍTICA: elegir tipo de columna — `DateOnly`, `DateTime` o `TimeOnly`

**REGLA EXPLÍCITA:** al modelar un campo de fecha/hora NUEVO en una entidad, elige el tipo según lo
que el campo representa semánticamente — no uses `DateTime` por default:

- **`DateOnly`** — el campo es un día calendario, sin hora relevante para el negocio: fecha de
  nacimiento, fecha de admisión, vencimiento de contrato, día de un permiso/vacación, fecha de
  registro de una solicitud. La inmensa mayoría de los campos "Fecha de X" de este proyecto caen
  aquí.
- **`DateTime`** — el campo es un instante específico donde la hora importa para el negocio o es un
  timestamp técnico: fecha+hora de una cita/entrevista agendada, `CreatedAt`/`UpdatedAt` de
  auditoría, hora de cierre de un ticket (la hora exacta de cierre sí es dato de negocio, no solo el
  día).
- **`TimeOnly`** — el campo es una hora del día sin fecha asociada: horario de apertura, hora límite
  diaria recurrente.

```csharp
// ✅ CORRECTO — día calendario, sin componente de hora relevante
public DateOnly BirthDate { get; set; }
public DateOnly? ContractEndDate { get; set; }

// ✅ CORRECTO — instante donde la hora importa para el negocio
public DateTime ScheduledInterviewAt { get; set; }
public DateTime ClosedAt { get; set; }  // la hora de cierre es dato de negocio, no solo el día

// ❌ EVITAR por default — DateTime para algo que es puramente un día calendario
public DateTime BirthDate { get; set; }  // arrastra hora/TZ que nadie necesita ni debe interpretar
```

**Por qué importa:** un campo `DateTime` que en realidad representa un día calendario obliga a todo
el pipeline (backend, DTO, frontend) a lidiar con ambigüedad de zona horaria para un dato que nunca
tuvo hora real — es la causa raíz del bug de "un día menos" documentado en
`docs/SharedLuxuryApp/FechasHoras/20260826-auditoria-shared-fechas-horas.md`. Modelar
`DateOnly` desde el inicio elimina la ambigüedad en el origen.

**Migración de un campo `DateTime` existente a `DateOnly`:** NUNCA `RenameColumn`/`AlterColumn`
directo (destructivo, puede perder datos con formato inesperado). Sigue la estrategia de 5 pasos
documentada en `docs/SharedLuxuryApp/FechasHoras/20260826-plan-shared-fechas-horas.md` §5.4 y ejecutada en los tickets
FH-09a–d: **(1) columna nueva `DateOnly?` aditiva** con el nombre `<CampoOriginal>Day` (p.ej.
`RequestDate` → `RequestDay`) → **(2) backfill** vía SQL `AT TIME ZONE 'UTC' AT TIME ZONE 'Central
Standard Time (Mexico)'` para extraer el día calendario correcto de México desde el `DateTime` UTC
existente → **(3) validación** del backfill contra una muestra real → **(4) cutover** de
servicios/DTOs para leer/escribir la columna nueva → **(5) limpieza** (columna vieja se retira solo
después de un período de validación en producción). No saltar pasos ni fusionar (2) y (4) en el
mismo ticket.

## 🔴 REGLA CRÍTICA: Fechas y horas — nunca `DateTime.Now` ni `DateTime.Today`

**REGLA EXPLÍCITA:** Ningún servicio, endpoint, job o DTO de `LuxuryApp.Application`/`LuxuryApp.Api`
usa `DateTime.Now` ni `DateTime.Today`. Ambos dependen del reloj y la zona horaria del **servidor**,
no del negocio. Usa siempre uno de estos dos, según lo que el campo realmente representa:

- **Instante técnico** (auditoría, timestamp de evento, comparación contra otro campo UTC,
  sincronización con sistema externo, nombre de archivo, log): `DateTime.UtcNow`.
- **"Hoy"/"ahora" de negocio en México** (fecha de solicitud, fecha de corte de un reporte, quincena
  de nómina, vencimiento de contrato, agenda, cualquier comparación contra un valor capturado del
  usuario como fecha/hora de pared): `Shared.Extensions.DateTimeExtension.GetMexicoTime()`
  o `DateTimeExtension.GetMexicoDateOnly()`.

```csharp
// ✅ CORRECTO — instante técnico, comparado contra un campo IAuditable (UTC real)
var readCutoff = DateTime.UtcNow.AddDays(-readDays);
var toDelete = await dbContext.NotificationUser.Where(n => n.CreatedAt < readCutoff)...

// ✅ CORRECTO — "hoy" de negocio en México, campo DateOnly
RequestDate = DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly()),

// ✅ CORRECTO — comparación contra un valor de pared capturado del usuario (DateOnly + TimeOnly)
var scheduledDateTime = request.ScheduledDate.Value.ToDateTime(request.ScheduledTime.Value);
if (scheduledDateTime < DateTimeExtension.GetMexicoTime().AddMinutes(-30))
    throw new BusinessException(...);

// ❌ PROHIBIDO — depende del reloj/TZ del servidor
var today = DateTime.Today;
FechaCorte = DateTime.Now.ToString("dd/MM/yyyy"),
if (scheduledDateTime < DateTime.UtcNow.AddMinutes(-30))   // ← UTC tampoco es correcto aquí:
                                                            //   scheduledDateTime es hora de pared
                                                            //   de México, no un instante UTC
```

**Reglas derivadas:**
- `DateTime.UtcNow` **no es automáticamente "el fix correcto"** solo por no ser `DateTime.Now`.
  Si el valor se compara contra algo que el usuario capturó como fecha/hora de pared (típicamente
  construido con `DateOnly.ToDateTime(TimeOnly)`, `Kind = Unspecified`), usar `UtcNow` produce un
  desfase de 6 horas igual de real que usar la hora del servidor — es el mismo tipo de bug, en
  dirección contraria.
- `DateOnly.FromDateTime(DateTime.UtcNow)` para poblar un campo que representa el día calendario de
  México **tampoco es correcto**: da el día UTC, no el de México — son distintos durante las
  18:00–23:59 hora de México todos los días. Usa `DateOnly.FromDateTime(DateTimeExtension.GetMexicoDateOnly())`.
- Al parsear un string de fecha/hora (`.Parse(`), usa siempre `.ParseExact(valor, formato,
  CultureInfo.InvariantCulture)` — nunca `.Parse(` a secas ni dejes que el fallback de un valor
  faltante use la función equivocada (ver caso real abajo).

**Diagnóstico (caso real 2026-08-26, `CandidateProcessAppService.cs`):**
- Se corrigió mecánicamente `DateTime.Now` → `DateTime.UtcNow` en una comparación de agendado de
  entrevistas (`scheduledDateTime < DateTime.Now.AddMinutes(-30)`).
- `scheduledDateTime` se construye con `request.ScheduledDate.Value.ToDateTime(request.ScheduledTime.Value)`
  — hora de pared de México capturada del formulario, no un instante UTC.
- El "fix" introdujo una regresión: la regla de negocio ("no agendar con menos de 30 min de
  antelación") quedó mal en cualquier configuración de servidor, no solo en la que tenía el bug
  original. Corregido reemplazando por `DateTimeExtension.GetMexicoTime()`.
- Lección: **corregir `DateTime.Now` sin preguntar "¿contra qué se compara este valor?" puede
  introducir un bug distinto**, no solo dejar el original sin arreglar.

**Validación en Auditoría:**

```bash
# Cero DateTime.Now / DateTime.Today en el código de backend
grep -rn "DateTime\.Now\b\|DateTime\.Today\b" api/LuxuryApp.Application/ api/LuxuryApp.Api/ \
  --include="*.cs"
# Esperado: 0 resultados

# Cero .Parse( de fecha/hora sin cultura explícita
grep -rn "DateOnly\.Parse(\|DateTime\.Parse(\|TimeOnly\.Parse(" api/LuxuryApp.Application/ \
  --include="*.cs"
# Esperado: 0 resultados (todo debe ser .ParseExact(..., CultureInfo.InvariantCulture))
```

## 🔴 REGLA CRÍTICA: PROHIBIDO `?` (nullable) en propiedades de DTOs/Entities

- El proyecto está configurado con `#nullable disable` (deshabilitado globalmente).
- ❌ PROHIBIDO: agregar `?` en propiedades de DTOs, Entities, records o cualquier modelo.
  - ❌ `public string? ExperienceSummary { get; set; }`
  - ✅ `public string ExperienceSummary { get; set; }`
- Si una propiedad puede ser null, manejar el null explícitamente en la lógica de negocio, NO con anotación de tipo.
- **Por qué:** `#nullable disable` previene las anotaciones de null-safety; agregar `?` produce el warning CS8632 (hay 79+ en el proyecto).
- **Impacto auditoría:** propiedades con `?` innecesario en DTOs/Entities son hallazgo CRÍTICO.
- **Gate (2026-09-25):** `api/scripts/audit-conventions-backend.mjs`, regla `nullableRefProps` (ratchet: la deuda actual, 42 propiedades en 13 archivos, no puede crecer). Solo mide tipos de **referencia** (`string?`, `IFormFile?`, `List<>?`, `*DTO?`).
- **⚠️ Alcance de la regla, pendiente de decisión del Tech Lead (verificado 2026-09-25):**
  - **`Guid?`, `DateTime?`, `int?` y enums nullable no producen CS8632**: son `Nullable<T>`, no anotaciones de referencia. En EF definen si la columna admite NULL; quitar el `?` cambiaría el esquema (columna NOT NULL, migración y valores `Guid.Empty` en FKs opcionales). Hoy hay ~1232 así en DTOs/Entities y el gate solo los reporta como informativos (`nullableValueProps`); no se cuentan como violación hasta que se decida.
  - **El "79+ warnings CS8632" ya no es real.** Un `dotnet build` de `LuxuryApp.Application` (2026-09-25) da 0 CS8632. Los 13 archivos con `string?`/`IFormFile?` declaran `#nullable enable` por archivo, así que el compilador no avisa. Es decir, la advertencia se resolvió activando `#nullable enable` en vez de quitando el `?`. Decidir si eso es aceptable, o si `#nullable enable` local también queda prohibido; mientras tanto el gate los cuenta como violación por la redacción literal de la regla.

## 🔴 REGLA CRÍTICA: Constructores primarios (C# 12) en Services/AppServices

- Toda clase de servicio (`Service`, `AppService`) inyecta sus dependencias por **constructor primario**, no por constructor tradicional con campos `private readonly`.
  - ❌ PROHIBIDO: `private readonly IFoo _foo;` + `public MyService(IFoo foo) { _foo = foo; }`.
  - ✅ CORRECTO: `public class CandidateAppService(ApplicationDbContext dbContext, IMapper mapper, ILogger<CandidateAppService> logger) : ICandidateAppService { ... }`, referenciando los parámetros por su nombre (`dbContext`, `mapper`, `logger`) directamente en el cuerpo de la clase.
- **Impacto auditoría:** constructores tradicionales con campos redundantes son hallazgo de consistencia (no crítico); se corrige en el mismo PR si se toca el archivo.

## 🔴 REGLA CRÍTICA: AutoMapper — permitido en memoria, prohibido en consultas

Decisión del dueño del módulo / Tech Lead, 2026-09-24 (cierra PRIM-024 de `docs/RecruitmentLuxuryApp/WorkPositions/20260924-auditoria-reclutamiento-work-positions.md`). Antes se leía como "AutoMapper prohibido" sin matiz; la regla original siempre fue "prohibido AutoMapper **en consultas**".

- ✅ **Permitido:** `IMapper.Map<...>()` y `Profile` para mapear objetos **ya materializados en memoria** (entidad cargada → DTO, DTO → entidad al crear/actualizar).
- ❌ **Prohibido:** `ProjectTo<>()` y cualquier proyección de AutoMapper sobre un `IQueryable`. Las consultas a BD proyectan con `.Select(x => new XDTO { ... })` manual.
- **Por qué:** con `.Select()` manual el SQL generado y las columnas leídas son explícitos y revisables; con `ProjectTo` dependen de un `Profile` que no falla en `dotnet build` y puede dejar propiedades en su valor por defecto en silencio (caso FH-04b: `CreateMap` dejó `DiagramDrawDTO.UpdateAt` en `0001-01-01`). El motivo "incompatible con AOT" **no aplica**: ningún csproj usa `PublishAot`/`PublishTrimmed`.
- **Impacto auditoría:** cada `ProjectTo<` es hallazgo 🔴 CRÍTICO. `IMapper`/`Profile` por sí solos **no** son hallazgo. Gate: `grep -rn "\.ProjectTo<" api/LuxuryApp.Application --include="*.cs"` → esperado 0.
- **Deuda conocida a 2026-09-24:** 10 usos de `ProjectTo<` en 5 AppServices (`ApplicationRoleAppService`, `TemplateEvaluationAppService`, `AlmacenAppService`, `TaskInstanceAppService`, `TaskTemplateAppService`). Se migran a `.Select()` al tocar el archivo o en ticket dedicado; no se agregan usos nuevos.
- Prohibiciones de MediatR, Dapper y reflexión dinámica no cambian (ver `operations/available-features.md`).

## Prohibiciones clave

- No inventar dependencias ni patterns fuera del stack oficial.
- **🔴 NO usar `ProjectTo<>` / proyección de AutoMapper sobre `IQueryable` (usar `.Select()` manual; `IMapper.Map` en memoria sí se permite)**.
- **🔴 NO usar `?` en propiedades de DTOs/Entities (proyecto con `#nullable disable`)**.
- No inyectar dependencias en Services/AppServices con campos `private readonly` + constructor tradicional (usar constructor primario).
- No romper contratos serializados.
- No mover codigo existente por iniciativa propia.
- No meter logica de negocio fuerte dentro de endpoints.
- **🔴 NO crear endpoints SelectItem en módulos (VIOLACIÓN CRÍTICA)**.
- **🔴 NO usar `DateTime.Now` ni `DateTime.Today` en backend (usar `DateTime.UtcNow` o `DateTimeExtension.GetMexicoTime()`/`GetMexicoDateOnly()` según corresponda — ver regla crítica de Fechas y horas)**.

## Referencias

- [Backend Module Structure](./backend-module-structure.md)
- Backend Namespaces — ver [`CONVENTIONS_FOLDER_API.MD`](../CONVENTIONS_FOLDER_API.MD) §2 (documento `backend-namespaces.md` eliminado 2026-09-09: proponía una política dual falsa, no coincidía con código real)
- [Backend Prohibitions](./backend-prohibitions.md)
- [Backend Generic Services Catalog](./backend-generic-services-catalog.md)
- Backend Shared Services Catalog — ver [`CONVENTIONS_FOLDER_API.MD`](../CONVENTIONS_FOLDER_API.MD) §12 (documento `backend-shared-services-catalog.md` eliminado 2026-09-09: asumía proyectos `LuxuryApp.Shared`/`LuxuryApp.Providers` separados que ya no existen)
- [Select Items Centralization Rule](./select-items-centralization-rule.md) — **Protocolo completo para enums centralizados**
- [Enum Display Name Extension](./enum-display-name-extension.md) — **Extensión GetDisplayName() para obtener DisplayName en español**
- [Available Features](../operations/available-features.md)
- [Implementation Checklist](../operations/implementation-checklist.md)


