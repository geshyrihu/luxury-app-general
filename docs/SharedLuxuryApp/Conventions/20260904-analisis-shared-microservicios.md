# RADIOGRAFÍA DE ARQUITECTURA — LuxuryApp

> Análisis generado el 2026-09-04. Basado en código fuente verificado.

---

## 1. Executive Summary

La solución LuxuryApp es un **monolito modular de alto acoplamiento** (no microservicios). Compuesta por una única solution (`LuxuryApp.sln`) con 3 proyectos referenciados directamente via `ProjectReference`, desplegados como un solo proceso. El proyecto `LuxuryApp.Application` concentra **toda** la lógica de negocio, entidades de dominio, DbContexts, servicios, providers, y hasta infraestructura como Hangfire jobs y Vault—violando el principio de separación de responsabilidades. La capa `LuxuryApp.Api` es un shell fino que solo registra DI y expone endpoints, pero contiene cero lógica de dominio.

Los datos residen en **3+ bases de datos** (SQLServer/LuxuryBuildingGroup principal, LuxuryAppVault, LuxuryAppLogs, y PostgreSQL alternativo) todas alojadas en el mismo servidor. No existe comunicación inter-servicio, no hay message brokers, no hay Docker, no hay CI/CD independiente. La única comunicación externa son llamadas HTTP síncronas a APIs de terceros (Aspel, ElevenLabs, Google, OneSignal).

**Nivel de madurez: 4/10** — Funcional pero con deuda técnica significativa.

---

## 2. Arquitectura Actual

```
┌─────────────────────────────────────────────────────────┐
│                    LuxuryApp.sln                         │
│                                                         │
│  ┌─────────────────────┐    ┌────────────────────────┐  │
│  │  LuxuryApp.Api      │───▶│  LuxuryApp.Application│  │
│  │  (Presentación)     │    │  (TODO: BD+Negocio+   │  │
│  │                     │    │   Infra+Vault+Hangfire)│  │
│  │  - Program.cs       │    │                        │  │
│  │  - Controllers      │    │  DbContexts:           │  │
│  │  - Middleware        │    │   ├─ ApplicationDbContext│ │
│  │  - ServiceExt.      │    │   ├─ VaultDbContext    │  │
│  │  - Hangfire Jobs    │    │   ├─ LuxuryAppLogsDbContext│
│  └─────────────────────┘    │   └─ MockAspelDbContext │ │
│           │                 │                        │  │
│           │                 │  Modules (15 dominios):│  │
│  ┌─────────────────────┐    │   ├─ Auth              │  │
│  │  LuxuryApp.Tests    │    │   ├─ Cobranza          │  │
│  │  (xUnit + Moq)     │    │   ├─ Contabilidad      │  │
│  └─────────────────────┘    │   ├─ Compras           │  │
│                             │   ├─ HR/RRHH           │  │
│                             │   ├─ Legal             │  │
│                             │   ├─ Mantenimiento     │  │
│                             │   ├─ Operations        │  │
│                             │   ├─ Reclutamiento     │  │
│                             │   ├─ System            │  │
│                             │   └─ ... (+6 más)      │  │
│                             └────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┼──────────────┐
            ▼             ▼              ▼
     SQL Server      PostgreSQL      Vault DB
   (LuxuryBuildingGroup) (luxuryapp)  (LuxuryAppVault)
```

---

## 3. Checklist de Microservicios — Veredicto

| Criterio | ¿Cumple? | Evidencia |
|----------|----------|-----------|
| Cada servicio tiene su propia DB | **NO** | 1 solo `ApplicationDbContext` para todo. Migraciones centralizadas en `LuxuryApp.Application/Infrastructure/Data/Migrations/` |
| Se comunican solo vía red | **NO** | `ProjectReference` directo (`LuxuryApp.Api.csproj:138`). Llamadas a métodos en memoria |
| Se despliegan independientemente | **NO** | 1 solo `Program.cs` que arranca todo. Sin Dockerfile ni docker-compose |
| Tienen equipos de desarrollo separados | **NO** | Todo en 1 repo, 1 solution, 1 contexto de BD |
| Pueden evolucionar sin coordinar | **NO** | Cambios en entidades del `ApplicationDbContext` rompen todo |
| Tienen versionamiento independiente | **NO** | 1 solo `AssemblyVersion` compartido |
| Failures están aislados | **NO** | Un OOM o deadlock en cualquier módulo cae toda la app |

