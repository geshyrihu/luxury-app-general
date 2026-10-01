# 🔍 Audit Layers Checklist — 20 Capas de Inspección Exhaustiva

**Vigencia:** 2026-07-29  
**Propósito:** Guía definitiva de auditoría para módulos nuevos y existentes. Expande reporte-coherencia.md (6 capas) con 14 capas adicionales omitidas.  
**Aplicable a:** Auditoría de módulos, validación pre-plan, verificación post-implementación.

---

## 📊 RESUMEN EJECUTIVO: Matriz de Riesgos por Capa

| # | Capa | Descripción | Riesgo si Falla | Severidad |
|:---|:---|:---|:---|:---|
| **1** | Lógica de Negocio (.NET) | Race conditions, manejo de errores, idempotencia | Pérdida de datos | 🔴 CRÍTICO |
| **2** | Base de Datos | N+1 queries, índices, constraints | Degradación performance | 🟠 ALTO |
| **3** | API & Contratos REST | Códigos HTTP, DTOs, paginación | Contract inestable | 🟠 ALTO |
| **4** | Frontend Web (Angular 22) | Memory leaks, OnPush, catálogo custom | UX degrada, crash | 🟡 MEDIO |
| **5** | Mobile (Ionic 8) | Offline mode, teclado, batería | App inutilizable | 🟡 MEDIO |
| **6** | Seguridad Transversal | IDOR, autorización, datos sensibles | Breach crítico | 🔴 CRÍTICO |
| **7** | Cumplimiento Normativo | GDPR, CCPA, privacidad | Multa regulatoria | 🔴 CRÍTICO |
| **8** | Testing & Calidad | Cobertura, tipos, edge cases | Bugs silenciosos | 🟠 ALTO |
| **9** | Logging & Monitoreo | Logs estructurados, alertas, tracing | Incidentes no detectados | 🟠 ALTO |
| **10** | Performance & Escalabilidad | Caching, índices, concurrencia | Timeouts, outages | 🟠 ALTO |
| **11** | Integración & Terceros | Webhooks, retries, circuit breaker | Fallos en cascada | 🟠 ALTO |
| **12** | Datos & Backup | RTO/RPO, encriptación, recovery | Pérdida irreversible | 🔴 CRÍTICO |
| **13** | Documentación | README, Swagger, ADR, Runbook | Deuda técnica, onboarding lento | 🟡 MEDIO |
| **14** | Versionamiento | API versioning, breaking changes | Clientes incompatibles | 🟠 ALTO |
| **15** | Multitenancy & Isolation | Data isolation, rate limiting, quotas | Cross-tenant leakage | 🔴 CRÍTICO |
| **16** | DevOps & Deployment | CI/CD, blue-green, feature flags | Downtime, rollback fallido | 🟠 ALTO |
| **17** | Validaciones Cross-layer | Client ↔ API ↔ DB sincronizadas | Inconsistencia silenciosa | 🟠 ALTO |
| **18** | Accesibilidad WCAG AA | Keyboard, screen readers, contraste | Usuarios excluidos, demandas | 🟡 MEDIO |
| **19** | Convenciones de Código | CONVENTIONS.md, DESIGN_CONVENTIONS.md, naming | Deudatécnica, confusión | 🟡 MEDIO |
| **20** | Reglas de Negocio Auditables | Cada RN traceable a código | Implementación incorrecta | 🟠 ALTO |

---

## 🔍 CAPAS DETALLADAS

### **CAPA 1: Lógica de Negocio y Backend (.NET 10)**

**Cerebro de la aplicación. Acá buscamos que las reglas de negocio se cumplan a rajatabla.**

#### 1.1 Race Conditions
- **❌ Error:** Dos usuarios reservan el mismo espacio simultáneamente
- **✅ Fix:** Bloqueo optimista (rowversion/timestamp) o transacción Serializable
- **🔍 Audit:**
  ```bash
  grep -rn "SaveChangesAsync\|SaveChanges" api/LuxuryApp.Application/Modules/[MOD]/
  # ¿Hay try/catch? ¿Logeo de excepciones?
  # ¿Hay bloqueos optimistas (RowVersion)?
  grep -rn "ConcurrencyToken\|Timestamp" src/
  ```
- **Criterio PASO:** Operaciones críticas tienen RowVersion o transacción Serializable
- **📊 Riesgo:** 🔴 CRÍTICO (pérdida de datos, integridad violada)
- **📖 CONVENTIONS.md ref:** §9.3 (Transacciones y concurrencia)

#### 1.2 Lógica de Negocio en Controlador (Clean Architecture)
- **❌ Error:** Cálculo de descuento en `ProductsController.GetPrice()`
- **✅ Fix:** Mover a `ProductApplicationService.CalculatePrice()`
- **🔍 Audit:**
  ```bash
  find src/LuxuryApp.Api/Modules/[MOD]/ -name "*Controller.cs" -o -name "*Endpoints.cs" | xargs wc -l
  # Máximo 40 líneas por endpoint. Si > 40, hay lógica fuera de servicio
  grep -rn "new\|if\|for\|switch" src/LuxuryApp.Api/Modules/[MOD]/*Endpoints.cs | wc -l
  ```
- **Criterio PASO:** Endpoints tienen solo orquestación (inyectar servicio, llamar método). Lógica en services.
- **📊 Riesgo:** 🟠 ALTO (violación Clean Architecture)
- **📖 CONVENTIONS.md ref:** §3 (Arquitectura por capas), §9.1 (Minimal API structure)

#### 1.3 Excepciones "Tragadas" (Exception Swallowing)
- **❌ Error:** `catch (Exception ex) { }` o `catch { Console.WriteLine(...) }`
- **✅ Fix:** Loguear excepciones, relanzar si es crítico
- **🔍 Audit:**
  ```bash
  grep -rn "catch.*{.*}" api/LuxuryApp.Application/ | grep -E "\s*\}|Console.WriteLine"
  # Resultado esperado: 0 (todas las excepciones logueadas)
  ```
- **Criterio PASO:** Todo `catch` loguea al menos error con contexto
- **📊 Riesgo:** 🔴 CRÍTICO (errores silenciosos, debugging imposible)
- **📖 CONVENTIONS.md ref:** §6.2 (Logging estructurado)

#### 1.4 Falta de Idempotencia
- **❌ Error:** Usuario hace doble clic en "Pagar" → dos transacciones
- **✅ Fix:** Token de idempotencia en POST/PUT
- **🔍 Audit:**
  ```bash
  grep -rn "POST\|PUT" docs/swagger/[MOD].json | grep -v "idempotency"
  # Cada endpoint de escritura debe usar X-Idempotency-Key header
  ```
- **Criterio PASO:** Operaciones críticas (pago, transferencia) validan token de idempotencia
- **📊 Riesgo:** 🔴 CRÍTICO (duplicación de transacciones)
- **📖 CONVENTIONS.md ref:** §9.6 (API contract rules)

#### 1.5 Fechas y Zonas Horarias
- **❌ Error:** `DateTime.Now` (hora local servidor)
- **✅ Fix:** `DateTime.UtcNow` (UTC) + convertir en presentación
- **🔍 Audit:**
  ```bash
  grep -rn "DateTime.Now" api/LuxuryApp.Application/Modules/[MOD]/
  # Resultado esperado: 0 (cambiar por DateTime.UtcNow)
  ```
- **Criterio PASO:** Cero instancias de `DateTime.Now` en lógica de negocio
- **📊 Riesgo:** 🟠 ALTO (reportes desalineados, auditoría incorrecta)
- **📖 CONVENTIONS.md ref:** §9.2 (DateTime handling)

#### 1.6 Validación de Entrada Nula/Vacía
- **❌ Error:** Método recibe `string name` sin validar `null` o vacío
- **✅ Fix:** Usar `FluentValidation` con `NotEmpty()`, `NotNull()`
- **🔍 Audit:**
  ```bash
  grep -rn "public.*Dto" api/LuxuryApp.Application/Modules/[MOD]/DTOs/ -A 5 | grep -v "\[Required\]\|\[NotNull\]"
  # Cada propiedad debe tener validación
  ```
- **Criterio PASO:** Todos los DTOs tienen `[Required]` o `FluentValidation` rules
- **📊 Riesgo:** 🟠 ALTO (seguridad, crashes)
- **📖 CONVENTIONS.md ref:** §9.4 (Validación)

#### 1.7 Manejo de Estados Inválidos
- **❌ Error:** Estado puede ir de "Cancelado" → "Aprobado"
- **✅ Fix:** Máquina de estados explícita (validar transiciones)
- **🔍 Audit:**
  ```bash
  grep -rn "Status\|State" api/LuxuryApp.Application/Modules/[MOD]/ | grep -i "enum"
  # ¿Hay enumeración explícita? ¿Validación de transiciones?
  ```
- **Criterio PASO:** Estados definidos como enum + validación de transiciones legales
- **📊 Riesgo:** 🟠 ALTO (lógica incorrecta)
- **📖 CONVENTIONS.md ref:** §9.2 (Entity design)

---

### **CAPA 2: Base de Datos (SQL Server / PostgreSQL)**

**Almacenamiento. Aquí buscamos integridad, consistencia y rendimiento.**

