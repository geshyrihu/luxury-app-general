📍 **Ruta:** 📂 `docs/plans/execution` > 📄 `RUNBOOK-fase-3-public.md`

📅 **Creada:** 09-Ago-2026
👥 **Ejecutores:** OpenCode · KiloCode · **Usuario** (servidor y verificación)
🧠 **Supervisor:** Claude

---

# 🚀 RUNBOOK — Portal 3: `public`

> 🔴 **Lectura previa obligatoria:**
> 1. `RELAY-PROTOCOL.md` (incluida §4.bis)
> 2. `RECETA-EXTRACCION-PORTAL.md` — los 9 tropiezos y los 8 hallazgos de `committee`

---

## 0. ⚠️ POR QUÉ ESTE PORTAL ES DISTINTO A LOS DOS ANTERIORES

### 0.1 🔴 Hay enlaces VIVOS en correos apuntando a estas rutas

Confirmado con el usuario. Las 4 rutas públicas se envían por correo a **clientes**, y hay
enlaces circulando de envíos anteriores.

> **Un fallo aquí no lo reporta un empleado: lo ve un cliente al abrir un correo.**
> Y puede ser un correo de hace meses.

Consecuencias, que se aplican en las tareas de abajo:
- Las URLs **no pueden cambiar** bajo ninguna circunstancia.
- El rollback se prueba **antes** de publicar, no cuando haga falta.
- La verificación usa una **URL real de un correo enviado**, no una inventada.
- Se publica en horario de baja actividad y se vigila el `access.log`.

**URL real de referencia** (proporcionada por el usuario):
```
https://luxurybuildingapp.com/publico/operation-report-client/019c6bee-0309-7269-9571-2980e06b823a/2026-07-27/2026-08-02
```
**Línea base medida el 09-Ago-2026, antes de tocar nada:** `HTTP 200` · 3.964 bytes · 64 ms ·
servida por el monolito (`main-T2L5LCTP.js`).

### 0.2 🔴 El slug NO coincide con la URL

Los dos portales anteriores tenían el mismo nombre en carpeta y URL. **Este no:**

| Elemento | Valor |
| :--- | :--- |
| Carpeta y sitio IIS | `public.luxuryapp` (**inglés**) |
| **URL pública** | **`/publico/`** (**español**) — inmutable, hay enlaces vivos |

Por lo tanto, **en todo lo que mira al navegador se usa `publico`, no `public`:**

```
baseHref        : "/publico/"
nginx location  : /publico/
PORTAL_ACTUAL   : "publico"
proyecto Angular: public          (interno, da igual)
sitio IIS       : public.luxuryapp :8063
```

> 🛑 Copiar la receta cambiando `<slug>` por `public` de forma mecánica **rompe las tres cosas
> a la vez**. Aquí `<slug>` vale `publico` para todo lo público.

### 0.3 Es el primer portal que funciona SIN sesión

`AuthService` trata `/publico` como ruta pública y **se salta el login silencioso**.
`committee` era lo contrario. Eso invierte la verificación: no hay que comprobar que la sesión se
restaure, sino que **un usuario anónimo vea el informe**.

> 🔑 **Verificar SIEMPRE en incógnito y sin haber iniciado sesión.** En tu navegador normal
> tienes sesión activa y el informe cargaría aunque el portal estuviera exigiendo autenticación.

---

## 1. Alcance (decidido con el usuario)

### ✅ Se mueve — 13 archivos, **0 amarras** (verificado uno por uno)

| Componente | Ruta pública |
| :--- | :--- |
| `report-client` | `reporte-operacion/:customer/:inicio/:final` |
| `operation-report-client` | `operation-report-client/:customer/:inicio/:final` |
| `report-meeting` | `reporte-minuta/:customer/:id` |
| `reporte-ticket-pendientes-proveedor` | `reporte-ticket-pendientes-proveedor/:customerId/:departamentId` |

Los cuatro viven hoy en `apps/operations.luxuryapp/reports/` y **su único consumidor es
`routing/public.routing.ts`** — `operations` no usa ninguno.

### ⏸️ NO se mueve todavía — y el porqué es de producto, no técnico

`contabilidad-cliente/` (27 archivos, ruta `contabilidad-cliente/:customerId/:anio/:mes`).

Su cadena de dependencias es: `contabilidad-cliente` → `PurchaseHistory` → **`OrdenCompra`**,
que es un **componente de edición** del módulo de Compras.

