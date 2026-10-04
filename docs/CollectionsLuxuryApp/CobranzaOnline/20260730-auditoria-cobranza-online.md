# Auditoria Completa - CobranzaOnline

**Fecha:** 2026-07-30
**Modulo:** `CobranzaOnline`
**Backend:** [api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline)
**Frontend:** [client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online](../../../../client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online)
**Estado:** Auditoria completa actualizada
**Resultado formal:** Requiere plan de correccion por fases

---

## Resumen Ejecutivo

`CobranzaOnline` ya no debe auditarse con el reporte del `2026-07-29`, y
tampoco con una lectura parcial del reporte del `2026-07-30` anterior. La
reauditoria completa confirma que el modulo mejoro en naming, servicio frontend
propio y cobertura backend visible, pero aun conserva deuda critica en flujo
funcional, contratos backend, estructura DTO, documentacion vigente y fronteras
de dominio.

El hallazgo mas delicado de esta pasada no es solo estructural: la pantalla de
`inspection` arranca fija en abril, por lo que el modulo puede consultar un
corte incorrecto desde el primer render aunque el resto del feature opere con
fecha actual. Adicionalmente, la sincronizacion manual sigue sin una defensa
backend clara contra ejecuciones concurrentes, y el modulo mantiene contratos
publicos anonimos y mezcla de tipos HTTP dentro de la capa de aplicacion.

---

## Alcance

Se reviso:

- endpoints de `dashboard`, `analysis`, `inspection`, `inspection-history`,
  `excluded-accounts`, `sync`, `statement`, `portfolio`, `balances`,
  `accounts`, `policies` y `reporte-financiero`
- interfaces y servicios de aplicacion del dominio
- DTOs backend y modelos TypeScript del feature
- rutas, servicio frontend y pantallas principales
- documentacion local backend y frontend del modulo
- presencia de pruebas backend y frontend
- flujos funcionales minimos de carga inicial, filtros, sync e inspeccion

---

## Hallazgos

### 1. Incumplimiento critico - `inspection` abre con mes fijo en abril y puede consultar un corte equivocado

**Evidencia**

- `cobranza-online-inspection.ts`
  inicializa `currentMonth` con `signal(4)`
- `cobranza-online-inspection.ts`
  usa ese valor directo al consultar `getInspection`
- el mismo modulo si usa fecha actual en
  `cobranza-online-dashboard.ts`
  y en
  `cobranza-online-reporte-financiero.ts`

**Impacto**

- la inspeccion puede abrir con informacion de un periodo distinto al esperado
- rompe coherencia funcional entre pantallas del mismo modulo
- puede inducir diagnosticos operativos falsos si el usuario no detecta el mes fijo

**Recomendacion**

- alinear el valor inicial al mes actual o a un criterio funcional explicitamente documentado
- validar que dashboard, inspection, analysis y reporte financiero compartan una politica consistente de fecha por defecto

### 2. Incumplimiento alto - la sincronizacion manual no muestra defensa backend clara contra doble ejecucion concurrente

**Evidencia**

- [AspelSyncEndPoints.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/EndPoints/AspelSyncEndPoints.cs)
  expone endpoints manuales que ejecutan migradores en cuanto reciben la solicitud
- [AspelSyncEndPoints.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/EndPoints/AspelSyncEndPoints.cs)
  y [AspelSyncEndPoints.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/EndPoints/AspelSyncEndPoints.cs)
  invocan directamente `RunMigrationAsync` y `RunSincronizacionCobranzaAsync`
- la proteccion visible encontrada hoy esta del lado UI en
  `cobranza-online-dashboard.ts`
  mediante `syncRunning()`
- no se encontro evidencia local de lock, semaphore, lease o marcador de proceso en curso dentro del modulo auditado

**Impacto**

- dos solicitudes paralelas podrian disparar procesos pesados sobre el mismo customer y ejercicio
- aumenta el riesgo de resultados inconsistentes, sobrecosto operativo o auditoria dificil de reproducir

**Recomendacion**

- definir una estrategia backend de idempotencia o exclusividad por `customerId + year + tipo de sync`
- registrar explicitamente el estado `in-progress` o usar un mecanismo de locking aprobado

### 3. Incumplimiento alto - contratos publicos de sincronizacion siguen exponiendo `object` y payloads anonimos

**Evidencia**

- [AspelSyncEndPoints.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/EndPoints/AspelSyncEndPoints.cs)
  retorna `ApiResponseDTO<object>` para sync completo
- [AspelSyncEndPoints.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/EndPoints/AspelSyncEndPoints.cs)
  retorna `ApiResponseDTO<object>` para sync de contabilidad