#### 2.1 Problema N+1 (Query Performance)
- **❌ Error:** Listar 100 empleados → 1 query + 100 queries de departamento
- **✅ Fix:** `Include()` en Entity Framework o `JOIN` en SQL
- **🔍 Audit:**
  ```bash
  grep -rn "\.Where(" api/LuxuryApp.Application/Modules/[MOD]/ | wc -l
  N=$(grep -rn "\.Where(" api/LuxuryApp.Application/Modules/[MOD]/ | wc -l)
  I=$(grep -rn "\.Include(" api/LuxuryApp.Application/Modules/[MOD]/ | wc -l)
  # Si N > 5 && I ≤ N, sospechar N+1
  ```
- **Criterio PASO:** Listados tienen `Include()` o `Select()` para todas las navegaciones
- **📊 Riesgo:** 🟠 ALTO (timeout, CPU spike)
- **📖 CONVENTIONS.md ref:** §2 (Backend stack: EF Core)

#### 2.2 Falta de Índices
- **❌ Error:** Columnas `Status`, `CreatedAt`, `UserId` sin índices
- **✅ Fix:** `[Index]` en entidades o migration script
- **🔍 Audit:**
  ```bash
  grep -rn "\[Index" api/LuxuryApp.Application/Modules/[MOD]/Entities/
  # ¿Hay índices en columnas frecuentes?
  sqlserver: SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('[MOD]Table')
  postgresql: \d [mod]_table
  ```
- **Criterio PASO:** Columnas de filtro/ordenamiento tienen índices (composite si es necesario)
- **📊 Riesgo:** 🟠 ALTO (queries lentas con datos grandes)
- **📖 CONVENTIONS.md ref:** §2.2 (Database design)

#### 2.3 Inconsistencia de Tipos de Datos
- **❌ Error:** BD: VARCHAR(50), .NET: `string`, API DTO: `int`
- **✅ Fix:** Tipo único: BD → Entity → DTO
- **🔍 Audit:**
  ```bash
  grep -rn "public string" api/LuxuryApp.Application/Modules/[MOD]/DTOs/
  # Verificar en BD que columna correspondiente es VARCHAR, no INT
  ```
- **Criterio PASO:** Tipos coinciden en DB → Entity → DTO
- **📊 Riesgo:** 🟠 ALTO (conversiones fallidas, truncamiento)
- **📖 CONVENTIONS.md ref:** §9 (DTOs y mapping)

#### 2.4 Borrado Físico vs. Lógico (Soft Delete)
- **❌ Error:** `DELETE FROM [Table]` → auditoría y historial perdidos
- **✅ Fix:** `IsDeleted = true` (soft delete)
- **🔍 Audit:**
  ```bash
  grep -rn "IsDeleted\|DeletedAt" api/LuxuryApp.Application/Modules/[MOD]/Entities/
  # ¿Hay soft delete? ¿Queries filtran IsDeleted = false?
  grep -rn "\.Delete\|DELETE" src/
  # Resultado esperado: 0 (usar soft delete)
  ```
- **Criterio PASO:** Entidades críticas tienen `IsDeleted` boolean + `DeletedAt` datetime
- **📊 Riesgo:** 🔴 CRÍTICO (pérdida de auditoría, cumplimiento legal)
- **📖 CONVENTIONS.md ref:** §9.2 (Entity soft delete)

#### 2.5 Falta de Constraints en BD
- **❌ Error:** Código valida "email único", pero DB sin `UNIQUE constraint`
- **✅ Fix:** `UNIQUE`, `CHECK`, `FOREIGN KEY` en schema
- **🔍 Audit:**
  ```bash
  grep -rn "\[Index.*IsUnique.*true" api/LuxuryApp.Application/Modules/[MOD]/
  # O en migration:
  migrationBuilder.AddColumn("Email", "Users", maxLength: 255, isUnique: true);
  ```
- **Criterio PASO:** Constraints en BD reflejan reglas de negocio (no solo en código)
- **📊 Riesgo:** 🔴 CRÍTICO (integridad de datos si alguien conecta directo)
- **📖 CONVENTIONS.md ref:** §2.2 (Database integrity)

#### 2.6 Transacciones y Aislamiento
- **❌ Error:** Lectura sin transacción → dirty reads
- **✅ Fix:** Usar `BeginTransaction()` o `using var context = ...`
- **🔍 Audit:**
  ```bash
  grep -rn "using\|BeginTransaction" api/LuxuryApp.Application/Modules/[MOD]/Services/
  # Operaciones multi-paso deben estar en transacción
  ```
- **Criterio PASO:** Operaciones críticas (reserva, pago) usan transacciones explícitas
- **📊 Riesgo:** 🔴 CRÍTICO (inconsistencia de datos)
- **📖 CONVENTIONS.md ref:** §9.3 (Transactionality)

#### 2.7 Migrations y Versionamiento
- **❌ Error:** Cambios directos a BD sin migration script
- **✅ Fix:** `dotnet ef migrations add` + guardar en git
- **🔍 Audit:**
  ```bash
  ls -la src/LuxuryApp.Infrastructure/Migrations/ | grep -c "\.cs"
  # Debe haber migration para cada cambio de schema
  ```
- **Criterio PASO:** Cambios de BD están en `Migrations/` y versionados
- **📊 Riesgo:** 🟠 ALTO (desincronización entre ambientes)
- **📖 CONVENTIONS.md ref:** §2 (Database versioning)

---

### **CAPA 3: API y Contratos REST (.NET)**

**Puente entre backend y frontend. Contrato debe ser estable e inteligible.**

#### 3.1 Códigos HTTP Incorrectos
- **❌ Error:** `200 OK { "success": false, "error": "No encontrado" }`
- **✅ Fix:** `404 Not Found`, `400 Bad Request`, `500 Internal Server Error`
- **🔍 Audit:**
  ```bash
  grep -rn "Ok\|BadRequest\|NotFound" src/LuxuryApp.Api/Modules/[MOD]/Endpoints/
  # Verificar que status code es correcto para el resultado
  ```
- **Criterio PASO:** Cada endpoint devuelve HTTP code semánticamente correcto
- **📊 Riesgo:** 🟠 ALTO (cliente no puede interpretar error)
- **📖 CONVENTIONS.md ref:** §9.6 (HTTP semantics)

#### 3.2 Over-fetching / Under-fetching
- **❌ Error:** GET /users devuelve 50 propiedades (contraseña hasheada, historial completo)
- **✅ Fix:** Usar DTOs específicos, proyectar solo lo necesario
- **🔍 Audit:**
  ```bash
  grep -rn "return.*ToList()" api/LuxuryApp.Application/Modules/[MOD]/
  # ¿Se usa .Select() para limitar columnas? ¿O devuelve entidad completa?
  ```
- **Criterio PASO:** Endpoints devuelven DTOs específicos, no entidades dominio
- **📊 Riesgo:** 🟠 ALTO (exposición de datos, payload innecesario)
- **📖 CONVENTIONS.md ref:** §9.5 (DTO pattern)

#### 3.3 Falta de Paginación y Filtrado
- **❌ Error:** GET /ventas devuelve 10,000 registros de golpe
- **✅ Fix:** Paginación obligatoria en listados
- **🔍 Audit:**
  ```bash
  grep -rn "MapGet.*api/" src/LuxuryApp.Api/Modules/[MOD]/
  # ¿Endopints que devuelven IEnumerable tienen paginación?
  # Buscar skip/take o PaginationCommonDTO
  ```
- **Criterio PASO:** Listados implementan `PaginationCommonDTO` (page, recordsNumber, sortField, sortOrder)
- **📊 Riesgo:** 🟠 ALTO (timeout, OOM en cliente)
- **📖 CONVENTIONS.md ref:** §4 (Paginación) + PAGINACION.md

#### 3.4 Exposición de Entidades de Dominio
- **❌ Error:** API devuelve `User` entity directamente (con navigation properties circulares)
- **✅ Fix:** Mapear a `UserDto` antes de serializar
- **🔍 Audit:**
  ```bash
  grep -rn "return Ok<\|Results.Ok<" src/LuxuryApp.Api/Modules/[MOD]/
  # ¿Qué tipo está entre <>? ¿Es Dto o Entity?
  ```
- **Criterio PASO:** Respuestas son siempre DTOs, nunca Entities
- **📊 Riesgo:** 🟠 ALTO (circular references, data leakage)
- **📖 CONVENTIONS.md ref:** §9.5 (DTO envelope)

#### 3.5 Nombrado de Endpoints (kebab-case)
- **❌ Error:** `MapGet("api/UserAccounts")` → PascalCase
- **✅ Fix:** `MapGroup("api/user-accounts")` → kebab-case
- **🔍 Audit:**
  ```bash
  grep -rn "MapGet\|MapPost\|MapPut" src/LuxuryApp.Api/Modules/[MOD]/ | grep -E "[A-Z]"
  # Resultado esperado: 0 (todas en kebab-case)
  ```
- **Criterio PASO:** Todas las rutas en kebab-case minúsculas
- **📊 Riesgo:** 🟡 MEDIO (inconsistencia con frontend)
- **📖 CONVENTIONS.md ref:** §9.1 (Endpoint naming convention)

