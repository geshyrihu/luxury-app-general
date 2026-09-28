# Plan de Reestructuracion del Sistema de Convenciones

**Fecha:** 2026-07-29
**Estado:** Propuesta para aprobacion
**Responsable de aprobacion:** Tech Lead
**Alcance:** Reordenar el sistema de convenciones, preservar reglas existentes, eliminar ambiguedad documental y preparar la actualizacion del `conventions-viewer`.

---

## Fase 0. Pre-planeacion

### 0.1 Problem Statement + KPIs

Actualmente, los agentes y desarrolladores consultan un sistema de convenciones con reglas valiosas pero dispersas, rutas inconsistentes y multiples documentos con tono normativo, lo que resulta en interpretaciones diferentes, riesgo de contradicciones y bajo nivel de confianza para ejecutar cambios de forma uniforme entre backend, frontend, flutter, auditoria, UI y estilos.

| KPI | Estado actual | Objetivo |
|---|---|---|
| Fuente rectora identificable | Ambigua | 1 documento rector claro |
| Links/documentos rotos en rutas criticas | Existen | 0 |
| Tipos de tarea con orden de lectura definido | Parcial | 100% |
| Dominios clave con documento especializado | Incompleto | 100% |
| Reglas que crean ambiguedad entre documentos | Existen | 0 |
| Desalineacion entre docs y `conventions-viewer` | Existe | 0 al cierre |

### 0.2 Matriz de Reglas de Negocio del Sistema de Convenciones

**Nivel 1. Invariantes**

- `RN-CONV-001`: `CONVENTIONS.md` es indice rector + reglas minimas universales.
- `RN-CONV-002`: Todo documento especializado deriva de `CONVENTIONS.md` y queda subordinado a el.
- `RN-CONV-003`: Ningun documento secundario crea reglas nuevas por su cuenta.
- `RN-CONV-004`: Ninguna regla nueva entra en vigor si contradice practicas actuales sin plan de migracion aprobado.
- `RN-CONV-005`: Ningun shared o contrato sensible se modifica sin analisis de impacto y aprobacion explicita.

**Nivel 2. Flujo y estados**

- `RN-CONV-010`: Si falta una regla, el agente propone, espera aprobacion y luego se registra.
- `RN-CONV-011`: Toda auditoria de modulo es completa, luego genera plan, luego espera aprobacion y solo despues puede ejecutarse una remediacion.
- `RN-CONV-012`: Toda nueva regla aprobada obliga a actualizar documentos relacionados, indices y `conventions-viewer`.
- `RN-CONV-013`: Si una ubicacion o dominio maestro no esta claro, el agente propone y espera aprobacion antes de crear.

**Nivel 3. Seguridad, control y autorizacion**

- `RN-CONV-020`: Solo el Tech Lead aprueba nuevas reglas o cambios a reglas existentes.
- `RN-CONV-021`: Los agentes no pueden crear reglas paralelas en `README`, prompts o guias auxiliares.
- `RN-CONV-022`: Si una tarea afecta codigo o documentacion sensible, primero se reporta y se propone plan de migracion; no se reubica ni se rompe contrato por iniciativa propia.

**Nivel 4. Validacion de datos y estructura**

- `RN-CONV-030`: Todo documento de convencion debe usar plantilla minima comun.
- `RN-CONV-031`: Toda auditoria debe reportar hallazgos, clasificacion, evidencia, plan por fases y checklist por tarea.
- `RN-CONV-032`: Los endpoints frontend se agrupan por dominio y se registran en `client/angular/src/app/core/constants`.
- `RN-CONV-033`: UI, estilos, frontend, backend, flutter y auditoria deben tener documentos especializados separados.

### 0.3 Riesgos y Pre-Mortem

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Reorganizar docs sin preservar reglas existentes | Perdida de criterio historico | Mapear documento actual -> documento destino antes de mover o resumir |
| Crear demasiados documentos sin indice fuerte | Nueva dispersion | `CONVENTIONS.md` con orden de lectura estricto por tipo de tarea |
| Actualizar docs sin contemplar viewer | Inconsistencia operativa | Tratar `conventions-viewer` como entregable de cierre |
| Reescribir reglas sin separar norma vs apoyo | Ambiguedad continua | Marcar cada documento como rector, especializado, catalogo, guia o apoyo |
| Migrar estructuras sin plan | Riesgo sobre codigo legacy | Toda contradiccion con estado real requiere plan de migracion previo |

