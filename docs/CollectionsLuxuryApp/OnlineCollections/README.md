# Cobranza Online

**Última revisión:** 2026-08-03 (Arquitectura técnica completa)  
**Estado:** Activo / Producción  
**Arquitectura:** Minimal API (IEndPointsModule) + Angular Standalone  
**Responsable:** Claude Code | **Auditor:** 20260803

## Propósito Funcional

Cobranza Online es un submódulo dentro de `CobranzaLuxuryApp` diseñado para la consulta del estado de cuenta, adeudos y cargos de los departamentos (condóminos) a partir del sistema contable Aspel. Actúa como capa de lectura que extrae, consolida y formatea la información financiera para administradores y usuarios finales.

> ⚠️ **Las reglas de cálculo y clasificación NO viven aquí.**
> La fuente única es [`docs/aspel/ASPEL_API_GUIDE.md`](../../../../../docs/aspel/ASPEL_API_GUIDE.md):
> conteo de condóminos, cuotas vencidas, clasificación, composición de cada reporte y
> valores de control. La implementación de la regla vive en
> `Services/CobranzaOnlineClasificador.cs`. No duplicar esas reglas en este documento.

### Sobre la persistencia

Cobranza Online **sí mantiene un caché local** de lo leído de Aspel (`CobranzaCuentas`,
`CobranzaSaldos`, `CobranzaAuxiliares`, `CobranzaPolizas`). Cada consulta tiene dos rutas:
contra Aspel en vivo y, si Aspel no responde, contra ese caché (`dataSource = "cache-local"`).
**Ambas rutas deben aplicar exactamente las mismas reglas**; los desajustes históricos del
módulo salieron de rutas de respaldo que quedaron con lógica vieja.

---

## Arquitectura Técnica

### Backend (Minimal API)

**Patrón:** `IEndPointsModule` con auto-discovery en startup

```csharp
// Ubicación: CobranzaOnlineDashboardEndPoints.cs
public sealed class CobranzaOnlineDashboardEndPoints : IEndPointsModule
{
    public void MapEndPoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/cobranza/online")
                       .RequireAuthorization("Finanzas");
        // ... mapear rutas
    }
}
```

**Características:**
- ✅ Autorización centralizada: `RequireAuthorization("Finanzas")`
- ✅ Grouped routing: Todas las rutas bajo `api/cobranza/online`
- ✅ Response tipada: Todo retorna `ApiResponseDTO<T>` con statusCode
- ✅ Logging: Errores registrados en puntos críticos

**Ventajas sobre Controllers:**
- Menos boilerplate, más declarativo
- Auto-discovery: se registra automáticamente en el mapeo de endpoints
- Testeable sin HTTP context
- Separación clara de responsabilidades

### Frontend (Angular Standalone)

**Patrón:** Standalone components con lazy loading

```typescript
// Ubicación: cobranza.routes.ts
export const COBRANZA_ONLINE_ROUTES: Routes = [
  {
    path: "collections",
    loadComponent: () => import("./dashboard/...").then(m => m.CobranzaOnlineDashboard),
    canActivate: [authGuard],
  }
  // ... más rutas
];
```

**Características:**
- ✅ Lazy loading: componentes cargan bajo demanda
- ✅ Auth guard: valida permisos antes de renderizar
- ✅ Standalone: sin necesidad de NgModule
- ✅ Service injection: `CobranzaOnlineService` centralizado

### Flujo de Datos

```
┌──────────────────────────────────────────────────────────────┐
│                        USUARIO (Browser)                     │
│                    Angular @ localhost:4200                  │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ HTTP Request
                       │ (GET /api/cobranza/online/dashboard/...)
                       ▼
┌──────────────────────────────────────────────────────────────┐
│              LuxuryApp API (localhost:5000)                  │
│    ✅ Minimal API (IEndPointsModule)                         │
│    ✅ Authorization: RequireAuthorization("Finanzas")        │
│    ✅ Services: CobranzaOnlineDashboardAppService, etc.      │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ Query MSSQL
                       │ (tabla CoiCobranzaAccounts, etc.)
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                  Aspel COI Database (Live)                   │
│            ✅ MSSQL Read-Only (sin persistencia)             │
│            ✅ Consulta en tiempo real: Polizas, Auxiliares   │
└──────────────────────────────────────────────────────────────┘
```

**Regreso de datos:**
```
Aspel (cuentas brutas)
    ↓
CobranzaOnlineDashboardAppService.BuildLiveDashboardAsync()
    ↓
Mapeo: 104-001-053-001 → suffix "001" → Concepto "Mantenimiento"
    ↓
CobranzaOnlineDashboardResponseDTO (tipado)
    ↓
ApiResponseDTO<CobranzaOnlineDashboardResponseDTO> (statusCode 200)
    ↓
Frontend: cobranza-online-dashboard component
    ↓
UI: Dashboard renderizado con KPIs, tabla de departamentos, gráficos
```

