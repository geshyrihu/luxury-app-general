# Decision Tree: Cuando Usar Que Componente

> **Estado de autoridad:** documento historico de apoyo controlado.
> La autoridad vigente para decision de componentes vive principalmente en
> `./ui/ui-usage-catalog.md`.
> Este documento conserva ejemplos y detalle historico del arbol de decision,
> pero no debe operar como fuente primaria separada.

**Proposito:** Arbol de decision historico para seleccionar el componente UI
correcto en LuxuryApp.  
**Referencia vigente:** `./ui/ui-usage-catalog.md`

---

## Regla de Oro

Siempre comenzar por `lx-*` cuando exista variante adaptativa. Si no existe,
usar `app-*`, `il-*`, `iw-*`, `ili-*` o `ii-*` segun plataforma y caso de uso
ya aprobado.

---

## Flujo Historico por Tipo de Necesidad

### 1. Mostrar datos

- preferir `lx-data-view` cuando el catalogo adaptativo cubra el caso
- para acciones por fila:
  - web: `app-action-menu`, `il-button-*`, `iw-button-*`
  - mobile: `ili-action-menu`, `ili-button-*`, `ii-button-*`

### 2. Botones de accion

- accion primaria:
  - web: `il-button-primary`
  - mobile: `ili-button-primary`
- accion secundaria:
  - web: `il-button-secondary`
  - mobile: `ili-button-secondary`
- accion destructiva:
  - web: `il-button-danger`
  - mobile: `ili-button-danger`
- boton solo icono:
  - web: `iw-button-*`
  - mobile: `ii-button-*`
  - siempre con `aria-label`

### 3. Formularios

- usar formularios reactivos tipados
- usar `custom-input-*-signal`
- no usar `<input>`, `<p-inputText>` o `<ion-input>` directo si ya existe
  wrapper oficial

### 4. Contenedores visuales

- `lx-card`
- `lx-accordion`
- `lx-tabs`
- `lx-empty-state`
- `lx-divider`

### 5. Feedback al usuario

- confirmaciones por servicio/dialogo oficial
- notificaciones por toast oficial
- carga mediante spinner, skeleton o servicio central cuando aplique

### 6. Navegacion

- sidebar para navegacion principal web
- tabs para secciones segmentadas
- breadcrumbs para navegacion secundaria desktop
- bottom-nav para mobile cuando el caso lo amerite

---

## Anti-patrones Historicos

- usar elementos raw cuando el catalogo ya cubre el caso
- mezclar componentes web y mobile en el mismo scope sin patron adaptativo
- decidir por intuicion cuando el catalogo ya tiene criterio
- usar `*ngIf="isMobile"` como solucion general de plataforma

---

## Relacion con Documentos Vigentes

- `./ui/ui-usage-catalog.md`
- `./ui/ui-desktop-rules.md`
- `./ui/ui-mobile-rules.md`

---

## Nota Final

Este documento se conserva como apoyo historico del arbol de componentes. La
autoridad vigente de seleccion ya no vive aqui, sino en el catalogo UI rector.
