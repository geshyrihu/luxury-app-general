# Propuesta Tecnica: Ampliacion de API REST Aspel COI

| Campo | Valor |
|---|---|
| **De** | Equipo de Desarrollo - LuxuryApp |
| **Para** | Equipo de Desarrollo Aspel COI |
| **Fecha** | 15 de septiembre de 2026 |
| **Version** | 2.0 (Final) |
| **Autor** | Ricardo - Arquitecto de Software, LuxuryApp |

---

## 1. Contexto

LuxuryApp se integra con Aspel COI via una API REST expuesta en `shem.dyndns.ws`. Actualmente existen **5 endpoints GET de solo lectura** que devuelven el 100% de los registros sin filtros.

**Problema:**
- Full Table Scans en Firebird, tiempos >10s en condominios con alto volumen.
- Filtrado del lado de LuxuryApp (descarga MBs para filtrar en C#).
- Imposibilidad de crear, actualizar o eliminar registros contables desde LuxuryApp.
- Dependencia de procesos manuales en el escritorio de Aspel COI.

**Objetivo:**
1. Crear endpoints **GET nuevos (v2)** con parametros de filtro por rangos de cuentas, periodos y fechas.
2. Implementar endpoints **CRUD completos** para las 5 entidades contables principales.

---

## 2. Endpoints Existentes (sin cambios)

```
GET /api/AspelCOI/GetCuentas?intEmpresa={id}&intYear={year}
GET /api/AspelCOI/GetSaldos?intEmpresa={id}&intYear={year}
GET /api/AspelCOI/GetPresupuestos?intEmpresa={id}&intYear={year}
GET /api/AspelCOI/GetPolizas?intEmpresa={id}&intYear={year}
GET /api/AspelCOI/GetAuxiliares?intEmpresa={id}&intYear={year}
```

Estos endpoints permanecen intactos. Los v2 son **adicionales**, no los reemplazan.

---

## 3. Arquitectura

**Actual (solo lectura):**
```
LuxuryApp (.NET)
  -> IAspelCoiApiClient (5 metodos GET)
    -> API Aspel COI (shem.dyndns.ws)
      -> Firebird (CUENTASxx, SALDOSxx, PRESUPxx, POLIZASxx, AUXILIARxx)
```

**Propuesta (CRUD completo):**
```
LuxuryApp (.NET)
  -> IAspelCoiApiClient (CRUD completo)
    -> API Aspel COI (con validaciones transaccionales)
      -> Firebird (manteniendo integridad)
```

---

## 4. Estructura de Tablas Firebird (Validada)

| Tabla | Entidad | PK | Campos clave | Observaciones |
|---|---|---|---|---|
| `CTATER` | Config fiscal de cuentas | `CUENTA` | `IVADEFAULT`, `PORCENTAJEIVA` | Reglas fiscales por cuenta |
| `CUENTASxx` | Catalogo de cuentas | `NUM_CTA` | `NIVEL` (1-4), `TIPO` (A,P,C,I,E), `NATURALEZA` (1/2), `STATUS`, `CTA_PAPA` | `xx` = ejercicio (21-26) |
| `SALDOSxx` | Balanza de comprobacion | `NUM_CTA`, `EJERCICIO` | `INICIAL`, `CARGO01..14`, `ABONO01..14` | DOUBLE, saldos mensuales acumulados |
| `PRESUPxx` | Presupuesto global | `EJERCICIO`, `NUM_CTA` | `PRESUP01..14` | DOUBLE, por cuenta sin desglose |
| `PRESUPDPxx` | Presupuesto por depto | `EJERCICIO`, `NUM_CTA`, `DEPTO` | `PRESUP01..14` | Desglose por centro de costos |
| `POLIZASxx` | Cabecera de poliza | `TIPO_POLI`, `NUM_POLIZ`, `PERIODO` | `EJERCICIO`, `FECHA_POL` (TIMESTAMP), `CONCEP_PO` | PK compuesta |
| `AUXILIARxx` | Partidas de poliza | `TIPO_POLI`, `NUM_POLIZ`, `NUM_PART`, `PERIODO` | `NUM_CTA`, `DEBE_HABER` (D/A), `MONTOMOV` (DOUBLE) | PK compuesta |

> El sufijo `xx` corresponde al ejercicio fiscal (ej: `26` para 2026).

---

## 5. Endpoints GET Nuevos v2 (con filtros)

Parametros de consulta opcionales para aprovechar indices de Firebird (`WHERE NUM_CTA BETWEEN ...`), reduciendo payload de MBs a KBs.

### 5.1 GetCuentasV2

```
GET /api/AspelCOI/GetCuentasV2
```

| Parametro | Tipo | Req | Descripcion |
|---|---|---|---|
| `intEmpresa` | int | Si | ID de empresa |
| `intYear` | int | Si | Ejercicio fiscal |
| `numCtaInicio` | string | No | Rango inicial de cuenta |
| `numCtaFin` | string | No | Rango final de cuenta |
| `nivel` | int | No | Nivel de cuenta (1-4) |
| `tipo` | string | No | A(ctivo), P(asivo), C(apital), I(ngreso), E(greso) |
| `status` | string | No | A(ctivo), B(aja) |

```
GET /api/AspelCOI/GetCuentasV2?intEmpresa=12&intYear=26&nivel=4&tipo=E&status=A
```
> Solo trae cuentas analiticas de egresos activas.

### 5.2 GetCuenta (Individual)

```
GET /api/AspelCOI/GetCuenta?intEmpresa={id}&intYear={year}&numCta={codigo}
```

Retorna una sola cuenta por numero de cuenta exacto.

### 5.3 GetSaldosV2

```
GET /api/AspelCOI/GetSaldosV2
```

| Parametro | Tipo | Req | Descripcion |
|---|---|---|---|
| `intEmpresa` | int | Si | ID de empresa |
| `intYear` | int | Si | Ejercicio fiscal |
| `numCtaInicio` | string | No | Rango inicial de cuenta |
| `numCtaFin` | string | No | Rango final de cuenta |
| `numCtaExacta` | string | No | Cuenta exacta (sobreescribe rango) |

```
GET /api/AspelCOI/GetSaldosV2?intEmpresa=12&intYear=26&numCtaInicio=600-000&numCtaFin=699-999
```

### 5.4 GetPresupuestosV2

```
GET /api/AspelCOI/GetPresupuestosV2
```

| Parametro | Tipo | Req | Descripcion |
|---|---|---|---|
| `intEmpresa` | int | Si | ID de empresa |
| `intYear` | int | Si | Ejercicio fiscal |
| `numCtaInicio` | string | No | Rango inicial de cuenta |
| `numCtaFin` | string | No | Rango final de cuenta |
| `depto` | int | No | Departamento (solo para PRESUPDP) |

```
GET /api/AspelCOI/GetPresupuestosV2?intEmpresa=12&intYear=26&numCtaInicio=601-000&numCtaFin=601-999
```

### 5.5 GetPolizasV2

```
GET /api/AspelCOI/GetPolizasV2
```

| Parametro | Tipo | Req | Descripcion |
|---|---|---|---|
| `intEmpresa` | int | Si | ID de empresa |
| `intYear` | int | Si | Ejercicio fiscal |
| `tipoPoli` | string | No | DI, IG, EG |
| `periodo` | int | No | Periodo (1-14) |
| `numPoliz` | string | No | Numero de poliza exacto |
| `fechaInicio` | string | No | Fecha inicio (ISO 8601) |
| `fechaFin` | string | No | Fecha fin (ISO 8601) |

```
GET /api/AspelCOI/GetPolizasV2?intEmpresa=12&intYear=26&tipoPoli=EG&periodo=9
```

### 5.6 GetPoliza (Individual)

```
GET /api/AspelCOI/GetPoliza?intEmpresa={id}&intYear={year}&tipoPoli={code}&numPoliz={code}
```

Retorna poliza completa: cabecera + partidas de `AUXILIARxx`.

### 5.7 GetAuxiliaresV2 (el mas critico por volumen)

```
GET /api/AspelCOI/GetAuxiliaresV2
```

| Parametro | Tipo | Req | Descripcion |
|---|---|---|---|
| `intEmpresa` | int | Si | ID de empresa |
| `intYear` | int | Si | Ejercicio fiscal |
| `numCtaInicio` | string | No | Rango inicial de cuenta |
| `numCtaFin` | string | No | Rango final de cuenta |
| `tipoPoli` | string | No | DI, IG, EG |
| `periodo` | int | No | Periodo (1-14) |
| `fechaInicio` | string | No | Fecha inicio (ISO 8601) |
| `fechaFin` | string | No | Fecha fin (ISO 8601) |

```
GET /api/AspelCOI/GetAuxiliaresV2?intEmpresa=12&intYear=26&numCtaInicio=104-008-000&numCtaFin=104-008-999&periodo=9
```

---

## 6. Endpoints CRUD Nuevos (Escritura)

### Convenciones
- **Base URL:** `/api/AspelCOI`
- **Autenticacion:** Headers `username` + `password` (igual que actuales)
- **Formato:** JSON
- **Codigos HTTP:** 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 409 (Conflict), 500 (Error)

---

### 6.1 Cuentas (`CUENTASxx`)

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `POST` | `/CreateCuenta` | Crear cuenta |
| `PUT` | `/UpdateCuenta?intEmpresa={id}&intYear={year}&numCta={cta}` | Actualizar cuenta |
| `DELETE` | `/DeleteCuenta?intEmpresa={id}&intYear={year}&numCta={cta}` | Soft delete (`STATUS = 'B'`) |

**Payload POST/PUT:**
```json
{
  "numCta": "601-005-000-000",
  "nombre": "Gastos de Papeleria",
  "tipo": "E",
  "naturaleza": 1,
  "nivel": 4,
  "ctaPapa": "601-005-000",
  "status": "A",
  "codAgrup": "601005000000",
  "rfc": "",
  "deptsino": "N"
}
```

**Validaciones:**
- Unicidad de `NUM_CTA` por ejercicio.
- Existencia de `CTA_PAPA` si `NIVEL > 1`.
- `TIPO` valido: A, P, C, I, E.
- `NATURALEZA`: 1 (Deudora), 2 (Acreedora).

---

### 6.2 Saldos / Balanza (`SALDOSxx`)

> Los saldos normalmente se mueven via polizas. Este modulo es para **ajustes manuales** o sincronizacion de saldos iniciales.

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `PUT` | `/UpdateSaldo?intEmpresa={id}&intYear={year}&numCta={cta}` | Ajustar saldo inicial o movimientos de un mes |

**Payload:**
```json
{
  "inicial": 150000.00,
  "inicialEx": 0.00,
  "movimientos": {
    "01": { "cargo": 50000.00, "abono": 20000.00 },
    "02": { "cargo": 60000.00, "abono": 25000.00 }
  }
}
```

---

### 6.3 Presupuestos Global (`PRESUPxx`)

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `POST` | `/CreatePresupuesto` | Crear presupuesto anual |
| `PUT` | `/UpdatePresupuesto?intEmpresa={id}&intYear={year}&numCta={cta}` | Actualizar |
| `DELETE` | `/DeletePresupuesto?intEmpresa={id}&intYear={year}&numCta={cta}` | Eliminar |

**Payload:**
```json
{
  "numCta": "601-001-000",
  "ejercicio": 26,
  "presupuestos": {
    "01": 15000.00, "02": 15000.00, "03": 18000.00,
    "04": 15000.00, "05": 15000.00, "06": 15000.00,
    "07": 15000.00, "08": 15000.00, "09": 15000.00,
    "10": 15000.00, "11": 15000.00, "12": 15000.00,
    "13": 0.00, "14": 0.00
  }
}
```

**Validaciones:**
- `NUM_CTA` debe existir en `CUENTASxx`.
- Recomendado: validar que la cuenta sea de clase 4 (Ingresos) o 6 (Gastos).

---

### 6.4 Presupuestos Desglosado por Departamento (`PRESUPDPxx`)

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `POST` | `/CreatePresupuestoDepto` | Crear presupuesto por departamento |
| `PUT` | `/UpdatePresupuestoDepto?intEmpresa={id}&intYear={year}&numCta={cta}&depto={id}` | Actualizar |
| `DELETE` | `/DeletePresupuestoDepto?intEmpresa={id}&intYear={year}&numCta={cta}&depto={id}` | Eliminar |

**Payload:**
```json
{
  "numCta": "601-001-000",
  "ejercicio": 26,
  "depto": 1,
  "presupuestos": {
    "01": 8000.00, "02": 8000.00, "03": 10000.00
  }
}
```

---

### 6.5 Polizas y Partidas (`POLIZASxx` + `AUXILIARxx`)

> **Critico:** Las operaciones deben ser **atomicas**. Cabecera + partidas se crean/actualizan/eliminan en una sola transaccion.

| Metodo | Endpoint | Descripcion |
|---|---|---|
| `POST` | `/CreatePoliza` | Crear poliza con partidas |
| `PUT` | `/UpdatePoliza?intEmpresa={id}&intYear={year}&tipoPoli={tipo}&numPoliz={num}` | Actualizar poliza completa |
| `DELETE` | `/DeletePoliza?intEmpresa={id}&intYear={year}&tipoPoli={tipo}&numPoliz={num}` | Eliminar poliza + partidas |

**Payload POST/PUT:**
```json
{
  "tipoPoli": "DI",
  "numPoliz": "105",
  "periodo": 9,
  "ejercicio": 26,
  "fechaPol": "2026-09-15T10:30:00",
  "concepPo": "Ajuste por diferencia cambiaria",
  "partidas": [
    {
      "numPart": 1,
      "numCta": "205-001-000",
      "debeHaber": "D",
      "montoMov": 1500.50,
      "concepPo": "Diferencia cambiaria",
      "numDepto": 1,
      "ccostos": 0,
      "tipCambio": 1.00
    },
    {
      "numPart": 2,
      "numCta": "503-001-000",
      "debeHaber": "A",
      "montoMov": 1500.50,
      "concepPo": "Diferencia cambiaria"
    }
  ]
}
```

**Validaciones criticas:**
- **Partida doble:** Suma `MONTOMOV` en 'D' = Suma `MONTOMOV` en 'A'. Rechazar HTTP 400 si no cuadra.
- **Existencia de cuenta:** Cada `NUM_CTA` debe existir en `CUENTASxx` y no estar dado de baja.
- **Folio unico:** `TIPO_POLI + NUM_POLIZ` no debe existir en el mismo periodo.
- **Secuencia de partidas:** `NUM_PART` correlativo (1, 2, 3...).
- **Transaccionalidad:** Si falla una partida, rollback de toda la poliza.

---

## 7. Especificaciones Tecnicas Transversales

### 7.1 Mapeo de Tipos de Datos

| Tipo Firebird | Tipo JSON | Tipo C# (.NET) |
|---|---|---|
| `VARCHAR(n)` | `string` | `string` |
| `SMALLINT` | `integer` | `short` |
| `INTEGER` | `integer` | `int` |
| `DOUBLE` | `number` | `decimal` |
| `TIMESTAMP` | ISO 8601 string | `DateTime` |

### 7.2 Paginacion

Para GET con muchos registros, soportar paginacion:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 100,
    "totalRecords": 1543,
    "totalPages": 16
  }
}
```

### 7.3 Manejo de Errores

Formato estandar:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "La suma de cargos no es igual a la suma de abonos",
    "details": [
      "Total cargos: 1500.00",
      "Total abonos: 1450.00",
      "Diferencia: 50.00"
    ]
  }
}
```

