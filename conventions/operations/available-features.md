# ✅ Available Features — .NET 10 + Angular 22

**Última revisión:** 2026-09-24 (AutoMapper pasa de NOT AVAILABLE a CONDITIONAL: solo en memoria; `ProjectTo` sigue prohibido). Anterior 2026-08-06 (consolidado de AVAILABLE_FEATURES.md viejo)  
**Versión:** 1.0  
**Propósito:** Single source of truth para "qué tecnologías/librerías están disponibles" antes de implementar

> **Regla de Oro:** Antes de usar una librería o feature, busca aquí. Si NO está en AVAILABLE o está en NOT AVAILABLE, consulta con Tech Lead.

---

## 🎯 Por Qué Existe Este Documento

**Problema anterior:** Desarrolladores asumían que características como `MediatR`, `HybridCache` o el uso irrestricto de `AutoMapper` (incluido `ProjectTo`) estaban disponibles. Resultado: errores de compilación, code reviews rechazados, merges fallidos.

**Solución:** Registry centralizado con detalles completos (versión, namespace, ejemplos).

---

## 🔧 Backend (.NET 10 + C# 13/14)

### ✅ AVAILABLE — Usar sin restricción

| Feature | Versión | Namespace | Notas | Ejemplo |
|:---|:---|:---|:---|:---|
| **Minimal APIs** | .NET 10 nativo | `Microsoft.AspNetCore...` | Obligatorio, reemplaza MVC | `app.MapGet("/users", ...)` |
| **ILogger\<T\>** | .NET 10 nativo | `Microsoft.Extensions.Logging` | Inyectable, no estático | `public MyClass(ILogger<MyClass> logger)` |
| **DataAnnotations** | .NET 10 nativo | `System.ComponentModel.DataAnnotations` | Validación básica | `[Required] public string Name` |
| **EF Core 10** | 10.0+ | `Microsoft.EntityFrameworkCore` | OBLIGATORIO para BD | `DbSet<User> Users` |
| **FluentValidation** | 11.x | `FluentValidation` | Validación avanzada | `RuleFor(x => x.Name).NotEmpty()` |
| **Primary Constructors** | C# 12+ (introducidos en C# 12; obligatorio en Services/AppServices, ver `backend/backend-rules.md` (constructores primarios) y `CONVENTIONS.md` §6.1 (tabla)) | Lenguaje | Simplifica inyección | `public class CandidateAppService(ILogger<CandidateAppService> log) : ICandidateAppService` |
| **ApiResponseDTO\<T\>** (verificado 2026-09-09; no existe `Response<T>`) | Custom | `Shared.DTOs` | Envelope de respuesta | `new ApiResponseDTO<User>(data)` |
| **BusinessException** | Custom | `Shared.Extensions` (no `.Exceptions` — verificado) | Excepciones de negocio | `throw new BusinessException("...")` |
| **IEndPointsModule** (plural — verificado; no existe `IEndPointModule`) | Custom | `Infrastructure.EndPoints` (no `LuxuryApp.Api.Features`) | Auto-discovery de endpoints | Implementar en cada módulo de endpoints |
| **PaginationCommonDTO** | Custom | `Shared.DTOs` | Contrato de paginación | Ver docs/PAGINACION.md |
| **IHttpClientFactory** | .NET 10 nativo | `System.Net.Http` | Gestor de conexiones | `factory.CreateClient()` |
| **TimeProvider** | .NET 10 nativo | `System` | Hora testeable (NO DateTime.UtcNow) | `timeProvider.GetUtcNow()` |
| **Serilog (inyectable)** | 7.x | `Serilog` | Logging estructurado | `services.AddSerilog()` |
| **Nullable Reference Types** | ⚠️ **DESHABILITADO** (`<Nullable>disable</Nullable>` verificado en `LuxuryApp.Application.csproj`, 2026-09-09) — NUNCA agregar `?` en propiedades de DTOs/Entities, ver `backend/backend-rules.md` (regla crítica sin `?`) y `CONVENTIONS.md` §6.1 (tabla) | Lenguaje | — | — |

### ❌ NOT AVAILABLE — Prohibido usar

