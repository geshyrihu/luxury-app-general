Ruta: 📂 API > Accounting > ContabilidadOnline > AnalisisCobranza

# 📬 Reporte Análisis de Cobranza

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Clasificar condominios por nivel de deuda usando cuentas `104`.

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/analisis-cobranza/{customerId}/{year}/{month}`
- Servicio: `AnalisisCobranzaService`
- Contrato: `AnalisisCobranzaDTO`

---

## Columnas visibles por condomino

- `numeroCuenta`
- `condomino`
- `saldo`
- `clasificacion`

---

## Cuentas y niveles

Sólo toma:

- cuentas `104-*`
- con 3 segmentos
- donde:
  - segundo nivel != `000`
  - tercer nivel != `000`

Es decir, trabaja sobre cuentas hoja reales del bloque de condominios.

---

## Reglas de clasificación

- `>= 60000` → `COBRANZA JUDICIAL`
- `>= 20000` → `MOROSOS`
- `> 0` → `DEUDA CORRIENTE`
- `= 0` → `SIN ADEUDO`
- `< 0` → `ANTICIPOS`

---

## Suma o resta

- `totalJudicial = suma de saldos judiciales`
- `totalMorosos = suma de saldos morosos`
- `totalDeudaCorriente = suma de saldos corrientes`
- `totalAnticipos = suma de saldos negativos`
- `totalDeuda = judicial + morosos + deuda corriente`
- `saldoBalanza = totalDeuda + totalAnticipos`

---

## Detrás de cámaras

- el saldo usado por cuenta depende del mes solicitado
- toma directamente `MontoMes` del `RawAspelAccountDTO`
- es un reporte de clasificación, no de jerarquía financiera profunda

