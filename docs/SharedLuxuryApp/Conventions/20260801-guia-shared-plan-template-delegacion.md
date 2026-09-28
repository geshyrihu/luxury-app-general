# PLANTILLA: Plan de Documentación de Módulo (Reutilizable)

**Propósito:** Template para crear planes antes de delegar a OpenCode.

**Cómo usar:** 
1. Copiar este archivo
2. Reemplazar `[MODULO]`, `[modulo]`, `[ModuleLuxuryApp]` con valores reales
3. Personalizar criterios de validación por módulo
4. Entregar a OpenCode con este template completo

---

# PLAN: Documentar [MODULO] (YYYY-MM-DD)

**Estado:** PENDING → IN_PROGRESS → APPROVED → EXECUTING → COMPLETED

## Metadata Crítica

```
Creado por:        Claude Code
Ejecutará:         OpenCode (o KiloCode si feedback)
Auditor:           Claude Code
Aprobó:            geshyrihu (usuario)
Fecha creación:    YYYY-MM-DD HH:MM
Módulo destino:    api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/
                   client/angular/src/app/apps/[modulo].luxuryapp/
Plantilla base:    docs/audit/EJEMPLO_AUDITORIA_CANDIDATES.md
Tiempo estimado:   11.5 horas (9h OpenCode + 2.5h Claude auditor)
Control log:       docs/implementation-control/[MODULO]_YYYYMMDD_CONTROL_LOG.md
```

**IMPORTANTE:** 
- Cada paso tiene CRITERIO DE VALIDACIÓN explícito
- Si criterio = NO → ABORTAR, reportar a Claude, esperar feedback
- Si criterio = SÍ → guardar resultado, continuar

---

## FASE 1: Auditoría Real del Módulo (Est. 4 horas OpenCode + 1h Claude)

### Objetivo
Ejecutar auditoría exhaustiva del módulo [MODULO] usando AUDIT_PROMPT_COMPREHENSIVE.md como guía. Resultado: archivo de auditoría con hallazgos reales + matriz de permisos + 6 tipos de errores buscados.

### Paso 1.1: Exploración de Endpoints
**Tiempo:** 30 min

**Hacer:**
```bash
# Comando 1: Buscar endpoints en backend
grep -r "public.*Async" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/ \
  | grep -E "(Post|Get|Put|Delete|Patch)" \
  | head -20
# Guardar resultado en archivo temporal: /tmp/endpoints_[modulo].txt

# Comando 2: Contar endpoints totales
grep -r "public.*Async" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/ \
  | wc -l
# Resultado esperado: ≥5
```

**Criterio de Validación:**
- [ ] ≥5 endpoints encontrados
- [ ] Archivo temporal creado: `/tmp/endpoints_[modulo].txt`
- [ ] Cada endpoint tiene firma clara (Get, Post, etc.)

**Si FALLA:** 
- Revisar si carpeta ModuleLuxuryApp existe
- Grep pattern correcta
- Reportar error a Claude

**Si PASA:** 
- Guardar lista en control_log
- Continuar a 1.2

---

### Paso 1.2: Matriz de Permisos
**Tiempo:** 1 hora

**Hacer:**
1. Para cada endpoint encontrado en 1.1, buscar `[Authorize]` attribute:
   ```bash
   grep -B5 "public.*Async.*[endpoint_name]" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/Endpoints/*.cs
   ```

2. Crear matriz en formato tabla:
   ```
   | Endpoint | Método | [Authorize] | Roles | Política |
   |----------|--------|-----------|-------|----------|
   | GetAll   | GET    | Sí        | User  | [Policy] |
   ```

3. Verificar: ≥5 endpoints × ≥3 roles

**Criterio de Validación:**
- [ ] Tabla generada con ≥5 endpoints
- [ ] ≥3 roles diferentes identificados
- [ ] Cada endpoint tiene política O [Authorize] claros
- [ ] Matriz guardada en control_log

