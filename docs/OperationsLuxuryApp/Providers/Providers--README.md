# Módulo Provider (SupplierLuxuryApp)

Capa de aplicación del dominio de **Proveedores** dentro de `SupplierLuxuryApp`.
Gestiona el ciclo de vida de los proveedores, su categorización, validación de
RFC, autorización multi-tenant y la documentación fiscal (constancia fiscal).

---

## Propósito funcional

Permite dar de alta, editar, activar/inactivar, autorizar y eliminar proveedores
asociados a un cliente (`CustomerId`), así como consultarlos de forma paginada y
buscar coincidencias de un proveedor en otros módulos (Gastos fijos, Entradas,
Órdenes de compra).

## Endpoints principales

| Método | Ruta | Acción | Rol mínimo (API) |
|---|---|---|---|
| GET | `api/providers/{id:guid}/{customerId:guid}` | Detalle de proveedor | Auth + tenant |
| PUT | `api/providers/change-state/{providerId:guid}/{state:bool}` | Activar/Inactivar | **SuperUsuario** |
| GET | `api/providers/validar-rfc/{value}/{customerId:guid}` | Validar RFC duplicado | Auth + tenant |
| GET | `api/providers/get-all/{state:bool}/{customerId:guid}` | Listado por estado | Auth + tenant |
| POST | `api/providers` | Crear proveedor (multipart) | Auth + tenant |
| PUT | `api/providers/{id:guid}` | Editar proveedor (multipart) | Auth + tenant |
| DELETE | `api/providers/{id:guid}` | Eliminar proveedor | Auth + tenant |
| GET | `api/providers/coincidencias/{providerId:guid}` | Coincidencias en otros módulos | Auth |
| GET | `api/providers/list` | Búsqueda paginada | Auth + tenant |
| GET | `api/providers/buscar-proveedor/{state:bool}` | Búsqueda avanzada | Auth + tenant |
| PUT | `api/providers/autorizar/{providerId:guid}` | Autorizar/Desautorizar | Auth + tenant |
| POST | `api/providers/migrate-providers-to-customers` | Migración masiva | **SuperUsuario** |

> Nota: `change-state` y `migrate-providers-to-customers` exigen rol
> `SuperUsuario` a nivel de API.

## Actores y responsabilidades

- **SuperUsuario:** puede cambiar estado, autorizar y ejecutar migración masiva.
- **Administrador / JefeMantenimiento / Asistente / Legal:** alta, edición,
  consulta y eliminación dentro de su `CustomerId`.
- **Multi-tenant:** toda operación valida que el `CustomerId` de la sesión
  coincida con el del proveedor (salvo SuperUsuario).

## Dependencias con otros módulos

- Catálogos de `Category` y `Bank` (entidades compartidas).
- `SelectItemEndPoints` (hub central) para catálogos de categorías, bancos y
  enums (`ServiceType`).
- `IFileReadPathService` / `IFileWritePathService` para rutas seguras de foto y
  constancia fiscal.
- `IImageStorageService` / `ISecureFileStorageService` para guardado de evidencia.

## Reglas de Negocio principales (RN-MOD-PROVIDER)

- **RN-MOD-PROVIDER-001 (Invariante):** un proveedor pertenece a un solo
  `CustomerId`; ninguna operación cruza tenants.
- **RN-MOD-PROVIDER-002 (Validación):** el RFC es único por `CustomerId` al crear.
- **RN-MOD-PROVIDER-003 (Flujo):** el estado (Activo/Inactivo) y la autorización
  son transiciones explícitas; cambiar estado exige `SuperUsuario`.
- **RN-MOD-PROVIDER-004 (Validación):** la constancia fiscal es requerida en alta,
  no en edición.

## Estructura de carpetas

```
Provider/
├── DTOs/            # DTOs locales (1 archivo = 1 DTO)
├── EndPoints/       # ProvidersEndPoints.cs (mapeo minimalista)
├── Interfaces/      # IProviderAppService
├── Mapping/         # ProviderMapper (AutoMapper)
├── Services/        # ProviderAppService (orquestación + reglas)
├── Docs/            # Documentación técnica (Email)
└── README.md        # Este archivo (Nivel 1)
```

## Validaciones principales

- RFC, banco, datos de contacto y cuenta de pago requeridos en alta.
- Constancia fiscal requerida solo en alta.
- Multi-tenant validado en cada método (ver `ChangeStateAsync`,
  `DeleteAsync`, `AutorizarAsync`).

## Permisos y seguridad

- Autorización por `RequireAuthorization` + rol donde aplica.
- Validación de tenant vía `ICurrentUserService` en cada servicio.
- Archivos resueltos con `IFileReadPathService` (nunca rutas hardcodeadas).

## Referencias

- `CONVENTIONS.md` (sistema rector)
- `docs-conventions/conventions/backend/*`
- Auditoría: `docs/reporte_maestro/modulos/20260820-auditoria-supplier-provider.md`
