# Business Rules Analysis: Módulo CobranzaOnline

**Fecha:** 2026-08-03  
**Módulo:** CobranzaOnline (Lectura en Vivo de Cobranza)  
**Versión:** 1.0  
**Estado:** Activa  

---

## Propósito

Este documento identifica, clasifica y audita las **Reglas de Negocio** del módulo CobranzaOnline en 4 niveles jerárquicos:

1. **Nivel 1: Invariantes de Dominio** — Restricciones inmutables del negocio
2. **Nivel 2: Flujo y Estados** — Ciclos de vida, transiciones válidas  
3. **Nivel 3: Seguridad/Autorización** — RBAC, protección de datos
4. **Nivel 4: Validación de Datos** — Formatos, límites, constraints

---

## Matriz de Reglas de Negocio

### RN-COO-001: Lectura con respaldo local (Nivel 1: Invariante)

> ⚠️ **Corregida el 2026-08-07.** Este documento afirmaba "Lectura Stateless: no persiste
> cargos, sin fallback a datos antiguos". Es **falso**: el módulo mantiene caché local y
> lo usa cuando Aspel no responde. Se corrige aquí para no contradecir al código ni a
> `docs/aspel/ASPEL_API_GUIDE.md`.

**Enunciado:**
La fuente de verdad es Aspel. LuxuryApp mantiene un caché local de lo leído
(`CobranzaCuentas`, `CobranzaSaldos`, `CobranzaAuxiliares`, `CobranzaPolizas`) y lo sirve
cuando Aspel no responde, declarándolo explícitamente en la respuesta. No se generan
cargos propios: lo que no está ni en Aspel ni en el caché, no se muestra.

**Ubicación en Código:**

| Capa | Ubicación | Implementación |
|------|-----------|----------------|
| **Backend** | `CobranzaOnlineDashboardAppService.cs` | `BuildLiveDashboardAsync()` contra Aspel; si falla, ruta de respaldo contra el caché local |
| **Backend** | `CobranzaOnlineDashboardAppService.cs` | La respuesta marca `syncMetadata.dataSource = "cache-local"` e `isFallback = true` |
| **Backend** | `CobranzaOnlineCustomerScope.cs` | Validación de customer omitido retorna error 400. |
| **Frontend** | `state/cobranza-online-store.service.ts` | Store con signals; la cabecera muestra el `dataSource` para que el usuario sepa qué está viendo |

**Casos de Uso:**
- ✅ Aspel responde: `dataSource = "aspel-live"`, datos del momento
- ✅ Aspel caído: se sirve el caché con `isFallback = true` y la UI advierte la fecha del respaldo

> **Ambas rutas deben aplicar exactamente las mismas reglas.** Los desajustes históricos
> del módulo (clasificaciones distintas entre pantallas, conteos que no cuadraban) salieron
> todos de rutas de respaldo que quedaron con lógica vieja.

**Casos Negativos (Edge Cases):**
- Si Aspel retorna `null` o array vacío: debe renderizarse como "sin movimientos"
- Si Aspel retorna JSON malformado: log error, retorna error 400 al frontend
- Si cliente intenta acceso después de 6 meses: Aspel puede no tener datos históricos → retorna vacío legítimamente

**Validación en Código:**
```csharp
// CORRECTO: Aspel falla, retorna error
if (liveDashboard == null) {
    return ApiResponseDTO<CobranzaOnlineDashboardResponseDTO>.ErrorResult(
        "Aspel no respondió en vivo..."
    );
}

// CORRECTO: No guarda en cache permanente, solo metadata de sync
var syncMetadata = await BuildSyncMetadataAsync(customerId, year);
// syncMetadata.LastSyncAt es timestamp de última consulta, NO persistencia de cargos
```

**Test Coverage:**
- [ ] Unit: `GetDashboardAsync_AspelTimeout_ReturnsError` 
- [ ] Integration: `GetDashboard_AspelOffline_NoFallback`
- [ ] Manual: Desconectar Aspel, verificar error en UI

**Riesgo:** ALTO si esta invariante se rompe (alguien intenta cachear cargos)

---

### RN-COO-002: Departamento Único por Resumen (Nivel 1: Invariante)

**Enunciado:**  
Un departamento (Account, Nivel 3) no puede pertenecer a dos resúmenes (Summaries) simultáneamente. Esta es una invariante de integridad del dominio.

**Ubicación en Código:**

