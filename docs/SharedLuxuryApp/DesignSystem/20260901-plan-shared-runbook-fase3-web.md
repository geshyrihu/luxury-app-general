📍 **Ruta:** 📂 `docs/plans/execution` > 📄 `RUNBOOK-fase-3-web.md`

📅 **Última Revisión:** 08-Ago-2026
🛡️ **Estado:** Listo para ejecutar
👥 **Ejecutores:** OpenCode · KiloCode · **Usuario** (pasos de servidor)
🧠 **Supervisor:** Claude

---

# 🚀 RUNBOOK — Fase 3, portal piloto: `web`

> 🔴 **ANTES DE EMPEZAR:** lee `RELAY-PROTOCOL.md`, incluida la **§4.bis** (detenerse a media tarea).
> Escribe en `LEDGER.md` después de cada tarea.

**Esta es la primera extracción real.** Lo que se aprenda aquí se convierte en la receta para
los otros 17 portales.

---

## 0. Por qué `web` es el piloto

| Criterio | Medición |
| :--- | :--- |
| Amarras con otros portales | **0** |
| Rutas dispersas en `routing/` | **0** — todas viven en `apps/web.luxuryapp/` |
| **Imports internos** (`core/`, `shared/`, `@ui/`) | **0** — verificado |
| Uso de `environment` | **0** |
| Dependencias externas | 1 paquete npm (`@swimlane/ngx-graph`) |
| Tamaño | 72 archivos (26 `.ts`) |
| Riesgo de negocio | Bajo — es el sitio de marketing |
| **¿Cambia su URL?** | **NO** — sigue siendo `/web/` |

> 🎯 **`web` no depende de nada del monolito.** Es prácticamente copiar una carpeta.
> Del Design System solo usa las clases CSS `card` (102 usos) y `btn` (17) — ningún componente.

---

## 🔙 El plan de rollback (léelo ANTES de empezar)

En cualquier momento después del paso 3.7, si algo sale mal:

```
1. Comentar el bloque  location /web/  en C:\nginx\conf\nginx.conf
2. nginx -t  &&  nginx -s reload
3. Comentar "web" en portales-extraidos.ts (si ya se activó) y redesplegar el monolito
```

**El tráfico vuelve al monolito en segundos**, porque el monolito **conserva** el portal `web`.
Por eso **NO se borra `apps/web.luxuryapp/` del monolito** en esta fase.

> 🔑 **Regla de oro de la Fase 3: el monolito no pierde nada hasta que el portal esté validado
> en producción durante varios días.** La duplicación temporal es intencional — es el seguro.

---

# 🅰️ BLOQUE A — Servidor (tareas del USUARIO)

> ⚠️ Estas tareas las hace el **usuario** en el servidor. El agente **no** tiene acceso.

## TAREA 3.0.A — Preparar el sitio IIS

- [ ] 3.0.A.1 Renombrar el sitio `api.luxuryapp` → **`web.luxuryapp`** (puerto **8053**).
      *(No se usaba; el API real es `luxuryappback` en `:8042`.)*
- [ ] 3.0.A.2 Confirmar su ruta física. Sugerido: `C:\inetpub\luxuryapp\web.luxuryapp`
- [ ] 3.0.A.3 Verificar que el AppPool esté iniciado.
- [ ] 3.0.A.4 Borrar el sitio `corporate.luxuryapp` (8058) — fantasma del plan viejo,
      ese portal fue eliminado del diseño el 09-Jul-2026.

**Verificación:** `http://localhost:8053` responde desde el servidor (aunque sea con 403 o vacío).

---

# 🅱️ BLOQUE B — Código (tareas del AGENTE)

## TAREA 3.1 — Generar la aplicación

**Riesgo:** 🟢

```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
npx ng generate application web --routing --style=scss --skip-tests=false
```

> ℹ️ Si el CLI pregunta por SSR/SSG, responder **No**.

