# CHANGELOG: Integración de Catálogo de Roles en FASE 0 (2026-07-30)

**Fecha:** 2026-07-30  
**Estado:** Vigente  
**Afecta a:** Análisis de módulos (FASE 0), Nivel 3 (Seguridad/Autorización)

---

## Resumen Ejecutivo

Se ha creado un **catálogo oficial de roles** basado en `ApplicationRoleEnum.cs` del sistema. Este catálogo debe ser la **única fuente de verdad** para definir quién puede hacer qué en cualquier módulo nuevo.

**Impacto:**
- ✅ Nivel 3 (Seguridad/RBAC) en FASE 0 siempre usa roles reales (no inventados)
- ✅ Implementadores saben exactamente qué roles usar en código
- ✅ Auditoría verifica que roles usados existen en el catálogo
- ✅ 43 roles documentados, clasificados por tipo (System, Corporate, Staff, Client, Contractor)

---

## Qué Cambió

### 1. Nuevo Documento: `application-roles-catalog.md`

**Ubicación:** `./operations/application-roles-catalog.md`

**Contenido:**
- Catálogo completo de 43 roles del sistema
- Clasificados por tipo: System (2), Corporate (8), Staff (25), Client (2), Contractor (4)
- Para cada rol: Código Enum, Display Name, Descripción, Departamento, RoleType
- Matriz de consulta rápida: ¿Quién puede VER? ¿Quién puede CREAR? ¿Quién puede ELIMINAR?
- Template de Nivel 3 (Seguridad/RBAC) con ejemplos reales
- Checklist para validación en código
- Cómo agregar un nuevo rol (proceso formal)

**Lectura obligatoria:** Cuando se defina Nivel 3 de cualquier FASE 0

---

### 2. Actualización: `fase-0-business-rules-discovery.md`

**Sección:** Nivel 3 - Seguridad/Autorización

**Cambio:** Agregué referencias a catálogo y ejemplos usando roles reales:

**Antes:**
```
RN-ACC-020: "Solo Admin/Manager pueden GENERAR QR"
  Roles: Admin (todos), Manager (su zona)
  (❌ Roles vagos, no reales)
```

**Después:**
```
RN-ACC-020: "Solo los siguientes roles pueden GENERAR QR"
  Roles: SuperUsuario, Direccion, Administrador
  (✅ Roles del catálogo, verificables)
  
Referencia: ver [Catálogo de Roles](operations/application-roles-catalog.md)
```

---

### 3. Actualización: `CONVENTIONS.md §5.9`

**Cambio:** Agregué el Catálogo de Roles a referencias obligatorias:

```
- [Application Roles Catalog](./operations/application-roles-catalog.md) 
  — **roles reales que usar en Nivel 3 (Seguridad/RBAC)**
```

**Posición:** Entre FASE 0 y Plan Creation Protocol (señal de prioridad)

---

## Roles Documentados (43 Total)

### Por Categoría

| Categoría | Cantidad | Ejemplos |
|:---|:---|:---|
| 🌟 System | 2 | SuperUsuario, Dirección |
| 🏢 Corporate | 8 | Legal, RecursosHumanos, Sistemas General |
| 👷 Staff/Operativos | 25 | Administrador, Contador, Cobranza, Recepcionista, Seguridad Interna |
| 🏘️ Clientes | 2 | Condómino, Comité |
| 🛠️ Proveedores | 4 | Jardinería, Limpieza, Seguridad, Proveedor |

### Por Departamento

- **Dirección:** SuperUsuario, Dirección
- **Legal:** Legal, Coordinación Legal
- **Recursos Humanos:** RecursosHumanos, Reclutamiento
- **Sistemas:** SistemasGeneral, Sistemas
- **Contabilidad:** Contador, Cobranza
- **Operaciones:** Administrador, Gerente Operaciones, Recepcionista, Concierge, etc.
- **Seguridad:** Jefe Seguridad Interna, Seguridad Interna, Monitorista
- **Mantenimiento:** Gerente Mantenimiento, Jefe Mantenimiento, Técnico Mantenimiento

---

## Cómo Usar en FASE 0

### Template de Nivel 3 (Seguridad/RBAC)

Cuando definas seguridad en FASE 0:

