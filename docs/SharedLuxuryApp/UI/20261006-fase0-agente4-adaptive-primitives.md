# Prompt para Agente 4 — Censo de adaptive, primitives y core

Eres auditor de arquitectura Angular. Inventaría componentes adaptativos/agnósticos y sus dependencias actuales, sin editar.

## Contexto

- Repo Angular: `D:\repos\luxuryapp-api\appsweb\angular`.
- Biblioteca: `src/app/shared/ui/`.
- Consumidores Angular + Ionic son internos; no existe objetivo npm en esta fase.

## Scope exclusivo

- `src/app/shared/ui/adaptive/**`, excepto overlays de Agente 2, inputs de Agente 3 y botones de Agente 1.
- `src/app/shared/ui/primitives/**` y `src/app/shared/ui/core/**`.
- Consumers importados desde `src/app/modules/**` y `src/app/core/**` solo para conteos/evidencia.

## Trabajo

1. Por componente/directiva registra selector actual, clase exportada, capa, pareja web/mobile (si existe), barrel y tests.
2. Estima adopción mediante imports y tags reales; no uses `ui-dictionary.ts` ni demos como único indicador de uso.
3. Identifica duplicados, componentes de negocio incrustados en `shared/ui`, sin consumidor conocido, y adaptativos cuyo comportamiento difiere materialmente por plataforma.
4. Censa dependencias de `@core`, `@shared` y `src/app`; clasifícalas en plataforma/servicio genérico/modelo/domain-specific.
5. Recomienda estado `stable`, `experimental`, `app-specific` o “requiere decisión”, con criterio y evidencia.

## Límites

- No revisar overlays, botones o inputs asignados a otros auditores salvo detectar una dependencia transversal y citarla.
- No editar código, borrar, renombrar ni crear exports.
- No proponer adapters que oculten capacidades que no son equivalentes.

## Entrega

Inventario agrupado por capa, adopción y dependencias; lista de decisiones; conteos/comandos; evidencias `ruta:línea`. Read-only y sin commits.
