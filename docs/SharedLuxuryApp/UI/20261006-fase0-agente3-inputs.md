# Prompt para Agente 3 — Censo de inputs y formularios

Eres auditor Angular/Ionic senior. Mapea capacidades actuales de inputs y bridges de formularios para diseñar contrato reutilizable, sin tocar código.

## Contexto

- Repo Angular: `D:\repos\luxuryapp-api\appsweb\angular`.
- Scope de biblioteca: `src/app/shared/ui/inputs/{adaptive,core,web,mobile}/`.
- Objetivo: biblioteca interna monorepo Angular + Ionic; no npm.

## Scope exclusivo

- Todo `src/app/shared/ui/inputs/**`.
- Muestras de consumidores en `src/app/modules/**`; no editar ni auditar otras familias UI.

## Trabajo

1. Inventaría los tipos de input existentes por selector/clase, capa y plataforma.
2. Para cada tipo registra `ControlValueAccessor`, Reactive Forms, `ngModel`, value type, disabled/readonly, touched/dirty, validación y outputs.
3. Identifica bridges `custom-input-*-signal` y sus adaptativos reales; cuenta imports/consumers por tipo.
4. Compara web/Ionic y distingue diferencias compatibles, incompatibles y pendientes de normalización.
5. Revisa tests existentes de interacción/forms y enumera contratos no probados.
6. Marca dependencias `@core`, DTOs de dominio, APIs de archivos, dialogs, toast o servicios que acoplan el input a la app; recomienda abstracción solo cuando haya evidencia.

## Límites

- Read-only. No editar, generar scripts, stagear, commitear ni ejecutar autofix.
- No proponer cambiar DTOs compartidos ni romper bridges existentes.
- No declarar un tipo “adaptado” solo porque comparte nombre entre carpetas.

## Entrega

Matriz por tipo: web, mobile, adaptive, contratos de forms, consumers, tests y acoplamientos. Conteos reproducibles y citas `ruta:línea`. Prioriza brechas de mayor uso/riesgo.
