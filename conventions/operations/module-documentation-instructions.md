# Module Documentation Instructions

**Ultima revision:** 2026-07-30

## Proposito

Establecer que la documentacion de modulo tambien forma parte del sistema de
convenciones y no debe crearse de forma arbitraria o duplicada.

## Reglas base

- Primero validar si ya existe documentacion del modulo.
- Si existe, actualizarla antes de crear una nueva.
- Si la documentacion tecnica no existe y es necesaria, seguir estructura oficial.
- Si la ubicacion no esta clara, proponerla y esperar aprobacion.

## Niveles oficiales

### Nivel 1: README del modulo

- ubicacion base:
  - `api/LuxuryApp.Application/Modules/[ModuloLuxuryApp]/README.md`
- obligatorio cuando el modulo tenga backend propio documentable
- debe resumir:
  - proposito funcional
  - endpoints principales
  - actores involucrados
  - dependencias
  - reglas de negocio principales
  - ubicaciones clave

### Nivel 2: documentacion tecnica del modulo

- ubicacion base:
  - `api/LuxuryApp.Application/Modules/[ModuloLuxuryApp]/Docs/documentacion-[modulo].md`
- se crea o actualiza cuando el modulo es critico, complejo o tiene reglas de
  negocio sensibles
- debe cubrir como minimo:
  - resumen ejecutivo
  - vision funcional
  - arquitectura tecnica
  - endpoints
  - flujo del sistema
  - frontend si aplica
  - reglas de negocio
  - permisos
  - base de datos
  - performance
  - checklist de validacion
  - historial de cambios

### Nivel 3: guia de usuario del modulo

- ubicacion base:
  - `appsweb/angular/src/app/modules/[modulo].luxuryapp/docs/guia-usuario.md`
- obligatorio siempre que el modulo tenga UI consumible por un usuario de negocio
- unico nivel orientado a usuario final, no a developer
- generado con la skill `guia-usuario-modulo`; contenido minimo detallado abajo
  en "Documentos obligatorios"
- nunca inventa comportamiento: lo no verificado se marca `PENDIENTE`

## Reglas operativas

- frontend y backend del mismo modulo deben documentarse de forma coordinada; no
  se permite documentar uno ignorando al otro cuando ambos existen en alcance
- si ya existe un README o documento tecnico, se actualiza ese archivo en lugar
  de crear variantes como `README-v2`, `documentacion-final` o equivalentes
- la documentacion local del modulo no puede describir rutas o arquitectura
  legacy como si fueran vigentes; si lo hace, debe reportarse como hallazgo
- cuando cambian endpoints, actores, dependencias, reglas de negocio o
  arquitectura, la documentacion del modulo debe revisarse

## Criterios de creacion y actualizacion

- crear README si no existe y el modulo ya tiene entidad funcional propia
- crear documentacion tecnica solo si el caso lo amerita y bajo estructura
  oficial
- si la documentacion ya existe pero esta desalineada, corregirla; no duplicarla
- si el cambio requerido afecta la ubicacion o estructura documental vigente,
  proponerlo y esperar aprobacion

## Relacion con auditoria

- una auditoria completa debe revisar si la documentacion local del modulo sigue
  la arquitectura y las rutas reales
- si la documentacion local sigue en modelo legacy, se clasifica como hallazgo
  y no se usa como fuente normativa primaria

## Fuente historica a preservar

- [module-documentation-instructions.md](../../module-documentation-instructions.md)



## Documentos obligatorios por módulo y su contenido mínimo

Son **7 documentos**, todos obligatorios, sin excepciones opcionales. El orden de lectura para developers está en `CONVENTIONS.md` §4.7.

### Backend

**1. README del módulo (Nivel 1)** — `api/LuxuryApp.Application/Modules/[ModuleLuxuryApp]/README.md`

- Propósito funcional (2-3 párrafos)
- Endpoints principales (tabla)
- Actores y responsabilidades
- Dependencias con otros módulos
- Reglas de Negocio principales (`RN-MOD-*`)
- Estructura de carpetas
- Validaciones principales
- Permisos y seguridad
- Referencias a CONVENTIONS.md

**2. Documentación técnica (Nivel 2)** — `api/LuxuryApp.Application/Modules/[ModuleLuxuryApp]/Docs/documentacion-[modulo].md`

