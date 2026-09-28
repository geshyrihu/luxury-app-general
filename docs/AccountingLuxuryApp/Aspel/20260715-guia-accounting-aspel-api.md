# Guía de Referencia — API Aspel COI

> Documento rector para el módulo Cobranza Online.  
> Toda lectura de datos desde Aspel debe basarse en esta guía.  
> **ChargeTemplate queda excluido como fuente de cuotas.**

---

## Endpoints disponibles y su propósito

| Endpoint | Archivo ejemplo | Propósito |
|---|---|---|
| `GET /cuentas` | `cuentas.json` | Catálogo completo del plan de cuentas |
| `GET /saldos` | `saldos.json` | Saldos mensuales (cargo/abono) por cuenta y por año |
| `GET /auxiliares` | `auxiliares.json` | Movimientos individuales (partidas de póliza) por cuenta |
| `GET /polizas` | `polizas.json` | Cabeceras de pólizas (número, tipo, fecha, concepto) |

---

## 1. Cuentas (`/cuentas`)

### Estructura de respuesta
```json
{
  "intEstatus": 1,
  "strMensaje": "OK",
  "data": [
    {
      "Num_Cta": "104-001-001-000",
      "Status": "A",
      "Tipo": "D",
      "Nombre": "A-101 DANIEL DANA",
      "Deptsino": "N",
      "Nivel": 3,
      "Cta_Papa": "104-001-000-000",
      "Cta_Raiz": "104-000-000-000",
      "Codagrup": "105.01"
    }
  ]
}
```

### Campos relevantes

| Campo | Tipo | Descripción |
|---|---|---|
| `Num_Cta` | string | Número de cuenta en formato `AAA-BBB-CCC-DDD` |
| `Status` | string | `"A"` = Activa, `"B"` = Baja |
| `Tipo` | string | `"A"` = Acumulativa (padre), `"D"` = De detalle (hoja) |
| `Nombre` | string | Nombre del condómino o torre |
| `Nivel` | int | 1 = raíz, 2 = torre, 3 = departamento |
| `Cta_Papa` | string | Cuenta padre inmediata |
| `Cta_Raiz` | string | Cuenta raíz de la jerarquía |

### Estructura del plan de cuentas para condóminos (104)

```
104-000-000-000   CONDOMINOS (Nivel 1, raíz)
  104-001-000-000   TORRE ACACIA (Nivel 2, acumulativa)
    104-001-001-000   A-101 DANIEL DANA (Nivel 3, ACUMULATIVA = 1 departamento)
      104-001-001-001   · cuota de mantenimiento   (Nivel 4, Tipo "D")
      104-001-001-002   · descuento pronto pago    (Nivel 4, Tipo "D")
      104-001-001-003   · cuota extraordinaria     (Nivel 4, Tipo "D")
    104-001-002-000   A-102 ANTONIO BELLORIN
    ...
  104-002-000-000   TORRE OLIVO 1 (Nivel 2)
  104-003-000-000   TORRE OLIVO 2
  104-004-000-000   TORRE CIRUELO 1
  104-005-000-000   TORRE CIRUELO 2
  104-006-000-000   TORRE CIRUELO 3
```

> **Un departamento = una cuenta de Nivel 3 que TIENE subcuentas de nivel 4.**
> Esa cuenta es `Tipo = "A"` (acumulativa); las `Tipo = "D"` de nivel 3 son cuentas
> vacías. Ver el aviso de la siguiente sección.

### Cómo contar departamentos

**Regla vigente** — se cuenta por cuota aplicada, no por catálogo:

```
condominos(mes M) = cantidad de cuentas de nivel 3 DISTINTAS cuya
                    subcuenta de mantenimiento (-001) tiene CargoMM > 0
```

Verificado contra `saldos.json` de Avivia 58: **312** en junio, julio y agosto de 2026,
con suma de cargos `-001` de agosto = 4,273,028 (coincide con el total de mantenimiento del dashboard).

> ⚠️ **No usar `Tipo = "D"` para identificar departamentos.** En Aspel una cuenta que tiene
> subcuentas es **acumulativa** (`Tipo = "A"`); las `Tipo = "D"` son hojas sin hijos.
> Sobre los datos reales de Avivia 58: de las 625 cuentas `104-XXX-YYY-000`, **312 son
> `Tipo="A"` y sí tienen subcuentas** (son los departamentos reales), y **313 son `Tipo="D"`
> sin subcuentas** (cuentas vacías). Exigir `Tipo="D"` **AND** "tiene subcuentas" da
> siempre **cero** resultados.

