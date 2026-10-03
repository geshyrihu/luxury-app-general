# Agent Commit and Push Protocol

**Estado:** vigente  
**Alcance:** KiloCode, OpenCode, Codex, Claude, Antigravity y cualquier otro agente que opere estos repositorios.

## Propósito

Definir un flujo único para crear commits y hacer push sin incluir cambios del usuario, de otro agente ni de repositorios no involucrados.

## Repositorios reconocidos

Solo se permite operar estos repositorios:

| Repositorio | Scope de commit |
|---|---|
| `D:\repos\luxuryapp-api\appsweb\angular` | `web` |
| `D:\repos\luxuryapp-api\api` | `api` |
| `D:\repos\luxuryapp-api\appsmobil\flutter\commitee` | `mobile` |

La carpeta contenedora `D:\repos\luxuryapp-api` no es repositorio Git y no debe recibir commits.

## Regla de atribución

El agente solo puede incluir archivos que pueda atribuir con evidencia a su sesión actual:

- archivo editado mediante herramienta del agente;
- archivo creado explícitamente por el agente;
- archivo modificado por comando ejecutado explícitamente por el agente.

Git no registra qué agente modificó cada línea. Si existen cambios previos mezclados y no es posible separar con certeza el diff del agente, el agente debe detenerse antes de staging y reportar la ambigüedad.

Nunca usar `git add .`, `git add -A`, `git commit -am`, `reset`, `checkout`, `clean`, `stash`, `amend` ni `force-push` para resolver atribución.

## Flujo obligatorio

Para cada repositorio tocado:

1. Confirmar raíz: `git rev-parse --show-toplevel`.
2. Confirmar estado: `git status --short` y `git diff --stat`.
3. Revisar únicamente archivos atribuibles: `git diff -- <paths>`.
4. Confirmar rama y upstream: `git branch --show-current` y `git rev-parse --abbrev-ref --symbolic-full-name @{upstream}`.
5. Ejecutar validaciones aplicables antes de commit.
6. Stagear rutas exactas: `git add -- <paths>`.
7. Validar staging: `git diff --cached --check` y `git diff --cached --stat`.
8. Crear un commit por repositorio afectado.
9. Verificar commit: `git show --stat --oneline --summary HEAD`.
10. Hacer push únicamente al upstream de la rama actual.

Si no existe upstream, hay cambios ambiguos, hay secretos, artefactos generados o el destino de push no es claro, detenerse y pedir decisión. Nunca improvisar.

## Formato de commit

Usar Conventional Commits en español:

```text
<type>(<scope>): <descripción imperativa>
```

Tipos permitidos: `feat`, `fix`, `refactor`, `docs`, `test`, `build`, `chore`.

Reglas:

- descripción concreta, imperativa y sin punto final;
- máximo 72 caracteres en subject;
- un commit por repositorio;
- body solo cuando explique motivación no obvia o impacto de compatibilidad;
- no mencionar agente, IA, sesión ni herramienta;
- separar commits dentro de un repositorio solo si separación por archivos es inequívoca.

Ejemplos:

```text
fix(api): permite reporte publico sin autenticacion
feat(web): agrega filtro de cobranza
fix(mobile): corrige validacion de codigo QR
```

## Protección de cambios ajenos

Cambios no atribuibles deben permanecer intactos y sin staging. El agente debe reportar:

- repositorios omitidos;
- archivos omitidos;
- cambios ambiguos;
- validaciones no ejecutadas;
- resultado de cada push.

## Implementaciones por agente

Los agentes pueden ofrecer comandos propios, pero deben implementar este protocolo. Un comando no puede relajar estas reglas.

- OpenCode: `/commit` global, si está configurado.
- Otros agentes: usar este documento como contrato operativo para su comando o flujo equivalente.
