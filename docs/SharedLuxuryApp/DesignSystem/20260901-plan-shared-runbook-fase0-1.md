📍 **Ruta:** 📂 `docs/plans/execution` > 📄 `RUNBOOK-fase-0-1.md`

📅 **Última Revisión:** 07-Ago-2026
🛡️ **Estado:** Listo para ejecutar
👥 **Ejecutores:** OpenCode (entra primero) · KiloCode (relevo)
🧠 **Supervisor:** Claude

---

# 🔧 RUNBOOK — Fase 0 y Fase 1 (La Mudanza)

> 🔴 **ANTES DE EMPEZAR:** lee `RELAY-PROTOCOL.md` completo. Es obligatorio.
> Si no lo has leído, para aquí y léelo.

**Recordatorio de las 3 reglas que más se rompen:**
1. `client/angular` **NO SE TOCA**. Solo lectura.
2. Fase 1 es una **mudanza**. No se cambia una sola línea de código de negocio.
3. Ante cualquier duda → 🛑 **PARA**. No improvises.

---

## 🖥️ TAREA 0.0 — Entorno obligatorio: Windows, NO WSL

> 🔴 **Ejecuta esta verificación ANTES de la tarea 0.1.** Añadida el 07-Ago-2026 tras un
> falso positivo real causado por ejecutar desde WSL.

**Este runbook se ejecuta desde Windows** (PowerShell o Git Bash), **nunca desde WSL**. Dos razones:

| Motivo | Consecuencia si usas WSL |
| :--- | :--- |
| La tarea 1.1 usa `robocopy` | **No existe en WSL.** La copia falla o la haces distinto y rompes la fidelidad |
| WSL accede por `/mnt/d/` con otra semántica de archivos | Git marca **miles de archivos como modificados** sin que nada haya cambiado |

**Verificación:**
```bash
uname -s 2>/dev/null || echo "Windows"
```

| Resultado | Qué significa |
| :--- | :--- |
| `MINGW64_NT-…` o `Windows` | ✅ Correcto — Git Bash o PowerShell en Windows |
| `Linux` | 🛑 **PARAR.** Estás en WSL. Cambia a PowerShell o Git Bash y reinicia desde 0.0 |

También confirma que `node` responde sin usar `node.exe`:
```bash
node --version
```
Si tienes que escribir `node.exe` para que funcione, **estás en WSL** → 🛑 PARAR.

---

## 📋 Índice de tareas

| ID | Tarea | Riesgo |
| :--- | :--- | :--- |
| 0.1 | Archivar línea base | 🟢 |
| 0.2 | Verificar repo origen limpio | 🟢 |
| 1.1 | Copiar el proyecto | 🟡 |
| 1.2 | Inicializar repo git propio | 🟢 |
| 1.3 | 🚦 **PUNTO DE CONTROL** — build verde antes de reestructurar | 🔴 |
| 1.4 | Mover `src/` y `public/` a `projects/luxury-app/` | 🟡 |
| 1.5.A | Actualizar 5 archivos de config de build | 🔴 |
| 1.5.B | Actualizar 16 archivos de tooling | 🔴 |
| 1.5.C | Red de seguridad — buscar referencias olvidadas | 🔴 |
| 1.6 | Build dev + prod y comparar con la base | 🔴 |
| 1.7 | Verificar los 18 portales en el navegador | 🔴 |
| 1.8 | Congelar `client/angular` | 🟢 |

---

# FASE 0 — Preparación

## TAREA 0.1 — Archivar línea base

**Agente:** OpenCode

**Precondición:**
```bash
ls -d "D:/repos/luxuryapp-api/client/angular"
```
Esperado: la ruta existe. Si no → 🛑 PARAR.

**Acción:**
```bash
mkdir -p "D:/repos/luxuryapp-api/docs/plans/execution/baseline"
cd "D:/repos/luxuryapp-api/client/angular"
npx ng build --configuration development  > "../../docs/plans/execution/baseline/build-dev.txt"  2>&1
npx ng build --configuration production   > "../../docs/plans/execution/baseline/build-prod.txt" 2>&1
node scripts/audit-apps-boundaries.mjs    > "../../docs/plans/execution/baseline/audit-apps.txt" 2>&1
```

> ℹ️ `audit-apps-boundaries.mjs` sale con código **1** — es lo esperado hoy (72 violaciones).
> No es un error. No lo arregles.

**Verificación:**
```bash
grep -c "Initial total" "D:/repos/luxuryapp-api/docs/plans/execution/baseline/build-prod.txt"
grep -c "violación(es)"  "D:/repos/luxuryapp-api/docs/plans/execution/baseline/audit-apps.txt"
```
Esperado: `1` y `1`. Cualquier otra cosa → 🛑 PARAR.

**Al terminar:** anota en el LEDGER la línea de `Initial total` y el número de violaciones.

---

## TAREA 0.2 — Verificar repo origen limpio

**Agente:** OpenCode

**Acción + Verificación:**
```bash
cd "D:/repos/luxuryapp-api/client/angular"
git status --short | wc -l
git branch --show-current
```
Esperado: `0` y `main`.

