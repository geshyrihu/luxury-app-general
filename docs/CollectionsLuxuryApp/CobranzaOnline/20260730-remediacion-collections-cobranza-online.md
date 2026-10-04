# Plan de Remediacion - CobranzaOnline

**Fecha:** 2026-07-30
**Estado:** Pendiente de aprobacion
**Modulo:** `CobranzaOnline`
**Responsable de aprobacion:** Usuario owner de convenciones
**Auditoria origen:** [../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260730-auditoria-cobranza-online.md](../../reporte_maestro/modulos/../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260730-auditoria-cobranza-online.md)
**Backend:** [api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline](../../../api/LuxuryApp.Application/Moduls/CobranzaLuxuryApp/CobranzaOnline)
**Frontend:** [client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online](../../../client/angular/src/app/apps/cobranza.luxuryapp/cobranza-online)

---

## Resumen Ejecutivo

La reauditoria del `2026-07-30` movio la prioridad del modulo. La deuda ya no
es solo estructural: existe un fallo funcional vigente en `inspection`, un
riesgo operativo de sync concurrente, contratos backend anonimos, mezcla de
tipos HTTP en aplicacion, deuda DTO/documental y ausencia de specs frontend.

Este plan reemplaza al enfoque parcial previo y debe tratarse como la base
vigente para una remediacion formal por fases.

---

## Fase 0. Criterios de control

- [ ] no tocar shared sin analisis de impacto y aprobacion
- [ ] no romper contratos serializados sin revisar consumidores
- [ ] no reubicar codigo existente por iniciativa propia
- [ ] si la defensa de sync requiere infraestructura adicional, proponerla antes de ejecutar

---

## Fase 1. Correccion funcional inmediata

- [ ] corregir `inspection` para que no arranque fijo en abril
- [ ] validar politica unica de fecha default entre `dashboard`, `inspection`,
      `analysis` y `reporte-financiero`
- [ ] corregir literal visible `Histúrico`

**Criterio de paso**

- el feature ya no consulta por default un periodo inconsistente
- los textos visibles minimos quedan corregidos

---

## Fase 2. Endurecimiento de sincronizacion backend

- [ ] definir estrategia backend contra ejecuciones concurrentes de sync
- [ ] crear DTO de sync completo
- [ ] crear DTO de sync contabilidad
- [ ] crear DTO de sync cobranza
- [ ] sustituir `ApiResponseDTO<object>` en `AspelSyncEndPoints`
- [ ] revisar impactos sobre consumidores administrativos

**Criterio de paso**

- no quedan respuestas `object` en sync
- existe defensa backend clara contra doble ejecucion simultanea

---

## Fase 3. Contratos de aplicacion y DTOs

- [ ] remover `ActionResult<ApiResponseDTO<...>>` de `Account`, `Balance`,
      `Policy` y `Portfolio`
- [ ] alinear DTOs locales que declaran `Id` con `GuidIdEntityDTO`
- [ ] separar `CobranzaOnlineStatementResponseDTO.cs`
- [ ] separar `ReporteFinancieroResponseDTO.cs`
- [ ] revisar si hay mas DTOs agrupados o con herencia pendiente

**Criterio de paso**

- no quedan tipos MVC/HTTP dentro de la capa de aplicacion
- todo DTO local respeta herencia y `un archivo por DTO`

---

## Fase 4. Documentacion vigente del modulo

- [ ] reescribir `README-cobranza-online.md` como documento tecnico actual
- [ ] corregir o sustituir `Docs/analisis-cobranza-online.md`
- [ ] inventariar subdominios reales: dashboard, analysis, inspection,
      exclusions, sync, statements y reporte financiero
- [ ] dejar la documentacion de migracion como historico subordinado

**Criterio de paso**

- la documentacion local vuelve a describir el estado tecnico real del modulo

---

## Fase 5. Frontera frontend y cobertura

- [ ] revisar integracion de `ChargeTemplateForm`
- [ ] decidir wrapper compartido o desacoplamiento de dominio
- [ ] tipar `pieChartData`, `pieColorScheme` y eventos UI residuales
- [ ] agregar specs frontend para dashboard
- [ ] agregar specs frontend para inspection/history modal
- [ ] agregar specs frontend para exclusions
- [ ] agregar specs frontend para analysis filtros/corte

**Criterio de paso**

- `CobranzaOnline` ya no depende directamente de una UI concreta de otro modulo
- existe cobertura visible minima del feature

---

## Riesgos

- cambiar sync puede afectar consumidores internos si hoy dependen de payload anonimo
- la defensa de concurrencia puede requerir infraestructura o un patron compartido aprobado
- desacoplar `ChargeTemplateForm` requiere validar ownership funcional entre
  `cobranza-online` y `cobranza-nativa`

---

## Cierre esperado

- modulo alineado a las convenciones rectoras vigentes
- flujo funcional base corregido
- sincronizacion endurecida contra concurrencia y contratos fragiles
- documentacion y pruebas listas para futuras auditorias sin falsos positivos