**Veredicto: NO son microservicios. Es un monolito modular.**

---

## 4. Análisis de Dependencias

### 4.1 Referencias entre proyectos

```
LuxuryApp.Tests ──ProjectRef──▶ LuxuryApp.Application
LuxuryApp.Api ──ProjectRef──▶ LuxuryApp.Application
LuxuryApp.Application ──▶ (sin referencias a otros proyectos internos)
```

### 4.2 Paquetes NuGet críticos por proyecto

**LuxuryApp.Api** (`LuxuryApp.Api.csproj`):
- `EntityFrameworkCore.Design/Tools` (10.0.10) — migraciones
- `EFCore.SqlServer + Npgsql` — dual provider
- `Hangfire.SqlServer + PostgreSql` — background jobs
- `Swashbuckle + Scalar` — documentación API
- `Serilog` — logging
- `Microsoft.Extensions.Http.Polly` — resiliencia HTTP
- `Newtonsoft.Json + System.Text.Json` — **dos serializadores coexisten**

**LuxuryApp.Application** (`LuxuryApp.Application.csproj`):
- `EntityFrameworkCore + SqlServer + Npgsql` — acceso a datos
- `Microsoft.AspNetCore.Identity.EntityFrameworkCore` — **Identity en la capa Application**
- `Hangfire.Core` — jobs programados
- `Microsoft.SemanticKernel` — AI/LLM integration
- `Microsoft.Graph` — OneDrive integration
- `Twilio` — WhatsApp
- `MailKit` — email
- `MaxMind.GeoIP2` — geolocalización
- `QuestPDF + itext + PdfSharpCore` — **tres librerías de PDF**
- `ClosedXML` — Excel
- `HtmlAgilityPack` — scraping
- `Fiscalapi.XmlDownloader` — facturación
- `Ical.Net` — calendarios

**LuxuryApp.Tests** (`LuxuryApp.Tests.csproj`):
- `xUnit + Moq + FluentAssertions + Bogus` — testing
- `EFCore.InMemory` — BD en memoria

### 4.3 SDK extraño

`LuxuryApp.Application` usa `Microsoft.NET.Sdk.Razor` en vez de `Microsoft.NET.Sdk`. Esto permite Razor views/emails dentro de la capa de aplicación—otra violación de Clean Architecture.

---

## 5. Análisis de Datos

### 5.1 Connection Strings (`appsettings.json:4-9`)

| BD | Connection String | Uso |
|----|-------------------|-----|
| SQLServer (principal) | `Data Source=.;Initial Catalog=LuxuryBuildingGroup` | DbContext principal |
| PostgreSQL (alternativo) | `Host=localhost;Database=luxuryapp` | Migración dual (configurable) |
| VaultDb | `Data Source=.;Initial Catalog=LuxuryAppVault` | Secretos encriptados |
| LuxuryAppLogs | `Data Source=.;Initial Catalog=LuxuryAppLogs` | Auditoría y logs |

**Todas apuntan al mismo servidor** (`localhost` / `.`).

### 5.2 DbContexts (5 en total)

1. **`ApplicationDbContext`** — El gigante. ~200+ DbSets. (`ApplicationDbContext.cs:13`)
2. **`PostgresDbContext`** — Hereda de `ApplicationDbContext`. (`PostgresDbContext.cs:8`)
3. **`VaultDbContext`** — Secretos encriptados. (`VaultDbContext.cs:3`)
4. **`LuxuryAppLogsDbContext`** — Logging aislado (no encontrada en grep, probablemente en otro assembly o eliminada)
5. **`MockAspelDbContext`** — Datos mock para desarrollo. (`MockAspelDbContext.cs:8`)

