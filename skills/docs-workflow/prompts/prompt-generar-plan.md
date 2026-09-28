# 🎯 Prompt: Generar Plan de Implementación

Crea un plan de implementación detallado para un módulo o feature LuxuryApp. Usa `CONVENTIONS.md §11` para formato y `templates/template-plan-modulo.md` para la estructura de salida.

> [!IMPORTANT]
> Este prompt produce planes **implementables**. Cada sección debe poder ejecutarla un desarrollador sin preguntar "¿cómo?".

---

## Proceso

### 1. Análisis de contexto
- Revisa modelos existentes para reutilizar (`Equipment`, `Property`, `Customer`, etc.)
- Define ubicación exacta en el repo (carpeta `Tenant/Operations/[Modulo]/`)
- Documenta decisiones de reutilización obligatorias

### 2. Diseño del dominio
Por cada entidad nueva: campos, tipos, índices, reglas de negocio.

### 3. Enums y máquina de estados
Define enums + `stateDiagram-v2` Mermaid para entidades con workflow.

### 4. Diagramas Mermaid (obligatorios)
- `erDiagram` de entidades
- `flowchart` con swimlanes por actor
- `sequenceDiagram` con autonumber
- `stateDiagram-v2` para estados

### 5. Contratos DTO
Request y Response por cada endpoint.

### 6. Servicios
Interfaz + métodos + responsabilidades.

### 7. Endpoints
Path completo, método HTTP, permisos por rol (`ApplicationRoleEnum`).

### 8. Frontend por app (CONVENTIONS.md §14 y §15)
Por cada pantalla, especificar:
- App destino (`resident.luxuryapp`, `security.luxuryapp`, `admin.luxuryapp`, etc.)
- Nombre del componente
- Si va a `shared/ui`
- Patrón mobile según §15.2 (A/B/C). Si es listado CRUD → Patrón B obligatorio
- Componentes web y mobile específicos

### 9. Background jobs
Schedule, acción, trigger.

### 10. Fases con checkboxes `- [ ]`

**Regla obligatoria:** Cada tarea debe tener `- [ ]` para tracking de progreso:

```markdown
- [ ] Crear entidad `Visitor`
- [x] Crear endpoint `POST /api/access-controls/visits`  ← ya completada
- [ ] Crear componente `visit-form` en `resident.luxuryapp/`
```

Calcular progreso general: suma de `[x]` / total de `[ ]`.

### 11. Riesgos y dependencias
- Riesgos con probabilidad, impacto, mitigación
- Dependencias externas (librerías, APIs) con estado de aprobación

---

## Antipatrones a evitar

| # | Error | Solución |
|---|-------|----------|
| 1 | Filename sin fecha | `YYYYMMDD-descripcion-plan.md` |
| 2 | Fecha ISO en contenido | Usar `dd-MMM-yy` (§11) |
| 3 | Cero diagramas Mermaid | ER + flowchart + sequence + state |
| 4 | Tareas sin checkbox | Cada tarea con `- [ ]` |
| 5 | Sin reutilización explícita | Tabla de modelos existentes |
| 6 | Sin riesgos | Tabla con mitigación |
| 7 | Frontend sin app destino | Mapear cada pantalla a su app (§14) |
| 8 | Mobile sin patrón definido | Indicar §15.2 (A/B/C) por cada pantalla |
| 9 | Sin móvil en listados CRUD | Patrón B obligatorio (§15.4) |
| 10 | DynamicDialog en mobile | Usar `ion-modal` via `IonicDialogModal` (§15.6) |
