# Auditoria de Modulo - Reclutamiento Candidatos

Fecha: `2026-08-09`
Modulo: `Reclutamiento / Candidates`
Frontend auditado: `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates`
Backend auditado: `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates`
Estado formal: `Auditado y remediado en el alcance revisado`

## Resumen ejecutivo

Se rehizo la auditoria sobre la ruta frontend correcta `client/angular/...`.
La documentacion previa seguia apuntando a `client/luxuryapp/...`, por lo que el
primer ajuste fue realinear la fuente documental al codigo vigente.

En el codigo del frontend activo se confirmaron dos hallazgos materiales:

1. `candidates.routing.ts` cargaba `CandidateList` con `loadComponent`, pero
   los componentes base del feature `candidate/*` no declaraban
   `standalone: true`.
2. el listado desktop seguia usando estados magicos `0/1` para archivar y para
   reflejar el update optimista del estado del candidato.

Ambos hallazgos quedaron remediados en este corte.

## Remediacion aplicada

### Frontend

- se agrego `standalone: true` a:
  - [candidate-list.ts](D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate/candidate-list.ts)
  - [candidate-form.ts](D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate/candidate-form.ts)
  - [candidate-detail.ts](D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate/candidate-detail.ts)
  - [candidate-list-desktop.ts](D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate/desktop/candidate-list-desktop.ts)
  - [candidate-list-mobile.ts](D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate/mobile/candidate-list-mobile.ts)
- se reemplazo el update optimista `status: 1` por `CandidateStatus.Archived`:
  [candidate-list.ts](D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate/candidate-list.ts)
- se reemplazo la condicion visual `item.status === 0` por
  `candidateStatus.Active`:
  [candidate-list-desktop.html](D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate/desktop/candidate-list-desktop.html)
- se alinearon los specs del feature base al contrato tipado actual:
  - [candidate-list.spec.ts](D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate/candidate-list.spec.ts)
  - [candidate-form.spec.ts](D:/repos/luxuryapp-api/client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/candidate/candidate-form.spec.ts)

### Documentacion

- se actualizo el README del modulo para apuntar al frontend correcto:
  [../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md](D:/repos/luxuryapp-api/api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/../../../docs/SharedLuxuryApp/Conventions/20260726-guia-shared-reporte-maestro-legacy.md)
- se actualizo este reporte al estado actual y se elimino la referencia a
  `client/luxuryapp/...`
- se actualizo el plan asociado para dejar solo pendiente la validacion manual
  en runtime

## Backend

En el alcance revisado no se detectaron hallazgos nuevos de contrato o
estructura. La principal desviacion backend era documental: el README del modulo
apuntaba al frontend equivocado.

## Estado final del alcance auditado

- rutas documentadas: correctas
- feature base `candidate/*`: normalizado para `loadComponent`
- estado del candidato: sin magicos `0/1` en el flujo principal revisado
- backend del modulo: sin cambios funcionales requeridos en esta auditoria

## Pendiente real

Solo queda pendiente la validacion manual en runtime con datos reales para
cerrar publicacion:

1. crear candidato
2. crear postulacion con CV
3. mover a `EntrevistaOperaciones`
4. validar aparicion en `interviews`
5. registrar feedback
6. procesar alta desde una postulacion `Seleccionado`

## Criterio de cierre

Si el smoke test manual anterior pasa sin errores de runtime, el modulo puede
considerarse listo para continuar trabajo funcional desde una base documental y
tecnica consistente.
