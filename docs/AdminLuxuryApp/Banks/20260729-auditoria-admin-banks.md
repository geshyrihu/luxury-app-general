# Auditoria Completa - Banks

**Fecha:** 2026-07-29
**Modulo:** `Banks`
**Backend:** [api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks](../../../../api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks)
**Frontend:** [client/angular/src/app/apps/admin.luxuryapp/catalogos-generales/banks](../../../../client/angular/src/app/apps/admin.luxuryapp/catalogos-generales/banks)
**Estado:** Auditoria completa
**Resultado formal:** Requiere plan de correccion por fases

---

## Resumen Ejecutivo

`Banks` funciona como buen modulo piloto para validar la nueva arquitectura de
convenciones porque su estructura base si coincide con el patron oficial, pero
la auditoria encontro incumplimientos reales en contratos, estructura,
encoding, documentacion y testing.

La nueva estructura de convenciones **si fue suficiente** para auditar el modulo
sin depender del legacy como autoridad principal. Los hallazgos mas sensibles
estan en:

- residuos anormales dentro del modulo backend
- incoherencias entre documentacion y rutas reales
- archivo DTO frontend contaminado con `undefined;`
- coverage de pruebas insuficiente para logica real del modulo

---

## Alcance

Se reviso:

- estructura backend
- endpoints y contratos backend
- servicio de aplicacion y mapper
- estructura frontend
- contratos frontend
- endpoints frontend registrados
- pruebas existentes
- documentacion del modulo

No se ejecuto remediacion. No se ejecutaron builds ni tests en esta auditoria.

---

## Hallazgos

### 1. Incumplimiento critico - residuos anormales dentro del modulo backend

**Evidencia**

- existen archivos vacios no convencionales:
  - `DTOs/sedP5ornE`
  - `EndPoints/sedKgT1fl`

**Impacto**

- rompe la estructura minima obligatoria del modulo
- contamina auditorias futuras
- sugiere residuos temporales o ediciones incompletas dentro de un modulo vivo

**Criterio**

- incumple estructura exacta y control de archivos por modulo

**Recomendacion**

- clasificar origen
- retirarlos mediante cambio controlado
- validar que no existan residuos similares en modulos hermanos

### 2. Incumplimiento alto - documentacion del modulo no corresponde con las rutas reales

**Evidencia**

- `README.md` documenta rutas `api/banks/*`
- [BanksEndPoints.cs](../../../../api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks/EndPoints/BanksEndPoints.cs) expone `api/admin/catalogs/banks`

**Impacto**

- documentacion del modulo no sirve como referencia confiable
- puede inducir a clientes, QA o agentes a consumir rutas incorrectas

**Recomendacion**

- actualizar README del modulo
- validar consistencia entre README, endpoint catalog frontend y backend real

### 3. Incumplimiento alto - contaminacion directa de contrato frontend

**Evidencia**

- `banks-add-or-edit.dto.ts` contiene `undefined;`

**Impacto**

- el contrato local de la feature esta contaminado con una linea espuria
- puede indicar residuos de merge, generacion defectuosa o edicion incompleta

**Recomendacion**

- retirar la linea espuria
- auditar si hay archivos semejantes en interfaces hermanas

### 4. Incumplimiento alto - coverage de pruebas frontend no cubria la logica real del modulo

**Evidencia**

- `bank-list.spec.ts` solo verifica creacion del componente
- `bank-form.spec.ts` valida estructura del form, pero no cubre:
  - `onLoadData`
  - `onSubmit`
  - `bankUniquenessValidator`
- el backend si cuenta con [BankAppServiceTests.cs](../../../../api/LuxuryApp.Tests/Application/Modules/AdminLuxuryApp/Banks/BankAppServiceTests.cs), aunque en auditoria se detecto deriva respecto a la infraestructura actual de pruebas

**Impacto**

- baja capacidad para detectar regresiones en CRUD, validaciones y contratos
- el frontend no cumple el espiritu de auditoria completa en testing
- el backend requiere mantenimiento de sus pruebas para que sigan siendo ejecutables

**Recomendacion**

- agregar pruebas de flujo y validaciones del frontend
- alinear pruebas backend al estado real de `ApiResponseDTO`, `IMapper` y helpers de test

### 5. Deuda tecnica - encoding roto en backend

**Evidencia**

- textos con mojibake en:
  - [BanksEndPoints.cs](../../../../api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks/EndPoints/BanksEndPoints.cs)
  - [BankAppService.cs](../../../../api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks/Services/BankAppService.cs)
  - [IBankAppService.cs](../../../../api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks/Interfaces/IBankAppService.cs)
  - [BankDTO.cs](../../../../api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks/DTOs/BankDTO.cs)
  - [BankAddOrEditDTO.cs](../../../../api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks/DTOs/BankAddOrEditDTO.cs)

**Impacto**