### 🚨 Si te salen MUCHOS archivos modificados (cientos o miles)

> Esto pasó de verdad el 07-Ago-2026: `git status` reportó **3,736** archivos modificados
> y **ninguno tenía un solo cambio real**. Antes de alarmarte, haz esta prueba.

**Prueba diagnóstica — distingue "cambio real" de "caché desactualizado":**
```bash
git diff --shortstat 2>/dev/null
```

| Resultado | Diagnóstico | Qué hacer |
| :--- | :--- | :--- |
| **Vacío** | Falso positivo. Caché de git desactualizado (típico si se tocó el repo desde WSL). **No hay nada que perder.** | `git update-index --refresh` y repite la verificación |
| **Muestra líneas cambiadas** | Cambios reales sin commitear | 🛑 **PARAR.** No commitees tú. Reporta al supervisor |

> ⚠️ **Nunca uses `git checkout -- .`, `git reset --hard` ni `git clean`** para "limpiar" esto.
> Si los cambios fueran reales, los destruirías sin vuelta atrás. El comando seguro es
> `git update-index --refresh`, que solo actualiza metadatos y **no puede tocar contenido**.

En cualquier otro caso de cambios sin commitear → 🛑 **PARAR.** No commitees tú. Reporta al supervisor.

---

# FASE 1 — La Mudanza

## TAREA 1.1 — Copiar el proyecto

**Agente:** OpenCode

**Precondición:**
```bash
ls -d "D:/repos/luxuryapp-api/client/luxuryapp" 2>/dev/null && echo "YA EXISTE" || echo "LIBRE"
```
Esperado: `LIBRE`. Si dice `YA EXISTE` → 🛑 PARAR (otro agente ya la creó; revisa el LEDGER).

**Acción** — usa PowerShell, no bash:
```powershell
robocopy "D:\repos\luxuryapp-api\client\angular" "D:\repos\luxuryapp-api\client\luxuryapp" /E /XD "D:\repos\luxuryapp-api\client\angular\node_modules" "D:\repos\luxuryapp-api\client\angular\dist" "D:\repos\luxuryapp-api\client\angular\.angular" "D:\repos\luxuryapp-api\client\angular\.git" "D:\repos\luxuryapp-api\client\angular\test-results" "D:\repos\luxuryapp-api\client\angular\playwright-report" "D:\repos\luxuryapp-api\client\angular\.tmp" "D:\repos\luxuryapp-api\client\angular\reports" "D:\repos\luxuryapp-api\client\angular\storybook-static" /XF audit-report.json audit-report.csv
```

> 🚨 **POR QUÉ LAS RUTAS COMPLETAS (corregido 07-Ago-2026).**
> La versión anterior usaba nombres sueltos (`/XD reports`). En robocopy eso excluye **cualquier**
> carpeta con ese nombre **a cualquier profundidad** — no solo la de la raíz.
> Resultado real: se perdieron 40 archivos de código de negocio en
> `operations.luxuryapp/reports/` y `task-engine/tasks/reports/`, y el build falló en 1.3.
> **Con ruta completa, robocopy excluye solo esa carpeta exacta.** No vuelvas a usar nombres sueltos.

> 🚨 **TRAMPA — no te asustes con el código de salida.**
> `robocopy` devuelve **1** cuando copió archivos con éxito. Es normal.
> Códigos **0–7 = ÉXITO**. Solo **8 o más** es error real.
> Si tu herramienta reporta "falló con código 1", **ignóralo** y pasa a la verificación.

**Verificación — parte 1: estructura**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
ls -d src public angular.json package.json && echo "ESTRUCTURA OK"
ls -d node_modules dist .git 2>/dev/null && echo "ERROR: se copio basura" || echo "LIMPIO OK"
```
Esperado: `ESTRUCTURA OK` y `LIMPIO OK`.

**Verificación — parte 2: la copia está COMPLETA** *(añadida 07-Ago-2026 — obligatoria)*

> 🔑 **Que existan las carpetas no significa que estén completas.** Esta comparación es la que
> atrapa archivos perdidos por una exclusión mal puesta. Sin ella, el fallo aparece recién
> en el build de 1.3 y cuesta mucho más diagnosticar.

```bash
cd "D:/repos/luxuryapp-api/client"
diff <(cd angular   && find src public -type f 2>/dev/null | sort) \
     <(cd luxuryapp && find src public -type f 2>/dev/null | sort)
