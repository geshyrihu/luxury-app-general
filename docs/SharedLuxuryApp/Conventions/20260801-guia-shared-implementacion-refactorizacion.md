# Guía de Implementación y Refactorización Guiada por Entrevista de Modelo de Negocio

**Fecha de creación:** 2026-08-13
**Autor:** Agente de implementación (dinámica acordada con el dueño del producto)
**Estado:** Vigente
**Deriva de:** [CONVENTIONS.md](../../CONVENTIONS.md) §4.5 / §4.6 y [guides-creation-protocol.md](../../conventions/operations/guides-creation-protocol.md)

---

## 1. Objetivo

Definir el protocolo de trabajo cuando el dueño del producto (no experto en
programación) presenta una idea nueva o un proyecto actual con sus comentarios, y
el agente debe guiarlo como en una entrevista para una aplicación: analizar el
**modelo de negocio** y tomar las **mejores decisiones antes de programar**.

**Aplica a:**
- proyectos **nuevos** (módulos o funcionalidades inexistentes)
- proyectos **existentes** (refactorización, mejora o extensión de módulos actuales)

**Dos modos de entrada según el tipo de proyecto (dinámica acordada):**

1. **Proyecto nuevo** (incluye proyectos con base iniciada pero sin terminar, como
   entidades creadas sin módulo de aplicación): se plantea la idea, y sobre ella se
   cuestiona qué se quiere y cuál es el alcance. Las convenciones aportan **solo la
   estructura y los modos de programar**; el contenido (reglas de negocio, actores,
   flujos) sale de la conversación guiada.
2. **Proyecto existente:** se **audita el estado actual** y se da retroalimentación
   de qué está mal y qué falta, siguiendo el sistema rector. A esa base se le suman
   los **requerimientos nuevos** que el dueño siempre acompaña.

El agente detecta en qué modo está cada proyecto y lo declara explícitamente antes
de empezar; no se mezclan los modos en silencio.

**Alcance del ciclo completo:** la dinámica no se detiene en el análisis; recorre
todo el flujo oficial hasta la ejecución:

```
Entrevista de negocio → Documento de análisis → FASE 0 → Plan por fases con
checklist por tarea → Aprobación del dueño → Ejecución por fases → Auditoría/cierre
```

**Aprobación:** el dueño del producto es la única persona a cargo y el único
aprobador en todas las etapas (no hay Tech Lead intermedio). El agente ejecuta y
el dueño decide.

---

## 2. Contexto arquitectónico obligatorio

Todo trabajo nuevo o refactor debe ubicarse primero en el sistema rector y en la
arquitectura vigente:

- **Backend:** `api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/` con subcarpetas
  `EndPoints/`, `Services/`, `Interfaces/`, `Mappings/`, `DTOs/`.
- **Frontend:** `client/angular/src/app/apps/[modulo].luxuryapp/` con subcarpetas
  `desktop/`, `mobile/`, `interfaces/` y `docs/`.
- **Fase 0 y reglas de negocio:** [fase-0-business-rules-discovery.md](../../conventions/operations/fase-0-business-rules-discovery.md)
  y [discovery-questionnaire-template.md](../../conventions/operations/discovery-questionnaire-template.md).
- **Plan formal:** [plan-creation-protocol.md](../../conventions/operations/plan-creation-protocol.md).
- **Auditoría:** [audit-module-conventions.md](../../conventions/audit/audit-module-conventions.md).

La guía no crea reglas nuevas: ordena la conversación para descubrir reglas del
negocio que luego se formalizan por los cauces oficiales.

---

## 3. Regla de oro

**Primero se entiende el negocio, después se decide, y solo entonces se programa.**

Nada de abrir el editor hasta que la matriz de reglas de negocio, los actores y
los flujos estén aprobados en lenguaje del dueño del producto. Después de esa
aprobación, la programación avanza **por fases del plan**, y cada fase se cierra
y aprueba antes de comenzar la siguiente.

---

## 4. Alcance permitido

El agente puede:

- hacer preguntas de descubrimiento de negocio (una a la vez, en lenguaje simple)
- aclarar términos técnicos sin tecnicismos innecesarios
- proponer alternativas con pros/contras y una recomendación
- detectar inconsistencias en el modelo de negocio (reglas contradictorias, flujos sin salida)
- estimar riesgos e impacto de decisiones antes de programar
- producir artefactos de análisis: matriz de reglas, actores, flujos, decisiones
- señalar qué datos faltan y por qué son importantes antes de seguir

## 5. Alcance prohibido

El agente **no** puede:

- programar antes de aprobación del modelo de negocio (Fase de entrevista)
- asumir reglas de negocio que el dueño no confirmó
- inventar APIs, librerías, rutas, DTOs o estructuras
- modificar shared, contratos o `SelectItem`/`SelectItemEnum` sin análisis de impacto y aprobación
- desviarse hacia tecnicismos de implementación cuando aún se está modelando negocio
- cerrar la entrevista con lagunas sin marcar (cada laguna debe quedar visible)
- pasar a la siguiente fase del plan sin la aprobación del dueño de la fase anterior
- saltarse la documentación obligatoria de cualquiera de las etapas (análisis, FASE 0, plan, auditoría)

