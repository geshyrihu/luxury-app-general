Ruta: 📂 API > Accounting > ContabilidadOnline > EstadoResultadosV2

# 🧮 Reporte Estado de Resultados V2

📅 Última Revisión: 22-jun-26  
🛡️ Estado: Vigente  
👤 Responsable: Equipo Accounting

---

## Objetivo

Mostrar una versión más tolerante del Estado de Resultados cuando la contabilización de ingresos `401` no viene limpia o uniforme.

---

## Endpoint y servicio

- Endpoint: `GET /api/contabilidad-online/estado-resultados-v2/{customerId}/{year}/{mes}`
- Servicio: `EstadoResultadosServiceV2`
- Contrato: `FinancialStatementDTO`

---

## Cómo se compone

### Clasificaciones finales

Sólo deja:

- `4`
- `6`

### Ventana de cuentas forzadas

Siempre intenta mostrar:

- ingresos `400` a `405`
- gastos `600` a `609`

Si alguna cuenta no existe:

- crea un placeholder con descripción fallback

---

## Cuentas, niveles y lógica

### Reconstrucción de 401

La cuenta `401` se reconstruye manualmente desde `rawData.Data.Cuentas`:

- toma cuentas `401-*`
- excluye `401-001-002`
- arma:
  - mayor `401-000-000`
  - subcuentas `401-xxx-000`
  - detalles `401-xxx-yyy`

### Niveles usados

- mayor
- subcuenta
- detalle

Si el mayor o la subcuenta tienen valores directos además de hijos:

- conserva el valor directo
- suma también los hijos

---

## Suma o resta

- Igual que en la versión clásica, el backend entrega datos estructurados
- El frontend o capa posterior calcula comparativos y resultados visibles

---

## Detrás de cámaras

- esta versión es más robusta para catálogos irregulares
- usa placeholders para que no desaparezcan columnas/categorías en UI
- es útil cuando negocio quiere ver siempre el esqueleto `400..405` y `600..609`

