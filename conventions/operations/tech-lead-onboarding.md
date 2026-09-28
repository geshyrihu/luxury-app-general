# Tech Lead Onboarding

**Ultima revision:** 2026-07-29

## Proposito

Definir el flujo operativo minimo para que un Tech Lead pueda onboardear a un
developer nuevo usando el sistema oficial de convenciones.

## Resultado esperado

El Tech Lead debe poder dejar a un developer productivo el mismo dia con:

- hooks activos
- rol identificado
- ruta documental clara
- prueba de auditoria ejecutada

## Flujo sugerido de 15 minutos

### Antes

- verificar que el repo este actualizado
- verificar que `.githooks` este configurado
- verificar que los scripts de auditoria existan y sigan siendo validos

### Con el developer

1. configurar hooks
2. identificar rol
3. abrir `CONVENTIONS.md`
4. mostrar el orden de lectura por tarea
5. crear rama de prueba
6. ejecutar o disparar auditoria

## Reglas para el mentor

- no mandar a leer todo indiscriminadamente
- ubicar primero al developer por rol y tarea
- usar la estructura nueva, no solo documentos legacy
- si una auditoria falla, explicar el valor del sistema antes de sugerir bypass
- verificar que el developer entienda como leer el error y donde buscar
  troubleshooting
- cerrar el onboarding solo si el developer ya probo un flujo real de rama +
  hook + auditoria

## Checklist minimo de cierre

- [ ] hooks configurados y verificados
- [ ] rol identificado
- [ ] orden de lectura explicado
- [ ] rama de prueba creada
- [ ] auditoria disparada o ejecutada
- [ ] troubleshooting minimo explicado
- [ ] developer sabe donde pedir ayuda

## Fuentes historicas a preservar

- [tech-lead-onboarding-guide.md](../../tech-lead-onboarding-guide.md)


