# Catálogo de Invocación de Convenciones

**Última revisión:** 2026-09-30
**Propósito:** `CONVENTIONS.md` dice QUÉ documento se debe leer para cada tipo de tarea (§3bis, §4). Este catálogo complementa eso con **frases concretas que puedes decirle a cualquier agente** para disparar esa lectura explícitamente — útil cuando quieres forzar una revisión puntual (ej. solo criterio visual, solo seguridad) sin pedir el flujo completo, o cuando quieres asegurarte de que el agente no se salte un documento.

## Cómo usar este catálogo

- Ninguna de estas invocaciones es "mágica": son frases en lenguaje natural. El agente las entiende por contexto, no por un comando registrado.
- Si no dices nada de esto, el agente **debería** igual seguir `CONVENTIONS.md` §3bis/§4 por sí mismo (es la instrucción de `CLAUDE.md`) — pero como vimos con `ui-taste-checklist.md`, un documento nuevo puede no estar todavía enlazado desde el flujo automático. Decirlo explícitamente siempre funciona como respaldo.
- Para peticiones grandes (auditoría completa, plan, remediación), usa la plantilla estructurada de [Agent Task Catalog](./agent-task-catalog.md) en vez de una frase suelta — da mejor resultado cuando hay alcance, restricciones y entregable que especificar.
- Esto es un catálogo "vivo": cuando se agregue un documento nuevo a `conventions/`, agregar aquí su fila de invocación es parte de terminar la tarea (ver §9 de este mismo documento).

---

## 1. Backend (.NET)

| Documento | Cuándo se invoca |
|---|---|
| [backend-rules.md](../backend/backend-rules.md) | Crear/modificar entidades, servicios, AppServices |
| [backend-module-structure.md](../backend/backend-module-structure.md) | Ubicar código dentro de un módulo |
| [backend-generic-services-catalog.md](../backend/backend-generic-services-catalog.md) | Antes de crear un servicio — ¿ya existe uno genérico? |
| [select-items-centralization-rule.md](../backend/select-items-centralization-rule.md) | Crear cualquier dropdown/select nuevo |
| [document-read-write-pattern.md](../backend/document-read-write-pattern.md) | El módulo maneja archivos/documentos |
| [backend-export-services.md](../backend/backend-export-services.md) | El módulo exporta a Excel/PDF |
| [namespace-conventions.md](../backend/namespace-conventions.md) | Dudas de namespace (path-based, sin prefijo) |
| [backend-jobs-hangfire.md](../backend/backend-jobs-hangfire.md) | Crear un Job con Hangfire |
| [multipart-antiforgery.md](../backend/multipart-antiforgery.md) | Endpoint recibe `IFormFile` |

**Frases de ejemplo:**
- *"Crea el AppService de X siguiendo backend-rules.md y el catálogo de servicios genéricos — no dupliques si ya existe algo en core/services."*
- *"Antes de tocar esto, revisa select-items-centralization-rule.md — necesito un nuevo dropdown y quiero confirmar que va en el hub central, no local."*
- *"Audita este servicio contra namespace-conventions.md, sospecho que el namespace no es path-based."*

---

## 2. Frontend Angular

| Documento | Cuándo se invoca |
|---|---|
| [frontend-rules.md](../frontend/frontend-rules.md) | Cualquier componente/servicio Angular nuevo |
| [angular-signals-and-state.md](../frontend/angular-signals-and-state.md) | Manejo de estado, signals, caching |
| [angular-forms-pattern.md](../frontend/angular-forms-pattern.md) | Formularios reactivos |
| [angular-dialog-modal-pattern.md](../frontend/angular-dialog-modal-pattern.md) | Cualquier modal/diálogo |
| [angular-http-interceptors.md](../frontend/angular-http-interceptors.md) + [jwt-storage-security.md](../frontend/jwt-storage-security.md) | Tocar auth, interceptors, tokens |
| [angular-routing-guards.md](../frontend/angular-routing-guards.md) | Rutas nuevas, guards |
| [frontend-generic-services-catalog.md](../frontend/frontend-generic-services-catalog.md) | Antes de crear un servicio frontend — ¿ya existe? |
| [angular-testing-patterns.md](../frontend/angular-testing-patterns.md) | Escribir tests de componente/servicio |
| [pipes-catalog.md](../frontend/pipes-catalog.md) | Formatear fechas/moneda/texto en template |

**Frases de ejemplo:**
- *"Crea el componente de X con signals, siguiendo angular-signals-and-state.md — nada de lógica con RxJS si un signal/computed alcanza."*
- *"Antes de construir este modal, revisa angular-dialog-modal-pattern.md, necesito que funcione igual en web y mobile."*
- *"Verifica que este interceptor no viole jwt-storage-security.md — no quiero el token en localStorage."*

---

## 3. UI / Diseño visual — el caso que motivó este catálogo

