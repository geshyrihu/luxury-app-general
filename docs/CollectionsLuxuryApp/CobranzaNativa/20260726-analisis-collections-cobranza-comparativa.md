# Comparativa: Cobranza Nativa vs Cobranza Online

**Fecha de análisis:** 2026-08-07
**Alcance:** Analisis profundo de funcionalidad, arquitectura, beneficios y desventajas de los dos submódulos de cobranza de LuxuryApp.
**Módulos analizados:**
- **Cobranza Nativa** — `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/` → front `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa/`
- **Cobranza Online** — `api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/` → front `client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/`

> **Nota de metodología:** este documento es un análisis comparativo de apoyo. No crea
> reglas nuevas para el sistema rector de convenciones (`CONVENTIONS.md`). Cualquier
> conclusión de remediación debe pasar por el flujo oficial de auditoría/plan.

---

## 1. Resumen ejecutivo

| Aspecto | **Cobranza Nativa** | **Cobranza Online** |
|---|---|---|
| **Naturaleza** | Motor financiero integral (CRUD/escritura) propio de LuxuryApp | Capa de **lectura** sobre Aspel (cobranza externa) |
| **Fuente de datos** | Base de datos propia (ledger append-only) | MSSQL **Aspel COI (externa)** + caché local |
| **Capacidades** | Factura, cobra, mora, concilia, cierra, emite PDF/email, webhooks, realtime | Consulta KPIs, estados de cuenta, análisis, morosidad, exclusiones |
| **Arquitectura** | Modular por dominios (`Core/<Domain>/{DTOs,EndPoints,Interfaces,Services}`) | Minimal API (`IEndPointsModule`) + AppServices |
| **Frontend** | 24 rutas, standalone + signals + SignalR realtime | 9 rutas + wrapper, signals + store, polling silencioso |
| **Complejidad** | Alta (madura, muchos dominios de negocio) | Media-baja (esencialmente read-only) |
| **Dependencia crítica** | Ninguna externa (motor propio) | **Aspel** (si cae, cubren dashboards quedan en error) |

---

## 2. Inventario completo de funcionalidades

### 2.1 Cobranza Nativa

#### Base maestra / catálogos
| Funcionalidad | Descripción | Endpoints principales |
|---|---|---|
| **Properties** | Propiedades (dependencia externa; frontend placeholder) | — |
| **PropertyMembers** | Miembros de propiedad, responsable financiero (1 único activo) | `GET/POST/PUT/DELETE /property-members`, `POST create-with-account`, `POST {id}/end-membership`, `POST migrate-from-legacy` |
| **ChargeTypes** | Catálogo de tipos de cargo (conceptos + cuenta contable); auto-siembra 001–026 | CRUD `/charge-types` |
| **ChargeTemplates** | Plantillas de cuotas (fija / indiviso) con preview | CRUD `/charge-templates`, `POST preview`, `GET coverage` |
| **LateFeePolicies** | Políticas de mora (días de gracia, %, tope, compuesto mensual) | CRUD `/late-fee-policies` |

#### Operación y cobro
| Funcionalidad | Descripción | Endpoints principales |
|---|---|---|
| **Charges** | Cargos (manual/automático), saldo inicial bulk CSV, generar mensual, calcular mora, cancelar | `GET/POST/PUT /charges`, `POST {id}/cancel`, `POST generate-monthly`, `POST calculate-late-fees`, `POST bulk-import/saldo-inicial`, `POST initial-balance/bulk` |
| **Payments** | Registro de pagos, asignación FIFO a cargos, cancelación con reverso, webhooks pasarela | `GET/POST/PUT /payments`, `POST {id}/cancel`, `POST apply-to-charges`, `GET pending-charges/...`, `POST auto-apply-overpayments` |
| **Initial Balance** | Captura/actualización masiva de saldos iniciales | (vía charges) |
| **Native Statement** | Estado de cuenta ledger-based con corte, aging y PDF | `GET /statements/{propertyId}`, `GET /statements/{propertyId}/pdf` |
| **Dashboard** | KPIs del periodo (cobrado, pendiente, vencido, top deudores, tendencia) | `GET /metrics/customer/{c}?meses=` |

