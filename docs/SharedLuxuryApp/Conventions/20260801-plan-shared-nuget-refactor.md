# 📋 Plan Formal: Refactorización de Dependencias NuGet (LuxuryApp API)

**Versión:** 1.0  
**Estado:** 🟡 Pendiente Aprobación Tech Lead  
**Fecha de Creación:** 2026-08-01  
**Última Actualización:** 2026-08-01  
**Responsable:** Tech Lead / Equipo Backend  
**Horizonte:** 6-8 semanas (4 fases)

---

## FASE 0: Pre-Planeación Obligatoria

### 0.1 Problem Statement + KPIs

#### Declaración del Problema

**Actualmente,** el equipo backend sufre de **dependencias no utilizadas, paquetes duplicados y fragmentación de proveedores** cuando intenta mantener y compilar la API LuxuryApp, lo que resulta en:

- ⚠️ **Compilación más lenta** (70+ paquetes, 4 solapamientos detectados)
- ⚠️ **Superficie de ataque ampliada** (vulnerabilidades transitivas en paquetes no usados)
- ⚠️ **Deuda técnica creciente** (legacy Dapper + EPPlus paralelo a EF Core + ClosedXML)
- ⚠️ **Mantenimiento bifurcado** (Newtonsoft.Json + System.Text.Json, PDF con 4 proveedores)
- ⚠️ **Binarios más pesados** (+25-30 MB innecesarios)
- ⚠️ **Startup más lento** (resolver 70 paquetes en bootstrap)

#### Baseline y Targets

| KPI | Baseline (Actual) | Target (Post-Refactor) | Delta | Timeline |
|---|---|---|---|---|
| Paquetes NuGet únicos | 70 | 60-65 | -5-10% | Semana 8 |
| Tamaño binario Release | ~800 MB | ~775-785 MB | -15-25 MB | Semana 8 |
| Tiempo compilación (Release) | ~120s | ~110-115s | -5-10s (-5-8%) | Semana 8 |
| Vulnerabilidades CVE (transitivas) | ~15-20 potenciales | ~5-10 potenciales | -50% | Semana 8 |
| Paquetes con uso verificado | 39 de 70 (56%) | 60-65 de 60-65 (100%) | +100% | Semana 8 |
| Ciclos de deuda técnica (solapamientos) | 4 detectados | 0-1 (solo PostgreSQL dual) | -75% | Semana 8 |

**Ahorro estimado de esfuerzo futuro:** 4-6h/sprint en mantenimiento y resolución de conflictos de dependencias.

---

### 0.2 Matriz de Reglas de Negocio (4 Niveles Jerárquicos)

**Nota:** Para refactorización técnica, las "reglas de negocio" se traducen a "principios técnicos de arquitectura":

#### Nivel 1: Invariantes de Dominio (Restricciones Inmutables)

| RN-REF-001 | **Unicidad de ORM** | El proyecto usa **Entity Framework Core como ORM primario**. No coexisten Dapper + EF Core sin plan migratorio. |
| RN-REF-002 | **Unificación JSON** | El serializer **System.Text.Json es el primario**. Newtonsoft.Json se reduce a legacy/fallback graduales. |
| RN-REF-003 | **Consolidación PDF** | Maximal 3 proveedores PDF: QuestPDF (reportes), iText (legal/firma), UglyToad (lectura). Eliminar PdfSharpCore. |
| RN-REF-004 | **Singletons de BD** | Hangfire.SqlServer **se mantiene durante migración PostgreSQL**; se elimina post-cutover (30+ días sin lecturas). |

#### Nivel 2: Flujo y Estados (Ciclo de Vida, Transiciones Válidas)

| RN-REF-010 | **Estados de paquete** | Paquete: [Auditado] → [Bajo Uso Verificado] → [Consolidable/Eliminable] → [Ejecutar] → [Verificar] |
| RN-REF-011 | **Criterios de paso FASE 1** | Paquete entra FASE 1 solo si: grep=0 (sin uso) ó uso claramente legacy ó es transitivo redundante. |
| RN-REF-012 | **Criterios de paso FASE 2** | Consolidación requiere: código migrado + tests verdes + diff auditado + aprobación Code Review. |
| RN-REF-013 | **Criterios de paso FASE 3/4** | Cambios en shared/contrato requieren análisis de impacto + plan de migracion + validación de clientes (frontend). |