```

Esperado: **salida vacía** (los dos árboles son idénticos).

🛑 Si aparece cualquier línea con `<`, esos archivos **no se copiaron**. PARA y reporta la lista.
No continúes: cada archivo que falte es un error de build esperándote en la tarea 1.3.

---

## TAREA 1.1.FIX — Recuperar las 2 carpetas `reports` perdidas

**Agente:** OpenCode
**Añadida:** 07-Ago-2026 por el supervisor, tras el fallo del build en 1.3.

> ℹ️ **Solo ejecuta esta tarea si ya hiciste la copia con la versión ANTIGUA del comando 1.1**
> (la que usaba `/XD reports` con nombre suelto). Si copiaste con el comando corregido de rutas
> completas, **sáltala** — las carpetas ya están.
>
> **No hay que rehacer la copia.** Se verificó que faltan exactamente 40 archivos en 2 carpetas
> y que no sobra ni falta nada más. La corrección es quirúrgica.

**Precondición:**
```bash
ls -d "D:/repos/luxuryapp-api/client/luxuryapp/src/app/apps/operations.luxuryapp/reports" 2>/dev/null && echo "YA ESTA - saltar tarea" || echo "FALTA - ejecutar"
```

**Acción** (PowerShell):
```powershell
robocopy "D:\repos\luxuryapp-api\client\angular\src\app\apps\operations.luxuryapp\reports" "D:\repos\luxuryapp-api\client\luxuryapp\src\app\apps\operations.luxuryapp\reports" /E
robocopy "D:\repos\luxuryapp-api\client\angular\src\app\apps\operations.luxuryapp\task-engine\tasks\reports" "D:\repos\luxuryapp-api\client\luxuryapp\src\app\apps\operations.luxuryapp\task-engine\tasks\reports" /E
```

> Recuerda: robocopy devuelve **1** cuando copia con éxito. Códigos 0–7 = éxito.

**Verificación** — el árbol completo debe quedar idéntico:
```bash
cd "D:/repos/luxuryapp-api/client"
diff <(cd angular   && find src public -type f 2>/dev/null | sort) \
     <(cd luxuryapp && find src public -type f 2>/dev/null | sort)
```
Esperado: **salida vacía**. Deben aparecer 40 archivos nuevos respecto a antes.

**Commit:** `[1.1.FIX] recupera 2 carpetas reports excluidas por error en la copia`

Hecho esto, **vuelve a la tarea 1.3** y repite el build.

---

## TAREA 1.2 — Inicializar repo git propio

**Agente:** OpenCode

**Precondición:** la tarea 1.1 está ✅ en el LEDGER.

**Acción:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
git init
git add -A
git commit -m "chore: estado inicial - copia fiel de client/angular

Copia de client/angular @ main como punto de partida del proyecto luxuryapp.
Sin cambios de codigo. Ver docs/plans/20260807-luxuryapp-monolito-nuevo-plan.md"
```

**Verificación:**
```bash
git log --oneline | wc -l
git status --short | wc -l
```
Esperado: `1` y `0`.

> ⚠️ **P7:** no configures remotos ni hagas `push`. Eso lo decide el supervisor.

---

## TAREA 1.3 — 🚦 PUNTO DE CONTROL: build verde ANTES de reestructurar

**Agente:** OpenCode
**Riesgo:** 🔴 — **esta tarea existe para atrapar una copia mala AHORA y no 200 archivos después.**

**Acción:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
npm install
npx ng build --configuration production
```

> ⏱️ `npm install` puede tardar varios minutos. El build tarda ~2 min. Es normal, espera.

**Verificación:**
```bash
ls dist/luxury-app/browser/index.html && echo "BUILD OK"
```
Esperado: `BUILD OK`.

🛑 **Si el build falla aquí, PARA inmediatamente.** No intentes arreglarlo.
La copia salió mal y hay que corregir la copia, no el código. Reporta al supervisor con
la salida literal del error.

---

## TAREA 1.4 — Mover `src/` y `public/` a `projects/luxury-app/`

**Agente:** OpenCode

**Precondición:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
ls -d src public && git status --short | wc -l
```
Esperado: existen `src` y `public`, y `0` cambios pendientes.

