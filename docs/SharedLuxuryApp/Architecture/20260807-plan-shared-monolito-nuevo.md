📍 **Ruta:** 📂 `docs/plans` > 📄 `20260807-luxuryapp-monolito-nuevo-plan.md`

📅 **Última Revisión:** 07-Ago-2026
🛡️ **Estado:** Aprobado — listo para ejecutar
👤 **Responsable:** Agente (planificación) · Usuario (decisión y aprobación por fase)

---

# 🏗️ Plan: Nuevo Monolito `luxuryapp` — preparado para desacoplar

> **Borrón y cuenta nueva.** Este plan reemplaza y cierra a `PLAN-REORGANIZACION-MODULAR.md`
> (09-Jul-2026) y al plan de consolidación del 07-Ago-2026. No existe otro plan vigente del tema.

> 🤖 **Este documento es la ESTRATEGIA (el porqué). No se ejecuta desde aquí.**
> Los agentes ejecutores trabajan con:
> - [`../../../docs/SharedLuxuryApp/Conventions/20260901-especificacion-shared-relay-protocol.md`](./../../../docs/SharedLuxuryApp/Conventions/20260901-especificacion-shared-relay-protocol.md) — reglas de relevo (leer primero, obligatorio)
> - [`../../../docs/SharedLuxuryApp/DesignSystem/20260901-plan-shared-runbook-fase0-1.md`](./../../../docs/SharedLuxuryApp/DesignSystem/20260901-plan-shared-runbook-fase0-1.md) — tareas exactas
> - [`../../../docs/SharedLuxuryApp/DesignSystem/20260901-changelog-shared-design-system-execution-ledger.md`](./../../../docs/SharedLuxuryApp/DesignSystem/20260901-changelog-shared-design-system-execution-ledger.md) — estado vivo (se escribe tras cada tarea)
>
> **Modelo:** Claude supervisa y revisa al cierre de cada fase. OpenCode ejecuta primero;
> si se detiene, releva KiloCode, y así alternando.

---

## 1. Metadata

| Campo | Valor |
| :--- | :--- |
| **Tipo** | Plan de migración + consolidación |
| **Origen** | Decisión explícita del usuario (07-Ago-2026) |
| **Proyecto origen** | `client/angular` — **queda INTACTO, congelado como respaldo** |
| **Proyecto destino** | `client/luxuryapp` — nuevo, **creado por copia** |
| **Repositorio** | Uno solo, propio del proyecto nuevo |
| **Afecta `shared/`** | ✅ SÍ (Fase 2) |
| **Afecta contratos API** | ❌ No |
| **Afecta servidor/hosting** | ✅ SÍ (Fase 3 — rutas y sitios nuevos) |

---

## 2. Resumen Ejecutivo

### 2.1 Problem Statement

> Actualmente, **el equipo** sufre de **un monolito cuyos 18 portales no se pueden publicar por separado**
> cuando intenta **desplegar un portal como sitio independiente**, lo que resulta en
> **que todo tiene que salir junto o no sale**.

### 2.2 La estrategia, en una línea

```
Fase 1: MISMO código, casa nueva preparada  →  Fase 2: sellar el crecimiento
                                            →  Fase 3: extraer portal por portal, BAJO DEMANDA
```

> 📌 **ESTRATEGIA REVISADA 08-Ago-2026 por decisión del usuario.**
> La versión anterior planteaba *arreglar las 72 amarras de golpe y después extraer*. Se descartó
> a favor de un enfoque **bajo demanda**: cuando se decide qué portal extraer, **se analizan y
> resuelven solo las amarras de ese portal**.
>
> **El porqué (razonamiento del usuario):** no todas las piezas compartidas lo son de verdad;
> muchas simplemente están mal ubicadas. Arreglarlas todas por adelantado arriesga mover cosas a
> `shared/` que en realidad debían moverse a otro portal — trabajo que después habría que deshacer.
>
> ### 🧭 Principio rector
>
> > **La carpeta donde vive una pieza hoy NO es evidencia de que sea su lugar correcto.**
> > La estructura actual es el resultado de migraciones previas, no de un diseño deliberado.
> > Cada amarra se examina preguntando *"¿dónde debería estar esto?"*, no *"¿cómo comparto esto
> > desde donde está?"*.

