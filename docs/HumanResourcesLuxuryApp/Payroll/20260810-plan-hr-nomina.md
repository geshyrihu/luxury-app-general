# PLAN: Documentar Nomina (2026-08-10)

**Estado:** PENDING → APPROVED → EXECUTING → COMPLETED

## Metadata Crítica

```
Creado por:        Claude Code
Ejecutará:         OpenCode
Auditor:           Claude Code
Aprobó:            geshyrihu (usuario)
Fecha creación:    2026-08-10 14:30
Módulo destino:    api/LuxuryApp.Application/Moduls/NominaLuxuryApp/
                   client/angular/src/app/apps/nomina.luxuryapp/
Plantilla base:    docs/audit/EJEMPLO_AUDITORIA_CANDIDATES.md
Tiempo estimado:   11.5 horas (9h OpenCode + 2.5h Claude auditor)
Control log:       docs/implementation-control/NOMINA_20260810_CONTROL_LOG.md
CONVENTIONS.md:    §4.5 (Documentación, Remediación y Migración)
                   §4.7 (Documentación de Módulo Existente)
                   §5.8 (Auditoría)
```

**IMPORTANTE:** 
- Cada paso tiene CRITERIO DE VALIDACIÓN explícito (línea "Criterio de Validación:")
- Si criterio = NO → ABORTAR, reportar error a Claude, esperar feedback
- Si criterio = SÍ → guardar resultado en control_log, continuar
- **NO asumir nada:** Si duda, pregunta a Claude (no continúes sin aprobación)

---

## FASE 1: Auditoría Real del Módulo Nomina (Est. 4h OpenCode + 1h Claude)

### Objetivo
Ejecutar auditoría exhaustiva de Nomina usando AUDIT_PROMPT_COMPREHENSIVE.md como guía.

### Paso 1.1: Exploración de Endpoints
**Tiempo:** 30 min

**Comandos a ejecutar:**
```bash
# Comando 1: Buscar endpoints en backend Nomina
grep -r "public.*Async" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/ \
  | grep -E "(Post|Get|Put|Delete|Patch)" \
  | head -25

# Comando 2: Contar total de endpoints
grep -r "public.*Async" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/ \
  | grep -E "(Post|Get|Put|Delete|Patch)" \
  | wc -l
```

**Resultado esperado:**
- ≥8 endpoints encontrados (Nomina es módulo complejo)

**Guardar en control_log:**
```
FASE 1 Paso 1.1 COMPLETADO
Endpoints encontrados: [número]
Ejemplos: [primeros 5 endpoints]
```

**Criterio de Validación:**
- [ ] Comando 1 retorna ≥8 endpoints
- [ ] Comando 2 retorna número ≥8
- [ ] Ejemplos guardados en control_log

**Si NO pasa criterio:**
- ❌ ABORTAR
- Revisar: ¿carpeta NominaLuxuryApp existe?
- Reportar error exacto a Claude

**Si SÍ pasa:**
- ✅ Guardar resultado
- Continuar a 1.2

---

### Paso 1.2: Matriz de Permisos
**Tiempo:** 1 hora

**Hacer:**

Para cada endpoint encontrado en 1.1, verificar [Authorize] attribute:

```bash
# Buscar archivo de endpoints
find api/LuxuryApp.Application/Moduls/NominaLuxuryApp -name "*Endpoint*.cs" -o -name "*Controller*.cs"

# Para cada archivo, buscar [Authorize]
grep -B2 "public.*Async" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/Endpoints/*.cs | grep -E "\[Authorize\]|public.*Async"
```

**Crear tabla en control_log:**
```markdown
| Endpoint | Método | [Authorize] | Roles Detectados | Política |
|----------|--------|-----------|---------|----------|
| GetNominas | GET | Sí | Admin, Manager | [Policy] |
| CreateNomina | POST | Sí | Admin | Policy.AdminOnly |
| ... | ... | ... | ... | ... |
```

**Detalles para cada endpoint:**
- ¿Tiene [Authorize]?
- ¿Roles específicos (e.g., [Authorize("Admin")])?
- ¿Política de autorización?

**Criterio de Validación:**
- [ ] Tabla generada con ≥8 endpoints
- [ ] Columna [Authorize]: SÍ/NO para cada uno
- [ ] ≥3 roles diferentes identificados (Admin, Manager, User, etc.)
- [ ] Tabla guardada en control_log

