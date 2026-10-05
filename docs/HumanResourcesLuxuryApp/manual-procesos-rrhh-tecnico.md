# Documentacion del Modulo: Manuales y Procesos

> **Fecha:** 2026-06-05
> **Stack:** Backend .NET 10 / C# / EF Core 10 / SQL Server | Frontend Angular 22 / Signals / Bootstrap 5 + Ionic Standalone
> **API:** REST con `ApiResponseDTO<T>`
> **Auth:** JWT Bearer

---

## 1. Proposito del Modulo

Gestionar la documentacion operativa de Luxury Building Group (GLB): procedimientos, manuales tecnicos, instructivos, politicas, protocolos y comunicados. Cada documento (ManualTemplate) tiene una cabecera con metadatos, una secuencia ordenada de pasos (ManualPaso), y puede contener imagenes, diagramas, enlaces/videos, versiones historicas y archivos adjuntos.

El modulo sustituyo el sistema legacy de "Items" (secciones JSON estructuradas tipo RACI, Glossary, etc.) por un modelo de flujo de trabajo basado en **Pasos Secuenciales**.

---

## 2. Ubicacion en el Repo

### Backend

| Capa | Ruta |
|------|------|
| Entidades | `api/LuxuryApp.Infrastructure/Data/Entities/ManualesYProcesos/` |
| Controlador | `api/LuxuryApp.Application/Tenant/Hr/RecursosHumanos/ManualsAndProcesses/Controller/ManualPasosController.cs` |
| Servicio | `api/LuxuryApp.Application/Tenant/Hr/RecursosHumanos/ManualsAndProcesses/Services/ManualTemplateService.cs` |
| Interfaz | `api/LuxuryApp.Application/Tenant/Hr/RecursosHumanos/ManualsAndProcesses/Interfaces/IManualTemplateService.cs` |
| DTOs | `api/LuxuryApp.Application/Tenant/Hr/RecursosHumanos/ManualsAndProcesses/DTOs/` |
| Enums | `api/LuxuryApp.Shared/Enums/` |

### Frontend

| Recurso | Ruta |
|---------|------|
| Feature completa | `client/angular/src/app/features/biblioteca/manuals-and-processes/` |
| Modelos/DTOs | `models/manuals-and-processes.dto.ts` |
| Modelos legacy | `models/section-content.models.ts` (solo compatibilidad con datos historicos) |
| Routing | `client/angular/src/app/routing/library.routing.ts` |
| Endpoints | `client/angular/src/app/core/constants/endpoints.ts` -> objeto `ManualsPasos` |

---

## 3. Modelo de Datos (Entidades)

```
ManualTemplate                          — Cabecera del manual
  ├── ManualPaso[]                      — Pasos secuenciales del procedimiento
  │     ├── ManualPasoResponsable[]     — Roles responsables del paso
  │     ├── ManualPasoImagen[]          — Imagenes ilustrativas del paso
  │     ├── ManualPasoEnlace[]          — Enlaces externos / videos embebidos
  │     └── ManualDiagram?              — Diagrama Draw.io vinculado 1:1 al paso
  ├── ManualTemplateVersion[]           — Historial de versiones (change log)
  ├── ManualTemplateAttachment[]        — Archivos adjuntos (PDF, Excel, etc.)
  ├── ManualTemplateRole[]              — Roles con acceso al manual
  └── ManualTemplateCustomer[]          — Condominios con acceso al manual
```