> 💡 **Decisión de producto del usuario (09-Ago-2026):**
> *"Si estamos en un componente público es para informes, no para editar. El usuario que entra a
> público —estados financieros, cédula, historial— y ahí donde renderiza la orden de compra
> debería ver un modal solo informativo con el detalle, y nada que ver con el módulo de compras
> ni con ese componente de editar."*
>
> Mientras `PurchaseHistory` abra el componente editable, mover el módulo a `public` arrastraría
> medio módulo de Proveedores a un portal de solo consulta. **Primero el refactor, después el
> movimiento.**

**Consecuencia operativa:** esa quinta ruta la sigue sirviendo el monolito. Se resuelve en nginx
con la regla de prefijo más largo (tarea `P10`).

---

# 🅰️ FASE A — Reorganizar DENTRO del monolito

> Todo esta fase ocurre en el monolito. **No se toca el servidor.** Cada paso es reversible y las
> 4 URLs deben seguir funcionando al final, servidas por el monolito exactamente como hoy.

## TAREA P1 — Mover los 4 componentes

```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp/projects/luxury-app/src/app"
git mv apps/operations.luxuryapp/reports/report-client                       apps/public.luxuryapp/
git mv apps/operations.luxuryapp/reports/operation-report-client             apps/public.luxuryapp/
git mv apps/operations.luxuryapp/reports/report-meeting                      apps/public.luxuryapp/
git mv apps/operations.luxuryapp/reports/reporte-ticket-pendientes-proveedor apps/public.luxuryapp/
```

**Verificación:**
```bash
find apps/public.luxuryapp -name '*.ts' | wc -l      # -> 13 aprox (incluye INDEX.ts y public.routes.ts)
ls apps/operations.luxuryapp/reports/                # -> ya no estan los 4
```

**Commit:** `[P1] mueve los 4 reportes publicos a public.luxuryapp`

---

## TAREA P2 — Llenar `public.routes.ts`

**Riesgo:** 🔴 — aquí viven las URLs que reciben los clientes.

- [ ] P2.1 Copiar a `apps/public.luxuryapp/public.routes.ts` las **4** rutas que hoy están en
      `routing/public.routing.ts`, actualizando los `loadComponent` a las rutas nuevas.
- [ ] P2.2 🛑 **Los `path` se copian LETRA POR LETRA.** No corregir la mezcla de idiomas
      (`reporte-operacion` junto a `operation-report-client`), no "mejorar" nombres, no tocar
      guiones. **Cada uno es una URL viva en un correo.**
- [ ] P2.3 Conservar los bloques `data` (`title`, `breadcrumb`) tal cual.
- [ ] P2.4 En `routing/public.routing.ts` dejar **solo** la ruta de `contabilidad-cliente`, y que
      cargue las otras 4 desde `public.routes.ts`.

**Verificación:**
```bash
npx ng build luxury-app --configuration development     # -> exit 0
```

**Commit:** `[P2] public.routes.ts con las 4 rutas publicas`

---

## TAREA P3 — 🚦 PUNTO DE CONTROL: las 4 URLs siguen vivas

**Riesgo:** 🔴 — **no se avanza sin esto.**

```bash
npx ng serve luxury-app --port 4200
```

Probar en el navegador, **en incógnito y sin iniciar sesión**, las 4 rutas con parámetros reales.
La de referencia:
```
http://localhost:4200/publico/operation-report-client/019c6bee-0309-7269-9571-2980e06b823a/2026-07-27/2026-08-02
```

- [ ] Las 4 cargan y **muestran datos**, no solo el armazón
- [ ] Sin errores rojos en consola
- [ ] **No redirige al login** (son públicas)

🛑 Cualquier fallo → PARAR. Una ruta rota aquí es un correo roto en producción.

**Commit:** — (verificación)

---

# 🅱️ FASE B — Extracción

> Sigue `RECETA-EXTRACCION-PORTAL.md` §3, con `<slug>` = **`publico`** para todo lo público
> (ver §0.2) y `public` como nombre del proyecto Angular.

## TAREA P4 — Generar la app y mover el código

Aplicar los pasos 1–10 de la receta. Recordatorios de lo que el CLI **no** genera:

- [ ] `app.html` → solo `<router-outlet />`
- [ ] Borrar `app.component.*` y `public.routes.ts` duplicado del generador
- [ ] Quitar el prefijo `/publico/` de los enlaces internos, si los hay
- [ ] `fileReplacements` en la config de producción
- [ ] **`baseHref: "/publico/"`** en las `options` del proyecto
- [ ] `assets` apuntando a `projects/luxury-app/public`
- [ ] Presupuestos alineados con el monolito
- [ ] `web.config` como asset
- [ ] `{ provide: PORTAL_ACTUAL, useValue: "publico" }` en `app.config.ts`