**Acción:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
mkdir -p projects/luxury-app
git mv src projects/luxury-app/src
git mv public projects/luxury-app/public
```

**Verificación:**
```bash
ls -d projects/luxury-app/src projects/luxury-app/public && echo "MOVIDO OK"
ls -d src public 2>/dev/null && echo "ERROR: quedaron copias" || echo "RAIZ LIMPIA OK"
```
Esperado: `MOVIDO OK` y `RAIZ LIMPIA OK`.

> ℹ️ El build va a **fallar** después de esta tarea. Es lo esperado — las rutas se arreglan en 1.5.
> No intentes compilar todavía.

**Commit:** `[1.4] mueve src/ y public/ a projects/luxury-app/`

---

## TAREA 1.5.A — Actualizar los 5 archivos de config de build

**Agente:** OpenCode
**Riesgo:** 🔴 — la tarea más delicada de la fase.

> 📌 **Regla:** haz **solo** los reemplazos listados. Son literales exactos.
> No "aproveches" para ordenar, formatear o mejorar nada más (P3).

### Archivo 1 de 5 — `angular.json`

| Buscar (literal) | Reemplazar por |
| :--- | :--- |
| `"root": "",` | `"root": "projects/luxury-app",` |
| `"sourceRoot": "src",` | `"sourceRoot": "projects/luxury-app/src",` |
| `"src/styles",` | `"projects/luxury-app/src/styles",` |
| `"src"` *(dentro de `includePaths`, la línea siguiente)* | `"projects/luxury-app/src"` |
| `"index": "src/index.html",` | `"index": "projects/luxury-app/src/index.html",` |
| `"browser": "src/main.ts",` | `"browser": "projects/luxury-app/src/main.ts",` |
| `"src/onesignal/OneSignalSDKWorker.js",` | `"projects/luxury-app/src/onesignal/OneSignalSDKWorker.js",` |
| `"input": "public"` | `"input": "projects/luxury-app/public"` |
| `"src/styles/ds-entry.scss",` | `"projects/luxury-app/src/styles/ds-entry.scss",` |
| `"src/styles/styles.scss",` | `"projects/luxury-app/src/styles/styles.scss",` |
| `"replace": "src/environments/environment.ts",` | `"replace": "projects/luxury-app/src/environments/environment.ts",` |
| `"with": "src/environments/environment.prod.ts"` | `"with": "projects/luxury-app/src/environments/environment.prod.ts"` |

> ✅ **NO cambies** `"outputPath": "dist/luxury-app"`. Debe quedar igual — si lo cambias,
> rompes `capacitor.config.ts`, que apunta a `dist/luxury-app/browser`.
> ✅ **NO cambies** `"tsConfig": "tsconfig.app.json"` — ese archivo se queda en la raíz.

### Archivo 2 de 5 — `tsconfig.json`

| Buscar | Reemplazar por |
| :--- | :--- |
| `"src/*": ["./src/*"],` | `"src/*": ["./projects/luxury-app/src/*"],` |
| `"@ui/*": ["./src/app/shared/ui/*"]` | `"@ui/*": ["./projects/luxury-app/src/app/shared/ui/*"]` |

### Archivo 3 de 5 — `tsconfig.app.json`

| Buscar | Reemplazar por |
| :--- | :--- |
| `"files": ["src/main.ts"],` | `"files": ["projects/luxury-app/src/main.ts"],` |
| `"include": ["src/**/*.d.ts"]` | `"include": ["projects/luxury-app/src/**/*.d.ts"]` |

### Archivo 4 de 5 — `tsconfig.spec.json`

En el bloque `"include"`, reemplaza las tres entradas:

| Buscar | Reemplazar por |
| :--- | :--- |
| `"src/**/*.ts",` | `"projects/luxury-app/src/**/*.ts",` |
| `"src/**/*.d.ts",` | `"projects/luxury-app/src/**/*.d.ts",` |
| `"src/test-setup.ts"` | `"projects/luxury-app/src/test-setup.ts"` |

### Archivo 5 de 5 — `vitest.config.ts`

| Buscar | Reemplazar por |
| :--- | :--- |
| `resolve(__dirname, 'src') + '/'` | `resolve(__dirname, 'projects/luxury-app/src') + '/'` |
| `resolve(__dirname, 'src/app/core') + '/'` | `resolve(__dirname, 'projects/luxury-app/src/app/core') + '/'` |
| `resolve(__dirname, 'src/app/shared/ui') + '/'` | `resolve(__dirname, 'projects/luxury-app/src/app/shared/ui') + '/'` |
| `setupFiles: ['src/test-setup.ts'],` | `setupFiles: ['projects/luxury-app/src/test-setup.ts'],` |
| `include: ['src/**/*.{test,spec}` | `include: ['projects/luxury-app/src/**/*.{test,spec}` |

**Verificación de 1.5.A:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
npx ng build --configuration development
```
Esperado: build **verde**. Si falla → 🛑 PARAR y reporta el error literal.

**Commit:** `[1.5.A] actualiza rutas en config de build`

---

## TAREA 1.5.B — Actualizar los 16 archivos de tooling

**Agente:** OpenCode (o KiloCode si hubo relevo)
**Riesgo:** 🔴

> 🚨 **TRAMPA CRÍTICA — LEE ESTO.**
> Estos archivos buscan la carpeta `src/` desde la raíz. Al moverla, **no la encuentran**.
> Y varios **no fallan: salen con éxito sin haber revisado nada.**
>
> Concretamente, `audit-apps-boundaries.mjs` hace `process.exit(0)` si no encuentra la carpeta.
> Resultado: `npm run lint` diría **"✅ 0 violaciones"** cuando en realidad hay 72 y no revisó ni una.
> **Un falso verde es peor que un error rojo**, porque nadie se entera.
> Por eso la tarea 1.5.C existe y es obligatoria.

> 📌 **REESCRITA 07-Ago-2026 por el supervisor.** La versión anterior daba patrones genéricos y
> 10 de 16 archivos no encajaban — OpenCode paró correctamente. Ahora la tabla es **exacta por
> archivo y por línea**. Ya no hay que interpretar nada.
>
> **Hallazgo adicional del supervisor:** `audit-ds-tokens.mjs` **también** está afectado y **sí
> corre en `npm run lint`**. No aparecía en la lista de 16 porque mi búsqueda original no cubría
> el patrón `globSync('src/app/...')`. Son **17** archivos, y uno de ellos no necesita cambios.

---

### 🅰️ GRUPO 1 — Corren en `npm run lint`. **Deben quedar funcionando.**

| # | Archivo | Línea | Buscar | Reemplazar por |
| :-- | :--- | :-- | :--- | :--- |
| 1 | `scripts/audit-apps-boundaries.mjs` | 13 | `process.cwd(), "src", "app", "apps"` | `process.cwd(), "projects", "luxury-app", "src", "app", "apps"` |
| 2 | `scripts/audit-ui-boundaries.mjs` | 14 | `process.cwd(), "src", "app"` | `process.cwd(), "projects", "luxury-app", "src", "app"` |
| 3 | `scripts/audit-design-system.mjs` | 14 | `process.cwd(), "src", "app"` | `process.cwd(), "projects", "luxury-app", "src", "app"` |
| 4 | `scripts/audit-ds-tokens.mjs` | 17 | `globSync('src/app/**/*.scss'` | `globSync('projects/luxury-app/src/app/**/*.scss'` |
| 5 | `scripts/audit-css-classes.ts` | 31 | `const SRC = resolve(ROOT, 'src');` | `const SRC = resolve(ROOT, 'projects', 'luxury-app', 'src');` |

> ℹ️ En el #5, **no toques** `ROOT` (línea 30) ni las líneas 307/310 (`audit-report.json/csv`
> se quedan en la raíz del workspace).

