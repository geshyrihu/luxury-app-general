# PROMPT: ANÁLISIS DE CATÁLOGO DE COMPONENTES UI

## CONTEXTO

Proyecto: Luxury App
Stack: Angular (web) + Ionic (móvil)
Ruta: D:\repos\luxuryapp-api\appsweb\angular\src\app\shared\ui
Objetivo: Establecer estándar de nomenclatura y preparar librería reutilizable

## TU ROL

Eres un arquitecto de software especializado en Angular y sistemas de diseño.

## TAREA PRINCIPAL

Analiza TODO el código en `appsweb/angular/src/app/shared/ui` y genera un reporte completo.

## FASES DE EJECUCIÓN

### FASE 1: INVENTARIO

Para CADA componente encontrado:

- Selector actual y clase TypeScript
- Inputs/Outputs (API pública completa)
- Dependencias (imports, servicios inyectados)
- Frecuencia de uso en la aplicación (grep_search)
- Si tiene tests unitarios
- Estado: 🟢 Listo / 🟡 Refactorizar / 🔴 Deprecar

### FASE 2: ANÁLISIS DE NOMENCLATURA

- Identifica patrones actuales (prefijos, convenciones)
- Detecta inconsistencias
- Propuesta: Estándar `lux-` para todos los componentes
- Tabla de mapeo: nombre actual → nombre propuesto

### FASE 3: EVALUACIÓN DE REUTILIZACIÓN

- ¿Qué componentes son verdaderamente reutilizables?
- ¿Cuáles tienen dependencias del dominio específico?
- ¿Qué necesita ser abstraído para crear una librería?
- Identifica componentes con lógica de negocio embebida

### FASE 4: ANÁLISIS TRANSVERSAL

- Matriz de dependencias entre componentes
- Duplicación de código identificada
- Complejidad por componente
- Patrones de styling (BEM, CSS variables, etc.)

### FASE 5: PLAN DE MIGRACIÓN

- Fase 1: Quick Wins (componentes simples, alto uso)
- Fase 2: Core Components (formularios, datos, navegación)
- Fase 3: Complex Components (lógica compleja, dependencias)
- Fase 4: Mobile Adaptation (Ionic/móvil)
- Estimación de esfuerzo por fase

### FASE 6: RIESGOS

- Riesgos técnicos identificados
- Riesgos de negocio
- Estrategias de mitigación

## FORMATO DE SALIDA

```markdown
# ANÁLISIS DE COMPONENTES UI - LUXURY APP

## Resumen Ejecutivo

- Total componentes: X
- Listos para librería: X (X%)
- Necesitan refactor: X (X%)
- Horas estimadas: X

## Inventario Detallado

[Tabla completa de cada componente con toda la info]

## Propuesta de Nomenclatura

| Actual     | Propuesto  | Justificación |
| ---------- | ---------- | ------------- |
| app-button | lux-button | Consistencia  |

## Matriz de Dependencias

[Grafo o tabla de dependencias]

## Plan de Migración

### Fase 1 (Semana 1-2)

- [ ] Componente A
- [ ] Componente B

### Fase 2 (Semana 3-4)

- [ ] Componente C

## Riesgos y Mitigaciones

- Riesgo 1 → Mitigación
- Riesgo 2 → Mitigación

## Recomendaciones

1. [Acción específica]
2. [Acción específica]
```

CRITERIOS DE CALIDAD
✅ Exhaustivo: analiza TODOS los componentes
✅ Específico: nombres exactos, no generalices
✅ Cuantitativo: usa números y métricas
✅ Accionable: cada recomendación ejecutable
✅ Priorizado: ordena por impacto y esfuerzo
✅ Honesto: señala problemas reales
ENTREGABLE
Genera el reporte completo en: docs/component-analysis-report.md
INICIO
COMIENZA AHORA. Sigue las fases en orden y produce el reporte completo.
