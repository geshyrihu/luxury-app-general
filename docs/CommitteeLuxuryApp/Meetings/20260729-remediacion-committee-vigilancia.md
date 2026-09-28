# Plan de Remediacion - ComiteVigilancia

**Fecha:** 2026-07-30
**Estado:** Remediacion ejecutada y re-auditoria local aprobada con validacion automatizada parcial por entorno
**Modulo:** `ComiteVigilancia`
**Responsable de aprobacion:** Usuario owner de convenciones
**Auditoria origen:** [../../../docs/CommitteeLuxuryApp/Meetings/20260729-auditoria-committee-vigilancia.md](../../reporte_maestro/modulos/../../../docs/CommitteeLuxuryApp/Meetings/20260729-auditoria-committee-vigilancia.md)
**Backend:** [api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Comite/ComiteVigilancia](../../../api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Comite/ComiteVigilancia)
**Frontend:** [client/angular/src/app/apps/legal.luxuryapp/comite-vigilancia](../../../client/angular/src/app/apps/legal.luxuryapp/comite-vigilancia)

---

## Estado de Ejecucion

- `2026-07-30`: se ejecuto la remediacion local del modulo
- `2026-07-30`: la re-auditoria local confirmo cierre funcional y estructural del modulo
- validacion confirmada:
  - scanner de mojibake del area remediada en cero
- validacion bloqueada o parcial por entorno:
  - `dotnet test` no pudo leer `C:\Users\geshyrihu\AppData\Roaming\NuGet\NuGet.Config`
  - `vitest` desvio la corrida a Compodoc del workspace
  - `tsc --noEmit` reporto errores globales preexistentes fuera del modulo en `customer-location`

---

## Fase 0. Pre-planeacion

### 0.1 Problem Statement + KPIs

El modulo `ComiteVigilancia` mantiene operacion base, pero arrastra
incumplimientos reales en documentacion, contratos backend, typing frontend,
encoding y pruebas. La remediacion debe corregir esos puntos sin tocar shared,
sin asumir migraciones transversales y sin romper consumidores existentes.

| KPI | Estado actual | Objetivo |
|---|---|---|
| README alineado con rutas reales | Si | 100% |
| Contratos backend anonimos o con entidad directa | Corregidos localmente | 0 |
| `any` en frontend del modulo | Corregidos localmente | 0 |
| Mojibake en archivos del modulo | 0 en area remediada | 0 |
| Pruebas locales del modulo | Presentes | Cobertura minima de escenarios clave |
| Temas transversales mal clasificados como hallazgo local | Depurados | 0 |

### 0.2 Matriz de Reglas de Negocio del Modulo

**Nivel 1. Invariantes**

- `RN-CV-001`: El modulo debe respetar la estructura oficial backend y frontend
  ya aprobada.
- `RN-CV-002`: No se modifica `shared`, DTOs comunes, interfaces compartidas ni
  catalogos sensibles sin analisis de impacto y aprobacion.
- `RN-CV-003`: La remediacion no puede inventar nueva estructura fuera del
  patron actual del dominio `OperationsLuxuryApp` y `legal.luxuryapp`.

**Nivel 2. Flujo y estados**

- `RN-CV-010`: Primero se audita, luego se arma plan, luego se aprueba y solo
  despues se ejecuta.
- `RN-CV-011`: Toda correccion documental debe quedar alineada con backend y
  frontend reales.
- `RN-CV-012`: Cualquier hallazgo transversal detectado durante la ejecucion se
  reporta; no se expande alcance por iniciativa propia.

**Nivel 3. Seguridad y control**

- `RN-CV-020`: No se reubica codigo existente por iniciativa propia.
- `RN-CV-021`: No se cambian contratos publicos sin revisar impacto y definir
  si requieren plan de migracion.
- `RN-CV-022`: Si una alineacion grande depende de una decision global, se
  detiene y se espera aprobacion.