**Archivo 6 — `scripts/audit-emoji-usage.mjs`** (necesita 3 cambios, no 1):

| Línea | Buscar | Reemplazar por |
| :-- | :--- | :--- |
| 6 | `const sourceRoot = path.join(projectRoot, "src");` | `const appRoot = path.join(projectRoot, "projects", "luxury-app");`<br>`const sourceRoot = path.join(appRoot, "src");` *(dos líneas)* |
| 182 | `path.relative(projectRoot, absolutePath)` | `path.relative(appRoot, absolutePath)` |

> 🔑 **Por qué el cambio de la línea 182.** La función `getModuleName` (línea 64) hace
> `if (segments[0] !== "src")`. Si dejaras `projectRoot`, la ruta relativa empezaría por
> `projects` y el reporte agruparía todo mal. Con `appRoot`, el primer segmento sigue siendo
> `src` y la lógica original se conserva intacta.
>
> ℹ️ **No toques** la línea 7 (`reportsDir`) ni las 291-292: los reportes se quedan en la raíz
> del workspace, que es lo correcto.

**Archivo 7 — `scripts/audit-encoding.mjs`: NO SE TOCA.**
Verificado por el supervisor: resuelve `repoRoot` subiendo dos niveles desde `cwd`, lo que desde
`client/luxuryapp` da la raíz del monorepo, y le pasa `client/luxuryapp` como objetivo. **Ya
funciona correctamente.** Si lo modificas, lo rompes.

---

### 🅱️ GRUPO 2 — Storybook y vitest

| Archivo | Qué cambiar |
| :--- | :--- |
| `.storybook/main.ts` (L5-6) | El prefijo de los globs de stories: `../src/…` → `../projects/luxury-app/src/…` |
| `.storybook/tsconfig.json` (L9-10) | Ídem en `include`. **No toques** el `"extends"` de la L2 — `tsconfig.app.json` se queda en la raíz |
| `.storybook/tsconfig.doc.json` (L6, L8) | Ídem en `include` |
| `vitest.cobranza-nativa.config.ts` (L9-11, L14, L25, L26) | Los `resolve(__dirname,'src…')` y los strings `"src/test-shims/…"`, `"src/test-setup.ts"` → prefijados con `projects/luxury-app/`. **Conserva las claves de alias** (`'src/'`, `'@ui/'`); cambia solo el destino |

---

### 🅲 GRUPO 3 — Herramientas sueltas (**no** corren en `npm run lint`)

> 🚨 **ESTE GRUPO ES EL PELIGROSO, y no por lo que parece.**
> Estos scripts tienen la ruta `client/angular` **escrita a mano**. Como ese repo **sigue
> existiendo**, no fallarían: **auditarían el proyecto viejo y reportarían verde.**
> Y `extract-design-conventions.mjs` es peor todavía — **escribe** su salida dentro de
> `client/angular`, violando la regla P1 de no tocar el respaldo.

| Archivo | Línea(s) | Buscar | Reemplazar por |
| :--- | :-- | :--- | :--- |
| `scripts/audit-design-conventions.mjs` | 49 y ~50 sitios | `client/angular/src` | `projects/luxury-app/src` |
| `scripts/fix-design-system.mjs` | 4, 7 | `client/angular/src` | `projects/luxury-app/src` |
| `scripts/strip-styles.mjs` | 4 | `client/angular/src` | `projects/luxury-app/src` |
| `scripts/audit-modals.mjs` | 4, 36 | `D:/repos/luxuryapp-api/client/angular/` | `D:/repos/luxuryapp-api/client/luxuryapp/projects/luxury-app/` |
| `scripts/fix-css-legacy.mjs` | 5 | `path.resolve('src')` | `path.resolve('projects', 'luxury-app', 'src')` |
| `scripts/generate-ui-dictionary.mjs` | 8, 9 | `'../src/app/` | `'../projects/luxury-app/src/app/` |

