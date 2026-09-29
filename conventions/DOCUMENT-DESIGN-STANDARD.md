# 📐 Estándar de Diseño para Documentos MD (Reportes, Planes, Auditorías)

**Vigente desde:** 2026-09-29  
**Referencia:** Plan-Operations-Inspections-Recorridos (modelo canónico)  
**Aplicación:** Obligatoria para todos los documentos en `docs/`, `docs/audit/`, `docs/plans/`, `docs/reporte_maestro/`

---

## 1. Estructura General (11 Secciones Canónicas)

```
1. 🎯 Titulo + Subtitulo (hook emocional o problema)
2. 📋 Metadata (tabla: módulo, tipo, origen, datos, doc referenciado)
3. 🗺️ Panorama en un vistazo (diagrama Mermaid + resumen visual)
4. 📌 Resumen Ejecutivo (Problem Statement + KPIs + Objetivo)
5. 🗺️ Alcance (dentro/fuera + inventario de cambios)
6. 🏛️ Arquitectura & Diseño Técnico (entidades, glosario bilingüe, relaciones)
7. 🛤️ Fases (secuencia con checklists)
8. 🚦 Criterios de Paso (happy/sad/edge paths)
9. ⚠️ Riesgos y Mitigaciones (pre-mortem)
10. 🔗 Dependencias e Impactos
11. 🏁 Cierre Esperado (resumen de éxito)
```

**Nota:** No todos los documentos necesitan las 11. Para auditorías: secciones 1-3 + hallazgos. Para planes: 1-11. Para reportes: 1-3 + hallazgos + recomendaciones.

---

## 2. Convenciones de Emojis (Sistema Visual)

### Roles Funcionales (Headers primarios)
```
🎯 — Objetivo / Meta / Propósito
📋 — Metadata / Inventario / Tabla de contenidos
🗺️ — Panorama / Vista general / Diagrama
📌 — Resumen Ejecutivo / Punto clave
🏛️ — Arquitectura / Diseño / Estructura técnica
🛤️ — Fases / Roadmap / Secuencia
🚦 — Criterios / Gate / Validación
⚠️ — Riesgos / Precauciones / Pre-mortem
🔗 — Dependencias / Impactos / Relaciones
🏁 — Cierre / Conclusión / Éxito esperado
```

### Indicadores de Estado (Dentro de contenido)
```
✅ — Completado / Aprobado / Correcto
❌ — Bloqueado / Incorrecto / No permitido
🟢 — Verde / Bajo riesgo / Interno
🟠 — Naranja / Moderado riesgo / Transición
🟥 — Rojo / Crítico / Bloqueante
🟡 — Amarillo / Advertencia / Revisar
⏳ — En progreso / Pendiente / Futuro
🔄 — Cambio / Iteración / Reintentar
```

### Conceptos de Negocio (Glosario)
```
🧭 — Recorrido / Ruta / Dirección
🔥 — Fuego / Contraincendio / Urgencia
⚙️ — Equipo / Maquinaria / Componente
🏗️ — Activo / Infraestructura / Bien
📋 — Catálogo / Lista / Inventario
✅ — Criterio / Validación / Check
🏃 — Ejecución / Realización / Instancia
📝 — Resultado / Hallazgo / Nota
📷 — Evidencia / Foto / Comprobante
📲 — QR / Código / Etiqueta digital
🛠️ — Orden de Servicio / Trabajo / Reparación
```

---

## 3. Secciones Detalladas

### 3.1 — Título + Subtítulo

**Formato:**
```markdown
# 🎯 Tipo: Descripción Breve (2-5 palabras clave)
### 🔀 Subtítulo: Hook emocional o problema central

Ejemplo:
# 🧭 Plan: Motor Único de Inspecciones Periódicas (Recorridos)
### 🔀 Consolidación de 3 motores en 1 — del tepache regado a un solo camino
```

**Reglas:**
- Usa emoji del rol funcional (🎯, 🧭, 📋, etc.)
- Subtítulo NO es resumen técnico; es la **tensión que resuelve** el documento
- Máximo 10 palabras en título (sin emoji)