**Fase 1 no cambia nada funcional.** Es la mudanza: mismo código, misma app, mismos 18 portales,
pero con la estructura (`projects/`) que permite agregar sitios después con un comando.

### 2.3 Decisión clave: mudanza, no compra de muebles

El proyecto nuevo se crea **copiando** `client/angular`, no escribiéndolo desde cero.

| | Costo | Riesgo |
| :--- | :--- | :--- |
| ❌ Desde cero | Retipear 106 dependencias, reconstruir `angular.json` (30+ `allowedCommonJsDependencies`, rutas sass, service worker, i18n), capacitor, ngsw, playwright, 2× vitest, storybook | **Alto** — una pieza olvidada compila pero falla en producción sin dar señal |
| ✅ Por copia | Copiar y reestructurar | **Bajo** — el mismo código con la misma config |

La casa nueva (`projects/`) es **idéntica** en ambos casos. Lo único que cambia es si se vuelven a
comprar los muebles o se mudan.

### 2.4 Advertencia explícita (asumida y entendida)

> **La estructura nueva NO desacopla nada por sí sola.** Los 72 imports cruzados viajan
> con el código a la casa nueva. Al terminar la Fase 1 todo seguirá junto — **eso es lo esperado**,
> no un fallo.

Ejemplo real, `recursos-humanos/…/staff-board.ts`:

```
staff-board.ts (Recursos Humanos) importa:
   ├── IWorkPosition          ← reclutamiento
   ├── JobDescriptionForm     ← reclutamiento
   ├── WorkPositionForm       ← reclutamiento
   ├── WorkPositionHours      ← reclutamiento
   ├── SolicitudVacanteForm   ← reclutamiento
   └── EmployeeProviderForm   ← supplier
```

Publicar `rrhh.dominio.com` hoy obligaría a arrastrar Reclutamiento y Proveedores completos dentro
de ese sitio. La Fase 2 existe para cortar esas 72 amarras.

### 2.5 KPIs

| KPI | Baseline (07-Ago-2026) | Target | Fase |
| :--- | :--- | :--- | :--- |
| Proyecto nuevo compila (dev + prod) | — | ✅ exit 0 | F1 |
| Paridad funcional con `client/angular` | — | 18/18 portales | F1 |
| Layout `projects/` listo para multi-app | ❌ `root: ""` | ✅ | F1 |
| Imports cruzados entre portales | **72** | **0** | F2 |
| Fugas PrimeNG/Ionic en código de negocio | **~9** | **0** | F2 |
| `npm run lint` | ❌ exit 1 | ✅ exit 0 | F2 |
| Portales publicables como sitio propio | **0** | **≥1** | F3 |

> ⚠️ **Corrección de medición (07-Ago-2026):** el número "146 fugas de PrimeNG" que circuló antes
> estaba inflado. De 146 archivos, **127 son `.spec.ts`** (pruebas — no se envían a producción y es
> legítimo que simulen diálogos). De los 19 restantes, **10 son herramientas internas**
> (`herramientas-dev/catalog-component-ui/`, `conventions-viewer`) cuyo propósito *es* mostrar
> componentes de PrimeNG. **Violaciones reales en código de negocio: ~9** (cobranza 6, committee 1,
> mantenimiento 1, operations 1). Los **72 imports cruzados sí son todos código real** — verificado.

---

## 3. Objetivo

Tener un proyecto `client/luxuryapp` que:

1. Funcione **exactamente igual** que `client/angular` hoy.
2. Esté estructurado para que agregar un sitio nuevo sea **un comando**, no una refactorización.
3. Quede libre de amarras entre portales, para que extraer uno sea copiar una carpeta.
4. Tenga reglas que **se refuercen solas** — que el build falle si alguien vuelve a cruzar una frontera.