---

## 1. Resumen Ejecutivo

Se propone consolidar el sistema de convenciones en una arquitectura documental jerarquica, estricta y orientada por tipo de tarea. `CONVENTIONS.md` dejara de intentar contener todo y pasara a ser el punto rector que define reglas universales, precedencia documental y orden de lectura obligatorio. El detalle tecnico vivira en documentos especializados por dominio: backend, frontend, flutter, auditoria, UI desktop, UI mobile, styles, naming, estructuras, servicios genericos y catalogos de uso.

El objetivo no es eliminar reglas existentes, sino redistribuirlas con claridad, corregir rutas inconsistentes, preservar el conocimiento ya plasmado y hacer que cualquier agente siga el mismo criterio con cero ambiguedad.

---

## 2. Scope y Restricciones

**Incluye**

- Definir arquitectura documental objetivo.
- Definir jerarquia normativa.
- Definir orden de lectura por tipo de tarea.
- Definir dominios documentales obligatorios.
- Definir politica de aprobacion, migracion y mantenimiento.
- Preparar integracion posterior con `conventions-viewer`.

**No incluye en esta fase**

- Reescritura completa inmediata de todos los documentos.
- Migracion directa de codigo legacy.
- Actualizacion del `conventions-viewer` todavia.
- Remediacion de todos los links/documentos rotos todavia.

**Restricciones**

- No perder reglas valiosas ya existentes.
- No inventar ubicaciones ni estructuras donde ya existe criterio real en el proyecto.
- Si una regla nueva contradice practica viva, primero va plan de migracion.

---

## 3. Arquitectura y Diseno Tecnico

### 3.1 Jerarquia normativa

1. `CONVENTIONS.md`
   - Indice rector.
   - Reglas minimas universales.
   - Precedencia documental.
   - Orden de lectura por tipo de tarea.

2. `conventions/**`
   - Documentos especializados y subordinados.
   - No crean reglas nuevas; desarrollan y operacionalizan reglas aprobadas.

3. Documentacion fuente en el codigo
   - `client/angular/src/app/shared/ui/*.md`
   - `client/angular/src/styles/*.md`
   - otros docs tecnicos que deben ser absorbidos o referenciados desde `conventions/`.

4. `conventions-viewer`
   - Capa de visualizacion derivada.
   - Nunca fuente de verdad.

### 3.2 Estructura documental objetivo

```text
conventions/
├── README.md
├── CHANGELOG.md
├── core/
│   ├── rules-universales.md
│   ├── precedencia-documental.md
│   ├── workflow-por-tipo-de-tarea.md
│   ├── governance.md
│   └── template-documentos-convencion.md
├── backend/
│   ├── backend-rules.md
│   ├── backend-module-structure.md
│   ├── backend-namespaces.md
│   ├── backend-prohibitions.md
│   ├── backend-generic-services-catalog.md
│   ├── backend-notifications-signalr.md
│   └── backend-email-conventions.md
├── frontend/
│   ├── frontend-rules.md
│   ├── frontend-feature-structure.md
│   ├── frontend-api-endpoints.md
│   ├── frontend-prohibitions.md
│   ├── frontend-generic-services-catalog.md
│   ├── frontend-state-management.md
│   └── frontend-testing-performance.md
├── flutter/
│   ├── flutter-rules.md
│   ├── flutter-feature-structure.md
│   ├── flutter-prohibitions.md
│   └── flutter-generic-services-catalog.md
├── ui/
│   ├── ui-desktop-rules.md
│   ├── ui-mobile-rules.md
│   ├── ui-usage-catalog.md
│   ├── ui-shared-library-architecture.md
│   └── ui-prohibitions.md
├── styles/
│   ├── styles-rules.md
│   ├── styles-structure.md
│   ├── styles-tokens-theming.md
│   └── styles-prohibitions.md
├── catalogs/
│   ├── naming-conventions.md
│   ├── folder-structure-conventions.md
│   ├── file-structure-conventions.md
│   └── module-master-domain-map.md
├── audit/
│   ├── audit-module-conventions.md
│   ├── audit-checklist.md
│   ├── audit-severity-model.md
│   └── audit-output-template.md
└── operations/
    ├── implementation-checklist.md
    ├── module-documentation-instructions.md
    ├── onboarding.md
    └── scripts-and-hooks.md
```

