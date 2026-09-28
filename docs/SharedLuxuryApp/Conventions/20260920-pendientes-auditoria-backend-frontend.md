# 20260920 - Pendientes de Auditoría Backend + Frontend vs CONVENTIONS.md

> **Estado:** Para revisión y autorización uno por uno
> **Origen:** Auditoría completa código real vs convenciones documentadas
> **Fecha:** 2026-09-20

---

## 📋 Índice de Decisiones Pendientes

### A. Inconsistencias Menores (Reglas ya definidas, solo hay que aplicarlas)

### B. Dudas de Arquitectura (No hay regla, hay que decidir)

### C. Documentos Nuevos Requeridos (Prioridad Alta/Media/Baja)

---

## A. INCONSISTENCIAS MENORES — Reglas ya definidas, aplicar y listo

| #   | Inconsistencia                       | Regla Definida                                                   | Acción                                   |
| --- | ------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------- |
| A1  | `SelectItemBoolDTO` existe en código | **OBSOLETO** → Usar `SelectItemDTO<bool?>`                       | Buscar y reemplazar todos los usos       |
| A2  | `SelectItemDTO<int?>` en enums       | **SOLO** para enums con `defaultOption` (opción "Selecciona...") | Documentar en `select-item-dto-types.md` |
| A3  | Comentarios `// @dead?` sin estándar | Definir estándar único                                           | Ver sección B1                           |

---

## B. DUDAS DE ARQUITECTURA — No hay regla, hay que decidir

### B1. Estándar para marcar endpoints "muertos" (`@dead?`)

**Contexto:** En `SelectItemEndPoints.cs` hay 23 endpoints marcados como candidatos a eliminación:

```csharp
// @dead? no frontend consumer
g.MapGet("boolean-options", ...);
// @dead? no frontend consumer
g.MapGet("customers-all", ...);
// @dead? no frontend consumer
g.MapGet("inspection-review-catalogs", ...);
```

**Problema:** A veces es `// @dead?`, a veces `// @dead? no frontend consumer`, a veces solo `// @dead?`

**Opciones:**
| Opción | Formato | Ventaja |
|--------|---------|---------|
| **1. Estricto** | `// @DEAD: sin consumidor frontend desde YYYY-MM-DD` | Trazable, buscaable, accionable |
| **2. Con razón** | `// @DEAD: motivo (ej. "reemplazado por X", "legacy MVC")` | Contexto para decidir |
| **3. Con dueño** | `// @DEAD: motivo @autor YYYY-MM-DD` | Responsable claro |

**Mi recomendación:** **Opción 2** — `// @DEAD: sin consumidor frontend` (simple, suficiente)

**¿Autorizas estándar único?**

---

### B2. Dos patrones de SelectItems: ¿Cuál es el estándar?

**Patrón A - `SelectItemEndPoints` (Datos dinámicos):**

```csharp
// Usa ISelectItemAppService (consulta BD + caché)
g.MapGet("banks", async (ISelectItemAppService s) =>
    TypedResults.Ok(await s.SelectItemBankAsync()));
```

**Patrón B - `SelectItemEnumEndPoints` (Enums estáticos):**

```csharp
// Usa IMemoryCache directo (sin BD, solo memoria)
g.MapGet("status/{defaultOption?}", (bool? defaultOption, IMemoryCache cache) =>
    GetEnumSelectList<Status>(cache, defaultOption));
```

**Diferencia clave:**
| | Patrón A (Dinámicos) | Patrón B (Enums) |
|--|---------------------|------------------|
| **Fuente** | Base de datos | Código (enum compilado) |
| **Caché** | `IMemoryCache` en Service (TTL 5-15 min) | `IMemoryCache` en Endpoint (TTL 24h) |
| **Cambia** | Cuando usuario agrega/edita registro | Solo al recompilar (nuevo valor enum) |
| **Ejemplos** | Bancos, Empleados, Propiedades | Status, TipoContrato, Prioridad |

**Regla implícita actual:** **Datos que cambian en runtime → Service + BD. Enum compilado → Endpoint directo + MemoryCache.**

**¿Confirmamos esta regla como oficial?**

---

### B3. `endpoints.ts` (raíz) vs `modulo.endpoints.ts`

**Contexto:** En `core/constants/endpoints/` hay:

```
endpoints.ts                    ← Archivo raíz (exporta TODO)
admin.endpoints.ts              ← Módulo admin
select-item.endpoints.ts        ← Módulo select-items
reclutamiento.endpoints.ts      ← Módulo reclutamiento
... 18 archivos más
```

**Código real `endpoints.ts`:**

```typescript
// Re-exporta TODO para compatibilidad legacy
export * from "./admin.endpoints";
export * from "./select-item.endpoints";
export * from "./reclutamiento.endpoints";
// ... etc
```

**Problema:** Código nuevo importa de `endpoints.ts` (legacy) en vez de del módulo específico.