Criterio equivalente por catálogo, si no hay saldos disponibles:

```
departamentos = cuentas donde:
  Num_Cta.startsWith("104-")
  AND Nivel = 3
  AND Status = "A"
  AND cuarto segmento = "000"
  AND la cuenta TIENE al menos una subcuenta de cuarto nivel (ej. -001 a -025)
```

> **IMPORTANTE**: Las cuentas 104-XXX-YYY-000 que **no tienen** hijos de cuarto nivel (001-025) se consideran "cuentas omitidas" (cuentas vacías, dummy o agrupadores) y deben excluirse automáticamente del conteo total de condóminos en todos los reportes (Dashboard, Análisis, etc).
>
> **Nunca** contar condóminos con la lista `departments` del dashboard: esa lista se filtra por
> `Balance > 0`, es decir, son **deudores**. Al corte 08/2026 son 162 de 312 (122 sin adeudo, 28 anticipos).
> Para el total usar `kpis.totalDepartments`.

---

## 2. Saldos (`/saldos`)

### Estructura de respuesta
```json
{
  "intEstatus": 1,
  "strMensaje": "OK",
  "data": [
    {
      "Num_Cta": "104-001-001-000",
      "Ejercicio": 2026,
      "Inicial": 0,
      "InicialEx": 0,
      "Cargo01": 12694,  "Abono01": 12694,
      "Cargo02": 13694,  "Abono02": 13194,
      "Cargo03": 12694,  "Abono03": 13194,
      "Cargo04": 0,      "Abono04": 0,
      "...": "...",
      "Cargo12": 0,      "Abono12": 0
    }
  ]
}
```

### Campos relevantes

| Campo | Tipo | Descripción |
|---|---|---|
| `Num_Cta` | string | Número de cuenta |
| `Ejercicio` | int | Año fiscal (ej: 2026) |
| `Inicial` | decimal | Saldo inicial al 1° de enero del ejercicio |
| `CargoNN` | decimal | Total de cargos del mes NN (01=enero ... 12=diciembre) |
| `AbonoNN` | decimal | Total de abonos del mes NN |

### Cómo calcular el saldo acumulado al mes M

Por **cuenta individual**:

```
saldoAlCorte = Inicial + SUM(CargoNN - AbonoNN)  para NN de 01 hasta M
```

Por **condómino** (agregando sus subcuentas):

```
saldoCondomino(M) = SUMA de saldoAlCorte(M) de las subcuentas 104-XXX-YYY-ZZZ
                    donde ZZZ != 000
```

> ⚠️ **Nunca sumar la cuenta base `-000` junto con sus subcuentas.** La cuenta
> `104-XXX-YYY-000` es **acumulativa** (`Tipo = "A"`): su saldo ya es la suma de
> `-001`, `-002`, `-003`… Sumarla con las demás **duplica exactamente** el adeudo.
> Se puede leer la `-000` **o** sumar las subcuentas, nunca ambas.

> Para cuentas 104 (condóminos) la naturaleza es deudora.
> `saldo > 0` → el condómino DEBE dinero.
> `saldo < 0` → anticipo (pagó de más).

> **Redondear a 2 decimales antes de comparar contra 0.** Sin redondeo, un residuo
> de `-0.000001` clasifica como ANTICIPOS en vez de SIN ADEUDO.

### Cómo calcular cuotas vencidas

Se cuenta sobre la **subcuenta** correspondiente (`-001` mantenimiento, `-003`
extraordinaria), no sobre la cuenta base:

```
saldoSubcuenta = Inicial + SUM(CargoNN - AbonoNN)  para NN de 01 hasta C
cuotaVigente   = CargoCC de esa subcuenta; si es 0, el último cargo > 0 hacia atrás
cuotasVencidas = piso(saldoSubcuenta / cuotaVigente)   (0 si el saldo no es positivo)
```