#### Nivel 3: Seguridad/Autorización (RBAC, Auditoría)

| RN-REF-020 | **Permisos de cambio** | Solo Tech Lead aprueba cambios a csproj en proyectos compartidos (Application, Shared, Infrastructure.Data). |
| RN-REF-021 | **Auditoría de cambio** | Cada PR que toca paquete: incluir registro de cambios (antes/después, justificación). |
| RN-REF-022 | **Validación transitiva** | Pre-commit: verificar que no hay referencias a paquetes eliminados (`grep -r "using OldPackage"`). |

#### Nivel 4: Validación de Datos (Formatos, Límites, Constraints)

| RN-REF-030 | **Versión mínima paquete** | No instalar versiones < 10.0.0 de paquetes Microsoft.* (NET 10.0); no mezclar 9.x con 10.x. |
| RN-REF-031 | **Compilación exitosa** | Criterio de paso: `dotnet build -c Release` sin errores ni warnings críticos (CA1xxx). |
| RN-REF-032 | **Cobertura de tests** | 100% de tests pasen: unitarios + integración + compilación Release (no solo Debug). |

---

### 0.3 Pre-Mortem + Flujos Críticos

#### Pre-Mortem: "¿Qué puede salir mal?"

1. **Escenario 1: Error de compilación por referencia olvidada**
   - **Causante:** Eliminar paquete sin buscar todas las referencias (ej: PdfSharpCore usado en lugar inesperado)
   - **Mitigación:** Script de búsqueda pre-eliminación, Code Review obligatorio

2. **Escenario 2: Regresión en feature de reportes**
   - **Causante:** Consolidación PDF mal ejecutada (ej: migrar QuestPDF sin probar casos edge)
   - **Mitigación:** Tests de integración para cada formato PDF, rollback plan en cada PR

3. **Escenario 3: Breaking change para frontend**
   - **Causante:** Cambio en contrato de serialización JSON (ej: Newtonsoft → System.Text.Json sin compatibilidad)
   - **Mitigación:** Deprecación gradual, feature flags, validación con cliente frontend

4. **Escenario 4: Conflicto con migración PostgreSQL**
   - **Causante:** Eliminar Hangfire.SqlServer antes de que PostgreSQL esté 100% operativo
   - **Mitigación:** Bloqueo de FASE 4 hasta post-cutover confirmado + 30+ días de monitoreo

---

## 1. Resumen Ejecutivo

### Situación Actual

La API LuxuryApp (.NET 10.0) gestiona **70 paquetes NuGet únicos** distribuidos en 8 proyectos. Auditoría identificó:

- ✅ **39 paquetes activos** (56%): uso verificado en código
- ⚠️ **18 paquetes de bajo uso** (26%): candidatos a verificación profunda
- 🔴 **4 solapamientos críticos** (PDF, Excel, JSON, Hangfire Storage)
- 🔴 **5 candidatos a "Build vs. Buy"** (Azure.Extensions, EPPlus, Dapper, PdfSharpCore, Ical.Net)

### Impacto Previsto

| Dimensión | Impacto |
|---|---|
| **Reducción de binario** | -15-25 MB (-2-3% del total) |
| **Mejora compilación** | -5-10s (-5-8% del tiempo) |
| **Reducción CVE** | -50% vulnerabilidades transitivas |
| **Deuda técnica** | -75% en ciclos de mantenimiento |
| **Esfuerzo anual** | -4-6h/sprint en resolución conflictos |

### Decisión Ejecutiva

✅ **APROBAR plan para ejecución inmediata.** Comenzar FASE 1 en siguiente sprint con bajo riesgo y validación continua.

---

## 2. Objetivo

Eliminar dependencias no utilizadas, consolidar paquetes duplicados y simplificar la arquitectura de dependencias de LuxuryApp API, reduciendo deuda técnica, vulnerabilidades transitivas y tiempo de compilación.