### 3.3 Orden de lectura por tipo de tarea

**Implementacion backend**

1. `CONVENTIONS.md`
2. `conventions/core/workflow-por-tipo-de-tarea.md`
3. `conventions/backend/backend-rules.md`
4. `conventions/catalogs/naming-conventions.md`
5. `conventions/catalogs/folder-structure-conventions.md`
6. `conventions/backend/backend-module-structure.md`
7. `conventions/backend/backend-generic-services-catalog.md`
8. Documento del modulo si existe

**Implementacion frontend**

1. `CONVENTIONS.md`
2. `conventions/core/workflow-por-tipo-de-tarea.md`
3. `conventions/frontend/frontend-rules.md`
4. `conventions/ui/ui-desktop-rules.md`
5. `conventions/styles/styles-rules.md`
6. `conventions/catalogs/naming-conventions.md`
7. `conventions/frontend/frontend-feature-structure.md`
8. `conventions/frontend/frontend-generic-services-catalog.md`
9. Documento del modulo/feature si existe

**Implementacion flutter**

1. `CONVENTIONS.md`
2. `conventions/core/workflow-por-tipo-de-tarea.md`
3. `conventions/flutter/flutter-rules.md`
4. `conventions/catalogs/naming-conventions.md`
5. `conventions/flutter/flutter-feature-structure.md`
6. `conventions/flutter/flutter-generic-services-catalog.md`
7. Documento del modulo si existe

**Auditoria de modulo**

1. `CONVENTIONS.md`
2. `conventions/core/workflow-por-tipo-de-tarea.md`
3. `conventions/audit/audit-module-conventions.md`
4. Documento del stack correspondiente
5. Documento de naming/estructura aplicable
6. Documento del modulo si existe

**Documentacion o remediacion**

1. `CONVENTIONS.md`
2. Flujo por tipo de tarea
3. Documento del stack
4. Documento de estructura/naming aplicable
5. Documento de auditoria o documentacion
6. Documento del modulo si existe

### 3.4 Mapeo de activos existentes a conservar

| Fuente actual | Destino sugerido |
|---|---|
| `conventions/DESIGN_CONVENTIONS.md` | `conventions/ui/ui-usage-catalog.md` + referencias desde UI desktop/mobile |
| `client/angular/src/app/shared/ui/arquitectura-shared-ui.md` | `conventions/ui/ui-shared-library-architecture.md` |
| `client/angular/src/styles/estandar-hoja-estilos.md` | `conventions/styles/styles-structure.md` + `styles-rules.md` |
| `client/angular/src/styles/DESIGN.md` | `conventions/styles/styles-tokens-theming.md` |
| `conventions/AVAILABLE_FEATURES.md` | `conventions/operations/available-features.md` o mantener en `operations/` |
| `conventions/IMPLEMENTATION_CHECKLIST.md` | `conventions/operations/implementation-checklist.md` |
| `conventions/MODULE_DOCUMENTATION_INSTRUCTIONS.md` | `conventions/operations/module-documentation-instructions.md` |
| `conventions/AGENT_AUDIT_PROTOCOL.md` | absorber en `audit/audit-module-conventions.md` |
| `conventions/PROTOCOLO_COMPLIANCE_CONVENCIONES.md` | absorber partes vigentes en `core/governance.md` |

---

## 4. Backlog de Tasks

- [ ] Crear estructura de carpetas objetivo en `conventions/`.
- [ ] Redactar nueva seccion inicial de `CONVENTIONS.md` con precedencia y orden de lectura.
- [ ] Extraer reglas universales aprobadas a `core/rules-universales.md`.
- [ ] Crear `core/workflow-por-tipo-de-tarea.md`.
- [ ] Consolidar backend en documentos separados por reglas, estructura, namespaces, servicios y prohibiciones.
- [ ] Consolidar frontend en documentos separados por reglas, feature structure, endpoints, servicios y prohibiciones.
- [ ] Crear base documental de flutter.
- [ ] Consolidar UI desktop/mobile/shared y catalogo de uso.
- [ ] Consolidar `styles` y sus reglas/tokens/theming.
- [ ] Crear catalogos de naming/folders/files/module master domain map.
- [ ] Redefinir auditoria completa y plantilla de salida.
- [ ] Crear `CHANGELOG.md` de convenciones.
- [ ] Corregir rutas rotas del indice principal y de `docs/README.md`.
- [ ] Mapear impacto sobre `conventions-viewer` y preparar actualizacion posterior.

