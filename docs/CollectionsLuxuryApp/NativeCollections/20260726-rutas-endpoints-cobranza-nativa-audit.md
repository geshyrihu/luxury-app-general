# Auditoria de Rutas Front vs API - Cobranza Nativa

Fecha: 2026-07-26
Estado: En curso
Alcance: `client/angular/src/app/modules/collections.luxuryapp/cobranza-nativa` y flujos de Propiedades consumidos desde Cobranza Nativa

## Resumen

Se realizo un barrido de los endpoints consumidos por el front de Cobranza Nativa contra los endpoints publicados en:

- `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa`
- `api/LuxuryApp.Application/Moduls/SystemLuxuryApp/Infrastructure/SelectItem`
- `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Property`

Resultado actual:

- `H-001` Corregido: ruta de select de cuentas de propiedades quedaba sin prefijo `select-items`.
- `H-002` Corregido: alta/edicion de propiedades enviaba `property` en singular cuando el API publica `properties`.
- `H-003` Corregido: varios endpoints usaban query string `customer-id` cuando el backend espera `customerId`.
- `H-004` Corregido: generacion mensual de cargos se enviaba con payload JSON, pero el backend publica parametros simples por query string.

## Hallazgos

### H-001

Tipo: Ruta inexistente

Front:

- `select-items/property-accounts` se habia configurado como `property-accounts`

Back:

- `api/select-items/property-accounts/{customerId}/{year}`

Accion:

- Corregido en `shared.endpoints.ts`

### H-002

Tipo: Singular vs plural

Front:

- formulario de propiedades enviaba `POST property`

Back:

- `api/properties`

Accion:

- Corregido en `propiedades-form.ts`

### H-003

Tipo: Query param desalineado

Front:

- `customer-id`

Back:

- `customerId`

Endpoints corregidos:

- `cobranza/charges/bulk-import/saldo-inicial`
- `cobranza/notifications/process`
- `cobranza/charges/calculate-late-fees`
- alias de automatizacion relacionados

### H-004

Tipo: Contrato de transporte

Front:

- `POST cobranza/charges/generate-monthly` con body `{ customerId, month, year }`

Back:

- `POST api/cobranza/charges/generate-monthly` con parametros simples `customerId`, `month`, `year`

Accion:

- Corregido para enviar por query string
- Ajustado tambien el wrapper `cobranza-nativa-groups.const.ts`

## Estado de comparacion por grupos

- `CobranzaCore`: comparacion estatica principal completada
- `Properties` y `SelectItems` usados desde Cobranza Nativa: comparacion estatica completada
- `CobranzaLive` usados solo como apoyo en formulario de propiedades: ya encapsulados via `select-items/property-accounts`

## Pendientes siguientes

- `T-001` Ejecutar smoke test funcional de los flujos con mayor riesgo: Propiedades, Servicios Automatizados, Estado de Cuenta, Pagos y Saldos Iniciales.
- `T-002` Revisar endpoints `POST` con body obligatorio en cancelaciones y aprobaciones para confirmar que todos los formularios envian el DTO esperado.
- `T-003` Si aparecen nuevos 404/400, agregarlos a esta auditoria antes de tocar mas modulos.