#### 3.6 Versionamiento de API
- **❌ Error:** GET /users (sin versión) → cambios rompen clientes
- **✅ Fix:** GET /api/v1/users, GET /api/v2/users
- **🔍 Audit:**
  ```bash
  grep -rn "MapGet.*api/" src/LuxuryApp.Api/ | grep -c "v1\|v2"
  # ¿Endpoints versionados? ¿Hay deprecation date?
  ```
- **Criterio PASO:** Endpoints críticos tienen versión explícita (opcional si proyecto pequeño)
- **📊 Riesgo:** 🟠 ALTO (breaking changes sin control)
- **📖 CONVENTIONS.md ref:** §9.7 (API versioning strategy)

#### 3.7 Documentación Swagger/OpenAPI
- **❌ Error:** Endpoint sin descripción en Swagger
- **✅ Fix:** `[ProduceResponseType(...)]` + `.WithName()` + `.WithOpenApi()`
- **🔍 Audit:**
  ```bash
  grep -rn "\.WithName\|\.WithOpenApi\|ProduceResponseType" src/LuxuryApp.Api/Modules/[MOD]/
  # Cada endpoint debe estar documentado
  ```
- **Criterio PASO:** 100% de endpoints tienen Swagger description
- **📊 Riesgo:** 🟡 MEDIO (documentación outdated)
- **📖 CONVENTIONS.md ref:** §9.8 (API documentation)

---


**Experiencia de usuario y rendimiento en navegador.**

#### 4.1 Fugas de Memoria (Memory Leaks)
- **❌ Error:** Suscribirse en `ngOnInit` pero nunca `unsubscribe` en `ngOnDestroy`
- **✅ Fix:** Usar `signals` o `takeUntil()` en RxJS
- **🔍 Audit:**
  ```bash
  grep -rn "ngOnInit" appsweb/angular/src/app/modules/[MOD]/ | wc -l
  grep -rn "ngOnDestroy" appsweb/angular/src/app/modules/[MOD]/ | wc -l
  # Los números deben ser ≈ iguales (o 0 si usan signals)
  grep -rn "subscribe" appsweb/angular/src/app/modules/[MOD]/ | grep -v "takeUntil\|toSignal\|async"
  # Resultado esperado: 0 (sin subscriptions sin cleanup)
  ```
- **Criterio PASO:** No hay `subscribe()` sin `takeUntil()` o similar
- **📊 Riesgo:** 🟡 MEDIO (memory leak, app lenta)
- **📖 CONVENTIONS.md ref:** §2.3 (Signals API obligatorio)

#### 4.2 Violación del Catálogo Custom
- **✅ Fix:** Consumir componente del catálogo `@ui/*` o wrapper oficial. Si el caso es tabla desktop/web, validar que el uso directo de `<p-table>` siga el patrón oficial vigente del proyecto
- **🔍 Audit:**
  ```bash
  grep -rn "<p-table\|<p-button\|<p-input" appsweb/angular/src/app/modules/[MOD]/
  # Resultado esperado: sin imports directos salvo los estrictamente necesarios para la tabla aprobada
  ```
- **📊 Riesgo:** 🟡 MEDIO (inconsistencia visual, desviación de DS)
- **📖 CONVENTIONS.md ref:** §3 (Catálogo custom), DESIGN_CONVENTIONS.md (91 componentes)

#### 4.3 Change Detection Ineficiente
- **❌ Error:** Componente pesado (tabla 1000 rows) con `Default` change detection
- **✅ Fix:** `ChangeDetectionStrategy.OnPush` obligatorio
- **🔍 Audit:**
  ```bash
  grep -rn "@Component" appsweb/angular/src/app/modules/[MOD]/ | grep -v "OnPush"
  # Resultado esperado: 0 (todos los componentes tienen OnPush)
  ```
- **Criterio PASO:** 100% de componentes usan `ChangeDetectionStrategy.OnPush`
- **📊 Riesgo:** 🟡 MEDIO (change detection loop infinito, lag)
- **📖 CONVENTIONS.md ref:** §2.4 (Change Detection: OnPush)

#### 4.4 Validaciones Desincronizadas
- **❌ Error:** Frontend permite fecha-fin < fecha-inicio, backend lo rechaza con 400, frontend muestra toast genérico
- **✅ Fix:** Validar en FormGroup + mostrar error en campo específico
- **🔍 Audit:**
  ```bash
  grep -rn "addValidators\|validator:" appsweb/angular/src/app/modules/[MOD]/
  # ¿Hay validaciones cross-field? ¿Se muestran errores específicos?
  ```
- **Criterio PASO:** Validaciones en front + back, mensajes de error descriptivos
- **📊 Riesgo:** 🟡 MEDIO (UX confusa)
- **📖 CONVENTIONS.md ref:** §2.6 (Forms y Reactive)

#### 4.5 @defer y Performance
- **❌ Error:** Tabla con 1000 filas carga todo en ngOnInit
- **✅ Fix:** Usar `@defer` para componentes pesados
- **🔍 Audit:**
  ```bash
  grep -rn "<p-table\|<app-chart" appsweb/angular/src/app/modules/[MOD]/ | grep -v "@defer"
  # Componentes pesados deben estar en @defer
  ```
- **📊 Riesgo:** 🟡 MEDIO (slow initial paint, LCP)
- **📖 CONVENTIONS.md ref:** §2.5 (Performance: @defer)

#### 4.6 Tipado Estricto
- **❌ Error:** Usar `any` en tipos
- **✅ Fix:** Tipado fuerte con interfaces
- **🔍 Audit:**
  ```bash
  grep -rn "any" appsweb/angular/src/app/modules/[MOD]/ | grep -v "// TODO\|\/\/ ignore"
  # Resultado esperado: ≤ 2-3 (excepciones justificadas)
  ```
- **Criterio PASO:** Cero uso de `any` (excepto casos excepcionales documentados)
- **📊 Riesgo:** 🟡 MEDIO (bugs en tiempo de ejecución)
- **📖 CONVENTIONS.md ref:** §2.7 (Strict typing)

#### 4.7 Importaciones Correctas (@core)
- **❌ Error:** `import { AuthService } from '../../../../../../core/services'`
- **✅ Fix:** `import { AuthService } from '@core/services'`
- **🔍 Audit:**
  ```bash
  grep -rn "from '\.\./\.\./\.\." appsweb/angular/src/app/modules/[MOD]/
  # Resultado esperado: 0 (usar alias @core)
  ```
- **Criterio PASO:** Cero rutas relativas (usar alias @core, @ui, @shared)
- **📊 Riesgo:** 🟡 MEDIO (refactoring frágil)
- **📖 CONVENTIONS.md ref:** §2.11 (Alias obligatorio)

---

### **CAPA 5: Mobile (Ionic 8 / Angular)**

**Experiencia nativa y táctil.**

#### 5.1 Mentalidad de Web en Móvil
- **❌ Error:** Usar `p-table` adaptado a fuerza en mobile, o depender de hover
- **✅ Fix:** Patrón B (§15.4 CONVENTIONS.md): `app-data-view-mobile` + cards/list
- **🔍 Audit:**
  ```bash
  grep -rn "<p-table" client/ionic/src/app/ | grep -v "hidden md:"
  # Mobile no debe usar p-table; si la usa, debe estar oculta con hidden md:
  grep -rn "hover" client/ionic/src/app/ | grep -v "@media"
  # Resultado esperado: 0 (mobile no usa hover)
  ```
- **Criterio PASO:** App móvil tiene versión separada de cada CRUD (no solo responsive web)
- **📊 Riesgo:** 🟡 MEDIO (UX pobre)
- **📖 CONVENTIONS.md ref:** §15.4 (Patrón B: desktop vs mobile)

#### 5.2 Offline Mode y Cola de Reintentos
- **❌ Error:** Sin conexión → spinner infinito, sin opción de reintentar
- **✅ Fix:** LocalStorage para queue, símbolo de desincronización, reintentos automáticos
- **🔍 Audit:**
  ```bash
  grep -rn "Capacitor.isConnected\|offline" client/ionic/src/app/
  # ¿Hay detección de conexión? ¿Cola de reintentos?
  grep -rn "StorageService\|localStoragequeue" client/ionic/src/app/
  ```
- **Criterio PASO:** Operaciones críticas funcionan offline (al menos guardar localmente)
- **📊 Riesgo:** 🟡 MEDIO (app inutilizable sin internet)
- **📖 CONVENTIONS.md ref:** §15.6 (Mobile UX patterns)

#### 5.3 Teclado y Safe Areas
- **❌ Error:** Input en parte inferior, teclado tapa botón Guardar
- **✅ Fix:** `ion-footer`, `viewport-fit=cover`, scroll cuando teclado abre
- **🔍 Audit:**
  ```bash
  grep -rn "<ion-footer\|viewport-fit" client/ionic/src/app/
  # ¿Hay footer fijo para acciones principales?
  grep -rn "<input" client/ionic/src/app/ | grep -v "ion-input"
  # Resultado esperado: 0 (usar <ion-input>)
  ```
