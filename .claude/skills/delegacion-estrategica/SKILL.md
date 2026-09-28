---
name: delegacion-estrategica
description: >-
  Define cuándo y cómo Claude Code, actuando como orquestador, delega tareas a su
  propia herramienta nativa de subagentes (Agent/Explore/Plan) frente a cuándo delega
  a CLIs externos (Aider, KiloCode, Codex, Cline, un segundo `claude -p`) enrutados por
  OmniRoute (localhost:20128), maximizando calidad y minimizando consumo de tokens.
  Usar cuando el usuario pida "delega esto", "divide la tarea entre agentes", o quiera
  ejecutar trabajo pesado en paralelo fuera de esta sesión.
---

# Estrategia de Delegación Externa (orquestador: Claude Code)

Este documento es la variante para cuando **yo (Claude Code) soy el orquestador**, no
Antigravity. Existe una versión hermana para Antigravity en
`.agents/skills/delegacion-estrategica/SKILL.md` — no la edites desde aquí, son
audiencias distintas.

## 0. Primera decisión: ¿delegar a mi propia herramienta Agent, o a un CLI externo?

Antes de tocar la terminal, evalúa esto — es la diferencia real frente a la skill de
Antigravity, que no tiene un "Agent tool" nativo al que recurrir:

| Necesitas | Usa |
|---|---|
| Explorar código, aislar contexto, segunda opinión **dentro de este mismo repo/sesión**, con seguimiento de tareas y notificación al terminar | **Agent tool nativo** (`subagent_type: Explore/general-purpose/Plan/claude-code-guide`) |
| Resiliencia real ante cuota agotada (fallback automático Claude→GPT-4o→Gemini) | `claude -p` externo vía OmniRoute (sección 1.3) |
| Boilerplate masivo a costo cero | KiloCode |
| Refactor quirúrgico multi-archivo con commits automáticos de Git | Aider |
| Snippet algorítmico o regex puntual | Codex |
| Paso a paso aprobado por el usuario en su propia terminal | Cline (copiar/pegar, nunca ejecutar yo) |
| Verificar que el frontend sigue funcionando tras una delegación | Skill `playwright-cli` (ya disponible, no la dupliques aquí) |

Regla práctica: si la tarea vive y muere dentro de esta sesión, usa el Agent tool
nativo — es más barato en fricción (sin proxy, sin parseo de stdout, con
tracking/background integrados). Solo baja a un CLI externo cuando necesitas algo que
el Agent tool no da: un modelo/proveedor distinto, ejecución 100% en paralelo fuera del
harness, o que el propio CLI haga commits de Git.

---

## 1. El Equipo Externo (vía terminal)

Todos los comandos de esta sección usan sintaxis PowerShell (`$env:VAR="..."`), que es
mi shell primario. Si el comando corre por la herramienta Bash (Git Bash/POSIX) en vez
de PowerShell, la sintaxis equivalente es `export VAR="..."` antes del comando, o
inline: `VAR="..." comando`. No mezcles ambas en la misma invocación.

### 1.1 KiloCode (`kilo run --yes "..."`)
* **Rol:** Obrero de alta velocidad, costo cero.
* **Enrutamiento:** `$env:OPENAI_API_BASE="http://localhost:20128/v1"` y
  `$env:OPENAI_API_KEY="sk-omniroute"`.
* **Modelos:** `deepseek-coder`, `gpt-4o-mini`, `gemini-1.5-flash` (según disponibilidad
  en OmniRoute).
* **Cuándo:** boilerplate (controladores/componentes vacíos), pruebas unitarias o
  documentación JSDoc/XML masiva, tareas repetitivas de un solo archivo.
* **Regla de ejecución:** siempre `--yes`/`-y` para evitar bloqueo interactivo.

### 1.2 Aider (`aider --yes --message "..."`)
* **Rol:** Maestro de Git / refactorización transversal.
* **Enrutamiento:** mismas variables `OPENAI_API_BASE`/`OPENAI_API_KEY` que KiloCode.
* **Modelos:** `claude-3-5-sonnet-20241022` (vía `--model openai/claude-3-5-sonnet-20241022`)
  o `gpt-4o`.
* **Cuándo:** cambios que tocan múltiples archivos a la vez, renombramientos masivos,
  cuando quieres que el propio agente haga el commit tras el cambio.
* **Regla de ejecución:** `--yes` obligatorio.

