# 🤖 Instrucciones para Agentes de IA: Documentar Módulos

**Destino:** Claude, Codex, OpenAI, Cursor, y otros agentes de IA  
**Propósito:** Documentar módulos de forma consistente y estructurada

---

## 📋 FLUJO DE DOCUMENTACIÓN

```
INPUT: 
  - modulo_backend: string (ruta a módulo en .NET)
  - modulo_frontend: string (ruta a carpeta en Angular) [opcional]

NIVEL 1 - README.md (Mínimo Viable)
  ↓ Crear o actualizar en carpeta raíz del módulo
  
NIVEL 2 - Documentación Técnica Completa (Opcional)
  ↓ Crear en Docs/ si el módulo es crítico (Auth, Cobranza, etc.)
```

---

## 📐 NIVEL 1: README.md (OBLIGATORIO)

**Ubicación:** `api/LuxuryApp.Application/Modules/[ModuloLuxuryApp]/README.md`

**Propósito:** Descripción rápida (5 min read) del módulo y sus endpoints

### Estructura Obligatoria

```markdown
# [Nombre Módulo] ([Nombre Corto])

> **Área:** [Categoría del Sistema]  
> **Última actualización:** `DD-MMM-YY`  
> **Estado:** ✅ Vigente / ⚠️ En Mantenimiento / ❌ Deprecado

[1 párrafo: Qué hace este módulo]

## 📍 Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `api/resource` | Listar todos |
| `GET` | `api/resource/{id}` | Obtener por ID |
| `POST` | `api/resource` | Crear |
| `PUT` | `api/resource/{id}` | Actualizar |
| `DELETE` | `api/resource/{id}` | Eliminar |

## 🏢 Actores Involucrados

- [Rol 1]: [Qué puede hacer]
- [Rol 2]: [Qué puede hacer]

## 🔗 Dependencias

- [Módulo 1]: [Por qué depende]
- [Entidad 1]: [Qué relación tiene]

## 🎯 Reglas de Negocio

- **Regla 1:** [Descripción específica]
- **Regla 2:** [Descripción específica]

## 📌 Ubicaciones Clave

- **Services:** `[ModuloLuxuryApp]/Core/Services/`
- **Entities:** `[ModuloLuxuryApp]/Entities/`
- **DTOs:** `[ModuloLuxuryApp]/Contracts/DTOs/`
- **Endpoints:** `[ModuloLuxuryApp]/Endpoints/`

---
```

### Checklist de Calidad para README

- [ ] Nombre claro y descriptivo (no técnico)
- [ ] Área/Categoría identificada
- [ ] Descripción 1-2 párrafos (qué problema resuelve)
- [ ] Tabla de endpoints principal (mín. 5 operaciones)
- [ ] Actores involucrados listados
- [ ] Dependencias identificadas
- [ ] Reglas de negocio (si aplica)
- [ ] Ubicaciones clave en carpetas
- [ ] Fecha actualizada (dd-mmm-yy)
- [ ] Sin URLs rotas

**Tiempo estimado:** 30-45 min

---

## 📚 NIVEL 2: Documentación Técnica Completa (CONDICIONAL)

**Ubicación:** `api/LuxuryApp.Application/Modules/[ModuloLuxuryApp]/Docs/documentacion-[modulo].md`

**Cuándo crear:** Módulo es crítico (Auth, Cobranza, AccessControl) o tiene lógica compleja

**Propósito:** Referencia técnica completa (30 min read) para desarrolladores

### Estructura de 14 Secciones

#### SECCIÓN 1: Encabezado + Metadata

```markdown
# [Módulo Completo] — Documentación Técnica

> **Ruta**: 📂 Documentación > 📂 Sistema/Negocio > 📄 [Nombre]  
> **📅 Última Revisión**: DD-MMM-YY  
> **🛡️ Estado**: ✅ Vigente | ⚠️ En Mantenimiento | ❌ Deprecado  
> **👤 Responsable**: @nombre-equipo

---
```

---

#### SECCIÓN 2: Tabla de Contenidos

```markdown
## 📑 Tabla de Contenidos

1. [Resumen Ejecutivo](#-resumen-ejecutivo)
2. [Visión Funcional](#-visión-funcional)
3. [Arquitectura Técnica](#-arquitectura-técnica)
4. [API Endpoints](#-api-endpoints)
5. [Flujo del Sistema](#-flujo-del-sistema)
6. [Componentes Frontend](#-componentes-frontend)
7. [Reglas de Negocio](#-reglas-de-negocio)
8. [Matriz de Permisos](#-matriz-de-permisos)
9. [Catálogo de Roles](#-catálogo-de-roles)
10. [Base de Datos](#-base-de-datos)
11. [Performance](#-performance)
12. [Glosario de Términos](#-glosario-de-términos)
13. [Checklist de Validación](#-checklist-de-validación)
14. [Historial de Cambios](#-historial-de-cambios)
```

---