- documentacion embebida, mensajes y metadatos pierden calidad
- puede afectar lectura, OpenAPI o herramientas de soporte

**Recomendacion**

- incluir el modulo en una pasada controlada de normalizacion de encoding

### 6. Deuda tecnica - uso de AutoMapper dentro del modulo

**Evidencia**

- [BankAppService.cs](../../../../api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks/Services/BankAppService.cs) depende de `IMapper`
- [BankMapper.cs](../../../../api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks/Mapping/BankMapper.cs) define perfil del modulo

**Impacto**

- no rompe por si solo el modulo actual, pero entra en una zona sensible de stack
- si el proyecto decide cerrar o migrar mappings automaticos, este modulo queda en alcance

**Recomendacion**

- no modificar de inmediato si no existe regla final de migracion
- registrar `Banks` como modulo impactado en un futuro plan de alineacion de mapping

### 7. Deuda tecnica - el catalogo de endpoints frontend mantiene alias legacy duplicado

**Evidencia**

- ownership canonico del modulo:
  - [admin.endpoints.ts](../../../../client/angular/src/app/core/constants/admin.endpoints.ts)
- alias legacy compartido:
  - [shared.endpoints.ts](../../../../client/angular/src/app/core/constants/shared.endpoints.ts)

**Impacto**

- no rompe el modulo actual, pero mantiene duplicidad de ownership
- aumenta riesgo de drift documental y de consumo inconsistente

**Recomendacion**

- conservar mientras exista plan de migracion
- impedir nuevos consumos desde alias legacy

### 8. Mejora recomendada - naming inconsistente entre archivo y clase de endpoints

**Evidencia**

- archivo: [BanksEndPoints.cs](../../../../api/LuxuryApp.Application/Moduls/AdminLuxuryApp/CatalogosGenerales/Banks/EndPoints/BanksEndPoints.cs)
- clase: `BankEndPoints.cs`

**Impacto**

- no bloquea ejecucion, pero afecta consistencia y busqueda semantica

**Recomendacion**

- alinear nombre de archivo y clase bajo el criterio oficial que se adopte

---

## Fortalezas observadas

- la estructura frontend si respeta el patron `raiz + desktop + mobile + interfaces`
- el endpoint frontend canonico si esta registrado en
  [admin.endpoints.ts](../../../../client/angular/src/app/core/constants/admin.endpoints.ts)
- el frontend consume componentes `@ui/*` en lugar de imports directos de librerias de UI
- el backend si separa `EndPoints`, `DTOs`, `Interfaces` y `Services`
- existe documentacion local del modulo, aunque hoy este desalineada

---

## Riesgos

- **Riesgo de ruptura por shared o contrato:** medio
  - existe alias legacy compartido en endpoints frontend, por lo que una limpieza
    apresurada podria afectar otros consumidores
- **Riesgo operativo:** medio
  - documentacion incorrecta puede causar integraciones equivocadas
- **Riesgo de calidad:** alto
  - testing insuficiente y residuos anormales reducen confianza en cambios futuros

---

## Plan de Correccion por Fases

### Fase 1. Higiene estructural y documental

- [ ] clasificar y retirar archivos residuales `sed*` bajo cambio controlado
- [ ] corregir `undefined;` en DTO frontend
- [ ] alinear README del modulo con rutas reales
- [ ] corregir naming evidente que no implique ruptura transversal

### Fase 2. Calidad tecnica local del modulo

- [ ] normalizar encoding del modulo
- [ ] revisar naming consistente de endpoints, servicios y contratos
- [ ] validar si hay mas contratos o documentos locales con drift

### Fase 3. Cobertura de pruebas

- [ ] agregar pruebas frontend de `onLoadData`, `onSubmit` y validador custom
- [ ] agregar pruebas backend de duplicado, not found, create, update y paginado

### Fase 4. Alineacion cross-module y migracion controlada

- [ ] evaluar impacto del alias legacy `EndpointsShared.Banks`
- [ ] decidir si entra a plan de migracion general de endpoints
- [ ] registrar el modulo en cualquier futura migracion de mapping si esa regla se formaliza

---

## Checklist por Tarea

- [ ] validar ownership real del modulo backend
- [ ] validar ownership real del modulo frontend
- [ ] corregir residuos no convencionales
- [ ] corregir contratos contaminados
- [ ] corregir documentacion
- [ ] corregir naming inconsistente
- [ ] ejecutar auditoria de encoding
- [ ] ampliar pruebas frontend
- [ ] ampliar pruebas backend
- [ ] revisar impacto de alias legacy

---

## Estatus Final del Piloto

El modulo `Banks` confirma que el nuevo sistema de convenciones ya puede
producir una auditoria completa y accionable sin depender del legacy como guia
principal. La siguiente iteracion recomendada es usar este reporte para ajustar
detalles finos del marco y despues repetir el mismo ejercicio con otro modulo.