> ⚠️ **Se cuentan cuotas completas impagas, no meses con saldo positivo.**
> La implementación anterior contaba los meses en que el saldo acumulado quedaba
> por encima de cero, y eso hacía que un arrastre de $300 durante cinco meses
> pesara igual que cinco cuotas sin pagar. Al 08/2026 producía **137 morosos**,
> muchos debiendo menos de una cuota ($300, $500, $8,039); con cuotas completas
> son **9**. Con una cuota de $13,694: deber $12,694 son 0 cuotas vencidas,
> deber $27,388 son 2.

> `cuotaVigente` se toma del cargo del mes de corte porque varía por departamento
> (indiviso). El respaldo hacia atrás cubre el caso de una extraordinaria que ya
> no se emite pero conserva deuda.

#### La cuota no es un valor fijo

Verificado en el detalle de morosidad de Avivia 58 (agosto 2026):

| Cuenta | Composición observada |
|---|---|
| `104-006-101` (C3-2511) | jun **$12,694**, jul **$13,694**, ago **$15,075**, descuento pronto pago **−$1,381** → total **$40,082** |
| `104-006-055` (C3-211) | feb: cuota **$11,645** + complemento **$1,000**; mar: **$12,694** + complemento **$1,000**; abr y may igual |

Tres consecuencias para cualquier cálculo:

1. **La cuota cambia mes a mes dentro del mismo departamento.** No existe "la cuota
   del condominio": hay que leer el cargo del mes que se consulta. Un valor fijo, un
   promedio o el monto de `ChargeTemplate` dan un divisor equivocado.
2. **El cargo de un mes puede venir en varias partidas** sobre la misma subcuenta
   `-001`: "CUOTA MANTENIMIENTO" más "COMPLEMENTO CUOTA MANTENIMIENTO". Se debe usar
   el **total de cargos del mes** en la subcuenta, no una partida suelta.
3. **El descuento por pronto pago (`-002`) resta del adeudo** y aparece dentro del
   bloque de mantenimiento en el desglose: 12,694 + 13,694 + 15,075 − 1,381 = 40,082.

> ⚠️ Al variar la cuota, el divisor depende del mes consultado. Una deuda formada con
> cuotas de $12,694 dividida entre una cuota vigente de $15,075 arroja menos cuotas
> vencidas de las que realmente se dejaron de pagar. Es una aproximación deliberada:
> la alternativa (descontar cuota por cuota hacia atrás) exige recorrer las partidas
> de todos los meses. Tenerlo presente en clientes con cuotas que suben con frecuencia.

> El snapshot de referencia en `saldos.json` **no** refleja esta variación: ahí las
> cuentas anteriores tienen $13,694 constante todo el año. Es una extracción previa;
> no sirve para validar este punto.

> Solo se usan **saldos.json** — no se necesitan auxiliares para clasificar.

> ⚠️ **No mezclar fuentes para el corte.** Calcular "saldos hasta el mes M-1 +
> auxiliares del mes hasta el día de corte" produce un corte distinto al de
> `saldos` con el mes completo, y dos pantallas que hagan cosas distintas mostrarán
> cifras distintas sobre los mismos datos. Los auxiliares sirven para **mostrar el
> desglose de movimientos** de una fila, nunca para clasificar ni para el saldo total.

---

## 3. Auxiliares (`/auxiliares`)

### Estructura de respuesta
```json
{
  "intEstatus": 1,
  "strMensaje": "OK",
  "data": [
    {
      "Tipo_Poli": "Dr",
      "Num_Poliz": "    2",
      "Num_Part": 5,
      "Periodo": 1,
      "Ejercicio": 2026,
      "Num_Cta": "104-001-009-000",
      "Fecha_Pol": "2026-01-01T00:00:00",
      "Concep_Po": "CUOTA MTTO ENE 26",
      "Debe_Haber": "D",
      "MontoMov": 12694,
      "NumDepto": 0,
      "TipCambio": 1
    }
  ]
}
```

### Campos relevantes

| Campo | Tipo | Descripción |
|---|---|---|
| `Num_Cta` | string | Cuenta afectada por el movimiento |
| `Periodo` | int | Mes del movimiento (1-12) |
| `Ejercicio` | int | Año del movimiento |
| `Fecha_Pol` | datetime | Fecha exacta de la póliza |
| `Concep_Po` | string | Concepto/descripción del movimiento |
| `Debe_Haber` | string | `"D"` = Cargo (débito), `"H"` = Abono (crédito) |
| `MontoMov` | decimal | Monto del movimiento |
| `Num_Poliz` | string | Número de póliza (identifica el tipo de cargo) |
| `Tipo_Poli` | string | Tipo de póliza: `"Dr"` = Diario |

