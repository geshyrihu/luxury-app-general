# 🎯 Prompt: Analizar y Documentar Módulo

Genera la documentación técnica de un módulo LuxuryApp siguiendo `CONVENTIONS.md §11` para formato (fechas `dd-MMM-yy`, emojis, Mermaid, bloques, checklist). Usa el template en `templates/template-doc-modulo.md` para la estructura de salida.

> [!IMPORTANT]
> Las reglas visuales (emojis, diagramas, breadcrumbs, colores) están en CONVENTIONS.md §11. No las repitas aquí, aplícalas directamente.

---

## Input requerido

Proporciona una de estas opciones:

**Opción A — Rutas del repositorio:**
- Módulo: [nombre]
- Ruta backend: `api/Modules/[Modulo]/`
- Ruta frontend: `apps/[app]/src/app/[modulo]/`
- Roles involucrados (según `ApplicationRoleEnum`)

**Opción B — Código pegado:**
- Endpoints, DTOs, componentes, reglas de negocio conocidas

---

## Proceso de análisis

### PASO 0: Contexto del Módulo

Antes de tocar código, establece:
- Propósito del negocio
- Actores involucrados (roles reales del enum)
- Dependencias con otros módulos
- Límites (incluye/no incluye)
- Regulatorio/compliance si aplica

### PASO 1: Backend (.NET 10)

#### 1.1 Endpoints API
Por cada endpoint extrae: método, path, descripción, roles (del `ApplicationRoleEnum`), DTOs de entrada/salida, condicionales internas.

#### 1.2 Servicios y Dependencias
- Servicios inyectados
- DbContext y tablas
- HybridCache (key prefix, TTL)
- External APIs
- Event Bus
- Archivos/Storage

#### 1.3 Reglas de Negocio
Todas las condicionales en formato:
- SI [condición] ENTONCES [acción]
- SI [campo] == [valor] APLICAR [regla]
- SI [rol] Y [estado] PERMITIR [acción]

### PASO 2: Frontend (Angular 22)

#### 2.1 Componentes
Por cada componente: selector, ruta relativa, tipo, inputs/outputs, signals, servicios, estilos, testing, lazy loading, comportamiento.

#### 2.2 Flujo de Datos
Estado inicial, carga, errores, actualizaciones UI.

#### 2.3 Interacciones con API
Mapear cada llamada frontend → backend (endpoint, método, DTO, respuesta).

#### 2.4 Arquitectura Mobile (CONVENTIONS.md §15)
Identificar qué patrón aplica (A/B/C según §15.2). Si es listado CRUD → Patrón B obligatorio (wrapper + web + mobile). Documentar componentes mobile, modales nativos (`ion-modal`), y mobile UX.

#### 2.5 Performance
Lazy loading, caché frontend, N+1 queries, infinite scroll, imágenes.

### PASO 3: Diagramas Mermaid

- `flowchart` con swimlanes por rol/actor
- `sequenceDiagram` con autonumber
- `erDiagram` de entidades

### PASO 4: Generar documento

Usa `templates/template-doc-modulo.md` como estructura de salida. Aplica CONVENTIONS.md §11 en cada elemento.

---

## Roles del sistema

Los roles se definen en `api/LuxuryApp.Shared/Enums/ApplicationRoleEnum.cs`. Clasificación por `RoleType`:

| RoleType | Descripción |
|----------|-------------|
| System | SuperUsuario (acceso total) |
| Executive | Dirección |
| Corporate | Legal, RRHH, SistemasGeneral, etc. |
| Staff | Administrador, Concierge, SeguridadInterna, etc. |
| Client | Comite, Condomino |
| Contractor | Jardineria, Limpieza, Seguridad, Proveedor |

Usa estos nombres exactos en las matrices de permisos. No inventes roles.
