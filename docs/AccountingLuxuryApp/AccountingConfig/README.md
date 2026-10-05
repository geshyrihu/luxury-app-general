# Modulo: ContabilidadConfig (Configuracion Contable)

> **Area funcional:** Contabilidad / Configuracion e Integracion Aspel
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Modulo de configuracion que vincula LuxuryApp con Aspel COI. Define (1) que cuenta contable corresponde a cada propiedad (mapeo COI), (2) politicas de facturacion por cliente, y (3) que empresa Aspel (Contabilidad/Cobranza/Banco) corresponde a cada cliente.

---

## Submodulos

### CoiMapeo (`/api/cobranza/online/mapping`)
Vincula cuentas contables de Aspel COI (nivel 3) con propiedades de LuxuryApp para cobranza automatica y conciliacion bancaria.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `customer/{customerId}` | Estado actual del mapeo de cuentas nivel 3 a propiedades |
| `GET` | `customer/{customerId}/properties` | Propiedades disponibles para mapear |
| `PUT` | `customer/{customerId}` | Vincular/desvincular cuenta con propiedad |
| `POST` | `customer/{customerId}/auto` | Auto-mapeo heuristico basado en Torre+Departamento |

### BillingConfig (`/api/cobranza/billing-config`)
Gestiona la configuracion de facturacion por cliente.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `{customerId}` | Obtener configuracion de facturacion |
| `POST` | `` | Crear/actualizar configuracion |

### AspelCustomerEmpresa (`/api/aspel-customer-empresa`)
Gestiona el mapeo entre clientes LuxuryApp y sus identificadores de empresa en Aspel.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `` | Listar todos los mapeos |
| `POST` | `` | Crear nuevo mapeo |
| `PUT` | `{id}` | Actualizar mapeo |
| `DELETE` | `{id}` | Eliminar mapeo |

---

## Reglas de Negocio

1. **Auto-mapeo heuristico:** Busca coincidencias de Torre+Departamento en el nombre de la cuenta contable para vincular automaticamente.
2. **Configuracion por defecto:** Si no existe BillingConfig para un cliente, se devuelven valores predeterminados (Native mode, 10 dias vencimiento, 0 grace days).
3. **Cambio de identidad Aspel:** Si la clave compuesta (CustomerId + Empresa + Tipo) cambia en una actualizacion, se elimina el registro anterior y se crea uno nuevo.