**`scripts/extract-design-conventions.mjs`** — dos cambios distintos:

| Línea(s) | Buscar | Reemplazar por |
| :-- | :--- | :--- |
| 26-29 | `'client', 'angular', 'src', 'assets', 'design-conventions.json'` | `'client', 'luxuryapp', 'projects', 'luxury-app', 'src', 'assets', 'design-conventions.json'` |
| 49+ (~50 sitios) | `client/angular/src` | `projects/luxury-app/src` |

> ℹ️ **No toques** la línea 23 (`repoRoot = resolve(__dirname,'..','..','..')`). Desde
> `client/luxuryapp/scripts` sigue resolviendo a la raíz del monorepo, que es lo correcto.
> Los comentarios de las líneas 19-20 quedan desactualizados; puedes corregirlos o dejarlos.

> ✅ **Criterio de aceptación del Grupo 3:** que **ninguno** siga apuntando a `client/angular`.
> No hace falta verificar que funcionen — son herramientas de un solo uso, fuera de `npm run lint`.
> Si alguna ruta quedara imperfecta, el script fallará ruidosamente (archivo no encontrado), que
> es aceptable. **Lo inaceptable es que apunte al repo congelado.**

---

> 🛑 Si encuentras un patrón que **no está en ninguna de estas tablas**, PARA y repórtalo.
> No adivines. (Así fue como se detectó este problema, y funcionó.)

**Verificación de 1.5.B:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
node scripts/audit-apps-boundaries.mjs 2>&1 | grep -c "violación(es)"
```
Esperado: **`1`** (encuentra el bloque de 72 violaciones).

🛑 Si sale `0` o aparece el texto **"No se pudo leer el directorio apps/"**, el script sigue sin
encontrar la carpeta → **falso verde**. PARA y corrige ese archivo.

**Commit:** `[1.5.B] actualiza rutas en scripts y tooling`

---

## TAREA 1.5.C — Red de seguridad: buscar referencias olvidadas

**Agente:** OpenCode
**Riesgo:** 🔴 — esta tarea es la que atrapa lo que 1.5.A y 1.5.B dejaron pasar.

> 📌 **REFORZADA 07-Ago-2026.** La versión anterior solo buscaba rutas relativas a `src`. No
> detectaba referencias al **repo viejo** (`client/angular/…`) ni **rutas absolutas** (`D:/…`),
> que son justamente las que producen un falso verde. Ahora son **tres** redes, no una.

**Red 1 — rutas `src` sin prefijar:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
grep -rn '"src/\|'"'"'src/\|(process.cwd(), "src"\|__dirname, '"'"'src\|resolve(ROOT, '"'"'src' \
  angular.json tsconfig*.json vitest*.ts postcss.config.js scripts/ .storybook/ 2>/dev/null \
  | grep -v "projects/luxury-app"
```

**Red 2 — referencias al repo congelado (la más importante):**
```bash
grep -rn "client/angular\|client', 'angular\|client\", \"angular" \
  angular.json tsconfig*.json vitest*.ts scripts/ .storybook/ package.json 2>/dev/null
```

**Red 3 — rutas absolutas al proyecto viejo:**
```bash
grep -rn "luxuryapp-api/client/angular\|luxuryapp-api\\\\client\\\\angular" \
  angular.json tsconfig*.json vitest*.ts scripts/ .storybook/ 2>/dev/null
```

Esperado en las **tres**: salida vacía.

> ⚠️ La **Red 2** es la que evita el desastre silencioso: un script que apunta a `client/angular`
> **no falla** — audita el proyecto viejo y reporta verde. Nadie se entera hasta mucho después.
> Si la Red 2 devuelve algo, no es un detalle cosmético.
>
> ℹ️ Excepción legítima: comentarios explicativos que mencionen `client/angular` como referencia
> histórica. Si es un comentario y no una ruta que el código usa, puedes dejarlo — pero anótalo
> en el LEDGER.

🛑 Si aparece cualquier línea de código (no comentario), corrígela y vuelve a correr las tres
hasta que queden vacías.

**Commit:** `[1.5.C] cierra referencias residuales a src/`

---

## TAREA 1.6 — Build dev + prod y comparar con la base

**Agente:** OpenCode

**Acción:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
npx ng build --configuration development
npx ng build --configuration production | tee /tmp/build-nuevo.txt
```

**Verificación:**
```bash
grep "Initial total" /tmp/build-nuevo.txt
grep "Initial total" "D:/repos/luxuryapp-api/docs/plans/execution/baseline/build-prod.txt"
```

Los dos números deben ser **equivalentes (±5%)**.

🛑 Si difieren más del 5%, algo no se está incluyendo o se está incluyendo de más. PARA y reporta
ambos números.

**Commit:** `[1.6] verifica paridad de build con la linea base`

---

## TAREA 1.6.LIMPIEZA — Dos residuos que apuntan al repo congelado

**Agente:** OpenCode
**Origen:** observaciones de OpenCode en 1.5.C, aprobadas por el supervisor.

> ℹ️ Ambos están **solo** en `client/luxuryapp`. No se toca nada en `client/angular` (P1).

| Archivo | Qué es | Decisión |
| :--- | :--- | :--- |
| `split_endpoints.js` (raíz) | Herramienta de un solo uso ya ejecutada, con rutas absolutas a `client/angular` | **Borrar** |
| `scripts/modal-audit-report.json` | Artefacto generado stale (~340 rutas al repo viejo). Salida de `audit-modals.mjs`, regenerable | **Borrar** |

**Acción:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
rm -f split_endpoints.js scripts/modal-audit-report.json
```

