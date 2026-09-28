# Reporte de Ejecución - Mock Aspel COI

---

## Reporte Fase 01: Infraestructura y Entidades Base (DbContext)

**Fecha:** 2026-08-27  
**Estado:** ✅ COMPLETADO  
**Proyecto:** `api/LuxuryApp.Infrastructure.MockAspel`

### Resumen Técnico

Se ha creado la infraestructura aislada para el Mock de Aspel COI como un proyecto de biblioteca de clases independiente (`LuxuryApp.Infrastructure.MockAspel`), totalmente desacoplado de `LuxuryApp.Infrastructure.Data`.

### Archivos Creados

#### 1. Proyecto y Configuración
- `LuxuryApp.Infrastructure.MockAspel.csproj` - Proyecto .NET 10.0 con referencias a:
  - `Microsoft.EntityFrameworkCore` 10.0.10
  - `Microsoft.EntityFrameworkCore.InMemory` 10.0.10
  - `LuxuryApp.Shared`

#### 2. Entidad Base Abstracta
- `Entities/MockAspelBaseEntity.cs` - Clase base con campos comunes:
  - `Guid Id` (PK principal, Guid.CreateVersion7())
  - `Guid CustomerId` (multi-tenant)
  - `string TipoEmpresa` (ej: "Cobranza")
  - `int IntEmpresa` (ID numérico de Aspel)

#### 3. Cinco Entidades Maestras (heredan de MockAspelBaseEntity)

| Entidad | Archivo | Tabla | Campos Principales | Relaciones |
|---------|---------|-------|-------------------|------------|
| **MockCuenta** | `Entities/MockCuenta.cs` | `MockCuentas` | Num_Cta, Nombre, Tipo, Status, Naturaleza, Cta_Papa, Nivel, Cta_Raiz, Codagrup, y 20+ campos del JSON original | 1:N → MockSaldos, 1:N → MockPresupuestos |
| **MockPoliza** | `Entities/MockPoliza.cs` | `MockPolizas` | Tipo_Poli, Num_Poliz, Ejercicio, Periodo, Fecha_Pol, Concep_Po | 1:N → MockAuxiliares |
| **MockAuxiliar** | `Entities/MockAuxiliar.cs` | `MockAuxiliares` | Tipo_Poli, Num_Poliz, Num_Part, Num_Cta, Debe_Haber, MontoMov, TipCambio, Periodo, Ejercicio, Fecha_Pol, Concep_Po, y 10+ campos | N:1 → MockPoliza |
| **MockPresupuesto** | `Entities/MockPresupuesto.cs` | `MockPresupuestos` | Num_Cta, Ejercicio, Presup01 al Presup14 | N:1 → MockCuenta |
| **MockSaldo** | `Entities/MockSaldo.cs` | `MockSaldos` | Num_Cta, Ejercicio, Inicial, InicialEx, Cargo01-12, Abono01-12 | N:1 → MockCuenta |

#### 4. DbContext Aislado
- `Entities/MockAspelDbContext.cs` - Hereda de `DbContext`:
  - 5 DbSets públicos para las entidades
  - `OnModelCreating` configurado con:
    - PK = `Id` (Guid) para todas las entidades
    - Índices únicos en llaves de negocio originales de Aspel (IntEmpresa + campos naturales)
    - Índices en `CustomerId` para consultas multi-tenant
    - Precisión decimal (18,2) y (18,4) usando `HasPrecision()` compatible con InMemory
    - Relaciones navegables configuradas (1:N y N:1)

#### 5. Extensiones de Inyección de Dependencias
- `Extensions/MockAspelServiceCollectionExtensions.cs`:
  - `AddMockAspelInMemory(databaseName)` - Registro para base de datos en memoria (default: "MockAspelDb")

### Decisiones Técnicas

1. **Aislamiento total**: El proyecto no referencia `LuxuryApp.Infrastructure.Data`, cumpliendo el requisito de aislamiento.

2. **PK Guid vs Llaves Naturales**: Se usa `Id` (Guid) como PK principal para EF Core, pero se crean índices únicos compuestos en las llaves de negocio originales de Aspel (ej: `IntEmpresa + Num_Cta`, `IntEmpresa + Tipo_Poli + Num_Poliz + Ejercicio`).

