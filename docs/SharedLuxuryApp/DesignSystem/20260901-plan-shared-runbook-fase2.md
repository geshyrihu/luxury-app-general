📍 **Ruta:** 📂 `docs/plans/execution` > 📄 `RUNBOOK-fase-2.md`

📅 **Última Revisión:** 08-Ago-2026
🛡️ **Estado:** Listo para ejecutar
👥 **Ejecutores:** OpenCode · KiloCode (relevo)
🧠 **Supervisor:** Claude

---

# 🔧 RUNBOOK — Fase 2: preparar el monolito para el desacople

> 🔴 **ANTES DE EMPEZAR:** lee `RELAY-PROTOCOL.md` completo. Sigue vigente sin cambios.
> Al terminar cada tarea, escribe en `LEDGER.md`.

**Qué es esta fase:** todo lo que hay que hacer **dentro del monolito** antes de extraer el
primer portal. **Ninguna tarea cambia el comportamiento visible de la aplicación.**

**Proyecto de trabajo:** `client/luxuryapp` — ⛔ `client/angular` está **congelado** (P1).

| Bloque | Objetivo | Tareas |
| :--- | :--- | :--- |
| 🅰️ **Sellar la deuda** | Que deje de crecer, aunque tarde meses en resolverse | 2.1 – 2.8 |
| 🅱️ **Navegación entre portales** | Que no se rompa el menú al extraer el primero | 2.9 – 2.14 |

---

# 🅰️ BLOQUE A — Sellar el crecimiento de la deuda

**El problema:** con extracción bajo demanda, la limpieza tarda tanto como tarden todos los
portales. Si mientras tanto alguien agrega una amarra nueva o un color hardcodeado, corremos
hacia atrás. El **modo baseline** congela lo existente y falla **solo ante lo nuevo**.

**Deuda medida el 08-Ago-2026 — toda preexistente:**

| Auditor | Estado | Magnitud |
| :--- | :--- | ---: |
| `audit:encoding` · `audit:emoji` · `audit:ui` | ✅ verde | — |
| `audit:apps` | ❌ | 72 amarras |
| `audit:design` | ❌ | 277 hallazgos |
| `audit:tokens` | ❌ | 162 colores hardcodeados |
| `audit:css` | ❌ | issues críticos |

---

## TAREA 2.1 — `.gitignore` para los artefactos de auditoría

**Riesgo:** 🟢

Correr `npm run lint` genera archivos que ensucian el árbol de git.

**Acción:** agregar al final de `.gitignore`:
```
# Artefactos generados por npm run lint
audit-report.json
audit-report.csv
/reports/
```

