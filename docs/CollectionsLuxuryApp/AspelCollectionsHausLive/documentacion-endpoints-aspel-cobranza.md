# Documentacion de Endpoints: Integracion Aspel COI (Haus)

Esta API consulta informacion contable directamente desde Aspel COI para flujos de cobranza Haus. El modulo expone rutas publicas bajo:

- `https://luxurybuildingapp.com/api/aspel-cobranza/*`

## Estado actual del controller

Hoy el controller deja activas estas rutas:

1. `customers`
2. `accounts`
3. `deudas-actuales`
4. `detalle-cobranza-rango`
5. `estado-cuenta-rango`

Esta documentacion refleja lo activo hoy en API.

---

## Flujo recomendado de consumo hoy

1. Obtener `customerId` del edificio con `customers`.
2. Obtener cuentas disponibles con `accounts`.
3. Para una propiedad puntual:
   - usar `detalle-cobranza-rango` para aviso de cobro detallado y composicion de deuda;
   - usar `estado-cuenta-rango` para historial cronologico de cargos y abonos.
4. Para listar deudas vigentes de todas las propiedades de un customer, usar `deudas-actuales`.
5. Los PDFs se generan en el frontend Angular con `pdfMake`. Ver seccion **Generacion de PDF en frontend**.

---

## 1. GetCustomers

**Proposito:** Lista los edificios o condominios que tienen mapeo Aspel configurado para `Cobranza`.

- **URL:** `GET https://luxurybuildingapp.com/api/aspel-cobranza/customers`
- **Autenticacion:** Publica (`AllowAnonymous`)

### Respuesta

```json
{
  "success": true,
  "data": [
    {
      "customerId": "019c6bee-0309-7269-9571-2980e06b823a",
      "name": "Hoteles Gran Clase"
    }
  ]
}
```

---

## 2. GetAccountsByCustomer

**Proposito:** Devuelve el catalogo de cuentas Aspel del edificio para un ejercicio fiscal.

- **URL:** `GET https://luxurybuildingapp.com/api/aspel-cobranza/accounts`
- **Parametros:**
  - `customerId` (`Guid`): requerido.
  - `year` (`int`): requerido.

### Comportamiento actual

- Filtra cuentas cuyo numero inicia con `"104"`.
- Solo devuelve cuentas cuyo ultimo segmento es `000`, es decir cuentas consolidadoras de nivel 4 (ej. `104-001-012-000`).
- El patron efectivo es `104-XXX-XXX-000`.
- El parametro `year` sigue formando parte del contrato, aunque el mapeo de empresa Aspel no depende de el.

### Respuesta

```json
{
  "success": true,
  "data": {
    "customerId": "019c6bee-0309-7269-9571-2980e06b823a",
    "totalCondominos": 45,
    "cuentas": [
      {
        "numCta": "103-008-002-000",
        "nombre": "HOTELES GRAN CLASE",
        "estatus": "A"
      }
    ]
  }
}
```

---

## 3. GetDeudasActuales

**Proposito:** Lista todas las propiedades o condominios de un `customer` que al corte tienen deuda vigente. El endpoint esta preparado para clientes que trabajan con cuentas de 3 niveles y para clientes que ya usan desglose a 4 niveles.

- **URL:** `GET https://luxurybuildingapp.com/api/aspel-cobranza/deudas-actuales`
- **Parametros:**
  - `customerId` (`Guid`): requerido.
  - `fechaCorte` (`date`): opcional, formato `YYYY-MM-DD`. Si no se envia, usa la fecha actual del servidor.

### Objetivo funcional

- Enlistar solo propiedades con `saldoActual > 0`.
- Detectar si la propiedad maneja deuda global o desglose por concepto.
- Permitir al frontend abrir el detalle de la deuda sobre la misma cuenta base.

### Soporte de cuentas de 3 o 4 niveles

El endpoint detecta automaticamente el esquema contable de cada propiedad:

- Si la base tiene hijas nivel 4 como `103-008-002-001`, `...-002`, etc., marca `tiene_desglose_conceptos = true`.
- Si no existen hijas nivel 4, trata la cuenta base como deuda global y marca `tiene_desglose_conceptos = false`.
- Soporta cuentas base de 3 niveles como `104-001-012`.
- Soporta cuentas base de 4 niveles tipo consolidado como `103-008-002-000`.

### Como calcula la deuda actual

Para cada propiedad:

1. Identifica la cuenta base operativa.
2. Revisa si tiene subcuentas hijas nivel 4.
3. Calcula el saldo al corte:
   - si hay hijas nivel 4, consolida los movimientos de esas hijas;
   - si no hay hijas, usa la cuenta directa o global.
4. Usa `GetSaldosAsync` para el arrastre del ejercicio y `GetAuxiliaresAsync` para sumar movimientos hasta la fecha de corte.
5. Solo devuelve cuentas con saldo positivo.

### Respuesta

```json
{
  "success": true,
  "data": {
    "customerId": "019c6bee-0309-7269-9571-2980e06b823a",
    "fechaCorte": "11/05/2026",
    "totalPropiedadesConDeuda": 2,
    "totalDeudaActual": 3707883.48,
    "propiedades": [
      {
        "numCtaBase": "103-008-002-000",
        "departamento": "HOTELES GRAN CLASE",
        "saldoActual": 3707883.48,
        "tieneDesgloseConceptos": true,
        "totalConceptos": 4
      },
      {
        "numCtaBase": "104-001-012",
        "departamento": "T1-GH012",
        "saldoActual": 25258.0,
        "tieneDesgloseConceptos": false,
        "totalConceptos": 1
      }
    ]
  }
}
```

---

## 4. GetDetalleCobranzaRango

**Proposito:** Devuelve el detalle de cobranza por concepto, vencidos y aplicaciones de pago para construir aviso de cobro detallado y composicion de deuda.

- **URL:** `GET https://luxurybuildingapp.com/api/aspel-cobranza/detalle-cobranza-rango`
- **Parametros:**
  - `customerId` (`Guid`): requerido.
  - `numCta` (`string`): requerido.
- **Nota:** No recibe fecha. El servidor usa `DateTime.Today` como fecha de corte y `01/01` del ejercicio en curso como fecha de inicio.

### Objetivo funcional

- Mostrar de que se compone la deuda total.
- Separar deuda vigente, vencidos y adelantos.
- Etiquetar pagos con concepto util para frontend y PDF.
- Soportar cuentas con desglose nivel 4 y cuentas globales.
- Evitar que el usuario recorte artificialmente la deuda con una fecha inicial manual.

### Reglas funcionales actuales

- El endpoint no recibe ninguna fecha.
- La fecha de corte se determina internamente como `DateTime.Today` en el servidor.
- La consulta se reconstruye internamente desde el `01/01` del ejercicio en curso.
- Si la cuenta tiene subcuentas nivel 4, las interpreta como conceptos de cobranza.
- Si no existe desglose nivel 4, cae a una sola cuenta global.
- Los pagos globales se aplican con esta prioridad:
  1. mantenimiento
  2. multas
  3. intereses
  4. extraordinarios
  5. otros
- Los sobrepagos o saldos a favor se reportan como `adelantos`.
- Los cargos abiertos que tengan misma `fecha` y mismo `conceptoDetalle` se agrupan para salida visual en vencidos.

### Estructura del payload

```json
{
  "success": true,
  "data": {
    "numCtaBase": "103-008-002-000",
    "departamento": "HOTELES GRAN CLASE",
    "fechaInicio": "01/01/2026",
    "fechaFin": "19/05/2026",
    "saldoInicialTotal": 0.0,
    "totalCargos": 4508320.0,
    "totalAbonos": 800436.52,
    "saldoFinalTotal": 3707883.48,
    "totalAdelantos": 0.0,
    "totalConceptos": 4,
    "conceptos": [
      {
        "numCta": "103-008-002-001",
        "concepto": "CUOTA DE MTTO",
        "nombreCuenta": "CUOTA DE MTTO HOTELES GRAN CLASE",
        "saldoInicial": 0.0,
        "cargos": 2835290.0,
        "abonos": 567058.0,
        "saldoFinal": 2268232.0,
        "totalVencido": 2268232.0,
        "adelanto": 0.0,
        "vencidos": [
          {
            "fechaCargo": "01/02/2026",
            "conceptoDetalle": "CUOTA DE MTTO FEBRERO 2026",
            "saldoPendiente": 567058.0
          }
        ]
      }
    ]
  }
}
```