#### Control financiero
| Funcionalidad | Descripción | Endpoints principales |
|---|---|---|
| **Ledger** | Libro mayor append-only (fuente de verdad), verificación de integridad | `GET /ledger/...`, `POST integrity/customer/{c}` |
| **Reconciliation** | Bolsa de pagos no aplicados + auto-conciliación | `GET /reconciliations/unallocated`, `POST auto-apply-all` |
| **Approvals** | Maker-checker (condonaciones, reaperturas, anulaciones, ajustes al alza) | `POST /approvals`, `POST {id}/approve`, `{id}/reject`, `{id}/cancel` |
| **PeriodClosures** | Cierre/reapertura de periodo con bloqueo de escritura | `POST close`, `POST reopen`, `GET is-closed`, `GET /period-closures/...` |
| **Audit** | Bitácora auditoría financiera | `GET /audit-logs/customer/{c}`, `GET /audit-logs/property/{p}/customer/{c}` |

#### Cobranza extendida y salidas
| Funcionalidad | Descripción | Endpoints principales |
|---|---|---|
| **CollectionCases** | Expedientes de cobranza legal/gestión, aging, escalamiento automático | `GET/POST /collection-cases`, `POST {id}/activity`, `POST evaluate-and-escalate/{c}` |
| **RegulationArticles** | Artículos del reglamento | `/regulation-articles` |
| **PropertyFines** | Multas reglamentarias con evidencias y generación de cargo | `/property-fines`, `POST issue-charge`, `POST {id}/void`, `/evidences` |
| **Invoices** | Facturas CFDI (⚠ simulación PAC) | `GET/POST /invoices`, `POST {id}/cancel` |
| **Notifications** | Emails/push de estado de cuenta y recibos; motor pre-vencimiento y mora | `POST /notifications/process`, `statements/send`, `statements/send-batch`, `receipts/{paymentId}/send` |
| **AutomatedServices** | Centro de jobs (generar mensual, mora, escalar, conciliar, procesar) | — |
| **Realtime (SignalR)** | Actualización en vivo por cargo/abono/conciliación | grupos `native-collection-{customerId}` |
| **Webhooks** | Recepción de pagos de pasarelas (Conekta/Stripe/STP) | `POST /api/cobranza/payment-webhooks/pasarela` |
| **BillingConfig (compat externa)** | Modo nativo vs AspelCoiSync (encapsulado) | `GET/POST /api/cobranza/billing-config` |

### 2.2 Cobranza Online

| Funcionalidad | Descripción | Endpoints principales |
|---|---|---|
| **Dashboard / KPIs** | Total a recaudar/recaudado/pendiente, torres, top deudores, categorías, plantillas activas | `GET /api/cobranza/online/dashboard/{c}/year/{y}/month/{m}?day=` |
| **Estado de cuenta** | 12 meses con saldo acumulado por departamento | `GET /statements/.../account/{accountId}/year/{y}` |
| **Catálogo de cuentas** | Árbol espejo Aspel, cuentas nivel 3/residentes | `GET /accounts/tree/{c}`, `GET /statements/cuentas-nivel3/{c}` |
| **Análisis de cobranza** | Composición por clasificación a fecha de corte | `GET /analysis/{c}/year/{y}/month/{m}/day/{d}` |
| **Inspección / histórico** | Detalle de movimientos del mes por condómino; histórico auditoria | `GET /inspection/{c}/...`, `GET /inspection-history/...` |
| **Exclusiones** | Cuentas excluidas de reportes (upsert) | `GET/PUT /excluded-accounts` |
| **Morosidad** | Reporte solo MOROSOS + COBRANZA JUDICIAL con drilldown | derivado de dashboard/analysis + modal front |
| **Otros cargos** | Conceptos no-001/002/003 del mes | derivado |
| **Movimientos** | Pivot cargos/abonos por cuenta y concepto | `GET /movements/...` (backend) + pivot front |
| **Advances** | Cuotas anticipadas (saldos a favor) | derivado |
| **Torres** | Deuda por torre/bloque (nivel 2) | derivado |
| **Reporte financiero** | Reporte financiero multicolumna "La Jolla" (401/403, fondos) | `GET /reporte-financiero/{c}/...` |
| **Sync con Aspel** | Forzar sincronización (rol SoloSuperUsuario) | `POST /aspel-sync/.../{completo\|contabilidad\|cobranza}` |
| **Pólizas / cartera** | Pólizas COI y cartera por departamento | `GET /policies`, `GET /cartera` |