---

## 4. Alcance

### 4.1 Dentro

- ✅ Crear `client/luxuryapp` por copia y reestructurar a `projects/luxury-app/`.
- ✅ Verificar paridad funcional (build dev + prod + navegación de los 18 portales).
- ✅ Repo git propio para el proyecto nuevo.
- ✅ **Sellar el crecimiento de la deuda** en modo baseline + hook/CI (Fase 2).
- ✅ **Alcance completo de `npm run lint` verde** — las 72 amarras, las ~9 fugas de PrimeNG,
      los 162 tokens y los 277 hallazgos de diseño. **Pero resueltos bajo demanda, por portal.**
- ✅ Extraer portales a sitios independientes, **uno a la vez, cuando el usuario lo decida**
      (rutas/host en servidor incluidos).

### 4.2 Fuera

- ❌ Cambios funcionales de negocio o de contratos API.
- ❌ Reescribir el Design System *de golpe*. Sus 439 hallazgos se resuelven por portal, no en barrido.
- ❌ **Barrer las 72 amarras por adelantado.** Se resuelven bajo demanda (ver §2.2 y Fase 3).
- ❌ Nx, micro-frontends o monorepo con herramientas externas — **se usa Angular CLI puro**
      (multi-app nativo). Ver §12.
- ❌ Un calendario cerrado para los 18 portales. El orden y el ritmo los marca el usuario.

---

## 5. Restricciones

| # | Restricción |
| :--- | :--- |
| R1 | **`client/angular` no se toca.** Queda congelado como respaldo funcional. |
| R2 | **Cero regresión.** Fase 1 no cambia una sola línea de comportamiento. |
| R3 | `ng build` (dev **y** prod) debe pasar al cierre de cada fase. |
| R4 | Fase 2 toca `shared/`/`core/` → los consumen los 18 portales; revisión explícita. |
| R5 | Una fase a la vez. No se abre la siguiente con la anterior a medias. |
| R6 | Ninguna URL pública cambia sin decisión explícita y redirect documentado. |

---

## 6. Fases

### 🔷 Fase 0 — Preparación (½ día)

- [ ] 0.1 Archivar la línea base de `client/angular`: salida de `ng build` dev y prod, `npm run lint`, `audit:apps`.
- [ ] 0.2 Registrar el inventario de rutas actuales (para comparar en 1.6).
- [ ] 0.3 Confirmar que `client/angular` está limpio en git (`git status` sin cambios).

**Criterio de paso:** línea base archivada y reproducible.

---

### 🔷 Fase 1 — La mudanza (el corazón de este plan)

**Objetivo:** `client/luxuryapp` funcionando **idéntico**, con estructura lista para multi-app.

#### 1.A Crear el proyecto por copia

- [ ] 1.1 Copiar `client/angular` → `client/luxuryapp`, **excluyendo** lo regenerable y la basura:
      `node_modules/`, `dist/`, `.angular/`, `.git/`, `test-results/`, `playwright-report/`, `.tmp/`,
      `reports/`, `audit-report.*`.
- [ ] 1.2 Inicializar repo git propio: `git init` + primer commit "estado inicial: copia de client/angular".
- [ ] 1.3 `npm install` y verificar `ng build` verde **antes de tocar la estructura**
      (prueba de que la copia es fiel).

> 🔑 **Punto de control:** si 1.3 no pasa, la copia está mal — se corrige aquí, no más adelante.

#### 1.B Reestructurar a layout multi-app

```
ANTES                        DESPUES
luxuryapp/                   luxuryapp/
├── src/                     ├── angular.json
├── public/                  └── projects/
├── angular.json                 └── luxury-app/
└── …                                ├── src/
                                     ├── public/
                                     └── …
```

- [ ] 1.4 Mover `src/`, `public/`, `e2e/`, `.storybook/` → `projects/luxury-app/` con `git mv`
      (una sola operación; git conserva la historia).
