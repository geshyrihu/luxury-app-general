# Conventions Viewer: Actualización FASE 0 (2026-07-30)

**Fecha:** 2026-07-30  
**Estado:** Vigente  
**Componente:** `appsweb/angular/src/app/modules/admin.luxuryapp/admin-wrapper/conventions-viewer/`

---

## Cambios Realizados

### 1. Nuevo Task Type: `creacion-modulo-fase-0`

**Ubicación:** `conventions-viewer.utils.ts`

Se agregó un nuevo tipo de tarea especializado en la creación de módulos bajo el protocolo FASE 0:

```typescript
export type ConventionTaskType =
  | 'implementacion-backend'
  | 'implementacion-frontend'
  | 'implementacion-flutter'
  | 'auditoria'
  | 'documentacion'
  | 'operacion-transversal'
  | 'creacion-modulo-fase-0';  // ← NUEVO
```

**Etiqueta visible:** "Creacion Modulo (FASE 0)"

---

### 2. Actualización de Labels

**Ubicación:** `conventions-viewer.utils.ts` → `taskTypeLabel()`

Se agregó la etiqueta para el nuevo tipo de tarea:

```typescript
'creacion-modulo-fase-0': 'Creacion Modulo (FASE 0)',
```

**Efecto:** El filtro "Por Tipo de Tarea" ahora muestra "Creacion Modulo (FASE 0)" como opción.

---

### 3. Orden de Task Types (prioridad)

**Ubicación:** `conventions-viewer.ts` → `taskTypes` signal

Se reordenó la lista de tipos de tarea para mostrar FASE 0 primero (máxima visibilidad):

```typescript
taskTypes = signal<ConventionTaskType[]>([
  'creacion-modulo-fase-0',          // ← PRIMER LUGAR (prioritario)
  'implementacion-backend',
  'implementacion-frontend',
  'implementacion-flutter',
  'auditoria',
  'documentacion',
  'operacion-transversal',
]);
```

**Efecto:** Los filtros y listados muestran "Creacion Modulo (FASE 0)" al principio.

---

### 4. Nuevas Reglas de Convención sobre FASE 0

**Ubicación:** `conventions-viewer.service.ts` → Array `conventions`

Se agregaron 3 nuevas reglas de convención:

#### Regla 1: FASE 0 es Obligatorio

```
ID: operations-fase-0-mandatory
Título: "FASE 0: Business Rules Discovery es obligatoria antes de cualquier plan"
Severidad: CRÍTICA
Domain: operations
TaskType: creacion-modulo-fase-0
```

**Descripción:** FASE 0 incluye Problem Statement, Matriz de Reglas (4 niveles), y Pre-Mortem.

**Documentos fuente:**
- `conventions/operations/business-rules-discovery-phase-0.md`
- `conventions/operations/plan-creation-protocol.md`
- `CONVENTIONS.md`

---

#### Regla 2: 4 Niveles Jerárquicos de RN

```
ID: operations-business-rules-four-levels
Título: "Reglas de Negocio: 4 niveles jerárquicos obligatorios (RN-MOD-NNN)"
Severidad: CRÍTICA
Domain: operations
TaskTypes: creacion-modulo-fase-0, auditoria
```

**Descripción:** Nivel 1 (Invariantes), Nivel 2 (Flujo/Estados), Nivel 3 (Seguridad/RBAC), Nivel 4 (Validación de Datos).

**Documentos fuente:**
- `conventions/operations/business-rules-discovery-phase-0.md`
- `conventions/operations/audit-agent-instructions.md`

---

#### Regla 3: Trazabilidad FASE 0 → Código

```
ID: audit-fase-0-traceability
Título: "Auditoria verifica trazabilidad: FASE 0 → Plan → Codigo"
Severidad: ALTA
Domain: audit
TaskTypes: auditoria, creacion-modulo-fase-0
```

**Descripción:** Verifica que cada RN está en FASE 0 → plan → código.

**Documentos fuente:**
- `conventions/operations/audit-agent-instructions.md`
- `conventions/audit/audit-module-conventions.md`

---

## Cómo Usar el Viewer Actualizado

### Filtrar por FASE 0

1. Abre `/admin/conventions-guide` (conventions-viewer)
2. Haz clic en pestaña **"Por Tipo de Tarea"**
3. Selecciona **"Creacion Modulo (FASE 0)"**
4. Aparecerán las 3 nuevas reglas + cualquier otra regla relacionada

### Búsqueda por FASE 0

