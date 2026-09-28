# PLAN_AGENT_INSTRUCTIONS - Como Crear Planes

**Version:** 1.1
**Fecha:** 2026-07-30
**Audiencia:** Agentes IA que deben crear planes de implementacion
**Deriva de:** [CONVENTIONS.md](../CONVENTIONS.md)
**Protocolo rector:** [plan-creation-protocol.md](./plan-creation-protocol.md)

> Este documento funciona como plantilla operativa extensa para crear planes.
> La autoridad normativa primaria vive en `CONVENTIONS.md` y en
> `conventions/operations/plan-creation-protocol.md`.

---

## Resumen Ejecutivo

**Cada plan de implementacion de modulo debe:**
1. Tener **exactamente 11 secciones obligatorias**
2. Seguir **estructura canonica** (no inventar)
3. **Fase 0 (Pre-Planeacion) es obligatoria** antes de las secciones
4. Incluir **criterios de auditoria verificables** en cada fase
5. Ser **independiente** de cambios futuros en CONVENTIONS.md

**Tiempo estimado:** ~5 horas (Fase 0: 2h, Secciones 1-11: 3h)

---

## 11 Secciones Obligatorias

```
FASE 0: PRE-PLANEACION (OBLIGATORIA - 2 horas)
|
|-- 0.1 Problem Statement + KPIs
|-- 0.2 Matriz de Reglas de Negocio (4 niveles jerarquicos)
`-- 0.3 Riesgos + Pre-Mortem + Flujos (Happy/Sad/Edge Path)
|
SECCIONES 1-11 (3 horas)
|
|-- 1. Resumen Ejecutivo (Problem -> Solution -> Benefits)
|-- 2. Scope & Constraints
|-- 3. Arquitectura & Diseno Tecnico
|-- 4. Backlog de Tasks
|-- 5. Fases de Ejecucion (Sprint-based)
|-- 6. Criterios de Completitud
|-- 7. Riesgos & Mitigaciones
|-- 8. Dependencias Externas
|-- 9. Metricas & KPIs de Exito
|-- 10. Rollback Plan
`-- 11. Post-Implementation Review
```

---

## FASE 0: PRE-PLANEACION (Obligatoria)

### 0.1 Problem Statement + KPIs

**Formato disciplinado:**
```
Actualmente, [ACTOR] sufre de [PROBLEMA] cuando intenta [ACCION],
lo que resulta en [CONSECUENCIA].

Esto afecta a [USUARIOS/PROCESOS] en [ESCALA].
```

**Ejemplo:**
```
Actualmente, Admin sufre de "sin forma centralizada de gestionar accesos QR"
cuando intenta validar visitors en multiples puntos de entrada,
lo que resulta en "falta de auditoria y vulnerabilidades de seguridad".

Esto afecta a 5 sucursales con 200+ visitantes/dia.
```

**KPIs/OKRs (tabla)**

| Metrica | Baseline | Target | Timeline |
|:---|:---|:---|:---|
| Tiempo de validacion | 2 min/visitor | <30 seg | Sprint 1 |
| Auditoria coverage | 60% | 100% | Sprint 2 |
| False positives | 15% | <2% | Sprint 3 |

---

### 0.2 Matriz de Reglas de Negocio (4 Niveles Jerarquicos)

**Nivel 1: Invariantes de Dominio** (nunca pueden cambiar)
```
RN-MOD-001: "Todo visitor debe tener QR unico valido"
RN-MOD-002: "Acceso se revoca automaticamente al expirar validez"
```

**Nivel 2: Flujo y Estados**
```
RN-MOD-010: "Visitor puede estar en: PENDING -> CHECKED_IN -> ACTIVE -> CHECKED_OUT"
RN-MOD-011: "Transicion solo permitida en orden cronologico"
```

**Nivel 3: Seguridad/Autorizacion (RBAC/ABAC)**
```
RN-MOD-020: "Solo Admin/Manager pueden generar QR"
RN-MOD-021: "Guard solo puede validar, no generar"
RN-MOD-022: "Visitor solo ve su propio QR"
```

**Nivel 4: Validacion de Datos**
```
RN-MOD-030: "QR expira en 24h (configurable por tenant)"
RN-MOD-031: "Email valido segun RFC 5322"
RN-MOD-032: "Telefono 10 digitos formato +CC-XXXX-XXXX"
```

---

### 0.3 Riesgos + Pre-Mortem + Flujos

**Pre-Mortem:** "Asumimos que salio a produccion y fue un desastre. ?Que lo causo?"

