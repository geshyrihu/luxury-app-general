# Governance by Role

**Ultima revision:** 2026-09-24 (fila Backend Prohibitions: AutoMapper acotado a `ProjectTo`). Anterior 2026-07-29.
**Deriva de:** [CONVENTIONS.md](../CONVENTIONS.md)

## Proposito

Definir como se distribuyen responsabilidades, severidades y focos de auditoria
 segun el rol que interviene en el proyecto.

## Roles oficiales

| Rol | Foco principal | Dominios de convenciones mas relevantes |
|---|---|---|
| Full Stack Developer | Flujo completo | backend, frontend, ui, styles, audit, catalogs |
| Frontend Senior / UI | Web UI y experiencia visual | frontend, ui, styles, catalogs |
| Mobile Developer | Mobile Ionic / Flutter | ui mobile, flutter, frontend mobile, styles |
| Backend Developer | APIs, logica, datos, contratos | backend, catalogs, operations, audit |
| Tech Lead / Architect | Gobierno del sistema completo | core, audit, backend, frontend, ui, styles, operations |
| Enterprise Systems Engineer | Integracion y legacy | backend, contracts, operations, audit |

## Responsabilidades por rol

### Full Stack Developer

- respetar orden de lectura completo segun la tarea
- mantener consistencia entre frontend y backend
- no romper contratos compartidos
- reportar cualquier desalineacion cross-stack

### Frontend Senior / UI

- asegurar cumplimiento de Angular, `shared/ui` y `styles`
- evitar bypass al design system
- vigilar estructura de feature y consumo de catalogos

### Mobile Developer

- proteger patrones moviles, touch UX y adaptacion por plataforma
- no forzar paridad exacta con desktop
- validar reglas de Flutter a medida que el stack crece

### Backend Developer

- proteger contratos, rutas, DTOs, servicios genericos y shared
- mantener stack aprobado y evitar dependencias no verificadas
- reportar cualquier necesidad de migracion por impacto transversal
- ejecutar o disparar la auditoria backend correspondiente antes de cerrar
  cambios relevantes

### Tech Lead / Architect

- aprobar nuevas reglas o cambios
- decidir sobre planes de migracion antes de activar reglas nuevas que contradigan el estado actual
- validar consistencia final del sistema documental y del viewer
- conducir onboarding efectivo de developers y otros leads
- cerrar auditorias integrales con plan cuando haya hallazgos materiales

### Enterprise Systems Engineer

- proteger compatibilidad legacy e integraciones sensibles
- vigilar contratos externos y estrategias de adaptacion

## Matriz de responsabilidad por dominio

| Dominio | Roles que mas lo gobiernan |
|---|---|
| core | Tech Lead / Architect |
| backend | Backend Developer, Tech Lead, Enterprise Systems Engineer |
| frontend | Frontend Senior, Full Stack, Tech Lead |
| flutter | Mobile Developer, Tech Lead |
| ui | Frontend Senior, Mobile Developer, Tech Lead |
| styles | Frontend Senior, Tech Lead |
| catalogs | Full Stack, Frontend Senior, Backend Developer, Tech Lead |
| audit | Tech Lead, Full Stack, Backend Developer, Frontend Senior |
| operations | Tech Lead, Backend Developer, Full Stack |

## Matriz: CONVENTIONS.md Secciones × Roles × Severidad

**Cómo usar:** Cada rol debe leer las secciones marcadas como CRÍTICA o ALTA. Las MEDIA son de conocimiento general. La numeración corresponde a la estructura vigente de `CONVENTIONS.md` (revisión 2026-09-21); si cambia, se actualiza esta matriz en el mismo cambio (§7).

### Full Stack Developer

