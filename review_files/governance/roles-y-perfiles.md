# 🎭 Roles y Perfiles Profesionales - LuxuryApp

**Propósito:** Definir formalmente los 6 roles profesionales que existen en LuxuryApp, sus responsabilidades, tecnologías, y cómo aplican CONVENTIONS.md.

**Vigencia:** A partir de 2026-07-27  
**Autoridad:** Tech Lead + Arquitecto  
**Revisión:** Anual

---

## 📋 MATRIZ EJECUTIVA: ROLES × RESPONSABILIDADES

| Rol | Foco Principal | Stack Tecnológico | Secciones CONVENTIONS | Auditor Responsable |
|-----|---|---|---|---|
| **Full Stack Developer** | Ciclo completo BD→UI | Angular + .NET + SQL | §1-22 | Tech Lead |
| **Frontend Senior** | UI, UX, Performance | Angular, PrimeNG, SCSS, Ionic | §2,3,5,6,7,8,15 | Frontend Lead |
| **Backend Developer** | APIs, Lógica, Datos | .NET 10, EF Core, SQL/PostgreSQL | §1,9,16,18 | Backend Lead |
| **Mobile Developer** | iOS/Android/PWA | Ionic, Angular, Flutter | §2,13,15 | Mobile Lead |
| **Tech Lead / Architect** | Diseño, Mentoring, Auditoría | All | §1,14,19-22 | CTO |
| **Enterprise Systems Engineer** | Integración, Legacy | .NET + SQL, Angular | §1,9,18 | Integration Lead |

---

## 🎯 ROL 1: FULL STACK DEVELOPER (.NET / ANGULAR)

### Perfil

Desarrollador con capacidad de **diseñar e implementar** soluciones completas desde la base de datos hasta la interfaz de usuario. Entiende el flujo de datos de punta a punta y puede tomar decisiones arquitectónicas en su área.

### Responsabilidades

- ✅ Implementar features frontend + backend de forma coordinada
- ✅ Diseñar DTOs/contratos que funcionen en ambas capas
- ✅ Coordinar refactors que afecten múltiples capas
- ✅ Mentorizar developers junior en full-stack
- ✅ Participar en auditorías de módulos (§19)

### Tecnologías Principales

| Capa | Stack | Versión |
|------|-------|---------|
| Frontend | Angular | 22 |
| Frontend UI | PrimeNG + Ionic | 22, 8 |
| Backend | .NET | 10 |
| ORM | EF Core | 10 |
| Base de Datos | SQL Server / PostgreSQL | Actual |
| Testing | xUnit + Jasmine | Actual |

### Reglas Aplicables (CONVENTIONS.md)

**Críticas (🔴 bloquean merge):**
- §2: Strict TypeScript, Signals, OnPush
- §4: ApiResponseService obligatorio
- §9: Primary Constructors, Minimal APIs

**Altas (🟠 bloquean en patrón):**
- §7: Nombrado consistente
- §15: Patrón responsive correcto

**Medias (🟡 comentario en PR):**
- §16: Testing coverage

### Auditoría Estándar

```bash
# Pre-commit
npm run audit:full-stack

# Checklist:
□ Backend: Minimal API, dto suffix, ApiResponseDTO
□ Frontend: @ui/*, strict: true, OnPush
□ Contract: DTOs alineados, rutas exactas
□ Testing: Servicios testeados
```

### Carrera / Crecimiento

Full Stack → **Tech Lead / Architect**

---

## 🎯 ROL 2: FRONTEND SENIOR / ESPECIALISTA EN UI

### Perfil

Experto en **construcción de interfaces complejas**, performance, accesibilidad y diseño responsivo. Entiende profundamente Angular, PrimeNG, CSS moderno y patrones mobile. Guía las decisiones de UI/UX del equipo.

### Responsabilidades

