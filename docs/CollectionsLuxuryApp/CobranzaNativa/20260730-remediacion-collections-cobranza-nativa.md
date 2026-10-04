# Plan de Remediacion - CobranzaNativa

**Fecha:** 2026-07-30
**Estado:** Propuesto para aprobacion
**Modulo:** `CobranzaNativa`
**Responsable de aprobacion:** Usuario owner de convenciones
**Backend:** [api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa](../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa)
**Frontend:** [client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa](../../../client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa)
**Documento rector del modulo:** [cobranza-nativa-module-conventions.md](../../conventions/modules/cobranza-nativa-module-conventions.md)

---

## Resumen Ejecutivo

`CobranzaNativa` si se va a resolver, pero no debe atacarse como si fuera un
modulo comun. Es un subsistema financiero con ledger, cierres, maker-checker,
aprobaciones, conciliacion y compatibilidades externas temporales.

Ademas, el estado documental del modulo no es totalmente plano:

- existe un plan historico de rediseño financiero
- existe un plan mas vigente de separacion y frontera
- existe documentacion maestra backend y frontend
- existen matrices de frontera ya auditadas

Por eso este plan arranca con una fase de linea base para consolidar el estado
real antes de ejecutar cambios sensibles.

---

## Fuentes base para esta remediacion

- [cobranza-nativa-module-conventions.md](../../conventions/modules/cobranza-nativa-module-conventions.md)
- [reglas-negocio-cobranza-nativa.md](../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/reglas-negocio-cobranza-nativa.md)
- [reglas-negocio-cobranza.md](../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/reglas-negocio-cobranza.md)
- [01-plan-ejecucion-separacion-cobranza-nativa.md](../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaNativa/Docs/Architecture/01-plan-ejecucion-separacion-cobranza-nativa.md)
- [02-matriz-operativa-front-cobranza-nativa.md](../../../client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa/docs/02-matriz-operativa-front-cobranza-nativa.md)
- [ORGANIZACION-FRONTAL-CNATIVA-2026-07-26.md](../../../client/angular/src/app/apps/cobranza.luxuryapp/cobranza-nativa/docs/ORGANIZACION-FRONTAL-CNATIVA-2026-07-26.md)
- `COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md`

---

## Principios de ejecucion

- no tocar shared sin analisis de impacto y aprobacion
- no romper contratos publicos sensibles sin inventario de consumidores
- no romper invariantes financieras del modulo
- no saltarse ledger, cierres, maker-checker o reglas de idempotencia
- no mezclar de nuevo el core nativo con `Aspel`, `COI`, `Live`, `Local` u `Online`
- toda fase debe cerrar con checklist y evidencia verificable

---

## Fase 0. Linea base y consolidacion de estado real

**Objetivo**

Congelar una fotografia vigente y confiable del modulo antes de ejecutar cambios
funcionales o estructurales.

**Por que existe esta fase**

La documentacion actual contiene capas historicas y vigentes. Antes de mover o
endurecer codigo, hay que validar que sigue activo, que ya fue implementado y
que solo permanece como referencia historica.

**Tareas**

- [ ] consolidar inventario vigente de subdominios backend bajo `Core/`
- [ ] consolidar inventario vigente de zonas frontend: `entry`, `core`,
      `configuration`, `contracts`, `interfaces`, `onboarding`, `docs`
- [ ] validar que piezas historicas del plan financiero ya no se usaran como
      mapa principal de carpetas o rutas
- [ ] confirmar que el plan vigente de ejecucion es el de separacion y frontera
- [ ] abrir bitacora de remediacion con estatus por fase

**Criterio de paso**

- existe una base vigente aprobada y ya no hay dudas sobre que documento manda

---

## Fase 1. Blindaje de frontera y compatibilidad externa

**Objetivo**

Terminar de cerrar la frontera entre `CobranzaNativa` y cualquier compatibilidad
externa temporal.

**Tareas backend**

- [ ] revisar `Contracts/ExternalCompatibility/` y confirmar que toda semantica
      externa vive solo ahi
- [ ] detectar DTOs, endpoints o servicios del core que todavia hablen en
      lenguaje `Aspel`, `COI`, `Live`, `Local` u `Online`
- [ ] proponer encapsulacion o migracion de cualquier remanente detectado

**Tareas frontend**

- [ ] validar que `core/` no consuma contratos de compatibilidad externa sin
      wrapper o adaptador justificado
- [ ] revisar `configuration/billing-config` como compatibilidad temporal
- [ ] revisar `entry/cobranza-nativa-wrapper` para asegurar que no presente
      compatibilidad externa como flujo base
- [ ] revisar imports cruzados con `cobranza-online` o `aspel-cobranza-haus`

**Criterio de paso**

- el core nativo queda limpio y la compatibilidad externa queda encapsulada y
  visible como tal

---

## Fase 2. Endurecimiento financiero del core

**Objetivo**

