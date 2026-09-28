📍 **Ruta:** 📂 `docs/plans/execution` > 📄 `REPORTE-RUTAS-POR-PORTAL.md`

📅 **Fecha:** 08-Ago-2026
🧠 **Autor:** Claude (supervisor) — análisis
🎯 **Para:** planear la extracción a subdominios y la configuración de nginx

---

# 🗺️ Reporte de rutas por portal

Insumo para la Fase 3. Antes de sacar un portal a su propio subdominio hay que saber **qué URLs
sirve hoy**, para poder mapearlas en nginx y dejar redirects desde las rutas viejas.

**Medido:** 624 rutas en 33 archivos de routing del proyecto `client/luxuryapp`.

---

## 1. El modelo de destino (corregido 08-Ago-2026 con la config real de nginx)

> ⚠️ **Corrección.** La primera versión de este reporte asumía **subdominios**
> (`web.luxuryapp.com`). El usuario mostró la configuración real: el despliegue es
> **por ruta sobre un solo dominio**, y el dominio es **`luxurybuildingapp.com`**.

**Configuración actual de nginx** (Windows, `C:\nginx\conf\nginx.conf`):

```nginx
server {
    listen 443 ssl;
    server_name luxurybuildingapp.com www.luxurybuildingapp.com;
    ssl_certificate     c:/certificados/luxurybuildingapp_com.pem;
    ssl_certificate_key c:/certificados/luxurybuildingapp_com.key;

    location /web/ {
        alias html/web/;
        index index.html;
        try_files $uri $uri/ =404;
    }
}
```

**El modelo real:**

```
Portal en el código          URL pública                          nginx sirve desde
────────────────────────     ──────────────────────────────────   ─────────────────
apps/web.luxuryapp/     →    luxurybuildingapp.com/web/       →   html/web/
apps/committee.luxuryapp/ →  luxurybuildingapp.com/committee/ →   html/committee/
apps/admin.luxuryapp/   →    luxurybuildingapp.com/admin/     →   html/admin/
```

El **slug** del portal es el **prefijo de ruta**, no un subdominio. Misma lógica para los 18.

### 1.1 ✅ Lo que este modelo AHORRA

| Problema típico de subdominios | Con enrutado por ruta |
| :--- | :--- |
| Certificado wildcard `*.dominio` | **No hace falta** — un solo certificado, ya existe |
| CORS con N orígenes | **No hace falta** — todo es el **mismo origen** |
| Cookie de sesión entre subdominios | **No hace falta** — mismo origen |
| Registros DNS por portal | **No hace falta** |

> 🎯 Es un modelo notablemente más simple. Publicar un portal se reduce a: compilarlo, copiar el
> `dist` a `html/<slug>/`, y agregar un `location` de 4 líneas.

### 1.1.bis Mapa real del servidor (`nginx.conf` completo, 08-Ago-2026)

Bloque `luxurybuildingapp.com:443` *(se omite el bloque de Cloudflare Tunnel por indicación del usuario)*:

| `location` | Destino | Qué es |
| :--- | :--- | :--- |
| `/api` · `/ws/notificationHub` · `/img` | `proxy → :8042` | API .NET |
| `/test/` | `proxy → :8060` (con `rewrite`) | Ambiente de pruebas |
| `/web/` | `alias html/web/` | **Estático** |
| `/` | `proxy → :8050` | **El monolito Angular** |

**Tres consecuencias que definen la estrategia de extracción:**

**1. El monolito NO se sirve como estático — se proxea a `:8050`.**
Extraer un portal **no toca** cómo se sirve el monolito. Solo se agrega un `location` nuevo.
El monolito sigue igual en `:8050` hasta que se vacíe del todo.

**2. ✅ nginx resuelve solo la precedencia.** Con locations de prefijo, nginx elige **el prefijo más
largo**, no el orden del archivo. `/web/` (5 caracteres) gana sobre `/` (1). Por lo tanto **cada
`location /<slug>/` que se agregue gana automáticamente** sobre el catch-all del monolito.
Era el riesgo que quedaba por confirmar; queda descartado.

**3. 🔴 La trampa de la barra final.** `location /web/` **no** captura `/web` sin barra:

| URL | Quién responde |
| :--- | :--- |
| `luxurybuildingapp.com/web/` | El estático de `html/web/` |
| `luxurybuildingapp.com/web` | **El monolito** (cae en `location /`) |

Dos aplicaciones distintas en URLs casi idénticas. **Se corrige con una línea por portal:**

```nginx
location = /web { return 301 /web/; }
```

### 1.1.ter ❓ Pregunta abierta: ¿qué hay hoy en `html/web/`?

