# CobranzaOnline Module Documentation

**Fecha:** 2026-08-03  
**Versión:** 1.0 (Producción)  
**Audiencia:** Developers, QA, DevOps, Tech Leads  
**Nivel:** Operación y Troubleshooting  

---

## Tabla de Contenidos

1. [Flujos Funcionales Completos](#1-flujos-funcionales-completos)
2. [Casos Negativos y Edge Cases](#2-casos-negativos-y-edge-cases)
3. [Integración con Aspel](#3-integración-con-aspel)
4. [Testing Mínimo Requerido](#4-testing-mínimo-requerido)
5. [Rollback y Mitigación](#5-rollback-y-mitigación)
6. [Troubleshooting](#6-troubleshooting)
7. [Performance y Escalabilidad](#7-performance-y-escalabilidad)

---

## 1. Flujos Funcionales Completos

### 1.1 Flujo: Cargar Dashboard Inicial

**Actores:** Administrador, Contador  
**Precondición:** Usuario autenticado con rol "Finanzas"

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario abre http://localhost:4200/collections           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Angular: authGuard valida token JWT                      │
│    ✅ Token válido → continúa                               │
│    ❌ Token inválido → redirige a login                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CobranzaOnlineDashboard.constructor() dispara effect    │
│    effect(() => {                                           │
│      const customerId = customerIdS.customerId();           │
│      if (!customerId) return;                               │
│      loadSummary(customerId);                               │
│    })                                                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Frontend: GET /api/cobranza/online/dashboard             │
│    /customer/{customerId}/year/{year}/month/{month}         │
│    Headers: Authorization: Bearer {JWT}                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend: CobranzaOnlineDashboardEndPoints                │
│    .MapGet("dashboard/...") → service.GetDashboardAsync()   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Validaciones Backend                                     │
│    ✅ Customer no omitido                                   │
│    ✅ Mes válido (1-12)                                     │
│    ✅ Rol "Finanzas" presente (vía attribute)              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. CobranzaOnlineDashboardAppService.BuildLiveDashboardAsync│
│    ├─ Consultar Aspel (IAspelCoiApiClient)                 │
│    │  ✅ Cuentas nivel 2 (Resúmenes)                       │
│    │  ✅ Cuentas nivel 3 (Departamentos)                   │
│    │  ✅ Polizas del mes actual                            │
│    │  ✅ Saldos por cuenta                                 │
│    │                                                        │
│    ├─ Procesar datos                                        │
│    │  ✅ Mapear suffix → Concepto                          │
│    │  ✅ Agrupar por departamento                          │
│    │  ✅ Calcular KPIs (total, recaudado, pendiente)       │
│    │                                                        │
│    └─ Aplicar exclusiones                                   │
│       ✅ Filtrar cuentas marcadas como excluidas           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Response: CobranzaOnlineDashboardResponseDTO             │
│    {                                                        │
│      "customerId": "...",                                   │
│      "year": 2026,                                          │
│      "month": 8,                                            │
│      "kpis": { "totalDue": 15000, "collected": 8000, ... }, │
│      "summaries": [...],  // Nivel 2                        │
│      "departments": [...], // Nivel 3 con balance          │
│      "categories": [...], // Desglose por tipo             │
│      "syncMetadata": { "lastSyncAt": "...", ... }          │
│    }                                                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Frontend: Signals actualizadas                           │
│    dashboard.set(response)                                  │
│    syncStatus.set(response.syncMetadata)                    │
│    selectedSummaryAccountId.set(firstSummary.id)            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. UI Renderiza                                            │
│     ✅ KPI cards (Total a Recaudar, Recaudado, Pendiente)   │
│     ✅ Tabla de departamentos con balance                  │
│     ✅ Gráficos de categorías (morosos, deuda, cobrado)    │
│     ✅ Status de sincronización (fresca/aceptable/vieja)   │
└─────────────────────────────────────────────────────────────┘
```

**Tiempo Esperado:** 1-2 segundos (Aspel responde rápido)  
**Errores Posibles:** Ver sección 2 (Casos Negativos)

---

### 1.2 Flujo: Seleccionar Departamento y Ver Detalle

**Precondición:** Dashboard cargado, al menos 1 departamento disponible

```
Usuario cliquea en fila de departamento
            ↓
onSelectDebtor(accountId) → loadStatement(customerId, accountId)
            ↓
GET /api/cobranza/online/statement/{customerId}/{accountId}/year/{year}
            ↓
Backend: CobranzaOnlineStatementAppService.GetEstadoCuentaAsync()
         ├─ Validar que cuenta existe
         ├─ Obtener saldo histórico (balance)
         ├─ Obtener movimientos del año
         └─ Mapear respuesta a CobranzaOnlineStatementResponseDTO
            ↓
Frontend: selectedStatement.set(response)
         selectedMovement.set(firstMovement)
            ↓
UI Renderiza:
  ├─ Titular de cuenta
  ├─ Saldo inicial + final
  ├─ Tabla de movimientos (póliza, concepto, fecha, monto)
  └─ Selector de mes si aplica
```

**Tiempo Esperado:** 500ms-1s  
**Validaciones:** Cuenta existe en contexto de cliente

---

### 1.3 Flujo: Sincronización Manual

**Actores:** Contador  
**Precondición:** Dashboard cargado

```
Usuario cliquea botón "Sincronizar Ahora"
            ↓
Frontend: onSyncNow()
  syncRunning.set(true)  // Deshabilita botón
            ↓
POST /api/cobranza/online/sync?customerId={id}&year={year}
            ↓
Backend: CobranzaOnlineSyncAsync()
  ├─ Validar que no hay sync en progreso (< 5 min)
  │  ❌ Si está en progreso → retorna error 429
  │
  ├─ Consultar Aspel COI (puede tardar 5-30 seg)
  │  ✅ Obtiene todas las cuentas y movimientos
  │
  ├─ Guardar metadata de sync
  │  ✅ LastSyncAt = DateTime.UtcNow
  │  ✅ SyncStatus = "fresca" (dentro de 1 hora)
  │
  └─ Retorna CobranzaOnlineSyncResponse
            ↓
Frontend: loadSummary() para refrescar dashboard
            ↓
syncRunning.set(false)  // Re-habilita botón
            ↓
UI muestra banner:
  ✅ "Sincronización completada a las 14:23"
  o
  ⚠️  "Sincronización completada con advertencias"
```

**Tiempo Esperado:** 10-45 segundos (depende de Aspel)  
**Riesgo:** Doble-click en botón → ver sección 2.4 (Concurrencia)

---

## 2. Casos Negativos y Edge Cases

### 2.1 Aspel Offline o Timeout

**Escenario:** Usuario abre dashboard pero Aspel no responde

```
Backend: GetDashboardAsync()
  → aspelCoiApiClient.GetDataAsync() timeout (15 seg)
  → catch (HttpRequestException ex)
  → logger.LogWarning("Aspel live no respondió...")
  → return ApiResponseDTO.ErrorResult(
      "Aspel no respondió en vivo para el dashboard..."
    )
```

**Respuesta Frontend:**
- Status: 500 (o 503 Service Unavailable)
- Mensaje en UI: "No se pudo cargar el dashboard. Aspel no responde."
- Acción sugerida: "Reintente en 5 minutos"

**¿Hay fallback a data vieja?** ❌ NO (regla: Lectura Stateless)

**Mitigación:**
- Revisar conectividad a MSSQL de Aspel
- Verificar que IAspelCoiApiClient está configurado
- Revisar logs de Aspel para bloqueos

---

### 2.2 Cliente Inválido o Omitido

**Escenario:** Cliente está en lista de omitidos (test/desarrollo)

```
Backend: GetDashboardAsync(customerId)
  → CobranzaOnlineCustomerScope.IsOmittedCustomer(customerId)
  → retorna true
  → return ApiResponseDTO.ErrorResult(
      "Este cliente está excluido de Cobranza Online"
    )
```

**Respuesta:** 400 Bad Request  
**Acción:** Contactar a Tech Lead para incluir cliente

---

### 2.3 Mes o Fecha Inválida

**Escenario:** Usuario envía mes = 13 o día = 31 en febrero

```
Backend: GetDashboardAsync(customerId, year, month)
  → if (month is < 1 or > 12)
  → return ApiResponseDTO.ErrorResult("El mes solicitado no es válido")
```

**Respuesta:** 400 Bad Request  
**Frontend:** Validar antes de enviar (DatePicker debe limitar opciones)

---

### 2.4 Doble-Click en Sincronizar

**Escenario:** Usuario cliquea botón de sync dos veces rápido

**Estado Actual (Fase 3):**
- ✅ Frontend protege con `syncRunning` flag (1er click habilita/deshabilita)
- ❌ Backend **DESPROTEGIDO** (dos requests concurrentes pueden procesarse)

**Impacto:** Doble sincronización, timestamps inconsistentes, posible corrupción

**Solución:** Ver T3.4 (implementar en backend)

```csharp
// FUTURO (T3.4)
if (syncMetadata.LastSyncAt.HasValue && 
    DateTime.UtcNow.Subtract(syncMetadata.LastSyncAt.Value).TotalMinutes < 5)
{
    return ApiResponseDTO.ErrorResult("Sincronización ya en progreso");
}
```

---

### 2.5 Valor Cargado ya No Existe en Catálogo

**Escenario:** Se edita un departamento en Aspel y desaparece del catálogo

```
Frontend: Tries to load statement para accountId X
Backend: Consulta Aspel → cuenta X no existe
         return error 404
Frontend: Muestra "Departamento no disponible"
```

**Acción Manual:** Refrescar dashboard (sincronizar)

---

### 2.6 Datos Inconsistentes: Balance vs Movimientos

**Escenario:** Saldo de Aspel (balance) ≠ suma de movimientos

```
Ejemplo:
  Balance inicial: 1,000
  Movimientos: +500 (ingreso), -300 (egreso)
  Balance esperado: 1,200
  Balance real en Aspel: 1,150
  → Diferencia: -50
```

**Acción:** Auditar en Aspel directamente (no es responsabilidad de LuxuryApp)

---

## 3. Integración con Aspel

### 3.1 Configuración Requerida

```
Appsettings.json:
{
  "AspelCoiConnection": {
    "Server": "aspel-server.company.local",
    "Database": "COI_PROD",
    "UserId": "cobranza_app",
    "Password": "...",
    "ConnectionTimeout": 15
  }
}
```

### 3.2 Tablas de Aspel Consultadas

| Tabla | Descripción | Lectura |
|-------|-------------|---------|
| `COI.Cuentas` | Catálogo de cuentas (nivel 1-3) | ✅ SELECT |
| `COI.Polizas` | Pólizas de ingresos/egresos/diario | ✅ SELECT |
| `COI.Auxiliares` | Detalle de movimientos | ✅ SELECT |
| `COI.Saldos` | Saldos por cuenta y período | ✅ SELECT |

**Importante:** LuxuryApp **NUNCA escribe** en Aspel (read-only)

### 3.3 Permisos SQL Requeridos

```sql
GRANT SELECT ON COI.Cuentas TO cobranza_app;
GRANT SELECT ON COI.Polizas TO cobranza_app;
GRANT SELECT ON COI.Auxiliares TO cobranza_app;
GRANT SELECT ON COI.Saldos TO cobranza_app;
```

### 3.4 Monitoreo de Connectividad

```
✅ Health Check: GET /api/health/aspel-connection
   Valida que Aspel responde en < 5 seg
   
✅ Logging: Cada consulta a Aspel registra:
   - Tiempo de respuesta
   - Número de registros
   - Errores si hay
```

---

## 4. Testing Mínimo Requerido

### 4.1 Unit Tests (Mínimo 70% cobertura)

**ExclusionesBuilder:**
```
✅ Build_NoExclusions_ReturnsEmpty
✅ Build_PartialExclusion_ReturnsFiltered
✅ Build_InvalidCustomerId_ThrowsException
```

**CobranzaOnlineDashboardAppService:**
```
✅ GetDashboard_ValidRequest_ReturnsDashboard
✅ GetDashboard_InvalidMonth_ReturnsError
✅ GetDashboard_OmittedCustomer_ReturnsError
✅ GetSyncStatus_ValidYear_ReturnsSyncMetadata
```

### 4.2 Integration Tests

**GetDashboardAsync (Aspel Mock):**
```
✅ Simulate Aspel response
✅ Verify KPIs calculated correctly
✅ Verify departments grouped by summary
✅ Verify exclusions applied
```

**Sync Concurrency:**
```
✅ Two concurrent requests → only one succeeds
✅ Second request → 429 Too Many Requests
```

### 4.3 Manual E2E Tests

```
✅ Dashboard carga sin errores
✅ Filtro de fecha funciona
✅ Selección de departamento actualiza statement
✅ Sincronización manual actualiza timestamps
✅ Tema responde a cambios de tokens CSS
✅ Responsive design en mobile
```

---

## 5. Rollback y Mitigación

### 5.1 Si Aspel Retorna Datos Corruptos

**Síntoma:** KPIs no cuadran, balance negativo

**Acción Inmediata:**
1. Verificar conectividad a Aspel
2. Revisar logs en Aspel
3. NO tocar datos en LuxuryApp (son read-only)
4. Notificar a equipo Aspel

**Rollback:** No necesario (datos no fueron modificados)

---

### 5.2 Si API de LuxuryApp Falla

**Síntoma:** 500 Internal Server Error en endpoint

**Acción Inmediata:**
1. Revisar logs en: `logs/cobranza-online-{date}.log`
2. Buscar errores de: Aspel connection, null references, parsing
3. Restart API si es necesario

**Rollback:** Redeploy versión anterior si es crítico

---

### 5.3 Si Frontend No Carga

**Síntoma:** Error 404/503 en módulo

**Acción Inmediata:**
1. Verificar dev server: `npm run start`
2. Limpiar caché: `rm -rf node_modules/.vite && npm start`
3. Compilación correcta: `ng build`

**Rollback:** Redeploy versión anterior

---

## 6. Troubleshooting

### 6.1 "Aspel no respondió en vivo"

| Causa | Síntoma | Solución |
|-------|---------|----------|
| Aspel offline | Timeout persistente | Contactar equipo Aspel |
| Conectividad | Intermitente | Revisar firewall, VPN |
| Creds inválidas | 401 Unauthorized | Actualizar appsettings |
| Connection pool | Agotado | Aumentar pool size |

### 6.2 Dashboard carga lento (>3 seg)

| Causa | Solución |
|-------|----------|
| Aspel lento | Optimizar queries en Aspel |
| Red lenta | Reducir payload (paginación) |
| Cliente con datos masivos | Aumentar timeout |

### 6.3 Sincronización nunca termina

| Causa | Solución |
|-------|----------|
| Aspel locked | Contactar equipo Aspel |
| Timeout corto | Aumentar timeout en config |
| Memoria agotada | Reduce batch size |

---

## 7. Performance y Escalabilidad

### 7.1 Optimizaciones Aplicadas

✅ **Lazy Loading Frontend:** Componentes cargan bajo demanda  
✅ **Caching de Metadata:** Sync status se cachea 1 minuto  
✅ **Connection Pooling:** Reutiliza conexiones a Aspel  
✅ **Índices en BD:** `CoiCobranzaAccounts.CustomerId`, `CobranzaSaldos.AccountId`

### 7.2 Límites Conocidos

- **Max Departamentos por Cliente:** 1,000 (típico: 50-200)
- **Max Período Histórico:** 7 años (saldos se archivan)
- **Timeout Aspel:** 15 segundos

### 7.3 Monitoreo Recomendado

```
Métricas:
├─ API latency: GET dashboard → deber ser < 2s
├─ Aspel connectivity: health check c/5 min
├─ Sync frequency: máximo 1 por hora
└─ Error rate: alertar si > 5% en 10 min
```

---

## Contacto y Escalación

**Tech Lead:** [Assign]  
**DevOps:** [Assign para configuración Aspel]  
**QA:** [Assign para testing plan]  

**Documento creado por:** Claude Code (Haiku 4.5)  
**Fecha:** 2026-08-03  
**Próxima revisión:** 2026-08-10 (post-testing Fase 2)