| Feature | Razón | Alternativa |
|:---|:---|:---|
| **AutoMapper `ProjectTo<>` / proyección sobre `IQueryable`** | SQL implícito y `Profile` sin validación en build (ver `backend/backend-rules.md`, regla crítica AutoMapper) | Usar `.Select(x => new XDTO { ... })` manual en consultas |
| **MediatR** | No en stack oficial | Usar Minimal API handlers directos |
| **Dapper** | No en stack oficial | Usar EF Core QueryObject pattern |
| **Reflection dinámica** | Incompatible AOT | Usar type-safe patterns (no `GetType()` dinámico) |
| **Serilog.Log (estático)** | Anti-pattern | Inyectar `ILogger<T>` siempre |
| **Configuration (viejo)** | Deprecated | Usar `IConfiguration` inyectable |
| **DateTime.UtcNow** | No testeable | Usar `TimeProvider` inyectable |

### 🟡 CONDITIONAL — Usar solo en casos específicos

| Feature | Condición | Ubicación |
|:---|:---|:---|
| **Swashbuckle.AspNetCore** | Development only | `appsettings.Development.json` |
| **IMemoryCache** | Single-instance apps | Para distribuido: roadmap HybridCache v2 |
| **AutoMapper 16.2** (`IMapper`, `Profile`) | Solo mapeo **en memoria** (entidad ya cargada ↔ DTO). Nunca `ProjectTo<>` sobre `IQueryable` | `LuxuryApp.Application` (registro en `AutoMapperServiceExtensions`) |

---

## 🎨 Frontend (Angular 22 + TypeScript 5.x)

### ✅ AVAILABLE — Usar sin restricción

| Feature | Versión | Package | Notas | Ejemplo |
|:---|:---|:---|:---|:---|
| **Signals** | Angular 22 | `@angular/core` | Estado reactivo sin Subject | `count = signal(0)` |
| **Computed** | Angular 22 | `@angular/core` | Derivadas de signals | `doubleCount = computed(...)` |
| **Effect** | Angular 22 | `@angular/core` | Side effects reactivos | `effect(() => console.log(count()))` |
| **Standalone** | Angular 22 | Decorador | Componentes sin módulos | `@Component({standalone: true})` |
| **OnPush** | Angular 22 | Change Detection | Default en CONVENTIONS.md | `changeDetection: ChangeDetectionStrategy.OnPush` |
| **@if / @for / @switch** | Angular 22 | Templates | Nueva control flow | `@if (condition) { ... }` |
| **Reactive Forms** | Angular 22 | `@angular/forms` | OBLIGATORIO, no template forms | `this.form = new FormGroup(...)` |
| **PrimeNG 22** | 22.x | `primeng` | Desktop UI | `<p-button>` |
| **Ionic 8** | 8.x | `@ionic/angular` | Mobile UI | `<ion-button>` |
| **PaginationStore** | Custom | `appsweb/angular/src/app/shared/store` | State de paginación | `paginationStore.pageNumber.set(2)` |
| **ApiResponseService** | Custom | `appsweb/angular/src/app/shared/services` | HTTP + envelope handling | `this.api.get<User>('/users')` |
| **DialogHandlerService** | Custom | `appsweb/angular/src/app/core/services` | Manejo de diálogos | `this.dialogHandler.openDialog(Component)` |
| **componentes shared/ui** | Custom | `appsweb/angular/src/app/shared/ui` | Catálogo UI oficial | Importar desde `@ui/*` |

### ❌ NOT AVAILABLE — Prohibido usar

| Feature | Razón | Alternativa |
|:---|:---|:---|
| **Template Forms** | Anti-pattern | Usar Reactive Forms siempre |
| **ngModel** | Two-way binding anti-pattern | Usar FormControl + value signals |
| **BehaviorSubject** | Replaced by signals | Usar `signal()` |
| **@Input / @Output** | Old paradigm | Usar signals + computed |
| **RxJS subscriptions** | Memory leaks | Usar signals o `async` pipe |
| **ChangeDetectorRef** | Incompatible OnPush | Usar signals (actualizan automáticamente) |
| **CommonModule** | Deprecated en standalone | Importar directamente lo que necesites |
| **NgModule** | Paradigma viejo | Usar standalone |
| **Imports directos de librerías visuales** | Duplicación de UI | Cuando `@ui/*` ya cubre el caso |

### 🟡 CONDITIONAL — Usar en contextos específicos