El monolito **ya** monta el portal web en `path: "web"` (`app.routes.ts`), y nginx **ya** sirve
`/web/` como estático. O sea, hoy conviven dos cosas en esa URL y **el estático está tapando al
portal del monolito**. Antes de extraer `web` hay que saber cuál de estos dos casos es:

- **(a)** `html/web/` ya contiene una versión separada del portal web → la extracción está a medias
- **(b)** `html/web/` es una landing vieja → el portal `web` del monolito es **inalcanzable** por `/web/`

La respuesta cambia el primer paso de la extracción.

### 1.1.quater ✅ El API no requiere cambios

`environment.prod.ts` usa `API_BASE_URL: "https://luxurybuildingapp.com/api/"` — URL absoluta al
mismo dominio. Un portal extraído **sigue llamando al API sin ningún cambio**, y sin CORS por ser
el mismo origen.

### 1.2 ⚠️ Los DOS requisitos que este modelo SÍ impone

**Requisito 1 — `--base-href` al compilar cada portal.**
Hoy `projects/luxury-app/src/index.html` tiene `<base href="/" />` y `angular.json` **no define
`baseHref`** (verificado). Una app servida en `/web/` con `base href="/"` busca sus archivos en la
raíz del dominio y **no carga nada**. Cada portal debe compilarse así:

```bash
ng build web --base-href /web/
```

**Requisito 2 — `try_files` debe caer en el `index.html` del portal.**
El `location /web/` actual termina en `try_files $uri $uri/ =404;`. Con una SPA de Angular eso
significa que **recargar la página en una ruta profunda da 404**: `/web/maintenance/green-areas`
no existe como archivo en disco. Debe ser:

```nginx
location /web/ {
    alias html/web/;
    index index.html;
    try_files $uri $uri/ /web/index.html;   # <- el fallback de SPA
}
```

> 🔴 **Este es el error más probable de la primera publicación.** La app carga bien al entrar por
> la portada y falla solo al recargar en una ruta interna o al compartir un enlace directo —
> justo el tipo de fallo que no se ve en una prueba rápida.
> **Verificar si el `/web/` actual ya sirve una SPA con rutas o solo una página estática.**

---

## 2. ⚠️ El segundo eje que nadie había medido

Hasta ahora medíamos el coste de extracción solo por **amarras de código**. Este reporte revela un
segundo eje igual de determinante: **dónde están declaradas las rutas del portal.**

Un portal puede tener 0 amarras y aun así ser costoso de extraer, si sus rutas viven dispersas en
los archivos compartidos de `routing/`. Al sacarlo a su propio sitio, esas rutas hay que moverlas.

| Portal | Amarras | Rutas | Dispersas | Coste real |
| :--- | ---: | ---: | ---: | :--- |
| **`web`** | **0** | 24 | **0** | 🟢 **CERO — listo hoy** |
| **`committee`** | 2 | 9 | **0** | 🟢 **Casi cero** |
| `public` | 0 | 1 | 1 | 🟡 Trivial |
| `compras` | 0 | 1 | 1 | 🟡 Trivial |
| `resident` | 1 | 2 | 2 | 🟡 Trivial |
| `cobranza` | 4 | 3 | 3 | 🟡 Bajo |
| `auth` | 0 | 9 | 3 | 🟠 Ver §4 — riesgo especial |
| `admin` | 1 | 60 | 4 | 🟡 Bajo (¡245 archivos, 4 rutas dispersas!) |
| `system` | 0 | 5 | 5 | 🟡 Bajo |
| `direccion` | 9 | 12 | 11 | 🟠 Medio |
| `reclutamiento` | 13 | 23 | 14 | 🟠 Medio |
| `legal` | 16 | 23 | 15 | 🟠 Medio |
| `supplier` | 14 | 22 | 22 | 🔴 Alto |
| `contabilidad` | 19 | 37 | 36 | 🔴 Alto |
| `recursos-humanos` | 19 | 58 | 58 | 🔴 Alto |
| `mantenimiento` | 13 | 66 | 66 | 🔴 Alto |
| **`operations`** | **33** | 121 | **117** | 🔴 **El más caro** |

> 🎯 **`web` y `committee` son los únicos dos portales autocontenidos en AMBOS ejes.**
> Sus rutas ya viven dentro de `apps/<portal>/`. No hay nada que mover.

---

## 3. Los dos portales listos hoy

### 3.1 `web.luxuryapp` → `web.luxuryapp.com`

**24 rutas, todas propias.** Declaradas en:
- `apps/web.luxuryapp/web.routing.ts` → `legal` · `operations` · `maintenance` · `accounting` · `hr`
- `apps/web.luxuryapp/maintenance/maintenance.routing.ts` → 16 rutas de contenido
  (`common-areas-inventory`, `machinery-survey`, `inspection-rounds`, `tools-inventory`,
  `supplies-inventory`, `supplier-review`, `budget-preparation`, `cleaning-classification`,
  `green-areas`, `preventive-maintenance`, `emergency-response`, `staff-evaluation`,
  `supplier-site-control`, `asset-disposal`, `purchase-request`, `installation-inspection`)