- [AspelSyncEndPoints.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/EndPoints/AspelSyncEndPoints.cs)
  retorna `ApiResponseDTO<object>` para sync de cobranza

**Impacto**

- el contrato no queda estable ni tipado de forma formal
- complica testing, documentacion y consumo coherente desde frontend

**Recomendacion**

- crear DTOs explicitos para sync completo, sync contabilidad y sync cobranza
- eliminar respuestas anonimas del contrato publico

### 4. Incumplimiento alto - la capa de aplicacion mezcla `ActionResult` con servicios del dominio

**Evidencia**

- [ICobranzaOnlineAccountAppService.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Interfaces/ICobranzaOnlineAccountAppService.cs)
  retorna `Task<ActionResult<ApiResponseDTO<List<CobranzaOnlineAccountResponseDTO>>>>`
- el mismo patron sigue vivo en
  [ICobranzaOnlineBalanceAppService.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Interfaces/ICobranzaOnlineBalanceAppService.cs),
  [ICobranzaOnlinePolicyAppService.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Interfaces/ICobranzaOnlinePolicyAppService.cs)
  y
  [ICobranzaOnlinePortfolioAppService.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Interfaces/ICobranzaOnlinePortfolioAppService.cs)
- los servicios concretos repiten la misma mezcla en `Services/`

**Impacto**

- contamina la capa de aplicacion con tipos MVC/HTTP
- dificulta reutilizacion, testing y separacion de responsabilidades

**Recomendacion**

- estandarizar estos contratos a `Task<ApiResponseDTO<T>>`
- dejar decisiones HTTP solo en `EndPoints`

### 5. Incumplimiento alto - DTOs locales siguen incumpliendo herencia y regla de un archivo por DTO

**Evidencia**

- [CobranzaOnlineAccountResponseDTO.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/DTOs/CobranzaOnlineAccountResponseDTO.cs)
  declara DTO con `Id` sin alinear a la regla vigente
- [CobranzaOnlineBalanceResponseDTO.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/DTOs/CobranzaOnlineBalanceResponseDTO.cs),
  [CobranzaOnlineCurrentChargeTemplateDTO.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/DTOs/CobranzaOnlineCurrentChargeTemplateDTO.cs),
  [CobranzaOnlineMovementResponseDTO.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/DTOs/CobranzaOnlineMovementResponseDTO.cs)
  y
  [CobranzaOnlinePolicyResponseDTO.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/DTOs/CobranzaOnlinePolicyResponseDTO.cs)
  siguen en la misma condicion
- [CobranzaOnlineStatementResponseDTO.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/DTOs/CobranzaOnlineStatementResponseDTO.cs)
  contiene mas de un DTO en el mismo archivo
- [ReporteFinancieroResponseDTO.cs](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/DTOs/ReporteFinancieroResponseDTO.cs)
  contiene `ReporteFinancieroResponseDTO`, `ReporteFinancieroFilaDTO` y `ReporteFinancieroFondoDTO`

**Impacto**

- incumple reglas rectoras ya vigentes del proyecto
- mantiene deuda de transicion dentro del contrato formal del modulo

**Recomendacion**

- alinear todo DTO local que declare `Id` a `GuidIdEntityDTO`
- separar DTOs agrupados en archivos individuales

### 6. Incumplimiento alto - la documentacion local del modulo sigue describiendo una migracion, no el estado tecnico vigente

**Evidencia**

- [README-cobranza-online.md](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Docs/README-cobranza-online.md)
  sigue definiendo el modulo como `en proceso de migracion`
- [README-cobranza-online.md](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Docs/README-cobranza-online.md)
  organiza el documento por `Fase 1`
- [README-cobranza-online.md](../../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline/Docs/README-cobranza-online.md)
  habla de `siguiente fase` en vez de documentar el estado real ya desplegado
- [analisis-cobranza-online.md](../../../../client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/Docs/analisis-cobranza-online.md)
  referencia una ruta legacy que no corresponde a la ubicacion actual
- [analisis-cobranza-online.md](../../../../client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/Docs/analisis-cobranza-online.md)
  describe una estructura `models/pages` que no coincide con el feature real actual

**Impacto**

- otro agente puede razonar con un mapa tecnico desfasado
- la documentacion deja de ser guia operativa fiable para auditoria o remediacion

**Recomendacion**

- reescribir la documentacion tecnica vigente del modulo con rutas, subdominios, contratos y deuda activa reales
- dejar los documentos de migracion como historicos subordinados, no como referencia principal

### 7. Deuda tecnica - el dashboard sigue acoplado a un formulario concreto de `cobranza-nativa`

