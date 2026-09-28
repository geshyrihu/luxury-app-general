📍 **Ruta:** 📂 `docs/plans/execution` > 📄 `RECETA-EXTRACCION-PORTAL.md`

📅 **Creada:** 08-Ago-2026, tras el piloto de `web`
🧠 **Autor:** Claude (supervisor)
🎯 **Para:** extraer los 17 portales restantes sin repetir los tropiezos del piloto

---

# 📖 Receta de extracción de un portal

**Estado:** ✅ `web` publicado en producción el 08-Ago-2026 (`luxurybuildingapp.com/web/`).
Esta receta generaliza esa experiencia. **Los 7 tropiezos documentados abajo le pasarán igual a
cualquier portal** si no se siguen los pasos.

---

## 1. ⚠️ Lo primero: `web` fue un caso atípico

**No asumas que el siguiente será igual de fácil.** El piloto no tenía **ninguna** dependencia
interna. Todos los demás sí:

| Portal | Imports internos | Archivos `.ts` | Puerto IIS |
| :--- | ---: | ---: | ---: |
| **`web`** ✅ publicado | **0** | 26 | 8053 |
| `security` | 13 | 4 | 8067 |
| `compras` | 16 | 3 | 8056 |
| `public` | 20 | 4 | 8063 |
| **`committee`** ← siguiente | **94** | 19 | 8055 |
| `system` | 106 | 24 | 8069 |
| `auth` | 116 | 27 | 8051 |
| `resident` | 122 | 13 | 8066 |
| `direccion` | 260 | 27 | 8059 |
| `legal` | 298 | 39 | 8060 |
| `reclutamiento` | 497 | 68 | 8064 |
| `cobranza` | 714 | 116 | 8054 |
| `supplier` | 942 | 92 | 8068 |
| `admin` | 1,053 | 245 | 8052 |
| `contabilidad` | 1,093 | 168 | 8057 |
| `mantenimiento` | 1,189 | 141 | 8061 |
| `recursos-humanos` | 1,262 | 211 | 8065 |
| `operations` | 2,009 | 278 | 8062 |

### ✅ Pero el código compartido YA es accesible — sin configurar nada

`tsconfig.json` (raíz del workspace) define estos alias, y **todos los proyectos los heredan**:

```json
"paths": {
  "src/*": ["./projects/luxury-app/src/*"],
  "@ui/*": ["./projects/luxury-app/src/app/shared/ui/*"]
}
```

Un portal extraído puede importar `src/app/core/...` y `@ui/...` **tal cual**, y resuelven al
código del monolito. **No hace falta crear una librería ni duplicar nada.**

> 📌 **Deuda futura, no bloqueante:** esto hace que los portales extraídos dependan del árbol de
> fuentes del monolito. Durante la transición está bien —y es deseable, una sola fuente de verdad—
> pero el estado final debería mover `core/` y `shared/` a una librería del workspace.
> **Decidirlo cuando queden pocos portales dentro del monolito, no ahora.**

---

## 2. Antes de empezar — requisitos del portal

- [ ] Sus **rutas viven en `apps/<slug>/`**, no dispersas en `routing/`
      *(ver `REPORTE-RUTAS-POR-PORTAL.md` §2)*
- [ ] Sus **amarras con otros portales** están resueltas o son aceptables
      *(ver `CLASIFICACION-72-AMARRAS.md`)*
- [ ] Su **sitio IIS existe y está iniciado** (`sitios.creados.md`)
- [ ] El **bloque en `conf.nginx.conf` existe, comentado**

---

## 3. La receta

### 🅐 Código (agente)

| # | Paso | Comando / acción |
| :-- | :--- | :--- |
| 1 | Generar la app | `npx ng generate application <slug> --routing --style=scss` |
| 2 | **Copiar** (no mover) el portal | `cp -r projects/luxury-app/src/app/apps/<slug>.luxuryapp/* projects/<slug>/src/app/` |
| 3 | Imports absolutos del portal → relativos | `src/app/apps/<slug>.luxuryapp/...` → `./...` |
| 4 | Rutas del portal como **raíz** | `app.routes.ts` → `export const routes = <slug>Routes` |
| 5 | 🔴 **Vaciar `app.html`** | Dejar solo `<router-outlet />` — ver tropiezo #1 |
| 6 | Borrar restos del generador | `app.component.*` y `<slug>.routes.ts` — ver tropiezos #4 |
| 7 | 🔴 **Quitar el prefijo de los enlaces** | `sed -i 's\|/<slug>/\|/\|g'` — ver tropiezo #2 |
| 8 | 🔴 **Alinear presupuestos** | `anyComponentStyle` → `25kb/30kb` — ver tropiezo #3 |
| 9 | Estilos globales **compartidos** | Apuntar a `projects/luxury-app/src/styles/` — **no copiar** |
| 10 | `web.config` como asset | Copiar el de `projects/web/web.config` |