- [ ] 1.5 Actualizar rutas en: `angular.json` (`root`, `sourceRoot`, `browser`, `index`, `assets`,
      `styles`, `stylePreprocessorOptions.includePaths`, `fileReplacements`, `serviceWorker`),
      `tsconfig.json` (`paths`: `src/*`, `@ui/*`), `tsconfig.app.json`, `tsconfig.spec.json`,
      `vitest.config.ts`, `vitest.cobranza-nativa.config.ts`, `playwright.config.ts`,
      `capacitor.config.ts`, `ngsw-config.json`, `postcss.config.js`, y los scripts de `scripts/`.

> ⚠️ Esta es la tarea más delicada de la fase. Cada archivo de config lleva rutas relativas.
> El síntoma de una ruta olvidada suele ser **build verde pero algo roto en runtime** (un estilo
> que no carga, un asset 404). Por eso 1.6 valida en el navegador, no solo en el build.

#### 1.C Verificar paridad

- [ ] 1.6 `ng build` dev **y** prod verdes. Comparar bundle inicial de producción contra la línea
      base de 0.1 — debe ser **equivalente** (±5%).
- [ ] 1.7 `ng serve` y recorrer los **18 portales**: login, dashboard, y al menos una pantalla por portal.
- [ ] 1.8 Verificar lo que el build no detecta: estilos/tema, iconos, assets de `public/`,
      service worker, PDF worker, subida de archivos, modales.
- [ ] 1.9 Congelar `client/angular`: `README` que apunte a este plan y a `client/luxuryapp`.

**Criterio de paso:** build dev+prod verde · 18/18 portales navegables · bundle equivalente ·
`client/angular` intacto y marcado como respaldo.

> ✅ **Al cerrar Fase 1 todo sigue junto. Es lo correcto.** La casa está lista; falta soltar amarras.

---

### 🔷 Fase 2 — Sellar el crecimiento (antes de tocar nada)

**Objetivo:** que la deuda **deje de crecer** desde el día 1, aunque tarde meses en resolverse.

> 🔑 **Por qué esta fase va primero.** Con extracción bajo demanda, la limpieza total tarda tanto
> como tarden todos los portales. Si mientras tanto alguien agrega una amarra nueva o un color
> hardcodeado, corremos hacia atrás. El modo *baseline* congela la deuda actual y hace fallar el
> build **solo ante violaciones nuevas**. Es lo que vuelve segura la estrategia bajo demanda.

**Deuda medida el 08-Ago-2026** (toda **preexistente**, heredada del proyecto viejo):

| Auditor | Estado | Magnitud |
| :--- | :--- | ---: |
| `audit:encoding` · `audit:emoji` · `audit:ui` | ✅ verde | — |
| `audit:apps` | ❌ | **72** amarras |
| `audit:design` | ❌ | **277** hallazgos |
| `audit:tokens` | ❌ | **162** colores hardcodeados |
| `audit:css` | ❌ | issues críticos |

- [ ] 2.1 Agregar **modo baseline** a los 4 auditores en rojo: cargan un archivo con las
      violaciones conocidas y **solo fallan ante las nuevas**.
- [ ] 2.2 Generar el baseline inicial y commitearlo (`docs/audit/baseline-*.json`).
- [ ] 2.3 Crear `scripts/audit-apps-ui-boundaries.mjs` (fugas de PrimeNG/Ionic en `apps/`),
      **excluyendo `.spec.ts`** y con lista blanca para `herramientas-dev/`. También en baseline.
- [ ] 2.4 `npm run lint` → **exit 0** con el baseline aplicado.
- [ ] 2.5 Enchufar `npm run lint` a hook pre-push y/o CI que **falle** el pipeline.
- [ ] 2.6 Prueba explícita: introducir una violación nueva a propósito y confirmar que **falla**;
      confirmar que una violación **preexistente** no lo hace.
- [ ] 2.7 Agregar a `.gitignore`: `audit-report.json`, `audit-report.csv`, `reports/`
      (se generan con cada `npm run lint` y ensucian el árbol).