| Feature | Condición |
|:---|:---|
| **@defer** | Lazy loading de componentes grandes |
| **Lazy routes** | Dividir app en chunks (>100KB) |
| **Zone.js optimization** | Para máximo rendimiento (avanzado) |

---

## 📊 Quick Reference Cards

### Backend: Obligatorio / Prohibido / OK

```
✅ OBLIGATORIO:
   • Minimal APIs (NO MVC)
   • EF Core 10
   • ILogger<T> inyectable
   • Response<T> envelope
   • Nullable Reference Types
   • TimeProvider (NO DateTime.UtcNow)

❌ PROHIBIDO:
   • AutoMapper ProjectTo / proyección sobre IQueryable (usar .Select();
     IMapper.Map en memoria SÍ se permite)
   • Serilog.Log estático (excepto Program.cs)
   • MediatR (no en stack)
   • Reflection dinámica
   • Dapper (usar EF Core)

🟡 CONDICIONAL:
   • Swashbuckle (Development only)
   • IMemoryCache (si no es distribuido)
```

### Frontend: Obligatorio / Prohibido / OK

```
✅ OBLIGATORIO:
   • Signals (NO BehaviorSubject)
   • Standalone (NO módulos)
   • OnPush (cambio por defecto)
   • Reactive Forms (NO template forms)
   • @if/@for/@switch (NO *ngIf/*ngFor)
   • Componentes desde @ui/*

❌ PROHIBIDO:
   • CommonModule (standalone no lo necesita)
   • ngModel (use FormControl)
   • @Input/@Output (use signals)
   • RxJS subscriptions (use signals)
   • Template Forms
   • BehaviorSubject (use signals)

🟡 CONDICIONAL:
   • @defer (lazy load grandes componentes)
   • Lazy routes (si >100KB)
```

---

## 🎓 Cómo Usar Este Documento

### Antes de agregar una dependencia o feature:

```
1. ¿Está en la tabla AVAILABLE? → ✅ Usa sin restricción
2. ¿Está en NOT AVAILABLE? → ❌ Consulta Tech Lead, busca alternativa en tabla
3. ¿No está listada? → 🔴 Pregunta ANTES de empezar (no asumas)
```

### Consultar antes de PR:

**Backend:**
```bash
grep -rn "\.ProjectTo<" src/ --include="*.cs"        # esperado 0 (IMapper.Map en memoria es válido)
grep -r "MediatR\|Dapper\|Serilog.Log" src/
grep -r "DateTime.UtcNow" src/ | grep -v TimeProvider
```

**Frontend:**
```bash
grep -r "ngModel\|BehaviorSubject\|@Input.*@Output" src/app/
grep -r "CommonModule\|NgModule" src/app/ | grep -v "deprecated\|legacy"
grep -r "subscribe\(" src/app/ | grep -v "unsubscribe"
```

---

## 🔄 Roadmap v2.0 (Futuro)

Estos features NO están disponibles HOY, pero planeados:

| Feature | v2.0 | Razón |
|:---|:---|:---|
| **HybridCache** (vs IMemoryCache) | ✅ Sí | Para entornos distribuidos |
| **YARP** (Reverse proxy) | ✅ Sí | Needed para microservicios |
| **GraphQL** | ✅ Sí | Si es requerimiento |
| **gRPC** | ✅ Sí | Si es requerimiento |

---

## 📞 ¿Qué Hacer Si Necesitas Otra Feature?

### Proceso de 3 pasos:

**1. Abre issue o consulta Tech Lead** con:
   - ¿Qué feature necesitas?
   - ¿Por qué no funciona la alternativa actual?
   - ¿Cuál es el beneficio vs riesgo?

**2. Tech Lead evalúa:**
   - ¿Compatible con AOT?
   - ¿Mantenida activamente?
   - ¿Impacto en bundle size?
   - ¿Hay alternativa equivalente?

**3. Si es aprobada:**
   - Se agrega aquí con versión y notas
   - Se actualiza CONVENTIONS.md
   - Se comunica a todo el equipo

---

**Última actualización:** 2026-08-06  
**Consolidado de:** AVAILABLE_FEATURES.md viejo (eliminado 2026-08-06, contenido absorbido)  
**Responsable:** Tech Lead  
**Próxima revisión:** Con cada cambio a stack tecnológico