### 🅑 Verificación local (agente + usuario)

| # | Paso | Criterio |
| :-- | :--- | :--- |
| 11 | `ng serve <slug> --port 43XX` | Recorrer todas las pantallas, consola sin errores |
| 12 | Comparar contra el monolito | `ng serve luxury-app --port 4200` → `/<slug>` debe verse **igual** |

### 🅒 Build y despliegue

| # | Paso | Comando |
| :-- | :--- | :--- |
| 13 | 🔴 **Build DESDE POWERSHELL** | `npx ng build <slug> --configuration production --base-href /<slug>/` |
| 14 | 🔴 **Verificar el base href** | `<base href="/<slug>/"` — ver tropiezo #5 |
| 15 | Verificar el `web.config` | `ls dist/<slug>/browser/web.config` |
| 16 | **(Usuario)** Copiar a IIS | `dist\<slug>\browser\*` → `C:\inetpub\luxuryapp\<slug>.luxuryapp\` |
| 17 | **(Usuario)** Descomentar **solo** ese bloque en nginx | ⚠️ Ver el incidente de §5 |
| 18 | **(Usuario)** `nginx -t` **y luego** `nginx -s reload` | Nunca reiniciar sin validar |
| 19 | 🔴 **Probar con la barra final** | `luxurybuildingapp.com/<slug>/` — ver tropiezo #7 |
| 20 | Probar **F5 en ruta interna** | No debe dar 404 (valida el `web.config`) |

### 🅓 Activación y cierre

| # | Paso |
| :-- | :--- |
| 21 | Agregar `"<slug>"` a `PORTALES_EXTRAIDOS` |
| 22 | `npx ng build luxury-app --configuration production` |
| 23 | **(Usuario)** Publicar el monolito en `C:\inetpub\luxuryappfront\` |
| 24 | Dejar correr **3 días** sin borrar el portal del monolito |

> 🚨 **El orden 17 → 21 es obligatorio: nginx primero, lista después.**

---

## 3.bis 🔴 Lo que el portal HEREDA del monolito y hay que replicar

> **Añadido tras `committee` (08-Ago-2026), el primer portal con dependencias.**
> Seis fallos, todos del **mismo tipo**: algo que el monolito daba por sentado en su arranque
> y que el portal extraído **no hereda**. Los seis **compilaban verde** y solo aparecían al ejecutar.

### 3.bis.1 La configuración de arranque

Ya está resuelto: `core/config/luxury-base.providers.ts` centraliza lo compartido, y **el monolito
también lo consume**. Un portal nuevo solo necesita:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    ...provideLuxuryBase(routes),
    { provide: PORTAL_ACTUAL, useValue: "<slug>" },   // 🔴 OBLIGATORIO
  ],
};
```

Lo que ese archivo resolvió, y que de otro modo revienta al arrancar:

| Faltaba | Síntoma |
| :--- | :--- |
| `HttpClientWithoutInterceptors` | `NG0201` desde `AuthService` — la app **no arranca** |
| `SwUpdate` | `NG0201` desde cualquier layout (vía `UpdateService`) |
| `import "iconify-icon"` | **Ningún icono se dibuja.** No falla ni avisa: el navegador ignora un elemento personalizado sin registrar |
| `registerLocaleData(es-MX)` | Fechas y números mal formateados |

> 🔑 Si aparece **otro** `NG0201` al extraer el portal #3, se arregla **una vez** en ese archivo
> y queda resuelto para todos los demás. No lo copies al portal.

### 3.bis.2 🔴 `PORTAL_ACTUAL` — el proveedor que no se puede olvidar

Sin él vale `null`, la app **cree ser el monolito**, y la navegación entre portales falla.
Es una línea, y su ausencia no da ningún error al compilar.

### 3.bis.3 🔴 El bloque de `app.routes.ts`: layout Y GUARDS

Al extraer, **ve a ver cómo montaba el portal el `app.routes.ts` del monolito** y replica el
bloque **completo**:

```ts
{ path: "committee",
  loadComponent: LayoutCommittee,               // el armazón visual
  canActivate: [authGuard, committeeGuard],     // 🔴 el control de acceso
  loadChildren: committeeRoutes }
```

