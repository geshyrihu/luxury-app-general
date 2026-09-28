# Matriz de Transicion Legacy - Sistema de Convenciones

**Fecha:** 2026-07-29
**Estado:** Revision ampliada
**Objetivo:** Determinar que documentos historicos ya fueron absorbidos, cuales
siguen aportando reglas utiles y que omisiones persisten en la nueva
estructura.

---

## Resumen Ejecutivo

La nueva arquitectura documental ya absorbio la **jerarquia rectora**, las
**reglas universales**, el **orden de lectura por tipo de tarea**, la base de
**backend/frontend/flutter/ui/styles/audit** y la alineacion inicial del
`conventions-viewer`.

En las revisiones posteriores se confirmo que tambien habia valor importante en:

1. **Gobernanza por rol**
2. **Criterios de auditoria automatizables por rol**
3. **Matriz operativa de severidad y responsabilidad**
4. **Encoding y manejo seguro de archivos**
5. **Git hooks, scripts de auditoria y enforcement automatizado**
6. **Catalogo real de servicios compartidos/proveedores del backend**
7. **Onboarding de developers y Tech Leads**
8. **Training del marco de gobernanza**
9. **Guia operativa del conventions-viewer**
10. **Plantillas operativas para solicitar tareas a agentes**
11. **Indice funcional de planes y uso de `docs/plans/`**

La nueva estructura ya absorbio una parte importante de esos vacios, pero los
documentos originales **no deben retirarse todavia** hasta cerrar validacion.

---

## Matriz Documento por Documento

| Documento legacy | Estado actual | Absorbido en la nueva estructura | Aun aporta valor | Recomendacion |
|---|---|---|---|---|
| `agent-audit-protocol.md` | Absorbido funcionalmente | `conventions/audit/*`, `CONVENTIONS.md`, plan de reestructuracion | Si: detalle historico de FASE 0 y lenguaje operativo previo | Mantener como apoyo controlado |
| `PROTOCOLO_COMPLIANCE_CONVENCIONES.md` | Absorbido funcionalmente | `core/governance.md`, `core/compliance-protocol.md`, `CONVENTIONS.md`, `legacy/README.md` | Si: lenguaje historico y enforcement cultural | Mantener como legacy controlado |
| `gobernanza-convenciones.md` | Absorbido de forma funcional | `core/governance.md`, `core/governance-by-role.md`, `CONVENTIONS.md` | Si: ejemplos historicos y lenguaje original | Mantener como referencia controlada |
| `auditoria-por-rol.md` | Absorbido de forma funcional | `audit/audit-by-role.md`, `audit/audit-module-conventions.md` | Si: ejemplos y comandos legacy | Mantener como referencia controlada |
| `agent-instructions-catalog.md` | Absorbido de forma funcional | `operations/agent-task-catalog.md`, `core/workflow-por-tipo-de-tarea.md` | Si: ejemplos historicos y lenguaje operativo previo | Mantener como legacy controlado mientras se valida cobertura total |
| `readme-plans.md` | Absorbido parcialmente | `docs/plans/`, `operations/agent-task-catalog.md`, `core/workflow-por-tipo-de-tarea.md` | Si: listado historico de planes activos y naming previo | Mantener como indice historico; no usar como autoridad de convenciones |
| `git-hooks-setup.md` | Absorbido de forma funcional | `operations/git-hooks-and-audits.md`, `operations/developer-onboarding.md` | Si: troubleshooting detallado e historial de evolucion | Mantener como legacy controlado |
| `onboarding-git-hooks.md` | Absorbido de forma funcional | `operations/developer-onboarding.md`, `operations/git-hooks-and-audits.md` | Si: narrativa rapida de onboarding | Mantener como legacy controlado |

---

## Reglas y Contenido Ya Absorbidos Correctamente

### 1. Gobernanza y flujo rector

Ya quedaron absorbidos o representados:

- `CONVENTIONS.md` manda
- todo documento deriva de `CONVENTIONS.md`
- cambios deben actualizar documentos relacionados
- no borrar historico sin control
- ciclo audit -> plan -> implementacion -> reauditoria

Destino actual principal:

- `CONVENTIONS.md`
- `conventions/core/governance.md`
- `conventions/core/compliance-protocol.md`
- `conventions/core/precedencia-documental.md`
- `conventions/legacy/README.md`

### 2. Gobernanza y auditoria por rol

Ya quedaron absorbidos o representados:

- roles formales del proyecto
- dominios y responsabilidades por rol
- criterios de auditoria por especialidad
- comandos y criterios de paso/fallo por rol

Destino actual principal:

- `conventions/core/governance-by-role.md`
- `conventions/audit/audit-by-role.md`
- `conventions/audit/audit-module-conventions.md`

### 3. Hooks, onboarding y enforcement operativo

Ya quedaron absorbidos o representados:

- configuracion de `core.hooksPath`
- mapping de ramas a auditoria
- troubleshooting minimo
- onboarding inicial del developer
- expectativa de CI alineado con hooks

Destino actual principal:

- `conventions/operations/git-hooks-and-audits.md`
- `conventions/operations/developer-onboarding.md`

### 4. Solicitudes operativas a agentes

Ya quedaron absorbidos o representados:

- plantilla universal de solicitud
- casos de uso para auditoria, plan, remediacion, documentacion, investigacion
- regla de rutas exactas y restricciones explicitas

Destino actual principal:

- `conventions/operations/agent-task-catalog.md`
- `conventions/core/workflow-por-tipo-de-tarea.md`

---

## Brechas que Siguen Bajo Verificacion

Las brechas actuales son mas de **profundidad** y **mantenimiento vivo** que de
ausencia tematica:

### A. Detalle fino de auditorias reales por stack

- verificar si faltan comandos o criterios concretos en casos reales
- ajustar sin duplicar autoridad

### B. Inventarios vivos

- servicios compartidos backend
- componentes UI reutilizables
- catalogos de estilos/tokens

### C. Synchronizacion viewer-docs

- validar que `conventions-viewer` represente toda la taxonomia nueva
- confirmar que filtros, labels y cards no omitan dominios o tipos de tarea

### D. Gobernanza de `docs/plans/`

- mantener `docs/plans/` como repositorio operativo
- evitar que el indice legacy vuelva a convertirse en autoridad

---

## Recomendacion por Documento

### `agent-audit-protocol.md`

**Estado recomendado:** Legacy activo

**Condicion para degradarlo a referencia pasiva:**

- confirmar que `audit-module-conventions.md` ya cubre flujo, FASE 0, salidas y
  anti-patrones sin huecos

### `PROTOCOLO_COMPLIANCE_CONVENCIONES.md`

**Estado recomendado:** Legacy activo

**Condicion para degradarlo:**

- validar enforcement del Tech Lead y politicas de actualizacion documental en
  `core/governance.md`

### `readme-plans.md`

**Estado recomendado:** Historico operativo

**Condicion para degradarlo:**

- confirmar si ya no aporta contexto sobre planes vigentes mas alla del listado
  historico

---

## Siguiente Paso Recomendado

1. revisar documento por documento del legacy contra casos reales del proyecto
2. validar que `conventions-viewer` renderiza la nueva taxonomia completa
3. identificar que documentos ya son solo referencia historica
4. mover a `legacy` pasivo solo despues de esa verificacion

---

## Conclusion

Todavia **no** es momento de retirar el legacy, pero ya no estamos ante una
reestructura que haya perdido los temas importantes. La omision principal que
existia al inicio ya fue reducida: ahora lo pendiente es verificar cobertura
fina, ejemplos reales y mantenimiento sincronizado entre docs, viewer y flujo
operativo.