Validar y endurecer las invariantes financieras mas sensibles del modulo sin
redefinir su bounded context.

**Subdominios minimos a revisar**

- [ ] `Charges`
- [ ] `Payments`
- [ ] `LateFees`
- [ ] `Statements`
- [ ] `Ledger`
- [ ] `Approvals`
- [ ] `PeriodClosures`
- [ ] `CollectionCases`
- [ ] `Reconciliation`

**Checks obligatorios**

- [ ] no existe cruce `CustomerId` o `PropertyId` en flujos de cargo, pago,
      asignacion y ajuste
- [ ] la idempotencia sigue activa donde aplica
- [ ] el ledger sigue siendo la verdad auditable del estado de cuenta
- [ ] no hay bypass de cierres de periodo
- [ ] no hay bypass del maker-checker
- [ ] los casos de cobranza legal mantienen referencia a deuda real y no quedan
      desacoplados del estado financiero

**Criterio de paso**

- las invariantes financieras sensibles quedan verificadas y cualquier ruptura
  potencial queda en backlog controlado, no oculta

---

## Fase 3. Alineacion backend y frontend por subdominio

**Objetivo**

Alinear el mapa operativo entre backend y frontend para que cada subdominio se
entienda, se mantenga y se pruebe como una unidad funcional clara.

**Tareas**

- [ ] mapear subdominios backend con su feature frontend equivalente
- [ ] detectar huecos donde exista backend sin contraparte clara en frontend, o
      frontend sin contrato backend claro
- [ ] revisar nombres semanticos y ownership por subdominio
- [ ] validar que los features listados en `cobranza-nativa.routing.ts` sigan
      correspondiendo al core real del modulo
- [ ] revisar si algun feature debe reclasificarse como `configuration`,
      `contracts` o `onboarding`

**Criterio de paso**

- existe correspondencia clara por subdominio entre ambos stacks

---

## Fase 4. UI, mobile y experiencia operativa

**Objetivo**

Resolver la experiencia operativa del modulo sin romper la frontera del dominio
ni los patrones visuales del proyecto.

**Tareas**

- [ ] revisar wrapper principal y estructura de entradas
- [ ] revisar desktop y mobile en features criticos:
      `charges`, `payments`, `native-statement`, `approvals`, `ledger`,
      `period-closures`, `members`, `property-fines`
- [ ] revisar modales criticos de pago, cargos, multas y aprobaciones
- [ ] corregir textos de UI que todavia mezclen discurso nativo con
      compatibilidad externa
- [ ] revisar styles locales del modulo y separar deuda real vs override justificado

**Criterio de paso**

- el modulo se presenta como sistema nativo, no como hibrido improvisado

---

## Fase 5. Contratos, documentación y gobernanza

**Objetivo**

Dejar el modulo documentado y gobernable para que el siguiente agente no vuelva
al caos documental ni mezcle piezas ya separadas.

**Tareas**

- [ ] actualizar documentacion tecnica vigente del backend
- [ ] actualizar documentacion operativa del frontend
- [ ] marcar que documentos quedan historicos y cuales son vigentes
- [ ] alinear bitacora de remediacion con estatus real por fase
- [ ] actualizar `conventions-viewer` al final, no antes

**Criterio de paso**

- cualquier agente puede entrar al modulo y saber que documento manda y donde
  empieza cada bounded context

---

## Fase 6. Validacion tecnica y cierre

**Objetivo**

Cerrar la remediacion con evidencia verificable, no solo con percepcion de orden.

**Tareas**

- [ ] validar compilacion backend del modulo y dependencias afectadas
- [ ] validar TypeScript del frontend afectado
- [ ] revisar pruebas existentes y agregar faltantes criticas si la fase lo requiere
- [ ] verificar que no se reintrodujo mezcla entre core nativo y compatibilidad
      externa
- [ ] cerrar bitacora con pendientes residuales claros

**Criterio de paso**

- remediacion cerrada con evidencia tecnica minima y lista de pendientes residuales controlados

---

## Riesgos de ejecucion

- usar documentos historicos como si fueran mapa vigente y reabrir decisiones ya cerradas
- tocar pagos, ledger o cierres sin respetar invariantes financieras
- recontaminar `core/` con semantica de compatibilidad externa
- corregir UX o rutas visuales sin validar mobile, modales y flujos reales

---

## Checklist maestro

- [ ] Fase 0 aprobada
- [ ] Fase 1 aprobada
- [ ] Fase 2 aprobada
- [ ] Fase 3 aprobada
- [ ] Fase 4 aprobada
- [ ] Fase 5 aprobada
- [ ] Fase 6 aprobada

---

## Entregable esperado

Al terminar este plan, `CobranzaNativa` debe quedar:

- separado por bounded context real
- financieramente endurecido en sus invariantes criticas
- alineado entre backend y frontend
- documentado con jerarquia clara
- preparado para futuras auditorias y cambios sin volver a mezclar nativo con
  compatibilidad externa