- **Criterio PASO:** Inputs usan `ion-input`, footer con acciones críticas
- **📊 Riesgo:** 🟡 MEDIO (UX frustrada)
- **📖 CONVENTIONS.md ref:** §3 (Mobile UX guidelines)

#### 5.4 Consumo de Batería y CPU
- **❌ Error:** Usar `setInterval()` para polling (wasteful)
- **✅ Fix:** WebSocket/SignalR, pausar animaciones en background
- **🔍 Audit:**
  ```bash
  grep -rn "setInterval\|setTimeout" client/ionic/src/app/ | grep -v "test"
  # Polling debe usar longPolling solo si no hay alternativa
  grep -rn "animation" client/ionic/src/app/ | grep -v "pause\|reduced-motion"
  ```
- **Criterio PASO:** No hay polling con setInterval; animaciones respetan `prefers-reduced-motion`
- **📊 Riesgo:** 🟡 MEDIO (batería, CPU)
- **📖 CONVENTIONS.md ref:** §2.5 (Performance: lazy loading, animations)

---

### **CAPA 6: Seguridad Transversal**

**Protección del sistema y datos.**

#### 6.1 IDOR (Insecure Direct Object References)
- **❌ Error:** GET /api/ventas/5 → devuelve venta de usuario B porque no valida ownership
- **✅ Fix:** Validar `if (venta.UserId != currentUserId) return Unauthorized()`
- **🔍 Audit:**
  ```bash
  grep -rn "Authorize" src/LuxuryApp.Api/Modules/[MOD]/ -A 3 | grep -E "UserId|TenantId"
  # ¿Cada Get por ID valida ownership?
  ```
- **Criterio PASO:** Cada GET, PUT, DELETE por ID valida que recurso pertenece al usuario
- **📊 Riesgo:** 🔴 CRÍTICO (data leakage)
- **📖 CONVENTIONS.md ref:** §6 (Security)

#### 6.2 Autorización a Nivel de Endpoint
- **❌ Error:** `[Authorize]` (solo valida login) sin roles
- **✅ Fix:** `[Authorize(Policy = "EsAdministrador")]` o validar claims
- **🔍 Audit:**
  ```bash
  grep -rn "\[Authorize" src/LuxuryApp.Api/Modules/[MOD]/ | grep -v "Policy\|Roles"
  # Todos los [Authorize] deben tener Policy específico
  ```
- **Criterio PASO:** Operaciones sensibles (delete, update config) tienen Policy explícito
- **📊 Riesgo:** 🔴 CRÍTICO (privilege escalation)
- **📖 CONVENTIONS.md ref:** §6.1 (Authorization)

#### 6.3 Datos Sensibles en Logs o Frontend
- **❌ Error:** Logs contienen JWT, contraseña, o tarjeta de crédito; localStorage guarda token
- **✅ Fix:** No loguear datos PII; usar HttpOnly cookies para tokens
- **🔍 Audit:**
  ```bash
  grep -rn "logger.LogInformation\|Console.WriteLine" src/ | grep -E "token|password|card|ssn"
  # Resultado esperado: 0 (sin datos sensibles)
  grep -rn "localStorage.setItem.*token" appsweb/angular/src/
  # Resultado esperado: 0 (usar SessionStorage o HttpOnly cookie)
  ```
- **Criterio PASO:** Cero datos sensibles en logs; tokens en HttpOnly cookie
- **📊 Riesgo:** 🔴 CRÍTICO (breach de datos)
- **📖 CONVENTIONS.md ref:** §6.2 (Data privacy in logs)

#### 6.4 Inyección SQL / XSS
- **❌ Error:** `$"SELECT * FROM Users WHERE Id = {userId}"` (sin parametrización)
- **✅ Fix:** Usar Entity Framework (automático) o `@param` en SQL
- **🔍 Audit:**
  ```bash
  grep -rn "\$\"\|+\s*" src/LuxuryApp.Api/ | grep -i "select\|insert\|delete"
  # Resultado esperado: 0 (sin concatenación en queries)
  grep -rn "innerHTML\|dangerouslySetInnerHTML" appsweb/angular/src/
  # Resultado esperado: 0 (no usar innerHTML con datos de usuario)
  ```
- **Criterio PASO:** Cero SQL concatenation; templates usan interpolation de Angular
- **📊 Riesgo:** 🔴 CRÍTICO (breach de datos, control de sistema)
- **📖 CONVENTIONS.md ref:** §6 (Security best practices)

#### 6.5 CORS Configuración
- **❌ Error:** CORS permitido desde cualquier origen
- **✅ Fix:** Whitelist específica de dominios permitidos
- **🔍 Audit:**
  ```bash
  grep -rn "AllowAnyOrigin\|AllowCredentials" src/LuxuryApp.Api/
  # Resultado esperado: 0 (configurar whitelist específica)
  ```
- **Criterio PASO:** CORS restringe a dominios conocidos
- **📊 Riesgo:** 🔴 CRÍTICO (CSRF, malicious cross-site)
- **📖 CONVENTIONS.md ref:** §6.3 (CORS policy)

#### 6.6 Encriptación en Tránsito y Reposo
- **❌ Error:** Datos sensibles sin encriptación en reposo o en tránsito HTTP (no HTTPS)
- **✅ Fix:** HTTPS obligatorio, encriptación de campos sensibles en BD
- **🔍 Audit:**
  ```bash
  grep -rn "http://" src/ client/ | grep -v "localhost\|test"
  # Resultado esperado: 0 (usar https://)
  grep -rn "\[Encrypted\]" api/LuxuryApp.Application/Modules/[MOD]/Entities/
  # ¿PII tiene atributo [Encrypted]?
  ```
- **Criterio PASO:** Tránsito HTTPS, datos PII encriptados en BD
- **📊 Riesgo:** 🔴 CRÍTICO (interception, exposure)
- **📖 CONVENTIONS.md ref:** §6.4 (Encryption)

---

### **CAPA 7: Cumplimiento Normativo & Privacidad**

**Regulaciones legales (GDPR, CCPA, locales).**

#### 7.1 GDPR (General Data Protection Regulation)
- **❌ Error:** Sin mecanismo para borrar datos de usuario (right to be forgotten)
- **✅ Fix:** Endpoint DELETE o anónimización de datos
- **🔍 Audit:**
  ```bash
  grep -rn "DeleteUserData\|RightToForget\|AnonymizeUser" api/LuxuryApp.Application/
  # ¿Hay servicio de borrado de datos?
  ```
- **Criterio PASO:** Mecanismo de borrado de datos implementado y auditado
- **📊 Riesgo:** 🔴 CRÍTICO (multa hasta 4% de revenue o €20M)
- **📖 CONVENTIONS.md ref:** §6.5 (GDPR compliance)

#### 7.2 Consentimiento y Transparencia
- **❌ Error:** Recopilar datos sin consentimiento explícito
- **✅ Fix:** Banner de cookies, política de privacidad, opt-in claro
- **🔍 Audit:**
  ```bash
  grep -rn "CookieConsent\|PrivacyPolicy" appsweb/angular/
  # ¿Hay consentimiento explícito?
  ```
- **Criterio PASO:** Consentimiento grabado, política accesible
- **📊 Riesgo:** 🔴 CRÍTICO (multas legales)
- **📖 CONVENTIONS.md ref:** §6.6 (Privacy policy)

#### 7.3 Data Processing Agreement (DPA)
- **❌ Error:** Usar terceros (Analytics, CRM) sin DPA
- **✅ Fix:** Firmar DPA con cada processor, documentar flujos de datos
- **🔍 Audit:**
  ```bash
  find docs/ -name "*DPA*" -o -name "*privacy*" -o -name "*data-processing*"
  # ¿Hay DPA docs? ¿Está catalogado quién procesa qué datos?
  ```
- **Criterio PASO:** Todos los terceros tienen DPA firmado y documentado
- **📊 Riesgo:** 🔴 CRÍTICO (legal liability)
- **📖 CONVENTIONS.md ref:** §6.7 (Vendor management)

---

### **CAPA 8: Testing & Calidad**

**Cobertura, tipos de tests, edge cases.**

#### 8.1 Cobertura de Tests
- **❌ Error:** Cobertura <50% en módulo crítico
- **✅ Fix:** Unit >80%, Integration >60%, E2E >40% para features críticas
- **🔍 Audit:**
  ```bash
  dotnet test --collect:"XPlat Code Coverage" --settings coverlet.runsettings
  # Revisar % cobertura por módulo
  ```
- **Criterio PASO:** Cobertura ≥80% en lógica de negocio crítica
- **📊 Riesgo:** 🟠 ALTO (bugs silenciosos)
- **📖 CONVENTIONS.md ref:** §16 (Testing strategy)

#### 8.2 Tipos de Tests
- **❌ Error:** Solo unit tests, sin integration o E2E
- **✅ Fix:** Pirámide de tests: Unit (70%), Integration (20%), E2E (10%)
- **🔍 Audit:**
  ```bash
  find src/LuxuryApp.Tests/ -name "*.Tests.cs" | wc -l
  # ¿Hay tests en carpetas Unit/, Integration/, E2E/?
  ```
