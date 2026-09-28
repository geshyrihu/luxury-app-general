# Regla Crítica: Iconos (Material Symbols Light vía catálogo)

**Versión:** 2.0
**Fecha:** 2026-08-31
**Severidad:** 🔴 CRÍTICA
**Aplica a:** Todo el frontend Angular (web y móvil)

---

## Por qué esta regla existe

El 2026-08-11 se descubrieron **606 iconos en blanco en producción**. Ninguna
compilación falló, ninguna consola avisó, ninguna prueba se puso en rojo.

La causa: una migración anterior cambió el prefijo `mdi:` →
`material-symbols-light:` sin traducir el nombre en todo lo que el compilador no
podía ver. `mdi:file-pdf-box` quedó como `material-symbols-light:file-pdf-box`,
que no existe.

Y ese es el punto que hay que interiorizar:

> **Un nombre de icono inexistente NO falla.** `<iconify-icon>` no encuentra el
> icono y no dibuja nada. Sin error de compilación, sin aviso por consola, sin
> excepción. Solo se ve abriendo la pantalla.

Por eso la validación es un **gate automático** y no una revisión visual: una
revisión visual no escala a 4.000 usos, y el ojo humano ya demostró que no los
ve todos.

---

## La regla explícita

### 1. Un solo paquete de iconos

**`material-symbols-light`**, para web y para móvil. No se mezclan sets.

| Formato | Estado |
|:---|:---|
| `material-symbols-light:*` vía `<app-icon>` | ✅ estándar web |
| `material-symbols-light:*` vía `<ili-icon>` | ✅ estándar móvil (resuelve a ionicon) |
| `material-symbols-light:*` vía `<lx-icon>` | ✅ adaptativo (bifurca web/móvil) |
| `mdi:*` | ❌ retirado (0 usos) |
| `pi pi-*` (clases de PrimeIcons) | ❌ retirado (0 usos vivos) |
| `fluent-color:*` | ⚠️ solo en `icon-preload.service.ts`; no en plantillas |
| `ion-icon` | ⚠️ permitido solo en `shared/ui/mobile/**` |

PrimeIcons sigue instalado porque PrimeNG lo usa internamente. **Eso no autoriza
a escribir la clase a mano en ninguna plantilla propia.**

### 2. Todo icono sale del catálogo

Fuente única: `appsweb/angular/src/app/shared/ui/shared/app-icon/app-icon.catalog.ts`

```ts
export const AppIcon = {
  Add: "material-symbols-light:add",
  Delete: "material-symbols-light:delete",
  // …367 valores distintos bajo 537 roles
} as const;

export type AppIconName = (typeof AppIcon)[keyof typeof AppIcon];
```

`AppIconName` es la unión de los valores del catálogo. El input de `<app-icon>`
está tipado con él, así que un literal inventado **en un binding tipado** sí es
error de compilación.

```html
<!-- ✅ CORRECTO -->
<app-icon icon="material-symbols-light:add" />
<app-icon [icon]="item.icon" />

<!-- ❌ PROHIBIDO: nombre que no está en el catálogo -->
<app-icon icon="material-symbols-light:me-lo-invento" />
```

### 3. ⚠️ El input `icon` de PrimeNG NO entiende Iconify

**Esta es la trampa que costó 27 sitios y no es evidente.**

Los componentes de PrimeNG que reciben un icono lo pintan como **clase CSS**:

```html
<span [class]="icon"></span>
```

Con `pi pi-home` funcionaba, porque es una clase real de PrimeIcons. Con
`material-symbols-light:home` queda un `<span>` con dos clases inventadas y
**nada dentro**.

Afecta a `p-button`, `p-scrolltop`, `p-breadcrumb` (a través de `MenuItem.icon`),
`p-menu`, `p-menubar`, `p-tabmenu`, `p-contextmenu`, `p-panelmenu` y a cualquier
API basada en `MenuItem`.

**La solución es la plantilla de icono que PrimeNG ofrece.** Solo se usa cuando
el input `icon` está **ausente** (`@if (!icon() && iconTemplate())`), así que hay
que quitarlo:

```html
<!-- ❌ PROHIBIDO: renderiza vacío -->
<p-button icon="material-symbols-light:add" label="Agregar" />

<!-- ✅ CORRECTO -->
<p-button label="Agregar">
  <ng-template #icon>
    <app-icon icon="material-symbols-light:add" />
  </ng-template>
</p-button>
```

Para componentes basados en `MenuItem`, el icono va en la plantilla `#item`, no
en el modelo. Referencia viva:
`src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.html`

```html
<p-breadcrumb [model]="breadcrumbItems">
  <ng-template #item let-item>
    <a class="p-breadcrumb-item-link" [routerLink]="item.routerLink">
      @if (item.icon) {
        <app-icon [icon]="item.icon" class="p-breadcrumb-item-icon" />
      }
      @if (item.label) {
        <span class="p-breadcrumb-item-label">{{ item.label }}</span>
      }
    </a>
  </ng-template>
</p-breadcrumb>
```

### 4. Declarar `AppIcon` en `imports`