---

### 3.2 — Metadata (Tabla)

**Formato obligatorio:**
```markdown
| Campo | Valor |
|---|---|
| Módulo sobreviviente | `OperationsLuxuryApp/Inspections` (backend) + `maintenance.luxuryapp/inspection` (frontend) |
| Tipo | B — Ampliar módulo existente |
| Origen | Requerimiento de negocio directo + hallazgo discovery |
| Módulos retirados | `MaintenanceLuxuryApp/FireInspectionPeriods` (completo) |
| Datos existentes | Ninguno de los 3 motores tiene datos reales en producción |
| Documento de discovery | `docs/modulos-nuevos/recorridos-inspecciones/01b-entidad-estructura.md` |
```

**Campos mínimos:**
- Módulo(s) afectados (ruta exacta)
- Tipo (A/B/C para módulos, o Plan/Audit/Report para documentos)
- Origen (requerimiento, ticket, hallazgo, decisión)
- Datos reales ¿Existen? (Sí/No → impacta migración)
- Documento previo (si aplica)

---

### 3.3 — Panorama en un Vistazo

**Estructura:**
1. Diagrama Mermaid (flowchart/graph)
2. Leyenda de colores (mínimo 2 leyendas)
3. 1-2 líneas de contexto bajo el diagrama

**Ejemplo:**
```markdown
## 🗺️ Panorama en un vistazo

[Mermaid diagram]

> 🟢 **Verde = sobrevive y crece** · 🔴 **Rojo = se retira** (backend + frontend + jobs + rutas)
```

**Reglas de Mermaid:**
- Usa `classDef` para colorear (fill/stroke/color/stroke-width)
- Máximo 1 diagrama por panorama
- Si el diagrama ocupa >40 líneas, divídelo en 2: "Hoy" y "Mañana"

---

### 3.4 — Resumen Ejecutivo

**Subsecciones obligatorias:**

#### Problem Statement
```markdown
**Problem Statement:**

Actualmente, [situación actual] que resulta en [consecuencias], 
cuando [lo que el negocio intenta hacer].
```

#### KPIs
Tabla con columnas: Métrica | Baseline | Target | Timeline | Verificación

```markdown
| Métrica | Baseline | Target | Timeline | Verificación |
|---|---|---|---|---|
| Motores redundantes | 3 | 1 | Fin Fase 1 | `grep` de entidades: 0 referencias |
```

#### Objetivo
```markdown
## Objetivo

Consolidar [qué] en [uno solo/nuevo], que:
1. [Capacidad 1]
2. [Capacidad 2]
```

---

### 3.5 — Alcance (Dentro/Fuera + Checklist Visual)

**Estructura:**
```markdown
## Alcance

**Dentro de alcance:**
- Backend: ruta exacta → qué cambia
- Frontend: ruta exacta → qué cambia
- Jobs/Procesos: cambios concretos
- Migraciones: `ADD COLUMN`/`DROP TABLE` específicos

**Fuera de alcance (confirmado):**
- Cambio A: por qué no entra
- Cambio B: por qué no entra
```

---

### 3.6 — Arquitectura & Diseño Técnico

**Obligatorio: 3 subsecciones**

#### 3.6.1 — Entidades (Tabla)

```markdown
### Entidades (nombres finales, todas bajo `OperationsLuxuryApp/Inspections`)

| Entidad | Reemplaza / absorbe | Campos nuevos clave |
|---|---|---|
| `Inspection` (recorrido/plantilla) | `Inspection` (Recorridos) + `EquipmentInspectionDefinition` (Machinery) | `RecurrenceUnit`, `Assignees` |
```

**Columnas fijas:**
- Entidad (nombre en código, ruta si está lejos)
- Reemplaza / absorbe (qué entidades legado desaparecen)
- Campos nuevos clave (solo los que cambian de estructura, no todos)

#### 3.6.2 — Glosario Bilingüe (ES ↔ Código)

