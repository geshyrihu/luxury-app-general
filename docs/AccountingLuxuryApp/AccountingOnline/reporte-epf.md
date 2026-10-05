Ruta: 📂 API > Accounting > ContabilidadOnline > EPF

# 🧾 Reporte EPF

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Mostrar el **Estado de Posición Financiera** al cierre de un mes específico, agrupando cuentas de:

- Activo `1xx`
- Pasivo `2xx`
- Capital `3xx`

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/estado-posicion-financiera/{customerId}/{year}/{mes}`
- Servicio: `EpfService`
- Contrato: `EpfDTO`

---

## Columnas visibles

- `numeroCuenta`
- `descripcion`
- `saldoCorte`

Totales calculados:

- `totalActivo`
- `totalPasivo`
- `totalCapital`
- `totalPasivoCapital`

---

## Cómo se compone

### Fuente base

- consume `GetRawDataViaAspelApiAsync(customerId, fiscalYear)`
- arma jerarquía con `BuildHierarchicalData(...)`

### Regla de cálculo principal

Para cada cuenta mayor se calcula:

- `saldoCorte = inicial + movimientos acumulados desde enero hasta mes de corte`

No usa sólo el monto del mes. Usa el saldo acumulado al cierre.

---

## Cuentas, niveles y lógica

### Nivel visible

- el reporte final muestra principalmente **cuentas mayor** `xxx-000-000`
- internamente recorre:
  - mayor
  - subcuenta
  - detalle

### Regla especial 104

La cuenta `104` no se muestra tal cual. Se separa así:

- saldos positivos: se quedan en **Activo** como `104-000-000 CONDOMINOS`
- saldos negativos: se interpretan como anticipos y **no se vuelven a sumar** en `203`

Esto evita duplicidad contable.

### Regla especial 302

La cuenta `302`:

- no usa su saldo histórico final como valor visible principal
- se reemplaza por `RemanenteDelEjercicio[mes - 1]`

Además:

- si existe saldo nativo histórico en `302`, se transfiere a `303`

### Regla especial 205 y 206

Después de armar pasivos:

- `206` se consolida dentro de `205`

---

## Suma o resta

- En Activo, Pasivo y Capital no hay filas con “signo visual” de suma o resta.
- El comportamiento real depende de la **naturaleza contable** y del saldo acumulado.
- El total es una **suma directa de saldos finales** por bloque.

---

## Detrás de cámaras

- depende de la jerarquía generada por `ContabilidadReportBaseService`
- usa reconstrucción de nodos faltantes cuando Aspel no devuelve la cuenta madre o subcuenta contenedora
- elimina cuentas con saldo cercano a cero: `Math.Abs(saldo) < 0.01m`