### 1.3 Segundo `claude -p` (subproceso, vía OmniRoute)
* **Rol:** Second opinion con proveedor/modelo distinto al de esta sesión, o resiliencia
  de cuota. **No lo uses para tareas normales de exploración o edición dentro de este
  repo** — para eso está el Agent tool nativo (sección 0); usar un subproceso aquí sin
  motivo es puro overhead de proxy y parseo.
* **Enrutamiento:** `$env:ANTHROPIC_BASE_URL="http://localhost:20128"` y
  `$env:ANTHROPIC_API_KEY="sk-omniroute"`.
* **Regla de ejecución — permisos:** usar **`--allowedTools` con lista blanca explícita**
  por tarea, NUNCA `--dangerously-skip-permissions`. Ejemplo para una revisión de código
  de solo lectura:
  `claude -p "..." --allowedTools "Read Grep Glob"`.
  Ejemplo para una edición acotada a un módulo:
  `claude -p "..." --allowedTools "Read Edit Bash(git diff*)"`.
  Define la lista según el blast radius real de la tarea delegada — nunca la dejes
  abierta a `Bash(*)` sin necesidad concreta.
* **Cuándo:** debugging complejo que amerite una sesión Claude completamente aislada del
  contexto actual, o cuando OmniRoute necesite hacer fallback automático de proveedor
  por cuota agotada.

### 1.4 Cline (`cline "..."`)
* **Rol:** Asistente interactivo, human-in-the-loop estricto.
* **Regla de ejecución:** **NUNCA** lo ejecutes tú en segundo plano — no tiene CLI
  headless real y se bloqueará pidiendo aprobación. Prepara la instrucción y pide al
  usuario que la pegue en su propia terminal/editor.
* **Cuándo:** operaciones de infraestructura o instalaciones riesgosas que requieren
  aprobación humana paso a paso.

### 1.5 Codex (`codex "..."`)
* **Rol:** Snippets y traducción de algoritmos.
* **Cuándo:** micro-ediciones o regex difíciles, traducción rápida de algoritmos.

### 1.6 Playwright CLI
* No dupliques lógica aquí — usa la skill `playwright-cli` ya disponible para validar
  que un cambio delegado (frontend) no rompió flujos críticos, y para el ciclo
  auto-reparación (test falla → regresa el error a Aider/`claude -p`/Agent tool nativo).

---

## 2. OmniRoute y fallback

Todo el tráfico de los CLIs externos (KiloCode, Aider, segundo `claude -p`) está
enrutado por OmniRoute en `http://localhost:20128` (confirmar que esté escuchando con
`netstat -an | grep 20128` antes de delegar si ha pasado tiempo desde el último uso).
OmniRoute maneja nativamente Quota Exceeded/429 y hace fallback de modelo/proveedor sin
que tengas que intervenir.

Si el fallo persiste pese a OmniRoute:

1. **Degradación gradual:** si falló una tarea compleja de negocio en Aider o en el
   segundo `claude -p`, redirígela a KiloCode forzando un modelo gratuito
   (`deepseek-coder` u otro disponible).
2. **Si la que está limitada es esta propia sesión de Claude Code** (no un subproceso):
   reduce alcance — respuestas más concisas, prioriza `Grep`/`Glob` sobre leer archivos
   completos, y usa el Agent tool nativo con `subagent_type: Explore` para exploración en
   vez de cargar contexto tú mismo.
3. **Dividir y conquistar:** los modelos gratuitos/rápidos tienen menos ventana de
   contexto — parte la tarea en comandos más pequeños con menos archivos por vez.

---

## 3. Jerarquía y referencias obligatorias

1. **Regla madre (`CONVENTIONS.md`):** todo código generado por un CLI delegado debe
   alinearse a `D:\repos\luxuryapp-api\CONVENTIONS.md`. Pasa siempre instrucciones
   explícitas sobre las convenciones aplicables (ej. "sigue el patrón
   `IFileReadPathService`", "no modifiques `SelectItem` existentes — crea uno nuevo").
2. **Sinergia con planeación (`planeacion-modulos`):** la delegación pesada de código
   ocurre **solo después** de completar la FASE 0 y el plan arquitectónico de la skill
   `planeacion-modulos`. Flujo: yo creo el plan con `planeacion-modulos` → yo divido el
   plan entre Agent tool nativo, KiloCode, Aider, Codex o un segundo `claude -p` según la
   tabla de la sección 0 → verifico con `playwright-cli` cuando aplique a frontend.