---

## 8. Seguridad y Auditoria

1. **Autenticacion:** Mantener esquema actual (`username` + `password` en headers, desde Vault).
2. **Autorizacion:** Considerar roles (solo usuarios con permiso de "Captura" pueden POST/PUT/DELETE).
3. **Auditoria:** Registrar en bitacora de Aspel COI toda operacion de escritura (quien, cuando, que cambio).
4. **Idempotencia:** Endpoints POST deben ser idempotentes (enviar dos veces la misma poliza no debe duplicar).
5. **Soft Delete:** Para cuentas, usar `STATUS='B'`. Para polizas, DELETE fisico si no hay referencias posteriores.

---

## 9. Anexo: Mapeo Firebird <-> DTOs

### CUENTAS26 -> AspelCuentaDTO

| Campo Firebird | Campo DTO | Tipo |
|---|---|---|
| `NUM_CTA` | `NumCta` | string |
| `STATUS` | `Status` | string |
| `TIPO` | `Tipo` | string |
| `NOMBRE` | `Nombre` | string |
| `NIVEL` | `Nivel` | int |
| `NATURALEZA` | `Naturaleza` | int |
| `CTA_PAPA` | `CtaPapa` | string |
| `CTA_RAIZ` | `CtaRaiz` | string |
| `CODAGRUP` | `CodAgrup` | string |
| `RFC` | `Rfc` | string |