### ManualTemplate (cabecera)

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Id | Guid | PK |
| Folio | string(100) | Codigo unico del manual (ej: PROC-MANT-012) |
| Description | string(500) | Descripcion / titulo del manual |
| Objetivo | string(2000) | Proposito operativo del documento |
| MarcoLegal | string | Normativa y referencias |
| Departament | EDepartament | Departamento responsable |
| DocumentType | EDocumentTypeForManuals | Tipo de documento (ver seccion 4) |
| ConfidentialityLevel | EConfidentialityLevel | Nivel de confidencialidad |
| CurrentVersion | string(20) | Version actual (default "1.0") |
| IsGlobal | bool | Si aplica a todos los clientes |
| IsActive | bool | Si esta publicado/vigente |
| Periodicity | EExecutionPeriodicity | Frecuencia de ejecucion (0-5) |
| ExecutionDaysOfWeek | List<int> | Dias de la semana (0=Dom..6=Sab) |
| ExecutionWeekOfMonth | int? | Semana del mes (1-5) |
| ExecutionDayOfMonth | int? | Dia del mes (1-31) |
| ExecutionMonthOfYear | int? | Mes del ano (1-12) |
| CreatedAt / CreatedBy | - | Auditoria |
| UpdatedAt / UpdatedBy | - | Auditoria |

### ManualPaso

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Id | Guid | PK |
| ManualTemplateId | Guid | FK -> ManualTemplate |
| Orden | int | Posicion en la secuencia |
| Titulo | string(300) | Titulo del paso |
| Descripcion | string(2000) | Detalle / instruccion |
| TipoNota | int | 0=Normal, 1=Nota, 2=Advertencia, 3=BuenasPracticas |
| IsActive | bool | Si el paso esta activo |
| EsNota | [NotMapped] | `TipoNota != 0` |

### ManualPasoEnlace

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Id | Guid | PK |
| ManualPasoId | Guid | FK -> ManualPaso |
| UrlEnlace | string(2000) | URL del enlace externo |
| EsVideo | bool | Si es video (se renderiza como iframe) |
| Orden | int | Orden de aparicion |

### ManualPasoImagen

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Id | Guid | PK |
| ManualPasoId | Guid | FK -> ManualPaso |
| NombreArchivo | string(500) | Nombre fisico en storage |
| Orden | int | Orden de aparicion |

### ManualDiagram

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Id | Guid | PK |
| ManualPasoId | Guid | FK -> ManualPaso (1:1) |
| Nombre | string(200) | Nombre del diagrama |
| XmlContent | string | Contenido XML del diagrama Draw.io |
| Version | int | Version del diagrama (default 1) |
| EditToken | string(128) | Token de edicion para Draw.io |
| EditTokenExpiry | DateTime? | Expiracion del token |
| ActualizadoEn | DateTime | Ultima actualizacion |

### ManualPasoResponsable

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Id | Guid | PK |
| ManualPasoId | Guid | FK -> ManualPaso |
| RoleId | string | FK -> ApplicationRole |

### ManualTemplateVersion

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Id | Guid | PK |
| ManualTemplateId | Guid | FK -> ManualTemplate |
| Version | string(20) | Numero de version (ej: "2.0") |
| ChangeDate | DateOnly | Fecha del cambio |
| Author | string | Autor del cambio |
| ReviewedBy | string | Revisor |
| ApprovedBy | string | Aprobador |
| ChangeDescription | string(1000) | Descripcion del cambio |

### ManualTemplateAttachment

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Id | Guid | PK |
| ManualTemplateId | Guid | FK -> ManualTemplate |
| Name | string(150) | Nombre descriptivo |
| FileName | string(255) | Nombre fisico en storage |
| FileExtension | string(20) | Extension (.pdf, .docx, etc.) |
| FileSize | long | Tamano en bytes |
| UploadedAt | DateTime | Fecha de carga |
| UploadedBy | string(50) | Usuario que cargo |

### ManualTemplateRole

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Id | Guid | PK |
| ManualTemplateId | Guid | FK -> ManualTemplate |
| RoleId | string | FK -> ApplicationRole |

### ManualTemplateCustomer

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Id | Guid | PK |
| ManualTemplateId | Guid | FK -> ManualTemplate |
| CustomerId | Guid | FK -> Customer |

---

## 4. Enums / Valores Criticos

### ETipoNota (en paso)
```
0 = Normal         — Instruccion regular
1 = Nota           — Informacion complementaria
2 = Advertencia    — Precaucion importante
3 = BuenasPracticas — Recomendacion
```

