# Continuidad — cierre de la migración de iconos

Trabajas en `d:\repos\luxuryapp-api\client\angular`, que **es un repositorio git
propio** (la raíz `luxuryapp-api` NO lo es: contiene tres repos independientes).
Todos los comandos se ejecutan desde `client/angular`.

Sigue las fases en orden. **Detente al final de cada una y reporta** antes de
seguir. No adelantes trabajo de fases posteriores.

---

## Reglas que no se negocian

1. **No arregles lo que no esté en tu fase.** Si encuentras un defecto ajeno,
   anótalo y repórtalo; no lo toques.
2. **Nunca escribas credenciales en un archivo del repositorio.** El diagnóstico
   con navegador las lee de `A11Y_USER` / `A11Y_PASS`. El usuario te las da; van
   en el entorno del comando, jamás en código, ni en un `.json`, ni en un script.
3. **Verifica que un control puede fallar, no solo que pasa.** Si añades o tocas
   un gate, introduce a propósito el defecto que debe cazar, comprueba que falla,
   y restaura. Un control que no puede fallar no es un control.
4. **No confíes en un comando que no viste correr en el directorio correcto.**
   `npx ngc` desde la raíz del contenedor devuelve «0 errores» y es mentira.
   Confirma con `pwd` cuando dudes.
5. Los scripts temporales van al directorio de scratchpad, **no al repositorio**.

---

## Estado de partida (ya hecho, no lo repitas)

La migración `mdi:` → `material-symbols-light:` está cerrada:

| | |
|:---|---:|
| `mdi:` en el código | 0 |
| Nombres de icono inválidos | 0 |
| `pi pi-` | 8, todos inertes (ver Fase 4) |
| Literales corregidos | 606 |
| Hosts PrimeNG reparados | 26 |

Se añadió `scripts/audit-icon-names.mjs` (`npm run audit:icon-names`, dentro de
`audit:ds` y del workflow). Exige que todo literal `material-symbols-light:*`
sea un valor declarado en `app-icon.catalog.ts`, y bloquea el regreso de
`pi pi-`. Ambas comprobaciones se verificaron en fallo.

**Contexto de por qué el barrido de la Fase 3 importa:** la Fase 4 del agente
anterior cambió el prefijo sin traducir el nombre en todo lo que el compilador
no veía (inputs `string` como `iconClass`, datos en `.ts`). Dejó 606 iconos en
blanco sin un solo error. `<iconify-icon>` con un nombre desconocido no avisa:
no dibuja. Esa es la forma de fallo que hay que seguir buscando.

---

## FASE 1 — `strictTemplates` — RESUELTA (2026-08-11)

**Ya está en `false` y así debe quedarse. No la vuelvas a activar salvo para un
barrido puntual, y devuélvela a `false` en el mismo turno.**

Queda constancia porque se discutió: un agente propuso dejarla en `true`
argumentando —con razón de fondo— que con `false` se vuelve invisible la clase
de fallo que rompió el header. El argumento es correcto y la conclusión no,
porque la evidencia lo zanja:

| | `ngc --noEmit` | `ng build` |
|:---|---:|:---|
| `strictTemplates: true` | 847–849 errores | **exit 1 — no compila** |
| `strictTemplates: false` | 23 errores | exit 0 |

Con `true` la aplicación no se puede construir ni desplegar. La salida no es
dejar el interruptor encendido, sino **saldar la deuda que destapa y encenderlo
después**; esa decisión está abierta y documentada en
`docs/plans/20260809-design-system-remediacion-integral-plan.md`.

Verificación:

```bash
npx ngc -p tsconfig.json --noEmit 2>&1 | sed -e 's/\x1b\[[0-9;]*m//g' | grep -c ' - error '
```

```bash
# 1. Cambia el valor a false. No toques el comentario que lo explica.
# 2. Verifica:
npx ngc -p tsconfig.json --noEmit 2>&1 | sed -e 's/\x1b\[[0-9;]*m//g' | grep -c ' - error '
```

**Criterio de aceptación:** el conteo da **23**. Esos 23 son preexistentes y
ajenos a iconos (15 de HTML mal cerrado en `catalog-guia.html`, 4 de `p-card`
sin importar, 4 de API de componentes). No los arregles.

