# 📑 ÍNDICE - DOCUMENTACIÓN MÓDULO PRESUPUESTO PROPUESTA

**Última Actualización:** 2026-09-03  
**Versión de Documentación:** 1.0

---

## 🎯 START HERE

Si es **tu primer acceso** al módulo:

1. **Lee primero:** [ANALISIS_EXHAUSTIVO.md](./ANALISIS_EXHAUSTIVO.md) - RESUMEN EJECUTIVO (5 min)
2. **Luego aprende:** Secciones en orden:
   - 📁 ESTRUCTURA DE CARPETAS
   - 🔄 FLUJO GENERAL DE DATOS
   - 📋 MODELOS DE DATOS
   - 🌐 ENDPOINTS API
   - ⚙️ CONDICIONANTES Y REGLAS

---

## 📚 DOCUMENTOS DISPONIBLES

### 1. 📊 ANALISIS_EXHAUSTIVO.md
**El documento principal. Contiene:**
- ✅ Resumen ejecutivo
- ✅ Estructura de carpetas (frontend + backend)
- ✅ Flujo general de datos (3 diagramas detallados)
- ✅ Modelos de datos completos (DTOs, interfaces)
- ✅ 10 endpoints API con ejemplos JSON
- ✅ Condicionantes y reglas de negocio complejas
- ✅ SignalR en tiempo real
- ✅ Gestión de archivos de soporte
- ✅ Exportación a Excel
- ✅ 5 casos de uso reales
- ✅ Restricciones críticas

**Cuándo leerlo:** Siempre. Es la fuente de verdad.

---

