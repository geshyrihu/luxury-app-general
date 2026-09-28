📍 **Ruta:** 📂 `docs/plans/execution` > 📄 `RUNBOOK-fase-3-committee.md`

📅 **Creada:** 08-Ago-2026
👥 **Ejecutores:** OpenCode · KiloCode (relevo) · **Usuario** (servidor)
🧠 **Supervisor:** Claude

---

# 🚀 RUNBOOK — Extracción del portal `committee`

> 🔴 **Lectura obligatoria antes de empezar:**
> 1. `RELAY-PROTOCOL.md` — reglas de relevo (incluida §4.bis)
> 2. `RECETA-EXTRACCION-PORTAL.md` — **los 7 tropiezos y por qué engañan**
>
> Este runbook da los comandos exactos; la receta explica el porqué de cada paso.

**Es el segundo portal.** El primero (`web`) fue atípico: no dependía de nada.
`committee` sí — y por eso es el que valida de verdad el mecanismo.

| Dato | Valor |
| :--- | :--- |
| Slug | `committee` |
| Sitio IIS | **8055** (creado, vacío) |
| Puerto de desarrollo | **4301** |
| Archivos | 33 (19 `.ts`) |
| Rutas | 9, **todas propias** ✅ |
| Amarras con otros portales | **2** → se resuelven en la Fase A |
| Imports internos (`core/`, `@ui/`) | **94** — primer portal que los usa |

---

# 🅰️ FASE A — Cortar las 2 amarras (antes de extraer)

> Estas tareas se hacen **dentro del monolito**. Un portal no puede extraerse mientras importe
> código de otro portal: se llevaría medio `legal` consigo.

## TAREA C1 — Mover 2 tipos compartidos a `core/interfaces/`

**Riesgo:** 🟢 — son tipos puros, sin lógica.

Las 2 amarras de `committee` son **caso A** de la clasificación (tipos → `core/interfaces/`):

| Símbolo | Vive hoy en | Qué es |
| :--- | :--- | :--- |
| `EDocumentType` | `legal.luxuryapp/…/interfaces/document-type.enum.ts` | enum |
| `documentTypeRoutesConfig` | `legal.luxuryapp/…/interfaces/documentTypeRoutesConfig.ts` | objeto de configuración |

> 🎁 **Esta tarea resuelve más de lo que parece.** `EDocumentType` lo importan **10 archivos** de
> 4 portales distintos. Moverlo cierra las 2 amarras de `committee` **y 5 de `operations`**
> de una sola vez — 7 de las 72 del sistema.

- [ ] C1.1 Mover ambos archivos a `projects/luxury-app/src/app/core/interfaces/`:
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp/projects/luxury-app/src/app"
git mv apps/legal.luxuryapp/asuntos-legales-y-seguros/interfaces/document-type.enum.ts core/interfaces/
git mv apps/legal.luxuryapp/asuntos-legales-y-seguros/interfaces/documentTypeRoutesConfig.ts core/interfaces/
```

- [ ] C1.2 Actualizar los imports en **los 10 archivos** que los usan:

```
committee.luxuryapp/board-directors-library/biblioteca-consejo-directivo-detalle.ts
committee.luxuryapp/committee.routing.ts
legal.luxuryapp/asuntos-legales-y-seguros/committee/board-directors-library/biblioteca-consejo-directivo-detalle.ts
legal.luxuryapp/asuntos-legales-y-seguros/documento-personalizado/documento-personalizado-lista.ts
operations.luxuryapp/custom-documents/custom-document/acta-constitutiva-list.ts
operations.luxuryapp/custom-documents/custom-document/asambleas-list.ts
operations.luxuryapp/custom-documents/custom-document/reglamentos-list.ts
operations.luxuryapp/custom-documents/custom-document/special-document-list.ts
operations.luxuryapp/templates/templates-form.ts
operations.luxuryapp/templates/templates-list.ts
```

La ruta nueva es:
```ts
import { EDocumentType } from "src/app/core/interfaces/document-type.enum";
import { documentTypeRoutesConfig } from "src/app/core/interfaces/documentTypeRoutesConfig";
```

> ⚠️ `documentTypeRoutesConfig.ts` **también importa** `EDocumentType`. Actualízalo igual.

**Verificación:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
grep -rn "apps/legal.luxuryapp/asuntos-legales-y-seguros/interfaces" projects/luxury-app/src --include=*.ts | wc -l   # -> 0
node scripts/audit-apps-boundaries.mjs 2>&1 | grep -c "importa de otra app"                                            # -> 65 (eran 72)
npx ng build luxury-app --configuration development                                                                    # -> exit 0
```