- Resumen ejecutivo y visión funcional
- Arquitectura técnica (modelo de datos, enums, pipeline si aplica)
- Endpoints documentados (3-5 principales con body/respuesta)
- Flujos del sistema (diagramas ASCII)
- Entidades y propiedades (tabla)
- Servicios y métodos clave
- Reglas de Negocio en código
- Base de datos (índices, relaciones, constraints)
- Performance y caching
- Checklist de validación
- Historial de cambios

### Frontend

**3. Operativo** — `appsweb/angular/src/app/modules/[modulo].luxuryapp/docs/operativo.md`

- Propósito del módulo
- Rutas y URLs (tabla con URLs de localhost)
- Estructura de carpetas
- Componentes principales (tabla con responsabilidades)
- Servicios (tabla con firmas)
- Data flow (diagrama ASCII)
- Formularios (si aplica)
- Estados/enums importantes (tabla)
- Smoke test (happy path completo)
- Debugging tips (2-3 casos comunes)

**4. Setup (onboarding)** — `appsweb/angular/src/app/modules/[modulo].luxuryapp/docs/setup.md`

- Para: developer nuevo. Tiempo: 30 minutos
- Pre-requisitos
- Leer en orden (setup → README → decisiones → architecture)
- Estructura a memorizar
- Mi primer cambio (walkthrough de 5 pasos)
- Backend reference paths
- Debugging flowchart (diagrama ASCII)
- 4 errores comunes (con correcciones)
- Git workflow

**5. Decisiones (matriz)** — `appsweb/angular/src/app/modules/[modulo].luxuryapp/docs/decisiones.md`

- Para: developer diario
- Matriz "¿Dónde pongo la feature X?" (diagrama ASCII de decisiones)
- 4-5 ejemplos concretos con soluciones
- Reglas irrompibles (tabla)
- Checklist antes de crear archivo
- Comandos rápidos (grep, find, etc.)
- Ejemplo de flujo completo (paso a paso)
- ¿Cuándo preguntar al Tech Lead?

**6. Guía de Usuario (Nivel 3)** — `appsweb/angular/src/app/modules/[modulo].luxuryapp/docs/guia-usuario.md`

- **Único de los 7 orientado a usuario final/negocio/soporte** — los otros 6 asumen lector técnico (developer). Español, sin jerga de código.
- Generado con la skill `guia-usuario-modulo` (`.agents/skills/guia-usuario-modulo/SKILL.md`), que combina: lectura real del código (backend + frontend), un diagrama generado con la skill `archify` sourced del código real (con cita de archivo/línea), y una exploración real de la UI con `playwright-cli` — **obligatoria**, usando las credenciales genéricas de dev `admin`/`Hwtc00--` como fallback cuando el módulo no indique otras.
- Contenido mínimo:
  - Resumen (qué hace el módulo, en 1 párrafo sin jerga)
  - Para qué sirve / qué problema resuelve
  - Usuarios objetivo (roles de negocio, no roles técnicos)
  - Conceptos clave (glosario breve si el módulo tiene vocabulario propio)
  - Flujo principal (narrado, no diagrama técnico)
  - Diagrama (generado por Archify, no Mermaid a mano)
  - Casos de uso (2-4 escenarios reales)
  - Paso a paso para el usuario (con capturas reales de la exploración Playwright, no descripciones inventadas)
  - Permisos necesarios (en términos de rol de negocio)
  - Estados posibles del registro/proceso (tabla)
  - Errores comunes y qué hacer
  - Preguntas frecuentes
  - Limitaciones conocidas
  - Archivos relevantes para desarrolladores (enlace a los otros 6 documentos, no duplicar su contenido)
- **Disciplina obligatoria:** nunca inventar comportamiento. Todo lo que no se pueda verificar leyendo el código o navegando la UI real se marca explícitamente `PENDIENTE: confirmar con el equipo` — no se rellena con una suposición razonable.

### Auditoría

**7. Auditoría ejecutada** — `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-auditoria-[modulo]-[submodulo].md`

- Matriz de Reglas de Negocio (4 niveles: Invariante, Flujo, Seguridad, Validación)
- Matriz de permisos (endpoint — rol — autorización)
- Validaciones front vs back (tabla comparativa)
- Errores de lógica identificados (6 categorías)
- Hallazgos por severidad (Críticos, Altos, Medios)
- Diagramas de flujo (ASCII)
- Checklist de validación
- Plan de remediación priorizado