### Uso sugerido

- Base para aviso de cobro detallado (PDF frontend).
- Vista de composicion de deuda por concepto para cobranza Haus.

---

## 5. GetEstadoCuentaRango

**Proposito:** Genera un estado de cuenta detallado por rango de fechas. Soporta rangos que cruzan varios ejercicios fiscales.

- **URL:** `GET https://luxurybuildingapp.com/api/aspel-cobranza/estado-cuenta-rango`
- **Parametros:**
  - `customerId` (`Guid`): requerido.
  - `numCta` (`string`): requerido.
  - `fechaInicio` (`date`): requerido, formato `YYYY-MM-DD`.
  - `fechaFin` (`date`): requerido, formato `YYYY-MM-DD`.

### Comportamiento actual relevante

- Soporta cuentas de 3 niveles y bases `...-000`.
- Si la cuenta base consolidada tiene movimientos en hijas nivel 4, los suma dentro del estado de cuenta de la base.
- El concepto del movimiento prioriza el concepto de auxiliares (`auxiliar.ConcepPo`) y solo cae al encabezado de poliza si el auxiliar no trae descripcion util.
- Los cargos contiguos con misma `fecha` y mismo `concepto` se agrupan en una sola linea.
- Los abonos no se agrupan en esa regla.

### Respuesta

```json
{
  "success": true,
  "data": {
    "numCta": "103-008-002-000",
    "departamento": "HOTELES GRAN CLASE",
    "fechaInicio": "01/01/2026",
    "fechaFin": "30/04/2026",
    "saldoInicial": 12500.0,
    "saldoFinal": 23100.0,
    "movimientos": [
      {
        "id": "ASP-2026-01-00001",
        "fecha": "01/01/2026",
        "tipo": "cargo",
        "concepto": "CUOTA MTTO ENERO 2026",
        "monto": 3500.0,
        "saldoAnterior": 12500.0,
        "saldoPosterior": 16000.0
      }
    ]
  }
}
```

### Logica de saldo inicial

El saldo inicial no sale solo de auxiliares. Se construye con:

1. `GetSaldosAsync` del ejercicio de `fechaInicio`.
2. El campo `Inicial` del saldo anual.
3. Los cargos y abonos de meses previos del mismo ejercicio.
4. Los movimientos del mismo mes anteriores al dia exacto de `fechaInicio`.

Con esto se obtiene el saldo de apertura real al corte del rango.

### Logica multi-anio

Como Aspel COI responde por ejercicio, el endpoint:

1. Determina los anios entre `fechaInicio` y `fechaFin`.
2. Consulta Aspel por cada anio involucrado.
3. Consolida movimientos cronologicamente.
4. Calcula saldo progresivo sobre el rango completo.

---

## 6. Generacion de PDF en frontend

Los PDFs se generan en Angular usando `pdfMake`. El servicio es `AspelCobranzaHausPdfService`. No hay endpoint de descarga activo en backend.

Cada documento tiene dos variantes de descarga expuestas en el componente:

| Boton                             | Metodo del servicio PDF                                         | Diferencia                                              |
| --------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| "Aviso de cobro"                  | `downloadAvisoCobro(data, date)`                                | Sin numero de cuenta Aspel en tabla de vencidos         |
| "Aviso de cobro (Aspel)"          | `downloadAvisoCobro(data, date, { showAspelAccounts: true })`   | Muestra `numCta` Aspel en tabla de vencidos y conceptos |
| "Estado de cuenta"                | `downloadEstadoCuenta(data, date)`                              | Sin numero de cuenta Aspel                              |
| "Estado de cuenta (Aspel)"        | `downloadEstadoCuenta(data, date, { showAspelAccounts: true })` | Muestra `numCta` Aspel en la tabla de movimientos       |