> ⚠️ **El bloque de `app.routes.ts` del monolito para `publico` NO tiene guards ni layout**
> (es público, por eso). Verificarlo antes de replicar — a diferencia de `committee`, aquí lo
> correcto es **no** poner `canActivate`.

## TAREA P5 — `ngsw-config.json`: excluir `/publico/`

- [ ] Agregar `"!/publico/**"` a `navigationUrls`
- [ ] Republicar el monolito **antes** de activar el portal

## TAREA P6 — 🚦 Verificación local del portal

```bash
npx ng serve public --port 4302
```
Las 4 rutas, **en incógnito y sin sesión**, con parámetros reales. Comparar contra
`localhost:4200/publico/...` — deben verse **idénticas**.

🛑 PARAR aquí y avisar al supervisor, pase o falle.

---

# 🅲 FASE C — Publicación (extremar precauciones)

## TAREA P7 — Build

```powershell
Remove-Item -Recurse -Force dist\public
npx ng build public --configuration production
Select-String -Path "dist\public\browser\index.html" -Pattern '<base href="[^"]*"'
```
Esperado exactamente: `<base href="/publico/"`. 🛑 Cualquier otra cosa, **no desplegar**.

Y las otras dos que P4 dio por buenas sin mirar el artefacto:

```powershell
Select-String -Path "dist\publicrowser\*.js" -Pattern "localhost:7070"   # → sin coincidencias
Get-ChildItem dist\publicrowser | Where-Object Name -match "assets|favicon|web.config"
```

🛑 Si aparece `localhost:7070`, el portal quedaría hablándole al API de desarrollo: **no
desplegar**. Si falta `assets/`, salen las imágenes y los iconos en 404.

## TAREA P8 — 🔴 PROBAR EL ROLLBACK ANTES DE PUBLICAR

> **Esta tarea no existe en los otros runbooks.** Está aquí porque hay clientes con enlaces vivos:
> hay que saber que la salida de emergencia funciona **antes** de necesitarla.

- [ ] P8.1 **(Usuario)** Copiar el build a `C:\inetpub\luxuryapp\public.luxuryapp\`
- [ ] P8.2 **(Usuario)** Descomentar **solo** el bloque de `publico` en nginx → `nginx -t` → `reload`
- [ ] P8.3 **(Usuario)** Probar la URL real → debe cargar desde el **portal**
- [ ] P8.4 **(Usuario)** 🔴 **Volver a comentar el bloque** → `nginx -t` → `reload`
- [ ] P8.5 **(Usuario)** Probar la URL real otra vez → debe cargar desde el **monolito**
- [ ] P8.6 **(Usuario)** Descomentar de nuevo → `nginx -t` → `reload`

**Criterio:** la URL responde **200 con datos** en los tres estados. Ahora sabes que puedes
volver atrás en segundos si algo aparece más tarde.

## TAREA P9 — Verificación en producción

Con la URL real, **en incógnito y sin sesión**:
- [ ] Carga y muestra datos
- [ ] **F5 en la misma URL** no da 404 (valida el `web.config`)
- [ ] Las otras 3 rutas igual
- [ ] Consola sin errores
- [ ] Comparar contra la línea base: `HTTP 200`, ~64 ms

## TAREA P10 — La quinta ruta se queda en el monolito

`/publico/contabilidad-cliente/...` sigue sirviéndola el monolito. Se resuelve con la regla de
prefijo más largo de nginx:

```nginx
# MAS ESPECIFICO primero por claridad (nginx elige por longitud, no por orden):
# esta ruta se queda en el monolito hasta que se resuelva el refactor de PurchaseHistory
location /publico/contabilidad-cliente/ {
    proxy_pass http://localhost:8050/publico/contabilidad-cliente/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /publico/ {
    proxy_pass http://localhost:8063/;
    ...
}
```

- [ ] Verificar **las dos**: una ruta del portal y la de contabilidad, ambas 200 con datos.

## TAREA P11 — Observación reforzada

- [ ] Publicar en **horario de baja actividad**
- [ ] Revisar `C:\nginx\logs\access.log` buscando `404` bajo `/publico/` — **a diario, 3 días**
- [ ] No borrar nada del monolito durante ese periodo

---

# 🛑 CIERRE

- [ ] Las 4 URLs de correo responden 200 con datos, en incógnito y sin sesión
- [ ] La 5ª (`contabilidad-cliente`) sigue funcionando desde el monolito
- [ ] F5 en ruta profunda sin 404
- [ ] Rollback **probado**, no supuesto
- [ ] `access.log` sin 404 nuevos bajo `/publico/`
- [ ] El monolito conserva su copia
- [ ] Anotado el refactor pendiente: modal informativo de orden de compra en el módulo público
