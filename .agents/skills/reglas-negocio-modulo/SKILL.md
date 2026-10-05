---
name: reglas-negocio-modulo
description: >-
  Extrae y documenta las Reglas de Negocio (RN) realmente implementadas en un
  módulo LuxuryApp que YA EXISTE (backend .NET + frontend Angular). Lee código
  real (AppServices, entidades, validators, endpoints, formularios reactivos),
  las clasifica en los 4 niveles jerárquicos oficiales (Invariante, Flujo,
  Seguridad, Validación) con numeración RN-[MOD]-NNN, las verifica en vivo con
  playwright-cli, dibuja un diagrama con Archify sourced de código real, y
  escribe el documento final con el sistema visual de DOCUMENT-DESIGN-STANDARD
  (emojis, colores, tablas, Mermaid). Es la contraparte retrospectiva de
  business-rules-discovery-phase-0 (que es para módulos NUEVOS, antes de
  programar) — esta skill es para módulos que ya tienen código corriendo. Usar
  cuando el usuario diga "documenta las reglas de negocio de [módulo]",
  "extrae las RN de [módulo]", "genera el business-rules de [módulo]
  existente", "qué reglas de negocio tiene [módulo]", "catálogo/matriz de
  reglas de negocio de [módulo]", o pida identificar qué validaciones/reglas
  aplica un módulo ya implementado, aunque no mencione "RN" ni "business
  rules" explícitamente.
---

# 📐 Reglas de Negocio de Módulo (LuxuryApp)

Skill de **extracción retrospectiva**: dado un módulo que ya existe en
producción o en desarrollo activo, lee el código real (back + front), encuentra
las reglas de negocio que de hecho aplica — no las que debería aplicar — y las
documenta en un catálogo numerado, verificado y presentable.

## Regla de oro

> Toda RN que aparezca en el documento final tuvo que **verse en el código** o
> **confirmarse en pantalla con playwright-cli**. Ninguna RN se infiere de un
> nombre de método, un comentario, o "así suelen funcionar estos sistemas". Si
> una regla parece existir pero no se pudo confirmar, se documenta como
> `⏳ PENDIENTE: confirmar con el equipo` — nunca se completa con una suposición
> razonable, por obvia que parezca.

## Posición respecto al canon (no duplicar)

Esta skill no inventa taxonomía ni formato — orquesta piezas que ya existen:

- **Los 4 niveles y la numeración `RN-[MOD]-NNN`** vienen de
  [`business-rules-discovery-phase-0.md` §0.2](../../../conventions/operations/business-rules-discovery-phase-0.md)
  — esa es la fuente oficial de la taxonomía, aunque ese documento la usa para
  módulos *nuevos* (antes de programar). Aquí se reusa igual, pero las RN se
  descubren leyendo código *existente*, no en una entrevista de discovery.
- **El formato exacto de la matriz RN** (tabla por nivel, bloques de 10,
  columnas) viene de
  [`DOCUMENT-DESIGN-STANDARD.md` §3.7](../../../conventions/DOCUMENT-DESIGN-STANDARD.md).
  Todo el resto del documento (título, metadata, panorama, emojis, colores de
  Mermaid) también sigue ese estándar — no se improvisa un formato propio.
- **La ubicación y nombre del archivo** reusan el tipo de documento
  `business-rules` que ya existe en la estructura plana de módulo
  (`CONVENTIONS.md` §4.6): `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-business-rules-[modulo]-[submodulo].md`.
  No se crea un "Documento #8" nuevo en §4.7 — esto evita tocar
  `CONVENTIONS.md` para algo que ya tiene un lugar definido.
- **La disciplina de verificación** (código real + UI real con
  `playwright-cli`, nunca inventar, `PENDIENTE` explícito) es la misma que usa
  la skill hermana [`guia-usuario-modulo`](../guia-usuario-modulo/SKILL.md).
  Si esa skill ya corrió para este módulo, reusa sus hallazgos de UI en vez de
  repetir la exploración desde cero.
- Los Documentos #2 (Técnica) y #7 (Auditoría) de `CONVENTIONS.md` §4.7 ya
  piden una sección de reglas de negocio — esta skill no los reemplaza. El
  documento que produce es la fuente detallada que esos dos documentos pueden
  citar/enlazar en vez de duplicar su propia matriz resumida.

## Cuándo NO usar esta skill

- **Módulo que todavía no existe en código** → usa
  [`business-rules-discovery-phase-0.md`](../../../conventions/operations/business-rules-discovery-phase-0.md)
  directamente (discovery por entrevista, no por lectura de código).
- **Documento orientado a negocio/soporte sin jerga técnica** → usa
  [`guia-usuario-modulo`](../guia-usuario-modulo/SKILL.md) (Documento 6). Esta
  skill sí usa nombres de clases, DTOs y rutas — es técnico-ejecutiva, no para
  un usuario final sin contexto de código.