### 2. 📋 BITACORA_CAMBIOS.md
**Para dirigir trabajo al agente externo. Contiene:**
- ✅ Plantilla estandarizada de instrucción
- ✅ Tabla de resumen (# | Categoría | Título | Prioridad | Estado)
- ✅ Puntos de entrada principales (gancho de código)
- ✅ Flujo de instrucción → ejecución
- ✅ Ejemplo completo de cómo agregar instrucción
- ✅ Cambios comunes y cómo hacerlos
- ✅ Referencias útiles

**Cuándo usarlo:** Cada vez que tengas una modificación o mejora. Rellena la bitácora, comparte con agente externo.

---

### 3. 📝 log.md
**Bitácora histórica de sesiones. Contiene:**
- ✅ Registro de cambios realizados
- ✅ Decisiones tomadas
- ✅ Problemas encontrados y soluciones
- ✅ Auditorías realizadas

**Cuándo actualizarlo:** Después de cada sesión importante.

---

### 4. 📄 report.md (Anterior)
**Reporte anterior del módulo. Contiene:**
- ✅ Análisis previo
- ✅ Hallazgos históricos

**Estado:** Archivado (referencia histórica)

---

## 🔍 BÚSQUEDA RÁPIDA POR TEMA

### Necesito entender...

| Tema | Dónde Buscarlo | Sección |
|------|---------------|---------| 
| **Estructura de carpetas** | ANALISIS_EXHAUSTIVO.md | 📁 ESTRUCTURA DE CARPETAS |
| **Cómo fluyen los datos** | ANALISIS_EXHAUSTIVO.md | 🔄 FLUJO GENERAL DE DATOS |
| **Los DTOs/modelos** | ANALISIS_EXHAUSTIVO.md | 📋 MODELOS DE DATOS |
| **Endpoints disponibles** | ANALISIS_EXHAUSTIVO.md | 🌐 ENDPOINTS API |
| **Reglas de validación** | ANALISIS_EXHAUSTIVO.md | ⚙️ CONDICIONANTES |
| **Sincronización SignalR** | ANALISIS_EXHAUSTIVO.md | 🔄 SIGNALR |
| **Gestión de archivos** | ANALISIS_EXHAUSTIVO.md | 📁 GESTIÓN DE ARCHIVOS |
| **Exportación Excel** | ANALISIS_EXHAUSTIVO.md | 📊 EXPORTACIÓN A EXCEL |
| **Casos reales de uso** | ANALISIS_EXHAUSTIVO.md | 🎯 CASOS DE USO COMPLEJOS |
| **Restricciones críticas** | ANALISIS_EXHAUSTIVO.md | ⚠️ RESTRICCIONES CRÍTICAS |
| **Cómo agregar cambios** | BITACORA_CAMBIOS.md | 📝 EJEMPLO: AGREGAR INSTRUCCIÓN |
| **Puntos de entrada de código** | BITACORA_CAMBIOS.md | ⚙️ PUNTOS DE ENTRADA PRINCIPALES |

---

## 🎓 GUÍAS POR PERSONA

### 👨‍💼 Gerente de Proyecto
1. Leer: RESUMEN EJECUTIVO en ANALISIS_EXHAUSTIVO.md (5 min)
2. Revisar: Tabla de resumen en BITACORA_CAMBIOS.md
3. Ver: CASOS DE USO COMPLEJOS

**Preguntas que puedo responder:**
- ¿Qué hace el módulo?
- ¿Cuál es el estado?
- ¿Cuánto trabajo hay pendiente?

---

### 👨‍💻 Desarrollador Backend (.NET)
1. Leer: ANALISIS_EXHAUSTIVO.md COMPLETO
2. Enfocarse en:
   - BudgetProposalService.cs (GetProposalsAsync es CRÍTICA)
   - Todos los endpoints API
   - Condicionantes de Aspel
   - Validaciones de estado Draft

3. Herramientas útiles:
   - Examinar BudgetProposalService.cs (línea ~1 a ~400 primero)
   - Luego GetProposalsAsync() (~línea 28-289)
   - Luego UpdateProposalItemAsync() (~línea 430-525)

**Restricciones para tí:**
- ❌ NO modificar sincronización Aspel sin autorización
- ❌ NO cambiar GetLatestMonthlyAmount()
- ✅ Agregar validaciones nuevas (con instrucción)
- ✅ Nuevos campos/DTOs (con instrucción)

---

### 👨‍💻 Desarrollador Frontend (Angular)
1. Leer: ANALISIS_EXHAUSTIVO.md COMPLETO
2. Enfocarse en:
   - presupuesto-propuesta.ts (es el componente main)
   - Flujo de datos (sección 🔄)
   - SignalR (sección 🔄 SIGNALR)
   - Componentes modales

3. Herramientas útiles:
   - presupuesto-propuesta.ts línea ~1 a ~200 (servicios, signals)
   - ~200-500 (lifecycle, carga datos)
   - ~500-750 (cálculos)
   - ~750-1200 (métodos de UI)
   - ~1200-1523 (helpers, totales)

**Restricciones para tí:**
- ❌ NO modificar onLoadData() (sincronización)
- ❌ NO tocar cálculos de promedios
- ✅ Cambios de UI (colores, mensajes)
- ✅ Nuevos modales/diálogos
- ✅ Validaciones adicionales

---

### 🧪 QA / Tester
1. Leer: ANALISIS_EXHAUSTIVO.md secciones:
   - 🎯 CASOS DE USO COMPLEJOS
   - ⚙️ CONDICIONANTES Y REGLAS

2. Crear casos de test para:
   - Crear propuesta nueva
   - Editar múltiples partidas simultáneamente (SignalR)
   - Eliminar partida con/sin actividad
   - Comparación de cuotas (fija e indiviso)
   - Exportación Excel
   - Validaciones de estados Draft/Approved

**Documento de referencia:**
- ANALISIS_EXHAUSTIVO.md → 🎯 CASOS DE USO

---

### 🤖 Agente Externo (Para realizar cambios)
1. **Primero:** Lee ANALISIS_EXHAUSTIVO.md COMPLETAMENTE
2. **Luego:** Consulta BITACORA_CAMBIOS.md para la instrucción específica
3. **Busca en este INDEX.md** si tienes dudas sobre dónde está algo
4. **Referencia:** Los puntos de entrada están en BITACORA_CAMBIOS.md

**Flujo:**
- Recibe instrucción de BITACORA_CAMBIOS.md
- Lee ANALISIS_EXHAUSTIVO.md para contexto
- Implementa cambio
- Verifica criterios de éxito
- Reporta resultado

---

## 📈 ESTADÍSTICAS DEL MÓDULO

| Métrica | Valor |
|---------|-------|
| Líneas código backend | ~1,016 (BudgetProposalService.cs) |
| Líneas código frontend | ~1,523 (presupuesto-propuesta.ts) |
| Endpoints API | 10 |
| DTOs | 15 |
| Componentes frontend | ~10 (principales + modales) |
| Bases de datos involucradas | 1 (ApplicationDbContext) |
| Integraciones externas | 1 (Aspel quotation service) |
| Tecnología tiempo real | SignalR |
| Status | ✅ 100% Funcional |

---

## 🚀 QUICK START CHECKLIST

- [ ] Leer RESUMEN EJECUTIVO en ANALISIS_EXHAUSTIVO.md
- [ ] Entender FLUJO GENERAL DE DATOS
- [ ] Identificar mi rol (Backend/Frontend/QA/Admin)
- [ ] Leer secciones relevantes para mi rol
- [ ] Bookmarkear ANALISIS_EXHAUSTIVO.md
- [ ] Leer BITACORA_CAMBIOS.md si voy a hacer cambios
- [ ] Verificar RESTRICCIONES CRÍTICAS

---

## 🔗 REFERENCIAS EXTERNAS

**Archivos relacionados en el repositorio:**

```
d:\repos\luxuryapp-api\
├── appsweb\angular\src\app\apps\contabilidad.luxuryapp\general-ledger\
│   └── presupuesto-propuesta\              ← ESTAMOS AQUÍ
│       ├── presupuesto-propuesta.ts        ← Frontend principal
│       ├── presupuesto-propuesta.html
│       ├── excel-export.service.ts
│       ├── interfaces\
│       │   └── budget-proposal.model.ts
│       ├── budget-*-dialog.ts\html         ← Modales
│       └── doc\
│           ├── ANALISIS_EXHAUSTIVO.md      ← MAIN DOCS
│           ├── BITACORA_CAMBIOS.md
│           ├── INDEX.md                    ← TÚ ESTÁS AQUÍ
│           └── log.md
│
└── api\LuxuryApp.Application\Modules\
    └── ContabilidadLuxuryApp\
        └── PresupuestoPropuesta\           ← Backend principal
            ├── Services\
            │   └── BudgetProposalService.cs
            ├── DTOs\                       ← Modelos
            ├── Endpoints\
            │   └── BudgetProposalEndPoints.cs
            └── Docs\
                ├── reglas-negocio-presupuesto-propuesta.md
                └── documentacion-presupuesto-propuesta.md
```

**Documentación del proyecto:**
- CONVENTIONS.md (reglas arquitectura)
- CLAUDE.md (instrucciones proyecto)
- docs/audit/ (auditorías)

---

## ❓ PREGUNTAS FRECUENTES

### P1: ¿Por qué no puedo modificar GetProposalsAsync()?
**R:** Contiene la lógica crítica de sincronización Aspel y mapeo de años. Modificarla sin análisis profundo rompe la consistencia de datos. Autorización requiere Ing. Ricardo Marques.

### P2: ¿Cómo agrego un campo nuevo a Partida?
**R:** Ver BITACORA_CAMBIOS.md → "CAMBIOS COMUNES Y CÓMO HACERLOS" → "Agregar Campo Nuevo"

### P3: ¿Dónde están los tests?
**R:** No documentados en este análisis. Ver CONVENTIONS.md § Testing.

### P4: ¿Por qué hay dos propuestas de fechas (fiscalYear, baseBudgetYear)?
**R:** ANALISIS_EXHAUSTIVO.md → "B. LÓGICA DE AÑOS (CRÍTICA)" explica en detalle.

### P5: ¿Cuál es el máximo de partidas que soporta?
**R:** Teóricamente ilimitado, pero UI puede ralentizar con 10,000+ items.

### P6: ¿Cómo agrego una validación nueva?
**R:** BITACORA_CAMBIOS.md → "CAMBIOS COMUNES" → "Agregar Validación Nueva"

---

## 📞 CONTACTO Y ESCALACIÓN

| Situación | Contacto | Referencia |
|-----------|----------|-----------|
| Cambios a servicios críticos | Ing. Ricardo Marques | ANALISIS_EXHAUSTIVO.md § ⚠️ RESTRICCIONES |
| Dudas de implementación | Equipo Backend/Frontend | Este documento + ANALISIS_EXHAUSTIVO.md |
| Nuevos requerimientos | Product Manager | BITACORA_CAMBIOS.md |
| Bugs encontrados | QA + Developer | log.md |

---

## 📋 CHECKLIST ANTES DE HACER CAMBIOS

- [ ] Leí ANALISIS_EXHAUSTIVO.md completamente
- [ ] Identifiqué archivos afectados
- [ ] Entendí flujo completo (entrada → procesamiento → salida)
- [ ] Verifiqué restricciones críticas
- [ ] Agregué instrucción en BITACORA_CAMBIOS.md
- [ ] Definí criterios de éxito
- [ ] Consideré edge cases
- [ ] ¿Necesito autorización? (Si es en sección ⚠️) → Obtuve aprobación

---

**Versión:** 1.0  
**Creado:** 2026-09-03  
**Mantenido por:** Claude Code  
**Estado:** ✅ COMPLETO Y NAVEGABLE
