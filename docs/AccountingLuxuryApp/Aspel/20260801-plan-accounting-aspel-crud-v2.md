# Propuesta Tecnica: Ampliacion de API REST Aspel COI (Version Ultra-Lean)

| Campo       | Valor                                       |
| ----------- | ------------------------------------------- |
| **De**      | Equipo de Desarrollo - LuxuryApp            |
| **Para**    | Equipo de Desarrollo Aspel COI              |
| **Fecha**   | 15 de septiembre de 2026                    |
| **Version** | 2.0 (Ultra-Lean - 7 endpoints)              |
| **Autor**   | Ricardo - Arquitecto de Software, LuxuryApp |

---

## 1. Contexto

LuxuryApp se integra con Aspel COI via una API REST expuesta en `shem.dyndns.ws`. Actualmente existen **5 endpoints GET de solo lectura** que devuelven el 100% de los registros sin filtros.

**Problema:**

- Full Table Scans en Firebird, tiempos >10s en condominios con alto volumen.
- Filtrado del lado de LuxuryApp (descarga MBs para filtrar en C#).
- Imposibilidad de crear asientos contables automaticamente desde LuxuryApp.

**Objetivo:**

1. Endpoints **GET** con parametros de filtro por rangos de cuentas, periodos y fechas.
2. Capacidad de **crear polizas contables** de forma atomica desde LuxuryApp.

---

## 2. Endpoints Existentes (sin cambios)

```
GET /api/AspelCOI/GetCuentas?intEmpresa={id}&intYear={year}
GET /api/AspelCOI/GetSaldos?intEmpresa={id}&intYear={year}
GET /api/AspelCOI/GetPresupuestos?intEmpresa={id}&intYear={year}
GET /api/AspelCOI/GetPolizas?intEmpresa={id}&intYear={year}
GET /api/AspelCOI/GetAuxiliares?intEmpresa={id}&intYear={year}
```

Los nuevos son **adicionales**, no reemplazan estos.

---

## 3. Estructura de Tablas Firebird (Validada)

| Tabla        | Entidad                 | PK                                              | Campos clave                                                                |
| ------------ | ----------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| `CUENTASxx`  | Catalogo de cuentas     | `NUM_CTA`                                       | `NIVEL` (1-4), `TIPO` (A,P,C,I,E), `NATURALEZA` (1/2), `STATUS`, `CTA_PAPA` |
| `SALDOSxx`   | Balanza de comprobacion | `NUM_CTA`, `EJERCICIO`                          | `INICIAL`, `CARGO01..14`, `ABONO01..14`                                     |
| `PRESUPxx`   | Presupuesto global      | `EJERCICIO`, `NUM_CTA`                          | `PRESUP01..14`                                                              |
| `PRESUPDPxx` | Presupuesto por depto   | `EJERCICIO`, `NUM_CTA`, `DEPTO`                 | `PRESUP01..14`                                                              |
| `POLIZASxx`  | Cabecera de poliza      | `TIPO_POLI`, `NUM_POLIZ`, `PERIODO`             | `FECHA_POL`, `CONCEP_PO`                                                    |
| `AUXILIARxx` | Partidas de poliza      | `TIPO_POLI`, `NUM_POLIZ`, `NUM_PART`, `PERIODO` | `NUM_CTA`, `DEBE_HABER` (D/A), `MONTOMOV`                                   |

> Sufijo `xx` = ejercicio fiscal (ej: `26` para 2026).

---

## 4. Convenciones

- **Base URL:** `/api/AspelCOI`
- **Formato:** JSON
- **Autenticacion:** Headers `username` + `password` (mismos que endpoints actuales, via Vault)
- **Errores:** `{ "error": { "code": "...", "message": "...", "details": [...] } }`
- **Codigos HTTP:** 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 500 (Error)

---

## 5. Los 7 Endpoints

### 5.1 Cuentas (Solo lectura)

#### `GET /api/AspelCOI/cuentas` (Lista o individual)

| Parametro      | Tipo   | Req | Descripcion                           |
| -------------- | ------ | --- | ------------------------------------- |
| `intEmpresa`   | int    | Si  | ID de empresa                         |
| `intYear`      | int    | Si  | Ejercicio fiscal                      |
| `numCta`       | string | No  | Si se envia, devuelve 1 cuenta exacta |
| `numCtaInicio` | string | No  | Rango inicial                         |
| `numCtaFin`    | string | No  | Rango final                           |
| `nivel`        | int    | No  | Nivel (1-4)                           |
| `tipo`         | string | No  | A, P, C, I, E                         |
| `status`       | string | No  | A (activa), B (baja)                  |

```
GET /api/AspelCOI/cuentas?intEmpresa=12&intYear=26&nivel=4&tipo=E&status=A
GET /api/AspelCOI/cuentas?intEmpresa=12&intYear=26&numCta=601-005-000
```

---

### 5.2 Saldos (Solo lectura)

#### `GET /api/AspelCOI/saldos`

| Parametro      | Tipo   | Req | Descripcion      |
| -------------- | ------ | --- | ---------------- |
| `intEmpresa`   | int    | Si  | ID de empresa    |
| `intYear`      | int    | Si  | Ejercicio fiscal |
| `numCta`       | string | No  | Cuenta exacta    |
| `numCtaInicio` | string | No  | Rango inicial    |
| `numCtaFin`    | string | No  | Rango final      |

```
GET /api/AspelCOI/saldos?intEmpresa=12&intYear=26&numCtaInicio=600-000&numCtaFin=699-999
```

---

### 5.3 Presupuestos (Global y por Departamento)

Un solo endpoint que cubre ambas tablas (`PRESUPxx` y `PRESUPDPxx`) usando el parametro `depto`.

#### `GET /api/AspelCOI/presupuestos`

| Parametro      | Tipo   | Req | Descripcion                                           |
| -------------- | ------ | --- | ----------------------------------------------------- |
| `intEmpresa`   | int    | Si  | ID de empresa                                         |
| `intYear`      | int    | Si  | Ejercicio fiscal                                      |
| `numCta`       | string | No  | Cuenta exacta                                         |
| `numCtaInicio` | string | No  | Rango inicial                                         |
| `numCtaFin`    | string | No  | Rango final                                           |
| `depto`        | int    | No  | Si se envia, consulta `PRESUPDPxx`. Si no, `PRESUPxx` |

```
GET /api/AspelCOI/presupuestos?intEmpresa=12&intYear=26&numCtaInicio=601-000&numCtaFin=601-999
GET /api/AspelCOI/presupuestos?intEmpresa=12&intYear=26&numCta=601-001-000&depto=1
```

#### `PUT /api/AspelCOI/presupuestos/{numCta}` (Crear o actualizar)

Si `depto` viene en el payload, opera sobre `PRESUPDPxx`. Si no, sobre `PRESUPxx`.

**Payload:**

```json
{
  "intEmpresa": 12,
  "intYear": 26,
  "depto": 1,
  "presupuestos": {
    "01": 15000.0,
    "02": 15000.0,
    "03": 18000.0,
    "04": 15000.0,
    "05": 15000.0,
    "06": 15000.0,
    "07": 15000.0,
    "08": 15000.0,
    "09": 15000.0,
    "10": 15000.0,
    "11": 15000.0,
    "12": 15000.0,
    "13": 0.0,
    "14": 0.0
  }
}
```

**Validaciones:**

- `NUM_CTA` debe existir en `CUENTASxx`.
- Recomendado: cuentas de clase 4 (Ingresos) o 6 (Gastos).

---

### 5.4 Polizas y Partidas

> **Critico:** Cabecera (`POLIZASxx`) + partidas (`AUXILIARxx`) deben ser **atomicas** en toda operacion de escritura.

#### `GET /api/AspelCOI/polizas` (Lista con filtros)

| Parametro     | Tipo   | Req | Descripcion             |
| ------------- | ------ | --- | ----------------------- |
| `intEmpresa`  | int    | Si  | ID de empresa           |
| `intYear`     | int    | Si  | Ejercicio fiscal        |
| `tipoPoli`    | string | No  | DI, IG, EG              |
| `periodo`     | int    | No  | Periodo (1-14)          |
| `fechaInicio` | string | No  | Fecha inicio (ISO 8601) |
| `fechaFin`    | string | No  | Fecha fin (ISO 8601)    |

```
GET /api/AspelCOI/polizas?intEmpresa=12&intYear=26&tipoPoli=EG&periodo=9
```

#### `GET /api/AspelCOI/polizas/{tipoPoli}/{numPoliz}` (Detalle completo)

Retorna cabecera + partidas de la poliza.

```
GET /api/AspelCOI/polizas/DI/105?intEmpresa=12&intYear=26&periodo=9
```

#### `POST /api/AspelCOI/polizas` (Crear poliza atomica)

**Payload:**

```json
{
  "intEmpresa": 12,
  "intYear": 26,
  "tipoPoli": "DI",
  "numPoliz": "105",
  "periodo": 9,
  "fechaPol": "2026-09-15T10:30:00",
  "concepPo": "Ajuste por diferencia cambiaria",
  "partidas": [
    {
      "numPart": 1,
      "numCta": "205-001-000",
      "debeHaber": "D",
      "montoMov": 1500.5,
      "concepPo": "Diferencia cambiaria",
      "numDepto": 1,
      "ccostos": 0,
      "tipCambio": 1.0
    },
    {
      "numPart": 2,
      "numCta": "503-001-000",
      "debeHaber": "A",
      "montoMov": 1500.5,
      "concepPo": "Diferencia cambiaria"
    }
  ]
}
```

**Validaciones en escritura:**

- **Partida doble:** Suma Debe = Suma Haber. Rechazar HTTP 400 si no cuadra.
- **Existencia de cuenta:** Cada `NUM_CTA` debe existir en `CUENTASxx` y no estar dado de baja.
- **Folio unico:** `TIPO_POLI + NUM_POLIZ` no duplicado en el mismo periodo.
- **Secuencia:** `NUM_PART` correlativo (1, 2, 3...).
- **Transaccionalidad:** Si falla una partida, rollback completo.

---

## 6. Resumen

| #   | Metodo | Endpoint                 | Descripcion                  | Impacto            |
| --- | ------ | ------------------------ | ---------------------------- | ------------------ |
| 1   | `GET`  | `/cuentas`               | Lista/individual con filtros | Alto (rendimiento) |
| 2   | `GET`  | `/saldos`                | Solo lectura con filtros     | Alto (rendimiento) |
| 3   | `GET`  | `/presupuestos`          | Global/depto con filtros     | Medio              |
| 4   | `PUT`  | `/presupuestos/{numCta}` | Crear o actualizar           | Medio              |
| 5   | `GET`  | `/polizas`               | Lista con filtros            | Alto (rendimiento) |
| 6   | `GET`  | `/polizas/{tipo}/{num}`  | Detalle completo             | Alto               |
| 7   | `POST` | `/polizas`               | Crear poliza atomica         | **Critico**        |
|     |        | **TOTAL**                | **7 endpoints**              |                    |

> El CRUD de cuentas (`CUENTASxx`) se omite en esta fase: es una operacion anual que se gestiona desde el escritorio de Aspel COI.

---

## 7. Siguientes Pasos

1. Validar viabilidad de filtros en endpoints GET.
2. Confirmar compatibilidad de payloads con reglas de negocio internas.
3. Estimar timeline para despliegue en entorno de pruebas (`shem.dyndns.ws`).
4. Agendar sesion de 30 minutos para resolver dudas tecnicas.

---

_Equipo de Desarrollo - LuxuryApp_