- ✅ Auditoría visual de componentes nuevos
- ✅ Mantener catálogo UI (`shared/ui`)
- ✅ Optimizar performance frontend (Core Web Vitals)
- ✅ Definir patrones de responsive (§15)
- ✅ Code review de todas las vistas

### Tecnologías Principales

| Área | Stack |
|------|-------|
| Frontend Framework | Angular 22 (Signals, standalone) |
| Component Library | PrimeNG 22 |
| Mobile | Ionic 8 |
| Styling | SCSS, PrimeFlex, CSS Variables |
| State | Signals, RxJS (legacy) |
| Testing | Jasmine/Karma |

### Reglas Aplicables

**Críticas (🔴 bloquean merge):**
- §2: Strict, OnPush, Signals, @if/@for
- §3: PrimeNG estándar, no hardcode
- §5: Usar @ui/*, auditar `npm run audit:ui`
- §6: Wrappers con sufijo `-wrapper`

**Altas (🟠):**
- §7: Consistencia triple (file/class/selector)
- §8: Botones correcto (iw-*/il-*/ili-*)
- §15: Breakpoints, touch targets 44×44px

**Medias (🟡):**
- §4: ApiResponseService usage patterns

### Auditoría Estándar

```bash
# Pre-push
npm run audit:frontend

# Verificaciones:
□ npm run audit:ui (catálogo UI limpio)
□ grep -r "primeng" src/app/modules/ (cero imports directos)
□ grep -r " any" src/app --include="*.ts" (strict typing)
□ Validar componentes móviles en CRUDs
□ Revisar responsive en 3 breakpoints
```

### Carrera

Frontend Senior → **Tech Lead (Frontend)** o **Design System Architect**

---

## 🎯 ROL 3: BACKEND DEVELOPER (.NET 10)

### Perfil

Especialista en **lógica de negocio, APIs y bases de datos**. Entiende profundamente .NET, diseño de servicios, optimización de queries y arquitectura de datos. Responsable de la integridad y performance del backend.

### Responsabilidades

- ✅ Implementar endpoints en Minimal APIs
- ✅ Diseñar esquemas BD (migraciones EF)
- ✅ Optimizar queries (índices, splits)
- ✅ Implementar seguridad (Vault, auth)
- ✅ Auditar cumplimiento §9 (backend rules)

### Tecnologías Principales

| Área | Stack |
|------|-------|
| Backend Framework | .NET 10, Minimal APIs |
| ORM | EF Core 10 |
| Primary DB | SQL Server |
| Secondary DB | PostgreSQL |
| Logging | Serilog |
| Caching | HybridCache |
| Resiliencia | Polly v8 |
| Testing | xUnit, Moq, EF InMemory |

### Reglas Aplicables

**Críticas:**
- §9: Primary Constructors, Source Generators, Nullable disabled
- §9: ApiResponseDTO<T> obligatorio
- §9: Minimal APIs para endpoints nuevos
- §9: BindAsync para paginación (NO [AsParameters])

**Altas:**
- §9: Reglas de nombrado (kebab-case, plural)
- §18: Arquitectura 3 capas (IFileWrite/IImageStorage/IFileRead)
- §16: Testing unitario xUnit

**Medias:**
- §1: Decisiones arquitectónicas documentadas
- §18: Vault security patterns

### Auditoría Estándar

```bash
# Pre-push
dotnet run audit:backend

# Verificaciones:
□ Grep: Cero AutoMapper (prohibido)
□ Grep: Cero DateTime.UtcNow (usar TimeProvider)
□ Grep: Cero nuevos HttpClient (usar IHttpClientFactory)
□ Formato: Primary Constructors en servicios
□ Paginación: PaginationCommonDTO con BindAsync
□ Testing: 70%+ cobertura en servicios
```

### Carrera

Backend Developer → **Backend Lead** → **Tech Lead** / **Architect**

---

## 🎯 ROL 4: MOBILE DEVELOPER (IONIC / FLUTTER)

### Perfil

