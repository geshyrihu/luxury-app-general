# Plan de Accion: AspelCobranzaHausLocal

## Objetivo

Construir un modulo paralelo que reemplace progresivamente las consultas live de Aspel COI para Cobranza Haus con consultas locales sobre snapshots sincronizados en SQL Server, manteniendo `AspelCobranzaHausLive` intacto.

## Resultado esperado

- Reducir de forma sustancial el tiempo de respuesta de `estado de cuenta` y `aviso de cobro`.
- Evitar descargas masivas en tiempo real desde Aspel para flujos operativos del usuario.
- Aprovechar la sincronizacion existente de `CobranzaMigratorService`.
- Poder migrar frontend por endpoint sin romper compatibilidad.

## Estado actual

- Fase 0 completada.
- Fase 1 completada.
- Fase 2 completada.
- Fase 3 completada.
- Fase 4 completada.
- Fase 5 iniciada:
  - el frontend ya permite alternar `live` y `local`.
  - faltan comparativas funcionales y QA con datos reales.
- Fase 6 pendiente.

## Alcance

- Crear modulo nuevo en `AspelCobranzaHausLocal`.
- Exponer endpoints paralelos.
- Consultar exclusivamente tablas locales `Cobranza*`.
- Mantener DTOs locales propios para no acoplarse al modulo live.
- Documentar arquitectura, fases y validaciones.

## Fuera de alcance

- Reemplazar o borrar `AspelCobranzaHausLive`.

## Inventario tecnico base

- Fuente live actual:
  - `AspelCobranzaHausLive/Services/AspelCobranzaHausAppService.cs`
  - `AspelCobranzaHausLive/Services/AspelCobranzaHausDetalleAppService.cs`
- Fuente local disponible:
  - `CobranzaMigratorService`
  - `ContabilidadMigrationJob`
  - `AspelMigrationSchedulerJob`
- Tablas locales:
  - `CobranzaCuentas`
  - `CobranzaSaldos`
  - `CobranzaPolizas`
  - `CobranzaAuxiliares`

## Arquitectura objetivo

### Modulo live

- Sigue atendiendo `api/aspel-cobranza`
- Sigue usando `IAspelCoiApiClient`
- No se modifica durante la construccion del modulo local

### Modulo local

- Atiende `api/aspel-cobranza-local`
- Usa `ApplicationDbContext`
- Reconstruye los reportes con queries SQL + logica de negocio en servicios locales
- Agrega endpoint `status` para revisar cobertura y frescura del snapshot
- Depende de una sincronizacion Aspel consistente para anio actual e historico reciente

## Estrategia funcional por endpoint

### 1. `customers`

- Leer desde `AspelCustomerEmpresa`
- Filtrar `Empresa == Cobranza`
- Ordenar por nombre de customer

### 2. `accounts`

- Leer desde `CobranzaCuentas`
- Filtrar por `CustomerId`
- Incluir solo cuentas base consultables de cobranza
- Normalizar cuentas `104-xxx-xxx-000` y equivalentes

### 3. `estado-cuenta-rango`

- Obtener cuenta base y nombre desde `CobranzaCuentas`
- Obtener saldo anual inicial desde `CobranzaSaldos`
- Ajustar saldo inicial al dia exacto con `CobranzaAuxiliares`
- Obtener movimientos por rango cruzando `CobranzaAuxiliares` + `CobranzaPolizas`
- Consolidar cargos consecutivos identicos si se mantiene esa regla de negocio
- Soportar rango multi-anio

### 4. `detalle-cobranza-rango`

- Construir catalogo de conceptos a partir de subcuentas nivel 4 y movimientos
- Calcular saldo inicial por concepto
- Aplicar cargos, abonos directos y pagos globales
- Reconciliar descuentos y adelantos
- Generar vencidos agrupados por fecha y concepto

### 5. `deudas-actuales`