Llevarse solo las rutas hijas cuesta dos cosas:
- **El layout** — se nota de inmediato (sin toolbar ni footer).
- **Los guards** — 🔴 **no se nota**. El portal se ve y funciona igual, **sin control de acceso
  ni verificación de rol**, y así llegaría a producción.

### 3.bis.4 🔴 Los assets también se comparten

`assets` debe apuntar a `projects/luxury-app/public`, no al `public/` vacío del portal.
Igual que las hojas de estilo: una sola fuente de verdad. Añade también el worker de pdfjs si el
portal muestra PDFs.

### 3.bis.5 🔴 Rutas propias y salida al login

Dos problemas de navegación que `web` no tuvo, resueltos en `PortalLinkService`:

| Problema | Por qué |
| :--- | :--- |
| `NG04002` en las rutas del propio portal | Dentro del portal las rutas viven en la **raíz**, pero el código compartido escribe `/committee/x`. Lo traduce `rutaLocal()` |
| `NG04002` en `auth/login` | Los guards redirigían con `router.navigate`/`createUrlTree`, que resuelven contra la tabla de **esta** app. **Un usuario con la sesión expirada quedaba ATRAPADO** — ni entraba ni podía volver al login. Ahora usan `navegar()` |

> ⚠️ El segundo es el fallo más grave de todo el proyecto hasta ahora: solo aparece **cuando la
> sesión expira o falta un rol**, o sea, nunca en una prueba normal.

### 3.bis.6 🔴 Los caminos de SALIDA son los que más se olvidan

Todo lo que **saca** al usuario del portal cruza a otra app, y son justo los flujos que menos se
prueban. Los cuatro casos aparecieron uno tras otro en `committee`, ya resueltos en código
compartido:

| Punto | Qué pasaba si usa `router.navigate` |
| :--- | :--- |
| Guard sin sesión → login | Usuario **atrapado**: ni entra ni vuelve al login |
| Login → de vuelta al portal | Aterrizaba en la copia vieja del monolito |
| **Logout** | Sesión cerrada y usuario **atrapado** en el portal |
| Pantalla "no autorizado" | Sus dos botones fallan justo cuando ya está bloqueado |

> 🔑 **Regla:** cualquier navegación cuyo destino **no sea de este portal** va por `navegar()`.
> Y el `returnUrl` que se manda fuera se construye con `urlPublica()`, nunca con la ruta interna.

### 3.bis.7 🔴 Configuración de build que el CLI NO genera

`ng generate application` crea una configuración mínima. Falta esto, y **los tres fallan en
silencio con el build en verde**:

| Falta | Consecuencia |
| :--- | :--- |
| **`fileReplacements`** | 🔴 El portal publicado llama al **API de DESARROLLO** (`localhost:7070`). En la máquina de quien tenga API local hasta funciona a medias; para los usuarios, nada responde |
| **`baseHref` en `angular.json`** | El flag `--base-href` **se perdió dos veces** y las dos llegaron a producción. Declararlo en las `options` del proyecto lo vuelve imposible de olvidar |
| `assets` apuntando al `public/` del monolito | Fuentes, imágenes y el worker de PDF dan 404 |
| Presupuestos alineados con el monolito | El build **falla** por hojas de estilo que llevan años publicándose |

### 3.bis.7.bis 🔴 Marcar la casilla NO es verificar

En `public` los tres puntos de arriba volvieron a fallar **estando escritos como casilla
explícita en el runbook**. El agente las marcó, el build salió verde, y el portal no habría
arrancado. Un build verde no prueba nada aquí: los cuatro defectos típicos son de **runtime o
de despliegue**.

Así que la casilla no se marca leyendo el `angular.json`, se marca **interrogando al `dist/`**:

```bash
ng build <slug> --configuration production

grep -o '<base href="[^"]*"' dist/<slug>/browser/index.html   # → /<slug>/, nada más
grep -rl "localhost:7070" dist/<slug>/browser/*.js            # → vacío
ls dist/<slug>/browser | grep -E "assets|favicon|web.config"  # → los tres
```

Y el defecto que ni el `dist/` delata —`app.config.ts` con el `providers` del generador, sin
`provideLuxuryBase` ni `PORTAL_ACTUAL`— se ve a simple vista: **si el archivo tiene menos de
20 líneas, está mal**. Compáralo con el de `committee`, que es el de referencia.

### 3.bis.8 🔴 El service worker del monolito secuestra el portal