Experto en **desarrollo multiplataforma** iOS/Android/PWA. Entiende patrones mobile-first, gestos, thumb zones, y cómo adaptar componentes web a mobile native. Responsable de experiencia móvil.

### Responsabilidades

- ✅ Implementar componentes móviles en cada feature
- ✅ Garantizar paridad web/mobile (Patrón B §15.4)
- ✅ Optimizar performance mobile (Core Web Vitals)
- ✅ Testing en dispositivos reales (375px, 768px)
- ✅ Auditar cumplimiento §13, §15.4-15.9

### Tecnologías Principales

| Plataforma | Stack |
|-----------|-------|
| Hybrid Web | Angular 22 + Ionic 8 |
| PWA | Service Workers |
| Mobile Native | Flutter 3.x (Dart 3) |
| iOS | iOS 12+ (via Capacitor/Flutter) |
| Android | Android 8+ (via Capacitor/Flutter) |
| Testing | Flutter test, Cypress E2E |

### Reglas Aplicables

**Críticas:**
- §2.8: Componente móvil obligatorio en cada CRUD
- §15.4: Patrón B (XDesktopComponent + XMobileComponent)
- §13.1: Flutter architecture (null-safe, sealed)

**Altas:**
- §15.6: UX patterns (bottom sheet, thumb zone, 44×44px)
- §15.9: Testing en 3 breakpoints (375px, 768px, 1280px)
- §3: Ionic patterns (ion-list, ion-item-sliding, NO DynamicDialog)

**Medias:**
- §15.2: Framework de decisión (Patrón A/B/C)

### Auditoría Estándar

```bash
# Pre-push
npm run audit:mobile
flutter analyze

# Verificaciones:
□ Verificar XMobileComponent en listados CRUD
□ Grep: Cero "from 'material'" directo en features
□ Grep: Cero DynamicDialog en mobile (usar ion-modal)
□ Test: 375px viewport - sin scroll horizontal
□ Test: 44×44px touch targets
□ Test: Teclado no oculta inputs
□ Test: Pull-to-refresh + infinite scroll funcional
```

### Carrera

Mobile Developer → **Mobile Lead** → **Tech Lead**

---

## 🎯 ROL 5: TECH LEAD / ARCHITECT

### Perfil

**Líder técnico** responsable de arquitectura general, decisiones de diseño, code reviews cruzados, y mentoría del equipo. Entiende el stack completo y guía decisiones de negocio/técnica.

### Responsabilidades

- ✅ Diseñar arquitectura de nuevos módulos
- ✅ Code review de PRs críticas
- ✅ Auditorías de módulos completas (§19)
- ✅ Planificación técnica (§20)
- ✅ Definir y mantener CONVENTIONS.md
- ✅ Mentoría y onboarding de developers

### Tecnologías Principales

**Conocimiento profundo de:**
- Full Stack: Frontend, Backend, Mobile
- Arquitectura: Vertical Slice, Clean Architecture, SOLID
- DevOps: CI/CD, Git, Docker (básico)
- Bases de Datos: SQL optimization, migraciones

### Reglas Aplicables

**Críticas:**
- §1: Decisiones arquitectónicas documentadas
- §14: Apps organization (nombres cross-app consistentes)
- §19-22: Auditorías, planes, documentación, guías

**Altas:**
- CONVENTIONS.md completo
- Code review standards

### Auditoría Estándar

```bash
# Auditoría integral (2-4 horas)
# Ver §19: AUDIT_AGENT_INSTRUCTIONS.md

# Verificaciones:
□ Arquitectura coherente (Mermaid diagrams)
□ Módulo align con CONVENTIONS (todas secciones)
□ Code review cruzado (frontend + backend)
□ Test coverage 70%+
□ Documentación completa (§21)
□ Performance dentro de SLA
```

### Carrera

Tech Lead → **Architect** / **Engineering Manager** / **CTO**

---

