# Git Hooks and Audit Automation

**Ultima revision:** 2026-07-29

## Proposito

Consolidar las reglas de automatizacion de auditoria por rol, hooks y scripts
que ayudan a hacer enforcement del sistema de convenciones.

## Reglas base

- los hooks no sustituyen el criterio tecnico, pero si automatizan
  verificaciones minimas
- las ramas deben alinearse al flujo de auditoria por rol cuando aplique
- los scripts deben ser no destructivos y reportar hallazgos con fix sugerido
- el proyecto debe configurar `core.hooksPath` hacia `.githooks`
- el bypass con `--no-verify` es excepcional y no sustituye cumplimiento

## Scripts relevantes

| Rol o caso | Comando esperado |
|---|---|
| Frontend Senior | `npm run audit:frontend` |
| Mobile Developer | `npm run audit:mobile` |
| Full Stack | `npm run audit:full-stack` |
| Backend Developer | `dotnet run audit:backend` |
| Tech Lead / modulo | auditoria integral de modulo |

## Hooks esperados

| Hook | Ubicacion | Proposito |
|---|---|---|
| `pre-commit` | `.githooks/pre-commit` | auditoria por rol, mojibake y verificaciones minimas |
| `pre-push` | `.githooks/pre-push` | auditoria ampliada antes de push cuando aplique |

## Configuracion minima obligatoria

### Paso 1. Configurar ruta de hooks

```bash
git config core.hooksPath .githooks
git config core.hooksPath
```

Resultado esperado:

- `.githooks`

### Paso 2. Confirmar disponibilidad de runtime

- frontend/mobile: `node`, `npm`
- backend: `.NET`

### Paso 3. Probar con una rama reconocible

Ejemplos validos:

- `feature/frontend-auth-refactor`
- `feature/mobile-qr-flow`
- `feature/backend-user-migration`
- `feature/full-stack-payment-flow`
- `fix/frontend-banks-grid`
- `hotfix/payment-timeout`

## Mapping de ramas a auditoria

| Patron de rama | Rol inferido | Auditoria esperada |
|---|---|---|
| `feature/frontend-*` | Frontend Senior | `npm run audit:frontend` |
| `fix/frontend-*` | Frontend Senior | `npm run audit:frontend` |
| `feature/mobile-*` | Mobile Developer | `npm run audit:mobile` |
| `fix/mobile-*` | Mobile Developer | `npm run audit:mobile` |
| `feature/backend-*` | Backend Developer | `dotnet run audit:backend` |
| `fix/backend-*` | Backend Developer | `dotnet run audit:backend` |
| `feature/full-stack-*` | Full Stack | `npm run audit:full-stack` |
| `hotfix/*` | Full Stack | `npm run audit:full-stack` |
| otro patron | sin rol inferido | auditoria especifica debe ejecutarse manualmente |

## Flujo esperado del hook

1. detecta rol por nombre de rama
2. ejecuta auditoria del rol o stack
3. corre escaneos complementarios como mojibake y reglas de UI/styles
4. bloquea commit o push si hay falla critica

## Comportamiento esperado

- fallos criticos deben bloquear aprobacion o commit/push segun configuracion
  vigente
- warnings altos deben escalarse cuando formen patron
- los scripts deben referenciar reglas del sistema oficial
- los scripts deben ser no destructivos y, cuando fallen, deben sugerir fix
  concreto
- los patrones de rama deben permitir inferir el stack para disparar la
  auditoria correcta

## Troubleshooting ampliado

- si el hook no corre, verificar primero `git config core.hooksPath`
- si el hook falla por runtime, validar disponibilidad real de `node`, `npm` o
  `.NET`
- si la rama no coincide con un patron reconocido, renombrarla antes de seguir
- el bypass con `--no-verify` no corrige el incumplimiento; solo pospone la
  deteccion

## Troubleshooting minimo

| Problema | Causa comun | Respuesta esperada |
|---|---|---|
| hook no corre | `core.hooksPath` no configurado | volver a ejecutar `git config core.hooksPath .githooks` |
| auditoria no dispara | patron de rama no reconocido | renombrar rama al patron oficial |
| runtime faltante | `npm` o `.NET` no disponible | instalar o corregir PATH antes de continuar |
| mojibake detectado | archivo guardado con encoding incorrecto | usar scanner/corrector oficial y reintentar |

## Regla de CI/CD

- cualquier automatizacion en CI debe reforzar el mismo criterio de hooks
- CI no debe inventar reglas distintas a las del sistema rector
- si hook y CI divergen, se corrige la automatizacion y se documenta la decision

## Fuente historica a preservar

- [git-hooks-setup.md](../../git-hooks-setup.md)
- [onboarding-git-hooks.md](../../onboarding-git-hooks.md)
- [scripts-auditoria.md](../../scripts-auditoria.md)


