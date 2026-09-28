# Plan de Migración: Estandarización a Carpetas Plurales en Frontend (ReclutamientoLuxuryApp)

**Fecha:** 2026-09-08
**Módulo:** `reclutamiento.luxuryapp` (Frontend)
**Contexto:** El módulo frontend presenta una mezcla de carpetas en singular (que contienen el código real) y carpetas en plural (vacías o "fantasmas", creadas como intento de migración). 

## 1. Justificación Normativa
Según `CONVENTIONSFOLDER.MD` (Sección 2.2, *Regla de Naming: Plural vs Singular*), las carpetas de submódulos deben nombrarse en **plural** para prevenir colisiones de namespace con las clases de entidad, y mantener simetría exacta con el backend.
> "Regla para código NUEVO: siempre plural en carpetas, singular en clases. Código existente: no se migran carpetas sin plan de migración aprobado."

Este documento constituye el **plan de migración aprobado** para corregir esta deuda técnica.

## 2. Alcance de la Migración
Las siguientes carpetas singulares contienen código y deben migrar todo su contenido a sus contrapartes plurales dentro de `appsweb/angular/src/app/apps/reclutamiento.luxuryapp/`:

1. `candidate` ➔ `candidates`
2. `candidate-application` ➔ `candidate-applications`
3. `solicitud-alta` ➔ `solicitud-altas`
4. `solicitud-baja` ➔ `solicitud-bajas`
5. `solicitud-modificacion-sueldo` ➔ `solicitud-modificaciones-sueldo`
6. `solicitud-vacante` ➔ `solicitud-vacantes`
7. `work-position` ➔ `work-positions`

*(Nota: Cualquier otra carpeta que represente una entidad principal y esté en singular, deberá pluralizarse según la misma regla).*

## 3. Fases de Ejecución

### Fase 1: Consolidación de Archivos
Para cada par de carpetas (singular y plural existente):
1. Copiar todos los archivos `.ts`, `.html` y subcarpetas (`interfaces/`, `desktop/`, `mobile/`) desde la carpeta **singular** hacia la carpeta **plural**.
2. Sobrescribir en la carpeta plural si existiera algún archivo residual, dando prioridad al código de la carpeta singular (que es el funcional).

### Fase 2: Actualización de Referencias (Imports y Routing)
1. Buscar y reemplazar en todo el proyecto frontend (`appsweb/angular/src/app/`) las rutas de importación que apuntan a las carpetas singulares. 
   - Ejemplo: `import {...} from '../candidate/...'` ➔ `import {...} from '../candidates/...'`
2. Actualizar las declaraciones de carga perezosa (lazy loading) o rutas en `reclutamiento.routing.ts` (y cualquier archivo `*.routes.ts` aplicable).
   - Ejemplo: `loadChildren: () => import('./candidate/candidate.module')...` ➔ `import('./candidates/...')`

### Fase 3: Limpieza y Eliminación
1. Una vez confirmada la transferencia y que no existen errores de compilación de TypeScript, **eliminar** permanentemente las carpetas en singular listadas en la sección 2.

## 4. Criterios de Aceptación
- [ ] Las carpetas en singular ya no existen en el directorio del módulo.
- [ ] Las carpetas en plural contienen todo el código de los componentes, interfaces y variantes.
- [ ] El comando de compilación del frontend (`ng build` o equivalente, típicamente se revisa que no haya errores de dependencias perdidas en TypeScript) no arroja errores de rutas no encontradas.

---

## 5. Prompt Estructurado de Ejecución (Para Agente CLI)

```text
Por favor, ejecuta el plan de migración de carpetas hacia su forma plural en el frontend de Reclutamiento, basándote en docs/plans/20260908-plan-migracion-frontend-plurales-reclutamiento.md.

UBICACIÓN BASE:
appsweb/angular/src/app/apps/reclutamiento.luxuryapp/

TAREAS:
1. Mueve el contenido completo (archivos y subcarpetas como interfaces/, desktop/, mobile/) de las carpetas singulares a sus respectivas carpetas plurales:
   - candidate/ -> candidates/
   - candidate-application/ -> candidate-applications/
   - solicitud-alta/ -> solicitud-altas/
   - solicitud-baja/ -> solicitud-bajas/
   - solicitud-modificacion-sueldo/ -> solicitud-modificaciones-sueldo/
   - solicitud-vacante/ -> solicitud-vacantes/
   - work-position/ -> work-positions/
   
2. Actualiza los imports relativos y absolutos en todo el proyecto frontend que apuntaban a las carpetas singulares para que ahora apunten a las plurales.
3. Actualiza el archivo de enrutamiento `reclutamiento.routing.ts` (y relacionados) para corregir los paths de carga de componentes.
4. Elimina las carpetas singulares antiguas una vez que todo el contenido fue movido exitosamente.

COMANDOS DE VALIDACIÓN:
1. Ejecuta el compilador de TypeScript (ej. npx tsc --noEmit o el linter de angular) en el frontend para confirmar que no se rompieron los imports.
2. Al finalizar, entrégame un reporte confirmando los reemplazos y la eliminación de las carpetas singulares.
```
