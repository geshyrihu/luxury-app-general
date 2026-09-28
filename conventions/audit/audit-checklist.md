# Audit Checklist

**Ultima revision:** 2026-07-30

## Regla base

Este checklist no sustituye el reporte ni el plan. Solo define el minimo que
ninguna auditoria oficial puede omitir.

## Matriz minima de capas

- [ ] Logica de negocio e invariantes
- [ ] Base de datos e integridad
- [ ] API y contratos
- [ ] Frontend web
- [ ] Mobile
- [ ] Seguridad y permisos
- [ ] Testing y calidad tipada
- [ ] Logging y monitoreo
- [ ] Performance y escalabilidad
- [ ] Integraciones y terceros
- [ ] Documentacion de modulo
- [ ] Convenciones y estructura
- [ ] Reglas de negocio auditables

## Reglas de negocio e invariantes

- [ ] Se identificaron las reglas criticas del modulo antes de cerrar el dictamen
- [ ] Se listaron combinaciones que deben ser unicas
- [ ] Se listaron acciones que no pueden repetirse
- [ ] Se listaron solapamientos o coexistencias prohibidas
- [ ] Se listaron transiciones de estado invalidas
- [ ] Se verifico si cada regla se defiende en UI, backend y persistencia
- [ ] Se probaron escenarios negativos y no solo el caso feliz
- [ ] Se reviso create, edit y flujos equivalentes para evitar validacion incompleta
- [ ] Se reviso riesgo de doble submit, reintento o concurrencia
- [ ] Se reportaron huecos de validacion parcial o solo visual

## Checklist minimo

- [ ] Se leyo `CONVENTIONS.md`
- [ ] Se leyeron documentos del stack aplicable
- [ ] Se validaron naming y estructura
- [ ] Se reviso uso de servicios genericos
- [ ] Se auditaron UI y styles si aplica
- [ ] Se verificaron flujos funcionales minimos del modulo si aplica
- [ ] Se verifico el flujo real de edicion e hidratacion de formulario si existe formulario editable
- [ ] Se valido que selects, autocomplete y wrappers `@ui/*` carguen correctamente en modo edicion
- [ ] Se valido que las interfaces y la nulabilidad declarada coincidan con el acceso real a propiedades
- [ ] Se valido el caso donde el valor editado ya no exista en el catalogo cargado
- [ ] Se valido que el shape real del response backend coincide con lo que espera el frontend
- [ ] Se valido que template, interfaces y payload usen los mismos nombres de campos vigentes
- [ ] Se validaron estados de loading o submitting tanto en success como en error
- [ ] Los hallazgos quedaron clasificados
- [ ] El plan de correccion por fases fue incluido
- [ ] Si hay riesgo alto o legacy fuerte, se marco `requiere plan de migracion`

## Evidencia minima requerida

- [ ] Hallazgos con archivo o ubicacion concreta
- [ ] Clasificacion por severidad
- [ ] Riesgo o impacto por hallazgo material
- [ ] Plan por fases con checklist por tarea
- [ ] Reglas criticas detectadas en lenguaje de negocio
- [ ] Casos negativos auditados o explicitamente pendientes

## Validaciones estructurales reforzadas

- [ ] Se revisaron submodulos, subservicios o carpetas internas relevantes
- [ ] Se reviso documentacion local del modulo y se valido si esta vigente o legacy
- [ ] Se verifico si existen cambios sobre shared, contratos o servicios sensibles
- [ ] Se valido si el modulo usa el catalogo generico oficial antes de crear variantes

## Validaciones de comportamiento reforzadas

- [ ] Se reviso doble submit, reintento o concurrencia cuando la accion lo amerita
- [ ] Se revisaron combinaciones unicas o no repetibles del dominio
- [ ] Se revisaron solapamientos prohibidos y transiciones invalidas
- [ ] Se reviso que backend, UI y persistencia se defiendan entre si en reglas criticas
- [ ] Se reviso si la documentacion publicada coincide con rutas y arquitectura reales

## Capas minimas que no pueden omitirse

- backend / logica de negocio
- base de datos
- API y contratos
- frontend web
- mobile
- flujos CRUD reales
- hidratacion de formularios
- adapters UI y controles de seleccion
- seguridad
- testing
- logging
- performance
- documentacion
- convenciones
- reglas de negocio auditables

## Relacion con legacy

Este checklist absorbe y sintetiza criterios historicos de:

- `conventions/audit-layers-checklist.md`
- `conventions/auditoria-por-rol.md`