- **Criterio PASO:** Tests en 3 niveles (Unit, Integration, E2E)
- **📊 Riesgo:** 🟠 ALTO (regresiones en producción)
- **📖 CONVENTIONS.md ref:** §16.2 (Testing pyramid)

#### 8.3 Casos Edge
- **❌ Error:** Tests solo del happy path (usuario con datos válidos)
- **✅ Fix:** Sad path (error handling) + Edge cases (límites, valores nulos)
- **🔍 Audit:**
  ```bash
  grep -rn "Should.*Throw\|Should.*Error\|Null\|Empty" src/LuxuryApp.Tests/
  # ¿Hay tests de error?
  ```
- **Criterio PASO:** Cada feature tiene Happy + Sad + Edge tests
- **📊 Riesgo:** 🟠 ALTO (fallos en producción)
- **📖 CONVENTIONS.md ref:** §16.3 (Test cases)

#### 8.4 Tests de Concurrencia
- **❌ Error:** Sin tests para race conditions (double booking)
- **✅ Fix:** Tests que lanzan múltiples threads simultáneamente
- **🔍 Audit:**
  ```bash
  grep -rn "Task.Run\|Parallel" src/LuxuryApp.Tests/
  # ¿Hay tests de concurrencia?
  ```
- **Criterio PASO:** Operaciones críticas (reserva, pago) tienen concurrency tests
- **📊 Riesgo:** 🔴 CRÍTICO (data corruption)
- **📖 CONVENTIONS.md ref:** §16.4 (Concurrency testing)

#### 8.5 Tests de Performance
- **❌ Error:** Query N+1 descubierta en producción (no en tests)
- **✅ Fix:** Tests de performance (benchmarking)
- **🔍 Audit:**
  ```bash
  grep -rn "BenchmarkDotNet\|StopWatch" src/LuxuryApp.Tests/
  # ¿Hay tests de rendimiento?
  ```
- **Criterio PASO:** Queries críticas tienen benchmark tests
- **📊 Riesgo:** 🟠 ALTO (timeout en producción)
- **📖 CONVENTIONS.md ref:** §16.5 (Performance testing)

---

### **CAPA 9: Logging, Monitoreo & Observabilidad**

**Capacidad de debugging y detección de incidentes.**

#### 9.1 Logs Estructurados
- **❌ Error:** `logger.LogInformation("User updated")` (sin contexto)
- **✅ Fix:** `logger.LogInformation("User {UserId} updated profile", userId)`
- **🔍 Audit:**
  ```bash
  grep -rn "LogInformation\|LogError" api/LuxuryApp.Application/ | grep -v "{\|}"
  # Logs deben tener propiedades interpoladas
  ```
- **Criterio PASO:** Todos los logs incluyen contexto (variables nombradas)
- **📊 Riesgo:** 🟠 ALTO (debugging imposible)
- **📖 CONVENTIONS.md ref:** §6.2 (Structured logging)

#### 9.2 Niveles de Log Correctos
- **❌ Error:** Usar `LogError` para warns, o `LogDebug` para errores críticos
- **✅ Fix:** Debug < Info < Warning < Error < Critical
- **🔍 Audit:**
  ```bash
  grep -rn "LogCritical.*GetUser\|LogDebug.*Exception" src/
  # Niveles deben ser semánticamente correctos
  ```
- **Criterio PASO:** Niveles de log usan semántica correcta
- **📊 Riesgo:** 🟡 MEDIO (ruido, falsos positivos)
- **📖 CONVENTIONS.md ref:** §6.2 (Log levels)

#### 9.3 Logs sin Datos Sensibles
- **❌ Error:** `logger.LogInformation("JWT: {token}", token)`
- **✅ Fix:** No loguear tokens, passwords, PII
- **🔍 Audit:**
  ```bash
  grep -rn "Log.*token\|Log.*password\|Log.*card" src/
  # Resultado esperado: 0
  ```
- **Criterio PASO:** Cero datos sensibles en logs
- **📊 Riesgo:** 🔴 CRÍTICO (data exposure)
- **📖 CONVENTIONS.md ref:** §6.2 (Sensitive data in logs)

#### 9.4 Tracing Distribuido (Correlation IDs)
- **❌ Error:** Request falla, pero logs de diferentes servicios no se pueden correlacionar
- **✅ Fix:** Propagar `X-Correlation-ID` entre servicios
- **🔍 Audit:**
  ```bash
  grep -rn "CorrelationId\|TraceId" src/LuxuryApp.Api/
  # ¿Se propaga entre requests?
  ```
- **Criterio PASO:** Request IDs propagados en toda cadena (middleware, logs, downstream calls)
- **📊 Riesgo:** 🟠 ALTO (debugging de flujos distribuidos)
- **📖 CONVENTIONS.md ref:** §6.2 (Distributed tracing)

#### 9.5 Alertas y Umbrales
- **❌ Error:** Logs se generan pero no hay alertas; error crítico pasa desapercibido 8 horas
- **✅ Fix:** Alertas automáticas en logs ERROR/CRITICAL
- **🔍 Audit:**
  ```bash
  find docs/ops/ -name "*alerts*" -o -name "*monitoring*"
  # ¿Hay documentación de alertas configuradas?
  ```
- **Criterio PASO:** Alertas configuradas para errores críticos (30 min max)
- **📊 Riesgo:** 🟠 ALTO (MTTR lento)
- **📖 CONVENTIONS.md ref:** §6.3 (Monitoring alerts)

---

### **CAPA 10: Performance & Escalabilidad**

**Optimización de velocidad y capacidad.**

#### 10.1 Índices en BD
- **Ya cubierto en CAPA 2.2**
- **Criterio PASO:** Columnas frecuentes (`Status`, `UserId`, `CreatedAt`) tienen índices
- **📊 Riesgo:** 🟠 ALTO (queries lentas)

#### 10.2 Caching
- **❌ Error:** Misma query sin caché ejecutada 1000 veces/minuto
- **✅ Fix:** `IMemoryCache` (single instance) o `HybridCache` (futuro para distribuido)
- **🔍 Audit:**
  ```bash
  grep -rn "IMemoryCache\|\.Set\|\.Get" api/LuxuryApp.Application/
  # ¿Datos frecuentes están en caché?
  grep -rn "CacheKey\|CacheDuration" src/
  ```
- **Criterio PASO:** Datos de lectura frecuente tienen estrategia de caché
- **📊 Riesgo:** 🟠 ALTO (CPU, latencia)
- **📖 CONVENTIONS.md ref:** §10 (Caching strategy)

#### 10.3 Invalidación de Caché
- **❌ Error:** Caché no se invalida → usuario ve datos viejos después de update
- **✅ Fix:** Invalidar caché en POST/PUT/DELETE
- **🔍 Audit:**
  ```bash
  grep -rn "Remove\|Refresh" api/LuxuryApp.Application/ | grep -i cache
  # ¿Se invalida caché después de cambios?
  ```
- **Criterio PASO:** Operaciones de escritura invalidan caché correspondiente
- **📊 Riesgo:** 🟠 ALTO (data staleness)
- **📖 CONVENTIONS.md ref:** §10 (Cache invalidation)

#### 10.4 Compresión (Gzip, Minify)
- **❌ Error:** Respuestas JSON grandes sin gzip
- **✅ Fix:** Middleware de compresión en .NET + minify en Angular
- **🔍 Audit:**
  ```bash
  grep -rn "UseResponseCompression" src/LuxuryApp.Api/
  # ¿Está habilitada?
  ls appsweb/angular/src/ | grep -c "main.*.js"
  # ¿Bundle está minificado?
  ```
- **Criterio PASO:** Gzip habilitado en backend, bundle minificado en frontend
- **📊 Riesgo:** 🟡 MEDIO (latencia)
- **📖 CONVENTIONS.md ref:** §2.5 (Performance optimization)

#### 10.5 CDN para Assets Estáticos
- **❌ Error:** Imágenes grandes servidas desde app server (no CDN)
- **✅ Fix:** CloudFront, Cloudflare, o CDN local
- **🔍 Audit:**
  ```bash
  grep -rn "\.jpg\|\.png\|\.css" appsweb/angular/index.html | grep -v "cdn"
  # ¿Assets estáticos están en CDN?
  ```
- **Criterio PASO:** Assets estáticos servidos desde CDN (si available)
- **📊 Riesgo:** 🟡 MEDIO (latencia, bandwidth)
- **📖 CONVENTIONS.md ref:** §2.5 (Performance)

---

### **CAPA 11: Integración & Terceros**

**APIs externas, webhooks, message queues.**

#### 11.1 Timeout en Llamadas Externas
- **❌ Error:** `HttpClient.GetAsync()` sin timeout → hang infinito
- **✅ Fix:** `HttpClient.Timeout = TimeSpan.FromSeconds(30)`
- **🔍 Audit:**
  ```bash
  grep -rn "new HttpClient\|GetAsync" api/LuxuryApp.Application/ | grep -v "Timeout"
  # ¿Hay timeout configurado?
  ```
- **Criterio PASO:** Llamadas a terceros tienen timeout (30s por defecto)
- **📊 Riesgo:** 🟠 ALTO (cascading failures)
- **📖 CONVENTIONS.md ref:** §11 (External integrations)

