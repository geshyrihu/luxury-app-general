Ruta: 📂 API > Accounting > ContabilidadOnline > BancosInversiones

# 🏦 Reporte Bancos e Inversiones

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Mostrar saldos acumulados al corte de:

- bancos
- inversiones ordinarias
- fondo de reserva

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/bancos-inversiones/{customerId}/{year}/{mes}`
- Servicio: `BancosInversionesService`
- Contrato: `BancosInversionesDTO`

---

## Columnas visibles

### Bancos

- `cuenta`
- `importe`

### Inversiones

- `cuenta`
- `importe`
- `descripcion`

---

## Cuentas y niveles

### Bancos

- mayor `102`
- toma hojas finales:
  - detalle si existe
  - subcuenta si no hay detalle

### Inversiones

- mayor `103`
- toma hojas finales:
  - detalle si existe
  - subcuenta si no hay detalle

### Fondo de reserva

Se detecta por:

- número `103-001-003`
- o descripción que contenga `RESERVA`

---

## Suma o resta

- `importe = inicial + movimientos acumulados hasta mes`
- `sumaBancos = suma de bancos`
- `subtotalInversiones = suma de inversiones ordinarias`
- `sumaInversiones = subtotalInversiones + fondoReserva`

---

## Detrás de cámaras

- usa `FlattenLeafAccounts(...)`
- esta función evita perder cuentas hoja cuando no existe detalle colgante
- convierte el nombre en número de cuenta bancaria usando regex sobre la descripción

