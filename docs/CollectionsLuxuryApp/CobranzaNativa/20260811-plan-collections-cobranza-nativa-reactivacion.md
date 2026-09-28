# Plan de Reactivacion - CobranzaNativa

**Fecha:** 2026-08-11
**Estado:** Propuesto — pendiente de aprobacion de Tech Lead
**Modulo:** `CobranzaNativa`
**Auditoria origen:** `docs/reporte_maestro/modulos/20260811-auditoria-cobranza-nativa.md`
**Sustituye a:** `docs/plans/20260731-cobranza-nativa-remediacion-plan.md`
**Protocolo:** `conventions/operations/plan-creation-protocol.md`

> **Justificacion de plan nuevo en lugar de actualizacion:** el plan `20260731`
> cerro su alcance (remediacion estructural: frontera, contratos, DTOs,
> endpoints, pruebas). Sus 5 tareas residuales se absorben aqui explicitamente
> en la Fase 1. El alcance de este plan es distinto: **seguridad, invariantes
> financieras y reactivacion de capacidades sin cablear**.

---

## FASE 0 · Pre-planeacion

### 0.1 Problem Statement

> Actualmente, **el area financiera de un condominio** sufre de **controles
> financieros que existen en el codigo pero no se ejercen** cuando intenta
> **operar cobranza con garantias de trazabilidad y autorizacion**, lo que
> resulta en **un subsistema que se declara auditable sin auditoria efectiva,
> sin segunda firma, sin idempotencia en pagos y con una ruta publica que
> permite marcar pagos como verificados sin autenticacion.**

### 0.2 KPIs

| KPI | Baseline (2026-08-11) | Target | Fase |
|---|:--:|:--:|:--:|
| Grupos de endpoints con politica de rol | 1 / 21 | **21 / 21** | 1 |
| Rutas publicas sin autenticacion real | 1 | **0** | 1 |
| Reglas de negocio 🔴 incumplidas | 7 | **0** | 1–3 |
| Reglas ⚪ por especificar | 8 | **0** | 2 |
| Reglas 🟡 sin declarar (documentables) | 4 | **0** | 2 |
| Flujos criticos que escriben bitacora de auditoria | 0 / 5 | **5 / 5** | 3 |
| Endpoints con logica sin puerta de entrada en UI | 15 | **≤ 3** | 4 |
| DTOs con `Id` sin `GuidIdEntityDTO` | 24 | **0** | 5 |
| Archivos con DTOs embebidos en interfaces | 8 | **0** | 5 |
| Rutas listas para produccion | 17 / 24 | **22 / 24** | 4 |

### 0.3 Pre-Mortem

> *Asumimos que esto salio a produccion y fue un desastre. ¿Que lo causo?*

| # | Causa hipotetica | Mitigacion en el plan |
|:--:|---|---|
| 1 | Se aplico `"Finanzas"` a todos los grupos y un `Asistente` cerro el periodo contable del mes | Fase 2 define `RN-CN-021` **antes** de que Fase 1 toque los grupos sensibles; Fase 1 solo aplica la linea base a los grupos no sensibles |
| 2 | Se activo el maker-checker sin definir que operaciones lo requieren y la operacion diaria se bloqueo | `RN-CN-014` y `RN-CN-015` son criterio de paso de la Fase 2; Fase 3 no arranca sin ellas |
| 3 | Se hizo obligatorio `IdempotencyKey` y rompio integraciones externas que ya llamaban al endpoint | Fase 1 genera la clave en backend cuando no viene, sin romper el contrato de entrada |
| 4 | Se cablearon las pantallas de ajustes y notas de credito antes de decidir su clasificacion contable, y hubo que rehacerlas | `RN-CN-016` es criterio de paso de Fase 2; Fase 4 no arranca sin el |
| 5 | Se ejecuto `migrate-from-legacy` en produccion y duplico personas porque `Owner` y `PropertyOccupant` seguian activos | `RN-CN-033` es decision transversal; su ejecucion queda **fuera** de este plan hasta que exista acuerdo con `OperationsLuxuryApp` |
| 6 | Se retiro la pantalla de facturas y un condominio que si la usaba perdio acceso a su historico | Fase 1 marca la pantalla como simulada; **no** la elimina |