**Verificación:**
```bash
ls split_endpoints.js scripts/modal-audit-report.json 2>/dev/null && echo "ERROR: siguen ahi" || echo "LIMPIO OK"
npx ng build --configuration development > /dev/null 2>&1 && echo "BUILD OK" || echo "ERROR: build roto"
```
Esperado: `LIMPIO OK` y `BUILD OK`.

**Commit:** `[1.6.LIMPIEZA] elimina residuos que apuntaban al repo congelado`

---

## TAREA 1.7 — Verificar los 18 portales en el navegador

**Agente:** OpenCode
**Riesgo:** 🔴 — **el build verde NO garantiza que funcione.**

> 🚨 **Por qué esta tarea no se puede saltar.**
> El error típico de la Fase 1 es una ruta de asset o de estilo mal actualizada. Eso **compila
> perfecto** y falla solo al abrir la página: un estilo que no carga, un ícono que no aparece,
> un `404` en la consola. El build nunca te lo va a decir.

> 📌 **REDISEÑADA 07-Ago-2026.** La versión anterior mandaba a un humano a revisar 18 portales
> a ojo. Se descubrió que el proyecto ya trae **Playwright** configurado, así que la parte
> mecánica —que es la que importa— se automatiza y se hace **exhaustiva**, no por muestreo.

### 🅰️ 1.7.A — Detección automática de 404 y errores (**la agente hace esto**)

> 🔑 **La idea clave: comparar contra el proyecto viejo.**
> Si levantas solo el proyecto nuevo, vas a ver errores de consola por el backend, sesiones
> caducadas y ruido que **siempre estuvo ahí**. Corriendo lo mismo contra `client/angular`,
> ese ruido aparece en ambos lados y se cancela. **Lo que salga solo en el nuevo es una
> regresión de la mudanza.** Eso es lo que buscamos.

**Paso 1 — crea `scripts/smoke-assets.mjs`:**

```js
// Carga la app y reporta TODO fallo de red y error de consola.
// Uso: node scripts/smoke-assets.mjs <url>
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:4200";
const problemas = [];

const browser = await chromium.launch();
const page = await browser.newPage();

page.on("response", (r) => {
  if (r.status() >= 400) problemas.push(`HTTP ${r.status()}  ${r.url()}`);
});
page.on("console", (m) => {
  if (m.type() === "error") problemas.push(`CONSOLA     ${m.text()}`);
});
page.on("pageerror", (e) => problemas.push(`EXCEPCION   ${e.message}`));

await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(4000);
await browser.close();

console.log(`\n=== ${BASE} — ${problemas.length} problema(s) ===`);
problemas.sort().forEach((p) => console.log("  " + p));
```

**Paso 2 — corre el proyecto NUEVO** (puerto 4200) y captura:
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
npx ng serve --port 4200        # en una terminal, déjalo corriendo
node scripts/smoke-assets.mjs http://localhost:4200 > /tmp/smoke-nuevo.txt 2>&1
```

**Paso 3 — corre el proyecto VIEJO** (puerto 4201) y captura:
```bash
cd "D:/repos/luxuryapp-api/client/angular"
npx ng serve --port 4201        # en otra terminal
node "D:/repos/luxuryapp-api/client/luxuryapp/scripts/smoke-assets.mjs" http://localhost:4201 > /tmp/smoke-viejo.txt 2>&1
```

> ⚠️ **P1:** solo levantas `client/angular` para servirlo. **No crees ni modifiques archivos ahí.**
> El script se ejecuta desde la ruta del proyecto nuevo, como muestra el comando.

**Paso 4 — compara** (normalizando el puerto para que no cuente como diferencia):
```bash
diff <(sed 's/localhost:4201/PORT/g' /tmp/smoke-viejo.txt | sed 's/^=== .*$//') \
     <(sed 's/localhost:4200/PORT/g' /tmp/smoke-nuevo.txt | sed 's/^=== .*$//')