- [ ] 2.8 Documentar las reglas y el modo baseline en `CONVENTIONS.md`.

**Criterio de paso:** `npm run lint` exit 0 · el pipeline falla ante una violación **nueva** y
tolera las preexistentes · árbol limpio tras correr el lint.

> ✅ **A partir de aquí la deuda solo puede bajar.** Cada portal que se extraiga en la Fase 3
> reduce el baseline. El objetivo final —baseline en cero— se alcanza cuando termine el último portal.

---

### 🔷 Fase 3 — Extracción por portal, bajo demanda (iterativa)

**Objetivo:** sacar portales a sitios independientes, uno a la vez, resolviendo **solo** las
amarras de ese portal.

#### 3.A Coste de extracción por portal (medido 08-Ago-2026)

*Sale* = imports que el portal hace hacia otros · *Entra* = imports que otros le hacen.
**Para extraer un portal hay que resolver ambos**: no puede llevarse lo ajeno, ni dejar colgados
a quienes dependen de él.

| Portal | Sale | Entra | **Coste** | Archivos |
| :--- | ---: | ---: | ---: | ---: |
| `web` | 0 | 0 | **0** ✅ | 26 |
| `auth` | 0 | 0 | **0** ✅ | 27 |
| `system` | 0 | 0 | **0** ✅ | 24 |
| `public` | 0 | 0 | **0** ✅ | 4 |
| `security` | 0 | 0 | **0** ✅ | 4 |
| `compras` | 0 | 0 | **0** ✅ | 3 |
| `admin` | 1 | 0 | 1 | 245 |
| `resident` | 1 | 0 | 1 | 13 |
| `committee` | 2 | 0 | 2 | 19 |
| `cobranza` | 0 | 4 | 4 | 116 |
| `direccion` | 1 | 8 | 9 | 27 |
| `mantenimiento` | 7 | 6 | 13 | 141 |
| `reclutamiento` | 2 | 11 | 13 | 68 |
| `supplier` | 1 | 13 | 14 | 92 |
| `legal` | 5 | 11 | 16 | 39 |
| `recursos-humanos` | 10 | 9 | 19 | 211 |
| `contabilidad` | 15 | 4 | 19 | 168 |
| `operations` | 27 | 6 | **33** 🔴 | 278 |

> 🎯 **Seis portales tienen coste CERO — son extraíbles hoy, sin tocar una línea de código.**
> Y `admin`, con 245 archivos, tiene **una sola** amarra: el tamaño no predice el coste.

#### 3.B Portal piloto recomendado: `web.luxuryapp`

| Criterio | Por qué |
| :--- | :--- |
| Coste 0 | Cero amarras entrantes y salientes |
| Propósito | Es literalmente el **sitio web publicitario/marketing externo** — nació para vivir aparte |
| Tamaño | 26 archivos: suficiente para ser real, pequeño para iterar |
| Riesgo de negocio | Bajo: si falla, no bloquea operación interna |

Extraerlo valida el **mecanismo completo** —build propio, host, rutas en servidor— con riesgo de
acoplamiento nulo. Lo que se aprenda ahí es la receta para los demás.

#### 3.C Ciclo repetible por portal

Se repite tal cual para cada portal. Las tareas 3.3–3.5 **se saltan** si el coste es 0.

- [ ] 3.1 **El usuario decide** qué portal se extrae.
- [ ] 3.2 Listar sus amarras (`sale` y `entra`) y sus fugas de PrimeNG.
- [ ] 3.3 **Clasificar cada amarra preguntando dónde DEBERÍA estar la pieza**, no cómo compartirla
      desde donde está:

      | Caso | Qué es | A dónde va |
      | :--- | :--- | :--- |
      | 🗑️ | Código muerto | Se borra |
      | **A** | Tipo, interfaz, enum, DTO | `core/interfaces/` — son contratos |
      | **A-serv** | Servicio de infraestructura (Excel, PDF…) | `core/services/` |
      | **B** | Componente visual genérico | `shared/ui/` |
      | **D** | **Está en el portal equivocado** | Moverla a su portal e invertir la dependencia |
      | **C** | Negocio realmente compartido | Ubicación compartida — **último recurso** |