**Opciones:**
| Opción | Qué hacer | Impacto |
|--------|-----------|---------|
| **1. Eliminar `endpoints.ts`** | Obligar imports directos: `@core/constants/endpoints/admin.endpoints` | Limpio, rompe imports legacy |
| **2. Mantener `endpoints.ts`** | Documentar: "Solo para migración legacy. Código nuevo: imports directos" | Transición suave |
| **3. Deprecar `endpoints.ts`** | Marcar `@deprecated`, dar 3 meses, luego eliminar | Balance |

**Mi recomendación:** **Opción 3** — Deprecar con `@deprecated`, timeline 3 meses.

**¿Autorizas?**

---

### B4. Límite de inyección de dependencias en Services

**Contexto:** `SelectItemAppService` inyecta **7 dependencias**:

```csharp
public class SelectItemAppService(
    ApplicationDbContext dbContext,           // 1. BD
    UserManager<ApplicationUser> UserManager, // 2. Users
    RoleManager<ApplicationRole> roleManager, // 3. Roles
    IFileReadPathService fileReadPathService, // 4. Archivos
    ICurrentUserService currentUserService,   // 5. Usuario actual
    IMemoryCache cache,                       // 6. Caché
    IAspelCobranzaHausAppService aspel...     // 7. Integración externa
) : ISelectItemAppService
```

**Pregunta:** ¿Hay límite? ¿Cuándo refactorizar a SubServices?

**Regla actual en CONVENTIONS.md §6bis:** "Máximo 300 líneas por clase → refactorizar en SubServices/Helpers"

**Pero no dice:** Límite de dependencias inyectadas.

**Estándares industria:**

- **5-7**: Aceptable (service coordinador)
- **8-10**: Olor a "God Service" → dividir
- **10+**: Refactor obligatorio

**Mi recomendación:** **Límite suave: 7 dependencias. Si pasa de 7 → evaluar SubServices.**

**¿Autorizas límite en 7?**

---

### B5. Clasificación de 70+ servicios en `core/services/`

**Contexto:** `angular-services-catalog.md` dice "70+ servicios compartidos, cuándo inyectar vs crear" pero **no lista cuáles son shared vs feature**.

**Ejemplos reales:**
| Servicio | ¿Shared o Feature? | Duda |
|----------|-------------------|------|
| `date.service.ts` | Shared (utils fechas) | Claro |
| `enum-select.service.ts` | Shared (SelectItems) | Claro |
| `dialog-handler.service.ts` | Shared (modales) | Claro |
| `orden-compra.service.ts` | **Feature** (compras) | ¿Por qué en core? |
| `solicitud-compra.service.ts` | **Feature** (compras) | ¿Por qué en core? |
| `cobranza.service.ts` | **Feature** (cobranza) | ¿Por qué en core? |
| `ticket-analysis.service.ts` | **Feature** (tickets) | ¿Por qué en core? |

**Propuesta de clasificación:**

```
core/services/ (SOLO shared genuinos)
├── date.service.ts              ✅ Shared
├── enum-select.service.ts       ✅ Shared
├── dialog-handler.service.ts    ✅ Shared
├── storage.service.ts           ✅ Shared
├── theme.service.ts             ✅ Shared
├── platform.service.ts          ✅ Shared
├── navigation.service.ts        ✅ Shared
├── loader.service.ts            ✅ Shared
├── console-logger.service.ts    ✅ Shared
├── connectivity.service.ts      ✅ Shared
├── refresh.service.ts           ✅ Shared (auth)
├── one-signal.service.ts        ✅ Shared (push)
├── signalr.service.ts           ✅ Shared (real-time)
├── geolocation.service.ts       ✅ Shared
├── file-explorer.service.ts     ✅ Shared
├── export.service.ts            ✅ Shared
├── print.service.ts             ✅ Shared
└── ... (utils genéricos)

modules/compras/services/        → mover orden-compra, solicitud-compra
modules/cobranza/services/       → mover cobranza services
modules/tickets/services/        → mover ticket-analysis
```

**¿Autorizas limpieza/movimiento de servicios feature fuera de core?**

---

## C. DOCUMENTOS NUEVOS REQUERIDOS

### Prioridad ALTA (Bloquean consistencia hoy)

| Doc                              | Qué resuelve                                                     | Por qué urge                              |
| -------------------------------- | ---------------------------------------------------------------- | ----------------------------------------- |
| `select-items-ttl-policy.md`     | TTL 15min (global) vs 5min (por cliente), patrón `GetOrSetAsync` | 100+ endpoints usan caché inconsistente   |
| `enum-select-service.md`         | Servicio frontend centralizado + cache `shareReplay(1)`          | Cada componente replica lógica de cache   |
| `iendpointsmodule-pattern.md`    | Interfaz `IEndPointsModule` obligatoria + registro               | Base de TODOS los endpoints               |
| `select-item-filtering-rules.md` | Dónde vive lógica "SuperUsuario ve todo, Staff ve poco"          | Reglas de negocio hardcodeadas en Service |