| Supuesto Fallido | Impacto | Probabilidad | Mitigacion |
|:---|:---|:---|:---|
| QRCoder library incompatible con AOT | Sistema no corre | Media | Testear AOT en Sprint 0 |
| HMAC key exposure | Breach de seguridad | Baja | Usar Key Vault + rotation |
| Visitor table > 1M rows sin indices | Queries tardan >5s | Alta | Indice (created_at, tenant_id) |

**Happy Path:** Admin genera QR -> Visitor recibe -> Guard escanea -> Sistema valida -> Acceso otorgado -> Auditoria registrada

**Sad Path:** QR expirado -> Sistema rechaza -> Guard debe contactar supervisor -> Supervisor re-genera

**Edge Path:** QR duplicate scan en <1seg -> Sistema ignora segundo -> Auditoria registra ambos

---

## Secciones 1-11 (Despues de Fase 0)

### 1. Resumen Ejecutivo
**Salida de Fase 0:** Copiar Problem Statement + KPIs tal cual

### 2. Scope & Constraints
```
IN-SCOPE:
- Generacion de QR por Admin
- Validacion en puntos de entrada
- Auditoria de accesos

OUT-OF-SCOPE:
- Integracion con biometric (future: v2)
- Mobile app redesign (separate sprint)
```

### 3. Arquitectura & Diseno Tecnico

**Backend (.NET 10)**
- New table: `VisitorAccess` (tenant_id, qr_code_hash, expires_at, state)
- Endpoint: POST `/api/visitors/qr/generate`
- Endpoint: POST `/api/visitors/qr/validate`
- Indices: (tenant_id, expires_at), (qr_code_hash)

**Frontend (Angular 22)**
- Component: `app-qr-generator` (Signals-based)
- Component: `app-qr-scanner` (mobile-only, @zxing/ngx-scanner)

**Reglas de Negocio:** Mapear cada RN a componente/servicio

---

### 3.5 Migración de Datos & Prevención de Pérdida

**OBLIGATORIO si hay cambios que afecten datos (tablas nuevas, cambios de schema, refactorización).**

**Responsable:** Tech Lead (crear SQL, ejecutar, validar)

Referencia: [Data Migration Protocol](./data-migration-protocol.md)

#### 3.5.1 Cambios de Estructura

| Tabla | Cambio | Riesgo | Mitigación |
|:---|:---|:---|:---|
| VisitorAccess | Nueva tabla | Bajo (creación) | Crear con índices desde inicio |
| Users | Nullable → NOT NULL en email | ALTO | Backfill con validación |
| Audits | Desnormalizar campo count | CRÍTICO | Validar post-migración |

#### 3.5.2 Análisis de Pérdida de Datos

**¿Qué datos podrían perderse?**

```
Si email NOT NULL: Registros sin email rechazan INSERT
  Mitigación: Backfill email = "noespecificado@system.local" antes de agregar constraint

Si tabla se remueve: Todos los datos se pierden
  Mitigación: Backup completo, validación pre-migración
```

#### 3.5.3 Script de Migración (Crear antes de sprint)

Ubicación: `docs/migraciones/YYYYMMDD-modulo-cambio.sql`

```sql
-- RESPONSABLE: Tech Lead (ejecutar + validar)
-- Backup ANTES de ejecutar en producción

-- Step 1: Backup
BACKUP DATABASE [LuxuryApp] TO DISK = 'backup-20260730.bak'

-- Step 2: Crear tabla nueva
CREATE TABLE VisitorAccess (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  tenant_id UNIQUEIDENTIFIER NOT NULL,
  qr_code_hash NVARCHAR(256) NOT NULL,
  expires_at DATETIME NOT NULL,
  state NVARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT GETUTCDATE()
)

-- Step 3: Índices
CREATE INDEX idx_visitor_access_tenant_expires 
  ON VisitorAccess (tenant_id, expires_at)

-- Step 4: Validación
SELECT COUNT(*) FROM VisitorAccess
-- ESPERADO: 0 filas inicialmente, o N si se cargaron datos históricos
```

#### 3.5.4 Validación Post-Migración (CHECKLIST OBLIGATORIO)

**Ejecutado ANTES de ir a producción por Tech Lead:**