### 0.4 Flujos a cubrir en criterios de paso

| Tipo | Flujo |
|---|---|
| **Happy** | Registrar pago → aplicar a cargos → ledger escrito → bitacora escrita → estado de cuenta refleja el saldo |
| **Sad** | Doble clic en aplicar pago → la segunda peticion se rechaza por idempotencia |
| **Sad** | Usuario sin rol financiero intenta cerrar periodo → 403 |
| **Sad** | Webhook con firma invalida → 401, sin escritura |
| **Edge** | Condonacion sobre cargo ya pagado → rechazada por `RN-CN-005` |
| **Edge** | Propiedad sin `PropertyMember` responsable financiero → comportamiento definido por `RN-CN-033` |

---

## 1 · Resumen ejecutivo

`CobranzaNativa` cerro su deuda estructural. Lo que queda no es arquitectura: es
**seguridad, invariantes declaradas sin ejercer y capacidades construidas sin
conectar**.

El plan se ordena en 6 fases. Las dos primeras no son negociables en orden:

1. **Fase 1 · Contencion de seguridad** — cierra las dos vias por las que hoy se
   puede escribir sobre el ledger sin control.
2. **Fase 2 · Especificacion de reglas** — resuelve las 8 decisiones de negocio
   sin las cuales las fases 3 y 4 se codificarian a ciegas.

Las fases 3 a 6 dependen de la 2 y pueden paralelizarse entre si.

---

## 2 · Objetivo

Dejar `CobranzaNativa` en estado **operable con garantias**: acceso controlado,
invariantes financieras efectivas, trazabilidad real y las capacidades ya
construidas accesibles desde la UI.

---

## 3 · Alcance

### Dentro

- capa de autorizacion de los 21 grupos de endpoints del modulo
- webhook publico de pasarelas
- idempotencia, maker-checker y bitacora de auditoria
- cableado frontend de las 15 capacidades huerfanas
- normalizacion de DTOs (`GuidIdEntityDTO`, 1 archivo = 1 DTO)
- documentacion rectora del modulo
- especificacion de las 18 reglas `RN-CN-*`

### Fuera

- integracion real con PAC para CFDI (**iniciativa separada**, requiere
  contratacion externa)
- ejecucion de la migracion `Owner`/`PropertyOccupant` → `PropertyMember`
  (**transversal**, requiere acuerdo con `OperationsLuxuryApp` y
  `resident.luxuryapp`)
- contratacion y activacion de pasarela de pago
- alias legacy de `cobranza.endpoints.ts` (**contrato transversal frontend**,
  fuera del modulo)

---

## 4 · Restricciones

- no se toca `LuxuryApp.Shared` sin analisis de impacto y aprobacion explicita
- **la politica nueva de autorizacion es un cambio shared** (`DependencyInjection.Authorization.cs`)
  y requiere aprobacion antes de Fase 3
- no se cambian rutas publicas ni shapes serializados sin inventario de consumidores
- no se remedia por archivo aislado cuando el hallazgo es de frontera o contrato
- cada fase cierra con evidencia tecnica y actualizacion del checklist
- **Fase 3 y Fase 4 no arrancan sin la Fase 2 aprobada**

---

## 5 · Fases

### Fase 1 · Contencion de seguridad

**Objetivo:** que no exista ninguna via de escritura financiera sin control.

**Bloquea a:** todas las demas fases. Es la unica que puede ejecutarse sin
esperar decisiones de negocio.

#### Tareas

- [ ] `1.1` Deshabilitar el mapeo de `WebhooksEndPoints` hasta que exista
      validacion HMAC real *(C-01)*
- [ ] `1.2` Documentar en el codigo y en el README del modulo que la pasarela no
      esta habilitada *(C-01)*