**Reporta:** el conteo obtenido.

---

## FASE 2 — Confirmar que el header vuelve a pintarse

Había un fallo visible: el topbar y el sidebar salían vacíos. La causa era un
`TypeError: ctx_r1.iconName is not a function` en `DataViewMobile`: la plantilla
llamaba a un método que la clase no tiene. Una excepción así corta el ciclo de
detección de cambios y deja vistas enteras sin pintar.

Ya se corrigieron los tres puntos de esa causa:

- `src/app/shared/ui/mobile/data-view-mobile/data-view-mobile.html:25`
- `src/app/shared/ui/mobile/bottom-nav/bottom-nav.ts:26-27`
- `src/app/shared/ui/base/bottom-nav.base.ts` (`activeIcon` pasó de `string` a
  `AppIconName`, que era la incoherencia de origen)

**⚠️ Corrección (2026-08-11): `iconName()` es un patrón legítimo, no un error.**

Está implementado como `protected iconName()` en varias bases del DS —
`breadcrumbs.base.ts`, `context-menu.base.ts`, `dock.base.ts`,
`mega-menu.base.ts`, `menubar.base.ts`— y lo usan unos 15 sitios que funcionan
bien. **No los toques.**

El fallo era distinto: `data-view-mobile` y `bottom-nav` lo invocaban sin que su
base lo definiera. Ahí los tipos ya eran `AppIconName`, así que se resolvió
usando el valor directo.

La comprobación correcta no es «que no aparezca `iconName(`», sino **que todo
`iconName(` invocado esté definido en la clase o en su base**:

```bash
# Dónde se invoca
grep -rn "iconName(" src/app --include=*.ts --include=*.html | grep -v "protected iconName"
# Dónde está definido
grep -rn "protected iconName" src/app --include=*.ts
```

Para cada componente que lo invoque, confirma que su cadena de herencia lo
define. Si no, resuélvelo como los dos anteriores: usa el valor directo si ya es
`AppIconName`, o añade el método a su base si hace falta convertir.

**Luego comprueba en el navegador.** Levanta front y back, y ejecuta un script
de Playwright **desde el scratchpad** que inicie sesión y vuelque:

- errores de consola y `pageerror`
- si `.monitor-header-toolbar` existe y cuántos hijos tiene
- cuántos `<iconify-icon>` hay y cuántos no tienen `svg`

Las credenciales van por entorno:

```bash
A11Y_USER='...' A11Y_PASS='...' node <ruta-scratchpad>/diag.mjs
```

El paquete se resuelve por ruta absoluta porque el script vive fuera del repo:

```js
const { chromium } = await import(
  'file:///D:/repos/luxuryapp-api/client/angular/node_modules/playwright/index.mjs'
);
```

**Criterio de aceptación:** cero `pageerror`, el toolbar existe con hijos, y el
header muestra texto. Los `net::ERR_ABORTED` contra
`api.iconify.design/fluent-color:*` son de `icon-preload.service.ts` y ya
estaban; ignóralos en esta fase (van en la Fase 5).

**Reporta:** la captura y el volcado. Si el header sigue vacío, **detente y
reporta el error de consola**; no empieces a cambiar cosas a ver si suena.

---

## FASE 3 — Las 17 llamadas a métodos inexistentes

Con `strictTemplates: true` afloraron 19 plantillas que invocan miembros que la
clase no tiene. Dos eran de iconos y ya están. **Quedan 17, ajenas a iconos.**

Distinción que importa: `ctx.foo` inexistente devuelve `undefined` y no rompe;
`ctx.foo()` inexistente lanza `TypeError`. Solo interesan las invocadas.

Las conocidas:

| Archivo | Miembro |
|:---|:---|
| `recursos-humanos-admin/incident-type-list/incident-type-list.html:99` | `onEdit()` |
| `recursos-humanos-admin/sanction-type-list/sanction-type-list.html:117` | `onEdit()` |
| `shared/ui/web/tree-table/tree-table.ts:91` | `summaryTemplate()` |
| `employee-external/employee-external-list.html:88,138` | `onDelete()` |
| `ar/catalogo-gastos-fijos/catalogo-gastos-fijos-list.html:356` | `crearOrder()` |
| `general-ledger/catalogo-gastos-fijos/catalogo-gastos-fijos-list.html:356` | `crearOrder()` |
| `budgeting/expense-catalog-detail/gasto-fijo-servicios.html:32,111` | `onCardEmployee()` |
| `general-ledger/expense-catalog-detail/gasto-fijo-servicios.html:32,117` | `onCardEmployee()` |
| `inventory-engine-system/inventory-engine-system.html:43` | `showModalListOrderService()` |
| `leave-request/mi-permiso-detalle.html:95` | `onEdit()` |

**`summaryTemplate()` es el más grave**: está dentro de un `@if`, así que revienta
al pintar, no al hacer clic. Los demás son manejadores de eventos: fallan cuando
el usuario pulsa.

**Regla para esta fase: NO inventes la implementación.** Para cada uno, averigua
si el método existía y se renombró (mira el historial de git del archivo) o si
la plantilla se copió de otro componente. Si no puedes determinar la intención
con evidencia, **repórtalo sin tocarlo**. Un `onEdit()` inventado que abre el
modal equivocado es peor que un botón que no responde.

Para regenerar la lista completa: pon `strictTemplates` en `true`, compila,
filtra los `TS2339` cuya propiedad aparezca invocada con paréntesis en la línea
de origen, y **vuelve a dejarlo en `false`**.

**Reporta:** cuáles resolviste con evidencia, cuáles dejaste y por qué.

---

## FASE 4 — Limpieza menor

1. `header-employee-monitor.html:471` — un `<p-button>` que estaba **comentado**
   fue reescrito por un script que no respeta comentarios HTML. Sigue dentro del
   comentario y es inerte, pero es suciedad. Déjalo como estaba o borra el
   comentario entero si ya no aporta.

2. Los 8 `pi pi-` restantes **no se tocan**. Son, y así debe quedar:
   - 4 comentarios que explican por qué se retiró el formato
   - 1 aserción en `icon-mapping.spec.ts` que verifica la tolerancia de entrada
   - 2 `.replace(/^pi pi-/, "")` en `icon-mapping.ts`, que **quitan** el prefijo
     si llega en datos ya guardados en base de datos

   Si alguien quiere eliminar también esa tolerancia, hace falta migrar los
   datos primero. Es decisión del Tech Lead, no de esta tarea.

---

## FASE 5 — Informe y hallazgos escalados

Ejecuta y adjunta la salida:

```bash
npm run audit:ds          # 5 gates, deben ir todos en verde
npx ngc -p tsconfig.json --noEmit 2>&1 | sed -e 's/\x1b\[[0-9;]*m//g' | grep -c ' - error '
npx ng build --configuration development   # debe terminar en exit 0
```

Y **confirma explícitamente** que `tsconfig.json` línea 54 dice `false`.

### Pendientes que NO son de esta tarea (repórtalos, no los arregles)

- **`icon-preload.service.ts` precarga 8 iconos `fluent-color` que fallan** con
  `net::ERR_ABORTED`. El servicio ya ignora el error, pero son 8 peticiones
  inútiles en cada arranque. O se corrigen o se retira la precarga.
- **Dependencia del CDN de Iconify en ejecución.** Sin red, la aplicación se
  queda sin iconos. No hay paquete offline instalado. Decisión pendiente.
- **`resolveToIconify` fabrica nombres** como último recurso
  (`` `material-symbols-light:${cleanName}` ``). Ahí nace la falla muda: si el
  nombre no existe, no dibuja y nadie se entera. Está documentado en el propio
  archivo. El gate no alcanza lo que se arma en ejecución.
- **169 `variant="outlined"`** en botones: el tipo válido es `"outline"`. Esos
  botones renderizan **sólidos** en producción hoy. Ticket propio.
- **`strictTemplates: false`** significa que ninguna plantilla de la aplicación
  se valida. Los 763 defectos que oculta están en
  `docs/plans/20260809-design-system-remediacion-integral-plan.md`. La decisión
  de saldarlos y dejar el interruptor en `true` sigue abierta.
