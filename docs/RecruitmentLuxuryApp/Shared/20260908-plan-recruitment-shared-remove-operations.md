# Plan de Implementación: Remoción de carpetas vacías Candidate de OperationsLuxuryApp

**Fecha:** 2026-09-08
**Contexto:** Se detectó que existe una carpeta `Candidate` vacía (solo con un `.gitkeep`) en el módulo `OperationsLuxuryApp` tanto en el backend como en el frontend.

## 1. Justificación Normativa
Según `CONVENTIONSFOLDER.MD` (Sección 2.2 Regla de Submódulos):
> "Un submódulo vive en un único módulo."
> "Ejemplo: `Candidates` vive únicamente en `ReclutamientoLuxuryApp`"

La presencia de la carpeta `Candidate` dentro de `OperationsLuxuryApp` contraviene esta regla, ya que el dominio de candidatos pertenece exclusivamente al módulo `ReclutamientoLuxuryApp`. Adicionalmente, infringe la regla de nombramiento en backend que exige que las carpetas de submódulos sean en plural (`Candidates`, no `Candidate`).

## 2. Acciones a realizar (Fase 1: Limpieza)

### Backend
*   **Eliminar carpeta:** `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Candidate` (y su archivo `.gitkeep`).

### Frontend
*   **Eliminar carpeta:** `appsweb/angular/src/app/apps/operations.luxuryapp/candidate` (y su archivo `.gitkeep`).

## 3. Criterios de Aceptación
1.  Las carpetas listadas ya no deben existir en el sistema de archivos.
2.  No debe haber código residual en `OperationsLuxuryApp` que apunte al namespace/ruta de `Candidate` (verificado mediante escaneo).

## 4. Prompt Estructurado de Ejecución
Este prompt está diseñado para ser copiado y pegado en el agente CLI externo (Aider / Claude Code / Cline).

```text
Por favor, ejecuta el siguiente plan de limpieza arquitectónica basado en docs/plans/20260908-plan-remove-candidate-from-operations.md y en las convenciones de CONVENTIONSFOLDER.MD.

TAREAS DE BACKEND:
1. Elimina la carpeta vacía (y su contenido .gitkeep) ubicada en:
   `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Candidate`

TAREAS DE FRONTEND:
2. Elimina la carpeta vacía (y su contenido .gitkeep) ubicada en:
   `appsweb/angular/src/app/apps/operations.luxuryapp/candidate`

REGLAS DE CONVENCIÓN APLICABLES:
- "Un submódulo vive en un único módulo." (CONVENTIONSFOLDER.MD §2.2)
- El concepto Candidates vive exclusivamente en ReclutamientoLuxuryApp.

COMANDOS DE VALIDACIÓN:
1. Corre un script o comando en terminal para verificar que esas carpetas ya no existan.
2. Termina generando un breve reporte indicando la remoción exitosa.
```