**Si FALLA:** 
- Revisar endpoints nuevamente
- Algunos pueden no tener [Authorize] (hallazgo importante)
- Reportar a Claude

**Si PASA:** 
- Guardar matriz en control_log
- Continuar a 1.3

---

### Paso 1.3: Búsqueda de 6 Tipos de Errores
**Tiempo:** 1.5 horas

Usar AUDIT_CHECKLIST_COMPLETO.md como referencia. Buscar en backend:

#### Error Tipo 1: Eliminación en Cascada No Controlada
```bash
grep -r "OnDelete.*Cascade" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/
# ¿Hay FK sin cascade controlado?
# ¿Hay entidad principal que se borra sin validar dependientes?
```
**Hallazgo esperado:** SÍ/NO + línea específica

#### Error Tipo 2: Duplicados/Índices UNIQUE Faltantes
```bash
grep -r "Email\|Username\|Code" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/
# ¿Campo único sin índice?
# ¿Validación en application pero no en BD?
```
**Hallazgo esperado:** SÍ/NO + línea específica

#### Error Tipo 3: Transiciones de Estado Inválidas
```bash
grep -r "enum.*Status\|State" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/
# ¿Puede transicionar de cualquier estado a cualquier estado?
# ¿Falta validación?
```
**Hallazgo esperado:** SÍ/NO + línea específica

#### Error Tipo 4: Pre-requisitos Faltantes
```bash
grep -r "if.*null\|if.*== 0" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/Services/
# ¿Hay flujo que asume entidad existe pero no la valida?
```
**Hallazgo esperado:** SÍ/NO + línea específica

#### Error Tipo 5: Inconsistencias Front/Back
```bash
# Buscar en DTOs vs Frontend
grep -r "Required\|MaxLength" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/
# ¿Validación coincide con frontend?
```
**Hallazgo esperado:** SÍ/NO + línea específica

#### Error Tipo 6: Seguridad/Autorización
```bash
grep -r "\[Authorize\]\|Policy" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/Endpoints/
# ¿Hay endpoint sin [Authorize]?
# ¿Hay endpoint con [Authorize] pero sin Policy específica?
```
**Hallazgo esperado:** SÍ/NO + línea específica

**Criterio de Validación (Global):**
- [ ] ≥2 tipos de error encontrados (reales, no teóricos)
- [ ] Cada error tiene línea de código específica
- [ ] Cada error tiene contexto (qué es el problema)
- [ ] Registro en control_log

**Si menos de 2 errores encontrados:**
- Módulo puede ser muy simple
- Reportar a Claude: "Solo encontré X errores. ¿Continuar?"

**Si PASA:** Continuar a 1.4

---

### Paso 1.4: Crear Archivo de Auditoría
**Tiempo:** 1 hora

**Hacer:**
1. Copiar estructura de: `docs/reporte_maestro/modulos/20260810-auditoria-reclutamiento-candidatos.md`

2. Crear archivo: `docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md`

3. Llenar secciones:
   - **Resumen ejecutivo:** 2-3 párrafos
   - **Matriz de Reglas de Negocio (RN):** ≥6 RNs identificadas
   - **Matriz de Permisos:** Tabla endpoint × rol × autorización
   - **Hallazgos:** Los 2-6 errores encontrados (Severidad: CRÍTICO/ALTO/MEDIO)
   - **Flujos End-to-End:** Diagramas ASCII mostrando pipeline
   - **Plan de Remediación:** 3 fases, ≥3 acciones

4. Validar contenido (línea siguiente)

**Criterio de Validación:**
- [ ] Archivo existe en docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md
- [ ] Matriz de RNs: ≥6 filas, 4 columnas (Nivel 1-4)
- [ ] Matriz de permisos: ≥5 endpoints × ≥3 roles
- [ ] ≥2 hallazgos con línea de código
- [ ] Diagramas ASCII presentes (≥1)
- [ ] Plan de remediación con ≥3 acciones
- [ ] Fecha de auditoría: YYYYMMDD