**Verificación:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
npm run lint > /dev/null 2>&1
git status --short | wc -l
```
Esperado: **`0`**. Si aparece algo, falta cubrirlo en `.gitignore`.

**Commit:** `[2.1] ignora artefactos generados por los audits`

---

## TAREA 2.2 — Modo baseline en `audit:apps`

**Riesgo:** 🔴 — es el patrón que copiarán las tareas 2.3 a 2.5. Hacerlo bien aquí.

**Concepto:**
```
Violación que YA existía  →  se tolera (esta en el baseline)
Violación NUEVA           →  falla el build
```

- [ ] 2.2.1 En `scripts/audit-apps-boundaries.mjs`, cargar `docs/audit/baseline-apps.json`
      si existe. Cada violación se identifica por una **clave estable**:
      `<archivo relativo>|<app prohibida importada>`.

> 🔑 **La clave NO debe incluir el número de línea.** Si lo incluye, cualquier edición del archivo
> desplaza las líneas y el baseline deja de calzar: violaciones viejas se reportarían como nuevas.

- [ ] 2.2.2 Comportamiento:
      - violación **en** el baseline → se cuenta como conocida, no falla
      - violación **fuera** del baseline → **falla** con exit 1
      - clave del baseline que **ya no aparece** → informar "resuelta" (no falla)
- [ ] 2.2.3 Soportar `--update-baseline` para regenerar el archivo.
- [ ] 2.2.4 Al final, imprimir siempre el resumen: `conocidas: N · nuevas: N · resueltas: N`.

**Verificación:**
```bash
node scripts/audit-apps-boundaries.mjs --update-baseline
node scripts/audit-apps-boundaries.mjs; echo "exit=$?"
```
Esperado: `exit=0` y el resumen indicando **72 conocidas, 0 nuevas**.

**Commit:** `[2.2] modo baseline en audit:apps`

---

## TAREA 2.3 — Modo baseline en `audit:tokens`, `audit:design` y `audit:css`

**Riesgo:** 🟡 — mismo patrón de 2.2, aplicado tres veces.

- [ ] 2.3.1 `scripts/audit-ds-tokens.mjs` → `docs/audit/baseline-tokens.json` (162 conocidas)
- [ ] 2.3.2 `scripts/audit-design-system.mjs` → `docs/audit/baseline-design.json` (277 conocidas)
- [ ] 2.3.3 `scripts/audit-css-classes.ts` → `docs/audit/baseline-css.json`

Misma regla de clave estable: **archivo + descripción de la violación, sin número de línea.**

> 🛑 Si en alguno la violación no se puede identificar sin la línea, **PARA y repórtalo**.
> Es una decisión de diseño, no la resuelvas por tu cuenta.

**Verificación:** cada uno con `--update-baseline` y luego sin flag → los tres **exit 0**.

**Commit:** `[2.3] modo baseline en tokens, design y css`

---


**Riesgo:** 🟡


- [ ] 2.4.1 Crear `scripts/audit-apps-ui-boundaries.mjs`.
- [ ] 2.4.2 **Excluir `.spec.ts`** — son pruebas, no se envían a producción y es legítimo que
- [ ] 2.4.3 **Excluir `herramientas-dev/catalog-component-ui/` y `conventions-viewer`** — su
- [ ] 2.4.4 Baseline en `docs/audit/baseline-apps-ui.json` (~9 conocidas).
- [ ] 2.4.5 Agregar `"audit:apps-ui": "node scripts/audit-apps-ui-boundaries.mjs"` a los scripts
      de `package.json` y encadenarlo en `lint`.

**Verificación:**
```bash
node scripts/audit-apps-ui-boundaries.mjs --update-baseline
node scripts/audit-apps-ui-boundaries.mjs; echo "exit=$?"
```
Esperado: `exit=0`, ~9 conocidas.


---

## TAREA 2.5 — `npm run lint` en verde

**Verificación:**
```bash
npm run lint; echo "exit=$?"
git status --short | wc -l
```
Esperado: **`exit=0`** y **`0`** cambios pendientes.

🛑 Si algún auditor falla, revisa su baseline. **No borres violaciones para que pase.**

**Commit:** `[2.5] npm run lint en verde con baselines`

---

## TAREA 2.6 — 🧪 Probar que el sello funciona de verdad

**Riesgo:** 🔴 — **la tarea más importante del bloque A.** Un sello que no falla no sirve de nada.

- [ ] 2.6.1 Introducir a propósito una violación **nueva**: en cualquier archivo de
      `apps/system.luxuryapp/`, agregar un import de otro portal.
- [ ] 2.6.2 `npm run lint` → debe **FALLAR** señalando esa violación como **nueva**.
- [ ] 2.6.3 Revertir el cambio (`git checkout -- <archivo>`).
- [ ] 2.6.4 `npm run lint` → debe **PASAR** otra vez.
- [ ] 2.6.5 Repetir 2.6.1–2.6.4 con un color hardcodeado en un `.scss` (prueba `audit:tokens`).

**Verificación:** los cuatro pasos se comportan como se describe.

🛑 Si el lint **no falla** al introducir la violación, el sello está roto. PARA y reporta.

> ℹ️ Esta tarea no deja cambios: es una prueba. Documenta el resultado en el LEDGER.

**Commit:** — (sin cambios; solo entrada en el LEDGER)

---

## TAREA 2.7 — Enganchar el lint al flujo de trabajo

**Riesgo:** 🟡

- [ ] 2.7.1 Configurar un hook **pre-push** que ejecute `npm run lint` y **aborte** si falla.
- [ ] 2.7.2 Documentar cómo saltarlo en una emergencia y por qué **no** debe volverse costumbre.

> ℹ️ Se elige **pre-push** y no pre-commit: el lint tarda y bloquear cada commit desespera.
> Pre-push es la última barrera antes de que el código salga del equipo.

**Verificación:** con una violación nueva sin commitear, `git push` se detiene.

**Commit:** `[2.7] hook pre-push con npm run lint`

---

## TAREA 2.8 — Documentar el modo baseline

**Riesgo:** 🟢

Agregar a `CONVENTIONS.md` una sección corta que explique:
- qué significa que un auditor esté en modo baseline
- que el baseline **solo puede bajar** — nunca se regenera para "arreglar" un fallo
- que `--update-baseline` se usa **únicamente** al resolver violaciones, nunca al introducirlas
- dónde viven los archivos (`docs/audit/baseline-*.json`)

**Commit:** `[2.8] documenta el modo baseline en CONVENTIONS.md`

---

# 🅱️ BLOQUE B — Navegación entre portales

> 🔴 **Esto es lo que rompería la aplicación en producción.** Sin esta preparación, el día que se
> extraiga el primer portal la navegación por menú falla para **todos** los usuarios.

## El problema, en concreto

```
BD  →  MenuItemDto.routerLink ("/committee/meeting-minutes")
    →  sidebar.html:  [routerLink]="item.routerLink"
    →  navegación interna de Angular, SIN recargar la página