**Objetivo Específico:** De 70 paquetes no auditados → 60-65 paquetes 100% auditados y justificados.

---

## 3. Alcance

### Incluído

✅ Auditoría de 70 paquetes NuGet en 8 proyectos (.NET 10.0)  
✅ Eliminación de paquetes sin uso real (FASE 1)  
✅ Consolidación de proveedores duplicados (FASE 2)  
✅ Migraciones de código (Dapper → EF Core, EPPlus → ClosedXML)  
✅ Actualización de documentación de dependencias  
✅ Tests de validación post-cambio  
✅ Planes de rollback por fase

### NO Incluído (Out of Scope)

❌ Migración SQL Server → PostgreSQL (es iniciativa separada, pero afecta FASE 4)  
❌ Cambio de ORM (EF Core es estándar actual)  
❌ Cambios mayor frameworks (ASP.NET Core, Angular, etc.)  
❌ Refactor de módulos de negocio (solo paquetes)  
❌ Cambios en APIs públicas (frontend ↔ backend)

---

## 4. Restricciones

| Restricción | Impacto | Mitigación |
|---|---|---|
| **No romper contratos sensibles** | Newtonsoft.Json, serialización JSON | Migración gradual, feature flags, validación frontend |
| **Hangfire dual durante migración BD** | SQL Server + PostgreSQL en paralelo | FASE 4 bloqueada hasta post-cutover PostgreSQL |
| **Shared/DTOs no modificables sin análisis** | Impacto cascada en módulos | Análisis de impacto pre-cambio, aprobación Tech Lead |
| **Tests deben pasar 100%** | Validación pre-commit | Ejecutar suite completa (unit + integration + compile) |
| **No amend a commits publicados** | Historial limpio | Crear commits nuevos para correcciones |

---

## 5. Fases de Implementación

### FASE 1: REMOCIONES DE BAJO RIESGO (3-5 días, 1 sprint)

**Duración:** 3-5 días (1 sprint)  
**Esfuerzo:** ~1.5 h/developer  
**Riesgo:** 🟢 Muy Bajo

**Objetivo:** Limpiar 2-3 paquetes sin uso real con 100% confianza.

#### Tarea 1.1: Eliminar Microsoft.Extensions.Configuration.Json

**Archivo:** `api/LuxuryApp.Infrastructure.Data/LuxuryApp.Infrastructure.Data.csproj`

**Pasos:**

```bash
# 1. Verificar ausencia de uso
grep -r "AddJsonFile\|JsonConfigurationProvider" api/LuxuryApp.Infrastructure.Data --include="*.cs"
# Esperado: 0 resultados

# 2. Remover PackageReference en .csproj:
# <PackageReference Include="Microsoft.Extensions.Configuration.Json" Version="10.0.6" />

# 3. Compilar y validar
cd api/LuxuryApp.Infrastructure.Data
dotnet build
dotnet test ../../LuxuryApp.Tests

# 4. Git commit
git commit -m "refactor(nuget): remove redundant Microsoft.Extensions.Configuration.Json

- Configuration already loaded in Program.cs via AddJsonFile
- No direct usage in Infrastructure.Data project
- Reduces transitive dependencies

Audited by: docs/plans/20260801-nuget-refactorizacion-consolidacion-plan.md (2026-08-01)
Co-Authored-By: Tech Lead <tech-lead@example.com>"
```

**Criterio de paso:**
- ✅ `dotnet build -c Release` sin errores
- ✅ Todos los tests pasan
- ✅ Grep confirma 0 referencias al paquete

**Responsable:** Cualquier developer  
**Timeline:** 15 minutos

---

#### Tarea 1.2: Evaluar PdfSharpCore

**Archivo:** `api/LuxuryApp.Providers/LuxuryApp.Providers.csproj`

**Pasos:**