| Capa | Ubicación | Implementación |
|------|-----------|----------------|
| **Backend** | `CobranzaOnlineDashboardAppService.cs:~1200-1300` | `BuildLiveDashboardAsync()` mapea `Account.SummaryAccountId` → asigna a un solo summary |
| **DB** | `CoiCobranzaAccounts.SummaryAccountId` | Debería haber UNIQUE constraint (verificar) |
| **Frontend** | `cobranza-online-dashboard.ts:468-472` | `departmentRows` filtra por `row.summaryAccountId` |

**Casos de Uso:**
- ✅ Dashboard renderiza Resumen A con 5 departamentos, Resumen B con 3 departamentos (sin solapamiento)
- ❌ Departamento X pertenece a Resumen A y B simultáneamente (violación)

**Validación en Código:**
```csharp
// Construcción de summaries y departments
var summaries = new List<CobranzaOnlineDashboardSummaryDTO>();
var departments = new List<CobranzaOnlineDashboardDepartmentDTO>();

// CORRECTO: Cada departamento se asigna a un solo summary
foreach (var account in liveAccounts.Where(a => a.Level == 2))
{
    summaries.Add(new { AccountId = account.Id, ... });
}

foreach (var account in liveAccounts.Where(a => a.Level == 3))
{
    // Solo un summary por departamento
    var summary = summaries.FirstOrDefault(s => s.AccountId == account.ParentAccountId);
    departments.Add(new { SummaryAccountId = summary?.AccountId, ... });
}
```

**Test Coverage:**
- [ ] Unit: `BuildLiveDashboard_SingleSummaryPerDepartment` 
- [ ] DB: Verificar UNIQUE constraint existe: `UNIQUE(SummaryAccountId, DepartmentAccountId)`
- [ ] Manual: Dashboard no renderiza departamento en dos resúmenes

**Riesgo:** MEDIO (afecta lógica de agrupación de UI)

---

### RN-COO-003: Cálculo de Suffix = Último Segmento (Nivel 4: Validación)

**Enunciado:**  
Las cuentas contables brutas de Aspel (ej. `104-001-053-001`) se procesan dinámicamente. El **identificador de concepto** es siempre el **último segmento** (`001` = Mantenimiento).

**Ubicación en Código:**

| Capa | Ubicación | Implementación |
|------|-----------|----------------|
| **Backend** | `CobranzaOnlineHelpers.cs:~100-150` | Métodos de parsing de cuenta (extrae último bloque) |
| **Frontend** | `dashboard.ts:getCategoryLabel()` | Mapea suffix a nombre de concepto |

**Casos de Uso:**
- ✅ Cuenta `104-001-053-001` → suffix = `001` → Concepto: "Cuota Mantenimiento"
- ✅ Cuenta `104-002-053-002` → suffix = `002` → Concepto: "Descuento"

**Validación en Código:**
```csharp
// CORRECTO: Extrae último segmento
public static string ExtractSuffix(string accountNumber)
{
    var parts = accountNumber.Split('-');
    return parts.Length > 0 ? parts[^1] : "";  // [^1] = último elemento
}
```

**Test Coverage:**
- [ ] Unit: `ExtractSuffix_ReturnsLastSegment`
- [ ] Unit: `ExtractSuffix_EmptyString_ReturnsEmpty`
- [ ] Unit: `ExtractSuffix_SingleValue_ReturnsSelf`

**Riesgo:** BAJO (parsing determinístico)

---

### RN-COO-004: Ciclo de Sincronización (Nivel 2: Flujo)

**Enunciado:**  
El estado de sincronización transita por estados discretos según timestamp de última consulta:

- **sin-datos**: Nunca se consultó Aspel (LastSyncAt = null)
- **fresca**: Consulta < 1 hora  
- **aceptable**: Consulta 1-4 horas
- **desactualizada**: Consulta > 4 horas
- **fallback**: Usando datos locales (si aplica)

**Ubicación en Código:**

| Capa | Ubicación | Implementación |
|------|-----------|----------------|
| **Backend** | `CobranzaOnlineDashboardAppService.cs:~1900-1950` | `BuildSyncMetadataAsync()` calcula estado basado en edad |
| **Frontend** | `cobranza-online-dashboard.ts:114-134` | `messageSeverity` computed renderiza badge de estado |

**Transiciones Válidas:**
```
sin-datos → fresca → aceptable → desactualizada → (reintento manual) → fresca
```

**Casos Negativos:**
- Si `LastSyncAt` es null pero existen datos → estado "sin-datos" (indicar al user)
- Si `LastSyncAt` es una hora en el futuro (reloj descalibrado) → log error, assumir "sin-datos"