- Recorrer cuentas base del customer
- Detectar si la cuenta usa desglose por subcuentas nivel 4
- Calcular saldo actual al corte con snapshot local
- Listar solo propiedades con saldo vigente positivo

### 6. `status`

- Contar cuentas, saldos, polizas y auxiliares del customer
- Exponer `lastSyncedAt` maximo por tabla
- Marcar readiness del snapshot para debugging funcional

## Fases

### Fase 0. Estructura

- Crear carpetas `Controller`, `DTOs`, `Interfaces`, `Services`
- Crear `README.md`
- Crear este plan
- Crear controller y contratos iniciales

### Fase 1. Read-only local baseline

- Implementar `customers`
- Implementar `accounts`
- Implementar `status`
- Validar compilacion

### Fase 2. Estado de cuenta local

- Portar reglas de normalizacion de cuentas
- Portar calculo de saldo inicial y saldo progresivo
- Reemplazar carga live por queries locales
- Validar contra casos reales conocidos

### Fase 3. Detalle cobranza / aviso de cobro local

- Portar clasificacion de conceptos
- Portar logica de aplicacion de pagos
- Validar descuentos, adelantos y vencidos
- Comparar salida contra live en cuentas muestra

### Fase 4. Deudas actuales local

- Portar balance al corte desde local
- Revisar cobertura de cuentas base y subcuentas
- Validar totales por customer

### Fase 5. Integracion gradual

- Agregar switch en frontend o endpoints paralelos para QA
- Validar tiempos de respuesta
- Medir diferencias vs live
- Migrar frontend al modulo local cuando pase QA

### Fase 6. Reescritura del job de sincronizacion

- Reescribir la orquestacion del job Aspel para soportar sincronizacion por rango de anios.
- Cambiar el scheduler global para encolar clientes con mapeo Aspel real, no todos los customers activos.
- Sincronizar al menos la ventana `anio actual` + `anio anterior` para soportar estado de cuenta multi-anio de `HausLocal`.
- Mantener compatibilidad con `SyncCompletaAsync(customerId, year)` para jobs manuales o llamadas existentes.
- Dejar trazabilidad clara en logs sobre customer, empresa, anio inicial y anio final.

## Reglas de implementacion

- No tocar `AspelCobranzaHausLive`.
- No cambiar rutas del modulo live.
- Mantener DTOs locales con sufijo `Local` para evitar colisiones.
- Documentar cualquier desviacion entre la semantica live y local.
- Si una consulta local aun no replica la semantica exacta, responder error controlado y no aproximaciones silenciosas.

## Riesgos detectados

- El snapshot actual es por anio; reportes multi-anio dependen de que exista sincronizacion para todos los anios consultados.
- La logica de descuentos y pagos globales puede depender de descripciones inconsistentes en origen.
- Puede haber cuentas hijas presentes en auxiliares pero ausentes en catalogo; la logica local debe contemplarlo.
- Cambiar el scheduler global incrementa la carga operativa de sincronizacion y debe monitorearse en Hangfire.

## Validaciones obligatorias

- Build `dotnet` sin errores.
- Comparativa local vs live para al menos 3 cuentas reales:
  - una cuenta solo nivel 3
  - una cuenta con desglose nivel 4
  - una cuenta con descuentos/adelantos
- Validacion de tiempos de respuesta.
- Validacion de ausencia de excepciones cuando no exista snapshot.

## Criterio de terminado

- Los endpoints locales responden con datos funcionales para los casos de negocio principales.
- Los resultados son consistentes con live dentro de tolerancia acordada.
- El tiempo de respuesta mejora perceptiblemente.
- El frontend puede consumir `api/aspel-cobranza-local` sin depender de Aspel live.

## Siguiente paso recomendado

Implementar primero `estado-cuenta-rango` local porque es el flujo con mayor costo actual y la logica es mas directa de portar desde saldos + auxiliares + polizas.
