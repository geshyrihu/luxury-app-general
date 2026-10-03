# Prompt para Agente de Análisis de Componentes UI

## Contexto del Proyecto

**Proyecto**: Luxury App API
**Stack**: Angular (web) + Ionic (móvil)
**Ubicación de componentes**: `appsweb/angular/src/app/shared/ui`
**Fecha**: 2026-10-03

## Objetivo del Análisis

Realizar un análisis exhaustivo del catálogo de componentes UI existentes para:

1. Establecer un estándar de nomenclatura consistente
2. Evaluar la preparación para extraer a una librería reutilizable
3. Planificar la migración a una arquitectura multiplataforma (web + móvil)

## Tareas Específicas

### 1. Inventario de Componentes

- Listar TODOS los componentes en `appsweb/angular/src/app/shared/ui`
- Para cada componente, documentar:
  - Nombre actual del selector
  - Nombre de la clase TypeScript
  - Inputs/Outputs (API pública)
  - Dependencias externas
  - Uso de estilos (SCSS/CSS)
  - Si tiene tests unitarios
  - Frecuencia de uso en la aplicación

### 2. Análisis de Nomenclatura Actual

- Identificar patrones de nomenclatura existentes
- Detectar inconsistencias
- Evaluar si hay prefijos utilizados
- Comparar con estándares de la industria (PrimeNG, Angular Material, Bootstrap)

### 3. Evaluación de Reutilización

- Identificar componentes con alta reutilización
- Detectar componentes con dependencias específicas del dominio
- Evaluar acoplamiento con servicios o estados globales
- Identificar componentes que necesitan refactorización para ser reutilizables

### 4. Análisis de Arquitectura

- Evaluar uso de NgModules vs Standalone Components
- Identificar patrones de inyección de dependencias
- Analizar estrategia de styling (BEM, CSS Modules, etc.)
- Evaluar manejo de temas y variables CSS
- Detectar anti-patrones o malas prácticas

### 5. Preparación para Librería

- Evaluar qué componentes están listos para extraer
- Identificar dependencias que necesitan ser abstraídas
- Detectar código específico de la aplicación que debe separarse
- Evaluar configuración de build y empaquetado

### 6. Análisis para Multiplataforma

- Identificar componentes que funcionan en web y móvil
- Detectar componentes que necesitan adaptación para Ionic
- Evaluar uso de APIs específicas del navegador
- Analizar responsive design actual

## Criterios de Éxito

El análisis debe producir:

1. **Inventario completo** en formato tabular o JSON
2. **Matriz de nomenclatura** con propuesta de renombrado
3. **Reporte de dependencias** entre componentes
4. **Lista de componentes priorizados** para migración
5. **Plan de acción** con fases y estimaciones
6. **Identificación de riesgos** y mitigaciones

## Formato de Salida

### Estructura de Reporte

```markdown
# Análisis de Componentes UI - Luxury App

## 1. Resumen Ejecutivo

- Total de componentes: X
- Componentes listos para librería: X
- Componentes que necesitan refactorización: X
- Prioridad general: Alta/Media/Baja

## 2. Inventario Detallado

### Componente: [nombre]

- **Selector actual**: `<current-selector>`
- **Selector propuesto**: `<lux-proposed>`
- **Clase**: `CurrentComponent` → `LuxProposedComponent`
- **API Pública**:
  - Inputs: `@Input() prop: type`
  - Outputs: `@Output() event = new EventEmitter<type>()`
- **Dependencias**: [lista]
- **Uso en app**: X veces
- **Estado**: Listo/Refactorizar/Deprecar
- **Notas**: [observaciones]

## 3. Análisis de Nomenclatura

- Patrones detectados
- Inconsistencias encontradas
- Propuesta de estándar

## 4. Matriz de Dependencias

- Componentes independientes
- Componentes con dependencias internas
- Componentes con dependencias externas

## 5. Plan de Migración

### Fase 1: Quick Wins (1-2 semanas)

- Componentes simples sin dependencias
- Estimación de esfuerzo

### Fase 2: Componentes Complejos (2-4 semanas)

- Componentes con dependencias
- Refactorización necesaria

### Fase 3: Extracción a Librería (4-6 semanas)

- Configuración de librería
- Migración de componentes
- Testing y documentación

## 6. Riesgos y Mitigaciones

- Riesgo 1: [descripción] → Mitigación: [acción]
- Riesgo 2: [descripción] → Mitigación: [acción]

## 7. Recomendaciones

1. [Recomendación específica]
2. [Recomendación específica]
3. [Recomendación específica]
```

## Instrucciones de Ejecución

1. **Exploración completa**: Leer todos los archivos en el directorio `shared/ui`
2. **Análisis de código**: Examinar TypeScript, HTML, SCSS, y tests
3. **Búsqueda de uso**: Buscar referencias en toda la aplicación
4. **Análisis de dependencias**: Identificar imports y servicios utilizados
5. **Evaluación de calidad**: Revisar follows best practices
6. **Generación de reportes**: Producir documentación estructurada

## Herramientas Sugeridas

- Lectura recursiva de directorios
- Búsqueda de patrones en código
- Análisis de AST (Abstract Syntax Tree) si es posible
- Generación de gráficos de dependencias
- Análisis de cobertura de tests

## Consideraciones Adicionales

- Priorizar componentes de alto uso
- Identificar componentes críticos para el negocio
- Evaluar impacto en performance
- Considerar accesibilidad (a11y)
- Evaluar internacionalización (i18n)

## Entregables Esperados

1. Documento de análisis completo (Markdown)
2. Inventario en formato JSON/CSV
3. Matriz de nomenclatura
4. Diagrama de dependencias (si es posible)
5. Plan de acción detallado
6. Lista de tareas priorizadas para el backlog

---

**Nota**: Este análisis debe ser lo suficientemente detallado para que un equipo de desarrollo pueda ejecutar la migración sin ambigüedades.
</content>
