# LuxuryApp Knowledge Index (Skills)

Este directorio contiene **deep-dives** con ejemplos detallados de implementación.
Las **reglas normativas** están en `CONVENTIONS.md` (única fuente de verdad).
Cada skill referencia la sección de CONVENTIONS que le corresponde. No duplicar reglas aquí.

## Estructura de Navegacion

### Core y Global (./core/)

Reglas transversales a todo el proyecto.

- **[documentation-encoding.md](./core/documentation-encoding.md)**: Idioma (espanol), comentarios, UTF-8 y Encoding.
- **[data-standards.md](./core/data-standards.md)**: Guids, Naming de DTOs, Enums y Paginacion.
- **[git-workflow.md](./core/git-workflow.md)**: Convenciones de Branches y Commits.

### Backend (.NET 10) (./backend-dotnet/)

Patrones especificos para la API de C#.

- **[architecture.md](./backend-dotnet/architecture.md)**: Primary Constructors, Controllers, Namespaces y Background Jobs.
- **[ef-core-performance.md](./backend-dotnet/ef-core-performance.md)**: Proyecciones manuales (No AutoMapper en Select), AsNoTracking y Precision Decimal.
- **[logging-tracing.md](./backend-dotnet/logging-tracing.md)**: Estandares de Serilog e ILogger.
- **[transactions.md](./backend-dotnet/transactions.md)**: Cuando y como usar Transacciones explicitas vs SaveChangesAsync.
- **[migrations.md](./backend-dotnet/migrations.md)**: Workflow de Migraciones de base de datos.

### Frontend (Angular 22) (./frontend-angular/)

Patrones para la Web App y Mobile (Ionic).

- **[signals-components.md](./frontend-angular/signals-components.md)**: Angular Signals API, Standalone components, Reactive imports (@core).
- **[forms-validation.md](./frontend-angular/forms-validation.md)**: Reactive Forms, Custom Inputs, Cross-Field Validation y FormHelper.
- **[tables-mobile.md](./frontend-angular/tables-mobile.md)**: Configuracion de p-table y su version espejo DataViewMobile.
- **[api-dialogs.md](./frontend-angular/api-dialogs.md)**: Uso de ApiResponseService y DialogHandlerService.
- **[utilities-pipes.md](./frontend-angular/utilities-pipes.md)**: Pipes estandar, DateService, EnumSelectService y StorageService.
- **[pdf-generation.md](./frontend-angular/pdf-generation.md)**: Arquitectura de generacion de PDFs con pdfmake.

### Infraestructura y Shared (./shared-infra/)

Servicios transversales y logica compartida.

- **[file-system.md](./shared-infra/file-system.md)**: Arquitectura de 3 capas para almacenamiento de archivos e imagenes.
- **[notifications.md](./shared-infra/notifications.md)**: Orquestacion de Email, Push (OneSignal), SignalR y WhatsApp.
- **[identity-context.md](./shared-infra/identity-context.md)**: Uso de ICurrentUserService y claims del usuario.

### Frontend Móvil (Flutter) (./flutter/)

Patrones para la app móvil Flutter (paridad con Angular 22 y .NET 10).

- **[state-management.md](./flutter/state-management.md)**: Signals/Riverpod, const constructors y rebuild selectivo (OnPush).
- **[api-access.md](./flutter/api-access.md)**: ApiResponseService, endpoints kebab-case y resilientcia con dio.
- **[forms-validation.md](./flutter/forms-validation.md)**: reactive_forms estrictamente tipados y FormHelper.
- **[design-system.md](./flutter/design-system.md)**: Catálogo design_system, widgets adaptativos y theming.
- **[naming.md](./flutter/naming.md)**: Un tipo por archivo, sufijos .dto/.enum y JSON sin reflexión.

### Docs Workflow (./docs-workflow/)

Workflow para generar documentacion tecnica post-analisis. `SKILL.md` es el punto de entrada.

### Planeación de Módulos (./planeacion-modulos/)

Facilitación de requisitos y trazabilidad a código para módulos nuevos, ampliación o auditoría, ANTES de escribir código. `SKILL.md` es el punto de entrada. Referencia (no duplica) el canon de `CONVENTIONS.md §4.6/§5.9` y `docs-conventions/conventions/operations/*`. Incluye el reconocimiento obligatorio de estructura de entidades (`01b-entidad-estructura.md`).

- **[SKILL.md](./docs-workflow/SKILL.md)**: Descripcion del workflow, prompts disponibles y templates.
- **Prompts** (`./docs-workflow/prompts/`): Instrucciones de proceso sin reglas de formato (ver CONVENTIONS.md §11).
  - `prompt-analisis-modulo.md` — documentar backend + frontend + diagramas.
  - `prompt-generar-audit.md` — generar auditoria con hallazgos.
  - `prompt-generar-plan.md` — generar plan de implementacion con fases y checkboxes.
- **Templates** (`./docs-workflow/templates/`): Esqueletos de output sin reglas inline.
  - `template-doc-modulo.md`
  - `template-audit.md`
  - `template-plan-modulo.md`

---

## Instruccion para Agentes

1. **Identifica el area** de tu tarea (Backend, Frontend, Shared o Docs).
2. **Consulta el archivo especifico** en este indice.
3. **No leas archivos irrelevantes** para ahorrar contexto.
4. Si la regla no esta aqui, consulta los archivos en la carpeta `core/`.
