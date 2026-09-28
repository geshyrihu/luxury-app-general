# Guía práctica de Siigo API México

> Fuente: Documentación oficial de Siigo
> - Portal: https://siigonubeportaldeclientes.aspel.com.mx/conocer-informacion-acerca-de-siigo-api/
> - Referencia técnica: https://developers.siigo.com/docs/siigoapimexico/

Siigo API México permite conectar cualquier aplicación con **Siigo Nube** para automatizar el ciclo de venta y la gestión contable: facturación electrónica, sincronización de productos y terceros, reportes, etc.

Disponible en planes **Siigo Nube Gestión** (inicio, avanzado y premium).

---

## 1. Autenticación (OAuth 2.0)

El API usa un esquema OAuth. Primero generas un **token JWT** con tus credenciales (`username` + `access_key`), que se obtienen en Siigo Nube → menú **Alianzas → "Mi Credencial API"**.

```bash
curl -X POST "https://api.siigo.mx/auth" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "[email protected]",
    "access_key": "TU_ACCESS_KEY"
  }'
```

**Respuesta:**

```json
{
  "access_token": "eyJhbGciOi...",
  "expires_in": 86400,
  "token_type": "Bearer",
  "scope": "Siigo API"
}
```

> El token expira en 24 horas (`expires_in: 86400`). Guárdalo y reutilízalo hasta su vencimiento.

### Cabeceras requeridas en TODAS las peticiones

```http
Authorization: Bearer <access_token>
SiigoAPI-Application-Id: <id_de_tu_aplicacion>
Content-Type: application/json
```

---

## 2. Base URL y recursos principales

**Base URL:** `https://api.siigo.mx/v1`

| Recurso | Endpoint | Operaciones |
| --- | --- | --- |
| Productos / servicios | `/products` | Crear, consultar, actualizar y **eliminar** |
| Clientes / terceros | `/customers` | Crear, consultar y actualizar (clientes, proveedores u "otros") |
| Facturas de venta | `/invoices` | Crear, consultar, actualizar, **timbrar**, **enviar por correo** y **eliminar** |
| Recepciones de pago | `/vouchers` | Crear, consultar, actualizar, timbrar, enviar por correo y eliminar |

---

## 3. Catálogos (solo consulta)

Se usan para obtener los IDs que luego envías al crear facturas/productos.

| Catálogo | Endpoint | Para qué sirve |
| --- | --- | --- |
| Tipos de comprobante | `/document-types?type=FV` | IDs de tipos de factura, condiciones de numeración, descuento, retenciones |
| Impuestos | `/taxes` | IDs de IVA, ReteIVA, ISR, etc. |
| Condiciones de pago | `/payment-types?document_type=FV` | IDs de formas de pago (efectivo, crédito…) |
| Usuarios | `/users` | Vendedores (`seller`) y cobradores (`collector`) |
| Bodegas / almacenes | `/warehouses` | IDs de almacén por ítem |
| Grupos de inventario | `/account-groups` | Clasificación contable del producto |
| Listas de precio | `/price-lists` | Posiciones 1–12 de precios |
| Centros de costo | `/cost-centers` | IDs de centros de costo |

---

## 4. Ejemplos prácticos

### 4.1 Crear un producto / servicio

```bash
curl -X POST "https://api.siigo.mx/v1/products" \
  -H "Authorization: Bearer <token>" \
  -H "SiigoAPI-Application-Id: <app_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "Item-1",
    "name": "Camiseta de algodón",
    "account_group": 1253,
    "type": "Product",
    "stock_control": true,
    "active": true,
    "tax_classification": "Taxed",
    "tax_included": false,
    "taxes": [ { "id": 13156 } ],
    "prices": [
      { "currency_code": "MXN", "price_list": [ { "position": 1, "value": 1069.77 } ] }
    ],
    "unit": "A37",
    "key": "94101701",
    "reference": "REF1",
    "description": "Producto de ejemplo",
    "additional_fields": { "barcode": "B0123", "brand": "MiMarca" }
  }'
```

