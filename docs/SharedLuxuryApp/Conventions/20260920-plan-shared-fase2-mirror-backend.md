# Plan Fase 2 — Espejo de ubicación frontend ↔ backend (módulo/submódulo, nivel 4–5)

**Fecha:** 2026-09-20
**Ámbito:** `appsweb/angular/src/app/modules/`
**Base:** Fase 1 (nombres de carpeta ya en inglés). Backend canónico: `api/LuxuryApp.Application/Modules/<Modulo>LuxuryApp/<Submodulo>/`.
**Restricción dura (Fase 3):** **NO** se cambian `path:`/URL/guards/estructura de rutas. Solo se actualizan los *specifiers de import* (`loadComponent`, `import(...)`) cuando un archivo cambia de carpeta.

---

## 1. Regla de espejo

- Nivel 2 del frontend (`modules/<modulo>.luxuryapp/<submodulo>/`) debe llamarse igual que el submódulo backend (`<Submodulo>` en PascalCase → kebab-case).
- Los grupos FE-only que NO existen en backend se **desarman** (sus hijos suben a nivel 2).
- Submódulos BE-only sin contraparte FE: se reportan; no se inventan carpetas.
- Se preserva `candidates/` (grupo que SÍ existe en backend: `Candidates/`).

## 2. Comparación FE vs BE (nivel 2)

| Módulo | FE-only (desarmar/mover) | BE-only (referencia) | Match |
|---|---|---|---|
| accounting | `ar`, `general-ledger`, `mock-aspel` | accounting-catalogs, accounting-config, accounting-migration, accounting-online, aspel-account-audit, aspel-full-mirror, aspel-web-budget, budget-proposals, budget-shared, dynamic-reports, expense-catalog-budget, expense-catalog-detail, financial-accounting, fixed-expense-catalogs, funding-file, maintenance-report, projected-expenses, reports | budget, fundings |
| admin | `access-control`, `admin-wrapper`, `dev-tools`, `email-configuration`, `reports` | approvals, audit-entries, customers, database-backup, diagnostics, infrastructure, system-ai, system-tenant | security-permissions, system-audit-logs, system-configuration |
| auth | `login`, `recovery-code`, `recovery-password`, `reset-password`, `user-profile` | account-recovery, auth, identity, profile-users | password-manager |
| collections | `aspel-collections-haus` | aspel-collections-haus-live, aspel-collections-haus-local | native-collections, online-collections |
| human-resources | `employee-file`, `hr-admin`, `interfaces`, `performance-evaluations` | evaluation, manuals-and-processes, notifications, payroll | employee-time-clock, salary-projections, time-off |
| legal | `employees-contracts`, `legal-matters`, `vigilance-committees` | employee-contracts, employees, legal | — |
| management | `management-home` | — | monthly-meetings |
| operations | `administrative-incidents`, `announcements`, `custom-documents`, `dashboard`, `diagrams`, `directories`, `field-service`, `google-calendar`, `initial-implementation`, `inspections`, `inventory`, `manuals`, `meetings`, `panic-alert`, `properties`, `recruitment-requests`, `reports`, `staff-board`, `supervision`, `task-engine`, `templates`, `work-positions` | access-control, building-customer, committee, customer-providers, delivery-reception, diagram, general-summary, management-dashboard, monthly-meetings, my-building, owner, property-occupants, provider-qualification, providers, scheduled-tasks, service-orders, task | announcements, custom-documents, dashboard, google-calendar, inspections, inventory, panic-alert, properties, supervision |
| purchases | — | purchase-orders, purchases | purchase-history, purchase-requests |
| recruitment | `dismissal-requests`, `docs`, `recruitment-shared`, `recruitment-shell` | employee-birthday, employee-dismissal-requests, employee-onboarding-checklists, employee-org-chart, interviewer-matrices, job-descriptions, notifications, provider-supports, recruitment-source-catalogs, recurring-tasks, request-dismissal-discounts, request-dismissals, request-employee-registers, request-positions, salary-modifications, sanction-types | candidates, employee-bank-data-records, employee-beneficiaries, employee-clinical-data-records, employee-documents, employee-emergency-contacts, employee-file, employee-registration-requests, employees, external-staffs, recruitment-requests, salary-modification-requests, vacancy-requests, work-positions |
| shared | — | customer-responsible-parties, files, folios, select-item | catalogs |
| residents / supplier / system | (BE sin submódulos) | — | — |