---

## 3. Reglas de negocio clave implementadas

### Cobranza Nativa (motor propio)
1. **Ledger append-only** como fuente de verdad financiera; reversos = contramovimientos (`LedgerService.cs:3-13`).
2. **Bloqueo de escritura en periodos cerrados** (`LedgerService.WriteAsync:73-82`).
3. **Aprobaciones maker-checker** obligatorias para operaciones sensibles (condonación, devolución, reapertura, anulación de cargo pagado, ajuste al alza). Auto-aprobación bloqueada (`FinancialApprovalService`).
4. **Idempotencia** en generación de cargos, batches de ledger, asignación de pagos y notificaciones.
5. **FIFO** en asignación de pagos y saldos a favor (más vencido primero) (`PaymentAllocationService.getPendingChargesByProperty`).
6. **Envejecimiento (aging)** en bandas Corriente/1-30/31-60/61-90/90+ (`NativeStatementService`).
7. **Mora y recargos** con período de gracia, penalidad fija o %, tope, opción, snapshot de política.
8. **Un único responsable financiero activo** por propiedad (revocación automática).
9. **Anti-cross de tenant/propiedad** en asignación de pagos y snapshots.
10. **No mutación financiera silenciosa**: montos/vencimientos angulos de cargos y pagos no editables por CRUD.
11. **Auto-generación de multas** con cargo único (134) y evidencia de archivos.

### Cobranza Online (clasificación)
Clasificación de cada cuenta en **antecigos / sin adeudo / cobranza judicial / morosos / deuda corriente** (`CobranzaOnlineClasificador.cs`, umbrales):
- **COBRANZA JUDICIAL**: >5 cuotas vencidas de mantenimiento (-001) **O** ≥5 de extraordinaria (-003).
- **MOROSOS**: ≥2 cuotas vencidas de mantenimiento (-001) **O** ≥1 de extraordinaria (-003).
- **DEUDA CORRIENTE**: saldo > 0 sin alcanzar los umbrales.
- Conta de cuotas **completas** impagas: `floor(saldoSubcuenta / cuotaVigente)`.
- **SaldoAlCorte** = inicial + Σ(cargo − abono) al mes de corte.
- **Cobranza perfecta** (análisis mensual) = cargos −001 + −003; **Cobrado** en análisis es residual; **Cobranza del mes** real = abonos del mes.

---

## 4. Comparativa: Ventajas de cada uno

### 4.1 Ventajas de **Cobranza Nativa**
1. **Frontera y trazabilidad financiera robusta**: el ledger inmutable da garantías de auditoría superiores a cualquier modelo mutante.
2. **Opera independiente de Aspel**: no falla si el sistema contable externo cae; es un motor autónomo.
3. **Autorización granular y maker-checker**: control de doble firma en operaciones de alto impacto.
4. **Automatización propia**: generación mensual de cargos, cálculo de mora, aging/escalamiento de cóbulos, auto-conciliación, notificaciones pre/ex-post — todo dentro del módulo.
5. **Realtime (SignalR)**: actualización en vivo de tablas y estado de cuenta.
6. **Documentación y auditoría**: bitácora financiera y envío de estados de cuenta con PDF real (QuestPDF).
7. **Cumplimiento de frontera/denominación**: separación limpia core/contracts con huellas Aspel encapsuladas.

