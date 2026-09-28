# Plan de Remediacion - Banks

**Fecha:** 2026-07-29
**Estado:** En ejecucion
**Modulo:** `Banks`
**Responsable de aprobacion:** Tech Lead
**Auditoria origen:** [../../../docs/AdminLuxuryApp/Banks/20260729-auditoria-admin-banks.md](../../reporte_maestro/modulos/../../../docs/AdminLuxuryApp/Banks/20260729-auditoria-admin-banks.md)
**Backend:** [api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks](../../../api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks)
**Frontend:** [client/angular/src/app/apps/admin.luxuryapp/catalogos-generales/banks](../../../client/angular/src/app/apps/admin.luxuryapp/catalogos-generales/banks)

---

## Fase 0. Pre-planeacion

### 0.1 Problem Statement + KPIs

El modulo `Banks` cumple parcialmente la estructura esperada del proyecto, pero
presenta incumplimientos reales en higiene estructural, namespace, contratos,
documentacion, encoding y pruebas. La remediacion debe corregir esos puntos sin
romper contratos sensibles ni tocar shared por intuicion.

| KPI | Estado actual | Objetivo |
|---|---|---|
| Archivos residuales dentro del modulo | Existen | 0 |
| Contratos frontend contaminados | Existen | 0 |
| Namespace/carpeta coherentes | Parcial | 100% |
| README alineado con rutas reales | No | 100% |
| Mojibake en archivos del modulo | Existe | 0 |
| Pruebas de flujo relevantes | Insuficientes | Cobertura de escenarios clave |
| Duplicidad legacy de endpoints | Existe | documentada y bajo control |

### 0.2 Matriz de Reglas de Negocio del Modulo

**Nivel 1. Invariantes**

- `RN-BANK-001`: El modulo debe respetar la estructura oficial backend y
  frontend ya aprobada.
- `RN-BANK-002`: No se modifica `shared`, DTOs comunes, interfaces compartidas
  ni catalogos sensibles sin analisis de impacto y aprobacion.
- `RN-BANK-003`: La remediacion no puede introducir una ubicacion nueva fuera
  del patron actual del dominio `AdminLuxuryApp`.

**Nivel 2. Flujo y estados**

- `RN-BANK-010`: La remediacion se ejecuta por fases y cada fase actualiza
  estatus y checklist.
- `RN-BANK-011`: Toda correccion documental debe quedar alineada con backend y
  frontend reales.
- `RN-BANK-012`: Cualquier hallazgo transversal detectado durante la ejecucion
  se reporta; no se expande alcance por iniciativa propia.

**Nivel 3. Seguridad y control**

- `RN-BANK-020`: No se elimina o reubica codigo existente fuera del modulo por
  iniciativa propia.
- `RN-BANK-021`: El alias legacy de endpoints no se rompe sin evaluar
  consumidores y sin plan de migracion si aplica.
- `RN-BANK-022`: Si se confirma impacto sobre otros modulos, la ejecucion se
  detiene y se escale para aprobacion.

### 0.3 Riesgos y Pre-Mortem

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Limpiar residuos y tocar un artefacto aun referenciado | Ruptura inesperada | validar referencias antes de retirar |
| Corregir namespaces o naming y afectar registros/reflexion | falla de compilacion | aplicar cambios acotados y validar build del stack |
| Cambiar endpoints legacy compartidos sin mapa de uso | ruptura cross-module | no tocar alias legacy en esta remediacion base |
| Corregir encoding y alterar archivos sin control | ruido o diff excesivo | limitarse al modulo `Banks` y usar scanner oficial |
| Ampliar pruebas sin dobles adecuados | pruebas fragiles | cubrir primero escenarios de negocio clave |

---

## 1. Resumen Ejecutivo

Se propone una remediacion por fases del modulo `Banks`, priorizando primero la
higiene estructural y documental, luego la consistencia tecnica local y por
ultimo la ampliacion de pruebas. El plan evita cambios de alto riesgo sobre
shared o aliases legacy que puedan afectar otros modulos sin una evaluacion
previa.

La intencion no es rehacer el modulo, sino dejarlo alineado al sistema de
convenciones vigente con una base mas segura para futuras migraciones
transversales.

---

## 2. Scope y Restricciones

**Incluye**

- limpieza de residuos locales del modulo
- correccion de contrato frontend contaminado
- alineacion de README con rutas reales
- correccion de namespace/naming local cuando no implique ruptura transversal
- normalizacion de encoding dentro del modulo
- ampliacion de pruebas frontend y backend del modulo
- documentacion del riesgo legacy de endpoints y mapping

**No incluye**

- migracion general de AutoMapper
- remediacion global de aliases legacy en endpoints
- cambios a shared o contratos comunes fuera del modulo
- reestructuracion de otros modulos hermanos

**Restricciones**

- no tocar shared sin aprobacion
- no romper contratos serializados
- no reubicar codigo existente fuera del modulo por iniciativa propia
- si aparece impacto transversal, se reporta y se congela esa parte

---

## 3. Arquitectura y Diseno Tecnico

### 3.1 Principios de remediacion