- Punto de montaje: `app.routes.ts` → `path: "web"`

**URL hoy:** `luxurybuildingapp.com/web/...` (dentro del monolito)
**URL destino:** `luxurybuildingapp.com/web/...` — **la misma**

> 🎉 **Las URLs no cambian.** El portal ya está montado en `path: "web"` dentro del monolito, y el
> destino es servirlo en `/web/` desde nginx. **No hacen falta redirects, ni avisar a usuarios, ni
> actualizar enlaces guardados.** Cambia quién sirve esa ruta, no la ruta.
>
> Esto refuerza a `web` como piloto: es el único cambio de infraestructura que un usuario final
> no puede notar.

> ✅ **Es el piloto recomendado.** Cero amarras, cero rutas dispersas, y su propósito declarado en
> el plan es ser el sitio de marketing externo. Si algo sale mal, no bloquea la operación interna.

### 3.2 `committee.luxuryapp` → `committee.luxuryapp.com`

**9 rutas, todas propias.** Declaradas en `apps/committee.luxuryapp/committee.routing.ts`:
`board-directors` · `monthly-meetings` · `meeting-minutes` · `meeting-minutes-detail/:id` ·
`building-insurance-policy` · `financial-reports` · `documents`
Punto de montaje: `app.routes.ts` → `path: "committee"` (con layout `LayoutCommittee`).

**Pendiente:** 2 amarras hacia `legal.luxuryapp` (una de ellas en el propio `committee.routing.ts`).

**URL hoy:** `luxuryapp.com/committee/...` → **URL destino:** `committee.luxuryapp.com/...`

---

## 4. 🟡 `auth` — sigue al final, pero por una razón mucho menor

> ⚠️ **Corrección honesta (08-Ago-2026).** La primera versión de este reporte marcaba `auth` como
> peligroso porque *"la cookie tendría que ser válida entre subdominios"*. **Eso era consecuencia
> de asumir subdominios, y el modelo real es por ruta.** Con el mismo origen, ese problema
> **no existe**. La advertencia anterior era incorrecta.

Lo que **sí** queda, y es menor:

**Rutas dispersas (3 de 9).** Solo 5 de sus rutas están en `auth.routes.ts`. Las otras viven fuera:
`password-manager` en `routing/pages.routes.ts`, `update-user-profile` en `routing/profile.routing.ts`,
y una en `routing/permissions.routing.ts`.

**Consideración operativa, no técnica.** `auth` es la puerta de entrada de todos los usuarios: si
falla, nadie entra. No por un problema de arquitectura, sino porque es el punto de mayor impacto
si algo sale mal en el despliegue.

> 💡 **Recomendación: sigue yendo al final**, pero ahora es una decisión de prudencia operativa
> (no arriesgar el login hasta tener la receta bien probada), no un obstáculo técnico.

---

## 4.bis 🔴 EL RIESGO MAYOR: la navegación entre portales se rompe

**Descubierto el 08-Ago-2026.** No es un problema de infraestructura, y es el único que
**romperá la aplicación en producción** si no se resuelve **antes** de extraer el primer portal.

### Cómo funciona hoy

```
BD  →  MenuItemDto.routerLink ("/committee/meeting-minutes")
    →  sidebar.html:  [routerLink]="item.routerLink"
    →  navegación del lado del cliente (SIN recargar la página)
```

El menú **se arma desde la base de datos** (`core/services/menu.service.ts`) y el sidebar lo pinta
con `[routerLink]` — navegación interna de Angular.

### Qué pasa al extraer el primer portal

Hoy todas las rutas viven en la misma app, así que `routerLink` siempre encuentra su destino.
Cuando `committee` sea su propia app en IIS:

> Un usuario dentro de `/admin/` hace clic en un ítem de menú de Committee.
> Angular intenta resolver `/committee/...` **en la tabla de rutas de la app admin**.
> No existe → cae en el comodín `**` → **page404**.

**Se rompe la navegación entre portales el día que se extrae el primero**, y falla para *todos*
los usuarios que usen el menú, que son todos.

### La solución

Los enlaces **entre portales distintos** deben dejar de ser `routerLink` y pasar a ser
navegación real de navegador (`href` / `window.location`), que recarga la página y deja que
**nginx** decida quién responde.

```
Destino en MI portal      →  routerLink   (rápido, sin recargar)
Destino en OTRO portal    →  href         (recarga, nginx enruta)
```

La decisión se puede derivar del **primer segmento** de la ruta comparado con el slug del portal
actual. No hace falta cambiar la BD.