### 5.3 Migraciones

Todas las migraciones están centralizadas en `LuxuryApp.Application/Infrastructure/Data/Migrations/`. Hay **20+ migraciones recientes** (agosto-septiembre 2026), indicando desarrollo activo sobre una BD monolítica compartida.

---

## 6. Análisis de Comunicación

### 6.1 Comunicación interna
- **Ninguna.** No hay message brokers (no MassTransit, no RabbitMQ, no Kafka).
- **No hay gRPC.**
- Todo es comunicación síncrona en memoria vía DI container.

### 6.2 Comunicación externa (HTTP Clients)

| Cliente | Destino | Uso |
|---------|---------|-----|
| `AspelCoiApi` | `http://shem.dyndns.ws/COI_API` | Contabilidad externa |
| `GoogleAI` | Google APIs | AI/Imagen |
| `ElevenLabs` | `https://api.elevenlabs.io/` | Text-to-Speech |
| `OneSignal` | OneSignal APIs | Push notifications |
| `AspelApiClient` | Aspel COI API | Presupuestos, reportes |
| `GoogleCalendar` | Google Calendar API | Sincronización calendario |

**Resiliencia**: Solo `AspelApiClient` tiene Polly (retry + circuit breaker). Los demás no.

### 6.3 Tiempo real
- **SignalR** (`/ws/notificationHub`) — notificaciones en tiempo real al frontend.

---

## 7. Análisis de Patrones Arquitectónicos

| Patron | ¿Presente? | Evidencia |
|--------|-------------|-----------|
| Clean Architecture | **Parcial** | Carpetas `Modules/` y `Infrastructure/` sugieren intento, pero el `ApplicationDbContext` centraliza TODO |
| CQRS / MediatR | **NO** | No hay MediatR ni separación Command/Query |
| Domain-Driven Design | **NO** | No hay aggregates, value objects, domain events reales. Los `IDomainEvent*` interfaces existen pero no se usan activamente |
| Repository Pattern | **Parcial** | Hay interfaces `I*AppService` pero son abstracciones de servicio, no repositorios genéricos |
| Service Layer | **SI** | Services en `Modules/*/Services/` y `Infrastructure/Providers/Services/` |
| Soft Delete | **SI** | `ISoftDeletable` + query filters globales (`ApplicationDbContext.cs:978-990`) |
| Audit Trail | **SI** | `IAuditable` + `AuditEntry` automático en `SaveChanges()` (`ApplicationDbContext.cs:801-917`) |
| Multi-tenancy | **Parcial** | `CustomerId` en auditoría, pero sin aislación real por tenant |

---

## 8. Inventario de Tecnologías

| Categoría | Tecnologías |
|-----------|-------------|
| Runtime | .NET 10 (preview), C# 14 |
| ORM | Entity Framework Core 10.0.10 |
| DB | SQL Server + PostgreSQL (dual, configurable) |
| Auth | ASP.NET Core Identity + JWT Bearer |
| Real-time | SignalR |
| Background Jobs | Hangfire |
| AI | Semantic Kernel + OpenAI/Gemini/Abacus |
| Notifications | OneSignal (Push), Twilio (WhatsApp), MailKit (Email) |
| PDF | QuestPDF + iText + PdfSharpCore (**tres**) |
| Excel | ClosedXML |
| Mapping | AutoMapper 16.2 |
| Resiliencia | Polly (solo 1 cliente HTTP) |
| Logging | Serilog (console + SQL Server) |
| API Docs | Swagger + Scalar |
| Geo | NetTopologySuite + MaxMind GeoIP2 |
| Files | SixLabors.ImageSharp, Razor views para emails |
| Calendar | Google Calendar API + Ical.Net |

---