### EExecutionPeriodicity (frecuencia)
```
0 = ADemanda       — Bajo demanda
1 = UnicaVez       — Una sola ejecucion
2 = Diario         — Diaria
3 = Semanal        — Semanal (+ dias de semana)
4 = Mensual        — Mensual (+ dia o semana)
5 = Anual          — Anual (+ mes y dia opcional)
```

### EDocumentTypeForManuals
```
18 = ProcedimientoOperativo
19 = ManualTecnico
20 = InstructivoResidentes
21 = ProtocoloEmergencia
22 = PoliticaCorporativa
23 = ComunicadoResidentes
```

### EConfidentialityLevel
Niveles de confidencialidad definidos en `LuxuryApp.Shared.Enums`.

---

## 5. API Endpoints (Reales)

> **Ruta base:** `api/manuals`
> **Controlador:** `ManualPasosController` (unico)
> **Autenticacion:** JWT Bearer (todos los endpoints)

### Templates (Cabecera)

| Metodo | Ruta | Accion |
|--------|------|--------|
| GET | `/api/manuals` | Lista de manuales accesibles (filtrados por rol/cliente) |
| GET | `/api/manuals/{id}` | Detalle completo: pasos, versiones, adjuntos, roles, customers |
| POST | `/api/manuals` | Crear cabecera (solo metadatos + roles + customers) |
| PUT | `/api/manuals/{id}` | Actualizar cabecera |
| DELETE | `/api/manuals/{id}` | Eliminar manual completo (en transaccion, borrado fisico post-commit) |

### Pasos

| Metodo | Ruta | Accion |
|--------|------|--------|
| POST | `/api/manuals/{manualId}/pasos` | Agregar paso |
| PUT | `/api/manuals/{manualId}/pasos/{pasoId}` | Actualizar paso |
| DELETE | `/api/manuals/{manualId}/pasos/{pasoId}` | Eliminar paso (borra imagenes, enlaces, diagrama, responsables) |
| PATCH | `/api/manuals/{manualId}/pasos/reordenar` | Reordenar pasos (body: `List<Guid>` de IDs en nuevo orden) |

### Imagenes de Paso

| Metodo | Ruta | Accion |
|--------|------|--------|
| POST | `/api/manuals/{manualId}/pasos/{pasoId}/imagenes` | Subir imagen (multipart: `imagen`) |
| DELETE | `/api/manuals/{manualId}/pasos/{pasoId}/imagenes/{imagenId}` | Eliminar imagen |

### Enlaces de Paso

| Metodo | Ruta | Accion |
|--------|------|--------|
| POST | `/api/manuals/{manualId}/pasos/{pasoId}/enlaces` | Agregar enlace/video |
| DELETE | `/api/manuals/{manualId}/pasos/{pasoId}/enlaces/{enlaceId}` | Eliminar enlace |

### Diagramas

| Metodo | Ruta | Accion |
|--------|------|--------|
| POST | `/api/manuals/{manualId}/pasos/{pasoId}/diagrama` | Crear diagrama (body: `{nombre}`). Si ya existe, lo retorna. |
| GET | `/api/manuals/diagrama/{diagramaId}` | Obtener diagrama por ID |
| PUT | `/api/manuals/diagrama/{diagramaId}` | Actualizar XML del diagrama (body: `{content}`) |
| DELETE | `/api/manuals/{manualId}/pasos/{pasoId}/diagrama` | Eliminar diagrama del paso |

### Versiones

| Metodo | Ruta | Accion |
|--------|------|--------|
| POST | `/api/manuals/{manualId}/versiones` | Agregar registro de version |
| DELETE | `/api/manuals/{manualId}/versiones/{versionId}` | Eliminar registro de version |

### Adjuntos

| Metodo | Ruta | Accion |
|--------|------|--------|
| POST | `/api/manuals/{manualId}/adjuntos` | Subir archivo adjunto (multipart: `nombre` + `archivo`) |
| DELETE | `/api/manuals/{manualId}/adjuntos/{adjuntoId}` | Eliminar archivo adjunto |

---

## 6. Endpoints Frontend (Objeto `ManualsPasos`)

Definido en `endpoints.ts` linea 1117. Mapeo completo:

```typescript
ManualsPasos: {
  getAll:                             "manuals"
  getById: (id) =>                    `manuals/${id}`
  create:                             "manuals"
  update: (id) =>                     `manuals/${id}`
  delete: (id) =>                     `manuals/${id}`
  addPaso: (manualId) =>             `manuals/${manualId}/pasos`
  updatePaso: (manualId, pasoId) =>  `manuals/${manualId}/pasos/${pasoId}`
  deletePaso: (manualId, pasoId) =>  `manuals/${manualId}/pasos/${pasoId}`
  reordenarPasos: (manualId) =>      `manuals/${manualId}/pasos/reordenar`
  subirImagen: (manualId, pasoId) => `manuals/${manualId}/pasos/${pasoId}/imagenes`
  eliminarImagen: (...) =>           `manuals/${manualId}/pasos/${pasoId}/imagenes/${imagenId}`
  addEnlace: (manualId, pasoId) =>   `manuals/${manualId}/pasos/${pasoId}/enlaces`
  deleteEnlace: (...) =>             `manuals/${manualId}/pasos/${pasoId}/enlaces/${enlaceId}`
  crearDiagrama: (manualId, pasoId) => `manuals/${manualId}/pasos/${pasoId}/diagrama`
  getDiagrama: (diagramaId) =>       `manuals/diagrama/${diagramaId}`
  updateDiagrama: (diagramaId) =>    `manuals/diagrama/${diagramaId}`
  deleteDiagrama: (manualId, pasoId) => `manuals/${manualId}/pasos/${pasoId}/diagrama`
  addVersion: (manualId) =>          `manuals/${manualId}/versiones`
  deleteVersion: (manualId, versionId) => `manuals/${manualId}/versiones/${versionId}`
  addAdjunto: (manualId) =>          `manuals/${manualId}/adjuntos`
  deleteAdjunto: (manualId, adjuntoId) => `manuals/${manualId}/adjuntos/${adjuntoId}`
}
```

---

## 7. Rutas Frontend

| Ruta URL | Componente | Guard | Descripcion |
|----------|-----------|-------|-------------|
| `/library/manuals-and-processes` | `ManualsAndProcessesList` | `authGuard` | Lista agrupada por departamento |
| `/library/manuals-and-processes/guide` | `ManualsAndProcessesGuide` | `authGuard` | Guia del modulo |
| `/library/manuals-and-processes/detail/:id` | `ManualsAndProcessesDetail` | `authGuard` | Vista de lectura del manual |
| `/library/manuals-and-processes/editor/:id` | `ManualsAndProcessesEditor` | `authGuard` + `superUserGuard` | Editor completo de pasos, versiones, adjuntos |
| `/library/manuals-and-processes/flowchart-editor/:id` | `ManualFlowchartEditor` | `authGuard` + `superUserGuard` | Editor de diagrama Draw.io |

---

## 8. Componentes Frontend

### ManualsAndProcessesList (list page)
- **Ubicacion:** `pages/manuals-and-processes-list.ts`
- Agrupa manuales por departamento con iconos y colores
- Busqueda por folio, descripcion o departamento
- Acciones: Ver detalle, Editar (formulario modal), Editor de pasos, Eliminar
- Roles admin: `SuperUsuario`, `Legal`, `RecursosHumanos`, `Reclutamiento`
- Soporte mobile con `DataViewMobile` + `IonItem`

### ManualsAndProcessesDetail (view page)
- **Ubicacion:** `pages/manuals-and-processes-detail.ts`
- Muestra: logo corporativo, folio, descripcion, objetivo, marco legal
- Pasos del procedimiento con numeracion, tipo de nota visual (colores/iconos)
- Diagramas renderizados con `DiagramPreviewComponent` (Draw.io viewer)
- Imagenes con `p-image` (preview modal)
- Enlaces: si es video lo muestra como iframe (Youtube embebido), si no como link externo
- Adjuntos descargables
- Historial de versiones
- Periodicidad human-readable (ej: "Semanal (Lun, Mie, Vie)")