### 4.2 Ventajas de **Cobranza Online**
1. **Fuente única de clasificación**: todas las rutas (live y cache) delegan en `CobranzaOnlineClasificador` con adaptadores → evita duplicar la regla de morosidad.
2. **Minimal API moderna**: minimal endpoints con auto-discovery, menos boilerplate, `ApiResponseDTO<T>` tipado y autorización centralizada por `RequireAuthorization("Finanzas")` / `SoloSuperUsuario`.
3. **Optimizaciones de rendimiento**: pre-indexado O(1) por prefijo nivel-3 y diccionarios, pensando en clientes grandes.
4. **Caché local con metadata de frescura** (fresca/aceptable/desactualizada) y trazabilidad en `FinancialAuditLogs`.
5. **Foxout en funcional**: UI con store compartido, señales, lazy, polling silencioso y UX responsivo/dark-mode.

---

## 5. Desventajas y riesgos de cada uno

### 5.1 Riesgos de **Cobranza Nativa**
1. **⚠️ Facturación CFDI es una simulación PAC** (`InvoiceService.cs:23-56`): UUID/XML/PDF mock, folio aleatorio, rutas `"local/mock/path.xml"`. **No hay integración real con el SAT/PAC.**
2. **Webhook sin validación criptográfica real** (`WebhookHandlerService.cs:13-18`): solo verifica header no vacío (comentado "(simulación)") — riesgo de seguridad.
3. **Webhooks sin conciliación bancaria completa**: pagos no identificados caen en "Bolsa" (Fase 10 comentado).
4. **Reconciliación limitada**: solo marcapa pagos a `Verificado`; no crea movimientos de conciliación reales.
5. **Migración legado vía `FromSqlRaw`** con raw SQL → deuda de comunicación/database.
6. **DTOs duplicados**: `charge.dto.ts` y `cobranza-payment.dto.ts` existen en `interfaces/` y en `contracts/external-compatibility/` con el mismo contenido → riesgo de drift.
7. **Huellas `coi*`/`AspelCoiSync` residuales en DTOs nativos** de `interfaces/` (contradice la frontera documentada en frontend).
8. **Reapertura de periodo permitida por endpoint** sin maker-checker obligatorio (posible bypass del invariant) .
9. **Valores hardcode**: `MaxUnpaidOrdinaryCharges=3`, `MaxUnpaidExtraordinaryCharges=1`, `IssuedBy="Sistema"`.
10. **Cambio de backend**: generación parcial de `ChargeTemplate` legacy; `preview` de plantillas no terminado; funcionalidades `Invoices.generate/cancel` y evidence no expuestos en UI.
11. **Tests**: buenas tap13 spec (charges/payments/statements/members/billing), pero **sin tests** en `automated-services`, `reconciliation`, `charge-templates`, `property-fines`, `collection-cases`, `invoices`, etc.
12. **`changeDetection: Eager`** en la mayoría de componentes (no OnPush) → riesgo de rendimiento con tablas grandes.

### 5.2 Riesgos de Cobranzo Online
1. **⚠ Dependencia crítica de Aspel**: si Aspel cae, el Dashboard y el Análisis **no tienen fallback cableado** (el `catch` no llama al fallback) → cubren en error, no en caché.
2. **Fallback con lógica vieja**: cuando hay fallback, `CurrentMonthCharge` se fuerza a 0 y el pie del dashboard usa "una cuota vigente" que **no pasa por el clasificador** — divergencia potencial de cifras con la ruta live.
3. **Duplicación front/back de reglas**: el front Angular reimplementa calculo suffix→concepto y algunas reglas; el modal de morosidad duplica la clasificación en texto.
4. **Inconsistencia de nombres**: `COBRANZA JUDICIAL` (morosidad) vs `COBRANZA EXTRAJUDICIAL` (analysis/detalle) para el mismo concepto → filtros pueden no ser coherentes entre vistas.
5. **README desactualizado** frente al código: rutas de `sync` y `statement` difieren (sync movida a `/aspel-sync` con `SoloSuperUsuario`).
6. **Botón "Descargar Excel" muerto**: `<web-button-label ...>` sin `(clicked)` y sin librería xlsx en el frontend.
7. **Resumen con código muerto**: `resumen.ts` conserva `computed` no usados y borra un `resumen.bak.html` de 517 líneas; el spec testea código muerto (`COBRANZA EXTRAJUDICIAL` provoca fallo de test).
8. **Artefactos sueltos**: `image.png`, `check.ps1`, xlsx sin referencia en el módulo.
9. **Sync concurrente limitada a 5 min** (429) puede frustrar operaciones manuales frecuentes.
10. **`exclusions` es solo lectura** pese a que `updateExcludedAccount` existe.