## Proceso

### 1. Localizar el módulo

Confirmar rutas reales antes de leer nada — no asumir que un módulo es "solo
backend" o "solo frontend" sin buscar en ambos lados:

```bash
# Backend
find api/LuxuryApp.Application/Modules -maxdepth 1 -iname "*[Modulo]*"
# Frontend
find appsweb/angular/src/app/modules -maxdepth 1 -iname "*.luxuryapp" | grep -i [modulo]
```

Antes de leer una línea de código, busca si el módulo ya tiene RN numeradas en
*cualquier* documento existente — no solo en un archivo tipo `business-rules`
dedicado. En módulos con historia de planes/auditorías, lo normal es
encontrar `RN-[MOD]-NNN` repartidas entre varios documentos (`plan-*.md`,
`auditoria-*.md`, el `README.md` del módulo):

```bash
grep -rn "RN-[A-Z]\{2,4\}-[0-9]\{3\}" docs/[ModuleLuxuryApp]/[Submodulo]/ 2>/dev/null
```

(Toda la documentación de módulo —README incluido— vive hoy en
`docs/[ModuleLuxuryApp]/[Submodulo]/`, no dentro de `api/` ni
`appsweb/angular/`: migración de 2026-10-05, `CONVENTIONS.md` §4.7. El código
sigue en `api/`/`appsweb/angular/` — solo la documentación se centralizó.)

Si encuentras RN previas:
- **Usa el mismo prefijo** `[MOD]` que ya está en uso — no inventes uno nuevo
  aunque el nombre del módulo sugiera otra abreviatura.
- **Continúa la numeración** donde se quedó cada nivel (bloque de 10); no
  reinicies desde `001`.
- **Clasifica cada RN previa en dos grupos** antes de incluirla en el
  documento final:
  - **Ya implementada y verificable** — el documento donde aparece cita
    `archivo:línea` de código real, o la marca explícitamente como aplicada
    (ej. con `✅`). Estas sí entran al catálogo de este documento: confírmalas
    releyendo el código citado (puede haber cambiado desde que se escribió) y
    agrégales verificación en UI si corresponde.
  - **Propuesta, aún no construida** — aparece en un plan o discovery pero sin
    evidencia de código, o el propio documento dice que requiere aprobación
    antes de implementarse. Estas **no** entran al catálogo de reglas vigentes
    de este documento — van en una sección aparte de "Backlog de RN
    propuestas, no implementadas" con un enlace al documento de origen. Tratar
    una RN propuesta como si ya rigiera sería inventar comportamiento, la
    misma falta que prohíbe la Regla de Oro.

  **La etiqueta que trae el documento de origen no es el dato — el código es
  el dato.** Un plan puede decir "Borrador, no se implementa hasta aprobar" y
  estar describiendo una intención de hace semanas que alguien ya construyó
  después, sin volver a ese plan a actualizarlo. Ocurrió exactamente así en la
  primera corrida real de esta skill: un bloque de ~35 RN etiquetado "propuesta
  sin aprobar" ya estaba implementado y conectado en producción cuando se leyó
  el código. Por eso **toda RN previa se reclasifica por lo que el código hace
  hoy, nunca por lo que el documento de origen dice que hace** — la etiqueta
  del documento solo decide dónde buscar primero, no el veredicto final.

El documento final debe anotar en Metadata de qué documentos previos proviene
cada bloque de RN (plan, auditoría, discovery), para que quede trazable que
esta no es la primera vez que se numeraron.

### 2. Leer el código real

**Backend (.NET):**
- Entidades (`Domain/Entities/`) — invariantes de los constructores, campos
  obligatorios, constraints de EF Core (`[Required]`, `MaxLength`, índices
  únicos).
- AppServices/Services — toda validación explícita antes de persistir
  (`if (...) throw`, FluentValidation, guard clauses), transiciones de estado
  permitidas/bloqueadas.
- Endpoints/Controllers — `[Authorize]`, roles exigidos, filtros por tenant
  (`CustomerId`).
- Enums de estado y sus transiciones válidas.

**Frontend (Angular):**
- Formularios reactivos — `Validators.*`, validadores custom, mensajes de
  error asociados.
- Guards de ruta — qué rol necesita para entrar a cada pantalla.
- Componentes — lógica que deshabilita botones, oculta secciones, o bloquea
  acciones según rol/estado (esto es tan "regla de negocio" como una
  validación de backend, y suele perderse si solo se lee el backend).

No es necesario leer cada archivo del módulo — basta seguir el flujo principal
(crear → leer → actualizar → el resto de acciones que el propio código
exponga) hasta que cada RN que vaya a aparecer en el documento tenga una
fuente concreta: archivo + línea.