### 6.1 Aviso de Cobro

**Fuente de datos:** `detalle-cobranza-rango` → `AspelCobranzaDetalleResponse`

**Disparado desde:** boton "Aviso de cobro" en modo `detalle-cobranza-rango`.

**Nombre del archivo generado:** `Aviso-Cobro-{numCtaBase}-{fechaFin}.pdf`

**Orientacion:** Carta vertical (LETTER portrait)

#### Mapa campo → zona del PDF

| Zona del PDF                                   | Campo(s) del response                                                         |
| ---------------------------------------------- | ----------------------------------------------------------------------------- |
| Encabezado: nombre del edificio                | `CustomerIdService.customerName()` (contexto Angular, no del response)        |
| Encabezado: logo                               | `CustomerIdService.customerPhotoPath()` convertido a base64                   |
| Encabezado: badge                              | Texto fijo `"COBRANZA"`                                                       |
| Encabezado: codigo documento                   | Texto fijo `"COB-ASP-HAUS"`                                                   |
| Encabezado: fecha de generacion                | `new Date()` al momento del click                                             |
| Titulo principal                               | Texto fijo `"AVISO DE COBRO"`                                                 |
| Propiedad                                      | `data.departamento`                                                           |
| Periodo consultado                             | `data.fechaInicio` al `data.fechaFin`                                         |
| Resumen superior: Cargos                       | Suma de `concepto.cargos` de todos los conceptos visibles                     |
| Resumen superior: Abonos                       | Suma de `concepto.abonos` de todos los conceptos visibles                     |
| Resumen superior: Vencido actual               | Suma de `concepto.totalVencido` de todos los conceptos visibles               |
| Tabla de deuda por concepto: fila por concepto | Un `concepto` de `data.conceptos` donde al menos un campo es distinto de cero |
| - Concepto (label)                             | `concepto.concepto`                                                           |
| - Nombre subcuenta                             | `concepto.nombreCuenta` (si difiere del concepto)                             |
| - Cargos                                       | `concepto.cargos`                                                             |
| - Abonos                                       | `concepto.abonos`                                                             |
| - Vencido                                      | `concepto.totalVencido`                                                       |
| - Pendiente                                    | `concepto.saldoFinal`                                                         |
| Fila intereses moratorios                      | Valor simulado estatico: `$1,850.00`                                          |
| Fila descuento pronto pago                     | Valor simulado estatico: `-$2,500.00`                                         |
| Fila totales de la tabla                       | Sumas calculadas + `data.saldoFinal` con simulacion                           |
| Seccion saldos vencidos                        | Solo conceptos donde `concepto.vencidos` tiene items con `saldoPendiente > 0` |
| - Agrupacion por concepto                      | `concepto.concepto` como titulo de grupo                                      |
| - Fecha                                        | `vencido.fechaCargo`                                                          |
| - Detalle                                      | `vencido.conceptoDetalle`                                                     |
| - Pendiente                                    | `vencido.saldoPendiente`                                                      |
| Seccion adelantos a favor                      | Solo si `suma(concepto.adelanto) > 0`                                         |
| - Concepto                                     | `concepto.concepto`                                                           |
| - Cuenta                                       | `concepto.numCta`                                                             |
| - Monto adelanto                               | `concepto.adelanto`                                                           |
| Nota al pie del documento                      | Texto fijo explicativo                                                        |
| Footer: empresa                                | Texto fijo `"Luxury Building Group SA de CV"`                                 |
| Footer: fecha/hora                             | `new Date()` formateado                                                       |
| Footer: paginacion                             | Automatico pdfMake                                                            |

#### Conceptos visibles (filtro aplicado al generar)

Un concepto aparece en el PDF solo si al menos uno de estos campos es distinto de cero:
`saldoInicial`, `cargos`, `abonos`, `saldoFinal`, `totalVencido`, `adelanto`,
o si alguno de sus `vencidos` tiene `saldoPendiente > 0`.

Los conceptos se ordenan por `saldoFinal` descendente.

---

### 6.2 Estado de Cuenta

