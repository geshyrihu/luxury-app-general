---
name: guia-usuario-modulo
description: >-
  Genera el Documento 6 obligatorio de un módulo LuxuryApp (CONVENTIONS.md §4.7):
  una guía de usuario en español, orientada a negocio/soporte, no a developers.
  Combina lectura real del código, un diagrama Archify con evidencia de fuente, y
  una exploración real de la UI con playwright-cli (obligatoria). Nunca inventa
  comportamiento. Usar cuando el usuario diga "genera la guía de usuario de
  [módulo]", "documenta [módulo] para usuarios/negocio/soporte", "crea el
  documento 6 de [módulo]", o pida una guía funcional/manual de un módulo que no
  sea documentación técnica para developers.
---

# 📘 Guía de Usuario de Módulo (LuxuryApp)

Skill de **documentación funcional** — produce el único de los 7 documentos
obligatorios por módulo (`CONVENTIONS.md` §4.7) pensado para quien usa el
módulo, no para quien lo programa. Origen: `plan_documentacion.md` (análisis
de 2026-10-01) adaptado a las herramientas que este proyecto ya tiene
instaladas (`archify`, `playwright-cli`) en vez de las genéricas que ese plan
proponía (MCPs externos, Mermaid a mano).

## Regla de oro

> Todo lo que aparece en la guía debe venir de algo que el agente **leyó en el
> código** o **vio ocurrir en la UI real**. Nada se infiere de un nombre de
> variable, un comentario, o "lo que normalmente hacen los sistemas así". Si no
> se pudo verificar, se escribe `PENDIENTE: confirmar con el equipo` — nunca se
> rellena con una suposición razonable, aunque suene correcta.

## Posición respecto al canon (no duplicar)

- El contenido mínimo exacto y la ubicación del archivo viven en
  [`module-documentation-instructions.md`](../../../conventions/operations/module-documentation-instructions.md)
  (Nivel 3). Esta skill es el *cómo generarlo*, no redefine el *qué debe
  contener*.
- El idioma y tono siguen [`GOVERNANCE-ANTI-SPANGLISH-RULES.md`](../../../conventions/GOVERNANCE-ANTI-SPANGLISH-RULES.md):
  contenido 100% en español, sin jerga de código (nunca "AppService", "DTO",
  "endpoint" en el cuerpo de la guía — eso vive en los otros 6 documentos).
- Los diagramas se generan con la skill `archify`, no a mano. Si `archify` no
  está disponible, reportarlo y detenerse — no dibujar un diagrama Mermaid
  improvisado como sustituto silencioso.
- La exploración de UI usa la skill `playwright-cli`. Es **obligatoria**, no
  opcional: si no se puede completar, la guía no se da por terminada (ver
  "Modo de falla" abajo).

## Proceso

### 1. Localizar el módulo

Confirmar rutas reales antes de leer nada:

```bash
# Backend
find api/LuxuryApp.Application/Modules -maxdepth 1 -iname "*[Modulo]*"
# Frontend
find appsweb/angular/src/app/modules -maxdepth 1 -iname "*.luxuryapp" | grep -i [modulo]
```

Si el módulo no existe en alguno de los dos lados, reportarlo — no asumir que
es "solo backend" o "solo frontend" sin haber buscado.

### 2. Leer el código real

- **Backend:** Entidades (`Domain/Entities/`), AppServices/Services (métodos
  públicos y sus validaciones), Endpoints (rutas, `[Authorize]` y roles
  exigidos), enums de estado con `[Display(Name="...")]` (ya en español —
  úsalos tal cual, no los traduzcas de nuevo).
- **Frontend:** Rutas (`*.routes.ts`), componentes de pantalla principales,
  formularios (campos, validadores reactivos), servicios que consumen los
  endpoints identificados arriba.
- Reglas de negocio: buscar validaciones explícitas en servicios/DTOs y
  comentarios `RN-*` si el módulo los tiene documentados en su README (Nivel 1).

No es necesario leer cada archivo del módulo — basta seguir el flujo principal
(crear → leer → actualizar → el resto de acciones que el propio código exponga)
hasta que cada afirmación que vaya a aparecer en la guía tenga una fuente.

### 3. Generar el diagrama con Archify