## 9. Problemas Críticos Identificados

### P0 — Seguridad
- **Credenciales en texto plano** en `appsettings.json` (lines 5-8: passwords SQL, line 52: JWT key, lines 64-68: SMTP/Brevo passwords, lines 71-72: WhatsApp token, line 233: ElevenLabs key, line 147: Google private key). No se usan User Secrets ni Azure Key Vault en desarrollo.
- **Master key del Vault** hardcoded (`appsettings.json:19`).

### P1 — Arquitectura
- **`ApplicationDbContext` tiene 200+ DbSets** — Dios todo-poderoso. Cualquier cambio de esquema afecta toda la app.
- **`LuxuryApp.Application` referencia `Microsoft.AspNetCore.*`** — la capa de dominio depende de ASP.NET Core (acoplamiento a HTTP).
- **Identity dentro de Application** (`IdentityDbContext`) — identidad mezclada con lógica de negocio.
- **Tres librerías de PDF** — mantenimiento y tamaño innecesario.

### P2 — Operaciones
- **Sin Docker** — despliegue manual, difícil de reproducir.
- **Sin CI/CD visible** — no hay pipelines configurados.
- **Migraciones manuales** en `Program.cs:218-238` — `MigrateAsync()` al arrancar es peligroso en producción.
- **`.sln` fantasma** — `LuxuryApp.Api.sln` y `LuxuryApp.Application.sln` aislados generan confusión.

### P3 — Código
- **Dual JSON serializer** — `Newtonsoft.Json` + `System.Text.Json` coexisten.
- **Usings duplicados** — `LuxuryApp.Application.Interfaces` aparece dos veces en `Application.csproj:188-190`.
- **Nullable disabled** en Api y Application — pierde seguridad de nulls.
- **`appsettings.json:247`** tiene `"TestApiCredentials"` hardcoded.

---

## 10. Veredicto Final

### **Categoría: A) Monolito Modular**

Justificación:
- Una sola solution, un solo proceso, un solo despliegue
- Referencias directas entre proyectos (ProjectReference)
- Comparten base de datos (1 DbContext gigante)
- Sin boundaries físicos (no Docker, no repos separados)
- Sin comunicación inter-servicio

No es ni B (monolito distribuido) ni D (híbrido) porque no hay intento real de separación. Es un monolito con carpetas organizadas por dominio (`Modules/`), lo cual es un buen primer paso pero insuficiente para microservicios.

---

## 11. Recomendaciones

### Quick Wins (1-2 semanas)
1. **Mover credenciales** a User Secrets / Azure Key Vault. Eliminar de `appsettings.json`.
2. **Eliminar `.sln` fantasma** (`LuxuryApp.Api.sln`, `LuxuryApp.Application.sln`).
3. **Eliminar una librería de PDF** — quedarse solo con QuestPDF.
4. **Habilitar nullable** en ambos proyectos principales.
5. **Deduplicar usings** en `.csproj`.

### Mediano plazo (1-3 meses)
1. **Separar el `ApplicationDbContext`** — crear un `DbContext` por módulo (o al menos por macro-área: Core, Finance, HR, Operations).
2. **Extraer Identity** de `ApplicationDbContext` a su propio `IdentityDbContext` independiente.
3. **Agregar Dockerfile** para containerización.
4. **Configurar CI/CD** básico (build + test + publish).
5. **Eliminar dependencias de `Microsoft.AspNetCore.*`** de `LuxuryApp.Application`.

### Largo plazo (3-6 meses)
1. **Evaluar si vale la pena dividir en microservicios** — dado el tamaño actual (15 módulos, 200+ tablas), candidatos serían: Auth/Identity, Notifications, y AI como servicios separados.
2. **Implementar CQRS** con MediatR para operaciones de alto volumen (Cobranza, Nómina).
3. **Agregar resiliencia Polly** a todos los HTTP clients, no solo Aspel.
4. **Implementar Health Checks** para las 3+ bases de datos.