**Fuente de datos:** `estado-cuenta-rango` → `AspelEstadoCuentaResponse`

**Disparado desde:** boton "Estado de cuenta" en modo `estado-cuenta-rango`.

**Nombre del archivo generado:** `Estado-Cuenta-{numCta}-{fechaFin}.pdf`

**Orientacion:** Carta horizontal (LETTER landscape)

#### Mapa campo → zona del PDF

| Zona del PDF                                  | Campo(s) del response                                       |
| --------------------------------------------- | ----------------------------------------------------------- |
| Encabezado: nombre del edificio               | `CustomerIdService.customerName()`                          |
| Encabezado: nombre corto                      | `CustomerIdService.nombreCorto()`                           |
| Encabezado: logo                              | `CustomerIdService.customerPhotoPath()` convertido a base64 |
| Encabezado: badge                             | Texto fijo `"CONTABILIDAD"`                                 |
| Encabezado: codigo documento                  | Texto fijo `"Luxury Building Group"`                        |
| Encabezado: fecha de generacion               | `new Date()` al momento del click                           |
| Titulo principal                              | Texto fijo `"ESTADO DE CUENTA"`                             |
| Cuenta                                        | `data.numCta`                                               |
| Propiedad                                     | `data.departamento`                                         |
| Periodo consultado                            | `data.fechaInicio` al `data.fechaFin`                       |
| Metrica: Saldo inicial                        | `data.saldoInicial`                                         |
| Metrica: Saldo final                          | `data.saldoFinal`                                           |
| Metrica: Cargos                               | Suma de `mov.monto` donde `mov.tipo === "cargo"`            |
| Metrica: Abonos                               | Suma de `mov.monto` donde `mov.tipo !== "cargo"`            |
| Tabla de movimientos: una fila por movimiento | Un item de `data.movimientos`                               |
| - Tipo                                        | `"CAR"` si cargo, `"ABO"` si abono                          |
| - Numero                                      | Ultima parte del `mov.id` (formato `ASP-YYYY-MM-XXXXX`)     |
| - Fecha                                       | `mov.fecha`                                                 |
| - Concepto del movimiento                     | `mov.concepto`                                              |
| - Saldo inicial (columna)                     | `mov.saldoAnterior`                                         |
| - Cargos (columna)                            | `mov.monto` si es cargo, vacio si es abono                  |
| - Abonos (columna)                            | `mov.monto` si es abono, vacio si es cargo                  |
| - Saldo final (columna)                       | `mov.saldoPosterior` (en rojo si negativo)                  |
| Fila de totales                               | Sumas calculadas + `data.saldoFinal`                        |
| Footer: empresa                               | Texto fijo `"Luxury Building Group SA de CV"`               |
| Footer: cuenta y periodo                      | `data.numCta`, `data.fechaInicio`, `data.fechaFin`          |
| Footer: paginacion                            | Automatico pdfMake                                          |

#### Clasificacion de tipo de movimiento

El servicio determina si un movimiento es cargo comparando:

```
mov.tipo.toLowerCase() === "cargo"
```

Los movimientos de abono aparecen en columna "Abonos" en verde; los de cargo en columna "Cargos" en azul.

## Notas tecnicas para issac

1. Todos los endpoints activos del modulo son `AllowAnonymous`.
2. Los ids de movimiento son sinteticos para soporte UI: `ASP-YYYY-MM-XXXXX`.
3. `detalle-cobranza-rango` no recibe ninguna fecha; la fecha de corte es `DateTime.Today` en servidor.
4. `detalle-cobranza-rango` es el endpoint principal para composicion de deuda y aviso de cobro PDF.
5. `estado-cuenta-rango` es el endpoint principal para historial cronologico y PDF de estado de cuenta.
6. Los PDFs los genera `AspelCobranzaHausPdfService` en Angular usando `pdfMake`. No hay endpoint de descarga activo en backend.
7. Los valores de intereses moratorios (`$1,850`) y descuento por pronto pago (`$2,500`) en el aviso de cobro son simulados y estan hardcodeados en el servicio PDF. No vienen del response Aspel.