### ManualsAndProcessesForm (create/edit dialog)
- **Ubicacion:** `pages/manuals-and-processes-form.ts`
- Modal dialog para crear/editar cabecera del manual
- Campos: folio, version, departamento, descripcion, objetivo, marco legal
- Periodicidad con sub-campos condicionales (dias de semana, semana del mes, etc.)
- Visibilidad: lista de customers (multiselect con checkbox) y roles (agrupados)
- Switches: IsGlobal, IsActive
- Catalogs: roles, customers, departamentos (via `apiS.onGetSelectItem`)

### ManualsAndProcessesEditor (editor page)
- **Ubicacion:** `pages/manuals-and-processes-editor/`
- Panel izquierdo: lista de pasos ordenable con Drag & Drop (CDK)
- Panel derecho: formulario del paso seleccionado
- Tabs: Pasos | Versiones | Adjuntos
- Por paso: titulo, descripcion, roles responsables, tipo de nota (select button)
- Sub-recursos del paso:
  - **Diagrama:** boton para crear/abrir diagrama Draw.io
  - **Imagenes:** upload con file input o Ctrl+V (paste). Redimension automatica a 1600x1600
  - **Enlaces:** formulario URL + flag esVideo. Preview de video embebido
- Drag & Drop reordenable: al soltar se llama PATCH reordenar
- Soporte para pegar imagenes desde portapapeles

### ManualFlowchartEditor (diagram editor)
- **Ubicacion:** `pages/manual-flowchart-editor/`
- Integra Draw.io vía iframe con `embed.diagrams.net`
- Comunicacion via PostMessage (configure, init, load, save, exit)
- Config corporativa: fuente IBM Plex Sans, colores corporativos GLB
- XML default con nodo "Inicio" si el diagrama esta vacio
- Guarda automaticamente al hacer "save" desde Draw.io
- Boton de salida retorna a la pagina anterior

### DiagramPreviewComponent
- **Ubicacion:** `components/diagram-preview.ts`
- Renderiza diagramas Draw.io usando `viewer-static.min.js`
- Config: highlight, nav=false, resize=true, toolbar="zoom"
- Carga el script asincronicamente si no esta presente

---

## 9. Seguridad y Filtrado por Roles

### Control de Acceso a Nivel de Registro

El metodo `ObtenerAccesiblesAsync()` en `ManualTemplateService.cs` filtra los manuales segun el rol y cliente del usuario autenticado:

```csharp
// Si NO es SuperUsuario o tiene CustomerId asignado:
query = query.Where(m =>
    (m.IsGlobal || m.TemplateRoles.Any(r => r.RoleId == roleId)) &&
    (!customerId.HasValue || m.IsGlobal ||
        m.TemplateCustomers.Any(c => c.CustomerId == customerId)));
```

**Logica:**
- **SuperUsuario** ve TODOS los manuales activos (sin filtro)
- **Usuarios con CustomerId:** ven manuales Globales O manuales asignados a su customer + que tengan su rol
- **Usuarios sin CustomerId:** ven manuales Globales O manuales con su rol asignado

### Roles Administrativos (Frontend)

Los roles que pueden crear/editar/eliminar manuales son:
- `SuperUsuario`
- `Legal`
- `RecursosHumanos`
- `Reclutamiento`

La propiedad `isAdmin()` se calcula via `AspRoleService.roleSignal()` en `ManualsAndProcessesList` y `ManualsAndProcessesDetail`.

### Guards de Ruta

| Ruta | Guard |
|------|-------|
| Lista, Detalle, Guia | `authGuard` (cualquier usuario autenticado) |
| Editor de pasos | `authGuard` + `superUserGuard` |
| Editor de diagramas | `authGuard` + `superUserGuard` |

---

## 10. Almacenamiento de Archivos

### Imagenes de Paso
- **Directorio:** `writePaths.ManualsAndProcessesDirectory()`
- **Lectura:** `readPaths.GetManualsAndProcessesFilePath(nombreArchivo)`
- **Procesamiento:** Redimension automatica a 1600x1600, manteniendo relacion de aspecto
- **Servicio:** `IImageStorageService`

