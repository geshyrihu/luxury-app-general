# Instrucciones para Agentes de IA: Crear Guias Operativas

**Ultima revision:** 2026-07-30
**Deriva de:** [CONVENTIONS.md](../CONVENTIONS.md)

## Proposito

Servir como plantilla extensa para crear guias operativas reutilizables en
casos sensibles. La autoridad vigente para crear o actualizar guias es
[guides-creation-protocol.md](../../conventions/operations/guides-creation-protocol.md);
este documento funciona como apoyo practico y modelo de estructura.

## Flujo base

```text
INPUT
  problema_operativo
  contexto
  casos_conocidos

VALIDACION
  determinar si el problema es repetible, sensible y reusable

DISENO
  patron de diagnostico
  protocolo de intervencion
  validaciones

OUTPUT
  guia operativa en docs/guides/
```

## Estructura minima esperada

1. encabezado y metadata
2. objetivo
3. contexto arquitectonico obligatorio
4. regla de oro
5. alcance permitido
6. alcance prohibido
7. zonas de alta sensibilidad
8. patron de diagnostico
9. protocolo de intervencion
10. patron tecnico recomendado
11. reglas por capa o stack
12. validaciones obligatorias
13. senales de alto riesgo para escalar
14. checklist operativo
15. formato de entrega

## Seccion 1. Encabezado y metadata

```md
# [Nombre descriptivo]

Fecha: `YYYY-MM-DD`
Estado: `Vigente` | `En Piloto` | `Deprecado`
Alcance principal: [modulos/capas]
Sensibilidad: Alta | Media | Baja
```

## Seccion 2. Objetivo

- definir con precision que si puede hacer el agente
- definir con precision que no puede hacer el agente
- mantener la mision acotada y verificable

## Seccion 3. Contexto arquitectonico obligatorio

- declarar rutas reales del proyecto que el agente debe respetar
- declarar reglas vivas de naming, endpoints o shared si aplican
- referenciar `CONVENTIONS.md` y el documento especializado del stack

## Seccion 4. Regla de oro

Debe existir una maxima breve y memorizable. Ejemplo:

```md
Diagnosticar primero, corregir despues.
```

## Seccion 5. Alcance permitido

- listar acciones concretas que el agente si puede ejecutar
- explicar por que son seguras dentro del caso de uso

## Seccion 6. Alcance prohibido

- listar acciones que el agente no puede ejecutar
- incluir cambios sobre shared, negocio sensible o refactors amplios si aplica

## Seccion 7. Zonas de alta sensibilidad

- enumerar modulos, dominios o capas donde el agente debe actuar con maxima
  cautela
- indicar patron defensivo recomendado para esas zonas

## Seccion 8. Patron de diagnostico

La guia debe clasificar el problema en categorias claras. Ejemplo:

| Categoria | Sintoma | Solucion tipica |
|---|---|---|
| `RUTA` | 404 o ruta legacy | corregir endpoint |
| `CONTRATO` | shape distinto | adaptar response |
| `RENDER` | llegan datos pero no se pintan | ajustar condicion o adapter |

## Seccion 9. Protocolo de intervencion

Debe incluir como minimo:

- recoleccion minima de evidencia
- preguntas obligatorias de diagnostico
- orden de soluciones preferidas de menor a mayor riesgo

## Seccion 10. Patron tecnico recomendado

- mostrar ejemplo correcto
- mostrar antipatron
- explicar por que el patron recomendado es mas seguro

## Seccion 11. Reglas por capa o stack

- separar reglas especificas para frontend, backend, mobile o la capa que
  corresponda
- evitar mezclar responsabilidades

## Seccion 12. Validaciones obligatorias

- build o validacion tecnica minima del stack
- scan de encoding si aplica
- confirmacion de que el error original desaparecio
- confirmacion de que el cambio no se expandio fuera del alcance

## Seccion 13. Senales de alto riesgo

La guia debe decir explicitamente cuando detenerse y escalar. Ejemplos:

- el fix toca reglas financieras o de seguridad
- requiere tocar varios modulos o capas sensibles
- exige cambiar shared o contratos publicos
- existe duda sobre compatibilidad legacy obligatoria

## Seccion 14. Checklist operativo

- [ ] lei `CONVENTIONS.md`
- [ ] lei el protocolo oficial de guias
- [ ] identifique el problema exacto
- [ ] clasifique el caso
- [ ] revise si hay zonas de alta sensibilidad
- [ ] confirme que no se activa una senal de alto riesgo
- [ ] aplique la solucion minima posible
- [ ] ejecute validaciones obligatorias
- [ ] documente que se toco y que no se toco

## Seccion 15. Formato de entrega

Toda entrega debe incluir:

- error observado
- capa afectada
- causa raiz
- archivos tocados
- cambio minimo aplicado
- riesgo residual
- validacion ejecutada

## Criterios de calidad

- la guia no contradice `CONVENTIONS.md`
- la guia no duplica otra ya existente
- la guia define limites claros
- la guia incluye diagnostico, protocolo, validaciones y senales de escala
- la guia usa rutas y ejemplos reales

## Ubicacion oficial

```text
docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-guia-[modulo]-[submodulo].md
```

Estructura plana obligatoria (`CONVENTIONS.md` §6ter): cero subcarpetas dentro del submodulo.

## Referencias

- [guides-creation-protocol.md](../../conventions/operations/guides-creation-protocol.md)
- [CONVENTIONS.md](../CONVENTIONS.md)