### POLIZAS26 -> AspelPolizaDTO

| Campo Firebird | Campo DTO | Tipo |
|---|---|---|
| `TIPO_POLI` | `TipoPoli` | string |
| `NUM_POLIZ` | `NumPoliz` | string |
| `PERIODO` | `Periodo` | int |
| `EJERCICIO` | `Ejercicio` | int |
| `FECHA_POL` | `FechaPol` | DateTime |
| `CONCEP_PO` | `ConcepPo` | string |

### AUXILIAR26 -> AspelAuxiliarDTO

| Campo Firebird | Campo DTO | Tipo |
|---|---|---|
| `TIPO_POLI` | `TipoPoli` | string |
| `NUM_POLIZ` | `NumPoliz` | string |
| `NUM_PART` | `NumPart` | int |
| `NUM_CTA` | `NumCta` | string |
| `DEBE_HABER` | `DebeHaber` | string |
| `MONTOMOV` | `MontoMov` | decimal |
| `CONCEP_PO` | `ConcepPo` | string |
| `NUMDEPTO` | `NumDepto` | int |
| `CCOSTOS` | `CCostos` | int |
| `TIPCAMBIO` | `TipCambio` | decimal |

---

## 10. Resumen de Endpoints

| Modulo | GET (lectura) | POST/PUT/DELETE (escritura) | Total |
|---|---|---|---|
| Cuentas | 2 (lista + individual) | 3 (crear, actualizar, baja) | **5** |
| Saldos | 1 | 1 (ajuste manual) | **2** |
| Presupuestos Global | 1 | 3 (crear, actualizar, eliminar) | **4** |
| Presupuestos Desglosado | 1 | 3 (crear, actualizar, eliminar) | **4** |
| Polizas + Partidas | 2 (lista + detalle) | 3 (crear, actualizar, eliminar) | **5** |
| **TOTAL** | **7** | **13** | **20 endpoints** |

---

## 11. Siguientes Pasos

1. Validar viabilidad de filtros en endpoints GET v2.
2. Confirmar compatibilidad de payloads CRUD con reglas de negocio internas.
3. Estimar timeline para despliegue en entorno de pruebas (`shem.dyndns.ws`).
4. Agendar sesion de 30 minutos para resolver dudas tecnicas sobre mapeo de campos.

---

*Equipo de Desarrollo - LuxuryApp*