**Hallazgo importante:**
- Si endpoint SIN [Authorize] → Esto es HALLAZGO DE SEGURIDAD (guardar línea de código)

**Si NO pasa:**
- ❌ Revisar archivos de endpoints
- Algunos pueden estar en carpeta diferente
- Reportar a Claude

**Si SÍ:**
- ✅ Guardar tabla en control_log
- Continuar a 1.3

---

### Paso 1.3: Búsqueda de 6 Tipos de Errores
**Tiempo:** 1.5 horas

Usar `docs/audit/AUDIT_CHECKLIST_COMPLETO.md` Sección "6 Tipos de Errores" como referencia.

#### Error Tipo 1: Eliminación en Cascada No Controlada
```bash
# Buscar relaciones FK sin validación
grep -r "OnDelete.*Cascade" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/Models/
# Buscar: ¿hay eliminar sin validar dependientes?
grep -r "DeleteAsync\|Remove" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/Services/
```

**Búsqueda específica Nomina:**
- ¿Puedo eliminar Employee si tiene nóminas asociadas?
- ¿Puedo eliminar Periodo si hay liquidaciones?
- ¿Hay validación antes de delete?

**Hallazgo esperado:** SÍ/NO + línea específica (e.g., "Linea 234 en EmployeeService.cs")

#### Error Tipo 2: Duplicados/Índices UNIQUE Faltantes
```bash
# Buscar campos que deberían ser únicos
grep -r "Email\|NumeroDocumento\|Cédula\|Code" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/Models/
# ¿Hay validación duplicado?
grep -r "Any.*Email\|Any.*Numero" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/Services/
```

**Búsqueda específica Nomina:**
- ¿Número de documento única por empresa?
- ¿Email único por empleado?
- ¿Hay índice en BD?

**Hallazgo esperado:** SÍ/NO + línea específica

#### Error Tipo 3: Transiciones de Estado Inválidas
```bash
# Buscar enums de estado
grep -r "enum.*Status\|enum.*State\|enum.*Tipo" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/
# Buscar cambios de estado
grep -r "status.*=\|State.*=" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/Services/ | head -10
```

**Búsqueda específica Nomina:**
- Estados de Periodo: Abierto → Cerrado → Liquidado (¿validar transiciones?)
- Estados de Nómina: Borrador → Revisada → Aprobada (¿validar?)
- Línea 123 de PeriodoService.cs: ¿Puedo cambiar Liquidado → Abierto?

**Hallazgo esperado:** SÍ/NO + línea específica

#### Error Tipo 4: Pre-requisitos Faltantes
```bash
# Buscar validaciones de pre-requisitos
grep -r "if.*null\|if.*== 0\|if.*!.*Exists" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/Services/ | head -15
# Buscar: ¿asume que entidad existe sin validar?
```

**Búsqueda específica Nomina:**
- ¿Línea 456 de NominaService crea nómina sin validar Periodo existe?
- ¿Hay validación que Empleado existe antes de asignarlo?
- ¿Check que Empresa existe?

**Hallazgo esperado:** SÍ/NO + línea específica

#### Error Tipo 5: Inconsistencias Front/Back
```bash
# Buscar validaciones en backend
grep -r "\[Required\]\|\[MaxLength\]\|\[RegularExpression\]" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/DTO/
# Guardar lista de validaciones

# Notas para auditor: Comparar después con frontend
```

**Búsqueda específica Nomina:**
- DTO de CreateNomina: ¿Required?
- MaxLength de campos texto: ¿30, 100, 255?
- ¿Validación de números (salarios, porcentajes)?

**Hallazgo esperado:** SÍ/NO (se auditará en FASE 3 con frontend)

#### Error Tipo 6: Seguridad/Autorización
```bash
# Buscar endpoints sin [Authorize]
grep -B3 "public.*Async" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/Endpoints/*.cs \
  | grep -E "^\[|public.*Async" | head -30

# Específicamente buscar GET públicos sin autenticación
grep "\[HttpGet.*Anonymous\]" api/LuxuryApp.Application/Moduls/NominaLuxuryApp/
```

**Búsqueda específica Nomina:**
- ¿Hay endpoint sin [Authorize]?
- ¿GetNominas permite acceso a TODOS?
- ¿Hay creación de Periodo sin Admin?

**Hallazgo esperado:** SÍ/NO + línea específica (crítico si SÍ)

---

**Resumen Paso 1.3:**