**Si FALLA:**
- Revisar estructura del archivo
- Comparar línea por línea con EJEMPLO_AUDITORIA_CANDIDATES.md
- Reportar a Claude

**Si PASA:** 
- Guardar path en control_log
- **[[ PAUSA PARA AUDITORÍA ]]** → Claude revisa exhaustivamente

---

### Paso 1.5: Análisis de Automatización
**Tiempo:** 30 min

**Hacer:**

1. Revisar flujos de FASE 1.4 (diagramas ASCII)
2. Para CADA paso, preguntar:
   - ¿Lo hace un usuario manualmente? (SÍ/NO)
   - ¿Podría automatizarse? (SÍ/NO/PODRÍA)
   - ¿Qué sería necesario? (pre-requisito)
   - ¿Cuánto esfuerzo manual eliminaría? (ROI)

3. Crear tabla en control_log:
   ```markdown
   | Paso | Manual? | Automizable? | Pre-req | ROI |
   |------|---------|-----------|---------|-----|
   | 1.X | SÍ | SÍ | Pre 1 | ALTO |
   | 2.X | SÍ | PODRÍA | Pre 2 | MEDIO |
   ```

4. Separar por criticidad:
   ```
   QUICK WINS (1-2 sem):
   - [Automatización que toma poco, elimina mucho manual]
   
   MEDIUM (1 mes):
   - [Automatización que requiere integración]
   
   STRATEGIC (2+ meses):
   - [Automatización que depende de módulos externos]
   ```

5. Guardar en control_log:
   ```
   FASE 1 Paso 1.5 - AUTOMATIZACIÓN
   Quick Wins: [número de acciones]
   Total manual horas/año si se automatizara: [estimación]
   ```

**Criterio de Validación:**
- [ ] Tabla generada (≥5 pasos mapeados)
- [ ] ≥1 automatización identificada
- [ ] Pre-requisitos documentados
- [ ] Listado de quick wins presente

**Si NO:**
- Módulo muy simple, OK (algunos módulos tienen poco potencial)
- Reportar hallazgo: "Automatización potencial: BAJA"

**Si SÍ:**
- ✅ Guardar en control_log
- Este análisis será INPUT para roadmap futuro
- Continuar a 1.6 (crear auditoría)

---

### Validación FASE 1 (Claude Auditor)

Claude ejecuta AUDIT_PROMPT_COMPREHENSIVE.md Sección E sobre archivo generado:

**Preguntas clave:**
- ¿Matriz de RNs está completa y jerárquica?
- ¿Hallazgos son reales (código específico) o teóricos?
- ¿Diagramas ASCII son claros y útiles?
- ¿Plan de remediación es prioritario?

**Resultado posible:**
- ✅ **APROBADO:** Continuar a FASE 2
- ⚠️ **APROBADO CON COMENTARIOS:** OpenCode revisa puntos específicos, luego FASE 2
- ❌ **RECHAZADO:** Re-hacer paso 1.4, esperar aprobación

---

## FASE 2: Documentación Backend (Est. 2 horas OpenCode + 30 min Claude)

### Objetivo
Crear 2 archivos backend siguiendo estructura de Candidates piloto. Nivel 1 (resumen operativo) + Nivel 2 (documentación técnica).

### Paso 2.1: Backend README.md (Nivel 1)
**Tiempo:** 1 hora

**Hacer:**
1. Crear archivo: `api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/README.md`

2. Copiar estructura de: `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/README.md`

3. Llenar secciones (en orden):
   - **Propósito funcional** (2-3 párrafos qué es el módulo)
   - **Endpoints principales** (tabla con GET, POST, PUT, DELETE)
   - **Actores y responsabilidades** (quién hace qué en el flujo)
   - **Dependencias** (otros módulos que usa)
   - **Reglas de Negocio** (RN-MOD-001 a RN-MOD-020, mínimo 10)
   - **Estructura de carpetas** (Models, Endpoints, Services, DTOs)
   - **Validaciones principales** (tabla de validaciones críticas)
   - **Permisos & Seguridad** (matriz [Authorize], políticas)
   - **Referencias a CONVENTIONS.md** (al menos 3 referencias: §4.5, §2, §5.8)