```markdown
| En español | Clase en código | Qué es en negocio |
|---|---|---|
| 🧭 Recorrido | `Inspection` | La plantilla: qué se revisa, con qué frecuencia |
| 🏃 Ejecución del Recorrido | `InspectionExecution` | Una ocurrencia concreta del recorrido en una fecha |
```

**Reglas:**
- Emoji en la primera columna (del glosario de negocio)
- Clase en código con backticks
- Explicación breve, NO estructura técnica
- Orden: de más abstracto a más concreto

#### 3.6.3 — Diagrama de Relaciones (Mermaid)

```markdown
### Diagrama de Relaciones (cómo se conectan entre sí)

[Mermaid flowchart TD con nodos + conexiones]

classDef recorrido fill:#dbeafe,stroke:#2563eb
classDef ejecucion fill:#fef3c7,stroke:#d97706
classDef externo fill:#f3f4f6,stroke:#6b7280
```

**Leyenda bajo diagrama:**
```markdown
> 🔵 **Azul = el "diseño"** (se configura una vez) · 🟠 **Naranja = la "ejecución"** (día a día) · ⚪ **Gris = entidades externas**
```

---

### 3.7 — Matriz de Reglas de Negocio (RN)

**Estructura por niveles:**

```markdown
### 📐 Matriz de Reglas de Negocio

**Nivel 1 — Invariantes de Dominio** (siempre verdadero)

| RN | Regla |
|---|---|
| RN-INS-001 | Todo `Inspection.Equipment` es real y del mismo `CustomerId` |
| RN-INS-002 | Un recorrido pertenece a un único `CustomerId` |

**Nivel 2 — Flujo y Estados** (máquina de estados)

| RN | Regla |
|---|---|
| RN-INS-010 | `Status`: `NotStarted → InProgress → Completed` |

**Nivel 3 — Seguridad / Autorización** (roles)

| RN | Regla | Roles |
|---|---|---|
| RN-INS-020 | CRUD de recorridos | `Administrador`, `GerenteMantenimiento` |

**Nivel 4 — Validación de Datos** (restricciones)

| RN | Regla |
|---|---|
| RN-INS-030 | `EquipmentId` requerido, mismo tenant |
```

**Formato de RN:** `RN-[MODULO 3-4 LETRAS]-[NNN]` (000–999, categorizado por bloque de 10)

---

### 3.8 — Fases (Roadmap + Checklists)

**Estructura por fase:**

```markdown
### Fase 0 — 🧹 Preparación del retiro
[Descripción breve, 1-2 párrafos]

**Checklist:**
- [ ] Conteo de filas = 0 en las tablas legado (dev y producción)
- [ ] Congelado cambios nuevos en módulos a retirar

### Fase 1 — 🏗️ Modelo unificado (entidades + migración)
[Descripción breve]

**Checklist:**
- [ ] Migración aplica y revierte limpio en dev
- [ ] 0 referencias a entidades retiradas (`grep`)
```

**Reglas:**
- Una frase por checklist (máximo 10 palabras)
- Checklist boxes vacíos `[ ]` (no marcados)
- Máximo 10 items por checklist (si >10, divide en 2 checklists)

---

### 3.9 — Criterios de Paso (Happy/Sad/Edge Paths)

**Formato:**

```markdown
## 🚦 Criterios de Paso (por flujo)

**Happy path:** Recorrido semanal con equipos de 2 categorías → job genera → se ejecuta → se notifica.
**PASS si:** los 4 pasos ocurren sin error.

**Sad path:** Responsable no disponible → supervisor reasigna.
**PASS si:** reasignación visible de inmediato.

**Edge path:** Se completa sin hallazgos críticos.
**PASS si:** no se dispara notificación.
```

**Estructura por path:**
1. Línea: tipo de path + descripción del flujo
2. Línea: criterio de aceptación (`PASS si:`)

---

### 3.10 — Riesgos y Mitigaciones (Pre-Mortem)

**Tabla:**

```markdown
| Supuesto fallido | Impacto | Probabilidad | Mitigación | Owner |
|---|---|---|---|---|
| Se pierde FK al renombrar tabla | Órdenes huérfanas | Baja | Migración explícita RENAME, no DROP+ADD | Backend |
| Job unificado no cubre caso `Eventual` | Recorridos nunca se generan | Media | Portar explícitamente de `FireJob` | Backend |
```