`<app-icon>` sin declarar **no se instancia**: no hay icono y, con
`strictTemplates: false`, tampoco hay error. Todo componente que lo use debe
tenerlo en su arreglo `imports`.

### 5. Componentes adaptativos: `<ili-icon>` y `<lx-icon>`

La migración del 2026-08-31 introdujo dos componentes para soporte móvil:

**`<ili-icon>`** (`shared/ui/mobile/app-icon/app-icon.ts`):
- Envuelve `<ion-icon>` de ionicons
- Resuelve nombres del catálogo (ej. `material-symbols-light:add`) a
  equivalentes ionicon vía `app-icon.catalog-ionicon.ts`
- Solo se usa dentro de `shared/ui/mobile/**`
- Requiere `AppIconMobile` en `imports`

**`<lx-icon>`** (`shared/ui/adaptive/icon/icon.ts`):
- Wrapper adaptativo que bifurca entre `<app-icon>` (web) y `<ili-icon>`
  (móvil) usando `PlatformService.isMobile()`
- Para uso en componentes compartidos que ejecutan en ambas plataformas
- Requiere `LxIcon` en `imports`

**Regla de selectors:**
- Componentes en `shared/ui/shared/**` → usan `<app-icon>`
- Componentes en `shared/ui/mobile/**` → usan `<ili-icon>`
- Componentes en `shared/ui/adaptive/**` → usan `<lx-icon>`

### 6. Spinners

`pi-spin` / `pi-spinner` no se usan. El indicador de carga es el componente del
DS: `<lx-spinner>` (adaptativo) o `<app-spinner>` (web).

### 7. Guion vs guion bajo en nombres de Iconify

Material Symbols Light usa **guion** (`-`) como separador interno en los
nombres de Iconify, **nunca guion bajo** (`_`). Los nombres con guion bajo
**no existen** y `<iconify-icon>` los entrega en `not_found`: el icono no
dibuja sin error de compilación ni de consola.

| ✅ válido | ❌ NO existe |
|:---|:---|
| `material-symbols-light:confirmation-number` | `material-symbols-light:confirmation_number` |
| `material-symbols-light:airplane-ticket` | `material-symbols-light:airplane_ticket` |
| `material-symbols-light:local-activity` | `material-symbols-light:local_activity` |

Este fue el bug que dejó los iconos de **Ticket Vacante / Ticket Baja /
Ticket Salario** invisibles en `staff-board-list.html` del módulo
`recursos-humanos.luxuryapp` (2026-09-02). La falla fue doble: literal con
guion bajo directo en plantilla (no pasaba por el catálogo) y nombres
semánticos faltantes.

**Reglas de alta:**

1. El nombre se valida **antes** contra la API de Iconify con la URL del
   procedimiento de alta (§"Dar de alta un icono nuevo" abajo).
2. Si el nombre conceptual ya existe con guion bajo en código legacy
   (migración incompleta desde mdi:/pi pi-), se corrige a guion **y** se
   da de alta el rol semántico en el catálogo.
3. Nunca se usan nombres con guion bajo en plantilla propia.

**Roles semánticos vigentes para tickets** (alta 2026-09-02,
`app-icon.catalog.ts`):

| Rol | Iconify |
|:---|:---|
| `TicketVacancy` | `material-symbols-light:confirmation-number` |
| `TicketDismissal` | `material-symbols-light:airplane-ticket` |
| `TicketSalaryModification` | `material-symbols-light:local-activity` |
| `TicketConfirmation` | `material-symbols-light:confirmation-number` |
| `TicketOutline` | `material-symbols-light:confirmation-number` |

---

## Dar de alta un icono nuevo

Este es el procedimiento completo. **No te saltes el paso 1.**

**1. Verifica que el nombre existe de verdad**, contra el set real de Iconify —no
contra tu memoria, y no contra el listado de la colección, que incluye alias y
ocultos que no siempre se sirven:

```bash
curl -s "https://api.iconify.design/material-symbols-light.json?icons=NOMBRE" \
  | python -c "import sys,json; d=json.load(sys.stdin); \
      print('SIRVE:', list(d.get('icons',{}).keys())); \
      print('NO:', d.get('not_found',[]))"
```

Si aparece en `not_found`, ese nombre **no dibuja nada**. Busca el equivalente
real; los nombres de mdi rara vez coinciden con los de Material Symbols
(`file-pdf-box` → `picture-as-pdf`, `eye-outline` → `visibility-outline`,
`close-circle` → `cancel`, `content-save` → `save`, `plus` → `add`).

**2. Da de alta el concepto en el catálogo**, en orden alfabético, con un nombre
de rol que describa **el concepto**, no el icono de destino:

```ts
CheckSmall: "material-symbols-light:check-small",
```

**3. Úsalo desde el catálogo.** No repitas el literal si ya existe un rol.

**4. Ejecuta el gate:**

```bash
npm run audit:icon-names
```

---

## Auditoría: validaciones

### Gate automático

`appsweb/angular/scripts/audit-icon-names.mjs`, dentro de `npm run audit:ds` y del
workflow `design-system.yml`. Comprueba dos cosas:

1. Todo literal `material-symbols-light:*` del código es un valor declarado en el
   catálogo.
2. No hay clases `pi pi-*` fuera de la lista de permitidos.

Valida **contra el catálogo**, no contra la API de Iconify: es offline,
determinista, y obliga a que cada alta pase por la traducción revisada.

**Lo que el gate NO puede ver** (declarado a propósito en el propio script): los
nombres que se arman en ejecución. `resolveToIconify` termina en
`` `material-symbols-light:${cleanName}` `` para cualquier nombre no mapeado. Ahí
nace la falla muda y ningún análisis estático llega. La defensa es que todo
nombre que llegue esté en `PRIME_TO_ICONIFY`.

### Búsquedas manuales

```bash
# ❌ Clases de PrimeIcons en plantillas propias
grep -rn "pi pi-" src/app --include=*.html --include=*.ts
# Esperado: 0 (salvo icon-mapping.ts, que las QUITA de datos heredados)

# ❌ Prefijo mdi (paquete retirado)
grep -rn "mdi:" src/app
# Esperado: 0

# ❌ Iconify dentro de un componente PrimeNG
grep -rn -B2 'icon="material-symbols-light' src/app | grep "<p-"
# Esperado: 0 — debe ir por <ng-template #icon>

# ❌ <app-icon> usado sin declarar en imports
# (ver scripts/audit-icon-names.mjs; el compilador no lo ve con strictTemplates:false)

# ❌ <ili-icon> usado sin declarar AppIconMobile en imports
grep -rn "<ili-icon" src/app --include=*.html --include=*.ts | \
  while read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    if ! grep -q "AppIconMobile" "$file"; then
      echo "FALTA: $file"
    fi
  done
# Esperado: 0
```

### Impacto en auditoría de módulo

| Hallazgo | Severidad |
|:---|:---|
| Literal fuera del catálogo | 🔴 CRÍTICO — icono invisible |
| Iconify en un input `icon` de PrimeNG | 🔴 CRÍTICO — icono invisible |
| `pi pi-` en plantilla propia | 🟠 ALTO |
| `<app-icon>` sin declarar en `imports` | 🔴 CRÍTICO — icono invisible |
| `<ili-icon>` sin declarar `AppIconMobile` en `imports` | 🔴 CRÍTICO — icono invisible |
| Literal repetido teniendo rol en catálogo | 🟡 MEDIO |

---

## Checklist pre-entrega

- [ ] `npm run audit:icon-names` en verde
- [ ] Todo icono nuevo verificado contra el set real de Iconify **antes** de usarlo
- [ ] Ningún componente PrimeNG recibe un identificador de Iconify en `icon`
- [ ] `AppIcon` declarado en `imports` de todo componente web que use `<app-icon>`
- [ ] `AppIconMobile` declarado en `imports` de todo componente móvil que use `<ili-icon>`
- [ ] `LxIcon` declarado en `imports` de todo componente adaptativo que use `<lx-icon>`
- [ ] Cero `pi pi-` y cero `mdi:` en plantillas propias
- [ ] Revisado **en pantalla** que los iconos nuevos se dibujan (el gate confirma
      que el nombre existe, no que sea el icono correcto)

---

## Referencias

- Catálogo web: `appsweb/angular/src/app/shared/ui/shared/app-icon/app-icon.catalog.ts`
- Catálogo ionicon: `appsweb/angular/src/app/shared/ui/shared/app-icon/app-icon.catalog-ionicon.ts`
- Componente web: `appsweb/angular/src/app/shared/ui/shared/app-icon/app-icon.ts`
- Componente móvil: `appsweb/angular/src/app/shared/ui/mobile/app-icon/app-icon.ts`
- Componente adaptativo: `appsweb/angular/src/app/shared/ui/adaptive/icon/icon.ts`
- Resolutor de nombres heredados: `appsweb/angular/src/app/shared/utils/icon-mapping.ts`
- Gate: `appsweb/angular/scripts/audit-icon-names.mjs`
- Historia completa del incidente y su reparación:
  `docs/SharedLuxuryApp/DesignSystem/20260809-plan-design-system-remediacion.md`
  (sección «Cierre de la migración de iconos — 606 iconos en blanco»)
- `CONVENTIONS.md` §5.5 (jerarquía de iconografía) y §6.1 (regla crítica)

## Regla de deuda de dependencias de iconos (RN-DS-009)

Un **wrapper por plataforma**, no un paquete por plataforma. Una dependencia de iconos con cero usos es deuda y se retira; una con wrapper, mapeo y CSP declarada es el estándar y no se retira.

- `feather-icons` se desinstaló por tener 0 usos.
- `iconify-icon` se conserva vía `<app-icon>` (wrapper, mapeo en `shared/utils/icon-mapping.ts` y CSP declarada).
- PrimeIcons permanece instalado porque PrimeNG lo usa internamente; eso NO autoriza a escribir `pi pi-*` en plantillas (la regla de uso está arriba).
- **Decisión abierta (no un descuido):** `iconify-icon` resuelve los iconos contra `api.iconify.design` en tiempo de ejecución; no hay paquete offline instalado.