**Verificación:**
```bash
ls -d projects/web/src && echo "APP CREADA"
node -e "const a=require('./angular.json');console.log(Object.keys(a.projects).join(', '))"
```
Esperado: `APP CREADA` y que `angular.json` liste **`luxury-app, web`**.

🛑 Si el generador modificó algo de `luxury-app` en `angular.json`, PARA y reporta.

**Commit:** `[3.1] genera la aplicacion web en projects/web`

---

## TAREA 3.2 — Mover el código del portal

**Riesgo:** 🟡

- [ ] 3.2.1 Mover la carpeta **copiándola** (no `git mv` — el monolito **conserva** su copia):
```bash
cp -r projects/luxury-app/src/app/apps/web.luxuryapp/* projects/web/src/app/
```
- [ ] 3.2.2 En los archivos movidos, cambiar los imports absolutos por relativos:
      `src/app/apps/web.luxuryapp/...` → `./...`
      *(Afecta sobre todo a `web.routing.ts` y `maintenance/maintenance.routing.ts`,
      que usan `loadComponent` con rutas absolutas.)*
- [ ] 3.2.3 Cablear `projects/web/src/app/app.routes.ts` para que use `webRoutes`
      **como rutas raíz** — sin el prefijo `web`, porque ahora la app **es** el sitio `/web/`.

- [ ] 3.2.4 🔴 **Vaciar la plantilla raíz `projects/web/src/app/app.html`.**
      Debe quedar **solo** con:
```html
<router-outlet />
```

> 🚨 **ESTE PASO SE OLVIDA Y CUESTA UNA HORA DE DIAGNÓSTICO.** Pasó en el piloto (08-Ago-2026).
> `ng generate application` deja un `app.html` de **356 líneas** con la página de bienvenida de
> Angular ("Hello, web"), y el `<router-outlet />` **al final**.
> Resultado: las rutas funcionan correctamente, pero el navegador muestra la portada de Angular
> encima del contenido real. **Parece que la extracción falló, y en realidad solo falta borrar
> una plantilla.**

- [ ] 3.2.5 **Borrar los archivos muertos del generador**, si aparecen:
      `app.component.ts`, `app.component.html`, `app.component.spec.ts`.
      El CLI arranca desde `app.ts` (ver `main.ts`), así que esos quedan sin usar.
      ⚠️ **Conservar `app.component.scss`** — `app.ts` lo referencia en su `styleUrl`.

- [ ] 3.2.7 **Alinear los presupuestos de build con los del monolito.**
      `ng generate application` usa los valores por defecto del CLI (`anyComponentStyle`
      **4 kB / 8 kB**), pero el monolito usa **25 kB / 30 kB**.
      Es el **mismo código**, así que debe medirse con la misma vara.
      Sin esto, el build de producción **falla** con errores de presupuesto en hojas de estilo
      que llevan años publicándose sin problema.
      *(En el piloto: 5 archivos `.scss` de `maintenance/` daban error.)*

- [ ] 3.2.8 **Borrar `web.routes.ts` si el generador lo creó.**
      Es un archivo vacío que exporta **el mismo nombre** (`webRoutes`) que el
      `web.routing.ts` real. Dos archivos con el mismo símbolo exportado es una trampa:
      basta un autoimport equivocado para que la app se quede sin rutas.

- [ ] 3.2.6 🔴 **Quitar el prefijo del portal de TODOS los enlaces internos.**

> 🚨 **SEGUNDO ERROR DEL PILOTO (08-Ago-2026).** Es el reflejo exacto de 3.2.3 y se manifiesta
> igual de confuso: la portada carga bien, pero **cualquier clic** lanza en consola
> `NG04002: Cannot match any routes. URL Segment: 'web/legal'`.

**Por qué pasa:**

| | En el monolito | En el portal extraído |
| :--- | :--- | :--- |
| Ruta declarada | `web/legal` | `legal` |
| Enlace en el HTML | `/web/legal` | **`/legal`** |
| URL que ve el usuario | `/web/legal` | `/web/legal` ← lo pone el `base-href` |