Guardar en control_log:
```markdown
FASE 1 Paso 1.3 - BÚSQUEDA DE ERRORES
Tipo 1 (Cascada): SÍ/NO - [línea si SÍ]
Tipo 2 (Duplicados): SÍ/NO - [línea si SÍ]
Tipo 3 (Estados): SÍ/NO - [línea si SÍ]
Tipo 4 (Pre-requisitos): SÍ/NO - [línea si SÍ]
Tipo 5 (Front/Back): SÍ/NO - [línea si SÍ]
Tipo 6 (Seguridad): SÍ/NO - [línea si SÍ]

Total errores encontrados: [número]
```

**Criterio de Validación:**
- [ ] ≥2 tipos de error encontrados con línea de código
- [ ] Cada error documentado con severidad (CRÍTICO/ALTO/MEDIO)
- [ ] Errores guardados en control_log

**Si menos de 2 errores encontrados:**
- Módulo Nomina es complejo, debería haber hallazgos
- Reportar a Claude: "Solo encontré X errores. ¿Continuar?"

**Si SÍ:**
- ✅ Guardar en control_log
- Continuar a 1.4

---

### Paso 1.4: Crear Archivo de Auditoría
**Tiempo:** 1 hora

**Crear archivo:** `docs/reporte_maestro/modulos/20260810-auditoria-nomina.md`

**Plantilla a copiar:**
- Abrir: `docs/reporte_maestro/modulos/20260810-auditoria-reclutamiento-candidatos.md`
- Copiar estructura completa (no contenido)

**Secciones a llenar (en orden):**

1. **Encabezado:**
   ```markdown
   # Auditoría de Módulo Nomina
   **Fecha:** 2026-08-10
   **Auditor:** OpenCode (bajo supervisión Claude)
   **Módulo:** Nomina (api/LuxuryApp.Application/Moduls/NominaLuxuryApp/)
   **Endpoints auditados:** [número] (Paso 1.1)
   **Errores encontrados:** [número] (Paso 1.3)
   ```

2. **Resumen Ejecutivo (2-3 párrafos):**
   - Qué es Nomina (propósito funcional)
   - Flujo principal (Periodo → Nómina → Liquidación)
   - Riesgos principales encontrados

3. **Matriz de Reglas de Negocio (Nivel 1-4):**
   Buscar en código y documentar ≥6 RNs:
   ```markdown
   | RN | Descripción | Nivel | Validación | Estado |
   |----|-----------|-------|-----------|--------|
   | RN-NOM-001 | Periodo debe tener inicio/fin | 1 | En bd_periodo | ✅ |
   | RN-NOM-002 | Solo Admin puede crear periodo | 2 | [Authorize("Admin")] | ✅ |
   | RN-NOM-003 | Empleado sin salario no puede liquidar | 2 | Check en Service | ⚠️ Falta |
   | ... | ... | ... | ... | ... |
   ```

4. **Matriz de Permisos (Paso 1.2):**
   Copiar tabla de Step 1.2

5. **Hallazgos (De Paso 1.3):**
   Documentar cada error con contexto:
   ```markdown
   ### Hallazgo 1: [Tipo de error] (Severidad: CRÍTICO/ALTO/MEDIO)
   **Descripción:** 
   **Línea de código:** api/LuxuryApp.Application/Moduls/NominaLuxuryApp/Services/NominaService.cs:234
   **Contexto:**
   ```csharp
   // Código de ejemplo que muestra el problema
   ```
   **Impacto:** 
   **Fix recomendado:**
   ```

6. **Flujos End-to-End (diagramas ASCII):**
   ```
   Flujo de liquidación:
   ┌─────────┐
   │ Abierto │
   └────┬────┘
        │ Admin cierra
   ┌────v────┐
   │ Cerrado  │
   └────┬────┘
        │ Calcular nómina
   ┌────v────────┐
   │ Liquidado    │
   └─────────────┘
   
   Validaciones:
   - Periodo debe estar Abierto
   - Empleado debe estar activo
   - Salario debe estar definido
   ```

7. **Plan de Remediación (3 fases):**
   ```markdown
   ### FASE 1: Seguridad (Semana 1)
   - [ ] Acción 1: Agregar [Authorize] a endpoints sin autenticación
   - [ ] Acción 2: Validar permisos en endpoints específicos
   
   ### FASE 2: Validaciones (Semana 2)
   - [ ] Acción 3: Agregar validación de pre-requisitos
   - [ ] Acción 4: Validar transiciones de estado
   
   ### FASE 3: Integridad (Semana 3)
   - [ ] Acción 5: Agregar índices UNIQUE en BD
   - [ ] Acción 6: Documentar flujos
   ```