### 3. Extraer candidatas a RN y clasificar en los 4 niveles

Para cada regla encontrada, pregúntate en qué nivel cae (definiciones completas
en `business-rules-discovery-phase-0.md` §0.2):

| Nivel | Pregunta de clasificación | Dónde suele vivir en código |
|---|---|---|
| **1 — Invariante de Dominio** | ¿Es verdad siempre, sin excepción, aunque cambien otros requerimientos? | Constructor de entidad, constraint de BD |
| **2 — Flujo y Estados** | ¿Describe una transición de estado o un orden temporal? | Enum de estado + método que lo cambia |
| **3 — Seguridad/Autorización** | ¿Decide quién puede hacer qué? | `[Authorize]`, guard de ruta, filtro por rol/tenant |
| **4 — Validación de Datos** | ¿Es un formato, límite o constraint de un campo? | `Validators.*`, `[MaxLength]`, regex |

Numera `RN-[MOD]-NNN` en bloques de 10 por nivel (Nivel 1: `001-009`, Nivel 2:
`010-019`, Nivel 3: `020-029`, Nivel 4: `030-039`, y así sucesivamente si un
nivel necesita más de un bloque). `[MOD]` son 3-4 letras del módulo — revisa si
el módulo ya tiene un prefijo usado en RN previas (README, Fase 0, auditorías)
antes de inventar uno nuevo.

Para roles en Nivel 3, usa únicamente los del
[Catálogo de Roles](../../../conventions/operations/application-roles-catalog.md)
— nunca un rol inventado o una paráfrasis.

### 4. Comparar validaciones front vs back

Construye una tabla: cada RN de Nivel 3 o 4 que tenga equivalente en ambos
lados, marcando:
- ✅ **Duplicada correctamente** (front valida para UX, back valida para
  integridad — ambos presentes)
- 🟥 **Hueco** (solo un lado valida → riesgo: el otro canal de acceso, API
  directa o bug de UI, se la salta)
- 🟡 **Inconsistente** (front y back validan cosas distintas para el mismo
  campo/acción)

Esta tabla suele ser el hallazgo más valioso del documento — no la omitas
aunque alargue el proceso.

### 5. Generar el diagrama con Archify

Invoca la skill `archify` (modo `workflow` si el módulo gira en torno a un
proceso con estados, o `architecture` si gira en torno a componentes/permisos)
pidiéndole explícitamente evidencia de código real (archivo + línea citada),
igual que hace `guia-usuario-modulo`. El diagrama debe mostrar los puntos
donde se aplican las RN de Nivel 2 (transiciones) o Nivel 3 (quién puede hacer
qué), no ser un diagrama genérico de arquitectura.

Si un nodo o transición necesita más contexto del que cabe en una línea, pon
el detalle en una tarjeta/card del propio nodo, no en un `note` largo — un
`note` extenso puede disparar el validador de layout de Archify
(`label-route-clearance`) y tumbar la generación.

### 6. Verificar en vivo con playwright-cli

Las RN de Nivel 3 y 4 que son visibles en pantalla (botón deshabilitado, campo
bloqueado, mensaje de validación, sección oculta por rol) deben confirmarse
navegando la UI real, no solo leyendo el componente:

1. Confirmar que el dev server responde (`curl -s -o /dev/null -w "%{http_code}"
   http://localhost:4200`, y el backend si aplica).
2. Usar las credenciales del módulo si están documentadas; si no, el fallback
   genérico de dev: `admin` / `Hwtc00--`.
3. Para cada RN candidata a verificar en UI: navegar al flujo correspondiente,
   intentar la acción que la regla debería bloquear o permitir, y capturar
   evidencia (screenshot o texto exacto del mensaje de error).
4. Las RN de Nivel 1 (invariantes de dominio/BD) normalmente **no** son
   observables en UI — está bien marcarlas como verificadas solo por código,
   sin forzar una exploración de pantalla que no les corresponde.
5. Si se creó un registro de prueba para ejercitar una transición, eliminarlo
   al terminar — salvo que el propio módulo prohíba borrar ese estado por
   diseño (ej. un registro "aprobado" inmutable). En ese caso no lo fuerces
   por SQL directo: déjalo, anótalo explícitamente en el documento final (qué
   se creó, con qué identificador) y repórtaselo al usuario para que decida
   cómo limpiarlo.

**Nota operativa:** un overlay de error (HMR de un módulo no relacionado, un
toast, un modal residual) puede interceptar los clics de Playwright aunque el
flujo que estás probando no tenga nada que ver con él. Si un clic no surte
efecto sin error visible, verifica si hay un overlay tapando el elemento antes
de asumir que la regla falló — quitarlo con `page.evaluate` y reintentar con
un click nativo suele bastar.