---

## 6. Zonas de alta sensibilidad

- dinero / contabilidad / cobranza
- contratos externos y APIs públicas
- seguridad y autorización por rol
- email/cédula/identificadores únicos
- flujos con estados finales irreversibles (eliminar, rechazar, contratar)
- integración con módulos existentes (Empleados, Notificaciones, Archivos)

Cuando la conversación toque una zona sensible, el agente debe detenerse y
confirmar la regla con el dueño antes de darla por buena.

---

## 7. Patrón de diagnóstico (la entrevista)

La entrevista se hace en **fases**, y cada fase se completa antes de pasar a la
siguiente. El agente hace **una pregunta por vez** y reformula en lenguaje simple.

**Modo de trabajo (acordado con el dueño):** el agente **propone** y el dueño
**confirma o corrige**. El agente no espera que el dueño conteste preguntas
abiertas abiertas: redacta la propuesta (objetivo, actores, matriz de reglas,
flujos, decisiones) y el dueño la valida punto por punto, ajustando lo que no
coincida con su visión del negocio.

**Aplicación por modo:**
- **Modo nuevo:** las fases A-E descubren el contenido (qué quiere, alcance). Las
  convenciones solo definen estructura y modos de programar; no anticipan reglas
  de negocio. Si existe base iniciada (entidades, código parcial), se lee como
  contexto previo y se completa, no se reescribe desde cero.
- **Modo existente:** antes de A-E se hace el **barrido de auditoría** del estado
  actual (estructura, contratos, seguridad, flujos, UI, deuda) y se produce la
  retroalimentación. Luego A-E se enfoca en los **requerimientos nuevos** que el
  dueño acompaña.

### Fase A — Problema y visión
- ¿Qué problema resuelve esto? ¿Para quién?
- ¿Qué pasa hoy si no existe esta funcionalidad?
- ¿Cómo se ve el éxito? (qué debería ocurrir al terminar)

### Fase B — Actores y roles
- ¿Quiénes usan esto? (nombres de puestos, no usuarios técnicos)
- ¿Qué puede hacer cada actor y qué NO?
- ¿Hay acciones que solo un tipo de usuario puede hacer?

### Fase C — Reglas de negocio (4 niveles)
- Invariantes: ¿qué nunca puede cambiar o repetirse?
- Flujos y estados: ¿cómo avanza un registro? ¿qué pasa de A a B? ¿hay pasos obligatorios?
- Seguridad: ¿quién autoriza qué? ¿qué datos ve cada rol?
- Validación: ¿qué datos son obligatorios, únicos, con formato?
- Negativos: ¿qué pasa si se duplica, se cruza, se solapa o se repite?

### Fase D — Decisiones de diseño
- ¿Se crea módulo nuevo o se extiende uno existente?
- ¿Qué módulos actuales se tocan? ¿Qué se reutiliza?
- ¿Qué queda fuera del alcance por ahora? (y se documenta)

### Fase E — Verificación de datos faltantes
- Antes de pasar a plan, se listan los datos que aún no se tienen y su impacto.
- Si un dato faltante cambia una decisión, se regresa a la fase correspondiente.

---

## 8. Protocolo de intervención

1. El dueño presenta la idea o proyecto con sus comentarios.
2. El agente **clasifica el modo**: proyecto nuevo (idea/base sin terminar) o
   proyecto existente (módulo en producción). Declara el modo al dueño.
3. El agente confirma el objetivo en una oración (parafraseo).

**Si es proyecto nuevo (modo descubrimiento):**
4. Se ejecuta el patrón de diagnóstico (Fase A → E) en modo **proponer y confirmar**,
   usando las convenciones solo como estructura/modos de programar, no como contenido.
5. Se produce un **documento de análisis**: objetivo, actores, matriz de reglas de
   negocio por niveles, flujos, decisiones, lagunas y riesgos.

**Si es proyecto existente (modo auditoría + requerimientos):**
4. Se audita el estado actual del módulo siguiendo el sistema rector y se produce la
   **retroalimentación**: qué está mal, qué falta, qué cumple.
5. Se suman los **requerimientos nuevos** que el dueño acompaña y se integran al
   diagnóstico como entradas del mismo nivel que los hallazgos.

**En ambos modos continúa igual:**
6. El dueño aprueba o corrige el documento (análisis o retro + requerimientos).
7. Se ejecuta **FASE 0** (matriz de reglas formal, 4 niveles) y se documenta.
8. Se produce el **plan por fases con checklist por tarea** y el dueño lo aprueba.
9. La **ejecución** se hace por fases; cada fase se cierra y aprueba antes de la siguiente.
10. Al terminar, se ejecuta la **auditoría** del alcance y se documenta el cierre.
11. El dueño aprueba el cierre. Todo el ciclo queda documentado en las ubicaciones oficiales.