- [ ] Backup completado y verificado
- [ ] Migración ejecutada sin errores (sin exceptions)
- [ ] COUNT(filas) antes = COUNT(filas) después (si aplica)
- [ ] No hay NULLs inesperados en campos NOT NULL
- [ ] Validaciones de negocio pasan (ej: constraint checks)
- [ ] Queries críticas retornan datos correctos
- [ ] Performance: índices funcionan, query plan es eficiente
- [ ] Logs de auditoría están intactos (no borrados)
- [ ] Integridad referencial: no hay FK huérfanas
- [ ] Datos transformados coinciden con regla de negocio

#### 3.5.5 Rollback Plan (Si validación falla)

```sql
-- Tech Lead ejecuta:
RESTORE DATABASE [LuxuryApp] FROM DISK = 'backup-20260730.bak'
-- Notificar a agentes
-- Investigar causa
-- Ajustar script
-- Reintentar
```

#### 3.5.6 Comunicación Post-Migración

- [ ] Tech Lead confirma: "Migración exitosa, todas las validaciones PASS"
- [ ] Log de ejecución archivado en `docs/[ModuleLuxuryApp]/[Submodulo]/YYYYMMDD-changelog-[modulo]-[submodulo]-migracion.md` (estructura plana §6ter)
- [ ] Developers notificados si hay cambios en modelo de datos (.NET)
- [ ] Frontend actualizado si hay cambios en DTOs/API

### 3.6 Tokens de Diseño (Si tiene componentes UI)

**OBLIGATORIO si el módulo agrega componentes frontend o cambios visuales.**

Referencia: [Design Tokens Rule](../ui/design-tokens-rule.md)

#### 3.6.1 Tokens Requeridos

Listar TODOS los tokens CSS que el módulo consumirá:

**Colores:**
- Primary: `--primary-700` (headers, buttons)
- Status colors: `--success-600`, `--danger-600`, `--info-600`
- Backgrounds: `--surface`, `--surface-card`
- Borders: `--ds-border-default`

**Spacing:**
- Card padding: `--ds-space-lg` (16px)
- Form gaps: `--ds-space-md` (12px)
- Section margins: `--ds-space-xl` (24px)

**Tipografía:**
- Headers: `--font-size-title-lg` (20px, 600 weight)
- Body: `--font-size-body-md` (14px, 400 weight)
- Labels: `--font-size-label-md` (12px, 500 weight)

**Shadows:**
- Cards: `--ds-shadow-2` (default elevation)
- Modals: `--ds-shadow-3` (raised elevation)
- Focus: `--ds-shadow-focus-md` (keyboard navigation)

**Border Radius:**
- Buttons/Inputs: `--ds-radius-md` (8px)
- Cards: `--ds-radius-md` (8px)
- Modals: `--ds-radius-lg` (12px)

#### 3.6.2 Nuevos Tokens (Si se necesitan)

Si falta un token, documentar:
- Nombre propuesto (ej: `--status-pending-bg`)
- Valor hexadecimal + contraste (WCAG AAA)
- Ubicación para agregar (`src/styles/core/_colors.scss`)
- Justificación por qué es reutilizable globalmente

**REGLA:** Si solo lo usa este módulo, NO es token global. Usar variable local `:host {}` del componente.

#### 3.6.3 Validación Pre-Delivery (CRÍTICO)

**Antes de mergear cualquier PR frontend:**

- [ ] GREP: `grep -r "#[0-9A-F]\{6\}" src/app/{module}` → 0 resultados (NO hex hardcodeado)
- [ ] GREP: `grep -r "padding: [0-9]\|margin: [0-9]" src/app/{module}` → 0 resultados
- [ ] GREP: `grep -r "font-size: [0-9]" src/app/{module}` → 0 resultados
- [ ] GREP: `grep -r "box-shadow: 0" src/app/{module}` → 0 resultados
- [ ] GREP: `grep -r "border-radius: [0-9]" src/app/{module}` → 0 resultados
- [ ] Todos los valores visuales usan `var(--ds-*)` o `var(--primary-*)`, etc.

**Criterio de PASO:** ✓ si todos los GREP devuelven 0

---

### 4. Backlog de Tasks

Ej:
- [ ] Create VisitorAccess entity + migration
- [ ] Implement IVisitorAccessService
- [ ] Create POST /qr/generate endpoint
- [ ] Create POST /qr/validate endpoint
- [ ] Add audit logging
- [ ] Write unit tests (>80% coverage)
- [ ] E2E tests (happy + sad paths)
- [ ] Security review (QR exposure, HMAC)

### 5. Fases de Ejecucion (Sprint-based)