> ⚠️ **Esta tarea es requisito previo a la Fase 3.** Debe estar hecha y probada **dentro del
> monolito** (donde no cambia nada de comportamiento) antes de extraer un solo portal.

### Efecto colateral aceptable

Cada salto entre portales pasa a ser una carga completa de aplicación: más lento que hoy
(instantáneo) y con una llamada de refresco de sesión. Es el precio inevitable de tener sitios
independientes, y es el comportamiento normal de cualquier arquitectura de este tipo.

---

## 4.ter ✅ La sesión NO es un problema (verificado)

`auth.service.ts` usa **`withCredentials: true`** — la sesión viaja en **cookie**, y el
interceptor agrega `Authorization: Bearer` con un token en memoria.

Como todos los portales viven en `luxurybuildingapp.com` (**mismo origen**), la cookie es válida
en todos. Tras una carga completa entre portales, la app arranca, llama a `/api/auth/refresh`
con la cookie y recupera la sesión sin pedir login.

> ✅ Confirma que el modelo por ruta elimina el problema de sesión. Con subdominios habría hecho
> falta configurar dominio de cookie y `SameSite`.

---

## 5. Dónde vive el desorden de rutas

Los archivos de `routing/` que concentran rutas de portales ajenos:

| Archivo | Rutas dispersas |
| :--- | ---: |
| `routing/human-resources.routing.ts` | 41 |
| `routing/logbook.routing.ts` | 33 |
| `routing/pages.routes.ts` | 25 |
| `routing/compras.routing.ts` | 24 |
| `routing/inventories.routing.ts` | 18 |
| `routing/accounting.routing.ts` | 17 |
| `routing/library.routing.ts` | 16 |
| `routing/tickets.routing.ts` | 15 |
| `routing/maintenance-report.routing.ts` | 14 |
| `routing/directory.routing.ts` | 13 |
| `routing/recruitment.routing.ts` | 13 |
| `routing/supervision.routing.ts` | 13 |

> 📌 **Estos archivos se vacían solos.** Cada portal que se extraiga se lleva sus rutas.
> No hace falta una tarea de "reorganizar el routing": es consecuencia de la Fase 3, no requisito.

---

## 6. Orden de extracción recomendado

| # | Portal | Por qué |
| :--- | :--- | :--- |
| 1 | **`web`** | Coste 0 en ambos ejes. Sitio externo por diseño. Riesgo de negocio bajo |
| 2 | **`committee`** | Coste casi 0. Valida el patrón con un portal **con layout propio** |
| 3 | `public` · `compras` · `resident` | Triviales (1-2 rutas). Sirven para automatizar la receta |
| 4 | `admin` | 245 archivos pero solo 1 amarra y 4 rutas dispersas. Primer portal **grande** |
| 5 | `system` · `cobranza` · `direccion` | Coste medio |
| 6 | `reclutamiento` · `legal` · `supplier` | Requieren resolver clústeres de negocio |
| 7 | `contabilidad` · `recursos-humanos` · `mantenimiento` | Caros |
| 8 | `operations` | 33 amarras, 117 rutas dispersas. **El último** |
| 9 | **`auth`** | **El último de todos** — ver §4 (sesión entre subdominios) |

---

## 7. Lo que hay que definir en el servidor (antes del portal #1)

> ✅ **Ya resuelto por el modelo por ruta:** dominio, certificado TLS, CORS, cookie de sesión,
> DNS y redirects. Nada de eso hace falta. Ver §1.1.

Lo que **sí** queda por definir, **una sola vez** para los 18:

- [ ] **`--base-href` por portal.** Confirmar el flag de build de cada uno (§1.2, requisito 1)
- [ ] **`try_files` con fallback de SPA** en cada `location` (§1.2, requisito 2).
      Verificar primero si el `/web/` actual ya sirve una SPA con rutas o solo una página estática
- [ ] **Dónde se copian los builds.** Hoy nginx sirve desde `html/<slug>/`. Definir si el
      despliegue copia a mano o con un script
- [ ] **Qué pasa con el monolito.** Mientras `web` viva en los dos lados (monolito + `/web/` propio),
      nginx decide cuál gana. El `location /web/` es más específico que el catch-all del monolito,
      así que gana el estático — **verificarlo en la primera publicación**
- [ ] **Orden de los `location`.** Con 18 bloques `location /<slug>/` conviene fijar un criterio
      para no pisar rutas del monolito
- [ ] Si la tabla de rutas en BD guarda paths, confirmar que **no cambia nada** (las URLs se conservan)

### 7.1 Plantilla de `location` por portal

```nginx
location /<slug>/ {
    alias html/<slug>/;
    index index.html;
    try_files $uri $uri/ /<slug>/index.html;
}
```

Y el build correspondiente:

```bash
ng build <slug> --base-href /<slug>/
```