| Documento | Cuándo se invoca |
|---|---|
| [ui-ux-composition-rules.md](../ui/ui-ux-composition-rules.md) | **Antes de construir** cualquier pantalla/formulario — grid/flex, jerarquía de botones, alineación |
| [ui-taste-checklist.md](../ui/ui-taste-checklist.md) | **Antes de dar por terminada** una pantalla — anti-clichés de IA, estados, voz de UI, contraste real |
| [ui-audit-protocol.md](../ui/ui-audit-protocol.md) | Auditar una pantalla/módulo ya existente (STEP 5 ya incluye el taste checklist) |
| [design-tokens-rule.md](../ui/design-tokens-rule.md) | Cualquier valor de color/spacing/tipografía — nunca hardcodear |
| [ui-usage-catalog.md](../ui/ui-usage-catalog.md) | Decidir qué componente de `shared/ui` usar |
| [a11y-accessibility-rules.md](../ui/a11y-accessibility-rules.md) | Accesibilidad específica (aria, teclado, touch targets) |
| [icon-usage-rule.md](../ui/icon-usage-rule.md) / [app-icon-usage.md](../ui/app-icon-usage.md) | Agregar un ícono |

**Frases de ejemplo (las que motivaron este documento):**
- *"Antes de construir esta pantalla, revisa ui-ux-composition-rules.md y ui-taste-checklist.md."*
- *"Audita el criterio visual de [módulo] con el ui-taste-checklist — quiero saber si cae en clichés genéricos de IA."*
- *"Esta pantalla ya funciona, pero antes de cerrarla corre el checklist de estados (loading/empty/error) de ui-taste-checklist.md §2."*
- *"Revisa el Color-Lock de esta vista contra ui-taste-checklist.md §6 — creo que mezclamos tokens de acento."*

---

## 4. Flutter (móvil nativo)

| Documento | Cuándo se invoca |
|---|---|
| [flutter-rules.md](../flutter/flutter-rules.md) | Cualquier feature/widget Flutter nuevo |
| [flutter-feature-structure.md](../flutter/flutter-feature-structure.md) | Ubicación de archivos |
| [flutter-generic-services-catalog.md](../flutter/flutter-generic-services-catalog.md) | Antes de crear un servicio — ¿ya existe en el paquete `auth_core` u otro? |
| [flutter-prohibitions.md](../flutter/flutter-prohibitions.md) | Verificar que no se repita un error conocido |

**Frase de ejemplo:**
- *"Crea este widget en commitee siguiendo flutter-rules.md y revisa flutter-prohibitions.md antes de tocar el estado de sesión."*

---

## 5. Auditoría de módulo

| Documento | Cuándo se invoca |
|---|---|
| [audit-prompt-comprehensive.md](../audit/audit-prompt-comprehensive.md) | Punto de entrada de cualquier auditoría formal |
| [audit-checklist-completo.md](../audit/audit-checklist-completo.md) | Checklist interactivo durante la auditoría |
| [audit-by-role.md](../audit/audit-by-role.md) | Auditoría desde la perspectiva de un rol específico (Backend/Frontend/Tech Lead) |
| [audit-severity-model.md](../audit/audit-severity-model.md) | Clasificar hallazgos por severidad |
| [security-audit-checklist.md](../audit/security-audit-checklist.md) | Hallazgos de seguridad — veredicto confirmado/necesita validación/rechazado |
| [ui-audit-protocol.md](../ui/ui-audit-protocol.md) | El módulo tiene UI (incluye STEP 5 = taste checklist) |

**Frases de ejemplo:**
- *"Auditoria completa de [módulo] — usa audit-prompt-comprehensive.md y clasifica cada hallazgo con audit-severity-model.md."*
- *"De los hallazgos de seguridad que encuentres, aplica el veredicto de security-audit-checklist.md — no me digas 'vulnerable' sin decir si está confirmado o necesita validación."*
- *"Esta auditoría es solo de UI — corre ui-audit-protocol.md completo, los 5 STEPs."*

Para el flujo formal completo (con entregables obligatorios), usa la plantilla `AUDITAR [MODULO]` de [Agent Task Catalog](./agent-task-catalog.md) en vez de una frase suelta.

---

## 6. Planes, documentación y guías

| Documento | Cuándo se invoca |
|---|---|
| [plan-creation-protocol.md](./plan-creation-protocol.md) | Crear un plan formal (11 secciones) |
| [plan-agent-instructions.md](./plan-agent-instructions.md) | Instrucciones operativas para ejecutar un plan |
| [module-documentation-instructions.md](./module-documentation-instructions.md) | Documentar un módulo (README + técnica) |
| [guides-creation-protocol.md](./guides-creation-protocol.md) | Crear una guía operativa (intervención quirúrgica) |
| [business-rules-discovery-phase-0.md](./business-rules-discovery-phase-0.md) | **Antes de cualquier plan** — descubrir reglas de negocio no documentadas |
| [Archify](../../.agents/skills/archify/SKILL.md) | Diagrama interactivo (arquitectura/workflow/secuencia/dataflow/lifecycle) sourced de código real o de una descripción |
| [Guía de Usuario de Módulo](../../.agents/skills/guia-usuario-modulo/SKILL.md) | Documento 6 de §4.7 — guía funcional en español para negocio/soporte, no para developers |