**Campos clave**
- `code`: único, alfanumérico, máx. 30 caracteres, sin espacios.
- `account_group`, `unit` (clave SAT), `key` (clave SAT): **obligatorios**.
- `type`: `Product` | `Service` | `ConsumerGood` (default `Product`).
- `tax_classification`: `Taxed` | `Exempt` | `Excluded`.

### 4.2 Listar productos (con filtros y paginación)

```bash
curl -X GET "https://api.siigo.mx/v1/products?created_start=2024-01-01&page=1&page_size=25" \
  -H "Authorization: Bearer <token>" \
  -H "SiigoAPI-Application-Id: <app_id>"
```

Filtros útiles: `code`, `id` (hasta 20 separados por coma), `created_start`, `created_end`, `updated_start`, `updated_end`.

### 4.3 Crear un cliente / tercero

```bash
curl -X POST "https://api.siigo.mx/v1/customers" \
  -H "Authorization: Bearer <token>" \
  -H "SiigoAPI-Application-Id: <app_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Customer",
    "person_type": "Moral",
    "rfc_id": "ABC123456789",
    "name": "Empresa Ejemplo S.A. de C.V.",
    "commercial_name": "Empresa Ejemplo",
    "branch_office": 0,
    "fiscal_regime": "601",
    "active": true,
    "address": {
      "address": "Av. Principal 123",
      "colony": "Centro",
      "city": { "country_code": "MX", "state_code": "09", "city_code": "09001" },
      "postal_code": "12345"
    },
    "phones": { "indicative": "52", "number": "5512345678" },
    "contacts": {
      "first_name": "Juan", "last_name": "Pérez",
      "email": "[email protected]"
    },
    "seller_id": 123,
    "collector_id": 456
  }'
```

`type` acepta `Customer` | `Supplier` | `Other` (default `Customer`).

### 4.4 Crear una factura de venta (timbrada y con envío de correo)

```bash
curl -X POST "https://api.siigo.mx/v1/invoices" \
  -H "Authorization: Bearer <token>" \
  -H "SiigoAPI-Application-Id: <app_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "document": { "id": 1 },
    "number": 1001,
    "customer": { "rfc_id": "ABC123456789", "branch_office": 0 },
    "seller": 123,
    "observations": "Factura de ejemplo",
    "use": "G01",
    "items": [
      {
        "code": "Item-1",
        "description": "Producto de ejemplo",
        "quantity": 2,
        "price": 100.50,
        "discount": 10,
        "warehouse": 1
      }
    ],
    "retentions": [1, 2],
    "stamp": { "send": true },
    "mail":  { "send": true },
    "payment": {
      "method": "PUE",
      "conditions": { "id": 1, "value": 100, "due_date": "2024-12-31" }
    }
  }'
```

**Campos importantes de la factura**
- `document.id`: tipo de comprobante (consultar en `/document-types?type=FV`).
- `customer.rfc_id`: debe existir y estar activo.
- `items[].code`: producto debe existir y estar activo.
- `payment.method`: `PUE` (una exhibición) o `PPD` (diferido). **Obligatorio.**
- `stamp.send: true` → timbra en el SAT. `mail.send: true` → envía por correo al cliente.
- `use`: código de uso CFDI (ej. `G01` = adquisición de mercancías).

### 4.5 Listar facturas (filtros)

```bash
curl -X GET "https://api.siigo.mx/v1/invoices?created_start=2024-01-01&customer_identification=ABC123456789&page=1&page_size=25" \
  -H "Authorization: Bearer <token>" \
  -H "SiigoAPI-Application-Id: <app_id>"
```

Filtros: `created_start`, `created_end`, `updated_start`, `updated_end`, `name`, `customer_identification`, `customer_branch_office`, `document_id`, `date_start`, `date_end`, `page`, `page_size`.