**Modo de falla:** si el dev server no responde, las credenciales fallan, o
`playwright-cli` no puede completar una verificación necesaria, **detener y
reportarlo como bloqueo** — nunca entregar el documento con esa RN marcada
como verificada sin haberlo hecho. Dice exactamente qué falló (puerto,
credencial, paso) para poder reintentar.

### 7. Escribir el documento

Sigue la estructura de
[`DOCUMENT-DESIGN-STANDARD.md`](../../../conventions/DOCUMENT-DESIGN-STANDARD.md),
usando las secciones que aplican a este tipo de documento (no las 11
completas — esto no es un plan):

1. 🎯 Título + Subtítulo (ej: "📐 Reglas de Negocio: Candidates" / subtítulo
   = qué tensión resuelve tener esto documentado)
2. 📋 Metadata (módulo, rutas back+front, si viene de un discovery previo o es
   la primera vez, fecha, autor)
3. 🗺️ Panorama en un vistazo (diagrama Mermaid simple: conteo de RN por nivel,
   o enlace al diagrama Archify del paso 5)
4. 📌 Resumen Ejecutivo (cuántas RN por nivel, cuántas verificadas en UI vs.
   solo en código, cuántas quedaron `PENDIENTE`, cuántos huecos front/back
   encontrados)
5. 📐 Matriz de Reglas de Negocio completa — formato exacto de
   `DOCUMENT-DESIGN-STANDARD.md` §3.7, una tabla por nivel, agregando dos
   columnas propias de esta skill: **Evidencia** (`archivo:línea` back y/o
   front) y **Verificado** (`✅ código` / `✅ UI` / `⏳ PENDIENTE`)
6. 🔗 Validaciones Front vs Back (tabla del paso 4)
7. ⚠️ Hallazgos (huecos, inconsistencias, RN que el código sugiere pero no se
   pudo confirmar)
8. 🏁 Cierre (siguiente paso: si hay huecos críticos, quién debe decidir)

La plantilla de `CONVENTIONS.md` §4.6 da la ruta
`docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-business-rules-[modulo]-[submodulo].md`.
Antes de usarla literal, mira qué nombres ya existen en esa carpeta
(`ls docs/[ModuleLuxuryApp]/[Submodulo]/`): si todos los documentos reales del
módulo usan un patrón más corto (`YYYYMMDD-[tipo]-[submodulo].md`, sin repetir
el nombre del módulo), sigue ese precedente real en vez de la plantilla — es
la misma regla madre de "respetar naming/estructura/ubicación" aplicada a la
carpeta concreta, no a la plantilla en abstracto. Si encuentras esta
discrepancia, no la corrijas en `CONVENTIONS.md` por tu cuenta — repórtala al
usuario como observación, igual que cualquier otro hallazgo de convención
desalineada.

Si ya existe un archivo de ese tipo para este módulo, **actualízalo** —
preservando o archivando la versión de discovery si la hubo— en vez de crear
una variante (`-v2`, `-final`, etc.), misma regla que el resto de documentos
de módulo.

### 8. Auto-revisión antes de entregar

- ¿Cada RN tiene una fuente (`archivo:línea`) o un `⏳ PENDIENTE` explícito?
  ¿Ninguna quedó sin evidencia y sin marcar?
- ¿La numeración respeta bloques de 10 por nivel y el prefijo `[MOD]` ya usado
  en el módulo (si existe)?
- ¿Los roles citados en Nivel 3 vienen del catálogo oficial, sin inventar
  ninguno?
- ¿El diagrama es de Archify con evidencia real, no un Mermaid improvisado
  como sustituto?
- ¿La tabla front vs back quedó completa, no solo un side?

## Referencias

- [Business Rules Discovery — Fase 0 §0.2](../../../conventions/operations/business-rules-discovery-phase-0.md) — taxonomía de 4 niveles y numeración (fuente oficial, aquí solo se reusa)
- [DOCUMENT-DESIGN-STANDARD.md §3.7](../../../conventions/DOCUMENT-DESIGN-STANDARD.md) — formato exacto de la matriz RN y sistema visual del documento
- [CONVENTIONS.md §4.6](../../../conventions/CONVENTIONS.md) — tipo de documento `business-rules` en la estructura plana
- [Module Documentation Instructions](../../../conventions/operations/module-documentation-instructions.md) — Documentos #2 y #7 que ya piden reglas de negocio, y a los que este documento puede alimentar
- [Catálogo de Roles](../../../conventions/operations/application-roles-catalog.md) — únicos roles válidos para RN de Nivel 3
- [`guia-usuario-modulo`](../guia-usuario-modulo/SKILL.md) — skill hermana, mismo método de verificación en código+UI
- `archify/SKILL.md` — generación de diagramas con evidencia
- `playwright-cli/SKILL.md` — exploración de navegador