```

Cuando `committee` sea su propia app en IIS:

> Un usuario dentro de `/admin/` hace clic en un ítem de Committee.
> Angular busca `/committee/...` **en la tabla de rutas de la app admin**.
> No existe → cae en el comodín `**` → **page404**.

## La solución

```
Destino en MI portal      →  routerLink   (rápido, sin recargar)
Destino en OTRO portal    →  href         (recarga; nginx enruta al sitio correcto)
```

> 🔑 **Y lo mejor: en el monolito esto es un no-op.**
> La lista de portales extraídos **empieza vacía**, así que *todo* sigue siendo `routerLink` y el
> comportamiento no cambia en absoluto. Se activa portal por portal — igual que los bloques
> comentados de `conf.nginx.conf`. Las dos listas avanzan juntas.

---

## TAREA 2.9 — Registro de portales extraídos

**Riesgo:** 🟢

- [ ] 2.9.1 Crear `core/navigation/portales-extraidos.ts`:

```ts
/**
 * Portales que YA se sirven como sitio independiente detras de nginx.
 *
 * Mientras un slug NO este en esta lista, los enlaces hacia el se resuelven
 * con routerLink (navegacion interna, sin recargar) — el comportamiento de hoy.
 *
 * Al extraer un portal se agrega su slug AQUI y se descomenta su bloque en
 * conf.nginx.conf. Las dos listas deben avanzar SIEMPRE juntas:
 *   - slug aqui pero location comentado  -> recarga que cae al monolito (lento, funciona)
 *   - location activo pero slug sin poner -> page404 (ROTO)
 */
