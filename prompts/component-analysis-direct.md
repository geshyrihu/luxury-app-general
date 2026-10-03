# Prompt Directo para Análisis de Componentes

## Contexto

Proyecto: Luxury App (Angular + Ionic)
Ruta: `appsweb/angular/src/app/shared/ui`
Objetivo: Establecer estándar de nomenclatura y preparar librería reutilizable

## Tarea Principal

Analiza TODO el código en `appsweb/angular/src/app/shared/ui` y genera un reporte completo que incluya:

### 1. Inventario Completo

Para CADA componente encontrado:

- Selector actual y clase
- Inputs/Outputs (API pública)
- Dependencias (imports, servicios)
- Número de veces que se usa en la app
- Estado: Listo/Refactorizar/Deprecar

### 2. Análisis de Nomenclatura

- ¿Qué patrones de nombres existen actualmente?
- ¿Hay prefijos inconsistentes?
- Propuesta: Estándar `lux-` para todos los componentes
- Tabla de mapeo: nombre actual → nombre propuesto

### 3. Evaluación de Reutilización

- ¿Qué componentes son verdaderamente reutilizables?
- ¿Cuáles tienen dependencias del dominio específico?
- ¿Qué necesita ser abstraído para crear una librería?

### 4. Plan de Acción

- Fase 1: Componentes simples (quick wins)
- Fase 2: Componentes complejos
- Fase 3: Extracción a librería Angular
- Fase 4: Adaptación para Ionic/móvil

### 5. Riesgos

- ¿Qué puede salir mal?
- ¿Cómo mitigar cada riesgo?

## Formato de Salida

```markdown
# Análisis de Componentes UI

## Resumen

- Total componentes: X
- Listos para librería: X
- Necesitan refactor: X

## Inventario

[Tabla detallada de cada componente]

## Propuesta de Nomenclatura

| Actual     | Propuesto  | Justificación |
| ---------- | ---------- | ------------- |
| app-button | lux-button | Consistencia  |
| ...        | ...        | ...           |

## Plan de Migración

### Fase 1 (Semana 1-2)

- [ ] Componente A
- [ ] Componente B

### Fase 2 (Semana 3-4)

- [ ] Componente C
- [ ] Componente D

## Recomendaciones

1. [Acción específica]
2. [Acción específica]
```

## Instrucciones Clave

1. **Sé exhaustivo**: Lee TODOS los archivos, no solo los principales
2. **Sé específico**: Nombra componentes exactos, no generalices
3. **Sé práctico**: Prioriza por impacto y esfuerzo
4. **Sé accionable**: Cada recomendación debe poder ejecutarse inmediatamente
5. **Busca patrones**: Identifica problemas recurrentes
6. **Evalúa calidad**: Revisa si sigue buenas prácticas de Angular

## Criterios de Evaluación

Para cada componente, evalúa:

- ✅ Sigue Angular best practices
- ✅ Tiene tests unitarios
- ✅ Está bien documentado
- ✅ Es accesible (a11y)
- ✅ Es responsive
- ✅ Tiene baja complejidad
- ✅ Es reutilizable

## Output Esperado

Un documento Markdown completo que pueda usarse como:

- Base para refactorización
- Guía para el equipo de desarrollo
- Input para planificación de sprints
- Documentación técnica del proyecto

---

**Ejecuta este análisis ahora y genera el reporte completo.**
</content>