```bash
# 1. Búsqueda exhaustiva
grep -r "PdfSharpCore\|XGraphics\|PdfDocument" api/ --include="*.cs"
grep -r "using PdfSharpCore" api/ --include="*.cs"

# Si no hay resultados:
# 2. Remover paquete del csproj (igual que Tarea 1.1)
# 3. Compilar + tests
# 4. Commit

# Si hay resultados:
# - Documentar ubicaciones
# - Evaluar si se puede migrar a iText/QuestPDF
# - Crear sub-tarea en FASE 2 si es complejo
```

**Criterio de paso:**
- ✅ Decisión documentada (eliminar o migrar)
- ✅ Si se elimina: build verde + tests pasen

**Responsable:** Tech Lead + 1 Developer  
**Timeline:** 15-30 minutos

---

#### Tarea 1.3: Auditoria Azure.Extensions.AspNetCore.Configuration.Secrets

**Archivo:** `api/LuxuryApp.Api/LuxuryApp.Api.csproj`

**Pasos:**

```bash
# 1. Verificar referencias
grep -r "AzureKeyVault\|AddAzureKeyVault\|AddAzureAppConfiguration" api/ --include="*.cs"
grep -r "Azure.Extensions" api/ --include="*.cs"

# 2. Evaluar necesidad:
#    - Si grep = 0: ¿Es Azure Vault parte del plan futuro?
#      - Si sí: MANTENER (arquitectura preparada)
#      - Si no: ELIMINAR (paquete fantasma)

# 3. Documentar decisión en CAMBIOS_DEPENDENCIAS.log
```

**Criterio de paso:**
- ✅ Decisión explícita documentada
- ✅ Si ELIMINAR: build verde

**Responsable:** Tech Lead  
**Timeline:** 20 minutos

---

#### Tarea 1.4: Validación Integral FASE 1

**Pasos:**

```bash
# 1. Compilación Release completa
dotnet clean
dotnet build -c Release
# Verificar: 0 errores, warnings aceptables

# 2. Suite de tests
dotnet test api/LuxuryApp.Tests -c Release --no-build
# Verificar: 100% tests pasen

# 3. Análisis de dependencias (opcional)
dotnet list package --outdated
# Verificar: no hay dependencias inesperadas

# 4. Diff review
git diff api/ --stat
# Verificar: solo cambios en csproj + commit message correcto
```

**Criterio de paso:**
- ✅ Build Release: OK
- ✅ Tests: 100% pass
- ✅ Diff: clean

**Responsable:** QA + Tech Lead  
**Timeline:** 30 minutos

---

#### Tarea 1.5: Documentación FASE 1

**Crear archivo:** `docs/CAMBIOS_DEPENDENCIAS.log`

```
[2026-08-XX] FASE 1: Eliminaciones
- Microsoft.Extensions.Configuration.Json: ELIMINADO ✅ (redundante)
- PdfSharpCore: EVALUADO → [ELIMINAR|MANTENER|MIGRAR]
- Azure.Extensions.AspNetCore.Configuration.Secrets: EVALUADO → [ELIMINAR|MANTENER]

Tests: ✅ PASS (100%)
Build: ✅ OK (Release)

Commits relacionados:
- [hash] refactor(nuget): remove redundant Microsoft.Extensions.Configuration.Json
- [hash] refactor(nuget): evaluate PdfSharpCore [DECISION]
```

**Criterio de paso:**
- ✅ Log creado/actualizado
- ✅ Reporte marcado como "FASE 1 Completa"

**Responsable:** Tech Lead  
**Timeline:** 15 minutos

---

#### Checklist FASE 1

- [ ] Tarea 1.1 (Microsoft.Extensions.Configuration.Json): Completada ✅
  - [ ] Grep verificado (0 resultados)
  - [ ] csproj modificado
  - [ ] Build Release: OK
  - [ ] Tests: PASS
  - [ ] Commit: Creado y pusheado

- [ ] Tarea 1.2 (PdfSharpCore): Completada ✅
  - [ ] Búsqueda exhaustiva ejecutada
  - [ ] Decisión tomada (Eliminar/Mantener/Migrar)
  - [ ] Si ELIMINAR: build + tests OK
  - [ ] Documentación actualizada

- [ ] Tarea 1.3 (Azure.Extensions): Completada ✅
  - [ ] Evaluación técnica completada
  - [ ] Decisión documentada
  - [ ] Si ELIMINAR: build OK