### Convención de Num_Poliz por tipo de cargo (Avivia 58)

| Póliza num | Concepto | Rol en cobranza |
|---|---|---|
| `1` | PENA MORATORIA | Multa por mora — cargo extra, no cuenta como cuota |
| `2` | CUOTA DE MANTENIMIENTO | ✅ Cuota principal mensual de mantenimiento |
| `3` | COMPLEMENTO / DESCUENTO PRONTO PAGO | Ajuste o descuento sobre cuota de mtto |

> El **complemento** se carga sobre la misma subcuenta `-001` que la cuota, así que
> el cargo del mes puede ser la suma de dos partidas. El **descuento por pronto pago**
> se abona en `-002` y reduce el adeudo. Ver §2 "La cuota no es un valor fijo".
| `4` a `26+` | PROVISION DE AMENIDADES | Otros conceptos — amenidades, servicios, etc. |

---

## 4. Pólizas (`/polizas`)

### Estructura de respuesta
```json
{
  "intEstatus": 1,
  "strMensaje": "OK",
  "data": [
    {
      "Tipo_Poli": "Dr",
      "Num_Poliz": "    2",
      "Periodo": 1,
      "Ejercicio": 2026,
      "Fecha_Pol": "2026-01-01T00:00:00",
      "Concep_Po": "CUOTA MTTO ENE 26"
    }
  ]
}
```

Sirve para verificar qué pólizas existen por periodo — útil para saber si ya se registró la cuota de un mes específico.

---

## Convención de nomenclatura de cuentas 104

```
104  -  001  -  009  -  000
 │       │        │        └── Subcuenta (000 = cuenta ACUMULATIVA del condómino)
 │       │        └─────────── Número de depto dentro de la torre
 │       └──────────────────── Número de torre (001=Acacia, 002=Olivo1, 003=Olivo2, 004=Ciruelo1…)
 └──────────────────────────── Cuenta raíz CONDOMINOS
```

### Subcuentas (cuarto segmento)

| Subcuenta | Uso |
|---|---|
| `000` | Cuenta **acumulativa** del condómino (`Tipo="A"`) — su saldo ya suma las de abajo |
| `001` | Cuota de mantenimiento |
| `002` | Descuento por pronto pago |
| `003` | Cuota extraordinaria |
| `004` | Intereses moratorios especiales |
| `005` | Penalizaciones especiales |
| `006`–`026` | Otros conceptos (amenidades, servicios, multas) |

> Las subcuentas son las de `Tipo = "D"` (detalle). La `-000` **no** es "la cuenta
> principal donde se registran los movimientos": es el agregado de sus hijas.

---

## Reglas de negocio vigentes (definidas 2026-08-06)

### Fuentes de verdad

| Dato | Fuente |
|---|---|
| Total de departamentos (condóminos) | `saldos`: cuentas nivel 3 distintas con CargoMM > 0 en su subcuenta `-001` |
| Cuota mensual total de mtto al mes M | `saldos`: SUM(CargoMM) de las subcuentas `-001` |
| Cuota extraordinaria total al mes M | `saldos`: SUM(CargoMM) de las subcuentas `-003` |
| Cuota individual de un depto en mes M | `saldos`: CargoMM de su subcuenta `-001` |
| Saldo del condómino al corte | `saldos`: suma de sus subcuentas `!= -000` (ver §2) |
| Cuotas vencidas | `saldos`: piso(saldo de la subcuenta / cuota vigente) en `-001` / `-003` |

> ❌ **ChargeTemplate NO es fuente de ningún cálculo.**
> Estado real al 2026-08-06: sigue alimentando `MonthlyFeeTotal` y `ActiveTemplates`
> del dashboard. Pendiente de migrar — ver §Pendientes.

### Clasificación de condóminos (prioridad de mayor a menor)