### Prioridad MEDIA (Mejoran mantenibilidad)

| Doc                               | Qué resuelve                                                            |
| --------------------------------- | ----------------------------------------------------------------------- |
| `pipes-catalog.md`                | 14 pipes documentados: cuándo usar `currencyMexico` vs `celular-number` |
| `apiresponsedto-wrapper.md`       | `ApiResponseDTO<T>` obligatorio en TODOS los endpoints                  |
| `endpoint-constants-as-const.md`  | `as const` en endpoints constants para type-safety                      |
| `subservices-vs-helpers-guide.md` | Ejemplos reales CandidateCore: cuándo Helper vs SubService              |

### Prioridad BAJA (Calidad de vida)

| Doc                              | Qué resuelve                              |
| -------------------------------- | ----------------------------------------- |
| `endpoint-dead-code-marking.md`  | Estándar `// @DEAD: motivo`               |
| `structured-logging-frontend.md` | `ConsoleLoggerService` con niveles/emojis |
| `signalr-architecture.md`        | Real-time: conexión, grupos, auth         |

---

## 🎯 PLAN DE ACCIÓN PROPUESTO

### Semana 1 (Inmediato - Solo decisiones)

- [ ] A1: Reemplazar `SelectItemBoolDTO` → `SelectItemDTO<bool?>` (script)
- [ ] B1: Autorizar estándar `@DEAD: motivo`
- [ ] B2: Confirmar regla: Dinámicos=Service, Enums=Endpoint directo
- [ ] B3: Deprecar `endpoints.ts` (3 meses)
- [ ] B4: Límite 7 dependencias en Services
- [ ] B5: Mover servicios feature fuera de `core/services/`

### Semana 2 (Documentos ALTA)

- [ ] Crear `select-items-ttl-policy.md`
- [ ] Crear `enum-select-service.md`
- [ ] Crear `iendpointsmodule-pattern.md`
- [ ] Crear `select-item-filtering-rules.md`

### Semana 3 (Documentos MEDIA)

- [ ] Crear `pipes-catalog.md`
- [ ] Crear `apiresponsedto-wrapper.md`
- [ ] Crear `endpoint-constants-as-const.md`
- [ ] Crear `subservices-vs-helpers-guide.md`

### Semana 4 (Limpieza)

- [ ] Ejecutar reemplazo A1 en todo el repo
- [ ] Mover servicios feature (B5)
- [ ] Aplicar estándar @DEAD (B1)

---

## ✅ FIRMA DE AUTORIZACIÓN

| Decisión | Autorizado (S/N) | Comentario | Fecha |
|----------|------------------|------------|-------|
| A1: `SelectItemBoolDTO` → obsoleto | **SÍ** | Reemplazar por `SelectItemDTO<bool?>` | 2026-09-20 |
| B1: Estándar `@DEAD: motivo` | **SÍ** | **Opción 2: Con razón** → `// @DEAD: motivo` | 2026-09-20 |
| B2: Patrón SelectItems (Dinámicos vs Enums) | **SÍ** | **Confirmado**. **Nota:** Si actualizas un enum → **NUNCA modifiques el SelectItemEnum existente**. Crear NUEVO (ej. `StatusExtended`), registrarlo en hub, usarlo. Regla CRÍTICA §6.1 | 2026-09-20 |
| B3: Deprecar `endpoints.ts` raíz | **SÍ** | **Con plan de limpieza**: 1) Marcar `@deprecated` en `endpoints.ts` 2) Buscar todos los imports de `endpoints.ts` → migrar a imports directos 3) Timeline 3 meses 4) Eliminar archivo | 2026-09-20 |
| B4: Límite 7 dependencias | **SÍ** | **Máximo 7**. Si pasa → evaluar SubServices (regla §6bis: 300 líneas) | 2026-09-20 |
| B5: Mover servicios feature de core | **SÍ** | **Regla igual a `CONVENTIONS_FOLDER_API.MD` §6**: Shared global → `core/services/`; Shared a nivel módulo → `modules/[Modulo]/services/` o `modules/[Modulo]/SubServices/`; Feature → `modules/[Modulo]/[Submodulo]/services/` | 2026-09-20 |
| Docs Prioridad ALTA (4) | **SÍ** | Crear: `select-items-ttl-policy.md`, `enum-select-service.md`, `iendpointsmodule-pattern.md`, `select-item-filtering-rules.md` | 2026-09-20 |
| Docs Prioridad MEDIA (4) | **SÍ** | Crear: `pipes-catalog.md`, `apiresponsedto-wrapper.md`, `endpoint-constants-as-const.md`, `subservices-vs-helpers-guide.md` | 2026-09-20 |

---

**Firma Tech Lead:** _________________ **Fecha:** 2026-09-20