**Guardar en control_log:**
```
FASE 1 Paso 1.4 COMPLETADO
Archivo creado: docs/reporte_maestro/modulos/20260810-auditoria-nomina.md
Secciones: Resumen + RNs + Permisos + Hallazgos + Flujos + Remediación
Líneas: [aproximadas]
Hallazgos principales: [lista de 2-6]
```

**Criterio de Validación:**
- [ ] Archivo existe: docs/reporte_maestro/modulos/20260810-auditoria-nomina.md
- [ ] Matriz de RNs: ≥6 filas, bien jerarquizada
- [ ] Matriz de permisos: ≥8 endpoints × ≥3 roles
- [ ] ≥2 hallazgos con línea de código específica
- [ ] Diagramas ASCII presentes (≥1)
- [ ] Plan de remediación con 3 fases + ≥6 acciones
- [ ] Archivo tiene estructura similar a EJEMPLO_AUDITORIA_CANDIDATES.md

**Si NO:**
- ❌ Revisar archivo línea por línea vs ejemplo
- Comparar estructura
- Reportar qué falta a Claude

**Si SÍ:**
- ✅ Guardar path en control_log
- **[[ PAUSA PARA AUDITORÍA FASE 1 ]]**
- Esperar aprobación de Claude

---

### Paso 1.5: Análisis de Automatización (Nomina)
**Tiempo:** 30 min

**Hacer:**

Revisar flujos de Nomina (Paso 1.4) y preguntar por cada paso:

1. **Paso: Crear Período**
   - Manual? SÍ (Admin debe crear)
   - Automizable? PODRÍA (calendario)
   - Pre-req: Fecha inicio/fin configuradas
   - ROI: BAJO (una vez/mes)

2. **Paso: Agregar Empleados**
   - Manual? **SÍ** (RH agrega uno por uno)
   - Automizable? **SÍ** (desde HR module)
   - Pre-req: HR module API /employee/active-list
   - ROI: **ALTO** (ahorra 1h manual/mes)
   - **QUICK WIN:** Si HR API existe, 16h trabajo → elimina 12h/año

3. **Paso: Calcular Nómina**
   - Manual? NO (automático backend)
   - Automizable? Ya auto

4. **Paso: Revisar Nómina**
   - Manual? SÍ (Manager revisa)
   - Automizable? NO (decisión humana)

5. **Paso: Aprobar**
   - Manual? SÍ (Admin aprueba)
   - Automizable? PODRÍA (auto si Manager aprobó + audit trail)
   - Pre-req: Audit log system ✅ (existe)
   - ROI: MEDIO (ahorra 5 min/mes)

6. **Paso: Exportar Pago**
   - Manual? **SÍ** (copy a Excel hoy)
   - Automizable? **SÍ** (ClosedXML export)
   - Pre-req: ClosedXML service ✅ (existe en otro módulo)
   - ROI: **ALTO** (ahorra 20 min/mes)
   - **QUICK WIN:** 8h trabajo → elimina 4h/año

7. **Paso: Registrar Contabilidad**
   - Manual? **SÍ** (contador copia manualmente)
   - Automizable? **SÍ** (API integración)
   - Pre-req: Contabilidad API documentada ❌ (NO EXISTE)
   - ROI: **MUY ALTO** (ahorra 1h/mes = 12h/año)
   - **STRATEGIC:** Depende de Contabilidad module

**Resumen para Nomina:**

```
QUICK WINS (1-2 semanas, hace ahora):
  ✅ Auto-export pago (8h) → elimina 20 min manual/mes
  ✅ Auto-sync empleados desde HR (16h, si HR API existe) → elimina 1h manual/mes
  
MEDIUM (1-2 meses):
  ⚠️ Auto-aprobación (6h) → elimina 5 min manual/mes
  
STRATEGIC (siguiente quarter):
  ❌ Integración contabilidad (24h, BLOQUEADA por módulo externo) → elimina 1h/mes

TOTAL MANUAL HORAS/AÑO SI AUTOMATIZAMOS TODO: 28 horas (vs 0 hoy)
QUICK WINS SOLO: 16 horas ahorradas/año con 24h trabajo
```

Guardar en control_log:

```
FASE 1 Paso 1.5 - AUTOMATIZACIÓN NOMINA
Quick Wins identificadas: 2 (export + sync)
Horas manual/año si se hacen: 16h
Pre-requisito: HR API /employee/active-list (VERIFICAR si existe)
```

**Criterio de Validación:**
- [ ] Tabla generada (7 pasos mapeados) ✅
- [ ] ≥2 automatizaciones identificadas ✅
- [ ] Pre-requisitos documentados ✅
- [ ] Quick wins listados ✅
- [ ] HR API existe? (VERIFICAR comando siguiente)

**Verificación:**
```bash
# ¿HR API existe?
grep -r "employee.*list\|/api/hr/employees" api/LuxuryApp.Application/Moduls/HR/
# Si sí → Quick Win "sync" es factible
# Si no → Bloquea ese quick win
```

**Si PASA criterio:** ✅ Guardar, continuar a 1.4 (crear auditoría)

---

### Validación FASE 1 (Claude Auditor - 1 hora)

Claude ejecuta AUDIT_PROMPT_COMPREHENSIVE.md Sección E completa:

**Preguntas que Claude verifica:**
1. ¿Matriz de RNs está completa y jerárquica (Nivel 1-4)?
2. ¿Hallazgos son REALES (código específico) o teóricos?
3. ¿Cada hallazgo tiene línea de código?
4. ¿Diagramas ASCII son claros y útiles?
5. ¿Plan de remediación está prioritizado?
6. ¿Errores encontrados son consistentes con auditoría manual?

**Resultado de Claude:**
- ✅ **APROBADO:** Ir a FASE 2
- ⚠️ **APROBADO CON COMENTARIOS:** OpenCode lee feedback, corrige puntos específicos (max 15 min), re-submit
- ❌ **RECHAZADO:** Re-hacer paso 1.4 completo, esperar nueva aprobación

---

## FASE 2: Documentación Backend (Est. 2h OpenCode + 30 min Claude)

### Objetivo
Crear 2 archivos backend específicos de Nomina: README (nivel 1) + Técnica (nivel 2).

### Paso 2.1: Backend README.md (Nivel 1 - Operativo)
**Tiempo:** 1 hora

**Crear archivo:** `api/LuxuryApp.Application/Moduls/NominaLuxuryApp/README.md`

**Estructura (copiar de):** `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/README.md`

**Llenar secciones (con datos de Nomina):**

1. **Propósito Funcional** (2-3 párrafos):
   - Qué es Nomina (gestión de salarios, liquidaciones)
   - Actores involucrados (Admin, Manager, HR)
   - Dependencias (Empleados, Periodos, Configuración salarial)

2. **Endpoints Principales** (tabla):
   ```markdown
   | Endpoint | Método | Descripción | [Authorize] |
   |----------|--------|-----------|-----------|
   | `/api/nomina/periodos` | GET | Lista periodos | Admin |
   | `/api/nomina/periodos` | POST | Crear periodo | Admin |
   | `/api/nomina/nominas` | GET | Listar nóminas | Manager |
   | `/api/nomina/nominas/{id}/liquidar` | POST | Liquidar nómina | Admin |
   | `/api/nomina/reportes/resumen` | GET | Resumen salarios | Manager |
   ```

3. **Actores y Responsabilidades** (tabla):
   ```markdown
   | Actor | Responsabilidades |
   |-------|------------------|
   | Admin | Crear periodos, aprobar nóminas, configurar políticas |
   | Manager | Revisar nóminas, validar datos empleados |
   | RH | Mantener datos de empleados, salarios |
   ```

4. **Dependencias con Otros Módulos** (lista):
   - Recurso Humanos: Empleados, departamentos
   - Empleador: Datos de empresa, centros de costo
   - Contabilidad (futura): Integración de asientos

5. **Reglas de Negocio Principales** (tabla con RN-NOM-):
   Copiar desde auditoría (Paso 1.4):
   ```markdown
   | RN | Descripción | Validación |
   |----|-----------|-----------|
   | RN-NOM-001 | Periodo requiere inicio/fin definido | BD |
   | RN-NOM-002 | Solo Admin crea periodos | [Authorize("Admin")] |
   | RN-NOM-003 | Empleado activo para incluir en nómina | Service |
   | ... | ... | ... |
   ```
   **Mínimo: 10 RNs**