---

## 5. Fases de Ejecucion

### Fase 1. Arquitectura rectora

- Reescribir `CONVENTIONS.md` como indice + reglas minimas universales.
- Definir precedencia documental.
- Definir orden de lectura por tipo de tarea.

**Criterio de paso**

- `CONVENTIONS.md` ya no depende de rutas inexistentes.
- La jerarquia normativa queda explicita.

### Fase 2. Consolidacion por dominios

- Crear documentos especializados de backend, frontend, flutter, UI, styles, audit y catalogos.
- Redistribuir contenido valioso de docs actuales y docs embebidos en el codigo.

**Criterio de paso**

- Cada dominio clave tiene documento propio.
- Ningun documento secundario introduce reglas nuevas sin remision al rector.

### Fase 3. Higiene documental

- Corregir links rotos.
- Marcar documentos deprecados o absorberlos.
- Crear `CHANGELOG.md`.

**Criterio de paso**

- 0 referencias criticas a rutas inexistentes en `CONVENTIONS.md` y `docs/README.md`.

### Fase 4. Integracion visual

- Actualizar `conventions-viewer.service.ts`.
- Actualizar HTML/render del viewer.
- Alinear viewer con nueva taxonomia.

**Criterio de paso**

- Viewer muestra la nueva estructura y no contradice Markdown rector.

---

## 6. Criterios de Completitud

- Existe un solo documento rector claro.
- Existe un orden de lectura estricto por tipo de tarea.
- Backend, frontend, flutter, UI, styles, audit y catalogos tienen documentos especializados.
- Los activos actuales valiosos fueron preservados, absorbidos o referenciados.
- No quedan rutas rotas en los indices principales.
- Toda nueva regla o cambio queda trazable en `CHANGELOG.md`.
- `conventions-viewer` queda alineado al cierre.

---

## 7. Riesgos y Mitigaciones

| Riesgo | Mitigacion |
|---|---|
| Duplicar reglas entre rector y especializados | El rector solo resume y deriva; el detalle vive en especializados |
| Mover demasiado contenido y perder contexto | Mantener mapeo fuente -> destino durante la migracion |
| Romper viewer por cambio de taxonomia | Tratar viewer como fase dedicada, no como efecto colateral |
| Introducir reglas nuevas no aprobadas al reescribir | Solo trasladar lo ya acordado o marcar como pendiente de aprobacion |

---

## 8. Dependencias Externas

- Aprobacion del Tech Lead para estructura final.
- Revision manual de conocimiento historico que hoy esta en docs incrustados en codigo.
- Actualizacion posterior del `conventions-viewer`.

---

## 9. Metricas y KPIs de Exito

| Metrica | Meta |
|---|---|
| Rutas criticas rotas en indices principales | 0 |
| Tipos de tarea con orden de lectura definido | 100% |
| Dominios documentales obligatorios cubiertos | 100% |
| Reglas nuevas fuera del sistema oficial | 0 |
| Desalineacion viewer vs markdown rector | 0 al cierre |

---

## 10. Rollback Plan

Si la nueva estructura documental genera confusion o se detecta perdida de contenido:

- detener migracion de documentos secundarios
- conservar `CONVENTIONS.md` anterior como respaldo temporal
- revisar mapeo fuente -> destino
- reintroducir referencias faltantes antes de continuar

---

## 11. Post-Implementation Review

Al cierre se debe revisar:

- si los agentes ya pueden seguir el sistema sin interpretaciones divergentes
- si la auditoria completa y el plan posterior quedaron bien delimitados
- si UI, styles y `shared/ui` quedaron correctamente integrados
- si el viewer refleja la nueva organizacion
- si existen nuevas brechas que requieran un siguiente ciclo de mejora

