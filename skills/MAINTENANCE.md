# Mantenimiento y Actualizacion de Skills - LuxuryApp

Este documento explica como gestionar el sistema de Micro-Skills si realizas cambios en las reglas de codificacion o en la estructura del proyecto.

## 1. Actualizacion de Reglas (Cambios Leves)
Si solo necesitas cambiar una regla tecnica (ej. "Ahora el `pageSize` maximo es 500"):
1. **Edita el archivo .md correspondiente** en `skills/[area]/[archivo].md`.
2. **Listo!** Los agentes leeran el archivo actualizado en su siguiente consulta. No necesitas reinstalar nada.

## 2. Re-empaquetado y Reinstalacion (Cambios Estructurales)
Si cambias nombres de carpetas, anades nuevas secciones al indice (`README.md`) o quieres registrar una nueva version oficial de la Skill:

### Paso A: Limpiar la Skill Anterior
Ejecuta en tu terminal:
```powershell
gemini skills uninstall luxuryapp-core --scope workspace
```

### Paso B: Generar el nuevo Paquete (.skill)
Pidele a Gemini CLI:
> *"Gemini, empaqueta la skill luxuryapp-core de nuevo."*
O ejecuta manualmente:
```powershell
node "C:\Users\geshy\AppData\Roaming\npm\node_modules\@google\gemini-cli\bundle\builtin\skill-creator\scripts\package_skill.cjs" "skills/luxuryapp-core/luxuryapp-core" .
```

### Paso C: Instalar y Recargar
Ejecuta en tu terminal:
```powershell
gemini skills install ./luxuryapp-core.skill --scope workspace
```
Y dentro de la sesion interactiva de Gemini:
```text
/skills reload
```

## 3. Como anadir una nueva Area (Ej. Mobile Flutter)
1. Crea la carpeta: `skills/mobile-flutter/`.
2. Crea tus micro-archivos `.md` con las reglas de Flutter.
3. **Actualiza el indice maestro**: Anade la nueva seccion en `skills/README.md`.
4. **Actualiza la Master Skill**: Anade la referencia en `skills/luxuryapp-core/luxuryapp-core/SKILL.md`.
5. Repite el proceso de **Re-empaquetado** (Paso 2).
---

## 4. Sincronizacion de Skills entre Agentes (Kilo/Claude/Gemini/Qwen)

Para que **todos los agentes usen exactamente el mismo skill** (sin deriva), el skill
propio del proyecto vive como canonico en `skills/luxuryapp-core/luxuryapp-core/SKILL.md`
(raiz) y se replica a cada carpeta de agente con:

```powershell
node scripts/sync-skills.mjs            # copia el canon a .kilo/.agents/.claude/.gemini/.qwen/.codex/.cursor/.antigravity
node scripts/sync-skills.mjs --check    # solo reporta diferencias (util en CI)
```

- El script solo toca skills **propios** en `AGENT_DIRS`. Los skills que
  provee cada harness (p.ej. `angular-developer`) se gestionan por su ecosistema y no se
  modifican aqui.
- Despues de editar el skill canonico, corre `sync-skills.mjs` para propagarlo.

_Nota: Manten siempre `GEMINI.md` en la raiz actualizado, ya que es la primera instruccion que leen los agentes al entrar al repositorio._