- [ ] 3.4 Resolver en ese orden: 🗑️ → A → A-serv → B → **D** → C.
- [ ] 3.5 Verificar: `ng build` verde · el baseline de `audit:apps` **bajó** · navegación sin regresión.
- [ ] 3.6 `ng generate application <portal>` → nace en `projects/<portal>/`.
- [ ] 3.7 Mover el portal a la app nueva; compartir `core/` y `shared/` vía alias de `tsconfig`.
- [ ] 3.8 `ng build <portal>` → produce su propio `dist/` independiente.
- [ ] 3.9 **Servidor:** host/ruta del sitio nuevo, CORS del API, redirects desde la ruta antigua,
      y registro de rutas en BD si aplica.
- [ ] 3.10 Publicar, validar en producción y **actualizar la receta** con lo aprendido.

**Criterio de paso por portal:** se construye y publica solo · el monolito sigue funcionando sin él ·
el baseline bajó · receta actualizada.

> ⚠️ **La trampa del caso C (riesgo R-03).** Mover negocio a `core/` para que el lint pase no
> desacopla nada: infla `core/` y crea **un monolito oculto dentro del monolito**.
> **Agotar siempre el caso D antes que el C.** Si dos portales se pelean por una pieza, casi
> siempre la frontera está mal trazada, no la pieza mal ubicada.


---

## 7. Riesgos y Mitigaciones

### 7.1 Pre-Mortem

> *"Salió a producción y fue un desastre. ¿Qué lo causó?"*

| ID | Riesgo | Prob. | Impacto | Mitigación |
| :--- | :--- | :--- | :--- | :--- |
| **R-01** | Fase 1.5: una ruta de config olvidada → **build verde pero algo roto en runtime** (estilo, asset, worker) | **Alta** | **Alto** | 1.7 y 1.8 validan en navegador, no solo en build; `client/angular` intacto permite comparar lado a lado |
| **R-02** | La copia arrastra basura o queda incompleta y se descubre tarde | Media | Alto | 1.3 exige build verde **antes** de reestructurar — punto de control temprano |
| **R-03** | Fase 2 caso C: se "resuelve" moviendo negocio a `core/`, inflando `core/` y creando un monolito oculto adentro | **Media** | **Alto** | Preferir D sobre C; documentar cada C; vigilar el tamaño de `core/` |
| **R-04** | Fase 2 rompe funcionalidad al mover componentes entre portales | Media | Alto | Un portal a la vez (2.5); build + navegación tras cada uno; commits pequeños y reversibles |
| **R-05** | Fase 3: el portal piloto se extrae pero el servidor no queda bien (rutas, CORS, sesión compartida) | Media | Medio | Elegir piloto de bajo riesgo (3.1); redirects documentados (R6) |
| **R-06** | El plan se queda a medias como los dos anteriores | **Media** | **Alto** | Modo baseline en 2.8 impide crecimiento desde el día 1; R5 una fase a la vez; cada fase entrega valor por sí sola |
| **R-07** | Se trabaja en `client/luxuryapp` mientras `client/angular` sigue recibiendo commits → las dos copias divergen | **Alta** | **Alto** | **Decidir en Fase 1.9 la fecha de corte** tras la cual `client/angular` es solo lectura. Ver §11 |

### 7.2 Flujos de validación

| Flujo | Validación |
| :--- | :--- |
| **Happy** | Cada fase cierra con build dev+prod verde + su criterio de paso cumplido |
| **Sad** | Una fase rompe algo → se revierte la fase, no se parchea encima (R3) |
| **Edge** | Un caso C sin solución limpia → se documenta como **deuda de frontera** y se decide en Fase 3 |

---

## 8. Dependencias e Impactos