#### SECCIÓN 3: Resumen Ejecutivo

```markdown
## 🎯 Resumen Ejecutivo

**Propósito**: [Qué resuelve el módulo]

**Actores Involucrados** (`ApplicationRoleEnum`): 
- [Rol 1]
- [Rol 2]

**Dependencias**: 
- [Módulo/Entidad 1]
- [Módulo/Entidad 2]

**Alcance**:
- ✅ Incluye: [Feature 1], [Feature 2], ...
- ❌ No incluye: [Fuera de scope]

---
```

---

#### SECCIÓN 4: Visión Funcional

```markdown
## 🔍 Visión Funcional

**HU-01 — [Caso de Uso 1]**
> Como **[Rol]** quiero **[Acción]** para **[Beneficio]**
> **Criterios**: 
> - [Criterio 1]
> - [Criterio 2]

**HU-02 — [Caso de Uso 2]**
> [Repetir estructura]

---
```

---

#### SECCIÓN 5: Arquitectura Técnica

```markdown
## 🏗️ Arquitectura Técnica

### Diagrama (Mermaid):

\`\`\`mermaid
graph LR
  subgraph Frontend [appsweb/angular]
    FE["[Componentes frontend]"]
  end
  subgraph API [LuxuryApp.Api]
    EP["Endpoints : IEndpointModule"]
  end
  subgraph App [LuxuryApp.Application / [Modulo]]
    SVC["[Services]"]
  end
  subgraph DB [SQL Server]
    D["ApplicationDbContext"]
  end
  
  FE --> EP
  EP --> SVC
  SVC --> D
\`\`\`

### Componentes Principales:
- **[Servicio 1]**: [Responsabilidad]
- **[Servicio 2]**: [Responsabilidad]

### Decisiones Arquitectónicas:
1. [Decisión + Por qué]
2. [Decisión + Por qué]

---
```

---

#### SECCIÓN 6: API Endpoints

```markdown
## 🔌 API Endpoints

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| `GET` | `api/resource` | Listar | [Admin, User] |
| `GET` | `api/resource/{id}` | Obtener | [Admin, User] |
| `POST` | `api/resource` | Crear | [Admin] |
| `PUT` | `api/resource/{id}` | Actualizar | [Admin] |
| `DELETE` | `api/resource/{id}` | Eliminar | [Admin] |
| `POST` | `api/resource/{id}/action` | Acción especial | [Admin] |

**Request/Response Examples:**

\`\`\`csharp
// POST /api/resource
{
  "name": "...",
  "code": "..."
}

// Response: ApiResponseDTO<ResourceDTO>
{
  "success": true,
  "data": { "id": "...", "name": "..." },
  "message": "Creado exitosamente"
}
\`\`\`

---
```

---

#### SECCIÓN 7: Flujo del Sistema

```markdown
## 📊 Flujo del Sistema

### Flujo Principal: [Nombre]

\`\`\`mermaid
sequenceDiagram
  actor User
  participant Frontend
  participant API
  participant Service
  participant Database
  
  User->>Frontend: [Acción]
  Frontend->>API: POST /api/endpoint
  API->>Service: Execute()
  Service->>Database: Save()
  Database-->>Service: Ok
  Service-->>API: Result
  API-->>Frontend: ApiResponseDTO
  Frontend-->>User: [Resultado visual]
\`\`\`

---
```

---

#### SECCIÓN 8: Componentes Frontend

```markdown
## 🖥️ Componentes Frontend

### [App Portal]

- **[Componente 1]**: [Responsabilidad]
  - Ubicación: `appsweb/angular/src/app/modules/[app]/pages/`
  - Usa: `[Service 1]`, `[Store]`
  - API: `GET api/resource`

- **[Componente 2]**: [Responsabilidad]

### State Management:
- `PaginationStore<T>` para listados
- `signal()` para estado local
- `ApiResponseService` para HTTP

---
```

---

#### SECCIÓN 9: Reglas de Negocio

```markdown
## 🏢 Reglas de Negocio

### [RN-MOD-001] Descripción Regla 1

**Descripción:** [Qué hace]

**Tipo:** Negocio | Workflow | Integridad | Validación

**Ubicación en Código:**
- Backend: `[Service].cs:línea`
- Frontend: `[Component].ts:línea`

**Código Ejemplo:**
\`\`\`csharp
if (condition) { action(); }
\`\`\`

---
```

---

#### SECCIÓN 10: Matriz de Permisos

```markdown
## 🔐 Matriz de Permisos

| Rol | Create | Read | Update | Delete | Action |
|-----|--------|------|--------|--------|--------|
| SuperUsuario | ✅ | ✅ | ✅ | ✅ | ✅ |
| Administrador | ✅ | ✅ | ✅ | ❌ | ✅ |
| [Rol 3] | ❌ | ✅ | ❌ | ❌ | ❌ |

**Validación:** Implementada en `[AuthorizationService]` via `[Authorize]` attributes

---
```

