# Modulo: Contabilidad Migration - Sincronizacion Aspel

> **Estado**: Sincronizacion por HTTP / En produccion
> **Ubicacion**: `api/LuxuryApp.Application/Features/Contabilidad/ContabilidadMigration/`
> **Responsable**: Equipo Core / Finanzas
> **Documento maestro**: este archivo sustituye `PLAN-UPSERT-ASPEL.md`, `CARGA-SILENCIOSA-ASPEL.md` y `MAPEO-ENTIDADES-ASPEL-COI.md`.

---

## 1. Resumen Ejecutivo

Este submodulo se encarga de los procesos de sincronizacion ACID desde la API HTTP de Aspel COI hacia SQL Server local. Su objetivo es centralizar la informacion historica y operativa en la base local para que el sistema consulte siempre datos persistidos.

### Servicios de Sincronizacion

| Servicio                        | Descripcion                                                                                    |
| :------------------------------ | :--------------------------------------------------------------------------------------------- |
| **ContabilidadMigratorService** | Sincronizacion contable desde Aspel HTTP (Catalogo, Polizas, Auxiliares, Presupuestos, Saldos) |
| **CobranzaMigratorService**     | Sincronizacion de cobranza desde Aspel HTTP (Cuentas, Polizas, Auxiliares, Saldos)             |
| **AspelMigrationSchedulerJob**  | Job recurrente que encola la sincronizacion por cliente activo en horario fijo                 |

---

## 2. Arquitectura Tecnica

- **Lector**: `AspelCoiMigrationApiClient` consulta el endpoint HTTP y valida el mapeo `AspelCustomerEmpresa`.
- **Persistencia**: EF Core con `SaveChangesAsync()` y transacciones solo cuando hay multiples escrituras coordinadas.
- **Transformacion**: Mapeo manual y proyecciones para normalizar el JSON global de Aspel a la estructura local.
- **Ejecucion**: Hangfire se programa a las 9:00, 12:00 y 16:00, de lunes a viernes, y encola la sincronizacion por customer activo.
- **Acceso manual**: Angular expone `/settings/aspel-sync` para disparar la sincronizacion directa desde configuracion.
- **Sincronizacion**: `ContabilidadCuenta`, `ContabilidadSaldo`, `ContabilidadPresupuesto`, `ContabilidadPoliza`, `ContabilidadAuxiliar`, `CobranzaCuenta`, `CobranzaSaldo`, `CobranzaPoliza` y `CobranzaAuxiliar` usan `upsert` por clave natural.

### 2.1 Mapeo de entidades Aspel COI

| Entidad                    | Area         | Clave natural                                            |
| :------------------------- | :----------- | :------------------------------------------------------- |
| `ContabilidadCuenta`       | Contabilidad | `CustomerId + AccountNumber`                             |
| `ContabilidadSaldo`        | Contabilidad | `CustomerId + AccountId + Year`                          |
| `ContabilidadPresupuesto`  | Contabilidad | `CustomerId + AccountId + Year`                          |
| `ContabilidadPoliza`       | Contabilidad | `CustomerId + PolicyType + PolicyNumber + Year + Period` |
| `ContabilidadAuxiliar`     | Contabilidad | `PolicyId + LineNumber`                                  |
| `ContabilidadFiscalPeriod` | Contabilidad | `CustomerId + Year + Month`                              |
| `CobranzaCuenta`           | Cobranza     | `CustomerId + AccountNumber`                             |
| `CobranzaSaldo`            | Cobranza     | `CustomerId + AccountId + Year`                          |
| `CobranzaPoliza`           | Cobranza     | `CustomerId + PolicyType + PolicyNumber + Year + Period` |
| `CobranzaAuxiliar`         | Cobranza     | `PolicyId + LineNumber`                                  |

### 2.2 Campos de control de sincronizacion

Cada entidad espejo conserva:

- `ExternalSource`
- `ExternalId`
- `SourceHash`
- `SyncedAt`

Si el `SourceHash` no cambia, el registro no se reescribe. Si cambia, solo se actualizan los campos relevantes y se refresca `SyncedAt`.

### 2.3 Criterio de carga silenciosa

La sincronizacion debe ser idempotente:

1. leer Aspel por HTTP,
2. normalizar el registro,
3. calcular la clave natural,
4. buscar en base local,
5. omitir si el hash es igual,
6. actualizar si el hash cambio,
7. insertar si no existe,
8. guardar por lote,
9. registrar trazabilidad.

### Endpoints actuales

```
POST /api/accounting-coi/migration/aspel-sync/{customerId}/ejercicio/{year}/completo        [SoloSuperUsuario]
POST /api/accounting-coi/migration/aspel-sync/{customerId}/ejercicio/{year}/contabilidad    [SoloSuperUsuario]
POST /api/accounting-coi/migration/aspel-sync/{customerId}/ejercicio/{year}/cobranza        [SoloSuperUsuario]
```

### Programacion Hangfire

```
0 9 * * 1-5   -> Encolar sincronizacion Aspel para clientes activos
0 12 * * 1-5  -> Encolar sincronizacion Aspel para clientes activos
0 16 * * 1-5  -> Encolar sincronizacion Aspel para clientes activos
```

### Flujo de uso

1. Hangfire despierta en el horario configurado.
2. El scheduler recorre `Customer.Active`.
3. Para cada cliente, resuelve `AspelCustomerEmpresa`.
4. Encola la sincronizacion correspondiente para contabilidad, cobranza o ambas.
5. El usuario tambien puede iniciar una ejecucion manual desde Angular en `configuration-menu`.
6. El backend consume Aspel por HTTP y persiste en la base local con `upsert`.

---

## 3. Estrategia de Datos

- Cada bloque sincronizado conserva:
  - `ExternalSource`
  - `ExternalId`
  - `SourceHash`
  - `SyncedAt`
- Si el hash no cambia, el registro no se reescribe.
- Si el hash cambia, solo se actualizan los campos relevantes.
- Las claves naturales ya quedaron definidas para:
  - `ContabilidadCuenta`
  - `ContabilidadSaldo`
  - `ContabilidadPresupuesto`
  - `ContabilidadPoliza`
  - `ContabilidadAuxiliar`
  - `ContabilidadFiscalPeriod`
  - `CobranzaCuenta`
  - `CobranzaSaldo`
  - `CobranzaPoliza`
  - `CobranzaAuxiliar`

---

## 4. Estado de Avance

- [x] Consulta HTTP de Aspel configurada
- [x] Mapeo `AspelCustomerEmpresa`
- [x] `upsert` por clave natural en contabilidad
- [x] `upsert` por clave natural en cobranza
- [x] Job recurrente de Hangfire
- [x] Ejecucion manual desde configuracion
- [x] Diagramas actualizados

---

## 5. Criterio de Cierre

La implementacion queda lista cuando:

- no hay duplicados por reejecucion,
- los registros cambian solo cuando Aspel cambia,
- la sincronizacion manual y automatica usan el mismo contrato,
- y el job puede correr varias veces sin degradar la data.

---

## 6. Documentos Historicos Reemplazados

Los siguientes archivos quedan obsoletos y no deben seguirse editando:

- `PLAN-UPSERT-ASPEL.md`
- `CARGA-SILENCIOSA-ASPEL.md`
- `MAPEO-ENTIDADES-ASPEL-COI.md`