- [ ] `1.3` Aplicar `.RequireAuthorization("Finanzas")` a los **16 grupos no
      sensibles** del modulo *(C-02)*
- [ ] `1.4` Dejar los **4 grupos sensibles** (`PeriodClosures`, `Approvals`,
      `Adjustments`, `Audit`) marcados con `TODO RN-CN-021` y politica
      `"Finanzas"` provisional, pendientes de Fase 3 *(C-02)*
- [ ] `1.5` Derivar `IdempotencyKey` en backend cuando el cliente no la envie:
      hash de (`PaymentId` + asignaciones ordenadas) *(C-03)*
- [ ] `1.6` Generar `IdempotencyKey` en el frontend por operacion de aplicacion
      de pago *(C-03)*
- [ ] `1.7` Sustituir `StoragePath` fisico por URL segura via
      `IFileReadPathService`; guardar nombre legible separado del UUID *(C-06)*
- [ ] `1.8` Adaptar `FineEvidenceResponseDTO` y `property-fine.dto.ts` al nuevo
      contrato *(C-06)*
- [ ] `1.9` Marcar visiblemente la pantalla de facturas como **simulada** —
      no eliminarla *(C-07)*

#### Criterios de paso

- `grep -rn "RequireAuthorization()" Core/*/EndPoints/` devuelve **0 resultados**
- ningun endpoint del modulo responde sin sesion valida
- aplicar el mismo pago dos veces devuelve rechazo por idempotencia
- ningun DTO del modulo devuelve una ruta que empiece con `C:\` o `/var/`
- la ruta `/cobranza-nativa/invoices` muestra advertencia de simulacion

---

### Fase 2 · Especificacion y liberacion de reglas de negocio

**Objetivo:** cerrar las 8 decisiones ⚪ y publicar las 4 reglas 🟡 que ya
existen en codigo pero no en documentacion.

**Esta fase no produce codigo.** Produce especificacion.

#### 2.A Reglas a **liberar** (documentar lo que ya funciona)

No requieren decision: el codigo ya las implementa y solo hay que elevarlas a
`Docs/reglas-negocio-cobranza-nativa.md`.

- [ ] `2.1` `RN-CN-004` — un ajuste no puede dejar el cargo en importe negativo
- [ ] `2.2` `RN-CN-005` — no se ajusta un cargo en estado `Pagado`
- [ ] `2.3` `RN-CN-006` — la condonacion exige `AuthorizedBy`
- [ ] `2.4` `RN-CN-007` — un solo responsable financiero activo por propiedad

#### 2.B Reglas a **especificar** (requieren decision del area financiera)

- [ ] `2.5` `RN-CN-014` — **¿Que operaciones exigen maker-checker?**
      Candidatas: ajuste, condonacion, cancelacion de pago, reapertura de
      periodo, anulacion de multa
- [ ] `2.6` `RN-CN-015` — **¿Hay umbral de monto que dispare la aprobacion?**
      Si lo hay, ¿es fijo, por tenant o configurable?
- [ ] `2.7` `RN-CN-016` — **¿La nota de credito es pago o ajuste?**
      Determina si sale o no del total recaudado
- [ ] `2.8` `RN-CN-017` — **¿Cancelar un pago revierte los recargos que su
      liquidacion evito?**
- [ ] `2.9` `RN-CN-021` — **¿Que perfil cierra periodo, aprueba y reabre?**
      `"Finanzas"` incluye `Asistente`; probablemente demasiado amplio
- [ ] `2.10` `RN-CN-025` — **¿Un condomino consulta su estado de cuenta desde
      este modulo, o solo desde `resident.luxuryapp`?**
- [ ] `2.11` `RN-CN-031` — **¿Que validaciones de entrada se formalizan** y con
      que libreria
- [ ] `2.12` `RN-CN-032` — **¿Como se redondea la cuota por indiviso?**
      Referencia disponible: `CobranzaOnline` usa `MidpointRounding.AwayFromZero`
- [ ] `2.13` `RN-CN-033` — **¿`PropertyMember` sustituye o convive con
      `Owner` + `PropertyOccupant`?** Decision transversal; su **ejecucion**
      queda fuera de este plan

#### Criterios de paso

- `Docs/reglas-negocio-cobranza-nativa.md` contiene las 18 reglas `RN-CN-*` con
  ID, nivel, enunciado, criterio de verificacion y ubicacion de implementacion
- cada regla ⚪ tiene decision registrada con fecha y responsable
- **ninguna regla queda en estado ⚪ al cerrar la fase**

---

### Fase 3 · Activacion de invariantes financieras

**Depende de:** Fase 2 (`RN-CN-014`, `RN-CN-015`, `RN-CN-021`)

**Objetivo:** que las invariantes declaradas se ejerzan en el flujo real.

#### Tareas

- [ ] `3.1` Crear la politica de autorizacion definida en `RN-CN-021`
      *(cambio en `DependencyInjection.Authorization.cs` — **requiere aprobacion
      shared**)*
- [ ] `3.2` Aplicar esa politica a los 4 grupos sensibles marcados en `1.4`
- [ ] `3.3` Invocar `IFinancialApprovalService` desde `AdjustmentService`
      segun `RN-CN-014` *(C-04)*
- [ ] `3.4` Invocar `IFinancialApprovalService` desde
      `CobranzaPaymentAppService.CancelAsync` segun `RN-CN-014` *(C-04)*
- [ ] `3.5` Invocar `IFinancialApprovalService` desde
      `PeriodClosureService.ReopenAsync` segun `RN-CN-014` *(C-04)*
- [ ] `3.6` Aplicar el umbral de `RN-CN-015` como condicion de disparo *(C-04)*
- [ ] `3.7` Inyectar `IFinancialAuditService` en `CobranzaPaymentAppService`
      *(A-03)*
- [ ] `3.8` Inyectar `IFinancialAuditService` en `ChargeAppService` *(A-03)*
- [ ] `3.9` Inyectar `IFinancialAuditService` en `AdjustmentService` *(A-03)*
- [ ] `3.10` Inyectar `IFinancialAuditService` en `PaymentAllocationService`
      *(A-03)*
- [ ] `3.11` Inyectar `IFinancialAuditService` en `PeriodClosureService` *(A-03)*
- [ ] `3.12` Redirigir `credit-note-modal` a `Adjustments.createCreditNote`
      segun lo decidido en `RN-CN-016` *(C-05)*

#### Criterios de paso

- una condonacion genera solicitud de aprobacion y **no se aplica** hasta ser
  aprobada
- la bandeja `/cobranza-nativa/approvals` recibe solicitudes generadas por el
  sistema, no solo por llamada manual
- registrar, aplicar y cancelar un pago deja **3 entradas** en la bitacora
- el dashboard de metricas ya no cuenta condonaciones como recaudado

---

### Fase 4 · Reactivacion de capacidades sin cablear

**Depende de:** Fase 2 (`RN-CN-016`)

**Objetivo:** conectar a la UI las 15 capacidades que ya existen en backend.

#### Tareas por prioridad

**Alta**

- [ ] `4.1` UI de ajustes financieros → `POST cobranza/adjustments`
- [ ] `4.2` UI de nota de credito formal → `POST cobranza/adjustments/credit-notes`
- [ ] `4.3` UI de creacion y edicion de casos de cobranza legal
      → `POST` / `PUT cobranza/collection-cases`

**Media**

- [ ] `4.4` Carga de evidencias en multas → `POST property-fines/{id}/evidences`
      *(depende de `1.7`)*
- [ ] `4.5` Boton de envio de recibo de pago → `notifications/receipts/{id}/send`
- [ ] `4.6` Boton de verificacion de integridad del ledger
      → `POST ledger/integrity/customer/{id}`
- [ ] `4.7` Cancelacion de nota de credito y de solicitud de aprobacion
- [ ] `4.8` Resolver la ruta `properties`: feature propia o adaptador formal
      documentado

**Baja**

- [ ] `4.9` Borrado de evidencias, aprobaciones por propiedad, balance por cargo
      y consulta por lote del ledger

#### Criterios de paso

- de los 15 endpoints huerfanos quedan **≤ 3**, y los restantes estan
  justificados por escrito
- las rutas `collection-cases` y `approvals` pasan de 🟠 a ✅ en el semaforo de
  madurez

---

### Fase 5 · Normalizacion estructural residual

**Independiente.** Puede correr en paralelo con 3 y 4.

#### Tareas

- [ ] `5.1` Heredar `GuidIdEntityDTO` en los 24 DTOs con `Guid Id` *(A-01)* —
      un subdominio por PR
- [ ] `5.2` Extraer los 16 DTOs embebidos en archivos de interfaz y endpoint
      *(A-02)*
- [ ] `5.3` Sustituir los 4 usos residuales de `Results.*` por `TypedResults.*`
      *(D-05)*
- [ ] `5.4` Migrar `DateTime.UtcNow` a `TimeProvider` en servicios de negocio
      *(D-02)* — gradual, empezando por `LateFees` y `PeriodClosures`
- [ ] `5.5` Migrar hex hardcodeados a tokens `var(--ds-*)` *(D-01)*
- [ ] `5.6` Revisar selects, autocomplete y wrappers `@ui/*` en modo edicion
      *(residual Fase 2 del plan `20260731`)*
- [ ] `5.7` Definir fallbacks cuando el catalogo no contenga el valor editado
      *(residual Fase 2 del plan `20260731`)*
- [ ] `5.8` Implementar los validadores definidos en `RN-CN-031` *(D-04)*

#### Criterios de paso

- `npm run audit:ds` en verde para el modulo
- 0 DTOs con `Id` fuera de `GuidIdEntityDTO`
- 1 archivo = 1 DTO en todo `CobranzaNativa`

---

### Fase 6 · Documentacion rectora y cierre

#### Tareas

- [ ] `6.1` Corregir `conventions/modules/cobranza-nativa-module-conventions.md`:
      rutas reales `api/cobranza/*` en lugar de
      `api/accounting-coi/native-collection/*` *(S-02)*
- [ ] `6.2` Corregir en el mismo documento la referencia a
      `COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md`, que **si existe**
      *(S-02)*
- [ ] `6.3` Reclasificar `Docs/reglas-negocio-cobranza.md` como historico o
      reescribirlo contra el contrato vigente *(S-02, residual Fase 0 del plan
      `20260731`)*
- [ ] `6.4` Clasificar el resto de `Docs/` y `docs/` en vigente vs historico
      *(residual Fase 0 del plan `20260731`)*
- [ ] `6.5` Crear `README.md` rector del backend del modulo — hoy hay 7
      documentos sin indice
- [ ] `6.6` Registrar la estrategia mobile real vigente *(D-06)*
- [ ] `6.7` Actualizar el `conventions-viewer` si alguna regla cambio de
      taxonomia
- [ ] `6.8` Marcar el plan `20260731` como cerrado y sustituido por este

#### Criterios de paso

- ningun documento del modulo menciona `api/accounting-coi/native-collection/*`
  como contrato vigente
- un agente que siga el orden de lectura obligatorio recibe un contrato real

---

## 6 · Checklist maestro

- [ ] Fase 1 · Contencion de seguridad — **aprobada**
- [ ] Fase 2 · Especificacion de reglas — **aprobada**
- [ ] Fase 3 · Activacion de invariantes — **aprobada**
- [ ] Fase 4 · Reactivacion de capacidades — **aprobada**
- [ ] Fase 5 · Normalizacion estructural — **aprobada**
- [ ] Fase 6 · Documentacion y cierre — **aprobada**

---

## 7 · Riesgos y mitigaciones

| # | Riesgo | Prob. | Impacto | Mitigacion |
|:--:|---|:--:|:--:|---|
| R1 | La politica nueva de autorizacion rompe accesos legitimos actuales | Media | Alto | Fase 1 aplica solo `"Finanzas"` (linea base ya usada por `CobranzaOnline`); la politica restrictiva espera a `RN-CN-021` |
| R2 | El area financiera no responde las 8 decisiones y la Fase 2 se estanca | **Alta** | Alto | Las 4 reglas 🟡 de la Fase 2.A no dependen de nadie: se documentan primero. Fase 5 tampoco depende de Fase 2 y puede avanzar en paralelo |
| R3 | Activar el maker-checker bloquea la operacion diaria | Media | Alto | `RN-CN-015` define umbral; se despliega primero en modo registro sin bloqueo, se mide, luego se activa el bloqueo |
| R4 | Hacer obligatoria la idempotencia rompe integraciones externas | Baja | Medio | Se deriva en backend cuando no viene; el contrato de entrada no cambia |
| R5 | `RN-CN-033` escala a un proyecto transversal y arrastra a este plan | Media | Medio | Su **ejecucion** esta fuera de alcance; solo se exige la decision escrita |
| R6 | Deshabilitar el webhook rompe una pasarela ya en uso | **Baja** | Alto | Verificado: no hay pasarela contratada; la propia UI declara *"pendiente de activar"* |
| R7 | Los 24 DTOs de la Fase 5 generan un PR gigante y no se revisa | Media | Bajo | Un subdominio por PR, maximo 3 archivos por commit |

---

## 8 · Dependencias e impactos

| Elemento | Tipo | Requiere |
|---|---|---|
| `DependencyInjection.Authorization.cs` | **shared** | Aprobacion explicita antes de Fase 3 |
| `LuxuryApp.Shared/Enums/PaymentMethod.cs` | **shared** | Solo si `RN-CN-016` decide retirar `DebtForgiveness` |
| `cobranza.endpoints.ts` (alias legacy) | contrato transversal frontend | **Fuera de alcance** — iniciativa separada |
| `OperationsLuxuryApp/Owner` · `PropertyOccupant` | otro modulo | `RN-CN-033`, ejecucion fuera de alcance |
| `resident.luxuryapp/property` · `owner` | otra app | `RN-CN-033` |
| Integracion PAC para CFDI | proveedor externo | **Fuera de alcance** — requiere contratacion |
| Pasarela de pago | proveedor externo | **Fuera de alcance** — condiciona la reactivacion del webhook |

---

## 9 · Cierre esperado

Al cerrar las 6 fases, `CobranzaNativa` debe poder afirmar, con evidencia
verificable, que:

1. **Ninguna escritura financiera ocurre sin autenticacion y autorizacion.**
2. **Las 18 reglas `RN-CN-*` estan documentadas, con criterio de verificacion y
   ubicacion de implementacion.** Ninguna en estado ⚪ ni 🔴.
3. **Las invariantes declaradas se ejercen**: idempotencia activa, maker-checker
   disparado por el sistema, bitacora escrita en los 5 flujos criticos.
4. **Las capacidades construidas son alcanzables** desde la UI.
5. **La documentacion rectora describe el contrato real.**
6. **22 de 24 rutas listas para produccion.** Las 2 restantes —`invoices` y
   `properties`— quedan explicitamente fuera de alcance con su iniciativa
   sucesora identificada.

---

## 10 · Regla de ejecucion

- no tocar shared sin aprobacion explicita
- no cambiar contratos publicos sin inventario de consumidores
- no remediar por archivo aislado si el hallazgo es de frontera o contrato
- **Fase 3 y Fase 4 no arrancan sin Fase 2 aprobada**
- cada fase cierra con evidencia tecnica y actualizacion de este checklist
- cada tarea ejecutada se referencia contra su hallazgo origen (`C-xx`, `A-xx`,
  `D-xx`, `S-xx`) en el commit
