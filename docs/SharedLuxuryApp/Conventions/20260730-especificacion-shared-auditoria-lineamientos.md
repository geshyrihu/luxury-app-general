# Nuevos Lineamientos de Auditoría (2026-07-30)

**Versión:** 2.0  
**Estado:** Vigente  
**Aplica a:** Todas las auditorías de módulos desde 2026-07-30  
**Referencia:** `docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md`

---

## Cambio Principal

Las auditorías ahora son **exhaustivas y documentadas**. No solo verifican cumplimiento, sino que **extraen, documentan y validan** 4 elementos críticos:

1. **Reglas de Negocio encontradas** (con o sin FASE 0)
2. **Matriz de roles** por funcionalidad
3. **Errores de coherencia** en flujos
4. **Dudas técnicas** / reglas faltantes

---

## Los 4 Nuevos Reportes Obligatorios

### 1️⃣ REPORTE: Reglas de Negocio Encontradas

**Objetivo:** Descubrir TODAS las RN que el módulo implementa.

**Estructura:**

```markdown
## Tabla de Reglas de Negocio Implementadas

| ID | Descripción | Nivel | Backend | Frontend | Documentada |
|:---|:---|:---|:---|:---|:---|
| RN-MOD-001 | Aforo máximo: 50 | 1-Invariante | services/Aforo.cs:42 | N/A | ✓ FASE 0 |
| RN-MOD-002 | Estados: PENDING→APPROVED→IN_USE | 2-Flujo | entities/Reserva.cs:15-30 | form.component | ✓ FASE 0 |
| RN-MOD-003 | Solo SuperUsuario/Contador anulan | 3-Seguridad | endpoint:Delete:78 | actions | ✗ Implícita |
| RN-MOD-004 | Email valido RFC 5322 | 4-Validación | validators/Email.cs | form.component | ✓ FASE 0 |
```

**Cómo extraerlas:**

```bash
# SI EXISTE FASE 0:
  Copiar tabla de ../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md
  Verificar cada RN está en código

# SI NO EXISTE FASE 0:
  Buscar restricciones en código (throw, return null, if/switch)
  Buscar validaciones (Length, Pattern, Range)
  Buscar flujos (estados, transiciones)
  Buscar seguridad (roles, autenticación)
  Documentar TODAS como "Implícitas"
```

**Validación:**

- [ ] ¿Todas las RN encontradas están en la tabla?
- [ ] ¿Cada RN tiene ID único (RN-MOD-NNN)?
- [ ] ¿Cada RN está clasificada en nivel 1-4?
- [ ] ¿Cada RN tiene ubicación exacta (archivo:línea)?
- [ ] ¿Se indica si está en FASE 0 o es implícita?

---

### 2️⃣ REPORTE: Matriz de Roles por Funcionalidad

**Objetivo:** Documentar qué roles están involucrados en cada acción.

**Estructura:**

```markdown
## Matriz de Roles por Funcionalidad

| Funcionalidad | Endpoint/Componente | Roles Permitidos | Roles Restringidos | Status |
|:---|:---|:---|:---|:---|
| **VER** Reservas | GET `/api/reservas` | SuperUsuario, Direccion, Admin, Condomino | - | ✓ |
| **CREAR** Reserva | POST `/api/reservas` | Condomino (zona propia) | - | ✓ |
| **EDITAR** Reserva | PUT `/api/reservas/{id}` | SuperUsuario, Admin | Condomino (solo propia) | ⚠️ |
| **ANULAR** Reserva | DELETE `/api/reservas/{id}` | SuperUsuario, Contador | Condomino | ✓ |
| **EXPORTAR** Reportes | GET `/api/reportes/export` | SuperUsuario, Direccion, Contador | Condomino | ⚠️ |
```

**Cómo extraerlas:**

```bash
# BACKEND:
grep -r "Authorize\|Role.*=\|RequireRole" {backend_path}

# FRONTEND:
grep -r "hasRole\|allowedRoles\|currentUser" {frontend_path}

# VERIFICAR EN CÓDIGO:
ApplicationRoleEnum.cs → Catálogo de roles (application-roles-catalog.md)
```