| Sección CONVENTIONS.md | Contenido | Severidad |
|---|---|---|
| §3 Reglas Mínimas Universales | Universales, aplican a todos | 🔴 CRÍTICA |
| §3bis Guía Rápida por Tarea | Qué leer antes de escribir código | 🔴 CRÍTICA |
| §2 Precedencia Documental | Autoridad de documentos | 🟠 ALTA |
| §4.1 / §4.2 Orden de lectura | Workflow backend y frontend | 🔴 CRÍTICA |
| §5.2 Backend + §5.3 Frontend | Reglas, DTOs, validaciones, signals, componentes | 🔴 CRÍTICA |
| §5.5 UI + §5.6 Styles | shared/ui, accesibilidad, tokens CSS | 🟠 ALTA |
| §5.7 Catálogos Transversales | Naming y estructura por tipo de artefacto | 🟠 ALTA |
| §6.1 Reglas críticas (tabla) | DTOs 1:1, SELECTs, DisplayName, tokens, fechas, documentos | 🔴 CRÍTICA |
| §6bis Directorios y Namespaces | Ubicación de archivos, catálogo cerrado de módulos | 🔴 CRÍTICA |
| §7 Gobernanza y Cambios | Plan formal, sincronización | 🟠 ALTA |

### Frontend Senior / UI

| Sección CONVENTIONS.md | Contenido | Severidad |
|---|---|---|
| §3 Reglas Mínimas Universales | Universales | 🔴 CRÍTICA |
| §4.2 Orden de lectura frontend | Workflow completo | 🔴 CRÍTICA |
| §5.3 Frontend | Angular, signals, standalone, OnPush | 🔴 CRÍTICA |
| §5.5 UI | shared/ui, `<app-table>`, iconos, wrappers | 🔴 CRÍTICA |
| §5.6 Styles | Tokens CSS, no Tailwind | 🔴 CRÍTICA |
| §6.1 filas de tokens, iconos, fechas y documentos | `var(--ds-*)`, `AppIcon`, `apiDate`, `<iw-button-view-pdf>` | 🔴 CRÍTICA |
| §6bis Directorios (frontend) | Estructura grupo→submódulo→categoría, aliases | 🟠 ALTA |
| §5.7 Catálogos Transversales | Naming de componentes y servicios | 🟠 ALTA |

### Mobile Developer

| Sección CONVENTIONS.md | Contenido | Severidad |
|---|---|---|
| §3 Reglas Mínimas Universales | Universales | 🔴 CRÍTICA |
| §4.2 Orden de lectura frontend | Angular/Ionic | 🟠 ALTA |
| §5.5 UI (Mobile) | Ionic, `<ili-icon>`, bottom sheets, touch patterns | 🔴 CRÍTICA |
| §4.3 + §5.4 Flutter | Estructura, widgets, servicios | 🔴 CRÍTICA |
| §5.6 Styles | Tokens CSS para mobile | 🟠 ALTA |
| §5.7 Catálogos Transversales | Naming de componentes mobile | 🟠 ALTA |

### Backend Developer

| Sección CONVENTIONS.md | Contenido | Severidad |
|---|---|---|
| §3 Reglas Mínimas Universales | Universales | 🔴 CRÍTICA |
| §4.1 Orden de lectura backend | Workflow completo | 🔴 CRÍTICA |
| §5.2 Backend | Minimal APIs, constructores primarios, EF Core | 🔴 CRÍTICA |
| §6.1 Reglas críticas (tabla) | DTOs 1:1, SELECTs, DisplayName, fechas, sin `?` | 🔴 CRÍTICA |
| Document Read/Write Pattern | `IFileReadPathService`, `IFileWritePathService` | 🔴 CRÍTICA |
| §6bis Directorios y Namespaces | Namespaces path-based, catálogo de módulos | 🟠 ALTA |
| Backend Generic Services Catalog | `ILogger`, `IHttpClientFactory`, etc. | 🟠 ALTA |
| Backend Prohibitions | AutoMapper `ProjectTo` (el mapeo en memoria con `IMapper` sí se permite), MediatR, Dapper, Reflection | 🔴 CRÍTICA |

### Tech Lead / Architect

