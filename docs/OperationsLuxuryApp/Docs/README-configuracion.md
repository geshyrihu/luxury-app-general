# Módulo de Configuración y Clientes (Core)

Este módulo gestiona la base estructural de LuxuryApp: los Clientes (Condominios), sus Propiedades, la configuración de Módulos y la jerarquía de Edificios. Es el módulo que define el alcance de lo que cada cliente puede ver y operar.

---

## Estructura del Módulo

```
Configuracion/
  Customer/           (Entidad central de Cliente/Condominio)
  Property/           (Unidades privativas, departamentos, casas)
  Owner/              (Propietarios y ocupantes de las propiedades)
  ModuleApp/          (Catálogo de módulos disponibles en el sistema)
  ModuleAppRol/       (Asignación de módulos a roles específicos)
  CustomerModul/      (Módulos activados por cada cliente)
  BuildingCustomer/   (Configuración de edificios físicos por cliente)
  Diagram/            (Documentación de arquitectura de configuración)
```

---

## Reglas de Negocio

1.  **Multi-tenant Principal:** El `CustomerId` es el eje de seguridad de todo el sistema. Ningún dato puede ser consultado sin validar la pertenencia a un cliente activo.
2.  **Activación de Módulos:** La visibilidad de las funciones en el Frontend depende de la tabla `CustomerModul`. Si un cliente no tiene contratado un módulo, los servicios del API deben rechazar las peticiones y el Front ocultar los menús.
3.  **Relación Propiedad-Dueño:** Una propiedad puede tener múltiples dueños históricos, pero solo uno vigente (o un pool de propietarios actuales).

---

## Integración con Frontend

- **Dashboard de Configuración:** Permite al administrador global gestionar los datos de la empresa, subir logos y configurar la dirección física del condominio.
- **Gestión de Unidades:** Pantallas para la carga masiva de propiedades y asignación de dueños.
- **Signals y Estilos:** Uso obligatorio de la arquitectura de Tokens CSS del proyecto para asegurar la marca blanca por cliente.

---

## Especificaciones Técnicas (API)

- **Endpoints:**
  - `/api/customers`: Operaciones sobre el perfil del cliente.
  - `/api/property`: Gestión de inventario de propiedades.
  - `/api/moduleapp`: Configuración de licencias y módulos.
- **Refactorización:** El módulo de `Customer` fue refactorizado en Junio 2026 para desacoplar el "God Service" y mejorar el rendimiento mediante proyecciones manuales `.Select()`.
- **Mapeo:** Queda prohibido el uso de AutoMapper en el listado principal de clientes debido al volumen de datos.

---

_Documentación actualizada en Junio 2026_