6. **Estructura de Carpetas:**
   ```
   NominaLuxuryApp/
   ├── Models/
   │   ├── Periodo.cs
   │   ├── Nomina.cs
   │   ├── Liquidacion.cs
   │   └── ...
   ├── DTOs/
   │   ├── CreatePeriodoDTO.cs
   │   ├── NominaDTO.cs
   │   └── ...
   ├── Endpoints/
   │   ├── PeriodoEndpoints.cs
   │   ├── NominaEndpoints.cs
   │   └── ...
   ├── Services/
   │   ├── NominaService.cs
   │   ├── LiquidacionService.cs
   │   └── ...
   └── README.md (este archivo)
   ```

7. **Validaciones Principales** (tabla):
   ```markdown
   | Campo | Validación | Lugar |
   |-------|-----------|-------|
   | Salario | > 0, MaxLength 15 | DTO + Service |
   | Porcentaje | 0-100 | DTO |
   | NumeroDocumento | Único | Service + BD Index |
   ```

8. **Permisos & Seguridad:**
   - [Authorize("Admin")] : Crear/Editar periodos
   - [Authorize("Manager")] : Ver nóminas
   - [Authorize("Admin")] : Liquidar
   - Validación: Usuario solo ve su departamento

9. **Referencias a CONVENTIONS.md:**
   - "§4.5 Documentación de módulos"
   - "§5.8 Auditoría exhaustiva"
   - "§2 Precedencia documental"

10. **Línea final:**
    ```markdown
    **Última revisión:** 2026-08-10
    **Auditoría:** docs/reporte_maestro/modulos/20260810-auditoria-nomina.md
    ```

**Guardar en control_log:**
```
FASE 2 Paso 2.1 COMPLETADO
Archivo creado: api/LuxuryApp.Application/Moduls/NominaLuxuryApp/README.md
Líneas: [aproximadas]
RNs documentadas: [número]
Endpoints en tabla: [número]
```

**Criterio de Validación:**
- [ ] Archivo existe: api/LuxuryApp.Application/Moduls/NominaLuxuryApp/README.md
- [ ] ≥10 RNs documentadas (grep "RN-NOM-" README.md)
- [ ] ≥5 endpoints en tabla
- [ ] Sección de permisos explícita
- [ ] ≥3 referencias a CONVENTIONS.md
- [ ] Línea "Última revisión: 2026-08-10"

**Si NO:**
- ❌ Comparar con Candidates README.md línea por línea
- Revisar estructura de carpetas real
- Reportar qué falta a Claude

**Si SÍ:**
- ✅ Guardar en control_log
- Continuar a 2.2

---

### Paso 2.2: Backend Documentación Técnica
**Tiempo:** 1 hora

**Crear archivo:** `api/LuxuryApp.Application/Moduls/NominaLuxuryApp/Docs/documentacion-nomina.md`
(Crear carpeta `Docs/` en NominaLuxuryApp si no existe)

**Estructura (copiar de):** `api/LuxuryApp.Application/Moduls/ReclutamientoLuxuryApp/Candidates/Docs/documentacion-candidates.md`

**Llenar secciones:**

1. **Resumen Ejecutivo** (1 párrafo):
   - Módulo de gestión de nóminas: periodos, cálculos, liquidaciones

2. **Visión Funcional** (2-3 párrafos):
   - Pipeline: Crear Periodo → Incluir Empleados → Calcular Nómina → Liquidar
   - Estados posibles: Abierto, Cerrado, Liquidado
   - Cálculos: Salario base + deducciones + bonificaciones

3. **Arquitectura Técnica:**
   - **Entidades principales** (con relaciones):
     ```
     Periodo (1) ─→ (N) Nomina
     Nomina (1) ─→ (N) Liquidacion
     Empleado (N) ─→ (1) Nomina
     ```
   - **Enums:**
     ```csharp
     enum PeriodoStatus { Abierto, Cerrado, Liquidado }
     enum TipoDeduc { AFP, Impuesto, Otro }
     ```

4. **Endpoints Documentados** (3-5 principales con body/response):
   
   **Ejemplo 1: GET /api/nomina/periodos**
   ```markdown
   **Descripción:** Lista todos periodos
   **Autorización:** Admin
   **Response:**
   ```json
   {
     "data": [
       {
         "id": "uuid",
         "inicio": "2026-01-01",
         "fin": "2026-01-31",
         "status": "Abierto"
       }
     ]
   }
   ```
   **Errores posibles:** 401 Unauthorized, 403 Forbidden
   ```

   **Ejemplo 2: POST /api/nomina/periodos**
   ```markdown
   **Descripción:** Crear nuevo periodo
   **Autorización:** Admin
   **Body:**
   ```json
   {
     "inicio": "2026-01-01",
     "fin": "2026-01-31",
     "nombre": "Enero 2026"
   }
   ```
   **Response:** 201 Created
   **Validaciones:**
   - Inicio < Fin
   - No sobrelapar con otro periodo
   ```

   (Documentar 3-5 endpoints así)