Al pasar las rutas a la raíz (3.2.3), los enlaces se quedan apuntando al prefijo viejo.
**La URL final no cambia** — cambia quién aporta el `/<slug>/`: antes el router, ahora el `base-href`.

**Cómo aplicarlo:**
```bash
cd projects/<slug>/src/app
for f in $(grep -rl "/<slug>/" --include=*.html --include=*.ts .); do
  sed -i 's|/<slug>/|/|g' "$f"
done
```
*(En el piloto: 26 enlaces en 19 archivos.)*

**Verificación:**
```bash
grep -rc "/<slug>/" --include=*.html --include=*.ts .   # -> sin resultados
```

> ⚠️ **Los archivos `*.routing.ts` no deben tener el prefijo** (sus `path` ya son relativos).
> Si aparecen ahí, revísalos a mano antes de reemplazar a ciegas.
>
> ✅ **El monolito conserva sus enlaces con prefijo** — no se tocan. Su copia sigue funcionando,
> que es lo que mantiene vivo el rollback.

> 🔑 **Este es el cambio conceptual clave.** En el monolito, `web` colgaba de `path: "web"`.
> Como app propia servida en `/web/`, sus rutas arrancan en la raíz: el prefijo lo aporta
> el `--base-href` y nginx, no el router.

**Verificación:**
```bash
npx ng build web --configuration development
```
Esperado: **exit 0**.

**Commit:** `[3.2] mueve el codigo del portal web a projects/web`

---

## TAREA 3.3 — Estilos globales compartidos

**Riesgo:** 🟡

`web` usa las clases `card` y `btn` del Design System, que viven en las hojas globales.

- [ ] 3.3.1 En `angular.json`, en el target `build` del proyecto **`web`**, apuntar `styles` a las
      **mismas** hojas del monolito (no copiarlas — una sola fuente de verdad):
```json
"styles": [
  "node_modules/primeflex/primeflex.css",
  "node_modules/primeicons/primeicons.css",
  "projects/luxury-app/src/styles/ds-entry.scss",
  "projects/luxury-app/src/styles/styles.scss"
]
```
- [ ] 3.3.2 Replicar `stylePreprocessorOptions.includePaths` apuntando a
      `projects/luxury-app/src/styles` y `projects/luxury-app/src`.

> ℹ️ Se comparten a propósito: si mañana cambia un token del Design System, cambia para
> **todos** los portales a la vez. Copiarlas crearía 18 copias que se desincronizan.

**Verificación:**
```bash
npx ng build web --configuration development
```
Esperado: exit 0 **y** que el CSS resultante no esté vacío:
```bash
ls -la dist/web/browser/*.css
```

**Commit:** `[3.3] comparte las hojas de estilo globales con el portal web`

---

## TAREA 3.4 — Verificación local antes de tocar el servidor

**Riesgo:** 🔴 — **punto de control. No se despliega nada sin pasar esto.**

- [ ] 3.4.1 `npx ng serve web --port 4300`
- [ ] 3.4.2 Abrir `http://localhost:4300` con la consola del navegador abierta y recorrer:
      landing · legal · operations · maintenance · accounting · hr
      y al menos **3** de las 16 páginas de procedimientos de `maintenance/`.
- [ ] 3.4.3 Verificar: **sin errores rojos**, sin `404` de assets, y que **los estilos se vean**
      (tarjetas y botones con su formato — es lo que confirma que 3.3 quedó bien).
- [ ] 3.4.4 Comparar contra el monolito: `ng serve` en 4200 y abrir `localhost:4200/web`.
      **Deben verse iguales.**

🛑 Cualquier diferencia visual o error de consola → PARA y reporta.

**Commit:** — (verificación, sin cambios)

---

## TAREA 3.5 — Build de producción con `--base-href`

**Riesgo:** 🔴 — el flag es obligatorio.