#### 11.2 Retry Policy
- **❌ Error:** Llamada a tercero falla → sin reintentos → error de usuario
- **✅ Fix:** Exponential backoff (Polly library)
- **🔍 Audit:**
  ```bash
  grep -rn "Polly\|Retry" api/LuxuryApp.Application/
  # ¿Hay retry policy configurado?
  ```
- **Criterio PASO:** Integraciones críticas tienen retry policy (exponential backoff)
- **📊 Riesgo:** 🟠 ALTO (flakyness)
- **📖 CONVENTIONS.md ref:** §11.2 (Retry strategies)

#### 11.3 Circuit Breaker
- **❌ Error:** Tercero está down, llamadas continúan fallando → cascada de errores
- **✅ Fix:** Circuit breaker (abre después de N fallos)
- **🔍 Audit:**
  ```bash
  grep -rn "CircuitBreaker" api/LuxuryApp.Application/
  ```
- **Criterio PASO:** Integraciones de misión crítica tienen circuit breaker
- **📊 Riesgo:** 🟠 ALTO (cascading failures)
- **📖 CONVENTIONS.md ref:** §11.3 (Circuit breaker pattern)

#### 11.4 Validación de Webhooks
- **❌ Error:** Webhook sin validar firma → puede ser spoofed
- **✅ Fix:** Verificar HMAC-SHA256 de payload
- **🔍 Audit:**
  ```bash
  grep -rn "VerifySignature\|HMAC" src/LuxuryApp.Api/ | grep -i webhook
  # ¿Se valida firma?
  ```
- **Criterio PASO:** Webhooks de terceros validan firma (HMAC, JWT)
- **📊 Riesgo:** 🔴 CRÍTICO (spoofing, unauthorized changes)
- **📖 CONVENTIONS.md ref:** §11.4 (Webhook security)

#### 11.5 Idempotencia en Webhooks
- **❌ Error:** Webhook duplicado procesado dos veces → pago duplicado
- **✅ Fix:** Guardar webhook ID, no procesar duplicados
- **🔍 Audit:**
  ```bash
  grep -rn "WebhookId\|IdempotencyKey" api/LuxuryApp.Application/ | grep -i webhook
  ```
- **Criterio PASO:** Webhooks son idempotentes (deduplicados por ID)
- **📊 Riesgo:** 🔴 CRÍTICO (transacciones duplicadas)
- **📖 CONVENTIONS.md ref:** §11.5 (Webhook idempotency)

---

### **CAPA 12: Datos & Backup**

**Estrategia de recuperación y protección.**

#### 12.1 Backup Frequency y Retention
- **❌ Error:** Sin backups, o backups de hace 3 meses
- **✅ Fix:** Daily backups, retention 30 días (según regulación)
- **🔍 Audit:**
  ```bash
  find docs/ops/ -name "*backup*" -o -name "*disaster-recovery*"
  # ¿Hay plan documentado?
  ```
- **Criterio PASO:** Backups automáticos diarios + documentado
- **📊 Riesgo:** 🔴 CRÍTICO (pérdida de datos)
- **📖 CONVENTIONS.md ref:** §12 (Backup & DR)

#### 12.2 Recovery Time Objective (RTO)
- **❌ Error:** Sin SLA de recuperación
- **✅ Fix:** RTO ≤ 4 horas para crítico, ≤ 24h para normal
- **🔍 Audit:**
  ```bash
  grep -rn "RTO\|Recovery Time" docs/
  # ¿Está documentado?
  ```
- **Criterio PASO:** RTO definido y validado periódicamente
- **📊 Riesgo:** 🔴 CRÍTICO (downtime prolongado)
- **📖 CONVENTIONS.md ref:** §12.2 (RTO/RPO)

#### 12.3 Encriptación de Backups
- **❌ Error:** Backup sin encriptación → si se filtra, datos comprometidos
- **✅ Fix:** Encriptación AES-256 en reposo
- **🔍 Audit:**
  ```bash
  # Revisar configuración de storage de backups
  # ¿Está encriptado?
  ```
- **Criterio PASO:** Backups encriptados (AES-256 o similar)
- **📊 Riesgo:** 🔴 CRÍTICO (data breach)
- **📖 CONVENTIONS.md ref:** §12.3 (Backup encryption)

#### 12.4 Data Classification
- **❌ Error:** Todos los datos tratados igual (sin diferenciación PII/public)
- **✅ Fix:** Clasificación (Public, Internal, Confidential, Restricted)
- **🔍 Audit:**
  ```bash
  find docs/ -name "*data-classification*"
  # ¿Está catalogado?
  ```
- **Criterio PASO:** Datos clasificados según sensibilidad
- **📊 Riesgo:** 🟠 ALTO (control inadecuado)
- **📖 CONVENTIONS.md ref:** §12.4 (Data classification)

#### 12.5 Migration Testing
- **❌ Error:** Migración a nueva BD sin test previo
- **✅ Fix:** Migración simulada con datos anónimizados antes de producción
- **🔍 Audit:**
  ```bash
  find docs/plans/ -name "*migration*" | xargs grep -l "test\|validate"
  # ¿Hay plan de migración con test?
  ```
- **Criterio PASO:** Cambios de schema validados en staging antes de prod
- **📊 Riesgo:** 🔴 CRÍTICO (corrupcción de datos)
- **📖 CONVENTIONS.md ref:** §12.5 (Migration strategy)

---

### **CAPA 13: Documentación & Mantenibilidad**

**Facilidad de entender, operar y mantener.**

#### 13.1 README del Módulo
- **❌ Error:** Módulo sin README o desactualizado
- **✅ Fix:** README con Setup, API docs, examples
- **🔍 Audit:**
  ```bash
  find api/LuxuryApp.Application/Modules/[MOD]/ -name "README.md"
  # ¿Existe? ¿Está actualizado?
  ```
- **Criterio PASO:** README.md en cada módulo con setup + API overview
- **📊 Riesgo:** 🟡 MEDIO (onboarding lento)
- **📖 CONVENTIONS.md ref:** §13 (Documentation)

#### 13.2 Swagger/OpenAPI
- **❌ Error:** Endpoints sin descripción en Swagger
- **✅ Fix:** `[ProduceResponseType(...)]` + `.Produces()` + `.WithName()`
- **🔍 Audit:**
  ```bash
  curl http://localhost:5000/swagger/index.html | grep "[MOD]"
  # ¿Todos los endpoints del módulo están documentados?
  ```
- **Criterio PASO:** 100% de endpoints tienen Swagger description
- **📊 Riesgo:** 🟡 MEDIO (API innavegable)
- **📖 CONVENTIONS.md ref:** §13.2 (API documentation)

#### 13.3 Architecture Decision Records (ADRs)
- **❌ Error:** Decisión importante (cambiar ORM, adoptar queue) sin documentación
- **✅ Fix:** ADR en formato: Contexto, Decisión, Consecuencias
- **🔍 Audit:**
  ```bash
  find docs/adr/ -name "*.md" | grep -i "[MOD]"
  # ¿Hay ADRs para decisiones importantes?
  ```
- **Criterio PASO:** Decisiones arquitectónicas documentadas como ADRs
- **📊 Riesgo:** 🟡 MEDIO (pérdida de contexto)
- **📖 CONVENTIONS.md ref:** §13.3 (Architecture decisions)

#### 13.4 Runbook (Cómo Operar)
- **❌ Error:** Incidente en producción, nadie sabe cómo resolver
- **✅ Fix:** Runbook: troubleshooting, escalation, rollback
- **🔍 Audit:**
  ```bash
  find docs/ops/ -name "*[MOD]*" -o -name "*troubleshooting*"
  # ¿Hay runbook?
  ```
- **Criterio PASO:** Runbook documentado para módulos críticos
- **📊 Riesgo:** 🟠 ALTO (MTTR lento)
- **📖 CONVENTIONS.md ref:** §13.4 (Operational runbooks)

#### 13.5 Changelog
- **❌ Error:** Breaking changes sin documentación, clientes no se enteran
- **✅ Fix:** changelog.md con breaking changes, deprecation notices
- **🔍 Audit:**
  ```bash
  find api/LuxuryApp.Application/Modules/[MOD]/ -name "changelog.md"
  # ¿Está documentado qué cambió?
  ```
- **Criterio PASO:** Changelog mantenido para módulos públicos
- **📊 Riesgo:** 🟡 MEDIO (breaking changes sin aviso)
- **📖 CONVENTIONS.md ref:** §13.5 (Versioning and changelog)

---

### **CAPA 14: Versionamiento & Compatibilidad**

**Evolución sin romper clientes.**

#### 14.1 API Versioning
- **❌ Error:** GET /api/users → cambio, todos los clientes se quiebran
- **✅ Fix:** GET /api/v1/users, GET /api/v2/users (migración gradual)
- **🔍 Audit:**
  ```bash
  grep -rn "MapGet.*api/" src/LuxuryApp.Api/ | wc -l
  grep -rn "MapGet.*api/v" src/LuxuryApp.Api/ | wc -l
  # ¿Hay versiones explícitas?
  ```
- **Criterio PASO:** APIs críticas tienen versión (opcional si proyecto pequeño)
- **📊 Riesgo:** 🟠 ALTO (breaking changes)
- **📖 CONVENTIONS.md ref:** §14 (API versioning)