---

## Endpoints Completos

### MapGroup: `api/cobranza/online`
**Autorización:** `RequireAuthorization("Finanzas")`

| # | Método | Ruta | Descripción | Query Params | Response |
|---|--------|------|-------------|--------------|----------|
| 1 | GET | `/dashboard/{customerId:guid}/year/{year:int}/month/{month:int}` | Dashboard KPIs y cargos consolidados | `?day={int}` (opcional) | `CobranzaOnlineDashboardResponseDTO` |
| 2 | GET | `/statement/{customerId:guid}/{accountId:guid}/year/{year:int}` | Estado de cuenta de departamento | — | `CobranzaOnlineStatementResponseDTO` |
| 3 | GET | `/sync-status/customer/{customerId:guid}/year/{year:int}` | Metadata de última sincronización | — | `CobranzaOnlineSyncMetadataDTO` |
| 4 | GET | `/analysis/customer/{customerId:guid}/year/{year:int}/month/{month:int}/day/{day:int}` | Análisis de cobranza por fecha | — | `CobranzaOnlineAnalysisResponseDTO` |
| 5 | GET | `/inspection/customer/{customerId:guid}/year/{year:int}/month/{month:int}` | Inspección de movimientos del mes | — | `CobranzaOnlineInspectionResponseDTO` |
| 6 | GET | `/inspection-history/customer/{customerId:guid}/year/{year:int}/account/{accountNumber}` | Histórico de inspecciones por cuenta | — | `CobranzaOnlineInspectionHistoryResponseDTO` |
| 7 | GET | `/excluded-accounts/customer/{customerId:guid}/year/{year:int}` | Lista de cuentas excluidas | — | `CobranzaOnlineExcludedAccountListResponseDTO` |
| 8 | PUT | `/excluded-accounts/customer/{customerId:guid}` | Actualizar exclusión de cuenta | — | `CobranzaOnlineExcludedAccountUpsertDTO` (request) |
| 9 | POST | `/sync` | Forzar sincronización manual | — | `CobranzaOnlineSyncResponse` |

### Endpoints Adicionales (Otro MapGroup)

**AspelSyncEndPoints.cs:**
- `POST /api/cobranza/online/aspel-sync` — Sincronización específica con Aspel

---

## ⚠️ Quién más consume esto

**Antes de cambiar la firma, el contrato o el cálculo de cualquiera de estas piezas,
revisa esta tabla.** Un cambio aquí no se queda en Cobranza Online.

| Pieza | Quién más la consume | Qué se rompe si cambia |
|---|---|---|
| `ICobranzaOnlineDashboardAppService.GetDashboardAsync` | **Comité** → `CommitteeCobranzaAppService.GetMorososReportAsync` | Los KPIs y el listado de condóminos del comité. Depende de `Departments[].Classification`, `Kpis.TotalDepartments` y `CurrentCharges` |
| `IAspelCobranzaHausDetalleAppService.GetDetalleCobranzaRangoAsync` | **Cobranza Online** → modal de Morosidad · **Comité** → modal de detalle de deuda | El desglose por concepto de ambos modales |
| `CobranzaOnlineClasificador` | Todo el módulo · Comité · cualquier reporte que hable de morosos | Las cifras de **todas** las pantallas a la vez |
| Ruta `api/aspel-cobranza/detalle-cobranza-rango` | **APIs externas fuera de este repositorio** | Integraciones que no podemos inventariar. Ver el aviso en `AspelCobranzaEndPoints.cs`: esa ruta está congelada |

> **Regla al integrar un módulo nuevo:** consumir el **servicio**, no la ruta pública.
> Así el cálculo queda en un solo lugar y cada módulo conserva su propia ruta y su
> control de acceso. Es lo que hace el comité: reutiliza
> `IAspelCobranzaHausDetalleAppService` pero expone
> `committee/cobranza/morosos/{numCta}/detalle`.
>
> Al hacerlo, **agrega la fila a esta tabla**. Es el único inventario que tenemos.

---

## Endpoints Principales (Legacy - Ver tabla arriba)

- `GET /api/cobranza/online/dashboard/{customerId}`: Retorna los KPIs mensuales (Total a recaudar, Total recaudado, Saldo pendiente) y el listado consolidado de cargos agrupados por departamento (Data matricial).
- `GET /api/cobranza/online/statement/{customerId}/{accountNumber}`: Retorna el estado de cuenta detallado de un departamento específico.
- `POST /api/cobranza/online/sync`: Fuerza sincronización manual de datos con Aspel.

## Actores Involucrados

1. **Administradores y Contadores**: Consultan el *Dashboard* y los desgloses de cargos por departamento para supervisar la recaudación del mes actual e histórico.
2. **Condóminos / Inquilinos**: Consultan su *Estado de Cuenta* individual y pueden cargar comprobantes de pago.