**Frases de ejemplo:**
- *"Antes de planear esto, corre la Fase 0 de business-rules-discovery-phase-0.md — no quiero un plan basado en supuestos."*
- *"Crea el plan de [tema] siguiendo las 11 secciones de plan-creation-protocol.md."*
- *"Documenta el módulo de X según module-documentation-instructions.md, nivel técnico completo."*
- *"Usa archify para generar el diagrama de arquitectura de [módulo], lee el código real y cita las líneas fuente."*
- *"Genera un Architecture Delta con archify comparando el módulo antes y después de esta remediación."*
- *"Genera la guía de usuario de [módulo] — lee el código, navega la UI real con playwright-cli y no inventes nada, marca PENDIENTE lo que no puedas verificar."*

---

## 7. Nomenclatura, estructura y gobernanza

| Documento | Cuándo se invoca |
|---|---|
| [naming-conventions.md](../catalogs/naming-conventions.md) | Dudas de PascalCase/kebab-case/sufijos |
| [folder-structure-conventions.md](../catalogs/folder-structure-conventions.md) | Dudas de dónde va un archivo |
| [module-master-domain-map.md](../catalogs/module-master-domain-map.md) | A qué dominio maestro pertenece un módulo |
| [governance-by-role.md](../core/governance-by-role.md) | Quién tiene autoridad para aprobar algo |
| [precedencia-documental.md](../core/precedencia-documental.md) | Dos documentos se contradicen — ¿cuál gana? |
| [compliance-protocol.md](../core/compliance-protocol.md) | Verificar cumplimiento general antes de cerrar una tarea |
| [GOVERNANCE-ANTI-SPANGLISH-RULES.md](../GOVERNANCE-ANTI-SPANGLISH-RULES.md) | Dudas de idioma (código en inglés, UI en español) |

**Frases de ejemplo:**
- *"Antes de nombrar esto, revisa naming-conventions.md — ¿el sufijo correcto es DTO o Dto?"*
- *"Estos dos documentos se contradicen, resuélvelo con precedencia-documental.md."*
- *"¿Esta decisión la puede aprobar un Backend Developer o necesita Tech Lead? Revisa governance-by-role.md."*

---

## 8. Selects, archivos, fechas — patrones transversales específicos

| Documento | Cuándo se invoca |
|---|---|
| [select-items-centralization-rule.md](../backend/select-items-centralization-rule.md) + [enum-display-name-extension.md](../backend/enum-display-name-extension.md) | Cualquier dropdown/enum con texto visible |
| [document-read-write-pattern.md](../backend/document-read-write-pattern.md) + [document-display-pattern.md](../frontend/document-display-pattern.md) | Subir/mostrar/descargar documentos o PDFs |
| [angular-forms-pattern.md](../frontend/angular-forms-pattern.md) + [frontend-prohibitions.md](../frontend/frontend-prohibitions.md) | Cualquier campo de fecha — nunca `new Date()` directo |

**Frase de ejemplo:**
- *"Este formulario tiene un campo de fecha — verifica frontend-prohibitions.md, no quiero `new Date()` ni `| date` directo."*

---

## 9. Mantenimiento de este catálogo

Cuando se cree un documento nuevo en `conventions/` (como pasó con `ui-taste-checklist.md` el 2026-09-30), la tarea de crearlo **no está completa** hasta:
1. Enlazarlo desde el flujo de tarea correspondiente en `CONVENTIONS.md` (§3bis y/o §4) y su espejo `core/workflow-por-tipo-de-tarea.md`.
2. Agregar su fila a este catálogo, con 1-2 frases de ejemplo reales.

Esto evita que un documento quede "huérfano" — enlazado solo desde el índice general de §5.x, donde nadie lo encuentra si no sabe que existe.

---

## Referencias

- [CONVENTIONS.md §3bis](../CONVENTIONS.md) — Guía Rápida por Tarea (punto de entrada obligatorio)
- [CONVENTIONS.md §4](../CONVENTIONS.md) — Orden de Lectura Obligatorio por Tipo de Tarea (fuente de verdad normativa)
- [Workflow por Tipo de Tarea](../core/workflow-por-tipo-de-tarea.md) — espejo operativo de §4
- [Agent Task Catalog](./agent-task-catalog.md) — plantilla estructurada para peticiones grandes (auditoría, plan, remediación)