| Elemento | Impacto |
| :--- | :--- |
| `client/angular` | 🟢 Ninguno — intacto y congelado (R1) |
| `shared/ui/` (1,170 archivos) | 🔴 **Alto** en Fase 2 — lo consumen los 18 portales |
| `core/` (437 archivos) | 🟡 Medio — Fase 2 mueve tipos y componentes hacia aquí |
| Servidor / hosting / DNS | 🔴 **Alto** en Fase 3 — sitios y rutas nuevas |
| Backend / contratos API | 🟢 Ninguno (salvo CORS del sitio nuevo en 3.6) |
| App móvil (capacitor) | 🟡 Medio — `capacitor.config.ts` cambia de ruta en 1.5 |

---

## 9. Checklist de Cierre Global

- [ ] `client/luxuryapp` compila dev y prod
- [ ] 18/18 portales funcionan igual que en `client/angular`
- [ ] Layout `projects/` operativo — agregar un sitio es un comando
- [ ] `client/angular` intacto y marcado como respaldo
- [ ] **0** imports cruzados entre portales
- [ ] **0** fugas PrimeNG/Ionic en código de negocio
- [ ] `npm run lint` exit 0 y el pipeline falla ante una violación deliberada
- [ ] **1** portal publicado como sitio independiente, con su procedimiento documentado

---

## 10. Cierre Esperado

Un proyecto `luxuryapp` que hace hoy exactamente lo que hace el actual, pero donde publicar
`rrhh.dominio.com` deja de ser una refactorización y pasa a ser un trámite. Y unas reglas que
avisan solas cuando alguien vuelve a atar dos portales.

---

## 11. ⚠️ Decisión pendiente: la fecha de corte

**El mayor riesgo del plan no es técnico (R-07).** Mientras exista la copia vieja recibiendo commits,
las dos divergen — es exactamente lo que mató a la rama `feat/ui-catalog-showcase`, que quedó 25
commits atrás hasta volverse inservible.

Hay que decidir, al cerrar la Fase 1:

> **¿A partir de qué momento el desarrollo del día a día se hace en `client/luxuryapp` y
> `client/angular` pasa a solo lectura?**

Recomendación: **inmediatamente al cerrar Fase 1**, una vez verificada la paridad. Cuanto más corta
sea la convivencia, menos divergencia hay que reconciliar. `client/angular` sigue existiendo como
respaldo — pero deja de recibir cambios.

> ✅ **DECIDIDO 08-Ago-2026 por el usuario: el corte es INMEDIATO al cerrar la tarea 1.8.**
>
> Desde ese momento, **todo** el desarrollo ocurre en `client/luxuryapp`. `client/angular` queda
> en **solo lectura**, únicamente como respaldo para comparar comportamiento.
>
> **Base de la decisión:** el proyecto nuevo compila en dev y prod, tiene paridad de bundle al
> **0.05%** (645.06 kB vs 644.75 kB), **cero 404 de assets locales** verificado de forma exhaustiva
> contra el proyecto viejo, y verificación funcional del usuario. No hay motivo para sostener dos
> copias vivas, y cada día de convivencia es trabajo de reconciliación que alguien pagará después.

---

## 12. 📌 Por qué Angular CLI y no Nx

Ya se intentó con Nx (`client/luxuryapp-nx`, eliminado el 07-Ago-2026): workspace impecable,
9 apps creadas, libs configuradas, alias listos — y **no se pudo llenar ni una sola app**.
Los 1,503 archivos de negocio se quedaron en el monolito.

No falló por herramientas. Falló porque **el código estaba atado** y ninguna herramienta corta esas
ataduras por ti. De ahí el orden de este plan: primero la casa (F1), luego cortar amarras (F2),
y solo entonces mudar el primer inquilino (F3).

Angular CLI soporta multi-app de forma nativa — `projects/` + `ng generate application` — sin añadir
una herramienta más que aprender y mantener. Si algún día el tamaño lo justifica, migrar a Nx desde
un proyecto ya desacoplado es trivial. Al revés no.