| Clasificación | Condición |
|---|---|
| **ANTICIPOS** | saldo al corte < 0 |
| **SIN ADEUDO** | saldo al corte = 0 |
| **COBRANZA JUDICIAL** | > 5 cuotas vencidas de mantenimiento, O >= 5 cuotas vencidas de extraordinaria |
| **MOROSO** | >= 2 cuotas vencidas de mantenimiento, O >= 1 cuota vencida de extraordinaria |
| **DEUDA CORRIENTE** | saldo > 0 y no cumple moroso ni judicial |

> **"Cuota vencida"** = cada vez que la cuota vigente del condómino cabe completa
> dentro del saldo de esa subcuenta. Ver §2 "Cómo calcular cuotas vencidas".
> **No** es un mes con saldo positivo.

> 🔒 **Esta regla tiene un único dueño en el código:**
> `LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Services/CobranzaOnlineClasificador.cs`.
> Umbrales, etiquetas y redondeo viven ahí. Ninguna otra clase debe reimplementarla:
> llegamos a tener **tres** versiones simultáneas con umbrales distintos (meses con saldo
> positivo, 2×/6× la cuota, y 2×/3× la cuota desde ChargeTemplate) y cada pantalla mostraba
> un número diferente sobre los mismos datos. Ninguna de las tres era la regla correcta;
> la vigente es **cuotas completas impagas**.

### Reporte "Análisis de Cobranza Mensual"

Réplica del reporte histórico en Excel. Mide **el mes**, no la cartera acumulada:

```
Cobranza perfecta = SUM(CargoMM de -001) + SUM(CargoMM de -003)      → 100%
Morosos           = saldo al corte de los clasificados MOROSOS
Deuda corriente   = saldo al corte de los clasificados DEUDA CORRIENTE
Cobrado           = Cobranza perfecta - Morosos - Deuda corriente     ← RESIDUAL
```

> **`Cobrado` es un residual, no los abonos del mes.** Es lo que hace que las tres
> filas sumen exactamente el 100% de la cobranza perfecta. Los abonos reales del mes
> viajan aparte en `TotalAbonosMes` y **no** deben usarse para esta fila: dan otro
> número y rompen la suma.

> **La cobranza judicial queda fuera de este bloque a propósito**: son cuentas en
> litigio, ya fuera del flujo de recaudación mensual. Su saldo se reporta solo en
> "Deuda Condóminos (EF)".

> ⚠️ Si `Morosos + Deuda corriente` llegara a superar la cobranza perfecta, `Cobrado`
> se topa en 0 y las filas pasarían del 100%. Es señal de cartera vencida mayor a un
> mes de cuotas, no un error de cálculo.

### Reporte "Cobranza del Mes" (flujo real)

Convive con el anterior en la misma pantalla para poder contrastarlos:

```
Cobranza perfecta   = igual que el bloque anterior                    → 100%
Cobrado             = abonos del mes aplicados a -001 y -003
Faltante por cobrar = Cobranza perfecta - Cobrado
```

> Aquí `Cobrado` **sí** es dinero cobrado: es el mismo dato que "Abonado" en Resumen
> y se cuadra contra banco. Al 08/2026 son $1,462,662 frente a los $2,096,869 del
> residual del Excel — la brecha crece con el tamaño de la cartera vencida.

> ⚠️ **`Cobrado` puede superar el 100%** y dejar el faltante en negativo. Ocurre cuando
> se cobran pagos de cartera de meses anteriores contra una facturación mensual chica.
> Caso real de Avivia 58: la cuota extraordinaria solo se cargó en enero ($44,070) y
> desde febrero la `-003` únicamente recibe abonos de deuda vieja. En marzo de 2026:
> cobranza perfecta $67,089 contra un cobrado de $212,129. No es un error de cálculo.
> Por eso el bloque desglosa el cobrado en mantenimiento y extraordinaria cuando la
> `-003` tiene movimiento.

> **Todos los totales del mes se leen de `saldos`, nunca de `auxiliares`.** Los auxiliares
> se filtran hasta el día del corte y dan un cobrado menor: al 06/08/2026 la diferencia
> entre ambas fuentes era de $12,721 sobre el mismo mes.

> **Tres campos parecidos en el DTO, no confundirlos:**
> `TotalCobrado` = residual del Excel · `CobradoMes` = abonos del mes (flujo real,
> desglosado en `CobradoMttoMes` y `CobradoExtraordinariaMes`) · `TotalAbonosMes` =
> abonos de **todas** las subcuentas según el desglose de movimientos.