1. corregir primero lo local y deterministico
2. no aprovechar la remediacion para meter refactors no auditados
3. toda correccion debe quedar trazable al hallazgo del reporte
4. cualquier asunto transversal se documenta como migracion futura

### 3.2 Objetivo tecnico por capa

**Backend**

- carpeta y namespace coherentes
- sin residuos no convencionales
- documentacion local consistente con rutas reales
- encoding limpio en comentarios, mensajes y metadata

**Frontend**

- contratos locales sin contaminacion
- consumo de endpoint canonico intacto
- pruebas sobre flujos y validaciones reales

**Documentacion**

- README del modulo util y confiable
- riesgos legacy explicitados sin ocultarlos

### 3.3 Decision de manejo de temas sensibles

| Tema | Decision |
|---|---|
| `EndpointsShared.Banks` | no se elimina en esta remediacion; solo se documenta |
| AutoMapper en `Banks` | no se migra en esta fase; se registra como impacto futuro |
| cambios fuera de `Banks` | fuera de alcance salvo evidencia critica |

---

## 4. Backlog de Tasks

- [ ] verificar referencias de archivos residuales `sed*`
- [ ] retirar residuos locales del modulo si no tienen uso
- [ ] corregir `undefined;` en DTO frontend
- [ ] validar si el patron de namespace observado es local o transversal
- [ ] evaluar si alinear nombre archivo/clase de endpoints cabe en esta fase
- [ ] actualizar README con rutas y descripcion reales
- [ ] corregir mojibake del modulo con tooling oficial
- [ ] agregar pruebas frontend de carga, submit y validador custom
- [ ] agregar pruebas backend de CRUD y paginado
- [ ] documentar decision sobre alias legacy y mapping

---

## 5. Fases de Ejecucion

### Fase 1. Higiene estructural y contratos locales

- validar que los archivos `sed*` no tengan referencias
- retirar residuos locales
- corregir `undefined;` en `banks-add-or-edit.dto.ts`
- validar patrones de namespace antes de corregir algo transversal

**Criterio de paso**

- no quedan residuos no convencionales en el modulo
- frontend contracts compilan limpios
- backend mantiene coherencia con el patron vivo del proyecto

### Fase 2. Alineacion documental y encoding

- actualizar README del modulo
- alinear rutas documentadas con backend y frontend reales
- ejecutar normalizacion de encoding limitada al modulo

**Criterio de paso**

- README ya no contradice endpoints reales
- no hay mojibake visible en archivos del modulo

### Fase 3. Testing funcional minimo obligatorio

- ampliar `bank-list.spec.ts`
- ampliar `bank-form.spec.ts`
- agregar o ampliar pruebas backend del servicio

Escenarios minimos esperados:

- carga por id
- submit create/update
- validacion `bankUniquenessValidator`
- duplicado de `ShortName`
- `BANK_NOT_FOUND`
- listado paginado con filtro basico

**Criterio de paso**

- pruebas relevantes del modulo cubren flujos y validaciones clave
- no quedan solo pruebas de creacion superficial

### Fase 4. Cierre y registro de temas transversales

- documentar que el alias legacy de endpoints sigue activo por compatibilidad
- documentar que AutoMapper queda fuera de alcance actual
- actualizar estatus final del plan y del reporte si aplica

**Criterio de paso**

- el modulo queda alineado localmente
- los riesgos transversales quedan explicitados y no escondidos

---

## 6. Criterios de Completitud

- el modulo ya no contiene archivos residuales extraÃ±os
- el DTO frontend ya no contiene contaminacion espuria
- el modulo no arrastra falsos positivos de namespace por patrones transversales del proyecto
- el README refleja rutas y comportamiento reales
- el mojibake del modulo fue corregido
- existen pruebas funcionales minimas relevantes
- cualquier riesgo transversal pendiente queda documentado

---

## 7. Riesgos y Mitigaciones

| Riesgo | Mitigacion |
|---|---|
| residuos con referencia oculta | buscar referencias antes de retirar |
| namespace afecta wiring | validar build backend del alcance tocado |
| pruebas fallan por dobles incompletos | ajustar mocks antes de ampliar alcance |
| correccion de encoding genera ruido | limitar correccion al modulo auditado |
| alias legacy tiene consumidores desconocidos | no alterar alias en esta fase |

---

## 8. Dependencias Externas

- aprobacion del Tech Lead para ejecutar la remediacion
- disponibilidad de entorno para validar build y pruebas
- decision posterior si se desea abrir migracion transversal de endpoints o mapping

---

## 9. Metricas y KPIs de Exito

| Metrica | Meta |
|---|---|
| archivos residuales dentro del modulo | 0 |
| contratos frontend contaminados | 0 |
| rutas README vs backend real | 100% consistentes |
| archivos del modulo con mojibake visible | 0 |
| pruebas superficiales sin flujo real | reducidas a 0 como unica cobertura |
| temas transversales no documentados | 0 |

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

- si `Banks` ya puede usarse como modulo de referencia alineado
- si las convenciones nuevas siguen siendo suficientes para auditar y remediar
- si surgio una nueva regla candidata a formalizacion
- si existe patron repetido en otros modulos que amerite una auditoria dirigida


