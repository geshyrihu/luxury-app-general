# Conventions Viewer - Guia Completa para Agentes

> **Estado de autoridad:** documento historico de apoyo controlado.
> La autoridad vigente del viewer vive en
> `./ui/conventions-viewer-governance.md`.
> Este archivo puede conservar contexto operativo o historico, pero no debe
> usarse como fuente primaria para definir reglas vigentes del sistema.

**Componente:** Guia visual interactiva de `CONVENTIONS.md`  
**Ubicacion:** `appsweb/angular/src/app/modules/admin.luxuryapp/admin-wrapper/conventions-viewer/`  
**Ruta historica documentada:** `/admin/conventions-guide`  
**Status:** Apoyo controlado

---

## Proposito

Proporcionar a developers, agentes IA y nuevos miembros del equipo una guia
visual e interactiva de convenciones del proyecto.

Este documento describe comportamiento y contexto historico del viewer, pero la
gobernanza vigente se valida en `./ui/conventions-viewer-governance.md`.

---

## Archivos Clave

| Archivo | Proposito |
|---|---|
| `conventions-viewer.ts` | Componente principal |
| `conventions-viewer.html` | Template con tabs, busqueda y grid |
| `conventions-viewer.service.ts` | Fuente de datos del viewer; validar siempre contra docs rectores vigentes |
| `components/convention-card/` | Tarjeta individual |
| `README.md` | Documentacion tecnica local del modulo si existe |

---

## Como Usarlo

### Para developers

- Buscar una regla por palabra clave
- Filtrar por tecnologia, severidad o categoria
- Expandir una tarjeta para revisar ejemplos y contexto

### Para agentes IA

- usar el viewer como apoyo visual
- validar siempre la regla contra `CONVENTIONS.md` y el documento especializado
  correspondiente
- no confiar en numeraciones historicas o catálogos viejos del viewer si no
  coinciden con el sistema rector actual

---

## Datos Incluidos (historico)

El viewer historicamente documento reglas de Angular, .NET y reglas
transversales. Ese inventario puede servir como apoyo, pero:

- no reemplaza la taxonomia documental actual
- no valida por si solo que una regla siga vigente
- no debe citarse como autoridad primaria

---

## Agregar o Actualizar Reglas

Antes de agregar o editar reglas en el viewer:

1. validar la regla en `CONVENTIONS.md`
2. validar el documento especializado del dominio
3. validar `./ui/conventions-viewer-governance.md`
4. actualizar viewer solo despues de confirmar que refleja el sistema rector

---

## Integracion con Otros Sistemas

- puede apoyar onboarding de developers
- puede apoyar consultas rapidas durante auditorias o remediaciones
- no sustituye protocolos de auditoria, planes ni documentos rectores

---

## Testing y QA

Al revisar el viewer conviene validar:

- busqueda
- filtros
- expansion de tarjetas
- consistencia de severidades
- consistencia entre viewer y documentos rectores
- responsive basico

---

## Troubleshooting

| Problema | Causa probable | Solucion |
|---|---|---|
| El viewer muestra reglas desalineadas | dataset historico no sincronizado | revisar governance del viewer y actualizar fuente |
| Un agente cita una regla vieja del viewer | uso de fuente no rectora | redirigir a `CONVENTIONS.md` y documento especializado |
| Filtros o cards no reflejan dominios actuales | taxonomia vieja | alinear viewer con la estructura vigente |

---

## Nota Final

Este documento conserva valor como apoyo historico y operativo, pero el control
real del viewer ya no vive aqui, sino en el sistema rector de convenciones y en
la gobernanza especifica del viewer.