### 0.3 Riesgos y Pre-Mortem

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Endurecer contratos backend rompe consumidores ocultos | Ruptura cross-module | revisar consumo antes de cambiar contratos publicos |
| Sustituir `any` en frontend destapa errores actuales | Falla de compilacion local | tipar por fases y corregir usos inmediatos |
| Corregir encoding genera diff ruidoso | Ruido y revision dificil | limitar correccion al modulo auditado |
| Mezclar remediacion local con migracion transversal de mapping | desvio de alcance | dejar AutoMapper solo documentado salvo regla global aprobada |

---

## 1. Resumen Ejecutivo

Se propone una remediacion por fases de `ComiteVigilancia`, priorizando
primero la higiene documental y el tipado local, despues el endurecimiento de
contratos backend y la correccion de encoding, y por ultimo la cobertura minima
de pruebas.

El plan evita repetir el error del reporte anterior: no tratar como falla local
obligatoria aquello que en realidad depende de una definicion transversal del
proyecto.

---

## 2. Scope y Restricciones

**Incluye**

- actualizar `README.md` del modulo
- corregir `any` locales del frontend
- definir tipos frontend para el listado global
- definir DTOs/ViewModels explicitos para respuestas backend hoy debiles
- corregir mojibake del modulo
- agregar pruebas frontend y backend del modulo
- documentar `AutoMapper` solo como tema transversal pendiente

**No incluye**

- migracion general de AutoMapper
- cambios a `shared`
- reubicacion de estructura del dominio `legal.luxuryapp`
- cambios globales de namespaces o carpetas

**Restricciones**

- no tocar shared sin aprobacion
- no romper contratos serializados sin revisar impacto
- no reubicar codigo existente fuera del modulo por iniciativa propia
- si aparece impacto transversal, se reporta y se congela esa parte

---

## 3. Arquitectura y Diseno Tecnico

### 3.1 Principios de remediacion

1. corregir primero lo local y verificable
2. no aprovechar la remediacion para meter refactors no auditados
3. toda correccion debe quedar trazable al hallazgo del reporte
4. cualquier asunto transversal se documenta como migracion futura

### 3.2 Objetivo tecnico por capa

**Backend**

- contratos explicitos y sin `object` anonimo
- respuestas de create/update con ownership claro del modulo
- documentacion y metadata legibles

**Frontend**

- tipos locales sin `any`
- respuesta de `committees` con interface local definida
- cobertura minima de componentes principales

**Documentacion**

- README del modulo util y confiable
- plan y reporte sin falsos positivos heredados

### 3.3 Decision de manejo de temas sensibles

| Tema | Decision |
|---|---|
| `AutoMapper` en el modulo | no se migra por defecto en esta remediacion; se documenta como tema transversal |
| estructura actual de `legal.luxuryapp` | no se reubica por iniciativa propia |
| cambios de contrato backend | solo con analisis de impacto dentro del plan |

---

## 4. Backlog de Tasks

- [x] actualizar `README.md` del modulo con rutas reales
- [x] tipar `ComiteVigilancia.id` como `string`
- [x] reemplazar `any` en `comite-vigilancia-form.ts`
- [x] reemplazar `any` en `comite-vigilancia-list.ts`
- [x] crear interface local para `ComitesList`
- [x] definir DTO/ViewModel para `GetAllCommitteesAsync`
- [x] revisar si `AddAsync` y `UpdateAsync` deben devolver DTO local en lugar de entidad
- [x] corregir mojibake del backend del modulo
- [x] corregir mojibake del frontend del modulo
- [x] agregar pruebas frontend del form y list
- [x] agregar pruebas backend de escenarios principales
- [ ] registrar decision final sobre `AutoMapper`

---

## 5. Fases de Ejecucion

### Fase 1. Higiene documental y typing frontend

- actualizar README con rutas reales y descripcion real de operaciones
- cambiar `id: any` a tipo concreto
- retirar `any` de componentes del modulo
- definir interface local para el resultado de `committees`

**Criterio de paso**