5. **Flujos del Sistema** (diagramas ASCII):
   ```
   Flujo de liquidación:
   ┌──────────────┐
   │ Periodo      │ Admin crea
   │ (Abierto)    │
   └──────┬───────┘
          │
          │ RH añade empleados + salarios
          v
   ┌──────────────┐
   │ Nomina       │ Sistema calcula
   │ (Borrador)   │ salarios
   └──────┬───────┘
          │
          │ Manager revisa
          v
   ┌──────────────┐
   │ Nomina       │ Admin aprueba
   │ (Revisada)   │
   └──────┬───────┘
          │
          │ Ejecutar liquidación
          v
   ┌──────────────┐
   │ Liquidacion  │ Completado
   │ (Pagado)     │
   └──────────────┘
   
   Validaciones por fase:
   ├─ Abierto: Salarios válidos, empleados activos
   ├─ Borrador: Cálculos correctos
   ├─ Revisada: Permisos de aprobación
   └─ Pagado: Integridad de datos
   ```

6. **Entidades & Propiedades:**
   ```markdown
   ### Periodo
   - Id: UUID
   - Inicio: DateTime
   - Fin: DateTime
   - Status: PeriodoStatus
   - CreatedDate: DateTime
   - Nominas: List<Nomina> (1:N)

   ### Nomina
   - Id: UUID
   - PeriodoId: UUID (FK)
   - EmpleadoId: UUID (FK)
   - SalarioBruto: decimal
   - Deducciones: decimal
   - Neto: decimal
   - Status: NominaStatus
   - Periodo: Periodo (Nav)

   ### Liquidacion
   - Id: UUID
   - NominaId: UUID (FK)
   - FechaPago: DateTime
   - Monto: decimal
   ```

7. **Servicios & Métodos Clave** (tabla):
   ```markdown
   | Servicio | Método | Descripción | Retorna |
   |----------|--------|-----------|---------|
   | NominaService | CalcularSalario() | Calcula neto | decimal |
   | NominaService | ValidarPrerequisitos() | Valida estado | bool |
   | LiquidacionService | EjecutarLiquidacion() | Procesa pago | Liquidacion |
   | PeriodoService | CerrarPeriodo() | Cierra periodo | void |
   ```

8. **Base de Datos:**
   ```markdown
   **Índices:**
   - PK Periodo(Id)
   - FK Nomina.PeriodoId
   - UNIQUE Periodo(Inicio, Fin)
   - INDEX Nomina.Status
   
   **Constraints:**
   - Periodo.Inicio < Periodo.Fin
   - Nomina.SalarioBruto >= 0
   ```

9. **Checklist de Validación:**
   - [ ] Salarios calculados correctamente
   - [ ] Deducciones aplicadas
   - [ ] No hay duplicados en periodo
   - [ ] Estados transicionan correctamente

10. **Línea final:**
    ```markdown
    **Última revisión:** 2026-08-10
    **Auditoría:** docs/reporte_maestro/modulos/20260810-auditoria-nomina.md
    ```

**Guardar en control_log:**
```
FASE 2 Paso 2.2 COMPLETADO
Archivo creado: api/LuxuryApp.Application/Moduls/NominaLuxuryApp/Docs/documentacion-nomina.md
Líneas: [aproximadas]
Endpoints documentados: 5
Entidades: 3
Servicios: 4
```

**Criterio de Validación:**
- [ ] Archivo existe: api/.../Docs/documentacion-nomina.md
- [ ] ≥3 endpoints documentados con body + response
- [ ] Modelo de datos documentado (≥3 entidades)
- [ ] Diagramas ASCII presentes (≥1)
- [ ] Tabla de servicios con ≥5 métodos
- [ ] Índices de BD documentados
- [ ] Línea "Última revisión: 2026-08-10"

**Si NO:**
- ❌ Revisar estructura vs Candidates documentacion-candidates.md
- Ejemplos pueden estar en auditoría (Paso 1.4)
- Reportar a Claude

