# Plan de Remediación: `shared/ui` y `styles` (hallazgos de auditoría 2026-09-02)

**Audiencia:** Agente ejecutor externo (OpenCode) — sin contexto previo de esta conversación.
**Origen:** Auditoría manual de `appsweb/angular/src/styles` y `appsweb/angular/src/app/shared/ui` contra `CONVENTIONS.md`.
**Repo activo:** `D:\repos\luxuryapp-api\appsweb\angular` (única copia viva del frontend Angular — la carpeta `client/` fue eliminada el 2026-09-02 por ser un duplicado exacto en el mismo commit de git).
**Regla madre:** Antes de tocar cualquier archivo, lee `D:\repos\luxuryapp-api\CONVENTIONS.md` completo. Si algo en este plan contradice `CONVENTIONS.md`, gana `CONVENTIONS.md` y debes detenerte y reportar la contradicción en vez de improvisar.

---

## 0. Alcance

**Dentro de alcance (4 tareas, independientes entre sí, ejecutar en cualquier orden):**

1. Migrar colores hardcodeados en `shared/ui/web/module-guide/module-guide.css` a tokens del Design System.
2. Reubicar `shared/ui/web/module-guide/module-guide.md` a la carpeta de documentación del módulo que realmente describe (Contabilidad → Espejo Aspel Full).
4. Limpiar bloques de código comentado con hex sueltos en `styles/custom/_custom-table.scss`.

**Fuera de alcance — NO HACER:**
- No tocar `styles/custom/_financial-tables.scss` ni `styles/custom/_print.scss`: ya cumplen la regla de capas de tokens con alcance (RN-DS-041), documentan su propio `ΔE` y están aprobados tal cual.
- No renombrar, mover ni modificar ningún otro componente de `shared/ui` fuera de los 4 archivos listados.
- No actualizar referencias de rutas `client/angular/...` dentro de `CONVENTIONS.md` ni de `docs-conventions/` — es un cambio de gobernanza documental que requiere aprobación del Tech Lead, no forma parte de esta tarea.
- No instalar dependencias nuevas ni tocar `package.json`/`package-lock.json`.
- No hacer commit ni push. Deja los cambios en el working tree para revisión humana.

---

## Tarea 1 — Tokens CSS en `module-guide.css`

**Archivo:** `appsweb/angular/src/app/shared/ui/web/module-guide/module-guide.css`

**Problema (verificado):** 33 coincidencias de color hexadecimal literal, 0 usos de `var(--ds-*)` o cualquier otro token. Viola la Regla Crítica "Tokens CSS Obligatorios" de `CONVENTIONS.md` (sección "Reglas Especiales ya Acordadas" → Tokens CSS). `ModuleGuide` es un componente standalone real dentro de `shared/ui` (no un mock ni un archivo de pruebas), así que está sujeto a la regla igual que cualquier otro componente compartido.

**Acción:**

1. Abre `appsweb/angular/src/styles/core/_colors.scss` y `appsweb/angular/src/styles/theme/_variables.scss` para conocer las escalas disponibles (`--primary-50..950`, `--secondary-50..950`, `--success-*`, `--warning-*`, `--danger-*`, `--info-*`, `--surface-*`, etc.). La convención expone cada `$color-NNN` de `_colors.scss` como `var(--color-NNN)` en `_variables.scss`.
2. Para cada valor hex en `module-guide.css`, busca el token existente **visualmente más cercano** dentro de esas escalas y reemplázalo por `var(--token-correspondiente)`. Ejemplos concretos ya identificados:
   - `#dc2626`, `#b91c1c` (rojos de error/hover) → familia `var(--danger-*)`.
   - `#6b7280`, `#666`, `#e0e0e0`, `#e5e7eb`, `#f3f3f3`, `#f8fafc` (grises de texto secundario, bordes, fondos) → familia `var(--secondary-*)` o `var(--surface-*)` según el uso (fondo vs. texto vs. borde).
3. Los dos colores del gradiente de marca (`#667eea`, `#764ba2`, usados en `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`) **no tienen equivalente** en las escalas actuales (no son parte de la paleta `$primary`/`$secondary` documentada). No inventes un color nuevo por tu cuenta:
   - Si visualmente puedes sustituirlos por `var(--primary-500)` / `var(--primary-700)` sin que el cambio sea perceptible, hazlo y dilo explícitamente en tu reporte de cambios.
   - Si el cambio es perceptible (gradiente decorativo distinto al azul institucional), sigue el patrón validado en `styles/custom/_print.scss` (RN-DS-041): declara un bloque de **tokens con alcance de módulo** al inicio del archivo, prefijo `--mg-` (module-guide), ej. `--mg-gradient-start: #667eea; --mg-gradient-end: #764ba2;`, con un comentario que documente que es un color decorativo propio de este componente y no del Design System global. Usa esos tokens `var(--mg-*)` en el resto del archivo. No los declares dos veces.
4. No dejes ningún `#` hexadecimal fuera del bloque de tokens con alcance (si lo creaste en el paso 3).