### Pantallas de condómino y su fuente (2026-08-07)

Las tres pantallas que listan condóminos son **rebanadas de un único payload**,
`analysisData` (endpoint `analysis`). El store las carga una vez y cada vista filtra
en memoria; ninguna hace su propia petición.

| Pantalla | Rebanada de `analysisData` |
|---|---|
| Detalle por Condómino | las cinco listas juntas |
| Reporte de Morosidad | `morosos` + `cobranzaJudicial`, en dos columnas |
| Adelantos y Saldos a Favor | `anticipos`, importes mostrados en positivo |

> 🔒 **Regla: ninguna vista de condómino debe leer de `dashboardData`.**
> `dashboardData.departments` / `topDebtors` / `advances` clasifican **por separado**, en
> otro método del backend y sobre otro corte de entrada. Morosidad leyó de ahí hasta el
> 2026-08-07 y las dos pantallas llegaron a mostrar 137 morosos contra 9, y $725,074
> contra $362,537 sobre los mismos datos. Un solo clasificador no basta si se alimenta
> desde dos cálculos distintos: la fuente también tiene que ser una.

Quien debe sin alcanzar los umbrales (DEUDA CORRIENTE) no aparece en Morosidad; se
consulta en Detalle por Condómino, que sí muestra las cinco clasificaciones.

> ⚠️ **`Desglose` y `Saldo` no cortan igual.** Dentro de cada condómino, `Desglose`
> (por subcuenta) se calcula con saldos del mes anterior **más auxiliares hasta el día
> de corte**, mientras que `Saldo` sale de los saldos del **mes completo**. A fin de mes
> coinciden; a mitad de mes, `SUM(Desglose.SaldoFinal) != Saldo`. Cualquier KPI derivado
> del desglose —por ejemplo el reparto mtto/extraordinaria de Adelantos— hereda esa
> diferencia. El total autoritativo siempre es el del backend (`totalAnticipos`,
> `totalMorosos`…), nunca la suma del desglose.

### Reporte "Deuda Condóminos (EF)"

Mide **la cartera acumulada**, y aquí sí entra la judicial:

```
Total deuda        = Judicial + Morosos + Deuda corriente             → 100%
Cuotas anticipadas = saldo de los clasificados ANTICIPOS (negativo)
Saldo según balanza = Total deuda + Cuotas anticipadas
```

### Valores de control — Avivia 58, corte 08/2026

Cualquier cambio en el módulo debe seguir reproduciendo estas cifras. Se obtienen
directamente de `saldos.json` sumando subcuentas `!= -000`:

| Clasificación | Cuentas | Saldo |
|---|---:|---:|
| COBRANZA JUDICIAL | 2 | $350,381 |
| MOROSOS | 9 | $322,642 |
| DEUDA CORRIENTE | 151 | $1,853,517 |
| SIN ADEUDO | 122 | $0 |
| ANTICIPOS | 28 | −$1,112,224 |
| **Total condóminos** | **312** | |

> Cifras con la regla de **cuotas vencidas**. Con la regla anterior de meses con
> saldo positivo daban 3 / 137 / 22 / 122 / 28: si un reporte reproduce esos
> números, está corriendo la lógica vieja.

Otros valores verificados al mismo corte:

- Cuentas con cargo `-001` en el mes: **312** (igual en junio, julio y agosto)
- Suma de cargos `-001` de agosto: **$4,273,028**
- Deudores (saldo > 0): **162** = 2 + 9 + 151

Análisis de Cobranza Mensual al mismo corte:

| Fila | Saldo | % |
|---|---:|---:|
| Cobranza perfecta | $4,273,028 | 100% |
| Morosos | $322,642 | 7.6% |
| Deuda corriente | $1,853,517 | 43.4% |
| Cobrado (residual) | $2,096,869 | 49.1% |

Cobranza del Mes (flujo real): cobrado **$1,462,662** (34.2%), faltante **$2,810,366** (65.8%).

Deuda Condóminos (EF): total deuda **$2,526,540**, cuotas anticipadas **−$1,112,224**,
saldo según balanza **$1,414,316**.

### Rendimiento: cómo evitar los timeouts (2026-08-07)

