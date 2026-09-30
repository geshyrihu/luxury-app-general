# Audit by Role

**Ultima revision:** 2026-09-30 (comandos de seguridad agregados a Backend Developer, enlace a security-audit-checklist.md). Anterior 2026-07-30.
**Deriva de:** [CONVENTIONS.md](../CONVENTIONS.md)

## Proposito

Traducir la auditoria de convenciones a criterios verificables por rol, con foco,
 comandos y criterios de paso/fallo.

## Regla base

Este documento no reemplaza la auditoria completa. La complementa con una vista
 ejecutable por perfil.

## Regla operativa

- Ningun rol puede cerrar trabajo sensible con una revision informal.
- Si la tarea fue una auditoria oficial, el cierre sigue
  `audit/audit-module-conventions.md`.
- Los comandos aqui listados son referencia ejecutable por rol, no permiso para
  omitir capas.

## 1. Frontend Senior / UI

### Alcance principal

- frontend Angular
- shared/ui
- styles
- naming y estructura de feature

### Verificaciones clave

- `strict: true`
- cero `any`
- patrones modernos de Angular
- consumo de `shared/ui`
- no imports directos de librerias UI en features fuera de la excepcion vigente
  de `p-table`
- estructura desktop/mobile/interfaces cuando aplique
- respeto a capas de `styles`
- hidratacion real de formularios editables
- selects y autocomplete visibles en modo edicion
- estilos locales y globales alineados con tokens

### Comandos de referencia

```bash
grep '"strict".*true' appsweb/angular/tsconfig.json
grep -r " any" appsweb/angular/src/app/modules --include="*.ts"
grep -r "from ['\"]primeng\|from ['\"]@ionic" appsweb/angular/src/app/modules --include="*.ts"
find appsweb/angular/src/app/modules -name "*wrapper.ts"
grep -r "patchValue\|setValue" appsweb/angular/src/app/modules --include="*.ts"
grep -r "::ng-deep\|styles:\s*\[" appsweb/angular/src/app/modules --include="*.ts" --include="*.scss"
```

### Criterio de paso

- sin violaciones criticas de Angular, UI o styles
- feature structure consistente con patrones vivos
- sin bypass al catalogo UI
- si hay `p-table`, la excepcion se usa solo para la tabla y no para abrir uso
  directo libre de PrimeNG
- formularios editables auditados en create y edit
- controles de seleccion visibles y coherentes con el shape real del response

## 2. Backend Developer

### Alcance principal

- backend .NET
- rutas y contratos
- shared y servicios genericos
- datos, logging, validacion y seguridad base

### Verificaciones clave

- stack backend aprobado
- no dependencias prohibidas
- rutas semanticas y consistentes
- no cambios directos sobre shared sin analisis
- uso de catalogos genericos
- namespaces fijos por tipo de pieza
- DTOs con `Id` heredando de `GuidIdEntityDTO`
- un archivo por DTO
- validacion de invariantes del dominio en backend y persistencia

### Comandos de referencia

```bash
grep -rn "\.ProjectTo<" api/LuxuryApp.Application --include="*.cs"   # esperado 0; IMapper/Profile en memoria NO son hallazgo
grep -r "MediatR\|Dapper" api --include="*.cs"
find api/LuxuryApp.Api -name "*Controller.cs"
grep -r "api/\\[controller\\]\|api/[A-Z]" api --include="*.cs"
grep -r "namespace LuxuryApp.Application" api/LuxuryApp.Application --include="*.cs"
grep -r "public .* Id " api/LuxuryApp.Application --include="*DTO*.cs"
find api/LuxuryApp.Application -name "*Dtos.cs" -o -name "*DTOs.cs"

# Seguridad — ver security-audit-checklist.md para el checklist completo
grep -rn "\.Where(" api/LuxuryApp.Application --include="*.cs" -A2 | grep -B2 "CustomerId =="
grep -rln "FromQuery.*customerId\|FromRoute.*customerId" api/LuxuryApp.Application --include="*.cs"
grep -rn "password\s*=\|apikey\|Bearer \|-----BEGIN" api --include="*.cs" -i
```