> 🔴🔴 **EJECUTA ESTE COMANDO DESDE POWERSHELL. NUNCA DESDE GIT BASH.**
>
> **Pasó en el piloto (08-Ago-2026) y el build salió VERDE con el resultado corrupto:**
> ```
> Desde Git Bash:   <base href="C:/Program Files/Git/web/"     ← CORRUPTO
> Desde PowerShell: <base href="/web/"                          ← correcto
> ```
> Git Bash (MSYS) convierte automáticamente cualquier argumento que empiece con `/` en una ruta
> de Windows. `--base-href /web/` se transforma en `--base-href C:/Program Files/Git/web/`.
>
> **El build no falla, no avisa, y genera un sitio que en el servidor no carga absolutamente nada.**
> Por eso la verificación de abajo es obligatoria y no opcional.

```powershell
# PowerShell — desde D:\repos\luxuryapp-api\client\luxuryapp
npx ng build web --configuration production --base-href /web/
```

> 🚨 **Sin `--base-href /web/` la app NO carga en el servidor.** Buscaría sus archivos en la raíz
> del dominio en vez de en `/web/`, y todo daría 404.

**Verificación:**
```bash
grep -o '<base href="[^"]*"' dist/web/browser/index.html
```
Esperado exactamente: `<base href="/web/"`

🛑 Si dice `<base href="/"`, el flag no se aplicó. **No despliegues.**

**Commit:** — (artefacto de build, no se commitea)

---

## TAREA 3.6 — Preparar el paquete de despliegue

**Riesgo:** 🟢

- [ ] 3.6.1 Crear `projects/web/web.config` con el **mismo contenido** que
      `C:\inetpub\luxuryappfront\web.config` (ya validado en producción; ver la plantilla al final
      de `conf.nginx.conf`).
- [ ] 3.6.2 Agregarlo a los `assets` del target `build` de `web` en `angular.json`, para que se
      copie solo en cada build.

> 🔑 **Sin `web.config`, IIS devuelve 404 al recargar en una ruta interna.** La app funciona al
> entrar por la portada y falla al pulsar F5 — un fallo que no se ve en una prueba rápida.

**Verificación:**
```bash
npx ng build web --configuration production --base-href /web/
ls dist/web/browser/web.config && echo "WEB.CONFIG INCLUIDO"
```

**Commit:** `[3.6] web.config para el sitio IIS del portal web`

---

# 🅲 BLOQUE C — Publicación (USUARIO + AGENTE)

## TAREA 3.7 — Desplegar y activar

> ⚠️ Los pasos de servidor los hace el **usuario**.

- [ ] 3.7.1 **(Usuario)** Copiar **todo** el contenido de `dist/web/browser/` a
      `C:\inetpub\luxuryapp\web.luxuryapp\` (reemplazando lo que hubiera).
- [ ] 3.7.2 **(Usuario)** Probar directo en IIS: `http://localhost:8053` desde el servidor.

> 🟡 **NO TE ASUSTES: aquí la página sale EN BLANCO y con errores en consola. Es lo correcto.**
> Pasó en el piloto (08-Ago-2026) y parece que el despliegue falló, pero no.
>
> ```
> Failed to load module script: ... responded with a MIME type of "text/html"
> Failed to decode downloaded font: .../assets/fonts/outfit-latin-var.woff2
> OTS parsing error: invalid sfntVersion
> ```
>
> **Por qué pasa:** `index.html` lleva `<base href="/web/">`, así que el navegador pide
> `localhost:8053/web/main-XXX.js`. En el sitio IIS los archivos están en la **raíz**, no bajo
> `/web/`. El `web.config` hace su trabajo y reescribe a `/index.html`, así que el navegador
> recibe **HTML donde esperaba JavaScript** — y de ahí todos los errores.
>
> 🔑 **Este sitio NO se puede probar de forma aislada en su puerto.** Solo funciona detrás de
> nginx, que es quien **quita el prefijo `/web/`** gracias a la **barra final** del `proxy_pass`:
> ```
> Navegador → /web/main.js  →  nginx (proxy_pass .../8053/)  →  IIS recibe /main.js ✅
> ```
>
> **Lo único que confirma este paso:** que el puerto **responde** (aunque sea en blanco) y que
> los archivos están copiados. La prueba real es 3.7.5, ya con nginx.
- [ ] 3.7.3 **(Usuario)** En `C:\nginx\conf\nginx.conf`, **descomentar** el bloque de `web`
      (los dos: el `location = /web` y el `location /web/`).