- [ ] Tarea 1.4 (Validación Integral): Completada ✅
  - [ ] Build Release: ✅ OK
  - [ ] Tests suite: ✅ 100% PASS
  - [ ] Diff: ✅ Clean

- [ ] Tarea 1.5 (Documentación): Completada ✅
  - [ ] Log creado/actualizado
  - [ ] Reporte marcado
  - [ ] Links a commits en documentación

**Salida esperada:** 2-3 paquetes eliminados, 0 incidentes, preparación para FASE 2.

---

### FASE 2: CONSOLIDACIONES ESTRATÉGICAS (2-3 semanas, 2 sprints)

**Duración:** 2-3 semanas (2 sprints)  
**Esfuerzo:** ~8-10 h/developer  
**Riesgo:** 🟡 Medio

**Objetivo:** Consolidar paquetes duplicados (Excel, ORM) con refactor de código.

#### Tarea 2.1: Consolidar Excel (EPPlus → ClosedXML)

**Pasos (si hay uso):**

```bash
# 1. Auditar código EPPlus
grep -r "using OfficeOpenXml\|ExcelPackage" api/LuxuryApp.Application --include="*.cs"
# Anotar archivos y funciones

# 2. Para cada uso, migrar API:
# ANTES:  var pkg = new ExcelPackage();
#         worksheet.Cells[1, 1].Value = "ID";
#         return package.GetAsByteArray();
#
# DESPUÉS: var wb = new XLWorkbook();
#          ws.Cell("A1").Value = "ID";
#          using (var stream = new MemoryStream()) {
#            wb.SaveAs(stream);
#            return stream.ToArray();
#          }

# 3. Actualizar csproj (quitar EPPlus, mantener ClosedXML)

# 4. Validar
dotnet build -c Release
dotnet test api/LuxuryApp.Tests --filter "Excel"
```

**Criterio de paso:**
- ✅ Todos los archivos migrados
- ✅ Tests Excel: 100% PASS
- ✅ Build Release: OK
- ✅ Code Review aprobado

**Responsable:** Developer + Code Review  
**Timeline:** 4 horas

---

#### Tarea 2.2: Auditar y Migrar Dapper → EF Core

**Pasos (si hay uso significativo):**

```bash
# 1. Auditar código
grep -r "using Dapper\|SqlMapper\|connection\.Query" api/LuxuryApp.Application --include="*.cs"
# Contar archivos y funciones

# Si ≤3 ubicaciones:
# 2. Migrar a EF Core
# ANTES:  var results = connection.Query<AccountDTO>(sql, new { TenantId = id });
# DESPUÉS: var results = dbContext.Accounts
#            .FromSqlRaw(sql, id)
#            .Select(a => new AccountDTO { ... })
#            .ToList();

# 3. Actualizar csproj (quitar Dapper)
# 4. Validar
dotnet build -c Release
dotnet test api/LuxuryApp.Tests --filter "Data"
```

**Criterio de paso:**
- ✅ Dapper completamente migrado (o documentado como FASE 3)
- ✅ Tests: 100% PASS (especialmente data access)
- ✅ Build Release: OK
- ✅ Code Review aprobado

**Responsable:** Developer (Backend Senior recomendado)  
**Timeline:** 6 horas

---

#### Tarea 2.3: Validación Integral FASE 2

```bash
dotnet clean
dotnet build -c Release
dotnet test api/LuxuryApp.Tests -c Release --no-build
git diff api/ --stat
```

**Criterio de paso:** Mismo que FASE 1  
**Timeline:** 30 minutos

---

#### Tarea 2.4: Documentación FASE 2

**Actualizar:** `docs/CAMBIOS_DEPENDENCIAS.log`

```
[2026-08-XX] FASE 2: Consolidaciones

- EPPlus → ClosedXML: [EJECUTADO|EN PROGRESO|POSPUESTO]
  Archivos: ReportExcelService.cs (1 archivo, ~50 líneas)
  Tests: ✅ PASS
  
- Dapper → EF Core: [EJECUTADO|EN PROGRESO|POSPUESTO]
  Ubicaciones: 2 archivos (AccountRepository, LedgerService)
  Refactor estimado: 6h
  Tests: ✅ PASS
  
Impacto binario: -200KB aprox
Compilación: -3s aprox
```