---

## 6. Comparativa cruzada función por función — Cobranza Nativa vs Cobranza Online

> Esta tabla inventaría **todas las funcionalidades documentadas y presentes en el código de
> Cobranza Nativa** (backend `Core/*` + frontend) y verifica, para cada una, si existe un
> equivalente implementado en Cobranza Online. Leyenda:
> - ✅ **Implementado en Online** (existe funcionalidad equivalente real).
> - ❌ **No existe en Online** (Online solo lee de Aspel y no cubre la capacidad).
> - ⚠️ **Parcial / simulado / solo lectura** (hay algo, pero incompleto o divergente).

### 6.1 Base maestra y catálogos

| # | Funcionalidad | Back (Nativa) | Front (Nativa) | ¿En Cobranza Online? | Observación |
|---|---|---|---|---|---|
| 1 | **Propiedades** como eje financiero | ⚠️ (dependencia externa) | ⚠️ Placeholder | ❌ No | Online trabaja con cuentas Aspel espejo (no propiedades LuxuryApp). |
| 2 | **Miembros de propiedad** (propietarios/copropietarios/residentes/inquilinos) y **responsable financiero único activo** | ✅ | ✅ | ❌ No | Online no administra personas/responsables. |
| 3 | **Catálogo de tipos de cargo** (conceptos + cuenta contable, auto-siembra 001–026) | ✅ | ✅ | ⚠️ Parcial | Online mapea 26 conceptos Aspel (helper `cobranza-conceptos.ts`) pero es de solo lectura; no edita el catálogo. |
| 4 | **Plantillas de cargos** (cuota fija / indiviso) con vista previa | ✅ | ⚠️ (preview sin visor) | ⚠️ Parcial | Online muestra plantillas activas en el resumen y permite editar (`ChargeTemplateForm`), pero no son equivalentes completas. |
| 5 | **Cobertura de plantillas / cuota por propiedad** | ✅ | ✅ | ❌ No | Online no proyecta cobertura por propiedad. |
| 6 | **Políticas de mora** (días de gracia, tasa fija/%, tope, compuesto mensual) | ✅ | ✅ | ❌ No | Online solo *clasifica* morosidad; **no calcula recargos**. |
| 7 | **Artículos de reglamento** (base para multas) | ✅ | ✅ | ❌ No | — |
| 8 | **Carga de saldo inicial masivo (CSV)** | ✅ | ✅ | ❌ No | Online no captura saldos; los toma de Aspel. |

### 6.2 Emisión de cargos y cobro

| # | Funcionalidad | Back (Nativa) | Front (Nativa) | ¿En Cobranza Online? | Observación |
|---|---|---|---|---|---|
| 9 | **Cargos manuales** (crear/editar/cancelar) | ✅ | ✅ | ⚠️ Lectura | Online lista/lee cargos; no escribe. |
| 10 | **Generación mensual automática de cargos** (indiviso/cuota fija, idempotente) | ✅ | ✅ (jobs) | ❌ No | — |
| 11 | **Cálculo automático de mora / recargos** | ✅ | ✅ (jobs) | ❌ No | Online no genera recargos. |
| 12 | **Multas reglamentarias con evidencias** (generación de cargo, anulación) | ✅ | ⚠️ (UI última evidencia) | ❌ No | — |
| 13 | **Aplicación de pagos FIFO** a cargos pendientes | ✅ | ✅ | ⚠️ Lectura de movimientos | Online muestra/abonos pero no aplica. |
| 14 | **Auto-aplicación de saldos a favor** (overpayments) | ✅ | ✅ | ❌ No | — |
| 15 | **Cancelación de pago con reverso en ledger** (preserva trazabilidad) | ✅ | ✅ | ❌ No | — |
| 16 | **Webhooks de pasarelas (Conekta/Stripe/STP)** | ⚠️ Simulado (sin firma) | — | ❌ No | — |
| 17 | **Notas de crédito / ajustes (condonación, devolución)** con approve | ✅ | ✅ | ❌ No | — |
| 18 | **Saldo a (initial balance) bulk por propiedad** | ✅ | ✅ | ⚠️ Solo lectura | — |