- el README ya no contradice los endpoints reales
- el frontend del modulo ya no depende de `any` para sus flujos principales

### Fase 2. Contratos backend del modulo

- crear DTO/ViewModel explicito para `GetAllCommitteesAsync`
- revisar retorno de `AddAsync` y `UpdateAsync`
- aplicar ajuste de contrato solo si el impacto esta controlado

**Criterio de paso**

- el servicio ya no publica `IEnumerable<object>`
- cualquier cambio de contrato queda documentado y validado

### Fase 3. Encoding y calidad del codigo

- corregir mojibake del backend
- corregir mojibake del frontend
- ejecutar scanner oficial del area tocada

**Criterio de paso**

- no hay mojibake visible en los archivos del modulo

### Fase 4. Cobertura minima obligatoria

- agregar pruebas frontend del formulario
- agregar pruebas frontend del listado
- agregar pruebas backend para:
  - `GetByIdAsync`
  - `AddAsync`
  - `UpdateAsync`
  - `DeleteByIdAsync`
  - `SendCredentialsAsync`

**Criterio de paso**

- el modulo tiene pruebas minimas sobre sus flujos clave

### Fase 5. Registro de temas transversales

- dejar documentado si `AutoMapper` entra a un plan global
- dejar documentado que el reporte anterior quedo reemplazado por esta version

**Criterio de paso**

- no quedan ambiguedades entre hallazgo local y decision transversal

---

## 6. Criterios de Completitud

- el README refleja rutas y comportamiento reales
- el frontend local ya no usa `any` en sus contratos y flujos principales
- `GetAllCommitteesAsync` ya no expone `IEnumerable<object>` como contrato
- el mojibake del modulo fue corregido
- existen pruebas minimas relevantes del modulo
- cualquier tema transversal pendiente queda documentado sin disfrazarlo de
  incumplimiento local

---

## 7. Riesgos y Mitigaciones

| Riesgo | Mitigacion |
|---|---|
| consumidores ocultos de contratos actuales | revisar referencias antes de endurecer respuestas |
| errores de compilacion al reemplazar `any` | tipar por capas y corregir consumidores inmediatos |
| correccion de encoding demasiado amplia | limitarse al modulo auditado |
| intentos de meter migracion global en remediacion local | sacar del alcance y registrar aparte |

---

## 8. Dependencias Externas

- aprobacion del usuario owner de convenciones para ejecutar la remediacion
- disponibilidad de entorno para validar build y pruebas
- decision posterior si se desea abrir migracion transversal de mapping

---

## 9. Metricas y KPIs de Exito

| Metrica | Meta |
|---|---|
| README desalineado | 0 |
| contratos backend anonimos | 0 |
| `any` en frontend del modulo | 0 |
| archivos del modulo con mojibake visible | 0 |
| componentes clave sin pruebas | 0 como estado base |
| falsos positivos heredados en la documentacion del modulo | 0 |

---

## 10. Rollback Plan

Si alguna remediacion genera impacto inesperado:

- revertir solo la fase local afectada
- conservar cambios documentales correctos que no introduzcan riesgo
- registrar el punto de quiebre en el mismo plan
- escalar si el problema demuestra dependencia transversal no detectada

---

## 11. Post-Implementation Review

Al cierre se debe revisar:

- si `ComiteVigilancia` ya quedo alineado a las convenciones nuevas
- si los cambios de contrato fueron suficientes y seguros
- si surgio una nueva regla candidata a formalizacion
- si existe otro modulo con el mismo patron de debilidad contractual o typing

## Cierre de re-auditoria

- `2026-07-30`: el modulo queda alineado de forma sustancial con las convenciones vigentes
- el flujo real de edicion ya resuelve valor visible en `select` y `autocomplete`
- los DTOs del directorio ya cumplen `un archivo por DTO`
- el DTO del directorio que declara `Id` ya hereda de `GuidIdEntityDTO`
- queda pendiente solo la decision transversal sobre `AutoMapper` y el cierre de validacion automatizada cuando el entorno lo permita