### 4.6 Actualizar una factura

```bash
curl -X PUT "https://api.siigo.mx/v1/invoices" \
  -H "Authorization: Bearer <token>" \
  -H "SiigoAPI-Application-Id: <app_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "document": { "id": 24446 },
    "number": 22,
    "customer": { "rfc_id": "ABC123456789", "branch_office": 0 },
    "seller": 629,
    "observations": "Observaciones actualizadas",
    "use": "G01",
    "items": [
      { "code": "Item-1", "description": "Camiseta de algodón", "quantity": 2, "price": 1069.77, "discount": 130, "warehouse": 1 }
    ],
    "retentions": [1, 2],
    "payment": {
      "method": "PUE",
      "cfdi": "01",
      "paid": true,
      "conditions": { "id": 5636, "value": 1273.03, "due_date": "2024-12-31" }
    }
  }'
```

> No se pueden modificar: `document.id`, `customer.rfc_id`, `payment.method`, ni facturas ya enviadas/timbradas al SAT. Para facturas timbradas usa **nota crédito electrónica**.

### 4.7 Catálogos de apoyo

```bash
# Tipos de documento (facturas de venta)
curl -X GET "https://api.siigo.mx/v1/document-types?type=FV" \
  -H "Authorization: Bearer <token>" -H "SiigoAPI-Application-Id: <app_id>"

# Impuestos
curl -X GET "https://api.siigo.mx/v1/taxes" \
  -H "Authorization: Bearer <token>" -H "SiigoAPI-Application-Id: <app_id>"

# Condiciones de pago
curl -X GET "https://api.siigo.mx/v1/payment-types?document_type=FV" \
  -H "Authorization: Bearer <token>" -H "SiigoAPI-Application-Id: <app_id>"

# Usuarios / vendedores
curl -X GET "https://api.siigo.mx/v1/users" \
  -H "Authorization: Bearer <token>" -H "SiigoAPI-Application-Id: <app_id>"

# Bodegas
curl -X GET "https://api.siigo.mx/v1/warehouses" \
  -H "Authorization: Bearer <token>" -H "SiigoAPI-Application-Id: <app_id>"
```

### 4.8 Recepciones de pago (vouchers)

Mismas operaciones que facturas (crear, consultar, actualizar, timbrar, enviar correo, eliminar) sobre `/vouchers`.

---

## 5. Casos de uso típicos

- **Tienda en línea / e-commerce** → crear facturas automáticamente por cada venta.
- **POS** → generar facturas de venta en tiempo real.
- **CRM** → sincronizar terceros (`/customers`) de forma automática.
- **Reportes** → consultar `/invoices` y `/products` para análisis personalizados.
- **Sincronización de catálogo** → crear/actualizar `/products` desde otro sistema.

---

## 6. Notas y buenas prácticas

- **Pre-requisitos:** cliente, productos, impuestos y catálogos deben existir y estar **activos** en Siigo Nube antes de referenciarlos.
- **Respuestas paginadas:** todos los `GET` devuelven `pagination { page, page_size, total_results }` y `results[]` con enlaces `_links` (previous/self/next).
- **IDs vs códigos:** endpoints de México usan `api.siigo.mx`; Colombia usa `api.siigo.com` (formato de clientes/IDs distinto). Esta guía es para **México**.
- **Límites de solicitudes:** revisa la sección "Límite de solicitudes" de la doc oficial y maneja reintentos con backoff.
- **Manejo de errores:** la API devuelve códigos HTTP estándar y un cuerpo de error; consulta "Códigos de error" en la referencia.
- **Facturas timbradas:** para corregirlas usa nota crédito; no se editan ni eliminan directo.
- **SDK oficial (Node):** `siigo-api-node` (github.com/saulmoralespa/siigo-api-node) ya incluye auth, CRUD y catálogos.