### 6.3 Control financiero & auditoría

| # | Funcionalidad | Back (Nativa) | Front (Nativa) | ¿En Cobranza Online? | Observación |
|---|---|---|---|---|---|
| 19 | **Ledger append-only (fuente de verdad)** + verificación de integridad | ✅ | ✅ (viewer) | ❌ No | Online solo cache Aspel (metadata). |
| 20 | **Cierre / reapertura de periodo** con bloqueo de escritura | ✅ | ✅ | ❌ No | — |
| 21 | **Aprobaciones maker-checker** (condonaciones, reaperturas, anulaciones, reajustes) | ✅ | ✅ (inbox) | ❌ No | — |
| 22 | **Auditoría financiera** (bitácora tolerante a fallos) | ✅ | ✅ | ⚠️ Parcial | Online guarda `FinancialAuditLogs` de sync (trazadora, no operativa). |
| 23 | **Conciliación de pagos** (bolsa de no aplicados + auto-apply) | ⚠️ Parcial (no crea movimientos reales) | ✅ | ❌ No | — |
| 24 | **Estados de cuenta ledger-based** con corte y envejecimiento (aging) | ✅ | ✅ | ✅ | Online también genera estado de cuenta (12-meses) por departamento. |
| 25 | **PDF del estado de cuenta** (QuestPDF) | ✅ | ✅ | ❌ No generado | Online no emite PDF desde servidor (solo lectura). |
| 26 | **Dashboard KPIs** (cobrado/pendiente/vencido, top deudores, tendencia) | ✅ | ✅ | ✅ | Ambos perfilan KPIs; Online añade clasificación de morosidad. |

### 6.4 Cobranza extendida, salidas e integraciones

| # | Funcionalidad | Back (Nativa) | Front (Nativa) | ¿En Cobranza Online? | Observación |
|---|---|---|---|---|---|
| 27 | **Expedientes de cobranza** (aging, escalamiento automático) | ✅ | ✅ | ⚠️ Parcial | Online solo reporta (no gestiona expedientes) |
| 28 | **Facturación CFDI** | ⚠️ Simulado (PAC mock) | ⚠️ (solo lista, sin generar) | ❌ No | — |
| 29 | **Notificaciones email/push** (estado de cuenta + recibo, motor pre/ex-post mora) | ✅ | ✅ | ❌ No | — |
| 30 | **Envío de estados de cuenta por email** (individual y masivo) | ✅ | ✅ | ❌ No | — |
| 31 | **Realtime SignalR** (cargo/abono/conciliación) | ✅ | ✅ | ❌ No (polling a Aspel) | — |
| 32 | **Servicios automatizados (jobs centrales)** | ✅ | ✅ | ⚠️ Solo sync + polling | — |

### 6.5 Síntesis — Mapeo Nativa → Online

| Función (Nativa) | Existe en Online | Tipo |
|---|---|---|
| 1 Propiedades | ❌ | No |
| 2 Miembros / responsable financiero | ❌ | No |
| 3 Catálogo de conceptos (26) | ⚠️ | Solo lectura |
| 4 Plantillas de cargo | ⚠️ | Solo lectura |
| 5 Cobertura de plantillas | ❌ | No |
| 6 Políticas de mora (calcular recargos) | ❌ | No |
| 7 Artículos de reglamento | ❌ | No |
| 8 Saldo inicial masivo | ❌ | No |
| 9 Cargos (escribir) | ⚠️ | Solo lectura |
| 10 Generación mensual automática | ❌ | No |
| 11 Cálculo de mora/recargos | ❌ | No |
| 12 Multas + evidencias | ❌ | No |
| 13 Aplicación de pagos FIFO | ❌ | No |
| 14 Auto-aplicar saldos a favor | ❌ | No |
| 15 Cancelación de pago con reverso | ❌ | No |
| 16 Webhooks de pasarela | ❌ | No |
| 17 Notas de crédito / ajustes | ❌ | No |
| 18 Saldo inicial | ⚠️ | Solo lectura |
| 19 Ledger (fuente de verdad) | ❌ | No |
| 20 Cierre / reapertura de periodo | ❌ | No |
| 21 Aprobaciones maker-checker | ❌ | No |
| 22 Auditoría financiera | ⚠️ | Solo metadata de sync |
| 23 Conciliación de pagos | ❌ | No |
| 24 Estado de cuenta + aging | ✅ | Sí-equivalente |
| 25 PDF de estado de cuenta | ❌ | No |
| 26 Dashboard KPIs | ✅ | Sí |
| 27 Expedientes de cobranza | ⚠️ | Solo reporte, no gestión |
| 28 Facturación CFDI | ❌ | No |
| 29 Notificaciones email/push | ❌ | No |
| 30 Envío masivo de estados | ❌ | No |
| 31 Realtime SignalR | ❌ | No |
| 32 Servicios automatizados (jobs) | ⚠️ | Solo sync/polling |

