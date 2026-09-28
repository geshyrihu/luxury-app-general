---
name: delegacion-estrategica
description: >-
  Define cuándo y cómo delegar tareas a agentes CLI externos (Aider, Cline, Claude Code, Codex, KiloCode) 
  maximizando la calidad y minimizando el consumo de tokens. Incluye estrategia de fallback.
---

# Estrategia de Delegación a Agentes Externos

Eres el orquestador principal (Antigravity). Tu objetivo es dividir tareas complejas y delegarlas a la herramienta de CLI más adecuada del sistema, basándote en la siguiente matriz de decisión y ejecutando sus comandos en la terminal.

## 1. El Equipo (The Staff)

### 1. KiloCode (`kilo run --yes "..."`)
*   **Rol:** El Obrero / Alta velocidad, Costo Cero.
*   **Regla de Ejecución:** Siempre usar flags no interactivos (ej. `--yes` o `-y`) para evitar que el proceso se bloquee. **Debes enrutar por OmniRoute configurando primero:** `$env:OPENAI_API_BASE="http://localhost:20128/v1"` y `$env:OPENAI_API_KEY="sk-omniroute"`.
*   **Modelos a usar:** `deepseek-coder` (o `deepseek-chat`), `gpt-4o-mini`, o `gemini-1.5-flash`.
*   **Cuándo delegarle:** 
    *   Generación de Boilerplate (controladores, componentes vacíos).
    *   Generación masiva de Pruebas Unitarias o Documentación JSDoc/XML.
    *   Tareas repetitivas de un solo archivo.

### 2. Aider (`aider --yes --message "..."`)
*   **Rol:** El Maestro de Git / Refactorización Transversal.
*   **Regla de Ejecución:** Es **obligatorio** usar el flag `--yes` para autoconfirmar sin bloquearse. **Debes enrutar por OmniRoute configurando primero:** `$env:OPENAI_API_BASE="http://localhost:20128/v1"` y `$env:OPENAI_API_KEY="sk-omniroute"`.
*   **Modelos a usar:** `claude-3-5-sonnet-20241022` (vía `--model openai/claude-3-5-sonnet-20241022`) o `gpt-4o`.
*   **Cuándo delegarle:**
    *   Cambios quirúrgicos que tocan múltiples archivos simultáneamente.
    *   Renombramientos masivos de variables o servicios.
    *   Cuando se necesita que el agente haga los commits de Git automáticamente tras el cambio.

### 3. Claude Code (`claude -p "..."`)
*   **Rol:** El Especialista de Negocio / Calidad Premium.
*   **Regla de Ejecución:** **ATENCIÓN:** Claude Code tiende a bloquearse pidiendo permisos para escribir archivos. Asegúrate de pasar flags de autoconfirmación absolutos si existen, o **evita ejecutarlo en segundo plano** si implica escritura. Si lo usas, **debes enrutar por OmniRoute configurando primero:** `$env:ANTHROPIC_BASE_URL="http://localhost:20128"` y `$env:ANTHROPIC_API_KEY="sk-omniroute"`.
*   **Modelos a usar:** `claude-3-5-sonnet-20241022` (por defecto) o `claude-3-5-haiku-20241022` (para lectura rápida).
*   **Cuándo delegarle:**
    *   Refactorización de lógica crítica del negocio (ej. Módulo de Cobranza).
    *   Code Reviews profundos de Pull Requests.
    *   Debugging de errores complejos donde se requiere un "Second Opinion" de alta capacidad analítica.

### 4. Cline (`cline "..."`)
*   **Rol:** El Asistente Interactivo (Estricto Human-in-the-loop).
*   **Cuándo delegarle:**
    *   Tareas donde requieras que el usuario apruebe paso a paso las acciones.
    *   Operaciones de infraestructura o instalaciones riesgosas.
*   **Regla de Ejecución:** **NUNCA** ejecutes Cline mediante comandos en segundo plano. Dado que pide permiso para todo, se bloqueará inevitablemente. Para delegar a Cline, prepara la instrucción y dile al usuario que la copie y la pegue en su propia terminal/editor.

### 5. Codex (`codex "..."`)
*   **Rol:** El Matemático / Snippets.
*   **Modelos a usar:** `5.4 mini` o `5.6 sol`.
*   **Cuándo delegarle:**
    *   Traducción rápida de algoritmos complejos.
    *   Micro-ediciones o regex difíciles.

### 6. Playwright CLI (`npx playwright test`)
*   **Rol:** El QA Automatizado / Verificador de UI (Testing E2E).
*   **Cuándo usarlo:**
    *   **Validación post-delegación:** Después de que un agente (ej. Aider o Claude) modifica componentes del frontend, debes correr Playwright para verificar que los flujos críticos (ej. Login, Formularios) no se rompieron.
    *   **Generación de Tests:** Delega a KiloCode la escritura de archivos `.spec.ts` y luego usa Playwright para ejecutarlos.
    *   **Flujo de Auto-reparación:** Si el comando `playwright test` falla, captura el error de la terminal y pásaselo de regreso a Claude o Aider para que reparen el componente hasta que el test pase en verde.

---

## 2. Estrategia de Fallback y OmniRoute

Todo el tráfico de los agentes CLI (Aider, Claude Code, Cline) está **enrutado a través de OmniRoute** (puerto local `20128`).
OmniRoute se encarga nativamente del manejo de cuotas (Quota Exceeded, 429) y hace el fallback automático de modelos (ej. de Claude a GPT-4o o Gemini) sin detener el flujo en la terminal.

Si a pesar de OmniRoute ocurre un fallo total, aplica este protocolo de rescate manual:

1.  **Degradación Grácil (Graceful Degradation):**
    *   Si falló una tarea compleja de negocio en Aider/Claude Code, redírigela a **KiloCode** forzando el uso de `deepseek-coder` u otro modelo gratuito disponible.
    *   Si falló Antigravity (errores de límite en Gemini High), cambia internamente tu estilo a respuestas más concisas, pídele al usuario cambiar a `Gemini Pro 3.1 Low`, y apóyate más en leer código localmente con greps en lugar de cargar archivos enteros en contexto.
2.  **Dividir y Conquistar:** Los modelos rápidos y gratuitos tienen menos ventana de contexto. Divide la tarea en comandos más pequeños pasando menos archivos por vez a los subagentes.

---

## 3. Jerarquía y Referencias Obligatorias

Antes de delegar cualquier tarea de desarrollo o planeación, **debes asegurarte de que los agentes delegados reciban el contexto de las convenciones del proyecto**.

1. **Regla Madre (`CONVENTIONS.md`):** Todo código generado por los subagentes (Aider, Claude, etc.) debe alinearse a las reglas universales definidas en `D:\repos\luxuryapp-api\CONVENTIONS.md`. Cuando delegues, pasa siempre instrucciones explícitas sobre las convenciones que apliquen a la tarea (ej. "Sigue el patron IFileReadPathService" o "No modifiques SelectItems existentes").
2. **Sinergia con Planeación (`planeacion-modulos`):** La delegación pesada de código debe ocurrir **solamente después** de que se haya completado la FASE 0 y el plan arquitectónico, según lo define la skill `D:\repos\luxuryapp-api\.agents\skills\planeacion-modulos\SKILL.md`. El flujo ideal es: Antigravity crea el plan usando `planeacion-modulos`, y luego Antigravity ejecuta el código dividiendo el plan entre KiloCode, Aider o Claude usando esta skill de delegación.