1. Usa la barra de búsqueda
2. Escribe: `FASE 0`, `Business Rules`, `RN-MOD` o `cuatro niveles`
3. Aparecerán las 3 nuevas reglas

### Navegar por Severidad

Las 3 reglas están etiquetadas:
- 2 reglas **CRÍTICA** (FASE 0 obligatorio, 4 niveles)
- 1 regla **ALTA** (trazabilidad auditoria)

---

## Cambios de Datos (Modelo de Convenciones)

| Campo | Valor | Cambio |
|:---|:---|:---|
| `id` | `operations-fase-0-mandatory` | Nuevo |
| `title` | "FASE 0: Business Rules Discovery..." | Nuevo |
| `severity` | CRÍTICA | Nuevo |
| `domain` | operations | Nuevo |
| `taskTypes` | ['creacion-modulo-fase-0'] | Nuevo tipo |
| `technologies` | ['Documentacion'] | Nuevo |
| `sourceDocuments` | Links a FASE 0 | Nuevo |

---

## Verificación

### Checklist de Actualización

- [x] Nuevo taskType `creacion-modulo-fase-0` agregado
- [x] Etiqueta "Creacion Modulo (FASE 0)" configurada
- [x] TaskType reordenado al inicio (prioridad alta)
- [x] 3 nuevas reglas agregadas al service
- [x] Todas las reglas referencia documentos reales
- [x] Links a `business-rules-discovery-phase-0.md` incluidos
- [x] Ejemplos de código agregados

### Verificación Técnica

```bash
# Verificar que el viewer compila sin errores
ng build --project admin.luxuryapp

# Verificar que el servicio tiene las reglas
grep -n "operations-fase-0-mandatory" \
  appsweb/angular/src/app/modules/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.service.ts

# Verificar que el nuevo tipo está en utils
grep -n "creacion-modulo-fase-0" \
  appsweb/angular/src/app/modules/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts
```

---

## Impacto Esperado

### ✅ Para Agentes (Claude, Codex, etc.)

- Pueden buscar "FASE 0" en el viewer y ver las 3 nuevas reglas
- Las reglas apuntan directamente a documentos de FASE 0
- El viewer ahora es fuente visual de FASE 0 (no solo documental)

### ✅ Para Developers

- Cuando consulten el viewer, verán FASE 0 como categoría prioritaria
- Las reglas sobre 4 niveles de RN tienen ejemplos claros
- La trazabilidad FASE 0 → código está documentada

### ✅ Para Tech Lead

- El viewer ahora refleja la integración FASE 0 formal
- Las reglas son verificables (CRÍTICA y ALTA)
- Sincronización documental garantizada

---

## Proximas Revisiones

### Si cambia FASE 0:

1. Actualizar `conventions/operations/business-rules-discovery-phase-0.md`
2. Actualizar las 3 reglas en `conventions-viewer.service.ts` si es necesario
3. Recompilar el viewer (`ng build`)

### Si se agregan nuevas reglas:

Seguir el modelo de las 3 reglas agregadas:
- ID en kebab-case
- Título claro y preciso
- Severidad asignada (CRÍTICA/ALTA/MEDIA/BAJA)
- Domain correcto
- TaskTypes incluye `creacion-modulo-fase-0` si aplica
- sourceDocuments con URLs reales

---

## Archivos Modificados

| Archivo | Línea | Cambio | Status |
|:---|:---|:---|:---|
| `conventions-viewer.utils.ts` | 18-20 | Agregó `creacion-modulo-fase-0` a type | ✅ |
| `conventions-viewer.utils.ts` | 64 | Agregó label para nuevo tipo | ✅ |
| `conventions-viewer.ts` | 56-62 | Reordenó taskTypes (FASE 0 primero) | ✅ |
| `conventions-viewer.service.ts` | 756-880 | Agregó 3 nuevas reglas | ✅ |

---

## Referencias Documentales

- [business-rules-discovery-phase-0.md](../operations/business-rules-discovery-phase-0.md) ← Fuente oficial
- [CONVENTIONS.md §5.8-5.9](../CONVENTIONS.md) ← Políticas de auditoría y operación
- [Conventions Viewer Governance](./conventions-viewer-governance.md) ← Reglas del viewer

---

## Estado de Vigencia

**Última revisión:** 2026-07-30  
**Próxima revisión:** Cuando cambie FASE 0 o se integren nuevas reglas  
**Aprobado por:** Tech Lead

---

*Documento: CONVENTIONS_VIEWER_FASE_0_UPDATE.md*  
*Versión: 1.0*  
*Ubicación: conventions/ui/*


