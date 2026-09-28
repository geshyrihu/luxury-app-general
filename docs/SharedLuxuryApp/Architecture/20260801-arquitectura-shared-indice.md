# 🏗️ Arquitectura — Visión Técnica del Sistema

**Documentación de arquitectura por componente (Frontend, Backend, Integración).**

---

## 📚 Guías Arquitectónicas

### 🔗 Contratos Compartidos (Backend + Frontend)
**Ubicación:** `architecture/shared/`

| Documento | Propósito |
|:---|:---|
| [../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-paginacion.md](shared/../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-paginacion.md) | Contrato canónico de paginación (PaginationCommonDTO) |
| [../../../docs/SystemLuxuryApp/Notifications/20260801-arquitectura-system-notificaciones.md](shared/../../../docs/SystemLuxuryApp/Notifications/20260801-arquitectura-system-notificaciones.md) | Esquema de notificaciones: `INotificationDispatcher`, canales (in-app, push, push web, correo), resolución de URLs y destinatarios en pruebas |

---

### Frontend (Angular 22)
**Ubicación:** `architecture/frontend/`

| Documento | Propósito |
|:---|:---|
| [../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-angular.md](frontend/../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-angular.md) | Estructura del proyecto Angular, state management, patterns |
| [../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-monolito.md](frontend/../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-monolito.md) | Organización de apps por dominio (monolito lógico) |
| [STATE_MANAGEMENT.md](frontend/STATE_MANAGEMENT.md) | Signals, Computed, Effects, state patterns |
| [COMPONENTS_CATALOG.md](frontend/COMPONENTS_CATALOG.md) | Catálogo de componentes custom (custom-input-*, app-*, ili-*) |
| [FORMS_GUIDE.md](frontend/FORMS_GUIDE.md) | Reactive Forms, validaciones, FormHelper |
| [TESTING.md](frontend/TESTING.md) | Unit tests, e2e tests, mocking strategies |
| [PERFORMANCE.md](frontend/PERFORMANCE.md) | @defer, lazy loading, change detection optimization |

### Backend (.NET 10)
**Ubicación:** `architecture/backend/`

| Documento | Propósito |
|:---|:---|
| [../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-api.md](backend/../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-api.md) | Minimal APIs, Clean Architecture, Vertical Slice |
| [../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-paginacion.md](shared/../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-paginacion.md) | Contrato canónico de paginación (PaginationCommonDTO, BindAsync) |
| [../../../docs/SystemLuxuryApp/Security/20260801-arquitectura-system-vault.md](backend/../../../docs/SystemLuxuryApp/Security/20260801-arquitectura-system-vault.md) | Sistema de Vault propio (AES-256-GCM), gestión de secretos |
| [MINIMAL_API_MIGRATION.md](backend/MINIMAL_API_MIGRATION.md) | Migración de MVC a Minimal APIs |
| [../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-database.md](backend/../../../docs/SharedLuxuryApp/Architecture/20260801-arquitectura-shared-database.md) | EF Core 10, migraciones, SQL Server / PostgreSQL |
| [TESTING.md](backend/TESTING.md) | xUnit, integration tests, mocking |
| [PERFORMANCE.md](backend/PERFORMANCE.md) | Optimizaciones, caché, async/await patterns |

---

## 🔗 Relacionados

**Para Convenciones (Reglas Obligatorias):**
→ Ver [../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md](../../../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md)

**Para Setup & Seguridad:**
→ Ver [docs/setup/](../setup/)

---

## 📊 Estructura Completa de docs/

```
docs/
├── architecture/        ← 🎯 ESTÁS AQUÍ: Visión técnica por componente
│   ├── frontend/       ← Angular 22 architecture
│   ├── backend/        ← .NET 10 architecture
│   └── README.md
├── setup/              ← Setup local, secrets management
├── plans/              ← Planes de implementación (datados, excepto convenciones)
├── reporte_maestro/    ← Auditorías consolidadas
├── guides/             ← Guías operativas (deployment, troubleshooting, excepto convenciones)
└── README.md           ← Índice central

docs-conventions/       ← Reglas, protocolos y estándares (NEW)
├── conventions/        ← Reglas obligatorias por dominio
├── audit/              ← Framework de auditoría
├── plans/              ← Planes de convenciones
├── guides/             ← Guías de convenciones
└── README.md           ← Índice
```

---

**Última actualización:** 2026-08-12 (Migración: convenciones centralizadas en docs-conventions/)  
**Responsable:** Tech Lead / Architecture Team