```
Sprint 1 (3 days):
  - BD migration + entity
- Service layer (validacion QR, expiracion)
  - Tests (>80%)
  Criterio de PASO: "Generate + Validate endpoints retornan 2xx/4xx/5xx segun RN"

Sprint 2 (2 days):
  - Frontend: QR generator
  - Auditoria
  - Criterio de PASO: "Admin puede generar, visitor recibe, log registra"
```

### 6. Criterios de Completitud
- [ ] >80% unit + integration test coverage
- [ ] 0 security findings (OWASP top 3)
- [ ] Auditoria de modulo PASS
- [ ] Performance: Validate QR <100ms (p99)

### 7. Riesgos & Mitigaciones
**Salida de Fase 0:** Tabla Pre-Mortem convertida a fila de riesgo con responsable

### 8. Dependencias Externas
- QRCoder library (verify AOT compatibility)
- Azure Key Vault (para tenant secrets)

### 9. Metricas & KPIs de Exito
**Salida de Fase 0:** Copiar KPIs tal cual

### 10. Rollback Plan
"Si falla validacion QR en produccion: rollback table, revert code, communicate to admins"

### 11. Post-Implementation Review
- ?Se cumplieron KPIs?
- ?Cuales fueron los riesgos reales vs supuestos?
- ?Que learnings para v2?

---

## Checklist Antes de Completar Plan

### Fase 0 & Estructura Base

- [ ] Fase 0 completada (Problem, KPIs, Reglas de Negocio 4 niveles, Pre-Mortem)
- [ ] 11 secciones tienen contenido verificable (NO placeholder)
- [ ] Cada RN esta mapeada a componente/servicio en la seccion 3

### Sección 3.5: Migración de Datos (SI APLICA)

- [ ] ¿Hay cambios de estructura/datos? → Sección 3.5 OBLIGATORIA
- [ ] ¿NO hay cambios de datos? → Sección 3.5 dice "No aplica"
- [ ] Si 3.5 existe:
  - [ ] Tabla de cambios documenta CADA modificación
  - [ ] Análisis de pérdida identifica riesgos (no genéricos)
  - [ ] Cada riesgo tiene mitigación específica
  - [ ] Script SQL existe en `docs/migraciones/YYYYMMDD-*.sql`
  - [ ] Script tiene Backup, Cambio, Validación, Rollback steps
  - [ ] Checklist post-migración es verificable (NO "parece correcto")
  - [ ] Tech Lead está asignado explícitamente
  - [ ] Sección 10 (Rollback) referencia backup de 3.5

### Validaciones Generales

- [ ] Criterios de Completitud son ejecutables (NO "de buena calidad")
- [ ] Plan es independiente de CONVENTIONS.md specifics (no "usar AutoMapper ProjectTo" si esta prohibido)
- [ ] Riesgos tienen responsable + mitigacion
- [ ] KPIs tienen target + timeline
- [ ] Total: ~5-6 paginas (Fase 0: 1.5p, Secciones 1-11: 3.5p, Migración: +0.5p si aplica)

---

## Errores Comunes (Evitar)

**"Problem statement vago"**
```
MAL:  "Queremos mejorar acceso de visitantes"
BIEN: "Actualmente [ACTOR] sufre de [PROBLEMA especifico] -> [CONSECUENCIA medible]"
```

**"Reglas de negocio sin nivel"**
```
MAL:  "Tener un QR por visitor"
BIEN: "RN-MOD-001 (Nivel 1 - Invariante): Todo visitor debe tener QR unico valido"
```

**"Criterios de completitud vagos"**
```
MAL:  "Codigo limpio", "Tests estan bien"
BIEN: ">80% unit test coverage", "Validate QR endpoint <100ms p99"
```

**"Plan ignora CONVENTIONS.md contradictions"**
```
MAL:  "Usar AutoMapper ProjectTo para proyecciones de consulta" (PROHIBIDO)
BIEN: "Usar .Select() manual en consultas; IMapper.Map solo en memoria (per backend-rules.md)"
```

---

## Proximos Pasos

1. **Tech Lead aprueba plan** - Fase 0 + secciones 1-3 son criticas
2. **Agentes implementan** - Siguiendo backlog de tasks
3. **Re-auditoria** - Verificar que codigo cumple cada RN
4. **Post-implementation** - Seccion 11 completada con resultados reales

---

**Estado:** Vigente desde 2026-07-28  
**Referencia:** `CONVENTIONS.md` y `conventions/agent-audit-protocol.md`  
**Proxima revision:** Cada nueva version de plan