**Columnas fijas:**
- Supuesto fallido (qué puede salir mal)
- Impacto (consecuencia si ocurre)
- Probabilidad (Alta/Media/Baja)
- Mitigación (cómo prevenirlo)
- Owner (quién es responsable)

**Regla crítica:** Si hay un supuesto con probibilidad "Alta" o impacto "Pérdida de datos", destacar con `🔴` al inicio de su fila.

---

### 3.11 — Dependencias e Impactos

**Formato:**

```markdown
## 🔗 Dependencias e Impactos

- Depende de: `Equipment`/`InventoryCategory` (ya estable, T-203)
- Depende de: primitivas de notificación (PanicAlerts, HR)
- Impacta: `HangfireJobCatalog.cs` (retiro de 1 job, alta de 1 nuevo)
- Impacta: `ServiceOrder` (rename de FK, sin cambio de comportamiento)
- No impacta: `ApplicationDbContext` de otros módulos
```

**Estructura:**
- `Depende de:` (qué debe estar listo antes)
- `Impacta:` (qué otros módulos se ven afectados, con justificación breve)
- `No impacta:` (aclaraciones explícitas de lo que NO cambia)

---

### 3.12 — Cierre Esperado

**Formato:**

```markdown
## 🏁 Cierre Esperado

Un solo motor de inspecciones periódicas (`OperationsLuxuryApp/Inspections`) 
cubre: [capacidad 1], [capacidad 2], [capacidad 3]. 
`FireInspectionPeriods` y `EquipmentInspections` quedan completamente retirados 
(backend, frontend, job, rutas), sin dejar código muerto — exactamente la 
consolidación que T-203 aplicó a los activos, aplicada ahora a su revisión.
```

**Reglas:**
- Máximo 3-4 líneas
- Resuena con el "Problem Statement" (cierre del círculo)
- Valida logro de KPIs principales

---

## 4. Convenciones de Markdown (Tipografía)

| Uso | Markdown | Resultado |
|---|---|---|
| Énfasis moderado | `*palabra*` | *palabra* |
| Énfasis fuerte | `**palabra**` | **palabra** |
| Código en línea | `` `NombreClase` `` | `NombreClase` |
| Código en bloque | ` ```csharp ... ``` ` | código con colores |
| Ruta de archivo | `` `api/path/to/File.cs` `` | `api/path/to/File.cs` |
| Link a convención | `[API Method Naming](../backend/api-method-naming-conventions.md)` | link interno |
| Tabla | `\| Col \| Col \|` | tabla HTML |
| Diagrama | ` ```mermaid ... ``` ` | gráfico renderizado |
| Lista con checkbox | `- [ ] Tarea` | ☑ interactivo |

**Reglas:**
- Nunca `_palabra_` (subrayado roto en algunos readers); usa `*palabra*`
- Rutas relativas a `conventions/` o `docs/` (no absolutas)
- Links internos siempre con `[Texto](./ruta/relativa.md)`

---

## 5. Colores en Mermaid (Paleta Canónica)

```javascript
// Estilos de clase predefinidos (copiar en cada diagrama):

classDef recorrido fill:#dbeafe,stroke:#2563eb,color:#1e3a8a,stroke-width:2px
classDef ejecucion fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:2px
classDef externo fill:#f3f4f6,stroke:#6b7280,color:#374151,stroke-width:2px
classDef ok fill:#d6f5d6,stroke:#27ae60,color:#145a32,stroke-width:2px
classDef warn fill:#fff3cd,stroke:#d97706,color:#78350f,stroke-width:2px
classDef bad fill:#ffd6d6,stroke:#c0392b,color:#7b241c,stroke-width:2px
classDef retire fill:#ffd6d6,stroke:#c0392b,color:#7b241c,stroke-width:2px
classDef keep fill:#d6f5d6,stroke:#27ae60,color:#145a32,stroke-width:2px

// Aplicar:
class A1,B1 keep
class A2,A3 retire
```