### Criterio de paso

- sin violaciones criticas sobre stack, rutas o shared
- cualquier ajuste de contrato sensible queda como plan, no como fix improvisado
- invariantes criticas protegidas fuera del frontend cuando el dominio lo requiera
- hallazgos de seguridad pasan por el veredicto confirmado/necesita validacion/rechazado
  de `security-audit-checklist.md`, no se reportan directo como "incumplimiento critico"

## 3. Mobile Developer

### Alcance principal

- reglas mobile en Angular/Ionic
- patrones Flutter
- touch UX y adaptacion por plataforma

### Verificaciones clave

- no forzar paridad desktop
- uso de patrones moviles aprobados
- reglas Flutter presentes si aplica
- validacion touch, layout y flujo real en escenarios minimos

### Comandos de referencia

```bash
grep -r "isMobile" appsweb/angular/src/app/modules --include="*.html" --include="*.ts"
grep -r "setState\| dynamic" client/flutter --include="*.dart"
```

> Nota: el segundo comando aplica solo cuando exista carpeta Flutter activa en el repositorio.

### Criterio de paso

- la experiencia mobile respeta patrones oficiales
- Flutter no crece por improvisacion
- no existe dependencia en hacks visuales de desktop para resolver mobile

## 4. Full Stack Developer

### Alcance principal

- consistencia cross-stack
- coherencia de endpoints front/back
- estructura de modulo y feature
- consumo correcto de servicios genericos en ambas capas

### Verificaciones clave

- nombres semanticos consistentes
- endpoint frontend registrado y alineado con backend
- no drift entre contratos
- validaciones clave presentes en UI y backend
- flujos editables coherentes entre carga, submit y render
- reglas criticas no defendidas solo de forma visual

### Criterio de paso

- backend y frontend se entienden como un solo sistema
- sin contradiccion entre rutas, DTOs y consumo
- create, edit y casos negativos minimos no presentan drift funcional

## 5. Tech Lead / Architect

### Alcance principal

- auditoria integral
- cumplimiento del flujo oficial
- aprobacion de planes, migraciones y nuevas reglas

### Verificaciones clave

- auditoria completa y bien clasificada
- plan por fases con checklist
- no se activan reglas nuevas que contradigan legacy sin plan de migracion
- indices, docs y viewer quedan alineados cuando cambia el sistema
- si hay reglas de negocio sensibles, quedan explicitadas y auditadas
- si un legacy tenia informacion util, queda absorbida o trazada
- no se toma como valida una referencia vieja solo por existir

### Criterio de paso

- coherencia global del sistema
- criterio uniforme entre agentes
- cambios sensibles bajo control documental

## Cierre por rol

- Frontend Senior / UI:
  - no cierra con solo compilar; debe revisar render real, edit y adapters UI
- Backend Developer:
  - no cierra con solo pasar build; debe revisar contratos, invariantes y shared
- Mobile Developer:
  - no cierra con desktop responsive; debe revisar experiencia mobile real
- Full Stack Developer:
  - no cierra si front y back compilan pero el flujo real esta desalineado
- Tech Lead / Architect:
  - no cierra auditoria si falta reporte, plan, checklist o clasificacion

## Relacion con legacy

Este documento absorbe el hueco principal detectado en:

- `conventions/auditoria-por-rol.md`
- `conventions/gobernanza-convenciones.md`
- `conventions/audit-layers-checklist.md`

Mientras se valida la absorcion completa, esos documentos siguen activos como
legacy controlado.

## Referencias

- [Audit Module Conventions](./audit-module-conventions.md)
- [Governance by Role](../core/governance-by-role.md)
- [Legacy Transition Matrix](../legacy/legacy-transition-matrix.md)