**Timeline:** 15 minutos

---

#### Checklist FASE 2

- [ ] Tarea 2.1 (Excel): Completada
  - [ ] Uso de EPPlus identificado
  - [ ] Refactor completado
  - [ ] Tests Excel: ✅ PASS
  - [ ] Build: ✅ OK

- [ ] Tarea 2.2 (Dapper): Completada o Pospuesta
  - [ ] Uso identificado y catalogado
  - [ ] Refactor completado (si ≤3 ubicaciones)
  - [ ] Tests Data: ✅ PASS
  - [ ] Build: ✅ OK

- [ ] Tarea 2.3 (Validación): Completada ✅
  - [ ] Build Release: ✅ OK
  - [ ] Tests: ✅ 100% PASS
  - [ ] Dependencias: ✅ Clean

- [ ] Tarea 2.4 (Documentación): Completada ✅
  - [ ] Log actualizado
  - [ ] Reporte marcado como "FASE 2 Completa"

---

### FASE 3: MIGRACIONES A LARGO PLAZO (2-4 semanas)

**Duración:** 2-4 semanas (2-3 sprints)  
**Esfuerzo:** ~12-16 h/developer  
**Riesgo:** 🔴 Alto (cambios en contratos)

**Objetivo:** Migración gradual Newtonsoft.Json → System.Text.Json (si aplica).

**Nota:** Depende análisis de impacto y coordinación con Frontend.

---

### FASE 4: POST-MIGRACIÓN POSTGRESQL (1 semana, BLOQUEADA)

**🔴 BLOQUEANTE:** Solo procede si:
1. Migración PostgreSQL completada y validada
2. 30+ días sin lecturas de SQL Server (verificable en logs)
3. Todos los jobs migrados a PostgreSQL storage
4. Health check confirma PostgreSQL estable

**Tarea 4.1:** Verificación Pre-Eliminación
- Confirmar migración PostgreSQL completa
- Verificar 30+ días sin Hangfire.SqlServer reads
- Aprobación DevOps/Ops

**Tarea 4.2:** Eliminar Hangfire.SqlServer
```xml
<!-- Quitar de LuxuryApp.Api.csproj: -->
<PackageReference Include="Hangfire.SqlServer" Version="1.8.24" />

<!-- Mantener: -->
<PackageReference Include="Hangfire.PostgreSql" Version="1.21.1" />
```

**Tarea 4.3:** Monitoreo Post-Cambio (7 días)
- Daily health check: Hangfire dashboard OK
- Alert si hay fallos de jobs

---

## 6. Criterios de Paso por Fase

| Fase | Criterio | Señal Verde | Riesgo si falla |
|---|---|---|---|
| **FASE 1** | Build Release ✅ + Tests 100% ✅ | Próximo sprint inicia FASE 2 | Rollback 1 día, reauditoría |
| **FASE 2** | Build Release ✅ + Tests 100% ✅ + Code Review ✅ | Puede continuar FASE 3 | Rollback 2-3 días, refactor |
| **FASE 3** | Build Release ✅ + Frontend validado ✅ + Tests 100% ✅ | Puede proceder post-validación | +2 semanas análisis impacto |
| **FASE 4** | PostgreSQL stable ✅ + 30+ días sin SQL Server ✅ | Puede ejecutar eliminación | Rollback inmediato (1h) |

---

## 7. Riesgos y Mitigaciones

### Riesgo 1: Error de Compilación por Referencia Olvidada

**Probabilidad:** 🟡 Media | **Impacto:** 🔴 Alto

- **Mitigación:** Script búsqueda + Code Review + CI/CD
- **Rollback:** 1 minuto (`git revert`)

### Riesgo 2: Regresión en Reportes PDF/Excel

**Probabilidad:** 🟡 Media | **Impacto:** 🔴 Alto

