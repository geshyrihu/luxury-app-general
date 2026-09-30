# Changelog del Sistema de Convenciones

## 2026-09-30

- **Nuevo `audit/security-audit-checklist.md`**, adaptado de [`cloudflare/security-audit-skill`](https://github.com/cloudflare/security-audit-skill) (MIT, 23.3k stars) tras evaluarlo a fondo: se corrieron sus 65 tests reales (22/34 + 24/31 pasan; los 7 fallos son protecciones POSIX — `O_NOFOLLOW`/`fstat` — que no existen en Windows, confirmando que el sandbox OS-enforced del repo no es viable en este entorno). Decisión: no instalar el repo completo (6 fases + ledger JSON + sandboxing es desproporcionado para auditar un módulo, y buena parte de sus 9 "companions" — memory-safety/binario, IPC de escritorio, RPC — no aplica a un stack .NET/Angular sin código nativo). Se adaptaron 3 piezas que sí llenaban un hueco real (antes: 0 checklist de clases de ataque, 0 distinción confirmado/no-confirmado):
  1. Clases de ataque relevantes al stack: aislamiento entre `Customer` (la más crítica — multi-tenant), control de acceso por `ApplicationRole`, inyección (EF Core + rutas de archivo), lógica de negocio como vector, abuso de features, y una lista de "cosas obvias" (secretos, CORS, cookies).
  2. Veredicto `confirmado`/`necesita validación`/`rechazado` y severidad `likelihood × impact` (nunca solo impact), agregado a `audit/audit-severity-model.md` como capa adicional sobre las 5 clasificaciones generales existentes, que se conservan.
  3. Patrón "quien encuentra no verifica" (verificación adversarial con contexto fresco) para hallazgos `alto`/`crítico` — mismo principio de `doubt-driven-development` que quedó pendiente de adoptar el 2026-09-24 (evaluación de `agent-skills`), aquí aplicado en concreto a seguridad.
  - Enlazado desde CONVENTIONS.md (Framework de Auditoría Exhaustiva), `audit/audit-module-conventions.md` (ítem "seguridad y permisos") y `audit/audit-by-role.md` (comandos de Backend Developer). Se des-duplicó la tabla de clasificación que `audit-module-conventions.md` repetía literal de `audit-severity-model.md` — ahora `audit-module-conventions.md` la referencia en vez de copiarla.

## 2026-09-25

- **Gate de convenciones para el backend (`api/`), commit `4048096a0`.** `api/` no tenía CI, hooks ni analizadores, así que ninguna regla crítica de backend se verificaba automáticamente. Nuevo `api/scripts/audit-conventions-backend.mjs` + `api/.github/workflows/conventions-gate.yml` + `api/scripts/conventions-gate.baseline.json`, autocontenido en el repo `api/` (lección del incidente de encoding del 2026-09-23). Es un **ratchet**: la deuda actual queda fijada como base y el CI falla solo si una regla empeora. Cubre `ProjectTo` (10), `DateTime.Now/Today` (8), `?` en tipos de referencia (42), más de un DTO por archivo (22), `IFormFile` sin `[FromForm]` (3) y endpoints SelectItem fuera de `SharedLuxuryApp` (1). Verificado en un checkout aislado con `git archive` (pasa) y con violaciones inyectadas (falla, exit 1). El baseline no se llama `audit-*.json` porque el `.gitignore` de `api/` ignora `*-[0-9a-f]*.json`. **Se activa en GitHub cuando el commit llegue a `main`** (aún no se ha hecho push).
- Actualizada la columna "Gate hoy" de §6.1: 8 de 13 reglas con gate (2, 4 y 11 solo parcial), 1 con grep manual, 4 sin gate.
- **Hallazgo, decisión pendiente:** la regla "PROHIBIDO `?` en propiedades" no distingue tipos de referencia de `Nullable<T>`. Su motivo (CS8632) solo aplica a los primeros; hay ~1232 `Guid?`/`DateTime?`/enum? legítimos en EF, y el "79+ warnings CS8632" ya no existe (0 en un build real) porque 13 archivos declaran `#nullable enable` local. Ver `backend/backend-rules.md`.
- **Pendiente sin cubrir:** compilar y correr `LuxuryApp.Tests` en CI (el build de `LuxuryApp.Application` funciona en local: 2 min, 0 errores, 12 warnings; falta probarlo en un runner limpio), `TreatWarningsAsErrors`, y reglas 3, 5, 10, 12 sin gate.

## 2026-09-24

- **§6.1 de CONVENTIONS.md: nueva columna "Gate hoy".** Idea tomada de `addyosmani/agent-skills` (columna "Checked by" de `CONSTRAINTS.md`), tras evaluar el repo y decidir no instalarlo como pool de skills sino adoptar ideas sueltas. Estado verificado contra el código: 3 de 13 reglas críticas con gate en CI (mojibake, tokens CSS, iconos; todos frontend), 4 con grep manual, 6 sin gate. `api/` no tiene CI, hooks ni analizadores; ninguna regla de backend se verifica automáticamente. Hallazgo lateral: el `.githooks/` de la raíz contiene rutas `client/angular` obsoletas y vive fuera de todo repo git, así que no protege nada; el hook real de `appsweb/angular/.githooks/pre-commit` solo comprueba EOL.

- **Regla AutoMapper acotada: permitido en memoria, prohibido `ProjectTo` / proyección sobre `IQueryable`.** Decisión del dueño del módulo / Tech Lead que cierra PRIM-024 (`docs/RecruitmentLuxuryApp/WorkPositions/20260924-auditoria-reclutamiento-work-positions.md`). Antes `governance-by-role.md` y `available-features.md` decían "AutoMapper prohibido" sin matiz (motivo "incompatible AOT", sin `PublishAot` en ningún csproj), mientras `LuxuryApp.Application` tiene 118 archivos con `IMapper`/`Profile` y 445 `Map` en memoria frente a 449 proyecciones `.Select()` manuales y solo 10 `ProjectTo<`. Regla canónica nueva en `backend/backend-rules.md` (sección "REGLA CRÍTICA: AutoMapper"); actualizadas las referencias en `core/governance-by-role.md`, `operations/available-features.md` (NOT AVAILABLE → `ProjectTo`; AutoMapper pasa a CONDITIONAL; greps), `operations/audit-agent-instructions.md`, `operations/plan-agent-instructions.md`, `operations/implementation-checklist.md` y `audit/audit-by-role.md` (el grep de auditoría ahora busca `.ProjectTo<`, no `IMapper`, que daba 118 falsos positivos).
- **Deuda registrada:** 10 usos de `ProjectTo<` en 5 AppServices (`ApplicationRoleAppService`, `TemplateEvaluationAppService`, `AlmacenAppService`, `TaskInstanceAppService`, `TaskTemplateAppService`); migrar a `.Select()` al tocar el archivo o en ticket dedicado.
- **Corrección al registro del 2026-09-21 (Fase 4):** la nota "`audit-encoding.mjs` sigue delegando correctamente al escáner raíz" dejó de ser cierta el 2026-09-23: esa delegación apuntaba a `d:\repos\luxuryapp-api\scripts\`, fuera de todo repo git, y rompía el gate en CI. `scan-mojibake.mjs` y `fix-mojibake.mjs` ahora viven en `appsweb/angular/scripts/` (commit `e3dc9a640`). Ver `operations/encoding-rules.md`.

## 2026-09-21 (continuación — remediación de encoding)

- **Fase 1 de remediación completada: `accounting.luxuryapp` (52/52 corregidos, 26 archivos).**
  Ver `docs/SharedLuxuryApp/Encoding/20260921-auditoria-shared-encoding-mojibake-frontend.md` §5 y
  §5.1. `node scripts/scan-mojibake.mjs appsweb/angular/src/app/modules/accounting.luxuryapp` → 0.
  Verificación global: 254 → 202 ocurrencias restantes en `appsweb/angular`.
- Se corrigió también corrupción no detectada por el escáner (verbos conjugados, "Sí" truncado,
  guion sustituido por vocal acentuada, `ñ`→`í`, líneas con 2 palabras corruptas donde el escáner
  solo marca la primera por usar `match()` sin `/g`) — detalle y tabla de patrones en §5.1 del
  documento de auditoría, para que las fases 2-3 no repitan el mismo punto ciego.

## 2026-09-21

- **Fase 4: scan-mojibake.mjs / fix-mojibake.mjs ahora cubren `.md`/`.MD`.** Causa raíz de por qué `scan-mojibake.mjs conventions/CONVENTIONS.md` daba "Archivos: 0" y "CERO mojibake" (ver Fase 1-3): dos bugs independientes en `scripts/scan-mojibake.mjs` y `scripts/fix-mojibake.mjs`. (1) `.md` no estaba en la lista de extensiones escaneadas — los documentos de `conventions/` y `docs/` nunca se recorrían. (2) Pasar la ruta de un archivo suelto (no un directorio) fallaba en silencio dentro del `try/catch` de `walk()`. (3) Las comprobaciones de sustitución ortográfica (diccionario de vocales sustituidas, doble-codificación Ã+byte) estaban desactivadas explícitamente para `.md`/`.txt` (`if (!isDoc)`), justo el tipo de archivo donde apareció la corrupción real. Corregidas las tres causas; el chequeo de CJK-en-código sigue restringido a código. `appsweb/angular/scripts/audit-encoding.mjs` sigue delegando correctamente al escáner raíz (verificado); el gate no cambia de comportamiento salvo que ahora también ve los 45 `.md` de `appsweb/angular` (0 hallazgos en ellos).
- Verificación tras el fix: `node scripts/scan-mojibake.mjs conventions` → 0 hallazgos reales (quedan 9 falsos positivos en `operations/encoding-rules.md`, que son ejemplos intencionales de corrupción usados para ilustrar la regla, igual que el caso ya documentado en `CONVENTIONS.md` §6.1). Corregido un residuo real que el escáner encontró y las fases 1-3 no habían visto (una vocal sustituida en la palabra "según", en `CONVENTIONS.md` línea 808). Quitado el BOM UTF-8 de 6 archivos (`audit/audit-by-role.md`, `legacy/document-traceability-audit.md`, `legacy/master-coverage-status.md`, `operations/agent-task-catalog.md`, `operations/README.md`, `PLAN_ESTANDARIZACION_NOMENCLATURA.md`). `node scripts/fix-mojibake.mjs conventions` confirma 0 corrupción de bytes restante.
- **Hallazgo fuera de alcance (no corregido):** `node scripts/scan-mojibake.mjs appsweb/angular` reporta 254 ocurrencias reales en 117 `.html` + 83 `.ts` + 54 `.json` de código de producción Angular (0 en `.md`). No son nuevas: ya las detectaba el escáner antes de este cambio (esas extensiones ya estaban cubiertas); solo quedaron visibles al correr el escáner sobre esa carpeta durante esta verificación. Requiere su propio plan de remediación — no se tocó código de aplicación.
- **Fase 3:** §5.9.1 (Notificaciones), §5.9.2 (Hangfire) y §4.7 (plantillas de los 6 documentos de módulo) pasan de reglas completas a resumen con enlace. Documentos que reciben el contenido: **nuevo** `backend/backend-notifications-rules.md` (Notificaciones no tenía documento en `conventions/`), `backend/backend-jobs-hangfire.md` (+ gobernanza de horarios y dashboard) y `operations/module-documentation-instructions.md` (+ contenido mínimo de los 6 documentos). Los 6 documentos dejan de repetirse en §3bis-8 y §4.5: la lista vive solo en §4.7.
- `core/governance-by-role.md`: matriz Secciones × Roles reescrita con la numeración vigente de CONVENTIONS.md (citaba §3 "Backend Rules", §4 "Frontend Rules", §8 "Shared Services", que ya no existen).
- CONVENTIONS.md pasa de 1459 a 954 líneas en las Fases 1-3 (−35%).
- **Fase 1 de mejora de CONVENTIONS.md:** corregidos 9 enlaces rotos (skills y scripts con ruta relativa errónea, viewer, pilotos frontend de Candidates inexistentes); limpiado mojibake y emojis corruptos; restauradas las rutas `docs/operativo.md` que un reemplazo global había sustituido por el archivo legacy; unificada la **fecha de corte del sistema rector (2026-09-16)** como campo propio de la cabecera, separado de la fecha de última revisión.
- **Limpieza de doble codificación UTF-8** en 9 documentos de `conventions/` (`README.md`, `legacy/README.md`, `changelog.md`, `nomenclatura-convenciones.md`, `core/governance-by-role.md`, `core/workflow-por-tipo-de-tarea.md`, `operations/application-roles-catalog.md`, `operations/plan-creation-protocol.md`, `ui/conventions-viewer-update.md`): 403 líneas restauradas, sin otros cambios.
- **Fase 2: §6.1 de CONVENTIONS.md pasa de reglas completas a tabla de reglas críticas.** El detalle vive en los documentos especializados. Reglas que no tenían documento propio y se movieron: `?` prohibido en DTOs/Entities y constructores primarios (→ `backend/backend-rules.md`), nunca modificar SelectItem (→ `backend/select-items-centralization-rule.md`), patrón `DeleteAsync` con transacción (→ `backend/document-read-write-pattern.md`), greps de auditoría de fechas (→ `frontend/frontend-prohibitions.md`).
- `frontend/frontend-prohibitions.md` seguía citando la excepción de `p-table`; alineado con la retirada de PrimeNG (Fase 6, 2026-09-16).
- **Regla superada (antecedente histórico):** `IBusinessTimeService` con zona IANA explícita se aprobó el 2026-08-14 pero nunca se implementó (`Shared/Time/IBusinessTimeService.cs` está comentado y sin registro en DI). La regla vigente es la de fechas y horas de `backend/backend-rules.md`, que consolida `DateTimeExtension.GetMexicoTime()`/`GetMexicoDateOnly()`. Si se retoma, debe implementarse y registrarse en DI antes de volver a exigirlo.

## 2026-09-16

- **Nueva regla §6ter (CONVENTIONS.md):** Estructura y Ubicación de Documentos y Reportes en `docs/`. Jerarquía estricta `docs/[ModuleLuxuryApp]/[Submodulo]/` espejo del catálogo cerrado de módulos §6bis, con **estructura plana obligatoria** (cero subcarpetas dentro del submódulo) y naming `YYYYMMDD-[tipo]-[modulo]-[submodulo].md` (fecha + tipo + módulo + submódulo). Tipos permitidos: `auditoria`, `plan`, `remediacion`, `analisis`, `especificacion`, `guia`, `setup`, `changelog`, `arquitectura`.
- Reemplaza rutas históricas `docs/reporte_maestro/`, `docs/plans/`, `docs/audit/`, `docs/guides/`, `docs/modulos-nuevos/`, `docs/architecture/`, `docs/analisis/`, `docs/specifications/` y `docs/migraciones/`.
- Ejecutada la migración física (Fase 2): ~430 archivos reubicados en 16 módulos × ~45 submódulos. Log en `docs/SharedLuxuryApp/Conventions/20260916-changelog-fase2-migracion-docs.log`.
- Fase 4: limpieza de archivos sueltos de la raíz del repo (12 reubicados a docs/, 6 residuos eliminados).
- **Nueva regla UI desktop (ui-desktop-rules.md):** en todo `<ng-template #caption>` de tabla, los controles (botón agregar, input de búsqueda) usan tamaño **`sm`**: `il-button-add` con `customClass="btn-sm"` / `size="sm"`, y `web-input-search` con `input input-sm` (34px, token DS). Implementado en `primeng-custom-caption` y `input-search.ts`.

- **Nueva regla §6ter (CONVENTIONS.md):** Estructura y Ubicación de Documentos y Reportes en `docs/`. Jerarquía estricta `docs/[ModuleLuxuryApp]/[Submodulo]/` espejo del catálogo cerrado de módulos §6bis, con **estructura plana obligatoria** (cero subcarpetas dentro del submódulo) y naming `YYYYMMDD-[tipo]-[modulo]-[submodulo].md` (fecha + tipo + módulo + submódulo). Tipos permitidos: `auditoria`, `plan`, `remediacion`, `analisis`, `especificacion`, `guia`, `setup`, `changelog`, `arquitectura`.
- Reemplaza rutas históricas `docs/reporte_maestro/`, `docs/plans/`, `docs/audit/`, `docs/guides/`, `docs/modulos-nuevos/`, `docs/architecture/`, `docs/analisis/`, `docs/specifications/` y `docs/migraciones/`.
- Se actualizaron referencias en `CONVENTIONS.md`, `core/precedencia-documental.md`, `core/workflow-por-tipo-de-tarea.md`, `audit/audit-module-conventions.md`, `audit/audit-checklist-completo.md`, `operations/plan-creation-protocol.md`, `operations/guides-creation-protocol.md`, `operations/discovery-questionnaire-template.md`, `operations/data-migration-protocol.md`, `operations/plan-agent-instructions.md`, `operations/README.md`, `backend/backend-rules.md`, `backend/select-items-centralization-rule.md`, `backend/api-method-naming-conventions.md`, `frontend/frontend-prohibitions.md`, `frontend/angular-services-catalog.md`, `ui/icon-usage-rule.md`, `ui/conventions-viewer-update.md`, `guides/guia-delegacion-documentacion-modulos.md`, `guides/guide-agent-instructions.md`, `GOVERNANCE-ANTI-SPANGLISH-RULES.md`, `CONVENTIONS_FOLDER_API.MD` y `README.md`.
- `docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md` se movió a `conventions/operations/audit-agent-instructions.md` (es guía operativa reutilizable, no reporte fechado).
- `operations/documentation-structure-by-module.md` quedó marcado como SUPERADO (antecedente histórico).
- Fase 2 (migración física de documentos existentes en `docs/` a la nueva estructura) queda pendiente como tarea ejecutada posterior.

## 2026-09-15

- Se formalizo en frontend el **espejo estructural backend**: los grupos (nivel 3, ej. `candidates/`) contienen submódulos (nivel 4, ej. `candidate-core/`), y la raíz de un grupo NO es cajón de sastre — ningún archivo suelto vive en la raíz del grupo. Se documentó en `CONVENTIONS_FOLDER-FRONT.MD` §1.3 y en `frontend-feature-structure.md` (distinción feature vs grupo).
- Se formalizo la regla de **aliases de import por módulo**: el import TypeScript arranca en el alias `@[modulo].luxuryapp/…` (espejo del acortamiento de namespace backend `[Modulo]LuxuryApp.…`), nunca en la ruta física `src/app/modules/…`. Se declararon los 18 aliases en `tsconfig.json` y se migraron 699 imports. Documentado en `CONVENTIONS_FOLDER-FRONT.MD` §1.7 y en `CONVENTIONS.md` §6bis.
- Se extendió la regla de aliases a `core/` y `shared/`: `@core/*` → `src/app/core/*` y `@shared/*` → `src/app/shared/*` (con `@ui/*` conservado como alias histórico de `shared/ui/*`). Se migraron ~5,200 imports de `core` y ~140 de `shared` (más la consolidación de `shared/ui` a `@ui/`). Documentado en `CONVENTIONS_FOLDER-FRONT.MD` §1.7.
- Se actualizó el catálogo cerrado de módulos (§6bis) al estado real: backend renombrado a inglés (`AccountingLuxuryApp`, `CollectionsLuxuryApp`, `HumanResourcesLuxuryApp`, `MaintenanceLuxuryApp`, `ManagementLuxuryApp`, `PurchasesLuxuryApp`, `RecruitmentLuxuryApp`, `ResidentsLuxuryApp`; se eliminó `PublicLuxuryApp` inexistente) y frontend con 18 módulos incluyendo `shared.luxuryapp`.
- Se formalizo en frontend la regla de **referencias cruzadas entre submódulos** (espejo §5.2 backend): prohibido importar piezas internas de un submódulo hermano y dependencias circulares; lo compartido sube a `shared/` del nivel que corresponda (grupo → módulo → `shared/integration`). Documentado en `CONVENTIONS_FOLDER-FRONT.MD` §1.2bis.

## 2026-08-12

- Regla CRITICA nueva: **Multipart/form-data presupone `[FromForm]` (HTTP 415)**.
  Todo endpoint Minimal API con DTO de `IFormFile` debe declarar `[FromForm]` y
  `.DisableAntiforgery()`; sin ello, ASP.NET Core responde 415 (`content-length: 0`)
  aunque la peticion multipart este bien formada. Origen: incidente real en el
  modulo `RecepcionPipasAgua` (subida de fotos fallaba). Se registro en
  `backend-rules.md`, en `document-read-write-pattern.md` (Paso 1 del patron de
  escritura) y en `CONVENTIONS.md` §6.1; se sincronizo el `conventions-viewer`.

## 2026-08-04

- Se incorporo `ImageProcessingService` al catalogo generico frontend como
  puerta de entrada unica para validar, convertir HEIC/HEIF, redimensionar y
  comprimir imagenes antes de subirlas; se sincronizo el `conventions-viewer`.
- Se agrego `imageFormDataInterceptor` como garantia transversal para que toda
  imagen incluida en un `FormData`, incluso desde inputs nativos o features
  legacy, pase por `ImageProcessingService` antes de salir del navegador.

## 2026-07-31

- Se sincronizo `workflow-por-tipo-de-tarea.md` como espejo operativo exacto de `CONVENTIONS.md` §4, incluyendo flujo de modulo nuevo (§4.6) y pasos completos de auditoria y remediacion.
- Se consolido §4.6 y §5.9: orden de lectura canonico en §4.6; §5.9 conserva diagrama y referencias sin duplicar pasos.
- Se aclaro precedencia de `docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md` como apoyo operativo nivel 3 subordinado a `conventions/audit/*`.
- Se documentaron los dos hubs centralizados de SELECTs (SharedLuxuryApp para enums, SystemLuxuryApp para entidades dinamicas) en `CONVENTIONS.md`, `select-items-centralization-rule.md` y rutas fisicas corregidas con `Moduls/`.
- Se indexaron en §5.2 `dto-file-organization-rule.md` y `enum-display-name-extension.md`; §6.1 enlaza a documentos dedicados en lugar de anclas fragiles.
- Se normalizaron rutas de tokens CSS a `client/angular/src/styles/` y prefijos de variables permitidos (`--ds-*`, `--primary-*`, etc.).
- Se actualizo `precedencia-documental.md` y fechas de revision a 2026-07-31.

## 2026-07-30

- Se alineo `docs/guides/README.md` y se reescribio `docs/guides/guide-agent-instructions.md` para subordinarlos al protocolo oficial de guias y evitar referencias obsoletas a secciones historicas de `CONVENTIONS.md`.
- Se creo `conventions/legacy/master-coverage-status.md` como control maestro de cobertura documental legacy para visualizar, por archivo, que ya quedo absorbido, alineado o pendiente fino.
- Se absorbio formalmente el bloque legacy de auditoria, compliance, documentacion de modulo y servicios compartidos backend: se reforzaron `audit-by-role.md`, `audit-checklist.md`, `module-documentation-instructions.md`, `backend-shared-services-catalog.md` y se creo `core/compliance-protocol.md` como sustituto oficial del protocolo legacy de compliance.
- Se fortalecio la auditoria para exigir validacion explicita de reglas de negocio e invariantes funcionales: unicidades, no duplicidad, no solapamiento, transiciones invalidas, doble submit, concurrencia y escenarios negativos por capa.
- Se creo la convención rectora de módulo para `CobranzaNativa`, subordinada a `CONVENTIONS.md`, con mapa de subdominios, orden de lectura y reglas funcionales sensibles del sistema financiero.
- A partir de la auditoria de `CobranzaOnline` se formalizo que la capa de servicios de aplicacion no debe devolver tipos HTTP/MVC como `ActionResult` o `IResult`; esos tipos solo pertenecen a endpoints o controladores.
- A partir de la auditoria de `SolicitudCompra` se formalizo que la auditoria completa debe cubrir tambien subservicios o submodulos internos del modulo y no solo la carpeta raiz.
- Se formalizo que la documentacion local del modulo debe marcarse como hallazgo si describe arquitectura o rutas legacy y no puede usarse como autoridad primaria mientras siga desalineada.
- Se formalizo que la auditoria de UI/styles incluye tambien estilos locales de componentes, `styles: []`, `styleUrl` y uso de `::ng-deep`.
- Se formalizo en frontend la prohibicion de `any` productivo en estado, responses, listados, payloads y mapeos de features con contrato tipado esperado.
- Se formalizo en backend que todo DTO local que declare `Id` debe heredar de `GuidIdEntityDTO`.
- Se formalizo en backend la regla `un archivo por DTO`; ya no se permite concentrar todos los DTOs de un modulo en un solo archivo.
- Se formalizo en backend que los namespaces oficiales son fijos por tipo de pieza y no por ruta fisica completa del modulo: `LuxuryApp.Application.DTOs`, `LuxuryApp.Application.EndPoints`, `LuxuryApp.Application.Interfaces`, `LuxuryApp.Application.Mappings` y `LuxuryApp.Application.Services`.
- Se sincronizaron `CONVENTIONS.md`, `backend-rules.md`, `backend-module-structure.md` y `conventions-viewer` con estas reglas.
- Se fortalecio la auditoria completa para exigir validacion funcional minima de CRUD, flujo real de edicion, hidratacion de formularios y carga visible en selects/autocomplete.
- Se formalizo en frontend y auditoria la regla de shape real para wrappers `@ui/*`: los selects deben respetar si el control guarda valor primitivo u objeto, y los autocomplete editables no deben mezclar `ngModel` manual con `FormControl` cuando el flujo depende de `patchValue`.
- A partir de la auditoria de `OrdenCompra` se formalizaron reglas nuevas para modulos complejos: validacion de wizard/multi-step, estado critico fuera de forms, doble entrada ruta/modal con servicio compartido, contratos backend sin `object` ni entidad directa, integridad transaccional de acciones multi-entidad y prohibicion de hardcodes de catalogos sensibles en servicios.
- Se absorbio en la taxonomia nueva el bloque critico de protocolos operativos para agentes: auditoria completa sin modalidad rapida como cierre oficial, protocolo oficial de creacion de planes y protocolo oficial de creacion de guias.
- Se reforzo la capa nueva de gobernanza, features disponibles, checklist de implementacion, catalogo UI y governance del conventions-viewer con reglas absorbidas del bloque historico de roles, training, decision tree y viewer guide.

## 2026-07-29

- Se redefinio `CONVENTIONS.md` como indice rector + reglas minimas universales.
- Se establecio precedencia documental formal.
- Se definio orden de lectura obligatorio por tipo de tarea.
- Se creo estructura inicial por dominios: `core`, `backend`, `frontend`, `flutter`, `ui`, `styles`, `catalogs`, `audit`.
- Se dejo `conventions-viewer` en radar como capa de visualizacion subordinada.
- Se consolido estructura real de feature frontend tomando `banks` como referencia viva.
- Se enriquecieron reglas de `styles` con jerarquia, capas y prohibiciones.
- Se enriquecio la auditoria completa con salida minima, clasificacion y fuentes detalladas a preservar.
- Se ampliaron catalogos iniciales de servicios genericos backend y frontend.
- Se reforzaron reglas de `ui` desktop, mobile y arquitectura de `shared/ui`.
- Se creo el dominio `operations` para disponibilidades, checklist e instrucciones de documentacion de modulo.
- Se ampliaron reglas backend para contratos, SignalR, email y validacion de features disponibles.
- El `conventions-viewer` migro de un modelo historico centrado en secciones a un modelo base por `domain` y `taskTypes`, alineado con la nueva taxonomia documental.
- Se creo `conventions/legacy/` para controlar la transicion de documentos historicos sin borrado prematuro.
- Se agrego matriz inicial de transicion legacy con estado, absorcion y omisiones detectadas.
- Se crearon `core/governance-by-role.md` y `audit/audit-by-role.md` para absorber gobernanza y auditoria ejecutable por rol desde legacy.
- Se absorbio una primera capa de reglas faltantes sobre encoding, hooks/scripts de auditoria y catalogo de servicios compartidos backend.
- Se absorbio una capa inicial de onboarding, training del Tech Lead y gobernanza del conventions-viewer.