**Evidencia**

- `cobranza-online-dashboard.ts`
  importa `ChargeTemplateForm` desde `../../cobranza-nativa/core/charge-templates/charge-template-form`
- `cobranza-online-dashboard.ts`
  abre ese formulario directamente desde `CobranzaOnline`

**Impacto**

- difumina la frontera de dominio entre `cobranza-online` y `cobranza-nativa`
- complica evolucion independiente y ownership funcional

**Recomendacion**

- mover esa capacidad a un wrapper compartido aprobado o desacoplarla del dashboard

### 8. Deuda tecnica - no existe cobertura visible de specs frontend del feature

**Evidencia**

- no se localizaron archivos `*.spec.ts` dentro de
  [client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online](../../../../client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online)
- si existen pruebas backend visibles en
  [api/LuxuryApp.Tests/Application/Modules/Contabilidad/CobranzaOnline](../../../../api/LuxuryApp.Tests/Application/Modules/Contabilidad/CobranzaOnline)

**Impacto**

- baja confianza para cambios en dashboard, inspection, exclusions y analysis
- deja sin red de seguridad los flujos que ya mostraron variaciones de fecha y sync

**Recomendacion**

- agregar specs de frontend para dashboard, inspection, exclusions e analysis

### 9. Mejora recomendada - persisten huecos de typing y un literal visible con error en UI

**Evidencia**

- `cobranza-online-dashboard.ts`
  usa `computed<any[]>`
- `cobranza-online-dashboard.ts`
  usa `computed<any>`
- `cobranza-online-dashboard.html`
  usa `$any($event.target).value`
- `cobranza-online-inspection.ts`
  muestra el literal `Histúrico`

**Impacto**

- deja huecos de tipado y un defecto visible menor en la UI

**Recomendacion**

- tipar adapters y eventos residuales
- corregir el literal visible y revisar textos del feature durante la remediacion

---

## Hallazgos Resueltos que ya no deben seguirse reportando como vigentes

- ya existe servicio frontend propio:
  [cobranza-online.service.ts](../../../../client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/cobranza-online.service.ts)
- ya existe archivo SCSS separado para dashboard:
  [cobranza-online-dashboard.component.scss](../../../../client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online/dashboard/cobranza-online-dashboard.component.scss)
- ya existe extraccion parcial de diagnosticos y builders backend
- ya existen pruebas backend visibles del dominio

---

## Riesgos

- **Riesgo funcional:** alto
  - `inspection` puede consultar un periodo equivocado por default
- **Riesgo operativo:** alto
  - sync manual sin defensa backend clara contra concurrencia
- **Riesgo contractual:** alto
  - respuestas `object` y tipos MVC dentro de servicios de aplicacion
- **Riesgo documental:** medio-alto
  - la documentacion local sigue describiendo migracion o estructura legacy
- **Riesgo de regresion frontend:** medio
  - no hay specs visibles del feature

---

## Plan de Correccion por Fases

### Fase 1. Flujo funcional y coherencia de periodo

- [ ] corregir `inspection` para que no arranque fijo en abril
- [ ] validar criterio unico de fecha default entre dashboard, inspection, analysis y reporte financiero
- [ ] corregir literal visible `Histúrico`

### Fase 2. Endurecimiento de sync backend

- [ ] definir defensa backend contra doble sync concurrente
- [ ] tipar respuestas de sync completo, sync contabilidad y sync cobranza
- [ ] revisar consumidores del contrato de sync

### Fase 3. Contratos y DTOs

- [ ] remover `ActionResult<ApiResponseDTO<...>>` de interfaces y servicios de aplicacion
- [ ] alinear DTOs locales con `GuidIdEntityDTO` cuando aplique
- [ ] separar archivos que hoy contienen multiples DTOs

### Fase 4. Documentacion vigente

- [ ] reescribir `README-cobranza-online.md` como documento tecnico actual
- [ ] corregir o sustituir `Docs/analisis-cobranza-online.md`
- [ ] dejar la narrativa de migracion como historico subordinado

### Fase 5. Fronteras frontend y pruebas

- [ ] desacoplar `ChargeTemplateForm` del dashboard o justificar wrapper oficial
- [ ] agregar specs frontend minimos del feature
- [ ] tipar `any` residuales del dashboard

---

## Estatus por Hallazgo

- Hallazgo 1: abierto
- Hallazgo 2: abierto
- Hallazgo 3: abierto
- Hallazgo 4: abierto
- Hallazgo 5: abierto
- Hallazgo 6: abierto
- Hallazgo 7: abierto
- Hallazgo 8: abierto
- Hallazgo 9: abierto