```markdown
## Nivel 3: Seguridad/Autorización

### Permisos de Lectura (VER)

RN-MOD-020: "Ver saldos"
  Roles: SuperUsuario, Direccion, Contador, Cobranza, Condomino
  Restricción: Condomino solo ve su propio saldo
  [Referencia: application-roles-catalog.md]

### Permisos de Escritura (CREAR)

RN-MOD-021: "Crear pago"
  Roles: SuperUsuario, Contador, Cobranza
  Restricción: Máximo $1M por transacción
  Auditoría: Log de quién, cuándo, monto
  [Referencia: application-roles-catalog.md]

### Permisos de Eliminación (ANULAR)

RN-MOD-022: "Anular pago"
  Roles: SuperUsuario (sin límite), Contador (últimas 24h)
  Restricción: Requiere justificación, firma digital
  [Referencia: application-roles-catalog.md]
```

### Checklist para FASE 0

- [ ] Cada rol en Nivel 3 existe en `application-roles-catalog.md`
- [ ] Roles Sistema tienen restricciones de auditoría
- [ ] Roles Cliente/Condomino tienen restricción "solo datos propios"
- [ ] Cada RN Nivel 3 tiene al menos un rol permitido
- [ ] Cada RN Nivel 3 documenta excepciones (SuperUsuario override)

---

## Cómo Usar en Implementación

### Backend (.NET)

```csharp
// ✅ BIEN: Usar ApplicationRoleEnum del catálogo
using LuxuryApp.Application.Shared.Enums;

[Authorize(Roles = nameof(ApplicationRoleEnum.Contador))]
public IActionResult ViewLedger() { }

// Verificar rol múltiple
if (user.IsInRole(ApplicationRoleEnum.SuperUsuario.ToString()) ||
    user.IsInRole(ApplicationRoleEnum.Direccion.ToString()))
{
    // Admin access
}

// ❌ MAL: No usar strings mágicos
[Authorize(Roles = "Admin")]  // ¿Existe este rol?
public IActionResult AdminPanel() { }
```

### Frontend (Angular)

```typescript
// ✅ BIEN: Usar constante del catálogo
const ALLOWED_ROLES = ['Contador', 'SuperUsuario'];
if (currentUser.roles.some(r => ALLOWED_ROLES.includes(r))) {
  // Show accounting dashboard
}

// ❌ MAL: Strings sin verificación
if (currentUser.role === 'Gerente') {
  // ¿Qué tipo de gerente? ¿Existe?
}
```

---

## Checklist para Auditoría

Cuando audites un módulo y verifiques Nivel 3:

- [ ] Cada rol usado en código existe en `ApplicationRoleEnum`
- [ ] No hay roles "inventados" (strings que no están en catálogo)
- [ ] La lógica de autorización coincide con RN-MOD-NNN de FASE 0
- [ ] Restricciones documentadas en código (comentarios)
- [ ] Roles Sistema/Ejecutivo están auditados en logs
- [ ] Roles Cliente/Condomino tienen filtro tenant-aware
- [ ] Nada usa roles heredados o deprecated

---

## Flujo Garantizado

```
FASE 0 - Nivel 3 Seguridad
  ↓
Agente consulta application-roles-catalog.md
  ↓
Define RN-MOD-NNN con roles reales
  ↓ (Ejemplos: SuperUsuario, Contador, Condomino, etc.)
  ↓
Plan Formal - Sección 3 Arquitectura
  ↓
Especifica roles en código (backend + frontend)
  ↓
Implementación
  ↓
Importa ApplicationRoleEnum
Usa roles en atributos [Authorize]
  ↓
Auditoría
  ↓
Verifica cada RN Nivel 3 está en código con rol correcto
  ↓
✅ APROBADO (Seguridad verificable)
```

---

## Cómo Agregar un Nuevo Rol

Si un módulo necesita un rol que no existe:

### Paso 1: NO lo inventes en FASE 0

```markdown
❌ MAL:
RN-MOD-020: "Solo RoleX pueden..."
  (RoleX no existe en ApplicationRoleEnum)
```

### Paso 2: Propón el rol formalmente

