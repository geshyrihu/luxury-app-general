📍 **Ruta:** 📂 `docs/plans/execution` > 📄 `RELAY-PROTOCOL.md`

📅 **Vigencia:** 07-Ago-2026 en adelante
🛡️ **Severidad:** 🔴 OBLIGATORIO — SIN EXCEPCIONES
👥 **Aplicable a:** OpenCode, KiloCode y cualquier agente ejecutor

---

# 🤝 Protocolo de Relevo — Migración `luxuryapp`

## ⚠️ LEE ESTO COMPLETO ANTES DE TOCAR UN SOLO ARCHIVO

```
┌────────────────────────────────────────────────────────────┐
│  TU ROL:     EJECUTOR                                      │
│  NO ERES:    el que decide, el que diseña, el que mejora   │
│                                                            │
│  Haces EXACTAMENTE lo que dice el RUNBOOK.                 │
│  Ni más, ni menos, ni "de paso".                           │
└────────────────────────────────────────────────────────────┘
```

---

## 1. Los tres documentos

| Documento | Qué es | Qué haces con él |
| :--- | :--- | :--- |
| `20260807-luxuryapp-monolito-nuevo-plan.md` | El **porqué** (estrategia) | Lo lees UNA vez, para contexto. No ejecutas desde ahí. |
| `RUNBOOK-fase-0-1.md` | El **qué y cómo** (tareas) | **Ejecutas desde aquí.** Tarea por tarea, en orden. |
| `LEDGER.md` | El **estado vivo** | **Escribes aquí** después de CADA tarea. Es obligatorio. |

---

## 2. El relevo: por qué el LEDGER es lo más importante

Los agentes se turnan: **OpenCode entra primero.** Si se detiene por cualquier motivo, entra
**KiloCode**, luego OpenCode otra vez, y así.

> 🧠 **El que entra NO recuerda nada de lo que hizo el anterior.** Llega en frío.
> El `LEDGER.md` es lo ÚNICO que sobrevive al relevo. Si no lo escribes, el siguiente agente
> no sabe dónde quedó el trabajo y **puede rehacer o romper lo ya hecho.**

**Por eso:** no marcar el LEDGER es una falta tan grave como ejecutar mal una tarea.

---

## 3. Ciclo obligatorio por tarea

```
1. LEER la tarea completa en el RUNBOOK
2. VERIFICAR la precondición  ──► ¿no coincide? ──► 🛑 PARAR
3. EJECUTAR los comandos EXACTOS (copiar/pegar, no reescribir)
4. VERIFICAR el resultado     ──► ¿no coincide? ──► 🛑 PARAR
5. ESCRIBIR en LEDGER.md
6. Siguiente tarea
```

**Nunca saltes el paso 2 ni el 4.** La precondición existe porque quizá otro agente ya hizo
esa tarea. Verificar es lo que hace el relevo seguro.

---

## 4. 🛑 Cuándo PARAR (obligatorio)

Detente y escribe en el LEDGER — **no improvises** — si:

| # | Situación |
| :--- | :--- |
| 1 | La **precondición** no coincide con lo esperado |
| 2 | La **verificación** no coincide con lo esperado |
| 3 | Un comando devuelve un error que el RUNBOOK **no anticipa** |
| 4 | El RUNBOOK es **ambiguo** o no cubre lo que estás viendo |
| 5 | Necesitas **tomar una decisión** que el RUNBOOK no toma por ti |
| 6 | Crees que hay una **manera mejor** de hacerlo |

> El caso **6** es el más importante. Si ves una mejora, **PARA y repórtala.** No la apliques.
> Puede que tengas razón — pero la decisión no es tuya, y una "mejora" no prevista rompe el
> relevo para el siguiente agente.

**Al parar, escribe en el LEDGER:** tarea, qué esperabas, qué obtuviste, salida literal del comando.

---

## 4.bis 🔴 Si te detienes A MEDIA TAREA (añadido 08-Ago-2026)

> **Esto pasó de verdad:** un agente se detuvo a media tarea 2.13. El tablero decía "Pendiente",
> pero había 8 archivos modificados sin commitear **y el build roto**. El siguiente agente habría
> empezado de cero sobre un proyecto que no compilaba, sin saberlo.

Si te detienes con trabajo hecho pero **sin terminar**, marca la tarea como **🔄 A MEDIAS**
— nunca la dejes en ⬜ Pendiente — y escribe **obligatoriamente**:

- [ ] La lista de **archivos modificados sin commitear** (`git status --short`)
- [ ] Si el proyecto **compila o no** (`ng build`) — y si no, el **error literal**
- [ ] Qué sub-pasos de la tarea **ya hiciste** y cuáles **faltan**
- [ ] Si `npm run lint` sigue verde

> 🔑 **"Pendiente" y "a medias" son estados muy distintos.**
> Pendiente = puedes empezar de cero sin riesgo.
> A medias = si empiezas de cero, **destruyes trabajo** y probablemente repites el mismo error.

**Y si eres el agente que ENTRA:** antes de tomar cualquier tarea, ejecuta siempre:
```bash
git status --short        # ¿hay trabajo sin commitear?
npx ng build --configuration development   # ¿compila?
```
No confíes solo en el tablero. **Verifica el terreno.**

---

## 5. ❌ Prohibiciones absolutas

| # | Prohibido |
| :--- | :--- |
| P1 | **Tocar `client/angular`.** Es el respaldo. Solo lectura. Ni un archivo. |
| P2 | Ejecutar tareas **fuera de orden** o saltarse una |
| P3 | "Aprovechar el viaje" para arreglar, formatear, renombrar o limpiar algo no pedido |
| P4 | Cambiar código de negocio en la Fase 1 — **es una mudanza, no una refactorización** |
| P5 | Cambiar versiones de dependencias, correr `npm update` o `ng update` |
| P6 | Borrar archivos que el RUNBOOK no mande borrar |
| P7 | Hacer `git push` a ningún remoto |
| P8 | Continuar tras un 🛑 sin autorización del supervisor |
| P9 | Marcar una tarea como hecha sin haber pasado su verificación |

---

## 6. Reglas de commit

- Un commit **por tarea completada**, no uno gigante al final.
- Mensaje: `[TAREA-ID] descripción corta` — ej. `[1.4] mueve src/ y public/ a projects/luxury-app/`
- Commit **solo** si la verificación pasó.
- Nunca `--force`, nunca `--no-verify`, nunca reescribir historia.

---

## 7. Supervisión

Al cerrar **cada fase**, el ejecutor PARA y espera revisión del supervisor (Claude).
**No se abre la fase siguiente sin visto bueno.**

El supervisor revisa: el diff completo, el LEDGER, y que los criterios de paso de la fase se
cumplan de verdad — no que estén marcados.

---

## 8. Plantilla de entrada al LEDGER

Copia este bloque y complétalo después de cada tarea:

```md
### [ID] — <título de la tarea>
- **Agente:** OpenCode | KiloCode
- **Fecha:** YYYY-MM-DD HH:MM
- **Estado:** ✅ COMPLETADA | 🛑 DETENIDA | ⏭️ YA ESTABA HECHA
- **Verificación:** <salida literal del comando de verificación>
- **Commit:** <hash>
- **Notas / bloqueo:** <vacío si todo bien; si es 🛑, qué esperabas vs qué obtuviste>
```