**Leyenda de colores:**
- 🔵 Azul (`recorrido`): concepto de negocio, configuración
- 🟠 Naranja (`ejecucion`): instancia, ejecución, temporal
- ⚪ Gris (`externo`): fuera del módulo, dependencia
- 🟢 Verde (`ok`): completado, éxito
- 🟡 Amarillo (`warn`): en progreso, advertencia
- 🔴 Rojo (`bad`/`retire`): error, eliminación

---

## 6. Checklists Visuales

**Formato standard:**

```markdown
**Checklist:**
- [x] Paso completado
- [ ] Paso pendiente
- [ ] Paso con riesgo
```

**Variación con emojis (dentro de checklist):**

```markdown
**Checklist:**
- [x] ✅ Backend migración aplicada
- [ ] 🧪 Tests pasan (blockeante)
- [ ] 📝 Documentación actualizada
```

**Regla:** Emojis SOLO si >5 items en checklist (ayuda a scanear visualmente).

---

## 7. Estructura de Carpetas para Documentos

```
docs/
├── plans/                          # Planes de implementación
│   └── YYYYMMDD-[nombre]-plan.md
├── audit/                          # Reportes de auditoría
│   └── YYYYMMDD-[escaner]-report.md
├── modulos-nuevos/                 # Discovery de módulos nuevos
│   └── [nombreModulo]/
│       ├── 01-discovery-cuestionario.md
│       ├── 02-business-rules-analysis.md
│       └── 04-implementation-plan.md
├── reporte_maestro/                # Consolidado de hallazgos
│   ├── modulos/
│   │   └── YYYYMMDD-auditoria-[modulo].md
│   └── 20260912-REPORTE-SESION-*.md
└── [ModuloName]/                   # Por módulo
    └── [Feature]/
        └── YYYYMMDD-[descripcion].md
```

---

## 8. Checklist de Calidad antes de Publicar

- [ ] Título + subtítulo capturan la tensión (no es neutral)
- [ ] Metadata completa (módulo, tipo, origen, datos, doc previo)
- [ ] Panorama incluye diagrama Mermaid + 1-2 líneas de contexto
- [ ] Problem Statement es concreto, no genérico
- [ ] KPIs tienen baseline/target/timeline/verificación
- [ ] Objetivo lista 5+ capacidades (máximo 10)
- [ ] Alcance explícita "Dentro" y "Fuera" con justificación
- [ ] Glosario bilingüe tiene ≥8 términos clave con emoji
- [ ] Reglas de Negocio usan formato `RN-XXX-NNN` categorizado
- [ ] Fases tienen 1-2 párrafos + checklist (≤10 items)
- [ ] Criterios de Paso cubren happy/sad/≥1 edge path
- [ ] Riesgos: tabla 5 columnas, ≥3 supuestos, ≥1 rojo si "Crítico"
- [ ] Dependencias lista lo que depende, lo que se impacta, lo que NO cambia
- [ ] Cierre esperado resuena con Problem Statement (círculo cerrado)
- [ ] Mermaid diagrams usan `classDef` con paleta canónica
- [ ] Todos los links internos son relativos (ej. `./path/file.md`)
- [ ] Rutas de código usan backticks (`` `api/path/File.cs` ``)
- [ ] Emojis son consistentes (no varía el emoji entre secciones)

---

## 9. Ejemplos por Tipo de Documento

### Plan de Implementación
Usa todas las 11 secciones. Referencia canónica: `20260929-plan-operations-inspections-recorridos.md`

### Reporte de Auditoría
Secciones 1-3 (Título, Metadata, Panorama) + Tabla de Hallazgos + Recomendaciones

### Discovery de Módulo
Secciones 1, 2, 4 (Título, Metadata, Objetivo, Alcance) + Glosario + Reglas de Negocio

### Análisis de Coherencia
Secciones 1-3 + Tabla de Hallazgos + Acciones Correctivas

---

**Vigente desde:** 2026-09-29  
**Próxima revisión:** 2026-10-31