```markdown
✅ BIEN:
Propuesta de Nuevo Rol: "JefeRecepcion"
- Descripción: Jefe de recepcionistas y portería
- Departamento: Operaciones
- Permisos base: Ver asistencias, crear reportes
- Razón: Necesario para automatizar handoff de turnos
```

### Paso 3: Espera aprobación del Tech Lead

Tech Lead valida:
- ¿Es necesario o existe rol similar?
- ¿Interfiere con rol existente?
- ¿Afecta otros módulos?

### Paso 4: Implementación formal

1. Agregar a `ApplicationRoleEnum.cs`
2. Actualizar `ApplicationRoleAppService.cs` (CreateRoles)
3. Actualizar este catálogo
4. Comunicar a todos los agentes

---

## Ejemplo Real: Módulo Cobranza

### FASE 0 - Nivel 3

```markdown
RN-COB-020: "Ver saldos pendientes"
  Roles: SuperUsuario, Direccion, Contador, Cobranza, Condomino
  Restricción: Condomino solo ve su propio saldo
  
RN-COB-021: "Crear pago"
  Roles: SuperUsuario, Contador, Cobranza
  Auditoría: Log completo (usuario, monto, fecha, IP)
  
RN-COB-022: "Anular pago"
  Roles: SuperUsuario (sin límite), Contador (máx 5 anuaciones/mes)
  Justificación: Requerida (texto >10 caracteres)
  
RN-COB-023: "Exportar reportes"
  Roles: SuperUsuario, Direccion, Contador, GerenteOperaciones
  Restricción: Datos sensibles (tarjetas) no se incluyen
```

### Implementación Backend

```csharp
// ✅ Validar roles contra catálogo (ApplicationRoleEnum)
[Authorize(Roles = nameof(ApplicationRoleEnum.Contador))]
public IActionResult ViewLedger() { /* ... */ }

[Authorize(Roles = "SuperUsuario,Contador,Cobranza")]
public IActionResult CreatePayment([FromBody] PaymentDTO dto) { /* ... */ }

// ✅ Registrar auditoría
var auditLog = new AuditLog
{
    RoleUsed = user.Role,  // Enum → string
    Action = "CreatePayment",
    UserId = user.Id,
    Timestamp = DateTime.UtcNow,
    Details = $"Monto: {dto.Amount}"
};
```

### Auditoría

```
Verificar:
✅ RN-COB-020 → Roles verificados en código
✅ RN-COB-021 → Roles verificados en código
✅ RN-COB-022 → Roles verificados en código
✅ RN-COB-023 → Roles verificados en código
✅ Auditoría: Tabla de logs tiene usuario, rol, acción
✅ Restricción Condomino: Código filtra por customer_id
✅ Ningún rol inventado
```

---

## Control de Cambios

| Versión | Fecha | Cambio |
|:---|:---|:---|
| 1.0 | 2026-07-30 | Creación: catálogo + integración FASE 0 |

---

## Proximas Acciones

### Para Agentes

- [ ] Lee `application-roles-catalog.md` (30 min)
- [ ] Lee FASE 0 sección Nivel 3 actualizada (10 min)
- [ ] En próximo FASE 0, usa roles del catálogo en Nivel 3

### Para Tech Lead

- [ ] Valida que el catálogo está completo (43 roles)
- [ ] Aprueba como fuente oficial de roles
- [ ] Comunica a equipo de desarrollo

### Futuro

- Si se agrega nuevo rol → actualizar catálogo + FASE 0 template
- Si rol se depreca → marcar como "legacy" en catálogo
- Si rol cambia permisos → actualizar FASE 0 ejemplos

---

## Referencias

- [Application Roles Catalog](../operations/application-roles-catalog.md)
- [FASE 0: Business Rules Discovery](../operations/fase-0-business-rules-discovery.md#nivel-3-seguridadautorizaci%C3%B3n)
- [ApplicationRoleEnum.cs](../api/LuxuryApp.Application/Shared/Enums/ApplicationRoleEnum.cs)
- [ApplicationRoleAppService.cs](../api/LuxuryApp.Application/Modules/AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/Service/ApplicationRoleAppService.cs)
- [CONVENTIONS.md](CONVENTIONS.md)

---

*Documento: changelog-application-roles-integration.md*  
*Versión: 1.0*  
*Próxima revisión: Cuando se agregue un nuevo rol al sistema*