- [ ] 3.7.4 **(Usuario)** Validar y recargar:
```bash
nginx -t          # DEBE decir "syntax is ok" y "test is successful"
nginx -s reload
```
🛑 Si `nginx -t` falla, **NO recargues**. Corrige primero.

- [ ] 3.7.5 **(Usuario)** Abrir `https://luxurybuildingapp.com/web/` y verificar:
      la portada carga · los estilos se ven · **F5 en una ruta interna NO da 404**
      (ej. `/web/maintenance/green-areas`) · `/web` sin barra redirige a `/web/`

🛑 Cualquier fallo → **rollback**: comentar el bloque, `nginx -t`, `nginx -s reload`.

---

## TAREA 3.8 — Activar la navegación hacia el portal

**Riesgo:** 🟡 — hacer **solo después** de que 3.7.5 pase.

- [ ] 3.8.1 En `core/navigation/portales-extraidos.ts`, descomentar `"web"`.
- [ ] 3.8.2 Compilar y desplegar el **monolito**:
```bash
npx ng build --configuration production
```
      **(Usuario)** copiar `dist/luxury-app/browser/` a `C:\inetpub\luxuryappfront\`

> 🚨 **El orden importa y no es reversible a la ligera.**
> nginx primero (3.7), lista después (3.8). Si activas la lista con el `location` comentado,
> los enlaces recargan y caen al monolito: lento pero funciona.
> Al revés — `location` activo y slug sin poner — la navegación interna **da page404**.

**Verificación (usuario):** entrar a la app, hacer clic en un enlace hacia `web` desde otra
sección → **recarga completa** y aterriza en el portal servido por IIS.

**Commit:** `[3.8] activa web en PORTALES_EXTRAIDOS`

---

## TAREA 3.9 — Periodo de observación

- [ ] 3.9.1 Dejarlo correr **al menos 3 días** sin borrar nada del monolito.
- [ ] 3.9.2 Revisar `C:\nginx\logs\access.log` buscando `404` bajo `/web/`.
- [ ] 3.9.3 Solo después: decidir si se elimina `apps/web.luxuryapp/` del monolito.

> ⚠️ **No borres el portal del monolito antes de este periodo.** Es lo único que permite el
> rollback instantáneo. Lo que se ahorra en tamaño de bundle no compensa perder esa red.

---

## TAREA 3.10 — Convertir esto en la receta

- [ ] 3.10.1 Documentar en el LEDGER **qué falló y qué costó más de lo previsto**.
- [ ] 3.10.2 Escribir `docs/plans/execution/RECETA-EXTRACCION-PORTAL.md` generalizando los pasos
      3.1–3.9, con los puntos donde este piloto se tropezó.
- [ ] 3.10.3 Anotar el siguiente candidato: **`committee`** (2 amarras, 0 rutas dispersas, IIS :8055).

---

# 🛑 FIN DE LA FASE 3 (piloto) — ALTO

**Checklist de cierre:**

- [ ] `https://luxurybuildingapp.com/web/` sirve el portal desde IIS
- [ ] F5 en una ruta interna **no** da 404
- [ ] `/web` sin barra redirige a `/web/`
- [ ] Los estilos se ven igual que en el monolito
- [ ] La navegación desde otras secciones hacia `web` recarga y aterriza bien
- [ ] El monolito **sigue conteniendo** `web` (rollback disponible)
- [ ] `npm run lint` verde · `ng build` de ambos proyectos verde
- [ ] Receta documentada

> ✅ **Al cerrar esto, LuxuryApp tiene su primer portal independiente** — y una receta probada
> para los 17 restantes.