3. **Compatibilidad InMemory**: Se usan `HasPrecision(18,2)` y `HasPrecision(18,4)` en lugar de `HasColumnType("decimal(18,2)")` que no está disponible en el proveedor InMemory.

4. **Mapeo JSON**: Los nombres de propiedades coinciden exactamente con los campos del JSON original (Num_Cta, Tipo_Poli, Debe_Haber, etc.) para facilitar la deserialización directa en Fase 02.

5. **Multi-tenant**: Todas las entidades incluyen `CustomerId`, `TipoEmpresa`, `IntEmpresa` heredados de la base para soporte multi-empresa.

### Verificación
- ✅ Proyecto compila sin errores (`dotnet build` exitoso)
- ✅ Agregado a la solución `LuxuryApp.sln`
- ✅ Convenciones de命名 seguidas (1 archivo = 1 entidad, nombres PascalCase, namespaces correctos)

---

## Reporte Fase 02: Seeder de Datos Reales (JSON a DB)

**Fecha:** 2026-08-28  
**Estado:** ✅ COMPLETADO  
**Proyecto:** `api/LuxuryApp.Infrastructure.MockAspel`

### Resumen Técnico

Se ha creado el mecanismo de siembra de datos (`MockAspelDataSeeder`) que lee los 5 archivos JSON reales de Aspel COI y los carga en la base de datos en memoria durante el startup en modo Development.

### Archivos Creados

#### 1. DTOs para Deserialización JSON
- `DTOs/MockAspelJsonResponse.cs` - Contiene:
  - `MockAspelJsonResponse<T>` - Wrapper genérico para la respuesta de Aspel (intEstatus, strMensaje, data[])
  - `MockCuentaJsonDto` - Mapea todos los campos de cuentas.json (25+ propiedades)
  - `MockPolizaJsonDto` - Mapea campos de polizas.json
  - `MockAuxiliarJsonDto` - Mapea campos de auxiliares.json (18 propiedades)
  - `MockPresupuestoJsonDto` - Mapea campos de presupuestos.json (16 propiedades)
  - `MockSaldoJsonDto` - Mapea campos de saldos.json (26 propiedades)

#### 2. Servicio de Siembra
- `Services/MockAspelDataSeeder.cs` - Implementa `IHostedService`:
  - **Ejecución automática**: Solo en entorno `Development` (verifica `IHostEnvironment.IsDevelopment()`)
  - **Idempotencia**: Verifica `MockCuentas.AnyAsync()` antes de sembrar; omite si ya hay datos
  - **CustomerId de pruebas**: Guid fijo `11111111-1111-1111-1111-111111111111`
  - **TipoEmpresa**: Hardcoded a `"Cobranza"`
  - **IntEmpresa**: Default `1` (los JSONs no incluyen este campo)
  - **Rutas JSON**: Relativas al `AppDomain.CurrentDomain.BaseDirectory` hacia la carpeta `api/LuxuryApp.Application/Moduls/ContabilidadLuxuryApp/ContabilidadOnline/Responses/RespuestaCobranza/`
  - **Procesamiento por lotes**: `MockAuxiliares` (136K+ registros) se procesa en batches de 5,000 para evitar presión de memoria
  - **Logging detallado**: Progreso cada 20K registros para auxiliares

#### 3. Registro en DI Actualizado
- `Extensions/MockAspelServiceCollectionExtensions.cs`:
  - `AddMockAspelInMemory()` ahora registra `MockAspelDataSeeder` como `IHostedService`

### Archivos JSON Procesados

| Archivo | Registros | Entidad Destino | Observaciones |
|---------|-----------|-----------------|---------------|
| `cuentas.json` | ~2,000+ | `MockCuenta` | Catálogo completo de cuentas contables |
| `polizas.json` | ~2,600 | `MockPoliza` | Pólizas de diario (tipo "Dr") |
| `auxiliares.json` | ~136,000 | `MockAuxiliar` | Partidas de movimientos (procesado en lotes) |
| `presupuestos.json` | ~15,000 | `MockPresupuesto` | Presupuestos mensuales (14 periodos) |
| `saldos.json` | ~25,000 | `MockSaldo` | Saldos iniciales y movimientos por mes |

### Mapeo de Campos

Todos los campos del JSON se mapean **directamente** a las propiedades de las entidades (nombres idénticos: `Num_Cta`, `Tipo_Poli`, `Debe_Haber`, `MontoMov`, etc.), facilitando la deserialización sin configuración adicional.