Se registra en la raíz, así que **su alcance es el dominio entero**. Sin exclusiones intercepta
`/<slug>/` y responde con el `index.html` del **monolito** desde su caché.

**Al extraer un portal: agrega `"!/<slug>/**"` a `navigationUrls` en `ngsw-config.json`
y REPUBLICA EL MONOLITO.** Si se olvida, el portal queda inalcanzable para todo usuario que ya
tenga el service worker instalado — y funcionará perfecto en incógnito, lo que despista mucho.

---

## 4. Los 7 tropiezos del piloto

Todos ocurrieron de verdad. Todos son genéricos.

| # | Tropiezo | Síntoma | Por qué engaña |
| :-- | :--- | :--- | :--- |
| 1 | `app.html` con la portada de Angular (356 líneas) | Sale "Hello, `<slug>`" | Las rutas **sí** funcionan; la bienvenida se pinta encima |
| 2 | Enlaces internos con prefijo `/<slug>/` | `NG04002: Cannot match any routes` | La portada carga bien; falla **al primer clic** |
| 3 | Presupuestos del CLI (8 kB) vs monolito (30 kB) | El build **falla** por hojas de estilo | Es el **mismo código** que lleva años publicándose |
| 4 | `<slug>.routes.ts` vacío con el **mismo nombre exportado** | La app se queda sin rutas | Un autoimport equivocado y no te enteras |
| 5 | 🔴 **`--base-href` corrupto desde Git Bash** | `<base href="C:/Program Files/Git/<slug>/">` | **El build sale VERDE.** En el servidor no carga nada |
| 6 | El sitio IIS no se puede probar aislado | Página en blanco, errores de MIME y de fuente | Parece que el despliegue falló, y es **correcto** |
| 7 | 🔴 **La barra final de la URL** | `/<slug>` sirve el **monolito**; `/<slug>/` el portal | **Se ven idénticos** |
| 8 | **`ng serve` no recarga `angular.json`** | Cambias assets/estilos/presupuestos y no pasa nada | El código **sí** se recompila en caliente; la config **no**. Parece que el arreglo no funcionó — **hay que reiniciar el servidor** |
| 9 | 🔴 **Un build posterior pisa el `--base-href`** | Página en blanco en producción, sin errores claros | Angular **no limpia `dist/` entre builds**. Un `ng build <slug>` sin el flag —aunque sea de desarrollo— **sobrescribe el `index.html`** y deja `<base href="/">`. Pasó en `committee`: el build verificado era correcto y seis correcciones después ya no |

> ✅ **Regla que elimina el tropiezo #9:** el build de despliegue es **siempre** lo último que se
> hace, y **siempre** sobre una carpeta limpia:
> ```powershell
> Remove-Item -Recurse -Force dist\<slug>
> npx ng build <slug> --configuration production --base-href /<slug>/
> Select-String -Path "dist\<slug>\browser\index.html" -Pattern '<base href="[^"]*"'
> ```
> Y verifica el `base href` **justo antes de copiar a IIS**, no antes.

### 🔍 Cómo saber cuál estás viendo (tropiezo #7)

Es el más peligroso, porque la vista no lo delata. **En el piloto se dio por bueno un despliegue
que en realidad mostraba el monolito.** Dos formas de salir de dudas:

| Señal | Monolito | Portal extraído |
| :--- | :--- | :--- |
| **Consola** | Llena: `StorageService`, `JwtInterceptorFn`, `UpdateService`, SignalR | **Casi vacía** |
| **Pestaña Red** | `main-XXX.js` ≈ **645 kB** | Mucho menor (`web`: **118 kB**) |

> 🔑 **Verifica siempre con la consola, nunca con la vista.**

---

## 5. ⚠️ Incidente a no repetir

Durante el piloto se descomentó también el bloque de **`committee`**, cuyo sitio IIS estaba
**vacío**. De haberse recargado nginx así, `/committee/` habría dejado de funcionar para todos
sus usuarios: nginx habría dejado de mandarlos al monolito para mandarlos a un sitio sin nada.

> **Regla: se descomenta UN bloque, el del portal que se acaba de desplegar. Ni uno más.**

---

## 6. 🔙 Rollback

```
1. Comentar el bloque location del portal en C:\nginx\conf\nginx.conf
2. nginx -t  &&  nginx -s reload
```

El tráfico vuelve al monolito **en segundos**, porque el monolito **conserva** el portal.