- **Mitigación:** Tests integración + staging + verificación manual
- **Rollback:** 2-4 horas (revert + retest)

### Riesgo 3: Breaking Change para Frontend

**Probabilidad:** 🟡 Media | **Impacto:** 🔴 Alto

- **Mitigación:** Análisis impacto previo + Feature flag + validación Frontend Lead
- **Rollback:** 30 segundos (flag off)

### Riesgo 4: Eliminación Prematura Hangfire.SqlServer

**Probabilidad:** 🟢 Baja | **Impacto:** 🔴 Crítico

- **Mitigación:** FASE 4 bloqueada + verificación 30 días + aprobación DevOps
- **Rollback:** 5 minutos (revert + restart)

### Riesgo 5: Conflicto con Cambios Paralelos

**Probabilidad:** 🟡 Media | **Impacto:** 🟡 Medio

- **Mitigación:** Comunicación equipo + pequeños commits + rebase frecuente
- **Rollback:** 30 minutos (resolver conflicts)

---

## 8. Dependencias e Impactos

### Dependencias Externas

| Dependencia | Impacto | Mitigración |
|---|---|---|
| **Migración PostgreSQL** | Bloquea FASE 4 | FASE 4 pospuesta a post-cutover |
| **Validación Frontend** | Bloquea FASE 3 | Coordinar con Frontend Lead |
| **Code Review availability** | Retrasa FASE 1-2 | Asignar reviewer antes |
| **Testing resources** | Retrasa validación | QA presente en FASE 2-3 |

### Impacto en Módulos de Negocio

| Módulo | Impacto | Mitigración |
|---|---|---|
| **Reportes (Contabilidad)** | FASE 2 | Tests integración obligatorios |
| **Acceso (QR)** | No impactado | No action |
| **Hangfire (Jobs)** | FASE 4 | Bloqueo post-PostgreSQL |
| **Todos (Serialización)** | FASE 3 | Feature flag + validación front |

---

## 9. Cierre Esperado

### Timeline Estimada

| Fase | Inicio | Fin | Duración |
|---|---|---|---|
| FASE 0 (Auditoría) | 2026-07-25 | 2026-08-01 | 1 semana ✅ |
| FASE 1 (Remociones) | 2026-08-05 | 2026-08-09 | 1 semana |
| FASE 2 (Consolidaciones) | 2026-08-12 | 2026-08-26 | 2 semanas |
| FASE 3 (Migraciones Gradual) | 2026-09-02 | 2026-09-16 | 2 semanas |
| FASE 4 (Post-PostgreSQL) | 2026-10-15+ | - | 1 semana (bloqueada) |
| **TOTAL** | - | - | **6-8 semanas** |

### KPIs de Cierre

| KPI | Baseline | Target | Status |
|---|---|---|---|
| Paquetes NuGet | 70 | 60-65 | ⏳ |
| Binario Release | ~800 MB | ~775-785 MB | ⏳ |
| Compilación Release | ~120s | ~110-115s | ⏳ |
| Tests 100% PASS | Baseline | 100% | ⏳ |
| CVE transitivas | ~15-20 | ~5-10 | ⏳ |

---

## 10. Aprobación y Autorización

### Firmas Requeridas

| Rol | Responsable | Fecha | Firma |
|---|---|---|---|
| Tech Lead | [Nombre] | [Fecha] | [ ] |
| Frontend Lead | [Nombre] | [Fecha] | [ ] (FASE 3) |
| DevOps/Ops | [Nombre] | [Fecha] | [ ] (FASE 4) |
| Product Owner | [Nombre] | [Fecha] | [ ] |

### Estado de Aprobación

🟡 **PENDIENTE** — Esperar aprobación formal de Tech Lead antes de iniciar FASE 1.

---

## Anexo A: Referencias Relacionadas

- [CONVENTIONS.md](../../CONVENTIONS.md)
- [Plan Creation Protocol](../../conventions/operations/plan-creation-protocol.md)
- [Compliance Protocol](../../conventions/core/compliance-protocol.md)

---

**Documento creado:** 2026-08-01  
**Próxima revisión:** Post-FASE 1 (2026-08-09)