Invocar la skill `archify` (ver `archify/SKILL.md`) en modo `architecture` o
`workflow` según lo que mejor explique el módulo (arquitectura si es sobre
componentes/servicios; workflow si es sobre un proceso con pasos/estados).
Pedirle explícitamente que use evidencia de repositorio (lectura de código
real con cita de archivo y línea), no una descripción libre — así el diagrama
queda con el mismo nivel de verificación que el resto de la guía.

Guardar el HTML generado junto al resto de la documentación del módulo
(misma carpeta `docs/[ModuleLuxuryApp]/[Submodulo]/` del documento 6, NUNCA
dentro de `appsweb/angular/`) y enlazarlo desde la guía. Si se exporta a
PNG/SVG/WebM para versionar, el archivo va plano en esa misma carpeta, sin
subcarpeta `diagrams/` (ver `CONVENTIONS.md` §6ter 4️⃣).

### 4. Explorar la UI real con playwright-cli (obligatorio)

1. Confirmar que el dev server del frontend está arriba (`curl -s -o /dev/null
   -w "%{http_code}" http://localhost:4200`); si el módulo requiere backend,
   confirmar también ese puerto.
2. Si el módulo o su plan de implementación documentan credenciales propias,
   usar esas. Si no, usar el fallback genérico de dev de este proyecto:
   usuario `admin`, contraseña `Hwtc00--` (la misma cuenta ya referenciada en
   planes previos de este repo, ej. `docs/MaintenanceLuxuryApp/Inspections/`).
3. Navegar a la ruta principal del módulo, capturar screenshot.
4. Ejercitar el flujo principal (crear un registro de prueba si es seguro
   hacerlo sin afectar datos reales; si no es seguro, navegar sin enviar y
   decirlo explícitamente en la guía).
5. Capturar los textos reales de botones/labels/mensajes — la guía cita el
   texto que el usuario ve tal cual aparece en pantalla, no una paráfrasis.
6. Si se creó un registro de prueba, eliminarlo al terminar (mismo criterio
   usado en verificaciones anteriores de este proyecto — no dejar datos de
   prueba).

**Modo de falla:** si el dev server no responde, si las credenciales fallan, o
si `playwright-cli` no puede completar la navegación, **detener la tarea y
reportarlo como bloqueo** — no entregar una guía con la sección de capturas
vacía o con pasos inventados a partir solo del código. Decir exactamente qué
falló (puerto, credencial, paso) para que se pueda reintentar.

### 5. Escribir la guía

Seguir el contenido mínimo exacto de
[`module-documentation-instructions.md`](../../../conventions/operations/module-documentation-instructions.md#nivel-3-guia-de-usuario-del-modulo)
(Nivel 3). En resumen: resumen, para qué sirve, usuarios objetivo (roles de
negocio, no roles técnicos), conceptos clave, flujo principal narrado,
diagrama Archify embebido/enlazado, casos de uso, paso a paso con las
capturas reales, permisos en términos de negocio, estados (tabla), errores
comunes, FAQ, limitaciones conocidas, y enlace a los otros 6 documentos
técnicos (no duplicar su contenido).

Guardar en `docs/[ModuleLuxuryApp]/[Submodulo]/guia-usuario.md` — **nunca**
dentro de `appsweb/angular/`, aunque el módulo sea frontend. Si el archivo ya
existe, actualizarlo — nunca crear `guia-usuario-v2.md` ni variantes (misma
regla que los otros 7 documentos).

### 6. Auto-revisión antes de entregar

Releer la guía completa y verificar: ¿cada afirmación tiene una fuente (código
visto o pantalla vista)? ¿Quedó algo sin verificar sin su `PENDIENTE`
explícito? ¿El lenguaje es de negocio, no de código? ¿El diagrama es de
Archify y no un Mermaid dibujado a mano como sustituto?

## Referencias

- [Module Documentation Instructions — Nivel 3](../../../conventions/operations/module-documentation-instructions.md)
- [CONVENTIONS.md §4.7](../../../conventions/CONVENTIONS.md) — documento 6 de 7
- [GOVERNANCE-ANTI-SPANGLISH-RULES.md](../../../conventions/GOVERNANCE-ANTI-SPANGLISH-RULES.md)
- `archify/SKILL.md` — generación de diagramas con evidencia
- `playwright-cli/SKILL.md` — exploración de navegador
