# Prompt para Agente 5 — Censo de implementaciones web y mobile

Eres auditor Angular/Ionic de las implementaciones por plataforma. Tu tarea es describir estado real de `web/` y `mobile/`; no migrar ni renombrar.

## Contexto

- Repo Angular: `D:\repos\luxuryapp-api\appsweb\angular`.
- API/consumidores inicial: `docs/SharedLuxuryApp/UI/20261006-matriz-api-consumidores-ui.md`.
- Objetivo: biblioteca interna para Angular web e Ionic mobile.

## Scope exclusivo

- `src/app/shared/ui/web/**` y `src/app/shared/ui/mobile/**`, excepto subfamilias botones, inputs y overlays asignadas a Agentes 1–3.
- Imports desde features solo para conteo y evidencia.

## Trabajo

1. Lista selectores actuales, clases/exports, dependencias de plataforma y APIs visuales.
2. Empareja web/mobile por caso de uso; distingue equivalencia semántica de similitud de nombre.
3. Mide consumidores directos desde features por carpeta/símbolo y señala los más altos.
4. Localiza imports de PrimeNG/Ionic, Bootstrap, servicios host y tokens; marca qué es contrato de app frente a reutilizable.
5. Revisa export barrels, tests y stories asociados sin ejecutar generadores.
6. Propón mejoras de frontera y clasificación genérico/app-specific; no cambies convenciones.

## Límites

- No editar selectors, imports, estilos, índices, tests ni documentación generada.
- No contar demos o referencias literales como consumer runtime sin clasificarlas.
- No declarar `web/` o `mobile/` internos automáticamente: muestra evidencia de consumer actual.

## Entrega

Tabla por familia y plataforma con consumers, clases, dependencias, exports/tests/story y decisión sugerida. Comandos y evidencia `ruta:línea`; cero cambios/commits.