| Sección CONVENTIONS.md | Contenido | Severidad |
|---|---|---|
| TODAS las secciones | Sistema completo | 🔴 CRÍTICA |
| §2 Precedencia Documental | Gobernanza documental | 🔴 CRÍTICA |
| §7 Gobernanza y Cambios | Roles, aprobaciones, ciclo compliance | 🔴 CRÍTICA |
| §5.8 Auditoría | Criterios de auditoría y baseline | 🔴 CRÍTICA |
| §8.1 Estado transitorio legacy | Clasificación de documentos viejos | 🟠 ALTA |

---

## Severidad por Regla (Independiente del Rol)

La misma regla puede tener peso diferente según el rol que la incumple.

| Regla / Tema | Frontend | Backend | Mobile | Full Stack | Tech Lead |
|---|---|---|---|---|---|
| Signals / Angular moderno | 🔴 CRÍTICA | 🟠 MEDIA | 🟠 MEDIA | 🔴 CRÍTICA | 🟠 ALTA |
| Minimal APIs / contratos backend | 🟠 MEDIA | 🔴 CRÍTICA | N/A | 🔴 CRÍTICA | 🔴 CRÍTICA |
| shared/ui y design system | 🔴 CRÍTICA | N/A | 🟠 ALTA | 🔴 CRÍTICA | 🟠 ALTA |
| Tokens CSS (NO Tailwind) | 🟠 ALTA | N/A | 🟠 MEDIA | 🟠 ALTA | 🟠 ALTA |
| Flutter structure y prohibiciones | 🟠 MEDIA | N/A | 🔴 CRÍTICA | 🟠 MEDIA | 🟠 ALTA |
| DTOs 1:1, SELECTs centralizados | 🟠 MEDIA | 🔴 CRÍTICA | N/A | 🔴 CRÍTICA | 🔴 CRÍTICA |
| DisplayName en enums | 🟠 MEDIA | 🔴 CRÍTICA | 🟠 MEDIA | 🟠 ALTA | 🟠 ALTA |
| Document Handling (Read/Write) | 🟠 MEDIA | 🔴 CRÍTICA | 🟠 MEDIA | 🟠 ALTA | 🟠 ALTA |
| Auditoría completa y plan | 🟠 ALTA | 🟠 ALTA | 🟠 ALTA | 🟠 ALTA | 🔴 CRÍTICA |
| Cambios sobre shared / contratos | 🔴 CRÍTICA | 🔴 CRÍTICA | 🔴 CRÍTICA | 🔴 CRÍTICA | 🔴 CRÍTICA |

---

## Escalación Esperada

- 🔴 **CRÍTICA**
  - Bloquea aprobación o merge
  - Debe notificarse al Tech Lead inmediatamente
  - No se permite "deuda documentada"

- 🟠 **ALTA**
  - Requiere corrección o plan aceptado antes de cierre
  - No puede ser ignorada

- 🟡 **MEDIA**
  - Puede quedar como deuda documentada si no compromete contrato ni seguridad
  - Debe reportarse en auditoría

- ⚪ **BAJA**
  - Mejora recomendada o ajuste menor
  - No bloquea

---

## Relación con Auditorías

- Cada rol debe auditar primero lo que domina, pero sin ignorar contratos transversales.
- La auditoría integral final nunca reemplaza las responsabilidades de cada especialidad.
- Si una regla cae fuera del dominio principal del rol, se documenta y se eleva al revisor adecuado.
- Usar matriz CONVENTIONS.md × Roles × Severidad (arriba) para establecer criterios de paso/fallo

## Comandos o validaciones tipicas por rol

- Frontend Senior / UI
  - `npm run audit:frontend`
- Mobile Developer
  - `npm run audit:mobile`
- Full Stack Developer
  - `npm run audit:full-stack`
- Backend Developer
  - `dotnet run audit:backend`
- Tech Lead / Architect
  - auditoria integral de modulo + reporte + plan por fases

## Referencias

- [Governance](./governance.md)
- [Audit by Role](../audit/audit-by-role.md)
- [Legacy Transition Matrix](../legacy/legacy-transition-matrix.md)