### Adjuntos (Archivos)
- **Directorio:** `writePaths.ManualsAndProcessesLibraryDir()`
- **Lectura:** `readPaths.GetManualsAndProcessesLibraryUrl(fileName)`
- **Servicio:** `ISecureFileStorageService` (guarda con nombre original + extension)
- **Formatos permitidos (FE):** .pdf, .doc, .docx, .xls, .xlsx

### Diagramas
- **No se almacenan como archivos** — el XML se guarda directamente en la columna `ManualDiagram.XmlContent`
- Se renderizan via `embed.diagrams.net` (editor) o `viewer-static.min.js` (lectura)

### Borrado Fisico
- Las operaciones de eliminacion usan **transacciones SQL** para asegurar consistencia
- El borrado fisico de archivos ocurre **despues** del `transaction.CommitAsync()`
- Si la transaccion falla, se hace `RollbackAsync()` y NO se borran archivos

---

## 11. Dependencias del Servicio

`ManualTemplateService` inyecta:

| Dependencia | Uso |
|-------------|-----|
| `ApplicationDbContext` | Acceso a BD (EF Core) |
| `ICurrentUserService` | Obtencion del usuario autenticado (RoleId, CustomerId, UserRole) |
| `IImageStorageService` | Guardado/borrado de imagenes con redimension |
| `IFileWritePathService` | Rutas de escritura para archivos |
| `IFileReadPathService` | URLs de lectura para archivos |
| `ISecureFileStorageService` | Guardado/borrado de adjuntos (archivos generales) |

---

## 12. DTOs (Backend -> Frontend)

| DTO | Uso |
|-----|-----|
| `ManualTemplateSimpleDTO` | Item de lista (cabecera + periodicidad) |
| `ManualTemplateDetalleDTO` | Detalle completo (hereda de Simple + pasos, adjuntos, versiones, roles, customers) |
| `ManualTemplateAddDTO` | Creacion de cabecera |
| `ManualTemplateEditDTO` | Edicion de cabecera (hereda de AddDTO + Id) |
| `ManualPasoDTO` | Paso con imagenes, enlaces, diagrama, roles |
| `ManualPasoAddDTO` | Creacion de paso |
| `ManualPasoEditDTO` | Edicion de paso |
| `ManualPasoImagenDTO` | Imagen (Id, Url, Orden) |
| `ManualPasoEnlaceDTO` | Enlace (Id, UrlEnlace, EsVideo, Orden) |
| `ManualPasoEnlaceAddDTO` | Creacion de enlace (UrlEnlace, EsVideo) |
| `ManualAdjuntoSimpleDTO` | Adjunto (Id, Nombre, Url, FileExtension) |
| `ManualVersionSimpleDTO` | Version (Id, Version, FechaCambio, Autor, DescripcionCambio) |
| `ManualVersionAddDTO` | Creacion de version |
| `ManualDiagramSimpleDTO` | Diagrama (Id, ManualPasoId, Nombre, XmlContent, ActualizadoEn) |
| `ManualDiagramCreateDTO` | Creacion de diagrama (Nombre) |
| `ManualDiagramUpdateDTO` | Actualizacion de diagrama (Content) |

---

## 13. Flujo de Trabajo Tipico

1. **Usuario con rol admin** navega a `/library/manuals-and-processes`
2. Ve lista de manuales agrupados por departamento (solo los que tiene permiso de ver)
3. **Crear:** Clic "Nuevo Manual" -> formulario modal -> llena cabecera (folio, departamento, periodicidad, visibilidad por rol/cliente) -> POST `/api/manuals`
4. **Editar contenido:** Clic "Editor" -> pagina de editor con 3 tabs
5. **Agregar pasos:** Tab "Pasos" -> Agregar Paso -> formulario (titulo, descripcion, roles, tipo nota) -> POST `/api/manuals/{id}/pasos`
6. **Reordenar:** Drag & Drop -> PATCH `/api/manuals/{id}/pasos/reordenar`
7. **Agregar imagenes:** Subir archivo o Ctrl+V -> POST `/api/manuals/{id}/pasos/{pasoId}/imagenes`
8. **Agregar enlaces/videos:** Formulario URL -> POST `/api/manuals/{id}/pasos/{pasoId}/enlaces`
9. **Diagrama:** Clic "Crear Diagrama" -> POST diagrama -> navega a flowchart-editor (Draw.io iframe)
10. **Versiones:** Tab "Versiones" -> Nueva Version -> POST `/api/manuals/{id}/versiones`
11. **Adjuntos:** Tab "Adjuntos" -> Subir Archivo -> POST `/api/manuals/{id}/adjuntos`
12. **Visualizar:** Clic en manual desde lista -> vista detalle (solo lectura)