**Criterio de Validación:**
- [ ] Archivo existe en api/.../[ModuleLuxuryApp]/README.md
- [ ] ≥10 RNs documentadas (grep "RN-" README.md)
- [ ] ≥5 endpoints en tabla
- [ ] Sección de permisos explícita
- [ ] ≥3 referencias a CONVENTIONS.md
- [ ] Línea "Última revisión: YYYYMMDD" al final

**Si FALLA:**
- Comparar con Candidates README.md línea por línea
- Revisar estructura de carpetas real
- Reportar qué falta a Claude

**Si PASA:** Continuar a 2.2

---

### Paso 2.2: Backend Documentación Técnica
**Tiempo:** 1 hora

**Hacer:**
1. Crear archivo: `api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/Docs/documentacion-[modulo].md`
   (Crear carpeta `Docs/` si no existe)

2. Copiar estructura de: `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Docs/documentacion-candidates.md`

3. Llenar secciones (en orden):
   - **Resumen ejecutivo** (1 párrafo)
   - **Visión funcional** (pipeline del módulo, 2-3 párrafos)
   - **Arquitectura técnica** (modelo de datos, enums, relaciones)
   - **Endpoints documentados** (3-5 endpoints principales con body/response)
   - **Flujos del sistema** (diagramas ASCII de flujos principales)
   - **Entidades principales** (lista con propiedades clave)
   - **Servicios & métodos** (tabla de servicios + responsabilidad)
   - **Base de datos** (índices, relaciones FK, constraints)
   - **Performance & caching** (si aplica)
   - **Checklist de validación** (en paso siguiente)

**Criterio de Validación:**
- [ ] Archivo existe en api/.../Docs/documentacion-[modulo].md
- [ ] ≥3 endpoints documentados con body + response
- [ ] Modelo de datos documentado (≥3 entidades)
- [ ] Diagramas ASCII presentes (≥1)
- [ ] Tabla de servicios con ≥5 métodos
- [ ] Índices de BD documentados
- [ ] Línea "Última revisión: YYYYMMDD" al final

**Si FALLA:**
- Revisar estructura vs Candidates Docs/documentacion-candidates.md
- Ejemplos de endpoints pueden estar en auditoría (FASE 1)
- Reportar a Claude

**Si PASA:** 
- **[[ PAUSA PARA AUDITORÍA ]]** → Claude revisa ambos archivos backend

---

### Validación FASE 2 (Claude Auditor)

Claude verifica:

**Preguntas clave:**
- ¿README.md tiene ≥10 RNs específicas del módulo (no genéricas)?
- ¿Documentación técnica referencia código real (línea de archivo)?
- ¿Diagramas ASCII son útiles?
- ¿No hay copy-paste ciego de Candidates (datos genéricos)?

**Resultado:**
- ✅ **APROBADO:** Continuar a FASE 3
- ⚠️ **APROBADO CON CORRECCIONES:** OpenCode/KiloCode aplica feedback, re-submit
- ❌ **RECHAZADO:** Re-hacer paso 2.1 o 2.2 específico

---

## FASE 3: Documentación Frontend (Est. 2 horas OpenCode + 30 min Claude)

### Objetivo
Crear 3 archivos frontend: README (operativo), setup.md (onboarding), decisiones.md (matriz de decisiones).

### Paso 3.1: Frontend README.md (Operativo)
**Tiempo:** 40 min

**Hacer:**
1. Crear archivo: `client/angular/src/app/apps/[modulo].luxuryapp/docs/README.md`
   (Crear carpeta `docs/` si no existe)

2. Copiar estructura de: `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/docs/README.md`