**Validación:**

- [ ] ¿Cada funcionalidad tiene roles documentados?
- [ ] ¿Los roles usados están en `application-roles-catalog.md`?
- [ ] ¿La restricción está implementada (código + frontend)?
- [ ] ¿Frontend y Backend tienen los mismos roles permitidos?
- [ ] ¿Se documenta si hay restricción adicional (ej: "solo datos propios")?

---

### 3️⃣ REPORTE: Errores de Coherencia en Flujos

**Objetivo:** Identificar inconsistencias lógicas, transiciones inválidas, race conditions.

**Checklist de Coherencia (verificar CADA estado):**

```markdown
## Coherencia de Flujos de Estado

Estado: PENDING
  [ ] ¿Se puede llegar a PENDING? (transición válida)
  [ ] ¿Desde qué estados se transiciona a PENDING?
  [ ] ¿Se valida el estado anterior antes de transicionar?
  [ ] ¿Se registra auditoría de la transición?

Estado: APPROVED
  [ ] ¿Se puede transicionar desde PENDING solamente?
  [ ] ¿Hay validaciones antes de APPROVED?
  [ ] ¿Se notifica al usuario de la transición?

Estado: IN_USE
  [ ] ¿Se puede llegar desde APPROVED?
  [ ] ¿Hay conflictos concurrentes posibles?
  [ ] ¿Se libera recurso al salir de este estado?

Estado: CLOSED
  [ ] ¿Puede cerrarse desde cualquier estado o solo ciertos?
  [ ] ¿Hay datos que se deben preservar?
  [ ] ¿Hay cleanup requerido?
```

**Estructura de Reporte:**

```markdown
## Errores de Coherencia Encontrados

| Tipo | Descripción | Línea | Severidad | Cómo reproducir |
|:---|:---|:---|:---|:---|
| Transición inválida | PENDING → CLOSED sin APPROVED | ReservaService.cs:123 | CRÍTICA | POST → UPDATE (skip APPROVED) |
| Validación faltante | No verifica fecha pasada | ReservaEndpoint.cs:45 | ALTA | POST con fecha < hoy |
| Race condition | Dos POSTs crean duplicados | ReservaRepository.cs:78 | ALTA | curl simultaneo x2 |
| Lógica contradictoria | VER sin CREAR permiso | ReportService.cs:200 | MEDIA | Ver reportes sin datos |
```

**Validación:**

- [ ] ¿Cada error tiene línea exacta?
- [ ] ¿Cada error es reproducible paso a paso?
- [ ] ¿Se indica severidad con justificación?
- [ ] ¿Se menciona impacto (ej: "afecta integridad de datos")?

---

### 4️⃣ REPORTE: Dudas Técnicas / Reglas Faltantes

**Objetivo:** Identificar áreas donde NO está clara la regla, o donde debería existir pero no está documentada.

**Indicadores de Dudas:**

```bash
# Valores hardcodeados (posible regla implícita)
grep -r "['\"].*[0-9]\+['\"]" | grep -E "limit|max|min|timeout|days"

# Comentarios que indican incertidumbre
grep -r "TODO\|FIXME\|XXX\|HACK\|BUG\|QUESTION"

# Lógica compleja sin comentarios
grep -B2 -A5 "if.*&&.*||" → ¿Se explica la lógica?
```

**Estructura de Reporte:**

```markdown
## Dudas Técnicas Identificadas

| ID | Descripción | Ubicación | Tipo | Impacto | Recomendación |
|:---|:---|:---|:---|:---|:---|
| DUDA-001 | ¿Máx 3 reservas/mes/condómino? | ReservaService.cs:56 | Hardcodeado | MEDIA | Convertir a RN-MOD-X o config |
| DUDA-002 | ¿Permitir sobrescribir reserva? | ReservaEndpoint.cs:89 | Lógica ambigua | ALTA | Aclarar en FASE 0 Nivel 2 |
| DUDA-003 | ¿Consecuencias de anular <24h? | ReservaService.cs:156 | Regla implícita | ALTA | Definir en FASE 0 Nivel 3 |
| DUDA-004 | ¿Reintentos BD en timeout? | ReservaRepository.cs:45 | Política desconocida | MEDIA | Documentar o implementar |
```