## 3. Movimientos propuestos (por módulo)

> Solo `git mv` + update de imports. Sin tocar URLs.

### 3.1 accounting (desarmar `general-ledger` y `ar`)
- `general-ledger/<X>` → subir a nivel 2 para cada `<X>` que es submódulo BE: `accounting-online`, `aspel-account-audit`, `aspel-full-mirror`, `aspel-web-budget`, `budget-proposals`, `dynamic-reports`, `fixed-expense-catalogs`, `financial-summary`(≈reports), `aspel-mirror`.
- `ar/*` → `accounting-catalogs/*` (BE `AccountingCatalogs`).
- `mock-aspel` → BE `accounting-migration`.
- `general-ledger/contabilidad-cliente` (client-accounting) y `accounting-online` tienen pantallas FE-only → quedan como submódulo propio si no hay BE exacto (decisión D-A).

### 3.2 admin
- `access-control` → dentro de `security-permissions/` (BE `SecurityPermissions/Access`).
- `dev-tools` → BE `infrastructure` (decide D-B).
- `email-configuration` → `system-configuration` (BE `SystemConfiguration`) o queda (D-B).
- `admin-wrapper` es shell FE → queda o va a `core` (D-B).

### 3.3 collections — RESUELTO (no dividir)
- **D-C cerrado:** `aspel-collections-haus` se queda **unificado** (FE-only). Evidencia: `aspel-cobranza-haus.models.ts:9` (`AspelDataSource = "live" | "local"`) y `aspel-cobranza-haus-source-toolbar.ts` alternan live/local en runtime. El backend separa Live/Local a nivel servicio; el FE los unifica a propósito. Forzar el split duplicaría componentes y rompería la UX. Divergencia intencional documentada.

### 3.4 human-resources
- `expediente-del-empleado` (employee-file) → desarmar: `payroll` (BE `Payroll`), `hr-admin`(≈?), `performance-evaluations`→`evaluation`.
- `hr-admin` → BE no tiene; puede ir a `payroll`/`evaluation` (D-D).

### 3.5 operations (mayor)
- Agrupar por BE: `inventory/*` ya ok; `inspections` ok; `properties` ok; `task-engine`→`task`; `diagrams`→`diagram`; `field-service`→`service-orders`; `administrative-incidents` ok; `directories`→ BE `legal-directories`? (decide); `reports` FE-only → revisar; `staff-board` FE-only; `initial-implementation` FE-only.
- `work-positions` FE-only en operations → BE `WorkPositions` está en Recruitment; mover a recruitment (D-E).

### 3.6 recruitment
- `dismissal-requests` → `employee-dismissal-requests`.
- `docs`, `recruitment-shared`, `recruitment-shell` FE-only → `docs/` al módulo (`docs/`), shared→`recruitment-shared` (deuda §1.4), shell→quedar.
- `employee-file/*` interno → alinear a `employee-org-chart`, `employee-onboarding-checklists`, etc.

### 3.7 purchases
- `purchase-requests/*` y `purchase-history` ok. Faltan `purchase-orders` y `purchases` (BE-only) → no crear salvo que existan pantallas.

## 4. Decisiones pendientes (bloquean ejecución)

- **D-A** accounting: ¿`client-accounting` y pantallas sin BE exacto se quedan como submódulo o se mueven bajo `reports`?
- **D-B** admin: destino de `dev-tools`, `email-configuration`, `admin-wrapper`.
- **D-C** collections: split live/local de `aspel-collections-haus`.
- **D-D** HR: destino de `hr-admin` y de las pantallas de `employee-file`.
- **D-E** operations↔recruitment: mover `work-positions` a recruitment.
- **D-F** duplicados cross-módulo (M3): fusionar `board-directors-*` (committee/legal), `configuracion-sistema` (admin/system), `expediente-del-empleado` (HR/recruitment), `recursos-humanos`.
- **D-G** `docs/` dentro de submódulos → mover a `[modulo].luxuryapp/docs/`.