🛑 Si el contador no baja de 72 a **65**, algo quedó sin actualizar. PARA y reporta.

> 📌 **El baseline de `audit:apps` debe BAJAR, nunca subir.** No lo regeneres con
> `--update-baseline` para "arreglar" un fallo: se regenera **solo** al resolver violaciones.

**Commit:** `[C1] mueve EDocumentType y documentTypeRoutesConfig a core/interfaces`

---

## TAREA C2 — Confirmar que `committee` quedó aislado

**Verificación:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp/projects/luxury-app/src/app"
grep -rn "src/app/apps/" apps/committee.luxuryapp --include=*.ts | grep -v "committee.luxuryapp" | wc -l   # -> 0
```
Esperado: **`0`**. 🛑 Si aparece algo, `committee` sigue atado a otro portal. PARA y reporta.

---

# 🅱️ FASE B — Extracción (sigue la receta)

> Aplica `RECETA-EXTRACCION-PORTAL.md` §3 con `<slug>` = `committee`.
> Abajo van solo los comandos exactos y los puntos donde este portal difiere de `web`.

## TAREA C3 — Generar y mover

```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
npx ng generate application committee --routing --style=scss
cp -r projects/luxury-app/src/app/apps/committee.luxuryapp/* projects/committee/src/app/
```

- [ ] C3.1 Imports **del propio portal** → relativos
      (`src/app/apps/committee.luxuryapp/...` → `./...`)
      ⚠️ **NO toques** los imports a `src/app/core/...` ni a `@ui/...` — esos **deben quedarse
      tal cual**: los alias del `tsconfig.json` raíz ya los resuelven al monolito. Ver receta §1.
- [ ] C3.2 `app.routes.ts` → `export const routes = committeeRoutes` (rutas **raíz**)
- [ ] C3.3 🔴 Vaciar `app.html` → solo `<router-outlet />`  *(tropiezo #1)*
- [ ] C3.4 Borrar `app.component.*` y `committee.routes.ts` si el generador los creó  *(tropiezo #4)*
      ⚠️ **Conservar `app.component.scss`** — `app.ts` lo referencia.
- [ ] C3.5 🔴 Quitar el prefijo de los enlaces internos  *(tropiezo #2)*:
```bash
cd projects/committee/src/app
for f in $(grep -rl "/committee/" --include=*.html --include=*.ts .); do sed -i 's|/committee/|/|g' "$f"; done
grep -rc "/committee/" --include=*.html --include=*.ts .   # -> sin resultados
```
      ⚠️ Revisa antes que `committee.routing.ts` **no** tenga el prefijo (sus `path` son relativos).

**Verificación:** `npx ng build committee --configuration development` → exit 0

**Commit:** `[C3] genera projects/committee y mueve el codigo del portal`

---

## TAREA C4 — Configuración del proyecto

- [ ] C4.1 🔴 Presupuestos (`angular.json`, proyecto `committee`, config `production`)  *(tropiezo #3)*:
      `anyComponentStyle` → `maximumWarning: "25kb"`, `maximumError: "30kb"`
- [ ] C4.2 Estilos globales **compartidos** — copiar el bloque `styles` del proyecto `web`
      (apunta a `projects/luxury-app/src/styles/`). **No copiar las hojas.**
- [ ] C4.3 Replicar `stylePreprocessorOptions.includePaths` del proyecto `web`.
- [ ] C4.4 `web.config`: copiar `projects/web/web.config` → `projects/committee/web.config`
      y añadirlo a los `assets` del build, igual que en `web`.

**Verificación:** `npx ng build committee --configuration development` → exit 0 y CSS no vacío.

**Commit:** `[C4] configura estilos, presupuestos y web.config de committee`

---

## TAREA C5 — 🚦 PUNTO DE CONTROL: verificación local

**Riesgo:** 🔴 — **aquí es donde este portal se diferencia de `web`. No lo despaches rápido.**

```bash
npx ng serve committee --port 4301
```

> 🚨 **`committee` llama al API autenticado.** Usa `customer-id.service` y `api-response.service`;
> `web` no usaba ninguno. **Este es el primer portal extraído que necesita sesión.**
> Si algo va a fallar por estar fuera del monolito, falla aquí.

Recorrer con la consola abierta:
- [ ] `board-directors` · `monthly-meetings` · `meeting-minutes` · `building-insurance-policy`
      · `financial-reports` · `documents`
- [ ] Abrir un detalle de minuta (`meeting-minutes-detail/:id`)
- [ ] 🔴 **Confirmar que los datos del API CARGAN** (listas con contenido, no vacías)
- [ ] 🔴 **Confirmar que no pide login otra vez**
- [ ] Abrir un PDF (usa `pdf-viewer-modal` de `@ui/`)
- [ ] Comparar contra el monolito: `ng serve luxury-app --port 4200` → `/committee` debe verse igual

🛑 **PARA y avisa al supervisor al terminar C5**, pase o falle. Es el control antes del servidor.

---

# 🅲 FASE C — Build y despliegue (tras el visto bueno)

- [ ] C6 🔴 **Desde PowerShell** *(tropiezo #5)*:
```powershell
npx ng build committee --configuration production --base-href /committee/
```
- [ ] C7 Verificar:
```powershell
Select-String -Path "dist\committee\browser\index.html" -Pattern '<base href="[^"]*"'
```
      Esperado exactamente `<base href="/committee/"`. 🛑 Si dice otra cosa, **no despliegues**.
- [ ] C8 Verificar `dist/committee/browser/web.config` existe.
- [ ] C9 **(Usuario)** Copiar `dist\committee\browser\*` → `C:\inetpub\luxuryapp\committee.luxuryapp\`
- [ ] C10 **(Usuario)** Descomentar en `nginx.conf` **SOLO** el bloque de `committee`
      *(los dos: `location = /committee` y `location /committee/`)*
      ⚠️ **Ni un bloque más.** Ver el incidente de la receta §5.
- [ ] C11 **(Usuario)** `nginx -t` **y solo si pasa** → `nginx -s reload`
- [ ] C12 **(Usuario)** Probar `https://luxurybuildingapp.com/committee/` **con la barra final**
      *(tropiezo #7)*, en **ventana de incógnito**:
      - Consola **casi vacía** (si ves `StorageService`/SignalR, estás en el monolito)
      - **F5 en una ruta interna** no da 404
      - Los datos del API cargan y **no pide login**

---

# 🅳 FASE D — Activación

- [ ] C13 Añadir `"committee"` a `PORTALES_EXTRAIDOS`
- [ ] C14 `npx ng build luxury-app --configuration production`
- [ ] C15 **(Usuario)** Publicar en `C:\inetpub\luxuryappfront\`
- [ ] C16 Dejar correr **3 días** sin borrar `apps/committee.luxuryapp/` del monolito

> 🚨 **Orden obligatorio: C10 (nginx) antes que C13 (lista).**

---

# 🛑 CIERRE

- [ ] `audit:apps` bajó de **72 a 65** amarras
- [ ] `npm run lint` verde
- [ ] `https://luxurybuildingapp.com/committee/` sirve el portal desde IIS
- [ ] Los datos del API cargan y la sesión se mantiene
- [ ] F5 en ruta interna no da 404
- [ ] El monolito conserva su copia (rollback disponible)
- [ ] Actualizar la receta con lo aprendido