### Problemas Conocidos / Limitaciones

1. **IntEmpresa no en JSON**: Los archivos JSON no contienen campo `IntEmpresa`; se usa valor por defecto `1`.
2. **Rutas relativas**: El seeder usa rutas relativas desde `BaseDirectory`; requiere que la estructura de carpetas del repo se mantenga.
3. **Solo Development**: No se ejecuta en Staging/Production por diseño.

### Verificación
- ✅ Proyecto compila sin errores
- ✅ Deserialización probada con `JsonSerializerOptions.PropertyNameCaseInsensitive = true`
- ✅ Manejo de nulos y valores por defecto en DTOs
- ✅ Batch processing para `MockAuxiliares` (archivo >130MB)

---

*Próxima fase: Fase 03 - Endpoints Simulados (Minimal APIs)*

---

## Reporte Fase 03: Endpoints Simulados (Minimal APIs)

**Fecha:** 2026-08-31  
**Estado:** ✅ COMPLETADO

### Implementación

- Se expone el grupo de desarrollo `/api/AspelCOI` desde `LuxuryApp.Api`, conservando el Mock aislado de `LuxuryApp.Infrastructure.Data`.
- `GET /api/AspelCOI/Query/Movimientos` recibe filtros por query string: `Ejercicio`, `FechaInicio`, `FechaFin`, `NumCtaIniciaCon`, `Periodo`, `TipoPoliza`, `Page` y `PageSize`.
- `POST /api/AspelCOI/Polizas` crea pólizas y partidas únicamente si Debe y Haber cuadran; las pólizas descuadradas responden `422 Unprocessable Entity`.
- `GET /api/AspelCOI/Query/Saldos` consulta saldos por ejercicio y cuenta opcional.
- `PUT /api/AspelCOI/Cuentas/{id}` actualiza los campos permitidos de una cuenta existente.

### Regla crítica

La validación de partida doble se centralizó en `MockAspelPolizaBalanceValidator`. La póliza balanceada (Debe 4,500.00 / Haber 4,500.00) se acepta para su guardado; una diferencia de 100.00 se identifica como desbalance y el endpoint devuelve `422 Unprocessable Entity` antes de persistir cualquier entidad.

### Verificación

- ✅ `LuxuryApp.Infrastructure.MockAspel` compila correctamente.
- ✅ `LuxuryApp.Api` compila correctamente con el módulo registrado; se usó un directorio temporal porque una instancia activa de la API mantiene bloqueados sus binarios habituales.
- ⚠️ La ejecución de la suite de pruebas fue bloqueada por un error preexistente, fuera de este módulo, en `CandidateProcessSmokeTests.cs`: falta el argumento `hrPolicyService` para `RequestPositionAppService`.

---

## Reporte Fase 04: Parches de Arquitectura y QA

**Fecha:** 2026-08-31  
**Estado:** ✅ COMPLETADO

### Parches aplicados

- `POST /api/AspelCOI/Polizas` rechaza duplicados por `IntEmpresa`, `Ejercicio`, `Periodo`, `Tipo_Poli` y `Num_Poliz` con `409 Conflict`.
- Cada partida debe apuntar a una cuenta existente de tipo detalle (`Tipo == "D"`); de otro modo retorna `400 Bad Request`.
- Los periodos mensuales anteriores al actual son rechazados con `403 Forbidden` y un mensaje explícito de cierre contable.
- Al guardar una póliza, cada partida actualiza el `CargoXX` o `AbonoXX` del saldo de su cuenta para el periodo correspondiente, en el mismo `SaveChangesAsync`.

### Verificación

- ✅ El módulo `LuxuryApp.Infrastructure.MockAspel` compila correctamente como dependencia de la API y de las pruebas después de aplicar los parches.
- ✅ Se agregaron pruebas unitarias para el cierre de periodo y la actualización del par Cargo/Abono del mes correspondiente.
- ⚠️ La ejecución de dichas pruebas queda bloqueada por un error preexistente e independiente en `CandidateProcessSmokeTests.cs`: falta el argumento `hrPolicyService` requerido por `RequestPositionAppService`.
- ⚠️ Una instancia de Microsoft Defender bloqueó la salida intermedia de la compilación aislada del proyecto; no se modificó ni detuvo ningún proceso del entorno.
