# FASE 0: Business Rules Discovery (Pre-Planeación Obligatoria)

**Versión:** 1.0  
**Fecha:** 2026-07-30  
**Estado:** Vigente  
**Ubicación:** Este documento es la fuente oficial de FASE 0. Referenciado por `CONVENTIONS.md §5.8-5.9`

---

## Propósito

FASE 0 es la **etapa obligatoria previa a cualquier plan de módulo nuevo**. Su objetivo es asegurar que el equipo entienda completamente:

- El **problema real** que el módulo resuelve
- Los **KPIs/OKRs medibles** del éxito
- Las **reglas de negocio** que el módulo debe cumplir (4 niveles jerárquicos)
- Los **riesgos predecibles** y **flujos críticos**

**Resultado:** Un documento de FASE 0 que alimenta directamente el plan formal de 11 secciones.

---

## Cuándo Aplicar FASE 0

✅ Aplica siempre que:
- Se solicita un módulo nuevo
- Se planea una migración o refactor mayor
- Se propone una característica transversal que afecta múltiples módulos
- Se identifica un riesgo alto en auditoría y requiere plan de remediación

❌ NO aplica cuando:
- Es un bug fix aislado (pequeño)
- Es refactoring local dentro de un módulo existente
- Es actualización de dependencias de mantenimiento

---

## Estructura de FASE 0 (3 Sub-bloques)

### 0.1 Problem Statement + KPIs

**Formato disciplinado del problema:**

```
Actualmente, [ACTOR] sufre de [PROBLEMA] cuando intenta [ACCIÓN],
lo que resulta en [CONSECUENCIA].

Esto afecta a [USUARIOS/PROCESOS] en [ESCALA].
```

**Ejemplo:**

```
Actualmente, Admin sufre de "sin forma centralizada de gestionar accesos QR"
cuando intenta validar visitantes en múltiples puntos de entrada,
lo que resulta en "falta de auditoría y vulnerabilidades de seguridad".

Esto afecta a 5 sucursales con 200+ visitantes/día.
```

**KPIs/OKRs (tabla obligatoria):**

| Métrica | Baseline | Target | Timeline | Verificación |
|:---|:---|:---|:---|:---|
| Tiempo validación | 2 min/visitor | <30 seg | Sprint 1 | Cronómetro en QA |
| Cobertura auditoría | 60% | 100% | Sprint 2 | logs en BD |
| Falsos positivos | 15% | <2% | Sprint 3 | análisis de rechazo |

**Cada KPI debe ser:**
- ✅ Medible (con unidades claras)
- ✅ Con baseline actual (número real, no "bajo")
- ✅ Con target específico (número real, no "mejor")
- ✅ Con timeline (cuando debe lograrse)
- ✅ Con método de verificación (cómo sabemos que se logró)

---

### 0.2 Matriz de Reglas de Negocio (4 Niveles Jerárquicos)

Toda regla se numera `RN-[MOD]-NNN` (ej: `RN-ACC-001`) y se clasifica en 4 niveles:

#### **Nivel 1: Invariantes de Dominio**

Restricciones inmutables. "Nunca pueden ser de otra manera" (incluso si cambian otros requerimientos).

```
RN-ACC-001: "Todo visitante debe tener QR único válido"
  Justificación: Garantía de seguridad, compliance legal
  
RN-ACC-002: "Acceso se revoca automáticamente al expirar validez"
  Justificación: No puede quedar acceso abierto indefinidamente
```

#### **Nivel 2: Flujo y Estados**

Ciclo de vida del sistema, transiciones válidas, orden temporal.

```
RN-ACC-010: "Visitante: PENDING → CHECKED_IN → ACTIVE → CHECKED_OUT"
  Transiciones: Solo en orden cronológico, no se puede saltar
  
RN-ACC-011: "Solo CHECKED_IN puede transicionar a ACTIVE"
  Regla: No se permite PENDING → ACTIVE directamente
```

Incluir diagrama de estados si es complejo:

```
     ┌─────────────┐
     │   PENDING   │
     └─────┬───────┘
           │ (QR validado)
     ┌─────▼────────┐
     │  CHECKED_IN  │
     └─────┬────────┘
           │ (entrada confirmada)
     ┌─────▼───────┐
     │   ACTIVE    │
     └─────┬───────┘
           │ (salida escaneada)
     ┌─────▼─────────┐
     │  CHECKED_OUT  │
     └───────────────┘
```

#### **Nivel 3: Seguridad/Autorización**

RBAC, protección de datos, auditoría, compliance.

**IMPORTANTE:** Todas las reglas de autorización deben usar roles del catálogo oficial.

```
RN-ACC-020: "Solo los siguientes roles pueden GENERAR QR"
  Roles: SuperUsuario, Direccion, Administrador (ver catálogo: application-roles-catalog.md)
  
RN-ACC-021: "Supervisión puede VALIDAR QR, pero no REVOCAR"
  Roles: SupervisionOperativa (validar)
  Restricción: No puede modificar estado de QR generado
  
RN-ACC-022: "Condomino solo ve su propio QR"
  Roles: Condomino (con restricción)
  ABAC: Filtro por customer_id (tenant-aware)
  
RN-ACC-023: "Toda acción de SuperUsuario se audita (7 años)"
  Compliance: GDPR, ley local
  Auditoría: Tabla de logs con timestamp, usuario, acción, IP
```

**Referencias de roles:**
- Ver [Catálogo de Roles](application-roles-catalog.md) para lista completa
- Siempre usar `ApplicationRoleEnum` del sistema (no inventar roles)

#### **Nivel 4: Validación de Datos**

Formatos, límites, constraints de base de datos.

```
RN-ACC-030: "QR expira en 24h (configurable por tenant)"
  Campo: expires_at = NOW() + 24 hours
  
RN-ACC-031: "Email válido según RFC 5322"
  Regex: ^\S+@\S+\.\S+$
  
RN-ACC-032: "Teléfono 10 dígitos, formato +CC-XXXX-XXXX"
  Regex: ^\+\d{2}-\d{4}-\d{4}$
  
RN-ACC-033: "QR code máximo 2KB, PNG/JPEG"
  Validación: File size < 2048, mimetype in [image/png, image/jpeg]
```

---

### 0.3 Riesgos + Pre-Mortem + Flujos Críticos

#### **Pre-Mortem: "¿Qué salió mal?"**

Técnica: "Asumimos que el módulo salió a producción y fue un desastre. ¿Qué lo causó?"

| Supuesto Fallido | Impacto | Probabilidad | Mitigación | Owner |
|:---|:---|:---|:---|:---|
| QRCoder incompatible AOT | Sistema no corre | Media | Testear AOT en Sprint 0 | Backend Lead |
| HMAC key exposure | Breach de datos | Baja | Usar Key Vault + rotación | Security |
| Tabla > 1M rows sin índices | Queries >5s | Alta | Índice (tenant_id, created_at) | DBA |
| Visitante duplicado en BD | Auditoría inconsistente | Media | Unique constraint + dedup | Backend |

#### **Happy Path (Flujo Ideal)**

```
1. Admin genera QR → Sistema crea record + envía email
2. Visitante recibe QR → Guarda en móvil
3. Guard escanea QR → Sistema valida (expiry, tenant, status)
4. Sistema otorga acceso → Auditoría registra
5. Visitante sale → Escanea de salida → Cierra record
```

**Criterio de PASO:** 5 registros de auditoría, sin errores, <100ms por operación.

#### **Sad Path (Error Común)**

```
1. QR expirado → Scan rechazado
2. Guard contacta supervisor → "QR expirado, regenerar"
3. Supervisor genera nuevo QR → Nuevo email al visitante
4. Visitante recibe → Puede entrar con QR nuevo
```

**Criterio de PASO:** Error 401 con mensaje claro, auditoría registra rechazo.

#### **Edge Path (Caso Borde)**

```
1. Guard escanea QR dos veces en <1 segundo → Duplicado
2. Sistema ignora segundo escaneo → Auditoría registra ambos
```

**Criterio de PASO:** Un solo record de entrada, auditoría con timestamp diferente.

---

## Mapeo de FASE 0 → Plan Formal (11 Secciones)

