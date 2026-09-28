# Documentación del Proyecto — Índice Maestro

**Última actualización:** 2026-09-16
**Estructura:** `CONVENTIONS.md` §6ter — Estructura plana por módulo/submódulo

Todos los documentos, reportes, planes y guías viven bajo `docs/[ModuleLuxuryApp]/[Submodulo]/` siguiendo el catálogo cerrado de módulos (§6bis). **Cero subcarpetas** dentro de cada submódulo.

Naming: `YYYYMMDD-[tipo]-[modulo]-[submodulo].md`

Tipos: `auditoria`, `plan`, `remediacion`, `analisis`, `especificacion`, `guia`, `setup`, `changelog`, `arquitectura`, `prompt`, `business-rules`, `discovery`, `checklist`, `migracion`, `pilot`

---

## Módulos (§6bis)

### Backend

| Módulo | Submódulo | Contenido destacado |
|--------|-----------|-------------------|
| `AccountingLuxuryApp` | `Aspel/` | Integración ASPEL, mocks, análisis |
| `AccountingLuxuryApp` | `Shared/` | Referencias generales |
| `AdminLuxuryApp` | `Banks/` | Auditoría bancos |
| `AdminLuxuryApp` | `Jobs/` | Auditoría + remediación Hangfire jobs |
| `AuthLuxuryApp` | `Security/` | localStorage alert, remediación |
| `CollectionsLuxuryApp` | `CobranzaNativa/` | FASE 0-6, auditorías, planes |
| `CollectionsLuxuryApp` | `CobranzaOnline/` | Auditorías 2026, remediación, ASP |
| `CommitteeLuxuryApp` | `Meetings/` | Auditoría comité, remediación |
| `HumanResourcesLuxuryApp` | `Payroll/` | Nómina implementation, control log |
| `HumanResourcesLuxuryApp` | `WorkPositions/` | Auditoría, remediación, QA gap |
| `HumanResourcesLuxuryApp` | `OrgChart/` | Auditoría, prompts D11 |
| `HumanResourcesLuxuryApp` | `AccessLog/` | Discovery, business rules, plan, checklist |
| `HumanResourcesLuxuryApp` | `Employees/` | Plan beneficiary refactor |
| `HumanResourcesLuxuryApp` | `HrPolicyEngine/` | Business rules, plan |
| `HumanResourcesLuxuryApp` | `Onboarding/` | Discovery, business rules, plan |
| `HumanResourcesLuxuryApp` | `Shared/` | Referencias fase9 |
| `LegalLuxuryApp` | `Shared/` | Referencias fase9 |
| `MaintenanceLuxuryApp` | `Machinery/` | Auditoría machinery |
| `MaintenanceLuxuryApp` | `Pools/` | Auditoría piscina |
| `MaintenanceLuxuryApp` | `Shared/` | Referencias fase9 |
| `ManagementLuxuryApp` | `Shared/` | Exención roles plan |
| `OperationsLuxuryApp` | `Tasks/` | Alerts, prompts T-*, QA gap, remediación |
| `OperationsLuxuryApp` | `Shared/` | Referencias fase9 |
| `PurchasesLuxuryApp` | `PurchaseRequests/` | Auditorías, planes, mapas |
| `PurchasesLuxuryApp` | `PurchaseOrders/` | Auditorías, remediación |
| `PurchasesLuxuryApp` | `Shared/` | Auditoría ubicación módulo |
| `RecruitmentLuxuryApp` | `Candidates/` | Auditorías, FASE 0, plans, handoffs |
| `RecruitmentLuxuryApp` | `Shared/` | Plans de migración, prompts remediación |
| `RecruitmentLuxuryApp` | `Vacancies/` | Auditoría fase2 |
| `SupplierLuxuryApp` | `Suppliers/` | Auditoría provider, remediación |
| `SupplierLuxuryApp` | `Shared/` | Referencias fase9 |
| `SystemLuxuryApp` | `Notifications/` | Standard, auditorías, validación OneSignal |
| `SystemLuxuryApp` | `Jobs/` | Auditoría + remediación + checklist |
| `SystemLuxuryApp` | `Endpoints/` | Radiografía, auditoría endpoints |
| `SystemLuxuryApp` | `Security/` | Setup secrets, arquitectura vault |
| `SystemLuxuryApp` | `Flutter/` | QA, design handoff, manifest |
| `SystemLuxuryApp` | `Logs/` | Business rules, arquitectura, checklist |
| `SystemLuxuryApp` | `AiChat/` | Discovery, arquitectura, readme |
| `SystemLuxuryApp` | `Shared/` | Referencias fase9 |
| `SharedLuxuryApp` | `Conventions/` | Auditorías de convenciones, prompts FH |
| `SharedLuxuryApp` | `FechasHoras/` | Auditoría, plan orquestación, prompts FH |
| `SharedLuxuryApp` | `DesignSystem/` | Remediación integral, primeflex, a11y |
| `SharedLuxuryApp` | `Architecture/` | API, DB, monolito, async, segurity |
| `SharedLuxuryApp` | `Shared/` | Shared services, baselines, inventario |

---

## Buscar un documento

| Cuando necesitas | Carpeta | Prefijo |
|---|---|---|
| Auditoría de módulo | `docs/[Modulo]/[Sub]/` | `YYYYMMDD-auditoria-...` |
| Plan de implementación | `docs/[Modulo]/[Sub]/` | `YYYYMMDD-plan-...` o `YYYYMMDD-remediacion-...` |
| Documentación técnica inline | `docs/[Modulo]/[Sub]/` | `YYYYMMDD-guia-...` o `YYYYMMDD-arquitectura-...` |
| Business rules (FASE 0) | `docs/[Modulo]/[Sub]/` | `YYYYMMDD-business-rules-...` |
| Discovery questionnaire | `docs/[Modulo]/[Sub]/` | `YYYYMMDD-discovery-...` |
| Checklist de tareas | `docs/[Modulo]/[Sub]/` | `YYYYMMDD-checklist-...` |
| Prompt de agente | `docs/[Modulo]/[Sub]/` | `YYYYMMDD-prompt-...` |
| Migración SQL | `docs/[Modulo]/[Sub]/` | `YYYYMMDD-migracion-...` |

---

## Referencias clave

- `CONVENTIONS.md` — Sistema rector §6ter define esta estructura
- `conventions/README.md` — Índice de convenciones
- `docs/SharedLuxuryApp/Conventions/20260916-changelog-fase2-migracion-docs.log` — Log de migración

**Excepción temporal pendiente:** `migration-template/` permanece por instrucción del Tech Lead (design system). Se migra en batch posterior.
