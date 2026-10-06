# Agente 3 - Cirugía de Compilación (Management, HR & Committee)

**Misión:** El módulo `committee.luxuryapp` quedó huérfano en rondas pasadas y tiene errores de compilación. Además, hay errores `NG8001` en Human Resources. Aplica cirugía exacta.

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/management.luxuryapp`
- `appsweb/angular/src/app/modules/human-resources.luxuryapp`
- `appsweb/angular/src/app/modules/committee.luxuryapp` **(NUEVO ASIGNADO)**

## Tareas de Reparación (Basadas en Log de Compilación)

Busca estos archivos específicos dentro de tu dominio y reemplaza exactamente:

1. **Módulo `committee.luxuryapp`:**
   - `board-directors/contact-detail/directorio-contact-detail.html`: Reemplaza `<app-image-fallback>` por `<lux-image-fallback-web>`.
   - `board-directors/directorio.html`: Reemplaza `<app-segmented-control>` por `<lux-segmented-control>`.
   - `collections/committee-cobranza-detail-modal.html`: Reemplaza `<app-icon>` por `<lux-icon>`.
   - `profile/committee-profile.html`: Reemplaza `<app-icon>` por `<lux-icon>`.

2. **Módulo `human-resources.luxuryapp`:**
   - `evaluation/evaluation-template/formulario-plantilla-evaluacion.html`: Reemplaza `<app-icon>` por `<lux-icon>`.
   - `payroll/dashboard/nomina-dashboard.html`: Reemplaza `<app-icon>` por `<lux-icon>`.
   - `salary-projections/salary-projections-hub/salary-projections-hub.html`: Reemplaza TODAS las instancias de `<app-icon>` por `<lux-icon>`.

3. **Verificación Extra de Mapeo de Icono:**
   - Para todos los archivos donde cambies `<app-icon>` a `<lux-icon>`, ASEGÚRATE de abrir su archivo `.ts` correspondiente y cambiar `import { AppIcon } ...` por `import { LxIcon } from '@ui/adaptive/icon/icon'`, y actualizar el array `imports: [..., LxIcon, ...]`.

## Guardado y Commit Aislado
- `git add appsweb/angular/src/app/modules/management.luxuryapp appsweb/angular/src/app/modules/human-resources.luxuryapp appsweb/angular/src/app/modules/committee.luxuryapp`
- **PROHIBIDO** usar `git add .` o `git commit -a`.
- Crea un commit: `fix(hr,committee,mgt): repara NG8001 con reemplazos quirurgicos`