## 5. Orden de ejecución propuesto (1 commit por módulo, build verde)

1. `legal` (pequeño: 3 carpetas).
2. `management`, `purchases`, `shared` (ajustes menores).
3. `auth`, `collections`.
4. `human-resources`, `recruitment`.
5. `admin`, `accounting`.
6. `operations` (el más grande).

## 6. Verificación por bloque

- `npm run build` verde.
- `grep` de rutas viejas = 0.
- **Sin cambios** en `path:`/URL (revisión de diff de `*.routing.ts` limitada a specifiers de import).

---

## 7. Ejecutado y decisiones resueltas

| Bloque | Commit | Resultado |
|---|---|---|
| auth + recruitment (dismissal) | `192ed3498` | `login`→`auth`, recovery*→`account-recovery/*`, `user-profile`→`profile-users`, `dismissal-requests`→`employee-dismissal-requests` |
| legal | `364afc2b2` | `legal-matters`→`legal`, `employees-contracts`→`employee-contracts` |
| recruitment (org-chart/onboarding) | `d531605cf` | `org-chart`→`employee-org-chart`, `employee-onboarding-checklist`→`employee-onboarding-checklists` |
| management/purchases/shared | — | sin movimientos (ya coinciden) |
| admin | `4d1d91ac6` | `dev-tools`→`infrastructure` |
| human-resources (1) | `e20a243ff` | `employee-file/human-resources/payroll`→`payroll`; `performance-evaluations`→`evaluation` |
| human-resources (2) | `443eed4c1` | `employee-file/human-resources/{dashboard,helpers,shared}`→`shared/`; elimina `employee-file/human-resources` |
| operations | `5b2af0acc` | `diagrams`→`diagram`, `task-engine`→`task`, `field-service`→`service-orders` |
| accounting | `336cc38f3` | `ar`→`accounting-catalogs` |

### Divergencias intencionales (no se fuerzan al backend)

1. **collections (D-C):** `aspel-collections-haus` unificado (live/local por runtime, no por carpeta).
2. **recruitment/employee-file (D-F):** se conserva el anidamiento FE-only
   (`employee-file/human-resources/employee-bank-data`, `.../employee-beneficiary`, `employee-file/employees/employee-registry`).
   Coinciden con submódulos BE de nivel 2 (`employee-bank-data-records`, `employee-beneficiaries`, `employees`) pero fusionarlos
   es destructivo (colisión de nombres); se documenta como deuda, no se fusiona.
3. **recruitment-shared:** 9 archivos sueltos sin categorizar (deuda §1.4); 51 referencias. No se reorganiza en Fase 2.
4. **recruitment-shell:** shell FE-only, se queda.
5. **legal/vigilance-committees:** FE-only (BE lo tiene en Operations).
6. **employee-file/employees/{services, contract-renewal-*}`:** se quedan en `employee-file` (BE `EmployeeFile`).
7. **admin/access-control:** control de acceso **físico** (BE `Operations/AccessControl`), no `SecurityPermissions/Access`; se queda en admin (FE-only).
8. **admin/email-configuration, admin/admin-wrapper:** FE-only.
9. **operations/work-positions:** pantallas FE-only; `recruitment/work-positions` solo tiene `interfaces/`+`models/`. No se fusiona (colisión `interfaces/`).
10. **operations/{recruitment-requests, manuals, directories, staff-board, reports, templates, initial-implementation, meetings}:** FE-only / misplacements cross-módulo no movidos en Fase 2.
11. **human-resources/{hr-admin, interfaces}:** FE-only.
12. **accounting/general-ledger:** grupo FE-only conservado (BE tiene esos submódulos planos).

### Pendiente Fase 3 (NO tocado)
- `path:`/URL/guards/estructura de rutas. Fase 2 solo actualizó specifiers de import/`loadComponent`.