**Validación en Código:**
```csharp
private async Task<CobranzaOnlineSyncMetadataDTO> BuildSyncMetadataAsync(Guid customerId, int year)
{
    var lastSync = await GetLastSyncTimestampAsync(customerId, year);
    
    if (!lastSync.HasValue)
        return new { SyncStatus = "sin-datos", LastSyncAt = null };
    
    var minutesSinceSync = DateTime.UtcNow.Subtract(lastSync.Value).TotalMinutes;
    
    var syncStatus = minutesSinceSync switch
    {
        <= 60 => "fresca",
        <= 240 => "aceptable",
        _ => "desactualizada"
    };
    
    return new { SyncStatus = syncStatus, LastSyncAt = lastSync };
}
```

**Test Coverage:**
- [ ] Unit: `BuildSyncMetadata_NoSync_ReturnsSinDatos`
- [ ] Unit: `BuildSyncMetadata_30minAgo_ReturnsFreska`
- [ ] Unit: `BuildSyncMetadata_2hoursAgo_ReturnsAceptable`
- [ ] Unit: `BuildSyncMetadata_6hoursAgo_ReturnsDesactualizada`

**Riesgo:** BAJO (cálculo temporal determinístico)

---

### RN-COO-005: Sincronización No Concurrente (Nivel 1: Invariante)

**Enunciado:**  
Solo una sincronización puede estar en progreso por cliente por año. Si usuario cliquea botón de sincronización mientras ya hay una en progreso, rechazar con mensaje "ya en sincronización".

**Ubicación en Código:**

| Capa | Ubicación | Implementación |
|------|-----------|----------------|
| **Frontend** | `cobranza-online-dashboard.ts:618-638` | `onSyncNow()` establece `syncRunning.set(true)` |
| **Frontend** | (controlador flag local, no bloquea doble-request) | ⚠️ **RIESGO: Solo UI, backend desprotegido** |
| **Backend** | ❌ **FALTA IMPLEMENTAR** | Ver T3.4 del plan de remediación |

**Casos de Uso:**
- ✅ User cliquea "Sincronizar" → backend procesa → LuxuryApp consulta Aspel
- ❌ User cliquea rápido dos veces → solo primer request procesa, segundo rechazado

**Casos Negativos:**
- Si backend falla a mitad de sync, timestamp de "última sync" no se actualiza (detección de rollback)
- Si dos requests llegan simultáneamente (race condition) → backend debe guardar mutex

**Validación en Código (PENDIENTE - T3.4):**
```csharp
// FUTURO: Protección backend
public async Task<ApiResponseDTO<...>> SyncCobranzaAsync(Guid customerId, int year)
{
    // Validar si ya hay sync en progreso
    var syncMetadata = await BuildSyncMetadataAsync(customerId, year);
    if (syncMetadata.LastSyncAt.HasValue && 
        DateTime.UtcNow.Subtract(syncMetadata.LastSyncAt.Value).TotalMinutes < 5)
    {
        return ApiResponseDTO.ErrorResult("Sincronización ya en progreso...");
    }
    
    // Proceder
    await aspelCoiApiClient.SyncAsync(...);
}
```

**Test Coverage:**
- [ ] Integration: `SyncCobranza_Concurrent_OnlyOneProcesses`
- [ ] Integration: `SyncCobranza_TwoRequestsSimultaneously_SecondRejected`

**Riesgo:** CRÍTICO (afecta integridad de datos)

---

### RN-COO-006: Autorización por Rol (Nivel 3: Seguridad)

**Enunciado:**  
Solo usuarios con rol "Finanzas" pueden consultar datos de Cobranza Online. Otros roles reciben 401 Unauthorized.

**Ubicación en Código:**

| Capa | Ubicación | Implementación |
|------|-----------|----------------|
| **Backend** | `CobranzaOnlineDashboardEndPoints.cs:7-8` | `group.RequireAuthorization("Finanzas")` |
| **Frontend** | `cobranza.routes.ts:4-77` | `authGuard` en todas las rutas |

**Casos de Uso:**
- ✅ User con rol Finanzas accede a `/collections` → autorizado
- ❌ User con rol Contador accede a `/collections` → 401, redirige a login

**Validación:**
- Backend: Policy "Finanzas" definida en `Program.cs` o startup
- Frontend: AuthGuard valida token antes de renderizar

**Test Coverage:**
- [ ] Integration: `GetDashboard_WithoutFin anzasRole_Returns401`
- [ ] Integration: `GetDashboard_WithFinanzasRole_Returns200`