## 🎯 ROL 6: ENTERPRISE SYSTEMS ENGINEER

### Perfil

Especialista en **integración de sistemas legacy** con tecnología moderna. Entiende migraciones, compatibilidad, y cómo conectar sistemas heterogéneos sin disrupciones.

### Responsabilidades

- ✅ Migrar controllers MVC → Minimal APIs
- ✅ Integrar sistemas legacy con nuevas APIs
- ✅ Diseñar adapters/normalizadores de contratos
- ✅ Garantizar backward compatibility
- ✅ Auditoría de migración (§9, §18)

### Tecnologías Principales

| Área | Stack |
|------|-------|
| Backend | .NET 10, MVC legacy |
| Integración | REST, SOAP, Message Queue |
| BD Principal | SQL Server |
| BD Secundaria | PostgreSQL |
| Normalizadores | .NET utilities, adapters |

### Reglas Aplicables

**Críticas:**
- §9: Minimal API migration patterns
- §18: 3-layer file system architecture

**Altas:**
- Legacy compatibility patterns
- Contract versioning

### Auditoría Estándar

```bash
# Auditoría de migración (4-8 horas)

# Verificaciones:
□ Endpoints legacy documentados
□ Rutas públicas normalizadas (§9)
□ DTOs refactorizados (DTO suffix)
□ Tests de integración pasando
□ Performance: no regresión >10%
□ Backward compatibility verificada
```

### Carrera

Enterprise Systems Engineer → **Backend Lead** / **Integration Architect**

---

## 📊 MATRIZ FINAL: Roles × Severidad

| Regla | Full Stack | Frontend | Backend | Mobile | Tech Lead |
|-------|-----------|----------|---------|--------|-----------|
| Strict TypeScript | 🔴 CRÍTICA | 🔴 CRÍTICA | 🟡 MEDIA | 🔴 CRÍTICA | 🔴 CRÍTICA |
| OnPush Strategy | 🔴 CRÍTICA | 🔴 CRÍTICA | 🔵 N/A | 🔴 CRÍTICA | 🔴 CRÍTICA |
| Minimal APIs | 🟠 ALTA | 🔵 N/A | 🔴 CRÍTICA | 🔵 N/A | 🔴 CRÍTICA |
| Primary Constructors | 🟠 ALTA | 🔵 N/A | 🔴 CRÍTICA | 🔵 N/A | 🔴 CRÍTICA |
| Mobile Component | 🟠 ALTA | 🔴 CRÍTICA | 🔵 N/A | 🔴 CRÍTICA | 🟠 ALTA |
| SQL Indexing | 🟡 MEDIA | 🔵 N/A | 🔴 CRÍTICA | 🔵 N/A | 🟠 ALTA |
| @ui/* imports | 🔴 CRÍTICA | 🔴 CRÍTICA | 🔵 N/A | 🟠 ALTA | 🔴 CRÍTICA |

---

## 🔄 FLUJO DE ONBOARDING POR ROL

### Cuando llega nuevo developer:

1. **Lee:** CONVENTIONS.md (completo)
2. **Lee:** [Este archivo] — Rol específico
3. **Lee:** docs/gobernanza-convenciones.md — Auditoría esperada
4. **Lee:** docs/auditoria-por-rol.md — Comandos de verificación
5. **Ejecuta:** Script de auditoría correspondiente
6. **Alineación:** Tech Lead revisa primeras PRs con checklist del rol

---

## 🎓 REFERENCIAS

- **[CONVENTIONS.md](CONVENTIONS.md)** — Reglas técnicas
- **[gobernanza-convenciones.md](./gobernanza-convenciones.md)** — Framework de auditoría
- **[auditoria-por-rol.md](./auditoria-por-rol.md)** — Scripts verificables

---

**Vigencia:** 2026-07-27 - 2027-07-27  
**Próxima revisión:** Q3 2027  
**Autoridad:** Tech Lead + Arquitecto
