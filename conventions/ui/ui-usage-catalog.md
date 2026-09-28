# UI Usage Catalog

**Ultima revision:** 2026-07-29

## Proposito

Catalogo normativo mixto: por tipo de componente y por caso de uso.

## Casos a normar

- que boton usar segun intencion
- que color usar segun contexto
- que card usar segun necesidad
- cuando usar tabla, cards o data view mobile
- cuando usar dialog, drawer o edicion inline
- iconografia, badges, estados, alerts, empty states y loading states

## Reglas de uso minimas ya fijadas

- Regla de oro:
  - empezar por `lx-*` si existe variante adaptativa
  - si no existe, usar `app-*` o `ili-*` segun plataforma
- Paridad visual:
  - no forzar paridad visual exacta entre web y mobile
  - respetar la naturaleza de PrimeNG en desktop y de Ionic en mobile
- Dentro de `app-data-view-mobile`:
  - botones `ili-button-*`
  - acciones moviles `ili-*`
- En desktop/web:
  - botones `il-button-*` o `iw-button-*`
  - acciones web `app-*`
  - `p-table` y su ecosistema directo necesario para construir la tabla son la
    unica excepcion permitida de uso directo de PrimeNG en features Angular
- Inputs:
  - usar `custom-input-*-signal`
  - no usar inputs raw
- Formularios:
  - usar formularios reactivos tipados
  - no mezclar criterios mobile y desktop en el mismo bloque sin patron adaptativo
- Contenedores y decision base:
  - empezar por `lx-*` para casos adaptativos
  - usar `lx-data-view` para listados de datos cuando el catalogo cubre el caso
  - usar `lx-card` para contenedores visuales
  - usar `lx-accordion`, `lx-tabs`, `lx-empty-state` y `lx-spinner` cuando el catalogo cubre la necesidad
- HTML segregado por plataforma:
  - no usar `*ngIf="isMobile"` como patron para mezclar PrimeNG e Ionic en el mismo template
  - separar implementaciones por plataforma cuando el caso lo requiera
- Wrappers:
  - no sobre-abstraer wrappers al punto de volverlos cajones de sastre
  - si un wrapper exige demasiados `@Input`, debe revisarse el diseno
- Accesibilidad minima:
  - botones solo icono siempre con `aria-label`
  - mantener focus visible
  - respetar contraste y tamano minimo touch cuando aplique

## Matriz inicial por necesidad

- accion primaria
  - web: `il-button-primary`
  - mobile: `ili-button-primary`
- accion secundaria
  - web: `il-button-secondary`
  - mobile: `ili-button-secondary`
- accion destructiva
  - web: `il-button-danger`
  - mobile: `ili-button-danger`
- accion solo icono
  - web: `iw-button-*`
  - mobile: `ii-button-*`
  - siempre con `aria-label`
- lista o tabla de datos
  - adaptativo: `lx-data-view`
  - desktop/web con tabla rica: `p-table` segun patron oficial vigente del proyecto
- formularios
  - inputs adaptativos `custom-input-*-signal`
- feedback al usuario
  - confirmacion: servicios/dialogos oficiales
  - notificaciones: servicios/toasts oficiales
- navegacion
  - sidebar, tabs, breadcrumbs o bottom-nav segun plataforma y caso
- estado vacio y loading
  - preferir `lx-empty-state` y `lx-spinner` cuando el catalogo cubre el caso

## Antipatrones

- Usar `<button>`, `<input>`, `<p-button>`, `<ion-button>` o `<ion-list>`
  directo cuando el catalogo ya cubre el caso.
- Usar PrimeNG directo en features fuera de la excepcion vigente de `p-table`
  y su ecosistema directo de tabla.
- Mezclar criterios desktop y mobile dentro del mismo scope sin seguir el patron adaptativo aprobado.
- Mezclar componentes web y mobile dentro del mismo bloque sin separacion controlada por plataforma.
- Disenar por intuicion cuando ya existe decision tree oficial.
- Forzar paridad visual exacta entre PrimeNG e Ionic.
- Resolver diferencias de plataforma con hacks CSS o condicionando todo con `isMobile`.
- Crear wrappers gigantes sin limite claro de responsabilidad.

## Verificaciones sugeridas en auditoria UI

- confirmar que no se usen inputs raw cuando existe wrapper oficial
- confirmar que no se mezclen componentes web y mobile en el mismo bloque sin patron aprobado
- confirmar que botones icon-only tengan `aria-label`
- confirmar que el caso de uso empiece por `lx-*` si existe variante adaptativa
- confirmar que no se este forzando paridad visual exacta entre stacks

## Fuentes a preservar

- [DESIGN_CONVENTIONS.md](../../DESIGN_CONVENTIONS.md)
- [decision-tree-components.md](../../decision-tree-components.md)