**Riesgo:** ALTO (seguridad crítica)

---

### RN-COO-007: Exclusiones de Departamentos (Nivel 4: Validación)

**Enunciado:**  
Un administrador puede marcar departamentos como "excluidos" de reportes de cobranza. Estos no se renderizarán en dashboards de consolidación, pero sí en consultas individuales.

**Ubicación en Código:**

| Capa | Ubicación | Implementación |
|------|-----------|----------------|
| **Backend** | `ExclusionesBuilder.cs` | Lógica de construcción de lista de excluidos |
| **Backend** | `CobranzaOnlineExcludedAccountUpsertDTO` | DTO de upsert de exclusión |
| **Frontend** | `cobranza-online-exclusions.ts` | Componente de gestión de exclusiones |

**Casos de Uso:**
- ✅ Departamento X marcado como excluido → No aparece en KPI totales
- ✅ Departamento X consultado directamente → Sí se renderiza (read-only)

**Validación en Código:**
```csharp
// CORRECTO: Aplicar filtro de exclusiones a KPIs, no a statement individual
var departments = allDepartments
    .Where(d => !exclusions.Contains(d.AccountId))
    .ToList();
```

**Test Coverage:**
- [ ] Unit: `ExclusionesBuilder_NoExclusions_ReturnsEmpty`
- [ ] Unit: `ExclusionesBuilder_PartialExclusion_ReturnsFiltered`
- [ ] Integration: `Dashboard_WithExclusion_KPIExcludesDepartment`

**Riesgo:** BAJO (validación determinística)

---

### RN-COO-008: Fechas Válidas (Nivel 4: Validación)

**Enunciado:**  
Solo se permiten consultas con:
- Mes: 1-12
- Año: dentro del rango de datos en BD (típicamente ±5 años del actual)
- Día (opcional): 1 a último día del mes

**Ubicación en Código:**

| Capa | Ubicación | Implementación |
|------|-----------|----------------|
| **Backend** | `CobranzaOnlineDashboardAppService.cs:44-47` | Validación de mes 1-12 |
| **Backend** | `CobranzaOnlineAnalysisResponseDTO:77-80` | Validación de día |
| **Frontend** | `cobranza-online-dashboard.ts:82-90` | `onDateChange()` parsea fecha |

**Casos Negativos:**
- Mes = 0 o 13 → error 400
- Día = 31 en febrero → error 400
- Año = 2050 (futuro) → error 400 o validar rango BD

**Validación en Código:**
```csharp
if (month is < 1 or > 12)
{
    return ApiResponseDTO.ErrorResult("El mes solicitado no es válido.");
}

if (day < 1 || day > DateTime.DaysInMonth(year, month))
{
    return ApiResponseDTO.ErrorResult("El día solicitado no es válido.");
}
```

**Test Coverage:**
- [ ] Unit: `GetDashboard_InvalidMonth_ReturnsError`
- [ ] Unit: `GetAnalysis_InvalidDay_ReturnsError`
- [ ] Unit: `GetAnalysis_FebruaryDay29_HandlesLeapYear`

**Riesgo:** BAJO (validación determinística)

---

## Resumen de Cobertura por Nivel

| Nivel | Reglas | Implementadas | Tests | Status |
|-------|--------|---------------|-------|--------|
| **1. Invariantes** | RN-COO-001, 002, 005 | ✅ ✅ ⚠️ | ❌ ❌ ⚠️ | ⚠️ Crítica pendiente (T3.4) |
| **2. Flujo** | RN-COO-004 | ✅ | ❌ | ⚠️ Sin tests |
| **3. Seguridad** | RN-COO-006 | ✅ | ❌ | ⚠️ Sin tests |
| **4. Validación** | RN-COO-003, 007, 008 | ✅ ✅ ✅ | ❌ ❌ ❌ | ⚠️ Sin tests |

---

## Plan de Auditoría y Testing

### Fase 2: Testing (Completar en próximo sprint)
- [ ] Crear suite de unit tests para cada RN
- [ ] Crear suite de integration tests para flujos críticos
- [ ] Validación manual de edge cases

### Fase 3: Remediación (Específico)
- [ ] **T3.4:** Implementar RN-COO-005 en backend (protección concurrencia)
- [ ] **T2.2:** 70%+ cobertura en tests críticos

---

**Documento creado por:** Auditor (Claude Code)  
**Próxima revisión:** 2026-08-10 (post-remediación)  
**Validado por:** [Tech Lead sign-off pendiente]
