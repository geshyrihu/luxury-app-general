Ruta: 📂 API > Accounting > ContabilidadOnline > FondoReserva

# 🛡️ Reporte Fondo de Reserva

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Mostrar el estado del fondo de reserva:

- disponible inicial
- intereses
- disponible teórico
- disponible real

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/fondo-reserva/{customerId}/{year}/{mes}`
- Servicio: `FondoReservaService`
- Contrato: `FondoReservaDTO`

---

## Campos principales

- `nombreEmpresa`
- `fechaReporte`
- `disponibleInicial`
- `intereses`
- `disponibleTeorico`
- `cuentaBancaria`
- `disponibleReal`

---

## Cuentas y lógica

### Disponible inicial

- cuenta `301-002-000`
- usa saldo inicial

### Intereses

Busca pólizas hasta el mes solicitado donde:

- exista ingreso `403-001-000` por haber
- y exista movimiento a inversión `103-001-003` por debe

Con eso suma la parte proporcional de intereses del fondo.

### Disponible real

- toma `103-001-003`
- calcula saldo final acumulado:
  - inicial
  - más cargos
  - menos abonos

---

## Suma o resta

- `disponibleTeorico = disponibleInicial + intereses`
- `disponibleReal` sale del saldo final real en inversión/banco

---

## Detrás de cámaras

- mezcla saldos y pólizas
- extrae número de cuenta bancaria desde el nombre usando regex
- si no encuentra cuenta bancaria, usa un fallback textual