> Por eso los pasos 2 y 24: se **copia**, no se mueve, y no se borra nada durante 3 días.
> Lo que se ahorraría en tamaño de bundle no compensa perder esa red.

---

## 7. 📌 Cambios permanentes en el procedimiento

**El comando de build cambió** al haber más de un proyecto:

```bash
ng build                          # ❌ "Cannot determine project for command"
ng build luxury-app               # ✅ el monolito
ng build <slug> --base-href /<slug>/   # ✅ un portal
```

**La ruta de despliegue del monolito cambió** (desde el corte del 08-Ago-2026):

```
client\luxuryapp\dist\luxury-app\browser\   →   C:\inetpub\luxuryappfront\
```
⚠️ **No** `client\angular\...` — ese proyecto está congelado.

**🔴 Nunca `git add -A`. Se listan las rutas propias, una por una.**

El árbol casi nunca está limpio: el usuario y otros turnos dejan trabajo en curso. Un `git
add` amplio **no distingue tu trabajo del ajeno**, y lo peor que puede hacer es llevarse la
mitad de un movimiento pendiente.

Pasó en `public`: el usuario tenía un componente movido a medias (destino sin trackear,
routing sin arreglar). El agente cerró su tarea con un `add` amplio y se llevó **solo el
borrado del origen**. El commit no compilaba por sí solo y un `git clean -fd` habría borrado
el componente para siempre. En local todo se veía verde porque el árbol tapaba el hueco.

```bash
git add ruta/uno ruta/dos          # ✅ solo lo tuyo
git add -A                         # ❌ nunca
git mv <origen> <destino>          # ✅ mover: un solo paso, git lo ve entero

git status --short                 # antes de commitear: lo que dejas fuera
                                   # debe seguir ahí después
```

Si al revisar ves un movimiento ajeno partido por la mitad —un `??` que corresponde a una
`D`— **para y reporta**. Un destino sin trackear es indistinguible de un borrado.

**🔴 El `nginx.conf` del repo NO es el del servidor.**

Son dos copias, y la que manda es la del servidor —que además lleva cambios hechos a mano que
el repo no conoce—. En `public` se corrigió el slug en la copia del repo y el usuario
descomentó en el servidor el bloque viejo, con el prefijo equivocado: la URL caía en
`location /` y seguía sirviéndola el monolito, con toda la pinta de "el portal no tomó
efecto". Se perdió una vuelta entera de despliegue en algo que no estaba roto.

Al llegar al paso de nginx:

- El **texto exacto a pegar** va en el mensaje al usuario, no solo en un archivo del repo.
- Se **edita** el archivo vivo del servidor; **nunca** se sobrescribe con el del repo, que
  borraría los cambios hechos a mano.
- Antes de reiniciar, `nginx -t`.

---

## 8. Deuda del servidor (pendiente, no bloqueante)

- 🔴 **`C:\nginx\logs\nginx.pid` está vacío o corrupto.** `nginx -s reload` y `-s stop` fallan con
  `invalid PID number`, obligando a matar el proceso y arrancarlo — con **segundos de caída**.
  Con el PID sano, `reload` no corta ni una conexión. **Vale la pena arreglarlo ya**: quedan 17
  recargas de nginx por delante.
- Ejecutar siempre `nginx -t` **antes** de recargar. Un error de sintaxis sin validar no tumba
  `/<slug>/`: tumba **el sitio completo**.

---

## 9. El siguiente: `committee`

| Dato | Valor |
| :--- | :--- |
| Puerto IIS | **8055** (sitio creado, vacío) |
| Archivos | 33 (19 `.ts`) |
| Rutas | 9, **todas propias** ✅ |
| Amarras con otros portales | **2** (ambas hacia `legal`) |
| Imports internos | **94** — usa `api-response.service`, `endpoints`, `customer-id.service`, `dialog-handler.service`, `app-icon`, `pdf-viewer-modal`, `tag` |
| Bloque nginx | Existe, **comentado** |

**Diferencia clave con el piloto:** será el primer portal que consuma `core/` y `shared/ui/`.
Los alias ya lo resuelven (§1), pero **el paso 11 —la verificación local— importa aquí mucho más
que en `web`**: es donde se vería si algún servicio compartido no arranca fuera del monolito.

> 💡 **Presta atención a la sesión.** `committee` usa `customer-id.service` y `api-response.service`,
> o sea que **llama al API autenticado**. `web` no lo hacía. Verifica que el portal extraído
> mantiene la sesión: misma cookie, mismo origen — debería funcionar, pero es lo primero a probar.