**Si SÍ:**
- ✅ Guardar en control_log
- **[[ PAUSA PARA AUDITORÍA FASE 2 ]]**
- Esperar aprobación de Claude

---

### Validación FASE 2 (Claude - 30 min)

Claude verifica:

1. ¿README.md tiene ≥10 RNs específicas de Nomina?
2. ¿Documentación técnica referencia código REAL?
3. ¿Diagramas ASCII son útiles?
4. ¿No hay copy-paste ciego de Candidates?

**Resultado:**
- ✅ **APROBADO:** Ir a FASE 3
- ⚠️ **APROBADO CON CORRECCIONES:** OpenCode/KiloCode aplica feedback (max 20 min)
- ❌ **RECHAZADO:** Re-hacer archivo específico

---

## FASE 3: Documentación Frontend (Est. 2h OpenCode + 30 min Claude)

**Tiempo:** 2 horas

### Paso 3.1: Frontend README.md (Operativo)
**Tiempo:** 40 min

**Crear:** `client/angular/src/app/apps/nomina.luxuryapp/docs/README.md`
(Crear carpeta docs/ si no existe)

**Plantilla:** `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/docs/README.md`

**Llenar:**
1. Propósito del módulo
2. Rutas (localhost:4200/nomina/*, /nomina/periodos, etc.)
3. Estructura de carpetas (components, services, models)
4. Componentes (NominaListComponent, PeriodoFormComponent, etc.)
5. Servicios (NominaService, PeriodoService)
6. Data flow (Observable → Store → Signal)
7. Enums/Estados (PeriodoStatus, NominaStatus)
8. Smoke test (crear periodo → nómina → liquidar)
9. Debugging tips

**Criterio:** 6 items presentes, diagramas ASCII, lines ≥300

---

### Paso 3.2: Frontend setup.md (Onboarding 30 min)
**Tiempo:** 40 min

**Crear:** `client/angular/src/app/apps/nomina.luxuryapp/docs/setup.md`

**Plantilla:** `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/docs/setup.md`

**Llenar:**
1. Dev nuevo: 30 min
2. Lectura orden: setup → README → decisiones
3. Estructura memorizar (5-8 carpetas)
4. Primer cambio (agregar columna "Departamento")
5. Backend reference paths
6. Debugging flowchart
7. 4 common mistakes
8. Git workflow

**Criterio:** Walkthrough ejecutable, flowchart, mistakes

---

### Paso 3.3: Frontend decisiones.md (Matriz)
**Tiempo:** 40 min

**Crear:** `client/angular/src/app/apps/nomina.luxuryapp/docs/decisiones.md`

**Plantilla:** `client/angular/src/app/apps/reclutamiento.luxuryapp/candidates/docs/decisiones.md`

**Llenar:**
1. ¿Es visual/lógica? Matriz ASCII
2. 4-5 ejemplos (mostrar "Salario editado" badge, validar porcentaje, etc.)
3. 7 reglas irrompibles
4. Checklist antes crear archivo
5. Commands rápidos
6. Example flow (descargar recibo PDF)
7. Cuándo preguntar al Tech Lead

**Criterio:** ≥4 ejemplos, matriz ASCII, rules

---

**Validación FASE 3:**

Mismo proceso que FASE 2 (Claude revisa, aprueba/rechaza)

---

## FASE 4: Validación Cruzada (Est. 1h OpenCode + 30 min Claude)

### Paso 4.1-4.3: (Seguir PLAN_TEMPLATE_DELEGACION.md)

Verificar 6 archivos existen, contenido coherente, cross-references correctas.

**Criterio:** Todos 6 archivos ✅, grep validations pasan

---

## CIERRE (30 min)

- [ ] Commit con 6 archivos
- [ ] Mensaje referencia plan + auditoría
- [ ] MEMORY.md actualizada
- [ ] control_log cerrado

---

## 📞 Contacto During Execution

**Si OpenCode no sabe:**
1. "¿Qué busco?" → Ve docs/audit/AUDIT_CHECKLIST_COMPLETO.md
2. "¿Estructura?" → Ve paso correspondiente en este plan
3. "¿Está bien?" → Valida vs criterio de validación
4. "Duda → Contacta Claude" → Pausa plan, espera feedback

---

**Plan Listo para OpenCode.**

Próximo: Entregar a OpenCode + abrir control_log

Última revisión: 2026-08-10