| FASE 0 | Alimenta | Sección Plan | Contenido |
|:---|:---|:---|:---|
| 0.1 Problem + KPIs | → | 1. Resumen Ejecutivo | Copiar literal |
| 0.2 Matriz RN (Nivel 1-4) | → | 3. Arquitectura & Diseño | Mapear cada RN a componente/servicio |
| 0.3 Pre-Mortem | → | 7. Riesgos & Mitigaciones | Convertir cada supuesto a fila de riesgo |
| 0.3 Flujos (Happy/Sad/Edge) | → | 5. Fases Ejecución | Criterios de PASO basados en flujos |

**Regla:** Si una sección del plan **contradice** FASE 0, se rechaza. FASE 0 es la fuente de verdad.

---

## Guía Operativa: Crear FASE 0

### Paso 1: Probleme Statement (20 min)

- Entrevistar al stakeholder principal
- Llenar formato: Actor → Problema → Acción → Consecuencia → Escala
- Validar que sea medible (no "mejorar experiencia", sí "reducir tiempo de X a Y")

### Paso 2: Matriz de Reglas (45 min - 1 hora)

- Listar todas las restricciones/reglas del dominio
- Clasificar cada una en Nivel 1, 2, 3 o 4
- Numerar `RN-MOD-NNN`
- Mapear a entidades de código (backend: archivo:línea, frontend: componente)

### Paso 3: Pre-Mortem + Flujos (45 min)

- Junta de 30 min: "Qué salió mal"
- Documentar en tabla (supuesto, impacto, probabilidad, mitigación, owner)
- Describir 3-5 flujos críticos (happy, sad, edge paths)
- Definir criterio de PASO para cada flujo

### Total: ~2 horas

---

## Checklist Antes de Considerar FASE 0 Completa

- [ ] Problem Statement: formato Actor → Problema → Acción → Consecuencia
- [ ] KPIs: mínimo 3, cada uno con baseline, target, timeline, verificación
- [ ] Reglas de Negocio: mínimo 6 (distribuidas en 4 niveles)
- [ ] Cada RN numerada `RN-MOD-NNN`
- [ ] Cada RN mapeada a ubicación de código (backend/frontend)
- [ ] Pre-Mortem: mínimo 3 supuestos fallidos, cada uno con mitigación
- [ ] 3+ flujos documentados (Happy/Sad/Edge) con criterios de PASO
- [ ] Documento es autoexplicativo (sin referencias "le digo en llamada")
- [ ] Sin placeholders, TODO o contenido incompleto

---

## Errores Comunes (Evitar)

### ❌ Problem Statement Vago

```
MAL:  "Queremos mejorar el acceso de visitantes"
BIEN: "Actualmente el Admin tarda 2 minutos por visitante,
       resultando en colas de entrada. Afecta 200+ visitantes/día."
```

### ❌ KPI sin Verificación

```
MAL:  "Mejorar rendimiento"
BIEN: "Validate QR endpoint: <100ms (p99), verificado en load test"
```

### ❌ Reglas Duplicadas o Varias

```
MAL:  Nivel 1: "QR debe ser válido"
      Nivel 2: "QR debe ser válido"
BIEN: Nivel 1: "Todo visitante tiene QR único"
      Nivel 2: "QR transiciona: PENDING→ACTIVE→CLOSED"
      Nivel 4: "QR expira en 24h"
```

### ❌ Flujos sin Criterio de PASO

```
MAL:  "Happy path: Admin genera QR"
BIEN: "Happy path: Admin genera → Visitante recibe → Guard escanea → Acceso otorgado
       PASS si: 4 registros de auditoría, <100ms por op, email enviado"
```

---

## Referencias Relacionadas

- [Plan Creation Protocol](plan-creation-protocol.md)
- [Plan Agent Instructions](plan-agent-instructions.md)
- [Audit Module Conventions](../audit/audit-module-conventions.md)
- [Discovery Questionnaire Template](discovery-questionnaire-template.md)
- [CONVENTIONS.md - Flujo obligatorio](../CONVENTIONS.md#59-operacion)

---

## Estado de Vigencia

**Última revisión:** 2026-07-30  
**Próxima revisión:** Cada que se integre un nuevo nivel de reglas o cambio a FASE 0  
**Validado por:** Tech Lead

