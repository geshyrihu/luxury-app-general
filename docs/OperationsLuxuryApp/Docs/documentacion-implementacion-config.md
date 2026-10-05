# 🎨 Integración de Draw.io en LuxuryApp

Este documento resume la implementación técnica de la integración de diagramas profesionales utilizando Draw.io (diagrams.net), siguiendo los estándares de **.NET 10** y **Angular 22**.

## 🏗️ Backend (Arquitectura de Características)

Se ha implementado el feature completo en `LuxuryApp.Application/Features/Diagram`.

### 1. Modelo de Datos y Entidades
- **`DiagramDraw`**: Entidad principal que almacena el nombre, el contenido XML/SVG del diagrama y el `CustomerId` propietario.
- **`DiagramDrawTargetCustomer`**: Tabla de relación (Muchos a Muchos) para definir qué otros clientes pueden visualizar el diagrama.
- **`DiagramDrawTargetRole`**: Tabla de relación (Muchos a Muchos) para definir qué roles específicos (ej: Administrador, Operativo) tienen acceso.

### 2. Capa de Servicios e Interfaces
- **`IDiagramDrawService`**: Interfaz que define las operaciones CRUD.
- **`DiagramDrawService`**: Implementación con **Primary Constructors**. Incluye lógica de filtrado compleja y sincronización de colecciones (Muchos a Muchos) mediante un patrón de comparación de estados (Añadir/Eliminar), garantizando la integridad referencial y evitando errores de concurrencia (`DbUpdateConcurrencyException`).

### 3. API y Seguridad
- **`DiagramDrawController`**: Endpoint `api/DiagramDraw`.
- **Seguridad**: Requiere autenticación JWT. Utiliza `ICurrentUserService` para validar el rol y el contexto del usuario en cada petición.
- **Auditoría**: Registro de actividad del usuario mediante `[LogUserActivity]`.

---

## 💻 Frontend (Signals + Standalone)

Ubicación: `ClientAngular/src/app/features/diagram`

### 1. Componentes
- **`DiagramList`**:
  - Visualización en tabla del catálogo `@ui/web/table` (Bootstrap 5).
  - Reactividad total mediante **Signals** y `effect()`. Se recarga automáticamente si el usuario cambia de Customer en la cabecera del sistema.
  - **Desacoplamiento de Edición**: 
    - Botón **Editar Propiedades** (Lápiz): Abre el modal `DiagramForm` para gestionar metadatos (Nombre, Clientes, Roles).
    - Botón **Abrir Editor Gráfico** (Celeste): Navega a `DiagramEditor` para modificar el contenido visual.
- **`DiagramForm`**:
  - Implementado según la **FORMS_STYLE_GUIDE.md**. Utiliza `DialogHandlerService` siguiendo el patrón de `Bancos`.
  - Incluye `p-listbox` con selección múltiple y filtros para gestionar la visibilidad por clientes y roles.
- **`DiagramEditor`**:
  - Integración profesional mediante `iframe` de `embed.diagrams.net`.
  - Comunicación bidireccional mediante `window.postMessage`.
  - Soporta guardado directo desde la interfaz de Draw.io hacia nuestra API, enviando únicamente el contenido XML actualizado.

### 2. Rutas y Navegación
- Configurado en `diagram.routing.ts` con carga perezosa (`loadComponent`).
- Integrado en el menú principal a través de `pages.routing.ts`.

---

## 🛠️ Notas de Infraestructura y Seguridad

### Política de Seguridad de Contenido (CSP)
Se ha actualizado el `index.html` para permitir el embebido del editor de Draw.io:
- `frame-src 'self' ... https://embed.diagrams.net;`

### Resolución de Conflictos de Migración
Se detectó una desincronización inicial que se solucionó mediante una **Migración Forzada Manual** (`AddDiagramDrawTablesForce`):
- Se inyectó código SQL manual en el método `Up` para crear las tablas, índices y claves foráneas.

---
**Estado del Proyecto:** Implementado y Verificado. Listo para producción.