Aspel se consulta **en bloque**: `cuentas`, `saldos` y `auxiliares` del **año completo**,
en paralelo con `Task.WhenAll`. No hay paginación ni filtro por cuenta, y no la habrá:
la API de Aspel no los ofrece. Por lo tanto **el costo no está en la red, está en el
post-proceso**, y ahí es donde se producían los timeouts de clientes grandes.

> 🔒 **Regla: nunca recorrer una lista completa dentro del bucle por condómino.**
> Normalizar cada cuenta **una sola vez**, pre-indexar en diccionarios antes del bucle y
> dentro del bucle hacer solo lookups O(1).

El patrón se estrenó en `AspelCobranzaHausLive` (commit `a18a1834`, "Ajuste nuevo de
velocidad a Cuentas deudas vigentes") y se replicó en `CobranzaOnline` el 2026-08-07:

| Antes | Ahora |
|---|---|
| `relatedAccounts` filtraba **todas** las claves de saldos + auxiliares por condómino | Índice por prefijo de nivel 3; el bucle solo ve sus propias subcuentas |
| El nombre de cada subcuenta salía de un `FirstOrDefault` sobre el catálogo completo, con un `Format()` por fila | Diccionario `código → nombre` construido una vez |

Por qué duele tanto: `AspelAccountFormatter.Format` no es barato —hace
`Where(char.IsDigit).ToArray()` más interpolación, o sea varias asignaciones por
llamada— y `IsChildOrSelfAccount` lo invoca tres veces más dos `Split`. Multiplicado por
N condóminos × K cuentas, son decenas de millones de asignaciones por petición.

Resultado medido: el cliente más grande (Mitikah) pasó de agotar el timeout a **~10 s**,
con las cifras de control intactas.

Notas de la capa HTTP, para no perseguir fantasmas:

- El caché de `AspelCoiApiClient` cubre **solo** `GetDatosConsolidadosAsync` y
  `GetDatosBasicosAsync`. Los granulares (`GetCuentasAsync`, `GetSaldosAsync`,
  `GetAuxiliaresAsync`) **no están cacheados**, y son los que usa Cobranza Online.
- Las rutas live llaman `InvalidarCache(intEmpresa, year)` en cada petición. Hoy es
  inocuo por lo anterior, pero cierra la puerta a cachear los granulares.
- `MaxRetries = 1` hace que el bucle de reintentos **nunca reintente**
  (`attempt < MaxRetries` jamás se cumple). Es deliberado dejarlo así: reintentar una
  llamada de 180 s empeora el timeout.
- El `BrokenCircuitException` que aparece en el banner de sync **no viene de estas
  pantallas**: el circuit breaker está registrado sobre el HttpClient `AspelApiClient`
  (job de migración/sync), no sobre `AspelCoiApi`. Además, "Origen" y "Último error
  relevante" del encabezado salen del endpoint `sync-status`, no de la respuesta que
  estás viendo — no sirven para saber si corrió la ruta live o la de respaldo.

### Notas de implementación

1. **Saldos vs Auxiliares**: Para clasificación usar `saldos` (eficiente). Para detalle de movimientos usar `auxiliares`.
2. **Saldo neto negativo por mes**: `CargoNN - AbonoNN < 0` es un pago excedente que reduce deuda anterior.
3. **Cuentas excluidas**: Las cuentas en la tabla de exclusiones del sistema se omiten de todos los cálculos.
4. **Año cruzado**: Si el corte es enero, el `Inicial` ya contiene el arrastre del año anterior — no se necesita consultar el año previo.
5. **Pena moratoria (póliza 1)**: Son cargos adicionales por mora, no representan una cuota de mantenimiento y no incrementan el conteo de cuotas vencidas. Sí suman al saldo total del condómino.
6. **Cuarto segmento 004/005**: Son subcuentas especiales — excluirlas del conteo de departamentos pero incluirlas en el saldo total del condómino si corresponde a la misma persona.
7. **Cuenta acumulativa `-000`**: nunca sumarla junto con sus subcuentas (duplica el adeudo). Ver §2.
8. **Paridad live / cache-local**: cada consulta tiene ruta contra Aspel y ruta contra el caché
   local. **Ambas deben aplicar exactamente las mismas reglas.** Los desajustes históricos del
   módulo salieron todos de rutas de respaldo que quedaron con lógica vieja: clasificación por
   múltiplos de cuota, `Classification` sin asignar (todo salía "SIN ADEUDO" si Aspel se caía),
   doble descuento de lo cobrado, y conteo de departamentos desde `dbContext.Property`.
9. **`departments` / `topDebtors` del dashboard son deudores**, no condóminos: vienen filtrados
   por `Balance > 0`. Para el total de condóminos usar `kpis.totalDepartments`.
10. **Formato de cuenta según el payload**: `analysisData` entrega la cuenta base con cuatro
    segmentos (`104-002-099-000`); `dashboardData.departments` la entrega en nivel 3
    (`104-002-099`). El endpoint de detalle de Aspel se consulta con **nivel 3**. Para recortar,
    tomar los tres primeros segmentos — **nunca** un `Replace("-000", "")`: sustituye todas las
    ocurrencias y corrompe cuentas con más de un segmento `000`. Mismo error que ya se corrigió
    en el backend.
11. **La ruta HTTP de la API y la ruta de Angular son independientes.** El prefijo
    `api/cobranza/online/...` es de los endpoints y **no cambia**. La URL del front se renombró a
    `/cobranza/aspel-online` (2026-08-07), con redirect legacy desde `/cobranza/online`. Un
    buscar-y-reemplazar de `cobranza/online` rompe ~30 llamadas HTTP: filtrar por
    `routerLink` antes de tocar nada.

### Documentos relacionados

| Documento | Rol |
|---|---|
| **Este archivo** | Rector. Reglas de negocio, cálculo y composición de reportes |
| `Services/CobranzaOnlineClasificador.cs` | Implementación única de la clasificación |
| `CobranzaOnline/README.md` | Arquitectura del módulo, endpoints, ubicaciones. **No** repite reglas |
| `docs/modulos-nuevos/CobranzaOnline/02-business-rules-analysis.md` | Reglas operativas (sincronización, permisos, exclusiones) |
| `client/.../cobranza-online/requerimientos.md` | Requisitos originales del cliente, en crudo |

> Se eliminó `CobranzaOnline/Docs/README-cobranza-online.md` (2026-08-07): describía una
> migración por fases ya concluida y rutas que no existen (`/contabilidad/collections`,
> `legacy-collection`, `api/accounting-coi/*`).

### Pendientes (estado al 2026-08-07)

Cosas que la guía exige y el código todavía no cumple. Documentadas aquí para que nadie
las lea como "ya resuelto":

- [ ] `BuildChargeTemplateSnapshotAsync` sigue alimentando `MonthlyFeeTotal` y `ActiveTemplates`
      del dashboard desde ChargeTemplate, pese a que la guía lo excluye como fuente.
- [ ] El pie del dashboard (`pieCobrado` / `pieMorosos` / `pieDeudaCorriente`) sigue con la lógica
      antigua de "una cuota vigente" y **nunca pasó por `CobranzaOnlineClasificador`**: reparte
      con su propio criterio, así que sus cifras no coinciden con Detalle Condóminos ni con
      Morosidad. Es la última fuente de divergencia que queda viva en el módulo.
- [ ] `CuotaVigente` usa el cargo del mes de corte como divisor. Si la cuota subió, una deuda
      formada con cuotas menores arroja menos cuotas vencidas de las reales. La versión exacta
      exige descontar cuota por cuota hacia atrás recorriendo las partidas de cada mes.
- [ ] `CalculateVisibleChargeAmount` devuelve `template.Amount` sin aplicar `CalculationMethod`
      (monto fijo por depto vs prorrateo por indiviso).
- [ ] Sin validación automatizada contra los valores de control de arriba.
- [ ] `Desglose` corta al día de corte y `Saldo` al mes completo (ver §Pantallas de condómino).
      Mientras no se unifiquen, cualquier reparto por concepto derivado del desglose puede no
      cuadrar contra su total a mitad de mes.
- [ ] La vista **Torres** sigue leyendo `dashboardData.towers`, que es la última fuente de
      condóminos fuera de `analysisData`. Además su DTO no expone cargado ni abonado por torre:
      agrupando `analysisData.condominos` por nivel 2 se obtienen los tres KPIs (a cobrar,
      abonado, deuda) sin tocar el backend, salvo el nombre de la torre.
