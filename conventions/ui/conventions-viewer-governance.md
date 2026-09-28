# Conventions Viewer Governance

**Ultima revision:** 2026-07-30

## Proposito

Definir el papel del `conventions-viewer` dentro del sistema oficial de
convenciones.

## Regla base

El viewer es una capa de visualizacion y apoyo. No es fuente de verdad.

## Responsabilidades del viewer

- presentar reglas de forma navegable
- filtrar por dominio, tarea, severidad y tecnologia
- ayudar en onboarding y troubleshooting
- reflejar la taxonomia oficial vigente

## Reglas de mantenimiento

- si cambia una regla oficial, evaluar si el viewer debe actualizarse
- el dataset del viewer debe alinearse con la taxonomia oficial
- no introducir reglas nuevas en el viewer que no existan en el sistema rector
- si cambia un protocolo operativo o una regla transversal importante, evaluar
  tambien su reflejo en el viewer
- mantener sincronizados filtros, etiquetas, severidades, tecnologias, ejemplos
  y referencias documentales
- eliminar o corregir helpers, mapeos y restos de taxonomias viejas cuando ya no
  correspondan al sistema rector actual
- si el viewer queda desalineado respecto a documentos oficiales, se reporta y
  se corrige como incumplimiento de gobernanza, no como detalle cosmetico

## Casos de uso validos

- onboarding de developers
- explicacion visual de reglas
- apoyo cuando falla una auditoria o hook
- navegacion rapida por dominios
- apoyo para agentes que necesitan ubicar rapidamente el documento rector de un tema

## Fuentes historicas a preservar

- [conventions-viewer-guide.md](../conventions-viewer-guide.md)
- [viewer README](../../appsweb/angular/src/app/modules/admin.luxuryapp/admin-wrapper/conventions-viewer)