---

## 14. Estado del Modulo (Junio 2026)

| Componente | Estado |
|------------|--------|
| Entidades (subsistema ManualPaso) | Completado |
| Migracion de Items legacy a Pasos | Completado |
| CRUD de cabeceras | Completado |
| CRUD de pasos con Drag & Drop | Completado |
| Soporte imagenes en pasos (upload + paste) | Completado |
| Soporte enlaces externos / iframe video | Completado |
| Diagramas Draw.io (1:1 con paso) | Completado |
| Versiones (change log) | Completado |
| Adjuntos (archivos anexos) | Completado |
| Control de acceso por rol/cliente | Completado |
| Vista detalle solo lectura | Completado |
| Editor de diagramas Draw.io integrado | Completado |
| **Generacion de PDF (pdfmake)** | **Pendiente** |
| Periodicidad y ejecucion programada | Completado (datos, sin scheduler) |

### Pendiente: Generacion de PDF
Archivo a crear: `services/manual-pdf.service.ts`
Metodo: `generateAndDownload(template, pasos)`
Requisitos: portada corporativa, renderizar pasos secuenciales, incluir diagramas (imagen exportada), enlaces clicables.

---

## 15. Notas sobre Codigo Legacy

### Eliminado / No usado
- `ManualAppService` (+ interfaz) — eliminado
- `ManualFlowchartService` (+ interfaz, + controlador) — eliminado
- `ManualsController` (controlador duplicado) — eliminado
- `ManualsProfile` (AutoMapper) — eliminado
- `ManualInstance` / `ManualInstanceAddDTO` — eliminado
- `ManualTemplateItem` (secciones JSON) — eliminado (datos pueden persistir en BD pero no se usan)
- Interfaces legacy en frontend (`IManualTemplateDTO`, `IManualFlowchartDTO`, etc.) — eliminadas

### Mantenido por compatibilidad
- `ESectionType` enum (frontend) — para datos historicos en BD
- `EAlertType` enum (frontend) — para datos historicos en BD
- `section-content.models.ts` — soporte de lectura para contenido legacy

### Sobre documentacion existente
- `PROMPT-AGENTE.md` (backend y frontend) — **OBSOLETO**. Describe el sistema legacy con Items/Flowcharts. Usar este documento como referencia actualizada.
- `REVIEW-MANUALES-Y-PROCESOS.md` (backend) — Reporte de auditoria historica. Util como referencia de limpiezas realizadas pero no describe el funcionamiento actual.
- `estructura-jefe-mantenimiento.md` (frontend) — Datos de contenido para carga inicial. No es documentacion tecnica del modulo.

---

## 16. Errores Comunes ya Resueltos

| Error | Causa | Solucion |
|-------|-------|----------|
| 400 Bad Request en PUT items | `id: ""` no es Guid valido para .NET | Usar `crypto.randomUUID()` en frontend |
| NG0955 duplicate tracking keys | Multiples items nuevos con `Guid.Empty` | `crypto.randomUUID()` + `persistedIds: Set<string>` |
| EF migration DLL locked | API corriendo bloquea startup project | Usar `--project Infrastructure.csproj` (tiene `IDesignTimeDbContextFactory`) |
| AutoMapper en proyecciones EF | Evaluacion cliente de mapper | Proyeccion manual en `.Select()` |
| API duplicada en `/api/manuals` | Dos controladores con misma ruta | Unificar en `ManualPasosController` |
