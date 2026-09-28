# TICKET FH-03 — Documentar regla: prohibido `DateTime.Now`/`DateTime.Today` en backend

Trabajas en el repositorio LuxuryApp. Antes de escribir, lee `CONVENTIONS.md` y
`conventions/backend/backend-rules.md` completo (es corto) para calibrar el
estilo exacto que debes seguir — este ticket **solo agrega documentación**, no toca código C# ni
`api/`.

## Contexto

FH-01/FH-01b/FH-01c y FH-14 corrigieron 13 + 15 = 28 archivos con `DateTime.Now`/`DateTime.Today`
en `LuxuryApp.Application`. Uno de esos arreglos (FH-01) introdujo una regresión real al aplicarse
mal en un caso (corregida en FH-01b) — evidencia de que sin una regla explícita, el patrón se
reintroduce con facilidad, incluso por descuido de quien está corrigiendo el propio antipatrón.
`CONVENTIONS.md` no documenta hoy ninguna regla sobre manejo de fecha/hora en backend
(confirmado: `grep -i "datetime\|fecha" conventions/backend/backend-rules.md`
no devuelve nada).

No se pide en este ticket construir un analizador Roslyn ni un hook de Git nuevo — el patrón
existente en este mismo archivo (la regla de `[FromForm]`/415) documenta sus reglas con un bloque
`grep` de verificación manual, sin automatización en CI; este ticket sigue exactamente ese mismo
patrón, no uno nuevo.

## Tarea 1 — Nueva sección en `backend-rules.md`

Archivo: `conventions/backend/backend-rules.md`

Insértala **inmediatamente después** de la sección `## 🔴 REGLA CRÍTICA: DisplayName en Español
(Listados de Enums)` (línea ~219-277) y **antes** de `## Prohibiciones clave` (línea ~304) — mismo
lugar donde van las demás reglas críticas del archivo, en el mismo nivel de encabezado (`##`).

Contenido exacto a insertar:

````markdown
## 🔴 REGLA CRÍTICA: Fechas y horas — nunca `DateTime.Now` ni `DateTime.Today`

**REGLA EXPLÍCITA:** Ningún servicio, endpoint, job o DTO de `LuxuryApp.Application`/`LuxuryApp.Api`
usa `DateTime.Now` ni `DateTime.Today`. Ambos dependen del reloj y la zona horaria del **servidor**,
no del negocio. Usa siempre uno de estos dos, según lo que el campo realmente representa:

- **Instante técnico** (auditoría, timestamp de evento, comparación contra otro campo UTC,
  sincronización con sistema externo, nombre de archivo, log): `DateTime.UtcNow`.
- **"Hoy"/"ahora" de negocio en México** (fecha de solicitud, fecha de corte de un reporte, quincena
  de nómina, vencimiento de contrato, agenda, cualquier comparación contra un valor capturado del
  usuario como fecha/hora de pared): `LuxuryApp.Shared.Extensions.DateTimeExtension.GetMexicoTime()`
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
````

## Tarea 2 — Línea en "Prohibiciones clave"

En la misma sección `## Prohibiciones clave` (línea ~304-310), agrega una línea nueva siguiendo el
mismo formato que la de SelectItem (bold + 🔴):

```markdown
- **🔴 NO usar `DateTime.Now` ni `DateTime.Today` en backend (usar `DateTime.UtcNow` o `DateTimeExtension.GetMexicoTime()`/`GetMexicoDateOnly()` según corresponda — ver regla crítica de Fechas y horas)**.
```

## Lo que NO debes hacer

- No toques ningún archivo `.cs` — este ticket es 100% documentación.
- No crees ningún script nuevo (`scripts/*.mjs`) ni toques `.githooks/` — no es el alcance de este
  ticket, sigue el patrón existente de verificación manual documentada, no automatización nueva.
- No renumeres ni reordenes ninguna otra sección del archivo.
- No toques `CONVENTIONS.md` — ya referencia `backend-rules.md` en su §4.1, no hace falta agregar
  nada ahí.

## Verificación obligatoria

```bash
grep -n "DateTime.Now\|DateTime.Today" conventions/backend/backend-rules.md
# Debe aparecer únicamente dentro de la nueva sección agregada (ejemplos ✅/❌ y el caso real)

node scripts/audit-conventions.mjs
```

## Criterio de PASO

- La nueva sección `## 🔴 REGLA CRÍTICA: Fechas y horas...` existe, en la ubicación indicada, con
  el contenido exacto de la Tarea 1.
- La línea nueva existe en `## Prohibiciones clave`.
- `audit-conventions.mjs` no sube su conteo de errores respecto al baseline (10, a la fecha de este
  ticket).
- Ningún archivo `.cs` fue modificado.

## Reporte de finalización

1. Diff exacto del archivo (`backend-rules.md`).
2. Salida literal de los 2 comandos de verificación.
3. Decisiones que tomaste por tu cuenta y por qué (si alguna).

No avances a ningún otro ticket. Espera la auditoría.