#### 14.2 Deprecation Notices
- **❌ Error:** Endpoint deprecated sin avisar 6 meses
- **✅ Fix:** `[Obsolete]` + header `Deprecation`, comunicar fecha de shutdown
- **🔍 Audit:**
  ```bash
  grep -rn "\[Obsolete" src/LuxuryApp.Api/
  # ¿Hay endpoints deprecated con fecha?
  ```
- **Criterio PASO:** Deprecations comunicados 6-12 meses antes de remover
- **📊 Riesgo:** 🟠 ALTO (clientes sin tiempo)
- **📖 CONVENTIONS.md ref:** §14.2 (Deprecation strategy)

#### 14.3 Gradual Rollout (Canary / Feature Flags)
- **❌ Error:** Cambio grande lanzado 100% → descubrimos bugs en producción
- **✅ Fix:** Feature flags, gradual rollout (10%, 50%, 100%)
- **🔍 Audit:**
  ```bash
  grep -rn "FeatureFlag\|IsEnabled" src/LuxuryApp.Api/
  # ¿Hay feature flags para cambios grandes?
  ```
- **Criterio PASO:** Cambios significativos usan feature flags
- **📊 Riesgo:** 🟠 ALTO (impacto en prod)
- **📖 CONVENTIONS.md ref:** §14.3 (Feature flags)

#### 14.4 Rollback Strategy
- **❌ Error:** Deployment falla, no hay script de rollback
- **✅ Fix:** Script de rollback automatizado + test de rollback
- **🔍 Audit:**
  ```bash
  find src/LuxuryApp.Infrastructure/Migrations/ -name "*Rollback*"
  # ¿Hay rollback migrations?
  ```
- **Criterio PASO:** Migrations reversibles, rollback script documentado
- **📊 Riesgo:** 🔴 CRÍTICO (downtime prolongado)
- **📖 CONVENTIONS.md ref:** §14.4 (Rollback strategy)

---

### **CAPA 15: Multitenancy & Isolation**

**Aislamiento de datos entre inquilinos.**

#### 15.1 Data Isolation (Row-Level)
- **❌ Error:** Usuario de Tenant A ve datos de Tenant B
- **✅ Fix:** Validar `TenantId` en cada query
- **🔍 Audit:**
  ```bash
  grep -rn "\.Where" api/LuxuryApp.Application/Modules/[MOD]/ | grep -v "TenantId\|UserId"
  # ¿Todas las queries filtran por TenantId?
  ```
- **Criterio PASO:** Cero queries sin filtro de TenantId/UserId
- **📊 Riesgo:** 🔴 CRÍTICO (data leakage)
- **📖 CONVENTIONS.md ref:** §15.1 (Multitenancy)

#### 15.2 Rate Limiting por Tenant
- **❌ Error:** Tenant A puede hacer 10k requests/min → DoS effect
- **✅ Fix:** Rate limiting por tenant (token bucket, sliding window)
- **🔍 Audit:**
  ```bash
  grep -rn "RateLimit\|Throttle" src/LuxuryApp.Api/
  # ¿Hay rate limiting?
  ```
- **Criterio PASO:** Rate limiting configurado por tenant
- **📊 Riesgo:** 🟠 ALTO (DoS)
- **📖 CONVENTIONS.md ref:** §15.2 (Rate limiting)

#### 15.3 Resource Quotas
- **❌ Error:** Tenant A usa 10TB storage → costo explosivo
- **✅ Fix:** Quota por tenant (storage, API calls, processing)
- **🔍 Audit:**
  ```bash
  grep -rn "Quota\|Limit" api/LuxuryApp.Application/
  # ¿Hay control de quotas?
  ```
- **Criterio PASO:** Quotas configurables por tenant
- **📊 Riesgo:** 🟠 ALTO (cost explosion)
- **📖 CONVENTIONS.md ref:** §15.3 (Resource quotas)

---

### **CAPA 16: DevOps & Deployment**

**Automatización y confiabilidad de deployment.**

#### 16.1 CI/CD Pipeline
- **❌ Error:** Cambios mergeados sin pasar tests automáticos
- **✅ Fix:** GitHub Actions / Azure Pipelines: build → test → deploy
- **🔍 Audit:**
  ```bash
  find .github/workflows/ -name "*.yml"
  # ¿Hay pipeline de CI/CD?
  ```
- **Criterio PASO:** CI/CD pipeline automatizado (build, test, deploy)
- **📊 Riesgo:** 🟠 ALTO (regresiones en main)
- **📖 CONVENTIONS.md ref:** §16 (Deployment)

#### 16.2 Blue-Green Deployment
- **❌ Error:** Deploy con downtime (cambios de DB, rolling update)
- **✅ Fix:** Blue-green (dos ambientes, switch instantáneo)
- **🔍 Audit:**
  ```bash
  find docs/ops/ -name "*deployment*"
  # ¿Hay documentación de estrategia?
  ```
- **Criterio PASO:** Zero-downtime deployment implementado
- **📊 Riesgo:** 🟠 ALTO (downtime)
- **📖 CONVENTIONS.md ref:** §16.2 (Deployment strategies)

#### 16.3 Feature Flags (Kill Switch)
- **❌ Error:** Feature defectuosa lanzada, sin forma de desactivarla rápido
- **✅ Fix:** Feature flags (LaunchDarkly, custom)
- **🔍 Audit:**
  ```bash
  grep -rn "FeatureFlag" src/ | wc -l
  # ¿Se usan feature flags para features nuevas?
  ```
- **Criterio PASO:** Features críticas pueden desactivarse sin redeploy
- **📊 Riesgo:** 🟠 ALTO (rollback slow)
- **📖 CONVENTIONS.md ref:** §16.3 (Feature flags)

#### 16.4 Secrets Management
- **❌ Error:** API key en .env commiteado a git
- **✅ Fix:** Azure Key Vault / AWS Secrets Manager / Vault local
- **🔍 Audit:**
  ```bash
  git log --all -p | grep -i "api.key\|password\|secret" | head -20
  # ¿Hay secretos en git?
  ```
- **Criterio PASO:** Cero secrets en código; usar vault
- **📊 Riesgo:** 🔴 CRÍTICO (credential exposure)
- **📖 CONVENTIONS.md ref:** §6.8 (Secrets management)

#### 16.5 Infrastructure as Code
- **❌ Error:** Server configurado manualmente, no replicable
- **✅ Fix:** Terraform / ARM templates / CloudFormation
- **🔍 Audit:**
  ```bash
  find infrastructure/ -name "*.tf" -o -name "*.json"
  # ¿Infrastructure versionada?
  ```
- **Criterio PASO:** Infraestructura definida como código
- **📊 Riesgo:** 🟠 ALTO (disaster recovery slow)
- **📖 CONVENTIONS.md ref:** §16.5 (Infrastructure automation)

---

### **CAPA 17: Validaciones Cross-layer**

**Sincronización Cliente ↔ API ↔ Servidor.**

#### 17.1 Cliente + Servidor Sincronizadas
- **❌ Error:** Frontend permite fecha-fin < inicio, backend también lo permite (sin validación server)
- **✅ Fix:** Validar en AMBOS lados; servidor no confía en cliente
- **🔍 Audit:**
  ```bash
  grep -rn "addValidators\|RuleFor" appsweb/angular/ api/LuxuryApp.Application/
  # ¿Las validaciones están duplicadas en ambos?
  ```
- **Criterio PASO:** Validaciones críticas en servidor (cliente es solo UX)
- **📊 Riesgo:** 🟠 ALTO (bypass de validación)
- **📖 CONVENTIONS.md ref:** §17 (Cross-layer validation)

#### 17.2 Mensajes de Error Consistentes
- **❌ Error:** Backend dice "Email inválido", frontend muestra "Error"
- **✅ Fix:** Mensajes standarizados (backend → frontend via código de error)
- **🔍 Audit:**
  ```bash
  grep -rn "ProblemDetails\|ErrorCode" src/LuxuryApp.Api/
  # ¿Hay esquema de error unificado?
  ```
- **Criterio PASO:** Errores estructurados con código y mensaje consistente
- **📊 Riesgo:** 🟡 MEDIO (UX confusa)
- **📖 CONVENTIONS.md ref:** §9.6 (Error handling)

---

### **CAPA 18: Accesibilidad (WCAG 2.1 AA)**

**Inclusión de usuarios con discapacidades.**

#### 18.1 Keyboard Navigation
- **❌ Error:** Usuario no puede navegar con Tab; teclado atrapado en modal
- **✅ Fix:** Tab order, Escape para cerrar, focus management
- **🔍 Audit:**
  ```bash
  grep -rn "tabindex\|focus\|onKeydown" appsweb/angular/src/app/modules/[MOD]/
  # ¿Hay manejo de keyboard?
  ```
- **Criterio PASO:** Todas las acciones accesibles por keyboard
- **📊 Riesgo:** 🟡 MEDIO (usuarios excluidos)
- **📖 CONVENTIONS.md ref:** §18 (Accessibility WCAG AA)