export const PORTALES_EXTRAIDOS: readonly string[] = [
  // "web",        <- descomentar al publicar el portal web
  // "committee",
];
```

**Verificación:** `ng build --configuration development` verde.

**Commit:** `[2.9] registro de portales extraidos (vacio)`

---

## TAREA 2.10 — Servicio que decide el tipo de enlace

**Riesgo:** 🟡

- [ ] 2.10.1 Crear `core/navigation/portal-link.service.ts` con un método
      `esExterno(destino: string): boolean`:
      1. Tomar el **primer segmento** de la ruta destino (`/committee/x` → `committee`).
      2. Si ese segmento **no** está en `PORTALES_EXTRAIDOS` → `false` (interno, routerLink).
      3. Si **sí** está, y **no** es el slug del portal actual → `true` (externo, href).
      4. Si es el slug del portal actual → `false` (interno).
- [ ] 2.10.2 El slug del portal actual se lee de un `InjectionToken` (`PORTAL_ACTUAL`)
      que en el monolito vale `null`.
- [ ] 2.10.3 Manejar los casos borde sin reventar: destino `null`, vacío, relativo (sin `/`
      inicial), o con query string. Ante la duda → **interno** (comportamiento actual).

> 🔑 **Regla de diseño: ante cualquier duda, comportarse como hoy.** Un falso "interno" es un
> enlace lento; un falso "externo" es una recarga innecesaria. Ninguno rompe nada, pero el
> primero es más seguro.

- [ ] 2.10.4 Tests unitarios de los 4 casos + los borde.

**Verificación:** los tests pasan y `ng build` sigue verde.

**Commit:** `[2.10] servicio que decide enlace interno vs externo`

---

## TAREA 2.11 — Directiva `lxPortalLink`

**Riesgo:** 🟡

Una directiva única evita repetir la decisión en cada plantilla.

- [ ] 2.11.1 Crear `core/navigation/portal-link.directive.ts`, selector `[lxPortalLink]`:
      - destino **interno** → se comporta exactamente como `routerLink` (incluido `routerLinkActive`)
      - destino **externo** → renderiza `href` y navega con recarga completa
- [ ] 2.11.2 Debe aceptar `string` y `string[]`, igual que `routerLink`.

**Verificación:** con la lista de 2.9 vacía, la directiva se comporta **idéntico** a `routerLink`.

**Commit:** `[2.11] directiva lxPortalLink`

---

## TAREA 2.12 — Aplicar la directiva en los 5 puntos de menú

**Riesgo:** 🔴 — toca la navegación de toda la app.

Puntos exactos (verificados el 08-Ago-2026):

| # | Archivo | Línea(s) |
| :-- | :--- | :--- |
| 1 | `core/layout/employee-view/monitor/sidebar/sidebar.html` | 137 |
| 2 | `core/layout/employee-view/movil/footer-employee-mobile/footer-employee-mobile.html` | 5 |
| 3 | `core/layout/employee-view/movil/home-menu-mobile/home-menu-mobile.html` | 20, 39 |
| 4 | `core/layout/shared/profile-user-mobile/profile-user.html` | 43, 54 |
| 5 | `core/layout/committee-layout/monitor/mobile-nav.html` | *(revisar)* |

- [ ] 2.12.1 Sustituir `[routerLink]="X"` por `[lxPortalLink]="X"` en cada uno.
- [ ] 2.12.2 **Conservar** `routerLinkActive` y `routerLinkActiveOptions` donde existan.

> 🛑 Si encuentras un `[routerLink]` de menú **fuera** de esta lista, PARA y repórtalo:
> significa que hay un punto de navegación que no inventarié.

**Verificación:** `ng build` verde + navegar el menú en desktop y móvil: **todo igual que antes**
(la lista de 2.9 está vacía, así que nada cambia todavía).

**Commit:** `[2.12] aplica lxPortalLink en los puntos de menu`

---

## TAREA 2.13 — Navegación programática entre portales

**Riesgo:** 🟡

`router.navigate([...])` tiene el mismo problema que `routerLink`. Puntos detectados:

| Archivo | Línea | Destino |
| :--- | :-- | :--- |
| `core/layout/committee-layout/committee-mobile.ts` | 58 | `/dashboard/default` |
| `core/layout/committee-layout/monitor/mobile-nav.ts` | 31, 34, 37 | `/committee/*` |
| `core/layout/committee-layout/monitor/profile.ts` | 85 | `profileRoute()` |
| `core/layout/direccion-view/monitor/header-direccion-monitor/header-direccion-monitor.ts` | 93 | `ROUTES.DIRECCION.HOME` |

> 🛑 **ESTA TAREA ESTÁ A MEDIAS.** OpenCode la empezó el 08-Ago-2026 y se detuvo **sin commitear
> y con el build ROTO**. Antes de continuar, lee la entrada `[2.13-RELEVO]` del LEDGER.
> **Empieza por la tarea 2.13.0.**

### TAREA 2.13.0 — Arreglar el build heredado (hazlo PRIMERO)

**Síntoma:** `ng build` falla con **6 errores `TS2345`**, todos por la misma causa.

```
Argument of type 'readonly ["/dashboard"]' is not assignable to parameter of type 'string | string[]'.
The type 'readonly [...]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.
```

**Causa:** el método `navegar()` se declaró como `navegar(destino: string | string[])`, pero las
constantes de `ROUTES.*` son **tuplas `readonly`** (declaradas con `as const`). TypeScript no
permite pasar un `readonly string[]` donde se espera un `string[]` mutable.

**Solución** — en `core/navigation/portal-link.service.ts`, ampliar la firma:

```ts
// antes
navegar(destino: string | string[]): void

// despues
navegar(destino: string | readonly string[]): void
```

> 🔑 Es estrictamente más permisivo y no rompe nada: un `string[]` normal **sí** es asignable a
> `readonly string[]`. Los 6 errores se resuelven con este único cambio.
> Si `router.navigate()` se queja del tipo readonly adentro, pásale una copia: `[...destino]`.

**Archivos con error (para verificar que los 6 desaparecen):**
- `core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.ts` → líneas 330, 334, 338, 342, 346
- `core/layout/employee-view/monitor/notifications-gadget/notifications-gadget.ts` → línea 93

**Verificación:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
npx ng build --configuration development
```
Esperado: **exit 0**. 🛑 Si sigue fallando, PARA y reporta el error literal.

---

- [ ] 2.13.1 Agregar al servicio de 2.10 un método `navegar(destino)` que use `router.navigate`
      si es interno y `window.location.href` si es externo.
      **Firma correcta:** `navegar(destino: string | readonly string[]): void` — ver 2.13.0.
      ✅ *Ya implementado por OpenCode (pendiente el ajuste de firma).*
- [ ] 2.13.2 Sustituir esos `router.navigate` por `navegar(...)`.
- [ ] 2.13.3 Barrer `core/layout/**` buscando más `router.navigate` / `navigateByUrl`
      de navegación entre secciones. **Ignorar los `.spec.ts`.**

**Verificación:** `ng build` verde + los botones de esas pantallas siguen funcionando igual.

**Commit:** `[2.13] navegacion programatica entre portales`

---

## TAREA 2.14 — 🧪 Probar el mecanismo antes de necesitarlo

**Riesgo:** 🔴 — **la tarea más importante del bloque B.**

No podemos esperar a la extracción real para descubrir si esto funciona.

- [ ] 2.14.1 Agregar temporalmente `"committee"` a `PORTALES_EXTRAIDOS`.
- [ ] 2.14.2 `ng serve` y hacer clic en un ítem de menú de Committee desde otra sección.
- [ ] 2.14.3 Confirmar que hace una **recarga completa** (no navegación interna) y **aun así
      llega a la pantalla correcta** — porque en el monolito esa URL la sigue sirviendo `:8050`.
- [ ] 2.14.4 Confirmar que **no pide login otra vez** (la cookie de sesión sobrevive la recarga).
- [ ] 2.14.5 Confirmar que los enlaces a secciones **no** extraídas siguen sin recargar.
- [ ] 2.14.6 **Quitar** `"committee"` de la lista y dejarla vacía.

> 🔑 **Por qué esta prueba es sólida:** en el monolito, una recarga a `/committee/...` la sirve el
> mismo sitio. O sea, se puede probar **el mecanismo completo sin haber extraído nada** y sin
> riesgo. Si algo falla, falla aquí y no en producción.

**Verificación:** los pasos 2.14.3, 2.14.4 y 2.14.5 se cumplen, y la lista queda vacía al final.

**Commit:** `[2.14] verificacion del mecanismo de navegacion entre portales`

---

## TAREA 2.15 — 🧹 Limpieza posterior a la prueba

**Agente:** el que esté en turno
**Riesgo:** 🟡 — incluye revertir un cambio de **seguridad**.

> La prueba 2.14.B dejó cuatro cosas que **no deben quedarse**. La app funciona igual con o sin
> ellas, así que es fácil olvidarlas — y una es un guard de seguridad.

- [ ] 2.15.1 **Restaurar `PORTALES_EXTRAIDOS` a vacía.**
      En `core/navigation/portales-extraidos.ts`, volver a comentar `"committee"`.
      Debe quedar solo con las dos líneas comentadas.

- [ ] 2.15.2 🔴 **Revertir `core/auth/guards/committee.guard.ts`.**
      El usuario lo modificó **solo para poder entrar a Committee durante la prueba**.
      Es un guard de **seguridad**: si viaja así, cualquiera accede al portal de Committee.
      ```bash
      git checkout -- projects/luxury-app/src/app/core/auth/guards/committee.guard.ts
      ```
      🛑 Si el diff sugiere que el cambio **no** era solo para la prueba, PARA y pregunta.

- [ ] 2.15.3 **Borrar el grupo temporal de tarjetas** en
      `apps/admin.luxuryapp/admin-wrapper/admin-modules.ts`.
      Está marcado con `🧪 TEMPORAL — BANCO DE PRUEBAS DE NAVEGACION ENTRE PORTALES`.
      Borrar el objeto completo del arreglo.
      ⚠️ **No toques `admin-wrapper.ts`** — su cambio (`navegar()` en vez de `router.navigateByUrl`)
      es una corrección real y **se queda**.

- [ ] 2.15.4 **Ignorar `documentation.json`** (48.6 MB, salida de compodoc). Agregar a `.gitignore`:
      ```
      documentation.json
      ```

**Verificación:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
grep -c '^\s*"committee"' projects/luxury-app/src/app/core/navigation/portales-extraidos.ts   # -> 0
grep -c "TEMPORAL — BANCO DE PRUEBAS" projects/luxury-app/src/app/apps/admin.luxuryapp/admin-wrapper/admin-modules.ts  # -> 0
git status --short | grep -c "committee.guard.ts"   # -> 0
npx ng build --configuration development            # -> exit 0
npm run lint                                        # -> exit 0
```

**Commit:** `[2.15] limpieza posterior a la prueba de navegacion`

---

# 🛑 FIN DE LA FASE 2 — ALTO OBLIGATORIO

**No abras la Fase 3.** Detente y espera revisión del supervisor.

**Checklist de cierre:**

- [ ] `npm run lint` → **exit 0** con baselines
- [ ] El lint **falla** ante una violación nueva y **tolera** las preexistentes (probado en 2.6)
- [ ] Hook pre-push activo
- [ ] `git status` limpio después de correr el lint
- [ ] `PORTALES_EXTRAIDOS` existe y está **vacía**
- [ ] `lxPortalLink` aplicada en los 5 puntos de menú
- [ ] Navegación probada con un portal simulado y la lista **restaurada a vacía** (2.14)
- [ ] `ng build` dev y prod verdes
- [ ] **Cero cambios de comportamiento visible** — la app se ve y navega igual que al empezar
- [ ] Un commit por tarea

> ✅ **Al cerrar la Fase 2 la app funciona exactamente igual que antes.** Eso es el éxito:
> toda la preparación es invisible. Lo que cambió es que la deuda ya no crece y la navegación
> está lista para el primer portal.