## Dependencias

- **Aspel Data Access**: El módulo depende críticamente de la infraestructura de lectura a las bases de datos de Aspel (por lo general MSSQL) configuradas por cada condominio.
- **Catálogo de Conceptos**: Mapeo estricto de las cuentas contables de Aspel (ej. el último bloque de `104-00X-YYY-001`) hacia el catálogo estándar de LuxuryApp (001: Cuota Mtto, 002: Descuento, etc.).

## Reglas de Negocio Principales

1. **Lectura con respaldo local**: la fuente es Aspel; si el enlace falla se sirve el último caché local y la respuesta lo declara con `dataSource = "cache-local"` y `isFallback = true`, para que la UI lo advierta. No se inventan cargos: lo que no está ni en Aspel ni en el caché, no se muestra.
2. **Cálculo de Suffix / Concepto**: Las cuentas crudas (ej. `104-001-053-001`) se procesan dinámicamente tanto en backend como frontend, tomando siempre el **último segmento** como el identificador único del concepto (001 = Mantenimiento).
3. **Cargos por Departamento**: Los cargos se listan en un formato matricial consolidado donde se cruzan las filas (Departamentos) por las columnas de los 26 conceptos oficiales.

## Ubicaciones Clave

### Backend

| Componente | Ubicación | Archivo(s) |
|-----------|-----------|-----------|
| **EndPoints (Minimal API)** | `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/EndPoints/` | `CobranzaOnlineDashboardEndPoints.cs`, `AspelSyncEndPoints.cs`, etc. (9 archivos) |
| **Services (Lógica de Negocio)** | `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Services/` | `CobranzaOnlineDashboardAppService.cs`, `ExclusionesBuilder.cs`, etc. (11 archivos) |
| **Interfaces (Contratos)** | `api/LuxuryApp.Shared/Services/CobranzaOnline/` | `ICobranzaOnlineService.cs`, etc. (10 archivos) |
| **DTOs (Transfer Objects)** | `api/LuxuryApp.Shared/DTOs/CobranzaOnline/` | `CobranzaOnlineDashboardResponseDTO.cs`, etc. (34 archivos) |
| **Clasificación (regla única)** | `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Services/` | `CobranzaOnlineClasificador.cs` |
| **Reglas de negocio (documento rector)** | `docs/aspel/` | `ASPEL_API_GUIDE.md` |
| **Documentación del módulo** | `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/` | `README.md` (este archivo) |

### Frontend

| Componente | Ubicación | Archivo(s) |
|-----------|-----------|-----------|
| **Rutas (Lazy Loading)** | `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/` | `cobranza-online.routes.ts` |
| **Estado compartido** | `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/state/` | `cobranza-online-store.service.ts`, `cobranza-online-filter.state.ts` |
| **Componentes** | `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/` | `resumen/`, `analysis/`, `detalle-condominos/`, `morosidad/`, `otros-cargos/`, `movimientos/`, `advances/`, `towers/`, `exclusions/`, `inspection/` |
| **Interfaces/Modelos** | `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/interfaces/` | `cobranza-online-dashboard.model.ts`, `cobranza-online-analysis.model.ts`, etc. |
| **Estilos** | `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/` | `cobranza-online.styles.scss` |

---

## Reglas de Negocio (Expandido)

Ver análisis completo en: `docs/modulos-nuevos/CobranzaOnline/02-business-rules-analysis.md`

1. **Lectura con respaldo local**: la fuente es Aspel; si el enlace falla se sirve el último caché local y la respuesta lo declara con `dataSource = "cache-local"` y `isFallback = true`, para que la UI lo advierta. No se inventan cargos: lo que no está ni en Aspel ni en el caché, no se muestra.
2. **Cálculo de Suffix / Concepto**: Las cuentas crudas (ej. `104-001-053-001`) se procesan dinámicamente tanto en backend como frontend, tomando siempre el **último segmento** como el identificador único del concepto (001 = Mantenimiento).
3. **Cargos por Departamento**: Los cargos se listan en un formato matricial consolidado donde se cruzan las filas (Departamentos) por las columnas de los 26 conceptos oficiales.
4. **Departamento Único por Resumen**: Un departamento no puede pertenecer a dos resúmenes simultáneamente.
5. **Sincronización No Concurrente**: Solo una sincronización puede estar en progreso por cliente por año.
6. **Autorización por Rol**: Solo usuarios con rol "Finanzas" pueden consultar datos de Cobranza Online.
7. **Exclusiones de Departamentos**: Administradores pueden marcar departamentos como "excluidos" de reportes consolidados.
8. **Fechas Válidas**: Solo se permiten consultas con mes (1-12) y días válidos para el mes.
