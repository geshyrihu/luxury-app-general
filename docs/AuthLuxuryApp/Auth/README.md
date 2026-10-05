# AccesoCustomers (Acceso a Clientes)

## Propósito
Gestiona la asignación de clientes a usuarios administrativos con rol `SuperUsuario`.

## Endpoints
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `api/auth/acceso-customers/get-customers/{id}` | Clientes con estado de acceso |
| `POST` | `api/auth/acceso-customers/add-customer-acceso-to-user/{id}` | Sincronizar accesos |