---

## 9. Patrón técnico recomendado (una vez aprobado el modelo)

- Seguir §4.6 de `CONVENTIONS.md`: Discovery → FASE 0 → Plan → Auditoría.
- Reutilizar catálogos oficiales: [Backend Generic Services Catalog](../../conventions/backend/backend-generic-services-catalog.md),
  [Frontend Generic Services Catalog](../../conventions/frontend/frontend-generic-services-catalog.md),
  [Application Roles Catalog](../../conventions/operations/application-roles-catalog.md).
- Respetar naming y estructura: [naming-conventions.md](../../conventions/catalogs/naming-conventions.md)
  y [folder-structure-conventions.md](../../conventions/catalogs/folder-structure-conventions.md).
- No tocar shared sin análisis de impacto y aprobación explícita.

---

## 10. Reglas por capa

- **Backend:** 1 DTO por archivo; DTO con `Id` hereda `GuidIdEntityDTO`; enums con
  `[Display]` en español; `[FromForm]` en multipart; autorización por política.
- **Frontend:** standalone + `OnPush`; signals; `@if`/`@for`; tokens CSS; `<app-icon>`;
  guards por rol; endpoints y rutas por constantes; diálogos vía `DialogHandlerService`.
- **Común:** backend y frontend deben corresponderse (dominio, DTOs, estados, nombres).

---

## 11. Validaciones obligatorias antes de dar por buena la entrevista

- [ ] ¿El objetivo quedó en una oración aprobada por el dueño?
- [ ] ¿Se identificaron todos los actores y qué puede/no puede hacer cada uno?
- [ ] ¿La matriz de reglas de negocio cubre los 4 niveles (invariante, flujo, seguridad, validación)?
- [ ] ¿Se exploraron los casos negativos (duplicado, cruce, solapamiento, repetición)?
- [ ] ¿Se listaron explícitamente los datos faltantes y su impacto?
- [ ] ¿Se separó el alcance (qué queda fuera y por qué)?
- [ ] ¿El dueño aprobó el documento de análisis?

---

## 12. Señales de alto riesgo para escalar / detener

- el dueño quiere que la solución toque dinero, seguridad o contratos externos → confirmar regla antes de continuar
- dos reglas de negocio se contradicen → no decidir por el dueño; exponer el conflicto
- se propone modificar shared o `SelectItem` existente → parar y marcar necesidad de análisis de impacto
- un flujo no tiene salida clara (estado del que no se puede salir) → preguntar qué debería pasar
- el alcance crece durante la conversación → listar lo nuevo y proponer corte
- el dueño pide programar antes de aprobar el modelo → recordar la regla de oro

---

## 13. Checklist operativo de la sesión

- [ ] parafraseé el objetivo y el dueño lo confirmó
- [ ] usé una pregunta por vez, en lenguaje simple, en modo proponer y confirmar
- [ ] recorrí las fases A-E sin saltar
- [ ] cubrí los 4 niveles de reglas de negocio
- [ ] documenté lagunas y datos faltantes
- [ ] el dueño aprobó el documento de análisis
- [ ] FASE 0 documentada y aprobada
- [ ] plan por fases con checklist por tarea aprobado
- [ ] cada fase ejecutada y aprobada antes de la siguiente
- [ ] auditoría/cierre del alcance documentado y aprobado

---

## 14. Formato de entrega

La dinámica produce **una cadena de documentos**, cada uno en su ubicación oficial:

1. **Documento de análisis** (salida de la entrevista) en
   `docs/modulos-nuevos/[nombreModulo]/` (si es módulo nuevo) o en la documentación
   del módulo existente, con:
   - objetivo (una oración)
   - actores y matriz de permisos preliminar
   - matriz de reglas de negocio (4 niveles) con los casos negativos
   - flujos (diagrama ASCII simple)
   - decisiones tomadas y alternativas descartadas
   - lagunas y datos faltantes
   - riesgos y zonas sensibles tocadas
2. **FASE 0** en `docs/modulos-nuevos/[modulo]/02-business-rules-analysis.md`
   (o en la auditoría si es módulo existente).
3. **Plan por fases con checklist por tarea** en `docs/plans/YYYYMMDD-{modulo}-remediacion-plan.md`.
4. **Auditoría/cierre** en `docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md`.

---

## 15. Referencias

- [CONVENTIONS.md](../../CONVENTIONS.md) §4.5, §4.6, §5.9
- [fase-0-business-rules-discovery.md](../../conventions/operations/fase-0-business-rules-discovery.md)
- [discovery-questionnaire-template.md](../../conventions/operations/discovery-questionnaire-template.md)
- [plan-creation-protocol.md](../../conventions/operations/plan-creation-protocol.md)
- [guides-creation-protocol.md](../../conventions/operations/guides-creation-protocol.md)
- [../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md](./../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md) (índice de guías)