**Validación:**

- [ ] ¿Cada duda tiene impacto claro?
- [ ] ¿Cada duda tiene recomendación específica?
- [ ] ¿Las dudas críticas aparecen en el Plan de Acción?
- [ ] ¿Si afecta FASE 0, se propone nueva RN?

---

## Estructura Completa del Reporte

```
# AUDITORIA: [Módulo] (YYYYMMDD)

## RESUMEN EJECUTIVO
- Módulo: [Nombre]
- Período: [Fechas]
- Hallazgos: X CRÍTICA, Y ALTA, Z MEDIA, W BAJA
- Cumplimiento CONVENTIONS: X%
- Reglas de Negocio: X implementadas, Y implícitas, Z faltantes

## 🏢 1. REGLAS DE NEGOCIO ENCONTRADAS
[TABLA: RN-MOD-001 → RN-MOD-NNN]
- Total: X
- En FASE 0: Y
- Implícitas: Z
- Faltantes: W

## 👥 2. MATRIZ DE ROLES POR FUNCIONALIDAD
[TABLA: Funcionalidad → Roles]
- Roles únicos: X
- Roles validados en catálogo: ✓
- Inconsistencias frontend/backend: Z halladas

## 🔄 3. ERRORES DE COHERENCIA EN FLUJOS
[TABLA: PRIM-NNN]
- CRÍTICA: X
- ALTA: Y
- Casos reproducibles: ✓

## ❓ 4. DUDAS TÉCNICAS / REGLAS FALTANTES
[TABLA: DUDA-NNN]
- Total: X
- Afectan FASE 0: Y
- Requieren RN nueva: Z

## 🔴 5. PROBLEMAS FUNCIONALES (RESUMEN)
- CRÍTICA: X (bloqueantes)
- ALTA: Y (frecuentes)
- MEDIA: Z (degradación)
- BAJA: W (mejora)

## 🔗 6. MATRIZ DE ALINEACIÓN FRONTEND/BACKEND
[TABLA: Endpoint → Componente]
- Desincronizaciones: X

## ✅ 7. CUMPLIMIENTO CONVENTIONS.md
Backend: X%
Frontend: Y%
Objetivo: 95%

## 🎯 8. PLAN DE ACCIÓN (FASES)
Fase 1 (1-2 sem): CRÍTICA + ALTA
Fase 2 (3-6 sem): MEDIA
Fase 3 (2+ meses): BAJA
Total Effort: XX SP

## 📈 MÉTRICAS
| Métrica | Valor | Target |
|:---|:---|:---|
| Test Coverage | X% | 80% |
| Cumplimiento | X% | 95% |
| Deuda Técnica | X SP | <30 |
```

---

## Checklist de Auditoría Exhaustiva

### Antes de iniciar:

- [ ] Verifico si módulo tiene FASE 0 (../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md)
- [ ] Si sí → copiar tabla de RN, verificar en código
- [ ] Si no → advertencia: "Reglas extraídas del código, posiblemente incompletas"

### Durante auditoría:

- [ ] STEP 2.1: Tabla de RN completa (documentadas + implícitas)
- [ ] STEP 2.2: Matriz de roles (todos los endpoints/componentes)
- [ ] STEP 2.3: Checklist de coherencia para CADA flujo
- [ ] STEP 2.4: Tabla de dudas técnicas (DUDA-NNN)
- [ ] Tabla de problemas funcionales (PRIM-NNN)
- [ ] Matriz de alineación frontend/backend
- [ ] % de cumplimiento CONVENTIONS por stack

### Antes de guardar:

- [ ] Verifico que todas las secciones están completadas
- [ ] Cada tabla tiene datos específicos (no vaguos)
- [ ] Cada fila tiene línea de código exacta (no aproximaciones)
- [ ] Severidades justificadas
- [ ] Plan de acción es ejecutable (no genérico)
- [ ] Sin typos ni referencias incorrectas

---

## Ejemplo de Dudas Bien Documentadas

### ❌ MAL:

```
DUDA-001: Falta documentación sobre límites
```

### ✅ BIEN:

```
DUDA-001: ¿Cuál es el límite máximo de reservas por condómino/mes?
  Ubicación: ReservaService.cs:56 (hardcoded a 3)
  Tipo: Valor hardcodeado → posible regla implícita
  Impacto: MEDIA (condómino no sabe por qué falla POST)
  Recomendación: 
    - Opción A: Convertir a RN-MOD-XYZ documentada en FASE 0 Nivel 4
    - Opción B: Mover a config (appsettings.json)
    - Opción C: Agregar mensaje de error claro (MAX_RESERVATIONS_EXCEEDED)
```

---

## Lineamientos para Agentes

### Cuando audites un módulo:

1. **Lee FASE 0 si existe** (../../../docs/CollectionsLuxuryApp/CobranzaOnline/20260805-business-rules-collections-cobranza-online.md)
2. **Extrae TODAS las RN** (documentadas + implícitas)
3. **Documenta roles** (quién puede hacer qué)
4. **Valida flujos** (transiciones, estados, race conditions)
5. **Identifica dudas** (reglas ambiguas, faltantes)
6. **Estructura el reporte** en las 8 secciones obligatorias
7. **Verifica completitud** con el checklist

### No hagas:

- ❌ Reportes vagos ("hay problemas con autorización")
- ❌ Tabla de RN sin ubicación de código
- ❌ Roles que no están en catálogo oficial
- ❌ Errores sin pasos para reproducir
- ❌ Dudas sin recomendación específica
- ❌ Plan de acción genérico (sin story points, timeline, propietario)

---

## Ejemplo de Reporte Completo

Ver: `docs/reporte_maestro/modulos/` (cuando esté disponible después de la próxima auditoría)

---

## Tiempo Estimado

| Fase | Duración | Acciones |
|---|---|---|
| PHASE 1 (Quick Check) | 15 min | Búsquedas, conteos |
| PHASE 2 (Deep Audit) | 2.5-3.5 h | 4 reportes + problemas + alignment |
| **TOTAL** | **2.75-3.75 h** | (aumentó 30 min por reportes nuevos) |

---

## Referencias

- [AUDIT_AGENT_INSTRUCTIONS.md](./AUDIT_AGENT_INSTRUCTIONS.md) — Instrucciones detalladas
- [application-roles-catalog.md](../../conventions/operations/application-roles-catalog.md) — Catálogo de roles
- [fase-0-business-rules-discovery.md](../../conventions/operations/fase-0-business-rules-discovery.md) — Cómo se generan RN
- [CONVENTIONS.md](../../CONVENTIONS.md) — Reglas del sistema

---

## FAQ

**P: ¿Qué pasa si el módulo no tiene FASE 0?**  
R: Se reporta como "Reglas extraídas del código, posiblemente incompletas". Se propone crear FASE 0 retroactivamente en Plan de Acción.

**P: ¿Todos los roles usados deben estar en application-roles-catalog.md?**  
R: Sí. Si hay rol no documentado, es hallazgo de auditoría.

**P: ¿Qué es una "duda técnica" vs "problema funcional"?**  
R:
- **Duda:** Regla ambigua o no clara ("¿Máx reservas = 3 o 5?")
- **Problema:** Implementación que viola regla ("Código permite 100 reservas")

**P: ¿Cuántas dudas técnicas es "normal"?**  
R: 1-5 dudas es normal en módulo mediano. >10 dudas sugiere que FASE 0 falta completitud.

---

*Documento: NUEVOS_LINEAMIENTOS_AUDITORIA_2026_07_30.md*  
*Versión: 2.0*  
*Vigente desde: 2026-07-30*  
*Próxima revisión: Después de primera auditoría con nuevos lineamientos*