---

#### SECCIÓN 11: Base de Datos

```markdown
## 🗄️ Base de Datos

### Entidades Principales

**[Entidad 1]**
```sql
CREATE TABLE [dbo].[Entidad] (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

**Relaciones:**
- `Entidad.Id` → `OtraEntidad.EntityId` (1:N)

**Índices:**
- `IX_Entidad_Code` on `Code` (único, performance)

---
```

---

#### SECCIÓN 12: Performance

```markdown
## ⚡ Performance

### Optimizaciones Implementadas

- `[AsNoTracking()]` en consultas de lectura
- `.Select()` para proyecciones (vs. entidad completa)
- Índices en `Code`, `CustomerId` (filtros frecuentes)
- Paginación: máx. 200 registros por request
- Cache: [Estrategia si aplica]

### Métricas

| Operación | Tiempo P95 | Observaciones |
|-----------|-----------|---------------|
| GET list | < 200ms | Paginado, 100 registros |
| GET by ID | < 50ms | Directo por PK |
| POST | < 300ms | Con validación |

---
```

---

#### SECCIÓN 13: Glosario de Términos

```markdown
## 📚 Glosario de Términos

| Término | Definición |
|---------|-----------|
| [Término 1] | [Significado en contexto del módulo] |
| [Término 2] | [Significado] |
| API | Interface de aplicación para [módulo] |

---
```

---

#### SECCIÓN 14: Checklist de Validación

```markdown
## ✅ Checklist de Validación

**Cuando audites este módulo, verifica:**

- [ ] Todos los endpoints retornan `ApiResponseDTO<T>`
- [ ] Roles restritos con `[Authorize]`
- [ ] Validación de entrada en DTOs
- [ ] Soft delete (no DELETE físico)
- [ ] Auditoría de cambios registrada
- [ ] Tests unitarios para servicios
- [ ] Documentación de reglas de negocio actualizada
- [ ] Performance dentro de métricas

---
```

---

#### SECCIÓN 15: Historial de Cambios

```markdown
## 📝 Historial de Cambios

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2026-07-26 | Versión inicial | @equipo |
| [Fecha] | [Cambio] | [Autor] |

---
```

---

### Checklist de Calidad para Documentación Técnica

- [ ] TOC completo y navegable
- [ ] Resumen Ejecutivo claro (problema → solución)
- [ ] Historias de Usuario con criterios específicos
- [ ] Diagrama Mermaid (flujo + arquitectura)
- [ ] Tabla de endpoints con roles
- [ ] Reglas de negocio documentadas (RN-MOD-XXX)
- [ ] Matriz de permisos completa
- [ ] Entidades de BD con índices
- [ ] Ejemplos de request/response
- [ ] Glosario de términos (si hay jerga)
- [ ] Performance documentado
- [ ] Historial de cambios
- [ ] Sin URLs rotas
- [ ] Fechas en formato dd-mmm-yy

**Tiempo estimado:** 3-4 horas

---

## 🔄 CUÁNDO ACTUALIZAR DOCUMENTACIÓN

**README.md debe actualizarse:**
- Nuevo endpoint agregado
- Cambio de rutas/nombres
- Cambio en actores/roles
- Cambio en dependencias

**Documentación Técnica debe actualizarse:**
- Cambio arquitectónico significativo
- Nuevas reglas de negocio
- Performance degradado
- Matriz de permisos modificada

---

## 📌 GUARDAR DOCUMENTACIÓN

**Nivel 1:**
```
api/LuxuryApp.Application/Modules/[ModuloLuxuryApp]/README.md
```

**Nivel 2:**
```
api/LuxuryApp.Application/Modules/[ModuloLuxuryApp]/Docs/documentacion-[modulo].md
```

---

## ⏱️ TIEMPO ESTIMADO

| Nivel | Duración | Contenido |
|-------|----------|----------|
| **Nivel 1** (README) | 30-45 min | Endpoints + reglas básicas |
| **Nivel 2** (Técnica) | 3-4 horas | Completo + arquitectura |

---

## 🤖 NOTAS PARA AGENTES

1. **Sé específico:** no "maneja usuarios", sino "CRUD de usuarios con validación de email único"
2. **Ejemplos concretos:** incluye request/response reales (no genéricos)
3. **Diagramas:** Mermaid para flujos complejos, siempre que sea legible
4. **Permisos:** tabla explícita de roles (no "ver CONVENTIONS.md")
5. **Historias de usuario:** formato HU-NN con criterios medibles
6. **Reglas de negocio:** vinculadas a código (archivo:línea)
7. **Actualizaciones:** si módulo ya tiene README, actualizar no crear nuevo
8. **Sincronización:** frontend y backend documentados juntos (mismo .md)

---

**Versión:** 1.0  
**Última actualización:** 2026-07-26  
**Para:** Agentes de IA (Claude, Codex, Cursor, OpenAI, etc.)