3. Llenar secciones:
   - **Propósito del módulo** (1 párrafo)
   - **Rutas y URLs** (tabla con localhost:4200/[modulo]/*)
   - **Estructura de carpetas** (árbol de carpetas reales)
   - **Componentes principales** (tabla con responsabilidad)
   - **Servicios** (tabla con métodos públicos)
   - **Data flow diagram** (ASCII mostrando Observable → Store → Signal)
   - **Formularios** (si aplica, validaciones)
   - **Enums/Estados** (tabla de estados posibles)
   - **Smoke test** (happy path de 15-25 pasos)
   - **Debugging tips** (3-5 tips comunes)

**Criterio de Validación:**
- [ ] Archivo existe en client/angular/.../[modulo]/docs/README.md
- [ ] ≥3 rutas definidas con URLs completas
- [ ] Componentes listados (grep "selector.*:" src/app/apps/[modulo]/)
- [ ] Data flow diagram ASCII presente
- [ ] Smoke test completo (happy path)
- [ ] Línea "Última revisión: YYYYMMDD" al final

**Si FALLA:**
- Revisar estructura real de carpetas
- Componentes pueden encontrarse con glob: `src/app/apps/[modulo]/**/*.component.ts`
- Reportar a Claude

**Si PASA:** Continuar a 3.2

---

### Paso 3.2: Frontend setup.md (Onboarding 30 min)
**Tiempo:** 40 min

**Hacer:**
1. Crear archivo: `client/angular/src/app/apps/[modulo].luxuryapp/docs/setup.md`

2. Copiar estructura de: `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/docs/setup.md`

3. Llenar secciones:
   - **Para quién:** Dev nuevo
   - **Tiempo:** 30 minutos
   - **Lectura en orden:** setup → README → decisiones → architecture
   - **Estructura a memorizar** (árbol de 5-8 carpetas clave)
   - **Primer cambio walkthrough** (5 pasos concretos, ej: agregar columna)
   - **Rutas de referencia backend** (dónde mirar en api/)
   - **Debugging flowchart** (¿cambio en backend? → ¿observable? → ¿store? → ¿template?)
   - **4 common mistakes** (cada una con corrección)
   - **Git workflow** (rama, commit, PR)

**Criterio de Validación:**
- [ ] Archivo existe en client/angular/.../[modulo]/docs/setup.md
- [ ] Walkthrough tiene 5 pasos claros
- [ ] Flowchart de debugging ASCII presente
- [ ] ≥4 common mistakes con soluciones
- [ ] Backend reference paths presentes
- [ ] Línea "Última revisión: YYYYMMDD" al final

**Si FALLA:**
- Walkthrough debe ser específico (no "hacer cambio", sino "agregar input de búsqueda")
- Revisar Candidates setup.md para ver nivel de detalle
- Reportar a Claude

**Si PASA:** Continuar a 3.3

---

### Paso 3.3: Frontend decisiones.md (Matriz)
**Tiempo:** 40 min

**Hacer:**
1. Crear archivo: `client/angular/src/app/apps/[modulo].luxuryapp/docs/decisiones.md`

2. Copiar estructura de: `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/docs/decisiones.md`

3. Llenar secciones:
   - **Para quién:** Dev diario (¿dónde pongo esto?)
   - **Matriz de decisión:** ¿Es visual? ¿Es lógica? ¿Dónde va? (árbol ASCII)
   - **4-5 ejemplos concretos** (ej: Sin CV badge, validar email único)
   - **7 reglas irrompibles** (tabla)
   - **Checklist antes de crear archivo nuevo** (7-10 items)
   - **Commands rápidos** (tree, find, grep específicos)
   - **Example flow completo** (ej: descargar CV)
   - **¿Cuándo preguntar al Tech Lead?** (3-5 escenarios)

**Criterio de Validación:**
- [ ] Archivo existe en client/angular/.../[modulo]/docs/decisiones.md
- [ ] ≥4 ejemplos específicos del módulo (no genéricos)
- [ ] Matriz ASCII clara
- [ ] 7 reglas irrompibles documentadas
- [ ] Commands con grep patterns específicas
- [ ] Línea "Última revisión: YYYYMMDD" al final

**Si FALLA:**
- Ejemplos deben ser concretos del módulo [modulo]
- Revisar Candidates decisiones.md para ver profundidad
- Reportar a Claude

**Si PASA:** 
- **[[ PAUSA PARA AUDITORÍA ]]** → Claude revisa 3 archivos frontend

---

### Validación FASE 3 (Claude Auditor)

Claude verifica:

**Preguntas clave:**
- ¿README.md tiene data flow diagram útil?
- ¿Setup.md walkthrough es ejecutable en 30 min?
- ¿Decisiones.md ejemplos son específicos del módulo?
- ¿No hay copy-paste ciego?

**Resultado:**
- ✅ **APROBADO:** Continuar a FASE 4
- ⚠️ **APROBADO CON CORRECCIONES:** OpenCode/KiloCode aplica feedback
- ❌ **RECHAZADO:** Re-hacer archivo específico

---

## FASE 4: Validación Cruzada (Est. 1 hora OpenCode + 30 min Claude)

### Objetivo
Verificar que 6 archivos existen, tienen contenido coherente, y están vinculados correctamente.

### Paso 4.1: Verificar Existencia de 6 Archivos
**Tiempo:** 5 min

**Hacer:**
```bash
# Verificar auditoría
ls -la docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md

# Verificar backend
ls -la api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/README.md
ls -la api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/Docs/documentacion-[modulo].md

# Verificar frontend
ls -la client/angular/src/app/apps/[modulo].luxuryapp/docs/README.md
ls -la client/angular/src/app/apps/[modulo].luxuryapp/docs/setup.md
ls -la client/angular/src/app/apps/[modulo].luxuryapp/docs/decisiones.md

# Contar
ls docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md \
   api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/{README.md,Docs/documentacion-[modulo].md} \
   client/angular/src/app/apps/[modulo].luxuryapp/docs/{README.md,setup.md,decisiones.md} 2>/dev/null | wc -l
# Resultado esperado: 6
```

**Criterio de Validación:**
- [ ] Contar: wc -l retorna 6
- [ ] Todos archivos existen (ls -la éxito)

**Si FALLA:**
- Verificar paths exactas
- Carpetas docs/ pueden no existir (crear si necesario)
- Reportar qué archivo falta a Claude

**Si PASA:** Continuar a 4.2

---

### Paso 4.2: Validación de Contenido (Cross-checks)
**Tiempo:** 20 min

**Hacer:**

1. **Backend README.md referencia auditoría:**
   ```bash
   grep -i "auditor\|hallazgo\|reporte" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/README.md
   # Debería encontrar al menos una mención
   ```

2. **Frontend README.md referencia backend:**
   ```bash
   grep -i "api\|endpoint\|backend" client/angular/src/app/apps/[modulo].luxuryapp/docs/README.md
   # Debería encontrar referencias
   ```

3. **Setup.md menciona README.md:**
   ```bash
   grep -i "readme\|leer en orden" client/angular/src/app/apps/[modulo].luxuryapp/docs/setup.md
   # Debe tener instrucciones de lectura
   ```

4. **Decisiones.md tiene ejemplos del módulo:**
   ```bash
   grep -i "ejemplo\|[modulo]" client/angular/src/app/apps/[modulo].luxuryapp/docs/decisiones.md
   # Debería encontrar ejemplos específicos
   ```

5. **Todos archivos tienen "Última revisión: YYYYMMDD":**
   ```bash
   grep "Última revisión" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/README.md
   grep "Última revisión" api/LuxuryApp.Application/Moduls/[ModuleLuxuryApp]/Docs/documentacion-[modulo].md
   grep "Última revisión" client/angular/src/app/apps/[modulo].luxuryapp/docs/README.md
   grep "Última revisión" client/angular/src/app/apps/[modulo].luxuryapp/docs/setup.md
   grep "Última revisión" client/angular/src/app/apps/[modulo].luxuryapp/docs/decisiones.md
   grep "Última revisión" docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md
   # Resultado: 6 líneas
   ```

**Criterio de Validación:**
- [ ] Backend README referencia auditoría (≥1 mención)
- [ ] Frontend README referencia backend (≥3 menciones)
- [ ] Setup.md tiene instrucciones de lectura
- [ ] Decisiones.md tiene ejemplos específicos
- [ ] Todos 6 archivos tienen "Última revisión: YYYYMMDD"

**Si FALLA:**
- Revisar archivo faltante
- Agregar referencias cruzadas faltantes
- Re-validar

**Si PASA:** Continuar a 4.3

---

### Paso 4.3: Actualizar Memoria
**Tiempo:** 10 min

**Hacer:**
1. Crear archivo: `memory/audit-[modulo]-20260810.md`
   ```markdown
   ---
   name: audit-[modulo]
   description: [MODULO] módulo auditoría completada - X hallazgos, Y RNs auditadas
   metadata:
     type: project
   ---

   # Auditoría [MODULO]

   **Fecha:** 2026-08-10  
   **Arquivos generados:** 6 (auditoría + backend 2 + frontend 3)  
   **Hallazgos:** [número] (severidad: [CRÍTICO/ALTO/MEDIO])  
   **RNs auditadas:** [número]  
   **Plan remediación:** [fases y acciones]
   
   **Enlace auditoría:** docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md
   ```

2. Agregar línea a `memory/MEMORY.md`:
   ```
   - [Auditoría [MODULO] completada](audit-[modulo]-20260810.md) — X hallazgos, Y RNs, plan remediación (2026-08-10)
   ```

**Criterio de Validación:**
- [ ] Archivo memory creado
- [ ] Línea agregada a MEMORY.md
- [ ] Referencia a auditoría correcta

**Si FALLA:**
- Verificar paths de memoria
- Reportar a Claude

**Si PASA:** 
- **[[ PAUSA PARA AUDITORÍA FINAL ]]** → Claude ejecuta AUDIT_PROMPT_COMPREHENSIVE.md completo

---

### Auditoría Final Exhaustiva (Claude)

Claude ejecuta todas las validaciones:
- ✅ 6 archivos existen
- ✅ Contenido es coherente
- ✅ Cross-references correctas
- ✅ No hay copy-paste ciego
- ✅ Datos específicos del módulo
- ✅ Hallazgos identificados son reales
- ✅ Plan de remediación es viable

**Resultado:**
- ✅ **APROBADO:** Ir a CIERRE
- ⚠️ **APROBADO CON CORRECCIONES MENORES:** OpenCode/KiloCode fix (max 2 intentos)
- ❌ **RECHAZADO:** Re-ejecutar FASE específica

---

## CIERRE (30 min)

**Hecho:**
1. ✅ Crear commit con 6 archivos
2. ✅ Mensaje de commit referencia plan + auditoría
3. ✅ Actualizar MEMORY.md (si no lo hizo OpenCode)
4. ✅ Cerrar control_log

**Control_log final:**
```
Status: ✅ COMPLETED
Fecha inicio: YYYY-MM-DD HH:MM
Fecha fin: YYYY-MM-DD HH:MM
Tiempo total: X horas
Commit: [SHA] "Documentar [MODULO]: 6 archivos + auditoría"
Hallazgos encontrados: X
Plan remediación: [fases]
Próximo paso: Ejecutar remediación o siguiente módulo
```

---

## 📞 Si OpenCode No Sabe Algo

| Pregunta | Respuesta |
|----------|-----------|
| "¿Cuál es la estructura?" | Ve paso correspondiente en este plan, tiene detalles |
| "¿Qué busco?" | AUDIT_PROMPT_COMPREHENSIVE.md Sección E - lista los 6 tipos |
| "¿Está bien?" | Valida vs criterio de validación de tu paso |
| "No entiendo" | Contacta a Claude, necesito clarificar |
| "Falla comando" | Reporta error exacto, Claude lo revisa |

---

**Este plan es PLANTILLA. Personalizar para cada módulo.**

Última actualización: 2026-08-10