### Resumen sintético general

| Criterio | **Cobranza Nativa** | **Cobranza Online** | Comentario |
|---|---|---|---|
| **Escritura de datos** | ✅ Sí (motor completo) | ❌ No (solo lectura) | Online es consulta Aspel |
| **Trazabilidad / ledger** | ✅ Append-only + integridad | ⚠️ Solo metadata de sync | Nativa superior |
| **Manejo de mora/aging** | ✅ Motor completo | ⚠️ Solo clasificación de lectura | Online NO calcula moros |
| **Facturación** | ⚠️ Simulado (no SAT) | ❌ No aplica | CFDI no real en ninguno |
| **Realtime** | ✅ SignalR | ❌ No (solo polling) | Nativa es la ventaja |
| **Resiliencia a caída de origen** | ✅ Alto (BD propia) | ❌ Bajo (Aspel crítico) | Desventaja clave de Online |
| **Regla de clasificación** | ⚠️ Own (aging, bucket) | ✅ Centralizada en clasificador | Online sólida |
| **Seguridad / roles** | ✅ Auth + maker-checker | ✅ Auth por group + rol por sync | Ambos buenos |
| **Complejidad de adopción** | Alta (muchos dominios) | Baja (read-only) | |
| **Riesgo de deuda técnica** | Alta (piezas parciales/simuladas) | Alta (fallback desconectado, código muerto) | Ver secciones 5.1 y 5.2 |
| **Cobertura de pruebas** | Buena en núcleo, irregular en extendidos | ⚠️ Spec rota (resumen) | |

---

## 7. Sinopsis

- **Cobranza Online** es un **visor/catálogo de lectura** sobre el conto de Aspel. Es rápido de mantener, moderno (minimal API + clasificador central) y **suficiente para reportar y visualizar morosidad**, pero **falla cuando Aspel falla**, no persiste operativa y su fallback está parcialmente desconectado.
- **Cobranza Nativa** es un **sistema financiero completo de gestión de cobros** (cargos, pagos, mora, conciliación, cierres, documentos, webhooks, aprobaciones) independiente de Aspel. Es el "motor de cobranza" del producto, con controles contables sólidos (ledger inmutable, idempotencia, anti-tenant), pero arrastra **facturación simulada, webhooks sin firma real** y un conjunto de piezas parciales o duplicadas.

### Recomendación de decisión estratégica (a validar en aprobación)
- Si el negocio debe **cobrar, registrar y auditar** dentro de la plataforma con autonomía: **Cobranza Nativa** es el candidato correcto.
- Si solo necesita **visualizar/analizar** la cobranza que vive en Aspel: **Cobranza Online** cubre el caso con menor costo y sin escribir en contabilidad.
- La convergencia natural es a corto/medio plazo: **usar Cobranza Nativa como motor y Cobranza Online (o Aspel) como fuente de lectura/consulta** cuando se requiera la contabilidad externa. Cualquier consolidación debe tramitarse bajo el protocolo de planificación y frontera del proyecto (evitar que `core/` de Nativa se recontamine con términos Aspel/Online).