**Verificación (debe devolver 0, salvo el bloque de tokens propio si se creó):**
```bash
grep -n "#[0-9a-fA-F]\{3,8\}" appsweb/angular/src/app/shared/ui/web/module-guide/module-guide.css
```
Si el comando anterior devuelve líneas, TODAS deben estar dentro del bloque de declaración `--mg-*` del paso 3 (nunca sueltas en reglas de estilo).

---

## Tarea 2 — Reubicar `module-guide.md`

**Archivo origen:** `appsweb/angular/src/app/shared/ui/web/module-guide/module-guide.md`

**Problema (verificado):** El componente `ModuleGuide` (`module-guide.ts`) es genérico y reutilizable — renderiza cualquier análisis de flujo (`ModuleFlowAnalysis`) que reciba. El archivo `module-guide.md` que vive junto a él, sin embargo, **no documenta el componente**: documenta un módulo de negocio concreto, "Espejo Aspel Full" (Contabilidad), con rutas de backend/frontend de ese módulo. Es contenido mal ubicado según la jerarquía documental de `CONVENTIONS.md` (sección 2, Precedencia Documental, y sección 4.7, Documentación de Módulo Existente).

**Acción:**

1. Verifica primero si existe la carpeta del módulo real: `appsweb/angular/src/app/apps/contabilidad.luxuryapp/` (ajusta el nombre exacto si difiere — búscalo con `find appsweb/angular/src/app/apps -maxdepth 1 -iname "*contabilidad*"`). Si no la encuentras, busca por el texto `espejo-aspel-full` o `EspejoAspelFull` dentro de `appsweb/angular/src/app/apps/**` para localizar la carpeta correcta del feature.
2. Si existe una carpeta `docs/` dentro de ese módulo, mueve el archivo ahí conservando el nombre `documentacion-espejo-aspel-full.md` o similar, siguiendo el patrón de nombre `documentacion-[modulo].md` de `CONVENTIONS.md` §4.7. Si no existe la carpeta `docs/`, créala en `.../espejo-aspel-full/docs/` (o el nivel de carpeta que corresponda al feature) y mueve el archivo ahí.
3. Usa `git mv` para conservar el historial:
   ```bash
   git mv appsweb/angular/src/app/shared/ui/web/module-guide/module-guide.md <ruta-destino>/documentacion-espejo-aspel-full.md
   ```
4. No edites el contenido del documento salvo para corregir referencias de ruta rotas que dependan de su ubicación anterior (revísalo: contiene rutas relativas o absolutas que puedan asumir que el archivo vive en `shared/ui`).
5. Si genuinamente no puedes determinar la carpeta del módulo (no la encuentras por ningún nombre razonable), **no la inventes**: deja el archivo donde está y repórtalo como bloqueado, siguiendo la Regla Universal #8 de `CONVENTIONS.md` ("No reubicar por iniciativa propia" cuando la ubicación correcta no está clara).

**Verificación:**
```bash
test -f appsweb/angular/src/app/shared/ui/web/module-guide/module-guide.md && echo "FALTA MOVER" || echo "OK: ya no está en shared/ui"
```

---




**Acción:**
```bash
```

**Verificación:**
```bash
```

---

## Tarea 4 — Limpiar código muerto en `_custom-table.scss`

**Archivo:** `appsweb/angular/src/styles/custom/_custom-table.scss`

**Problema (verificado):** Líneas 152, 154, 171 y 175 son reglas CSS comentadas (`// border: ...`, `// background: ...`, `// color: ...`) que contienen valores hex sueltos (`#d7dfeb`, `#ffffff`, `#092953`). No se compilan (están comentadas), así que no son una violación activa de la regla de tokens, pero son basura de iteraciones pasadas que ensucia el archivo.

**Acción:**
1. Abre el archivo y localiza esos bloques comentados.
2. Si el bloque comentado es claramente código muerto (una alternativa descartada, sin nota que explique por qué se conserva), bórralo.
3. Si el comentario inmediatamente anterior explica por qué se dejó ahí (por ejemplo, documentando una alternativa evaluada y descartada — como sí ocurre en otros archivos de `custom/` con la nota de `ΔE`), consérvalo y no lo toques: en ese caso, repórtalo como "sin acción, tiene justificación documentada" en vez de borrarlo a ciegas.
4. No toques la línea 104 (es un comentario explicativo activo sobre la relación de color `$primary-100`, no código muerto).

**Verificación:** revisión manual del diff — no hay un grep automatizable aquí porque el criterio depende de si el comentario tiene o no justificación.

---

## Orden de ejecución recomendado

Las 4 tareas son independientes; puedes hacerlas en cualquier orden o en paralelo. Sugerido por simplicidad: 3 → 4 → 1 → 2 (de menor a mayor ambigüedad).

## Qué reportar al terminar

Para cada tarea: qué hiciste, comandos ejecutados, y el resultado de su verificación. Para la Tarea 1, indica explícitamente si sustituiste el gradiente por `--primary-*` existente o si creaste tokens `--mg-*` nuevos (y por qué). Para la Tarea 2, indica la ruta destino exacta usada o, si quedó bloqueada, por qué no encontraste la carpeta del módulo.

No hagas commit. Deja todo en el working tree de `appsweb/angular` para que se audite el diff antes de confirmar.