#### 18.2 Screen Reader Support (ARIA)
- **❌ Error:** `<button>🔍</button>` (solo ícono, sin label)
- **✅ Fix:** `<button aria-label="Search">🔍</button>`
- **🔍 Audit:**
  ```bash
  grep -rn "<button\|<input" appsweb/angular/src/app/modules/[MOD]/ | grep -v "aria-label\|placeholder"
  # ¿Todos los inputs/buttons tienen labels?
  ```
- **Criterio PASO:** ARIA labels en botones e inputs
- **📊 Riesgo:** 🟡 MEDIO (usuarios ciegos excluidos)
- **📖 CONVENTIONS.md ref:** §18.2 (ARIA labels)

#### 18.3 Color Contrast
- **❌ Error:** Gris claro sobre blanco (ratio < 4.5:1)
- **✅ Fix:** Contrastar colores (WCAG AA ≥ 4.5:1)
- **🔍 Audit:**
  ```bash
  # Usar herramienta: WebAIM Contrast Checker
  # Verificar todos los colores de texto
  ```
- **Criterio PASO:** Color contrast ≥ 4.5:1 (normal text)
- **📊 Riesgo:** 🟡 MEDIO (usuarios con baja visión excluidos)
- **📖 CONVENTIONS.md ref:** §18.3 (Color contrast)

#### 18.4 Motion y Reduced Motion
- **❌ Error:** Animación sin poder desactivarla; usuario con vestibular disorder
- **✅ Fix:** Respetar `prefers-reduced-motion`
- **🔍 Audit:**
  ```bash
  grep -rn "animation:\|@keyframes" appsweb/angular/src/app/modules/[MOD]/ | grep -v "reduced-motion"
  # Animaciones deben respetar preferencia
  ```
- **Criterio PASO:** Animaciones respetan `prefers-reduced-motion`
- **📊 Riesgo:** 🟡 MEDIO (usuarios con desórdenes de movimiento excluidos)
- **📖 CONVENTIONS.md ref:** §18.4 (Motion preferences)

---

### **CAPA 19: Convenciones de Código & Naming**

**Alineación con reglas del proyecto.**

#### 19.1 CONVENTIONS.md (§1-22)
- **❌ Error:** DTOs como `class` en lugar de `record`
- **✅ Fix:** Seguir CONVENTIONS.md §9 (DTOs — Records Obligatorios)
- **🔍 Audit:**
  ```bash
  grep -rn "public class.*Dto" api/LuxuryApp.Application/
  # Resultado esperado: 0 (cambiar por record)
  ```
- **Criterio PASO:** 100% de código cumple CONVENTIONS.md §1-22
- **📊 Riesgo:** 🟡 MEDIO (deuda técnica)
- **📖 CONVENTIONS.md ref:** Todo el archivo (single source of truth)

#### 19.2 DESIGN_CONVENTIONS.md (91 componentes)
- **❌ Error:** Usar `<p-button>` en lugar de `<app-action-button>`
- **✅ Fix:** Catálogo custom de 91 componentes
- **🔍 Audit:**
  ```bash
  grep -rn "<p-button\|<p-input\|<ion-" appsweb/angular/src/app/modules/[MOD]/ | wc -l
  # Resultado esperado: 0 (usar <app-* o <ili-*)
  ```
- **📊 Riesgo:** 🟡 MEDIO (inconsistencia visual)
- **📖 CONVENTIONS.md ref:** §3 (UX/UI), DESIGN_CONVENTIONS.md

#### 19.3 AVAILABLE_FEATURES.md
- **❌ Error:** Usar `AutoMapper` (prohibido, AOT incompatible)
- **✅ Fix:** Usar `.Select()` proyecciones manuales
- **🔍 Audit:**
  ```bash
  grep -rn "using AutoMapper\|IMapper" src/
  # Resultado esperado: 0
  ```
- **Criterio PASO:** Cero features prohibidas
- **📖 CONVENTIONS.md ref:** AVAILABLE_FEATURES.md

#### 19.4 Naming Consistency
- **❌ Error:** Folder `UserAccounts`, clase `UserAccountModel`, table `UserAccount`
- **✅ Fix:** Singular/plural consistente (table plural: `UserAccounts`)
- **🔍 Audit:**
  ```bash
  find src/ -type d -name "*Modules*" | xargs ls -la | grep -E "[A-Z]{2,}|_"
  # Folder/class names deben ser PascalCase, sin underscores
  ```
- **Criterio PASO:** Naming consistente (PascalCase folders/classes, kebab-case routes)
- **📊 Riesgo:** 🟡 MEDIO (confusión)
- **📖 CONVENTIONS.md ref:** §2, §3

---

### **CAPA 20: Reglas de Negocio Auditables**

**Cada RN (Regla de Negocio) traceable a código.**

#### 20.1 Matriz de RN en FASE 0
- **❌ Error:** Plan define "El sistema debe prevenir doble booking" pero código no lo valida
- **✅ Fix:** Cada RN en matriz → código que la implementa → auditoría que la verifica
- **🔍 Audit:**
  ```bash
  find docs/plans/ -name "*.md" -exec grep -l "RN-MOD" {} \;
  # ¿Hay matriz de RN? ¿Se hace reference en PRs?
  ```
- **Criterio PASO:** Cada RN tiene implementación verificable + test
- **📊 Riesgo:** 🟠 ALTO (requerimientos no implementados)
- **📖 CONVENTIONS.md ref:** §20 (Creación de Planes), PLAN_AGENT_INSTRUCTIONS.md (FASE 0)

#### 20.2 Trazabilidad RN ↔ Código ↔ Auditoría
- **❌ Error:** RN documentada, pero no hay test que la verifique
- **✅ Fix:** RN → PR → Test → Auditoría (ciclo completo)
- **🔍 Audit:**
  ```bash
  # Para cada RN-MOD-XXX:
  git log --grep="RN-MOD-XXX" --oneline  # ¿Hay commit?
  find src/LuxuryApp.Tests/ -name "*RN-MOD-XXX*"  # ¿Hay test?
  ```
- **Criterio PASO:** 100% de RNs tienen: documentación + test + commit
- **📊 Riesgo:** 🟠 ALTO (requerimientos perdidos)
- **📖 CONVENTIONS.md ref:** §19 (Auditoría), §20 (Planeación)

---

## 📋 RESUMEN: Checklist Compacto por Módulo

### Antes de Iniciar Plan (FASE 0)

- [ ] ¿Módulo definido con Reglas de Negocio (RN)?
- [ ] ¿Matriz de RN en 4 niveles (Invariantes, Flujo, Seguridad, Validación)?
- [ ] ¿Riesgos identificados (Pre-Mortem)?
- [ ] ¿Stack de tecnologías vs AVAILABLE_FEATURES.md?

### Después de Implementación (Re-Auditoría)

- [ ] CAPA 1: Lógica de negocio (race conditions, idempotencia, errores)
- [ ] CAPA 2: BD (N+1, índices, soft delete, constraints)
- [ ] CAPA 3: API (códigos HTTP, DTOs, paginación)
- [ ] CAPA 4: Frontend (memory leaks, OnPush, catálogo)
- [ ] CAPA 5: Móvil (offline, teclado, batería)
- [ ] CAPA 6: Seguridad (IDOR, autorización, datos sensibles)
- [ ] CAPA 7: Cumplimiento (GDPR, consentimiento, DPA)
- [ ] CAPA 8: Testing (cobertura, tipos, edge cases)
- [ ] CAPA 9: Logging (estructurado, niveles, alertas)
- [ ] CAPA 10: Performance (índices, caché, compresión)
- [ ] CAPA 11: Integración (timeout, retry, circuit breaker)
- [ ] CAPA 12: Backup (frecuencia, RTO, encriptación)
- [ ] CAPA 13: Documentación (README, Swagger, ADR, runbook)
- [ ] CAPA 14: Versionamiento (API v1/v2, deprecation)
- [ ] CAPA 15: Multitenancy (data isolation, rate limit, quota)
- [ ] CAPA 16: DevOps (CI/CD, blue-green, feature flags)
- [ ] CAPA 17: Validaciones cross-layer (cliente+servidor)
- [ ] CAPA 18: Accesibilidad (keyboard, aria, contraste)
- [ ] CAPA 19: Convenciones (CONVENTIONS.md, DESIGN_CONVENTIONS.md)
- [ ] CAPA 20: RN auditables (trazabilidad plan→código→test)

---

## 🎯 Uso de Este Documento

### Para Agentes IA (Auditoría)

```
"Audita [MOD] contra audit-layers-checklist.md
Ref: ./audit-layers-checklist.md
Foco: CAPAS 1-20 (no solo lógica de negocio)
Output: Matriz de riesgos 🔴🟠🟡 con línea/archivo"
```

### Para Tech Lead (Plan de Remediación)

```
Usar matriz de riesgos para priorizar:
- 🔴 CRÍTICO: Fix inmediato (hotfix)
- 🟠 ALTO: Sprint siguiente
- 🟡 MEDIO: Quarter siguiente
- 🟢 BAJO: Boy Scout (cuando tocas el archivo)
```

---

**Vigencia:** 2026-07-29 — ∞  
**Responsable:** Tech Lead  
**Próxima revisión:** Con cada módulo auditado