```

**Verificación:** salida **vacía** = el proyecto nuevo se comporta igual que el viejo. ✅

🛑 Si aparecen líneas con `>`, son problemas **exclusivos del proyecto nuevo** → regresiones de
la mudanza. PARA y reporta la lista completa. Presta atención especial a `HTTP 404` sobre
`.css`, `.woff`, `.svg`, `.png`, `assets/` o `pdf.worker` — son la firma de una ruta olvidada en 1.5.

**Commit:** `[1.7.A] smoke test de assets: sin regresiones vs proyecto viejo`

---

### 🅱️ 1.7.B — Verificación funcional (**esto lo hace el USUARIO, no la agente**)

> 🛑 **Agente: NO ejecutes esta parte. NO la marques como hecha. NO la simules.**
> Requiere iniciar sesión con credenciales reales y criterio visual humano.
> Reporta que 1.7.A está lista y **espera al usuario**.

Con 1.7.A en verde, el riesgo mecánico ya está descartado de forma exhaustiva. Lo que queda es
criterio humano, y se reduce a un recorrido corto:

**Acción:**
```bash
cd "D:/repos/luxuryapp-api/client/luxuryapp"
npx ng serve
```

Con la **consola del navegador abierta**, recorre:

- [ ] Login
- [ ] Dashboard principal
- [ ] Al menos **una pantalla de cada uno de los 18 portales**
- [ ] Un modal (que abra y cierre)
- [ ] Una pantalla con tabla de datos
- [ ] Un visor de PDF (verifica el worker de PDF)
- [ ] Una pantalla con subida de archivo

En cada una, comprueba:

| Qué mirar | Señal de problema |
| :--- | :--- |
| Consola del navegador | Cualquier `404` o error en rojo |
| Estilos y tema | Se ve "sin CSS", descolocado o en blanco |
| Íconos | Cuadros vacíos o símbolos rotos |
| Imágenes / logos | No cargan |

**Verificación:** los 18 portales cargan **sin ningún `404` ni error rojo** en consola.

🛑 Cualquier fallo → PARA y reporta: qué portal, qué pantalla, y el error literal de consola.

> 💡 **Truco:** `client/angular` sigue intacto. Si dudas si algo está roto o siempre fue así,
> levanta el proyecto viejo en otro puerto y compara la misma pantalla lado a lado.

**Commit:** `[1.7] verificacion funcional de los 18 portales`

---

## TAREA 1.8 — Congelar `client/angular`

**Agente:** OpenCode

**Acción:** crea `D:\repos\luxuryapp-api\client\angular\_CONGELADO.md` con:

```md
# ⛔ PROYECTO CONGELADO — SOLO LECTURA

**Fecha de corte: 08-Ago-2026.** Decisión del usuario, registrada en el §11 del plan.

Este proyecto fue reemplazado por **`client/luxuryapp`**.

## No hagas cambios aquí

Todo el desarrollo del día a día ocurre en `client/luxuryapp`. Este proyecto solo se
conserva como **respaldo** para comparar comportamiento pantalla a pantalla.

Si haces un cambio aquí, se pierde: no va a llegar al proyecto vivo, y las dos copias
empiezan a separarse. Eso ya pasó antes en este repositorio con la rama
`feat/ui-catalog-showcase`, que quedó 25 commits atrás hasta volverse inservible.

## Estado al momento del corte

- Paridad de bundle con `client/luxuryapp`: **0.05%** de diferencia
- Cero 404 de assets locales (verificado comparando ambos proyectos)
- Verificación funcional del usuario: OK

Plan: `docs/plans/20260807-luxuryapp-monolito-nuevo-plan.md`
Bitácora: `docs/plans/execution/LEDGER.md`
```

> ⚠️ Este es el ÚNICO archivo que se te permite crear en `client/angular`. Nada más (P1).

**Verificación:**
```bash
ls "D:/repos/luxuryapp-api/client/angular/_CONGELADO.md" && echo "OK"
git -C "D:/repos/luxuryapp-api/client/angular" status --short
```
Esperado: `OK`, y en el status **solo** aparece `_CONGELADO.md` como archivo nuevo.

🛑 Si aparece cualquier otro archivo modificado en `client/angular`, se violó P1. PARA y reporta.

---

# 🛑 FIN DE LA FASE 1 — ALTO OBLIGATORIO

**No continúes a la Fase 2.** Detente aquí y espera revisión del supervisor.

**Antes de parar, confirma en el LEDGER:**

- [ ] `ng build` dev verde
- [ ] `ng build` prod verde y bundle equivalente a la base (±5%)
- [ ] 18/18 portales navegables sin errores de consola
- [ ] `audit-apps-boundaries.mjs` encuentra las 72 violaciones (**no** falso verde)
- [ ] `grep` de la tarea 1.5.C sale vacío
- [ ] `client/angular` intacto salvo `_CONGELADO.md`
- [ ] Un commit por tarea, ninguno pendiente

> ✅ **Recuerda: al terminar la Fase 1 todo sigue junto y acoplado. Eso es CORRECTO.**
> La Fase 1 construye la casa. Cortar las 72 amarras es la Fase 2.

---

## 📄 Fases 2 y 3 — pendientes de detallar

El runbook de la **Fase 2** se escribe **después** de que el supervisor revise la Fase 1, porque
sus tareas dependen de la clasificación A/B/C/D de las 72 amarras — y esa clasificación todavía
no existe. Escribir comandos exactos para "resolver la amarra #47" sin haberla clasificado sería
inventar.

La **Fase 3** se detalla al cerrar la Fase 2, por la misma razón: el portal piloto se elige con
los datos que deje la Fase 2.
